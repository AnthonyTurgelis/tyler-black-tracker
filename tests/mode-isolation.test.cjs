const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
test('Tyler purchase, duplicate and TCDB ID sets cannot label same-numbered Tempo cards',()=>{
  const source=fs.readFileSync(require.resolve('../tracker.jsx'),'utf8');
  const start=source.indexOf('const TB_DUPES ='),end=source.indexOf('const STATUS_CONFIG',start);
  assert.ok(start>0 && end>start);
  const events={},window={MODE:'tb',addEventListener:(key,fn)=>{events[key]=fn}};
  vm.runInNewContext(source.slice(start,end)+`\nwindow.check=()=>({hidden:[...HIDDEN_DUPES],extra:[...EXTRA_DUPES],notSynced:[...NOT_SYNCED],notOn:[...NOT_ON_TCDB],missing:[...MISSING_FROM_TCDB],ebay:[...EBAY_IDS],multi:[...MULTI_EBAY],orders:Object.keys(EBAY_ORDERS),url:orderUrl({id:889})});`,{window,RAW_DATA:{dupes:[{id:1}],not_synced:[7]}});
  const before=JSON.parse(JSON.stringify(window.check()));assert.ok(before.orders.length>0);assert.ok(before.extra.length>0);
  window.MODE='wnba';events.modechange({detail:{mode:'wnba'}});
  const tempo=window.check();for(const [field,value] of Object.entries(tempo))assert.equal(field==='url'?value:value.length,field==='url'?null:0,field);
  window.MODE='tb';events.modechange({detail:{mode:'tb'}});
  assert.deepEqual(JSON.parse(JSON.stringify(window.check())),before,'Returning to Tyler preserves every original ID map');
});
