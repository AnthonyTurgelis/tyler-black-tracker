/* Subject-first scanner for collections containing more than one person. */
(function(root) {
  "use strict";
  var money = typeof module !== "undefined" && module.exports ? require("./scan-currency.js") : root.ScanCurrency;
  function norm(value) { return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " "); }
  function subject(card, roster) {
    if (!card) return "";
    if (Array.isArray(card.subjects) && card.subjects.length) return card.subjects.map(function(value){return typeof value==='string'?value:value.name||'';}).filter(Boolean).join(' / ');
    return String(card.subject || card.playerName || card.name || (roster && roster[card.player] && roster[card.player].name) || card.player || "");
  }
  function cardSubjects(card, roster) {return subject(card,roster).split(/\s+\/\s+|\s+&\s+|\s*;\s*/).map(function(name){return name.trim();}).filter(Boolean);}
  function sameSubjects(a,b) {var clean=function(values){return Array.from(new Set(values.map(norm).filter(Boolean))).sort();};return JSON.stringify(clean(a))===JSON.stringify(clean(b));}
  function variantName(value){return norm(String(value||'').replace(/\b(?:SN|PR)\s*\d+\b/ig,'').replace(/\/\s*\d+\b/g,''));}
  function subjects(text, cards, roster) {
    var names = [], hay = " " + norm(text) + " ";
    // A large wantlist repeats the same drivers thousands of times. Normalize
    // each distinct subject once per lookup, without caching mutable card data.
    var unique=new Set((cards||[]).filter(function(card){return !card.isTestCard;}).map(function(card){return subject(card,roster);}));
    unique.forEach(function(value){cardSubjects({subject:value}).forEach(function(name){if (name && name !== "__test__" && !names.some(function(known){return norm(known)===norm(name);}) && hay.indexOf(" " + norm(name) + " ") >= 0) names.push(name);});});
    // A parent name must not match a junior's title just because it is shorter.
    return names.filter(function(name) { return !names.some(function(other) { return norm(other) !== norm(name) && (" " + norm(other) + " ").indexOf(" " + norm(name) + " ") >= 0; }) && !new RegExp("(?:^| )" + norm(name).replace(/ /g, "\\s+") + "\\s+(?:jr|junior|ii|iii)(?: |$)").test(norm(text)); });
  }
  function parseTitle(title, options) {
    options = options || {};
    var names = subjects(title, options.cards, options.roster), year = String(title || "").match(/\b((?:19|20)\d{2}(?:-\d{2})?)\b/);
    var serial = String(title || "").match(/\b(\d+)\s*\/\s*(\d+)\b/), run = String(title || "").match(/\/\s*(\d+)\b/);
    var cardNo = String(title || "").replace(/\bserial\s*#?\s*\d+/ig, "").replace(/#\d+\s*\/\s*\d+/g, "").match(/#([a-z0-9][a-z0-9_.-]*)/i);
    var fullProduct = String(title || "").match(/^(?:19|20)\d{2}(?:-\d{2})?\s+(.+?)\s+#/);
    var product = fullProduct ? fullProduct[1].split(/\s+-\s+/)[0] : "";
    var variant = fullProduct && /\s+-\s+/.test(fullProduct[1]) ? fullProduct[1].split(/\s+-\s+/).slice(1).join(" ").replace(/\[Base\]/g, "").trim() : "";
    return { year: year ? year[1] : "", product: product, variant: variant, cardNo: cardNo ? cardNo[1] : "", cardNoClean: cardNo ? cardNo[1] : "",
      serial: serial ? serial[1] : "", printRun: run ? run[1] : "", subject: names.length ? names.join(' / ') : "", subjects:names, description: names.join(" / "),
      rawSet: String(title || ""), source: options.source || "", seller: options.source || "", isAuto: /\b(?:auto|autograph|autographs|signed)\b/i.test(title), subjectAmbiguous: !names.length || !(options.cards||[]).some(function(card){return sameSubjects(names,cardSubjects(card,options.roster));}) };
  }
  function match(parsed, cards, roster) {
    var title = parsed.rawSet || "", names = subjects([title,parsed.subject,parsed.description].join(" "), cards, roster);
    if (!names.length || !parsed.year) return null;
    var titleNorm = " " + norm(title) + " ";
    var candidates = (cards || []).filter(function(card) {
      if (card.isTestCard || !sameSubjects(cardSubjects(card,roster),names)) return false;
      var year = String(card.year || (String(card.product).match(/\b(?:19|20)\d{2}\b/) || [""])[0]);
      if (year !== String(parsed.year)) return false;
      var cardNo = String(card.cardNumber || "").trim();
      if (!cardNo || !parsed.cardNo || norm(cardNo) !== norm(parsed.cardNo)) return false;
      var product = norm(String(card.product||'').replace(/^\d{4}(?:-\d{2})?\s+/, "")), given = norm(parsed.product);
      if (given !== product) {
        var words = product.split(" ").filter(function(w) { return !/^(?:panini|topps|leaf|wnba|nba|nascar|racing|baseball|basketball|football|hockey|the)$/.test(w); });
        if (!words.length || !words.every(function(w) { return titleNorm.indexOf(" " + w + " ") >= 0; })) return false;
      }
      var cardRun = String(card.copies || card.printRun || "");
      if (parsed.printRun && cardRun !== String(parsed.printRun)) return false;
      var variant = variantName(card.cardSet || card.variant || "Base");
      var requested = variantName(parsed.variant);
      var remainder=norm(title);names.forEach(function(name){remainder=remainder.replace(norm(name),'');});
      // Remove one product occurrence only. A second "Prizm" or "Gold"
      // after the card identity can be a parallel, not another product label.
      product.split(' ').forEach(function(word){remainder=remainder.replace(new RegExp('(?:^| )'+word+'(?= |$)'),' ');});
      var variantWords=/\b(?:gold|silver|red|blue|green|orange|purple|pink|black|white|yellow|teal|aqua|lime|platinum|bronze|neon|refractor|refractors|superfractor|superfractors|prizm|prizms|foil|parallel|auto|autograph|autographs|signed|signature|signatures|variation|wave|shimmer|zebra|tiger|elephant|snake|mojo|scope|disco|pulsar|cosmic|galactic|tie|dye|cracked|ice|camo|velocity|laser|lazer|holo|holographic|checkerboard|checkers|hyper|sparkle|sparkles|vinyl|pandora|patch|jersey|relic|swatch|printing|plate|plates|cyan|magenta)\b/g;
      var markers=remainder.match(variantWords)||[],allowed=variant.split(' ');
      if(markers.some(function(word){return !allowed.some(function(term){return term.replace(/s$/,'')===word.replace(/s$/,'');});}))return false;
      // Structured variant fields never override contradictory raw title text.
      if (requested) return variant === requested;
      if (variant === "base") return true;
      var terms = variant.split(" ").filter(function(w) { return w !== "base"; });
      return terms.length > 0 && terms.every(function(w) { return titleNorm.indexOf(" " + w + " ") >= 0 || titleNorm.indexOf(" " + w.replace(/s$/, "") + " ") >= 0; });
    });
    return candidates.length === 1 ? {card:candidates[0],score:100,subjectVerified:true} : null;
  }
  // Suggestions help review incomplete titles; they never grant an exact match.
  function candidates(parsed,cards,roster){
    parsed=parsed||{};var names=subjects([parsed.rawSet,parsed.subject,parsed.description].join(' '),cards,roster),title=' '+norm(parsed.rawSet)+' ';
    if(!names.length)return [];
    return (cards||[]).filter(function(card){return !card.isTestCard&&cardSubjects(card,roster).some(function(name){return names.some(function(found){return norm(found)===norm(name);});});}).map(function(card){
      var reasons=[],score=0,who=cardSubjects(card,roster);
      if(sameSubjects(names,who)){score+=40;reasons.push('Subject');}
      if(String(card.year)===String(parsed.year)){score+=30;reasons.push('Year');}else if(parsed.year)return null;
      if(parsed.cardNo&&norm(card.cardNumber)===norm(parsed.cardNo)){score+=30;reasons.push('Number');}else if(parsed.cardNo)return null;
      var product=norm(String(card.product||'').replace(/^\d{4}(?:-\d{2})?\s+/,''));
      if(product&&product.split(' ').filter(function(w){return !/^(?:panini|topps|leaf|wnba|nba|nascar|racing)$/.test(w);}).every(function(w){return title.includes(' '+w+' ');})){score+=15;reasons.push('Set');}
      if(parsed.variant&&norm(parsed.variant)===norm(card.cardSet||card.variant)){score+=15;reasons.push('Variant');}
      return {card:card,score:score,reasons:reasons,requiresReview:true};
    }).filter(Boolean).sort(function(a,b){return b.score-a.score||subject(a.card,roster).localeCompare(subject(b.card,roster))||String(a.card.cardSet).localeCompare(String(b.card.cardSet));}).slice(0,100);
  }
  function titleLine(line, options) {
    line=String(line||'').trim();
    if(!/\b(?:19|20)\d{2}(?:-\d{2})?\s+\S/.test(line)||/^(?:order\s+(?:date|total)|(?:sale|purchase|sold|end|delivery)?\s*date|delivered|expected|estimated|ship(?:ping|ped)?)\b/i.test(line))return false;
    return subjects(line,options.cards,options.roster).length>0 || /\b(?:topps|panini|bowman|donruss|prizm|national treasures|flawless|impeccable|leaf|upper deck|fleer|parkhurst|parkside|press pass|traks|action packed|score|finest|hoops|select|metal|allen.*ginter|stadium club)\b/i.test(line) || /#\S+|Opens in a new window or tab|\b(?:autographs?|refractors?|rookie|trading card|RC|PSA|BGS|SGC)\b/i.test(line);
  }
  function safeSourceUrl(value) {try {var u=new URL(String(value||''));return /^https?:$/.test(u.protocol)&&!u.username&&!u.password?u.href:'';}catch(_){return '';}}
  function metadata(p,block,options) {
    options=options||{};block=String(block||'');
    function fieldIn(value,re){var m=String(value||'').match(re);return m?m[1].trim():'';}
    function field(re){return fieldIn(block,re);}
    var pageOrders=Array.from(String(options.fullText||'').matchAll(/Order\s*(?:number|ID|#)\s*:?\s*([A-Za-z0-9][A-Za-z0-9-]*)/gi)).map(function(m){return m[1];}),uniqueOrders=Array.from(new Set(pageOrders)),page=uniqueOrders.length===1?String(options.fullText||''):'';
    p.account=p.account || field(/(?:^|\n)\s*(?:buyer account|purchased as|account|username)\s*:\s*([^\n]+)/i) || options.account || '';
    p.orderNum=p.orderNum || field(/Order\s*(?:number|ID|#)\s*:?\s*([A-Za-z0-9][A-Za-z0-9-]*)/i) || (page?uniqueOrders[0]:'');
    p.itemUrl=safeSourceUrl(p.itemUrl) || safeSourceUrl(field(/(https?:\/\/(?:www\.)?(?:ebay\.[^\s/]+\/itm\/(?:[^\s/]+\/)?\d+|comc\.com\/item\/\d+)[^\s]*)/i));
    p.sourceItemId=p.sourceItemId || p.itemId || field(/(?:^|\n)\s*(?:eBay\s+|COMC\s+)?Item\s*(?:ID|number|#)\s*:?\s*(\d+)/i) || (p.itemUrl.match(/(?:\/item\/|\/itm\/(?:[^/?]+\/)?)(\d+)/)||[])[1] || '';
    p.itemId=p.sourceItemId;
    p.seller=p.seller&&p.seller!==p.source?p.seller:field(/(?:^|\n)\s*(?:sold by|seller|purchased from)\s*[:\t]\s*([^\n]+)/i);
    if(!p.seller&&page)p.seller=fieldIn(page,/(?:^|\n)\s*(?:sold by|seller|purchased from)\s*[:\t]\s*([^\n]+)/i);
    if(!p.quantity){var quantity=field(/(?:^|\n)\s*(?:quantity purchased|purchased quantity|quantity|qty)\s*[:x]\s*(\d+)\b/i);if(quantity)p.quantity=quantity;}
    p.date=p.date || field(/\b(?:Order date|Purchase date|Date purchased|Date sold|Sale date|End date|Date)\s*:\s*([^\n]+?)(?=Order total|Order number|$)/im);
    if(!p.date){p.rawEventDate=fieldIn(block,/(?:^|\n)\s*(?:Time placed|Order date|Purchase date)\s*[:\t]\s*([^\n]+)/i)||fieldIn(page,/(?:^|\n)\s*(?:Time placed|Order date|Purchase date)\s*[:\t]\s*([^\n]+)/i);p.date=p.rawEventDate.replace(/\s+at\s+.*$/i,'');}
    if(!p.orderTotal){var pageTotal=fieldIn(block,/(?:^|\n)\s*Order total\s*[:\t]\s*([^\n]+)/i)||fieldIn(page,/(?:^|\n)\s*Order total\s*[:\t]\s*([^\n]+)/i),totalMoney=money.parseMoney(pageTotal);if(totalMoney){p.orderTotal=totalMoney;p.rawOrderTotal=pageTotal;}}
    if(p.orderNum&&p.recordType==='listing'&&/Time placed|Order date/i.test(block+'\n'+page))p.recordType='purchase';
    if(p.recordType==='purchase'&&p.orderTotal&&!p.itemPriceLabelled&&p.price!==''&&Number(p.price)===p.orderTotal.amount)p.priceBasis='order_total';
    p.eventDate=p.date;
    p.condition=p.condition || field(/(?:^|\n)\s*Condition\s*:\s*([^\n]+)/i) || field(/\b(NM or Better|Near Mint(?: or Better)?|Mint|Excellent|Ungraded|Pre-Owned|Used)\b/i);
    var grade=(p.rawSet+'\n'+block).match(/\b(PSA|BGS|SGC|CGC|CSG)\s+(10|[1-9](?:\.5)?)(?:\s+(10|[1-9](?:\.5)?))?\b/i);
    if(!p.grading&&grade)p.grading={company:grade[1].toUpperCase(),cardGrade:grade[2],...(grade[3]?{autoGrade:grade[3]}:{})};
    if(p.grading){var cert=field(/(?:cert(?:ification)?(?: number| no\.?| #)?|certificate)\s*[:#]\s*([A-Za-z0-9-]+)/i);if(cert)p.grading={...p.grading,certNumber:cert};}
    var ship=block.split(/\r?\n/).find(function(line){return /shipping|postage|delivery/i.test(line)&&!/(?:ships? to|shipping address|shipping country|delivery date|estimated delivery|ships? from)/i.test(line)&&(/free/i.test(line)||money.parseMoney(line));});
    if(ship){var paid=money.parseMoney(ship);p.shipping=ship.trim();if(/\bfree\b/i.test(ship)){p.shippingNum=0;p.shippingCurrency=p.currency||'UNKNOWN';}else if(paid&&!paid.conflict){p.shippingNum=paid.amount;p.shippingCurrency=paid.currency;}}
    var financialText=p.orderNum?block+'\n'+page:'';
    var itemCount=fieldIn(financialText,/(?:^|\n)\s*Total[^\n]*?\((\d+) items?\)/i);
    if(itemCount) p.itemsInOrder=Number(itemCount);
    if(p.orderNum && ship && /^\s*Shipping\s*:/i.test(ship) && (p.itemsInOrder>1 || /(?:^|\n)\s*Order total/i.test(financialText))) p.shippingScope='order';
    if(financialText&&p.shippingNum==null){var orderShipping=fieldIn(financialText,/(?:^|\n)Shipping\s*[:\t\n]\s*([^\n]+)/i),shippingMoney=money.parseMoney(orderShipping);if(shippingMoney){p.shippingNum=shippingMoney.amount;p.shippingCurrency=shippingMoney.currency;p.shippingScope='order';p.shipping=orderShipping;}}
    if(financialText){var taxText=fieldIn(financialText,/(?:^|\n)(?:Sales )?Tax\*?\s*[:\t\n]\s*([^\n]+)/i),tax=money.parseMoney(taxText);if(tax)p.orderTax={...tax,raw:taxText};
      var charged=fieldIn(financialText,/(?:^|\n)(?:Charged|Total paid|Payment(?: info| amount| total)?)\s*[:\t\n]\s*([^\n]+)/i),settlement=money.parseMoney(charged);if(settlement)p.settlement={...settlement,raw:charged,basis:'order_payment'};
      var rate=financialText.split(/\r?\n/).find(function(line){return /exchange rate/i.test(line)&&line.includes('=');});if(rate){var rates=rate.slice(rate.lastIndexOf(':')+1).split('='),from=money.parseMoney(rates[0]),to=money.parseMoney(rates[1]);p.exchangeRate={raw:rate,...(from&&to?{fromAmount:from.amount,fromCurrency:from.currency,toAmount:to.amount,toCurrency:to.currency}:{})};}}
    if(p.recordType==='purchase')p.requiresQuantityReview=!/^\d+$/.test(String(p.quantity||''))||Number(p.quantity)<1||Number(p.quantity)>1||/\b(?:lot|bundle|set of)\b/i.test(p.rawSet);
    p.kind=p.kind || (p.recordType==='purchase'?'purchase':p.recordType==='sold'?'sold':p.listingType==='auction'?'current_bid':'asking');
    p.priceBasis=p.priceBasis || 'item';p.originalPriceBasis=p.originalPriceBasis || p.priceBasis;p.needsIdentityReview=p.subjectAmbiguous;
    var applied=money.apply(p,{text:options.fullText||block,page:options.page,fallbackCurrency:options.fallbackCurrency});
    applied.needsSourceReview=applied.needsSourceReview===true||applied.isReturn===true;
    applied.needsReview=applied.currencyEvidence.needsReview||applied.needsIdentityReview||applied.needsSourceReview||!applied.price||applied.priceBasis!=='item';
    return applied;
  }
  function delimitedRows(text, delimiter) {
    var rows=[],row=[],cell='',quoted=false;
    for(var i=0;i<text.length;i++){var c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(!quoted&&c===delimiter){row.push(cell);cell='';}else if(!quoted&&(c==='\n'||c==='\r')){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(Boolean))rows.push(row);row=[];cell='';}else cell+=c;}
    if(quoted)throw Error('Unclosed quoted CSV field; no rows were imported.');row.push(cell);if(row.some(Boolean))rows.push(row);return rows;
  }
  function parseTable(text,options) {
    var first=text.split(/\r?\n/)[0],delimiter=first.includes('\t')?'\t':',';
    if(!/(?:Set Name|Item Title|Title|Description)/i.test(first)||!/(?:Purchase Price|Paid Price|Price|Order Number|Item ID)/i.test(first)||!first.includes(delimiter))return null;
    function headerKey(value){return norm(value).replace(/ /g,'');}
    var rows=delimitedRows(text.replace(/^\uFEFF/,''),delimiter),header=rows.shift().map(headerKey),out=[];
    function read(row,names){for(var n of names){var i=header.indexOf(headerKey(n));if(i>=0&&row[i]!=null&&row[i]!=='')return row[i].trim();}return '';}
    rows.forEach(function(row){if(row.length!==header.length)throw Error('CSV row width differs from its header; no rows were imported.');
      var set=read(row,['Set Name']),description=read(row,['Description','Player','Subject']),title=read(row,['Item Title','Title'])||[set,read(row,['Card No','Card Number'])?'#'+read(row,['Card No','Card Number']):'',description].filter(Boolean).join(' '),source=options.source||(set?'COMC':'eBay');
      var p=parseTitle(title,{cards:options.cards,roster:options.roster,source:source}),parts=set.replace(/^(?:19|20)\d{2}\s+/,'').split(' - ');
      if(set){p.product=parts.shift();p.variant=parts.filter(function(v){return v!=='[Base]';}).join(' ').replace(/\[Base\]\s*/g,'').trim();}
      p.cardNo=read(row,['Card No','Card Number'])||p.cardNo;p.cardNoClean=p.cardNo.replace(/\.\d+$/,'');p.serial=read(row,['Serial No','Serial Number'])||p.serial;if(p.serial==='0')p.serial='';p.printRun=read(row,['Qty Manufactured','Print Run'])||p.printRun;
      var salePrice=read(row,['Sale Price']),purchasePrice=read(row,['Purchase Price','Paid Price']);
      p.rawPrice=salePrice||purchasePrice||read(row,['Item Price','Price']);var price=money.parseMoney(p.rawPrice);p.price=price&&price.amount!=null&&!price.conflict?String(price.amount):'';
      p.currency=money.code(read(row,['Currency','Item Currency']));p.currencyText=row.join('\n');p.recordType=salePrice?'sold':options.recordType||(purchasePrice?'purchase':'listing');
      if(salePrice){p.acquisitionPrice=purchasePrice;p.acquisitionDate=read(row,['Acquisition Date']);p.buyer=read(row,['Purchased By','Buyer']);p.lifecycleStatus='sold';}
      var returned=read(row,['Is Return']);if(returned)p.isReturn=/^(?:true|yes|1)$/i.test(returned);
      p.priceBasis='item';p.date=read(row,['Date Purchased','Purchase Date','Order Date','Date Sold','Date']);p.seller=read(row,['Purchased From','Seller']);p.orderNum=read(row,['Order Number','Order ID']);p.itemId=read(row,['Item ID','COMC Item ID']);p.itemUrl=read(row,['Item URL','URL']);
      if(/^COMC$/i.test(source)&&header.includes('itemid')&&header.includes('datesold')&&(header.includes('purchasedfrom')||header.includes('purchasedby'))){p.dateFormat='MM/DD/YYYY';p.rawEventDate=p.date;}
      p.quantity=read(row,['Quantity Purchased','Quantity','Qty']);p.account=read(row,['Buyer Account','Account','Username']);p.shipTo=read(row,['Ship To Country','Shipping Country','Destination Country','Delivery Country','Ship To','Shipping Address','Ship To Postal Code','Ship To ZIP']);p.condition=read(row,['Condition']);p.unitIndex=read(row,['Unit Index']);
      var orderShip=read(row,['Order Shipping']), ship=orderShip||read(row,['Item Shipping','Shipping','Shipping Cost','Postage']);
      if(ship){
        var charge=money.parseMoney(ship);
        p.shipping=ship;
        if (/^free(?:\s|$)/i.test(ship)) p.shippingNum=0;
        else if(charge && !charge.conflict) p.shippingNum=charge.amount;
        p.shippingCurrency=money.code(read(row,['Shipping Currency']))!=='UNKNOWN' ? money.code(read(row,['Shipping Currency'])) : charge && charge.currency;
        p.shippingScope=orderShip?'order':'item';
      }
      var total=read(row,['Order Total']);if(total)p.orderTotal=money.parseMoney(total);out.push(metadata(p,row.join('\n'),{...options,fullText:text}));
    });return out;
  }
  function parseListings(text, options) {
    options = options || {};
    // Receipt recommendations are separate offers. Totals may follow them.
    var recommendationBlock=false;
    text = String(text || '').split(/\r?\n/).filter(function(line){
      if (/^\s*(?:Inspired by your (?:recent views|activity)|Pick up where you left off|Related Searches|Recommended for you|You may also like|You might also like|Popular in your interests|Sponsored items to complement your purchase)\s*$/i.test(line)){recommendationBlock=true;return false;}
      if (recommendationBlock && /^\s*(?:Order total|Order summary|Payment details)\s*:?\s*$/i.test(line))recommendationBlock=false;
      return !recommendationBlock;
    }).join('\n');
    var table=parseTable(text,options);if(table)return table;
    options={...options,page:money.pageEvidence(text)};
    var lines = text.split(/\r?\n/), results = [];
    var source = options.source || (/Sold Via:|Current Price:/i.test(text) ? '130point' : /Low Price:|Total Quantity:/i.test(text) ? 'SportLots' : /Opens in a new window or tab|Order number:|ebay\./i.test(text) ? 'eBay' : /Whatnot|Ships from|Card image/i.test(text) ? 'Whatnot' : /COMC|NM or Better/i.test(text) ? 'COMC' : 'Scan');
    if (source === 'SportLots' && /Low Price:/i.test(text)) return parseSportLots(text, options);
    if (source === '130point' && /Sale Price:|Current Price:/i.test(text)) return parse130Point(text, options);
    for (var i = 0; i < lines.length; i++) {
      var line=lines[i].trim();if(!titleLine(line,options))continue;
      var parts=line.split('|'),isPipe=parts.length>=3,title=(isPipe?parts[0]:line).replace(/Opens in a new window or tab\s*$/,'').trim(),block=[line];
      if(!isPipe){for(var header=i-1;header>=0;header--){if(titleLine(lines[header],options))break;if(/^\s*Time placed\s*[:\t]/i.test(lines[header])){block=lines.slice(header,i).concat(line);break;}}}
      if(!isPipe&&!subjects(title,options.cards,options.roster).length){for(var look=1;look<=2&&i+look<lines.length;look++){if(titleLine(lines[i+look],options))break;if(subjects(lines[i+look],options.cards,options.roster).length){title+=' '+lines[i+look].trim();break;}}}
      var p=parseTitle(title,{cards:options.cards,roster:options.roster,source:source}),rawPrice=isPipe?parts[1].trim():'',explicitPrice='',orderTotal='';
      if(!isPipe){
        var inline=money.parseMoney(line);if(inline&&inline.amount!=null)rawPrice=line;
        for(var j=i+1;j<lines.length;j++){
          var next=lines[j].trim();
          if(/^Time placed\s*[:\t]/i.test(next))break;
          if(titleLine(next,options)){
            if(norm(next)===norm(line)&&/Order (?:number|total)/i.test(block.join('\n'))){block.push(next);continue;}
            break;
          }
          block.push(next);
          if(/Order total\s*[:\t]/i.test(next))orderTotal=next.split(/Order total\s*[:\t]/i)[1].split(/Order number|\(Auto-paid\)/i)[0];
          if(/^(?:unit price|item price|purchase price|paid price|sale price|current bid|current price|price)(?:\s*:\s*|\s+(?=[A-Z]{1,3}\s*\$|\$|£|€))/i.test(next))explicitPrice=next.replace(/^(?:unit price|item price|purchase price|paid price|sale price|current bid|current price|price)\s*:?\s*/i,'');
          if(!rawPrice&&!/shipping|delivery|postage|bids?|time left|order total|subtotal|sales tax|tax:|charged|exchange rate/i.test(next)){var candidate=money.parseMoney(next);if(candidate&&candidate.amount!=null)rawPrice=next;}
          if(/^(?:\d+ bids?|Current Number of Bids:)|\bcurrent bid\s*:/i.test(next)){p.listingType='auction';p.bids=(next.match(/\d+/)||[''])[0];}
        }
        i=j-1;
      }
      p.recordType=options.recordType || (isPipe||/Order (?:number|total)\s*:/i.test(block.join('\n'))?'purchase':/\b(?:Sold on|Sale Price:)\b/i.test(block.join('\n'))?'sold':'listing');
      if(explicitPrice)rawPrice=explicitPrice;p.itemPriceLabelled=!!explicitPrice;
      var total=money.parseMoney(orderTotal),price=money.parseMoney(rawPrice);p.priceBasis='item';
      if(p.recordType==='purchase'&&total&&!explicitPrice&&(!price||price.amount===total.amount)){rawPrice=orderTotal;price=total;p.priceBasis='order_total';}
      p.price=price&&price.amount!=null&&!price.conflict?String(price.amount):'';p.rawPrice=rawPrice;p.currencyText=block.join('\n');p.currency=isPipe?money.code(parts[5]):'UNKNOWN';if(total){p.orderTotal=total;p.rawOrderTotal=orderTotal;}
      p.date=isPipe?(parts[2]||'').trim():'';p.orderNum=isPipe?(parts[3]||'').trim():'';p.itemUrl=isPipe?(parts[4]||'').trim():'';p.quantity=isPipe?(parts[6]||'').trim():'';p.account=isPipe?(parts[7]||'').trim():'';
      results.push(metadata(p,block.join('\n'),{...options,fullText:text}));
    }
    return results;
  }
  function parseSportLots(text, options) {
    var lines = String(text || "").split(/\r?\n/), results = [];
    for (var i = 0; i < lines.length; i++) {
      var cardLine = lines[i].trim();
      if (!/^#\S+\s+/.test(cardLine)) continue;
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
      results.push(metadata(p,block.join("\n"),{...options,fullText:text}));
    }
    return results;
  }
  function parse130Point(text, options) {
    var lines = String(text || "").split(/\r?\n/), results = [];
    for (var i = 0; i < lines.length; i++) {
      var title = lines[i].trim();
      if (!titleLine(title,options)) continue;
      var block = [title], sale = "", current = "", listed = "", date = "";
      for (var j = i + 1; j < lines.length; j++) {
        var line = lines[j].trim();
        if (/^Sold Via:/.test(line) || titleLine(line,options)) break;
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
      p.kind=sale?"sold":p.listingType==="auction"?"current_bid":"asking";
      p._130pt = {forSale:!sale,listPrice:listPrice && listPrice.amount,salePrice:price && price.amount,date:date};
      // A public sale result never becomes this owner's paid receipt.
      results.push(metadata(p,block.join("\n"),{...options,fullText:text}));
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
  var api = {norm:norm,subject:subject,cardSubjects:cardSubjects,sameSubjects:sameSubjects,subjects:subjects,parseTitle:parseTitle,match:match,candidates:candidates,parseListings:parseListings,tcdbImportStatus:tcdbImportStatus,sameListingEvidence:sameListingEvidence};
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.CollectionScanner = api;
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
