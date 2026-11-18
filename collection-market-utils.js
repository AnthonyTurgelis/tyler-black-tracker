/* Private sport market evidence. Card IDs stay strings; no collection writes. */
(function(root){
  'use strict';
  const node=typeof module!=='undefined'&&module.exports;
  const M=node?require('./market-utils.js'):root.TrackerMarket;
  const C=node?require('./scan-currency.js'):root.ScanCurrency;
  const S=node?require('./scanner-utils.js'):root.CollectionScanner;
  const H=node?require('./price-history-utils.js'):root.PriceHistoryUtils;
  const clone=value=>JSON.parse(JSON.stringify(value));
  function cardId(value){const id=String(value==null?'':value);if(!id || ['__proto__','prototype','constructor',H.META].includes(id))throw Error('Invalid card identity.');return id;}
  function date(value,format){
    const text=String(value||'').trim();
    if(format==='MM/DD/YYYY'){const m=text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s|$)/);if(m)return date(m[3]+'-'+m[1].padStart(2,'0')+'-'+m[2].padStart(2,'0'));}
    if(/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(text)){const day=text.slice(0,10),d=new Date(day+'T12:00:00Z');return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===day?day:'';}
    if(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\b/i.test(text)){const d=new Date(text);if(Number.isFinite(d.getTime()))return d.toISOString().slice(0,10);}
    // Ambiguous numeric local dates need an explicit review.
    return '';
  }
  function priceKind(parsed){return ['asking','current_bid','sold','purchase'].includes(parsed.kind)?parsed.kind:parsed.recordType==='purchase'?'purchase':parsed.recordType==='sold'||parsed._130pt?.forSale===false?'sold':parsed.listingType==='auction'?'current_bid':'asking';}
  function label(card){return [S.subject(card),card.year,card.product,'#'+card.cardNumber,card.cardSet||card.variant||'Base'].filter(Boolean).join(' · ');}
  function review(parsed,card,options){
    options=options||{};const errors=[],warnings=[];
    if(!card || card.isTestCard)errors.push('Choose the exact catalog card.');
    if(card){
      try{cardId(card.id);}catch(e){errors.push(e.message);}
      const who=S.subject(card,options.roster);
      if(parsed.subject&&S.norm(parsed.subject)!==S.norm(who))errors.push('The scanned subject differs from the selected card. Correct the subject evidence first.');
      if(options.manual && !options.identityConfirmed)errors.push('Confirm the subject, year, set, number and variant.');
      if(!options.manual&&!S.match(parsed,[card],options.roster))errors.push('The full card identity needs manual review.');
      if(!options.manual&&String(card.copies||card.printRun||'')==='1')errors.push('Confirm this exact one-of-one variant manually.');
    }
    const kind=priceKind(parsed);
    let evidence=C.infer({...parsed,recordType:kind==='purchase'?'purchase':parsed.recordType},{text:parsed.scanContext||parsed.currencyText||'',fallbackCurrency:options.fallbackCurrency});
    if(evidence.currency==='UNKNOWN'&&!evidence.conflicts.length&&parsed.currencyEvidence?.currency===parsed.currency)evidence=parsed.currencyEvidence;
    if(evidence.needsReview)errors.push('Confirm the original transaction currency.');
    if(parsed.currencyUnconfirmedByOwner)errors.push('Currency is marked unconfirmed.');
    if(!(M.amount(parsed.price)>0))errors.push('Enter a positive item price.');
    if(parsed.priceBasis==='order_total')errors.push('This is an order total. Enter and confirm the item amount before saving.');
    if(parsed.needsSourceReview&&!parsed.sourceReviewedByOwner)errors.push('Review this return, cancellation or source status before saving.');
    const eventDate=date(parsed.date||parsed.eventDate,parsed.dateFormat);
    if(kind==='purchase'&&parsed.recordType!=='purchase'&&!parsed.purchaseConfirmedByOwner)errors.push('Confirm that this is your purchase, not a public listing or sale.');
    if((kind==='sold'||kind==='purchase')&&!eventDate)errors.push('Confirm the actual sale or purchase date.');
    if(kind==='purchase'&&!String(parsed.orderNum||parsed.orderNumber||'').trim())warnings.push('No order reference; duplicate purchase detection is limited.');
    if(kind==='purchase'&&!String(parsed.account||parsed.sourceAccount||'').trim())warnings.push('Account is unconfirmed; add it when consolidating multiple accounts.');
    if(parsed.shippingNum!=null&&C.code(parsed.shippingCurrency)==='UNKNOWN')warnings.push('Shipping currency is unknown; shipping stays separate.');
    return {ok:!errors.length,errors,warnings,currency:evidence.currency,currencyEvidence:evidence,kind,eventDate};
  }
  function entry(parsed,card,options){
    options=options||{};const checked=review(parsed,card,options);if(!checked.ok)throw Error(checked.errors.join(' '));
    const result=M.observation({price:parsed.price,currency:checked.currency,kind:checked.kind,priceBasis:parsed.priceBasis||'item',source:parsed.source||'Manual',title:parsed.rawSet||label(card),itemId:parsed.itemId||parsed.sourceItemId,itemUrl:parsed.itemUrl||parsed.sourceUrl,marketplace:parsed.marketplace,eventDate:checked.eventDate,serial:parsed.serial,printRun:parsed.printRun,shipping:parsed.shippingNum,shippingCurrency:parsed.shippingCurrency,condition:parsed.condition,grading:parsed.grading,seller:parsed.seller,observedAt:options.now,availability:checked.kind==='sold'?'sold':'unconfirmed'});
    result.cardId=cardId(card.id);
    result.sourceAccount=String(parsed.account||parsed.sourceAccount||'').trim();
    result.orderNumber=String(parsed.orderNum||parsed.orderNumber||'').trim();
    result.sourceQuantity=String(parsed.quantity||'');
    result.rawEventDate=String(parsed.rawEventDate||parsed.date||parsed.eventDate||'');
    if(parsed.grading){result.grading=clone(parsed.grading);if(typeof result.grading==='object'&&result.grading.autoGrade&&!result.grading.autographGrade)result.grading.autographGrade=result.grading.autoGrade;}
    result.rawPrice=String(parsed.rawPriceOriginal||parsed.rawPrice||parsed.price||'');
    result.currencyEvidence=clone(parsed.originalCurrencyEvidence||checked.currencyEvidence);
    result.currencyConfirmedByOwner=parsed.currencyConfirmedByOwner===true;
    if(parsed.originalPriceBasis)result.originalPriceBasis=String(parsed.originalPriceBasis);
    if(parsed.rawOrderTotal)result.rawOrderTotal=String(parsed.rawOrderTotal);
    if(parsed.orderTotal)result.orderTotal=clone(parsed.orderTotal);
    if(parsed.orderTax)result.orderTax=clone(parsed.orderTax);
    if(parsed.settlement)result.settlement=clone(parsed.settlement);
    if(parsed.exchangeRate)result.exchangeRate=clone(parsed.exchangeRate);
    if(parsed.shippingScope)result.shippingScope=String(parsed.shippingScope);
    if(parsed.acquisitionPrice)result.acquisitionPrice=String(parsed.acquisitionPrice);
    if(parsed.acquisitionDate)result.acquisitionDate=String(parsed.acquisitionDate);
    if(parsed.isReturn!=null)result.isReturn=parsed.isReturn;
    if(parsed.lifecycleStatus)result.lifecycleStatus=String(parsed.lifecycleStatus);
    if(parsed.sourceReviewedByOwner)result.sourceReviewedByOwner=true;
    result.sourceText=String(parsed.currencyText||'').slice(0,20000);
    result.matchMethod=options.manual?'owner_confirmed':'exact_catalog';
    if(parsed.purchaseConfirmedByOwner)result.purchaseConfirmedByOwner=true;
    result.needsOwnershipReview=checked.kind==='purchase';
    result.observationKey=JSON.stringify(['sport-market-v1',result.sourceAccount,result.orderNumber,M.observationKey(result)]);
    return result;
  }
  function append(value,entries){
    value=value||{};const additions=Object.create(null);
    for(const item of entries){const id=cardId(item.cardId);if(!additions[id])additions[id]=[];additions[id].push(clone(item));}
    const history=H.merge(value.history,additions),before=new Set(Object.entries(H.visible(value.history)).flatMap(([id,rows])=>rows.map(row=>id+'|'+H.identity(row))));
    let added=0;for(const [id,rows] of Object.entries(H.visible(history)))for(const row of rows)if(!before.has(id+'|'+H.identity(row)))added++;
    return {value:{...value,schemaVersion:1,history,targets:clone(value.targets||{})},added};
  }
  function remove(value,id,observation,now){return {...value,history:H.applyChanges(value.history,[{cardKey:cardId(id),entries:[observation]}],[],now)};}
  function reassign(value,oldId,newCard,observation,now){
    const nextId=cardId(newCard.id),old=cardId(oldId);if(old===nextId)return clone(value);
    const next={...observation,cardId:nextId,matchMethod:'owner_confirmed',assignmentReviewedAt:now||new Date().toISOString()};
    return {...value,history:H.applyChanges(value.history,[{cardKey:old,entries:[observation]}],[{cardKey:nextId,entries:[next]}],now)};
  }
  function target(value,card,fields,now){
    const id=cardId(card.id),limit=fields.maxPrice===''||fields.maxPrice==null?null:M.amount(fields.maxPrice),currency=C.code(fields.currency);
    if(fields.maxPrice!==''&&fields.maxPrice!=null&&!(limit>0))throw Error('Target price must be positive.');
    if(limit!=null&&currency==='UNKNOWN')throw Error('Choose the target currency.');
    const targets=clone(value.targets||{});targets[id]={...(targets[id]||{}),cardId:id,maxPrice:limit,currency,status:['watching','bidding','offer','passed'].includes(fields.status)?fields.status:'watching',notes:String(fields.notes||''),sourceUrl:M.safeUrl(fields.sourceUrl),updatedAt:now||new Date().toISOString()};
    return {...value,schemaVersion:1,history:H.merge(value.history,null),targets};
  }
  function legacyObservations(collection){return Object.values(collection?.imports||{}).filter(e=>e?.status==='observation'&&e?.cardId!=null);}
  function groupSeries(entries){
    const groups=new Map();
    for(const entry of entries||[]){const lifecycle=entry.isReturn?'Returned':String(entry.lifecycleStatus||''),key=M.seriesKey(entry)+'|'+lifecycle;if(!groups.has(key))groups.set(key,{key,currency:M.currency(entry.currency),kind:M.kind(entry.kind),conditionLabel:M.conditionLabel(entry),lifecycle,entries:[]});groups.get(key).entries.push(entry);}
    return [...groups.values()];
  }
  const api={cardId,date,priceKind,label,review,entry,append,remove,reassign,target,legacyObservations,groupSeries};
  if(node)module.exports=api;if(root)root.CollectionMarket=api;
})(typeof window!=='undefined'?window:globalThis);
