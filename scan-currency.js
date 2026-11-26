/* Currency evidence shared by every collection scanner. Never converts amounts. */
(function (root) {
  "use strict";
  var CODES = "USD|CAD|GBP|EUR|AUD|NZD|JPY|CHF|HKD|SGD";
  var PREFIX = "(?:" + CODES + ")\\s*[$£€¥]?|US\\s*\\$|C(?:A|AN)?\\s*\\$|AU?\\s*\\$|NZ\\s*\\$|HK\\s*\\$|SG\\s*\\$|[$£€¥]";
  var NUMBER = "\\d+(?:[.,]\\d+)*";
  function code(value) {
    var text = String(value || "").trim().toUpperCase();
    return new RegExp("^(?:" + CODES + ")$").test(text) ? text : "UNKNOWN";
  }
  function codes(text) {
    text = String(text || "");
    var found = [];
    function add(c, pattern) { if (pattern.test(text) && found.indexOf(c) < 0) found.push(c); }
    add("CAD", /\bCAD\b|\bC(?:A|AN)?\s*\$|Canadian\s+dollars?/i);
    add("USD", /\bUSD\b|\bUS\s*\$|(?:U\.?S\.?|United States|American)\s+dollars?/i);
    add("GBP", /\bGBP\b|£|(?:British\s+)?pounds?\s+sterling/i);
    add("EUR", /\bEUR\b|€|\beuros?\b/i);
    add("AUD", /\bAUD\b|\bAU?\s*\$|Australian\s+dollars?/i);
    add("NZD", /\bNZD\b|\bNZ\s*\$|New Zealand\s+dollars?/i);
    add("JPY", /\bJPY\b|Japanese\s+yen/i);
    add("CHF", /\bCHF\b|Swiss\s+francs?/i);
    add("HKD", /\bHKD\b|\bHK\s*\$|Hong Kong\s+dollars?/i);
    add("SGD", /\bSGD\b|\bSG\s*\$|Singapore\s+dollars?/i);
    return found;
  }
  function amount(value) {
    var text = String(value == null ? "" : value).trim();
    if (!/\d/.test(text)) return null;
    text = text.replace(/[^\d.,-]/g, "");
    if (/,\d{2}$/.test(text) && text.lastIndexOf(",") > text.lastIndexOf(".")) text = text.replace(/\./g, "").replace(/,(?=.*[,])/g, "").replace(",", ".");
    else text = text.replace(/,/g, "");
    var n = Number(text);
    return Number.isFinite(n) && n >= 0 ? n : null;
  }
  function moneyTokens(value) {
    var text = String(value || ""), result = [], match;
    var re = new RegExp("(" + PREFIX + ")\\s*(" + NUMBER + ")(?:\\s*(" + CODES + ")\\b)?|(" + NUMBER + ")\\s*(" + CODES + ")\\b", "gi");
    while ((match = re.exec(text))) {
      var found = codes(match[0]), n = amount(match[2] || match[4]);
      var lineStart = Math.max(text.lastIndexOf("\n", match.index - 1), text.lastIndexOf(";", match.index - 1));
      var preceding = text.slice(lineStart + 1, match.index);
      // A conversion label only applies to the following amount. Previous
      // monetary values are removed so a later original amount is independent.
      var previous = result.length ? result[result.length - 1] : null;
      if (previous && previous.end > lineStart) preceding = text.slice(previous.end, match.index);
      var converted = /(?:approx(?:imately)?\.?|converted(?:\s+(?:to|amount))?|equivalent|estimated\s+(?:conversion|total)|about)\s*[:(≈~]?\s*$/i.test(preceding);
      result.push({ amount: n, currency: found.length === 1 ? found[0] : "UNKNOWN", raw: match[0], index: match.index, end: re.lastIndex, converted: converted, conflict: found.length > 1 });
    }
    if (!result.length && new RegExp("^\\s*" + NUMBER + "\\s*$").test(text)) result.push({ amount: amount(text), currency: "UNKNOWN", raw: text.trim(), index: 0, end: text.length, converted: false, conflict: false });
    return result;
  }
  function parseMoney(value) {
    var text = String(value || ""), tokens = moneyTokens(text);
    if (!tokens.length) return null;
    var original = tokens.filter(function(t) { return !t.converted; });
    var primary = original[0] || tokens[0];
    var range = tokens.length > 1 && /\bto\b|\s[–—-]\s/.test(text.slice(tokens[0].end, tokens[1].index));
    return { amount: range ? null : primary.amount, currency: primary.currency, rawPrice: text,
      convertedDisplay: primary.converted, conflict: range || primary.conflict,
      alternatives: tokens.filter(function(t) { return t !== primary; }).map(function(t) { return { amount: t.amount, currency: t.currency, converted: t.converted }; }) };
  }
  function destination(value) {
    if (value && typeof value === "object") {
      return destination(value.countryCode || value.country || value.addressCountry || value.postalCode || value.zip);
    }
    var text = String(value || "").replace(/[\u200b-\u200f\ufeff]/g, "").trim(), found = [];
    function add(c) { if (found.indexOf(c) < 0) found.push(c); }
    if (/\bCanada\b|\bCAN\b|^CA$|^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]$|\b[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d\b/i.test(text)) add("CAD");
    if (/\bUnited States\b|\bU\.?S\.?A\b|^U\.?S\.?$/i.test(text)) add("USD");
    // Accept a ZIP when the destination is just the code, or a US state precedes it.
    if (/^(?:ZIP(?: code)?\s*:?\s*)?\d{5}(?:-\d{4})?$/i.test(text) ||
        /\b(?:AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|PR)\s+\d{5}(?:-\d{4})?\b/i.test(text)) add("USD");
    return found;
  }
  function shipTo(row) {
    return row.shippingCountry || row.shipToCountry || row.destinationCountry || row.deliveryCountry ||
      row.shipCountry || row.shippingAddress || row.shipTo || row.shippingDestination;
  }
  function destinationEvidence(text) {
    var lines = String(text || "").split(/\r?\n/), found = [];
    for (var i = 0; i < lines.length; i++) {
      var m = lines[i].match(/\b(?:(?:ship(?:s|ping|ped)?|deliver(?:y|ing|ed)?)[\s-]+to(?:\s+country)?|(?:shipping|delivery)\s+(?:destination|address|country|location))\s*:?\s*(.*)$/i);
      if (!m) continue;
      var block = m[1].trim();
      for (var j = i + 1; j < Math.min(i + 7, lines.length); j++) {
        var next = lines[j].trim();
        if (destination(block).length || /^(?:bill(?:ing)?|ships?\b|shipping|shipped|deliver|located\b|from\b|seller|item|order|payment|subtotal|total|price|quantity|returns?|(?:19|20)\d{2}\s+\S|.*Opens in a new window)/i.test(next)) break;
        block = (block + "\n" + next).trim();
      }
      destination(block).forEach(function(c) { if (found.indexOf(c) < 0) found.push(c); });
    }
    return found;
  }
  function declarations(text) {
    var found = [];
    String(text || "").split(/\r?\n/).forEach(function(line) {
      if (!/(?:^\s*currency\s*:|(?:all\s+)?prices?\s+(?:are\s+|shown\s+|listed\s+|displayed\s+)?in\b|payment\s+currency\s*:|charged\s+in\b)/i.test(line)) return;
      codes(line).forEach(function(c) { if (found.indexOf(c) < 0) found.push(c); });
    });
    return found;
  }
  function pageEvidence(text) {
    return { destinations: destinationEvidence(text), declarations: declarations(text) };
  }
  function sourceCurrency(source) {
    return /^(?:comc|sportlots)$/i.test(String(source || "").trim()) ? "USD" : "UNKNOWN";
  }
  function infer(parsed, context, isShipping) {
    parsed = parsed || {}; context = context || {};
    var evidence = [], conflicts = [], selected = "UNKNOWN", reason = "unknown", confidence = "unknown";
    var value = amount(parsed.price), raw = String(parsed.rawPrice || parsed.price || "");
    var tokens = moneyTokens(raw), matching = value == null ? tokens : tokens.filter(function(t) { return t.amount === value; });
    var previous = parsed.currencyEvidence;
    var explicit = !previous || parsed.currencyConfirmedByOwner || /^explicit/.test(previous.reason || "") ? code(parsed.currency) : "UNKNOWN";
    if (explicit !== "UNKNOWN") evidence.push({ currency: explicit, reason: "explicit-field" });
    matching.forEach(function(t) { if (t.currency !== "UNKNOWN") evidence.push({ currency: t.currency, reason: "explicit-price", converted: t.converted }); });
    // This is a per-listing block, never the entire multi-listing paste.
    if (!evidence.length && parsed.currencyText && !isShipping) {
      var itemText = parsed.currencyText.split(/\r?\n/).filter(function(line) { return !/shipping|postage|delivery|order total|tax|charged|exchange rate/i.test(line); }).join("\n");
      var rowTokens = moneyTokens(itemText).filter(function(t) { return value != null && t.amount === value; });
      rowTokens.forEach(function(t) { if (t.currency !== "UNKNOWN") evidence.push({ currency: t.currency, reason: "explicit-row-price", converted: t.converted }); });
    }
    var distinct = [];
    evidence.forEach(function(e) { if (distinct.indexOf(e.currency) < 0) distinct.push(e.currency); });
    if (distinct.length > 1 || matching.some(function(t) { return t.conflict; })) conflicts.push("Conflicting currency for this amount");
    var converted = matching.length > 0 && matching.every(function(t) { return t.converted; });
    function choose(list, why, certainty) {
      if (selected !== "UNKNOWN" || conflicts.length) return;
      if (list.length > 1) { conflicts.push("Conflicting " + why.replace(/-/g, " ")); return; }
      if (list.length === 1) { selected = list[0]; reason = why; confidence = certainty; }
    }
    choose(distinct, evidence.length ? evidence[0].reason : "explicit", "explicit");
    choose(declarations(parsed.currencyText), "row-declaration", "explicit");
    choose(context.page ? context.page.declarations : declarations(context.text || context.rawText), "page-declaration", "explicit");
    var fallback = code(context.fallbackCurrency == null && previous && previous.reason === "manual-fallback" ? previous.currency : context.fallbackCurrency);
    if (fallback !== "UNKNOWN") choose([fallback], "manual-fallback", "manual");
    var source = String(parsed.source || context.source || "").toLowerCase();
    // Native COMC/Sportlots figures use USD; never infer this from a seller
    // called COMC on another marketplace. Explicit row/page codes win above.
    var nativeCode = sourceCurrency(source);
    if (nativeCode !== "UNKNOWN") choose([nativeCode], "source-" + source, "inferred");
    var ship = destination(shipTo(parsed));
    if (!ship.length) ship = destinationEvidence(parsed.currencyText);
    if (!ship.length) ship = context.page ? context.page.destinations : destinationEvidence(context.text || context.rawText);
    choose(ship, "shipping-destination", "inferred");
    if (converted && parsed.recordType === "purchase") conflicts.push("Converted display is not a paid transaction amount");
    return { currency: selected, reason: reason, confidence: confidence, inferred: confidence === "inferred",
      needsReview: conflicts.length > 0 || selected === "UNKNOWN", conflicts: conflicts, convertedDisplay: converted };
  }
  function apply(parsed, context) {
    var result = Object.assign({}, parsed), evidence = infer(parsed, context);
    result.currency = evidence.currency;
    result.currencyEvidence = evidence;
    if (result.shippingNum != null && (code(result.shippingCurrency) === "UNKNOWN" || result.shippingCurrencyInferred)) {
      // A converted item and its postage can use different currencies.
      var postage = Object.assign({}, parsed, { price: parsed.shippingNum, rawPrice: parsed.shipping, currency: "", currencyEvidence: undefined });
      var postageEvidence = result.shippingNum === 0 ? evidence : infer(postage, context, true);
      result.shippingCurrency = postageEvidence.currency;
      result.shippingCurrencyInferred = postageEvidence.confidence !== "explicit";
    }
    return result;
  }
  var api = { code: code, codes: codes, amount: amount, parseMoney: parseMoney, infer: infer, apply: apply, destinationEvidence: destinationEvidence, pageEvidence: pageEvidence, sourceCurrency: sourceCurrency, shipTo: shipTo };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.ScanCurrency = api;
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
