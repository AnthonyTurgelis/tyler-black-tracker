const test=require('node:test'),assert=require('node:assert/strict');
const S=require('../collection-segments.js'),P=require('../collection-profile.js');
const cards=(rows,mode='racing')=>P.cards(mode,rows.map((row,i)=>({id:'tcdb:'+(i+1),year:2025,product:'Select',cardNumber:String(i+1),cardSet:'Base',...row})));
const group=(id,subjects=[],extra={})=>({id,label:id,sport:'racing',rules:[{subjects,anyOf:[]}],...extra});
const counts=index=>Object.fromEntries(index.groups.map(group=>[group.id,group.count]));

test('saved criteria groups merge for browsing without applying card-type or year qualification',()=>{
 const catalog=cards([{subject:'Daniel Suárez',year:2018},{subject:'Joey Logano'},{subject:'Kasey Kahne'},{subject:'Alex Labbé',year:2026},{subject:'Unknown Driver'}]);
 const criteria={groups:[group('coke-primary',['Daniel Suarez']),group('coke-secondary',['Joey Logano']),group('coke-brands',['Kasey Kahne']),group('dirt-primary',['Kasey Kahne']),group('canadian-rookies',[],{rules:[{subjects:['Alex Labbe'],yearMin:2021,yearMax:2021,anyOf:[{feature:'rookie'}]}]})]};
 const before=JSON.stringify({catalog,criteria}),index=S.build(catalog,'racing',criteria);
 assert.deepEqual(counts(index),{all:5,'coca-cola':3,'dirt-racing':1,'canadian-drivers':1,ungrouped:1});
 assert.equal(index.groups.find(group=>group.id==='canadian-drivers').label,'Canadian Drivers');
 assert.deepEqual(index.byCard['tcdb:3'],['coca-cola','dirt-racing']);
 assert.equal(S.select(catalog,index,'canadian-drivers')[0].isRC,'');assert.equal(JSON.stringify({catalog,criteria}),before);
});

test('all mapped focus labels and overlaps remain distinct from verified card claims',()=>{
 const catalog=cards([{subject:'Focus Driver',isRC:'No',isAuto:'No'}]);
 const criteria={groups:['coke-primary','coke-secondary','coke-brands','dirt-primary','dirt-secondary','indycar','energy-primary','energy-secondary','bodyarmor','canadian-rookies','trackhouse','other-drivers'].map(id=>group(id,['Focus Driver']))};
 const index=S.build(catalog,'racing',criteria);
 assert.deepEqual(index.groups.map(group=>group.label),['All','Coca-Cola','Dirt Racing','IndyCar','Monster / NOS','BodyArmor','Canadian Drivers','Trackhouse','Johnson / Muniz']);
 assert.ok(index.groups.every(group=>group.count===1));assert.equal(index.byCard[catalog[0].id].length,8);
 for(const field of ['criteriaEvidence','rookieVerified','owned','qty','inTransit'])assert.equal(Object.hasOwn(catalog[0],field),false);
});

test('exact full names tolerate accents and punctuation but never suffix or surname matching',()=>{
 const catalog=cards([{subject:'J. J. Yeley'},{subject:'JJ Yeley Jr.'},{subject:'Yeley'},{subject:'Dale Earnhardt Jr.'},{subject:'Dale Earnhardt'},{subject:'Daniel Suárez / Other Person'}]);
 const criteria={groups:[group('coke-primary',['JJ Yeley','Dale Earnhardt','Daniel Suarez'])]};
 const selected=S.select(catalog,S.build(catalog,'racing',criteria),'coca-cola');
 assert.deepEqual(selected.map(card=>card.id),['tcdb:1','tcdb:5','tcdb:6']);
});

test('explicit metadata works without private criteria and avoids nickname and card-number false positives',()=>{
 const catalog=cards([
  {subject:'Driver',product:'World of Outlaws'},
  {subject:'Driver',cardSet:'Dirt Track Treads'},
  {subject:'Driver',product:"Van’s Games Sprint Cars"},
  {subject:'Hailie Deegan',cardSet:'Dirt Princess'},
  {subject:'Driver',product:'CART'},
  {subject:'Driver',discipline:'IndyCar'},
  {subject:'Driver',product:'Topps Formula 1'},
  {subject:'Driver',title:'2025 Select #F1 Driver'},
  {subject:'Driver',product:'Coca-Cola Racing'},
  {subject:'Driver',title:'Monster Energy Series Patch'},
  {subject:'Driver',sponsor:'BodyArmor'},
  {subject:'Driver',team:'Trackhouse'},
  {subject:'Player',functionalSport:'poker'},
  {subject:'Driver',product:'Monsters of Racing'}
 ]);
 const index=S.build(catalog,'racing',null);
 assert.equal(counts(index)['dirt-racing'],3);assert.equal(counts(index).indycar,2);assert.equal(counts(index).f1,1);
 assert.equal(counts(index)['coca-cola'],1);assert.equal(counts(index)['monster-nos'],1);assert.equal(counts(index).bodyarmor,1);assert.equal(counts(index).trackhouse,1);assert.equal(counts(index).poker,1);assert.equal(counts(index).ungrouped,3);
 for(const id of ['tcdb:4','tcdb:8','tcdb:14'])assert.deepEqual(index.byCard[id],['ungrouped']);
});

test('non-sport Coca-Cola and Poker metadata groups work without racing subject inference',()=>{
 const catalog=cards([{subject:'Santa Claus',product:'Coca-Cola Playing Cards'},{subject:'Poker Player',discipline:'Poker'},{subject:'Driver',product:'Unknown'}],'other');
 const criteria={groups:[group('dirt-primary',['Driver'])]},index=S.build(catalog,'other',criteria);
 assert.deepEqual(counts(index),{all:3,'coca-cola':1,poker:1,ungrouped:1});
});

test('preserved source categories provide explicit Poker and racing discipline cues',()=>{
 const catalog=cards([{subject:'Person One',sourceCategory:'Poker'},{subject:'Person Two',sourceSport:'Poker'},{subject:'Person Three',sourceCategory:'IndyCar'},{subject:'Poker Expert',sourceSport:'Multi-Sport'}],'other');
 const index=S.build(catalog,'other',null);
 assert.deepEqual(counts(index),{all:4,indycar:1,poker:2,ungrouped:1});
 assert.deepEqual(index.byCard['tcdb:4'],['ungrouped'],'subject text alone does not establish a discipline');
});

test('Rittenhouse IRL products identify IndyCar without interpreting unrelated IRL title acronyms',()=>{
 const catalog=cards([{subject:'Dario Franchitti',product:'Rittenhouse IRL'},{subject:'Dario Franchitti',product:'2007 Rittenhouse IRL',cardSet:'Shades of Victory'},{subject:'Person',product:'Example',title:'An IRL memory'},{subject:'Person',product:'Life IRL'}]);
 const index=S.build(catalog,'racing',null);
 assert.deepEqual(counts(index),{all:4,indycar:2,ungrouped:2});assert.deepEqual(S.select(catalog,index,'indycar').map(card=>card.id),['tcdb:1','tcdb:2']);
});

test('subjectless criteria require explicit brand or discipline text and never recruit a whole catalog',()=>{
 const catalog=cards([{subject:'Unknown',title:'Sponsor Example Patch'},{subject:'Unknown'},{subject:'Unknown',discipline:'Example Racing'}]);
 const criteria={groups:[group('custom-brand',[],{rules:[{subjects:[],anyOf:[{feature:'brandPatch',brand:'Sponsor Example'}]}]}),group('custom-discipline',[],{rules:[{subjects:[],anyOf:[{feature:'discipline',value:'Example Racing'}]}]}),group('custom-rc',[],{rules:[{subjects:[],anyOf:[{feature:'rookie'}]}]})]};
 assert.deepEqual(counts(S.build(catalog,'racing',criteria)),{all:3,'custom-brand':1,'custom-discipline':1,ungrouped:1});
});

test('segment and exact player filtering preserve multi-person membership and count unique card IDs',()=>{
 const catalog=cards([{id:'tcdb:9007199254740993123',subject:'Ryan Blaney / Chase Elliott'},{id:'001',subject:'Ryan Blaney'},{id:1,subject:'Chase Elliott'},{id:'tcdb:4',subject:'Ryan Blaney Jr.'}]);
 const repeated=[...catalog,catalog[0]],index=S.build(repeated,'racing',{groups:[group('bodyarmor',['Ryan Blaney'])]});
 assert.equal(counts(index).all,4);assert.equal(counts(index).bodyarmor,2);
 const people=S.subjects(repeated),ryan=people.find(person=>person.name==='Ryan Blaney'),chase=people.find(person=>person.name==='Chase Elliott');
 assert.equal(ryan.count,2);assert.equal(chase.count,2);assert.equal(ryan.key,P.players(catalog[0])[0]);
 assert.deepEqual(S.select(repeated,index,'bodyarmor',chase.key).map(card=>card.id),['tcdb:9007199254740993123']);
 assert.deepEqual(S.select(repeated,index,'all',ryan.key).map(card=>card.id),['tcdb:9007199254740993123','001']);
 assert.equal(S.select(repeated,index,'unknown').length,0);assert.equal(S.select(repeated,index,null,'missing').length,0);
});

test('unspaced TCDB slash subjects share one card across all matching focus and driver filters',()=>{
 const catalog=cards([{id:'tcdb:10176805',subject:'Kyle Busch/Daniel Suarez'},{id:'tcdb:4899615',subject:'Kevin Harvick /Mark Martin'}]);
 const criteria={groups:[group('coke-primary',['Daniel Suarez']),group('energy-primary',['Kyle Busch']),group('coke-brands',['Kevin Harvick']),group('coke-secondary',['Mark Martin'])]},index=S.build(catalog,'racing',criteria);
 assert.deepEqual(counts(index),{all:2,'coca-cola':2,'monster-nos':1});
 for(const card of catalog){for(const name of card.subjects){const found=S.select(catalog,index,'all',P.personKey(name));assert.equal(found.length,1);assert.equal(found[0],card);}}
 assert.equal(S.subjects(catalog).length,4);assert.equal(S.select(catalog,index,'coca-cola',P.personKey('Kyle Busch'))[0],catalog[0]);
 assert.deepEqual(new Set(index.byCard[catalog[0].id]),new Set(['coca-cola','monster-nos']));
});

test('empty input is safe and raw subject cards receive stable profile keys',()=>{
 assert.deepEqual(S.build([], 'racing', null).groups,[{id:'all',label:'All',count:0}]);
 assert.deepEqual(S.subjects([{id:'card:one',subject:'One Person'}]),[{key:P.personKey('One Person'),name:'One Person',count:1}]);
 assert.deepEqual(S.select([{id:'card:one',subject:'One Person'}],null,'all',P.personKey('One Person')).map(card=>card.id),['card:one']);
});
