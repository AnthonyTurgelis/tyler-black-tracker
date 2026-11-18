const test = require('node:test');
const assert = require('node:assert/strict');
const scan = require('../scan-currency.js');

test('recognizes source price spellings before parsers strip symbols', () => {
  for (const [text, code, amount] of [['C $12.50','CAD',12.5],['CA$12.50','CAD',12.5],['Can$12.50','CAD',12.5],['US $12.50','USD',12.5],['USD 12.50','USD',12.5],['12.50 CAD','CAD',12.5],['£12.50','GBP',12.5],['€1.234,56','EUR',1234.56],['AU $12.50','AUD',12.5],['NZ$12.50','NZD',12.5]]) {
    const p = scan.parseMoney(text);
    assert.equal(p.currency, code, text); assert.equal(p.amount, amount, text);
    assert.equal(scan.infer({price:String(amount),rawPrice:text}).currency, code, text);
  }
  assert.equal(scan.parseMoney('$12.50').currency, 'UNKNOWN');
});

test('supports shipment destinations while ignoring seller and card locations', () => {
  for (const text of ['Ships to: Canada','Shipping to Canada','Deliver to\nToronto, ON M5V 0G8\nCanada','Shipping address\nA. Collector\n50 Example Street\nToronto ON M5V 0G8']) {
    const result = scan.infer({price:'12.50',source:'eBay'}, {text});
    assert.equal(result.currency, 'CAD', text); assert.equal(result.inferred, true);
  }
  assert.equal(scan.infer({price:'12.50'}, {text:'Ship to: United States'}).currency, 'USD');
  assert.equal(scan.infer({price:'12.50'}, {text:'Ship to: USA'}).currency, 'USD');
  for (const text of ['Ships from Canada','Located in: Canada','Seller Toronto Canada','2026 Team Canada card','eBay.ca']) assert.equal(scan.infer({price:'12.50'},{text}).currency, 'UNKNOWN', text);
});

test('explicit price currency beats destination and stale dropdown defaults', () => {
  const p = {price:'10',rawPrice:'US $10.00',source:'eBay'};
  assert.equal(scan.infer(p, {text:'Shipping to Canada',fallbackCurrency:'CAD'}).currency, 'USD');
  assert.equal(scan.infer({price:'10',currency:'CAD'}, {text:'Shipping to USA'}).currency, 'CAD');
  assert.equal(scan.infer({price:'10'}, {text:'Prices are in Canadian dollars\nShip to USA'}).currency, 'CAD');
});

test('COMC and Sportlots use source currency, not shipment country', () => {
  for (const source of ['COMC','SportLots']) {
    const result = scan.infer({price:'10',source}, {text:'Shipping to Canada'});
    assert.equal(result.currency, 'USD'); assert.equal(result.reason, 'source-' + source.toLowerCase());
    assert.equal(scan.infer({price:'10',source,rawPrice:'C$10'}).currency, 'CAD');
  }
  assert.equal(scan.infer({price:'10',source:'eBay',seller:'COMC'}).currency, 'UNKNOWN');
});

test('mixed currencies stay per-row instead of using the first currency anywhere in a paste', () => {
  const text = 'Item A\nUS $10.00\nItem B\nC $14.00\nShip to Canada';
  assert.equal(scan.infer({price:'10',rawPrice:'US $10.00'}, {text}).currency, 'USD');
  assert.equal(scan.infer({price:'14',rawPrice:'C $14.00'}, {text}).currency, 'CAD');
  assert.equal(scan.infer({price:'5'}, {text:'Item A US $10\nItem B C$14'}).currency, 'UNKNOWN');
});

test('converted display cannot silently relabel the original amount or become paid price', () => {
  const rawPrice = 'US $10.00 (approximately C $14.00)';
  const price = scan.parseMoney(rawPrice);
  assert.equal(price.amount, 10); assert.equal(price.currency, 'USD');
  assert.deepEqual(price.alternatives, [{amount:14,currency:'CAD',converted:true}]);
  assert.equal(scan.infer({price:'10',rawPrice,recordType:'purchase'}).needsReview, false);
  const converted = scan.infer({price:'14',rawPrice,recordType:'purchase'});
  assert.equal(converted.currency, 'CAD'); assert.equal(converted.convertedDisplay, true); assert.equal(converted.needsReview, true);
  assert.equal(scan.parseMoney('Approximately C$14.00\nUS $10.00').amount, 10);
});

test('contradictory explicit evidence and ambiguous destinations require review', () => {
  const conflict = scan.infer({price:'10',currency:'USD',rawPrice:'CAD 10'});
  assert.equal(conflict.currency, 'UNKNOWN'); assert.equal(conflict.needsReview, true);
  assert.equal(scan.infer({price:'10'},{text:'Ship to Canada\nShip to United States'}).needsReview, true);
  assert.equal(scan.infer({price:'10'},{text:'Currency: CAD / USD'}).needsReview, true);
  assert.equal(scan.parseMoney('$10 to $20').amount, null);
});

test('scanner evidence is sport-agnostic, immutable and never edits amounts or ownership', () => {
  const original = {price:'12.50',source:'Whatnot',rawPrice:'US$12.50',description:'Dale Earnhardt',quantity:'2',status:'owned'};
  const snapshot = JSON.stringify(original), parsed = scan.apply(original, {});
  assert.equal(JSON.stringify(original), snapshot); assert.equal(parsed.currency, 'USD');
  assert.equal(parsed.price, '12.50'); assert.equal(parsed.quantity, '2'); assert.equal(parsed.status, 'owned');
  assert.equal(scan.infer({price:'10'}).currency, 'UNKNOWN');
});

test('inferred saved scanner state is recalculated when the context changes', () => {
  const first = scan.apply({price:'10'}, {text:'Ship to Canada'});
  assert.equal(first.currency, 'CAD');
  assert.equal(scan.infer(first, {text:'Ship to USA'}).currency, 'USD');
  assert.equal(scan.infer(first, {}).currency, 'UNKNOWN');
});
