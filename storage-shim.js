/**
 * Storage Shim for Tyler Black Tracker — Supabase Edition
 *
 * PRIMARY:  Supabase (cloud database — survives cache clears, works cross-device)
 * CACHE:    localStorage (fast reads, offline fallback)
 *
 * Flow:
 *   STARTUP: Supabase hydrates localStorage cache, then tracker loads from cache
 *   SAVE:    Supabase (async) + localStorage (sync) simultaneously
 *   READ:    localStorage cache first (instant), cloud is source of truth
 *
 * Auth:
 *   Visitors: read-only from Supabase (RLS allows SELECT for anon)
 *   Owner:    read-write after Supabase Auth login
 *
 * Must be loaded AFTER supabase-js CDN and BEFORE tracker.jsx.
 */
(function () {
  // ── Config (set in index.html before this script loads) ──
  var SUPABASE_URL = window.SUPABASE_URL || "";
  var SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "";

  // Keys that sync to Supabase (critical collection data)
  var CLOUD_KEYS = [
    "tb-alldata-v1",
    "tb-targets-v1",
    "tb-price-history-v1",
    "tb-tcdb-fixes-v1",
    "tb-tcdb-flags-v1",
    "tb-ebay-blocked-v1",
    "tb-ebay-bids-v1",
    "tb-comc-overrides-v1",
    "tb-custom-cards-v1"
  ];

  function isCloudKey(key) {
    return CLOUD_KEYS.indexOf(key) !== -1;
  }

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
        return { success: true };
      } catch (e) {
        return { error: e.message };
      }
    },

    logout: async function () {
      if (!supabase) return;
      await supabase.auth.signOut();
      isOwner = false;
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
            var result = await supabase.from("collection_kv").upsert(
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
  async function hydrateFromCloud() {
    if (!supabase || hydrated) return;
    try {
      var result = await supabase.from("collection_kv").select("key, value, updated_at");
      if (result.error) {
        console.error("[storage] Hydration failed:", result.error.message);
        return;
      }
      var rows = result.data || [];
      console.log("[storage] Hydrating " + rows.length + " keys from cloud");
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        try {
          var cloudVal = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
          // For alldata key, compare timestamps — don't overwrite newer local data
          if (row.key === "tb-alldata-v1") {
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
    try {
      var jsonVal;
      try { jsonVal = typeof value === "string" ? JSON.parse(value) : value; }
      catch (e) { jsonVal = value; }

      var result = await supabase.from("collection_kv").upsert(
        { key: key, value: jsonVal },
        { onConflict: "key" }
      );
      if (result.error) {
        console.error("[storage] Cloud write failed:", key, result.error.message);
        // One retry after 2s
        setTimeout(async function () {
          try {
            await supabase.from("collection_kv").upsert(
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
      await supabase.from("collection_kv").delete().eq("key", key);
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
          var r = await supabase.from("collection_kv")
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

      // Cloud keys: also persist to Supabase (fire-and-forget)
      if (isCloudKey(key)) writeToCloud(key, value);

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
    console.log("[storage] Ready. Owner:", isOwner, "| Cloud:", !!supabase, "| Hydrated:", hydrated);
  })();

})();
