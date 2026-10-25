const assert=require("node:assert/strict");
const M=require("../../assets/essays/two-failures-model.js");
const close=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(b)),a+" != "+b);
// Norton's departing histories satisfy r'' = √r: finite-difference residual along each history.
for(const T of [0,1.5,3,7.25]) {
 const h=1e-3;
 for(let t=T+.01;t<M.T_MAX;t+=.37) {
  const fd=(M.position(t+h,T)-2*M.position(t,T)+M.position(t-h,T))/(h*h);
  close(fd,Math.sqrt(M.position(t,T)),1e-6);
  close(M.acceleration(t,T),Math.sqrt(M.position(t,T)));
 }
 // The pieces join without a seam: position, velocity and acceleration vanish at T.
 for(const g of [M.position,M.velocity,M.acceleration]) { assert.equal(g(T,T),0); assert.ok(g(T+1e-4,T)<1e-8); }
 // Energy first integral of a departure from rest: v = (2/√3) r^{3/4}.
 for(const t of [T+.5,T+2,T+4]) close(M.velocity(t,T),2/Math.sqrt(3)*Math.pow(M.position(t,T),.75));
}
// Remaining at rest is also a solution, and the two coincide up to T.
for(const t of [0,2,9]) { assert.equal(M.position(t,null),0); assert.equal(M.position(t,10),0); }
// The force is not Lipschitz at the apex: √r / r is unbounded.
assert.ok(Math.sqrt(1e-12)/1e-12>1e5);
// The escape integral ∫₀¹ r^{-3/4} dr is finite (= 4); for a Lipschitz force it would diverge like log.
let I=0;const n=2e6;for(let i=0;i<n;i++){const a=i/n,b=(i+1)/n;I+=4*(Math.pow(b,.25)-Math.pow(a,.25));}
close(I,4,1e-12);
// Surface geometry: h = (2/3g) r^{3/2}, sin θ = dh/dr, and the tangential force g sin θ equals √r.
for(const r of [.1,1,4,7]) {
 const h=1e-6;
 close((M.depth(r+h)-M.depth(r-h))/(2*h),M.sinSlope(r),1e-6);
 close(M.G*M.sinSlope(r),Math.sqrt(r));
 close((M.radius(r+h)-M.radius(r-h))/(2*h),M.cosSlope(r),1e-6);
}
// Curvature diverges at the apex: meridian like 1/(2g√r), Gaussian like 1/(2g²r).
for(const r of [1e-4,1e-6,1e-8]) {
 close(M.meridianCurvature(r)*2*M.G*Math.sqrt(r),1,1e-3);
 close(M.gaussianCurvature(r)*2*M.G*M.G*r,1,1e-3);
}
assert.ok(M.gaussianCurvature(1e-8)>1e6);
// ...yet the total curvature of the cap is finite: Gauss–Bonnet gives 2π(1 − cos θ).
for(const r1 of [.5,2,M.LEAVE]) {
 let total=0;const m=200000;
 for(let i=0;i<m;i++){const u=(i+.5)/m,r=r1*u*u;total+=M.gaussianCurvature(r)*2*Math.PI*M.radius(r)*r1*2*u/m;}
 close(total,2*Math.PI*(1-M.cosSlope(r1)),2e-3);
}
// The mass stays on the surface until the normal force vanishes at r = 0.6 g².
close(M.normalForce(M.LEAVE),0,1e-12);
assert.ok(M.normalForce(M.LEAVE*.99)>0 && M.normalForce(M.LEAVE*1.01)<0);
close(M.position(M.TRAVEL,0),M.LEAVE);
// Normal force also follows from the trajectory: g cos θ − v²κ with v from the solution itself.
for(const t of [1,3,5]) {
 const r=M.position(t,0),v=M.velocity(t,0);
 close(M.G*M.cosSlope(r)-v*v*M.meridianCurvature(r),M.normalForce(r),1e-9);
}
// State clamps at the departure point once airborne.
const s=M.state(11,0);assert.ok(s.airborne);close(s.r,M.LEAVE);
assert.throws(()=>M.position(1,NaN),RangeError);
// Renderers return markup for the initial state.
for(const svg of [M.domeSVG(2,30,7),M.topSVG(2,30,7),M.chartSVG(2,7),M.domeSVG(null,0,0),M.chartSVG(null,4)]) assert.ok(svg.length>200&&!svg.includes("NaN"));
console.log("Dome solutions, seam, energy, non-Lipschitz force, escape integral, curvature divergence, Gauss–Bonnet total, departure radius, and renderers checked.");
