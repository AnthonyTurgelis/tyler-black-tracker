/**
 * Storage Shim — Tyler Black Tracker + Tempo (WNBA) Mode
 * Modified version of your existing shim. ADDITIONS only — no existing logic removed.
 *
 * Routing: tb-* keys → collection_kv table | tempo-* keys → tempo_collection_kv table
 * Mode: window.MODE defaults to 'tb' on every load. WNBA mode owner-only, never persisted.
 *
 * MODIFIED LINES tagged with `// + TEMPO` so you can diff against your original.
 */
(function () {
  // ── Config (set in index.html before this script loads) ──
  var SUPABASE_URL = window.SUPABASE_URL || "";
  var SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "";

  // ── Cloud keys split by mode (was a single CLOUD_KEYS array) ── // + TEMPO
  var TB_CLOUD_KEYS = [
    "tb-alldata-v1",
    "tb-targets-v1",
    "tb-price-history-v1",
    "tb-public-market-evidence-v1",
    "tb-tcdb-fixes-v1",
    "tb-tcdb-flags-v1",
    "tb-ebay-blocked-v1",
    "tb-ebay-bids-v1",
    "tb-comc-overrides-v1",
    "tb-custom-cards-v1",
    "tb-catalog-meta-v1",
    "tb-card-media-v1",
    "tb-linked-tweets-v1"
  ];
  var TEMPO_CLOUD_KEYS = [                                          // + TEMPO
    "tempo-alldata-v1",
    "tempo-targets-v1",
    "tempo-price-history-v1",
    "tempo-tcdb-fixes-v1",
    "tempo-tcdb-flags-v1",
    "tempo-ebay-blocked-v1",
    "tempo-ebay-bids-v1",
    "tempo-comc-overrides-v1",
    "tempo-custom-cards-v1"
  ];
  var COLLECTION_MODES = ["racing","baseball","basketball","football","hockey","soccer","other"];
  var SPORT_AUX_SUFFIXES = ["targets-v1","price-history-v1","tcdb-fixes-v1","tcdb-flags-v1","ebay-blocked-v1","ebay-bids-v1","comc-overrides-v1","custom-cards-v1","catalog-meta-v1","card-media-v1"];
  var sportAuxSnapshots = {}, sportAuxReads = {}, sportAuxWrites = {};
  var SCOPED_COLLECTION_KEYS = COLLECTION_MODES.map(function(mode) { return "collect-"+mode+"-alldata-v1"; });
  var CLOUD_KEYS = TB_CLOUD_KEYS.concat(TEMPO_CLOUD_KEYS, SCOPED_COLLECTION_KEYS);          // + TEMPO

  function isCloudKey(key) {
    return CLOUD_KEYS.indexOf(key) !== -1;
  }

  // Catalogue records merge individually. Collection ownership keeps its existing
  // separate storage path; never move ownership to a different card ID here.
  function isCatalogKey(key) {
    return key === "tb-custom-cards-v1" || key === "tb-catalog-meta-v1";
  }
  var catalogWrites = {};
  var priceHistoryWrites = {};
  var priceHistoryMemory = {};
  function isPriceHistoryKey(key) { return key === "tb-price-history-v1" || key === "tempo-price-history-v1"; }
  window.storageSyncIssues = {};

  function recordTime(record) {
    var time = record && record.updatedAt;
    var parsed = typeof time === "number" ? time : Date.parse(time || "");
    return Number.isFinite(parsed) ? parsed : 0;
  }
  function mergeRecord(local, remote) {
    return recordTime(remote) > recordTime(local)
      ? Object.assign({}, local, remote) : Object.assign({}, remote, local);
  }
  function cardIdentity(card) {
    return [card.product, card.cardNumber, card.cardSet].map(function(part) {
      return String(part || "").trim().replace(/\s+/g, " ").toLowerCase();
    }).join("|");
  }
  function customRecords(value) {
    if (!Array.isArray(value)) throw new Error("Custom cards must be a list");
    return value.map(function(card, index) {
      if (!card || typeof card !== "object" || Array.isArray(card)) {
        throw new Error("Invalid custom card at position " + index);
      }
      var id = card.id == null ? 10000 + index : Number(card.id);
      if (!Number.isSafeInteger(id) || id < 10000) throw new Error("Invalid custom card ID");
      return Object.assign({}, card, { id: id });
    });
  }
  function mergeCatalog(key, local, remote) {
    if (key === "tb-catalog-meta-v1") {
      if (!local || typeof local !== "object" || Array.isArray(local) ||
          !remote || typeof remote !== "object" || Array.isArray(remote)) {
        throw new Error("Catalogue metadata must be an object");
      }
      var metadata = Object.assign({}, remote);
      Object.keys(local).forEach(function(id) {
        metadata[id] = remote[id] ? mergeRecord(local[id], remote[id]) : local[id];
      });
      return { value: metadata, conflicts: [] };
    }
    var localCards = customRecords(local);
    var remoteCards = customRecords(remote);
    var merged = localCards.slice();
    var positions = new Map();
    var remoteIds = new Set();
    var conflicts = [];
    localCards.forEach(function(card, index) {
      if (positions.has(card.id)) conflicts.push({ id: card.id, reason: "Duplicate local card ID" });
      else positions.set(card.id, index);
    });
    remoteCards.forEach(function(card, index) {
      if (remoteIds.has(card.id)) {
        conflicts.push({ id: card.id, reason: "Duplicate cloud card ID" });
        return;
      }
      remoteIds.add(card.id);
      if (!positions.has(card.id)) {
        positions.set(card.id, merged.length);
        merged.push(card);
        return;
      }
      var position = positions.get(card.id);
      var existing = merged[position];
      var localTime = recordTime(existing), remoteTime = recordTime(card);
      // A timestamped edit may intentionally rename a card. Legacy array-slot
      // collisions without that evidence require review, never renumbering.
      var newerLocalEdit = localTime > remoteTime && local[position] && local[position].id != null;
      var newerRemoteEdit = remoteTime > localTime && remote[index] && remote[index].id != null;
      if (cardIdentity(existing) !== cardIdentity(card) && !newerLocalEdit && !newerRemoteEdit) {
        conflicts.push({ id: card.id, reason: "Different cards share this ID", local: existing, cloud: card });
        return;
      }
      merged[position] = mergeRecord(existing, card);
    });
    return { value: merged, conflicts: conflicts };
  }
  function reportSyncIssue(key, error, conflicts) {
    var issue = { key: key, error: error, conflicts: conflicts || [] };
    window.storageSyncIssues[key] = issue;
    window.dispatchEvent(new CustomEvent("storage-sync-issue", { detail: issue }));
  }
  function decodeCatalog(key, value) {
    if (value == null) return key === "tb-custom-cards-v1" ? [] : {};
    return typeof value === "string" ? JSON.parse(value) : value;
  }

  // Route key to its Supabase table.                               // + TEMPO
  function tableForKey(key) {                                        // + TEMPO
    if (typeof key === "string" && (key.indexOf("tempo-") === 0 || SCOPED_COLLECTION_KEYS.includes(key))) {    // + TEMPO
      return "tempo_collection_kv";                                  // + TEMPO
    }                                                                // + TEMPO
    return "collection_kv";                                          // + TEMPO
  }                                                                  // + TEMPO

  function sportMode(mode) { return COLLECTION_MODES.includes(mode); }
  function modePrefix(mode) { return mode === "tb" ? "tb" : mode === "wnba" ? "tempo" : sportMode(mode) ? "collect-"+mode : null; }
  function modeKey(suffix,mode) {
    var prefix=modePrefix(mode || window.MODE || "tb");
    if(!prefix) throw Error("Choose a supported collection.");
    return prefix+"-"+String(suffix).replace(/^(?:tb|tempo)-/,"");
  }
  // One tracker can display every collection; private modes are never persisted.
  window.MODE = "tb";                                                 // + TEMPO
  window.setMode = function (m) {                                     // + TEMPO
    if (!modePrefix(m)) return false;
    if (m !== "tb" && !isOwner) {
      console.warn("[storage] Private collections require owner login");
      return false;                                                   // + TEMPO
    }                                                                 // + TEMPO
    if (window.MODE!==m && scopes[window.MODE]?.api.hasPending()) return false;
    window.MODE = m;                                                  // + TEMPO
    window.dispatchEvent(new CustomEvent("modechange", { detail: { mode: m } })); // + TEMPO
    return true;                                                      // + TEMPO
  };                                                                  // + TEMPO

  // ── State ──
  var supabase = null;
  var isOwner = false;
  var privateGeneration = 0;
  var privateOwnerId = null;
  var hydrated = false;

  function updateSessionIdentity(user, force, deferEvents) {
    var ownerId = user && user.id || null;
    var changed = ownerId !== privateOwnerId;
    if (!changed && !force) return;
    privateOwnerId = ownerId;
    privateGeneration++;
    sportAuxSnapshots={};sportAuxReads={};sportAuxWrites={};
    if(changed && typeof scopes!=="undefined") {
      for(const scope of Object.values(scopes)) {
        scope.syncEngine.begin(null);
        if(scope.mode!=="tb") {scope.saved=null;try {localStorage.removeItem(scope.key);} catch (_) {}}
      }
    }
    isOwner = !!ownerId;
    if ((!isOwner || changed) && window.MODE !== "tb") {
      window.MODE = "tb";
      window.dispatchEvent(new CustomEvent("modechange", { detail: { mode: "tb" } }));
    }
    var generation=privateGeneration;
    function notifyAuth() {
      if(generation!==privateGeneration) return;
      window.dispatchEvent(new CustomEvent("authchange", { detail: { isOwner: isOwner, ownerId: ownerId, generation: generation } }));
    }
    // Auth listeners may call getUser. Run them after the SDK releases its auth lock.
    if(deferEvents) setTimeout(notifyAuth,0); else notifyAuth();
  }

  function initSupabase() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn("[storage] No Supabase config — localStorage only mode");
      return;
    }
    if (window.supabase && window.supabase.createClient) {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      if (supabase.auth.onAuthStateChange) supabase.auth.onAuthStateChange(function(event, session) {
        // Supabase broadcasts account changes and sign-outs across browser tabs.
        // Keep this callback synchronous; private requests perform their own verification.
        updateSessionIdentity(session && session.user, event === "SIGNED_OUT", true);
      });
      console.log("[storage] Supabase client ready");
    } else {
      console.warn("[storage] supabase-js not loaded — localStorage only mode");
    }
  }

  // ── Auth (exposed globally for the tracker UI) ──
  window.trackerAuth = {
    isOwner: function () { return isOwner; },
    userId: function () { return privateOwnerId; },

    login: async function (email, password) {
      if (!supabase) return { error: "Supabase not configured" };
      try {
        var result = await supabase.auth.signInWithPassword({ email: email, password: password });
        if (result.error) return { error: result.error.message };
        var sessionUser = result.data && (result.data.user || result.data.session && result.data.session.user);
        if (!sessionUser) return { error: "The signed-in account could not be verified." };
        updateSessionIdentity(sessionUser);
        console.log("[storage] Owner logged in");
        // Re-hydrate now that we have access to tempo keys                                  // + TEMPO
        hydrated = false;                                                                   // + TEMPO
        hydrateFromCloud().catch(function(error){reportSyncIssue("storage-bootstrap",error.message);});                                                                 // + TEMPO
        return { success: true };
      } catch (e) {
        return { error: e.message };
      }
    },

    logout: async function () {
      if (!supabase) return;
      // Clear private UI before waiting for the network sign-out response.
      updateSessionIdentity(null, true);
      await supabase.auth.signOut();
      // If we were in WNBA mode, force back to TB on logout            // + TEMPO
      if (window.MODE !== "tb") {
        window.MODE = "tb";                                              // + TEMPO
        window.dispatchEvent(new CustomEvent("modechange", { detail: { mode: "tb" } })); // + TEMPO
      }                                                                  // + TEMPO
      console.log("[storage] Logged out");
    },

    checkSession: async function () {
      if (!supabase) return false;
      try {
        var result = await cloudRequest("Checking sign-in",supabase.auth.getSession());
        if(result.error) throw new Error(result.error.message || "Session check failed.");
        var user = result.data && result.data.session && result.data.session.user;
        updateSessionIdentity(user);
        if (user) {
          console.log("[storage] Active session found — owner mode");
          return true;
        }
      } catch (e) {
        console.warn("[storage] Session check failed:", e);
        throw e;
      }
      return false;
    },

    // Push ALL cloud-synced localStorage keys to Supabase (one-time migration)
    migrateToCloud: async function () {
      if (!supabase || !isOwner) return { error: "Must be logged in as owner" };
      var migrated = 0;
      var errors = [];
      for (var i = 0; i < CLOUD_KEYS.length; i++) {
        var key = CLOUD_KEYS[i];
        try {
          var val = localStorage.getItem(key);
          if (val !== null) {
            if (collectionScopeForKey(key)) continue; // Ownership syncs only explicit edits.
            if (isCatalogKey(key)) {
              var catalogResult = await window.storage.set(key, val);
              if (catalogResult.cloudSaved) migrated++;
              else errors.push(key + ": " + (catalogResult.error || "Cloud save failed"));
              continue;
            }
            var jsonVal;
            try { jsonVal = JSON.parse(val); } catch (e) { jsonVal = val; }
            if (isPriceHistoryKey(key)) {
              var priceResult = await writeToCloud(key, jsonVal);
              if (priceResult.error) errors.push(key + ": " + priceResult.error); else migrated++;
              continue;
            }
            if (key === "tb-card-media-v1") jsonVal = window.TrackerMedia.normalizePublicMedia(jsonVal);
            var result = await supabase.from(tableForKey(key)).upsert(  // + TEMPO routed
              { key: key, value: jsonVal },
              { onConflict: "key" }
            );
            if (result.error) {
              errors.push(key + ": " + result.error.message);
            } else {
              migrated++;
              console.log("[storage] Migrated:", key);
            }
          }
        } catch (e) {
          errors.push(key + ": " + e.message);
        }
      }
      return { migrated: migrated, total: CLOUD_KEYS.length, errors: errors };
    }
  };

  // Per-copy purchases are private. These methods never read/write the public
  // collection_kv table and never cache purchase records in localStorage.
  // The database also enforces auth.uid() = owner_id with RLS.
  function privateSessionError() {
    var error = new Error("Your session changed. Refresh your private inventory before saving.");
    error.signedOut = true;
    return error;
  }
  async function privateUser(generation, expectedOwnerId) {
    if (!supabase) throw new Error("Cloud storage is unavailable.");
    var result = await supabase.auth.getUser();
    if (generation !== privateGeneration) throw privateSessionError();
    var user = result.data && result.data.user;
    if (result.error || !user) {
      updateSessionIdentity(null);
      var signInError = new Error("Sign in to access your private copy inventory.");
      signInError.signedOut = true;
      throw signInError;
    }
    if (user.id !== privateOwnerId) {
      updateSessionIdentity(user);
      throw privateSessionError();
    }
    if (expectedOwnerId && user.id !== expectedOwnerId) throw privateSessionError();
    return user;
  }
  window.trackerPrivateStore = {
    async load(key) {
      var generation = privateGeneration;
      try {
        var user = await privateUser(generation);
        var result = await supabase.from("collection_private_kv")
          .select("value, revision, updated_at").eq("owner_id", user.id).eq("key", key).maybeSingle();
        await privateUser(generation, user.id);
        if (result.error) throw new Error(result.error.message || "Could not load the private inventory.");
        var loaded={ ok: true, ownerId: user.id, value: result.data ? result.data.value : null, revision: result.data ? result.data.revision : null, updatedAt: result.data ? result.data.updated_at : null };
        rememberSportAux(key,loaded);
        return loaded;
      } catch (error) { return { ok: false, signedOut: !!error.signedOut, error: error.message || "Could not load the private inventory." }; }
    },
    async save(key, value, revision, expectedOwnerId) {
      var generation = privateGeneration;
      try {
        if (!expectedOwnerId) throw new Error("Refresh your private inventory before saving.");
        var user = await privateUser(generation, expectedOwnerId);
        var query;
        if (revision == null) {
          query = supabase.from("collection_private_kv").insert({ owner_id: user.id, key: key, value: value });
        } else {
          if (!Number.isSafeInteger(Number(revision)) || Number(revision) < 1) throw new Error("Refresh your private inventory before saving.");
          query = supabase.from("collection_private_kv").update({ value: value })
            .eq("owner_id", user.id).eq("key", key).eq("revision", revision);
        }
        var result = await query.select("value, revision, updated_at").maybeSingle();
        await privateUser(generation, expectedOwnerId);
        if (result.error && result.error.code !== "23505") throw new Error(result.error.message || "Could not save the private inventory.");
        if (result.error || !result.data) return { ok: false, conflict: true, error: "Your copy inventory changed in another session. Refresh it before saving; your newer cloud records were preserved." };
        var saved={ ok: true, ownerId: user.id, value: result.data.value, revision: result.data.revision, updatedAt: result.data.updated_at };
        rememberSportAux(key,saved);
        if(sportAuxDescriptor(key)?.field==="history") window.dispatchEvent(new CustomEvent("price-history-saved",{detail:{key}}));
        return saved;
      } catch (error) { return { ok: false, signedOut: !!error.signedOut, error: error.message || "Could not save the private inventory." }; }
    }
  };

  // Side-sport workflows share the copy/media/price models while every scope
  // remains a separate owner-private, revision-checked record. Creation is lazy.
  if (window.CollectionAdapters) window.trackerSportStores = window.CollectionAdapters.create(window.trackerPrivateStore, {
    CopyInventory:window.CopyInventory, TrackerMedia:window.TrackerMedia, PriceHistoryUtils:window.PriceHistoryUtils
  });

  // Compatibility for the shared tracker: sport settings remain in their
  // existing private stores. History and targets share one revisioned envelope.
  function sportAuxDescriptor(key) {
    if(typeof key!=="string") return null;
    var mode=COLLECTION_MODES.find(function(value){return key.startsWith("collect-"+value+"-");});
    if(!mode) return null;
    var prefix="collect-"+mode+"-",suffix=key.slice(prefix.length);
    if(suffix==="alldata-v1") return null;
    if(!SPORT_AUX_SUFFIXES.includes(suffix)) return {key,mode,unsupported:true};
    return {key,mode,suffix,storeKey:prefix+(suffix==="targets-v1"?"price-history-v1":suffix),field:suffix==="targets-v1"?"targets":suffix==="price-history-v1"?"history":null};
  }
  function sportAuxValue(descriptor,snapshot) {
    var value=snapshot && snapshot.value;
    if(descriptor.field) return value && value[descriptor.field] || {};
    return value == null ? (descriptor.suffix==="custom-cards-v1" ? [] : descriptor.suffix==="card-media-v1" ? {version:1,cards:{}} : {}) : value;
  }
  function sportAuxSnapshot(descriptor) {
    var snapshot=sportAuxSnapshots[descriptor.storeKey];
    return isOwner && snapshot && snapshot.ownerId===privateOwnerId ? snapshot : null;
  }
  function rememberSportAux(key,result) {
    var descriptor=sportAuxDescriptor(key);
    if(!descriptor || descriptor.unsupported || descriptor.storeKey!==key || !result.ok || result.ownerId!==privateOwnerId) return;
    var previous=sportAuxSnapshot(descriptor);
    if(!previous || Number(result.revision)>=Number(previous.revision)) sportAuxSnapshots[key]=result;
  }
  async function readSportAux(descriptor) {
    if(!isOwner || descriptor.unsupported) return null;
    var generation=privateGeneration,owner=privateOwnerId,snapshot=sportAuxSnapshot(descriptor);
    if(!snapshot) {
      var pending=sportAuxReads[descriptor.storeKey];
      if(!pending) {
        pending=window.trackerPrivateStore.load(descriptor.storeKey);
        sportAuxReads[descriptor.storeKey]=pending;
      }
      var result=await pending;
      if(sportAuxReads[descriptor.storeKey]===pending) delete sportAuxReads[descriptor.storeKey];
      if(generation!==privateGeneration || owner!==privateOwnerId) throw privateSessionError();
      if(!result.ok) throw Error(result.error || "Private collection settings could not load.");
      rememberSportAux(descriptor.storeKey,result);snapshot=sportAuxSnapshot(descriptor);
    }
    return {key:descriptor.key,value:JSON.stringify(sportAuxValue(descriptor,snapshot)),shared:false,private:true};
  }
  async function saveSportAux(descriptor,value) {
    var generation=privateGeneration,owner=privateOwnerId;
    var previous=sportAuxWrites[descriptor.storeKey] || Promise.resolve();
    var pending=previous.catch(function(){}).then(async function(){
      try {
        if(descriptor.unsupported) throw Error("Use this collection's dedicated editor for this private record.");
        if(generation!==privateGeneration || owner!==privateOwnerId || !isOwner) throw privateSessionError();
        var snapshot=sportAuxSnapshot(descriptor);
        if(!snapshot) throw Error("Load this collection's saved settings before editing them.");
        var incoming=typeof value==="string" ? JSON.parse(value) : value,next;
        if(descriptor.field) {
          var current=snapshot.value || {schemaVersion:1,history:{},targets:{}};
          if(current.schemaVersion!==1 || !current.history || !current.targets) throw Error("Private price history needs review. Nothing was replaced.");
          next=Object.assign({},current);
          next[descriptor.field]=descriptor.field==="history" ? window.PriceHistoryUtils.merge(current.history,incoming) : incoming;
        } else next=descriptor.suffix==="card-media-v1" ? window.TrackerMedia.normalizeScopedMedia(incoming) : incoming;
        var result=await window.trackerPrivateStore.save(descriptor.storeKey,next,snapshot.revision,owner);
        if(generation!==privateGeneration || owner!==privateOwnerId) throw privateSessionError();
        if(!result.ok) {
          if(result.conflict || result.signedOut) delete sportAuxSnapshots[descriptor.storeKey];
          throw Error(result.error || "The private collection settings were not saved.");
        }
        sportAuxSnapshots[descriptor.storeKey]=result;
        delete window.storageSyncIssues[descriptor.key];
        return {key:descriptor.key,value:JSON.stringify(sportAuxValue(descriptor,result)),shared:false,private:true,localSaved:false,cloudSaved:true};
      } catch(error) {
        reportSyncIssue(descriptor.key,error.message);
        return {key:descriptor.key,shared:false,private:true,localSaved:false,cloudSaved:false,error:error.message};
      }
    });
    sportAuxWrites[descriptor.storeKey]=pending;
    var result=await pending;
    if(sportAuxWrites[descriptor.storeKey]===pending) delete sportAuxWrites[descriptor.storeKey];
    return result;
  }

  // Public catalogue references have their own read path so Refresh can replace
  // an old local cache. Copy photos are never supplied to this public store.
  window.trackerMediaStore = {
    async load() {
      var key = "tb-card-media-v1", normalize = window.TrackerMedia.normalizePublicMedia;
      var cached = normalize(null);
      try { cached = normalize(localStorage.getItem(key)); } catch (_) {}
      if (!supabase) return { ok: true, localOnly: true, value: cached };
      try {
        if (window.storageReady) await window.storageReady;
        var result = await supabase.from("collection_kv").select("value").eq("key", key).maybeSingle();
        if (result.error) throw new Error(result.error.message || "Reference photos could not be loaded.");
        var value = normalize(result.data && result.data.value);
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
        return { ok: true, value: value };
      } catch (error) { return { ok: false, value: cached, error: error.message || "Reference photos could not be loaded." }; }
    }
  };

  // ── Hydrate: pull ALL cloud data into localStorage on startup ──
  // Now queries BOTH tables. Tempo table only queried if owner is logged in     // + TEMPO
  // (anon SELECT is denied on tempo_collection_kv anyway).                       // + TEMPO
  const collectionKey = "tb-alldata-v1";
  const scopeModes = ["tb","wnba",...COLLECTION_MODES];
  const scopes = {};
  function keyForCollection(mode) {
    return mode === "tb" ? collectionKey : mode === "wnba" ? "tempo-alldata-v1" : "collect-"+mode+"-alldata-v1";
  }
  function collectionScopeForKey(key) { return Object.values(scopes).find(scope=>scope.key===key); }
  const collectionWriter = Date.now().toString(36)+"-"+Math.random().toString(36).slice(2);
  function reportCollectionError(scope,error) {
    const detail={key:scope.key,error:error.message,conflicts:error.conflicts || [],journal:error.journal};
    window.storageSyncIssues[scope.key]=detail;
    window.dispatchEvent(new CustomEvent("storage-sync-issue",{detail}));
  }
  function makeScope(mode) {
    const key=keyForCollection(mode), table=tableForKey(key), scope={mode,key,saved:null};
    async function readCollection(editKeys) {
      if (!supabase) throw Error("Cloud storage is unavailable.");
      const generation=privateGeneration;
      const user=(mode!=="tb" || editKeys) ? await privateUser(generation) : null;
      const query=editKeys
        ? supabase.rpc(mode==="tb" ? "tb_read_collection_for_edit" : "tb_read_scoped_collection_for_edit",
          mode==="tb" ? {edit_keys:editKeys} : {collection_key:key,edit_keys:editKeys})
        : supabase.from(table).select("value, updated_at").eq("key",key);
      const row=await query.single();
      if(user) await privateUser(generation,user.id);
      if(row.error || !row.data || !row.data.updated_at) throw Error(row.error && row.error.message || "Could not read the saved collection.");
      if(editKeys && !Array.isArray(row.data.applied_keys)) throw Error("Could not verify previously saved edits. Your changes are pending.");
      return row.data;
    }
    function cache(value) {
      scope.saved=value;
      // A sport catalogue can exceed the entire browser quota. Keep full snapshots
      // in memory; only small pending edit journals use durable local storage.
      if(mode==="tb" || mode==="wnba") {try { localStorage.setItem(key,JSON.stringify(value)); } catch (_) {}}
      return value;
    }
    const sync=window.CollectionSync.create({storage:localStorage,owner:()=>privateOwnerId,
      namespace:mode==="tb" ? "tb" : mode==="wnba" ? "tempo" : "collect-"+mode,
      read:readCollection,id:collectionWriter,issue:message=>reportSyncIssue(key,message),
      write:async function(value,version) {
        const generation=privateGeneration,user=await privateUser(generation);
        const result=await supabase.from(table).update({value}).eq("key",key).eq("updated_at",version).select("value,updated_at").maybeSingle();
        await privateUser(generation,user.id);
        if(result.error && !["40001","PT409"].includes(result.error.code)) throw Error(result.error.message);
        return result.data;
      }});
    async function save(value) {
      if(!isOwner) return {cloudSaved:false,error:"Sign in to sync collection edits."};
      try {
        if(value && sync.stage(typeof value==="string" ? JSON.parse(value) : value)===false)
          throw Error("Load this collection before saving edits. Your saved collection was not changed.");
        const saved=await sync.flush();
        if(saved) cache(saved);
        delete window.storageSyncIssues[key];
        if(mode==="tb") window.dispatchEvent(new CustomEvent("collection-synced",{detail:saved}));
        window.dispatchEvent(new CustomEvent("scoped-collection-synced",{detail:{key,mode,value:saved}}));
        return {cloudSaved:true,value:saved || scope.saved};
      } catch(error) { reportCollectionError(scope,error);return {cloudSaved:false,error:error.message}; }
    }
    scope.cache=cache;scope.syncEngine=sync;scope.readRaw=readCollection;
    scope.api={begin:sync.begin,stage:sync.stage,hasPending:sync.hasPending,key,
      read:async function() {
        try {
          if(sync.hasPending()) throw Error("Save or review your pending edits before refreshing this collection.");
          // Lazy scopes still recover durable offline edits before displaying cloud state.
          const resumed=COLLECTION_MODES.includes(mode) ? await sync.resume() : null;
          return cache(resumed || (await readCollection()).value);
        } catch(error) {reportCollectionError(scope,error);throw error;}
      },
      resolve:async function(journal,conflict,local) {sync.resolve(journal,conflict,local);return save();},sync:save};
    return scope;
  }
  for(const mode of scopeModes) scopes[mode]=makeScope(mode);
  window.trackerCollection=scopes.tb.api;
  window.trackerCollections={forMode:function(mode) {
    if(!scopes[mode]) throw Error("Unknown collection sport.");
    return scopes[mode].api;
  }};
  window.trackerModes={isSport:sportMode,prefix:modePrefix,keyForMode:modeKey,modes:["tb","wnba",...COLLECTION_MODES],
    hasPending:function(){return Object.keys(sportAuxWrites).length>0;},
    async prepare(mode) {
      if(window.storageReady) await window.storageReady;
      if(!modePrefix(mode) || mode!=="tb" && !isOwner) return {ok:false,error:"Sign in to open this collection."};
      try {
        var generation=privateGeneration,value=await scopes[mode].api.read();
        // Other collections do not preload market prices/targets/bids. Existing
        // financial evidence remains available through explicit private reads.
        if(sportMode(mode)) await Promise.all(["tcdb-fixes-v1","tcdb-flags-v1","ebay-blocked-v1","comc-overrides-v1"].map(function(suffix){return readSportAux(sportAuxDescriptor(modeKey(suffix,mode)));}));
        if(generation!==privateGeneration) throw privateSessionError();
        return {ok:true,value,key:keyForCollection(mode)};
      } catch(error) {return {ok:false,error:error.message};}
    }
  };

  async function hydrateFromCloud() {
    if (!supabase || hydrated) return;
    const hydrationGeneration=privateGeneration;
    try {
      // Pull TB rows from collection_kv (was the only query)
      var tbResult = await cloudRequest("Loading Tyler collection",supabase.from("collection_kv").select("key, value, updated_at"));
      if(hydrationGeneration!==privateGeneration) return;
      var rows = [];
      if (tbResult.error) {
        throw new Error("Tyler collection could not load: "+tbResult.error.message);
      } else {
        rows = tbResult.data || [];
      }

      // Pull Tempo rows from tempo_collection_kv ONLY when owner is logged in   // + TEMPO
      if (isOwner) {                                                              // + TEMPO
        var tempoResult = await cloudRequest("Loading Tempo collection",supabase.from("tempo_collection_kv").select("key, value, updated_at").in("key",TEMPO_CLOUD_KEYS)); // Sport collections load only when opened.
        if(hydrationGeneration!==privateGeneration) return;
        if (tempoResult.error) {                                                  // + TEMPO
          throw new Error("Tempo collection could not load: "+tempoResult.error.message); // + TEMPO
        } else if (tempoResult.data) {                                            // + TEMPO
          rows = rows.concat(tempoResult.data);                                   // + TEMPO
        }                                                                          // + TEMPO
      }                                                                            // + TEMPO

      console.log("[storage] Hydrating " + rows.length + " keys from cloud");
      for (var i = 0; i < rows.length; i++) {
        if(hydrationGeneration!==privateGeneration) return;
        var row = rows[i];
        try {
          var cloudVal = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
          const collectionScope=collectionScopeForKey(row.key);
          if (collectionScope) {
            let saved=row.value;
            // Keep evidence-backed old edits in a review journal; never replay a cache wholesale.
            for(const suffix of ["", "-backup"]) {
              const cacheKey=row.key.replace("alldata-v1","alldata"+suffix+"-v1");
              const local=localStorage.getItem(cacheKey);
              if(!local) continue;
              try {collectionScope.syncEngine.recoverLegacy(JSON.parse(local),saved);}
              catch(error) {console.warn("[storage] Could not inspect older collection cache:",error.message);}
            }
            if(isOwner) {
              try {saved=await cloudRequest("Restoring "+collectionScope.mode+" pending edits",collectionScope.syncEngine.resume()) || (await cloudRequest("Checking "+collectionScope.mode+" revision",collectionScope.readRaw())).value;}
              catch(error) {reportCollectionError(collectionScope,error);}
            }
            if(hydrationGeneration!==privateGeneration) return;
            collectionScope.cache(saved);
            continue;
          }
          if (isPriceHistoryKey(row.key)) {
            priceHistoryMemory[row.key]=JSON.stringify(window.PriceHistoryUtils.merge(row.value,priceHistoryMemory[row.key] || localStorage.getItem(row.key)));
            localStorage.setItem(row.key,priceHistoryMemory[row.key]);
            continue;
          }
          if (row.key === "tb-card-media-v1") {
            localStorage.setItem(row.key, JSON.stringify(window.TrackerMedia.normalizePublicMedia(row.value)));
            continue;
          }
          if (isCatalogKey(row.key)) {
            var mergedCatalog = mergeCatalog(row.key,
              decodeCatalog(row.key, localStorage.getItem(row.key)), decodeCatalog(row.key, row.value));
            localStorage.setItem(row.key, JSON.stringify(mergedCatalog.value));
            if (mergedCatalog.conflicts.length) {
              reportSyncIssue(row.key, "Custom card IDs conflict; both versions are retained for review.", mergedCatalog.conflicts);
            } else {
              delete window.storageSyncIssues[row.key];
            }
            continue;
          }
          // For non-alldata keys: only hydrate if localStorage doesn't already have data
          // This prevents cloud (which may be stale) from overwriting fresh local writes
          if (row.key !== "tb-alldata-v1" && row.key !== "tempo-alldata-v1") {     // + TEMPO modified condition
            var existingLocal = localStorage.getItem(row.key);
            if (existingLocal && existingLocal.length > 2) {
              console.log("[storage] Keeping local " + row.key + " (" + existingLocal.length + " chars, cloud has " + cloudVal.length + " chars)");
              continue;
            }
          }
          localStorage.setItem(row.key, cloudVal);
          console.log("[storage] Hydrated:", row.key, "(" + cloudVal.length + " chars)");
        } catch (e) {
          console.warn("[storage] Cache write failed for", row.key, e);
        }
      }
      hydrated = true;
      console.log("[storage] Cloud → localStorage hydration complete");
    } catch (e) {
      console.error("[storage] Hydration error:", e);
      throw e;
    }
  }

  // ── Cloud write (awaited; errors are returned to the caller) ──
  async function writePriceHistory(key,value) {
    var table=tableForKey(key),helper = window.PriceHistoryUtils;
    for (var attempt = 0; attempt < 5; attempt++) {
      if (!isOwner) throw new Error("Sign in to save price history.");
      var current = await supabase.from(table).select("value, updated_at").eq("key", key).maybeSingle();
      if (current.error) throw new Error(current.error.message || "Could not read current cloud price history.");
      var merged = helper.merge(current.data && current.data.value, helper.merge(value, priceHistoryMemory[key] || localStorage.getItem(key)));
      var query;
      if (current.data) {
        if (!current.data.updated_at) throw new Error("Cloud price-history revision is missing. Refresh before saving.");
        query = supabase.from(table).update({value:merged}).eq("key",key).eq("updated_at",current.data.updated_at);
      } else query = supabase.from(table).insert({key:key,value:merged});
      var saved = await query.select("value, updated_at").maybeSingle();
      if (saved.error && saved.error.code !== "23505") throw new Error(saved.error.message || "Could not save price history.");
      if (!saved.error && saved.data) {
        var cached = helper.merge(saved.data.value, priceHistoryMemory[key] || localStorage.getItem(key));
        var cachedText=JSON.stringify(cached),cacheError="";
        priceHistoryMemory[key]=cachedText;
        try {localStorage.setItem(key,cachedText);} catch(error) {cacheError=error.message || "Browser cache quota exceeded.";}
        delete window.storageSyncIssues[key];
        window.dispatchEvent(new CustomEvent("price-history-saved",{detail:{key:key}}));
        return {cloudSaved:true,value:cachedText,...(cacheError?{localError:cacheError,localSaved:false}:{})};
      }
      // Another tab won the timestamp comparison, or inserted the first row.
      // Re-read and merge that winner before the next conditional write.
    }
    throw new Error("Price history kept changing in another session. Your local evidence is retained; refresh and try saving again.");
  }
  async function writeToCloud(key, value) {
    if (!supabase) return { cloudSaved: false, error: "Cloud storage is unavailable" };
    if (!isOwner) return { cloudSaved: false, error: "Sign in to save changes to cloud" };
    var table = tableForKey(key);                                       // + TEMPO
    try {
      if (isPriceHistoryKey(key)) return await writePriceHistory(key,value);
      var jsonVal;
      try { jsonVal = typeof value === "string" ? JSON.parse(value) : value; }
      catch (e) { jsonVal = value; }
      if (key === "tb-card-media-v1") jsonVal = window.TrackerMedia.normalizePublicMedia(jsonVal);

      if (isCatalogKey(key)) {
        var current = await supabase.from(table).select("value").eq("key", key).maybeSingle();
        if (current.error) throw new Error(current.error.message || "Could not read the cloud catalogue");
        // Include edits made while that read was in flight. Writes for this key
        // are serialized below, so an older request cannot finish after a newer one.
        var latestLocal = localStorage.getItem(key);
        var reconciled = mergeCatalog(key, decodeCatalog(key, latestLocal == null ? jsonVal : latestLocal),
          decodeCatalog(key, current.data && current.data.value));
        jsonVal = reconciled.value;
        localStorage.setItem(key, JSON.stringify(jsonVal));
        if (reconciled.conflicts.length) {
          var conflictError = "Custom card IDs conflict; cloud changes were not overwritten. Review the conflicting cards.";
          reportSyncIssue(key, conflictError, reconciled.conflicts);
          return { cloudSaved: false, value: JSON.stringify(jsonVal), error: conflictError, conflicts: reconciled.conflicts };
        }
      }

      var result = await supabase.from(table).upsert(                  // + TEMPO routed (was "collection_kv")
        { key: key, value: jsonVal },
        { onConflict: "key" }
      );
      if (result.error) {
        throw new Error(result.error.message || "Cloud save failed");
      }
      delete window.storageSyncIssues[key];
      return { cloudSaved: true, value: JSON.stringify(jsonVal) };
    } catch (e) {
      console.error("[storage] Cloud write error:", key, e);
      reportSyncIssue(key, e.message || "Cloud save failed");
      return { cloudSaved: false, error: e.message || "Cloud save failed" };
    }
  }

  async function deleteFromCloud(key) {
    if (!supabase || !isOwner) return;
    try {
      await supabase.from(tableForKey(key)).delete().eq("key", key);   // + TEMPO routed (was "collection_kv")
    } catch (e) {
      console.error("[storage] Cloud delete error:", e);
    }
  }

  // ── window.storage API (same interface tracker already uses) ──
  window.storage = {
    peek(key) {
      var descriptor=sportAuxDescriptor(key);
      if(descriptor) {var snapshot=!descriptor.unsupported && sportAuxSnapshot(descriptor);return snapshot?JSON.stringify(sportAuxValue(descriptor,snapshot)):null;}
      var scope=collectionScopeForKey(key);
      if(scope && sportMode(scope.mode)) return isOwner && scope.saved ? JSON.stringify(scope.saved) : null;
      if(isPriceHistoryKey(key) && priceHistoryMemory[key]) return priceHistoryMemory[key];
      try {return localStorage.getItem(key);} catch(_) {return null;}
    },
    async get(key) {
      var descriptor=sportAuxDescriptor(key);
      if(descriptor) return readSportAux(descriptor);
      if(isPriceHistoryKey(key) && priceHistoryMemory[key]) return {key:key,value:priceHistoryMemory[key],shared:false};
      const collectionScope=collectionScopeForKey(key);
      if(collectionScope) {
        if(collectionScope.mode!=="tb" && !isOwner) return null;
        if(collectionScope.saved) return {key,value:JSON.stringify(collectionScope.saved)};
        if(COLLECTION_MODES.includes(collectionScope.mode)) {
          const value=await collectionScope.api.read();
          return {key,value:JSON.stringify(value)};
        }
      }
      // Fast path: localStorage cache
      try {
        var val = localStorage.getItem(key);
        if (val !== null) return { key: key, value: val, shared: false };
      } catch (e) {}

      // Cache miss + cloud key → try Supabase directly
      if (supabase && isCloudKey(key)) {
        try {
          var r = await supabase.from(tableForKey(key))                // + TEMPO routed (was "collection_kv")
            .select("value").eq("key", key).single();
          if (r.data) {
            var cv = typeof r.data.value === "string"
              ? r.data.value : JSON.stringify(r.data.value);
            try { localStorage.setItem(key, cv); } catch (e) {}
            return { key: key, value: cv, shared: false };
          }
        } catch (e) {}
      }
      return null;
    },

    async set(key, value) {
      var descriptor=sportAuxDescriptor(key);
      if(descriptor) return saveSportAux(descriptor,value);
      const collectionScope=collectionScopeForKey(key);
      if(collectionScope) return collectionScope.api.sync(value);
      if (key === "tb-card-media-v1") value = window.TrackerMedia.normalizePublicMedia(value);
      if (isPriceHistoryKey(key)) value = window.PriceHistoryUtils.merge(priceHistoryMemory[key] || localStorage.getItem(key),value);
      if (typeof value !== "string") value = JSON.stringify(value);
      if(isPriceHistoryKey(key)) priceHistoryMemory[key]=value;

      var localSaved = true;
      var localError = "";
      try { localStorage.setItem(key, value); }
      catch (e) { localSaved = false; localError = e.message; console.error("[storage] localStorage set failed:", key, e); }

      // Cloud keys: also persist to Supabase (awaited for restore reliability)
      var cloudResult = { cloudSaved: false, localOnly: true };
      if (isPriceHistoryKey(key)) {
        var pendingPrice = (priceHistoryWrites[key] || Promise.resolve()).then(function(){return writeToCloud(key,value);});
        priceHistoryWrites[key] = pendingPrice;
        cloudResult = await pendingPrice;
        if(priceHistoryWrites[key]===pendingPrice) delete priceHistoryWrites[key];
      } else if (isCatalogKey(key) && !localSaved) {
        cloudResult = { cloudSaved: false, error: "Local catalogue could not be saved; cloud was not changed" };
      } else if (isCatalogKey(key)) {
        var previous = catalogWrites[key] || Promise.resolve();
        var pending = previous.then(function() { return writeToCloud(key, value); });
        catalogWrites[key] = pending;
        cloudResult = await pending;
        if (catalogWrites[key] === pending) delete catalogWrites[key];
      } else if (isCloudKey(key)) {
        cloudResult = await writeToCloud(key, value);
      }

      var response = Object.assign({ key: key, value: value, shared: false, localSaved: localSaved }, cloudResult);
      if (localError) response.localError = localError;
      return response;
    },

    async delete(key) {
      if(sportAuxDescriptor(key)) return {key,deleted:false,error:"Change private collection records through their saved editors."};
      if(collectionScopeForKey(key)) return {key,deleted:false,error:"Change collection entries individually."};
      if(isPriceHistoryKey(key)) delete priceHistoryMemory[key];
      try { localStorage.removeItem(key); } catch (e) {}
      if (isCloudKey(key)) deleteFromCloud(key);
      return { key: key, deleted: true, shared: false };
    },

    async list(prefix) {
      var keys = [];
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if(sportAuxDescriptor(k) || SCOPED_COLLECTION_KEYS.includes(k)) continue;
          if (!prefix || k.startsWith(prefix)) keys.push(k);
        }
      } catch (e) {}
      if(isOwner) COLLECTION_MODES.forEach(function(mode){SPORT_AUX_SUFFIXES.forEach(function(suffix){var key=modeKey(suffix,mode),descriptor=sportAuxDescriptor(key);if(sportAuxSnapshot(descriptor) && (!prefix || key.startsWith(prefix)))keys.push(key);});});
      return { keys: keys, prefix: prefix || null, shared: false };
    }
  };

  // Read-only, owner-only activity feed. Entries are written by database triggers,
  // so direct backend edits appear even when no browser is open.
  window.trackerAudit = {
    list: async function(options) {
      options = options || {};
      if (!supabase || !isOwner || !privateOwnerId) return { ok:false, error:"Owner login required." };
      if (window.storageReady) await window.storageReady;
      var limit = Math.min(500,Math.max(1,Math.floor(Number(options.limit) || 500)));
      var offset = Math.max(0,Math.floor(Number(options.offset) || 0));
      try {
        var query = supabase.from("tb_collection_activity")
          .select("id,changed_at,card_id,category,field,old_value,new_value,actor,copy_id,source_ref,evidence_note,evidence_level,source_key,impact_kind", { count:"exact" });
        if (options.filter === "impact" || options.filter === "movement") query = query.not("impact_kind","is",null);
        else if (options.filter === "received") query = query.in("impact_kind",["transit_to_owned","location_to_hand"]);
        else if (options.filter === "added") query = query.in("impact_kind",["added_owned","added_transit","qty_up","count_added"]);
        else if (options.filter === "removed") query = query.in("impact_kind",["removed","owned_to_transit","location_left_hand","qty_down","count_removed"]);
        else if (options.filter === "to_transit") query = query.in("impact_kind",["owned_to_transit","location_left_hand","location_assigned_transit"]);
        else if (options.filter === "qty") query = query.in("impact_kind",["qty_up","qty_down","qty_set","qty_unset","count_added","count_removed"]);
        else if (options.filter === "pending") query = query.eq("category","copy").eq("evidence_level","pending");
        else if (options.filter === "comc") query = query.or("evidence_level.eq.comc_source_matched,source_ref.ilike.%comc.com%");
        else if (options.filter === "backend_impact") query = query.in("actor",["Backend","Backfill","Snapshot"]).not("impact_kind","is",null);
        else if (options.filter === "site_impact") query = query.eq("actor","Site").not("impact_kind","is",null);
        else if (options.filter === "historic_impact") query = query.eq("actor","Historic").not("impact_kind","is",null);
        else if (options.filter === "verify_impact") query = query.in("evidence_level",["recorded_not_physical","snapshot_only","backend_unverified","corrected_unconfirmed"]).not("impact_kind","is",null);
        else if (options.filter === "qty_set") query = query.in("impact_kind",["qty_set","qty_unset"]);
        else if (options.filter === "backend") query = query.in("actor",["Backend","Backfill","Snapshot"]);
        else if (options.filter === "evidence") query = query.in("category",["source","catalog","photo","price","review","verification","system"]);
        else if (options.filter && options.filter !== "all") query = query.eq("category",options.filter);
        var result = await query.order("changed_at",{ascending:false}).order("id",{ascending:false})
          .range(offset,offset+limit-1);
        if (result.error) throw new Error(result.error.message || "Activity could not be loaded.");
        return { ok:true, rows:result.data || [], total:result.count == null ? null : result.count,
          hasMore:(result.count != null ? offset + (result.data || []).length < result.count : (result.data || []).length === limit) };
      } catch(error) { return { ok:false, error:error.message || "Activity could not be loaded." }; }
    }
  };

  // Every startup request has a visible phase and deadline. A failed startup
  // rejects storageReady; the UI must never treat cached defaults as hydrated.
  window.storageBootState={phase:"Starting",error:null};
  function cloudRequest(phase,request) {
    window.storageBootState.phase=phase;
    console.log("[storage] "+phase);
    return new Promise(function(resolve,reject) {
      var settled=false;
      var timer=setTimeout(function(){
        if(settled)return;settled=true;
        var error=new Error(phase+" timed out. Reload to retry; collection edits remain disabled.");
        error.code="STORAGE_TIMEOUT";reject(error);
      },15000);
      Promise.resolve(request).then(function(value){
        if(settled)return;settled=true;if(typeof clearTimeout==="function")clearTimeout(timer);resolve(value);
      },function(error){
        if(settled)return;settled=true;if(typeof clearTimeout==="function")clearTimeout(timer);reject(error);
      });
    });
  }
  // ── Boot sequence ──
  initSupabase();

  window.storageReady = (async function () {
    if (supabase) {
      await window.trackerAuth.checkSession();
      await hydrateFromCloud();
    }
    window.storageBootState.phase="Ready";
    console.log("[storage] Ready. Owner:", isOwner, "| Cloud:", !!supabase, "| Hydrated:", hydrated, "| Mode:", window.MODE);
  })().catch(function(error){
    window.storageBootState.error=error.message;
    reportSyncIssue("storage-bootstrap",error.message);
    throw error;
  });
  // Preserve rejection for callers while avoiding an unhandled rejection before
  // Babel finishes compiling and attaches the bootstrap UI.
  window.storageReady.catch(function(){});

})();
