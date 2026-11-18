const test=require('node:test'),assert=require('node:assert/strict'),T=require('../tempo-profile');
const src='https://www.tcdb.com/ViewCard.cfm/cid/123';
test('current Tempo roster, printed team and legacy rookie flags do not prove jersey or rookie',()=>{
 const c={id:1,team:'Toronto Tempo',currentTeam:'Toronto Tempo',player:'rice',isRookie:true};
 assert.equal(T.classify(c).primary,false);assert.equal(T.classify(c).uniform,null);assert.equal(T.classify(c).rookie,null);
});
test('verified pictured Tempo jersey and verified rookie independently qualify for Primary',()=>{
 const uniform={id:1,depictedTeam:'Toronto Tempo',uniformVerified:true,uniformSourceUrl:src};
 const rookie={id:2,isRookie:true,rookieVerified:true,rookieSourceUrl:src};
 assert.equal(T.matches(uniform,'primary'),true);assert.equal(T.matches(rookie,'primary'),true);
 assert.equal(T.matches(rookie,'unverified'),true);assert.equal(T.matches(uniform,'unverified'),false);
});
test('explicitly verified old-team jersey remains outside uniform view even after a trade',()=>{
 const c={id:3,team:'Toronto Tempo',depictedTeam:'Connecticut Sun',uniformVerified:true,uniformSourceUrl:src,isRookie:false,rookieVerified:true,rookieSourceUrl:src};
 assert.equal(T.classify(c).uniform,false);assert.equal(T.matches(c,'other'),true);assert.equal(T.matches(c,'unverified'),false);
});
test('evidence requires a usable source and does not transfer to another parallel ID',()=>{
 const registry={3:{depictedTeam:'Toronto Tempo',uniformVerified:true,uniformSourceUrl:src}};
 assert.equal(T.matches({id:3},'uniform',registry),true);assert.equal(T.matches({id:4,parentCardId:3},'uniform',registry),false);
 assert.equal(T.matches({id:3,depictedTeam:'Toronto Tempo',uniformVerified:true},'uniform'),false);
 assert.equal(T.matches({id:3,depictedTeam:'Toronto Tempo',uniformVerified:true,uniformSourceUrl:'javascript:bad()'},'uniform'),false);
});
test('view counts allow jersey-unverified rookies and all nonprimary cards appear under other',()=>{
 const cards=[{id:1,depictedTeam:'Toronto Tempo',uniformVerified:true,uniformSourceUrl:src,isRookie:true,rookieVerified:true,rookieSourceUrl:src},{id:2,isRookie:true,rookieVerified:true,rookieSourceUrl:src},{id:3},{id:4,isTestCard:true}];
 assert.deepEqual(T.counts(cards),{all:3,primary:2,uniform:1,rookies:2,other:1,unverified:2});
 assert.equal(T.matches(cards[2],'other'),true);
});
