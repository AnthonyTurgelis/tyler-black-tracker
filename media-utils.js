/* Card photos and recorded jersey matches. No network or persistence side effects. */
(function(root) {
  "use strict";
  var KINDS = { own_photo: "Own photo", copy_scan: "My copy scan", reference: "Reference" };
  var KIND_ORDER = { own_photo: 0, copy_scan: 1, reference: 2 };
  function text(value) { return value == null ? "" : String(value).trim(); }
  function canonicalCardId(value) {
    if (typeof value === "number") return Number.isSafeInteger(value) && value > 0 ? value : null;
    if (typeof value !== "string") return null;
    value = value.trim();
    if (/^\d+$/.test(value)) { var numeric = Number(value); return Number.isSafeInteger(numeric) && numeric > 0 ? numeric : null; }
    if (/^tcdb:[1-9]\d*$/.test(value) || /^card:[A-Za-z0-9_.!~*'()%:-]+$/.test(value)) return value;
    return null;
  }
  function sameCardId(a,b) { a=canonicalCardId(a);b=canonicalCardId(b);return a != null && b != null && a === b; }
  function primaryJerseyNumber(mode, explicit) {
    if (explicit === null) return null;
    if (explicit !== undefined) return /^\d{1,3}$/.test(String(explicit)) ? Number(explicit) : null;
    return !mode || mode === "tb" || mode === "tyler" ? 7 : null;
  }
  function safeImageUrl(value) {
    try {
      var url = new URL(text(value));
      return url.protocol === "https:" && !url.username && !url.password ? url.href : "";
    } catch (_) { return ""; }
  }
  function normalizePhotos(input, options) {
    options = options || {};
    var output = [], seen = new Set();
    (Array.isArray(input) ? input : []).forEach(function(photo, index) {
      if (!photo || typeof photo !== "object") return;
      var url = safeImageUrl(photo.url);
      if (!url || seen.has(url)) return;
      var kind = KINDS[photo.kind] ? photo.kind : "reference";
      if (options.publicOnly && photo.kind !== "reference") return;
      seen.add(url);
      output.push({ id: text(photo.id) || "photo:" + index + ":" + url, url: url,
        side: photo.side === "back" ? "back" : "front", kind: kind,
        sourceUrl: safeImageUrl(photo.sourceUrl), caption: text(photo.caption),
        ...(kind === "copy_scan" && photo.context === "purchase_source" ? {context:"purchase_source"} : {}),
        ...(kind === "reference" && photo.referenceScope === "exact_variant" && canonicalCardId(photo.referenceCardId) != null ? {referenceScope:"exact_variant",referenceCardId:canonicalCardId(photo.referenceCardId)} : {}) });
    });
    return output;
  }
  // Use smaller COMC and eBay reference scans for gallery thumbnails.
  // Keep the exact original URL for the full-screen card viewer.
  function thumbnailUrl(photo) {
    var original = safeImageUrl(photo && photo.url);
    if (!original) return "";
    try {
      var u = new URL(original);
      if (u.hostname.toLowerCase() === "img.comc.com"
          && /^\/i\/[^/]+\//.test(u.pathname)
          && ["original", "zoom"].indexOf(u.searchParams.get("size")) >= 0) {
        u.searchParams.set("size", "biggerthumb");
        return u.href;
      }
      // An eBay seller scan displayed in a 120px gallery tile should not fetch
      // a 1600px listing image. The card viewer still opens the original URL.
      if (u.hostname.toLowerCase() === "i.ebayimg.com"
          && /^\/images\/g\/[^/]+\/s-l(?:1200|1600)\.(?:webp|jpe?g)$/i.test(u.pathname)) {
        u.pathname = u.pathname.replace(/\/s-l(?:1200|1600)\./i, "/s-l500.");
        return u.href;
      }
    } catch (_) {}
    return original;
  }
  function preferredPhotos(input) {
    return normalizePhotos(input).map(function(photo, index) { return { photo: photo, index: index }; })
      .sort(function(a, b) { return KIND_ORDER[a.photo.kind] - KIND_ORDER[b.photo.kind] || (a.photo.side === "back" ? 1 : 0) - (b.photo.side === "back" ? 1 : 0) || a.index - b.index; })
      .map(function(entry) { return entry.photo; });
  }
  function mergePhotos(existing, incoming) {
    var photos = normalizePhotos(existing), indexes = {};
    photos.forEach(function(photo, index) { indexes[photo.url] = index; });
    normalizePhotos(incoming).forEach(function(photo) {
      var index = indexes[photo.url];
      if (index == null) { indexes[photo.url] = photos.length; photos.push(photo); return; }
      var old = photos[index];
      photos[index] = Object.assign({}, photo, old, {
        kind: KIND_ORDER[old.kind] <= KIND_ORDER[photo.kind] ? old.kind : photo.kind,
        sourceUrl: old.sourceUrl || photo.sourceUrl, caption: old.caption || photo.caption
      });
    });
    return preferredPhotos(photos);
  }
  function normalizePublicMedia(input, options) {
    options = options || {};
    if (typeof input === "string") { try { input = JSON.parse(input); } catch (_) { input = {}; } }
    var output = { version: 1, cards: {} };
    Object.entries(input && input.cards || {}).forEach(function(entry) {
      var id = canonicalCardId(entry[0]);
      if (id == null) return;
      var photos = normalizePhotos(entry[1] && entry[1].photos, { publicOnly: true });
      var record = entry[1] || {}, item = {photos:photos};
      var evidence = record.secondaryJerseyEvidence || {};
      var secondary = {photos:photos,secondaryJerseyNumber:text(record.secondaryJerseyNumber),secondaryJerseyEvidence:{photoId:text(evidence.photoId),sourceUrl:safeImageUrl(evidence.sourceUrl),note:text(evidence.note),confirmed:evidence.confirmed === true}};
      if (secondaryEvidence(secondary,options.primaryJerseyNumber) != null) { item.secondaryJerseyNumber = secondary.secondaryJerseyNumber; item.secondaryJerseyEvidence = secondary.secondaryJerseyEvidence; }
      if (photos.length || item.secondaryJerseyNumber) output.cards[id] = item;
    });
    return output;
  }
  // Scoped references are private. Preserve source metadata and fail closed on
  // malformed input so a save cannot silently discard another card's records.
  function normalizeScopedMedia(input) {
    if (input == null) return {version:1,cards:{}};
    if (typeof input === "string") { try {input=JSON.parse(input);} catch (_) {throw Error("Private card photos could not be read. Refresh before saving.");} }
    if (!input || typeof input !== "object" || Array.isArray(input) || input.version !== 1 || !input.cards || typeof input.cards !== "object" || Array.isArray(input.cards)) throw Error("Private card photos need review. Nothing was replaced.");
    var output=JSON.parse(JSON.stringify(input));
    Object.entries(output.cards).forEach(function(entry) {
      var id=canonicalCardId(entry[0]),record=entry[1],seen=new Set();
      if(id==null || !record || typeof record !== "object" || Array.isArray(record) || !Array.isArray(record.photos)) throw Error("A card photo record is invalid. Nothing was replaced.");
      record.photos=record.photos.map(function(photo){
        if(!photo || photo.kind!=="reference" || !safeImageUrl(photo.url) || photo.sourceUrl && !safeImageUrl(photo.sourceUrl) || photo.side && !["front","back"].includes(photo.side)) throw Error("Card references require valid HTTPS image and source links, labelled front or back.");
        if(seen.has(safeImageUrl(photo.url))) throw Error("The same image URL is repeated. Keep one reference for each image.");
        seen.add(safeImageUrl(photo.url));
        if(photo.referenceCardId != null && !sameCardId(photo.referenceCardId,id)) throw Error("A reference image belongs to a different catalog card.");
        return Object.assign({},photo);
      });
    });
    return output;
  }
  function setCardReferences(input, cardId, value, options) {
    options=options || {};cardId=canonicalCardId(cardId);
    if(cardId==null) throw Error("Choose an exact catalog card before saving references.");
    var output=normalizeScopedMedia(input),previous=output.cards[cardId] || {photos:[]};
    var photos=(value && value.photos || []).filter(function(photo){return text(photo.url);}).map(function(photo){
      if(photo.kind && photo.kind!=="reference")throw Error("Keep physical-copy photos in Copies; card references must be labelled Reference.");
      if(photo.referenceCardId != null && !sameCardId(photo.referenceCardId,cardId))throw Error("A reference image belongs to a different catalog card.");
      return Object.assign({},photo,{kind:"reference",referenceScope:"exact_variant",referenceCardId:cardId});
    });
    var next=Object.assign({},previous,{photos:photos});
    var number=text(value && value.secondaryJerseyNumber),evidence=value && value.secondaryJerseyEvidence || {};
    if(number) {
      var candidate={photos:photos,secondaryJerseyNumber:number,secondaryJerseyEvidence:evidence};
      if(secondaryEvidence(candidate,options.primaryJerseyNumber) == null) throw Error("Confirm the jersey number using a reference photo or an HTTPS evidence link with a note.");
      next.secondaryJerseyNumber=number;next.secondaryJerseyEvidence=JSON.parse(JSON.stringify(evidence));
    } else {delete next.secondaryJerseyNumber;delete next.secondaryJerseyEvidence;}
    output.cards[cardId]=next;
    return normalizeScopedMedia(output);
  }
  function exactVariantPhotos(cardId, publicMedia) {
    cardId = canonicalCardId(cardId);
    if (cardId == null) return [];
    var item = publicMedia && publicMedia.cards && publicMedia.cards[cardId];
    return normalizePhotos(item && item.photos,{publicOnly:true}).map(function(photo) {
      return Object.assign({},photo,{referenceScope:"exact_variant",referenceCardId:cardId});
    });
  }
  function photosForCopy(record, cardId, publicMedia) { return mergePhotos(record && record.photos,exactVariantPhotos(cardId,publicMedia)); }
  // Marketplace scans remain source photos, even after an observation is linked
  // to a counted copy. Linking a source does not make its image a personal scan.
  function isExternalSourceScan(photo) {
    if (!photo || photo.kind !== "copy_scan") return false;
    var image = text(photo.url), source = text(photo.sourceUrl), id = text(photo.id);
    return /^https:\/\/(?:img\.comc\.com|i\.ebayimg\.com)\//i.test(image)
      || /^https:\/\/(?:www\.)?(?:comc\.com|ebay\.(?:com|ca|co\.uk))\//i.test(source)
      || /^(?:comc:|ebay:|second-pass:)/i.test(id);
  }
  function photoSourceLabel(photo) { return photo && photo.kind === "reference" && photo.referenceScope === "exact_variant" ? "Reference / exact variant" : photo && photo.kind === "copy_scan" && photo.context === "purchase_source" ? "Purchase source photo" : KINDS[photo && photo.kind] || "Reference"; }
  var REVIEW_LABELS = {identity:"Identity pending",duplicate:"Copy overlap / extras",serial:"Serial to verify",location:"Location unconfirmed",purchase:"Purchase status",copy_match:"Copy match pending"};
  function reviewFlags(observation) {
    observation = observation || {};
    var categories = Array.isArray(observation.reviewCategories) ? observation.reviewCategories : [];
    var sourceConflicts = observation.needsSourceReview ? (observation.conflictingEvidence || []).reduce(function(all,row){return all.concat(row.conflicts || []);},[]) : [];
    var candidateIds = Array.from(new Set((observation.candidateCardIds || []).map(canonicalCardId).filter(function(id){return id != null;})));
    var exactConfidence = ["exact_normalized_metadata","high_reviewed_alias","high_reviewed_name_match","scan_verified_identity","image_verified","image_reviewed_proof_identity","exact_catalogue_identity","confirmed"].includes(observation.identityConfidence);
    var identityConfirmed = sourceConflicts.indexOf("cardId") < 0 && canonicalCardId(observation.cardId) != null && (!!observation.matchedCopyId || observation.identityConfirmed === true || observation.identityStatus === "confirmed" || observation.identityConfirmed !== false && !observation.identityStatus && !categories.includes("identity") && candidateIds.every(function(id){return sameCardId(id,observation.cardId);}) && exactConfidence);
    var decision = text(observation.reconciliationDecision);
    var copyMatch = !observation.matchedCopyId && !["ignored","split"].includes(observation.disposition);
    return {identity:!identityConfirmed,identityConfirmed:identityConfirmed,copy_match:copyMatch,
      duplicate:categories.includes("duplicate") || observation.duplicateGroupConfirmed === true || ["no_exact_serial_or_comc_date_and_price_match","manual_owned_preserved","legacy_baseline_slot_already_linked","different_serial_requires_copy_review"].includes(decision),
      serial:sourceConflicts.indexOf("serial") >= 0 || categories.includes("serial") || observation.serialConflict === true || decision === "different_serial_requires_copy_review" || !!(observation.reportedSerial || observation.tentativeSerial) && !(observation.serial && credibleSerial(observation)),
      location:categories.includes("location") || !observation.location || observation.location === "unknown",
      purchase:observation.needsSourceReview === true || categories.includes("purchase") || categories.includes("retention") || observation.refundOrCancellationReview === true || observation.retainedCopyStatus === "unresolved"};
  }
  function observationPhotoPlan(observation, cardById, publicMedia) {
    observation = observation || {}; cardById = cardById || {};
    var flags = reviewFlags(observation), card = cardById[observation.cardId];
    var confirmed = !!card && flags.identityConfirmed;
    var ids = confirmed ? [] : Array.from(new Set((observation.candidateCardIds || []).concat(observation.cardId || []).map(canonicalCardId).filter(function(id){return id != null;})));
    var sourcePhotos = preferredPhotos(observation.photos).map(function(photo){return photo.kind === "copy_scan" && !observation.matchedCopyId ? Object.assign({},photo,{context:"purchase_source"}) : photo;});
    return {identityConfirmed:confirmed,card:confirmed ? card : null,
      photos:confirmed ? mergePhotos(sourcePhotos,exactVariantPhotos(card.id,publicMedia)) : sourcePhotos,
      candidates:ids.filter(function(id){return !!cardById[id];}).map(function(id){return {card:cardById[id],photos:exactVariantPhotos(id,publicMedia)};})};
  }
  function observationFacts(observation) {
    observation = observation || {};
    var observed = Array.isArray(observation.observedCards) && observation.observedCards.length === 1 ? observation.observedCards[0] : {};
    return {issueType:observed.issueType || observation.issueType || "",signature:observed.signature || observation.signature || "unknown",serialMark:observed.serialMark || "",variantDescription:observed.variantDescription || "",yearEvidence:observed.yearEvidence || "",cardSet:"",isCustom:true,verification:"observed"};
  }
  function observationMatchesScope(observation, scope, cardById, catalog) {
    if (!scope || scope === "all") return true;
    catalog = catalog || root && root.CardCatalog;
    if (!catalog) return true;
    var card = cardById[observation.cardId], facts = observationFacts(observation);
    if (card && reviewFlags(observation).identityConfirmed) return catalog.matchesScope(card,scope);
    if (facts.issueType) return catalog.matchesScope(facts,scope);
    return Array.from(new Set((observation.candidateCardIds || []).concat(observation.cardId || []))).some(function(id){return cardById[id] && catalog.matchesScope(cardById[id],scope);});
  }
  function serialNumbers(value) {
    var result = [];
    text(value).replace(/\u2212/g, "-").split(/[,;|\n]+|\s+(?:&|and)\s+/i).forEach(function(part) {
      var match = part.trim().match(/^#?\s*(-?\d+)\s*(?:\/\s*-?\d+)?$/);
      if (!match) return;
      var number = Number(match[1]);
      if (Number.isSafeInteger(number) && result.indexOf(number) < 0) result.push(number);
    });
    return result;
  }
  function credibleSerial(record) {
    var evidence = text(record && record.serialEvidence).toLowerCase();
    return !/(?:title|reported|unverified|tentative|uncertain)/.test(evidence);
  }
  function secondaryEvidence(record, primaryJerseyNumber) {
    record = record || {};
    var evidence = record.secondaryJerseyEvidence || {};
    var numberText = text(record.secondaryJerseyNumber);
    var number = /^\d{1,3}$/.test(numberText) ? Number(numberText) : null;
    if (number == null || number === (primaryJerseyNumber === undefined ? 7 : primaryJerseyNumber) || evidence.confirmed !== true) return null;
    var photoExists = !!evidence.photoId && normalizePhotos(record.photos).some(function(photo) { return photo.id === evidence.photoId; });
    if (!photoExists && !(safeImageUrl(evidence.sourceUrl) && text(evidence.note))) return null;
    return number;
  }
  function jerseyMatches(record, legacySerial, cardMedia, primaryJerseyNumber) {
    record = record || {};
    var numbers = credibleSerial(record) ? serialNumbers(record.serial) : [];
    serialNumbers(legacySerial).forEach(function(number) { if (numbers.indexOf(number) < 0) numbers.push(number); });
    var secondaryNumber = secondaryEvidence(text(record.secondaryJerseyNumber) ? record : cardMedia,primaryJerseyNumber);
    return { primary: primaryJerseyNumber !== null && numbers.indexOf(primaryJerseyNumber === undefined ? 7 : Number(primaryJerseyNumber)) >= 0, secondary: secondaryNumber != null && numbers.indexOf(secondaryNumber) >= 0, secondaryNumber: secondaryNumber, serialNumbers: numbers };
  }
  function comcDuplicateGroups(input) {
    var groups = {};
    Object.values(input && input.observations || {}).forEach(function(observation) {
      if (!observation || String(observation.source).toLowerCase() !== "comc" || observation.currentInventory !== true || observation.duplicateGroupConfirmed !== true) return;
      var cardId = canonicalCardId(observation.cardId), count = Number(observation.comcGroupCount);
      if (cardId == null || !Number.isSafeInteger(count) || count < 2) return;
      if (!groups[cardId]) groups[cardId] = { cardId: cardId, count: count, minimumExtras: count - 1, observations: [] };
      var group = groups[cardId];
      group.count = Math.max(group.count, count);
      group.minimumExtras = group.count - 1;
      group.observations.push(observation);
    });
    return Object.values(groups).sort(function(a, b) { return b.minimumExtras - a.minimumExtras || String(a.cardId).localeCompare(String(b.cardId),undefined,{numeric:true}); });
  }
  var api = { KINDS: KINDS, safeImageUrl: safeImageUrl, thumbnailUrl: thumbnailUrl, normalizePhotos: normalizePhotos, preferredPhotos: preferredPhotos,
    mergePhotos: mergePhotos, normalizePublicMedia: normalizePublicMedia, normalizeScopedMedia:normalizeScopedMedia,setCardReferences:setCardReferences,canonicalCardId:canonicalCardId,sameCardId:sameCardId,primaryJerseyNumber:primaryJerseyNumber,serialNumbers: serialNumbers,
    exactVariantPhotos:exactVariantPhotos,photosForCopy:photosForCopy,photoSourceLabel:photoSourceLabel,isExternalSourceScan:isExternalSourceScan,REVIEW_LABELS:REVIEW_LABELS,reviewFlags:reviewFlags,observationPhotoPlan:observationPhotoPlan,observationFacts:observationFacts,observationMatchesScope:observationMatchesScope,
    credibleSerial: credibleSerial, secondaryEvidence: secondaryEvidence, jerseyMatches: jerseyMatches, comcDuplicateGroups: comcDuplicateGroups };
  if (root) root.TrackerMedia = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : null);
