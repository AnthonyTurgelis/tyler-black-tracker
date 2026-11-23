/* Catalogue management UI. Collection data is saved by the host tracker. */
(function () {
  const TYPES = [
    ["standard", "Checklist card"],
    ["pre_production_proof", "Pre-production proof"],
    ["manufacturer_proof", "Other manufacturer proof"],
    ["prototype", "Prototype / test issue"],
    ["custom", "Custom / unofficial"],
    ["unverified", "Needs identification"]
  ];
  const FILTERS = [
    ["2026", "2026"], ["proofs", "Proofs"], ["custom", "Unofficial"],
    ["review", "Needs review"], ["all", "All"]
  ];
  const INPUT = "w-full min-w-0 rounded border border-gray-600 bg-gray-950 px-2 py-1.5 text-base text-gray-100 focus:border-yellow-400 focus:outline-none disabled:text-gray-500 disabled:bg-gray-900";
  const BUTTON = "rounded border border-gray-600 px-2.5 py-1.5 text-xs font-semibold text-gray-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50";
  const FIELD = "block min-w-0 space-y-1 text-xs text-gray-400";

  const pendingEditors = new Map();
  function cardSubject(card) { return String(card && (card.subject || card.playerName || window.TEMPO_ROSTER?.[card.player]?.name || card.player) || ""); }
  function cardYear(card) { return String(card && (card.year || (String(card.product || "").match(/^(\d{4}(?:-\d{2,4})?)\b/) || [])[1]) || ""); }
  function productLabel(card) { var product=String(card.product || "");return cardYear(card) && !product.startsWith(cardYear(card)) ? cardYear(card)+" "+product : product; }
  function syncKeys(mode) { return mode === "tb" ? ["tb-custom-cards-v1","tb-catalog-meta-v1"] : [mode === "wnba" || mode === "tempo" ? "tempo-alldata-v1" : "collect-"+mode+"-alldata-v1"]; }
  function safeUrl(value) {
    if (window.CardCatalog && window.CardCatalog.safeUrl) return window.CardCatalog.safeUrl(value);
    try {
      var parsed = new URL(String(value || "").trim());
      return (parsed.protocol === "https:" || parsed.protocol === "http:") && !parsed.username && !parsed.password ? parsed.href : "";
    } catch (e) { return ""; }
  }
  function isProof(type) {
    return ["pre_production_proof", "manufacturer_proof", "prototype"].indexOf(type) !== -1;
  }
  function readableSource(url) {
    try { return new URL(url).hostname.replace(/^www\./, ""); }
    catch (e) { return "Source"; }
  }
  function infoFor(card) {
    return window.CardCatalog.getInfo(card);
  }
  function matchesFilter(entry, filter) {
    if (filter === "archived") return !!entry.card.archived;
    if (entry.card.archived) return false;
    if (filter === "2026") return cardYear(entry.card) === "2026";
    if (filter === "proofs") return isProof(entry.info.issueType);
    if (filter === "custom") return entry.info.issueType === "custom";
    if (filter === "review") return entry.info.issueType === "unverified" || entry.info.verification === "unverified";
    return true;
  }
  function readSyncIssues(mode) {
    var issues = window.storageSyncIssues || {};
    return syncKeys(mode || "tb").map(function (key) {
      return issues[key] ? {key: key, error: issues[key].error || "Cloud sync is pending."} : null;
    }).filter(Boolean);
  }
  function makeForm(card, proof, mode) {
    var info = card ? infoFor(card) : {};
    return {
      ...(mode && mode !== "tb" ? {subject:cardSubject(card),year:cardYear(card)} : {}),
      product: card ? card.product || "" : "",
      cardNumber: card ? card.cardNumber || "" : "",
      cardSet: card ? card.cardSet || "" : "",
      copies: card && card.copies != null ? String(card.copies) : "",
      issueType: info.issueType || (proof ? "pre_production_proof" : "unverified"),
      verification: info.verification || "unverified",
      sourceUrl: info.sourceUrl || "",
      evidenceNotes: info.evidenceNotes || "",
      proofColor: info.proofColor || "",
      proofFinish: info.proofFinish || "",
      signature: info.signature || (card && card.isAuto === "Yes" ? "signed" : "unknown"),
      serialMark: info.serialMark || "",
      certification: info.certification || "",
      parentCardId: info.parentCardId != null ? String(info.parentCardId) : "",
      isAuto: card && window.CardCatalog.hasAutograph(card) ? "Yes" : "",
      isMem: card ? card.isMem || "" : "",
      isRC: card ? card.isRC || "" : ""
    };
  }


  function prepareSubmission(form, original, mode) {
    var generic = !!mode && mode !== "tb";
    var next = Object.assign({}, generic ? original || {} : {}, form);
    ["product", "cardNumber", "cardSet", "copies", "sourceUrl", "evidenceNotes", "proofColor", "proofFinish", "serialMark", "certification"]
      .forEach(function(key){ next[key] = String(next[key] == null ? "" : next[key]).trim(); });
    if (generic) {
      next.subject=String(next.subject || "").trim();next.year=String(next.year || "").trim();
      if (!next.subject) return {error:"Enter the player, driver or subject shown on the card."};
      if (!/^[12]\d{3}(?:-\d{2,4})?$/.test(next.year)) return {error:"Enter the card year or season, for example 2024 or 2024-25."};
      if (!next.product) return {error:"Enter the product or set name."};
      var productYear=(next.product.match(/^([12]\d{3}(?:-\d{2,4})?)\b/) || [])[1];
      if (productYear && (productYear.slice(0,4) !== next.year.slice(0,4) || productYear.includes("-") && next.year.includes("-") && productYear !== next.year)) return {error:"The year and product year must match."};
      // Card IDs and external source identifiers belong to the original record, not the form.
      if (original) ["id","tcdbId","tcdbSetId","sourceId","sourceItemId","sourcePersonUrl"].forEach(function(key){if(Object.prototype.hasOwnProperty.call(original,key)) next[key]=original[key]; else delete next[key];});
      if (next.parentCardId && original && String(next.parentCardId) === String(original.id)) return {error:"A card cannot be linked to itself."};
    }
    var validationCard = generic ? Object.assign({}, next, {product:next.year.slice(0,4)+" "+next.product.replace(/^[12]\d{3}(?:-\d{2,4})?\s+/,""),catalogMeta:null}) : next;
    var error = window.CardCatalog.validate(validationCard,original);
    if (error) return {error:error};
    next.parentCardId = next.parentCardId ? (generic ? String(next.parentCardId) : Number(next.parentCardId)) : null;
    if (generic) next.catalogMeta=null;
    if (next.signature === "signed") next.isAuto="Yes";
    if (next.signature === "unsigned" || isProof(next.issueType) && next.signature === "unknown") next.isAuto="";
    return {card:next};
  }

  function CardCatalogPanel(props) {
    var cards = props.cards || [];
    var statuses = props.statuses || {};
    var mode = props.mode || props.scope || "tb", generic = mode !== "tb";
    var canEdit = !!props.isOwner && props.readOnly !== true && props.storageReady !== false && typeof props.onSave === "function";
    const [filter, setFilter] = React.useState(generic ? "all" : "2026");
    const [subjectFilter,setSubjectFilter] = React.useState("");
    const [yearFilter,setYearFilter] = React.useState("");
    const [search, setSearch] = React.useState("");
    const [proofTypeFilter, setProofTypeFilter] = React.useState("all");
    const [proofSignatureFilter, setProofSignatureFilter] = React.useState("all");
    const [shown, setShown] = React.useState(50);
    const [form, setForm] = React.useState(null);
    const [editingCard, setEditingCard] = React.useState(null);
    const [busy, setBusy] = React.useState(false);
    const [formError, setFormError] = React.useState("");
    const [notice, setNotice] = React.useState(null);
    const [archiveId, setArchiveId] = React.useState(null);
    const [archiveBusy, setArchiveBusy] = React.useState(null);
    const [syncIssues, setSyncIssues] = React.useState(function(){return readSyncIssues(mode);});
    const editorRef = React.useRef(null);
    const handledEditRef = React.useRef(null);
    const pendingToken = React.useRef({}), pendingRef = React.useRef({}), saveLock = React.useRef(false);
    pendingRef.current={form:!!form,busy:busy,archive:archiveBusy != null};
    React.useEffect(function(){
      var hasPending=function(){var p=pendingRef.current;return p.form || p.busy || p.archive || saveLock.current;};
      pendingEditors.set(pendingToken.current,hasPending);
      function beforeUnload(event){if(hasPending()){event.preventDefault();event.returnValue="";}}
      window.addEventListener("beforeunload",beforeUnload);
      return function(){pendingEditors.delete(pendingToken.current);window.removeEventListener("beforeunload",beforeUnload);};
    },[]);

    var entries = React.useMemo(function () {
      return cards.map(function (card) {
        return {card: card, info: infoFor(card)};
      });
    }, [cards, props.revision]);

    var counts = React.useMemo(function () {
      var result = {};
      FILTERS.forEach(function (item) {
        result[item[0]] = entries.filter(function (entry) { return matchesFilter(entry, item[0]); }).length;
      });
      result.archived = entries.filter(function (entry) { return !!entry.card.archived; }).length;
      return result;
    }, [entries]);
    var categoryFilters = props.isOwner && counts.archived > 0 ? FILTERS.concat([["archived", "Archived"]]) : FILTERS;

    var filtered = React.useMemo(function () {
      var query = search.toLowerCase().trim();
      return entries.filter(function (entry) {
        if (filter === "archived" && !props.isOwner) return false;
        if (!matchesFilter(entry, filter)) return false;
        if (generic && subjectFilter && cardSubject(entry.card) !== subjectFilter) return false;
        if (generic && yearFilter && cardYear(entry.card) !== yearFilter) return false;
        if (filter === "proofs" && proofTypeFilter !== "all" && entry.info.issueType !== proofTypeFilter) return false;
        if (filter === "proofs" && proofSignatureFilter !== "all" && entry.info.signature !== proofSignatureFilter) return false;
        if (!query) return true;
        var card = entry.card, info = entry.info;
        return [cardSubject(card),cardYear(card),card.product, card.cardNumber, card.cardSet, info.proofColor, info.proofFinish, info.certification, info.signature]
          .join(" ").toLowerCase().indexOf(query) !== -1;
      }).sort(function (a, b) {
        var productOrder = (b.card.product || "").localeCompare(a.card.product || "", undefined, {numeric: true});
        if (productOrder) return productOrder;
        var numberOrder = String(a.card.cardNumber || "").localeCompare(String(b.card.cardNumber || ""), undefined, {numeric: true});
        if (numberOrder) return numberOrder;
        if (a.card.cardSet === "Base") return -1;
        if (b.card.cardSet === "Base") return 1;
        return (a.card.cardSet || "").localeCompare(b.card.cardSet || "", undefined, {numeric: true});
      });
    }, [entries, filter, search, props.isOwner, proofTypeFilter, proofSignatureFilter, generic, subjectFilter, yearFilter]);
    var subjects = [...new Set(cards.map(cardSubject).filter(Boolean))].sort();
    var years = [...new Set(cards.map(cardYear).filter(Boolean))].sort().reverse();
    var proofEntries = entries.filter(function(entry){return matchesFilter(entry,"proofs") && (!search || [cardSubject(entry.card),cardYear(entry.card),entry.card.product,entry.card.cardNumber,entry.card.cardSet,entry.info.proofColor,entry.info.proofFinish,entry.info.signature].join(" ").toLowerCase().includes(search.toLowerCase().trim()));});
    var proofSignatureCounts = {all:0,signed:0,unsigned:0,unknown:0};
    proofEntries.forEach(function(entry){if(proofTypeFilter === "all" || entry.info.issueType === proofTypeFilter){proofSignatureCounts.all++;proofSignatureCounts[entry.info.signature]++;}});

    var owned = filtered.filter(function (entry) { return props.copySummaries?.[entry.card.id]?.owned ?? (statuses[entry.card.id] === "owned"); }).length;
    var incoming = filtered.filter(function (entry) { return props.copySummaries?.[entry.card.id]?.inTransit ?? (statuses[entry.card.id] === "in_transit"); }).length;
    var isOpenEnded = filter === "proofs" || filter === "custom" || filter === "review";

    React.useEffect(function () { setShown(50); }, [filter, search, proofTypeFilter, proofSignatureFilter, subjectFilter, yearFilter]);
    React.useEffect(function () {
      function refreshIssues(event) {
        if (!event || !event.detail || syncKeys(mode).indexOf(event.detail.key) !== -1) setSyncIssues(readSyncIssues(mode));
      }
      refreshIssues();
      window.addEventListener("storage-sync-issue", refreshIssues);
      return function () { window.removeEventListener("storage-sync-issue", refreshIssues); };
    }, [mode]);
    React.useEffect(function () { setSyncIssues(readSyncIssues(mode)); }, [props.revision,mode]);
    React.useEffect(function () {
      if (filter === "archived" && (!props.isOwner || counts.archived === 0)) setFilter("all");
    }, [filter, counts.archived, props.isOwner]);
    React.useEffect(function () {
      if (props.initialEditId == null) { handledEditRef.current = null; return; }
      if (!canEdit || form || busy || handledEditRef.current === props.initialEditId) return;
      var card = cards.find(function (candidate) { return String(candidate.id) === String(props.initialEditId); });
      if (!card || card.archived) return;
      handledEditRef.current = props.initialEditId;
      setEditingCard(card);
      setForm(makeForm(card, false, mode));
      setFormError("");
      setNotice(null);
      if (props.onClearEdit) props.onClearEdit();
    }, [props.initialEditId, canEdit, cards, props.onClearEdit, form, busy, mode]);
    React.useEffect(function () {
      if (form && editorRef.current) editorRef.current.scrollIntoView({block: "nearest"});
    }, [!!form]);
    React.useEffect(function () {
      if (!props.isOwner) { setForm(null); setEditingCard(null); }
    }, [props.isOwner]);

    function openEditor(card, proof) {
      if (!canEdit || busy || archiveBusy != null || (card && card.archived)) return;
      if (form) { setFormError("Save or cancel the open card before editing another."); return; }
      setEditingCard(card || null);
      setForm(makeForm(card, proof, mode));
      setFormError("");
      setNotice(null);
      setArchiveId(null);
    }
    function updateField(field, value) {
      setForm(function (previous) {
        var next = Object.assign({}, previous);
        next[field] = value;
        return next;
      });
      setFormError("");
    }
    async function submitForm(event) {
      event.preventDefault();
      if (!canEdit || busy || saveLock.current || !form) return;
      var prepared=prepareSubmission(form,editingCard,mode);
      if (prepared.error) { setFormError(prepared.error);return; }
      var next=prepared.card;
      saveLock.current=true;
      setBusy(true);
      setFormError("");
      try {
        var result = await props.onSave(next, editingCard);
        if (!result || result.ok === false) { setFormError(result && result.error || "The card could not be saved. Your entries are still here."); return; }
        if (result.card) setEditingCard(result.card);
        else if (result.cardId != null) setEditingCard(Object.assign({}, editingCard || next, {id: result.cardId, isCustom: editingCard ? editingCard.isCustom : true}));
        if (result.cloudSaved !== true) {
          setFormError(result.error || "Saved on this device. Cloud sync is still pending; retry saving when connected.");
          setNotice({pending: true, text: "Saved on this device — waiting for cloud sync."});
          return;
        }
        setNotice({pending: false, text: editingCard ? "Card updated and saved." : "Card added and saved."});
        if (!editingCard) {
          if (isProof(next.issueType)) setFilter("proofs");
          else if (next.issueType === "custom") setFilter("custom");
          else if (next.issueType === "unverified" || next.verification === "unverified") setFilter("review");
          else setFilter(!generic && /^2026\b/.test(next.product) ? "2026" : "all");
          setSearch("");
        }
        setForm(null);
        setEditingCard(null);
      } catch (error) {
        setFormError(error && error.message || "The card could not be saved. Please try again.");
      } finally { saveLock.current=false;setBusy(false); setSyncIssues(readSyncIssues(mode)); }
    }
    async function archiveCard(card) {
      if (!canEdit || (!generic && !card.isCustom) || typeof props.onArchive !== "function" || archiveBusy != null || form || saveLock.current) return;
      setArchiveBusy(card.id);
      try {
        var result = await props.onArchive(card);
        if (!result || result.ok === false) setNotice({pending: true, text: result && result.error || "Could not archive this card."});
        else if (result.cloudSaved !== true) setNotice({pending: true, text: result.error || "Archived on this device. Cloud sync is still pending.", retryArchive: card});
        else setNotice({pending: false, text: "Card archived. Its saved collection history is retained."});
      } catch (error) { setNotice({pending: true, text: error && error.message || "Could not archive this card."}); }
      finally { setArchiveId(null); setArchiveBusy(null); setSyncIssues(readSyncIssues(mode)); }
    }
    async function restoreCard(card) {
      if (!canEdit || (!generic && !card.isCustom) || !props.onRestore || archiveBusy != null || form || saveLock.current) return;
      setArchiveBusy(card.id);
      try {
        var result = await props.onRestore(card);
        if (!result || result.ok === false) setNotice({pending: true, text: result && result.error || "Could not restore this card."});
        else if (result.cloudSaved !== true) setNotice({pending: true, text: result.error || "Restored on this device. Cloud sync is still pending.", retryRestore: card});
        else setNotice({pending: false, text: "Card restored with its saved status and history."});
      } catch (error) { setNotice({pending: true, text: error && error.message || "Could not restore this card."}); }
      finally { setArchiveBusy(null); setSyncIssues(readSyncIssues(mode)); }
    }

    var coreLocked = !!(editingCard && !editingCard.isCustom && (!generic || editingCard.tcdbId || editingCard.sourceId));
    var relatedCards = form ? entries.filter(function (entry) {
      if (!window.CardCatalog.isChecklistCard(entry.card)) return false;
      if (editingCard && entry.card.id === editingCard.id) return false;
      return String(entry.card.id) === String(form.parentCardId) ||
        (!generic || cardSubject(entry.card) === form.subject) && ((form.cardNumber && String(entry.card.cardNumber) === String(form.cardNumber) && cardYear(entry.card) === (generic ? form.year : form.product.slice(0, 4))) ||
        (form.product && entry.card.product === form.product));
    }).slice(0, 100) : [];

    return (
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain text-gray-200" data-testid="card-catalog-panel">
        <div className="mx-auto w-full max-w-6xl space-y-2 pb-6">
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-2">
            <div>
              <h2 className="text-base font-bold text-yellow-300">Card catalogue</h2>
              <p className="text-xs text-gray-400">Published cards, proofs and your own additions.</p>
            </div>
            {props.isOwner && <div className="flex flex-wrap gap-1.5">
              <button type="button" disabled={!canEdit || busy || !!form} onClick={function () { openEditor(null, false); }} className={BUTTON}>+ Add card</button>
              <button type="button" disabled={!canEdit || busy || !!form} onClick={function () { openEditor(null, true); }} className="rounded border border-yellow-600 bg-yellow-500 px-2.5 py-1.5 text-xs font-bold text-gray-950 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300">+ Add proof</button>
            </div>}
          </header>

          {notice && <div role="status" className={"flex items-start justify-between gap-2 rounded border px-2.5 py-2 text-xs " + (notice.pending ? "border-amber-800 bg-amber-950/40 text-amber-200" : "border-green-800 bg-green-950/30 text-green-300")}>
            <span className="flex-1">{notice.text}</span>{notice.retryArchive && props.isOwner && <button type="button" disabled={!canEdit || archiveBusy != null || !!form} className="shrink-0 font-semibold underline" onClick={function () { archiveCard(notice.retryArchive); }}>Retry</button>}{notice.retryRestore && props.isOwner && props.onRestore && <button type="button" disabled={!canEdit || archiveBusy != null || !!form} className="shrink-0 font-semibold underline" onClick={function () { restoreCard(notice.retryRestore); }}>Retry</button>}<button type="button" className="shrink-0 underline" onClick={function () { setNotice(null); }} aria-label="Dismiss save message">Close</button>
          </div>}
          {props.isOwner && syncIssues.length > 0 && (!notice || !notice.pending) && <div role="alert" className="rounded border border-amber-800 bg-amber-950/30 px-2.5 py-2 text-xs text-amber-200">
            <p className="font-semibold">Some card changes have not synced.</p>
            {syncIssues.map(function (issue) { return <p key={issue.key} className="mt-1 break-words">{issue.key === "tb-custom-cards-v1" ? "Added cards: " : "Card details: "}{issue.error}</p>; })}
          </div>}

          {form && props.isOwner && <section ref={editorRef} className="rounded-lg border border-yellow-700/60 bg-gray-900 p-3" aria-labelledby="catalog-editor-title">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 id="catalog-editor-title" className="text-sm font-bold text-yellow-200">{editingCard ? "Edit card" : isProof(form.issueType) ? "Add a proof" : "Add a card"}</h3>
              <button type="button" className="text-xs text-gray-400 underline hover:text-white" disabled={busy} onClick={function () { setForm(null); setEditingCard(null); setFormError(""); }}>Cancel</button>
            </div>
            <form onSubmit={submitForm} className="space-y-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <label className={FIELD}>Card type<select aria-label="Card type" className={INPUT} value={form.issueType} onChange={function (event) { updateField("issueType", event.target.value); }}>{TYPES.map(function (item) { return <option key={item[0]} value={item[0]}>{item[1]}</option>; })}</select></label>
                <label className={FIELD}>Evidence<select aria-label="Evidence" className={INPUT} value={form.verification} onChange={function (event) { updateField("verification", event.target.value); }}><option value="unverified">Needs verification</option><option value="observed">Card / photo observed</option><option value="checklist">Documented checklist entry</option></select></label>
                {generic && <><label className={FIELD}>{mode === "racing" ? "Driver / subject" : "Player / subject"}<input aria-label="Card subject" className={INPUT} disabled={coreLocked} value={form.subject} onChange={function(event){updateField("subject",event.target.value);}} placeholder={mode === "racing" ? "Ryan Blaney" : "Name shown on card"} autoComplete="off" /></label><label className={FIELD}>Year<input aria-label="Card year" className={INPUT} disabled={coreLocked} inputMode="text" maxLength="9" value={form.year} onChange={function(event){updateField("year",event.target.value);}} placeholder="2024" /></label></>}
                <label className={FIELD + " sm:col-span-2"}>{generic ? "Product / set" : "Year and product"}<input aria-label={generic ? "Product / set" : "Year and product"} className={INPUT} disabled={coreLocked} value={form.product} onChange={function (event) { updateField("product", event.target.value); }} placeholder={generic ? "Panini National Treasures" : "2021 Leaf Metal Draft"} autoComplete="off" /></label>
                <label className={FIELD}>Card number<input aria-label="Card number" className={INPUT} disabled={coreLocked} value={form.cardNumber} onChange={function (event) { updateField("cardNumber", event.target.value); }} placeholder={generic ? "Card number or NNO" : "BA-TB1 or NNO"} autoComplete="off" /></label>
                <label className={FIELD}>Print run<input aria-label="Print run" className={INPUT} disabled={coreLocked} inputMode="numeric" value={form.copies} onChange={function (event) { updateField("copies", event.target.value); }} placeholder="Leave blank if unknown" autoComplete="off" /></label>
                <label className={FIELD + " sm:col-span-2"}>Exact variant<input aria-label="Exact variant" className={INPUT} disabled={coreLocked} value={form.cardSet} onChange={function (event) { updateField("cardSet", event.target.value); }} placeholder={isProof(form.issueType) ? "Pre-Production Proof Green Prismatic Unsigned" : "Base, Gold, or the full variant name"} autoComplete="off" /></label>
              </div>
              {coreLocked && <p className="text-xs text-gray-500">Set, number and variant come from the published catalogue. You can update the classification and evidence below.</p>}
              {isProof(form.issueType) && <div className="grid grid-cols-2 gap-2 rounded border border-gray-700 bg-gray-950/40 p-2">
                <label className={FIELD}>Colour<input aria-label="Proof colour" className={INPUT} value={form.proofColor} onChange={function (event) { updateField("proofColor", event.target.value); }} placeholder="Green" /></label>
                <label className={FIELD}>Finish<input aria-label="Proof finish" className={INPUT} value={form.proofFinish} onChange={function (event) { updateField("proofFinish", event.target.value); }} placeholder="Prismatic / Wave" /></label>
                <label className={FIELD}>Signature<select aria-label="Signature" className={INPUT} value={form.signature} onChange={function (event) { updateField("signature", event.target.value); }}><option value="unknown">Unknown</option><option value="signed">Signed</option><option value="unsigned">Unsigned</option></select></label>
                <label className={FIELD}>Printed serial<input aria-label="Printed serial" className={INPUT} value={form.serialMark} onChange={function (event) { updateField("serialMark", event.target.value); }} placeholder="1/1, if printed" /></label>
                <p className="col-span-2 text-xs text-gray-500">Record this exact proof. A colour, finish or signature does not establish a full proof checklist.</p>
              </div>}
              <label className={FIELD}>Photo / listing / checklist URL<input aria-label="Source URL" type="url" className={INPUT} value={form.sourceUrl} onChange={function (event) { updateField("sourceUrl", event.target.value); }} placeholder="https://…" autoComplete="off" /></label>
              <label className={FIELD}>Evidence notes<textarea aria-label="Evidence notes" className={INPUT} rows="2" value={form.evidenceNotes} onChange={function (event) { updateField("evidenceNotes", event.target.value); }} placeholder="What confirms this exact card? Note markings, label text or where you saw it." /></label>
              <details className="rounded border border-gray-700 p-2 text-xs text-gray-400">
                <summary className="cursor-pointer font-semibold text-gray-300">More card details</summary>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <label className={FIELD}>Slab / certification label<input aria-label="Certification label" className={INPUT} value={form.certification} onChange={function (event) { updateField("certification", event.target.value); }} placeholder="Optional label or certificate number" /></label>
                  <label className={FIELD}>Related checklist card<select aria-label="Related checklist card" className={INPUT} value={form.parentCardId || ""} onChange={function (event) { updateField("parentCardId", event.target.value); }}><option value="">None / not identified</option>{relatedCards.map(function (entry) { return <option key={entry.card.id} value={String(entry.card.id)}>{(generic ? cardSubject(entry.card)+" · " : "") + productLabel(entry.card) + " #" + entry.card.cardNumber + " · " + entry.card.cardSet}</option>; })}</select></label>
                  {!coreLocked && <div className="flex flex-wrap gap-x-4 gap-y-2 sm:col-span-2">
                    {[["isAuto", "Autographed"], ["isMem", "Memorabilia"], ["isRC", "Rookie card"]].map(function (item) { return <label key={item[0]} className="flex items-center gap-1.5 text-xs text-gray-300"><input type="checkbox" checked={form[item[0]] === "Yes"} onChange={function (event) { updateField(item[0], event.target.checked ? "Yes" : ""); if (item[0] === "isAuto") updateField("signature", event.target.checked ? "signed" : "unknown"); }} />{item[1]}</label>; })}
                  </div>}
                </div>
              </details>
              {formError && <div role="alert" className="rounded border border-amber-700 bg-amber-950/40 px-2 py-2 text-sm text-amber-200">{formError}</div>}
              <div className="flex flex-wrap items-center gap-2">
                <button type="submit" disabled={busy || !canEdit} className="rounded bg-yellow-400 px-4 py-2 text-sm font-bold text-gray-950 hover:bg-yellow-300 disabled:opacity-50">{busy ? "Saving…" : editingCard ? "Save changes" : "Add card"}</button>
                <span className="text-xs text-gray-500">Ownership is tracked separately after adding.</span>
              </div>
            </form>
          </section>}

          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Catalogue category">
            {categoryFilters.map(function (item) { return <button key={item[0]} type="button" aria-pressed={filter === item[0]} onClick={function () { setFilter(item[0]); }} className={"rounded border px-2.5 py-1.5 text-xs font-semibold " + (filter === item[0] ? "border-yellow-500 bg-yellow-500/10 text-yellow-200" : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200")}>{item[1]} <span className="ml-1 text-[10px] opacity-70">{counts[item[0]]}</span></button>; })}
          </div>
          {filter === "proofs" && <div className="space-y-2 rounded border border-violet-900/60 bg-violet-950/20 p-3">
            <div className="flex flex-wrap items-center gap-2"><label className="text-xs text-gray-400">Proof category <select aria-label="Proof category" value={proofTypeFilter} onChange={function(event){setProofTypeFilter(event.target.value);}} className="ml-1 rounded border border-gray-600 bg-gray-950 px-2 py-1.5 text-gray-200"><option value="all">All proofs and prototypes ({proofEntries.length})</option>{[["pre_production_proof","Pre-production proofs"],["manufacturer_proof","Other manufacturer proofs"],["prototype","Prototypes / test issues"]].map(function(item){return <option key={item[0]} value={item[0]}>{item[1]} ({proofEntries.filter(function(entry){return entry.info.issueType === item[0];}).length})</option>;})}</select></label></div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Proof signature">{[["all","All signatures"],["signed","Signed"],["unsigned","Unsigned"],["unknown","Signature unconfirmed"]].map(function(item){return <button type="button" key={item[0]} aria-pressed={proofSignatureFilter === item[0]} onClick={function(){setProofSignatureFilter(item[0]);}} className={"rounded border px-2.5 py-1.5 text-xs " + (proofSignatureFilter === item[0] ? "border-violet-400 bg-violet-950 text-violet-200" : "border-gray-700 text-gray-400")}>{item[1]} ({proofSignatureCounts[item[0]]})</button>;})}</div>
            <p className="text-xs text-gray-400">Unsigned proofs remain separate from signed proofs even when the product family includes “Autographs.” An unconfirmed signature is not treated as signed. These recorded categories do not enter standard checklist completion.</p>
          </div>}
          <div className="flex flex-wrap items-center gap-2">
            <label className="min-w-0 flex-1"><span className="sr-only">Search catalogue</span><input aria-label="Search catalogue" type="search" className={INPUT} placeholder={generic ? "Search name, year, product, card # or variant" : "Search product, card # or variant"} value={search} onChange={function (event) { setSearch(event.target.value); }} /></label>
            {generic && <><select aria-label="Catalogue subject" className={INPUT+" !w-auto max-w-56"} value={subjectFilter} onChange={function(event){setSubjectFilter(event.target.value);}}><option value="">All {mode === "racing" ? "drivers" : "subjects"}</option>{subjects.map(function(name){return <option key={name} value={name}>{name}</option>;})}</select><select aria-label="Catalogue year" className={INPUT+" !w-auto"} value={yearFilter} onChange={function(event){setYearFilter(event.target.value);}}><option value="">All years</option>{years.map(function(year){return <option key={year} value={year}>{year}</option>;})}</select></>}
            <div className="flex flex-wrap items-center gap-x-2 text-xs">
              <span className="font-semibold text-green-400">{owned} owned</span>
              <span className="font-semibold text-emerald-300">{incoming} incoming</span>
              <span className="text-gray-500">{filtered.length} {filter === "archived" ? "archived" : isOpenEnded ? "recorded" : "cards"}</span>
            </div>
          </div>
          {!generic && filter === "2026" && <details className="rounded border border-gray-800 bg-gray-900/50 px-2.5 py-2 text-xs text-gray-400">
            <summary className="cursor-pointer font-semibold text-gray-300">2026 Topps Update · #US138 · checklist sources</summary>
            <div className="mt-2 space-y-1.5 leading-relaxed">
              <p>These variants are documented for Tyler Black in published checklists. A checklist entry does not mean that every card has been photographed or offered for sale.</p>
              <p>Unknown print runs remain blank. No variants are added from a predicted colour or finish pattern.</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1"><a href="https://www.breakninja.com/baseball/2026-Topps-Update-Series-Baseball-Checklist-Milwaukee-Brewers.php" target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">Player checklist ↗</a><a href="https://www.yocardo.com/WebRoot/Store28/Shops/91062111/6AB0/D075/2373/F2D5/7C0D/0A0C/6D0F/9144/2026_Topps_Update_Series_Baseball_Checklist.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">Topps checklist PDF ↗</a><a href="https://www.checklistinsider.com/2026-topps-update-series-baseball" target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">Parallel print runs ↗</a></div>
            </div>
          </details>}
          {filter === "archived" ? <p className="text-xs leading-relaxed text-gray-500">Archived cards are excluded from active collection counts. Restore a card to bring back its saved status and history.</p> : filter !== "2026" && <p className="text-xs leading-relaxed text-gray-500">Proofs and custom cards are tracked separately from checklist completion. Unlicensed releases and printing plates can still be checklist cards.{isOpenEnded ? " Counts cover recorded cards; there is no assumed complete proof rainbow." : ""}</p>}

          <div className="overflow-hidden rounded border border-gray-800" role="list" aria-label="Catalogue cards">
            {filtered.slice(0, shown).map(function (entry) {
              var card = entry.card, info = entry.info;
              var status = statuses[card.id] || "not_owned";
              var source = safeUrl(info.sourceUrl);
              var proof = isProof(info.issueType);
              var label = window.CardCatalog.kindLabel(info.issueType);
              var pendingReview = info.verification === "unverified" || info.issueType === "unverified";
              var CardTitle = card.archived || typeof props.onOpen !== "function" ? "div" : "button";
              return <article key={card.id} role="listitem" className="border-b border-gray-800 bg-gray-900/30 px-2.5 py-2 last:border-b-0" data-card-id={card.id}>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle type={CardTitle === "div" ? undefined : "button"} onClick={CardTitle === "div" ? undefined : function () { props.onOpen(card); }} className={"min-w-0 flex-1 text-left " + (card.archived ? "text-gray-400" : "hover:text-yellow-200 focus:outline-none focus:underline")} title={card.archived ? undefined : "Open card details"}>
                    {generic && <span className="block text-xs font-semibold text-yellow-200">{cardSubject(card)}</span>}
                    <span className="block break-words text-[11px] text-gray-500">{productLabel(card).replace(/\s*\(NOT_ON_TCDB\)/g, "")} <span className="font-mono text-gray-400">#{card.cardNumber}</span></span>
                    <span className="block break-words text-sm font-medium leading-snug">{card.cardSet || "Base"}{card.copies != null && String(card.copies) !== "" && <span className="ml-1.5 whitespace-nowrap font-bold text-purple-300">{proof && pendingReview?"Recorded /"+card.copies+" · unverified":"/"+card.copies}</span>}</span>
                  </CardTitle>
                  {props.isOwner && !card.archived && typeof props.onStatusChange === "function" ? <select disabled={!canEdit} aria-label={"Status for " + card.product + " " + card.cardNumber + " " + card.cardSet} value={status === "for_sale" ? "owned" : status} onChange={function (event) { props.onStatusChange(card.id, event.target.value); }} className={"max-w-[112px] shrink-0 rounded border border-gray-700 bg-gray-950 px-1.5 py-1.5 text-xs " + (status === "owned" ? "text-green-300" : status === "in_transit" ? "text-emerald-300" : "text-gray-400")}><option value="not_owned">Not owned</option><option value="in_transit">Incoming</option><option value="owned">Owned</option></select> : <span className={"shrink-0 rounded px-1.5 py-1 text-[11px] " + (status === "owned" ? "bg-green-950 text-green-300" : status === "in_transit" ? "bg-emerald-950 text-emerald-300" : "bg-gray-800 text-gray-500")}>{status === "owned" ? "Owned" : status === "in_transit" ? "Incoming" : "Not owned"}</span>}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px]">
                  <span className={proof ? "text-purple-300" : info.issueType === "custom" ? "text-pink-300" : "text-gray-500"}>{label}</span>
                  {pendingReview ? <span className="text-amber-400">Needs verification</span> : <span className="text-gray-500">{info.verification === "observed" ? "Observed" : "Checklist documented"}</span>}
                  {proof && <span data-proof-signature={info.signature} className={info.signature === "unknown" ? "rounded bg-amber-950/40 px-1.5 py-0.5 text-amber-300" : "rounded bg-violet-950/50 px-1.5 py-0.5 text-violet-200"}>{window.CardCatalog.signatureLabel(card)}</span>}
                  {proof && !card.copies ? <span className="text-gray-500">Print run unknown</span> : null}
                  {source && <a href={source} title={source} target="_blank" rel="noopener noreferrer" className="max-w-full break-all text-blue-300 underline">{readableSource(source)} ↗</a>}
                  {props.isOwner && !card.archived && <button type="button" disabled={!canEdit || !!form || busy} onClick={function () { openEditor(card, false); }} className="ml-auto px-1 py-0.5 font-semibold text-yellow-400 hover:text-yellow-200">Edit</button>}
                  {props.isOwner && (generic || card.isCustom) && !card.archived && props.onArchive && <button disabled={!canEdit || !!form || busy} type="button" onClick={function () { setArchiveId(archiveId === card.id ? null : card.id); }} className="px-1 py-0.5 text-gray-500 hover:text-red-300">Archive</button>}
                  {props.isOwner && (generic || card.isCustom) && card.archived && props.onRestore && <button type="button" disabled={!canEdit || archiveBusy != null || !!form} onClick={function () { restoreCard(card); }} className="ml-auto rounded border border-green-800 px-2 py-1 font-semibold text-green-300 hover:bg-green-950 disabled:opacity-50">{archiveBusy === card.id ? "Restoring…" : "Restore"}</button>}
                </div>
                {(info.evidenceNotes || info.serialMark || info.certification || info.proofColor || info.proofFinish) && <details className="mt-1 text-[11px] text-gray-500"><summary className="cursor-pointer">Evidence &amp; markings</summary><div className="mt-1 space-y-1 break-words leading-relaxed">{(info.proofColor || info.proofFinish) && <p>{[info.proofColor, info.proofFinish].filter(Boolean).join(" · ")}</p>}{info.serialMark && <p>Printed serial: <span className="text-gray-300">{info.serialMark}</span></p>}{info.certification && <p>Label: {info.certification}</p>}{info.evidenceNotes && <p className="whitespace-pre-wrap">{info.evidenceNotes}</p>}</div></details>}
                {archiveId === card.id && <div className="mt-2 flex flex-wrap items-center gap-2 rounded border border-red-900 bg-red-950/30 px-2 py-2 text-xs"><span className="flex-1 text-gray-300">Hide this card? Its saved history stays attached.</span><button type="button" disabled={!canEdit || archiveBusy != null || !!form} onClick={function () { archiveCard(card); }} className="rounded bg-red-900 px-2 py-1 font-semibold text-red-100">{archiveBusy === card.id ? "Archiving…" : "Archive card"}</button><button type="button" disabled={!canEdit || archiveBusy != null || !!form} onClick={function () { setArchiveId(null); }} className="px-1 py-1 text-gray-400 underline">Cancel</button></div>}
              </article>;
            })}
            {!filtered.length && <div className="px-3 py-8 text-center text-sm text-gray-500">{search ? "No cards match this search." : "No cards recorded in this category yet."}{props.isOwner && filter === "proofs" && <div className="mt-2"><button type="button" onClick={function () { openEditor(null, true); }} className="text-yellow-300 underline">Add a proof</button></div>}</div>}
          </div>
          {shown < filtered.length && <div className="text-center"><button type="button" className={BUTTON} onClick={function () { setShown(function (value) { return value + 50; }); }}>Show next {Math.min(50, filtered.length - shown)} cards</button><span className="ml-2 text-xs text-gray-500">{shown} of {filtered.length}</span></div>}
        </div>
      </div>
    );
  }
  CardCatalogPanel.hasPending = function(){return Array.from(pendingEditors.values()).some(function(check){return check();});};
  CardCatalogPanel.rules = {cardSubject:cardSubject,cardYear:cardYear,productLabel:productLabel,syncKeys:syncKeys,makeForm:makeForm,prepareSubmission:prepareSubmission};
  window.CardCatalogPanel = CardCatalogPanel;
})();
