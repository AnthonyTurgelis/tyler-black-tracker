/* Read-only browsing groups. Membership is a focus, never proof of a card feature or ownership. */
(function(root,factory){
  const api=factory(root?.CollectionProfile || (typeof require==='function'?require('./collection-profile.js'):null));
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.CollectionSegments=api;
})(typeof window!=='undefined'?window:null,function(Profile){
  'use strict';
  const text=value=>String(value==null?'':value).trim();
  const normalize=value=>text(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’'.]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const nameKey=value=>normalize(value).replace(/\s+/g,'');
  const LABELS=Object.freeze({'coca-cola':'Coca-Cola','dirt-racing':'Dirt Racing',indycar:'IndyCar','monster-nos':'Monster / NOS',bodyarmor:'BodyArmor','canadian-drivers':'Canadian Drivers',trackhouse:'Trackhouse','other-drivers':'Johnson / Muniz',f1:'Formula 1',poker:'Poker'});
  const ORDER=Object.keys(LABELS);
  function segmentId(id){
    id=text(id);
    if(/^coke-(?:primary|secondary|brands)$/.test(id))return 'coca-cola';
    if(/^dirt-/.test(id))return 'dirt-racing';
    if(/^energy-/.test(id))return 'monster-nos';
    return id==='canadian-rookies'?'canadian-drivers':id;
  }
  function cardId(card){return card&&card.id!=null&&text(card.id)!==''&&(typeof card.id!=='number'||Number.isSafeInteger(card.id))?String(card.id):null;}
  function uniqueCards(cards){const seen=new Set();return (Array.isArray(cards)?cards:[]).filter(card=>{const id=cardId(card);if(id===null||seen.has(id))return false;seen.add(id);return true;});}
  function people(card){
    const names=Profile.subjectNames(card),keys=Profile.players(card);
    if(!keys.length)return names.map(name=>({key:Profile.personKey(name),name}));
    return keys.map((key,i)=>({key,name:names.length===keys.length?names[i]:keys.length===1?Profile.subject(card):text(key)}));
  }
  function metadata(card){
    // Card numbers in pasted titles are identity, not evidence of a racing series.
    const title=text(card.title||card.rawTitle).replace(/#\S+/g,'');
    return normalize([title,card.product,card.set,card.cardSet,card.variant,card.discipline,card.league,card.functionalSport,card.category,card.sourceCategory,card.sourceSport,card.brand,card.sponsor,card.team].filter(Boolean).join(' '));
  }
  function metadataSegments(card,hay){
    const found=[];
    if(/\b(?:coca cola|cocacola|mello yello|vitaminwater|vitamin water|powerade)\b/.test(hay))found.push('coca-cola');
    if(/\b(?:world of outlaws|dirt racing|dirt track|sprint cars?|sprintcars?|midget racing)\b/.test(hay))found.push('dirt-racing');
    if(/\b(?:indycar|indy car|cart|champ car|champcar|indy racing league|indianapolis 500|indy 500)\b/.test(hay)||/^(?:(?:19|20)\d{2}(?: \d{2,4})? )?rittenhouse irl$/.test(normalize(card.product||card.set)))found.push('indycar');
    if(/\b(?:monster energy|nos energy)\b/.test(hay))found.push('monster-nos');
    if(/\b(?:bodyarmor|body armor)\b/.test(hay))found.push('bodyarmor');
    if(/\btrackhouse\b/.test(hay))found.push('trackhouse');
    if(/\b(?:formula 1|formula one|f1)\b/.test(hay))found.push('f1');
    if(/\bpoker\b/.test(hay))found.push('poker');
    return found;
  }
  function build(cards,mode,criteria){
    const byCard=Object.create(null),counts=new Map(),labels=new Map(ORDER.map(id=>[id,LABELS[id]])),catalog=uniqueCards(cards),namedGroups=new Map(),cueGroups=new Map();
    const groups=(Array.isArray(criteria?.groups)?criteria.groups:[]).filter(group=>group&&(!group.sport||group.sport===mode));
    function add(map,key,id){if(!key)return;if(!map.has(key))map.set(key,new Set());map.get(key).add(id);}
    for(const group of groups){
      const id=segmentId(group.id);if(!id||['all','ungrouped'].includes(id))continue;
      if(!labels.has(id))labels.set(id,text(group.label)||id);
      for(const rule of Array.isArray(group.rules)?group.rules:[]){
        if(!rule)continue;
        for(const name of Array.isArray(rule.subjects)?rule.subjects:[])add(namedGroups,nameKey(name),id);
        // RC/AU/SP restrictions remain in CollectionCriteria. These groups only help browse existing cards.
        for(const condition of Array.isArray(rule.anyOf)?rule.anyOf:[]){if(!condition)continue;const cue=normalize(condition.brand||(condition.feature==='discipline'?condition.value:''));if(cue)add(cueGroups,' '+cue+' ',id);}
      }
    }
    for(const card of catalog){
      const id=cardId(card),hay=metadata(card),names=new Set(Profile.subjectNames(card).map(nameKey)),members=new Set(metadataSegments(card,hay));
      for(const name of names)for(const groupId of namedGroups.get(name)||[])members.add(groupId);
      const padded=' '+hay+' ';for(const [cue,groupIds] of cueGroups)if(padded.includes(cue))for(const groupId of groupIds)members.add(groupId);
      if(!members.size)members.add('ungrouped');
      byCard[id]=[...members];for(const member of members)counts.set(member,(counts.get(member)||0)+1);
    }
    const active=[...labels.keys()].filter(id=>counts.has(id));
    const result=[{id:'all',label:'All',count:catalog.length},...active.map(id=>({id,label:labels.get(id),count:counts.get(id)}))];
    if(counts.has('ungrouped'))result.push({id:'ungrouped',label:'Ungrouped',count:counts.get('ungrouped')});
    return {groups:result,byCard};
  }
  function select(cards,index,segment,subjectKey){
    return uniqueCards(cards).filter(card=>(!segment||segment==='all'||(index?.byCard?.[cardId(card)]||[]).includes(segment))&&(!subjectKey||subjectKey==='all'||people(card).some(person=>person.key===subjectKey)));
  }
  function subjects(cards){
    const result=new Map();
    for(const card of uniqueCards(cards)){const seen=new Set();for(const person of people(card)){if(!person.key||!person.name||seen.has(person.key))continue;seen.add(person.key);if(!result.has(person.key))result.set(person.key,{key:person.key,name:person.name,count:0});result.get(person.key).count++;}}
    return [...result.values()].sort((a,b)=>a.name.localeCompare(b.name)||a.key.localeCompare(b.key));
  }
  return {build,select,subjects};
});
