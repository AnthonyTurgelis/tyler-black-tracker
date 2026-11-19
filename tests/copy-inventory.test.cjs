const test = require('node:test');
const assert = require('node:assert/strict');
const CI = require('../copy-utils.js');
const NOW = '2026-11-16T04:00:00.000Z';
const context = {statuses:{7:'owned',8:'in_transit',9:'not_owned'},cardDetails:{7:{qty:'2',serial:'11',price:'$4.00'}},now:NOW};
const purchase = {cardId:7,source:'ebay',sourceItemId:'1001',sourceOrderId:'order-one',title:'A card',purchaseDate:'2026-11-14'};

test('matching COMC metadata carries front/back scans but preserves own photos and does not claim image verification',()=>{
  const own={id:'own-front',url:'https://images.example.test/own.jpg',side:'front',kind:'own_photo'};
  const scan={id:'scan-front',url:'https://images.example.test/scan.jpg',side:'front',kind:'copy_scan'};
  let inventory=CI.editCopy({},7,'legacy:7:1',{photos:[own]},context);
  const staged=CI.upsertPurchase(inventory,{cardId:7,source:'comc',sourceItemId:'metadata-photos',serial:'07/25',photos:[scan,{...scan,id:'scan-back',url:'https://images.example.test/back.jpg',side:'back'}]},{...context,serialEvidence:'comc_inventory'});
  const resolved=CI.resolveObservation(staged.inventory,staged.observationId,{existingCopyId:'legacy:7:1'},context);
  const copy=resolved.inventory.copies['legacy:7:1'];
  assert.equal(copy.photos.length,3);assert.equal(copy.photos[0].kind,'own_photo');assert.equal(copy.photos[0].id,'own-front');
  assert.equal(copy.serial,'07/25');assert.equal(copy.serialEvidence,'comc_inventory');assert.equal(copy.imageVerified,false);
  assert.equal(CI.summarizeCard(resolved.inventory,7,context.statuses,context.cardDetails).total,2);
});

test('copy photo edits reject unsafe URLs and manual serial changes clear the older image-verification claim',()=>{
  const staged=CI.upsertPurchase({}, {...purchase,serial:'7/25'},{...context,imageVerified:true});
  const resolved=CI.resolveObservation(staged.inventory,staged.observationId,{existingCopyId:'legacy:7:1'},context);
  const before=JSON.stringify(resolved.inventory);
  assert.throws(()=>CI.editCopy(resolved.inventory,7,'legacy:7:1',{photos:[{url:'javascript:alert(1)',kind:'own_photo',side:'front'}]},context),/HTTPS/);
  assert.equal(JSON.stringify(resolved.inventory),before);
  const edited=CI.editCopy(resolved.inventory,7,'legacy:7:1',{serial:'8/25'},context);
  assert.equal(edited.copies['legacy:7:1'].serialEvidence,'manual');assert.equal(edited.copies['legacy:7:1'].imageVerified,false);
});

test('secondary jersey evidence follows a matched observation without replacing an explicit copy override',()=>{
  const photo={id:'uniform',url:'https://images.example.test/uniform.jpg',kind:'copy_scan',side:'front'};
  let staged=CI.upsertPurchase({},purchase,context);
  staged.inventory.observations[staged.observationId]={...staged.inventory.observations[staged.observationId],photos:[photo],secondaryJerseyNumber:'20',secondaryJerseyEvidence:{confirmed:true,photoId:'uniform',number:'20'}};
  const result=CI.resolveObservation(staged.inventory,staged.observationId,{existingCopyId:'legacy:7:1'},context);
  assert.equal(result.inventory.copies['legacy:7:1'].secondaryJerseyNumber,'20');
  const overridden=CI.editCopy(staged.inventory,7,'legacy:7:1',{secondaryJerseyNumber:'88',secondaryJerseyEvidence:{confirmed:true,sourceUrl:'https://example.test/uniform',note:'88 visible'}},context);
  assert.equal(CI.resolveObservation(overridden,staged.observationId,{existingCopyId:'legacy:7:1'},context).inventory.copies['legacy:7:1'].secondaryJerseyNumber,'88');
});

test('splitting a lot retains photos as references and does not duplicate its individual jersey claim',()=>{
  const staged=CI.upsertPurchase({}, {...purchase,quantity:2,photos:[{id:'lot',url:'https://example.test/lot.jpg',kind:'copy_scan',side:'front'}]},context);
  staged.inventory.observations[staged.observationId].secondaryJerseyNumber='20';
  staged.inventory.observations[staged.observationId].secondaryJerseyEvidence={confirmed:true,photoId:'lot'};
  const split=CI.splitObservation(staged.inventory,staged.observationId,2,context);
  for(const id of split.observationIds){const child=split.inventory.observations[id];assert.equal(child.photos[0].kind,'reference');assert.equal(child.secondaryJerseyNumber,undefined);assert.equal(child.secondaryJerseyEvidence,undefined);}
});

test('legacy copy slots preserve quantity and Owned without assuming a location', () => {
  const before = JSON.stringify(context);
  const copies = CI.getCopiesForCard({},7,context.statuses,context.cardDetails);
  assert.equal(copies.length,2);
  assert.deepEqual(copies.map(c=>c.location),['unknown','unknown']);
  assert.ok(copies.every(c=>c.legacyStatus==='owned'&&c.unallocated));
  assert.ok(copies.every(c=>c.serial===''&&c.paidPrice===''));
  assert.equal(CI.summarizeCard({},7,context.statuses,context.cardDetails).legacyOwned,true);
  assert.equal(JSON.stringify(context),before);
});

test('reimporting the same purchase is idempotent and never adds physical copies', () => {
  const first = CI.upsertPurchase({},purchase,context);
  const second = CI.upsertPurchase(first.inventory,purchase,{...context,now:'2026-11-16T05:00:00Z'});
  assert.equal(first.changed,true);
  assert.equal(second.changed,false);
  assert.equal(Object.keys(second.inventory.observations).length,1);
  assert.equal(CI.getCopiesForCard(second.inventory,7,context.statuses,context.cardDetails).length,2);
});

test('eBay repeated fixed-price listing purchases retain separate order identities', () => {
  const one = CI.upsertPurchase({},purchase,context);
  const two = CI.upsertPurchase(one.inventory,{...purchase,sourceOrderId:'order-two'},context);
  assert.equal(Object.keys(two.inventory.observations).length,2);
  assert.equal(CI.getCopiesForCard(two.inventory,7,context.statuses,context.cardDetails).length,2);
  assert.equal(CI.upsertPurchase({}, {source:'ebay',sourceItemId:'reused-listing'}, context).changed,false);
});

test('purchase staging creates no physical copy or baseline and leaves later manual legacy edits effective', () => {
  const staged = CI.upsertPurchase({}, {...purchase,cardId:9},context);
  assert.equal(CI.getCopiesForCard(staged.inventory,9,context.statuses,{}).length,0);
  assert.equal(staged.inventory.baselines[9],undefined);
  const statuses = {...context.statuses,9:'owned'};
  assert.equal(CI.getCopiesForCard(staged.inventory,9,statuses,{}).length,1);
  assert.equal(CI.summarizeCard(staged.inventory,9,statuses,{}).managed,false);
  assert.equal(CI.getCopiesForCard(staged.inventory,9,statuses,{9:{qty:'2'}}).length,2);
  assert.equal(context.statuses[9],'not_owned');
});

test('pending-only old baselines cannot freeze manual counts and materialization snapshots the current count',()=>{
  const inventory={baselines:{9:{cardId:9,quantity:0,status:'not_owned',details:{}}},copies:{},observations:{}};
  const updated={statuses:{9:'owned'},cardDetails:{9:{qty:'2'}},now:NOW};
  assert.equal(CI.summarizeCard(inventory,9,updated.statuses,updated.cardDetails).total,2);
  assert.equal(CI.summarizeCard(inventory,9,updated.statuses,updated.cardDetails).managed,false);
  const edited=CI.editCopy(inventory,9,'legacy:9:1',{location:'in_hand'},updated);
  assert.equal(edited.baselines[9].quantity,2);assert.equal(CI.summarizeCard(edited,9,updated.statuses,updated.cardDetails).managed,true);
});

test('explicitly receiving a managed transit copy clears its old awaiting-receipt flag without changing legacy data',()=>{
  const input=CI.editCopy({},8,'legacy:8:1',{location:'comc'},context);
  assert.equal(CI.summarizeCard(input,8,context.statuses,context.cardDetails).owned,false);
  const received=CI.editCopy(input,8,'legacy:8:1',{location:'in_hand'},context);
  const summary=CI.summarizeCard(received,8,context.statuses,context.cardDetails);
  assert.equal(summary.owned,true);assert.equal(summary.inTransit,false);assert.equal(summary.total,1);
  assert.equal(context.statuses[8],'in_transit');
});

test('explicitly allocating all legacy Owned copies overrides only their derived ownership while unallocated slots retain the mark',()=>{
  const one={statuses:{9:'owned'},cardDetails:{},now:NOW};
  const comc=CI.editCopy({},9,'legacy:9:1',{location:'comc'},one);
  assert.equal(CI.summarizeCard(comc,9,one.statuses,one.cardDetails).owned,false);
  assert.equal(CI.summarizeCard(comc,9,one.statuses,one.cardDetails).inTransit,true);
  assert.equal(one.statuses[9],'owned');
  const partial=CI.editCopy({},7,'legacy:7:1',{location:'comc'},context);
  assert.equal(CI.summarizeCard(partial,7,context.statuses,context.cardDetails).owned,true,'the second unallocated Owned slot remains effective');
  const both=CI.editCopy(partial,7,'legacy:7:2',{location:'in_hand'},context);
  const mixed=CI.summarizeCard(both,7,context.statuses,context.cardDetails);
  assert.equal(mixed.owned,true);assert.equal(mixed.inTransit,true);assert.equal(mixed.total,2);
});

test('order totals and title serials cannot become verified per-copy fields', () => {
  const staged = CI.upsertPurchase({}, {...purchase,orderTotal:'99.00',paidPrice:'99.00',serial:'7/25',printRun:'25',currency:'USD'},context);
  const o = staged.inventory.observations[staged.observationId];
  assert.equal(o.paidPrice,undefined);
  assert.equal(o.serial,undefined);
  assert.equal(o.reportedSerial,'7/25');
  const linked = CI.resolveObservation(staged.inventory,staged.observationId,{cardId:7,existingCopyId:'legacy:7:1'},context);
  assert.equal(linked.inventory.copies['legacy:7:1'].paidPrice,'');
  assert.equal(linked.inventory.copies['legacy:7:1'].serial,'');
});

test('linking a verified purchase to an existing slot fills missing details without growing quantity', () => {
  const staged = CI.upsertPurchase({}, {...purchase,paidPrice:'4.50',currency:'USD',serial:'07/25'},{...context,priceVerified:true,imageVerified:true});
  const linked = CI.resolveObservation(staged.inventory,staged.observationId,{existingCopyId:'legacy:7:1',location:'in_hand'},context);
  assert.equal(CI.getCopiesForCard(linked.inventory,7,context.statuses,context.cardDetails).length,2);
  assert.equal(linked.inventory.copies['legacy:7:1'].paidPrice,'4.50');
  assert.equal(linked.inventory.copies['legacy:7:1'].serial,'07/25');
  assert.equal(linked.inventory.copies['legacy:7:1'].location,'in_hand');
  assert.equal(CI.resolveObservation(linked.inventory,staged.observationId,{confirmAdditional:true},context).changed,false);
});

test('additional copies require confirmation and a variant can have in-hand plus in-transit copies', () => {
  let inventory = CI.editCopy({},7,'legacy:7:1',{location:'in_hand'},context);
  const staged = CI.upsertPurchase(inventory,purchase,context);
  assert.throws(()=>CI.resolveObservation(staged.inventory,staged.observationId,{location:'in_transit'},context),/Confirm this is an additional/);
  const result = CI.resolveObservation(staged.inventory,staged.observationId,{confirmAdditional:true,location:'in_transit'},context);
  const summary = CI.summarizeCard(result.inventory,7,context.statuses,context.cardDetails);
  assert.equal(summary.total,3);
  assert.equal(summary.hasInHand,true);
  assert.equal(summary.hasInTransit,true);
  assert.equal(summary.legacyOwned,true);
});
test('new confirmed purchases default to incoming even when a receipt reports delivered',()=>{
 const emptyContext={statuses:{},cardDetails:{},now:NOW};
 for(const [source,location] of [['ebay','in_transit'],['comc','comc'],['other','in_transit']]){
  const staged=CI.upsertPurchase({}, {...purchase,source,deliveryStatus:'Delivered'},emptyContext);
  const resolved=CI.resolveObservation(staged.inventory,staged.observationId,{confirmAdditional:true},emptyContext);
  assert.equal(resolved.inventory.copies[resolved.copyId].location,location);
  assert.equal(resolved.inventory.observations[staged.observationId].observedDeliveryStatus,'Delivered');
  const summary=CI.summarizeCard(resolved.inventory,7,emptyContext.statuses,emptyContext.cardDetails);
  assert.equal(summary.transitQty,1);assert.equal(summary.ownedQty,0);assert.equal(summary.unknownQty,0);
 }
 const staged=CI.upsertPurchase({},purchase,emptyContext);
 const manual=CI.resolveObservation(staged.inventory,staged.observationId,{confirmAdditional:true,location:'in_hand'},emptyContext);
 assert.equal(manual.inventory.copies[manual.copyId].location,'in_hand');
});
test('linking another purchase never applies an incoming default to an existing manually received copy',()=>{
 const inventory=CI.editCopy({},7,'legacy:7:1',{location:'in_hand'},context);
 for(const source of ['ebay','comc']){
  const staged=CI.upsertPurchase(inventory,{...purchase,source,deliveryStatus:'Shipped'},context);
  const resolved=CI.resolveObservation(staged.inventory,staged.observationId,{existingCopyId:'legacy:7:1'},context);
  assert.equal(resolved.inventory.copies['legacy:7:1'].location,'in_hand');
  assert.equal(CI.summarizeCard(resolved.inventory,7,context.statuses,context.cardDetails).total,2);
 }
});

test('different serials cannot be linked into the same physical copy', () => {
  let inventory = CI.editCopy({},7,'legacy:7:1',{serial:'06/10'},context);
  let staged = CI.upsertPurchase(inventory,{...purchase,serial:'05/10'},{...context,imageVerified:true});
  assert.throws(()=>CI.resolveObservation(staged.inventory,staged.observationId,{existingCopyId:'legacy:7:1'},context),/serial numbers differ/);
  assert.equal(CI.sameSerial('007/025','7/25'),true);
  assert.equal(CI.sameSerial('-3/0','-3/0'),true);
});

test('COMC item IDs deduplicate observations and explicit extras get review, not a listing', () => {
  const p = {cardId:7,source:'comc',sourceItemId:'comc-123',title:'One copy'};
  let staged = CI.upsertPurchase({},p,context);
  staged = CI.upsertPurchase(staged.inventory,p,context);
  assert.equal(Object.keys(staged.inventory.observations).length,1);
  const result = CI.resolveObservation(staged.inventory,staged.observationId,{confirmAdditional:true,location:'comc',duplicateConfirmed:true},context);
  const copy = result.inventory.copies[result.copyId];
  assert.equal(copy.saleStatus,'review');
  assert.equal(CI.needsSaleReview(copy),true);
  const listed = CI.editCopy(result.inventory,7,copy.id,{saleStatus:'listed',listingUrl:'https://www.comc.com/example'},context);
  assert.equal(CI.needsSaleReview(listed.copies[copy.id]),false);
});

test('a multi-card lot cannot silently become one new counted copy', () => {
  const staged = CI.upsertPurchase({}, {...purchase,quantity:3,paidPrice:'30',currency:'USD',serial:'1/1'},{...context,priceVerified:true,imageVerified:true});
  assert.throws(()=>CI.resolveObservation(staged.inventory,staged.observationId,{confirmAdditional:true},context),/multiple cards/);
  const split = CI.splitObservation(staged.inventory,staged.observationId,3,context);
  assert.equal(split.observationIds.length,3);
  assert.equal(CI.getCopiesForCard(split.inventory,7,context.statuses,context.cardDetails).length,2);
  assert.ok(split.observationIds.every(id=>!split.inventory.observations[id].paidPrice&&!split.inventory.observations[id].serial));
  assert.equal(CI.splitObservation(split.inventory,staged.observationId,3,context).changed,false);
  const result = CI.resolveObservation(split.inventory,split.observationIds[0],{confirmAdditional:true},context);
  assert.equal(CI.getCopiesForCard(result.inventory,7,context.statuses,context.cardDetails).length,3);
  assert.equal(Object.values(result.inventory.observations).filter(o=>o.disposition==='pending').length,2);
  assert.throws(()=>CI.resolveObservation(result.inventory,split.observationIds[1],{existingCopyId:result.copyId},context),/same lot/);
  const enriched = CI.upsertPurchase(result.inventory,{...purchase,observationId:split.observationIds[1],serial:'2/2'},{...context,imageVerified:true});
  assert.equal(enriched.observationId,split.observationIds[1]);
  assert.equal(enriched.inventory.observations[split.observationIds[1]].serial,'2/2');
});

test('independent copy edits merge by record timestamp', () => {
  const a = CI.editCopy({},7,'legacy:7:1',{location:'comc'},context);
  const b = CI.editCopy({},7,'legacy:7:2',{location:'oklahoma_mailbox'},{...context,now:'2026-11-16T05:00:00Z'});
  const merged = CI.mergeStates(a,b);
  assert.equal(merged.copies['legacy:7:1'].location,'comc');
  assert.equal(merged.copies['legacy:7:2'].location,'oklahoma_mailbox');
  assert.equal(CI.getCopiesForCard(merged,7,context.statuses,context.cardDetails).length,2);
});

test('collection flags include Owned and Transit independently while acquired counts each variant once', () => {
  let inventory=CI.addManualCopy({},7,{location:'in_transit'},{...context,confirmAdditional:true}).inventory;
  const mixed=CI.summarizeCard(inventory,7,context.statuses,context.cardDetails);
  const needed=CI.summarizeCard(inventory,9,context.statuses,context.cardDetails);
  assert.equal(mixed.total,3); assert.equal(mixed.owned,true); assert.equal(mixed.inTransit,true);
  for (const filter of ['owned','in_transit','acquired']) assert.equal(CI.matchesStatus(mixed,filter),true);
  assert.equal(CI.matchesStatus(mixed,'not_owned'),false);
  assert.deepEqual(CI.countCards([mixed,needed]),{total:2,owned:1,inTransit:1,acquired:1,notOwned:1});
  assert.equal(context.statuses[7],'owned'); assert.equal(context.cardDetails[7].qty,'2');
});

test('COMC, Oklahoma, and unknown purchased copies are acquired but never automatically In hand or Owned', () => {
  for (const location of ['comc','oklahoma_mailbox','unknown','in_transit']) {
    const inventory=CI.addManualCopy({},9,{location},{...context,confirmAdditional:true}).inventory;
    const summary=CI.summarizeCard(inventory,9,context.statuses,context.cardDetails);
    assert.equal(summary.total,1); assert.equal(summary.owned,false,location);
    assert.equal(summary.inTransit,true,location); assert.equal(summary.acquired,true,location);
    assert.equal(summary.hasInHand,false); assert.equal(context.statuses[9],'not_owned');
  }
});

test('an explicitly in-hand copy contributes to Owned even before any manual legacy mark', () => {
  const inventory=CI.addManualCopy({},9,{location:'in_hand'},{...context,confirmAdditional:true}).inventory;
  const summary=CI.summarizeCard(inventory,9,context.statuses,context.cardDetails);
  assert.equal(summary.owned,true); assert.equal(summary.inTransit,false); assert.equal(summary.notOwned,false);
  assert.equal(summary.total,1); assert.equal(summary.managed,true); assert.equal(context.statuses[9],'not_owned');
});

test('staged purchases never inflate physical quantity and sold copies are excluded', () => {
  const staged=CI.upsertPurchase({}, {...purchase,cardId:9},context);
  assert.equal(CI.summarizeCard(staged.inventory,9,context.statuses,context.cardDetails).total,0);
  const added=CI.addManualCopy(staged.inventory,9,{location:'comc'},{...context,confirmAdditional:true});
  const sold=CI.editCopy(added.inventory,9,added.copyId,{saleStatus:'sold'},context);
  const summary=CI.summarizeCard(sold,9,context.statuses,context.cardDetails);
  assert.equal(summary.total,0); assert.equal(summary.acquired,false);
});

test('explicit purchase quantity and unit index stage the whole lot without treating its amount as an item price', () => {
  const staged=CI.upsertPurchase({}, {...purchase,quantity:'3',unitIndex:'2',paidPrice:'30',currency:'USD'},{...context,priceVerified:true});
  const observation=staged.inventory.observations[staged.observationId];
  assert.match(staged.observationId,/:2$/); assert.equal(observation.unitIndex,2); assert.equal(observation.reportedQuantity,3);
  assert.equal(observation.paidPrice,undefined); assert.equal(observation.reportedPrice,'30');
  assert.throws(()=>CI.resolveObservation(staged.inventory,staged.observationId,{confirmAdditional:true},context),/multiple cards/);
  const repeated=CI.upsertPurchase(staged.inventory,{...purchase,unitIndex:2},context);
  assert.equal(repeated.inventory.observations[staged.observationId].reportedQuantity,3);
  assert.equal(CI.getCopiesForCard(repeated.inventory,7,context.statuses,context.cardDetails).length,2);
});

test('a lot mentioned only in the title requests review without inferring a physical card count', () => {
  const staged=CI.upsertPurchase({}, {...purchase,title:'Tyler Black lot of 4 cards',paidPrice:'30',currency:'USD'},{...context,priceVerified:true});
  const observation=staged.inventory.observations[staged.observationId];
  assert.equal(observation.reportedQuantity,1); assert.equal(observation.requiresQuantityReview,true); assert.equal(observation.paidPrice,undefined);
  assert.throws(()=>CI.resolveObservation(staged.inventory,staged.observationId,{confirmAdditional:true},context),/may be a lot/);
  const split=CI.splitObservation(staged.inventory,staged.observationId,4,context);
  assert.ok(split.observationIds.every(id=>split.inventory.observations[id].requiresQuantityReview===false));
  assert.equal(CI.resolveObservation(split.inventory,split.observationIds[0],{existingCopyId:'legacy:7:1'},context).changed,true);
  assert.equal(CI.purchaseUnits({title:'Tyler Black 7/25'}).requiresQuantityReview,false);
});

test('private purchase staging retains the exact currency evidence without changing ownership',()=>{
  const evidence={currency:'CAD',basis:'shipping_destination',confidence:'inferred',raw:'Ship to Canada'},input={...purchase,paidPrice:'12.50',currency:'CAD',rawPrice:'$12.50',currencyEvidence:evidence};
  const result=CI.upsertPurchase({},input,{...context,priceVerified:true});
  const row=result.inventory.observations[result.observationId];
  assert.equal(row.rawPrice,'$12.50');assert.deepEqual(row.currencyEvidence,evidence);
  evidence.currency='USD';assert.equal(row.currencyEvidence.currency,'CAD');
  assert.deepEqual(result.inventory.copies,{});assert.deepEqual(result.inventory.baselines,{});
});
