
with p as (select owner_id from public.collection_private_kv where key='tb-copy-inventory-v1'),
releases(ms,sha,description) as (values
  (1794791223382::bigint,'523c479c8fac4c72cab2369c57b7e190afd95ae0','Released 49 checklist-backed 2026 Update variants and proof segmentation'),
  (1794798475336::bigint,'37b096d3952fb51c9f44d26fdf96300fb9a8fe97','Added per-copy evidence and photo gallery infrastructure'),
  (1794800958817::bigint,'b1b2e8fc784189bc4912a67c088d4a16e1c5879e','Separated signed/unsigned proofs and improved review previews'),
  (1794838221113::bigint,'921345a307c39950dc8df2d4e87967b50a8428a3','Restored stoplights and editable card quantities'),
  (1794838523973::bigint,'6a91c7763bd493bb67c25693fc0ef1e6cd3fbf49','Kept provisional eBay purchases out of collection totals'),
  (1794839886765::bigint,'870ee74514ff815792ee5fe2dbd0801d29eab979','Fixed mixed Owned / In Transit for multiple copies'),
  (1794840344095::bigint,'0e3ab353f9f9556ef1f850ee1782f76fb5050939','Replaced dated sessions with compact change grid'),
  (1794842147938::bigint,'b2009455d6fe172b30386d59289446ec1508b93b','Made imported/backend evidence filterable with source links'),
  (1794842224552::bigint,'7dcea9d18f165964b495aef1267041a29e0dd422','Backfilled scan-level serial and variant verifications')
)
insert into public.tb_collection_activity
(owner_id,changed_at,card_id,category,field,old_value,new_value,actor,source_ref,evidence_note,evidence_level,source_key,event_key)
select p.owner_id,to_timestamp(r.ms/1000.0),0,'system','Site release',null,r.description,'Backend',
'https://github.com/AnthonyTurgelis/tyler-black-tracker/commit/'||r.sha,
'Verified production deployment commit. A site release is not evidence of an additional owned card.',
'verified_deployment','Tracker release',
'backend:release:'||r.sha
from p,releases r on conflict do nothing;
