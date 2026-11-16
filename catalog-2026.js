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

  var cards = rows.map(function (row) {
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
      sources: [sourceUrl, checklistUrl, parallelUrl, oddsUrl],
      checkedAt: "2026-11-15"
    };
  });

  if (typeof window !== "undefined") window.TB_CATALOG_UPDATES = cards;
  if (typeof module !== "undefined" && module.exports) module.exports = cards;
})();
