const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { changes, apply, create } = require('../collection-sync.js');
const clone = structuredClone;
function initial() {
  return {
    cards: { 'tcdb:1': { id: 'tcdb:1', subject: 'Driver one', team: 'A' }, 'tcdb:2': { id: 'tcdb:2', subject: 'Driver two', team: 'B' } },
    statuses: { 'tcdb:1': 'in_transit', 'tcdb:2': 'owned' },
    details: { 'tcdb:1': { qty: '1', notes: 'Keep original note' }, 'tcdb:2': { qty: '3', serial: '12/25' } },
    forsale: { 'tcdb:2': true }, imports: { receipt: { source: 'COMC', itemId: 'receipt-1' } },
    dirty: ['tcdb:2'], synced: ['tcdb:1'], changelog: [], checkpoint: null
  };
}
function pin(state, id, value) {
  const next = clone(state);
  next.details[id] = { ...next.details[id], pinned: value };
  return next;
}
function assertStoredState(actual, expected) {
  const { _saveTimestamp, ...state } = actual;
  assert(Number.isFinite(_saveTimestamp), 'sync records its generated save timestamp');
  assert.deepEqual(state, expected);
}
function harness(base) {
  const entries = new Map(), seen = new Set();
  const storage = { get length() { return entries.size; }, key: i => [...entries.keys()][i],
    getItem: key => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value), removeItem: key => entries.delete(key) };
  const db = { value: clone(base), version: 1, writes: 0 };
  const read = async (keys = []) => ({ value: clone(db.value), updated_at: db.version, applied_keys: keys.filter(key => seen.has(key)) });
  function tab(id) {
    const sync = create({ storage, namespace: 'collect-racing', owner: () => 'owner', id, issue: () => {}, read,
      write: async (value, version) => {
        if (db.version !== version) return null;
        assert.equal(value._expectedCollectionVersion, version);
        assert(value._collectionEditKeys.every(key => key.startsWith('collect-racing:')));
        if (value._collectionEditKeys.some(key => seen.has(key))) return null;
        value._collectionEditKeys.forEach(key => seen.add(key));
        const next = clone(value); delete next._expectedCollectionVersion; delete next._collectionEditKeys;
        db.value = next; db.version++; db.writes++;
        return read();
      }
    });
    sync.begin(base); return sync;
  }
  return { tab, db, entries };
}

test('a pin emits only one details field edit, leaving ownership, TCDB sync and catalogue untouched', () => {
  const base = initial(), next = pin(base, 'tcdb:1', true);
  assert.deepEqual(changes(base, next), [{ path: ['details', 'tcdb:1', 'pinned'], before: undefined, after: true }]);
  const merged = apply(base, changes(base, next));
  assert.deepEqual(merged.conflicts, []);
  assert.deepEqual(merged.result, next);
  assert.deepEqual(base, initial(), 'diff and apply do not mutate the source state');
});

test('a pin merges with concurrent ownership, quantity and notes edits on the same card', () => {
  const base = initial(), current = clone(base);
  current.statuses['tcdb:1'] = 'owned';
  current.details['tcdb:1'] = { ...current.details['tcdb:1'], qty: '4', notes: 'New receipt plus owner edit', inTransit: '0' };
  current.imports.second = { itemId: 'receipt-2' };
  current.dirty.push('tcdb:1');
  const result = apply(current, changes(base, pin(base, 'tcdb:1', true)));
  assert.deepEqual(result.conflicts, []);
  assert.deepEqual(result.result, pin(current, 'tcdb:1', true));
});

test('two tabs pinning different cards both survive a concurrent CAS retry', async () => {
  const base = initial(), { tab, db, entries } = harness(base), a = tab('one'), b = tab('two');
  a.stage(pin(base, 'tcdb:1', true)); b.stage(pin(base, 'tcdb:2', true));
  await Promise.all([a.flush(), b.flush()]);
  assertStoredState(db.value, pin(pin(base, 'tcdb:1', true), 'tcdb:2', true));
  assert.equal(entries.size, 0);
  assert.equal(db.writes, 2);
});

test('opposed explicit pin choices from an unset baseline are held without overwriting the first choice', async () => {
  const base = initial(); base.details['tcdb:1'].pinned = null;
  const { tab, db, entries } = harness(base), a = tab('pin'), b = tab('unpin');
  a.stage(pin(base, 'tcdb:1', true)); b.stage(pin(base, 'tcdb:1', false));
  await a.flush();
  await assert.rejects(b.flush(), error => {
    assert.deepEqual(error.conflicts, [{ path: ['details', 'tcdb:1', 'pinned'], actual: true, desired: false }]);
    return true;
  });
  assertStoredState(db.value, pin(base, 'tcdb:1', true));
  assert.equal(db.writes, 1);
  assert.equal(b.hasPending(), true);
  assert.equal(entries.size, 1, 'opposed choice remains in the durable journal for review');
});

test('missing, null and false retain their raw before values; pinning and unpinning write booleans', () => {
  for (const previous of [undefined, null, false]) {
    const base = initial();
    if (previous !== undefined) base.details['tcdb:1'].pinned = previous;
    base.details['tcdb:2'].pinned = null;
    const ops = changes(base, pin(base, 'tcdb:1', true));
    assert.deepEqual(ops, [{ path: ['details', 'tcdb:1', 'pinned'], before: previous, after: true }]);
    const pinned = apply(base, ops);
    assert.deepEqual(pinned.conflicts, []);
    assert.equal(pinned.result.details['tcdb:1'].pinned, true);
    assert.equal(pinned.result.details['tcdb:2'].pinned, null, 'unrelated raw fields are never normalized');
    const unpinOps = changes(pinned.result, pin(pinned.result, 'tcdb:1', false));
    assert.deepEqual(unpinOps, [{ path: ['details', 'tcdb:1', 'pinned'], before: true, after: false }]);
    const unpinned = apply(pinned.result, unpinOps);
    assert.deepEqual(unpinned.conflicts, []);
    assert.equal(unpinned.result.details['tcdb:1'].pinned, false);
    assert(Object.hasOwn(unpinned.result.details['tcdb:1'], 'pinned'));
  }
});

test('replaying an already-applied pin is idempotent and keeps later ownership changes', () => {
  const base = initial(), ops = changes(base, pin(base, 'tcdb:1', true));
  const current = pin(base, 'tcdb:1', true);
  current.statuses['tcdb:1'] = 'owned'; current.details['tcdb:1'].qty = '2';
  const replay = apply(current, ops);
  assert.deepEqual(replay.conflicts, []);
  assert.deepEqual(replay.result, current);
});

const source = fs.readFileSync(path.join(__dirname, '../tracker.jsx'), 'utf8');
const vm = require('node:vm');
function pinUi(mode = 'racing', configure) {
  const match = source.match(/const togglePinnedCard = useCallback\(function\(cardId\) \{([\s\S]*?)\}, \[trackerMode,saveDetails,pushUndo,logChange\]\);/);
  assert(match, 'extract the actual pin callback');
  const base = initial(), saved = [], logs = [], undo = [];
  let details = clone(base.details), sessionChanges = 0;
  const context = {
    trackerMode: mode, window: { MODE: mode, trackerAuth: { isOwner: () => true } },
    loadComplete: { current: true }, loadedModeRef: { current: mode }, CARD_BY_ID: base.cards,
    useCallback: callback => callback,
    setSessionChanges: callback => { sessionChanges = callback(sessionChanges); },
    setCardDetails: callback => { details = callback(details); },
    saveDetails: value => saved.push(JSON.parse(JSON.stringify(value))),
    pushUndo: value => undo.push(JSON.parse(JSON.stringify(value))),
    logChange: (...args) => logs.push(args),
    setStatuses: () => { throw Error('Pinning must not update ownership'); },
    saveStatuses: () => { throw Error('Pinning must not save ownership'); },
    setDirtyIds: () => { throw Error('Pinning must not mark TCDB dirty'); },
    persistField: field => { throw Error('Unexpected pin write: ' + field); }
  };
  if (configure) configure(context);
  vm.createContext(context);
  vm.runInContext(match[0] + '\nglobalThis.toggle = togglePinnedCard;', context);
  return { context, saved, logs, undo, base, details: () => JSON.parse(JSON.stringify(details)), sessionChanges: () => sessionChanges };
}

test('the actual pin callback works for every non-TB mode without changing ownership, quantities or TCDB flags', () => {
  for (const mode of ['wnba', 'racing', 'baseball', 'basketball', 'football', 'hockey', 'soccer', 'other']) {
    const ui = pinUi(mode);
    assert.equal(ui.context.toggle('tcdb:1'), true);
    assert.deepEqual(ui.details(), pin(ui.base, 'tcdb:1', true).details);
    assert.equal(ui.context.toggle('tcdb:1'), true);
    assert.deepEqual(ui.details(), pin(ui.base, 'tcdb:1', false).details);
    assert.deepEqual(ui.saved.map(value => value['tcdb:1'].pinned), [true, false]);
    assert.deepEqual(ui.undo.map(value => value.prev), [false, true]);
    assert(ui.undo.every(value => value.type === 'detail' && value.field === 'pinned'));
    assert(ui.logs.every(value => value[1] === 'collection_focus' && value[2] === 'pinned'));
    assert.equal(ui.sessionChanges(), 2);
  }
});

test('the actual pin callback refuses TB, signed-out, unloaded, stale-mode and unknown-card writes', () => {
  const scenarios = [
    ['tb', () => {}],
    ['racing', context => { context.window.trackerAuth.isOwner = () => false; }],
    ['racing', context => { context.loadComplete.current = false; }],
    ['racing', context => { context.loadedModeRef.current = 'wnba'; }],
    ['racing', context => { context.window.MODE = 'tb'; }],
    ['racing', context => { context.CARD_BY_ID = {}; }]
  ];
  for (const [mode, configure] of scenarios) {
    const ui = pinUi(mode, configure);
    assert.equal(ui.context.toggle('tcdb:1'), false);
    assert.deepEqual(ui.saved, []); assert.deepEqual(ui.undo, []); assert.deepEqual(ui.logs, []);
    assert.equal(ui.sessionChanges(), 0);
    assert.deepEqual(ui.details(), ui.base.details);
  }
});

test('the actual detail undo preserves an explicit false pin and all other card fields', () => {
  const ui = pinUi();
  ui.context.toggle('tcdb:1');
  const undoMatch = source.match(/const undoLast = useCallback\(\(\) => \{([\s\S]*?)\}, \[saveStatuses, saveDetails, persistField\]\);/);
  assert(undoMatch, 'extract actual undo callback');
  ui.context.undoStack = { current: ui.undo };
  ui.context.setUndoLen = () => {};
  ui.context.setChangelog = callback => callback([]);
  vm.runInContext(undoMatch[0] + '\nglobalThis.undoPin = undoLast;', ui.context);
  ui.context.undoPin();
  assert.equal(ui.details()['tcdb:1'].pinned, false);
  assert(Object.hasOwn(ui.details()['tcdb:1'], 'pinned'));
  assert.deepEqual(ui.details(), pin(ui.base, 'tcdb:1', false).details);
  assert.equal(ui.sessionChanges(), 0);
});
