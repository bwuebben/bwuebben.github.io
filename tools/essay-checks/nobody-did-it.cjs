const assert=require("node:assert/strict");
const M=require("../../assets/essays/nobody-did-it-model.js");
const UI=require("../../assets/essays/nobody-did-it.js");
const close=(a,b,tol=1e-6,msg="")=>assert.ok(Math.abs(a-b)<=tol,`${msg} ${a} != ${b}`);
// Normal distribution helpers against known values and each other.
close(M.Phi(0),.5,1e-7); close(M.Phi(1.959963984540054),.975,1e-7); close(M.Phi(-1),1-M.Phi(1),1e-7);
for(const x of [-3,-1.2,0,.4,2.5]) close(M.PhiInv(M.Phi(x)),x,2e-6,"inverse");
// Simpson integration of a density over [a, b].
function integrate(f,a,b,n=4000){const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);return s*h/3;}
const grid=[];
for(const d of [0,.2,.4,.6,.8,1]) for(const p of [.05,.3,.5,.9]) for(const t of [.1,.5,.8,.95]) grid.push([d,p,t]);
for(const [dl,p,t] of grid){
 const a=M.attribution(dl,p,t), d=M.clarity(dl);
 close(d,3*(1-dl),1e-12,"clarity mapping");
 if(d>0){
  // At the cut the posterior equals the threshold, above it the posterior exceeds it.
  close(M.posterior(a.cut,d,p),t,1e-9,"posterior at cut");
  assert.ok(M.posterior(a.cut+.1,d,p)>t && M.posterior(a.cut-.1,d,p)<t,"posterior is increasing in s");
  // Hit and false-alarm rates equal the integrals of the two densities beyond the cut.
  const hi=Math.max(a.cut,-12)+0, top=Math.max(hi,0)+12;
  close(a.hit,integrate(s=>M.phi(s-d),Math.max(a.cut,-12),Math.max(top,d+12)),1e-6,"hit integral");
  close(a.falseAlarm,integrate(s=>M.phi(s),Math.max(a.cut,-12),top),1e-6,"false-alarm integral");
  // The operating point lies on the ROC curve.
  if(a.falseAlarm>1e-12&&a.falseAlarm<1-1e-12) close(M.roc(d,a.falseAlarm),a.hit,1e-6,"ROC");
 } else {
  assert.equal(a.hit,p>=t?1:0); assert.equal(a.falseAlarm,a.hit);
 }
 // Retaliation precision is at least the threshold: every punished incident had posterior ≥ τ.
 if(a.precision!==null) assert.ok(a.precision>=t-1e-9,`precision ${a.precision} < ${t}`);
 if(a.accidentsPerAttack!==null) assert.ok(a.accidentsPerAttack<=(1-t)/t+1e-9,"accidents per punished attack bounded by (1 − τ)/τ");
 // Area under the ROC curve is Φ(d′/√2).
 close(integrate(x=>M.roc(d,x),1e-12,1-1e-12,4000),a.auc,2e-3,"AUC");
}
// A cautious defender (τ > π) retaliates less and less as delegation rises; a trigger-happy one (τ < π) more and more.
let prev=2;
for(let dl=0;dl<=1.0001;dl+=.05){const h=M.attribution(Math.min(dl,1),.3,.8).hit;assert.ok(h<=prev+1e-12);prev=h;}
assert.equal(M.attribution(1,.3,.8).hit,0); assert.equal(M.attribution(1,.3,.2).hit,1);
close(M.attribution(1,.3,.2).accidentsPerAttack,.7/.3,1e-12);
// Continuity toward d′ = 0 from the cautious side.
assert.ok(M.attribution(.999,.3,.8).hit<1e-9);
// Figures quoted in the essay text (default π = 0.3, τ = 0.8).
const s0=UI.state(0,.3,.8), s40=UI.state(.4,.3,.8), s75=UI.state(.75,.3,.8), s100=UI.state(1,.3,.8);
assert.equal(Math.round(s0.a.hit*100),78); assert.ok(s0.a.falseAlarm>.01&&s0.a.falseAlarm<.015,"a little over 1 percent");
assert.equal(Math.round(s40.a.hit*100),37); assert.ok(s40.a.falseAlarm<.02,"under 2 percent");
assert.ok(s75.a.hit<1/200,"fewer than one in two hundred");
assert.ok(s40.multiplier>1.9&&s40.multiplier<2.3,"roughly double"); assert.ok(s75.multiplier>100,"more than a hundredfold");
assert.equal(Math.round(s40.hold*100),15); close(s100.hold,s0.a.hit,1e-6,"full delegation must punish h0 of accidents");
assert.equal(s100.multiplier,Infinity);
// The hold point lies on the current ROC curve at the human-decides hit rate.
for(const s of [s40,s75]) close(M.roc(s.a.clarity,s.hold),s0.a.hit,1e-6,"hold point");
// Trilemma: every pair names a configuration, as in Table 1 of the paper.
assert.equal(M.trilemma(["flexibility","effectiveness"]).sacrifices,"attribution");
assert.equal(M.trilemma(["effectiveness","attribution"]).sacrifices,"flexibility");
assert.equal(M.trilemma(["attribution","flexibility"]).sacrifices,"effectiveness");
assert.equal(M.trilemma(["attribution"]),null);
assert.throws(()=>M.trilemma(["attribution","flexibility","effectiveness"]),RangeError);
assert.throws(()=>M.attribution(1.2,.3,.8),RangeError); assert.throws(()=>M.attribution(.5,0,.8),RangeError);
// The rendered figures are well-formed for edge cases.
for(const s of [s0,s40,s100,UI.state(1,.3,.2),UI.state(.5,.95,.05)]) { assert.ok(!/NaN|undefined|Infinity/.test(UI.evidenceSVG(s)+UI.rocSVG(s)),"finite SVG"); }
console.log(`nobody-did-it: ${grid.length} parameter sets checked (posterior cut, integrals, ROC, precision bound, AUC); quoted figures and trilemma verified.`);
