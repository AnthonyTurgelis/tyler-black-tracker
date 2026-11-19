const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../tracker.jsx'),'utf8');
test('all main tab navigation preserves an open or saving copy editor',()=>{
 const match=source.match(/const setActiveTab = useCallback\(function\(next\) \{([\s\S]*?)\}, \[activeTab\]\);/);assert(match);
 let pending=true,tab='copies',notice='';const fn=new Function('window','privatePanelHasEdits','activeTab','setActiveTabState','setSaveToast','return function(next){'+match[1]+'};')({MODE:'tb',CopyInventoryPanel:{hasPending:()=>pending}},()=>pending,'copies',next=>tab=next,text=>notice=text);
 assert.equal(fn('gallery'),false);assert.equal(tab,'copies');assert.match(notice,/Save or cancel/);assert.equal(fn('copies'),true);assert.equal(tab,'copies');pending=false;assert.equal(fn('gallery'),true);assert.equal(tab,'gallery');
 assert(source.includes('if (setActiveTab(t.id) && t.id === "copies" && !window.CopyInventoryPanel?.hasPending()) setCopyCardId(null);'));
});
test('switching collections detects pending copied-card, market and image editors as well as IP and receipts',()=>{
 const match=source.match(/function privatePanelHasEdits\(\) \{[^\n]+\}/);assert(match);
 const names=['CardCatalogPanel','trackerModes','CopyInventoryPanel','SportCollectionWorkspace','CollectionMarketScanner','CollectionPricesPanel','CollectionMediaEditor','AutographPanel','PurchaseReceiptsPanel'];
 for(const name of names){const w={[name]:{hasPending:()=>true}};assert.equal(new Function('window',match[0]+';return privatePanelHasEdits();')(w),true,name);}
 assert.equal(new Function('window',match[0]+';return privatePanelHasEdits();')({}),false);
});
