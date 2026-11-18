/* Source-checked Tempo supplement, 2026-11-18. No collection/storage writes.
 * Existing numeric IDs remain authoritative. Variant codes below are permanent:
 * append a new code, never renumber/reuse one or derive IDs from array positions.
 */
(function () {
  "use strict";
  var checkedAt = "2026-11-18";
  var sources = {
    roster: "https://tempo.wnba.com/roster",
    trade: "https://www.wnba.com/news/rapid-reactions-trade-deadline-2026",
    opening: "https://tempo.wnba.com/news/toronto-tempo-announce-2026-opening-roster",
    expansion: "https://tempo.wnba.com/news/toronto-tempo-inaugural-roster-tracker",
    gm: "https://www.wnba.com/watch/video/monica-wright-rogers-draft-lottery-press-conference",
    prizm: "https://www.tcdb.com/Checklist.cfm/sid/679894/2026-Panini-Prizm-WNBA",
    prizmParallels: "https://www.tcdb.com/Inserts.cfm/sid/679894/2026-Panini-Prizm-WNBA",
    prizmRuns: "https://www.checklistinsider.com/2026-panini-prizm-wnba-basketball",
    donruss: "https://www.tcdb.com/Checklist.cfm/sid/647539/2026-Donruss-WNBA",
    donrussParallels: "https://www.tcdb.com/Inserts.cfm/sid/647539/2026-Donruss-WNBA",
    donrussRuns: "https://www.checklistinsider.com/2026-donruss-wnba-basketball",
    morrowPrizm: "https://www.tcdb.com/Checklist.cfm/sid/557926/2025-PaniniPrizmWNBA",
    morrowPrizmParallels: "https://www.tcdb.com/Inserts.cfm/sid/557926/2025-Panini-Prizm-WNBA",
    morrowPrizmRuns: "https://www.checklistinsider.com/2025-panini-prizm-wnba-basketball",
    morrowDonruss: "https://www.tcdb.com/Checklist.cfm/sid/531852/2025-Donruss-WNBA",
    morrowDonrussParallels: "https://www.tcdb.com/Inserts.cfm/sid/531852/2025-Donruss-WNBA",
    morrowDonrussRuns: "https://www.checklistinsider.com/2025-donruss-wnba-basketball",
    morrowSelect: "https://www.tcdb.com/Checklist.cfm/sid/590361/2025-Panini-Select-WNBA",
    morrowSelectParallels: "https://www.tcdb.com/Inserts.cfm/sid/590361/2025-Panini-Select-WNBA",
    morrowSelectRuns: "https://www.checklistinsider.com/2025-panini-select-wnba-basketball",
    impeccable: "https://gogts.net/wp-content/uploads/2026/07/2026-Panini-WNBA-Impeccable-Checklist.pdf",
    impeccableRelease: "https://gogts.net/2026-panini-impeccable-wnba-basketball-cards-cards-checklist/",
    impeccablePublisher: "https://blog.paniniamerica.net/2026-panini-impeccable-wnba-a-gallery-of-greatness/"
  };
  var rosterPatch = {
    green: {name:"Zaay Green", number:"00", position:"G", role:"player", active:true},
    gakdeng: {name:"Maria Gakdeng", number:6, position:"F-C", role:"player", active:true, developmental:true},
    borkowska: {name:"Kamila Borkowska", number:11, position:"C", role:"player", active:true, developmental:true},
    morrow: {name:"Aneesah Morrow", number:24, position:"F", role:"player", active:true, joinedAt:"2026-07-31", acquisition:"Trade from Connecticut", transactionSource:sources.trade},
    bankole: {name:"Ornella Bankole", number:33, position:"F", role:"player", active:true},
    held: {active:false, rosterStatus:"Former Tempo"},
    nye: {active:false, rosterStatus:"Former Tempo"},
    milic: {active:false, rosterStatus:"Former Tempo"},
    laksa: {active:false, rosterStatus:"Former Tempo"},
    wallace: {name:"Kristy Wallace", active:false, rosterStatus:"Former Tempo", sourceUrl:sources.expansion},
    wright: {name:"Monica Wright", active:true, role:"staff", title:"General Manager", currentName:"Monica Wright Rogers", sourceUrl:sources.gm}
  };
  Object.keys(rosterPatch).forEach(function (key) {
    rosterPatch[key].checkedAt = checkedAt;
    if (!rosterPatch[key].sourceUrl) rosterPatch[key].sourceUrl = sources.roster;
  });
  // Base subject lists verified against the TCDB checklists; team is the printed
  // checklist team, not a player's current team. Both Kiki Rice base cards exist.
  var prizmSubjects = [
    [2,"sabally","Toronto Tempo"], [6,"morrow","Connecticut Sun"],
    [11,"sykes","Toronto Tempo"], [32,"fagbenle","Toronto Tempo"],
    [51,"nurse","Toronto Tempo"], [62,"key","Toronto Tempo"],
    [119,"mabrey","Toronto Tempo"], [135,"rice","Toronto Tempo"],
    [148,"rice","Toronto Tempo"], [154,"allemand","Toronto Tempo"],
    [157,"held","Toronto Tempo"], [174,"brondello","Miami Sol"]
  ];
  var prizmVariants = [
    [0,"Base",""], [1,"30th Anniversary Prizms","30"],
    [2,"Black Finite Prizms","1"], [3,"Black Gold Pandora Prizms","5"],
    [4,"Black Gold Prizms","5"], [5,"Black Velocity Prizms","39"],
    [6,"Blue Prizms","199"], [7,"Blue Pulsar Prizms","199"],
    [8,"Blue Seismic Prizms",""], [9,"Blue Velocity Prizms",""],
    [10,"Carolina Blue Prizms","125"], [11,"Celestial Lattice Prizms",""],
    [12,"Checkerboard Prizms",""], [13,"Cherry Blossom FOTL Prizms","20"],
    [14,"Flash Prizms",""], [15,"Gold Ice Prizms","10"],
    [16,"Gold Prizms","10"], [17,"Gold Pulsar Prizms","10"],
    [18,"Gold Seismic Prizms","10"], [19,"Gold Vinyl Prizms","1"],
    [20,"Gold WNBA Logo Prizms","10"], [21,"Green Ice Prizms",""],
    [22,"Green Prizms",""], [23,"Green Pulsar Prizms","25"],
    [24,"Green Seismic Prizms",""], [25,"Hyper Prizms",""],
    [26,"Ice Prizms",""], [27,"Lavender Prizms","110"],
    [28,"Lime Green Prizms","225"], [29,"Lotus Flower FOTL Prizms","3"],
    [30,"Mojo Prizms","25"], [31,"Mosaic Prizms","3"],
    [32,"Orange Ice Prizms",""], [33,"Orange Prizms","99"],
    [34,"Orange Seismic Prizms","30"], [35,"Orange Velocity Prizms",""],
    [36,"Pandora Prizms",""], [37,"Pink Prizms","175"],
    [38,"Pink Pulsar Prizms","225"], [39,"Pink Seismic Prizms",""],
    [40,"Pink Velocity Prizms","79"], [41,"Plum Blossom FOTL Prizms","8"],
    [42,"Premium Box Set Prizms","99"], [43,"Purple Prizms","149"],
    [44,"Purple Seismic Prizms","175"], [45,"Purple Velocity Prizms","59"],
    [46,"Red Pandora Prizms","199"], [47,"Red Power Prizms","75"],
    [48,"Red Prizms","299"], [49,"Red Pulsar Prizms","299"],
    [50,"Red Seismic Prizms","249"], [51,"Silver Prizms",""],
    [52,"Snake Skin Prizms",""], [53,"Swirl Prizms",""],
    [54,"Teal Prizms","49"], [55,"Teal Seismic Prizms","49"],
    [56,"WNBA Logo Prizms",""], [57,"White Ice Prizms","35"],
    [58,"White Seismic Prizms",""], [59,"White Sparkle Prizms",""]
  ];
  var donrussSubjects = [
    [7,"morrow","Connecticut Sun"], [36,"mabrey","Toronto Tempo"],
    [52,"sykes","Toronto Tempo"], [57,"nurse","Chicago Sky"],
    [78,"sabally","Toronto Tempo"], [85,"nye","Toronto Tempo"],
    [91,"rice","Toronto Tempo"]
  ];
  var donrussVariants = [
    [0,"Base",""], [1,"30th Anniversary","30"], [2,"Black Gold Laser","5"],
    [3,"Black Lava","1"], [4,"Black Shimmer","1"], [5,"Blue Laser","49"],
    [6,"Blue Shimmer","99"], [7,"Cubic",""], [8,"Dragon",""],
    [9,"Gold Lava","10"], [10,"Gold Shimmer","10"], [11,"Green Laser","399"],
    [12,"Green Lava",""], [13,"Green Shimmer",""], [14,"Holo",""],
    [15,"Holo Black Laser","1"], [16,"Holo Gold Laser","10"],
    [17,"Holo Team Logo FOTL","9"], [18,"Holo WNBA Logo",""],
    [19,"Lava",""], [20,"Light Blue Lava","75"], [21,"Orange Laser","299"],
    [22,"Orange Lava","199"], [23,"Orange Mojo","8"], [24,"Pink Laser","25"],
    [25,"Pink Lava","25"], [26,"Pink Shimmer","25"], [27,"Purple Laser","99"],
    [28,"Purple Lava","99"], [29,"Purple Shimmer","499"], [30,"Red Laser","185"],
    [31,"Red Lava","299"], [32,"Teal Laser","199"], [33,"White Laser","75"]
  ];
  var cards = [];
  function addBase(block, product, subjects, variants, checklist, parallel, runs) {
    subjects.forEach(function (subject) {
      variants.forEach(function (variant) {
        var card = {
          id: block + subject[0] * 100 + variant[0], year:2026, product:product,
          cardNumber:String(subject[0]), cardSet:variant[1], player:subject[1],
          team:subject[2], copies:variant[2], issueType:"standard", verification:"checklist",
          sourceUrl:checklist, sources:[checklist, parallel, runs], checkedAt:checkedAt
        };
        if (product === "Panini Prizm WNBA" && subject[0] === 62 && variant[0] === 0) card.id = 2091;
        if (subject[1] === "rice" || subject[1] === "key") { card.isRookie = true; card.isRC = "Yes"; }
        if (product === "Donruss WNBA" && subject[0] === 91) card.cardSet = variant[0] === 0 ? "Rated Rookies" : "Rated Rookies " + variant[1];
        if (product === "Donruss WNBA" && variant[0] === 18) {
          card.printRunReview = true;
          card.evidenceNotes = "Card existence is verified. Print run remains blank: TCDB lists /30 but the independent checklist lists this parallel without numbering; verify a card back before assigning a run.";
        }
        cards.push(card);
      });
    });
  }
  addBase(202600000,"Panini Prizm WNBA",prizmSubjects,prizmVariants,sources.prizm,sources.prizmParallels,sources.prizmRuns);
  addBase(202700000,"Donruss WNBA",donrussSubjects,donrussVariants,sources.donruss,sources.donrussParallels,sources.donrussRuns);
  // Manufacturer checklist distributed by GTS, pages 2-21. Printed teams vary
  // across 2026 products, so Sabally/Fagbenle retain their checklist teams here.
  addBase(203400000,"Panini Impeccable WNBA",[
    [22,"morrow","Connecticut Sun"],[31,"nurse","Toronto Tempo"],[38,"nye","Toronto Tempo"],
    [49,"sabally","New York Liberty"],[73,"mabrey","Toronto Tempo"],
    [76,"fagbenle","Golden State Valkyries"],[88,"sykes","Toronto Tempo"],[96,"rice","Toronto Tempo"]
  ],[
    [0,"Base","75"],[1,"Base Amethyst","8"],[2,"Base Blue","35"],[3,"Base Emerald","5"],
    [4,"Base Gold","25"],[5,"Base Holo Gold","10"],[6,"Base Holo Silver","15"],
    [7,"Base Platinum","1"],[8,"Base Red FOTL","4"],[9,"Base Silver","49"]
  ],sources.impeccable,sources.impeccableRelease,sources.impeccablePublisher);
  // Exact observed checklist entries only. Autograph parallel availability varies
  // by subject: do not expand a player's auto into every listed product parallel.
  var extras = [
    [202800001,"2","Base Prizms Autographs Black","sabally","Toronto Tempo","1",700919,true],
    [202800002,"6","Base Prizms Autographs Silver","morrow","Connecticut Sun","",700928,true],
    [202800003,"11","Base Prizms Autographs Silver","sykes","Toronto Tempo","",700928,true],
    [202800004,"51","Base Prizms Autographs Silver","nurse","Toronto Tempo","",700928,true],
    [202800005,"119","Base Prizms Autographs Silver","mabrey","Toronto Tempo","",700928,true],
    [202800006,"135","Base Prizms Autographs Silver","rice","Toronto Tempo","",700928,true],
    [202800007,"148","Base Prizms Autographs Silver","rice","Toronto Tempo","",700928,true],
    [202800008,"15","Fractal","rice","Toronto Tempo","",698868,false],
    [202800009,"PS-KR","Prizmatrix Signatures","rice","Toronto Tempo","",700929,true],
    [202800010,"PS-AN","Prizmatrix Signatures","nye","Atlanta Dream","",700929,true],
    [202800011,"SIG-KR","Signatures","rice","Toronto Tempo","",701018,true],
    [202800012,"SIG-NS","Signatures","sabally","Toronto Tempo","",701018,true]
  ];
  extras.forEach(function (r) {
    cards.push({id:r[0],year:2026,product:"Panini Prizm WNBA",cardNumber:r[1],cardSet:r[2],player:r[3],team:r[4],copies:r[5],
      issueType:"standard",verification:"checklist",isAuto:r[7],signature:r[7]?"signed":"unsigned",
      sourceUrl:"https://www.tcdb.com/Checklist.cfm/sid/"+r[6], checkedAt:checkedAt});
  });
  var donrussExtras = [
    [202900001,"91","Rated Rookie Signatures","rice","Toronto Tempo",689289,true,false],
    [202900002,"SS-AM","Signature Series","morrow","Connecticut Sun",691997,true,false],
    [202900003,"SS-AN","Signature Series","nye","Toronto Tempo",691997,true,false],
    [202900004,"SS-KN","Signature Series","nurse","Chicago Sky",691997,true,false],
    [202900005,"SS-MM","Signature Series","mabrey","Toronto Tempo",691997,true,false],
    [202900006,"TTS-MM","Timeless Treasures Signatures","mabrey","Toronto Tempo",686875,true,false],
    [202900007,"TTS-NS","Timeless Treasures Signatures","sabally","Toronto Tempo",686875,true,false],
    [202900008,"JS-AM","Jersey Series","morrow","Connecticut Sun",689043,false,true],
    [202900009,"JS-BS","Jersey Series","sykes","Toronto Tempo",689043,false,true],
    [202900010,"JS-KN","Jersey Series","nurse","Chicago Sky",689043,false,true],
    [202900011,"JS-MM","Jersey Series","mabrey","Toronto Tempo",689043,false,true],
    [202900012,"RJ-KR","Rookie Jerseys","rice","Toronto Tempo",689050,false,true],
    [202900013,"3","Elite Series","mabrey","Toronto Tempo",690288,false,false],
    [202900014,"8","League Leaders","morrow","Connecticut Sun",690146,false,false]
  ];
  donrussExtras.forEach(function (r) {
    cards.push({id:r[0],year:2026,product:"Donruss WNBA",cardNumber:r[1],cardSet:r[2],player:r[3],team:r[4],copies:"",
      issueType:"standard",verification:"checklist",isAuto:r[6],signature:r[6]?"signed":"unsigned",isRelic:r[7],
      sourceUrl:"https://www.tcdb.com/Checklist.cfm/sid/"+r[5],checkedAt:checkedAt});
  });
  // Morrow's trade brings her existing rookie catalog into the Tempo project.
  // These are 2025-labeled releases even where the release occurred in 2026.
  function addMorrowBase(block, product, numbers, variants, checklist, parallel, runs) {
    numbers.forEach(function (number) {
      variants.forEach(function (variant) {
        cards.push({id:block+number*100+variant[0],year:2025,product:product,cardNumber:String(number),
          cardSet:variant[1],player:"morrow",team:"Connecticut Sun",copies:variant[2],isRookie:true,isRC:"Yes",
          issueType:"standard",verification:"checklist",sourceUrl:checklist,sources:[checklist,parallel,runs],checkedAt:checkedAt});
      });
    });
  }
  var morrowPrizmVariants = [
    [0,"Base",""],[1,"Black Finite Prizms","1"],[2,"Black Gold Prizms","5"],[3,"Black Velocity Prizms","39"],
    [4,"Blue Prizms","199"],[5,"Blue Pulsar Prizms","199"],[6,"Blue Velocity Prizms",""],[7,"Carolina Blue Prizms","125"],
    [8,"Checkerboard Prizms",""],[9,"Cherry Blossoms Prizms","20"],[10,"Gold Prizms","10"],[11,"Gold Seismic Prizms","10"],
    [12,"Gold Vinyl Prizms","1"],[13,"Green Prizms",""],[14,"Green Pulsar Prizms","25"],[15,"Ice Prizms",""],
    [16,"Lime Green Prizms","225"],[17,"Lotus Flower Prizms","3"],[18,"Mojo Prizms","25"],[19,"Mosaic Prizms","3"],
    [20,"Orange Ice Prizms",""],[21,"Orange Prizms","99"],[22,"Orange Velocity Prizms",""],[23,"Pandora Prizms",""],
    [24,"Pink Prizms","175"],[25,"Pink Velocity Prizms","79"],[26,"Purple Prizms","149"],[27,"Purple Seismic Prizms","175"],
    [28,"Purple Velocity Prizms","59"],[29,"Red Pandora Prizms","199"],[30,"Red Power Prizms","75"],[31,"Red Prizms","299"],
    [32,"Red Pulsar Prizms","299"],[33,"Red Seismic Prizms","249"],[34,"Silver Prizms",""],[35,"Snakeskin Prizms",""],
    [36,"Swirl Prizms",""],[37,"Teal Prizms","49"],[38,"Teal Seismic Prizms","49"],[39,"WNBA Logo Gold Prizms","10"],
    [40,"WNBA Logo Prizms",""],[41,"White Seismic Prizms",""],[42,"White Sparkle Prizms",""]
  ];
  addMorrowBase(203000000,"Panini Prizm WNBA",[79,146],morrowPrizmVariants,sources.morrowPrizm,sources.morrowPrizmParallels,sources.morrowPrizmRuns);
  var morrowDonrussVariants = [
    [0,"Rated Rookies",""],[1,"Artist Proof","25"],[2,"Black Gold Laser","5"],[3,"Black Holo Press Proof","1"],
    [4,"Black Shimmer","1"],[5,"Blue Laser","49"],[6,"Blue Shimmer","49"],[7,"Cubic",""],[8,"Dragon",""],
    [9,"Gold Shimmer","10"],[10,"Green Laser",""],[11,"Green Shimmer",""],[12,"Holo",""],[13,"Holo Black Laser","1"],
    [14,"Holo Gold Laser","10"],[15,"Holo Team Logo","13"],[16,"Holo WNBA Logo",""],[17,"Lava",""],
    [18,"Light Blue Lava","75"],[19,"Orange Laser","199"],[20,"Orange Lava","199"],[21,"Pink Laser","25"],
    [22,"Pink Shimmer","25"],[23,"Purple Laser","99"],[24,"Purple Lava","99"],[25,"Purple Shimmer","99"],
    [26,"Red Holo","299"],[27,"Red Lava","399"],[28,"Red Shimmer","399"],[29,"Teal Laser","125"],[30,"Yellow Lava","5"]
  ].map(function (v) { return [v[0],v[0] ? "Rated Rookies "+v[1] : v[1],v[2]]; });
  addMorrowBase(203100000,"Donruss WNBA",[99],morrowDonrussVariants,sources.morrowDonruss,sources.morrowDonrussParallels,sources.morrowDonrussRuns);
  // Select tier availability is explicit: Courtside omits the Concourse/Premier
  // colors, and Red/Light Blue Disco are Concourse-only; Purple/Orange Premier-only.
  var morrowSelectVariants = [
    [0,"Base","",[42,176,215]],
    [1,"Black Finite Prizms","1",[42,176,215]],[2,"Black Gold Prizms","5",[42,176,215]],
    [3,"Blue Scope Prizms","199",[42,176]],[4,"Blue Shimmer FOTL Prizms","7",[42,176,215]],
    [5,"Bronze Checker Prizms","49",[42,176]],[6,"Checkerboard Prizms","",[42,176,215]],
    [7,"Gold Flash Prizms","10",[42,176,215]],[8,"Gold Ice Prizms","10",[42,176,215]],
    [9,"Gold Prizms","10",[42,176,215]],[10,"Gold Vinyl Prizms","1",[42,176,215]],
    [11,"Green Flash Prizms","",[42,176,215]],[12,"Green Ice Prizms","",[42,176,215]],
    [13,"Green and Blue Prizms","349",[42,176]],[14,"Jazz Prizms","",[42,176]],
    [15,"Light Blue Disco Prizms","125",[42]],[16,"Neon Green Prizms","75",[42,176]],
    [17,"Orange Flash Prizms","",[42,176,215]],[18,"Orange Prizms","125",[176]],
    [19,"Orange and Purple Prizms","99",[42,176]],[20,"Pink Camo Prizms","175",[42,176]],
    [21,"Pink Flash Prizms","",[42,176,215]],[22,"Pink Ice Prizms","",[42,176,215]],
    [23,"Pink Shimmer FOTL Prizms","3",[42,176,215]],[24,"Pink and Purple Prizms","99",[42,176]],
    [25,"Purple Flash Prizms","149",[42,176,215]],[26,"Purple Ice Prizms","149",[42,176,215]],
    [27,"Purple Prizms","149",[176]],[28,"Red Flash Prizms","349",[42,176,215]],
    [29,"Red Ice Prizms","299",[42,176,215]],[30,"Red Prizms","149",[42]],
    [31,"Red and Blue Prizms","399",[42,176]],[32,"Silver Party Prizms","",[42,176,215]],
    [33,"Silver Prizms","",[42,176,215]],[34,"Tie-Dye Prizms","25",[42,176,215]],
    [35,"Tiger Prizms","",[42,176,215]],[36,"White Prizms","99",[42,176]],[37,"Zebra Prizms","",[42,176,215]]
  ];
  [42,176,215].forEach(function (number) {
    var tier = number === 42 ? "Concourse" : number === 176 ? "Premier Level" : "Courtside";
    var variants = morrowSelectVariants.filter(function(v) { return v[3].indexOf(number) !== -1; }).map(function(v) {
      return [v[0],tier+(v[0] ? " "+v[1] : ""),v[2]];
    });
    addMorrowBase(203200000,"Panini Select WNBA",[number],variants,sources.morrowSelect,sources.morrowSelectParallels,sources.morrowSelectRuns);
  });
  [
    [203300001,"Panini Prizm WNBA","SG-AM","Signatures",633764],
    [203300002,"Donruss WNBA","99","Rated Rookies Signatures",566978],
    [203300003,"Panini Select WNBA","DSS-AM","Draft Selections Signatures",669873]
  ].forEach(function (r) {
    cards.push({id:r[0],year:2025,product:r[1],cardNumber:r[2],cardSet:r[3],player:"morrow",team:"Connecticut Sun",copies:"",
      issueType:"standard",verification:"checklist",isAuto:true,signature:"signed",
      sourceUrl:"https://www.tcdb.com/Checklist.cfm/sid/"+r[4],checkedAt:checkedAt});
  });
  cards.push({id:203500001,year:2026,product:"Panini Instant WNBA Draft Night",cardNumber:"DN-06",cardSet:"Base",player:"rice",
    team:"Toronto Tempo",copies:"",printRun:2147,serialNumbered:false,issueType:"standard",verification:"checklist",
    sourceUrl:"https://www.tcdb.com/Checklist.cfm/sid/654429/2026-Panini-Instant-WNBA-Draft-Night",checkedAt:checkedAt,
    evidenceNotes:"Published print run 2,147; this is not a stamped serial-number denominator."});
  [
    [203500002,"237","30th Anniversary","mabrey","30","https://www.paniniamerica.net/pi-mmabrey-0237-26wnba-30anniversary"],
    [203500003,"339","Base","rice","","https://www.paniniamerica.net/pi-krice-0339-26wnba-base-card.html"]
  ].forEach(function (r) {
    cards.push({id:r[0],year:2026,product:"Panini Instant WNBA",cardNumber:r[1],cardSet:r[2],player:r[3],team:"",copies:r[4],
      issueType:"standard",verification:"publisher",sourceUrl:r[5],checkedAt:checkedAt,
      evidenceNotes:"Publisher confirms card identity. Printed team and unnumbered base print run are left blank pending card-back verification."});
  });
  function identity(c) { return [c.year,c.product,c.cardNumber,c.cardSet,c.player].join("|"); }
  function isKeyPlaceholder(c) {
    return c && c.id === 2091 && c.year === 2026 && c.product === "Panini Prizm WNBA" &&
      c.cardNumber === "TBD" && c.cardSet === "Base" && c.player === "key";
  }
  function apply(target) {
    if (!Array.isArray(target.TEMPO_ALL_CARDS)) return {applied:false,reason:"Tempo base catalog not loaded"};
    var byId = {}, byIdentity = {}, corrections = [], additions = [], conflicts = [];
    target.TEMPO_ALL_CARDS.forEach(function (c) { byId[c.id] = c; byIdentity[identity(c)] = c; });
    cards.forEach(function (c) {
      var old = byId[c.id];
      if (c.id === 2091 && isKeyPlaceholder(old)) { corrections.push({old:old,card:c}); return; }
      if (old) { if (identity(old) !== identity(c)) conflicts.push(c.id); return; }
      if (!byIdentity[identity(c)]) additions.push(Object.assign({},c));
    });
    if (conflicts.length) return {applied:false,reason:"Catalog ID conflict",conflicts:conflicts};
    // Preflight above completes before any mutation. No ownership maps are read
    // or written; preserved ID 2091 keeps every status/quantity/photo/note link.
    corrections.forEach(function (change) {
      Object.assign(change.old, change.card, {catalogCorrection:{date:checkedAt,field:"cardNumber",before:"TBD",after:"62",sourceUrl:sources.prizm}});
    });
    Array.prototype.push.apply(target.TEMPO_ALL_CARDS, additions);
    target.TEMPO_ROSTER = target.TEMPO_ROSTER || {};
    Object.keys(rosterPatch).forEach(function (key) {
      target.TEMPO_ROSTER[key] = Object.assign({},target.TEMPO_ROSTER[key] || {},rosterPatch[key]);
    });
    target.TEMPO_ACTIVE_PLAYERS = Object.keys(target.TEMPO_ROSTER).map(function (slug) {
      return Object.assign({slug:slug},target.TEMPO_ROSTER[slug]);
    }).filter(function (p) { return p.active; }).sort(function (a,b) {
      var ar = a.role === "player" ? 0 : 1, br = b.role === "player" ? 0 : 1;
      return ar-br || (a.number == null ? 999 : Number(a.number))-(b.number == null ? 999 : Number(b.number)) || a.name.localeCompare(b.name);
    });
    target.TEMPO_CARD_BY_ID = {}; target.TEMPO_CARDS_BY_PLAYER = {};
    target.TEMPO_ALL_CARDS.forEach(function (c) {
      target.TEMPO_CARD_BY_ID[c.id] = c;
      if (!c.isTestCard) (target.TEMPO_CARDS_BY_PLAYER[c.player] || (target.TEMPO_CARDS_BY_PLAYER[c.player] = [])).push(c);
    });
    return {applied:true,added:additions.length,corrected:corrections.map(function (x) { return x.card.id; }),checkedAt:checkedAt};
  }
  var coverageNote = "Roster checked November 18, 2026. Includes verified 2026 Prizm, Donruss and Impeccable base parallels, selected Instant cards, and Morrow's 2025 Prizm/Donruss/Select run. Inserts, autographs and other releases remain partial. Catalog entries do not mark cards owned or wanted.";
  var api = {cards:cards,rosterPatch:rosterPatch,sources:sources,apply:apply,checkedAt:checkedAt,coverageNote:coverageNote};
  if (typeof window !== "undefined") { window.Tempo2026 = api; window.TEMPO_CATALOG_UPDATE = apply(window); }
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
