with p as (select owner_id from public.collection_private_kv where key='tb-copy-inventory-v1'),
prior as (select value v from public.kv_snapshots where key='tb-price-history-v1' and reason='nightly' and taken_at::date='2026-11-15' order by taken_at desc limit 1),
nowprice as (select value v from public.collection_kv where key='tb-price-history-v1'),
changed as (
select e.key k,e.value newer,prior.v->e.key older from nowprice,prior,jsonb_each(nowprice.v) e
where (prior.v->e.key) is distinct from e.value
)
insert into public.tb_collection_activity
(owner_id,changed_at,card_id,category,field,old_value,new_value,actor,evidence_note,evidence_level,source_key,event_key)
select p.owner_id,'2026-11-16T03:27:10.790386Z'::timestamptz,
0,'price','Market history',
case when older is null then null else (jsonb_array_length(older))::text end,
(jsonb_array_length(newer))::text,
'Backfill',
case when older is null then 'New price observation series compared with Nov15 snapshot. Not a purchase price or ownership change.'
when jsonb_array_length(older)=jsonb_array_length(newer) then 'Existing market evidence updated or corrected; count unchanged. No confirmed sale or quantity implied.'
else 'Market-series observations changed relative to Nov15 snapshot; not personal purchase price.' end,
'market',left(k,400),'backfill:price:'||md5(k)
from p,changed on conflict do nothing;