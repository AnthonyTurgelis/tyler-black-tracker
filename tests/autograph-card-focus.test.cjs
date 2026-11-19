const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require.resolve('../autograph-panel.jsx'),'utf8');
const hook=source.slice(source.indexOf('  function useAutographCardFocus('),source.indexOf('  function AutographPanel('));
function fixture(){
 let cursor=0;const slots=[],effects=[],focused=[];
 const same=(a,b)=>a&&a.length===b.length&&a.every((v,i)=>v===b[i]);
 const React={
  useState(initial){const i=cursor++;if(!slots[i])slots[i]={value:typeof initial==='function'?initial():initial};return [slots[i].value,next=>{slots[i].value=typeof next==='function'?next(slots[i].value):next;}];},
  useRef(initial){const i=cursor++;if(!slots[i])slots[i]={current:initial};return slots[i];},
  useEffect(fn,deps){const i=cursor++;if(!slots[i]||!same(slots[i].deps,deps)){slots[i]={deps};effects.push(fn);}}
 };
 const context={React};vm.createContext(context);vm.runInContext(hook,context);
 let props={scope:'racing',initialCardId:'tcdb:blaney',active:true,blocked:false,onFocus:id=>focused.push(id)};
 function render(change={}){props={...props,...change};cursor=0;const result=context.useAutographCardFocus(props);for(const effect of effects.splice(0))effect();return result;}
 return {render,focused};
}
test('an exact autograph card request applies once and clearing focus stays cleared',()=>{
 const f=fixture();f.render();assert.equal(f.render()[0],'tcdb:blaney');assert.deepEqual(f.focused,['tcdb:blaney']);
 f.render()[1]('');assert.equal(f.render()[0],'');assert.deepEqual(f.focused,['tcdb:blaney']);
 f.render({initialCardId:'tcdb:palou'});assert.equal(f.render()[0],'tcdb:palou');
});
test('a new card focus waits for the pending draft or save without replacing it',()=>{
 const f=fixture();f.render();f.render({blocked:true,initialCardId:'tcdb:palou'});
 assert.equal(f.render()[0],'tcdb:blaney');assert.deepEqual(f.focused,['tcdb:blaney']);
 f.render({blocked:false});assert.equal(f.render()[0],'tcdb:palou');assert.deepEqual(f.focused,['tcdb:blaney','tcdb:palou']);
});
test('hidden autofocus requests wait until the autograph tab is active',()=>{
 const f=fixture();f.render();f.render({active:false,initialCardId:'tcdb:palou'});assert.equal(f.render()[0],'tcdb:blaney');
 f.render({active:true});assert.equal(f.render()[0],'tcdb:palou');
});
test('autograph defaults use the exact selected card without acquiring another copy',()=>{
 const start=source.indexOf('  function blank('),end=source.indexOf('\n  function useAutographCardFocus(',start);
 const context={subject:card=>card?.subject||''};vm.createContext(context);vm.runInContext(source.slice(start,end),context);
 const card={id:'tcdb:9007199254740993123',subject:'Ryan Blaney'},draft=context.blank(card);
 assert.equal(draft.cardId,card.id);assert.equal(draft.signer,'Ryan Blaney');assert.equal(draft.status,'target');assert.equal(draft.copyId,'');
 for(const name of ['owned','quantity','qty','transitQty'])assert.equal(Object.hasOwn(draft,name),false);
});
