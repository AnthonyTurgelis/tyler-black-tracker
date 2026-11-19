const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const brand=require('../tempo-brand-evidence.js');
const complete=require('../tempo-complete-checklists.js');

function catalog(){
  const context={window:{},URL,console:{log(){}}};
  for(const file of ['tempo_data.js','tempo-2026.js','tempo-complete-checklists.js','tempo-uniform-evidence.js']){
    vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
  }
  return context;
}

test('all 936 explicitly listed team cards reconcile to unique existing source IDs',()=>{
  const context=catalog(),target=context.window,before=JSON.stringify(target.TEMPO_ALL_CARDS);
  target.statuses={202705200:'owned',202703600:'incoming'};
  target.cardDetails={202705200:{qty:2,serials:['3','9'],notes:'Signed in person',photos:['private://scan']}};
  target.wantlist={202707800:true};target.ipAutographs={202705200:{signedCopy:true}};
  const privateBefore=JSON.stringify([target.statuses,target.cardDetails,target.wantlist,target.ipAutographs]);
  const result=brand.apply(target);
  assert.equal(result.applied,true);assert.equal(result.teamCards,936);assert.equal(result.logos,2);
  assert.equal(Object.keys(result.evidence).length,938);
  assert.equal(new Set(brand.teamRows.map(row=>row[0])).size,936);
  assert.equal(new Set(brand.teamRows.map(row=>row[2])).size,936);
  for(const [id,,tcdbId] of brand.teamRows){
    assert.equal(complete.sourceIndex[tcdbId],id);
    assert.equal(result.evidence[id].cardTeam,'Toronto Tempo');
    assert.equal(result.evidence[id].teamVerified,true);
    assert.equal(result.evidence[id].logoVerified,undefined);
    assert.equal(result.evidence[id].tempoLogo,undefined);
  }
  assert.equal(JSON.stringify(target.TEMPO_ALL_CARDS),before);
  assert.equal(JSON.stringify([target.statuses,target.cardDetails,target.wantlist,target.ipAutographs]),privateBefore);
});

test('default browser profile merges brand and uniform evidence for old-jersey Tempo cards',()=>{
  const context=catalog(),target=context.window;
  for(const file of ['tempo-brand-evidence.js','tempo-profile.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),context);
  assert.equal(target.TEMPO_BRAND_EVIDENCE_UPDATE.applied,true);
  const profile=target.TempoProfile;
  for(const id of [202703600,202705200,202707800,202708500]){
    const card=target.TEMPO_CARD_BY_ID[id],p=profile.classify(card);
    assert.equal(p.primary,true,id);assert.equal(p.team,true,id);assert.equal(p.uniform,false,id);
    assert.equal(p.logo,null,id);assert.equal(profile.matches(card,'tempo'),true,id);
    assert.equal(profile.matches(card,'uniform'),false,id);
  }
  for(const id of [202700700,202705700])assert.equal(profile.matches(target.TEMPO_CARD_BY_ID[id],'tempo'),false,id);
  const counts=profile.counts(target.TEMPO_ALL_CARDS);
  assert.equal(counts.tempo,938);assert.equal(counts.logo,2);assert.equal(counts.uniform,6);
});

test('team checklist evidence never borrows a logo or promotes unspecified parallels',()=>{
  const context=catalog(),target=context.window;
  const invented={...target.TEMPO_CARD_BY_ID[202705200],id:999999991,cardSet:'Unverified New Parallel',team:'Toronto Tempo'};
  target.TEMPO_ALL_CARDS.push(invented);
  assert.equal(brand.apply(target).applied,true);
  assert.equal(target.TEMPO_BRAND_EVIDENCE[invented.id],undefined);
  assert.equal(target.TEMPO_BRAND_EVIDENCE[202705201].teamVerified,true);
  assert.equal(target.TEMPO_BRAND_EVIDENCE[202705201].logoVerified,undefined);
  for(const record of brand.logoRecords){
    assert.equal(record.logoVerified,true);assert.equal(record.tempoLogo,true);
    assert.equal(record.logoCheckedAt,'2026-11-18');
    assert.equal(record.logoSourceType,'publisher-rendering');assert.match(record.logoCaveat,/subject to change/);
    assert.match(record.logoImageUrl,/assets\.paniniamerica\.net/);
  }
});

test('team-only evidence preserves separately verified logo evidence on a card',()=>{
  const context=catalog(),target=context.window;
  const card=target.TEMPO_CARD_BY_ID[202705200];
  card.tempoLogo=true;card.logoVerified=true;card.logoSourceUrl='https://www.tcdb.com/ViewCard.cfm/sid/647539/cid/40262123';
  brand.apply(target);
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tempo-profile.js'),'utf8'),context);
  assert.equal(target.TempoProfile.classify(card).logo,true);
});

test('mismatch, missing card, changed source ID and duplicate IDs abort atomically',()=>{
  const base=catalog().window;
  const mutations=[
    state=>{state.TEMPO_ALL_CARDS.find(c=>c.id===202705200).cardSet='Wrong parallel';},
    state=>{state.TEMPO_ALL_CARDS.find(c=>c.id===202705200).player='morrow';},
    state=>{state.TEMPO_ALL_CARDS=state.TEMPO_ALL_CARDS.filter(c=>c.id!==202705200);},
    state=>{state.TEMPO_ALL_CARDS.find(c=>c.id===202705200).tcdbId='wrong';},
    state=>{state.TEMPO_ALL_CARDS.push({...state.TEMPO_ALL_CARDS.find(c=>c.id===202705200)});}
  ];
  for(const mutate of mutations){
    const target=JSON.parse(JSON.stringify(base));
    target.TEMPO_BRAND_EVIDENCE={previous:{keep:true}};mutate(target);
    const before=JSON.stringify(target),result=brand.apply(target);
    assert.equal(result.applied,false);assert.equal(Object.keys(result.evidence).length,0);
    assert.ok(result.conflicts.includes(202705200));assert.equal(JSON.stringify(target),before);
  }
});

test('repeat application is idempotent and source identities cannot be changed',()=>{
  const target=catalog().window;brand.apply(target);const before=JSON.stringify(target);
  assert.equal(brand.apply(target).applied,true);assert.equal(JSON.stringify(target),before);
  assert.ok(Object.isFrozen(brand.teamRows));assert.ok(Object.isFrozen(brand.teamRows[0][1]));
  assert.ok(Object.isFrozen(brand.logoRecords));assert.ok(Object.isFrozen(brand.logoRecords[0].identity));
});
