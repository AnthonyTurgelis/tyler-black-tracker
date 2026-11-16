
with p as (select owner_id from public.collection_private_kv where key='tb-copy-inventory-v1')
insert into public.tb_collection_activity
(owner_id,changed_at,card_id,category,field,old_value,new_value,actor,source_ref,evidence_note,evidence_level,source_key,event_key)
select p.owner_id,to_timestamp(1794791223382/1000.0),g.id::bigint,
'catalog','2026 checklist added',null,'US138 parallel · checklist entry',
'Backfill','https://www.breakninja.com/baseball/2026-Topps-Update-Series-Baseball-Checklist-Milwaukee-Brewers.php',
'Source-backed 2026 Topps Update US138 parallel from released code. No copy quantity or physical ownership implied.',
'catalogued','2026 Topps Update #US138',
'backfill:builtin:2026:'||g.id::text
from p cross join generate_series(2001,2049) g(id)
on conflict do nothing;

with p as (select owner_id from public.collection_private_kv where key='tb-copy-inventory-v1'),
m as (select value v from public.collection_kv where key='tb-catalog-meta-v1')
insert into public.tb_collection_activity
(owner_id,changed_at,card_id,category,field,old_value,new_value,actor,source_ref,evidence_note,evidence_level,event_key)
select p.owner_id,
coalesce(nullif(e.val->>'updatedAt','')::timestamptz,'2026-11-16T08:00:00Z'::timestamptz),
e.k::bigint,'catalog','Proof/category metadata',null,
coalesce(e.val->>'issueType','Existing card reference'),
'Backfill',e.val->>'sourceUrl',
'Existing catalogue card classified or annotated. Does not add a physical card.',
'reconciled','backfill:catalog-meta:'||e.k
from p,m,jsonb_each(m.v) e(k,val) where e.k~'^[0-9]+$' on conflict do nothing;
