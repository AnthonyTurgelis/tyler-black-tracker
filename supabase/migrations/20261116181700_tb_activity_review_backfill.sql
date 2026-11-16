with p as (select owner_id,value v from public.collection_private_kv where key='tb-confirmation-checklist-v1')
insert into public.tb_collection_activity
(owner_id,changed_at,card_id,category,field,old_value,new_value,actor,copy_id,source_ref,evidence_note,evidence_level,source_key,event_key)
select p.owner_id,
coalesce(nullif(a.val->>'createdAt','')::timestamptz,'2026-11-16T04:32:07.824626Z'::timestamptz),
case when coalesce(a.val->'cardIds'->>0,'')~'^[0-9]+$' then (a.val->'cardIds'->>0)::bigint else 0 end,
'review','Review #'||coalesce(a.val->>'number','?'),null,
left(coalesce(a.val->>'prompt',a.val->>'heading','Review pending'),300),
'Backfill',a.val->>'id',a.val#>>'{sources,0,sourceUrl}',
'Numbered question staged, not an inventory change. Respond by number to reconcile.',
case when a.val->>'status'='pending' then 'pending' else 'review' end,
left(coalesce(a.val->>'heading','Review task'),400),
'backfill:review:'||coalesce(a.val->>'id',a.val->>'number')
from p cross join lateral jsonb_array_elements(p.v->'actions') a(val) on conflict do nothing;