
begin;
-- Provenance checked: 496/496 of the old history rows exactly match saved changelog;
-- 267 latest card statuses agree with live status marks. Neither validates possession.
update public.tb_collection_activity
set evidence_level='recorded_not_physical',
 evidence_note=case when category='status' then
   'Matched original site changelog and current latest marks; historical status recorded, physical ownership/arrival not independently checked.'
  when category='qty' then
   'Matched original site changelog. A blank prior quantity is unknown, NOT evidence of adding that many physical copies.'
  else 'Matched original site changelog. Records a field edit, not a physical card confirmation.' end
where actor='Historic' and evidence_level is null;

update public.tb_collection_activity
set evidence_level='snapshot_only',
 evidence_note='Qty was set in later saved state versus Nov15 snapshot; original quantity field was blank. Exact edit time and physical increase cannot be proven.'
where actor='Snapshot' and category='qty';

-- All 170 COMC-mapped legacy copies matched current source observation ID, card ID,
-- and every readable serial; this is COMC location evidence, not newly acquired inventory.
with inventory as (
 select p.owner_id,p.value v from public.collection_private_kv p where p.key='tb-copy-inventory-v1'
), refs as (
 select p.owner_id,c.key copy_id,(jsonb_array_elements_text(c.value->'sourceRefs')) ref,p.v
 from inventory p, jsonb_each(p.v->'copies') c
 where c.value->>'origin'='legacy' and c.value->>'location'='comc'
)
update public.tb_collection_activity a
set evidence_level='comc_source_matched',
 source_ref=refs.v->'observations'->refs.ref->>'sourceUrl',
 evidence_note='COMC item/card ID cross-check passed; readable serial matched. Previously tracked quantity mapped to COMC, not a new physical card or in-hand receipt.'
from refs where a.owner_id=refs.owner_id and a.copy_id=refs.copy_id
and a.field='Existing copy mapped' and a.actor='Backfill';

-- Four explicit COMC physical-copy records also matched source IDs and serials.
with p as (select owner_id,value v from public.collection_private_kv where key='tb-copy-inventory-v1'), c as (
 select p.owner_id,x.key copy_id,
 p.v->'observations'->('comc:'||split_part(x.key,':',3)) source_observation
 from p,jsonb_each(p.v->'copies') x
 where x.value->>'origin'='purchase' and x.value->>'location'='comc'
)
update public.tb_collection_activity a
set evidence_level='comc_source_matched',
 source_ref=c.source_observation->>'sourceUrl',
 evidence_note='COMC item ID, tracked card ID and serial matched inventory observation. Counted at COMC; NOT in hand.'
from c where a.owner_id=c.owner_id and a.copy_id=c.copy_id and a.category='copy' and a.actor='Backfill';

-- The eBay purchase evidence remains, but no unapproved eBay copies are counted.
with p as (select owner_id,value v from public.collection_private_kv where key='tb-copy-inventory-v1'),
 c as (select p.owner_id,x.key copy_id,x.value copy from p,jsonb_each(p.v->'copies') x where x.value->>'origin'='purchase' and x.value->>'source'='ebay' and x.value->>'currentInventory'='false')
update public.tb_collection_activity a
set evidence_level='pending',
 source_ref=c.copy->>'sourceUrl',
 evidence_note='eBay purchase captured. Current copy is PROVISIONAL and excluded from totals; needs your retention/duplicate check before counting.'
from c where a.owner_id=c.owner_id and a.copy_id=c.copy_id and a.category='copy' and a.actor='Backfill';

with p as (select owner_id,value v from public.collection_private_kv where key='tb-copy-inventory-v1'),
 c as (select p.owner_id,x.key copy_id,x.value copy from p,jsonb_each(p.v->'copies') x where x.value->>'origin'='purchase' and x.value->>'source'='ebay' and x.value->>'currentInventory'='false')
update public.tb_collection_activity a
set evidence_level='corrected_unconfirmed',
 source_ref=c.copy->>'sourceUrl',
 evidence_note='Corrected an automatically counted eBay purchase to provisional. This was not a removal from your manually confirmed in-hand collection.'
from c where a.owner_id=c.owner_id and a.copy_id=c.copy_id and a.category='copy' and a.field='Counted' and a.actor='Backend';
commit;
