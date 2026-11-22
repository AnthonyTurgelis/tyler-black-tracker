const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const CI=require('../copy-utils.js'),TM=require('../media-utils.js');
const source=fs.readFileSync(require.resolve('../inventory-panel.jsx'),'utf8');
const card={id:'tcdb:123',subject:'Ryan Blaney',year:2025,product:'Panini Prizm',cardNumber:'12',cardSet:'Base'};
function fixture(sourceName,existing=false){
 const context={statuses:{},cardDetails:{},cardById:{[card.id]:card},now:'2026-11-19T12:00:00.000Z'};
 let initial={};
 if(existing)initial=CI.addManualCopy({},card.id,{location:'in_hand'},{...context,confirmAdditional:true}).inventory;
 const staged=CI.upsertPurchase(initial,{cardId:card.id,source:sourceName,sourceItemId:'item1',sourceOrderId:'order1',deliveryStatus:'Delivered'},context);
 const observation={...staged.inventory.observations[staged.observationId],identityConfirmed:true};
 staged.inventory.observations[staged.observationId]=observation;
 const ctx={CI,TM,...context,state:staged.inventory,selectedCard:card,primaryJerseyNumber:null,form:null,busy:false,saveLock:{current:false},canEdit:true,
  setShowMore:()=>{},setCardQuery:()=>{},setNotice:()=>{},setBusy:()=>{},setError:value=>{ctx.error=value;},setForm:value=>{ctx.form=value;},
  onInventoryChange:async next=>{ctx.saved=next;return {ok:true};}};
 vm.createContext(ctx);
 for(const [start,end] of [['  function openPurchase(','  function openManual('],['  async function persist(','  async function splitLot(']]){
  const from=source.indexOf(start),to=source.indexOf(end,from);assert.ok(from>=0&&to>from);vm.runInContext(source.slice(from,to),ctx);
 }
 ctx.openPurchase(observation);
 return {ctx,observation,existingCopyId:Object.keys(initial.copies||{})[0],save:()=>ctx.saveForm({preventDefault(){}})};
}
test('untouched purchase review saves new delivered purchases to the incoming source location',async()=>{
 for(const [sourceName,location] of [['ebay','in_transit'],['comc','comc']]){
  const f=fixture(sourceName);assert.equal(f.ctx.form.location,'');
  f.ctx.form={...f.ctx.form,existingCopyId:'__new__',confirmAdditional:true};await f.save();
  assert.equal(f.ctx.error,'');assert.ok(f.ctx.saved);
  const copy=Object.values(f.ctx.saved.copies)[0];assert.equal(copy.location,location);
  const summary=CI.summarizeCard(f.ctx.saved,card.id,{},{});assert.equal(summary.transitQty,1);assert.equal(summary.ownedQty,0);assert.equal(summary.unknownQty,0);
 }
});
test('untouched location in purchase review preserves an existing manually received copy',async()=>{
 for(const sourceName of ['ebay','comc']){
  const f=fixture(sourceName,true);f.ctx.form={...f.ctx.form,existingCopyId:f.existingCopyId};await f.save();
  assert.equal(f.ctx.error,'');assert.equal(f.ctx.saved.copies[f.existingCopyId].location,'in_hand');
  assert.equal(Object.keys(f.ctx.saved.copies).length,1);
 }
});
test('deliberate location selections remain effective during purchase review',async()=>{
 for(const location of ['unknown','in_hand','in_transit']){
  const f=fixture('ebay');f.ctx.form={...f.ctx.form,existingCopyId:'__new__',confirmAdditional:true,location};await f.save();
  assert.equal(Object.values(f.ctx.saved.copies)[0].location,location);
 }
 const linked=fixture('comc',true);linked.ctx.form={...linked.ctx.form,existingCopyId:linked.existingCopyId,location:'in_transit'};await linked.save();
 assert.equal(linked.ctx.saved.copies[linked.existingCopyId].location,'in_transit');
});
