-- Exercise live policies and actual triggers without committing any card change.
begin;
select set_config('request.jwt.claim.sub',owner_id::text,true)
from public.collection_private_kv where key='tb-copy-inventory-v1' limit 1;
set local role authenticated;
-- Main Tyler collection retains the original receipt/CAS regressions.
do $$
declare
  current_row record;
  original_version timestamptz;
  first_version timestamptz;
  first_id text := 'test:' || gen_random_uuid();
  second_id text := 'test:' || gen_random_uuid();
  rejected_id text := 'test:' || gen_random_uuid();
begin
  select * into strict current_row from public.tb_read_collection_for_edit(array[first_id]);
  original_version := current_row.updated_at;
  begin
    insert into public.collection_kv(key,value) values ('tb-alldata-v1',current_row.value)
    on conflict(key) do update set value=excluded.value;
    raise exception 'Unversioned full-collection upsert succeeded';
  exception when sqlstate 'PT409' then null; end;

  begin
    update public.collection_kv set value=value || jsonb_build_object('_expectedCollectionVersion',original_version)
    where key='tb-alldata-v1';
    raise exception using errcode='XX000',message='Unidentified browser edit succeeded';
  exception when raise_exception then null; end;

  update public.collection_kv set value=value || jsonb_build_object('_expectedCollectionVersion',original_version,
    '_collectionEditKeys',array[first_id],'_guardTestValue','first') where key='tb-alldata-v1' returning updated_at into strict first_version;
  if first_version<=original_version then raise exception 'Version failed to advance'; end if;

  begin
    update public.collection_kv set value=value || jsonb_build_object('_expectedCollectionVersion',original_version,
      '_collectionEditKeys',array[rejected_id]) where key='tb-alldata-v1';
    raise exception 'Stale write succeeded';
  exception when sqlstate 'PT409' then null; end;

  update public.collection_kv set value=value || jsonb_build_object('_expectedCollectionVersion',first_version,
    '_collectionEditKeys',array[second_id],'_guardTestValue','later') where key='tb-alldata-v1';
  select * into strict current_row from public.tb_read_collection_for_edit(array[first_id,second_id,rejected_id]);
  if current_row.updated_at<=first_version or cardinality(current_row.applied_keys)<>2
     or not (current_row.applied_keys @> array[first_id,second_id])
     or current_row.value ?| array['_expectedCollectionVersion','_collectionEditKeys'] then
    raise exception 'Incorrect version or acknowledgement';
  end if;

  begin
    update public.collection_kv set value=value || jsonb_build_object('_expectedCollectionVersion',current_row.updated_at,
      '_collectionEditKeys',array[first_id,rejected_id],'_guardTestValue','first') where key='tb-alldata-v1';
    raise exception 'Already committed edit was replayed';
  exception when sqlstate 'PT409' then null; end;
  select * into strict current_row from public.tb_read_collection_for_edit(array[rejected_id]);
  if current_row.value->>'_guardTestValue' is distinct from 'later' or cardinality(current_row.applied_keys)<>0 then
    raise exception 'Mixed retry was partly applied';
  end if;

  begin
    delete from public.collection_kv where key='tb-alldata-v1';
    raise exception 'Collection deleted by browser';
  exception when check_violation then null; end;
  begin
    update public.collection_kv set key='qa_replacement' where key='tb-alldata-v1';
    raise exception 'Collection renamed by browser';
  exception when check_violation then null; end;
end $$;
do $$
declare
  k text;
  r record;
  old_version timestamptz;
  new_version timestamptz;
  receipt text;
  rejected text;
  before_value jsonb;
begin
  foreach k in array array['tempo-alldata-v1','collect-racing-alldata-v1','collect-baseball-alldata-v1',
    'collect-basketball-alldata-v1','collect-football-alldata-v1','collect-hockey-alldata-v1',
    'collect-soccer-alldata-v1','collect-other-alldata-v1'] loop
    receipt := 'scope-test:'||gen_random_uuid(); rejected:='scope-test:'||gen_random_uuid();
    select * into strict r from public.tb_read_scoped_collection_for_edit(k,array[receipt]);
    old_version:=r.updated_at;before_value:=r.value;
    begin
      update public.tempo_collection_kv set value=before_value where key=k;
      raise exception using errcode='XX000',message='Legacy full snapshot overwrite succeeded';
    exception when sqlstate 'PT409' then null; end;
    update public.tempo_collection_kv
      set value=before_value || jsonb_build_object('_expectedCollectionVersion',old_version,'_collectionEditKeys',array[receipt])
      where key=k returning updated_at into strict new_version;
    if new_version<=old_version then raise exception 'Collection version failed to advance: %',k; end if;
    select * into strict r from public.tb_read_scoped_collection_for_edit(k,array[receipt,rejected]);
    if r.value<>before_value or r.applied_keys<>array[receipt] then raise exception 'Value or receipt mismatch: %',k; end if;
    begin
      update public.tempo_collection_kv
      set value=before_value || jsonb_build_object('_expectedCollectionVersion',old_version,'_collectionEditKeys',array[rejected]) where key=k;
      raise exception using errcode='XX000',message='Stale sport overwrite succeeded';
    exception when sqlstate 'PT409' then null; end;
    begin
      update public.tempo_collection_kv
      set value=before_value || jsonb_build_object('_expectedCollectionVersion',new_version,'_collectionEditKeys',array[receipt]) where key=k;
      raise exception using errcode='XX000',message='Saved sport edit replayed';
    exception when sqlstate 'PT409' then null; end;
    begin
      delete from public.tempo_collection_kv where key=k;
      raise exception using errcode='XX000',message='Collection row was deleted';
    exception when check_violation then null; end;
    if k like 'collect-%' and not exists(select 1 from public.tempo_collection_kv where key=k and updated_by=auth.uid()) then
      raise exception 'Collection owner changed: %',k;
    end if;
  end loop;
end $$;
-- A different authenticated account cannot read the new scopes.
select set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
do $$ begin
  if exists(select 1 from public.tempo_collection_kv where key like 'collect-%') then
    raise exception 'Another account can read private sport collections';
  end if;
end $$;
reset role;
set local role anon;
do $$ begin
  if exists(select 1 from public.tempo_collection_kv where key like 'collect-%') then
    raise exception 'Anonymous visitors can read private sport collections';
  end if;
end $$;
rollback;
