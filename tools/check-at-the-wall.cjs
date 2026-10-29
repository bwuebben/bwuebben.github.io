/* Mathematical checks of the explorer, independent of its rendering code. */
const assert = require('node:assert/strict');
const M = require('../at-the-wall/model.js');
let cases = 0;
const close = (a,b,tol=2e-10) => assert.ok(Math.abs(a-b) <= tol*Math.max(Math.abs(a),Math.abs(b),1e-20), `${a} != ${b}`);
function audit(s) {
  const {values, vectors, L, weights} = s, size = Math.max(...weights);
  close(values.reduce((a,b)=>a+b,0),2*weights.reduce((a,b)=>a+b,0));
  vectors.forEach((v,i)=>{
    assert.ok(Math.abs(v.reduce((a,b)=>a+b,0))<1e-12);
    close(v.reduce((a,b)=>a+b*b,0),1);
    const residual=L.map((row,j)=>row.reduce((a,b,k)=>a+b*v[k],0)-values[i]*v[j]);
    assert.ok(Math.hypot(...residual)<2e-13*size);
    vectors.forEach((w,j)=>{if(i!==j)assert.ok(Math.abs(v.reduce((a,b,k)=>a+b*w[k],0))<1e-12);});
  });
  cases++;
}
// Trace, determinant (matrix-tree theorem), cuts, and eigenvectors, including
// walls/corners, very small scales, and the full selectable chamber range.
for(const p of [0,.000001,.001,.008,.02,.2,.5,.9,.999,1]) for(const q of [0,.000001,.01,.5,.7,.999,1]) for(const sigma of [1e-5,.03,.1]) {
  const s=M.chamber(p,q,sigma);audit(s);
  if(s.stable) {
    close(s.values.reduce((a,b)=>a*b,1),4*s.x[0]*s.x[1]*s.y[0]*s.y[1]/sigma,3e-9);
    const margin=Math.min(...s.x,...s.y);
    assert.ok(s.values[0]>=margin*(1-1e-9));assert.ok(s.values[0]<=4/3*margin*(1+1e-9));
  } else assert.equal(s.values[0],0);
}
// Closed spectra, not another implementation of the Jacobi solver.
M.chamber(.5,.5,.03).values.forEach((v,i)=>close(v,[.015,.015,.03][i]));
M.tree().values.forEach((v,i)=>close(v,.02*[2-Math.SQRT2,2,2+Math.SQRT2][i]));
for(const a of [.001,.1,.25,.5,.8,.999]) {
  const w=[a,1-a,1-a,a].map(x=>.03*x), s=M.spectrum(w);
  s.values.forEach((v,i)=>close(v,[.06*a,.06*(1-a),.06].sort((x,y)=>x-y)[i]));
  audit({...s,weights:w});
}
for(const theta of [.001,.01,.1,1,10,100,1000]) {
  const s=M.cycle(theta),[a,b,c,d]=s.weights;audit(s);
  close(a+b,.04);close(c+d,.02);close(a+c,.02);close(b+d,.04);close(a*d/(b*c),theta);
}
for(const t of [.04,.06,.1,.2,.3]) {const s=M.threeScales(t);audit(s);assert.ok(s.values.every((v,i)=>Math.abs(v/s.leading[i]-1)<.07));}
const near=M.threeScales(.04);near.values.forEach((v,i)=>assert.ok(Math.abs(v/near.leading[i]-1)<.002));
// Uniform rescaling multiplies all eigenvalues by the same factor.
for(const scale of [1e-5,.1,100]) M.chamber(.13,.81,.03*scale).values.forEach((v,i)=>close(v,scale*M.chamber(.13,.81,.03).values[i]));
for(const tau of [1,10,80,200]) {
  close(M.profile(0,tau),1/(2*tau));
  close(M.profile(1e-12,tau),1/(2*tau),1e-9);
  for(const delta of [.001,.02,.03]) {
    close(M.profile(delta,tau)-M.profile(-delta,tau),delta);
    assert.ok(M.profile(delta,tau)>delta);
    const h=1e-4, P=M.profile(delta,tau), derivative=(M.profile(delta,tau+h)-M.profile(delta,tau-h))/(2*h);
    close(derivative,2*P*(delta-P),3e-6);
  }
}
close(M.profile(.03,10000),.03);assert.ok(M.profile(-.03,10000)>0);
assert.throws(()=>M.chamber(-.1,.5,.03));assert.throws(()=>M.profile(0,0));
console.log(`At the Wall: ${cases} matrix cases; closed spectra, cut bounds, tree products, three scales, harmonic ratios, boundary nullity, and signed flow profiles passed.`);
