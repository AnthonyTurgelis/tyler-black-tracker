
-- Owner-only, append-only card change log. Captures site and direct backend writes.
create schema if not exists private;
create table if not exists public.tb_collection_activity (
  id bigint generated always as identity primary key,
  owner_id uuid not null,
  changed_at timestamptz not null default clock_timestamp(),
  card_id bigint not null,
  category text not null,
  field text not null,
  old_value text,
  new_value text,
  actor text not null,
  copy_id text
);
create index if not exists tb_collection_activity_owner_recent on public.tb_collection_activity(owner_id,id desc);
alter table public.tb_collection_activity enable row level security;
revoke all on public.tb_collection_activity from anon, authenticated;
grant select on public.tb_collection_activity to authenticated;
drop policy if exists tb_collection_activity_read_own on public.tb_collection_activity;
create policy tb_collection_activity_read_own on public.tb_collection_activity
  for select to authenticated using ((select auth.uid())=owner_id);

create or replace function private.tb_audit_shared_change()
returns trigger language plpgsql security definer set search_path=''
as $body$
declare
  owner uuid;
  cid text;
  fld text;
  prior text;
  next_value text;
  actor_name text := case when auth.uid() is null then 'Backend' else 'Site' end;
begin
  if NEW.key <> 'tb-alldata-v1' then return NEW; end if;
  if OLD.value->'statuses' is not distinct from NEW.value->'statuses'
     and OLD.value->'details' is not distinct from NEW.value->'details'
     and OLD.value->'forsale' is not distinct from NEW.value->'forsale'
  then return NEW; end if;
  select p.owner_id into owner from public.collection_private_kv p
    where p.key='tb-copy-inventory-v1' order by p.updated_at desc limit 1;
  if owner is null then return NEW; end if;
  for cid in
    select distinct key from (
      select jsonb_object_keys(coalesce(OLD.value->'statuses','{}'::jsonb)) key
      union all select jsonb_object_keys(coalesce(NEW.value->'statuses','{}'::jsonb))
      union all select jsonb_object_keys(coalesce(OLD.value->'details','{}'::jsonb))
      union all select jsonb_object_keys(coalesce(NEW.value->'details','{}'::jsonb))
      union all select jsonb_object_keys(coalesce(OLD.value->'forsale','{}'::jsonb))
      union all select jsonb_object_keys(coalesce(NEW.value->'forsale','{}'::jsonb))
    ) keys
  loop
    if cid !~ '^[0-9]+$' then continue; end if;
    prior := OLD.value->'statuses'->>cid;
    next_value := NEW.value->'statuses'->>cid;
    if prior is distinct from next_value then
      insert into public.tb_collection_activity(owner_id,card_id,category,field,old_value,new_value,actor)
      values(owner,cid::bigint,'status','Status',prior,next_value,actor_name);
    end if;
    foreach fld in array array['qty','serial','price','date','notes'] loop
      prior := OLD.value->'details'->cid->>fld;
      next_value := NEW.value->'details'->cid->>fld;
      if prior is distinct from next_value then
        insert into public.tb_collection_activity(owner_id,card_id,category,field,old_value,new_value,actor)
        values(owner,cid::bigint,case when fld='qty' then 'qty' else 'detail' end,
          case when fld='qty' then 'Qty' else initcap(fld) end,prior,next_value,actor_name);
      end if;
    end loop;
    prior := case when coalesce((OLD.value->'forsale'->>cid)::boolean,false) then 'Yes' else 'No' end;
    next_value := case when coalesce((NEW.value->'forsale'->>cid)::boolean,false) then 'Yes' else 'No' end;
    if prior is distinct from next_value then
      insert into public.tb_collection_activity(owner_id,card_id,category,field,old_value,new_value,actor)
      values(owner,cid::bigint,'sale','For sale',prior,next_value,actor_name);
    end if;
  end loop;
  return NEW;
end
$body$;

create or replace function private.tb_audit_private_copies()
returns trigger language plpgsql security definer set search_path=''
as $body$
declare
  cid text;
  copy_key text;
  prev jsonb;
  next_row jsonb;
  from_text text;
  to_text text;
  old_live boolean;
  new_live boolean;
  fallback_qty int;
  old_qty int;
  new_qty int;
  actor_name text := case when auth.uid() is null then 'Backend' else 'Site' end;
begin
  if NEW.key <> 'tb-copy-inventory-v1' then return NEW; end if;
  if OLD.value->'copies' is not distinct from NEW.value->'copies'
    and OLD.value->'baselines' is not distinct from NEW.value->'baselines'
  then return NEW; end if;
  for copy_key in select key from (
    select jsonb_object_keys(coalesce(OLD.value->'copies','{}'::jsonb)) key
    union select jsonb_object_keys(coalesce(NEW.value->'copies','{}'::jsonb))
  ) all_keys loop
    prev := OLD.value->'copies'->copy_key;
    next_row := NEW.value->'copies'->copy_key;
    if prev is not distinct from next_row then continue; end if;
    cid := coalesce(next_row->>'cardId',prev->>'cardId');
    if cid is null or cid !~ '^[0-9]+$' then continue; end if;
    old_live := prev is not null and coalesce((prev->>'currentInventory')::boolean,true)
      and not coalesce((prev->>'archived')::boolean,false)
      and coalesce(prev->>'saleStatus','none') <> 'sold';
    new_live := next_row is not null and coalesce((next_row->>'currentInventory')::boolean,true)
      and not coalesce((next_row->>'archived')::boolean,false)
      and coalesce(next_row->>'saleStatus','none') <> 'sold';
    if not old_live and not new_live then continue; end if;
    if old_live is distinct from new_live then
      insert into public.tb_collection_activity(owner_id,card_id,category,field,old_value,new_value,actor,copy_id)
      values(NEW.owner_id,cid::bigint,'copy','Counted',case when old_live then 'Yes' else 'No' end,
        case when new_live then 'Yes' else 'No' end,actor_name,copy_key);
    end if;
    -- A newly allocated legacy slot was already part of the original Qty;
    -- log its new location but do not claim a new purchase.
    from_text := prev->>'location';
    to_text := next_row->>'location';
    if prev is null and next_row->>'origin'='legacy' then
      from_text := 'Unallocated';
    end if;
    if coalesce(from_text,'') is distinct from coalesce(to_text,'') and new_live then
      insert into public.tb_collection_activity(owner_id,card_id,category,field,old_value,new_value,actor,copy_id)
      values(NEW.owner_id,cid::bigint,'location','Location',
        nullif(from_text,''),nullif(to_text,''),actor_name,copy_key);
    end if;
    if prev is not null and next_row is not null and old_live and new_live
       and coalesce(prev->>'serial','') is distinct from coalesce(next_row->>'serial','') then
      insert into public.tb_collection_activity(owner_id,card_id,category,field,old_value,new_value,actor,copy_id)
      values(NEW.owner_id,cid::bigint,'detail','Serial',prev->>'serial',next_row->>'serial',actor_name,copy_key);
    end if;
    if prev is not null and next_row is not null and
       coalesce(prev->>'saleStatus','none') is distinct from coalesce(next_row->>'saleStatus','none') then
      insert into public.tb_collection_activity(owner_id,card_id,category,field,old_value,new_value,actor,copy_id)
      values(NEW.owner_id,cid::bigint,'sale','Sale',prev->>'saleStatus',next_row->>'saleStatus',actor_name,copy_key);
    end if;
  end loop;

  for cid in select key from (
    select jsonb_object_keys(coalesce(OLD.value->'baselines','{}'::jsonb)) key
    union select jsonb_object_keys(coalesce(NEW.value->'baselines','{}'::jsonb))
  ) keys loop
    if cid !~ '^[0-9]+$' then continue; end if;
    select coalesce(nullif(x.value->'details'->cid->>'qty','')::int,
      case when x.value->'statuses'->>cid in ('owned','in_transit','for_sale') then 1 else 0 end)
    into fallback_qty from public.collection_kv x where x.key='tb-alldata-v1';
    old_qty := coalesce((OLD.value->'baselines'->cid->>'quantity')::int,fallback_qty,0);
    new_qty := coalesce((NEW.value->'baselines'->cid->>'quantity')::int,fallback_qty,0);
    if old_qty is distinct from new_qty then
      insert into public.tb_collection_activity(owner_id,card_id,category,field,old_value,new_value,actor)
      values(NEW.owner_id,cid::bigint,'qty','Qty',old_qty::text,new_qty::text,actor_name);
    end if;
  end loop;
  return NEW;
end
$body$;
revoke all on function private.tb_audit_shared_change() from public,anon,authenticated;
revoke all on function private.tb_audit_private_copies() from public,anon,authenticated;
drop trigger if exists tb_shared_audit on public.collection_kv;
create trigger tb_shared_audit after update of value on public.collection_kv for each row
  when (OLD.key='tb-alldata-v1') execute function private.tb_audit_shared_change();
drop trigger if exists tb_private_copies_audit on public.collection_private_kv;
create trigger tb_private_copies_audit after update of value on public.collection_private_kv for each row
  when (OLD.key='tb-copy-inventory-v1') execute function private.tb_audit_private_copies();

-- Preserve the available original browser history in the same flat grid.
-- Its source is labelled Historic; older backend operations without prior audit cannot be reconstructed.
insert into public.tb_collection_activity
  (owner_id,changed_at,card_id,category,field,old_value,new_value,actor)
select p.owner_id,
  (e.val->>'ts')::timestamptz,
  (e.val->>'cardId')::bigint,
  case when e.val->>'type'='status' then 'status'
       when e.val->>'field'='qty' then 'qty'
       when e.val->>'type'='forsale' then 'sale' else 'detail' end,
  case when e.val->>'type'='status' then 'Status'
       when e.val->>'type'='forsale' then 'For sale'
       else initcap(coalesce(e.val->>'field','Detail')) end,
  e.val->>'from',e.val->>'to','Historic'
from public.collection_kv a
cross join lateral jsonb_array_elements(coalesce(a.value->'changelog','[]'::jsonb)) e(val)
cross join lateral (
  select owner_id from public.collection_private_kv
  where key='tb-copy-inventory-v1' order by updated_at desc limit 1
) p
where a.key='tb-alldata-v1'
  and e.val->>'cardId' ~ '^[0-9]+$'
  and e.val->>'ts' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T'
  and coalesce(e.val->>'from','') is distinct from coalesce(e.val->>'to','');
