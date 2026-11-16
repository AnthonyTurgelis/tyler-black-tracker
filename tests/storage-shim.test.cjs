const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'storage-shim.js'), 'utf8');
const CUSTOM = 'tb-custom-cards-v1';
const META = 'tb-catalog-meta-v1';
const clone = value => JSON.parse(JSON.stringify(value));
const card = (id, variant, updatedAt) => ({
  ...(id == null ? {} : { id }), product: '2024 Leaf Baseball', cardNumber: 'PP-1',
  cardSet: variant, copies: '1', ...(updatedAt == null ? {} : { updatedAt })
});

async function boot({ local = {}, cloud = {}, owner = true } = {}) {
  const cache = new Map(Object.entries(local).map(([key, value]) => [key, JSON.stringify(value)]));
  const database = { collection_kv: clone(cloud), tempo_collection_kv: {} };
  const calls = { writes: [], timers: [], events: [], failWrite: null, failRead: null, beforeWrite: null };
  const localStorage = {
    get length() { return cache.size; },
    key: index => [...cache.keys()][index],
    getItem: key => cache.has(key) ? cache.get(key) : null,
    setItem: (key, value) => cache.set(key, String(value)),
    removeItem: key => cache.delete(key)
  };
  const client = {
    auth: {
      getSession: async () => ({ data: { session: owner ? { user: { id: 'test-owner' } } : null } }),
      signInWithPassword: async () => ({ data: { session: {} }, error: null }),
      signOut: async () => ({ error: null })
    },
    from(table) {
      const query = {
        selectedKey: null,
        select() { return this; },
        eq(column, value) { assert.equal(column, 'key'); this.selectedKey = value; return this; },
        then(resolve, reject) {
          return Promise.resolve({ data: Object.entries(database[table]).map(([key, value]) => ({ key, value: clone(value) })), error: null }).then(resolve, reject);
        },
        async maybeSingle() {
          if (calls.failRead) return { data: null, error: { message: calls.failRead } };
          const value = database[table][this.selectedKey];
          return { data: value === undefined ? null : { value: clone(value) }, error: null };
        },
        async single() { return this.maybeSingle(); },
        async upsert(row, options) {
          assert.equal(options.onConflict, 'key');
          calls.writes.push(clone(row));
          if (calls.beforeWrite) await calls.beforeWrite(row);
          if (calls.failWrite) return { error: { message: calls.failWrite } };
          database[table][row.key] = clone(row.value);
          return { error: null };
        }
      };
      return query;
    }
  };
  const window = {
    TrackerMedia: require('../media-utils.js'),
    PriceHistoryUtils: require('../price-history-utils.js'),
    SUPABASE_URL: 'https://example.invalid', SUPABASE_ANON_KEY: 'test-publishable-key',
    supabase: { createClient: () => client },
    dispatchEvent: event => calls.events.push(event)
  };
  const context = vm.createContext({
    window, localStorage,
    CustomEvent: function(type, options) { this.type = type; this.detail = options.detail; },
    console: { log() {}, warn() {}, error() {} },
    setTimeout: (...args) => calls.timers.push(args)
  });
  vm.runInContext(source, context);
  await window.storageReady;
  return { window, cache, database, calls, localStorage, read: key => JSON.parse(cache.get(key)) };
}

test('reference-photo refresh replaces a stale local media cache with sanitized current public references',async()=>{
  const key='tb-card-media-v1',photo={id:'ref',url:'https://example.test/front.jpg',side:'front',kind:'reference'};
  const h=await boot({local:{[key]:{version:1,cards:{7:{photos:[{...photo,url:'https://example.test/old.jpg'}]}}}},cloud:{[key]:{version:1,cards:{7:{photos:[photo,{...photo,id:'private',url:'https://example.test/private.jpg',kind:'own_photo'}],paidPrice:'private'}}}}});
  const result=await h.window.trackerMediaStore.load();
  assert.equal(result.ok,true);assert.equal(result.value.cards[7].photos.length,1);assert.equal(result.value.cards[7].photos[0].url,photo.url);
  assert.equal(h.read(key).cards[7].paidPrice,undefined);assert.equal(h.calls.writes.length,0);
});

test('public media writes cannot carry own-copy photos or private purchase fields',async()=>{
  const h=await boot();
  await h.window.storage.set('tb-card-media-v1',{cards:{7:{photos:[{url:'https://example.test/own.jpg',kind:'own_photo',side:'front'},{url:'https://example.test/reference.jpg',kind:'reference',side:'front'}],sourceOrderId:'PRIVATE ORDER',paidPrice:'37.50'}}});
  const saved=h.database.collection_kv['tb-card-media-v1'];
  assert.equal(saved.cards[7].photos.length,1);assert.equal(saved.cards[7].photos[0].kind,'reference');
  assert.equal(JSON.stringify(saved).includes('PRIVATE ORDER'),false);assert.equal(JSON.stringify(saved).includes('37.50'),false);assert.equal(JSON.stringify(saved).includes('own.jpg'),false);
});

test('hydration adds cloud customs without losing unsynced local additions or legacy IDs', async () => {
  const legacy = card(null, 'Unsigned proof');
  const pending = card(1790000000001, 'Local blue proof', 20);
  const remote = card(1790000000002, 'Cloud green proof', 30);
  const h = await boot({ local: { [CUSTOM]: [legacy, pending] }, cloud: { [CUSTOM]: [legacy, remote] } });
  assert.deepEqual(h.read(CUSTOM).map(c => c.id), [10000, pending.id, remote.id]);
  assert.equal(h.read(CUSTOM)[0].updatedAt, undefined, 'Legacy records must not acquire invented timestamps');
  assert.equal(h.calls.writes.length, 0, 'Hydration must not write cloud data');
});

test('first visit hydrates customs with stable legacy IDs and catalogue metadata', async () => {
  const h = await boot({ cloud: { [CUSTOM]: [card(null, 'Pre-production proof')], [META]: { 1476: { catalogType: 'preproduction', updatedAt: 20 } } } });
  assert.equal(h.read(CUSTOM)[0].id, 10000);
  assert.equal(h.read(META)['1476'].catalogType, 'preproduction');
});

test('catalogue metadata merges by each record timestamp and keeps additions from both devices', async () => {
  const h = await boot({
    local: { [META]: { 1: { catalogType: 'released', updatedAt: 30 }, 2: { sourceUrl: 'local', updatedAt: 10 }, 3: { catalogType: 'custom' } } },
    cloud: { [META]: { 1: { catalogType: 'unverified', updatedAt: 20 }, 2: { sourceUrl: 'cloud', updatedAt: 40 }, 4: { catalogType: 'preproduction' } } }
  });
  assert.equal(h.read(META)['1'].catalogType, 'released');
  assert.equal(h.read(META)['2'].sourceUrl, 'cloud');
  assert.deepEqual(Object.keys(h.read(META)).sort(), ['1', '2', '3', '4']);
  h.database.collection_kv[META]['5'] = { catalogType: 'released', updatedAt: 50 };
  const result = await h.window.storage.set(META, JSON.stringify(h.read(META)));
  assert.equal(result.cloudSaved, true);
  assert.equal(h.read(META)['5'].catalogType, 'released');
  assert.equal(h.database.collection_kv[META]['5'].updatedAt, 50);
});

test('a timestamped edit can change identity on its stable ID and preserves late cloud additions', async () => {
  const original = card(null, 'Unsigned proof');
  const h = await boot({ local: { [CUSTOM]: [original] }, cloud: { [CUSTOM]: [original] } });
  const cloudAddition = card(1790000000003, 'Cloud yellow proof', 50);
  h.database.collection_kv[CUSTOM].push(cloudAddition);
  const edited = { ...h.read(CUSTOM)[0], cardSet: 'Unsigned gold proof', updatedAt: 60 };
  const result = await h.window.storage.set(CUSTOM, JSON.stringify([edited]));
  assert.equal(result.cloudSaved, true);
  assert.equal(result.localSaved, true);
  assert.deepEqual(h.database.collection_kv[CUSTOM].map(c => c.id), [10000, cloudAddition.id]);
  assert.equal(h.database.collection_kv[CUSTOM][0].cardSet, 'Unsigned gold proof');
});

test('a newer cloud edit wins over stale local metadata without losing stable identity', async () => {
  const h = await boot({
    local: { [CUSTOM]: [card(10000, 'Old proof label', 10)] },
    cloud: { [CUSTOM]: [card(10000, 'Correct proof label', 20)] }
  });
  assert.equal(h.read(CUSTOM)[0].cardSet, 'Correct proof label');
  assert.equal(h.read(CUSTOM)[0].id, 10000);
});

test('legacy ID collisions retain both versions for review and block overwriting cloud', async () => {
  const local = card(null, 'Local different card');
  const remote = card(null, 'Cloud different card');
  const h = await boot({ local: { [CUSTOM]: [local] }, cloud: { [CUSTOM]: [remote] } });
  assert.equal(h.read(CUSTOM)[0].cardSet, local.cardSet);
  assert.equal(h.database.collection_kv[CUSTOM][0].cardSet, remote.cardSet);
  assert.equal(h.window.storageSyncIssues[CUSTOM].conflicts[0].id, 10000);
  const result = await h.window.storage.set(CUSTOM, JSON.stringify(h.read(CUSTOM)));
  assert.equal(result.cloudSaved, false);
  assert.match(result.error, /conflict/i);
  assert.equal(result.conflicts[0].cloud.cardSet, remote.cardSet);
  assert.equal(h.calls.writes.length, 0);
  assert.ok(h.calls.events.some(event => event.type === 'storage-sync-issue'));
});

test('archived tombstones stay on their original IDs after merging', async () => {
  const h = await boot({ cloud: { [CUSTOM]: [card(null, 'First proof'), card(null, 'Second proof')] } });
  const cards = h.read(CUSTOM);
  cards[0] = { ...cards[0], archived: true, updatedAt: 30 };
  const result = await h.window.storage.set(CUSTOM, JSON.stringify(cards));
  assert.equal(result.cloudSaved, true);
  assert.equal(h.database.collection_kv[CUSTOM][0].archived, true);
  assert.equal(h.database.collection_kv[CUSTOM][1].id, 10001);
});

test('Supabase returned errors are failures, local data survives, and no stale retry is scheduled', async () => {
  const h = await boot();
  h.calls.failWrite = 'Database write rejected';
  const payload = [card(1790000000004, 'New proof', 100)];
  const result = await h.window.storage.set(CUSTOM, JSON.stringify(payload));
  assert.equal(result.cloudSaved, false);
  assert.equal(result.localSaved, true);
  assert.match(result.error, /rejected/);
  assert.equal(h.read(CUSTOM)[0].id, payload[0].id);
  assert.equal(h.calls.writes.length, 1);
  assert.equal(h.calls.timers.length, 0);
  assert.equal(h.database.collection_kv[CUSTOM], undefined);
});

test('failed reconciliation read does not overwrite cloud with a partial local catalogue', async () => {
  const h = await boot({ cloud: { [CUSTOM]: [card(10000, 'Cloud proof')] } });
  h.calls.failRead = 'Network unavailable';
  const result = await h.window.storage.set(CUSTOM, JSON.stringify([card(1790000000005, 'Pending proof', 100)]));
  assert.equal(result.cloudSaved, false);
  assert.equal(h.calls.writes.length, 0);
  assert.equal(h.read(CUSTOM)[0].cardSet, 'Pending proof');
  assert.equal(h.database.collection_kv[CUSTOM][0].cardSet, 'Cloud proof');
});

test('viewer writes never use authenticated cloud mutation and report local-only retention', async () => {
  const h = await boot({ owner: false });
  const result = await h.window.storage.set(META, JSON.stringify({ 1476: { catalogType: 'preproduction', updatedAt: 100 } }));
  assert.equal(result.cloudSaved, false);
  assert.equal(result.localSaved, true);
  assert.match(result.error, /Sign in/);
  assert.equal(h.calls.writes.length, 0);
});

test('other hydration keys and consolidated collection timestamp behavior stay unchanged', async () => {
  const h = await boot({
    local: { 'tb-targets-v1': { local: 1 }, 'tb-alldata-v1': { statuses: { 10: 'owned' }, _saveTimestamp: 50 } },
    cloud: { 'tb-targets-v1': { cloud: 1 }, 'tb-alldata-v1': { statuses: { 20: 'owned' }, _saveTimestamp: 40 } }
  });
  assert.deepEqual(h.read('tb-targets-v1'), { local: 1 });
  assert.deepEqual(h.read('tb-alldata-v1').statuses, { 10: 'owned' });
});

test('catalogue writes are serialized so an older request cannot finish last', async () => {
  const h = await boot();
  let releaseFirst;
  const blocked = new Promise(resolve => { releaseFirst = resolve; });
  let firstStarted;
  const started = new Promise(resolve => { firstStarted = resolve; });
  h.calls.beforeWrite = async () => {
    if (h.calls.writes.length === 1) { firstStarted(); await blocked; }
  };
  const first = h.window.storage.set(META, JSON.stringify({ 1: { catalogType: 'unverified', updatedAt: 10 } }));
  await started;
  const second = h.window.storage.set(META, JSON.stringify({ 1: { catalogType: 'released', updatedAt: 20 } }));
  releaseFirst();
  const results = await Promise.all([first, second]);
  assert.ok(results.every(result => result.cloudSaved));
  assert.equal(h.database.collection_kv[META]['1'].catalogType, 'released');
  assert.equal(h.read(META)['1'].catalogType, 'released');
});
