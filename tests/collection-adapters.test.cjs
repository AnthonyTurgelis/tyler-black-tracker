const test=require('node:test'),assert=require('node:assert/strict');
const A=require('../collection-adapters'),CI=require('../copy-utils'),TM=require('../media-utils'),PH=require('../price-history-utils');
function setup(){
 const rows=new Map(),calls=[];let owner='owner-a';
 const store={async load(key){calls.push(['read',key]);const row=rows.get(owner+':'+key);return {ok:true,value:structuredClone(row?.value??null),revision:row?.revision??null,ownerId:owner};},async save(key,value,revision,ownerId){calls.push(['save',key]);if(owner!==ownerId)return {ok:false,signedOut:true};const id=owner+':'+key,old=rows.get(id);if((old?.revision??null)!==revision)return {ok:false,conflict:true};const row={value:structuredClone(value),revision:(revision??0)+1};rows.set(id,row);return {ok:true,...structuredClone(row),ownerId:owner};}};
 return {api:A.create(store,{CopyInventory:CI,TrackerMedia:TM,PriceHistoryUtils:PH}),rows,calls,switchOwner:()=>owner='owner-b'};
}
test('scope adapters are lazy and route copies, media and prices to distinct private keys',async()=>{
 const h=setup(),race=h.api.forMode('racing'),other=h.api.forMode('other');assert.equal(h.calls.length,0);
 for(const branch of ['copies','media','prices']){const before=await race[branch].load(),next=await race[branch].save(before.value,before);assert.equal(next.ok,true);assert.equal(next.revision,1);assert.match(next.key,new RegExp('^collect-racing-'));assert.equal((await other[branch].load()).revision,null);}
 assert.equal(h.rows.size,3);assert.throws(()=>h.api.forMode('tb'),/supported/);
});
test('stale and cross-sport snapshots cannot overwrite existing private data',async()=>{
 const h=setup(),race=h.api.forMode('racing').copies,other=h.api.forMode('other').copies,old=await race.load();
 const saved=await race.save({...old.value,copies:{x:{cardId:'tcdb:123'}}},old);assert.equal(saved.ok,true);
 assert.equal((await race.save(old.value,old)).conflict,true);
 assert.equal((await other.save(saved.value,saved)).ok,false);
 assert.equal(h.rows.get('owner-a:'+race.key).value.copies.x.cardId,'tcdb:123');assert.equal(h.rows.has('owner-a:'+other.key),false);
});
test('auth changes reject edits and an unread revision cannot be used',async()=>{
 const h=setup(),store=h.api.forMode('racing').copies,snapshot=await store.load();
 assert.equal((await store.save({},undefined,snapshot.ownerId)).ok,false);assert.equal(h.calls.length,1);
 h.switchOwner();assert.equal((await store.save(snapshot.value,snapshot)).signedOut,true);assert.equal(h.rows.size,0);
});
test('price observations deduplicate by evidence identity with exact string card keys and independent targets',async()=>{
 const h=setup(),store=h.api.forMode('racing').prices;let snapshot=await store.load();
 const entry={observationKey:'ebay:listing:123:USD',source:'eBay',price:12,currency:'USD',kind:'listing'};
 snapshot=await store.record(snapshot,'tcdb:123',entry);snapshot=await store.record(snapshot,'tcdb:123',entry);
 assert.equal(snapshot.history['tcdb:123'].length,1);assert.equal(snapshot.history['123'],undefined);
 const withTarget=await store.save({...snapshot.value,targets:{'tcdb:123':{amount:10,currency:'USD'}}},snapshot);assert.equal(withTarget.targets['tcdb:123'].currency,'USD');
 assert.equal((await h.api.forMode('other').prices.record(withTarget,'tcdb:123',entry)).ok,false);
 assert.equal(h.rows.size,1);
});
test('private media preserves string IDs and rejects unsafe images before a write',async()=>{
 const h=setup(),store=h.api.forMode('racing').media,snapshot=await store.load();
 const saved=await store.save({version:1,cards:{'tcdb:123':{photos:[{url:'https://example.test/card.jpg',kind:'reference',side:'front'}]}}},snapshot);assert.equal(saved.ok,true);assert.ok(saved.value.cards['tcdb:123']);
 const bad=await store.save({cards:{'tcdb:123':{photos:[{url:'javascript:bad()',kind:'reference'}]}}},saved);assert.equal(bad.ok,false);assert.equal(h.rows.get('owner-a:'+store.key).revision,1);
});
