const test = require("node:test");
const assert = require("node:assert/strict");
const {create} = require("../collection-sync");
const copy = structuredClone;
const initial = {statuses:{889:"in_transit"},details:{},forsale:{},dirty:[],synced:[],changelog:[],checkpoint:null};
function harness() {
  const rows = new Map();
  const storage = {get length(){return rows.size;},key:i=>[...rows.keys()][i],getItem:k=>rows.get(k) || null,
    setItem:(k,v)=>rows.set(k,v),removeItem:k=>rows.delete(k)};
  const db={value:copy(initial),version:1,writes:0,offline:false};
  const seen=new Set();
  const read=async(keys=[])=>{
    if(db.offline) throw Error("offline");
    return {value:copy(db.value),updated_at:db.version,applied_keys:keys.filter(k=>seen.has(k))};
  };
  const tab=id=>{
    const t=create({storage,owner:()=>"owner",read,id,issue:()=>{},write:async (value,version)=>{
      if(db.version!==version) return null;
      assert.equal(value._expectedCollectionVersion,version);
      if(value._collectionEditKeys.some(k=>seen.has(k)))return null;
      value._collectionEditKeys.forEach(k=>seen.add(k));
      delete value._collectionEditKeys;
      delete value._expectedCollectionVersion;
      db.value=copy(value);db.version++;db.writes++;
      if(db.loseReply){db.loseReply=false;throw Error("connection closed after commit");}
      return read();
    }});
    t.begin(db.value);
    return t;
  };
  return {tab,db,storage};
}
test("an idle stale tab cannot reverse a receipt and two independent edits survive",async()=>{
  const {tab,db}=harness(), a=tab("a"), b=tab("b");
  const arrival=copy(initial);arrival.statuses[889]="owned";a.stage(arrival);await a.flush();
  b.stage({...initial,_saveTimestamp:99999999999});await b.flush();
  assert.equal(db.writes,1);
  const other=copy(initial);other.statuses[2004]="in_transit";other.dirty=[2004];b.stage(other);await b.flush();
  assert.deepEqual(db.value.statuses,{889:"owned",2004:"in_transit"});
});
test("concurrent edits to separate details on the same card survive a failed version check",async()=>{
  const {tab,db}=harness(), a=tab("a"), b=tab("b");
  a.stage({...initial,details:{889:{qty:"2"}}});b.stage({...initial,details:{889:{serial:"12/35"}}});
  await Promise.all([a.flush(),b.flush()]);
  assert.deepEqual(db.value.details[889],{qty:"2",serial:"12/35"});
});
test("conflicting edits survive a reload and require a decision about the observed value",async()=>{
  const {tab,db,storage}=harness(), a=tab("a"), b=tab("b");
  a.stage({...initial,statuses:{889:"owned"}});await a.flush();
  b.stage({...initial,statuses:{889:"not_owned"}});
  const c=tab("c");
  let conflict;
  await assert.rejects(c.resume(),err=>{conflict=err;return err.conflicts[0].actual==="owned";});
  assert.equal(db.value.statuses[889],"owned");
  c.resolve(conflict.journal,conflict.conflicts[0],true);await c.flush();
  assert.equal(db.value.statuses[889],"not_owned");assert.equal(storage.length,0);
});
test("offline edits are journaled before the debounce and recover on reload",async()=>{
  const {tab,db,storage}=harness(), a=tab("a");
  db.offline=true;
  a.stage({...initial,statuses:{889:"owned"}});
  assert.equal(storage.length,1);
  await assert.rejects(a.flush(),/offline/);
  db.offline=false;
  await tab("b").resume();
  assert.equal(db.value.statuses[889],"owned");assert.equal(storage.length,0);
});
test("a prior action can be undone without removing a different tab's changelog entry",async()=>{
  const {tab,db}=harness(), a=tab("a"), b=tab("b");
  const entry=(cardId,ts)=>({ts,sid:"s",cardId,field:"status"});
  const one=entry(889,"2026-11-17T22:09Z"),two=entry(2004,"2026-11-17T22:29Z");
  a.stage({...initial,changelog:[one]});await a.flush();
  b.stage({...initial,changelog:[two]});await b.flush();
  a.stage(initial);await a.flush();
  assert.deepEqual(db.value.changelog,[two]);
});
test("a local-only legacy edit is reviewed once, and a whole stale cache is never replayed",async()=>{
  const {tab,db}=harness(),a=tab("a");
  const original={ts:"2026-11-01T01:10Z",sid:"old",field:"status",type:"status",cardId:22,to:"owned"};
  db.value.changelog=[original];
  const lost={ts:"2026-11-17T22:09Z",sid:"recent",field:"status",type:"status",cardId:889,to:"owned"};
  const legacy={...db.value,statuses:{889:"owned",777:"owned"},changelog:[lost,original]};
  a.recoverLegacy(legacy,db.value);
  let conflict;
  await assert.rejects(a.resume(),err=>{conflict=err;return err.conflicts[0].desired==="owned";});
  assert.equal(db.value.statuses[889],"in_transit");
  a.resolve(conflict.journal,conflict.conflicts[0],false);await a.flush();
  a.recoverLegacy(legacy,db.value);await a.resume();
  assert.equal(db.value.statuses[777],undefined);assert.equal(db.value.statuses[889],"in_transit");
});
test("a lost acknowledgement never replays a receipt over a later intentional reversal",async()=>{
  const {tab,db,storage}=harness(), original=tab("first");
  original.stage({...initial,statuses:{889:"owned"}});
  db.loseReply=true;await assert.rejects(original.flush(),/after commit/);
  const other=tab("second");other.stage(initial);await other.flush();
  assert.equal(db.value.statuses[889],"in_transit");
  await tab("reopened").resume();
  assert.equal(db.value.statuses[889],"in_transit");assert.equal(db.writes,2);assert.equal(storage.length,0);
});
test("a retry acknowledges the saved portion and still applies later offline edits",async()=>{
  const {tab,db}=harness(), a=tab("a");
  const first={...initial,statuses:{889:"owned"}};
  a.stage(first);db.loseReply=true;await assert.rejects(a.flush(),/after commit/);
  a.stage({...first,statuses:{889:"owned",2004:"in_transit"}});
  await a.flush();assert.deepEqual(db.value.statuses,{889:"owned",2004:"in_transit"});assert.equal(db.writes,2);
});

test("catalogue changes merge by field without overwriting another tab's ownership",async()=>{
  const {tab,db}=harness(),a=tab("a"),b=tab("b");
  a.stage({...initial,statuses:{889:"owned"},details:{889:{qty:"2"}},cards:{c1:{name:"Driver",variant:"Gold"}}});await a.flush();
  b.stage({...initial,cards:{c2:{name:"Second driver",variant:"Base"}},imports:{batch:{source:"TCDB",count:1}}});await b.flush();
  assert.equal(db.value.statuses[889],"owned");assert.equal(db.value.details[889].qty,"2");
  assert.deepEqual(Object.keys(db.value.cards),["c1","c2"]);assert.equal(db.value.imports.batch.count,1);
});
test("stale catalogue corrections conflict instead of replacing newer verified identity",async()=>{
  const {tab,db}=harness();db.value.cards={c1:{name:"Driver",variant:"Base",tcdbId:"123"}};
  const a=tab("a"),b=tab("b"),base=copy(db.value);
  a.stage({...base,cards:{c1:{...base.cards.c1,variant:"Gold /10"}}});await a.flush();
  b.stage({...base,cards:{c1:{...base.cards.c1,variant:"Gold /25"}}});
  await assert.rejects(b.flush(),err=>err.conflicts[0].path.join("/")==="cards/c1/variant");
  assert.equal(db.value.cards.c1.variant,"Gold /10");assert.equal(db.value.cards.c1.tcdbId,"123");
});
test("sport namespaces isolate overlapping IDs and receipt keys on a shared device",async()=>{
  const {storage}=harness(), saved=new Map(), receipts=new Set();
  function side(namespace) {
    const row={value:copy(initial),version:1};saved.set(namespace,row);
    const read=async(keys=[])=>({value:copy(row.value),updated_at:row.version,applied_keys:keys.filter(k=>receipts.has(k))});
    const instance=create({storage,namespace,owner:()=>"owner",id:"same-writer",read,issue:()=>{},write:async(value,version)=>{
      assert.equal(version,row.version);value._collectionEditKeys.forEach(k=>{assert.equal(receipts.has(k),false);receipts.add(k);});
      row.value=copy(value);row.version++;return read();
    }});instance.begin(initial);return instance;
  }
  const racing=side("collect-racing"),baseball=side("collect-baseball");
  racing.stage({...initial,statuses:{889:"owned"}});baseball.stage({...initial,details:{889:{qty:"3"}}});
  assert.equal(storage.length,2);await Promise.all([racing.flush(),baseball.flush()]);
  assert.equal(saved.get("collect-racing").value.statuses[889],"owned");
  assert.equal(saved.get("collect-baseball").value.statuses[889],"in_transit");
  assert.equal(saved.get("collect-racing").value.details[889],undefined);assert.equal(receipts.size,2);
});
test("quantity zero and deliberate reductions survive independent stale status changes",async()=>{
  const {tab,db}=harness();db.value.details={889:{qty:"2",serial:"7/35"}};
  const a=tab("a"),b=tab("b"),base=copy(db.value);
  a.stage({...base,details:{889:{qty:"0",serial:"7/35"}}});await a.flush();
  b.stage({...base,statuses:{889:"owned"}});await b.flush();
  assert.equal(db.value.details[889].qty,"0");assert.equal(db.value.details[889].serial,"7/35");assert.equal(db.value.statuses[889],"owned");
});
test("an account switch cannot replay another owner's pending journal",async()=>{
  const {storage}=harness();let owner="first",writes=0;
  const sync=create({storage,owner:()=>owner,id:"tab",issue:()=>{},read:async()=>({value:copy(initial),updated_at:1,applied_keys:[]}),write:async(value)=>{writes++;return {value};}});
  sync.begin(initial);sync.stage({...initial,statuses:{889:"owned"}});
  owner="second";sync.begin(initial);await sync.resume();
  assert.equal(writes,0);assert.equal(storage.length,1);
  owner="first";sync.begin(initial);await sync.resume();assert.equal(writes,1);assert.equal(storage.length,0);
});
