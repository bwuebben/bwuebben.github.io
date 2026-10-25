const assert=require("node:assert/strict");
const M=require("../../assets/essays/broken-things-model.js");
const close=(a,b,tol=1e-9,msg="")=>assert.ok(Math.abs(a-b)<=tol,msg+" "+a+" != "+b);
const PI=Math.PI;

// Critical points: zero gradient and the stated heights.
for(const [k,h] of [["max",2],["s1",0],["s2",0],["min",-2]]){
 const c=M.critical[k],[u,v]=M.downhill(c.x,c.y);
 close(u,0,1e-12,k);close(v,0,1e-12,k);close(M.height(c.x,c.y),h,1e-12,k);
}

// The closed-form lines solve ẋ = sin x, ẏ = sin y, and height decreases along them.
for(const fam of Object.keys(M.families)) for(const C of [1e-3,.2,1,7,400]) for(const t of [-6,-1,0,.7,3]){
 const h=1e-6,[x0,y0]=M.flowPoint(fam,C,t-h),[x1,y1]=M.flowPoint(fam,C,t+h),[x,y]=M.flowPoint(fam,C,t);
 const [u,v]=M.downhill(x,y);
 close((x1-x0)/(2*h),u,1e-6,"x velocity");close((y1-y0)/(2*h),v,1e-6,"y velocity");
 assert.ok(M.height(x1,y1)<M.height(x0,y0),"height must decrease");
}

// Independent RK4 integration keeps tan(y/2) = C tan(x/2) in every quadrant.
for(const [sx,sy] of [[1,1],[-1,1],[-1,-1],[1,-1]]){
 let x=sx*1e-3,y=sy*3e-3; const C=Math.tan(y/2)/Math.tan(x/2);
 const dt=1e-3;
 for(let i=0;i<40000;i++){
  const f=(a,b)=>M.downhill(a,b);
  const [k1x,k1y]=f(x,y),[k2x,k2y]=f(x+dt/2*k1x,y+dt/2*k1y),[k3x,k3y]=f(x+dt/2*k2x,y+dt/2*k2y),[k4x,k4y]=f(x+dt*k3x,y+dt*k3y);
  x+=dt/6*(k1x+2*k2x+2*k3x+k4x);y+=dt/6*(k1y+2*k2y+2*k3y+k4y);
  if(i===8000) close(Math.tan(y/2)/Math.tan(x/2),C,1e-6,"RK4 invariant");
 }
 close(Math.abs(x),PI,1e-3,"reaches minimum x");close(Math.abs(y),PI,1e-3,"reaches minimum y");
}

// As C → 0 or ∞ the flow line converges to the broken trajectory through S1 or S2.
function distanceToPath(p,path){
 let best=Infinity;
 for(let i=0;i+1<path.length;i++){
  const [a,b]=[path[i],path[i+1]],d=[b[0]-a[0],b[1]-a[1]],L=d[0]*d[0]+d[1]*d[1];
  const s=Math.max(0,Math.min(1,((p[0]-a[0])*d[0]+(p[1]-a[1])*d[1])/L));
  best=Math.min(best,Math.hypot(p[0]-a[0]-s*d[0],p[1]-a[1]-s*d[1]));
 }
 return best;
}
for(const fam of Object.keys(M.families)){
 const [viaS1,viaS2]=M.brokenEnds(fam);
 const far=(C,path)=>Math.max(...M.flowLine(fam,C,2000).map(p=>distanceToPath(p,path)));
 assert.ok(far(1e-7,viaS1.path)<1e-3,"C → 0 limit");
 assert.ok(far(1e7,viaS2.path)<1e-3,"C → ∞ limit");
 assert.ok(far(1,viaS1.path)>.5,"an interior line stays away from the broken ends");
 // Two ends per family, with opposite signs: the boundary of an interval cancels.
 assert.equal(viaS1.sign+viaS2.sign,0,fam+" ends must cancel");
}

// Eight broken trajectories in all, each the end of exactly one family, and 8 = 2 saddles × 2 × 2.
const ends=Object.keys(M.families).flatMap(f=>M.brokenEnds(f).map(e=>e.edges.join("|")));
assert.equal(ends.length,8);assert.equal(new Set(ends).size,8);
const glued=[];
for(const s of ["s1","s2"]) for(const a of Object.keys(M.edges).filter(k=>M.edges[k].from==="max"&&M.edges[k].to===s))
 for(const b of Object.keys(M.edges).filter(k=>M.edges[k].from===s&&M.edges[k].to==="min")) glued.push(a+"|"+b);
assert.deepEqual([...glued].sort(),[...ends].sort());
// Signed count of broken trajectories equals the coefficient of ∂²(max) on min.
const signedBroken=Object.keys(M.families).flatMap(f=>M.brokenEnds(f)).reduce((s,e)=>s+e.sign,0);
const d=M.differential();
assert.equal(signedBroken,d.squareSigned);assert.equal(signedBroken,0);

// Morse differential of the torus: two flow lines each, cancelling with signs and mod 2.
for(const k of ["max-s1","max-s2","s1-min","s2-min"]){assert.equal(d[k].unsigned,2);assert.equal(d[k].signed,0);}
assert.equal(d.squareMod2,0);
// ∂ = 0, so homology has ranks 1, 2, 1 (ℤ, ℤ², ℤ) and Euler characteristic 1 − 2 + 1 = 0.
const ranks=[1,2,1];assert.equal(ranks[0]-ranks[1]+ranks[2],0);

// The dented sphere of the essay: ∂M1 = S, ∂M2 = −S, ∂S = 1 − 1 = 0. ∂ ≠ 0 but ∂² = 0; homology ranks 1, 0, 1.
const d2=[[1,-1]],d1=[[0]];// rows: target generators; columns: source generators
close(d1[0][0]*d2[0][0],0,0,"∂² on M1");close(d1[0][0]*d2[0][1],0,0,"∂² on M2");
const rank=m=>m.flat().some(v=>v!==0)?1:0;
assert.deepEqual([2-rank(d2),1-rank(d2)-rank(d1),1-rank(d1)],[1,0,1]);

// Slider endpoints are the added broken trajectories, not flow lines.
assert.throws(()=>M.sliderToC(0),RangeError);assert.throws(()=>M.sliderToC(100),RangeError);
close(M.sliderToC(50),1);

// Instanton bubble: total energy one at every scale; half within radius λ; peak at λ√(3/5).
function integrate(f,a,b,n=200000){let s=0;const h=(b-a)/n;for(let i=0;i<n;i++){const x=a+(i+.5)*h;s+=f(x);}return s*h;}
for(const lam of [1,.3,.05]){
 close(integrate(r=>M.instantonDensity(r,lam),0,lam*400),1,2e-5,"total energy");
 for(const R of [.01,.1,.5,1,2]) close(integrate(r=>M.instantonDensity(r,lam),0,R,40000),M.instantonShare(R,lam),1e-6,"share formula");
 close(M.instantonShare(M.halfEnergyRadius(lam),lam),.5,1e-12,"half radius");
 const p=M.peakRadius(lam),e=lam*1e-4;
 assert.ok(M.instantonDensity(p,lam)>M.instantonDensity(p+e,lam)&&M.instantonDensity(p,lam)>M.instantonDensity(p-e,lam),"peak");
}
// Scale invariance: shrinking everything together changes nothing; at a fixed radius the energy concentrates.
close(M.instantonShare(.2,.5),M.instantonShare(.02,.05),1e-12,"scale invariance");
assert.ok(M.instantonShare(.05,1e-3)>.9999&&M.instantonShare(.05,1)<1e-4,"concentration");
console.log("Torus flow lines, broken ends, signs, ∂² = 0, homology ranks, and instanton energy checks passed.");
