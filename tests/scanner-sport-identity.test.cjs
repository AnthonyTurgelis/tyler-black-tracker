const test=require('node:test'),assert=require('node:assert/strict');
const S=require('../scanner-utils'),U=require('../collection-market-utils');
const base={id:'tcdb:base',year:2024,product:'Panini Select',cardNumber:'55',cardSet:'Base',subject:'Ryan Blaney'};
const gold={...base,id:'tcdb:gold',cardSet:'Gold',printRun:'10'};
const teammate={...base,id:'tcdb:teammate',subject:'Chase Elliott'};
const dual={id:'tcdb:dual',year:2024,product:'Panini National Treasures',cardNumber:'DM-1',cardSet:'Dual Materials',subject:'Ryan Blaney / Chase Elliott'};

test('a real multi-driver card requires all named subjects, and each physical card remains one match',()=>{
 const cards=[base,teammate,dual];
 const p=S.parseTitle('2024 Panini National Treasures - Dual Materials #DM-1 Chase Elliott / Ryan Blaney',{cards});
 assert.equal(p.subjectAmbiguous,false);assert.equal(S.match(p,cards).card.id,dual.id);
 assert.equal(S.match(S.parseTitle('2024 Panini National Treasures - Dual Materials #DM-1 Ryan Blaney',{cards}),cards),null);
 assert.equal(S.match(S.parseTitle('2024 Panini Select #55 Ryan Blaney / Chase Elliott',{cards}),cards),null);
 const row={...p,subject:'Chase Elliott / Ryan Blaney',price:'12',rawPrice:'US $12',currency:'USD',recordType:'listing'};
 assert.equal(U.review(row,dual).ok,true);assert.equal(U.review({...row,subject:'Ryan Blaney'},dual,{manual:true,identityConfirmed:true}).ok,false);
});

test('explicit subject arrays work without borrowing partial roster membership',()=>{
 const joint={...dual,subject:undefined,subjects:['Ryan Blaney','Chase Elliott']};
 assert.equal(S.subject(joint),'Ryan Blaney / Chase Elliott');
 assert.equal(S.match(S.parseTitle('2024 Panini National Treasures - Dual Materials #DM-1 Ryan Blaney Chase Elliott',{cards:[joint]}),[joint]).card.id,joint.id);
});

test('season-year cards preserve both years and cannot match another season',()=>{
 const card={id:'tcdb:season',year:'2022-23',product:'Leaf Multigraphics',cardNumber:'TG-16',cardSet:'Tri-Graphics Autographs Blue Crystal',subject:'NaLyssa Smith / Aneesah Morrow / Maria Gakdeng'};
 const p=S.parseTitle('2022-23 Leaf Multigraphics - Tri-Graphics Autographs Blue Crystal #TG-16 NaLyssa Smith / Aneesah Morrow / Maria Gakdeng',{cards:[card]});
 assert.equal(p.year,'2022-23');assert.equal(S.match(p,[card]).card.id,card.id);assert.equal(S.match({...p,year:'2022'},[card]),null);
});

test('a wanted base or Gold card is never substituted for an absent Zebra or Gold Vinyl variant',()=>{
 for(const suffix of ['Zebra','Gold Vinyl /10','Gold Shimmer /10','Blue Velocity /10']){
  const p=S.parseTitle('2024 Panini Select #55 Ryan Blaney '+suffix,{cards:[base,gold]});
  assert.equal(S.match(p,[base,gold]),null,suffix);
 }
 assert.equal(S.match(S.parseTitle('2024 Panini Select #55 Ryan Blaney Gold /10',{cards:[base,gold]}),[base,gold]).card.id,gold.id);
});

test('explicit variant fields cannot suppress contradictory raw title parallels or plates',()=>{
 const titles=[
  '2024 Panini Select - Base #55 Ryan Blaney Zebra',
  '2024 Panini Select - Gold #55 Ryan Blaney Gold Vinyl /10',
  '2024 Panini Select - Gold #55 Ryan Blaney Printing Plate Cyan /10',
  '2024 Panini Select - Base #55 Ryan Blaney Printing Plates Magenta',
  '2024 Panini Select - Base #55 Ryan Blaney Superfractor'
 ];
 for(const title of titles){
  const parsed=S.parseTitle(title,{cards:[base,gold]});
  assert.ok(parsed.variant);assert.equal(S.match(parsed,[base,gold]),null,title);
 }
 const plate={...base,id:'tcdb:plate-cyan',cardSet:'Printing Plate Cyan',printRun:'1'};
 const correct=S.parseTitle('2024 Panini Select - Printing Plate Cyan #55 Ryan Blaney 1/1',{cards:[base,gold,plate]});
 assert.equal(S.match(correct,[base,gold,plate]).card.id,plate.id);
 assert.equal(S.match({...correct,rawSet:correct.rawSet+' Magenta'},[base,gold,plate]),null);
 assert.equal(U.review({...correct,price:'25',rawPrice:'US $25',currency:'USD',recordType:'listing'},plate).ok,false,'one-of-one still requires manual confirmation');
});

test('product words remove only one occurrence so same-word parallels remain visible',()=>{
 for(const [product,parallel] of [['Panini Prizm','Prizm'],['Panini Gold Standard','Gold']]){
  const card={...base,product};
  const ordinary=S.parseTitle('2024 '+product+' #55 Ryan Blaney',{cards:[card]});
  assert.equal(S.match(ordinary,[card]).card.id,card.id);
  const variant=S.parseTitle('2024 '+product+' #55 Ryan Blaney '+parallel,{cards:[card]});
  assert.equal(S.match(variant,[card]),null,product);
 }
});

test('numeric variant names remain distinct while explicit print-run suffixes normalize',()=>{
 const numbered={...base,id:'tcdb:base2',cardSet:'Base 2'};
 const p=S.parseTitle('2024 Panini Select - Base 2 #55 Ryan Blaney',{cards:[base,numbered]});
 assert.equal(S.match(p,[base]),null);assert.equal(S.match(p,[base,numbered]).card.id,numbered.id);
 const runLabel={...gold,cardSet:'Gold /10'};
 assert.equal(S.match(S.parseTitle('2024 Panini Select - Gold #55 Ryan Blaney /10',{cards:[runLabel]}),[runLabel]).card.id,gold.id);
});

test('incomplete titles get review suggestions without acquiring an exact card assignment',()=>{
 const p=S.parseTitle('2024 Panini Select Ryan Blaney Gold /10',{cards:[base,gold,teammate]});
 assert.equal(S.match(p,[base,gold,teammate]),null);
 const choices=S.candidates(p,[base,gold,teammate]);assert.equal(choices.length,2);assert(choices.every(item=>item.requiresReview));assert(choices.every(item=>item.card.subject==='Ryan Blaney'));
 assert.equal(S.candidates({...p,year:'2020'},[base,gold,teammate]).length,0);
 assert.equal(S.candidates({...p,cardNo:'99'},[base,gold,teammate]).length,0);
});

test('source shortcuts follow the actual card identity and reject unsafe source links',()=>{
 const links=U.searchLinks({...dual,sourceUrl:'javascript:bad()'});
 for(const key of ['ebay','comc','whatnot']){const url=new URL(links[key]);assert.equal(url.protocol,'https:');assert.match(decodeURIComponent(url.href),/Ryan Blaney/);assert.match(decodeURIComponent(url.href),/Chase Elliott/);assert.match(decodeURIComponent(url.href),/DM-1/);}
 assert.equal(links.tcdb,'');assert.doesNotMatch(JSON.stringify(links),/Tyler Black/);
});

test('COMC credit payments never become card rows even with a destination and explicit USD amount',()=>{
 const rows=S.parseListings('COMC Store Credit\nOrder date: November 19, 2026\nPayment US $100.00\nShip to: Canada',{source:'COMC',cards:[base,gold],recordType:'purchase'});
 assert.deepEqual(rows,[]);
});

test('distinct order destinations preserve each card currency while explicit item USD beats CAD settlement',()=>{
 const text='Time placed: November 18, 2026\nOrder number: order-ca\nShip to: Canada\n2024 Panini Select #55 Ryan Blaney\nItem price: $12.00\nTime placed: November 18, 2026\nOrder number: order-us\nShip to: United States\n2024 Panini Select #55 Chase Elliott\nItem price: $14.00';
 const rows=S.parseListings(text,{source:'eBay',cards:[base,teammate]});assert.equal(rows.length,2);assert.equal(rows[0].currency,'CAD');assert.equal(rows[1].currency,'USD');
 const [paid]=S.parseListings('2024 Panini Select #55 Ryan Blaney\nItem price: US $42.00\nOrder total: US $48.76\nCharged: C $71.23\nOrder number: order-fx\nShip to: Canada',{source:'eBay',cards:[base]});assert.equal(paid.currency,'USD');assert.equal(paid.price,'42');assert.equal(paid.settlement.currency,'CAD');assert.equal(paid.settlement.amount,71.23);
});
