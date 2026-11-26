const test=require('node:test'),assert=require('node:assert/strict'),CI=require('../copy-utils');
const id='tcdb:123',context={statuses:{[id]:'owned'},cardDetails:{[id]:{qty:3,ownedQty:2,transitQty:1}},now:'2026-11-18T20:00:00Z',primaryJerseyNumber:null};
test('numeric legacy IDs and scoped string IDs stay distinct without migrating persisted records',()=>{
 const state={version:1,copies:{a:{cardId:123,location:'in_hand'},b:{cardId:id,location:'comc'}},baselines:{},observations:{},extra:{untouched:true}},before=JSON.stringify(state);
 assert.equal(CI.getCopiesForCard(state,123).length,1);assert.equal(CI.getCopiesForCard(state,id).length,1);assert.equal(CI.hasStoredCopies(state,'tcdb:124'),false);
 assert.equal(CI.canonicalCardId('123'),123);assert.equal(CI.canonicalCardId(id),id);assert.equal(CI.canonicalCardId(''),null);assert.equal(CI.sameCardId('bad','bad'),false);
 assert.deepEqual(CI.normalizeState(state).extra,{untouched:true});assert.equal(JSON.stringify(state),before);
});
test('mixed source owned/incoming slots preserve separate counts and no inferred physical location',()=>{
 const rows=CI.getCopiesForCard({},id,context.statuses,context.cardDetails);assert.deepEqual(rows.map(c=>c.legacyStatus),['owned','owned','in_transit']);assert.ok(rows.every(c=>c.location==='unknown'&&c.unallocated));
 const s=CI.summarizeCard({},id,context.statuses,context.cardDetails);assert.equal(s.ownedQty,2);assert.equal(s.transitQty,1);assert.equal(s.total,3);assert.equal(s.inTransit,true);
 const zero=CI.getCopiesForCard({},id,context.statuses,{[id]:{qty:0,ownedQty:2,transitQty:1}});assert.equal(zero.length,0);
});
test('string-ID copy linking consumes the existing slot and never doubles the baseline',()=>{
 const staged=CI.upsertPurchase({}, {source:'ebay',account:'a@example.test',orderId:'order1',itemId:'item1',cardId:id},context),result=CI.resolveObservation(staged.inventory,staged.observationId,{existingCopyId:'legacy:'+id+':1'},context);
 assert.equal(result.inventory.copies[result.copyId].cardId,id);assert.equal(CI.summarizeCard(result.inventory,id,context.statuses,context.cardDetails).total,3);
 const edited=CI.editCopy(result.inventory,id,result.copyId,{location:'in_hand'},context);assert.equal(edited.copies[result.copyId].location,'in_hand');
});
test('buyer accounts separate repeated listing/order IDs without rewriting older keys',()=>{
 const base={source:'ebay',orderId:'order1',itemId:'item1',cardId:id};
 const a=CI.upsertPurchase({}, {...base,account:'a@example.test'},context),b=CI.upsertPurchase(a.inventory,{...base,account:'b@example.test'},context);assert.notEqual(a.observationId,b.observationId);assert.equal(Object.keys(b.inventory.observations).length,2);assert.equal(CI.sourceIdentity(base),'ebay:order:order1:item:item1:1');
});
test('conflicting COMC lifecycle facts are retained for review instead of replacing the original purchase',()=>{
 const base={source:'comc',itemId:'same-physical-item',cardId:id,purchaseDate:'2025-01-01',paidPrice:'10',currency:'USD'};
 const first=CI.upsertPurchase({},base,{...context,priceVerified:true}),next=CI.upsertPurchase(first.inventory,{...base,purchaseDate:'2026-01-01',paidPrice:'20'},{...context,priceVerified:true});
 const saved=next.inventory.observations[first.observationId];assert.equal(saved.purchaseDate,'2025-01-01');assert.equal(saved.paidPrice,'10');assert.equal(saved.conflictingEvidence[0].evidence.paidPrice,'20');assert.equal(saved.needsSourceReview,true);
 assert.throws(()=>CI.resolveObservation(next.inventory,first.observationId,{existingCopyId:'legacy:'+id+':1'},context),/Conflicting source/);
 const again=CI.upsertPurchase(next.inventory,{...base,purchaseDate:'2026-01-01',paidPrice:'20'},{...context,priceVerified:true});assert.equal(again.changed,false);
});
test('1/1 caps block additional copies but permit evidence to link the already-counted copy',()=>{
 const ctx={...context,cardDetails:{[id]:{qty:1}},cardById:{[id]:{id,printRun:1}}};
 assert.throws(()=>CI.addManualCopy({},id,{}, {...ctx,confirmAdditional:true}),/1\/1/);assert.throws(()=>CI.quickQuantity({},id,2,ctx),/1\/1/);
 const staged=CI.upsertPurchase({}, {source:'comc',itemId:'one',cardId:id},ctx);assert.throws(()=>CI.resolveObservation(staged.inventory,staged.observationId,{confirmAdditional:true},ctx),/1\/1/);
 assert.equal(CI.resolveObservation(staged.inventory,staged.observationId,{existingCopyId:'legacy:'+id+':1'},ctx).changed,true);
});
test('sport purchase review preserves account and original order-price provenance',()=>{
 const CI=require('../copy-utils');const purchase={cardId:'tcdb:123',source:'ebay',sourceOrderId:'order-1',sourceItemId:'item-1',account:'Buyer A',quantity:1,paidPrice:'12',currency:'CAD',orderTotal:'50',rawOrderTotal:'C $50.00',originalPriceBasis:'order_total',priceBasis:'item'};
 const result=CI.upsertPurchase(CI.normalizeState(null),purchase,{priceVerified:true}),entry=result.inventory.observations[result.observationId];
 assert.equal(entry.account,'Buyer A');assert.equal(entry.orderTotal,'50');assert.equal(entry.rawOrderTotal,'C $50.00');assert.equal(entry.originalPriceBasis,'order_total');assert.equal(entry.priceBasis,'item');assert.equal(entry.paidPrice,'12');assert.equal(CI.getCopiesForCard(result.inventory,'tcdb:123',{},{}).length,0);
});
test('new 1/1 source evidence cannot be linked into a multiple-copy baseline or later doubled',()=>{
 const two={...context,cardDetails:{[id]:{qty:2}}},one={...context,cardDetails:{[id]:{qty:1}}};
 const staged=CI.upsertPurchase({}, {source:'comc',itemId:'unique',cardId:id,serial:'1/1',printRun:1},{...context,serialEvidence:'comc_inventory'});
 assert.throws(()=>CI.resolveObservation(staged.inventory,staged.observationId,{existingCopyId:'legacy:'+id+':1'},two),/1\/1/);
 const linked=CI.resolveObservation(staged.inventory,staged.observationId,{existingCopyId:'legacy:'+id+':1'},one);
 assert.throws(()=>CI.quickQuantity(linked.inventory,id,2,one),/1\/1/);
});
test('source account alias and original amount basis survive review staging',()=>{
 const p={source:'ebay',sourceAccount:'a@example.test',orderId:'a',itemId:'b',cardId:id,originalPriceBasis:'order_total',priceBasis:'item',rawOrderTotal:'C $100.00'};
 const r=CI.upsertPurchase({},p,context),o=r.inventory.observations[r.observationId];assert.match(r.observationId,/account:a%40example.test/);assert.equal(o.account,p.sourceAccount);assert.equal(o.originalPriceBasis,'order_total');assert.equal(o.rawOrderTotal,'C $100.00');
});
test('structured order totals and owner currency correction keep original evidence through copy review',()=>{
 const CI=require('../copy-utils'),original={amount:'50',currency:'USD',raw:'US $50.00'},evidence={currency:'UNKNOWN',raw:'$12.00',method:'ambiguous'};
 const result=CI.upsertPurchase(CI.normalizeState(null),{cardId:'tcdb:321',source:'ebay',sourceOrderId:'order',sourceItemId:'item',quantity:1,paidPrice:'12',currency:'CAD',currencyEvidence:evidence,rawPrice:'$12.00',currencyConfirmedByOwner:true,orderTotal:original,isReturn:true,sourceStatusReview:true,sourceReviewedByOwner:true,lifecycleStatus:'returned'},{priceVerified:true});
 const row=result.inventory.observations[result.observationId];assert.deepEqual(row.orderTotal,original);assert.notEqual(row.orderTotal,original);assert.deepEqual(row.currencyEvidence,evidence);assert.equal(row.rawPrice,'$12.00');assert.equal(row.currencyConfirmedByOwner,true);assert.equal(row.currency,'CAD');assert.equal(row.sourceStatusReview,true);assert.equal(row.sourceReviewedByOwner,true);assert.equal(row.isReturn,true);assert.equal(row.lifecycleStatus,'returned');assert.equal(CI.getCopiesForCard(result.inventory,'tcdb:321',{},{}).length,0);
});
test('COMC physical ItemID stays global and aligns with legacy observation across account contexts',()=>{
 const base={source:'comc',itemId:'physical123',cardId:id,purchaseDate:'2025-01-01'};
 const first=CI.upsertPurchase({}, {...base,account:'first'},context),second=CI.upsertPurchase(first.inventory,{...base,account:'second'},context);
 assert.equal(first.observationId,'comc:physical123');assert.equal(second.observationId,first.observationId);assert.equal(Object.keys(second.inventory.observations).length,1);assert.equal(Object.keys(second.inventory.copies).length,0);
 assert.deepEqual(second.inventory.observations[first.observationId].sourceAccounts,['first','second']);assert.equal(second.inventory.observations[first.observationId].account,'first');
});

test('payment settlement, tax, exchange evidence and raw date stay separate from the per-card price',()=>{
 const CI=require('../copy-utils'),fields={settlement:{amount:'74.20',currency:'CAD',basis:'order_payment'},orderTax:{amount:'4.20',currency:'USD'},exchangeRate:{fromAmount:'1',fromCurrency:'USD',toAmount:'1.4',toCurrency:'CAD',raw:'1 USD = 1.4 CAD'},rawEventDate:'Purchased Nov 16, 2026 at 8:01 PM',shippingScope:'order',shipping:12,shippingCurrency:'USD',grading:{company:'PSA',grade:'9'},condition:'graded',acquisitionPrice:'45',acquisitionCurrency:'USD',acquisitionDate:'2026-11-16'};
 const next=CI.upsertPurchase(CI.normalizeState(null),{...fields,source:'ebay',sourceItemId:'i',sourceOrderId:'o',cardId:'tcdb:1',quantity:1,paidPrice:'50',currency:'USD'},{priceVerified:true});const record=next.inventory.observations[next.observationId];
 for(const key of Object.keys(fields))assert.deepEqual(record[key],fields[key]);assert.equal(record.paidPrice,'50');assert.equal(record.currency,'USD');assert.equal(Object.keys(next.inventory.copies).length,0);
});

test('a stored UNKNOWN value still resolves from the purchase destination without allocating a copy',()=>{
 const CI=require('../copy-utils');
 const next=CI.upsertPurchase(CI.normalizeState(null),{source:'ebay',sourceItemId:'i',sourceOrderId:'o',cardId:'tcdb:1',quantity:1,paidPrice:'50',currency:'UNKNOWN',shipToCountry:'CA'},{priceVerified:true});
 assert.equal(next.inventory.observations[next.observationId].currency,'CAD');
 assert.deepEqual(next.inventory.copies,{});
 assert.equal(CI.inferredCurrency({currency:'USD',shippingCountry:'CA'}),'USD');
});
