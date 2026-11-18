-- Extend the proven version/receipt guard to Tempo and separate sport collections.
-- No Tyler ownership, catalog rows or quantities are copied into another sport.
do $$
declare
  collection_owner uuid;
  owner_count integer;
  sport text;
  empty_value jsonb := '{"statuses":{},"details":{},"forsale":{},"dirty":[],"synced":[],"changelog":[],"cards":{},"imports":{},"checkpoint":null,"_migrationComplete":true}'::jsonb;
begin
  select count(distinct owner_id), min(owner_id::text)::uuid into owner_count,collection_owner
  from public.collection_private_kv where key='tb-copy-inventory-v1';
  if owner_count<>1 then raise exception 'A single collection owner must be identified before creating sport collections'; end if;
  insert into public.tempo_collection_kv(key,value,updated_at,updated_by)
    values ('tempo-alldata-v1',empty_value,clock_timestamp(),collection_owner) on conflict(key) do nothing;
  foreach sport in array array['racing','baseball','basketball','football','hockey','soccer','other'] loop
    insert into public.tempo_collection_kv(key,value,updated_at,updated_by)
      values ('collect-'||sport||'-alldata-v1',empty_value,clock_timestamp(),collection_owner) on conflict(key) do nothing;
  end loop;
end $$;

create function public.tb_read_scoped_collection_for_edit(collection_key text,edit_keys text[])
returns table(value jsonb,updated_at timestamptz,applied_keys text[])
language sql stable security invoker set search_path='' as $$
  select c.value,c.updated_at,array(
    select r.edit_key from public.tb_collection_edit_receipts r
    where r.owner_id=(select auth.uid()) and r.edit_key=any(edit_keys)
  ) from public.tempo_collection_kv c
  where c.key=collection_key and collection_key=any(array[
    'tempo-alldata-v1','collect-racing-alldata-v1','collect-baseball-alldata-v1',
    'collect-basketball-alldata-v1','collect-football-alldata-v1','collect-hockey-alldata-v1',
    'collect-soccer-alldata-v1','collect-other-alldata-v1']);
$$;
revoke all on function public.tb_read_scoped_collection_for_edit(text,text[]) from public,anon;
grant execute on function public.tb_read_scoped_collection_for_edit(text,text[]) to authenticated;

-- Existing Tempo visibility is preserved. New sport collection rows are owner-only.
alter policy tempo_anon_select on public.tempo_collection_kv
  using (key not like 'collect-%' or ((select auth.uid()) is not null and updated_by=(select auth.uid())));

create function private.tb_scoped_collection_owner()
returns trigger language plpgsql set search_path='' as $$
begin
  if new.key like 'collect-%' then
    if tg_op='UPDATE' then
      if current_user in ('authenticated','anon') and auth.uid() is distinct from old.updated_by then
        raise exception using errcode='42501',message='This sport collection belongs to another owner';
      end if;
      -- The older timestamp trigger sets updated_by=auth.uid(); keep the stable
      -- owner even during a privileged maintenance write without a browser JWT.
      new.updated_by:=old.updated_by;
    elsif current_user in ('authenticated','anon') then
      if auth.uid() is null then raise exception using errcode='42501',message='Owner login required'; end if;
      new.updated_by:=auth.uid();
    end if;
  end if;
  return new;
end;
$$;
revoke all on function private.tb_scoped_collection_owner() from public;
create trigger zzz_scoped_collection_owner before insert or update on public.tempo_collection_kv
for each row execute function private.tb_scoped_collection_owner();

create trigger collection_check_version before update of value on public.tempo_collection_kv
for each row when (old.key in ('tempo-alldata-v1','collect-racing-alldata-v1','collect-baseball-alldata-v1',
  'collect-basketball-alldata-v1','collect-football-alldata-v1','collect-hockey-alldata-v1',
  'collect-soccer-alldata-v1','collect-other-alldata-v1')) execute function private.tb_check_collection_version();
-- Sort after tempo_collection_kv_updated_at, whose now() is transaction-stable.
create trigger zz_scoped_collection_keep_row before delete or update on public.tempo_collection_kv
for each row when (old.key in ('tempo-alldata-v1','collect-racing-alldata-v1','collect-baseball-alldata-v1',
  'collect-basketball-alldata-v1','collect-football-alldata-v1','collect-hockey-alldata-v1',
  'collect-soccer-alldata-v1','collect-other-alldata-v1')) execute function private.tb_keep_collection_row();
