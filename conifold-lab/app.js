(function(){
  'use strict';
  const M=ConifoldModel, $=id=>document.getElementById(id), all=s=>document.querySelectorAll(s);
  const palette={blue:'#a9cfff',lime:'#d5e6a2',ink:'#edf2f5',muted:'#9daebd',line:'#344959',orange:'#f5c498'};
  const state={mode:'local',phase:-100,yaw:20,pitch:-18,slice:false,ruling:'kernel',orbit:false,playing:false,ledger:'quintic',n:16,k:1,ledgerProgress:0,ledgerPlaying:false,example:'x9',lift:'base',relationProgress:0,relationPlaying:false,relationPreview:false,coeff:[1,-1,-1,1],weights:[3,2,1],node:null};
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas=$('geometry-canvas'), ctx=canvas.getContext('2d');
  let frame=0,lastTime=0,playStart=0,ledgerStart=0,relationStart=0,drag=null,tipTarget=null;
  const definitions={
    node:['Ordinary double point','The isolated singularity Σzⱼ² = 0 in C⁴, equivalently xy − zw = 0. Its local link is diffeomorphic to S² × S³.'],
    cotangent:['T* S³','The cotangent bundle of a three-sphere. The smoothing of the node has this local topology; its zero-section is a Lagrangian S³.'],
    small:['Small resolution','A resolution whose exceptional locus has complex codimension at least two. Here one singular point is replaced by a complex curve P¹, not a divisor.'],
    hopf:['Hopf fibres','The circles of the Hopf map S³ → S². Distinct fibres are linked; the canvas projects a finite sample of them from R⁴ into R³.'],
    kahler:['Kähler area','The integral of the Kähler form over the exceptional P¹. It is a geometric parameter on the resolution, separate from the complex smoothing parameter.'],
    tropical:['Tropical 2-cycle','An integral two-dimensional object in an affine degeneration base, with compatible tangent data. Relative cycles supply mirror 4-chains; the stricter CBM cycle conditions also give a 3-chain lift on the resolution.'],
    support:['Full-support relation','A relation with every node coefficient nonzero. A lattice can contain such a vector even if the currently selected vector has zero coefficients.'],
    circuit:['Circuit relation','For a parallelogram with a + c = b + d, the vector e_b + e_d − e_a − e_c. The node coefficients lie in K when their weighted sum of circuits vanishes.'],
    lattice:['The lattice K','The integral kernel of the circuit map. In the manuscript’s setting, it is the exceptional-curve relation lattice and also the relation lattice of vanishing spheres on the mirror.'],
    hodge:['Hodge numbers','For a Calabi–Yau threefold, h¹¹ counts Kähler classes and h²¹ counts complex-structure directions. In this compact conifold transition, h¹¹ drops by k and h²¹ rises by N − k.'],
    chain:['Chain and boundary','An integral chain is an oriented combination of geometric pieces. If a weighted sum of cycles is its boundary, that sum represents zero in homology.'],
    forced:['Forced zero','A coordinate which is zero for every vector in K. Checking all basis vectors detects it; moving the basis-weight sliders cannot remove it.']
  };
  const term=(key,label)=>`<button class="term" data-def="${key}">${label}</button>`;
  const fmt=n=>n>0?'+'+n:String(n), sub=n=>String(n).replace(/\d/g,d=>'₀₁₂₃₄₅₆₇₈₉'[d]);
  const text=(x,y,value,size=14,color=palette.ink,anchor='start',family='Arial, sans-serif')=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="${anchor}" font-family="${family}">${value}</text>`;
  const serif=(x,y,value,size=25,color=palette.ink,anchor='start')=>text(x,y,value,size,color,anchor,'Georgia, serif');
  const line=(x,y,a,b,color=palette.line,dash='')=>`<path d="M${x} ${y}L${a} ${b}" stroke="${color}" fill="none" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
  function select(attribute,value){const key=attribute.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());all(`[data-${attribute}]`).forEach(el=>{const on=el.dataset[key]===value;el.classList.toggle('selected',on);el.setAttribute('aria-pressed',String(on));});}
  function setMode(mode){if(mode!==state.mode){stopPlay();stopLedger();stopRelation();cancelAnimationFrame(frame);frame=0;lastTime=0;hideTip();}state.mode=mode;select('mode',mode);['local','topology','relations'].forEach(m=>$(m+'-panel').hidden=m!==mode);render();}
  function render(){renderLocal();renderLedger();renderRelations();if(state.mode==='local'){drawGeometry();schedule();}}

  function renderLocal(){
    const p=state.phase,mu=Math.max(0,-p/100),area=Math.max(0,p/100),type=p<0?'smooth':p>0?'resolve':'node';
    $('transition-slider').value=p;
    select('phase',type);select('ruling',state.ruling);
    $('geometry-badge').textContent=p<0?'SMOOTHING':p>0?'SMALL RESOLUTION':'SINGULAR NODE';
    $('geometry-badge').style.color=p>0?palette.lime:palette.blue;
    $('ruling-controls').hidden=p<=0;
    $('slice-view').disabled=p>0; $('slice-view').checked=state.slice;
    $('slice-note').textContent=p>0?'The resolution has an exceptional P¹. Use the cycle view here.':'The slice is two-dimensional. It is not the whole threefold.';
    $('parameter-name').textContent=p>0?'NORMALIZED AREA A':'SMOOTHING μ';
    $('parameter-value').textContent=(p>0?area:mu).toFixed(2);
    $('cycle-dimension').textContent=p<0?'S³':p>0?'S²':'point';
    $('yaw-slider').value=Math.round(state.yaw);$('pitch-slider').value=Math.round(state.pitch);
    if(p<0){
      $('local-title').textContent='Change the complex equation.';
      $('local-equation').textContent='z₁² + z₂² + z₃² + z₄² = μ';
      $('local-explanation').innerHTML=`<p>The real zero-section has radius √μ = ${Math.sqrt(mu).toFixed(2)} in the quadric coordinates. It is the vanishing ${term('cotangent','Lagrangian S³')}.</p><p>Decrease μ and the core collapses. The ambient smoothing has six real dimensions.</p>`;
      $('cycle-title').textContent=state.slice?'An explicit slice of the smoothing.':'A three-sphere waiting to vanish.';
      $('cycle-subtitle').textContent=state.slice?'u² + v² − w² = μ: a real two-dimensional hyperboloid.':'Each linked circle is a Hopf fibre on S³, projected into R³.';
      $('view-label').textContent=state.slice?'Real 2D equation slice':'S³ via a stereographic Hopf-fibre picture';
      $('projection-note').innerHTML=state.slice?'We set z₁ = u, z₂ = v, z₃ = iw, z₄ = 0. This drawing is a real surface inside the quadric.':`The vanishing S³ is projected from R⁴ into R³. ${term('hopf','Hopf fibres')} help reveal its structure; this is its core cycle, not the whole threefold.`;
    }else if(p===0){
      $('local-title').textContent='At the singular threshold.';
      $('local-equation').textContent='z₁² + z₂² + z₃² + z₄² = 0';
      $('local-explanation').innerHTML=`<p>The S³ has collapsed to the ${term('node','ordinary double point')}. This singular space is the common limit of the two smooth local models.</p><p>The next half of the control changes a Kähler parameter on a different space.</p>`;
      $('cycle-title').textContent='The point where topology can change.';
      $('cycle-subtitle').textContent='u² + v² − w² = 0: the node shown through its real double-cone slice.';
      $('view-label').textContent='Node · real double-cone slice';
      $('projection-note').textContent='The double cone is a real 2D slice. The complex threefold node has real dimension six.';
    }else{
      $('local-title').textContent='Replace the point by a line.';
      $('local-equation').textContent='xy − zw = 0, with [s : t] ∈ P¹';
      $('local-explanation').innerHTML=`<p>Over the node, the extra ${term('small','projective line')} is all of P¹ ≅ S². Its normal bundle is O(−1) ⊕ O(−1).</p><p>The control increases its ${term('kahler','Kähler area')}. The two incidence constructions give the two small resolutions, related by a flop.</p>`;
      $('ruling-equation').textContent=state.ruling==='kernel'?'xs + zt = 0,   ws + yt = 0':'sx + tw = 0,   sz + ty = 0';
      $('cycle-title').textContent='An exceptional sphere takes its place.';
      $('cycle-subtitle').textContent='P¹ ≅ S²: the exceptional core of a small resolution.';
      $('view-label').textContent=state.ruling==='kernel'?'Small resolution · kernel line':'Small resolution · cokernel line';
      $('projection-note').textContent='The sphere depicts the exceptional P¹. Its drawn radius is proportional to √A; A is normalized area, and no Ricci-flat metric is computed.';
    }
  }
  function setPhase(p){state.phase=Math.max(-100,Math.min(100,Math.round(p)));if(state.phase>0)state.slice=false;renderLocal();drawGeometry();}
  function stopFrameIfIdle(){if(!animationActive()){cancelAnimationFrame(frame);frame=0;lastTime=0;}}
  function stopPlay(){state.playing=false;$('play-transition').hidden=false;$('pause-transition').hidden=true;stopFrameIfIdle();}
  function play(){if(reduced){setPhase(0);return;}state.playing=true;playStart=performance.now();setPhase(-100);$('play-transition').hidden=true;$('pause-transition').hidden=false;schedule();}
  function animationActive(){return state.mode==='local'?(state.playing||state.orbit):state.mode==='topology'?state.ledgerPlaying:state.relationPlaying;}
  function schedule(){if(!frame&&animationActive())frame=requestAnimationFrame(tick);}
  function tick(t){frame=0;const dt=lastTime?Math.min(50,t-lastTime):16;lastTime=t;
    if(state.mode==='local'){
      if(state.playing){const elapsed=t-playStart;if(elapsed<4000)setPhase(-100+elapsed/40);else if(elapsed<5400)setPhase(0);else if(elapsed<9400)setPhase((elapsed-5400)/40);else{setPhase(100);stopPlay();}}
      if(state.orbit){state.yaw=((state.yaw+dt*.009+180)%360)-180;renderLocal();drawGeometry();}
    }else if(state.mode==='topology'&&state.ledgerPlaying){setLedgerProgress((t-ledgerStart)/10000);if(state.ledgerProgress===1)stopLedger();}
    else if(state.mode==='relations'&&state.relationPlaying){setRelationProgress((t-relationStart)/12000);if(state.relationProgress===1)stopRelation();}
    schedule();}

  const clamp=p=>Math.max(0,Math.min(1,p)),ease=p=>{p=clamp(p);return p*p*(3-2*p);};
  const ledgerStage=()=>state.ledgerProgress<.4?'resolution':state.ledgerProgress<=.6?'nodes':'smoothing';
  function stopLedger(){state.ledgerPlaying=false;$('ledger-play').hidden=false;$('ledger-pause').hidden=true;stopFrameIfIdle();}
  function playLedger(){if(reduced){setLedgerProgress(1);return;}ledgerStart=performance.now();state.ledgerPlaying=true;setLedgerProgress(0);$('ledger-play').hidden=true;$('ledger-pause').hidden=false;schedule();}
  function setLedgerProgress(p){state.ledgerProgress=clamp(p);renderLedger();}
  function stopRelation(){state.relationPlaying=false;$('relation-play').hidden=false;$('relation-pause').hidden=true;stopFrameIfIdle();}
  function playRelation(){const R=relationStatus();if(!R.valid||R.zero)return;if(reduced){setRelationProgress(1);return;}relationStart=performance.now();state.relationPlaying=true;state.node=null;setRelationProgress(0);$('relation-play').hidden=true;$('relation-pause').hidden=false;schedule();}
  function setRelationProgress(p){state.relationProgress=clamp(p);state.relationPreview=true;const lift=p<.32?'base':p<.64?'curves':'spheres';if(lift!==state.lift){state.lift=lift;renderRelations();}else{const R=relationStatus();drawRelations(M.examples[state.example],R);renderRelationAnimation(R);}}
  function renderRelationAnimation(R){
    $('relation-progress').value=Math.round(state.relationProgress*100);$('relation-progress').disabled=!R.valid||R.zero;$('relation-play').disabled=!R.valid||R.zero;
    const title=state.lift==='base'?'Trace the tropical cycle':state.lift==='curves'?'Lift to a 3-chain on the resolution':'Lift to a 4-chain on the mirror';
    $('relation-stage-title').textContent=title;
    $('relation-stage-detail').textContent=!R.valid||R.zero?'Choose a valid nonzero relation to animate its lift.':state.lift==='base'?(state.example==='x9'?'Follow q₁ → q₂ → q₄ → q₃ around the belt. The coefficients satisfy the circuit equation.':'Watch the support of the selected relation. Crossed nodes are zero throughout K.'):state.lift==='curves'?'The weighted exceptional curves form a boundary on X̂. The explicit tropical lift uses the strict CBM conditions.':R.forced.length?'The mirror boundary omits q₁ and q₆ in every relation. No full-support vector exists.':'T² fibres over the regular tropical base form part of Γ₄; its boundary is the weighted sum of mirror S³ cycles.';
  }

  function drawGeometry(){
    if(!ctx)return;
    const rect=canvas.getBoundingClientRect(),w=rect.width||900,h=rect.height||430,dpr=Math.min(window.devicePixelRatio||1,2);
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const yaw=state.yaw*Math.PI/180,pitch=state.pitch*Math.PI/180,center=[w*.50,h*.60],scale=Math.min(w*.165,h*((state.phase===0||state.slice)?.18:.235)),paths=[];
    const project=p=>{const q=M.rotate(p,yaw,pitch),d=6/(6-q[2]*.45);return{x:center[0]+q[0]*scale*d,y:center[1]-q[1]*scale*d,z:q[2]};};
    function addPath(points,color,width=1,alpha=.8,dashed=false){let prev=null;for(const p of points){const next=project(p);if(prev&&Math.abs(next.x-prev.x)<w*.8&&Math.abs(next.y-prev.y)<h*.8)paths.push({a:prev,b:next,z:(prev.z+next.z)/2,color,width,alpha,dashed});prev=next;}}
    // Faint floor and a stable origin establish depth without representing a CY metric.
    for(let i=-3;i<=3;i++){addPath([[i,-1.85,-3],[i,-1.85,3]],palette.line,.7,.3);addPath([[-3,-1.85,i],[3,-1.85,i]],palette.line,.7,.3);}
    const phase=state.phase,mu=Math.max(0,-phase/100),r=Math.sqrt(Math.abs(phase)/100);
    if(phase<0&&!state.slice){
      const fibres=[];for(const theta of [.45,.95,1.4,1.9,2.2])for(let j=0;j<5;j++)fibres.push({theta,phi:M.TAU*j/5});
      for(const {theta,phi} of fibres){const points=[];for(let j=0;j<=160;j++)points.push(M.stereo(M.hopfPoint(theta,phi,j/160*M.TAU),r*.32));addPath(points,palette.blue,1.35,.95);}
    }else if(phase<=0){
      // z=(u,v,iw,0) gives u²+v²−w²=μ exactly; only the display rotates it.
      for(let j=0;j<=24;j++){const z=-1.4+j/24*2.8,rr=Math.sqrt(mu+z*z),points=[];for(let a=0;a<=96;a++){const t=M.TAU*a/96;points.push([rr*Math.cos(t),z,rr*Math.sin(t)]);}addPath(points,palette.blue,1,j%3===0?.8:.25);}
      for(let j=0;j<24;j++){const t=j/24*M.TAU,points=[];for(let a=0;a<=80;a++){const z=-1.4+a/80*2.8,rr=Math.sqrt(mu+z*z);points.push([rr*Math.cos(t),z,rr*Math.sin(t)]);}addPath(points,palette.blue,1,.7);}
    }else{
      const radius=r*1.45;
      for(let j=1;j<12;j++){const theta=Math.PI*j/12,points=[];for(let a=0;a<=120;a++){const t=M.TAU*a/120;points.push([radius*Math.sin(theta)*Math.cos(t),radius*Math.cos(theta),radius*Math.sin(theta)*Math.sin(t)]);}addPath(points,palette.lime,1.2,.8);}
      for(let j=0;j<18;j++){const t=j/18*M.TAU,points=[];for(let a=0;a<=100;a++){const theta=Math.PI*a/100;points.push([radius*Math.sin(theta)*Math.cos(t),radius*Math.cos(theta),radius*Math.sin(theta)*Math.sin(t)]);}addPath(points,palette.lime,1,.75);}
      const equator=[];for(let a=0;a<=120;a++){const t=M.TAU*a/120;equator.push([radius*Math.cos(t),0,radius*Math.sin(t)]);}addPath(equator,palette.lime,2,.95);
    }
    paths.sort((a,b)=>a.z-b.z);for(const seg of paths){ctx.globalAlpha=seg.alpha*Math.max(.25,Math.min(1,.68+seg.z*.1));ctx.strokeStyle=seg.color;ctx.lineWidth=seg.width;ctx.setLineDash(seg.dashed?[4,5]:[]);ctx.beginPath();ctx.moveTo(seg.a.x,seg.a.y);ctx.lineTo(seg.b.x,seg.b.y);ctx.stroke();}
    ctx.globalAlpha=1;ctx.setLineDash([]);
    if(phase===0){const p=project([0,0,0]);ctx.fillStyle=palette.ink;ctx.shadowColor=palette.blue;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(p.x,p.y,4,0,M.TAU);ctx.fill();ctx.shadowBlur=0;}
    ctx.font='10px Arial';ctx.fillStyle=palette.muted;ctx.textAlign='right';ctx.fillText(phase<0?(state.slice?'REAL SLICE · 2D':'PROJECTED CORE · S³'):phase>0?'EXCEPTIONAL CORE · S²':'REAL SLICE · 2D',w-20,h-19);
  }

  function renderLedger(){
    const fixed=state.ledger==='quintic';if(fixed){state.n=16;state.k=1;}const L=M.ledger(state.n,state.k),stage=ledgerStage(),p=state.ledgerProgress;
    select('ledger',state.ledger);$('nodes-slider').disabled=fixed;$('rank-slider').disabled=fixed;
    select('ledger-stage',stage);$('ledger-progress').value=Math.round(p*100);$('ledger-progress').setAttribute('aria-valuetext',stage==='resolution'?'Exceptional curves contracting':stage==='nodes'?'Singular nodes':'Vanishing spheres opening');
    $('ledger-stage-title').textContent=stage==='resolution'?'Collapse the exceptional curves':stage==='nodes'?'Pause at the nodal threefold':'Open the vanishing spheres';
    $('ledger-stage-detail').textContent=stage==='resolution'?`${L.n} local exceptional P¹ curves span ${L.k} independent global ${L.k===1?'class':'classes'}. Each core contracts to its node.`:stage==='nodes'?`${L.n} ordinary double points. The cards show the two smooth endpoints; their Hodge numbers are not assigned to this singular limit.`:`The smoothing has ${L.n} local S³ cycles spanning ${L.c} independent global ${L.c===1?'class':'classes'}. The Hodge jump is Δh¹¹ = −${L.k}, Δh²¹ = +${L.c}.`;
    $('nodes-slider').value=state.n;$('rank-slider').max=state.n-1;$('rank-slider').value=state.k;
    $('nodes-output').textContent=state.n;$('rank-output').textContent=state.k;
    $('ledger-stats').innerHTML=[['Δ h¹¹',L.deltaH11],['Δ h²¹',L.deltaH21],['Δ b₃',L.deltaB3],['Δ χ',L.deltaEuler]].map(([name,n])=>`<div class="ledger-row"><span>${name}</span><strong>${fmt(n)}</strong></div>`).join('');
    $('ledger-note').innerHTML=fixed?'A quintic containing a plane has 16 nodes. Its projective small resolution has (h¹¹, h²¹) = (2, 86); the smooth quintic has (1, 101).':`Formal bookkeeping for N = ${state.n}, k = ${state.k}. This is not a claim that every choice is realized by a compact projective Calabi–Yau.`;
    let s=text(35,34,fixed?'THE QUINTIC CONTAINING A PLANE':'FORMAL TOPOLOGICAL BOOKKEEPING',10,palette.muted)+serif(35,76,'Small resolution',25,palette.lime)+serif(615,76,'Smoothing',25,palette.blue);
    s+=line(310,188,375,188,stage==='resolution'?palette.lime:palette.line)+line(525,188,590,188,stage==='smoothing'?palette.blue:palette.line)+`<path d="M578 181L590 188L578 195" fill="none" stroke="${stage==='smoothing'?palette.blue:palette.line}"/>`;
    s+=text(450,102,stage==='resolution'?'COLLAPSING P¹ CORES':stage==='nodes'?'SINGULAR LIMIT':'OPENING S³ CORES',9,stage==='resolution'?palette.lime:stage==='nodes'?palette.ink:palette.blue,'middle');
    const num=Math.min(state.n,32),cols=4,rows=Math.ceil(num/cols);
    const radius=stage==='resolution'?8*(1-ease(p/.4)):stage==='smoothing'?8*ease((p-.6)/.4):0;
    for(let i=0;i<num;i++){const x=409+(i%cols)*27.5,y=132+Math.floor(i/cols)*22;
      s+=`<g data-core="${stage}">`;
      if(radius>.45&&stage==='resolution')s+=`<circle cx="${x}" cy="${y}" r="${radius}" fill="none" stroke="${palette.lime}"/><ellipse cx="${x}" cy="${y}" rx="${radius}" ry="${radius*.34}" fill="none" stroke="${palette.lime}"/>`;
      else if(radius>.45){s+=`<ellipse cx="${x}" cy="${y}" rx="${radius}" ry="${radius*.5}" transform="rotate(-30 ${x} ${y})" fill="none" stroke="${palette.blue}"/><ellipse cx="${x}" cy="${y}" rx="${radius}" ry="${radius*.5}" transform="rotate(30 ${x} ${y})" fill="none" stroke="${palette.blue}"/>`;}
      else s+=`<circle cx="${x}" cy="${y}" r="2.8" fill="${palette.ink}"/>`;
      s+='</g>';
    }
    s+=serif(450,140+rows*22,`${state.n} local ${stage==='nodes'?'nodes':'cores'}`,19,palette.ink,'middle');
    function card(x,color,title,pair,euler,active){return `<rect x="${x}" y="110" width="260" height="184" rx="8" fill="#172532" stroke="${active?color:palette.line}" stroke-width="${active?1.5:1}"/>`+text(x+22,138,'ENDPOINT HODGE NUMBERS',9,palette.muted)+serif(x+22,180,pair,fixed?36:23,color)+text(x+22,210,'(h¹¹, h²¹)',12,palette.muted)+line(x+22,228,x+238,228)+text(x+22,257,title,12,palette.muted)+text(x+238,257,euler,18,color,'end');}
    s+=card(35,palette.lime,'Euler characteristic',fixed?'(2, 86)':'(h¹¹, h²¹)',fixed?'−168':'χ',stage==='resolution');
    s+=card(605,palette.blue,'Euler characteristic',fixed?'(1, 101)':`(h¹¹ − ${L.k}, h²¹ + ${L.c})`,fixed?'−200':`χ − ${2*L.n}`,stage==='smoothing');
    if(state.ledgerPlaying&&stage!=='nodes'){const q=stage==='resolution'?p/.4:(p-.6)/.4,x=stage==='resolution'?310+q*65:525+q*65;s+=`<circle cx="${x}" cy="188" r="3" fill="${stage==='resolution'?palette.lime:palette.blue}"/>`;}
    s+=line(35,322,865,322)+text(35,354,`${L.k} independent curve ${L.k===1?'class':'classes'}`,14,palette.lime)+text(35,379,`${L.curveRelations} relations among ${L.n} exceptional curves`,11,palette.muted);
    s+=text(605,354,`${L.c} independent sphere ${L.c===1?'class':'classes'}`,14,palette.blue)+text(605,379,`${L.sphereRelations} relations among ${L.n} vanishing spheres`,11,palette.muted);
    s+=text(450,413,'ONE TRANSITION · CURVE AND SPHERE RELATIONS ARE COMPLEMENTARY',9,palette.muted,'middle');
    $('topology-diagram').innerHTML=s;
  }

  const currentCoefficients=()=>state.example==='x9'?state.coeff.slice():M.combine(M.examples[state.example].basis,state.weights);
  function sumLabel(coeff,symbol){const terms=coeff.map((c,i)=>{if(!c)return null;return `${c<0?'−':i?' + ':''}${Math.abs(c)===1?'':Math.abs(c)}${symbol}${sub(i+1)}`;}).filter(Boolean);return terms.length?terms.join(' ').replace(/^\s*\+\s*/,''):'0';}
  function relationStatus(){const e=M.examples[state.example],coeff=currentCoefficients(),residual=state.example==='x9'?M.residualX9(coeff):[];return{coeff,residual,valid:residual.every(x=>x===0),zero:coeff.every(x=>x===0),full:coeff.every(x=>x!==0),forced:M.forcedZeros(e)};}
  function setExample(key){stopRelation();state.relationPreview=false;state.example=key;const e=M.examples[key];if(key==='x9')state.coeff=e.default.slice();else state.weights=e.default.slice();state.node=null;renderRelations(true);}
  function renderRelations(rebuild=false){
    const e=M.examples[state.example],R=relationStatus();select('example',state.example);select('lift',state.lift);
    const hasFull=R.forced.length===0;
    $('relation-stats').innerHTML=[['NODES',e.nodes],['RANK OF K',e.rankK],['MIRROR NODAL CODIMENSION',e.codim],['FULL SUPPORT EXISTS IN K',hasFull?'Yes':'No']].map(([label,n],i)=>`<div class="stat"><small>${label}</small><b class="${i===3?(hasFull?'yes':'no'):''}">${n}</b></div>`).join('');
    $('coefficient-heading').textContent=state.example==='x9'?'NODE COEFFICIENTS · DIRECT TEST':'BASIS WEIGHTS · ALWAYS IN K';
    const controls=$('coefficient-controls');
    if(rebuild||controls.dataset.example!==state.example){controls.dataset.example=state.example;const values=state.example==='x9'?state.coeff:state.weights;controls.innerHTML=values.map((value,i)=>`<div class="coeff-row"><label for="coeff-${i}">${state.example==='x9'?'a':'S'}${sub(i+1)}</label><input id="coeff-${i}" type="range" min="${state.example==='x9'?-2:-3}" max="${state.example==='x9'?2:3}" value="${value}" step="1" data-${state.example==='x9'?'coefficient':'weight'}="${i}" aria-label="${state.example==='x9'?'Node coefficient':'Basis weight'} ${i+1}"><output id="coeff-output-${i}">${fmt(value)}</output></div>`).join('');}
    const values=state.example==='x9'?state.coeff:state.weights;values.forEach((v,i)=>{$('coeff-'+i).value=v;$('coeff-output-'+i).textContent=fmt(v);});
    $('break-relation').hidden=state.example!=='x9';
    let title,body;
    if(!R.valid){title='The circuit sum fails.';body=`The selected coefficients are outside ${term('lattice','K')}. Their weighted ${term('circuit','circuit sum')} has a nonzero residual.`;}
    else if(R.zero){title='The zero relation.';body=`This vector is in K, but it has no support. Move a slider to choose a nonzero relation.`;}
    else if(R.full){title='A full-support relation.';body=`Every coefficient is nonzero. This selected vector supplies the ${term('support','full support')} condition, in the manuscript’s setting.`;}
    else{title=R.forced.length?'Two coordinates can never participate.':'A valid relation, with missing nodes.';body=R.forced.length?`${term('forced','Forced zeros')} at q₁ and q₆ occur in every vector of K. No slider choice can produce full support.`:`This vector belongs to K but has zero coefficients. Another vector in this lattice can have full support.`;}
    const residual=R.residual.map((c,i)=>c?`${c>0?'+':'−'}${Math.abs(c)===1?'':Math.abs(c)}e${sub(e.rayLabels[i])}`:'').filter(Boolean).join(' ').replace(/^\+\s*/,'');
    $('relation-result').innerHTML=`<div class="relation-result ${R.valid?'':'invalid'}"><h3>${title}</h3><p>${body}</p>${R.valid?'':`<div class="residual">Residual: ${residual}</div>`}</div>`;
    const selected=state.node!==null?`<b>Selected q${sub(state.node+1)}:</b> coefficient ${fmt(R.coeff[state.node])}. `:'';
    const selectedDetail=state.node!==null?(state.example==='x9'?`circ${sub(state.node+1)} = ${circuitText(state.node)}.`:`Basis entries: (${e.basis.map(b=>b[state.node]).join(', ')}).`):'Select a node in the diagram to inspect its coefficient.';
    $('relation-note').innerHTML=`${selected}${selectedDetail}<br><br>${e.label} · ${e.section}. ${state.example==='x9'?'Four circuits, one integral relation. The belt boundary visits q₁, q₂, q₄, q₃.':state.example==='x19'?'The default weights (3, 2, 1) give full support across all 16 nodes.':'The manuscript concludes that X′₂₀ has no smoothing: its lattice has no full-support vector.'}`;
    const symbol=state.lift==='curves'?'C':state.lift==='spheres'?'δ':'circ';
    const relation=sumLabel(R.coeff,symbol);
    $('relation-equation').innerHTML=state.lift==='base'?`${relation} ${R.valid?'= 0':'≠ 0'}<span class="sub">${state.example==='x9'?'Computed directly in the ray lattice.':'Computed as a combination of the manuscript’s basis vectors.'} K = ker(circuit map).</span>`:R.valid?`∂Γ${state.lift==='curves'?'₃':'₄'} = ${relation}<span class="sub">${state.lift==='curves'?'A 3-chain on the resolution X̂ bounds a sum of real 2D exceptional curves.':'A 4-chain on the mirror Y bounds a sum of real 3D vanishing spheres.'} This boundary represents zero in homology under the lifting hypotheses.</span>`:`${relation}: circuit check fails<span class="sub">The depicted lifting theorem does not provide this chosen combination as a boundary.</span>`;
    $('relation-caption').textContent=state.example==='x9'?(state.lift==='base'?'Schematic belt disc, with constant tangent field v = −d₀, d₀ = (4, 2, 1, 1). The complete affine base is not drawn.':state.lift==='curves'?'A schematic section of Γ₃. Its oriented boundary is a sum of exceptional P¹ curves on X̂.':'A schematic section of Γ₄. Above the regular part of the disc, the lift has T² fibres; its boundary lies on mirror Y.'):'Coefficient support diagram from Table 1. This layout is schematic, not a reconstruction of a tropical 2-cycle or affine base.';
    drawRelations(e,R);
    renderRelationAnimation(R);
  }
  function circuitText(i){const c=M.examples.x9.circuits[i];return Object.entries(c).map(([r,v])=>`${v>0?'+':'−'}e${sub(r)}`).join(' ').replace(/^\+\s*/,'');}
  function nodeGlyph(x,y,i,c,forced){
    const color=forced?palette.orange:c===0?palette.muted:c>0?palette.lime:palette.blue,selected=state.node===i;
    let s=`<g class="svg-action" data-node="${i}" tabindex="0" role="button" aria-label="Node ${i+1}, coefficient ${c}${forced?', forced zero':''}"><title>q${i+1}: ${fmt(c)}${forced?' · zero throughout K':''}</title>`;
    if(state.relationPreview){
      const R=relationStatus(),order=state.example==='x9'?[0,1,3,2]:R.coeff.map((v,j)=>v?j:-1).filter(j=>j>=0),local=clamp((state.relationProgress-(state.lift==='spheres'?.64:state.lift==='curves'?.32:0))/(state.lift==='spheres'?.36:.32)),active=order[Math.min(order.length-1,Math.floor(local*order.length))];
      if(i===active||forced)s+=`<circle class="lift-halo" cx="${x}" cy="${y}" r="${35+3*Math.sin(state.relationProgress*M.TAU*5)}" fill="none" stroke="${color}" stroke-width="2" opacity="${forced?.6:1}" ${forced?'stroke-dasharray="3 5"':''}/>`;
    }
    if(selected)s+=`<circle cx="${x}" cy="${y}" r="39" fill="none" stroke="${palette.ink}" stroke-width="1.5" stroke-dasharray="3 4"/>`;
    if(state.lift==='base')s+=`<circle cx="${x}" cy="${y}" r="28" fill="#1b2d3a" stroke="${color}" ${c===0?'stroke-dasharray="4 4"':''}/>`;
    else if(state.lift==='curves'){s+=`<circle cx="${x}" cy="${y}" r="28" fill="#1b2d3a" stroke="${color}"/><ellipse cx="${x}" cy="${y}" rx="28" ry="9" fill="none" stroke="${color}"/><ellipse cx="${x}" cy="${y}" rx="10" ry="28" fill="none" stroke="${color}" opacity=".4"/>`;}
    else{const spin=state.relationPreview?state.relationProgress*260:0;s+=`<ellipse cx="${x}" cy="${y}" rx="31" ry="18" transform="rotate(${-25+spin} ${x} ${y})" fill="none" stroke="${color}"/><ellipse cx="${x}" cy="${y}" rx="31" ry="18" transform="rotate(${25+spin} ${x} ${y})" fill="none" stroke="${color}"/><ellipse cx="${x}" cy="${y}" rx="31" ry="11" transform="rotate(${90+spin} ${x} ${y})" fill="#1b2d3a" fill-opacity=".6" stroke="${color}"/>`;}
    s+=serif(x,y+7,fmt(c),22,color,'middle')+text(x,y+49,`q${sub(i+1)}${forced?' · forced zero':''}`,forced?10:12,forced?palette.orange:palette.muted,'middle');
    if(forced)s+=line(x-23,y-23,x+23,y+23,palette.orange);
    return s+'</g>';
  }
  function drawRelations(e,R){
    const symbol=state.lift==='base'?'2D BASE':state.lift==='curves'?'3-CHAIN ON X̂':'4-CHAIN ON MIRROR Y';
    let s=text(35,31,`${e.label} · ${symbol}`,10,palette.muted)+text(865,31,'CLICK A NODE TO INSPECT',9,palette.muted,'end');
    if(state.example==='x9'){
      const points=[[285,145],[615,145],[285,345],[615,345]],boundary='M285 145L615 145L615 345L285 345Z';
      if(state.lift!=='base'){const depth=state.relationPreview&&state.lift==='curves'?ease((state.relationProgress-.32)/.25):1,dx=45*depth,dy=-50*depth;s+=`<path class="lift-volume" d="M285 145L${285+dx} ${145+dy}L${615+dx} ${145+dy}L${615+dx} ${345+dy}L615 345M${285+dx} ${145+dy}L${285+dx} ${345+dy}L285 345M${285+dx} ${345+dy}L${615+dx} ${345+dy}" fill="none" stroke="${palette.line}" stroke-dasharray="4 5"/><path d="${boundary}" fill="${R.valid?'#1f3b45':'#352d2b'}" fill-opacity=".45" stroke="${R.valid?palette.blue:palette.orange}" stroke-opacity=".4"/>`;}
      else s+=`<path d="${boundary}" fill="#203c48" fill-opacity=".5" stroke="${R.valid?palette.blue:palette.orange}" stroke-width="2"/>`;
      if(state.relationPreview&&state.lift==='base'){const progress=clamp(state.relationProgress/.28),total=1060,travel=progress*total;let x,y;if(travel<=330){x=285+travel;y=145;}else if(travel<=530){x=615;y=145+travel-330;}else if(travel<=860){x=615-(travel-530);y=345;}else{x=285;y=345-(travel-860);}s+=`<path class="belt-trace" d="${boundary}" fill="none" stroke="${palette.lime}" stroke-width="3" stroke-dasharray="${travel} ${total}"/><circle class="belt-traveller" cx="${x}" cy="${y}" r="5" fill="${palette.ink}"/>`;}
      s+=line(350,179,550,179,palette.line,'3 6')+line(350,315,550,315,palette.line,'3 6');
      for(let j=0;j<3;j++){const x=385+j*65;if(state.lift==='base'){s+=`<path d="M${x} 261L${x+24} 230M${x+13} 234L${x+24} 230L${x+23} 241" fill="none" stroke="${palette.lime}" opacity=".7"/>`;}else if(state.lift==='spheres'){const t=state.relationPreview?(state.relationProgress-.64)*M.TAU*5+j*1.2:0;s+=`<ellipse cx="${x}" cy="247" rx="21" ry="10" fill="none" stroke="${palette.blue}" opacity=".65"/><ellipse cx="${x}" cy="247" rx="11" ry="10" fill="none" stroke="${palette.blue}" opacity=".4"/>`;if(state.relationPreview)s+=`<circle class="fibre-traveller" cx="${x+21*Math.cos(t)}" cy="${247+10*Math.sin(t)}" r="2.5" fill="${palette.blue}"/>`;}}
      s+=serif(450,217,state.lift==='base'?'tropical belt disc':state.lift==='curves'?'Γ₃':'Γ₄',23,palette.ink,'middle');
      s+=text(450,287,state.lift==='base'?'v = −d₀':state.lift==='curves'?'∂Γ₃ = Σ aᵢ Cᵢ':'T² fibres over the regular base',12,palette.muted,'middle');
      points.forEach(([x,y],i)=>s+=nodeGlyph(x,y,i,R.coeff[i],false));
      s+=text(450,435,R.valid?'The oriented coefficients cancel in the circuit map.':'A broken coefficient leaves a nonzero circuit residual.',12,R.valid?palette.muted:palette.orange,'middle');
    }else{
      const cols=state.example==='x19'?4:5,rows=Math.ceil(e.nodes/cols),width=cols===4?560:650,left=(900-width)/2,spacing=width/(cols-1),height=275,top=100;
      s+=`<rect x="${left-52}" y="57" width="${width+104}" height="${height+92}" rx="18" fill="#1b303e" fill-opacity=".4" stroke="${palette.line}" ${state.lift!=='base'?'stroke-dasharray="5 7"':''}/>`;
      R.coeff.forEach((c,i)=>{const x=left+i%cols*spacing,y=top+Math.floor(i/cols)*height/(rows-1);s+=nodeGlyph(x,y,i,c,R.forced.includes(i));});
      s+=text(450,450,R.forced.length?'q₁ and q₆ are zero in every listed basis vector.':'Default weights show that full support exists in this lattice.',12,R.forced.length?palette.orange:palette.muted,'middle');
    }
    $('relation-diagram').innerHTML=s;
  }

  function showTip(el){const entry=definitions[el.dataset.def];if(!entry)return;tipTarget=el;const tip=$('tooltip'),dialog=el.closest('dialog[open]');(dialog||document.body).appendChild(tip);tip.innerHTML=`<b>${entry[0]}</b>${entry[1]}`;tip.hidden=false;const rect=el.getBoundingClientRect();tip.style.left=Math.max(12,Math.min(rect.left,window.innerWidth-312))+'px';tip.style.top=Math.max(12,Math.min(rect.bottom+10,window.innerHeight-tip.offsetHeight-12))+'px';el.setAttribute('aria-describedby','tooltip');}
  function hideTip(){if(tipTarget)tipTarget.removeAttribute('aria-describedby');tipTarget=null;$('tooltip').hidden=true;}
  function openDialog(id){hideTip();$(id).showModal();}
  $('glossary-list').innerHTML=Object.values(definitions).map(([name,body])=>`<div class="glossary-item"><b>${name}</b><p>${body}</p></div>`).join('');
  document.addEventListener('click',e=>{
    const el=e.target.closest('button,[data-node],#home');if(!el)return;
    if(el.dataset.mode){setMode(el.dataset.mode);return;}
    if(el.dataset.phase){stopPlay();setPhase({smooth:-100,node:0,resolve:100}[el.dataset.phase]);return;}
    if(el.dataset.ruling){state.ruling=el.dataset.ruling;renderLocal();drawGeometry();return;}
    if(el.dataset.ledger){stopLedger();state.ledger=el.dataset.ledger;renderLedger();return;}
    if(el.dataset.ledgerStage){stopLedger();setLedgerProgress({resolution:0,nodes:.5,smoothing:1}[el.dataset.ledgerStage]);return;}
    if(el.dataset.example){setExample(el.dataset.example);return;}
    if(el.dataset.lift){stopRelation();state.relationPreview=false;state.lift=el.dataset.lift;state.relationProgress={base:0,curves:.5,spheres:1}[state.lift];renderRelations();return;}
    if(el.dataset.node!==undefined){stopRelation();state.node=Number(el.dataset.node);renderRelations();return;}
    if(el.dataset.close){hideTip();$(el.dataset.close).close();return;}
    if(el.dataset.def){showTip(el);return;}
    switch(el.id){case'home':e.preventDefault();setMode('local');break;case'play-transition':play();break;case'pause-transition':stopPlay();break;case'ledger-play':playLedger();break;case'ledger-pause':stopLedger();break;case'relation-play':playRelation();break;case'relation-pause':stopRelation();break;case'camera-reset':state.yaw=20;state.pitch=-18;renderLocal();drawGeometry();break;case'restore-relation':setExample(state.example);break;case'break-relation':stopRelation();state.relationPreview=false;state.coeff[2]=0;renderRelations();break;case'glossary-open':openDialog('glossary-dialog');break;case'sources-open':case'about-open':openDialog('sources-dialog');break;}
  });
  document.addEventListener('input',e=>{const el=e.target;
    if(el.id==='transition-slider'){stopPlay();setPhase(Number(el.value));}
    else if(el.id==='yaw-slider'||el.id==='pitch-slider'){state[el.id==='yaw-slider'?'yaw':'pitch']=Number(el.value);renderLocal();drawGeometry();}
    else if(el.id==='nodes-slider'){stopLedger();state.n=Number(el.value);state.k=Math.min(state.k,state.n-1);renderLedger();}
    else if(el.id==='rank-slider'){stopLedger();state.k=Math.min(Number(el.value),state.n-1);renderLedger();}
    else if(el.id==='ledger-progress'){stopLedger();setLedgerProgress(Number(el.value)/100);}
    else if(el.id==='relation-progress'){stopRelation();if(relationStatus().valid&&!relationStatus().zero)setRelationProgress(Number(el.value)/100);}
    else if(el.dataset.coefficient!==undefined){stopRelation();state.relationPreview=false;state.coeff[Number(el.dataset.coefficient)]=Number(el.value);renderRelations();}
    else if(el.dataset.weight!==undefined){stopRelation();state.relationPreview=false;state.weights[Number(el.dataset.weight)]=Number(el.value);renderRelations();}
  });
  document.addEventListener('change',e=>{if(e.target.id==='slice-view'){state.slice=e.target.checked&&state.phase<=0;renderLocal();drawGeometry();}if(e.target.id==='auto-rotate'){state.orbit=e.target.checked;lastTime=0;schedule();}});
  document.addEventListener('pointerover',e=>{const el=e.target.closest('[data-def]');if(el)showTip(el);});
  document.addEventListener('pointerdown',e=>{if(e.target.closest('[data-node]'))stopRelation();});
  document.addEventListener('pointerout',e=>{const el=e.target.closest('[data-def]');if(el&&!el.contains(e.relatedTarget))hideTip();});
  document.addEventListener('focusin',e=>{if(e.target.closest('[data-node]'))stopRelation();const el=e.target.closest('[data-def]');if(el)showTip(el);});
  document.addEventListener('focusout',hideTip);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){hideTip();stopPlay();stopLedger();stopRelation();}const el=e.target.closest('[data-node]');if(el&&(e.key==='Enter'||e.key===' ')){e.preventDefault();stopRelation();state.node=Number(el.dataset.node);renderRelations();document.querySelector(`[data-node="${state.node}"]`).focus();}});
  canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,yaw:state.yaw,pitch:state.pitch};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;state.yaw=((drag.yaw+(e.clientX-drag.x)*.4+180)%360+360)%360-180;state.pitch=Math.max(-70,Math.min(70,drag.pitch+(e.clientY-drag.y)*.3));renderLocal();drawGeometry();});
  const endDrag=()=>drag=null;canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);
  window.addEventListener('resize',()=>{hideTip();if(state.mode==='local')drawGeometry();});
  if(reduced){$('auto-rotate').checked=false;$('play-transition').textContent='Show the singular threshold →';$('ledger-play').textContent='Show the smoothing →';$('relation-play').textContent='Show the mirror lift →';}
  // Test/export surface: state is copied so callers cannot mutate the application.
  window.ConifoldLab={snapshot:()=>JSON.parse(JSON.stringify({...state,...relationStatus(),ledgerData:M.ledger(state.n,state.k)})),exportDiagram:(name='relations')=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 ${name==='topology'?430:470}" width="900" height="${name==='topology'?430:470}"><rect width="100%" height="100%" fill="#14212c"/>${$(name==='topology'?'topology-diagram':'relation-diagram').innerHTML}</svg>`};
  render();
})();
