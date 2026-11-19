const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Run the production hook body, with only its async completion exposed to the
// harness. This catches scope/cleanup regressions without a parallel loader.
const source = fs.readFileSync(path.join(__dirname, '../tracker.jsx'), 'utf8');
const marker = '  useEffect(() => {\n    let active=true;\n    async function load() {';
const start = source.indexOf(marker);
assert.notEqual(start, -1, 'find the consolidated collection load effect');
const bodyStart = start + '  useEffect(() => {'.length;
const end = source.indexOf('\n  }, []);', bodyStart);
assert.notEqual(end, -1, 'find the load effect boundary');
const effectBody = source.slice(bodyStart, end).replace('    load();', '    globalThis.loadPromise = load();');
assert.match(effectBody, /globalThis\.loadPromise = load\(\)/);

const plain = value => JSON.parse(JSON.stringify(value));
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const drain = () => new Promise(resolve => setImmediate(resolve));
const encoded = value => ({ value: JSON.stringify(value) });
const prefix = mode => mode === 'wnba' ? 'tempo' : mode === 'tb' ? 'tb' : 'collect-' + mode;
function snapshot(label) {
  return {
    cards: { 'tcdb:101': { id: 'tcdb:101', subject: label, year: '2026', sources: [{ type: 'tcdb', id: 101 }] } },
    imports: [{ id: 'import-' + label, evidence: { sourceItemId: 'receipt-' + label, raw: 'original text' } }],
    statuses: { 'tcdb:101': 'owned', 'tcdb:102': 'in_transit' },
    details: { 'tcdb:101': { qty: '3', notes: label, serial: '1/1' }, 'tcdb:102': { qty: '1', inTransit: '1' } },
    forsale: { 'tcdb:101': true }, synced: ['tcdb:101'], dirty: ['tcdb:102'],
    checkpoint: { at: '2026-11-19', source: label },
    changelog: [{ type: 'receipt', sourceId: 'receipt-' + label }],
    unknownFutureField: { nested: [1, { preserve: label }] },
    _expectedCollectionVersion: 'version-' + label,
    _migrationComplete: true
  };
}
function environment(get) {
  const begins = [], reads = [];
  const window = {
    MODE: 'racing',
    trackerAuth: { userId: () => 'owner-one' },
    CollectionProfile: { prefix },
    storageReady: Promise.resolve(),
    storage: { get: async key => { reads.push(key); return get(key); }, set: async () => { throw new Error('Loading must not save this collection'); } },
    trackerCollections: { forMode: mode => ({ begin: value => begins.push({ mode, value: plain(value) }) }) }
  };
  return { window, begins, reads };
}
function mount(env, mode) {
  const states = {}, catalogs = [];
  const context = {
    window: env.window,
    trackerMode: mode,
    sportMode: !['tb', 'wnba'].includes(mode),
    localStorage: { getItem: () => null },
    console, setTimeout,
    activateCollectionCatalog: (scope, value) => catalogs.push({ scope, value: plain(value) }),
    loadPriceHistory: () => ({}), loadEbayBlocked: () => ({}),
    PRICE_HISTORY: null, EBAY_BLOCKED: null,
    // These deliberate collisions must never seed a non-TB collection.
    PRESET_OWNED: ['seed-owned'], PRESET_INTRANSIT: ['seed-transit'],
    PRESET_DETAILS: { 'tcdb:101': { n: 'foreign TB note' } },
    DUPE_QTY_INIT: { 'tcdb:101': 9 },
    sessionInitial: { current: null }, allDataRef: { current: null },
    loadComplete: { current: false }, loadedModeRef: { current: null }
  };
  for (const name of ['ForSaleFlags', 'Statuses', 'CardDetails', 'SyncedIds', 'DirtyIds', 'LastCheckpoint', 'Changelog', 'TcdbFixes', 'TcdbFlags', 'Loading', 'StorageDiag']) {
    context['set' + name] = value => { states[name] = value; };
  }
  vm.createContext(context);
  const cleanup = vm.runInContext('(function(){' + effectBody + '\n})()', context);
  return { context, states, catalogs, cleanup, finished: context.loadPromise };
}

test('sport load begins with the complete authoritative snapshot, including catalogue and import evidence', async () => {
  const data = snapshot('current');
  const env = environment(key => key.endsWith('alldata-v1') ? encoded(data) : encoded({}));
  const loaded = mount(env, 'racing');
  await loaded.finished;

  assert.deepEqual(env.begins, [{ mode: 'racing', value: data }]);
  assert.deepEqual(plain(loaded.context.allDataRef.current), data);
  assert.deepEqual(plain(loaded.states.CardDetails), data.details);
  assert.deepEqual(plain(loaded.states.Statuses), data.statuses);
  assert.deepEqual(loaded.catalogs, [{ scope: 'racing', value: data }]);
  assert.deepEqual(env.reads, ['collect-racing-alldata-v1', 'collect-racing-tcdb-fixes-v1', 'collect-racing-tcdb-flags-v1']);
  assert.equal(loaded.context.loadedModeRef.current, 'racing');
  assert.equal(loaded.context.loadComplete.current, true);
});

test('a delayed, unmounted A load cannot replace the new A snapshot after A to B to A navigation', async () => {
  const oldA = snapshot('old-racing'), newA = snapshot('new-racing'), b = snapshot('tempo');
  const pausedFixes = deferred();
  let racingReads = 0, fixesReads = 0;
  const env = environment(key => {
    if (key === 'collect-racing-alldata-v1') return encoded(++racingReads === 1 ? oldA : newA);
    if (key === 'tempo-alldata-v1') return encoded(b);
    if (key === 'collect-racing-tcdb-fixes-v1' && ++fixesReads === 1) return pausedFixes.promise;
    return encoded({});
  });
  const stale = mount(env, 'racing');
  await drain();
  assert.equal(fixesReads, 1, 'old A is paused after its authoritative data read');
  stale.cleanup();

  env.window.MODE = 'wnba';
  const middle = mount(env, 'wnba');
  await middle.finished;
  middle.cleanup();
  env.window.MODE = 'racing';
  const current = mount(env, 'racing');
  await current.finished;

  // MODE and owner are again identical to old A. Cleanup, rather than mode
  // equality alone, must prevent its final begin from resetting current edits.
  pausedFixes.resolve(encoded({ old: true }));
  await stale.finished;
  assert.deepEqual(env.begins, [{ mode: 'wnba', value: b }, { mode: 'racing', value: newA }]);
  assert.equal(stale.context.allDataRef.current, null);
  assert.equal(stale.context.loadComplete.current, false);
  assert.equal(stale.context.loadedModeRef.current, null);
  assert.deepEqual(plain(current.context.allDataRef.current), newA);
  assert.equal(current.context.loadedModeRef.current, 'racing');
});

test('an owner change during auxiliary loading cannot enable saves or begin any collection', async () => {
  const pausedFixes = deferred();
  const env = environment(key => key.endsWith('alldata-v1') ? encoded(snapshot('owner-one')) : key.endsWith('tcdb-fixes-v1') ? pausedFixes.promise : encoded({}));
  const loaded = mount(env, 'racing');
  await drain();
  env.window.trackerAuth.userId = () => 'owner-two';
  pausedFixes.resolve(encoded({}));
  await loaded.finished;
  assert.deepEqual(env.begins, []);
  assert.equal(loaded.context.allDataRef.current, null);
  assert.equal(loaded.context.loadComplete.current, false);
});

test('cleanup before storage readiness prevents all collection reads', async () => {
  const ready = deferred();
  const env = environment(() => encoded(snapshot('unused')));
  env.window.storageReady = ready.promise;
  const loaded = mount(env, 'racing');
  loaded.cleanup();
  ready.resolve();
  await loaded.finished;
  assert.deepEqual(env.reads, []);
  assert.deepEqual(env.begins, []);
});
