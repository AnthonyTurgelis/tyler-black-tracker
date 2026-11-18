/* Controlled, owner-only UI. The caller supplies private persistence. */
const copyInventoryPendingEditors = new Map();
function CopyInventoryPanel({cards = [], statuses = {}, cardDetails = {}, inventory, publicMedia, onInventoryChange, onRefresh, isOwner, storageReady = true, readOnlyReason = "", loading = false, initialCardId = null, mode = window.MODE || "tb", primaryJerseyNumber = mode === "tb" ? 7 : null}) {
  const CI = window.CopyInventory, TM = window.TrackerMedia;
  const editorToken=React.useRef({}),formRef=React.useRef(null),saveLock=React.useRef(false);
  React.useEffect(()=>{copyInventoryPendingEditors.set(editorToken.current,()=>!!formRef.current || saveLock.current);function beforeUnload(event){if(formRef.current || saveLock.current){event.preventDefault();event.returnValue="";}}window.addEventListener("beforeunload",beforeUnload);return()=>{copyInventoryPendingEditors.delete(editorToken.current);window.removeEventListener("beforeunload",beforeUnload);};},[]);
  const [view, setView] = React.useState("copies");
  const [query, setQuery] = React.useState("");
  const [locationFilter, setLocationFilter] = React.useState("all");
  const [saleFilter, setSaleFilter] = React.useState("all");
  const [jerseyFilter, setJerseyFilter] = React.useState("all");
  const [scope, setScope] = React.useState("all");
  const [reviewFocus, setReviewFocus] = React.useState("all");
  const [preview, setPreview] = React.useState(null);
  const [limit, setLimit] = React.useState(40);
  const [form, setForm] = React.useState(null);
  formRef.current=form;
  const [showMore, setShowMore] = React.useState(false);
  const [cardQuery, setCardQuery] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const owner = isOwner == null ? !!(window.trackerAuth && window.trackerAuth.isOwner()) : !!isOwner;
  const canEdit = owner && storageReady && !loading && typeof onInventoryChange === "function";
  const state = React.useMemo(() => CI.normalizeState(inventory), [inventory]);
  const media = React.useMemo(() => TM.normalizePublicMedia(publicMedia,{primaryJerseyNumber}), [publicMedia,primaryJerseyNumber]);
  const visibleCards = React.useMemo(() => cards.filter(c => (mode !== "tb" || c.id !== 1) && !c.archived && !c.hiddenDuplicate), [cards, mode]);
  const cardById = React.useMemo(() => Object.fromEntries(visibleCards.map(c => [c.id, c])), [visibleCards]);
  const copies = React.useMemo(() => visibleCards.flatMap(card => CI.getCopiesForCard(state, card.id, statuses, cardDetails).map(copy => ({card, copy}))), [state, visibleCards, statuses, cardDetails]);
  const observations = Object.values(state.observations);
  const pending = observations.filter(o => !o.matchedCopyId && o.disposition !== "ignored" && o.disposition !== "split");
  const duplicateGroups = TM.comcDuplicateGroups(state);
  const activeCopies = copies.filter(row => CI.isCountedCopy(row.copy));
  const locationCounts = activeCopies.reduce((out, row) => { out[row.copy.location] = (out[row.copy.location] || 0) + 1; return out; }, {});
  const label = card => card ? `${card.subject || card.playerName || window.TEMPO_ROSTER?.[card.player]?.name || ""}${card.subject || card.playerName || window.TEMPO_ROSTER?.[card.player]?.name ? " · " : ""}${card.year && !String(card.product).startsWith(String(card.year)) ? card.year + " " : ""}${card.product} · #${card.cardNumber} · ${card.cardSet || "Base"}` : "Choose a card";
  React.useEffect(() => { if (initialCardId && cardById[initialCardId]) setQuery(label(cardById[initialCardId])); }, [initialCardId]);
  const legacyLabel = copy => copy.legacyStatus === "owned" || copy.legacyStatus === "for_sale" ? "Owned" : copy.legacyStatus === "in_transit" ? "In transit" : "Previously counted";
  const locationLabel = copy => copy.origin === "legacy" && copy.unallocated ? "Unallocated" : CI.LOCATIONS[copy.location] || "Unknown";
  const filteredCopies = copies.filter(({card,copy}) => {
    if (!window.CardCatalog.matchesScope(card,scope)) return false;
    if (query && !`${label(card)} ${copy.serial || ""} ${copy.notes || ""}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (locationFilter !== "all" && copy.location !== locationFilter) return false;
    if (saleFilter === "review" && !CI.needsSaleReview(copy)) return false;
    if (saleFilter === "listed" && copy.saleStatus !== "listed") return false;
    if (saleFilter === "extras" && !copy.duplicateConfirmed) return false;
    const jersey = TM.jerseyMatches(copy, copy.legacyUnit === 1 && copy.legacyDetails ? copy.legacyDetails.serial : "", media.cards[card.id], primaryJerseyNumber);
    if (jerseyFilter === "primary" && !jersey.primary || jerseyFilter === "secondary" && !jersey.secondary || jerseyFilter === "any" && !jersey.primary && !jersey.secondary) return false;
    return true;
  });
  const scopedPurchases = pending.filter(o => {
    if (!TM.observationMatchesScope(o,scope,cardById)) return false;
    const searchText = [o.title,o.source,o.serial,o.reviewReason,o.notes,label(cardById[o.cardId]),...(o.candidateCardIds || []).map(id=>label(cardById[id]))].filter(Boolean).join(" ");
    return !query || searchText.toLowerCase().includes(query.toLowerCase());
  });
  const reviewCounts = scopedPurchases.reduce((counts,observation)=>{const flags=TM.reviewFlags(observation);Object.keys(TM.REVIEW_LABELS).forEach(key=>{if(flags[key])counts[key]=(counts[key] || 0)+1;});return counts;},{});
  const filteredPurchases = scopedPurchases.filter(observation=>reviewFocus === "all" || TM.reviewFlags(observation)[reviewFocus]);
  const searchCards = cardQuery.trim() ? visibleCards.filter(c => label(c).toLowerCase().includes(cardQuery.toLowerCase())).slice(0, 15) : [];
  const selectedCard = form && cardById[form.cardId];
  const formCopies = form && form.cardId ? CI.getCopiesForCard(state, form.cardId, statuses, cardDetails).filter(c => c.saleStatus !== "sold") : [];
  const formObservation = form && form.observationId ? state.observations[form.observationId] : null;
  const controlClass = "w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100";
  const buttonClass = "rounded bg-amber-400 px-3 py-2 text-sm font-bold text-slate-950 disabled:opacity-40";
  function change(key, value) { setForm(previous => ({...previous, [key]: value})); }
  function openCopy(card, copy) {
    setShowMore(false);
    setError(""); setNotice(""); setCardQuery("");
    setForm({mode:"edit",cardId:card.id,copyId:copy.id,location:copy.location || "unknown",serial:copy.serial || "",paidPrice:copy.paidPrice || "",currency:copy.currency || CI.inferredCurrency(copy),purchaseDate:copy.purchaseDate || "",notes:copy.notes || "",duplicateConfirmed:!!copy.duplicateConfirmed,saleStatus:copy.saleStatus || "none",currentInventory:copy.currentInventory !== false,listingUrl:copy.listingUrl || "",photos:TM.normalizePhotos(copy.photos),secondaryJerseyNumber:copy.secondaryJerseyNumber || "",secondaryJerseyEvidence:copy.secondaryJerseyEvidence || {}});
  }
  function openPurchase(observation) {
    setShowMore(false);
    setError(""); setNotice(""); setCardQuery("");
    setForm({mode:"purchase",observationId:observation.id,cardId:TM.reviewFlags(observation).identityConfirmed ? observation.cardId : "",existingCopyId:"",location:"unknown",confirmAdditional:false,confirmSingleUnit:false,lotQuantity:observation.reportedQuantity > 1 ? String(observation.reportedQuantity) : "",duplicateConfirmed:false});
  }
  function openManual() {
    setShowMore(false);
    setError(""); setNotice(""); setCardQuery("");
    setForm({mode:"manual",cardId:"",location:"unknown",serial:"",paidPrice:"",currency:"",purchaseDate:"",notes:"",duplicateConfirmed:false,saleStatus:"none",listingUrl:"",confirmAdditional:false,photos:[],secondaryJerseyNumber:"",secondaryJerseyEvidence:{}});
  }
  async function persist(next, message) {
    if (!canEdit) throw new Error(readOnlyReason || "Sign in to save copy details.");
    const result = await onInventoryChange(next);
    if (result === false || result && (result.error || result.cloudSaved === false || result.ok === false)) throw new Error(result.error || "The copy details could not be saved. Please try again.");
    setNotice(message); setForm(null);
  }
  async function saveForm(event) {
    event.preventDefault(); if (busy || saveLock.current || !form) return;
    saveLock.current=true;setBusy(true); setError(""); setNotice("");
    try {
      const context = {statuses,cardDetails,cardById,primaryJerseyNumber};
      if (!selectedCard) throw new Error("Choose the exact card from the catalogue.");
      if (form.mode === "purchase") {
        if (!form.existingCopyId) throw new Error("Choose an existing copy, or choose to add an additional copy.");
        const result = CI.resolveObservation(state, form.observationId, {cardId:form.cardId,existingCopyId:form.existingCopyId === "__new__" ? "" : form.existingCopyId,confirmAdditional:form.existingCopyId === "__new__" && form.confirmAdditional,confirmSingleUnit:form.confirmSingleUnit,location:form.location,duplicateConfirmed:form.duplicateConfirmed}, context);
        await persist(result.inventory, form.existingCopyId === "__new__" ? "Additional copy saved." : "Purchase linked to the copy already counted.");
      } else {
        const patch = {location:form.location,serial:form.serial,paidPrice:form.paidPrice,currency:form.currency,purchaseDate:form.purchaseDate,notes:form.notes,duplicateConfirmed:form.duplicateConfirmed,saleStatus:form.saleStatus,currentInventory:form.currentInventory,listingUrl:form.listingUrl,photos:(form.photos || []).filter(photo=>String(photo.url || "").trim()),secondaryJerseyNumber:form.secondaryJerseyNumber,secondaryJerseyEvidence:form.secondaryJerseyNumber ? form.secondaryJerseyEvidence : {}};
        const next = form.mode === "manual" ? CI.addManualCopy(state, form.cardId, patch, {...context,confirmAdditional:form.confirmAdditional}).inventory : CI.editCopy(state, form.cardId, form.copyId, patch, context);
        await persist(next, form.mode === "manual" ? "Additional copy saved." : "Copy details saved.");
      }
    } catch (err) { setError(err.message || "Unable to save this copy."); }
    finally { saveLock.current=false;setBusy(false); }
  }
  async function splitLot() {
    if (!form || !form.observationId || busy || saveLock.current) return;
    saveLock.current=true;setBusy(true); setError("");
    try {
      const result = CI.splitObservation(state,form.observationId,Number(form.lotQuantity));
      await persist(result.inventory, `Created ${result.observationIds.length} separate copy reviews. Your copy count has not changed.`);
    } catch (err) { setError(err.message || "Unable to split this lot."); }
    finally { saveLock.current=false;setBusy(false); }
  }
  if (!owner) return <section className="rounded-lg border border-slate-700 bg-slate-900 p-5 text-slate-200"><h2 className="text-lg font-bold">My copies</h2><p className="mt-2 text-sm text-slate-400">Sign in to review individual copies, purchase details, and locations.</p></section>;
  return <section className="space-y-4 text-slate-100">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h2 className="text-xl font-bold text-amber-300">My copies</h2><p className="mt-1 max-w-3xl text-sm text-slate-400">Track each physical copy and its location. Your existing Owned marks and quantities stay visible while you match purchases to the copies already counted.</p></div>
      <div className="flex gap-2">{onRefresh ? <button className="rounded border border-slate-600 px-3 py-2 text-sm disabled:opacity-40" disabled={busy || loading || !!form} onClick={async () => {if(saveLock.current)return;saveLock.current=true;setBusy(true);setError("");try {const result = await onRefresh();if (result && (result.error || result.ok === false)) throw new Error(result.error || "Unable to refresh your copies.");} catch (err) {setError(err.message);} finally {saveLock.current=false;setBusy(false);}}}>Refresh</button> : null}<button className={buttonClass} disabled={!canEdit || busy || !!form} onClick={openManual}>Add a copy</button></div>
    </div>
    {!storageReady || loading ? <p role="status" className="rounded border border-amber-700/50 bg-amber-950/30 p-3 text-sm text-amber-200">{loading ? "Loading your copy inventory…" : readOnlyReason || "Copy tracking is not ready yet. Your existing collection is still available."}</p> : null}
    <div className="flex flex-wrap gap-2 text-xs">
      <span className="rounded bg-slate-800 px-3 py-2 font-semibold">{activeCopies.length} counted copies</span>
      {Object.entries(CI.LOCATIONS).map(([key,name]) => <span key={key} className="rounded bg-slate-800 px-3 py-2">{name === "Unknown" ? "Unknown / unallocated" : name}: {locationCounts[key] || 0}</span>)}
    </div>
    {notice ? <p role="status" className="rounded border border-emerald-700 bg-emerald-950/50 p-3 text-sm text-emerald-200">{notice}</p> : null}
    {error ? <p role="alert" className="rounded border border-red-700 bg-red-950/50 p-3 text-sm text-red-200">{error}</p> : null}
    {form ? <form onSubmit={saveForm} aria-label={form.mode === "purchase" ? "Match purchase to copy" : form.mode === "manual" ? "Add physical copy" : "Edit physical copy"} className="space-y-4 rounded-lg border border-amber-700/60 bg-slate-900 p-4">
      <div className="flex items-center justify-between gap-3"><h3 className="font-bold text-amber-200">{form.mode === "purchase" ? "Match purchase to a copy" : form.mode === "manual" ? "Add a physical copy" : "Edit this copy"}</h3><button type="button" disabled={busy} onClick={() => {setForm(null);setError("");}} className="rounded border border-slate-600 px-3 py-1 text-sm">Cancel</button></div>
      {formObservation ? <div className="rounded bg-slate-800 p-3 text-sm"><p className="font-medium">{formObservation.title || "Imported purchase"}</p><p className="mt-1 text-slate-400">{formObservation.source} · {formObservation.purchaseDate || "Date not recorded"}{formObservation.reportedQuantity > 1 ? ` · ${formObservation.reportedQuantity} cards reported on this line` : ""}</p><p className="mt-2 text-xs text-slate-400">Importing this purchase has not increased your copy count. Match its card and serial before choosing an existing copy or adding another.</p></div> : null}
      {formObservation ? <><window.ObservationReferencePhotos observation={formObservation} cardById={cardById} publicMedia={media} onPreview={setPreview} onChooseCard={cardId=>setForm(previous=>({...previous,cardId,existingCopyId:""}))} /><window.CopyObservationEvidence observation={formObservation} cardById={cardById} showCandidates={false} /></> : null}
      {form.mode !== "edit" ? <div>
        <label className="block text-sm">Find the exact card<input className={controlClass + " mt-1"} value={cardQuery} onChange={e => setCardQuery(e.target.value)} placeholder="Year, product, number, or variant" /></label>
        {searchCards.length ? <div className="mt-1 max-h-48 overflow-auto rounded border border-slate-700">{searchCards.map(card => <button type="button" key={card.id} className="block w-full border-b border-slate-800 px-3 py-2 text-left text-xs hover:bg-slate-800" onClick={() => {setForm(previous => ({...previous,cardId:card.id,existingCopyId:""}));setCardQuery("");}}>{label(card)}{card.copies ? ` /${card.copies}` : ""}</button>)}</div> : cardQuery ? <p className="mt-1 text-xs text-slate-400">No matching cards. Add a missing card through Catalogue first.</p> : null}
      </div> : null}
      <p className="rounded bg-slate-800 px-3 py-2 text-sm">{label(selectedCard)}</p>
      {form.mode === "purchase" ? <div className="space-y-3">
        {formObservation.requiresQuantityReview && formObservation.reportedQuantity <= 1 ? <label className="flex items-start gap-2 rounded border border-amber-700 p-3 text-sm text-amber-200"><input type="checkbox" className="mt-1" checked={form.confirmSingleUnit} onChange={e => change("confirmSingleUnit",e.target.checked)} />The title may describe a lot. I checked the purchase and confirmed it contains exactly one physical card. Otherwise, split the lot below.</label> : null}
        <div className="rounded border border-slate-700 p-3"><label className="block text-sm">If this purchase is a lot, how many physical cards are included?<input type="number" min="2" max="1000" className={controlClass + " mt-1"} value={form.lotQuantity} onChange={e => change("lotQuantity",e.target.value)} placeholder="Leave blank for one card" /></label><button type="button" className="mt-2 rounded border border-amber-700 px-3 py-2 text-xs text-amber-200 disabled:opacity-40" disabled={!canEdit || busy || Number(form.lotQuantity) < 2} onClick={splitLot}>Create a review for each card</button><p className="mt-2 text-xs text-slate-400">Each card will get its own match. The lot price and serial will not be copied to every card.</p></div>
        <label className="block text-sm">Which physical copy is this?<select className={controlClass + " mt-1"} value={form.existingCopyId} onChange={e => {change("existingCopyId",e.target.value);change("confirmAdditional",false);}} disabled={!selectedCard}><option value="">Choose a copy</option>{formCopies.map(copy => <option key={copy.id} value={copy.id}>{copy.serial ? `Serial ${copy.serial}` : copy.legacyUnit ? `Existing copy ${copy.legacyUnit}` : "Existing copy"} · {locationLabel(copy)}{copy.unallocated ? ` · ${legacyLabel(copy)}` : ""}</option>)}<option value="__new__">Add an additional physical copy</option></select></label>
        {form.existingCopyId === "__new__" ? <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" checked={form.confirmAdditional} onChange={e => change("confirmAdditional",e.target.checked)} />I confirmed this copy is not already included in my existing count.</label> : null}
        {formObservation.priceVerified ? <span className="text-xs text-slate-400">Paid {formObservation.currency || "$"} {formObservation.paidPrice}</span> : null}
      </div> : <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Serial on this copy<input className={controlClass + " mt-1"} value={form.serial} onChange={e => change("serial",e.target.value)} placeholder="For example 07/25 or -3/0" /></label>
        {showMore && <label className="text-sm">Purchase date<input className={controlClass + " mt-1"} value={form.purchaseDate} onChange={e => change("purchaseDate",e.target.value)} placeholder="YYYY-MM-DD" /></label>}
        <label className="text-sm">Price paid<div className="mt-1 flex gap-1">
          <input className={controlClass + " flex-1 min-w-0"} inputMode="decimal" value={form.paidPrice} onChange={e => change("paidPrice",e.target.value)} placeholder="$" />
          <select aria-label="Currency" className="w-[70px] shrink-0 rounded border border-slate-600 bg-slate-900 px-1 py-1 text-xs" value={form.currency || ""}
            onChange={e => change("currency",e.target.value)}>
            <option value="">$</option><option value="CAD">CAD</option><option value="USD">USD</option><option value="GBP">GBP</option><option value="EUR">EUR</option><option value="AUD">AUD</option>
          </select>
        </div></label>
      </div>}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">Confirmed location<select className={controlClass + " mt-1"} value={form.location} onChange={e => change("location",e.target.value)}>{Object.entries(CI.LOCATIONS).map(([key,name]) => <option key={key} value={key}>{name}</option>)}</select></label>
        {form.mode !== "purchase" ? <label className="text-sm">Sale status<select className={controlClass + " mt-1"} value={form.saleStatus} onChange={e => change("saleStatus",e.target.value)}>{Object.entries(CI.SALE_STATUSES).map(([key,name]) => <option key={key} value={key}>{name}</option>)}</select></label> : null}
      </div>

      {form.mode === "edit" && selectedCard && form.copyId && CI.getCopiesForCard(state, selectedCard.id, statuses, cardDetails).some(c => c.id === form.copyId && c.origin === "purchase") && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.currentInventory === true} onChange={e => change("currentInventory",e.target.checked)} />Count this purchased copy in my collection</label>}
      <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" checked={form.duplicateConfirmed} onChange={e => change("duplicateConfirmed",e.target.checked)} />Extra copy / COMC sale review</label>
      <button type="button" onClick={() => setShowMore(!showMore)} className="text-left text-xs text-cyan-300 underline">{showMore ? "Less" : "More details"}</button>
      {showMore && form.mode !== "purchase" ? <><label className="block text-sm">Existing listing link<input className={controlClass + " mt-1"} value={form.listingUrl} onChange={e => change("listingUrl",e.target.value)} placeholder="https://…" /></label><label className="block text-sm">Copy notes<textarea className={controlClass + " mt-1"} rows="2" value={form.notes} onChange={e => change("notes",e.target.value)} /></label></> : null}
      {form.mode === "manual" ? <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" checked={form.confirmAdditional} onChange={e => change("confirmAdditional",e.target.checked)} />This is an additional physical copy, not one already included in my existing count.</label> : null}
      {showMore && form.mode !== "purchase" ? <window.CopyPhotoFields mode={mode} primaryJerseyNumber={primaryJerseyNumber} value={form} onChange={change} controlClass={controlClass} /> : null}
      <button type="submit" disabled={!canEdit || busy} className={buttonClass}>{busy ? "Saving…" : form.mode === "purchase" ? "Save copy match" : "Save copy"}</button>
    </form> : null}
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Copy inventory views"><button role="tab" aria-selected={view === "copies"} onClick={() => {setView("copies");setLimit(40);}} className={`rounded px-3 py-2 text-sm ${view === "copies" ? "bg-amber-400 text-slate-950 font-bold" : "bg-slate-800"}`}>Copies ({activeCopies.length})</button><button role="tab" aria-selected={view === "purchases"} onClick={() => {setView("purchases");setLimit(40);}} className={`rounded px-3 py-2 text-sm ${view === "purchases" ? "bg-amber-400 text-slate-950 font-bold" : "bg-slate-800"}`}>Purchase review ({pending.length})</button><button role="tab" aria-selected={view === "comc_duplicates"} onClick={() => {setView("comc_duplicates");setLimit(40);}} className={`rounded px-3 py-2 text-sm ${view === "comc_duplicates" ? "bg-amber-400 text-slate-950 font-bold" : "bg-slate-800"}`}>COMC duplicates ({duplicateGroups.length})</button></div>
    <div className="flex flex-wrap gap-2">
      <label className="min-w-48 flex-1 text-xs text-slate-400">Search<input className={controlClass + " mt-1"} value={query} onChange={e => {setQuery(e.target.value);setLimit(40);}} placeholder="Find a card, serial, or purchase" /></label>
      {view !== "comc_duplicates"?<label className="text-xs text-slate-400">Card category<window.ProofScopeSelect label="Copy and purchase card category" value={scope} onChange={value=>{setScope(value);setLimit(40);}} className={controlClass+" mt-1"}/></label>:null}
      {view === "purchases"?<label className="text-xs text-slate-400">Review focus<select aria-label="Purchase review focus" className={controlClass+" mt-1"} value={reviewFocus} onChange={event=>{setReviewFocus(event.target.value);setLimit(40);}}><option value="all">All pending ({scopedPurchases.length})</option>{Object.entries(TM.REVIEW_LABELS).filter(([key])=>key !== "copy_match").map(([key,name])=><option key={key} value={key}>{name} ({reviewCounts[key] || 0})</option>)}</select></label>:null}
      {view === "copies" ? <><label className="text-xs text-slate-400">Location<select className={controlClass + " mt-1"} value={locationFilter} onChange={e => {setLocationFilter(e.target.value);setLimit(40);}}><option value="all">All locations</option>{Object.entries(CI.LOCATIONS).map(([key,name]) => <option key={key} value={key}>{name}</option>)}</select></label><label className="text-xs text-slate-400">Duplicates and sales<select className={controlClass + " mt-1"} value={saleFilter} onChange={e => {setSaleFilter(e.target.value);setLimit(40);}}><option value="all">All copies</option><option value="extras">Confirmed extras</option><option value="review">COMC sale review</option><option value="listed">Already listed</option></select></label><label className="text-xs text-slate-400">Jersey matches<select aria-label="Copy jersey matches" className={controlClass + " mt-1"} value={jerseyFilter} onChange={e=>{setJerseyFilter(e.target.value);setLimit(40);}}><option value="all">All serials</option>{primaryJerseyNumber != null && <option value="primary">Primary jersey #{primaryJerseyNumber}</option>}<option value="secondary">Verified on-card jersey</option><option value="any">Any jersey match</option></select></label></> : null}
    </div>
    {view === "copies" ? <div className="space-y-2">
      {filteredCopies.slice(0,limit).map(({card,copy}) => <article key={copy.id} data-copy-id={copy.id} className="rounded-lg border border-slate-700 bg-slate-900 p-3">
        <div className="mb-3 flex items-start gap-3"><window.CardPhotoThumbnail compact photos={TM.photosForCopy(copy,card.id,media)} title={label(card)} onOpen={photos=>setPreview({photos,title:label(card)})} emptyLabel="Exact reference unavailable" emptyDetail={"#"+card.cardNumber} /><div className="space-y-2"><window.ProofClassificationBadge card={card}/><window.ProofReviewDetails card={card}/><div className="flex flex-wrap gap-1"><window.JerseyBadges primaryJerseyNumber={primaryJerseyNumber} record={copy} cardMedia={media.cards[card.id]} /></div>{copy.legacyUnit === 1 && copy.legacyDetails && copy.legacyDetails.serial ? <div><p className="text-xs text-slate-400">Legacy serial record: {copy.legacyDetails.serial} · awaiting allocation to individual copies</p><div className="mt-1 flex flex-wrap gap-1"><window.JerseyBadges primaryJerseyNumber={primaryJerseyNumber} legacySerial={copy.legacyDetails.serial} cardMedia={media.cards[card.id]} recorded /></div></div>:null}{copy.photos && copy.photos.length ? <p className="text-[10px] text-slate-400">{Array.from(new Set(TM.preferredPhotos(copy.photos).map(TM.photoSourceLabel))).join(" · ")}</p>:null}{TM.photosForCopy(copy,card.id,media).some(photo=>photo.kind === "reference")?<p className="text-[10px] text-slate-400">References do not establish this copy’s serial, condition, signature, or ownership.</p>:null}</div></div>
        <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium">{label(card)}</p><div className="mt-2 flex flex-wrap gap-2 text-xs"><span className="rounded bg-slate-700 px-2 py-1">{locationLabel(copy)}</span>{copy.unallocated ? <span className={`rounded px-2 py-1 ${copy.legacyStatus === "owned" || copy.legacyStatus === "for_sale" ? "bg-emerald-950 text-emerald-300" : "bg-blue-950 text-blue-300"}`}>{legacyLabel(copy)} · existing copy {copy.legacyUnit}</span> : null}{copy.serial ? <span className="rounded bg-slate-800 px-2 py-1">Serial {copy.serial}</span> : null}{copy.duplicateConfirmed ? <span className="rounded bg-violet-950 px-2 py-1 text-violet-300">Confirmed extra</span> : null}{CI.needsSaleReview(copy) ? <span className="rounded bg-amber-950 px-2 py-1 text-amber-300">Review for sale</span> : null}{copy.saleStatus === "listed" ? <span className="rounded bg-cyan-950 px-2 py-1 text-cyan-300">Already listed</span> : null}{copy.saleStatus === "sold" ? <span className="rounded bg-slate-700 px-2 py-1">Sold</span> : null}</div></div><button className="shrink-0 rounded border border-slate-600 px-3 py-1 text-xs disabled:opacity-40" disabled={!canEdit || busy || !!form} onClick={() => openCopy(card,copy)}>Edit copy</button></div>
        {copy.notes ? <p className="mt-2 whitespace-pre-wrap text-xs text-slate-400">{copy.notes}</p> : null}
        {copy.paidPrice !== "" && copy.paidPrice != null ? <p className="mt-2 text-xs text-slate-400">Paid {copy.currency} {copy.paidPrice}{copy.purchaseDate ? ` · ${copy.purchaseDate}` : ""}</p> : null}
        {copy.saleStatus === "listed" && copy.listingPrice != null && copy.listingPrice !== "" ? <p className="mt-2 text-xs text-cyan-300">Listed for {copy.listingCurrency || ""} {copy.listingPrice}{copy.listingCheckedAt ? ` · checked ${String(copy.listingCheckedAt).slice(0,10)}` : ""}</p> : null}
        {copy.listingUrl && /^https?:\/\//i.test(copy.listingUrl) ? <a className="mt-2 inline-block text-xs text-sky-300 underline" href={copy.listingUrl} target="_blank" rel="noreferrer">View existing listing</a> : null}
      </article>)}
      {!filteredCopies.length ? <p className="rounded border border-slate-700 p-5 text-sm text-slate-400">No copies match these filters.</p> : null}
      {filteredCopies.length > limit ? <button className="rounded border border-slate-600 px-4 py-2 text-sm" onClick={() => setLimit(limit+40)}>Show more copies ({filteredCopies.length-limit} remaining)</button> : null}
    </div> : view === "comc_duplicates" ? <window.ComcDuplicateReview mode={mode} primaryJerseyNumber={primaryJerseyNumber} inventory={state} cardById={cardById} publicMedia={media} query={query} canEdit={canEdit} busy={busy} onReview={openPurchase} onPreview={setPreview} onEdit={observation=>{const copy=CI.getCopiesForCard(state,observation.cardId,statuses,cardDetails).find(item=>item.id===observation.matchedCopyId);if(copy && cardById[observation.cardId])openCopy(cardById[observation.cardId],copy);else {setError("The linked copy is unavailable. Refresh before reviewing this record.");}}} /> : <div className="space-y-2">
      <p className="text-xs text-slate-400">{filteredPurchases.length} of {scopedPurchases.length} pending purchases in this category/search. Purchases waiting here are not added to the copy count. An entry can need more than one review; a second order can refer to a copy already recorded.</p>
      {filteredPurchases.slice(0,limit).map(observation => <article key={observation.id} data-observation-id={observation.id} className="space-y-3 rounded-lg border border-slate-700 bg-slate-900 p-3">
        <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium">{observation.title || label(cardById[observation.cardId])}</p><p className="mt-1 text-xs text-slate-400">{observation.source} · {observation.purchaseDate || "Date not recorded"}{observation.reportedQuantity > 1 ? ` · ${observation.reportedQuantity} cards on this line` : ""}</p>{window.CardCatalog.safeUrl(observation.sourceUrl)?<a className="mt-2 inline-block text-xs text-sky-300 underline" href={window.CardCatalog.safeUrl(observation.sourceUrl)} target="_blank" rel="noreferrer">View purchase listing</a>:null}</div><button className="shrink-0 rounded border border-amber-700 px-3 py-1 text-xs text-amber-200 disabled:opacity-40" disabled={!canEdit || busy || !!form} onClick={() => openPurchase(observation)}>Review purchase</button></div>
        <window.ObservationReferencePhotos observation={observation} cardById={cardById} publicMedia={media} onPreview={setPreview}/>
        <window.CopyObservationEvidence observation={observation} cardById={cardById} showCandidates={false}/>
        {(observation.isReturn || observation.sourceStatusReview) && <p className="text-xs text-amber-300">Source contains return, cancellation or status-review evidence{observation.lifecycleStatus?" · "+observation.lifecycleStatus:""}. {observation.sourceReviewedByOwner?"Acknowledged during scan review; confirm the actual copy before linking.":"Verify the source before linking a physical copy."}</p>}
        <div className="flex flex-wrap gap-1"><window.JerseyBadges primaryJerseyNumber={primaryJerseyNumber} record={observation} cardMedia={TM.reviewFlags(observation).identityConfirmed?media.cards[observation.cardId]:null}/></div>
      </article>)}
      {!filteredPurchases.length ? <p className="rounded border border-slate-700 p-5 text-sm text-slate-400">No pending purchases match these filters.</p> : null}
      {filteredPurchases.length > limit ? <button className="rounded border border-slate-600 px-4 py-2 text-sm" onClick={() => setLimit(limit+40)}>Show more purchases ({filteredPurchases.length-limit} remaining)</button> : null}
    </div>}
    {preview ? <window.CardPhotoViewer key={preview.title} photos={preview.photos} title={preview.title} onClose={()=>setPreview(null)} /> : null}
  </section>;
}
CopyInventoryPanel.hasPending=()=>Array.from(copyInventoryPendingEditors.values()).some(check=>check());
window.CopyInventoryPanel = CopyInventoryPanel;
