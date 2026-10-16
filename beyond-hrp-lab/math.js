/* Small, dependency-free numerical engine. Allocation recursions follow study.py
   in bwuebben/beyond_hrp_and_cotton; a fixed balanced tree is used for teaching. */
(function(root){
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),norm=a=>Math.sqrt(dot(a,a)),mv=(A,x)=>A.map(r=>dot(r,x)),quad=(A,x)=>dot(x,mv(A,x));
const gross=w=>{let s=w.reduce((a,x)=>a+Math.abs(x),0);return s>1e-14?w.map(x=>x/s):w.map(()=>0)};
function solve(A,b){let m=A.map((r,i)=>[...r,b[i]]),n=b.length;for(let k=0;k<n;k++){let p=k;for(let i=k+1;i<n;i++)if(Math.abs(m[i][k])>Math.abs(m[p][k]))p=i;[m[k],m[p]]=[m[p],m[k]];if(Math.abs(m[k][k])<1e-18)throw Error('Singular covariance');for(let i=k+1;i<n;i++){let f=m[i][k]/m[k][k];for(let j=k;j<=n;j++)m[i][j]-=f*m[k][j]}}let x=Array(n).fill(0);for(let i=n-1;i>=0;i--)x[i]=(m[i][n]-m[i].slice(i+1,n).reduce((s,v,j)=>s+v*x[i+1+j],0))/m[i][i];return x}
function cholesky(A){let n=A.length,L=Array.from({length:n},()=>Array(n).fill(0));for(let i=0;i<n;i++)for(let j=0;j<=i;j++){let s=A[i][j];for(let k=0;k<j;k++)s-=L[i][k]*L[j][k];L[i][j]=i===j?Math.sqrt(Math.max(s,1e-16)):s/L[j][j]}return L}
function tree(ids=Array.from({length:8},(_,i)=>i)){if(ids.length===1)return{ids,id:ids.join('-')};let k=ids.length/2;return{ids,id:ids.join('-'),left:tree(ids.slice(0,k)),right:tree(ids.slice(k))}}
const vols=[.18,.22,.16,.24,.20,.17,.25,.19];
function covariance(rho){return vols.map((v,i)=>vols.map((u,j)=>v*u*(i===j?1:Math.floor(i/2)===Math.floor(j/2)?rho:rho*.25)))}
const shrunk=(A,g)=>A.map((r,i)=>r.map((x,j)=>i===j?x:g*x));
function stats(A,mu,ids,w){return{v:ids.reduce((s,i,k)=>s+w[k]*ids.reduce((t,j,l)=>t+A[i][j]*w[l],0),0),s:ids.reduce((s,i,k)=>s+mu[i]*w[k],0)}}
function cross(A,l,r,wl,wr){return l.reduce((s,i,k)=>s+wl[k]*r.reduce((t,j,m)=>t+A[i][j]*wr[m],0),0)}
function allocation(A,mu,g,method){let t=tree(),nodes={},out=Array(mu.length).fill(0);function rep(ids,signed){let d=ids.map(i=>1/A[i][i]),sum=d.reduce((s,x)=>s+x,0);return d.map((x,k)=>x/sum*(signed?(mu[ids[k]]<0?-1:1):1))}
function recurse(n,budget=1){if(!n.left){if(method==='sigmamu')return{w:[1],v:A[n.ids[0]][n.ids[0]],s:mu[n.ids[0]]};out[n.ids[0]]=budget*(method==='mu'&&mu[n.ids[0]]<0?-1:1);return}
let l=n.left,r=n.right,rl,rr;if(method==='sigmamu'){rl=recurse(l);rr=recurse(r)}else{let wl=rep(l.ids,method==='mu'),wr=rep(r.ids,method==='mu');rl={w:wl,...stats(A,mu,l.ids,wl)};rr={w:wr,...stats(A,mu,r.ids,wr)}}
let c=cross(A,l.ids,r.ids,rl.w,rr.w),a,b,degenerate=false;if(method==='hrp'){a=rr.v/(rl.v+rr.v);b=1-a}else{let det=rl.v*rr.v-(g*c)**2;let x=(rr.v*rl.s-g*c*rr.s)/det,y=(rl.v*rr.s-g*c*rl.s)/det;let denom=method==='sigmamu'?Math.abs(x)+Math.abs(y):x+y;if(Math.abs(denom)<1e-15){a=b=.5;degenerate=true}else{a=x/denom;b=y/denom}}
nodes[n.id]={id:n.id,ids:n.ids,l:l.ids,r:r.ids,vl:rl.v,vr:rr.v,sl:rl.s,sr:rr.s,c,a,b,degenerate};
if(method==='sigmamu'){let w=[...rl.w.map(x=>x*a),...rr.w.map(x=>x*b)];return{w,v:a*a*rl.v+b*b*rr.v+2*a*b*c,s:a*rl.s+b*rr.s}}recurse(l,budget*a);recurse(r,budget*b)}
let ret=recurse(t);if(method==='sigmamu')out=ret.w;return{raw:out,w:gross(out),nodes,tree:t}}
function sweep(A,mu,g,w){let x=w.slice();for(let i=0;i<x.length;i++)x[i]=(mu[i]-g*(dot(A[i],x)-A[i][i]*x[i]))/A[i][i];return x}
function trajectory(A,mu,g,max=200){let P=shrunk(A,g),target=solve(P,mu),w=mu.map((x,i)=>x/A[i][i]),states=[];function push(){states.push({w:w.slice(),res:norm(mv(P,w).map((x,i)=>x-mu[i]))/Math.max(norm(mu),1e-15),distance:norm(w.map((x,i)=>x-target[i]))/Math.max(norm(target),1e-15)})}push();for(let p=0;p<max;p++){if(states.at(-1).res<1e-10)break;w=sweep(A,mu,g,w);push()}return{states,target}}
function metrics(A,mu,w){let v=Math.sqrt(Math.max(0,quad(A,w)));return{ret:dot(mu,w),vol:v,sharpe:v>1e-14?dot(mu,w)/v:0,net:w.reduce((s,x)=>s+x,0)}}
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function experiment(A,mu,T,noise,seed){const rand=rng(seed),gauss=()=>Math.sqrt(-2*Math.log(Math.max(rand(),1e-12)))*Math.cos(2*Math.PI*rand()),L=cholesky(A),n=mu.length,ys=Array(21).fill(0),reps=40;for(let r=0;r<reps;r++){let xs=Array.from({length:T},()=>mv(L,Array.from({length:n},gauss))),mean=Array(n).fill(0);for(let x of xs)x.forEach((v,i)=>mean[i]+=v/T);let est=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>xs.reduce((s,x)=>s+(x[i]-mean[i])*(x[j]-mean[j]),0)/(T-1)+(i===j?1e-8:0))),forecast=mu.map(x=>x+noise*gauss());for(let k=0;k<=20;k++){let w=solve(shrunk(est,k/20),forecast);ys[k]+=metrics(A,mu,w).sharpe/reps}}
return ys.map((y,k)=>({x:k/20,y}))}
const api={dot,norm,mv,quad,gross,solve,tree,vols,covariance,shrunk,allocation,sweep,trajectory,metrics,experiment};root.PortfolioMath=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
