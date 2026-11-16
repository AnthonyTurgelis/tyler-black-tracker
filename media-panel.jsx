/* Shared photo previews and the image-led card gallery. */
function CardPhotoThumbnail({photos = [], title = "Card photo", onOpen, compact = false}) {
  const TM = window.TrackerMedia;
  const ordered = React.useMemo(() => TM.preferredPhotos(photos), [photos]);
  const [failed, setFailed] = React.useState({});
  const signature = ordered.map(photo => photo.url).join("|");
  React.useEffect(() => setFailed({}), [signature]);
  const photo = ordered.find(item => !failed[item.url]);
  const content = <>
    {photo ? <img src={photo.url} alt={title + " — " + photo.side} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(previous => ({...previous, [photo.url]: true}))} className="h-full w-full object-contain p-2" /> : <span className="flex h-full min-h-20 items-center justify-center px-3 text-center text-xs text-slate-500">{ordered.length ? "Image unavailable" : "No photo yet"}</span>}
    {photo && !compact ? <span className="absolute bottom-2 left-2 rounded border border-slate-600 bg-slate-950/90 px-2 py-1 text-[10px] text-slate-200">{TM.KINDS[photo.kind]}</span> : null}
    {photo && compact ? <span className="absolute bottom-0 inset-x-0 bg-slate-950/90 px-1 py-1 text-center text-[8px] text-slate-300">{TM.KINDS[photo.kind]}</span> : null}
  </>;
  const className = "relative block shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-950 " + (compact ? "h-24 w-20" : "w-full aspect-[5/7]");
  return onOpen && ordered.length ? <button type="button" className={className + " transition-colors hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"} onClick={() => onOpen(ordered)} aria-label={"Open photos: " + title}>{content}</button> : <div className={className}>{content}</div>;
}

function CardPhotoViewer({photos = [], title = "Card photos", onClose}) {
  const TM = window.TrackerMedia;
  const ordered = React.useMemo(() => TM.preferredPhotos(photos), [photos]);
  const [index, setIndex] = React.useState(0);
  const [failed, setFailed] = React.useState({});
  const dialogRef = React.useRef(null);
  const photo = ordered[Math.min(index, ordered.length - 1)];
  React.useEffect(() => {
    const previous = document.activeElement;
    const close = dialogRef.current && dialogRef.current.querySelector("button");
    if (close) close.focus();
    function keyboard(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setIndex(value => Math.min(ordered.length - 1, value + 1));
      if (event.key === "ArrowLeft") setIndex(value => Math.max(0, value - 1));
      if (event.key === "Tab" && dialogRef.current) {
        const buttons = Array.from(dialogRef.current.querySelectorAll("button:not([disabled]), a[href]"));
        if (!buttons.length) return;
        if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons[buttons.length - 1].focus(); }
        else if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) { event.preventDefault(); buttons[0].focus(); }
      }
    }
    window.addEventListener("keydown", keyboard);
    return () => { window.removeEventListener("keydown", keyboard); if (previous && previous.isConnected) previous.focus(); };
  }, [onClose, ordered.length]);
  if (!photo) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3" onClick={event => {if (event.target === event.currentTarget) onClose();}}>
    <section ref={dialogRef} role="dialog" aria-modal="true" aria-label={title} className="flex max-h-[95vh] w-full max-w-4xl flex-col rounded-xl border border-slate-600 bg-slate-900 p-4 shadow-2xl">
      <header className="mb-3 flex items-start justify-between gap-3"><div><h2 className="text-base font-bold text-amber-300">{title}</h2><p className="mt-1 text-xs text-slate-400">{TM.KINDS[photo.kind]} · {photo.side === "back" ? "Back" : "Front"}{photo.caption ? " · " + photo.caption : ""}</p></div><button type="button" onClick={onClose} aria-label="Close photo preview" className="shrink-0 rounded border border-slate-600 px-3 py-1 text-sm text-slate-200 hover:bg-slate-800">Close</button></header>
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg bg-slate-950" style={{minHeight:"240px"}}>
        {!failed[photo.url] ? <img key={photo.url} src={photo.url} alt={title + " — " + photo.side + " — " + TM.KINDS[photo.kind]} referrerPolicy="no-referrer" onError={() => setFailed(previous => ({...previous, [photo.url]: true}))} className="max-h-[65vh] w-full object-contain" /> : <p role="status" className="px-5 py-20 text-center text-sm text-slate-400">This image could not load. Choose another photo or open its source.</p>}
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Front and back photos">
        {ordered.map((item, position) => <button type="button" key={item.url} onClick={() => setIndex(position)} aria-pressed={position === index} className={"shrink-0 rounded border px-3 py-2 text-xs " + (position === index ? "border-amber-400 bg-amber-400 text-slate-950" : "border-slate-600 text-slate-300 hover:border-slate-400")}>{item.side === "back" ? "Back" : "Front"} · {TM.KINDS[item.kind]}{ordered.length > 2 ? " " + (position + 1) : ""}</button>)}
      </div>
      <footer className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-slate-400"><span>{index + 1} of {ordered.length} photos{!ordered.some(item => item.side === "back") ? " · Back photo not recorded" : ""}</span><a href={photo.sourceUrl || photo.url} target="_blank" rel="noreferrer" className="text-sky-300 underline">Open photo source</a></footer>
    </section>
  </div>;
}

function JerseyBadges({record, legacySerial = "", recorded = false, cardMedia}) {
  const match = window.TrackerMedia.jerseyMatches(record, legacySerial, cardMedia);
  return <>
    {match.primary ? <span className="rounded border border-amber-500/60 bg-amber-400/15 px-2 py-1 text-[10px] font-bold text-amber-200" title="Recorded serial numerator matches primary jersey number 7">{recorded ? "Recorded jersey #7" : "Jersey #7"}</span> : null}
    {match.secondary ? <span className="rounded border border-violet-500/60 bg-violet-400/15 px-2 py-1 text-[10px] font-bold text-violet-200" title="Recorded serial matches another jersey number explicitly verified on this card">On-card jersey #{match.secondaryNumber}</span> : null}
  </>;
}

function CopyPhotoFields({value, onChange, controlClass}) {
  const TM = window.TrackerMedia;
  const photos = value.photos || [];
  const evidence = value.secondaryJerseyEvidence || {};
  function changePhoto(index, patch) { onChange("photos", photos.map((photo, i) => i === index ? {...photo,...patch} : photo)); }
  function changeEvidence(patch) { onChange("secondaryJerseyEvidence", {...evidence,...patch}); }
  return <div className="space-y-4 border-t border-slate-700 pt-4">
    <div><div className="flex items-center justify-between gap-2"><h4 className="font-semibold text-amber-200">Photos of this copy</h4><button type="button" className="rounded border border-slate-600 px-3 py-1 text-xs" onClick={()=>onChange("photos",photos.concat({id:"manual-photo:"+Date.now()+":"+photos.length,url:"",side:"front",kind:"reference",sourceUrl:"",caption:""}))}>Add photo URL</button></div><p className="mt-1 text-xs text-slate-400">Paste a direct HTTPS image link. Label your own photos, a scan of this exact copy, or a reference. Your photo links stay with this private copy.</p></div>
    {photos.map((photo,index)=><fieldset key={photo.id || index} className="space-y-2 rounded border border-slate-700 p-3"><legend className="px-1 text-xs text-slate-400">Photo {index+1}</legend><label className="block text-xs">Image URL<input aria-label={"Photo "+(index+1)+" image URL"} className={controlClass+" mt-1"} value={photo.url || ""} onChange={event=>changePhoto(index,{url:event.target.value})} placeholder="https://…/front.jpg" /></label><div className="grid gap-2 sm:grid-cols-2"><label className="text-xs">Side<select aria-label={"Photo "+(index+1)+" side"} className={controlClass+" mt-1"} value={photo.side} onChange={event=>changePhoto(index,{side:event.target.value})}><option value="front">Front</option><option value="back">Back</option></select></label><label className="text-xs">Photo source<select aria-label={"Photo "+(index+1)+" source"} className={controlClass+" mt-1"} value={photo.kind} onChange={event=>changePhoto(index,{kind:event.target.value})}>{Object.entries(TM.KINDS).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label></div><label className="block text-xs">Source page (optional)<input aria-label={"Photo "+(index+1)+" source URL"} className={controlClass+" mt-1"} value={photo.sourceUrl || ""} onChange={event=>changePhoto(index,{sourceUrl:event.target.value})} placeholder="https://…" /></label><label className="block text-xs">Caption (optional)<input aria-label={"Photo "+(index+1)+" caption"} className={controlClass+" mt-1"} value={photo.caption || ""} onChange={event=>changePhoto(index,{caption:event.target.value})} /></label><button type="button" className="text-xs text-red-300 underline" onClick={()=>onChange("photos",photos.filter((_,i)=>i!==index))}>Remove photo {index+1}</button></fieldset>)}
    <fieldset className="space-y-3 rounded border border-violet-800/60 p-3"><legend className="px-1 text-sm font-semibold text-violet-200">Jersey matches</legend><p className="text-xs text-slate-400">Serial 7 is the primary match for every card. Add another jersey number only when it is visible on the uniform pictured on this exact card.</p><label className="block text-xs">Other jersey number shown<input aria-label="Other jersey number shown" className={controlClass+" mt-1"} inputMode="numeric" maxLength={3} value={value.secondaryJerseyNumber || ""} onChange={event=>{onChange("secondaryJerseyNumber",event.target.value);changeEvidence({confirmed:false});}} placeholder="Leave blank unless evidenced on the card" /></label>{value.secondaryJerseyNumber ? <><label className="block text-xs">Photo showing the jersey<select aria-label="Jersey evidence photo" className={controlClass+" mt-1"} value={evidence.photoId || ""} onChange={event=>changeEvidence({photoId:event.target.value,confirmed:false})}><option value="">Use an evidence link below</option>{photos.filter(photo=>TM.safeImageUrl(photo.url)).map((photo,index)=><option key={photo.id} value={photo.id}>Photo {index+1} · {photo.side} · {TM.KINDS[photo.kind]}</option>)}</select></label><label className="block text-xs">Evidence link<input aria-label="Jersey evidence URL" className={controlClass+" mt-1"} value={evidence.sourceUrl || ""} onChange={event=>changeEvidence({sourceUrl:event.target.value,confirmed:false})} placeholder="https://…" /></label><label className="block text-xs">What is visible?<input aria-label="Jersey evidence note" className={controlClass+" mt-1"} value={evidence.note || ""} onChange={event=>changeEvidence({note:event.target.value})} placeholder="For example: 17 visible on the front uniform" /></label><label className="flex items-start gap-2 text-xs"><input type="checkbox" aria-label="Confirmed jersey number on this card" checked={evidence.confirmed === true} onChange={event=>changeEvidence({confirmed:event.target.checked})} />I verified this number on the depicted uniform in this card's photo.</label></>:null}</fieldset>
  </div>;
}

function CopyObservationEvidence({observation, cardById = {}, onChooseCard}) {
  const candidates = (observation.candidateCardIds || []).map(id=>cardById[id]).filter(Boolean);
  const serialLabel = observation.imageVerified === true ? "Image-verified serial" : observation.serialEvidence === "comc_inventory" ? "COMC inventory serial" : "Recorded serial";
  return <div className="mt-2 space-y-2 text-xs">
    {observation.serial?<p className="text-slate-300">{serialLabel}: {observation.serial}{observation.printRun && !String(observation.serial).includes("/") ? " / "+observation.printRun : ""}</p>:null}
    {observation.reviewReason?<p className="rounded border border-amber-800/60 bg-amber-950/30 px-2 py-1 text-amber-200">{observation.reviewReason}</p>:null}
    {observation.notes?<p className="whitespace-pre-wrap text-slate-400">{String(observation.notes)}</p>:null}
    {candidates.length?<div className="space-y-1"><p className="text-slate-400">Catalogue candidates to check:</p>{candidates.slice(0,8).map(card=><div key={card.id}>{onChooseCard?<button type="button" onClick={()=>onChooseCard(card.id)} className="text-left text-sky-300 underline">{card.product} · #{card.cardNumber} · {card.cardSet || "Base"}{card.copies?" /"+card.copies:""}</button>:<span className="text-slate-300">{card.product} · #{card.cardNumber} · {card.cardSet || "Base"}{card.copies?" /"+card.copies:""}</span>}</div>)}</div>:null}
  </div>;
}

function ComcDuplicateReview({inventory, cardById, publicMedia, query = "", canEdit, busy, onReview, onEdit, onPreview}) {
  const TM = window.TrackerMedia;
  const groups = TM.comcDuplicateGroups(inventory).filter(group=> {
    const card=cardById[group.cardId] || {};
    return !query || [card.product,card.cardNumber,card.cardSet,...group.observations.map(o=>[o.title,o.serial,o.sourceItemId].join(" "))].join(" ").toLowerCase().includes(query.toLowerCase());
  });
  const money = observation => window.TrackerMarket.formatMoney(observation.askingPrice == null ? observation.listedPrice : observation.askingPrice,observation.currency);
  return <div className="space-y-4"><p className="text-xs text-slate-400">These groups come from confirmed current COMC inventory. A record awaiting a match is shown here without becoming another counted copy. Choose your keeper, then review the other copies for sale.</p>{groups.map(group=>{
    const card=cardById[group.cardId],title=card ? card.product+" · #"+card.cardNumber+" · "+(card.cardSet || "Base") : "Catalogue card "+group.cardId;
    return <section key={group.cardId} data-comc-duplicate-card-id={group.cardId} className="overflow-hidden rounded-lg border border-amber-800/60 bg-slate-900"><header className="space-y-1 border-b border-slate-700 bg-amber-950/20 p-3"><h3 className="text-sm font-semibold text-amber-200">{title}</h3><p className="text-sm font-bold text-amber-300">At least {group.minimumExtras} extra at COMC—choose keeper</p><p className="text-xs text-slate-400">{group.count} confirmed copies at COMC · {group.observations.length} inventory records shown</p></header><div className="divide-y divide-slate-800">{group.observations.map(observation=><article key={observation.id} className="p-3"><div className="flex items-start gap-3"><CardPhotoThumbnail photos={observation.photos} compact title={title+(observation.serial?" · Serial "+observation.serial:"")} onOpen={photos=>onPreview({photos,title})} /><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2 text-xs"><span className={"rounded px-2 py-1 "+(observation.saleState==="listed"?"bg-cyan-950 text-cyan-300":"bg-slate-800 text-slate-300")}>{observation.saleState==="listed"?"Already listed":observation.saleState==="not_for_sale"?"Not for sale":"Listing status unknown"}</span><span className="rounded bg-slate-800 px-2 py-1 text-slate-400">{observation.matchedCopyId?"Linked to counted copy":"Awaiting copy match"}</span><JerseyBadges record={observation} cardMedia={publicMedia && publicMedia.cards && publicMedia.cards[group.cardId]} /></div><p className="mt-2 text-xs text-slate-400">COMC item {observation.sourceItemId || observation.id}</p>{observation.saleState==="listed" && (observation.askingPrice != null || observation.listedPrice != null)?<p className="mt-1 text-xs text-cyan-300">Asking {money(observation)}</p>:null}<CopyObservationEvidence observation={observation} cardById={cardById} />{TM.safeImageUrl(observation.sourceUrl)?<a href={TM.safeImageUrl(observation.sourceUrl)} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-sky-300 underline">View COMC item</a>:null}<div className="mt-2"><button className="rounded border border-slate-600 px-3 py-1 text-xs disabled:opacity-40" disabled={!canEdit || busy} onClick={()=>observation.matchedCopyId?onEdit(observation):onReview(observation)}>{observation.matchedCopyId?"Review linked copy":"Match this copy"}</button></div></div></div></article>)}</div></section>;
  })}{!groups.length?<p className="rounded border border-slate-700 p-5 text-sm text-slate-400">No confirmed COMC duplicate groups match this view.</p>:null}</div>;
}

function CardGalleryPanel({cards = [], statuses = {}, cardDetails = {}, inventory, publicMedia, isOwner = false, onOpenCopies, onRefresh, loading = false, loadError = ""}) {
  const TM = window.TrackerMedia, CI = window.CopyInventory;
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sourceFilter, setSourceFilter] = React.useState("all");
  const [jerseyFilter, setJerseyFilter] = React.useState("all");
  const [includeMissing, setIncludeMissing] = React.useState(false);
  const [limit, setLimit] = React.useState(48);
  const [preview, setPreview] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState("");
  const media = React.useMemo(() => TM.normalizePublicMedia(publicMedia), [publicMedia]);
  const state = React.useMemo(() => CI.normalizeState(isOwner ? inventory : null), [inventory, isOwner]);
  const entries = React.useMemo(() => {
    const observationsByCard = {};
    if (isOwner) Object.values(state.observations).forEach(observation => { if (observation.cardId && !["ignored","split"].includes(observation.disposition)) { if (!observationsByCard[observation.cardId]) observationsByCard[observation.cardId] = []; observationsByCard[observation.cardId].push(observation); } });
    return cards.filter(card => card.id !== 1 && !card.archived && !card.hiddenDuplicate).map(card => {
      const copies = isOwner ? CI.getCopiesForCard(state, card.id, statuses, cardDetails).filter(copy => copy.saleStatus !== "sold") : [];
      const observations = observationsByCard[card.id] || [];
      const records = copies.concat(observations);
      let photos = [];
      records.forEach(record => {
        const context = record.serial ? "Serial " + record.serial : record.location && CI.LOCATIONS[record.location] || "";
        const labelled = TM.normalizePhotos(record.photos).map(photo => ({...photo, caption:[photo.caption, context, record.source && !record.matchedCopyId ? "Purchase awaiting copy match" : ""].filter(Boolean).join(" · ")}));
        photos = TM.mergePhotos(photos, labelled);
      });
      photos = TM.mergePhotos(photos, (media.cards[card.id] || {}).photos);
      const legacy = TM.jerseyMatches({}, (cardDetails[card.id] || {}).serial, media.cards[card.id]);
      const matches = records.map(record => TM.jerseyMatches(record, "", media.cards[card.id]));
      const primary = legacy.primary || matches.some(match => match.primary);
      const secondary = Array.from(new Set([legacy].concat(matches).filter(match => match.secondary).map(match => match.secondaryNumber)));
      return { card, photos, summary:CI.summarizeCard(state, card.id, statuses, cardDetails), primary, secondary,
        pending:observations.filter(observation => !observation.matchedCopyId && !["ignored","split"].includes(observation.disposition)).length,
        text:[card.product, card.cardNumber, card.cardSet, (cardDetails[card.id] || {}).serial, ...records.map(record => record.serial || "")].join(" ").toLowerCase() };
    });
  }, [cards, state, media, isOwner, statuses, cardDetails]);
  const filtered = entries.filter(entry => {
    if (query && !entry.text.includes(query.toLowerCase())) return false;
    if (!CI.matchesStatus(entry.summary, statusFilter)) return false;
    if (jerseyFilter === "primary" && !entry.primary || jerseyFilter === "secondary" && !entry.secondary.length || jerseyFilter === "any" && !entry.primary && !entry.secondary.length) return false;
    if (sourceFilter !== "all" && !entry.photos.some(photo => photo.kind === sourceFilter)) return false;
    return includeMissing || entry.photos.length > 0;
  });
  React.useEffect(() => setLimit(48), [query, statusFilter, sourceFilter, jerseyFilter, includeMissing]);
  const control = "rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200";
  return <section className="space-y-4 text-slate-100">
    <header className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-2xl font-bold text-amber-300">Card gallery</h2><p className="mt-1 max-w-3xl text-sm text-slate-400">Your own photos appear first, followed by scans of your copies and labelled references. Open a card for its front and back.</p></div>{onRefresh ? <button className={control + " disabled:opacity-40"} disabled={loading || refreshing} onClick={async()=>{setRefreshing(true);setError("");try {const result=await onRefresh();if(result && result.ok===false)throw Error(result.error || "Photos could not be refreshed.");}catch(err){setError(err.message);}finally{setRefreshing(false);}}}>{refreshing || loading ? "Refreshing…" : "Refresh photos"}</button> : null}</header>
    <div className="flex flex-wrap gap-2"><input aria-label="Search gallery" className={control + " min-w-52 flex-1"} placeholder="Search product, variant, card number or serial" value={query} onChange={event=>setQuery(event.target.value)} /><select aria-label="Gallery ownership" className={control} value={statusFilter} onChange={event=>setStatusFilter(event.target.value)}><option value="all">All statuses</option><option value="owned">Owned / in hand</option><option value="in_transit">In transit / awaiting receipt</option><option value="acquired">All acquired</option><option value="not_owned">Needed</option></select><select aria-label="Gallery photo source" className={control} value={sourceFilter} onChange={event=>setSourceFilter(event.target.value)}><option value="all">All photo sources</option>{Object.entries(TM.KINDS).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select><select aria-label="Gallery jersey matches" className={control} value={jerseyFilter} onChange={event=>setJerseyFilter(event.target.value)}><option value="all">All serials</option><option value="primary">Primary jersey #7</option><option value="secondary">Verified on-card jersey</option><option value="any">Any jersey match</option></select></div>
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400"><span>{filtered.length} card{filtered.length===1 ? "" : "s"} · {entries.filter(entry=>entry.photos.length).length} have photos</span><label className="flex items-center gap-2"><input type="checkbox" checked={includeMissing} onChange={event=>setIncludeMissing(event.target.checked)} />Include cards without photos</label></div>
    {error || loadError ? <p role="alert" className="rounded border border-red-800 bg-red-950/40 p-3 text-sm text-red-200">{error || loadError}</p> : null}
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {filtered.slice(0,limit).map(entry=>{
        const card=entry.card, title=card.product+" · #"+card.cardNumber+" · "+(card.cardSet||"Base");
        const photos=sourceFilter === "all" ? entry.photos : entry.photos.filter(photo=>photo.kind===sourceFilter);
        return <article key={card.id} data-gallery-card-id={card.id} className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-lg">
          <CardPhotoThumbnail photos={photos} title={title} onOpen={items=>setPreview({photos:items,title})} />
          <div className="space-y-2 p-3"><p className="text-[10px] uppercase tracking-wide text-slate-400">{card.product}</p><h3 className="text-sm font-semibold text-white">#{card.cardNumber} · {card.cardSet||"Base"}</h3><div className="flex flex-wrap gap-1 text-[10px]">{entry.summary.owned?<span className="rounded bg-green-950 px-2 py-1 text-green-300">Owned</span>:null}{entry.summary.inTransit?<span className="rounded bg-cyan-950 px-2 py-1 text-cyan-300">Awaiting receipt</span>:null}{entry.summary.notOwned?<span className="rounded bg-slate-800 px-2 py-1 text-slate-400">Needed</span>:null}{card.copies?<span className="rounded bg-slate-800 px-2 py-1 text-amber-300">/{card.copies}</span>:null}</div>
            {entry.primary || entry.secondary.length ? <div className="flex flex-wrap gap-1">{entry.primary?<span className="rounded border border-amber-600 bg-amber-950/50 px-2 py-1 text-[10px] font-bold text-amber-200" title="A recorded serial for this card is 7; the displayed photo may be a reference">Recorded jersey #7</span>:null}{entry.secondary.map(number=><span key={number} className="rounded border border-violet-700 bg-violet-950/40 px-2 py-1 text-[10px] text-violet-200">On-card jersey #{number}</span>)}</div>:null}
            {isOwner?<div className="flex flex-wrap items-center justify-between gap-1 border-t border-slate-800 pt-2 text-[10px] text-slate-400"><span>{entry.summary.total} counted{entry.pending ? " · "+entry.pending+" awaiting match" : ""}</span>{onOpenCopies?<button onClick={()=>onOpenCopies(card.id)} className="font-semibold text-sky-300 underline">Copies &amp; photos</button>:null}</div>:null}
          </div>
        </article>;
      })}
    </div>
    {!filtered.length?<p className="rounded-lg border border-slate-700 p-8 text-center text-sm text-slate-400">No cards match this view. {isOwner ? "Add photo URLs to a physical copy in Copies, or include cards without photos." : "Try another filter or include cards without photos."}</p>:null}
    {filtered.length>limit?<button className={control} onClick={()=>setLimit(value=>value+48)}>Show more cards ({filtered.length-limit} remaining)</button>:null}
    {preview?<CardPhotoViewer key={preview.title} photos={preview.photos} title={preview.title} onClose={()=>setPreview(null)} />:null}
  </section>;
}
window.CardPhotoThumbnail = CardPhotoThumbnail;
window.CardPhotoViewer = CardPhotoViewer;
window.JerseyBadges = JerseyBadges;
window.CopyPhotoFields = CopyPhotoFields;
window.CopyObservationEvidence = CopyObservationEvidence;
window.ComcDuplicateReview = ComcDuplicateReview;
window.CardGalleryPanel = CardGalleryPanel;
