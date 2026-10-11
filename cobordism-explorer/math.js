/* Exact finite-dimensional teaching model. No Floer invariants are computed. */
(function(root){
  'use strict';
  const mod=(x,p=2)=>p?((x%p)+p)%p:x;
  const mul=(A,B,p=2)=>A.map(row=>B[0].map((_,j)=>mod(row.reduce((s,a,k)=>s+a*B[k][j],0),p)));
  const apply=(A,v,p=2)=>A.map(row=>mod(row.reduce((s,a,i)=>s+a*v[i],0),p));
  const sub=(A,B,p=2)=>A.map((r,i)=>r.map((x,j)=>mod(x-B[i][j],p)));
  const equal=(A,B)=>JSON.stringify(A)===JSON.stringify(B);
  const zero=A=>A.every(r=>r.every(x=>x===0));
  const I=[[1,0],[0,1]], G=[[1,1],[0,1]], P0=[[1,0],[1,1]];
  const bases=[[[0,1],[1,0]],[[1,1],[0,1]],[[1,0],[1,1]]];
  function square(basis=0,broken=false,v=[1,1]){
    const P1=bases[basis], S=mul(mul(P1,G),P0); // P0 inverse is P0 over F2.
    if(broken)S[0][0]=mod(S[0][0]+1);
    const A=mul(P1,G),B=mul(S,P0), residual=sub(A,B);
    return {P0,P1,G,S,A,B,residual,commutes:zero(residual),top:apply(A,v),bottom:apply(B,v),input:v};
  }
  function signedCount(sign=1,field='Z'){const terms=[sign,sign,-sign];return {terms,total:field==='F2'?mod(terms.reduce((a,b)=>a+b,0)):terms.reduce((a,b)=>a+b,0)};}
  function collapse(t){if(t>=1)return {epsilon:0,neck:Infinity,metric:0};const epsilon=Math.exp(-6*t);return {epsilon,neck:-Math.log(epsilon),metric:epsilon*epsilon};}
  // Marching squares on a Cassini oval: |z-a|² |z+a|² = b⁴.
  function contour(t,n=46){
    const a=.9,b=1.35-.62*Math.sin(Math.PI*t)**2,lo=-2,span=4,segments=[];
    const val=(x,y)=>((x-a)**2+y*y)*((x+a)**2+y*y)-b**4;
    const edge=(p,q,v,w)=>{const f=v/(v-w);return [p[0]+f*(q[0]-p[0]),p[1]+f*(q[1]-p[1])];};
    for(let i=0;i<n;i++)for(let j=0;j<n;j++){
      const x=lo+span*i/n,y=lo+span*j/n,d=span/n;
      const p=[[x,y],[x+d,y],[x+d,y+d],[x,y+d]],v=p.map(q=>val(...q)),cuts=[];
      for(let k=0;k<4;k++){let h=(k+1)%4;if((v[k]<0)!==(v[h]<0))cuts.push(edge(p[k],p[h],v[k],v[h]));}
      if(cuts.length===2)segments.push(cuts);
      else if(cuts.length===4){segments.push([cuts[0],cuts[1]],[cuts[2],cuts[3]]);}
    }return segments;
  }
  const api={mod,mul,apply,sub,equal,zero,I,G,P0,bases,square,signedCount,collapse,contour};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CobMath=api;
})(typeof globalThis!=='undefined'?globalThis:this);
