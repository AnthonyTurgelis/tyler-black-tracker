/* Shared photo previews and the image-led card gallery. */
function mediaCardSubject(card) {
  if (!card) return "";
  if (window.CollectionProfile) return window.CollectionProfile.subject(card,window.TEMPO_ROSTER || {});
  return String(card.subject || card.playerName || window.TEMPO_ROSTER?.[card.player]?.name || card.player || "");
}
function mediaCardProduct(card) {
  const product=String(card?.product || ""),year=String(card?.year || "");
  return year && !product.startsWith(year) ? year+" "+product : product;
}
function mediaCardLabel(card) {
  return card ? [mediaCardSubject(card),mediaCardProduct(card),"#"+card.cardNumber,card.cardSet || "Base"].filter(Boolean).join(" · ") : "Choose a card";
}
function CardPhotoThumbnail({photos = [], title = "Card photo", onOpen, compact = false, emptyLabel = "No photo yet", emptyDetail = ""}) {
  const TM = window.TrackerMedia;
  const ordered = React.useMemo(() => TM.preferredPhotos(photos), [photos]);
  const [failed, setFailed] = React.useState({});
  const [thumbnailFailed, setThumbnailFailed] = React.useState({});
  const signature = ordered.map(photo => photo.url).join("|");
  React.useEffect(() => { setFailed({}); setThumbnailFailed({}); }, [signature]);
  const photo = ordered.find(item => !failed[item.url]);
  const thumbnail = photo ? (thumbnailFailed[photo.url] ? photo.url : TM.thumbnailUrl(photo)) : "";
  function onThumbnailError() {
    if (!photo) return;
    if (thumbnail !== photo.url) {
      setThumbnailFailed(previous => ({...previous, [photo.url]: true}));
    } else {
      setFailed(previous => ({...previous, [photo.url]: true}));
    }
  }
  const content = <>
    {photo ? <img src={thumbnail} alt={title + " — " + photo.side + " — " + TM.photoSourceLabel(photo)} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={onThumbnailError} className="h-full w-full object-contain p-2" /> : <span className="flex h-full min-h-20 flex-col items-center justify-center gap-2 px-2 py-3 text-center"><span className="rounded border border-slate-700 px-2 py-1 text-[10px] font-semibold text-slate-400">{ordered.length ? "Image unavailable" : emptyLabel}</span>{emptyDetail?<span className="text-[9px] leading-snug text-slate-500">{emptyDetail}</span>:null}</span>}
    {photo && !compact ? <span className="absolute bottom-2 left-2 rounded border border-slate-600 bg-slate-950/90 px-2 py-1 text-[10px] text-slate-200">{TM.photoSourceLabel(photo)}</span> : null}
    {photo && compact ? <span className="absolute bottom-0 inset-x-0 bg-slate-950/90 px-1 py-1 text-center text-[8px] text-slate-300">{TM.photoSourceLabel(photo)}</span> : null}
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
      <header className="mb-3 flex items-start justify-between gap-3"><div><h2 className="text-base font-bold text-amber-300">{title}</h2><p className="mt-1 text-xs text-slate-400">{TM.photoSourceLabel(photo)} · {photo.side === "back" ? "Back" : "Front"}{photo.caption ? " · " + photo.caption : ""}</p></div><button type="button" onClick={onClose} aria-label="Close photo preview" className="shrink-0 rounded border border-slate-600 px-3 py-1 text-sm text-slate-200 hover:bg-slate-800">Close</button></header>
      {photo.kind === "reference" ? <p className="mb-3 rounded border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300">Reference image only. It does not confirm your copy’s serial, condition, signature, or ownership.</p> : photo.context === "purchase_source" ? <p className="mb-3 rounded border border-amber-900/60 bg-amber-950/20 px-3 py-2 text-xs text-amber-200">Purchase source photo. Catalogue identity and retained-copy status must be reviewed separately.</p> : null}
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg bg-slate-950" style={{minHeight:"240px"}}>
        {!failed[photo.url] ? <img key={photo.url} src={photo.url} alt={title + " — " + photo.side + " — " + TM.photoSourceLabel(photo)} referrerPolicy="no-referrer" onError={() => setFailed(previous => ({...previous, [photo.url]: true}))} className="max-h-[65vh] w-full object-contain" /> : <p role="status" className="px-5 py-20 text-center text-sm text-slate-400">This image could not load. Choose another photo or open its source.</p>}
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Front and back photos">
        {ordered.map((item, position) => <button type="button" key={item.url} onClick={() => setIndex(position)} aria-pressed={position === index} className={"shrink-0 rounded border px-3 py-2 text-xs " + (position === index ? "border-amber-400 bg-amber-400 text-slate-950" : "border-slate-600 text-slate-300 hover:border-slate-400")}>{item.side === "back" ? "Back" : "Front"} · {TM.photoSourceLabel(item)}{ordered.length > 2 ? " " + (position + 1) : ""}</button>)}
      </div>
      <footer className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-slate-400"><span>{index + 1} of {ordered.length} photos{!ordered.some(item => item.side === "back") ? " · Back photo not recorded" : ""}</span><a href={photo.sourceUrl || photo.url} target="_blank" rel="noreferrer" className="text-sky-300 underline">Open photo source</a></footer>
    </section>
  </div>;
}

function JerseyBadges({record, legacySerial = "", recorded = false, cardMedia, mode, primaryJerseyNumber}) {
  const primary = window.TrackerMedia.primaryJerseyNumber(mode || window.MODE,primaryJerseyNumber);
  const match = window.TrackerMedia.jerseyMatches(record, legacySerial, cardMedia, primary);
  return <>
    {match.primary ? <span className="rounded border border-amber-500/60 bg-amber-400/15 px-2 py-1 text-[10px] font-bold text-amber-200" title={"Recorded serial numerator matches primary jersey number "+primary}>{recorded ? "Recorded jersey #"+primary : "Jersey #"+primary}</span> : null}
    {match.secondary ? <span className="rounded border border-violet-500/60 bg-violet-400/15 px-2 py-1 text-[10px] font-bold text-violet-200" title="Recorded serial matches another jersey number explicitly verified on this card">On-card jersey #{match.secondaryNumber}</span> : null}
  </>;
}

function CopyPhotoFields({value, onChange, controlClass, mode, primaryJerseyNumber, referenceOnly = false}) {
  const TM = window.TrackerMedia;
  const primary = TM.primaryJerseyNumber(mode || window.MODE,primaryJerseyNumber);
  const photos = value.photos || [];
  const evidence = value.secondaryJerseyEvidence || {};
  function changePhoto(index, patch) { onChange("photos", photos.map((photo, i) => i === index ? {...photo,...patch} : photo)); }
  function changeEvidence(patch) { onChange("secondaryJerseyEvidence", {...evidence,...patch}); }
  return <div className="space-y-4 border-t border-slate-700 pt-4">
    <div><div className="flex items-center justify-between gap-2"><h4 className="font-semibold text-amber-200">{referenceOnly ? "Card references" : "Photos of this copy"}</h4><button type="button" className="rounded border border-slate-600 px-3 py-1 text-xs" onClick={()=>onChange("photos",photos.concat({id:"manual-photo:"+Date.now()+":"+photos.length,url:"",side:"front",kind:"reference",sourceUrl:"",caption:""}))}>{referenceOnly ? "Add reference URL" : "Add photo URL"}</button></div><p className="mt-1 text-xs text-slate-400">{referenceOnly ? "Save direct HTTPS front and back references for this exact catalog card. References do not claim ownership or show which physical copy you hold." : "Paste a direct HTTPS image link. Label your own photos, a scan of this exact copy, or a reference. Your photo links stay with this private copy."}</p></div>
    {photos.map((photo,index)=><fieldset key={photo.id || index} className="space-y-2 rounded border border-slate-700 p-3"><legend className="px-1 text-xs text-slate-400">Photo {index+1}</legend><label className="block text-xs">Image URL<input aria-label={"Photo "+(index+1)+" image URL"} className={controlClass+" mt-1"} value={photo.url || ""} onChange={event=>changePhoto(index,{url:event.target.value})} placeholder="https://…/front.jpg" /></label><div className="grid gap-2 sm:grid-cols-2"><label className="text-xs">Side<select aria-label={"Photo "+(index+1)+" side"} className={controlClass+" mt-1"} value={photo.side} onChange={event=>changePhoto(index,{side:event.target.value})}><option value="front">Front</option><option value="back">Back</option></select></label><label className="text-xs">Photo source<select aria-label={"Photo "+(index+1)+" source"} className={controlClass+" mt-1"} value={referenceOnly ? "reference" : photo.kind} disabled={referenceOnly} onChange={event=>changePhoto(index,{kind:event.target.value})}>{Object.entries(referenceOnly ? {reference:TM.KINDS.reference} : TM.KINDS).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label></div><label className="block text-xs">Source page (optional)<input aria-label={"Photo "+(index+1)+" source URL"} className={controlClass+" mt-1"} value={photo.sourceUrl || ""} onChange={event=>changePhoto(index,{sourceUrl:event.target.value})} placeholder="https://…" /></label><label className="block text-xs">Caption (optional)<input aria-label={"Photo "+(index+1)+" caption"} className={controlClass+" mt-1"} value={photo.caption || ""} onChange={event=>changePhoto(index,{caption:event.target.value})} /></label><button type="button" className="text-xs text-red-300 underline" onClick={()=>onChange("photos",photos.filter((_,i)=>i!==index))}>Remove photo {index+1}</button></fieldset>)}
    <fieldset className="space-y-3 rounded border border-violet-800/60 p-3"><legend className="px-1 text-sm font-semibold text-violet-200">Jersey matches</legend><p className="text-xs text-slate-400">{primary == null ? "Record a jersey number only when it is visible on the uniform pictured on this exact card." : "Serial "+primary+" is the primary jersey match. Add another jersey number only when it is visible on this exact card."}</p><label className="block text-xs">Other jersey number shown<input aria-label="Other jersey number shown" className={controlClass+" mt-1"} inputMode="numeric" maxLength={3} value={value.secondaryJerseyNumber || ""} onChange={event=>{onChange("secondaryJerseyNumber",event.target.value);changeEvidence({confirmed:false});}} placeholder="Leave blank unless evidenced on the card" /></label>{value.secondaryJerseyNumber ? <><label className="block text-xs">Photo showing the jersey<select aria-label="Jersey evidence photo" className={controlClass+" mt-1"} value={evidence.photoId || ""} onChange={event=>changeEvidence({photoId:event.target.value,confirmed:false})}><option value="">Use an evidence link below</option>{photos.filter(photo=>TM.safeImageUrl(photo.url)).map((photo,index)=><option key={photo.id} value={photo.id}>Photo {index+1} · {photo.side} · {TM.KINDS[photo.kind]}</option>)}</select></label><label className="block text-xs">Evidence link<input aria-label="Jersey evidence URL" className={controlClass+" mt-1"} value={evidence.sourceUrl || ""} onChange={event=>changeEvidence({sourceUrl:event.target.value,confirmed:false})} placeholder="https://…" /></label><label className="block text-xs">What is visible?<input aria-label="Jersey evidence note" className={controlClass+" mt-1"} value={evidence.note || ""} onChange={event=>changeEvidence({note:event.target.value})} placeholder="For example: 17 visible on the front uniform" /></label><label className="flex items-start gap-2 text-xs"><input type="checkbox" aria-label="Confirmed jersey number on this card" checked={evidence.confirmed === true} onChange={event=>changeEvidence({confirmed:event.target.checked})} />I verified this number on the depicted uniform in this card's photo.</label></>:null}</fieldset>
  </div>;
}

function CopyObservationEvidence({observation, cardById = {}, onChooseCard, showCandidates = true}) {
  const candidates = (observation.candidateCardIds || []).map(id=>cardById[id]).filter(Boolean);
  const serialLabel = observation.imageVerified === true ? "Image-verified serial" : observation.serialEvidence === "comc_inventory" ? "COMC inventory serial" : "Recorded serial";
  return <div className="mt-2 space-y-2 text-xs">
    {observation.serial?<p className="text-slate-300">{serialLabel}: {observation.serial}{observation.printRun && !String(observation.serial).includes("/") ? " / "+observation.printRun : ""}</p>:null}
    {observation.reviewReason?<p className="rounded border border-amber-800/60 bg-amber-950/30 px-2 py-1 text-amber-200">{observation.reviewReason}</p>:null}
    {observation.notes?<p className="whitespace-pre-wrap text-slate-400">{String(observation.notes)}</p>:null}
    {observation.needsSourceReview?<details className="rounded border border-amber-800 p-2"><summary className="cursor-pointer text-amber-200">Conflicting source update needs review</summary><p className="mt-1 text-slate-400">Earlier purchase facts are preserved. This source update has not changed the counted copy.</p>{(observation.conflictingEvidence || []).map((row,index)=>{const evidence=row.evidence || {};return <div key={index} className="mt-2 border-t border-slate-700 pt-2 text-slate-300"><p>{String(row.observedAt || "").slice(0,10)} · {(row.conflicts || []).join(", ")}</p>{evidence.title?<p>{evidence.title}</p>:null}{evidence.cardId!=null?<p>Proposed catalog card: {evidence.cardId}</p>:null}{evidence.serial?<p>Reported serial: {evidence.serial}</p>:null}{evidence.paidPrice!=null?<p>Reported item price: {evidence.currency || "Currency unknown"} {evidence.paidPrice}</p>:null}{evidence.purchaseDate?<p>Reported purchase date: {evidence.purchaseDate}</p>:null}{window.TrackerMedia.safeImageUrl(evidence.sourceUrl)?<a className="text-sky-300 underline" href={window.TrackerMedia.safeImageUrl(evidence.sourceUrl)} target="_blank" rel="noreferrer">Review source</a>:null}</div>;})}</details>:null}
    {showCandidates && candidates.length?<div className="space-y-1"><p className="text-slate-400">Catalogue candidates to check:</p>{candidates.slice(0,8).map(card=><div key={card.id}>{onChooseCard?<button type="button" onClick={()=>onChooseCard(card.id)} className="text-left text-sky-300 underline">{card.product} · #{card.cardNumber} · {card.cardSet || "Base"}{card.copies?" /"+card.copies:""}</button>:<span className="text-slate-300">{card.product} · #{card.cardNumber} · {card.cardSet || "Base"}{card.copies?" /"+card.copies:""}</span>}</div>)}</div>:null}
  </div>;
}

function ProofClassificationBadge({card, prefix = ""}) {
  if (!card || !window.CardCatalog.isProof(card)) return null;
  const info = window.CardCatalog.getInfo(card);
  return <span data-proof-signature={info.signature} className="inline-block rounded border border-violet-800/60 bg-violet-950/40 px-2 py-1 text-[10px] text-violet-200">{prefix}{window.CardCatalog.kindLabel(info.issueType)} · {window.CardCatalog.signatureLabel(card)}</span>;
}

function ProofScopeSelect({value, onChange, className = "", label = "Card category"}) {
  return <select aria-label={label} value={value} onChange={event=>onChange(event.target.value)} className={className}>
    <option value="all">All card categories</option><option value="checklist">Standard checklist</option>
    {[{key:"proofs",label:"All proofs & prototypes"},{key:"preproduction",label:"Pre-production proofs"},{key:"manufacturer_proofs",label:"Other manufacturer proofs"},{key:"prototypes",label:"Prototypes / test issues"}].map(group=><optgroup key={group.key} label={group.label}><option value={group.key}>{group.label} · all signatures</option><option value={group.key+"_signed"}>{group.label} · signed</option><option value={group.key+"_unsigned"}>{group.label} · unsigned</option><option value={group.key+"_unknown"}>{group.label} · signature unconfirmed</option></optgroup>)}
    <option value="review">Catalogue details to review</option>
  </select>;
}

function ProofReviewDetails({card}) {
  if (!card || !window.CardCatalog.isProof(card)) return null;
  const info=window.CardCatalog.getInfo(card), source=window.CardCatalog.safeUrl(info.sourceUrl);
  return <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10px] text-slate-400"><span>{card.copies ? (info.verification === "unverified" ? "Recorded /"+card.copies+" · unverified" : "Print run /"+card.copies) : "Print run unknown"}</span>{info.verification === "unverified"?<span className="text-amber-300">Catalogue details unverified</span>:null}{source?<a href={source} target="_blank" rel="noreferrer" className="text-sky-300 underline">Catalogue source</a>:null}</div>;
}

function ReviewStateBadges({observation}) {
  const TM=window.TrackerMedia,flags=TM.reviewFlags(observation);
  return <div className="flex flex-wrap gap-1.5 text-[10px]" aria-label="Review state">
    {flags.identityConfirmed?<span className="rounded bg-sky-950 px-2 py-1 text-sky-300">Catalogue identity confirmed</span>:null}
    {Object.entries(TM.REVIEW_LABELS).filter(([key])=>flags[key]).map(([key,label])=><span key={key} data-review-reason={key} className={"rounded border px-2 py-1 "+(key === "identity" || key === "serial" || key === "purchase" ? "border-amber-800/60 bg-amber-950/40 text-amber-200" : "border-slate-700 bg-slate-800 text-slate-300")}>{label}</span>)}
  </div>;
}

function ObservationReferencePhotos({observation, cardById = {}, publicMedia, onPreview, onChooseCard}) {
  const TM=window.TrackerMedia,plan=TM.observationPhotoPlan(observation,cardById,publicMedia),facts=TM.observationFacts(observation);
  const [showAll,setShowAll]=React.useState(false);
  const label=mediaCardLabel;
  const title=observation.title || (plan.card ? label(plan.card) : "Unidentified purchase");
  return <section className="space-y-3" data-observation-identity={plan.identityConfirmed?"confirmed":"pending"}>
    <ReviewStateBadges observation={observation} />
    <div className="flex items-start gap-3">
      <CardPhotoThumbnail compact photos={plan.photos} title={title} onOpen={photos=>onPreview({photos,title})} emptyLabel={plan.identityConfirmed?"Exact reference unavailable":"Identity pending"} emptyDetail={plan.identityConfirmed?"Add a scan of this copy":"Compare candidates below"} />
      <div className="min-w-0 space-y-2">
        {plan.card?<p className="text-xs text-slate-300">{label(plan.card)}</p>:<p className="text-xs text-amber-200">The purchase is not assigned to a confirmed catalogue variant.</p>}
        {facts.issueType?<ProofClassificationBadge card={facts} prefix={Array.isArray(observation.observedCards) && observation.observedCards.length === 1 ? "Source photo: " : "Recorded category: "}/>:plan.card?<ProofClassificationBadge card={plan.card}/>:null}
        {plan.card?<ProofReviewDetails card={plan.card}/>:null}
        {facts.variantDescription?<p className="text-xs text-slate-400">Visible appearance: {facts.variantDescription}</p>:null}
        {facts.yearEvidence === "unresolved"?<p className="text-xs text-amber-300">Exact year / official variant unresolved</p>:null}
        {facts.serialMark?<p className="text-xs text-slate-400">Source-photo marking: {facts.serialMark}</p>:null}
        {plan.photos.some(photo=>photo.kind === "reference")?<p className="text-[10px] text-slate-400">Reference images show the catalogue variant. They do not establish your copy’s serial, condition, signature, or ownership.</p>:null}
      </div>
    </div>
    {plan.candidates.length?<div className="space-y-2 rounded border border-amber-900/50 bg-slate-950/40 p-3"><p className="text-xs font-semibold text-amber-200">Catalogue candidates to check ({plan.candidates.length}) · no candidate selected automatically</p><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{plan.candidates.slice(0,showAll?plan.candidates.length:6).map(candidate=><article key={candidate.card.id} data-reference-candidate-id={candidate.card.id} className="flex gap-2 rounded border border-slate-700 bg-slate-900/70 p-2"><CardPhotoThumbnail compact photos={candidate.photos} title={"Candidate reference: "+label(candidate.card)} onOpen={photos=>onPreview({photos,title:"Candidate reference: "+label(candidate.card)})} emptyLabel="No exact reference" emptyDetail={"#"+candidate.card.cardNumber} /><div className="min-w-0 space-y-1"><p className="text-[10px] font-semibold text-amber-300">Candidate · identity pending</p><p className="text-[10px] text-slate-400">{candidate.card.product} · #{candidate.card.cardNumber}</p><p className="text-xs text-slate-200">{candidate.card.cardSet || "Base"}{candidate.card.copies && !window.CardCatalog.isProof(candidate.card)?" /"+candidate.card.copies:""}</p><ProofClassificationBadge card={candidate.card}/><ProofReviewDetails card={candidate.card}/>{onChooseCard?<button type="button" onClick={()=>onChooseCard(candidate.card.id)} className="text-left text-xs text-sky-300 underline">Choose this catalogue card</button>:null}</div></article>)}</div>{plan.candidates.length>6?<button type="button" onClick={()=>setShowAll(!showAll)} className="text-xs text-sky-300 underline">{showAll?"Show fewer candidates":"Show all "+plan.candidates.length+" candidates"}</button>:null}<p className="text-[10px] text-slate-500">Each reference belongs to its labelled catalogue variant. Similar parallels are never substituted for a missing exact reference.</p></div>:!plan.identityConfirmed?<p className="text-xs text-slate-400">No catalogue candidate is confirmed. Use the purchase source and search the exact card before linking a copy.</p>:null}
  </section>;
}

function ComcDuplicateReview({inventory, cardById, publicMedia, query = "", canEdit, busy, onReview, onEdit, onPreview, mode, primaryJerseyNumber}) {
  const TM = window.TrackerMedia;
  const groups = TM.comcDuplicateGroups(inventory).filter(group=> {
    const card=cardById[group.cardId] || {};
    return !query || [mediaCardSubject(card),mediaCardProduct(card),card.cardNumber,card.cardSet,...group.observations.map(o=>[o.title,o.serial,o.sourceItemId].join(" "))].join(" ").toLowerCase().includes(query.toLowerCase());
  });
  const money = observation => window.TrackerMarket.formatMoney(observation.askingPrice == null ? observation.listedPrice : observation.askingPrice,observation.currency);
  return <div className="space-y-4"><p className="text-xs text-slate-400">These groups come from confirmed current COMC inventory. A record awaiting a match is shown here without becoming another counted copy. Choose your keeper, then review the other copies for sale.</p>{groups.map(group=>{
    const card=cardById[group.cardId],title=card ? mediaCardLabel(card) : "Catalogue card "+group.cardId;
    return <section key={group.cardId} data-comc-duplicate-card-id={group.cardId} className="overflow-hidden rounded-lg border border-amber-800/60 bg-slate-900"><header className="space-y-1 border-b border-slate-700 bg-amber-950/20 p-3"><h3 className="text-sm font-semibold text-amber-200">{title}</h3><p className="text-sm font-bold text-amber-300">At least {group.minimumExtras} extra at COMC—choose keeper</p><p className="text-xs text-slate-400">{group.count} confirmed copies at COMC · {group.observations.length} inventory records shown</p></header><div className="divide-y divide-slate-800">{group.observations.map(observation=><article key={observation.id} className="p-3"><div className="flex items-start gap-3"><CardPhotoThumbnail photos={TM.photosForCopy(observation,group.cardId,publicMedia)} compact emptyLabel="Exact reference unavailable" title={title+(observation.serial?" · Serial "+observation.serial:"")} onOpen={photos=>onPreview({photos,title})} /><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2 text-xs"><span className={"rounded px-2 py-1 "+(observation.saleState==="listed"?"bg-cyan-950 text-cyan-300":"bg-slate-800 text-slate-300")}>{observation.saleState==="listed"?"Already listed":observation.saleState==="not_for_sale"?"Not for sale":"Listing status unknown"}</span><span className="rounded bg-slate-800 px-2 py-1 text-slate-400">{observation.matchedCopyId?"Linked to counted copy":"Awaiting copy match"}</span><JerseyBadges mode={mode} primaryJerseyNumber={primaryJerseyNumber} record={observation} cardMedia={publicMedia && publicMedia.cards && publicMedia.cards[group.cardId]} /></div><p className="mt-2 text-xs text-slate-400">COMC item {observation.sourceItemId || observation.id}</p>{observation.saleState==="listed" && (observation.askingPrice != null || observation.listedPrice != null)?<p className="mt-1 text-xs text-cyan-300">Asking {money(observation)}</p>:null}<CopyObservationEvidence observation={observation} cardById={cardById} />{TM.safeImageUrl(observation.sourceUrl)?<a href={TM.safeImageUrl(observation.sourceUrl)} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-sky-300 underline">View COMC item</a>:null}<div className="mt-2"><button className="rounded border border-slate-600 px-3 py-1 text-xs disabled:opacity-40" disabled={!canEdit || busy} onClick={()=>observation.matchedCopyId?onEdit(observation):onReview(observation)}>{observation.matchedCopyId?"Review linked copy":"Match this copy"}</button></div></div></div></article>)}</div></section>;
  })}{!groups.length?<p className="rounded border border-slate-700 p-5 text-sm text-slate-400">No confirmed COMC duplicate groups match this view.</p>:null}</div>;
}

function CardGalleryPanel({cards = [], statuses = {}, cardDetails = {}, inventory, publicMedia, isOwner = false, onOpenCopies, onRefresh, loading = false, loadError = "", mode, primaryJerseyNumber, onEditMedia, onTogglePin}) {
  const TM = window.TrackerMedia, CI = window.CopyInventory;
  const currentMode=mode || window.MODE || "tb",primary=TM.primaryJerseyNumber(currentMode,primaryJerseyNumber);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sourceFilter, setSourceFilter] = React.useState("all");
  const [jerseyFilter, setJerseyFilter] = React.useState("all");
  const [scope, setScope] = React.useState("all");
  const [includeMissing, setIncludeMissing] = React.useState(!!onEditMedia);
  const [limit, setLimit] = React.useState(48);
  const [preview, setPreview] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState("");
  React.useEffect(()=>{function clear(){setPreview(null);setQuery("");setError("");}window.addEventListener("authchange",clear);return ()=>window.removeEventListener("authchange",clear);},[]);
  React.useEffect(()=>setPreview(null),[isOwner,currentMode]);
  const media = React.useMemo(() => TM.normalizePublicMedia(publicMedia,{primaryJerseyNumber:primary}), [publicMedia,primary]);
  const state = React.useMemo(() => CI.normalizeState(isOwner ? inventory : null), [inventory, isOwner]);
  const proofScope = /^(proofs|preproduction|manufacturer_proofs|prototypes)(?:_(signed|unsigned|unknown))?$/.test(scope);
  const showMissingForScope = proofScope || scope === "review";
  const entries = React.useMemo(() => {
    const copiesByCard = new Map();
    if (isOwner) CI.copiesForCards(state,cards,statuses,cardDetails).forEach(({card,copy})=>{
      if (copy.saleStatus === "sold") return;
      if (!copiesByCard.has(card.id)) copiesByCard.set(card.id,[]);
      copiesByCard.get(card.id).push(copy);
    });
    const summaries = CI.summarizeCards(state,cards,statuses,cardDetails);
    const observationsByCard = {};
    if (isOwner) Object.values(state.observations).forEach(observation => { if (observation.cardId && TM.reviewFlags(observation).identityConfirmed && !["ignored","split"].includes(observation.disposition)) { if (!observationsByCard[observation.cardId]) observationsByCard[observation.cardId] = []; observationsByCard[observation.cardId].push(observation); } });
    return cards.filter(card => (currentMode !== "tb" || card.id !== 1) && !card.archived && !card.hiddenDuplicate).map(card => {
      const copies = copiesByCard.get(card.id) || [];
      const observations = observationsByCard[card.id] || [];
      const records = copies.concat(observations);
      let photos = [];
      records.forEach(record => {
        const context = record.serial ? "Serial " + record.serial : record.location && CI.LOCATIONS[record.location] || "";
        const labelled = TM.normalizePhotos(record.photos).map(photo => ({...photo, context:(TM.isExternalSourceScan(photo) || photo.kind === "copy_scan" && record.source && !record.matchedCopyId) ? "purchase_source" : photo.context,caption:[photo.caption,photo.kind !== "reference" ? context : "",record.source && !record.matchedCopyId ? "Purchase awaiting copy match" : ""].filter(Boolean).join(" · ")}));
        photos = TM.mergePhotos(photos, labelled);
      });
      photos = TM.mergePhotos(photos, TM.exactVariantPhotos(card.id,media));
      const legacy = TM.jerseyMatches({}, (cardDetails[card.id] || {}).serial, media.cards[card.id], primary);
      const matches = records.map(record => TM.jerseyMatches(record, "", media.cards[card.id], primary));
      const primaryMatch = legacy.primary || matches.some(match => match.primary);
      const secondary = Array.from(new Set([legacy].concat(matches).filter(match => match.secondary).map(match => match.secondaryNumber)));
      return { card, photos, summary:summaries[card.id], primary:primaryMatch, secondary,
        pending:observations.filter(observation => !observation.matchedCopyId && !["ignored","split"].includes(observation.disposition)).length,
        text:[mediaCardSubject(card),card.player,mediaCardProduct(card), card.cardNumber, card.cardSet, (cardDetails[card.id] || {}).serial, ...records.map(record => record.serial || "")].join(" ").toLowerCase() };
    });
  }, [cards, state, media, isOwner, statuses, cardDetails,currentMode,primary]);
  const filtered = entries.filter(entry => {
    if (!window.CardCatalog.matchesScope(entry.card,scope)) return false;
    if (query && !entry.text.includes(query.toLowerCase())) return false;
    if (!CI.matchesStatus(entry.summary, statusFilter)) return false;
    if (jerseyFilter === "primary" && !entry.primary || jerseyFilter === "secondary" && !entry.secondary.length || jerseyFilter === "any" && !entry.primary && !entry.secondary.length) return false;
    if (sourceFilter === "missing" && entry.photos.length) return false;
    if (sourceFilter !== "all" && sourceFilter !== "missing" && !entry.photos.some(photo => photo.kind === sourceFilter)) return false;
    return sourceFilter === "missing" || showMissingForScope || includeMissing || entry.photos.length > 0;
  });
  const missingAcquired = entries.filter(entry => (entry.summary.owned || entry.summary.inTransit) && entry.photos.length === 0).length;
  React.useEffect(() => setLimit(48), [query, statusFilter, sourceFilter, jerseyFilter, includeMissing, scope]);
  const control = "rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-200";
  return <section className="space-y-4 text-slate-100">
    <header className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-2xl font-bold text-amber-300">Card gallery</h2><p className="mt-1 max-w-3xl text-sm text-slate-400">Your own photos appear first, followed by scans of your copies and labelled references. Open a card for its front and back.</p></div>{onRefresh ? <button className={control + " disabled:opacity-40"} disabled={loading || refreshing} onClick={async()=>{setRefreshing(true);setError("");try {const result=await onRefresh();if(result && result.ok===false)throw Error(result.error || "Photos could not be refreshed.");}catch(err){setError(err.message);}finally{setRefreshing(false);}}}>{refreshing || loading ? "Refreshing…" : "Refresh photos"}</button> : null}</header>
    <div className="flex flex-wrap gap-2"><input aria-label="Search gallery" className={control + " min-w-52 flex-1"} placeholder="Search subject, product, variant, number or serial" value={query} onChange={event=>setQuery(event.target.value)} /><select aria-label="Gallery ownership" className={control} value={statusFilter} onChange={event=>setStatusFilter(event.target.value)}><option value="all">All statuses</option><option value="owned">Owned / in hand</option><option value="in_transit">In transit / awaiting receipt</option><option value="acquired">All acquired</option><option value="not_owned">Needed</option></select><select aria-label="Gallery photo source" className={control} value={sourceFilter} onChange={event=>setSourceFilter(event.target.value)}><option value="all">All photo sources</option><option value="missing">Missing photos only</option>{Object.entries(TM.KINDS).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select><select aria-label="Gallery jersey matches" className={control} value={jerseyFilter} onChange={event=>setJerseyFilter(event.target.value)}><option value="all">All serials</option>{primary != null && <option value="primary">Primary jersey #{primary}</option>}<option value="secondary">Verified on-card jersey</option><option value="any">Any jersey match</option></select></div>
    <div className="flex flex-wrap items-center gap-2"><ProofScopeSelect label="Gallery card category" value={scope} onChange={value=>{setScope(value);setSourceFilter("all");}} className={control} />{proofScope?<p className="text-xs text-violet-300">All recorded proofs in this segment are shown, including cards without photos. Proofs do not count toward standard checklist completion.</p>:scope === "review"?<p className="text-xs text-amber-300">Records needing catalogue verification remain visible even without a photo.</p>:null}</div>
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400"><span>{filtered.length} card{filtered.length===1 ? "" : "s"} · {filtered.filter(entry=>entry.photos.length).length} have photos</span>{missingAcquired>0 && <button type="button" className="font-semibold text-amber-300 hover:underline" onClick={()=>{setQuery("");setStatusFilter("acquired");setSourceFilter("missing");setJerseyFilter("all");setScope("all");setIncludeMissing(true);}}>{missingAcquired} acquired missing</button>}{sourceFilter === "missing" ? <span>Showing cards needing reference photos</span> : showMissingForScope?<span>Missing photos shown as labelled placeholders</span>:<label className="flex items-center gap-2"><input type="checkbox" checked={includeMissing} onChange={event=>setIncludeMissing(event.target.checked)} />Include cards without photos</label>}</div>
    {error || loadError ? <p role="alert" className="rounded border border-red-800 bg-red-950/40 p-3 text-sm text-red-200">{error || loadError}</p> : null}
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {filtered.slice(0,limit).map(entry=>{
        const card=entry.card, title=mediaCardLabel(card), info=window.CardCatalog.getInfo(card), sourceUrl=window.CardCatalog.safeUrl(info.sourceUrl), isProof=window.CardCatalog.isProof(card);
        const photos=sourceFilter === "all" || sourceFilter === "missing" ? entry.photos : entry.photos.filter(photo=>photo.kind===sourceFilter);
        return <article key={card.id} data-gallery-card-id={card.id} className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-lg">
          <CardPhotoThumbnail photos={photos} title={title} onOpen={items=>setPreview({photos:items,title})} emptyLabel="Exact reference unavailable" emptyDetail={"#"+card.cardNumber+" · "+(card.cardSet||"Base")} />
          <div className="space-y-2 p-3">{currentMode !== "tb" && (isOwner && typeof onTogglePin === "function" || cardDetails[card.id]?.pinned === true) ? <div className="flex items-start justify-between gap-2"><p className="min-w-0 flex-1 text-sm font-semibold text-amber-200">{mediaCardSubject(card)}</p>{isOwner && typeof onTogglePin === "function" ? <button type="button" aria-pressed={cardDetails[card.id]?.pinned === true} aria-label={cardDetails[card.id]?.pinned === true ? "Unpin focal card" : "Pin focal card"} title={cardDetails[card.id]?.pinned === true ? "Unpin focal card" : "Pin focal card"} onClick={()=>onTogglePin(card.id)} className={"shrink-0 rounded px-1 text-base leading-none hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-400 "+(cardDetails[card.id]?.pinned === true ? "text-amber-300" : "text-slate-500 hover:text-amber-300")}>{cardDetails[card.id]?.pinned === true ? "★" : "☆"}</button> : <span className="shrink-0 text-amber-300" title="Pinned focal card" aria-label="Pinned focal card">★</span>}</div> : mediaCardSubject(card) ? <p className="text-sm font-semibold text-amber-200">{mediaCardSubject(card)}</p> : null}<p className="text-[10px] uppercase tracking-wide text-slate-400">{mediaCardProduct(card)}</p><h3 className="text-sm font-semibold text-white">#{card.cardNumber} · {card.cardSet||"Base"}</h3><ProofClassificationBadge card={card}/><div className="flex flex-wrap gap-1 text-[10px]">{entry.summary.owned?<span className="rounded bg-green-950 px-2 py-1 text-green-300">Owned</span>:null}{entry.summary.inTransit?<span className="rounded bg-cyan-950 px-2 py-1 text-cyan-300">Awaiting receipt</span>:null}{entry.summary.notOwned?<span className="rounded bg-slate-800 px-2 py-1 text-slate-400">Needed</span>:null}{card.copies?<span className="rounded bg-slate-800 px-2 py-1 text-amber-300">{isProof && info.verification === "unverified" ? "Recorded /"+card.copies+" · unverified" : "/"+card.copies}</span>:isProof?<span className="rounded bg-slate-800 px-2 py-1 text-slate-400">Print run unknown</span>:null}{!photos.length?<span className="rounded bg-slate-800 px-2 py-1 text-slate-400">Reference photo needed</span>:null}{info.verification === "unverified"?<span className="rounded bg-amber-950/50 px-2 py-1 text-amber-300">Catalogue details unverified</span>:null}</div>
            {sourceUrl?<a href={sourceUrl} target="_blank" rel="noreferrer" className="inline-block text-[10px] text-sky-300 underline">Catalogue source</a>:null}
            {entry.primary || entry.secondary.length ? <div className="flex flex-wrap gap-1">{entry.primary?<span className="rounded border border-amber-600 bg-amber-950/50 px-2 py-1 text-[10px] font-bold text-amber-200" title={"A recorded serial for this card is "+primary+"; the displayed photo may be a reference"}>Recorded jersey #{primary}</span>:null}{entry.secondary.map(number=><span key={number} className="rounded border border-violet-700 bg-violet-950/40 px-2 py-1 text-[10px] text-violet-200">On-card jersey #{number}</span>)}</div>:null}
            {isOwner?<div className="flex flex-wrap items-center justify-between gap-1 border-t border-slate-800 pt-2 text-[10px] text-slate-400"><span>{entry.summary.total} counted{entry.pending ? " · "+entry.pending+" awaiting match" : ""}</span>{onOpenCopies?<button onClick={()=>onOpenCopies(card.id)} className="font-semibold text-sky-300 underline">Copies &amp; photos</button>:null}{onEditMedia?<button disabled={loading} onClick={()=>onEditMedia(card)} className="font-semibold text-sky-300 underline disabled:opacity-40">Edit references</button>:null}</div>:null}
          </div>
        </article>;
      })}
    </div>
    {!filtered.length?<p className="rounded-lg border border-slate-700 p-8 text-center text-sm text-slate-400">No cards match this view. {isOwner ? "Add exact card references or photo URLs to a physical copy in Copies, or include cards without photos." : "Try another filter or include cards without photos."}</p>:null}
    {filtered.length>limit?<button className={control} onClick={()=>setLimit(value=>value+48)}>Show more cards ({filtered.length-limit} remaining)</button>:null}
    {preview?<CardPhotoViewer key={preview.title} photos={preview.photos} title={preview.title} onClose={()=>setPreview(null)} />:null}
  </section>;
}
const collectionMediaDrafts = new Map();
function CollectionMediaEditor({card,media,onSave,onClose,mode,primaryJerseyNumber,isOwner=true,disabled=false}) {
  const TM=window.TrackerMedia,primary=TM.primaryJerseyNumber(mode || window.MODE,primaryJerseyNumber);
  const [value,setValue]=React.useState(()=>{try{return JSON.parse(JSON.stringify(TM.normalizeScopedMedia(media).cards[card.id] || {photos:[]}));}catch(_){return {photos:[]};}});
  const [busy,setBusy]=React.useState(false),[error,setError]=React.useState("");
  const guard=React.useRef({busy:false,dirty:false,epoch:0,expired:false}),token=React.useRef({}),base=React.useRef(JSON.stringify(media || null));
  const primaryMode=mode || window.MODE || "tb";
  React.useEffect(()=>{
    collectionMediaDrafts.set(token.current,()=>guard.current.busy || guard.current.dirty);
    function auth(){guard.current.epoch++;guard.current.expired=true;guard.current.busy=false;guard.current.dirty=false;setValue({photos:[]});setBusy(false);setError("Your session changed. Reopen this card’s references.");if(onClose)onClose();}
    window.addEventListener("authchange",auth);
    return ()=>{guard.current.epoch++;collectionMediaDrafts.delete(token.current);window.removeEventListener("authchange",auth);};
  },[]);
  function change(key,next){guard.current.dirty=true;setError("");setValue(previous=>({...previous,[key]:next}));}
  async function save(event){
    event.preventDefault();if(guard.current.busy)return;
    if(!isOwner || disabled || guard.current.expired || window.trackerAuth && !window.trackerAuth.isOwner()){setError("Sign in and reopen this card’s references before saving.");return;}
    if(JSON.stringify(media || null)!==base.current){setError("Reference images changed while you were editing. Close and reopen this card before saving.");return;}
    const epoch=guard.current.epoch;guard.current.busy=true;setBusy(true);setError("");
    try {
      if(typeof onSave!=="function")throw Error("Reference photo storage is unavailable.");
      const next=TM.setCardReferences(media,card.id,value,{primaryJerseyNumber:primary});
      const result=await onSave(next);
      if(epoch!==guard.current.epoch)return;
      if(result===false || result && (result.ok===false || result.error || result.cloudSaved===false))throw Error(result.error || "Reference photos were not saved. Refresh before retrying.");
      guard.current.dirty=false;if(onClose)onClose();
    } catch(err){if(epoch===guard.current.epoch)setError(err.message || "Reference photos were not saved.");}
    finally {if(epoch===guard.current.epoch){guard.current.busy=false;setBusy(false);}}
  }
  const control="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100";
  const title=mediaCardLabel(card);
  return <form onSubmit={save} className="space-y-3 rounded border border-amber-700 bg-slate-900 p-4" aria-label="Edit exact card references">
    <div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-amber-200">{title}</h3><p className="mt-1 text-xs text-slate-400">Private references for this exact card. Physical-copy photos stay in Copies.</p></div><button type="button" disabled={busy} onClick={onClose} className="rounded border border-slate-600 px-3 py-1 text-xs disabled:opacity-40">Cancel</button></div>
    {error && <p role="alert" className="text-sm text-red-200">{error}</p>}
    <CopyPhotoFields value={value} onChange={change} controlClass={control} mode={primaryMode} primaryJerseyNumber={primary} referenceOnly />
    <button type="submit" disabled={busy || disabled || !isOwner} className="rounded bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-40">{busy?"Saving references…":"Save references"}</button>
  </form>;
}
CollectionMediaEditor.hasPending=()=>[...collectionMediaDrafts.values()].some(check=>check());
window.CollectionMediaEditor=CollectionMediaEditor;
window.CardPhotoThumbnail = CardPhotoThumbnail;
window.CardPhotoViewer = CardPhotoViewer;
window.JerseyBadges = JerseyBadges;
window.CopyPhotoFields = CopyPhotoFields;
window.CopyObservationEvidence = CopyObservationEvidence;
window.ComcDuplicateReview = ComcDuplicateReview;
window.ProofClassificationBadge = ProofClassificationBadge;
window.ProofScopeSelect = ProofScopeSelect;
window.ProofReviewDetails = ProofReviewDetails;
window.ReviewStateBadges = ReviewStateBadges;
window.ObservationReferencePhotos = ObservationReferencePhotos;
window.CardGalleryPanel = CardGalleryPanel;
