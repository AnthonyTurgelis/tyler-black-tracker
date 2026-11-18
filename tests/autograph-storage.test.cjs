const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function boot(){const calls=[],rows=new Map();let owner='owner-a';const window={CopyInventory:require('../copy-utils'),trackerPrivateStore:{async load(key){calls.push({action:'load',key});return{ok:true,ownerId:owner,revision:rows.get(key)?.revision??null,value:rows.get(key)?.value??null}},async save(key,value,revision,ownerId){calls.push({action:'save',key});if(owner!==ownerId)return {ok:false,signedOut:true};const row=rows.get(key);if((row?.revision??null)!==revision)return{ok:false,conflict:true};rows.set(key,{value:structuredClone(value),revision:(revision||0)+1});return{ok:true,value,revision:(revision||0)+1,ownerId}}}};vm.runInNewContext(fs.readFileSync(require.resolve('../autograph-utils'),'utf8'),{window,URL,Date,Math,console});return{window,calls,rows,switchOwner:()=>owner='owner-b'};}
test('private autograph records isolate same card/copy IDs across scopes and reject stale saves',async()=>{
 const h=boot(),tempo=h.window.trackerAutographs.forScope('wnba'),racing=h.window.trackerAutographs.forScope('racing');
 const a=await tempo.load(),b=await racing.load();assert.equal(a.value.version,1);assert.equal(Object.keys(a.value.records).length,0);
 const first=await tempo.save({...a.value,updatedAt:'first'},a.revision,a.ownerId);assert.equal(first.ok,true);assert.equal(h.rows.has(racing.key),false);
 const stale=await tempo.save(a.value,a.revision,a.ownerId);assert.equal(stale.conflict,true);assert.equal(h.rows.get(tempo.key).value.updatedAt,'first');
 assert.equal((await racing.save(b.value,b.revision,b.ownerId)).ok,true);assert.equal(h.rows.size,2);
 h.switchOwner();assert.equal((await tempo.save(first.value,first.revision,first.ownerId)).signedOut,true);
});
