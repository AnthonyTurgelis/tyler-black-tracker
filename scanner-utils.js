/* Subject-first scanner for collections containing more than one person. */
(function(root) {
  "use strict";
  var money = typeof module !== "undefined" && module.exports ? require("./scan-currency.js") : root.ScanCurrency;
  function norm(value) { return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " "); }
  function subject(card, roster) {
    if (!card) return "";
    return String(card.subject || card.playerName || card.name || (roster && roster[card.player] && roster[card.player].name) || card.player || "");
  }
  function subjects(text, cards, roster) {
    var names = [], hay = " " + norm(text) + " ";
    (cards || []).forEach(function(card) { var name = subject(card, roster); if (name && name !== "__test__" && names.indexOf(name) < 0 && hay.indexOf(" " + norm(name) + " ") >= 0) names.push(name); });
    // A parent name must not match a junior's title just because it is shorter.
    return names.filter(function(name) { return !names.some(function(other) { return norm(other) !== norm(name) && (" " + norm(other) + " ").indexOf(" " + norm(name) + " ") >= 0; }) && !new RegExp("(?:^| )" + norm(name).replace(/ /g, "\\s+") + "\\s+(?:jr|junior|ii|iii)(?: |$)").test(norm(text)); });
  }
  function parseTitle(title, options) {
    options = options || {};
    var names = subjects(title, options.cards, options.roster), year = String(title || "").match(/\b((?:19|20)\d{2})(?:-\d{2})?\b/);
    var serial = String(title || "").match(/\b(\d+)\s*\/\s*(\d+)\b/), run = String(title || "").match(/\/\s*(\d+)\b/);
    var cardNo = String(title || "").replace(/\bserial\s*#?\s*\d+/ig, "").replace(/#\d+\s*\/\s*\d+/g, "").match(/#([a-z0-9][a-z0-9_.-]*)/i);
    var fullProduct = String(title || "").match(/^(?:19|20)\d{2}(?:-\d{2})?\s+(.+?)\s+#/);
    var product = fullProduct ? fullProduct[1].split(/\s+-\s+/)[0] : "";
    var variant = fullProduct && /\s+-\s+/.test(fullProduct[1]) ? fullProduct[1].split(/\s+-\s+/).slice(1).join(" ").replace(/\[Base\]/g, "").trim() : "";
    return { year: year ? year[1] : "", product: product, variant: variant, cardNo: cardNo ? cardNo[1] : "", cardNoClean: cardNo ? cardNo[1] : "",
      serial: serial ? serial[1] : "", printRun: run ? run[1] : "", subject: names.length === 1 ? names[0] : "", description: names.join(" / "),
      rawSet: String(title || ""), source: options.source || "", seller: options.source || "", isAuto: /\b(?:auto|autograph|autographs|signed)\b/i.test(title), subjectAmbiguous: names.length !== 1 };
  }
  function match(parsed, cards, roster) {
    var title = parsed.rawSet || "", names = subjects([title,parsed.subject,parsed.description].join(" "), cards, roster);
    if (names.length !== 1 || !parsed.year) return null;
    var titleNorm = " " + norm(title) + " ";
    var candidates = (cards || []).filter(function(card) {
      if (card.isTestCard || norm(subject(card, roster)) !== norm(names[0])) return false;
      var year = String(card.year || (String(card.product).match(/\b(?:19|20)\d{2}\b/) || [""])[0]);
      if (year !== String(parsed.year)) return false;
      var cardNo = String(card.cardNumber || "").trim();
      if (!cardNo || !parsed.cardNo || norm(cardNo) !== norm(parsed.cardNo)) return false;
      var product = norm(card.product).replace(/^\d{4}\s+/, ""), given = norm(parsed.product);
      if (given !== product) {
        var words = product.split(" ").filter(function(w) { return !/^(?:panini|topps|leaf|wnba|nba|nascar|racing|baseball|basketball|football|hockey|the)$/.test(w); });
        if (!words.length || !words.every(function(w) { return titleNorm.indexOf(" " + w + " ") >= 0; })) return false;
      }
      var cardRun = String(card.copies || card.printRun || "");
      if (parsed.printRun && cardRun !== String(parsed.printRun)) return false;
      var variant = norm(card.cardSet || card.variant || "Base").replace(/\b(?:sn|pr)\d+\b/g, "").replace(/\s+\d+$/, "").trim();
      var requested = norm(parsed.variant).replace(/\b(?:sn|pr)\d+\b/g, "").replace(/\s+\d+$/, "").trim();
      if (requested) return variant === requested;
      if (variant === "base") return !/\b(?:gold|silver|red|blue|green|orange|purple|pink|black|white|refractor|prizm|prizms|foil|parallel|auto|autograph|signed|variation|wave|shimmer)\b/.test(norm(title).replace(norm(card.product).replace(/^\d{4}\s+/, ""), "").replace(norm(names[0]), ""));
      var terms = variant.split(" ").filter(function(w) { return w !== "base"; });
      return terms.length > 0 && terms.every(function(w) { return titleNorm.indexOf(" " + w + " ") >= 0 || titleNorm.indexOf(" " + w.replace(/s$/, "") + " ") >= 0; });
    });
    return candidates.length === 1 ? {card:candidates[0],score:100,subjectVerified:true} : null;
  }
  function parseListings(text, options) {
    options = options || {};
    var lines = String(text || "").split(/\r?\n/), results = [];
    var source = options.source || (/Sold Via:|Current Price:/i.test(text) ? "130point" : /Low Price:|Total Quantity:/i.test(text) ? "SportLots" : /Opens in a new window or tab/.test(text) ? "eBay" : /Whatnot|Ships from|Card image/i.test(text) ? "Whatnot" : /COMC|NM or Better/i.test(text) ? "COMC" : "Scan");
    if (source === "SportLots" && /Low Price:/i.test(text)) return parseSportLots(text, options);
    if (source === "130point" && /Sale Price:|Current Price:/i.test(text)) return parse130Point(text, options);
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line || !/\b(?:19|20)\d{2}\b/.test(line)) continue;
      var parts = line.split("|"), isPipe = parts.length >= 3;
      var title = (isPipe ? parts[0] : line).replace(/Opens in a new window or tab\s*$/, "").trim();
      if (!isPipe && !subjects(title,options.cards,options.roster).length) {
        for (var look = 1; look <= 2 && i + look < lines.length; look++) {
          if (/\b(?:19|20)\d{2}\b/.test(lines[i + look])) break;
          if (subjects(lines[i + look],options.cards,options.roster).length) { title += " " + lines[i + look].trim(); break; }
        }
      }
      var p = parseTitle(title, {cards:options.cards,roster:options.roster,source:source});
      if (!p.subject) continue;
      var rawPrice = isPipe ? parts[1].trim() : "", block = [line];
      if (!isPipe) {
        var inline = money.parseMoney(line);
        if (inline && inline.amount != null) rawPrice = line;
        for (var j = i + 1; j < Math.min(i + 16, lines.length); j++) {
          var next = lines[j].trim();
          if (/Opens in a new window or tab/.test(next) || (/\b(?:19|20)\d{2}\b/.test(next) && subjects(next,options.cards,options.roster).length)) break;
          block.push(next);
          if (!rawPrice && !/shipping|delivery|postage|bids?|time left/i.test(next)) { var candidate = money.parseMoney(next); if (candidate && candidate.amount != null) rawPrice = next; }
          if (/^(?:\d+ bids?|Current Number of Bids:)/i.test(next)) { p.listingType = "auction"; p.bids = (next.match(/\d+/) || [""])[0]; }
        }
      }
      var price = money.parseMoney(rawPrice);
      p.price = price && price.amount != null ? String(price.amount) : ""; p.rawPrice = rawPrice; p.currencyText = block.join("\n");
      p.currency = isPipe ? money.code(parts[5]) : "UNKNOWN";
      p.recordType = options.recordType || (isPipe ? "purchase" : "listing");
      p.date = isPipe ? (parts[2] || "").trim() : ""; p.orderNum = isPipe ? (parts[3] || "").trim() : "";
      p.itemUrl = isPipe ? (parts[4] || "").trim() : ""; p.quantity = isPipe ? (parts[6] || "").trim() : "";
      results.push(money.apply(p, {text:text,fallbackCurrency:options.fallbackCurrency}));
    }
    return results;
  }
  function parseSportLots(text, options) {
    var lines = String(text || "").split(/\r?\n/), results = [];
    for (var i = 0; i < lines.length; i++) {
      var cardLine = lines[i].trim();
      if (!/^#\S+\s+/.test(cardLine) || subjects(cardLine,options.cards,options.roster).length !== 1) continue;
      var setLine = "";
      for (var j = i - 1; j >= Math.max(0,i - 7); j--) { if (/^(?:19|20)\d{2}(?:-\d{2})?\s+/.test(lines[j].trim())) { setLine = lines[j].trim(); break; } }
      if (!setLine) continue;
      var block = [setLine,cardLine], rawPrice = "";
      for (var k = i + 1; k < Math.min(lines.length,i + 9); k++) {
        if (/^(?:#\S+\s+|(?:19|20)\d{2}\s+)/.test(lines[k].trim())) break;
        block.push(lines[k]); if (/Low Price:/i.test(lines[k])) rawPrice = lines[k].replace(/.*?Low Price:\s*/i, "");
      }
      var p = parseTitle(setLine + " " + cardLine, {cards:options.cards,roster:options.roster,source:"SportLots"}), price = money.parseMoney(rawPrice);
      p.price = price && price.amount != null && !price.conflict ? String(price.amount) : "";
      p.rawPrice = rawPrice; p.currencyText = block.join("\n"); p.recordType = "listing";
      // Total Quantity is seller availability, never the owner's copy count.
      results.push(money.apply(p, {text:text,fallbackCurrency:options.fallbackCurrency}));
    }
    return results;
  }
  function parse130Point(text, options) {
    var lines = String(text || "").split(/\r?\n/), results = [];
    for (var i = 0; i < lines.length; i++) {
      var title = lines[i].trim();
      if (!/\b(?:19|20)\d{2}\b/.test(title) || subjects(title,options.cards,options.roster).length !== 1) continue;
      var block = [title], sale = "", current = "", listed = "", date = "";
      for (var j = i + 1; j < lines.length; j++) {
        var line = lines[j].trim();
        if (/^Sold Via:/.test(line) || (/\b(?:19|20)\d{2}\b/.test(line) && subjects(line,options.cards,options.roster).length)) break;
        block.push(line);
        if (/^Sale Price:/i.test(line)) sale = line.replace(/^Sale Price:\s*/i, "");
        if (/^Current Price:/i.test(line)) current = line.replace(/^Current Price:\s*/i, "");
        if (/^List Price:/i.test(line)) listed = line.replace(/^List Price:\s*/i, "");
        if (/^(?:End )?Date:/i.test(line)) date = line.replace(/^(?:End )?Date:\s*/i, "");
      }
      if (!sale && !current) continue;
      var p = parseTitle(title.replace(/\s*(?:Best Offer Accepted|Fixed Price Sale|Auction)\s*$/i, ""), {cards:options.cards,roster:options.roster,source:"130point"});
      var rawPrice = sale || current, price = money.parseMoney(rawPrice), listPrice = money.parseMoney(listed);
      p.price = price && price.amount != null && !price.conflict ? String(price.amount) : "";
      p.rawPrice = rawPrice; p.currencyText = block.join("\n"); p.recordType = sale ? "sold" : "listing"; p.date = date;
      p.listingType = /Auction|Current Number of Bids:/i.test(block.join("\n")) ? "auction" : "fixed";
      p._130pt = {forSale:!sale,listPrice:listPrice && listPrice.amount,salePrice:price && price.amount,date:date};
      // A public sale result never becomes this owner's paid receipt.
      results.push(money.apply(p, {text:text,fallbackCurrency:options.fallbackCurrency}));
    }
    return results;
  }
  function tcdbImportStatus(current, requested) {
    current = current || "not_owned";
    if (current === "owned" || current === "for_sale") return current;
    if (requested === "owned") return "owned";
    if (requested === "in_transit" && current === "not_owned") return "in_transit";
    return current;
  }
  function sameListingEvidence(entry, parsed, currency, kind) {
    if (String(entry.source || "").toLowerCase() !== String(parsed.source || "").toLowerCase() || entry.currency !== currency || entry.kind !== kind) return false;
    var itemId = parsed.itemId || parsed.sourceItemId;
    if (itemId) return String(entry.itemId || "") === String(itemId);
    return !!parsed.rawSet && (entry.titles || []).indexOf(parsed.rawSet) >= 0;
  }
  var api = {norm:norm,subject:subject,subjects:subjects,parseTitle:parseTitle,match:match,parseListings:parseListings,tcdbImportStatus:tcdbImportStatus,sameListingEvidence:sameListingEvidence};
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.CollectionScanner = api;
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
