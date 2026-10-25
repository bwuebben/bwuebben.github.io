// Checks for the models behind "The same law in a black hole and a stock market".
const assert=require("node:assert/strict");
const M=require("../../assets/essays/one-law-model.js");
const near=(a,b,tol,what)=>assert.ok(Math.abs(a-b)<=tol,`${what}: ${a} vs ${b} (tolerance ${tol})`);

// Integrate a function of the Marchenko–Pastur density with the substitution λ = 1+η−2√η cosθ.
function mpIntegral(q,g,steps=200000){
 const [a,b]=M.mpEdges(q);let s=0;
 for(let i=0;i<steps;i++){const th=Math.PI*(i+.5)/steps,x=(a+b)/2-(b-a)/2*Math.cos(th);
  s+=M.mpDensity(x,q)*g(x)*(b-a)/2*Math.sin(th)*Math.PI/steps;}
 return s;
}
// 1. The density has the stated mass, mean, moments and edges.
for(const q of [.05,.25,.5,.8,1.6,4]){
 near(mpIntegral(q,()=>1),Math.min(1,1/q),2e-5,"MP mass q="+q);
 near(mpIntegral(q,x=>x),1,2e-5,"MP mean q="+q);
 for(const k of [2,3,4]) near(mpIntegral(q,x=>x**k),M.mpMoment(k,q),1e-4*M.mpMoment(k,q),`MP moment ${k} q=${q}`);
}
assert.deepEqual([1,2,3,4,5].map(n=>[...Array(n)].reduce((s,_,j)=>s+M.narayana(n,j+1),0)),[1,2,5,14,42]);
assert.deepEqual(M.mpEdges(.25),[.25,2.25]);
// 2. The entropy deficit of the law is exactly η/2 for η ≤ 1 (the closed form used in the essay).
for(const eta of [.01,.1,.25,.5,.9,1]) near(mpIntegral(eta,x=>x*Math.log(x)),eta/2,eta===1?2e-3:2e-5,"∫λlogλ dMP η="+eta);

// 3. The eigenvalue routine agrees with known spectra and invariants.
const diag=[3,-1,2,0,5];
assert.deepEqual(M.symmetricEigenvalues(Float64Array.from([3,0,0,0,0,0,-1,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,5]),5),[...diag].sort((x,y)=>x-y));
const tri=M.symmetricEigenvalues([2,-1,0,-1,2,-1,0,-1,2],3);
[2-Math.SQRT2,2,2+Math.SQRT2].forEach((v,i)=>near(tri[i],v,1e-12,"tridiagonal eigenvalue"));
{
 const n=60,z=M.normals(11),A=new Float64Array(n*n);
 for(let i=0;i<n;i++)for(let j=0;j<=i;j++)A[i*n+j]=A[j*n+i]=z();
 const ev=M.symmetricEigenvalues(A,n);let tr=0,fro=0;
 for(let i=0;i<n;i++){tr+=A[i*n+i];for(let j=0;j<n;j++)fro+=A[i*n+j]**2;}
 near(ev.reduce((s,x)=>s+x,0),tr,1e-9,"trace"); near(ev.reduce((s,x)=>s+x*x,0),fro,1e-8,"Frobenius norm");
 // Each eigenvalue makes A − λI singular: check by Gaussian elimination with pivoting.
 for(const lam of [ev[0],ev[29],ev[59]]){
  const B=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>A[i*n+j]-(i===j?lam:0)));
  let minPivot=Infinity;
  for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(B[r][c])>Math.abs(B[p][c]))p=r;[B[c],B[p]]=[B[p],B[c]];
   minPivot=Math.min(minPivot,Math.abs(B[c][c]));for(let r=c+1;r<n;r++){const f=B[r][c]/B[c][c];for(let k=c;k<n;k++)B[r][k]-=f*B[c][k];}}
  assert.ok(minPivot<1e-8,"eigenvalue does not make A − λI singular");
 }
}

// 4. Simulated noise fills the predicted band; the trace is exact; entropy matches Page's leading term.
{
 const sim=M.simulate(200,800,3),[a,b]=M.mpEdges(.25);
 near(sim.eigs.reduce((s,x)=>s+x,0),200,1e-8,"trace of correlation matrix");
 near(sim.eigs[0],a,.04,"lower edge");near(sim.eigs[199],b,.12,"upper edge");
 assert.ok(sim.eigs.filter(x=>x>a-.05&&x<b+.1).length>=198,"eigenvalues inside the band");
 near(M.entropy(sim.eigs,200),Math.log(200)-.125,.01,"entropy of C/N, q = 1/4");
 const wide=M.simulate(300,150,5);
 assert.equal(wide.eigs.length,150);assert.equal(wide.zeros,150);assert.equal(wide.minVar,null);
 near(wide.eigs.reduce((s,x)=>s+x,0),300,1e-8,"trace when N > T");
 near(M.entropy(wide.eigs,300),Math.log(150)-.25,.015,"entropy of C/N, q = 2");
 const fine=M.simulate(400,1000,8);
 near(M.entropy(fine.eigs,400),M.pageLeading(400,1000),.005,"entropy against Page's leading term, q = 0.4");
}

// 5. Minimum-variance portfolio on pure noise: promised ≈ (1−q)/N, delivered ≈ 1/(N(1−q)).
for(const [N,T] of [[100,400],[100,200],[50,250]]){
 const q=N/T;let pr=0,de=0,inv=0;const runs=200;
 for(let s=1;s<=runs;s++){const m=M.simulate(N,T,100+s).minVar;pr+=m.promised*N;de+=m.delivered*N;inv+=1/m.promised;}
 pr/=runs;de/=runs;inv/=runs;
 // Exact finite-sample identity for Wishart matrices: E[1ᵀS⁻¹1] = N·T/(T−N−1).
 near(inv/(N*T/(T-N-1)),1,.03,`E[1ᵀS⁻¹1], N=${N}, T=${T}`);
 // N·(promised variance) is exactly χ²(T−N+1)/T, with mean 1 − q + 1/T.
 near(pr/(1-q+1/T),1,.03,`promised variance, q=${q}`);
 near(de*(1-q),1,.06,`delivered variance, q=${q}`);
}

// 6. Page's exact formula: harmonic numbers, a Monte Carlo of complex random states, and the half nat.
for(const n of [10,29,30,31,100,5000]){let s=0;for(let k=1;k<=n;k++)s+=1/k;near(M.harmonic(n),s,1e-12,"harmonic "+n);}
function complexRandomStateEntropy(m,Mdim,seed){
 const z=M.normals(seed),re=new Float64Array(m*Mdim),im=new Float64Array(m*Mdim);let norm=0;
 for(let i=0;i<m*Mdim;i++){re[i]=z();im[i]=z();norm+=re[i]**2+im[i]**2;}
 // ρ = ψψ† as a real symmetric 2m×2m matrix [[A,−B],[B,A]]: each eigenvalue appears twice.
 const R=new Float64Array(4*m*m);
 for(let i=0;i<m;i++)for(let j=0;j<m;j++){let A=0,B=0;
  for(let t=0;t<Mdim;t++){const ar=re[i*Mdim+t],ai=im[i*Mdim+t],br=re[j*Mdim+t],bi=im[j*Mdim+t];A+=ar*br+ai*bi;B+=ai*br-ar*bi;}
  A/=norm;B/=norm;R[i*2*m+j]=A;R[(i+m)*2*m+j+m]=A;R[i*2*m+j+m]=-B;R[(i+m)*2*m+j]=B;}
 const ev=M.symmetricEigenvalues(R,2*m);let S=0;for(const v of ev)if(v>1e-15)S-=v*Math.log(v);return S/2;
}
for(const [m,Md] of [[2,2],[4,8],[8,8]]){let s=0;const runs=4000;for(let r=0;r<runs;r++)s+=complexRandomStateEntropy(m,Md,9000+r);
 near(s/runs,M.pageExact(m,Md),.01,`Page exact vs Monte Carlo ${m}×${Md}`);}
near(M.pageExact(2,2),1/3,1e-12,"Page 2×2 = 1/3 nat");
for(const n of [20,40,80]){const m=2**(n/2);near(Math.log(m)-M.pageCurve(n,n/2),.5,2e-6,"half-nat shortfall at the Page time, n="+n);}
near(M.pageCurve(20,0),0,0,"no radiation");near(M.pageCurve(20,20),0,0,"no black hole");
near(M.pageCurve(24,6),M.pageCurve(24,18),1e-12,"Page curve symmetry");
console.log("One-law checks passed: Marchenko–Pastur mass, mean, Narayana moments and η/2 entropy integral; eigenvalue solver; band, trace and entropy of simulated noise; minimum-variance promise (1−q) and delivery 1/(1−q); Page's formula against Monte Carlo and the half-nat shortfall.");
