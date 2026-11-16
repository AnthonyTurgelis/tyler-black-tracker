-- Run after preserve_price_evidence_fields. Pure-function assertions only.
begin;
set local role authenticated;
do $test$
declare
  current_entry jsonb := '{"observationKey":"same","observedAt":"2026-11-16T01:00:00Z","price":15,"currency":"USD","seller":"Verified seller","grading":{"company":"SGC","cardGrade":"10"},"titles":["Original title"],"notes":["Reviewed front"]}';
  partial_entry jsonb := '{"observationKey":"same","observedAt":"2026-11-16T01:00:00Z","price":12,"seller":"","titles":["Revised title"],"notes":["Cached title"]}';
  legacy jsonb := '{"date":"2026-11-16","source":"eBay","price":15,"grading":{"company":"SGC","cardGrade":"10"},"titles":["Proof"]}';
  old_identity text := 'legacy:["2026-11-16","eBay","",15,"","","","",{"company":"SGC","cardGrade":"10"},["Proof"]]';
  canonical_identity text;
  removed jsonb;
  merged jsonb;
begin
  merged := public.tb_merge_price_evidence(jsonb_build_object('card',jsonb_build_array(current_entry)),jsonb_build_object('card',jsonb_build_array(partial_entry)));
  assert merged#>>'{card,0,price}'='12', 'Equal-time incoming evidence updates its nonblank fields';
  assert merged#>>'{card,0,currency}'='USD' and merged#>>'{card,0,seller}'='Verified seller', 'Partial saves must retain existing nonblank evidence';
  assert merged#>'{card,0,grading}'=current_entry->'grading', 'Missing grading cannot erase existing grade';
  assert merged#>'{card,0,titles}'='["Original title","Revised title"]'::jsonb, 'Titles must be a stable union';
  assert merged#>'{card,0,notes}'='["Reviewed front","Cached title"]'::jsonb, 'Notes must be a stable union';

  partial_entry := partial_entry || '{"observedAt":"2026-11-15T23:30:00-02:00"}';
  merged := public.tb_merge_price_evidence(jsonb_build_object('card',jsonb_build_array(current_entry)),jsonb_build_object('card',jsonb_build_array(partial_entry)));
  assert merged#>>'{card,0,price}'='12', 'Timestamp order uses instants rather than lexicographic ISO text';
  assert public.tb_price_epoch_ms('2026-11-15T23:00:00-02:00')=public.tb_price_epoch_ms('2026-11-16T01:00:00Z'), 'Equivalent offsets represent the same instant';
  assert public.tb_price_epoch_ms('2026-11-16T01:00:00.1239999Z')=public.tb_price_epoch_ms('2026-11-16T01:00:00.123Z'), 'Fractional precision matches Date.parse milliseconds';
  assert public.tb_price_epoch_ms('not-a-date')=0, 'Invalid timestamps use the client fallback';

  canonical_identity := public.tb_price_evidence_identity(legacy);
  assert canonical_identity='legacy:["2026-11-16","eBay","",15,"","","","",{"cardGrade":"10","company":"SGC"},["Proof"]]', 'Object grading is typed canonical JSON, not a JSON string';
  assert public.tb_price_normalize_identity(old_identity)=canonical_identity, 'Old object-key ordering aliases must normalize';
  assert public.tb_price_evidence_identity(legacy || '{"grading":"SGC 10"}')='legacy:["2026-11-16","eBay","",15,"","","","","SGC 10",["Proof"]]', 'String grading identity stays unchanged';
  assert public.tb_price_evidence_identity(legacy || '{"observationKey":"existing-modern-key"}')='existing-modern-key', 'Modern observation keys stay unchanged';

  removed := jsonb_build_object('__historyMeta',jsonb_build_object('version',1,'events',jsonb_build_object('card',
    jsonb_build_object(old_identity,jsonb_build_object('deleted',true,'updatedAt','2026-11-16T01:00:00Z')))));
  merged := public.tb_merge_price_evidence(removed,jsonb_build_object('card',jsonb_build_array(legacy)));
  assert not merged ? 'card', 'Historical graded deletion must suppress a stale row';
  merged := public.tb_merge_price_evidence(merged,jsonb_build_object('card',jsonb_build_array(legacy),'__historyMeta',
    jsonb_build_object('version',1,'events',jsonb_build_object('card',jsonb_build_object(old_identity,
      jsonb_build_object('deleted',false,'updatedAt','2026-11-15T23:00:00-02:00'))))));
  assert not merged ? 'card', 'Equal-instant alias restores cannot override explicit removal';
  merged := public.tb_merge_price_evidence(merged,jsonb_build_object('card',jsonb_build_array(legacy),'__historyMeta',
    jsonb_build_object('version',1,'events',jsonb_build_object('card',jsonb_build_object(old_identity,
      jsonb_build_object('deleted',false,'updatedAt','2026-11-16T01:00:00.001Z'))))));
  assert jsonb_array_length(merged->'card')=1, 'An explicitly newer restore is honored';
  assert public.tb_merge_price_evidence(merged,merged)=merged, 'Canonicalized history remains idempotent';
end;
$test$;
rollback;
