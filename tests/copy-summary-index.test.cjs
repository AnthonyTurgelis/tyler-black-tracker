const test=require('node:test'),assert=require('node:assert/strict'),C=require('../copy-utils');
function equalAll(input,cards,statuses,details){const before=JSON.stringify([input,cards,statuses,details]),summaries=C.summarizeCards(input,cards,statuses,details);for(const card of cards)assert.deepEqual(summaries[String(card.id)],C.summarizeCard(input,card.id,statuses,details),String(card.id));assert.equal(JSON.stringify([input,cards,statuses,details]),before);return summaries;}
test('indexed summaries preserve managed, legacy, mixed-location and excluded copy semantics',()=>{
 const stringId='tcdb:9007199254740993123',cards=[7,8,9,10,11,12,stringId].map(id=>({id}));
 const statuses={7:'owned',8:'owned',9:'not_owned',10:'not_owned',11:'in_transit',12:'owned',[stringId]:'not_owned'},details={7:{qty:2,ownedQty:1,transitQty:1},8:{qty:3},11:{qty:2},12:{qty:0}};
 const copy=(id,cardId,extra)=>({id,cardId,origin:'manual',location:'unknown',saleStatus:'none',...extra});
 const inventory={baselines:{7:{cardId:7,quantity:2,status:'owned',details:details[7]},8:{cardId:8,quantity:7,status:'in_transit',details:{qty:7}}},copies:{
  'legacy:7:1':copy('legacy:7:1',7,{origin:'legacy',location:'in_hand'}),'legacy:7:2':copy('legacy:7:2',7,{origin:'legacy',archived:true}),
  comc:copy('comc',7,{location:'comc',duplicateConfirmed:true}),listed:copy('listed',7,{location:'comc',saleStatus:'listed'}),sold:copy('sold',7,{saleStatus:'sold'}),
  ebay:copy('ebay',9,{origin:'purchase',source:'eBay'}),excluded:copy('excluded',10,{currentInventory:false}),unknown:copy('unknown',stringId,{currentInventory:true}),
  numeric:copy('numeric','12',{location:'in_hand',currentInventory:true})},observations:{pending:{cardId:8,quantity:5}},updatedAt:'2026-11-19T00:00:00Z'};
 const result=equalAll(inventory,cards,statuses,details);assert.equal(result['8'].managed,false);assert.equal(result['8'].total,3);assert.equal(result['9'].total,0);assert.equal(result[stringId].unknownQty,1);assert.equal(result['12'].ownedQty,1);
});
test('legacy anchor lookup and orphan baselines remain identical to the existing summary function',()=>{
 const cards=[{id:7},{id:8},{id:'card:encoded%20subject'}],state={baselines:{7:{quantity:2,status:'owned',details:{}},8:{quantity:9,status:'owned',details:{}}},copies:{'legacy:7:1':{id:'legacy:7:1',cardId:8,origin:'manual',location:'in_hand'},'legacy:card:encoded%20subject:1':{id:'legacy:card:encoded%20subject:1',cardId:'card:encoded%20subject',location:'comc'}}};
 equalAll(state,cards,{7:'owned',8:'not_owned','card:encoded%20subject':'in_transit'},{7:{qty:1},'card:encoded%20subject':{qty:1}});
});
test('copy indexing avoids scanning unrelated copies for each catalog card',()=>{
 let reads=0;const copies={},cards=[];
 for(let id=1;id<=500;id++){cards.push({id});copies['copy-'+id]={id:'copy-'+id,get cardId(){reads++;return id;},location:'in_hand',currentInventory:true};}
 const summaries=C.summarizeCards({copies},cards,{},{});
 assert.equal(Object.keys(summaries).length,500);assert.equal(summaries['499'].total,1);assert.ok(reads<10000,'card-ID reads should grow with copies, not copies × catalog cards');
});
