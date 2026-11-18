-- Real trigger regression; all temporary evidence is rolled back.
begin;
do $$
declare
  saved jsonb;
  tb_before jsonb;
  stamp timestamptz;
  ids text[];
  series text:='__integrity_price_test_20261118';
begin
  select value into tb_before from public.collection_kv where key='tb-price-history-v1';
  insert into public.tempo_collection_kv(key,value) values('tempo-price-history-v1','{}') on conflict(key) do nothing;
  update public.tempo_collection_kv set value=jsonb_build_object(series,jsonb_build_array(
    jsonb_build_object('observationKey','audit-a','price',1,'currency','CAD','seller','Verified'),
    jsonb_build_object('observationKey','audit-b','price',2,'currency','USD')))
    where key='tempo-price-history-v1' returning updated_at into stamp;
  update public.tempo_collection_kv set value=jsonb_build_object(series,jsonb_build_array(
    jsonb_build_object('observationKey','audit-a','price',1,'currency','CAD','seller',''),
    jsonb_build_object('observationKey','audit-c','price',3,'currency','GBP')))
    where key='tempo-price-history-v1' returning value into saved;
  select array_agg(value->>'observationKey' order by value->>'observationKey') into ids from jsonb_array_elements(saved->series);
  if ids is distinct from array['audit-a','audit-b','audit-c'] then raise exception 'Tempo stale save lost price evidence'; end if;
  if (select value->>'seller' from jsonb_array_elements(saved->series) where value->>'observationKey'='audit-a') is distinct from 'Verified' then raise exception 'Tempo duplicate evidence lost a populated field'; end if;
  if (select updated_at from public.tempo_collection_kv where key='tempo-price-history-v1')<=stamp then raise exception 'Tempo price revision did not advance'; end if;
  update public.tempo_collection_kv set value=jsonb_build_object('__historyMeta',jsonb_build_object('version',1,'events',
    jsonb_build_object(series,jsonb_build_object('audit-a',jsonb_build_object('deleted',true,'updatedAt','2026-11-18T19:00:00Z')))))
    where key='tempo-price-history-v1';
  update public.tempo_collection_kv set value=jsonb_build_object(series,jsonb_build_array(jsonb_build_object('observationKey','audit-a','price',1,'currency','CAD')))
    where key='tempo-price-history-v1' returning value into saved;
  select array_agg(value->>'observationKey' order by value->>'observationKey') into ids from jsonb_array_elements(saved->series);
  if ids is distinct from array['audit-b','audit-c'] then raise exception 'Stale Tempo evidence resurrected a removed observation'; end if;
  if (select value from public.collection_kv where key='tb-price-history-v1') is distinct from tb_before then raise exception 'Tempo price save touched Tyler evidence'; end if;
end;
$$;
rollback;
