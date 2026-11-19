(function () {
  "use strict";
  const pending = new Map();
  const control = "bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200";
  const button = "rounded border border-slate-700 px-2 py-1 text-xs hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed";
  function safeUrl(value) { try { const u=new URL(value);return u.protocol==="https:" && !u.username && !u.password?u.href:""; } catch(e) { return ""; } }
  function subject(card) { return card?.subject || card?.playerName || window.TEMPO_ROSTER?.[card?.player]?.name || card?.name || ""; }
  function cardLabel(card) { return card ? [subject(card),card.year,card.product,"#"+card.cardNumber,card.cardSet].filter(Boolean).join(" · ") : "Card no longer in catalog"; }
  function blank(card) { return {id:"",cardId:card?String(card.id):"",copyId:"",status:"target",signer:subject(card),signedDate:"",event:"",location:"",proofText:"",certificate:"",verificationNotes:""}; }
  function useAutographCardFocus({scope,initialCardId,active,blocked,onFocus}) {
    const [focus,setFocus]=React.useState(String(initialCardId || "")),applied=React.useRef(null);
    React.useEffect(()=>{
      const id=String(initialCardId || ""),request=JSON.stringify([scope,id]);
      if(!active || blocked || applied.current===request)return;
      applied.current=request;setFocus(id);if(onFocus)onFocus(id);
    },[scope,initialCardId,active,blocked,onFocus]);
    return [focus,setFocus];
  }
  function AutographPanel({scope,cards=[],statuses={},details={},copyInventory,imports,isOwner,active=true,inventoryReady=true,inventoryError="",onRefreshInventory,onPendingChange,initialCardId}) {
    const U=window.AutographUtils;
    const [state,setState]=React.useState(()=>U.empty()),[ready,setReady]=React.useState(false),[busy,setBusy]=React.useState(false),[error,setError]=React.useState(""),[notice,setNotice]=React.useState(""),[conflict,setConflict]=React.useState(false);
    const [filter,setFilter]=React.useState("target"),[query,setQuery]=React.useState(""),[cardQuery,setCardQuery]=React.useState(""),[draft,setDraft]=React.useState(null),[limit,setLimit]=React.useState(100),[authEpoch,setAuthEpoch]=React.useState(0);
    const token=React.useRef({}),epoch=React.useRef(0),lock=React.useRef(false),baseline=React.useRef(null),draftRef=React.useRef(draft),ownerRef=React.useRef(null);
    draftRef.current=draft;
    const context={statuses,details,copyInventory,imports};
    const cardMap=React.useMemo(()=>new Map(cards.map(c=>[String(c.id),c])),[cards]);
    const unsaved=!!draft || busy;
    const [cardFocus,setCardFocus]=useAutographCardFocus({scope,initialCardId,active,blocked:unsaved,onFocus:id=>{if(id)setFilter("all");setLimit(100);}});
    const focusCard=cardMap.get(cardFocus);
    // Only non-sensitive flags are shared with navigation; drafts stay in memory.
    pending.set(token.current,unsaved);
    React.useEffect(()=>{if(onPendingChange)onPendingChange(unsaved);},[unsaved,onPendingChange]);
    React.useEffect(()=>()=>{pending.delete(token.current);epoch.current++;},[]);
    React.useEffect(()=>{function beforeUnload(e){if(pending.get(token.current)){e.preventDefault();e.returnValue="";}}window.addEventListener("beforeunload",beforeUnload);return()=>window.removeEventListener("beforeunload",beforeUnload);},[]);
    React.useEffect(()=>{function auth(){epoch.current++;baseline.current=null;ownerRef.current=null;lock.current=false;setState(U.empty());setReady(false);setDraft(null);setError("");setBusy(false);setConflict(false);setAuthEpoch(n=>n+1);}window.addEventListener("authchange",auth);return()=>window.removeEventListener("authchange",auth);},[]);
    async function load(keepDraft=false){
      if(lock.current || !window.trackerAuth?.isOwner())return;
      lock.current=true;const current=++epoch.current;setBusy(true);setError("");
      try{const result=await window.trackerAutographs.forScope(scope).load();if(current!==epoch.current)return;if(!result.ok)throw Error(result.error || "Could not load private autograph records.");baseline.current=result;ownerRef.current=result.ownerId;setState(U.normalize(result.value));setReady(true);setConflict(false);if(!keepDraft)setDraft(null);setNotice(keepDraft?"Saved records reloaded. Review your retained draft before saving.":"");}
      catch(e){if(current===epoch.current){setError(e.message);setReady(false);}}
      finally{if(current===epoch.current){lock.current=false;setBusy(false);}}
    }
    React.useEffect(()=>{if(active && isOwner && !ready)load();},[active,isOwner,scope,authEpoch]);
    function edit(record){if(busy)return;setDraft({...record,cardId:String(record.cardId),copyId:record.copyId || "",proofText:(record.proofPhotos || []).map(p=>p.url).join("\n")});setCardQuery("");setError("");setNotice("");}
    async function persist(next,success){
      if(lock.current || !baseline.current || !ready || conflict)return false;
      if(!window.trackerAuth?.isOwner() || (window.trackerAuth.userId && window.trackerAuth.userId()!==ownerRef.current)){setError("Your account changed. Reload private autograph records.");setReady(false);return false;}
      lock.current=true;const current=epoch.current,source=baseline.current;setBusy(true);setError("");setNotice("");
      try{const result=await window.trackerAutographs.forScope(scope).save(next,source.revision,source.ownerId);if(current!==epoch.current)return false;if(!result.ok){if(result.conflict)setConflict(true);throw Error(result.error || "Could not save. Your draft is retained.");}baseline.current=result;setState(U.normalize(result.value || next));setDraft(null);setNotice(success);return true;}
      catch(e){if(current===epoch.current)setError(e.message);return false;}
      finally{if(current===epoch.current){lock.current=false;setBusy(false);}}
    }
    async function save(){
      if(!draft || lock.current)return;
      try{
        if(!cardMap.has(String(draft.cardId)))throw Error("Choose the catalog card first.");
        if(!String(draft.signer || "").trim())throw Error("Enter the signer’s name.");
        if(draft.status==="signed" && !inventoryReady)throw Error("Load the current physical copy inventory before recording a signature.");
        const urls=String(draft.proofText || "").split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
        if(urls.some(url=>!safeUrl(url)))throw Error("Proof photos need valid HTTPS URLs, one per line.");
        const record={...draft,proofPhotos:urls.map(url=>({url:safeUrl(url),caption:(draft.proofPhotos || []).find(p=>p.url===url)?.caption || ""}))};delete record.proofText;
        const next=U.saveRecord(state,record,context);await persist(next,"Autograph record saved. Card quantities are unchanged.");
      }catch(e){setError(e.message);}
    }
    async function archive(record){if(lock.current)return;try{await persist(U.archiveRecord(state,record.id),"Autograph record archived; history retained.");}catch(e){setError(e.message);}}
    const records=U.review(state,context).filter(record=>!cardFocus || String(record.cardId)===cardFocus),currentRecords=records.filter(record=>!record.archived),counts={target:currentRecords.filter(r=>r.status==="target").length,signed:currentRecords.filter(r=>r.status==="signed").length,all:currentRecords.length,archived:records.filter(r=>r.archived).length};
    const rows=records.filter(record=>(filter==="archived" ? record.archived : !record.archived && (filter==="all" || record.status===filter)) && (!query || [cardLabel(cardMap.get(String(record.cardId))),record.signer,record.event,record.location,record.verificationNotes].join(" ").toLowerCase().includes(query.toLowerCase())));
    const selected=draft && cardMap.get(String(draft.cardId)),slots=draft && inventoryReady?U.slots(draft.cardId,context):[];
    const choices=cards.filter(card=>!cardQuery || cardLabel(card).toLowerCase().includes(cardQuery.toLowerCase())).slice(0,75);
    if(selected && !choices.some(c=>String(c.id)===String(selected.id)))choices.unshift(selected);
    if(!isOwner)return <div className="p-3 text-xs text-slate-400">Sign in to view your private in-person autograph records.</div>;
    return <section className="text-slate-200 text-xs p-1" aria-label="In-person autographs">
      <div className="flex flex-wrap items-center gap-2 mb-2"><h2 className="font-bold text-sm">In-person autographs</h2><span className="text-slate-500">Private · separate from factory autographs</span><button disabled={!ready || busy || !!draft || conflict} onClick={()=>{setDraft(blank(focusCard));setCardQuery("");setError("");}} className={button+" ml-auto bg-purple-950"}>Add to sign</button><button disabled={busy || !!draft && !conflict} onClick={()=>load(!!draft)} className={button}>{conflict?"Reload saved; keep draft":"Refresh"}</button></div>
      {cardFocus && <div className="flex flex-wrap items-center gap-2 border border-purple-800 bg-purple-950/30 rounded px-2 py-1 mb-2"><b>{cardLabel(focusCard)}</b><button className={button+" ml-auto"} disabled={busy || !!draft} onClick={()=>setCardFocus("")}>Show all cards</button></div>}
      {!ready && !error && <p className="text-slate-400 p-2">Loading private autograph records…</p>}
      {!inventoryReady && <p className="text-amber-300 mb-2">{inventoryError || "Loading physical copies. To Sign targets remain available; signed records need the current copy inventory."}{onRefreshInventory && <button className={button+" ml-2"} onClick={onRefreshInventory}>Refresh copies</button>}</p>}
      {error && <div role="alert" className="text-amber-200 border border-amber-800 rounded p-2 mb-2">{error}{conflict && <p className="mt-1">Another session saved changes. Reload saved records, then review and save your retained draft.</p>}</div>}
      {notice && <p role="status" className="text-emerald-300 mb-2">{notice}</p>}
      <div className="flex gap-1 flex-wrap mb-2">{[["target","To Sign"],["signed","Signed"],["all","All"],["archived","Archived"]].map(([key,label])=><button key={key} aria-pressed={filter===key} onClick={()=>{setFilter(key);setLimit(100);}} className={button+(filter===key?" bg-purple-900 border-purple-700":"")}>{label} {counts[key]}</button>)}<input aria-label="Search autographs" value={query} onChange={e=>{setQuery(e.target.value);setLimit(100);}} placeholder="Signer, card, event…" className={control+" flex-1 min-w-40"}/></div>
      {draft && <div className="border border-purple-700 bg-slate-950/50 rounded p-2 mb-3" role="group" aria-label="Edit autograph"><div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <label className="col-span-2">Card<input aria-label="Find autograph card" value={cardQuery} disabled={busy || !!draft.id} onChange={e=>setCardQuery(e.target.value)} placeholder="Find subject, set, card number…" className={control+" w-full mt-1"}/><select aria-label="Autograph card" value={draft.cardId} disabled={busy || !!draft.id} onChange={e=>{const card=cardMap.get(e.target.value);setDraft({...draft,cardId:e.target.value,copyId:"",signer:subject(card)});}} className={control+" w-full mt-1"}><option value="">Choose a card…</option>{choices.map(card=><option key={card.id} value={String(card.id)}>{cardLabel(card)}</option>)}</select><span className="text-slate-500 text-[10px]">Showing up to 75 matches; refine your search.</span></label>
        <label>Status<select aria-label="Autograph status" value={draft.status} disabled={busy} onChange={e=>setDraft({...draft,status:e.target.value})} className={control+" w-full mt-1"}><option value="target">To Sign</option><option value="signed">Signed</option></select></label>
        <label>Signer<input aria-label="Autograph signer" value={draft.signer || ""} disabled={busy} onChange={e=>setDraft({...draft,signer:e.target.value})} className={control+" w-full mt-1"}/></label>
        <label className="col-span-2">Physical copy<select aria-label="Autograph physical copy" value={draft.copyId || ""} disabled={busy || !draft.cardId || !inventoryReady} onChange={e=>setDraft({...draft,copyId:e.target.value})} className={control+" w-full mt-1"}><option value="">{draft.status==="signed"?"Choose the signed physical copy…":"Choose later (optional for To Sign)"}</option>{draft.copyId && !slots.some(slot=>slot.id===draft.copyId) && <option value={draft.copyId}>Previous copy · needs review</option>}{slots.map(slot=><option key={slot.id} value={slot.id}>{slot.label}{slot.serial?" · #"+slot.serial:""}{slot.location?" · "+slot.location:""}</option>)}</select>{draft.status==="signed" && !slots.length && <span className="text-amber-300 text-[10px]">No acquired copy is available. Update the card’s actual ownership first, or keep this as To Sign.</span>}</label>
        <label>Signed date<input aria-label="Autograph date" type="date" value={draft.signedDate || ""} disabled={busy} onChange={e=>setDraft({...draft,signedDate:e.target.value})} className={control+" w-full mt-1"}/></label>
        <label>Event<input aria-label="Autograph event" value={draft.event || ""} disabled={busy} onChange={e=>setDraft({...draft,event:e.target.value})} className={control+" w-full mt-1"}/></label>
        <label>Location<input aria-label="Autograph location" value={draft.location || ""} disabled={busy} onChange={e=>setDraft({...draft,location:e.target.value})} className={control+" w-full mt-1"}/></label>
        <label>Certificate / authentication<input aria-label="Autograph certificate" value={draft.certificate || ""} disabled={busy} onChange={e=>setDraft({...draft,certificate:e.target.value})} className={control+" w-full mt-1"}/></label>
        <label className="col-span-2">Proof photo URLs (one per line)<textarea aria-label="Autograph proof photos" value={draft.proofText || ""} disabled={busy} onChange={e=>setDraft({...draft,proofText:e.target.value})} className={control+" w-full mt-1 h-14"}/></label>
        <label className="col-span-2 sm:col-span-4">Notes<textarea aria-label="Autograph notes" value={draft.verificationNotes || ""} disabled={busy} onChange={e=>setDraft({...draft,verificationNotes:e.target.value})} className={control+" w-full mt-1 h-12"}/></label>
      </div><div className="flex items-center justify-end gap-2 mt-2"><span className="mr-auto text-slate-500">Recording a signature does not acquire another card.</span><button disabled={busy} onClick={()=>{setDraft(null);setError("");}} className={button}>Cancel</button><button disabled={busy || !ready || conflict} onClick={save} className={button+" bg-purple-800 border-purple-600 font-bold"}>{busy?"Saving…":"Save autograph"}</button></div></div>}
      <div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-slate-800 text-slate-400"><tr><th className="p-1">Card / copy</th><th>Signer</th><th>Status</th><th>Date / event</th><th>Proof</th><th/></tr></thead><tbody>{rows.slice(0,limit).map(record=><tr key={record.id} className="border-b border-slate-800"><td className="p-1"><div>{cardLabel(cardMap.get(String(record.cardId)))}</div><div className="text-slate-500 text-[10px]">{record.copySnapshot?.label || record.copyId || "Copy not selected"}</div>{inventoryReady && record.needsCopyReview && <span className="text-amber-300">Copy link needs review; signature retained</span>}</td><td>{record.signer}</td><td className={record.status==="signed"?"text-emerald-300":"text-purple-300"}>{record.status==="signed"?"Signed":"To Sign"}</td><td>{record.signedDate}<div className="text-slate-400">{record.event}{record.location?" · "+record.location:""}</div></td><td>{(record.proofPhotos || []).filter(photo=>safeUrl(photo.url)).map((photo,i)=><a key={i} href={safeUrl(photo.url)} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline mr-2">Photo {i+1}</a>)}</td><td className="whitespace-nowrap"><button disabled={busy || !!draft || conflict} onClick={()=>edit(record)} className={button}>{record.archived?"Restore / edit":"Edit"}</button>{!record.archived && <button disabled={busy || !!draft || conflict} onClick={()=>archive(record)} className={button+" ml-1"}>Archive</button>}</td></tr>)}</tbody></table></div>
      {ready && !rows.length && <p className="text-slate-500 p-3">No {filter==="target"?"To Sign":filter==="signed"?"Signed":"autograph"} records in this view.</p>}{rows.length>limit && <button className={button+" mt-2"} onClick={()=>setLimit(limit+100)}>Show 100 more · {rows.length} records</button>}
    </section>;
  }
  AutographPanel.hasPending=()=>Array.from(pending.values()).some(Boolean);
  window.AutographPanel=AutographPanel;
})();
