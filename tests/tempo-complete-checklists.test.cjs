const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const supplement=require('../tempo-2026.js');
const catalog=require('../tempo-complete-checklists.js');

function before(){
  const context={window:{},console:{log(){}}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tempo_data.js'),'utf8'),context);
  const result=JSON.parse(JSON.stringify(context.window));
  assert.equal(supplement.apply(result).applied,true);
  return result;
}

test('full checklist is additive and preserves every existing card, collection record and media link',()=>{
  const target=before(),old=structuredClone(target.TEMPO_ALL_CARDS);
  target.statuses={421:'owned',762:'incoming',2091:'owned'};
  target.cardDetails={421:{qty:2,serials:['7','19'],notes:'Personal provenance',photos:['private://image']}};
  target.wantlist={421:true};target.ipAutographs={421:{signedCopy:true}};
  const privateBefore=JSON.stringify([target.statuses,target.cardDetails,target.wantlist,target.ipAutographs]);
  const result=catalog.apply(target);
  assert.equal(result.applied,true);assert.equal(result.added,catalog.cards.length);
  assert.equal(result.verifiedSourceCards,6016);
  for(const card of old)assert.deepEqual(target.TEMPO_CARD_BY_ID[card.id],card);
  assert.equal(JSON.stringify([target.statuses,target.cardDetails,target.wantlist,target.ipAutographs]),privateBefore);
  assert.equal(target.TEMPO_CARD_BY_ID[1].isTestCard,true);
  assert.equal(new Set(target.TEMPO_ALL_CARDS.map(c=>c.id)).size,target.TEMPO_ALL_CARDS.length);
  assert.ok(target.TEMPO_CARDS_BY_PLAYER.sykes.length>=546);
  assert.ok(target.TEMPO_CARDS_BY_PLAYER.morrow.length>=1783);
});

test('repeat load is idempotent, and mismatched existing/new/source IDs abort before mutation',()=>{
  const target=before();catalog.apply(target);const once=JSON.stringify(target);
  assert.equal(catalog.apply(target).added,0);assert.equal(JSON.stringify(target),once);
  const mutations=[
    state=>{state.TEMPO_ALL_CARDS.find(c=>c.id===421).cardNumber='wrong';},
    state=>{state.TEMPO_ALL_CARDS.push({...catalog.cards[0],product:'Different card'});},
    state=>{state.TEMPO_ALL_CARDS.push({...catalog.cards[0],id:999999999});}
  ];
  for(const mutate of mutations){
    const state=before();mutate(state);const old=JSON.stringify(state);
    const result=catalog.apply(state);assert.equal(result.applied,false);
    assert.equal(JSON.stringify(state),old);
  }
});

test('every captured exact source ID resolves to a visible catalog card for its subject',()=>{
  const target=before();catalog.apply(target);
  let memberships=0;
  for(const [slug,coverage] of Object.entries(catalog.coverage)){
    if(coverage.status==='unresolved'){
      assert.equal(coverage.total,null);assert.equal(coverage.captureComplete,false);continue;
    }
    assert.equal(coverage.status,'source-complete');
    assert.equal(coverage.capturedUnique,coverage.total);
    assert.equal(new Set(coverage.sourceRows.map(r=>r[0])).size,coverage.total);
    assert.equal(Object.values(coverage.pageCounts).reduce((a,b)=>a+b,0),coverage.total);
    for(const [tcdbId,id] of coverage.sourceRows){
      assert.equal(catalog.sourceIndex[tcdbId],id);
      assert.ok(target.TEMPO_CARD_BY_ID[id],tcdbId);
      assert.ok(target.TEMPO_CARDS_BY_PLAYER[slug].some(c=>c.id===id),slug+' '+tcdbId);
    }
    memberships+=coverage.total;
  }
  assert.equal(memberships,6026);
  assert.equal(Object.keys(catalog.sourceIndex).length,6016);
});

test('multi-player cards share one physical ID while real same-title variants stay separate',()=>{
  const target=before();catalog.apply(target);
  const multi=catalog.cards.filter(c=>c.players?.length>1);
  assert.equal(multi.length,10);
  for(const card of multi){
    assert.equal(target.TEMPO_ALL_CARDS.filter(c=>c.id===card.id).length,1);
    assert.ok(target.TEMPO_CARDS_BY_PLAYER.morrow.some(c=>c.id===card.id));
    assert.ok(target.TEMPO_CARDS_BY_PLAYER.gakdeng.some(c=>c.id===card.id));
    assert.match(card.subject,/Aneesah Morrow/);assert.match(card.subject,/Maria Gakdeng/);
  }
  // TCDB lists separately identified NNO/MC cards with identical titles.
  for(const cid of ['38915912','38915925','38915919','38915932'])assert.ok(target.TEMPO_CARD_BY_ID[300000000+Number(cid)]);
});

test('exact source flags preserve serial/print-run distinction and never grant collection status',()=>{
  for(const card of catalog.cards){
    assert.equal(card.id,300000000+Number(card.tcdbId));
    assert.ok(card.sourceUrl.includes('/cid/'+card.tcdbId+'/'));
    if(card.copies)assert.match(card.attributes,new RegExp('\\bSN'+card.copies+'\\b'));
    if(card.printRun){assert.match(card.attributes,new RegExp('\\bPR'+card.printRun+'\\b'));assert.equal(card.serialNumbered,false);assert.equal(card.copies,'');}
    if(card.isAuto)assert.match(card.attributes,/\bAU\b/);
    if(card.isRookie){assert.match(card.attributes,/\bRC\b/);assert.equal(card.rookieSourceUrl,card.sourceUrl);}
    for(const field of ['owned','status','qty','quantity','paid','want','inTransit','inPersonAutograph'])assert.equal(Object.hasOwn(card,field),false);
  }
  const rice=catalog.cards.find(c=>c.tcdbId==='39706003');
  assert.equal(rice.cardNumber,'RC4');assert.equal(rice.cardSet,'Foil');assert.equal(rice.player,'rice');
  assert.ok(catalog.cards.some(c=>c.player==='sykes'&&c.product==='Panini Instant Unrivaled'));
  assert.ok(catalog.cards.some(c=>c.player==='morrow'&&c.product.startsWith('Leaf')));
});

test('historical and camp players have explicit roster provenance without becoming current players',()=>{
  const target=before();catalog.apply(target);
  for(const slug of ['williams','pouye','alexander','dara_mabrey','balogun']){
    const person=target.TEMPO_ROSTER[slug];
    assert.equal(person.active,false);assert.equal(person.current,false);
    assert.match(person.rosterEvidence.sourceUrl,/^https:\/\/tempo\.wnba\.com\//);
    assert.equal(person.campOnly,['dara_mabrey','balogun'].includes(slug));
  }
  assert.equal(target.TEMPO_CARDS_BY_PLAYER.alexander.length,5);
  assert.equal(target.TEMPO_CARDS_BY_PLAYER.williams.length,11);
  for(const slug of ['green','juskaite','conde','borkowska','pouye','dara_mabrey','balogun'])assert.equal(catalog.coverage[slug].total,null);
});

test('verified legacy aliases retain IDs and do not duplicate renamed or differently formatted cards',()=>{
  const aliases={'27400352':136,'27400361':561,'27400359':1010,'27400339':1283,'27400355':1512,'27400349':2121,'32254752':762,'31157800':1793};
  for(const [tcdbId,id] of Object.entries(aliases)){
    assert.equal(catalog.sourceIndex[tcdbId],id);
    assert.equal(catalog.cards.some(c=>c.tcdbId===tcdbId),false);
  }
  const original=before();
  for(const id of [136,561,1010,1283,1512,2121]){
    const c=original.TEMPO_CARD_BY_ID[id];
    assert.equal(c.cardSet,'Gold Millionaire Shimmer Prizms');assert.equal(c.copies,'500');assert.match(c.cardNumber,/^\d+$/);
  }
});
