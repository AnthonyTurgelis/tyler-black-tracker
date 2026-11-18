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
  const read=async()=>{if(db.offline) throw Error("offline");return {value:copy(db.value),updated_at:db.version};};
  const tab=id=>{
    const t=create({storage,owner:()=>"owner",read,id,issue:()=>{},write:async (value,version)=>{
      if(db.version!==version) return null;
      assert.equal(value._expectedCollectionVersion,version);
      delete value._expectedCollectionVersion;
      db.value=copy(value);db.version++;db.writes++;return read();
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
