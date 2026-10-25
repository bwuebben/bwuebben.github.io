const assert=require("node:assert/strict");
const M=require("../../assets/essays/nothing-condenses-alone-model.js");
const preset=id=>M.presets.find(p=>p.id===id);
const all=p=>p.charges.map((_,i)=>i);
const dot=(row,v)=>row.reduce((s,x,i)=>s+x*v[i],0);

// Kernel vectors are relations: Q·a = 0, and their number is k − rank.
let seed=7;
const rand=()=>{seed=(seed*1103515245+12345)%2147483648;return seed/2147483648;};
for(let t=0;t<400;t++){
 const d=1+Math.floor(rand()*3),k=1+Math.floor(rand()*5);
 const Q=Array.from({length:d},()=>Array.from({length:k},()=>Math.floor(rand()*7)-3));
 const basis=M.kernelBasis(Q,k);
 assert.equal(basis.length,k-M.rank(Q));
 for(const v of basis){ assert.ok(Q.every(row=>dot(row,v)===0)); assert.equal(v.reduce(M.gcd,0),1); }
 if(basis.length){ // a generic relation is nonzero exactly on the union of the supports
  const g=M.genericRelation(basis);
  assert.ok(Q.every(row=>dot(row,g)===0));
  for(let j=0;j<k;j++) assert.equal(g[j]!==0,basis.some(v=>v[j]!==0));
 }
}

// Two homologous curves: C₁ − C₂ = 0, so ℂ²/ℤ₂; neither condenses alone.
let r=M.analyse(preset("pair").charges,[0,1]);
assert.deepEqual(r.relation,[1,-1]); assert.equal(r.m,2); assert.ok(r.allowed&&r.saturated);
assert.deepEqual([r.dh11,r.dh21],[-1,1]);
for(const i of [0,1]){ r=M.analyse(preset("pair").charges,[i]); assert.ok(!r.allowed); assert.deepEqual(r.blocked,[i]); }

// Three-term relation C₁ + C₂ − C₃ = 0: m = 3, rank two, and no pair can move.
r=M.analyse(preset("triangle").charges,[0,1,2]);
assert.deepEqual(r.relation,[1,1,-1]); assert.equal(r.m,3); assert.deepEqual([r.dh11,r.dh21],[-2,1]);
for(const S of [[0,1],[0,2],[1,2]]) assert.equal(M.analyse(preset("triangle").charges,S).condensing.length,0);

// A curve with no partner stays put while the homologous pair condenses.
r=M.analyse(preset("orphan").charges,[0,1,2]);
assert.deepEqual(r.condensing,[0,1]); assert.deepEqual(r.blocked,[2]); assert.ok(!r.allowed); assert.equal(r.m,2);
assert.deepEqual(M.analyse(preset("orphan").charges,[2]).blocked,[2]);

// The four light states on the face of X₉: relation (1,1,−1,1) as in the finite-Planck paper,
// a saturated rank-three lattice, ℂ²/ℤ₄, and the Hodge shift (6,122) → (3,123).
const x9=preset("x9");
r=M.analyse(x9.charges,all(x9));
assert.deepEqual(r.relation,[1,1,-1,1]); assert.equal(r.rank,3); assert.equal(r.relations,1);
assert.equal(r.m,4); assert.ok(r.saturated&&r.allowed);
assert.deepEqual([x9.hodge[0]+r.dh11,x9.hodge[1]+r.dh21],[3,123]);
assert.equal(M.formatRelation(r.relation,x9.labels),"C₁ + C₂ − e₁ + e₂ = 0");
// For a saturated corank-one lattice the relation is the vector of maximal minors (Cramer's rule).
const Q=M.chargeMatrix(x9.charges,all(x9));
const minors=[0,1,2,3].map(j=>Math.abs(M.det(Q.map(row=>row.filter((_,c)=>c!==j)))));
assert.deepEqual(minors,r.relation.map(Math.abs));
// No proper subset of the four can condense on its own.
for(let mask=1;mask<15;mask++){
 const S=[0,1,2,3].filter(i=>mask&(1<<i));
 assert.equal(M.analyse(x9.charges,S).condensing.length,0,"subset "+S);
}

// Several relations: three equal charges give a Higgs branch of quaternionic dimension two, with no single m.
r=M.analyse([[1,0],[1,0],[1,0]],[0,1,2]);
assert.equal(r.relations,2); assert.equal(r.m,null); assert.ok(r.allowed);
assert.ok(r.relation.every(x=>x!==0));
// An index-two charge lattice is flagged as unsaturated.
assert.equal(M.determinantalDivisor([[2,2]]),2);
assert.equal(M.analyse([[2],[2]],[0,1]).saturated,false);

// The drawn chain of weighted charges returns to its starting point.
const loop=svg=>svg.match(/class="ncal-fill" points="([^"]+)"/)[1].split(" ").map(s=>s.split(",").map(Number));
for(const p of M.presets){
 const svg=M.diagram(p,all(p),"compact");
 assert.ok(svg.includes('class="ncal-arrow"'));
 const pts=loop(svg),[a,b]=[pts[0],pts[pts.length-1]];
 assert.ok(Math.hypot(a[0]-b[0],a[1]-b[1])<0.2,p.id+" chain does not close");
 const free=M.diagram(p,all(p),"decoupled");
 assert.ok(!free.includes('class="ncal-arrow"')&&free.includes('class="ncal-free"'));
}
assert.ok(M.diagram(preset("orphan"),[0,1,2],"compact").includes('class="ncal-blocked"'));
console.log("Kernels, generic relations, the four presets (m = 2, 3, 2 and 4), the X₉ Hodge shift, blocked sectors and diagrams checked.");
