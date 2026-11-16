-- Run after preserve_price_history_evidence. Every assertion is read-only.
begin;
set local role authenticated;
do $test$
declare
  a jsonb := '{"observationKey":"a","price":10,"observedAt":"2026-11-16T01:00:00Z"}';
  b jsonb := '{"observationKey":"b","price":12,"observedAt":"2026-11-16T02:00:00Z"}';
  c jsonb := '{"observationKey":"c","price":15,"observedAt":"2026-11-16T03:00:00Z"}';
  legacy jsonb := '{"date":"2026-11-15","source":"COMC","price":"3.00","titles":["Tyler Black"]}';
  current_history jsonb;
  merged jsonb;
  removed jsonb;
  identity text;
begin
  current_history := jsonb_build_object('card',jsonb_build_array(a,b));
  merged := public.tb_merge_price_evidence(current_history,jsonb_build_object('card',jsonb_build_array(a,c)));
  assert jsonb_array_length(merged->'card')=3, 'Stale writes must retain independent evidence';
  assert public.tb_merge_price_evidence(merged,merged)=merged, 'Repeated saves must be idempotent';

  merged := public.tb_merge_price_evidence(jsonb_build_object('card',jsonb_build_array(b||'{"seller":"new"}')),
    jsonb_build_object('card',jsonb_build_array(b||'{"observedAt":"2026-11-15T00:00:00Z","seller":"old"}')));
  assert merged#>>'{card,0,seller}'='new', 'Stale metadata cannot replace newer evidence';

  removed := public.tb_merge_price_evidence(current_history,
    '{"__historyMeta":{"version":1,"events":{"card":{"a":{"deleted":true,"updatedAt":"2026-11-16T04:00:00Z"}}}}}');
  merged := public.tb_merge_price_evidence(removed,current_history);
  assert jsonb_array_length(merged->'card')=1 and merged#>>'{card,0,observationKey}'='b', 'A stale save cannot resurrect an explicitly removed observation';
  assert merged#>>'{__historyMeta,events,card,a,deleted}'='true', 'Deletion events must survive old clients';

  identity := public.tb_price_evidence_identity(legacy);
  removed := public.tb_merge_price_evidence(jsonb_build_object('card',jsonb_build_array(legacy)),
    jsonb_build_object('__historyMeta',jsonb_build_object('version',1,'events',jsonb_build_object('card',
      jsonb_build_object(identity,jsonb_build_object('deleted',true,'updatedAt','2026-11-16T04:00:00Z'))))));
  merged := public.tb_merge_price_evidence(removed,jsonb_build_object('card',jsonb_build_array(legacy)));
  assert not merged ? 'card', 'Legacy evidence also respects explicit deletions';

  merged := public.tb_merge_price_evidence(removed,jsonb_build_object('target',jsonb_build_array(legacy),
    '__historyMeta',jsonb_build_object('version',1,'events',jsonb_build_object('target',
      jsonb_build_object(identity,jsonb_build_object('deleted',false,'updatedAt','2026-11-16T05:00:00Z'))))));
  assert jsonb_array_length(merged->'target')=1 and not merged ? 'card', 'Reassignment restores only the selected target';

  merged := public.tb_merge_price_evidence(jsonb_build_object('card',jsonb_build_array(legacy||'{"currency":"USD"}')),
    jsonb_build_object('card',jsonb_build_array(legacy||'{"currency":"CAD"}',legacy||'{"currency":"USD","grading":"PSA 10"}')));
  assert jsonb_array_length(merged->'card')=3, 'Currency and grading identities must remain distinct';
end;
$test$;
rollback;
