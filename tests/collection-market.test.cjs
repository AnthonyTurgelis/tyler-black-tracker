const test=require('node:test'),assert=require('node:assert/strict');
const U=require('../collection-market-utils'),S=require('../scanner-utils'),H=require('../price-history-utils'),M=require('../market-utils');
const base={id:'tcdb:9007199254740993123',year:2024,product:'Panini Select',cardNumber:'55',cardSet:'Base',subject:'Ryan Blaney'};
const gold={...base,id:'tcdb:gold',cardSet:'Gold',printRun:'10'};
const other={...base,id:'tcdb:other',subject:'Alex Palou'};
const cards=[base,gold,other],title='2024 Panini Select #55 Ryan Blaney';
function listing(extra={}){return {...S.parseListings(title+'\nUS $12.50',{source:'eBay',cards})[0],...extra};}
const now='2026-11-18T12:00:00.000Z';
test('private sports history preserves long string IDs and separates exact subjects and variants',()=>{
  const parsed=listing(),entry=U.entry(parsed,base,{now}),next=U.append({history:{},targets:{}},[entry]);
  assert.equal(next.added,1);assert.deepEqual(Object.keys(next.value.history),[base.id]);assert.equal(entry.cardId,base.id);
  assert.throws(()=>U.entry(parsed,gold,{now}),/identity/);
  assert.throws(()=>U.entry(parsed,other,{now,manual:true,identityConfirmed:true}),/subject/);
  assert.throws(()=>U.entry({...parsed,subject:''},base,{now,manual:true}),/Confirm/);
  assert.equal(U.entry({...parsed,subject:'',rawSet:'Unknown card'},base,{now,manual:true,identityConfirmed:true}).matchMethod,'owner_confirmed');
});
test('one-of-one matches require exact manual review even when text appears unique',()=>{
  const one={...gold,id:'tcdb:one',cardSet:'Gold',printRun:'1'},p={...listing(),rawSet:title+' Gold 1/1',printRun:'1',serial:'1'};
  assert.throws(()=>U.entry(p,one,{now}),/one-of-one/);
  assert.equal(U.entry(p,one,{now,manual:true,identityConfirmed:true}).cardId,'tcdb:one');
});
test('Canada inference survives context extraction, explicit USD wins, unknown currency remains blocked',()=>{
  const [canada]=S.parseListings('Ship to: Canada\n'+title+'\n$12.50',{cards,source:'eBay'});
  assert.equal(U.entry(canada,base,{now}).currency,'CAD');
  const [usd]=S.parseListings('Ship to: Canada\n'+title+'\nUS $12.50',{cards,source:'eBay'});
  assert.equal(U.entry(usd,base,{now}).currency,'USD');
  const [unknown]=S.parseListings(title+'\n$12.50',{cards,source:'eBay'});
  assert.throws(()=>U.entry(unknown,base,{now}),/currency/);
});
test('asking, current bid, sold and purchase observations retain separate series',()=>{
  const entries=['asking','current_bid','sold','purchase'].map(kind=>U.entry(listing({kind,recordType:kind==='purchase'?'purchase':'listing',date:'2026-11-17'}),base,{now}));
  const next=U.append({history:{},targets:{}},entries);assert.equal(next.added,4);assert.equal(M.groupSeries(next.value.history[base.id]).length,4);
  assert.equal(entries.at(-1).needsOwnershipReview,true);
  for(const e of entries)for(const key of ['owned','status','qty','transitQty','wantedQty'])assert.equal(Object.hasOwn(e,key),false);
});
test('repeat receipts dedupe without merging different buyer accounts or orders',()=>{
  const p=listing({recordType:'purchase',kind:'purchase',date:'2026-11-17',orderNum:'order-1',account:'buyer-one',quantity:'2'});
  const first=U.entry(p,base,{now}),second=U.entry(p,base,{now:'2026-11-19T12:00:00Z'});
  let next=U.append({history:{},targets:{}},[first,second]);assert.equal(next.added,1);assert.equal(next.value.history[base.id][0].lastSeenAt,'2026-11-19T12:00:00.000Z');
  next=U.append(next.value,[U.entry({...p,account:'buyer-two'},base,{now}),U.entry({...p,orderNum:'order-2'},base,{now})]);
  assert.equal(next.added,2);assert.equal(next.value.history[base.id].length,3);assert.equal(first.sourceQuantity,'2');
});
test('order totals, converted paid displays and ambiguous event dates require owner review',()=>{
  const p=listing({kind:'purchase',recordType:'purchase',date:'2026-11-17'});
  assert.throws(()=>U.entry({...p,priceBasis:'order_total'},base,{now}),/order total/);
  assert.throws(()=>U.entry({...p,rawPrice:'Approximately C $12.50',currency:'CAD',currencyEvidence:undefined},base,{now}),/currency/);
  assert.throws(()=>U.entry({...p,date:'11/12/2026'},base,{now}),/date/);
  assert.equal(U.date('July 16, 2025'),'2025-07-16');assert.equal(U.date('2026-02-30'),'');
  assert.equal(U.date('11/12/2026 9:22:55 AM','MM/DD/YYYY'),'2026-11-12');
  assert.equal(U.date('11/12/2026 9:22:55 AM'),'');
  const allocated=U.entry({...p,priceBasis:'item',originalPriceBasis:'order_total',rawOrderTotal:'US $32.40'},base,{now});assert.equal(allocated.rawOrderTotal,'US $32.40');assert.equal(allocated.originalPriceBasis,'order_total');
});
test('synthetic eBay item USD stays separate from charged CAD, order tax and FX evidence',()=>{
  // Synthetic receipt: USD20 item + USD3 shipping + USD1 tax = USD24; charged CAD32.
  const text='Time placed\tJune 12, 2025 at 2:15 p.m.\nOrder number\tfixture-order\nTotal\tUS $24.00 (1 item)\n'+title+'\nUS $20.00\nUnit price US $20.00\nShipping\nUS $3.00\nTax*\nUS $1.00\nOrder total\tUS $24.00\nPayment info\nC $32.00\nThis was the exchange rate from the time of the transaction: C $1.00 = US $0.7500';
  const [parsed]=S.parseListings(text,{source:'eBay',cards,account:'test-buyer'}),e=U.entry(parsed,base,{now});
  assert.equal(e.price,20);assert.equal(e.currency,'USD');assert.equal(e.eventDate,'2025-06-12');
  assert.equal(e.orderTotal.amount,24);assert.equal(e.orderTax.amount,1.00);assert.equal(e.settlement.amount,32.00);assert.equal(e.settlement.currency,'CAD');assert.equal(e.exchangeRate.toAmount,0.7500);assert.equal(e.shippingScope,'order');
  assert.equal(U.groupSeries([e])[0].currency,'USD');
});
test('public sold prices cannot become this owner purchase by changing a label alone',()=>{
  const p=listing({recordType:'sold',kind:'purchase',date:'2026-11-17'});
  assert.throws(()=>U.entry(p,base,{now}),/actual|purchase/);
  assert.equal(U.entry({...p,purchaseConfirmedByOwner:true},base,{now}).purchaseConfirmedByOwner,true);
});
test('history keeps shipping separate, exact grading and original currency evidence',()=>{
  const p=listing({shippingNum:4.99,shippingCurrency:'CAD',condition:'Ungraded',quantity:'2',orderNum:'one',account:'owner',grading:{company:'SGC',cardGrade:'9.5',autoGrade:'10',certNumber:'00123'}}),e=U.entry(p,base,{now});
  assert.equal(e.price,12.5);assert.equal(e.currency,'USD');assert.equal(e.shipping,4.99);assert.equal(e.shippingCurrency,'CAD');assert.equal(e.rawPrice,'US $12.50');assert.ok(e.currencyEvidence);
  assert.equal(e.grading.certNumber,'00123');assert.equal(e.grading.autographGrade,'10');
});
test('returned source evidence needs acknowledgment and never shares ordinary sale statistics',()=>{
  const p=listing({kind:'sold',recordType:'sold',date:'2026-11-17',isReturn:true,needsSourceReview:true,lifecycleStatus:'sold'});
  assert.throws(()=>U.entry(p,base,{now}),/return/);
  const returned=U.entry({...p,sourceReviewedByOwner:true},base,{now}),normal=U.entry({...p,isReturn:false,needsSourceReview:false},base,{now});
  assert.equal(returned.isReturn,true);assert.equal(returned.sourceReviewedByOwner,true);assert.equal(U.groupSeries([returned,normal]).length,2);
});
test('reassignment moves one observation only and stale history cannot revive deletion',()=>{
  const first=U.entry(listing(),base,{now}),second=U.entry(listing({price:'20',rawPrice:'US $20',itemId:'different'}),base,{now});
  const value=U.append({history:{},targets:{keep:{notes:'retain'}}},[first,second]).value;
  const moved=U.reassign(value,base.id,gold,first,now);
  assert.equal(moved.history[base.id].length,1);assert.equal(moved.history[base.id][0].price,20);assert.equal(moved.history[gold.id].length,1);assert.equal(moved.history[gold.id][0].cardId,gold.id);assert.deepEqual(moved.targets,value.targets);
  const merged=H.visible(H.merge(value.history,moved.history));assert.equal(merged[base.id].length,1);
  const removed=U.remove(moved,gold.id,moved.history[gold.id][0],now);assert.equal(H.visible(H.merge(moved.history,removed.history))[gold.id],undefined);
});
test('targets and legacy observation review never mutate ownership or source records',()=>{
  const collection={statuses:{[base.id]:'owned'},details:{[base.id]:{ownedQty:2,wantedQty:1}},imports:{old:{status:'observation',cardId:base.id,price:10,currency:'USD'}}},before=JSON.stringify(collection);
  assert.equal(U.legacyObservations(collection).length,1);
  const target=U.target({history:{},targets:{}},base,{maxPrice:'15',currency:'CAD',notes:'look for clean corners'},now);
  assert.equal(target.targets[base.id].maxPrice,15);assert.equal(JSON.stringify(collection),before);
  assert.throws(()=>U.target(target,base,{maxPrice:'15',currency:'UNKNOWN'},now),/currency/);
  assert.throws(()=>U.cardId('__proto__'),/Invalid/);
});
