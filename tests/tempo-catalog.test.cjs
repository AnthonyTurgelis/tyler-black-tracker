const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const update = require('../tempo-2026.js');
function original() {
  const context = {window:{}, console:{log(){}}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tempo_data.js'),'utf8'), context);
  return JSON.parse(JSON.stringify(context.window));
}
const identity = c => [c.year,c.product,c.cardNumber,c.cardSet,c.player].join('|');

test('Tempo expansion preserves all original card IDs and data, correcting only the verified Key placeholder', () => {
  const state = original(), before = structuredClone(state.TEMPO_ALL_CARDS);
  state.statuses = {2091:'owned',2:'in_transit',2324:'owned'};
  state.cardDetails = {2091:{qty:2,notes:'Do not overwrite',serials:['10','11']}};
  const saved = JSON.stringify([state.statuses,state.cardDetails]);
  const result = update.apply(state);
  assert.equal(result.applied,true);
  assert.deepEqual(result.corrected,[2091]);
  assert.equal(result.added,1282);
  for (const card of before) {
    const after = state.TEMPO_CARD_BY_ID[card.id];
    assert.ok(after, String(card.id));
    if (card.id !== 2091) assert.deepEqual(after,card);
  }
  assert.equal(state.TEMPO_CARD_BY_ID[2091].cardNumber,'62');
  assert.equal(state.TEMPO_CARD_BY_ID[2091].catalogCorrection.before,'TBD');
  assert.equal(JSON.stringify([state.statuses,state.cardDetails]),saved);
  assert.equal(state.TEMPO_CARD_BY_ID[1].isTestCard,true);
  assert.equal(new Set(state.TEMPO_ALL_CARDS.map(c=>c.id)).size,state.TEMPO_ALL_CARDS.length);
  assert.equal(state.TEMPO_ALL_CARDS.filter(c=>c.year===2026 && c.player==='key' && c.cardSet==='Base').length,1);
});

test('Tempo supplement is idempotent and fails before mutation on an ID mismatch', () => {
  const state=original(); update.apply(state);
  const once=JSON.stringify(state);
  assert.equal(update.apply(state).added,0);
  assert.equal(JSON.stringify(state),once);
  const conflict=original();
  conflict.TEMPO_ALL_CARDS.push({id:202600200,year:1999,product:'Unrelated card',cardNumber:'2',cardSet:'Base',player:'other'});
  const before=JSON.stringify(conflict);
  assert.equal(update.apply(conflict).applied,false);
  assert.equal(JSON.stringify(conflict),before);
});

test('Tempo sources do not turn current team, roster membership, or catalog presence into ownership', () => {
  const state=original(); update.apply(state);
  assert.equal(state.TEMPO_ACTIVE_PLAYERS.filter(p=>p.role==='player').length,16);
  for (const slug of ['morrow','green','bankole','gakdeng','borkowska']) assert.equal(state.TEMPO_ROSTER[slug].active,true);
  for (const slug of ['held','nye','milic','laksa']) {
    assert.equal(state.TEMPO_ROSTER[slug].active,false);
    assert.ok(state.TEMPO_CARDS_BY_PLAYER[slug].length);
  }
  assert.equal(state.TEMPO_ROSTER.wallace.name,'Kristy Wallace');
  assert.equal(state.TEMPO_ROSTER.wright.name,'Monica Wright');
  for (const card of update.cards) {
    assert.ok(['checklist','publisher'].includes(card.verification));
    assert.match(card.sourceUrl,/^https:\/\//);
    for (const key of ['owned','status','qty','quantity','paid','want']) assert.equal(Object.hasOwn(card,key),false);
    if (card.player==='morrow') assert.equal(card.team,'Connecticut Sun');
  }
  assert.equal(new Set(update.cards.map(identity)).size,update.cards.length);
  // Real autograph exceptions: Nyara has only the verified black base auto here.
  assert.deepEqual(update.cards.filter(c=>c.player==='sabally' && c.cardSet.startsWith('Base Prizms Autographs')).map(c=>c.cardSet),['Base Prizms Autographs Black']);
  assert.equal(update.cards.find(c=>c.cardNumber==='PS-KR').player,'rice');
  assert.equal(update.cards.find(c=>c.cardNumber==='SIG-KR').player,'rice');
  assert.equal(update.cards.find(c=>c.cardNumber==='RJ-KR').isRelic,true);
  assert.equal(update.cards.find(c=>c.cardNumber==='SS-AM').player,'morrow');
  const morrowRookies=update.cards.filter(c=>c.player==='morrow' && c.year===2025);
  assert.equal(morrowRookies.length,216);
  assert.equal(morrowRookies.filter(c=>c.product==='Panini Select WNBA' && /Red Prizms$/.test(c.cardSet)).length,1);
  assert.equal(morrowRookies.find(c=>c.cardNumber==='DSS-AM').isAuto,true);
  const draft=update.cards.find(c=>c.cardNumber==='DN-06');
  assert.equal(draft.printRun,2147);
  assert.equal(draft.copies,'');
  assert.equal(draft.serialNumbered,false);
  assert.equal(update.cards.filter(c=>c.product==='Panini Impeccable WNBA').length,80);
  assert.ok(update.cards.filter(c=>c.printRunReview).every(c=>c.copies===''));
});
