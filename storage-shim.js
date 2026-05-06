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
  var hydrated = false;

  function initSupabase() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn("[storage] No Supabase config — localStorage only mode");
      return;
    }
    if (window.supabase && window.supabase.createClient) {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log("[storage] Supabase client ready");
    } else {
      console.warn("[storage] supabase-js not loaded — localStorage only mode");
    }
  }

  // ── Auth (exposed globally for the tracker UI) ──
  window.trackerAuth = {
    isOwner: function () { return isOwner; },

    login: async function (email, password) {
      if (!supabase) return { error: "Supabase not configured" };
      try {
        var result = await supabase.auth.signInWithPassword({ email: email, password: password });
        if (result.error) return { error: result.error.message };
        isOwner = true;
        console.log("[storage] Owner logged in");
        window.dispatchEvent(new CustomEvent("authchange", { detail: { isOwner: true } })); // + TEMPO
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
      await supabase.auth.signOut();
      isOwner = false;
      // If we were in WNBA mode, force back to TB on logout            // + TEMPO
      if (window.MODE === "wnba") {                                     // + TEMPO
        window.MODE = "tb";                                              // + TEMPO
        window.dispatchEvent(new CustomEvent("modechange", { detail: { mode: "tb" } })); // + TEMPO
      }                                                                  // + TEMPO
      window.dispatchEvent(new CustomEvent("authchange", { detail: { isOwner: false } })); // + TEMPO
      console.log("[storage] Logged out");
    },

    checkSession: async function () {
      if (!supabase) return false;
      try {
        var result = await supabase.auth.getSession();
        if (result.data && result.data.session) {
          isOwner = true;
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
            var jsonVal;
            try { jsonVal = JSON.parse(val); } catch (e) { jsonVal = val; }
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

  // ── Cloud write (async, with one retry) ──
  async function writeToCloud(key, value) {
    if (!supabase || !isOwner) return;
    var table = tableForKey(key);                                       // + TEMPO
    try {
      var jsonVal;
      try { jsonVal = typeof value === "string" ? JSON.parse(value) : value; }
      catch (e) { jsonVal = value; }

      var result = await supabase.from(table).upsert(                  // + TEMPO routed (was "collection_kv")
        { key: key, value: jsonVal },
        { onConflict: "key" }
      );
      if (result.error) {
        console.error("[storage] Cloud write failed:", key, result.error.message);
        // One retry after 2s
        setTimeout(async function () {
          try {
            await supabase.from(table).upsert(                          // + TEMPO routed (was "collection_kv")
              { key: key, value: jsonVal },
              { onConflict: "key" }
            );
            console.log("[storage] Retry OK:", key);
          } catch (e2) {
            console.error("[storage] Retry failed:", key);
          }
        }, 2000);
      }
    } catch (e) {
      console.error("[storage] Cloud write error:", key, e);
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
      if (typeof value !== "string") value = JSON.stringify(value);

      // ALWAYS write localStorage (sync, instant, never lost)
      try { localStorage.setItem(key, value); }
      catch (e) { console.error("[storage] localStorage set failed:", key, e); }

      // Cloud keys: also persist to Supabase (awaited for restore reliability)
      if (isCloudKey(key)) await writeToCloud(key, value);

      return { key: key, value: value, shared: false };
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
