/* Per-copy inventory. Pure functions only: storage and authentication belong to the caller. */
(function (root) {
  "use strict";
  var media = root && root.TrackerMedia || (typeof require === "function" ? require("./media-utils.js") : null);
  var LOCATIONS = { in_hand: "In hand", comc: "COMC", in_transit: "In transit", unknown: "Unknown" };
  // Read historical mailbox entries as in-transit while preserving source evidence and copy identity.
  function canonicalCopy(copy) { return copy && copy.location === "oklahoma_mailbox" ? Object.assign({}, copy, { location: "in_transit" }) : copy; }
  var SALE_STATUSES = { none: "Keep", review: "Review for sale", listed: "Already listed", sold: "Sold" };
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function canonicalCardId(value) {
    if (media && media.canonicalCardId) return media.canonicalCardId(value);
    if ((typeof value === "number" || typeof value === "string" && /^[1-9]\d*$/.test(value)) && Number.isSafeInteger(Number(value)) && Number(value)>0) return Number(value);
    return typeof value === "string" && (/^tcdb:[1-9]\d*$/.test(value) || /^card:[^\s]+$/.test(value)) ? value : null;
  }
  function sameCardId(a,b) { var left=canonicalCardId(a),right=canonicalCardId(b);return left!==null && right!==null && left===right; }
  function nowIso(value) { return value || new Date().toISOString(); }
  function text(value) { return value == null ? "" : String(value).trim(); }
  function inferredCurrency(item) {
    item = item || {};
    var destination = item.shippingCountry || item.shipToCountry || item.deliveryCountry || item.destinationCountry || item.shipCountry;
    if (!destination && item.shippingAddress && typeof item.shippingAddress === "object")
      destination = item.shippingAddress.countryCode || item.shippingAddress.country;
    var country = text(destination).toLowerCase().replace(/\./g, "");
    if (country === "ca" || country === "can" || country === "canada") return "CAD";
    if (country === "us" || country === "usa" || country === "united states" || country === "united states of america") return "USD";
    return "";
  }
  function normalizeState(value) {
    value = value && typeof value === "object" ? value : {};
    return Object.assign({}, value, { version: value.version || 1, baselines: Object.assign({}, value.baselines || {}), copies: Object.assign({}, value.copies || {}), observations: Object.assign({}, value.observations || {}), updatedAt: value.updatedAt || "" });
  }
  function mergeStates(left, right) {
    var a = normalizeState(left), b = normalizeState(right), out = normalizeState(a);
    ["baselines", "copies", "observations"].forEach(function (field) {
      Object.keys(b[field]).forEach(function (id) {
        if (!out[field][id] || (Date.parse(b[field][id].updatedAt) || 0) >= (Date.parse(out[field][id].updatedAt) || 0)) out[field][id] = clone(b[field][id]);
      });
    });
    out.updatedAt = (Date.parse(a.updatedAt) || 0) > (Date.parse(b.updatedAt) || 0) ? a.updatedAt : b.updatedAt;
    return out;
  }
  function legacyQuantity(cardId, statuses, details) {
    var d = (details || {})[cardId] || {}, s = (statuses || {})[cardId];
    if (d.qty != null && d.qty !== "" && !isNaN(parseInt(d.qty, 10))) return Math.max(0, parseInt(d.qty, 10));
    if (d.ownedQty != null || d.transitQty != null) return Math.max(0,Number(d.ownedQty)||0)+Math.max(0,Number(d.transitQty)||0);
    return s === "owned" || s === "in_transit" || s === "for_sale" ? 1 : 0;
  }
  function baselineFor(state, cardId, statuses, details) {
    return hasStoredCopies(state, cardId) && state.baselines[cardId] || { cardId: canonicalCardId(cardId), quantity: legacyQuantity(cardId, statuses, details), status: (statuses || {})[cardId] || "not_owned", details: clone((details || {})[cardId] || {}), updatedAt: "" };
  }
  function hasStoredCopies(state, cardId) { return Object.values(state.copies || {}).some(function(copy) { return sameCardId(copy.cardId,cardId); }); }
  function ensureBaseline(state, cardId, context, at) {
    if (!state.baselines[cardId] || !hasStoredCopies(state, cardId)) state.baselines[cardId] = Object.assign({}, baselineFor(state, cardId, context.statuses, context.cardDetails), { updatedAt: at });
  }
  function getCopiesForCard(input, cardId, statuses, details) {
    if(canonicalCardId(cardId)===null)return [];
    var state = normalizeState(input), baseline = baselineFor(state, cardId, statuses, details), rows = [], seen = new Set();
    for (var unit = 1; unit <= baseline.quantity; unit++) {
      var id = "legacy:" + cardId + ":" + unit;
      var copy = state.copies[id];
      seen.add(id);
      if (copy) { if (!copy.archived) rows.push(canonicalCopy(copy)); continue; }
      var split=baseline.details || {},owned=Number(split.ownedQty),transit=Number(split.transitQty),legacyStatus=baseline.status;
      if(Number.isSafeInteger(owned)&&owned>=0&&Number.isSafeInteger(transit)&&transit>=0&&owned+transit===baseline.quantity)legacyStatus=unit<=owned?"owned":"in_transit";
      rows.push({ id: id, cardId: canonicalCardId(cardId), origin: "legacy", location: "unknown", legacyStatus: legacyStatus, legacyUnit: unit, unallocated: true, serial: "", paidPrice: "", currency: "", purchaseDate: "", sourceRefs: [], duplicateConfirmed: false, saleStatus: "none", legacyDetails: baseline.details, createdAt: "", updatedAt: "" });
    }
    Object.keys(state.copies).forEach(function (id) {
      var copy = state.copies[id];
      if (sameCardId(copy.cardId,cardId) && !seen.has(id) && !copy.archived) rows.push(canonicalCopy(copy));
    });
    return rows;
  }
  function isCountedCopy(copy) {
    if (!copy || copy.archived || copy.saleStatus === "sold" || copy.currentInventory === false) return false;
    if (copy.currentInventory === true) return true;
    // Missing confirmation on an imported eBay purchase is NOT permission to
    // increase the collection. Manually tracked copies and COMC stay intact.
    if (copy.origin === "purchase" && (
      String(copy.source || "").toLowerCase() === "ebay" ||
      String(copy.id || "").indexOf("purchase:ebay:") === 0 ||
      /ebay\.(com|ca|co\.uk)/i.test(String(copy.sourceUrl || ""))
    )) return false;
    return true;
  }
  function copyStatus(copy) {
    if (!isCountedCopy(copy)) return "excluded";
    if (copy.location === "in_hand") return "owned";
    if (["comc", "in_transit", "oklahoma_mailbox"].includes(copy.location)) return "in_transit";
    if (copy.origin === "legacy" && copy.unallocated) {
      if (["owned", "for_sale"].includes(copy.legacyStatus)) return "owned";
      if (copy.legacyStatus === "in_transit") return "in_transit";
    }
    if (copy.origin === "purchase" && copy.location === "unknown") return "in_transit";
    return "unknown";
  }
  function summarizeCard(input, cardId, statuses, details) {
    var state = normalizeState(input), copies = getCopiesForCard(state, cardId, statuses, details), locations = {};
    Object.keys(LOCATIONS).forEach(function (key) { locations[key] = 0; });
    var active = copies.filter(isCountedCopy);
    active.forEach(function (copy) { locations[LOCATIONS[copy.location] ? copy.location : "unknown"]++; });
    var legacyStatus = (statuses || {})[cardId] || baselineFor(state, cardId, statuses, details).status;
    var legacyOwned = legacyStatus === "owned" || legacyStatus === "for_sale" || active.some(function(c){return c.origin==="legacy"&&(c.legacyStatus==="owned"||c.legacyStatus==="for_sale");});
    var legacyUnallocated = active.some(function(copy) { return copy.origin === "legacy" && (copy.unallocated || copy.location === "unknown"); });
    // The manual mark remains intact. Explicit copies add independent status flags,
    // so a variant can be present in both Owned and In Transit without counting twice.
    var owned = legacyOwned && (!hasStoredCopies(state, cardId) || legacyUnallocated || !active.length) || locations.in_hand > 0;
    // Owned retains its established meaning of in hand. Confirmed copies elsewhere
    // are acquired but awaiting receipt, including a purchased copy with unknown location.
    var legacyAwaiting = (legacyStatus === "in_transit" || active.some(function(c){return c.origin==="legacy"&&c.legacyStatus==="in_transit"&&c.unallocated;})) && (!hasStoredCopies(state, cardId) || legacyUnallocated);
    var inTransit = legacyAwaiting || locations.in_transit > 0 || locations.comc > 0 || active.some(function(c) { return c.origin !== "legacy" && c.location === "unknown"; });
    var ownedQty=active.filter(function(copy){return copyStatus(copy)==="owned";}).length;
    var transitQty=active.filter(function(copy){return copyStatus(copy)==="in_transit";}).length;
    return { total: active.length, ownedQty:ownedQty, transitQty:transitQty, unknownQty:active.length-ownedQty-transitQty, locations: locations, unallocated: active.filter(function (c) { return c.origin === "legacy" && c.unallocated; }).length, hasInHand: locations.in_hand > 0, hasInTransit: locations.in_transit > 0, hasComc: locations.comc > 0, legacyStatus: legacyStatus, legacyOwned: legacyOwned, owned: owned, inTransit: inTransit, acquired: owned || inTransit, notOwned: !owned && !inTransit, managed: hasStoredCopies(state, cardId), saleReview: active.filter(needsSaleReview).length, listed: active.filter(function (c) { return c.saleStatus === "listed"; }).length };
  }
  function visitCardInventories(input,cards,visit) {
    var state=normalizeState(input),index=new Map();
    function include(cardId,key,copy){
      var id=canonicalCardId(cardId);if(id===null)return;
      if(!index.has(id))index.set(id,Object.create(null));index.get(id)[key]=copy;
    }
    Object.keys(state.copies).forEach(function(key){
      var copy=state.copies[key];include(copy.cardId,key,copy);
      // Existing legacy slots are addressed by their saved key as well as their
      // cardId. Retaining both associations preserves summarizeCard exactly.
      var anchor=key.match(/^legacy:(.+):([1-9]\d*)$/);if(anchor)include(anchor[1],key,copy);
    });
    (cards||[]).forEach(function(card){
      var cardId=card&&typeof card==='object'?card.id:card,baselines=Object.create(null);
      if(Object.prototype.hasOwnProperty.call(state.baselines,cardId))baselines[cardId]=state.baselines[cardId];
      visit(card,cardId,{version:state.version,baselines:baselines,copies:index.get(canonicalCardId(cardId))||{},observations:{},updatedAt:state.updatedAt});
    });
  }
  function copiesForCards(input,cards,statuses,details) {
    var rows=[];
    visitCardInventories(input,cards,function(card,id,inventory){
      getCopiesForCard(inventory,id,statuses,details).forEach(function(copy){ rows.push({card:card,copy:copy}); });
    });
    return rows;
  }
  function summarizeCards(input,cards,statuses,details) {
    var summaries=Object.create(null);
    visitCardInventories(input,cards,function(card,id,inventory){
      summaries[String(id)]=summarizeCard(inventory,id,statuses,details);
    });
    return summaries;
  }
  function matchesStatus(summary, filter, forSale) {
    if (filter === "all") return true;
    if (filter === "owned") return summary.owned;
    if (filter === "in_transit") return summary.inTransit;
    if (filter === "acquired") return summary.acquired;
    if (filter === "not_owned") return summary.notOwned;
    if (filter === "for_sale") return summary.acquired && (!!forSale || summary.saleReview > 0 || summary.listed > 0);
    return false;
  }
  function countCards(summaries) {
    return (summaries || []).reduce(function(out, summary) {
      out.total++;
      if (summary.owned) out.owned++;
      if (summary.inTransit) out.inTransit++;
      if (summary.acquired) out.acquired++; else out.notOwned++;
      return out;
    }, { total: 0, owned: 0, inTransit: 0, acquired: 0, notOwned: 0 });
  }
  function needsSaleReview(copy) { return !copy.archived && copy.location === "comc" && copy.duplicateConfirmed === true && copy.saleStatus !== "listed" && copy.saleStatus !== "sold"; }
  function normalizeSerial(value) { return text(value).toLowerCase().replace(/\s/g, ""); }
  function sameSerial(a, b) {
    var x = normalizeSerial(a), y = normalizeSerial(b);
    if (!x || !y) return false;
    var xa = x.split("/"), ya = y.split("/");
    if (!/^-?\d+$/.test(xa[0]) || !/^-?\d+$/.test(ya[0])) return x === y;
    if (Number(xa[0]) !== Number(ya[0])) return false;
    return !xa[1] || !ya[1] || Number(xa[1]) === Number(ya[1]);
  }
  function sourceIdentity(purchase) {
    var source = text(purchase.source || purchase.sourceKind || "manual").toLowerCase();
    var item = text(purchase.sourceItemId || purchase.itemId), order = text(purchase.sourceOrderId || purchase.orderId), line = text(purchase.orderLineId), unit = text(purchase.unitIndex || 1);
    if (purchase.observationId) return text(purchase.observationId);
    var account=text(purchase.account || purchase.sourceAccount || purchase.buyerAccount || purchase.accountName).toLowerCase();
    if(account)source += ":account:"+encodeURIComponent(account);
    // eBay fixed-price item IDs can be purchased more than once: an order/line is needed.
    if (/^comc(?:$|:account:)/.test(source) && item) return "comc:" + encodeURIComponent(item);
    if (line) return source + ":line:" + encodeURIComponent(line) + ":" + unit;
    if (order && item) return source + ":order:" + encodeURIComponent(order) + ":item:" + encodeURIComponent(item) + ":" + unit;
    return "";
  }
  function candidateCopies(state, observation, context) {
    if (!observation.cardId) return [];
    return getCopiesForCard(state, observation.cardId, context.statuses, context.cardDetails).filter(function (copy) {
      return (copy.sourceRefs || []).indexOf(observation.id) >= 0 || (observation.serial && copy.serial && sameSerial(observation.serial, copy.serial));
    }).map(function (copy) { return copy.id; });
  }
  function purchaseUnits(purchase) {
    var quantity = purchase.quantity == null || purchase.quantity === "" ? 1 : Number(purchase.quantity);
    var unitIndex = purchase.unitIndex == null || purchase.unitIndex === "" ? 1 : Number(purchase.unitIndex);
    var validQuantity = Number.isSafeInteger(quantity) && quantity >= 1 && quantity <= 1000;
    var title = text(purchase.title || purchase.rawSet);
    return { quantity: validQuantity ? quantity : 1, unitIndex: Number.isSafeInteger(unitIndex) && unitIndex >= 1 ? unitIndex : null,
      requiresQuantityReview: purchase.requiresQuantityReview === true || !validQuantity || /\b(?:lot|bundle)\b|\bset\s+of\s+\d+\b/i.test(title) };
  }
  function upsertPurchase(input, purchase, options) {
    options = options || {};
    var units = purchaseUnits(purchase);
    var suppliedQuantity = purchase.quantity != null && purchase.quantity !== "";
    purchase = Object.assign({}, purchase, { unitIndex: units.unitIndex });
    if (suppliedQuantity) purchase.quantity = units.quantity;
    var state = normalizeState(input), id = sourceIdentity(purchase), at = nowIso(options.now);
    if (units.unitIndex == null) return { inventory: state, changed: false, observationId: "", candidateCopyIds: [], reviewReason: "Enter a positive whole-number unit index for this order line." };
    if (!id) return { inventory: state, changed: false, observationId: "", candidateCopyIds: [], reviewReason: "Add an order and item ID, a unique order line, or the COMC item ID before importing this purchase." };
    var previous = state.observations[id] || {}, observation = Object.assign({}, previous, {
      id: id, source: text(purchase.source || purchase.sourceKind || "manual").toLowerCase(), sourceItemId: text(purchase.sourceItemId || purchase.itemId || previous.sourceItemId), sourceOrderId: text(purchase.sourceOrderId || purchase.orderId || previous.sourceOrderId), orderLineId: text(purchase.orderLineId || previous.orderLineId), unitIndex: Number(purchase.unitIndex || 1),
      account: text(purchase.account || purchase.sourceAccount || purchase.buyerAccount || purchase.accountName || previous.account), title: text(purchase.title || previous.title), sourceUrl: text(purchase.sourceUrl || previous.sourceUrl), cardId: canonicalCardId(purchase.cardId == null ? previous.cardId : purchase.cardId),
      purchaseDate: text(purchase.purchaseDate || previous.purchaseDate), seller: text(purchase.seller || previous.seller),
      shippingCountry: text(purchase.shippingCountry || purchase.shipToCountry || purchase.deliveryCountry || previous.shippingCountry),
      reportedQuantity: Math.max(1, Number(purchase.quantity) || previous.reportedQuantity || 1),
      requiresQuantityReview: units.requiresQuantityReview || previous.requiresQuantityReview === true,
      observedDeliveryStatus: text(purchase.deliveryStatus || previous.observedDeliveryStatus),
      disposition: previous.disposition || "pending", matchedCopyId: previous.matchedCopyId || "", createdAt: previous.createdAt || at
    });
    if(observation.source==="comc"){
      var sourceAccounts=Array.from(new Set((previous.sourceAccounts||[]).concat(previous.account||[],observation.account||[]))).filter(Boolean);
      if(sourceAccounts.length)observation.sourceAccounts=sourceAccounts;
      if(previous.account)observation.account=previous.account;
    }
    // Order totals never become per-card purchase prices. An unverified title never becomes an exact serial.
    if (purchase.photos) observation.photos = media.mergePhotos(previous.photos, purchase.photos);
    if (purchase.rawPrice != null) observation.rawPrice = text(purchase.rawPrice);
    if (purchase.currencyEvidence && typeof purchase.currencyEvidence === "object" && !Array.isArray(purchase.currencyEvidence))
      observation.currencyEvidence = clone(purchase.currencyEvidence);
    if (purchase.orderTotal != null) observation.orderTotal = typeof purchase.orderTotal==="object" ? clone(purchase.orderTotal) : text(purchase.orderTotal);
    ["rawOrderTotal","originalPriceBasis","priceBasis"].forEach(function(key){if(purchase[key]!=null)observation[key]=text(purchase[key]);});
    ["isReturn","sourceStatusReview","sourceReviewedByOwner","currencyConfirmedByOwner"].forEach(function(key){if(purchase[key]!=null)observation[key]=purchase[key]===true;});
    if(purchase.lifecycleStatus!=null)observation.lifecycleStatus=text(purchase.lifecycleStatus);
    ["settlement","orderTax","exchangeRate"].forEach(function(key){if(purchase[key]!=null)observation[key]=typeof purchase[key]==="object"?clone(purchase[key]):text(purchase[key]);});
    if(purchase.rawEventDate!=null)observation.rawEventDate=text(purchase.rawEventDate);
    ["shippingScope","shipping","shippingCurrency","grading","condition","acquisitionPrice","acquisitionCurrency","acquisitionDate"].forEach(function(key){if(purchase[key]!=null)observation[key]=clone(purchase[key]);});
    if (options.priceVerified === true && observation.reportedQuantity === 1 && !observation.requiresQuantityReview && purchase.paidPrice != null && purchase.paidPrice !== "") {
      if (!Number.isFinite(Number(purchase.paidPrice)) || Number(purchase.paidPrice) < 0) throw new Error("Enter a non-negative item price.");
      observation.paidPrice = text(purchase.paidPrice); observation.currency = text(purchase.currency || inferredCurrency(observation)).toUpperCase(); observation.priceVerified = true;
    } else if (purchase.paidPrice != null && purchase.paidPrice !== "") observation.reportedPrice = text(purchase.paidPrice);
    if (options.imageVerified === true) {
      if (purchase.serial != null && purchase.serial !== "") observation.serial = text(purchase.serial);
      if (purchase.printRun != null && purchase.printRun !== "") observation.printRun = text(purchase.printRun);
      observation.imageVerified = true;
      observation.serialEvidence = "image_verified";
    } else if (options.serialEvidence === "comc_inventory" && observation.source === "comc") {
      if (purchase.serial) observation.serial = text(purchase.serial);
      if (purchase.printRun) observation.printRun = text(purchase.printRun);
      observation.serialEvidence = "comc_inventory";
    } else {
      if (purchase.serial) observation.reportedSerial = text(purchase.serial);
      if (purchase.printRun) observation.reportedPrintRun = text(purchase.printRun);
    }
    // A later source snapshot may describe a resale/rebuy or a corrected match.
    // Preserve established purchase facts and retain the conflicting snapshot for review.
    var conflicts=[];
    if(previous.cardId!=null && observation.cardId!=null && !sameCardId(previous.cardId,observation.cardId))conflicts.push("cardId");
    if(previous.purchaseDate && observation.purchaseDate && previous.purchaseDate!==observation.purchaseDate)conflicts.push("purchaseDate");
    if(previous.priceVerified && observation.priceVerified && (text(previous.paidPrice)!==text(observation.paidPrice)||text(previous.currency)!==text(observation.currency)))conflicts.push("paidPrice");
    if(previous.serial && observation.serial && !sameSerial(previous.serial,observation.serial))conflicts.push("serial");
    if(conflicts.length){
      var incoming={cardId:observation.cardId,purchaseDate:observation.purchaseDate,paidPrice:observation.paidPrice,currency:observation.currency,serial:observation.serial,sourceUrl:observation.sourceUrl,sourceOrderId:observation.sourceOrderId,title:observation.title};
      observation.conflictingEvidence=clone(previous.conflictingEvidence||[]);
      if(!observation.conflictingEvidence.some(function(row){return JSON.stringify(row.evidence)===JSON.stringify(incoming);}))observation.conflictingEvidence.push({evidence:incoming,conflicts:conflicts,observedAt:at});
      ["cardId","purchaseDate","paidPrice","currency","priceVerified","serial","printRun","imageVerified","serialEvidence"].forEach(function(field){if(previous[field]!==undefined)observation[field]=previous[field];else delete observation[field];});
      observation.needsSourceReview=true;
    }
    var comparePrevious = Object.assign({}, previous), compareNext = Object.assign({}, observation);
    delete comparePrevious.updatedAt; delete compareNext.updatedAt;
    var changed = JSON.stringify(comparePrevious) !== JSON.stringify(compareNext);
    if (changed) { observation.updatedAt = at; state.observations[id] = observation; state.updatedAt = at; }
    var candidates = candidateCopies(state, observation, options);
    return { inventory: state, changed: changed, observationId: id, candidateCopyIds: candidates, reviewReason: observation.needsSourceReview ? "Conflicting source purchase facts were preserved for review; no copy was changed." : observation.matchedCopyId ? "This purchase is already linked to a copy." : observation.reportedQuantity > 1 ? "This order line contains multiple cards. Check every card and link each copy before increasing the count." : candidates.length ? "A matching source or serial exists. Review the existing copy before adding another." : "Link this purchase to a copy already counted, or confirm it is an additional copy. Its location has not been inferred." };
  }
  function isOneOfOne(cardId,context,evidence) {
    context=context||{};var card=context.cardById&&context.cardById[cardId] || context.card || (context.cards||[]).find(function(c){return sameCardId(c.id,cardId);}) || {};
    return [card,evidence||{}].some(function(c){return Number(c.printRun)===1 || Number(c.copies)===1 || /(?:^|\s)1\/1(?:$|\s)/.test(text(c.cardSet)) || /\/1$/.test(text(c.serial));});
  }
  function assertAdditionalAllowed(state,cardId,context,evidence) {
    var counted=getCopiesForCard(state,cardId,context.statuses,context.cardDetails).filter(isCountedCopy);
    if(counted.length && (isOneOfOne(cardId,context,evidence)||counted.some(function(c){return isOneOfOne(cardId,context,c);})))throw new Error("This 1/1 already has a counted copy. Link the existing copy or resolve the conflict first.");
  }
  function validateCopy(copy, context) {
    context=context||{};
    if (canonicalCardId(copy.cardId)===null) return "Choose a card from the catalogue.";
    if (!LOCATIONS[copy.location]) return "Choose a valid location.";
    if (!SALE_STATUSES[copy.saleStatus]) return "Choose a valid sale status.";
    if (copy.paidPrice !== "" && copy.paidPrice != null && (!Number.isFinite(Number(copy.paidPrice)) || Number(copy.paidPrice) < 0)) return "Enter a non-negative item price.";
    if (copy.paidPrice !== "" && copy.paidPrice != null && !/^[A-Z]{3}$/.test(text(copy.currency))) return "Choose the currency for this copy's price.";
    if (copy.listingUrl) {
      try { var u = new URL(copy.listingUrl); if (!/^https?:$/.test(u.protocol) || u.username || u.password) return "Use a complete http or https listing link."; }
      catch (_) { return "Use a complete http or https listing link."; }
    }
    if (copy.photos != null && !Array.isArray(copy.photos)) return "Photos must be a list of image links.";
    if ((copy.photos || []).some(function(photo) { return !photo || !media.photoUrl(photo) || photo.sourceUrl && !media.safeImageUrl(photo.sourceUrl); })) return "Use complete HTTPS image and source links without sign-in credentials.";
    if ((copy.photos || []).some(function(photo) { return !media.KINDS[photo.kind] || ["front", "back"].indexOf(photo.side) < 0; })) return "Choose a source label and front or back for every photo.";
    if (text(copy.secondaryJerseyNumber) && !/^\d{1,3}$/.test(text(copy.secondaryJerseyNumber))) return "Enter the other jersey number shown on this card, using digits only.";
    if (copy.secondaryJerseyEvidence && copy.secondaryJerseyEvidence.sourceUrl && !media.safeImageUrl(copy.secondaryJerseyEvidence.sourceUrl)) return "Use a complete HTTPS link for the jersey evidence.";
    if (copy.secondaryJerseyEvidence && copy.secondaryJerseyEvidence.confirmed && media.secondaryEvidence(copy,context.primaryJerseyNumber) == null) return "Confirm the jersey number using a saved photo, or an HTTPS evidence link with a note.";
    return "";
  }
  function editCopy(input, cardId, copyId, patch, context) {
    context = context || {}; var state = normalizeState(input), at = nowIso(context.now);
    var existing = getCopiesForCard(state, cardId, context.statuses, context.cardDetails).find(function (c) { return c.id === copyId; });
    if (!existing) throw new Error("That copy is no longer available. Refresh and try again.");
    var allowed = ["location", "serial", "paidPrice", "currency", "purchaseDate", "notes", "duplicateConfirmed", "saleStatus", "listingUrl", "listingPrice", "listingCurrency", "listingCheckedAt", "photos", "secondaryJerseyNumber", "secondaryJerseyEvidence", "currentInventory"];
    var next = Object.assign({}, existing);
    allowed.forEach(function (key) { if (Object.prototype.hasOwnProperty.call(patch, key)) next[key] = patch[key]; });
    if (text(next.serial) !== text(existing.serial)) { next.serialEvidence = "manual"; next.imageVerified = false; }
    next.currency = text(next.currency).toUpperCase(); next.unallocated = next.location === "unknown" && existing.origin === "legacy";
    next.updatedAt = at; next.createdAt = existing.createdAt || at;
    if (needsSaleReview(next)) next.saleStatus = "review";
    var error = validateCopy(next, context); if (error) throw new Error(error);
    if(isOneOfOne(cardId,context,next) && getCopiesForCard(state,cardId,context.statuses,context.cardDetails).filter(isCountedCopy).length>1)throw new Error("Resolve the extra counted copies before assigning this 1/1 evidence.");
    if (next.photos) next.photos = media.preferredPhotos(next.photos);
    ensureBaseline(state, cardId, context, at); state.copies[copyId] = next; state.updatedAt = at;
    return state;
  }
  function resolveObservation(input, observationId, decision, context) {
    context = context || {}; decision = decision || {}; var state = normalizeState(input), observation = state.observations[observationId], at = nowIso(context.now);
    if (!observation) throw new Error("That purchase is no longer available.");
    if (observation.needsSourceReview) throw new Error("Conflicting source purchase facts need review before linking this receipt.");
    if (observation.disposition === "split") throw new Error("This lot has separate copy reviews. Match each of those records.");
    if (observation.matchedCopyId) return { inventory: state, copyId: observation.matchedCopyId, changed: false };
    if (observation.reportedQuantity > 1) throw new Error("This purchase contains multiple cards. Split the lot into separate copy reviews first.");
    if (observation.requiresQuantityReview && decision.confirmSingleUnit !== true) throw new Error("This purchase may be a lot. Confirm it contains one physical card, or split it into separate copy reviews.");
    var cardId = canonicalCardId(decision.cardId == null ? observation.cardId : decision.cardId);
    if (cardId===null) throw new Error("Choose the exact card before linking this purchase.");
    var copies = getCopiesForCard(state, cardId, context.statuses, context.cardDetails), copy;
    if (decision.existingCopyId) {
      copy = copies.find(function (c) { return c.id === decision.existingCopyId; });
      if (!copy) throw new Error("Choose an existing copy of this same card.");
      if (observation.parentObservationId && (copy.sourceRefs || []).some(function (ref) { var sibling = state.observations[ref]; return sibling && sibling.id !== observation.id && sibling.parentObservationId === observation.parentObservationId; })) throw new Error("This copy is already matched to another card from the same lot. Choose a different physical copy.");
      if (copy.serial && observation.serial && !sameSerial(copy.serial, observation.serial)) throw new Error("The serial numbers differ. Review the physical copy before linking.");
      copy = Object.assign({}, copy);
    } else {
      if (decision.confirmAdditional !== true) throw new Error("Confirm this is an additional copy, not one already included in your count.");
      assertAdditionalAllowed(state,cardId,context,observation);
      copy = { id: "purchase:" + observationId, cardId: cardId, origin: "purchase", source: observation.source || "", sourceUrl: observation.sourceUrl || "", currentInventory: true, location: decision.location || (text(observation.source).toLowerCase()==="comc"?"comc":"in_transit"), serial: "", paidPrice: "", currency: "", purchaseDate: "", sourceRefs: [], duplicateConfirmed: false, saleStatus: "none", createdAt: at };
    }
    ensureBaseline(state, cardId, context, at);
    copy.sourceRefs = Array.from(new Set((copy.sourceRefs || []).concat(observationId)));
    if (!copy.serial && (observation.imageVerified || observation.serialEvidence === "comc_inventory") && observation.serial) {
      copy.serial = observation.serial;
      copy.serialEvidence = observation.imageVerified ? "image_verified" : "comc_inventory";
      copy.imageVerified = observation.imageVerified === true;
    }
    if (!copy.printRun && (observation.imageVerified || observation.serialEvidence === "comc_inventory") && observation.printRun) copy.printRun = observation.printRun;
    copy.photos = media.mergePhotos(copy.photos, observation.photos);
    if (!text(copy.secondaryJerseyNumber) && media.secondaryEvidence(observation,context.primaryJerseyNumber) != null) {
      copy.secondaryJerseyNumber = text(observation.secondaryJerseyNumber);
      copy.secondaryJerseyEvidence = clone(observation.secondaryJerseyEvidence);
    }
    if ((copy.paidPrice == null || copy.paidPrice === "") && observation.priceVerified && observation.paidPrice !== "") { copy.paidPrice = observation.paidPrice; copy.currency = observation.currency || inferredCurrency(observation); }
    if (!copy.purchaseDate) copy.purchaseDate = observation.purchaseDate || "";
    if (decision.location && decision.location !== "unknown") copy.location = decision.location;
    if (decision.duplicateConfirmed === true) copy.duplicateConfirmed = true;
    copy.unallocated = copy.origin === "legacy" && copy.location === "unknown";
    copy.updatedAt = at; if (needsSaleReview(copy)) copy.saleStatus = "review";
    var error = validateCopy(copy, context); if (error) throw new Error(error);
    if(isOneOfOne(cardId,context,copy)&&copies.filter(isCountedCopy).length>1)throw new Error("Resolve the extra counted copies before linking this 1/1 evidence.");
    state.copies[copy.id] = copy;
    state.observations[observationId] = Object.assign({}, observation, { cardId: cardId, matchedCopyId: copy.id, disposition: "linked", updatedAt: at });
    state.updatedAt = at;
    return { inventory: state, copyId: copy.id, changed: true };
  }
  function splitObservation(input, observationId, quantity, context) {
    context = context || {}; var state = normalizeState(input), observation = state.observations[observationId], at = nowIso(context.now);
    if (!observation) throw new Error("That purchase is no longer available.");
    if (observation.matchedCopyId) throw new Error("This purchase is already linked to a copy. Review that match before splitting it.");
    if (observation.disposition === "split") return { inventory: state, changed: false, observationIds: observation.childObservationIds || [] };
    quantity = Number(quantity);
    if (!Number.isSafeInteger(quantity) || quantity < 2 || quantity > 1000) throw new Error("Enter the number of physical cards in the lot, from 2 to 1,000.");
    var ids = [];
    for (var unit = 1; unit <= quantity; unit++) {
      var id = observationId + ":unit:" + unit;
      var child = Object.assign({}, observation, { id: id, parentObservationId: observationId, unitIndex: unit, reportedQuantity: 1, requiresQuantityReview: false, title: (observation.title || "Purchased lot") + " — copy " + unit + " of " + quantity, disposition: "pending", matchedCopyId: "", imageVerified: false, priceVerified: false, createdAt: at, updatedAt: at });
      // A lot-level number/amount cannot be copied onto every constituent card.
      ["serial", "printRun", "paidPrice", "currency", "orderTotal", "reportedPrice", "reportedSerial", "reportedPrintRun", "childObservationIds", "secondaryJerseyNumber", "secondaryJerseyEvidence"].forEach(function (key) { delete child[key]; });
      if (child.photos) child.photos = media.normalizePhotos(child.photos).map(function(photo) { return Object.assign({}, photo, {kind:"reference",caption:[photo.caption,"Lot reference; match this physical copy separately"].filter(Boolean).join(" · ")}); });
      state.observations[id] = child; ids.push(id);
    }
    state.observations[observationId] = Object.assign({}, observation, { disposition: "split", reportedQuantity: quantity, childObservationIds: ids, updatedAt: at });
    state.updatedAt = at;
    return { inventory: state, changed: true, observationIds: ids };
  }
  function addManualCopy(input, cardId, patch, context) {
    context = context || {}; var at = nowIso(context.now), state = normalizeState(input);
    if (context.confirmAdditional !== true) throw new Error("Confirm this is an additional physical copy.");
    if(canonicalCardId(cardId)===null)throw new Error("Choose a card from the catalogue.");
    assertAdditionalAllowed(state,cardId,context,patch);
    ensureBaseline(state, cardId, context, at);
    var id = "manual:" + cardId + ":" + (Date.parse(at) || Date.now()), suffix = 1;
    while (state.copies[id]) id = "manual:" + cardId + ":" + (Date.parse(at) || Date.now()) + ":" + suffix++;
    var copy = Object.assign({ id: id, cardId: canonicalCardId(cardId), origin: "manual", location: "unknown", serial: "", paidPrice: "", currency: "", purchaseDate: "", sourceRefs: [], duplicateConfirmed: false, saleStatus: "none", createdAt: at, updatedAt: at }, patch || {}, { id: id, cardId: canonicalCardId(cardId) });
    copy.currency = text(copy.currency).toUpperCase(); if (needsSaleReview(copy)) copy.saleStatus = "review";
    if (copy.serial && !copy.serialEvidence) copy.serialEvidence = "manual";
    var error = validateCopy(copy, context); if (error) throw new Error(error);
    if (copy.photos) copy.photos = media.preferredPhotos(copy.photos);
    state.copies[id] = copy; state.updatedAt = at;
    return { inventory: state, copyId: id };
  }

  // Keep the original quantity/stoplight workflow usable after a copy is documented.
  // Adjust only legacy slots. Never silently create, move, or delete eBay/COMC copies.
  function quickQuantity(input, cardId, target, context) {
    context = context || {};
    var state = normalizeState(input), at = nowIso(context.now);
    target = Number(target);
    if (!Number.isSafeInteger(target) || target < 0 || target > 10000) throw new Error("Enter a valid quantity.");
    var rows = getCopiesForCard(state, cardId, context.statuses, context.cardDetails).filter(isCountedCopy);
    if(target>1 && (isOneOfOne(cardId,context)||rows.some(function(copy){return isOneOfOne(cardId,context,copy);})))throw new Error("A 1/1 card cannot have more than one acquired copy.");
    var sourced = rows.filter(function(c){return c.origin !== "legacy";}).length;
    if (target < sourced) throw new Error("The total includes " + sourced + " documented copies. Open Details to resolve those before reducing the total.");
    var desiredLegacy = target - sourced, previous = baselineFor(state, cardId, context.statuses, context.cardDetails);
    var oldLegacy = previous.quantity;
    var baseline = Object.assign({}, previous, { quantity: desiredLegacy, updatedAt: at });
    state.baselines[cardId] = baseline;
    for (var i = desiredLegacy + 1; i <= oldLegacy; i++) {
      var id = "legacy:" + cardId + ":" + i;
      if (state.copies[id]) state.copies[id] = Object.assign({}, state.copies[id], { archived: true, updatedAt: at });
    }
    for (var j = oldLegacy + 1; j <= desiredLegacy; j++) {
      var nextId = "legacy:" + cardId + ":" + j;
      if (state.copies[nextId] && state.copies[nextId].archived) {
        state.copies[nextId] = Object.assign({}, state.copies[nextId], { archived: false, updatedAt: at });
      }
    }
    state.updatedAt = at;
    return state;
  }
  function quickAllocation(input, cardId, inHand, context) {
    context = context || {};
    var state = normalizeState(input), at = nowIso(context.now);
    var rows = getCopiesForCard(state, cardId, context.statuses, context.cardDetails).filter(isCountedCopy);
    var confirmedHand = rows.filter(function(c){return c.origin !== "legacy" && c.location === "in_hand";}).length;
    var legacy = rows.filter(function(c){return c.origin === "legacy";});
    var desired = Number(inHand);
    if (!Number.isSafeInteger(desired) || desired < confirmedHand || desired > confirmedHand + legacy.length)
      throw new Error("Keep the documented copies at their known locations. Open Details to change those individually.");
    var handLegacy = desired - confirmedHand;
    legacy.forEach(function(copy,index){
      var nextLocation = index < handLegacy ? "in_hand" : "in_transit";
      var next = Object.assign({}, copy, { location: nextLocation, unallocated: false, updatedAt: at, createdAt: copy.createdAt || at });
      state.copies[copy.id] = next;
    });
    if (legacy.length && !state.baselines[cardId]) state.baselines[cardId] = Object.assign({}, baselineFor(state,cardId,context.statuses,context.cardDetails), {updatedAt:at});
    state.updatedAt = at;
    return state;
  }
  // Selecting a stoplight on a multi-copy variant changes PRESENCE, not all copies.
  // Keep at least one in hand when adding the first in-transit copy and vice versa.
  function quickStatusPresence(input, cardId, target, context) {
    context = context || {};
    if (target !== "owned" && target !== "in_transit") return { handled:false };
    var state = normalizeState(input);
    var rows = getCopiesForCard(state, cardId, context.statuses, context.cardDetails)
      .filter(isCountedCopy);
    if (rows.length < 2) return { handled:false };
    var summary = summarizeCard(state, cardId, context.statuses, context.cardDetails);
    if ((target === "owned" && summary.owned) || (target === "in_transit" && summary.inTransit))
      return { handled:true, changed:false, inventory:state };
    var legacy = rows.filter(function(c){return c.origin === "legacy";});
    if (!legacy.length) return { handled:true, changed:false, requiresDetails:true, inventory:state };
    var confirmedHand = rows.filter(function(c){return c.origin !== "legacy" && c.location === "in_hand";}).length;
    var assumedOwned = ((context.statuses || {})[cardId] || baselineFor(state,cardId,context.statuses,context.cardDetails).status) === "owned";
    var hand = rows.filter(function(c){ return c.location === "in_hand" || c.origin === "legacy" && c.location === "unknown" && assumedOwned; }).length;
    var nextHand;
    if (target === "in_transit") {
      nextHand = Math.max(confirmedHand, hand - 1);
      // A two-copy card that was in hand must still have at least one in hand.
      if (hand > 0) nextHand = Math.max(1, nextHand);
    } else {
      nextHand = Math.min(confirmedHand + legacy.length, hand + 1);
      // Keep an existing transit copy when switching on the Owned light.
      if (hand === 0 && rows.length > 1) nextHand = Math.min(rows.length - 1, nextHand);
    }
    if (nextHand === hand) return { handled:true, changed:false, requiresDetails:true, inventory:state };
    return { handled:true, changed:true, inventory:quickAllocation(state,cardId,nextHand,context) };
  }
  var api = { canonicalCardId:canonicalCardId, sameCardId:sameCardId, isOneOfOne:isOneOfOne, LOCATIONS: LOCATIONS, SALE_STATUSES: SALE_STATUSES, normalizeState: normalizeState, hasStoredCopies: hasStoredCopies, mergeStates: mergeStates, legacyQuantity: legacyQuantity, getCopiesForCard: getCopiesForCard, summarizeCard: summarizeCard, copiesForCards:copiesForCards, summarizeCards:summarizeCards, matchesStatus: matchesStatus, countCards: countCards, needsSaleReview: needsSaleReview, sameSerial: sameSerial, sourceIdentity: sourceIdentity, purchaseUnits: purchaseUnits, upsertPurchase: upsertPurchase, validateCopy: validateCopy, editCopy: editCopy, resolveObservation: resolveObservation, splitObservation: splitObservation, addManualCopy: addManualCopy, quickQuantity: quickQuantity, quickAllocation: quickAllocation, quickStatusPresence: quickStatusPresence, copyStatus: copyStatus, isCountedCopy: isCountedCopy, inferredCurrency: inferredCurrency };
  if (root) root.CopyInventory = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : null);
