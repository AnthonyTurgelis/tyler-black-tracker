const { useState, useEffect, useMemo, useCallback, useRef } = React;
const RAW_DATA = {"p":["2021 Bowman Draft","2021 Bowman Draft 1st Edition","2021 Bowman Draft Sapphire Edition","2021 Bowman's Best","2021 Leaf Draft","2021 Leaf Flash","2021 Leaf Metal Draft","2021 Leaf Trinity","2021 Leaf Valiant","2021 Panini Elite Extra Edition","2021 Panini Prizm Draft Picks","2021 Pro Set","2021 Pro Set Metal","2022 Bowman","2022 Bowman Chrome","2022 Bowman Inception","2022 Bowman Platinum","2022 Bowman Sterling","2022 Choice Wisconsin Timber Rattlers","2022 Panini Prizm Draft Picks","2022 Topps Heritage Minor League","2022 Topps Pro Debut","2023 Choice Biloxi Shuckers","2023 Choice Biloxi Shuckers Top Prospects","2023 Donruss","2023 Leaf Metal","2023 Panini Chronicles","2023 Panini Elite Extra Edition","2023 Panini Prizm","2024 Bowman","2024 Bowman Chrome","2024 Bowman Chrome Sapphire Edition","2024 Bowman's Best","2024 Choice Nashville Sounds","2024 Donruss","2024 Leaf Trinity","2024 Leaf Trinity Mega Box","2024 Panini Boys of Summer","2024 Panini Crusade","2024 Panini Flawless","2024 Panini Impeccable","2024 Panini National Treasures","2024 Panini Prospect Edition","2024 Panini Select","2024 Panini Three and Two","2024 Pulse (unlicensed)","2024 Stadium Club","2024 Topps Archives","2024 Topps Chrome Cosmic","2024 Topps Chrome Update","2024 Topps Chrome Update Sapphire Edition","2024 Topps Gilded Collection","2024 Topps Heritage","2024 Topps Inception","2024 Topps Japan Edition","2024 Topps Now","2024 Topps Transcendent Collection","2024 Topps Triple Threads","2024 Topps Update","2025 Bowman","2025 Donruss","2025 Panini Crusade","2025 Topps Milwaukee Brewers","2025 Topps Pristine","2025 Topps Tier One","2024 Leaf Trinity (NOT_ON_TCDB)","2024 Topps Chrome Update (NOT_ON_TCDB)","2023 Panini Donruss (NOT_ON_TCDB)","2021 Leaf Pro Set (NOT_ON_TCDB)","2024 Leaf Baseball (NOT_ON_TCDB)","2021 Leaf (NOT_ON_TCDB)","2021 Leaf Metal Draft (NOT_ON_TCDB)","2021 Leaf Valiant (NOT_ON_TCDB)","TEST SET - DO NOT DELETE"],"c":[[73,"TEST-1","Test Variant","999"],[0,"BD-200","Base",""],[0,"BD-200","Aqua","199"],[0,"BD-200","Black","1"],[0,"BD-200","Blue","150"],[0,"BDC-200","Chrome",""],[0,"BDC-200","Chrome Aqua Lava Refractor","199"],[0,"BDC-200","Chrome Asia Refractor",""],[0,"BDC-200","Chrome Black & White RayWave Refractor",""],[0,"BDC-200","Chrome Blue Refractor","150"],[0,"CDA-TB","Chrome Draft Pick Autographs",""],[0,"CDA-TB","Chrome Draft Pick Autographs Aqua Lava Refractor","199"],[0,"CDA-TB","Chrome Draft Pick Autographs Black & White RayWave Refractor","50"],[0,"CDA-TB","Chrome Draft Pick Autographs Black Refractor","75"],[0,"CDA-TB","Chrome Draft Pick Autographs Black Wave Refractor","1"],[0,"CDA-TB","Chrome Draft Pick Autographs Blue Refractor","150"],[0,"CDA-TB","Chrome Draft Pick Autographs Blue Wave Refractor","150"],[0,"CDA-TB","Chrome Draft Pick Autographs Gold Refractor","50"],[0,"CDA-TB","Chrome Draft Pick Autographs Gold Wave Refractor","50"],[0,"CDA-TB","Chrome Draft Pick Autographs Green Refractor","99"],[0,"CDA-TB","Chrome Draft Pick Autographs Orange Refractor","25"],[0,"CDA-TB","Chrome Draft Pick Autographs Printing Plates Black","1"],[0,"CDA-TB","Chrome Draft Pick Autographs Printing Plates Cyan","1"],[0,"CDA-TB","Chrome Draft Pick Autographs Printing Plates Magenta","1"],[0,"CDA-TB","Chrome Draft Pick Autographs Printing Plates Yellow","1"],[0,"CDA-TB","Chrome Draft Pick Autographs Purple Refractor","250"],[0,"CDA-TB","Chrome Draft Pick Autographs Red Lava Refractor","5"],[0,"CDA-TB","Chrome Draft Pick Autographs Red Refractor","5"],[0,"CDA-TB","Chrome Draft Pick Autographs Red Wave Refractor","5"],[0,"CDA-TB","Chrome Draft Pick Autographs Refractor","499"],[0,"CDA-TB","Chrome Draft Pick Autographs Sparkle Refractor","71"],[0,"CDA-TB","Chrome Draft Pick Autographs SuperFractor","1"],[0,"BDC-200","Chrome Gold Refractor","50"],[0,"BDC-200","Chrome Gold Refractor","50"],[0,"BDC-200","Chrome Green Refractor","99"],[0,"BDC-200","Chrome Green Sparkle Refractor","99"],[0,"BDC-200","Chrome Orange Refractor","25"],[0,"BDC-200","Chrome Printing Plates Black","1"],[0,"BDC-200","Chrome Printing Plates Cyan","1"],[0,"BDC-200","Chrome Printing Plates Magenta","1"],[0,"BDC-200","Chrome Printing Plates Yellow","1"],[0,"BDC-200","Chrome Purple Refractor","250"],[0,"BDC-200","Chrome Red Lava Refractor","5"],[0,"BDC-200","Chrome Red Refractor","5"],[0,"BDC-200","Chrome Refractor",""],[0,"BDC-200","Chrome Sky Blue Refractor",""],[0,"BDC-200","Chrome Sparkle Refractor",""],[0,"BDC-200","Chrome SuperFractor","1"],[0,"BDC-200","Chrome Yellow Lava Refractor","75"],[0,"BD-200","Gold","50"],[0,"BD-200","Green","99"],[0,"BD-200","Orange","25"],[0,"BD-200","Printing Plates Black","1"],[0,"BD-200","Printing Plates Cyan","1"],[0,"BD-200","Printing Plates Magenta","1"],[0,"BD-200","Printing Plates Yellow","1"],[0,"BD-200","Purple","250"],[0,"BD-200","Red","5"],[0,"BD-200","Sky Blue","499"],[1,"BD-200","Base",""],[1,"BD-200","Blue Foil","150"],[1,"BD-200","Gold Foil","50"],[1,"BD-200","Orange Foil","25"],[1,"BD-200","Rainbow Foil","1"],[1,"BD-200","Red Foil","5"],[1,"BD-200","Sky Blue Foil",""],[1,"BD-200","Yellow Foil","75"],[2,"BDC-200","Base",""],[2,"BDC-200","Aqua","20"],[2,"BDC-200","Gold","15"],[2,"BDC-200","Green","50"],[2,"BDC-200","Orange","25"],[2,"BDC-200","Padparadscha","1"],[2,"BDC-200","Purple","10"],[2,"BDC-200","Red","5"],[2,"BDC-200","Yellow","99"],[3,"B21-TB","Best of 2021 Autographs",""],[3,"B21-TB","Best of 2021 Autographs Atomic Refractor","25"],[3,"B21-TB","Best of 2021 Autographs Blue Refractor","150"],[3,"B21-TB","Best of 2021 Autographs Gold Lava Refractor","75"],[3,"B21-TB","Best of 2021 Autographs Gold Refractor","50"],[3,"B21-TB","Best of 2021 Autographs Green Refractor","99"],[3,"B21-TB","Best of 2021 Autographs Printing Plates Black","1"],[3,"B21-TB","Best of 2021 Autographs Printing Plates Cyan","1"],[3,"B21-TB","Best of 2021 Autographs Printing Plates Magenta","1"],[3,"B21-TB","Best of 2021 Autographs Printing Plates Yellow","1"],[3,"B21-TB","Best of 2021 Autographs Red Lava Refractor","5"],[3,"B21-TB","Best of 2021 Autographs Red Refractor","10"],[3,"B21-TB","Best of 2021 Autographs Refractor",""],[3,"B21-TB","Best of 2021 Autographs SuperFractor","1"],[4,"BA-TB1","Autographs",""],[4,"BA-TB1","Autographs Gold",""],[5,"BA-TB1","Base",""],[5,"FF-TB1","Flash Forward Autographs Green",""],[5,"FF-TB1","Flash Forward Autographs Navy",""],[5,"FF-TB1","Flash Forward Autographs Orange",""],[5,"FF-TB1","Flash Forward Autographs Pink",""],[5,"FF-TB1","Flash Forward Autographs Platinum Blue",""],[5,"FF-TB1","Flash Forward Autographs Purple",""],[5,"FF-TB1","Flash Forward Autographs Red",""],[5,"FF-TB1","Flash Forward Autographs Silver",""],[5,"FF-TB1","Flash Forward Autographs Yellow","1"],[5,"BA-TB1","Green",""],[5,"BA-TB1","Navy","99"],[5,"BA-TB1","Orange",""],[5,"BA-TB1","Pink",""],[5,"BA-TB1","Platinum Blue","50"],[5,"BA-TB1","Purple","75"],[5,"BA-TB1","Red","50"],[5,"BA-TB1","Yellow","1"],[5,"BA-TB1","Yellow","1"],[6,"BA-TB1","Base",""],[6,"BA-TB1","Black Crystals","5"],[6,"BA-TB1","Black Mojo",""],[6,"BA-TB1","Black Rainbow",""],[6,"BA-TB1","Black Wave","7"],[6,"BA-TB1","Blue Crystals",""],[6,"BA-TB1","Blue Mojo",""],[6,"BA-TB1","Blue Rainbow",""],[6,"BA-TB1","Blue Wave",""],[6,"FS-TB1","Future Stars Autographs",""],[6,"FS-TB1","Future Stars Autographs Black Crystals",""],[6,"FS-TB1","Future Stars Autographs Black Mojo",""],[6,"FS-TB1","Future Stars Autographs Black Rainbow",""],[6,"FS-TB1","Future Stars Autographs Black Wave",""],[6,"FS-TB1","Future Stars Autographs Blue Crystals",""],[6,"FS-TB1","Future Stars Autographs Blue Mojo",""],[6,"FS-TB1","Future Stars Autographs Blue Rainbow","35"],[6,"FS-TB1","Future Stars Autographs Blue Rainbow","35"],[6,"FS-TB1","Future Stars Autographs Blue Wave",""],[6,"FS-TB1","Future Stars Autographs Gold Circles","1"],[6,"FS-TB1","Future Stars Autographs Gold Crystals","1"],[6,"FS-TB1","Future Stars Autographs Gold Mojo","1"],[6,"FS-TB1","Future Stars Autographs Gold Rainbow","1"],[6,"FS-TB1","Future Stars Autographs Gold Wave","1"],[6,"FS-TB1","Future Stars Autographs Green Crystals",""],[6,"FS-TB1","Future Stars Autographs Green Mojo","3"],[6,"FS-TB1","Future Stars Autographs Green Rainbow",""],[6,"FS-TB1","Future Stars Autographs Green Wave",""],[6,"FS-TB1","Future Stars Autographs Orange Crystals",""],[6,"FS-TB1","Future Stars Autographs Orange Mojo",""],[6,"FS-TB1","Future Stars Autographs Orange Rainbow",""],[6,"FS-TB1","Future Stars Autographs Orange Wave",""],[6,"FS-TB1","Future Stars Autographs Pink Crystals","7"],[6,"FS-TB1","Future Stars Autographs Pink Mojo","5"],[6,"FS-TB1","Future Stars Autographs Pink Rainbow","20"],[6,"FS-TB1","Future Stars Autographs Pink Wave","1"],[6,"FS-TB1","Future Stars Autographs Printing Plates Black","1"],[6,"FS-TB1","Future Stars Autographs Printing Plates Cyan","1"],[6,"FS-TB1","Future Stars Autographs Printing Plates Magenta","1"],[6,"FS-TB1","Future Stars Autographs Printing Plates Yellow","1"],[6,"FS-TB1","Future Stars Autographs Purple Crystals",""],[6,"FS-TB1","Future Stars Autographs Purple Mojo",""],[6,"FS-TB1","Future Stars Autographs Purple Rainbow",""],[6,"FS-TB1","Future Stars Autographs Purple Wave",""],[6,"FS-TB1","Future Stars Autographs Red Crystals",""],[6,"FS-TB1","Future Stars Autographs Red Mojo","1"],[6,"FS-TB1","Future Stars Autographs Red Rainbow",""],[6,"FS-TB1","Future Stars Autographs Red Wave","3"],[6,"FS-TB1","Future Stars Autographs Red, White, and Blue Crystals",""],[6,"FS-TB1","Future Stars Autographs Red, White, and Blue Mojo",""],[6,"FS-TB1","Future Stars Autographs Red, White, and Blue Rainbow",""],[6,"FS-TB1","Future Stars Autographs Red, White, and Blue Wave",""],[6,"FS-TB1","Future Stars Autographs Silver Crystals",""],[6,"FS-TB1","Future Stars Autographs Silver Mojo",""],[6,"FS-TB1","Future Stars Autographs Silver Wave",""],[6,"BA-TB1","Gold Circles","1"],[6,"BA-TB1","Gold Crystals","1"],[6,"BA-TB1","Gold Mojo","1"],[6,"BA-TB1","Gold Rainbow","1"],[6,"BA-TB1","Gold Wave","1"],[6,"BA-TB1","Green Crystals",""],[6,"BA-TB1","Green Mojo",""],[6,"BA-TB1","Green Rainbow",""],[6,"BA-TB1","Green Wave",""],[6,"BA-TB1","Orange Crystals",""],[6,"BA-TB1","Orange Mojo",""],[6,"BA-TB1","Orange Rainbow",""],[6,"BA-TB1","Orange Wave",""],[6,"BA-TB1","Pink Crystals",""],[6,"BA-TB1","Pink Mojo",""],[6,"BA-TB1","Pink Rainbow",""],[6,"BA-TB1","Pink Wave",""],[6,"BA-TB1","Printing Plates Black","1"],[6,"BA-TB1","Printing Plates Cyan","1"],[6,"BA-TB1","Printing Plates Magenta","1"],[6,"BA-TB1","Printing Plates Yellow","1"],[6,"BA-TB1","Purple Crystals",""],[6,"BA-TB1","Purple Mojo",""],[6,"BA-TB1","Purple Rainbow",""],[6,"BA-TB1","Purple Wave",""],[6,"BA-TB1","Red Crystals",""],[6,"BA-TB1","Red Mojo","1"],[6,"BA-TB1","Red Rainbow",""],[6,"BA-TB1","Red Wave",""],[6,"BA-TB1","Red, White, and Blue Crystals",""],[6,"BA-TB1","Red, White, and Blue Mojo",""],[6,"BA-TB1","Red, White, and Blue Rainbow",""],[6,"BA-TB1","Red, White, and Blue Wave",""],[6,"BA-TB1","Silver Crystals",""],[6,"BA-TB1","Silver Mojo",""],[6,"BA-TB1","Silver Wave",""],[6,"SP-TB1","State Pride Autographs",""],[6,"SP-TB1","State Pride Autographs Black Crystals","5"],[6,"SP-TB1","State Pride Autographs Black Mojo",""],[6,"SP-TB1","State Pride Autographs Black Rainbow",""],[6,"SP-TB1","State Pride Autographs Black Wave",""],[6,"SP-TB1","State Pride Autographs Blue Crystals",""],[6,"SP-TB1","State Pride Autographs Blue Mojo","10"],[6,"SP-TB1","State Pride Autographs Blue Rainbow","35"],[6,"SP-TB1","State Pride Autographs Blue Wave",""],[6,"SP-TB1","State Pride Autographs Gold Circles","1"],[6,"SP-TB1","State Pride Autographs Gold Crystals","1"],[6,"SP-TB1","State Pride Autographs Gold Mojo","1"],[6,"SP-TB1","State Pride Autographs Gold Rainbow","1"],[6,"SP-TB1","State Pride Autographs Gold Wave","1"],[6,"SP-TB1","State Pride Autographs Green Crystals",""],[6,"SP-TB1","State Pride Autographs Green Mojo",""],[6,"SP-TB1","State Pride Autographs Green Rainbow",""],[6,"SP-TB1","State Pride Autographs Green Wave",""],[6,"SP-TB1","State Pride Autographs Orange Crystals","3"],[6,"SP-TB1","State Pride Autographs Orange Mojo",""],[6,"SP-TB1","State Pride Autographs Orange Rainbow",""],[6,"SP-TB1","State Pride Autographs Orange Wave",""],[6,"SP-TB1","State Pride Autographs Pink Crystals",""],[6,"SP-TB1","State Pride Autographs Pink Mojo",""],[6,"SP-TB1","State Pride Autographs Pink Rainbow","20"],[6,"SP-TB1","State Pride Autographs Pink Wave","10"],[6,"SP-TB1","State Pride Autographs Printing Plates Black","1"],[6,"SP-TB1","State Pride Autographs Printing Plates Cyan","1"],[6,"SP-TB1","State Pride Autographs Printing Plates Magenta","1"],[6,"SP-TB1","State Pride Autographs Printing Plates Yellow","1"],[6,"SP-TB1","State Pride Autographs Purple Crystals","10"],[6,"SP-TB1","State Pride Autographs Purple Mojo",""],[6,"SP-TB1","State Pride Autographs Purple Rainbow",""],[6,"SP-TB1","State Pride Autographs Purple Wave",""],[6,"SP-TB1","State Pride Autographs Red Crystals",""],[6,"SP-TB1","State Pride Autographs Red Mojo","1"],[6,"SP-TB1","State Pride Autographs Red Rainbow",""],[6,"SP-TB1","State Pride Autographs Red Wave","3"],[6,"SP-TB1","State Pride Autographs Red, White, and Blue Crystals",""],[6,"SP-TB1","State Pride Autographs Red, White, and Blue Mojo",""],[6,"SP-TB1","State Pride Autographs Red, White, and Blue Rainbow",""],[6,"SP-TB1","State Pride Autographs Red, White, and Blue Wave",""],[6,"SP-TB1","State Pride Autographs Silver Crystals",""],[6,"SP-TB1","State Pride Autographs Silver Mojo",""],[6,"SP-TB1","State Pride Autographs Silver Wave",""],[7,"BA-TB1","Base",""],[7,"BA-TB1","Black","10"],[7,"CA-TB1","Clear Autographs Black","10"],[7,"CA-TB1","Clear Autographs Bronze",""],[7,"CA-TB1","Clear Autographs Gold","1"],[7,"CA-TB1","Clear Autographs Green","75"],[7,"CA-TB1","Clear Autographs Platinum","99"],[7,"CA-TB1","Clear Autographs Purple","25"],[7,"CA-TB1","Clear Autographs Red","50"],[7,"CA-TB1","Clear Autographs Silver","5"],[7,"BA-TB1","Gold","1"],[7,"BA-TB1","Green","75"],[7,"PA-TB1","Patch Autographs Black","10"],[7,"PA-TB1","Patch Autographs Bronze",""],[7,"PA-TB1","Patch Autographs Gold","1"],[7,"PA-TB1","Patch Autographs Green","75"],[7,"PA-TB1","Patch Autographs Platinum","99"],[7,"PA-TB1","Patch Autographs Purple","25"],[7,"PA-TB1","Patch Autographs Red","50"],[7,"PA-TB1","Patch Autographs Silver","5"],[7,"BA-TB1","Platinum","99"],[7,"BA-TB1","Purple","25"],[7,"BA-TB1","Red","50"],[7,"BA-TB1","Silver","5"],[8,"BA-TB1","Base",""],[8,"BA-TB1","Black","5"],[8,"FP-TB1","Fearless Phenoms Autographs Black","5"],[8,"FP-TB1","Fearless Phenoms Autographs Green",""],[8,"FP-TB1","Fearless Phenoms Autographs Navy Blue","75"],[8,"FP-TB1","Fearless Phenoms Autographs Orange","99"],[8,"FP-TB1","Fearless Phenoms Autographs Pink","25"],[8,"FP-TB1","Fearless Phenoms Autographs Platinum Blue","35"],[8,"FP-TB1","Fearless Phenoms Autographs Purple","50"],[8,"FP-TB1","Fearless Phenoms Autographs Red","1"],[8,"FP-TB1","Fearless Phenoms Autographs Yellow","10"],[8,"BA-TB1","Navy Blue","75"],[8,"BA-TB1","Orange","99"],[8,"BA-TB1","Pink","25"],[8,"BA-TB1","Platinum Blue","35"],[8,"BA-TB1","Purple","50"],[8,"BA-TB1","Red","1"],[8,"BA-TB1","Yellow","10"],[9,"33","Base","999"],[9,"33","203rd Decade Die Cut","999"],[9,"33","Aspirations Blue","249"],[9,"33","Aspirations Die Cut","91"],[9,"33","Aspirations Gold Die Cut","24"],[9,"33","Aspirations Gold Die Cut","24"],[9,"33","Black","1"],[9,"33","Black Die Cut","1"],[9,"33","Blue","17"],[9,"CTO-TB","College Tickets Optic",""],[9,"CTO-TB","College Tickets Optic Gold","10"],[9,"CTO-TB","College Tickets Optic Gold Vinyl","1"],[9,"CTO-TB","College Tickets Optic Holo",""],[9,"33","New Decade Die Cut Signatures",""],[9,"33","Pink",""],[9,"33","Prime Numbers A","190"],[9,"33","Prime Numbers A Die Cut","90"],[9,"33","Prime Numbers A Signatures","190"],[9,"33","Prime Numbers B","74"],[9,"33","Prime Numbers B Die Cut","116"],[9,"33","Prime Numbers B Signatures","74"],[9,"33","Prime Numbers C","4"],[9,"33","Prime Numbers C Die Cut","186"],[9,"33","Prime Numbers C Signatures","4"],[9,"33","Prime Numbers Gold","24"],[9,"33","Prime Numbers Gold Die Cut","10"],[9,"33","Printing Plates Signatures Black","1"],[9,"33","Printing Plates Signatures Cyan","1"],[9,"33","Printing Plates Signatures Magenta","1"],[9,"33","Printing Plates Signatures Yellow","1"],[9,"33","Red","5"],[9,"33","Signatures",""],[9,"33","Signatures Aspirations Die Cut","91"],[9,"33","Signatures Aspirations Die Cut Gold","24"],[9,"33","Signatures Black","1"],[9,"33","Signatures Black Die Cut","1"],[9,"33","Signatures Blue","20"],[9,"33","Signatures Red","5"],[9,"33","Signatures Status Die Cut","9"],[9,"33","Signatures Status Gold Die Cut","10"],[9,"33","Status Gold Die Cut","10"],[9,"33","Status Green","499"],[9,"33","Status Green Die Cut","9"],[9,"33","Turn of the Century","121"],[10,"PDP33","Base",""],[10,"PDP33","Black Finite Prizm","1"],[10,"PDP33","Blue Donut Circles Prizm","25"],[10,"PDP33","Blue Mojo Prizm",""],[10,"PDP33","Blue Prizm",""],[10,"PDP33","Blue Wave Prizm",""],[10,"PDP33","Burgundy Cracked Ice Prizm","23"],[10,"PDP33","Carolina Blue Velocity Prizm",""],[10,"C-TB","Crusade",""],[10,"C-TB","Crusade",""],[10,"C-TB","Crusade Black Finite Prizm","1"],[10,"C-TB","Crusade Gold Prizm","10"],[10,"C-TB","Crusade Gold Vinyl Prizm","1"],[10,"C-TB","Crusade Silver Prizm",""],[10,"PDP33","Gold Prizm","10"],[10,"PDP33","Gold Vinyl Prizm","1"],[10,"PDP33","Green Pulsar Prizm",""],[10,"PDP33","Hyper Blue & Carolina Blue Prizm",""],[10,"PDP33","Hyper Green & Yellow Prizm",""],[10,"PDP33","Hyper Green & Yellow Prizm",""],[10,"PDP33","Hyper Red & Purple Prizm",""],[10,"PDP33","Lime Green Prizm","75"],[10,"PDP33","Lime Green Prizm","75"],[10,"PDP33","Navy Blue Kaleidoscope Prizm","15"],[10,"PDP33","Navy Blue Pulsar Prizm","5"],[10,"PDP33","Neon Orange Prizm","50"],[10,"PDP33","Pink Velocity Prizm",""],[10,"PDP33","Power Plaid Prizm","35"],[10,"PDP33","Red Donut Circles Prizm","99"],[10,"PDP33","Red Mojo Prizm",""],[10,"PDP33","Red Prizm",""],[10,"PDP33","Red Pulsar Prizm","11"],[10,"PDP33","Red Velocity Prizm",""],[10,"PDP33","Red Wave Prizm",""],[10,"PDP33","Silver Prizm",""],[10,"PDP33","Snake Skin Prizm","25"],[10,"PDP33","Tiger Stripes Prizm","99"],[10,"PDP33","White Donut Circles Prizm","50"],[10,"PDP33","White Sparkle Prizm",""],[11,"PS-TB1","Autographs",""],[11,"PS-TB1","Autographs - Printing Plates Black","1"],[11,"PS-TB1","Autographs - Printing Plates Cyan","1"],[11,"PS-TB1","Autographs - Printing Plates Magenta","1"],[11,"PS-TB1","Autographs - Printing Plates Yellow","1"],[11,"PS-TB1","Autographs Green",""],[12,"PA-TB1","1989 Pro Set Base Autographs Crystal Blue","25"],[12,"PA-TB1","1989 Pro Set Base Autographs Crystal Ebony",""],[12,"PA-TB1","1989 Pro Set Base Autographs Crystal Gold","3"],[12,"PA-TB1","1989 Pro Set Base Autographs Crystal Green","5"],[12,"PA-TB1","1989 Pro Set Base Autographs Crystal Ivory","2"],[12,"NNO","1989 Pro Set Base Autographs Crystal Ivory Unsigned Proofs",""],[12,"PA-TB1","1989 Pro Set Base Autographs Crystal Orange","4"],[12,"PA-TB1","1989 Pro Set Base Autographs Crystal Pink","10"],[12,"PA-TB1","1989 Pro Set Base Autographs Crystal Platinum","1"],[12,"PA-TB1","1989 Pro Set Base Autographs Crystal Purple","15"],[12,"PA-TB1","1989 Pro Set Base Autographs Crystal Red",""],[12,"PA-TB1","1989 Pro Set Base Autographs Crystal Red White Blue","3"],[12,"PA-TB1","1989 Pro Set Base Autographs Crystal Silver","4"],[12,"PA-TB1","1989 Pro Set Base Autographs Gold Circles Silver","1"],[12,"PA-TB1","1989 Pro Set Base Autographs Mojo Blue","20"],[12,"PA-TB1","1989 Pro Set Base Autographs Mojo Ebony","5"],[12,"PA-TB1","1989 Pro Set Base Autographs Mojo Gold",""],[12,"NNO","1989 Pro Set Base Autographs Mojo Gold Unsigned Proofs",""],[12,"PA-TB1","1989 Pro Set Base Autographs Mojo Green","4"],[12,"PA-TB1","1989 Pro Set Base Autographs Mojo Ivory","1"],[12,"PA-TB1","1989 Pro Set Base Autographs Mojo Orange","3"],[12,"PA-TB1","1989 Pro Set Base Autographs Mojo Pink","7"],[12,"PA-TB1","1989 Pro Set Base Autographs Mojo Platinum","1"],[12,"PA-TB1","1989 Pro Set Base Autographs Mojo Purple","10"],[12,"PA-TB1","1989 Pro Set Base Autographs Mojo Red",""],[12,"PA-TB1","1989 Pro Set Base Autographs Mojo Red White Blue","3"],[12,"PA-TB1","1989 Pro Set Base Autographs Mojo Silver","4"],[12,"PA-TB1","1989 Pro Set Base Autographs Rainbow Blue","35"],[12,"PA-TB1","1989 Pro Set Base Autographs Rainbow Ebony","15"],[12,"PA-TB1","1989 Pro Set Base Autographs Rainbow Gold","5"],[12,"PA-TB1","1989 Pro Set Base Autographs Rainbow Green","10"],[12,"PA-TB1","1989 Pro Set Base Autographs Rainbow Ivory","4"],[12,"PA-TB1","1989 Pro Set Base Autographs Rainbow Orange","7"],[12,"PA-TB1","1989 Pro Set Base Autographs Rainbow Pink","20"],[12,"PA-TB1","1989 Pro Set Base Autographs Rainbow Platinum","1"],[12,"PA-TB1","1989 Pro Set Base Autographs Rainbow Purple","25"],[12,"PA-TB1","1989 Pro Set Base Autographs Rainbow Red",""],[12,"PA-TB1","1989 Pro Set Base Autographs Rainbow Red White Blue","6"],[12,"PA-TB1","1989 Pro Set Base Autographs Rainbow Red White Blue","6"],[12,"PA-TB1","1989 Pro Set Base Autographs Rainbow Silver","8"],[12,"PA-TB1","1989 Pro Set Base Autographs Wave Blue","30"],[12,"PA-TB1","1989 Pro Set Base Autographs Wave Ebony","10"],[12,"PA-TB1","1989 Pro Set Base Autographs Wave Gold","4"],[12,"PA-TB1","1989 Pro Set Base Autographs Wave Green","7"],[12,"PA-TB1","1989 Pro Set Base Autographs Wave Ivory","3"],[12,"PA-TB1","1989 Pro Set Base Autographs Wave Pink","15"],[12,"PA-TB1","1989 Pro Set Base Autographs Wave Platinum","1"],[12,"PA-TB1","1989 Pro Set Base Autographs Wave Purple","20"],[12,"PA-TB1","1989 Pro Set Base Autographs Wave Red",""],[12,"PA-TB1","1989 Pro Set Base Autographs Wave Red White Blue","4"],[12,"PA-TB1","1989 Pro Set Base Autographs Wave Silver","6"],[13,"BMA-TB","Chrome Prospect Autographs Mojo Black Refractors","1"],[13,"BMA-TB","Chrome Prospect Autographs Mojo Blue Refractors","150"],[13,"BMA-TB","Chrome Prospect Autographs Mojo Green Refractors","99"],[13,"BMA-TB","Chrome Prospect Autographs Mojo Orange Refractors","25"],[13,"BMA-TB","Chrome Prospect Autographs Mojo Refractors",""],[14,"BI-21","Bowman Invicta",""],[14,"BI-21","Bowman Invicta",""],[14,"BI-21","Bowman Invicta Atomic Refractor","150"],[14,"BI-21","Bowman Invicta Gold Refractor","50"],[14,"BI-21","Bowman Invicta Orange Refractor","25"],[14,"BI-21","Bowman Invicta Red Refractor","5"],[14,"BI-21","Bowman Invicta SuperFractor","1"],[15,"PA-TBK","Prospect Autographs","248"],[15,"PA-TBK","Prospect Autographs Blue Foil","99"],[15,"PA-TBK","Prospect Autographs Fuchsia Foil","75"],[15,"PA-TBK","Prospect Autographs Gold Foil","50"],[15,"PA-TBK","Prospect Autographs Gold Pattern Foil","50"],[15,"PA-TBK","Prospect Autographs Inception FoilFractor","1"],[15,"PA-TBK","Prospect Autographs Orange Foil","25"],[15,"PA-TBK","Prospect Autographs Red Foil","5"],[16,"TOP-71","Top Prospects",""],[16,"TOP-71","Top Prospects Aqua Ice Foilboard","250"],[16,"TOP-71","Top Prospects Blue","150"],[16,"TOP-71","Top Prospects Emerald Ice Foilboard","299"],[16,"TOP-71","Top Prospects Foilfractor","1"],[16,"TOP-71","Top Prospects Gold","50"],[16,"TOP-71","Top Prospects Green","99"],[16,"TOP-71","Top Prospects Green Icy Foil","99"],[16,"TOP-71","Top Prospects Ice Foilboard",""],[16,"TOP-71","Top Prospects Orange","25"],[16,"TOP-71","Top Prospects Pink","199"],[16,"TOP-71","Top Prospects Platinum Bar","75"],[16,"TOP-71","Top Prospects Red","10"],[16,"TOP-71","Top Prospects Red Platinum Bar","5"],[17,"PA-TB","Prospect Autographs",""],[17,"PA-TB","Prospect Autographs",""],[17,"PA-TB","Prospect Autographs Black Atomic Refractor","10"],[17,"PA-TB","Prospect Autographs Blue Refractor","25"],[17,"PA-TB","Prospect Autographs Gold Refractor","50"],[17,"PA-TB","Prospect Autographs Orange Refractor","75"],[17,"PA-TB","Prospect Autographs Red Refractor","5"],[17,"PA-TB","Prospect Autographs Refractor","150"],[17,"PA-TB","Prospect Autographs Rose Gold Refractor","15"],[17,"PA-TB","Prospect Autographs Speckle Refractor","99"],[17,"PA-TB","Prospect Autographs SuperFractor","1"],[17,"PA-TB","Prospect Autographs Wave Refractor","125"],[18,"04","Base",""],[19,"AU-TB","Autographs",""],[19,"AU-TB","Autographs Prizms Black Finite","1"],[19,"AU-TB","Autographs Prizms Gold","10"],[19,"AU-TB","Autographs Prizms Gold Vinyl","1"],[20,"136","Base",""],[20,"136","Black Border","50"],[20,"136","Blue Border","99"],[20,"136","Flip Stock","25"],[20,"136","Gold Border","18"],[20,"136","Green Border","75"],[20,"136","Red Border","1"],[21,"PD-180","Base",""],[21,"PD-180","Aqua","75"],[21,"PD-180","Autographs",""],[21,"PD-180","Autographs Black","1"],[21,"PD-180","Autographs Blue","150"],[21,"PD-180","Autographs Gold","50"],[21,"PD-180","Autographs Green","99"],[21,"PD-180","Autographs Orange","25"],[21,"PD-180","Autographs Red","10"],[21,"PD-180","Black","1"],[21,"PD-180","Blue","150"],[21,"PDC-180","Chrome",""],[21,"PDC-180","Chrome Aqua Refractor","75"],[21,"PDC-180","Chrome Gold Refractor","50"],[21,"PDC-180","Chrome Orange Lava Refractor","25"],[21,"PDC-180","Chrome Red Refractor","5"],[21,"PDC-180","Chrome Refractor","99"],[21,"PDC-180","Chrome SuperFractor","1"],[21,"PD-180","Fuchsia","199"],[21,"PD-180","Gold","50"],[21,"PD-180","Green","99"],[21,"PD-180","Orange","25"],[21,"PD-180","Red","10"],[22,"3","Base",""],[23,"NNO","Base",""],[23,"NNO","Black /15","15"],[23,"NNO","Gold /1","1"],[23,"NNO","Silver /5","5"],[24,"136","Base",""],[24,"136","America","50"],[24,"136","Artist Proof","10"],[24,"136","Career Stat Line","412"],[24,"136","Holo Blue",""],[24,"136","Holo Carolina Blue",""],[24,"136","Holo Gold","1"],[24,"136","Holo Orange",""],[24,"136","Holo Pink",""],[24,"136","Holo Purple",""],[24,"136","Holo Purple",""],[24,"136","Holo Red","2023"],[24,"136","Holo Red","2023"],[24,"136","Independence Day",""],[24,"136","Liberty",""],[24,"136","On Fire","75"],[24,"136","One Hundred","100"],[24,"136","Presidential Collection","46"],[24,"136","Press Proof","5"],[24,"136","Printing Plates Black","1"],[24,"136","Printing Plates Cyan","1"],[24,"136","Printing Plates Magenta","1"],[24,"136","Printing Plates Yellow","1"],[24,"136","Season Stat Line","13"],[24,"136","Voltage","25"],[24,"136","Yellow",""],[25,"T1-TB1","Top 100 Autographs Black Crystal","4"],[25,"T1-TB1","Top 100 Autographs Black Mojo","3"],[25,"T1-TB1","Top 100 Autographs Black Prismatic","6"],[25,"T1-TB1","Top 100 Autographs Black Pulsar","2"],[25,"T1-TB1","Top 100 Autographs Black Wave","6"],[25,"T1-TB1","Top 100 Autographs Blue Crystal","7"],[25,"T1-TB1","Top 100 Autographs Blue Mojo","6"],[25,"T1-TB1","Top 100 Autographs Blue Prismatic","9"],[25,"T1-TB1","Top 100 Autographs Blue Pulsar","5"],[25,"T1-TB1","Top 100 Autographs Blue Wave","8"],[25,"T1-TB1","Top 100 Autographs Earth Crystal","1"],[25,"T1-TB1","Top 100 Autographs Earth Mojo","1"],[25,"T1-TB1","Top 100 Autographs Earth Prismatic","1"],[25,"T1-TB1","Top 100 Autographs Earth Pulsar","1"],[25,"T1-TB1","Top 100 Autographs Earth Wave","1"],[25,"T1-TB1","Top 100 Autographs Fire Crystal","6"],[25,"T1-TB1","Top 100 Autographs Fire Mojo","3"],[25,"T1-TB1","Top 100 Autographs Fire Prismatic","10"],[25,"T1-TB1","Top 100 Autographs Fire Pulsar","1"],[25,"T1-TB1","Top 100 Autographs Fire Wave","8"],[25,"T1-TB1","Top 100 Autographs Galaxy Crystal","1"],[25,"T1-TB1","Top 100 Autographs Galaxy Mojo","1"],[25,"T1-TB1","Top 100 Autographs Galaxy Prismatic","1"],[25,"T1-TB1","Top 100 Autographs Galaxy Pulsar","1"],[25,"T1-TB1","Top 100 Autographs Galaxy Wave","1"],[25,"T1-TB1","Top 100 Autographs Gold Crystal","1"],[25,"T1-TB1","Top 100 Autographs Gold Mojo","1"],[25,"T1-TB1","Top 100 Autographs Gold Prismatic","1"],[25,"T1-TB1","Top 100 Autographs Gold Pulsar","1"],[25,"T1-TB1","Top 100 Autographs Gold Wave","1"],[25,"T1-TB1","Top 100 Autographs Green Crystal","3"],[25,"T1-TB1","Top 100 Autographs Green Mojo","2"],[25,"T1-TB1","Top 100 Autographs Green Prismatic","5"],[25,"T1-TB1","Top 100 Autographs Green Pulsar","1"],[25,"T1-TB1","Top 100 Autographs Green Wave","5"],[25,"T1-TB1","Top 100 Autographs Orange Crystal","2"],[25,"T1-TB1","Top 100 Autographs Orange Mojo","1"],[25,"T1-TB1","Top 100 Autographs Orange Prismatic","4"],[25,"T1-TB1","Top 100 Autographs Orange Pulsar","1"],[25,"T1-TB1","Top 100 Autographs Orange Wave","4"],[25,"T1-TB1","Top 100 Autographs Pink Crystal","5"],[25,"T1-TB1","Top 100 Autographs Pink Mojo","4"],[25,"T1-TB1","Top 100 Autographs Pink Prismatic","7"],[25,"T1-TB1","Top 100 Autographs Pink Pulsar","3"],[25,"T1-TB1","Top 100 Autographs Pink Wave","7"],[25,"T1-TB1","Top 100 Autographs Purple Crystal","6"],[25,"T1-TB1","Top 100 Autographs Purple Mojo","5"],[25,"T1-TB1","Top 100 Autographs Purple Prismatic","8"],[25,"T1-TB1","Top 100 Autographs Purple Pulsar","4"],[25,"T1-TB1","Top 100 Autographs Purple Wave","7"],[25,"T1-TB1","Top 100 Autographs Red Crystal","1"],[25,"T1-TB1","Top 100 Autographs Red Flood","1"],[25,"T1-TB1","Top 100 Autographs Red Mojo","1"],[25,"T1-TB1","Top 100 Autographs Red Prismatic","3"],[25,"T1-TB1","Top 100 Autographs Red Pulsar","1"],[25,"T1-TB1","Top 100 Autographs Red Wave","3"],[25,"T1-TB1","Top 100 Autographs Red/White/Blue Crystal","1"],[25,"T1-TB1","Top 100 Autographs Red/White/Blue Prismatic","1"],[25,"T1-TB1","Top 100 Autographs Red/White/Blue Wave","1"],[25,"T1-TB1","Top 100 Autographs Silver Crystal","8"],[25,"T1-TB1","Top 100 Autographs Silver Mojo","7"],[25,"T1-TB1","Top 100 Autographs Silver Prismatic","10"],[25,"T1-TB1","Top 100 Autographs Silver Pulsar","6"],[25,"T1-TB1","Top 100 Autographs Silver Wave","9"],[25,"T1-TB1","Top 100 Autographs Sky Crystal","1"],[25,"T1-TB1","Top 100 Autographs Sky Mojo","1"],[25,"T1-TB1","Top 100 Autographs Sky Prismatic","1"],[25,"T1-TB1","Top 100 Autographs Sky Pulsar","1"],[25,"T1-TB1","Top 100 Autographs Sky Wave","1"],[25,"T1-TB1","Top 100 Autographs Super Prismatic Gold","1"],[25,"T1-TB1","Top 100 Autographs Water Crystal","5"],[25,"T1-TB1","Top 100 Autographs Water Mojo","2"],[25,"T1-TB1","Top 100 Autographs Water Prismatic","8"],[25,"T1-TB1","Top 100 Autographs Water Pulsar","1"],[25,"T1-TB1","Top 100 Autographs Water Wave","6"],[26,"74","Revolution",""],[26,"74","Revolution Astro",""],[26,"74","Revolution Cosmic","99"],[26,"74","Revolution Cubic","25"],[26,"74","Revolution Fractal",""],[26,"74","Revolution Galactic",""],[26,"74","Revolution Groove",""],[26,"74","Revolution Impact",""],[26,"74","Revolution Lava","10"],[26,"74","Revolution Sunburst","50"],[27,"II-TBK","Impact Impressions Signatures",""],[27,"II-TBK","Impact Impressions Signatures Black","1"],[27,"II-TBK","Impact Impressions Signatures Gold","10"],[28,"SIG-TB","Signatures",""],[28,"SIG-TB","Signatures Black Finite Prizms","1"],[28,"SIG-TB","Signatures Black Gold Prizms","5"],[28,"SIG-TB","Signatures Black Gold Shimmer Prizms","2"],[28,"SIG-TB","Signatures Blue Shimmer Prizms","5"],[28,"SIG-TB","Signatures Gold Prizms","10"],[28,"SIG-TB","Signatures Gold Shimmer Prizms","10"],[28,"SIG-TB","Signatures Gold Vinyl Prizms","1"],[28,"SIG-TB","Signatures Green Ice Prizms",""],[28,"SIG-TB","Signatures Green Scope Prizms","75"],[28,"SIG-TB","Signatures Hyper Prizms",""],[28,"SIG-TB","Signatures Ice Prizms",""],[28,"SIG-TB","Signatures Orange Wave Prizms","50"],[28,"SIG-TB","Signatures Pink Ice Prizms",""],[28,"SIG-TB","Signatures Purple Prizms","99"],[28,"SIG-TB","Signatures Red Prizms",""],[28,"SIG-TB","Signatures Ruby Wave Prizms",""],[28,"SIG-TB","Signatures Silver Prizms",""],[28,"SIG-TB","Signatures White Sparkle Prizms","1"],[29,"BTP-35","Bowman Scouts' Top 100",""],[29,"BTP-35","Bowman Scouts' Top 100 Aqua Refractors","125"],[29,"BTP-35","Bowman Scouts' Top 100 Gold Refractors","50"],[29,"BTP-35","Bowman Scouts' Top 100 Green Refractors","99"],[29,"BTP-35","Bowman Scouts' Top 100 Mini-Diamond Refractors","150"],[29,"BTP-35","Bowman Scouts' Top 100 Orange Refractors","25"],[29,"BTP-35","Bowman Scouts' Top 100 Red Refractors","5"],[29,"BTP-35","Bowman Scouts' Top 100 SuperFractors","1"],[30,"63","Base",""],[30,"63","Aqua Raywave Refractors","199"],[30,"63","Blue Refractors","150"],[30,"63","Fuchsia Refractors","299"],[30,"63","Gold Refractors","50"],[30,"63","Green Refractors","99"],[30,"II-25","International Impact",""],[30,"II-25","International Impact Mini Diamond Refractors","150"],[30,"II-25","International Impact Orange Refractors","25"],[30,"II-25","International Impact SuperFractors","1"],[30,"63","Orange Refractors","25"],[30,"63","Pearl Refractors",""],[30,"63","Purple Mojo Refractors","250"],[30,"63","Red Refractors","5"],[30,"63","Refractors","499"],[30,"63","SuperFractors","1"],[30,"63","Wave Refractors","100"],[30,"63","Yellow Refractors","75"],[31,"63","Base",""],[31,"63","Black","10"],[31,"63","Gold","50"],[31,"63","Gold","50"],[31,"63","Orange","25"],[31,"63","Padparadscha","1"],[31,"63","Red","5"],[31,"63","Yellow","75"],[32,"39","Base",""],[32,"39","Aqua Lava Refractors","199"],[32,"39","Black Refractors","10"],[32,"39","Blue Refractors","150"],[32,"39","Blue X-Fractors","150"],[32,"39","Gold Lava Refractors","50"],[32,"39","Gold Refractors","50"],[32,"39","Green Mini-Diamond Refractors","99"],[32,"39","Green Refractors","99"],[32,"39","Mini-Diamond Refractors","299"],[32,"39","Orange Refractors","25"],[32,"39","Purple Mojo Refractors","250"],[32,"39","Purple Refractors","250"],[32,"39","Red Lava Refractors","5"],[32,"39","Red Refractors","5"],[32,"39","Refractors",""],[32,"39","SuperFractors","1"],[32,"TA-BMS","Triple Autographs","75"],[32,"TA-BMS","Triple Autographs Gold Refractors","50"],[32,"TA-BMS","Triple Autographs Orange Refractors","25"],[32,"TA-BMS","Triple Autographs Red Refractors","5"],[32,"TA-BMS","Triple Autographs SuperFractors","1"],[32,"39","Wave Refractors",""],[32,"39","Yellow Lazer Refractors","75"],[33,"1","Base",""],[34,"120","Base",""],[34,"120","Artist Proofs","25"],[34,"120","Artist Proofs Black","1"],[34,"120","Base Rated Prospects Optic Signatures",""],[34,"120","Base Rated Prospects Optic Signatures Black Finite Prizms","1"],[34,"120","Base Rated Prospects Optic Signatures Gold Prizms","10"],[34,"120","Base Rated Prospects Optic Signatures Gold Velocity Prizms","10"],[34,"120","Base Rated Prospects Optic Signatures Gold Vinyl Prizms","1"],[34,"120","Base Rated Prospects Optic Signatures Pandora Prizms","25"],[34,"120","Base Rated Prospects Optic Signatures Purple Prizms","49"],[34,"120","Black","1"],[34,"120","Blue","149"],[34,"120","Carolina Blue Laser","249"],[34,"120","Gold","10"],[34,"120","Green Laser",""],[34,"120","Holo",""],[34,"120","Laser",""],[34,"120","Liberty",""],[34,"120","On Fire","75"],[34,"120","Optic",""],[34,"120","Optic Black Finite Prizms","1"],[34,"120","Optic Black Pandora Prizms",""],[34,"120","Optic Black Velocity Prizms","39"],[34,"120","Optic Blue Velocity Prizms",""],[34,"120","Optic Cracked Ice Prizms","25"],[34,"120","Optic Gold Prizms","10"],[34,"120","Optic Gold Velocity Prizms","10"],[34,"120","Optic Gold Vinyl Prizms","1"],[34,"120","Optic Green Prizms","5"],[34,"120","Optic Green Velocity Prizms","149"],[34,"120","Optic Holo Prizms",""],[34,"120","Optic Lime Green Prizms","149"],[34,"120","Optic Lime Green Prizms","149"],[34,"120","Optic Orange Prizms","199"],[34,"120","Optic Orange Velocity Prizms",""],[34,"120","Optic Pink Velocity Prizms","79"],[34,"120","Optic Purple Prizms","49"],[34,"120","Optic Red Prizms","99"],[34,"120","Optic Red Prizms","99"],[34,"120","Orange Laser","299"],[34,"120","Pink Laser","50"],[34,"120","Presidential Collection","46"],[34,"120","Printing Plates Black","1"],[34,"120","Printing Plates Cyan","1"],[34,"120","Printing Plates Magenta","1"],[34,"120","Printing Plates Yellow","1"],[34,"120","Purple","99"],[34,"120","Purple Laser","49"],[34,"120","Red","275"],[34,"120","Red and Blue",""],[34,"120","Red and Green Laser",""],[34,"120","Teal","25"],[34,"120","Yellow Flood",""],[35,"187","Base","49"],[35,"187","Black","5"],[35,"187","Black Black","1"],[35,"187","Black Bronze","1"],[35,"187","Black Gold","1"],[35,"187","Black Green","1"],[35,"187","Black Platinum","1"],[35,"187","Black Purple","1"],[35,"187","Black Red","1"],[35,"187","Black Silver","1"],[35,"187","Gold","1"],[35,"187","Green","15"],[35,"187","Platinum","25"],[35,"187","Printing Plates Black","1"],[35,"187","Printing Plates Cyan","1"],[35,"187","Printing Plates Magenta","1"],[35,"187","Printing Plates Yellow","1"],[35,"187","Purple","7"],[35,"187","Red","10"],[35,"187","Silver","3"],[36,"96","Base",""],[36,"S-96","Steel Carbon Shimmer Foil Black","3"],[36,"S-96","Steel Carbon Shimmer Foil Blue","9"],[36,"S-96","Steel Carbon Shimmer Foil Gold","1"],[36,"S-96","Steel Carbon Shimmer Foil Green","5"],[36,"S-96","Steel Carbon Shimmer Foil Orange","6"],[36,"S-96","Steel Carbon Shimmer Foil Pink","7"],[36,"S-96","Steel Carbon Shimmer Foil Platinum","4"],[36,"S-96","Steel Carbon Shimmer Foil Purple","8"],[36,"S-96","Steel Carbon Shimmer Foil Red","2"],[36,"S-96","Steel Carbon Shimmer Foil Silver","10"],[36,"S-96","Steel Iron Donut Circles Foil Black","3"],[36,"S-96","Steel Iron Donut Circles Foil Blue","9"],[36,"S-96","Steel Iron Donut Circles Foil Gold","1"],[36,"S-96","Steel Iron Donut Circles Foil Green","5"],[36,"S-96","Steel Iron Donut Circles Foil Orange","6"],[36,"S-96","Steel Iron Donut Circles Foil Pink","7"],[36,"S-96","Steel Iron Donut Circles Foil Platinum","4"],[36,"S-96","Steel Iron Donut Circles Foil Purple","8"],[36,"S-96","Steel Iron Donut Circles Foil Red","2"],[36,"S-96","Steel Iron Donut Circles Foil Silver","10"],[36,"S-96","Steel Lava Foil Black","2"],[36,"S-96","Steel Lava Foil Blue","99"],[36,"S-96","Steel Lava Foil Gold","1"],[36,"S-96","Steel Lava Foil Green","5"],[36,"S-96","Steel Lava Foil Orange","15"],[36,"S-96","Steel Lava Foil Pink","25"],[36,"S-96","Steel Lava Foil Platinum","3"],[36,"S-96","Steel Lava Foil Purple","49"],[36,"S-96","Steel Lava Foil Red","1"],[36,"S-96","Steel Lava Foil SIlver","299"],[36,"S-96","Steel Lazer Foil Black","2"],[36,"S-96","Steel Lazer Foil Blue","99"],[36,"S-96","Steel Lazer Foil Gold","1"],[36,"S-96","Steel Lazer Foil Green","5"],[36,"S-96","Steel Lazer Foil Orange","15"],[36,"S-96","Steel Lazer Foil Pink","25"],[36,"S-96","Steel Lazer Foil Platinum","3"],[36,"S-96","Steel Lazer Foil Purple","49"],[36,"S-96","Steel Lazer Foil Red","1"],[36,"S-96","Steel Lazer Foil Silver","290"],[36,"S-96","Steel Stars and Dots Foil Black","2"],[36,"S-96","Steel Stars and Dots Foil Blue","99"],[36,"S-96","Steel Stars and Dots Foil Gold","1"],[36,"S-96","Steel Stars and Dots Foil Green","5"],[36,"S-96","Steel Stars and Dots Foil Orange","15"],[36,"S-96","Steel Stars and Dots Foil Pink","25"],[36,"S-96","Steel Stars and Dots Foil Platinum","3"],[36,"S-96","Steel Stars and Dots Foil Purple","49"],[36,"S-96","Steel Stars and Dots Foil Red","1"],[36,"S-96","Steel Stars and Dots Foil Silver","290"],[36,"S-96","Steel Vanadium Checkerboard Foil Black","3"],[36,"S-96","Steel Vanadium Checkerboard Foil Blue","9"],[36,"S-96","Steel Vanadium Checkerboard Foil Gold","1"],[36,"S-96","Steel Vanadium Checkerboard Foil Green","5"],[36,"S-96","Steel Vanadium Checkerboard Foil Orange","6"],[36,"S-96","Steel Vanadium Checkerboard Foil Pink","7"],[36,"S-96","Steel Vanadium Checkerboard Foil Platinum","4"],[36,"S-96","Steel Vanadium Checkerboard Foil Purple","8"],[36,"S-96","Steel Vanadium Checkerboard Foil Red","2"],[36,"S-96","Steel Vanadium Checkerboard Foil Silver","10"],[37,"AGS-TB","American Glory Signatures","149"],[37,"AGS-TB","American Glory Signatures Emerald","5"],[37,"AGS-TB","American Glory Signatures Holo Gold","10"],[37,"AGS-TB","American Glory Signatures Holo Silver","25"],[37,"AGS-TB","American Glory Signatures Platinum","1"],[37,"AGS-TB","American Glory Signatures Red","49"],[38,"123","Base",""],[38,"123","Blue","199"],[38,"123","Gold","10"],[38,"123","Green","5"],[38,"123","Platinum","1"],[38,"123","Purple","99"],[38,"123","Red","299"],[38,"123","Silver",""],[38,"123","Teal","49"],[39,"PPA-TB","Prospect Patch Autograph","25"],[39,"PPA-TB","Prospect Patch Autograph Amethyst FOTL","3"],[39,"PPA-TB","Prospect Patch Autograph Emerald","5"],[39,"PPA-TB","Prospect Patch Autograph Gold","10"],[39,"PPA-TB","Prospect Patch Autograph Platinum","1"],[39,"PPA-TB","Prospect Patch Autograph Ruby","20"],[39,"PPA-TB","Prospect Patch Autograph Sapphire","15"],[40,"EPJ-TB","Elegance Prospect Jersey Autographs","99"],[40,"EPJ-TB","Elegance Prospect Jersey Autographs Emerald FOTL","4"],[40,"EPJ-TB","Elegance Prospect Jersey Autographs Holo Gold","10"],[40,"EPJ-TB","Elegance Prospect Jersey Autographs Holo Silver","25"],[40,"EPJ-TB","Elegance Prospect Jersey Autographs Platinum","1"],[40,"JP-TB","Jumbo Patches Batting Gloves","5"],[40,"JP-TB","Jumbo Patches Fielding Gloves","6"],[40,"JP-TB","Jumbo Patches Hats","6"],[41,"86","Base","99"],[41,"86","Amethyst","3"],[41,"86","Emerald","8"],[41,"GSD-TB","Game Gear Swatches Dual","99"],[41,"GSD-TB","Game Gear Swatches Dual","99"],[41,"GSD-TB","Game Gear Swatches Dual Emerald","5"],[41,"GSD-TB","Game Gear Swatches Dual Holo Gold","10"],[41,"GSD-TB","Game Gear Swatches Dual Holo Gold","10"],[41,"GSD-TB","Game Gear Swatches Dual Holo Silver","25"],[41,"GSD-TB","Game Gear Swatches Dual Platinum","1"],[41,"23","Game Gear Swatches Trio","99"],[41,"23","Game Gear Swatches Trio Emerald","5"],[41,"23","Game Gear Swatches Trio Holo Gold","10"],[41,"23","Game Gear Swatches Trio Holo Silver","25"],[41,"23","Game Gear Swatches Trio Platinum","1"],[41,"86","Holo Gold","10"],[41,"86","Holo Silver","49"],[41,"JMS-TB","Jumbo Material Signature Booklet","35"],[41,"JMS-TB","Jumbo Material Signature Booklet Holo Gold","10"],[41,"JMS-TB","Jumbo Material Signature Booklet Platinum","1"],[41,"86","Platinum","1"],[41,"PMS-TB","Prospect Material Signatures Brand Logos","5"],[41,"PMS-TB","Prospect Material Signatures Gold","49"],[41,"PMS-TB","Prospect Material Signatures Holo Gold","10"],[41,"PMS-TB","Prospect Material Signatures Holo Silver","25"],[41,"PMS-TB","Prospect Material Signatures Platinum","1"],[41,"PMS-TB","Prospect Material Signatures Purple FOTL","5"],[41,"PMS-TB","Prospect Material Signatures Tags","5"],[41,"86","Red","75"],[41,"TT-TB","Treasured Threads","99"],[41,"TT-TB","Treasured Threads Emerald","5"],[41,"TT-TB","Treasured Threads Holo Gold","10"],[41,"TT-TB","Treasured Threads Holo Silver","25"],[41,"TT-TB","Treasured Threads Platinum","1"],[42,"111","Base",""],[42,"111","Black Finite Holo","1"],[42,"111","Black Finite Signatures Holo","1"],[42,"111","Black Velocity Holo","39"],[42,"111","Blue","199"],[42,"111","Blue Holo","149"],[42,"111","Blue Ice Holo","299"],[42,"111","Blue Signatures Holo","149"],[42,"111","Blue Wave Signatures Holo","75"],[42,"111","Bronze","199"],[42,"111","Gold","10"],[42,"111","Gold Holo","10"],[42,"111","Gold Ice","10"],[42,"111","Gold Pulsar Signatures Holo","10"],[42,"111","Gold Signatures Holo","10"],[42,"111","Gold Vinyl Holo","1"],[42,"111","Gold Vinyl Signatures Holo","1"],[42,"111","Green",""],[42,"111","Green Holo",""],[42,"111","Green Ice Holo","99"],[42,"111","Green Pulsar Signatures Holo","25"],[42,"111","Green Signatures Holo",""],[42,"111","Holo",""],[42,"111","Mojo Holo","25"],[42,"111","Mojo Signatures Holo","25"],[42,"111","Pandora Black FOTL Signatures Holo","1"],[42,"111","Pandora FOTL Signatures Holo","7"],[42,"111","Pandora Gold FOTL Signatures Holo","5"],[42,"111","Pink","49"],[42,"111","Pink Velocity Holo","79"],[42,"111","Platinum","1"],[42,"111","Purple","99"],[42,"111","Purple Holo","99"],[42,"111","Purple Scope Signatures Holo","49"],[42,"111","Purple Signatures Holo","125"],[42,"111","Red","299"],[42,"111","Red Holo","199"],[42,"111","Red Ice Holo",""],[42,"111","Red Power Signatures Holo","99"],[42,"111","Signatures Holo",""],[42,"111","Silver","25"],[42,"111","Silver Holo",""],[42,"111","Silver Signatures",""],[42,"111","Teal","49"],[42,"111","Ticket Stub","7"],[42,"111","Ticket Stub Holo","7"],[43,"81","Base",""],[43,"81","Black and Blue Prizms","49"],[43,"81","Black Finite Prizms","1"],[43,"81","Gold Flash Prizms","10"],[43,"81","Gold Prizms","10"],[43,"81","Gold Vinyl Prizms","1"],[43,"81","Green Flash Prizms",""],[43,"81","Green Prizms","5"],[43,"81","Mojo Prizms FOTL","3"],[43,"81","Orange Flash Prizms",""],[43,"81","Red and Blue Prizms",""],[43,"81","Silver Prizms",""],[43,"81","Silver Prizms Die Cuts",""],[43,"81","Tie-Dye Prizms","25"],[43,"81","Tiger Prizms",""],[43,"81","Zebra Prizms",""],[44,"FCS-TB","Full Count Swatches","32"],[44,"FCS-TB","Full Count Swatches Black","8"],[44,"FCS-TB","Full Count Swatches Blue","15"],[44,"FCS-TB","Full Count Swatches Emerald","5"],[44,"FCS-TB","Full Count Swatches Holo Gold","10"],[44,"FCS-TB","Full Count Swatches Holo Platinum Blue","1"],[44,"FCS-TB","Full Count Swatches Holo Silver","25"],[44,"FCS-TB","Full Count Swatches Red FOTL","6"],[44,"PJA-TB","Prospect Jerseys Autographs","99"],[44,"PJA-TB","Prospect Jerseys Autographs Bases Loaded","3"],[44,"PJA-TB","Prospect Jerseys Autographs Emerald","5"],[44,"PJA-TB","Prospect Jerseys Autographs Full Count","32"],[44,"PJA-TB","Prospect Jerseys Autographs Holo Gold","10"],[44,"PJA-TB","Prospect Jerseys Autographs Holo Silver","49"],[45,"16","Base",""],[45,"CO-11","A Class of Their Own",""],[45,"A-TBL","Autographs",""],[45,"A-TBL","Autographs Emerald","25"],[45,"A-TBL","Autographs Gold","10"],[45,"A-TBL","Autographs Platinum","1"],[45,"A-TBL","Autographs Purple","5"],[45,"A-TBL","Autographs Ruby","99"],[45,"A-TBL","Autographs Sapphire","60"],[45,"16","Emerald","25"],[45,"16","Gold","10"],[45,"16","Platinum","1"],[45,"A-TBL","Preview Edition Emerald","25"],[45,"A-TBL","Preview Edition Gold","10"],[45,"16","Purple","5"],[45,"16","Ruby","85"],[45,"16","Sapphire","50"],[45,"16","White","15"],[46,"177","Base",""],[46,"177","Black and White",""],[46,"177","Black Foil",""],[46,"177","Blue Foil","50"],[46,"177","Chrome",""],[46,"SCCA-BLA","Chrome Autographs",""],[46,"SCCA-BLA","Chrome Autographs Orange Refractors",""],[46,"SCCA-BLA","Chrome Autographs Red Refractors","50"],[46,"SCCA-BLA","Chrome Autographs SuperFractors","1"],[46,"177","Chrome Gold Minted Refractors",""],[46,"177","Chrome Green Refractors",""],[46,"177","Chrome Orange Refractors","99"],[46,"177","Chrome Pearl White Refractors","30"],[46,"177","Chrome Purple Refractors","75"],[46,"177","Chrome Refractors",""],[46,"177","Chrome SuperFractors","1"],[46,"177","First Day Issue",""],[46,"177","Gold Foil",""],[46,"177","Gold Rainbow Foil","1"],[46,"177","Green Foil","199"],[46,"177","Members Only",""],[46,"177","Photographer's Proof",""],[46,"177","Pink Foil",""],[46,"177","Purple Foil","75"],[46,"177","Rainbow Foilboard","25"],[46,"177","Red Foil",""],[46,"177","Sepia",""],[47,"290","Base",""],[47,"290","Aqua Sparkle Foilboard","75"],[47,"290","Archives Foilboard",""],[47,"290","Black Foilboard",""],[47,"290","Blue Foilboard","25"],[47,"290","FoilFractors","1"],[47,"290","Green Foilboard","99"],[47,"290","Orange Hot Foilboard","15"],[47,"290","Pink Foilboard",""],[47,"290","Printing Plates Black","1"],[47,"290","Printing Plates Cyan","1"],[47,"290","Printing Plates Magenta","1"],[47,"290","Printing Plates Yellow","1"],[47,"290","Purple Foilboard",""],[47,"290","Rainbow Foilboard","199"],[47,"290","Red Hot Foilboard","50"],[47,"290","Yellow Foilboard",""],[48,"157","Base",""],[48,"157","Aqua Equinox Refractors","199"],[48,"157","Black Eclipse Refractors","10"],[48,"157","Blue Moon Refractors","99"],[48,"157","Gold Interstellar Refractors","50"],[48,"157","Green Space Dust Refractors","75"],[48,"157","Nucleus Refractors",""],[48,"157","Orange Galactic Refractors","25"],[48,"157","Orange Lunar Refractors","10"],[48,"157","Purple Nebula Refractors","150"],[48,"157","Red Flare Refractors","5"],[48,"157","Refractors",""],[48,"SF-41","Starfractor",""],[48,"SF-41","Starfractor Black Eclipse Refractors","10"],[48,"SF-41","Starfractor Orange Galactic Refractors","25"],[48,"SF-41","Starfractor Red Flare Refractors","5"],[48,"SF-41","Starfractor SuperFractors","1"],[48,"157","SuperFractors","1"],[48,"157","White Hole Refractors",""],[48,"157","White Hole Refractors",""],[49,"USC124","Base",""],[49,"USC174","Base",""],[49,"USC174b","Base",""],[49,"USC124","Aqua / Blue Lava Lamp Refractors","175"],[49,"USC174","Aqua / Blue Lava Lamp Refractors","175"],[49,"USC124","Aqua RayWave Refractors","199"],[49,"USC174","Aqua RayWave Refractors","199"],[49,"USC124","Aqua Refractors","199"],[49,"USC174","Aqua Refractors","199"],[49,"RA-TB","Autographs",""],[49,"RA-TB","Autographs Aqua Wave Refractors","199"],[49,"RA-TB","Autographs Black & White Mini-Diamond Refractors",""],[49,"RA-TB","Autographs Black Refractors","10"],[49,"RA-TB","Autographs Blue RayWave Refractors","150"],[49,"RA-TB","Autographs Blue Refractors","150"],[49,"RA-TB","Autographs Gold Refractors","50"],[49,"RA-TB","Autographs Gold Wave Refractors","50"],[49,"RA-TB","Autographs Green Refractors","99"],[49,"RA-TB","Autographs Orange Refractors","25"],[49,"RA-TB","Autographs Orange Wave Refractors","25"],[49,"RA-TB","Autographs Printing Plates Black","1"],[49,"RA-TB","Autographs Printing Plates Cyan","1"],[49,"RA-TB","Autographs Printing Plates Magenta","1"],[49,"RA-TB","Autographs Printing Plates Yellow","1"],[49,"RA-TB","Autographs Purple Refractors","250"],[49,"RA-TB","Autographs Purple Speckle Refractors","299"],[49,"RA-TB","Autographs Red Refractors","5"],[49,"RA-TB","Autographs Red Wave Refractors","5"],[49,"RA-TB","Autographs Refractors","499"],[49,"RA-TB","Autographs Refractors","499"],[49,"RA-TB","Autographs SuperFractors","1"],[49,"USC124","Black RayWave Refractors","10"],[49,"USC174","Black RayWave Refractors","10"],[49,"USC124","Black Refractors","10"],[49,"USC174","Black Refractors","10"],[49,"USC124","Blue / Green Lava Lamp Refractors","125"],[49,"USC174","Blue / Green Lava Lamp Refractors","125"],[49,"USC124","Blue RayWave Refractors","150"],[49,"USC174","Blue RayWave Refractors","150"],[49,"CAERU-9","Chrome All-Etch Rookie Rush",""],[49,"CAERU-9","Chrome All-Etch Rookie Rush",""],[49,"CAERU-9","Chrome All-Etch Rookie Rush Black Refractors","10"],[49,"CAERU-9","Chrome All-Etch Rookie Rush Gold Refractors","50"],[49,"CAERU-9","Chrome All-Etch Rookie Rush Green Refractors","99"],[49,"CAERU-9","Chrome All-Etch Rookie Rush Orange Refractors","25"],[49,"CAERU-9","Chrome All-Etch Rookie Rush Red Refractors","5"],[49,"CAERU-9","Chrome All-Etch Rookie Rush SuperFractors","1"],[49,"TCE-48","Expos\u00e9","10"],[49,"TCE-48","Expos\u00e9 Red Refractor","5"],[49,"TCE-48","Expos\u00e9 SuperFractor","1"],[49,"USC124","FrozenFractors","5"],[49,"USC174","FrozenFractors","5"],[49,"USC124","Gold Mini-Diamond Refractors","50"],[49,"USC174","Gold Mini-Diamond Refractors","50"],[49,"USC124","Gold RayWave Refractors","50"],[49,"USC174","Gold RayWave Refractors","50"],[49,"USC124","Gold Refractors","50"],[49,"USC174","Gold Refractors","50"],[49,"USC124","Green RayWave Refractors","99"],[49,"USC174","Green RayWave Refractors","99"],[49,"USC124","Green Refractors","99"],[49,"USC174","Green Refractors","99"],[49,"USC124","Green Wave Refractors","99"],[49,"USC174","Green Wave Refractors","99"],[49,"USC174","Image Variations Black Speckle Refractors","10"],[49,"USC174","Image Variations Gold Speckle Refractors","50"],[49,"USC174","Image Variations Green Speckle Refractors","99"],[49,"USC174","Image Variations Orange Speckle Refractors","25"],[49,"USC174","Image Variations Red Speckle Refractors","5"],[49,"LGC-57","Let's Go!",""],[49,"LGC-57","Let's Go! Red Refractors","5"],[49,"LGC-57","Let's Go! SuperFractors","1"],[49,"USC124","Magenta / Purple Lava Lamp Refractors","299"],[49,"USC124","Magenta / Purple Lava Lamp Refractors","299"],[49,"USC174","Magenta / Purple Lava Lamp Refractors","299"],[49,"USC124","Magenta Refractors","399"],[49,"USC174","Magenta Refractors","399"],[49,"RDPA-TB","MLB Rookie Debut Patches Autographs","1"],[49,"USC124","Negative Refractors",""],[49,"USC174","Negative Refractors",""],[49,"USC124","Orange / Black Lava Lamp Refractors","15"],[49,"USC174","Orange / Black Lava Lamp Refractors","15"],[49,"USC124","Orange RayWave Refractors","25"],[49,"USC174","Orange RayWave Refractors","25"],[49,"USC124","Orange Refractors","25"],[49,"USC174","Orange Refractors","25"],[49,"USC124","Printing Plates Black","1"],[49,"USC174","Printing Plates Black","1"],[49,"USC124","Printing Plates Cyan","1"],[49,"USC174","Printing Plates Cyan","1"],[49,"USC124","Printing Plates Magenta","1"],[49,"USC174","Printing Plates Magenta","1"],[49,"USC124","Printing Plates Yellow","1"],[49,"USC174","Printing Plates Yellow","1"],[49,"USC124","Prism Refractors",""],[49,"USC174","Prism Refractors",""],[49,"USC124","Purple Refractors","250"],[49,"USC174","Purple Refractors","250"],[49,"RR-23","Radiating Rookies Variations",""],[49,"RR-23","Radiating Rookies Variations SuperFractors","1"],[49,"USC124","RayWave Refractors",""],[49,"USC174","RayWave Refractors",""],[49,"USC124","Red RayWave Refractors","5"],[49,"USC174","Red RayWave Refractors","5"],[49,"USC124","Red Refractors","5"],[49,"USC174","Red Refractors","5"],[49,"USC124","Refractors",""],[49,"USC174","Refractors",""],[49,"SSC-19","Stratospheric Stars",""],[49,"SSC-19","Stratospheric Stars Black Refractors","10"],[49,"SSC-19","Stratospheric Stars Gold Refractors","50"],[49,"SSC-19","Stratospheric Stars Green Refractors","99"],[49,"SSC-19","Stratospheric Stars Orange Refractors","25"],[49,"SSC-19","Stratospheric Stars Red Refractors","5"],[49,"SSC-19","Stratospheric Stars SuperFractors","1"],[49,"USC124","SuperFractors","1"],[49,"USC174","SuperFractors","1"],[49,"USC174b","SuperFractors","1"],[49,"USC124","X-Fractors",""],[49,"USC174","X-Fractors",""],[49,"YQ-72","Youthquake",""],[49,"YQ-72","Youthquake Black Refractors","10"],[49,"YQ-72","Youthquake Gold Refractors","50"],[49,"YQ-72","Youthquake Gold Refractors","50"],[49,"YQ-72","Youthquake Green Refractors","99"],[49,"YQ-72","Youthquake Orange Refractors","25"],[49,"YQ-72","Youthquake Red Refractors","5"],[49,"YQ-72","Youthquake SuperFractors","1"],[50,"USCS144","Base",""],[50,"USCS150","Base",""],[50,"USCS144","Black Sapphire Refractor","10"],[50,"USCS150","Black Sapphire Refractor","10"],[50,"USCS144","Gold Sapphire Refractor","50"],[50,"USCS150","Gold Sapphire Refractor","50"],[50,"USCS144","Orange Sapphire Refractor","25"],[50,"USCS150","Orange Sapphire Refractor","25"],[50,"USCS144","Padparadscha Sapphire Refractor","1"],[50,"USCS150","Padparadscha Sapphire Refractor","1"],[50,"USCS144","Red Sapphire Refractor","5"],[50,"USCS150","Red Sapphire Refractor","5"],[50,"USCS144","SuperFractor","1"],[50,"USCS150","SuperFractor","1"],[51,"26","Base","99"],[51,"GOLD-TB","Chrome Cast in Gold Autographs","199"],[51,"GOLD-TB","Chrome Cast in Gold Autographs SuperFractor","1"],[51,"26","Gold Electroplate","5"],[51,"26","Gold Lava","10"],[51,"26","Gold Mini Diamond","50"],[51,"26","Gold Ray Wave","25"],[51,"26","Gold Wave","75"],[51,"26","SuperFractor","1"],[52,"578","Base",""],[52,"578","Color Swap Variations",""],[52,"578","Image Variations",""],[52,"578","Aqua Border",""],[52,"578","Black and White Image",""],[52,"578","Black Border",""],[52,"578","Chrome","699"],[52,"578","Chrome Black Refractor","75"],[52,"578","Chrome Gold Refractor","5"],[52,"578","Chrome Purple Refractor",""],[52,"578","Chrome Silver Refractor","225"],[52,"578","Chrome SuperFractor","1"],[52,"578","Dark Blue Border",""],[52,"578","Flip Stock",""],[52,"578","Green Border",""],[52,"578","Mini (High Numbers)",""],[52,"578","White Border",""],[53,"64","Base",""],[53,"AGSR-TB","Autographed Game Sock / Batting Glove Relic","25"],[53,"AGSR-TB","Autographed Game Sock / Batting Glove Relic Logo","1"],[53,"APC-TB","Autographed Patch","200"],[53,"APC-TB","Autographed Patch Aqua","50"],[53,"APC-TB","Autographed Patch Blue","6"],[53,"APC-TB","Autographed Patch Green","99"],[53,"APC-TB","Autographed Patch Inception","1"],[53,"APC-TB","Autographed Patch Magenta","75"],[53,"APC-TB","Autographed Patch MLB Logo","1"],[53,"APC-TB","Autographed Patch Orange","10"],[53,"APC-TB","Autographed Patch Red","25"],[53,"64","Blue","25"],[53,"GGAR-TB","Gameday Gear Autographs Relic Book","5"],[53,"GGAR-TB","Gameday Gear Autographs Relic Book Inception","1"],[53,"64","Gold Electricity","50"],[53,"64","Green",""],[53,"64","Inception","1"],[53,"64","Magenta","99"],[53,"64","Orange","10"],[53,"64","Printing Plates Black","1"],[53,"64","Printing Plates Cyan","1"],[53,"64","Printing Plates Magenta","1"],[53,"64","Printing Plates Yellow","1"],[53,"64","Purple","150"],[53,"64","Red","75"],[53,"64","Yellow","199"],[54,"62","Base",""],[54,"62","Blue","150"],[54,"62","Cherry Blossoms","99"],[54,"62","Gold","25"],[54,"62","Jade Green","75"],[54,"62","Platinum","1"],[54,"62","Purple","50"],[54,"62","Red","5"],[55,"138","Base",""],[55,"138","Blue","49"],[55,"138","Gold","1"],[55,"138","Orange","5"],[55,"138","Purple","25"],[55,"138","Red","10"],[56,"62","Base",""],[56,"62","Black Refractor","10"],[56,"62","Image Variation",""],[56,"62","Image Variation Black Refractor","10"],[56,"62","Image Variation Orange Refractor","25"],[56,"62","Image Variation Red Refractor","5"],[56,"62","Image Variation SuperFractor","1"],[56,"62","Orange Refractor","25"],[56,"62","Red Refractor","5"],[56,"62","SuperFractor","1"],[57,"99","Base",""],[57,"99","Amber","199"],[57,"99","Amber","199"],[57,"99","Aquamarine","149"],[57,"99","Citrine","75"],[57,"99","Gold","99"],[57,"99","Onyx","50"],[57,"99","Printing Plate Black","1"],[57,"99","Printing Plate Cyan","1"],[57,"99","Printing Plate Magenta","1"],[57,"99","Printing Plate Yellow","1"],[57,"99","Red, White, and Blue","10"],[57,"99","Ruby","1"],[57,"99","Sapphire","25"],[57,"99","Tourmaline","125"],[57,"99","Wood","1"],[58,"US144","Base",""],[58,"US150","Base",""],[58,"89US-11","1989 Topps Baseball 35th Anniversary",""],[58,"89US-11","1989 Topps Baseball 35th Anniversary Black","299"],[58,"89US-11","1989 Topps Baseball 35th Anniversary Blue",""],[58,"T89CU-91","1989 Topps Baseball 35th Anniversary Chrome",""],[58,"T89CU-91","1989 Topps Baseball 35th Anniversary Chrome Blue Refractors","150"],[58,"T89CU-91","1989 Topps Baseball 35th Anniversary Chrome Gold Refractors","50"],[58,"T89CU-91","1989 Topps Baseball 35th Anniversary Chrome Green Refractors","99"],[58,"T89CU-91","1989 Topps Baseball 35th Anniversary Chrome Orange Refractors","25"],[58,"T89CU-91","1989 Topps Baseball 35th Anniversary Chrome Purple Refractors","75"],[58,"T89CU-91","1989 Topps Baseball 35th Anniversary Chrome Red Refractors","5"],[58,"T89CU-91","1989 Topps Baseball 35th Anniversary Chrome SuperFractors","1"],[58,"89US-11","1989 Topps Baseball 35th Anniversary Gold","75"],[58,"89US-11","1989 Topps Baseball 35th Anniversary Platinum","1"],[58,"89US-11","1989 Topps Baseball 35th Anniversary Red","10"],[58,"US144","Aqua",""],[58,"US150","Aqua",""],[58,"US144","Black","74"],[58,"US150","Black","74"],[58,"US144","Blue Holofoil","999"],[58,"US150","Blue Holofoil","999"],[58,"US144","Clear","10"],[58,"US150","Clear","10"],[58,"US144","Father's Day Powder Blue","50"],[58,"US150","Father's Day Powder Blue","50"],[58,"US144","First Card","1"],[58,"US150","First Card","1"],[58,"US144","Gold","2024"],[58,"US144","Gold","2024"],[58,"US150","Gold","2024"],[58,"US150","Gold","2024"],[58,"US144","Gold Rainbow Foil",""],[58,"US150","Gold Rainbow Foil",""],[58,"US144","Golden Mirror SP",""],[58,"US150","Golden Mirror SP",""],[58,"US144","Green Crackle Foilboard","499"],[58,"US144","Green Crackle Foilboard","499"],[58,"US150","Green Crackle Foilboard","499"],[58,"US144","Holiday",""],[58,"US150","Holiday",""],[58,"US144","Holiday Bats","1"],[58,"US150","Holiday Bats","1"],[58,"US144","Holiday Black Cats","10"],[58,"US150","Holiday Black Cats","10"],[58,"US144","Holiday Ghosts",""],[58,"US150","Holiday Ghosts",""],[58,"US144","Holiday Jack O'Lanterns",""],[58,"US150","Holiday Jack O'Lanterns",""],[58,"US144","Holiday Mummies","50"],[58,"US150","Holiday Mummies","50"],[58,"US144","Holiday Witches Hats","5"],[58,"US150","Holiday Witches Hats","5"],[58,"US144","Independence Day","76"],[58,"US150","Independence Day","76"],[58,"US144","Memorial Day Camo","25"],[58,"US150","Memorial Day Camo","25"],[58,"US144","Mother's Day Hot Pink","50"],[58,"US150","Mother's Day Hot Pink","50"],[58,"US144","Orange Crackle Foilboard","299"],[58,"US150","Orange Crackle Foilboard","299"],[58,"US144","Platinum","1"],[58,"US150","Platinum","1"],[58,"US144","Printing Plates Black","1"],[58,"US150","Printing Plates Black","1"],[58,"US144","Printing Plates Cyan","1"],[58,"US150","Printing Plates Cyan","1"],[58,"US144","Printing Plates Magenta","1"],[58,"US150","Printing Plates Magenta","1"],[58,"US144","Printing Plates Yellow","1"],[58,"US150","Printing Plates Yellow","1"],[58,"US144","Purple",""],[58,"US150","Purple",""],[58,"US144","Purple Holofoil","799"],[58,"US150","Purple Holofoil","799"],[58,"US150","Purple Holofoil","799"],[58,"US144","Rainbow Foil",""],[58,"US150","Rainbow Foil",""],[58,"US144","Red Crackle Foilboard","199"],[58,"US150","Red Crackle Foilboard","199"],[58,"US144","Royal Blue",""],[58,"US150","Royal Blue",""],[58,"US144","Silver Crackle Foilboard",""],[58,"US150","Silver Crackle Foilboard",""],[58,"US150","Silver Crackle Foilboard",""],[58,"US144","Vintage Stock","99"],[58,"US150","Vintage Stock","99"],[58,"US144","Yellow",""],[58,"US150","Yellow",""],[58,"US150","Yellow",""],[58,"US144","Yellow Crackle Foilboard","50"],[58,"US150","Yellow Crackle Foilboard","50"],[58,"US144","Yellow Rainbow Foil",""],[58,"US150","Yellow Rainbow Foil",""],[59,"PRV-TB","Rookies and Veterans Autographs",""],[59,"PRV-TB","Rookies and Veterans Autographs Blue","150"],[59,"PRV-TB","Rookies and Veterans Autographs Gold","50"],[59,"PRV-TB","Rookies and Veterans Autographs Green","99"],[59,"PRV-TB","Rookies and Veterans Autographs Orange","25"],[59,"PRV-TB","Rookies and Veterans Autographs Platinum","1"],[59,"PRV-TB","Rookies and Veterans Autographs Purple","250"],[59,"PRV-TB","Rookies and Veterans Autographs Red","5"],[60,"SG-TBK","Signature Series",""],[60,"SG-TBK","Signature Series Black","1"],[60,"SG-TBK","Signature Series Blue","35"],[60,"SG-TBK","Signature Series Blue Laser","25"],[60,"SG-TBK","Signature Series Gold","10"],[60,"SG-TBK","Signature Series Gold Laser","10"],[60,"SG-TBK","Signature Series Green Laser",""],[60,"SG-TBK","Signature Series Laser",""],[60,"SG-TBK","Signature Series Orange Laser","25"],[60,"SG-TBK","Signature Series Purple","25"],[60,"SG-TBK","Signature Series Purple Laser","49"],[60,"SG-TBK","Signature Series Red","49"],[60,"SG-TBK","Signature Series Red and Green Laser","99"],[60,"SG-TBK","Signature Series Red Laser","30"],[60,"SG-TBK","Signature Series Teal","15"],[61,"17","Juggernauts",""],[61,"17","Juggernauts Black","1"],[61,"17","Juggernauts Blue","49"],[61,"17","Juggernauts Gold","10"],[61,"17","Juggernauts Green","5"],[61,"17","Juggernauts Red","99"],[62,"MIL-17","Base",""],[63,"PA-TB","Pristine Autographs",""],[63,"PA-TB","Pristine Autographs Black Pristine Refractor","1"],[63,"PA-TB","Pristine Autographs Blue Pristine Refractor","75"],[63,"PA-TB","Pristine Autographs Gold Pristine Refractor","50"],[63,"PA-TB","Pristine Autographs Green Pristine Refractor","150"],[63,"PA-TB","Pristine Autographs Orange Pristine Refractor","25"],[63,"PA-TB","Pristine Autographs Pink Pristine Refractor","15"],[63,"PA-TB","Pristine Autographs Pristine Primaries Refractor","10"],[63,"PA-TB","Pristine Autographs Purple Pristine Refractor","99"],[63,"PA-TB","Pristine Autographs Red Pristine Refractor","5"],[64,"BOA-TB","Break Out Autographs","199"],[64,"BOA-TB","Break Out Autographs Blue Foil","99"],[64,"BOA-TB","Break Out Autographs Green Foil","49"],[64,"BOA-TB","Break Out Autographs Holo Platinum Blue Foil","1"],[64,"BOA-TB","Break Out Autographs Holo Silver Foil","10"],[64,"BOA-TB","Break Out Autographs Red Foil",""],[64,"TSS-TB","Top Shelf Signatures",""],[64,"TSS-TB","Top Shelf Signatures Blue Foil",""],[64,"TSS-TB","Top Shelf Signatures Green Foil",""],[64,"TSS-TB","Top Shelf Signatures Holo Platinum Blue Foil","1"],[64,"TSS-TB","Top Shelf Signatures Holo Silver Foil",""],[64,"TSS-TB","Top Shelf Signatures Red Foil",""],[41,"GSD-TB","Game Gear Swatches Dual Holo Gold","10"],[41,"GSD-TB","Game Gear Swatches Dual","99"],[9,"33","Aspirations Gold Die Cut","24"],[0,"BDC-200","Chrome Gold Refractor","50"],[10,"C-TB","Crusade",""],[10,"PDP33","Hyper Green & Yellow Prizm",""],[10,"PDP33","Lime Green Prizm","75"],[14,"BI-21","Bowman Invicta",""],[17,"PA-TB","Prospect Autographs",""],[24,"136","Holo Purple",""],[24,"136","Holo Red","2023"],[31,"63","Gold","50"],[34,"120","Optic Lime Green Prizms","149"],[34,"120","Optic Red Prizms","99"],[48,"157","White Hole Refractors",""],[49,"RA-TB","Autographs Refractors","499"],[49,"CAERU-9","Chrome All-Etch Rookie Rush",""],[49,"USC124","Magenta / Purple Lava Lamp Refractors","299"],[49,"YQ-72","Youthquake Gold Refractors","50"],[56,"62","Image Variation Orange Refractor","25"],[57,"99","Amber","199"],[58,"US144","Gold","2024"],[58,"US150","Gold","2024"],[58,"US144","Green Crackle Foilboard","499"],[58,"US150","Purple Holofoil","799"],[58,"US150","Silver Crackle Foilboard",""],[58,"US150","Yellow",""],[65,"PP-1","Printing Plate Magenta 1/1","1"],[66,"USC124","Printing Plate Cyan 1/1","1"],[67,"PP-1","Printing Plate 1/1","1"],[68,"PS-TB1","Printing Plate 1/1 (PSA Slab)","1"],[69,"PP-1","Pre Production Proof 1/1","1"],[70,"PP-1","Unsigned Proof 1/1","1"],[71,"SP-TB1","State Pride Green Crystals Proof Auto 1/1","1"],[72,"BA-TB1","Magenta Printing Plate Auto 1/1","1"]],"owned":[1,2,6,9,11,16,30,33,37,45,46,60,67,68,77,81,93,94,103,110,128,136,248,249,250,264,266,269,270,272,284,285,286,294,299,302,311,321,333,337,350,431,434,437,464,481,484,489,498,500,516,649,657,658,659,660,664,667,671,674,675,677,683,687,689,692,694,695,698,700,707,727,739,742,759,842,855,856,875,878,882,912,916,929,946,957,982,1000,1002,1003,1004,1013,1019,1022,1024,1025,1026,1027,1029,1035,1040,1042,1043,1044,1047,1048,1049,1064,1065,1070,1071,1072,1073,1075,1088,1089,1101,1102,1119,1121,1138,1140,1158,1159,1162,1182,1183,1193,1216,1217,1242,1250,1267,1271,1273,1277,1299,1300,1301,1304,1306,1307,1314,1316,1320,1324,1332,1339,1345,1353,1355,1357,1371,1377,1387,1399,1472,1473,1474,1475,1476,1477,1478,1479],"intransit":[3,5,7,8,47,50,51,57,58,59,61,65,66,91,92,95,98,101,104,105,106,107,108,109,113,146,154,159,164,186,187,200,202,203,209,221,223,228,233,246,247,251,253,254,255,268,274,275,276,277,278,279,280,290,291,292,300,304,305,306,307,308,309,312,313,314,315,322,323,327,330,331,332,334,339,340,342,347,352,355,359,360,361,362,364,368,373,377,382,389,390,393,402,407,416,419,420,424,426,427,435,438,445,450,451,452,453,455,456,457,458,460,471,475,486,488,490,492,499,502,506,507,510,511,512,515,519,520,521,523,525,527,529,530,531,532,533,534,536,541,574,582,617,623,630,639,650,652,661,662,663,665,673,679,682,684,686,690,691,693,702,705,706,708,711,717,719,720,722,723,724,725,726,731,732,733,741,744,745,755,756,757,761,776,809,821,847,848,849,850,857,859,862,863,864,866,867,872,880,885,889,894,896,900,901,904,906,909,910,911,913,914,921,925,928,933,935,937,938,941,942,943,944,956,959,961,965,966,968,972,976,978,979,980,981,984,989,990,995,1005,1006,1010,1017,1028,1030,1033,1041,1045,1050,1053,1055,1056,1057,1062,1067,1068,1069,1080,1092,1100,1103,1105,1106,1107,1108,1110,1122,1129,1136,1139,1142,1143,1149,1152,1160,1161,1164,1165,1172,1174,1175,1184,1186,1188,1189,1192,1199,1206,1207,1210,1213,1215,1218,1219,1220,1221,1222,1224,1225,1227,1229,1230,1231,1232,1233,1248,1251,1254,1257,1258,1259,1260,1268,1274,1275,1280,1283,1284,1286,1287,1288,1289,1298,1302,1303,1305,1309,1312,1315,1317,1319,1323,1327,1329,1331,1334,1335,1337,1338,1344,1346,1358,1359,1370,1372,1373,1375,1376,1378,1379,1380,1381,1382,1384,1385,1386,1389,1391,1401,1418,1421,1445,1446,1447,1448],"not_synced":[],"dupes":[{"parent_id":878,"type":"intransit"},{"parent_id":875,"type":"intransit"},{"parent_id":294,"type":"intransit"},{"parent_id":33,"type":"intransit"},{"parent_id":342,"type":"forsale"},{"parent_id":352,"type":"forsale"},{"parent_id":355,"type":"forsale"},{"parent_id":435,"type":"forsale"},{"parent_id":464,"type":"forsale"},{"parent_id":525,"type":"forsale"},{"parent_id":527,"type":"forsale"},{"parent_id":677,"type":"forsale"},{"parent_id":739,"type":"forsale"},{"parent_id":745,"type":"forsale"},{"parent_id":1062,"type":"forsale"},{"parent_id":1092,"type":"forsale"},{"parent_id":1103,"type":"forsale"},{"parent_id":1136,"type":"forsale"},{"parent_id":1186,"type":"forsale"},{"parent_id":1277,"type":"forsale"},{"parent_id":1284,"type":"forsale"},{"parent_id":1327,"type":"forsale"},{"parent_id":1329,"type":"forsale"},{"parent_id":1335,"type":"forsale"},{"parent_id":1373,"type":"forsale"},{"parent_id":1382,"type":"forsale"},{"parent_id":1387,"type":"forsale"}]};
function expandData(raw) {
  return raw.c.map((c, i) => ({
    id: i + 1,
    product: raw.p[c[0]],
    cardNumber: c[1],
    cardSet: c[2],
    copies: c[3],
  }));
}
var TCDB_PLAYER = "https://www.tcdb.com/Person.cfm/pid/325590/Tyler-Black";
// SSP/SP tags for unnumbered variants that are short-printed
// SSP = Super Short Print, SP = Short Print
var SSP_TAGS = {
  "Golden Mirror SP": "SSP",
  "Let's Go!": "SSP",
  "Members Only": "SSP",
  "Starfractor": "SSP",
  "Image Variations": "SP",
  "Image Variation": "SP",
  "Color Swap Variations": "SP",
  "Black and White Image": "SP",
  "Radiating Rookies Variations": "SP",
  "Youthquake": "SP",
  "Stratospheric Stars": "SP",
  "Chrome All-Etch Rookie Rush": "SP",
  "Nucleus Refractors": "SP",
  "White Hole Refractors": "SP",
  "First Day Issue": "SP",
  "Photographer's Proof": "SP",
  "Black Foil": "SP",
  "Black and White": "SP",
  "Gold Foil": "SP",
  "Red Foil": "SP",
  "Pink Foil": "SP",
  "Sepia": "SP",
  "Negative Refractors": "SP",
  "X-Fractors": "SP",
  "Prism Refractors": "SP",
  "RayWave Refractors": "SP",
  "Independence Day": "SP",
  "Archives Foilboard": "SP",
  "Black Foilboard": "SP",
  "Pink Foilboard": "SP",
  "Purple Foilboard": "SP",
  "Yellow Foilboard": "SP",
  "Aqua Border": "SP",
  "Dark Blue Border": "SP",
  "Green Border": "SP",
  "White Border": "SP",
  "Chrome Purple Refractor": "SP",
  "Mini (High Numbers)": "SP",
};
function sspBadge(cardSet) {
  var tag = SSP_TAGS[cardSet];
  if (!tag) return null;
  if (tag === "SSP") return React.createElement("span", {className:"inline-block px-1 py-0 rounded text-[8px] font-black bg-red-900/80 text-red-300 border border-red-700 ml-1 flex-shrink-0", title:"Super Short Print - unnumbered rare variant"}, "SSP");
  return React.createElement("span", {className:"inline-block px-1 py-0 rounded text-[8px] font-black bg-amber-900/60 text-amber-300 border border-amber-700 ml-1 flex-shrink-0", title:"Short Print - unnumbered limited variant"}, "SP");
}
var TCDB_LINKS = {"2":"274208/17730188","3":"293505/17730709","4":"293511/17730911","5":"293506/17731113","6":"293516/17733578","7":"293523/17733782","8":"293518/17733984","9":"293519/17734186","10":"293524/17734623","11":"293481/17719613","12":"293485/17728245","13":"293483/17728331","14":"293489/17728417","15":"293497/17728503","16":"293486/17728589","17":"293487/17728675","18":"293491/17728761","19":"293492/17728847","20":"293488/17728933","21":"293493/17729019","22":"293499/17729105","23":"293500/17729191","24":"293501/17729277","25":"293502/17729363","26":"293484/17729449","27":"293495/17729535","28":"293494/17729621","29":"293496/17729707","30":"293482/17729793","31":"293490/17729879","32":"293498/17729965","33":"293528/17734421","34":"293528/17734421","35":"293525/17734825","36":"293526/17735027","37":"293529/17735229","38":"293533/17735431","39":"293534/17735633","40":"293535/17735835","41":"293536/17736037","42":"293521/17736239","43":"293531/17736441","44":"293530/17736643","45":"293517/17736845","46":"293520/17737047","47":"293522/17737249","48":"293532/17737451","49":"293527/17737653","50":"293508/17731315","51":"293507/17731517","52":"293509/17731719","53":"293512/17731921","54":"293513/17732123","55":"293514/17732325","56":"293515/17732527","57":"293504/17733359","58":"293510/17732797","59":"293503/17733157","60":"289979/17571726","61":"289981/17593586","62":"289983/17593788","63":"289984/17593990","64":"289986/17594192","65":"289985/17594394","66":"289980/17594596","67":"289982/17594798","68":"296514/17867722","69":"296524/17872684","70":"296525/17872886","71":"296522/17873088","72":"296523/17873290","73":"296528/17873492","74":"296526/17873694","75":"296527/17873896","76":"296521/17874098","77":"293596/17741079","78":"293602/17741166","79":"293598/17741253","80":"293600/17741340","81":"293601/17741427","82":"293599/17741514","83":"293606/17741601","84":"293607/17741688","85":"293608/17741775","86":"293609/17741862","87":"293604/17741949","88":"293603/17742036","89":"293597/17742277","90":"293605/17742190","91":"300931/18885893","92":"300932/18886036","93":"287619/17881769","94":"296918/17888451","95":"296915/17888725","96":"296920/17888485","97":"296919/17888519","98":"296917/17888553","99":"296916/17888587","100":"296921/17888657","101":"296914/17888381","102":"296922/17888691","103":"296838/17884200","104":"296835/17884416","105":"296840/17884895","106":"296839/17884788","107":"296837/17884681","108":"296836/17885002","109":"296841/17884523","110":"296842/17884309","111":"296842/17884309","112":"285113/17755777","113":"294503/17758172","114":"294512/17758317","115":"294482/17758462","116":"294493/17758607","117":"294500/17759196","118":"294509/17758761","119":"294479/17758906","120":"294490/17759051","121":"296371/17855235","122":"294817/17772817","123":"294827/17772865","124":"294796/17772913","125":"294807/17772961","126":"294814/17773009","127":"294824/17773057","128":"294793/17773105","129":"294793/17773105","130":"294804/17773153","131":"294802/17773203","132":"294822/17773251","133":"294832/17773299","134":"294801/17773347","135":"294812/17773395","136":"294818/17773443","137":"294828/17773491","138":"294797/17773539","139":"294808/17773587","140":"294820/17773635","141":"294830/17773683","142":"294799/17773731","143":"294810/17773779","144":"294816/17773827","145":"294826/17773875","146":"294795/17773923","147":"294806/17773971","148":"436172/25016997","149":"436173/25017045","150":"436174/25017093","151":"436175/25017141","152":"294815/17774019","153":"294825/17774067","154":"294794/17774115","155":"294805/17774163","156":"294821/17774405","157":"294831/17774213","158":"294800/17774261","159":"294811/17774309","160":"294819/17774357","161":"294829/17774453","162":"294798/17774501","163":"294809/17785576","164":"294813/17772719","165":"294823/17772671","166":"294803/17772587","167":"294488/17759343","168":"294508/17759488","169":"294517/17759633","170":"294487/17759778","171":"294498/17759923","172":"294504/17760068","173":"294513/17760492","174":"294483/17760347","175":"294494/17760637","176":"294506/17760782","177":"294515/17760927","178":"294485/17761072","179":"294496/17761217","180":"294502/17761362","181":"294511/17761507","182":"294481/17761652","183":"294492/17761954","184":"436147/25016059","185":"436148/25016204","186":"436149/25016349","187":"436150/25016494","188":"294501/17761809","189":"294510/17762099","190":"294480/17762244","191":"294491/17762534","192":"294507/17762969","193":"294516/17762824","194":"294486/17762679","195":"294497/17762389","196":"294505/17763488","197":"294514/17763633","198":"294484/17763198","199":"294495/17763343","200":"294499/17763780","201":"294478/17763925","202":"294489/17764070","203":"296373/17855305","204":"295086/17775892","205":"295096/17775937","206":"295065/17775982","207":"295076/17776027","208":"295083/17776221","209":"295093/17776086","210":"295062/17776131","211":"295073/17776176","212":"295071/17784034","213":"295091/17776266","214":"295101/17776311","215":"295070/17776356","216":"295081/17776401","217":"295087/17784079","218":"295097/17784124","219":"295066/17784169","220":"295077/17784214","221":"295089/17784259","222":"295099/17784304","223":"295068/17784349","224":"295079/17784394","225":"295085/17784439","226":"295095/17784484","227":"295064/17784529","228":"295075/17784574","229":"436180/25017280","230":"436181/25017325","231":"436182/25017370","232":"436183/25017415","233":"295084/17784619","234":"295094/17784664","235":"295063/17784709","236":"295074/17784754","237":"295090/17784799","238":"295100/17784844","239":"295069/17784889","240":"295080/17784934","241":"295088/17784979","242":"295098/17785024","243":"295067/17785069","244":"295078/17785114","245":"295082/17775802","246":"295092/17775847","247":"295072/17775708","248":"310353/19029374","249":"318911/19113551","250":"318920/19112247","251":"318921/19112030","252":"318922/19112315","253":"318923/19112383","254":"318924/19112451","255":"318925/19112519","256":"318926/19112587","257":"318927/19112655","258":"318912/19113635","259":"318913/19113719","260":"318928/19112763","261":"318929/19112140","262":"318930/19112879","263":"318931/19112995","264":"318932/19113111","265":"318933/19113227","266":"318934/19113343","267":"318935/19113459","268":"318914/19113803","269":"318915/19113887","270":"318916/19113971","271":"318917/19114327","272":"296657/20027172","273":"337689/20036744","274":"337697/20037508","275":"337698/20037577","276":"337699/20037554","277":"337700/20037531","278":"337701/20037600","279":"337702/20037623","280":"337703/20037655","281":"337704/20037678","282":"337705/20037701","283":"337690/20036846","284":"337691/20036957","285":"337692/20037059","286":"337693/20037173","287":"337694/20037275","288":"337695/20037377","289":"337696/20037479","290":"287811/17706086","291":"291610/17797838","292":"291624/17796005","293":"291625/17796224","294":"291626/17796421","295":"291626/17796421","296":"291614/17796591","297":"291615/17796761","298":"291612/17797668","299":"291734/17724140","300":"291736/17724299","301":"291737/17724353","302":"291735/17724235","303":"291634/17972634","304":"291609/17799234","305":"291616/17798575","306":"291619/17844940","307":"293351/17702359","308":"291620/17845142","309":"291618/17798233","310":"293352/17702539","311":"291623/17849390","312":"291617/17849653","313":"293353/17702719","314":"291621/17973997","315":"291622/17974197","316":"291639/17972861","317":"291640/17973038","318":"291641/17973215","319":"291642/17973392","320":"291613/17844304","321":"293331/17697963","322":"291643/17700722","323":"291644/17700926","324":"291637/17973611","325":"291638/17973790","326":"291635/17701432","327":"291636/17701610","328":"291645/17702001","329":"291646/17702180","330":"291629/17939208","331":"291627/17798061","332":"291628/17850762","333":"291611/17798403","334":"289998/18442396","335":"306704/18616698","336":"306697/18616920","337":"306679/18617144","338":"306678/18617366","339":"306680/18617588","340":"306699/18617810","341":"306681/18618032","342":"306763/18622550","343":"306763/18622550","344":"306766/18622567","345":"306765/18622584","346":"306767/18622601","347":"306764/18622618","348":"306702/18618254","349":"306705/18618570","350":"306682/18610822","351":"306683/18611044","352":"306684/18618792","353":"306684/18618792","354":"306685/18619014","355":"306693/18619236","356":"306693/18619236","357":"306700/18619458","358":"306703/18619680","359":"306694/18619902","360":"306686/18620124","361":"306696/18620346","362":"306691/18620568","363":"314809/18885576","364":"306687/18620790","365":"306701/18621012","366":"306688/18621234","367":"306689/18621456","368":"306690/18610600","369":"306698/18621678","370":"306692/18621900","371":"306695/18622122","372":"312471/18622344","373":"303001/18452766","374":"479614/27235326","375":"479615/27235472","376":"479616/27235618","377":"479617/27235764","378":"303002/18452914","379":"301690/18178556","380":"301693/18185340","381":"301698/18185488","382":"301694/18185610","383":"301699/18185758","384":"419727/24252628","385":"301696/18185880","386":"301692/18186002","387":"301700/18186124","388":"301691/18186246","389":"301689/18168893","390":"301697/18186368","391":"301695/18186580","392":"301713/18186884","393":"301702/18178434","394":"301705/18187066","395":"301710/18174944","396":"432582/24769845","397":"301706/18190814","398":"301711/18190949","399":"301708/18191071","400":"301704/18191193","401":"301712/18191315","402":"301703/18191437","403":"301701/18145019","404":"301709/18191559","405":"301707/18191681","406":"301666/18191803","407":"301669/18191925","408":"301674/18192047","409":"301670/18192169","410":"301675/18192291","411":"301672/18179160","412":"301668/18192413","413":"301676/18192535","414":"301667/18192657","415":"301665/18174552","416":"301673/18192779","417":"301673/18192779","418":"301671/18192901","419":"301678/18193023","420":"301681/18193145","421":"301686/18193267","422":"301682/18193389","423":"301687/18193511","424":"301680/18193633","425":"301688/18193755","426":"301679/18193877","427":"301677/18193999","428":"301685/18194121","429":"301683/18194243","430":"318607/18961290","431":"318604/18961327","432":"318605/18961364","433":"318606/18961401","434":"318603/18961222","435":"339294/20165208","436":"339294/20165208","437":"339295/20165235","438":"339296/20165262","439":"339297/20165289","440":"339298/20165316","441":"339299/20165343","442":"353400/20869495","443":"353402/20869609","444":"353403/20869723","445":"353404/20869837","446":"353405/21757774","447":"353408/20869951","448":"353406/20870108","449":"353407/22683108","450":"342181/20255606","451":"342183/20256267","452":"342185/20256395","453":"342182/20256523","454":"342193/20256162","455":"342189/20256699","456":"342186/20256803","457":"342187/20255961","458":"343295/20312194","459":"342190/20256907","460":"342184/20255860","461":"342188/20257011","462":"342191/20255755","463":"342192/20257115","464":"331965/19787394","465":"331965/19787394","466":"331973/19787460","467":"331971/19787526","468":"331970/19787592","469":"331969/19787658","470":"331974/19787724","471":"331966/19787790","472":"331972/19787856","473":"331968/19787922","474":"331975/19787988","475":"331967/19788054","476":"318677/18976101","477":"348182/21565309","478":"348183/21565391","479":"348184/21565473","480":"348185/21565555","481":"318890/20159902","482":"339099/20172333","483":"339097/20088031","484":"341444/20209954","485":"339100/20177651","486":"339098/20158030","487":"339101/20177855","488":"297860/19574374","489":"329413/19575019","490":"329584/19604627","491":"329590/19604742","492":"329585/19604857","493":"329587/19604972","494":"329586/19605097","495":"329588/19605212","496":"329589/19605327","497":"329384/19576444","498":"329415/19579998","499":"329450/19597584","500":"329452/19577446","501":"329453/19583211","502":"329454/19583415","503":"329455/19583619","504":"329451/19583823","505":"329456/19584027","506":"329416/19584231","507":"329412/19584435","508":"329414/19584639","509":"329411/19584843","510":"329410/19585047","511":"379616/22192057","512":"448505/25613058","513":"450779/25730175","514":"450777/25730161","515":"450778/25730168","516":"357079/21585128","517":"367832/21587355","518":"367835/21587657","519":"367828/21589469","520":"367814/21585432","521":"367815/21585744","522":"367837/21587959","523":"367816/21586062","524":"367822/21590677","525":"367823/21591283","526":"367823/21591283","527":"367827/21590375","528":"367827/21590375","529":"367824/21591585","530":"367825/21591887","531":"367831/21592189","532":"367830/21592491","533":"367833/21592793","534":"367836/21593137","535":"367838/21588261","536":"367840/21588563","537":"367841/21588865","538":"367839/21589167","539":"367829/21589771","540":"367834/21590073","541":"367826/21590981","542":"421302/24325106","543":"421303/24325137","544":"421304/24325388","545":"421305/24325475","546":"421306/24325506","547":"421349/24325546","548":"421350/24325580","549":"421351/24325614","550":"421352/24325648","551":"421353/24325737","552":"421355/24325839","553":"421357/24325870","554":"421358/24325901","555":"421359/24325932","556":"421360/24325987","557":"421364/24326074","558":"421366/24326198","559":"421367/24326229","560":"421369/24326331","561":"421370/24326362","562":"421380/24338682","563":"421381/24338713","564":"421382/24338744","565":"421383/24338775","566":"421385/24338806","567":"421989/24338857","568":"421990/24338888","569":"421991/24338919","570":"421992/24338950","571":"421993/24338981","572":"421994/24339012","573":"421995/24339043","574":"421996/24339074","575":"421997/24339105","576":"421998/24339136","577":"421999/24339167","578":"422000/24339198","579":"422001/24339229","580":"422003/24339260","581":"422005/24339291","582":"422012/24339346","583":"422013/24339480","584":"422014/24339511","585":"422015/24339542","586":"422016/24339573","587":"422019/24339902","588":"422022/24340147","589":"422025/24340178","590":"422026/24340216","591":"422029/24340296","592":"422032/24340455","593":"422043/24340486","594":"422034/24340524","595":"422036/24340560","596":"422039/24340596","597":"422042/24340627","598":"422044/24340753","599":"422045/24340846","600":"422046/24340877","601":"422047/24341416","602":"422048/24341447","603":"422049/24341478","604":"422050/24341509","605":"422051/24341540","606":"422104/24341571","607":"422105/24341602","608":"422106/24341633","609":"422107/24341664","610":"422108/24341695","611":"422109/24341726","612":"422110/24341757","613":"422111/24341788","614":"422112/24341819","615":"422113/24354170","616":"422114/24341850","617":"396355/23089044","618":"396358/23089146","619":"396360/23089248","620":"396361/23089350","621":"396362/23089452","622":"396363/23089554","623":"396364/23089656","624":"396365/23089758","625":"396366/23089860","626":"396367/23089962","627":"420399/24274200","628":"420401/24274260","629":"420400/24274230","630":"377474/22132312","631":"377490/22132391","632":"377487/22132482","633":"377489/22132581","634":"377488/22132681","635":"377485/22133394","636":"377486/22132781","637":"377491/22133487","638":"377475/22133895","639":"377483/22133579","640":"377476/22133663","641":"377477/22133215","642":"377484/22133303","643":"377478/22133823","644":"377482/22132959","645":"377479/22133044","646":"377480/22133130","647":"377481/22133745","648":"377492/22132870","649":"430911/24702629","650":"430913/24702731","651":"430915/24702833","652":"430914/24702935","653":"430912/24703037","654":"431154/24715966","655":"430916/24703139","656":"430917/24703241","657":"449989/25950429","658":"452478/25950540","659":"452479/25950642","660":"452477/25950744","661":"452483/25950846","662":"452481/25950948","663":"452519/25955281","664":"452520/25955308","665":"452521/25955342","666":"452522/25955369","667":"452484/25951050","668":"452476/25951154","669":"468427/26656234","670":"452485/25951256","671":"452475/25951358","672":"452486/25954584","673":"452480/25951460","674":"452482/25951562","675":"468527/26914752","676":"473882/26920407","677":"473880/26920509","678":"473880/26920509","679":"473881/26920677","680":"473884/26920779","681":"473883/26920881","682":"473879/26920983","683":"470843/27401178","684":"482041/27401766","685":"482050/27402060","686":"482042/27402132","687":"482043/27402204","688":"482047/27402276","689":"482048/27402348","690":"482045/27402420","691":"482044/27402492","692":"482038/27402564","693":"482049/27402636","694":"482040/27402708","695":"482039/27402780","696":"482052/27402852","697":"482051/27402924","698":"482036/27401400","699":"482053/27401546","700":"482093/27426144","701":"482094/27426156","702":"482095/27426168","703":"482096/27426180","704":"482097/27426348","705":"482037/27402996","706":"482046/27403068","707":"436069/25015077","708":"429079/25358177","709":"443338/25358661","710":"443341/25358865","711":"443365/25612823","712":"443370/26423263","713":"443368/26423361","714":"443369/26423456","715":"443371/26423552","716":"443367/26423646","717":"443366/25612922","718":"443342/25359067","719":"443332/25359269","720":"443331/25359471","721":"443340/25359673","722":"443322/25359875","723":"443323/25358457","724":"443324/25360079","725":"443325/25360281","726":"443334/25360483","727":"443347/25363517","728":"443364/25363719","729":"443348/25363921","730":"443358/25364125","731":"443349/25364327","732":"443359/25364529","733":"443360/25364731","734":"443361/25364933","735":"443362/25365135","736":"443363/25365337","737":"443353/25365539","738":"443350/25365743","739":"443354/25365945","740":"443354/25365945","741":"443352/25366147","742":"443351/25366349","743":"443356/25366551","744":"443357/25366753","745":"443355/25366955","746":"443355/25366955","747":"443329/25360685","748":"443335/25360887","749":"443337/25361089","750":"443343/25361291","751":"443344/25361493","752":"443345/25361697","753":"443346/25361899","754":"443333/25362101","755":"443336/25362303","756":"443330/25362505","757":"443326/25362707","758":"443327/25362911","759":"443339/25363113","760":"443328/25363315","761":"531851/31737335","762":"558246/31740694","763":"577977/32606358","764":"577972/32606163","765":"577979/32605946","766":"577974/32605751","767":"577973/32605543","768":"577976/32605348","769":"577975/32605153","770":"577978/32604958","771":"558248/31740889","772":"558243/31741084","773":"558242/31741279","774":"583612/32859500","775":"583613/32859695","776":"583614/32859890","777":"583615/32860085","778":"558245/31741492","779":"558244/31741711","780":"558247/31740499","781":"575354/32472930","782":"585767/32977412","783":"585761/32977513","784":"585769/32977614","785":"585765/32977715","786":"585764/32977816","787":"585763/32977917","788":"585766/32978018","789":"585762/32978119","790":"585768/32978220","791":"585760/32978321","792":"585757/32978422","793":"585751/32978523","794":"585759/32978624","795":"585755/32978725","796":"585754/32978826","797":"585753/32978927","798":"585756/32979028","799":"585752/32979129","800":"585758/32979230","801":"585750/32979331","802":"585717/32975289","803":"585711/32975390","804":"585719/32975491","805":"585715/32975592","806":"585714/32975693","807":"585713/32975794","808":"585716/32975895","809":"585712/32975996","810":"585718/32976097","811":"585710/32976198","812":"585727/32976299","813":"585721/32976400","814":"585729/32976501","815":"585725/32976602","816":"585724/32976703","817":"585723/32976804","818":"585726/32976905","819":"585722/32977006","820":"585728/32977107","821":"585720/32977208","822":"585737/32974380","823":"585731/32977311","824":"585739/32974481","825":"585735/32974582","826":"585734/32974683","827":"585733/32974784","828":"585736/32974885","829":"585732/32974986","830":"585738/32975087","831":"585730/32975188","832":"585747/32979432","833":"585741/32979533","834":"585749/32979634","835":"585745/32979735","836":"585744/32979836","837":"585743/32979937","838":"585746/32980038","839":"585742/32980139","840":"585748/32980240","841":"585740/32980341","842":"455529/26063499","843":"455530/26063531","844":"455531/26063563","845":"455532/26063595","846":"455533/26063627","847":"455534/26063465","848":"455672/25986668","849":"455675/25987074","850":"455678/25987276","851":"455679/25987478","852":"455680/25987680","853":"455676/25987882","854":"455674/25988084","855":"455673/25986872","856":"455677/25988286","857":"519398/29296471","858":"519402/29296570","859":"519401/29296669","860":"537070/30336784","861":"519403/29296768","862":"519399/29296867","863":"519400/29296966","864":"492711/27938699","865":"492712/27938797","866":"492713/27938895","867":"492714/27938993","868":"492715/27939091","869":"468667/27801354","870":"468665/27801478","871":"468666/27801580","872":"491742/29678235","873":"526739/29843123","874":"526740/29843021","875":"526904/30041570","876":"526904/30041570","877":"526905/30041624","878":"526906/30041678","879":"526906/30041678","880":"526907/30041786","881":"526908/30041732","882":"526918/30041818","883":"526919/30041873","884":"526920/30041928","885":"526921/30041983","886":"526922/30042038","887":"526741/29842919","888":"526742/29842817","889":"526923/30229661","890":"526924/30229680","891":"526925/30229699","892":"526743/29842715","893":"526992/30001113","894":"526993/30001804","895":"526994/30001609","896":"526995/30001707","897":"526996/30001510","898":"526997/30001212","899":"526998/30001311","900":"526744/29842613","901":"527012/29777078","902":"527013/29777130","903":"527014/29777182","904":"527015/29777234","905":"527016/29777286","906":"489773/28403570","907":"503168/28472762","908":"503171/28473503","909":"503140/28471020","910":"503053/28463557","911":"503114/28467480","912":"503052/28462178","913":"503115/28467648","914":"503131/28468925","915":"503054/28462380","916":"503155/28472073","917":"503156/28471871","918":"503157/28471669","919":"503159/28472275","920":"503259/28480299","921":"503170/28473220","922":"503173/28473907","923":"503036/28461137","924":"503037/28463315","925":"503128/28468526","926":"503142/28471222","927":"503038/28460929","928":"503033/28461355","929":"503141/28470761","930":"503132/28469327","931":"503172/28473705","932":"503139/28470453","933":"503160/28472506","934":"503136/28470049","935":"503130/28469125","936":"503166/28472991","937":"503126/28468122","938":"503127/28468324","939":"503138/28470251","940":"503116/28467254","941":"503051/28463113","942":"503055/28462582","943":"503039/28461557","944":"503129/28468728","945":"503035/28461774","946":"503133/28469529","947":"574704/32441955","948":"503040/28461976","949":"503137/28469847","950":"503153/28478723","951":"503154/28480090","952":"489774/28664417","953":"506337/28665023","954":"506344/28665325","955":"506341/28665627","956":"506340/28665929","957":"506345/28666231","958":"506327/28664721","959":"506343/28666535","960":"506342/28667975","961":"506328/28668406","962":"506329/28668708","963":"506330/28669141","964":"506719/28670468","965":"506339/28669452","966":"506331/28669754","967":"506333/28670160","968":"494416/28475773","969":"494420/28475819","970":"494418/28475865","971":"494422/28475911","972":"494419/28475957","973":"494423/28476003","974":"494417/28476049","975":"494421/28476095","976":"494390/28246629","977":"494391/28246727","978":"552037/31384520","979":"510518/28847423","980":"552034/31384378","981":"494392/31384280","982":"452819/25821308","983":"452843/25822509","984":"452835/25822104","985":"452839/25822290","986":"452840/25822352","987":"452842/25822487","988":"452841/25822414","989":"452837/25822166","990":"452838/25822228","991":"452829/25821588","992":"452831/25821650","993":"452833/25821712","994":"474035/26933907","995":"474036/26933969","996":"452832/25821774","997":"452827/25821836","998":"452828/25821898","999":"452830/25821960","1000":"460730/26541303","1001":"464209/26534492","1002":"464208/26534837","1003":"464214/26534190","1004":"464220/26536482","1005":"464261/26540918","1006":"464287/26550524","1007":"464286/26550619","1008":"464262/26551502","1009":"464226/26538404","1010":"464222/26537086","1011":"464223/26536784","1012":"464225/26538706","1013":"464224/26537388","1014":"464221/26537690","1015":"464227/26537992","1016":"464216/26539063","1017":"464210/26552772","1018":"464219/26539365","1019":"464212/26535139","1020":"464217/26536125","1021":"464218/26539667","1022":"464288/26539969","1023":"464213/26535441","1024":"464215/26540271","1025":"464207/26533875","1026":"464211/26535743","1027":"473908/27342858","1028":"481202/27326711","1029":"489084/27855252","1030":"481198/27327013","1031":"481204/27327315","1032":"481206/27327617","1033":"481201/27327919","1034":"481205/27328264","1035":"481196/27326407","1036":"481964/27358858","1037":"481966/27359160","1038":"481967/27359462","1039":"481969/27358556","1040":"481197/27328566","1041":"481200/27328868","1042":"481203/27329170","1043":"481199/27329472","1044":"458924/26289494","1045":"461294/26289900","1046":"461300/26290102","1047":"461296/26290304","1048":"461298/26290506","1049":"461297/26290708","1050":"461292/26289698","1051":"461299/26290910","1052":"502970/28457445","1053":"461295/26291112","1054":"461301/26291314","1055":"461291/26291516","1056":"461395/26294204","1057":"461397/26294306","1058":"461396/26294408","1059":"461398/26294510","1060":"461399/26294612","1061":"461302/26291718","1062":"461293/26291920","1063":"461293/26291920","1064":"464301/26610875","1065":"464301/26610932","1066":"464301/26610933","1067":"466932/26618291","1068":"466932/26618341","1069":"466921/26611530","1070":"466921/26611580","1071":"466931/26611732","1072":"466931/26611782","1073":"467026/26623532","1074":"467030/26623681","1075":"467039/26623832","1076":"467038/26623981","1077":"467032/26624130","1078":"467031/26624279","1079":"467034/26624428","1080":"467035/26624577","1081":"467033/26624726","1082":"467036/26624875","1083":"467037/26625024","1084":"467043/26625173","1085":"467044/26625322","1086":"467045/26625471","1087":"467046/26625620","1088":"467029/26625769","1089":"467028/26625918","1090":"467040/26626067","1091":"467041/26626216","1092":"467027/26626365","1093":"467027/26626365","1094":"467042/26626514","1095":"466943/26611934","1096":"466943/26611984","1097":"466944/26612136","1098":"466944/26612186","1099":"466934/26612540","1100":"466934/26612590","1101":"466933/26612338","1102":"466933/26612388","1103":"466991/26618632","1104":"466991/26618632","1105":"466995/26618654","1106":"466993/26618671","1107":"466992/26618688","1108":"466994/26618705","1109":"466996/26618722","1110":"466997/26618739","1111":"467011/26627185","1112":"467012/26627207","1113":"467013/26627229","1114":"466947/26612742","1115":"466947/26612792","1116":"466940/26612944","1117":"466940/26612994","1118":"466936/26613146","1119":"466936/26613196","1120":"466939/26613348","1121":"466939/26613398","1122":"466922/26613550","1123":"466922/26613600","1124":"466935/26613752","1125":"466935/26613802","1126":"466938/26613954","1127":"466938/26614004","1128":"467149/26646454","1129":"467147/26646481","1130":"467146/26646535","1131":"467148/26646508","1132":"467150/26646562","1133":"467008/26627363","1134":"467009/26627380","1135":"467010/26627397","1136":"466929/26614358","1137":"466929/26614358","1138":"466929/26614408","1139":"466928/26614156","1140":"466928/26614206","1141":"467098/26646794","1142":"466927/26614560","1143":"466927/26614610","1144":"466942/26615166","1145":"466942/26615216","1146":"466937/26614762","1147":"466937/26614812","1148":"466941/26614964","1149":"466941/26615014","1150":"467152/26615368","1151":"467152/26615418","1152":"467153/26615570","1153":"467153/26615620","1154":"467154/26615772","1155":"467154/26615822","1156":"467155/26615974","1157":"467155/26616024","1158":"466924/26616176","1159":"466924/26616226","1160":"466930/26616378","1161":"466930/26616428","1162":"467014/26627407","1163":"467015/26627419","1164":"466925/26616580","1165":"466925/26616630","1166":"466945/26616782","1167":"466945/26616832","1168":"466946/26616984","1169":"466946/26617034","1170":"466923/26611320","1171":"466923/26611370","1172":"466956/26618924","1173":"466960/26618961","1174":"466958/26618998","1175":"466957/26619035","1176":"466959/26619072","1177":"466961/26619109","1178":"466962/26619146","1179":"466948/26611104","1180":"466948/26611161","1181":"466948/26611162","1182":"466926/26617186","1183":"466926/26617236","1184":"466963/26617437","1185":"466967/26617697","1186":"466965/26617489","1187":"466965/26617489","1188":"466964/26617541","1189":"466966/26617593","1190":"466968/26617645","1191":"466969/26617749","1192":"472653/27108089","1193":"472653/27108095","1194":"473560/27153694","1195":"473560/27153700","1196":"473558/27154046","1197":"473558/27154052","1198":"473559/27154398","1199":"473559/27154404","1200":"473562/27154750","1201":"473562/27154756","1202":"473561/27153332","1203":"473561/27153338","1204":"473563/27155102","1205":"473563/27155108","1206":"465400/26748814","1207":"469260/26749928","1208":"469261/26749940","1209":"469229/26749120","1210":"469228/26749272","1211":"469226/26749424","1212":"469227/26749576","1213":"469225/26748968","1214":"469230/26749728","1215":"413517/28484412","1216":"413517/28484413","1217":"413517/28484414","1218":"503613/28494446","1219":"422055/28491663","1220":"422054/28491948","1221":"422092/28524219","1222":"422096/28525134","1223":"422097/28525943","1224":"423342/28656102","1225":"422095/28527232","1226":"422098/28526572","1227":"503575/28492335","1228":"422056/28521304","1229":"503615/28495790","1230":"508037/28728913","1231":"422052/28491124","1232":"520140/30258445","1233":"537986/31383382","1234":"537987/31383420","1235":"537050/30335982","1236":"537053/30336028","1237":"537056/30336074","1238":"537051/30336120","1239":"537057/30336166","1240":"537052/30336212","1241":"537058/30336258","1242":"537055/30336304","1243":"537054/30336350","1244":"537947/30401828","1245":"537996/31383976","1246":"537997/31384011","1247":"537946/30401930","1248":"535419/30258580","1249":"537949/30403502","1250":"537944/30402159","1251":"537948/30402261","1252":"537960/30402930","1253":"537957/30403084","1254":"537958/30403186","1255":"537959/30403288","1256":"537943/30402363","1257":"537945/30402465","1258":"537942/30402567","1259":"508008/28784247","1260":"510122/28854446","1261":"510131/28876356","1262":"510134/28876558","1263":"510132/28830530","1264":"510136/28830737","1265":"510133/28876760","1266":"510135/28876962","1267":"404036/24568139","1268":"418246/24568319","1269":"418250/24568620","1270":"418249/24568524","1271":"418247/24568415","1272":"418248/24568428","1273":"476418/27610141","1274":"485819/27610347","1275":"485822/27885754","1276":"485824/31451675","1277":"485823/31451573","1278":"485825/31451777","1279":"485826/31451879","1280":"485818/27610245","1281":"485820/27610449","1282":"485821/27610551","1283":"469510/27195861","1284":"474404/27196081","1285":"474404/27196081","1286":"474405/27196285","1287":"474408/27196489","1288":"474407/27196693","1289":"474409/27196907","1290":"474414/27198529","1291":"474415/27198309","1292":"474416/27198105","1293":"474417/27197901","1294":"474411/27198755","1295":"474412/27197697","1296":"474410/27199163","1297":"474406/27198959","1298":"474413/27197493","1299":"456240/26349297","1300":"456240/26349303","1301":"457029/26331258","1302":"457031/26331362","1303":"457030/26331310","1304":"462203/26343537","1305":"462560/26367112","1306":"462563/26367451","1307":"462561/26367247","1308":"462564/26367564","1309":"462562/26367349","1310":"462565/26367677","1311":"462566/26367790","1312":"457032/26331973","1313":"457034/26332025","1314":"457033/26332077","1315":"456956/26349803","1316":"456956/26349809","1317":"456964/26350155","1318":"456964/26350161","1319":"456959/26350658","1320":"456959/26350664","1321":"456981/26361605","1322":"456981/26361611","1323":"456966/26351018","1324":"456966/26351024","1325":"456951/26361253","1326":"456951/26361259","1327":"456953/26351397","1328":"456953/26351397","1329":"456953/26351403","1330":"456953/26351403","1331":"456958/26351749","1332":"456958/26351755","1333":"456985/26362517","1334":"456985/26362523","1335":"456961/26352101","1336":"456961/26352101","1337":"456961/26352107","1338":"456974/26358789","1339":"456974/26358795","1340":"456980/26359141","1341":"456980/26359147","1342":"456978/26359493","1343":"456978/26359499","1344":"456976/26359845","1345":"456976/26359851","1346":"456975/26360197","1347":"456975/26360203","1348":"456977/26360549","1349":"456977/26360555","1350":"456979/26360901","1351":"456979/26360907","1352":"456982/26352453","1353":"456982/26352459","1354":"456983/26352805","1355":"456983/26352811","1356":"456965/26353157","1357":"456965/26353163","1358":"456962/26353509","1359":"456962/26353515","1360":"456968/26354213","1361":"456968/26354219","1362":"456970/26354565","1363":"456970/26354571","1364":"456971/26354917","1365":"456971/26354923","1366":"456972/26355269","1367":"456972/26355275","1368":"456973/26353861","1369":"456973/26353867","1370":"466055/26560547","1371":"466055/26560553","1372":"456960/26355621","1373":"456960/26355627","1374":"456960/26355627","1375":"456954/26355973","1376":"456954/26355979","1377":"456963/26356677","1378":"456963/26356683","1379":"456955/26356325","1380":"456955/26356331","1381":"456969/26357381","1382":"456969/26357387","1383":"456969/26357387","1384":"456984/26357029","1385":"456984/26357035","1386":"456952/26358085","1387":"456952/26358091","1388":"456952/26358091","1389":"456967/26358437","1390":"456967/26358443","1391":"456957/26357733","1392":"456957/26357739","1393":"507532/29074331","1394":"507534/29074444","1395":"507536/29074557","1396":"507535/29074632","1397":"507537/29074707","1398":"507539/29074744","1399":"507533/29074781","1400":"507538/29074818","1401":"535151/30399027","1402":"535655/31398829","1403":"535656/30969599","1404":"535240/31398356","1405":"535658/31398262","1406":"535241/31398168","1407":"535242/30640970","1408":"535239/31028133","1409":"535243/31006083","1410":"535657/31057398","1411":"535659/31398638","1412":"535660/31025487","1413":"535244/31398544","1414":"535245/31398450","1415":"535661/31009388","1416":"560889/31891465","1417":"560890/31891507","1418":"560893/31891544","1419":"560892/31891581","1420":"560894/31891618","1421":"560891/31891655","1422":"505187/28588562","1423":"590767/33279364","1424":"590775/33280246","1425":"590770/33280148","1426":"590771/33280050","1427":"590768/33279952","1428":"590772/33279854","1429":"590773/33279756","1430":"590776/33279658","1431":"590769/33279560","1432":"590774/33279462","1433":"558026/31728463","1434":"559156/31790345","1435":"563995/32052276","1436":"563997/32052501","1437":"563996/32052404","1438":"559518/31804231","1439":"558034/31728617","1440":"563514/32019483","1441":"564040/32054043","1442":"564043/32054247","1443":"564042/32054193","1444":"564041/32054097","1445":"526906/30041678","1446":"526904/30041570","1447":"291626/17796421","1448":"293528/17734421","1449":"306763/18622550","1450":"306684/18618792","1451":"306693/18619236","1452":"339294/20165208","1453":"331965/19787394","1454":"367823/21591283","1455":"367827/21590375","1456":"473880/26920509","1457":"443354/25365945","1458":"443355/25366955","1459":"461293/26291920","1460":"467027/26626365","1461":"466991/26618632","1462":"466929/26614358","1463":"466965/26617489","1464":"485823/31451573","1465":"474404/27196081","1466":"456953/26351397","1467":"456953/26351403","1468":"456961/26352101","1469":"456960/26355627","1470":"456969/26357387","1471":"456952/26358091"};
var PRESET_DETAILS = {"3":{"s":"109","p":"$2.8500","d":"11/11/2025","n":"COMC from murphyd71"},"4":{"p":"$8.2344"},"6":{"p":"$6.2500","d":"1/31/2025","n":"COMC from gelfgelfgelf"},"7":{"s":"51","p":"$12.2500","d":"11/11/2025","n":"COMC from spartan123"},"9":{"p":"$3.0003"},"13":{"p":"$11.9500"},"33":{"p":"$16.7400"},"47":{"p":"$5.2500","d":"2/1/2025 7","n":"COMC from jimmyg1506"},"50":{"s":"6","p":"$25.4800","d":"9/23/2025","n":"COMC from papercards"},"51":{"s":"7","p":"$24.1300","d":"1/31/2025","n":"COMC from 805Cards"},"57":{"s":"29","p":"$3.5000","d":"2/1/2025 7","n":"COMC from jseller6 (+1 more copies)"},"58":{"p":"$29.1800"},"59":{"s":"290","p":"$2.8500","d":"9/23/2025","n":"COMC from murphyd71 (+1 more copies)"},"60":{"p":"$1.1800","d":"1/31/2025","n":"COMC from Nismo"},"61":{"s":"8","p":"$6.5000","d":"8/22/2025","n":"COMC from sah0620"},"66":{"p":"$1.9500","d":"1/31/2025","n":"COMC from Buckatty"},"68":{"p":"$1.9500","d":"1/31/2025","n":"COMC from smackdeglass"},"92":{"p":"$6.7600"},"93":{"p":"$15.3200","d":"9/26/2025","n":"COMC from Byron2662"},"94":{"p":"$3.0100","d":"8/22/2025","n":"COMC from ols1978"},"95":{"s":"32","p":"$6.7500","d":"9/24/2025","n":"COMC from BeaverSportsCards"},"98":{"s":"37","p":"$6.0000","d":"5/31/2025","n":"COMC from Sportsworld1986"},"104":{"s":"60","p":"$3.7900","d":"1/31/2025","n":"COMC from LEFTSHARK22"},"107":{"p":"$4.2121"},"110":{"s":"1","p":"$24.9900","d":"11/11/2025","n":"COMC from GlutenFreeCards"},"113":{"p":"$4.2121"},"114":{"p":"$22.0095"},"122":{"p":"$10.6872"},"146":{"s":"2","p":"$4.9348","d":"8/22/2025","n":"COMC from tycamsports"},"154":{"s":"8","p":"$6.0000","d":"1/31/2025","n":"COMC from falizzadro"},"159":{"p":"$17.9361"},"164":{"p":"$3.2500","d":"2/1/2025 7","n":"COMC from rjyh2250"},"200":{"p":"$4.5100"},"202":{"p":"$5.4800","d":"9/23/2025","n":"COMC from greatcardz22"},"203":{"p":"$4.5800"},"205":{"p":"$8.5702"},"209":{"s":"1","p":"$9.7400","d":"11/11/2025","n":"COMC from greatcardz22"},"221":{"s":"1","p":"$5.6800","d":"8/22/2025","n":"COMC from sah0620"},"228":{"p":"$8.3877"},"233":{"p":"$10.0302"},"246":{"p":"$2.7500","d":"2/1/2025 1","n":"COMC from Guccirips"},"247":{"p":"$5.7800","d":"9/24/2025","n":"COMC from Ajax1723"},"248":{"p":"$2.4700","d":"1/31/2025","n":"COMC from HotCardCorner"},"249":{"s":"8","p":"$13.7600","d":"12/17/2025","n":"COMC from Bambam22"},"250":{"p":"$1.7000","d":"8/22/2025","n":"COMC from Dan_Z_cards"},"253":{"s":"26","p":"$5.7400","d":"2/1/2025 7","n":"COMC from LEFTSHARK22"},"254":{"s":"94","p":"$5.6500","d":"12/17/2025","n":"COMC from taydwyer8"},"255":{"s":"23","p":"$11.4500","d":"9/24/2025","n":"COMC from ryanbulk"},"256":{"p":"$4.7961"},"259":{"p":"$4.7700"},"268":{"s":"5","p":"$9.1314","d":"2/2/2025 8","n":"COMC from SportscardMachines"},"269":{"s":"24","p":"$8.2000","d":"9/25/2025","n":"COMC from Buckatty"},"270":{"s":"44","p":"$7.0700","d":"12/17/2025","n":"COMC from taydwyer8"},"272":{"p":"$2.2400","d":"8/22/2025","n":"COMC from pcbsportscards"},"273":{"p":"$6.6400"},"274":{"p":"$23.1200","d":"2/2/2025 8","n":"COMC from SportscardMachines (+1 more copies)"},"276":{"p":"$4.2500","d":"12/11/2024","n":"COMC from HomeTeamReno"},"277":{"p":"$6.1700"},"278":{"p":"$3.2400"},"279":{"p":"$7.0000","d":"9/23/2025","n":"COMC from greatcardz22"},"280":{"p":"$2.5000","d":"1/31/2025","n":"COMC from newjerseycollector"},"284":{"s":"80","p":"$6.2500","d":"9/25/2025","n":"COMC from FlipMyCards (+1 more copies)"},"285":{"p":"$11.7800","d":"2/1/2025 8","n":"COMC from greatcardz22"},"286":{"p":"$14.4500","d":"8/23/2025","n":"COMC from Buckatty"},"290":{"s":"474","p":"$0.9400","d":"1/31/2025","n":"COMC from Tiffers"},"292":{"s":"166","p":"$6.7750","d":"9/23/2025","n":"COMC from ep33185"},"294":{"s":"7","p":"$15.2600","d":"1/31/2025","n":"COMC from couponkid530"},"300":{"s":"8","p":"$12.2500","d":"1/31/2025","n":"COMC from Commonbreaks"},"302":{"p":"$1.1500","d":"2/1/2025 7","n":"COMC from ep33185"},"303":{"p":"$5.9787"},"304":{"p":"$1.4000","d":"8/22/2025","n":"COMC from tylercarringer"},"305":{"s":"76","p":"$4.2500","d":"9/23/2025","n":"COMC from missy41 (+2 more copies)"},"307":{"s":"3","p":"$5.7500","d":"8/22/2025","n":"COMC from flyercle"},"308":{"p":"$6.3400"},"309":{"p":"$5.4400"},"311":{"s":"164","p":"$5.2300","d":"1/11/2026","n":"COMC from greatcardz22"},"314":{"s":"20","p":"$10.2500","d":"1/31/2025","n":"COMC from charvatr0505"},"315":{"p":"$42.6977"},"320":{"p":"$42.6977"},"321":{"s":"9","p":"$4.6000","d":"1/11/2026","n":"COMC from robotmonkeycat (+1 more copies)"},"331":{"s":"95","p":"$0.7500","d":"1/31/2025","n":"COMC from RainbowCollector"},"332":{"p":"$11.9355"},"334":{"p":"$0.8500","d":"1/31/2025","n":"COMC from greaz253"},"335":{"p":"$1.6600"},"337":{"p":"$2.0000","d":"2/1/2025 4","n":"COMC from billoland"},"339":{"p":"$1.2500","d":"1/31/2025","n":"COMC from thebrain1"},"340":{"s":"13","p":"$10.7000","d":"9/23/2025","n":"COMC from cdebeni"},"342":{"p":"$0.6000","d":"1/31/2025","n":"COMC from Benscard (+1 more copies)"},"347":{"p":"$1.2500","d":"2/1/2025 9","n":"COMC from billoland"},"350":{"p":"$2.3600"},"352":{"p":"$1.3000","d":"8/22/2025","n":"COMC from jmiles17 (+1 more copies)"},"355":{"s":"4","p":"$4.2500","d":"11/11/2025","n":"COMC from greatcardz22 (+2 more copies)"},"359":{"s":"28","p":"$2.2500","d":"8/22/2025","n":"COMC from PhillyWhizKidz"},"360":{"p":"$1.2500","d":"1/31/2025","n":"COMC from miles25"},"361":{"s":"9","p":"$6.7500","d":"1/31/2025","n":"COMC from papercards"},"362":{"p":"$6.0663"},"364":{"p":"$1.3000","d":"9/23/2025","n":"COMC from jrod7290"},"368":{"p":"$1.3400","d":"1/31/2025","n":"COMC from PositiveKC"},"374":{"p":"$62.2800"},"389":{"p":"$4.2121","d":"9/24/2025","n":"COMC from 614SportsCards"},"407":{"s":"11","p":"$4.8500","d":"9/25/2025","n":"COMC from Buckatty"},"416":{"s":"1","p":"$10.9000","d":"12/23/2024","n":"COMC from wheelhousecards"},"420":{"s":"6","p":"$10.1500","d":"9/23/2025","n":"COMC from hundley"},"426":{"s":"2","p":"$8.0100","d":"1/31/2025","n":"COMC from CardboardAddict"},"427":{"p":"$3.4500","d":"12/17/2025","n":"COMC from jbhoog"},"435":{"p":"$2.7500","d":"8/19/2025","n":"COMC from w112mws (+1 more copies)"},"438":{"p":"$8.5191"},"450":{"p":"$0.8700","d":"1/31/2025","n":"COMC from Hitchcards"},"451":{"s":"213","p":"$2.8800","d":"1/31/2025","n":"COMC from nicethreadsandink (+1 more copies)"},"452":{"p":"$5.6502"},"455":{"p":"$8.2928"},"456":{"s":"26","p":"$2.2500","d":"5/31/2025","n":"COMC from Chezcards (+1 more copies)"},"457":{"s":"62","p":"$2.6400","d":"1/31/2025","n":"COMC from nicethreadsandink"},"458":{"p":"$1.2500","d":"1/31/2025","n":"COMC from crobarred"},"460":{"p":"$3.0514"},"464":{"p":"$4.8000","d":"5/26/2025","n":"COMC from gelfgelfgelf (+3 more copies)"},"471":{"s":"90","p":"$4.2500","d":"9/23/2025","n":"COMC from magyarzman"},"475":{"s":"24","p":"$5.6000","d":"9/25/2025","n":"COMC from Buckatty"},"484":{"p":"$4.5200"},"486":{"s":"35","p":"$1.0000","d":"9/24/2025","n":"COMC from dalangs"},"488":{"p":"$0.7000","d":"1/31/2025","n":"COMC from MaxSportsCards"},"490":{"s":"124","p":"$9.3500","d":"1/12/2026","n":"COMC from r0yalsfan (+1 more copies)"},"499":{"p":"$0.6300","d":"1/31/2025","n":"COMC from Anderson5054"},"501":{"p":"$6.7452"},"502":{"s":"5","p":"$9.2400","d":"8/22/2025","n":"COMC from ronnyberry"},"506":{"s":"94","p":"$6.7500","d":"2/1/2025 7","n":"COMC from sportscardetcpgh"},"510":{"s":"5","p":"$9.9900","d":"12/5/2025","n":"COMC from koko6727"},"513":{"p":"$2.2849"},"515":{"p":"$19.8779"},"519":{"s":"262","p":"$2.2500","d":"1/31/2025","n":"COMC from azpleasantville"},"520":{"p":"$1.2600","d":"1/31/2025","n":"COMC from micdm1971"},"521":{"p":"$2.2500","d":"1/31/2025","n":"COMC from thebrain1"},"523":{"p":"$2.9900","d":"1/31/2025","n":"COMC from bmcards_stl (+1 more copies)"},"525":{"p":"$0.8500","d":"1/31/2025","n":"COMC from tylercarringer"},"527":{"s":"1975","p":"$1.4500","d":"8/22/2025","n":"COMC from SportscardMachines (+1 more copies)"},"529":{"p":"$1.8400","d":"1/31/2025","n":"COMC from guch52"},"530":{"p":"$2.9900","d":"1/31/2025","n":"COMC from bmcards_stl"},"531":{"s":"46","p":"$3.7500","d":"1/31/2025","n":"COMC from Scruffmcgruff24"},"532":{"s":"86","p":"$6.5500","d":"3/26/2025","n":"COMC from slugger82685"},"533":{"s":"37","p":"$4.2500","d":"1/11/2026","n":"COMC from Mysox"},"534":{"s":"2","p":"$14.9900","d":"8/22/2025","n":"COMC from jpd347"},"535":{"p":"$38.1400"},"541":{"p":"$2.4500","d":"1/31/2025","n":"COMC from raelhe1980"},"550":{"p":"$5.6100"},"574":{"p":"$8.8700"},"617":{"p":"$1.9929","d":"6/15/2025","n":"COMC from Ayates99"},"627":{"p":"$3.0400"},"639":{"s":"33","p":"$6.1749","d":"2/2/2025 8","n":"COMC from SportscardMachines"},"644":{"p":"$4.9500"},"649":{"s":"49","p":"$7.1600","d":"1/31/2025","n":"COMC from laffertydaniel"},"651":{"p":"$18.9300"},"653":{"p":"$6.9400"},"654":{"p":"$32.1100"},"657":{"p":"$0.6900","d":"2/2/2025 1","n":"COMC from Mattclarkscoop"},"658":{"s":"10","p":"$2.7900","d":"1/31/2025","n":"COMC from finking"},"659":{"p":"$4.3300"},"661":{"p":"$6.6430"},"662":{"s":"87","p":"$5.9800","d":"1/5/2026 7","n":"COMC from Topaz"},"663":{"p":"$0.7300","d":"1/31/2025","n":"COMC from MKG954"},"665":{"p":"$10.1616"},"667":{"p":"$20.1407"},"674":{"s":"50","p":"$15.6600","d":"1/31/2025","n":"COMC from mmtime19"},"675":{"p":"$3.5500","d":"1/31/2025","n":"COMC from brig466"},"676":{"p":"$2.1200"},"682":{"p":"$11.3200","d":"1/31/2025","n":"COMC from goodpulls"},"684":{"p":"$5.4400"},"685":{"p":"$1.9500"},"686":{"p":"$6.2400"},"687":{"p":"$3.0000","d":"3/26/2025","n":"COMC from RonnieFrrrr"},"688":{"p":"$10.2500"},"690":{"s":"45","p":"$3.2500","d":"5/31/2025","n":"COMC from weeeshon (+1 more copies)"},"691":{"p":"$2.4900","d":"8/16/2025","n":"COMC from adamhobson"},"692":{"p":"$3.1700"},"693":{"s":"11","p":"$6.2500","d":"8/22/2025","n":"COMC from dirt1025"},"694":{"p":"$10.0000"},"700":{"p":"$44.3800"},"705":{"p":"$0.9900","d":"9/23/2025","n":"COMC from TLCWcards"},"708":{"p":"$0.7200","d":"1/31/2025","n":"COMC from SportCardShack"},"712":{"p":"$6.9400"},"719":{"s":"21","p":"$2.7500","d":"8/22/2025","n":"COMC from DallasCardboys (+2 more copies)"},"720":{"s":"104","p":"$2.7500","d":"5/26/2025","n":"COMC from egrove"},"722":{"p":"$1.9000","d":"5/31/2025","n":"COMC from Adamwilliams"},"723":{"p":"$1.4800","d":"1/31/2025","n":"COMC from DrewsCrew"},"724":{"p":"$0.7500","d":"1/20/2025","n":"COMC from Jdarrell13"},"725":{"p":"$1.2200","d":"1/31/2025","n":"COMC from peekenterprises"},"726":{"s":"67","p":"$4.2400","d":"3/26/2025","n":"COMC from newandoldcards"},"727":{"s":"90","p":"$6.2500","d":"9/24/2025","n":"COMC from ElectricCity21 (+6 more copies)"},"737":{"p":"$3.9201"},"755":{"s":"37","p":"$7.0800","d":"3/26/2025","n":"COMC from StickFigureTC"},"756":{"s":"262","p":"$1.4500","d":"2/2/2025 1","n":"COMC from HomeTeamReno (+1 more copies)"},"759":{"p":"$4.2000"},"761":{"p":"$4.2900"},"776":{"p":"$17.0900"},"781":{"p":"$2.4000"},"809":{"p":"$3.3215"},"842":{"p":"$11.1000"},"847":{"s":"15","p":"$5.0000","d":"1/21/2025","n":"COMC from jmon08"},"849":{"p":"$1.2400","d":"1/5/2026 7","n":"COMC from supersweetcards"},"850":{"p":"$12.5925"},"855":{"p":"$1.5600","d":"1/31/2025","n":"COMC from kwgduke"},"856":{"p":"$1.6500"},"857":{"s":"11","p":"$16.1700","d":"11/11/2025","n":"COMC from Dan_Z_cards"},"863":{"p":"$18.5639"},"864":{"s":"60","p":"$48.1100","d":"7/25/2025","n":"COMC from jpd347"},"872":{"s":"9","p":"$2.7229","d":"11/11/2025","n":"COMC from TheGallonthatguy1"},"875":{"s":"63","p":"$3.4500","d":"11/3/2025","n":"COMC from jsplate1 (+1 more copies)"},"878":{"s":"5","p":"$7.2500","d":"9/20/2025","n":"COMC from TheGallonthatguy1 (+1 more copies)"},"880":{"s":"20","p":"$21.2868","d":"10/20/2025","n":"COMC from Bildonga"},"882":{"p":"$5.3900"},"888":{"p":"$10.5400"},"889":{"p":"$19.3815"},"900":{"p":"$12.9721"},"904":{"s":"8","p":"$6.5500","d":"9/17/2025","n":"COMC from TheGallonthatguy1"},"906":{"p":"$1.7400","d":"3/26/2025","n":"COMC from SportCardShack"},"907":{"p":"$125.7000"},"909":{"s":"18","p":"$3.8200","d":"11/11/2025","n":"COMC from landon55"},"910":{"s":"18","p":"$4.2400","d":"8/22/2025","n":"COMC from SportCardShack (+4 more copies)"},"916":{"s":"5","p":"$12.8700","d":"8/13/2025","n":"COMC from Swomble"},"925":{"p":"$3.1700"},"935":{"p":"$7.9789"},"937":{"s":"44","p":"$2.2400","d":"8/22/2025","n":"COMC from SportCardShack (+1 more copies)"},"941":{"p":"$4.5900","d":"9/20/2025","n":"COMC from jdshep01 (+3 more copies)"},"946":{"p":"$3.4500","d":"9/23/2025","n":"COMC from SportCardShack"},"953":{"p":"$5.6800"},"954":{"p":"$163.2500"},"955":{"p":"$22.6008"},"959":{"p":"$25.1200"},"965":{"p":"$15.8400"},"966":{"p":"$28.3300"},"968":{"s":"21","p":"$6.0000","d":"7/14/2025","n":"COMC from Ddanto3 (+1 more copies)"},"972":{"p":"$20.7200"},"976":{"s":"24","p":"$34.0983","d":"3/26/2025","n":"COMC from 12fancards"},"978":{"p":"$31.8207"},"979":{"p":"$22.8417"},"981":{"p":"$11.2800"},"982":{"p":"$2.9800"},"984":{"p":"$5.0900"},"986":{"p":"$8.1760"},"989":{"p":"$5.1800"},"990":{"p":"$6.7600"},"1001":{"p":"$1.3800"},"1003":{"p":"$12.6600"},"1004":{"p":"$2.2500","d":"1/31/2025","n":"COMC from freshdcards"},"1005":{"p":"$7.8300","d":"8/18/2025","n":"COMC from Dan_Z_cards"},"1006":{"p":"$19.9582"},"1013":{"p":"$1.9491"},"1017":{"p":"$2.5500","d":"9/23/2025","n":"COMC from cardzndreamz"},"1019":{"p":"$4.6000"},"1024":{"p":"$10.8300"},"1026":{"p":"$2.0400"},"1028":{"p":"$1.7700","d":"8/28/2025","n":"COMC from Snydes9931"},"1030":{"p":"$4.5900","d":"9/23/2025","n":"COMC from bandrew6988"},"1033":{"p":"$2.4000","d":"12/8/2025","n":"COMC from MarkLemkeHOF"},"1035":{"p":"$2.0000","d":"3/26/2025","n":"COMC from GiantsFan415"},"1041":{"s":"134","p":"$2.2500","d":"8/22/2025","n":"COMC from Rockyfb72"},"1042":{"p":"$1.9500"},"1045":{"s":"192","p":"$3.3400","d":"5/31/2025","n":"COMC from wheelhousecards (+1 more copies)"},"1047":{"s":"52","p":"$5.5000","d":"12/5/2025","n":"COMC from justinwilliams140"},"1049":{"p":"$4.0000","d":"12/5/2025","n":"COMC from Davejerome"},"1050":{"p":"$2.7500","d":"8/28/2025","n":"COMC from oreos4dinner"},"1056":{"p":"$2.5000","d":"1/31/2025","n":"COMC from Philspulls"},"1057":{"p":"$24.5280"},"1062":{"p":"$5.2500","d":"9/23/2025","n":"COMC from card_curiosity2 (+1 more copies)"},"1068":{"s":"105","p":"$6.6500","d":"1/31/2025","n":"COMC from RStu0718"},"1069":{"p":"$3.5200","d":"1/31/2025","n":"COMC from dunquixote"},"1070":{"p":"$4.7900","d":"9/23/2025","n":"COMC from Lakedodge8"},"1073":{"s":"43","p":"$20.2500","d":"8/22/2025","n":"COMC from petesadek (+4 more copies)"},"1095":{"p":"$4.5900"},"1099":{"p":"$10.9500"},"1100":{"s":"20","p":"$4.2500","d":"5/31/2025","n":"COMC from Jaysker4"},"1103":{"s":"17","p":"$2.7000","d":"8/22/2025","n":"COMC from GoldenValleySports (+3 more copies)"},"1105":{"p":"$59.1900"},"1108":{"p":"$18.2100"},"1110":{"p":"$169.5100"},"1117":{"p":"$6.9642"},"1121":{"p":"$20.2500","d":"9/24/2025","n":"COMC from erik1000"},"1136":{"p":"$6.2500","d":"5/31/2025","n":"COMC from PatricksCardShop (+2 more copies)"},"1138":{"p":"$5.6800"},"1139":{"p":"$2.2500","d":"12/23/2024","n":"COMC from alejandroliz96"},"1140":{"p":"$4.0900","d":"1/31/2025","n":"COMC from tfrabb"},"1142":{"p":"$3.2000","d":"1/20/2025","n":"COMC from gscout81"},"1143":{"p":"$1.7146","d":"1/31/2025","n":"COMC from petesadek"},"1149":{"s":"22","p":"$13.1389","d":"1/31/2025","n":"COMC from petesadek"},"1152":{"p":"$82.5500"},"1159":{"p":"$1.6500","d":"1/20/2025","n":"COMC from cdollens13"},"1160":{"p":"$9.2500","d":"1/31/2025","n":"COMC from oldboy"},"1161":{"s":"166","p":"$1.9500","d":"5/26/2025","n":"COMC from Peterdog"},"1162":{"p":"$10.6900","d":"1/31/2025","n":"COMC from AESilverLake"},"1172":{"s":"94","p":"$7.5000","d":"2/13/2025","n":"COMC from trike415 (+2 more copies)"},"1184":{"p":"$10.7500","d":"8/22/2025","n":"COMC from Pridedriven (+3 more copies)"},"1192":{"p":"$2.6500","d":"3/26/2025","n":"COMC from Wrosy313"},"1193":{"p":"$3.8500","d":"2/1/2025 4","n":"COMC from modeymoozes"},"1206":{"s":"17","p":"$9.0379","d":"1/31/2025","n":"COMC from petesadek"},"1207":{"s":"53","p":"$20.6500","d":"6/1/2025 1","n":"COMC from CardEnt19"},"1210":{"p":"$10.9062"},"1213":{"p":"$6.8100"},"1215":{"p":"$0.9900","d":"5/21/2025","n":"COMC from bayoder"},"1216":{"p":"$5.2000","d":"8/22/2025","n":"COMC from ThePristineCollection"},"1217":{"p":"$4.9900","d":"5/21/2025","n":"COMC from Scubatuba"},"1218":{"p":"$1.1300","d":"5/21/2025","n":"COMC from Uodux8"},"1219":{"p":"$6.7700","d":"1/5/2026 7","n":"COMC from Thunderface"},"1220":{"p":"$5.1200","d":"8/22/2025","n":"COMC from Uodux8 (+1 more copies)"},"1221":{"s":"72","p":"$1.7500","d":"8/22/2025","n":"COMC from Philspulls"},"1222":{"p":"$2.1700"},"1227":{"p":"$1.2500","d":"5/21/2025","n":"COMC from BarelyImpressive"},"1229":{"p":"$1.4000","d":"5/21/2025","n":"COMC from Mrcantell"},"1231":{"p":"$2.2500","d":"5/21/2025","n":"COMC from jdorant"},"1232":{"p":"$2.0000","d":"8/16/2025","n":"COMC from Ddanto3"},"1233":{"s":"1","p":"$29.7329","d":"8/22/2025","n":"COMC from daneff"},"1242":{"p":"$45.2800"},"1248":{"p":"$3.0000","d":"8/16/2025","n":"COMC from CardKing"},"1250":{"s":"79","p":"$2.9500","d":"1/14/2026","n":"COMC from billy_cardboard (+1 more copies)"},"1251":{"p":"$16.7600"},"1257":{"s":"24","p":"$4.9900","d":"8/16/2025","n":"COMC from bodizona"},"1258":{"p":"$3.0700"},"1260":{"s":"15","p":"$5.0000","d":"8/22/2025","n":"COMC from kansaijin"},"1268":{"s":"3","p":"$7.6500","d":"8/23/2025","n":"COMC from Remy7"},"1271":{"s":"1","p":"$15.0000","d":"9/4/2025 5","n":"COMC from nchopp139"},"1273":{"s":"9","p":"$14.0000","d":"3/26/2025","n":"COMC from Topaz (+1 more copies)"},"1275":{"s":"16","p":"$10.0700","d":"5/21/2025","n":"COMC from dbackjeff (+2 more copies)"},"1277":{"p":"$5.4239"},"1283":{"p":"$0.9300","d":"9/23/2025","n":"COMC from petesadek"},"1284":{"s":"25","p":"$3.2500","d":"7/14/2025","n":"COMC from TheAwesomeCardShop (+1 more copies)"},"1286":{"s":"42","p":"$2.2500","d":"1/20/2025","n":"COMC from mccray24"},"1287":{"p":"$7.4000"},"1288":{"p":"$6.7800","d":"11/4/2025","n":"COMC from 412nhcc"},"1289":{"p":"$6.9000"},"1302":{"s":"194","p":"$2.0000","d":"1/31/2025","n":"COMC from Vale2773"},"1303":{"p":"$1.2500","d":"1/31/2025","n":"COMC from MFaulk007"},"1305":{"p":"$3.7230"},"1306":{"p":"$6.2500","d":"11/3/2025","n":"COMC from MizTiger"},"1307":{"s":"97","p":"$6.7800","d":"1/31/2025","n":"COMC from taydwyer8"},"1309":{"p":"$5.9900"},"1312":{"p":"$6.5400"},"1314":{"p":"$14.0700"},"1315":{"p":"$1.0500","d":"2/1/2025 7","n":"COMC from soapcards"},"1317":{"s":"1","p":"$4.3200","d":"1/31/2025","n":"COMC from mccray24"},"1318":{"p":"$1.8500"},"1319":{"s":"97","p":"$2.2500","d":"1/31/2025","n":"COMC from MFaulk007"},"1323":{"s":"9","p":"$25.2500","d":"1/21/2025","n":"COMC from jmiles17"},"1327":{"s":"1054","p":"$1.8500","d":"8/25/2025","n":"COMC from Jocollects6 (+5 more copies)"},"1329":{"p":"$24.0500","d":"9/8/2025 1","n":"COMC from MN_TwinViking (+2 more copies)"},"1331":{"p":"$2.2800"},"1335":{"s":"264","p":"$4.2500","d":"8/22/2025","n":"COMC from jabeal2 (+1 more copies)"},"1338":{"p":"$1.4500","d":"1/31/2025","n":"COMC from rogueriver"},"1346":{"p":"$7.6100","d":"3/26/2025","n":"COMC from Actionbryan"},"1358":{"p":"$5.3100"},"1371":{"s":"621","p":"$4.3000","d":"5/31/2025","n":"COMC from Adamwilliams (+1 more copies)"},"1372":{"p":"$2.1700"},"1375":{"p":"$0.9600","d":"1/31/2025","n":"COMC from MarkRAnderson87 (+1 more copies)"},"1376":{"p":"$1.6000","d":"1/31/2025","n":"COMC from MH_collectibles21"},"1378":{"s":"115","p":"$5.5000","d":"4/11/2025","n":"COMC from jpd347"},"1379":{"p":"$1.2400","d":"9/23/2025","n":"COMC from trike415"},"1380":{"p":"$2.0500","d":"1/31/2025","n":"COMC from rogueriver"},"1382":{"p":"$3.1100","d":"3/26/2025","n":"COMC from madwill08 (+1 more copies)"},"1384":{"p":"$5.5900"},"1386":{"p":"$1.5000","d":"1/31/2025","n":"COMC from jemsox"},"1387":{"p":"$2.2500","d":"5/22/2025","n":"COMC from jebr28"},"1389":{"p":"$1.7520"},"1391":{"p":"$6.2600","d":"9/23/2025","n":"COMC from rogueriver (+1 more copies)"},"1397":{"p":"$8.6800"},"1399":{"p":"$6.6900"},"1402":{"p":"$4.0000"},"1418":{"p":"$3.1828"},"1421":{"p":"$4.1391"},"1445":{"n":"Second copy - in transit"},"1446":{"n":"Second copy - in transit"},"1447":{"n":"Second copy - in transit"},"1448":{"n":"Second copy - in transit"},"1449":{"n":"Extra copy - for sale/trade"},"1450":{"n":"Extra copy - for sale/trade"},"1451":{"n":"Extra copy - for sale/trade"},"1452":{"n":"Extra copy - for sale/trade"},"1453":{"n":"Extra copy - for sale/trade"},"1454":{"n":"Extra copy - for sale/trade"},"1455":{"n":"Extra copy - for sale/trade"},"1456":{"n":"Extra copy - for sale/trade"},"1457":{"n":"Extra copy - for sale/trade"},"1458":{"n":"Extra copy - for sale/trade"},"1459":{"n":"Extra copy - for sale/trade"},"1460":{"n":"Extra copy - for sale/trade"},"1461":{"n":"Extra copy - for sale/trade"},"1462":{"n":"Extra copy - for sale/trade"},"1463":{"n":"Extra copy - for sale/trade"},"1464":{"n":"Extra copy - for sale/trade"},"1465":{"n":"Extra copy - for sale/trade"},"1466":{"n":"Extra copy - for sale/trade"},"1467":{"n":"Extra copy - for sale/trade"},"1468":{"n":"Extra copy - for sale/trade"},"1469":{"n":"Extra copy - for sale/trade"},"1470":{"n":"Extra copy - for sale/trade"},"1471":{"n":"Extra copy - for sale/trade"}};
// Get effective print run: user override (from details.printRun) > original card.copies. "?" means SN but unknown.
function getEffCopies(card, cardDetails) {
  var d = cardDetails && cardDetails[card.id];
  if (d && d.printRun != null && d.printRun !== "") {
    if (d.printRun === "?") return null; // SN but unknown — treat as unnumbered for filtering
    return d.printRun;
  }
  return card.copies;
}
function isMissingSN(card, cardDetails) {
  var d = cardDetails && cardDetails[card.id];
  return (d && d.printRun === "?") || false;
}
function missingSNBadge(card, cardDetails) {
  if (!isMissingSN(card, cardDetails)) return null;
  return React.createElement("span", {className:"inline-block px-1 py-0 rounded text-[8px] font-black bg-orange-900/80 text-orange-300 border border-orange-700 ml-1 flex-shrink-0", title:"Serial numbered but print run unknown"}, "SN?");
}
// Get lowest target price for a cardId from targetByCardId lookup
function getLowestTargetPrice(cardId, targetByCardId) {
  if (!targetByCardId || !targetByCardId[cardId]) return null;
  var tgts = targetByCardId[cardId];
  var lowest = Infinity;
  for (var i = 0; i < tgts.length; i++) {
    var p = parseFloat(tgts[i].watchPrice) || parseFloat(tgts[i].price) || Infinity;
    if (p < lowest) lowest = p;
  }
  return lowest === Infinity ? null : lowest;
}
// Get lowest scanner price for a card from PRICE_HISTORY
function getLowestScannerPrice(card) {
  var pk = globalPriceKey(card);
  if (!pk || !PRICE_HISTORY[pk]) return null;
  var entries = Array.isArray(PRICE_HISTORY[pk]) ? PRICE_HISTORY[pk] : (PRICE_HISTORY[pk].entries || []);
  if (!entries.length) return null;
  var lowest = Infinity;
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].price > 0 && entries[i].price < lowest) lowest = entries[i].price;
  }
  return lowest === Infinity ? null : lowest;
}
var TCDB_USER_FIXES = {}; // Populated from localStorage at runtime -- overrides TCDB_LINKS
var COMC_OVERRIDES = {}; // Populated from localStorage - persistent COMC match overrides
var PRICE_HISTORY = {}; // Populated from localStorage - historical pricing data by card ID
function loadPriceHistory() { try { return JSON.parse(localStorage.getItem("tb-price-history-v1") || "{}"); } catch(e) { return {}; } }
function savePriceHistory(obj) { localStorage.setItem("tb-price-history-v1", JSON.stringify(obj)); try { window.storage.set("tb-price-history-v1", JSON.stringify(obj)); } catch(e) {} PRICE_HISTORY = obj; }
var TCDB_FLAGS = {}; // Populated from localStorage -- flagged bad links
var EBAY_BLOCKED = {}; // Populated from localStorage -- blocked eBay listings
function loadEbayBlocked() { try { return JSON.parse(localStorage.getItem("tb-ebay-blocked-v1") || "{}"); } catch(e) { return {}; } }
function saveEbayBlocked(obj) { localStorage.setItem("tb-ebay-blocked-v1", JSON.stringify(obj)); try { window.storage.set("tb-ebay-blocked-v1", JSON.stringify(obj)); } catch(e) {} EBAY_BLOCKED = obj; }
function loadEbayBids() { try { return JSON.parse(localStorage.getItem("tb-ebay-bids-v1") || "{}"); } catch(e) { return {}; } }
function saveEbayBids(obj) { localStorage.setItem("tb-ebay-bids-v1", JSON.stringify(obj)); try { window.storage.set("tb-ebay-bids-v1", JSON.stringify(obj)); } catch(e) {} }
function loadTargets() { try { return JSON.parse(localStorage.getItem("tb-targets-v1") || "{}"); } catch(e) { return {}; } }
function saveTargets(obj) { localStorage.setItem("tb-targets-v1", JSON.stringify(obj)); try { window.storage.set("tb-targets-v1", JSON.stringify(obj)); } catch(e) {} }
function globalPriceKey(card) {
  if (!card) return null;
  return card.product.slice(0,4) + "|" + card.product + "|" + card.cardNumber + "|" + (card.cardSet || "Base");
}
function Sparkline({ card, width, height }) {
  var pk = globalPriceKey(card);
  if (!pk || !PRICE_HISTORY[pk]) return null;
  var entries = Array.isArray(PRICE_HISTORY[pk]) ? PRICE_HISTORY[pk] : (PRICE_HISTORY[pk].entries || []);
  if (entries.length < 2) return null;
  var prices = entries.map(function(e) { return e.price; }).filter(function(p) { return p > 0; });
  if (prices.length < 2) return null;
  var w = width || 40, h = height || 14;
  var min = Math.min.apply(null, prices), max = Math.max.apply(null, prices);
  var range = max - min || 1;
  var pts = prices.map(function(p, i) {
    return (i / (prices.length - 1) * w).toFixed(1) + "," + (h - 1 - (p - min) / range * (h - 2)).toFixed(1);
  }).join(" ");
  var lastColor = prices[prices.length - 1] >= prices[0] ? "#4ade80" : "#f87171";
  return React.createElement("svg", { width: w, height: h, className: "inline-block align-middle" },
    React.createElement("polyline", { points: pts, fill: "none", stroke: lastColor, strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round" })
  );
}
function tcdbUrl(card) {
  // Priority 1: user-corrected links
  var fix = card && TCDB_USER_FIXES[card.id];
  if (fix) {
    var fparts = fix.split("/");
    return "https://www.tcdb.com/ViewCard.cfm/sid/" + fparts[0] + "/cid/" + fparts[1] + "/ViewCard";
  }
  // Priority 2: pre-compiled direct links
  var lnk = card && TCDB_LINKS[card.id];
  if (lnk) {
    var parts = lnk.split("/");
    return "https://www.tcdb.com/ViewCard.cfm/sid/" + parts[0] + "/cid/" + parts[1] + "/ViewCard";
  }
  // Fallback: search URL
  if (!card) return TCDB_PLAYER;
  var yr = (card.product.match(/^\d{4}/) || [""])[0];
  var num = card.cardNumber || "";
  var prod = card.product.replace(/^\d{4}\s*/, "").replace(/\s*\(NOT_ON_TCDB\)/, "");
  var q = yr + " " + prod + " " + num + " Tyler Black";
  return "https://www.tcdb.com/Search.cfm/ty/cards/fo/0/sn/" + encodeURIComponent(q);
}
function tcdbSearchUrl(card) {
  // Construct a TCDB search URL from card metadata - always reliable regardless of TCDB_LINKS accuracy
  if (!card) return TCDB_PLAYER;
  var yr = (card.product.match(/^\d{4}/) || [""])[0];
  var num = card.cardNumber || "";
  var prod = card.product.replace(/^\d{4}\s*/, "").replace(/\s*\(NOT_ON_TCDB\)/, "");
  var q = yr + " " + prod + " " + num + " Tyler Black";
  return "https://www.tcdb.com/Search.cfm/ty/cards/fo/0/sn/" + encodeURIComponent(q);
}
// Strip publisher/brand names from product for eBay search (sellers often omit them)
var EBAY_BRAND_RE = /^(Topps|Panini|Bowman|Donruss|Leaf|Upper Deck|Fleer|Choice|Pro Set|Pulse|Stadium Club)\s+/i;
function stripBrand(prodNoYear) {
  var s = prodNoYear.replace(EBAY_BRAND_RE, "");
  // Handle double brands like "Panini Donruss" → "Donruss", "Topps Bowman" → "Bowman"
  s = s.replace(EBAY_BRAND_RE, "");
  return s.trim();
}
function ebayUrl(card) {
  var yr = card.product.match(/^(\d{4})\s/) ? card.product.match(/^(\d{4})\s/)[1] : "";
  var variant = stripBrand(card.cardSet || "");
  return "https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent("Tyler Black " + yr + " " + card.cardNumber + " " + variant) + "&_sacat=212";
}
function ebayUrlsSuper(card) {
  var pr = card.copies ? Number(card.copies) : 0;
  var yr = card.product.match(/^(\d{4})\s/) ? card.product.match(/^(\d{4})\s/)[1] : "";
  var base = yr + " " + card.cardNumber;
  var variant = stripBrand(card.cardSet || "");
  var name = "Tyler Black";
  var isOneOfOne = pr === 1;
  var urls = [];
  var baseParams = "&_sacat=212";
  if (isOneOfOne) {
    urls.push("https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(name + " " + base + " " + variant + " 1/1") + baseParams);
    urls.push("https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(name + " " + base + " " + variant + " one of one") + baseParams);
    urls.push("https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(name + " " + base + " " + variant + " 1 of 1") + baseParams);
    urls.push("https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(name + " " + base + " " + variant) + baseParams);
    urls.push("https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent("\"" + name + "\" " + base + " " + variant + " 1/1") + baseParams);
  } else if (pr > 0) {
    var serial = "/" + pr;
    urls.push("https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(name + " " + base + " " + variant + " " + serial) + baseParams);
    urls.push("https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(name + " " + base + " " + variant) + baseParams);
    urls.push("https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(name + " " + base + " " + serial) + baseParams);
    urls.push("https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent("\"" + name + "\" " + base + " " + variant + " " + serial) + baseParams);
    urls.push("https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent("\"" + name + "\" " + base + " " + variant) + baseParams);
  } else {
    urls.push("https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(name + " " + base + " " + variant) + baseParams);
    urls.push("https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(name + " " + base) + baseParams);
    urls.push("https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent("\"" + name + "\" " + base + " " + variant) + baseParams);
    urls.push("https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(name + " " + base.split(' ')[0] + " " + variant) + baseParams);
  }
  return urls;
}
var COMC_PLAYER = "https://www.comc.com/Players/Baseball/Tyler_Black/c389004";
function comcUrl(card) {
  var terms = card.product.replace(/'/g, "").replace(/\s*\([^)]*\)/g, "") + " " + card.cardNumber + " " + card.cardSet;
  return COMC_PLAYER + ",+" + terms.replace(/[&\/]/g, " ").replace(/\s+/g, " ").trim().replace(/ /g, "+");
}
var SPORTLOTS_PLAYER = "https://sportlots.com/Baseball/cards/Tyler-Black.tpl";
function sportLotsUrl() { return SPORTLOTS_PLAYER; }
var WHATNOT_SEARCH = "https://www.whatnot.com/search?q=tyler+black&category=sports-cards&subcategory=baseball-cards";
function whatnotUrl() { return WHATNOT_SEARCH; }
function pt130Url(card) {
  if (!card) return "https://130point.com/sales/?search=tyler+black";
  var yr = (card.product.match(/^\d{4}/) || [""])[0];
  var prodNoYear = card.product.replace(/^\d{4}\s*/, "").replace(/\s*\(NOT_ON_TCDB\)/, "");
  var q = "tyler black " + yr + " " + card.cardNumber + " " + prodNoYear;
  return "https://130point.com/sales/?search=" + encodeURIComponent(q.trim());
}
let ALL_CARDS = expandData(RAW_DATA).filter(function(c) { return c.id !== 1; }); // Hide test card (ID 1) but keep it for ID stability

// Custom cards added by user via COMC Scanner "Add to DB" feature
var CUSTOM_CARDS_KEY = "tb-custom-cards-v1";
function loadCustomCards() {
  try {
    var stored = localStorage.getItem(CUSTOM_CARDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch(e) { return []; }
}
function saveCustomCards(cards) {
  try { localStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(cards)); } catch(e) {}
  try { window.storage.set(CUSTOM_CARDS_KEY, JSON.stringify(cards)); } catch(e) {}
}
function mergeCustomCards() {
  var custom = loadCustomCards();
  // Remove any previously merged custom cards (id >= 10000) - mutate in place
  for (var ri = ALL_CARDS.length - 1; ri >= 0; ri--) {
    if (ALL_CARDS[ri].id >= 10000) ALL_CARDS.splice(ri, 1);
  }
  custom.forEach(function(cc, idx) {
    ALL_CARDS.push({
      id: 10000 + idx,
      product: cc.product,
      cardNumber: cc.cardNumber,
      cardSet: cc.cardSet,
      copies: cc.copies || null,
      isAuto: cc.isAuto || "",
      isMem: cc.isMem || "",
      isRC: cc.isRC || "",
      isCustom: true,
      addedDate: cc.addedDate || ""
    });
  });
  // Rebuild lookup map if it exists (not on first call during init)
  if (typeof CARD_BY_ID !== "undefined") {
    ALL_CARDS.forEach(function(c) { CARD_BY_ID[c.id] = c; });
  }
}
mergeCustomCards();
// Cards whose variant consists entirely of player-name/noise words (e.g. "Black", "First Card")
// can NEVER be reliably auto-matched from eBay titles since "Tyler Black" appears in every listing.
// Used to block eBay price recording and auto-purge stale data.
var EBAY_AMBIGUOUS_WORDS = {"tyler":1,"black":1,"card":1,"cards":1,"first":1,"draft":1,"pick":1,"rookie":1,"rookies":1,"debut":1,"rc":1,"1st":1};
var AMBIGUOUS_PRICE_KEYS = new Set();
var AMBIGUOUS_CARD_IDS = new Set();
ALL_CARDS.forEach(function(c) {
  var v = (c.cardSet || "").toLowerCase().replace(/[^a-z0-9 ]/g," ").trim();
  var words = v.split(/\s+/).filter(function(w) { return w.length >= 2; });
  if (words.length > 0 && words.every(function(w) { return EBAY_AMBIGUOUS_WORDS[w]; })) {
    AMBIGUOUS_CARD_IDS.add(c.id);
    AMBIGUOUS_PRICE_KEYS.add(c.product.slice(0,4) + "|" + c.product + "|" + c.cardNumber + "|" + (c.cardSet || "Base"));
  }
});
// Fast card lookup by ID - used by recordPrice instead of ALL_CARDS.find()
var CARD_BY_ID = {};
ALL_CARDS.forEach(function(c) { CARD_BY_ID[c.id] = c; });
const PRESET_OWNED = new Set(RAW_DATA.owned || []);
const PRESET_INTRANSIT = new Set(RAW_DATA.intransit || []);
const DUPES = RAW_DATA.dupes || [];
// Duplicate dedup: HIDDEN_DUPES are non-primary IDs for identical cards (same product/cardNumber/variant/copies)
// These are hidden from collection display. Primary card gets qty > 1 when user owns extra copies.
const HIDDEN_DUPES = new Set([34,111,129,295,343,353,356,417,436,465,526,528,678,740,746,876,879,1063,1093,1104,1137,1187,1285,1328,1330,1336,1374,1383,1388,1445,1446,1447,1448,1449,1450,1451,1452,1453,1454,1455,1456,1457,1458,1459,1460,1461,1462,1463,1464,1465,1466,1467,1468,1469,1470,1471]);
const DUPE_QTY_INIT = {33:1,294:1,875:1,878:1}; // primary cards with extra statused copies
const NOT_SYNCED = new Set(RAW_DATA.not_synced || []);
const NOT_ON_TCDB = new Set([1472,1473,1474,1475,1476,1477,1478,1479]);
const MISSING_FROM_TCDB = new Set([968,969,970,971,972,973,974,975,976,977,978,979,980,981]);
const EXTRA_DUPES = HIDDEN_DUPES; // backward compat alias
const EBAY_IDS = new Set([3,8,12,32,57,91,92,106,112,113,121,145,158,199,202,204,227,232,253,255,258,272,273,276,277,293,302,307,308,314,319,331,334,349,361,373,388,437,451,454,459,483,500,512,514,534,549,573,616,626,643,650,652,653,657,658,660,664,666,673,675,683,684,685,687,691,693,699,711,736,758,760,775,780,808,841,849,855,856,862,863,871,879,881,887,888,899,906,924,934,940,945,952,953,954,958,964,965,971,975,977,978,980,981,983,985,988,989,1000,1002,1005,1012,1018,1023,1025,1029,1041,1056,1068,1069,1094,1098,1104,1107,1109,1116,1137,1139,1151,1209,1212,1218,1221,1232,1241,1250,1257,1276,1286,1288,1304,1308,1311,1313,1316,1317,1330,1357,1371,1383,1388,1390,1396,1398,1401,1417,1420]);
const MULTI_EBAY = new Set([57,112,307,314,349,437,643,653,660,666,693,736,871,879,954,971,975,1000,1012,1069,1104,1276,1388]);
const EBAY_ORDERS={"3":"01-10569-82556","8":"19-10579-25938","12":"05-13269-40771","32":"14-13863-41516","57":"07-14016-02005","91":"10-13989-82166","92":"07-13996-14051","106":"23-13802-33304","112":"23-13802-33304","113":"09-14061-68316","121":"04-14163-75237","145":"25-14081-12262","158":"16-14152-79872","199":"08-13992-50613","202":"20-13660-42140","204":"19-13809-83289","227":"16-13813-95195","232":"23-13802-33304","253":"15-13505-52573","255":"05-14106-79011","258":"25-13241-99537","272":"08-13188-68193","273":"05-13541-82282","276":"19-14000-28543","277":"21-13999-14291","293":"13-13941-50267","302":"09-10667-00902","307":"07-14045-70384","308":"24-13317-71730","314":"09-14061-68317","319":"09-14061-68317","331":"09-14061-68315","334":"14-13188-86252","349":"04-13329-51743","361":"12-13815-42719","373":"22-13970-20992","388":"23-13802-33304","437":"09-14120-70554","451":"01-13830-87479","454":"17-14109-43575","459":"22-14043-40803","483":"22-13173-03861","500":"19-14075-98262","512":"01-14073-62987","514":"03-14074-39244","534":"20-13973-58268","549":"15-13180-05837","573":"02-13621-05141","616":"20-13804-06916","626":"09-13207-17087","643":"27-13988-02244","650":"12-13838-36620","652":"22-12653-78553","653":"20-13931-61616","657":"07-12663-64721","658":"26-12644-44368","660":"25-13797-11931","664":"10-14118-70535","666":"24-13817-48959","673":"12-13838-36620","675":"15-12654-01101","683":"11-13471-09535","684":"14-12655-26561","685":"10-12665-41096","687":"08-12667-63770","691":"21-12652-40109","693":"05-12667-66600","699":"07-12787-09777","711":"15-13638-67907","736":"23-13800-09954","758":"23-13251-64587","760":"15-13855-78087","775":"09-14032-83495","780":"26-13840-52249","808":"23-14077-11619","841":"07-12534-67938","849":"24-14114-37037","855":"14-13188-86252","856":"13-13614-54271","862":"10-14119-26694","863":"20-13612-97452","871":"14-13782-17023","879":"05-14095-95800","881":"21-13315-97580","887":"09-13749-35221","888":"04-14069-26885","899":"06-13827-98668","906":"22-13622-24600","924":"01-13490-79609","934":"20-13804-11045","940":"24-13185-19070","945":"05-13193-65487","952":"25-13452-47031","953":"18-13093-66593","954":"27-14036-69268","958":"10-13475-38186","964":"12-13469-96808","965":"25-13453-85178","971":"27-13804-88657","975":"19-13814-37357","977":"04-14139-74277","978":"17-13817-08536","980":"07-13854-71671","981":"18-12650-80902","983":"13-13826-86488","985":"25-14094-11278","988":"06-13836-55786","989":"20-13979-31887","1000":"10-12665-43528","1002":"20-12649-63500","1005":"20-13794-54378","1012":"11-14153-43763","1018":"12-12657-91135","1023":"03-12669-49550","1025":"13-12658-12767","1029":"02-12669-81516","1041":"10-13286-26132","1056":"15-13947-06800","1068":"12-12663-27978","1069":"27-12645-79442","1094":"11-13644-16209","1098":"07-14045-70385","1104":"24-13991-56188","1107":"22-13933-67704","1109":"07-13989-68962","1116":"06-13832-65499","1137":"24-12659-72975","1139":"02-12670-90573","1151":"27-13966-28254","1209":"25-14032-36475","1212":"01-14046-06072","1218":"07-13935-14571","1221":"27-13907-21909","1232":"26-13795-88577","1241":"24-13285-91373","1250":"22-14004-49033","1257":"15-13619-68949","1276":"09-14089-64729","1286":"24-13925-99770","1288":"04-13939-23947","1304":"07-13822-27916","1308":"27-13595-87051","1311":"25-13909-96233","1313":"20-13175-58858","1316":"18-13310-99826","1317":"22-12653-78553","1330":"16-13637-37471","1357":"16-14000-46274","1371":"11-13929-44435","1383":"01-13943-96198","1388":"15-14134-48316","1390":"20-13917-17991","1396":"07-13569-92315","1398":"19-13174-33264","1401":"22-13593-67618","1417":"10-14115-17049","1420":"19-14102-65835"};
function orderUrl(card) { var oid = EBAY_ORDERS[String(card.id)]; return oid ? "https://order.ebay.ca/ord/show?orderId=" + oid : null; }
const STATUS_CONFIG = {
  owned: { label: "Owned", dot: "bg-green-500", bg: "bg-green-900/30", border: "border-green-500", emoji: "v" },
  in_transit: { label: "In Transit", dot: "bg-emerald-400", bg: "bg-emerald-900/30", border: "border-emerald-400", emoji: ">" },
  for_sale: { label: "For Sale", dot: "bg-pink-500", bg: "bg-pink-900/30", border: "border-pink-500", emoji: "$" },
  not_owned: { label: "Not Owned", dot: "bg-red-500", bg: "bg-red-900/30", border: "border-red-500", emoji: "o" },
};
const PRIMARY_STATUSES = ["not_owned", "in_transit", "owned"];
function formatPrice(v) { if (!v) return ""; var n = v.replace(/[^0-9.]/g, ""); var parts = n.split("."); if (parts.length > 2) n = parts[0] + "." + parts.slice(1).join(""); if (parts.length === 2 && parts[1].length > 2) n = parts[0] + "." + parts[1].slice(0, 2); return n ? "$" + n : ""; }
function displayPrice(v) { if (!v) return ""; var n = parseFloat(v.replace(/[^0-9.]/g, "")); return isNaN(n) ? v : "$" + n.toFixed(2); }
const SYNC_DATA = {};
function TylerBlackTracker() {
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  useEffect(function() {
    var iv = setInterval(function() {
      try {
        var o = !!(window.trackerAuth && window.trackerAuth.isOwner());
        setIsOwner(function(p) { return p === o ? p : o; });
      } catch(e) {}
    }, 1000);
    return function() { clearInterval(iv); };
  }, []);
  const [statuses, setStatuses] = useState({});
  const [cardDetails, setCardDetails] = useState({});
  const [filterYear, setFilterYear] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [filterCardNum, setFilterCardNum] = useState("");
  const [page, setPage] = useState(0);
  const [saving, setSaving] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [showDupes, setShowDupes] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [detailedSnFilter, setDetailedSnFilter] = useState(null);
  const [detailedStatusFilter, setDetailedStatusFilter] = useState(null);
  const [detailedCardId, setDetailedCardId] = useState(null);
  const [targetCardFilter, setTargetCardFilter] = useState(null);
  const [detailedProductFilter, setDetailedProductFilter] = useState(null);
  const [detailedCardNumFilter, setDetailedCardNumFilter] = useState(null);
  const [pricesSearchFilter, setPricesSearchFilter] = useState(null);
  const [syncedIds, setSyncedIds] = useState(new Set());
  const [dirtyIds, setDirtyIds] = useState(new Set());
  const [syncIndex, setSyncIndex] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [forSaleFlags, setForSaleFlags] = useState({});
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [saveToast, setSaveToast] = useState("");
  const [saveCount, setSaveCount] = useState(0);
  const [lastCheckpoint, setLastCheckpoint] = useState(null);
  const [isSavingCheckpoint, setIsSavingCheckpoint] = useState(false);
  const [sessionChanges, setSessionChanges] = useState(0);
  const [customEditVer, setCustomEditVer] = useState(0);
  const [editingCustom, setEditingCustom] = useState(null); // {idx, product, cardSet, cardNumber, copies}
  const [storageDiag, setStorageDiag] = useState("");
  const exportCsvRef = useRef(null);
  const undoStack = useRef([]);
  const [undoLen, setUndoLen] = useState(0);
  const sessionInitial = useRef(null);
  const [changelog, setChangelog] = useState([]);
  const [superSearchMode, setSuperSearchMode] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const [showKbHelp, setShowKbHelp] = useState(false);
  const sessionId = useRef(Date.now().toString(36));
  const scannerStateRef = useRef(null);
  const [tcdbFixes, setTcdbFixes] = useState({}); // user-corrected TCDB links: {cardId: "sid/cid"}
  const [tcdbFlags, setTcdbFlags] = useState({}); // flagged bad TCDB links: {cardId: timestamp}
  const [tcdbFixInput, setTcdbFixInput] = useState(""); // URL input for fixing
  const [tcdbFixingId, setTcdbFixingId] = useState(null); // which card is being fixed
  const [hidePrices, setHidePrices] = useState(true);
  useEffect(function() { if (!isOwner) setHidePrices(true); }, [isOwner]);
  // Build targetByCardId lookup from localStorage targets (for Lookup/Detailed panels)
  var _mainTargets = useMemo(function() { return loadTargets(); }, [activeTab, targetCardFilter]);
  var targetByCardId = useMemo(function() {
    var map = {};
    var keys = Object.keys(_mainTargets);
    for (var i = 0; i < keys.length; i++) {
      var tg = _mainTargets[keys[i]];
      if (tg.cardId) { if (!map[tg.cardId]) map[tg.cardId] = []; map[tg.cardId].push(tg); }
    }
    return map;
  }, [_mainTargets]);
  // Keep module-level TCDB vars in sync with state
  useEffect(() => { TCDB_USER_FIXES = tcdbFixes; }, [tcdbFixes]);
  useEffect(() => { TCDB_FLAGS = tcdbFlags; }, [tcdbFlags]);
  // Save TCDB fixes to storage
  const saveTcdbFixes = useCallback(async (newFixes) => {
    setTcdbFixes(newFixes);
    try { await window.storage.set("tb-tcdb-fixes-v1", JSON.stringify(newFixes)); } catch(e) {}
  }, []);
  const saveTcdbFlags = useCallback(async (newFlags) => {
    setTcdbFlags(newFlags);
    try { await window.storage.set("tb-tcdb-flags-v1", JSON.stringify(newFlags)); } catch(e) {}
  }, []);
  function flagTcdbLink(cardId) {
    var nf = { ...tcdbFlags, [cardId]: Date.now() };
    saveTcdbFlags(nf);
  }
  function unflagTcdbLink(cardId) {
    var nf = { ...tcdbFlags }; delete nf[cardId];
    saveTcdbFlags(nf);
  }
  function applyTcdbFix(cardId, url) {
    // Extract sid/cid from a TCDB ViewCard URL
    var m = url.match(/sid\/(\d+)\/cid\/(\d+)/);
    if (!m) return false;
    var newFixes = { ...tcdbFixes, [cardId]: m[1] + "/" + m[2] };
    saveTcdbFixes(newFixes);
    // Remove flag since it's now fixed
    unflagTcdbLink(cardId);
    return true;
  }
  // Flush pending saves on tab close
  function editCustomCardById(cardId) {
    if (cardId < 10000) return;
    var idx = cardId - 10000;
    // Read directly from ALL_CARDS in memory (the merged custom card)
    var memCard = ALL_CARDS.find(function(c) { return c.id === cardId; });
    if (!memCard) return;
    setEditingCustom({ cardId: cardId, idx: idx, product: memCard.product || "", cardSet: memCard.cardSet || "", cardNumber: memCard.cardNumber || "", copies: String(memCard.copies || "") });
  }
  function saveCustomCardEdit() {
    if (!editingCustom) return;
    var ec = editingCustom;
    if (!ec.cardSet || !ec.cardSet.trim()) { 
      setEditingCustom(Object.assign({}, ec, {error: "Variant cannot be empty"})); 
      return; 
    }
    // Try localStorage save (non-critical)
    try {
      var custom = loadCustomCards();
      if (ec.idx >= 0 && ec.idx < custom.length) {
        custom[ec.idx].cardSet = ec.cardSet.trim();
        custom[ec.idx].product = ec.product.trim() || custom[ec.idx].product;
        custom[ec.idx].cardNumber = ec.cardNumber.trim() || custom[ec.idx].cardNumber;
        custom[ec.idx].copies = String(ec.copies || "").trim() || null;
        saveCustomCards(custom);
      }
    } catch(e) {}
    // Critical: update in-memory ALL_CARDS
    var memCard = ALL_CARDS.find(function(c) { return c.id === ec.cardId; });
    if (memCard) {
      memCard.cardSet = ec.cardSet.trim();
      memCard.product = ec.product.trim() || memCard.product;
      memCard.cardNumber = ec.cardNumber.trim() || memCard.cardNumber;
      memCard.copies = String(ec.copies || "").trim() || null;
      if (typeof CARD_BY_ID !== "undefined") CARD_BY_ID[memCard.id] = memCard;
      setEditingCustom(null);
      setCustomEditVer(function(v) { return v + 1; });
    } else {
      setEditingCustom(Object.assign({}, ec, {error: "Card #" + ec.cardId + " not found in memory (idx=" + ec.idx + ")"}));
    }
  }
  useEffect(() => {
    function handleBeforeUnload() {
      if (window._skipBeforeUnloadSave) return;
      if (loadComplete.current && allDataRef.current._migrationComplete) {
        allDataRef.current._saveTimestamp = Date.now();
        var payload = JSON.stringify(allDataRef.current);
        // localStorage is SYNC - guaranteed to complete before unload
        try { localStorage.setItem("tb-alldata-backup-v1", payload); } catch (e) {}
        // window.storage is ASYNC - may not complete, but try anyway
        try { window.storage.set("tb-alldata-v1", payload); } catch (e) {}
      }
    }
    function handleVisibilityChange() {
      if (window._skipBeforeUnloadSave) return;
      if (document.hidden && loadComplete.current && allDataRef.current._migrationComplete) {
        allDataRef.current._saveTimestamp = Date.now();
        var payload = JSON.stringify(allDataRef.current);
        try { localStorage.setItem("tb-alldata-backup-v1", payload); } catch (e) {}
        try { window.storage.set("tb-alldata-v1", payload); } catch (e) {}
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => { window.removeEventListener("beforeunload", handleBeforeUnload); document.removeEventListener("visibilitychange", handleVisibilityChange); };
  }, []);
  // Periodic backup -- just force-flush allDataRef
  useEffect(() => {
    if (loading) return;
    function doBackup() {
      if (!loadComplete.current) return;
      allDataRef.current._saveTimestamp = Date.now();
      var payload = JSON.stringify(allDataRef.current);
      try {
        window.storage.set("tb-alldata-v1", payload);
      } catch (e) { console.error("Backup flush failed:", e); }
      try { localStorage.setItem("tb-alldata-backup-v1", payload); } catch(e) {}
    }
    var initialTimer = setTimeout(doBackup, 30000);
    var interval = setInterval(doBackup, 5 * 60 * 1000);
    return () => { clearTimeout(initialTimer); clearInterval(interval); };
  }, [loading]);

  // Show a brief save notification
  const flashSave = useCallback((msg) => {
    setLastSaveTime(new Date().toLocaleTimeString());
    setSaveCount(prev => prev + 1);
    if (msg) {
      setSaveToast(msg);
      setTimeout(() => setSaveToast(""), 2500);
    }
  }, []);

  // --- CONSOLIDATED STORAGE: single key to avoid rate limiting ---
  const saveTimer = useRef(null);
  const allDataRef = useRef({});
  const savePending = useRef(false);
  const loadComplete = useRef(false); // Guard: prevents saves before data loads

  // Debounced single-key save: coalesces all changes into one write
  const flushSave = useCallback(async () => {
    savePending.current = false;
    // CRITICAL GUARD: Never save before load completes - would wipe real data with empty {}
    if (!loadComplete.current || !allDataRef.current._migrationComplete) {
      console.warn("SAVE BLOCKED - load not complete yet");
      return;
    }
    allDataRef.current._saveTimestamp = Date.now();
    setSaving(true);
    var ok = false;
    for (var attempt = 0; attempt < 3 && !ok; attempt++) {
      try {
        var result = await window.storage.set("tb-alldata-v1", JSON.stringify(allDataRef.current));
        if (result) ok = true; else await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
      } catch (e) {
        await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
      }
    }
    setSaving(false);
    if (ok) {
      flashSave("OK Saved");
      setStorageDiag("Saved at " + new Date().toLocaleTimeString());
      // BACKUP: Also write to localStorage in case window.storage fails on next load
      try { localStorage.setItem("tb-alldata-backup-v1", JSON.stringify(allDataRef.current)); } catch(e) {}
    } else {
      flashSave("WARN Save FAILED");
      setStorageDiag("SAVE FAILED at " + new Date().toLocaleTimeString());
      // Even if window.storage fails, try localStorage as emergency backup
      try { localStorage.setItem("tb-alldata-backup-v1", JSON.stringify(allDataRef.current)); } catch(e) {}
    }
  }, [flashSave]);

  const scheduleSave = useCallback(() => {
    savePending.current = true;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flushSave, 500);
  }, [flushSave]);

  // Update a field in allDataRef and schedule save
  const persistField = useCallback((field, value) => {
    allDataRef.current[field] = value;
    allDataRef.current._saveTimestamp = Date.now();
    // IMMEDIATE sync backup to localStorage on every change (sync = guaranteed)
    try { localStorage.setItem("tb-alldata-backup-v1", JSON.stringify(allDataRef.current)); } catch(e) {}
    scheduleSave();
  }, [scheduleSave]);

  // Changelog helper - logs an entry and persists via consolidated storage
  const logChange = useCallback((cardId, changeType, field, oldVal, newVal) => {
    var card = ALL_CARDS[cardId - 1];
    var now = new Date().toISOString();
    var label = card ? ("#" + card.cardNumber + " " + (card.cardSet || "Base") + " - " + card.product) : ("Card #" + cardId);
    var sid = sessionId.current;
    setChangelog(prev => {
      if (prev.length > 0 && prev[0].cardId === cardId && prev[0].field === field) {
        var elapsed = new Date(now) - new Date(prev[0].ts);
        if (elapsed < 10000) {
          var updated = [{ ...prev[0], ts: now, to: newVal || "" }, ...prev.slice(1)].slice(0, 500);
          persistField("changelog", updated);
          return updated;
        }
      }
      var entry = { ts: now, cardId: cardId, cardLabel: label, type: changeType, field: field, from: oldVal || "", to: newVal || "", sid: sid };
      var next = [entry, ...prev].slice(0, 500);
      persistField("changelog", next);
      return next;
    });
  }, [persistField]);

  useEffect(() => {
    async function load() {
      if (window.storageReady) { try { await window.storageReady; } catch(e) {} }
      let diagParts = [];
      let allData = null;
      // Try consolidated key first (single read)
      try {
        var result = await window.storage.get("tb-alldata-v1");
        if (result && result.value) {
          allData = JSON.parse(result.value);
          diagParts.push("Loaded consolidated data");
        }
      } catch (e) {
        diagParts.push("Consolidated read error: " + e.message);
      }
      // ALWAYS check localStorage backup and compare timestamps - use whichever is newer
      var lsData = null;
      try {
        var lsBackup = localStorage.getItem("tb-alldata-backup-v1");
        if (lsBackup) { lsData = JSON.parse(lsBackup); }
      } catch(e2) {}
      if (allData && lsData) {
        var wsTs = allData._saveTimestamp || 0;
        var lsTs = lsData._saveTimestamp || 0;
        if (lsTs > wsTs) {
          diagParts.push("localStorage backup NEWER (" + new Date(lsTs).toLocaleTimeString() + " vs " + new Date(wsTs).toLocaleTimeString() + ") - using localStorage");
          allData = lsData;
        } else {
          diagParts.push("window.storage is current");
        }
      } else if (!allData && lsData) {
        allData = lsData;
        diagParts.push("Restored from localStorage backup");
      }
      // FALLBACK: If window.storage returned nothing, try localStorage backup
      if (!allData) {
        try {
          var lsBackup = localStorage.getItem("tb-alldata-backup-v1");
          if (lsBackup) {
            allData = JSON.parse(lsBackup);
            diagParts.push("Restored from localStorage backup");
          }
        } catch(e2) { diagParts.push("localStorage backup read error: " + e2.message); }
      }
      // FALLBACK: If window.storage returned nothing, try localStorage backup
      if (!allData) {
        try {
          var lsBackup = localStorage.getItem("tb-alldata-backup-v1");
          if (lsBackup) {
            allData = JSON.parse(lsBackup);
            diagParts.push("Restored from localStorage backup");
          }
        } catch(e2) { diagParts.push("localStorage backup read error: " + e2.message); }
      }
      // FALLBACK: If window.storage returned nothing, try localStorage backup
      if (!allData) {
        try {
          var lsBackup = localStorage.getItem("tb-alldata-backup-v1");
          if (lsBackup) {
            allData = JSON.parse(lsBackup);
            diagParts.push("Restored from localStorage backup");
          }
        } catch(e2) { diagParts.push("localStorage backup read error: " + e2.message); }
      }
      // If no consolidated data, or consolidated data is missing the migration flag
      // (meaning a broken build may have written partial data), try legacy keys
      if (!allData || !allData._migrationComplete) {
        if (!allData) allData = {};
        var legacyKeys = [
          ["tb-statuses-v2", "statuses"],
          ["tb-details-v2", "details"],
          ["tb-forsale-v2", "forsale"],
          ["tb-synced-v2", "synced"],
          ["tb-dirty-v2", "dirty"],
          ["tb-changelog-v1", "changelog"]
        ];
        var migratedCount = 0;
        for (var ki = 0; ki < legacyKeys.length; ki++) {
          // Skip if consolidated already has non-empty data for this field
          var existingVal = allData[legacyKeys[ki][1]];
          var hasData = existingVal && ((Array.isArray(existingVal) && existingVal.length > 0) || (typeof existingVal === "object" && !Array.isArray(existingVal) && Object.keys(existingVal).length > 0));
          if (hasData) continue;
          try {
            if (ki > 0 || !allData._migrationComplete) await new Promise(function(r) { setTimeout(r, 400); });
            var lkResult = await window.storage.get(legacyKeys[ki][0]);
            if (lkResult && lkResult.value) {
              allData[legacyKeys[ki][1]] = JSON.parse(lkResult.value);
              migratedCount++;
            }
          } catch (e) { /* key does not exist yet - that is fine */ }
        }
        allData._migrationComplete = true;
        if (migratedCount > 0) {
          diagParts.push("Migrated " + migratedCount + " legacy keys");
          // Save consolidated immediately so migration only happens once
          try {
            await window.storage.set("tb-alldata-v1", JSON.stringify(allData));
            diagParts.push("Migration saved");
          } catch (e) { diagParts.push("Migration save failed: " + e.message); }
        } else if (Object.keys(allData.statuses || {}).length === 0) {
          diagParts.push("Fresh start");
        }
      }
      // Extract fields from consolidated data
      var stored = allData.statuses || {};
      var details = allData.details || {};
      var fsFlags = allData.forsale || {};
      var syncedArr = allData.synced || [];
      var dirtyArr = allData.dirty || [];
      var checkpoint = allData.checkpoint || null;
      var changelogArr = allData.changelog || [];
      // Build statuses
      const merged = { ...stored };
      PRESET_OWNED.forEach(id => { if (!merged[id]) merged[id] = "owned"; });
      PRESET_INTRANSIT.forEach(id => { if (!merged[id]) merged[id] = "in_transit"; });
      // Migrate old for_sale statuses
      Object.entries(merged).forEach(([id, s]) => {
        if (s === "for_sale") { merged[id] = "owned"; fsFlags[id] = true; }
      });
      setForSaleFlags(fsFlags);
      setStatuses(merged);
      // Build details from presets + user edits
      const mergedDetails = {};
      Object.entries(PRESET_DETAILS).forEach(([id, d]) => {
        mergedDetails[id] = {};
        if (d.s) mergedDetails[id].serial = d.s;
        if (d.p) mergedDetails[id].price = d.p;
        if (d.d) mergedDetails[id].date = d.d;
        if (d.n) mergedDetails[id].notes = d.n;
        if (d.pr) mergedDetails[id].printRun = d.pr;
      });
      Object.entries(details).forEach(([id, d]) => {
        mergedDetails[id] = { ...(mergedDetails[id] || {}), ...d };
      });
      // Initialize qty from duplicate copy data
      Object.entries(DUPE_QTY_INIT).forEach(function([id, extraQty]) {
        if (!mergedDetails[id]) mergedDetails[id] = {};
        if (!mergedDetails[id].qty) mergedDetails[id].qty = String(1 + extraQty);
      });
      setCardDetails(mergedDetails);
      setSyncedIds(new Set(syncedArr));
      setDirtyIds(new Set(dirtyArr));
      if (checkpoint) setLastCheckpoint(checkpoint);
      setChangelog(changelogArr);
      // Load TCDB fixes and flags (separate small storage)
      try {
        var tcdbFixesResult = await window.storage.get("tb-tcdb-fixes-v1");
        if (tcdbFixesResult && tcdbFixesResult.value) setTcdbFixes(JSON.parse(tcdbFixesResult.value));
      } catch(e) {}
      try {
        var tcdbFlagsResult = await window.storage.get("tb-tcdb-flags-v1");
        if (tcdbFlagsResult && tcdbFlagsResult.value) setTcdbFlags(JSON.parse(tcdbFlagsResult.value));
      } catch(e) {}
      // Store initial state for undo-all
      sessionInitial.current = { statuses: { ...merged }, cardDetails: JSON.parse(JSON.stringify(mergedDetails)), forSaleFlags: { ...fsFlags }, dirtyIds: new Set(dirtyArr) };
      // Populate allDataRef with current state for future saves
      allDataRef.current = {
        statuses: merged,
        details: details,
        forsale: fsFlags,
        synced: syncedArr,
        dirty: dirtyArr,
        checkpoint: checkpoint,
        changelog: changelogArr,
        _migrationComplete: true
      };
      loadComplete.current = true; // Now safe to save
      var statusCount = Object.keys(merged).filter(function(k) { return merged[k] !== "not_owned"; }).length;
      diagParts.push(statusCount + " tracked cards");
      setLoading(false);
      setStorageDiag(diagParts.join(" | "));
    }
    load();
  }, []);
  const saveStatuses = useCallback(async (newStatuses) => {
    persistField("statuses", newStatuses);
  }, [persistField]);
  const saveDetails = useCallback(async (newDetails) => {
    // Only persist user edits that differ from PRESET_DETAILS
    var userEdits = {};
    Object.entries(newDetails).forEach(([id, d]) => {
      var preset = PRESET_DETAILS[id];
      var diff = {};
      if (d.serial && (!preset || d.serial !== preset.s)) diff.serial = d.serial;
      if (d.price && (!preset || d.price !== preset.p)) diff.price = d.price;
      if (d.date && (!preset || d.date !== preset.d)) diff.date = d.date;
      if (d.notes && (!preset || d.notes !== preset.n)) diff.notes = d.notes;
      if (d.printRun && (!preset || d.printRun !== preset.pr)) diff.printRun = d.printRun;
      if (Object.keys(diff).length > 0) userEdits[id] = diff;
    });
    persistField("details", userEdits);
    flashSave("");
  }, [persistField, flashSave]);
  const markSynced = useCallback(async (cardId) => {
    setSyncedIds(prev => {
      const next = new Set(prev);
      next.add(cardId);
      persistField("synced", [...next]);
      return next;
    });
    setDirtyIds(prev => {
      if (!prev.has(cardId)) return prev;
      const next = new Set(prev); next.delete(cardId);
      persistField("dirty", [...next]);
      return next;
    });
  }, [persistField]);
  const unmarkSynced = useCallback(async (cardId) => {
    setSyncedIds(prev => {
      const next = new Set(prev);
      next.delete(cardId);
      persistField("synced", [...next]);
      return next;
    });
  }, [persistField]);
  const markAllSynced = useCallback(async () => {
    setSyncedIds(prev => {
      const next = new Set(prev);
      dirtyIds.forEach(id => next.add(id));
      NOT_SYNCED.forEach(id => next.add(id));
      persistField("synced", [...next]);
      return next;
    });
    setDirtyIds(prev => {
      persistField("dirty", []);
      return new Set();
    });
  }, [persistField, dirtyIds]);
  const needsSync = useMemo(() => {
    var ids = new Set([...NOT_SYNCED].filter(id => !syncedIds.has(id) && !NOT_ON_TCDB.has(id) && !MISSING_FROM_TCDB.has(id)));
    dirtyIds.forEach(function(id) { if (!syncedIds.has(id) && !NOT_ON_TCDB.has(id) && !MISSING_FROM_TCDB.has(id)) ids.add(id); });
    return ids;
  }, [syncedIds, dirtyIds]);
  const unsyncedCards = useMemo(() => {
    return [...needsSync].map(function(id) { return ALL_CARDS.find(function(c) { return c.id === id; }); }).filter(Boolean);
  }, [needsSync]);
  const touchupCards = useMemo(() => {
    return ALL_CARDS.filter(c => {
      if (needsSync.has(c.id)) return false;
      var d = cardDetails[c.id];
      if (!d) return false;
      var hasDetail = d.serial || d.price || d.date || d.notes || d.printRun;
      if (!hasDetail) return false;
      var s = statuses[c.id] || "not_owned";
      return s === "owned" || s === "in_transit";
    });
  }, [needsSync, cardDetails, statuses]);
  const issueCounts = useMemo(() => {
    var counts = { missing_serial: 0, missing_price: 0, missing_date: 0, flagged_notes: 0, ebay_mislog: 0, not_on_tcdb: 0, missing_from_tcdb: 0, extra_duplicate: 0, total: 0 };
    ALL_CARDS.forEach(function(card) {
      var s = statuses[card.id] || "not_owned";
      if (NOT_ON_TCDB.has(card.id)) { counts.not_on_tcdb++; counts.total++; return; }
      if (MISSING_FROM_TCDB.has(card.id)) { counts.missing_from_tcdb++; counts.total++; return; }
      if (EXTRA_DUPES.has(card.id)) { counts.extra_duplicate++; counts.total++; return; }
      if (s !== "owned" && s !== "in_transit") {
        if (EBAY_IDS.has(card.id)) { counts.ebay_mislog++; counts.total++; }
        return;
      }
      var d = cardDetails[card.id] || {};
      var hasIssue = false;
      var effCopies = getEffCopies(card, {[card.id]: d});
      var cardIsSN = card.copies || d.printRun === "?";
      if (cardIsSN && !d.serial) { counts.missing_serial++; hasIssue = true; }
      if (!d.price) { counts.missing_price++; hasIssue = true; }
      if (!d.date) { counts.missing_date++; hasIssue = true; }
      if (d.notes && /\?|check|verify|confirm|wrong|fix|unsure/i.test(d.notes)) { counts.flagged_notes++; hasIssue = true; }
      if (EBAY_IDS.has(card.id)) {
        var hasMulti = MULTI_EBAY.has(card.id);
        var hasCOMCMulti = d.notes && /\+\d+ more cop/i.test(d.notes);
        if (hasMulti || hasCOMCMulti) { counts.ebay_mislog++; hasIssue = true; }
      }
      if (hasIssue) counts.total++;
    });
    return counts;
  }, [statuses, cardDetails]);
  // --- Undo system ---
  const pushUndo = useCallback((entry) => {
    undoStack.current.push(entry);
    setUndoLen(undoStack.current.length);
  }, []);
  const undoLast = useCallback(() => {
    if (undoStack.current.length === 0) return;
    var entry = undoStack.current.pop();
    setUndoLen(undoStack.current.length);
    if (entry.type === "status") {
      setStatuses(prev => {
        var next = { ...prev, [entry.cardId]: entry.prev };
        saveStatuses(next);
        return next;
      });
      if (entry.prev === "not_owned") {
        setDirtyIds(prev => {
          if (!prev.has(entry.cardId)) return prev;
          var next = new Set(prev); next.delete(entry.cardId);
          persistField("dirty", [...next]);
          return next;
        });
      }
    } else if (entry.type === "detail") {
      setCardDetails(prev => {
        var next = { ...prev, [entry.cardId]: { ...(prev[entry.cardId] || {}), [entry.field]: entry.prev } };
        if (entry.prev === undefined || entry.prev === "") {
          var cleaned = { ...next[entry.cardId] };
          delete cleaned[entry.field];
          next[entry.cardId] = cleaned;
        }
        saveDetails(next);
        return next;
      });
    } else if (entry.type === "forsale") {
      setForSaleFlags(prev => {
        var next = { ...prev };
        if (entry.prev) next[entry.cardId] = true; else delete next[entry.cardId];
        persistField("forsale", next);
        return next;
      });
    }
    var field = entry.type === "status" ? "status" : entry.type === "forsale" ? "for_sale" : entry.field;
    setChangelog(prev => {
      var idx = prev.findIndex(function(e) { return e.cardId === entry.cardId && e.field === field; });
      if (idx === -1) return prev;
      var next = prev.slice(0, idx).concat(prev.slice(idx + 1));
      persistField("changelog", next);
      return next;
    });
    setSessionChanges(prev => Math.max(0, prev - 1));
  }, [saveStatuses, saveDetails, persistField]);
  const undoAllSession = useCallback(() => {
    if (!sessionInitial.current) return;
    var init = sessionInitial.current;
    setStatuses(init.statuses);
    setCardDetails(init.cardDetails);
    setForSaleFlags(init.forSaleFlags);
    saveStatuses(init.statuses);
    saveDetails(init.cardDetails);
    persistField("forsale", init.forSaleFlags);
    if (init.dirtyIds) {
      setDirtyIds(init.dirtyIds);
      persistField("dirty", [...init.dirtyIds]);
    }
    undoStack.current = [];
    setUndoLen(0);
    setSessionChanges(0);
    var sid = sessionId.current;
    setChangelog(prev => {
      var next = prev.filter(function(e) { return e.sid !== sid; });
      persistField("changelog", next);
      return next;
    });
  }, [saveStatuses, saveDetails, persistField]);
  const updateCardDetail = useCallback((cardId, field, value) => {
    if (window.trackerAuth && !window.trackerAuth.isOwner()) return; // Read-only for visitors
    setSessionChanges(prev => prev + 1);
    setCardDetails(prev => {
      var oldVal = (prev[cardId] || {})[field] || "";
      pushUndo({ type: "detail", cardId: cardId, field: field, prev: oldVal });
      if (value !== oldVal) logChange(cardId, "detail", field, oldVal, value);
      const updated = { ...prev, [cardId]: { ...(prev[cardId] || {}), [field]: value } };
      saveDetails(updated);
      return updated;
    });
    setDirtyIds(prev => {
      if (prev.has(cardId)) return prev;
      const next = new Set(prev); next.add(cardId);
      persistField("dirty", [...next]);
      return next;
    });
  }, [saveDetails, pushUndo, logChange, persistField]);
  const setCardStatus = useCallback((cardId, status) => {
    if (window.trackerAuth && !window.trackerAuth.isOwner()) return; // Read-only for visitors
    setSessionChanges(prev => prev + 1);
    setStatuses(prev => {
      const prevStatus = prev[cardId] || "not_owned";
      pushUndo({ type: "status", cardId: cardId, prev: prevStatus });
      if (status !== prevStatus) logChange(cardId, "status", "status", prevStatus, status);
      const next = { ...prev, [cardId]: status };
      saveStatuses(next);
      if ((status === "owned" || status === "in_transit") && prevStatus === "not_owned") {
        setDirtyIds(dp => {
          if (dp.has(cardId)) return dp;
          const nd = new Set(dp); nd.add(cardId);
          persistField("dirty", [...nd]);
          return nd;
        });
      }
      return next;
    });
  }, [saveStatuses, pushUndo, logChange, persistField]);
  const toggleStatus = useCallback((cardId) => {
    setSessionChanges(prev => prev + 1);
    setStatuses(prev => {
      const current = prev[cardId] || "not_owned";
      pushUndo({ type: "status", cardId: cardId, prev: current });
      const order = ["not_owned", "owned", "in_transit"];
      const next = order[(order.indexOf(current) + 1) % order.length];
      logChange(cardId, "status", "status", current, next);
      const updated = { ...prev, [cardId]: next };
      saveStatuses(updated);
      if ((next === "owned" || next === "in_transit") && current === "not_owned") {
        setDirtyIds(dp => {
          if (dp.has(cardId)) return dp;
          const nd = new Set(dp); nd.add(cardId);
          persistField("dirty", [...nd]);
          return nd;
        });
      }
      return updated;
    });
  }, [saveStatuses, pushUndo, logChange, persistField]);
  const toggleForSale = useCallback((cardId) => {
    if (window.trackerAuth && !window.trackerAuth.isOwner()) return; // Read-only for visitors
    setSessionChanges(prev => prev + 1);
    setForSaleFlags(prev => {
      var wasFlagged = !!prev[cardId];
      pushUndo({ type: "forsale", cardId: cardId, prev: wasFlagged });
      logChange(cardId, "forsale", "for_sale", wasFlagged ? "Yes" : "No", wasFlagged ? "No" : "Yes");
      const next = { ...prev };
      if (next[cardId]) delete next[cardId]; else next[cardId] = true;
      persistField("forsale", next);
      return next;
    });
  }, [pushUndo, logChange, persistField]);
  const stats = useMemo(() => {
    let owned = 0, inTransit = 0, forSale = 0, notOwned = 0, owned1of1 = 0, total1of1 = 0, totalSpent = 0;
    var visibleTotal = 0;
    ALL_CARDS.forEach(card => {
      if (HIDDEN_DUPES.has(card.id)) return;
      if (card.product.startsWith("TEST")) return;
      visibleTotal++;
      const s = statuses[card.id] || "not_owned";
      const d = cardDetails[card.id] || {};
      const is1of1 = card.copies === "1" && !NOT_ON_TCDB.has(card.id) && !HIDDEN_DUPES.has(card.id) && !MISSING_FROM_TCDB.has(card.id);
      if (is1of1) total1of1++;
      if (s === "owned") {
        owned++;
        if (is1of1) owned1of1++;
      }
      else if (s === "in_transit") {
        inTransit++;
        if (is1of1) owned1of1++;
      }
      else {
        notOwned++;
      }
      var qty = parseInt(d.qty) || 1;
      if (qty > 1 && (s === "owned" || s === "in_transit")) forSale++;
      if (forSaleFlags[card.id] && (s === "owned" || s === "in_transit") && qty <= 1) forSale++;
      if ((s === "owned" || s === "in_transit") && d.price) {
        var pv = parseFloat(String(d.price).replace(/^\$/, "")) || 0;
        if (pv > 0) totalSpent += pv;
      }
    });
    const dupeTransit = DUPES.filter(d => d.type === "intransit").length;
    const dupeSale = DUPES.filter(d => d.type === "forsale").length;
    const dupeComc = DUPES.filter(d => d.type === "comc").length;
    const notSynced = needsSync.size;
    const notOwned1of1 = total1of1 - owned1of1;
    return { total: visibleTotal, owned, inTransit, notOwned, owned1of1, total1of1, notOwned1of1, forSale, dupeTransit, dupeSale, dupeComc, notSynced, totalSpent };
  }, [statuses, cardDetails, forSaleFlags]);
  const years = useMemo(() => [...new Set(ALL_CARDS.map(c => c.product.match(/^\d{4}/)?.[0]).filter(Boolean))].sort(), []);
  const cardNumbers = useMemo(() => {
    var nums = [...new Set(ALL_CARDS.map(c => c.cardNumber))];
    nums.sort((a, b) => { var an = parseInt(a), bn = parseInt(b); if (!isNaN(an) && !isNaN(bn)) return an - bn; return a.localeCompare(b); });
    return nums;
  }, []);
  const filteredProducts = useMemo(() => {
    let cards = ALL_CARDS;
    if (filterYear !== "all") cards = cards.filter(c => c.product.startsWith(filterYear));
    return [...new Set(cards.map(c => c.product))].sort();
  }, [filterYear]);
  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    const cn = filterCardNum;
    return ALL_CARDS.filter(card => {
      if (HIDDEN_DUPES.has(card.id)) return false;
      const cardStatus = statuses[card.id] || "not_owned";
      if (filterYear !== "all" && !card.product.startsWith(filterYear)) return false;
      if (filterProduct !== "all" && card.product !== filterProduct) return false;
      if (cn && card.cardNumber !== cn) return false;
      if (filterStatus === "acquired" && cardStatus !== "owned" && cardStatus !== "in_transit") return false;
      else if (filterStatus === "for_sale") { var qtyVal = parseInt((cardDetails[card.id] || {}).qty) || 1; if (!(forSaleFlags[card.id] || qtyVal > 1) || (cardStatus !== "owned" && cardStatus !== "in_transit")) return false; }
      else if (filterStatus !== "all" && filterStatus !== "acquired" && cardStatus !== filterStatus) return false;
      if (s === "tcdb:flagged") { if (!tcdbFlags[card.id]) return false; }
      else if (s === "tcdb:fixed") { if (!tcdbFixes[card.id]) return false; }
      else if (s === "tcdb:nolink") { if (TCDB_LINKS[card.id] || tcdbFixes[card.id]) return false; }
      else if (s && !card.product.toLowerCase().includes(s) && !card.cardSet.toLowerCase().includes(s) && !card.cardNumber.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [statuses, forSaleFlags, tcdbFlags, tcdbFixes, filterYear, filterProduct, filterCardNum, filterStatus, search]);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageCards = filtered.slice(page * pageSize, (page + 1) * pageSize);
  useEffect(() => { setPage(0); }, [filterYear, filterProduct, filterCardNum, filterStatus, search, pageSize]);
  useEffect(() => { if (filterProduct !== "all" && !filteredProducts.includes(filterProduct)) setFilterProduct("all"); }, [filterYear]);
  // Reset focus when page/filters change
  useEffect(function() { setFocusIdx(-1); }, [page, filterYear, filterProduct, filterCardNum, filterStatus, search, pageSize]);
  useEffect(function() { if (!storageDiag) return; var t = setTimeout(function() { setStorageDiag(""); }, 5000); return function() { clearTimeout(t); }; }, [storageDiag]);
  // Auto-scroll focused card into view
  useEffect(function() {
    if (focusIdx < 0 || activeTab !== "collection") return;
    var el = document.querySelector("[data-focus-idx='" + focusIdx + "']");
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [focusIdx, activeTab]);
  // Keyboard shortcuts
  useEffect(function() {
    function handler(e) {
      var tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target.isContentEditable) {
        if (e.key === "Escape") { e.target.blur(); return; }
        return;
      }
      if (e.key === "?") { e.preventDefault(); setShowKbHelp(function(p) { return !p; }); return; }
      if (e.key === "Escape") { if (showKbHelp) { setShowKbHelp(false); } else { setFocusIdx(-1); setExpandedCard(null); } return; }
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        var tabKeys = {"1":"collection","2":"lookup","3":"detailed","4":"summary","5":"comc_scanner","6":"sync","7":"cleanup","8":"changelog","9":"board","0":"save"};
        if (tabKeys[e.key]) { e.preventDefault(); setActiveTab(tabKeys[e.key]); return; }
      }
      if (activeTab === "collection" && pageCards.length > 0) {
        var maxIdx = pageCards.length - 1;
        if (e.key === "j" || e.key === "ArrowDown") { e.preventDefault(); setFocusIdx(function(p) { return Math.min(maxIdx, p + 1); }); return; }
        if (e.key === "k" || e.key === "ArrowUp") { e.preventDefault(); setFocusIdx(function(p) { return Math.max(0, p - 1); }); return; }
        if (e.key === "[") { e.preventDefault(); setPage(function(p) { return Math.max(0, p - 1); }); return; }
        if (e.key === "]") { e.preventDefault(); setPage(function(p) { return Math.min(totalPages - 1, p + 1); }); return; }
        if (focusIdx >= 0 && focusIdx <= maxIdx) {
          var focusedCard = pageCards[focusIdx];
          if (e.key === "o") { e.preventDefault(); setCardStatus(focusedCard.id, "owned"); return; }
          if (e.key === "i") { e.preventDefault(); setCardStatus(focusedCard.id, "in_transit"); return; }
          if (e.key === "n") { e.preventDefault(); setCardStatus(focusedCard.id, "not_owned"); return; }
          if (e.key === "s") { e.preventDefault(); setCardStatus(focusedCard.id, "for_sale"); return; }
          if (e.key === "f") { e.preventDefault(); toggleForSale(focusedCard.id); return; }
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpandedCard(function(p) { return p === focusedCard.id ? null : focusedCard.id; }); return; }
          if (e.key === "e") { e.preventDefault(); if (superSearchMode) { ebayUrlsSuper(focusedCard).forEach(function(u) { window.open(u, "_blank"); }); } else { window.open(ebayUrl(focusedCard), "_blank"); } return; }
        }
      }
    }
    window.addEventListener("keydown", handler);
    return function() { window.removeEventListener("keydown", handler); };
  }, [activeTab, pageCards, focusIdx, showKbHelp, totalPages, page, setCardStatus, toggleForSale, superSearchMode]);
  function handleEbayClick(card, e) {
    if (e) e.preventDefault();
    if (superSearchMode) {
      var urls = ebayUrlsSuper(card);
      urls.forEach(function(url) { window.open(url, "_blank"); });
    } else {
      window.open(ebayUrl(card), "_blank");
    }
  }
  if (loading) return <div className="h-screen bg-gray-950 text-white flex items-center justify-center"><div className="text-lg font-light tracking-wide text-gray-400">Loading collection...</div></div>;
  const pct = stats.total ? (stats.owned / stats.total * 100).toFixed(1) : 0;
  const pctWithTransit = stats.total ? ((stats.owned + stats.inTransit) / stats.total * 100).toFixed(1) : 0;
  const acquired = stats.owned + stats.inTransit;
  const needRegular = stats.notOwned - stats.notOwned1of1;
  const TABS = [
    {id:"collection",label:"Collection",color:"yellow",ownerOnly:true},
    {id:"lookup",label:"Lookup",color:"purple"},
    {id:"detailed",label:"Detailed",color:"emerald"},
    {id:"summary",label:"Summary",color:"cyan"},
    {id:"comc_scanner",label:"Scanner",color:"orange",ownerOnly:true},
    {id:"targets",label:"Targets",color:"pink",badge:Object.keys(loadTargets()).length,ownerOnly:true},
    {id:"prices",label:"Prices",color:"indigo",badge:Object.keys(loadPriceHistory()).length,ownerOnly:true},
    {id:"sync",label:"Sync",color:"orange",badge:unsyncedCards.length,ownerOnly:true},
    {id:"cleanup",label:"Cleanup",color:"amber",badge:issueCounts.total,ownerOnly:true},
    {id:"changelog",label:"Log",color:"rose",ownerOnly:true},
    {id:"versions",label:"Versions",color:"indigo",ownerOnly:true},
    {id:"board",label:"Board",color:"blue",ownerOnly:true},
    {id:"save",label:"Export",color:"emerald",ownerOnly:true},
  ].filter(function(t) { return !t.ownerOnly || isOwner; });
  const tabColorMap = {yellow:"border-yellow-400 text-yellow-300",cyan:"border-yellow-400 text-yellow-300",teal:"border-yellow-400 text-yellow-300",purple:"border-yellow-400 text-yellow-300",orange:"border-yellow-400 text-yellow-300",emerald:"border-yellow-400 text-yellow-300",amber:"border-yellow-400 text-yellow-300",rose:"border-yellow-400 text-yellow-300",indigo:"border-yellow-400 text-yellow-300",blue:"border-yellow-400 text-yellow-300",pink:"border-yellow-400 text-yellow-300",lime:"border-yellow-400 text-yellow-300"};
  const badgeActiveMap = {orange:"bg-orange-400 text-gray-900",amber:"bg-amber-400 text-gray-900",emerald:"bg-emerald-400 text-gray-900",indigo:"bg-indigo-400 text-gray-900"};
  const badgeInactiveMap = {orange:"bg-orange-900 text-orange-300",amber:"bg-amber-900 text-amber-300",emerald:"bg-emerald-900 text-emerald-300",indigo:"bg-indigo-900 text-indigo-300"};
  return (
    <div className="h-screen text-white flex flex-col overflow-hidden" style={{background:"#0a1628",fontSize:"clamp(10px,1.4vw,13px)",letterSpacing:"-0.01em"}}>
      {/* STICKY HEADER */}
      <div className="flex-shrink-0 backdrop-blur-sm border-b z-30" style={{background:"rgba(10,22,40,0.97)",borderColor:"#1a2d4a",padding:"clamp(2px,0.3vw,4px) clamp(4px,0.6vw,12px)"}}>
        <div className="flex items-center gap-1.5">
          <span className="font-black tracking-tight whitespace-nowrap" style={{color:"#FFC52F",fontSize:"clamp(13px,1.8vw,18px)"}}>TYLER BLACK</span>
          <div className="flex-1 rounded-full h-1.5 overflow-hidden min-w-8 max-w-24" style={{background:"#1a2d4a"}}>
            <div className="h-full flex">
              <button 
                onClick={function() { setActiveTab("detailed"); setDetailedStatusFilter("owned"); setDetailedSnFilter(null); }}
                className="transition-all cursor-pointer"
                style={{width: pct + "%", background:"#22c55e"}}
                title="Click to view owned cards"
              />
              <button 
                onClick={function() { setActiveTab("detailed"); setDetailedStatusFilter("in_transit"); setDetailedSnFilter(null); }}
                className="transition-all cursor-pointer"
                style={{width: (pctWithTransit - pct) + "%", background:"#86efac"}}
                title="Click to view in-transit cards"
              />
              <button 
                onClick={function() { setActiveTab("detailed"); setDetailedStatusFilter("not_owned"); setDetailedSnFilter("not_1of1"); }}
                className="transition-all cursor-pointer"
                style={{width: (stats.total ? (needRegular / stats.total * 100) : 0) + "%", background:"rgba(220,80,80,0.5)"}}
                title="Click to view needed cards (non-1/1s)"
              />
              <button 
                onClick={function() { setActiveTab("detailed"); setDetailedStatusFilter("not_owned"); setDetailedSnFilter("1of1"); }}
                className="bg-red-300/40 transition-all hover:bg-red-300/60 cursor-pointer"
                style={{width: (stats.total ? (stats.notOwned1of1 / stats.total * 100) : 0) + "%"}}
                title="Click to view needed 1/1s"
              />
            </div>
          </div>
          <span className="font-bold whitespace-nowrap" style={{fontSize:"clamp(9px,1.1vw,11px)",color:"#22c55e"}}>{pctWithTransit}%</span>
          <span style={{color:"#2a3f5f"}}>|</span>
          <div className="flex items-center gap-1 flex-shrink-0" style={{fontSize:"clamp(9px,1.1vw,11px)"}}>
            <button 
              onClick={function() { setActiveTab("detailed"); setDetailedStatusFilter("acquired"); setDetailedSnFilter(null); }}
              className="hover:bg-gray-800/50 rounded px-1 -mx-1 transition-colors"
              title="Click to view owned + in-transit cards"
            >
              <span className="font-bold" style={{color:"#22c55e"}}>{acquired}</span><span style={{color:"#7a8ba8"}} className="ml-0.5">own</span>
            </button>
            <span style={{color:"#2a3f5f"}} className="mx-0.5">&middot;</span>
            <button 
              onClick={function() { setActiveTab("detailed"); setDetailedStatusFilter("not_owned"); setDetailedSnFilter(null); }}
              className="hover:bg-gray-800/50 rounded px-1 -mx-1 transition-colors"
              title="Click to view needed cards"
            >
              <span className="font-bold" style={{color:"#e06060"}}>{stats.notOwned}</span><span style={{color:"#7a8ba8"}} className="ml-0.5">need</span>{stats.notOwned1of1 > 0 && <span className="text-gray-600 ml-0.5" style={{fontSize:"clamp(7px,0.8vw,9px)"}}>({needRegular}+<span className="text-red-300">{stats.notOwned1of1}</span><span className="text-red-300/60"> 1/1</span>)</span>}
            </button>
          </div>
          <span style={{color:"#2a3f5f"}}>|</span>
          <button 
            onClick={function() { setActiveTab("detailed"); setDetailedSnFilter("1of1"); setDetailedStatusFilter("acquired"); }}
            className="flex items-center gap-1 flex-shrink-0 hover:bg-gray-800/50 rounded px-1 -mx-1 transition-colors"
            style={{fontSize:"clamp(9px,1.1vw,11px)"}}
            title="Click to view all 1/1s"
          >
            <span className="font-bold" style={{color:"#22c55e"}}>{stats.owned1of1}</span><span style={{color:"#7a8ba8"}} className="ml-0.5">1/1s</span>
          </button>
          {stats.totalSpent > 0 && !hidePrices && (<>
            <span style={{color:"#2a3f5f"}}>|</span>
            <span className="flex-shrink-0" style={{fontSize:"clamp(9px,1.1vw,11px)"}}>
              <span className="font-bold" style={{color:"#7dd87d"}}>${stats.totalSpent.toFixed(0)}</span><span style={{color:"#7a8ba8"}} className="ml-0.5">spent</span>
            </span>
          </>)}
          <span style={{color:"#2a3f5f"}}>|</span>
          <div className="flex items-center gap-1 flex-shrink-0">
            {undoLen > 0 && (
              <button onClick={undoLast} className="px-1.5 py-0 rounded transition-colors bg-gray-700 hover:bg-gray-600 text-gray-300" style={{fontSize:"clamp(8px,0.9vw,10px)"}}>{"\u21a9" + undoLen}</button>
            )}
            <span className={"w-1.5 h-1.5 rounded-full inline-block " + (lastSaveTime ? "bg-green-500" : "bg-gray-700")}></span>
            <span style={{color:"#2a3f5f"}} className="mx-1">|</span>
            <button 
              onClick={function() { setSuperSearchMode(!superSearchMode); }} 
              className={"px-2 py-0.5 rounded transition-colors font-bold " + (superSearchMode ? "bg-yellow-600 text-yellow-50 hover:bg-yellow-500" : "bg-gray-700 text-gray-400 hover:bg-gray-600")}
              style={{fontSize:"clamp(8px,0.9vw,10px)"}}
              title={superSearchMode ? "Super Search ON - eBay links open 5 search variations" : "Super Search OFF - eBay links open normal search"}
            >
              {superSearchMode ? "* SUPER" : "E"}
            </button>
            {isOwner && <button 
              onClick={function() { setHidePrices(!hidePrices); }} 
              className={"px-1 py-0 rounded transition-colors " + (hidePrices ? "text-gray-600 hover:text-gray-400" : "text-gray-500 hover:text-gray-300 bg-gray-700/50")}
              style={{fontSize:"clamp(7px,0.8vw,9px)"}}
              title={hidePrices ? "Prices hidden — click to show" : "Prices visible — click to hide"}
            >
              {"$"}
            </button>}
            <button 
              onClick={function() { setShowKbHelp(true); }} 
              className="px-1.5 py-0.5 rounded transition-colors bg-gray-800 text-gray-500 hover:text-white hover:bg-gray-700 font-bold"
              style={{fontSize:"clamp(8px,0.9vw,10px)"}}
              title="Keyboard shortcuts (?)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="8" x2="6" y2="8"/><line x1="10" y1="8" x2="10" y2="8"/><line x1="14" y1="8" x2="14" y2="8"/><line x1="18" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="6" y2="12"/><line x1="10" y1="12" x2="10" y2="12"/><line x1="14" y1="12" x2="14" y2="12"/><line x1="18" y1="12" x2="18" y2="12"/><line x1="8" y1="16" x2="16" y2="16"/></svg>
            </button>
          </div>
        </div>
        <div className="flex gap-0 mt-0.5 overflow-x-auto" style={{marginBottom:"-1px",scrollbarWidth:"none"}}>
          {TABS.map(function(t) {
            var active = activeTab === t.id;
            return (
              <button key={t.id} onClick={function(){ setActiveTab(t.id); }} className={"whitespace-nowrap border-b-2 font-medium transition-colors " + (active ? (tabColorMap[t.color] || "") : "border-transparent text-gray-400 hover:text-yellow-200")} style={{padding:"clamp(1px,0.2vw,3px) clamp(4px,0.7vw,10px)",fontSize:"clamp(9px,1.2vw,12px)"}}>
                {t.label}{t.badge > 0 ? <span className={"ml-1 px-1 rounded-full " + (active ? (badgeActiveMap[t.color] || "bg-gray-400 text-gray-900") : (badgeInactiveMap[t.color] || "bg-gray-700 text-gray-300"))} style={{fontSize:"clamp(8px,0.9vw,10px)"}}>{t.badge}</span> : null}
              </button>
            );
          })}
        </div>
      </div>
      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{padding:"clamp(2px,0.3vw,6px) clamp(4px,0.6vw,12px)"}}>
        {activeTab === "collection" ? (
        <div className="mx-auto flex-1 flex flex-col min-h-0 w-full" style={{maxWidth:"min(100%, 1800px)"}}>
        {/* COLLECTION TAB */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex gap-2" style={{fontSize:"clamp(8px,0.9vw,10px)"}}>
            <a href="https://www.tcdb.com/Person.cfm/pid/325590/Tyler-Black" target="_blank" rel="noopener noreferrer" style={{color:"#7abfff"}} className="hover:opacity-80">TCDB</a>
            <a href="https://www.tcdb.com/ViewCollectionP.cfm/pid/325590" target="_blank" rel="noopener noreferrer" style={{color:"#7abfff"}} className="hover:opacity-80">My Collection</a>
            <a href={COMC_PLAYER} target="_blank" rel="noopener noreferrer" style={{color:"#FFC52F"}} className="hover:opacity-80">COMC</a>
            <a href={SPORTLOTS_PLAYER} target="_blank" rel="noopener noreferrer" style={{color:"#5b9bd5"}} className="hover:opacity-80">SportLots</a>
            <a href={WHATNOT_SEARCH} target="_blank" rel="noopener noreferrer" style={{color:"#b8a0d8"}} className="hover:opacity-80">Whatnot</a>
          </div>
          {DUPES.length > 0 && (
            <button onClick={function(){setShowDupes(!showDupes);}} className="text-gray-500 hover:text-gray-300" style={{fontSize:"clamp(8px,0.9vw,10px)"}}>
              {showDupes ? "\u25BE" : "\u25B8"} {DUPES.length} dupes
            </button>
          )}
        </div>
        {showDupes && (
          <div className="mb-1 max-h-24 overflow-y-auto rounded bg-gray-900/50 border border-gray-800" style={{padding:"clamp(2px,0.3vw,4px)"}}>
            {DUPES.map(function(d, i) {
              var parent = ALL_CARDS[d.parent_id - 1];
              var isSale = d.type === "forsale";
              var isComc = d.type === "comc";
              return (
                <div key={"dupe-"+i} className="flex items-center gap-1 py-0.5 px-1" style={{fontSize:"clamp(8px,0.9vw,10px)"}}>
                  <span className={"font-bold " + (isSale ? "text-pink-400" : isComc ? "text-purple-400" : "text-blue-400")}>{isSale ? "FS" : isComc ? "CM" : "IT"}</span>
                  <span className="text-gray-400 truncate">{parent.product} #{parent.cardNumber} {parent.cardSet} {sspBadge(parent.cardSet)}</span>
                </div>
              );
            })}
          </div>
        )}
        {stats.notSynced > 0 && (
          <div className="bg-pink-950/40 border border-pink-900 rounded px-2 py-0.5 mb-1 text-pink-400 flex items-center justify-between" style={{fontSize:"clamp(8px,0.9vw,10px)"}}>
            <span>{"\u26A0"} {stats.notSynced} card{stats.notSynced > 1 ? "s" : ""} not synced to TCDB</span>
            <button onClick={function() { if (confirm("Mark all " + stats.notSynced + " cards as synced to TCDB?")) markAllSynced(); }} className="px-2 py-0 rounded bg-pink-900/50 hover:bg-pink-800/60 text-pink-300 border border-pink-800/40 ml-2 flex-shrink-0">Mark All Synced</button>
          </div>
        )}
        {/* Filters */}
        <div className="flex gap-1 mb-1 flex-wrap" style={{fontSize:"clamp(9px,1.1vw,11px)"}}>
          <select value={filterYear} onChange={function(e){setFilterYear(e.target.value);}} className="bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5">
            <option value="all">Year</option>
            {years.map(function(y){return <option key={y} value={y}>{y}</option>;})}
          </select>
          <select value={filterStatus} onChange={function(e){setFilterStatus(e.target.value);}} className="bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5">
            <option value="all">Status</option>
            <option value="acquired">Owned+Transit</option>
            {PRIMARY_STATUSES.map(function(k){return <option key={k} value={k}>{STATUS_CONFIG[k].label}</option>;})}
            <option value="for_sale">For Sale</option>
          </select>
          <select value={filterProduct} onChange={function(e){setFilterProduct(e.target.value);}} className="bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5 flex-1 min-w-0">
            <option value="all">Product ({filteredProducts.length})</option>
            {filteredProducts.map(function(p){return <option key={p} value={p}>{p}</option>;})}
          </select>
          <select value={filterCardNum} onChange={function(e){setFilterCardNum(e.target.value);}} className="bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5">
            <option value="">Card#</option>
            {cardNumbers.map(function(n){return <option key={n} value={n}>{n}</option>;})}
          </select>
          <input type="text" placeholder="Search..." value={search} onChange={function(e){setSearch(e.target.value);}} className="bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5 w-20" />
        </div>
        {/* Results toolbar */}
        <div className="flex items-center justify-between mb-0.5" style={{fontSize:"clamp(8px,0.9vw,10px)"}}>
          <span className="text-gray-500">{filtered.length} shown {saving && <span className="text-yellow-400 ml-1">saving...</span>}</span>
          <div className="flex gap-1">
            <button onClick={function(){ var urls = []; var seen = {}; filtered.slice(0, 30).forEach(function(c){ var u = tcdbUrl(c); if (u !== TCDB_PLAYER && !seen[u]) { seen[u] = true; urls.push(u); }}); urls.forEach(function(u){window.open(u, "_blank");}); }} className="px-1.5 py-0 bg-cyan-950/60 border border-cyan-800 text-cyan-400 rounded hover:bg-cyan-900/60">TCDB</button>
            <button onClick={function(){ if (superSearchMode) { filtered.slice(0, 30).forEach(function(c){ ebayUrlsSuper(c).forEach(function(url){ window.open(url, "_blank"); }); }); } else { filtered.slice(0, 30).forEach(function(c){window.open(ebayUrl(c), "_blank");}); } }} className="px-1.5 py-0 bg-yellow-950/60 border border-yellow-800 text-yellow-400 rounded hover:bg-yellow-900/60">eBay</button>
            <button onClick={function(){ var urls = []; var seen = {}; filtered.forEach(function(c){ var u = comcUrl(c); if (!seen[u]) { seen[u] = true; urls.push(u); }}); urls.slice(0, 30).forEach(function(u){window.open(u, "_blank");}); }} className="px-1.5 py-0 bg-orange-950/60 border border-orange-800 text-orange-400 rounded hover:bg-orange-900/60">COMC</button>
          </div>
        </div>
        {/* Card list - ultra dense */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-px">
          {pageCards.map(function(card) {
            var status = statuses[card.id] || "not_owned";
            var cfg = STATUS_CONFIG[status];
            var details = cardDetails[card.id] || {};
            var isExpanded = expandedCard === card.id;
            var rowBg = status === "owned" ? "bg-green-950/30 border-l-2 border-l-green-600" : status === "in_transit" ? "bg-emerald-950/30 border-l-2 border-l-emerald-400" : "bg-gray-900/40 border-l-2 border-l-gray-800";
            var isFocused = focusIdx === pageCards.indexOf(card);
            return (
              <div key={card.id} data-focus-idx={pageCards.indexOf(card)} className={"rounded-sm overflow-hidden " + rowBg + (isFocused ? " ring-1 ring-yellow-400/70 bg-yellow-950/20" : "")}>
                <div className="flex items-center gap-1 cursor-pointer" style={{padding:"clamp(1px,0.2vw,3px) clamp(3px,0.5vw,8px)"}} onClick={function(){setExpandedCard(isExpanded ? null : card.id);}}>
                  <div className={"w-1.5 h-1.5 rounded-full flex-shrink-0 " + cfg.dot} />
                  <div className="flex-1 min-w-0 flex items-baseline gap-1 truncate" style={{fontSize:"clamp(9px,1.2vw,12px)"}}>
                    <span className="font-semibold text-white whitespace-nowrap">#{card.cardNumber}</span>
                    <span className="text-gray-300 truncate">{card.cardSet}</span>
                    {sspBadge(card.cardSet)}
                    {(card.copies || (details.printRun && details.printRun !== "?")) ? <span className="text-yellow-400 font-black whitespace-nowrap" style={{fontSize:"clamp(9px,1vw,12px)"}}>/{details.printRun && details.printRun !== "?" ? details.printRun : card.copies}</span> : null}
                    {isMissingSN(card, cardDetails) && <span className="text-orange-400 font-bold text-[8px] whitespace-nowrap ml-0.5" title="SN but print run unknown">SN?</span>}
                    {details.serial ? <span className="text-yellow-300 font-black whitespace-nowrap" style={{fontSize:"clamp(9px,1vw,12px)"}}>{"#" + details.serial}</span> : null}
                    {needsSync.has(card.id) ? <span className="text-pink-500">!</span> : null}
                  </div>
                  <span className="text-gray-500 truncate hidden sm:inline flex-shrink min-w-0" style={{fontSize:"clamp(8px,0.9vw,10px)",maxWidth:"clamp(80px,12vw,200px)"}}>{card.product.slice(5)}</span>
                  <div className="flex gap-0.5 flex-shrink-0" onClick={function(e){e.stopPropagation();}}>
                    {PRIMARY_STATUSES.map(function(key) {
                      var c = STATUS_CONFIG[key];
                      return (
                      <button key={key} onClick={function(){setCardStatus(card.id, key);}}
                        title={c.label}
                        className={"rounded-full border flex items-center justify-center transition-all " + (status === key ? c.border + " " + c.bg : "border-gray-700 hover:border-gray-500")} style={{width:"clamp(16px,2.2vw,22px)",height:"clamp(16px,2.2vw,22px)"}}>
                        <div className={"rounded-full " + (status === key ? c.dot : "bg-gray-700")} style={{width:"clamp(6px,0.8vw,10px)",height:"clamp(6px,0.8vw,10px)"}} />
                      </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-1 flex-shrink-0" onClick={function(e){e.stopPropagation();}} style={{fontSize:"clamp(8px,1vw,11px)"}}>
                    <a href={tcdbUrl(card)} target="_blank" rel="noopener noreferrer" className={"font-bold hover:text-cyan-300 " + (tcdbFlags[card.id] ? "text-red-400" : tcdbFixes[card.id] ? "text-green-400" : "text-cyan-500")} title={tcdbFlags[card.id] ? "TCDB link flagged as bad" : tcdbFixes[card.id] ? "TCDB link user-corrected" : "TCDB"}>T</a>
                    <button onClick={function(){tcdbFlags[card.id] ? unflagTcdbLink(card.id) : flagTcdbLink(card.id);}} title={tcdbFlags[card.id] ? "Unflag TCDB link" : "Flag bad TCDB link"} className={"hover:text-red-300 " + (tcdbFlags[card.id] ? "text-red-500" : "text-gray-700 hover:text-red-400")} style={{fontSize:"clamp(7px,0.9vw,10px)"}}>⚑</button>
                    <a href="#" onClick={function(e) { handleEbayClick(card, e); }} className="font-bold text-yellow-500 hover:text-yellow-300">E</a>
                    <a href={comcUrl(card)} target="_blank" rel="noopener noreferrer" className="font-bold text-orange-500 hover:text-orange-300">C</a>
                    <a href={pt130Url(card)} target="_blank" rel="noopener noreferrer" className="font-bold text-teal-500 hover:text-teal-300" title="130point sold prices">P</a>
                  </div>
                  {(function() { var isFS = forSaleFlags[card.id] || (parseInt((cardDetails[card.id] || {}).qty) || 1) > 1; var s = statuses[card.id] || "not_owned"; var isAcq = s === "owned" || s === "in_transit"; return <button onClick={function(e){ e.stopPropagation(); var prodShort = card.product.replace(/^\d{4}\s*/, ""); setPricesSearchFilter(prodShort + " " + card.cardNumber); setActiveTab("prices"); }} title="View prices" className={"flex-shrink-0 rounded border font-bold flex items-center justify-center transition-all " + (isFS && isAcq ? "border-pink-600 bg-pink-950/40 text-pink-400" : "border-gray-800 text-gray-700 hover:border-gray-600 hover:text-gray-500")} style={{width:"clamp(14px,1.8vw,20px)",height:"clamp(14px,1.8vw,20px)",fontSize:"clamp(7px,0.9vw,10px)"}}>$</button>; })()}
                </div>
                {isExpanded && (
                  <div className="border-t border-gray-800 grid grid-cols-2 gap-1" style={{padding:"clamp(3px,0.4vw,6px) clamp(4px,0.6vw,10px)",fontSize:"clamp(9px,1.1vw,11px)"}} onClick={function(e){e.stopPropagation();}}>
                    <div>
                      <label className="text-yellow-500 font-black" style={{fontSize:"clamp(7px,0.8vw,9px)"}}>Serial # {isMissingSN(card, cardDetails) && <span className="text-orange-400">(SN?)</span>}</label>
                      {(card.copies || isMissingSN(card, cardDetails)) ? <input type="text" value={details.serial || ""} onChange={function(e){updateCardDetail(card.id, "serial", e.target.value);}} placeholder="e.g. 13/25" className="w-full bg-gray-950 border-2 border-yellow-700 rounded px-1.5 py-0.5 text-yellow-300 font-black focus:border-yellow-500 outline-none" /> : <span className="text-gray-700">N/A</span>}
                    </div>
                    <div>
                      <label className="text-gray-600" style={{fontSize:"clamp(7px,0.8vw,9px)"}}>Print Run {!card.copies && <span className="text-gray-700 text-[7px]">(? = SN unknown)</span>}</label>
                      <input type="text" value={details.printRun || card.copies || ""} onChange={function(e){updateCardDetail(card.id, "printRun", e.target.value === card.copies ? "" : e.target.value);}} placeholder={card.copies || "blank = unnum"} className={"w-full bg-gray-950 border rounded px-1.5 py-0.5 " + (isMissingSN(card, cardDetails) ? "border-orange-700 text-orange-300" : "border-gray-700")} />
                    </div>
                    {!hidePrices && <div>
                      <label className="text-gray-600" style={{fontSize:"clamp(7px,0.8vw,9px)"}}>Price</label>
                      <input type="text" value={details.price ? displayPrice(details.price) : ""} onChange={function(e){updateCardDetail(card.id, "price", formatPrice(e.target.value));}} onBlur={function(){ if (details.price) updateCardDetail(card.id, "price", displayPrice(details.price)); }} placeholder="$0.00" className="w-full bg-gray-950 border border-gray-700 rounded px-1.5 py-0.5" />
                    </div>}
                    <div>
                      <label className="text-gray-600" style={{fontSize:"clamp(7px,0.8vw,9px)"}}>Date</label>
                      <input type="date" value={details.date || ""} onChange={function(e){updateCardDetail(card.id, "date", e.target.value);}} className="w-full bg-gray-950 border border-gray-700 rounded px-1.5 py-0.5" />
                    </div>
                    <div>
                      <label className="text-gray-600" style={{fontSize:"clamp(7px,0.8vw,9px)"}}>Notes</label>
                      <input type="text" value={details.notes || ""} onChange={function(e){updateCardDetail(card.id, "notes", e.target.value);}} placeholder="..." className="w-full bg-gray-950 border border-gray-700 rounded px-1.5 py-0.5" />
                    </div>
                    {(statuses[card.id] === "owned" || statuses[card.id] === "in_transit") && <div>
                      <label className="text-gray-600" style={{fontSize:"clamp(7px,0.8vw,9px)"}}>Qty {parseInt(details.qty || "1") > 1 && <span className="text-pink-400">(extra for sale)</span>}</label>
                      <div className="flex items-center gap-1">
                        <button onClick={function(){var q=Math.max(1,parseInt(details.qty||"1")-1); updateCardDetail(card.id,"qty",String(q));}} className="bg-gray-800 border border-gray-700 rounded w-6 h-6 text-gray-400 hover:text-white hover:bg-gray-700 font-bold text-sm flex items-center justify-center">-</button>
                        <input type="number" min="1" value={details.qty || "1"} onChange={function(e){updateCardDetail(card.id, "qty", e.target.value);}} className="w-10 text-center bg-gray-950 border border-gray-700 rounded px-1 py-0.5" />
                        <button onClick={function(){var q=parseInt(details.qty||"1")+1; updateCardDetail(card.id,"qty",String(q));}} className="bg-gray-800 border border-gray-700 rounded w-6 h-6 text-gray-400 hover:text-white hover:bg-gray-700 font-bold text-sm flex items-center justify-center">+</button>
                      </div>
                    </div>}
                    <div className="col-span-2 flex flex-col gap-1" style={{fontSize:"clamp(8px,0.9vw,10px)"}}>
                      <div className="flex gap-2 items-center">
                        <a href={tcdbUrl(card)} target="_blank" rel="noopener noreferrer" className={"hover:text-cyan-300 underline " + (tcdbFlags[card.id] ? "text-red-400" : tcdbFixes[card.id] ? "text-green-400" : "text-cyan-500")}>{tcdbFlags[card.id] ? "TCDB ⚠" : tcdbFixes[card.id] ? "TCDB ✓" : "TCDB"}</a>
                        <a href={tcdbSearchUrl(card)} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-300 underline">Search</a>
                        <a href="#" onClick={function(e) { handleEbayClick(card, e); }} className="text-yellow-500 hover:text-yellow-300 underline">eBay</a>
                        <a href={comcUrl(card)} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-300 underline">COMC</a>
                        <a href={pt130Url(card)} target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:text-teal-300 underline">130pt</a>
                        {orderUrl(card) ? <a href={orderUrl(card)} target="_blank" rel="noopener noreferrer" className="text-lime-500 hover:text-lime-300 underline">Order</a> : null}
                        <span className="mx-1 text-gray-700">|</span>
                        {tcdbFlags[card.id]
                          ? <button onClick={function(){unflagTcdbLink(card.id);}} className="text-red-400 hover:text-red-300">Unflag</button>
                          : <button onClick={function(){flagTcdbLink(card.id);}} className="text-gray-600 hover:text-red-400">Flag bad link</button>
                        }
                        {tcdbFixingId === card.id
                          ? <button onClick={function(){setTcdbFixingId(null);setTcdbFixInput("");}} className="text-gray-500 hover:text-gray-300">Cancel</button>
                          : <button onClick={function(){setTcdbFixingId(card.id);setTcdbFixInput("");}} className="text-cyan-600 hover:text-cyan-400">✏ Fix link</button>
                        }
                        {card.id >= 10000 && <button onClick={function(){editCustomCardById(card.id);}} className="text-yellow-500 hover:text-yellow-300 font-bold">✏ Edit card</button>}
                      </div>
                      {tcdbFixingId === card.id && (
                        <div className="flex gap-1 items-center">
                          <input type="text" value={tcdbFixInput} onChange={function(e){setTcdbFixInput(e.target.value);}} placeholder="Paste correct TCDB ViewCard URL here..." className="flex-1 bg-gray-950 border border-cyan-700 rounded px-1.5 py-0.5 text-cyan-300" style={{fontSize:"clamp(8px,0.9vw,10px)"}} />
                          <button onClick={function(){
                            if (applyTcdbFix(card.id, tcdbFixInput)) { setTcdbFixingId(null); setTcdbFixInput(""); }
                            else { alert("Invalid URL -- need a TCDB ViewCard URL with /sid/NUMBER/cid/NUMBER/"); }
                          }} className="px-2 py-0.5 bg-green-800 hover:bg-green-700 rounded text-green-300 whitespace-nowrap">Save Fix</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-1 flex-shrink-0" style={{fontSize:"clamp(8px,1vw,11px)"}}>
          <div className="flex items-center gap-1">
            {[50,100,250,500].map(function(n){return (
              <button key={n} onClick={function(){setPageSize(n);}} className={"px-1.5 py-0 rounded " + (pageSize === n ? "bg-yellow-700 text-white" : "bg-gray-900 text-gray-500 hover:text-white")}>{n}</button>
            );})}
            <button onClick={function(){setPageSize(99999);}} className={"px-1.5 py-0 rounded " + (pageSize === 99999 ? "bg-yellow-700 text-white" : "bg-gray-900 text-gray-500 hover:text-white")}>All</button>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button onClick={function(){setPage(function(p){return Math.max(0, p-1);});}} disabled={page === 0} className="px-2 py-0 bg-gray-900 rounded disabled:opacity-30">{"\u2190"}</button>
              <span className="text-gray-500">{page+1}/{totalPages}</span>
              <button onClick={function(){setPage(function(p){return Math.min(totalPages-1, p+1);});}} disabled={page >= totalPages-1} className="px-2 py-0 bg-gray-900 rounded disabled:opacity-30">{"\u2192"}</button>
            </div>
          )}
          <div className="flex gap-2 text-gray-600">
            {PRIMARY_STATUSES.map(function(k) {
              var v = STATUS_CONFIG[k];
              return <span key={k} className="flex items-center gap-0.5"><span className={"inline-block w-1.5 h-1.5 rounded-full " + v.dot}></span>{v.label}</span>;
            })}
          </div>
        </div>
        </div>
        ) : (
        <div className="mx-auto flex-1 overflow-y-auto w-full" style={{maxWidth:"min(100%, 1800px)"}}>
        {activeTab === "changelog" ? (
          <ChangelogPanel changelog={changelog} setChangelog={setChangelog} statuses={statuses} cardDetails={cardDetails} forSaleFlags={forSaleFlags} setStatuses={setStatuses} setCardDetails={setCardDetails} setForSaleFlags={setForSaleFlags} saveStatuses={saveStatuses} saveDetails={saveDetails} setDirtyIds={setDirtyIds} currentSessionId={sessionId.current} clearUndoStack={function() { undoStack.current = []; setUndoLen(0); }} persistField={persistField} />
        ) : activeTab === "versions" ? (
          <VersionLogPanel />
        ) : activeTab === "board" ? (
          <TaskBoardPanel />
        ) : activeTab === "comc_scanner" ? (
          <COMCScannerPanel cards={ALL_CARDS} statuses={statuses} cardDetails={cardDetails} updateCardDetail={updateCardDetail} setCardStatus={setCardStatus} needsSync={needsSync} setDetailedCardId={setDetailedCardId} setActiveTab={setActiveTab} persistedState={scannerStateRef.current} onStateChange={function(s) { scannerStateRef.current = s; }} editCustomCardById={editCustomCardById} />
        ) : activeTab === "targets" ? (
          <TargetsPanel cards={ALL_CARDS} statuses={statuses} setCardStatus={setCardStatus} updateCardDetail={updateCardDetail} setDetailedCardId={setDetailedCardId} setActiveTab={setActiveTab} initialCardFilter={targetCardFilter} setTargetCardFilter={setTargetCardFilter} />
        ) : activeTab === "prices" ? (
          <PricesPanel cards={ALL_CARDS} statuses={statuses} setActiveTab={setActiveTab} setDetailedCardId={setDetailedCardId} setDetailedStatusFilter={setDetailedStatusFilter} setDetailedSnFilter={setDetailedSnFilter} setDetailedProductFilter={setDetailedProductFilter} setDetailedCardNumFilter={setDetailedCardNumFilter} initialSearch={pricesSearchFilter} setPricesSearchFilter={setPricesSearchFilter} />
        ) : activeTab === "export" || activeTab === "save" ? (
          <ExportPanel statuses={statuses} cardDetails={cardDetails} forSaleFlags={forSaleFlags} needsSync={needsSync} lastCheckpoint={lastCheckpoint} setLastCheckpoint={setLastCheckpoint} isSavingCheckpoint={isSavingCheckpoint} setIsSavingCheckpoint={setIsSavingCheckpoint} saveCount={saveCount} flashSave={flashSave} saveToast={saveToast} exportCsvRef={exportCsvRef} persistField={persistField} setStatuses={setStatuses} setCardDetails={setCardDetails} setForSaleFlags={setForSaleFlags} allDataRef={allDataRef} />
        ) : activeTab === "sync" ? (
          <SyncPanel cards={unsyncedCards} touchupCards={touchupCards} cardDetails={cardDetails} syncIndex={syncIndex} setSyncIndex={setSyncIndex} markSynced={markSynced} hidePrices={hidePrices} />
        ) : activeTab === "cleanup" ? (
          <CleanupPanel statuses={statuses} cardDetails={cardDetails} updateCardDetail={updateCardDetail} setCardStatus={setCardStatus} forSaleFlags={forSaleFlags} toggleForSale={toggleForSale} hidePrices={hidePrices} />
        ) : activeTab === "detailed" ? (
          <DetailedPanel statuses={statuses} cardDetails={cardDetails} updateCardDetail={updateCardDetail} setCardStatus={setCardStatus} needsSync={needsSync} initialSnFilter={detailedSnFilter} initialStatusFilter={detailedStatusFilter} initialCardId={detailedCardId} setDetailedCardId={setDetailedCardId} initialProductFilter={detailedProductFilter} setDetailedProductFilter={setDetailedProductFilter} initialCardNumFilter={detailedCardNumFilter} setDetailedCardNumFilter={setDetailedCardNumFilter} editCustomCardById={editCustomCardById} customEditVer={customEditVer} targetByCardId={targetByCardId} setActiveTab={setActiveTab} setTargetCardFilter={setTargetCardFilter} hidePrices={hidePrices} />
        ) : activeTab === "summary" ? (
          <SummaryPanel statuses={statuses} setActiveTab={setActiveTab} setDetailedStatusFilter={setDetailedStatusFilter} setDetailedSnFilter={setDetailedSnFilter} />
        ) : activeTab === "lookup" ? (
          <CardLookupPanel statuses={statuses} cardDetails={cardDetails} updateCardDetail={updateCardDetail} setCardStatus={setCardStatus} forSaleFlags={forSaleFlags} toggleForSale={toggleForSale} needsSync={needsSync} setActiveTab={setActiveTab} setDetailedProductFilter={setDetailedProductFilter} setDetailedCardNumFilter={setDetailedCardNumFilter} setDetailedStatusFilter={setDetailedStatusFilter} setDetailedSnFilter={setDetailedSnFilter} setPricesSearchFilter={setPricesSearchFilter} superSearchMode={superSearchMode} targetByCardId={targetByCardId} setTargetCardFilter={setTargetCardFilter} hidePrices={hidePrices} />
        ) : null}
        </div>
        )}
      </div>
      {/* Keyboard shortcuts help */}
      {showKbHelp && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={function() { setShowKbHelp(false); }}>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 max-w-sm w-full mx-4 shadow-xl" onClick={function(e) { e.stopPropagation(); }}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-bold text-sm">Keyboard Shortcuts</h3>
              <button onClick={function() { setShowKbHelp(false); }} className="text-gray-500 hover:text-white text-lg">{"\u2715"}</button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="text-yellow-400 font-bold">Global</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-gray-300">
                <span><kbd className="bg-gray-800 px-1 rounded text-white">?</kbd> Toggle this help</span>
                <span><kbd className="bg-gray-800 px-1 rounded text-white">Esc</kbd> Close / deselect</span>
                <span><kbd className="bg-gray-800 px-1 rounded text-white">1</kbd>-<kbd className="bg-gray-800 px-1 rounded text-white">0</kbd> Switch tabs</span>
              </div>
              <div className="text-yellow-400 font-bold mt-2">Collection Tab</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-gray-300">
                <span><kbd className="bg-gray-800 px-1 rounded text-white">j</kbd> / <kbd className="bg-gray-800 px-1 rounded text-white">{"\u2193"}</kbd> Next card</span>
                <span><kbd className="bg-gray-800 px-1 rounded text-white">k</kbd> / <kbd className="bg-gray-800 px-1 rounded text-white">{"\u2191"}</kbd> Prev card</span>
                <span><kbd className="bg-gray-800 px-1 rounded text-white">o</kbd> Set Owned</span>
                <span><kbd className="bg-gray-800 px-1 rounded text-white">i</kbd> Set In Transit</span>
                <span><kbd className="bg-gray-800 px-1 rounded text-white">n</kbd> Set Not Owned</span>
                <span><kbd className="bg-gray-800 px-1 rounded text-white">s</kbd> Set For Sale</span>
                <span><kbd className="bg-gray-800 px-1 rounded text-white">f</kbd> Toggle For Sale flag</span>
                <span><kbd className="bg-gray-800 px-1 rounded text-white">e</kbd> Open eBay search</span>
                <span><kbd className="bg-gray-800 px-1 rounded text-white">Enter</kbd> Expand / collapse</span>
                <span><kbd className="bg-gray-800 px-1 rounded text-white">[</kbd> / <kbd className="bg-gray-800 px-1 rounded text-white">]</kbd> Prev / next page</span>
              </div>
            </div>
            <div className="mt-3 text-gray-600 text-[10px]">Shortcuts disabled when typing in inputs</div>
          </div>
        </div>
      )}
      {/* Floating save toast */}
      {saveToast && (
        <div className={"fixed bottom-3 right-3 border px-3 py-1.5 rounded shadow-lg font-medium z-50 " + (saveToast.includes("WARN") ? "bg-red-900 border-red-700 text-red-300" : "bg-yellow-900 border-yellow-700 text-yellow-300")} style={{fontSize:"clamp(9px,1.1vw,12px)"}}>
          {saveToast}
        </div>
      )}
      {/* Edit Custom Card Modal */}
      {editingCustom && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onMouseDown={function(e){if(e.target===e.currentTarget)setEditingCustom(null);}}>
          <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 w-80 max-w-[90vw]">
            <div className="text-white font-bold mb-3 text-sm">Edit User-Added Card</div>
            <div className="space-y-2">
              <div>
                <label className="text-gray-500 text-[10px]">Variant</label>
                <input type="text" value={editingCustom.cardSet} onChange={function(e){setEditingCustom(Object.assign({},editingCustom,{cardSet:e.target.value}));}} className="w-full bg-gray-950 border border-gray-600 rounded px-2 py-1 text-white text-xs" />
              </div>
              <div>
                <label className="text-gray-500 text-[10px]">Product</label>
                <input type="text" value={editingCustom.product} onChange={function(e){setEditingCustom(Object.assign({},editingCustom,{product:e.target.value}));}} className="w-full bg-gray-950 border border-gray-600 rounded px-2 py-1 text-white text-xs" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-gray-500 text-[10px]">Card #</label>
                  <input type="text" value={editingCustom.cardNumber} onChange={function(e){setEditingCustom(Object.assign({},editingCustom,{cardNumber:e.target.value}));}} className="w-full bg-gray-950 border border-gray-600 rounded px-2 py-1 text-white text-xs" />
                </div>
                <div className="flex-1">
                  <label className="text-gray-500 text-[10px]">Print Run</label>
                  <input type="text" value={editingCustom.copies} onChange={function(e){setEditingCustom(Object.assign({},editingCustom,{copies:e.target.value}));}} placeholder="blank = unnumbered" className="w-full bg-gray-950 border border-gray-600 rounded px-2 py-1 text-white text-xs" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={function(e){e.stopPropagation();setEditingCustom(null);}} className="px-3 py-1 bg-gray-800 text-gray-400 rounded text-xs hover:bg-gray-700">Cancel</button>
              <button onClick={function(e){e.stopPropagation();try{saveCustomCardEdit();}catch(err){setEditingCustom(Object.assign({},editingCustom,{error:String(err)}));}}} className="px-3 py-1 bg-green-700 text-white rounded text-xs hover:bg-green-600 font-bold">Save</button>
            </div>
            {editingCustom && editingCustom.error && <div className="mt-2 text-red-400 text-[10px] break-all">Error: {editingCustom.error}</div>}
          </div>
        </div>
      )}
      {/* Storage diagnostic - tiny footer */}
      {storageDiag && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-950 text-gray-600 text-center py-0.5 z-40 cursor-pointer" style={{fontSize:"9px"}} onClick={() => setStorageDiag("")}>
          {storageDiag}
        </div>
      )}
    </div>
  );
}
function getBrand(product) {
  var p = product.slice(5);
  if (p.startsWith("Bowman")) return "Bowman";
  if (p.startsWith("Topps")) return "Topps";
  if (p.startsWith("Panini") || p.startsWith("Donruss")) return "Panini";
  if (p.startsWith("Leaf")) return "Leaf";
  if (p.startsWith("Stadium")) return "Topps";
  return "Other";
}
function ProgressBar({ label, owned, transit, total, sub }) {
  if (total === 0) return null;
  var pO = (owned / total * 100).toFixed(1);
  var pT = ((owned + transit) / total * 100).toFixed(1);
  return (
    <div className={"py-0.5" + (sub ? "" : " border-b border-gray-800")}>
      <div className="flex justify-between items-center">
        <span className={"truncate " + (sub ? "text-gray-400 pl-3" : "text-white font-medium")} style={{fontSize:sub?"clamp(8px,1vw,11px)":"clamp(9px,1.2vw,12px)"}}>{label}</span>
        <span className="text-gray-500 flex-shrink-0 ml-2" style={{fontSize:"clamp(8px,0.9vw,10px)"}}>{owned + transit}/{total} ({pT}%)</span>
      </div>
      <div className={"bg-gray-700 rounded-full overflow-hidden " + (sub ? "h-1 ml-3" : "h-1.5")}>
        <div className="h-full flex">
          <div style={{background:"#22c55e",width: pO + "%"}} />
          <div className="bg-blue-500" style={{width: (pT - pO) + "%"}} />
        </div>
      </div>
    </div>
  );
}
function SummaryPanel({ statuses, setActiveTab, setDetailedStatusFilter, setDetailedSnFilter }) {
  var [view, setView] = useState("dashboard"); // dashboard, heatmap, breakdown
  var [splitBy, setSplitBy] = useState("year");
  var [expanded, setExpanded] = useState(null);
  var [expandedProd, setExpandedProd] = useState(null);
  var [snMin, setSnMin] = useState(1);
  var [includeBlankSN, setIncludeBlankSN] = useState(true);
  var [exclude1of1, setExclude1of1] = useState(false);
  var [rookieOnly, setRookieOnly] = useState(false);

  var PRESETS = [
    {label:"All",sn:1,blank:true,ex1:false},
    {label:"No 1/1s",sn:2,blank:true,ex1:true},
    {label:"SN \u226510",sn:10,blank:false,ex1:true,snKey:"sn_gte_10"},
    {label:"SN \u226525",sn:25,blank:false,ex1:true,snKey:"sn_gte_25"},
    {label:"SN \u226550",sn:50,blank:false,ex1:true,snKey:"sn_gte_50"},
    {label:"SN \u2265100",sn:100,blank:false,ex1:true,snKey:"sn_gte_100"},
    {label:"Unnumbered",sn:1,blank:true,ex1:true,unnumOnly:true,snKey:"unnumbered"},
    {label:"SP/SSP",sn:1,blank:true,ex1:false,spOnly:true,snKey:"sp_ssp"},
  ];

  function passesFilter(card, minSN, inclBlank, ex1of1, unnumOnly, spOnly) {
    if (HIDDEN_DUPES.has(card.id)) return false;
    if (card.product.startsWith("TEST")) return false;
    if (rookieOnly && !card.product.startsWith("2021") && !card.product.startsWith("2024")) return false;
    if (spOnly) return !!SSP_TAGS[card.cardSet];
    var pr = parseInt(card.copies);
    var isNumbered = card.copies && !isNaN(pr);
    if (unnumOnly) return !isNumbered;
    if (ex1of1 && card.copies === "1") return false;
    if (isNumbered) return pr >= minSN;
    return inclBlank;
  }

  function calcStats(cards, sts, minSN, inclBlank, ex1of1, unnumOnly, spOnly) {
    var owned=0,transit=0,total=0,sps=0,spsAcq=0,ssps=0,sspsAcq=0;
    var byYear={},byBrand={},byProduct={},cardsByProduct={};
    cards.forEach(function(card) {
      if (!passesFilter(card, minSN, inclBlank, ex1of1, unnumOnly, spOnly)) return;
      var s = sts[card.id] || "not_owned";
      var acq = s==="owned"||s==="in_transit" ? 1 : 0;
      total++;
      if (s==="owned") owned++;
      if (s==="in_transit") transit++;
      var tag = SSP_TAGS[card.cardSet];
      if (tag === "SP") { sps++; spsAcq += acq; }
      if (tag === "SSP") { ssps++; sspsAcq += acq; }
      var year = card.product.slice(0,4);
      var brand = getBrand(card.product);
      var prod = card.product;
      function add(map, key) {
        if (!map[key]) map[key] = {owned:0,transit:0,total:0,year:year};
        map[key].total++;
        if (s==="owned") map[key].owned++;
        if (s==="in_transit") map[key].transit++;
      }
      add(byYear, year); add(byBrand, brand); add(byProduct, prod);
      if (!cardsByProduct[prod]) cardsByProduct[prod] = [];
      cardsByProduct[prod].push(card);
    });
    return {owned:owned,transit:transit,total:total,sps:sps,spsAcq:spsAcq,ssps:ssps,sspsAcq:sspsAcq,byYear:byYear,byBrand:byBrand,byProduct:byProduct,cardsByProduct:cardsByProduct};
  }

  var stats = useMemo(function() {
    return calcStats(ALL_CARDS, statuses, snMin, includeBlankSN, exclude1of1, false, false);
  }, [statuses, snMin, includeBlankSN, exclude1of1, rookieOnly]);

  var presetStats = useMemo(function() {
    return PRESETS.map(function(p) {
      var s = calcStats(ALL_CARDS, statuses, p.sn, p.blank, p.ex1, p.unnumOnly, p.spOnly);
      return {label:p.label, pct: s.total ? ((s.owned+s.transit)/s.total*100) : 0, owned:s.owned, transit:s.transit, total:s.total, sn:p.sn, blank:p.blank, ex1:p.ex1, unnumOnly:p.unnumOnly, spOnly:p.spOnly, snKey:p.snKey};
    });
  }, [statuses, rookieOnly]);

  var pct = stats.total ? (stats.owned+stats.transit)/stats.total*100 : 0;
  var pctOwned = stats.total ? stats.owned/stats.total*100 : 0;

  // Rarest acquired — numbered cards + SP/SSP cards
  var rarestOwned = useMemo(function() {
    var numbered = ALL_CARDS.filter(function(c) {
      if (HIDDEN_DUPES.has(c.id)) return false;
      if (c.product.startsWith("TEST")) return false;
      if (rookieOnly && !c.product.startsWith("2021") && !c.product.startsWith("2024")) return false;
      var s = statuses[c.id] || "not_owned";
      if (s !== "owned" && s !== "in_transit") return false;
      return c.copies && parseInt(c.copies) > 0;
    }).sort(function(a,b) { return parseInt(a.copies) - parseInt(b.copies); }).slice(0,12);
    var spCards = ALL_CARDS.filter(function(c) {
      if (HIDDEN_DUPES.has(c.id)) return false;
      if (c.product.startsWith("TEST")) return false;
      if (rookieOnly && !c.product.startsWith("2021") && !c.product.startsWith("2024")) return false;
      var s = statuses[c.id] || "not_owned";
      if (s !== "owned" && s !== "in_transit") return false;
      return SSP_TAGS[c.cardSet] === "SSP" && !c.copies; // unnumbered SSP only
    });
    return { numbered: numbered, sp: spCards };
  }, [statuses, rookieOnly]);

  function pctColor(owned, transit, total) {
    if (total === 0) return "bg-gray-800";
    var p = (owned + transit) / total;
    if (p >= 1) return "bg-green-600";
    if (p >= 0.75) return "bg-green-800";
    if (p >= 0.5) return "bg-green-700";
    if (p >= 0.25) return "bg-orange-800";
    if (p > 0) return "bg-red-900";
    return "bg-gray-800/60";
  }

  function Gauge({pct, size}) {
    var r = (size||100)/2 - 6;
    var circ = 2*Math.PI*r;
    var dashPct = Math.min(pct/100, 1);
    var color = pct >= 75 ? "#22c55e" : pct >= 50 ? "#4ade80" : pct >= 25 ? "#f97316" : "#ef4444";
    var h = (size||100)/2 + 20;
    return React.createElement("svg", {width:size||100,height:h,viewBox:"0 0 "+(size||100)+" "+h},
      React.createElement("path", {d:"M 6 "+((size||100)/2+4)+" A "+r+" "+r+" 0 0 1 "+((size||100)-6)+" "+((size||100)/2+4), fill:"none", stroke:"#1a2d4a", strokeWidth:8, strokeLinecap:"round"}),
      React.createElement("path", {d:"M 6 "+((size||100)/2+4)+" A "+r+" "+r+" 0 0 1 "+((size||100)-6)+" "+((size||100)/2+4), fill:"none", stroke:color, strokeWidth:8, strokeLinecap:"round", strokeDasharray:circ/2, strokeDashoffset:circ/2*(1-dashPct)}),
      React.createElement("text", {x:(size||100)/2, y:(size||100)/2-2, textAnchor:"middle", fill:"white", fontSize:size?size/4.5:22, fontWeight:"bold"}, pct.toFixed(1)+"%"),
      React.createElement("text", {x:(size||100)/2, y:(size||100)/2+14, textAnchor:"middle", fill:"#22c55e", fontSize:size?size/9:11, fontWeight:"700"}, (stats.owned+stats.transit)+"/"+stats.total)
    );
  }

  function renderCards(prod) {
    var cards = stats.cardsByProduct[prod] || [];
    return (
      <div className="ml-4 mt-0.5 mb-1 space-y-0">
        {cards.map(function(card) {
          var s = statuses[card.id] || "not_owned";
          var cfg = STATUS_CONFIG[s];
          return (
            <div key={card.id} className={"flex items-center gap-1 px-1.5 py-0 rounded " + cfg.bg} style={{fontSize:"clamp(8px,1vw,11px)"}}>
              <div className={"w-1.5 h-1.5 rounded-full flex-shrink-0 " + cfg.dot} />
              <span className="flex-1 truncate">#{card.cardNumber} | {card.cardSet}{card.copies ? " /" + card.copies : ""} {sspBadge(card.cardSet)}</span>
              <span className={"flex-shrink-0 " + (s === "owned" ? "text-green-300" : s === "in_transit" ? "text-emerald-300" : "text-gray-500")}>{cfg.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Navigate to Detailed with filter
  function goDetailed(snKey) {
    setDetailedSnFilter(snKey || "all");
    setDetailedStatusFilter("all");
    setActiveTab("detailed");
  }

  return (
    <div className="space-y-1.5">
      {/* View toggle + global controls */}
      <div className="flex gap-1 items-center flex-wrap" style={{fontSize:"clamp(9px,1.1vw,11px)"}}>
        {[{k:"dashboard",l:"Dashboard"},{k:"heatmap",l:"Heatmap"},{k:"breakdown",l:"Breakdown"}].map(function(v) {
          return <button key={v.k} onClick={function(){setView(v.k);}} className={"px-2 py-0.5 rounded font-bold " + (view===v.k ? "text-white" : "hover:text-white")} style={view===v.k ? {background:"#22c55e"} : {background:"#111a2e",color:"#8ba3c4"}}>{v.l}</button>;
        })}
        <div className="flex-1"/>
        <label className="flex items-center gap-1 cursor-pointer" style={{color:"#8ba3c4"}}><input type="checkbox" checked={rookieOnly} onChange={function(){setRookieOnly(!rookieOnly);}} className="accent-yellow-500"/>Rookie Years</label>
        <label className="flex items-center gap-1 cursor-pointer" style={{color:"#8ba3c4"}}><input type="checkbox" checked={exclude1of1} onChange={function(){setExclude1of1(!exclude1of1);}} className="accent-yellow-500"/>Excl 1/1s</label>
      </div>


      {/* ============ DASHBOARD VIEW ============ */}
      {view === "dashboard" && (
        <div className="space-y-1">
          {/* TOP ROW: Gauge+stats LEFT, By Year RIGHT */}
          <div className="flex gap-1.5 items-stretch">
            {/* Gauge + legend */}
            <div className="rounded-lg p-2 flex flex-col items-center justify-center flex-shrink-0" style={{background:"#111a2e",minWidth:"155px"}}>
              <Gauge pct={pct} size={95}/>
              <div className="grid grid-cols-2 gap-x-3 gap-y-0 mt-0.5" style={{fontSize:"clamp(8px,0.9vw,10px)"}}>
                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full inline-block" style={{background:"#22c55e"}}/><span style={{color:"#22c55e"}}>Own</span><span className="text-white font-bold ml-auto">{stats.owned}</span></div>
                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full inline-block" style={{background:"#86efac"}}/><span style={{color:"#86efac"}}>Transit</span><span className="text-white font-bold ml-auto">{stats.transit}</span></div>
                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full inline-block" style={{background:"#f87171"}}/><span style={{color:"#e88"}}>Need</span><span className="text-white font-bold ml-auto">{stats.total-stats.owned-stats.transit}</span></div>
                <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500 inline-block"/><span className="text-amber-300">Total</span><span className="text-white font-bold ml-auto">{stats.total}</span></div>
              </div>
              {stats.ssps > 0 && <div className="flex items-center gap-1 mt-0.5" style={{fontSize:"clamp(7px,0.8vw,9px)"}}><span className="text-red-400 font-bold text-[8px] bg-red-900/60 px-1 rounded">SSP</span><span className="text-amber-200">{stats.sspsAcq}/{stats.ssps}</span></div>}
            </div>
            {/* By Year */}
            <div className="rounded-lg px-2 py-1.5 flex-1 min-w-0" style={{background:"#111a2e"}}>
              <div className="font-bold mb-0.5" style={{color:"#FFC52F",fontSize:"clamp(7px,0.8vw,9px)"}}>By Year</div>
              <div className="space-y-px">
                {Object.keys(stats.byYear).sort().map(function(year) {
                  var d = stats.byYear[year];
                  var yp = d.total ? (d.owned+d.transit)/d.total*100 : 0;
                  var needPct = d.total ? (d.total-d.owned-d.transit)/d.total*100 : 0;
                  return (
                    <div key={year} className="flex items-center gap-1" style={{fontSize:"clamp(9px,1vw,11px)"}}>
                      <span className="font-bold w-8 text-right" style={{color:"#FFC52F"}}>{year}</span>
                      <div className="flex-1 rounded-full h-2 overflow-hidden" style={{background:"#1a2d4a"}}>
                        <div className="h-full flex">
                          <div className="transition-all" style={{width:(d.total?d.owned/d.total*100:0)+"%",background:"#22c55e"}}/>
                          <div className="transition-all" style={{width:(d.total?d.transit/d.total*100:0)+"%",background:"#86efac"}}/>
                        </div>
                      </div>
                      <span className={"w-9 text-right font-bold flex-shrink-0 " + (yp>=75?"text-yellow-300":yp>=50?"text-yellow-500":yp>0?"text-orange-300":"text-red-400")}>{yp.toFixed(0)}%</span>
                      <span className="w-14 text-right flex-shrink-0" style={{color:"#8ba3c4",fontSize:"clamp(7px,0.8vw,9px)"}}>{d.owned+d.transit}/{d.total}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Checkpoints — 2-col grid, ultra compact */}
          <div className="rounded-lg px-2 py-1" style={{background:"#111a2e"}}>
            <div className="font-bold mb-0.5" style={{color:"#FFC52F",fontSize:"clamp(7px,0.8vw,9px)"}}>Checkpoints <span className="font-normal" style={{color:"#6a7b94"}}>(click → Detailed)</span></div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0">
              {presetStats.map(function(p,i) {
                var col = p.pct >= 75 ? "text-yellow-300" : p.pct >= 50 ? "text-yellow-500" : p.pct >= 25 ? "text-orange-300" : "text-red-400";
                var bg = p.pct >= 75 ? "#22c55e" : p.pct >= 50 ? "#16a34a" : p.pct >= 25 ? "#c2410c" : "#dc2626";
                return (
                  <button key={i} onClick={function(){ if (p.snKey) goDetailed(p.snKey); else { setSnMin(p.sn); setIncludeBlankSN(p.blank); setExclude1of1(p.ex1); } }} className="flex items-center gap-1 hover:bg-gray-800/60 rounded px-0.5 py-px transition-colors" style={{fontSize:"clamp(8px,1vw,10px)"}}>
                    <span className="w-16 text-left truncate" style={{color:"#d0dae8"}}>{p.label}</span>
                    <div className="flex-1 rounded-full h-1.5 overflow-hidden" style={{background:"#1a2d4a"}}>
                      <div className="h-full rounded-full" style={{width: Math.max(p.pct, 1) + "%", background: bg}} />
                    </div>
                    <span className={"font-bold w-10 text-right " + col} style={{fontSize:"clamp(8px,1vw,10px)"}}>{p.pct.toFixed(1)}%</span>
                    <span className="w-10 text-right" style={{color:"#7a8ba8",fontSize:"clamp(6px,0.7vw,8px)"}}>{p.owned+p.transit}/{p.total}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rarest acquired */}
          {(rarestOwned.numbered.length > 0 || rarestOwned.sp.length > 0) && (
            <div className="rounded-lg px-2 py-1.5" style={{background:"#111a2e"}}>
              <div className="font-bold mb-0.5" style={{color:"#FFC52F",fontSize:"clamp(8px,1vw,10px)"}}>Rarest Cards Acquired</div>
              {rarestOwned.numbered.length > 0 && (
                <div className="space-y-0">
                  {rarestOwned.numbered.map(function(card) {
                    var s = statuses[card.id] || "not_owned";
                    var copies = parseInt(card.copies);
                    return (
                      <div key={card.id} className="flex items-center gap-1.5 px-1 py-0 rounded hover:bg-gray-800/40" style={{fontSize:"clamp(8px,0.9vw,10px)"}}>
                        <span className={"font-black w-7 text-right flex-shrink-0 " + (copies <= 5 ? "text-red-400" : copies <= 25 ? "text-orange-400" : "text-yellow-400")}>/{card.copies}</span>
                        <span className={"w-1.5 h-1.5 rounded-full flex-shrink-0 " + (s==="owned"?"bg-green-500":"bg-emerald-400")}/>
                        <span className="font-bold flex-shrink-0 text-cyan-300">#{card.cardNumber}</span>
                        <span className="text-white truncate flex-1">{card.cardSet}</span>
                        {sspBadge(card.cardSet)}
                        <span className="truncate flex-shrink-0 max-w-[100px]" style={{color:"#7a8ba8",fontSize:"clamp(7px,0.8vw,9px)"}}>{card.product.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {rarestOwned.sp.length > 0 && (
                <div className="mt-0.5 pt-0.5 border-t border-gray-800">
                  <div className="text-[7px] font-bold mb-0" style={{color:"#8ba3c4"}}>UNNUMBERED SSP</div>
                  {rarestOwned.sp.map(function(card) {
                    var s = statuses[card.id] || "not_owned";
                    return (
                      <div key={card.id} className="flex items-center gap-1.5 px-1 py-0 rounded hover:bg-gray-800/40" style={{fontSize:"clamp(8px,0.9vw,10px)"}}>
                        {sspBadge(card.cardSet)}
                        <span className={"w-1.5 h-1.5 rounded-full flex-shrink-0 " + (s==="owned"?"bg-green-500":"bg-emerald-400")}/>
                        <span className="font-bold flex-shrink-0 text-cyan-300">#{card.cardNumber}</span>
                        <span className="text-white truncate flex-1">{card.cardSet}</span>
                        <span className="truncate flex-shrink-0 max-w-[100px]" style={{color:"#7a8ba8",fontSize:"clamp(7px,0.8vw,9px)"}}>{card.product.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SN slider — inline, at bottom */}
          <div className="rounded-lg px-2 py-1" style={{background:"#111a2e"}}>
            <div className="flex items-center gap-2" style={{fontSize:"clamp(8px,0.9vw,10px)"}}>
              <span className="font-bold" style={{color:"#b8c8e0"}}>SN</span>
              <span className="text-white font-bold">{"≥"} {snMin}</span>
              <label className="flex items-center gap-0.5 text-slate-400 cursor-pointer"><input type="checkbox" checked={includeBlankSN} onChange={function(){setIncludeBlankSN(!includeBlankSN);}} className="accent-cyan-500" style={{width:"12px",height:"12px"}}/>Unnum</label>
              <input type="range" min="1" max="500" value={snMin} onChange={function(e){setSnMin(parseInt(e.target.value));}} className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
              <div className={"font-bold " + (pct >= 75 ? "text-yellow-300" : pct >= 50 ? "text-yellow-500" : pct >= 25 ? "text-orange-300" : "text-red-400")}>{pct.toFixed(1)}%</div>
              <span className="text-slate-400" style={{fontSize:"clamp(7px,0.8vw,9px)"}}>{stats.owned+stats.transit}/{stats.total}</span>
              <button onClick={function(){ goDetailed(snMin > 1 ? "sn_gte_" + snMin : "all"); }} className="text-cyan-400 hover:text-cyan-200 text-[8px]">{"→"}</button>
            </div>
          </div>
        </div>
      )}


      {/* ============ HEATMAP VIEW ============ */}
      {view === "heatmap" && (function() {
        var years = Object.keys(stats.byYear).sort();
        var products = Object.entries(stats.byProduct).sort(function(a,b) {
          if (a[1].year !== b[1].year) return a[1].year.localeCompare(b[1].year);
          return a[0].localeCompare(b[0]);
        });
        var currentYear = null;
        return (
          <div>
            <div className="bg-gray-900 rounded-lg px-2 py-1.5 mb-2 flex items-center gap-2" style={{fontSize:"clamp(9px,1.1vw,11px)"}}>
              <span className="text-gray-500">SN {"\u2265"}</span>
              <input type="range" min="1" max="500" value={snMin} onChange={function(e){setSnMin(parseInt(e.target.value));}} className="flex-1 h-1.5 bg-gray-700 rounded accent-cyan-500 cursor-pointer"/>
              <span className="text-white font-bold w-8">{snMin}</span>
              <label className="flex items-center gap-1 text-gray-500 cursor-pointer"><input type="checkbox" checked={includeBlankSN} onChange={function(){setIncludeBlankSN(!includeBlankSN);}} className="accent-cyan-500"/>Blank</label>
              <span className={"font-bold " + (pct>=75?"text-yellow-300":pct>=50?"text-yellow-500":"text-orange-400")}>{pct.toFixed(1)}%</span>
            </div>
            <div className="flex gap-1 items-center mb-2 justify-end" style={{fontSize:"9px"}}>
              <span className="w-3 h-3 rounded bg-gray-800/60 inline-block"/> 0%
              <span className="w-3 h-3 rounded bg-red-900 inline-block"/> &lt;25%
              <span className="w-3 h-3 rounded bg-orange-800 inline-block"/> 25-49%
              <span className="w-3 h-3 rounded bg-green-700 inline-block"/> 50-74%
              <span className="w-3 h-3 rounded bg-green-800 inline-block"/> 75-99%
              <span className="w-3 h-3 rounded bg-green-600 inline-block"/> 100%
            </div>
            <div className="flex gap-1.5 mb-3 flex-wrap">
              {years.map(function(year) {
                var d = stats.byYear[year];
                var yp = d.total ? Math.round((d.owned+d.transit)/d.total*100) : 0;
                return (
                  <div key={year} className={"rounded-lg border border-gray-700 px-3 py-2 text-center " + pctColor(d.owned,d.transit,d.total)}>
                    <div className="text-white font-bold" style={{fontSize:"clamp(11px,1.4vw,14px)"}}>{year}</div>
                    <div className="text-gray-200 font-bold" style={{fontSize:"clamp(13px,1.6vw,16px)"}}>{yp}%</div>
                    <div className="text-gray-300" style={{fontSize:"clamp(8px,0.9vw,10px)"}}>{d.owned+d.transit}/{d.total}</div>
                  </div>
                );
              })}
            </div>
            <div className="space-y-0.5">
              {products.map(function(entry) {
                var prod = entry[0], d = entry[1];
                var pp = d.total ? (d.owned+d.transit)/d.total : 0;
                var showYearHeader = d.year !== currentYear;
                currentYear = d.year;
                return (
                  <div key={prod}>
                    {showYearHeader && <div className="text-gray-500 font-bold mt-3 mb-1 border-b border-gray-800 pb-0.5" style={{fontSize:"clamp(10px,1.2vw,12px)"}}>{d.year}</div>}
                    <div className="flex items-center gap-1 hover:bg-gray-800/40 rounded px-1 py-0.5">
                      <div className={"w-2 h-2 rounded-sm flex-shrink-0 " + pctColor(d.owned,d.transit,d.total)}/>
                      <div className="flex-1 min-w-0 truncate text-gray-400" style={{fontSize:"clamp(9px,1.1vw,11px)"}}>{prod.slice(5)}</div>
                      <div className="w-28 flex-shrink-0 bg-gray-900 rounded-full h-2 overflow-hidden">
                        <div className="h-full flex">
                          <div className="transition-all" style={{background:"#22c55e",width:(d.total?d.owned/d.total*100:0)+"%"}}/>
                          <div className="bg-blue-500 transition-all" style={{width:(d.total?d.transit/d.total*100:0)+"%"}}/>
                        </div>
                      </div>
                      <div className={"w-8 text-right font-bold " + (pp>=1?"text-yellow-300":pp>=0.5?"text-yellow-500":pp>0?"text-orange-400":"text-gray-700")} style={{fontSize:"clamp(9px,1.1vw,11px)"}}>{Math.round(pp*100)}%</div>
                      <div className="w-12 text-right text-gray-600" style={{fontSize:"clamp(8px,0.9vw,10px)"}}>{d.owned+d.transit}/{d.total}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ============ BREAKDOWN VIEW ============ */}
      {view === "breakdown" && (
        <div>
          <div className="bg-gray-900 rounded-lg px-2 py-1.5 mb-2 flex items-center gap-2" style={{fontSize:"clamp(9px,1.1vw,11px)"}}>
            <span className="text-gray-500">SN {"\u2265"}</span>
            <input type="range" min="1" max="500" value={snMin} onChange={function(e){setSnMin(parseInt(e.target.value));}} className="flex-1 h-1.5 bg-gray-700 rounded accent-cyan-500 cursor-pointer"/>
            <span className="text-white font-bold w-8">{snMin}</span>
            <label className="flex items-center gap-1 text-gray-500 cursor-pointer"><input type="checkbox" checked={includeBlankSN} onChange={function(){setIncludeBlankSN(!includeBlankSN);}} className="accent-cyan-500"/>Blank</label>
            <span className={"font-bold " + (pct>=75?"text-yellow-300":pct>=50?"text-yellow-500":"text-orange-400")}>{pct.toFixed(1)}%</span>
          </div>
          <div className="flex gap-1 mb-2" style={{fontSize:"clamp(9px,1.1vw,11px)"}}>
            {["year","brand","product"].map(function(s) {
              return <button key={s} onClick={function(){setSplitBy(s);setExpanded(null);setExpandedProd(null);}} className={"px-2 py-0.5 rounded font-medium " + (splitBy===s?"text-white":"hover:text-white")} style={splitBy===s?{background:"#22c55e"}:{background:"#111a2e",color:"#8ba3c4"}}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>;
            })}
          </div>
          <div className="bg-gray-900 rounded-lg p-2">
            {(function() {
              var splitData = splitBy==="year"?stats.byYear:splitBy==="brand"?stats.byBrand:stats.byProduct;
              var keys = Object.keys(splitData).sort();
              return keys.map(function(k) {
                var d = splitData[k];
                if (splitBy === "product") {
                  var isProdExp = expandedProd === k;
                  return (
                    <div key={k}>
                      <div className="cursor-pointer" onClick={function(){setExpandedProd(isProdExp?null:k);}}><ProgressBar label={k} owned={d.owned} transit={d.transit} total={d.total}/></div>
                      {isProdExp && renderCards(k)}
                    </div>
                  );
                }
                var isExp = expanded === k;
                var prods = Object.keys(stats.byProduct).filter(function(p) {
                  if (splitBy==="year") return p.startsWith(k);
                  return getBrand(p) === k;
                }).sort();
                return (
                  <div key={k}>
                    <div className="cursor-pointer" onClick={function(){setExpanded(isExp?null:k);setExpandedProd(null);}}><ProgressBar label={k} owned={d.owned} transit={d.transit} total={d.total}/></div>
                    {isExp && prods.map(function(p) {
                      var pd = stats.byProduct[p];
                      if (!pd) return null;
                      var isPE = expandedProd === p;
                      return (
                        <div key={p}>
                          <div className="cursor-pointer" onClick={function(){setExpandedProd(isPE?null:p);}}><ProgressBar label={p.slice(5)} owned={pd.owned} transit={pd.transit} total={pd.total} sub={true}/></div>
                          {isPE && renderCards(p)}
                        </div>
                      );
                    })}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
function CardLookupPanel({ statuses, cardDetails, updateCardDetail, setCardStatus, forSaleFlags, toggleForSale, needsSync, setActiveTab, setDetailedProductFilter, setDetailedCardNumFilter, setDetailedStatusFilter, setDetailedSnFilter, setPricesSearchFilter, superSearchMode, targetByCardId, setTargetCardFilter, hidePrices }) {
  var [numSearch, setNumSearch] = useState("");
  var [selectedNum, setSelectedNum] = useState(null);
  var [selectedCard, setSelectedCard] = useState(null);
  var [expandedProducts, setExpandedProducts] = useState({}); // track collapsed products
  var [statusOnly, setStatusOnly] = useState("all"); // all, not_owned, owned, in_transit
  var [varSearch, setVarSearch] = useState(""); // search within variants
  var [filterAuto, setFilterAuto] = useState(false);
  var [filterSN, setFilterSN] = useState(false);
  var [filterMem, setFilterMem] = useState(false);
  var [maxPR, setMaxPR] = useState(""); // max print run filter
  var allNumbers = useMemo(function() {
    var nums = {};
    ALL_CARDS.forEach(function(c) {
      if (HIDDEN_DUPES.has(c.id)) return;
      if (!nums[c.cardNumber]) nums[c.cardNumber] = { count: 0, owned: 0, transit: 0 };
      nums[c.cardNumber].count++;
      var s = statuses[c.id] || "not_owned";
      if (s === "owned") nums[c.cardNumber].owned++;
      if (s === "in_transit") nums[c.cardNumber].transit++;
    });
    return Object.entries(nums).sort(function(a, b) {
      var an = parseInt(a[0]), bn = parseInt(b[0]);
      if (!isNaN(an) && !isNaN(bn)) return an - bn;
      return a[0].localeCompare(b[0]);
    });
  }, [statuses]);
  var filteredNums = useMemo(function() {
    if (!numSearch) return allNumbers;
    var q = numSearch.toLowerCase();
    return allNumbers.filter(function(n) { return n[0].toLowerCase().includes(q); });
  }, [allNumbers, numSearch]);
  var cardsForNum = useMemo(function() {
    if (!selectedNum) return [];
    return ALL_CARDS.filter(function(c) { return c.cardNumber === selectedNum && !HIDDEN_DUPES.has(c.id); });
  }, [selectedNum]);
  // Group by product, then list variants
  var productGroups = useMemo(function() {
    var map = {};
    cardsForNum.forEach(function(c) {
      if (!map[c.product]) map[c.product] = { cards: [], owned: 0, transit: 0, total: 0 };
      map[c.product].cards.push(c);
      map[c.product].total++;
      var s = statuses[c.id] || "not_owned";
      if (s === "owned") map[c.product].owned++;
      if (s === "in_transit") map[c.product].transit++;
    });
    return Object.entries(map).sort(function(a, b) { return a[0].localeCompare(b[0]); });
  }, [cardsForNum, statuses]);
  // Auto-expand all products when card number changes
  useEffect(function() {
    if (selectedNum) {
      var exp = {};
      productGroups.forEach(function(g) { exp[g[0]] = true; });
      setExpandedProducts(exp);
    }
  }, [selectedNum]);
  function toggleProduct(prod) {
    setExpandedProducts(function(prev) { var n = Object.assign({}, prev); n[prod] = !n[prod]; return n; });
  }
  function pickNum(num) {
    setSelectedNum(num);
    setSelectedCard(null);
    setVarSearch("");
  }
  // Strip redundant product prefix from variant name for display
  // Color map for variant names -- keys are lowercase, values are tailwind text colors with good contrast
  var VARIANT_COLORS = {
    "gold": "#FFD700", "yellow": "#FACC15", "orange": "#FB923C", "red": "#F87171",
    "pink": "#F472B6", "purple": "#C084FC", "blue": "#60A5FA", "aqua": "#22D3EE",
    "cyan": "#22D3EE", "teal": "#2DD4BF", "green": "#4ADE80", "lime": "#A3E635",
    "emerald": "#34D399", "silver": "#CBD5E1", "black": "#A1A1AA", "white": "#F1F5F9",
    "magenta": "#E879F9", "fuchsia": "#E879F9", "sapphire": "#6366F1", "ruby": "#EF4444",
    "amber": "#FBBF24", "lava": "#F97316", "platinum": "#E2E8F0", "sepia": "#D4A574",
    "aquamarine": "#5EEAD4", "navy": "#818CF8", "cream": "#FEF3C7", "camo": "#84CC16",
    "nebula": "#A78BFA", "nucleus": "#A78BFA", "cosmic": "#C084FC",
    "prism": "#E0E7FF", "ray": "#93C5FD", "wave": "#67E8F9", "rainbow": "#FB923C",
    "holiday": "#EF4444", "independence": "#60A5FA", "memorial": "#84CC16",
    "chrome": "#94A3B8", "refractor": "#93C5FD", "foil": "#FBBF24",
    "mojo": "#E879F9", "shimmer": "#E0E7FF", "sparkle": "#FDE68A",
    "holo": "#A5B4FC", "prizm": "#C4B5FD", "velocity": "#F472B6",
    "crackle": "#FB923C", "ghost": "#9CA3AF",
  };
  function getVariantColor(text) {
    var lower = text.toLowerCase();
    var keys = Object.keys(VARIANT_COLORS);
    // Find the most specific color match
    for (var i = 0; i < keys.length; i++) {
      if (lower.indexOf(keys[i]) !== -1) return VARIANT_COLORS[keys[i]];
    }
    return null;
  }
  // Parse variant into { prefix, highlight } -- prefix is boring shared text, highlight is the distinguishing part
  function parseVariant(card) {
    var v = card.cardSet || "Base";
    var prod = card.product.replace(/^\d{4}\s*/, "");
    // Strip product name prefix
    if (v.indexOf(prod) === 0) v = v.slice(prod.length).replace(/^\s*-\s*/, "").trim();
    if (!v) return { prefix: "", highlight: "Base" };
    // Further strip common boring prefixes: "[Base]", "- [Base] -", etc
    v = v.replace(/^\[?Base\]?\s*-?\s*/i, "").trim();
    if (!v) return { prefix: "", highlight: "Base" };
    // Split: if starts with "[SomeSubset]" or "Subset Name -", the subset is prefix
    var subsetMatch = v.match(/^(\[[^\]]+\])\s*-?\s*(.*)/);
    if (subsetMatch && subsetMatch[2]) {
      return { prefix: subsetMatch[1].replace(/[\[\]]/g, ""), highlight: subsetMatch[2] };
    }
    // If there's a dash separator, prefix is before, highlight is after
    var dashIdx = v.lastIndexOf(" - ");
    if (dashIdx > 0 && dashIdx < v.length - 3) {
      return { prefix: v.slice(0, dashIdx).trim(), highlight: v.slice(dashIdx + 3).trim() };
    }
    return { prefix: "", highlight: v };
  }
  var d = selectedCard ? (cardDetails[selectedCard.id] || {}) : {};
  var fs = selectedCard ? (statuses[selectedCard.id] || "not_owned") : "not_owned";
  var fcfg = STATUS_CONFIG[fs];
  // Stats for selected number
  var numStats = selectedNum ? (function() {
    var total = cardsForNum.length, own = 0, tr = 0;
    cardsForNum.forEach(function(c) { var s = statuses[c.id] || "not_owned"; if (s === "owned") own++; if (s === "in_transit") tr++; });
    return { total: total, owned: own, transit: tr, needed: total - own - tr };
  })() : null;
  return (
    <div className="flex flex-col h-full">
      {/* Card Number selector */}
      <div className="mb-2 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-gray-500 font-bold text-[10px]">CARD #</span>
          <input type="text" placeholder="Filter #..." value={numSearch} onChange={function(e) { setNumSearch(e.target.value); }} className="bg-gray-900 border border-gray-700 rounded px-1.5 py-0 outline-none text-white w-20 text-[11px]" />
          {selectedNum && numStats && (
            <span className="text-[10px] ml-auto">
              <span style={{color:"#22c55e"}}>{numStats.owned}</span>
              <span className="text-gray-600">/</span>
              <span style={{color:"#86efac"}}>{numStats.transit}</span>
              <span className="text-gray-600">/</span>
              <span className="text-red-400">{numStats.needed}</span>
              <span className="text-gray-600"> of {numStats.total}</span>
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-px max-h-32 overflow-y-auto">
          {filteredNums.map(function(entry) {
            var num = entry[0], info = entry[1];
            var active = num === selectedNum;
            var pct = info.count > 0 ? (info.owned + info.transit) / info.count : 0;
            // Smooth gradient: dark red (0%) → orange (50%) → green (100%)
            var r = pct < 0.5 ? 180 : Math.round(180 - (pct - 0.5) * 2 * 150);
            var g = pct < 0.5 ? Math.round(40 + pct * 2 * 140) : 180;
            var b = 30;
            var dotStyle = { backgroundColor: "rgb(" + r + "," + g + "," + b + ")", width: "6px", height: "6px", borderRadius: "9999px", display: "inline-block", marginRight: "2px", flexShrink: 0 };
            return (
              <button key={num} onClick={function() { pickNum(num); }} className={"px-1 py-0 rounded text-[10px] border flex items-center " + (active ? "bg-purple-900/70 border-purple-500 text-white font-bold" : "border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white")}>
                <span style={dotStyle} />{num}
              </button>
            );
          })}
        </div>
      </div>
      {/* Product groups with variants */}
      {selectedNum && (
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Quick status filter + variant search */}
          <div className="flex gap-1 mb-1.5 sticky top-0 bg-gray-950 z-10 pb-1 items-center flex-wrap">
            {[["all","All"],["not_owned","Need"],["owned","Own"],["in_transit","Transit"]].map(function(f) {
              return <button key={f[0]} onClick={function(){setStatusOnly(f[0]);}} className={"px-2 py-0 rounded text-[10px] border " + (statusOnly === f[0] ? "bg-gray-700 border-gray-500 text-white font-bold" : "border-gray-800 text-gray-500 hover:text-gray-300")}>{f[1]}</button>;
            })}
            <input type="text" placeholder="Search variants..." value={varSearch} onChange={function(e){setVarSearch(e.target.value);}} className="ml-auto bg-gray-900 border border-gray-700 rounded px-1.5 py-0 outline-none text-white text-[10px] w-32 focus:border-purple-500" />
            {varSearch && <button onClick={function(){setVarSearch("");}} className="text-gray-500 hover:text-gray-300 text-[10px]">✕</button>}
          </div>
          {productGroups.map(function(entry) {
            var prod = entry[0], info = entry[1];
            var isOpen = expandedProducts[prod];
            var pct = info.total > 0 ? Math.round((info.owned + info.transit) / info.total * 100) : 0;
            var barColor = pct >= 100 ? "bg-green-500" : pct > 0 ? "bg-green-700" : "bg-gray-700";
            // Filter cards by status + variant search
            var visibleCards = info.cards;
            if (statusOnly !== "all") visibleCards = visibleCards.filter(function(c) { return (statuses[c.id] || "not_owned") === statusOnly; });
            if (varSearch) {
              var vs = varSearch.toLowerCase();
              visibleCards = visibleCards.filter(function(c) { return (c.cardSet || "").toLowerCase().indexOf(vs) !== -1; });
            }
            if (filterAuto) visibleCards = visibleCards.filter(function(c) { return c.isAuto === "Yes"; });
            if (filterSN) visibleCards = visibleCards.filter(function(c) { return c.copies && c.copies !== ""; });
            if (filterMem) visibleCards = visibleCards.filter(function(c) { return c.isMem === "Yes"; });
            if (maxPR) { var maxVal = parseInt(maxPR); if (!isNaN(maxVal)) visibleCards = visibleCards.filter(function(c) { var pr = parseInt(c.copies); return !isNaN(pr) && pr <= maxVal; }); }
            if (filterAuto) visibleCards = visibleCards.filter(function(c) { return c.isAuto === "Yes"; });
            if (filterSN) visibleCards = visibleCards.filter(function(c) { return c.copies && c.copies !== ""; });
            if (filterMem) visibleCards = visibleCards.filter(function(c) { return c.isMem === "Yes"; });
            if (maxPR) { var maxVal = parseInt(maxPR); if (!isNaN(maxVal)) visibleCards = visibleCards.filter(function(c) { var pr = parseInt(c.copies); return !isNaN(pr) && pr <= maxVal; }); }
            if (filterAuto) visibleCards = visibleCards.filter(function(c) { return c.isAuto === "Yes"; });
            if (filterSN) visibleCards = visibleCards.filter(function(c) { return c.copies && c.copies !== ""; });
            if (filterMem) visibleCards = visibleCards.filter(function(c) { return c.isMem === "Yes"; });
            if (maxPR) { var maxVal = parseInt(maxPR); if (!isNaN(maxVal)) visibleCards = visibleCards.filter(function(c) { var pr = parseInt(c.copies); return !isNaN(pr) && pr <= maxVal; }); }
            if (filterAuto) visibleCards = visibleCards.filter(function(c) { return c.isAuto === "Yes"; });
            if (filterSN) visibleCards = visibleCards.filter(function(c) { return c.copies && c.copies !== ""; });
            if (filterMem) visibleCards = visibleCards.filter(function(c) { return c.isMem === "Yes"; });
            if (maxPR) { var maxVal = parseInt(maxPR); if (!isNaN(maxVal)) visibleCards = visibleCards.filter(function(c) { var pr = parseInt(c.copies); return !isNaN(pr) && pr <= maxVal; }); }
            if (visibleCards.length === 0 && (statusOnly !== "all" || varSearch)) return null;
            // If variant search active, auto-expand products with matches
            var showOpen = isOpen || (varSearch && visibleCards.length > 0);
            return (
              <div key={prod} className="mb-1.5">
                {/* Product header */}
                <button onClick={function(){toggleProduct(prod);}} className="w-full flex items-center gap-1.5 px-2 py-1 bg-gray-900 rounded hover:bg-gray-800 text-left">
                  <span className="text-gray-500 text-[10px]">{showOpen ? "▼" : "▶"}</span>
                  <span className="text-white font-bold text-[11px] flex-1 truncate">{prod}</span>
                  <span className="text-[9px] text-gray-500">{info.owned + info.transit}/{info.total}</span>
                  <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden flex-shrink-0">
                    <div className={"h-full rounded-full " + barColor} style={{width: pct + "%"}} />
                  </div>
                </button>
                {/* Variant list */}
                {showOpen && (
                  <div className="ml-2 mt-0.5 border-l border-gray-800 pl-1">
                    {visibleCards.map(function(card) {
                      var cs = statuses[card.id] || "not_owned";
                      var cfg = STATUS_CONFIG[cs];
                      var isSelected = selectedCard && selectedCard.id === card.id;
                      var pv = parseVariant(card);
                      var highlightColor = getVariantColor(pv.highlight);
                      return (
                        <div key={card.id} onClick={function(){setSelectedCard(card);}} className={"flex items-center gap-1.5 px-1.5 py-0.5 rounded cursor-pointer " + (isSelected ? "bg-purple-950/50 border border-purple-700" : "hover:bg-gray-800/60 border border-transparent")}>
                          <div className={"w-1.5 h-1.5 rounded-full flex-shrink-0 " + cfg.dot} />
                          <div className="flex-1 min-w-0 flex items-baseline gap-1 truncate">
                            {pv.prefix && <span className="text-gray-500 text-[9px] truncate flex-shrink">{pv.prefix}</span>}
                            <span className="font-bold text-[12px] truncate" style={highlightColor ? {color: highlightColor} : {color: cs === "owned" ? "#86efac" : cs === "in_transit" ? "#93c5fd" : "#e5e7eb"}}>{pv.highlight}</span>
                          </div>
                          {card.copies && <span className="text-gray-600 text-[9px] flex-shrink-0">/{card.copies}</span>}
                          {sspBadge(card.cardSet)}
                          {card.isAuto === "Yes" && <span className="text-yellow-500 text-[8px] font-bold flex-shrink-0 bg-yellow-950/40 px-0.5 rounded">A</span>}
                          {card.isMem === "Yes" && <span className="text-purple-500 text-[8px] font-bold flex-shrink-0 bg-purple-950/40 px-0.5 rounded">M</span>}
                          {/* Inline quick status buttons */}
                          <div className="flex gap-0.5 flex-shrink-0" onClick={function(e){e.stopPropagation();}}>
                            {PRIMARY_STATUSES.map(function(key) {
                              var c = STATUS_CONFIG[key];
                              return <button key={key} onClick={function(){setCardStatus(card.id, key);}} title={c.label} className={"rounded-full border " + (cs === key ? c.border + " " + c.bg : "border-gray-800 hover:border-gray-600")} style={{width:"12px",height:"12px",display:"flex",alignItems:"center",justifyContent:"center"}}><div className={"rounded-full " + (cs === key ? c.dot : "bg-gray-800")} style={{width:"6px",height:"6px"}} /></button>;
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {productGroups.length === 0 && <div className="text-gray-600 text-center text-[11px] mt-4">Select a card number above</div>}
        </div>
      )}
      {/* Detail card for selected variant */}
      {selectedCard && (
        <div className="flex-shrink-0 bg-gray-900 rounded-lg p-2 mt-2 border border-gray-800">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className={"w-2 h-2 rounded-full " + fcfg.dot} />
              <select value={fs} onChange={function(e) { setCardStatus(selectedCard.id, e.target.value); }} className={"bg-transparent border border-gray-700 rounded px-1 py-0 font-bold outline-none text-[11px] " + (fs === "owned" ? "text-green-300" : fs === "in_transit" ? "text-emerald-300" : "text-red-400")}>
                {PRIMARY_STATUSES.map(function(k) { return <option key={k} value={k}>{STATUS_CONFIG[k].label}</option>; })}
              </select>
              <button onClick={function(){setSelectedCard(null);}} className="text-gray-600 hover:text-gray-400 text-[10px]">✕</button>
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              {needsSync.has(selectedCard.id) && <span className="text-orange-400 font-medium px-1 py-0 bg-orange-950/30 rounded">Sync</span>}
              {(function() { var q = parseInt(d.qty) || 1; var isFS = forSaleFlags[selectedCard.id] || q > 1; return <button onClick={function() { toggleForSale(selectedCard.id); }} className={"px-1.5 py-0 rounded border text-[10px] " + (isFS ? "bg-pink-950/40 border-pink-600 text-pink-300" : "border-gray-700 text-gray-500 hover:text-gray-300")}>
                {q > 1 ? "Qty:" + q : isFS ? "$ Sale" : "$ Mark"}
              </button>; })()}
            </div>
          </div>
          <div className="text-white font-bold text-[12px]">{selectedCard.product}</div>
          <div className="text-gray-400 text-[10px]">#{selectedCard.cardNumber} -- {selectedCard.cardSet}{selectedCard.copies ? <span className="text-yellow-400 font-black ml-1" style={{fontSize:"12px"}}>{" /" + selectedCard.copies}</span> : ""} {sspBadge(selectedCard.cardSet)}</div>
          {selectedCard.isAuto === "Yes" && <span className="text-yellow-500 text-[8px] font-bold bg-yellow-950/40 px-1 rounded">AUTO</span>}
          {selectedCard.isMem === "Yes" && <span className="text-purple-500 text-[8px] font-bold bg-purple-950/40 px-1 rounded ml-0.5">MEM</span>}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1.5 pt-1.5 border-t border-gray-800 text-[10px]">
            {selectedCard.copies && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 font-black w-10">S/N</span>
                <input type="text" value={d.serial || ""} onChange={function(e) { updateCardDetail(selectedCard.id, "serial", e.target.value); }} placeholder="#" className="flex-1 bg-gray-950 border border-yellow-700 rounded px-1 py-0 text-yellow-300 font-black outline-none focus:border-yellow-500" style={{fontSize:"12px"}} />
              </div>
            )}
            {!hidePrices && <div className="flex items-center gap-1">
              <span className="text-gray-500 w-10">Price</span>
              <input type="text" value={d.price ? displayPrice(d.price) : ""} onChange={function(e) { updateCardDetail(selectedCard.id, "price", formatPrice(e.target.value)); }} onBlur={function() { if (d.price) updateCardDetail(selectedCard.id, "price", displayPrice(d.price)); }} placeholder="$0" className="flex-1 bg-gray-950 border border-gray-700 rounded px-1 py-0 text-white outline-none" />
              {(function() { var tp = getLowestTargetPrice(selectedCard.id, targetByCardId); return tp ? <span onClick={function() { setTargetCardFilter(selectedCard.id); setActiveTab("targets"); }} className="text-pink-400 font-bold cursor-pointer hover:text-pink-300 px-1 rounded bg-pink-950/30 border border-pink-800/50 text-[9px] whitespace-nowrap" title={"Lowest target: $" + tp.toFixed(2) + " — click to view"}>{"🎯$" + tp.toFixed(2)}</span> : null; })()}
            </div>}
            <div className="flex items-center gap-1">
              <span className="text-gray-500 w-10">Date</span>
              <input type="date" value={d.date || ""} onChange={function(e) { updateCardDetail(selectedCard.id, "date", e.target.value); }} className="flex-1 bg-gray-950 border border-gray-700 rounded px-1 py-0 text-white outline-none" />
            </div>
            <div className="flex items-center gap-1 col-span-2">
              <span className="text-gray-500 w-10">Notes</span>
              <input type="text" value={d.notes || ""} onChange={function(e) { updateCardDetail(selectedCard.id, "notes", e.target.value); }} placeholder="..." className="flex-1 bg-gray-950 border border-gray-700 rounded px-1 py-0 text-white outline-none" />
            </div>
            {(fs === "owned" || fs === "in_transit") && <div className="flex items-center gap-1">
              <span className="text-gray-500 w-10">Qty</span>
              <button onClick={function(){var q=Math.max(1,parseInt(d.qty||"1")-1); updateCardDetail(selectedCard.id,"qty",String(q));}} className="bg-gray-800 border border-gray-700 rounded w-5 h-5 text-gray-400 hover:text-white hover:bg-gray-700 font-bold text-[10px] flex items-center justify-center">-</button>
              <input type="number" min="1" value={d.qty || "1"} onChange={function(e) { updateCardDetail(selectedCard.id, "qty", e.target.value); }} className="w-10 text-center bg-gray-950 border border-gray-700 rounded px-1 py-0 text-white outline-none" />
              <button onClick={function(){var q=parseInt(d.qty||"1")+1; updateCardDetail(selectedCard.id,"qty",String(q));}} className="bg-gray-800 border border-gray-700 rounded w-5 h-5 text-gray-400 hover:text-white hover:bg-gray-700 font-bold text-[10px] flex items-center justify-center">+</button>
              {parseInt(d.qty || "1") > 1 && <span className="text-pink-400 text-[9px]">extra for sale/trade</span>}
            </div>}
          </div>
          {/* === SEARCH LINKS === */}
          <div className="mt-1.5 pt-1 border-t border-gray-800">
            <div className="text-gray-600 text-[8px] font-bold mb-0.5 tracking-wider">SEARCH MARKETPLACES</div>
            <div className="flex gap-1 flex-wrap text-[10px]">
              <a href={ebayUrl(selectedCard)} target="_blank" rel="noopener noreferrer" className="py-0.5 px-1.5 rounded bg-yellow-950/40 border border-yellow-800 text-yellow-400 hover:bg-yellow-900/40 font-bold" title="eBay: search for this exact variant">eBay Card</a>
              <a href={"https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent("Tyler Black " + ((selectedCard.product.match(/^(\d{4})\s/) || ["",""])[1]) + " " + selectedCard.cardNumber + " " + stripBrand(selectedCard.product.replace(/^\d{4}\s*/, "").replace(/\s*\([^)]*\)/g, ""))) + "&_sacat=212"} target="_blank" rel="noopener noreferrer" className="py-0.5 px-1.5 rounded bg-yellow-950/30 border border-yellow-900 text-yellow-500 hover:bg-yellow-900/40 font-bold" title="eBay: search for all variants of this card # in this set">eBay Set</a>
              {superSearchMode && <button onClick={function(e) { e.preventDefault(); var urls = ebayUrlsSuper(selectedCard); urls.forEach(function(url) { window.open(url, "_blank"); }); }} className="py-0.5 px-1.5 rounded bg-yellow-800/50 border border-yellow-600 text-yellow-200 hover:bg-yellow-700/50 font-bold" title="Open multiple eBay search variations">eBay Super</button>}
              <a href={comcUrl(selectedCard)} target="_blank" rel="noopener noreferrer" className="py-0.5 px-1.5 rounded bg-orange-950/40 border border-orange-800 text-orange-400 hover:bg-orange-900/40 font-bold" title="COMC: search for this specific card">COMC Card</a>
              <a href={"https://www.comc.com/Players/Baseball/Tyler_Black/c389004,+" + (selectedCard.product.replace(/'/g, "").replace(/\s*\([^)]*\)/g, "") + " " + selectedCard.cardNumber).replace(/[&\/]/g, " ").replace(/\s+/g, " ").trim().replace(/ /g, "+")} target="_blank" rel="noopener noreferrer" className="py-0.5 px-1.5 rounded bg-orange-950/30 border border-orange-900 text-orange-500 hover:bg-orange-900/40 font-bold" title="COMC: search for all variants of this card # in this set">COMC Set</a>
            </div>
          </div>
          {/* === REFERENCE LINKS === */}
          <div className="mt-1 pt-1 border-t border-gray-800">
            <div className="text-gray-600 text-[8px] font-bold mb-0.5 tracking-wider">REFERENCE & NAVIGATE</div>
            <div className="flex gap-1 flex-wrap text-[10px]">
              <a href={tcdbUrl(selectedCard)} target="_blank" rel="noopener noreferrer" className="py-0.5 px-1.5 rounded bg-cyan-950/40 border border-cyan-800 text-cyan-400 hover:bg-cyan-900/40 font-bold">TCDB</a>
              <a href={pt130Url(selectedCard)} target="_blank" rel="noopener noreferrer" className="py-0.5 px-1.5 rounded bg-teal-950/40 border border-teal-800 text-teal-400 hover:bg-teal-900/40 font-bold" title="130point: check sold prices">130point</a>
              <button onClick={function() { var prodShort = selectedCard.product.replace(/^\d{4}\s*/, ""); setPricesSearchFilter(prodShort + " " + selectedCard.cardNumber); setActiveTab("prices"); }} className="py-0.5 px-1.5 rounded bg-indigo-950/40 border border-indigo-700 text-indigo-400 hover:bg-indigo-900/40 font-bold" title="View price history for this card">Prices</button>
              <button onClick={function() { setDetailedProductFilter(selectedCard.product); setDetailedCardNumFilter(selectedCard.cardNumber); setDetailedStatusFilter("all"); setDetailedSnFilter("all"); setActiveTab("detailed"); }} className="py-0.5 px-1.5 rounded bg-purple-950/40 border border-purple-700 text-purple-400 hover:bg-purple-900/40 font-bold" title="View all variants of this card # in Detailed tab">{"View #" + selectedCard.cardNumber}</button>
              <button onClick={function() { setDetailedProductFilter(selectedCard.product); setDetailedCardNumFilter(null); setDetailedStatusFilter("all"); setDetailedSnFilter("all"); setActiveTab("detailed"); }} className="py-0.5 px-1.5 rounded bg-gray-800/60 border border-gray-700 text-gray-400 hover:bg-gray-700/50 font-bold" title="View full set in Detailed tab">Full Set</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function DetailedPanel({ statuses, cardDetails, updateCardDetail, setCardStatus, needsSync, initialSnFilter, initialStatusFilter, initialCardId = null, setDetailedCardId, initialProductFilter = null, setDetailedProductFilter, initialCardNumFilter = null, setDetailedCardNumFilter, editCustomCardById, customEditVer, targetByCardId, setActiveTab, setTargetCardFilter, hidePrices }) {
  var [dFilter, setDFilter] = useState(initialStatusFilter || "all");
  var [dYear, setDYear] = useState("all");
  var [dProduct, setDProduct] = useState(initialProductFilter || "all");
  var [dSearch, setDSearch] = useState("");
  var [dCardNum, setDCardNum] = useState(initialCardNumFilter || "");
  var [dSnFilter, setDSnFilter] = useState(initialSnFilter || "all");
  var [dPage, setDPage] = useState(0);
  var [sortCol, setSortCol] = useState(null);
  var [sortDir, setSortDir] = useState("asc");
  var [batchMode, setBatchMode] = useState(false);
  var [batchSelected, setBatchSelected] = useState(new Set());
  var [batchBusy, setBatchBusy] = useState(false);
  
  // Reset filters when initial props change
  useEffect(function() {
    if (initialSnFilter) setDSnFilter(initialSnFilter);
  }, [initialSnFilter]);
  
  useEffect(function() {
    if (initialStatusFilter) setDFilter(initialStatusFilter);
  }, [initialStatusFilter]);
  
  useEffect(function() {
    if (initialCardId) {
      var targetCard = CARD_BY_ID[initialCardId];
      if (targetCard) {
        setDFilter("all"); setDYear("all"); setDSearch(""); setDSnFilter("all");
        setDProduct(targetCard.product);
        setDCardNum(targetCard.cardNumber);
      } else {
        setDFilter("all"); setDYear("all"); setDProduct("all"); setDSearch(""); setDSnFilter("all"); setDCardNum("");
      }
      setDPage(0);
      if (setDetailedCardId) setDetailedCardId(null);
    }
  }, [initialCardId]);
  
  useEffect(function() {
    if (initialProductFilter) {
      setDProduct(initialProductFilter);
      setDYear(initialProductFilter.slice(0, 4));
      setDFilter("all"); setDSearch(""); setDSnFilter("all"); setDPage(0);
      if (initialCardNumFilter) { setDCardNum(initialCardNumFilter); }
      else { setDCardNum(""); }
      if (setDetailedProductFilter) setDetailedProductFilter(null);
      if (setDetailedCardNumFilter) setDetailedCardNumFilter(null);
    }
  }, [initialProductFilter, initialCardNumFilter]);
  
  var PAGE_SIZE = 50;
  var years = useMemo(function() { return [...new Set(ALL_CARDS.map(function(c) { return c.product.slice(0,4); }))].sort(); }, []);
  var filteredProducts = useMemo(function() {
    var cards = dYear === "all" ? ALL_CARDS : ALL_CARDS.filter(function(c) { return c.product.startsWith(dYear); });
    return [...new Set(cards.map(function(c) { return c.product; }))].sort();
  }, [dYear]);
  var filtered = useMemo(function() {
    var s = dSearch.toLowerCase();
    return ALL_CARDS.filter(function(card) {
      var cs = statuses[card.id] || "not_owned";
      var cardDetail = cardDetails[card.id] || {};
      
      // Status filter
      if (dFilter === "acquired" && cs !== "owned" && cs !== "in_transit") return false;
      if (dFilter !== "all" && dFilter !== "acquired" && cs !== dFilter) return false;
      
      // Year filter
      if (dYear !== "all" && !card.product.startsWith(dYear)) return false;
      
      // Product filter
      if (dProduct !== "all" && card.product !== dProduct) return false;
      
      // Universal search — matches product, variant, card number, serial, notes
      if (s) {
        var haystack = (card.product + " " + card.cardSet + " " + card.cardNumber + " " + (cardDetail.serial || "") + " " + (cardDetail.notes || "")).toLowerCase();
        if (!haystack.includes(s)) return false;
      }
      
      // Card number filter (exact, from external navigation)
      if (dCardNum && card.cardNumber !== dCardNum) return false;
      
      // SN filter (print run) — extended with range and SP/SSP support
      if (dSnFilter === "1of1" && card.copies !== "1") return false;
      else if (dSnFilter === "numbered" && !card.copies) return false;
      else if (dSnFilter === "unnumbered" && card.copies) return false;
      else if (dSnFilter === "not_1of1" && card.copies === "1") return false;
      else if (dSnFilter === "missing_sn" && !isMissingSN(card, cardDetails)) return false;
      else if (dSnFilter === "sp_ssp") {
        if (!SSP_TAGS[card.cardSet]) return false;
      }
      else if (dSnFilter === "ssp_only") {
        if (SSP_TAGS[card.cardSet] !== "SSP") return false;
      }
      else if (typeof dSnFilter === "string" && dSnFilter.startsWith("sn_gte_")) {
        var minSN = parseInt(dSnFilter.slice(7));
        var pr = parseInt(card.copies);
        if (card.copies && !isNaN(pr)) { if (pr < minSN) return false; }
        else return false; // exclude unnumbered in range mode
      }
      
      return true;
    });
  }, [statuses, cardDetails, dFilter, dYear, dProduct, dSearch, dCardNum, dSnFilter, customEditVer]);
  var sorted = useMemo(function() {
    if (!sortCol) return filtered;
    return [...filtered].sort(function(a, b) {
      var av, bv;
      var da = cardDetails[a.id] || {}, db = cardDetails[b.id] || {};
      if (sortCol === "status") { av = statuses[a.id] || "not_owned"; bv = statuses[b.id] || "not_owned"; }
      else if (sortCol === "product") { av = a.product; bv = b.product; }
      else if (sortCol === "number") { av = a.cardNumber; bv = b.cardNumber; }
      else if (sortCol === "variant") { av = a.cardSet; bv = b.cardSet; }
      else if (sortCol === "sn") { av = a.copies || ""; bv = b.copies || ""; }
      else if (sortCol === "serial") { av = da.serial || ""; bv = db.serial || ""; }
      else if (sortCol === "price") { av = parseFloat((da.price || "0").replace(/[^0-9.]/g, "")) || 0; bv = parseFloat((db.price || "0").replace(/[^0-9.]/g, "")) || 0; }
      else if (sortCol === "date") { av = da.date || ""; bv = db.date || ""; }
      else if (sortCol === "notes") { av = da.notes || ""; bv = db.notes || ""; }
      else { av = ""; bv = ""; }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortCol, sortDir, statuses, cardDetails]);
  var totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  var pageCards = sorted.slice(dPage * PAGE_SIZE, (dPage + 1) * PAGE_SIZE);
  useEffect(function() { setDPage(0); }, [dFilter, dYear, dProduct, dSearch, dCardNum, dSnFilter, sortCol, sortDir]);
  useEffect(function() { if (dProduct !== "all" && !filteredProducts.includes(dProduct)) setDProduct("all"); }, [dYear]);
  function toggleSort(col) {
    if (sortCol === col) { setSortDir(sortDir === "asc" ? "desc" : "asc"); }
    else { setSortCol(col); setSortDir("asc"); }
  }
  function toggleBatchCard(cardId) {
    setBatchSelected(function(prev) {
      var next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId); else next.add(cardId);
      return next;
    });
  }
  function selectAllPage() {
    setBatchSelected(function(prev) {
      var next = new Set(prev);
      pageCards.forEach(function(c) { next.add(c.id); });
      return next;
    });
  }
  function selectAllFiltered() {
    setBatchSelected(function(prev) {
      var next = new Set(prev);
      sorted.forEach(function(c) { next.add(c.id); });
      return next;
    });
  }
  function deselectAll() { setBatchSelected(new Set()); }
  function applyBatchStatus(newStatus) {
    if (batchSelected.size === 0) return;
    setBatchBusy(true);
    var ids = Array.from(batchSelected);
    var i = 0;
    function next() {
      if (i >= ids.length) { setBatchBusy(false); setBatchSelected(new Set()); return; }
      var batch = ids.slice(i, i + 20);
      batch.forEach(function(id) { setCardStatus(id, newStatus); });
      i += 20;
      setTimeout(next, 50);
    }
    next();
  }
  // Clear batch selection when exiting batch mode
  useEffect(function() { if (!batchMode) setBatchSelected(new Set()); }, [batchMode]);
  function colHeader(col, label) {
    var arrow = sortCol === col ? (sortDir === "asc" ? " \u25B2" : " \u25BC") : "";
    return <th key={col} className="px-1 py-1 text-left font-medium text-gray-400 cursor-pointer hover:text-white whitespace-nowrap select-none" style={{fontSize: "10px"}} onClick={function() { toggleSort(col); }}>{label}{arrow}</th>;
  }
  return (
    <div>
      <div className="flex gap-1 mb-1 flex-wrap items-center" style={{fontSize:"clamp(9px,1.1vw,11px)"}}>
        <select value={dFilter} onChange={function(e) { setDFilter(e.target.value); }} className="bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5">
          <option value="all">Status</option>
          <option value="acquired">Owned+Transit</option>
          {PRIMARY_STATUSES.map(function(k) { return <option key={k} value={k}>{STATUS_CONFIG[k].label}</option>; })}
        </select>
        <select value={dYear} onChange={function(e) { setDYear(e.target.value); }} className="bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5">
          <option value="all">Year</option>
          {years.map(function(y) { return <option key={y} value={y}>{y}</option>; })}
        </select>
        <select value={dProduct} onChange={function(e) { setDProduct(e.target.value); }} className="bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5 flex-1 min-w-0">
          <option value="all">Product ({filteredProducts.length})</option>
          {filteredProducts.map(function(p) { return <option key={p} value={p}>{p}</option>; })}
        </select>
        <select value={dSnFilter} onChange={function(e) { setDSnFilter(e.target.value); }} className="bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5">
          <option value="all">Print Run</option>
          <option value="1of1">1/1 Only</option>
          <option value="numbered">Numbered</option>
          <option value="unnumbered">Unnumbered</option>
          <option value="not_1of1">Excl 1/1</option>
          <option value="sp_ssp">SP + SSP</option>
          <option value="missing_sn">Missing SN (SN?)</option>
          <option value="ssp_only">SSP Only</option>
          <option value="sn_gte_10">SN {"\u2265"} 10</option>
          <option value="sn_gte_25">SN {"\u2265"} 25</option>
          <option value="sn_gte_50">SN {"\u2265"} 50</option>
          <option value="sn_gte_100">SN {"\u2265"} 100</option>
        </select>
        <input type="text" placeholder="Search all..." value={dSearch} onChange={function(e) { setDSearch(e.target.value); }} className="bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5 w-28" />
        {dCardNum && (
          <span className="flex items-center gap-0.5 bg-purple-900/50 border border-purple-600 rounded px-1.5 py-0.5 text-purple-300 font-bold">
            {"#" + dCardNum}
            <button onClick={function() { setDCardNum(""); }} className="text-purple-400 hover:text-white ml-0.5">{"\u2715"}</button>
          </span>
        )}
        <span className="text-gray-500 self-center">{sorted.length}</span>
        <button onClick={function() { setBatchMode(!batchMode); }} className={"px-2 py-0.5 rounded text-xs font-bold border " + (batchMode ? "bg-purple-900 border-purple-600 text-purple-200" : "bg-gray-800 border-gray-600 text-gray-400 hover:text-white")}>{batchMode ? "Exit Batch" : "Batch"}</button>
      </div>
      {batchMode && (
        <div className="flex gap-1 mb-1 items-center flex-wrap" style={{fontSize:"clamp(9px,1.1vw,11px)"}}>
          <span className="text-purple-300 font-bold">{batchSelected.size} selected</span>
          <button onClick={selectAllPage} className="px-2 py-0.5 bg-gray-800 border border-gray-600 rounded text-gray-300 hover:text-white">Page ({pageCards.length})</button>
          <button onClick={selectAllFiltered} className="px-2 py-0.5 bg-gray-800 border border-gray-600 rounded text-gray-300 hover:text-white">All ({sorted.length})</button>
          <button onClick={deselectAll} className="px-2 py-0.5 bg-gray-800 border border-gray-600 rounded text-gray-300 hover:text-white">Clear</button>
          <span className="text-gray-600 mx-1">|</span>
          <span className="text-gray-500">Set to:</span>
          {PRIMARY_STATUSES.map(function(k) { var cfg = STATUS_CONFIG[k]; return (
            <button key={k} onClick={function() { applyBatchStatus(k); }} disabled={batchSelected.size === 0 || batchBusy} className={"px-2 py-0.5 rounded border font-bold disabled:opacity-30 " + cfg.bg + " border-gray-600 " + (k === "owned" ? "text-green-300" : k === "in_transit" ? "text-emerald-300" : k === "for_sale" ? "text-pink-400" : "text-gray-400")}>{cfg.label}</button>
          ); })}
          {batchBusy && <span className="text-yellow-400 animate-pulse ml-1">Applying...</span>}
        </div>
      )}
      {!hidePrices && (function() {
        var spentTotal = 0, spentCount = 0, needCount = 0, scannerTotal = 0, scannerCount = 0;
        for (var si = 0; si < sorted.length; si++) {
          var sc = sorted[si], sd = cardDetails[sc.id] || {}, ss = statuses[sc.id] || "not_owned";
          var pp = parseFloat((sd.price || "").replace(/[$,]/g, ""));
          if (pp > 0 && (ss === "owned" || ss === "in_transit")) { spentTotal += pp; spentCount++; }
          if (ss === "not_owned") {
            needCount++;
            var sp = getLowestScannerPrice(sc);
            if (sp) { scannerTotal += sp; scannerCount++; }
          }
        }
        if (spentCount === 0 && scannerCount === 0) return null;
        return <div className="flex gap-3 mb-1 flex-wrap items-center" style={{fontSize:"clamp(9px,1.1vw,11px)"}}>
          {spentCount > 0 && <span className="font-bold px-2 py-0.5 rounded border" style={{color:"#FFC52F",background:"rgba(212,160,23,0.1)",borderColor:"rgba(212,160,23,0.3)"}}>{"💰 $" + spentTotal.toFixed(2) + " spent (" + spentCount + " cards)"}</span>}
          {scannerCount > 0 && <span className="px-2 py-0.5 rounded border" style={{color:"#7abfff",background:"rgba(91,155,213,0.1)",borderColor:"rgba(91,155,213,0.3)"}}>{"🔍 " + scannerCount + "/" + needCount + " needed have scanner prices — $" + scannerTotal.toFixed(2) + " cheapest total"}</span>}
        </div>;
      })()}
      <style>{"\
        @media (max-width: 900px) { .dt-notes { display: none !important; } }\
        @media (max-width: 750px) { .dt-date { display: none !important; } .dt-trend { display: none !important; } }\
      "}</style>
      <div>
        <table className="w-full" style={{fontSize: "10px", tableLayout: "auto"}}>
          <thead className="bg-gray-800 sticky top-0">
            <tr>
              {batchMode && <th className="px-0.5 py-0.5 w-5"><input type="checkbox" checked={pageCards.length > 0 && pageCards.every(function(c) { return batchSelected.has(c.id); })} onChange={function(e) { if (e.target.checked) selectAllPage(); else { setBatchSelected(function(prev) { var next = new Set(prev); pageCards.forEach(function(c) { next.delete(c.id); }); return next; }); } }} className="accent-purple-500" /></th>}
              {colHeader("status", "St")}
              {colHeader("product", "Product")}
              {colHeader("number", "#")}
              {colHeader("variant", "Variant")}
              <th className="px-1 py-0.5 text-left font-black text-yellow-400 cursor-pointer hover:text-yellow-200 whitespace-nowrap select-none" style={{fontSize: "10px"}} onClick={function() { toggleSort("sn"); }}>{"SN" + (sortCol === "sn" ? (sortDir === "asc" ? " \u25B2" : " \u25BC") : "")}</th>
              {!hidePrices && colHeader("price", "$")}
              <th className="dt-date px-0.5 py-0.5 text-left font-medium text-gray-400 cursor-pointer hover:text-white whitespace-nowrap select-none" style={{fontSize: "10px"}} onClick={function() { toggleSort("date"); }}>{"Date" + (sortCol === "date" ? (sortDir === "asc" ? " \u25B2" : " \u25BC") : "")}</th>
              <th className="dt-notes px-0.5 py-0.5 text-left font-medium text-gray-400 cursor-pointer hover:text-white whitespace-nowrap select-none" style={{fontSize: "10px"}} onClick={function() { toggleSort("notes"); }}>{"Notes" + (sortCol === "notes" ? (sortDir === "asc" ? " \u25B2" : " \u25BC") : "")}</th>
              {!hidePrices && <th className="dt-trend px-0.5 py-0.5 text-left font-medium text-gray-400" style={{fontSize:"9px"}}></th>}
              <th className="px-0.5 py-0.5 text-left font-medium text-gray-400" style={{fontSize:"9px"}}></th>
            </tr>
          </thead>
          <tbody>
            {pageCards.map(function(card) {
              var s = statuses[card.id] || "not_owned";
              var cfg = STATUS_CONFIG[s];
              var d = cardDetails[card.id] || {};
              return (
                <tr key={card.id} className={"border-t border-gray-800 " + cfg.bg + (batchSelected.has(card.id) ? " ring-1 ring-purple-500/50" : "")}>
                  {batchMode && <td className="px-0.5 py-0.5"><input type="checkbox" checked={batchSelected.has(card.id)} onChange={function() { toggleBatchCard(card.id); }} className="accent-purple-500" /></td>}
                  <td className="px-0.5 py-0.5">
                    <select value={s} onChange={function(e) { setCardStatus(card.id, e.target.value); }} className={"bg-transparent border border-gray-700 rounded px-0 py-0 " + (s === "owned" ? "text-green-300" : s === "in_transit" ? "text-emerald-300" : s === "for_sale" ? "text-pink-400" : "text-gray-400")} style={{fontSize: "9px", width:"4.5em"}}>
                      {PRIMARY_STATUSES.map(function(k) { return <option key={k} value={k}>{STATUS_CONFIG[k].label}</option>; })}
                    </select>
                  </td>
                  <td className="px-0.5 py-0.5 text-gray-300 truncate" style={{maxWidth:"clamp(80px,11vw,180px)", fontSize:"9px"}} title={card.product}>{card.product}</td>
                  <td className="px-0.5 py-0.5 text-white font-medium whitespace-nowrap">{card.cardNumber}</td>
                  <td className="px-0.5 py-0.5 text-gray-400 truncate" style={{fontSize: "9px", maxWidth:"clamp(90px,13vw,220px)"}} title={card.cardSet}>{card.cardSet}{sspBadge(card.cardSet) ? <span className="ml-0.5">{sspBadge(card.cardSet)}</span> : null}</td>
                  <td className="px-0.5 py-0.5 whitespace-nowrap">{(function(){
                    var dd = cardDetails[card.id] || {};
                    var eff = dd.printRun && dd.printRun !== "?" ? dd.printRun : card.copies;
                    var snText = eff ? "/" + eff : isMissingSN(card, cardDetails) ? null : null;
                    var serialVal = dd.serial || "";
                    var hasSN = card.copies || isMissingSN(card, cardDetails);
                    var isMSN = isMissingSN(card, cardDetails);
                    return <span className="flex items-center gap-0.5">
                      {eff ? <span className="text-yellow-400 font-black" style={{fontSize:"11px"}}>{"/" + eff}</span> : isMSN ? <span className="text-orange-400 font-black text-[9px]">SN?</span> : <span className="text-gray-700">-</span>}
                      {hasSN && <input type="text" value={serialVal} onChange={function(e) { updateCardDetail(card.id, "serial", e.target.value); }} placeholder="#" className={"bg-transparent border-b font-black focus:border-yellow-400 w-8 outline-none " + (serialVal ? "text-yellow-300 border-yellow-700" : isMSN ? "text-gray-500 border-orange-700" : "text-gray-500 border-gray-700")} style={{fontSize: "11px"}} />}
                    </span>;
                  })()}</td>
                  {!hidePrices && <td className="px-0.5 py-0.5"><input type="text" value={d.price ? displayPrice(d.price) : ""} onChange={function(e) { updateCardDetail(card.id, "price", formatPrice(e.target.value)); }} onBlur={function() { if (d.price) updateCardDetail(card.id, "price", displayPrice(d.price)); }} placeholder="-" className="bg-transparent border-b border-gray-700 focus:border-gray-400 w-12 text-white outline-none" style={{fontSize: "9px"}} />{(function() { var tp = getLowestTargetPrice(card.id, targetByCardId); return tp ? <span onClick={function() { setTargetCardFilter(card.id); setActiveTab("targets"); }} className="text-pink-400 font-bold cursor-pointer hover:text-pink-300 text-[7px] ml-0.5" title={"🎯 $" + tp.toFixed(2)}>{"🎯"}</span> : null; })()}{(function() { if (s !== "not_owned") return null; var sp = getLowestScannerPrice(card); return sp ? <span className="text-cyan-500 text-[7px] ml-0.5" title={"Cheapest: $" + sp.toFixed(2)}>{"🔍"}</span> : null; })()}</td>}
                  <td className="dt-date px-0.5 py-0.5"><input type="date" value={d.date || ""} onChange={function(e) { updateCardDetail(card.id, "date", e.target.value); }} className="bg-transparent border-b border-gray-700 focus:border-gray-400 w-24 text-gray-400 outline-none" style={{fontSize: "9px"}} /></td>
                  <td className="dt-notes px-0.5 py-0.5"><input type="text" value={d.notes || ""} onChange={function(e) { updateCardDetail(card.id, "notes", e.target.value); }} placeholder="-" className="bg-transparent border-b border-gray-700 focus:border-gray-400 text-gray-500 outline-none" style={{fontSize: "9px", width:"clamp(40px,8vw,120px)"}} /></td>
                  {!hidePrices && <td className="dt-trend px-0 py-0.5"><Sparkline card={card} width={30} height={12} /></td>}
                  <td className="px-0.5 py-0.5 whitespace-nowrap">{needsSync.has(card.id) && <span className="text-pink-400 mr-0.5" title="Needs TCDB sync">!</span>}<a href={tcdbUrl(card)} target="_blank" rel="noopener noreferrer" className={"font-bold hover:text-cyan-200 " + (TCDB_FLAGS[card.id] ? "text-red-400" : TCDB_USER_FIXES[card.id] ? "text-green-400" : "text-cyan-400")}>T</a>{" "}<a href="#" onClick={function(e) { handleEbayClick(card, e); }} className="font-bold text-yellow-400 hover:text-yellow-200">E</a>{" "}<a href={comcUrl(card)} target="_blank" rel="noopener noreferrer" className="font-bold text-orange-400 hover:text-orange-200">C</a>{card.id >= 10000 && editCustomCardById ? <span>{" "}<button onClick={function(){editCustomCardById(card.id);}} className="text-yellow-500 hover:text-yellow-300" title="Edit custom card">✏</button></span> : null}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-1" style={{fontSize:"clamp(9px,1.1vw,11px)"}}>
          <button onClick={function() { setDPage(function(p) { return Math.max(0, p-1); }); }} disabled={dPage === 0} className="px-2 py-0 bg-gray-900 rounded disabled:opacity-30">{"\u2190"}</button>
          <span className="text-gray-500">{dPage+1}/{totalPages}</span>
          <button onClick={function() { setDPage(function(p) { return Math.min(totalPages-1, p+1); }); }} disabled={dPage >= totalPages-1} className="px-2 py-0 bg-gray-900 rounded disabled:opacity-30">{"\u2192"}</button>
        </div>
      )}
    </div>
  );
}
function googleImgUrl(card) {
  return "https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(card.product + " " + card.cardNumber + " " + card.cardSet);
}
function variantOnlyUrl(card) {
  var q = card.product + " " + card.cardNumber + " " + card.cardSet;
  return "https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(q);
}
function CleanupPanel({ statuses, cardDetails, updateCardDetail, setCardStatus, forSaleFlags, toggleForSale, hidePrices }) {
  var [mode, setMode] = useState("issues");
  var [cPage, setCPage] = useState(0);
  var [cSearch, setCSearch] = useState("");
  var [cYear, setCYear] = useState("all");
  var [cProduct, setCProduct] = useState("all");
  var [issueType, setIssueType] = useState("all");
  var [editingId, setEditingId] = useState(null);
  var [editVals, setEditVals] = useState({});
  var PAGE_SIZE = 25;

  function getIssues(card) {
    var issues = [];
    var s = statuses[card.id] || "not_owned";
    var d = cardDetails[card.id] || {};
    var isAcquired = s === "owned" || s === "in_transit";
    if (NOT_ON_TCDB.has(card.id)) { issues.push("not_on_tcdb"); return issues; }
    if (MISSING_FROM_TCDB.has(card.id)) { issues.push("missing_from_tcdb"); return issues; }
    if (EXTRA_DUPES.has(card.id)) { issues.push("extra_duplicate"); return issues; }
    if (isAcquired && (card.copies || isMissingSN(card, cardDetails)) && !d.serial) issues.push("missing_serial");
    if (isAcquired && !d.price) issues.push("missing_price");
    if (isAcquired && !d.date) issues.push("missing_date");
    if (isAcquired && d.notes && /\?|check|verify|confirm|wrong|fix|unsure/i.test(d.notes)) issues.push("flagged_notes");
    if (EBAY_IDS.has(card.id)) {
      if (!isAcquired) { issues.push("ebay_mislog"); }
      else {
        var hasMulti = MULTI_EBAY.has(card.id);
        var hasCOMCMulti = d.notes && /\+\d+ more cop/i.test(d.notes);
        if (hasMulti || hasCOMCMulti) issues.push("ebay_mislog");
      }
    }
    return issues;
  }

  var years = useMemo(function() { return [...new Set(ALL_CARDS.map(function(c) { return c.product.slice(0,4); }))].sort(); }, []);
  var filteredProducts = useMemo(function() {
    var cards = cYear === "all" ? ALL_CARDS : ALL_CARDS.filter(function(c) { return c.product.startsWith(cYear); });
    return [...new Set(cards.map(function(c) { return c.product; }))].sort();
  }, [cYear]);

  var issueCards = useMemo(function() {
    var s = cSearch.toLowerCase();
    return ALL_CARDS.filter(function(card) {
      var st = statuses[card.id] || "not_owned";
      var isAcquired = st === "owned" || st === "in_transit";
      if (mode === "issues") {
        var issues = getIssues(card);
        if (issues.length === 0) return false;
        if (!isAcquired && !issues.includes("ebay_mislog") && !issues.includes("not_on_tcdb") && !issues.includes("extra_duplicate") && !issues.includes("missing_from_tcdb")) return false;
        if (issueType !== "all" && !issues.includes(issueType)) return false;
      }
      if (cYear !== "all" && !card.product.startsWith(cYear)) return false;
      if (cProduct !== "all" && card.product !== cProduct) return false;
      if (s && !card.product.toLowerCase().includes(s) && !card.cardSet.toLowerCase().includes(s) && !card.cardNumber.toLowerCase().includes(s)) return false;
      return true;
    }).sort(function(a, b) {
      return getIssues(b).length - getIssues(a).length;
    });
  }, [statuses, cardDetails, mode, issueType, cYear, cProduct, cSearch]);

  var issueCounts = useMemo(function() {
    var counts = { missing_serial: 0, missing_price: 0, missing_date: 0, flagged_notes: 0, ebay_mislog: 0, not_on_tcdb: 0, missing_from_tcdb: 0, extra_duplicate: 0, total: 0 };
    ALL_CARDS.forEach(function(card) {
      var issues = getIssues(card);
      if (issues.length > 0) counts.total++;
      issues.forEach(function(i) { counts[i] = (counts[i] || 0) + 1; });
    });
    return counts;
  }, [statuses, cardDetails]);

  var totalPages = Math.ceil(issueCards.length / PAGE_SIZE);
  var pageCards = issueCards.slice(cPage * PAGE_SIZE, (cPage + 1) * PAGE_SIZE);
  useEffect(function() { setCPage(0); }, [mode, issueType, cYear, cProduct, cSearch]);
  useEffect(function() { if (cProduct !== "all" && !filteredProducts.includes(cProduct)) setCProduct("all"); }, [cYear]);

  function startEdit(card) {
    var d = cardDetails[card.id] || {};
    setEditingId(card.id);
    setEditVals({ serial: d.serial || "", price: d.price ? displayPrice(d.price) : "", date: d.date || "", notes: d.notes || "" });
  }
  function saveEdit(cardId) {
    if (editVals.serial !== undefined) updateCardDetail(cardId, "serial", editVals.serial);
    if (editVals.price !== undefined) updateCardDetail(cardId, "price", formatPrice(editVals.price));
    if (editVals.date !== undefined) updateCardDetail(cardId, "date", editVals.date);
    if (editVals.notes !== undefined) updateCardDetail(cardId, "notes", editVals.notes);
    setEditingId(null);
    setEditVals({});
  }
  function cancelEdit() { setEditingId(null); setEditVals({}); }

  var issueLabels = { missing_serial: "Missing Serial #", missing_price: "Missing Price", missing_date: "Missing Date", flagged_notes: "Flagged Notes", ebay_mislog: "eBay Mislog?", not_on_tcdb: "Not on TCDB", missing_from_tcdb: "Pending TCDB Add", extra_duplicate: "Extra Duplicate" };
  var issueColors = { missing_serial: "text-red-400", missing_price: "text-yellow-400", missing_date: "text-orange-400", flagged_notes: "text-purple-400", ebay_mislog: "text-pink-400", not_on_tcdb: "text-sky-400", missing_from_tcdb: "text-amber-400", extra_duplicate: "text-teal-400" };

  return (
    <div>
      <div className="mb-4 p-3 bg-gray-800/60 rounded-lg border border-gray-700">
        <div className="text-sm font-semibold text-amber-400 mb-2">Data Issues Overview</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between cursor-pointer hover:bg-gray-700 rounded px-1 -mx-1" onClick={function(){setMode("issues");setIssueType("missing_serial");}}><span className="text-red-400">Missing Serial #</span><span className="text-white font-bold">{issueCounts.missing_serial}</span></div>
          <div className="flex justify-between cursor-pointer hover:bg-gray-700 rounded px-1 -mx-1" onClick={function(){setMode("issues");setIssueType("missing_price");}}><span className="text-yellow-400">Missing Price</span><span className="text-white font-bold">{issueCounts.missing_price}</span></div>
          <div className="flex justify-between cursor-pointer hover:bg-gray-700 rounded px-1 -mx-1" onClick={function(){setMode("issues");setIssueType("missing_date");}}><span className="text-orange-400">Missing Date</span><span className="text-white font-bold">{issueCounts.missing_date}</span></div>
          <div className="flex justify-between cursor-pointer hover:bg-gray-700 rounded px-1 -mx-1" onClick={function(){setMode("issues");setIssueType("flagged_notes");}}><span className="text-purple-400">Flagged Notes</span><span className="text-white font-bold">{issueCounts.flagged_notes}</span></div>
          <div className="flex justify-between cursor-pointer hover:bg-gray-700 rounded px-1 -mx-1" onClick={function(){setMode("issues");setIssueType("ebay_mislog");}}><span className="text-pink-400">eBay Mislog?</span><span className="text-white font-bold">{issueCounts.ebay_mislog}</span></div>
          <div className="flex justify-between cursor-pointer hover:bg-gray-700 rounded px-1 -mx-1" onClick={function(){setMode("issues");setIssueType("not_on_tcdb");}}><span className="text-sky-400">Not on TCDB</span><span className="text-white font-bold">{issueCounts.not_on_tcdb}</span></div>
          <div className="flex justify-between cursor-pointer hover:bg-gray-700 rounded px-1 -mx-1" onClick={function(){setMode("issues");setIssueType("missing_from_tcdb");}}><span className="text-amber-400">Pending TCDB Add</span><span className="text-white font-bold">{issueCounts.missing_from_tcdb}</span></div>
          <div className="flex justify-between cursor-pointer hover:bg-gray-700 rounded px-1 -mx-1" onClick={function(){setMode("issues");setIssueType("extra_duplicate");}}><span className="text-teal-400">Extra Duplicate</span><span className="text-white font-bold">{issueCounts.extra_duplicate}</span></div>
        </div>
        <div className="mt-2 text-xs text-gray-400 cursor-pointer hover:text-gray-200" onClick={function(){setMode("issues");setIssueType("all");}}>Total cards with issues: <span className="text-white font-bold">{issueCounts.total}</span></div>
      </div>

      <div className="flex gap-2 mb-3 flex-wrap">
        <select value={mode} onChange={function(e) { setMode(e.target.value); }} className="bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs">
          <option value="issues">Cards with Issues</option>
          <option value="all">All Cards (Browse)</option>
        </select>
        {mode === "issues" && (
          <select value={issueType} onChange={function(e) { setIssueType(e.target.value); }} className="bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs">
            <option value="all">All Issue Types</option>
            <option value="missing_serial">Missing Serial # ({issueCounts.missing_serial})</option>
            <option value="missing_price">Missing Price ({issueCounts.missing_price})</option>
            <option value="missing_date">Missing Date ({issueCounts.missing_date})</option>
            <option value="flagged_notes">Flagged Notes ({issueCounts.flagged_notes})</option>
            <option value="ebay_mislog">eBay Mislog? ({issueCounts.ebay_mislog})</option>
            <option value="not_on_tcdb">Not on TCDB ({issueCounts.not_on_tcdb})</option>
            <option value="missing_from_tcdb">Pending TCDB Add ({issueCounts.missing_from_tcdb})</option>
            <option value="extra_duplicate">Extra Duplicate ({issueCounts.extra_duplicate})</option>
          </select>
        )}
        <select value={cYear} onChange={function(e) { setCYear(e.target.value); }} className="bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs">
          <option value="all">All Years</option>
          {years.map(function(y) { return <option key={y} value={y}>{y}</option>; })}
        </select>
        <select value={cProduct} onChange={function(e) { setCProduct(e.target.value); }} className="bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs flex-1 min-w-0">
          <option value="all">All Products ({filteredProducts.length})</option>
          {filteredProducts.map(function(p) { return <option key={p} value={p}>{p}</option>; })}
        </select>
        <input type="text" placeholder="Search..." value={cSearch} onChange={function(e) { setCSearch(e.target.value); }} className="bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-xs w-28" />
      </div>

      <div className="text-xs text-gray-400 mb-2">{issueCards.length} cards | Page {Math.min(cPage+1, totalPages)} of {totalPages || 1}</div>

      <div className="space-y-2">
        {pageCards.map(function(card) {
          var s = statuses[card.id] || "not_owned";
          var cfg = STATUS_CONFIG[s] || STATUS_CONFIG.not_owned;
          var d = cardDetails[card.id] || {};
          var issues = getIssues(card);
          var isEditing = editingId === card.id;

          return (
            <div key={card.id} className={"rounded-lg border p-3 " + (isEditing ? "border-amber-500 bg-amber-900/20" : "border-gray-700 bg-gray-800/50")}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-400 truncate">{card.product}</div>
                  <div className="text-sm text-white font-semibold">{card.cardSet} {sspBadge(card.cardSet)}</div>
                  <div className="text-xs text-gray-500">#{card.cardNumber}{card.copies ? " /" + card.copies : ""}</div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <select value={s} onChange={function(e) { setCardStatus(card.id, e.target.value); }} className={"text-xs bg-transparent border rounded px-1 py-0.5 " + (s === "owned" ? "border-green-600 text-green-300" : s === "in_transit" ? "border-emerald-500 text-emerald-300" : "border-gray-600 text-gray-400")}>
                    {PRIMARY_STATUSES.map(function(k) { return <option key={k} value={k}>{STATUS_CONFIG[k].label}</option>; })}
                  </select>
                  {(s === "owned") && (
                    <button onClick={function() { toggleForSale(card.id); }} className={"text-xs px-1.5 py-0.5 rounded border " + (forSaleFlags[card.id] ? "border-pink-500 text-pink-400 bg-pink-900/30" : "border-gray-600 text-gray-500 hover:text-pink-400")}>
                      {forSaleFlags[card.id] ? "For Sale [x]" : "For Sale"}
                    </button>
                  )}
                </div>
              </div>

              {issues.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {issues.map(function(iss) {
                    return <span key={iss} className={"text-xs px-1.5 py-0.5 rounded-full bg-gray-900 border border-gray-700 " + (issueColors[iss] || "text-gray-400")}>{issueLabels[iss] || iss}</span>;
                  })}
                </div>
              )}

              {isEditing ? (
                <div className="space-y-2 mt-2">
                  <div className="grid grid-cols-2 gap-2">
                    {card.copies && (
                      <div>
                        <label className="text-xs text-yellow-500 font-black block mb-0.5">My Serial #</label>
                        <input type="text" value={editVals.serial} onChange={function(e) { setEditVals(function(p) { return {...p, serial: e.target.value}; }); }} className="w-full bg-gray-900 border-2 border-yellow-700 rounded px-2 py-1 text-sm text-yellow-300 font-black focus:border-yellow-500 outline-none" placeholder={"of " + card.copies} />
                      </div>
                    )}
                    {!hidePrices && <div>
                      <label className="text-xs text-gray-500 block mb-0.5">Price Paid</label>
                      <input type="text" value={editVals.price} onChange={function(e) { setEditVals(function(p) { return {...p, price: e.target.value}; }); }} className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:border-amber-500 outline-none" placeholder="$0.00" />
                    </div>}
                    <div>
                      <label className="text-xs text-gray-500 block mb-0.5">Purchase Date</label>
                      <input type="date" value={editVals.date} onChange={function(e) { setEditVals(function(p) { return {...p, date: e.target.value}; }); }} className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:border-amber-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-0.5">Notes</label>
                    <input type="text" value={editVals.notes} onChange={function(e) { setEditVals(function(p) { return {...p, notes: e.target.value}; }); }} className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:border-amber-500 outline-none" placeholder="Notes..." />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={function() { saveEdit(card.id); }} className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs rounded font-medium">Save</button>
                    <button onClick={cancelEdit} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="mt-1">
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-400 mb-2">
                    {d.serial && <span>Serial: <span className="text-yellow-300 font-black" style={{fontSize:"12px"}}>#{d.serial}</span>{card.copies ? <span className="text-yellow-500 font-black">/{card.copies}</span> : ""}</span>}
                    {!hidePrices && d.price && <span>Price: <span style={{color:"#FFC52F"}}>{displayPrice(d.price)}</span></span>}
                    {d.date && <span>Date: <span className="text-gray-300">{d.date}</span></span>}
                    {d.notes && <span className="text-gray-500 truncate max-w-48" title={d.notes}>Notes: {d.notes}</span>}
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    <button onClick={function() { startEdit(card); }} className="text-xs px-2 py-0.5 bg-amber-900/40 border border-amber-700 text-amber-300 rounded hover:bg-amber-800/40">Edit</button>
                    <a href={tcdbUrl(card)} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-0.5 bg-cyan-900/40 border border-cyan-700 text-cyan-300 rounded hover:bg-cyan-800/40">TCDB</a>
                    <a href="#" onClick={function(e) { handleEbayClick(card, e); }} className="text-xs px-2 py-0.5 bg-yellow-900/40 border border-yellow-700 text-yellow-300 rounded hover:bg-yellow-800/40">eBay</a>
                    {orderUrl(card) && <a href={orderUrl(card)} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-0.5 bg-yellow-900/40 border border-yellow-600 text-yellow-200 rounded hover:bg-yellow-800/40">Order</a>}
                    <a href={comcUrl(card)} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-0.5 bg-orange-900/40 border border-orange-700 text-orange-300 rounded hover:bg-orange-800/40">COMC</a>
                    <a href={googleImgUrl(card)} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-0.5 bg-blue-900/40 border border-blue-700 text-blue-300 rounded hover:bg-blue-800/40">Images</a>
                    <a href={variantOnlyUrl(card)} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-0.5 bg-purple-900/40 border border-purple-700 text-purple-300 rounded hover:bg-purple-800/40" title="Search this variant without player name">Variant</a>
                    <a href={pt130Url(card)} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-0.5 bg-teal-900/40 border border-teal-700 text-teal-300 rounded hover:bg-teal-800/40">130pt</a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {pageCards.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">{mode === "issues" ? "No issues found! Your data looks clean." : "No cards match your filters."}</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={function() { setCPage(function(p) { return Math.max(0, p-1); }); }} disabled={cPage === 0} className="px-3 py-1 bg-gray-800 rounded text-sm disabled:opacity-30">Prev</button>
          <span className="text-sm text-gray-400">{cPage+1} / {totalPages}</span>
          <button onClick={function() { setCPage(function(p) { return Math.min(totalPages-1, p+1); }); }} disabled={cPage >= totalPages-1} className="px-3 py-1 bg-gray-800 rounded text-sm disabled:opacity-30">Next</button>
        </div>
      )}
    </div>
  );
}

function SyncPanel({ cards, touchupCards, cardDetails, syncIndex, setSyncIndex, markSynced, hidePrices }) {
  var [mode, setMode] = useState("sync");
  var [touchupIdx, setTouchupIdx] = useState(0);
  var [batchOpening, setBatchOpening] = useState(false);
  var [verifyInput, setVerifyInput] = useState("");
  var [verifyResults, setVerifyResults] = useState(null);
  var [verifyConfirmed, setVerifyConfirmed] = useState({});
  var [verifyProcessing, setVerifyProcessing] = useState(false);
  var activeCards = mode === "sync" ? cards : mode === "touchup" ? touchupCards : [];
  var activeIdx = mode === "sync" ? Math.min(syncIndex, Math.max(0, cards.length - 1)) : Math.min(touchupIdx, Math.max(0, touchupCards.length - 1));
  var setActiveIdx = mode === "sync" ? setSyncIndex : setTouchupIdx;
  var card = activeCards.length > 0 ? activeCards[Math.min(activeIdx, activeCards.length - 1)] : null;
  var sd = card ? (mode === "sync" ? (SYNC_DATA[String(card.id)] || {}) : (cardDetails[card.id] || {})) : {};
  var R = function(label, val, border) { return val ? (<div className={"flex justify-between items-center py-2" + (border ? " border-b border-gray-700" : "")}><span className="text-gray-400 text-sm">{label}</span><span className="text-white text-sm font-medium">{val}</span></div>) : null; };
  var openBatchTcdb = function(startIdx, count) {
    setBatchOpening(true);
    var toOpen = activeCards.slice(startIdx, startIdx + count);
    toOpen.forEach(function(c, i) {
      setTimeout(function() {
        window.open(tcdbUrl(c), "_blank");
        if (i === toOpen.length - 1) setBatchOpening(false);
      }, i * 400);
    });
  };

  /* --- TCDB PASTE PARSER ---
     Generic parser: extracts card entries from TCDB collection/checklist paste.
     V2/V3: this parser works for ANY player - the matching step scopes to Tyler Black. */
  var parseTcdbPaste = function(text) {
    if (!text || !text.trim()) return { matched: [], unmatched: [], skipped: 0 };
    var lines = text.split(/\n/).map(function(l) { return l.trim(); }).filter(Boolean);
    var currentSet = "";
    var currentYear = "";
    var entries = [];
    var setHeaderRe = /^(\d{4})\s+(.+?)(?:\s*[-\u2013]\s*(?:Baseball|Football|Basketball|Hockey|Racing|Soccer))?$/i;
    var cardLineRe = /^[#]?\s*([A-Za-z0-9][\w\-\.\/]*\w?)(?:\s+|\t)/;
    var haveWantRe = /\b(\d+)\s+(\d+)\s*$/;
    lines.forEach(function(line) {
      var setMatch = setHeaderRe.exec(line);
      if (setMatch) { currentYear = setMatch[1]; currentSet = setMatch[2].trim(); return; }
      if (/^(Set|Card|Name|Team|#|Number)\b/i.test(line) && /\t/.test(line)) return;
      if (line.length < 3) return;
      var cardNo = "";
      var variant = "";
      var nameInfo = "";
      var qty = 0;
      var tabParts = line.split(/\t/);
      if (tabParts.length >= 2) {
        cardNo = tabParts[0].replace(/^#\s*/, "").trim();
        nameInfo = tabParts.slice(1).join(" ");
        var hw = haveWantRe.exec(line);
        if (hw) qty = parseInt(hw[1]) || 0;
      } else {
        var cm = cardLineRe.exec(line);
        if (cm) { cardNo = cm[1]; nameInfo = line.substring(cm[0].length); }
        else { nameInfo = line; }
      }
      if (!cardNo && !nameInfo) return;
      var dashVariant = /\s-\s(.+?)(?:\s*\/\d+)?$/.exec(nameInfo);
      if (dashVariant) variant = dashVariant[1].trim();
      var commonVariants = nameInfo.match(/\b(Base|Chrome|Refractor|Prizm|Auto(?:graph)?s?|Gold|Silver|Blue|Red|Green|Orange|Purple|Pink|Black|SuperFractor|Printing Plates?|Mojo|Holo|Foil|Sapphire|Wave|Lava|Aqua|Atomic|Diamond)\b/gi);
      if (commonVariants && !variant) variant = commonVariants.join(" ");
      entries.push({ cardNo: cardNo, variant: variant, nameInfo: nameInfo, year: currentYear, set: currentSet, qty: qty, raw: line });
    });
    /* --- MATCHER ---
       Matches parsed entries against unsynced cards.
       Uses (cardNumber, year, product) as primary key, with variant as tiebreaker. */
    var unsyncedSet = new Set(cards.map(function(c) { return c.id; }));
    var matched = [];
    var unmatched = [];
    var matchedIds = new Set();
    var vnorm = function(s) { return (s || "").toLowerCase().replace(/[^a-z0-9]/g, ""); };
    entries.forEach(function(entry) {
      if (!entry.cardNo) { return; }
      var candidates = ALL_CARDS.filter(function(c) {
        if (matchedIds.has(c.id)) return false;
        if (vnorm(c.cardNumber) !== vnorm(entry.cardNo)) return false;
        if (entry.year && String(c.year) !== entry.year) return false;
        if (entry.set) {
          var setN = vnorm(entry.set);
          var prodN = vnorm(c.product);
          if (prodN.indexOf(setN) === -1 && setN.indexOf(prodN) === -1) {
            var setWords = entry.set.toLowerCase().split(/\s+/);
            var matchCount = setWords.filter(function(w) { return w.length > 2 && prodN.indexOf(w) !== -1; }).length;
            if (matchCount < Math.min(2, setWords.length * 0.5)) return false;
          }
        }
        return true;
      });
      if (candidates.length === 0) { unmatched.push(entry); return; }
      var entryVarN = vnorm(entry.variant || "base");
      candidates.sort(function(a, b) {
        var va = vnorm(a.cardSet);
        var vb = vnorm(b.cardSet);
        var sa = va === entryVarN ? 100 : va.indexOf(entryVarN) !== -1 ? 50 : entryVarN.indexOf(va) !== -1 ? 30 : 0;
        var sb = vb === entryVarN ? 100 : vb.indexOf(entryVarN) !== -1 ? 50 : entryVarN.indexOf(vb) !== -1 ? 30 : 0;
        if (sa !== sb) return sb - sa;
        var ua = unsyncedSet.has(a.id) ? 1 : 0;
        var ub = unsyncedSet.has(b.id) ? 1 : 0;
        return ub - ua;
      });
      if (entry.variant && vnorm(entry.variant)) {
        matched.push({ entry: entry, card: candidates[0], needsSync: unsyncedSet.has(candidates[0].id) });
        matchedIds.add(candidates[0].id);
      } else {
        var baseCards = candidates.filter(function(c) { return /^base$/i.test(c.cardSet) || c.cardSet === "Base"; });
        var pick = baseCards.length > 0 ? baseCards[0] : candidates[0];
        matched.push({ entry: entry, card: pick, needsSync: unsyncedSet.has(pick.id) });
        matchedIds.add(pick.id);
      }
    });
    return { matched: matched, unmatched: unmatched, skipped: lines.length - entries.length };
  };

  var runVerify = function() {
    var results = parseTcdbPaste(verifyInput);
    setVerifyResults(results);
    setVerifyConfirmed({});
  };

  var verifyAllMatched = function() {
    if (!verifyResults) return;
    setVerifyProcessing(true);
    var toSync = verifyResults.matched.filter(function(m) { return m.needsSync && !verifyConfirmed[m.card.id]; });
    var count = 0;
    toSync.forEach(function(m, i) {
      setTimeout(function() {
        markSynced(m.card.id);
        setVerifyConfirmed(function(prev) { var n = Object.assign({}, prev); n[m.card.id] = true; return n; });
        count++;
        if (count >= toSync.length) setVerifyProcessing(false);
      }, i * 50);
    });
    if (toSync.length === 0) setVerifyProcessing(false);
  };

  var verifySingle = function(cardId) {
    markSynced(cardId);
    setVerifyConfirmed(function(prev) { var n = Object.assign({}, prev); n[cardId] = true; return n; });
  };

  var verifyNeedsSyncCount = verifyResults ? verifyResults.matched.filter(function(m) { return m.needsSync && !verifyConfirmed[m.card.id]; }).length : 0;
  var verifyAlreadySynced = verifyResults ? verifyResults.matched.filter(function(m) { return !m.needsSync || verifyConfirmed[m.card.id]; }).length : 0;

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap items-center">
        <button onClick={function() { setMode("sync"); }} className={"px-3 py-1.5 rounded text-sm font-medium " + (mode === "sync" ? "bg-orange-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white")}>
          TCDB Sync {cards.length > 0 && <span className="ml-1 text-xs">({cards.length})</span>}
        </button>
        <button onClick={function() { setMode("touchup"); }} className={"px-3 py-1.5 rounded text-sm font-medium " + (mode === "touchup" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white")}>
          TCDB Touchups {touchupCards.length > 0 && <span className="ml-1 text-xs">({touchupCards.length})</span>}
        </button>
        <button onClick={function() { setMode("verify"); }} className={"px-3 py-1.5 rounded text-sm font-medium " + (mode === "verify" ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white")}>
          Paste & Verify
        </button>
        {mode !== "verify" && activeCards.length > 0 && <span className="text-gray-600 text-xs">|</span>}
        {mode !== "verify" && activeCards.length > 0 && <button onClick={function() { openBatchTcdb(activeIdx, 5); }} disabled={batchOpening} className="px-2 py-1 rounded text-xs font-bold bg-cyan-900/40 border border-cyan-700 text-cyan-300 hover:bg-cyan-800/40 disabled:opacity-40">
          {batchOpening ? "Opening..." : "Open 5 in TCDB"}
        </button>}
        {mode !== "verify" && activeCards.length > 10 && <button onClick={function() { openBatchTcdb(activeIdx, 10); }} disabled={batchOpening} className="px-2 py-1 rounded text-xs font-bold bg-cyan-900/40 border border-cyan-700 text-cyan-300 hover:bg-cyan-800/40 disabled:opacity-40">
          Open 10
        </button>}
        {mode !== "verify" && activeCards.length > 0 && <span className="text-gray-600 text-[10px]">from #{activeIdx + 1}</span>}
      </div>
      <div style={{display: mode === "verify" ? "block" : "none"}}>
        <div className="bg-green-900/20 border border-green-800 rounded px-3 py-2 mb-3 text-xs text-green-300">
          <strong>Bulk verify sync status.</strong> Go to your TCDB collection, copy the card table, paste here. Cards confirmed on TCDB will be removed from the Sync queue.
          <div className="mt-1 text-green-400/70">Supported: TCDB checklist pages, collection views, set pages. Tab-separated or plain text. Include the set header line (e.g. "2024 Topps Update") before its cards for best matching.</div>
        </div>
        <textarea value={verifyInput} onChange={function(e) { setVerifyInput(e.target.value); setVerifyResults(null); }} placeholder={"Paste TCDB collection here...\n\nExample formats:\n2024 Topps Update\nUS144\tTyler Black\tMilwaukee Brewers\t1\t0\nUS150\tTyler Black\tMilwaukee Brewers\t1\t0\n\nOr:\nBD-200 Tyler Black - Base\nBD-200 Tyler Black - Aqua /199\nBDC-200 Tyler Black - Chrome Refractor"} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-xs text-white font-mono outline-none focus:border-green-600 resize-y" style={{minHeight: "120px", maxHeight: "250px"}} />
        <div className="flex gap-2 mt-2 items-center">
          <button onClick={runVerify} disabled={!verifyInput.trim()} className="px-4 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-30 text-white text-sm font-medium rounded">Parse & Match</button>
          <button onClick={function(){ navigator.clipboard.readText().then(function(txt) { setVerifyInput(txt); setVerifyResults(null); }).catch(function() { alert("Clipboard access denied. Paste manually with Ctrl+V."); }); }} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded border border-gray-600">{"\ud83d\udccb"} Paste</button>
          {verifyInput && <button onClick={function() { setVerifyInput(""); setVerifyResults(null); setVerifyConfirmed({}); }} className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs rounded">Clear</button>}
          {verifyResults && <span className="text-xs text-gray-500 ml-2">{verifyResults.matched.length} matched, {verifyResults.unmatched.length} unmatched{verifyResults.skipped > 0 ? ", " + verifyResults.skipped + " skipped" : ""}</span>}
        </div>
        {verifyResults && (
          <div className="mt-4 space-y-3">
            {verifyResults.matched.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-green-400">Matched Cards ({verifyResults.matched.length})</h3>
                  <div className="flex items-center gap-2">
                    {verifyAlreadySynced > 0 && <span className="text-[10px] text-gray-500">{verifyAlreadySynced} already synced</span>}
                    {verifyNeedsSyncCount > 0 && <button onClick={verifyAllMatched} disabled={verifyProcessing} className="px-3 py-1.5 bg-green-700 hover:bg-green-600 disabled:opacity-40 text-white text-xs font-bold rounded">{verifyProcessing ? "Processing..." : "Verify All " + verifyNeedsSyncCount + " Unsynced"}</button>}
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto space-y-0.5">
                  {verifyResults.matched.map(function(m, i) {
                    var synced = !m.needsSync || verifyConfirmed[m.card.id];
                    return (
                      <div key={m.card.id + "-" + i} className={"flex items-center gap-2 px-2 py-1 rounded text-xs " + (synced ? "bg-green-950/30 border border-green-900/50" : "bg-gray-800 border border-gray-700")}>
                        <span className={"w-4 text-center font-bold " + (synced ? "text-green-400" : "text-orange-400")}>{synced ? "\u2713" : "!"}</span>
                        <span className="text-gray-500 w-16 flex-shrink-0">#{m.card.cardNumber}</span>
                        <span className={"flex-1 min-w-0 truncate " + (synced ? "text-green-300" : "text-white")}>{m.card.cardSet} <span className="text-gray-600">| {m.card.product}</span></span>
                        {!synced ? (
                          <button onClick={function() { verifySingle(m.card.id); }} className="px-2 py-0.5 bg-green-800 hover:bg-green-700 text-green-200 text-[10px] rounded flex-shrink-0">Verify</button>
                        ) : (
                          <span className="text-green-600 text-[10px] flex-shrink-0">Synced</span>
                        )}
                        <a href={tcdbUrl(m.card)} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 font-bold flex-shrink-0">T</a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {verifyResults.unmatched.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-yellow-400 mb-2">Unmatched Lines ({verifyResults.unmatched.length})</h3>
                <div className="text-[10px] text-gray-500 mb-1">These lines could not be matched to tracker cards. May be header text, different player, or format issues.</div>
                <div className="max-h-40 overflow-y-auto space-y-0.5">
                  {verifyResults.unmatched.map(function(u, i) {
                    return (
                      <div key={i} className="flex items-center gap-2 px-2 py-1 bg-yellow-950/20 border border-yellow-900/30 rounded text-xs">
                        <span className="text-yellow-600 w-4">?</span>
                        <span className="text-yellow-300/70 flex-1 min-w-0 truncate font-mono">{u.cardNo ? "#" + u.cardNo + " " : ""}{u.raw}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {verifyResults.matched.length === 0 && verifyResults.unmatched.length === 0 && (
              <div className="text-center py-6 text-gray-500 text-sm">No card entries found in the pasted text. Make sure to include card numbers.</div>
            )}
          </div>
        )}
      </div>
      <div style={{display: mode !== "verify" ? "block" : "none"}}>
      {mode === "touchup" && <div className="bg-purple-900/20 border border-purple-800 rounded px-3 py-2 mb-3 text-xs text-purple-300">These cards are synced for status but missing details (price, serial #, date, notes) on TCDB. Update when you have time.</div>}
      {activeCards.length === 0 || !card ? (
        <div className="text-center py-12">
          <div className={"text-lg font-medium " + (mode === "sync" ? "text-green-400" : "text-purple-400")}>{mode === "sync" ? "All synced to TCDB!" : "No touchups needed!"}</div>
          <p className="text-gray-400 text-sm mt-1">{mode === "sync" ? "No cards pending upload." : "All detail-rich cards are up to date."}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-400">{activeIdx + 1} of {activeCards.length} {mode === "sync" ? "remaining" : "to touch up"}</div>
            <div className="flex gap-2">
              <button onClick={function() { setActiveIdx(Math.max(0, activeIdx - 1)); }} disabled={activeIdx === 0} className="px-3 py-1 bg-gray-800 rounded text-sm disabled:opacity-30">Prev</button>
              <button onClick={function() { setActiveIdx(Math.min(activeCards.length - 1, activeIdx + 1)); }} disabled={activeIdx >= activeCards.length - 1} className="px-3 py-1 bg-gray-800 rounded text-sm disabled:opacity-30">Next</button>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 mb-3">
            <div className={(mode === "sync" ? "text-orange-400" : "text-purple-400") + " font-bold text-lg"}>{card.product}</div>
            <div className="text-gray-300 text-sm">#{card.cardNumber} - Tyler Black{card.copies ? " SN " + card.copies : ""} - Milwaukee Brewers</div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-gray-500 text-xs">{card.cardSet} {sspBadge(card.cardSet)}</span>
              <div className="flex gap-3">
                <a href={tcdbUrl(card)} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300 underline">Find on TCDB</a>
                <a href="#" onClick={function(e) { handleEbayClick(card, e); }} className="text-xs text-yellow-400 hover:text-yellow-300 underline">Search eBay</a>
                <a href={comcUrl(card)} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 hover:text-orange-300 underline">Browse COMC</a>
                <a href={pt130Url(card)} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-400 hover:text-teal-300 underline">130pt Sold</a>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            {mode === "sync" ? (<>
              {R("Listed In:", sd.l || "Collection", true)}
              {R("Price:", sd.p, true)}
              {R("Serial Number:", sd.s, true)}
              {R("Comment:", sd.n, true)}
              {R("Purchase Date:", sd.d, false)}
            </>) : (<>
              {R("Price:", sd.price ? displayPrice(sd.price) : null, true)}
              {R("Serial Number:", sd.serial, true)}
              {R("Notes:", sd.notes, true)}
              {R("Purchase Date:", sd.date, false)}
            </>)}
          </div>
          <div className="flex gap-3 mt-4">
            {mode === "sync" ? (<>
              <button onClick={function() { markSynced(card.id); setSyncIndex(Math.min(activeIdx, cards.length - 2)); }} className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 rounded-lg text-sm">Mark as Synced</button>
              <button onClick={function() { setSyncIndex(Math.min(cards.length - 1, activeIdx + 1)); }} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg text-sm">Skip</button>
            </>) : (<>
              <button onClick={function() { setTouchupIdx(Math.min(activeIdx, touchupCards.length - 2)); }} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg text-sm">Done &gt; Next</button>
              <button onClick={function() { setTouchupIdx(Math.min(touchupCards.length - 1, activeIdx + 1)); }} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 rounded-lg text-sm">Skip</button>
            </>)}
          </div>
          <div className="mt-6 border-t border-gray-700 pt-4">
            <div className="text-xs text-gray-500 mb-2">All {activeCards.length} cards:</div>
            <div className="max-h-64 overflow-y-auto space-y-0.5">
              {activeCards.map(function(c, i) {
                var isActive = i === activeIdx;
                var d = cardDetails[c.id] || {};
                return (
                  <div key={c.id} onClick={function() { setActiveIdx(i); }} className={"px-3 py-1.5 rounded cursor-pointer flex items-center gap-2 text-xs " + (isActive ? (mode === "sync" ? "bg-orange-900/40 border border-orange-700" : "bg-purple-900/40 border border-purple-700") : "bg-gray-800 hover:bg-gray-750 border border-transparent")}>
                    <span className={(isActive ? "text-white font-medium" : "text-gray-400") + " flex-1 min-w-0 truncate"}>#{c.cardNumber} | {c.cardSet} {sspBadge(c.cardSet)}<span className="text-gray-600">| {c.product}</span></span>
                    {((!hidePrices && d.price) || d.serial) && <span className="flex-shrink-0">{!hidePrices && d.price ? <span className="text-gray-600">{displayPrice(d.price)}</span> : ""}{d.serial ? <span className="text-yellow-400 font-black ml-1">{"#" + d.serial}</span> : ""}</span>}
                    <span className="flex gap-1.5 flex-shrink-0">
                      <a href={tcdbUrl(c)} target="_blank" rel="noopener noreferrer" onClick={function(e) { e.stopPropagation(); }} className="font-bold text-cyan-400 hover:text-cyan-200">T</a>
                      <a href="#" onClick={function(e) { e.stopPropagation(); handleEbayClick(c, e); }} className="font-bold text-yellow-400 hover:text-yellow-200">E</a>
                      <a href={comcUrl(c)} target="_blank" rel="noopener noreferrer" onClick={function(e) { e.stopPropagation(); }} className="font-bold text-orange-400 hover:text-orange-200">C</a>
                      <a href={pt130Url(c)} target="_blank" rel="noopener noreferrer" onClick={function(e) { e.stopPropagation(); }} className="font-bold text-teal-400 hover:text-teal-200">P</a>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
}

function COMCScannerPanel(props) {
  var cards = props.cards, statuses = props.statuses, cardDetails = props.cardDetails;
  var updateCardDetail = props.updateCardDetail, setCardStatus = props.setCardStatus;
  var setDetailedCardId = props.setDetailedCardId, setActiveTab = props.setActiveTab;
  var persistedState = props.persistedState, onStateChange = props.onStateChange;
  var _ps = persistedState || {};
  var _ri = useState(_ps.rawInput || ""), rawInput = _ri[0], setRawInput = _ri[1];
  var _pa = useState(_ps.parsed || []), parsed = _pa[0], setParsed = _pa[1];
  var _ap = useState(_ps.applied || {}), applied = _ap[0], setApplied = _ap[1];
  var _mo = useState(_ps.mode || "auto"), mode = _mo[0], setMode = _mo[1];
  var _sf = useState(_ps.shopFilter || "need"), shopFilter = _sf[0], setShopFilter = _sf[1];
  var _pt130f = useState("all"), pt130Filter = _pt130f[0], setPt130Filter = _pt130f[1];
  var _stf = useState(_ps.scanTags || {auto:false, sn:false, graded:false}), scanTags = _stf[0], setScanTags = _stf[1];
  function toggleScanTag(tag) { setScanTags(function(prev) { var n = Object.assign({}, prev); n[tag] = !n[tag]; return n; }); }
  var _scn = useState(_ps.scanCardNo || ""), scanCardNo = _scn[0], setScanCardNo = _scn[1];
  var _ss = useState(_ps.shopSort || {col:"price",dir:"asc"}), shopSort = _ss[0], setShopSort = _ss[1];
  var _ex = useState(_ps.expanded || {}), expanded = _ex[0], setExpanded = _ex[1];
  var _aa = useState(false), autoAddEnabled = _aa[0], setAutoAddEnabled = _aa[1];
  var _my = useState(""), manualYear = _my[0], setManualYear = _my[1];
  var _mp = useState(""), manualProduct = _mp[0], setManualProduct = _mp[1];
  var _mc = useState(""), manualCardNo = _mc[0], setManualCardNo = _mc[1];
  var _mv = useState(""), manualVariant = _mv[0], setManualVariant = _mv[1];
  var _mpr = useState(""), manualPrice = _mpr[0], setManualPrice = _mpr[1];
  var _ms = useState(""), manualSeller = _ms[0], setManualSeller = _ms[1];
  var _mse = useState(""), manualSerial = _mse[0], setManualSerial = _mse[1];
  var _md = useState(""), manualDate = _md[0], setManualDate = _md[1];
  var _adb = useState(null), addingIdx = _adb[0], setAddingIdx = _adb[1]; // index into parsed[] of card being added to DB
  var _si = useState(_ps.showInput != null ? _ps.showInput : true), showInput = _si[0], setShowInput = _si[1];
  var _adf = useState({}), addForm = _adf[0], setAddForm = _adf[1]; // editable fields for Add to DB form
  var _shd = useState(false), showAddDbForm = _shd[0], setShowAddDbForm = _shd[1]; // toggle candidate picker vs add form
  var _ccm = useState(false), showCustomMgr = _ccm[0], setShowCustomMgr = _ccm[1]; // custom cards manager
  var _sbm = useState(false), showBlockedMgr = _sbm[0], setShowBlockedMgr = _sbm[1]; // blocked listings manager
  var _ccd = useState(null), confirmDeleteIdx = _ccd[0], setConfirmDeleteIdx = _ccd[1]; // two-step delete confirmation
  var _tds = useState(null), tcdbDetectedStatus = _tds[0], setTcdbDetectedStatus = _tds[1]; // detected TCDB list status
  var _tcf = useState("mismatch"), tcdbFilter = _tcf[0], setTcdbFilter = _tcf[1]; // tcdb comparison filter

  // Save scanner state to parent ref on every meaningful change so it persists across tab switches
  useEffect(function() {
    if (onStateChange) {
      onStateChange({ rawInput: rawInput, parsed: parsed, applied: applied, mode: mode, shopFilter: shopFilter, scanTags: scanTags, scanCardNo: scanCardNo, shopSort: shopSort, expanded: expanded, showInput: showInput });
    }
  }, [rawInput, parsed, applied, mode, shopFilter, scanTags, scanCardNo, shopSort, expanded, showInput]);

  // --- COMC Persistent Match Overrides ---
  function loadComcOverrides() { try { return JSON.parse(localStorage.getItem("tb-comc-overrides-v1") || "{}"); } catch(e) { return {}; } }
  // cardKey: canonical grouping key for price history across duplicate card IDs
  // Cards with same (year, product, cardNumber, variant) share price data
  function priceKey(card) {
    if (!card) return null;
    return card.product.slice(0,4) + "|" + card.product + "|" + card.cardNumber + "|" + (card.cardSet || "Base");
  }
  // Build lookup: priceKey -> [cardId, cardId, ...]
  var PRICE_KEY_MAP = useMemo(function() {
    var m = {};
    ALL_CARDS.forEach(function(c) {
      var k = priceKey(c);
      if (!m[k]) m[k] = [];
      m[k].push(c.id);
    });
    return m;
  }, []);

  // Record a single price entry. If batchPH is provided, writes to that object instead of localStorage.
  function recordPrice(cardId, price, source, title, batchPH) {
    if (!cardId || !price) return;
    var numPrice = parseFloat(String(price).replace(/^\$/, "")) || 0;
    if (numPrice <= 0) return;
    var card = CARD_BY_ID[cardId];
    var pk = card ? priceKey(card) : String(cardId);
    // BLOCK: never record eBay/Whatnot prices for ambiguous variants OR 1/1 cards with "black" in variant
    if (source === "eBay" || source === "Whatnot") {
      if (AMBIGUOUS_PRICE_KEYS.has(pk) || AMBIGUOUS_CARD_IDS.has(cardId)) return;
      if (card && card.copies === "1" && /\bblack\b/i.test(card.cardSet || "")) return;
    }
    var ph = batchPH || loadPriceHistory();
    var today = new Date().toISOString().split("T")[0];
    if (!ph[pk]) ph[pk] = [];
    // One entry per day per source
    var existIdx = -1;
    for (var ei = 0; ei < ph[pk].length; ei++) {
      if (ph[pk][ei].date === today && ph[pk][ei].source === source) { existIdx = ei; break; }
    }
    if (existIdx >= 0) {
      var existing = ph[pk][existIdx];
      if (numPrice < existing.price) existing.price = numPrice;
      existing.listings = (existing.listings || 1) + 1;
      if (title) {
        if (!existing.titles) existing.titles = [];
        if (existing.titles.indexOf(title) === -1 && existing.titles.length < 5) existing.titles.push(title);
      }
    } else {
      var entry = { price: numPrice, source: source || "unknown", date: today, listings: 1 };
      if (title) entry.titles = [title];
      ph[pk].push(entry);
    }
    if (ph[pk].length > 365) ph[pk] = ph[pk].slice(-365);
    if (!batchPH) savePriceHistory(ph); // only save immediately if not batching
  }
  function saveComcOverrides(obj) { localStorage.setItem("tb-comc-overrides-v1", JSON.stringify(obj)); try { window.storage.set("tb-comc-overrides-v1", JSON.stringify(obj)); } catch(e) {} COMC_OVERRIDES = obj; }
  var _cov = useState(function(){ var o = loadComcOverrides(); COMC_OVERRIDES = o; return o; });
  useState(function(){ PRICE_HISTORY = loadPriceHistory(); });
  var comcOverrides = _cov[0], setComcOverrides = _cov[1];
  var _ebl = useState(function(){ var b = loadEbayBlocked(); EBAY_BLOCKED = b; return b; });
  var ebayBlocked = _ebl[0], setEbayBlocked = _ebl[1];
  var _ebi = useState(function(){ return loadEbayBids(); });
  var ebayBids = _ebi[0], setEbayBids = _ebi[1];
  var _sdp = useState({}), seenDrops = _sdp[0], setSeenDrops = _sdp[1]; // acknowledged price drop listings
  var _tgt = useState(function(){ return loadTargets(); });
  var targets = _tgt[0], setTargets = _tgt[1];
  function addTarget(p, m, status) {
    var tgt = loadTargets();
    var key = "tgt_" + Date.now() + "_" + Math.random().toString(36).slice(2,6);
    var cardId = (m && m.card) ? m.card.id : null;
    var cardInfo = (m && m.card) ? { product: m.card.product, cardSet: m.card.cardSet, cardNumber: m.card.cardNumber, copies: m.card.copies } : null;
    var totalP = parseFloat(p.totalPrice || p.price) || 0;
    tgt[key] = {
      id: key, cardId: cardId, cardInfo: cardInfo,
      title: p.rawSet || "", price: p.price || "", seller: p.seller || "",
      source: p.source || "", currency: p.currency || "USD",
      year: p.year || "", product: p.product || "", cardNo: p.cardNo || "",
      variant: p.variant || "", printRun: p.printRun || "", serial: p.serial || "",
      graded: p.graded || "", isAuto: !!p.isAuto,
      listingType: p.listingType || "", bids: p.bids || "",
      status: status || "active", dateAdded: new Date().toISOString().slice(0,10), notes: "",
      watchPrice: totalP // benchmark price at time of watch — listings below this get highlighted
    };
    saveTargets(tgt); setTargets(Object.assign({}, tgt));
  }
  function removeTarget(key) {
    var tgt = loadTargets(); delete tgt[key]; saveTargets(tgt); setTargets(Object.assign({}, tgt));
  }
  function toggleTargetStatus(key) {
    var tgt = loadTargets();
    if (tgt[key]) { tgt[key].status = tgt[key].status === "active" ? "watching" : "active"; }
    saveTargets(tgt); setTargets(Object.assign({}, tgt));
  }
  // Build lookup: cardId → target keys, title → target keys
  var targetByCardId = {};
  var targetByTitle = {};
  var tgtKeys = Object.keys(targets);
  for (var ti = 0; ti < tgtKeys.length; ti++) {
    var tg = targets[tgtKeys[ti]];
    if (tg.cardId) { if (!targetByCardId[tg.cardId]) targetByCardId[tg.cardId] = []; targetByCardId[tg.cardId].push(tg); }
    if (tg.title) { var tKey = tg.title.toLowerCase().replace(/[^a-z0-9]/g, ""); if (!targetByTitle[tKey]) targetByTitle[tKey] = []; targetByTitle[tKey].push(tg); }
  }
  function comcKey(p) {
    var y = (p.year || "").trim();
    var prod = norm(p.product || "");
    var num = norm(p.cardNoClean || p.cardNo || "");
    var v = norm(p.variant || "base");
    return y + "|" + prod + "|" + num + "|" + v;
  }
  // pinKey: unique per-listing key for overrides. eBay/Whatnot use rawSet+price+shipping
  // (each listing is unique by this combo). COMC uses comcKey (same card shares override).
  function pinKey(p) {
    if ((p.source === "eBay" || p.source === "Whatnot" || p.source === "130point") && p.rawSet) {
      return "ebay|" + p.rawSet.trim() + "|" + (p.totalPrice || p.price || "") + "|" + (p.shipping || "");
    }
    return comcKey(p);
  }

  function openAddForm(origIdx) {
    if (addingIdx === origIdx) { setAddingIdx(null); return; }
    var item = parsed[origIdx];
    if (!item) return;
    var p = item.parsed;
    var raw = (p.rawSet || "").toLowerCase();
    var isAuto = /auto(?:graph)?s?|signatures?|\bsigned\b/i.test(raw);
    var isMem = /relic|patch|jersey|swatch|game.?gear|memorabilia|game.?used|material/i.test(raw);
    var isRC = false;
    var candidates = [];
    var cardNoFilter = p.cardNoClean || p.cardNo || "";

    if (p.source === "eBay" || p.source === "Whatnot" || p.source === "130point") {
      // eBay/Whatnot: title-scan scoring across ALL products for this year
      var titleNorm = raw.replace(/[^a-z0-9 ]/g, " ").replace(/ +/g, " ");
      var scored = [];
      for (var ci = 0; ci < cards.length; ci++) {
        var card = cards[ci];
        var cYear = String((card.product.match(/^\d{4}/) || [""])[0]);
        if (cYear !== p.year) continue;
        var fullDesc = (card.product + " " + card.cardSet + " " + card.cardNumber).toLowerCase().replace(/[^a-z0-9 ]/g, " ");
        var descWords = fullDesc.split(" ").filter(function(w) { return w.length > 2; });
        var hits = 0;
        for (var dw = 0; dw < descWords.length; dw++) {
          if (titleNorm.indexOf(descWords[dw]) !== -1) hits++;
        }
        var ratio = descWords.length > 0 ? hits / descWords.length : 0;
        if (ratio >= 0.2) scored.push({ card: card, score: ratio });
      }
      scored.sort(function(a, b) { return b.score - a.score; });
      candidates = scored.slice(0, 50).map(function(s) { return s.card; });
      cardNoFilter = "";
      var numCounts = {};
      for (var ni = 0; ni < candidates.length; ni++) {
        var cn = candidates[ni].cardNumber.trim();
        if (!numCounts[cn]) numCounts[cn] = 0;
        numCounts[cn]++;
      }
      var bestNum = "", bestNumCount = 0;
      for (var nk in numCounts) {
        if (titleNorm.indexOf(nk.toLowerCase().replace(/-/g, "")) !== -1 || titleNorm.indexOf(nk.toLowerCase()) !== -1) {
          if (numCounts[nk] > bestNumCount) { bestNum = nk; bestNumCount = numCounts[nk]; }
        }
      }
      cardNoFilter = bestNum;
    } else {
      // COMC: original product-family matching
      var prodLower = p.product.toLowerCase().trim();
      var mappedProd = PRODUCT_MAP[prodLower] || prodLower;
      for (var ci2 = 0; ci2 < cards.length; ci2++) {
        var card2 = cards[ci2];
        var cYear2 = String((card2.product.match(/^\d{4}/) || [""])[0]);
        if (cYear2 !== p.year) continue;
        var cProd = card2.product.toLowerCase();
        var prodWords = mappedProd.split(" ").filter(function(w) { return w.length > 2; });
        var prodMatch = false;
        if (mappedProd && cProd.indexOf(mappedProd) !== -1) prodMatch = true;
        if (!prodMatch && prodLower && cProd.indexOf(prodLower) !== -1) prodMatch = true;
        if (!prodMatch && prodWords.length >= 2) {
          var cProdWords = cProd.split(/\s+/);
          var wordHits = 0;
          for (var wi = 0; wi < prodWords.length; wi++) {
            for (var wj = 0; wj < cProdWords.length; wj++) {
              if (cProdWords[wj].indexOf(prodWords[wi]) !== -1 || prodWords[wi].indexOf(cProdWords[wj]) !== -1) { wordHits++; break; }
            }
          }
          if (wordHits >= prodWords.length * 0.6) prodMatch = true;
        }
        if (prodMatch) candidates.push(card2);
      }
      cardNoFilter = p.cardNoClean || p.cardNo || "";
    }
    // Deduplicate candidates by (cardNumber + cardSet + copies) to remove exact DB dupes
    var candSeen = {};
    var candDeduped = [];
    for (var cdi = 0; cdi < candidates.length; cdi++) {
      var cdKey = candidates[cdi].cardNumber + "|" + (candidates[cdi].cardSet || "") + "|" + (candidates[cdi].copies || "");
      if (!candSeen[cdKey]) { candSeen[cdKey] = true; candDeduped.push(candidates[cdi]); }
    }
    candidates = candDeduped;
    var hasExactMatch = cardNoFilter && candidates.some(function(c) { return c.cardNumber.trim() === cardNoFilter; });
    var initialFilter = hasExactMatch ? cardNoFilter : "";
    setAddForm({
      year: p.year || "",
      product: p.product || "",
      variant: p.variant || "Base",
      cardNo: initialFilter,
      cardNoFilter: cardNoFilter,
      printRun: p.printRun || "",
      isAuto: isAuto,
      isMem: isMem,
      isRC: isRC,
      candidates: candidates
    });
    setAddingIdx(origIdx);
  }

  // Assign a "Not in DB" item to a specific DB card (user picks from candidates)
  function assignCandidate(origIdx, candidateCard) {
    // Save persistent override so this match survives repaste
    var item = parsed[origIdx];
    if (item && item.parsed) {
      var ck = pinKey(item.parsed);
      var overrides = loadComcOverrides();
      overrides[ck] = candidateCard.id;
      saveComcOverrides(overrides);
      setComcOverrides(Object.assign({}, overrides));

      // Move today's price entries from old match to new match (preserve older entries on old key)
      if (item.match && item.match.card) {
        var oldPK = priceKey(item.match.card);
        var newPK = priceKey(candidateCard);
        if (oldPK && newPK && oldPK !== newPK) {
          var ph = loadPriceHistory();
          var today = new Date().toISOString().split("T")[0];
          if (ph[oldPK]) {
            if (!ph[newPK]) ph[newPK] = [];
            // Move today's entries from old to new (these are from THIS scan)
            var keep = [];
            ph[oldPK].forEach(function(e) {
              if (e.date === today) {
                var exists = ph[newPK].some(function(x) { return x.date === e.date && x.source === e.source; });
                if (!exists) ph[newPK].push(e);
                // Don't keep in old key
              } else {
                keep.push(e);
              }
            });
            if (keep.length === 0) { delete ph[oldPK]; }
            else { ph[oldPK] = keep; }
            savePriceHistory(ph);
          }
        }
      }
      // Record current listing price under the correct (new) card
      var listingPrice = item.parsed.totalPrice || item.parsed.price;
      if (listingPrice && candidateCard) {
        recordPrice(candidateCard.id, listingPrice, item.parsed.source || (mode === "shop" ? "COMC" : mode === "ebay" ? "eBay" : mode === "sportlots" ? "SportLots" : mode === "whatnot" ? "Whatnot" : mode === "130pt" ? "130point" : "Unknown"), item.parsed.rawSet || item.raw || "");
      }
    }
    // Force the match to point to this card
    var updatedParsed = parsed.map(function(r, ri) {
      if (ri === origIdx) {
        return { parsed: r.parsed, match: { card: candidateCard, score: 100 }, raw: r.raw };
      }
      return r;
    });
    // Re-apply dedup for shop/sportlots mode
    if (mode === "shop" || mode === "sportlots" || mode === "whatnot") {
      var seen = {};
      var deduped = [];
      for (var di = 0; di < updatedParsed.length; di++) {
        var uItem = updatedParsed[di];
        var matchId = uItem.match && uItem.match.score >= 90 ? uItem.match.card.id : null;
        if (!matchId) { deduped.push(uItem); continue; }
        if (seen[matchId] === undefined) { seen[matchId] = deduped.length; deduped.push(uItem); }
        else {
          var existingPrice = parseFloat(deduped[seen[matchId]].parsed.price) || 999999;
          var newPrice = parseFloat(uItem.parsed.price) || 999999;
          if (newPrice < existingPrice) deduped[seen[matchId]] = uItem;
        }
      }
      updatedParsed = deduped;
    }
    setParsed(updatedParsed);
    setAddingIdx(null);
  }

  function editCustomCard(idx) {
    if (props.editCustomCardById) props.editCustomCardById(10000 + idx);
  }

  function removeCustomCard(idx) {
    if (confirmDeleteIdx !== idx) {
      setConfirmDeleteIdx(idx);
      return;
    }
    // Second click = confirmed
    var custom = loadCustomCards();
    if (idx < 0 || idx >= custom.length) return;
    custom.splice(idx, 1);
    saveCustomCards(custom);
    mergeCustomCards();
    setConfirmDeleteIdx(null);
    // Re-run matching
    var updatedParsed = parsed.map(function(r) {
      var newMatch = matchToCards(r.parsed);
      return { parsed: r.parsed, match: newMatch, raw: r.raw };
    });
    setParsed(updatedParsed);
  }

  function handleAddToDb(idx) {
    var item = parsed[idx];
    if (!item) return;
    // Use editable form fields
    var f = addForm;
    var dbProduct = f.year + " " + (f.product || "Unknown");
    var dbVariant = f.variant || "Base";
    var dbCardNo = f.cardNo || "";
    var dbPrintRun = f.printRun ? parseInt(f.printRun) : null;
    // Save custom card
    var custom = loadCustomCards();
    // Check for duplicates
    var isDupe = custom.some(function(cc) {
      return cc.product === dbProduct && cc.cardNumber === dbCardNo && cc.cardSet === dbVariant;
    }) || ALL_CARDS.some(function(c) {
      return c.product === dbProduct && c.cardNumber === dbCardNo && c.cardSet === dbVariant;
    });
    if (isDupe) {
      alert("This card already exists in the database!");
      return;
    }
    custom.push({
      product: dbProduct,
      cardNumber: dbCardNo,
      cardSet: dbVariant,
      copies: dbPrintRun,
      isAuto: f.isAuto ? "Yes" : "",
      isMem: f.isMem ? "Yes" : "",
      isRC: f.isRC ? "Yes" : "",
      addedDate: new Date().toISOString().slice(0, 10)
    });
    saveCustomCards(custom);
    mergeCustomCards();
    // Re-run matching on all parsed items so the newly added card gets matched
    var updatedParsed = parsed.map(function(r) {
      var newMatch = matchToCards(r.parsed);
      return { parsed: r.parsed, match: newMatch, raw: r.raw };
    });
    // Re-apply dedup for shop/sportlots mode
    if (mode === "shop" || mode === "sportlots" || mode === "whatnot") {
      var seen = {};
      var deduped = [];
      for (var di = 0; di < updatedParsed.length; di++) {
        var uItem = updatedParsed[di];
        var matchId = uItem.match && uItem.match.score >= 90 ? uItem.match.card.id : null;
        if (!matchId) { deduped.push(uItem); continue; }
        if (seen[matchId] === undefined) { seen[matchId] = deduped.length; deduped.push(uItem); }
        else {
          var existingPrice = parseFloat(deduped[seen[matchId]].parsed.price) || 999999;
          var newPrice = parseFloat(uItem.parsed.price) || 999999;
          if (newPrice < existingPrice) deduped[seen[matchId]] = uItem;
        }
      }
      updatedParsed = deduped;
    }
    setParsed(updatedParsed);
    setAddingIdx(null);
  }

  var PRODUCT_MAP = {
    "topps heritage high number": "topps heritage",
    "topps update series": "topps update",
    "topps chrome update series": "topps chrome update",
    "topps chrome update series sapphire edition": "topps chrome update sapphire edition",
    "topps cosmic chrome": "topps chrome cosmic",
    "topps transcendent collection": "topps transcendent",
    "panini donruss": "donruss",
    "panini donruss optic": "donruss optic",
    "panini national treasures": "national treasures",
    "panini boys of summer": "boys of summer",
    "panini elite extra edition": "elite extra edition",
    "panini elite": "elite extra edition",
    "panini prospect edition": "prospect edition",
    "panini prizm draft picks": "prizm draft picks",
    "topps stadium club": "stadium club",
    "bowman chrome draft sapphire edition": "bowman draft sapphire edition",
    "bowman chrome sapphire edition": "bowman chrome sapphire",
    "leaf pro set metal": "pro set metal",
    "topps heritage high": "topps heritage",
    "topps gilded collection": "topps gilded collection",
    "topps tier one": "topps tier one",
    "topps tier 1": "topps tier one",
    "topps pristine": "topps pristine",
    "topps now": "topps now",
    "topps archives": "topps archives",
    "panini crusade": "crusade",
    "panini three and two": "three and two",
    "panini flawless": "flawless",
    "panini select": "select",
    "panini mosaic": "mosaic",
    "bowman draft chrome": "bowman draft chrome",
    "bowman chrome draft": "bowman draft chrome",
    "bowman\'s best": "bowmans best",
    "bowman best": "bowmans best",
    "bowman platinum": "bowman platinum",
    "bowman sterling": "bowman sterling",
    "bowman invicta": "bowman chrome draft",
    "panini prism": "panini prizm",
    "panini prism draft picks": "prizm draft picks",
    "topps cosmic chrome": "topps chrome cosmic",
    "topps teir 1": "topps tier one",
    "topps tier 1": "topps tier one",
    "topps teir one": "topps tier one",
    "panini prospects": "prospect edition",
    "panini prospect": "prospect edition",
    "topps pro debut": "pro debut",
    "panini chronicles": "panini chronicles",
    "panini crusade": "panini crusade",
    "panini prizm": "panini prizm",
    "wisconsin timber rattlers": "timber rattlers"
  };

  function norm(s) {
    return (s || "").toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/ +/g, " ").trim();
  }

  function parseCOMCLine(row) {
    var setName = row["Set Name"] || "";
    var ym = setName.match(/^(\d{4})\s+/);
    var year = ym ? ym[1] : "";
    var rest = year ? setName.slice(year.length).trim() : setName;
    var parts = rest.split(" - ");
    var product = (parts[0] || rest).trim();
    var variantParts = [];
    for (var k = 1; k < parts.length; k++) {
      var p = parts[k].trim();
      if (p === "[Base]") continue;
      p = p.replace("[Base] ", "").replace("[Base]", "").trim();
      if (p.indexOf("- ") === 0) p = p.slice(2);
      if (p) variantParts.push(p);
    }
    var variant = variantParts.join(" ").trim();
    var cardNo = (row["Card No"] || "").trim();
    var cardNoClean = cardNo.replace(/\.\d+$/, "");
    var serial = (row["Serial No"] || "").trim();
    if (serial === "0") serial = "";
    return {
      year: year, product: product, variant: variant,
      cardNo: cardNo, cardNoClean: cardNoClean,
      serial: serial, printRun: (row["Qty Manufactured"] || "").trim(),
      price: (row["Purchase Price"] || "").trim(),
      date: (row["Date Sold"] || "").trim().slice(0, 10),
      seller: (row["Purchased From"] || "").trim(),
      rawSet: setName, description: (row["Description"] || "").trim(),
      orderNum: ""
    };
  }

  var EBAY_NOT_TB = ["tyler warren","tyler kolek","tyler herro","tyler guyton","tyler nubin",
    "tyler smith","tyler shough","tyler bouck","tyler ennis","tyler flowers","tyler glasnow",
    "tyler lockett","tyler lacy","tyler kleven","tyler hendricks","tyler gaffney","tyler danish",
    "tyler matzek","tyler stephenson","tyler bremner","tyler burton","tyler lussi","tyler allgeier",
    "tyler toffoli","tyler seguin","tyler soderstrom","tyler jay","tyler locket","tyler bass",
    "tyler fitzgerald","tyler callihan","tyler locklear","tyler rogers","tyler anderson",
    "tyler o'neill","tyler tolbert","tyler mahle","tyler goodson","tyler stuart","tyler freeman",
    "seth rollins","dale earnhardt","todd gilliland","manaka matsukubo","dedniel nunez","seiya suzuki"];
  var EBAY_SPORT_EXCLUDE = ["knicks","heat","colts","saints","jaguars","panthers","seahawks",
    "celtics","lakers","warriors","packers","eagles","cowboys","steelers",
    "nfl","nba","nhl","football","basketball","hockey","soccer","wrestling","indianapolis","penn state"];
  var EBAY_PRODUCTS = [
    ["topps chrome update sapphire", "Topps Chrome Update Sapphire Edition"],
    ["topps chrome update", "Topps Chrome Update"],
    ["topps chrome cosmic", "Topps Chrome Cosmic"],
    ["topps cosmic chrome", "Topps Chrome Cosmic"],
    ["topps chrome", "Topps Chrome"],
    ["chrome update", "Topps Chrome Update"],
    ["topps update", "Topps Update"],
    ["topps heritage high", "Topps Heritage High Number"],
    ["topps heritage", "Topps Heritage"],
    ["topps inception", "Topps Inception"],
    ["topps gilded collection", "Topps Gilded Collection"],
    ["topps stadium club", "Stadium Club"],
    ["stadium club", "Stadium Club"],
    ["topps archives", "Topps Archives"],
    ["topps pristine", "Topps Pristine"],
    ["topps now", "Topps Now"],
    ["topps tier 1", "Topps Tier One"],
    ["topps teir 1", "Topps Tier One"],
    ["1989 topps", "Topps Update"],
    ["bowman draft chrome", "Bowman Draft Chrome"],
    ["bowman draft sapphire", "Bowman Draft Sapphire Edition"],
    ["bowman chrome draft", "Bowman Draft Chrome"],
    ["bowman chrome sapphire", "Bowman Chrome Sapphire Edition"],
    ["bowman chrome", "Bowman Chrome"],
    ["bowman draft", "Bowman Draft"],
    ["bowman\'s best", "Bowman\'s Best"],
    ["bowman platinum", "Bowman Platinum"],
    ["bowman sterling", "Bowman Sterling"],
    ["bowman scouts", "Bowman Chrome"],
    ["bowman invicta", "Bowman Chrome Draft"],
    ["bowman", "Bowman"],
    ["donruss optic", "Donruss Optic"],
    ["donruss", "Donruss"],
    ["panini prizm draft", "Panini Prizm Draft Picks"],
    ["prizm draft", "Panini Prizm Draft Picks"],
    ["panini prizm", "Panini Prizm"],
    ["panini prospect edition", "Panini Prospect Edition"],
    ["prospect edition", "Panini Prospect Edition"],
    ["panini select", "Panini Select"],
    ["panini mosaic", "Mosaic"],
    ["panini national treasures", "Panini National Treasures"],
    ["national treasures", "Panini National Treasures"],
    ["panini crusade", "Panini Crusade"],
    ["panini three and two", "Panini Three and Two"],
    ["three and two", "Panini Three and Two"],
    ["panini boys of summer", "Panini Boys of Summer"],
    ["boys of summer", "Panini Boys of Summer"],
    ["panini flawless", "Panini Flawless"],
    ["flawless", "Panini Flawless"],
    ["elite extra edition", "Panini Elite Extra Edition"],
    ["leaf metal draft", "Leaf Metal Draft"],
    ["leaf pro set metal", "Leaf Pro Set Metal"],
    ["leaf draft", "Leaf Draft"],
    ["leaf trinity", "Leaf Trinity"],
    ["leaf flash", "Leaf Flash"],
    ["leaf valiant", "Leaf Valiant"],
    ["pro set metal", "Leaf Pro Set Metal"],
    ["timber rattlers", "Wisconsin Timber Rattlers"],
    ["topps pro debut", "Topps Pro Debut"],
    ["pro debut", "Topps Pro Debut"],
    ["pulse", "Pulse"],
    ["topps finest", "Topps Finest"],
    ["select", "Panini Select"],
    ["mosaic", "Mosaic"],
    ["optic", "Donruss Optic"],
    ["national treasures", "Panini National Treasures"],
    ["crusade", "Panini Crusade"],
    ["1989 topps chrome silver pack", "Topps Update"],
    ["1989 topps chrome", "Topps Update"],
    ["1994 topps", "Topps Archives"],
    ["bowman scouts top 100", "Bowman Chrome"],
    ["top 100 prospect", "Bowman Chrome"],
    ["alpha", "Leaf Alpha"],
    ["bowman invicta", "Bowman Chrome Draft"],
    ["bowman inception", "Bowman Inception"],
    ["elite extra edition", "Panini Elite Extra Edition"],
    ["panini chronicles", "Panini Chronicles"],
    ["chronicles revolution", "Panini Chronicles"],
    ["panini prospect edition", "Panini Prospect Edition"],
    ["panini prospect", "Panini Prospect Edition"],
    ["topps now", "Topps Now"],
    ["wild card", "Wild Card"],
    ["leaf trinity", "Leaf Trinity"],
    ["leaf flash", "Leaf Flash"],
    ["leaf valiant", "Leaf Valiant"],
    ["gilded collection", "Topps Gilded Collection"],
    ["bowman sterling", "Bowman Sterling"],
    ["bowman platinum", "Bowman Platinum"],
    ["bowman\'s best", "Bowmans Best"],
    ["bowmans best", "Bowmans Best"],
    ["1989 topps", "Topps Update"],
    ["topps tier", "Topps Tier One"],
    ["topps chrome cosmic", "Topps Chrome Cosmic"],
    ["cosmic chrome", "Topps Chrome Cosmic"],
    ["topps pristine", "Topps Pristine"],
    ["sage", "SAGE"],
    ["topps archives", "Topps Archives"]
  ];

  function parseEbayTitle(title) {
    var tl = title.toLowerCase();
    var ym = title.match(/\b(20[12]\d)\b/);
    var year = ym ? ym[1] : "";
    var cardNo = "";
    // Strip "Serial #NN" first so it doesn't confuse card number patterns
    var titleForCN = title.replace(/Serial\s*#?\d+/ig, "SERIAL_STRIPPED");
    // Pattern 1: #USC174, #BD-200, #BDC-200, #US150, #PDP33, #II-25 (letter+digit combos)
    var cnm = titleForCN.match(/#([A-Za-z][A-Za-z0-9]*-?[A-Za-z0-9]*\d+[A-Za-z]*(?:-[A-Za-z0-9]+)?)/i);
    if (cnm) cardNo = cnm[1];
    // Pattern 1b: #DIGITS NOT followed by /DIGITS (pure numeric card numbers like #578, #177, #120)
    if (!cardNo) {
      var allHashNums = [];
      var hnRe = /#(\d+[a-z]?)\b/gi;
      var hnm;
      while ((hnm = hnRe.exec(titleForCN)) !== null) {
        var afterHN = titleForCN.slice(hnm.index + hnm[0].length);
        if (!/^\s*\/\s*\d/.test(afterHN)) allHashNums.push(hnm[1]);
      }
      if (allHashNums.length > 0) cardNo = allHashNums[0];
    }
    // Pattern 2: #C-TB, #BI-21, #SIG-TB, #PJA-TB, #RA-TB (letter-dash-letter combos)
    if (!cardNo) { var cnm2 = titleForCN.match(/#([A-Z]+-[A-Z]+\d*)/i); if (cnm2) cardNo = cnm2[1]; }
    // Pattern 2b: #USC_124 (underscore variants)
    if (!cardNo) { var cnm2b = titleForCN.match(/#([A-Z]+_\d+)/i); if (cnm2b) cardNo = cnm2b[1].replace(/_/g, ""); }
    // Pattern 3: CN#157, Card 138, card#63, Card No. 138, Card No. 195
    if (!cardNo) { var cnm3 = titleForCN.match(/(?:CN|card)\s*(?:No\.?\s*)?#?(\d+)/i); if (cnm3) cardNo = cnm3[1]; }
    // Pattern 4: Known card number patterns without # prefix
    if (!cardNo) {
      var knownPats = titleForCN.match(/\b(BD-?\d+|BDC-?\d+|USC\d+|US\d+|PDP\d+|BMA-[A-Z]+|CDA-[A-Z]+|BTP-?\d+|TOP-?\d+|PD-?\d+|II-\d+|YQ-?\d+|BI-?\d+|BA-[A-Z]+\d*|FS-[A-Z]+\d*|T89CU-?\d+|89US-?\d+|PJA-[A-Z]+|RA-[A-Z]+|PRV-[A-Z]+|PPA-[A-Z]+|C-[A-Z]+|SIG-[A-Z]+|BOS-?\d+|SSP-?\d+|FTA-[A-Z]+|PA-[A-Z]+\d*|RKPA-[A-Z]+)\b/i);
      if (knownPats) cardNo = knownPats[1];
    }
    var serial = "", printRun = "";
    var snm = title.match(/\b(\d+)\s*\/\s*(\d+)\b/);
    if (snm) { serial = snm[1]; printRun = snm[2]; }
    else { var prm = title.match(/\/(\d+)(?:\s|$|[^0-9])/); if (prm) printRun = prm[1]; }
    var graded = "";
    var gm = title.match(/\b(PSA|BGS|SGC|CGC|HGA|CSG|GMA?)\s*(\d+\.?\d*)/i);
    if (gm) graded = gm[1].toUpperCase() + " " + gm[2];
    var isAuto = /\b(auto|autograph|signed|on.card auto|on-card auto)\b/i.test(title);
    var product = "";
    for (var pi = 0; pi < EBAY_PRODUCTS.length; pi++) {
      if (tl.indexOf(EBAY_PRODUCTS[pi][0]) !== -1) { product = EBAY_PRODUCTS[pi][1]; break; }
    }
    // Fix common seller typos
    if (cardNo === "USC74") cardNo = "USC174"; // common typo
    if (cardNo === "BD200") cardNo = "BD-200"; // missing dash
    if (cardNo === "BDC200") cardNo = "BDC-200";
    if (cardNo === "89US11") cardNo = "89US-11"; // missing dash
    if (cardNo === "USC_124") cardNo = "USC124"; // underscore
    // Known eBay mislabels: sellers use base card # for auto inserts
    if (product === "Stadium Club" && cardNo === "177" && isAuto) cardNo = "SCCA-BLA";
    return {
      year: year, product: product, variant: "",
      cardNo: cardNo, cardNoClean: cardNo.replace(/\.\d+$/, ""),
      serial: serial, printRun: printRun, graded: graded, isAuto: isAuto,
      rawSet: title, description: "Tyler Black", seller: "eBay", source: "eBay"
    };
  }

  function parseEbaySearchResults(text) {
    var lines = text.split("\n");
    var listings = [];
    var stopParsing = false;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      // Stop parsing at eBay recommendation/watchlist sections — these have abbreviated data
      // (no bid counts, no listing type) which causes auctions to appear as BIN deals
      if (/^Inspired by your activity|^Pick up where you left off|^Related Searches$/i.test(line)) { stopParsing = true; }
      if (stopParsing) continue;
      if (line.indexOf("Opens in a new window or tab") === -1) continue;
      var title = line.replace(/Opens in a new window or tab$/, "").trim();
      if (!title || title.length < 10) continue;
      if (/^Shop on eBay/i.test(title)) continue;
      if (/complete your set|set builder|you pick/i.test(title)) continue;
      var titleLow = title.toLowerCase();
      if (titleLow.indexOf("tyler black") === -1) continue;
      var excluded = false;
      for (var ei = 0; ei < EBAY_NOT_TB.length; ei++) {
        if (titleLow.indexOf(EBAY_NOT_TB[ei]) !== -1) { excluded = true; break; }
      }
      if (excluded) continue;
      for (var si = 0; si < EBAY_SPORT_EXCLUDE.length; si++) {
        if (titleLow.indexOf(EBAY_SPORT_EXCLUDE[si]) !== -1) { excluded = true; break; }
      }
      if (excluded) continue;
      var price = "", shipping = "", shippingNum = 0, timeLeft = "", condition = "";
      var listingType = "", bids = "", binPrice = "";
      for (var j = i + 1; j < Math.min(i + 20, lines.length); j++) {
        var jl = lines[j].trim();
        if (!jl) continue;
        if (jl.indexOf("Opens in a new window or tab") !== -1) break;
        if (/^Related:|^Results Pagination|^Recently viewed|^Feedback$|^About eBay|^Tell us what/.test(jl)) break;
        if (!condition && /^(Pre-Owned|New \(Other\)|New|Brand New|Not Specified)/.test(jl)) { condition = jl; continue; }
        if (!price && /^\$[\d,]+\.?\d*/.test(jl)) {
          if (/to \$/.test(jl)) continue;
          var pm = jl.match(/^\$([\d,]+\.?\d*)/);
          if (pm) price = pm[1].replace(/,/g, "");
          continue;
        }
        if (price && !binPrice && /^\$[\d,]+\.?\d*$/.test(jl)) {
          var bpm = jl.match(/^\$([\d,]+\.?\d*)/);
          if (bpm) binPrice = bpm[1].replace(/,/g, "");
          continue;
        }
        if (/bids?\s*\xb7?\s*Time left/i.test(jl) || /^\d+ bids?\s*\xb7/.test(jl) || /Time left/i.test(jl) || /^\d+ bids?$/.test(jl)) {
          timeLeft = jl;
          var bm2 = jl.match(/(\d+)\s*bids?/);
          if (bm2) { bids = bm2[1]; listingType = "auction"; }
          continue;
        }
        if (/^Buy It Now/.test(jl)) { listingType = listingType || "bin"; continue; }
        if (/^or Best Offer/.test(jl)) { if (!listingType) listingType = "best_offer"; continue; }
        if (/delivery$/.test(jl) || /shipping$/.test(jl)) {
          if (/Free delivery|Free shipping/i.test(jl)) { shipping = "Free"; shippingNum = 0; }
          else { var sm2 = jl.match(/\+?\$?([\d,.]+)/); if (sm2) { shipping = "$" + sm2[1]; shippingNum = parseFloat(sm2[1]) || 0; } }
          continue;
        }
        if (/^Located in/.test(jl)) break;
      }
      if (!price) continue;
      var parsed = parseEbayTitle(title);
      parsed.price = price;
      parsed.shipping = shipping;
      parsed.shippingNum = shippingNum;
      parsed.totalPrice = ((parseFloat(price) || 0) + shippingNum).toFixed(2);
      parsed.timeLeft = timeLeft;
      parsed.condition = condition;
      parsed.listingType = listingType || "bin";
      parsed.bids = bids;
      parsed.binPrice = binPrice;
      // Safety: if price is $0.99 and no explicit listing type detected, likely an auction
      if (!listingType && parseFloat(price) <= 0.99) {
        parsed.listingType = "auction";
        parsed.bids = "?";
      }
      // Safety: if price is $0.99 and no explicit listing type detected, likely an auction
      if (!listingType && parseFloat(price) <= 0.99) {
        parsed.listingType = "auction";
        parsed.bids = "?";
      }
      listings.push(parsed);
    }
    return listings;
  }

  function parseEbayLine(line) {
    var parts = line.split("|");
    var title = (parts[0] || "").trim();
    var price = (parts[1] || "").trim().replace(/^\$/, "");
    var date = (parts[2] || "").trim();
    var orderNum = (parts[3] || "").trim();
    var parsed = parseEbayTitle(title);
    parsed.price = price;
    parsed.date = date;
    parsed.orderNum = orderNum;
    return parsed;
  }

  function parseCOMCShopText(text) {
    // Flexible parser for COMC marketplace copy-paste.
    // COMC listings may come in many formats depending on what the user selects/copies.
    // Strategy: find lines with a year + card-like info, grab price from nearby lines.
    var lines = text.split("\n").map(function(l) { return l.trim(); });
    var results = [];
    
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (!line) continue;
      
      // Skip obvious non-card lines
      if (/^(sort by|recently added|in stock|out of stock|nm or better|view cart|sign in|baseball|cards|listings)/i.test(line)) continue;
      if (line.length < 8) continue;
      
      // Check if this line looks like a card listing
      var yearMatch = line.match(/\b(20[12]\d)\b/);
      if (!yearMatch) continue;
      
      // Must have some card-related content
      var hasProduct = /topps|bowman|panini|donruss|leaf|prizm|select|chrome|heritage|stadium|inception|mosaic|optic|sapphire|trilogy|sterling|finest|gypsy|allen|tier|ultra|flux|illusions|revolution|obsidian|spectra|immaculate|national|absolute|certified|contenders|prestige|score|zenith|classic|elite|archives|transcendent|gilded|triple|flawless|impeccable|crusade|prospect|valiant|trinity|platinum|pro set/i.test(line);
      var hasPlayer = /tyler\s*black/i.test(line);
      var hasCardNum = /#[A-Za-z0-9][-A-Za-z0-9.]*/i.test(line);
      
      if (!hasProduct && !hasPlayer && !hasCardNum) continue;
      
      var year = yearMatch[1];
      
      // Extract card number
      var cnm = line.match(/#([A-Za-z0-9][-A-Za-z0-9.]*)/)
      var cardNo = cnm ? cnm[1] : "";
      
      // Parse set structure: "YYYY Product - Variant - SubVariant #NUM Player"
      // First strip everything after the card number or player name to get the set portion
      var setPortions = line;
      // Remove player name
      setPortions = setPortions.replace(/\btyler\s*black\b/gi, "").trim();
      // Remove card number from inline
      if (cnm) setPortions = setPortions.replace(/#[A-Za-z0-9.\-]+/, "").trim();
      // Remove price if inline
      setPortions = setPortions.replace(/\$[\d.,]+/g, "").trim();
      // Remove year prefix
      setPortions = setPortions.replace(/^.*?\b20[12]\d\b\s*/, "").trim();
      // Remove trailing conditions/stock info/grading
      setPortions = setPortions.replace(/\s*\[(PSA|BGS|CSG|CGC|SGC)\s+[^\]]*\]/gi, "");
      setPortions = setPortions.replace(/\s*\[(EX|NM|VG|Good|Fair|Poor)[^\]]*\]/gi, "");
      setPortions = setPortions.replace(/\s+(?:NM|Near Mint|EX|VG|Poor)(?=\s|$|[,;.]).*$/i, "").trim();
      setPortions = setPortions.replace(/\s+(?:In Stock|Out of Stock|Qty|Condition)\b.*$/i, "").trim();
      // Remove [Base] tags but track them
      var isBase = /\[Base\]/.test(setPortions);
      setPortions = setPortions.replace(/\s*-\s*\[Base\]\s*-\s*/g, " - ").replace(/\s*-\s*\[Base\]\s*/g, " ").replace(/\[Base\]\s*/g, "").trim();
      // Clean double dashes and trailing/leading dashes
      setPortions = setPortions.replace(/\s*-\s*-\s*/g, " - ").replace(/\s*-\s*$/, "").replace(/^\s*-\s*/, "").trim();
      
      var setParts = setPortions.split(/\s+-\s+/);
      var product = (setParts[0] || "").trim().replace(/\s*\.\d+$/, "");
      var variantParts = [];
      for (var sp = 1; sp < setParts.length; sp++) {
        var sv = setParts[sp].trim();
        if (!sv || sv === "Base" || sv === "[Base]") continue;
        variantParts.push(sv);
      }
      var variant = variantParts.join(" ").trim();
      if (!variant && isBase) variant = "Base";
      if (!variant) variant = "Base";
      
      // Extract price - check inline first, then next lines
      var price = "";
      var priceInline = line.match(/\$(\d+(?:[.,]\d+)?)/);
      if (priceInline) {
        price = priceInline[1].replace(",", "");
      } else {
        for (var look = 1; look <= 5 && i + look < lines.length; look++) {
          var nextLine = lines[i + look];
          if (!nextLine) continue;
          // "5 from $1.45" or "$10.25" or "2 from $4.98"
          var pm = nextLine.match(/\$(\d+(?:\.\d+)?)/);
          if (pm) { price = pm[1]; break; }
          // Plain number on its own line
          var pm2 = nextLine.match(/^(\d+\.\d{2})$/);
          if (pm2) { price = pm2[1]; break; }
          // Stop looking if we hit another card line
          if (/\b20[12]\d\b/.test(nextLine)) break;
        }
      }
      
      // Extract print run "/50" etc
      var snm = line.match(/\/(\d+)(?:\s|$|[^0-9])/);
      var printRun = snm ? snm[1] : "";
      
      results.push({
        year: year, product: product, variant: variant,
        cardNo: cardNo, cardNoClean: cardNo.replace(/\.\d+$/, ""),
        serial: "", printRun: printRun, price: price,
        date: "", seller: "COMC",
        rawSet: line, description: "Tyler Black", orderNum: ""
      });
    }
    return results;
  }

  // ---- SportLots Parser ----
  // Splits a SportLots set name (year already stripped) into {product, variant}
  function splitSportLotsSet(setNoYear) {
    // Known base products ordered longest-first for greedy matching
    // sl = SportLots prefix (lowercase), db = TCDB product name, vp = variant prefix to prepend
    var BASES = [
      { sl: "bowman chrome draft sapphire edition", db: "Bowman Draft Sapphire Edition", vp: "Chrome " },
      { sl: "bowman chrome draft", db: "Bowman Draft", vp: "Chrome " },
      { sl: "bowman chrome bowman scouts top 100", db: "Bowman Chrome", vp: "Bowman Scouts Top 100 " },
      { sl: "bowman chrome bowman invicta", db: "Bowman Chrome", vp: "Bowman Invicta " },
      { sl: "bowman chrome international impact", db: "Bowman Chrome", vp: "International Impact " },
      { sl: "bowman chrome", db: "Bowman Chrome", vp: "" },
      { sl: "bowman draft 1st edition", db: "Bowman Draft", vp: "1st Edition " },
      { sl: "bowman draft sapphire edition", db: "Bowman Draft Sapphire Edition", vp: "" },
      { sl: "bowman draft", db: "Bowman Draft", vp: "" },
      { sl: "bowman platinum top prospects", db: "Bowman Platinum", vp: "Top Prospects " },
      { sl: "bowman platinum", db: "Bowman Platinum", vp: "" },
      { sl: "bowman best", db: "Bowman's Best", vp: "" },
      { sl: "bowman sterling", db: "Bowman Sterling", vp: "" },
      { sl: "topps heritage high number", db: "Topps Heritage", vp: "" },
      { sl: "topps heritage", db: "Topps Heritage", vp: "" },
      { sl: "topps chrome update", db: "Topps Chrome Update", vp: "" },
      { sl: "topps chrome cosmic", db: "Topps Chrome Cosmic", vp: "" },
      { sl: "topps chrome", db: "Topps Chrome", vp: "" },
      { sl: "topps update", db: "Topps Update", vp: "" },
      { sl: "topps archives", db: "Topps Archives", vp: "" },
      { sl: "topps gilded collection", db: "Topps Gilded Collection", vp: "" },
      { sl: "topps tier one", db: "Topps Tier One", vp: "" },
      { sl: "topps pristine", db: "Topps Pristine", vp: "" },
      { sl: "topps inception", db: "Topps Inception", vp: "" },
      { sl: "stadium club", db: "Stadium Club", vp: "" },
      { sl: "donruss optic", db: "Donruss", vp: "Optic " },
      { sl: "donruss", db: "Donruss", vp: "" },
      { sl: "panini prizm draft picks", db: "Panini Prizm Draft Picks", vp: "" },
      { sl: "panini prizm signatures", db: "Panini Prizm", vp: "Signatures " },
      { sl: "panini prizm", db: "Panini Prizm", vp: "" },
      { sl: "panini chronicles revolution", db: "Panini Chronicles", vp: "Revolution " },
      { sl: "panini chronicles", db: "Panini Chronicles", vp: "" },
      { sl: "panini prospect edition", db: "Panini Prospect Edition", vp: "" },
      { sl: "panini crusade", db: "Panini Crusade", vp: "" },
      { sl: "panini select", db: "Select", vp: "" },
      { sl: "leaf metal draft", db: "Leaf Metal Draft", vp: "" },
      { sl: "leaf metal", db: "Leaf Metal", vp: "" },
      { sl: "leaf flash", db: "Leaf Flash", vp: "" },
      { sl: "leaf valiant", db: "Leaf Valiant", vp: "" },
      { sl: "leaf trinity mega box", db: "Leaf Trinity Mega Box", vp: "" },
      { sl: "leaf trinity", db: "Leaf Trinity", vp: "" },
      { sl: "pro set metal", db: "Pro Set Metal", vp: "" },
      { sl: "elite extra edition", db: "Panini Elite Extra Edition", vp: "" },
      { sl: "pro debut", db: "Pro Debut", vp: "" },
    ];

    var lower = setNoYear.toLowerCase().trim();
    for (var i = 0; i < BASES.length; i++) {
      var b = BASES[i];
      if (lower.indexOf(b.sl) === 0) {
        var remainder = setNoYear.substring(b.sl.length).trim();
        // "Base Set" → "Base"
        if (!remainder || /^base\s*set$/i.test(remainder)) {
          return { product: b.db, variant: b.vp ? b.vp.trim() : "Base" };
        }
        var variant = (b.vp + remainder).trim();
        // Strip "Prospect Ticket" from Panini Prospect Edition variants
        if (b.db === "Panini Prospect Edition") {
          variant = variant.replace(/\s*Prospect Ticket\s*/i, " ").trim() || "Base";
        }
        return { product: b.db, variant: variant };
      }
    }
    // Fallback: use full name as product
    return { product: setNoYear, variant: "Base" };
  }

  function parseSportLotsText(text) {
    var lines = text.split("\n").map(function(l) { return l.trim(); });
    var results = [];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (!line) continue;

      // Match card number + player lines: "#XXX Tyler Black" or "#XXX Tyler Black|Other Player"
      var cardMatch = line.match(/^#([A-Za-z0-9][-A-Za-z0-9.]*)\s+(.*)/);
      if (!cardMatch) continue;

      var cardNo = cardMatch[1];
      var playerPart = cardMatch[2];

      // Must contain Tyler Black (filter out false positives like Tyler Woessner)
      if (!/tyler\s*black/i.test(playerPart)) continue;

      // Look backwards for the set name (should start with a 4-digit year)
      var setName = "";
      for (var j = i - 1; j >= Math.max(0, i - 5); j--) {
        var prevLine = lines[j];
        if (!prevLine) continue;
        if (/^(Low Price|Total Quantity|Results|Page:)/i.test(prevLine)) continue;
        if (/^\d{4}\s+\S/.test(prevLine)) {
          setName = prevLine;
          break;
        }
      }
      if (!setName) continue;

      // Extract year
      var yearMatch = setName.match(/^(\d{4})\s+/);
      var year = yearMatch ? yearMatch[1] : "";

      // Check for [VAR xxx] tag in player part
      var varTag = "";
      var varTagMatch = playerPart.match(/\[VAR\s+(.*?)\]/i);
      if (varTagMatch) varTag = varTagMatch[1].trim();

      // Strip year from set name and split product/variant
      var setNoYear = setName.replace(/^\d{4}\s+/, "").trim();
      var parsed = splitSportLotsSet(setNoYear);
      var product = parsed.product;
      var variant = parsed.variant;

      // Override variant if [VAR xxx] tag found
      if (varTag) variant = varTag + " Variations";

      // Look forward for price and quantity
      var price = "";
      var quantity = "";
      for (var k = i + 1; k <= Math.min(lines.length - 1, i + 5); k++) {
        var nextLine = lines[k];
        if (!nextLine) continue;
        var priceMatch = nextLine.match(/Low Price:\s*\$(\d+(?:\.\d+)?)/);
        if (priceMatch) price = priceMatch[1];
        var qtyMatch = nextLine.match(/Total Quantity:\s*(\d+)/);
        if (qtyMatch) quantity = qtyMatch[1];
        // Stop if we hit another card number or set name line
        if (/^#[A-Za-z0-9]/.test(nextLine) || /^\d{4}\s+\S/.test(nextLine)) break;
      }

      // Extract print run "/50" etc from set name or variant
      var snm = setName.match(/\/(\d+)(?:\s|$|[^0-9])/);
      var printRun = snm ? snm[1] : "";

      results.push({
        year: year, product: product, variant: variant,
        cardNo: cardNo, cardNoClean: cardNo.replace(/\.\d+$/, ""),
        serial: "", printRun: printRun, price: price,
        date: "", seller: "SportLots", source: "SportLots",
        rawSet: setName + " #" + cardNo,
        description: "Tyler Black", orderNum: "",
        slQuantity: quantity
      });
    }
    return results;
  }

  // Parse Whatnot search results paste
  function parseWhatnotText(text) {
    var lines = text.split("\n");
    var results = [];
    var seenTitles = {};
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      // Look for price lines: US$XX.XX, US$XX, £XX, £XX.XX
      var priceMatch = line.match(/^(?:US)?\$([\d,.]+)$/i) || line.match(/^£([\d,.]+)$/);
      if (!priceMatch) continue;
      var price = priceMatch[1].replace(/,/g, "");
      // Look backwards for the title (skip blank lines, "Card image", UUIDs, seller repeats)
      var title = "";
      var seller = "";
      for (var j = i - 1; j >= Math.max(0, i - 8); j--) {
        var jl = lines[j].trim();
        if (!jl) continue;
        if (/^Ships from/i.test(jl)) continue;
        if (/^Card image$/i.test(jl)) continue;
        if (/^front$/i.test(jl)) continue;
        // UUID pattern (Whatnot image IDs)
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(jl)) continue;
        // Very short lines (1-2 chars) are likely UI artifacts
        if (jl.length < 5) continue;
        // If line looks like a card title (has digits, has enough length)
        if (jl.length >= 10) {
          title = jl;
          // Now find seller (look further back)
          for (var k = j - 1; k >= Math.max(0, j - 5); k--) {
            var kl = lines[k].trim();
            if (!kl) continue;
            if (/^Card image$/i.test(kl)) continue;
            if (/^front$/i.test(kl)) continue;
            if (/^[0-9a-f]{8}-[0-9a-f]{4}/i.test(kl)) continue;
            if (kl.length < 3) continue;
            // Seller names are usually short, no special chars
            if (kl.length < 40 && !/^\$|^US\$|^£/.test(kl)) {
              seller = kl;
              break;
            }
          }
          break;
        }
      }
      if (!title) continue;
      var titleLow = title.toLowerCase();
      // Must contain "tyler black"
      if (titleLow.indexOf("tyler black") === -1) continue;
      // Exclude other Tylers and non-baseball
      var excluded = false;
      for (var ei = 0; ei < EBAY_NOT_TB.length; ei++) {
        if (titleLow.indexOf(EBAY_NOT_TB[ei]) !== -1) { excluded = true; break; }
      }
      if (excluded) continue;
      for (var si = 0; si < EBAY_SPORT_EXCLUDE.length; si++) {
        if (titleLow.indexOf(EBAY_SPORT_EXCLUDE[si]) !== -1) { excluded = true; break; }
      }
      if (excluded) continue;
      // Skip team lots / bundles
      if (/team lot|you pick|pick your card|complete your set|card lot/i.test(title)) continue;
      // Deduplicate by title
      var titleKey = title.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (seenTitles[titleKey]) continue;
      seenTitles[titleKey] = true;
      // Use eBay title parser (reusable across marketplaces)
      var parsed = parseEbayTitle(title);
      parsed.price = price;
      parsed.seller = seller || "Whatnot";
      parsed.source = "Whatnot";
      parsed.rawSet = title;
      parsed.totalPrice = price;
      // Detect if price is in GBP
      if (line.charAt(0) === "\u00A3" || line.charAt(0) === "£") {
        parsed.currency = "GBP";
      }
      results.push(parsed);
    }
    return results;
  }

  // Variant normalization for COMC -> TCDB naming differences
  var VARIANT_NORMALIZE = {
    // Foilboard / Foil mappings
    "holo foilboard": "holofoil", "foilboard": "foil",
    "crackle foilboard": "crackle foil", "sparkle foilboard": "sparkle foil",
    // Refractor suffixes / plurals
    "mini diamond": "mini-diamond", "mini diamond refractor": "mini-diamond refractor",
    "xfractor": "x-fractors", "x fractor": "x-fractors", "x-fractor": "x-fractors",
    "superfractor": "superfractors", "frozenfractor": "frozenfractors",
    "foilfractor": "foilfractors",
    "aqua lava refractor": "aqua lava refractors",
    "raywave refractor": "raywave refractors", "ray wave refractor": "raywave refractors",
    "lava lamp refractor": "lava lamp refractors",
    "wave refractor": "wave refractors",
    "mojo refractor": "mojo refractors",
    "purple mojo refractor": "purple mojo refractors",
    // 1989 Topps Update inserts
    "1989 topps chrome silver pack": "1989 topps baseball 35th anniversary chrome",
    "1989 topps baseball black": "1989 topps baseball 35th anniversary black",
    "1989 topps baseball blue": "1989 topps baseball 35th anniversary blue",
    "1989 topps baseball gold": "1989 topps baseball 35th anniversary gold",
    "1989 topps baseball red": "1989 topps baseball 35th anniversary red",
    "1989 topps baseball platinum": "1989 topps baseball 35th anniversary platinum",
    "1989 topps baseball": "1989 topps baseball 35th anniversary",
    // 1989 Pro Set (COMC shortens)
    "1989 pro set autographs": "1989 pro set base autographs",
    // Leaf Metal Draft: COMC omits "Autographs" from inserts (color variants handled here, base variants handled by EXACT_NORMALIZE below)
    "state pride silver wave": "state pride autographs silver wave",
    "state pride pink rainbow": "state pride autographs pink rainbow",
    "state pride blue rainbow": "state pride autographs blue rainbow",
    "state pride black crystals": "state pride autographs black crystals",
    "state pride purple crystals": "state pride autographs purple crystals",
    "state pride silver crystals": "state pride autographs silver crystals",
    "state pride green crystals": "state pride autographs green crystals",
    "state pride orange crystals": "state pride autographs orange crystals",
    "state pride silver mojo": "state pride autographs silver mojo",
    "state pride blue mojo": "state pride autographs blue mojo",
    "state pride pre-production proof gold wave unsigned": "state pride autographs pre-production proof gold wave unsigned",
    "future stars silver crystals": "future stars autographs silver crystals",
    "future stars green mojo": "future stars autographs green mojo",
    "future stars blue rainbow": "future stars autographs blue rainbow",
    "future stars purple rainbow": "future stars autographs purple rainbow",
    "future stars silver wave": "future stars autographs silver wave",
    // Leaf Flash: COMC omits "Autographs" (color variants handled here, base handled by EXACT_NORMALIZE)
    "flash forward navy": "flash forward autographs navy",
    "flash forward green": "flash forward autographs green",
    "flash forward orange": "flash forward autographs orange",
    "flash forward pink": "flash forward autographs pink",
    "flash forward platinum blue": "flash forward autographs platinum blue",
    "flash forward purple": "flash forward autographs purple",
    "flash forward red": "flash forward autographs red",
    "flash forward silver": "flash forward autographs silver",
    "flash forward yellow": "flash forward autographs yellow",
    // Leaf Valiant: COMC omits "Autographs" from Fearless Phenoms (color variants handled here, base handled by EXACT_NORMALIZE)
    "fearless phenoms black": "fearless phenoms autographs black",
    "fearless phenoms green": "fearless phenoms autographs green",
    "fearless phenoms navy blue": "fearless phenoms autographs navy blue",
    "fearless phenoms orange": "fearless phenoms autographs orange",
    "fearless phenoms pink": "fearless phenoms autographs pink",
    "fearless phenoms platinum blue": "fearless phenoms autographs platinum blue",
    "fearless phenoms purple": "fearless phenoms autographs purple",
    "fearless phenoms red": "fearless phenoms autographs red",
    "fearless phenoms yellow": "fearless phenoms autographs yellow",
    // Leaf Draft: "Base Autographs" → "Autographs"
    "base autographs": "autographs",
    // Topps Update Holiday variants
    "ghost foil": "holiday ghosts", "ghosts foil": "holiday ghosts",
    "jackolantern foil": "holiday jack olanterns",
    "jack olantern foil": "holiday jack olanterns",
    "mummy foil": "holiday mummies", "mummies foil": "holiday mummies",
    "witch hat foil": "holiday witches hats", "witches hat foil": "holiday witches hats",
    "black cat foil": "holiday black cats", "black cats foil": "holiday black cats",
    // Heritage High Number sub-variants 
    "chrome black border": "chrome black refractor",
    "hot box chrome purple refractor": "chrome purple refractors",
    "dark blue border": "dark blue border",
    // Bowman: COMC drops Chrome from "Mega Box Chrome Mojo Autographs" → DB has it in variant
    "mega box chrome mojo autographs": "chrome prospect autographs mojo refractors",
    // Gilded "Cast in Gold" missing "Chrome" - handled by EXACT_NORMALIZE
    // Radiating Rookies missing "Variations" - handled by EXACT_NORMALIZE
    // Gilded Collection: COMC adds "Refractor" to parallels but DB omits it
    "gold wave refractor": "gold wave", "gold wave refractors": "gold wave",
    "gold lava refractor": "gold lava", "gold lava refractors": "gold lava",
    "gold electroplate refractor": "gold electroplate", "gold electroplate refractors": "gold electroplate",
    "gold mini diamond refractor": "gold mini diamond", "gold mini diamond refractors": "gold mini diamond",
    "gold ray wave refractor": "gold ray wave", "gold ray wave refractors": "gold ray wave",
    // Heritage: COMC adds "Minted" to Chrome Gold variants
    "chrome gold minted refractor": "chrome gold refractors",
    "chrome gold minted refractors": "chrome gold refractors",
    // Die-cut normalization
    "diecut": "die cut",
    // Bowman Chrome Asia Mojo
    "chrome asia mojo refractor": "chrome asia refractor",
    // Panini Prospect Edition: strip "Prizm" / "Prizms" (COMC adds, DB omits)
    // Handled in normVariant function below
    // Heritage "Flip Stock" 
    "flip stock": "flip stock"
  };

  function wordsMatch(a, b) {
    // Check if two words are effectively the same (handles plural/singular)
    if (a === b) return true;
    if (a + "s" === b || b + "s" === a) return true;
    if (a.length >= 4 && (b.indexOf(a) !== -1 || a.indexOf(b) !== -1)) return true;
    return false;
  }

  function normVariant(s) {
    var n = norm(s);
    // Strip sub-set names that COMC puts in variant but DB puts in product
    n = n.replace(/^transcendent icons chrome\s*/, "");
    // Apply known normalizations - sort keys by length descending to match longest first
    var keys = Object.keys(VARIANT_NORMALIZE).sort(function(a, b) { return b.length - a.length; });
    for (var ki = 0; ki < keys.length; ki++) {
      var key = keys[ki];
      var val = VARIANT_NORMALIZE[key];
      // Only skip if replacement EXPANDS (val longer than key) AND val already present
      // This prevents "1989 topps baseball" expanding to "1989 topps baseball 35th anniversary" twice
      // But allows contractions like "gold wave refractor" → "gold wave" even if "gold wave" is already a substring
      if (n.indexOf(key) !== -1) {
        if (val.length > key.length && n.indexOf(val) !== -1) continue;
        n = n.replace(key, val);
      }
    }
    // "signatures holo" and "holo signatures" → normalize to "signatures holo" (DB format)
    n = n.replace(/\bholo\s+signatures\b/, "signatures holo");
    // Exact-match normalizations (only when full string matches - prevents double-replacement)
    // These handle cases where COMC omits "Autographs" or "Variations" from Leaf base inserts
    var EXACT_NORMALIZE = {
      "state pride": "state pride autographs",
      "future stars": "future stars autographs",
      "flash forward": "flash forward autographs",
      "fearless phenoms": "fearless phenoms autographs",
      "radiating rookies": "radiating rookies variations",
      "cast in gold autographs": "chrome cast in gold autographs"
    };
    if (EXACT_NORMALIZE[n]) n = EXACT_NORMALIZE[n];
    // Clean up and return
    n = n.replace(/\s+/g, " ").trim();
    if (!n) return "base";
    return n;
  }

  // Generate alternative variant normalizations for retry matching
  function variantAlternatives(nv) {
    var alts = [];
    // Prizm ↔ Holo swap (Panini Prospect Edition uses Holo, COMC uses Prizm)
    if (/\bprizms?\b/.test(nv)) {
      alts.push(nv.replace(/\bprizms?\b/, "holo").replace(/\s+/g, " ").trim());
      alts.push(nv.replace(/\bprizms?\b/, "").replace(/\s+/g, " ").trim());
    }
    if (/\bholo\b/.test(nv)) {
      alts.push(nv.replace(/\bholo\b/, "prizm").replace(/\s+/g, " ").trim());
      alts.push(nv.replace(/\bholo\b/, "prizms").replace(/\s+/g, " ").trim());
    }
    // Reorder "signatures holo" ↔ "holo signatures"
    alts.forEach(function(a, idx) {
      if (/\bholo\s+signatures\b/.test(a)) alts.push(a.replace(/\bholo\s+signatures\b/, "signatures holo"));
      if (/\bsignatures\s+holo\b/.test(a)) alts.push(a.replace(/\bsignatures\s+holo\b/, "holo signatures"));
    });
    return alts;
  }

  function matchEbayByTitleScan(p, cards) {
    function normW(w) {
      if (w === "prizm" || w === "prizms" || w === "prism" || w === "prisms") return "holo";
      if (w === "lazer" || w === "lazers") return "laser";
      if (w === "auto" || w === "autograph" || w === "autographs" || w === "autos") return "auto";
      if (w === "signature" || w === "signatures" || w === "signed" || w === "sigs") return "auto";
      if (w === "refractors") return "refractor";
      if (w === "xfractor" || w === "xfractors" || w === "x-fractor") return "xfractor";
      if (w === "foilboards") return "foilboard";
      if (w === "variations") return "variation";
      if (w === "parallels") return "parallel";
      // Memorabilia synonyms: eBay sellers say "patch/jersey/relic", TCDB says "swatches/threads"
      if (w === "patch" || w === "patches" || w === "jersey" || w === "jerseys" || w === "relic" || w === "relics" || w === "swatches" || w === "swatch" || w === "mem" || w === "memorabilia" || w === "threads" || w === "thread") return "swatch";
      // Count synonyms: eBay says "triple", TCDB says "trio"; eBay says "dual/double", TCDB says "dual"
      if (w === "triple" || w === "trio") return "trio";
      if (w === "double") return "dual";
      return w;
    }

    var rawTitle = (p.rawSet || "").toLowerCase();
    var titleNorm = rawTitle.replace(/[^a-z0-9 ]/g, " ").replace(/ +/g, " ").trim();
    // Join compound terms that get broken by hyphen removal
    titleNorm = titleNorm.replace(/\bx fractor/g, "xfractor").replace(/\bx fractors/g, "xfractors")
      .replace(/\bray wave/g, "raywave").replace(/\bfoil board/g, "foilboard")
      .replace(/\blava lamp/g, "lavalamp").replace(/\bdie cut/g, "diecut")
      .replace(/\bjack o lantern/g, "jackolantern").replace(/\bcolor variant/g, "colorvariant")
      .replace(/\byouth quake/g, "youthquake");
    // Context-dependent noise: "refractor" is redundant when a more specific variant is present
    if (/\bxfractor/.test(titleNorm)) titleNorm = titleNorm.replace(/\brefractors?\b/g, " ").replace(/ +/g, " ").trim();
    var titleWords = titleNorm.split(" ").filter(function(w) { return w.length > 1; });

    var titleNormSet = {};
    for (var tw = 0; tw < titleWords.length; tw++) {
      titleNormSet[titleWords[tw]] = true;
      titleNormSet[normW(titleWords[tw])] = true;
    }

    var titleHasAuto = !!(titleNormSet["auto"]);
    var titlePrintRun = "";
    var prMatch = rawTitle.match(/\/(\d+)/);
    if (prMatch) titlePrintRun = prMatch[1];
    // Fallback: "# 250" with SPACE between # and digits (sellers write "Purple Auto # 250")
    // Card numbers are "#177" with NO space, so requiring space avoids false positives
    if (!titlePrintRun) {
      var prMatch2 = rawTitle.match(/#\s+(\d+)\s*$/);
      if (prMatch2 && parseInt(prMatch2[1]) > 1) titlePrintRun = prMatch2[1];
    }

    var NOISE = {"tyler":1,"black":1,"rc":1,"rookie":1,"rookies":1,"brewers":1,"milwaukee":1,"card":1,"cards":1,"baseball":1,"mlb":1,"mint":1,"near":1,"pre":1,"owned":1,"new":1,"other":1,"rare":1,"hot":1,"invest":1,"investment":1,"psa":1,"bgs":1,"sgc":1,"cgc":1,"hga":1,"gem":1,"the":1,"and":1,"for":1,"lot":1,"lots":1,"from":1,"free":1,"shipping":1,"delivery":1,"plus":1,"read":1,"nice":1,"great":1,"print":1,"run":1,"series":1,"number":1,"prospect":1,"prospects":1,"mega":1,"box":1,"hobby":1,"retail":1,"blaster":1,"pack":1,"jumbo":1,"hanger":1,"cello":1,"fat":1,"value":1,"case":1,"hit":1,"break":1,"rip":1,"look":1,"see":1,"pic":1,"pics":1,"photo":1,"description":1,"desc":1,"combined":1,"with":1,"will":1,"sale":1,"sold":1,"buy":1,"now":1,"bid":1,"obo":1,"offer":1,"best":1,"top":1,"draft":1,"pick":1,"1st":1,"first":1,"round":1,"overall":1,"year":1,"nmmt":1,"exmt":1,"vgex":1,"nrmt":1,"raw":1,"ungraded":1,"graded":1,"debut":1,"ticket":1,"edition":1,"bowman":1};

    // Detect alphanumeric card numbers in title (e.g. #BTP-35, #SCCA-BLA, #USC174)
    // These are HIGHLY specific identifiers — much stronger than plain numeric #63
    var titleAlphaCardNo = null;
    var acnMatch = rawTitle.match(/#([a-z]+[\s-]?\d+[a-z]*)/i) || rawTitle.match(/#([a-z]{2,}\d*[\s-]?[a-z]*\d*)/i);
    if (acnMatch) {
      var candidate = acnMatch[1].toLowerCase().replace(/[^a-z0-9]/g, "");
      // Must contain both letters AND digits, or be 3+ letters (e.g. #NNO)
      if ((/[a-z]/.test(candidate) && /\d/.test(candidate)) || candidate.length >= 3) {
        titleAlphaCardNo = candidate;
      }
    }

    var bestCard = null, bestScore = 0, bestIsAllNoise = false;

    for (var ci = 0; ci < cards.length; ci++) {
      var card = cards[ci];
      var cYear = String((card.product.match(/^\d{4}/) || [""])[0]);
      if (cYear !== p.year) continue;

      // === PRODUCT MATCH (35 pts) ===
      var prodName = card.product.replace(/^\d{4}\s*/, "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/ +/g, " ");
      var prodWords = prodName.split(" ").filter(function(w) { return w.length > 2; });
      var prodHits = 0;
      var prodWordSet = {};
      for (var pw = 0; pw < prodWords.length; pw++) {
        prodWordSet[prodWords[pw]] = true;
        prodWordSet[normW(prodWords[pw])] = true;
        if (titleNormSet[prodWords[pw]] || titleNormSet[normW(prodWords[pw])] || titleNorm.indexOf(prodWords[pw]) !== -1) prodHits++;
      }
      var prodRatio = prodWords.length > 0 ? prodHits / prodWords.length : 0;
      if (prodRatio < 0.5) continue;
      var prodScore = Math.round(prodRatio * 35);

      // Parsed product bonus: EBAY_PRODUCTS already identified the best product match.
      // If the candidate's product matches the parsed product, boost it.
      // If a MORE specific parsed product exists but this candidate is from a less-specific one, penalize.
      if (p.product) {
        var parsedProdNorm = p.product.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/ +/g, " ").trim();
        var cardProdNorm = card.product.replace(/^\d{4}\s*/, "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/ +/g, " ").trim();
        if (cardProdNorm === parsedProdNorm) {
          prodScore = 35; // exact match to parsed product = full marks
        } else if (parsedProdNorm.indexOf(cardProdNorm) === 0 || cardProdNorm.indexOf(parsedProdNorm) === 0) {
          // One is a prefix of the other (e.g. "bowman chrome" vs "bowman chrome sapphire edition")
          // The parsed product is more specific (from ordered EBAY_PRODUCTS), so penalize the shorter one
          if (cardProdNorm.length < parsedProdNorm.length) {
            prodScore = Math.max(0, prodScore - 15); // card is less specific than parsed product
          }
        }
      }

      // Parsed product bonus: EBAY_PRODUCTS already identified the best product match.
      // If the candidate's product matches the parsed product, boost it.
      // If a MORE specific parsed product exists but this candidate is from a less-specific one, penalize.
      if (p.product) {
        var parsedProdNorm = p.product.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/ +/g, " ").trim();
        var cardProdNorm = card.product.replace(/^\d{4}\s*/, "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/ +/g, " ").trim();
        if (cardProdNorm === parsedProdNorm) {
          prodScore = 35; // exact match to parsed product = full marks
        } else if (parsedProdNorm.indexOf(cardProdNorm) === 0 || cardProdNorm.indexOf(parsedProdNorm) === 0) {
          // One is a prefix of the other (e.g. "bowman chrome" vs "bowman chrome sapphire edition")
          // The parsed product is more specific (from ordered EBAY_PRODUCTS), so penalize the shorter one
          if (cardProdNorm.length < parsedProdNorm.length) {
            prodScore = Math.max(0, prodScore - 15); // card is less specific than parsed product
          }
        }
      }

      // === CARD NUMBER MATCH (20 pts bonus) ===
      var cNum = card.cardNumber.trim();
      var cNumLow = cNum.toLowerCase().replace(/[^a-z0-9-]/g, "");
      var cNumNoDash = cNumLow.replace(/-/g, "");
      var cNumSpaced = cNumLow.replace(/-/g, " ");
      var numFound = false;
      if (cNumLow.length >= 2) {
        if (titleNorm.indexOf(cNumLow) !== -1) numFound = true;
        if (!numFound && cNumNoDash !== cNumLow && titleNorm.indexOf(cNumNoDash) !== -1) numFound = true;
        if (!numFound && cNumSpaced !== cNumLow && titleNorm.indexOf(cNumSpaced) !== -1) numFound = true;
        if (!numFound && /^\d+$/.test(cNum)) {
          if (rawTitle.indexOf("#" + cNum.toLowerCase()) !== -1) numFound = true;
          if (!numFound && rawTitle.indexOf("card " + cNum.toLowerCase()) !== -1) numFound = true;
        }
      }
      var numScore = numFound ? 20 : 0;
      // Alphanumeric card numbers (BTP-35, SCCA-BLA) are extremely specific identifiers
      if (numFound && /[a-z]/i.test(cNum)) numScore = 30;
      // If title has an alphanumeric card number but this card doesn't match, penalize
      if (titleAlphaCardNo && !numFound) {
        var thisCardNorm = cNum.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (thisCardNorm !== titleAlphaCardNo) numScore = -10;
      }

      // === VARIANT MATCH (35 pts) ===
      var varName = (card.cardSet || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/ +/g, " ").trim();
      // Join compound terms split by hyphen removal (must match title normalization)
      varName = varName.replace(/\bx fractor/g, "xfractor").replace(/\bx fractors/g, "xfractors")
        .replace(/\bray wave/g, "raywave").replace(/\bfoil board/g, "foilboard")
        .replace(/\blava lamp/g, "lavalamp").replace(/\bdie cut/g, "diecut")
        .replace(/\bjack o lantern/g, "jackolantern").replace(/\bcolor variant/g, "colorvariant")
      .replace(/\byouth quake/g, "youthquake");
      var varScore = 0;
      var allNoiseVariant = false;

      // Collect non-noise, non-product, non-number title words (for base detection + precision)
      var extraTitleWords = [];
      for (var etw = 0; etw < titleWords.length; etw++) {
        var tw2 = titleWords[etw];
        if (tw2.length < 3) continue;
        if (NOISE[tw2]) continue;
        if (prodWordSet[tw2] || prodWordSet[normW(tw2)]) continue;
        if (/^\d+$/.test(tw2)) continue;
        extraTitleWords.push(tw2);
      }

      if (!varName || varName === "base") {
        // BASE CARD: penalize if title has extra descriptive words beyond product+noise
        var extraCount = extraTitleWords.length;
        if (extraCount === 0) varScore = 30;
        else if (extraCount === 1) varScore = 12;
        else if (extraCount === 2) varScore = 5;
        else varScore = 2;
      } else {
        var varWords = varName.split(" ").filter(function(w) { return w.length > 2; });
        var varAllWords = varName.split(" ").filter(function(w) { return w.length > 1; });
        var varNormSet = {};
        for (var vnw = 0; vnw < varAllWords.length; vnw++) {
          varNormSet[varAllWords[vnw]] = true;
          varNormSet[normW(varAllWords[vnw])] = true;
        }

        // RECALL: how many variant words appear in title?
        // Skip variant words that are also in NOISE (e.g. "black" is player surname AND variant name)
        // Skip variant words that are also PRODUCT words (e.g. "inception" variant in "Topps Inception" product)
        var recallHits = 0;
        var recallTotal = 0;
        for (var vw = 0; vw < varWords.length; vw++) {
          var vWord = varWords[vw];
          if (NOISE[vWord]) continue; // ambiguous with player name/common terms
          if (prodWordSet[vWord] || prodWordSet[normW(vWord)]) continue; // variant word is just the product name
          recallTotal++;
          if (titleNormSet[vWord] || titleNormSet[normW(vWord)] || titleNorm.indexOf(vWord) !== -1) recallHits++;
        }
        // If ALL variant words are NOISE (e.g. variant="Black"), this variant is INDISTINGUISHABLE
        // from the player name. Flag it - even if it scores well on product/cardNo/printRun,
        // we can't be confident the title means this specific variant.
        allNoiseVariant = (recallTotal === 0 && varWords.length > 0);
        if (allNoiseVariant) {
          varScore = 0;
        } else {
          var recall = recallTotal > 0 ? recallHits / recallTotal : 0;

          // PRECISION: of extra title words, how many match this variant?
          // Also exclude NOISE words from varNormSet to prevent surname leaking through precision
          var precTotal = extraTitleWords.length;
          var precHits = 0;
          for (var ep = 0; ep < extraTitleWords.length; ep++) {
            var etWord = extraTitleWords[ep];
            var etNorm = normW(etWord);
            if ((varNormSet[etWord] && !NOISE[etWord]) || (varNormSet[etNorm] && !NOISE[etNorm])) precHits++;
          }
          var precision = precTotal > 0 ? precHits / precTotal : 0.5;

          varScore = Math.round((recall * 0.6 + precision * 0.4) * 35);

          // PENALTY: If variant contains NOISE words (like "black"), we can't verify
          // from the title if it means the variant color or the player surname.
          // Apply -3 per ambiguous word so "Mojo Refractors" beats "Mojo Black Refractors" in tiebreaks.
          var noiseInVariant = 0;
          for (var nv = 0; nv < varWords.length; nv++) {
            if (NOISE[varWords[nv]]) noiseInVariant++;
          }
          if (noiseInVariant > 0) varScore = Math.max(0, varScore - noiseInVariant * 3);
        }
      }

      // === AUTO CONSISTENCY (5 pts match / -8 mismatch) ===
      var cardIsAuto = /auto|sig/i.test(varName) || card.isAuto === "Yes";
      var autoScore = 0;
      if (titleHasAuto && cardIsAuto) autoScore = 5;
      else if (!titleHasAuto && !cardIsAuto) autoScore = 5;
      else autoScore = -8;

      // === PRINT RUN MATCH (major disambiguator when present) ===
      // GUARD: Never give print run bonus for copies=1 (1/1 cards).
      // "Tyler Black 1/1" could just mean quantity or seller shorthand.
      // A real 1/1 should be manually confirmed via Pick, not auto-matched.
      var prScore = 0;
      var safePrintRun = card.copies && String(card.copies) !== "1"; // exclude 1/1s from bonus
      if (titlePrintRun) {
        // Listing has a print run — this is a STRONG signal
        if (safePrintRun && String(card.copies) === titlePrintRun) {
          prScore = 20; // exact match — strong confirmation
        } else if (safePrintRun && String(card.copies) !== titlePrintRun) {
          prScore = -12; // wrong print run — strong rejection
        } else if (!card.copies) {
          prScore = -15; // listing has /N but card is unnumbered (base) — very unlikely match
        } else if (card.copies && String(card.copies) === "1" && titlePrintRun !== "1") {
          prScore = -20; // card is 1/1 but title says /N where N>1 — definitely wrong variant
        }
      } else if (safePrintRun) {
        // Listing has NO print run but card IS numbered — sellers almost always mention /N
        // Penalize numbered variants to prefer unnumbered ones (e.g. plain Refractor over Aqua /150)
        prScore = -10;
      } else if (card.copies && String(card.copies) === "1") {
        // Listing has NO print run but card is 1/1 — sellers ALWAYS mention /1 or 1/1
        // A true 1/1 without "/1" in the title is essentially impossible
        prScore = -20;
      }
      var total = prodScore + numScore + varScore + autoScore + prScore;
      if (total > bestScore) { bestCard = card; bestScore = total; bestIsAllNoise = allNoiseVariant; }
    }

    // REJECT if best match has an all-NOISE variant (e.g. "Black" = player surname).
    // Title alone cannot distinguish "Tyler Black /1" from the "Black /1" variant.
    // User must manually pick these via the Pick button.
    if (bestIsAllNoise) return null;

    if (bestCard && bestScore >= 45) {
      var normalizedScore = 90 + Math.round((bestScore - 45) / 55 * 10);
      if (normalizedScore > 100) normalizedScore = 100;
      return { card: bestCard, score: normalizedScore };
    }
    return null;
  }

  // --- 130point.com Sold Listings Parser ---
  var OTHER_TYLERS = ['tyler herro','tyler kolek','tyler shough','tyler seguin','tyler lockett','tyler soderstrom',"tyler o'neill",'tyler oneill','tyler smith','tyler toffoli','tyler ennis','tyler reddick','tyler boyd','tyler stephenson','tyler lacy','tyler pike','tyler ervin','tyler mattison','tyler booker','tyler warren','tyler locklear','tyler allgeier','tyler nubin','tyler bass','tyler glasnow','tyler johnson','tyler wade','tyler rogers','tyler anderson','tyler naquin','tyler flowers','tyler bey'];
  var NON_CARD_130 = ['hoodie','shirt','t-shirt','costume','cosplay','sandal','shoe','dress','jacket','pants','womens','mens ','replica','diecast','die-cast','nascar arc','seth rollins','wwe','wrestling','aew','black panther','comic','marvel','player break','case break','break #','break pyp','you pick','pick player','pick your','lot of (','lot of(','card lot','you choose','complete your set'];
  function is130ptTylerBlack(title) {
    var t = title.toLowerCase();
    if (t.indexOf('tyler black') === -1) return false;
    for (var i = 0; i < OTHER_TYLERS.length; i++) { if (t.indexOf(OTHER_TYLERS[i]) !== -1) return false; }
    for (var j = 0; j < NON_CARD_130.length; j++) { if (t.indexOf(NON_CARD_130[j]) !== -1) return false; }
    return true;
  }
  function parse130PointText(text) {
    var results = [];
    var lines = text.split('\n');
    var i = 0;
    while (i < lines.length) {
      var line = lines[i].trim();
      if (line.indexOf('Sold Via:') !== 0) { i++; continue; }
      var block = [line];
      i++;
      while (i < lines.length && lines[i].trim().indexOf('Sold Via:') !== 0) {
        if (lines[i].trim().length > 0) block.push(lines[i].trim());
        i++;
      }
      var platform = '', title = '', saleType = '', listPrice = null, salePrice = null, dateStr = '';
      for (var bi = 0; bi < block.length; bi++) {
        var bl = block[bi];
        if (bl === 'Sold Via:') continue;
        if (bl === 'eBay' || bl === 'COMC' || bl === 'SportLots') { platform = bl; continue; }
        if (bl.indexOf('Sale Price:') !== -1) {
          var spNums = bl.replace(/[^0-9.]/g, '');
          if (spNums) salePrice = parseFloat(spNums);
          continue;
        }
        if (bl.indexOf('List Price:') !== -1) {
          var lpNums = bl.replace(/[^0-9.]/g, '');
          if (lpNums) listPrice = parseFloat(lpNums);
          continue;
        }
        if (bl.indexOf('Shipping Price:') !== -1) continue;
        if (bl.indexOf('Date:') === 0) {
          dateStr = bl.substring(5).trim();
          var tzIdx = dateStr.search(/ [A-Z]{3,4}$/);
          if (tzIdx > 0) dateStr = dateStr.substring(0, tzIdx);
          continue;
        }
        if (bl.indexOf('Showing ') === 0 || bl.indexOf('Page ') === 0 || bl.indexOf('Previous') === 0) continue;
        if (bl.indexOf('Currency:') !== -1 || bl.indexOf('Show ') === 0 || bl.indexOf('entries') === 0) continue;
        if (!title) {
          var types = ['Best Offer Accepted','Fixed Price Sale','Fixed Price','Auction'];
          var foundType = false;
          for (var ti = 0; ti < types.length; ti++) {
            if (bl.indexOf(types[ti]) !== -1) { saleType = types[ti]; title = bl.replace(types[ti], '').trim(); foundType = true; break; }
          }
          if (!foundType) title = bl;
        }
      }
      if (!title || salePrice == null || salePrice <= 0) continue;
      if (!is130ptTylerBlack(title)) continue;
      var parsedDate = '';
      if (dateStr) { try { var d = new Date(dateStr); if (!isNaN(d.getTime())) parsedDate = d.toISOString().split('T')[0]; } catch(e) {} }
      var ym = title.match(/\b(20[12]\d)\b/); var year = ym ? ym[1] : '';
      var cardNo = '';
      var cnPats = [/#([A-Z0-9]+-[A-Z0-9]+)/i, /#([A-Z]{1,5}\d+)/i, /#(\d+)/];
      for (var cp = 0; cp < cnPats.length; cp++) { var cnm = title.match(cnPats[cp]); if (cnm) { cardNo = cnm[1]; break; } }
      if (!cardNo) { var dashPat = title.match(/\b([A-Z]+-[A-Z0-9]+)\b/); if (dashPat) cardNo = dashPat[1]; }
      if (!cardNo) { var prefPat = title.match(/\b(US[C]?\d{2,4}|BDC\d+|PD\d+|BOA\w+|PA\w+|PRV\w+|BI\d+|TOP\d+|SSC\d+|YQ\d+|BTP\d+|LGC\d+)\b/i); if (prefPat) cardNo = prefPat[1]; }
      var product = '';
      var prods = ['Topps Chrome Update','Topps Chrome Gilded','Topps Chrome Black','Topps Chrome','Topps Update','Topps Pristine','Topps Tier One','Topps Stadium Club Chrome','Topps Stadium Club','Topps Cosmic Chrome','Topps Inception','Topps Heritage','Topps Now','Bowman Chrome Sapphire','Bowman Chrome Draft','Bowman Chrome','Bowmans Best',"Bowman's Best",'Bowman Sterling','Bowman Platinum','Bowman Draft 1st Edition','Bowman Draft','Bowman Invicta','Bowman','Panini Prizm Draft','Panini Prospect','Panini Donruss','Panini Crusade','Panini Pulse','Prizm Draft Picks','Prizm Draft','Prizm','Elite Extra Edition','Leaf Trinity','Leaf Flash','Topps Pro Debut','Pro Debut','Stadium Club Chrome','Stadium Club'];
      var tLow = title.toLowerCase();
      for (var pp = 0; pp < prods.length; pp++) { if (tLow.indexOf(prods[pp].toLowerCase()) !== -1) { product = prods[pp]; break; } }
      var variant = '';
      var vPats = [/\b(Gold|Green|Blue|Red|Purple|Orange|Aqua|Yellow|Pink|Magenta|White)\s*(Refractor|Lava|Wave|Crackle|Foilboard|Foil|Speckle|Mojo|Shimmer|RayWave|Ray Wave|Equinox)s?\b/i, /\b(Sapphire|Mojo|Refractor|X-Fractor|Xfractor|Prism|Wave|Variation|SSP|SP)\b/i, /\b(Members Only|Image Variation|Lets go|Let's go|Gold Mirror|Snake|Ticket Stub|Die Cut)\b/i];
      for (var vp = 0; vp < vPats.length; vp++) { var vm = title.match(vPats[vp]); if (vm) { variant = vm[0]; break; } }
      var prMatch = title.match(/\/(\d+)/); var printRun = prMatch ? prMatch[1] : '';
      var isBestOffer = saleType.indexOf('Best Offer') !== -1;
      var discount = (isBestOffer && listPrice && listPrice > 0) ? Math.round((1 - salePrice / listPrice) * 100) : 0;
      results.push({
        year: year, product: product, cardNo: cardNo, cardNoClean: cardNo.replace(/-/g, ''),
        variant: variant, price: String(salePrice), rawSet: title, source: '130point',
        listingType: isBestOffer ? 'best_offer' : 'fixed',
        date: parsedDate, seller: platform || '130pt', description: variant || product, printRun: printRun,
        _130pt: { title: title, saleType: saleType, listPrice: listPrice, salePrice: salePrice, isBestOffer: isBestOffer, discount: discount, platform: platform, date: parsedDate, printRun: printRun }
      });
    }
    return results;
  }
  function parse130PointForSale(text) {
    var results = [];
    var lines = text.split('\n');
    var prods = ['Topps Chrome Update','Topps Chrome Gilded','Topps Chrome Black','Topps Chrome','Topps Update','Topps Pristine','Topps Tier One','Topps Stadium Club Chrome','Topps Stadium Club','Topps Cosmic Chrome','Topps Inception','Topps Heritage','Topps Now','Bowman Chrome Sapphire','Bowman Chrome Draft','Bowman Chrome','Bowmans Best',"Bowman's Best",'Bowman Sterling','Bowman Platinum','Bowman Draft 1st Edition','Bowman Draft','Bowman Invicta','Bowman','Panini Prizm Draft','Panini Prospect','Panini Donruss','Panini Crusade','Panini Pulse','Panini Three And Two','Panini Boys of Summer','Prizm Draft Picks','Prizm Draft','Prizm','Elite Extra Edition','Leaf Trinity','Leaf Flash','Topps Pro Debut','Pro Debut','Topps Gilded Collection','Stadium Club Chrome','Stadium Club','Topps Heritage High Number'];
    var vPats = [/\b(Gold|Green|Blue|Red|Purple|Orange|Aqua|Yellow|Pink|Magenta|White)\s*(Refractor|Lava|Wave|Crackle|Foilboard|Foil|Speckle|Mojo|Shimmer|RayWave|Ray Wave|Equinox)s?\b/i, /\b(Sapphire|Mojo|Refractor|X-Fractor|Xfractor|Prism|Wave|Variation|SSP|SP)\b/i, /\b(Members Only|Image Variation|Lets go|Let's go|Gold Mirror|Snake|Ticket Stub|Die Cut|Youthquake|Stratospheric)\b/i];
    var cnPats = [/#([A-Z0-9]+-[A-Z0-9]+)/i, /#([A-Z]{1,5}\d+)/i, /#(\d+)/];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line.indexOf('Sold Via:') === 0) break; // stop at sold section
      if (line.indexOf('Current Price:') !== 0) continue;
      // Find title: walk backwards skipping blanks, stop at End Date / BIN / Current / similar
      var title = '';
      for (var j = i - 1; j >= Math.max(0, i - 5); j--) {
        var prev = lines[j].trim();
        if (!prev || prev.indexOf('End Date:') !== -1 || prev === 'BIN Sale' || prev.indexOf('Current Number') !== -1 || prev.indexOf('Current Price:') !== -1 || prev.indexOf('Sold Via:') !== -1 || prev.indexOf('Submit') !== -1 || prev.indexOf('Clear Results') !== -1) break;
        title = prev; break;
      }
      if (!title || !is130ptTylerBlack(title)) continue;
      var priceStr = line.replace('Current Price:', '').replace('USD', '').trim();
      var price = parseFloat(priceStr) || 0;
      var isBIN = false, bids = 0, endDate = '';
      for (var k = i + 1; k < lines.length && k <= i + 4; k++) {
        var nl = lines[k].trim();
        if (nl === 'BIN Sale') isBIN = true;
        if (nl.indexOf('Current Number of Bids:') !== -1) bids = parseInt(nl.replace(/\D/g, '')) || 0;
        if (nl.indexOf('End Date:') !== -1) { endDate = nl.replace('End Date:', '').trim(); break; }
      }
      // Parse title same as sold parser
      var ym = title.match(/\b(20[12]\d)\b/); var year = ym ? ym[1] : '';
      var cardNo = '';
      for (var cp = 0; cp < cnPats.length; cp++) { var cnm = title.match(cnPats[cp]); if (cnm) { cardNo = cnm[1]; break; } }
      if (!cardNo) { var dashPat = title.match(/\b([A-Z]+-[A-Z0-9]+)\b/); if (dashPat) cardNo = dashPat[1]; }
      if (!cardNo) { var prefPat = title.match(/\b(US[C]?\d{2,4}|BDC\d+|PD\d+|BOA\w+|PA\w+|PRV\w+|BI\d+|TOP\d+|SSC\d+|YQ\d+|BTP\d+|LGC\d+)\b/i); if (prefPat) cardNo = prefPat[1]; }
      var product = '';
      var tLow = title.toLowerCase();
      for (var pp = 0; pp < prods.length; pp++) { if (tLow.indexOf(prods[pp].toLowerCase()) !== -1) { product = prods[pp]; break; } }
      var variant = '';
      for (var vp = 0; vp < vPats.length; vp++) { var vm = title.match(vPats[vp]); if (vm) { variant = vm[0]; break; } }
      var prMatch = title.match(/\/(\d+)/); var printRun = prMatch ? prMatch[1] : '';
      results.push({
        year: year, product: product, cardNo: cardNo, cardNoClean: cardNo.replace(/-/g, ''),
        variant: variant, price: price > 0 ? String(price) : '', rawSet: title, source: '130point',
        listingType: isBIN ? 'fixed' : (bids > 0 ? 'auction' : 'auction'), bids: bids,
        date: endDate, seller: 'For Sale', description: variant || product, printRun: printRun,
        _130pt: { title: title, saleType: isBIN ? 'BIN' : 'Auction', listPrice: price, salePrice: price, isBestOffer: false, discount: 0, platform: 'eBay', date: endDate, printRun: printRun, forSale: true }
      });
    }
    return results;
  }
  function matchToCards(p) {
    // Priority 1: Check persistent COMC override
    var ck = pinKey(p);
    if (COMC_OVERRIDES[ck]) {
      var overrideId = COMC_OVERRIDES[ck];
      for (var oi = 0; oi < cards.length; oi++) {
        if (cards[oi].id === overrideId) {
          return { card: cards[oi], score: 100, override: true };
        }
      }
    }
    // Priority 2 (eBay/Whatnot): Full title-scan matching against all DB cards for this year
    if ((p.source === "eBay" || p.source === "Whatnot" || p.source === "130point") && p.rawSet) {
      var ebResult = matchEbayByTitleScan(p, cards);
      if (ebResult) return ebResult;
    }

    // Priority 3: Structured algorithmic matching (COMC primary, eBay fallback)
    var prodLower = p.product.toLowerCase().trim();
    var mappedProd = PRODUCT_MAP[prodLower] || prodLower;
    var prodWords = mappedProd.split(" ").filter(function(w) { return w.length > 2; });
    var pv = normVariant(p.variant);

    // Phase 1: Collect ALL candidate cards (year + card# + product match)
    var candidates = [];
    for (var ci = 0; ci < cards.length; ci++) {
      var card = cards[ci];
      var cYear = String((card.product.match(/^\d{4}/) || [""])[0]);
      if (cYear !== p.year) continue;

      // Card number matching (exact, clean, or .1/.2 suffix)
      var cNum = card.cardNumber.trim();
      var numMatch = (cNum === p.cardNo) || (cNum === p.cardNoClean);
      if (!numMatch && p.cardNo && p.cardNo.indexOf(".") !== -1) {
        // COMC .1/.2 suffix: try stripping it
        var baseNum = p.cardNo.replace(/\.\d+$/, "");
        numMatch = (cNum === baseNum);
      }
      // eBay: try stripping trailing letter (578c → 578, for variation suffixes)
      if (!numMatch && p.cardNo && /\d+[a-z]$/i.test(p.cardNo)) {
        var strippedNum = p.cardNo.replace(/[a-z]$/i, "");
        numMatch = (cNum === strippedNum);
      }
      // eBay: try matching DB number without dash (BD200 vs BD-200)
      if (!numMatch && p.cardNo) {
        var noDashP = p.cardNo.replace(/-/g, "");
        var noDashC = cNum.replace(/-/g, "");
        numMatch = (noDashP === noDashC);
      }
      if (!numMatch) continue;

      // Product name matching
      var cProd = card.product.toLowerCase();
      var prodMatch = false;
      if (mappedProd && cProd.indexOf(mappedProd) !== -1) prodMatch = true;
      if (!prodMatch && prodLower && cProd.indexOf(prodLower) !== -1) prodMatch = true;
      if (!prodMatch && prodWords.length >= 2) {
        var cProdWords = cProd.split(/\s+/);
        var wordHits = 0;
        for (var wi = 0; wi < prodWords.length; wi++) {
          for (var wj = 0; wj < cProdWords.length; wj++) {
            if (cProdWords[wj].indexOf(prodWords[wi]) !== -1 || prodWords[wi].indexOf(cProdWords[wj]) !== -1) { wordHits++; break; }
          }
        }
        if (wordHits >= prodWords.length * 0.6) prodMatch = true;
      }
      if (!prodMatch) continue;

      candidates.push(card);
    }

    if (candidates.length === 0) return null;

    // Phase 2: Score each candidate by variant similarity
    var best = null;
    var bestScore = -1;

    for (var k = 0; k < candidates.length; k++) {
      var c = candidates[k];
      var cv = normVariant(c.cardSet);
      var score = 0;

      // STRICT matching: require near-exact variant match
      // Both base/empty = exact match
      if ((!pv || pv === "base") && (!cv || cv === "base")) {
        score = 100;
      } else if (pv === cv) {
        score = 100;
      } else if (pv && cv) {
        // Plural tolerance: "refractor" vs "refractors"
        if (pv + "s" === cv || cv + "s" === pv) {
          score = 98;
        } else {
          // Apostrophe-stripped comparison: "bowman scouts top 100" vs "bowman scouts top 100" (after norm strips ')
          var pvClean = pv.replace(/[^a-z0-9 ]/g, "");
          var cvClean = cv.replace(/[^a-z0-9 ]/g, "");
          if (pvClean === cvClean) {
            score = 97;
          } else if (pvClean + "s" === cvClean || cvClean + "s" === pvClean) {
            score = 96;
          } else {
            // Substring match ONLY if length ratio > 0.85
            var longer = pv.length >= cv.length ? pv : cv;
            var shorter = pv.length < cv.length ? pv : cv;
            var lenRatio = shorter.length / longer.length;
            if (lenRatio >= 0.85 && (longer.indexOf(shorter) !== -1 || longer.indexOf(shorter + "s") !== -1 || shorter + "s" === longer)) {
              score = 92;
            } else {
              // Word-level matching
              var pw = pv.split(" ").filter(function(w) { return w.length > 1; });
              var cw = cv.split(" ").filter(function(w) { return w.length > 1; });
              if (pw.length === cw.length && pw.length > 0) {
                var allMatch = true;
                for (var pwi = 0; pwi < pw.length; pwi++) {
                  var found = false;
                  for (var cwi = 0; cwi < cw.length; cwi++) {
                    if (wordsMatch(pw[pwi], cw[cwi])) { found = true; break; }
                  }
                  if (!found) { allMatch = false; break; }
                }
                if (allMatch) score = 90;
              }
              // Different word counts = different card, score stays 0
            }
          }
        }
      }
      // One has variant and other doesn't = different card, score stays 0

      if (score > bestScore) {
        best = { card: c, score: score };
        bestScore = score;
      }
    }

    // NO heuristic boosts - require exact/near-exact variant match
    // 90+ = confident match
    // Below 90 = not in DB or naming mismatch user should investigate
    if (best && bestScore >= 90) return best;

    // Retry with variant alternatives (prizm↔holo swaps, etc.)
    if (candidates.length > 0) {
      var alts = variantAlternatives(pv);
      for (var ai = 0; ai < alts.length; ai++) {
        var altPv = alts[ai];
        if (!altPv || altPv === pv) continue;
        for (var ak = 0; ak < candidates.length; ak++) {
          var ac = candidates[ak];
          var acv = normVariant(ac.cardSet);
          var altScore = 0;
          if ((!altPv || altPv === "base") && (!acv || acv === "base")) altScore = 100;
          else if (altPv === acv) altScore = 100;
          else if (altPv + "s" === acv || acv + "s" === altPv) altScore = 98;
          else {
            var aLonger = altPv.length >= acv.length ? altPv : acv;
            var aShorter = altPv.length < acv.length ? altPv : acv;
            var aRatio = aShorter.length / aLonger.length;
            if (aRatio >= 0.85 && aLonger.indexOf(aShorter) !== -1) altScore = 92;
          }
          if (altScore >= 90 && altScore > bestScore) {
            best = { card: ac, score: altScore };
            bestScore = altScore;
          }
        }
      }
      if (best && bestScore >= 90) return best;
    }

    // eBay Phase 2.5: title-scan matching when variant extraction failed  
    if ((p.source === "eBay" || p.source === "Whatnot" || p.source === "130point") && candidates.length > 0 && bestScore < 90) {
      var rawLow = (p.rawSet || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ");
      var ebayBestScore = 0, ebayBest = null;
      for (var ek = 0; ek < candidates.length; ek++) {
        var ec = candidates[ek];
        var ecv = normVariant(ec.cardSet);
        var ecScore = 0;
        if (!ecv || ecv === "base") {
          // Base card: check title DOESN'T contain strong parallel keywords
          var hasParallel = /refractor|prizm|foil|auto|autograph|chrome|mojo|wave|shimmer|sparkle|velocity|nebula|lava|speckle|variation|image var|gold|silver|purple|orange|aqua|blue|green|red|pink|magenta|lazer|laser|x-fract|xfract|negative|independence|vintage stock|crackle|mini|foilboard/i.test(p.rawSet);
          if (!hasParallel) {
            ecScore = 95;
          }
        } else {
          // Score: how many variant words appear in the eBay title
          var vWords = ecv.split(" ").filter(function(w) { return w.length > 2; });
          if (vWords.length === 0) continue;
          var vHits = 0;
          for (var vw = 0; vw < vWords.length; vw++) {
            if (rawLow.indexOf(vWords[vw]) !== -1) vHits++;
          }
          var vRatio = vHits / vWords.length;
          // Lower threshold: 50% word match with at least 1 word
          if (vRatio >= 0.35 && vHits >= 1) {
            ecScore = 85 + Math.round(vRatio * 10); // 85-95 based on coverage
          }
        }
        if (ecScore > ebayBestScore) {
          ebayBest = ec;
          ebayBestScore = ecScore;
        }
      }
      if (ebayBest && ebayBestScore >= 85) {
        return { card: ebayBest, score: ebayBestScore };
      }
    }

    // eBay/Whatnot Phase 3: broad search when product matching failed (year + card# only)
    if ((p.source === "eBay" || p.source === "Whatnot" || p.source === "130point") && candidates.length === 0 && p.cardNo) {
      var rawLow2 = (p.rawSet || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ");
      var broadCands = [];
      for (var bi = 0; bi < cards.length; bi++) {
        var bc = cards[bi];
        var bYear = String((bc.product.match(/^\d{4}/) || [""])[0]);
        if (bYear !== p.year) continue;
        var bNum = bc.cardNumber.trim();
        if (bNum !== p.cardNo && bNum !== p.cardNoClean) continue;
        broadCands.push(bc);
      }
      if (broadCands.length > 0) {
        var bBest = null, bBestScore = 0;
        for (var bk = 0; bk < broadCands.length; bk++) {
          var bbc = broadCands[bk];
          // Score by how many product+variant words appear in title
          var fullName = (bbc.product + " " + bbc.cardSet).toLowerCase().replace(/[^a-z0-9 ]/g, " ");
          var fWords = fullName.split(" ").filter(function(w) { return w.length > 2; });
          var fHits = 0;
          for (var fw = 0; fw < fWords.length; fw++) {
            if (rawLow2.indexOf(fWords[fw]) !== -1) fHits++;
          }
          var fRatio = fWords.length > 0 ? fHits / fWords.length : 0;
          if (fRatio > bBestScore) {
            bBest = bbc;
            bBestScore = fRatio;
          }
        }
        if (bBest && bBestScore >= 0.3) {
          return { card: bBest, score: 90 + Math.round(bBestScore * 5) };
        }
      }
    }

    // eBay/Whatnot Phase 3b: cardNo might be embedded in title without # prefix
    if ((p.source === "eBay" || p.source === "Whatnot" || p.source === "130point") && candidates.length === 0 && !p.cardNo) {
      var rawLow2b = (p.rawSet || "").toLowerCase().replace(/[^a-z0-9 -]/g, " ").replace(/\s+/g, " ");
      // Try common card number patterns from the DB for this year
      var yearCards = [];
      for (var y2i = 0; y2i < cards.length; y2i++) {
        var y2c = cards[y2i];
        var y2Year = String((y2c.product.match(/^\d{4}/) || [""])[0]);
        if (y2Year !== p.year) continue;
        yearCards.push(y2c);
      }
      // Find cards whose number appears in the title
      var numHits = [];
      for (var n2i = 0; n2i < yearCards.length; n2i++) {
        var n2c = yearCards[n2i];
        var n2Num = n2c.cardNumber.trim().toLowerCase();
        if (n2Num.length < 2) continue;
        if (rawLow2b.indexOf(n2Num) !== -1) {
          // Also check product words appear
          var n2Prod = n2c.product.replace(/^\d{4}\s*/, "").toLowerCase().replace(/[^a-z0-9 ]/g, " ");
          var n2Words = n2Prod.split(" ").filter(function(w) { return w.length > 2; });
          var n2Hits = 0;
          for (var n2w = 0; n2w < n2Words.length; n2w++) {
            if (rawLow2b.indexOf(n2Words[n2w]) !== -1) n2Hits++;
          }
          var n2Ratio = n2Words.length > 0 ? n2Hits / n2Words.length : 0;
          if (n2Ratio >= 0.3) numHits.push({ card: n2c, score: n2Ratio });
        }
      }
      if (numHits.length > 0) {
        numHits.sort(function(a, b) { return b.score - a.score; });
        return { card: numHits[0].card, score: 90 + Math.round(numHits[0].score * 5) };
      }
    }

    // eBay/Whatnot Phase 4: year + product only (no card number) - score by title similarity
    if ((p.source === "eBay" || p.source === "Whatnot" || p.source === "130point") && !p.cardNo && p.product) {
      var rawLow3 = (p.rawSet || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ");
      var p4Best = null, p4Score = 0;
      for (var p4i = 0; p4i < cards.length; p4i++) {
        var p4c = cards[p4i];
        var p4Year = String((p4c.product.match(/^\d{4}/) || [""])[0]);
        if (p4Year !== p.year) continue;
        var p4Prod = p4c.product.toLowerCase();
        var p4Mapped = PRODUCT_MAP[p.product.toLowerCase().trim()] || p.product.toLowerCase().trim();
        if (p4Prod.indexOf(p4Mapped) === -1 && p4Mapped.indexOf(p4Prod.replace(/^\d{4}\s*/, "")) === -1) continue;
        // Check card number appears in title as raw number
        var p4Num = p4c.cardNumber.trim();
        if (rawLow3.indexOf(p4Num.toLowerCase()) === -1) continue;
        // Score by variant words in title
        var p4v = normVariant(p4c.cardSet);
        var p4vWords = (p4v || "").split(" ").filter(function(w) { return w.length > 2; });
        var p4Hits = 0;
        for (var p4w = 0; p4w < p4vWords.length; p4w++) {
          if (rawLow3.indexOf(p4vWords[p4w]) !== -1) p4Hits++;
        }
        var p4Ratio = p4vWords.length > 0 ? p4Hits / p4vWords.length : ((!p4v || p4v === "base") ? 1 : 0);
        if (p4Ratio > p4Score) {
          p4Best = p4c;
          p4Score = p4Ratio;
        }
      }
      if (p4Best && p4Score >= 0.5) {
        return { card: p4Best, score: 90 + Math.round(p4Score * 5) };
      }
    }

    // eBay Phase 5: single-card-number heuristic
    // If product has only ONE unique Tyler Black card number, no ambiguity → auto-assign
    if (p.source === "eBay" && !p.cardNo && p.product && p.year) {
      var prodLow5 = (PRODUCT_MAP[p.product.toLowerCase().trim()] || p.product.toLowerCase().trim());
      var prodCards5 = {};
      for (var p5i = 0; p5i < cards.length; p5i++) {
        var p5c = cards[p5i];
        var p5Year = String((p5c.product.match(/^\d{4}/) || [""])[0]);
        if (p5Year !== p.year) continue;
        var p5Prod = p5c.product.toLowerCase();
        if (p5Prod.indexOf(prodLow5) === -1 && prodLow5.indexOf(p5Prod.replace(/^\d{4}\s*/, "")) === -1) continue;
        var p5Num = p5c.cardNumber.trim();
        if (!prodCards5[p5Num]) prodCards5[p5Num] = [];
        prodCards5[p5Num].push(p5c);
      }
      var uniqueNums5 = Object.keys(prodCards5);
      if (uniqueNums5.length === 1) {
        // Only one card number in this product - find best variant match from title
        var allVariants5 = prodCards5[uniqueNums5[0]];
        var rawLow5 = (p.rawSet || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ");
        var best5 = null, best5Score = 0;
        for (var v5i = 0; v5i < allVariants5.length; v5i++) {
          var v5c = allVariants5[v5i];
          var v5v = normVariant(v5c.cardSet);
          if (!v5v || v5v === "base") {
            var hasParallel5 = /refractor|prizm|foil|auto|gold|silver|purple|blue|green|red|pink|aqua|orange|magenta|lazer|wave|shimmer|sparkle|velocity|nebula|lava|speckle|variation|image var|x-fract|negative|vintage|crackle|mini|chrome|mojo/i.test(p.rawSet);
            if (!hasParallel5 && 0.5 > best5Score) { best5 = v5c; best5Score = 0.5; }
          } else {
            var vw5 = v5v.split(" ").filter(function(w) { return w.length > 2; });
            var vh5 = 0;
            for (var w5 = 0; w5 < vw5.length; w5++) { if (rawLow5.indexOf(vw5[w5]) !== -1) vh5++; }
            var vr5 = vw5.length > 0 ? vh5 / vw5.length : 0;
            if (vr5 > best5Score) { best5 = v5c; best5Score = vr5; }
          }
        }
        if (best5 && best5Score >= 0.3) {
          return { card: best5, score: 90 + Math.round(best5Score * 5) };
        }
      }
    }

    // Return closest candidate with medium score - year+product+cardNo matched but variant didn't
    // This is still a strong match - variant names are often wrong/missing in listings
    if (candidates.length > 0) {
      // Pick best candidate by title-scan if available, else first
      if (best && bestScore > 0) return { card: best.card, score: Math.max(bestScore, 88), variantMismatch: true };
      return { card: candidates[0], score: 88, variantMismatch: true };
    }
    return null;
  }

  function parseCSV(text) {
    var lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    var hLine = lines[0];
    var headers = []; var inQ = false; var cur = "";
    for (var i = 0; i < hLine.length; i++) {
      if (hLine[i] === '"') inQ = !inQ;
      else if (hLine[i] === "," && !inQ) { headers.push(cur.trim()); cur = ""; }
      else cur += hLine[i];
    }
    headers.push(cur.trim());
    var rows = [];
    for (var r = 1; r < lines.length; r++) {
      if (!lines[r].trim()) continue;
      var vals = []; inQ = false; cur = "";
      for (var j = 0; j < lines[r].length; j++) {
        if (lines[r][j] === '"') inQ = !inQ;
        else if (lines[r][j] === "," && !inQ) { vals.push(cur.trim()); cur = ""; }
        else cur += lines[r][j];
      }
      vals.push(cur.trim());
      var obj = {};
      for (var h = 0; h < headers.length; h++) obj[headers[h]] = vals[h] || "";
      if (obj["Description"] && obj["Description"].toLowerCase().indexOf("tyler black") !== -1 && (!obj["Sport"] || obj["Sport"] === "Baseball")) {
        rows.push(obj);
      }
    }
    return rows;
  }

  function detectMode(text) {
    if (!text) return "auto";
    // TCDB collection paste: "Collection Summary" + "record(s)" or TCDB-specific patterns
    if ((text.indexOf("Collection Summary") !== -1 || text.indexOf("TCDb logo") !== -1) && text.indexOf("record(s)") !== -1) return "tcdb";
    // 130point: "Sold Via:" or For Sale section markers
    if ((text.indexOf("Sold Via:") !== -1 && text.indexOf("Sale Price:") !== -1) || (text.indexOf("Current Price:") !== -1 && text.indexOf("BIN Sale") !== -1 && text.indexOf("End Date:") !== -1)) return "130pt";
    // eBay search results page
    if (text.indexOf("Opens in a new window or tab") !== -1) return "ebay";
    // eBay purchase history (title|price|date format)
    if (/^[^\n|]+\|[^\n|]+\|[^\n|]+/m.test(text) && /\d+\.\d{2}/.test(text)) return "ebay";
    // SportLots: lines starting with #cardno followed by player name
    if (/^#[A-Z0-9][-A-Z0-9.]*\s+/mi.test(text) && (text.toLowerCase().indexOf("sportlots") !== -1 || /^#\S+\s+tyler\s*black/mi.test(text) || text.indexOf("Low Price") !== -1 || text.indexOf("Total Quantity") !== -1)) return "sportlots";
    // Whatnot: "Ships from" + price patterns like "US$X.XX" on standalone lines
    if (text.indexOf("Ships from") !== -1 || (text.indexOf("Card image") !== -1 && /^(?:US)?\$[\d,.]+$/m.test(text))) return "whatnot";
    // COMC: has card data lines with years + products
    if (/\b20[12]\d\b/.test(text) && (text.toLowerCase().indexOf("comc") !== -1 || text.toLowerCase().indexOf("nm or better") !== -1 || text.toLowerCase().indexOf("in stock") !== -1 || text.toLowerCase().indexOf("checklist") !== -1)) return "shop";
    // Fallback: if has card-like content, try COMC parser
    if (/\b20[12]\d\b/.test(text) && /(topps|bowman|panini|donruss|prizm|chrome)/i.test(text)) return "shop";
    return "auto";
  }
  /* --- TCDB COLLECTION PARSER ---
     Parses text copied from TCDB collection pages (Have/Want/In-Transit/All).
     Auto-detects which list was copied from the header.
     Returns { status, items[] } where each item has year/product/variant/cardNumber/price/attrs. */
  function parseTcdbCollection(text) {
    // Detect status from header text
    var status = "unknown";
    if (/Collection Summary[\s\S]{0,40}?\bHave\b/.test(text)) status = "owned";
    else if (/Collection Summary[\s\S]{0,40}?\bIn-Transit\s*\(Inbound\)/i.test(text)) status = "in_transit";
    else if (/Collection Summary[\s\S]{0,40}?\bWant\b/.test(text)) status = "not_owned";
    else if (/Collection Summary[\s\S]{0,40}?\bAll\b/.test(text)) status = "all";
    // Also try simpler detection from tab labels
    if (status === "unknown") {
      var headerBlock = text.substring(0, Math.min(text.length, 500));
      if (/\bHave\b/.test(headerBlock) && /Cards\s*\|\s*Filters/.test(headerBlock)) status = "owned";
      else if (/In-Transit/i.test(headerBlock)) status = "in_transit";
      else if (/\bWant\b/.test(headerBlock) && /Cards\s*\|\s*Filters/.test(headerBlock)) status = "not_owned";
    }

    var lines = text.split(/\n/);
    var items = [];
    // Card line pattern: starts with 4-digit year, has # card number
    // Format: "{year} {product} [- {variant}] #{cardNumber} Tyler Black [{attrs}]"
    var cardLineRe = /^(20[12]\d)\s+(.+?)\s+#(\S+)\s+Tyler\s+Black\b(.*)/i;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      var m = cardLineRe.exec(line);
      if (!m) continue;
      var year = m[1];
      var fullProduct = m[2].trim();
      var cardNumber = m[3];
      var rest = m[4].trim();
      // Split product into base product and variant
      var product = fullProduct;
      var variant = "Base";
      var dashIdx = fullProduct.indexOf(" - ");
      if (dashIdx !== -1) {
        product = fullProduct.substring(0, dashIdx).trim();
        variant = fullProduct.substring(dashIdx + 3).trim();
      }
      // Extract attributes from rest: FBC, AU, MEM, RC, RD, SN###, PR###
      var attrs = [];
      if (/\bFBC\b/.test(rest)) attrs.push("FBC");
      if (/\bAU\b/.test(rest)) attrs.push("AU");
      if (/\bMEM\b/.test(rest)) attrs.push("MEM");
      if (/\bRC\b/.test(rest)) attrs.push("RC");
      if (/\bRD\b/.test(rest)) attrs.push("RD");
      var snMatch = /\bSN(\d+)/.exec(rest);
      var serialNum = snMatch ? parseInt(snMatch[1]) : null;
      // Extract price - look on same line or next line
      var price = null;
      var priceMatch = /\$(\d+(?:\.\d+)?)/.exec(rest);
      if (priceMatch) price = priceMatch[1];
      if (!price && i + 1 < lines.length) {
        var nextLine = lines[i + 1].trim();
        var nextPrice = /^\$(\d+(?:\.\d+)?)/.exec(nextLine);
        if (nextPrice) price = nextPrice[1];
      }
      items.push({
        rawSet: year + " " + fullProduct + " #" + cardNumber,
        year: year,
        product: product,
        variant: variant,
        cardNumber: cardNumber,
        price: price,
        attrs: attrs,
        serialNumbered: serialNum,
        source: "tcdb"
      });
    }
    return { status: status, items: items };
  }

  function handleParse() {
    // Auto-mode: detect source from pasted content and switch
    var effectiveMode = mode;
    if (mode === "auto" && rawInput.trim()) {
      effectiveMode = detectMode(rawInput);
      if (effectiveMode === "auto") effectiveMode = "shop"; // fallback
      setMode(effectiveMode);
      setPt130Filter(effectiveMode === "130pt" ? "sold" : "all");
    }
    // TCDB collection paste
    if (effectiveMode === "tcdb") {
      var tcdbData = parseTcdbCollection(rawInput);
      setTcdbDetectedStatus(tcdbData.status);
      setTcdbFilter("mismatch");
      var tcdbResults = tcdbData.items.map(function(item) {
        var match = matchToCards(item);
        return { parsed: item, match: match, raw: item.rawSet };
      });
      // Dedup: same card matched multiple times (e.g. duplicates in TCDB list)
      var tcdbSeen = {};
      var tcdbDeduped = [];
      for (var ti = 0; ti < tcdbResults.length; ti++) {
        var tItem = tcdbResults[ti];
        var tMatchId = tItem.match && tItem.match.score >= 85 ? tItem.match.card.id : null;
        if (tMatchId && tcdbSeen[tMatchId]) {
          // keep first occurrence, skip dupes
          continue;
        }
        if (tMatchId) tcdbSeen[tMatchId] = true;
        tcdbDeduped.push(tItem);
      }
      setParsed(tcdbDeduped);
      setShowInput(false);
      return;
    }
    // Auto-detect: if user pasted 130point data into wrong tab
    if (effectiveMode !== "130pt" && ((rawInput.indexOf("Sold Via:") !== -1 && rawInput.indexOf("Sale Price:") !== -1) || (rawInput.indexOf("Current Price:") !== -1 && rawInput.indexOf("BIN Sale") !== -1 && rawInput.indexOf("End Date:") !== -1))) {
      setMode("130pt");
      setPt130Filter("sold");
      var ptItems2 = parse130PointText(rawInput).concat(parse130PointForSale(rawInput));
      var ptResults2 = ptItems2.map(function(p) { var match = matchToCards(p); return { parsed: p, match: match, raw: p.rawSet }; });
      var ptBatch2 = loadPriceHistory();
      for (var pt2i = 0; pt2i < ptResults2.length; pt2i++) { var pt2 = ptResults2[pt2i]; if (pt2.match && pt2.match.score >= 90 && pt2.parsed.price && !pt2.parsed._130pt.forSale) recordPrice(pt2.match.card.id, pt2.parsed.price, "130point", pt2.parsed.rawSet || "", ptBatch2); }
      savePriceHistory(ptBatch2);
      ptResults2.sort(function(a, b) { var dA = (a.parsed._130pt && a.parsed._130pt.date) || ""; var dB = (b.parsed._130pt && b.parsed._130pt.date) || ""; return dB.localeCompare(dA); });
      setParsed(ptResults2);
      try { localStorage.setItem("tb-last-130pt-paste-v1", rawInput); } catch(e) {}
      setShowInput(false);
      return;
    }
    // Auto-detect: if user pasted eBay data into wrong tab, auto-switch to eBay mode
    if (effectiveMode !== "ebay" && rawInput.indexOf("Opens in a new window or tab") !== -1) {
      setMode("ebay");
      // Re-trigger parse in eBay mode after state update
      setTimeout(function() {
        // Will be called again with mode="ebay"
      }, 50);
      // For now, process as eBay directly
      var isSearchPage = true;
      var ebayListings = parseEbaySearchResults(rawInput);
      var seenTitles = {};
      var dedupedListings = [];
      for (var di = 0; di < ebayListings.length; di++) {
        var dk = (ebayListings[di].rawSet || "").trim();
        if (!dk) { dedupedListings.push(ebayListings[di]); continue; }
        if (seenTitles[dk] !== undefined) {
          var existTotal = parseFloat(dedupedListings[seenTitles[dk]].totalPrice) || 999999;
          var newTotal = parseFloat(ebayListings[di].totalPrice) || 999999;
          if (newTotal < existTotal) dedupedListings[seenTitles[dk]] = ebayListings[di];
        } else {
          seenTitles[dk] = dedupedListings.length;
          dedupedListings.push(ebayListings[di]);
        }
      }
      var results2 = dedupedListings.map(function(p) {
        var match = matchToCards(p);
        return { parsed: p, match: match, raw: p.rawSet };
      });
      // Record prices
      var batchPH2 = loadPriceHistory();
      for (var pri2 = 0; pri2 < results2.length; pri2++) {
        var prItem2 = results2[pri2];
        if (prItem2.match && prItem2.match.score >= 90 && prItem2.parsed.price) {
          recordPrice(prItem2.match.card.id, prItem2.parsed.price, "eBay", prItem2.parsed.rawSet || "", batchPH2);
        }
      }
      savePriceHistory(batchPH2);
      setParsed(results2);
      setShowInput(false);
      return;
    }
    if (effectiveMode === "shop") {
      var shopItems = parseCOMCShopText(rawInput);
      var shopResults = shopItems.map(function(p) {
        var match = matchToCards(p);
        return { parsed: p, match: match, raw: p.rawSet };
      });
      // Record prices for matched cards (batched - one localStorage write)
      var batchPH = loadPriceHistory();
      for (var pri = 0; pri < shopResults.length; pri++) {
        var prItem = shopResults[pri];
        if (prItem.match && prItem.match.score >= 90 && prItem.parsed.price) {
          recordPrice(prItem.match.card.id, prItem.parsed.price, "COMC", prItem.parsed.rawSet || prItem.raw || "", batchPH);
        }
      }
      savePriceHistory(batchPH);
      // Dedup: same card listed in multiple conditions (NM, EX, PSA 10, etc.)
      // Keep only the lowest price listing per matched card ID
      var seen = {};
      var deduped = [];
      for (var di = 0; di < shopResults.length; di++) {
        var item = shopResults[di];
        var matchId = item.match && item.match.score >= 90 ? item.match.card.id : null;
        if (!matchId) {
          deduped.push(item);
          continue;
        }
        if (seen[matchId] === undefined) {
          seen[matchId] = deduped.length;
          deduped.push(item);
        } else {
          // Compare prices, keep lower
          var existingPrice = parseFloat(deduped[seen[matchId]].parsed.price) || 999999;
          var newPrice = parseFloat(item.parsed.price) || 999999;
          if (newPrice < existingPrice) {
            deduped[seen[matchId]] = item;
          }
        }
      }
      setParsed(deduped);
      // Save last COMC paste for quick reload
      try { localStorage.setItem("tb-last-comc-paste-v1", rawInput); } catch(e) {}
    } else if (effectiveMode === "csv") {
      var rows = parseCSV(rawInput);
      var results = rows.map(function(row) {
        var p = parseCOMCLine(row);
        var match = matchToCards(p);
        return { parsed: p, match: match, raw: row };
      });
      setParsed(results);
    } else if (effectiveMode === "ebay") {
      var isSearchPage = rawInput.indexOf("Opens in a new window or tab") !== -1;
      var results2;
      if (isSearchPage) {
        var ebayListings = parseEbaySearchResults(rawInput);
        // Deduplicate by title - same card appears in main results, watchlist, recently viewed
        var seenTitles = {};
        var dedupedListings = [];
        for (var di = 0; di < ebayListings.length; di++) {
          var dk = (ebayListings[di].rawSet || "").trim();
          if (!dk) { dedupedListings.push(ebayListings[di]); continue; }
          if (seenTitles[dk] !== undefined) {
            // Keep the one with lower total price
            var existTotal = parseFloat(dedupedListings[seenTitles[dk]].totalPrice) || 999999;
            var newTotal = parseFloat(ebayListings[di].totalPrice) || 999999;
            if (newTotal < existTotal) dedupedListings[seenTitles[dk]] = ebayListings[di];
          } else {
            seenTitles[dk] = dedupedListings.length;
            dedupedListings.push(ebayListings[di]);
          }
        }
        results2 = dedupedListings.map(function(p) {
          var match = matchToCards(p);
          return { parsed: p, match: match, raw: p.rawSet };
        });
      } else {
        var elines = rawInput.trim().split("\n").filter(function(l){ return l.trim(); });
        results2 = elines.map(function(line) {
          var p = parseEbayLine(line);
          var match = matchToCards(p);
          return { parsed: p, match: match, raw: line };
        });
      }
      // Record eBay prices for matched cards (batched - one localStorage write)
      var ebayBatchPH = loadPriceHistory();
      for (var eri = 0; eri < results2.length; eri++) {
        var erItem = results2[eri];
        if (erItem.match && erItem.match.score >= 90 && erItem.parsed.price) {
          recordPrice(erItem.match.card.id, erItem.parsed.totalPrice || erItem.parsed.price, "eBay", erItem.parsed.rawSet || erItem.raw || "", ebayBatchPH);
        }
      }
      savePriceHistory(ebayBatchPH);
      setParsed(results2);
      // Save last eBay paste for quick reload
      try { localStorage.setItem("tb-last-ebay-paste-v1", rawInput); } catch(e) {}
    } else if (effectiveMode === "sportlots") {
      var slItems = parseSportLotsText(rawInput);
      var slResults = slItems.map(function(p) {
        var match = matchToCards(p);
        return { parsed: p, match: match, raw: p.rawSet };
      });
      // Record prices for matched cards (batched)
      var slBatchPH = loadPriceHistory();
      for (var sli = 0; sli < slResults.length; sli++) {
        var slItem = slResults[sli];
        if (slItem.match && slItem.match.score >= 90 && slItem.parsed.price) {
          recordPrice(slItem.match.card.id, slItem.parsed.price, "SportLots", slItem.parsed.rawSet || slItem.raw || "", slBatchPH);
        }
      }
      savePriceHistory(slBatchPH);
      // Dedup: same card matched from multiple conditions - keep lowest price
      var slSeen = {};
      var slDeduped = [];
      for (var sdi = 0; sdi < slResults.length; sdi++) {
        var sItem = slResults[sdi];
        var sMatchId = sItem.match && sItem.match.score >= 90 ? sItem.match.card.id : null;
        if (!sMatchId) { slDeduped.push(sItem); continue; }
        if (slSeen[sMatchId] === undefined) {
          slSeen[sMatchId] = slDeduped.length;
          slDeduped.push(sItem);
        } else {
          var sExistPrice = parseFloat(slDeduped[slSeen[sMatchId]].parsed.price) || 999999;
          var sNewPrice = parseFloat(sItem.parsed.price) || 999999;
          if (sNewPrice < sExistPrice) slDeduped[slSeen[sMatchId]] = sItem;
        }
      }
      setParsed(slDeduped);
      // Save last SportLots paste for quick reload
      try { localStorage.setItem("tb-last-sportlots-paste-v1", rawInput); } catch(e) {}
    } else if (effectiveMode === "whatnot") {
      var wnItems = parseWhatnotText(rawInput);
      var wnResults = wnItems.map(function(p) {
        var match = matchToCards(p);
        return { parsed: p, match: match, raw: p.rawSet };
      });
      // Record prices for matched cards (batched)
      var wnBatchPH = loadPriceHistory();
      for (var wni = 0; wni < wnResults.length; wni++) {
        var wnItem = wnResults[wni];
        if (wnItem.match && wnItem.match.score >= 90 && wnItem.parsed.price) {
          recordPrice(wnItem.match.card.id, wnItem.parsed.price, "Whatnot", wnItem.parsed.rawSet || wnItem.raw || "", wnBatchPH);
        }
      }
      savePriceHistory(wnBatchPH);
      // Dedup: same card matched from multiple listings - keep lowest price
      var wnSeen = {};
      var wnDeduped = [];
      for (var wdi = 0; wdi < wnResults.length; wdi++) {
        var wItem = wnResults[wdi];
        var wMatchId = wItem.match && wItem.match.score >= 90 ? wItem.match.card.id : null;
        if (!wMatchId) { wnDeduped.push(wItem); continue; }
        if (wnSeen[wMatchId] === undefined) {
          wnSeen[wMatchId] = wnDeduped.length;
          wnDeduped.push(wItem);
        } else {
          var wExistPrice = parseFloat(wnDeduped[wnSeen[wMatchId]].parsed.price) || 999999;
          var wNewPrice = parseFloat(wItem.parsed.price) || 999999;
          if (wNewPrice < wExistPrice) wnDeduped[wnSeen[wMatchId]] = wItem;
        }
      }
      setParsed(wnDeduped);
      // Save last Whatnot paste for quick reload
      try { localStorage.setItem("tb-last-whatnot-paste-v1", rawInput); } catch(e) {}
    } else if (effectiveMode === "130pt") {
      setPt130Filter("sold");
      var ptItems = parse130PointText(rawInput).concat(parse130PointForSale(rawInput));
      var ptResults = ptItems.map(function(p) {
        var match = matchToCards(p);
        return { parsed: p, match: match, raw: p.rawSet };
      });
      // Record prices for SOLD cards only (not for-sale listings)
      var ptBatchPH = loadPriceHistory();
      for (var pti = 0; pti < ptResults.length; pti++) {
        var ptItem = ptResults[pti];
        if (ptItem.match && ptItem.match.score >= 90 && ptItem.parsed.price && !(ptItem.parsed._130pt && ptItem.parsed._130pt.forSale)) {
          recordPrice(ptItem.match.card.id, ptItem.parsed.price, "130point", ptItem.parsed.rawSet || ptItem.raw || "", ptBatchPH);
        }
      }
      savePriceHistory(ptBatchPH);
      // Sort by date descending
      ptResults.sort(function(a, b) {
        var dA = (a.parsed._130pt && a.parsed._130pt.date) || "";
        var dB = (b.parsed._130pt && b.parsed._130pt.date) || "";
        return dB.localeCompare(dA);
      });
      setParsed(ptResults);
      try { localStorage.setItem("tb-last-130pt-paste-v1", rawInput); } catch(e) {}
      setShowInput(false);
    } else {
      var manualParsed = {
        year: manualYear, product: manualProduct, variant: manualVariant,
        cardNo: manualCardNo, cardNoClean: manualCardNo.replace(/\.\d+$/, ""),
        serial: manualSerial, price: manualPrice, date: manualDate,
        seller: manualSeller, rawSet: manualYear + " " + manualProduct + (manualVariant ? " - " + manualVariant : ""),
        description: "Tyler Black", orderNum: ""
      };
      var match = matchToCards(manualParsed);
      setParsed([{ parsed: manualParsed, match: match, raw: {} }]);
    }
    setApplied({});
    setShowInput(false);
  }

  function applyMatch(idx) {
    var item = parsed[idx];
    if (!item || !item.match) return;
    var card = item.match.card;
    var p = item.parsed;
    setCardStatus(card.id, "owned");
    if (p.price) updateCardDetail(card.id, "price", "$" + p.price.replace(/^\$/, ""));
    if (p.date) updateCardDetail(card.id, "date", p.date);
    if (p.serial) updateCardDetail(card.id, "serial", p.serial);
    var noteText = p.source === "130point" ? "130pt" + (p._130pt && p._130pt.forSale ? " listing" : " sold") : p.seller === "eBay" ? "eBay" : p.seller === "SportLots" ? "SportLots" : "COMC from " + (p.seller || "unknown");
    if (p.orderNum) noteText += " order:" + p.orderNum;
    if (item.match.variantMismatch) noteText += " ⚠variant?";
    updateCardDetail(card.id, "notes", noteText);
    var next = Object.assign({}, applied);
    next[idx] = true;
    setApplied(next);
  }

  function applyMatchTransit(idx) {
    var item = parsed[idx];
    if (!item || !item.match) return;
    var card = item.match.card;
    var p = item.parsed;
    setCardStatus(card.id, "in_transit");
    if (p.price) updateCardDetail(card.id, "price", "$" + p.price.replace(/^\$/, ""));
    if (p.date) updateCardDetail(card.id, "date", p.date);
    if (p.serial) updateCardDetail(card.id, "serial", p.serial);
    var noteText = p.source === "130point" ? "130pt" + (p._130pt && p._130pt.forSale ? " listing" : " sold") : p.seller === "eBay" ? "eBay" : p.seller === "SportLots" ? "SportLots" : "COMC from " + (p.seller || "unknown");
    if (p.orderNum) noteText += " order:" + p.orderNum;
    if (item.match.variantMismatch) noteText += " ⚠variant?";
    updateCardDetail(card.id, "notes", noteText);
    var next = Object.assign({}, applied);
    next[idx] = true;
    setApplied(next);
  }

  function applyAll() {
    var next = Object.assign({}, applied);
    parsed.forEach(function(item, idx) {
      if (item.match && item.match.score >= 85 && !next[idx]) {
        var card = item.match.card;
        var p = item.parsed;
        setCardStatus(card.id, "owned");
        if (p.price) updateCardDetail(card.id, "price", "$" + p.price.replace(/^\$/, ""));
        if (p.date) updateCardDetail(card.id, "date", p.date);
        if (p.serial) updateCardDetail(card.id, "serial", p.serial);
        var noteText = p.seller === "eBay" ? "eBay" : p.seller === "SportLots" ? "SportLots" : "COMC from " + (p.seller || "unknown");
        if (p.orderNum) noteText += " order:" + p.orderNum;
        updateCardDetail(card.id, "notes", noteText);
        next[idx] = true;
      }
    });
    setApplied(next);
  }

  var highConf = parsed.filter(function(r) { return r.match && r.match.score >= 85; });
  var lowConf = parsed.filter(function(r) { return r.match && r.match.score > 0 && r.match.score < 85; });
  var noMatch = parsed.filter(function(r) { return !r.match; });

  // Shop mode: categorize by ownership status
  // Score >= 90 = exact/near-exact variant match; < 90 = not in our DB
  var shopNeed = parsed.filter(function(r) {
    if (!r.match || r.match.score < 90) return false;
    var s = statuses[r.match.card.id] || "not_owned";
    return s === "not_owned";
  });
  var shopOwn = parsed.filter(function(r) {
    if (!r.match || r.match.score < 90) return false;
    var s = statuses[r.match.card.id] || "not_owned";
    return s !== "not_owned";
  });
  var shopNoMatch = parsed.filter(function(r) { return !r.match || r.match.score < 90; });
  var shopBaseFiltered = shopFilter === "need" ? shopNeed : shopFilter === "own" ? shopOwn : shopFilter === "nomatch" ? shopNoMatch : parsed;
  // Filter out blocked listings
  var shopUnblocked = shopBaseFiltered.filter(function(r) {
    var key = (r.parsed.rawSet || "").trim();
    return !key || !ebayBlocked[key];
  });
  // 130pt: filter by sold vs for-sale
  if (mode === "130pt" && pt130Filter !== "all") {
    shopUnblocked = shopUnblocked.filter(function(r) {
      var isFS = r.parsed._130pt && r.parsed._130pt.forSale;
      return pt130Filter === "forsale" ? isFS : !isFS;
    });
  }
  var pt130SoldCount = mode === "130pt" ? parsed.filter(function(r) { return !(r.parsed._130pt && r.parsed._130pt.forSale); }).length : 0;
  var pt130FSCount = mode === "130pt" ? parsed.filter(function(r) { return r.parsed._130pt && r.parsed._130pt.forSale; }).length : 0;
  // Apply tag filters (auto, sn, graded)
  var shopFiltered = shopUnblocked.filter(function(r) {
    var p = r.parsed;
    if (scanTags.auto && !p.isAuto) return false;
    if (scanTags.sn && !p.serial && !p.printRun && !(r.match && r.match.score >= 90 && r.match.card.copies)) return false;
    if (scanTags.graded && !p.graded) return false;
    if (scanCardNo && r.match && r.match.score >= 90 && r.match.card.cardNumber !== scanCardNo) return false;
    if (scanCardNo && (!r.match || r.match.score < 90)) return false;
    return true;
  });

  // Compute card number frequencies from current shopBaseFiltered for filter buttons
  var scanCardNoCounts = {};
  shopUnblocked.forEach(function(r) {
    if (!r.match || r.match.score < 90) return;
    var cn = r.match.card.cardNumber;
    scanCardNoCounts[cn] = (scanCardNoCounts[cn] || 0) + 1;
  });
  var scanCardNoButtons = Object.entries(scanCardNoCounts).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 20);

  // Sort shop results
  function toggleShopSort(col) {
    setShopSort(function(prev) {
      return prev.col === col ? {col:col, dir: prev.dir === "asc" ? "desc" : "asc"} : {col:col, dir:"asc"};
    });
  }
  var shopSorted = shopFiltered.slice().sort(function(a, b) {
    var dir = shopSort.dir === "asc" ? 1 : -1;
    var col = shopSort.col;
    var av, bv;
    if (col === "price") { av = parseFloat(a.parsed.totalPrice || a.parsed.price) || 0; bv = parseFloat(b.parsed.totalPrice || b.parsed.price) || 0; }
    else if (col === "year") { av = a.parsed.year; bv = b.parsed.year; }
    else if (col === "product") { av = (a.parsed.product || "").toLowerCase(); bv = (b.parsed.product || "").toLowerCase(); }
    else if (col === "variant") { av = (a.parsed.variant || "").toLowerCase(); bv = (b.parsed.variant || "").toLowerCase(); }
    else if (col === "cardNo") { av = a.parsed.cardNoClean || ""; bv = b.parsed.cardNoClean || ""; }
    else if (col === "sn") { av = parseInt(a.parsed.serial || "0") || 0; bv = parseInt(b.parsed.serial || "0") || 0; if (av === bv) { av = parseInt(a.parsed.printRun || "0") || 0; bv = parseInt(b.parsed.printRun || "0") || 0; } }
    else if (col === "score") { av = a.match ? a.match.score : 0; bv = b.match ? b.match.score : 0; }
    else { av = ""; bv = ""; }
    if (av < bv) return -1 * dir; if (av > bv) return 1 * dir; return 0;
  });

  // Hide more expensive listings for WATCHED cards — keep only the cheapest listing per card
  var watchedCheapest = {}; // cardId → cheapest price seen
  shopSorted.forEach(function(item) {
    if (!item.match || item.match.score < 90) return;
    var cid = item.match.card.id;
    if (!targetByCardId[cid]) return;
    var tg = targetByCardId[cid][0];
    if (!tg || tg.status !== "watching") return;
    var price = parseFloat(item.parsed.totalPrice || item.parsed.price) || 999999;
    if (watchedCheapest[cid] === undefined || price < watchedCheapest[cid]) {
      watchedCheapest[cid] = price;
    }
  });
  if (Object.keys(watchedCheapest).length > 0) {
    shopSorted = shopSorted.filter(function(item) {
      if (!item.match || item.match.score < 90) return true;
      var cid = item.match.card.id;
      if (watchedCheapest[cid] === undefined) return true;
      var price = parseFloat(item.parsed.totalPrice || item.parsed.price) || 999999;
      return price <= watchedCheapest[cid];
    });
  }
  function toggleExpand(idx) { setExpanded(function(prev) { var n = Object.assign({}, prev); n[idx] = !n[idx]; return n; }); if (!expanded[idx]) { setSeenDrops(function(prev) { var n = Object.assign({}, prev); n[idx] = true; return n; }); } }
  function sortArrow(col) { return shopSort.col === col ? (shopSort.dir === "asc" ? " \u25B2" : " \u25BC") : ""; }

  return (
    <div className="space-y-1">
      <div className="bg-gray-800 rounded-lg p-2">
        {/* Header: mode indicator + tabs (only show tabs after first scan) */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-[11px]" style={{color:"#FFC52F"}}>{parsed.length === 0 && mode === "auto" ? "Scanner" : mode === "shop" ? "COMC Scanner" : mode === "ebay" ? "eBay Scanner" : mode === "sportlots" ? "SportLots Scanner" : mode === "whatnot" ? "Whatnot Scanner" : mode === "130pt" ? "130point Scanner" : mode === "tcdb" ? "TCDB Comparison" : mode === "manual" ? "Manual Entry" : "Scanner"}</h3>
          {(parsed.length > 0 || mode !== "auto") && (
            <div className="flex gap-0.5 flex-wrap">
              <button onClick={function(){setMode("shop"); setRawInput(""); setParsed([]); setApplied({}); setShowInput(true);}} className={"text-[10px] px-1.5 py-0.5 rounded " + (mode === "shop" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300")}>COMC</button>
              <button onClick={function(){setMode("ebay"); setRawInput(""); setParsed([]); setApplied({}); setShowInput(true);}} className={"text-[10px] px-1.5 py-0.5 rounded " + (mode === "ebay" ? "bg-yellow-600 text-white" : "bg-gray-700 text-gray-300")}>eBay</button>
              <button onClick={function(){setMode("sportlots"); setRawInput(""); setParsed([]); setApplied({}); setShowInput(true);}} className={"text-[10px] px-1.5 py-0.5 rounded " + (mode === "sportlots" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300")}>SportLots</button>
              <button onClick={function(){setMode("whatnot"); setRawInput(""); setParsed([]); setApplied({}); setShowInput(true);}} className={"text-[10px] px-1.5 py-0.5 rounded " + (mode === "whatnot" ? "bg-violet-600 text-white" : "bg-gray-700 text-gray-300")}>Whatnot</button>
              <button onClick={function(){setMode("130pt"); setRawInput(""); setParsed([]); setApplied({}); setShowInput(true);}} className={"text-[10px] px-1.5 py-0.5 rounded " + (mode === "130pt" ? "bg-teal-600 text-white" : "bg-gray-700 text-gray-300")}>130point</button>
              <button onClick={function(){setMode("tcdb"); setRawInput(""); setParsed([]); setApplied({}); setShowInput(true); setTcdbDetectedStatus(null);}} className={"text-[10px] px-1.5 py-0.5 rounded " + (mode === "tcdb" ? "bg-cyan-600 text-white" : "bg-gray-700 text-gray-300")}>TCDB</button>
              <button onClick={function(){setMode("manual"); setRawInput(""); setParsed([]); setApplied({}); setShowInput(true);}} className={"text-[10px] px-1.5 py-0.5 rounded " + (mode === "manual" ? "bg-orange-600 text-white" : "bg-gray-700 text-gray-300")}>Manual</button>
              {(function(){ var oc = Object.keys(comcOverrides).length; return oc > 0 ? (
                <span className="text-[10px] text-yellow-400 flex items-center gap-1">{"\ud83d\udccc"} {oc} pinned
                  <button onClick={function(){ if(confirm("Clear all " + oc + " pinned matches?")) { saveComcOverrides({}); setComcOverrides({}); var up = parsed.map(function(r){ var nm = matchToCards(r.parsed); return { parsed: r.parsed, match: nm, raw: r.raw }; }); setParsed(up); }}} className="text-[9px] px-1 py-0 bg-red-900/40 border border-red-700 text-red-300 rounded hover:bg-red-800/40">clear</button>
                </span>
              ) : null; })()}
            </div>
          )}
        </div>

        {!showInput && parsed.length > 0 ? (
          <div className="flex items-center gap-2 mt-1">
            <button onClick={function(){ setShowInput(true); }} className="text-[10px] px-2 py-0.5 bg-gray-700 border border-gray-600 text-gray-300 rounded hover:bg-gray-600">{"\u25BC"} Edit Input</button>
            <span className="text-xs text-gray-500">{parsed.length} listing{parsed.length !== 1 ? "s" : ""} loaded</span>
            <button onClick={function(){ setMode("auto"); setRawInput(""); setParsed([]); setApplied({}); setShowInput(true); }} className="text-[10px] px-2 py-0.5 bg-red-900/40 border border-red-700 text-red-400 rounded hover:bg-red-800/40">Clear</button>
          </div>
        ) : mode === "manual" ? (
          <React.Fragment>
          <div className="grid grid-cols-2 gap-2">
            <input value={manualYear} onChange={function(e){setManualYear(e.target.value);}} className="bg-gray-900 text-gray-200 text-xs p-1.5 rounded border border-gray-600" placeholder="Year (e.g. 2024)" />
            <input value={manualProduct} onChange={function(e){setManualProduct(e.target.value);}} className="bg-gray-900 text-gray-200 text-xs p-1.5 rounded border border-gray-600" placeholder="Product (e.g. Topps Chrome)" />
            <input value={manualCardNo} onChange={function(e){setManualCardNo(e.target.value);}} className="bg-gray-900 text-gray-200 text-xs p-1.5 rounded border border-gray-600" placeholder="Card # (e.g. 63)" />
            <input value={manualVariant} onChange={function(e){setManualVariant(e.target.value);}} className="bg-gray-900 text-gray-200 text-xs p-1.5 rounded border border-gray-600" placeholder="Variant (e.g. Gold Refractors)" />
            <input value={manualPrice} onChange={function(e){setManualPrice(e.target.value);}} className="bg-gray-900 text-gray-200 text-xs p-1.5 rounded border border-gray-600" placeholder="Price (e.g. 5.25)" />
            <input value={manualSeller} onChange={function(e){setManualSeller(e.target.value);}} className="bg-gray-900 text-gray-200 text-xs p-1.5 rounded border border-gray-600" placeholder="Seller" />
            <input value={manualSerial} onChange={function(e){setManualSerial(e.target.value);}} className="bg-gray-900 text-gray-200 text-xs p-1.5 rounded border border-gray-600" placeholder="Serial # (optional)" />
            <input value={manualDate} onChange={function(e){setManualDate(e.target.value);}} className="bg-gray-900 text-gray-200 text-xs p-1.5 rounded border border-gray-600" placeholder="Date (e.g. 2/7/2026)" />
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={handleParse} className="px-3 py-1.5 text-white text-xs font-bold rounded bg-orange-600 hover:bg-orange-500">Scan and Match</button>
          </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
          <div className="flex gap-1 mb-1 flex-wrap">
            <button onClick={function(){ navigator.clipboard.readText().then(function(txt) { setRawInput(txt); setParsed([]); setApplied({}); }).catch(function() { alert("Clipboard access denied. Please paste manually with Ctrl+V."); }); }} className={"text-[9px] px-2 py-0.5 rounded border " + (mode === "ebay" ? "bg-yellow-900/40 border-yellow-600 text-yellow-300 hover:bg-yellow-800/40" : mode === "130pt" ? "bg-teal-900/40 border-teal-600 text-teal-300 hover:bg-teal-800/40" : mode === "sportlots" ? "bg-blue-900/40 border-blue-600 text-blue-300 hover:bg-blue-800/40" : mode === "whatnot" ? "bg-violet-900/40 border-violet-600 text-violet-300 hover:bg-violet-800/40" : "bg-gray-700 border-gray-500 text-gray-300 hover:bg-gray-600")} title="Read clipboard and paste into textarea">{"\uD83D\uDCCB"} Paste</button>
            {(function(){ var keys = [{k:"tb-last-ebay-paste-v1",l:"eBay",c:"text-yellow-400"},{k:"tb-last-comc-paste-v1",l:"COMC",c:"text-green-400"},{k:"tb-last-sportlots-paste-v1",l:"SL",c:"text-blue-400"},{k:"tb-last-whatnot-paste-v1",l:"WN",c:"text-violet-400"},{k:"tb-last-130pt-paste-v1",l:"130pt",c:"text-teal-400"}]; return keys.map(function(item) { try { if (!localStorage.getItem(item.k)) return null; } catch(e) { return null; } return React.createElement("button", { key: item.k, onClick: function(){ try { var saved = localStorage.getItem(item.k); if (saved) { setRawInput(saved); setParsed([]); setApplied({}); } } catch(e) {} }, className: "text-[9px] px-1.5 py-0.5 bg-gray-800 border border-gray-600 rounded hover:bg-gray-700 " + item.c, title: "Reload last " + item.l + " paste" }, item.l); }); })()}
          </div>
          <div className="relative">
            <textarea value={rawInput} onChange={function(e){setRawInput(e.target.value); setParsed([]); setApplied({});}} className={"w-full bg-gray-900 text-gray-200 text-xs font-mono p-2 pr-7 rounded border focus:outline-none " + (mode === "ebay" ? "border-yellow-600 focus:border-yellow-400" : mode === "130pt" ? "border-teal-700 focus:border-teal-400" : mode === "sportlots" ? "border-blue-600 focus:border-blue-400" : mode === "whatnot" ? "border-violet-600 focus:border-violet-400" : mode === "shop" ? "border-green-700 focus:border-green-400" : mode === "tcdb" ? "border-cyan-600 focus:border-cyan-400" : "border-gray-600 focus:border-orange-400")} style={{height: parsed.length > 0 ? "80px" : "120px"}} placeholder={mode === "tcdb" ? "Paste from TCDB collection page:\n\n1. Go to your TCDB Tyler Black collection\n2. Filter by Have, Want, or In-Transit\n3. Ctrl+A to select all, Ctrl+C to copy\n4. Paste here and hit Scan\n\nAuto-detects which list (Have/Want/In-Transit) you copied from." : "Paste from any source \u2014 auto-detected:\n\u2022 eBay search results (Ctrl+A, Ctrl+C)\n\u2022 COMC marketplace listings\n\u2022 130point.com sold/for-sale results\n\u2022 SportLots player page\n\u2022 Whatnot search results\n\u2022 TCDB collection page (Have/Want/In-Transit)\n\nOr use tabs above to force a specific mode."} />
            {rawInput && <button onClick={function(){ setRawInput(""); setParsed([]); setApplied({}); }} className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded bg-gray-700/80 hover:bg-red-800/80 text-gray-400 hover:text-red-300 text-xs font-bold" title="Clear input">{"\u2715"}</button>}
          </div>
          <div className="flex gap-2 mt-1 items-center">
            <button onClick={handleParse} className={"px-3 py-1 text-white text-xs font-bold rounded " + (mode === "ebay" ? "bg-yellow-600 hover:bg-yellow-500" : mode === "130pt" ? "bg-teal-600 hover:bg-teal-500" : mode === "sportlots" ? "bg-blue-600 hover:bg-blue-500" : mode === "whatnot" ? "bg-violet-600 hover:bg-violet-500" : mode === "shop" ? "bg-green-600 hover:bg-green-500" : "bg-orange-600 hover:bg-orange-500")}>{parsed.length > 0 ? "Re-scan" : "Scan"}</button>
            {rawInput.trim() && mode === "auto" && <span className="text-[9px] text-gray-500">{"Detected: " + (detectMode(rawInput) === "auto" ? "unknown" : detectMode(rawInput))}</span>}
            {parsed.length > 0 && <span className="text-[9px] text-gray-400">{parsed.length} Tyler Black card{parsed.length !== 1 ? "s" : ""}</span>}
          </div>
          </React.Fragment>
        )}
      </div>

      {/* TCDB COMPARISON DISPLAY */}
      {parsed.length > 0 && mode === "tcdb" && (function() {
        var tcdbStatusLabel = tcdbDetectedStatus === "owned" ? "Have (Owned)" : tcdbDetectedStatus === "in_transit" ? "In-Transit" : tcdbDetectedStatus === "not_owned" ? "Want (Need)" : tcdbDetectedStatus === "all" ? "All Cards" : "Unknown List";
        var tcdbStatusColor = tcdbDetectedStatus === "owned" ? "#22c55e" : tcdbDetectedStatus === "in_transit" ? "#86efac" : tcdbDetectedStatus === "not_owned" ? "#ef4444" : "#9ca3af";
        // Build comparison data
        var compRows = [];
        for (var ci = 0; ci < parsed.length; ci++) {
          var r = parsed[ci];
          var matched = r.match && r.match.score >= 85;
          var card = matched ? r.match.card : null;
          var trackerStatus = card ? (statuses[card.id] || "not_owned") : null;
          var tcdbSays = tcdbDetectedStatus;
          var isMismatch = false;
          if (matched && tcdbSays !== "all" && tcdbSays !== "unknown") {
            if (tcdbSays === "owned" && trackerStatus !== "owned") isMismatch = true;
            if (tcdbSays === "in_transit" && trackerStatus !== "in_transit") isMismatch = true;
            if (tcdbSays === "not_owned" && trackerStatus !== "not_owned") isMismatch = true;
          }
          compRows.push({ idx: ci, r: r, card: card, matched: matched, trackerStatus: trackerStatus, tcdbSays: tcdbSays, isMismatch: isMismatch });
        }
        var matchedRows = compRows.filter(function(c) { return c.matched; });
        var unmatchedRows = compRows.filter(function(c) { return !c.matched; });
        var mismatchRows = matchedRows.filter(function(c) { return c.isMismatch; });
        var agreeRows = matchedRows.filter(function(c) { return !c.isMismatch; });
        var filteredRows = tcdbFilter === "mismatch" ? mismatchRows : tcdbFilter === "agree" ? agreeRows : tcdbFilter === "unmatched" ? unmatchedRows : compRows;

        var statusBadge = function(st) {
          if (st === "owned") return React.createElement("span", {className:"px-1.5 py-0.5 rounded text-[9px] font-bold bg-green-900/50 border border-green-600 text-green-300"}, "OWNED");
          if (st === "in_transit") return React.createElement("span", {className:"px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-900/50 border border-emerald-600 text-emerald-300"}, "IN-TRANSIT");
          if (st === "not_owned") return React.createElement("span", {className:"px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-900/50 border border-red-600 text-red-300"}, "NEED");
          return React.createElement("span", {className:"px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-700 text-gray-400"}, st || "?");
        };

        return React.createElement("div", {className:"space-y-2 mt-2"},
          // Status header
          React.createElement("div", {className:"bg-cyan-900/20 border border-cyan-800 rounded px-3 py-2"},
            React.createElement("div", {className:"flex items-center justify-between"},
              React.createElement("div", {className:"flex items-center gap-2"},
                React.createElement("span", {className:"text-xs font-bold", style:{color:tcdbStatusColor}}, "TCDB: " + tcdbStatusLabel),
                React.createElement("span", {className:"text-[10px] text-gray-500"}, parsed.length + " cards parsed")
              ),
              React.createElement("div", {className:"flex items-center gap-2"},
                matchedRows.length > 0 && React.createElement("span", {className:"text-[10px] text-green-400"}, matchedRows.length + " matched"),
                unmatchedRows.length > 0 && React.createElement("span", {className:"text-[10px] text-yellow-400"}, unmatchedRows.length + " unmatched"),
                mismatchRows.length > 0 && React.createElement("span", {className:"text-[10px] text-red-400 font-bold"}, mismatchRows.length + " mismatch" + (mismatchRows.length !== 1 ? "es" : ""))
              )
            ),
            tcdbDetectedStatus === "unknown" && React.createElement("div", {className:"text-[10px] text-yellow-400 mt-1"}, "Could not detect which TCDB list this was copied from. Try copying from the Have, Want, or In-Transit page specifically.")
          ),
          // Filter bar
          React.createElement("div", {className:"flex items-center gap-1 flex-wrap"},
            React.createElement("button", {onClick:function(){setTcdbFilter("mismatch");}, className:"text-[10px] px-1.5 py-0.5 rounded font-bold " + (tcdbFilter === "mismatch" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300")}, "Mismatches (" + mismatchRows.length + ")"),
            React.createElement("button", {onClick:function(){setTcdbFilter("agree");}, className:"text-[10px] px-1.5 py-0.5 rounded font-bold " + (tcdbFilter === "agree" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300")}, "Match (" + agreeRows.length + ")"),
            React.createElement("button", {onClick:function(){setTcdbFilter("unmatched");}, className:"text-[10px] px-1.5 py-0.5 rounded font-bold " + (tcdbFilter === "unmatched" ? "bg-yellow-600 text-white" : "bg-gray-700 text-gray-300")}, "Unmatched (" + unmatchedRows.length + ")"),
            React.createElement("button", {onClick:function(){setTcdbFilter("all");}, className:"text-[10px] px-1.5 py-0.5 rounded font-bold " + (tcdbFilter === "all" ? "bg-gray-500 text-white" : "bg-gray-700 text-gray-300")}, "All (" + compRows.length + ")"),
            mismatchRows.length > 0 && tcdbDetectedStatus !== "all" && tcdbDetectedStatus !== "unknown" && React.createElement("button", {onClick: function() {
              if (!confirm("Update " + mismatchRows.length + " cards in tracker to match TCDB " + tcdbStatusLabel + " status?")) return;
              mismatchRows.forEach(function(row) { setCardStatus(row.card.id, tcdbDetectedStatus); });
              setApplied(function(prev) { var n = Object.assign({}, prev); mismatchRows.forEach(function(row) { n[row.card.id] = true; }); return n; });
            }, className:"text-[10px] px-2 py-0.5 rounded font-bold bg-orange-700 hover:bg-orange-600 text-white ml-2"}, "Fix All " + mismatchRows.length + " in Tracker")
          ),
          // Results table
          React.createElement("div", {className:"max-h-96 overflow-y-auto"},
            filteredRows.length === 0 ?
              React.createElement("div", {className:"text-center text-gray-500 text-[10px] py-4"}, tcdbFilter === "mismatch" ? "No mismatches — tracker and TCDB agree!" : "No cards in this filter.") :
              React.createElement("table", {className:"w-full text-[10px]"},
                React.createElement("thead", null,
                  React.createElement("tr", {className:"text-gray-500 border-b border-gray-700"},
                    React.createElement("th", {className:"text-left px-1 py-1"}, "Card"),
                    React.createElement("th", {className:"text-center px-1 py-1 w-20"}, "TCDB"),
                    React.createElement("th", {className:"text-center px-1 py-1 w-20"}, "Tracker"),
                    React.createElement("th", {className:"text-center px-1 py-1 w-8"}, ""),
                    React.createElement("th", {className:"text-center px-1 py-1 w-16"}, "Action")
                  )
                ),
                React.createElement("tbody", null,
                  filteredRows.map(function(row) {
                    var isApplied = row.card && applied[row.card.id];
                    var displayStatus = row.card ? (isApplied ? tcdbDetectedStatus : row.trackerStatus) : null;
                    return React.createElement("tr", {key: row.idx, className: "border-b border-gray-800 " + (row.isMismatch && !isApplied ? "bg-red-950/20" : isApplied ? "bg-green-950/20" : "")},
                      // Card info
                      React.createElement("td", {className:"px-1 py-1"},
                        row.matched ?
                          React.createElement("div", null,
                            React.createElement("span", {className:"text-white"}, row.card.cardNumber),
                            React.createElement("span", {className:"text-gray-500 ml-1"}, row.card.cardSet !== "Base" ? row.card.cardSet : ""),
                            React.createElement("div", {className:"text-gray-600 text-[9px]"}, row.card.year + " " + row.card.product)
                          ) :
                          React.createElement("span", {className:"text-yellow-400 font-mono"}, row.r.raw || "?")
                      ),
                      // TCDB says
                      React.createElement("td", {className:"text-center px-1 py-1"}, tcdbDetectedStatus !== "all" && tcdbDetectedStatus !== "unknown" ? statusBadge(tcdbDetectedStatus) : React.createElement("span", {className:"text-gray-600"}, "—")),
                      // Tracker says
                      React.createElement("td", {className:"text-center px-1 py-1"}, row.matched ? statusBadge(displayStatus) : React.createElement("span", {className:"text-gray-600"}, "—")),
                      // Match indicator
                      React.createElement("td", {className:"text-center px-1 py-1"},
                        !row.matched ? React.createElement("span", {className:"text-yellow-500"}, "?") :
                        isApplied ? React.createElement("span", {className:"text-green-400 font-bold"}, "\u2713") :
                        row.isMismatch ? React.createElement("span", {className:"text-red-400 font-bold"}, "\u2716") :
                        React.createElement("span", {className:"text-green-600"}, "\u2713")
                      ),
                      // Action
                      React.createElement("td", {className:"text-center px-1 py-1"},
                        row.matched && row.isMismatch && !isApplied && tcdbDetectedStatus !== "all" && tcdbDetectedStatus !== "unknown" ?
                          React.createElement("button", {onClick: function() {
                            var cid = row.card.id;
                            setCardStatus(cid, tcdbDetectedStatus);
                            setApplied(function(prev) { var n = Object.assign({}, prev); n[cid] = true; return n; });
                          }, className:"text-[9px] px-1.5 py-0.5 bg-orange-800 hover:bg-orange-700 text-orange-200 rounded"}, "Fix") :
                        isApplied ? React.createElement("span", {className:"text-green-600 text-[9px]"}, "Fixed") :
                        row.matched ? React.createElement("a", {href: tcdbUrl(row.card), target:"_blank", rel:"noopener noreferrer", className:"text-cyan-400 hover:text-cyan-300 font-bold"}, "T") : null
                      )
                    );
                  })
                )
              )
          )
        );
      })()}


      {parsed.length > 0 && (mode === "shop" || mode === "ebay" || mode === "sportlots" || mode === "whatnot" || mode === "130pt") && (
        <div className="space-y-1">
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1.5 flex-wrap">
            <button onClick={function(){setShopFilter("need");}} className={"text-[10px] px-1.5 py-0.5 rounded font-bold " + (shopFilter === "need" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300")}>Need ({shopNeed.length})</button>
            <button onClick={function(){setShopFilter("own");}} className={"text-[10px] px-1.5 py-0.5 rounded font-bold " + (shopFilter === "own" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300")}>Own ({shopOwn.length})</button>
            <button onClick={function(){setShopFilter("nomatch");}} className={"text-[10px] px-1.5 py-0.5 rounded font-bold " + (shopFilter === "nomatch" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300")}>No DB ({shopNoMatch.length})</button>
            <button onClick={function(){setShopFilter("all");}} className={"text-[10px] px-1.5 py-0.5 rounded font-bold " + (shopFilter === "all" ? "bg-gray-500 text-white" : "bg-gray-700 text-gray-300")}>All ({parsed.length})</button>
            {mode === "130pt" && pt130FSCount > 0 && <React.Fragment>
              <span className="text-gray-600 mx-0.5">|</span>
              <button onClick={function(){setPt130Filter("sold");}} className={"text-[10px] px-1.5 py-0.5 rounded font-bold " + (pt130Filter === "sold" ? "bg-teal-600 text-white" : "bg-gray-700 text-teal-300")}>Sold ({pt130SoldCount})</button>
              <button onClick={function(){setPt130Filter("forsale");}} className={"text-[10px] px-1.5 py-0.5 rounded font-bold " + (pt130Filter === "forsale" ? "bg-lime-600 text-white" : "bg-gray-700 text-lime-300")}>For Sale ({pt130FSCount})</button>
              <button onClick={function(){setPt130Filter("all");}} className={"text-[10px] px-1.5 py-0.5 rounded font-bold " + (pt130Filter === "all" ? "bg-gray-500 text-white" : "bg-gray-700 text-gray-300")}>Both</button>
            </React.Fragment>}
            {(function(){ var cc = loadCustomCards(); var oc = Object.keys(loadComcOverrides()).length; var total = cc.length + oc; return total > 0 ? (
              <button onClick={function(){setShowCustomMgr(!showCustomMgr);}} className={"text-[10px] px-1.5 py-0.5 rounded font-bold " + (showCustomMgr ? "bg-purple-600 text-white" : "bg-purple-900 text-purple-300")}>
                {"Asgn (" + total + ")"}
              </button>
            ) : null; })()}
            {shopNeed.length > 0 && <span className="ml-auto text-[10px]" style={{color:"#FFC52F"}}>Need: ${shopNeed.reduce(function(sum, r) { return sum + (parseFloat(r.parsed.totalPrice || r.parsed.price) || 0); }, 0).toFixed(2)}</span>}
          </div>
          {/* Tag filters */}
          <div className="flex items-center gap-1.5 px-2">
            <span className="text-gray-600 text-[10px]">Filter:</span>
            <button onClick={function(){toggleScanTag("auto");}} className={"text-[10px] px-1.5 py-0.5 rounded border font-bold " + (scanTags.auto ? "bg-yellow-700 border-yellow-500 text-yellow-100" : "border-gray-700 text-gray-500 hover:text-yellow-300 hover:border-yellow-700")}>AU</button>
            <button onClick={function(){toggleScanTag("sn");}} className={"text-[10px] px-1.5 py-0.5 rounded border font-bold " + (scanTags.sn ? "bg-purple-700 border-purple-500 text-purple-100" : "border-gray-700 text-gray-500 hover:text-purple-300 hover:border-purple-700")}>SN</button>
            <button onClick={function(){toggleScanTag("graded");}} className={"text-[10px] px-1.5 py-0.5 rounded border font-bold " + (scanTags.graded ? "bg-pink-700 border-pink-500 text-pink-100" : "border-gray-700 text-gray-500 hover:text-pink-300 hover:border-pink-700")}>Graded</button>
            {(scanTags.auto || scanTags.sn || scanTags.graded) && <span className="text-gray-500 text-[10px]">({shopFiltered.length} shown)</span>}
            {Object.keys(ebayBlocked).length > 0 && (
              <React.Fragment>
                <span className="text-gray-700 text-[10px]">|</span>
                <button onClick={function(){ setShowBlockedMgr(!showBlockedMgr); }} className={"text-[10px] px-1.5 py-0.5 rounded border font-bold " + (showBlockedMgr ? "bg-red-700 border-red-500 text-red-100" : "border-red-900 text-red-500 hover:text-red-300 hover:border-red-700")}>{"\uD83D\uDEAB " + Object.keys(ebayBlocked).length + " blocked"}</button>
              </React.Fragment>
            )}
          </div>
          {/* Card number quick filters */}
          {scanCardNoButtons.length > 1 && (
            <div className="flex items-center gap-1 px-2 flex-wrap">
              <span className="text-gray-600 text-[10px]">Card#:</span>
              {scanCardNo && <button onClick={function(){setScanCardNo("");}} className="text-[9px] px-1 py-0 rounded bg-gray-600 text-white font-bold">✕ All</button>}
              {scanCardNoButtons.map(function(entry) {
                var cn = entry[0], cnt = entry[1];
                var isActive = scanCardNo === cn;
                return <button key={cn} onClick={function(){setScanCardNo(isActive ? "" : cn);}} className={"text-[9px] px-1.5 py-0.5 rounded border font-bold " + (isActive ? "bg-orange-600 border-orange-400 text-white" : "border-gray-700 text-gray-400 hover:text-orange-300 hover:border-orange-600")}>{cn} <span className="text-[8px] opacity-60">({cnt})</span></button>;
              })}
            </div>
          )}
          {showBlockedMgr && (function(){
            var bl = ebayBlocked;
            var keys = Object.keys(bl);
            return keys.length > 0 ? (
              <div className="bg-red-950/30 border border-red-800 rounded-lg p-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-red-300 font-bold">{"\uD83D\uDEAB"} Blocked Listings ({keys.length})</span>
                  <div className="flex gap-2">
                    <button onClick={function(){ if(confirm("Unblock all " + keys.length + " listings?")) { saveEbayBlocked({}); setEbayBlocked({}); }}} className="text-[9px] px-1 py-0 bg-red-900/40 border border-red-700 text-red-300 rounded hover:bg-red-800/40">clear all</button>
                    <button onClick={function(){setShowBlockedMgr(false);}} className="text-gray-500 hover:text-gray-300 text-xs">Close</button>
                  </div>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-0.5">
                  {keys.map(function(key) {
                    return (
                      <div key={key} className="flex items-center gap-2 bg-gray-800/50 rounded px-2 py-1 text-[10px]">
                        <span className="text-gray-400 flex-1 truncate" title={key}>{key}</span>
                        <span className="text-gray-600 flex-shrink-0">{bl[key].date || ""}</span>
                        <button onClick={function(){ var b = loadEbayBlocked(); delete b[key]; saveEbayBlocked(b); setEbayBlocked(Object.assign({}, b)); }} className="text-green-500 hover:text-green-300 font-bold px-1 rounded text-[10px] flex-shrink-0" title="Unblock">Unblock</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null;
          })()}
          {showCustomMgr && (function(){
            var cc = loadCustomCards();
            var ov = loadComcOverrides();
            var ovEntries = Object.keys(ov).map(function(key) {
              var cardId = ov[key];
              var card = cards.find(function(c) { return c.id === cardId; });
              return { key: key, cardId: cardId, card: card };
            }).filter(function(e) { return e.card; });
            var hasContent = cc.length > 0 || ovEntries.length > 0;
            return hasContent ? (
              <div className="bg-purple-950/30 border border-purple-800 rounded-lg p-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-300 font-bold">Manual Assignments & Custom Cards</span>
                  <button onClick={function(){setShowCustomMgr(false);}} className="text-gray-500 hover:text-gray-300 text-xs">Close</button>
                </div>
                {ovEntries.length > 0 && (
                  <div>
                    <div className="text-[10px] text-cyan-400 font-bold mb-0.5">{"\uD83D\uDCCC"} Pinned Matches ({ovEntries.length})</div>
                    <div className="max-h-32 overflow-y-auto space-y-0.5">
                      {ovEntries.map(function(entry) {
                        var cStatus = statuses[entry.cardId] || "not_owned";
                        var statusDot = cStatus === "owned" ? "bg-green-500" : cStatus === "in_transit" ? "bg-emerald-400" : "bg-gray-600";
                        var candIsAuto = entry.card.isAuto === "Yes" || /autograph|auto|signature/i.test(entry.card.cardSet || "");
                        return (
                          <div key={entry.key} className="flex items-center gap-1.5 bg-gray-800/50 rounded px-2 py-1 text-[10px]">
                            <span className={"w-1.5 h-1.5 rounded-full flex-shrink-0 " + statusDot}></span>
                            <span className="text-gray-500 font-mono flex-shrink-0">#{entry.card.cardNumber}</span>
                            <span className="text-gray-400 flex-shrink-0 max-w-[100px] truncate" title={entry.card.product}>{String(entry.card.product).slice(5)}</span>
                            <span className="text-gray-200 flex-1 truncate">{entry.card.cardSet || "Base"} {sspBadge(entry.card.cardSet)}</span>
                            {entry.card.copies && <span className="text-purple-400 font-bold flex-shrink-0">{"/" + entry.card.copies}</span>}
                            {candIsAuto && <span className="text-yellow-400 text-[8px] font-bold bg-yellow-900/50 px-0.5 rounded flex-shrink-0">AU</span>}
                            <span className="text-gray-700 flex-shrink-0" title={entry.key}>{"\u2190"}</span>
                            <span className="text-gray-600 flex-shrink-0 max-w-[100px] truncate" title={entry.key}>{entry.key.split("|").slice(1,3).join(" #")}</span>
                            <button onClick={function(){ var o = loadComcOverrides(); delete o[entry.key]; saveComcOverrides(o); setComcOverrides(Object.assign({}, o)); var up = parsed.map(function(r){ var nm = matchToCards(r.parsed); return { parsed: r.parsed, match: nm, raw: r.raw }; }); setParsed(up); }} className="text-red-500 hover:text-red-300 font-bold px-1 rounded text-[10px] flex-shrink-0" title="Unpin">✕</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {cc.length > 0 && (
                  <div>
                    <div className="text-[10px] text-purple-400 font-bold mb-0.5">User-Added Cards ({cc.length})</div>
                    <div className="max-h-32 overflow-y-auto space-y-0.5">
                  {cc.map(function(card, idx) {
                    return (
                      <div key={idx} className="flex items-center justify-between bg-gray-800/50 rounded px-2 py-1 text-[10px]">
                        <span className="text-gray-300">
                          <span className="text-purple-400 font-mono">#{10000 + idx}</span>
                          {" " + card.product + " | " + card.cardSet + " | #" + card.cardNumber}
                          {card.copies ? " /" + card.copies : ""}
                          {card.isAuto === "Yes" ? " [A]" : ""}
                          {card.isMem === "Yes" ? " [M]" : ""}
                          {card.isRC === "Yes" ? " [RC]" : ""}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">{card.addedDate || ""}</span>
                          <button onClick={function(){ editCustomCard(idx); }} className="text-yellow-500 hover:text-yellow-300 font-bold px-1 rounded text-[10px]" title="Edit">✏️</button>
                          <button onClick={function(){ removeCustomCard(idx); }} className={(confirmDeleteIdx === idx ? "bg-red-600 text-white px-2" : "text-red-500 hover:text-red-300") + " font-bold px-1 rounded text-[10px]"} title="Remove">{confirmDeleteIdx === idx ? "Sure?" : "✕"}</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                  </div>
                )}
              </div>
            ) : null;
          })()}

          {/* Auto-add toggle for future feature */}
          {shopFilter === "need" && shopNeed.length > 0 && (
            <div className="flex items-center gap-1.5 bg-yellow-900/20 border border-yellow-800 rounded px-1.5 py-1">
              <span className="text-[10px] font-bold" style={{color:"#FFC52F"}}>{shopNeed.length} need</span>
              <span className="text-[9px] text-gray-500">${shopNeed.reduce(function(sum, r) { return sum + (parseFloat(r.parsed.totalPrice || r.parsed.price) || 0); }, 0).toFixed(2)}</span>
              <div className="ml-auto flex items-center gap-1">
                <span className="text-[9px] text-yellow-400/60 italic">Auto-add on purchase</span>
                <button onClick={function(){ setAutoAddEnabled(!autoAddEnabled); }} className={"w-7 h-3.5 rounded-full relative transition-colors " + (autoAddEnabled ? "bg-green-500" : "bg-gray-600")} title="Coming soon: automatically mark cards as owned when purchased on COMC">
                  <span className={"absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all " + (autoAddEnabled ? "left-3.5" : "left-0.5")} />
                </button>
                <span className="text-[8px] text-gray-500 px-0.5 bg-gray-800 rounded">SOON</span>
              </div>
            </div>
          )}

          {shopSorted.length === 0 && (
            <div className="text-center text-gray-500 text-[10px] py-2">{shopFilter === "need" ? "You own everything listed!" : "No results."}</div>
          )}

          {shopSorted.length > 0 && (
            <div className="overflow-x-auto rounded border border-gray-700 mb-16">
              <table className="w-full" style={{fontSize:"10px"}}>
                <thead>
                  <tr className="bg-gray-800 text-gray-400 border-b border-gray-700">
                    <th className="px-0.5 py-0.5 text-left w-5"></th>
                    <th onClick={function(){toggleShopSort("year");}} className="px-0.5 py-0.5 text-left cursor-pointer hover:text-white select-none whitespace-nowrap">Yr{sortArrow("year")}</th>
                    <th onClick={function(){toggleShopSort("product");}} className="px-0.5 py-0.5 text-left cursor-pointer hover:text-white select-none">Product{sortArrow("product")}</th>
                    <th onClick={function(){toggleShopSort("variant");}} className="px-0.5 py-0.5 text-left cursor-pointer hover:text-white select-none">Var{sortArrow("variant")}</th>
                    <th onClick={function(){toggleShopSort("cardNo");}} className="px-0.5 py-0.5 text-left cursor-pointer hover:text-white select-none whitespace-nowrap">#{sortArrow("cardNo")}</th>
                    <th onClick={function(){toggleShopSort("sn");}} className="px-0.5 py-0.5 text-left cursor-pointer hover:text-white select-none whitespace-nowrap">SN{sortArrow("sn")}</th>
                    <th onClick={function(){toggleShopSort("price");}} className="px-0.5 py-0.5 text-right cursor-pointer hover:text-white select-none whitespace-nowrap">Price{sortArrow("price")}</th>
                    <th onClick={function(){toggleShopSort("score");}} className="px-0.5 py-0.5 text-center cursor-pointer hover:text-white select-none whitespace-nowrap">M{sortArrow("score")}</th>
                    <th className="px-0.5 py-0.5 text-center whitespace-nowrap">C E T</th>
                  </tr>
                </thead>
                <tbody>
                  {shopSorted.map(function(item, idx) {
                    var p = item.parsed;
                    var m = item.match;
                    var isExact = m && m.score >= 80;
                    var cardStatus = isExact ? (statuses[m.card.id] || "not_owned") : null;
                    var isNeed = cardStatus === "not_owned";
                    var isApplied = isExact && applied[parsed.indexOf(item)];
                    var origIdx = parsed.indexOf(item);
                    var isExp = expanded[origIdx];
                    var bidKey = (p.rawSet || "").trim();
                    var hasBid = bidKey && ebayBids[bidKey];
                    // Target detection: check by cardId and by title
                    var isTargeted = false;
                    var targetMatch = null;
                    if (isExact && targetByCardId[m.card.id]) { isTargeted = true; targetMatch = targetByCardId[m.card.id][0]; }
                    if (!isTargeted && bidKey) { var tTitleKey = bidKey.toLowerCase().replace(/[^a-z0-9]/g, ""); if (targetByTitle[tTitleKey]) { isTargeted = true; targetMatch = targetByTitle[tTitleKey][0]; } }
                    var isWatching = isTargeted && targetMatch && targetMatch.status === "watching";
                    var isActiveTarget = isTargeted && targetMatch && targetMatch.status === "active";
                    // Price drop detection for ALL targeted cards (active and watching)
                    var hasPriceDrop = false;
                    var priceDropAmt = 0;
                    if (isTargeted && targetMatch) {
                      var benchmarkPrice = targetMatch.watchPrice || parseFloat(targetMatch.price) || 0;
                      if (benchmarkPrice > 0) {
                        var currentTotal = parseFloat(p.totalPrice || p.price) || 0;
                        if (currentTotal > 0 && currentTotal < benchmarkPrice) {
                          hasPriceDrop = true;
                          priceDropAmt = benchmarkPrice - currentTotal;
                        }
                      }
                    }
                    var isPriceDrop = hasPriceDrop && !seenDrops[origIdx];
                    var rowBg = isPriceDrop ? "bg-amber-900/30 border-l-2 border-l-amber-400"
                      : isWatching ? "bg-gray-800/30 opacity-40 border-l-2 border-l-gray-500"
                      : isActiveTarget ? "bg-pink-900/20 border-l-2 border-l-pink-500"
                      : hasBid ? "bg-gray-800/30 opacity-40"
                      : !isExact ? "bg-gray-800/40"
                      : isApplied ? "bg-green-900/10 opacity-50"
                      : isNeed ? "bg-green-900/20"
                      : "bg-blue-900/15 opacity-60";
                    var badge = !isExact ? { text: "N/A", color: "bg-red-900 text-red-300" }
                      : isPriceDrop ? { text: "\u2193$" + priceDropAmt.toFixed(0), color: "bg-amber-500 text-gray-900 font-black" }
                      : isWatching ? { text: "\uD83D\uDC41", color: "bg-gray-700 text-gray-300" }
                      : isActiveTarget ? { text: "\uD83C\uDFAF", color: "bg-pink-700 text-pink-200" }
                      : hasBid ? { text: "BID", color: "bg-orange-800 text-orange-200" }
                      : isApplied ? { text: "\u2713", color: "bg-green-800 text-green-300" }
                      : isNeed ? { text: "NEED", color: "bg-green-600 text-white" }
                      : cardStatus === "owned" ? { text: "OWN", color: "bg-green-800 text-green-200" }
                      : { text: "TRNS", color: "bg-emerald-800 text-emerald-200" };

                    return (
                      <React.Fragment key={origIdx}>
                        <tr className={"border-b border-gray-800 hover:bg-gray-700/30 cursor-pointer " + rowBg} onClick={function(){ toggleExpand(origIdx); }}>
                          <td className="px-0.5 py-0.5 text-center">
                            <span className={"inline-block px-0.5 py-0 rounded text-[8px] font-bold " + badge.color}>{badge.text}</span>
                          </td>
                          <td className="px-0.5 py-0.5 text-gray-500 ">{("'" + String(p.year).slice(-2))}</td>
                          <td className="px-0.5 py-0.5 text-gray-500 truncate" style={{fontSize:"8px",maxWidth:"clamp(60px,8vw,120px)"}} title={isExact ? m.card.product : p.product}>{isExact ? m.card.product.replace(/^\d{4}\s*/, "") : p.product}</td>
                          <td className="px-0.5 py-0.5 text-gray-300 truncate" style={{maxWidth:"clamp(90px,12vw,200px)"}} title={isExact ? m.card.cardSet + (p.variant && p.variant !== (m.card.cardSet || "Base") ? " (listing: " + p.variant + ")" : "") : p.variant}>{isExact ? (m.card.cardSet || "Base") : (p.variant || "Base")}{isExact && sspBadge(m.card.cardSet)}{p.isAuto ? <span className="ml-0.5 text-yellow-400 text-[8px] font-bold bg-yellow-900/50 px-0.5 rounded">AU</span> : ""}{p.graded ? <span className="ml-0.5 text-pink-400 text-[8px] font-bold bg-pink-900/50 px-0.5 rounded">{p.graded}</span> : ""}</td>
                          <td className="px-0.5 py-0.5 font-mono whitespace-nowrap">{isExact ? <span className="text-gray-400">{m.card.cardNumber}</span> : (p.cardNoClean || p.cardNo ? <span className="text-gray-400">{p.cardNoClean || p.cardNo}</span> : "")}</td>
                          <td className="px-0.5 py-0.5 font-mono whitespace-nowrap">{p.serial ? <span className="text-yellow-300 font-bold bg-yellow-900/30 px-0.5 rounded">{"#" + p.serial}</span> : ""}{p.printRun ? <span className="text-purple-400 font-bold">{"/" + p.printRun}</span> : (isExact && m.card.copies ? <span className="text-purple-400/60">{"/" + m.card.copies}</span> : "")}</td>
                          <td className={"px-0.5 py-0.5 text-right font-bold whitespace-nowrap " + (isNeed ? "text-green-300" : "text-gray-500")} style={{fontSize:"10px"}}>{p.listingType === "auction" ? <span className="text-red-400" style={{fontSize:"7px"}} title={"Auction - " + (p.bids || 0) + " bids"}>{"\uD83D\uDD28"}</span> : p.listingType === "best_offer" ? <span className="text-cyan-400" style={{fontSize:"7px"}} title="Best Offer">{"\uD83E\uDD1D"}</span> : ""}{p.source === "eBay" ? (p.totalPrice ? "$" + p.totalPrice : p.price ? "$" + p.price : "") : p.price ? "$" + p.price : ""}{p.source === "eBay" && p.shippingNum > 0 ? <span className="text-gray-600 block" style={{fontSize:"8px"}}>{"+$" + p.shippingNum.toFixed(2)}</span> : ""}{p.source === "SportLots" && p.slQuantity ? <span className="text-blue-400 block" style={{fontSize:"8px"}}>{"x" + p.slQuantity}</span> : ""}{p.source === "Whatnot" && p.seller ? <span className="text-violet-400 block" style={{fontSize:"8px"}}>{p.seller}</span> : ""}{p.currency === "GBP" ? <span className="text-gray-600 block" style={{fontSize:"7px"}}>GBP</span> : ""}{p.source === "130point" && p._130pt ? <span className={p._130pt.forSale ? "text-lime-400 block" : "text-teal-500 block"} style={{fontSize:"7px"}} title={p._130pt.forSale ? "For Sale - ends " + p._130pt.date : p._130pt.isBestOffer ? "Listed $" + (p._130pt.listPrice||0).toFixed(2) + " sold $" + p._130pt.salePrice.toFixed(2) : "Fixed price"}>{p._130pt.forSale ? "\uD83C\uDFF7\uFE0F" : ""}{p._130pt.forSale ? "" : p._130pt.date}{p._130pt.isBestOffer && !p._130pt.forSale ? " -" + p._130pt.discount + "%" : ""}</span> : ""}</td>
                          <td className="px-0.5 py-0.5 text-center">
                            {isExact ? <span className={"text-[9px] font-bold " + (m.variantMismatch ? "text-yellow-400" : "text-green-400")}>{(m.override ? "\ud83d\udccc" : m.score + "%" + (m.variantMismatch ? "\u26a0" : ""))}</span> : m ? <span className="text-[9px] text-red-400">~{m.score}%</span> : <span className="text-gray-600 text-[9px]">-</span>}
                          </td>
                          <td className="px-0.5 py-0.5 text-center" onClick={function(e){e.stopPropagation();}}>
                            <span className="flex gap-0.5 justify-center items-center" style={{fontSize:"9px"}}>
                              {isExact && <a href={comcUrl(m.card)} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-200 font-bold" title="COMC">C</a>}
                              {isExact && <a href={ebayUrl(m.card)} target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-200 font-bold" title="eBay">E</a>}
                              {isExact && <a href={tcdbUrl(m.card)} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-200 font-bold" title="TCDB">T</a>}
                              {isExact && <a href={sportLotsUrl()} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-200 font-bold" title="SportLots">S</a>}
                              {isExact && <a href={whatnotUrl()} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-200 font-bold" title="Whatnot">W</a>}
                              {isExact && <a href={pt130Url(m.card)} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-200 font-bold" title="130point">P</a>}
                              {/* Inline target toggle: cycles not targeted → active → watching → untargeted */}
                              {isExact && isNeed && !isApplied && !hasBid && <button onClick={function(){ applyMatch(origIdx); }} className="ml-0.5 px-1 py-0 bg-yellow-700 hover:bg-yellow-600 text-white rounded font-bold" style={{fontSize:"8px"}}>+</button>}
                              {isApplied && <span className="text-green-400 font-bold" style={{fontSize:"8px"}}>✓</span>}
                              {!isExact && <button onClick={function(){ openAddForm(origIdx); }} className="px-1 py-0 bg-yellow-700 hover:bg-yellow-600 text-white rounded font-bold" style={{fontSize:"8px"}}>Pick</button>}
                              {(isNeed || !isExact) && !isTargeted && <button onClick={function(e){ e.stopPropagation(); addTarget(p, m, "active"); }} className="text-pink-400/40 hover:text-pink-300 font-bold" style={{fontSize:"9px"}} title="Pin as target">{"\uD83C\uDFAF"}</button>}
                              {isActiveTarget && <button onClick={function(e){ e.stopPropagation(); toggleTargetStatus(targetMatch.id); }} className="text-pink-400 font-bold" style={{fontSize:"9px"}} title="Click: switch to watching">{"\uD83C\uDFAF"}</button>}
                              {isWatching && <button onClick={function(e){ e.stopPropagation(); removeTarget(targetMatch.id); }} className="text-gray-400 font-bold" style={{fontSize:"9px"}} title="Click: unpin target">{"\uD83D\uDC41"}</button>}
                              {p.source === "eBay" && isExact && isNeed && (p.listingType === "auction" || p.listingType === "best_offer") && <button onClick={function(e){ e.stopPropagation(); var bk = (p.rawSet || "").trim(); if (!bk) return; var b = loadEbayBids(); if (b[bk]) { delete b[bk]; } else { b[bk] = { date: new Date().toISOString().slice(0,10) }; } saveEbayBids(b); setEbayBids(Object.assign({}, b)); }} className={"px-1 py-0 rounded font-bold " + (hasBid ? "bg-orange-700 text-orange-100" : "bg-gray-700 text-orange-400 hover:bg-orange-800")} style={{fontSize:"7px"}} title={hasBid ? "Click to un-bid" : "Mark as bid placed"}>{hasBid ? "BID" : "Bid"}</button>}
                            </span>
                          </td>
                        </tr>
                        {/* Listing title row - always visible */}
                        <tr className={"border-b border-gray-800/30 " + rowBg} onClick={function(){ toggleExpand(origIdx); }} style={{cursor:"pointer"}}>
                          <td colSpan={9} className="pl-6 pr-1 py-0 truncate" style={{fontSize:"8px",maxWidth:"0",lineHeight:"1.3"}}>
                            <span className="text-gray-600 italic">{p.rawSet}</span>
                          </td>
                        </tr>
                        {isExp && (
                          <tr className={"border-b border-gray-700 " + rowBg}>
                            <td colSpan={9} className="px-2 py-1">
                              {hasPriceDrop && (
                                <div className="mb-1 px-2 py-0.5 rounded bg-amber-900/50 border border-amber-500 text-amber-200 font-bold" style={{fontSize:"10px"}}>
                                  {"\u2193"} Price drop! Was ${(targetMatch.watchPrice || parseFloat(targetMatch.price) || 0).toFixed(2)} when watched — now ${(parseFloat(p.totalPrice || p.price) || 0).toFixed(2)} (save ${priceDropAmt.toFixed(2)})
                                </div>
                              )}
                              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5" style={{fontSize:"10px"}}>
                                <div>
                                  <span className="text-gray-500">Full listing: </span>
                                  <span className="text-gray-300">{p.rawSet}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Print run: </span>
                                  <span className="text-gray-300">{p.printRun ? "/" + p.printRun : "N/A"}</span>
                                </div>
                                {p.source === "eBay" && (
                                  <React.Fragment>
                                    <div>
                                      <span className="text-gray-500">Shipping: </span>
                                      <span className="text-gray-300">{p.shipping || "N/A"}</span>
                                      <span className="text-yellow-400 ml-2 font-bold">{"Total: $" + p.totalPrice}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Time left: </span>
                                      <span className="text-gray-300">{p.timeLeft || "N/A"}</span>
                                      {p.listingType === "auction" && <span className="ml-1 text-red-400">{"" + (p.bids || 0) + " bids"}</span>}
                                      {p.listingType === "bin" && <span className="ml-1 text-green-400">BIN</span>}
                                      {p.listingType === "best_offer" && <span className="ml-1 text-cyan-400">(OBO)</span>}
                                    </div>
                                    {p.graded && <div><span className="text-gray-500">Graded: </span><span className="text-purple-400 font-bold">{p.graded}</span></div>}
                                    {p.isAuto && <div><span className="text-gray-500">Auto: </span><span className="text-yellow-400 font-bold">Yes - Autograph</span></div>}
                                    {p.binPrice && <div><span className="text-gray-500">BIN Price: </span><span className="text-green-300">{"$" + p.binPrice}</span></div>}
                                  </React.Fragment>
                                )}
                                {p.source === "SportLots" && (
                                  <React.Fragment>
                                    <div>
                                      <span className="text-gray-500">Available from: </span>
                                      <span className="text-blue-300 font-bold">{p.slQuantity || "?"} seller{p.slQuantity !== "1" ? "s" : ""}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Low price: </span>
                                      <span className="text-green-300 font-bold">{p.price ? "$" + p.price : "N/A"}</span>
                                    </div>
                                  </React.Fragment>
                                )}
                                {p.source === "Whatnot" && (
                                  <React.Fragment>
                                    <div>
                                      <span className="text-gray-500">Seller: </span>
                                      <span className="text-violet-300 font-bold">{p.seller || "Unknown"}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Price: </span>
                                      <span className="text-green-300 font-bold">{p.price ? (p.currency === "GBP" ? "£" : "$") + p.price : "N/A"}</span>
                                    </div>
                                  </React.Fragment>
                                )}
                                {isExact && (
                                  <div>
                                    <span className="text-gray-500">Matched to: </span>
                                    <span className="text-cyan-300">{"#" + m.card.id + " - " + m.card.product + " " + m.card.cardSet + " #" + m.card.cardNumber}</span>
                                    {m.override && <span className="ml-1 text-yellow-400 text-[9px]">{"pinned"}</span>}
                                  </div>
                                )}
                                {isExact && (
                                  <div>
                                    <span className="text-gray-500">DB Status: </span>
                                    <span className={cardStatus === "owned" ? "text-green-300" : cardStatus === "in_transit" ? "text-emerald-300" : "text-red-400"}>
                                      {cardStatus === "owned" ? "Owned" : cardStatus === "in_transit" ? "In Transit" : "Not Owned"}
                                    </span>
                                  </div>
                                )}
                                {!isExact && m && (
                                  <div className="col-span-2">
                                    <span className="text-gray-500">Closest candidate: </span>
                                    <span className="text-yellow-400/70">{"#" + m.card.id + " - " + m.card.product + " " + m.card.cardSet + " #" + m.card.cardNumber}</span>
                                    <span className="text-red-400/60 ml-1">(variant mismatch)</span>
                                  </div>
                                )}
                                {!isExact && !m && (
                                  <div className="col-span-2">
                                    <span className="text-red-400/60">No matching card found in database.</span>
                                  </div>
                                )}
                                {/* Compact action bar */}
                                <div className="col-span-2 mt-1 flex gap-0.5 flex-wrap items-center" style={{fontSize:"9px"}}>
                                  {/* Site links - logo styled */}
                                  {p.source === "eBay" && p.rawSet && <a href={"https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(p.rawSet)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-[9px] px-1 py-0 bg-yellow-500/20 border border-yellow-500/60 text-yellow-200 rounded hover:bg-yellow-500/40 font-bold no-underline" title="Search this exact title on eBay">{"\uD83D\uDD0D Title"}</a>}
                                  {isExact && <a href={comcUrl(m.card)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[9px] px-1 py-0 rounded font-bold no-underline" style={{background:"#8b1a1a",borderWidth:1,borderColor:"#c62828",color:"#ffcdd2"}} title="Open on COMC">COMC</a>}
                                  {isExact && <a href={ebayUrl(m.card)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[9px] px-1 py-0 rounded font-bold no-underline" style={{background:"#1a3a6b",borderWidth:1,borderColor:"#3b82f6",color:"#93c5fd"}} title="Search this card on eBay">eBay</a>}
                                  {isExact && <a href={tcdbUrl(m.card)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[9px] px-1 py-0 rounded font-bold no-underline" style={{background:"#7c3600",borderWidth:1,borderColor:"#c2410c",color:"#fed7aa"}} title="View on TCDB">TCDB</a>}
                                  {isExact && <a href={pt130Url(m.card)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[9px] px-1 py-0 rounded font-bold no-underline" style={{background:"#134e4a",borderWidth:1,borderColor:"#2dd4bf",color:"#99f6e4"}} title="130point sold prices">130pt</a>}
                                  {isExact && <a href={tcdbSearchUrl(m.card)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-[9px] px-1 py-0 rounded font-bold no-underline" style={{background:"#7c3600",borderWidth:1,borderColor:"#c2410c",color:"#fed7aa",opacity:0.7}} title="View all variants of this card on TCDB">Set <span className="text-[7px] bg-yellow-600 text-black px-0.5 rounded font-bold">WIP</span></a>}
                                  {isExact && <button onClick={function(e){ e.stopPropagation(); setDetailedCardId(m.card.id); setActiveTab("detailed"); }} className="inline-flex items-center text-[9px] px-1 py-0 bg-purple-900/50 border border-purple-500/60 text-purple-300 rounded hover:bg-purple-800/50 font-bold" title="Open in Detailed tab">Detail</button>}
                                  {/* Divider */}
                                  <span style={{color:"#2a3f5f"}}>|</span>
                                  {/* Actions */}
                                  <button onClick={function(e){ e.stopPropagation(); var txt = p.rawSet || (p.year + " " + p.product + " " + (p.variant || "Base") + " #" + (p.cardNo || "")); navigator.clipboard.writeText(txt).then(function(){}); var btn = e.target; btn.textContent = "\u2714"; setTimeout(function(){ btn.textContent = "\uD83D\uDCCB"; }, 1200); }} className="text-[9px] px-1 py-0 bg-gray-700/60 border border-gray-600 text-gray-300 rounded hover:bg-gray-600/60" title="Copy listing title">{"\uD83D\uDCCB"}</button>
                                  <button onClick={function(e){ e.stopPropagation(); var key = (p.rawSet || "").trim(); if (!key) return; var bl = loadEbayBlocked(); bl[key] = { date: new Date().toISOString().slice(0,10), reason: "flagged" }; saveEbayBlocked(bl); setEbayBlocked(Object.assign({}, bl)); }} className="text-[9px] px-1 py-0 bg-red-900/40 border border-red-700 text-red-400 rounded hover:bg-red-800/40" title="Block this listing">{"\uD83D\uDEAB"}</button>
                                  {m && !m.override && isExact && <button onClick={function(e){ e.stopPropagation(); openAddForm(origIdx); }} className="text-[9px] px-1 py-0 bg-gray-800/40 border border-gray-600 text-gray-400 rounded hover:bg-gray-700/40" title="Reassign to different card">{"\u21C4"}</button>}
                                  {m && m.override && <button onClick={function(e){ e.stopPropagation(); var ck = pinKey(p); var ov = loadComcOverrides(); delete ov[ck]; saveComcOverrides(ov); setComcOverrides(Object.assign({}, ov)); var up = parsed.map(function(r, ri){ if (ri === origIdx) { var nm = matchToCards(r.parsed); return { parsed: r.parsed, match: nm, raw: r.raw }; } return r; }); setParsed(up); }} className="text-[9px] px-1 py-0 bg-red-900/40 border border-red-700 text-red-300 rounded hover:bg-red-800/40" title="Unpin match">{"\uD83D\uDCCC"}</button>}
                                  {/* Status actions */}
                                  {isExact && isNeed && !isApplied && !hasBid && (
                                    <React.Fragment>
                                      <span style={{color:"#2a3f5f"}}>|</span>
                                      <button onClick={function(e){ e.stopPropagation(); applyMatchTransit(origIdx); }} className="text-[9px] px-1 py-0 bg-cyan-700 hover:bg-cyan-600 text-white rounded font-bold" title="Mark as In-Transit">{"\uD83D\uDCE6 Transit"}</button>
                                      <button onClick={function(e){ e.stopPropagation(); applyMatch(origIdx); }} className="text-[9px] px-1 py-0 bg-yellow-700 hover:bg-yellow-600 text-white rounded font-bold" title="Mark as Owned">{"\u2714 Own"}</button>
                                    </React.Fragment>
                                  )}
                                  {p.source === "eBay" && isExact && isNeed && (p.listingType === "auction" || p.listingType === "best_offer") && (
                                    <React.Fragment>
                                      <span style={{color:"#2a3f5f"}}>|</span>
                                      <button onClick={function(e){ e.stopPropagation(); var bk = (p.rawSet || "").trim(); if (!bk) return; var b = loadEbayBids(); if (b[bk]) { delete b[bk]; } else { b[bk] = { date: new Date().toISOString().slice(0,10) }; } saveEbayBids(b); setEbayBids(Object.assign({}, b)); }} className={"text-[9px] px-1 py-0 rounded font-bold " + (hasBid ? "bg-orange-600 text-orange-100" : "bg-orange-900/40 border border-orange-700 text-orange-300 hover:bg-orange-800/40")}>{hasBid ? "\uD83D\uDD28 Bid Placed" : "\uD83D\uDD28 Bid"}</button>
                                    </React.Fragment>
                                  )}
                                  {/* Target actions */}
                                  <span style={{color:"#2a3f5f"}}>|</span>
                                  {!isTargeted && (isNeed || !isExact) && (
                                    <React.Fragment>
                                      <button onClick={function(e){ e.stopPropagation(); addTarget(p, m, "active"); }} className="text-[9px] px-1 py-0 bg-pink-900/40 border border-pink-600 text-pink-300 rounded hover:bg-pink-800/40 font-bold" title="Save as active target - want to buy">{"\uD83C\uDFAF Target"}</button>
                                      <button onClick={function(e){ e.stopPropagation(); addTarget(p, m, "watching"); }} className="text-[9px] px-1 py-0 bg-gray-800/40 border border-gray-600 text-gray-400 rounded hover:bg-gray-700/40" title="Save as watching - too expensive for now">{"\uD83D\uDC41 Watch"}</button>
                                    </React.Fragment>
                                  )}
                                  {isTargeted && (
                                    <React.Fragment>
                                      <button onClick={function(e){ e.stopPropagation(); toggleTargetStatus(targetMatch.id); }} className={"text-[9px] px-1 py-0 rounded font-bold " + (isWatching ? "bg-pink-900/40 border border-pink-600 text-pink-300 hover:bg-pink-800/40" : "bg-gray-800/40 border border-gray-600 text-gray-400 hover:bg-gray-700/40")} title={isWatching ? "Make active target" : "Move to watching"}>{isWatching ? "\uD83C\uDFAF Active" : "\uD83D\uDC41 Watch"}</button>
                                      <button onClick={function(e){ e.stopPropagation(); removeTarget(targetMatch.id); }} className="text-[9px] px-1 py-0 bg-red-900/30 border border-red-700 text-red-400 rounded hover:bg-red-800/30" title="Remove from targets">{"\u2715 Untarget"}</button>
                                    </React.Fragment>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                        {addingIdx === origIdx && (
                          <tr className="border-b border-yellow-700 bg-yellow-950/20">
                            <td colSpan={9} className="px-3 py-2" onClick={function(e){e.stopPropagation();}}>
                              <div className="text-[11px] space-y-1.5">
                                {/* Header row */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-yellow-300 font-bold text-xs">
                                      {showAddDbForm ? "Add New Card to DB" : "Pick Matching Card"}
                                    </span>
                                  </div>
                                  <div className="flex gap-1.5">
                                    {p.source === "eBay" && p.rawSet && <a href={"https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(p.rawSet)} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-yellow-600/40 border border-yellow-500 text-yellow-200 rounded text-[10px] hover:bg-yellow-500/40 font-bold no-underline">{"\uD83D\uDD0D eBay"}</a>}
                                    {!showAddDbForm && <button onClick={function(){setShowAddDbForm(true);}} className="px-2 py-0.5 bg-purple-800 hover:bg-purple-700 text-purple-200 rounded text-[10px]">+ New Card</button>}
                                    {showAddDbForm && <button onClick={function(){setShowAddDbForm(false);}} className="px-2 py-0.5 bg-yellow-800 hover:bg-yellow-700 text-yellow-200 rounded text-[10px]">Back to List</button>}
                                    <button onClick={function(){setAddingIdx(null);setShowAddDbForm(false);}} className="px-2 py-0.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-[10px]">Close</button>
                                  </div>
                                </div>
                                {/* Show listing title for reference */}
                                <div className="bg-gray-800/50 rounded px-2 py-1 text-[10px]">
                                  <span className="text-gray-500">Listing: </span>
                                  <span className="text-yellow-200/80">{p.rawSet || (p.year + " " + p.product + " " + (p.variant || "Base") + " #" + (p.cardNo || "?"))}</span>
                                  {p.isAuto && <span className="ml-1.5 text-yellow-400 text-[8px] font-bold bg-yellow-900/50 px-0.5 rounded">AU</span>}
                                  {(p.serial || p.printRun) && <span className="ml-1.5 text-purple-300 text-[8px] font-bold bg-purple-900/50 px-0.5 rounded">{p.serial ? "#" + p.serial : ""}{p.printRun ? "/" + p.printRun : ""}</span>}
                                  {p.graded && <span className="ml-1.5 text-pink-400 text-[8px] font-bold bg-pink-900/50 px-0.5 rounded">{p.graded}</span>}
                                </div>
                                {!showAddDbForm && (
                                  <div>
                                    {/* Search / filter row */}
                                    <div className="flex items-center gap-2 mt-1 mb-1 flex-wrap">
                                      <span className="text-gray-500 text-[10px]">Card #:</span>
                                      <input value={addForm.cardNoFilter || ""} onChange={function(e){setAddForm(Object.assign({},addForm,{cardNoFilter:e.target.value}));}} placeholder="Filter #" className="bg-gray-800 border border-gray-600 rounded px-1.5 py-0.5 text-gray-200 text-[10px] w-16" />
                                      {addForm.cardNoFilter && <button onClick={function(){setAddForm(Object.assign({},addForm,{cardNoFilter:""}));}} className="text-gray-500 hover:text-gray-300 text-[10px]">✕</button>}
                                      <span className="text-gray-600 text-[10px]">|</span>
                                      <span className="text-gray-500 text-[10px]">Search:</span>
                                      <input value={addForm.textSearch || ""} onChange={function(e){setAddForm(Object.assign({},addForm,{textSearch:e.target.value}));}} placeholder="product, variant, year..." className="bg-gray-800 border border-gray-600 rounded px-1.5 py-0.5 text-gray-200 text-[10px] flex-1 min-w-[120px]" />
                                      {addForm.textSearch && <button onClick={function(){setAddForm(Object.assign({},addForm,{textSearch:""}));}} className="text-gray-500 hover:text-gray-300 text-[10px]">✕</button>}
                                      <span className="text-gray-600 text-[10px] ml-auto">{(function(){
                                        var src = addForm.textSearch ? cards : addForm.candidates;
                                        var f = addForm.cardNoFilter ? src.filter(function(c){ return c.cardNumber.trim() === addForm.cardNoFilter.trim(); }).length : src.length;
                                        return f + (addForm.textSearch ? " (all DB)" : " of " + addForm.candidates.length);
                                      })()}</span>
                                    </div>
                                    {(function(){
                                      var filtered;
                                      if (addForm.textSearch) {
                                        var terms = addForm.textSearch.toLowerCase().split(/\s+/).filter(function(t){ return t.length > 0; });
                                        filtered = cards.filter(function(c) {
                                          var haystack = (c.product + " " + c.cardSet + " " + c.cardNumber).toLowerCase();
                                          for (var ti = 0; ti < terms.length; ti++) {
                                            if (haystack.indexOf(terms[ti]) === -1) return false;
                                          }
                                          return true;
                                        }).slice(0, 80);
                                      } else {
                                        filtered = addForm.candidates;
                                      }
                                      if (addForm.cardNoFilter) {
                                        var fv = addForm.cardNoFilter.trim();
                                        filtered = filtered.filter(function(c){ return c.cardNumber.trim() === fv; });
                                      }
                                      if (filtered.length > 0) return (
                                      <div className="max-h-56 overflow-y-auto space-y-0.5">
                                        {filtered.map(function(cand) {
                                          var cStatus = statuses[cand.id] || "not_owned";
                                          var statusColor = cStatus === "owned" ? "text-green-300" : cStatus === "in_transit" ? "text-emerald-300" : "text-gray-400";
                                          var statusLabel = cStatus === "owned" ? "OWN" : cStatus === "in_transit" ? "TRNS" : "";
                                          var candIsAuto = cand.isAuto === "Yes" || /autograph|auto|signature/i.test(cand.cardSet || "");
                                          return (
                                            <div key={cand.id} className="flex items-center gap-1.5 bg-gray-800/60 rounded px-2 py-1 hover:bg-gray-700/60">
                                              {statusLabel ? <span className={"text-[8px] font-bold px-1 rounded " + (cStatus === "owned" ? "bg-green-900/60 text-green-300" : cStatus === "in_transit" ? "bg-emerald-900/60 text-emerald-300" : "bg-red-900/60 text-red-400")}>{statusLabel}</span> : <span className="text-[8px] text-gray-600 w-5"></span>}
                                              <span className="text-gray-500 font-mono text-[10px] w-12 flex-shrink-0">#{cand.cardNumber}</span>
                                              {addForm.textSearch && <span className="text-gray-500 text-[10px] w-10 flex-shrink-0">{String(cand.product).slice(0,4)}</span>}
                                              {addForm.textSearch && <span className="text-gray-600 text-[10px] max-w-[80px] truncate flex-shrink-0" title={cand.product}>{String(cand.product).slice(5)}</span>}
                                              <span className="text-gray-200 flex-1 truncate">{cand.cardSet || "Base"}</span>
                                              {cand.copies && <span className="text-purple-400 font-bold text-[10px] flex-shrink-0">{"/" + cand.copies}</span>}
                                              {candIsAuto && <span className="text-yellow-400 text-[8px] font-bold bg-yellow-900/50 px-0.5 rounded flex-shrink-0">AU</span>}
                                              <button onClick={function(){ assignCandidate(origIdx, cand); }} className="px-2 py-0.5 bg-green-700 hover:bg-green-600 text-white rounded text-[10px] font-bold flex-shrink-0">Assign</button>
                                            </div>
                                          );
                                        })}
                                      </div>
                                      );
                                      return (<div className="text-gray-500 text-[10px] mt-1">
                                        {addForm.textSearch ? "No matches for \"" + addForm.textSearch + "\"" : "No candidates for #" + (addForm.cardNoFilter || "?") + " in " + addForm.year + " " + addForm.product + "."}
                                        {addForm.cardNoFilter && <button onClick={function(){setAddForm(Object.assign({},addForm,{cardNoFilter:""}));}} className="text-yellow-400 hover:text-yellow-300 underline ml-1">Clear # filter</button>}
                                        {!addForm.textSearch && <span className="text-gray-600 ml-1">Try the Search box to search all {cards.length} cards.</span>}
                                      </div>);
                                    })()}
                                    <div className="text-[10px] text-gray-600 mt-1.5">Can't find it? Use Search to search all {cards.length} cards, or click "+ New Card" to add it manually.</div>
                                  </div>
                                )}
                                {showAddDbForm && (
                                  <div className="space-y-1.5 mt-1">
                                    <div className="grid grid-cols-4 gap-2">
                                      <div>
                                        <label className="text-gray-500 block mb-0.5">Year</label>
                                        <input value={addForm.year||""} onChange={function(e){setAddForm(Object.assign({},addForm,{year:e.target.value}));}} className="w-full bg-gray-800 border border-gray-600 rounded px-1.5 py-0.5 text-gray-200 text-[11px]" />
                                      </div>
                                      <div>
                                        <label className="text-gray-500 block mb-0.5">Product</label>
                                        <input value={addForm.product||""} onChange={function(e){setAddForm(Object.assign({},addForm,{product:e.target.value}));}} className="w-full bg-gray-800 border border-gray-600 rounded px-1.5 py-0.5 text-gray-200 text-[11px]" />
                                      </div>
                                      <div>
                                        <label className="text-gray-500 block mb-0.5">Variant</label>
                                        <input value={addForm.variant||""} onChange={function(e){setAddForm(Object.assign({},addForm,{variant:e.target.value}));}} className="w-full bg-gray-800 border border-gray-600 rounded px-1.5 py-0.5 text-gray-200 text-[11px]" />
                                      </div>
                                      <div>
                                        <label className="text-gray-500 block mb-0.5">Card #</label>
                                        <input value={addForm.cardNo||""} onChange={function(e){setAddForm(Object.assign({},addForm,{cardNo:e.target.value}));}} className="w-full bg-gray-800 border border-gray-600 rounded px-1.5 py-0.5 text-gray-200 text-[11px]" />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 items-center">
                                      <div>
                                        <label className="text-gray-500 block mb-0.5">Print Run</label>
                                        <input value={addForm.printRun||""} onChange={function(e){setAddForm(Object.assign({},addForm,{printRun:e.target.value}));}} placeholder="e.g. 50" className="w-full bg-gray-800 border border-gray-600 rounded px-1.5 py-0.5 text-gray-200 text-[11px]" />
                                      </div>
                                      <div className="flex items-center gap-3 col-span-3 pt-3">
                                        <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={!!addForm.isAuto} onChange={function(e){setAddForm(Object.assign({},addForm,{isAuto:e.target.checked}));}} className="accent-purple-500" /><span className={"text-[11px] " + (addForm.isAuto ? "text-purple-300 font-bold" : "text-gray-400")}>Auto</span></label>
                                        <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={!!addForm.isMem} onChange={function(e){setAddForm(Object.assign({},addForm,{isMem:e.target.checked}));}} className="accent-purple-500" /><span className={"text-[11px] " + (addForm.isMem ? "text-purple-300 font-bold" : "text-gray-400")}>Mem</span></label>
                                        <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" checked={!!addForm.isRC} onChange={function(e){setAddForm(Object.assign({},addForm,{isRC:e.target.checked}));}} className="accent-purple-500" /><span className={"text-[11px] " + (addForm.isRC ? "text-purple-300 font-bold" : "text-gray-400")}>RC</span></label>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                      <button onClick={function(e){ e.stopPropagation(); handleAddToDb(origIdx); }} className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[10px] font-bold">Confirm Add</button>
                                      <button onClick={function(e){ e.stopPropagation(); setShowAddDbForm(false); }} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-[10px]">Back</button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {parsed.length > 0 && mode !== "shop" && mode !== "ebay" && mode !== "sportlots" && mode !== "whatnot" && mode !== "130pt" && (
        <div>
          <div className="flex items-center gap-2 bg-gray-800 rounded-t-lg px-2 py-1 text-[10px]">
            <span className="text-green-400 font-bold">{highConf.length} high</span>
            <span className="text-yellow-400 font-bold">{lowConf.length} low</span>
            <span className="text-red-400 font-bold">{noMatch.length} none</span>
            <span className="text-cyan-400">{Object.keys(applied).length} applied</span>
            {highConf.length > 0 && <button onClick={applyAll} className="ml-auto text-[10px] px-2 py-0.5 bg-yellow-700 hover:bg-yellow-600 text-white rounded font-bold">Apply All ({highConf.length})</button>}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]" style={{tableLayout:"auto"}}>
              <thead><tr className="bg-gray-800 text-gray-400 border-b border-gray-700">
                <th className="px-0.5 py-0.5 text-left">Match</th>
                <th className="px-0.5 py-0.5 text-left">Listing</th>
                <th className="px-0.5 py-0.5 text-left">Matched Card</th>
                <th className="px-0.5 py-0.5 text-right">$</th>
                <th className="px-0.5 py-0.5 text-center">Status</th>
                <th className="px-0.5 py-0.5 text-center">Action</th>
              </tr></thead>
              <tbody>
                {parsed.map(function(item, idx) {
                  var p = item.parsed;
                  var m = item.match;
                  var isApplied = applied[idx];
                  var currentStatus = m ? (statuses[m.card.id] || "not_owned") : null;
                  return (
                    <tr key={idx} className={"border-b border-gray-800 " + (isApplied ? "opacity-40 " : "") + (!m ? "bg-red-900/15" : m.score >= 85 ? "bg-green-900/10" : "bg-yellow-900/10")}>
                      <td className="px-0.5 py-0.5 whitespace-nowrap">
                        {m ? <span className={"font-bold " + (m.score >= 90 ? "text-green-400" : m.score >= 85 ? "text-green-400" : "text-yellow-400")}>{m.score + "%" + (m.variantMismatch ? "\u26a0" : "")}</span> : <span className="text-red-400">-</span>}
                      </td>
                      <td className="px-0.5 py-0.5 truncate" style={{maxWidth:"clamp(120px,20vw,300px)"}} title={p.rawSet || ""}>
                        <span className="text-gray-300">{p.rawSet || (p.product || "") + " " + (p.variant || "")}</span>
                      </td>
                      <td className="px-0.5 py-0.5 truncate" style={{maxWidth:"clamp(100px,15vw,250px)"}}>
                        {m ? <span className="text-cyan-300">{"#" + m.card.cardNumber + " " + (m.card.cardSet || "Base")}{sspBadge(m.card.cardSet)}</span> : <span className="text-gray-600">—</span>}
                      </td>
                      <td className="px-0.5 py-0.5 text-right text-green-300 font-bold whitespace-nowrap">{p.price ? "$" + p.price : ""}</td>
                      <td className="px-0.5 py-0.5 text-center whitespace-nowrap">
                        {m ? <span className={"font-bold text-[9px] " + (currentStatus === "owned" ? "text-green-300" : currentStatus === "in_transit" ? "text-emerald-300" : "text-red-400")}>{currentStatus === "owned" ? "OWN" : currentStatus === "in_transit" ? "TRNS" : "NEED"}</span> : ""}
                      </td>
                      <td className="px-0.5 py-0.5 text-center">
                        {m && !isApplied ? <button onClick={function(){applyMatch(idx);}} className="px-1 py-0 bg-orange-700 hover:bg-orange-600 text-white rounded text-[9px] font-bold">Own</button> : isApplied ? <span className="text-green-400 text-[9px]">{"\u2713"}</span> : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {parsed.length === 0 && (mode === "ebay" || mode === "sportlots" || mode === "whatnot" || mode === "130pt" || mode === "shop") && rawInput.trim().length > 0 && (
        <div className="text-center text-gray-500 text-xs py-4">No Tyler Black baseball cards found in the pasted text. Try a different source or check that the full page was copied (Ctrl+A, Ctrl+C).</div>
      )}
    </div>
  );
}

function PricesPanel({ cards, statuses, setActiveTab, setDetailedCardId, setDetailedStatusFilter, setDetailedSnFilter, setDetailedProductFilter, setDetailedCardNumFilter }) {
  var [ph, setPh] = useState(function() { return loadPriceHistory(); });
  var [sortBy, setSortBy] = useState("recent");
  var [sortDir, setSortDir] = useState("desc");
  var [sortDir, setSortDir] = useState("desc");
  var [filterSrc, setFilterSrc] = useState("all");
  var [filterStatus, setFilterStatus] = useState("need"); // need, owned, transit, all, flagged
  var [search, setSearch] = useState("");
  var [migrated, setMigrated] = useState(false);
  var [expandedPK, setExpandedPK] = useState(null);
  var [pendingDelete, setPendingDelete] = useState(null);
  var [innerSort, setInnerSort] = useState("date");
  var [innerSortDir, setInnerSortDir] = useState("desc");
  var [innerSort, setInnerSort] = useState("date");
  var [innerSortDir, setInnerSortDir] = useState("desc");
  var [pickerPK, setPickerPK] = useState(null); // priceKey being reassigned
  var [pickSearch, setPickSearch] = useState("");
  var [pickCardNo, setPickCardNo] = useState("");

  // One-time migration: convert old numeric keys + purge bad entries
  useEffect(function() {
    if (migrated) return;
    var raw = loadPriceHistory();
    var changed = false;
    var next = {};
    Object.keys(raw).forEach(function(k) {
      var pk = k;
      if (/^\d+$/.test(k) && CARD_BY_ID[parseInt(k)]) {
        var card = CARD_BY_ID[parseInt(k)];
        pk = card.product.slice(0,4) + "|" + card.product + "|" + card.cardNumber + "|" + (card.cardSet || "Base");
        changed = true;
      }
      // PURGE fully-ambiguous variant keys
      if (AMBIGUOUS_PRICE_KEYS.has(pk)) { changed = true; return; }
      // PURGE eBay entries for 1/1 cards whose variant contains "black" (player surname)
      var pkParts = pk.split("|");
      var pkVariant = pkParts.length >= 4 ? pkParts[3].toLowerCase() : "";
      var pkCopies = "";
      // Find the card for this key to check copies
      var pkCard = null;
      for (var pci = 0; pci < ALL_CARDS.length; pci++) {
        var pc = ALL_CARDS[pci];
        var testPk = pc.product.slice(0,4) + "|" + pc.product + "|" + pc.cardNumber + "|" + (pc.cardSet || "Base");
        if (testPk === pk) { pkCard = pc; break; }
      }
      if (pkCard && pkCard.copies === "1" && /\bblack\b/i.test(pkVariant)) {
        // 1/1 with "black" in variant — only keep non-eBay entries
        var cleanEntries = (raw[k] || []).filter(function(e) { return e.source !== "eBay"; });
        if (cleanEntries.length > 0) {
          next[pk] = cleanEntries;
        }
        changed = true;
        return;
      }
      if (!next[pk]) next[pk] = [];
      raw[k].forEach(function(entry) {
        var exists = next[pk].some(function(e) { return e.date === entry.date && e.source === entry.source; });
        if (!exists) next[pk].push(entry);
      });
    });
    if (changed) { savePriceHistory(next); setPh(next); }
    setMigrated(true);
  }, []);

  function refresh() { setPh(loadPriceHistory()); }

  function reassignPrice(oldPK, newCard) {
    var next = loadPriceHistory();
    var entries = next[oldPK] || [];
    if (entries.length === 0) return;
    var newPK = newCard.product.slice(0,4) + "|" + newCard.product + "|" + newCard.cardNumber + "|" + (newCard.cardSet || "Base");
    if (newPK === oldPK) return; // same card
    // Merge entries into new key
    if (!next[newPK]) next[newPK] = [];
    entries.forEach(function(e) {
      var exists = next[newPK].some(function(x) { return x.date === e.date && x.source === e.source; });
      if (!exists) next[newPK].push(e);
    });
    // Delete old key
    delete next[oldPK];
    savePriceHistory(next);
    setPh(next);

    // NOTE: Scanner COMC overrides (pins) are NOT modified here.
    // Pins should only be changed by scanner actions (Assign/Pick/Unpin).
    // Previously this code blanket-rewrote ALL overrides pointing to old card IDs,
    // which corrupted unrelated pins when reassigning price entries.

    setPickerPK(null);
    setExpandedPK(newPK);
    setPickSearch("");
    setPickCardNo("");
  }

  var cardByPK = useMemo(function() {
    var m = {};
    ALL_CARDS.forEach(function(c) {
      var pk = c.product.slice(0,4) + "|" + c.product + "|" + c.cardNumber + "|" + (c.cardSet || "Base");
      if (!m[pk]) m[pk] = c;
    });
    return m;
  }, []);

  // Build list of all card IDs per priceKey for status checking
  var idsByPK = useMemo(function() {
    var m = {};
    ALL_CARDS.forEach(function(c) {
      var pk = c.product.slice(0,4) + "|" + c.product + "|" + c.cardNumber + "|" + (c.cardSet || "Base");
      if (!m[pk]) m[pk] = [];
      m[pk].push(c.id);
    });
    return m;
  }, []);

  var rows = useMemo(function() {
    var result = [];
    Object.keys(ph).forEach(function(pk) {
      var entries = ph[pk];
      if (!entries || entries.length === 0) return;
      var card = cardByPK[pk];
      if (!card) return;

      // Status: check all card IDs mapped to this priceKey, use "best" status
      var ids = idsByPK[pk] || [card.id];
      var bestStatus = "not_owned";
      for (var si = 0; si < ids.length; si++) {
        var s = statuses[ids[si]] || "not_owned";
        if (s === "owned") { bestStatus = "owned"; break; }
        if (s === "in_transit") bestStatus = "in_transit";
      }

      // Flag suspicious entries: 1/1 at low price from eBay, or variant has ambiguous words
      var hasAmbiguousWord = false;
      var vLow = (card.cardSet || "").toLowerCase();
      var vWords = vLow.replace(/[^a-z0-9 ]/g," ").trim().split(/\s+/);
      for (var aw = 0; aw < vWords.length; aw++) { if (EBAY_AMBIGUOUS_WORDS[vWords[aw]]) { hasAmbiguousWord = true; break; } }
      var hasEbay = entries.some(function(e) { return e.source === "eBay"; });
      var lowestEbay = Infinity;
      entries.forEach(function(e) { if (e.source === "eBay" && e.price < lowestEbay) lowestEbay = e.price; });
      var isFlagged = (hasEbay && hasAmbiguousWord) || (hasEbay && card.copies === "1" && lowestEbay < 50);

      // Status filter
      if (filterStatus === "need" && bestStatus !== "not_owned") return;
      if (filterStatus === "owned" && bestStatus !== "owned") return;
      if (filterStatus === "transit" && bestStatus !== "in_transit") return;
      if (filterStatus === "flagged" && !isFlagged) return;

      // Source filter
      var filtered = filterSrc === "all" ? entries : entries.filter(function(e) { return e.source === filterSrc; });
      if (filtered.length === 0) return;

      // Search
      if (search) {
        var sl = search.toLowerCase();
        var hay = (card.product + " " + card.cardSet + " " + card.cardNumber).toLowerCase();
        if (hay.indexOf(sl) === -1) return;
      }

      var sorted = filtered.slice().sort(function(a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
      var first = sorted[0];
      var last = sorted[sorted.length - 1];
      var delta = sorted.length >= 2 ? last.price - first.price : 0;
      var pct = first.price > 0 && sorted.length >= 2 ? ((last.price - first.price) / first.price * 100) : 0;
      var totalListings = filtered.reduce(function(sum, e) { return sum + (e.listings || 1); }, 0);
      var lowest = Math.min.apply(null, sorted.map(function(e) { return e.price; }));

      result.push({
        pk: pk, card: card, entries: sorted, first: first, last: last,
        delta: delta, pct: pct, status: bestStatus, totalListings: totalListings,
        latestDate: last.date, latestPrice: last.price, lowestPrice: lowest, flagged: isFlagged
      });
    });

    if (sortBy === "recent") result.sort(function(a, b) { return b.latestDate > a.latestDate ? 1 : b.latestDate < a.latestDate ? -1 : 0; });
    else if (sortBy === "drop") result.sort(function(a, b) { return a.delta - b.delta; });
    else if (sortBy === "rise") result.sort(function(a, b) { return b.delta - a.delta; });
    else if (sortBy === "cheapest") result.sort(function(a, b) { return a.lowestPrice - b.lowestPrice; });
    else if (sortBy === "tracked") result.sort(function(a, b) { return b.entries.length - a.entries.length; });
    else if (sortBy === "product") result.sort(function(a, b) { return a.card.product.localeCompare(b.card.product); });
    else if (sortBy === "number") result.sort(function(a, b) { var an = parseInt(a.card.cardNumber), bn = parseInt(b.card.cardNumber); if (!isNaN(an) && !isNaN(bn)) return an - bn; return a.card.cardNumber.localeCompare(b.card.cardNumber); });
    else if (sortBy === "variant") result.sort(function(a, b) { return (a.card.cardSet || "").localeCompare(b.card.cardSet || ""); });
    else if (sortBy === "sn") result.sort(function(a, b) { var ac = parseInt(a.card.copies) || 99999, bc = parseInt(b.card.copies) || 99999; return ac - bc; });
    else if (sortBy === "price") result.sort(function(a, b) { return a.lowestPrice - b.lowestPrice; });
    else if (sortBy === "date") result.sort(function(a, b) { return a.latestDate > b.latestDate ? 1 : a.latestDate < b.latestDate ? -1 : 0; });
    else if (sortBy === "trend") result.sort(function(a, b) { return a.delta - b.delta; });
    if (sortDir === "desc" && sortBy !== "recent" && sortBy !== "rise" && sortBy !== "tracked" && sortBy !== "drop") result.reverse();
    else if (sortBy === "product") result.sort(function(a, b) { return a.card.product.localeCompare(b.card.product); });
    else if (sortBy === "number") result.sort(function(a, b) { var an = parseInt(a.card.cardNumber), bn = parseInt(b.card.cardNumber); if (!isNaN(an) && !isNaN(bn)) return an - bn; return a.card.cardNumber.localeCompare(b.card.cardNumber); });
    else if (sortBy === "variant") result.sort(function(a, b) { return (a.card.cardSet || "").localeCompare(b.card.cardSet || ""); });
    else if (sortBy === "sn") result.sort(function(a, b) { var ac = parseInt(a.card.copies) || 99999, bc = parseInt(b.card.copies) || 99999; return ac - bc; });
    else if (sortBy === "price") result.sort(function(a, b) { return a.lowestPrice - b.lowestPrice; });
    else if (sortBy === "date") result.sort(function(a, b) { return a.latestDate > b.latestDate ? 1 : a.latestDate < b.latestDate ? -1 : 0; });
    else if (sortBy === "trend") result.sort(function(a, b) { return a.delta - b.delta; });
    if (sortDir === "desc" && sortBy !== "recent" && sortBy !== "rise" && sortBy !== "tracked" && sortBy !== "drop") result.reverse();

    return result;
  }, [ph, sortBy, sortDir, filterSrc, filterStatus, search, statuses]);

  var totalEntries = Object.keys(ph).reduce(function(s, k) { return s + (ph[k] ? ph[k].length : 0); }, 0);
  var flaggedCount = useMemo(function() {
    var count = 0;
    Object.keys(ph).forEach(function(pk) {
      var card = cardByPK[pk];
      if (!card) return;
      var entries = ph[pk] || [];
      var hasEbay = entries.some(function(e) { return e.source === "eBay"; });
      if (!hasEbay) return;
      var vLow = (card.cardSet || "").toLowerCase();
      var hasAmb = false;
      vLow.replace(/[^a-z0-9 ]/g," ").trim().split(/\s+/).forEach(function(w) { if (EBAY_AMBIGUOUS_WORDS[w]) hasAmb = true; });
      var lowestEbay = Infinity;
      entries.forEach(function(e) { if (e.source === "eBay" && e.price < lowestEbay) lowestEbay = e.price; });
      if (hasAmb || (card.copies === "1" && lowestEbay < 50)) count++;
    });
    return count;
  }, [ph]);

  // Expanded detail view
  var expandedRow = expandedPK ? rows.find(function(r) { return r.pk === expandedPK; }) : null;

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-2">
        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
          <h3 className="text-indigo-400 font-bold text-sm">Price Scanner <span className="text-[9px] text-gray-500 font-normal ml-1">lowest seen across all scans</span></h3>
          <div className="flex gap-2 text-[9px] text-gray-400">
            <span>{Object.keys(ph).length} cards</span>
            <span>{totalEntries} prices</span>
            <button onClick={refresh} className="px-1 py-0 bg-gray-700 rounded text-gray-300 hover:bg-gray-600">Refresh</button>
          </div>
        </div>
        <div className="flex gap-1.5 items-center flex-wrap">
          <input value={search} onChange={function(e) { setSearch(e.target.value); }} className="bg-gray-900 text-gray-200 text-[10px] p-1 rounded border border-gray-600 w-36" placeholder="Search..." />
          {[["need","Need","red"],["owned","Own","green"],["transit","Transit","cyan"],["all","All","gray"],["flagged","\u26A0 " + flaggedCount,"yellow"]].map(function(f) {
            var active = filterStatus === f[0];
            return <button key={f[0]} onClick={function() { setFilterStatus(f[0]); }} className={"text-[9px] px-1.5 py-0.5 rounded font-bold border " + (active ? "bg-" + f[2] + "-900/60 border-" + f[2] + "-500 text-" + f[2] + "-300" : "bg-gray-800 border-gray-600 text-gray-400")}>{f[1]}</button>;
          })}
          <span className="text-gray-600">|</span>
          {["all", "eBay", "COMC", "SportLots", "Whatnot"].map(function(s) {
            return <button key={s} onClick={function() { setFilterSrc(s); }} className={"text-[9px] px-1.5 py-0.5 rounded font-bold " + (filterSrc === s ? (s === "eBay" ? "bg-yellow-600 text-white" : s === "COMC" ? "bg-green-600 text-white" : s === "Whatnot" ? "bg-violet-600 text-white" : s === "SportLots" ? "bg-blue-600 text-white" : s === "130point" ? "bg-teal-600 text-white" : "bg-indigo-600 text-white") : "bg-gray-700 text-gray-400")}>{s}</button>;
          })}
          <span className="text-gray-600">|</span>
          {[["recent","Recent"],["cheapest","Cheap"],["drop","Drops"],["rise","Rises"],["tracked","Most"]].map(function(s) {
            return <button key={s[0]} onClick={function() { setSortBy(s[0]); setSortDir(s[0] === "cheapest" ? "asc" : "desc"); }} className={"text-[9px] px-1.5 py-0.5 rounded " + (sortBy === s[0] ? "bg-indigo-600 text-white font-bold" : "bg-gray-700 text-gray-400")}>{s[1]}</button>;
          })}
        </div>
      </div>

      {/* Expanded detail view */}
      {expandedRow && (function() {
        var r = expandedRow;
        var c = r.card;
        var statusDot = r.status === "owned" ? "bg-green-500" : r.status === "in_transit" ? "bg-emerald-400" : "bg-red-500";
        var allPrices = r.entries.map(function(e) { return e.price; });
        var minP = Math.min.apply(null, allPrices);
        var maxP = Math.max.apply(null, allPrices);
        var avgP = allPrices.reduce(function(a, b) { return a + b; }, 0) / allPrices.length;
        return (
          <div className="bg-indigo-950/30 rounded-lg border border-indigo-700 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={"w-2.5 h-2.5 rounded-full " + statusDot}></span>
                <div>
                  <span className="text-white font-bold text-xs">{c.product}</span>
                  <span className="text-gray-400 text-[10px] ml-1.5">#{c.cardNumber}</span>
                </div>
              </div>
              <div className="flex gap-1">
                {pendingDelete === r.pk ? (
                  <React.Fragment>
                    <button onClick={function() { var next = loadPriceHistory(); delete next[r.pk]; savePriceHistory(next); setPh(next); setExpandedPK(null); setPendingDelete(null); setPickerPK(null); }} className="text-red-300 text-xs px-2 py-0.5 bg-red-700 border border-red-500 rounded font-bold animate-pulse">Yes, Delete</button>
                    <button onClick={function() { setPendingDelete(null); }} className="text-gray-400 text-xs px-2 py-0.5 bg-gray-700 rounded">Cancel</button>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <button onClick={function() { if (pickerPK === r.pk) { setPickerPK(null); } else { setPickerPK(r.pk); setPickSearch(""); setPickCardNo(""); setPendingDelete(null); } }} className={"text-xs px-2 py-0.5 rounded border " + (pickerPK === r.pk ? "bg-yellow-700 border-yellow-500 text-yellow-200 font-bold" : "bg-yellow-900/30 border-yellow-800/40 text-yellow-400 hover:text-yellow-300")}>{"\u21C4"} Reassign</button>
                    <button onClick={function() { setPendingDelete(r.pk); setPickerPK(null); }} className="text-red-400 hover:text-red-300 text-xs px-2 py-0.5 bg-red-900/30 border border-red-800/40 rounded">Delete</button>
                  </React.Fragment>
                )}
                <button onClick={function() { setExpandedPK(null); setPendingDelete(null); setPickerPK(null); }} className="text-gray-400 hover:text-white text-xs px-2 py-0.5 bg-gray-700 rounded">Close</button>
              </div>
            </div>
            <div className="text-indigo-300 text-[11px] font-medium mb-2">
              {c.cardSet || "Base"}{c.copies ? " /" + c.copies : ""}
              <span className="ml-3 inline-flex gap-1.5">
                <button onClick={function(e) { e.stopPropagation(); setActiveTab("detailed"); setDetailedProductFilter(c.product); setDetailedCardNumFilter(c.cardNumber); setDetailedStatusFilter("all"); setDetailedSnFilter("all"); }} className="text-[9px] px-1.5 py-0 rounded bg-purple-900/40 border border-purple-700/50 text-purple-300 hover:bg-purple-800/50 font-bold">{"View #" + c.cardNumber}</button>
                <button onClick={function(e) { e.stopPropagation(); setActiveTab("detailed"); setDetailedProductFilter(c.product); setDetailedCardNumFilter(null); setDetailedStatusFilter("all"); setDetailedSnFilter("all"); }} className="text-[9px] px-1.5 py-0 rounded bg-gray-700/60 border border-gray-600/50 text-gray-300 hover:bg-gray-600/50 font-bold">Full Set</button>
                <a href={tcdbUrl(c)} target="_blank" rel="noopener noreferrer" className="text-[9px] px-1.5 py-0 rounded bg-cyan-900/40 border border-cyan-700/50 text-cyan-300 hover:bg-cyan-800/50 font-bold inline-block">TCDB</a>
                <a href={ebayUrl(c)} target="_blank" rel="noopener noreferrer" className="text-[9px] px-1.5 py-0 rounded bg-yellow-900/40 border border-yellow-700/50 text-yellow-300 hover:bg-yellow-800/50 font-bold inline-block">eBay</a>
                <a href={comcUrl(c)} target="_blank" rel="noopener noreferrer" className="text-[9px] px-1.5 py-0 rounded bg-orange-900/40 border border-orange-700/50 text-orange-300 hover:bg-orange-800/50 font-bold inline-block">COMC</a>
                <a href={pt130Url(c)} target="_blank" rel="noopener noreferrer" className="text-[9px] px-1.5 py-0 rounded bg-teal-900/40 border border-teal-700/50 text-teal-300 hover:bg-teal-800/50 font-bold inline-block">130pt</a>
              </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-5 gap-2 mb-3 text-center">
              <div className="bg-yellow-950/40 rounded p-1.5 border border-yellow-900/40">
                <div className="text-[8px] text-green-500 uppercase font-bold">Lowest</div>
                <div className="text-sm font-bold" style={{color:"#FFC52F"}}>${minP.toFixed(2)}</div>
              </div>
              <div className="bg-gray-800 rounded p-1.5">
                <div className="text-[8px] text-gray-500 uppercase">Latest</div>
                <div className="text-sm font-bold text-indigo-300">${r.latestPrice.toFixed(2)}</div>
              </div>
              <div className="bg-gray-800 rounded p-1.5">
                <div className="text-[8px] text-gray-500 uppercase">Highest</div>
                <div className="text-sm font-bold text-red-400">${maxP.toFixed(2)}</div>
              </div>
              <div className="bg-gray-800 rounded p-1.5">
                <div className="text-[8px] text-gray-500 uppercase">Average</div>
                <div className="text-sm font-bold text-yellow-300">${avgP.toFixed(2)}</div>
              </div>
              <div className="bg-gray-800 rounded p-1.5">
                <div className="text-[8px] text-gray-500 uppercase">Sources</div>
                <div className="text-sm font-bold text-gray-300">{(function() {
                  var ec = 0, cc = 0;
                  r.entries.forEach(function(e) { if (e.source === "eBay") ec++; else cc++; });
                  var parts = [];
                  if (ec) parts.push(React.createElement("span", {key:"e", className:"text-yellow-400"}, ec + "E"));
                  if (ec && cc) parts.push(" ");
                  if (cc) parts.push(React.createElement("span", {key:"c", className:"text-green-400"}, cc + "C"));
                  return parts;
                })()}</div>
                <div className="text-[7px] text-gray-600">{r.entries.reduce(function(a, e) { return a + (e.listings || 1); }, 0)} listings</div>
              </div>
            </div>

            {/* Chart - bar chart with labels */}
            {r.entries.length >= 2 && (
              <div className="bg-gray-900/60 rounded p-2 mb-3">
                <div className="text-[8px] text-gray-500 uppercase mb-1">Price over time</div>
                <div className="flex items-end gap-[2px]" style={{height: "60px"}}>
                  {r.entries.map(function(e, i) {
                    var range = maxP - minP || 1;
                    var pct = ((e.price - minP) / range);
                    var h = Math.max(4, pct * 52);
                    var barColor = e.source === "eBay" ? "bg-yellow-500" : "bg-green-500";
                    return <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                      <div className="absolute bottom-full mb-0.5 hidden group-hover:block bg-gray-800 text-[8px] text-white px-1 rounded whitespace-nowrap z-10">{e.date.slice(5)} ${e.price.toFixed(2)} {e.source}</div>
                      <div className={barColor + " w-full rounded-t-sm cursor-pointer hover:opacity-80"} style={{height: h + "px"}}></div>
                    </div>;
                  })}
                </div>
                <div className="flex justify-between text-[7px] text-gray-600 mt-0.5">
                  <span>{r.entries[0].date.slice(5)}</span>
                  <span>{r.entries[r.entries.length - 1].date.slice(5)}</span>
                </div>
              </div>
            )}

            {/* Full history table */}
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-[10px]">
                <thead><tr className="text-gray-500 border-b border-gray-700">
                  {[["date","Date","left"],["source","Source","left"],["price","Price","right"],["listings","Lst","right"],["chg","Chg","right"]].map(function(col) {
                    var isA = innerSort === col[0];
                    return <th key={col[0]} className={"py-0.5 px-1 cursor-pointer select-none hover:text-indigo-300 text-" + col[2] + " " + (isA ? "text-indigo-400 font-bold" : "")} onClick={function() { if (isA) { setInnerSortDir(innerSortDir === "asc" ? "desc" : "asc"); } else { setInnerSort(col[0]); setInnerSortDir(col[0] === "price" ? "asc" : "desc"); }}}>{col[1]}{isA ? (innerSortDir === "asc" ? " \u25B2" : " \u25BC") : ""}</th>;
                  })}
                </tr></thead>
                <tbody>
                  {(function() {
                    var sorted = r.entries.slice();
                    if (innerSort === "date") sorted.sort(function(a, b) { return a.date > b.date ? 1 : a.date < b.date ? -1 : 0; });
                    else if (innerSort === "source") sorted.sort(function(a, b) { return a.source.localeCompare(b.source); });
                    else if (innerSort === "price") sorted.sort(function(a, b) { return a.price - b.price; });
                    else if (innerSort === "listings") sorted.sort(function(a, b) { return (a.listings || 1) - (b.listings || 1); });
                    if (innerSortDir === "desc") sorted.reverse();
                    return sorted.map(function(e, i) {
                      var prev = null;
                      for (var pi = 0; pi < r.entries.length; pi++) {
                        if (r.entries[pi].date < e.date && (!prev || r.entries[pi].date > prev.date)) prev = r.entries[pi];
                      }
                      var chg = prev ? e.price - prev.price : 0;
                      var srcColor = e.source === "eBay" ? "text-yellow-400" : e.source === "SportLots" ? "text-blue-400" : e.source === "Whatnot" ? "text-violet-400" : "text-green-400";
                      var chgColor = !prev ? "text-gray-600" : chg < -0.01 ? "text-yellow-300" : chg > 0.01 ? "text-red-400" : "text-gray-500";
                      var hasTitles = e.titles && e.titles.length > 0;
                      return <React.Fragment key={i}>
                        <tr className="border-b border-gray-800/50 hover:bg-gray-800/40">
                          <td className="py-0.5 px-1 text-gray-300">{e.date}</td>
                          <td className={"py-0.5 px-1 font-bold " + srcColor}>{e.source}</td>
                          <td className="py-0.5 px-1 text-right font-bold text-indigo-300">${e.price.toFixed(2)}</td>
                          <td className="py-0.5 px-1 text-right text-gray-500">{e.listings || 1}</td>
                          <td className={"py-0.5 px-1 text-right font-bold " + chgColor}>{!prev ? "\u2014" : (chg > 0 ? "+" : "") + chg.toFixed(2)}</td>
                        </tr>
                        {hasTitles && (
                          <tr className="border-b border-gray-800/30">
                            <td colSpan={5} className="px-1 py-0.5">
                              {e.titles.map(function(t, ti) {
                                return <div key={ti} className="text-[9px] text-gray-500 truncate pl-2" title={t}>{"\u2514 "}{t}</div>;
                              })}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>;
                    });
                  })()}
                </tbody>
              </table>
            </div>

            {/* Reassign picker */}
            {pickerPK === r.pk && (
              <div className="mt-3 bg-yellow-950/20 rounded-lg border border-yellow-700 p-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-yellow-300 font-bold text-[11px]">Reassign Price Data to Different Card</span>
                  <button onClick={function() { setPickerPK(null); }} className="text-gray-400 text-[10px] px-1.5 py-0.5 bg-gray-700 rounded hover:bg-gray-600">Close</button>
                </div>
                <div className="text-[9px] text-gray-500 mb-1.5">Moving {r.entries.length} price point{r.entries.length !== 1 ? "s" : ""} from <span className="text-yellow-400">{c.cardSet || "Base"}</span> to your selection.</div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-gray-500 text-[10px]">Card #:</span>
                  <input value={pickCardNo} onChange={function(e) { setPickCardNo(e.target.value); }} placeholder="Filter #" className="bg-gray-800 border border-gray-600 rounded px-1.5 py-0.5 text-gray-200 text-[10px] w-16" />
                  {pickCardNo && <button onClick={function() { setPickCardNo(""); }} className="text-gray-500 hover:text-gray-300 text-[10px]">{"\u2715"}</button>}
                  <span className="text-gray-600 text-[10px]">|</span>
                  <span className="text-gray-500 text-[10px]">Search:</span>
                  <input value={pickSearch} onChange={function(e) { setPickSearch(e.target.value); }} placeholder="product, variant, year..." className="bg-gray-800 border border-gray-600 rounded px-1.5 py-0.5 text-gray-200 text-[10px] flex-1 min-w-[120px]" />
                  {pickSearch && <button onClick={function() { setPickSearch(""); }} className="text-gray-500 hover:text-gray-300 text-[10px]">{"\u2715"}</button>}
                </div>
                {(function() {
                  var filtered;
                  if (pickSearch) {
                    var terms = pickSearch.toLowerCase().split(/\s+/).filter(function(t) { return t.length > 0; });
                    filtered = ALL_CARDS.filter(function(fc) {
                      var hay = (fc.product + " " + fc.cardSet + " " + fc.cardNumber).toLowerCase();
                      for (var ti = 0; ti < terms.length; ti++) { if (hay.indexOf(terms[ti]) === -1) return false; }
                      return true;
                    }).slice(0, 80);
                  } else {
                    var cProd = c.product.toLowerCase();
                    filtered = ALL_CARDS.filter(function(fc) { return fc.product.toLowerCase() === cProd; });
                  }
                  if (pickCardNo) {
                    var fv = pickCardNo.trim();
                    filtered = filtered.filter(function(fc) { return fc.cardNumber.trim() === fv; });
                  }
                  filtered = filtered.filter(function(fc) {
                    var fpk = fc.product.slice(0,4) + "|" + fc.product + "|" + fc.cardNumber + "|" + (fc.cardSet || "Base");
                    return fpk !== r.pk;
                  });
                  // Sort: need first, transit middle, owned last
                  filtered.sort(function(a, b) {
                    var sa = statuses[a.id] || "not_owned";
                    var sb = statuses[b.id] || "not_owned";
                    var order = {"not_owned": 0, "in_transit": 1, "owned": 2};
                    return (order[sa] || 0) - (order[sb] || 0);
                  });
                  var countText = filtered.length + (pickSearch ? " (all DB)" : " same product");
                  return (
                    <div>
                      <div className="text-[9px] text-gray-600 mb-1">{countText}</div>
                      {filtered.length > 0 ? (
                        <div className="max-h-48 overflow-y-auto space-y-0.5">
                          {filtered.map(function(cand) {
                            var cStatus = statuses[cand.id] || "not_owned";
                            var statusLabel = cStatus === "owned" ? "OWN" : cStatus === "in_transit" ? "TRNS" : "";
                            var candIsAuto = cand.isAuto === "Yes" || /autograph|auto|signature/i.test(cand.cardSet || "");
                            var existingPK = cand.product.slice(0,4) + "|" + cand.product + "|" + cand.cardNumber + "|" + (cand.cardSet || "Base");
                            var hasExisting = ph[existingPK] && ph[existingPK].length > 0;
                            return (
                              <div key={cand.id} className="flex items-center gap-1.5 bg-gray-800/60 rounded px-2 py-1 hover:bg-gray-700/60">
                                {statusLabel ? <span className={"text-[8px] font-bold px-1 rounded " + (cStatus === "owned" ? "bg-green-900/60 text-green-300" : cStatus === "in_transit" ? "bg-emerald-900/60 text-emerald-300" : "bg-red-900/60 text-red-400")}>{statusLabel}</span> : <span className="w-5"></span>}
                                <span className="text-gray-500 font-mono text-[10px] w-14 flex-shrink-0">#{cand.cardNumber}</span>
                                {pickSearch && <span className="text-gray-500 text-[10px] w-10 flex-shrink-0">{String(cand.product).slice(0,4)}</span>}
                                {pickSearch && <span className="text-gray-600 text-[10px] max-w-[80px] truncate flex-shrink-0" title={cand.product}>{String(cand.product).slice(5)}</span>}
                                <span className="text-gray-200 flex-1 truncate">{cand.cardSet || "Base"}</span>
                                {cand.copies && <span className="text-purple-400 font-bold text-[10px] flex-shrink-0">{"/" + cand.copies}</span>}
                                {candIsAuto && <span className="text-yellow-400 text-[8px] font-bold bg-yellow-900/50 px-0.5 rounded flex-shrink-0">AU</span>}
                                {hasExisting && <span className="text-indigo-400 text-[8px] flex-shrink-0" title="Already has price data">{"\uD83D\uDCC8"}</span>}
                                <button onClick={function() { reassignPrice(r.pk, cand); }} className="px-2 py-0.5 bg-green-700 hover:bg-green-600 text-white rounded text-[10px] font-bold flex-shrink-0">Assign</button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-[10px] mt-1">
                          {pickSearch ? "No matches for \"" + pickSearch + "\"" : "No other cards in this product."}
                          {pickCardNo && <button onClick={function() { setPickCardNo(""); }} className="text-yellow-400 hover:text-yellow-300 underline ml-1">Clear # filter</button>}
                          {!pickSearch && <span className="text-gray-600 ml-1">Use Search to find across all {ALL_CARDS.length} cards.</span>}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        );
      })()}

      {/* Card list - compact */}
      {rows.length === 0 ? (
        <div className="text-center text-gray-500 py-6 text-xs">
          {Object.keys(ph).length === 0 ? "No price data yet. Scan COMC or eBay listings in the Scanner tab." : "No cards match current filters."}
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 text-[9px] mb-1">
            <span className="text-gray-500">{rows.length} card{rows.length !== 1 ? "s" : ""}</span>
            {filterStatus === "need" && rows.length > 0 && <span className="font-bold" style={{color:"#FFC52F"}}>{rows.length} need ${rows.reduce(function(s,r){return s+r.lowestPrice;},0).toFixed(2)} at lowest</span>}
          </div>
          <div className="overflow-y-auto" style={{maxHeight: expandedRow ? "280px" : "calc(100vh - 220px)"}}>
            <table className="w-full text-[10px]">
              <thead><tr className="text-gray-500 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
                <th className="text-left py-1 px-1 w-3"></th>
                {[["product","Product"],["number","#"],["variant","Variant"],["sn","SN"],["price","Low"],["trend","Trend"],["tracked","Src"],["date","Date"]].map(function(col) {
                  var isActive = sortBy === col[0];
                  return <th key={col[0]} className={"py-1 px-1 cursor-pointer select-none hover:text-indigo-300 transition-colors " + (col[0] === "price" || col[0] === "sn" || col[0] === "trend" || col[0] === "date" ? "text-right " : "text-left ") + (isActive ? "text-indigo-400 font-bold" : "")} onClick={function() { if (isActive) { setSortDir(sortDir === "asc" ? "desc" : "asc"); } else { setSortBy(col[0]); setSortDir(col[0] === "price" || col[0] === "sn" ? "asc" : "desc"); }}}>{col[1]}{isActive ? (sortDir === "asc" ? " \u25B2" : " \u25BC") : ""}</th>;
                })}
              </tr></thead>
              <tbody>
                {rows.map(function(row) {
                  var c = row.card;
                  var isExp = expandedPK === row.pk;
                  var statusDot = row.status === "owned" ? "bg-green-500" : row.status === "in_transit" ? "bg-emerald-400" : "bg-red-500";
                  var trendColor = row.entries.length < 2 ? "text-gray-600" : row.delta < -0.01 ? "text-green-400" : row.delta > 0.01 ? "text-red-400" : "text-gray-500";
                  var trendText = row.entries.length < 2 ? "\u2014" : (row.delta < 0 ? "" : "+") + row.delta.toFixed(2);
                  return <tr key={row.pk} onClick={function() { if (!isExp) { setInnerSort("date"); setInnerSortDir("desc"); } setExpandedPK(isExp ? null : row.pk); }} className={"border-b border-gray-800/30 cursor-pointer hover:bg-gray-800/40 " + (isExp ? "bg-indigo-950/30" : "")}>
                    <td className="py-0.5 px-1">{row.flagged ? <span className="text-yellow-400 text-[9px]" title="Suspicious - verify match">⚠</span> : <span className={"inline-block w-1.5 h-1.5 rounded-full " + statusDot}></span>}</td>
                    <td className="py-0.5 px-1 text-gray-300 truncate" style={{maxWidth:"clamp(100px,12vw,200px)"}} title={c.product + " - Click to view full set"}><button onClick={function(e) { e.stopPropagation(); setActiveTab("detailed"); setDetailedProductFilter(c.product); setDetailedCardNumFilter(null); setDetailedStatusFilter("all"); setDetailedSnFilter("all"); }} className="text-left hover:text-indigo-300 hover:underline truncate w-full">{c.product.replace(/^\d{4}\s*/, "")}</button></td>
                    <td className="py-0.5 px-1"><button onClick={function(e) { e.stopPropagation(); setActiveTab("detailed"); setDetailedProductFilter(c.product); setDetailedCardNumFilter(c.cardNumber); setDetailedStatusFilter("all"); setDetailedSnFilter("all"); }} className="text-gray-500 hover:text-purple-300 hover:underline" title={"View all #" + c.cardNumber + " variants"}>{c.cardNumber}</button></td>
                    <td className="py-0.5 px-1 text-gray-400 truncate" style={{maxWidth:"clamp(80px,10vw,180px)"}} title={c.cardSet}>{c.cardSet || "Base"}</td>
                    <td className="py-0.5 px-1 text-right text-purple-400 font-bold">{c.copies ? "/" + c.copies : ""}</td>
                    <td className="py-0.5 px-1 text-right font-bold text-indigo-300">${row.latestPrice.toFixed(2)}</td>
                    <td className={"py-0.5 px-1 text-right font-bold " + trendColor}>{trendText}</td>
                    <td className="py-0.5 px-1 text-right text-[9px]">{(function() {
                      var ec = 0, cc = 0;
                      row.entries.forEach(function(e) { if (e.source === "eBay") ec++; else cc++; });
                      var parts = [];
                      if (ec) parts.push(React.createElement("span", {key:"e", className:"text-yellow-400"}, ec + "E"));
                      if (ec && cc) parts.push(" ");
                      if (cc) parts.push(React.createElement("span", {key:"c", className:"text-green-400"}, cc + "C"));
                      return parts;
                    })()}</td>
                    <td className="py-0.5 px-1 text-right text-gray-600">{row.latestDate.slice(5)}</td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
function TargetsPanel({ cards, statuses, setCardStatus, updateCardDetail, setDetailedCardId, setActiveTab, initialCardFilter, setTargetCardFilter }) {
  var CARD_BY_ID = {};
  for (var ci = 0; ci < cards.length; ci++) CARD_BY_ID[cards[ci].id] = cards[ci];
  var [targets, setTargets] = useState(function(){ return loadTargets(); });
  var [filter, setFilter] = useState("all"); // all, active, watching
  var [sourceFilter, setSourceFilter] = useState("all");
  var [cardIdFilter, setCardIdFilter] = useState(initialCardFilter || null);
  var [sort, setSort] = useState("dateAdded");
  var [sortDir, setSortDir] = useState("desc");
  var [expanded, setExpanded] = useState({});
  var [editNotes, setEditNotes] = useState({});
  var [confirmRemove, setConfirmRemove] = useState(null);

  function reload() { var t = loadTargets(); setTargets(Object.assign({}, t)); }
  function removeTarget(key) {
    if (confirmRemove !== key) { setConfirmRemove(key); return; }
    var tgt = loadTargets(); delete tgt[key]; saveTargets(tgt); setTargets(Object.assign({}, tgt)); setConfirmRemove(null);
  }
  function toggleStatus(key) {
    var tgt = loadTargets();
    if (tgt[key]) { tgt[key].status = tgt[key].status === "active" ? "watching" : "active"; }
    saveTargets(tgt); setTargets(Object.assign({}, tgt));
  }
  function updateNotes(key, notes) {
    var tgt = loadTargets();
    if (tgt[key]) { tgt[key].notes = notes; }
    saveTargets(tgt); setTargets(Object.assign({}, tgt));
  }
  function markTransit(key) {
    var tgt = loadTargets();
    var t = tgt[key];
    if (!t || !t.cardId) return;
    setCardStatus(t.cardId, "in_transit");
    if (t.price) updateCardDetail(t.cardId, "price_paid", "$" + t.price);
    updateCardDetail(t.cardId, "purchase_date", new Date().toISOString().slice(0,10));
    if (t.source) updateCardDetail(t.cardId, "source", t.source);
    if (t.notes) updateCardDetail(t.cardId, "notes", t.notes);
    delete tgt[key]; saveTargets(tgt); setTargets(Object.assign({}, tgt));
  }
  function markOwned(key) {
    var tgt = loadTargets();
    var t = tgt[key];
    if (!t || !t.cardId) return;
    setCardStatus(t.cardId, "owned");
    if (t.price) updateCardDetail(t.cardId, "price_paid", "$" + t.price);
    updateCardDetail(t.cardId, "purchase_date", new Date().toISOString().slice(0,10));
    if (t.source) updateCardDetail(t.cardId, "source", t.source);
    if (t.notes) updateCardDetail(t.cardId, "notes", t.notes);
    delete tgt[key]; saveTargets(tgt); setTargets(Object.assign({}, tgt));
  }

  var allTargets = Object.values(targets);
  var activeCount = allTargets.filter(function(t){ return t.status === "active"; }).length;
  var watchingCount = allTargets.filter(function(t){ return t.status === "watching"; }).length;
  var sources = {};
  allTargets.forEach(function(t){ sources[t.source || "Unknown"] = (sources[t.source || "Unknown"] || 0) + 1; });
  var sourceList = Object.keys(sources).sort();

  // Pick up external card filter (from Lookup/Detailed click)
  useEffect(function() {
    if (initialCardFilter != null) { setCardIdFilter(initialCardFilter); setTargetCardFilter && setTargetCardFilter(null); }
  }, [initialCardFilter]);

  var filtered = allTargets.filter(function(t) {
    if (filter === "active" && t.status !== "active") return false;
    if (filter === "watching" && t.status !== "watching") return false;
    if (sourceFilter !== "all" && t.source !== sourceFilter) return false;
    if (cardIdFilter != null && t.cardId !== cardIdFilter) return false;
    return true;
  });

  function toggleSort(col) {
    if (sort === col) { setSortDir(sortDir === "asc" ? "desc" : "asc"); }
    else { setSort(col); setSortDir(col === "price" ? "asc" : "desc"); }
  }
  var sorted = filtered.slice().sort(function(a, b) {
    var mul = sortDir === "asc" ? 1 : -1;
    if (sort === "price") return mul * ((parseFloat(a.price) || 999) - (parseFloat(b.price) || 999));
    if (sort === "year") return mul * ((a.year || "").localeCompare(b.year || ""));
    if (sort === "source") return mul * ((a.source || "").localeCompare(b.source || ""));
    if (sort === "status") return mul * ((a.status || "").localeCompare(b.status || ""));
    return mul * ((b.dateAdded || "").localeCompare(a.dateAdded || ""));
  });

  var totalActive = allTargets.filter(function(t){ return t.status === "active"; }).reduce(function(sum, t){ return sum + (parseFloat(t.price) || 0); }, 0);

  function sortArrow(col) { return sort === col ? (sortDir === "asc" ? " \u25B2" : " \u25BC") : ""; }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-pink-400 font-bold" style={{fontSize:"14px"}}>{"\uD83C\uDFAF"} Pinned Targets</h2>
        <span className="text-gray-500 text-xs">{allTargets.length} targets saved</span>
        {activeCount > 0 && <span className="text-pink-300 text-xs">{"\uD83C\uDFAF"} {activeCount} active{totalActive > 0 ? " ($" + totalActive.toFixed(2) + " total)" : ""}</span>}
        {watchingCount > 0 && <span className="text-gray-400 text-xs">{"\uD83D\uDC41"} {watchingCount} watching</span>}
      </div>
      {/* Description */}
      <div className="text-[10px] text-gray-500 bg-gray-900/50 rounded p-2 border border-gray-800">
        <span className="text-pink-400 font-bold">{"\uD83C\uDFAF"} Active</span> = want to buy, chase these down.{" "}
        <span className="text-gray-400 font-bold">{"\uD83D\uDC41"} Watching</span> = seen it, too expensive for now, revisit later.{" "}
        Add targets from any Scanner tab using the {"\uD83C\uDFAF"} Target or {"\uD83D\uDC41"} Watch buttons. When you buy one, hit Transit or Own to move it to your collection and remove it from targets.
      </div>
      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap items-center">
        <button onClick={function(){ setFilter("all"); }} className={"px-2 py-0.5 rounded text-[10px] font-bold " + (filter === "all" ? "bg-gray-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700")}>{filter === "all" ? "\u25CF " : ""}All ({allTargets.length})</button>
        <button onClick={function(){ setFilter("active"); }} className={"px-2 py-0.5 rounded text-[10px] font-bold " + (filter === "active" ? "bg-pink-700 text-pink-100" : "bg-pink-900/30 text-pink-400 hover:bg-pink-800/40")}>{filter === "active" ? "\u25CF " : ""}{"\uD83C\uDFAF"} Active ({activeCount})</button>
        <button onClick={function(){ setFilter("watching"); }} className={"px-2 py-0.5 rounded text-[10px] font-bold " + (filter === "watching" ? "bg-gray-600 text-gray-200" : "bg-gray-800 text-gray-400 hover:bg-gray-700")}>{filter === "watching" ? "\u25CF " : ""}{"\uD83D\uDC41"} Watching ({watchingCount})</button>
        <span style={{color:"#2a3f5f"}}>|</span>
        <button onClick={function(){ setSourceFilter("all"); }} className={"px-2 py-0.5 rounded text-[10px] " + (sourceFilter === "all" ? "bg-gray-600 text-white font-bold" : "bg-gray-800 text-gray-500 hover:bg-gray-700")}>All Sources</button>
        {sourceList.map(function(s) {
          var sc = s === "eBay" ? "bg-yellow-600 text-white" : s === "COMC" ? "bg-green-700 text-white" : s === "SportLots" ? "bg-blue-600 text-white" : s === "Whatnot" ? "bg-violet-600 text-white" : "bg-gray-600 text-white";
          var scInactive = s === "eBay" ? "bg-yellow-900/30 text-yellow-400" : s === "COMC" ? "bg-green-900/30 text-green-400" : s === "SportLots" ? "bg-blue-900/30 text-blue-400" : s === "Whatnot" ? "bg-violet-900/30 text-violet-400" : "bg-gray-800 text-gray-400";
          return <button key={s} onClick={function(){ setSourceFilter(sourceFilter === s ? "all" : s); }} className={"px-2 py-0.5 rounded text-[10px] font-bold " + (sourceFilter === s ? sc : scInactive + " hover:opacity-80")}>{s} ({sources[s]})</button>;
        })}
        {cardIdFilter != null && (function() {
          var cfCard = CARD_BY_ID[cardIdFilter];
          return <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/50 text-purple-300 border border-purple-700">
            <span>Card: {cfCard ? "#" + cfCard.cardNumber + " " + (cfCard.cardSet || "").slice(0,25) : "ID " + cardIdFilter}</span>
            <button onClick={function(){ setCardIdFilter(null); }} className="text-purple-400 hover:text-white ml-1 font-bold">✕</button>
          </span>;
        })()}
      </div>
      {/* Table */}
      {sorted.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-3xl mb-2">{"\uD83C\uDFAF"}</div>
          <div className="text-sm">No targets yet</div>
          <div className="text-xs mt-1">Use the Scanner tab to find cards, then click {"\uD83C\uDFAF Target"} or {"\uD83D\uDC41 Watch"} to save them here.</div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-800">
          <table className="w-full text-[10px]">
            <thead>
              <tr className="bg-gray-900 text-gray-400 border-b border-gray-700">
                <th className="px-1 py-1 text-center w-8">St</th>
                <th onClick={function(){ toggleSort("dateAdded"); }} className="px-1 py-1 text-left cursor-pointer hover:text-white select-none">Added{sortArrow("dateAdded")}</th>
                <th onClick={function(){ toggleSort("source"); }} className="px-1 py-1 text-left cursor-pointer hover:text-white select-none">Src{sortArrow("source")}</th>
                <th onClick={function(){ toggleSort("year"); }} className="px-1 py-1 text-left cursor-pointer hover:text-white select-none">Yr{sortArrow("year")}</th>
                <th className="px-1 py-1 text-left">Card Info</th>
                <th onClick={function(){ toggleSort("price"); }} className="px-1 py-1 text-right cursor-pointer hover:text-white select-none">Price{sortArrow("price")}</th>
                <th className="px-1 py-1 text-center">Type</th>
                <th className="px-1 py-1 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(function(t) {
                var isExp = expanded[t.id];
                var card = t.cardId ? CARD_BY_ID[t.cardId] : null;
                var cardSt = card ? (statuses[card.id] || "not_owned") : null;
                var isNeed = cardSt === "not_owned";
                var isOwned = cardSt === "owned";
                var isTransit = cardSt === "in_transit";
                var isActive = t.status === "active";
                var rowBg = !isActive ? "bg-gray-800/30 opacity-50" : isOwned ? "bg-green-900/20 opacity-50" : isTransit ? "bg-emerald-900/20 opacity-50" : "bg-pink-900/10";
                var srcColor = t.source === "eBay" ? "text-yellow-400" : t.source === "COMC" ? "text-green-400" : t.source === "SportLots" ? "text-blue-400" : t.source === "Whatnot" ? "text-violet-400" : "text-gray-400";
                var displayTitle = t.title || "";
                if (displayTitle.length > 80) displayTitle = displayTitle.slice(0, 77) + "...";
                var cardDesc = card ? (card.product.replace(/^\d{4}\s*/, "") + " " + (card.cardSet || "Base") + " #" + card.cardNumber) : displayTitle;
                if (cardDesc.length > 80) cardDesc = cardDesc.slice(0, 77) + "...";

                return (
                  <React.Fragment key={t.id}>
                    <tr className={"border-b border-gray-800 hover:bg-gray-700/30 cursor-pointer " + rowBg} onClick={function(){ setExpanded(function(prev){ var n = Object.assign({}, prev); n[t.id] = !n[t.id]; return n; }); }}>
                      <td className="px-1 py-1 text-center">
                        {isActive ? <span className="text-pink-400" title="Active target">{"\uD83C\uDFAF"}</span> : <span className="text-gray-500" title="Watching">{"\uD83D\uDC41"}</span>}
                      </td>
                      <td className="px-1 py-1 text-gray-500 whitespace-nowrap">{(t.dateAdded || "").slice(5)}</td>
                      <td className={"px-1 py-1 font-bold " + srcColor}>{t.source || "?"}</td>
                      <td className="px-1 py-1 text-gray-500">{t.year ? "'" + String(t.year).slice(-2) : ""}</td>
                      <td className="px-1 py-1">
                        <div className="flex items-center gap-1">
                          <span className={card ? "text-gray-200" : "text-gray-400"} title={t.title || cardDesc}>{cardDesc}</span>
                          {t.isAuto && <span className="text-yellow-400 text-[8px] font-bold bg-yellow-900/50 px-0.5 rounded">AU</span>}
                          {card && sspBadge(card.cardSet)}
                          {t.graded && <span className="text-pink-400 text-[8px] font-bold bg-pink-900/50 px-0.5 rounded">{t.graded}</span>}
                          {t.printRun && <span className="text-purple-400 text-[8px]">{"/" + t.printRun}</span>}
                          {card && isOwned && <span className="text-green-400 text-[8px] font-bold bg-green-900/50 px-0.5 rounded ml-0.5">OWNED</span>}
                          {card && isTransit && <span className="text-cyan-400 text-[8px] font-bold bg-cyan-900/50 px-0.5 rounded ml-0.5">TRANSIT</span>}
                        </div>
                      </td>
                      <td className={"px-1 py-1 text-right font-bold whitespace-nowrap " + (isActive && isNeed ? "text-pink-300" : "text-gray-500")}>{t.price ? (t.currency === "GBP" ? "\u00A3" : "$") + t.price : ""}</td>
                      <td className="px-1 py-1 text-gray-500 max-w-[80px] truncate" title={t.seller}>{(function() {
                        if (t.listingType === "auction") return <span className="text-red-400 font-bold text-[9px] bg-red-950/40 px-1 rounded border border-red-800" title={"Auction" + (t.bids ? " - " + t.bids + " bids" : "")}>{"\uD83D\uDD28"}{t.bids ? " " + t.bids : ""}</span>;
                        if (t.listingType === "best_offer") return <span className="text-cyan-400 font-bold text-[9px] bg-cyan-950/40 px-1 rounded border border-cyan-800" title="Best Offer">{"\uD83E\uDD1D OBO"}</span>;
                        if (t.source === "COMC" || t.source === "SportLots") return <span className="text-green-400 text-[9px]">BIN</span>;
                        return <span className="text-green-400 text-[9px]">BIN</span>;
                      })()}</td>
                      <td className="px-1 py-1">
                        <div className="flex gap-0.5 justify-center items-center">
                          <button onClick={function(e){ e.stopPropagation(); toggleStatus(t.id); }} className={"px-1 py-0 rounded text-[8px] font-bold " + (isActive ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-pink-800 text-pink-200 hover:bg-pink-700")} title={isActive ? "Move to watching" : "Make active"}>{isActive ? "\uD83D\uDC41" : "\uD83C\uDFAF"}</button>
                          {card && isNeed && <button onClick={function(e){ e.stopPropagation(); markTransit(t.id); }} className="px-1 py-0 bg-cyan-800 hover:bg-cyan-700 text-white rounded text-[8px] font-bold" title="Mark as In-Transit and remove from targets">{"\uD83D\uDCE6"}</button>}
                          {card && isNeed && <button onClick={function(e){ e.stopPropagation(); markOwned(t.id); }} className="px-1 py-0 bg-yellow-800 hover:bg-yellow-700 text-white rounded text-[8px] font-bold" title="Mark as Owned and remove from targets">{"\u2714"}</button>}
                          <button onClick={function(e){ e.stopPropagation(); removeTarget(t.id); }} className={"px-1 py-0 rounded text-[8px] font-bold " + (confirmRemove === t.id ? "bg-red-600 text-white" : "bg-red-900/30 text-red-400 hover:bg-red-800/30")} title="Remove from targets">{confirmRemove === t.id ? "Confirm?" : "\u2715"}</button>
                        </div>
                      </td>
                    </tr>
                    {isExp && (
                      <tr className={"border-b border-gray-700 " + rowBg}>
                        <td colSpan={8} className="px-2 py-1.5">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px]">
                            <div><span className="text-gray-500">Full title: </span><span className="text-gray-300">{t.title || "N/A"}</span></div>
                            <div><span className="text-gray-500">Source: </span><span className={srcColor}>{t.source || "Unknown"}</span></div>
                            <div><span className="text-gray-500">Price: </span><span className="text-green-300 font-bold">{t.price ? (t.currency === "GBP" ? "\u00A3" : "$") + t.price : "N/A"}</span>{t.watchPrice ? <span className="text-gray-500 ml-1">{"(total incl. shipping: $" + t.watchPrice.toFixed(2) + ")"}</span> : ""}</div>
                            <div><span className="text-gray-500">Seller: </span><span className="text-gray-300">{t.seller || "Unknown"}</span></div>
                            <div><span className="text-gray-500">Date added: </span><span className="text-gray-300">{t.dateAdded || "Unknown"}</span></div>
                            <div><span className="text-gray-500">Status: </span><span className={isActive ? "text-pink-400 font-bold" : "text-gray-400"}>{isActive ? "\uD83C\uDFAF Active" : "\uD83D\uDC41 Watching"}</span></div>
                            {card && <div><span className="text-gray-500">DB Match: </span><span className="text-cyan-300">{"#" + card.id + " - " + card.product + " " + (card.cardSet || "Base") + " #" + card.cardNumber}</span></div>}
                            {card && <div><span className="text-gray-500">DB Status: </span><span className={isOwned ? "text-green-300" : isTransit ? "text-emerald-300" : "text-red-400"}>{isOwned ? "Owned" : isTransit ? "In Transit" : "Not Owned"}</span></div>}
                            {t.serial && <div><span className="text-gray-500">Serial: </span><span className="text-yellow-300">{"#" + t.serial}</span></div>}
                            {t.printRun && <div><span className="text-gray-500">Print run: </span><span className="text-purple-400">{"/" + t.printRun}</span></div>}
                            {/* Notes */}
                            <div className="col-span-2 mt-1">
                              <span className="text-gray-500">Notes: </span>
                              {editNotes[t.id] !== undefined ? (
                                <span className="inline-flex items-center gap-1">
                                  <input type="text" value={editNotes[t.id]} onChange={function(e){ setEditNotes(function(prev){ var n = Object.assign({}, prev); n[t.id] = e.target.value; return n; }); }} className="bg-gray-800 border border-gray-600 rounded px-1 py-0 text-[10px] text-gray-200 w-64" placeholder="Add notes..." onKeyDown={function(e){ if (e.key === "Enter") { updateNotes(t.id, editNotes[t.id]); setEditNotes(function(prev){ var n = Object.assign({}, prev); delete n[t.id]; return n; }); } if (e.key === "Escape") { setEditNotes(function(prev){ var n = Object.assign({}, prev); delete n[t.id]; return n; }); } }} />
                                  <button onClick={function(){ updateNotes(t.id, editNotes[t.id]); setEditNotes(function(prev){ var n = Object.assign({}, prev); delete n[t.id]; return n; }); }} className="text-[8px] px-1 bg-green-800 text-green-200 rounded">{"\u2714"}</button>
                                  <button onClick={function(){ setEditNotes(function(prev){ var n = Object.assign({}, prev); delete n[t.id]; return n; }); }} className="text-[8px] px-1 bg-gray-700 text-gray-300 rounded">{"\u2715"}</button>
                                </span>
                              ) : (
                                <span className="cursor-pointer hover:text-gray-200" onClick={function(e){ e.stopPropagation(); setEditNotes(function(prev){ var n = Object.assign({}, prev); n[t.id] = t.notes || ""; return n; }); }}>
                                  {t.notes ? <span className="text-gray-300">{t.notes}</span> : <span className="text-gray-600 italic">click to add</span>}
                                </span>
                              )}
                            </div>
                            {/* Action bar */}
                            <div className="col-span-2 mt-1 flex gap-1 flex-wrap items-center">
                              <button onClick={function(e){ e.stopPropagation(); toggleStatus(t.id); }} className={"text-[9px] px-1.5 py-0.5 rounded font-bold " + (isActive ? "bg-gray-700 border border-gray-500 text-gray-300 hover:bg-gray-600" : "bg-pink-900/40 border border-pink-600 text-pink-300 hover:bg-pink-800/40")}>{isActive ? "\uD83D\uDC41 Move to Watching" : "\uD83C\uDFAF Make Active"}</button>
                              {card && isNeed && <button onClick={function(e){ e.stopPropagation(); markTransit(t.id); }} className="text-[9px] px-1.5 py-0.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded font-bold">{"\uD83D\uDCE6 Transit"}</button>}
                              {card && isNeed && <button onClick={function(e){ e.stopPropagation(); markOwned(t.id); }} className="text-[9px] px-1.5 py-0.5 bg-yellow-700 hover:bg-yellow-600 text-white rounded font-bold">{"\u2714 Own"}</button>}
                              {card && <button onClick={function(e){ e.stopPropagation(); setDetailedCardId(card.id); setActiveTab("detailed"); }} className="text-[9px] px-1.5 py-0.5 bg-purple-900/50 border border-purple-500/60 text-purple-300 rounded hover:bg-purple-800/50 font-bold">Detail</button>}
                              <span style={{color:"#2a3f5f"}}>|</span>
                              <button onClick={function(e){ e.stopPropagation(); removeTarget(t.id); }} className={"text-[9px] px-1.5 py-0.5 rounded font-bold " + (confirmRemove === t.id ? "bg-red-600 text-white" : "bg-red-900/30 border border-red-700 text-red-400 hover:bg-red-800/30")}>{confirmRemove === t.id ? "Click again to confirm removal" : "\u2715 Remove Target"}</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {/* Bulk actions */}
      {sorted.length > 0 && (
        <div className="flex gap-2 items-center text-[10px] text-gray-500 mt-2">
          <span>Bulk:</span>
          <button onClick={function(){
            if (!confirm("Remove all " + sorted.filter(function(t){ var c = t.cardId ? CARD_BY_ID[t.cardId] : null; return c && statuses[c.id] === "owned"; }).length + " targets for cards you already own?")) return;
            var tgt = loadTargets();
            sorted.forEach(function(t) {
              var c = t.cardId ? CARD_BY_ID[t.cardId] : null;
              if (c && statuses[c.id] === "owned") delete tgt[t.id];
            });
            saveTargets(tgt); setTargets(Object.assign({}, tgt));
          }} className="px-2 py-0.5 bg-yellow-900/30 border border-yellow-700 text-yellow-300 rounded hover:bg-yellow-800/30">Remove Already Owned</button>
          <button onClick={function(){
            if (!confirm("Remove all " + sorted.filter(function(t){ var c = t.cardId ? CARD_BY_ID[t.cardId] : null; return c && statuses[c.id] === "in_transit"; }).length + " targets for cards already in transit?")) return;
            var tgt = loadTargets();
            sorted.forEach(function(t) {
              var c = t.cardId ? CARD_BY_ID[t.cardId] : null;
              if (c && statuses[c.id] === "in_transit") delete tgt[t.id];
            });
            saveTargets(tgt); setTargets(Object.assign({}, tgt));
          }} className="px-2 py-0.5 bg-cyan-900/30 border border-cyan-700 text-cyan-400 rounded hover:bg-cyan-800/30">Remove In-Transit</button>
        </div>
      )}
    </div>
  );
}
function TaskBoardPanel() {
  var [showDone, setShowDone] = useState(false);
  var [tasks, setTasks] = useState({
    backlog: [
      { id: "t1", title: "eBay purchase history integration", desc: "Scan eBay purchase history for NEW pre-production proofs and off-list cards to add to NOT_ON_TCDB set", priority: "high", input: "high" },
      { id: "t24", title: "Data consolidation pass", desc: "Re-upload eBay purchase history CSV and TCDB collection export to cross-reference and patch any misses on either side. Reconcile owned/transit statuses, prices, serial numbers, and sync flags.", priority: "high", input: "high" },
      { id: "t19", title: "Export format options", desc: "Add JSON, custom CSV formats beyond current export", priority: "low", input: "minimal" },
      { id: "t5", title: "Public collection website", desc: "Make collection progress public-facing as a website", priority: "future", input: "high" }
    ],
    in_progress: [
      { id: "t2", title: "eBay search results scanner", desc: "DONE: Paste eBay search page, auto-extract Tyler Black baseball listings, filter non-baseball, match to DB. Title-scan matching with synonym normalization, product/variant scoring. Block, copy, pick, reassign features.", priority: "high", input: "high" },
      { id: "t4", title: "Price tracking over time", desc: "Prices tab created with WIP badge. priceKey grouping (year|product|cardNo|variant) shares data across duplicate card IDs. One price per day per source. Migration from old numeric keys done. Need: sparkline charts, deal alerts, price comparison across variants.", priority: "medium", input: "high" },
    ],
    done: [
      { id: "t35", title: "TCDB Paste-to-Verify", desc: "IMPLEMENTED: Paste and Verify mode in Sync tab. Paste TCDB collection text, parser extracts card numbers with set context, fuzzy-matches against DB. Bulk verify marks matched cards as synced. Player-agnostic parser foundation for V2/V3.", priority: "high", input: "high" },
      { id: "t36", title: "TCDB Comparison Scanner", desc: "IMPLEMENTED: TCDB scanner mode in Scanner tab. Paste TCDB Have/Want/In-Transit pages — auto-detects which list, parses card lines (year+product+variant+cardNumber), matches to tracker DB, compares statuses. Shows mismatches, matches, unmatched. Bulk Fix All or individual Fix buttons update tracker to match TCDB. Filters: Mismatch/Match/Unmatched/All.", priority: "high", input: "high" },
      { id: "t29", title: "SportLots Scanner", desc: "IMPLEMENTED: Paste SportLots player page, auto-parse set names/prices/quantities, match to DB. Product name splitting with 45+ known base products. Dedup, price recording, quantity display.", priority: "high", input: "medium" },
      { id: "t30", title: "Whatnot Scanner", desc: "IMPLEMENTED: Paste Whatnot search results, auto-filter Tyler Black baseball cards, extract prices/sellers, match to DB. Uses eBay title parser for reuse. Dedup, price history, last paste reload, violet theme.", priority: "high", input: "medium" },
      { id: "t31", title: "Pinned Targets Tab", desc: "IMPLEMENTED: Save listings as targets from any scanner. Two states: Active (want to buy) and Watching (too expensive, revisit later). Targets tab with filters, sort, notes, bulk cleanup. Transit/Own actions move card to collection and remove target. Scanner rows highlight with pink (active) or gray (watching) border.", priority: "high", input: "medium" },
      { id: "t22", title: "COMC Shopping Assistant", desc: "IMPLEMENTED: Paste COMC marketplace listings, auto-match to DB with 97.8% accuracy. Need/Own/Not in DB filters, persistent pin overrides, candidate picker, In-Transit button, serial number display.", priority: "high", input: "medium" },
      { id: "t23", title: "TCDB Links rebuild", desc: "IMPLEMENTED: Scraped 1,414 cards from TCDB, matched to 1,470 tracker cards with 99.4% accuracy. Fixed systematic off-by-one error. Console scraper script for future updates.", priority: "high", input: "high" },
      { id: "t16", title: "Keyboard shortcuts", desc: "IMPLEMENTED: j/k navigate cards, o/i/n/s set status, f toggle for-sale, e open eBay, Enter expand, [/] pages, 1-0 switch tabs, ? help overlay. Auto-scroll, focus highlight.", priority: "low", input: "minimal" },
      { id: "t17", title: "Batch status updates", desc: "IMPLEMENTED: Batch mode in Detailed tab - checkbox select cards, apply status to all at once. Select page/all filtered/individual. Processes in chunks of 20 with changelog.", priority: "medium", input: "minimal" },
      { id: "t21", title: "Released but not on TCDB classifier", desc: "IMPLEMENTED: MISSING_FROM_TCDB set tracks 14 cards from '2024 Panini Three and Two' (IDs 968-981). Released product not yet added to TCDB checklist. Shows as 'Pending TCDB Add' issue (amber). Separate from pre-production proofs.", priority: "low", input: "minimal" },
      { id: "t20", title: "Pre-production proof documentation", desc: "CONFIRMED: Proofs handled via NOT_ON_TCDB set, excluded from sync & main counts. Shows as 'Not on TCDB' issue. Currently 8 proofs tracked (plates, unsigned, etc). Working as intended.", priority: "low", input: "minimal" },
      { id: "t15", title: "Quick stats in header", desc: "Combined owned+transit, red for need (darker for 1/1s), visual completion bar", priority: "medium", input: "minimal" },
      { id: "t6", title: "Task board implementation", desc: "Virtual scrum board for planning and tracking project work", priority: "high", input: "minimal" },
      { id: "t14", title: "Version verification system", desc: "Checkmarks (OK) showing confirmed working versions for safe recovery", priority: "medium", input: "minimal" },
      { id: "t7", title: "eBay Super Search", desc: "Toggle button that opens 5 search query variations per card for better eBay coverage", priority: "high", input: "minimal" },
      { id: "t8", title: "Data persistence fixes", desc: "Resolved storage race conditions with delayed save mechanisms and retry logic", priority: "critical", input: "minimal" },
      { id: "t9", title: "COMC scanner with fuzzy matching", desc: "Intelligent matching for marketplace listings", priority: "high", input: "medium" },
      { id: "t10", title: "Permanent filename system", desc: "Single tyler_black_tracker.jsx file with no version numbers", priority: "high", input: "minimal" },
      { id: "t11", title: "TEST CARD for persistence testing", desc: "Test card to verify data saves correctly across reloads", priority: "medium", input: "minimal" },
      { id: "t12", title: "Version log tab", desc: "Compact changelog showing what was added when", priority: "medium", input: "minimal" },
      { id: "t13", title: "Streamlined changelog panel", desc: "More compact and functional design", priority: "low", input: "minimal" }
    ]
  });
  
  function moveTaskToDone(taskId, fromColumn) {
    setTasks(prev => {
      var task = prev[fromColumn].find(t => t.id === taskId);
      if (!task) return prev;
      return {
        ...prev,
        [fromColumn]: prev[fromColumn].filter(t => t.id !== taskId),
        done: [task, ...prev.done]
      };
    });
  }
  
  function moveTaskToBacklog(taskId) {
    setTasks(prev => {
      var task = prev.done.find(t => t.id === taskId);
      if (!task) return prev;
      return {
        ...prev,
        done: prev.done.filter(t => t.id !== taskId),
        backlog: [...prev.backlog, task]
      };
    });
  }

  var priorityColors = {
    critical: "text-red-400 bg-red-950/30 border-red-800",
    high: "text-orange-400 bg-orange-950/30 border-orange-800",
    medium: "text-yellow-400 bg-yellow-950/30 border-yellow-800",
    low: "text-gray-400 bg-gray-800/30 border-gray-700",
    future: "text-blue-400 bg-blue-950/30 border-blue-800"
  };

  var priorityLabels = {
    critical: "CRITICAL",
    high: "HIGH",
    medium: "MED",
    low: "LOW",
    future: "FUTURE"
  };

  var inputColors = {
    minimal: "text-green-400",
    medium: "text-yellow-400",
    high: "text-red-400"
  };

  var inputLabels = {
    minimal: "Min",
    medium: "Med",
    high: "High"
  };

  function renderTask(task, column) {
    var pColor = priorityColors[task.priority] || priorityColors.low;
    var pLabel = priorityLabels[task.priority] || "LOW";
    var iColor = inputColors[task.input] || inputColors.medium;
    var iLabel = inputLabels[task.input] || "Med";
    var canComplete = column === "backlog" || column === "in_progress";
    var canReopen = column === "done";
    
    return (
      <div key={task.id} className={"border rounded p-2 mb-2 " + pColor}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="text-xs font-bold text-gray-200">{task.title}</div>
          <div className="flex gap-1 shrink-0">
            {canComplete && (
              <button 
                onClick={() => moveTaskToDone(task.id, column)}
                className="text-[9px] px-1 py-0.5 bg-green-900/40 text-green-400 hover:bg-green-800/60 rounded"
                title="Mark as done"
              >
                OK Done
              </button>
            )}
            {canReopen && (
              <button 
                onClick={() => moveTaskToBacklog(task.id)}
                className="text-[9px] px-1 py-0.5 bg-gray-800 text-gray-400 hover:bg-gray-700 rounded"
                title="Move back to backlog"
              >
                {"<< Reopen"}
              </button>
            )}
            <span className={"text-[9px] px-1 py-0.5 " + iColor} title="User input required">{iLabel}</span>
            <span className="text-[9px] px-1 py-0.5 rounded bg-gray-900">{pLabel}</span>
          </div>
        </div>
        <div className="text-[10px] text-gray-400">{task.desc}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="text-xs text-gray-500 mb-3">
        Project planning board - track features, bugs, and improvements
      </div>

      {/* PRICE HISTORY STATS */}
      {(function() {
        var ph = loadPriceHistory();
        var cardCount = Object.keys(ph).length;
        var totalEntries = 0;
        var sources = {};
        var dates = {};
        for (var pid in ph) {
          totalEntries += ph[pid].length;
          for (var ei = 0; ei < ph[pid].length; ei++) {
            var e = ph[pid][ei];
            sources[e.source] = (sources[e.source] || 0) + 1;
            dates[e.date] = (dates[e.date] || 0) + 1;
          }
        }
        if (cardCount === 0) return (
          <div className="mb-4 p-2 bg-gray-800/50 border border-gray-700 rounded text-xs text-gray-500">
            <span className="font-bold text-gray-400">Price History:</span> No data yet. Scan COMC or eBay listings to start recording prices automatically.
          </div>
        );
        var dateKeys = Object.keys(dates).sort();
        var srcText = Object.keys(sources).map(function(s) { return s + ": " + sources[s]; }).join(", ");
        return (
          <div className="mb-4 p-2 bg-indigo-950/30 border border-indigo-800/40 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-indigo-300">Price History (tb-price-history-v1)</span>
              <button onClick={function() { if (confirm("Clear ALL price history? This cannot be undone.")) { savePriceHistory({}); }}} className="text-[9px] px-1 py-0 bg-red-900/30 text-red-400 rounded hover:bg-red-800/40 border border-red-800/40">Clear</button>
            </div>
            <div className="flex gap-4 text-[10px] text-gray-400">
              <span><span className="text-indigo-400 font-bold">{cardCount}</span> cards tracked</span>
              <span><span className="text-indigo-400 font-bold">{totalEntries}</span> price points</span>
              <span>{srcText}</span>
            </div>
            {dateKeys.length > 0 && <div className="text-[10px] text-gray-500 mt-0.5">Date range: {dateKeys[0]} to {dateKeys[dateKeys.length - 1]}</div>}
          </div>
        );
      })()}

      {/* IN PROGRESS */}
      <div className="mb-4">
        <div className="text-sm font-bold text-blue-400 mb-2 pb-1 border-b border-blue-800">
           In Progress ({tasks.in_progress.length})
        </div>
        <div>
          {tasks.in_progress.length > 0 ? (
            tasks.in_progress.map(t => renderTask(t, "in_progress"))
          ) : (
            <div className="text-xs text-gray-500 italic py-2">No tasks in progress</div>
          )}
        </div>
      </div>

      {/* BACKLOG */}
      <div className="mb-4">
        <div className="text-sm font-bold text-gray-300 mb-2 pb-1 border-b border-gray-700">
          Backlog ({tasks.backlog.length})
        </div>
        <div>
          {tasks.backlog.map(t => renderTask(t, "backlog"))}
        </div>
      </div>

      {/* DONE - Collapsible */}
      <div className="mt-6 pt-3 border-t border-gray-800">
        <button 
          onClick={function() { setShowDone(!showDone); }}
          className="text-xs text-gray-500 hover:text-gray-400 mb-2 flex items-center gap-1"
        >
          {showDone ? "v" : ">"} Completed ({tasks.done.length})
        </button>
        {showDone && (
          <div className="opacity-60">
            {tasks.done.map(t => renderTask(t, "done"))}
          </div>
        )}
      </div>

      <div className="mt-3 p-2 bg-blue-950/20 border border-blue-800/30 rounded text-xs">
        <div className="text-blue-300 mb-2">
          <span className="font-bold">Note:</span> Discuss task updates in chat - I'll keep this board current based on our conversations.
        </div>
        <div className="text-gray-400 text-[10px] flex gap-4">
          <span>User input needed:</span>
          <span className="text-green-400">Min</span>
          <span className="text-yellow-400">Med</span>
          <span className="text-red-400">High</span>
        </div>
      </div>

      <div className="mt-2 p-2 bg-green-950/20 border border-green-800/30 rounded text-xs text-green-300">
        <span className="font-bold">Next up (lazy mode):</span> "Card preview images" or "Export format options" - both are low priority quick wins!
      </div>
    </div>
  );
}
function VersionLogPanel() {
  var VERSION_HISTORY = [
    { date: "2026-02-22 01:00", change: "TCDB COMPARISON SCANNER: New 'TCDB' mode in Scanner tab. (1) Paste your TCDB collection page (Have/Want/In-Transit) — auto-detects which list from header text. (2) Parses card lines by year+product+variant+cardNumber pattern. (3) Matches to tracker DB using existing matchToCards engine. (4) Compares TCDB status vs tracker status, highlighting mismatches. (5) Filter by Mismatch/Match/Unmatched/All. (6) Individual 'Fix' buttons update tracker status to match TCDB. (7) Bulk 'Fix All' button for mass mismatch resolution. (8) Deduplicates matched cards. Also: removed card preview images (TCDB blocks embedding), removed t18 from backlog.", verified: false },
    { date: "2026-02-21 18:30", change: "TCDB PASTE AND VERIFY: New Paste and Verify mode in Sync tab. Paste TCDB collection page text (tab-separated tables, checklist views, plain text). Parser extracts card numbers with set context headers. Fuzzy matcher finds cards by (cardNumber, year, product) with variant tiebreaker. Bulk Verify All or individual verify buttons. Already-synced cards show green checkmarks. Unmatched lines listed for manual review. Verified cards removed from Sync queue. Player-agnostic parser foundation for V2/V3.", verified: false },
    { date: "2026-02-21 03:00", change: "BREWERS COLOR THEME: Complete visual overhaul inspired by Milwaukee Brewers palette. (1) Navy-dark backgrounds (#0a1628 base, #111a2e panels) replace pure gray. (2) Brewers gold (#FFC52F) replaces green for owned status, title, progress bar, tab accents, header stats. (3) Blue (#5b9bd5) for in-transit. (4) Summary panel text brightened throughout — headers gold, labels cream/slate, counts visible. (5) Collection card rows: gold border-left for owned, brighter variant text, brighter product names. (6) Gauge arc gold, bar tracks navy instead of dark red. (7) Scanner header gold. (8) $ toggle defaults hidden, ultra-subtle. (9) Price history readers fixed for flat array format.", verified: false },
    { date: "2026-02-21 02:00", change: "SCANNER LANDING REDESIGN: (1) Single unified paste area — no mode selection needed upfront. Paste from any source and hit Scan; auto-detects eBay, COMC, 130point, SportLots, or Whatnot from content. (2) Mode tabs hidden until first scan, then appear for switching. (3) Removed COMC CSV mode (can re-add later). (4) Saved paste buttons (eBay/COMC/SL/WN/130pt) shown inline as compact reload shortcuts. (5) Live detection preview shows which parser will be used before scanning. (6) Clear resets to auto mode.", verified: false },
    { date: "2026-02-20 23:30", change: "130PT FIXES: (1) REGEX BUG FIX: ForSale parser 3rd variant pattern had double-escaped \\b preventing Members Only/Youthquake/Stratospheric from matching. (2) VARIANT MISMATCH SCORE: Raised from 80→88 so year+product+card# matches with variant mismatch still count as high-confidence. (3) COMPACT DISPLAY: Replaced bloated card-based scanner results with sortable table (Match%/Listing/Card/$/Status/Action columns). (4) 130PT URL HELPER: Consolidated duplicate Card130Url into single pt130Url() function.", verified: false },
    { date: "2026-02-20 23:00", change: "130PT UPGRADES: (1) FOR SALE PARSER: Now parses both 'Similar Items For Sale' AND 'Sold Items' sections from 130point.com. For Sale items show tag, filterable via Sold/For Sale/Both toggle. Sold prices recorded to PRICE_HISTORY, For Sale prices shown but NOT recorded as historical. (2) VARIANT MATCHING RELAXED: When year+product+card# match but variant doesn't, returns 88% match with warning instead of 'No match found'. Title-scan threshold lowered from 90→85. (3) 130PT LINKS: Teal 'P' link on every card across all panels (Lookup, Detailed, Scanner, Prices) links to 130point.com search for that specific card. (4) Auto-detect expanded to catch For Sale-only pages.", verified: false },
    { date: "2026-02-20 22:00", change: "130POINT SOLD SCANNER: New '130pt' mode in Scanner tab. Paste 130point.com sold listings to import actual sale prices (Best Offer shows real accepted price, not inflated list price). Filters for Tyler Black baseball only (rejects 30+ other Tyler athletes, non-cards, breaks). Shows sale date + BO discount% in price cell. Auto-detects 130pt data pasted in wrong tab. Prices recorded to PRICE_HISTORY with '130point' source. Prices tab filter includes teal 130point button. Same table/filter/match infrastructure as all other scanner modes.", verified: false },
    { date: "2026-02-20 01:30", change: "HIDE PRICES TOGGLE + SUMMARY COMPACTION + SN PROMINENCE: (1) $ toggle hides all prices/sparklines across panels. (2) Detailed spent bar shows total spent + cheapest scanner prices for needed cards. (3) Detailed table: merged SN/My# into one column, responsive CSS hides Notes (<900px) and Date (<750px), tighter padding throughout. (4) SN now pops yellow/bold everywhere: table cells, inputs, labels, expanded views, collection cards. (5) Summary dashboard compacted: smaller gauge, tighter year bars, checkpoints converted from 4x2 card grid to compact inline progress bars with %, label, and counts all readable. SN slider and rarest cards sections tightened. Fixed crash: targetByCardId built in main component. Removed duplicate globalPriceKey/Sparkline.", verified: false },
    { date: "2026-02-19 21:30", change: "MISSING SN + PRINT RUN OVERRIDE: (1) New editable Print Run field in card detail — persists to storage. Enter '?' to mark card as serial-numbered with unknown print run. (2) 'SN?' badge on card rows for Missing SN cards. (3) Detailed panel 'Missing SN (SN?)' filter option. (4) Serial field now editable for SN? cards. (5) Cleanup flags SN? cards as missing serial. (6) TARGET PRICE IN LOOKUP+DETAILED: Cards with active targets show 🎯$price badge with lowest target price — click navigates to Targets tab filtered to that card. (7) TARGETS PANEL: Seller column replaced with listing Type column showing Auction 🔨 (with bid count), Best Offer 🤝 OBO, or BIN badges. Auction/BIN info now saved when creating targets. Platform shown via existing Src column. Card-specific filter with clear button. Removed duplicate TargetsPanel and loadTargets/saveTargets definitions. Fixed crash from targetByCardId in CleanupPanel/SyncPanel.", verified: false },
    { date: "2026-02-19 13:30", change: "DUPLICATE DEDUP + QTY SYSTEM: (1) Fixed 56 duplicate card entries (same product/cardNum/variant/copies) showing as separate 'need' items. Primary card kept, hidden dupes filtered from collection/stats/lookup. (2) Added qty field with +/- buttons — qty > 1 implies extra copies for sale/trade. (3) Fixed UTF-8 encoding corruption (66 sequences). (4) SCANNER CARD# FILTERS: Quick-filter buttons by card number sorted by frequency. (5) PRICE DROP ALERTS: Changed from emerald to amber color for better distinction. Expanding a price drop row acknowledges it and reverts to regular watch styling.", verified: false },
    { date: "2026-02-18 20:30", change: "EBAY PARSER: Stop parsing at 'Inspired by your activity', 'Pick up where you left off', and 'Related Searches' sections — these eBay recommendation/watchlist areas have abbreviated data without bid counts or listing types, causing auctions at $0.99 current bid to appear as BIN deals. Also added $0.99 safeguard: any listing at ≤$0.99 with no detected listing type is auto-flagged as auction with '?' bids.", verified: false },
    { date: "2026-02-18 20:00", change: "TARGET = WATCH SUPERSET: Active targets now also store watchPrice and get price drop alerts (both ↓$X badge and emerald highlight). PRICES PANEL REDESIGN: (1) Renamed 'Price History' → 'Price Scanner', shows lowest seen price instead of latest. (2) Default sort: cheapest first for Need filter. (3) Scanner-like row styling: green bg for need, cyan for transit, blue for owned. (4) Low column shows lowest + hi price range when multiple scans. (5) Expanded detail: Lowest stat now green-highlighted and first. (6) Need summary: shows total cards and sum at lowest prices.", verified: false },
    { date: "2026-02-18 19:30", change: "WATCHED CARD UX: (1) More expensive duplicate listings for WATCHED cards hidden — only cheapest per card shows. (2) Watched cards show 🎯 in row to upgrade to active target. (3) PRICE DROP ALERTS: When a targeted/watched card appears cheaper than when saved, row highlights emerald green with ↓$X badge. Expanded detail shows was/now/save banner. watchPrice stored at time of targeting.", verified: false },
    { date: "2026-02-18 19:00", change: "PIN CORRUPTION FIX + MATCHING IMPROVEMENTS: (1) Removed blanket override rewrite from reassignPrice() that corrupted unrelated scanner pins. (2) Parsed product bonus: candidates matching EBAY_PRODUCTS result get full marks, less-specific products penalized (fixes Sapphire→Pearl). (3) 'youthquake' compound term joining. (4) normW synonyms: patch/jersey/relic→swatch, triple→trio, double→dual. (5) Scaled print-run penalty: title with no PR now penalizes ≤10 at -18, ≤25 at -15, ≤50 at -12, ≤101 at -10, ≤199 at -6, ≤299 at -4, 300+ at -2 (was flat -10). Fixes plain Refractors /499 losing to Pearl Refractors. (6) Prices button in Lookup now searches product+cardNumber instead of cardNumber+variant for broader results.", verified: false },
    { date: "2026-02-18 18:30", change: "MATCHING FIX: Added normW synonym mappings for memorabilia terms (patch/jersey/relic/threads → swatch, triple → trio, double → dual). Fixes National Treasures 'Triple Patch' listings matching to wrong variant (Dual instead of Trio). Also stripped brand names (Topps/Panini/Bowman/etc) from all eBay search URLs - sellers often omit brand names so including them reduces results.", verified: false },
    { date: "2026-02-18 18:30", change: "MATCHING FIX: Added normW synonym mappings for memorabilia terms (patch/jersey/relic/threads → swatch, triple → trio, double → dual). Fixes National Treasures 'Triple Patch' listings matching to wrong variant (Dual instead of Trio). Also stripped brand names (Topps/Panini/Bowman/etc) from all eBay search URLs - sellers often omit brand names so including them reduces results.", verified: false },
    { date: "2026-02-18 17:30", change: "LOOKUP TAB UPGRADE: (1) New filters: AU (autographs only), SN (serial numbered only), MEM (memorabilia only), ≤PR input (max print run, e.g. 50 shows /50 and under), plus ✕all to clear. (2) Detail card now has SEARCH MARKETPLACES section: eBay Card (exact variant), eBay Set (all variants of that card# in set), eBay Super (multi-query, when enabled), COMC Card (specific), COMC Set (all variants). (3) REFERENCE section: TCDB, 130point sold prices, Prices tab (pre-filtered), View #XX (Detailed tab by card#), Full Set (Detailed tab by product). (4) Product group headers now show quick eBay/COMC/130pt/Detailed links when expanded. (5) PricesPanel accepts initialSearch prop from Lookup navigation.", verified: false },
    { date: "2026-02-18 17:30", change: "LOOKUP TAB UPGRADE: (1) New filters: AU (autographs only), SN (serial numbered only), MEM (memorabilia only), ≤PR input (max print run, e.g. 50 shows /50 and under), plus ✕all to clear. (2) Detail card now has SEARCH MARKETPLACES section: eBay Card (exact variant), eBay Set (all variants of that card# in set), eBay Super (multi-query, when enabled), COMC Card (specific), COMC Set (all variants). (3) REFERENCE section: TCDB, 130point sold prices, Prices tab (pre-filtered), View #XX (Detailed tab by card#), Full Set (Detailed tab by product). (4) Product group headers now show quick eBay/COMC/130pt/Detailed links when expanded. (5) PricesPanel accepts initialSearch prop from Lookup navigation.", verified: false },
    { date: "2026-02-18 17:30", change: "LOOKUP TAB UPGRADE: (1) New filters: AU (autographs only), SN (serial numbered only), MEM (memorabilia only), ≤PR input (max print run, e.g. 50 shows /50 and under), plus ✕all to clear. (2) Detail card now has SEARCH MARKETPLACES section: eBay Card (exact variant), eBay Set (all variants of that card# in set), eBay Super (multi-query, when enabled), COMC Card (specific), COMC Set (all variants). (3) REFERENCE section: TCDB, 130point sold prices, Prices tab (pre-filtered), View #XX (Detailed tab by card#), Full Set (Detailed tab by product). (4) Product group headers now show quick eBay/COMC/130pt/Detailed links when expanded. (5) PricesPanel accepts initialSearch prop from Lookup navigation.", verified: false },
    { date: "2026-02-18 17:30", change: "LOOKUP TAB UPGRADE: (1) New filters: AU (autographs only), SN (serial numbered only), MEM (memorabilia only), ≤PR input (max print run, e.g. 50 shows /50 and under), plus ✕all to clear. (2) Detail card now has SEARCH MARKETPLACES section: eBay Card (exact variant), eBay Set (all variants of that card# in set), eBay Super (multi-query, when enabled), COMC Card (specific), COMC Set (all variants). (3) REFERENCE section: TCDB, 130point sold prices, Prices tab (pre-filtered), View #XX (Detailed tab by card#), Full Set (Detailed tab by product). (4) Product group headers now show quick eBay/COMC/130pt/Detailed links when expanded. (5) PricesPanel accepts initialSearch prop from Lookup navigation.", verified: false },
    { date: "2026-02-18 17:00", change: "BUG FIX - STALE SCAN RESULTS: Pasting new text or loading saved paste now immediately clears old scan results. Previously, old parsed results persisted when new content was pasted into any scanner mode (COMC/eBay/SportLots/Whatnot), causing confusion. Fixed all 13 input handlers: 4 Paste Clipboard buttons, 4 Last Paste buttons, and 5 textarea onChange handlers now call setParsed([])+setApplied({}) alongside setRawInput().", verified: false },
    { date: "2026-02-18 17:00", change: "BUG FIX - STALE SCAN RESULTS: Pasting new text or loading saved paste now immediately clears old scan results. Previously, old parsed results persisted when new content was pasted into any scanner mode (COMC/eBay/SportLots/Whatnot), causing confusion. Fixed all 13 input handlers: 4 Paste Clipboard buttons, 4 Last Paste buttons, and 5 textarea onChange handlers now call setParsed([])+setApplied({}) alongside setRawInput().", verified: false },
    { date: "2026-02-18 16:30", change: "CARD # FILTER + NAV: Prices panel 'View Set' split into 'View #X' (filters by card number) and 'Full Set' (whole product). Card number clickable in table rows to view all variants. DetailedPanel gets dCardNum filter state with purple active tag and clear button. All navigation paths properly wire both product and card number filters.", verified: false },
    { date: "2026-02-18 16:30", change: "CARD # FILTER + NAV: Prices panel 'View Set' split into 'View #X' (filters by card number) and 'Full Set' (whole product). Card number clickable in table rows to view all variants. DetailedPanel gets dCardNum filter state with purple active tag and clear button. All navigation paths properly wire both product and card number filters.", verified: false },
    { date: "2026-02-18 16:00", change: "REASSIGNMENT SYNC FIX: Scanner and Prices panel reassignments now stay in sync. (1) Scanner assignCandidate: moves today's price entries from old priceKey to new priceKey, records current listing price under correct card. Older entries preserved on old key as safety. (2) Prices panel reassignPrice: updates scanner COMC overrides pointing to old card IDs so future scans match correctly. Previously the two systems operated independently causing price data to appear under wrong cards.", verified: false },
    { date: "2026-02-18 16:00", change: "REASSIGNMENT SYNC FIX: Scanner and Prices panel reassignments now stay in sync. (1) Scanner assignCandidate: moves today's price entries from old priceKey to new priceKey, records current listing price under correct card. Older entries preserved on old key as safety. (2) Prices panel reassignPrice: updates scanner COMC overrides pointing to old card IDs so future scans match correctly. Previously the two systems operated independently causing price data to appear under wrong cards.", verified: false },
    { date: "2026-02-18 16:00", change: "REASSIGNMENT SYNC FIX: Scanner and Prices panel reassignments now stay in sync. (1) Scanner assignCandidate: moves today's price entries from old priceKey to new priceKey, records current listing price under correct card. Older entries preserved on old key as safety. (2) Prices panel reassignPrice: updates scanner COMC overrides pointing to old card IDs so future scans match correctly. Previously the two systems operated independently causing price data to appear under wrong cards.", verified: false },
    { date: "2026-02-18 16:00", change: "REASSIGNMENT SYNC FIX: Scanner and Prices panel reassignments now stay in sync. (1) Scanner assignCandidate: moves today's price entries from old priceKey to new priceKey, records current listing price under correct card. Older entries preserved on old key as safety. (2) Prices panel reassignPrice: updates scanner COMC overrides pointing to old card IDs so future scans match correctly. Previously the two systems operated independently causing price data to appear under wrong cards.", verified: false },
    { date: "2026-02-18 15:30", change: "STORAGE SYNC FIX: Root cause - window.storage.set() is async and may not complete before tab close, while localStorage is sync. Fix: (1) Every persistField() now writes to localStorage IMMEDIATELY (sync guarantee). (2) Both storage sources compared by _saveTimestamp on load - newest wins. (3) visibilitychange handler saves on tab switch. (4) beforeunload always saves regardless of savePending flag. This prevents the bug where status changes were lost between sessions.", verified: false },
    { date: "2026-02-18 15:30", change: "PRICE HISTORY UPGRADE: (1) All columns sortable by clicking headers with asc/desc toggle arrows. (2) Product name clickable to navigate to Detailed tab filtered to that set. (3) View Set button in expanded detail. (4) TCDB/eBay/COMC links in expanded detail. (5) Inner history table sortable by date/source/price/listings. (6) Whatnot added to source filters. (7) Source colors: eBay=yellow, COMC=green, SportLots=blue, Whatnot=violet.", verified: false },
    { date: "2026-02-18 15:00", change: "RESTORED LOST FEATURES: HeatmapPanel (lime tab), Sparkline component (Trend column in Detailed tab), totalSpent counter (lime in header), Mark All Synced button on sync warning banner. These were implemented Feb 17 but lost during subsequent session code replacement.", verified: false },
    { date: "2026-02-18 15:30", change: "STORAGE SYNC FIX: Root cause - window.storage.set() is async and may not complete before tab close, while localStorage is sync. Fix: (1) Every persistField() now writes to localStorage IMMEDIATELY (sync guarantee). (2) Both storage sources compared by _saveTimestamp on load - newest wins. (3) visibilitychange handler saves on tab switch. (4) beforeunload always saves regardless of savePending flag. This prevents the bug where status changes were lost between sessions.", verified: false },
    { date: "2026-02-18 15:30", change: "PRICE HISTORY UPGRADE: (1) All columns sortable by clicking headers with asc/desc toggle arrows. (2) Product name clickable to navigate to Detailed tab filtered to that set. (3) View Set button in expanded detail. (4) TCDB/eBay/COMC links in expanded detail. (5) Inner history table sortable by date/source/price/listings. (6) Whatnot added to source filters. (7) Source colors: eBay=yellow, COMC=green, SportLots=blue, Whatnot=violet.", verified: false },
    { date: "2026-02-18 15:00", change: "RESTORED LOST FEATURES: HeatmapPanel (lime tab), Sparkline component (Trend column in Detailed tab), totalSpent counter (lime in header), Mark All Synced button on sync warning banner. These were implemented Feb 17 but lost during subsequent session code replacement.", verified: false },
    { date: "2026-02-18 01:00", change: "PINNED TARGETS TAB: New Targets tab for saving listings across all scanners. Two states: Active (want to buy) and Watching (too expensive, revisit later). Filter by status/source, sort by date/price/year. Notes, bulk cleanup, Transit/Own actions move to collection. Scanner rows highlight targeted cards with pink or gray border.", verified: false },
    { date: "2026-02-18 00:30", change: "WHATNOT SCANNER: Full Whatnot marketplace scanner with parseWhatnotText(). Violet theme, seller extraction, GBP detection, title dedup, price history. Reuses eBay title parser. Added 11 Tyler name exclusions (Fitzgerald, Callihan, Locklear, etc).", verified: false },
    { date: "2026-02-18 00:00", change: "MATCHING FIX: Extended all 8 eBay-only matching phases to also work for Whatnot source. Title scan, variant fallback, broad search, embedded card#, year+product, single-card heuristic, Pick dialog, ambiguous price filter all now support Whatnot.", verified: false },
    { date: "2026-02-17 23:30", change: "BUG FIXES: (1) Pick dialog deduplicates candidates by cardNumber+cardSet+copies. (2) SN column shows DB print run as fallback in purple. (3) rawInput cleared on mode switch. (4) SportLots/Whatnot exclude from legacy card-block rendering.", verified: false },
    { date: "2026-02-15 20:00", change: "STORAGE FIX: Legacy migration now reads ALL 6 old keys (statuses, details, forsale, synced, dirty, changelog) with 400ms rate-limit delays. Skips keys that already have data in consolidated. Sets _migrationComplete flag to prevent re-migration. Handles 3 cases: fresh start, full legacy migration, and partial-migration recovery.", verified: true },
    { date: "2026-02-15 17:00", change: "CONSOLIDATED STORAGE: All data in single key tb-alldata-v1. One read on load, one debounced write (500ms). Eliminates rate-limit cascade.", verified: true },
    { date: "2026-02-15 16:30", change: "Fixed storage rate-limit: removed retries on load (were multiplying calls from 8 to 24), replaced with single attempt per key + 1s gaps. Changelog save uses 200ms stagger to avoid colliding with status save. Backup fallback restores details+changelog if primary reads fail.", verified: false },
    { date: "2026-02-15 16:15", change: "Fixed storage rate-limiting on load: safeGet helper retries each read 3x with 500ms backoff, 300ms delay between each storage key read. Prevents 'Internal server error' cascade that caused missing details/changelog/forsale data.", verified: false },
    { date: "2026-02-15 16:00", change: "Collection tab layout: card list now fills available screen height with its own scrollbar. Pagination/page-size/legend pinned at bottom, always visible. Other tabs unaffected.", verified: false },
    { date: "2026-02-15 15:30", change: "STORAGE HARDENING: (1) Changelog saves immediately, no 800ms debounce. (2) Details save retries 3x like statuses. (3) Read-back verification on status saves. (4) beforeunload flushes all pending saves. (5) Auto-backup every 5min with restore-from-backup on load. (6) All silent catch blocks now show errors in diagnostics bar.", verified: false },
    { date: "2026-02-15 15:00", change: "Added keyboard shortcuts: j/k or arrows navigate, o/i/n/s set status, f for-sale, e eBay, Enter expand, [/] pages, 1-0 tabs, ? help. Focus highlight + auto-scroll. Disabled when typing in inputs.", verified: false },
    { date: "2026-02-15 14:30", change: "Added batch status update feature to Detailed tab. Toggle 'Batch' mode to show checkboxes, select individual/page/all filtered cards, then apply status in bulk. Processes in chunks of 20 with full changelog tracking.", verified: false },
    { date: "2026-02-15 12:00", change: "CRITICAL FIX: Rebuilt owned/intransit arrays from CSV source of truth. 617 cards had wrong statuses due to ID mapping error during original data entry. 1/1 count corrected from 78 to 20.", verified: false },
    { date: "2026-02-12 23:15", change: "Added MISSING_FROM_TCDB classifier for released products not yet on TCDB (e.g. 2024 Panini Three and Two). Shows as 'Pending TCDB Add' (amber) - separate from pre-production proofs. 14 cards tracked (IDs 968-981).", verified: false },
    { date: "2026-02-11 22:10", change: "Documented pre-production proof handling: NOT_ON_TCDB set excludes from sync & counts, shows separately. Working as intended.", verified: false },
    { date: "2026-02-11 22:05", change: "Updated header stats: combined owned+transit, red for need (darker for 1/1s), visual progress bar excluding 1/1s on right", verified: true },
    { date: "2026-02-11 22:00", change: "Added user input classification to task board (Min/Med/High) and new task suggestions with recommendation system", verified: true },
    { date: "2026-02-11 21:55", change: "Added verification checkmarks (OK) to version log showing confirmed working versions for safe recovery points", verified: true },
    { date: "2026-02-11 21:50", change: "Added task board tab (virtual scrum board) with backlog/in-progress/done columns for project planning", verified: true },
    { date: "2026-02-11 21:45", change: "Added recovery reminder to version log and instructions (check log first, revert to most recent working version, not v25)", verified: true },
    { date: "2026-02-11 21:40", change: "Added compact version log tab; streamlined changelog panel (less spacing, smaller buttons, cleaner layout)", verified: true },
    { date: "2026-02-11 21:24", change: "Permanent filename (tyler_black_tracker.jsx) with no version numbers; added TEST CARD for data persistence testing", verified: true },
    { date: "2026-02-11 21:10", change: "Implemented eBay Super Search feature with toggle button (SUPER) that opens 5 search query variations per card", verified: true },
    { date: "2026-02-11 02:03", change: "Resolved data persistence issues caused by storage race conditions; implemented delayed save mechanisms and retry logic", verified: true },
    { date: "2026-02-10 18:00", change: "Enhanced changelog with session-based grouping and revert functionality", verified: true },
    { date: "2026-02-09 14:00", change: "Added COMC scanner with intelligent fuzzy matching for marketplace listings", verified: true },
    { date: "2026-02-08 16:00", change: "Implemented comprehensive sync tracking system for TCDB integration", verified: true },
    { date: "2026-02-07 12:00", change: "Added cleanup panel for detecting and managing duplicate cards and data quality issues", verified: true },
    { date: "2026-02-06 15:00", change: "Enhanced detailed view with inline editing capabilities for card details", verified: true },
    { date: "2026-02-05 10:00", change: "Implemented for-sale tracking functionality for managing cards available for sale or trade", verified: true },
    { date: "2026-02-04 14:00", change: "Added summary statistics panel with collection progress visualization", verified: true },
    { date: "2026-02-03 11:00", change: "Built card lookup panel with advanced search and filter capabilities", verified: true },
    { date: "2026-02-02 16:00", change: "Implemented export functionality with CSV download and manual save checkpoints", verified: true },
    { date: "2026-02-01 13:00", change: "Added persistent browser storage using window.storage API with version-suffixed keys (tb-statuses-v2, tb-details-v2, etc.)", verified: true },
    { date: "2026-01-31 15:00", change: "Integrated eBay, COMC, and TCDB quick links for each card", verified: true },
    { date: "2026-01-30 10:00", change: "Implemented multi-level filtering system (year, product, status, card number, search)", verified: true },
    { date: "2026-01-29 14:00", change: "Added pagination system for handling large collections efficiently", verified: true },
    { date: "2026-01-28 11:00", change: "Built card detail tracking (price paid, serial numbers, purchase dates, notes)", verified: true },
    { date: "2026-01-27 16:00", change: "Implemented three-state status system (owned, in_transit, not_owned)", verified: true },
    { date: "2026-01-26 13:00", change: "Created initial card grid layout with color-coded status indicators", verified: true },
    { date: "2026-01-25 10:00", change: "Initial tracker setup with 1,584 Tyler Black baseball cards from RAW_DATA", verified: true }
  ];

  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-500 mb-3">
        File: tyler_black_tracker.jsx (permanent) | Storage: tb-statuses-v2, tb-details-v2, tb-forsale-v2, tb-synced-v2, tb-dirty-v2, tb-checkpoint-v2, tb-changelog-v1
      </div>
      
      <div className="space-y-1">
        {VERSION_HISTORY.map(function(v, idx) {
          return (
            <div key={idx} className="flex gap-3 text-xs border-b border-gray-800 pb-1">
              <span className="text-gray-500 font-mono whitespace-nowrap">{v.date}</span>
              {v.verified && <span className="text-green-500 shrink-0" title="Verified working">OK</span>}
              <span className="text-gray-300">{v.change}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 p-2 bg-amber-950/20 border border-amber-800/30 rounded text-xs text-amber-300">
        <span className="font-bold">!! Recovery Note:</span> If tracker breaks, check this log FIRST. Only revert to most recent <span className="text-green-400">OK verified</span> version, not all the way to v25. Saves time by not rebuilding already-working features.
      </div>

    </div>
  );
}

function ChangelogPanel({ changelog, setChangelog, statuses, cardDetails, forSaleFlags, setStatuses, setCardDetails, setForSaleFlags, saveStatuses, saveDetails, setDirtyIds, currentSessionId, clearUndoStack, persistField }) {
  var [viewMode, setViewMode] = useState("sessions");
  var [typeFilter, setTypeFilter] = useState("all");
  var [dayLimit, setDayLimit] = useState(50);
  var [confirmClear, setConfirmClear] = useState(false);
  var [confirmRevert, setConfirmRevert] = useState(null);

  var STATUS_LABELS = { owned: "Owned", in_transit: "In Transit", not_owned: "Not Owned" };
  var FIELD_LABELS = { serial: "Serial #", price: "Price", date: "Date", notes: "Notes", status: "Status", for_sale: "For Sale" };
  var TYPE_COLORS = { status: "text-yellow-400", detail: "text-cyan-400", forsale: "text-pink-400" };
  var TYPE_LABELS = { status: "Status", detail: "Detail", forsale: "For Sale" };

  function fmtVal(type, field, val) {
    if (!val && val !== 0) return "\u2014";
    if (field === "status" || type === "status") return STATUS_LABELS[val] || val;
    return String(val);
  }
  function fmtTime(iso) {
    try { return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); } catch (e) { return ""; }
  }
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }); } catch (e) { return ""; }
  }
  function fmtDateTime(iso) {
    try { return new Date(iso).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); } catch (e) { return ""; }
  }

  // Group by session
  var sessions = useMemo(function() {
    var map = {};
    changelog.forEach(function(e) {
      var sid = e.sid || "unknown";
      if (!map[sid]) map[sid] = { sid: sid, entries: [], firstTs: e.ts, lastTs: e.ts };
      map[sid].entries.push(e);
      if (e.ts < map[sid].firstTs) map[sid].firstTs = e.ts;
      if (e.ts > map[sid].lastTs) map[sid].lastTs = e.ts;
    });
    return Object.values(map).sort(function(a, b) { return b.lastTs.localeCompare(a.lastTs); });
  }, [changelog]);

  var filtered = useMemo(function() {
    if (typeFilter === "all") return changelog;
    return changelog.filter(function(e) { return e.type === typeFilter; });
  }, [changelog, typeFilter]);

  // Group by date for flat view
  var grouped = useMemo(function() {
    var groups = [];
    var currentDay = null;
    filtered.slice(0, dayLimit).forEach(function(entry) {
      var day = fmtDate(entry.ts);
      if (day !== currentDay) { currentDay = day; groups.push({ day: day, entries: [] }); }
      groups[groups.length - 1].entries.push(entry);
    });
    return groups;
  }, [filtered, dayLimit]);

  function clearChangelog() {
    if (!confirmClear) { setConfirmClear(true); setTimeout(function() { setConfirmClear(false); }, 3000); return; }
    setChangelog([]);
    persistField("changelog", []);
    setConfirmClear(false);
  }

  function revertSession(sid) {
    if (confirmRevert !== sid) { setConfirmRevert(sid); setTimeout(function() { setConfirmRevert(null); }, 4000); return; }
    var entries = changelog.filter(function(e) { return e.sid === sid; }).reverse();
    var newStatuses = { ...statuses };
    var newDetails = JSON.parse(JSON.stringify(cardDetails));
    var newForSale = { ...forSaleFlags };
    var dirtyToRemove = new Set();
    entries.forEach(function(e) {
      if (e.type === "status") {
        newStatuses[e.cardId] = e.from || "not_owned";
        if (e.from === "not_owned" || !e.from) dirtyToRemove.add(e.cardId);
      } else if (e.type === "detail") {
        if (!newDetails[e.cardId]) newDetails[e.cardId] = {};
        if (e.from) { newDetails[e.cardId][e.field] = e.from; }
        else { delete newDetails[e.cardId][e.field]; }
      } else if (e.type === "forsale") {
        if (e.from === "Yes") newForSale[e.cardId] = true;
        else delete newForSale[e.cardId];
      }
    });
    setStatuses(newStatuses);
    setCardDetails(newDetails);
    setForSaleFlags(newForSale);
    saveStatuses(newStatuses);
    saveDetails(newDetails);
    persistField("forsale", newForSale);
    if (dirtyToRemove.size > 0) {
      setDirtyIds(function(prev) {
        var next = new Set(prev);
        dirtyToRemove.forEach(function(id) { next.delete(id); });
        persistField("dirty", [...next]);
        return next;
      });
    }
    var remaining = changelog.filter(function(e) { return e.sid !== sid; });
    setChangelog(remaining);
    persistField("changelog", remaining);
    setConfirmRevert(null);
    if (clearUndoStack) clearUndoStack();
  }

  var typeCounts = useMemo(function() {
    var c = { status: 0, detail: 0, forsale: 0 };
    changelog.forEach(function(e) { if (c[e.type] !== undefined) c[e.type]++; });
    return c;
  }, [changelog]);

  function renderEntry(entry, key) {
    var tc = TYPE_COLORS[entry.type] || "text-gray-400";
    var fieldLabel = FIELD_LABELS[entry.field] || entry.field;
    return (
      <div key={key} className="flex items-start gap-2 px-2 py-1 text-xs border-b border-gray-800/50">
        <span className="text-[10px] text-gray-600 w-12 shrink-0">{fmtTime(entry.ts)}</span>
        <span className={"text-[10px] font-bold w-10 shrink-0 " + tc}>{TYPE_LABELS[entry.type]}</span>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-300 truncate" title={entry.cardLabel}>{entry.cardLabel}</div>
          <div className="flex items-center gap-1 text-[10px]">
            <span className="text-gray-500">{fieldLabel}:</span>
            <span className="text-red-400/70 line-through">{fmtVal(entry.type, entry.field, entry.from)}</span>
            <span className="text-gray-600">{"\u2192"}</span>
            <span className="text-green-400">{fmtVal(entry.type, entry.field, entry.to)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-400">{changelog.length} changes</div>
        <div className="flex gap-1">
          <button onClick={function() { setViewMode("sessions"); }} className={"px-2 py-0.5 rounded text-xs " + (viewMode === "sessions" ? "bg-rose-700 text-white" : "bg-gray-800 text-gray-500")}>Sessions</button>
          <button onClick={function() { setViewMode("flat"); }} className={"px-2 py-0.5 rounded text-xs " + (viewMode === "flat" ? "bg-rose-700 text-white" : "bg-gray-800 text-gray-500")}>Flat</button>
          {changelog.length > 0 && (
            <button onClick={clearChangelog} className={"px-2 py-0.5 rounded text-xs " + (confirmClear ? "bg-red-900 text-red-300" : "text-gray-500 hover:text-red-400")}>{confirmClear ? "Confirm?" : "Clear"}</button>
          )}
        </div>
      </div>

      {/* Filter chips for flat view */}
      {viewMode === "flat" && (
        <div className="flex gap-1 mb-2">
          {[
            { id: "all", label: "All", count: changelog.length },
            { id: "status", label: "Status", count: typeCounts.status },
            { id: "detail", label: "Details", count: typeCounts.detail },
            { id: "forsale", label: "For Sale", count: typeCounts.forsale }
          ].map(function(f) {
            return (
              <button key={f.id} onClick={function() { setTypeFilter(f.id); setDayLimit(50); }} className={"px-2 py-0.5 rounded text-xs " + (typeFilter === f.id ? "bg-gray-600 text-white" : "bg-gray-800 text-gray-500")}>
                {f.label} <span className="opacity-60">({f.count})</span>
              </button>
            );
          })}
        </div>
      )}

      {changelog.length === 0 ? (
        <div className="text-center py-8 text-xs text-gray-500">No changes yet</div>
      ) : viewMode === "sessions" ? (
        <div className="space-y-2">
          {sessions.map(function(session) {
            var isCurrent = session.sid === currentSessionId;
            var statusChanges = session.entries.filter(function(e) { return e.type === "status"; }).length;
            var detailChanges = session.entries.filter(function(e) { return e.type === "detail"; }).length;
            var fsChanges = session.entries.filter(function(e) { return e.type === "forsale"; }).length;
            return (
              <div key={session.sid} className={"border rounded " + (isCurrent ? "border-rose-700/50" : "border-gray-700/50")}>
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-800">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-300">{fmtDateTime(session.firstTs)}</span>
                      {isCurrent && <span className="text-[9px] px-1 py-0.5 rounded bg-rose-800 text-rose-300">Current</span>}
                    </div>
                    <div className="flex gap-2 mt-0.5 text-[10px]">
                      {statusChanges > 0 && <span className="text-yellow-400">{statusChanges} status</span>}
                      {detailChanges > 0 && <span className="text-cyan-400">{detailChanges} detail</span>}
                      {fsChanges > 0 && <span className="text-pink-400">{fsChanges} sale</span>}
                    </div>
                  </div>
                  <button onClick={function() { revertSession(session.sid); }} className={"px-2 py-1 rounded text-[10px] " + (confirmRevert === session.sid ? "bg-red-700 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600")}>
                    {confirmRevert === session.sid ? "Confirm?" : "\u21a9"}
                  </button>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {session.entries.map(function(entry, ei) { return renderEntry(entry, session.sid + "-" + ei); })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {grouped.map(function(group, gi) {
            return (
              <div key={gi}>
                <div className="text-[10px] text-gray-500 uppercase px-2 py-1 sticky top-0 bg-gray-950">{group.day}</div>
                <div>
                  {group.entries.map(function(entry, ei) { return renderEntry(entry, gi + "-" + ei); })}
                </div>
              </div>
            );
          })}
          {filtered.length > dayLimit && (
            <button onClick={function() { setDayLimit(function(prev) { return prev + 50; }); }} className="w-full py-1 text-xs text-gray-500 hover:text-gray-300 bg-gray-800/50 rounded">
              +{filtered.length - dayLimit} more
            </button>
          )}
        </div>
      )}
    </div>
  );
}


function ExportPanel({ statuses, cardDetails, forSaleFlags, needsSync, lastCheckpoint, setLastCheckpoint, isSavingCheckpoint, setIsSavingCheckpoint, saveCount, flashSave, saveToast, exportCsvRef, persistField, setStatuses, setCardDetails, setForSaleFlags, allDataRef }) {
  var [exportMsg, setExportMsg] = useState("");
  var [showAdvanced, setShowAdvanced] = useState(false);

  var changeStats = useMemo(function() {
    var owned = 0, intransit = 0, notOwned = 0, withSerial = 0, withPrice = 0, withDate = 0, withNotes = 0, forSale = 0;
    var visibleTotal = 0;
    ALL_CARDS.forEach(function(card) {
      if (HIDDEN_DUPES.has(card.id)) return;
      visibleTotal++;
      var s = statuses[card.id] || "not_owned";
      if (s === "owned") owned++;
      else if (s === "in_transit") intransit++;
      else notOwned++;
      var d = cardDetails[card.id] || {};
      var qtyVal = parseInt(d.qty) || 1;
      if (forSaleFlags[card.id] || qtyVal > 1) forSale++;
      if (d.serial) withSerial++;
      if (d.price) withPrice++;
      if (d.date) withDate++;
      if (d.notes) withNotes++;
    });
    var dupeCount = DUPES.length;
    return { owned: owned, intransit: intransit, notOwned: notOwned, withSerial: withSerial, withPrice: withPrice, withDate: withDate, withNotes: withNotes, forSale: forSale, dupeCount: dupeCount, total: visibleTotal };
  }, [statuses, cardDetails, forSaleFlags]);

  function escCsv(val) {
    var s = String(val == null ? "" : val);
    if (s.indexOf(",") >= 0 || s.indexOf('"') >= 0 || s.indexOf("\n") >= 0) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  function buildFullName(card) {
    var base = card.product + " ";
    if (card.cardSet && card.cardSet !== "Base") base += "- " + card.cardSet + " ";
    base += "#" + card.cardNumber;
    return base;
  }

  function extractYear(product) {
    var m = product.match(/^(\d{4})/);
    return m ? m[1] : "";
  }

  function extractProductName(product) {
    var m = product.match(/^\d{4}\s+(.+?)(\s*\(.*\))?$/);
    return m ? m[1] : product.replace(/^\d{4}\s*/, "");
  }

  function statusLabel(s) {
    if (s === "owned") return "Owned";
    if (s === "in_transit") return "In Transit";
    return "Not Owned";
  }

  function generateCsv() {
    var header = "full_name,year,product,variant,card_number,serial_numbered,print_run,is_auto,is_mem,is_rc,attributes,status,quantity,my_serial_number,price_paid,purchase_date,notes,is_duplicate,dupe_type,source,duplicate_type,synced_to_tcdb,ebay_url,ebay_order_url";
    var rows = [header];

    ALL_CARDS.forEach(function(card) {
      var s = statuses[card.id] || "not_owned";
      var d = cardDetails[card.id] || {};
      var cardQty = parseInt(d.qty) || 1;
      var qty = (s === "owned" || s === "in_transit") ? cardQty : 0;
      var year = extractYear(card.product);
      var prodName = extractProductName(card.product);
      var fullName = buildFullName(card);
      var isAuto = (card.cardSet && /autograph|auto|signature/i.test(card.cardSet)) ? "Yes" : "";
      var isMem = (card.cardSet && /relic|patch|jersey|swatch|material|memorabilia|glove|hat|thread|gear|sock/i.test(card.cardSet)) ? "Yes" : "";
      var isRc = (card.product.match(/^202[4-9]/) && !/Draft|Prospect|Pro Debut|Minor|Debut|Inception|Bowman's Best|Bowman Sterling|Bowman Platinum|Chrome Sapphire|Leaf|Panini|Pro Set|Sapphire Edition|Choice/i.test(card.product)) ? "Yes" : "";
      var notOnTcdb = NOT_ON_TCDB.has(card.id);
      var synced = notOnTcdb ? "" : (needsSync.has(card.id) ? "" : "Yes");
      var ebayOid = EBAY_ORDERS[String(card.id)];
      var ebayOrderUrl = ebayOid ? "https://order.ebay.ca/ord/show?orderId=" + ebayOid : "";
      var ebayLink = EBAY_IDS.has(card.id) ? "" : "";
      var fsFlag = (forSaleFlags[card.id] || cardQty > 1) ? "For Sale" : "";

      var row = [
        fullName, year, prodName, card.cardSet, card.cardNumber,
        card.copies || "", "", isAuto, isMem, isRc, fsFlag,
        statusLabel(s), qty, d.serial || "", d.price || "",
        d.date || "", d.notes || "", "No", "",
        notOnTcdb ? "Manual" : "TCDB", "", synced, ebayLink, ebayOrderUrl
      ].map(escCsv).join(",");
      rows.push(row);
    });

    DUPES.forEach(function(dupe) {
      var parentCard = ALL_CARDS[dupe.parent_id - 1];
      if (!parentCard) return;
      var year = extractYear(parentCard.product);
      var prodName = extractProductName(parentCard.product);
      var fullName = buildFullName(parentCard);
      var dupeStatus = dupe.type === "intransit" ? "In Transit" : dupe.type === "comc" ? "In Transit" : "Owned";
      var dupeTypeLabel = dupe.type === "intransit" ? "Extra Copy (In Transit)" : dupe.type === "forsale" ? "Extra Copy (For Sale)" : dupe.type === "comc" ? "Extra Copy (COMC)" : "Extra Copy";

      var row = [
        fullName, year, prodName, parentCard.cardSet, parentCard.cardNumber,
        parentCard.copies || "", "", "", "", "", "",
        dupeStatus, 1, "", "", "", "",
        "Yes", "", "TCDB", dupeTypeLabel, "", "", ""
      ].map(escCsv).join(",");
      rows.push(row);
    });

    return rows.join("\r\n");
  }

  function generateStateJson() {
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      version: "v2",
      totalCards: ALL_CARDS.length,
      statuses: statuses,
      cardDetails: cardDetails,
      forSaleFlags: forSaleFlags,
      syncedIds: [...(needsSync || [])].length > 0 ? "has_unsynced" : "all_synced"
    }, null, 2);
  }

  async function saveCheckpoint() {
    setIsSavingCheckpoint(true);
    try {
      // Save checkpoint metadata via consolidated storage
      var cpData = {
        time: new Date().toISOString(),
        stats: { owned: changeStats.owned, intransit: changeStats.intransit, notOwned: changeStats.notOwned, total: changeStats.total },
        hash: changeStats.owned + "-" + changeStats.intransit + "-" + changeStats.withSerial + "-" + changeStats.withPrice
      };
      persistField("checkpoint", cpData);
      // Force all current state into consolidated storage
      persistField("statuses", statuses);
      persistField("forsale", forSaleFlags);
      setLastCheckpoint(cpData);

      flashSave("Checkpoint saved!");
      setExportMsg("All data saved to checkpoint at " + new Date().toLocaleTimeString());
      setTimeout(function() { setExportMsg(""); }, 4000);
    } catch (e) {
      setExportMsg("Error saving checkpoint: " + e.message);
      setTimeout(function() { setExportMsg(""); }, 5000);
    }
    setIsSavingCheckpoint(false);
  }

  function downloadCsv() {
    var csv = generateCsv();
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var ts = new Date().toISOString().slice(0,10);
    a.href = url;
    a.download = "tyler_black_master_updated_" + ts + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    flashSave("CSV downloaded!");
    setExportMsg("CSV downloaded with " + changeStats.total + " rows. Replace your project file with this.");
    setTimeout(function() { setExportMsg(""); }, 5000);
  }

  // Register downloadCsv so the top-level Export button can call it
  if (exportCsvRef) exportCsvRef.current = downloadCsv;

  function downloadJson() {
    var json = generateStateJson();
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var ts = new Date().toISOString().slice(0,10);
    a.href = url;
    a.download = "tyler_black_state_" + ts + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportMsg("State backup downloaded!");
    setTimeout(function() { setExportMsg(""); }, 4000);
  }

  function restoreFromJson(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = async function(e) {
      try {
        var data = JSON.parse(e.target.result);
        if (data.statuses && typeof data.statuses === "object") {
          var newStatuses = data.statuses;
          var newDetails = data.cardDetails || {};
          var newForSale = data.forSaleFlags || {};
          var statCount = Object.keys(newStatuses).length;
          var detailCount = Object.keys(newDetails).length;
          console.log("[restore] Parsed: " + statCount + " statuses, " + detailCount + " details");
          allDataRef.current.statuses = newStatuses;
          allDataRef.current.details = newDetails;
          allDataRef.current.forsale = newForSale;
          allDataRef.current._saveTimestamp = Date.now();
          allDataRef.current._migrationComplete = true;
          setStatuses(newStatuses);
          setCardDetails(newDetails);
          setForSaleFlags(newForSale);
          var payload = JSON.stringify(allDataRef.current);
          try { localStorage.setItem("tb-alldata-v1", payload); } catch(e2) {}
          try { localStorage.setItem("tb-alldata-backup-v1", payload); } catch(e2) {}
          setExportMsg("Saving " + statCount + " statuses + " + detailCount + " details to cloud...");
          try { await window.storage.set("tb-alldata-v1", payload); } catch(e2) {}
          setExportMsg("Restored " + statCount + " statuses + " + detailCount + " card details!");
          setTimeout(function() { setExportMsg(""); }, 5000);
        } else {
          setExportMsg("Invalid backup format.");
          setTimeout(function() { setExportMsg(""); }, 5000);
        }
      } catch (err) {
        setExportMsg("Error parsing backup: " + err.message);
        setTimeout(function() { setExportMsg(""); }, 5000);
      }
    };
    reader.readAsText(file);
  }

  function restoreSecondaryData(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = async function(e) {
      try {
        var data = JSON.parse(e.target.result);
        var restored = 0;
        var SECONDARY_KEYS = [
          "tb-price-history-v1","tb-targets-v1","tb-ebay-blocked-v1","tb-ebay-bids-v1",
          "tb-comc-overrides-v1","tb-custom-cards-v1","tb-tcdb-fixes-v1","tb-tcdb-flags-v1",
          "tb-last-ebay-paste-v1","tb-last-comc-paste-v1","tb-last-130pt-paste-v1",
          "tb-last-sportlots-paste-v1","tb-last-whatnot-paste-v1"
        ];
        var allFileKeys = Object.keys(data);
        for (var j = 0; j < allFileKeys.length; j++) {
          if (allFileKeys[j].startsWith("tb-") && SECONDARY_KEYS.indexOf(allFileKeys[j]) === -1) {
            SECONDARY_KEYS.push(allFileKeys[j]);
          }
        }
        for (var i = 0; i < SECONDARY_KEYS.length; i++) {
          var key = SECONDARY_KEYS[i];
          if (data[key] !== undefined && data[key] !== null) {
            var val = typeof data[key] === "string" ? data[key] : JSON.stringify(data[key]);
            try { localStorage.setItem(key, val); } catch(e2) {}
            try { await window.storage.set(key, val); } catch(e2) {}
            restored++;
            console.log("[restore-secondary] Restored:", key);
          }
        }
        setExportMsg("Restored " + restored + " secondary data keys! Reloading...");
        setTimeout(function() { window._skipBeforeUnloadSave = true; location.reload(); }, 1500);
      } catch(err) {
        setExportMsg("Error parsing secondary data: " + err.message);
        setTimeout(function() { setExportMsg(""); }, 5000);
      }
    };
    reader.readAsText(file);
  }

  function copyRawData() {
    var data = { statuses: statuses, cardDetails: cardDetails, forSaleFlags: forSaleFlags };
    navigator.clipboard.writeText(JSON.stringify(data)).then(function() {
      setExportMsg("State data copied to clipboard!");
      setTimeout(function() { setExportMsg(""); }, 3000);
    }).catch(function() {
      setExportMsg("Failed to copy - try JSON download instead.");
      setTimeout(function() { setExportMsg(""); }, 3000);
    });
  }

  async function saveAndDownloadCsv() {
    await saveCheckpoint();
    downloadCsv();
  }

  return (
    <div>
      {/* Save status banner */}
      <div className="mb-4 p-4 bg-gray-800/60 rounded-lg border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-bold text-lime-400">Export & Backup</div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400"></span>
            <span className="text-xs text-green-400 font-medium">Auto-saving to persistent storage</span>
          </div>
        </div>
        <p className="text-gray-400 text-xs">Changes auto-save to persistent browser storage (debounced 500ms). <strong className="text-lime-300">Export CSV</strong> periodically as a backup and to update your project files.</p>
        {lastCheckpoint && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-gray-500">Last checkpoint:</span>
            <span className="text-lime-300 font-medium">{new Date(lastCheckpoint.time).toLocaleString()}</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">{lastCheckpoint.stats.owned} owned, {lastCheckpoint.stats.intransit} in transit</span>
          </div>
        )}
      </div>

      {/* Primary action: Force Save */}
      <button onClick={saveCheckpoint} disabled={isSavingCheckpoint} className="w-full py-3.5 px-4 bg-lime-600 hover:bg-lime-500 disabled:bg-lime-800 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 transition-colors mb-2 shadow-lg shadow-lime-900/30">
        {isSavingCheckpoint ? (
          <><span className="animate-spin"></span> Saving...</>
        ) : (
          <>Force Save Now</>
        )}
      </button>
      <p className="text-xs text-gray-500 text-center mb-4">Immediately flush all pending changes to persistent storage</p>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-gray-800 rounded-lg p-2.5 text-center">
          <div className="text-xl font-bold" style={{color:"#22c55e"}}>{changeStats.owned}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Owned</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2.5 text-center">
          <div className="text-xl font-bold" style={{color:"#86efac"}}>{changeStats.intransit}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">In Transit</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2.5 text-center">
          <div className="text-xl font-bold text-gray-400">{changeStats.notOwned}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Not Owned</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2.5 text-center">
          <div className="text-xl font-bold text-pink-400">{changeStats.forSale}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">For Sale</div>
        </div>
      </div>

      {/* Data completeness */}
      <div className="bg-gray-800/50 rounded-lg p-3 mb-4 border border-gray-700">
        <div className="text-xs font-semibold text-gray-300 mb-2">Data Completeness (Owned + In Transit)</div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center"><span className="block text-white font-bold text-sm">{changeStats.withSerial}</span><span className="text-gray-500">Serial #s</span></div>
          <div className="text-center"><span className="block text-white font-bold text-sm">{changeStats.withPrice}</span><span className="text-gray-500">Prices</span></div>
          <div className="text-center"><span className="block text-white font-bold text-sm">{changeStats.withDate}</span><span className="text-gray-500">Dates</span></div>
          <div className="text-center"><span className="block text-white font-bold text-sm">{changeStats.withNotes}</span><span className="text-gray-500">Notes</span></div>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          {changeStats.total} total rows ({ALL_CARDS.length} unique + {changeStats.dupeCount} duplicates)
        </div>
      </div>

      {/* Feedback message */}
      {exportMsg && (
        <div className="mb-4 p-3 bg-lime-900/40 border border-lime-700 rounded-lg text-lime-300 text-sm text-center font-medium">{exportMsg}</div>
      )}

      {/* Secondary actions */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <button onClick={saveAndDownloadCsv} className="flex-1 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors">
            Save + Export CSV
          </button>
          <button onClick={downloadCsv} className="flex-1 py-2.5 px-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors">
            Export CSV Only
          </button>
        </div>
        <p className="text-[10px] text-gray-500 text-center">Downloads tyler_black_master_updated.csv for project backup</p>

        <button onClick={() => setShowAdvanced(!showAdvanced)} className="w-full py-2 px-3 bg-gray-800 hover:bg-gray-750 text-gray-400 text-xs rounded-lg flex items-center justify-center gap-1 transition-colors border border-gray-700">
          {showAdvanced ? "^" : "v"} Advanced Options
        </button>
      </div>

      {showAdvanced && (
        <div className="mt-3 space-y-2 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <button onClick={downloadJson} className="w-full py-2 px-3 bg-indigo-700 hover:bg-indigo-600 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors">
            Download Full State Backup (JSON)
          </button>

          <label className="w-full py-2 px-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
            Restore from JSON Backup
            <input type="file" accept=".json" className="hidden" onChange={function(e) { if (e.target.files[0]) restoreFromJson(e.target.files[0]); e.target.value = ""; }} />
          </label>

          <label className="w-full py-2 px-3 bg-teal-700 hover:bg-teal-600 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
            Restore Secondary Data (prices, targets, scans)
            <input type="file" accept=".json" className="hidden" onChange={function(e) { if (e.target.files[0]) restoreSecondaryData(e.target.files[0]); e.target.value = ""; }} />
          </label>

          <button onClick={copyRawData} className="w-full py-2 px-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors">
            Copy State to Clipboard
          </button>

          <div className="mt-3 p-3 bg-gray-800/40 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-500 font-semibold mb-1">How storage works:</div>
            <ol className="text-[10px] text-gray-400 space-y-0.5 list-decimal list-inside">
              <li>All changes auto-save to persistent storage (single key: tb-alldata-v1)</li>
              <li>"Force Save" flushes any pending writes immediately</li>
              <li>"Export CSV" downloads your data - upload to project files as backup</li>
              <li>JSON backup captures complete state for disaster recovery</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}


// Mount the app — wait for cloud hydration so useState initializers see hydrated localStorage
(async function() {
  if (window.storageReady) { try { await window.storageReady; } catch(e) {} }
  ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(TylerBlackTracker));
})();
