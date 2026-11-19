const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require.resolve('../tracker.jsx'),'utf8');
const profile=require('../collection-profile.js'),copies=require('../copy-utils.js');
function context(mode='racing',extra={}) {
 const ctx={window:{MODE:mode,CollectionProfile:profile,CopyInventory:copies,TEMPO_ROSTER:{rice:{name:'Kiki Rice'}}},ALL_CARDS:[],cardYear:c=>String(c.year||(/^\d{4}/.exec(c.product)||[''])[0]),stripBrand:s=>s,...extra};
 vm.createContext(ctx);vm.runInContext(source.slice(source.indexOf('function panelCardSubject('),source.indexOf('function ProgressBar(')),ctx);return ctx;
}
function nested(ctx,name,next){const start=Math.max(source.indexOf('  function '+name+'('),source.indexOf('  async function '+name+'(')),end=source.indexOf(next,start);assert.ok(start>=0&&end>start);vm.runInContext(source.slice(start,end),ctx);}
test('shared view identities and URLs preserve racing names and explicit year without truncating product',()=>{
 const c=context(),card={id:'tcdb:1',subject:'Dale Earnhardt Jr.',year:2001,product:'Press Pass',cardNumber:'3',isRC:''};
 assert.equal(c.panelCardSubject(card),'Dale Earnhardt Jr.');assert.equal(c.getBrand('Panini Prizm Racing'),'Panini');assert.equal(c.getBrand('2024 Topps Chrome'),'Topps');
 const url=new URL(c.panelSetSearch(card,'ebay'));assert.equal(url.searchParams.get('_nkw'),'Dale Earnhardt Jr. 2001 Press Pass 3');assert.doesNotMatch(url.href,/Tyler/);
 assert.equal(c.panelCardIsRookie({...card,year:2024}),false);assert.equal(c.panelCardIsRookie({...card,isRC:'Yes'}),true);
 assert.equal(context('wnba').panelCardSubject({player:'rice'}),'Kiki Rice');assert.equal(context('tb').panelCardSubject({}),'Tyler Black');
});
test('dashboard counts owned and in-transit independently, deduplicates acquired progress, and keeps years separate',()=>{
 const cards=[{id:'tcdb:1',year:2025,product:'Panini Prizm',cardSet:'Base',player:'a'},{id:'tcdb:2',year:2026,product:'Panini Prizm',cardSet:'Base',player:'a'},{id:'tcdb:3',year:2026,product:'Panini Prizm',cardSet:'Gold',player:'b'},{id:'tcdb:4',year:2026,product:'Panini Prizm',cardSet:'Blue',player:'b'}];
 const statuses={'tcdb:1':'owned','tcdb:2':'in_transit','tcdb:3':'owned'},details={'tcdb:3':{qty:3,ownedQty:1,transitQty:2}};
 const ctx=context('racing',{trackerMode:'racing',selectedPlayer:null,cardDetails:details,copySummaries:null,passesFilter:()=>true,SSP_TAGS:{},cardPlayers:c=>[c.player],cardHasPlayer:(c,p)=>c.player===p,collectionCardState:(id,s,d)=>copies.summarizeCard(null,id,s,d)});
 nested(ctx,'calcStats','\n  var stats =');const before=JSON.stringify({cards,statuses,details}),stats=ctx.calcStats(cards,statuses,1,true,false,false,false);
 assert.equal(stats.owned,2);assert.equal(stats.transit,2);assert.equal(stats.acquired,3);assert.equal(stats.total,4);assert.equal(stats.byProduct['2025 Panini Prizm'].total,1);assert.equal(stats.byProduct['2026 Panini Prizm'].total,3);assert.equal(stats.byPlayer.b.owned,1);assert.equal(stats.byPlayer.b.transit,1);assert.equal(stats.byPlayer.b.acquired,1);assert.equal(JSON.stringify({cards,statuses,details}),before);
 ctx.selectedPlayer='a';const selected=ctx.calcStats(cards,statuses,1,true,false,false,false);assert.equal(selected.total,2);assert.equal(selected.owned,1);assert.equal(selected.transit,1);
});
test('disabled sport pricing never writes or changes receipt financial evidence',()=>{
 let writes=0;const ctx=context('racing',{pricingEnabled:false,savePriceHistory:()=>writes++,priceKey:c=>c.id,CARD_BY_ID:{},AMBIGUOUS_PRICE_KEYS:new Set(),AMBIGUOUS_CARD_IDS:new Set()});
 nested(ctx,'recordPrice','\n  function saveComcOverrides');
 const receipt={recordType:'purchase',price:'10.25',currency:'CAD',shipping:'4',sourceOrderId:'order1'},before=JSON.stringify(receipt);
 ctx.recordPrice('tcdb:1','10.25','eBay','receipt',null,receipt);ctx.recordPrice('tcdb:1','12','COMC','listing',null,{recordType:'listing',currency:'USD'});
 assert.equal(writes,0);assert.equal(JSON.stringify(receipt),before);
});
test('explicit scanner Transit action passes transit intent through while receipt path stages private evidence',async()=>{
 const calls=[],applied=[];const ctx=context('racing',{parsed:[{parsed:{recordType:'listing'},match:{card:{id:'tcdb:1'}}}],rawInput:'',scanCurrency:'USD',statuses:{'tcdb:1':'owned'},setCardStatus:(id,status)=>{calls.push([id,status]);return true;},updateCardDetail:()=>{},setApplied:f=>applied.push(f({})),setImportMessage:()=>{},props:{}});
 ctx.window.ScanCurrency={apply:p=>p,amount:()=>0};nested(ctx,'applyImport','\n  function applyMatch(');assert.equal(await ctx.applyImport(0,'in_transit'),true);assert.deepEqual(calls,[['tcdb:1','in_transit']]);
 ctx.parsed[0].parsed={recordType:'purchase',price:'10',currency:'CAD'};ctx.props.importPurchaseCopy=async(card,p)=>{calls.push(['receipt',card.id,p.currency]);return {ok:true};};await ctx.applyImport(0,'in_transit');assert.deepEqual(calls,[['tcdb:1','in_transit'],['receipt','tcdb:1','CAD']]);
});

test('TCDB list detection holds ambiguous navigation and preserves explicit inbound intent',()=>{
 const ctx=context('racing',{acceptsSubject:()=>true,subjectNames:()=>['Dale Earnhardt Jr.']});nested(ctx,'parseTcdbCollection','\n  function handleParse(');
 assert.equal(ctx.parseTcdbCollection('Collection Summary\nWant\nHave\nCards | Filters').status,'unknown');
 assert.equal(ctx.parseTcdbCollection('Collection Summary\nIn-Transit (Inbound)\nHave\nCards | Filters').status,'in_transit');
 assert.equal(ctx.parseTcdbCollection('Collection Summary\nHave\nCards | Filters').status,'owned');
 assert.equal(ctx.parseTcdbCollection('https://www.tcdb.com/Collection.cfm?Filter=I\nCollection Summary\nWant\nHave\nCards | Filters').status,'in_transit');
 assert.equal(ctx.parseTcdbCollection('https://www.tcdb.com/Collection.cfm?Filter=I\nhttps://www.tcdb.com/Collection.cfm?Filter=G').status,'unknown');
 assert.equal(ctx.parseTcdbCollection('Cards | Filters').status,'unknown');
});

test('selected-number lookup counts mixed copies in each status but subtracts acquired cards only once',()=>{
 const cardsForNum=[{id:'tcdb:1'},{id:'tcdb:2'},{id:'tcdb:3'}],statuses={'tcdb:1':'owned','tcdb:2':'in_transit'},cardDetails={'tcdb:1':{qty:2,ownedQty:1,transitQty:1}};
 const ctx=context('racing',{selectedNum:'7',cardsForNum,statuses,cardDetails,copySummaries:null,collectionCardState:(id,s,d,summary)=>summary?.[id]||copies.summarizeCard(null,id,s,d)});
 const start=source.indexOf('  var numStats = selectedNum ?'),end=source.indexOf('\n  return (',start);assert.ok(start>0&&end>start);
 const input=JSON.stringify({cardsForNum,statuses,cardDetails});vm.runInContext(source.slice(start,end),ctx);
 assert.equal(ctx.numStats.owned,1);assert.equal(ctx.numStats.transit,2);assert.equal(ctx.numStats.acquired,2);assert.equal(ctx.numStats.needed,1);assert.equal(ctx.numStats.total,3);assert.equal(JSON.stringify({cardsForNum,statuses,cardDetails}),input);
 // Saved copy allocations override a stale scalar status without changing it.
 ctx.copySummaries={'tcdb:2':{owned:true,inTransit:true}};vm.runInContext(source.slice(start,end),ctx);
 assert.equal(ctx.numStats.owned,2);assert.equal(ctx.numStats.transit,2);assert.equal(ctx.numStats.needed,1);assert.equal(statuses['tcdb:2'],'in_transit');
 ctx.selectedNum=null;vm.runInContext(source.slice(start,end),ctx);assert.equal(ctx.numStats,null);
});

test('TCDB explicit filters hold invalid values and conflicting clear headings without mistaking navigation for evidence',()=>{
 const ctx=context('racing',{acceptsSubject:()=>true,subjectNames:()=>['Dale Earnhardt Jr.']});nested(ctx,'parseTcdbCollection','\n  function handleParse(');
 for (const text of [
  'https://www.tcdb.com/Collection.cfm?Filter=G\nCollection Summary\nWant\nCards | Filters',
  'https://www.tcdb.com/Collection.cfm?Filter=G\nCollection Summary\nIn-Transit (Inbound)\nHave\nCards | Filters',
  'https://www.tcdb.com/Collection.cfm?Filter=X\nCollection Summary\nHave\nCards | Filters',
  'https://www.tcdb.com/Collection.cfm?Filter=\nCollection Summary\nHave\nCards | Filters',
  'https://www.tcdb.com/Collection.cfm?Filter=G\nhttps://www.tcdb.com/Collection.cfm?Filter=X\nCollection Summary\nHave\nCards | Filters'
 ]) assert.equal(ctx.parseTcdbCollection(text).status,'unknown',text);
 assert.equal(ctx.parseTcdbCollection('https://www.tcdb.com/Collection.cfm?Filter=G\nCollection Summary\nWant\nHave\nCards | Filters').status,'owned');
 assert.equal(ctx.parseTcdbCollection('https://www.tcdb.com/Collection.cfm?Filter=W\nCollection Summary\nWant\nCards | Filters').status,'not_owned');
});
