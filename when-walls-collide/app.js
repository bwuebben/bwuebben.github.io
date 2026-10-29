(function () {
  'use strict';
  const M = window.CollisionModel, $ = id => document.getElementById(id);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const state = {tick:0, route:'upper', reverse:false, progress:0, playing:false, loops:0, surface:'annulus', observable:'coefficients', normalized:false, r:4, s:4, descendent:false};
  let pathFrame = 0, loopFrame = 0, loopPosition = 0, looping = false, lastCrossing = '';
  const coefficient = () => M.R(state.tick,4);
  const display = v => M.str(v).replace(/-/g,'−');
  const pair = p => '(' + M.coefficients(p).map(display).join(', ') + ')';
  const superscript = n => String(n).replace(/[0-9-]/g, c => '⁰¹²³⁴⁵⁶⁷⁸⁹⁻'['0123456789-'.indexOf(c)]);
  function polynomial(p) {
    if (!p.size) return '0';
    return [...p].sort(([a],[b]) => {
      const x=a.split(',').map(Number),y=b.split(',').map(Number);
      return x[0]-y[0] || y[1]-x[1] || y[2]-x[2];
    }).map(([key,c],index) => {
      const [mask,i,j]=key.split(',').map(Number);
      const term=(mask&1?'t₁':'')+(mask&2?'t₂':'')+(i?'x'+(i===1?'':superscript(i)):'')+(j?'y'+(j===1?'':superscript(j)):'');
      const absolute=M.R(c.n<0n?-c.n:c.n,c.d);
      return (c.n<0n?(index?' − ':'−'):(index?' + ':''))+(term&&M.equalR(absolute,1)?'':display(absolute)) + term;
    }).join('');
  }
  function svgElement(tag, attrs={}, parent) {
    const n=document.createElementNS('http://www.w3.org/2000/svg',tag);
    for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);
    if(parent)parent.appendChild(n);return n;
  }
  function text(parent,x,y,value,attrs={}) { const n=svgElement('text',{x,y,...attrs},parent);n.textContent=value;return n; }
  function line(parent,x1,y1,x2,y2,attrs={}) { return svgElement('line',{x1,y1,x2,y2,...attrs},parent); }
  function pressed(selector,value) { document.querySelectorAll(selector).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.route===value||b.dataset.surface===value||b.dataset.observable===value))); }
  const label = (event) => ({S1:'Σ₁',S2:'Σ₂',U:'U'}[event.id]) + (event.sign<0?'⁻¹':'');
  function pointAt(progress,route,reverse) {
    const t=reverse?1-progress:progress, distance=.7*t, level=route==='upper'?.1:-.1;
    if(distance<=.1)return [-.25,level*distance/.1];
    if(distance<=.6)return [-.25+distance-.1,level];
    return [.25,level*(.7-distance)/.1];
  }
  function drawPath() {
    const svg=$('path-svg'),w=Math.max(300,svg.clientWidth),h=Math.max(250,w*.52),cx=w/2,cy=h/2;
    svg.replaceChildren();svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    const scale=Math.min((w-48)/.55,(h-62)/.3),pt=(x,y)=>[cx+x*scale,cy-y*scale];
    const defs=svgElement('defs',{},svg),clip=svgElement('clipPath',{id:'path-clip'},defs);
    svgElement('rect',{x:8,y:12,width:w-16,height:h-24},clip);
    const chart=svgElement('g',{'clip-path':'url(#path-clip)'},svg);
    const axisY=.15,axisX=.27;
    line(chart,...pt(-axisX,0),...pt(axisX,0),{class:'axis'});
    line(chart,...pt(0,-axisY),...pt(0,axisY),{class:'axis'});
    const supports=[{a:3,b:4,color:'var(--accent)'},{a:3,b:2,color:'var(--blue)'}];
    for(const s of supports)line(chart,...pt(-s.b/s.a*axisY,axisY),...pt(s.b/s.a*axisY,-axisY),{stroke:s.color,'stroke-width':2});
    if(state.tick!==0)line(chart,...pt(0,0),...pt(-axisY,axisY),{stroke:'var(--gold)','stroke-width':3});
    for(const route of ['upper','lower']) {
      const level=route==='upper'?.1:-.1,points=[[-.25,0],[-.25,level],[.25,level],[.25,0]].map(p=>pt(...p).join(',')).join(' ');
      svgElement('polyline',{points,fill:'none',stroke:route===state.route?'var(--ink)':'var(--ink-soft)','stroke-width':route===state.route?2:1.2,'stroke-dasharray':route===state.route?'none':'4 5',opacity:route===state.route?1:.5},chart);
      text(svg,...pt(route==='upper'?.11:-.11,level+(route==='upper'?.025:-.04)),route==='upper'?'Upper':'Lower',{'text-anchor':'middle'});
    }
    const current=M.atProgress(state.route,coefficient(),state.reverse,state.progress);
    for(const event of current.events){const done=current.passed.includes(event);svgElement('circle',{cx:pt(M.number(event.x),M.number(event.level))[0],cy:pt(M.number(event.x),M.number(event.level))[1],r:done?4:3,fill:done?'var(--accent)':'var(--bg)',stroke:'var(--ink-soft)','stroke-width':1},chart);}
    svgElement('circle',{cx,cy,r:4,fill:'var(--bg)',stroke:'var(--ink)','stroke-width':1.2},chart);
    for(const x of [-.25,.25])svgElement('circle',{cx:pt(x,0)[0],cy,r:4,fill:'var(--ink)'},chart);
    text(svg,...pt(-.25,-.035),state.reverse?'Finish':'Start',{'text-anchor':'middle',class:'fine'});
    text(svg,...pt(.25,-.035),state.reverse?'Start':'Finish',{'text-anchor':'middle',class:'fine'});
    text(svg,cx+8,cy-10,'joint',{class:'fine'});
    text(svg,...pt(.01,.15),'s₂',{class:'fine'});
    const [x,y]=pt(...pointAt(state.progress,state.route,state.reverse));
    svgElement('circle',{cx:x,cy:y,r:8,fill:'var(--bg)',stroke:'var(--accent)','stroke-width':2},svg);
    svgElement('circle',{cx:x,cy:y,r:3,fill:'var(--accent)'},svg);
    svg.setAttribute('aria-label',`${state.route} route, ${state.reverse?'reverse':'forward'} travel, ${Math.round(state.progress*100)} percent complete; ${current.passed.length} of ${current.events.length} walls crossed.`);
  }
  function renderJourney() {
    const current=M.atProgress(state.route,coefficient(),state.reverse,state.progress),[a,b]=M.coefficients(current.p);
    $('current-a').textContent=display(a);$('current-b').textContent=display(b);
    $('current-polynomial').textContent=polynomial(current.p);
    $('path-progress').value=Math.round(state.progress*1000);$('progress-out').textContent=Math.round(state.progress*100)+'%';
    $('ledger-title').textContent=state.progress>=1?(state.reverse?'Back at the beginning':'At the endpoint'):current.passed.length?`After ${label(current.passed.at(-1))}`:'Before the first crossing';
    $('crossing-ribbon').replaceChildren();
    current.events.forEach((e,i)=>{const n=document.createElement('span');n.textContent=label(e);n.className=i<current.passed.length?'done':'';if(i<current.passed.length)n.setAttribute('aria-label',label(e)+' crossed');$('crossing-ribbon').append(n);});
    const status=state.progress>=1?(state.reverse?'The inverse crossings recover the starting potential.':'The journey is complete. Compare the forward endpoints below.'):current.passed.length===0?`${state.reverse?'Starting at this route’s forward endpoint.':'Starting at Wᵐⁱⁿ.'} Next: ${label(current.events[0])}.`:`${current.passed.length} of ${current.events.length} crossings complete.${current.passed.length<current.events.length?' Next: '+label(current.events[current.passed.length])+'.':' No further walls on this route.'}`;
    if(status!==lastCrossing){$('crossing-status').textContent=status;lastCrossing=status;}
    $('step-path').disabled=state.progress>=1;$('finish-path').disabled=state.progress>=1;
    $('play-path').textContent=state.playing?'Pause':state.progress>=1?'Replay the path':reduced.matches?'Follow to endpoint':'Follow the path';
    $('play-path').setAttribute('aria-pressed',String(state.playing));
    drawPath();
  }
  function renderCoefficient() {
    const c=coefficient(),comparison=M.compare(c);
    $('wall-coefficient').value=state.tick;$('coefficient-display').textContent=display(c);$('coefficient-out').textContent=display(c);
    $('wall-coefficient').setAttribute('aria-valuetext',display(c));
    $('wall-count').textContent=state.tick===0?'Two walls':'Two walls + one ray';$('mixed-legend').hidden=state.tick===0;
    for(const [id,p]of [['upper-pair',comparison.upper],['lower-pair',comparison.lower],['corrected-upper',comparison.upper],['corrected-lower',comparison.lower]])$(id).textContent=pair(p);
    for(const id of ['path-agreement','consistency-verdict']){$(id).classList.toggle('good',comparison.consistent);$(id).textContent=comparison.consistent?'The paths agree as operators.':'The paths disagree.';}
    $('residual-x').textContent=polynomial(comparison.dx);$('residual-y').textContent=polynomial(comparison.dy);
    $('equality-symbol').textContent=comparison.consistent?'=':'≠';
    $('correction-reading').textContent=comparison.consistent?'At c = −3/4, both residuals vanish. Consistency determines the correction exactly.':state.tick===1?'At c = 1/4, the upper path reaches the GKT endpoint (0, 12). The lower path still gives (8, 4): the local consistency test fails.':`At c = ${display(c)}, the two path operations differ. Both residuals must vanish to repair the joint.`;
    renderJourney();
  }
  function stopPath(){cancelAnimationFrame(pathFrame);state.playing=false;}
  function setProgress(p){stopPath();state.progress=Math.max(0,Math.min(1,p));renderJourney();}
  function changeCoefficient(tick){stopPath();state.tick=tick;state.progress=0;renderCoefficient();}
  function playPath(){
    if(state.playing){stopPath();renderJourney();return;}
    if(reduced.matches){setProgress(1);return;}
    if(state.progress>=1)state.progress=0;
    state.playing=true;let previous=0;
    function frame(now){if(!state.playing)return;if(previous)state.progress=Math.min(1,state.progress+(now-previous)/6500);previous=now;if(state.progress>=1)state.playing=false;renderJourney();if(state.playing)pathFrame=requestAnimationFrame(frame);}
    pathFrame=requestAnimationFrame(frame);
  }
  const singularities=[{name:'Ã',x:-.95,y:.98,kind:'branched germ'},{name:'C̃',x:.95,y:.98,kind:'branched germ'},{name:'B₀',x:-.62,y:-.60,kind:'focus–focus'},{name:'B₁',x:.62,y:-.60,kind:'focus–focus'}];
  // A schematic representative separates {Ã,B₀} from {B₁,C̃}.
  const radialKnots=[[0,.9],[.8,1.1],[Math.PI/2,1.4],[2.34,1.52],[Math.PI,1.45],[3.91,1.2],[Math.PI*1.5,.9],[5.51,.75],[Math.PI*2,.9]];
  function radius(angle){const a=((angle%(2*Math.PI))+2*Math.PI)%(2*Math.PI);for(let i=1;i<radialKnots.length;i++){const [b,r]=radialKnots[i],[prev,p]=radialKnots[i-1];if(a<=b)return p+(r-p)*(a-prev)/(b-prev);}return .9;}
  function surfacePoint(fraction,w,h){const angle=fraction*Math.PI*2,r=radius(angle);return state.surface==='annulus'?[w/2+r*Math.cos(angle)*(h-40)/3.24,h/2-r*Math.sin(angle)*(h-40)/3.24]:[32+fraction*(w-64),h-36-(r-.68)/.94*(h-80)];}
  function drawAnnulus(){
    const svg=$('annulus-svg'),w=Math.max(300,svg.clientWidth),h=Math.min(350,w*.82+35);
    svg.replaceChildren();svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    const scale=(h-40)/3.24,cx=w/2,cy=h/2,xy=(x,y)=>[cx+x*scale,cy-y*scale];
    if(state.surface==='annulus'){
      svgElement('circle',{cx,cy,r:1.62*scale,fill:'var(--bg)',stroke:'var(--rule)','stroke-width':1.5},svg);
      svgElement('circle',{cx,cy,r:.68*scale,fill:'var(--bg-panel)',stroke:'var(--rule)','stroke-width':1.5},svg);
      const a=xy(-.95,.98),b=xy(.95,.98),c=xy(0,.50);
      svgElement('path',{d:`M${a} Q${c} ${b}`,fill:'none',stroke:'var(--ink-soft)','stroke-width':1,'stroke-dasharray':'3 4',opacity:.5},svg);
      text(svg,cx,cy+4,'hole',{'text-anchor':'middle',class:'fine'});
    } else {
      svgElement('rect',{x:32,y:44,width:w-64,height:h-80,fill:'var(--bg)',stroke:'var(--rule)'},svg);
      for(const x of [32,w-32])line(svg,x,44,x,h-36,{stroke:'var(--gold)','stroke-width':2,'stroke-dasharray':'4 4'});
      text(svg,w/2,26,'Join the two gold edges',{'text-anchor':'middle',class:'fine'});
      text(svg,w/2,h-12,'One circuit →',{'text-anchor':'middle',class:'fine'});
    }
    const points=Array.from({length:121},(_,i)=>surfacePoint(i/120,w,h).join(',')).join(' ');
    svgElement('polyline',{points,fill:'none',stroke:'var(--accent)','stroke-width':2.5,'stroke-linejoin':'round'},svg);
    for(const s of singularities){
      const angle=(Math.atan2(s.y,s.x)+Math.PI*2)%(Math.PI*2),r=Math.hypot(s.x,s.y);
      const [x,y]=state.surface==='annulus'?xy(s.x,s.y):[32+angle/(Math.PI*2)*(w-64),h-36-(r-.68)/.94*(h-80)];
      if(s.kind==='branched germ')svgElement('path',{d:`M${x},${y-5} l5,5 -5,5 -5,-5 Z`,fill:'var(--blue)'},svg);
      else svgElement('circle',{cx:x,cy:y,r:4,fill:'var(--gold)'},svg);
      text(svg,x+(s.x<0?-10:10),y-8,s.name,{'text-anchor':s.x<0?'end':'start',class:'svg-label'});
    }
    const [x,y]=surfacePoint(loopPosition,w,h);
    svgElement('circle',{id:'loop-dot',cx:x,cy:y,r:6,fill:'var(--accent)',stroke:'var(--bg)','stroke-width':2},svg);
  }
  function renderFrame(){
    const A=M.holonomy(state.loops),max=A.flat().reduce((s,v)=>Math.max(s,Math.abs(Number(v))),1),scale=86/max,svg=$('frame-svg'),cx=160,cy=120;
    svg.replaceChildren();line(svg,35,cy,285,cy,{class:'axis'});line(svg,cx,15,cx,220,{class:'axis'});
    const defs=svgElement('defs',{},svg);
    ['var(--blue)','var(--gold)'].forEach((color,i)=>{
      const marker=svgElement('marker',{id:'frame-arrow-'+i,viewBox:'0 0 8 8',refX:7,refY:4,markerWidth:6,markerHeight:6,orient:'auto'},defs);svgElement('path',{d:'M0 0 L8 4 L0 8 Z',fill:color},marker);
      const x=cx+Number(A[0][i])*scale,y=cy-Number(A[1][i])*scale;
      line(svg,cx,cy,x,y,{stroke:color,'stroke-width':2.5,'marker-end':`url(#frame-arrow-${i})`});text(svg,x+10,y+(i?0:15),'e'+(i?'₂':'₁'),{class:'svg-label'});
    });
    text(svg,cx,230,'common scale · max coordinate '+max,{'text-anchor':'middle',class:'fine'});
    svg.setAttribute('aria-label',`Exponent frame: e1 = (${A[0][0]}, ${A[1][0]}), e2 = (${A[0][1]}, ${A[1][1]}).`);
    $('matrix-readout').replaceChildren();
    for(let i=0;i<2;i++){const d=document.createElement('div'),s=document.createElement('span'),v=document.createElement('strong');s.textContent=i?'Returned e₂':'Returned e₁';v.textContent=`(${A[0][i]}, ${A[1][i]})`.replace(/-/g,'−');d.append(s,v);$('matrix-readout').append(d);}
    $('loop-label').textContent=looping?'Following the circuit…':`${state.loops} ${Math.abs(state.loops)===1?'circuit':'circuits'}`;
    $('frame-reading').textContent=state.loops===0?'The identity frame. One forward circuit applies K; a backward circuit applies K⁻¹.':`After ${state.loops} oriented ${Math.abs(state.loops)===1?'circuit':'circuits'}, the columns of K${superscript(state.loops)} give the returned frame. Its determinant is still 1.`;
    $('loop-forward').disabled=looping||state.loops>=3;$('loop-back').disabled=looping||state.loops<=-3;
  }
  function resetLoop(){cancelAnimationFrame(loopFrame);looping=false;loopPosition=0;state.loops=0;renderFrame();drawAnnulus();}
  function loop(direction){
    if(looping||Math.abs(state.loops+direction)>3)return;
    const complete=()=>{looping=false;state.loops+=direction;loopPosition=0;renderFrame();drawAnnulus();};
    if(reduced.matches){complete();return;}
    looping=true;renderFrame();let first=0;
    function frame(now){if(!looping)return;if(!first)first=now;const p=Math.min(1,(now-first)/2400);loopPosition=direction>0?p:1-p;const svg=$('annulus-svg'),[x,y]=surfacePoint(loopPosition,svg.viewBox.baseVal.width,svg.viewBox.baseVal.height);$('loop-dot').setAttribute('cx',x);$('loop-dot').setAttribute('cy',y);if(p<1)loopFrame=requestAnimationFrame(frame);else complete();}
    loopFrame=requestAnimationFrame(frame);
  }
  function renderObservable(){
    const raw=M.endpoint('upper',M.R(-3,4)),p=state.normalized?M.normalize(raw):raw,q=M.target(),period=state.observable==='period';
    $('annular-result-title').textContent=state.normalized?'After the imposed normal form':'The consistent wall';
    $('annular-observable').textContent=period?display(M.period(p))+' [xy]':pair(p);$('gkt-observable').textContent=period?display(M.period(q))+' [xy]':pair(q);
    $('annular-explanation').textContent=period?'The relevant two-label period class.':state.normalized?'Mixed coefficients after the external operation U₁.':'Mixed coefficients of V(8,4).';
    $('gkt-explanation').textContent=period?'The same period class.':'Mixed coefficients of V(0,12).';
    $('observable-sign').textContent=period||state.normalized?'=':'≠';
    $('period-reading').textContent=state.normalized?'The imposed operation U₁ makes the full potentials agree. The period class was already equal; it could not detect the original mismatch.':period?'Both period classes vanish. This test passes even though the full potentials differ. Switch back to the coefficients to see the information it loses.':'The two pairs differ by (8, −8). The sums agree, so the relevant period class cannot tell them apart.';
    $('apply-normal-form').textContent=state.normalized?'Undo the normal form':'Apply the normal form';$('apply-normal-form').setAttribute('aria-pressed',String(state.normalized));
  }
  function renderThreshold(){
    const svg=$('threshold-svg');svg.replaceChildren();const cell=24,x0=54,y0=25;
    for(let r=2;r<=12;r++)for(let s=2;s<=12;s++){
      const t=M.threshold(r,s),selected=r===state.r&&s===state.s;
      const rect=svgElement('rect',{x:x0+(r-2)*cell,y:y0+(12-s)*cell,width:cell-3,height:cell-3,rx:1,fill:t.dependent?'var(--blue)':'var(--rule)',opacity:t.dependent?.75:.55,stroke:selected?'var(--accent)':'none','stroke-width':selected?3:0,'data-r':r,'data-s':s},svg);
      const title=svgElement('title',{},rect);title.textContent=`r=${r}, s=${s}; central charge ${display(t.central)}; ${t.dependent?'primary wall crossing':'primary boundary independence'}`;
      if(selected)svgElement('circle',{cx:x0+(r-2)*cell+10.5,cy:y0+(12-s)*cell+10.5,r:3,fill:'var(--bg)','pointer-events':'none'},svg);
    }
    for(let n=2;n<=12;n+=2){text(svg,x0+(n-2)*cell+10,y0+11*cell+15,String(n),{'text-anchor':'middle'});text(svg,x0-15,y0+(12-n)*cell+15,String(n),{'text-anchor':'middle'});}
    text(svg,185,333,'Exponent r',{'text-anchor':'middle'});text(svg,16,155,'s',{'text-anchor':'middle',class:'svg-label'});
    const t=M.threshold(state.r,state.s,state.descendent);
    $('central-charge').textContent=display(t.central);
    $('threshold-result').textContent=!t.dependent?'Below ĉ = 1: primary invariants are boundary-independent. No primary wall crossing occurs, regardless of the number of insertions.':state.descendent?'Descendent degree one: boundary dependence can already occur with one insertion, including below the primary threshold.':`At or above ĉ = 1: primary wall crossing occurs. The minimal number of primary insertions is ${t.insertions}.`;
  }
  document.querySelectorAll('[data-route]').forEach(b=>b.addEventListener('click',()=>{state.route=b.dataset.route;pressed('[data-route]',state.route);setProgress(0);}));
  $('reverse-path').addEventListener('click',()=>{state.reverse=!state.reverse;$('reverse-path').setAttribute('aria-pressed',String(state.reverse));setProgress(0);});
  $('play-path').addEventListener('click',playPath);
  $('path-progress').addEventListener('input',e=>setProgress(Number(e.target.value)/1000));
  $('step-path').addEventListener('click',()=>{const e=M.crossings(state.route,coefficient(),state.reverse).find(e=>M.number(e.progress)>state.progress+1e-10);setProgress(e?M.number(e.progress):1);});
  $('finish-path').addEventListener('click',()=>setProgress(1));$('reset-path').addEventListener('click',()=>setProgress(0));
  $('wall-coefficient').addEventListener('input',e=>changeCoefficient(Number(e.target.value)));
  $('remove-wall').addEventListener('click',()=>changeCoefficient(0));$('solve-wall').addEventListener('click',()=>changeCoefficient(-3));
  document.querySelectorAll('[data-surface]').forEach(b=>b.addEventListener('click',()=>{state.surface=b.dataset.surface;pressed('[data-surface]',state.surface);drawAnnulus();}));
  $('loop-forward').addEventListener('click',()=>loop(1));$('loop-back').addEventListener('click',()=>loop(-1));$('loop-reset').addEventListener('click',resetLoop);
  document.querySelectorAll('[data-observable]').forEach(b=>b.addEventListener('click',()=>{state.observable=b.dataset.observable;pressed('[data-observable]',state.observable);renderObservable();}));
  $('apply-normal-form').addEventListener('click',()=>{state.normalized=!state.normalized;renderObservable();});
  function exponentInput(){const r=$('exponent-r'),s=$('exponent-s');if(!r.value||!s.value||!r.checkValidity()||!s.checkValidity()){$('central-charge').textContent='—';$('threshold-result').textContent='Choose integer exponents from 2 to 12.';return;}state.r=Number(r.value);state.s=Number(s.value);renderThreshold();}
  for(const id of ['exponent-r','exponent-s'])$(id).addEventListener('input',exponentInput);
  document.querySelectorAll('[name=insertion]').forEach(b=>b.addEventListener('change',()=>{state.descendent=b.value==='descendent';exponentInput();}));
  $('threshold-svg').addEventListener('click',e=>{const n=e.target.closest('[data-r]');if(!n)return;state.r=Number(n.dataset.r);state.s=Number(n.dataset.s);$('exponent-r').value=state.r;$('exponent-s').value=state.s;renderThreshold();});
  reduced.addEventListener('change',()=>{if(reduced.matches){stopPath();resetLoop();renderJourney();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopPath();renderJourney();if(looping){cancelAnimationFrame(loopFrame);looping=false;loopPosition=0;renderFrame();drawAnnulus();}}});
  new ResizeObserver(()=>{drawPath();drawAnnulus();}).observe($('path-svg').parentElement);
  renderCoefficient();renderFrame();drawAnnulus();renderObservable();renderThreshold();
})();
