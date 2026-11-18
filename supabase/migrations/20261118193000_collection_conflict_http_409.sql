-- A deterministic rejected edit is an HTTP conflict, not a retryable database
-- serialization failure. PostgREST must return it instead of retrying forever.
-- Version checks, atomic receipts, and row protections are unchanged.
create or replace function private.tb_check_collection_version()
returns trigger language plpgsql set search_path = '' as $$
declare
  keys jsonb := new.value->'_collectionEditKeys';
  inserted integer;
begin
  if new.value->>'_expectedCollectionVersion' is null
     or (new.value->>'_expectedCollectionVersion')::timestamptz is distinct from old.updated_at then
    raise exception using errcode='PT409', message='Collection changed. Reload the tracker to sync your edits.';
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
      raise exception using errcode='PT409', message='An edit in this request was already saved.';
    end if;
  end if;
  new.value := new.value - '_expectedCollectionVersion' - '_collectionEditKeys';
  return new;
end;
$$;

