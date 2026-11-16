alter table public.tb_collection_activity add column if not exists source_key text;
create or replace function private.tb_audit_catalog_media_price()
returns trigger language plpgsql security definer set search_path=''
as $fn$
declare
  the_owner uuid;
  old_json jsonb := '{}'::jsonb;
  current jsonb := new.value;
  prev_card jsonb;
  card jsonb;
  k text;
  old_count int;
  new_count int;
  old_text text;
  new_text text;
  f text;
  actor_name text := case when auth.uid() is null then 'Backend' else 'Site' end;
begin
  if new.key not in ('tb-custom-cards-v1','tb-catalog-meta-v1','tb-card-media-v1','tb-price-history-v1')
  then return new; end if;
  if tg_op = 'UPDATE' then old_json := old.value; end if;
  if tg_op = 'UPDATE' and old_json is not distinct from current then return new; end if;
  select owner_id into the_owner from public.collection_private_kv
    where key='tb-copy-inventory-v1' order by updated_at desc limit 1;
  if the_owner is null then return new; end if;

  if new.key = 'tb-custom-cards-v1' then
    for card in select value from jsonb_array_elements(
       case when jsonb_typeof(current)='array' then current else '[]'::jsonb end
    ) c(value) loop
      k := card->>'id';
      if k is null or k !~ '^[0-9]+$' then continue; end if;
      select c.value into prev_card from jsonb_array_elements(
        case when jsonb_typeof(old_json)='array' then old_json else '[]'::jsonb end
      ) c(value) where c.value->>'id'=k limit 1;
      if prev_card is null then
        insert into public.tb_collection_activity(owner_id,card_id,category,field,old_value,new_value,actor,source_ref,evidence_note,evidence_level)
        values(the_owner,k::bigint,'catalog','Card added',null,
          left(coalesce(card->>'product','') || ' · #' || coalesce(card->>'cardNumber','') || ' · ' || coalesce(card->>'cardSet',''),200),
          actor_name,card->>'sourceUrl','Catalogue record added; does not confirm physical ownership.','catalogued');
      else
        foreach f in array array['cardSet','copies','issueType','signature','verification','archived'] loop
          old_text := prev_card->>f;
          new_text := card->>f;
          if old_text is distinct from new_text then
            insert into public.tb_collection_activity(owner_id,card_id,category,field,old_value,new_value,actor,source_ref,evidence_note,evidence_level)
            values(the_owner,k::bigint,'catalog',f,left(old_text,170),left(new_text,170),
              actor_name,card->>'sourceUrl','Catalogue metadata adjustment; does not confirm a physical copy.','catalogued');
          end if;
        end loop;
      end if;
    end loop;
  elsif new.key = 'tb-catalog-meta-v1' then
    for k,card in select key,value from jsonb_each(
      case when jsonb_typeof(current)='object' then current else '{}'::jsonb end
    ) loop
      if k !~ '^[0-9]+$' then continue; end if;
      if (old_json->k) is distinct from card then
        insert into public.tb_collection_activity(owner_id,card_id,category,field,old_value,new_value,actor,evidence_level)
        values(the_owner,k::bigint,'catalog','Catalogue note',
          case when old_json->k is null then null else 'Previous note' end,'Updated',actor_name,'metadata');
      end if;
    end loop;
  elsif new.key='tb-card-media-v1' then
    for k,card in select key,value from jsonb_each(coalesce(current->'cards','{}'::jsonb)) loop
      if k !~ '^[0-9]+$' then continue; end if;
      prev_card := old_json->'cards'->k;
      if card is not distinct from prev_card then continue; end if;
      new_count := case when jsonb_typeof(card->'photos')='array' then jsonb_array_length(card->'photos') else 0 end;
      old_count := case when jsonb_typeof(prev_card->'photos')='array' then jsonb_array_length(prev_card->'photos') else 0 end;
      insert into public.tb_collection_activity(owner_id,card_id,category,field,old_value,new_value,actor,source_ref,evidence_note,evidence_level)
      values(the_owner,k::bigint,'photo','Reference photos',
        case when prev_card is null then null else old_count::text end,
        new_count::text,actor_name,card#>>'{photos,0,sourceUrl}',
        'Photo references only. Images are not proof that you own a particular physical copy.',
        'reference');
    end loop;
  elsif new.key='tb-price-history-v1' then
    for k,card in select key,value from jsonb_each(current) loop
      if (old_json->k) is not distinct from card then continue; end if;
      new_count := case when jsonb_typeof(card)='array' then jsonb_array_length(card) else 0 end;
      prev_card := old_json->k;
      old_count := case when jsonb_typeof(prev_card)='array' then jsonb_array_length(prev_card) else 0 end;
      insert into public.tb_collection_activity(owner_id,card_id,category,field,old_value,new_value,actor,evidence_note,evidence_level,source_key)
      values(the_owner,0,'price','Price observations',
        case when prev_card is null then null else old_count::text end,new_count::text,
        actor_name,'Recorded market-series observations; not an owned-copy price or confirmed sale.',
        'market',k);
    end loop;
  end if;
  return new;
end
$fn$;

create or replace function private.tb_audit_observation_changes()
returns trigger language plpgsql security definer set search_path=''
as $fn$
declare
  k text;
  v jsonb;
  previous jsonb;
  cid text;
  actor_name text := case when auth.uid() is null then 'Backend' else 'Site' end;
  label text;
  state_label text;
  source_link text;
begin
  if new.key<>'tb-copy-inventory-v1' then return new; end if;
  if old.value->'observations' is not distinct from new.value->'observations' then return new; end if;
  for k,v in select key,value from jsonb_each(coalesce(new.value->'observations','{}'::jsonb))
  loop
    previous := old.value->'observations'->k;
    if previous is not distinct from v then continue; end if;
    cid := v->>'cardId';
    if cid is null or cid !~ '^[0-9]+$' then cid := '0'; end if;
    label := case when lower(v->>'source')='comc' then 'COMC scan' else 'eBay purchase' end;
    state_label := case when v->>'matchedCopyId' is not null and v->>'matchedCopyId'<>''
      then 'Matched to existing copy' when v->>'disposition'='split' then 'Split for review'
      else 'Awaiting review' end;
    source_link := v->>'sourceUrl';
    insert into public.tb_collection_activity(owner_id,card_id,category,field,old_value,new_value,actor,copy_id,source_ref,evidence_note,evidence_level,source_key)
    values(new.owner_id,cid::bigint,'source',label,
      case when previous is null then null else coalesce(previous->>'disposition','Recorded') end,
      state_label,actor_name,k,source_link,
      'Source record only. Not a new physical copy or automatic ownership confirmation.',
      'source',v->>'title');
  end loop;
  return new;
end
$fn$;

revoke all on function private.tb_audit_catalog_media_price() from public,anon,authenticated;
revoke all on function private.tb_audit_observation_changes() from public,anon,authenticated;
