
with o as (select owner_id from public.collection_private_kv where key='tb-copy-inventory-v1'),
prior as (select value v from public.kv_snapshots where key='tb-custom-cards-v1' and reason='nightly' and taken_at::date='2026-11-15' order by taken_at desc limit 1),
current as (select value v from public.collection_kv where key='tb-custom-cards-v1'),
cards as (select n.value val from current,jsonb_array_elements(current.v) n)
insert into public.tb_collection_activity
(owner_id,changed_at,card_id,category,field,old_value,new_value,actor,source_ref,evidence_note,evidence_level,source_key,event_key)
select o.owner_id,
coalesce(nullif(c.val->>'updatedAt','')::timestamptz,'2026-11-16T08:00:00Z'::timestamptz),
(c.val->>'id')::bigint,'catalog','Custom card added',null,
left(coalesce(c.val->>'product','')||' · #'||coalesce(c.val->>'cardNumber','')||' · '||coalesce(c.val->>'cardSet',''),260),
'Backfill',c.val->>'sourceUrl',
'New catalogue entry relative to Nov15 snapshot, not automatic ownership confirmation.',
'catalogued',left(coalesce(c.val->>'cardSet',''),400),
'backfill:custom:new:'||(c.val->>'id')
from o,cards c,prior
where coalesce(c.val->>'id','')~'^[0-9]+$'
and not exists(select 1 from jsonb_array_elements(prior.v) e(value) where e.value->>'id'=c.val->>'id')
on conflict do nothing;

with o as (select owner_id from public.collection_private_kv where key='tb-copy-inventory-v1'),
prior as (select value v from public.kv_snapshots where key='tb-custom-cards-v1' and reason='nightly' and taken_at::date='2026-11-15' order by taken_at desc limit 1),
current as (select value v from public.collection_kv where key='tb-custom-cards-v1'),
paired as (
 select n.value val,e.value old_val from current,jsonb_array_elements(current.v) n,prior,
 jsonb_array_elements(prior.v) e
 where e.value->>'id'=n.value->>'id'
),
fields as (select f from unnest(array['cardSet','copies','issueType','signature','verification','archived']) f)
insert into public.tb_collection_activity
(owner_id,changed_at,card_id,category,field,old_value,new_value,actor,source_ref,evidence_note,evidence_level,source_key,event_key)
select o.owner_id,coalesce(nullif(p.val->>'updatedAt','')::timestamptz,'2026-11-16T08:00:00Z'::timestamptz),
(p.val->>'id')::bigint,'catalog','Proof/card '||f.f,
left(p.old_val->>f.f,260),left(p.val->>f.f,260),
'Backfill',p.val->>'sourceUrl',
'Catalogue metadata differs from Nov15 snapshot; actual editor and timestamp are not fully recoverable.',
'reconciled',left(coalesce(p.val->>'cardSet',''),400),
'backfill:custom:field:'||(p.val->>'id')||':'||f.f
from o,paired p,fields f
where p.old_val->>f.f is distinct from p.val->>f.f
on conflict do nothing;
