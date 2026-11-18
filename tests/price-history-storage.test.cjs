const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const PH=require('../price-history-utils.js'),KEY='tb-price-history-v1',source=fs.readFileSync(path.join(__dirname,'../storage-shim.js'),'utf8');
const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
const observation=(id,extra={})=>({observationKey:id,date:'2026-11-16',observedAt:'2026-11-16T10:00:00Z',source:'eBay',currency:'USD',kind:'asking',price:10,titles:['Card'],...extra});

async function boot(initial, key=KEY) {
 const cache=new Map(),db={row:initial===undefined?null:{value:clone(initial),updated_at:'v1'},version:1},calls={reads:0,writes:[],beforeWrite:null,failRead:false,conflictAlways:false};
 const client={auth:{getSession:async()=>({data:{session:{user:{id:'owner'}}}})},from(table){
  let operation='read',payload,filters={};
  const query={select(){return this;},in(){return this;},eq(key,value){filters[key]=value;return this;},insert(row){operation='insert';payload=row;return this;},update(row){operation='update';payload=row;return this;},
   then(resolve,reject){return Promise.resolve({data:[],error:null}).then(resolve,reject);},
   async maybeSingle(){assert.equal(table,key.startsWith('tempo-')?'tempo_collection_kv':'collection_kv');assert.equal(operation==='insert'?payload.key:filters.key,key);
    if(operation==='read'){calls.reads++;return {data:clone(db.row),error:calls.failRead?{message:'Read failed'}:null};}
    calls.writes.push({operation,filters:clone(filters),value:clone(payload.value)});if(calls.beforeWrite)await calls.beforeWrite({operation,payload,filters,db});
    if(operation==='insert'&&db.row)return{data:null,error:{code:'23505',message:'Duplicate key'}};
    if(operation==='update'&&(!db.row||db.row.updated_at!==filters.updated_at||calls.conflictAlways))return{data:null,error:null};
    db.row={value:clone(payload.value),updated_at:'v'+(++db.version)};return{data:clone(db.row),error:null};
   }};return query;
 }};
 const events=[],window={CollectionSync:require("../collection-sync.js"),SUPABASE_URL:'https://example.invalid',SUPABASE_ANON_KEY:'public',PriceHistoryUtils:PH,supabase:{createClient:()=>client},dispatchEvent:event=>events.push(event)};
 const localStorage={get length(){return cache.size;},key:i=>[...cache.keys()][i],getItem:key=>cache.has(key)?cache.get(key):null,setItem:(key,value)=>cache.set(key,String(value)),removeItem:key=>cache.delete(key)};
 vm.runInNewContext(source,{window,localStorage,console:{log(){},warn(){},error(){}},CustomEvent:function(type,options){this.type=type;this.detail=options.detail;},setTimeout(){}});
 await window.storageReady;return{window,cache,db,calls,events,localStorage};
}

test('a stale price-history save merges fresh cloud observations before a timestamp-conditional update',async()=>{
 const a=observation('a'),b=observation('b'),h=await boot({card:[a,b]});
 const result=await h.window.storage.set(KEY,{card:[a,observation('c')]});
 assert.equal(result.cloudSaved,true);assert.deepEqual(h.db.row.value.card.map(PH.identity).sort(),['a','b','c']);
 assert.equal(h.calls.writes[0].operation,'update');assert.equal(h.calls.writes[0].filters.updated_at,'v1');
});

test('an intervening writer wins the first CAS and its evidence is retained by the retry',async()=>{
 const h=await boot({card:[observation('a')]});let raced=false;
 h.calls.beforeWrite=({db})=>{if(raced)return;raced=true;db.row={value:{card:[observation('a'),observation('other-tab')]},updated_at:'race'};};
 const result=await h.window.storage.set(KEY,{card:[observation('local')]});
 assert.equal(result.cloudSaved,true);assert.equal(h.calls.writes.length,2);assert.equal(h.calls.writes[1].filters.updated_at,'race');
 assert.deepEqual(h.db.row.value.card.map(PH.identity).sort(),['a','local','other-tab']);
});

test('concurrent initial insertion retries without replacing the other initial observations',async()=>{
 const h=await boot();let raced=false;
 h.calls.beforeWrite=({operation,db})=>{if(raced||operation!=='insert')return;raced=true;db.row={value:{card:[observation('other-first')]},updated_at:'race'};};
 const result=await h.window.storage.set(KEY,{card:[observation('local-first')]});
 assert.equal(result.cloudSaved,true);assert.deepEqual(h.db.row.value.card.map(PH.identity).sort(),['local-first','other-first']);assert.equal(h.calls.writes.length,2);
});

test('legacy fallback dedupe retains different currency, type and titles and enriches matching observations',()=>{
 const legacy={date:'2026-11-15',source:'COMC',price:5,titles:['One']};
 const merged=PH.merge({card:[legacy,observation('a',{lastSeenAt:'2026-11-16T11:00:00Z',seller:'Known seller'})]},{card:[legacy,{...legacy,currency:'CAD'},{...legacy,kind:'sold'},{...legacy,titles:['Two']},observation('a',{lastSeenAt:'2026-11-16T12:00:00Z',seller:'',notes:['New note']})]});
 assert.equal(merged.card.length,5);const modern=merged.card.find(row=>row.observationKey==='a');assert.equal(modern.seller,'Known seller');assert.deepEqual(modern.notes,['New note']);
});

test('explicit deletions survive stale saves and reassignment can restore only the intended target',async()=>{
 const a=observation('a'),b=observation('b'),h=await boot({old:[a,b]});
 const removed=PH.applyChanges({old:[a,b]},[{cardKey:'old',entries:[a]}],[],'2026-11-16T12:00:00Z');
 await h.window.storage.set(KEY,removed);await h.window.storage.set(KEY,{old:[a,b,observation('later')]});
 assert.deepEqual(h.db.row.value.old.map(PH.identity).sort(),['b','later']);assert.equal(PH.visible(h.db.row.value).__historyMeta,undefined);
 const moved=PH.applyChanges(PH.merge(h.db.row.value,{target:[a]}),[],[{cardKey:'target',entries:[a]}],'2026-11-16T12:01:00Z');
 await h.window.storage.set(KEY,moved);assert.deepEqual(h.db.row.value.target.map(PH.identity),['a']);assert.equal(h.db.row.value.old.some(row=>row.observationKey==='a'),false);
});

test('read errors and exhausted CAS conflicts retain local data and never report a successful save',async()=>{
 const h=await boot({card:[observation('cloud')]});h.calls.failRead=true;
 const failed=await h.window.storage.set(KEY,{card:[observation('local')]});assert.equal(failed.cloudSaved,false);assert.equal(h.calls.writes.length,0);assert.ok(h.cache.get(KEY).includes('local'));
 h.calls.failRead=false;h.calls.conflictAlways=true;const conflict=await h.window.storage.set(KEY,{card:[observation('local')]});
 assert.equal(conflict.cloudSaved,false);assert.equal(h.calls.writes.length,5);assert.deepEqual(h.db.row.value.card.map(PH.identity),['cloud']);assert.ok(h.events.some(event=>event.type==='storage-sync-issue'));
});

test('queued same-tab writes preserve observations added while an earlier request is in flight',async()=>{
 const h=await boot({card:[observation('cloud')]});let release,started;const entered=new Promise(resolve=>{started=resolve;});const gate=new Promise(resolve=>{release=resolve;});let first=true;
 h.calls.beforeWrite=async()=>{if(first){first=false;started();await gate;}};
 const one=h.window.storage.set(KEY,{card:[observation('one')]});await entered;const two=h.window.storage.set(KEY,{card:[observation('two')]});release();
 const results=await Promise.all([one,two]);assert.ok(results.every(result=>result.cloudSaved));assert.deepEqual(h.db.row.value.card.map(PH.identity).sort(),['cloud','one','two']);
});

test('graded legacy identity is stable across object key order and preserves simple/string identities',()=>{
 const base={date:'2026-11-16',source:'eBay',price:15,titles:['Proof']};
 const a={...base,grading:{company:'SGC',cardGrade:'10',extra:{z:1,a:2}}};
 const b={...base,grading:{extra:{a:2,z:1},cardGrade:'10',company:'SGC'}};
 assert.equal(PH.identity(a),PH.identity(b));
 assert.equal(PH.merge({card:[a]},{card:[b]}).card.length,1);
 assert.equal(PH.identity(base),'legacy:["2026-11-16","eBay","",15,"","","","","",["Proof"]]');
 assert.equal(PH.identity({...base,grading:'SGC 10'}),'legacy:["2026-11-16","eBay","",15,"","","","","SGC 10",["Proof"]]');
 assert.equal(PH.identity({...a,observationKey:'unchanged-modern-key'}),'unchanged-modern-key');
});

test('old object-grading tombstones normalize before stale merges and only a newer restore revives evidence',()=>{
 const row={date:'2026-11-16',source:'eBay',price:15,titles:['Proof'],grading:{company:'SGC',cardGrade:'10'}};
 const oldKey='legacy:'+JSON.stringify([row.date,row.source,'',row.price,'','','','',row.grading,row.titles]);
 const canonical=PH.identity(row);assert.notEqual(oldKey,canonical);
 const history={__historyMeta:{version:1,events:{card:{[oldKey]:{deleted:true,updatedAt:'2026-11-16T01:00:00Z'}}}}};
 const stale={card:[{...row,grading:{cardGrade:'10',company:'SGC'}}]};
 let result=PH.merge(history,stale);assert.equal(result.card,undefined);assert.equal(result.__historyMeta.events.card[canonical].deleted,true);
 result=PH.merge(result,{...stale,__historyMeta:{version:1,events:{card:{[oldKey]:{deleted:false,updatedAt:'2026-11-15T23:00:00-02:00'}}}}});
 assert.equal(result.card,undefined,'equal instant restores do not override an explicit removal');
 result=PH.applyChanges(result,[],[{cardKey:'card',entries:[row]}],'2026-11-16T01:00:00.001Z');
 assert.equal(result.card.length,1);assert.equal(result.__historyMeta.events.card[canonical].deleted,false);
});

test('partial duplicate evidence preserves older fields and unions notes/titles using actual timestamp order',()=>{
 const existing=observation('same',{observedAt:'2026-11-16T01:00:00Z',seller:'Verified seller',grading:{company:'SGC',cardGrade:'10'},notes:['Reviewed front'],titles:['Original title']});
 const incoming={observationKey:'same',observedAt:'2026-11-15T23:30:00-02:00',price:12,seller:'',notes:['Cached title'],titles:['Revised title']};
 const row=PH.merge({card:[existing]},{card:[incoming]}).card[0];
 assert.equal(row.price,12);assert.equal(row.currency,'USD');assert.equal(row.seller,'Verified seller');assert.deepEqual(row.grading,existing.grading);
 assert.deepEqual(row.notes,['Reviewed front','Cached title']);assert.deepEqual(row.titles,['Original title','Revised title']);
 const equal=PH.merge({card:[existing]},{card:[{...incoming,observedAt:existing.observedAt}]}).card[0];
 assert.equal(equal.price,12);assert.equal(equal.currency,'USD');assert.equal(equal.seller,'Verified seller');
});

for(const key of ['tb-price-history-v1','tempo-price-history-v1']) test(key+' preserves concurrent observations and explicit removal in its own table',async()=>{
 const a=observation('a'),b=observation('b'),h=await boot({card:[a,b]},key);
 const deleted=PH.applyChanges({card:[a,b]},[{cardKey:'card',entries:[a]}],[],'2026-11-18T19:00:00Z');
 assert.equal((await h.window.storage.set(key,deleted)).cloudSaved,true);
 assert.equal((await h.window.storage.set(key,{card:[a,b,observation('new')]})).cloudSaved,true);
 assert.deepEqual(h.db.row.value.card.map(PH.identity).sort(),['b','new']);
 assert.equal(h.calls.writes.length,2);assert.equal(h.calls.writes[1].filters.updated_at,'v2');
});

for(const key of ['tb-price-history-v1','tempo-price-history-v1']) test(key+' confirms committed cloud saves even when the browser cache is full and reads current memory',async()=>{
 const h=await boot({card:[observation('cloud')]},key);h.cache.set(key,JSON.stringify({card:[observation('stale')]}));
 h.localStorage.setItem=()=>{throw Error('QuotaExceededError')};
 const result=await h.window.storage.set(key,{card:[observation('new')]});assert.equal(result.cloudSaved,true);assert.equal(result.localSaved,false);assert.match(result.localError,/Quota/);
 assert.deepEqual(h.db.row.value.card.map(PH.identity).sort(),['cloud','new','stale']);
 const read=JSON.parse((await h.window.storage.get(key)).value);assert.deepEqual(read.card.map(PH.identity).sort(),['cloud','new','stale']);
 assert.equal(h.cache.get(key).includes('new'),false,'unchanged stale disk cache is superseded by fresh in-memory evidence');
});

test('actual tracker price helpers still enqueue cloud writes and read fresh memory when localStorage is full',async()=>{
 const h=await boot({card:[observation('cloud')]});h.localStorage.setItem=()=>{throw Error('QuotaExceededError')};
 const tracker=fs.readFileSync(path.join(__dirname,'../tracker.jsx'),'utf8'),start=tracker.indexOf('function loadPriceHistory()'),end=tracker.indexOf('var TCDB_FLAGS',start);
 const ctx={window:h.window,localStorage:h.localStorage,tbk:()=>KEY,PRICE_HISTORY:{},CustomEvent:function(type,options){this.type=type;this.detail=options.detail;}};
 vm.createContext(ctx);vm.runInContext(tracker.slice(start,end),ctx);ctx.savePriceHistory({card:[observation('new')]});
 await new Promise(setImmediate);assert.equal(h.calls.writes.length,1);assert.equal(ctx.loadPriceHistory().card.some(row=>row.observationKey==='new'),true);
 assert.deepEqual(h.db.row.value.card.map(PH.identity).sort(),['cloud','new']);
});
