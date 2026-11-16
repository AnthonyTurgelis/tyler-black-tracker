
-- Reconstruct changes from the Nov15 snapshot. Actor and exact edit time cannot be proven.
with p as (select owner_id from public.collection_private_kv where key='tb-copy-inventory-v1'),
prior as (select value v from public.kv_snapshots where key='tb-alldata-v1' and reason='nightly' and taken_at::date='2026-11-15' order by taken_at desc limit 1),
current as (select value v from public.collection_kv where key='tb-alldata-v1'),
ids as (
 select key id from prior,jsonb_each_text(prior.v->'statuses')
 union select key id from current,jsonb_each_text(current.v->'statuses')
)
insert into public.tb_collection_activity
(owner_id,changed_at,card_id,category,field,old_value,new_value,actor,evidence_note,evidence_level,event_key)
select p.owner_id,
'2026-11-16T08:00:00Z'::timestamptz,
ids.id::bigint,'status','Status',
prior.v->'statuses'->>ids.id,current.v->'statuses'->>ids.id,
'Snapshot','Difference between Nov15 08:00 snapshot and subsequent live collection. Exact edit time and operator unverified.',
'reconciled','backfill:snapshot:status:'||ids.id
from p,prior,current,ids
where ids.id~'^[0-9]+$' and prior.v->'statuses'->>ids.id is distinct from current.v->'statuses'->>ids.id
and not exists (
 select 1 from public.tb_collection_activity a
 where a.owner_id=p.owner_id and a.card_id=ids.id::bigint and a.category='status'
 and a.new_value is not distinct from current.v->'statuses'->>ids.id
 and a.changed_at>='2026-11-15T08:00:00Z'::timestamptz
)
on conflict do nothing;

with p as (select owner_id from public.collection_private_kv where key='tb-copy-inventory-v1'),
prior as (select value v from public.kv_snapshots where key='tb-alldata-v1' and reason='nightly' and taken_at::date='2026-11-15' order by taken_at desc limit 1),
current as (select value v from public.collection_kv where key='tb-alldata-v1'),
ids as (
 select key id from prior,jsonb_each(prior.v->'details')
 union select key id from current,jsonb_each(current.v->'details')
),
fields as (select unnest(array['qty','serial','price','date','notes','printRun']) fld)
insert into public.tb_collection_activity
(owner_id,changed_at,card_id,category,field,old_value,new_value,actor,evidence_note,evidence_level,event_key)
select p.owner_id,'2026-11-16T08:00:00Z'::timestamptz,
ids.id::bigint,case when fields.fld='qty' then 'qty' else 'detail' end,
case when fields.fld='qty' then 'Qty' else initcap(fields.fld) end,
left(prior.v->'details'->ids.id->>fields.fld,250),
left(current.v->'details'->ids.id->>fields.fld,250),
'Snapshot',
'Difference between Nov15 snapshot and live collection; exact edit time/editor not proven.',
'reconciled','backfill:snapshot:detail:'||ids.id||':'||fields.fld
from p,prior,current,ids,fields
where ids.id~'^[0-9]+$' 
and prior.v->'details'->ids.id->>fields.fld is distinct from current.v->'details'->ids.id->>fields.fld
and not exists (
 select 1 from public.tb_collection_activity a
 where a.owner_id=p.owner_id and a.card_id=ids.id::bigint
 and a.field=case when fields.fld='qty' then 'Qty' else initcap(fields.fld) end
 and a.new_value is not distinct from left(current.v->'details'->ids.id->>fields.fld,250)
 and a.changed_at>='2026-11-15T08:00:00Z'::timestamptz
)
on conflict do nothing;
