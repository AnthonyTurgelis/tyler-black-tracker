const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'storage-shim.js'), 'utf8');
const KEY = 'tb-copy-inventory-v1';
const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));

async function boot() {
  const cache = new Map(), rows = new Map(), calls = [];
  const auth = { user: {id:'owner-a'}, error:null, checks:0, beforeCheck:null, afterQuery:null, callback:null, events:[] };
  const client = {
    auth: {
      getSession: async () => ({data:{session:auth.user ? {user:auth.user} : null}}),
      onAuthStateChange: callback => { auth.callback = callback; return {data:{subscription:{unsubscribe(){}}}}; },
      getUser: async () => { auth.checks++; const user=auth.user; if (auth.beforeCheck) await auth.beforeCheck(); return {data:{user},error:auth.error}; },
      signOut: async () => { auth.user = null; return {error:null}; }
    },
    from(table) {
      let operation = 'read', payload, filters = {};
      const query = {
        select() { return this; },
        in() { return this; },
        eq(key,value) { filters[key] = value; return this; },
        insert(value) { operation = 'insert'; payload = value; return this; },
        update(value) { operation = 'update'; payload = value; return this; },
        then(resolve,reject) { return Promise.resolve({data:[],error:null}).then(resolve,reject); },
        async maybeSingle() {
          calls.push({table,operation,filters:clone(filters)});
          assert.equal(table,'collection_private_kv');
          const owner = operation === 'insert' ? payload.owner_id : filters.owner_id;
          const key = operation === 'insert' ? payload.key : filters.key;
          const id = owner + ':' + key, current = rows.get(id);
          const finish = async result => { if (auth.afterQuery) await auth.afterQuery(); return result; };
          assert.equal(owner,auth.user.id,'Every query must use the verified user ID');
          if (operation === 'insert') {
            if (current) return {data:null,error:{code:'23505',message:'Already exists'}};
            const next = {value:clone(payload.value),revision:1,updated_at:'2026-11-16T00:00:00Z'};
            rows.set(id,next); return finish({data:clone(next),error:null});
          }
          if (operation === 'update') {
            if (!current || current.revision !== Number(filters.revision)) return {data:null,error:null};
            const next = {...current,value:clone(payload.value),revision:current.revision+1};
            rows.set(id,next); return finish({data:clone(next),error:null});
          }
          return finish({data:clone(current || null),error:null});
        }
      };
      return query;
    }
  };
  const window = {CollectionSync:require("../collection-sync.js"),SUPABASE_URL:'https://example.invalid',SUPABASE_ANON_KEY:'public-test-key',supabase:{createClient:()=>client},dispatchEvent(event){auth.events.push(event);}};
  const localStorage = {get length(){return cache.size;},key:i=>[...cache.keys()][i],getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v),removeItem:k=>cache.delete(k)};
  vm.runInNewContext(source,{window,localStorage,console:{log(){},warn(){},error(){}},CustomEvent:function(type,options){this.type=type;this.detail=options.detail;},setTimeout(fn,ms){if(ms===0)queueMicrotask(fn);}});
  await window.storageReady;
  auth.switchUser = user => { auth.user=user; auth.callback(user ? 'SIGNED_IN' : 'SIGNED_OUT',user ? {user} : null); };
  return {window,auth,cache,rows,calls};
}

test('private copy storage verifies auth and never writes purchase data to public KV or local cache', async () => {
  const h = await boot();
  const initial = await h.window.trackerPrivateStore.load(KEY);
  assert.equal(initial.ok,true); assert.equal(initial.revision,null);
  const value = {observations:{purchase:{sourceOrderId:'private-order',paidPrice:'12.50',currency:'USD'}}};
  const saved = await h.window.trackerPrivateStore.save(KEY,value,null,initial.ownerId);
  assert.equal(saved.ok,true); assert.equal(saved.revision,1);
  assert.equal(h.auth.checks,4);
  assert.ok(h.calls.every(call=>call.table==='collection_private_kv'));
  assert.equal(h.cache.size,0);
  assert.equal(h.rows.get('owner-a:'+KEY).value.observations.purchase.sourceOrderId,'private-order');
});

test('stale revisions and duplicate initial inserts preserve newer cloud copies', async () => {
  const h = await boot();
  await h.window.trackerPrivateStore.save(KEY,{copies:{one:true}},null,'owner-a');
  const current = await h.window.trackerPrivateStore.save(KEY,{copies:{one:true,two:true}},1,'owner-a');
  assert.equal(current.revision,2);
  const stale = await h.window.trackerPrivateStore.save(KEY,{copies:{one:true}},1,'owner-a');
  assert.equal(stale.ok,false); assert.equal(stale.conflict,true);
  const duplicate = await h.window.trackerPrivateStore.save(KEY,{copies:{}},null,'owner-a');
  assert.equal(duplicate.ok,false); assert.equal(duplicate.conflict,true);
  assert.deepEqual(h.rows.get('owner-a:'+KEY).value,{copies:{one:true,two:true}});
  assert.equal(h.cache.size,0);
});

test('a client Owner flag is insufficient when server-verified authentication fails', async () => {
  const h = await boot();
  assert.equal(h.window.trackerAuth.isOwner(),true);
  h.auth.user = null; h.auth.error = {message:'Expired token'};
  const saved = await h.window.trackerPrivateStore.save(KEY,{private:true},null,'owner-a');
  assert.equal(saved.ok,false);
  assert.match(saved.error,/sign in/i);
  assert.equal(h.calls.length,0);
  assert.equal(h.rows.size,0);
  assert.equal(h.cache.size,0);
});

test('private reads are scoped to the authenticated owner and logout blocks later access', async () => {
  const h = await boot();
  h.rows.set('owner-b:'+KEY,{value:{private:'other owner'},revision:1});
  const result = await h.window.trackerPrivateStore.load(KEY);
  assert.equal(result.value,null);
  assert.equal(h.calls[0].filters.owner_id,'owner-a');
  await h.window.trackerAuth.logout();
  const after = await h.window.trackerPrivateStore.load(KEY);
  assert.equal(after.ok,false);
  assert.match(after.error,/sign in/i);
});

test('another-tab account switch cannot save the previous owner inventory even with equal revisions', async () => {
  const h = await boot();
  const a = {value:{private:'A order'},revision:1}, b = {value:{private:'B order'},revision:1};
  h.rows.set('owner-a:'+KEY,clone(a)); h.rows.set('owner-b:'+KEY,clone(b));
  const loaded = await h.window.trackerPrivateStore.load(KEY);
  h.auth.switchUser({id:'owner-b'});
  const result = await h.window.trackerPrivateStore.save(KEY,loaded.value,loaded.revision,loaded.ownerId);
  assert.equal(result.ok,false); assert.equal(result.signedOut,true);
  assert.deepEqual(h.rows.get('owner-b:'+KEY),b);
  assert.equal(h.calls.filter(call=>call.operation!=='read').length,0);
  assert.equal(h.window.trackerAuth.userId(),'owner-b');
  assert.equal(h.auth.events.at(-1).detail.ownerId,'owner-b');
});

test('session changes during identity verification abort before any private write', async () => {
  const h = await boot();
  let release; const paused = new Promise(resolve=>{release=resolve;});
  h.auth.beforeCheck=()=>paused;
  const saving = h.window.trackerPrivateStore.save(KEY,{private:'A order'},null,'owner-a');
  h.auth.switchUser({id:'owner-b'}); release();
  const result = await saving;
  assert.equal(result.ok,false); assert.equal(result.signedOut,true);
  assert.equal(h.calls.length,0); assert.equal(h.rows.size,0);
});

test('a private read finishing after another-tab signout never returns its loaded value', async () => {
  const h = await boot();
  h.rows.set('owner-a:'+KEY,{value:{private:'A order'},revision:1});
  h.auth.afterQuery=async()=>{h.auth.switchUser(null);};
  const result=await h.window.trackerPrivateStore.load(KEY);
  assert.equal(result.ok,false); assert.equal(result.signedOut,true); assert.equal(result.value,undefined);
  assert.equal(h.window.trackerAuth.isOwner(),false);
  assert.equal(h.auth.events.at(-1).detail.isOwner,false);
});

test('server-detected account changes also invalidate state when a browser event was missed', async () => {
  const h=await boot();
  h.auth.user={id:'owner-b'};
  const result=await h.window.trackerPrivateStore.save(KEY,{private:'A order'},null,'owner-a');
  assert.equal(result.ok,false); assert.equal(result.signedOut,true); assert.equal(h.rows.size,0);
  assert.equal(h.auth.events.at(-1).detail.ownerId,'owner-b');
});

test('saving without the identity captured by the load is rejected', async () => {
  const h=await boot();
  const result=await h.window.trackerPrivateStore.save(KEY,{private:'A order'},null);
  assert.equal(result.ok,false); assert.match(result.error,/refresh/i); assert.equal(h.calls.length,0);
});

test('Tyler and Tempo private copy inventories isolate identical card and receipt IDs',async()=>{
  const h=await boot(),tempoKey='tempo-copy-inventory-v1';
  const tyler={copies:{same:{cardId:7,serial:'3/25'}},observations:{receipt:{title:'Tyler Black',currency:'USD'}}};
  const tempo={copies:{same:{cardId:7,serial:'8/25'}},observations:{receipt:{title:'Tempo player',currency:'CAD'}}};
  assert.equal((await h.window.trackerPrivateStore.save(KEY,tyler,null,'owner-a')).ok,true);
  assert.equal((await h.window.trackerPrivateStore.save(tempoKey,tempo,null,'owner-a')).ok,true);
  const loaded=await h.window.trackerPrivateStore.load(tempoKey);
  assert.deepEqual(loaded.value,tempo);assert.deepEqual(h.rows.get('owner-a:'+KEY).value,tyler);
  const update={...tempo,copies:{same:{cardId:7,serial:'9/25'}}};
  assert.equal((await h.window.trackerPrivateStore.save(tempoKey,update,loaded.revision,loaded.ownerId)).ok,true);
  assert.deepEqual(h.rows.get('owner-a:'+KEY).value,tyler);assert.equal(h.cache.size,0);
});
