/* Shared private assets for a sport workspace. Reads never migrate collection data. */
(function(root){
  "use strict";
  const running=new Set();
  const blank=()=>({value:null,ready:false,loading:false,error:"",revision:null,ownerId:null});
  function useSportCollectionAssets({sport,isOwner,authEpoch=0}){
    const [state,setState]=React.useState(()=>({scope:sport,copies:blank(),media:blank()}));
    const current=React.useRef(state),epoch=React.useRef(0),locks=React.useRef({copies:false,media:false}),tokens=React.useRef({copies:{},media:{}});
    function update(kind,patch){const next={...current.current,[kind]:{...current.current[kind],...patch}};current.current=next;setState(next);}
    async function load(kind){
      if(!["copies","media"].includes(kind))return {ok:false,error:"Unknown private asset store."};
      if(locks.current[kind])return {ok:false,error:"Wait for the current "+kind+" operation to finish."};
      const request=epoch.current,ownerId=root.trackerAuth?.userId && root.trackerAuth.userId(),scope=current.current.scope;
      if(!root.trackerAuth?.isOwner() || scope!==sport)return {ok:false,error:"Sign in and load this sport before editing."};
      locks.current[kind]=true;const operationToken={};tokens.current[kind]=operationToken;running.add(operationToken);update(kind,{loading:true,error:""});
      try{const result=await root.trackerSportStores.forMode(scope)[kind].load();if(request!==epoch.current)return {ok:false,error:"Your collection or account changed."};if(!result.ok)throw Error(result.error || "Could not load "+kind+".");if(result.ownerId!==ownerId || ownerId!==(root.trackerAuth?.userId && root.trackerAuth.userId()))throw Error("Your account changed. Reload this collection.");update(kind,{...result,ready:true,loading:false,error:""});return result;}
      catch(error){if(request===epoch.current)update(kind,{ready:false,loading:false,error:error.message});return {ok:false,error:error.message};}
      finally{if(request===epoch.current)locks.current[kind]=false;running.delete(operationToken);}
    }
    async function save(kind,value){
      const baseline=state[kind],latest=current.current[kind],scope=current.current.scope,request=epoch.current;
      if(!baseline || !baseline.ready || scope!==sport || !root.trackerAuth?.isOwner() || baseline.ownerId!==(root.trackerAuth?.userId && root.trackerAuth.userId()))return {ok:false,error:"Reload this collection’s private "+kind+" before saving."};
      if(baseline.revision!==latest.revision || baseline.ownerId!==latest.ownerId || baseline.key!==latest.key)return {ok:false,error:"The private "+kind+" changed while this edit was open. Review the current record and save again.",conflict:true};
      if(locks.current[kind])return {ok:false,error:"Wait for the current save to finish."};
      locks.current[kind]=true;const operationToken={};tokens.current[kind]=operationToken;running.add(operationToken);update(kind,{loading:true,error:""});
      try{const result=await root.trackerSportStores.forMode(scope)[kind].save(value,baseline);if(request!==epoch.current || scope!==current.current.scope)return {ok:false,error:"Your account or sport changed. Reopen this collection to review the saved result."};if(!result.ok){update(kind,{loading:false,error:result.error || "Save failed; your editor is retained.",ready:!result.conflict && !result.signedOut});return result;}if(result.ownerId!==baseline.ownerId)throw Error("Your account changed. Reload before editing.");update(kind,{...result,ready:true,loading:false,error:""});return result;}
      catch(error){if(request===epoch.current)update(kind,{loading:false,error:error.message});return {ok:false,error:error.message};}
      finally{if(request===epoch.current)locks.current[kind]=false;running.delete(operationToken);}
    }
    React.useEffect(()=>{epoch.current++;locks.current={copies:false,media:false};const next={scope:sport,copies:blank(),media:blank()};current.current=next;setState(next);if(isOwner){load("copies");load("media");}return()=>{epoch.current++;Object.values(tokens.current).forEach(token=>running.delete(token));};},[sport,isOwner,authEpoch]);
    return {scope:state.scope,copies:state.copies,media:state.media,load,save,hasPending:()=>locks.current.copies || locks.current.media};
  }
  root.useSportCollectionAssets=useSportCollectionAssets;
  root.SportCollectionWorkspace={hasPending:()=>running.size>0};
})(window);
