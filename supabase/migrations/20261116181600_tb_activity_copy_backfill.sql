with p as (select owner_id,value v from public.collection_private_kv where key='tb-copy-inventory-v1')
insert into public.tb_collection_activity
(owner_id,changed_at,card_id,category,field,old_value,new_value,actor,copy_id,source_ref,evidence_note,evidence_level,source_key,event_key)
select p.owner_id,
coalesce(nullif(c.val->>'createdAt','')::timestamptz,'2026-11-16T03:05:05.955Z'::timestamptz),
case when coalesce(c.val->>'cardId','')~'^[0-9]+$' then (c.val->>'cardId')::bigint else 0 end,
'copy', case when c.val->>'origin'='legacy' then 'Existing copy mapped' else 'Purchased copy recorded' end,
null,
case when c.val->>'origin'='legacy' then 'Previously tracked · location: '||coalesce(c.val->>'location','unknown')
when c.val->>'currentInventory'='false' then 'Provisional · NOT counted'
when c.val->>'currentInventory'='true' then 'Counted · source linked'
else 'Recorded · review retention' end,
'Backfill',c.k,
coalesce(nullif(c.val->>'sourceUrl',''),c.val#>>'{photos,0,sourceUrl}'),
case when c.val->>'origin'='legacy' then 'Existing quantity mapped to per-copy slot; not a new card.'
when c.val->>'currentInventory'='false' then 'Purchase evidence excluded from current collection count pending review.'
else 'Source-linked record; current possession and duplicates may need confirmation.' end,
case when c.val->>'origin'='legacy' then 'existing' when c.val->>'currentInventory'='false' then 'pending' else 'source' end,
left(coalesce(c.val->>'sourceItemId',c.k),400),'backfill:copy:'||c.k
from p cross join lateral jsonb_each(p.v->'copies') c(k,val) on conflict do nothing;