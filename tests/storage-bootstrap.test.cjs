const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require.resolve('../storage-shim'),'utf8');
function boot({session=Promise.resolve({data:{session:null}}),query=Promise.resolve({data:[]})}={}) {
 const timers=new Set(),calls=[],cache=new Map();
 const client={auth:{getSession(){calls.push('session');return session;}},from(table){calls.push(table);return {select(){return query}}}};
 const window={CollectionSync:require('../collection-sync'),SUPABASE_URL:'https://invalid.test',SUPABASE_ANON_KEY:'key',supabase:{createClient:()=>client},dispatchEvent(){}};
 const localStorage={get length(){return cache.size},key:i=>[...cache.keys()][i],getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,String(v)),removeItem:k=>cache.delete(k)};
 vm.runInNewContext(source,{window,localStorage,console:{log(){},warn(){},error(){}},CustomEvent:function(){},setTimeout(fn,ms){const t={fn,ms};timers.add(t);return t},clearTimeout:t=>timers.delete(t)});
 return {window,calls,cache,timers,expire(){for(const t of [...timers]){timers.delete(t);t.fn()}}};
}
test('a hung auth request times out visibly and never loads editable cached state',async()=>{
 let late;const h=boot({session:new Promise(r=>late=r)});h.expire();
 await assert.rejects(h.window.storageReady,/Checking sign-in timed out/);
 assert.deepEqual(h.calls,['session']);assert.equal(h.cache.size,0);assert.match(h.window.storageBootState.error,/timed out/);
 late({data:{session:null}});await new Promise(setImmediate);assert.deepEqual(h.calls,['session']);
});
test('a hung public query times out and late rows never hydrate the cache',async()=>{
 let late;const h=boot({query:new Promise(r=>late=r)});await new Promise(setImmediate);h.expire();
 await assert.rejects(h.window.storageReady,/Loading Tyler collection timed out/);
 late({data:[{key:'tb-alldata-v1',value:{statuses:{7:'owned'}}}]});await new Promise(setImmediate);assert.equal(h.cache.size,0);
});
test('cloud errors reject readiness and successful startup cancels its watchdogs',async()=>{
 const failed=boot({query:Promise.resolve({error:{message:'Unavailable'}})});
 await assert.rejects(failed.window.storageReady,/Tyler collection could not load/);assert.equal(failed.cache.size,0);
 const ready=boot();await ready.window.storageReady;assert.equal(ready.window.storageBootState.phase,'Ready');assert.equal(ready.timers.size,0);
});
