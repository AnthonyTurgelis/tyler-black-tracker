const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../media-panel.jsx'),'utf8');
const window={TEMPO_ROSTER:{sykes:{name:'Brittney Sykes'}},CollectionProfile:require('../collection-profile.js')};
vm.runInNewContext(source.slice(0,source.indexOf('function CardPhotoThumbnail('))+'window.labels={subject:mediaCardSubject,product:mediaCardProduct,label:mediaCardLabel};',{window});
const L=window.labels;
test('gallery, reference and COMC duplicate labels distinguish subjects on matching card numbers',()=>{
 const base={year:2024,product:'National Treasures',cardNumber:'10',cardSet:'Gold'};
 assert.equal(L.label({...base,subject:'Ryan Blaney'}),'Ryan Blaney · 2024 National Treasures · #10 · Gold');
 assert.notEqual(L.label({...base,subject:'Ryan Blaney'}),L.label({...base,subject:'Kyle Larson'}));
});
test('media resolves WNBA roster names and multi-subject cards',()=>{
 assert.equal(L.subject({player:'sykes'}),'Brittney Sykes');
 assert.equal(L.subject({subjects:['Ryan Blaney','Kyle Larson']}),'Ryan Blaney / Kyle Larson');
});
test('existing Tyler product labels remain unchanged and separate seasons are shown once',()=>{
 const tb={product:'2024 Topps Chrome',cardNumber:'RA-TB',cardSet:'Gold'};
 assert.equal(L.label(tb),'2024 Topps Chrome · #RA-TB · Gold');
 assert.equal(L.product({year:'2024-25',product:'2024-25 Upper Deck'}),'2024-25 Upper Deck');
 assert.equal(L.product({year:'2024-25',product:'Upper Deck'}),'2024-25 Upper Deck');
});
