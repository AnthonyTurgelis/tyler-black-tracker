/* Shared, testable rules for market evidence and purchase imports. */
(function (root) {
  "use strict";
  var scan = typeof module !== "undefined" && module.exports ? require("./scan-currency.js") : root.ScanCurrency;
  var KINDS = { asking: "Asking", current_bid: "Current bid", sold: "Sold", purchase: "Paid", unknown: "Legacy / unknown type" };
  function currency(value) {
    var code = String(value || "").trim().toUpperCase();
    return /^[A-Z]{3}$/.test(code) ? code : "UNKNOWN";
  }
  function entryCurrency(entry) {
    var stored = currency(entry.currency);
    var original = entry.currencyEvidence;
    if (entry.currencyUnconfirmedByOwner || original && original.conflicts && original.conflicts.length && !entry.currencyConfirmedByOwner) return "UNKNOWN";
    if (stored !== "UNKNOWN") return stored;
    // Older price history often kept just a numeric price, title and marketplace.
    var hasContext = entry.rawPrice || entry.currencyText || entry.sourceText || scan.shipTo(entry) || original;
    if (!hasContext && Number.isFinite(Number(entry.price))) return scan.sourceCurrency(entry.source);
    var evidence = scan.infer(Object.assign({}, entry, {currencyText:entry.currencyText || entry.sourceText}));
    if (evidence.currency !== "UNKNOWN" || evidence.conflicts.length) return evidence.currency;
    return currency(entry.currencyEvidence && entry.currencyEvidence.currency);
  }
  function detectCurrency(value) {
    var text = String(value || "");
    if (/\bCAD\b|CA\s*\$|C\$/i.test(text)) return "CAD";
    if (/\bUSD\b|US\s*\$/i.test(text)) return "USD";
    if (/\bGBP\b|£/i.test(text)) return "GBP";
    if (/\bEUR\b|€/i.test(text)) return "EUR";
    if (/\bAUD\b|AU\s*\$/i.test(text)) return "AUD";
    return "UNKNOWN"; // A bare dollar sign does not identify a currency.
  }
  function amount(value) {
    if (value == null || value === "") return null;
    var text = String(value).trim();
    if (/^free(?:\s|$)/i.test(text)) return 0;
    if (!/\d/.test(text)) return null;
    text = text.replace(/[^0-9.,-]/g, "");
    if (/,\d{2}$/.test(text) && text.lastIndexOf(",") > text.lastIndexOf(".")) text = text.replace(/\./g, "").replace(/,(?=.*[,])/g, "").replace(",", ".");
    else text = text.replace(/,/g, "");
    var number = Number(text);
    return Number.isFinite(number) && number >= 0 ? number : null;
  }
  function safeUrl(value) {
    try { var url = new URL(String(value || "")); return /^https?:$/.test(url.protocol) && !url.username && !url.password ? url.href : ""; }
    catch (_) { return ""; }
  }
  function itemId(value, url) {
    if (value != null && String(value).trim()) return String(value).trim();
    var match = String(url || "").match(/\/itm\/(?:[^/?#]+\/)?(\d{9,15})(?:[/?#]|$)/i);
    return match ? match[1] : "";
  }
  function kind(value) { return Object.prototype.hasOwnProperty.call(KINDS, value) ? value : "unknown"; }
  function conditionLabel(entry) {
    var grading = entry.grading || {};
    if (typeof grading === "string" && grading.trim()) return grading.trim();
    if (grading.company && (grading.cardGrade || grading.grade)) return String(grading.company).toUpperCase() + " " + (grading.cardGrade || grading.grade) + (grading.autographGrade ? " / Auto " + grading.autographGrade : "");
    return String(entry.condition || "").trim() || "Condition unverified";
  }
  function seriesKey(entry) { return [entryCurrency(entry), kind(entry.kind), entry.priceBasis || "unknown", conditionLabel(entry).toLowerCase().replace(/\s+/g, " ")].join("|"); }
  function kindLabel(value) { return KINDS[kind(value)]; }
  function formatMoney(value, code) {
    var number = amount(value);
    if (number == null) return "—";
    var cur = currency(code);
    return number.toFixed(2) + (cur === "UNKNOWN" ? "" : " " + cur);
  }
  function scanPrice(row, itemCurrency) {
    var item = amount(row.price), code = currency(itemCurrency || row.currency);
    var shipping = amount(row.shippingNum);
    // Old eBay scans initialized shippingNum to zero even when the listing omitted shipping.
    if (shipping === 0 && row.shipping === "") shipping = null;
    var shipCode = currency(row.shippingCurrency);
    var detail = "";
    if (row.priceBasis === "order_total") detail = "Order total";
    else if (shipping === null) detail = "Shipping unknown";
    else if (shipping === 0) detail = "Free shipping";
    else if (row.shippingScope === "order" && !(Number(row.itemsInOrder) === 1 && Number(row.quantity || 1) === 1)) {
      detail = "Order shipping " + formatMoney(shipping, shipCode);
    } else if (shipCode === "UNKNOWN" || code !== shipCode || item === null) {
      detail = "+ " + formatMoney(shipping, shipCode) + " shipping";
    } else {
      return {amount:(Math.round(item*100) + Math.round(shipping*100))/100, includesShipping:true, detail:"Incl. " + formatMoney(shipping, shipCode) + " shipping"};
    }
    return {amount:item, includesShipping:item !== null && shipping === 0 && row.priceBasis !== "order_total", detail:detail};
  }
  function summarizeAmounts(items) {
    var result = { totals: {}, unknownCount: 0 };
    (items || []).forEach(function(item) {
      var price = amount(item.price), code = currency(item.currency);
      if (!(price > 0)) return;
      if (code === "UNKNOWN") result.unknownCount++;
      else result.totals[code] = (result.totals[code] || 0) + price;
    });
    return result;
  }
  function formatTotals(summary) {
    var parts = Object.keys(summary.totals).sort().map(function(code) { return formatMoney(summary.totals[code], code); });
    if (summary.unknownCount) parts.push(summary.unknownCount + " prices need currency");
    return parts.join(" · ");
  }
  function formatEvidenceTotals(items) {
    var groups = {};
    (items || []).forEach(function(item) { var key = kind(item.kind); if (!groups[key]) groups[key] = []; groups[key].push(item); });
    return Object.keys(groups).sort().map(function(key) { var total = formatTotals(summarizeAmounts(groups[key])); return total ? kindLabel(key) + ": " + total : ""; }).filter(Boolean).join(" · ");
  }
  function identity(entry) {
    return [entry.source || "unknown", entry.marketplace || "", entry.itemId || entry.itemUrl || (entry.titles || []).join(" | ")].join("|");
  }
  function observationKey(entry) {
    // Repeated pastes of one listing/price on one day are one observation.
    // A documented sale/purchase keeps its actual event date across rescans.
    var event = (entry.kind === "sold" || entry.kind === "purchase") && entry.eventDate ? entry.eventDate : entry.date;
    return [identity(entry), seriesKey(entry), entry.price, entry.shipping == null ? "" : entry.shipping, event || ""].join("|");
  }
  function observation(input) {
    var price = amount(input.price);
    if (!(price > 0)) return null;
    var when = new Date(input.observedAt || Date.now());
    if (!Number.isFinite(when.getTime())) return null;
    var url = safeUrl(input.itemUrl || input.url || input.sourceUrl);
    var code = entryCurrency(input);
    var entry = {
      price: price, source: input.source || "unknown", currency: code,
      kind: kind(input.kind), priceBasis: input.priceBasis || "item",
      observedAt: when.toISOString(), lastSeenAt: when.toISOString(),
      date: when.toISOString().slice(0, 10), listings: 1,
      itemId: itemId(input.itemId, url), itemUrl: url,
      marketplace: input.marketplace || "", eventDate: input.eventDate || "",
      serial: input.serial || "", printRun: input.printRun || "",
      shipping: amount(input.shipping), shippingCurrency: input.shippingCurrency ? currency(input.shippingCurrency) : "UNKNOWN",
      shippingScope: String(input.shippingScope || ""),
      condition: String(input.condition || ""),
      grading: input.grading && typeof input.grading === "object" ? {company:String(input.grading.company || ""),cardGrade:String(input.grading.cardGrade || input.grading.grade || ""),autographGrade:String(input.grading.autographGrade || "")} : String(input.grading || ""),
      seller: String(input.seller || ""),
      sourceSnapshotFreshness: String(input.sourceSnapshotFreshness || input.sourceCrawledText || "Unknown"),
      availability: String(input.availability || "unconfirmed"),
      liveAvailabilityVerified: input.liveAvailabilityVerified === true,
      bestOfferAvailable: input.bestOfferAvailable === true,
      notes: Array.isArray(input.notes) ? input.notes.map(String) : [],
      titles: input.title ? [String(input.title)] : []
    };
    entry.observationKey = observationKey(entry);
    return entry;
  }
  function record(history, key, input) {
    var entry = observation(input);
    if (!entry || !key) return { added: false, entry: null };
    if (!Array.isArray(history[key])) history[key] = [];
    var existing = history[key].find(function (old) { return old.observationKey === entry.observationKey; });
    if (existing) {
      if (!existing.lastSeenAt || entry.observedAt > existing.lastSeenAt) existing.lastSeenAt = entry.observedAt;
      return { added: false, entry: existing };
    }
    history[key].push(entry);
    return { added: true, entry: entry };
  }
  function groupSeries(entries) {
    var groups = {};
    (entries || []).forEach(function (entry) {
      var key = seriesKey(entry);
      if (!groups[key]) groups[key] = { key: key, currency: entryCurrency(entry), kind: kind(entry.kind), conditionLabel: conditionLabel(entry), entries: [] };
      groups[key].entries.push(entry);
    });
    return Object.values(groups);
  }
  function importStatus(current, requested) {
    if (current === "owned") return "owned";
    return requested === "owned" ? "owned" : "in_transit";
  }
  function purchasePatch(existing, parsed, options) {
    existing = existing || {}; options = options || {};
    var patch = {};
    // A public listing is evidence about the market, not what this owner paid.
    if (parsed.recordType === "purchase") {
      var price = amount(parsed.price);
      var fields = { date: parsed.date, serial: parsed.serial,
        source: parsed.source || parsed.seller, seller: parsed.seller,
        sourceUrl: safeUrl(parsed.itemUrl || parsed.url || parsed.sourceUrl),
        sourceItemId: itemId(parsed.itemId, parsed.itemUrl || parsed.url || parsed.sourceUrl),
        notes: parsed.purchaseNote };
      if (!existing.price && price > 0) {
        fields.price = price.toFixed(2);
        fields.currency = currency(parsed.currency);
      }
      Object.keys(fields).forEach(function (field) {
        if ((existing[field] == null || existing[field] === "") && fields[field] != null && fields[field] !== "") patch[field] = fields[field];
      });
    }
    if (options.confirmInHand) patch.inHandConfirmedAt = options.now || new Date().toISOString();
    return patch;
  }
  function detailOverrides(details, presets) {
    var output = {}, map = { serial: "s", price: "p", date: "d", notes: "n", printRun: "pr" };
    Object.entries(details || {}).forEach(function (pair) {
      var id = pair[0], detail = pair[1] || {}, preset = (presets || {})[id] || {}, diff = {};
      Object.keys(detail).forEach(function (field) {
        if (detail[field] === undefined) return;
        if (map[field] && Object.prototype.hasOwnProperty.call(preset, map[field]) && detail[field] === preset[map[field]]) return;
        diff[field] = detail[field];
      });
      if (Object.keys(diff).length) output[id] = diff;
    });
    return output;
  }
  var api = { currency: currency, entryCurrency: entryCurrency, detectCurrency: detectCurrency, amount: amount, safeUrl: safeUrl,
    itemId: itemId, kind: kind, kindLabel: kindLabel, conditionLabel: conditionLabel, seriesKey: seriesKey, formatMoney: formatMoney, scanPrice: scanPrice, summarizeAmounts: summarizeAmounts, formatTotals: formatTotals, formatEvidenceTotals: formatEvidenceTotals,
    observation: observation, observationKey: observationKey, record: record, groupSeries: groupSeries,
    importStatus: importStatus, purchasePatch: purchasePatch, detailOverrides: detailOverrides };
  if (root) root.TrackerMarket = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : null);
