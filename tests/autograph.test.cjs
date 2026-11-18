const test=require('node:test'),assert=require('node:assert/strict'),A=require('../autograph-utils');
const now='2026-11-18T20:00:00Z',context={statuses:{7:'owned','tcdb:12':'in_transit'},details:{7:{qty:2},'tcdb:12':{qty:1,serial:'7/25',sourceItemIds:['item12']}}};
function signed(extra={}){return {id:'ip:test',cardId:7,copyId:'legacy:7:1',status:'signed',signer:'Signer',signedDate:'2026-11-18',...extra};}
test('signature targets and signed copies never alter ownership, quantity, or factory autograph metadata',()=>{
 const input={...context,cards:{7:{isAuto:false}}},before=JSON.stringify(input);let s=A.saveRecord(A.empty(),{cardId:8,status:'target',signer:'Player'},input,now);
 s=A.saveRecord(s,signed(),input,now);assert.equal(JSON.stringify(input),before);assert.equal(Object.keys(s.records).length,2);assert.equal(s.records['ip:test'].kind,'in_person_autograph');assert.equal(s.records['ip:test'].copySnapshot.id,'legacy:7:1');assert.equal(s.history.length,2);
});
test('a signed record requires a current explicit copy; wanted-only cards and qty zero provide none',()=>{
 assert.throws(()=>A.saveRecord(A.empty(),signed({copyId:null}),context,now),/existing physical copy/);
 assert.throws(()=>A.saveRecord(A.empty(),signed({cardId:8,copyId:'legacy:8:1'}),context,now),/no longer/);
 assert.equal(A.slots(7,{statuses:{7:'owned'},details:{7:{qty:0}}}).length,0);
});
test('string TCDB identities retain exact separate units and source evidence without numeric collisions',()=>{
 const slots=A.slots('tcdb:12',context);assert.equal(slots[0].id,'legacy:tcdb:12:1');assert.deepEqual(slots[0].sourceRefs,['tcdb-item:item12']);
 const s=A.saveRecord(A.empty(),signed({cardId:'tcdb:12',copyId:slots[0].id}),context,now);assert.equal(s.records['ip:test'].cardId,'tcdb:12');assert.equal(s.records['ip:test'].copySnapshot.serial,'7/25');
});
test('sold or unconfirmed purchase copies are unavailable while actual existing units remain selectable',()=>{
 const ctx={...context,copyInventory:{copies:{'legacy:7:1':{id:'legacy:7:1',cardId:7,origin:'legacy',saleStatus:'sold'},unconfirmed:{id:'unconfirmed',cardId:7,origin:'purchase',source:'ebay',currentInventory:false}},baselines:{7:{quantity:2,status:'owned',details:{}}}}};
 assert.deepEqual(A.slots(7,ctx).map(x=>x.id),['legacy:7:2']);
});
test('later reductions or serial changes retain the historical signed record and flag copy review',()=>{
 const s=A.saveRecord(A.empty(),signed({cardId:'tcdb:12',copyId:'legacy:tcdb:12:1'}),context,now);
 const reduced={statuses:{},details:{'tcdb:12':{qty:0}}};assert.equal(A.review(s,reduced)[0].needsCopyReview,true);assert.equal(Object.keys(s.records).length,1);
 const edited=A.saveRecord(s,{...s.records['ip:test'],verificationNotes:'Copy later sold'},reduced,now);assert.equal(edited.records['ip:test'].copySnapshot.serial,'7/25');
 assert.equal(A.review(s,{statuses:{'tcdb:12':'owned'},details:{'tcdb:12':{qty:1,serial:'8/25'}}})[0].needsCopyReview,true);
});
test('proof URLs and dates are validated, duplicate retry cannot add another signature, archive preserves audit evidence',()=>{
 assert.throws(()=>A.saveRecord(A.empty(),signed({proofPhotos:[{url:'javascript:bad'}]}),context,now),/HTTPS/);
 assert.throws(()=>A.saveRecord(A.empty(),signed({signedDate:'2026-02-30'}),context,now),/valid signing date/);
 const s=A.saveRecord(A.empty(),signed(),context,now);assert.throws(()=>A.saveRecord(s,signed({id:''}),context,now),/already exists/);
 const archived=A.archiveRecord(s,'ip:test',now);assert.equal(archived.records['ip:test'].archived,true);assert.equal(archived.history.length,2);assert.equal(A.recordsForCard(archived,7).length,0);
});
test('private autograph scope keys cannot overlap between sports or escape the known scope list',()=>{
 assert.equal(A.keyForScope('wnba'),'tempo-autographs-v1');assert.equal(A.keyForScope('racing'),'collect-racing-autographs-v1');assert.notEqual(A.keyForScope('tb'),A.keyForScope('wnba'));assert.throws(()=>A.keyForScope('unknown'),/Unknown/);
});

test('unselected card safely has no slots; reduced unallocated quantity requires reviewing remaining anchors',()=>{
 assert.deepEqual(A.slots('',context),[]);const s=A.saveRecord(A.empty(),signed(),context,now);
 assert.equal(A.review(s,{statuses:{7:'owned'},details:{7:{qty:1}}})[0].needsCopyReview,true);
});

test('a residual quantity on a wanted or manually unowned card is not an acquired copy',()=>{
 assert.deepEqual(A.slots('tcdb:12',{statuses:{'tcdb:12':'not_owned'},details:{'tcdb:12':{qty:2,wantedQty:2}}}),[]);
 assert.deepEqual(A.slots(7,{statuses:{7:'not_owned'},details:{7:{qty:2}},copyInventory:{}}),[]);
});
test('managed string-ID physical copies are used without renumbering historical autograph anchors',()=>{
 const CI=require('../copy-utils'),id='tcdb:12',ctx={statuses:{[id]:'owned'},details:{[id]:{qty:2,ownedQty:2,sourceItemIds:['item12']}}};
 ctx.cardDetails=ctx.details;
 const stock=CI.normalizeState(null),managed=CI.editCopy(stock,id,'legacy:tcdb:12:1',{location:'in_hand',serial:'7/25'},ctx);
 const ownedContext={...ctx,copyInventory:managed};assert.deepEqual(A.slots(id,ownedContext).map(x=>x.id),['legacy:tcdb:12:1','legacy:tcdb:12:2']);
 const saved=A.saveRecord(A.empty(),signed({cardId:id,copyId:'legacy:tcdb:12:1'}),ownedContext,now);
 const sold=CI.editCopy(managed,id,'legacy:tcdb:12:1',{saleStatus:'sold'},ctx);
 assert.deepEqual(A.slots(id,{...ctx,copyInventory:sold}).map(x=>x.id),['legacy:tcdb:12:2']);assert.equal(A.review(saved,{...ctx,copyInventory:sold})[0].needsCopyReview,true);assert.equal(saved.records['ip:test'].copyId,'legacy:tcdb:12:1');
});
