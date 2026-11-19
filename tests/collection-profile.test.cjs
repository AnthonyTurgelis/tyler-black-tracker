const test=require('node:test'),assert=require('node:assert/strict');
const P=require('../collection-profile');

test('main tracker profiles preserve every existing public/private collection namespace',()=>{
 assert.equal(P.prefix('tb'),'tb');assert.equal(P.scope('tb'),'tb');
 assert.equal(P.prefix('wnba'),'tempo');assert.equal(P.scope('wnba'),'tempo');
 for(const sport of P.SPORTS){assert.equal(P.isSport(sport),true);assert.equal(P.prefix(sport),'collect-'+sport);assert.equal(P.scope(sport),sport);assert.ok(P.title(sport));}
 assert.equal(P.isSport('wnba'),false);assert.throws(()=>P.prefix('racing/../tb'),/Unknown/);
});

test('sport cards retain exact string IDs, raw identity fields and all saved ownership untouched',()=>{
 const id='tcdb:9007199254740993123';
 const card={id,year:'2022-23',product:'2022-23 Leaf Multigraphics',cardNumber:'TG-16',cardSet:'Tri-Graphics Autographs Blue Crystal',subject:'NaLyssa Smith / Aneesah Morrow / Maria Gakdeng',printRun:10,sourceUrl:'https://www.tcdb.com/ViewCard.cfm/cid/123',attributes:'AU, SN10',notes:'Raw catalog note',sourcePersonUrls:['https://example.com/person']};
 const state={schemaVersion:1,cards:{[id]:card},statuses:{[id]:'owned'},details:{[id]:{qty:2,ownedQty:1,transitQty:1,manualStatus:true,notes:'Preserve signed copy'}},imports:{original:{cardId:id}},criteria:{keep:true}};
 const before=JSON.stringify(state),[view]=P.cards('basketball',state);
 assert.equal(view.id,id);assert.equal(view.year,card.year);assert.equal(view.product,card.product);assert.equal(view.cardSet,card.cardSet);assert.equal(view.subject,card.subject);assert.equal(view.copies,'10');assert.equal(view.isAuto,'Yes');
 assert.equal(view.players.length,3);assert.equal(view.player,view.players[0]);assert.equal(P.roster([view])[view.players[2]].name,'Maria Gakdeng');
 assert.deepEqual(view.sourcePersonUrls,card.sourcePersonUrls);view.sourcePersonUrls.push('view-only');assert.equal(JSON.stringify(state),before);
 for(const field of ['qty','ownedQty','transitQty','wantedQty'])assert.equal(Object.hasOwn(view,field),false);
});

test('player keys are derived from complete subjects independently of card order and never renumber card IDs',()=>{
 const a={id:12,year:2024,product:'Select',cardNumber:'1',cardSet:'Base',subject:'Dale Earnhardt'},b={...a,id:13,subject:'Dale Earnhardt Jr.'};
 const forward=P.cards('racing',[a,b]),reverse=P.cards('racing',[b,a]);
 assert.equal(forward[0].id,12);assert.equal(forward[0].player,reverse[1].player);assert.notEqual(forward[0].player,forward[1].player);
 assert.equal(P.roster(forward)[forward[1].player].name,'Dale Earnhardt Jr.');
});

test('TCDB multi-person separators preserve each complete name and the single shared card identity',()=>{
 const originals=[{id:'tcdb:10176805',subject:'Kyle Busch/Daniel Suarez'},{id:'tcdb:4899615',subject:'Kevin Harvick /Mark Martin'},{id:'tcdb:3',subject:'Dale Earnhardt Jr.|Dale Earnhardt'}];
 const before=JSON.stringify(originals),views=P.cards('racing',originals);
 const names=[['Kyle Busch','Daniel Suarez'],['Kevin Harvick','Mark Martin'],['Dale Earnhardt Jr.','Dale Earnhardt']];
 views.forEach((card,index)=>{
  assert.equal(card.id,originals[index].id);assert.equal(card.subject,originals[index].subject);
  assert.deepEqual(card.subjects,names[index]);assert.deepEqual(card.players,names[index].map(P.personKey));
  assert.deepEqual(P.subjectNames(card),names[index]);assert.equal(P.roster([card])[card.players[1]].name,names[index][1]);
 });
 assert.equal(JSON.stringify(originals),before);
});

test('flags use explicit metadata and cannot infer ownership or rookie status from year or player',()=>{
 const cards=P.cards('racing',[{id:'a',product:'2026 Select',cardNumber:'1',subject:'Ryan Blaney',isAuto:false,attributes:'AU, RC, MEM'},
 {id:'b',year:2026,product:'Select',subject:'New Driver',isRC:'',isRookie:true,isRelic:true,printRun:99,copies:''},
 {id:'c',year:2026,product:'Select',subject:'New Driver'}]);
 assert.equal(cards[0].isAuto,'No');assert.equal(cards[0].isRC,'Yes');assert.equal(cards[0].isMem,'Yes');assert.equal(cards[0].year,'2026');
 assert.equal(cards[1].isRC,'Yes');assert.equal(cards[1].isMem,'Yes');assert.equal(cards[1].copies,'99');
 assert.equal(cards[2].isRC,'');assert.equal(cards[2].isAuto,'');
});

test('source URLs are preserved from direct fields or nested sources without unsafe links',()=>{
 const cards=P.cards('other',[{id:'a',subject:'Phil Ivey',sources:[{url:'https://www.tcdb.com/ViewCard.cfm/cid/1'}]},
 {id:'b',subject:'Phil Ivey',sourceUrl:'javascript:bad()',sources:{capture:{sourceUrl:'https://www.comc.com/item/12'}}},
 {id:'c',subject:'Phil Ivey',sourceUrl:'https://username:secret@example.com/'}]);
 assert.equal(cards[0].sourceUrl,'https://www.tcdb.com/ViewCard.cfm/cid/1');assert.equal(cards[1].sourceUrl,'https://www.comc.com/item/12');assert.equal(cards[1].tcdbUrl,'');assert.equal(cards[2].sourceUrl,'');
});

test('mismatched, duplicate, unsafe and imprecise catalog IDs fail before producing a replacement',()=>{
 for(const input of [{cards:{'tcdb:1':{id:'tcdb:2'}}},[{id:'same'},{id:'same'}],[{id:9007199254740992}],[{id:'__proto__'}]])assert.throws(()=>P.cards('racing',input),/identity/);
 assert.equal(P.cards('racing',{cards:{'tcdb:1':{subject:'Ryan Blaney'}}})[0].id,'tcdb:1');
});

test('Tyler and Tempo card schemas and roster keys remain unchanged',()=>{
 const tempo=[{id:1,year:2026,product:'Prizm',player:'rice',isAuto:true,isRC:'Yes'}],tb=[{id:2,product:'2024 Topps',copies:'25'}];
 assert.deepEqual(P.cards('wnba',tempo),tempo);assert.deepEqual(P.cards('tb',tb),tb);
 assert.equal(P.roster(tempo,{rice:{name:'Kiki Rice',team:'Toronto Tempo'}}).rice.name,'Kiki Rice');
});

test('sport price lookups use exact existing card IDs without borrowing subject or legacy title keys',()=>{
 const H=require('../price-history-utils');
 const cards=P.cards('racing',[{id:'tcdb:9007199254740993123',year:2024,product:'Select',cardNumber:'1',cardSet:'Gold',subject:'Ryan Blaney'},
 {id:'tcdb:other-driver',year:2024,product:'Select',cardNumber:'1',cardSet:'Gold',subject:'Chase Elliott'}]);
 const price={price:10,currency:'USD',kind:'asking',source:'eBay',date:'2026-11-19'};
 const history={[cards[0].id]:[price],[cards[1].id]:[{...price,price:25}],'Sele|Select|1|Gold':[{...price,price:99}]};
 for(const card of cards){assert.equal(H.cardKey(card),card.id);assert.equal(H.legacyCardKey(card),card.id);assert.deepEqual(H.cardKeys(card,cards),[card.id]);}
 assert.deepEqual(H.entriesForCard(history,cards[0],cards).map(e=>e.price),[10]);assert.deepEqual(H.entriesForCard(history,cards[1],cards).map(e=>e.price),[25]);
 assert.equal(H.cardKey({id:7,product:'2021 Bowman',cardNumber:'10',cardSet:'Base'}),'2021|2021 Bowman|10|Base');
 assert.match(H.cardKey({id:7,year:2026,product:'Prizm',cardNumber:'10',cardSet:'Base',player:'rice'}),/subject:rice$/);
});

test('invalid scoped card IDs cannot fall back to a title history key',()=>{const H=require('../price-history-utils');for(const id of [null,'__proto__',9007199254740992]){const c={id,collectionScope:'racing',product:'2024 Select',cardNumber:'1',cardSet:'Base'};assert.equal(H.cardKey(c),null);assert.equal(H.legacyCardKey(c),null);assert.deepEqual(H.cardKeys(c,[c]),[]);}});
