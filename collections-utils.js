/* Private sport collections: source evidence is additive, ownership is never inferred from a checklist. */
(function(root) {
  "use strict";
  const SPORTS = ["racing","baseball","basketball","football","hockey","soccer","other"];
  const STATUS_LABELS = {owned:"Owned",in_transit:"In transit",wanted:"Want",catalog:"Checklist"};
  const own = (obj,key) => Object.prototype.hasOwnProperty.call(obj,key);
  const clone = value => JSON.parse(JSON.stringify(value));
  const text = value => String(value == null ? "" : value).trim().replace(/\s+/g," ");
  const norm = value => text(value).normalize("NFC").toLowerCase();
  const cleanKey = value => norm(value).replace(/[^a-z0-9]/g,"");
  const unsafe = key => ["__proto__","constructor","prototype"].includes(key);
  const DRIVERS = /\b(?:dale earnhardt(?: jr\.?)?|jeff gordon|jimmie johnson|tony stewart|kevin harvick|kyle busch|kurt busch|kyle larson|hailie deegan|chase elliott|denny hamlin|ryan blaney|joey logano|brad keselowski|william byron|christopher bell|alex bowman|tyler reddick|bubba wallace|ross chastain|chris buescher|austin cindric|austin dillon|daniel suarez|daniel su[aá]rez|shane van gisbergen|aj allmendinger|ricky stenhouse(?: jr\.?)?|erik jones|john hunter nemechek|carson hocevar|michael mcdowell|todd gilliland|justin haley|cole custer|noah gragson|chase briscoe|zane smith|harrison burton|ryan preece|david ragan|matt kenseth|carl edwards|greg biffle|mark martin|rusty wallace|bobby labonte|terry labonte|richard petty|kyle petty|bill elliott|davey allison|bobby allison|david pearson|alan kulwicki|dick trickle|darrell waltrip|michael waltrip|dale jarrett|ned jarrett|sterling marlin|ward burton|jeff burton|elliott sadler|jamie mcmurray|juan pablo montoya|danica patrick|martin truex(?: jr\.?)?|ryan newman|clint bowyer|kasey kahne|ricky rudd|ken schrader|kenny wallace|kenny schrader|kenny irwin|steve park|jeremy mayfield|brian vickers|casey mears|david reutimann|marcos ambrose|sam hornish(?: jr\.?)?|a\. ?j\. ?foyt|mario andretti|michael andretti|marco andretti|scott dixon|scott mclaughlin|josef newgarden|alex palou|pato o['’]ward|will power|h[eé]lio castroneves|dario franchitti|takuma sato|tony kanaan|dan wheldon|simon pagenaud|alexander rossi|colton herta|ricky taylor|jordan taylor|lewis hamilton|max verstappen|lando norris|oscar piastri|charles leclerc|carlos sainz|fernando alonso|george russell|sergio perez|sergio p[eé]rez|sebastian vettel|michael schumacher|ayrton senna|kimi r[aä]ikk[oö]nen|daniel ricciardo|yuki tsunoda|lance stroll|pierre gasly|esteban ocon|valtteri bottas|nico h[uü]lkenberg|oliver bearman|andrea kimi antonelli|liam lawson|franco colapinto|gabriel bortoleto|mick schumacher|robert shwartzman|christian lundgaard|marcus ericsson|felix rosenqvist|santino ferrucci|david malukas|kyle kirkwood|riley herbst|connor zilisch|jesse love|austin hill|sam mayer|justin allgaier|christian eckes|corey heim|nick sanchez|ty majeski|grant enfinger|ben rhodes|layne riggs)\b/i;
  const POKER_PLAYERS = /\b(?:phil hellmuth|phil ivey|chris(?: ["“]?jesus["”]?)? ferguson|dennis phillips|daniel negreanu|doyle brunson|johnny chan|chris moneymaker|antonio esfandiari|scotty nguyen|jennifer harman|vanessa selbst|barry greenstein|erik seidel|gus hansen|mike matusow|tom dwan|joe hachem|joe cada|peter eastgate|carlos mortensen|huck seed|john juanda|annie duke|howard lederer|vanessa rousso)\b/i;
  function isPoker(row) { return /\bpoker\b/i.test([row.product,row.title,row.discipline,row.sourceSport].filter(Boolean).join(" ")) || POKER_PLAYERS.test([row.subject,row.player,row.name].filter(Boolean).join(" ")); }
  function classifySport(row) {
    if(isPoker(row))return "other";
    const sourceSport = text(row.sourceSport || row.sport || row.category);
    const evidence = [row.discipline,row.league,row.subject,row.player,row.name,row.title,row.product,row.cardSet,sourceSport].filter(Boolean).join(" ");
    if (/\b(?:nascar|indycar|indy car|motorsports?|motor racing|formula (?:one|1)|f1|stock car|nhra|motogp|auto racing|racing)\b/i.test(evidence) || DRIVERS.test([row.subject,row.player,row.name,row.title].filter(Boolean).join(" "))) return "racing";
    const explicit = norm(sourceSport);
    if (/baseball|mlb|softball/.test(explicit)) return "baseball";
    if (/basketball|wnba|nba/.test(explicit)) return "basketball";
    if (/soccer|association football|fifa/.test(explicit)) return "soccer";
    if (/american football|football|nfl|cfl/.test(explicit)) return "football";
    if (/hockey|nhl/.test(explicit)) return "hockey";
    return "other";
  }
  function parseStatus(value) {
    const s=norm(value).replace(/[_-]+/g," ");
    if (/^(owned|have|collection|in hand|in collection|haves|yes)$/.test(s)) return "owned";
    if (/^(in transit|intransit|incoming|ordered|on order)$/.test(s)) return "in_transit";
    if (/^(want|wanted|wantlist|want list|wants|needed|need|not owned|no)$/.test(s)) return "wanted";
    if (/^(catalog|catalogue|checklist|unknown)$/.test(s)) return "catalog";
    return "";
  }
  function quantity(value, fallback) {
    if (value == null || text(value)==="") return fallback;
    if (!/^\d+$/.test(text(value))) return null;
    const n=Number(value);return Number.isSafeInteger(n) && n>=0 ? n : null;
  }
  function tcdbId(value) {
    const s=text(value);
    const urlId=s.match(/(?:[?&]cid=|\/cid\/)(\d+)/i);
    if (urlId) return urlId[1];
    return /^\d+$/.test(s) ? s : "";
  }
  function safeUrl(value) {
    try {const u=new URL(text(value));return /^https?:$/.test(u.protocol) && !u.username && !u.password ? u.href : "";} catch (_) {return "";}
  }
  function identity(row) {
    const parts=[row.year,row.product || row.set,row.cardNumber || row.number,row.cardSet || row.variant || "Base",row.subject || row.player || row.name].map(norm);
    return JSON.stringify(parts);
  }
  function stableId(row) {
    const id=tcdbId(row.tcdbId || row.tcdbUrl);
    return id ? "tcdb:"+id : "card:"+encodeURIComponent(identity(row));
  }
  const aliases = {
    year:["year","cardyear"],product:["product","set","setname","cardset","brandset"],brand:["brand","manufacturer"],cardNumber:["cardnumber","number","cardno","card","no","num",""],
    cardSet:["variant","parallel","variation","subset"],subject:["subject","player","playername","players","playersname","name","athlete","driver","description"],sourceSport:["sport","sports","category"],
    status:["status","collectionstatus","list","listtype","collectiontype"],qty:["quantity","qty","count","copies","totalquantity"],ownedQty:["owned","have","havequantity","ownedquantity"],wantedQty:["want","wantquantity","wantedquantity"],transitQty:["intransit","intransitquantity"],
    tcdbId:["tcdbid","tcdbcardid","cid","cardid"],sourceUrl:["sourceurl","tcdburl","url","link"],serial:["serial","serialnumber","myserialnumber"],printRun:["printrun","serialnumbered","sn","numberedto"],
    team:["team","teams"],notes:["notes","note","comments"],title:["title","cardtitle"],discipline:["discipline","league"]
  };
  const headerMap = {};
  Object.keys(aliases).forEach(k=>aliases[k].forEach(a=>headerMap[a]=k));
  function splitDelimited(input, delimiter) {
    const rows=[];let row=[],cell="",quoted=false;
    for(let i=0;i<input.length;i++) {
      const c=input[i];
      if(c==='"') {if(quoted && input[i+1]==='"'){cell+='"';i++;}else if(quoted || !cell.trim()) quoted=!quoted;else cell+=c;}
      else if(c===delimiter && !quoted){row.push(cell);cell="";}
      else if((c==='\n'||c==='\r') && !quoted){if(c==='\r' && input[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell="";}
      else cell+=c;
    }
    if(quoted)throw Error("Unclosed quote in import file.");
    row.push(cell);if(row.some(v=>v.trim()))rows.push(row);
    return rows;
  }
  function normalizeRow(input, options) {
    options=options || {};
    const row={};Object.keys(input || {}).forEach(k=>{if(!unsafe(k))row[k]=text(input[k]);});
    row.source= text(options.source || row.source || "TCDB");
    row.sourceSport=text(row.sourceSport || row.sport || options.sport);
    row.sport=classifySport(row);
    row.functionalSport=isPoker(row)?"poker":row.sport;
    if(row.sport==="other" && !isPoker(row) && SPORTS.includes(options.sport) && options.sport!=="other")row.sport=options.sport;
    row.subject=text(row.subject || row.player || row.name);
    row.product=text(row.product || row.set || row.brand);
    row.year=text(row.year || (row.product.match(/^(\d{4})(?:\s|$)/) || [])[1]);
    row.cardNumber=text(row.cardNumber || row.number).replace(/^#/,"");
    row.cardSet=text(row.cardSet || row.variant || "Base");
    row.tcdbId=tcdbId(row.tcdbId || row.sourceUrl);
    row.sourceUrl=safeUrl(row.sourceUrl || options.sourceUrl);
    row.status=parseStatus(row.status || options.status) || "catalog";
    row.qty=quantity(row.qty, row.status==="catalog"?0:1);
    for(const field of ["ownedQty","wantedQty","transitQty"])if(own(row,field) && row[field]!=="")row[field]=quantity(row[field],null);else delete row[field];
    const pr=text(row.printRun).match(/^(?:SN\s*|\/)?(\d+)$/i) || row.cardSet.match(/(?:\/|\bof\s+)(\d+)\b/i);
    row.printRun=pr?Number(pr[1]):null;
    row.id=stableId(row);row.identity=identity(row);
    return row;
  }
  function parse(input, options) {
    options=options || {};
    const source=String(input || "").replace(/^\uFEFF/,"");
    const warnings=[],errors=[],rows=[];
    if(!source.trim())return {rows,errors:[{line:0,message:"Paste a TCDB export or select a CSV/TSV file."}],warnings};
    let delimiter="\t",grid=[],headerIndex=-1,keys=[],bestScore=0,parseError="";
    for(const candidate of ["\t",",",";"]) {
      let candidateGrid;try{candidateGrid=splitDelimited(source,candidate);}catch(e){parseError=e.message;continue;}
      for(let i=0;i<Math.min(candidateGrid.length,30);i++) {
        const mapped=candidateGrid[i].map(v=>headerMap[cleanKey(v)] || null);
        const recognized=mapped.includes("subject") && (mapped.includes("product") || mapped.includes("tcdbId")) || mapped.includes("tcdbId") && mapped.filter(Boolean).length>=2;
        const score=mapped.filter(Boolean).length;
        if(recognized && score>bestScore){delimiter=candidate;grid=candidateGrid;headerIndex=i;keys=mapped;bestScore=score;break;}
      }
    }
    if(headerIndex<0 && parseError)return{rows,errors:[{line:0,message:parseError}],warnings};
    if(headerIndex<0) return {rows,errors:[{line:1,message:"No recognizable card table header. Export CSV/TSV from TCDB, or paste the table including Year, Set, Number and Name columns."}],warnings};
    let status=options.status;
    if(!status) {
      const prefix=grid.slice(0,headerIndex).map(r=>r.join(" ")).join(" ");
      if(/\bwant\s*list\b/i.test(prefix))status="wanted";
      else if(/\bin[- ]transit\b/i.test(prefix))status="in_transit";
      else if(/\b(?:have list|my collection|haves)\b/i.test(prefix))status="owned";
    }
    if(!status && !keys.some(k=>["status","ownedQty","wantedQty","transitQty"].includes(k)))warnings.push("No Have/Want/In-transit label found. Rows remain checklist-only until you choose a list type.");
    for(let i=headerIndex+1;i<grid.length;i++) {
      const cells=grid[i];
      if(cells.every(v=>!text(v)))continue;
      if(cells.length!==keys.length){errors.push({line:i+1,message:"Column count differs from header; row held for review.",raw:cells.join(delimiter)});continue;}
      if(cells.map(cleanKey).join("|")===grid[headerIndex].map(cleanKey).join("|"))continue;
      const record={};keys.forEach((k,j)=>{if(k && text(cells[j]))record[k]=cells[j];});
      const row=normalizeRow(record,{...options,status});row.line=i+1;row.raw=cells.join(delimiter);
      if(!(row.tcdbId && (row.subject || row.product)) && !(row.year && row.product && row.cardNumber && row.subject)) {errors.push({line:i+1,message:"Card identity is incomplete; preserve year, set, number and subject, or a TCDB card ID.",raw:row.raw});continue;}
      if(row.qty===null || ["ownedQty","wantedQty","transitQty"].some(k=>own(row,k)&&row[k]===null)){errors.push({line:i+1,message:"Quantity must be a non-negative whole number.",raw:row.raw});continue;}
      rows.push(row);
    }
    return {rows,errors,warnings};
  }
  function parseRenderedCard(raw, page) {
    raw=raw || {};page=page || {};
    let pageUrl;try{pageUrl=new URL(page.url);}catch(_){return {error:"Missing collection page URL",raw};}
    const sourceSport=text(page.sourceSport || pageUrl.searchParams.get("Type") || "Baseball");
    const sourceFilter=text(page.sourceFilter || pageUrl.searchParams.get("Filter") || "G").toUpperCase();
    const statuses={G:"owned",W:"wanted",I:"in_transit",S:"for_sale"};
    const status=statuses[sourceFilter];
    if(!status)return {error:"Unrecognized TCDB collection filter: "+sourceFilter,raw};
    const title=text(raw.title),match=title.match(/^(\d{4}(?:-\d{2,4})?)\s+(.+?)\s+#(.+)$/);
    if(!match)return {error:"Card title has no reliable year, set and #number boundary",raw};
    const pieces=match[3].split(" ");let numberWords=1;
    let cardUrl;try{cardUrl=new URL(raw.url);}catch(_){return {error:"Missing card URL",raw};}
    const slug=decodeURI(cardUrl.pathname).toLowerCase().replace(/\++/g,"+").replace(/\+(?=-|$)/g,"").replace(/(^|-)\+/g,"$1");
    for(let n=2;n<Math.min(pieces.length,7);n++) {
      const candidate=pieces.slice(0,n).join("+").toLowerCase();
      if(slug.includes("-"+candidate+"-") || slug.endsWith("-"+candidate))numberWords=n;
    }
    const cardNumber=pieces.slice(0,numberWords).join(" "),subject=pieces.slice(numberWords).join(" ");
    if(!subject)return {error:"Card subject could not be separated from number",raw};
    const sets=match[2].split(" - "),product=sets.shift(),sourceVariant=sets.join(" - ") || "Base";
    const rawAttrs=String((raw.cells || [])[5] || "");
    const variation=text((rawAttrs.match(/(?:^|\n)\s*(?:VAR|Variation):\s*([^\n]+)/i) || [])[1]);
    const variant=sourceVariant+(variation ? " · "+variation : "");
    const attrs=text(rawAttrs),printRun=(attrs.match(/\bSN\s*(\d+)\b/i) || [])[1];
    let itemUrl;try{itemUrl=new URL(raw.itemUrl);}catch(_){return {error:"Missing collection item link",raw};}
    const itemId=itemUrl.searchParams.get("ItemID"),cardId=tcdbId(raw.url);
    if(!/^\d+$/.test(itemId || "") || !cardId)return {error:"Missing stable TCDB item/card ID",raw};
    const qty=quantity(raw.quantity,null);
    if(qty===null || qty<1)return {error:"Invalid TCDB item quantity",raw};
    const row=normalizeRow({year:match[1],product,cardSet:variant,cardNumber,subject,sourceSport,status:status==="for_sale"?"catalog":status,qty,tcdbId:cardId,sourceUrl:raw.url,printRun,serial:raw.serial || "",source:"TCDB",title});
    row.sourceVariant=sourceVariant;row.catalogVariation=variation;row.attributes=text(attrs.slice(title.length));
    row.sourceFilter=sourceFilter;row.collectionStatus=status;row.itemId=itemId;row.itemUrl=safeUrl(raw.itemUrl);row.collectionUrl=safeUrl(page.url);
    row.isAuto=/\bAU\b/.test(attrs)?"Yes":"";row.isMem=/\bMEM\b/.test(attrs)?"Yes":"";row.isRC=/\bRC\b/.test(attrs)?"Yes":"";
    row.grade=text(raw.grade);row.condition=text(raw.condition);row.notes=text((raw.cells || []).at(-1));
    row.rawCells=Array.isArray(raw.cells)?raw.cells.map(String):[];row.rawTitle=title;row.capturedAt=page.capturedAt || "";
    return {row};
  }
  function normalizeState(input) {
    const value=input && typeof input==="object" && !Array.isArray(input)?input:{};
    const out={...value};
    for(const field of ["cards","imports","statuses","details","forsale"])out[field]={...(value[field] || {})};
    for(const field of ["changelog","dirty","synced"])out[field]=Array.isArray(value[field])?value[field].slice():[];
    return out;
  }
  function sourceEvidence(row) {
    return JSON.stringify([norm(row.source),row.id,row.identity,row.status,row.qty,row.ownedQty ?? "",row.wantedQty ?? "",row.transitQty ?? "",row.serial || "",row.sourceUrl || ""]);
  }
  function evidenceKey(row) {return "source:"+encodeURIComponent(sourceEvidence(row));}
  function isTylerBlack(row) {return /(?:^|[\/;&])\s*tyler black\s*(?:$|[\/;&])/i.test(row.subject || "") || /\btyler black\b/i.test(row.subject || "");}
  function planImport(input, inputRows, options) {
    options=options || {};
    const before=normalizeState(input),next=clone(before),now=options.now || new Date().toISOString();
    const additions=[],updates=[],review=[],skipped=[];
    const sport=options.sport;
    const rows=(inputRows || []).map(row=>normalizeRow(row,options));
    const rowGroups=new Map();
    rows.forEach(row=>{if(!rowGroups.has(row.id))rowGroups.set(row.id,[]);rowGroups.get(row.id).push(row);});
    const batchId=text(options.importId) || "import:"+now;
    const identityIndex=new Map(Object.values(before.cards).filter(c=>c.identity).map(c=>[c.identity,c]));
    for(const [id,group] of rowGroups) {
      const distinct=[...new Map(group.map(row=>[sourceEvidence(row),row])).values()];
      const row=distinct[0], eKey=evidenceKey(row);
      const item={id,row,evidenceId:eKey};
      if(row.qty===null || ["ownedQty","wantedQty","transitQty"].some(k=>own(row,k)&&row[k]===null)){review.push({...item,reason:"Invalid quantity; row held without changing collection."});continue;}
      if(!(row.tcdbId && (row.subject || row.product)) && !(row.year && row.product && row.cardNumber && row.subject)){review.push({...item,reason:"Incomplete card identity; row held without changing collection."});continue;}
      if(isTylerBlack(row)){skipped.push({...item,reason:"Tyler Black stays in the existing collection."});continue;}
      if(sport && row.sport!==sport){skipped.push({...item,reason:"Routes to "+row.sport,route:row.sport});continue;}
      if(distinct.length>1){review.push({...item,rows:distinct,reason:"Same card has conflicting rows in this import; no quantities combined."});continue;}
      if(own(before.imports,eKey)){skipped.push({...item,reason:"Already imported; quantity unchanged."});continue;}
      const card=before.cards[id];
      const indexed=identityIndex.get(row.identity);
      const canonicalMatch=indexed && indexed.id!==id ? indexed : null;
      if(canonicalMatch){
        const verifiedId=c=>{try{const u=new URL(c.sourceUrl || c.tcdbUrl);return /(^|\.)tcdb\.com$/i.test(u.hostname) && tcdbId(u.href)===c.tcdbId;}catch(_){return false;}};
        if(!(row.tcdbId && canonicalMatch.tcdbId && row.tcdbId!==canonicalMatch.tcdbId && verifiedId(row) && verifiedId(canonicalMatch))){review.push({...item,reason:"Same card has another stored ID; review identity before merging.",existingId:canonicalMatch.id});continue;}
      }
      if(card && card.identity && card.identity!==row.identity){review.push({...item,reason:"TCDB ID matches but card identity differs; existing card preserved."});continue;}
      const totals={ownedQty:row.ownedQty ?? (row.status==="owned"?row.qty:0),transitQty:row.transitQty ?? (row.status==="in_transit"?row.qty:0),wantedQty:row.wantedQty ?? (row.status==="wanted"?row.qty:0)};
      if((row.printRun===1 || card?.printRun===1) && (totals.ownedQty+totals.transitQty>1 || totals.wantedQty>1)){review.push({...item,reason:"A 1/1 cannot represent multiple owned or incoming copies."});continue;}
      if(row.status!=="catalog" && row.qty===0 && !Object.values(totals).some(Boolean)){review.push({...item,reason:"Zero quantity does not remove existing ownership; review this row."});continue;}
      const existingDetails=before.details[id] || {};
      const existingStatus=before.statuses[id] || "not_owned";
      if(row.serial && existingDetails.serial && norm(row.serial)!==norm(existingDetails.serial)){review.push({...item,reason:"Serial differs from the saved copy; review copy identity before adding evidence."});continue;}
      const currentQty=Number(existingDetails.qty ?? (existingStatus==="owned" || existingStatus==="in_transit" ? 1 : 0));
      const incomingStatus=totals.ownedQty>0 ? "owned" : totals.transitQty>0 ? "in_transit" : "not_owned";
      const incomingQty=totals.ownedQty+totals.transitQty;
      const manual=existingDetails.manualStatus===true || existingDetails.manualQuantity===true;
      if(totals.wantedQty>0 && (existingDetails.manualQuantity===true || existingDetails.manualWantedQuantity===true) && totals.wantedQty!==Number(existingDetails.wantedQty ?? 0)){review.push({...item,reason:"Import conflicts with manually saved want quantity; saved value preserved.",current:{wantedQty:Number(existingDetails.wantedQty ?? 0)},proposed:{wantedQty:totals.wantedQty}});continue;}
      if(incomingQty && (manual || currentQty>0) && (currentQty!==incomingQty || existingStatus!==incomingStatus)) {
        review.push({...item,reason:"Import conflicts with saved ownership or quantity; saved values preserved.",current:{status:existingStatus,qty:currentQty},proposed:{status:incomingStatus,qty:incomingQty}});continue;
      }
      const newCard={...row,player:row.subject,name:row.subject,copies:row.printRun==null?"":String(row.printRun),tcdbUrl:row.sourceUrl,createdAt:now};
      delete newCard.raw;delete newCard.line;delete newCard.qty;delete newCard.status;
      delete newCard.ownedQty;delete newCard.wantedQty;delete newCard.transitQty;
      if(!card){next.cards[id]=newCard;identityIndex.set(row.identity,newCard);additions.push(item);}else updates.push(item);
      const details={...existingDetails};
      // A Want export can add want evidence while never demoting a held card.
      if(totals.wantedQty>0)details.wantedQty=Math.max(Number(details.wantedQty || 0),totals.wantedQty);
      if(incomingQty>0 && currentQty===0) {
        next.statuses[id]=incomingStatus;details.qty=incomingQty;
        details.ownedQty=totals.ownedQty;details.transitQty=totals.transitQty;details.statusSource=row.source;details.statusEvidence=eKey;
      }
      if(row.serial && !details.serial)details.serial=row.serial;
      next.details[id]=details;
      next.imports[eKey]={id:eKey,batchId,cardId:id,source:row.source,sourceUrl:row.sourceUrl,sourceSport:row.sourceSport,status:row.status,quantity:row.qty,...totals,serial:row.serial || "",raw:row.raw || "",observedAt:now};
      const after=next.statuses[id] || "not_owned";
      next.changelog.unshift({ts:now,sid:batchId,cardId:id,field:"Import",before:card?existingStatus:"Not tracked",after,source:row.source,evidenceId:eKey,qtyBefore:currentQty,qtyAfter:Number(next.details[id].qty || currentQty),note:totals.wantedQty>0?"Want evidence added; ownership retained":"Source row imported"});
    }
    return {sport,batchId,additions,updates,review,skipped,nextState:next,summary:{added:additions.length,updated:updates.length,review:review.length,skipped:skipped.length}};
  }
  function applyPlan(input, plan) {
    // Re-plan at commit time against the current state. Caller must still use the
    // protected collection journal/CAS; an old preview is not write authority.
    const rows=[...plan.additions,...plan.updates].map(item=>item.row);
    return planImport(input,rows,{sport:plan.sport,importId:plan.batchId}).nextState;
  }
  const api={SPORTS,STATUS_LABELS,classifySport,isPoker,parseStatus,normalizeRow,parse,parseRenderedCard,identity,stableId,normalizeState,sourceEvidence,evidenceKey,planImport,applyPlan};
  if(typeof module!=="undefined" && module.exports)module.exports=api;
  if(root)root.CollectionsUtils=api;
})(typeof window!=="undefined"?window:globalThis);
