const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const code = html.match(/<script id="tracker-bootstrap">([\s\S]*?)<\/script>/)[1];
function boot() {
  let ready=false, timer, observerCallback, cleared=false;
  const nodes={'bootstrap-notice':{hidden:true},'bootstrap-detail':{textContent:''},root:{}};
  const events={};
  const ctx={document:{getElementById:id=>nodes[id],querySelector:()=>ready?{}:null},window:{addEventListener:(event,fn)=>{events[event]=fn;}},setTimeout:fn=>{timer=fn;return 1;},clearTimeout:()=>{cleared=true;}};
  ctx.MutationObserver=ctx.window.MutationObserver=function(callback){observerCallback=callback;this.observe=()=>{};this.disconnect=()=>{};};
  vm.createContext(ctx);vm.runInContext(code,ctx);ctx.window.trackerBootstrap.observe();
  return {ctx,nodes,events,timeout:()=>timer(),complete:()=>{ready=true;observerCallback();},cleared:()=>cleared};
}
test('loading shell is visible before any blocking third-party script',()=>{
  assert(html.indexOf('id="root"')<html.indexOf('src="https://cdn.tailwindcss.com"'));
  assert(html.indexOf('id="bootstrap-notice"')<html.indexOf('src="https://unpkg.com/react@18'));
});
test('hung bootstrap presents retry without resolving storage or changing data',()=>{
  const app=boot();const pending=new Promise(()=>{});app.ctx.window.storageReady=pending;
  app.timeout();assert.equal(app.nodes['bootstrap-notice'].hidden,false);
  assert.match(app.nodes['bootstrap-detail'].textContent,/taking longer/);
  assert.equal(app.ctx.window.storageReady,pending);
  assert.equal(app.ctx.window.storage,undefined);
});
test('resource errors produce a visible loading error',()=>{
  const app=boot();app.events.error({target:{tagName:'SCRIPT'}});
  assert.equal(app.nodes['bootstrap-notice'].hidden,false);
  assert.match(app.nodes['bootstrap-detail'].textContent,/could not load/);
});
test('successful application readiness removes the bootstrap warning',()=>{
  const app=boot();app.timeout();app.complete();
  assert.equal(app.nodes['bootstrap-notice'].hidden,true);assert.equal(app.cleared(),true);
  app.events.unhandledrejection({});assert.equal(app.nodes['bootstrap-notice'].hidden,true);
});
