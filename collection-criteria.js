(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;if(root)root.CollectionCriteria=api;})(typeof window!=="undefined"?window:null,function(){
  "use strict";
  const text=v=>String(v==null?"":v),normalize=v=>text(v).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[.'’]/g,"").replace(/[^a-z0-9]+/g," ").trim();
  const source=url=>/^https?:\/\//i.test(text(url));
  const yes=v=>v===true||/^(yes|true)$/i.test(text(v));
  const same=(a,b)=>normalize(a)===normalize(b);
  function subjects(card){return text(card.subject||card.name||card.player).split(/\s*[\/;|]\s*|\s+&\s+/).map(normalize).filter(Boolean);}
  function evidence(card,condition){
    const explicit=(Array.isArray(card.criteriaEvidence)?card.criteriaEvidence:[]).filter(e=>e&&e.feature===condition.feature&&(!condition.brand||same(e.brand,condition.brand))&&(!condition.value||same(e.value,condition.value)));
    const positive=explicit.some(e=>e.verified===true&&source(e.sourceUrl)&&e.matches!==false),negative=explicit.some(e=>e.verified===true&&source(e.sourceUrl)&&e.matches===false);
    if(positive&&negative)return null;
    if(positive)return true;
    if(negative)return false;
    const url=card.sourceUrl||card.tcdbUrl,attributes=text(card.attributes);
    // Standard checklist codes describe this exact card. A serial run is not SP.
    if(source(url)){
      if(condition.feature==="rookie"&&(yes(card.isRC)||/\bRC\b/.test(attributes)))return true;
      if(condition.feature==="autograph"&&(yes(card.isAuto)||/\bAU\b/.test(attributes)))return true;
      if(condition.feature==="shortPrint"&&/\bSP\b/.test(attributes))return true;
    }
    if(condition.feature==="rookie"&&card.rookieVerified===true&&source(card.rookieSourceUrl))return yes(card.isRookie)||yes(card.isRC);
    return null;
  }
  function hinted(card,condition){
    if(evidence(card,condition)!==null)return true;
    if(condition.brand){const hay=normalize([card.title,card.product,card.cardSet,card.attributes].join(" "));return hay.includes(normalize(condition.brand));}
    if(condition.feature==="discipline")return same(card.discipline,condition.value);
    return false;
  }
  function evaluateRule(card,rule){
    const names=subjects(card),named=Array.isArray(rule.subjects)&&rule.subjects.length>0;
    if(named&&!rule.subjects.some(s=>names.includes(normalize(s))))return {match:"none"};
    const conditions=Array.isArray(rule.anyOf)?rule.anyOf:[];
    if(!named&&(!conditions.length||!conditions.some(c=>hinted(card,c))))return {match:"none"};
    const yearMatch=text(card.year).match(/^\d{4}/),year=yearMatch?Number(yearMatch[0]):null;
    if(year!==null&&(rule.yearMin&&year<rule.yearMin||rule.yearMax&&year>rule.yearMax))return {match:"none"};
    const missingYear=year===null&&(rule.yearMin||rule.yearMax);
    const verifiedSubject=source(card.sourceUrl||card.tcdbUrl)||card.subjectVerified===true&&source(card.subjectSourceUrl);
    const satisfied=conditions.length?conditions.some(c=>evidence(card,c)===true):verifiedSubject;
    if(satisfied&&!missingYear&&!rule.reviewOnly)return {match:"confirmed",ruleId:rule.id};
    return {match:"potential",ruleId:rule.id,reason:rule.reviewReason|| (missingYear?"Card year needs verification.":"Card-specific criterion evidence needs verification.")};
  }
  function classify(card,criteria){
    const matches=[];
    for(const group of criteria?.groups||[]){
      if(group.sport&&group.sport!==(card.sport||card.functionalSport))continue;
      let best=null;
      for(const rule of group.rules||[]){const result=evaluateRule(card,rule);if(result.match==="confirmed"){best=result;break;}if(result.match==="potential"&&!best)best=result;}
      if(best)matches.push({...best,groupId:group.id,priority:group.priority||"secondary"});
    }
    return {matches,confirmed:matches.some(m=>m.match==="confirmed"),potential:matches.some(m=>m.match==="potential")};
  }
  function selected(entry,group){return (entry?.matches||[]).filter(m=>group==="all"||group==="primary"&&m.priority==="primary"||group==="secondary"&&m.priority==="secondary"||m.groupId===group);}
  function matches(entry,group="all",certainty="any"){
    if(group==="ungrouped")return !entry?.matches?.length;
    if(group==="all"&&certainty==="any")return true;
    const found=selected(entry,group);return certainty==="any"?found.length>0:certainty==="potential"?!found.some(m=>m.match==="confirmed")&&found.some(m=>m.match==="potential"):found.some(m=>m.match===certainty);
  }
  function buildIndex(cards,criteria){
    const byCard={},counts={all:{confirmed:0,potential:0},primary:{confirmed:0,potential:0},secondary:{confirmed:0,potential:0},ungrouped:{confirmed:0,potential:0,total:0}};
    for(const group of criteria?.groups||[])counts[group.id]={confirmed:0,potential:0};
    for(const card of cards){const entry=classify(card,criteria);byCard[String(card.id)]=entry;if(!entry.matches.length)counts.ungrouped.total++;
      for(const id of ["all","primary","secondary",...new Set(entry.matches.map(m=>m.groupId))]){const found=selected(entry,id);if(found.some(m=>m.match==="confirmed"))counts[id].confirmed++;else if(found.some(m=>m.match==="potential"))counts[id].potential++;}
    }
    return {byCard,counts};
  }
  function filter(cards,criteria,group="all",certainty="any"){return cards.filter(card=>matches(classify(card,criteria),group,certainty));}
  return {normalize,subjects,evidence,evaluateRule,classify,matches,buildIndex,filter};
});
