const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const evidence = require('../tempo-uniform-evidence.js');
const update = require('../tempo-2026.js');
const profile = require('../tempo-profile.js');
function catalog() {
  const context={window:{},console:{log(){}}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tempo_data.js'),'utf8'),context);
  update.apply(context.window);
  return context.window;
}
test('uniform evidence verifies exact identities without editing catalog or ownership',()=>{
  const state=catalog();
  state.statuses={202600200:'owned',202703600:'in_transit'};
  state.cardDetails={202600200:{qty:2,notes:'preserve',paid:19,currency:'CAD'}};
  const before=JSON.stringify([state.TEMPO_ALL_CARDS,state.statuses,state.cardDetails]);
  const result=evidence.apply(state);
  assert.equal(result.applied,true);
  assert.equal(result.uniforms,13);
  assert.equal(result.tempoUniforms,6);
  assert.equal(result.rookies,424);
  assert.equal(JSON.stringify([state.TEMPO_ALL_CARDS,state.statuses,state.cardDetails]),before);
  assert.deepEqual(evidence.apply(state).evidence,result.evidence);
  for(const record of Object.values(result.evidence)) {
    for(const key of ['owned','status','qty','quantity','paid','want'])assert.equal(Object.hasOwn(record,key),false);
    if(record.uniformVerified)assert.match(record.uniformSourceUrl,/^https:\/\/(www\.tcdb\.com|www\.paniniamerica\.net)\//);
    if(record.rookieVerified)assert.match(record.rookieSourceUrl,/^https:\/\/(www\.tcdb\.com|www\.paniniamerica\.net)\//);
  }
});
test('printed Toronto labels never override the photographed jersey',()=>{
  const state=catalog(), registry=evidence.build(state.TEMPO_ALL_CARDS).evidence;
  for(const id of [202703600,202705200,202707800,202708500]) {
    assert.equal(state.TEMPO_CARD_BY_ID[id].team,'Toronto Tempo');
    assert.equal(profile.classify(state.TEMPO_CARD_BY_ID[id],registry).uniform,false);
    assert.equal(profile.matches(state.TEMPO_CARD_BY_ID[id],'primary',registry),false);
  }
  const rice=profile.classify(state.TEMPO_CARD_BY_ID[202709100],registry);
  assert.equal(rice.uniform,false);
  assert.equal(rice.rookie,true);
  assert.equal(rice.primary,true);
  assert.equal(rice.evidence.heldJerseyTeam,'Toronto Tempo');
});
test('jersey evidence never spreads to unseen parallels or other same-number subjects',()=>{
  const state=catalog(), registry=evidence.build(state.TEMPO_ALL_CARDS).evidence;
  for(const id of [202600200,202600232,202613500,202614800,203500002,203500003])assert.equal(profile.classify(state.TEMPO_CARD_BY_ID[id],registry).uniform,true);
  assert.equal(profile.classify(state.TEMPO_CARD_BY_ID[202600201],registry).uniform,null);
  const riceParallel=profile.classify(state.TEMPO_CARD_BY_ID[202613501],registry);
  assert.equal(riceParallel.uniform,null);
  assert.equal(riceParallel.rookie,true);
  assert.equal(registry[202800001],undefined); // Nyara autograph is a different card.
  assert.equal(registry[202800008],undefined); // Rice Fractal has separate art.
});
test('verified RC families include older rookies but not uncertain legacy flags or all 2026 newcomers',()=>{
  const state=catalog(), registry=evidence.build(state.TEMPO_ALL_CARDS).evidence;
  for(const id of [421,862,1437,1455,1469,1478,1781,1787,1794,1799,1800,1835,1836,1852,2286,2304,203007900,203014600,203109900,203204200,202709133])assert.equal(profile.classify(state.TEMPO_CARD_BY_ID[id],registry).rookie,true,String(id));
  for(const id of [2,2092,1860,2091,202700700,202708500,202615700])assert.equal(profile.classify(state.TEMPO_CARD_BY_ID[id],registry).rookie,null,String(id));
});
test('ID collisions, wrong variants, missing cards and wrong subjects fail before registry replacement',()=>{
  for(const mutate of [
    s=>{s.TEMPO_CARD_BY_ID[202600200].player='other';},
    s=>{s.TEMPO_CARD_BY_ID[202613501].cardSet='Different insert';},
    s=>{s.TEMPO_ALL_CARDS=s.TEMPO_ALL_CARDS.filter(c=>c.id!==202614800);},
    s=>{s.TEMPO_ALL_CARDS.push({...s.TEMPO_CARD_BY_ID[202600200]});}
  ]) {
    const state=catalog();state.TEMPO_UNIFORM_EVIDENCE={existing:'keep'};mutate(state);
    const before=JSON.stringify(state);
    const result=evidence.apply(state);
    assert.equal(result.applied,false);
    assert.deepEqual(result.evidence,{});
    assert.equal(JSON.stringify(state),before);
  }
});
