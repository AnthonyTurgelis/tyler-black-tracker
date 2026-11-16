
-- Nineteen prior custom entries lacked stable IDs in the Nov15 snapshot.
-- The Nov16 upgrade assigned IDs; only seven subsequent entries were actually new.
update public.tb_collection_activity a
set field='Existing custom card normalized',
old_value='Existing custom entry',
new_value='Stable ID + classification',
evidence_note='Present in Nov15 snapshot without ID. Nov16 normalization assigned an ID/metadata; NOT a newly added physical or catalogue card.',
evidence_level='reconciled'
where a.actor='Backfill' and a.category='catalog' and a.field='Custom card added'
  and a.card_id between 10000 and 10018
  and a.event_key like 'backfill:custom:new:%';

with o as (select owner_id from public.collection_private_kv where key='tb-copy-inventory-v1'),
old_list as (select value v from public.kv_snapshots where key='tb-custom-cards-v1' and reason='nightly' and taken_at::date='2026-11-15' order by taken_at desc limit 1),
new_list as (select value v from public.collection_kv where key='tb-custom-cards-v1'),
paired as (
 select old_item.value prev,new_item.value cur
 from old_list,jsonb_array_elements(old_list.v) with ordinality old_item(value,seq)
 cross join new_list,jsonb_array_elements(new_list.v) with ordinality new_item(value,seq)
 where old_item.seq=new_item.seq and old_item.seq<=19
),
fld as (select unnest(array['product','cardNumber','cardSet','copies','isAuto','issueType','signature','verification']) field)
insert into public.tb_collection_activity
(owner_id,changed_at,card_id,category,field,old_value,new_value,actor,source_ref,evidence_note,evidence_level,source_key,event_key)
select o.owner_id,coalesce(nullif(p.cur->>'updatedAt','')::timestamptz,'2026-11-16T08:00:00Z'::timestamptz),
(p.cur->>'id')::bigint,'catalog','Normalized '||fld.field,
left(p.prev->>fld.field,250),left(p.cur->>fld.field,250),'Backfill',
p.cur->>'sourceUrl','Old and new records matched in preserved array sequence; edit occurred between Nov15 snapshot and Nov16 capture.',
'reconciled',left(coalesce(p.cur->>'cardSet',''),400),
'backfill:existing:custom-field:'||(p.cur->>'id')||':'||fld.field
from o,paired p,fld
where p.prev->>fld.field is distinct from p.cur->>fld.field
on conflict do nothing;
