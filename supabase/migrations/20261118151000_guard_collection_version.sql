-- Older tabs used an unconditional upsert for the entire collection every five minutes.
-- Guard the row itself so those already-open tabs cannot undo a later edit.
create or replace function private.tb_check_collection_version()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.value->>'_expectedCollectionVersion' is null
     or (new.value->>'_expectedCollectionVersion')::timestamptz is distinct from old.updated_at then
    raise exception using errcode = '40001', message = 'Collection changed. Reload the tracker to sync your edits.';
  end if;
  new.value := new.value - '_expectedCollectionVersion';
  return new;
end;
$$;
revoke all on function private.tb_check_collection_version() from public;
create or replace trigger collection_check_version before update of value on public.collection_kv
for each row when (old.key = 'tb-alldata-v1') execute function private.tb_check_collection_version();
