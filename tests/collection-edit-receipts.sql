-- Exercise the actual browser role and triggers. Nothing in this test is committed.
begin;
select set_config('request.jwt.claim.sub',owner_id::text,true)
from public.collection_private_kv where key='tb-copy-inventory-v1' limit 1;
set local role authenticated;
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
  exception when serialization_failure then null; end;

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
  exception when serialization_failure then null; end;

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
  exception when serialization_failure then null; end;
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
rollback;
