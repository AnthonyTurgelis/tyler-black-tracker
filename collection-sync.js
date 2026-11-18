/* Collection edits are compared against the values the editor actually saw. */
(function(root) {
  "use strict";
  const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
  const clone = value => value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  const equal = (a, b) => {
    if (a === b) return true;
    if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every(k => own(b,k) && equal(a[k],b[k]));
  };
  const logKey = e => JSON.stringify([e.ts,e.sid,e.cardId,e.field]);
  const mapOf = (values, key) => Object.fromEntries((values || []).map(item => [key(item), item]));
  function changes(base, next) {
    const ops = [];
    function compare(path, a, b) {
      if (!equal(a,b)) ops.push({path, before:a, after:b});
    }
    function fields(path, a, b, depth) {
      a = a || {}; b = b || {};
      for (const k of new Set([...Object.keys(a),...Object.keys(b)])) {
        if (["__proto__", "constructor", "prototype"].includes(k)) continue;
        if (depth > 1) fields([...path,k],a[k],b[k],depth-1);
        else compare([...path,k],a[k],b[k]);
      }
    }
    fields(["statuses"],base.statuses,next.statuses,1);
    fields(["details"],base.details,next.details,2);
    fields(["forsale"],base.forsale,next.forsale,1);
    for (const key of ["dirty","synced"]) fields([key],mapOf(base[key],String),mapOf(next[key],String),1);
    const prevLog=mapOf(base.changelog,logKey), nextLog=mapOf(next.changelog,logKey);
    fields(["changelog"],prevLog,nextLog,1);
    compare(["checkpoint"],base.checkpoint || null,next.checkpoint || null);
    return ops;
  }
  function apply(current, ops, choices) {
    const result=clone(current), conflicts=[];
    const maps={};
    for (const key of ["dirty","synced"]) maps[key]=mapOf(current[key],String);
    maps.changelog=mapOf(current.changelog,logKey);
    for (const op of ops) {
      const path=op.path;
      if (!Array.isArray(path) || path.some(k=>["__proto__","prototype","constructor"].includes(k))) throw Error("Invalid collection edit");
      let target=maps[path[0]] || result;
      for (let i=maps[path[0]] ? 1 : 0;i<path.length-1;i++) {
        if (!target[path[i]]) target[path[i]]={};
        target=target[path[i]];
      }
      const key=path[path.length-1], actual=target[key];
      if (equal(actual,op.after)) continue;
      // Missing flags, empty checkpoints and the default Needed state are equivalent in the UI.
      const equivalent = path[0]==="statuses" && (actual || "not_owned")===(op.before || "not_owned")
        || path[0]==="checkpoint" && !actual && !op.before;
      if (op.review || (!equal(actual,op.before) && !equivalent)) {
        const choice=choices && choices[JSON.stringify(path)];
        if (!choice || !equal(choice.seen,actual)) { conflicts.push({path, actual, desired:op.after}); continue; }
        if (!choice.local) continue;
      }
      if (op.after===undefined) delete target[key]; else target[key]=clone(op.after);
    }
    for (const key of ["dirty","synced"]) {
      if (!ops.some(op=>op.path[0]===key)) continue;
      const kept=(current[key] || []).filter(item=>own(maps[key],String(item)));
      result[key]=[...new Set([...kept,...Object.values(maps[key])])];
    }
    if (ops.some(op=>op.path[0]==="changelog"))
      result.changelog=Object.values(maps.changelog).sort((a,b)=>b.ts.localeCompare(a.ts)).slice(0,500);
    return {result,conflicts};
  }
  function create({storage,owner,read,write,issue,id}) {
    let view, tail=Promise.resolve(), seq=0;
    const queue=[], pending=new Map();
    const prefix=()=> "tb-edit-journal-v1:"+owner()+":";
    const has=(key)=>pending.has(key) || storage.getItem(key)!==null;
    function readDraft(key) {return pending.get(key) || JSON.parse(storage.getItem(key));}
    function remember(key, entry) {
      try { storage.setItem(key,JSON.stringify(entry));pending.delete(key); } catch { pending.set(key,entry);issue("Device storage is full. Keep this tab open until the cloud save finishes."); }
    }
    function drop(key) {storage.removeItem(key);pending.delete(key);}
    function begin(value) {view=clone(value);}
    function stage(value) {
      if (!view || !owner()) return;
      const ops=changes(view,value);
      if (!ops.length) return;
      const key=prefix()+id+":"+(++seq);
      remember(key,{created:Date.now(),writer:id,seq,version:2,ops});
      const reviewIndex=queue.findIndex(k=>readDraft(k)?.review);
      if(reviewIndex<0) queue.push(key); else queue.splice(reviewIndex,0,key);
      view=clone(value);
    }
    function combine(entries) {
      const merged=new Map();
      for(const entry of entries) for(const op of entry.ops) {
        const key=JSON.stringify(op.path), old=merged.get(key);
        const next=old ? {...op,before:old.before} : {...op};
        if(equal(next.before,next.after)) merged.delete(key); else merged.set(key,next);
      }
      return [...merged.values()];
    }
    async function drain() {
      let last;
      while (queue.length) {
        const key=queue[0];
        if(!owner() || !key.startsWith(prefix())) throw Error("Sign in again to sync your collection edits.");
        if(!has(key)) {queue.shift();continue;}
        const entry=readDraft(key), keys=[key], entries=[entry];
        // A renderer may update status, flags and log in separate callbacks.
        // Persist that group together. Journal records remain immutable during a request.
        for (const k of queue.slice(1)) {
          const next=readDraft(k);
          if(!next || keys.length===128 || next.writer!==entry.writer || next.review || entry.review) break;
          keys.push(k);entries.push(next);
        }
        const editKeys=keys.map(k=>k.slice(prefix().length));
        let done=false;
        for(let attempt=0;attempt<4;attempt++) {
          const row=await read(editKeys);
          const acknowledged=new Set(row.applied_keys);
          const remaining=editKeys.filter(k=>!acknowledged.has(k));
          if(!remaining.length) { last=row.value;done=true;break; }

          // Another tab may already have finished part of this batch. Older
          // pending operations on a field superseded by a saved one stay ignored.
          const outstanding=[], superseded=new Set();
          for(let i=entries.length-1;i>=0;i--) {
            const item=entries[i];
            if(acknowledged.has(editKeys[i])) {
              for(const op of item.ops) superseded.add(JSON.stringify(op.path));
              continue;
            }
            const ops=item.ops.filter(op=>!superseded.has(JSON.stringify(op.path))).map(op=>{
              // Pre-receipt journals cannot prove an earlier request failed.
              return !item.version && ["statuses","details","forsale"].includes(op.path[0])
                ? {...op,review:true} : op;
            });
            outstanding.unshift({ops});
          }
          const {result,conflicts}=apply(row.value,combine(outstanding),entry.choices);
          if(conflicts.length) {
            const err=Error("A saved value changed on another device. Review the pending edit.");
            err.conflicts=conflicts; err.journal=key; throw err;
          }
          if(!owner() || !key.startsWith(prefix())) throw Error("Sign in again to sync your collection edits.");
          // Record the acknowledgement even if the visible value already matches.
          const saved=await write({...result,_saveTimestamp:Date.now(),_expectedCollectionVersion:row.updated_at,
            _collectionEditKeys:remaining},row.updated_at);
          if(saved) {last=saved.value;done=true;break;}
        }
        if(!done) throw Error("The collection is busy. Your edits are pending.");
        if(entry.review) storage.setItem(key+":resolved","1");
        for(const k of keys){drop(k);const index=queue.indexOf(k);if(index>=0)queue.splice(index,1);}
      }
      return last;
    }
    function flush() {
      const task=tail.then(drain);
      tail=task.catch(()=>{});
      return task;
    }
    function resume() {
      if(owner()) {
        const keys=[];
        for(let i=0;i<storage.length;i++) {
          const k=storage.key(i);
          if(k && k.startsWith(prefix()) && !k.endsWith(":resolved") && !queue.includes(k)) keys.push(k);
        }
        keys.sort((a,b)=>Number(!!readDraft(a).review)-Number(!!readDraft(b).review) || readDraft(a).created-readDraft(b).created || a.localeCompare(b,undefined,{numeric:true}));
        queue.push(...keys);
      }
      return flush();
    }
    function recoverLegacy(previous,saved) {
      if(!owner() || !previous || !Array.isArray(previous.changelog) || !saved.changelog?.length) return;
      const oldest=saved.changelog.at(-1).ts, known=new Set(saved.changelog.map(logKey));
      const latest=new Map();
      for(const e of previous.changelog) {
        if(!e || !e.ts || e.ts<oldest || !["status","detail"].includes(e.type) || !/^\d+$/.test(String(e.cardId))) continue;
        if(!["status","qty","serial","price","notes","date","printRun"].includes(e.field)) continue;
        const k=e.cardId+"/"+e.field;
        if(!latest.has(k) || e.ts>latest.get(k).ts) latest.set(k,e);
      }
      for(const e of latest.values()) {
        if(known.has(logKey(e)) || saved.changelog.some(s=>s.cardId===e.cardId && s.field===e.field && s.ts>=e.ts)) continue;
        const path=e.field==="status" ? ["statuses",String(e.cardId)] : ["details",String(e.cardId),e.field];
        const get=doc=>path.reduce((v,k)=>v==null ? undefined : v[k],doc);
        const here=get(previous), remote=get(saved);
        // An undo removes or changes the local value. Never infer intent from a raw cache difference.
        if(!equal(here,e.to) || equal(remote,here)) continue;
        const k=prefix()+"legacy:"+logKey(e);
        if(!storage.getItem(k) && !storage.getItem(k+":resolved"))
          remember(k,{created:Date.now(),writer:k,review:true,ops:[{path,before:remote,after:here,review:true}]});
      }
    }
    function resolve(key,conflict,local) {
      if(!owner() || !key.startsWith(prefix()) || !has(key)) throw Error("The pending edit changed. Reload to review.");
      const entry=readDraft(key);
      entry.choices=entry.choices || {};
      entry.choices[JSON.stringify(conflict.path)]={seen:conflict.actual,local};
      remember(key,entry);
    }
    return {begin,stage,flush,resume,resolve,recoverLegacy,hasPending:()=>queue.length>0};
  }
  const api={changes,apply,create};
  if(root) root.CollectionSync=api;
  if(typeof module!=="undefined" && module.exports) module.exports=api;
})(typeof window!=="undefined" ? window : null);
