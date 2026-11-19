/* Printed team/branding, photographed jersey and rookie evidence are independent. */
(function(root){
  'use strict';
  const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
  const normalize=s=>String(s || '').trim().toLowerCase().replace(/\s+/g,' ');
  function source(value){try{const u=new URL(value);return /^https?:$/.test(u.protocol)&&!u.username&&!u.password;}catch(_){return false;}}
  function evidenceFor(card,provided){
    const registries=provided===undefined ? [root?.TEMPO_UNIFORM_EVIDENCE,root?.TEMPO_BRAND_EVIDENCE] : [provided];
    return registries.reduce((e,registry)=>({...e,...(registry && own(registry,String(card.id)) ? registry[String(card.id)] : {})}),{...card});
  }
  function classify(card,provided){
    const e=evidenceFor(card || {},provided);
    let uniform=null,rookie=null,team=null,logo=null;
    const uniformSource=e.uniformSourceUrl || e.uniformEvidence?.sourceUrl || e.uniformImageUrl || e.uniformEvidence?.imageUrl;
    const depicted=e.depictedTeam || e.picturedTeam;
    if(e.uniformVerified===true && source(uniformSource) && typeof depicted==='string' && depicted.trim())uniform=normalize(depicted)==='toronto tempo';
    const teamSource=e.teamSourceUrl || e.teamEvidence?.sourceUrl;
    const cardTeams=Array.isArray(e.cardTeams) ? e.cardTeams : [e.cardTeam];
    if(e.teamVerified===true && source(teamSource) && cardTeams.some(t=>typeof t==='string' && t.trim()))team=cardTeams.some(t=>normalize(t)==='toronto tempo');
    const logoSource=e.logoSourceUrl || e.logoEvidence?.sourceUrl || e.logoImageUrl;
    if(e.logoVerified===true && source(logoSource) && typeof e.tempoLogo==='boolean')logo=e.tempoLogo;
    const rookieSource=e.rookieSourceUrl || e.rookieEvidence?.sourceUrl;
    if(e.rookieVerified===true && source(rookieSource)){
      if(e.isRookie===true || e.isRC===true || /^(yes|rc|true)$/i.test(String(e.isRC || '')))rookie=true;
      else if(e.isRookie===false || e.isRC===false || /^(no|false)$/i.test(String(e.isRC || '')))rookie=false;
    }
    const tempoCard=team===true || logo===true;
    const primary=tempoCard || uniform===true || rookie===true;
    return {uniform,rookie,team,logo,tempoCard,tempoLogo:logo===true,tempoUniform:uniform===true,teamKnown:team!==null,logoKnown:logo!==null,uniformKnown:uniform!==null,rookieKnown:rookie!==null,teamSourceUrl:source(teamSource)?teamSource:"",logoSourceUrl:source(logoSource)?logoSource:"",uniformSourceUrl:source(uniformSource)?uniformSource:"",rookieSourceUrl:source(rookieSource)?rookieSource:"",primary,other:!primary,unverified:uniform===null,verifiedOther:team===false&&logo===false&&uniform===false&&rookie===false,evidence:e};
  }
  function matches(card,scope,provided){
    if(scope==='all' || !scope)return true;
    const profile=classify(card,provided);
    if(scope==='tempo')return profile.tempoCard;
    if(scope==='logo')return profile.tempoLogo;
    if(scope==='uniform')return profile.uniform===true;
    if(scope==='rookies')return profile.rookie===true;
    if(scope==='primary' || scope==='other' || scope==='unverified')return profile[scope];
    return false;
  }
  function counts(cards,provided){
    const result={all:0,primary:0,tempo:0,logo:0,uniform:0,rookies:0,other:0,unverified:0};
    for(const card of cards || []){
      if(card.isTestCard)continue;
      const p=classify(card,provided);result.all++;
      if(p.primary)result.primary++;else result.other++;
      if(p.tempoCard)result.tempo++;
      if(p.tempoLogo)result.logo++;
      if(p.uniform===true)result.uniform++;
      if(p.rookie===true)result.rookies++;
      if(p.unverified)result.unverified++;
    }
    return result;
  }
  const api={classify,matches,counts};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root)root.TempoProfile=api;
})(typeof window!=='undefined'?window:globalThis);
