-- A retry may arrive after its first transaction committed and after a later
-- deliberate edit. Keep the acknowledgement in the same transaction as the save.
create table public.tb_collection_edit_receipts (
  owner_id uuid not null,
  edit_key text not null check (length(edit_key) between 1 and 512),
  primary key (owner_id, edit_key)
);
alter table public.tb_collection_edit_receipts enable row level security;
revoke all on public.tb_collection_edit_receipts from public, anon, authenticated;
grant select, insert on public.tb_collection_edit_receipts to authenticated;
create policy receipt_read on public.tb_collection_edit_receipts for select to authenticated
  using (owner_id=(select auth.uid()));
create policy receipt_insert on public.tb_collection_edit_receipts for insert to authenticated
  with check (owner_id=(select auth.uid()));

create function public.tb_read_collection_for_edit(edit_keys text[])
returns table (value jsonb, updated_at timestamptz, applied_keys text[])
language sql stable security invoker set search_path = '' as $$
  select c.value, c.updated_at, array(
    select r.edit_key from public.tb_collection_edit_receipts r
    where r.owner_id=(select auth.uid()) and r.edit_key=any(edit_keys)
  )
  from public.collection_kv c where c.key='tb-alldata-v1';
$$;
revoke all on function public.tb_read_collection_for_edit(text[]) from public, anon;
grant execute on function public.tb_read_collection_for_edit(text[]) to authenticated;

create or replace function private.tb_check_collection_version()
returns trigger language plpgsql set search_path = '' as $$
declare
  keys jsonb := new.value->'_collectionEditKeys';
  inserted integer;
begin
  if new.value->>'_expectedCollectionVersion' is null
     or (new.value->>'_expectedCollectionVersion')::timestamptz is distinct from old.updated_at then
    raise exception using errcode='40001', message='Collection changed. Reload the tracker to sync your edits.';
  end if;
  if keys is not null or current_user in ('authenticated','anon') then
    if auth.uid() is null or jsonb_typeof(keys) is distinct from 'array' then
      raise exception using errcode='P0001', message='Refresh the tracker to sync these edits. Your pending edits are kept on this device.';
    end if;
    if jsonb_array_length(keys) not between 1 and 128 then
      raise exception 'Invalid number of collection edits';
    end if;
    insert into public.tb_collection_edit_receipts(owner_id,edit_key)
      select auth.uid(), ident from jsonb_array_elements_text(keys) k(ident)
      on conflict do nothing;
    get diagnostics inserted = row_count;
    if inserted <> jsonb_array_length(keys) then
      raise exception using errcode='40001', message='An edit in this request was already saved.';
    end if;
  end if;
  new.value := new.value - '_expectedCollectionVersion' - '_collectionEditKeys';
  return new;
end;
$$;

-- Old clear/replace helpers must not be able to sidestep the version check.
create function private.tb_keep_collection_row()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op='DELETE' or new.key is distinct from old.key then
    raise exception using errcode='23514', message='The collection must be changed through versioned edits.';
  end if;
  -- The generic timestamp trigger runs first. A second save in the same
  -- transaction must also have a distinct version.
  new.updated_at := greatest(clock_timestamp(), old.updated_at + interval '1 microsecond');
  return new;
end;
$$;
revoke all on function private.tb_keep_collection_row() from public;
create trigger tb_collection_keep_row before delete or update on public.collection_kv
for each row when (old.key='tb-alldata-v1') execute function private.tb_keep_collection_row();
