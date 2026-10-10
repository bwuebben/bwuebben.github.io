(function(root){
  'use strict';
  const TAU=2*Math.PI;
  const vector=(n,terms)=>Array.from({length:n},(_,i)=>terms[i+1]||0);
  const examples={
    x9:{label:'X₉',nodes:4,rankK:1,default:[1,-1,-1,1],basis:[[1,-1,-1,1]],order:[1,2,4,3],codim:3,section:'§11.1',
      circuits:[{6:1,8:1,3:-1,10:-1},{6:1,7:1,2:-1,3:-1},{5:1,8:1,4:-1,10:-1},{5:1,7:1,2:-1,4:-1}],rayLabels:[2,3,4,5,6,7,8,10]},
    x19:{label:'X₁₉',nodes:16,rankK:3,default:[3,2,1],codim:13,section:'§11.2, Table 1',basis:[
      vector(16,{2:1,3:-1,4:1,7:-1}),
      vector(16,{1:1,3:1,4:-1,5:-1,8:-1,9:-1,11:1,12:1,14:1,15:-1}),
      vector(16,{2:1,3:-1,6:-1,8:1,9:-1,10:1,11:1,12:-1,13:-1,16:1})]},
    x20:{label:'X₂₀',nodes:19,rankK:6,default:[1,1,1,1,1,1],codim:13,section:'§11.2, Table 1',basis:[
      vector(19,{14:-1,16:1,17:-1}),vector(19,{3:1,4:-1,14:1}),
      vector(19,{4:-1,5:1,9:-1,10:1}),vector(19,{2:1,5:-1,13:1}),
      vector(19,{13:-1,16:1,19:-1}),vector(19,{4:1,5:-1,7:1,8:-1,11:1,12:-1,15:1,18:-1})]}
  };
  function combine(basis,weights){return basis[0].map((_,i)=>basis.reduce((sum,row,j)=>sum+(weights[j]||0)*row[i],0));}
  function forcedZeros(example){return Array.from({length:example.nodes},(_,i)=>i).filter(i=>example.basis.every(row=>row[i]===0));}
  function residualX9(coefficients){const e=examples.x9;return e.rayLabels.map(ray=>e.circuits.reduce((sum,c,i)=>sum+(c[ray]||0)*coefficients[i],0));}
  function rank(matrix){const a=matrix.map(row=>row.slice());if(!a.length)return 0;let r=0;for(let col=0;col<a[0].length&&r<a.length;col++){let pivot=r;while(pivot<a.length&&Math.abs(a[pivot][col])<1e-10)pivot++;if(pivot===a.length)continue;[a[r],a[pivot]]=[a[pivot],a[r]];const p=a[r][col];for(let j=col;j<a[0].length;j++)a[r][j]/=p;for(let i=r+1;i<a.length;i++){const q=a[i][col];for(let j=col;j<a[0].length;j++)a[i][j]-=q*a[r][j];}r++;}return r;}
  function ledger(n,k){if(!Number.isInteger(n)||!Number.isInteger(k)||n<1||k<0||k>n)throw Error('Invalid node/rank data');return{n,k,c:n-k,deltaH11:-k,deltaH21:n-k,deltaB2:-k,deltaB3:2*(n-k),deltaEuler:-2*n,curveRelations:n-k,sphereRelations:k};}
  function quadricPoint(mu,u,v){const norm=Math.hypot(...u);u=u.map(x=>x/norm);const dot=u.reduce((s,x,i)=>s+x*v[i],0);const y=v.map((x,i)=>x-dot*u[i]);const radius=Math.sqrt(mu+y.reduce((s,x)=>s+x*x,0));return{x:u.map(x=>radius*x),y};}
  function quadricResidual(point,mu){return{real:point.x.reduce((s,x,i)=>s+x*x-point.y[i]*point.y[i],0)-mu,imag:2*point.x.reduce((s,x,i)=>s+x*point.y[i],0)};}
  function hopfPoint(theta,phi,t){const a=Math.cos(theta/2),b=Math.sin(theta/2);return[a*Math.cos(t+phi),a*Math.sin(t+phi),b*Math.cos(t),b*Math.sin(t)];}
  function stereo(p,radius=1){const d=Math.max(.0001,1-p[3]);return[p[0]/d*radius,p[1]/d*radius,p[2]/d*radius];}
  function rotate(p,yaw,pitch){const c=Math.cos(yaw),s=Math.sin(yaw),a=Math.cos(pitch),b=Math.sin(pitch);const x=p[0]*c+p[2]*s,z=-p[0]*s+p[2]*c;return[x,p[1]*a-z*b,p[1]*b+z*a];}
  const api={TAU,examples,vector,combine,forcedZeros,residualX9,rank,ledger,quadricPoint,quadricResidual,hopfPoint,stereo,rotate};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;root.ConifoldModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);
