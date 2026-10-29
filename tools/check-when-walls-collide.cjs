#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');
const M=require('../when-walls-collide/model.js');
const reference=require('../when-walls-collide/reference.json');
const fromObject=o=>M.poly(Object.entries(o).map(([key,v])=>[...key.split(',').map(Number),...v.split('/').map(BigInt)]));
const eq=(p,q,message)=>assert.ok(M.equal(p,q),message);
const value=(r,n,d=1)=>assert.ok(M.equalR(r,M.R(n,d)));
let cases=0;
for(const fixture of reference.cases){
  const c=M.R(fixture.tick,4),p=fromObject(fixture.input);
  eq(M.apply(p,M.crossings('upper',c),c),fromObject(fixture.upper),`Source upper ${fixture.name} at ${M.str(c)}`);
  eq(M.apply(p,M.crossings('lower',c),c),fromObject(fixture.lower),`Source lower ${fixture.name} at ${M.str(c)}`);
}
eq(M.multiply(M.mono(0,0,1),M.mono(0,0,1)),new Map());
eq(M.multiply(M.mono(0,0,2),M.mono(0,0,2)),new Map());
eq(M.multiply(M.mono(0,0,1),M.mono(0,0,2)),M.mono(0,0,3));
for(let tick=-6;tick<=4;tick++){
  const c=M.R(tick,4),comparison=M.compare(c);
  assert.equal(comparison.consistent,tick===-3);
  const [a,b]=M.coefficients(comparison.upper);value(a,2-2*tick);value(b,10+2*tick);
  value(M.period(comparison.upper),0);value(M.period(comparison.lower),0);
  eq(M.normalize(comparison.upper),M.target());
  for(const route of ['upper','lower']){
    const events=M.crossings(route,c),reverse=M.crossings(route,c,true);
    assert.deepEqual(reverse.map(e=>e.id),events.map(e=>e.id).reverse());
    for(let i=0;i<events.length;i++){
      const event=events[i],normal={S1:[3,4],S2:[3,2],U:[1,1]}[event.id];
      value(M.plus(M.times(normal[0],event.x),M.times(normal[1],event.level)),0);
      assert.ok(M.number(event.progress)>0&&M.number(event.progress)<1);
      assert.ok(event.id!=='U'||M.number(event.level)>0);
      value(M.plus(event.progress,reverse[reverse.length-1-i].progress),1);
      // Starting and ending vertical connectors cannot meet these supports.
      assert.ok(Math.abs(M.number(M.divide(M.times(normal[0],M.R(1,4)),normal[1])))>.1);
      const before=M.atProgress(route,c,false,M.number(event.progress)-1e-7);
      const after=M.atProgress(route,c,false,M.number(event.progress));
      assert.equal(before.passed.length,i);assert.equal(after.passed.length,i+1);
      eq(after.p,M.act(before.p,event,c));
    }
    eq(M.atProgress(route,c,true,1).p,M.initial());
    for(let mask=0;mask<4;mask++)for(let i=0;i<=4;i++)for(let j=0;j<=4;j++){
      const p=M.mono(i,j,mask),q=M.add(M.mono(2,1),M.mono(1,2,1));
      const forward=M.apply(p,events,c);
      eq(M.apply(forward,reverse,c),p,'Inverse path');
      eq(M.apply(M.multiply(p,q),events,c),M.multiply(forward,M.apply(q,events,c)),'Multiplicativity');
      eq(M.add(M.X(1,0,M.X(0,1,p)),M.scale(M.X(0,1,M.X(1,0,p)),-1)),M.scale(M.X(1,1,p),-3),'Lie bracket');
      if(tick===-3)eq(M.apply(p,M.crossings('upper',c),c),M.apply(p,M.crossings('lower',c),c),'Consistent operator');
      cases++;
    }
  }
}
eq(M.endpoint('upper',M.R(1,4)),M.target());
assert.ok(!M.equal(M.endpoint('upper',M.R(-3,4)),M.target()));
for(const [a,b]of [[8,4],[0,12],[-3,7],[11,-5]]){
  const p=M.add(M.target(),M.poly([[3,1,5,a],[3,5,1,b-12]])),n=M.normalize(p);
  value(M.coefficients(n)[0],0);value(M.coefficients(n)[1],a+b);
  value(M.period(n),6-(a+b)/2);eq(M.normalize(n),n);
}
assert.deepEqual(M.holonomy(2),[[-19n,36n],[-180n,341n]]);
assert.deepEqual(M.holonomy(-1),[[19n,-2n],[10n,-1n]]);
for(let n=-12;n<=12;n++){
  const A=M.holonomy(n);assert.equal(A[0][0]*A[1][1]-A[0][1]*A[1][0],1n);
  assert.deepEqual(M.mm(A,M.holonomy(-n)),M.I);
}
assert.equal(M.K[0][0]+M.K[1][1],18n);
for(let r=2;r<=12;r++)for(let s=2;s<=12;s++){
  const t=M.threshold(r,s),expected=(r-2)*(s-2)>=4;
  assert.equal(t.dependent,expected);value(t.central,2*r*s-2*r-2*s,r*s);
  assert.deepEqual(t,M.threshold(s,r));
  assert.equal(t.insertions,expected?(Math.min(r,s)===3?3:2):Infinity);
  assert.equal(M.threshold(r,s,true).insertions,1);assert.equal(M.threshold(r,s,true).dependent,true);
}
for(const args of [[1,4],[4,2.5],[NaN,4]])assert.throws(()=>M.threshold(...args));
assert.throws(()=>M.R(1,0));assert.throws(()=>M.holonomy(1.5));assert.throws(()=>M.holonomy(13));
console.log(`When Walls Collide: ${reference.cases.length} independent source fixtures; ${cases} monomial/path cases; exact inverses, products, commutators, crossing geometry, period loss, normal forms, holonomy, and 121 threshold pairs passed.`);
