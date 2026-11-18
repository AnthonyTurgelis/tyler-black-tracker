-- Tempo price scans use the same evidence union/tombstone algorithm as Tyler.
-- An old unconditional save cannot remove a newer observation. No ownership
-- state or existing price evidence is rewritten by this migration.
create function private.tempo_merge_price_evidence()
returns trigger language plpgsql security invoker set search_path='' as $$
begin
  if jsonb_typeof(new.value) is distinct from 'object' then
    raise exception 'Price history must be an object; refresh the tracker before saving.';
  end if;
  new.value:=public.tb_merge_price_evidence(old.value,new.value);
  -- Run after the legacy timestamp trigger so same-transaction edits have
  -- distinct revisions for conditional client writes.
  new.updated_at:=greatest(clock_timestamp(),old.updated_at+interval '1 microsecond');
  return new;
end;
$$;
revoke all on function private.tempo_merge_price_evidence() from public;
create trigger zz_tempo_price_evidence_merge before update of value on public.tempo_collection_kv
for each row when (old.key='tempo-price-history-v1' and new.key=old.key)
execute function private.tempo_merge_price_evidence();
