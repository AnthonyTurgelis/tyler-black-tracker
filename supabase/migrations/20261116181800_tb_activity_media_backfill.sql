with p as (select owner_id from public.collection_private_kv where key='tb-copy-inventory-v1'),
m as (select value v from public.collection_kv where key='tb-card-media-v1')
insert into public.tb_collection_activity
(owner_id,changed_at,card_id,category,field,old_value,new_value,actor,source_ref,evidence_note,evidence_level,event_key)
select p.owner_id, '2026-11-16T04:34:43.530136Z'::timestamptz,
case when mcard.k~'^[0-9]+$' then mcard.k::bigint else 0 end,
'photo','Reference photos',null,(jsonb_array_length(coalesce(mcard.val->'photos','[]'::jsonb)))::text,
'Backfill',mcard.val#>>'{photos,0,sourceUrl}',
'Reference gallery imported by Nov16 snapshot; photo does not prove ownership or copy serial.',
'reference','backfill:media:'||mcard.k
from p,m,jsonb_each(m.v->'cards') mcard(k,val)
where jsonb_array_length(coalesce(mcard.val->'photos','[]'::jsonb))>0
on conflict do nothing;