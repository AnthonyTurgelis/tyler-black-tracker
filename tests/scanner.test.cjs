const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const scan = require('../scanner-utils.js');
const currency = require('../scan-currency.js');
const market = require('../market-utils.js');
const source = fs.readFileSync(require.resolve('../tracker.jsx'), 'utf8');

function legacyFunctions(names, values = {}) {
  const context = {window:{ScanCurrency:currency,TrackerMarket:market,CollectionScanner:scan},multiSubject:false,scanCurrency:'UNKNOWN',
    acceptsSubject:title=>/tyler black/i.test(title),subjectNames:title=>/tyler black/i.test(title)?['Tyler Black']:[],
    parseEbayTitle:title=>({rawSet:title,source:'eBay',product:'Bowman',year:'2021',cardNo:'10'}),EBAY_NOT_TB:[],EBAY_SPORT_EXCLUDE:[],...values};
  vm.createContext(context);
  for (const name of names) {
    const start = source.indexOf('  function '+name+'(');
    assert.ok(start>0, name+' exists');
    const end = source.indexOf('\n  }\n', start)+5;
    vm.runInContext(source.slice(start,end), context);
  }
  return context;
}

const roster = {rice:{name:'Kiki Rice'},sabally:{name:'Nyara Sabally'}};
const cards = [
  {id:1,year:2026,product:'Panini Prizm WNBA',cardNumber:'10',cardSet:'Base',player:'rice'},
  {id:2,year:2026,product:'Panini Prizm WNBA',cardNumber:'10',cardSet:'Gold /10',copies:'10',player:'rice'},
  {id:3,year:2026,product:'Panini Prizm WNBA',cardNumber:'10',cardSet:'Base',player:'sabally'}
];

test('multi-person scanner requires the correct full subject and rejects ambiguous identity', () => {
  let p=scan.parseTitle('2026 Panini Prizm WNBA #10 Kiki Rice',{cards,roster});
  assert.equal(scan.match(p,cards,roster).card.id,1);
  p=scan.parseTitle('2026 Panini Prizm WNBA #10 Satou Sabally',{cards,roster});
  assert.equal(scan.match(p,cards,roster),null);
  p=scan.parseTitle('2026 Panini Prizm WNBA #10 Nyara Sabally Kiki Rice',{cards,roster});
  assert.equal(scan.match(p,cards,roster),null);
  p=scan.parseTitle('2026 Panini Prizm WNBA #10 Kiki Rice Gold /10',{cards,roster});
  assert.equal(scan.match(p,cards,roster).card.id,2);
  assert.equal(scan.match({...p,printRun:'25'},cards,roster),null);
  assert.equal(scan.match({...p,cardNo:''},cards,roster),null);
});

test('racing matches include multi-sport cards without confusing Earnhardt generations', () => {
  const racing=[{id:8,year:2001,product:'Upper Deck',cardNumber:'1',cardSet:'Base',subject:'Dale Earnhardt'},{id:9,year:2001,product:'Upper Deck',cardNumber:'1',cardSet:'Base',subject:'Dale Earnhardt Jr.'}];
  const p=scan.parseTitle('2001 Upper Deck #1 Dale Earnhardt Jr.',{cards:racing});
  assert.equal(p.subject,'Dale Earnhardt Jr.'); assert.equal(scan.match(p,racing).card.id,9);
  assert.equal(scan.subjects('Dale Earnhardt Jr.',[racing[0]]).length,0);
});

test('generic listings preserve currency and purchase/market distinction for all subjects', () => {
  const text='Ship to: Canada\n2026 Panini Prizm WNBA #10 Kiki Rice Opens in a new window or tab\nUS $10.00\n2026 Panini Prizm WNBA #10 Nyara Sabally Opens in a new window or tab\nC $15.00';
  const result=scan.parseListings(text,{cards,roster});
  assert.equal(result.length,2);assert.equal(result[0].currency,'USD');assert.equal(result[1].currency,'CAD');
  assert.equal(result[0].recordType,'listing');assert.equal(scan.match(result[1],cards,roster).card.id,3);
  const receipt=scan.parseListings('2026 Panini Prizm WNBA #10 Kiki Rice|US $10.00|2026-11-18|order-1|https://ebay.com/itm/123456789012|USD|2',{cards,roster,source:'eBay'})[0];
  assert.equal(receipt.recordType,'purchase');assert.equal(receipt.currency,'USD');assert.equal(receipt.quantity,'2');
  assert.equal(receipt.price,'10');assert.equal(receipt.rawPrice,'US $10.00');
});

test('receipt recommendation cards and currencies never become purchase evidence', () => {
  const text='2026 Panini Prizm WNBA #10 Kiki Rice\nUS $10.00\nInspired by your recent views\n2026 Panini Prizm WNBA #10 Nyara Sabally\nC $90.00';
  const result=scan.parseListings(text,{cards,roster,source:'eBay',recordType:'purchase'});
  assert.equal(result.length,1);assert.equal(result[0].subject,'Kiki Rice');
  assert.equal(result[0].price,'10');assert.equal(result[0].currency,'USD');
  const f=legacyFunctions(['parseEbaySearchResults']);
  const legacy=f.parseEbaySearchResults('2021 Bowman #10 Tyler Black Opens in a new window or tab\nUS $10.00\nInspired by your recent views\n2021 Bowman #10 Tyler Black Opens in a new window or tab\nC $90.00');
  assert.equal(legacy.length,1);
});

test('receipt recommendations are skipped while the later order totals remain available', () => {
  const text='Your order details\n2026 Panini Prizm WNBA #10 Kiki Rice\nPrice: US $12.51\nPopular in your interests\n2026 Panini Prizm WNBA #10 Nyara Sabally\nC $16.12\nSponsored items to complement your purchase\n2026 Panini Prizm WNBA #10 Kiki Rice Gold /10\nC $82.71\nOrder total:\nSubtotal US $12.51\nShipping US $6.00\nSales tax US $1.12\nTotal in USD US $19.63\nTotal charged to C $29.00';
  const result=scan.parseListings(text,{cards,roster,source:'eBay',recordType:'purchase'});
  assert.equal(result.length,1);assert.equal(result[0].price,'12.51');assert.equal(result[0].currency,'USD');
  assert.match(result[0].currencyText,/Order total:/);assert.doesNotMatch(result[0].currencyText,/82\.71|16\.12/);
});

test('legacy eBay parses prefixed CAD/USD and keeps mixed shipping totals separate', () => {
  const f=legacyFunctions(['parseEbaySearchResults']);
  const result=f.parseEbaySearchResults('Ship to Canada\n2021 Bowman #10 Tyler Black Opens in a new window or tab\nUS $10.00\nC $5.00 shipping\n2021 Bowman #10 Tyler Black Opens in a new window or tab\nC $15.00\nC $2.00 shipping');
  assert.equal(result.length,2);assert.equal(currency.infer(result[0]).currency,'USD');
  assert.equal(result[0].shippingCurrency,'CAD');assert.equal(result[0].totalPrice,'');
  assert.equal(result[1].shippingCurrency,'CAD');assert.equal(result[1].totalPrice,'17.00');
});

test('legacy Whatnot parser keeps the US$ prefix and supports Canadian/Australian prices', () => {
  const f=legacyFunctions(['parseWhatnotText']);
  for(const [raw,code] of [['US$12.50','USD'],['CA$12.50','CAD'],['AU$12.50','AUD'],['£12.50','GBP']]) {
    const result=f.parseWhatnotText('SellerOne\n2021 Bowman Tyler Black #10\n'+raw);
    assert.equal(result.length,1,raw);assert.equal(currency.infer(result[0]).currency,code,raw);
    assert.equal(result[0].rawPrice,raw);
  }
});

test('legacy COMC and eBay CSV/pipe receipts preserve explicit raw currency evidence', () => {
  const f=legacyFunctions(['parseCOMCLine','parseEbayLine']);
  const comc=f.parseCOMCLine({'Set Name':'2021 Bowman','Card No':'10','Purchase Price':'$5.00','Description':'Tyler Black'});
  assert.equal(currency.infer(comc).currency,'USD');
  const ebay=f.parseEbayLine('2021 Bowman Tyler Black #10|C $12.50|2026-11-18|order-1');
  assert.equal(ebay.price,'12.5');assert.equal(currency.infer(ebay).currency,'CAD');
});

test('TCDB parser includes subject/cardNo and imports cannot remove confirmed ownership', () => {
  const f=legacyFunctions(['parseTcdbCollection'],{multiSubject:true,acceptsSubject:t=>scan.subjects(t,cards,roster).length===1,subjectNames:t=>scan.subjects(t,cards,roster)});
  const result=f.parseTcdbCollection('Collection Summary Want\n2026 Panini Prizm WNBA #10 Kiki Rice');
  assert.equal(result.items.length,1);assert.equal(result.items[0].cardNo,'10');assert.equal(result.items[0].subject,'Kiki Rice');
  assert.equal(scan.match(result.items[0],cards,roster).card.id,1);
  for (const requested of ['not_owned','in_transit','all','unknown']) assert.equal(scan.tcdbImportStatus('owned',requested),'owned');
  assert.equal(scan.tcdbImportStatus('in_transit','not_owned'),'in_transit');
  assert.equal(scan.tcdbImportStatus('not_owned','owned'),'owned');
  assert.equal(scan.tcdbImportStatus('not_owned','in_transit'),'in_transit');
});

test('130point current prices retain prefixes instead of dropping to zero', () => {
  const f=legacyFunctions(['parse130PointForSale'],{is130ptTylerBlack:t=>/tyler black/i.test(t)});
  const result=f.parse130PointForSale('2021 Bowman Tyler Black #10\nCurrent Price: US $12.50\nBIN Sale\nEnd Date: 2026-11-18');
  assert.equal(result.length,1);assert.equal(result[0].price,'12.5');assert.equal(currency.infer(result[0]).currency,'USD');
});

test('market history separates subjects and only reads an unambiguous legacy key', () => {
  const ph=require('../price-history-utils.js');
  const a={id:1,product:'2026 Panini Prizm WNBA',cardNumber:'10',cardSet:'Base',player:'rice'};
  const b={...a,id:2,player:'sabally'};
  const legacy=ph.legacyCardKey(a), evidence={price:10,currency:'USD',source:'eBay',date:'2026-11-18',titles:['Kiki Rice']};
  const history={[legacy]:[evidence],[ph.cardKey(a)]:[{...evidence,price:12}],[ph.cardKey(b)]:[{...evidence,price:20}]};
  const saved=JSON.stringify(history);
  assert.notEqual(ph.cardKey(a),ph.cardKey(b));
  assert.deepEqual(ph.entriesForCard(history,a,[a,b]).map(e=>e.price),[12]);
  assert.deepEqual(ph.entriesForCard(history,b,[a,b]).map(e=>e.price),[20]);
  assert.deepEqual(ph.entriesForCard(history,a,[a]).map(e=>e.price),[12,10]);
  assert.equal(JSON.stringify(history),saved,'reading legacy prices never migrates or rewrites stored evidence');
  const tyler={id:7,product:'2021 Bowman',cardNumber:'10',cardSet:'Base'};
  assert.equal(ph.cardKey(tyler),'2021|2021 Bowman|10|Base','all Tyler history keys retain their original form');
});

test('reassigning a scanned listing cannot move unrelated same-day observations', () => {
  const parsed={source:'eBay',itemId:'123',rawSet:'Kiki Rice Gold'};
  const entry={source:'eBay',currency:'USD',kind:'asking',itemId:'123',titles:['Kiki Rice Gold']};
  assert.equal(scan.sameListingEvidence(entry,parsed,'USD','asking'),true);
  assert.equal(scan.sameListingEvidence({...entry,itemId:'999'},parsed,'USD','asking'),false);
  assert.equal(scan.sameListingEvidence({...entry,currency:'CAD'},parsed,'USD','asking'),false);
  assert.equal(scan.sameListingEvidence({...entry,kind:'sold'},parsed,'USD','asking'),false);
  assert.equal(scan.sameListingEvidence({...entry,source:'COMC'},parsed,'USD','asking'),false);
  assert.equal(scan.sameListingEvidence(entry,{source:'eBay',rawSet:'Nyara Sabally Gold'},'USD','asking'),false);
});

test('SportLots format uses actual Low Price and never treats stock as owned quantity', () => {
  const text='SportLots\nShipping to Canada\n2026 Panini Prizm WNBA\n#10 Kiki Rice\nLow Price: $5.25\nTotal Quantity: 23';
  const result=scan.parseListings(text,{cards,roster,recordType:'purchase'});
  assert.equal(result.length,1);assert.equal(result[0].source,'SportLots');
  assert.equal(result[0].price,'5.25');assert.equal(result[0].currency,'USD');
  assert.equal(result[0].recordType,'listing');assert.equal(result[0].quantity,undefined);
  assert.equal(scan.match(result[0],cards,roster).card.id,1);
});

test('130point format selects sold price rather than original asking price', () => {
  const text='Currency: CAD\nSold Via:\neBay\n2026 Panini Prizm WNBA #10 Kiki Rice Best Offer Accepted\nList Price: C $25.00\nSale Price: C $18.00\nShipping Price: C $3.00\nDate: 2026-11-18';
  const result=scan.parseListings(text,{cards,roster,recordType:'purchase'});
  assert.equal(result.length,1);assert.equal(result[0].source,'130point');
  assert.equal(result[0].price,'18');assert.equal(result[0].currency,'CAD');
  assert.equal(result[0].recordType,'sold');assert.equal(result[0]._130pt.forSale,false);
  assert.equal(scan.match(result[0],cards,roster).card.id,1);
});

test('Canada versus USA ship-to inference works for realistic generic marketplace blocks', () => {
  for(const [destination,code] of [['Canada','CAD'],['United States','USD']]) {
    const text='Whatnot\nShip to: '+destination+'\n2026 Panini Prizm WNBA #10 Kiki Rice\n$12.50';
    const p=scan.parseListings(text,{cards,roster})[0];
    assert.equal(p.currency,code);assert.equal(p.currencyEvidence.reason,'shipping-destination');
    assert.equal(p.currencyEvidence.inferred,true);
  }
  const text='Ship to: Canada\n2026 Panini Prizm WNBA #10 Kiki Rice\nUS $12.50';
  assert.equal(scan.parseListings(text,{cards,roster})[0].currency,'USD');
});

test('COMC/SportLots amounts retain thousands and cents without borrowing the next card price', () => {
  const f=legacyFunctions(['parseCOMCShopText','splitSportLotsSet','parseSportLotsText']);
  const comc=f.parseCOMCShopText('2021 Bowman #10 Tyler Black\nUS $1,234.56\n2021 Bowman #11 Tyler Black\n2021 Bowman #12 Tyler Black US $9.00');
  assert.equal(comc[0].price,'1234.56');assert.equal(currency.infer(comc[0]).currency,'USD');
  assert.equal(comc[1].price,'');assert.equal(comc[2].price,'9');
  const sl=f.parseSportLotsText('2021 Bowman\n#10 Tyler Black\nLow Price: US $1,234.56\nTotal Quantity: 1');
  assert.equal(sl[0].price,'1234.56');assert.equal(currency.infer(sl[0]).currency,'USD');
});

test('Tempo source shortcuts use the actual player and ambiguous sparklines stay hidden', () => {
  const ctx={window:{MODE:'wnba',TEMPO_ROSTER:roster,CollectionScanner:scan,CollectionMarket:require('../collection-market-utils.js'),CollectionProfile:require('../collection-profile.js'),TrackerMarket:market,PriceHistoryUtils:require('../price-history-utils.js')},
    isSportMode:()=>false,cardYear:c=>String(c.year),globalPriceKey:c=>'test',ALL_CARDS:cards,PRICE_HISTORY:{},React:{createElement:(...args)=>args},WHATNOT_SEARCH:'https://www.whatnot.com/search?q=tyler+black',COMC_PLAYER:'https://www.comc.com/Players/Baseball/Tyler_Black/c389004'};
  vm.createContext(ctx);
  for(const name of ['pt130Url','whatnotUrl','comcUrl','Sparkline']) {
    const start=source.indexOf('function '+name+'('),end=source.indexOf('\n}\n',start)+3;
    vm.runInContext(source.slice(start,end),ctx);
  }
  assert.match(decodeURIComponent(ctx.pt130Url(cards[0])),/Kiki Rice/);assert.doesNotMatch(ctx.pt130Url(cards[0]),/tyler/i);
  assert.match(decodeURIComponent(ctx.whatnotUrl(cards[2])),/Nyara Sabally/);assert.match(decodeURIComponent(ctx.comcUrl(cards[0])),/Kiki Rice/);assert.doesNotMatch(ctx.comcUrl(cards[0]),/Tyler_Black/);
  const key=ctx.window.PriceHistoryUtils.cardKey(cards[0]);
  ctx.PRICE_HISTORY[key]=[{price:10,currency:'USD',kind:'asking',date:'2026-11-17'},{price:15,currency:'CAD',kind:'asking',date:'2026-11-18'}];
  assert.equal(ctx.Sparkline({card:cards[0]}),null);
  ctx.PRICE_HISTORY[key][1].currency='USD';ctx.PRICE_HISTORY[key][1].kind='sold';
  assert.equal(ctx.Sparkline({card:cards[0]}),null);
  ctx.PRICE_HISTORY[key][1].kind='asking';
  assert.ok(ctx.Sparkline({card:cards[0]}));
});
