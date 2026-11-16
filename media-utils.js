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
        sourceUrl: safeImageUrl(photo.sourceUrl), caption: text(photo.caption) });
    });
    return output;
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
  var api = { KINDS: KINDS, safeImageUrl: safeImageUrl, normalizePhotos: normalizePhotos, preferredPhotos: preferredPhotos,
    mergePhotos: mergePhotos, normalizePublicMedia: normalizePublicMedia, serialNumbers: serialNumbers,
    credibleSerial: credibleSerial, secondaryEvidence: secondaryEvidence, jerseyMatches: jerseyMatches, comcDuplicateGroups: comcDuplicateGroups };
  if (root) root.TrackerMedia = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : null);
