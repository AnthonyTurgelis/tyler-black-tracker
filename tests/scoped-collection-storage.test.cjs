const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const copy=structuredClone;
const empty=()=>({statuses:{},details:{},cards:{},imports:{},forsale:{},dirty:[],synced:[],changelog:[],checkpoint:null,_migrationComplete:true});
async function boot() {
  let user={id:'owner'},authEvent;
  const cache=new Map(),receipts=new Set(),events=[],calls=[];
  const rows={collection_kv:{'tb-alldata-v1':{value:empty(),updated_at:1}},tempo_collection_kv:{
    'tempo-alldata-v1':{value:empty(),updated_at:1,updated_by:'owner'},
    'collect-racing-alldata-v1':{value:empty(),updated_at:1,updated_by:'owner'},
    'collect-baseball-alldata-v1':{value:empty(),updated_at:1,updated_by:'owner'}}};
  const localStorage={get length(){return cache.size},key:i=>[...cache.keys()][i],getItem:k=>cache.get(k)??null,setItem:(k,v)=>cache.set(k,String(v)),removeItem:k=>cache.delete(k)};
  const api={auth:{onAuthStateChange:fn=>{authEvent=fn},getSession:async()=>({data:{session:user?{user}:null}}),getUser:async()=>({data:{user}}),signOut:async()=>{user=null;authEvent('SIGNED_OUT',null);return {}}},
    rpc(name,args){return {single:async()=>{
      const key=args.collection_key||'tb-alldata-v1',table=args.collection_key?'tempo_collection_kv':'collection_kv';
      calls.push({rpc:name,key});
      if(!user)return {error:{message:'signed out'}};
      return {data:{...copy(rows[table][key]),applied_keys:(args.edit_keys||[]).filter(k=>receipts.has(user.id+':'+k))}};
    }}},
    from(table){const q={filters:{},payload:null,select(){return this},in(k,v){this.allowed=v;return this},eq(k,v){this.filters[k]=v;return this},update(value){this.payload=value;return this},
      async run(){
        const key=this.filters.key,row=rows[table][key];
        if(!key)calls.push({hydrate:table,keys:Object.keys(rows[table]).filter(key=>!this.allowed||this.allowed.includes(key))});
        if(this.payload){
          if(calls.rejectCode){const code=calls.rejectCode;delete calls.rejectCode;return {error:{code,message:"Version changed"}};}
          calls.push({write:table,key});
          if(!user)return {error:{message:'signed out'}};
          if(this.filters.updated_at!==row.updated_at)return {data:null};
          const value=copy(this.payload.value);
          assert.equal(value._expectedCollectionVersion,row.updated_at);
          assert.ok(value._collectionEditKeys.length);
          for(const receipt of value._collectionEditKeys){assert.equal(receipts.has(user.id+':'+receipt),false);receipts.add(user.id+':'+receipt)}
          delete value._expectedCollectionVersion;delete value._collectionEditKeys;
          row.value=value;row.updated_at++;
        }
        return {data:key?(row?copy(row):null):Object.entries(rows[table]).filter(([key])=>!this.allowed||this.allowed.includes(key)).map(([key,row])=>({key,...copy(row)}))};
      },single(){return this.run()},maybeSingle(){return this.run()},then(resolve,reject){return this.run().then(resolve,reject)}};return q}
  };
  const window={CollectionSync:require('../collection-sync'),PriceHistoryUtils:require('../price-history-utils'),TrackerMedia:require('../media-utils'),SUPABASE_URL:'https://invalid.test',SUPABASE_ANON_KEY:'key',supabase:{createClient:()=>api},dispatchEvent:e=>events.push(e)};
  vm.runInNewContext(fs.readFileSync(require.resolve('../storage-shim'),'utf8'),{window,localStorage,CustomEvent:function(type,{detail}){this.type=type;this.detail=detail},console:{log(){},warn(){},error(){}},setTimeout(){}});
  await window.storageReady;
  return {window,rows,cache,receipts,calls,events,localStorage,signout:()=>{user=null;authEvent('SIGNED_OUT',null)}};
}
test('Tempo and sports save through isolated journaled updates; no full snapshot upserts',async()=>{
  const h=await boot(),racing=h.window.trackerCollections.forMode('racing'),tempo=h.window.trackerCollections.forMode('wnba');
  const race=await racing.read(),wnba=await tempo.read();racing.begin(race);tempo.begin(wnba);
  racing.stage({...race,statuses:{7:'owned'},details:{7:{qty:'2'}},cards:{7:{name:'Driver'}}});
  tempo.stage({...wnba,statuses:{7:'in_transit'}});
  const results=await Promise.all([racing.sync(),tempo.sync()]);assert.ok(results.every(r=>r.cloudSaved));
  assert.equal(h.rows.tempo_collection_kv['collect-racing-alldata-v1'].value.statuses[7],'owned');
  assert.equal(h.rows.tempo_collection_kv['tempo-alldata-v1'].value.statuses[7],'in_transit');
  assert.equal(h.rows.collection_kv['tb-alldata-v1'].value.statuses[7],undefined);
  assert.equal(h.receipts.size,2);
  assert.ok(h.events.some(e=>e.type==='scoped-collection-synced'&&e.detail.mode==='racing'));
});
test('a pending sport draft is retained when refreshing; sign-out clears access and cache',async()=>{
  const h=await boot(),racing=h.window.trackerCollections.forMode('racing'),value=await racing.read();racing.begin(value);
  racing.stage({...value,statuses:{7:'owned'}});
  await assert.rejects(racing.read(),/pending edits/);
  assert.ok([...h.cache.keys()].some(k=>k.startsWith('collect-racing-edit-journal-v1:owner:')));
  h.signout();assert.equal(h.cache.has(racing.key),false);
  assert.equal(await h.window.storage.get(racing.key),null);
  await assert.rejects(racing.read(),/Sign in/);
  assert.equal((await racing.sync()).cloudSaved,false);
  assert.ok([...h.cache.keys()].some(k=>k.startsWith('collect-racing-edit-journal-v1:owner:')));
});
test('an uninitialized snapshot save is rejected instead of reporting a dropped edit as saved',async()=>{
  const h=await boot(),scope=h.window.trackerCollections.forMode('baseball');
  const result=await h.window.storage.set(scope.key,{...empty(),statuses:{7:'owned'}});
  assert.equal(result.cloudSaved,false);assert.match(result.error,/Load this collection/);
  assert.equal(h.rows.tempo_collection_kv[scope.key].value.statuses[7],undefined);
});
test('newer wall-clock snapshots do not override the saved Tempo collection',async()=>{
  const h=await boot(),scope=h.window.trackerCollections.forMode('wnba'),before=await scope.read();scope.begin(before);
  scope.stage({...before,statuses:{7:'owned'}});await scope.sync();
  const writes=h.calls.filter(c=>c.write).length;
  await h.window.storage.set(scope.key,{...before,statuses:{7:'owned'},_saveTimestamp:99999999999999});
  assert.equal(h.calls.filter(c=>c.write).length,writes);
});

test('opening the Tyler tracker does not fetch complete sport catalogues',async()=>{
  const h=await boot(),tempoRead=h.calls.find(c=>c.hydrate==='tempo_collection_kv');
  assert.ok(tempoRead);assert.deepEqual(tempoRead.keys,['tempo-alldata-v1']);
  assert.equal(h.cache.has('collect-racing-alldata-v1'),false);
});
test('a sport state larger than browser quota still saves through a small durable edit journal',async()=>{
  const h=await boot(),scope=h.window.trackerCollections.forMode('racing'),key=scope.key;
  h.rows.tempo_collection_kv[key].value.cards={large:{id:'large',notes:'x'.repeat(6*1024*1024)}};
  let largestWrite=0;const original=h.localStorage.setItem;
  h.localStorage.setItem=(key,value)=>{largestWrite=Math.max(largestWrite,value.length);if(value.length>5*1024*1024)throw Error('QuotaExceededError');return original(key,value)};
  const state=await scope.read();scope.begin(state);scope.stage({...state,statuses:{large:'owned'}});
  assert.ok([...h.cache.keys()].some(k=>k.startsWith('collect-racing-edit-journal-v1:owner:')));
  assert.ok(largestWrite<1000);
  const saved=await scope.sync();assert.equal(saved.cloudSaved,true);
  assert.equal(h.rows.tempo_collection_kv[key].value.statuses.large,'owned');assert.equal(h.cache.has(key),false);
});
test('a lazily opened sport restores durable offline edits before returning its cloud snapshot',async()=>{
  const h=await boot(),scope=h.window.trackerCollections.forMode('racing');
  const journal='collect-racing-edit-journal-v1:owner:closed-tab:1';
  h.localStorage.setItem(journal,JSON.stringify({created:1,writer:'closed-tab',seq:1,version:2,ops:[{path:['statuses','7'],after:'owned'}]}));
  const restored=await scope.read();assert.equal(restored.statuses[7],'owned');assert.equal(h.cache.has(journal),false);assert.equal(h.cache.has(scope.key),false);
});
test('a first manual sport edit retains every imported change-log entry',async()=>{
  const h=await boot(),scope=h.window.trackerCollections.forMode('racing');
  const log=Array.from({length:1100},(_,i)=>({ts:'2026-11-18T18:00:00Z',sid:'import',cardId:String(i),field:'Import'}));
  h.rows.tempo_collection_kv[scope.key].value.changelog=log;
  const state=await scope.read();scope.begin(state);scope.stage({...state,changelog:[{ts:'2026-11-18T19:00:00Z',sid:'manual',cardId:'7',field:'qty'},...log]});
  assert.equal((await scope.sync()).cloudSaved,true);assert.equal(h.rows.tempo_collection_kv[scope.key].value.changelog.length,1101);
});

for(const code of ['PT409','40001']) test(code+' conflicts are re-read and retried without dropping the edit journal',async()=>{
 const h=await boot(),scope=h.window.trackerCollections.forMode('racing'),state=await scope.read();scope.begin(state);
 scope.stage({...state,statuses:{7:'owned'}});h.calls.rejectCode=code;
 assert.equal((await scope.sync()).cloudSaved,true);assert.equal(h.rows.tempo_collection_kv[scope.key].value.statuses[7],'owned');
 assert.equal(h.receipts.size,1);assert.equal(scope.hasPending(),false);
});
