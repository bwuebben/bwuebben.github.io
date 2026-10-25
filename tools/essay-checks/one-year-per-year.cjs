const assert=require("node:assert/strict");
const M=require("../../assets/essays/one-year-per-year-model.js");
const close=(a,b,tol=1e-9,what="")=>assert.ok(Math.abs(a-b)<=tol,`${what} ${a} != ${b}`);
const LN2=Math.LN2;
// The peak condition e^u - 1 = 2u and the constants quoted in the essay and the paper.
close(Math.expm1(M.uStar),2*M.uStar,1e-12,"peak condition");
close(M.uStar,1.2564,5e-4,"u*");
close(M.gStar,0.638,5e-4,"g(u*)");
close(M.uStar/LN2,1.81,5e-3,"T*/h");
const c=M.gStar/Math.sqrt(LN2);
close(c,0.77,5e-3,"t_max/(SR0 sqrt h)");
close(1/c**2,1.70,5e-3,"half-life constant");
close(2*LN2/M.gStar**2,3.40,5e-3,"min half-life per unit ln M");
// The closed form agrees with a direct average of the decaying return.
for(const [sr,h,T] of [[1,8,3],[0.5,2,10],[2,1.5,0.7],[1.3,25,40]]){
 const n=200000; let s=0;
 for(let i=0;i<n;i++){ const t=(i+0.5)*T/n; s+=sr*2**(-t/h); }
 close(M.tStat(T,sr,h),s/n*Math.sqrt(T),1e-6,"closed form");
}
// The peak is the maximum over horizons, and waiting past it lowers the statistic.
for(const [sr,h] of [[1,8],[2,1.5],[0.7,30]]){
 const p=M.peak(sr,h); let best=0;
 for(let T=0.001;T<20*h;T+=h/2000) best=Math.max(best,M.tStat(T,sr,h));
 close(best,p.t,1e-6,"grid maximum");
 assert.ok(M.tStat(p.T*1.5,sr,h)<p.t && M.tStat(p.T*0.5,sr,h)<p.t);
}
close(M.tStat(30,1,1e9),Math.sqrt(30),1e-6,"no-decay limit");
close(M.tStat(30,1,Infinity),Math.sqrt(30),0,"no decay");
// Numbers quoted in the essay.
close(M.minHalfLife(1,3),15.3,0.05,"SR0=1, t*=3");
assert.ok(M.minHalfLife(0.5,3)>60,"SR0=0.5 needs more than sixty years");
close((3/0.5)**2,36,0,"t = SR sqrt T at SR 0.5");
close(Math.sqrt(2*Math.log(1e4)/5),1.92,0.005,"floor at 10,000 trials and 5 years");
close(Math.sqrt(2*Math.log(1e6)/5),2.35,0.005,"floor at one million trials and 5 years");
close(Math.sqrt(2*Math.log(1e6)/10),1.66,0.005,"floor at one million trials and 10 years");
close(M.hurdle(330),3.41,0.005,"Experiment 2 hurdle");
// The default scenario and presets.
let s=M.summary(1,8,1e4);
close(s.bar,4.29,0.005); close(s.peak.t,2.17,0.005); close(s.peak.T,14.5,0.05);
assert.equal(s.window,null); close(s.minHalfLife,31.4,0.05);
s=M.summary(1,Infinity,1e4); close(s.window.from,18.4,0.05); assert.equal(s.window.until,Infinity);
s=M.summary(2,1.5,1e4); assert.equal(s.window,null); close(s.peak.t,1.88,0.005);
s=M.summary(1.5,25,1e3); close(s.bar,3.72,0.005); close(s.window.from,7.5,0.1); assert.ok(s.window.until>M.HORIZON);
for(const [sr,h,m] of [[1.5,25,1e3],[1,20,100],[2.5,3,30]]){
 const w=M.summary(sr,h,m).window, bar=M.hurdle(m);
 close(M.tStat(w.from,sr,h),bar,1e-9,"entry"); close(M.tStat(w.until,sr,h),bar,1e-9,"exit");
}
// Decay-matched weights w ∝ 2^(-t/h): ceiling SR0 sqrt(h/(2 ln 2)) ≈ 0.85 SR0 sqrt(h), constant ≈ 1.39.
{ const sr=1,h=8,k=LN2/h,n=400000,Tmax=60*h; let num=0,den=0;
  for(let i=0;i<n;i++){ const t=(i+0.5)*Tmax/n, w=Math.exp(-k*t); num+=w*sr*Math.exp(-k*t); den+=w*w; }
  const tw=num*Math.sqrt(Tmax/n)/Math.sqrt(den);
  close(tw,sr*Math.sqrt(h/(2*LN2)),1e-4,"weighted ceiling");
  close(1/Math.sqrt(2*LN2),0.85,0.005); close(2*LN2,1.39,0.005); }
// The details note: at M = 10,000 the exact expected maximum of independent normals is about 3.9.
{ const erf=x=>{const t=1/(1+0.5*Math.abs(x)),y=1-t*Math.exp(-x*x-1.26551223+t*(1.00002368+t*(0.37409196+t*(0.09678418+t*(-0.18628806+t*(0.27886807+t*(-1.13520398+t*(1.48851587+t*(-0.82215223+t*0.17087277)))))))));return x>=0?y:-y;};
  const Phi=x=>0.5*(1+erf(x/Math.SQRT2)), phi=x=>Math.exp(-x*x/2)/Math.sqrt(2*Math.PI);
  let e=0; const dx=1e-4, N=1e4;
  for(let x=-2;x<8;x+=dx) e+=x*N*phi(x)*Phi(x)**(N-1)*dx;
  close(e,3.85,0.02,"expected maximum"); assert.ok(e<M.hurdle(N)); }
// Input validation and chart markup.
assert.throws(()=>M.tStat(1,0,5),RangeError); assert.throws(()=>M.hurdle(1),RangeError);
for(const sr of [0.25,1,2.5]) for(const h of M.HALF_LIVES) for(const m of [M.TRIALS[0],1e4,M.TRIALS.at(-1)]) for(const W of [340,560]){
 const svg=M.chart(sr,h,m,W,Math.round(W*0.62));
 assert.ok(!/NaN|Infinity|undefined/.test(svg),`chart ${sr},${h},${m},${W}`);
 assert.ok(svg.includes('class="oyp-curve"') && svg.includes('class="oyp-bar"'));
}
console.log("One year per year: peak condition, constants, closed form, presets, certification windows, weighting, extreme-value note, and chart markup checks passed.");
