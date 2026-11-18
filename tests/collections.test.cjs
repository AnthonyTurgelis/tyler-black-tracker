const test=require('node:test');
const assert=require('node:assert/strict');
const C=require('../collections-utils');
const now='2026-11-18T18:30:00.000Z';
const raw={year:'2025',product:'Panini Prizm Racing',cardNumber:'7',cardSet:'Silver',subject:'Kyle Larson',sourceSport:'Multi-Sport',status:'owned',qty:1,tcdbId:'123'};
const row=changes=>C.normalizeRow({...raw,...changes});
const plan=(state,rows,opts={})=>C.planImport(state,rows,{sport:'racing',now,...opts});

test('racing subjects from multi-sport are classified by athlete, retaining source category',()=>{
  const result=row({product:'2025 Allen & Ginter',sourceSport:'Multi-Sport'});
  assert.equal(result.sport,'racing');assert.equal(result.sourceSport,'Multi-Sport');
  assert.equal(C.classifySport({sourceSport:'Multi-Sport',subject:'Max Verstappen'}),'racing');
  assert.equal(C.classifySport({sourceSport:'Multi-Sport',subject:'Unknown Athlete'}),'other');
  assert.equal(C.classifySport({sourceSport:'Basketball',subject:'Caitlin Clark'}),'basketball');
});
test('CSV supports quoted delimiters, quotes, BOM and line breaks without losing source identities',()=>{
  const result=C.parse('\uFEFFSport,Year,Set,Number,Name,Parallel,Card ID,Quantity,Status\r\nMulti-Sport,2025,"Allen & Ginter, Chrome",7,"Kyle\nLarson","Silver ""Foil""",123,2,Have');
  assert.deepEqual(result.errors,[]);assert.equal(result.rows.length,1);
  assert.equal(result.rows[0].subject,'Kyle Larson');assert.equal(result.rows[0].product,'Allen & Ginter, Chrome');
  assert.equal(result.rows[0].cardSet,'Silver "Foil"');assert.equal(result.rows[0].id,'tcdb:123');
  assert.equal(result.rows[0].status,'owned');assert.equal(result.rows[0].qty,2);
});
test('pasted TCDB header/status text and tab-separated wantlist preserve wanted status',()=>{
  const result=C.parse('My Wantlist\nYear\tSet\tNumber\tName\n2025\tPanini Prizm Racing\t7\tKyle Larson',{sport:'racing'});
  assert.equal(result.rows[0].status,'wanted');assert.equal(result.rows[0].qty,1);assert.deepEqual(result.errors,[]);
});
test('unlabeled list remains checklist only; import manufactures no owned status',()=>{
  const result=C.parse('Year,Set,Number,Name\n2025,Panini Prizm Racing,7,Kyle Larson',{sport:'racing'});
  assert.equal(result.rows[0].status,'catalog');assert.equal(result.warnings.length,1);
  const imported=plan({},result.rows).nextState;
  assert.equal(Object.keys(imported.cards).length,1);assert.deepEqual(imported.statuses,{});
  assert.equal(Object.values(imported.details)[0].qty,undefined);
});
test('malformed rows, incomplete identity, negative quantities and unclosed quote are held',()=>{
  assert.equal(C.parse('Year,Set,Number,Name,Qty\n2025,Prizm,7,Kyle Larson,-1').errors.length,1);
  assert.equal(C.parse('Year,Set,Number,Name\n2025,Prizm,,Kyle Larson').errors.length,1);
  assert.equal(C.parse('Year,Set,Number,Name\n2025,Prizm,7,Kyle Larson,extra').errors.length,1);
  assert.equal(C.parse('Year,Set,Number,Name\n2025,"Prizm,7,Kyle Larson').errors.length,1);
  assert.equal(C.parse('2025 Panini Prizm #7 Kyle Larson').errors.length,1);
});
test('stable identity uses TCDB cid or full semantic card identity, never row position',()=>{
  assert.equal(C.stableId(row()),'tcdb:123');
  assert.equal(C.stableId({...raw,tcdbId:'',tcdbUrl:'https://www.tcdb.com/ViewCard.cfm/sid/4/cid/123'}),'tcdb:123');
  const a=row({tcdbId:''});assert.equal(a.id,row({tcdbId:'',line:50}).id);
  assert.notEqual(a.id,row({tcdbId:'',cardSet:'Gold'}).id);
  assert.notEqual(a.id,row({tcdbId:'',subject:'Kyle Busch'}).id);
});
test('same export pasted twice is idempotent and does not add copies or log entries',()=>{
  const first=plan({},[row({qty:2})]);const second=plan(first.nextState,[row({qty:2})]);
  assert.equal(first.nextState.details['tcdb:123'].qty,2);
  assert.equal(second.nextState.details['tcdb:123'].qty,2);
  assert.deepEqual(second.summary,{added:0,updated:0,review:0,skipped:1});
  assert.deepEqual(second.nextState,first.nextState);
});
test('wantlist cannot demote owned/in transit and wanted quantities remain separate',()=>{
  for(const status of ['owned','in_transit']) {
    const first=plan({},[row({status,qty:2})]).nextState;
    const second=plan(first,[row({status:'wanted',qty:1})]);
    assert.equal(second.nextState.statuses['tcdb:123'],status);
    assert.equal(second.nextState.details['tcdb:123'].qty,2);
    assert.equal(second.nextState.details['tcdb:123'].wantedQty,1);
    assert.equal(second.review.length,0);
  }
});
test('imports never reverse manual status, overwrite quantities or assume in-transit is another copy',()=>{
  const first=plan({},[row()]).nextState;
  first.details['tcdb:123'].manualStatus=true;
  for(const changed of [{status:'in_transit'},{qty:3},{status:'wanted',qty:2}]) {
    const second=plan(first,[row(changed)]);
    assert.equal(second.nextState.statuses['tcdb:123'],'owned');assert.equal(second.nextState.details['tcdb:123'].qty,1);
    assert.equal(second.review.length,changed.status==='wanted'?0:1);
  }
});
test('even a different acquisition source is not added to quantity without copy evidence',()=>{
  const first=plan({},[row()]).nextState;
  const second=plan(first,[row({source:'eBay',qty:1})]);
  assert.equal(second.nextState.details['tcdb:123'].qty,1);
});
test('1/1 multiple-copy exports are rejected rather than presented as duplicates',()=>{
  const result=plan({},[row({cardSet:'Black /1',qty:2})]);
  assert.equal(result.review.length,1);assert.deepEqual(result.nextState.cards,{});
  const aggregate=plan({},[row({cardSet:'Black /1',ownedQty:1,transitQty:1})]);
  assert.equal(aggregate.review.length,1);
});
test('source categories route into sport side without adding Tyler Black to a second tracker',()=>{
  const results=plan({},[row({subject:'Tyler Black',sourceSport:'Baseball',product:'Bowman'}),row({subject:'Caitlin Clark',sourceSport:'Basketball',product:'Prizm',tcdbId:'456'})]);
  assert.equal(results.additions.length,0);assert.equal(results.skipped.length,2);
  assert.equal(results.skipped[1].route,'basketball');
});
test('conflicting duplicate rows and conflicting TCDB identity are held for review',()=>{
  assert.equal(plan({},[row({qty:1}),row({qty:2})]).review.length,1);
  assert.equal(plan({},[row({qty:1}),row({qty:1})]).additions.length,1);
  const first=plan({},[row()]).nextState;
  const conflict=plan(first,[row({subject:'Kyle Busch'})]);
  assert.equal(conflict.review.length,1);assert.equal(conflict.nextState.cards['tcdb:123'].subject,'Kyle Larson');
});
test('canonical card now associated with TCDB ID requires review before merging IDs',()=>{
  const first=plan({},[row({tcdbId:''})]).nextState;
  const second=plan(first,[row()]);assert.equal(second.review.length,1);assert.equal(Object.keys(second.nextState.cards).length,1);
});
test('empty exports and omitted cards never delete existing cards, ownership, quantities or imports',()=>{
  const first=plan({},[row({qty:2})]).nextState;
  assert.deepEqual(plan(first,[]).nextState,first);
});
test('safe import preview is revalidated after a newer manual edit',()=>{
  const preview=plan({},[row()]);
  const newer=plan({},[row({status:'in_transit',qty:2})]).nextState;
  newer.details['tcdb:123'].manualStatus=true;
  const applied=C.applyPlan(newer,preview);
  assert.equal(applied.statuses['tcdb:123'],'in_transit');assert.equal(applied.details['tcdb:123'].qty,2);
});
test('quantity columns preserve owned and transit counts alongside wants',()=>{
  const parsed=C.parse('Year,Set,Number,Name,Have,In Transit,Want\n2025,Panini Prizm Racing,7,Kyle Larson,2,1,3');
  assert.deepEqual(parsed.errors,[]);const applied=plan({},parsed.rows).nextState;
  const details=Object.values(applied.details)[0];
  assert.equal(details.qty,3);assert.equal(details.ownedQty,2);assert.equal(details.transitQty,1);assert.equal(details.wantedQty,3);
  assert.equal(Object.values(applied.statuses)[0],'owned');
});

test('two source IDs with one exact identity in the same batch cannot create duplicate cards',()=>{
  const result=plan({},[row({tcdbId:'123'}),row({tcdbId:'456'})]);
  assert.equal(Object.keys(result.nextState.cards).length,1);assert.equal(result.review.length,1);
});
test('different serial evidence is held without changing saved copy identity',()=>{
  const first=plan({},[row({serial:'3/25',printRun:25})]).nextState;
  const result=plan(first,[row({serial:'4/25',printRun:25})]);
  assert.equal(result.review.length,1);assert.equal(result.nextState.details['tcdb:123'].serial,'3/25');
});
test('1/1 want quantity cannot request two copies',()=>{
  assert.equal(plan({},[row({cardSet:'Black /1',status:'wanted',qty:2})]).review.length,1);
});

test('delimiter selection uses recognizable headers, ignoring tabs inside quoted CSV notes',()=>{
  const result=C.parse('Year,Set,Number,Name,Notes\n2025,Prizm,7,Kyle Larson,"note\ttext"');
  assert.equal(result.errors.length,0);assert.equal(result.rows.length,1);assert.equal(result.rows[0].notes,'note text');
});
test('semantic IDs cannot collide when field values contain separators',()=>{
  assert.notEqual(C.identity({...raw,product:'a|b',cardNumber:'c'}),C.identity({...raw,product:'a',cardNumber:'b|c'}));
});

test('poker subjects are organized as Poker within Other even when TCDB source is Baseball',()=>{
  const result=row({subject:'Phil Hellmuth',product:'2009 Upper Deck Goodwin Champions',sourceSport:'Baseball'});
  assert.equal(result.sport,'other');assert.equal(result.functionalSport,'poker');assert.equal(result.sourceSport,'Baseball');
  assert.equal(row({subject:'Hailie Deegan',product:'Panini Fathers Day',sourceSport:'Multi-Sport'}).sport,'racing');
});

function rendered(overrides={}) {
  return {title:'2015-16 Upper Deck Contours - High Profile Fans Jersey #HP J-KH Kevin Harvick',url:'https://www.tcdb.com/ViewCard.cfm/sid/130741/cid/8707154/2015-16-Upper-Deck-Contours-High-Profile-Fans-Jersey-HP+J-KH-Kevin-Harvick',itemUrl:'https://www.tcdb.com/CollectionEdit.cfm?CardID=8707154&ItemID=865449557',quantity:'1',serial:'#12',grade:'',condition:'',cells:['1','','','','','2015-16 Upper Deck Contours - High Profile Fans Jersey #HP J-KH Kevin Harvick MEM','','',''],...overrides};
}
test('actual TCDB rendered rows preserve multi-token numbers, exact item ID, source category and racing routing',()=>{
 const p=C.parseRenderedCard(rendered(),{url:'https://www.tcdb.com/ViewCollectionMode.cfm?Filter=G&Type=Hockey'});
 assert.equal(p.row.cardNumber,'HP J-KH');assert.equal(p.row.subject,'Kevin Harvick');assert.equal(p.row.year,'2015-16');
 assert.equal(p.row.itemId,'865449557');assert.equal(p.row.sourceSport,'Hockey');assert.equal(p.row.sport,'racing');assert.equal(p.row.isMem,'Yes');
 assert.equal(p.row.collectionStatus,'owned');assert.equal(p.row.serial,'#12');
});
test('rendered TCDB variation notes distinguish photo and letter patches sharing one title',()=>{
 const r=rendered({title:'2020 Panini Prizm #56 Hailie Deegan',url:'https://www.tcdb.com/ViewCard.cfm/sid/241385/cid/15401916/2020-Panini-Prizm-56-Hailie-Deegan',cells:['2','','','','','2020 Panini Prizm #56 Hailie Deegan VAR\n\nVAR: Close-up photo','','','']});
 r.cells[5]=r.cells[5].replace(/\\n/g,'\n');
 const result=C.parseRenderedCard(r,{url:'https://www.tcdb.com/ViewCollectionMode.cfm?Filter=W&Type=Racing'});
 assert.equal(result.row.cardSet,'Base · Close-up photo');assert.equal(result.row.sourceVariant,'Base');assert.equal(result.row.status,'wanted');
});
test('rendered TCDB double-space card number URL does not leak number into subject',()=>{
 const r=rendered({title:'2004 Press Pass Eclipse - Under Cover Cars #UCC 5 Kurt Busch',url:'https://www.tcdb.com/ViewCard.cfm/sid/55471/cid/4885759/2004-Press-Pass-Eclipse-Under-Cover-Cars-UCC++5-Kurt-Busch'});
 const parsed=C.parseRenderedCard(r,{url:'https://www.tcdb.com/ViewCollectionMode.cfm?Filter=I&Type=Racing'});
 assert.equal(parsed.row.cardNumber,'UCC 5');assert.equal(parsed.row.subject,'Kurt Busch');assert.equal(parsed.row.status,'in_transit');
});
test('distinct verified TCDB URLs preserve legitimate same-title catalog variations',()=>{
 const a=row({sourceUrl:'https://www.tcdb.com/ViewCard.cfm/cid/123/',tcdbId:'123'});
 const b=row({sourceUrl:'https://www.tcdb.com/ViewCard.cfm/cid/456/',tcdbId:'456'});
 const result=plan({},[a,b]);assert.equal(Object.keys(result.nextState.cards).length,2);assert.equal(result.review.length,0);
});
test('TCDB valuation cells do not become prices paid and sale/trade rows remain separate evidence',()=>{
 const raw=rendered();raw.cells[7]='$600.00';
 const r=C.parseRenderedCard(raw,{url:'https://www.tcdb.com/ViewCollectionMode.cfm?Filter=S&Type=Racing'}).row;
 assert.equal(r.collectionStatus,'for_sale');assert.equal(r.status,'catalog');assert.equal(r.price,undefined);assert.equal(r.pricePaid,undefined);
});

test('poker personalities from a racing-branded checklist route to Poker',()=>{
 for(const subject of ['Chris "Jesus" Ferguson','Dennis Phillips']){
  const r=row({subject,product:'Wheels Main Event',sourceSport:'Racing'});assert.equal(r.sport,'other');assert.equal(r.functionalSport,'poker');
 }
});
test('rendered TCDB trailing whitespace in number slug does not leak JM into subject',()=>{
 const r=rendered({title:'2007 Press Pass Legends - Sunday Swatches Silver #SS JM Juan Pablo Montoya',url:'https://www.tcdb.com/ViewCard.cfm/sid/55947/cid/4896391/2007-Press-Pass-Legends-Sunday-Swatches-Silver-SS+JM+-Juan-Pablo-Montoya'});
 const result=C.parseRenderedCard(r,{url:'https://www.tcdb.com/ViewCollectionMode.cfm?Filter=W&Type=Racing'}).row;
 assert.equal(result.cardNumber,'SS JM');assert.equal(result.subject,'Juan Pablo Montoya');
});

test('stale want evidence cannot reverse a manually cleared wanted quantity',()=>{
 const first=plan({},[row({status:'wanted',qty:3})]).nextState;
 first.details['tcdb:123'].wantedQty=0;first.details['tcdb:123'].manualQuantity=true;
 const next=plan(first,[row({status:'wanted',qty:2})]);
 assert.equal(next.review.length,1);assert.equal(next.nextState.details['tcdb:123'].wantedQty,0);
});
test('explicit zero quantity is not silently promoted to one by an owned status',()=>{
 const first=plan({},[row()]).nextState;
 first.details['tcdb:123'].qty=0;first.details['tcdb:123'].manualQuantity=true;
 const next=plan(first,[row({source:'eBay',qty:1})]);
 assert.equal(next.review.length,1);assert.equal(next.review[0].current.qty,0);assert.equal(next.nextState.details['tcdb:123'].qty,0);
});
