const assert=require("node:assert/strict");
const M=require("../cobordism-explorer/math.js");
// Paper I sandbox: S = N₁ F N₀⁻¹ makes the square commute for every basis choice; the altered map does not.
for(let b=0;b<3;b++){assert.ok(M.square(b,false).commutes);assert.ok(!M.square(b,true).commutes);}
for(let b=0;b<3;b++)for(const v of [[0,0],[1,0],[0,1],[1,1]]){const q=M.square(b,false,v);assert.deepEqual(q.top,q.bottom);}
// Paper II toy count: parity forgets the overall sign, the integer count does not.
assert.equal(M.signedCount(1,'Z').total,1);assert.equal(M.signedCount(-1,'Z').total,-1);assert.equal(M.signedCount(-1,'F2').total,1);
// Paper III model. The graded differential squares to zero before and after the one-component sign change.
const d=M.graded.d,dT=M.twist(d);
assert.deepEqual(M.graded.ranks,[3,2,2,2]);
for(let k=0;k<4;k++){assert.equal(d[k].length,M.graded.ranks[(k+3)%4]);assert.ok(d[k].every(r=>r.length===M.graded.ranks[k]));}
assert.ok(M.squaresToZero(d));assert.ok(M.squaresToZero(dT));
// Exactly the component leaving degree 0 changes.
assert.deepEqual(M.changedComponents(d,dT),[0]);
assert.deepEqual(M.changedComponents(d,d),[]);
// Signs by grading change an even number of components, so never d₀ alone.
const signs=[1,-1];
for(const a of signs)for(const b of signs)for(const c of signs)for(const e of signs){
 const changed=M.changedComponents(d,M.relabel(d,[a,b,c,e]));
 assert.equal(changed.length%2,0);
 assert.notDeepEqual(M.relabel(d,[a,b,c,e]),dT);
}
// The stated generator relations and homology: e₁ and e₃ are cycles, e₁ is a boundary, e₃ is not.
const col=(A,j)=>A.map(r=>r[j]);
assert.deepEqual(col(d[1],0),[1,0,0]);           // d₁f₁ = e₁
assert.deepEqual(col(d[2],0),[0,1]);             // d₂g₁ = f₂
assert.deepEqual(col(d[3],1),[0,1]);             // d₃h₂ = g₂
assert.deepEqual(col(d[0],1),[1,0]);             // d₀e₂ = h₁
assert.deepEqual(col(d[0],0),[0,0]);assert.deepEqual(col(d[0],2),[0,0]); // e₁, e₃ cycles
assert.ok(d[1].slice(1).every(r=>r.every(x=>x===0))); // the image of d₁ lies in ⟨e₁⟩, so e₃ is not a boundary
// The normalizer fixes the cycles, negates e₂, and intertwines the two differentials; the identity does not.
assert.deepEqual(M.normalizer,[[1,-1,1],[1,1],[1,1],[1,1]]);
assert.ok(M.intertwines(M.normalizer,d,dT));
assert.ok(!M.intertwines([[1,1,1],[1,1],[1,1],[1,1]],d,dT));
assert.ok(!M.intertwines([[-1,1,1],[1,1],[1,1],[1,1]],d,dT));
assert.ok(M.intertwines(M.normalizer,dT,d)); // A is an involution, so it also runs the other way
console.log("Square sandbox, signed count, graded complex relations, even relabelling parity, and the normalizer check passed.");
