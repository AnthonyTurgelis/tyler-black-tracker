with p as (select owner_id,value v from public.collection_private_kv where key='tb-copy-inventory-v1'),
e as (select o.key k,o.value val from p,jsonb_each(p.v->'observations') o
  where o.value ? 'secondPassReview' or o.value ? 'imageAudit')
insert into public.tb_collection_activity
(owner_id,changed_at,card_id,category,field,old_value,new_value,actor,copy_id,source_ref,evidence_note,evidence_level,source_key,event_key)
select p.owner_id,
coalesce(nullif(e.val#>>'{secondPassReview,reviewedAt}','')::timestamptz,
 nullif(e.val->>'updatedAt','')::timestamptz,'2026-11-16T03:44:14.171Z'::timestamptz),
case when coalesce(e.val->>'cardId','')~'^[0-9]+$' then (e.val->>'cardId')::bigint else 0 end,
'verification','Image / serial review',null,
case when e.val->>'serialEvidence'='image_verified' and e.val->>'serial' is not null
 then 'Serial checked: '||(e.val->>'serial')
when e.val#>>'{secondPassReview,decision}' is not null
 then 'Review: '||(e.val#>>'{secondPassReview,decision}')
else 'Image inspected' end,
'Backfill',e.k,e.val->>'sourceUrl',
left(coalesce(e.val#>>'{secondPassReview,finding}',
 e.val#>>'{imageAudit,observed}',
 e.val->>'reviewReason','Source image evidence saved; confirm against copy if necessary.'),360),
case when e.val#>>'{secondPassReview,decision}'='partly_resolved' then 'pending'
 when e.val->>'serialEvidence'='image_verified' then 'image_verified' else 'source' end,
left(coalesce(e.val->>'title','Source review'),400),'backfill:verification:'||e.k
from p,e on conflict do nothing;