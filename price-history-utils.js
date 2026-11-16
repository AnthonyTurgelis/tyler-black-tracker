/* Mergeable price evidence. Explicit removals stay removed when a stale tab saves. */
(function(root) {
  "use strict";
  var META = "__historyMeta";
  function decode(value) {
    if (typeof value === "string") value = JSON.parse(value);
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }
  function copy(value) { return value === undefined ? undefined : JSON.parse(JSON.stringify(value)); }
  function identity(entry) {
    if (entry.observationKey) return String(entry.observationKey);
    return "legacy:" + JSON.stringify([entry.date || entry.observedAt || "", entry.source || "", entry.itemId || entry.itemUrl || "", entry.price,
      entry.currency || "", entry.kind || entry.type || "", entry.priceBasis || "", entry.condition || "", entry.grading || "",
      (entry.titles || []).map(String).sort()]);
  }
  function stamp(entry) { return Date.parse(entry.updatedAt || entry.lastSeenAt || entry.observedAt || entry.date || "") || 0; }
  function combineEntry(a, b) {
    var newer = stamp(b) >= stamp(a) ? b : a, older = newer === a ? b : a, result = copy(older);
    Object.keys(newer).forEach(function(key) { if (newer[key] != null && newer[key] !== "" || result[key] == null) result[key] = copy(newer[key]); });
    ["titles", "notes"].forEach(function(key) { if (Array.isArray(a[key]) || Array.isArray(b[key])) result[key] = Array.from(new Set([].concat(a[key] || [], b[key] || []))); });
    return result;
  }
  function eventMap(value) { return decode(value)[META] && decode(value)[META].events || {}; }
  function merge(left, right) {
    var a = decode(left), b = decode(right), events = Object.create(null), result = Object.create(null);
    [a,b].forEach(function(history) {
      Object.entries(eventMap(history)).forEach(function(pair) {
        var cardKey = pair[0]; if (!events[cardKey]) events[cardKey] = Object.create(null);
        Object.entries(pair[1] || {}).forEach(function(record) {
          var old = events[cardKey][record[0]], next = record[1];
          if (next && (!old || (Date.parse(next.updatedAt) || 0) >= (Date.parse(old.updatedAt) || 0))) events[cardKey][record[0]] = copy(next);
        });
      });
    });
    new Set(Object.keys(a).concat(Object.keys(b))).forEach(function(cardKey) {
      if (cardKey === META) return;
      var rows = new Map();
      [a[cardKey],b[cardKey]].forEach(function(entries) {
        (Array.isArray(entries) ? entries : []).forEach(function(entry) {
          if (!entry || typeof entry !== "object") return;
          var id = identity(entry), previous = rows.get(id);
          rows.set(id, previous ? combineEntry(previous,entry) : copy(entry));
        });
      });
      var entries = Array.from(rows).filter(function(pair) { var event = events[cardKey] && events[cardKey][pair[0]]; return !event || event.deleted !== true; }).map(function(pair) { return pair[1]; });
      if (entries.length) result[cardKey] = entries;
    });
    if (Object.keys(events).length) result[META] = {version:1,events:events};
    return result;
  }
  function visible(value) {
    var full = merge(value, null), result = {};
    Object.keys(full).forEach(function(key) { if (key !== META && Array.isArray(full[key])) result[key] = full[key]; });
    return result;
  }
  function applyChanges(value, removals, restores, now) {
    var result = merge(value,null), meta = result[META] || {version:1,events:{}};
    function mark(changes, deleted) {
      (changes || []).forEach(function(change) {
        if (!change.cardKey) return;
        var events = meta.events[change.cardKey] || (meta.events[change.cardKey] = {});
        (change.entries || []).forEach(function(entry) {
          var id = identity(entry), old = events[id];
          var at = new Date(Math.max(Date.parse(now) || Date.now(), (Date.parse(old && old.updatedAt) || 0) + 1)).toISOString();
          events[id] = {deleted:deleted,updatedAt:at};
          if (!deleted) { if (!result[change.cardKey]) result[change.cardKey] = []; result[change.cardKey].push(copy(entry)); }
        });
      });
    }
    mark(removals,true); mark(restores,false);
    if (Object.keys(meta.events).length) result[META] = meta;
    return merge(result,null);
  }
  var api = {META:META,identity:identity,merge:merge,visible:visible,applyChanges:applyChanges};
  if (root) root.PriceHistoryUtils = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : null);
