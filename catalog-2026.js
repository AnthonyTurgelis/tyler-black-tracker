/*
 * Tyler Black: 2026 Topps Update #US138, checked 2026-11-15.
 * These are explicitly checklist-documented versions, not a claim that every
 * version has been physically sighted. See catalog-sources.md for provenance.
 * Keep these IDs stable: existing collection records use numeric card IDs.
 */
(function () {
  "use strict";

  var sourceUrl = "https://www.breakninja.com/baseball/2026-Topps-Update-Series-Baseball-Checklist-Milwaukee-Brewers.php";
  var checklistUrl = "https://www.yocardo.com/WebRoot/Store28/Shops/91062111/6AB0/D075/2373/F2D5/7C0D/0A0C/6D0F/9144/2026_Topps_Update_Series_Baseball_Checklist.pdf";
  var parallelUrl = "https://www.checklistinsider.com/2026-topps-update-series-baseball";
  var oddsUrl = "https://cdn.shopify.com/s/files/1/0662/9749/5709/files/2026_Topps_Baseball_Updates_Series_Odds.pdf?v=1790610141";

  // Explicit subject-specific rows. Empty copies means no confirmed serial run;
  // it never means zero copies or an estimated production quantity.
  var rows = [
    [2001, "Base", ""],
    [2002, "Rainbow Foil", ""],
    [2003, "Aqua Rainbow Foil", ""],
    [2004, "Sandglitter", ""],
    [2005, "Holo Foil", ""],
    [2006, "Pink Holo Foil", ""],
    [2007, "Aqua Holo Foil", ""],
    [2008, "Diamante Foil", ""],
    [2009, "Pink Diamante Foil", ""],
    [2010, "Topps Logo Foil Pattern", ""],
    [2011, "Cherry Blossom Foil", ""],
    [2012, "Silver Crackle", ""],
    [2013, "Gold", "2026"],
    [2014, "Purple Rainbow Foil", "250"],
    [2015, "Purple Holo Foil", "250"],
    [2016, "Blue Rainbow Foil", "150"],
    [2017, "Blue Holo Foil", "150"],
    [2018, "Green Rainbow Foil", "99"],
    [2019, "Green Holo Foil", "99"],
    [2020, "Green Diamante Foil", "99"],
    [2021, "Independence Day", "76"],
    [2022, "75 Years of Topps", "75"],
    [2023, "Black", "75"],
    [2024, "Canvas", "50"],
    [2025, "Gold Rainbow Foil", "50"],
    [2026, "Gold Sandglitter", "50"],
    [2027, "Gold Holo Foil", "50"],
    [2028, "Gold Diamante Foil", "50"],
    [2029, "Wood", "25"],
    [2030, "Memorial Day Camo", "25"],
    [2031, "Orange Rainbow Foil", "25"],
    [2032, "Orange Sandglitter", "25"],
    [2033, "Orange Holo Foil", "25"],
    [2034, "Orange Diamante Foil", "25"],
    [2035, "Black Rainbow Foil", "10"],
    [2036, "Black Sandglitter", "10"],
    [2037, "Black Holo Foil", "10"],
    [2038, "Black Diamante Foil", "10"],
    [2039, "Red Rainbow Foil", "5"],
    [2040, "Red Sandglitter", "5"],
    [2041, "Red Holo Foil", "5"],
    [2042, "Red Diamante Foil", "5"],
    [2043, "FoilFractor", "1"],
    [2044, "Rose Gold Holo Foil", "1"],
    [2045, "Printing Plate Black", "1"],
    [2046, "Printing Plate Cyan", "1"],
    [2047, "Printing Plate Magenta", "1"],
    [2048, "Printing Plate Yellow", "1"],
    [2049, "Golden Mirror Variation", ""]
  ];

  // TCDB exact-version references checked 2026-11-22. Checklist-level only:
  // empty image or unconfirmed physical existence still means unobserved.
  // IDs, variant names and print runs are unchanged for market/ownership stability.
  var tcdbRefs = {
    2001: [686684, 40536255],
    2002: [692418, 40549983],
    2003: [692419, 40537311],
    2004: [692440, 40552095],
    2005: [692445, 40544703],
    2006: [692446, 40547519],
    2007: [692447, 40536959],
    2008: [692456, 40540831],
    2009: [692457, 40547167],
    2010: [692463, 40552799],
    2011: [692464, 40540479],
    2012: [692465, 40552447],
    2013: [692420, 40541535],
    2014: [692431, 40549631],
    2015: [692448, 40549279],
    2016: [692432, 40539775],
    2017: [692449, 40539423],
    2018: [692433, 40544351],
    2019: [692450, 40543999],
    2020: [692458, 40543647],
    2021: [692421, 40545055],
    2022: [692422, 40536607],
    2023: [692423, 40537663],
    2024: [692424, 40540127],
    2025: [692434, 40542591],
    2026: [692441, 40542943],
    2027: [692451, 40542239],
    2028: [692459, 40541887],
    2029: [692425, 40553151],
    2030: [692426, 40545407],
    2031: [692435, 40546463],
    2032: [692442, 40546815],
    2033: [692452, 40546111],
    2034: [692460, 40545759],
    2035: [692437, 40538719],
    2036: [692443, 40539071],
    2037: [692453, 40538367],
    2038: [692461, 40538015],
    2039: [692438, 40551039],
    2040: [692444, 40551391],
    2041: [692454, 40550687],
    2042: [692462, 40550335],
    2043: [692439, 40541183],
    2044: [692455, 40551743],
    2045: [692430, 40547871],
    2046: [692427, 40548223],
    2047: [692428, 40548575],
    2048: [692429, 40548927],
    2049: [692474, 40543295]
  };
  var cards = rows.map(function (row) {
    var tcdbRef = tcdbRefs[row[0]];
    var tcdbUrl = tcdbRef ? "https://www.tcdb.com/ViewCard.cfm/sid/" + tcdbRef[0] + "/cid/" + tcdbRef[1] + "/2026-Topps-Update-US138-Tyler-Black" : "";
    return {
      id: row[0],
      product: "2026 Topps Update",
      cardNumber: "US138",
      cardSet: row[1],
      copies: row[2],
      issueType: "standard",
      verification: "checklist",
      isAuto: "",
      isMem: "",
      isRC: "",
      sourceUrl: sourceUrl,
      tcdbUrl: tcdbUrl,
      sources: [tcdbUrl, sourceUrl, checklistUrl, parallelUrl, oddsUrl].filter(Boolean),
      checkedAt: "2026-11-22"
    };
  });

  if (typeof window !== "undefined") window.TB_CATALOG_UPDATES = cards;
  if (typeof module !== "undefined" && module.exports) module.exports = cards;
})();
