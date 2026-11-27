const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../catalog-panel.jsx'),'utf8');
const window={CardCatalog:require('../catalog-utils.js'),TEMPO_ROSTER:{sykes:{name:'Brittney Sykes'}}};
// Execute the same form preparation used by the panel without a browser or JSX compiler.
vm.runInNewContext(source.slice(0,source.indexOf('  function CardCatalogPanel(props)'))+'window.rules={makeForm,prepareSubmission,cardSubject,cardYear,productLabel,syncKeys,readSyncIssues};})();',{window,URL,Map});
const R=window.rules;
const card={id:'tcdb:40342336',year:'2026',subject:'Brittney Sykes',product:'Donruss WNBA',cardNumber:'JS-BS',cardSet:'Jersey Series Green',copies:'99',tcdbId:'40342336',tcdbSetId:'689045',sourceUrl:'https://www.tcdb.com/ViewCard.cfm/cid/40342336',isAuto:'',isCustom:false};
test('sport edit round trip preserves separate year, subject, IDs and external provenance',()=>{
 const original=structuredClone(card),form=R.makeForm(original,false,'basketball');
 assert.equal(form.subject,'Brittney Sykes');assert.equal(form.year,'2026');assert.equal(form.product,'Donruss WNBA');
 const next=R.prepareSubmission({...form,evidenceNotes:'Green /99 shown on back'},original,'basketball');
 assert.equal(next.error,undefined);assert.equal(next.card.id,card.id);assert.equal(next.card.tcdbId,card.tcdbId);assert.equal(next.card.tcdbSetId,card.tcdbSetId);
 assert.equal(next.card.sourceUrl,card.sourceUrl);assert.equal(next.card.product,card.product);assert.equal(next.card.year,'2026');assert.equal(next.card.subject,card.subject);
 assert.equal(next.card.evidenceNotes,'Green /99 shown on back');assert.deepEqual(original,card);
});
test('sport additions require subject, consistent year, exact variant and source evidence',()=>{
 const form={...R.makeForm(null,false,'racing'),subject:'Ryan Blaney',year:'2024',product:'National Treasures',cardNumber:'TN-RBL',cardSet:'Treasured Numbers Signatures',copies:'99',sourceUrl:'https://www.tcdb.com/ViewCard.cfm/cid/1'};
 assert.equal(R.prepareSubmission(form,null,'racing').error,undefined);
 for(const patch of [{subject:''},{year:'24'},{product:'2023 National Treasures'},{cardSet:''},{sourceUrl:'',evidenceNotes:''},{sourceUrl:'javascript:alert(1)'},{copies:'0'}])assert.ok(R.prepareSubmission({...form,...patch},null,'racing').error,JSON.stringify(patch));
});
test('source identifiers cannot be replaced and string parent IDs are not coerced to numbers',()=>{
 const form={...R.makeForm(card,false,'basketball'),id:'different',tcdbId:'other',tcdbSetId:'other',parentCardId:'tcdb:1234'};
 const next=R.prepareSubmission(form,card,'basketball').card;
 assert.equal(next.id,card.id);assert.equal(next.tcdbId,card.tcdbId);assert.equal(next.tcdbSetId,card.tcdbSetId);assert.equal(next.parentCardId,'tcdb:1234');
 assert.match(R.prepareSubmission({...form,parentCardId:card.id},card,'basketball').error,/itself/);
});
test('sports season labels survive edits without forcing a different source year or product',()=>{
 const season={...card,year:'2024-25',product:'2024-25 Upper Deck',subject:'Player Name'};
 const next=R.prepareSubmission(R.makeForm(season,false,'hockey'),season,'hockey');
 assert.equal(next.error,undefined);assert.equal(next.card.year,'2024-25');assert.equal(next.card.product,'2024-25 Upper Deck');
 assert.equal(R.productLabel(season),'2024-25 Upper Deck');
});
test('Tyler default form and product validation retain their existing contract',()=>{
 const tb={id:7,product:'2024 Topps Chrome',cardNumber:'RA-TB',cardSet:'Gold',copies:'50',isCustom:true,sourceUrl:'https://example.com/card'};
 const form=R.makeForm(tb,false,'tb');assert.equal(Object.hasOwn(form,'year'),false);assert.equal(Object.hasOwn(form,'subject'),false);
 assert.equal(R.prepareSubmission(form,tb,'tb').error,undefined);
 assert.match(R.prepareSubmission({...form,product:'Topps Chrome'},tb,'tb').error,/year and product/);
 assert.equal(R.prepareSubmission({...form,parentCardId:'17'},tb,'tb').card.parentCardId,17);
});
test('collection labels and sync errors resolve the selected sport rather than Tyler storage',()=>{
 window.storageSyncIssues={'tb-custom-cards-v1':{error:'TB only'},'collect-racing-alldata-v1':{error:'Racing only'}};
 assert.equal(R.readSyncIssues('racing').length,1);assert.equal(R.readSyncIssues('racing')[0].error,'Racing only');
 assert.equal(R.readSyncIssues('basketball').length,0);assert.equal(R.readSyncIssues('tb')[0].error,'TB only');
 assert.equal(R.cardSubject({player:'sykes'}),'Brittney Sykes');assert.equal(R.productLabel(card),'2026 Donruss WNBA');
 assert.equal(R.productLabel({...card,product:'2026 Donruss WNBA'}),'2026 Donruss WNBA');
});

test('a named proof entered through the regular Tyler card form is saved in Proofs without promoting verification',()=>{
  const form={...R.makeForm(null,false,'tb'),product:'2021 Leaf Metal Draft',cardNumber:'BA-TB1',cardSet:'Pre‑Production Proof Purple',evidenceNotes:'Manual entry from the Leaf slab.'};
  const result=R.prepareSubmission(form,null,'tb');
  assert.equal(result.error,undefined);
  assert.equal(result.card.issueType,'pre_production_proof');
  assert.equal(result.card.verification,'unverified');
  assert.equal(window.CardCatalog.matchesScope(result.card,'proofs'),true);
  assert.equal(window.CardCatalog.isChecklistCard(result.card),false);
});
