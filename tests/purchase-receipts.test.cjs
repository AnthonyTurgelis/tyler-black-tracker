const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../purchase-receipts-panel.jsx'),'utf8');
const sandbox={window:{TrackerMarket:require('../market-utils'),ScanCurrency:require('../scan-currency')},URL};
vm.runInNewContext(source.split('/* RECEIPT_PANEL_UI */')[0],sandbox);
const U=sandbox.window.PurchaseReceiptCore;
const clone=value=>JSON.parse(JSON.stringify(value));
const NOW='2026-11-18T20:00:00Z';
const card={id:7,product:'2024 Example',cardNumber:'12',cardSet:'Gold /10',subject:'Example Player'};
const context={ownerId:'owner-a',scope:'tb',cards:[card],now:NOW};
function seed(){return {schemaVersion:1,records:{one:{id:'one',collection:'tyler',account:'collector@example.test',orderId:'order-one',itemId:'item-one',receipt:{title:'Example card',itemPrice:{currency:'USD',amount:'12.50'},orderTotal:{currency:'USD',amount:'18.00'},settlementCharged:{currency:'CAD',amount:'25.50'},financialStatus:'refund_denied',case:{caseId:'case-one',refundOutcome:'denied'},serialFromTitle:'07/10',events:[{sourceMessageId:'source-one'}]},catalogueCandidates:[{cardId:7,matchBasis:'Candidate only'}],link:null},two:{id:'two',collection:'racing',receipt:{title:'Generic lot',refundIssued:{currency:'CAD',amount:'1.00'}},link:null}},changelog:[],futureMetadata:{retain:true}};}
function deferred(){let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};}
function harness(){
 let row=seed(),revision=3,owner='owner-a',saveHook=null,loadHook=null;const writes=[];
 const store={load:async key=>{assert.equal(key,'purchase-receipts-v1');if(loadHook)await loadHook();return {ok:true,value:clone(row),ownerId:'owner-a',revision};},save:async(key,value,expected,ownerId)=>{writes.push({key,value:clone(value),revision:expected,ownerId});if(saveHook)await saveHook();if(expected!==revision)return {ok:false,conflict:true};row=clone(value);revision++;return {ok:true,value:clone(row),revision,ownerId:'owner-a'};}};
 const session=()=>U.createSession({store,getOwnerId:()=>owner});
 return {store,writes,session,setOwner:id=>{owner=id;},setSaveHook:fn=>{saveHook=fn;},setLoadHook:fn=>{loadHook=fn;},getRow:()=>clone(row),getRevision:()=>revision};
}
const choice={scope:'tb',cardId:7,confirmed:true};

test('receipt approval changes only link and audit history; prices, disputes, serials and other records remain exact',()=>{
 const original=seed(),before=JSON.stringify(original),result=U.applyLink(original,'one',choice,context);
 assert.equal(JSON.stringify(original),before);
 assert.deepEqual(clone(result.value.records.one.receipt),original.records.one.receipt);
 assert.deepEqual(clone(result.value.records.two),original.records.two);
 assert.deepEqual(clone(result.value.futureMetadata),original.futureMetadata);
 assert.deepEqual(clone(result.value.records.one.link),{status:'approved',scope:'tb',cardId:7,cardLabel:U.cardLabel(card),approvedBy:'owner-a',approvedAt:NOW,method:'owner_selected'});
 assert.equal(result.value.changelog.length,1);
 const stripped=clone(result.value);stripped.records.one.link=null;stripped.changelog=[];
 assert.deepEqual(stripped,original);
});

test('suggestions never auto-link; explicit approval, existing catalog identity and matching scope are required',()=>{
 assert.equal(U.normalize(seed()).records.one.link,null);
 assert.throws(()=>U.applyLink(seed(),'one',{...choice,confirmed:false},context),/Confirm/);
 assert.throws(()=>U.applyLink(seed(),'one',choice,{...context,cards:[]}),/available card/);
 assert.throws(()=>U.applyLink(seed(),'one',choice,{...context,cards:[{...card,archived:true}]}),/available card/);
 assert.throws(()=>U.applyLink(seed(),'one',{...choice,scope:'racing'},context),/collection/);
 assert.throws(()=>U.applyLink(seed(),'two',choice,context),/collection/);
 assert.throws(()=>U.applyLink(seed(),'one',choice,{...context,ownerId:''}),/Confirm/);
});

test('same approved identity is idempotent; string catalog IDs remain intact and unlink retains evidence',()=>{
 const first=U.applyLink(seed(),'one',choice,context);
 assert.equal(U.applyLink(first.value,'one',choice,context).changed,false);
 const racingCard={...card,id:'tcdb:123'};
 const racing=U.applyLink(seed(),'two',{scope:'racing',cardId:'tcdb:123',confirmed:true},{...context,scope:'racing',cards:[racingCard]});
 assert.equal(racing.value.records.two.link.cardId,'tcdb:123');
 const unlinked=U.removeLink(first.value,'one',context);
 assert.equal(unlinked.value.records.one.link,null);
 assert.deepEqual(clone(unlinked.value.records.one.receipt),seed().records.one.receipt);
 assert.equal(unlinked.value.changelog.length,2);
});

test('two sessions use revision CAS; a stale approval cannot replace a newer link',async()=>{
 const h=harness(),a=h.session(),b=h.session();await a.load();await b.load();
 assert.equal((await a.approve('one',choice,context)).ok,true);
 const other={...card,id:8};
 const stale=await b.approve('one',{...choice,cardId:8},{...context,cards:[other]});
 assert.equal(stale.ok,false);assert.equal(stale.conflict,true);assert.equal(b.getSnapshot().ready,false);
 assert.equal(h.getRow().records.one.link.cardId,7);
 assert.equal(h.writes[0].revision,3);assert.equal(h.writes[1].revision,3);
 assert.ok(h.writes.every(write=>write.key==='purchase-receipts-v1'&&write.ownerId==='owner-a'));
 assert.equal((await b.approve('one',choice,context)).ok,false);assert.equal(h.writes.length,2);
});

test('double-click approval makes one write and does not optimistically show a link',async()=>{
 const h=harness(),s=h.session();await s.load();const gate=deferred();h.setSaveHook(()=>gate.promise);
 const first=s.approve('one',choice,context),second=await s.approve('one',choice,context);
 assert.equal(second.busy,true);assert.equal(h.writes.length,1);assert.equal(s.getSnapshot().value.records.one.link,null);
 gate.resolve();assert.equal((await first).ok,true);assert.equal(h.getRow().changelog.length,1);
 assert.equal((await s.approve('one',choice,context)).changed,false);assert.equal(h.writes.length,1);
});

test('auth generation invalidates late reads and writes and clears every private receipt',async()=>{
 const h=harness(),s=h.session(),read=deferred();h.setLoadHook(()=>read.promise);
 const loading=s.load();s.invalidate();h.setOwner('owner-b');read.resolve();
 assert.equal((await loading).stale,true);assert.equal(Object.keys(s.getSnapshot().value.records).length,0);
 h.setOwner('owner-a');h.setLoadHook(null);await s.load();const save=deferred();h.setSaveHook(()=>save.promise);
 const saving=s.approve('one',choice,context);s.invalidate();h.setOwner(null);save.resolve();
 assert.equal((await saving).stale,true);assert.equal(Object.keys(s.getSnapshot().value.records).length,0);
 assert.equal(s.getSnapshot().ready,false);
});

test('owner changes without an event still block writes and discard late private results',async()=>{
 const h=harness(),s=h.session();await s.load();h.setOwner('owner-b');
 assert.equal((await s.approve('one',choice,context)).signedOut,true);assert.equal(h.writes.length,0);assert.equal(Object.keys(s.getSnapshot().value.records).length,0);
 h.setOwner('owner-a');const gate=deferred();h.setLoadHook(()=>gate.promise);const loading=s.load();h.setOwner('owner-b');gate.resolve();
 assert.equal((await loading).signedOut,true);assert.equal(Object.keys(s.getSnapshot().value.records).length,0);
});

test('uncertain save failure leaves original evidence and forces refresh before retry',async()=>{
 const h=harness(),s=h.session();await s.load();h.setSaveHook(()=>{throw Error('Network interrupted');});
 const result=await s.approve('one',choice,context);
 assert.equal(result.ok,false);assert.equal(s.getSnapshot().ready,false);assert.equal(s.getSnapshot().value.records.one.link,null);
 assert.equal((await s.approve('one',choice,context)).ok,false);assert.equal(h.writes.length,1);
});

test('invalid cloud payloads fail closed; labels preserve explicit currencies and unsafe links are blocked',async()=>{
 assert.throws(()=>U.normalize({schemaVersion:2,records:{},changelog:[]}),/Nothing was replaced/);
 assert.throws(()=>U.normalize({schemaVersion:1,records:{one:{id:'wrong',receipt:{}}},changelog:[]}),/Nothing was replaced/);
 const s=U.createSession({getOwnerId:()=> 'owner-a',store:{load:async()=>({ok:true,ownerId:'owner-a',value:{records:[]},revision:2})}});
 assert.equal((await s.load()).ok,false);assert.equal(s.getSnapshot().ready,false);
 assert.equal(U.money({currency:'USD',amountMinor:1250}),'USD 12.50');assert.equal(U.money({currency:'CAD',amount:'17.42'}),'CAD 17.42');
 assert.equal(U.money(null),'Not stated');assert.equal(U.safeUrl('javascript:alert(1)'),'');assert.equal(U.safeUrl('https://user:password@example.test'),'');
 assert.equal(U.safeUrl('https://mail.google.com/mail/u/#all/example'),'https://mail.google.com/mail/u/#all/example');
});

test('COMC proof and item links preserve their platform; unknown numeric IDs are not eBay items',()=>{
 const comc={platform:'COMC',itemId:'123456789',receipt:{sourceUrl:'https://www.comc.com/item/123456789',events:[{eventType:'purchase',sourceUrl:'https://www.comc.com/item/123456789'}]}};
 assert.deepEqual(clone(U.itemLink(comc)),{label:'COMC item',url:'https://www.comc.com/item/123456789'});
 assert.equal(U.proofLabel(U.receiptSources(comc)[0].sourceUrl),'COMC proof');
 assert.equal(U.itemLink({platform:'eBay',itemId:'987654321'}).url,'https://www.ebay.com/itm/987654321');
 assert.equal(U.itemLink({itemId:'123456789'}),null);
 assert.equal(U.itemLink({platform:'COMC',itemId:'123?x=1'}),null);
 assert.equal(U.proofLabel('https://mail.google.com/mail/u/#all/example'),'Email proof');
 assert.equal(U.proofLabel('https://comc.com.evil.test/example'),'Source proof');
 assert.equal(U.receiptSources({receipt:{sourceUrl:comc.receipt.sourceUrl}}).length,1);
 assert.equal(U.receiptSources({receipt:{sourceUrl:'javascript:alert(1)',events:[]}}).length,0);
 assert.equal(comc.receipt.events[0].eventType,'purchase');
});

test('receipt item uses ship-to while a separate settlement keeps its own currency', () => {
  assert.equal(U.money({amount:'7.25',currency:'UNKNOWN'},{shippingCountry:'CA'}),'CAD 7.25');
  assert.equal(U.money({amount:'7.25'},{platform:'COMC'}),'USD 7.25');
  assert.equal(U.money({amount:'9.80',currency:'USD'},{shippingCountry:'CA'}),'USD 9.80');
  assert.equal(U.money({amount:'9.80'}),'9.80');
});
