const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const catalog = require('../catalog-utils.js');
const additions = require('../catalog-2026.js');
const make = (cardSet, extra = {}) => ({product:'2021 Leaf Metal Draft', cardNumber:'BA-TB1',cardSet,copies:'',...extra});

test('2026 source manifest contains 49 distinct stable IDs and verified serial runs', () => {
  assert.equal(additions.length,49);
  assert.equal(new Set(additions.map(c=>c.id)).size,49);
  assert.equal(new Set(additions.map(catalog.identityKey)).size,49);
  for (const card of additions) {
    assert.ok(card.id>=2001 && card.id<=2049);
    assert.equal(card.isRC,'');
    assert.equal(card.verification,'checklist');
    assert.equal(catalog.isChecklistCard(card),true);
    assert.ok(catalog.safeUrl(card.sourceUrl));
  }
  for (const [name,run] of [['Green','99'],['Gold','50'],['Orange','25'],['Black','10'],['Red','5']]) {
    assert.equal(additions.find(c=>c.cardSet===`${name} Diamante Foil`).copies,run);
  }
  assert.equal(additions.find(c=>c.cardSet==='Golden Mirror Variation').copies,'');
  assert.equal(additions.filter(c=>!c.copies).length,13);
});

test('proof detection does not misclassify released Proof parallels or printing plates', () => {
  for (const title of ['Artist Proof','Press Proof Gold','Photographer\'s Proof','Printing Plates Black']) {
    assert.equal(catalog.isChecklistCard(make(title)),true,title);
  }
  for (const title of ['Pre Production Proof 1/1','Pre-Production Proof Green','Unsigned Proof 1/1','State Pride Green Crystals Proof Auto 1/1']) {
    assert.equal(catalog.isChecklistCard(make(title)),false,title);
    assert.equal(catalog.isProof(make(title)),true,title);
  }
  assert.equal(catalog.isChecklistCard(make('Base',{product:'2024 Pulse (unlicensed)'})),true);
});

test('unverified custom cards stay separate until classified with evidence', () => {
  const card=make('Base',{isCustom:true});
  assert.equal(catalog.isChecklistCard(card),false);
  assert.equal(catalog.isChecklistCard({...card,issueType:'standard',verification:'observed'}),true);
  assert.equal(catalog.isChecklistCard({...card,issueType:'standard',verification:'unverified'}),false);
  assert.equal(catalog.isChecklistCard({...card,issueType:'standard',verification:'checklist',archived:true}),false);
});

test('legacy custom IDs survive archive, reorder and addition', () => {
  const cards=catalog.normalizeCustomCards([make('Red'),make('Blue'),make('Gold')]);
  assert.deepEqual(cards.map(c=>c.id),[10000,10001,10002]);
  cards[0].archived=true;
  const next=catalog.normalizeCustomCards([cards[2],cards[0],cards[1]]);
  assert.deepEqual(next.map(c=>c.id),[10002,10000,10001]);
  assert.equal(catalog.nextCustomId(next,10001),10003);
  assert.equal(next.find(c=>c.id===10001).cardSet,'Blue');
});

test('duplicate detection includes product, card number and signature, without guessing missing runs', () => {
  const a=make('Pre-Production Proof Green',{isCustom:true,signature:'unsigned'});
  assert.equal(catalog.sameIdentity(a,{...a,product:'2021 Leaf Valiant'}),false);
  assert.equal(catalog.sameIdentity(a,{...a,signature:'signed'}),false);
  assert.equal(catalog.sameIdentity(a,{...a,copies:'1'}),true);
  assert.equal(catalog.sameIdentity(a,{...a,cardSet:' pre production proof green '}),true);
});

test('new cards require provenance and reject unsafe URLs and invalid runs', () => {
  const card=make('Pre-Production Proof Green',{isCustom:true});
  assert.ok(catalog.validate(card));
  assert.equal(catalog.validate({...card,evidenceNotes:'Front/back photos show Green, unsigned; print run not visible.'}), '');
  assert.ok(catalog.validate({...card,sourceUrl:'javascript:alert(1)'}));
  assert.ok(catalog.validate({...card,copies:'0',sourceUrl:'https://example.com/card'}));
  assert.equal(catalog.safeUrl('https://example.com/card'), 'https://example.com/card');
  assert.equal(catalog.safeUrl('https://user:password@example.com'), '');
});

test('original built-in IDs do not collide with new manifest IDs', () => {
  const source=fs.readFileSync(path.join(__dirname,'../tracker.jsx'),'utf8');
  const raw=JSON.parse(source.split('\n')[1].replace(/^const RAW_DATA = /,'').replace(/;$/,''));
  assert.equal(raw.c.length,1479);
  for (const card of additions) assert.ok(card.id>raw.c.length && card.id<10000);
});
