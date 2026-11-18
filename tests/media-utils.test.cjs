const test = require('node:test');
const assert = require('node:assert/strict');
const TM = require('../media-utils.js');
const front = {id:'front',url:'https://images.example.test/front.jpg',side:'front',kind:'copy_scan'};
const back = {id:'back',url:'https://images.example.test/back.jpg',side:'back',kind:'copy_scan'};

test('linked marketplace scans retain their source label and never become private photos',()=>{
  const cases = [
    {id:'comc:123:front:1',url:'https://img.comc.com/i/Baseball/2024/Test.jpg',sourceUrl:'https://www.comc.com/item/123'},
    {id:'ebay:123:front:1',url:'https://i.ebayimg.com/images/g/example/s-l1600.jpg',sourceUrl:'https://www.ebay.ca/itm/123'},
    {id:'second-pass:123:front:1',url:'https://images.example.test/source.jpg'},
    {id:'external',url:'https://images.example.test/scan.jpg',sourceUrl:'https://www.ebay.com/itm/123'}
  ];
  for (const c of cases) {
    const photo = {...c,kind:'copy_scan',side:'front'};
    assert.equal(TM.isExternalSourceScan(photo),true);
    const normalized = TM.normalizePhotos([{...photo,context:TM.isExternalSourceScan(photo)?'purchase_source':''}])[0];
    assert.equal(TM.photoSourceLabel(normalized),'Purchase source photo');
  }
  assert.equal(TM.isExternalSourceScan({...front,url:'https://my-photo-host.test/my-scan.jpg'}),false);
  assert.equal(TM.isExternalSourceScan({...front,kind:'own_photo',url:'https://img.comc.com/i/Baseball/example.jpg'}),false);
});

test('COMC and eBay thumbnails use smaller scans without modifying full-resolution or back URLs',()=>{
  const front='https://img.comc.com/i/Baseball/2024/Test.jpg?id=abc&size=original';
  const back=front+'&side=back';
  assert.equal(TM.thumbnailUrl({url:front}),'https://img.comc.com/i/Baseball/2024/Test.jpg?id=abc&size=biggerthumb');
  assert.equal(TM.thumbnailUrl({url:back}),'https://img.comc.com/i/Baseball/2024/Test.jpg?id=abc&size=biggerthumb&side=back');
  assert.equal(TM.thumbnailUrl({url:'https://i.ebayimg.com/images/g/id/s-l1600.jpg'}),'https://i.ebayimg.com/images/g/id/s-l500.jpg');
  assert.equal(TM.thumbnailUrl({url:'https://i.ebayimg.com/images/g/id/s-l1600.webp'}),'https://i.ebayimg.com/images/g/id/s-l500.webp');
  assert.equal(TM.thumbnailUrl({url:'https://i.ebayimg.com/images/g/id/s-l1200.webp'}),'https://i.ebayimg.com/images/g/id/s-l500.webp');
  assert.equal(TM.thumbnailUrl({url:'https://i.ebayimg.com/images/g/id/s-l500.webp'}),'https://i.ebayimg.com/images/g/id/s-l500.webp');
  assert.equal(TM.thumbnailUrl({url:'https://i.ebayimg.com/00/s/X/$_57.JPG'}),'https://i.ebayimg.com/00/s/X/$_57.JPG');
  assert.equal(TM.thumbnailUrl({url:'javascript:alert(1)'}),'');
});

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

test('copy image fallback uses only the exact catalogue variant and preserves own-photo priority',()=>{
  const exact={...front,id:'exact',url:'https://images.example.test/exact.jpg',kind:'reference'};
  const similar={...front,id:'similar',url:'https://images.example.test/similar.jpg',kind:'reference'};
  const media={cards:{7:{photos:[exact]},8:{photos:[similar]}}};
  assert.deepEqual(TM.exactVariantPhotos(9,media),[],'no product, parent or similar-parallel substitution');
  const own={...back,kind:'own_photo'};
  const photos=TM.photosForCopy({photos:[own]},7,media);
  assert.equal(photos[0].kind,'own_photo');assert.equal(photos.length,2);
  assert.equal(photos[1].referenceCardId,7);assert.equal(TM.photoSourceLabel(photos[1]),'Reference / exact variant');
  assert.equal(photos.some(photo=>photo.url===similar.url),false);
  assert.deepEqual(TM.exactVariantPhotos(7,{cards:{7:{photos:[front]}}}),[],'private scans are not accepted as public references');
});

test('unidentified purchases keep source photos separate from all explicitly tentative candidate references',()=>{
  const cards={7:{id:7,product:'2021 Leaf',cardSet:'Blue'},8:{id:8,product:'2021 Leaf',cardSet:'Orange'}};
  const media={cards:{7:{photos:[{...front,kind:'reference',url:'https://images.example.test/blue.jpg'}]},8:{photos:[{...front,kind:'reference',url:'https://images.example.test/orange.jpg'}]}}};
  const observation={cardId:7,identityConfirmed:false,identityConfidence:'image_verified',candidateCardIds:[7,8,7],photos:[front],sourceOrderId:'private-order',source:'ebay'};
  const before=JSON.stringify({observation,media}),plan=TM.observationPhotoPlan(observation,cards,media);
  assert.equal(plan.identityConfirmed,false);assert.equal(plan.card,null);
  assert.equal(plan.photos.length,1);assert.equal(plan.photos[0].context,'purchase_source');assert.equal(TM.photoSourceLabel(plan.photos[0]),'Purchase source photo');
  assert.deepEqual(plan.candidates.map(candidate=>candidate.card.id),[7,8]);
  assert.ok(plan.candidates.every(candidate=>candidate.photos[0].referenceCardId===candidate.card.id));
  assert.equal(JSON.stringify({observation,media}),before,'display planning never rewrites private observations or public media');
  const confirmed=TM.observationPhotoPlan({...observation,identityConfirmed:true,candidateCardIds:[]},cards,media);
  assert.equal(confirmed.card.id,7);assert.equal(confirmed.candidates.length,0);assert.equal(confirmed.photos.length,2);
  const empty=TM.observationPhotoPlan({cardId:7,identityConfirmed:false},cards,{});
  assert.equal(empty.photos.length,0);assert.equal(empty.candidates[0].card.id,7,'a proposed cardId remains a visible candidate even without an image');
});

test('review reasons overlap without treating pending identity or refund evidence as a counted copy',()=>{
  const observation={cardId:7,identityConfirmed:false,disposition:'pending',location:'unknown',duplicateGroupConfirmed:true,reconciliationDecision:'different_serial_requires_copy_review',refundOrCancellationReview:true};
  const flags=TM.reviewFlags(observation);
  for(const key of ['identity','duplicate','serial','location','purchase','copy_match'])assert.equal(flags[key],true,key);
  assert.equal(flags.identityConfirmed,false);
  const linked=TM.reviewFlags({...observation,matchedCopyId:'one',location:'comc',reconciliationDecision:'',duplicateGroupConfirmed:false,refundOrCancellationReview:false});
  assert.equal(linked.identity,false);assert.equal(linked.copy_match,false);assert.equal(linked.location,false);
});

test('unsigned Top100 source facts filter as pre-production proofs while catalogue identity remains pending',()=>{
  const catalog=require('../catalog-utils.js');
  const cards={1476:{id:1476,issueType:'pre_production_proof',signature:'unknown'},10011:{id:10011,issueType:'manufacturer_proof',signature:'unknown'}};
  const observation={cardId:1476,identityConfirmed:false,candidateCardIds:[1476,10011],refundOrCancellationReview:true,observedCards:[{signature:'unsigned',issueType:'pre_production_proof',serialMark:'1/1 PRE-PRODUCTION PROOF (front)',yearEvidence:'unresolved',variantDescription:'Blue geometric'}]};
  assert.equal(TM.observationMatchesScope(observation,'preproduction_unsigned',cards,catalog),true);
  assert.equal(TM.observationMatchesScope(observation,'manufacturer_proofs',cards,catalog),false);
  assert.equal(TM.observationMatchesScope(observation,'proofs_unknown',cards,catalog),false);
  assert.equal(TM.observationMatchesScope(observation,'checklist',cards,catalog),false);
  assert.equal(TM.observationFacts(observation).variantDescription,'Blue geometric');
  assert.equal(TM.reviewFlags(observation).identity,true);
  assert.equal(observation.serial,undefined,'a visible source marking never becomes a physical-copy serial');
});

test('other collections never inherit Tyler jersey 7 without explicit on-card evidence',()=>{
  const TM=require('../media-utils');
  assert.equal(TM.jerseyMatches({serial:'7/99'},'',null,null).primary,false);
  assert.equal(TM.jerseyMatches({serial:'7/99'},'',null,null).secondary,false);
  const verified={serial:'7/99',secondaryJerseyNumber:'7',secondaryJerseyEvidence:{confirmed:true,sourceUrl:'https://example.test/card.jpg',note:'7 visible on this card'}};
  assert.equal(TM.jerseyMatches(verified,'',null,null).secondary,true);
  assert.equal(TM.jerseyMatches({serial:'7/99'}).primary,true,'Tyler behavior is unchanged');
});
