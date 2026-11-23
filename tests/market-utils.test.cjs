const test = require('node:test');
const assert = require('node:assert/strict');
const market = require('../market-utils.js');

test('evidence totals separate currencies and price types and disclose unknown currency', () => {
  const text=market.formatEvidenceTotals([
    {price:10,currency:'USD',kind:'asking'}, {price:12,currency:'CAD',kind:'asking'},
    {price:5,currency:'USD',kind:'current_bid'}, {price:7,kind:'asking'}
  ]);
  assert.match(text,/Asking: 12\.00 CAD · 10\.00 USD · 1 prices need currency/);
  assert.match(text,/Current bid: 5\.00 USD/);
  assert.doesNotMatch(text,/34\.00|27\.00|15\.00/);
});

const listing = (extra = {}) => ({
  price: '12.50', currency: 'USD', kind: 'asking', source: 'eBay',
  itemId: '123456789012', itemUrl: 'https://www.ebay.com/itm/123456789012',
  title: 'Tyler Black Gold /50', observedAt: '2026-11-16T10:00:00Z', ...extra
});

test('a dollar sign never supplies an invented currency; explicit currencies survive', () => {
  assert.equal(market.detectCurrency('$12.50'), 'UNKNOWN');
  for (const [text, code] of [['US $12.50','USD'], ['C$12.50','CAD'], ['£12.50','GBP'], ['€12,50','EUR'], ['AUD 12.50','AUD']]) {
    assert.equal(market.detectCurrency(text), code);
  }
  assert.equal(market.amount('1,234.56'), 1234.56);
  assert.equal(market.amount('€1.234,56'), 1234.56);
  assert.equal(market.amount('€12,50'), 12.50);
  assert.equal(market.amount('N/A'), null);
  assert.equal(market.amount('Free shipping'), 0);
});

test('rescan of the same listing and price does not inflate listing counts', () => {
  const history = {};
  market.record(history, 'card', listing());
  const repeat = market.record(history, 'card', listing({observedAt:'2026-11-16T11:00:00Z'}));
  assert.equal(repeat.added, false);
  assert.equal(history.card.length, 1);
  assert.equal(history.card[0].listings, 1);
  assert.equal(history.card[0].lastSeenAt, '2026-11-16T11:00:00.000Z');
  assert.equal(history.card[0].observedAt, '2026-11-16T10:00:00.000Z');
});

test('different items, changed prices and different observation dates remain distinct', () => {
  const history = {};
  for (const input of [listing(), listing({itemId:'223456789012'}), listing({price:'11.25'}), listing({observedAt:'2026-11-17T10:00:00Z'})]) market.record(history, 'card', input);
  assert.equal(history.card.length, 4);
  assert.deepEqual(history.card.map(e => e.price), [12.50,12.50,11.25,12.50]);
});

test('actual sale date is separate from scan time and dedupes repeated sold evidence', () => {
  const history = {};
  market.record(history, 'card', listing({kind:'sold',eventDate:'2026-10-10'}));
  market.record(history, 'card', listing({kind:'sold',eventDate:'2026-10-10',observedAt:'2026-11-18T10:00:00Z'}));
  assert.equal(history.card.length, 1);
  assert.equal(history.card[0].eventDate, '2026-10-10');
  assert.equal(history.card[0].date, '2026-11-16');
});

test('asking, bids, sold, paid and currencies form separate price series', () => {
  const entries = [listing(),listing({currency:'CAD'}),listing({kind:'sold'}),listing({kind:'current_bid'}),listing({kind:'purchase'}),{price:5,date:'2026-02-15',source:'eBay'}].map(input => input.itemId ? market.observation(input) : input);
  const groups = market.groupSeries(entries);
  assert.equal(groups.length, 6);
  assert.equal(groups.find(g => g.currency === 'UNKNOWN').kind, 'unknown');
  assert.match(market.formatMoney(5, ''), /currency unknown/);
  assert.equal(market.formatMoney(5, 'CAD'), '5.00 CAD');
});

test('cost summaries keep currency totals separate and never sum untyped legacy amounts', () => {
  const summary = market.summarizeAmounts([{price:10,currency:'USD'},{price:15,currency:'USD'},{price:20,currency:'CAD'},{price:'$90'},{price:100,currency:'UNKNOWN'}]);
  assert.deepEqual(summary,{totals:{USD:25,CAD:20},unknownCount:2});
  assert.equal(market.formatTotals(summary),'20.00 CAD · 25.00 USD · 2 prices need currency');
});

test('source URL, item ID, currency and observed serial are retained without inventing a run', () => {
  const entry = market.observation(listing({itemId:'',serial:'07',printRun:'50',shipping:'2.00'}));
  assert.equal(entry.itemId, '123456789012');
  assert.equal(entry.itemUrl, 'https://www.ebay.com/itm/123456789012');
  assert.equal(entry.serial, '07');
  assert.equal(entry.printRun, '50');
  assert.equal(entry.shipping, 2);
  assert.equal(market.observation(listing({printRun:''})).printRun, '');
  assert.equal(market.safeUrl('javascript:alert(1)'), '');
  assert.equal(market.safeUrl('https://user:password@example.com/item'), '');
});

test('purchase import defaults to Transit and preserves an existing Owned marking', () => {
  assert.equal(market.importStatus('not_owned'), 'in_transit');
  assert.equal(market.importStatus('in_transit'), 'in_transit');
  assert.equal(market.importStatus('owned'), 'owned');
  assert.equal(market.importStatus('owned', 'in_transit'), 'owned');
  assert.equal(market.importStatus('not_owned', 'owned'), 'owned');
});

test('public observations never overwrite personal paid price, serial or notes', () => {
  assert.deepEqual(market.purchasePatch({}, {recordType:'marketplace',price:2,serial:'17',date:'2026-11-16',source:'eBay'}), {});
  const existing = {price:'25.00',serial:'08',notes:'Checked physically',currency:'CAD'};
  const patch = market.purchasePatch(existing, {recordType:'purchase',price:2,serial:'17',purchaseNote:'COMC',currency:'USD'});
  assert.equal(patch.price, undefined);
  assert.equal(patch.serial, undefined);
  assert.equal(patch.notes, undefined);
  assert.equal(patch.currency, undefined);
  assert.equal(market.purchasePatch(existing, {}, {confirmInHand:true,now:'2026-11-16T10:00:00Z'}).inHandConfirmedAt, '2026-11-16T10:00:00Z');
});

test('saving details preserves provenance, zero quantity and explicit preset clearing', () => {
  const details = {1:{serial:'',price:'3.00',qty:0,source:'COMC',currency:'USD',purchase_date:'2026-11-16',price_paid:'3.00',inHandConfirmedAt:'2026-11-16',futureField:{checked:true}}};
  const result = market.detailOverrides(details, {1:{s:'09',p:'3.00'}});
  assert.equal(result[1].serial, '');
  assert.equal(result[1].price, undefined);
  assert.equal(result[1].qty, 0);
  for (const field of ['source','currency','purchase_date','price_paid','inHandConfirmedAt','futureField']) assert.deepEqual(result[1][field], details[1][field]);
});

test('graded and raw offers remain separate and cached source freshness is retained', () => {
  const raw=market.observation(listing({condition:'Ungraded — near mint or better',sourceSnapshotFreshness:'3 weeks ago',availability:'listed_at_source_snapshot',liveAvailabilityVerified:false,shipping:'6.99',shippingCurrency:'USD',shippingScope:'Destination-specific quote'}));
  const slab=market.observation(listing({grading:{company:'SGC',cardGrade:'10'},condition:'SGC 10',sourceSnapshotFreshness:'today'}));
  const differentSlab=market.observation(listing({grading:{company:'SGC',cardGrade:'9'}}));
  assert.equal(market.groupSeries([raw,slab,differentSlab]).length,3);
  assert.equal(market.conditionLabel(slab),'SGC 10');
  assert.equal(raw.sourceSnapshotFreshness,'3 weeks ago');
  assert.equal(raw.liveAvailabilityVerified,false);
  assert.equal(raw.shippingCurrency,'USD');
  assert.equal(raw.shippingScope,'Destination-specific quote');
  assert.equal(market.groupSeries([{}])[0].conditionLabel,'Condition unverified');
});

test('scan headline includes known postage once and distinguishes incomplete prices', () => {
  const quote = extra => market.scanPrice({price:'12.30',currency:'CAD',shippingNum:3.45,shippingCurrency:'CAD',...extra});
  assert.equal(quote({}).amount,15.75);
  assert.equal(quote({shippingNum:0}).detail,'Free shipping');
  assert.equal(quote({shippingNum:0,shipping:''}).detail,'Shipping unknown');
  assert.equal(quote({shippingCurrency:'USD'}).detail,'+ 3.45 USD shipping');
  assert.equal(quote({priceBasis:'order_total'}).amount,12.3);
  assert.equal(quote({shippingScope:'order',itemsInOrder:2,quantity:1}).amount,12.3);
  assert.equal(quote({shippingScope:'order',itemsInOrder:1,quantity:1}).amount,15.75);
});
