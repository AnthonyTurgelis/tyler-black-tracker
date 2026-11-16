-- Protect price evidence even when an older browser still uses an unconditional
-- KV upsert. Explicit deletion/restore events remain authoritative.
create or replace function public.tb_price_evidence_identity(entry jsonb)
returns text
language sql
immutable
strict
security invoker
set search_path = ''
as $function$
  select case when coalesce(entry->>'observationKey', '') <> ''
    then entry->>'observationKey'
    else 'legacy:[' || array_to_string(array[
      to_jsonb(coalesce(nullif(entry->>'date',''), entry->>'observedAt',''))::text,
      to_jsonb(coalesce(entry->>'source',''))::text,
      to_jsonb(coalesce(nullif(entry->>'itemId',''), entry->>'itemUrl',''))::text,
      coalesce(entry->'price','null'::jsonb)::text,
      to_jsonb(coalesce(entry->>'currency',''))::text,
      to_jsonb(coalesce(nullif(entry->>'kind',''), entry->>'type',''))::text,
      to_jsonb(coalesce(entry->>'priceBasis',''))::text,
      to_jsonb(coalesce(entry->>'condition',''))::text,
      to_jsonb(coalesce(entry->>'grading',''))::text,
      '[' || coalesce((select string_agg(to_jsonb(title)::text, ',' order by title collate "C")
        from (select case when jsonb_typeof(value) = 'string' then value#>>'{}' else value::text end as title
          from jsonb_array_elements(case when jsonb_typeof(entry->'titles') = 'array' then entry->'titles' else '[]'::jsonb end)) titles), '') || ']'
    ], ',') || ']'
  end;
$function$;

create or replace function public.tb_merge_price_evidence(previous_history jsonb, incoming_history jsonb)
returns jsonb
language sql
immutable
security invoker
set search_path = ''
as $function$
  with histories as (
    select 0 as side, case when jsonb_typeof(previous_history) = 'object' then previous_history else '{}'::jsonb end as history
    union all
    select 1, case when jsonb_typeof(incoming_history) = 'object' then incoming_history else '{}'::jsonb end
  ), event_candidates as (
    select h.side, s.key as series, e.key as identity, e.value as event
    from histories h
    cross join lateral jsonb_each(case when jsonb_typeof(h.history#>'{__historyMeta,events}') = 'object'
      then h.history#>'{__historyMeta,events}' else '{}'::jsonb end) s
    cross join lateral jsonb_each(case when jsonb_typeof(s.value) = 'object' then s.value else '{}'::jsonb end) e
    where jsonb_typeof(e.value) = 'object'
  ), events as (
    select distinct on (series,identity) series,identity,event
    from event_candidates
    order by series,identity,coalesce(event->>'updatedAt','') desc,side desc
  ), candidates as (
    select h.side, s.key as series, e.ordinality as ordinal, e.value as entry,
      public.tb_price_evidence_identity(e.value) as identity,
      coalesce(nullif(e.value->>'updatedAt',''),nullif(e.value->>'lastSeenAt',''),
        nullif(e.value->>'observedAt',''),e.value->>'date','') as stamp
    from histories h
    cross join lateral jsonb_each(h.history) s
    cross join lateral jsonb_array_elements(case when jsonb_typeof(s.value) = 'array' then s.value else '[]'::jsonb end) with ordinality e
    where s.key <> '__historyMeta' and jsonb_typeof(e.value) = 'object'
  ), chosen as (
    select distinct on (series,identity) series,identity,entry,side,ordinal
    from candidates
    order by series,identity,stamp desc,side desc,ordinal desc
  ), retained as (
    select c.* from chosen c
    left join events e on e.series=c.series and e.identity=c.identity
    where coalesce(e.event->'deleted','false'::jsonb) <> 'true'::jsonb
  ), series_rows as (
    select series,jsonb_agg(entry order by side,ordinal,identity) as entries
    from retained group by series
  ), event_series as (
    select series,jsonb_object_agg(identity,event) as event_values from events group by series
  )
  select coalesce((select jsonb_object_agg(series,entries) from series_rows),'{}'::jsonb)
    || case when exists(select 1 from event_series)
      then jsonb_build_object('__historyMeta',jsonb_build_object('version',1,'events',
        (select jsonb_object_agg(series,event_values) from event_series)))
      else '{}'::jsonb end;
$function$;

create or replace function public.merge_collection_price_evidence()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $function$
begin
  if new.key = 'tb-price-history-v1' and old.key = new.key then
    if jsonb_typeof(new.value) <> 'object' then
      raise exception 'Price history must be an object; refresh the tracker before saving.';
    end if;
    new.value := public.tb_merge_price_evidence(old.value,new.value);
  end if;
  return new;
end;
$function$;

revoke all on function public.tb_price_evidence_identity(jsonb) from public,anon;
revoke all on function public.tb_merge_price_evidence(jsonb,jsonb) from public,anon;
revoke all on function public.merge_collection_price_evidence() from public,anon;
grant execute on function public.tb_price_evidence_identity(jsonb) to authenticated,service_role;
grant execute on function public.tb_merge_price_evidence(jsonb,jsonb) to authenticated,service_role;

create trigger collection_kv_price_evidence_merge
before update of value on public.collection_kv
for each row
when (old.key = 'tb-price-history-v1')
execute function public.merge_collection_price_evidence();
