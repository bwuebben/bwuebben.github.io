'use strict';
const assert = require('node:assert/strict');
const H = require('../singularity-microscope/model.js');
const P = require('../geometry-particles/model.js');
const close=(x,y,tol=1e-10)=>assert.ok(Math.abs(x-y)<=tol*Math.max(1,Math.abs(y)),`${x} != ${y}`);
close(H.energy(1),.5);close(H.inclusion(1),.5);close(H.energy(0),0);close(H.density(0),1);
for(const R of [.1,.3,1,2,4,12]) {
  // Simpson integration of the 4-dimensional shell density, independently
  // compared with the cumulative closed form used by the interface.
  const N=4000,h=R/N;
  let sum=0;for(let i=0;i<=N;i++)sum+=(i===0||i===N?1:i%2?4:2)*12*(i*h)**3*H.density(i*h);
  close(h*sum/3,H.energy(R),1e-9);
  const eps=1e-5;close((H.energy(R+eps)-H.energy(R-eps))/(2*eps),H.radialEnergy(R),1e-8);
}
close(H.energy(1e5),1,1e-14);
for(const t of [1,7,100,10000]) {close(H.radius(4*t),H.radius(t)/2);close(Math.sqrt(t)*H.radius(t),1);}
for(const a of [.02,.1,.2])for(const ratio of [.01,.1,.4,1]) {
  const m=P.masses(a,ratio);close(m[2]**2,m[0]**2+m[1]**2);
  assert.ok(m[0]<=m[1]&&m[1]<m[2]);P.masses(a/2,ratio).forEach((x,i)=>close(x,m[i]/2));
}
// A rational example at cos(theta)=1/2: 1/6 - 5/19 = -11/114.
close(P.amplitude(.1,.05,.5),-11/114);close(P.effectiveAmplitude(.1,.05,.5),-3/16);
for(const mu of [.01,.1,.4]) {
  assert.equal(P.amplitude(mu,mu,.5),null);
  assert.ok(P.domain(mu,mu/5,.5).valid);
  const e=mu*1e-3, exact=P.amplitude(mu,e,.5), low=P.effectiveAmplitude(mu,e,.5);
  assert.ok(Math.abs(exact/low-1)<2e-6);
}
assert.equal(P.amplitude(.8,.1,.5),null);assert.equal(P.amplitude(.1,.9,.5),null);
for(const E of [.001,.03,.3,.7])for(const c of [-.8,0,.5,.8]) {
  const k=P.kinematics(E,c);close(k.s+k.t+k.u,0);
  const d=P.domain(.1,E,c);if(d.valid)for(const q of [k.s,k.t,k.u])assert.ok(Math.abs(.01-q)>=.15*(.01+E*E)-1e-14);
}
for(const q of [-2,-1,-.1,0]) {const c=P.cancellation(q);close(c.contact+c.exchange,c.sum);assert.ok(c.exchange>0&&c.exchange<=1);}
close(P.cancellation(0).sum,0);
console.log('PASS: bubble shell integrals, shared half-radius, scaling, mass relations, rational amplitude, low-energy limit, channel exclusions, and scalar cancellation.');
