/* Private in-person signatures are events on existing copies, never card variants. */
(function(root){
  'use strict';
  var copies=typeof module!=='undefined'&&module.exports?require('./copy-utils.js'):root.CopyInventory;
  var scopes=['tb','tempo','wnba','racing','baseball','basketball','football','hockey','soccer','other'];
  function clone(v){return JSON.parse(JSON.stringify(v));}
  function text(v){return v==null?'':String(v).trim();}
  function object(v){return v&&typeof v==='object'&&!Array.isArray(v);}
  function safeId(v){var s=text(v);if(!s||['__proto__','prototype','constructor'].includes(s))throw Error('Choose a valid card or record.');return s;}
  function empty(){return {version:1,records:{},history:[],updatedAt:''};}
  function normalize(value){
    if(value==null)return empty();
    if(!object(value)||value.version!==1||!object(value.records))throw Error('The private autograph record format is not supported. Nothing was overwritten.');
    var out=clone(value);out.history=Array.isArray(out.history)?out.history:[];out.updatedAt=out.updatedAt||'';
    Object.keys(out.records).forEach(function(id){safeId(id);if(!object(out.records[id])||out.records[id].id!==id)throw Error('An autograph record is malformed. Nothing was overwritten.');});
    return out;
  }
  function keyForScope(scope){if(!scopes.includes(scope))throw Error('Unknown autograph collection.');return (scope==='tb'?'tb':scope==='wnba'||scope==='tempo'?'tempo':'collect-'+scope)+'-autographs-v1';}
  function quantity(value){var n=Number(value);return Number.isSafeInteger(n)&&n>=0?n:null;}
  function slots(cardId,context){
    if(cardId==null||text(cardId)==='')return [];
    cardId=safeId(cardId);context=context||{};var details=context.details||context.cardDetails||{},statuses=context.statuses||{},d=details[cardId]||{},rows=[];
    if(context.copyInventory&&copies.canonicalCardId(cardId)!==null){
      rows=copies.getCopiesForCard(context.copyInventory,copies.canonicalCardId(cardId),statuses,details).filter(function(copy){return copies.isCountedCopy(copy)&&(!copy.unallocated||['owned','in_transit','for_sale'].includes(statuses[cardId]||copy.legacyStatus));});
    }else{
      var q=d.qty!=null&&d.qty!==''?quantity(d.qty):null;
      if(q==null&&(d.ownedQty!=null||d.transitQty!=null))q=(quantity(d.ownedQty)||0)+(quantity(d.transitQty)||0);
      if(q==null)q=['owned','in_transit','for_sale'].includes(statuses[cardId])?1:0;
      if(!['owned','in_transit','for_sale'].includes(statuses[cardId])&&!((quantity(d.ownedQty)||0)+(quantity(d.transitQty)||0)))q=0;
      if(d.manualStatus&&statuses[cardId]==='not_owned')q=0;
      if(q>10000)throw Error('Copy quantity needs review before planning signatures.');
      for(var i=1;i<=q;i++)rows.push({id:'legacy:'+cardId+':'+i,cardId:cardId,serial:q===1?text(d.serial):'',location:'unknown',unallocated:true,sourceRefs:(d.sourceItemIds||[]).map(function(id){return 'tcdb-item:'+id;})});
    }
    return rows.map(function(c){return {id:String(c.id),cardId:cardId,label:'Copy '+(c.legacyUnit||rows.indexOf(c)+1)+(c.serial?' · #'+c.serial:'')+(c.location&&c.location!=='unknown'?' · '+c.location:'')+(c.unallocated?' · unallocated':''),serial:text(c.serial),location:c.location||'unknown',sourceRefs:clone(c.sourceRefs||[]),unallocated:!!c.unallocated};});
  }
  function recordsForCard(state,cardId){return Object.values(normalize(state).records).filter(function(r){return !r.archived&&String(r.cardId)===String(cardId);});}
  function copyReview(record,context){
    if(record.status!=='signed')return false;
    var available=slots(record.cardId,context),slot=available.find(function(s){return s.id===record.copyId;});
    if(!slot)return true;
    var snapshot=record.copySnapshot;
    return !!(snapshot&&(snapshot.serial&&text(snapshot.serial)!==text(slot.serial) || snapshot.unallocated&&snapshot.availableCopiesAtCapture>available.length || snapshot.sourceRefs&&snapshot.sourceRefs.length&&JSON.stringify(snapshot.sourceRefs.slice().sort())!==JSON.stringify(slot.sourceRefs.slice().sort())));
  }
  function review(state,context){return Object.values(normalize(state).records).map(function(r){return Object.assign({},r,{needsCopyReview:copyReview(r,context)});});}
  function stamp(now){var s=now||new Date().toISOString();if(!Number.isFinite(Date.parse(s)))throw Error('Invalid autograph update time.');return s;}
  function newId(){return 'ip:'+(root&&root.crypto&&root.crypto.randomUUID?root.crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));}
  function saveRecord(input,record,context,now){
    var state=normalize(input),at=stamp(now);record=record||{};
    var id=record.id?safeId(record.id):newId(),previous=state.records[id],cardId=safeId(record.cardId),status=text(record.status),signer=text(record.signer);
    if(!['target','signed'].includes(status))throw Error('Choose To Sign or Signed.');
    if(!signer)throw Error('Enter the signer’s name.');
    if(previous&&String(previous.cardId)!==cardId)throw Error('An existing signature cannot be moved to a different card. Archive it and create the correct record.');
    var copyId=text(record.copyId)||null,slot=copyId?slots(cardId,context).find(function(s){return s.id===copyId;}):null;
    var historical=previous&&previous.status==='signed'&&previous.copyId===copyId;
    if(copyId&&!slot&&!historical)throw Error('The selected copy is no longer in this collection. Refresh and choose its current copy.');
    if(status==='signed'&&(!copyId||(!slot&&!historical)))throw Error('Choose an existing physical copy before recording a signature.');
    var date=text(record.signedDate);
    if(date&&(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date+'T00:00:00Z'))||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date))throw Error('Use a valid signing date or leave it blank.');
    var photos=(record.proofPhotos||[]).map(function(p){if(!object(p)||!/^https:\/\//i.test(text(p.url)))throw Error('Proof photo links must use HTTPS.');var u=new URL(text(p.url));if(u.username||u.password)throw Error('Proof photo links cannot include account credentials.');return {url:u.href,caption:text(p.caption)};});
    var next={id:id,kind:'in_person_autograph',cardId:cardId,copyId:copyId,status:status,signer:signer,signedDate:date,event:text(record.event),location:text(record.location),proofPhotos:photos,certificate:text(record.certificate),verificationNotes:text(record.verificationNotes),createdAt:previous?previous.createdAt:at,updatedAt:at,archived:false};
    if(status==='signed')next.copySnapshot=historical&&previous.copySnapshot?clone(previous.copySnapshot):Object.assign({},slot,{capturedAt:at,availableCopiesAtCapture:slots(cardId,context).length,ownershipSource:'existing_collection_copy',verification:'User-selected copy; signing and possession are not inferred from catalogue or receipt data.'});
    else if(previous&&previous.copySnapshot)next.copySnapshot=clone(previous.copySnapshot);
    var duplicate=Object.values(state.records).find(function(r){return !r.archived&&r.id!==id&&String(r.cardId)===cardId&&r.copyId===copyId&&r.status===status&&text(r.signer).toLowerCase()===signer.toLowerCase()&&(status==='target'||r.signedDate===date&&text(r.event)===next.event);});
    if(duplicate)throw Error('This autograph record already exists. Edit the existing record instead.');
    state.records[id]=next;state.history.push({id:newId(),recordId:id,at:at,action:previous?'edited':'created',before:previous?clone(previous):null,after:clone(next)});state.updatedAt=at;return state;
  }
  function archiveRecord(input,id,now){var state=normalize(input);id=safeId(id);var old=state.records[id];if(!old)throw Error('This autograph record was not found.');if(old.archived)return state;var at=stamp(now),next=Object.assign({},old,{archived:true,updatedAt:at});state.records[id]=next;state.history.push({id:newId(),recordId:id,at:at,action:'archived',before:clone(old),after:clone(next)});state.updatedAt=at;return state;}
  var api={empty:empty,normalize:normalize,keyForScope:keyForScope,slots:slots,recordsForCard:recordsForCard,saveRecord:saveRecord,archiveRecord:archiveRecord,review:review};
  if(root){root.AutographUtils=api;root.trackerAutographs={forScope:function(scope){var key=keyForScope(scope);return {key:key,load:async function(){var r=await root.trackerPrivateStore.load(key);if(!r.ok)return r;try{return Object.assign({},r,{value:normalize(r.value)});}catch(e){return {ok:false,error:e.message};}},save:async function(value,revision,ownerId){try{return await root.trackerPrivateStore.save(key,normalize(value),revision,ownerId);}catch(e){return {ok:false,error:e.message};}}};}};}
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:null);
