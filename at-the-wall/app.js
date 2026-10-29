(function () {
  'use strict';
  const M = window.WallModel, $ = id => document.getElementById(id);
  const names = ['R₁', 'R₂', 'Q₁', 'Q₂'];
  const colours = ['var(--accent)', 'var(--blue)', 'var(--gold)'];
  const state = {p:.5, q:.5, sigma:.03, mode:0, animate:false, t:.2, theta:1, delta:.02, tau:80};
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current, frame = 0, visible = true;
  const clamp = (x,a,b) => Math.min(b,Math.max(a,x));
  function fmt(x, digits = 3) {
    if (x === 0) return '0';
    if (!Number.isFinite(x)) return '—';
    if (Math.abs(x) < .001 || Math.abs(x) >= 1000) return x.toExponential(2).replace('e-', ' × 10⁻').replace('e+', ' × 10⁺').replace(/([⁻⁺])(\d+)/, (_,s,n) => s + [...n].map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]).join(''));
    return Number(x.toPrecision(digits)).toString();
  }
  const text = (x,y,label,extra='') => `<text x="${x}" y="${y}" ${extra}>${label}</text>`;
  const line = (x1,y1,x2,y2,extra='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;
  function graph(weights, vector = null, phase = 0, compact = false) {
    const nodes = compact ? [[75,60],[245,200],[245,60],[75,200]] : [[75,75],[245,225],[245,75],[75,225]];
    const max = Math.max(...weights), labels = compact ? [[160,42],[43,130],[277,130],[160,184]] : [[160,54],[43,150],[277,150],[160,204]];
    let out = '';
    M.edges.forEach(([a,b],i) => {
      const [x1,y1] = nodes[a], [x2,y2] = nodes[b];
      out += line(x1,y1,x2,y2,`stroke="var(--sage)" stroke-width="${weights[i] === 0 ? 1 : 1+8*weights[i]/max}" ${weights[i] === 0 ? 'stroke-dasharray="3 5" opacity=".35"' : 'opacity=".65"'}`);
      const [lx,ly] = labels[i];
      out += text(lx,ly,fmt(weights[i]),`text-anchor="middle" ${i === 1 || i === 2 ? `transform="rotate(-90 ${lx} ${ly})"` : ''}`);
    });
    nodes.forEach(([x,y],i) => {
      const value = vector && Math.abs(vector[i]) >= 1e-8 ? vector[i] : 0, r = vector ? 20 + 6*Math.abs(value)*Math.sin(phase) : 18;
      const fill = !vector || Math.abs(value)<1e-8 ? 'var(--bg)' : value > 0 ? 'var(--accent)' : 'var(--blue)';
      out += `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="var(--ink-soft)" stroke-width="1"/>`;
      if (vector) out += text(x,y+4,`${value>0?'+':''}${value.toFixed(2)}`,`text-anchor="middle" style="fill:${Math.abs(value)<1e-8 ? 'var(--ink)' : 'var(--bg)'};font-size:10px"`);
      out += text(x,y+(i===0||i===2?-32:39),names[i],'text-anchor="middle" class="serif-label"');
    });
    return out;
  }
  function renderChamber(sync = true) {
    current = M.chamber(state.p,state.q,state.sigma);
    if (sync) {
      $('chamber-p').value = state.p; $('chamber-q').value = state.q;
      $('chamber-scale').value = -Math.log10(state.sigma);
    }
    $('p-out').textContent = fmt(state.p); $('q-out').textContent = fmt(state.q);
    $('scale-out').textContent = fmt(state.sigma);
    const x = 45 + 230*state.p, y = 255 - 230*state.q;
    $('chamber-svg').innerHTML = '<title id="chamber-svg-title">A square cross-section of the stable cone</title><desc id="chamber-svg-desc">Drag the point, or use the two sliders below. The interior is stable and the edges are semistable boundaries.</desc>' +
      '<rect x="45" y="25" width="230" height="230" fill="var(--sage)" fill-opacity=".07" stroke="var(--sage)" stroke-width="1.5"/>' +
      [1,2,3].map(n => line(45+n*57.5,25,45+n*57.5,255,'class="axis"')+line(45,25+n*57.5,275,25+n*57.5,'class="axis"')).join('') +
      line(45,y,x,y,'class="guide"')+line(x,y,x,255,'class="guide"')+
      text(160,16,'y₂ = 0','text-anchor="middle"')+text(160,277,'y₁ = 0','text-anchor="middle"')+
      text(28,140,'x₁ = 0','text-anchor="middle" transform="rotate(-90 28 140)"')+text(295,140,'x₂ = 0','text-anchor="middle" transform="rotate(90 295 140)"')+
      `<circle cx="${x}" cy="${y}" r="15" fill="var(--accent)" fill-opacity=".12"/><circle cx="${x}" cy="${y}" r="5" fill="var(--accent)" stroke="var(--bg)" stroke-width="2"/>`;
    $('network-svg').innerHTML = '<title>Selected unit mode on the extension graph</title>' + graph(current.weights,current.vectors[state.mode]);
    const tag = $('chamber-state'); tag.textContent = current.stable ? 'Stable interior' : 'Semistable boundary'; tag.classList.toggle('boundary',!current.stable);
    document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed',String(+b.dataset.mode===state.mode)));
    // A fixed absolute window makes shrinking the overall scale visible.
    $('spectrum-rows').innerHTML = current.values.map((v,i) => `<div class="spectrum-row ${i===state.mode?'selected':''}"><div class="spectrum-numbers"><strong><span>${i+1} / </span>${fmt(v)}</strong><strong>${current.stable?fmt(1/v):'—'}</strong></div><div class="spectrum-bar"><i style="width:${v===0 ? 0 : clamp((Math.log10(v)+10)/10,0,1)*100}%"></i></div></div>`).join('');
    $('mode-energy').textContent = fmt(current.values[state.mode]);
    $('response-note').textContent = current.stable ? 'Geometric response has relative O(σ) corrections in the stated norms. The constant is not estimated here.' : 'At the boundary, only the limiting graph is shown. Stationary Hermitian–Einstein response is not asserted.';
    const degenerate = current.values.some((v,i) => i>0 && Math.abs(v-current.values[i-1])<1e-9*state.sigma);
    $('mode-note').textContent = degenerate ? 'Equal eigenvalues: the displayed vectors are one orthonormal choice within the shared eigenspace.' : 'Modes are ordered by increasing energy. Their overall sign has no geometric significance.';
    const min = Math.min(state.p,1-state.p,state.q,1-state.q), ratio = current.values[2]/current.values[0];
    $('chamber-observation').textContent = !current.stable ? 'An extra zero mode has appeared: the limiting graph has disconnected. The boundary is a limit of the interior calculations, not a continuation of its stationary metric.' : min < .03 ? `A weak connection separates the scales. The largest small eigenvalue is ${fmt(ratio)} times the smallest; the largest leading response is ${fmt(1/current.values[0])}. Select Mode 1 to see the softest direction.` : 'Move toward an edge to single out a soft mode. Reduce the overall scale to make every edge weaker at once: all three eigenvalues shrink, and all three response values grow.';
  }
  function plotSize(id) {
    const mobile=window.matchMedia('(max-width:680px)').matches;
    $(id).setAttribute('viewBox',mobile?'0 0 320 300':'0 0 640 360');
    return mobile?{x0:47,y0:30,w:250,h:210,mobile:true}:{x0:65,y0:22,w:540,h:280,mobile:false};
  }
  function axes({x0,y0,w,h,mobile,xTicks,yTicks,xMap,yMap,xLabel,yLabel}) {
    let out = text(x0,y0-12,yLabel,`style="font-size:${mobile?12:10}px"`);
    yTicks.forEach(([v,label]) => {const y=yMap(v); out+=line(x0,y,x0+w,y,'class="axis"')+text(x0-10,y+4,label,'text-anchor="end"');});
    xTicks.forEach(([v,label]) => {const x=xMap(v);out+=line(x,y0,x,y0+h,'class="axis"')+text(x,y0+h+22,label,'text-anchor="middle"');});
    return out+text(x0+w,y0+h+48,xLabel,`text-anchor="end" style="font-size:${mobile?12:10}px"`);
  }
  function polyline(points,colour,extra='') {return `<polyline points="${points.map(p=>p.map(v=>v.toFixed(3)).join(',')).join(' ')}" fill="none" stroke="${colour}" stroke-width="2" ${extra}/>`;}
  function renderScales() {
    const size=plotSize('scales-svg'),{x0,y0,w,h,mobile}=size;
    const xMap = t => x0+w*Math.log(t/.04)/Math.log(.3/.04), yMap = v => y0+h-h*(Math.log10(v)+9)/9;
    let scalePlot = axes({...size,xMap,yMap,xTicks:(mobile?[.04,.1,.3]:[.04,.06,.1,.2,.3]).map(x=>[x,String(x)]),yTicks:[[1,'1'],[1e-3,'10⁻³'],[1e-6,'10⁻⁶'],[1e-9,'10⁻⁹']],xLabel:'Path parameter t →',yLabel:'Graph eigenvalue ν'});
      const samples=Array.from({length:121},(_,i)=>M.threeScales(.04*(.3/.04)**(i/120)));
      for(let j=2;j>=0;j--) {
        scalePlot+=polyline(samples.map(s=>[xMap(s.t),yMap(s.leading[j])]),colours[j],'stroke-dasharray="4 5" opacity=".5"');
        scalePlot+=polyline(samples.map(s=>[xMap(s.t),yMap(s.values[j])]),colours[j]);
      }
    const s = M.threeScales(state.t), x=xMap(state.t);
    $('scales-svg').innerHTML = '<title>Three separated vanishing orders</title>'+scalePlot+line(x,y0,x,y0+h,'class="guide"')+s.values.map((v,i)=>`<circle cx="${x}" cy="${yMap(v)}" r="5" fill="${colours[i]}" stroke="var(--bg)" stroke-width="2"/>`).join('');
    $('t-out').textContent=state.t.toFixed(3);
    s.values.forEach((v,i)=>$('path-v'+(i+1)).textContent=fmt(v));
    $('path-observation').textContent=`At this point the three eigenvalues span a factor of ${fmt(s.values[2]/s.values[0])}. The leading response in the softest direction is ${fmt(1/s.values[0])}.`;
  }
  function miniValues(values) {return values.map((v,i)=>`<div><span>ν${'₁₂₃'[i]}</span>${fmt(v,5)}</div>`).join('');}
  function renderCycles() {
    const tree=M.tree(),cycle=M.cycle(state.theta);
    $('cycle-out').textContent=fmt(state.theta);
    $('tree-svg').innerHTML='<title>Tree: weights fixed by the slope demands</title>'+graph(tree.weights,null,0,true);
    $('cycle-svg').innerHTML='<title>Cycle: weights also depend on harmonic data</title>'+graph(cycle.weights,null,0,true);
    $('tree-values').innerHTML=miniValues(tree.values);$('cycle-values').innerHTML=miniValues(cycle.values);
    $('cycle-observation').textContent=`Both graphs have demands 0.02 × (2, 1, −1, −2). The tree stays fixed while the cycle ratio changes. At θ = ${fmt(state.theta)}, the cycle’s smallest eigenvalue is ${fmt(cycle.values[0],5)}; the tree’s is ${fmt(tree.values[0],5)}.`;
  }
  function renderFlow() {
    const size=plotSize('flow-svg'),{x0,y0,w,h,mobile}=size;
    const xMap=t=>x0+w*(t-1)/199, yMap=v=>y0+h-h*(Math.log10(v)+7)/7;
    let out=axes({...size,xMap,yMap,xTicks:(mobile?[1,100,200]:[1,50,100,150,200]).map(t=>[t,String(t)]),yTicks:[[1,'1'],[1e-2,'10⁻²'],[1e-4,'10⁻⁴'],[1e-6,'10⁻⁶']],xLabel:'Time τ →',yLabel:mobile?'Eigenvalue profile Pδ(τ)':'Small-eigenvalue profile Pδ(τ)'});
    const magnitude=Math.abs(state.delta)||.02, deltas=[magnitude,0,-magnitude], coloursFlow=['var(--sage)','var(--ink-soft)','var(--blue)'];
    $('flow-legend').innerHTML=deltas.map((d,i)=>`<span style="color:${Math.abs(d-state.delta)<1e-12?'var(--accent)':coloursFlow[i]}">${d===0?'Wall':d>0?'Stable':'Unstable'} · δ = ${d>0?'+':''}${d.toFixed(3)}</span>`).join('');
    deltas.forEach((d,i)=>{
      const selected=Math.abs(d-state.delta)<1e-12;
      const points=Array.from({length:200},(_,j)=>[xMap(j+1),yMap(M.profile(d,j+1))]);
      out+=polyline(points,selected?'var(--accent)':coloursFlow[i],selected?'style="stroke-width:3"':'stroke-dasharray="4 4" opacity=".6"');

    });
    const value=M.profile(state.delta,state.tau), x=xMap(state.tau), y=yMap(value);
    out+=line(x,y0,x,y0+h,'class="guide"')+`<circle cx="${x}" cy="${y}" r="5" fill="var(--accent)" stroke="var(--bg)" stroke-width="2"/>`;
    $('flow-svg').innerHTML='<title>Stable, wall, and unstable two-factor profiles</title>'+out;
    $('gap-out').textContent=(state.delta>0?'+':'')+state.delta.toFixed(3);
    $('time-out').textContent=String(state.tau);$('profile-value').textContent=fmt(value);
    $('flow-state').textContent=state.delta===0?'At the wall':state.delta>0?'Stable side':'Unstable side';
    $('flow-observation').textContent=state.delta===0?'Exactly at the wall, doubling time halves this profile. There is no positive limiting eigenvalue.' : state.delta>0 ? `The profile tends to the positive gap δ = ${fmt(state.delta)}. Moving δ toward zero pushes the transition to later times.` : `The profile tends to zero exponentially, with leading form ${fmt(-state.delta)} exp(−${fmt(-2*state.delta)}τ). The bundle is on the unstable side.`;
    document.querySelectorAll('[data-gap]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.gap===state.delta)));
  }
  function clearPreset() {document.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed','false'));}
  document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{
    const presets={centre:[.5,.5],edge:[.008,.5],corner:[.008,.02],boundary:[0,.5]};
    [state.p,state.q]=presets[b.dataset.preset];state.sigma=.03;clearPreset();b.setAttribute('aria-pressed','true');renderChamber();
  }));
  ['p','q','scale'].forEach(key=>$('chamber-'+key).addEventListener('input',e=>{
    if(key==='scale')state.sigma=10**(-Number(e.target.value));else state[key]=Number(e.target.value);
    clearPreset();renderChamber(false);
  }));
  const chamber=$('chamber-svg');let dragging=false;
  function movePoint(e) {
    const point=chamber.createSVGPoint();point.x=e.clientX;point.y=e.clientY;
    const loc=point.matrixTransform(chamber.getScreenCTM().inverse());
    state.p=clamp((loc.x-45)/230,0,1);state.q=clamp((255-loc.y)/230,0,1);
    clearPreset();renderChamber();
  }
  chamber.addEventListener('pointerdown',e=>{if(e.button!==0)return;dragging=true;chamber.setPointerCapture(e.pointerId);movePoint(e);});
  chamber.addEventListener('pointermove',e=>{if(dragging)movePoint(e);});
  ['pointerup','pointercancel','lostpointercapture'].forEach(name=>chamber.addEventListener(name,()=>{dragging=false;}));
  document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{state.mode=+b.dataset.mode;renderChamber(false);}));
  function tick(time) {
    if(!state.animate)return;
    if(visible&&!document.hidden) $('network-svg').innerHTML='<title>Animated selected mode; not geometric flow</title>'+graph(current.weights,current.vectors[state.mode],time/500);
    frame=requestAnimationFrame(tick);
  }
  function stopAnimation() {state.animate=false;cancelAnimationFrame(frame);$('animate-mode').textContent='Animate this mode';$('animate-mode').setAttribute('aria-pressed','false');renderChamber(false);}
  $('animate-mode').addEventListener('click',()=>{
    if(state.animate){stopAnimation();return;}
    if(reduced.matches)return;
    state.animate=true;$('animate-mode').textContent='Pause animation';$('animate-mode').setAttribute('aria-pressed','true');frame=requestAnimationFrame(tick);
  });
  function motionPreference() {if(reduced.matches)stopAnimation();$('animate-mode').disabled=reduced.matches;$('animate-mode').textContent=reduced.matches?'Animation off · reduced motion':'Animate this mode';}
  reduced.addEventListener('change',motionPreference);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe($('network-svg'));
  $('path-t').addEventListener('input',e=>{state.t=Number(e.target.value);renderScales();});
  $('path-to-chamber').addEventListener('click',()=>{
    const s=M.threeScales(state.t);state.p=s.p;state.q=s.q;state.sigma=s.sigma;clearPreset();renderChamber();
    $('chamber').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});
  });
  $('cycle-ratio').addEventListener('input',e=>{state.theta=10**Number(e.target.value);renderCycles();});
  $('flow-gap').addEventListener('input',e=>{state.delta=Number(e.target.value);renderFlow();});
  $('flow-time').addEventListener('input',e=>{state.tau=Number(e.target.value);renderFlow();});
  document.querySelectorAll('[data-gap]').forEach(b=>b.addEventListener('click',()=>{state.delta=+b.dataset.gap;$('flow-gap').value=state.delta;renderFlow();}));
  window.matchMedia('(max-width:680px)').addEventListener('change',()=>{renderScales();renderFlow();});
  renderChamber();renderScales();renderCycles();renderFlow();motionPreference();
})();
