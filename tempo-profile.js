/* Exact-card evidence controls Tempo views; roster membership never proves a pictured jersey. */
(function(root){
  'use strict';
  const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
  const normalize=s=>String(s || '').trim().toLowerCase().replace(/\s+/g,' ');
  function source(value){try{const u=new URL(value);return /^https?:$/.test(u.protocol)&&!u.username&&!u.password;}catch(_){return false;}}
  function evidenceFor(card,provided){
    const registry=provided===undefined ? root?.TEMPO_UNIFORM_EVIDENCE : provided;
    return {...card,...(registry && own(registry,String(card.id)) ? registry[String(card.id)] : {})};
  }
  function classify(card,provided){
    const e=evidenceFor(card || {},provided);
    let uniform=null,rookie=null;
    const uniformSource=e.uniformSourceUrl || e.uniformEvidence?.sourceUrl || e.uniformImageUrl || e.uniformEvidence?.imageUrl;
    const depicted=e.depictedTeam || e.picturedTeam;
    if(e.uniformVerified===true && source(uniformSource) && typeof depicted==='string' && depicted.trim())uniform=normalize(depicted)==='toronto tempo';
    const rookieSource=e.rookieSourceUrl || e.rookieEvidence?.sourceUrl;
    if(e.rookieVerified===true && source(rookieSource)){
      if(e.isRookie===true || e.isRC===true || /^(yes|rc|true)$/i.test(String(e.isRC || '')))rookie=true;
      else if(e.isRookie===false || e.isRC===false || /^(no|false)$/i.test(String(e.isRC || '')))rookie=false;
    }
    const primary=uniform===true || rookie===true;
    return {uniform,rookie,tempoUniform:uniform===true,uniformKnown:uniform!==null,rookieKnown:rookie!==null,uniformSourceUrl:source(uniformSource)?uniformSource:"",rookieSourceUrl:source(rookieSource)?rookieSource:"",primary,other:!primary,unverified:uniform===null,verifiedOther:uniform===false&&rookie===false,evidence:e};
  }
  function matches(card,scope,provided){
    if(scope==='all' || !scope)return true;
    const profile=classify(card,provided);
    if(scope==='uniform')return profile.uniform===true;
    if(scope==='rookies')return profile.rookie===true;
    if(scope==='primary' || scope==='other' || scope==='unverified')return profile[scope];
    return false;
  }
  function counts(cards,provided){
    const result={all:0,primary:0,uniform:0,rookies:0,other:0,unverified:0};
    for(const card of cards || []){
      if(card.isTestCard)continue;
      const p=classify(card,provided);result.all++;
      if(p.primary)result.primary++;else result.other++;
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
