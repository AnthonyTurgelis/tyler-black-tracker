/* Card photos and recorded jersey matches. No network or persistence side effects. */
(function(root) {
  "use strict";
  var KINDS = { own_photo: "Own photo", copy_scan: "My copy scan", reference: "Reference" };
  var KIND_ORDER = { own_photo: 0, copy_scan: 1, reference: 2 };
  function text(value) { return value == null ? "" : String(value).trim(); }
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
        ...(kind === "reference" && photo.referenceScope === "exact_variant" && Number.isSafeInteger(Number(photo.referenceCardId)) && Number(photo.referenceCardId) > 0 ? {referenceScope:"exact_variant",referenceCardId:Number(photo.referenceCardId)} : {}) });
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
          && u.pathname.indexOf("/i/Baseball/") === 0
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
  function normalizePublicMedia(input) {
    if (typeof input === "string") { try { input = JSON.parse(input); } catch (_) { input = {}; } }
    var output = { version: 1, cards: {} };
    Object.entries(input && input.cards || {}).forEach(function(entry) {
      var id = Number(entry[0]);
      if (!Number.isSafeInteger(id) || id < 1) return;
      var photos = normalizePhotos(entry[1] && entry[1].photos, { publicOnly: true });
      var record = entry[1] || {}, item = {photos:photos};
      var evidence = record.secondaryJerseyEvidence || {};
      var secondary = {photos:photos,secondaryJerseyNumber:text(record.secondaryJerseyNumber),secondaryJerseyEvidence:{photoId:text(evidence.photoId),sourceUrl:safeImageUrl(evidence.sourceUrl),note:text(evidence.note),confirmed:evidence.confirmed === true}};
      if (secondaryEvidence(secondary) != null) { item.secondaryJerseyNumber = secondary.secondaryJerseyNumber; item.secondaryJerseyEvidence = secondary.secondaryJerseyEvidence; }
      if (photos.length || item.secondaryJerseyNumber) output.cards[id] = item;
    });
    return output;
  }
  function exactVariantPhotos(cardId, publicMedia) {
    cardId = Number(cardId);
    if (!Number.isSafeInteger(cardId) || cardId < 1) return [];
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
    var candidateIds = Array.from(new Set((observation.candidateCardIds || []).map(Number).filter(function(id){return Number.isSafeInteger(id) && id > 0;})));
    var exactConfidence = ["exact_normalized_metadata","high_reviewed_alias","high_reviewed_name_match","scan_verified_identity","image_verified","image_reviewed_proof_identity","exact_catalogue_identity","confirmed"].includes(observation.identityConfidence);
    var identityConfirmed = !!observation.cardId && (!!observation.matchedCopyId || observation.identityConfirmed === true || observation.identityStatus === "confirmed" || observation.identityConfirmed !== false && !observation.identityStatus && !categories.includes("identity") && candidateIds.every(function(id){return id === Number(observation.cardId);}) && exactConfidence);
    var decision = text(observation.reconciliationDecision);
    var copyMatch = !observation.matchedCopyId && !["ignored","split"].includes(observation.disposition);
    return {identity:!identityConfirmed,identityConfirmed:identityConfirmed,copy_match:copyMatch,
      duplicate:categories.includes("duplicate") || observation.duplicateGroupConfirmed === true || ["no_exact_serial_or_comc_date_and_price_match","manual_owned_preserved","legacy_baseline_slot_already_linked","different_serial_requires_copy_review"].includes(decision),
      serial:categories.includes("serial") || observation.serialConflict === true || decision === "different_serial_requires_copy_review" || !!(observation.reportedSerial || observation.tentativeSerial) && !(observation.serial && credibleSerial(observation)),
      location:categories.includes("location") || !observation.location || observation.location === "unknown",
      purchase:categories.includes("purchase") || categories.includes("retention") || observation.refundOrCancellationReview === true || observation.retainedCopyStatus === "unresolved"};
  }
  function observationPhotoPlan(observation, cardById, publicMedia) {
    observation = observation || {}; cardById = cardById || {};
    var flags = reviewFlags(observation), card = cardById[observation.cardId];
    var confirmed = !!card && flags.identityConfirmed;
    var ids = confirmed ? [] : Array.from(new Set((observation.candidateCardIds || []).concat(observation.cardId || []).map(Number)));
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
  function secondaryEvidence(record) {
    record = record || {};
    var evidence = record.secondaryJerseyEvidence || {};
    var numberText = text(record.secondaryJerseyNumber);
    var number = /^\d{1,3}$/.test(numberText) ? Number(numberText) : null;
    if (number == null || number === 7 || evidence.confirmed !== true) return null;
    var photoExists = !!evidence.photoId && normalizePhotos(record.photos).some(function(photo) { return photo.id === evidence.photoId; });
    if (!photoExists && !(safeImageUrl(evidence.sourceUrl) && text(evidence.note))) return null;
    return number;
  }
  function jerseyMatches(record, legacySerial, cardMedia) {
    record = record || {};
    var numbers = credibleSerial(record) ? serialNumbers(record.serial) : [];
    serialNumbers(legacySerial).forEach(function(number) { if (numbers.indexOf(number) < 0) numbers.push(number); });
    var secondaryNumber = secondaryEvidence(text(record.secondaryJerseyNumber) ? record : cardMedia);
    return { primary: numbers.indexOf(7) >= 0, secondary: secondaryNumber != null && numbers.indexOf(secondaryNumber) >= 0, secondaryNumber: secondaryNumber, serialNumbers: numbers };
  }
  function comcDuplicateGroups(input) {
    var groups = {};
    Object.values(input && input.observations || {}).forEach(function(observation) {
      if (!observation || String(observation.source).toLowerCase() !== "comc" || observation.currentInventory !== true || observation.duplicateGroupConfirmed !== true) return;
      var cardId = Number(observation.cardId), count = Number(observation.comcGroupCount);
      if (!Number.isSafeInteger(cardId) || cardId < 1 || !Number.isSafeInteger(count) || count < 2) return;
      if (!groups[cardId]) groups[cardId] = { cardId: cardId, count: count, minimumExtras: count - 1, observations: [] };
      var group = groups[cardId];
      group.count = Math.max(group.count, count);
      group.minimumExtras = group.count - 1;
      group.observations.push(observation);
    });
    return Object.values(groups).sort(function(a, b) { return b.minimumExtras - a.minimumExtras || a.cardId - b.cardId; });
  }
  var api = { KINDS: KINDS, safeImageUrl: safeImageUrl, thumbnailUrl: thumbnailUrl, normalizePhotos: normalizePhotos, preferredPhotos: preferredPhotos,
    mergePhotos: mergePhotos, normalizePublicMedia: normalizePublicMedia, serialNumbers: serialNumbers,
    exactVariantPhotos:exactVariantPhotos,photosForCopy:photosForCopy,photoSourceLabel:photoSourceLabel,isExternalSourceScan:isExternalSourceScan,REVIEW_LABELS:REVIEW_LABELS,reviewFlags:reviewFlags,observationPhotoPlan:observationPhotoPlan,observationFacts:observationFacts,observationMatchesScope:observationMatchesScope,
    credibleSerial: credibleSerial, secondaryEvidence: secondaryEvidence, jerseyMatches: jerseyMatches, comcDuplicateGroups: comcDuplicateGroups };
  if (root) root.TrackerMedia = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : null);
