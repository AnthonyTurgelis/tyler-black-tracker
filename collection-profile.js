/* View-only collection profiles. Never renumber cards or write collection state. */
(function(root){
  'use strict';
  const SPORTS=Object.freeze(['racing','baseball','basketball','football','hockey','soccer','other']);
  const TITLES=Object.freeze({tb:'TYLER BLACK',wnba:'TORONTO TEMPO',racing:'RACING',baseball:'BASEBALL',basketball:'BASKETBALL',football:'FOOTBALL',hockey:'HOCKEY',soccer:'SOCCER',other:'OTHER COLLECTIONS'});
  const clone=value=>JSON.parse(JSON.stringify(value));
  const text=value=>String(value==null?'':value).trim();
  const validId=value=>value!=null&&text(value)!==''&&(typeof value!=='number'||Number.isSafeInteger(value)&&value>=0)&&!['__proto__','prototype','constructor'].includes(String(value));
  function isSport(mode){return SPORTS.includes(mode);}
  function check(mode){if(mode!=='tb'&&mode!=='wnba'&&!isSport(mode))throw Error('Unknown collection mode.');return mode;}
  function prefix(mode){check(mode);return mode==='wnba'?'tempo':mode==='tb'?'tb':'collect-'+mode;}
  function scope(mode){check(mode);return mode==='wnba'?'tempo':mode;}
  function title(mode){return TITLES[check(mode)];}
  function subject(card,knownRoster){
    if(!card)return '';
    if(Array.isArray(card.subjects)&&card.subjects.length)return card.subjects.map(person=>text(typeof person==='string'?person:person?.name)).filter(Boolean).join(' / ');
    return text(card.subject||card.playerName||card.name||knownRoster?.[card.player]?.name||card.player);
  }
  function subjectNames(card,knownRoster){return subject(card,knownRoster).split(/\s+\/\s+|\s+&\s+|\s*;\s*/).map(text).filter(Boolean);}
  function personKey(name){return 'subject:'+encodeURIComponent(text(name).normalize('NFKC').toLowerCase().replace(/\s+/g,' '));}
  function players(card){return [...new Set((Array.isArray(card?.players)&&card.players.length?card.players:[card?.player]).filter(Boolean))];}
  function flag(value,fallback){if(value===true||/^(?:yes|true|1)$/i.test(text(value)))return 'Yes';if(value===false||/^(?:no|false|0)$/i.test(text(value)))return 'No';return fallback?'Yes':'';}
  function safeUrl(value){try{const url=new URL(value);return /^https?:$/.test(url.protocol)&&!url.username&&!url.password?url.href:'';}catch(_){return '';}}
  function sourceUrl(card){
    const sources=Array.isArray(card.sources)?card.sources:card.sources&&typeof card.sources==='object'?Object.values(card.sources):[];
    return [card.sourceUrl,card.tcdbUrl,...sources.map(value=>typeof value==='string'?value:value?.sourceUrl||value?.url||value?.href)].map(safeUrl).find(Boolean)||'';
  }
  function cards(mode,state){
    check(mode);
    const source=Array.isArray(state)?state:state?.cards||{},rows=Array.isArray(source)?source.map(card=>[undefined,card]):Object.entries(source),seen=new Set();
    return rows.map(([key,original])=>{
      if(!original||typeof original!=='object'||Array.isArray(original))throw Error('Invalid catalog card.');
      const id=original.id==null?key:original.id;
      if(!validId(id)||key!==undefined&&String(id)!==String(key)||seen.has(String(id)))throw Error('Catalog identity mismatch; saved collection was not changed.');
      seen.add(String(id));
      const card=clone(original);card.id=id;
      if(!isSport(mode))return card;
      card.year=card.year==null||card.year===''?(text(card.product).match(/^(\d{4}(?:-\d{2})?)(?:\s|$)/)||[])[1]||'':card.year;
      card.product=text(card.product||card.set);card.cardNumber=text(card.cardNumber??card.number);card.cardSet=text(card.cardSet||card.variant||'Base');
      card.subject=subject(card);card.subjects=subjectNames(card);
      card.player=card.subjects.length?personKey(card.subjects[0]):'';card.players=card.subjects.map(personKey);
      card.copies=card.copies==null||text(card.copies)===''?card.printRun==null?'':String(card.printRun):String(card.copies);
      card.isAuto=flag(card.isAuto,/\bAU\b/i.test(card.attributes||''));
      card.isRC=flag(text(card.isRC)!==''?card.isRC:card.isRookie,/\bRC\b/i.test(card.attributes||''));
      card.isMem=flag(text(card.isMem)!==''?card.isMem:card.isRelic,/\bMEM\b/i.test(card.attributes||''));
      card.sourceUrl=sourceUrl(card);card.tcdbUrl=[safeUrl(card.tcdbUrl),card.sourceUrl].find(url=>{try{return /(^|\.)tcdb\.com$/i.test(new URL(url).hostname);}catch(_){return false;}})||'';
      card.collectionScope=mode;
      return card;
    });
  }
  function roster(catalog,existing){
    const result=Object.create(null);for(const [key,value] of Object.entries(existing||{}))result[key]=clone(value);
    for(const card of catalog||[]){
      const names=subjectNames(card,existing),keys=players(card);
      keys.forEach((key,index)=>{const name=result[key]?.name||(names.length===keys.length?names[index]:keys.length===1?subject(card,existing):'');if(name)result[key]={...(result[key]||{}),name};});
    }
    return result;
  }
  const api={SPORTS,isSport,prefix,scope,title,subject,subjectNames,personKey,players,cards,roster,sourceUrl};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root)root.CollectionProfile=api;
})(typeof window!=='undefined'?window:null);
