/* Shared catalogue rules. Collection identity always remains the numeric card ID. */
(function (root) {
  "use strict";
  var labels = {
    standard: "Checklist card",
    pre_production_proof: "Pre-production proof",
    manufacturer_proof: "Manufacturer proof",
    prototype: "Prototype / test issue",
    custom: "Custom / fantasy",
    unverified: "Needs review"
  };
  var fields = ["issueType", "verification", "sourceUrl", "evidenceNotes", "proofColor", "proofFinish", "signature", "serialMark", "certification", "parentCardId", "updatedAt"];
  function normalize(value) {
    return String(value == null ? "" : value).normalize("NFKC").trim().toLowerCase()
      .replace(/\s*\(not_on_tcdb\)/g, "").replace(/pre[\s-]*production/g, "preproduction").replace(/\s+/g, " ");
  }
  function inferType(card) {
    var text = [card.product,card.cardSet].filter(Boolean).join(" ").replace(/[‐‑‒–—]/g, "-").replace(/[’‘]/g, "'");
    if (/\bpre[\s-]*prod(?:uction)?\b/i.test(text)) return "pre_production_proof";
    // Artist Proof, Press Proof and Photographer's Proof are regular parallels.
    if (/\b(?:artist(?:'s|s)?|press|photographer(?:'s|s)?)\s+proofs?\b/i.test(text)) return card.isCustom ? "unverified" : "standard";
    if (/\b(?:signed|unsigned|slabbed|manufacturer(?:'s)?|autographed)\s+proofs?\b|\bproofs?\s+auto/i.test(text)) return "manufacturer_proof";
    if (/\bleaf\b/i.test(card.product || "") && /\bproofs?\b(?!\s+of\b)/i.test(text)) return "manufacturer_proof";
    if (/\bprototype\b|\btest issue\b/i.test(text)) return "prototype";
    return card.isCustom ? "unverified" : "standard";
  }
  function proofType(type) { return ["pre_production_proof", "manufacturer_proof", "prototype"].includes(type); }
  function signatureFromText(value, proof) {
    var text = String(value || "");
    if (/\bunsigned\b|\bnon[ -]?(?:auto(?:graph(?:ed|s)?)?|signed)\b|\bno\s+(?:autograph|signature|auto)\b/i.test(text)) return "unsigned";
    if (/\bsigned\b|\bautographed\b/i.test(text)) return "signed";
    return !proof && /\bauto(?:graph)?s?\b|\bsignatures?\b/i.test(text) ? "signed" : "unknown";
  }
  function getInfo(card) {
    card = card || {};
    var info = {};
    fields.forEach(function (key) {
      info[key] = card[key] == null ? "" : card[key];
      if (card.catalogMeta && Object.prototype.hasOwnProperty.call(card.catalogMeta, key)) info[key] = card.catalogMeta[key];
    });
    if (!labels[info.issueType] || info.issueType === "unverified") {
      var inferred = inferType(card);
      if (!labels[info.issueType] || proofType(inferred)) info.issueType = inferred;
    }
    if (!["checklist", "observed", "unverified"].includes(info.verification)) {
      info.verification = info.issueType === "standard" && !card.isCustom ? "checklist" : "unverified";
    }
    if (!["signed", "unsigned", "unknown"].includes(info.signature)) {
      var negative = signatureFromText([card.product,card.cardSet].filter(Boolean).join(" "),true) === "unsigned";
      // A legacy Autographs family or isAuto flag does not establish a proof's signature.
      info.signature = negative ? "unsigned" : proofType(info.issueType) ? signatureFromText(card.cardSet,true) : card.isAuto === "Yes" ? "signed" : signatureFromText(card.cardSet,false);
    }
    return info;
  }
  function isChecklistCard(card) {
    var info = getInfo(card);
    return !card.archived && !card.checklistAliasOf && info.issueType === "standard" && info.verification !== "unverified";
  }
  function isProof(card) {
    return proofType(getInfo(card).issueType);
  }
  function hasAutograph(card) { return getInfo(card).signature === "signed"; }
  function signatureLabel(card) { var signature=getInfo(card).signature; return signature === "signed" ? "Signed" : signature === "unsigned" ? "Unsigned" : "Signature unconfirmed"; }
  function matchesScope(card, scope) {
    if (card.archived) return false;
    if (!scope || scope === "all") return true;
    if (scope === "checklist") return isChecklistCard(card);
    var proofScope = /^(proofs|preproduction|manufacturer_proofs|prototypes)(?:_(signed|unsigned|unknown))?$/.exec(scope);
    if (proofScope) {
      var info = getInfo(card);
      if (!proofType(info.issueType)) return false;
      if (proofScope[1] === "preproduction" && info.issueType !== "pre_production_proof") return false;
      if (proofScope[1] === "manufacturer_proofs" && info.issueType !== "manufacturer_proof") return false;
      if (proofScope[1] === "prototypes" && info.issueType !== "prototype") return false;
      return !proofScope[2] || info.signature === proofScope[2];
    }
    if (scope === "custom") return getInfo(card).issueType === "custom";
    if (scope === "review") return getInfo(card).verification === "unverified" || getInfo(card).issueType === "unverified";
    return true;
  }
  function identityKey(card) {
    var info = getInfo(card);
    return [card.product, card.cardNumber, card.cardSet, card.copies, info.signature, info.proofColor, info.proofFinish].map(normalize).join("|");
  }
  function sameIdentity(left, right) {
    // Unknown print run / optional proof detail must not bypass duplicate checks.
    if (!["product", "cardNumber", "cardSet"].every(function (key) { return normalize(left[key]) === normalize(right[key]); })) return false;
    var a = getInfo(left), b = getInfo(right);
    if (a.issueType === "standard" && proofType(b.issueType) || b.issueType === "standard" && proofType(a.issueType)) return false;
    if (left.copies && right.copies && normalize(left.copies) !== normalize(right.copies)) return false;
    if (a.signature !== "unknown" && b.signature !== "unknown" && a.signature !== b.signature) return false;
    return ["proofColor", "proofFinish"].every(function (key) { return !a[key] || !b[key] || normalize(a[key]) === normalize(b[key]); });
  }
  function normalizeCustomCards(cards) {
    if (!Array.isArray(cards)) return [];
    return cards.map(function (card, index) {
      return Object.assign({}, card, { id: Number.isSafeInteger(Number(card.id)) && Number(card.id) >= 10000 ? Number(card.id) : 10000 + index, isCustom: true });
    });
  }
  function nextCustomId(cards, now) {
    var ids = new Set((cards || []).map(function (card) { return Number(card.id); }));
    var id = Math.max(10000, now || Date.now());
    while (ids.has(id)) id++;
    return id;
  }
  function safeUrl(value) {
    if (!value) return "";
    try { var url = new URL(String(value).trim()); return /^(https?:)$/.test(url.protocol) && !url.username && !url.password ? url.href : ""; }
    catch (error) { return ""; }
  }
  function validate(card, original) {
    var info = getInfo(card);
    if (!/^\d{4}\s+\S/.test(String(card.product || "").trim())) return "Enter a year and product, for example 2021 Leaf Metal Draft.";
    if (!String(card.cardNumber || "").trim()) return "Enter the card number, or NNO if the card has no number.";
    if (!String(card.cardSet || "").trim()) return "Enter the exact variant shown on the card.";
    if (card.copies !== "" && card.copies != null && (!/^\d+$/.test(String(card.copies)) || Number(card.copies) < 1)) return "Print run must be a positive whole number, or blank when unknown.";
    if (info.sourceUrl && !safeUrl(info.sourceUrl)) return "Use a complete http or https source link.";
    // Existing cards remain editable without inventing evidence; new cards need provenance.
    if (!original && !info.sourceUrl && !String(info.evidenceNotes || "").trim()) return "Add a source link or a note describing the card or photo you checked.";
    if (info.issueType === "standard" && info.verification === "checklist" && !info.sourceUrl && (!original || getInfo(original).verification !== "checklist")) return "Add the checklist source link before including this as a checklist-confirmed card.";
    if (info.parentCardId && Number(info.parentCardId) === Number(card.id)) return "A card cannot be linked to itself.";
    return "";
  }
  var api = { getInfo: getInfo, kindLabel: function (kind) { return labels[kind] || labels.unverified; }, isChecklistCard: isChecklistCard, isProof: isProof, hasAutograph: hasAutograph, signatureLabel: signatureLabel, signatureFromText: signatureFromText, matchesScope: matchesScope, identityKey: identityKey, sameIdentity: sameIdentity, normalizeCustomCards: normalizeCustomCards, nextCustomId: nextCustomId, safeUrl: safeUrl, validate: validate, fields: fields };
  if (root) root.CardCatalog = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : null);
