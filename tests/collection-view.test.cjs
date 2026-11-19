const test=require('node:test'),assert=require('node:assert/strict');
const V=require('../collection-view.js'),C=require('../copy-utils.js');

test('indexed sport counts preserve mixed legacy quantities, confirmed copies, sold and archived exclusions',()=>{
 const state={cards:{1:{id:1},2:{id:2},3:{id:3},4:{id:4},5:{id:5}},statuses:{1:'owned',2:'not_owned',3:'not_owned',4:'owned',5:'owned'},details:{1:{ownedQty:2,transitQty:1,qty:3,wantedQty:4},2:{qty:0},3:{wantedQty:1},4:{qty:2},5:{qty:1}}};
 const copies={ready:true,value:{version:1,baselines:{1:{quantity:3,status:'owned',details:{ownedQty:2,transitQty:1}},2:{quantity:0,status:'not_owned'},5:{quantity:1,status:'owned'}},copies:{
  'legacy:1:1':{id:'legacy:1:1',cardId:1,location:'in_hand',origin:'legacy'},
  comc1:{id:'comc1',cardId:'001',location:'comc',currentInventory:true},
  sold:{id:'sold',cardId:1,location:'in_hand',saleStatus:'sold'},
  provisional:{id:'purchase:ebay:x',cardId:1,location:'in_transit',origin:'purchase',source:'eBay'},
  two:{id:'two',cardId:2,location:'comc',currentInventory:true},
  unlocated:{id:'unlocated',cardId:2,location:'unknown',currentInventory:true},
  'legacy:5:1':{id:'legacy:5:1',cardId:5,location:'in_hand',archived:true},
  unrelated:{id:'unrelated',cardId:'tcdb:999',location:'in_hand',currentInventory:true}
 },observations:{unmatched:{cardId:3,source:'eBay',quantity:8}}}};
 const before=JSON.stringify([state,copies]),indexed=V.indexCounts(state,copies,C);
 for(const card of Object.values(state.cards))assert.deepEqual(indexed[card.id],V.countCard(state,card.id,copies,C),String(card.id));
 assert.deepEqual(indexed[1],{owned:2,transit:2,unknown:0,wanted:4,managed:true});
 assert.deepEqual(indexed[2],{owned:0,transit:1,unknown:1,wanted:0,managed:true});
 assert.equal(indexed[3].owned+indexed[3].transit,0);assert.equal(indexed[4].owned,2);assert.equal(indexed[5].owned,0);
 assert.equal(JSON.stringify([state,copies]),before);
});

test('loading copies or another scope cannot reset existing manual counts',()=>{
 const state={cards:{'tcdb:1':{id:'tcdb:1'}},statuses:{'tcdb:1':'owned'},details:{'tcdb:1':{qty:3,ownedQty:2,transitQty:1,wantedQty:1}}};
 for(const copyState of [null,{ready:false,value:{copies:{bad:{cardId:'tcdb:1',location:'unknown'}}}}])assert.deepEqual(V.indexCounts(state,copyState,C)['tcdb:1'],{owned:2,transit:1,unknown:0,wanted:1,managed:false});
});

test('multi-subject summary and player filters retain one physical catalogue total',()=>{
 const cards=[{id:1,subject:'A Driver / B Driver',year:2026,product:'Prizm'},{id:2,subject:'A Driver',subjects:['A Driver','A Driver'],year:2025,product:'Select'}];
 const quantities={1:{owned:1,transit:1,wanted:0,unknown:0},2:{owned:0,transit:0,wanted:2,unknown:0}},get=id=>quantities[id];
 const summary=V.summarize(cards,get);
 assert.equal(summary.total.total,2);assert.equal(summary.total.acquiredCards,1);assert.equal(summary.total.needCards,1);assert.equal(summary.total.owned,1);assert.equal(summary.total.transit,1);
 assert.equal(summary.subjects.find(row=>row.key==='A Driver').total,2);assert.equal(summary.subjects.find(row=>row.key==='B Driver').total,1);
 assert.equal(V.matches(cards[0],{subject:'B Driver'},get(1)),true);assert.equal(V.matches(cards[1],{subject:'B Driver'},get(2)),false);
});

test('filters keep variants, serials, numbers and acquired status independent',()=>{
 const card={id:'tcdb:1',subject:'Daniel Suárez',year:2026,product:'Prizm',cardSet:'Gold',cardNumber:12,printRun:10,attributes:'AU, SN10'},count={owned:1,transit:1,wanted:1,unknown:0},detail={serial:'03/10',notes:'In-person signing'};
 assert.equal(V.matches(card,{query:'suarez 03/10',variant:'Gold',cardNumber:'12',kind:'auto',status:'in_transit'},count,detail),true);
 for(const filter of [{variant:'Gold Vinyl'},{cardNumber:'112'},{kind:'rookie'},{status:'unowned'}])assert.equal(V.matches(card,filter,count,detail),false);
 assert.equal(V.matches(card,{status:'owned'},count,detail),true);assert.equal(V.matches(card,{status:'duplicates'},count,detail),true);
 assert.equal(V.facts({cardSet:'Autograph Rookie'}).auto,false);assert.equal(V.facts({cardSet:'Autograph Rookie'}).rookie,false);
 assert.equal(V.facts({printRun:75,serialNumbered:false}).numbered,false);
 for(const cardSet of ['Gold /10','Gold / 10','Gold SN10'])assert.equal(V.facts({printRun:10,cardSet}).variantShowsPrintRun,true);
 assert.equal(V.facts({printRun:1,cardSet:'Black 1/1'}).variantShowsPrintRun,true);
 for(const cardSet of ['Gold /100','Gold #10','Gold'])assert.equal(V.facts({printRun:10,cardSet}).variantShowsPrintRun,false);
});

test('sorting leaves catalogue order and quantities unchanged while comparing numeric card numbers',()=>{
 const cards=[{id:2,cardNumber:'100'},{id:1,cardNumber:'9'},{id:3,cardNumber:'10'}],before=JSON.stringify(cards),counts={1:{owned:2},2:{owned:0},3:{owned:1}};
 assert.deepEqual(V.sortCards(cards,'cardNumber',1,id=>counts[id]).map(c=>c.id),[1,3,2]);
 assert.deepEqual(V.sortCards(cards,'owned',-1,id=>counts[id]).map(c=>c.id),[1,3,2]);
 assert.equal(JSON.stringify(cards),before);
});
