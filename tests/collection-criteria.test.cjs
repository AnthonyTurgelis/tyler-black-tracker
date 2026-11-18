const test=require('node:test'),assert=require('node:assert/strict'),C=require('../collection-criteria');
const src='https://www.tcdb.com/ViewCard.cfm/cid/123';
const group=(rules,extra={})=>({id:'focus',sport:'racing',priority:'primary',rules,...extra});
const criteria=rules=>({groups:[group(rules)]});
const card=extra=>({id:'tcdb:123',subject:'Example Driver',sport:'racing',sourceUrl:src,year:'2026',...extra});
const rule=extra=>({id:'driver',subjects:['Example Driver'],anyOf:[{feature:'rookie'},{feature:'scheme',brand:'Example Sponsor'}],...extra});
test('named driver alone remains potential for qualified criteria; source-backed RC qualifies',()=>{
 assert.equal(C.classify(card({}),criteria([rule()])).matches[0].match,'potential');
 assert.equal(C.classify(card({isRC:'Yes'}),criteria([rule()])).matches[0].match,'confirmed');
 assert.equal(C.classify(card({isRC:'Yes',sourceUrl:''}),criteria([rule()])).matches[0].match,'potential');
});
test('sponsor affiliation and brand text never manufacture exact-card scheme evidence',()=>{
 const r=rule({anyOf:[{feature:'scheme',brand:'Example Sponsor'}]});
 assert.equal(C.classify(card({team:'Example Sponsor',title:'Example Sponsor Driver'}),criteria([r])).confirmed,false);
 assert.equal(C.classify(card({criteriaEvidence:[{feature:'scheme',brand:'Example Sponsor',verified:true,sourceUrl:src}]}),criteria([r])).confirmed,true);
 assert.equal(C.classify(card({criteriaEvidence:[{feature:'scheme',brand:'Example Sponsor',verified:true,sourceUrl:'javascript:no'}]}),criteria([r])).confirmed,false);
});
test('source year bounds, held identity and ambiguous scope prevent automatic confirmation',()=>{
 assert.equal(C.classify(card({year:'2023',isRC:'Yes'}),criteria([rule({yearMin:2024})])).matches.length,0);
 assert.equal(C.classify(card({year:'',isRC:'Yes'}),criteria([rule({yearMin:2024})])).confirmed,false);
 assert.equal(C.classify(card({isRC:'Yes'}),criteria([rule({reviewOnly:true})])).confirmed,false);
});
test('contradictory exact-card evidence is held rather than promoted',()=>{
 const criteriaEvidence=[{feature:'scheme',brand:'Example Sponsor',verified:true,sourceUrl:src},{feature:'scheme',brand:'Example Sponsor',verified:true,sourceUrl:src,matches:false}];
 const result=C.classify(card({criteriaEvidence}),criteria([rule({anyOf:[{feature:'scheme',brand:'Example Sponsor'}]})]));
 assert.equal(result.confirmed,false);assert.equal(result.matches[0].match,'potential');
});
test('print run cannot stand in for SP and checklist AU/RC evidence stays specific',()=>{
 const r=rule({anyOf:[{feature:'shortPrint'}]});
 assert.equal(C.classify(card({printRun:1,attributes:'SN1'}),criteria([r])).confirmed,false);
 assert.equal(C.classify(card({attributes:'SP'}),criteria([r])).confirmed,true);
 assert.equal(C.classify(card({attributes:'AU'}),criteria([r])).confirmed,false);
});
test('exact subject normalization supports multi-subject cards without surname or team matches',()=>{
 const r=rule({subjects:['J.J. Yeley'],anyOf:[]});
 assert.equal(C.classify(card({subject:'JJ Yeley / Other Person'}),criteria([r])).confirmed,true);
 assert.equal(C.classify(card({subject:'Yeley'}),criteria([r])).matches.length,0);
 assert.equal(C.classify(card({subject:'Other Person',team:'JJ Yeley'}),criteria([r])).matches.length,0);
});
test('subjectless brand criteria do not mark the entire catalog potential',()=>{
 const r=rule({subjects:[],anyOf:[{feature:'brandPatch',brand:'Example Sponsor'}]});
 assert.equal(C.classify(card({}),criteria([r])).matches.length,0);
 assert.equal(C.classify(card({title:'Example Sponsor Patch'}),criteria([r])).matches[0].match,'potential');
});
test('overlapping groups count each card once within a view and filtering never mutates records',()=>{
 const cfg={groups:[group([rule()]),group([rule({anyOf:[]})],{id:'second',priority:'secondary'})]};
 const cards=[card({isRC:'Yes'}),card({id:'tcdb:2',subject:'Someone Else'})],before=JSON.stringify(cards),index=C.buildIndex(cards,cfg);
 assert.deepEqual(index.counts.all,{confirmed:1,potential:0});assert.equal(index.counts.ungrouped.total,1);
 assert.equal(C.filter(cards,cfg,'primary','confirmed').length,1);assert.equal(C.filter(cards,cfg,'ungrouped').length,1);
 assert.equal(JSON.stringify(cards),before);
});
