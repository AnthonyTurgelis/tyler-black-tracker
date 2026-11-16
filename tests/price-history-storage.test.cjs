const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const PH=require('../price-history-utils.js'),KEY='tb-price-history-v1',source=fs.readFileSync(path.join(__dirname,'../storage-shim.js'),'utf8');
const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
const observation=(id,extra={})=>({observationKey:id,date:'2026-11-16',observedAt:'2026-11-16T10:00:00Z',source:'eBay',currency:'USD',kind:'asking',price:10,titles:['Card'],...extra});

async function boot(initial) {
 const cache=new Map(),db={row:initial===undefined?null:{value:clone(initial),updated_at:'v1'},version:1},calls={reads:0,writes:[],beforeWrite:null,failRead:false,conflictAlways:false};
 const client={auth:{getSession:async()=>({data:{session:{user:{id:'owner'}}}})},from(table){
  let operation='read',payload,filters={};
  const query={select(){return this;},eq(key,value){filters[key]=value;return this;},insert(row){operation='insert';payload=row;return this;},update(row){operation='update';payload=row;return this;},
   then(resolve,reject){return Promise.resolve({data:[],error:null}).then(resolve,reject);},
   async maybeSingle(){assert.equal(table,'collection_kv');
    if(operation==='read'){calls.reads++;return {data:clone(db.row),error:calls.failRead?{message:'Read failed'}:null};}
    calls.writes.push({operation,filters:clone(filters),value:clone(payload.value)});if(calls.beforeWrite)await calls.beforeWrite({operation,payload,filters,db});
    if(operation==='insert'&&db.row)return{data:null,error:{code:'23505',message:'Duplicate key'}};
    if(operation==='update'&&(!db.row||db.row.updated_at!==filters.updated_at||calls.conflictAlways))return{data:null,error:null};
    db.row={value:clone(payload.value),updated_at:'v'+(++db.version)};return{data:clone(db.row),error:null};
   }};return query;
 }};
 const events=[],window={SUPABASE_URL:'https://example.invalid',SUPABASE_ANON_KEY:'public',PriceHistoryUtils:PH,supabase:{createClient:()=>client},dispatchEvent:event=>events.push(event)};
 const localStorage={get length(){return cache.size;},key:i=>[...cache.keys()][i],getItem:key=>cache.has(key)?cache.get(key):null,setItem:(key,value)=>cache.set(key,String(value)),removeItem:key=>cache.delete(key)};
 vm.runInNewContext(source,{window,localStorage,console:{log(){},warn(){},error(){}},CustomEvent:function(type,options){this.type=type;this.detail=options.detail;},setTimeout(){}});
 await window.storageReady;return{window,cache,db,calls,events};
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
