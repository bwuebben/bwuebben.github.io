(()=>{
'use strict';
const M=window.CobMath,$=id=>document.getElementById(id),PI=Math.PI;
const PAPER='https://github.com/bwuebben/donaldson-atiyah-floer/blob/main/af-cob-1/';
const term=(word,key=word)=>`<button class="term" data-term="${key}">${word}</button>`;
const glossary={
 'cobordism':['Cobordism','A compact oriented four-manifold W whose boundary is −Y₀ ⊔ Y₁. It records a geometric passage between the closed three-manifolds Y₀ and Y₁. Here the objects and W are connected; the theorem also includes a framed arc and bundle data.'],
 'handle':['Handle','An index-k handle in dimension four is Dᵏ × D⁴⁻ᵏ, attached along Sᵏ⁻¹ × D⁴⁻ᵏ. On the three-dimensional boundary this replaces Sᵏ⁻¹ × D⁴⁻ᵏ by Dᵏ × S³⁻ᵏ. A handle decomposition describes a cobordism as elementary attachments.'],
 'Heegaard splitting':['Heegaard splitting','A decomposition Y = H₀ ∪Σ H₁ into two three-dimensional handlebodies meeting along a closed surface Σ. In the framed construction, a torus attachment produces compression bodies C₀ and C₁ with a common genus-h boundary.'],
 'connection':['Connection','A rule for transporting internal vectors along paths in a bundle. Flatness means that the curvature vanishes. Gauge-equivalent rules describe the same geometric data.'],
 'character variety':['Character variety / moduli space','A space whose points are flat connections modulo gauge equivalence, equivalently suitable representations of the surface fundamental group modulo conjugation. The paper uses the nontrivial SO(3) bundle on a genus-h surface. Its smooth moduli space has real dimension 6h−6 for h ≥ 2.'],
 'Lagrangian':['Lagrangian','A half-dimensional submanifold on which the symplectic form vanishes. Here L(C) consists of boundary flat connections that extend over the compression body C. For h ≥ 2 its dimension is 3h−3. The curves in the diagram are a low-dimensional schematic.'],
 'Floer homology':['Floer homology','An algebraic invariant formed from generators and a differential counting suitable trajectories. On the symplectic side the generators are transverse Lagrangian intersections and the differential counts holomorphic strips. Homology identifies cycles that differ by boundaries.'],
 'instanton':['Instanton','In this setting a gauge-equivalence class of connections satisfying the anti-self-duality equation F⁺ₐ = 0, with the perturbations and boundary conditions needed for the construction. Zero-dimensional moduli spaces provide counts.'],
 'compression body':['Compression body','A three-dimensional cobordism built from a surface times an interval by adding one-handles to one end. It records which surface flat connections extend into the interior, through a Lagrangian submanifold or correspondence.'],
 'mixed equation':['Mixed equation','A coupled problem: anti-self-dual connections on a four-dimensional part and holomorphic maps into a surface moduli space on a two-dimensional part, linked by a matching condition. Counts of its solutions define the comparison maps N.'],
 'holomorphic triangle':['Holomorphic triangle','A holomorphic map from a disk with three marked boundary points to the symplectic target, with its three boundary arcs on specified Lagrangians. Its corners carry Floer generators. A two-handle map fixes an auxiliary corner θ and counts such maps.'],
 'naturality':['Naturality','The comparison commutes with the maps assigned to cobordisms: N₁ I♯(W) = S(W) N₀ on homology over 𝔽₂. It is the compatibility of translations with transformations.'],
 'adiabatic limit':['Adiabatic limit','A limiting process in which selected metric directions are shrunk. Here gC is replaced by ε²gC while the adjacent holomorphic strip remains. As ε tends to zero, the compression rectangle is replaced by a Lagrangian boundary condition and two mixed ends.'],
 'excision':['Torus excision','A cut-and-reglue comparison along torus fibres. In this paper it is adapted to the mixed equation, where the torus region runs into mixed ends. The nontrivial SO(3) bundle on the torus has a point as its moduli space of flat connections.'],
 'functor':['Functor','An assignment that sends spaces to algebraic objects and cobordisms to maps, preserving identity maps and composition. Gluing W₀₁ to W₁₂ is reflected by multiplying their maps in the corresponding order.'],
 'orientation':['Orientation','A coherent choice of sign for counting isolated solutions. Over 𝔽₂ only parity matters. Integral counts distinguish +1 from −1, and the signs must behave consistently under gluing and limiting processes.'],
 'projective functor':['Projective functor','Here cobordism maps are defined up to one overall sign, with composition respected up to that ambiguity. Paper II obtains this over ℤ using orientations transported through the mixed equation. It does not identify these with every other orientation convention.'],
 'orientation system':['Orientation system','A coherent choice of orientations of the determinant lines over all moduli spaces entering a Floer complex and its maps, so that gluing multiplies signs consistently. Two systems can orient every isolated solution the same way and still differ in the signs of a differential. Paper III compares the system calibrated to the gauge reference of Paper II with the sphere-positive system of Daemi, Fukaya and Lipyanskiy, in which attaching a generator sphere preserves orientation.'],
 'weighted count expression':['Weighted count expression','A finite integer combination of composable products of actual zero-dimensional counts: ordinary instanton trajectory, continuation and cobordism counts, surgery-family counts, the symplectic words of Paper II, and forward and reflected mixed counts, with orientation-line identifications and grading-dependent weights. Paper III builds its normalizing maps from such expressions, so that they count existing moduli spaces rather than being chosen by abstract linear algebra.']
};
const chapters=[
 {name:'A space changes',title:'A transformation<br>has a shape.',kicker:'01 / THE GEOMETRIC START',kind:'A two-dimensional analogy',description:`A ${term('cobordism')} is a space between spaces. Move a slice through this surface: a circle separates and rejoins, revealing a handle in the surface’s interior.`,insight:'The slice changes. The complete surface records the entire transformation.',formula:'∂W = −Y₀ ⊔ Y₁<small>In the paper: dim Yᵢ = 3 and dim W = 4.</small>',try:'<b>Try this:</b> move the time slice through both necks. Drag the model to change your viewpoint.',math:'<p>The drawing is an actual level-set surface in three-dimensional display space, used as a two-dimensional cobordism analogy. Its one-dimensional slices are Cassini ovals. One circle becomes two and then one again; the total surface has two connected boundary circles.</p><p>The theorem concerns four-dimensional cobordisms between connected three-manifolds. Their handle diagrams encode geometry that this surface does not depict.</p>',caption:'Exact level-set surface used as a lower-dimensional analogy. The intermediate circles are not the three-manifolds of the theorem.'},
 {name:'Two languages',title:'One boundary.<br>Two descriptions.',kicker:'02 / THE ATIYAH–FLOER DICTIONARY',kind:'Heegaard data → a symplectic target',description:`A ${term('Heegaard splitting')} cuts a three-manifold into two pieces. Their boundary ${term('connection','connection')} data live in one shared moduli space. Data that extend into each piece form a ${term('Lagrangian')}.`,insight:'An intersection means that the same boundary data extend into both sides.',formula:'I<sup>♯</sup>(Y) ≅ HF(L(C₀), L(C₁))<small>The comparison is built by counting solutions of a mixed equation.</small>',try:'<b>Try this:</b> follow boundary data into the target. Change the surface genus and watch its true dimensions grow.',math:'<p>The paper uses the nontrivial SO(3) bundle over the torus-stabilized surface Σh, with h = g + 1. For h ≥ 2 the moduli space has real dimension 6h−6 and the Lagrangians have dimension 3h−3. The h = 1 case is a point and is omitted from this control.</p><p>After suitable perturbations, intersections are Floer generators. Strips define the differential; the group is not simply the set of intersections. Daemi, Fukaya and Lipyanskiy supply the mixed-isomorphism construction on which the manuscript builds.</p>',caption:'The surface and target are schematic. The target curves illustrate half-dimensional Lagrangians; this is not the pillowcase and no character variety is being numerically solved.'},
 {name:'Attach a handle',title:'Geometry becomes<br>an algebraic map.',kicker:'03 / THE ELEMENTARY BUILDING BLOCKS',kind:'Handle maps · diagrammatic model',description:`A four-dimensional ${term('handle')} changes the outgoing three-manifold. On the symplectic side its map is built from ${term('holomorphic triangle','holomorphic triangle')} counts, with compression correspondences for one- and three-handles.`,insight:'The two-handle map fixes an auxiliary generator θ and sends an input x to a sum of possible outputs y.',formula:'S₂(x) = μ(x, θ)<small>Triangle counts over 𝔽₂.</small>',try:'<b>Try this:</b> switch between handle indices. Play the triangle to follow its inputs, boundary conditions, and output.',math:'<p>For two-handles, the construction uses a subordinate Heegaard triple and a maximal-relative-grading auxiliary class θ. One-handles use a compression cup: a triangle count in a product target with a compression-body correspondence as its middle Lagrangian. Three-handles use the transposed cap.</p><p>The animated filling is a domain schematic. Its path is not a numerical solution of the holomorphic-curve equation, and the displayed corners do not compute a specific manifold’s Floer groups.</p>',caption:'A triangle-domain diagram, not a computed holomorphic image. One- and three-handle maps use a folded product target and compression correspondence.'},
 {name:'Compare the maps',title:'Take either route.<br>Reach the same place.',kicker:'04 / THE CENTRAL COMPARISON',kind:'Exact linear algebra over 𝔽₂',description:`${term('Naturality','naturality')} says the comparison respects a cobordism map. The square below is an exact two-dimensional algebra model: choose a vector, send it along both routes, and compare the answers.`,insight:'Both routes agree because the entire square commutes, not just because one chosen vector happens to agree.',formula:'N₁ I<sup>♯</sup>(W) = S(W) N₀<small>Paper I, Theorem A: equality on homology over 𝔽₂.</small>',try:'<b>Try this:</b> alter the symplectic map, then test different vectors. A single vector can miss a failure of naturality.',math:'<p>The sandbox uses F = [[1,1],[0,1]] and invertible N₀, N₁ over 𝔽₂. It constructs S = N₁ F N₀⁻¹. The “alter map” control changes one entry of S. The matrix defect Δ = N₁F − SN₀ detects whether the whole square commutes.</p><p>These are illustrative vector spaces, not computed instanton or symplectic invariants. The paper proves the square for its geometric maps. At chain level it asserts compatibility up to chain homotopy.</p>',caption:'All displayed matrices and vectors are calculated exactly modulo two. They demonstrate naturality algebraically and are not Floer data for a particular cobordism.'},
 {name:'Reveal the bridge',title:'An interior becomes<br>a boundary condition.',kicker:'05 / THE ANALYTIC HEART',kind:'Compression-body collapse · Theorem B',description:`Shrink a ${term('compression body')} next to a holomorphic strip. In the ${term('adiabatic limit')}, its interior is replaced by L(C), the boundary data that extend over C. Two mixed ends appear at the endpoints.`,insight:'The strip stays. The shrinking region leaves a Lagrangian boundary condition and two mixed ends.',formula:'g<sub>C</sub> ↦ ε²g<sub>C</sub> &nbsp; · &nbsp; ε → 0<small>After conformal change: neck length = log(1/ε).</small>',try:'<b>Try this:</b> shrink ε, then switch to the neck view. Explore torus excision, the second analytic input.',math:'<p>Under the paper’s local-data and regularity hypotheses, Theorem B gives a bijection of index-zero moduli spaces between the limiting problem and all sufficiently small positive scales. The result combines compactness, index–energy control, and gluing; the animation only displays the domains.</p><p>Theorem C compares the mixed maps under torus excision. The moduli space of flat connections on the odd torus is a point. This special matching condition helps split the folded problem needed for the one-handle comparison.</p>',caption:'Schematic domains for the mixed equation. Display thickness is exaggerated for visibility; ε² and log(1/ε) are the actual metric and neck parameters. No PDE solutions are simulated.'},
 {name:'Glue & orient',title:'The whole respects<br>the pieces.',kicker:'06 / COMPOSITION AND SIGNS',kind:'From elementary comparisons to a functor',description:`Glue two cobordisms. Their maps compose. Once every elementary map respects the comparison, the symplectic maps inherit a ${term('functor')}. Integer coefficients introduce coherent ${term('orientation')} signs.`,insight:'The intermediate comparison cancels. Compatibility for the pieces gives compatibility for their composite.',formula:'S(W₁₂ ∘ W₀₁) = S(W₁₂) S(W₀₁)<small>Paper I over 𝔽₂; Paper II gives a projective version over ℤ.</small>',try:'<b>Try this:</b> glue the two pieces. Then turn on signs and reverse the overall orientation in the illustrative count.',math:'<p>Write S₀₁ = N₁F₀₁N₀⁻¹ and S₁₂ = N₂F₁₂N₁⁻¹. Their product is N₂F₁₂F₀₁N₀⁻¹. The manuscript obtains independence of the symplectic word from the gauge functor and the elementary comparisons; it does not require a new symplectic Cerf-theory proof.</p><p>Paper II transports orientations through the mixed equation and obtains a projective functor on homology over ℤ, up to one overall sign per cobordism, under its almost-complex orientation convention. Paper III identifies this comparison with the usual framed instanton maps in their singular Hopf-link realization, up to a grading conversion and one sign; the nonsingular cap convention and prescribed relative-spin orientations remain open. The three-point signed count here is an algebraic illustration only.</p>',caption:'Gluing schematic and an illustrative three-point signed count. Paper II retains one overall sign per cobordism and its stated orientation convention.'},
 {name:'Normalize the signs',title:'Two conventions.<br>One comparison.',kicker:'07 / ORIENTATION SYSTEMS',kind:'Exact integer linear algebra',description:`Over ℤ, a Floer complex depends on an ${term('orientation system')}. Paper III compares two: the system calibrated to the gauge reference of Paper II, and the sphere-positive system of Daemi, Fukaya and Lipyanskiy. Change the system and watch which component of the differential changes.`,insight:'The same isolated solutions, the same mixed matrix, a different differential. Reversing the primitive loop orientation changes the sign of exactly one of the four graded components.',formula:'d⁺|<sub>C<sub>j</sub></sub> = s<sub>j</sub> d|<sub>C<sub>j</sub></sub><small>s₀ = −1, s₁ = s₂ = s₃ = 1 · Paper III, Section 6.</small>',try:'<b>Try this:</b> switch to the sphere-positive system. Then try to undo the change with signs by grading, and finally split off the cycles.',math:`<p>The complex drawn here is a nine-generator free integral complex with a ℤ/4 grading, built for the illustration: C₀ = ℤ³ and C₁ = C₂ = C₃ = ℤ², with d² = 0 and one homology class, in degree 0. Reversing the orientation of the primitive index-four loop in the framed quotient multiplies the component of the differential leaving degree 0 by −1 and leaves the other three unchanged. The degree-zero mixed matrix is unchanged.</p><p>A change of sign by grading conjugates d<sub>k</sub> to ζ<sub>k−1</sub>ζ<sub>k</sub>d<sub>k</sub>, so it changes an even number of components: the four degrees form a cycle. The two complexes are nevertheless isomorphic. Split off the cycles, fix them, and change the sign on a complement in degree 0 (Paper III, Section 6). The explorer verifies d⁺A = Ad exactly for the displayed matrices.</p><p>The algebra gives no geometric factors. Theorem B of Paper III realizes such a map by actual counts: the surgery-generation theorem of Culler derives the three-manifold from spheres, the instanton surgery triangle turns the derivation into a finite mapping cone whose maps are counts, counts through the sphere realize every grading-preserving matrix unit, and a polynomial in forward and reflected mixed counts carries the normalization to the symplectic side. The resulting maps u and v are ${term('weighted count expressions','weighted count expression')} with v N⁺ u ≃ N up to integral homotopy. They depend on choices; the composite comparison has a fixed projective homotopy class. Identification with prescribed relative-spin maps and with the nonsingular cap convention is open.</p>`,caption:'An exact nine-generator integral complex with a ℤ/4 grading, built for the illustration. Its differential, the one-component sign change and the normalizer are computed exactly; no Floer complex of any three-manifold is computed.'}
];
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const state={chapter:0,motion:!reduced,playing:false,phase:0,slice:.18,yaw:-.24,tilt:.85,genus:2,boundary:false,handle:2,basis:0,broken:false,vector:[1,1],route:0,collapse:.43,bridge:'collapse',neck:false,glue:.2,field:'F2',sign:1,system:'calib',zeta:[1,1,1,1],split:false};
const svg=(body,label)=>`<svg viewBox="0 0 680 360" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="wash" x1="0" x2="1" y1="0" y2="1"><stop stop-color="var(--diagram-panel, #eaf2f8)"/><stop offset="1" stop-color="var(--diagram-wash, #c5ddec)"/></linearGradient><linearGradient id="copper" x1="0" x2="1"><stop stop-color="var(--diagram-secondary-wash, #f1dbc9)"/><stop offset="1" stop-color="var(--diagram-paper, #faf5ef)"/></linearGradient><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--diagram-accent, #326e97)" stroke-width="1"/></marker><marker id="arrowO" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="var(--diagram-secondary, #a65c32)" stroke-width="1"/></marker></defs>${body}</svg>`;
const text=(x,y,s,c='label',extra='')=>`<text x="${x}" y="${y}" class="${c}" ${extra}>${s}</text>`;
const line=(x1,y1,x2,y2,c='line',extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c}" ${extra}/>`;
const circle=(x,y,r=4,fill='var(--diagram-accent, #30698e)')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const mat=A=>`<span class="math-matrix" aria-label="matrix ${A.flat().join(', ')}">${A.flat().map(x=>`<span>${x}</span>`).join('')}</span>`;
const vector=v=>`(${v.join(', ')})`;
function seg(name,values,current){return `<div class="segment" aria-label="${name}">${values.map(([v,label])=>`<button data-${name}="${v}" aria-pressed="${v===current}">${label}</button>`).join('')}</div>`;}
function range(id,label,val,min=0,max=1,step=.01){return `<label class="control-label" for="${id}">${label}<input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;}
function syncPlayback(){const b=$('play-scene');if(b){b.setAttribute('aria-pressed',String(state.playing));b.textContent=state.playing?'Pause Ⅱ':'Play ▷';}}
function playButton(label='Play'){return `<button class="small-button" id="play-scene" aria-pressed="${state.playing}">${state.playing?'Pause Ⅱ':label+' ▷'}</button>`;}
function updateMotion(){document.body.classList.toggle('paused',!state.motion);$('motion-toggle').textContent=state.motion?'Pause motion Ⅱ':'Enable motion ▷';$('motion-toggle').setAttribute('aria-pressed',String(!state.motion));}
function renderChapter(){
 state.playing=false;state.phase=0;state.route=0;
 const c=chapters[state.chapter];
 $('chapters').innerHTML=chapters.map((c,i)=>`<button class="chapter-tab" data-go="${i}" ${i===state.chapter?'aria-current="step"':''}><span class="number">0${i+1}</span><span class="name">${c.name}</span></button>`).join('');
 $('scene-kind').textContent=c.kind;$('scene-counter').textContent=`0${state.chapter+1} / 07`;
 $('chapter-title').innerHTML=c.title;$('chapter-kicker').textContent=c.kicker;$('chapter-description').innerHTML=c.description;$('insight').innerHTML=c.insight;$('formula').innerHTML=c.formula;$('try-this').innerHTML=c.try;$('chapter-math').innerHTML=c.math;$('scene-caption').textContent=c.caption;
 $('previous').disabled=state.chapter===0;$('next').textContent=state.chapter===6?'Restart journey ↺':chapters[state.chapter+1].name+' →';$('step-status').textContent=`Step ${state.chapter+1} of 7`;
 document.querySelector('.math-details').open=false;
 controls();renderScene();location.hash=`chapter-${state.chapter+1}`;
}
function controls(){
 let html='';
 if(state.chapter===0)html=`<div class="control-row">${playButton('Sweep slice')}${range('slice','Slice position',state.slice)}<output id="slice-value">${state.slice.toFixed(2)}</output></div><div class="control-row">${range('orbit','View angle',state.yaw,-1,1,.01)}<button id="reset-view" class="small-button">Reset view ↺</button></div>`;
 if(state.chapter===1)html=`<div class="control-row"><button class="small-button" id="boundary" aria-pressed="${state.boundary}">${state.boundary?'Show the splitting':'Follow boundary data →'}</button>${range('genus','Surface genus h',state.genus,2,5,1)}<output id="genus-value">${state.genus}</output></div><div class="control-row"><span class="control-note">Dim ℳ<sub>h</sub> = <b id="target-dim">${6*state.genus-6}</b> &nbsp; · &nbsp; dim L(Cᵢ) = <b id="lag-dim">${3*state.genus-3}</b></span><button class="small-button" data-term="character variety">What is the target? ＋</button></div>`;
 if(state.chapter===2)html=`<div class="control-row">${seg('handle',[[1,'1-handle · cup'],[2,'2-handle · triangle'],[3,'3-handle · cap']],state.handle)}${playButton('Trace triangle')}</div><div class="control-row"><span id="handle-rule" class="control-note"></span></div>`;
 if(state.chapter===3)html=`<div class="control-row"><span class="control-note">Input v</span><div class="vector-bits">${state.vector.map((v,i)=>`<button class="bit" data-bit="${i}" aria-label="Toggle input coordinate ${i+1}" aria-pressed="${v===1}">${v}</button>`).join('')}</div><button class="small-button" id="run-routes">Follow both routes ▷</button><label class="toggle-label"><input id="break-square" type="checkbox" ${state.broken?'checked':''}> Alter symplectic map</label></div><div class="control-row"><label class="control-label" for="basis">Target comparison N₁ <select id="basis"><option value="0" ${state.basis===0?'selected':''}>Swap basis vectors</option><option value="1" ${state.basis===1?'selected':''}>Upper shear</option><option value="2" ${state.basis===2?'selected':''}>Lower shear</option></select></label><span class="control-note">Click a bit to change 0 ↔ 1.</span></div>`;
 if(state.chapter===4)html=`<div class="control-row">${seg('bridge',[['collapse','Compression collapse'],['excision','Torus excision']],state.bridge)}${playButton(state.bridge==='collapse'?'Run limit':'Stretch neck')}</div><div class="control-row">${range('collapse',state.bridge==='collapse'?'Collapse':'Neck stretch',state.collapse)}<output id="epsilon-value"></output>${state.bridge==='collapse'?`<label class="toggle-label"><input id="neck-view" type="checkbox" ${state.neck?'checked':''}> Neck view</label>`:''}</div>`;
 if(state.chapter===5)html=`<div class="control-row">${playButton('Glue pieces')}${range('glue','Gluing',state.glue)}${seg('field',[['F2','𝔽₂ · parity'],['Z','ℤ · signed']],state.field)}</div><div class="control-row"><button id="flip-sign" class="small-button">Reverse overall sign ↺</button><span id="count-result" class="control-note"></span></div>`;
 if(state.chapter===6)html=`<div class="control-row">${seg('system',[['calib','Gauge-calibrated'],['plus','Sphere-positive']],state.system)}<button id="split-cycles" class="small-button" aria-pressed="${state.split}">${state.split?'Hide the normalizer':'Split off cycles'}</button></div><div class="control-row"><span class="control-note">Signs by grading ζ₀ ζ₁ ζ₂ ζ₃</span><div class="vector-bits">${state.zeta.map((z,j)=>`<button class="bit" data-zeta="${j}" aria-label="Reverse the sign on degree ${j}" aria-pressed="${z===-1}">${z===1?'+':'−'}</button>`).join('')}</div><span id="relabel-result" class="control-note"></span></div>`;
 $('scene-controls').innerHTML=html;
}
function surfaceScene(){
 if(!$('cobordism-canvas')){$('scene').innerHTML='<canvas id="cobordism-canvas" role="img" aria-label="Wireframe surface: one circular slice splits into two and rejoins. Drag horizontally to orbit."></canvas><span class="orbit-help">DRAG TO ORBIT · A SURFACE ANALOGY</span>';setupDrag();}
 drawSurface();
}
const slices=Array.from({length:49},(_,i)=>M.contour(i/48,50));
// Canvas colors follow the same CSS tokens as the SVG diagrams.
function readSurfaceTheme(){
 const style=getComputedStyle(document.querySelector('.cobordism-app')||document.documentElement);
 const color=(name,fallback)=>style.getPropertyValue(name).trim()||fallback;
 return {
  grid:color('--diagram-grid','#d6e3ec'),
  accent:color('--diagram-accent','#407799'),
  wire:color('--diagram-wire','#80acc9'),
  sliceFill:color('--diagram-slice-fill','#b0784420'),
  sliceEdge:color('--diagram-slice-edge','#ac774b66'),
  secondary:color('--diagram-secondary','#a35e35'),
  muted:color('--diagram-muted','#5d788b'),
  font:color('--sans','"DM Sans", sans-serif')
 };
}
let surfaceTheme=readSurfaceTheme();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{
 surfaceTheme=readSurfaceTheme();
 if(state.chapter===0)drawSurface();
});
function drawSurface(){
 const canvas=$('cobordism-canvas');if(!canvas)return;
 const w=canvas.clientWidth||680,h=canvas.clientHeight||360,dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;
 const ctx=canvas.getContext('2d');if(!ctx)return;ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);
 const scale=Math.min(w/9.7,h/5.6),yaw=state.yaw,tilt=state.tilt;
 const project=(t,u,v)=>{let x=(t-.5)*6.4,y=u,z=v;const X=x*Math.cos(yaw)+y*Math.sin(yaw),Y=-x*Math.sin(yaw)+y*Math.cos(yaw),Z=z*Math.cos(tilt)-Y*Math.sin(tilt);return [w*.5+X*scale,h*.5-Z*scale+Y*scale*.12];};
 const strokeSegments=(segments,t,color,width)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();for(const s of segments){const p=project(t,...s[0]),q=project(t,...s[1]);ctx.moveTo(...p);ctx.lineTo(...q);}ctx.stroke();};
 // A faint floor keeps the drawing spatial without inventing a metric.
 ctx.strokeStyle=surfaceTheme.grid;ctx.lineWidth=.6;for(let t=0;t<=1;t+=.1){let p=project(t,-1.9,-1.75),q=project(t,1.9,-1.75);ctx.beginPath();ctx.moveTo(...p);ctx.lineTo(...q);ctx.stroke();}
 for(let j=0;j<49;j++)strokeSegments(slices[j],j/48,j===0||j===48?surfaceTheme.accent:surfaceTheme.wire,j===0||j===48?1.9:.7);
 const corners=[[-1.85,-1.65],[1.85,-1.65],[1.85,1.65],[-1.85,1.65]].map(q=>project(state.slice,...q));ctx.beginPath();ctx.moveTo(...corners[0]);corners.slice(1).forEach(q=>ctx.lineTo(...q));ctx.closePath();ctx.fillStyle=surfaceTheme.sliceFill;ctx.fill();ctx.strokeStyle=surfaceTheme.sliceEdge;ctx.lineWidth=.7;ctx.stroke();
 strokeSegments(M.contour(state.slice,65),state.slice,surfaceTheme.secondary,2.4);
 const b=1.35-.62*Math.sin(PI*state.slice)**2,n=b>.9?1:2;
 ctx.font='10px '+surfaceTheme.font;ctx.textAlign='center';ctx.fillStyle=surfaceTheme.muted;
 let p=project(0,0,-1.6),q=project(1,0,-1.6);ctx.fillText('INCOMING CIRCLE',p[0],h-34);ctx.fillText('OUTGOING CIRCLE',q[0],h-34);
 ctx.fillStyle=surfaceTheme.secondary;ctx.font='12px '+surfaceTheme.font;ctx.fillText(`${n===1?'One circle':'Two circles'} at this slice`,w*.5,29);
 $('slice-value').textContent=state.slice.toFixed(2);
 $('insight').innerHTML=n===1?'<strong>One connected slice.</strong> The two ends are circles. Between them, the surface carries a handle.':'<strong>Two intermediate circles.</strong> Passing a saddle changes the slice topology. A second saddle joins the two circles again.';
}
function setupDrag(){const c=$('cobordism-canvas');let down=null;c.addEventListener('pointerdown',e=>{down={x:e.clientX,yaw:state.yaw};c.setPointerCapture(e.pointerId);});c.addEventListener('pointermove',e=>{if(down){state.yaw=Math.max(-1,Math.min(1,down.yaw+(e.clientX-down.x)/220));$('orbit').value=state.yaw;drawSurface();}});c.addEventListener('pointerup',()=>down=null);c.addEventListener('pointercancel',()=>down=null);}
function languageScene(){
 const active=state.boundary,shift=active?1:0;
 let s=text(145,35,'THREE-MANIFOLD Y','tiny','text-anchor="middle"')+text(503,35,'BOUNDARY MODULI ℳh','tiny','text-anchor="middle"');
 s+=`<ellipse cx="145" cy="162" rx="101" ry="99" fill="url(#wash)" stroke="var(--diagram-wire, #8aadc4)"/><path d="M45 162 C95 126 193 126 246 162 C193 198 95 198 45 162" fill="var(--diagram-panel, #eaf3f9)" stroke="var(--diagram-accent, #406f8f)" stroke-width="1.7"/>`;
 for(let i=0;i<8;i++)s+=`<path d="M${62+i*11} ${108+i*3} Q145 ${52+i*9} ${228-i*11} ${108+i*3}" class="thin"/>`;
 s+=text(145,113,'H₀','large','text-anchor="middle"')+text(145,220,'H₁','large','text-anchor="middle"')+text(145,165,'Σ','large','text-anchor="middle"')+text(145,288,'Cut along a surface','label','text-anchor="middle"');
 s+=`<path d="M270 165 H365" class="${active?'flow':'guide'}" marker-end="url(#arrow)"/>`+text(320,142,'restrict','tiny','text-anchor="middle"');
 s+=`<path d="M390 88 Q515 57 630 108 L609 249 Q503 282 383 237Z" fill="url(#wash)" stroke="var(--diagram-wire, #b3cbdc)"/>`;
 for(let j=0;j<6;j++)s+=`<path d="M${391+j*41} ${89+j*3} L${383+j*43} ${237+j*1.4}" class="thin"/>`;
 for(let j=0;j<5;j++)s+=`<path d="M388 ${102+j*30} Q510 ${80+j*33} 620 ${119+j*28}" class="thin"/>`;
 s+=`<path d="M404 212 C423 122 486 117 601 198" stroke="var(--diagram-secondary, #a65c32)" stroke-width="3" fill="none"/><path d="M403 133 C468 257 526 251 601 110" stroke="var(--diagram-accent, #30698e)" stroke-width="3" stroke-dasharray="8 4" fill="none"/>`;
 s+=text(591,218,'L(C₀)','orange')+text(600,94,'L(C₁)','blue')+text(504,288,'Extend into both pieces','label','text-anchor="middle"');
 const pts=[[427,169],[565,177]];pts.forEach(([x,y],i)=>{s+=circle(x,y,active?7:4,'var(--diagram-ink, #172b39)')+`<circle cx="${x}" cy="${y}" r="${active?14:9}" fill="none" stroke="var(--diagram-ink, #172b39)" stroke-opacity=".2"/>`+text(x+10,y-14,`x${i+1}`,'serif');});
 if(active){const t=state.phase%1;s+=circle(270+t*95,165,4,'var(--diagram-secondary, #a65c32)');s+=text(500,322,'Intersections → generators; strips → differential','tiny','text-anchor="middle"');}
 else s+=text(340,326,'Flat boundary data that extend over Ci form L(Ci).','tiny','text-anchor="middle"');
 $('scene').innerHTML=svg(s,'A Heegaard splitting and a schematic target with two intersecting Lagrangians');
 $('insight').innerHTML=active?`<strong>Shared boundary data become intersections.</strong> At h = ${state.genus}, these are ${3*state.genus-3}-dimensional Lagrangians in a ${6*state.genus-6}-dimensional target. The curves are a schematic.`:chapters[1].insight;
}
function handlesScene(){
 const k=state.handle;
 const rules={1:['S⁰ × D³ → D¹ × S²','A compression cup creates the handle contribution.','U꜀ : HF(Y) → HF(Y # (S¹ × S²))','Two auxiliary top classes are inputs.'],2:['S¹ × D² → D² × S¹','A framed-link surgery is encoded by a triangle map.','S₂(x) = μ(x, θ)','The auxiliary class θ has maximal relative grading.'],3:['S² × D¹ → D³ × S⁰','The compression cap is the transpose of the cup.','V꜀ : HF(Y # (S¹ × S²)) → HF(Y)','The reflected construction supplies the three-handle map.']};
 $('handle-rule').textContent=`Boundary replacement: ${rules[k][0]}`;$('insight').textContent=rules[k][1];$('formula').innerHTML=rules[k][2]+`<small>${rules[k][3]}</small>`;
 let s=text(340,22,k===2?'A TRIANGLE WITH ONE FIXED AUXILIARY INPUT':'A FOLDED TRIANGLE IN A PRODUCT TARGET','tiny','text-anchor="middle"');
 s+=`<path d="M155 271 Q160 108 340 65 Q515 115 528 271 Q343 292 155 271Z" fill="url(#wash)" stroke="var(--diagram-wire, #abc7da)"/>`;
 s+=`<path d="M155 271 Q160 108 340 65" fill="none" stroke="var(--diagram-accent, #30698e)" stroke-width="3" stroke-dasharray="8 4"/><path d="M340 65 Q515 115 528 271" fill="none" stroke="var(--diagram-secondary, #a65c32)" stroke-width="3"/><path d="M528 271 Q343 292 155 271" fill="none" stroke="var(--diagram-muted, #526e81)" stroke-width="3"/>`;
 for(let i=1;i<7;i++){let f=i/7;s+=`<path d="M${155+185*f} ${271-206*f} Q340 ${312-160*f} ${528-188*f} ${271-206*f}" class="thin"/>`;}
 s+=circle(155,271,6)+circle(340,65,6,'var(--diagram-secondary, #a65c32)')+circle(528,271,6,'var(--diagram-ink, #172b39)');
 s+=text(127,289,k===2?'x':'θ₀','large','text-anchor="end"')+text(340,52,k===2?'θ':'θ₁','large','text-anchor="middle"')+text(553,288,k===3?'x':'y','large');
 s+=text(165,162,k===2?'L₀':'A₀','label','text-anchor="end"')+text(511,161,k===2?'L₁':'L꜀','orange')+text(340,310,k===2?'L₂':'A₁','label','text-anchor="middle"');
 const f=state.phase%1,px=155+373*f,py=271-104*Math.sin(PI*f);s+=circle(px,py,5,'var(--diagram-secondary, #a65c32)')+`<path d="M155 271 Q340 64 528 271" class="guide"/>`;
 s+=text(340,220,k===2?'μ(x, θ)':'compression '+(k===1?'cup':'cap'),'large','text-anchor="middle"');
 s+=text(340,345,k===2?'Count isolated holomorphic triangles modulo two.':'The compression correspondence is one boundary condition.','tiny','text-anchor="middle"');
 $('scene').innerHTML=svg(s,'Schematic holomorphic triangle domain with labelled inputs and output');
}
function squareScene(){
 const q=M.square(state.basis,state.broken,state.vector),same=M.equal(q.top,q.bottom);
 const node=(x,y,label,sub)=>`<rect x="${x-82}" y="${y-36}" width="164" height="72" rx="3" fill="var(--diagram-paper, #f9fcfe)" stroke="var(--diagram-wire, #9ab9ce)"/>`+text(x,y-2,label,'large','text-anchor="middle"')+text(x,y+21,sub,'tiny','text-anchor="middle"');
 let s=node(161,89,'I♯(Y₀)','GAUGE · INPUT')+node(519,89,'I♯(Y₁)','GAUGE · OUTPUT')+node(161,260,'HF♯(Y₀)','SYMPLECTIC · INPUT')+node(519,260,'HF♯(Y₁)','SYMPLECTIC · OUTPUT');
 s+=line(255,89,425,89,'flow','marker-end="url(#arrow)"')+line(161,136,161,211,'flow-orange','marker-end="url(#arrowO)"')+line(519,136,519,211,'flow','marker-end="url(#arrow)"')+line(255,260,425,260,'flow-orange','marker-end="url(#arrowO)"');
 s+=text(340,65,'F = I♯(W)','serif','text-anchor="middle"')+text(340,293,'S(W)','serif','text-anchor="middle"')+text(127,184,'N₀','large','text-anchor="middle"')+text(550,184,'N₁','large','text-anchor="middle"');
 s+=text(340,161,q.commutes?'COMMUTES':'MAPS DIFFER','tiny','text-anchor="middle"')+text(340,194,q.commutes?'Δ = 0':'Δ ≠ 0','large','text-anchor="middle"');
 s+=text(70,37,`v = ${vector(state.vector)}`,'label')+text(340,334,`Upper route: ${vector(q.top)}   ${same?'=':'≠'}   Lower route: ${vector(q.bottom)}`,'label','text-anchor="middle"');
 if(state.route>0){let f=Math.min(state.route,1),a,b;if(f<.5){a=[255+170*f*2,89];b=[161,136+75*f*2];}else{a=[519,136+75*(f-.5)*2];b=[255+170*(f-.5)*2,260];}s+=circle(...a,7,'var(--diagram-accent, #30698e)')+circle(...b,7,'var(--diagram-secondary, #a65c32)');}
 $('scene').innerHTML=svg(s,'Commuting comparison square with computed vector outputs');
 $('insight').innerHTML=q.commutes?'<strong>The square commutes for every vector.</strong> Changing the comparison basis changes S, while the compatibility is preserved.':same?'<strong>This vector misses the defect.</strong> Its two outputs agree, but Δ ≠ 0: the maps do not commute. Try another input.':'<strong>The two routes now disagree.</strong> The altered map fails the comparison. A matching source and target alone are not enough.';
 $('formula').innerHTML=`<div class="matrix-strip"><span><span class="matrix-label">S = </span>${mat(q.S)}</span><span><span class="matrix-label">Δ = </span>${mat(q.residual)}</span></div><small>Δ = N₁F − SN₀ &nbsp; · &nbsp; all entries modulo two.</small>`;
}
function collapseScene(){
 const t=state.collapse,c=M.collapse(t),lim=t>=1;$('epsilon-value').textContent=lim?'ε → 0':`ε ${c.epsilon.toFixed(3)}`;
 if(state.bridge==='excision'){excisionScene();return;}
 $('scene-kind').textContent=state.neck?'The same limit · conformal neck view':'Compression-body collapse · Theorem B';
 let s=text(340,31,state.neck?'SHRINKING GEOMETRY BECOMES A LONG NECK':'THE STRIP REMAINS WHILE THE COMPRESSION BODY SHRINKS','tiny','text-anchor="middle"');
 if(!state.neck){
   const depth=lim?0:100*Math.pow(c.epsilon,.27),seam=173;
   s+=`<path d="M135 72 L532 72 L550 ${seam} L117 ${seam}Z" fill="url(#wash)" stroke="var(--diagram-wire, #8daec5)"/>`;
   for(let j=0;j<7;j++)s+=`<path d="M${145+j*59} 72 Q${120+j*66} 120 ${125+j*67} ${seam}" class="thin"/>`;
   s+=text(337,108,'holomorphic strip','label','text-anchor="middle"')+text(337,134,'∂̄Ju = 0','large','text-anchor="middle"');
   if(!lim){s+=`<path d="M117 ${seam} L550 ${seam} L567 ${seam+depth} Q339 ${seam+depth+25} 99 ${seam+depth}Z" fill="url(#copper)" stroke="var(--diagram-secondary, #c09575)"/>`;for(let j=0;j<9;j++)s+=`<path d="M${123+j*53} ${seam} Q${120+j*55} ${seam+depth*.65} ${106+j*56} ${seam+depth+5}" fill="none" stroke="var(--diagram-secondary, #bf9271)" stroke-width=".6"/>`;s+=text(337,seam+depth*.52+6,'I × C','large','text-anchor="middle"');}
   s+=line(117,seam,550,seam,'','stroke="var(--diagram-secondary, #a65c32)" stroke-width="3"')+text(337,lim?seam+30:seam+depth+49,lim?'L(C) boundary condition':'compression rectangle','label','text-anchor="middle"');
   [117,550].forEach(x=>{s+=`<circle cx="${x}" cy="${seam}" r="${8+9*t}" fill="var(--diagram-panel, #edf3f7)" stroke="var(--diagram-accent, #356e94)" stroke-width="2"/>`+`<path d="M${x} ${seam+17} V${seam+53}" class="${t>.7?'flow':'guide'}"/>`+text(x,seam+70,'mixed end','tiny','text-anchor="middle"');});
 }else{
   const len=lim?188:45+143*t;
   s+=`<rect x="127" y="75" width="426" height="65" rx="2" fill="url(#wash)" stroke="var(--diagram-wire, #8dafc6)"/>`+text(340,112,'holomorphic strip','large','text-anchor="middle"');
   [145,535].forEach(x=>{s+=`<rect x="${x-20}" y="140" width="40" height="${len}" fill="url(#copper)" stroke="var(--diagram-secondary, #b17e56)"/>`;for(let j=0;j<11;j++)s+=`<ellipse cx="${x}" cy="${148+j*len/11}" rx="20" ry="5" fill="none" stroke="var(--diagram-secondary, #c4a185)" stroke-width=".65"/>`;s+=text(x,lim?346:155+len,'C','serif','text-anchor="middle"');});
   s+=line(167,141,512,141,'','stroke="var(--diagram-secondary, #a65c32)" stroke-width="3"')+text(340,170,'L(C)','large','text-anchor="middle"')+text(340,238,lim?'ℓ → ∞':`ℓ = ${c.neck.toFixed(2)}`,'large','text-anchor="middle"')+text(340,263,'ℓ = log(1/ε)','label','text-anchor="middle"');
 }
 s+=text(340,339,state.neck?'The drawn length is bounded; the limiting neck is infinite.':lim?'The limiting boundary retains the extension condition.':`Metric multiplier ε² = ${c.metric.toFixed(5)}`,'tiny','text-anchor="middle"');
 $('scene').innerHTML=svg(s,'Compression rectangle collapses to a Lagrangian boundary condition with two mixed ends');
 $('insight').innerHTML=lim?'<strong>The limiting domain has two mixed ends.</strong> The rectangle is replaced by L(C). Under the theorem’s hypotheses, its isolated solutions correspond to those at sufficiently small positive ε.':state.neck?'<strong>Two descriptions of one degeneration.</strong> Shrinking the metric becomes neck stretching after a conformal change. The logarithm records the growing length.':chapters[4].insight;
 $('formula').innerHTML='g<sub>C</sub> ↦ ε²g<sub>C</sub><small>The strip does not collapse. Theorem B concerns isolated-solution counts.</small>';
}
function excisionScene(){
 $('scene-kind').textContent='Torus excision · Theorem C';$('epsilon-value').textContent=`ℓ ${Math.round(state.collapse*100)}%`;
 const t=state.collapse,gap=30+150*t,left=340-gap/2,right=340+gap/2;
 let s=text(340,30,'A TORUS FIBRE OVER A STRETCHING PLANAR DOMAIN','tiny','text-anchor="middle"');
 s+=`<path d="M100 95 Q${left} 90 ${left} 150 L${left} 205 Q${left} 267 100 269" fill="none" stroke="var(--diagram-accent, #386e91)" stroke-width="2"/><path d="M580 95 Q${right} 90 ${right} 150 L${right} 205 Q${right} 267 580 269" fill="none" stroke="var(--diagram-secondary, #a65c32)" stroke-width="2"/>`;
 s+=`<rect x="${left}" y="149" width="${gap}" height="57" fill="url(#wash)" stroke="var(--diagram-wire, #87acc5)"/>`;
 for(let j=0;j<9;j++){const x=left+gap*j/8;s+=`<ellipse cx="${x}" cy="178" rx="6" ry="28" class="thin"/>`;}
 s+=text(340,132,'T² × long strip','label','text-anchor="middle"')+text(340,244,'ℳodd(T²) = {point}','large','text-anchor="middle"');
 s+=text(101,74,'mixed end','tiny','text-anchor="middle"')+text(579,74,'mixed end','tiny','text-anchor="middle"')+circle(100,95,6)+circle(580,95,6,'var(--diagram-secondary, #a65c32)')+circle(100,269,6)+circle(580,269,6,'var(--diagram-secondary, #a65c32)');
 s+=text(165,185,'N₋','large','text-anchor="middle"')+text(515,185,'N₊','large','text-anchor="middle"')+text(340,311,'Compatible matching lets the folded comparison factor.','tiny','text-anchor="middle"');
 $('scene').innerHTML=svg(s,'Schematic torus-fibre domain stretching between two mixed pieces');
 $('insight').innerHTML='<strong>The odd torus has only one flat-connection class.</strong> The matching data simplify enough to compare excision with the tensor product of the two mixed maps.';
 $('formula').innerHTML='[K][N<sub>Z</sub>] = ([N₋] ⊗ [N₊])[E]<small>Paper I, Theorem C · over 𝔽₂.</small>';
}
function compositionScene(){
 const t=state.glue,gap=58*(1-t),left=340-gap/2,right=340+gap/2;
 let s=text(340,31,'GLUING IN GEOMETRY · COMPOSITION IN ALGEBRA','tiny','text-anchor="middle"');
 const tube=(a,b,color,fill,label)=>`<path d="M${a} 92 Q${(a+b)/2} 140 ${b} 92 L${b} 200 Q${(a+b)/2} 152 ${a} 200Z" fill="${fill}" stroke="${color}"/><ellipse cx="${a}" cy="146" rx="14" ry="54" fill="${fill}" stroke="${color}"/><ellipse cx="${b}" cy="146" rx="14" ry="54" fill="none" stroke="${color}"/>`+text((a+b)/2,150,label,'large','text-anchor="middle"');
 s+=tube(86,left,'var(--diagram-accent, #4b7e9e)','url(#wash)','W₀₁')+tube(right,594,'var(--diagram-secondary, #a0714e)','url(#copper)','W₁₂');
 s+=text(86,224,'Y₀','label','text-anchor="middle"')+text(340,225,t>.95?'glued along Y₁':'match Y₁ boundaries','label','text-anchor="middle"')+text(594,224,'Y₂','label','text-anchor="middle"');
 if(t>.95)s+=line(340,92,340,200,'guide');
 s+=text(238,265,'N₂ F₁₂','large','text-anchor="middle"')+text(350,265,'N₁⁻¹ N₁','large','text-anchor="middle"')+text(467,265,'F₀₁ N₀⁻¹','large','text-anchor="middle"');
 if(t>.5)s+=line(306,259,394,259,'','stroke="var(--diagram-secondary, #a65c32)" stroke-width="1.5"');
 const count=M.signedCount(state.sign,state.field),terms=state.field==='F2'?['1','1','1']:count.terms.map(x=>x>0?'+1':'−1');
 s+=text(125,328,'ILLUSTRATIVE COUNT','tiny');terms.forEach((v,i)=>{s+=`<circle cx="${350+i*55}" cy="322" r="17" fill="var(--diagram-paper, #f9fcfe)" stroke="var(--diagram-muted, #9ab6c9)"/>`+text(350+i*55,327,v,'serif','text-anchor="middle"');});s+=text(512,329,`= ${count.total}`,'large');
 $('scene').innerHTML=svg(s,'Two schematic cobordism pieces gluing and cancellation of the intermediate comparison');
 $('count-result').textContent=state.field==='F2'?`Three points give parity ${count.total}. Overall sign is invisible.`:`Signed count ${count.total}. One overall sign changes every point together.`;
 $('insight').innerHTML=state.field==='Z'?'<strong>Over ℤ, orientations matter.</strong> Reversing an overall orientation changes the signed map by −1. Paper II preserves the comparison up to this overall ambiguity.':t>.95?'<strong>The middle comparison cancels.</strong> N₁⁻¹N₁ = id. The composite inherits compatibility, and the symplectic maps inherit functoriality.':chapters[5].insight;
}
function normalizationScene(){
 const d=M.graded.d,dT=M.twist(d),target=state.system==='plus'?dT:d,shown=M.relabel(target,state.zeta);
 const changed=M.changedComponents(d,shown),byZeta=M.changedComponents(target,state.zeta.every(z=>z===1)?target:shown),nontrivial=state.zeta.some(z=>z===-1);
 const ok=M.intertwines(M.normalizer,d,dT),gens=M.graded.generators;
 // Four degrees on a cycle; d_k runs from degree k to degree k−1.
 const pos=[[340,58],[566,178],[340,298],[114,178]],names=['d₀','d₁','d₂','d₃'];
 let s=text(340,24,'ONE COMPLEX, TWO ORIENTATION SYSTEMS','tiny','text-anchor="middle"');
 for(let k=0;k<4;k++){const [ax,ay]=pos[k],[bx,by]=pos[(k+3)%4];const dx=bx-ax,dy=by-ay,len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len;const x1=ax+ux*62,y1=ay+uy*30,x2=bx-ux*62,y2=by-uy*30;const flipped=changed.includes(k);
  s+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${flipped?'flow-orange':'line'}" marker-end="url(#${flipped?'arrowO':'arrow'})"/>`;
  const mx=(x1+x2)/2+(-uy)*18,my=(y1+y2)/2+ux*18;s+=text(mx,my,`${names[k]}`,'serif','text-anchor="middle"')+`<circle cx="${mx+(k===0||k===2?34:0)}" cy="${my+(k===1||k===3?22:0)-5}" r="9" fill="${flipped?'var(--diagram-secondary, #a65c32)':'var(--diagram-paper, #f9fcfe)'}" stroke="${flipped?'var(--diagram-secondary, #a65c32)':'var(--diagram-wire, #9ab9ce)'}"/>`+text(mx+(k===0||k===2?34:0),my+(k===1||k===3?22:0)-1,flipped?'−':'+','serif',`text-anchor="middle" ${flipped?'fill="var(--diagram-paper, #f9fcfe)"':''}`);}
 for(let j=0;j<4;j++){const [x,y]=pos[j];s+=`<rect x="${x-60}" y="${y-26}" width="120" height="52" rx="3" fill="var(--diagram-paper, #f9fcfe)" stroke="var(--diagram-wire, #9ab9ce)"/>`+text(x,y-3,`C${'₀₁₂₃'[j]} = ℤ${j===0?'³':'²'}`,'large','text-anchor="middle"')+text(x,y+16,state.split?`A = (${M.normalizer[j].map(v=>v>0?'+1':'−1').join(', ')})`:gens[j].join('  '),'tiny','text-anchor="middle"');}
 s+=text(340,178,state.system==='plus'?'sphere-positive':'gauge-calibrated','label','text-anchor="middle"')+text(340,198,changed.length?`changed: ${changed.map(k=>names[k]).join(', ')}`:'all four components agree','tiny','text-anchor="middle"');
 s+=text(340,345,state.split?`Cycles ⟨e₁,e₃⟩, ⟨f₂⟩, ⟨g₂⟩, ⟨h₁⟩ fixed · e₂ ↦ −e₂ · d⁺A = Ad ${ok?'verified exactly':'fails'}`:'d₁f₁ = e₁ · d₂g₁ = f₂ · d₃h₂ = g₂ · d₀e₂ = h₁ · d² = 0 · one homology class, in degree 0','tiny','text-anchor="middle"');
 $('scene').innerHTML=svg(s,'Four graded pieces of an integral complex on a cycle, with the sign of each component of the differential');
 const r=$('relabel-result');if(r)r.textContent=nontrivial?`ζ changes ${byZeta.length} component${byZeta.length===1?'':'s'}${byZeta.length?' ('+byZeta.map(k=>names[k]).join(', ')+')':''}: always an even number.`:'Reverse signs on degrees to relabel.';
 $('insight').innerHTML=state.split?`<strong>Split off the cycles.</strong> Fix ⟨e₁,e₃⟩ and send e₂ to −e₂. Then d⁺A = Ad, ${ok?'verified exactly on the displayed matrices':'which fails here'}. Theorem B of Paper III realizes a map of this kind by counts through a sphere.`:nontrivial?`<strong>Signs by grading change an even number of components.</strong> The four degrees form a cycle, so d₀ alone cannot be reached by relabelling. The two complexes are isomorphic all the same.`:state.system==='plus'?'<strong>Exactly one component changed.</strong> The component d₀ from degree 0 to degree 3 has the opposite sign; d₁, d₂ and d₃ agree, and so does the degree-zero mixed matrix.':chapters[6].insight;
 $('formula').innerHTML=state.split?'d⁺A = Ad<small>A fixes the cycles and multiplies a complement in degree 0 by −1. The theorem replaces A by weighted count expressions.</small>':chapters[6].formula;
}
function renderScene(){[surfaceScene,languageScene,handlesScene,squareScene,collapseScene,compositionScene,normalizationScene][state.chapter]();}
function go(i,scroll=false){state.chapter=Math.max(0,Math.min(6,i));renderChapter();if(scroll)$('laboratory').scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});}
function sources(){return `<p>This explorer follows <a href="${PAPER}cobordism-maps-and-atiyah-floer-isomorphisms.pdf" target="_blank" rel="noopener">Paper I, version 19 October 2026</a>, especially the introduction and Theorems A, B and C. Its sign discussion follows <a href="${PAPER}PAPER-II.md" target="_blank" rel="noopener">Paper II, version 19 October 2026 and its scope statement</a>. The seventh move follows Section 6 and Theorem B of <a href="${PAPER}PAPER-III.md" target="_blank" rel="noopener">Paper III, version 29 October 2026 and its scope statement</a>, the comparison of orientation conventions.</p><h3>What the manuscript establishes</h3><p>The comparison of framed instanton and symplectic Floer homology is compatible with decorated connected four-dimensional cobordisms, over 𝔽₂. The cobordisms carry a framed tube between parametrized balls and an SO(3) bundle trivialized on the ends and tube. The symplectic maps are independent of admissible decompositions and presentations.</p><h3>What is drawn and computed</h3><p>The first model is a lower-dimensional Cassini-oval surface: ((u−a)²+v²)((u+a)²+v²) = b(t)⁴, with a = 0.9 and b(t) = 1.35−0.62 sin²(πt). The surface and its slices are computed from this equation. The other geometric diagrams are schematics of domains or algebraic relationships. The square sandbox computes exactly in 𝔽₂². The signed count is a three-point toy example. The orientation-system model is a nine-generator free integral complex with a ℤ/4 grading, built for the illustration; its differential, the one-component sign change and the normalizer are computed exactly over ℤ.</p><p>The displayed maps do not compute the Floer invariants of a chosen manifold. No anti-self-dual connection or holomorphic curve is numerically solved, and the animations do not verify the analytic proofs.</p><h3>Scope that remains visible</h3><p class="scope">Paper I concerns connected objects and cobordisms, with its admissibility and bundle hypotheses. It does not construct the units, counits or closed pairings of a full field theory. Paper II gives a projective integral functor with transported orientations. Paper III identifies the comparison with the usual framed instanton maps in their singular Hopf-link realization, up to a grading conversion and one sign, and constructs the normalization between the calibrated and sphere-positive systems for every three-manifold; comparisons with the nonsingular cap convention and with prescribed relative-spin operations remain open. These are research manuscripts awaiting independent specialist refereeing.</p><h3>Mathematical lineage</h3><p>The construction builds on the mixed Atiyah–Floer comparison of Daemi, Fukaya and Lipyanskiy; Kronheimer–Mrowka framed instanton cobordism maps; and the Lagrangian/correspondence viewpoint of Wehrheim and Woodward. The compression-body degeneration is related to the Salamon–Wehrheim program. The papers give precise statements and references.</p><p><a href="https://github.com/bwuebben/donaldson-atiyah-floer" target="_blank" rel="noopener">Manuscripts and LaTeX source ↗</a> · <a href="https://bwuebben.github.io/papers/" target="_blank" rel="noopener">Research catalogue ↗</a></p>`;}
let lastFocus;
function openDialog(title,body,wide=false){lastFocus=document.activeElement;$('guide-dialog').classList.toggle('diagram-dialog',wide);$('dialog-title').textContent=title;$('dialog-body').innerHTML=body;$('guide-dialog').showModal();$('close-dialog').focus();}
function closeDialog(){$('guide-dialog').close();if(lastFocus&&lastFocus.isConnected)lastFocus.focus();}
document.addEventListener('click',e=>{
 const el=e.target.closest('button');if(!el)return;
 if(el.dataset.go!==undefined){go(+el.dataset.go,el.classList.contains('journey-link'));return;}
 if(el.dataset.term){const item=glossary[el.dataset.term];if(item)openDialog(item[0],`<p>${item[1]}</p>`);return;}
 if(el.dataset.dialog){if(el.dataset.dialog==='sources')openDialog('Model & sources',sources());else openDialog('A small geometric vocabulary',`<dl>${Object.values(glossary).map(([t,b])=>`<dt>${t}</dt><dd>${b}</dd>`).join('')}</dl>`);return;}
 if(el.dataset.handle){state.handle=+el.dataset.handle;state.phase=0;controls();renderScene();return;}
 if(el.dataset.bit!==undefined){const i=+el.dataset.bit;state.vector[i]=1-state.vector[i];controls();renderScene();return;}
 if(el.dataset.bridge){state.bridge=el.dataset.bridge;state.playing=false;controls();renderScene();return;}
 if(el.dataset.field){state.field=el.dataset.field;controls();renderScene();return;}
 if(el.dataset.system){state.system=el.dataset.system;controls();renderScene();return;}
 if(el.dataset.zeta!==undefined){state.zeta[+el.dataset.zeta]*=-1;controls();renderScene();return;}
 switch(el.id){
 case 'previous':go(state.chapter-1);break;
 case 'next':go((state.chapter+1)%7);break;
 case 'motion-toggle':state.motion=!state.motion;if(!state.motion)state.playing=false;updateMotion();controls();break;
 case 'play-scene':state.playing=!state.playing;if(state.playing){state.motion=true;updateMotion();if(state.chapter===4&&state.collapse>.98)state.collapse=0;if(state.chapter===5&&state.glue>.98)state.glue=0;}controls();break;
 case 'reset-view':state.yaw=-.24;state.tilt=.85;controls();renderScene();break;
 case 'boundary':state.boundary=!state.boundary;controls();renderScene();break;
 case 'run-routes':state.route=.001;if(reduced||!state.motion){state.route=1;renderScene();}else state.playing=true;break;
 case 'flip-sign':state.sign*=-1;renderScene();break;
 case 'split-cycles':state.split=!state.split;controls();renderScene();break;
 case 'enlarge-diagram':{const canvas=$('cobordism-canvas');const artwork=state.chapter===0?`<img src="${canvas.toDataURL()}" alt="Enlarged cobordism surface analogy">`:$('scene').innerHTML;openDialog('A closer look',`<p>${chapters[state.chapter].caption}</p><div class="diagram-scroll">${artwork}</div><p>Scroll horizontally on smaller screens. Close to return to the controls.</p>`,true);break;}
 case 'close-dialog':closeDialog();break;
 }
});
document.addEventListener('input',e=>{let id=e.target.id,v=+e.target.value;
 if(id==='slice'){state.slice=v;state.playing=false;syncPlayback();renderScene();}
 if(id==='orbit'){state.yaw=v;renderScene();}
 if(id==='genus'){state.genus=v;$('genus-value').textContent=v;$('target-dim').textContent=6*v-6;$('lag-dim').textContent=3*v-3;renderScene();}
 if(id==='collapse'){state.collapse=v;state.playing=false;syncPlayback();renderScene();}
 if(id==='glue'){state.glue=v;state.playing=false;syncPlayback();renderScene();}
});
document.addEventListener('change',e=>{if(e.target.id==='break-square'){state.broken=e.target.checked;renderScene();}if(e.target.id==='basis'){state.basis=+e.target.value;renderScene();}if(e.target.id==='neck-view'){state.neck=e.target.checked;renderScene();}});
$('guide-dialog').addEventListener('click',e=>{if(e.target===$('guide-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
$('guide-dialog').addEventListener('cancel',e=>{e.preventDefault();closeDialog();});
document.addEventListener('keydown',e=>{if($('guide-dialog').open||e.target.closest('input,select,textarea,button'))return;if(e.key==='ArrowRight'){e.preventDefault();go(Math.min(6,state.chapter+1));}if(e.key==='ArrowLeft'){e.preventDefault();go(Math.max(0,state.chapter-1));}});
window.addEventListener('resize',()=>{if(state.chapter===0)drawSurface();});
window.addEventListener('hashchange',()=>{const m=location.hash.match(/^#chapter-([1-7])$/);if(m&&+m[1]-1!==state.chapter)go(+m[1]-1);});
let last=0,drawTime=0;
function animate(now){const dt=Math.min((now-last)/1000,.04);last=now;
 if(state.motion&&!document.hidden&&!$('guide-dialog').open){state.phase+=dt*.28;
  let changed=false;
  if(state.playing){changed=true;
   if(state.chapter===0){state.slice=(state.slice+dt*.09)%1;const e=$('slice');if(e)e.value=state.slice;}
   if(state.chapter===3){state.route=Math.min(1,state.route+dt*.5);if(state.route>=1)state.playing=false;}
   if(state.chapter===4){state.collapse=Math.min(1,state.collapse+dt*.12);const e=$('collapse');if(e)e.value=state.collapse;if(state.collapse>=1){state.playing=false;controls();}}
   if(state.chapter===5){state.glue=Math.min(1,state.glue+dt*.15);const e=$('glue');if(e)e.value=state.glue;if(state.glue>=1){state.playing=false;controls();}}
  }
  const active=changed||state.playing||(state.chapter===1&&state.boundary)||(state.chapter===2&&state.playing);
  if(active&&(now-drawTime>45||!state.playing)){renderScene();drawTime=now;}
 }
 requestAnimationFrame(animate);
}
const deep=location.hash.match(/^#chapter-([1-7])$/);if(deep)state.chapter=+deep[1]-1;
updateMotion();renderChapter();requestAnimationFrame(animate);
})();
