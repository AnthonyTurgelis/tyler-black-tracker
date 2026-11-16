const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../copy-utils.js');

const context = {statuses:{42:'owned'}, cardDetails:{42:{qty:'2'}}, now:'2026-11-16T19:00:00.000Z'};
const purchased = (source, id, extra={}) => ({
  id, cardId:42, origin:'purchase', source,
  location:source==='comc'?'comc':'unknown', saleStatus:'none', ...extra
});

test('unconfirmed eBay purchase does not increase total, even if flag is omitted', () => {
  const row = purchased('ebay','purchase:ebay:order:a:item:b:1');
  assert.equal(C.isCountedCopy(row),false);
  const result = C.summarizeCard({copies:{[row.id]:row}},42,context.statuses,context.cardDetails);
  assert.equal(result.total,2);
});

test('user-confirmed eBay and COMC copies remain counted', () => {
  assert.equal(C.isCountedCopy(purchased('ebay','purchase:ebay:x',{currentInventory:true})),true);
  assert.equal(C.isCountedCopy(purchased('comc','purchase:comc:x')),true);
  assert.equal(C.isCountedCopy(purchased('comc','purchase:comc:x',{currentInventory:false})),false);
});

test('a second transit stoplight preserves one hand copy and quantity 2', () => {
  const result=C.quickStatusPresence(null,42,'in_transit',context);
  assert.equal(result.handled,true);
  assert.equal(result.changed,true);
  const summary=C.summarizeCard(result.inventory,42,context.statuses,context.cardDetails);
  assert.equal(summary.total,2);
  assert.equal(summary.owned,true);
  assert.equal(summary.inTransit,true);
  assert.equal(summary.locations.in_hand,1);
  assert.equal(summary.locations.in_transit,1);
  const again=C.quickStatusPresence(result.inventory,42,'in_transit',context);
  assert.equal(again.changed,false);
});

test('owner confirmation on a new purchase explicitly sets counted=true', () => {
  const staged=C.upsertPurchase(null,{
    source:'ebay',sourceOrderId:'qa-1',sourceItemId:'qa-2',cardId:42,
    title:'2024 Tyler Black Chrome Update'
  },{now:context.now});
  const result=C.resolveObservation(staged.inventory,staged.observationId,
    {cardId:42,confirmAdditional:true},{statuses:{},cardDetails:{},now:context.now});
  assert.equal(result.inventory.copies[result.copyId].currentInventory,true);
});
