/* Exact two-label quartic wall crossing. Coefficients are rational BigInts. */
(function(root,factory){const m=factory();if(typeof module==='object'&&module.exports)module.exports=m;else root.CollisionModel=m;})(globalThis,function(){
  'use strict';
  function gcd(a,b){a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b];}return a;}
  function R(n,d=1){
    if(n&&typeof n==='object'&&'n'in n)return n;
    n=BigInt(n);d=BigInt(d);if(d===0n)throw new RangeError('Zero denominator');
    if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return {n:n/g,d:d/g};
  }
  const plus=(a,b)=>{a=R(a);b=R(b);return R(a.n*b.d+b.n*a.d,a.d*b.d);};
  const times=(a,b)=>{a=R(a);b=R(b);return R(a.n*b.n,a.d*b.d);};
  const neg=a=>times(a,-1), minus=(a,b)=>plus(a,neg(b));
  const divide=(a,b)=>{a=R(a);b=R(b);return R(a.n*b.d,a.d*b.n);};
  const str=a=>{a=R(a);return a.d===1n?String(a.n):`${a.n}/${a.d}`;};
  const number=a=>{a=R(a);return Number(a.n)/Number(a.d);};
  const equalR=(a,b)=>{a=R(a);b=R(b);return a.n===b.n&&a.d===b.d;};
  function put(p,key,c){const v=plus(p.get(key)||R(0),c);if(v.n===0n)p.delete(key);else p.set(key,v);}
  function poly(terms){const p=new Map();for(const [mask,i,j,n,d=1]of terms)put(p,`${mask},${i},${j}`,R(n,d));return p;}
  const mono=(i,j,mask=0)=>poly([[mask,i,j,1]]);
  function add(...ps){const r=new Map();for(const p of ps)for(const [k,c]of p)put(r,k,c);return r;}
  function scale(p,c){const out=new Map();for(const [k,v]of p)put(out,k,times(v,c));return out;}
  function multiply(p,q){const out=new Map();for(const [a,c]of p)for(const [b,d]of q){const [m,i,j]=a.split(',').map(Number),[n,k,l]=b.split(',').map(Number);if(m&n)continue;put(out,`${m|n},${i+k},${j+l}`,times(c,d));}return out;}
  function X(a,b,p){const out=new Map();for(const [key,c]of p){const [mask,i,j]=key.split(',').map(Number);put(out,`${mask},${i+a},${j+b}`,times(c,(b+1)*i-(a+1)*j));}return out;}
  function generator(p,mask,a,b,c){const out=new Map();for(const [key,v]of X(a,b,p)){const [old,i,j]=key.split(',').map(Number);if(old&mask)continue;put(out,`${old|mask},${i},${j}`,times(c,v));}return out;}
  function act(p,op,c=R(0)){
    const sign=op.sign||1;
    if(op.id==='S1')return add(p,generator(p,1,1,0,R(-sign,2)));
    if(op.id==='S2')return add(p,generator(p,2,0,1,R(-sign,2)));
    if(op.id==='U')return add(p,generator(p,3,1,1,times(c,sign)));
    throw new RangeError('Unknown wall');
  }
  function apply(p,word,c){return word.reduce((s,op)=>act(s,op,c),p);}
  function equal(p,q){return add(p,scale(q,-1)).size===0;}
  function serialize(p){return [...p].sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,str(v)]);}
  const initial=()=>poly([[0,4,0,1],[0,0,4,1],[1,1,4,-4],[2,0,5,-2],[3,1,5,12]]);
  const target=()=>poly([[0,4,0,1],[0,0,4,1],[1,5,0,-2],[2,4,1,-4],[3,5,1,12]]);
  const coefficients=p=>[p.get('3,1,5')||R(0),p.get('3,5,1')||R(0)];
  function crossings(route,c=R(0),reverse=false){
    if(!['upper','lower'].includes(route))throw new RangeError('Unknown path');
    const level=route==='upper'?R(1,10):R(-1,10);
    const supports=[['S1',3,4],['S2',3,2]];
    if(route==='upper'&&R(c).n!==0n)supports.push(['U',1,1]);
    let events=supports.map(([id,n1,n2])=>{
      const x=neg(divide(times(n2,level),n1));
      // End connectors at x=±1/4 miss every wall. Total path length is 7/10.
      const progress=divide(plus(R(7,20),x),R(7,10));
      return {id,x,level,progress,sign:1};
    }).sort((a,b)=>number(minus(a.x,b.x)));
    if(reverse)events=events.reverse().map(e=>({...e,progress:minus(1,e.progress),sign:-1}));
    return events;
  }
  function endpoint(route,c=R(0)){return apply(initial(),crossings(route,c),c);}
  function atProgress(route,c,reverse,progress){
    const events=crossings(route,c,reverse), start=reverse?endpoint(route,c):initial();
    const passed=events.filter(e=>number(e.progress)<=progress+1e-12);
    return {p:apply(start,passed,c),events,passed,start};
  }
  function compare(c){
    const upper=crossings('upper',c),lower=crossings('lower',c);
    const dx=add(apply(mono(1,0),upper,c),scale(apply(mono(1,0),lower,c),-1));
    const dy=add(apply(mono(0,1),upper,c),scale(apply(mono(0,1),lower,c),-1));
    return {upper:endpoint('upper',c),lower:endpoint('lower',c),dx,dy,consistent:dx.size===0&&dy.size===0};
  }
  function period(p){const [a,b]=coefficients(p);return minus(6,divide(plus(a,b),2));}
  function normalize(p){return act(p,{id:'U'},divide(coefficients(p)[0],8));}
  const K=[[-1n,2n],[-10n,19n]],I=[[1n,0n],[0n,1n]];
  const mm=(A,B)=>A.map(row=>B[0].map((_,j)=>row.reduce((s,v,k)=>s+v*B[k][j],0n)));
  function inverse(A){const d=A[0][0]*A[1][1]-A[0][1]*A[1][0];if(d!==1n)throw new RangeError('Unimodular matrix required');return [[A[1][1],-A[0][1]],[-A[1][0],A[0][0]]];}
  function holonomy(n){if(!Number.isInteger(n)||Math.abs(n)>12)throw new RangeError('Integer loop count from -12 to 12 required');let out=I.map(r=>r.slice());for(let i=0;i<Math.abs(n);i++)out=mm(out,n<0?inverse(K):K);return out;}
  function threshold(r,s,descendent=false){
    if(!Number.isInteger(r)||!Number.isInteger(s)||r<2||s<2)throw new RangeError('Integer exponents at least two required');
    const central=minus(minus(2,R(2,r)),R(2,s)),primary=central.n>=central.d;
    return {central,dependent:descendent||primary,insertions:descendent?1:!primary?Infinity:Math.min(r,s)>=4?2:3};
  }
  return {R,plus,minus,times,divide,neg,str,number,equalR,poly,mono,add,scale,multiply,X,generator,act,apply,equal,serialize,initial,target,coefficients,crossings,endpoint,atProgress,compare,period,normalize,K,I,mm,inverse,holonomy,threshold};
});
