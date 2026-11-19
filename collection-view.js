/* Read-only views of the existing sport collection. Never creates catalog or ownership records. */
(function(root){
  'use strict';
  const text=value=>String(value==null?'':value).trim();
  const normal=value=>text(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const number=value=>Number.isFinite(Number(value))?Number(value):0;
  function countCard(state,id,copyState,inventory){
    const detail=state.details[id] || {},status=state.statuses[id] || 'not_owned',total=Number(detail.qty ?? 1),wanted=Number(detail.wantedQty || 0);
    if(copyState?.ready && inventory.hasStoredCopies(copyState.value,id)){const summary=inventory.summarizeCard(copyState.value,id,state.statuses,state.details);return {owned:summary.ownedQty,transit:summary.transitQty,unknown:summary.unknownQty,wanted,managed:true};}
    return {owned:Number(detail.ownedQty ?? (status==='owned'?total:0)),transit:Number(detail.transitQty ?? (status==='in_transit'?total:0)),unknown:0,wanted,managed:false};
  }
  function indexCounts(state,copyState,inventory){
    const byCard={},result={};
    for(const [key,copy] of Object.entries(copyState?.value?.copies || {})){const id=String(inventory.canonicalCardId(copy.cardId));if(!byCard[id])byCard[id]={};byCard[id][key]=copy;}
    for(const card of Object.values(state.cards || {})){
      const id=String(card.id),copyKey=String(inventory.canonicalCardId(card.id)),subset=copyState?.ready?{ready:true,value:{version:1,copies:byCard[copyKey] || {},baselines:copyState.value?.baselines?.[id]?{[id]:copyState.value.baselines[id]}:{},observations:{}}}:null;
      result[id]=countCard(state,card.id,subset,inventory);
    }
    return result;
  }
  function subjectNames(card){
    const explicit=Array.isArray(card.subjects)?card.subjects:Array.isArray(card.playerNames)?card.playerNames:null;
    const names=explicit || text(card.subject || card.playerName || card.name || card.player).split(/\s+\/\s+|\s*;\s*/);
    return [...new Set(names.map(name=>text(typeof name==='object'?name.name:name)).filter(Boolean))];
  }
  function facts(card){
    const attributes=text(card.attributes),printRun=number(card.printRun || card.copies);
    const variantShowsPrintRun=printRun>0 && new RegExp('(?:/\\s*|\\bof\\s+|\\bSN\\s*)'+printRun+'(?!\\d)','i').test(text(card.cardSet));
    return {printRun,variantShowsPrintRun,numbered:card.serialNumbered===true || card.serialNumbered!==false && printRun>0,oneOfOne:printRun===1,
      auto:card.isAuto===true || /\bAU\b/.test(attributes),relic:card.isRelic===true || /\bMEM\b/.test(attributes),
      rookie:card.isRookie===true || card.isRC===true || card.isRC==='Yes' || /\bRC\b/.test(attributes)};
  }
  function emptySummary(key,label){return {key,label,total:0,ownedCards:0,transitCards:0,acquiredCards:0,wantedCards:0,needCards:0,owned:0,transit:0,unknown:0,wanted:0};}
  function add(summary,count){
    summary.total++;summary.owned+=number(count.owned);summary.transit+=number(count.transit);summary.unknown+=number(count.unknown);summary.wanted+=number(count.wanted);
    if(count.owned>0)summary.ownedCards++;if(count.transit>0)summary.transitCards++;if(count.wanted>0)summary.wantedCards++;
    if(number(count.owned)+number(count.transit)+number(count.unknown)>0)summary.acquiredCards++;else summary.needCards++;
  }
  function summarize(cards,getCounts){
    const total=emptySummary('all','All'),subjects=new Map(),years=new Map(),products=new Map();
    for(const card of cards){const count=getCounts(card.id);add(total,count);
      for(const name of subjectNames(card)){if(!subjects.has(name))subjects.set(name,emptySummary(name,name));add(subjects.get(name),count);}
      for(const [map,key,label] of [[years,text(card.year),text(card.year)||'Undated'],[products,text(card.product),text(card.product)||'Unspecified set']]){if(!map.has(key))map.set(key,emptySummary(key,label));add(map.get(key),count);}
    }
    return {total,subjects:[...subjects.values()].sort((a,b)=>a.label.localeCompare(b.label)),years:[...years.values()].sort((a,b)=>b.key.localeCompare(a.key,undefined,{numeric:true})),products:[...products.values()].sort((a,b)=>a.label.localeCompare(b.label))};
  }
  function statusMatches(count,status){
    return !status || status==='all' || status==='suggestions' || status==='owned'&&count.owned>0 || status==='in_transit'&&count.transit>0 || status==='wanted'&&count.wanted>0 || status==='unowned'&&number(count.owned)+number(count.transit)+number(count.unknown)===0 || status==='acquired'&&number(count.owned)+number(count.transit)+number(count.unknown)>0 || status==='duplicates'&&number(count.owned)+number(count.transit)+number(count.unknown)>1 || status==='unknown'&&count.unknown>0;
  }
  function matches(card,filter,count,detail){
    filter=filter||{};detail=detail||{};const tagged=facts(card),query=normal(filter.query).split(/\s+/).filter(Boolean);
    const haystack=normal([card.subject,card.playerName,card.year,card.product,card.cardNumber,card.cardSet,card.attributes,detail.serial,detail.notes].join(' '));
    return (!filter.subject || subjectNames(card).includes(filter.subject)) && (!filter.year || text(card.year)===text(filter.year)) && (!filter.product || card.product===filter.product) && (!filter.variant || (card.cardSet || 'Base')===filter.variant) && (!filter.cardNumber || text(card.cardNumber)===text(filter.cardNumber)) && (!filter.discipline || filter.discipline===card.functionalSport) && (!filter.kind || tagged[filter.kind]===true) && query.every(word=>haystack.includes(word)) && statusMatches(count,filter.status);
  }
  function sortCards(cards,key,direction,getCounts){
    const countKeys=['owned','transit','unknown','wanted'];
    return cards.slice().sort((a,b)=>{
      const av=countKeys.includes(key)?number(getCounts(a.id)[key]):key==='printRun'?facts(a).printRun:a[key]??'',bv=countKeys.includes(key)?number(getCounts(b.id)[key]):key==='printRun'?facts(b).printRun:b[key]??'';
      const compared=typeof av==='number'&&typeof bv==='number'?av-bv:text(av).localeCompare(text(bv),undefined,{numeric:true});
      return (direction===-1?-1:1)*compared || text(a.id).localeCompare(text(b.id),undefined,{numeric:true});
    });
  }
  const api={countCard,indexCounts,subjectNames,facts,summarize,statusMatches,matches,sortCards};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root)root.CollectionView=api;
})(typeof window!=='undefined'?window:null);
