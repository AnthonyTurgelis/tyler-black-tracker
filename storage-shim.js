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
  var CLOUD_KEYS = TB_CLOUD_KEYS.concat(TEMPO_CLOUD_KEYS);          // + TEMPO

  function isCloudKey(key) {
    return CLOUD_KEYS.indexOf(key) !== -1;
  }

  // Catalogue records merge individually. Collection ownership keeps its existing
  // separate storage path; never move ownership to a different card ID here.
  function isCatalogKey(key) {
    return key === "tb-custom-cards-v1" || key === "tb-catalog-meta-v1";
  }
  var catalogWrites = {};
  var priceHistoryWrite = Promise.resolve();
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
    if (typeof key === "string" && key.indexOf("tempo-") === 0) {    // + TEMPO
      return "tempo_collection_kv";                                  // + TEMPO
    }                                                                // + TEMPO
    return "collection_kv";                                          // + TEMPO
  }                                                                  // + TEMPO

  // ── Mode (TB default; WNBA owner-only; never persisted) ──        // + TEMPO
  window.MODE = "tb";                                                 // + TEMPO
  window.setMode = function (m) {                                     // + TEMPO
    if (m === "wnba" && !isOwner) {                                   // + TEMPO
      console.warn("[storage] WNBA mode requires owner login");      // + TEMPO
      return false;                                                   // + TEMPO
    }                                                                 // + TEMPO
    if (m !== "tb" && m !== "wnba") return false;                    // + TEMPO
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

  function updateSessionIdentity(user, force) {
    var ownerId = user && user.id || null;
    var changed = ownerId !== privateOwnerId;
    if (!changed && !force) return;
    privateOwnerId = ownerId;
    privateGeneration++;
    isOwner = !!ownerId;
    if (!isOwner && window.MODE === "wnba") {
      window.MODE = "tb";
      window.dispatchEvent(new CustomEvent("modechange", { detail: { mode: "tb" } }));
    }
    window.dispatchEvent(new CustomEvent("authchange", { detail: { isOwner: isOwner, ownerId: ownerId, generation: privateGeneration } }));
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
        updateSessionIdentity(session && session.user, event === "SIGNED_OUT");
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
        hydrateFromCloud();                                                                 // + TEMPO
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
      if (window.MODE === "wnba") {                                     // + TEMPO
        window.MODE = "tb";                                              // + TEMPO
        window.dispatchEvent(new CustomEvent("modechange", { detail: { mode: "tb" } })); // + TEMPO
      }                                                                  // + TEMPO
      console.log("[storage] Logged out");
    },

    checkSession: async function () {
      if (!supabase) return false;
      try {
        var result = await supabase.auth.getSession();
        var user = result.data && result.data.session && result.data.session.user;
        updateSessionIdentity(user);
        if (user) {
          console.log("[storage] Active session found — owner mode");
          return true;
        }
      } catch (e) {
        console.warn("[storage] Session check failed:", e);
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
            if (isCatalogKey(key)) {
              var catalogResult = await window.storage.set(key, val);
              if (catalogResult.cloudSaved) migrated++;
              else errors.push(key + ": " + (catalogResult.error || "Cloud save failed"));
              continue;
            }
            var jsonVal;
            try { jsonVal = JSON.parse(val); } catch (e) { jsonVal = val; }
            if (key === "tb-price-history-v1") {
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
        return { ok: true, ownerId: user.id, value: result.data ? result.data.value : null, revision: result.data ? result.data.revision : null, updatedAt: result.data ? result.data.updated_at : null };
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
        return { ok: true, ownerId: user.id, value: result.data.value, revision: result.data.revision, updatedAt: result.data.updated_at };
      } catch (error) { return { ok: false, signedOut: !!error.signedOut, error: error.message || "Could not save the private inventory." }; }
    }
  };

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
  async function hydrateFromCloud() {
    if (!supabase || hydrated) return;
    try {
      // Pull TB rows from collection_kv (was the only query)
      var tbResult = await supabase.from("collection_kv").select("key, value, updated_at");
      var rows = [];
      if (tbResult.error) {
        console.error("[storage] TB hydration failed:", tbResult.error.message);
      } else {
        rows = tbResult.data || [];
      }

      // Pull Tempo rows from tempo_collection_kv ONLY when owner is logged in   // + TEMPO
      if (isOwner) {                                                              // + TEMPO
        var tempoResult = await supabase.from("tempo_collection_kv").select("key, value, updated_at"); // + TEMPO
        if (tempoResult.error) {                                                  // + TEMPO
          console.warn("[storage] Tempo hydration failed:", tempoResult.error.message); // + TEMPO
        } else if (tempoResult.data) {                                            // + TEMPO
          rows = rows.concat(tempoResult.data);                                   // + TEMPO
        }                                                                          // + TEMPO
      }                                                                            // + TEMPO

      console.log("[storage] Hydrating " + rows.length + " keys from cloud");
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        try {
          var cloudVal = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
          if (row.key === "tb-price-history-v1") {
            localStorage.setItem(row.key, JSON.stringify(window.PriceHistoryUtils.merge(row.value, localStorage.getItem(row.key))));
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
          // For alldata keys, compare timestamps — don't overwrite newer local data
          // Apply same logic to BOTH tb-alldata-v1 and tempo-alldata-v1            // + TEMPO
          if (row.key === "tb-alldata-v1" || row.key === "tempo-alldata-v1") {     // + TEMPO modified condition
            var localVal = localStorage.getItem(row.key);
            if (localVal) {
              try {
                var localData = JSON.parse(localVal);
                var cloudData = typeof row.value === "string" ? JSON.parse(row.value) : row.value;
                var localTs = localData._saveTimestamp || 0;
                var cloudTs = cloudData._saveTimestamp || 0;
                if (localTs > cloudTs) {
                  console.log("[storage] Keeping local " + row.key + " (local:" + localTs + " > cloud:" + cloudTs + ")");
                  continue;
                }
                // Also check: if local has more data, keep local
                var localStatuses = Object.keys(localData.statuses || {}).length;
                var cloudStatuses = Object.keys(cloudData.statuses || {}).length;
                if (localStatuses > cloudStatuses + 10) {
                  console.log("[storage] Keeping local " + row.key + " (local has " + localStatuses + " statuses vs cloud " + cloudStatuses + ")");
                  continue;
                }
              } catch (parseErr) {
                // Can't compare, use cloud
              }
            }
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
    }
  }

  // ── Cloud write (awaited; errors are returned to the caller) ──
  async function writePriceHistory(value) {
    var key = "tb-price-history-v1", helper = window.PriceHistoryUtils;
    for (var attempt = 0; attempt < 5; attempt++) {
      if (!isOwner) throw new Error("Sign in to save price history.");
      var current = await supabase.from("collection_kv").select("value, updated_at").eq("key", key).maybeSingle();
      if (current.error) throw new Error(current.error.message || "Could not read current cloud price history.");
      var merged = helper.merge(current.data && current.data.value, helper.merge(value, localStorage.getItem(key)));
      var query;
      if (current.data) {
        if (!current.data.updated_at) throw new Error("Cloud price-history revision is missing. Refresh before saving.");
        query = supabase.from("collection_kv").update({value:merged}).eq("key",key).eq("updated_at",current.data.updated_at);
      } else query = supabase.from("collection_kv").insert({key:key,value:merged});
      var saved = await query.select("value, updated_at").maybeSingle();
      if (saved.error && saved.error.code !== "23505") throw new Error(saved.error.message || "Could not save price history.");
      if (!saved.error && saved.data) {
        var cached = helper.merge(saved.data.value, localStorage.getItem(key));
        localStorage.setItem(key,JSON.stringify(cached));
        delete window.storageSyncIssues[key];
        window.dispatchEvent(new CustomEvent("price-history-saved",{detail:{key:key}}));
        return {cloudSaved:true,value:JSON.stringify(cached)};
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
      if (key === "tb-price-history-v1") return await writePriceHistory(value);
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
    async get(key) {
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
      if (key === "tb-card-media-v1") value = window.TrackerMedia.normalizePublicMedia(value);
      if (key === "tb-price-history-v1") value = window.PriceHistoryUtils.merge(localStorage.getItem(key),value);
      if (typeof value !== "string") value = JSON.stringify(value);

      var localSaved = true;
      var localError = "";
      try { localStorage.setItem(key, value); }
      catch (e) { localSaved = false; localError = e.message; console.error("[storage] localStorage set failed:", key, e); }

      // Cloud keys: also persist to Supabase (awaited for restore reliability)
      var cloudResult = { cloudSaved: false, localOnly: true };
      if (key === "tb-price-history-v1") {
        var pendingPrice = priceHistoryWrite.then(function(){return writeToCloud(key,value);});
        priceHistoryWrite = pendingPrice;
        cloudResult = await pendingPrice;
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
      try { localStorage.removeItem(key); } catch (e) {}
      if (isCloudKey(key)) deleteFromCloud(key);
      return { key: key, deleted: true, shared: false };
    },

    async list(prefix) {
      var keys = [];
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (!prefix || k.startsWith(prefix)) keys.push(k);
        }
      } catch (e) {}
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
        else if (options.filter === "added") query = query.in("impact_kind",["added_owned","added_transit","qty_up","qty_set","count_added"]);
        else if (options.filter === "removed") query = query.in("impact_kind",["removed","owned_to_transit","location_left_hand","qty_down","count_removed"]);
        else if (options.filter === "to_transit") query = query.in("impact_kind",["owned_to_transit","location_left_hand"]);
        else if (options.filter === "qty") query = query.in("impact_kind",["qty_up","qty_down","qty_set","count_added","count_removed"]);
        else if (options.filter === "pending") query = query.or("evidence_level.eq.pending,evidence_level.eq.snapshot_only");
        else if (options.filter === "comc") query = query.or("evidence_level.eq.comc_source_matched,source_ref.ilike.%comc.com%");
        else if (options.filter === "backend_impact") query = query.in("actor",["Backend","Backfill","Snapshot"]).not("impact_kind","is",null);
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

  // ── Boot sequence ──
  initSupabase();

  window.storageReady = (async function () {
    if (supabase) {
      await window.trackerAuth.checkSession();
      await hydrateFromCloud();
    }
    console.log("[storage] Ready. Owner:", isOwner, "| Cloud:", !!supabase, "| Hydrated:", hydrated, "| Mode:", window.MODE);
  })();

})();
