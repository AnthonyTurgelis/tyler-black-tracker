const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require.resolve('../tracker.jsx'),'utf8'),Profile=require('../collection-profile.js'),Copies=require('../copy-utils.js');
const allCards=[{id:'tcdb:11',year:2025,product:'Panini Prizm',cardNumber:'7',cardSet:'Base',player:'a',subject:'Alice Driver',isRC:''},{id:'tcdb:12',year:2026,product:'Press Pass',cardNumber:'8',cardSet:'Gold',player:'b',subject:'Bob Driver',isRC:''}];
const statuses={'tcdb:11':'owned','tcdb:12':'in_transit'},details={};
function scopedHarness(name,cutoff,returned,mode="racing") {
 let slots=[],cursor=0,effects=[];const equal=(a,b)=>a&&b&&a.length===b.length&&a.every((v,i)=>Object.is(v,b[i]));
 const hook={useState:init=>{const i=cursor++;if(!slots[i])slots[i]={value:typeof init==='function'?init():init};return [slots[i].value,value=>{slots[i].value=typeof value==='function'?value(slots[i].value):value;}];},useRef:init=>{const i=cursor++;return slots[i]||(slots[i]={current:init});},useMemo:(fn,deps)=>{const i=cursor++;if(!slots[i]||!equal(slots[i].deps,deps))slots[i]={value:fn(),deps};return slots[i].value;},useEffect:(fn,deps)=>{const i=cursor++;if(!slots[i]||!equal(slots[i].deps,deps)){slots[i]={deps};effects.push(fn);}}};
 const ctx={...hook,window:{MODE:mode,CollectionProfile:Profile,CopyInventory:Copies,TEMPO_ROSTER:{}},ALL_CARDS:allCards,HIDDEN_DUPES:new Set(),SSP_TAGS:{},useTrackerMode:()=> mode,useCatalogRevision:()=>1,cardYear:c=>String(c.year),cardPlayers:c=>[c.player],cardHasPlayer:(c,p)=>c.player===p,inChecklist:()=>true,matchesCatalogScope:()=>true,collectionCardState:(id,s,d,c)=>c?.[id]||Copies.summarizeCard(null,id,s,d),getCardQty:()=>1};
 vm.createContext(ctx);vm.runInContext(source.slice(source.indexOf('function panelCardSubject('),source.indexOf('function ProgressBar(')),ctx);
 const start=source.indexOf('function '+name+'('),end=source.indexOf(cutoff,start);assert.ok(start>=0&&end>start);vm.runInContext(source.slice(start,end)+'\nreturn {'+returned+'};\n}',ctx);
 return {render(props={}){let result;const run=()=>{cursor=0;effects=[];result=ctx[name]({statuses,cardDetails:details,copySummaries:null,needsSync:new Set(),...props});};run();if(effects.length){const queue=effects;effects=[];queue.forEach(fn=>fn());run();}return result;}};
}
test('summary uses only the selected segment and resets stale serial/rookie filters on segment changes',()=>{
 const h=scopedHarness('SummaryPanel','\n  function pctColor(','stats,playerList,setSnMin,setRookieOnly');const first=[allCards[0]],second=[allCards[1]],before=JSON.stringify(allCards);
 let v=h.render({cards:first,browseKey:'a'});assert.equal(v.stats.total,1);assert.equal(v.stats.owned,1);assert.deepEqual(Array.from(v.playerList,p=>p.key),['a']);
 v.setRookieOnly(true);assert.equal(h.render({cards:first,browseKey:'a'}).stats.total,0);
 v=h.render({cards:second,browseKey:'b'});assert.equal(v.stats.total,1);assert.equal(v.stats.owned,0);assert.equal(v.stats.transit,1);assert.deepEqual(Array.from(v.playerList,p=>p.key),['b']);assert.equal(JSON.stringify(allCards),before);
 const legacy=scopedHarness('SummaryPanel','\n  function pctColor(','stats').render();assert.equal(legacy.stats.total,2);
});
test('lookup number choices and subject options follow segment cards and clear stale selections',()=>{
 const h=scopedHarness('CardLookupPanel','\n  function toggleProduct(','allNumbers,playerNameByKey,cardsForNum,setSelectedNum,setLookupPlayer,selectedNum,lookupPlayer');const first=[allCards[0]],second=[allCards[1]];
 let v=h.render({cards:first,browseKey:'a'});assert.deepEqual(Array.from(v.allNumbers,n=>n[0]),['7']);assert.deepEqual(Object.keys(v.playerNameByKey),['a']);v.setSelectedNum('7');v.setLookupPlayer('a');assert.equal(h.render({cards:first,browseKey:'a'}).cardsForNum.length,1);
 v=h.render({cards:second,browseKey:'b'});assert.equal(v.selectedNum,null);assert.equal(v.lookupPlayer,'all');assert.deepEqual(Array.from(v.allNumbers,n=>n[0]),['8']);assert.deepEqual(Object.keys(v.playerNameByKey),['b']);
});
test('detailed options and results stay inside the segment after resetting local athlete/year/search filters',()=>{
 const h=scopedHarness('DetailedPanel','\n  function colHeader(','filtered,years,filteredProducts,viewRoster,setDYear,setDPlayer,setDSearch');const first=[allCards[0]],second=[allCards[1]];
 let v=h.render({cards:first,browseKey:'a'});assert.deepEqual(Array.from(v.filtered,c=>c.id),['tcdb:11']);v.setDYear('2025');v.setDPlayer('a');v.setDSearch('Alice');assert.equal(h.render({cards:first,browseKey:'a'}).filtered.length,1);
 v=h.render({cards:second,browseKey:'b'});assert.deepEqual(Array.from(v.filtered,c=>c.id),['tcdb:12']);assert.deepEqual(Array.from(v.years),['2026']);assert.deepEqual(Array.from(v.filteredProducts),['Press Pass']);assert.deepEqual(Object.keys(v.viewRoster),['b']);
 const outside=h.render({cards:second,browseKey:'b',initialCardId:'tcdb:11'});assert.deepEqual(Array.from(outside.filtered,c=>c.id),['tcdb:12']);
});

test('summary driver clicks use the shared filter callback and never create hidden sport-local filters',()=>{
 const selected=[],h=scopedHarness('SummaryPanel','\n  function pctColor(','stats,selectedPlayer,selectSummarySubject,setSelectedPlayer');
 let v=h.render({cards:allCards,browseKey:'all',onSelectSubject:key=>selected.push(key)});v.selectSummarySubject('b');assert.deepEqual(selected,['b']);
 v=h.render({cards:allCards,browseKey:'all',onSelectSubject:key=>selected.push(key)});assert.equal(v.selectedPlayer,null);assert.equal(v.stats.total,2);
 v.setSelectedPlayer('a');v=h.render({cards:allCards,browseKey:'all'});assert.equal(v.stats.total,2);
 const tempo=scopedHarness('SummaryPanel','\n  function pctColor(','stats,selectedPlayer,selectSummarySubject','wnba');
 let t=tempo.render({cards:allCards,onSelectSubject:()=>assert.fail('Tempo retains its local selector')});t.selectSummarySubject('a');t=tempo.render({cards:allCards});assert.equal(t.selectedPlayer,'a');assert.equal(t.stats.total,1);t.selectSummarySubject('a');t=tempo.render({cards:allCards});assert.equal(t.selectedPlayer,null);assert.equal(t.stats.total,2);
});
