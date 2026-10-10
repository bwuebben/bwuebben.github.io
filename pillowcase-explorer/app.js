(() => {
  'use strict';
  const M = PillowcaseModel, {PI,TAU} = M;
  const $ = id => document.getElementById(id);
  const colors = {ink:'#202c29',muted:'#66736b',teal:'#24695c',amber:'#ad6826',blue:'#506e98',line:'#dce1d9'};
  const state = {step:0,cut:false,gamma:.68*PI,theta:.42*PI,epsilon:.16,show0:true,show1:true,selected:'x1',toy:false,playing:false};
  let animation = null, tooltipTarget = null;
  const definitions = {
    tangle:['2-tangle','Two properly embedded arcs in a 3-ball, with four endpoints on its boundary. Their embedding and the boundary marking carry the information.'],
    conway:['Conway sphere','A sphere meeting the knot transversely in four points. Removing those points leaves the common four-punctured boundary.'],
    meridian:['Meridian','A small loop encircling one strand once. Its holonomy records parallel transport around that strand.'],
    su2:['SU(2)','The group of 2 × 2 unitary complex matrices with determinant 1. Equivalently, the unit quaternions.'],
    traceless:['Traceless holonomy','Trace zero in SU(2) means a purely imaginary unit quaternion. It is a point of S²; its eigenvalues are +i and −i.'],
    character:['Character variety','Representations of a fundamental group into SU(2), subject to the prescribed meridian conditions, modulo simultaneous conjugation.'],
    conjugation:['Simultaneous conjugation','Replace every holonomy h by uhu⁻¹ using the same u. This changes the frame, not the boundary character.'],
    pillowcase:['Pillowcase','The torus (R/2πZ)² modulo (γ, θ) ↦ (−γ, −θ). It is a sphere with four orbifold corners; the smooth part is a symplectic surface.'],
    corner:['Orbifold corner','A fixed point of the involution: γ and θ are each 0 or π. These characters are reducible; the local quotient is R²/±1.'],
    restriction:['Restriction map','A representation of a tangle complement restricts to its boundary group. The two tangles therefore map into the same pillowcase.'],
    lagrangian:['Lagrangian curve','In a symplectic surface, a smooth immersed curve is Lagrangian because its tangent is one-dimensional. Tangle moduli need regularity or perturbations to give such curves.'],
    immersion:['Immersed curve','A parametrized curve with nonzero derivative. Different parameter values may map to the same point. Keep track of branches at a self-intersection.'],
    earring:['Earring marking','A small meridional circle and marking arc placed on the trivial tangle, with the corresponding bundle data used for reduced singular instanton theory. It changes the moduli problem.'],
    perturbation:['Holonomy perturbation','A controlled modification of the flatness/Chern–Simons equations. Here a small positive ε turns the marked trivial-tangle moduli into an immersed circle transverse to L₁.'],
    transverse:['Transverse intersection','The tangent directions of L₀ and L₁ are distinct. The intersection is isolated and can serve as a Floer generator.'],
    generator:['Floer generator','A basis element of the chain group. Here it is a branch-aware intersection of two boundary restriction objects. A generator is not automatically a homology class.'],
    bigon:['Bigon','A disk with two marked corners and one boundary arc on each curve. In surface Floer theory, eligible index-one bigons represent strip contributions to the differential.'],
    instanton:['Instanton trajectory','An anti-self-dual gauge-theoretic trajectory on the relevant four-dimensional cylinder, subject to knot singularity and perturbation conditions. These define the instanton differential.'],
    bounding:['Bounding cochain','Additional deformation data for an immersed Lagrangian, satisfying a Maurer–Cartan equation that controls disk-bubbling obstructions. It is not chosen or computed by this explorer.'],
    ainfinity:['A∞ structure','A hierarchy of higher composition operations satisfying coherent relations. A natural chain/A∞ comparison carries more information than equality of homology ranks.']
  };
  const def = (key,label) => `<button class="definition" data-def="${key}" aria-describedby="tooltip">${label || definitions[key][0]}</button>`;
  const fmt = value => (value/PI).toFixed(3)+'π';
  const text = (x,y,value,size=12,fill=colors.muted,extra='') => `<text x="${x}" y="${y}" fill="${fill}" font-family="Arial,sans-serif" font-size="${size}" ${extra}>${value}</text>`;
  const math = (x,y,value,size=20,fill=colors.ink,extra='') => `<text x="${x}" y="${y}" fill="${fill}" font-family="Georgia,serif" font-size="${size}" ${extra}>${value}</text>`;
  const line = (x1,y1,x2,y2,stroke=colors.line,extra='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" ${extra}/>`;
  const circle = (x,y,r,fill,extra='') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
  const path = (d,color,width=3,extra='') => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
  const tipGroup = (key,content) => `<g data-def="${key}" tabindex="0" role="button" aria-label="Define ${definitions[key][0]}" aria-describedby="tooltip">${content}</g>`;
  function svgDefs() { return `<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${colors.muted}"/></marker><pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="#e9eee5" stroke-width=".8"/></pattern></defs>`; }
  function puncture(x,y,label) {return tipGroup('meridian',circle(x,y,6,'#fff',`stroke="${colors.ink}" stroke-width="1.5"`)+math(x+(label==='a'||label==='d'?-22:14),y+4,label,17));}
  function braid(xl,xr,top,bottom,n=3) {
    let out=''; const height=(bottom-top)/n;
    for(let k=0;k<n;k++) {
      const y=top+k*height, end=y+height, mid=y+height/2;
      const over=`M${xl},${y} C${xl},${mid} ${xr},${mid} ${xr},${end}`;
      const under=`M${xr},${y} C${xr},${mid} ${xl},${mid} ${xl},${end}`;
      out+=path(under,colors.amber,5)+path(over,colors.amber,5);
      let bridge='';
      for(let u=.43;u<=.5701;u+=.01){const bx=xl+(xr-xl)*(3*u*u-2*u*u*u),by=y+height*(1.5*u-1.5*u*u+u*u*u);bridge+=(bridge?'L':'M')+bx.toFixed(2)+','+by.toFixed(2);}
      out+=path(bridge,'#f8faf5',12)+path(bridge,colors.amber,5);
    }
    return out;
  }
  function drawKnot() {
    if(!state.cut) {
      const top=85,bottom=315,xl=330,xr=450;
      let out=`<circle cx="390" cy="200" r="130" fill="#edf2e8" stroke="#a6b9a4" stroke-width="1.4" stroke-dasharray="5 5"/>`;
      out+=path(`M${xl},${top} C175,35 175,365 ${xl},${bottom}`,colors.teal,5);
      out+=path(`M${xr},${top} C605,35 605,365 ${xr},${bottom}`,colors.teal,5);
      out+=braid(xl,xr,top,bottom);
      out+=puncture(xl,top,'a')+puncture(xr,top,'b')+puncture(xr,bottom,'c')+puncture(xl,bottom,'d');
      out+=text(155,205,'T₀',15,colors.teal)+text(380,205,'T₁',15,colors.amber);
      out+=line(518,174,665,128,colors.muted,'stroke-width="1"')+tipGroup('conway',text(677,121,'Conway sphere',14,colors.ink)+text(677,143,'four punctures on the boundary',10));
      out+=math(390,378,'Trefoil 3₁',25,colors.ink,'text-anchor="middle"')+text(390,401,'The sphere encloses the three-crossing tangle.',11,colors.muted,'text-anchor="middle"');
      return out;
    }
    let out='';
    out+=`<circle cx="230" cy="215" r="130" fill="#edf4eb" stroke="#b5cbb6"/><circle cx="650" cy="215" r="130" fill="#f6efe2" stroke="#d9c6a9"/>`;
    out+=path('M170,100 C80,135 80,295 170,330',colors.teal,5)+path('M290,100 C380,135 380,295 290,330',colors.teal,5);
    out+=braid(590,710,100,330);
    for(const x of [170,590])out+=puncture(x,100,'a')+puncture(x+120,100,'b')+puncture(x+120,330,'c')+puncture(x,330,'d');
    out+=line(385,216,485,216,colors.muted,'stroke-dasharray="4 5" marker-end="url(#arrow)"')+text(435,197,'same boundary',10,colors.muted,'text-anchor="middle"');
    out+=math(230,382,'T₀ · the trivial tangle',23,colors.teal,'text-anchor="middle"')+math(650,382,'T₁ · the rational tangle',23,colors.amber,'text-anchor="middle"');
    out+=text(230,405,'Two unknotted arcs; retain the boundary marking.',10,colors.muted,'text-anchor="middle"')+text(650,405,'The twists become a different boundary restriction.',10,colors.muted,'text-anchor="middle"');
    return out;
  }
  function squareFace(x,y,size,face,labels=true) {
    let out=`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${face?'#f1f4ed':'#fafcf7'}" stroke="#b7c5b2" stroke-width="1.3"/>`;
    out+=`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="url(#grid)"/>`;
    out+=line(x,y+size/2,x+size,y+size/2,'#e0e7da','stroke-dasharray="3 4"')+line(x+size/2,y,x+size/2,y+size,'#e0e7da','stroke-dasharray="3 4"');
    for (const [dx,dy] of [[0,0],[size,0],[size,size],[0,size]]) out+=tipGroup('corner',circle(x+dx,y+dy,4,colors.ink));
    if(labels){out+=text(x+size/2,y-19,face?'BACK FACE':'FRONT FACE',10,colors.muted,'text-anchor="middle" letter-spacing="1.5"');
      out+=math(x-15,y+5,'π',13,colors.muted,'text-anchor="end"')+math(x-15,y+size+4,face?'2π':'0',13,colors.muted,'text-anchor="end"');
      out+=math(x,y+size+23,'0',13,colors.muted,'text-anchor="middle"')+math(x+size,y+size+23,'π',13,colors.muted,'text-anchor="middle"')+math(x+size/2,y+size+24,'γ',15,colors.muted,'text-anchor="middle"');
      out+=math(x-32,y+size/2,face?'2π−θ':'θ',13,colors.muted,'text-anchor="middle"');}
    return out;
  }
  function drawQuotient() {
    const x=65,y=67,s=286,g=M.mod(state.gamma),t=M.mod(state.theta),c=M.canonical(g,t);
    let out=text(x+s/2,38,'TORUS COVER',10,colors.muted,'text-anchor="middle" letter-spacing="1.5"');
    out+=`<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="#f8faf4" stroke="#b7c5b2"/><rect x="${x}" y="${y}" width="${s}" height="${s}" fill="url(#grid)"/>`;
    out+=line(x+s/2,y,x+s/2,y+s,colors.line,'stroke-dasharray="4 4"')+line(x,y+s/2,x+s,y+s/2,colors.line,'stroke-dasharray="4 4"');
    for(const [gx,ty] of [[0,0],[PI,0],[0,PI],[PI,PI]])out+=circle(x+gx/TAU*s,y+s-ty/TAU*s,4,colors.ink);
    const px=x+g/TAU*s,py=y+s-t/TAU*s, qx=x+M.mod(-g)/TAU*s,qy=y+s-M.mod(-t)/TAU*s;
    out+=line(px,py,qx,qy,'#a8bca5','stroke-dasharray="3 5"')+circle(qx,qy,8,'white',`stroke="${colors.teal}" stroke-width="2"`)+circle(px,py,8,colors.teal);
    out+=text(px+13,py-12,'(γ, θ)',12,colors.teal)+text(qx+13,qy-12,'(−γ, −θ)',12,colors.teal);
    out+=math(x-15,y+5,'2π',13,colors.muted,'text-anchor="end"')+math(x-15,y+s+5,'0',13,colors.muted,'text-anchor="end"')+math(x,y+s+23,'0',13,colors.muted,'text-anchor="middle"')+math(x+s,y+s+23,'2π',13,colors.muted,'text-anchor="middle"');
    out+=line(375,197,435,197,colors.muted,'marker-end="url(#arrow)"')+math(405,174,'/ ±1',18,colors.ink,'text-anchor="middle"');
    const size=157,fy=116,fx=[490,700];
    fx.forEach((ox,face)=>{out+=squareFace(ox,fy,size,face);if(c.face===face || c.gamma<1e-9 || Math.abs(c.gamma-PI)<1e-9 || c.y<1e-9 || Math.abs(c.y-PI)<1e-9){out+=circle(ox+c.gamma/PI*size,fy+size-c.y/PI*size,9,'#dce9d6')+circle(ox+c.gamma/PI*size,fy+size-c.y/PI*size,5,colors.teal);}});
    out+=path('M520,310 Q672,338 820,310','#adbba8',1.3,'stroke-dasharray="3 4"');
    out+=tipGroup('pillowcase',text(672,349,'Two squares, glued along all four edges.',11,colors.ink,'text-anchor="middle"'));
    out+=text(208,402,'Opposite edges are periodic; the involution pairs the two dots.',11,colors.muted,'text-anchor="middle"')+text(674,402,'The paired dots are one boundary character.',11,colors.teal,'text-anchor="middle"');
    return out;
  }
  const faceLayout = [{x:108,y:60,s:280},{x:528,y:60,s:280}];
  function drawCurves() {
    let out='';
    faceLayout.forEach(({x,y,s},face)=>{
      out+=squareFace(x,y,s,face);
      if(state.epsilon===0 && state.show0){out+=path(`M${x},${y+s}L${x+s},${y}`,colors.teal,4,'stroke-dasharray="4 5"');}
      else if(state.show0){out+=path(M.segmentedPath(b=>M.l0(b,state.epsilon),0,TAU,1600,face,x,y,s),colors.teal,3.4);}
      if(state.show1)out+=path(M.segmentedPath(M.l1,0,PI,800,face,x,y,s),colors.amber,3,'stroke-dasharray="8 5"');
      if(state.show0 && state.epsilon>0 && face===0){out+=tipGroup('immersion',circle(x+s/2,y+s/2,6,'#fff',`stroke="#81937c" stroke-width="1.2"`));}
    });
    if(state.epsilon>0 && state.show0 && state.show1){
      M.intersections(state.epsilon).forEach(point=>{
        const f=faceLayout[point.face],x=f.x+point.gamma/PI*f.s,y=f.y+f.s-point.y/PI*f.s,selected=state.step>=3 && state.selected===point.id;
        out+=`<g class="svg-button" role="button" tabindex="0" data-generator="${point.id}" aria-label="Select generator ${point.id==='r'?'r':point.id==='x1'?'x one':'x two'}"><circle cx="${x}" cy="${y}" r="${selected?15:12}" fill="${selected?'#dbe8d4':'#f7f9f3'}" stroke="${selected?colors.ink:colors.line}" stroke-width="1"/><circle cx="${x}" cy="${y}" r="5.5" fill="${colors.ink}"/>${math(x+(point.id==='x2'?-17:17),y+(point.id==='x2'?21:-9),point.id==='r'?'r':point.id==='x1'?'x₁':'x₂',19,colors.ink,`text-anchor="${point.id==='x2'?'end':'start'}"`)}</g>`;
      });
    }
    if(state.epsilon===0 && state.show0 && state.show1){const f=faceLayout[0];out+=circle(f.x+f.s*2/3,f.y+f.s/3,8,'#fff',`stroke="${colors.ink}" stroke-width="1.8"`)+text(380,198,'two branches coincide',10,colors.muted);out+=text(458,402,'ε = 0: a corner and coincident branches. This is not a transverse generator set.',11,colors.amber,'text-anchor="middle"');}
    else{out+=path('M404,78Q458,51 512,78','#b2c0ac',1.2,'stroke-dasharray="3 4"')+text(458,40,'shared seam',9,colors.muted,'text-anchor="middle"');out+=text(458,402,state.step===3?'Click an intersection, or select its generator below.':'Solid L₀ and dashed L₁ live on the same glued surface.',11,colors.muted,'text-anchor="middle"');}
    return out;
  }
  function generatorCard(x,y,id,label,subtitle) {
    const selected=state.selected===id;
    return `<g class="svg-button" role="button" tabindex="0" data-generator="${id}" aria-label="Select generator ${id}"><rect x="${x}" y="${y}" width="174" height="72" rx="7" fill="${selected?'#e7eee1':'#fff'}" stroke="${selected?'#9fb799':colors.line}"/>${math(x+22,y+33,label,24)}${text(x+22,y+55,subtitle,10)}</g>`;
  }
  function drawComplex() {
    if(state.toy) {
      const progress=state.playing?state.animationProgress||0:0;
      let out=text(450,40,'LOCAL SCHEMATIC · NOT THE TREFOIL',10,colors.muted,'text-anchor="middle" letter-spacing="1.5"');
      out+=path('M100,220H590',colors.teal,3.5)+path('M140,220Q345,0 550,220',colors.amber,3,'stroke-dasharray="8 5"');
      // The shaded bigon is bounded by the horizontal L0 arc and upper L1 arc only.
      out+=`<path d="M140,220 Q345,0 550,220 L140,220Z" fill="#d5e4c9" opacity=".9"/>`;
      out+=path('M100,220H590',colors.teal,3.5)+path('M140,220Q345,0 550,220',colors.amber,3,'stroke-dasharray="8 5"');
      out+=circle(140,220,7,colors.ink)+circle(550,220,7,colors.ink)+math(140,255,'u',22,colors.ink,'text-anchor="middle"')+math(550,255,'v',22,colors.ink,'text-anchor="middle"');
      out+=text(112,206,'L₀',14,colors.teal)+text(355,96,'L₁',14,colors.amber)+tipGroup('bigon',math(345,183,'an index-one bigon',19,colors.teal,'text-anchor="middle"'));
      if(state.playing){const ax=140+410*progress,ay=220-55*Math.sin(PI*progress);out+=circle(ax,ay,9,'#fff',`stroke="${colors.teal}" stroke-width="2"`);}
      out+=line(642,110,642,315,colors.line)+math(679,156,'∂u = v',26)+math(679,206,'∂v = 0',26)+text(679,253,'One eligible contribution',11)+text(679,274,'counted modulo 2.',11);
      out+=text(450,382,'The moving dot illustrates a strip contribution; it does not solve a PDE.',11,colors.muted,'text-anchor="middle"');
      return out;
    }
    let out=text(450,39,'THE SAME THREE GENERATORS, TWO DIFFERENT KINDS OF TRAJECTORY',10,colors.muted,'text-anchor="middle" letter-spacing="1.1"');
    out+=text(86,89,'GAUGE THEORY',10,colors.teal,'letter-spacing="1.2"')+math(86,120,'CI♮(3₁)',23,colors.teal)+text(86,144,'critical points',10);
    out+=generatorCard(270,90,'r','r','abelian-limit generator')+generatorCard(463,90,'x1','x₁','first split branch')+generatorCard(656,90,'x2','x₂','second split branch');
    [357,550,743].forEach(x=>{out+=line(x,178,x,233,'#adbaa6','marker-end="url(#arrow)"');});
    out+=text(87,235,'SURFACE GEOMETRY',10,colors.amber,'letter-spacing="1.2"')+math(86,266,'CF(L₀, L₁)',23,colors.amber)+text(86,290,'intersections',10);
    out+=generatorCard(270,235,'r','r','L₀ ∩ L₁')+generatorCard(463,235,'x1','x₁','L₀ ∩ L₁')+generatorCard(656,235,'x2','x₂','L₀ ∩ L₁');
    out+=`<rect x="267" y="344" width="563" height="45" rx="5" fill="#eaf0e4"/>`+math(548,373,'Trefoil model: ∂ = 0, so H ≅ F₂³.',22,colors.teal,'text-anchor="middle"');
    out+=text(450,419,'A correspondence of bases is the starting point. Comparing trajectories is the deeper task.',11,colors.muted,'text-anchor="middle"');
    return out;
  }
  const steps=[
    {title:'A sphere makes the cut.',tag:'TANGLE DECOMPOSITION',desc:'A trefoil shown as a three-crossing two-strand braid closure. A Conway sphere separates its rational tangle from two trivial outside arcs.'},
    {title:'Boundary data becomes a pillowcase.',tag:'TRACELESS SU(2) CHARACTERS',desc:'Two angular coordinates on a torus cover, paired by sign reversal. The quotient is displayed as a front and back square with corresponding edges glued.'},
    {title:'Each tangle leaves a curve.',tag:'RESTRICTION MAPS',desc:'The explicit perturbed trivial-tangle curve L0 and rational trefoil-tangle curve L1 on both faces of the pillowcase.'},
    {title:'An intersection is compatible data.',tag:'THREE TRANSVERSE GENERATORS',desc:'Three clickable intersection points representing compatible boundary characters of the two tangle objects.'},
    {title:'A basis is only the beginning.',tag:'THE FLOER COMPARISON',desc:'Three corresponding gauge-theory and surface Floer generators. A separate local bigon schematic illustrates how a differential can arise.'}
  ];
  function controlsHTML() {
    if(state.step===0) return `<button class="button primary" id="cut-button">${state.cut?'Glue the tangles back ↺':'Cut along the sphere →'}</button><span class="control-note">${state.cut?'The knot information is retained by the tangles and their marked gluing.':'Try the cut. The four punctures belong to both boundary spheres.'}</span><span class="status-chip">${state.cut?'Two tangles · one boundary':'Trefoil · 3 crossings'}</span>`;
    if(state.step===1) return `<div class="slider-block"><label for="gamma-slider" class="math">γ</label><input id="gamma-slider" type="range" min="0" max="2" step="0.01" value="${state.gamma/PI}" aria-label="Gamma angle in multiples of pi"><output id="gamma-output">${fmt(state.gamma)}</output></div><div class="slider-block"><label for="theta-slider" class="math">θ</label><input id="theta-slider" type="range" min="0" max="2" step="0.01" value="${state.theta/PI}" aria-label="Theta angle in multiples of pi"><output id="theta-output">${fmt(state.theta)}</output></div><button class="button secondary" id="equivalent-button">Swap equivalent lift ↔</button>`;
    if(state.step===2 || state.step===3) return `<div class="full-row"><div class="legend"><span class="legend-item"><i class="swatch"></i> L₀ · marked trivial tangle</span><span class="legend-item"><i class="swatch amber"></i> L₁ · trefoil tangle</span></div><span class="count-badge" id="intersection-count"></span></div><div class="slider-block"><label for="epsilon-slider" class="math">Perturbation ε</label><input id="epsilon-slider" type="range" min="0.02" max="0.22" step="0.01" value="${Math.max(.02,state.epsilon)}" aria-label="Perturbation epsilon in radians" ${state.epsilon===0?'disabled':''}><output id="epsilon-output">${state.epsilon.toFixed(2)}</output></div>${state.step===2?`<div class="toggle-group"><label><input id="show-l0" type="checkbox" ${state.show0?'checked':''}> Show L₀</label><label><input id="show-l1" type="checkbox" ${state.show1?'checked':''}> Show L₁</label></div><button class="button secondary" id="degenerate-button">${state.epsilon===0?'Restore perturbation':'Compare ε = 0'}</button>`:`<div class="generator-buttons" aria-label="Choose a generator">${['r','x1','x2'].map(id=>`<button class="generator-button ${state.selected===id?'selected':''}" data-generator="${id}" aria-pressed="${state.selected===id}">${id==='r'?'r':id==='x1'?'x₁':'x₂'}</button>`).join('')}</div>`}`;
    return `<div class="segmented" aria-label="Complex view"><button data-complex="trefoil" class="${!state.toy?'selected':''}" aria-pressed="${!state.toy}">Trefoil complex</button><button data-complex="toy" class="${state.toy?'selected':''}" aria-pressed="${state.toy}">How a differential works</button></div>${state.toy?'<button id="animate-button" class="button primary">Animate the contribution →</button>':'<span class="status-chip">3 generators · ∂ = 0 · rank H = 3</span>'}`;
  }
  function insightHTML() {
    if(state.step===0) return {title:state.cut?'The pieces share a four-punctured sphere.':'Cut the space, not just the drawing.',body:`<p>A ${def('conway')} meets the trefoil in four points. Each side is a ${def('tangle')}; the outside arcs form T₀ and the twists form T₁.</p><p>Remove the punctures. This common boundary is where the two sides must agree when you glue them back.</p>`,readout:`<div class="dictionary-row"><span class="math">(S³, K)</span><span>one knot in three-space</span></div><div class="dictionary-row"><span class="math">(B₀, T₀) ∪ (B₁, T₁)</span><span>two marked tangle pairs</span></div><div class="dictionary-row"><span class="math">S² ∖ {a, b, c, d}</span><span>their shared boundary</span></div>`};
    if(state.step===1) {
      const h=M.holonomies(state.gamma,state.theta),c=M.canonical(state.gamma,state.theta);
      const qvalue=q=>`${q[1].toFixed(2)}i ${q[2]<0?'−':'+'} ${Math.abs(q[2]).toFixed(2)}j`;
      return {title:'Two dots, one character.',body:`<p>Assign ${def('traceless','traceless')} ${def('su2')} holonomies to the four ${def('meridian','meridians')}, and impose ba = cd. Quotient by ${def('conjugation')}. The resulting ${def('character')} is the ${def('pillowcase')}.</p><p>Move the angles. The paired lifts represent the same point. The four ${def('corner','corners')} are fixed by the involution.</p>`,readout:`<div class="quaternion-grid"><span>a = i</span><span>b = ${qvalue(h.b)}</span><span>c = ${qvalue(h.c)}</span><span>d = ${qvalue(h.d)}</span></div><div class="dictionary-row"><span class="math">(γ, θ) ∼ (−γ, −θ)</span><span>modulo 2π</span></div><div class="dictionary-row"><span>Quotient point</span><span>${fmt(c.gamma)}, ${fmt(c.theta)} · ${c.face?'back':'front'}</span></div><div class="validation-line">✓ Boundary relation ba = cd is satisfied.</div>`};
    }
    if(state.step===2) return {title:state.epsilon===0?'The limit loses transversality.':'Restriction turns tangle data into geometry.',body:`<p>Each ${def('restriction')} gives an object in the same surface. L₁ is an embedded arc. The ${def('earring','earring-marked')} trivial tangle, with a ${def('perturbation')}, gives the ${def('immersion','immersed')} circle L₀.</p><p>On the smooth surface these are ${def('lagrangian','Lagrangian curves')}. The small open circle is L₀’s self-crossing, not an L₀–L₁ intersection.</p>`,readout:`<div class="small-note math">L₁ : R(B₁,T₁) → P &nbsp; · &nbsp; L₀ : R♮<sub>π</sub>(B₀,T₀) → P</div><div class="formula">L₁(t) = (t, −2t)</div><div class="small-note">0 ≤ t ≤ π; then pass to the quotient.</div><div class="formula">L₀(β) = (β + π/2 + ε sin β,<br>β + π/2 − ε sin β)</div><div class="small-note">β ∈ R/2πZ. At ε = 0, the circle doubles the diagonal arc and reaches the corners.</div>`};
    if(state.step===3){
      const point=M.intersections(state.epsilon).find(p=>p.id===state.selected),label=point.id==='r'?'r':point.id==='x1'?'x₁':'x₂';
      return {title:'The two restrictions agree here.',body:`<p>A ${def('transverse','transverse')} intersection matches one branch from each side. Compatible boundary characters glue; in this marked, perturbed model the three matches give ${def('generator','generators')} of the reduced singular instanton chain group.</p><p>Select a point. Its β-value identifies a branch of L₀, while t identifies the point on L₁. Counting image crossings alone can lose branch information.</p>`,readout:`<div class="generator-title"><span class="math">${label}</span><small>${point.id==='r'?'Approaches the abelian corner as ε → 0':'One of the two branches split from the interior match'}</small></div><div class="dictionary-row"><span>Boundary character</span><span>(${fmt(point.gamma)}, ${fmt(point.theta)})</span></div><div class="dictionary-row"><span>L₀ branch β</span><span>${fmt(point.beta)}</span></div><div class="dictionary-row"><span>L₁ parameter t</span><span>${fmt(point.t)}</span></div><div class="validation-line">✓ Same boundary character · distinct tangent directions</div>`};
    }
    if(state.toy)return {title:'Trajectories turn a vector space into a complex.',body:`<p>In this separate local model, the ${def('bigon')} connects u to v. Its two boundary arcs lie on different curves. An eligible index-one contribution gives ∂u = v over F₂.</p><p>The gauge-theory counterpart counts ${def('instanton','instanton trajectories')}. Identifying those two counts is much deeper than matching generators.</p>`,readout:`<div class="formula">C<sub>toy</sub> = F₂⟨u, v⟩</div><div class="formula">∂u = v, &nbsp; ∂v = 0</div><div class="small-note">This schematic assumes one eligible bigon. Both generators form a cancelling pair; the toy homology is zero. It is not a disk count for the trefoil.</div>`};
    return {title:'The trefoil is a clean first example.',body:`<p>Here CF(L₀, L₁) = F₂⟨r, x₁, x₂⟩. In this two-bridge model there are no eligible ${def('bigon','bigons')}, so ∂ = 0. The rank-three pillowcase homology agrees with reduced singular instanton homology.</p><p>A general comparison should respect gradings and gluing at the chain or ${def('ainfinity','A∞')} level. More complicated immersed objects can require ${def('bounding','bounding cochains')}.</p>`,readout:`<div class="formula">CI♮(K) ≃ CF(L₀, L₁; b)</div><div class="small-note">General research target with appropriate hypotheses and deformation data; not established by this visualization.</div><div class="dictionary-row"><span>Worked trefoil</span><span>rank C = rank H = 3</span></div><div class="dictionary-row"><span>What still carries structure</span><span>gradings · trajectories · gluing</span></div>`};
  }
  function render(rebuild=true) {
    hideTooltip();
    if(state.step===3 && state.epsilon===0) state.epsilon=.16;
    if(state.step===3){state.show0=true;state.show1=true;}
    const config=steps[state.step],info=insightHTML();
    $('step-kicker').textContent=`MOVE 0${state.step+1} / 05`;
    $('step-title').textContent=config.title;$('model-tag').textContent=config.tag;
    $('diagram-title').textContent=config.title;$('diagram-description').textContent=config.desc;
    $('diagram-content').innerHTML=svgDefs()+[drawKnot,drawQuotient,drawCurves,drawCurves,drawComplex][state.step]();
    $('diagram-caption').textContent=[state.cut?'The two boundary spheres are identified; the endpoint labels retain the gluing data.':'A planar trefoil model. The dashed circle represents the cutting sphere.',
      'Front: 0 ≤ θ ≤ π. Back: π ≤ θ ≤ 2π, drawn with height 2π−θ. All corresponding edges are glued.',
      'The repeated corner dots represent four reducible characters on the glued surface.',
      'Each dark point pairs branches from different restriction objects.',
      state.toy?'Shaded disk: a local differential schematic, separate from the trefoil.':'The generator dictionary is concrete; the general trajectory comparison is a research problem.'][state.step];
    if(rebuild)$('controls').innerHTML=controlsHTML();
    if($('gamma-output'))$('gamma-output').textContent=fmt(state.gamma);
    if($('theta-output'))$('theta-output').textContent=fmt(state.theta);
    if($('epsilon-output'))$('epsilon-output').textContent=state.epsilon.toFixed(2);
    if($('intersection-count'))$('intersection-count').innerHTML=state.epsilon===0?'<span class="status-chip warning-chip">Degenerate limit</span>':(!state.show0||!state.show1?'<span class="small-note">Both curves needed to see matches</span>':'<strong>3</strong> intersections');
    $('insight-title').textContent=info.title;$('insight-body').innerHTML=info.body;$('readout-body').innerHTML=info.readout;
    $('readout-kicker').textContent=['THE GEOMETRIC DICTIONARY','LIVE BOUNDARY HOLONOMIES','THE EXPLICIT CURVE MODEL','SELECTED GENERATOR','THE CHAIN GROUP & ITS DIFFERENTIAL'][state.step];
    document.querySelectorAll('.step').forEach((el,i)=>{el.classList.toggle('active',i===state.step);el.classList.toggle('completed',i<state.step);if(i===state.step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
    $('step-progress').textContent=`Step ${state.step+1} of 5`;$('previous-button').disabled=state.step===0;
    $('next-button').textContent=['Meet the pillowcase →','Trace the curves →','Match intersections →','Build the complex →','Restart journey ↺'][state.step];
    if($('diagram-dialog').open)updateZoom();
  }
  function stopAnimation(){if(animation!==null)cancelAnimationFrame(animation);animation=null;state.playing=false;state.animationProgress=0;}
  function go(step){stopAnimation();state.step=Math.max(0,Math.min(4,step));render();}
  function reset(){stopAnimation();Object.assign(state,{step:0,cut:false,gamma:.68*PI,theta:.42*PI,epsilon:.16,show0:true,show1:true,selected:'x1',toy:false});render();}
  function hideTooltip(){ $('tooltip').hidden=true;tooltipTarget=null; }
  function showTooltip(target){
    const key=target.dataset.def;if(!definitions[key])return;
    tooltipTarget=target;const tooltip=$('tooltip'),host=document.querySelector('dialog[open]')||document.body;
    if(tooltip.parentElement!==host)host.appendChild(tooltip);
    tooltip.innerHTML=`<b>${definitions[key][0]}</b>${definitions[key][1]}`;tooltip.hidden=false;
    const r=target.getBoundingClientRect(),width=Math.min(300,window.innerWidth-24);
    tooltip.style.maxWidth=width+'px';tooltip.style.left=Math.max(12,Math.min(window.innerWidth-width-12,r.left))+'px';
    tooltip.style.top=Math.max(12,Math.min(window.innerHeight-tooltip.offsetHeight-12,r.bottom+9))+'px';
  }
  function updateZoom(){$('diagram-dialog-title').textContent=steps[state.step].title;$('zoom-content').innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 440" role="group" aria-label="Enlarged interactive diagram">${$('diagram-content').innerHTML}</svg>`;}
  function openDialog(id){hideTooltip();if(id==='diagram-dialog')updateZoom();$(id).showModal();}
  function animate(){
    stopAnimation();state.playing=true;const start=performance.now();
    const frame=now=>{state.animationProgress=Math.min(1,(now-start)/2200);$('diagram-content').innerHTML=svgDefs()+drawComplex();if($('diagram-dialog').open)updateZoom();
      if(state.animationProgress<1)animation=requestAnimationFrame(frame);else{animation=null;state.playing=false;}};
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){state.animationProgress=1;$('diagram-content').innerHTML=svgDefs()+drawComplex();state.playing=false;return;}
    animation=requestAnimationFrame(frame);
  }
  document.addEventListener('click',event=>{
    const target=event.target.closest('button,[data-generator],[data-def],[data-go]');
    if(!target){hideTooltip();return;}
    if(target.dataset.def){showTooltip(target);return;}
    hideTooltip();
    if(target.dataset.step!==undefined){go(Number(target.dataset.step));return;}
    if(target.dataset.go!==undefined){go(Number(target.dataset.go));return;}
    if(target.dataset.generator){state.selected=target.dataset.generator;if(state.step===2)state.step=3;render();return;}
    if(target.dataset.close){$(target.dataset.close).close();return;}
    if(target.dataset.complex){stopAnimation();state.toy=target.dataset.complex==='toy';render();return;}
    switch(target.id){
      case 'cut-button':state.cut=!state.cut;render();break;
      case 'previous-button':go(state.step-1);break;
      case 'next-button':if(state.step===4)reset();else go(state.step+1);break;
      case 'reset-button':reset();break;
      case 'glossary-open':openDialog('glossary-dialog');break;
      case 'diagram-expand':openDialog('diagram-dialog');break;
      case 'sources-open':case 'footer-sources':openDialog('sources-dialog');break;
      case 'equivalent-button':state.gamma=M.mod(-state.gamma);state.theta=M.mod(-state.theta);render();break;
      case 'degenerate-button':state.epsilon=state.epsilon===0?.16:0;render();break;
      case 'animate-button':animate();break;
    }
  });
  $('home-link').addEventListener('click',event=>{event.preventDefault();reset();});
  document.addEventListener('input',event=>{
    switch(event.target.id){case 'gamma-slider':state.gamma=Number(event.target.value)*PI;break;case 'theta-slider':state.theta=Number(event.target.value)*PI;break;case 'epsilon-slider':state.epsilon=Number(event.target.value);break;default:return;}render(false);
  });
  document.addEventListener('change',event=>{if(event.target.id==='show-l0')state.show0=event.target.checked;else if(event.target.id==='show-l1')state.show1=event.target.checked;else return;render(false);});
  document.addEventListener('pointerover',event=>{const target=event.target.closest('[data-def]');if(target)showTooltip(target);});
  document.addEventListener('pointerout',event=>{const target=event.target.closest('[data-def]');if(target && !target.contains(event.relatedTarget))hideTooltip();});
  document.addEventListener('focusin',event=>{const target=event.target.closest('[data-def]');if(target)showTooltip(target);});
  document.addEventListener('focusout',hideTooltip);
  window.addEventListener('resize',hideTooltip);
  window.addEventListener('scroll',hideTooltip,{passive:true});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){hideTooltip();return;}
    if(document.querySelector('dialog[open]'))return;
    if(event.target.closest('.site-nav'))return;
    if(/INPUT|SELECT|TEXTAREA/.test(event.target.tagName))return;
    if(event.key==='ArrowRight'){event.preventDefault();go(Math.min(4,state.step+1));}
    else if(event.key==='ArrowLeft'){event.preventDefault();go(Math.max(0,state.step-1));}
    else if((event.key==='Enter'||event.key===' ') && event.target.matches('[data-generator],[data-def]') && event.target.tagName!=='BUTTON'){event.preventDefault();event.target.click();}
  });
  $('glossary-list').innerHTML=Object.entries(definitions).map(([key,[title,body]])=>`<div class="glossary-item" id="definition-${key}"><b>${title}</b><p>${body}</p></div>`).join('');
  render();
  // Expose a read-only snapshot for deterministic, browser-independent interaction checks.
  window.PillowcaseExplorer={snapshot:()=>({...state,intersections:M.intersections(state.epsilon)}),exportDiagram:()=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 440" width="900" height="440">${$('diagram-content').innerHTML}</svg>`};
})();
