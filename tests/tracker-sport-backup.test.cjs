const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const profiles = require('../collection-profile.js');
const source = fs.readFileSync(path.join(__dirname, '../tracker.jsx'), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));
function extract(from, to) {
  const start = source.indexOf(from), end = source.indexOf(to, start + from.length);
  assert(start >= 0 && end > start, 'find actual backup function');
  return source.slice(start, end);
}
const definitions = [
  extract('  function generateStateJson() {', '\n  async function saveCheckpoint()'),
  extract('  function restoreFromJson(file) {', '\n  function restoreSecondaryData(file)'),
  extract('  function restoreSecondaryData(file) {', '\n  function copyRawData()')
].join('\n');
function deferred() {
  let resolve; const promise = new Promise(yes => { resolve = yes; }); return { promise, resolve };
}
function snapshot() {
  return {
    cards: { 'tcdb:1': { id: 'tcdb:1', subject: 'Current driver', rawField: { preserve: true } } },
    statuses: { 'tcdb:1': 'owned' },
    details: { 'tcdb:1': { qty: '3', notes: 'Current owner notes', custom: [1, 2] } },
    forsale: { 'tcdb:1': true }, imports: [{ source: 'original purchase', id: 'receipt-1' }],
    changelog: [{ field: 'previous', source: 'manual edit' }],
    unknownField: { copyReferences: ['copy-1', 'copy-2', 'copy-3'] }
  };
}
function harness(initial = snapshot()) {
  const readers = [], messages = [], calls = [], writes = [];
  let pending = false, reader = async () => plain(initial);
  const api = {
    hasPending: () => pending,
    read: () => { calls.push({ method: 'read' }); return reader(); },
    begin: value => calls.push({ method: 'begin', value: plain(value) }),
    stage: value => calls.push({ method: 'stage', value: plain(value) }),
    sync: async () => { calls.push({ method: 'sync' }); return { cloudSaved: true }; }
  };
  const context = {
    window: { MODE: 'racing', trackerAuth: { userId: () => 'owner-1', isOwner: () => true }, CollectionProfile: profiles,
      trackerCollections: { forMode: mode => { assert.equal(mode, 'racing'); return api; } },
      storage: { set: async (...args) => { writes.push(args); return { cloudSaved: true }; } } },
    allDataRef: { current: plain(initial) },
    FileReader: class { constructor() { readers.push(this); } readAsText(file) { this.file = file; } },
    isSportMode: mode => profiles.isSport(mode || context.window.MODE),
    setExportMsg: value => messages.push(value),
    localStorage: { setItem: (...args) => writes.push(args), getItem: () => null },
    setTimeout: () => 0, alert: () => {},
    loadPriceHistory: () => ({}), loadEbayBlocked: () => ({}),
    PRICE_HISTORY: {}, EBAY_BLOCKED: {}, COMC_OVERRIDES: {}
  };
  vm.createContext(context);
  vm.runInContext(definitions, context);
  const choose = data => { context.restoreFromJson({ name: 'backup.json' }); return () => readers.at(-1).onload({ target: { result: JSON.stringify(data) } }); };
  return { context, api, calls, writes, messages, readers, choose,
    setPending: value => { pending = value; }, setRead: value => { reader = value; } };
}
const backup = cards => ({ collectionScope: 'racing', collectionState: { cards, statuses: { 'tcdb:1': 'not_owned', 'tcdb:2': 'in_transit' }, details: { 'tcdb:1': { qty: '99' }, 'tcdb:2': { qty: '1', source: 'backup' } }, forsale: { 'tcdb:1': false, 'tcdb:2': false }, imports: [{ id: 'foreign-backup-import' }] } });
const missingCard = { id: 'tcdb:2', subject: 'Missing driver', rawField: { original: 'kept verbatim' } };

test('sport JSON export retains the complete source state and explicit collection scope', () => {
  const h = harness(), exported = JSON.parse(h.context.generateStateJson());
  assert.equal(exported.version, 'v3');
  assert.equal(exported.collectionScope, 'racing');
  assert.deepEqual(exported.collectionState, snapshot());
});

test('sport restore adds only missing IDs and preserves current catalogue, raw fields, quantities, imports and copy references', async () => {
  const current = snapshot(), h = harness(current);
  await h.choose(backup({ 'tcdb:1': { id: 'tcdb:1', subject: 'Wrong old driver' }, 'tcdb:2': missingCard }))();
  const staged = h.calls.find(call => call.method === 'stage').value;
  assert.deepEqual(staged.cards['tcdb:1'], current.cards['tcdb:1']);
  assert.deepEqual(staged.details['tcdb:1'], current.details['tcdb:1']);
  assert.equal(staged.statuses['tcdb:1'], 'owned');
  assert.equal(staged.forsale['tcdb:1'], true);
  assert.deepEqual(staged.cards['tcdb:2'], missingCard);
  assert.deepEqual(staged.details['tcdb:2'], { qty: '1', source: 'backup' });
  assert.equal(staged.statuses['tcdb:2'], 'in_transit');
  assert.deepEqual(staged.imports, current.imports);
  assert.deepEqual(staged.unknownField, current.unknownField);
  assert.deepEqual(staged.changelog.slice(1), current.changelog);
  assert.deepEqual(h.calls.map(call => call.method), ['read', 'begin', 'stage', 'sync']);
  assert.deepEqual(h.writes, [], 'restore never writes or replaces private copy/receipt stores');
});

test('an already-present backup is a no-op even when its ownership differs', async () => {
  const h = harness();
  await h.choose(backup({ 'tcdb:1': { id: 'tcdb:1', subject: 'Old name' } }))();
  assert.deepEqual(h.calls.map(call => call.method), ['read']);
  assert.match(h.messages.at(-1), /already exist/);
});

test('another sport or an unscoped backup cannot begin a restore', async () => {
  for (const scope of ['hockey', undefined]) {
    const h = harness(), data = backup({ 'tcdb:2': missingCard });
    data.collectionScope = scope;
    await h.choose(data)();
    assert.deepEqual(h.calls, []);
    assert.match(h.messages.at(-1), /another collection|full backup/);
  }
});

test('a mode or owner change while the file is read cannot begin a restore', async () => {
  for (const change of [h => { h.context.window.MODE = 'hockey'; }, h => { h.context.window.trackerAuth.userId = () => 'owner-2'; }]) {
    const h = harness(), finish = h.choose(backup({ 'tcdb:2': missingCard }));
    change(h); await finish();
    assert.deepEqual(h.calls, []);
    assert.match(h.messages.at(-1), /changed/);
  }
});

test('a mode or owner change during the cloud read cannot stage a restore', async () => {
  for (const change of [h => { h.context.window.MODE = 'hockey'; }, h => { h.context.window.trackerAuth.userId = () => 'owner-2'; }]) {
    const h = harness(), wait = deferred(); h.setRead(() => wait.promise);
    const finished = h.choose(backup({ 'tcdb:2': missingCard }))();
    change(h); wait.resolve(snapshot()); await finished;
    assert.deepEqual(h.calls.map(call => call.method), ['read']);
    assert.match(h.messages.at(-1), /changed/);
  }
});

test('a pending edit created during the cloud read prevents restore from rebasing over it', async () => {
  const h = harness(), wait = deferred(); h.setRead(() => wait.promise);
  const finished = h.choose(backup({ 'tcdb:2': missingCard }))();
  h.setPending(true); wait.resolve(snapshot()); await finished;
  assert.deepEqual(h.calls.map(call => call.method), ['read']);
});

test('restore rejects an array catalogue instead of saving array indices as card IDs', async () => {
  const h = harness();
  await h.choose(backup([missingCard]))();
  assert(!h.calls.some(call => call.method === 'stage'));
  assert.match(h.messages.at(-1), /backup|catalog|record/i);
});

test('adding a missing catalogue card preserves any already-existing ownership fields for that ID', async () => {
  const current = snapshot();
  current.statuses['tcdb:2'] = 'owned';
  current.details['tcdb:2'] = { qty: '4', notes: 'Existing owner record' };
  current.forsale['tcdb:2'] = true;
  const h = harness(current);
  await h.choose(backup({ 'tcdb:2': missingCard }))();
  const staged = h.calls.find(call => call.method === 'stage').value;
  for (const field of ['statuses', 'details', 'forsale']) assert.deepEqual(staged[field]['tcdb:2'], current[field]['tcdb:2']);
});

test('secondary restore is unavailable outside Tyler Black', () => {
  for (const mode of ['wnba', 'racing', 'other']) {
    const h = harness(); h.context.window.MODE = mode;
    h.context.restoreSecondaryData({ name: 'backup.json' });
    assert.equal(h.readers.length, 0);
    assert.deepEqual(h.writes, []);
    assert.match(h.messages.at(-1), /Tyler Black-only/);
  }
});

test('secondary restore stops if the mode or owner changes while its file is being read', async () => {
  for (const change of [h => { h.context.window.MODE = 'racing'; }, h => { h.context.window.trackerAuth.userId = () => 'owner-2'; }]) {
    const h = harness(); h.context.window.MODE = 'tb';
    h.context.restoreSecondaryData({ name: 'secondary.json' });
    change(h);
    await h.readers[0].onload({ target: { result: JSON.stringify({ 'tb-price-history-v1': { old: [{ price: 1, currency: 'USD' }] } }) } });
    assert.deepEqual(h.writes, []);
  }
});

test('secondary restore stops between cloud writes if the account changes', async () => {
  const h = harness(), wait = deferred(); h.context.window.MODE = 'tb';
  h.context.window.storage.set = async (...args) => { h.writes.push(args); return wait.promise; };
  h.context.restoreSecondaryData({ name: 'secondary.json' });
  const finished = h.readers[0].onload({ target: { result: JSON.stringify({ 'tb-price-history-v1': { first: [1] }, 'tb-targets-v1': { second: 2 } }) } });
  h.context.window.trackerAuth.userId = () => 'owner-2';
  wait.resolve({ cloudSaved: true });
  await finished;
  assert.deepEqual(h.writes.map(write => write[0]), ['tb-price-history-v1', 'tb-price-history-v1']);
  assert.match(h.messages.at(-1), /changed/);
});
