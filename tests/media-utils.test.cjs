const test = require('node:test');
const assert = require('node:assert/strict');
const TM = require('../media-utils.js');
const front = {id:'front',url:'https://images.example.test/front.jpg',side:'front',kind:'copy_scan'};
const back = {id:'back',url:'https://images.example.test/back.jpg',side:'back',kind:'copy_scan'};

test('photo URLs accept HTTPS and reject scripts, embedded credentials and local files',()=>{
  for(const url of ['javascript:alert(1)','data:image/png;base64,a','file:///tmp/photo.jpg','http://example.test/a','https://me:secret@example.test/a','/image.jpg']) assert.equal(TM.safeImageUrl(url),'');
  assert.equal(TM.safeImageUrl(front.url),front.url);
});

test('own photos stay preferred when new front/back scans merge without duplicating URLs',()=>{
  const own={...front,id:'own',kind:'own_photo',caption:'My image'};
  const merged=TM.mergePhotos([own],[{...front,kind:'reference',caption:'Imported listing'},back]);
  assert.equal(merged.length,2);
  assert.equal(merged[0].id,'own');assert.equal(merged[0].kind,'own_photo');assert.equal(merged[0].caption,'My image');
  assert.equal(merged[1].side,'back');
});

test('public media keeps only explicitly labelled safe references and verified exact-card jersey evidence',()=>{
  const input={cards:{7:{photos:[{...front,kind:'reference'},back,{...front,url:'https://private.example.test/own.jpg',kind:'own_photo'}, {url:'https://unknown.example.test/x.jpg'}],paidPrice:'private',sourceOrderId:'secret',secondaryJerseyNumber:'20',secondaryJerseyEvidence:{confirmed:true,photoId:'front',note:'20 on uniform'}},8:{photos:[back]}}};
  const result=TM.normalizePublicMedia(input);
  assert.equal(result.cards[7].photos.length,1);assert.equal(result.cards[7].secondaryJerseyNumber,'20');
  assert.equal(result.cards[7].paidPrice,undefined);assert.equal(result.cards[7].sourceOrderId,undefined);assert.equal(result.cards[8],undefined);
  assert.equal(TM.normalizePublicMedia('{invalid').version,1);
});

test('primary jersey7 uses the numerator only, including legacy serial lists and credible COMC metadata',()=>{
  assert.equal(TM.jerseyMatches({serial:'007/025',serialEvidence:'comc_inventory'}).primary,true);
  assert.equal(TM.jerseyMatches({},'05/25, 07/25; 22/25').primary,true);
  for(const record of [{serial:'1/7'},{serial:'17/99'},{serial:'-7/0'},{serial:'Card #7'},{serial:'7/25',serialEvidence:'unverified_title'}]) assert.equal(TM.jerseyMatches(record).primary,false);
});

test('secondary matches require explicit depiction evidence and the recorded serial must match it',()=>{
  const record={serial:'20/99',photos:[front],secondaryJerseyNumber:'20',secondaryJerseyEvidence:{photoId:'front',confirmed:true}};
  assert.equal(TM.jerseyMatches(record).secondary,true);
  assert.equal(TM.jerseyMatches({...record,serial:'63/99'}).secondary,false);
  assert.equal(TM.jerseyMatches({...record,secondaryJerseyEvidence:{photoId:'wrong',confirmed:true}}).secondary,false);
  assert.equal(TM.jerseyMatches({...record,secondaryJerseyEvidence:{photoId:'front',confirmed:false}}).secondary,false);
  assert.equal(TM.jerseyMatches({...record,photos:[],secondaryJerseyEvidence:{sourceUrl:'https://example.test/card',note:'20 on uniform',confirmed:true}}).secondary,true);
});

test('exact-card secondary evidence can match legacy serials while explicit per-copy evidence takes precedence',()=>{
  const cardMedia={photos:[{...front,kind:'reference'}],secondaryJerseyNumber:'20',secondaryJerseyEvidence:{photoId:'front',confirmed:true}};
  assert.equal(TM.jerseyMatches({},'07/99, 20/99',cardMedia).primary,true);
  assert.equal(TM.jerseyMatches({},'07/99, 20/99',cardMedia).secondary,true);
  assert.equal(TM.jerseyMatches({serial:'20/99',secondaryJerseyEvidence:{}},'',cardMedia).secondary,true);
  assert.equal(TM.jerseyMatches({serial:'20/99',secondaryJerseyNumber:'88',secondaryJerseyEvidence:{confirmed:false}},'',cardMedia).secondary,false);
});

test('COMC duplicate review includes linked and pending observations without using copy counts',()=>{
  const shared={source:'comc',currentInventory:true,duplicateGroupConfirmed:true,cardId:7,comcGroupCount:3};
  const state={copies:{one:{cardId:7}},observations:{a:{...shared,id:'a',matchedCopyId:'one'},b:{...shared,id:'b',disposition:'pending'},c:{...shared,id:'c',comcMinimumExtras:999},d:{...shared,id:'d',currentInventory:false},e:{...shared,id:'e',source:'ebay'},f:{...shared,id:'f',cardId:null}}};
  const before=JSON.stringify(state), groups=TM.comcDuplicateGroups(state);
  assert.equal(groups.length,1);assert.equal(groups[0].count,3);assert.equal(groups[0].minimumExtras,2);assert.equal(groups[0].observations.length,3);
  assert.equal(JSON.stringify(state),before);
});
