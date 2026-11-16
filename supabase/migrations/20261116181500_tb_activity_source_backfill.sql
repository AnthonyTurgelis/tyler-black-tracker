with p as (select owner_id,value v from public.collection_private_kv where key='tb-copy-inventory-v1')
insert into public.tb_collection_activity
 (owner_id,changed_at,card_id,category,field,old_value,new_value,actor,copy_id,source_ref,evidence_note,evidence_level,source_key,event_key)
select p.owner_id,
 coalesce(nullif(o.val->>'createdAt','')::timestamptz,'2026-11-16T03:05:05.955Z'::timestamptz),
 case when coalesce(o.val->>'cardId','')~'^[0-9]+$' then (o.val->>'cardId')::bigint else 0 end,
 'source',case when lower(o.val->>'source')='comc' then 'COMC scan' else 'eBay purchase' end,
 null,
 case when coalesce(o.val->>'matchedCopyId','')<>'' then 'Linked to a recorded copy'
 when o.val->>'disposition'='split' then 'Split for review'
 when o.val->>'disposition'='ignored' then 'Ignored'
 else 'Awaiting reconciliation' end,
 'Backfill',o.k,o.val->>'sourceUrl',
 'Source record; not a newly owned copy. eBay/COMC evidence may overlap prior counts.',
 'source',left(coalesce(o.val->>'title','Source item'),400),'backfill:source:'||o.k
from p cross join lateral jsonb_each(p.v->'observations') o(k,val) on conflict do nothing;