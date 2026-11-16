-- Follow-up to preserve_price_history_evidence. Keep the existing trigger and
-- its single-key scope. These pure helpers match the browser's graded legacy
-- identities and preserve complementary evidence on a duplicate observation.

create or replace function public.tb_price_utf16_sort_key(value text)
returns text
language plpgsql immutable strict security invoker
set search_path = ''
as $function$
declare result text := ''; point integer; position integer;
begin
  -- JSON.stringify/Object.keys.sort use UTF-16 order. The fast path covers
  -- ordinary grading field names and listing titles without a character loop.
  if value ~ '^[ -~]*$' then
    return regexp_replace(encode(convert_to(value,'UTF8'),'hex'),'(..)','00\1','g');
  end if;
  for position in 1..char_length(value) loop
    point := ascii(substr(value,position,1));
    if point <= 65535 then result := result || lpad(to_hex(point),4,'0');
    else
      point := point - 65536;
      result := result || lpad(to_hex(55296 + (point / 1024)),4,'0') || lpad(to_hex(56320 + (point % 1024)),4,'0');
    end if;
  end loop;
  return result;
end;
$function$;

create or replace function public.tb_price_canonical_json(value jsonb)
returns text
language plpgsql immutable security invoker
set search_path = ''
set extra_float_digits = 1
as $function$
declare kind text := jsonb_typeof(value); result text; number_value double precision;
begin
  if value is null or kind = 'null' then return 'null'; end if;
  if kind = 'object' then
    select '{' || coalesce(string_agg(to_jsonb(key)::text || ':' || public.tb_price_canonical_json(v),','
      order by public.tb_price_utf16_sort_key(key) collate "C"),'') || '}' into result from jsonb_each(value) e(key,v);
    return result;
  elsif kind = 'array' then
    select '[' || coalesce(string_agg(public.tb_price_canonical_json(v),',' order by ordinal),'') || ']' into result
      from jsonb_array_elements(value) with ordinality e(v,ordinal);
    return result;
  elsif kind = 'number' then
    -- Browser JSON numbers are IEEE doubles. Normalize exponent padding and
    -- the fixed/exponent boundary used by JSON.stringify, including 1.0 -> 1.
    begin number_value := (value#>>'{}')::double precision;
    exception when numeric_value_out_of_range then return 'null'; end;
    if number_value = 0 then return '0'; end if;
    result := number_value::text;
    if abs(number_value) >= 0.000001 and abs(number_value) < 1e21 then return trim_scale(result::numeric)::text; end if;
    return regexp_replace(result,'e([+-])0+','e\1');
  end if;
  return value::text;
end;
$function$;

create or replace function public.tb_price_normalize_identity(value text)
returns text
language plpgsql immutable strict security invoker
set search_path = ''
as $function$
declare parts jsonb;
begin
  if left(value,7) <> 'legacy:' then return value; end if;
  begin parts := substr(value,8)::jsonb;
  exception when invalid_text_representation then return value; end;
  if jsonb_typeof(parts) = 'array' and jsonb_array_length(parts) = 10 then
    return 'legacy:' || public.tb_price_canonical_json(parts);
  end if;
  return value;
end;
$function$;

create or replace function public.tb_price_evidence_identity(entry jsonb)
returns text
language sql immutable strict security invoker
set search_path = ''
as $function$
  select case when coalesce(entry->>'observationKey','') <> '' then entry->>'observationKey'
  else 'legacy:[' || array_to_string(array[
    to_jsonb(coalesce(nullif(entry->>'date',''),entry->>'observedAt',''))::text,
    to_jsonb(coalesce(entry->>'source',''))::text,
    to_jsonb(coalesce(nullif(entry->>'itemId',''),entry->>'itemUrl',''))::text,
    public.tb_price_canonical_json(entry->'price'),
    to_jsonb(coalesce(entry->>'currency',''))::text,
    to_jsonb(coalesce(nullif(entry->>'kind',''),entry->>'type',''))::text,
    to_jsonb(coalesce(entry->>'priceBasis',''))::text,
    to_jsonb(coalesce(entry->>'condition',''))::text,
    public.tb_price_canonical_json(case when entry->'grading' is null or entry->'grading' in ('null'::jsonb,'false'::jsonb,'0'::jsonb) then '""'::jsonb else entry->'grading' end),
    '[' || coalesce((select string_agg(to_jsonb(title)::text,',' order by public.tb_price_utf16_sort_key(title) collate "C")
      from (select case when jsonb_typeof(value) = 'string' then value#>>'{}' else value::text end as title
        from jsonb_array_elements(case when jsonb_typeof(entry->'titles') = 'array' then entry->'titles' else '[]'::jsonb end)) titles),'') || ']'
  ],',') || ']' end;
$function$;

create or replace function public.tb_price_epoch_ms(value text)
returns bigint
language plpgsql immutable security invoker
set search_path = ''
set timezone = 'UTC'
set datestyle = 'ISO, YMD'
as $function$
declare parsed timestamp with time zone; milliseconds numeric;
begin
  -- All stored price timestamps use ISO dates or ISO timestamps. Interpret
  -- date-only values at UTC and compare instants, not offset-bearing text.
  if value is null or value !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}([Tt ][0-9]{2}:[0-9]{2}(:[0-9]{2}(\.[0-9]+)?)?([Zz]|[+-][0-9]{2}:?[0-9]{2})?)?$' then return 0; end if;
  -- Date.parse discards fractional digits beyond milliseconds; PostgreSQL
  -- otherwise rounds them at microsecond precision.
  value := regexp_replace(value,'(\.[0-9]{3})[0-9]+','\1');
  begin parsed := value::timestamp with time zone;
  exception when invalid_datetime_format or datetime_field_overflow then return 0; end;
  milliseconds := floor(extract(epoch from parsed) * 1000);
  if abs(milliseconds) > 8640000000000000 then return 0; end if;
  return milliseconds::bigint;
end;
$function$;

create or replace function public.tb_price_combine_entries(entries jsonb)
returns jsonb
language plpgsql immutable security invoker
set search_path = ''
as $function$
declare
  result jsonb; incoming jsonb; previous jsonb; newer jsonb; older jsonb; field record; name text;
  previous_at bigint; incoming_at bigint; first_values jsonb; second_values jsonb; union_values jsonb;
begin
  for incoming in select value from jsonb_array_elements(entries) loop
    if result is null then result := incoming; continue; end if;
    if result = incoming then continue; end if;
    previous := result;
    previous_at := public.tb_price_epoch_ms(coalesce(nullif(previous->>'updatedAt',''),nullif(previous->>'lastSeenAt',''),nullif(previous->>'observedAt',''),previous->>'date'));
    incoming_at := public.tb_price_epoch_ms(coalesce(nullif(incoming->>'updatedAt',''),nullif(incoming->>'lastSeenAt',''),nullif(incoming->>'observedAt',''),incoming->>'date'));
    if incoming_at >= previous_at then newer := incoming; older := previous;
    else newer := previous; older := incoming; end if;
    result := older;
    for field in select key,value from jsonb_each(newer) loop
      if field.value not in ('null'::jsonb,'""'::jsonb) or result->field.key is null or result->field.key = 'null'::jsonb then
        result := jsonb_set(result,array[field.key],field.value,true);
      end if;
    end loop;
    foreach name in array array['titles','notes'] loop
      if jsonb_typeof(previous->name) = 'array' or jsonb_typeof(incoming->name) = 'array' then
        first_values := case when jsonb_typeof(previous->name) = 'array' then previous->name
          when previous->name is null or previous->name in ('null'::jsonb,'false'::jsonb,'0'::jsonb,'""'::jsonb) then '[]'::jsonb else jsonb_build_array(previous->name) end;
        second_values := case when jsonb_typeof(incoming->name) = 'array' then incoming->name
          when incoming->name is null or incoming->name in ('null'::jsonb,'false'::jsonb,'0'::jsonb,'""'::jsonb) then '[]'::jsonb else jsonb_build_array(incoming->name) end;
        select coalesce(jsonb_agg(value order by first_ordinal),'[]'::jsonb) into union_values from
          (select value,min(ordinal) as first_ordinal from jsonb_array_elements(first_values || second_values) with ordinality e(value,ordinal) group by value) distinct_values;
        result := jsonb_set(result,array[name],union_values,true);
      end if;
    end loop;
  end loop;
  return result;
end;
$function$;

create or replace function public.tb_merge_price_evidence(previous_history jsonb,incoming_history jsonb)
returns jsonb
language sql immutable security invoker
set search_path = ''
as $function$
  with histories as (
    select 0 as side,case when jsonb_typeof(previous_history) = 'object' then previous_history else '{}'::jsonb end as history
    union all select 1,case when jsonb_typeof(incoming_history) = 'object' then incoming_history else '{}'::jsonb end
  ), event_candidates as (
    select h.side,s.key as series,public.tb_price_normalize_identity(e.key) as identity,e.value as event
    from histories h
    cross join lateral jsonb_each(case when jsonb_typeof(h.history#>'{__historyMeta,events}') = 'object' then h.history#>'{__historyMeta,events}' else '{}'::jsonb end) s
    cross join lateral jsonb_each(case when jsonb_typeof(s.value) = 'object' then s.value else '{}'::jsonb end) e
    where jsonb_typeof(e.value) = 'object'
  ), events as (
    select distinct on (series,identity) series,identity,event from event_candidates
    order by series,identity,public.tb_price_epoch_ms(event->>'updatedAt') desc,
      coalesce(event->'deleted' = 'true'::jsonb,false) desc,side desc
  ), candidates as (
    select h.side,s.key as series,e.ordinality as ordinal,e.value as entry,public.tb_price_evidence_identity(e.value) as identity
    from histories h cross join lateral jsonb_each(h.history) s
    cross join lateral jsonb_array_elements(case when jsonb_typeof(s.value) = 'array' then s.value else '[]'::jsonb end) with ordinality e
    where s.key <> '__historyMeta' and jsonb_typeof(e.value) = 'object'
  ), combined as (
    select series,identity,public.tb_price_combine_entries(jsonb_agg(entry order by side,ordinal)) as entry,
      min(side) as first_side,coalesce(min(ordinal) filter (where side = 0),min(ordinal)) as first_ordinal
    from candidates group by series,identity
  ), retained as (
    select c.* from combined c left join events e on e.series=c.series and e.identity=c.identity
    where coalesce(e.event->'deleted','false'::jsonb) <> 'true'::jsonb
  ), series_rows as (
    select series,jsonb_agg(entry order by first_side,first_ordinal,identity) as entries from retained group by series
  ), event_series as (
    select series,jsonb_object_agg(identity,event) as event_values from events group by series
  )
  select coalesce((select jsonb_object_agg(series,entries) from series_rows),'{}'::jsonb)
    || case when exists(select 1 from event_series) then jsonb_build_object('__historyMeta',jsonb_build_object('version',1,'events',
      (select jsonb_object_agg(series,event_values) from event_series))) else '{}'::jsonb end;
$function$;

revoke all on function public.tb_price_utf16_sort_key(text),public.tb_price_canonical_json(jsonb),public.tb_price_normalize_identity(text),public.tb_price_epoch_ms(text),public.tb_price_combine_entries(jsonb) from public,anon;
grant execute on function public.tb_price_utf16_sort_key(text),public.tb_price_canonical_json(jsonb),public.tb_price_normalize_identity(text),public.tb_price_epoch_ms(text),public.tb_price_combine_entries(jsonb) to authenticated,service_role;
