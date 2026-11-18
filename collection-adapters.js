/* Owner-scoped side-collection stores. No eager reads, public mirrors, or quantity writes. */
(function(root,factory){var api=factory();if(typeof module==="object"&&module.exports)module.exports=api;if(root)root.CollectionAdapters=api;})(typeof window!=="undefined"?window:null,function(){
  "use strict";
  var SPORTS=["racing","baseball","basketball","football","hockey","soccer","other"];
  function object(value){return value&&typeof value==="object"&&!Array.isArray(value)?value:{};}
  function clone(value){return JSON.parse(JSON.stringify(value));}
  function create(privateStore,helpers){
    helpers=helpers||{};
    var scopes={};
    if(!privateStore||typeof privateStore.load!=="function"||typeof privateStore.save!=="function")throw Error("Private storage is unavailable.");
    function prices(value){value=object(value);return Object.assign({},value,{schemaVersion:1,history:helpers.PriceHistoryUtils.merge(value.history,null),targets:clone(object(value.targets))});}
    function store(key,normalize,kind){
      function envelope(result){if(!result.ok)return result;var next=Object.assign({},result,{value:normalize(result.value),version:result.revision,key:key});if(kind==="prices"){next.history=next.value.history;next.targets=next.value.targets;}return next;}
      return {key:key,
        async load(){try{return envelope(await privateStore.load(key));}catch(error){return {ok:false,error:error.message};}},
        async save(value,revision,ownerId){
          try {
            if(revision&&typeof revision==="object"){
              var snapshot=revision;
              if(snapshot.ok!==true||snapshot.key!==key)return {ok:false,error:"This saved revision belongs to another collection. Reload this view."};
              revision=snapshot.revision;ownerId=snapshot.ownerId;
            }
            if(!ownerId)return {ok:false,error:"Refresh this private collection before saving."};
            // Undefined means no read was performed. Null is an observed missing row.
            if(revision===undefined)return {ok:false,error:"Load the saved revision before saving."};
            if(revision!==null&&(!Number.isSafeInteger(revision)||revision<1))return {ok:false,error:"The saved revision is invalid. Refresh before saving."};
            return envelope(await privateStore.save(key,normalize(value),revision,ownerId));
          }catch(error){return {ok:false,error:error.message};}
        }
      };
    }
    function forMode(mode){
      if(!SPORTS.includes(mode))throw Error("Choose a supported collection sport.");
      if(scopes[mode])return scopes[mode];
      var prefix="collect-"+mode+"-",copies=store(prefix+"copy-inventory-v1",helpers.CopyInventory.normalizeState,"copies"),media=store(prefix+"card-media-v1",helpers.TrackerMedia.normalizeScopedMedia,"media"),priceStore=store(prefix+"price-history-v1",prices,"prices");
      priceStore.record=async function(snapshot,cardId,entry){
        var id=helpers.CopyInventory.canonicalCardId(cardId);
        if(id===null)return {ok:false,error:"Choose the exact catalog card before saving price evidence."};
        if(!snapshot||snapshot.ok!==true||snapshot.key!==priceStore.key)return {ok:false,error:"Load price history for this collection before saving."};
        if(!entry||typeof entry!=="object"||Array.isArray(entry))return {ok:false,error:"Provide a price observation."};
        var next=prices(snapshot.value),incoming={};incoming[String(id)]=[clone(entry)];
        next.history=helpers.PriceHistoryUtils.merge(next.history,incoming);
        return priceStore.save(next,snapshot);
      };
      return scopes[mode]={mode:mode,keys:{copies:copies.key,media:media.key,prices:priceStore.key},copies:copies,media:media,prices:priceStore};
    }
    return {forMode:forMode,forScope:forMode};
  }
  return {SPORTS:SPORTS,create:create};
});
