const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require.resolve('../shared-market-scanner.jsx'),'utf8');
const hook=source.slice(source.indexOf('  function useMarketStore('),source.indexOf('  function CardPicker('));
const clone=v=>JSON.parse(JSON.stringify(v)),tick=()=>new Promise(r=>setImmediate(r));
function deferred(){let resolve;const promise=new Promise(r=>{resolve=r;});return {promise,resolve};}
function fixture(){
  let cursor=0,who='owner-one',scope='racing';const slots=[],effects=[],listeners={},data={},calls=[],pendingLoads=[];
  const equal=(a,b)=>a&&b&&a.length===b.length&&a.every((x,i)=>x===b[i]);
  const React={
    useState(initial){const i=cursor++;if(!slots[i])slots[i]={value:typeof initial==='function'?initial():initial};return [slots[i].value,v=>{slots[i].value=typeof v==='function'?v(slots[i].value):v;}];},
    useRef(initial){const i=cursor++;if(!slots[i])slots[i]={current:initial};return slots[i];},
    useCallback(fn,deps){const i=cursor++;if(!slots[i]||!equal(slots[i].deps,deps))slots[i]={value:fn,deps};return slots[i].value;},
    useEffect(fn,deps){const i=cursor++;if(!slots[i]||!equal(slots[i].deps,deps)){const old=slots[i];slots[i]={deps};effects.push(()=>{old?.cleanup?.();slots[i].cleanup=fn();});}}
  };
  const key=s=>'collect-'+s+'-price-history-v1';
  const envelope=s=>({ok:true,ownerId:who,key:key(s),revision:data[s]?.revision||1,value:clone(data[s]?.value||{history:{},targets:{}})});
  const stores={forMode(s){return {prices:{
    key:key(s),
    async load(){if(pendingLoads.length)return pendingLoads.shift().promise;return envelope(s);},
    async save(value,snapshot){
      calls.push({scope:s,value:clone(value),snapshot:clone(snapshot)});
      if(snapshot.key!==key(s)||snapshot.ownerId!==who||snapshot.revision!==envelope(s).revision)return {ok:false,error:'Stale revision',conflict:true};
      data[s]={revision:snapshot.revision+1,value:clone(value)};return envelope(s);
    }
  }};}};
  const window={trackerAuth:{isOwner:()=>!!who,userId:()=>who},trackerSportStores:stores,addEventListener(name,fn){(listeners[name]||(listeners[name]=new Set())).add(fn);},removeEventListener(name,fn){listeners[name]?.delete(fn);},dispatchEvent(event){for(const fn of listeners[event.type]||[])fn(event);}};
  const context={React,window,ownerId:()=>who,storeFor:s=>stores.forMode(s).prices,pending:new Set(),empty:()=>({history:{},targets:{}}),CustomEvent:function(type,init){this.type=type;this.detail=init.detail;}};
  vm.createContext(context);vm.runInContext(hook,context);
  function render(next=scope,active=true){scope=next;cursor=0;const value=context.useMarketStore(scope,active,false);for(const effect of effects.splice(0))effect();return value;}
  return {render,data,calls,envelope,pendingLoads,auth(next){who=next;window.dispatchEvent({type:'authchange'});},window};
}
test('market hook rejects a stale rendered full value after a reload instead of attaching a fresh revision',async()=>{
  const f=fixture();f.render();await tick();const old=f.render();
  f.data.racing={revision:2,value:{history:{remote:[{price:30}]},targets:{remote:{notes:'new'}}}};
  await old.reload();const fresh=f.render();assert.equal(fresh.snapshot.revision,2);
  await assert.rejects(old.save({history:{old:[{price:10}]},targets:{}}),/changed/);
  assert.equal(f.calls.length,0);assert.equal(f.data.racing.value.history.remote[0].price,30);
});
test('market hook blocks old save callbacks after a successful save and passes exact scoped snapshot',async()=>{
  const f=fixture();f.render();await tick();const old=f.render();await old.save({history:{a:[{price:10}]},targets:{}});
  await assert.rejects(old.save({history:{b:[{price:99}]},targets:{}}),/changed/);
  assert.equal(f.calls.length,1);assert.equal(f.calls[0].snapshot.key,'collect-racing-price-history-v1');assert.equal(f.calls[0].snapshot.revision,1);
});
test('market reload blocks saves while loading and failure invalidates editable snapshot',async()=>{
  const f=fixture();f.render();await tick();const old=f.render(),d=deferred();f.pendingLoads.push(d);const loading=old.reload();
  await assert.rejects(old.save({history:{},targets:{}}),/changed|Wait/);
  d.resolve({ok:false,error:'Offline'});await loading;const state=f.render();assert.equal(state.ready,false);assert.equal(state.error,'Offline');assert.equal(f.calls.length,0);
});
test('late account results never hydrate another owner and do not release a newer load lock',async()=>{
  const f=fixture(),first=deferred(),second=deferred();f.pendingLoads.push(first);f.render();f.pendingLoads.push(second);f.auth('owner-two');
  first.resolve({ok:true,ownerId:'owner-one',key:'collect-racing-price-history-v1',revision:1,value:{history:{privateOne:[]},targets:{}}});await tick();assert.equal(f.render().ready,false);assert.equal(f.render().busy,true);
  second.resolve({ok:true,ownerId:'owner-two',key:'collect-racing-price-history-v1',revision:3,value:{history:{privateTwo:[]},targets:{}}});await tick();const state=f.render();assert.equal(state.snapshot.ownerId,'owner-two');assert.deepEqual(Object.keys(state.value.history),['privateTwo']);
});
test('same card IDs in racing and other scopes never share a saved history or callback',async()=>{
  const f=fixture();f.data.racing={revision:1,value:{history:{'tcdb:1':[{price:10}]},targets:{}}};f.data.other={revision:1,value:{history:{'tcdb:1':[{price:20}]},targets:{}}};
  f.render();await tick();const racing=f.render();f.render('other');await tick();const other=f.render('other');assert.equal(other.value.history['tcdb:1'][0].price,20);
  await assert.rejects(racing.save({history:{'tcdb:1':[{price:1}]},targets:{}}),/changed/);assert.equal(f.calls.length,0);
  await other.save({history:{'tcdb:1':[{price:25}]},targets:{}});assert.equal(f.data.racing.value.history['tcdb:1'][0].price,10);assert.equal(f.data.other.value.history['tcdb:1'][0].price,25);
});
