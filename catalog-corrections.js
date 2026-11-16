/* Scan-backed catalogue corrections. Numeric IDs and existing price-series keys stay stable. */
(function (root) {
  "use strict";
  var corrections = {
    94: {copies:"25", sourceUrl:"https://www.ebay.com/itm/366692503928", evidenceNotes:"Front/back reference scan confirms FF-TB1 Flash Forward Green autograph, numbered 6/25. The photographed numerator belongs only to that reference copy; it is not the owner's serial."},
    95: {copies:"99", sourceUrl:"https://www.comc.com/item/116159628", evidenceNotes:"Actual COMC Flash Forward Navy autograph front/back scan identifies FF-TB1 and 32/99. Numerator is copy-specific."},
    98: {copies:"50", sourceUrl:"https://www.comc.com/item/273554571", evidenceNotes:"COMC Flash Forward Platinum Blue front/back scan shows FF-TB1 and 37/50. Numerator is copy-specific."},
    110: {cardSet:"Autographs Printing Plate Yellow", copies:"1", isAuto:"Yes", sourceUrl:"https://www.comc.com/item/118315068", evidenceNotes:"Front/back scan explicitly identifies the yellow printing plate, BA-TB1, 1/1. This clarifies the previous generic Yellow label without creating another card ID."},
    147: {copies:"10", sourceUrl:"https://www.ebay.ca/itm/900009584427", evidenceNotes:"Actual pink Wave autograph front and FS-TB1 reverse show 6/10. Corrects the previous /1 catalogue run; preserves all collection records."},
    154: {copies:"25", sourceUrl:"https://www.comc.com/item/224506454", evidenceNotes:"COMC Future Stars Purple Rainbow autograph front/back scan identifies FS-TB1 and 8/25. Numerator is copy-specific."},
    211: {copies:"20", sourceUrl:"https://www.comc.com/item/336212221", evidenceNotes:"Actual State Pride Blue Wave autograph front/back scan identifies SP-TB1 and 18/20. The numerator belongs only to this photographed copy."},
    1439: {copies:"49", sourceUrl:"https://www.ebay.com/itm/147191131045", evidenceNotes:"Actual Top Shelf Signatures front shows 08/49; reverse identifies TSS-TB. TCDB's 2025 Topps Tier One Top Shelf Signatures base checklist independently lists Tyler Black as SN49. The numerator belongs only to the reference copy, and Gold Foil is not added as a separate parallel."},
    1478: {issueType:"pre_production_proof", verification:"observed", signature:"signed", proofColor:"Green", proofFinish:"Crystal", serialMark:"1/1 (manufacturer label)", evidenceNotes:"The manufacturer label in the purchase scan explicitly identifies an autographed Crystal Green pre-production proof, 1/1. This remains separate from the regular State Pride autograph parallel."},
    2008: {sourceUrl:"https://www.ebay.com/itm/880027323406", evidenceNotes:"Checklist-listed 2026 Topps Update US138 Diamante Foil is also supported by an observed front/back listing scan. No serial run is visible; no ownership or price is inferred from this reference."}
  };
  function apply(cards) {
    return (cards || []).map(function(card) {
      var patch = corrections[card.id];
      if (!patch) return card;
      var next = Object.assign({}, card, patch);
      if (patch.cardSet || patch.product || patch.cardNumber) next.priceKey = card.priceKey || card.product.slice(0,4) + "|" + card.product + "|" + card.cardNumber + "|" + (card.cardSet || "Base");
      return next;
    });
  }
  root.TB_CARD_CORRECTIONS = corrections;
  root.applyTylerCatalogueCorrections = apply;
  if (typeof module !== "undefined" && module.exports) module.exports = {corrections:corrections,apply:apply};
})(typeof window !== "undefined" ? window : {});
