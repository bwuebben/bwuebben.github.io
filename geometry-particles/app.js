(function () {
  'use strict';
  const M=window.ParticleModel,$=id=>document.getElementById(id);
  const aControl=$('deformation-a'), ratioControl=$('hierarchy-ratio'), energyControl=$('collision-energy'), angleControl=$('scattering-angle');
  const fmt=n=>n.toFixed(n<.01?5:4);
  const state=()=>({a:Number(aControl.value),mu:10**Number(ratioControl.value),E:10**Number(energyControl.value),cos:Math.cos(Number(angleControl.value)*Math.PI/180)});
  function masses() {
    const {a,mu}=state(), ms=M.masses(a,mu),h=240*mu,base=162+h/2;
    $('a-value').textContent=a.toFixed(3);$('ratio-value').textContent=mu.toFixed(3);ratioControl.setAttribute('aria-valuetext',mu.toFixed(3));
    ms.forEach((m,i)=>{$('mass-'+(i+1)).textContent=fmt(m);$('mass-bar-'+(i+1)).style.width=(100*m/(.2*Math.SQRT2))+'%';});
    $('hierarchy-value').textContent=(1/mu).toFixed(mu>.4?1:0)+'×';$('hierarchy-title').textContent=mu>.5?'The three masses are comparable.':mu<.03?'A wide interval opens between the masses.':'One light vector emerges.';
    let s='<defs><linearGradient id="mass-wash" x2="1" y2="1"><stop stop-color="#d6ba76" stop-opacity=".18"/><stop offset="1" stop-color="#d6ba76" stop-opacity=".02"/></linearGradient></defs>';
    s+=`<path d="M110 ${base}H350V${base-h}Z" fill="url(#mass-wash)" stroke="#d998a4" stroke-width="2"/><path d="M110 ${base}H350" stroke="#a0c8ce" stroke-width="3"/><path d="M350 ${base}V${base-h}" stroke="#e9c980" stroke-width="4"/>`;
    for(const [x,y] of [[110,base],[350,base],[350,base-h]])s+=`<circle cx="${x}" cy="${y}" r="4" fill="#f0dfbb"/>`;
    s+=`<text x="230" y="${base+27}" text-anchor="middle">m₂ ∝ a</text><text x="373" y="${162}">m₁ ∝ b</text><text x="150" y="${139-h/5}">m₃ ∝ √(a² + b²)</text>`;
    s+='<text x="38" y="28" style="font-size:11px;letter-spacing:.12em">LEADING MASS RELATION</text>';
    $('mass-compass').innerHTML=s;$('mass-compass').setAttribute('aria-label',`Leading masses ${ms.map(fmt).join(', ')} in common geometric units. The third squared mass equals the sum of the first two.`);
    scattering();
  }
  const symlog=v=>Math.sign(v)*Math.log10(1+Math.abs(v));
  function scattering() {
    const {mu,E,cos}=state(), d=M.domain(mu,E,cos), value=M.amplitude(mu,E,cos);
    $('energy-value').textContent=E.toFixed(3);energyControl.setAttribute('aria-valuetext',E.toFixed(3)+' times the heavier mass');$('angle-value').textContent=angleControl.value+'°';
    $('amplitude-value').textContent=value===null?'Outside comparison':value.toFixed(3);
    const x=E/mu;
    $('energy-description').textContent=d.valid?(x<.35?`E / m₁ = ${x.toFixed(2)}. The experiment is below the light mass. The local approximation is approaching the exchange curve.`:x>1.5?`E / m₁ = ${x.toFixed(2)}. The light vector is resolved. Its exchange must remain explicit.`:`E / m₁ = ${x.toFixed(2)}. The light scale matters; the low-energy approximation is no longer a uniformly useful replacement.`):'The selected parameters lie outside the domain used for the scattering comparison.';
    $('domain-status').classList.toggle('excluded',!d.valid);
    $('domain-status').textContent=!d.hierarchy?'Choose b/a ≤ 0.4 to enter the separated-mass comparison. “Separate the scales” sets a suitable ratio.':!d.heavy?'The selected energy exceeds the upper limit below the heavier masses.':!d.pole?'Excluded: a channel is too close to its pole relative to the required margin. No amplitude is evaluated here.':'Inside the chosen comparison domain: separated masses, energy below the heavier scales, and all three channel margins satisfied.';
    const min=-3,max=Math.log10(Math.SQRT1_2),left=58,right=535,top=20,bottom=282;
    const px=log=>left+(log-min)/(max-min)*(right-left);
    const samples=Array.from({length:401},(_,i)=>{const log=min+(max-min)*i/400,e=10**log;return {log,e,amp:M.amplitude(mu,e,cos),eff:M.effectiveAmplitude(mu,e,cos)};});
    const maxY=Math.max(1.5,Math.ceil(Math.max(...samples.filter(p=>p.amp!==null).flatMap(p=>[Math.abs(symlog(p.amp)),Math.abs(symlog(p.eff))]))*2)/2);
    const py=y=>top+(maxY-symlog(y))/(2*maxY)*(bottom-top);
    let s='<defs><clipPath id="amp-clip"><rect x="58" y="20" width="477" height="262"/></clipPath><pattern id="excluded-hatch" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M-1 1L1 -1M0 7L7 0M6 8L8 6" stroke="var(--rule)" stroke-width="1"/></pattern></defs>';
    for(const v of [-1000,-100,-10,-1,0,1,10,100,1000])if(Math.abs(symlog(v))<maxY)s+=`<path class="grid" d="M${left} ${py(v)}H${right}"/><text x="${left-9}" y="${py(v)+4}" text-anchor="end">${v}</text>`;
    for(const e of [.001,.01,.1,.7])s+=`<text x="${px(Math.log10(e))}" y="306" text-anchor="middle">${e}</text>`;
    s+='<text x="290" y="337" text-anchor="middle">Energy E / M · logarithmic scale</text>';
    let start=null;for(let i=0;i<samples.length;i++){if(samples[i].amp===null && start===null)start=px(samples[i].log);if(start!==null&&(samples[i].amp!==null||i===samples.length-1)){const end=px(samples[i].log);s+=`<rect x="${start}" y="${top}" width="${end-start}" height="${bottom-top}" fill="url(#excluded-hatch)"/>`;start=null;}}
    for(const [key,cls] of [['amp','wine'],['eff','blue']]){let path='',pen=false;for(const p of samples){if(p.amp===null){pen=false;continue;}path+=`${pen?'L':'M'}${px(p.log).toFixed(2)} ${py(p[key]).toFixed(2)} `;pen=true;}s+=`<path class="${cls}" d="${path}" clip-path="url(#amp-clip)"/>`;}
    if(mu>=.001 && mu<=Math.SQRT1_2){const xx=px(Math.log10(mu));s+=`<path class="axis" stroke-dasharray="3 4" d="M${xx} ${top}V${bottom}"/><text x="${xx+5}" y="36">m₁</text>`;}
    const selected=px(Math.log10(E));s+=`<path class="axis" d="M${selected} ${top}V${bottom}" opacity=".5"/>`;if(value!==null)s+=`<circle cx="${selected}" cy="${py(value)}" r="5" fill="var(--wine)"/>`;
    if(!d.hierarchy)s+='<text x="292" y="155" text-anchor="middle">Select b/a ≤ 0.4 to compare scattering.</text>';
    $('amplitude-plot').innerHTML=s;$('amplitude-plot').setAttribute('aria-label',value===null?'Scattering comparison unavailable at the selected parameters. '+$('domain-status').textContent:`Leading amplitude divided by e squared is ${value.toFixed(3)}. Low-energy approximation is ${M.effectiveAmplitude(mu,E,cos).toFixed(3)}. Energy is ${x.toFixed(2)} times the light mass.`);
  }
  [aControl,ratioControl].forEach(el=>el.addEventListener('input',masses));[energyControl,angleControl].forEach(el=>el.addEventListener('input',scattering));
  document.querySelectorAll('[data-mass]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.mass;ratioControl.value=key==='equal'?0:key==='deep'?-2:-1;if(key==='reset'){aControl.value=.1;energyControl.value=Math.log10(.03);angleControl.value=60;}masses();}));
  document.querySelectorAll('[data-energy]').forEach(b=>b.addEventListener('click',()=>{if(10**Number(ratioControl.value)>.4)ratioControl.value=-1;const mu=10**Number(ratioControl.value);energyControl.value=Math.log10(b.dataset.energy==='low'?Math.max(.001,mu*.2):b.dataset.energy==='pole'?mu:Math.sqrt(mu*.65));angleControl.value=60;masses();}));
  function cancel() {const x=Number($('momentum').value),c=M.cancellation(x);$('momentum-value').textContent=x.toFixed(2);$('exchange-term').textContent=c.exchange.toFixed(3);$('sum-term').textContent=(Math.abs(c.sum)<1e-12?0:c.sum).toFixed(3);$('exchange-bar').style.width=(100*c.exchange)+'%';$('sum-bar').style.width=(100*Math.abs(c.sum))+'%';$('cancellation-copy').textContent=x===0?'At zero momentum, −1 + 1 = 0. The contact term and scalar exchange cancel exactly.':'The two terms partly cancel. At zero momentum their sum is exactly zero.';}
  $('momentum').addEventListener('input',cancel);$('zero-momentum').addEventListener('click',()=>{$('momentum').value=0;cancel();});masses();cancel();
})();
