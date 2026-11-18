/* Private receipt evidence. This module never changes collection or copy data. */
(function (root) {
  "use strict";
  const KEY = "purchase-receipts-v1";
  const clone = value => JSON.parse(JSON.stringify(value));
  const plain = value => !!value && typeof value === "object" && !Array.isArray(value);
  const scope = value => ({tyler:"tb",wnba:"tempo"}[String(value || "").toLowerCase()] || String(value || "").toLowerCase());
  function normalize(value) {
    if (value == null) return {schemaVersion:1,records:{},changelog:[]};
    if (!plain(value) || value.schemaVersion !== 1 || !plain(value.records) || !Array.isArray(value.changelog)) throw Error("Receipt data needs review. Nothing was replaced.");
    Object.entries(value.records).forEach(([id,record]) => {
      if (!plain(record) || record.id !== id || !plain(record.receipt)) throw Error("A receipt record is invalid. Nothing was replaced.");
    });
    return clone(value);
  }
  function cardLabel(card) {return [card.subject || card.playerName || card.player,card.product,card.cardNumber ? "#"+card.cardNumber : "",card.cardSet || "Base"].filter(Boolean).join(" · ");}
  function safeUrl(value) {try {const u=new URL(value);return /^https?:$/.test(u.protocol) && !u.username && !u.password ? u.href : "";} catch (_) {return "";}}
  function receiptSources(record) {
    const receipt=record?.receipt || {},events=(receipt.events || []).filter(event=>safeUrl(event.sourceUrl));
    if(!events.length && safeUrl(receipt.sourceUrl))return [{sourceUrl:receipt.sourceUrl,eventType:"source"}];
    return events;
  }
  function proofLabel(sourceUrl) {
    try {const host=new URL(safeUrl(sourceUrl)).hostname.toLowerCase();if(host==="mail.google.com")return "Email proof";if(host==="comc.com" || host.endsWith(".comc.com"))return "COMC proof";} catch (_) {}
    return "Source proof";
  }
  function itemLink(record) {
    const platform=String(record?.platform || record?.receipt?.platform || "").toLowerCase(),id=String(record?.itemId || "");
    if(!/^\d+$/.test(id))return null;
    if(platform==="comc")return {label:"COMC item",url:"https://www.comc.com/item/"+id};
    if(platform==="ebay")return {label:"eBay item",url:"https://www.ebay.com/itm/"+id};
    return null;
  }
  function money(value) {
    if (!plain(value)) return "Not stated";
    const amount = value.amount != null ? String(value.amount) : Number.isSafeInteger(value.amountMinor) ? (value.amountMinor/100).toFixed(2) : "";
    return amount ? (value.currency || "Currency unknown")+" "+amount : "Not stated";
  }
  function applyLink(input, receiptId, choice, context) {
    const state=normalize(input),record=state.records[receiptId];
    if (!record) throw Error("This receipt is unavailable. Refresh first.");
    if (!context.ownerId || choice.confirmed !== true) throw Error("Confirm the exact card and variant before linking.");
    const targetScope=scope(choice.scope),catalogScope=scope(context.scope);
    if (!catalogScope || targetScope !== catalogScope || scope(record.collection) !== catalogScope) throw Error("Open this receipt’s collection to link its card.");
    const card=(context.cards || []).find(card => String(card.id)===String(choice.cardId) && !card.archived && !card.hiddenDuplicate);
    if (!card) throw Error("Choose an available card from this collection’s catalog.");
    const previous=record.link || null;
    if (previous && previous.status === "approved" && scope(previous.scope)===targetScope && String(previous.cardId)===String(card.id)) return {value:state,changed:false};
    const now=context.now || new Date().toISOString();
    const next={status:"approved",scope:targetScope,cardId:card.id,cardLabel:cardLabel(card),approvedBy:context.ownerId,approvedAt:now,method:"owner_selected"};
    record.link=next;
    state.changelog.push({ts:now,action:"receipt_link_approved",receiptId,actorId:context.ownerId,before:previous,after:clone(next)});
    return {value:state,changed:true};
  }
  function removeLink(input, receiptId, context) {
    const state=normalize(input),record=state.records[receiptId];
    if (!context.ownerId || !record) throw Error("Refresh this receipt before changing its link.");
    if (!record.link) return {value:state,changed:false};
    const previous=clone(record.link);record.link=null;
    state.changelog.push({ts:context.now || new Date().toISOString(),action:"receipt_link_removed",receiptId,actorId:context.ownerId,before:previous,after:null});
    return {value:state,changed:true};
  }
  function createSession(options) {
    let epoch=0;
    let snapshot={value:normalize(null),ownerId:null,revision:null,ready:false,busy:false,error:""};
    const publish=() => {if(options.onChange)options.onChange({...snapshot});};
    function invalidate(error) {epoch++;snapshot={value:normalize(null),ownerId:null,revision:null,ready:false,busy:false,error:error || ""};publish();}
    function sameOwner(id) {return !!id && options.getOwnerId()===id;}
    async function load() {
      if(snapshot.busy)return {ok:false,busy:true,error:"Wait for the current receipt operation."};
      const ownerId=options.getOwnerId();
      if(!ownerId){invalidate("Sign in to view private receipts.");return {ok:false,signedOut:true};}
      const current=++epoch;snapshot={...snapshot,ready:false,busy:true,error:""};publish();
      try {
        const result=await options.store.load(KEY);
        if(current!==epoch)return {ok:false,stale:true};
        if(!sameOwner(ownerId) || result.signedOut || result.ownerId && result.ownerId!==ownerId){invalidate("Your session changed. Sign in and refresh receipts.");return {ok:false,signedOut:true};}
        if(!result.ok)throw Error(result.error || "Could not load private receipts.");
        if(result.ownerId!==ownerId)throw Error("Your account could not be verified.");
        snapshot={value:normalize(result.value),ownerId,revision:result.revision,ready:true,busy:false,error:""};publish();return {ok:true};
      } catch(error) {
        if(current!==epoch)return {ok:false,stale:true};
        if(!sameOwner(ownerId)){invalidate("Your session changed. Refresh receipts.");return {ok:false,signedOut:true};}
        snapshot={...snapshot,ready:false,busy:false,error:error.message || "Could not load private receipts."};publish();return {ok:false,error:snapshot.error};
      }
    }
    async function change(makeNext) {
      if(snapshot.busy)return {ok:false,busy:true,error:"Wait for the current receipt operation."};
      if(!snapshot.ready || !snapshot.ownerId)return {ok:false,error:"Refresh private receipts before linking."};
      if(!sameOwner(snapshot.ownerId)){invalidate("Your session changed. Refresh receipts.");return {ok:false,signedOut:true};}
      const current=epoch,ownerId=snapshot.ownerId,revision=snapshot.revision;
      let requestStarted=false;
      snapshot={...snapshot,busy:true,error:""};publish();
      try {
        const next=makeNext(snapshot.value,ownerId);
        if(!next.changed){snapshot={...snapshot,busy:false};publish();return {ok:true,changed:false};}
        requestStarted=true;
        const result=await options.store.save(KEY,next.value,revision,ownerId);
        if(current!==epoch)return {ok:false,stale:true};
        if(!sameOwner(ownerId) || result.signedOut || result.ownerId && result.ownerId!==ownerId){invalidate("Your session changed. Refresh receipts.");return {ok:false,signedOut:true};}
        if(!result.ok){snapshot={...snapshot,busy:false,ready:!(result.conflict || result.signedOut),error:result.conflict?"Receipts changed in another session. Refresh before linking; newer records were preserved.":result.error || "The receipt link was not saved."};publish();return {...result,error:snapshot.error};}
        if(result.ownerId!==ownerId)throw Error("Your account could not be verified after saving.");
        snapshot={value:normalize(result.value),ownerId,revision:result.revision,ready:true,busy:false,error:""};publish();return {ok:true,changed:true};
      } catch(error) {
        if(current!==epoch)return {ok:false,stale:true};
        if(!sameOwner(ownerId)){invalidate("Your session changed. Refresh receipts.");return {ok:false,signedOut:true};}
        snapshot={...snapshot,busy:false,ready:requestStarted?false:snapshot.ready,error:error.message || "The receipt link was not saved."};publish();return {ok:false,error:snapshot.error};
      }
    }
    return {load,invalidate,getSnapshot:()=>snapshot,approve:(id,choice,context)=>change((value,ownerId)=>applyLink(value,id,choice,{...context,ownerId})),unlink:id=>change((value,ownerId)=>removeLink(value,id,{ownerId}))};
  }
  root.PurchaseReceiptCore={KEY,normalize,scope,cardLabel,safeUrl,receiptSources,proofLabel,itemLink,money,applyLink,removeLink,createSession};
})(typeof window !== "undefined" ? window : globalThis);

/* RECEIPT_PANEL_UI */
(function () {
  const U=window.PurchaseReceiptCore;
  const pending=new Map();
  const scopeName=value=>({tb:"Tyler Black",tempo:"Toronto Tempo",racing:"Racing",other:"Other / poker",baseball:"Baseball",basketball:"Basketball",football:"Football",hockey:"Hockey",soccer:"Soccer"}[U.scope(value)] || value);
  const human=value=>String(value || "Not stated").replace(/_/g," ");
  function PurchaseReceiptsPanel({scope="tb",cards=[],isOwner,active=true}) {
    const [owner,setOwner]=React.useState(isOwner == null ? !!window.trackerAuth?.isOwner() : !!isOwner);
    const [authEpoch,setAuthEpoch]=React.useState(0);
    const [snapshot,setSnapshot]=React.useState({value:U.normalize(null),ready:false,busy:false,error:""});
    const [query,setQuery]=React.useState(""),[filter,setFilter]=React.useState("pending"),[account,setAccount]=React.useState("all"),[viewScope,setViewScope]=React.useState("current"),[limit,setLimit]=React.useState(40);
    const [form,setForm]=React.useState(null),[cardQuery,setCardQuery]=React.useState(""),[notice,setNotice]=React.useState("");
    const session=React.useRef(null),formRef=React.useRef(null),token=React.useRef({});
    formRef.current=form;
    if(!session.current)session.current=U.createSession({store:{load:key=>window.trackerPrivateStore?window.trackerPrivateStore.load(key):Promise.resolve({ok:false,error:"Private receipt storage is unavailable."}),save:(...args)=>window.trackerPrivateStore.save(...args)},getOwnerId:()=>window.trackerAuth?.isOwner() ? window.trackerAuth.userId() : null,onChange:setSnapshot});
    const currentScope=U.scope(scope),controller=session.current;
    const clearDraft=()=>{setForm(null);formRef.current=null;setCardQuery("");};
    React.useEffect(()=>{
      pending.set(token.current,()=>controller.getSnapshot().busy || !!formRef.current?.cardId);
      function auth(event){controller.invalidate();clearDraft();setNotice("");setQuery("");setAccount("all");setOwner(!!event.detail?.isOwner);setAuthEpoch(value=>value+1);}
      window.addEventListener("authchange",auth);
      return ()=>{window.removeEventListener("authchange",auth);pending.delete(token.current);controller.invalidate();};
    },[]);
    React.useEffect(()=>{if(isOwner != null)setOwner(!!isOwner);},[isOwner]);
    React.useEffect(()=>{if(!owner){controller.invalidate();clearDraft();setNotice("");}else if(active && !controller.getSnapshot().ready && !controller.getSnapshot().busy)controller.load();},[owner,active,authEpoch]);
    React.useEffect(()=>{clearDraft();setViewScope("current");setLimit(40);},[currentScope]);
    const records=Object.values(snapshot.value.records),accounts=[...new Set(records.map(record=>record.account))].sort();
    const matches=record=>{
      const linked=record.link?.status==="approved",receipt=record.receipt;
      if(filter==="pending" && linked || filter==="linked" && !linked)return false;
      if(viewScope==="current" && U.scope(record.collection)!==currentScope)return false;
      if(account!=="all" && record.account!==account)return false;
      return !query.trim() || [record.account,record.orderId,record.itemId,receipt.title,receipt.serialFromTitle,receipt.seller,record.link?.cardLabel].filter(Boolean).join(" ").toLowerCase().includes(query.trim().toLowerCase());
    };
    const filtered=records.filter(matches).sort((a,b)=>String(b.receipt.purchaseDate || b.receipt.firstEvidenceAt || b.receipt.events?.[0]?.timestamp || "").localeCompare(String(a.receipt.purchaseDate || a.receipt.firstEvidenceAt || a.receipt.events?.[0]?.timestamp || "")));
    const availableCards=cards.filter(card=>!card.archived && !card.hiddenDuplicate);
    const chosen=form ? availableCards.find(card=>String(card.id)===String(form.cardId)) : null;
    const searched=availableCards.filter(card=>!cardQuery.trim() || U.cardLabel(card).toLowerCase().includes(cardQuery.trim().toLowerCase())).slice(0,150);
    const choices=chosen && !searched.includes(chosen)?[chosen,...searched]:searched;
    const record=form?snapshot.value.records[form.receiptId]:null;
    const control="rounded border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-slate-100";
    const button=control+" disabled:opacity-40";
    const canEdit=owner && snapshot.ready && !snapshot.busy;
    function openEditor(row){setNotice("");setCardQuery("");setForm({receiptId:row.id,cardId:"",confirmed:false});}
    async function approve(event){
      event.preventDefault();if(!form)return;
      const result=await controller.approve(form.receiptId,{cardId:form.cardId,scope:currentScope,confirmed:form.confirmed},{scope:currentScope,cards:availableCards});
      if(result.ok){clearDraft();setNotice("Receipt linked. Ownership and copy counts are unchanged.");}
    }
    async function unlink(row){const result=await controller.unlink(row.id);if(result.ok){clearDraft();setNotice("Card link removed. Receipt evidence is preserved.");}}
    if(!owner)return <section className="rounded border border-slate-700 p-4 text-sm text-slate-300">Sign in to view your private receipts.</section>;
    return <section className="space-y-3 text-slate-100" aria-label="Private purchase receipts">
      <div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="font-bold text-lg text-amber-300">Receipts <span className="text-xs font-normal text-slate-400">Private</span></h2><p className="text-xs text-slate-400">Review purchases and link the exact catalog card. Linking does not add ownership or copies.</p></div><button className={button} disabled={snapshot.busy || !!form?.cardId} onClick={()=>{clearDraft();setNotice("");controller.load();}}>Refresh</button></div>
      {snapshot.busy && <p role="status" className="text-xs text-slate-300">{snapshot.ready?"Saving receipt link…":"Loading private receipts…"}</p>}
      {snapshot.error && <p role="alert" className="rounded border border-red-800 bg-red-950/40 p-2 text-xs text-red-200">{snapshot.error}</p>}
      {notice && <p role="status" className="text-xs text-emerald-300">{notice}</p>}
      <div className="flex flex-wrap items-center gap-2"><input aria-label="Search private receipts" className={control+" min-w-48 flex-1"} placeholder="Title, order, item, serial or account" value={query} onChange={event=>{setQuery(event.target.value);setLimit(40);}}/><select aria-label="Receipt link status" className={control} value={filter} onChange={event=>{setFilter(event.target.value);setLimit(40);}}><option value="pending">Pending links</option><option value="linked">Linked</option><option value="all">All receipts</option></select><select aria-label="Receipt collection" className={control} value={viewScope} onChange={event=>{setViewScope(event.target.value);setLimit(40);}}><option value="current">{scopeName(currentScope)}</option><option value="all">All collections</option></select><select aria-label="Receipt account" className={control} value={account} onChange={event=>{setAccount(event.target.value);setLimit(40);}}><option value="all">All accounts</option>{accounts.map(value=><option key={value}>{value}</option>)}</select><span className="text-xs text-slate-400">{filtered.length} receipts</span></div>
      {record && <form onSubmit={approve} className="space-y-2 rounded border border-amber-700 bg-slate-900 p-3">
        <div className="flex justify-between gap-3"><h3 className="text-sm font-semibold">Link: {record.receipt.title}</h3><button type="button" className={button} disabled={snapshot.busy} onClick={clearDraft}>Cancel</button></div>
        <p className="text-xs text-slate-400">Choose the exact {scopeName(currentScope)} catalog card. Suggestions need your approval.</p>
        {!!record.catalogueCandidates?.length && <div className="space-y-1">{record.catalogueCandidates.slice(0,8).map(candidate=>{const card=availableCards.find(card=>String(card.id)===String(candidate.cardId));return <div key={String(candidate.cardId)} className="text-xs"><button type="button" className={button} disabled={!card || !canEdit} onClick={()=>setForm({...form,cardId:String(candidate.cardId),confirmed:false})}>Use suggestion: {U.cardLabel(candidate)}</button>{candidate.matchBasis && <p className="mt-1 text-slate-400">{candidate.matchBasis}</p>}</div>;})}</div>}
        <div className="flex flex-wrap gap-2"><input aria-label="Search catalog for receipt" className={control+" min-w-48 flex-1"} value={cardQuery} onChange={event=>setCardQuery(event.target.value)} placeholder="Search subject, set, number or variant"/><select aria-label="Exact card for receipt" className={control+" max-w-full flex-1"} disabled={!canEdit} value={form.cardId} onChange={event=>setForm({...form,cardId:event.target.value,confirmed:false})}><option value="">Choose exact card…</option>{choices.map(card=><option key={String(card.id)} value={String(card.id)}>{U.cardLabel(card)}</option>)}</select></div>
        <label className="flex gap-2 items-start text-xs"><input type="checkbox" disabled={!chosen || !canEdit} checked={form.confirmed} onChange={event=>setForm({...form,confirmed:event.target.checked})}/>I checked the exact card and variant.</label>
        <button className={button+" bg-amber-400 font-semibold text-slate-950"} disabled={!canEdit || !chosen || !form.confirmed}>Approve card link</button>
      </form>}
      <div className="overflow-x-auto rounded border border-slate-700"><table className="w-full text-left text-xs"><thead className="bg-slate-900 text-slate-400"><tr><th className="p-2">Receipt</th><th className="p-2">Amounts</th><th className="p-2">Status / evidence</th><th className="p-2">Catalog link</th></tr></thead><tbody>{filtered.slice(0,limit).map(row=>{const r=row.receipt,sources=U.receiptSources(row),itemLink=U.itemLink(row),refund=r.refundIssued,linked=row.link?.status==="approved",ownScope=U.scope(row.collection)===currentScope;return <tr key={row.id} className="border-t border-slate-800 align-top" data-receipt-id={row.id}>
        <td className="p-2 min-w-56 max-w-sm"><p className="font-medium">{r.title}</p><p className="mt-1 text-slate-400">{row.account} · {scopeName(row.collection)}</p><p className="text-slate-400">Order {row.orderId} · Item {row.itemId}</p>{r.serialFromTitle && <p className="text-cyan-300">Serial reported: {r.serialFromTitle}</p>}<div className="mt-1 flex gap-3">{sources[0] && <a className="text-sky-300 underline" href={U.safeUrl(sources[0].sourceUrl)} target="_blank" rel="noreferrer">{U.proofLabel(sources[0].sourceUrl)}</a>}{itemLink && <a className="text-sky-300 underline" href={itemLink.url} target="_blank" rel="noreferrer">{itemLink.label}</a>}</div></td>
        <td className="p-2 whitespace-nowrap"><p>Item {U.money(r.itemPrice)}</p><p className="text-slate-400">Order {U.money(r.orderTotal)}</p><p className="text-cyan-200">Charged {U.money(r.settlementCharged)}</p>{refund && <p className="text-amber-200">Refund {U.money(refund)}</p>}{r.settlementRefundIssued && <p className="text-amber-200">Refund paid {U.money(r.settlementRefundIssued)}</p>}</td>
        <td className="p-2 min-w-40 max-w-sm"><p>{human(r.fulfillmentStatus)}</p><p className={r.case || refund ? "text-amber-200" : "text-slate-400"}>{human(r.financialStatus)}</p>{r.recipientMismatch && <p className="text-amber-200">Recipient differs; review ownership.</p>}{r.case && <p className="text-amber-200">Case {r.case.caseId}: refund {r.case.refundOutcome}</p>}<details className="mt-1"><summary className="cursor-pointer text-slate-400">Sources and review notes</summary><div className="space-y-1 py-1">{[...new Set([...(row.reviewReasons || []),...(r.reviewReasons || [])])].map((reason,index)=><p key={index} className="text-slate-400">{reason}</p>)}{sources.map((event,index)=><a key={event.sourceMessageId || index} className="block text-sky-300 underline" href={U.safeUrl(event.sourceUrl)} target="_blank" rel="noreferrer">{String(event.timestamp || "").slice(0,10)} · {human(event.eventType)}</a>)}</div></details></td>
        <td className="p-2 min-w-40 max-w-xs">{linked?<><p className="text-emerald-300">{row.link.cardLabel || "Card "+row.link.cardId}</p><p className="text-slate-400">Approved {String(row.link.approvedAt || "").slice(0,10)}</p><button className={button+" mt-1"} disabled={!canEdit} onClick={()=>unlink(row)}>Remove link</button></>:<p className="text-slate-400">Pending review</p>}{ownScope?<button className={button+" mt-1 block"} disabled={!canEdit} onClick={()=>openEditor(row)}>{linked?"Change link":"Review card link"}</button>:<p className="mt-1 text-slate-400">Open {scopeName(row.collection)} to link.</p>}</td>
      </tr>;})}</tbody></table></div>
      {snapshot.ready && !filtered.length && <p className="text-sm text-slate-400">No receipts match these filters.</p>}
      {filtered.length>limit && <button className={button} onClick={()=>setLimit(limit+40)}>Show more ({filtered.length-limit} remaining)</button>}
    </section>;
  }
  PurchaseReceiptsPanel.hasPending=()=>[...pending.values()].some(check=>check());
  window.PurchaseReceiptsPanel=PurchaseReceiptsPanel;
})();
