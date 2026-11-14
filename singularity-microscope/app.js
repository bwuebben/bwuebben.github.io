(function () {
  'use strict';
  const M = window.MicroscopeModel, $ = id => document.getElementById(id);
  const time = $('flow-time'), zoom = $('magnification'), follow = $('follow-scale');
  let running = false, lastFrame = 0, animation = 0;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fmt = n => n >= 100 ? Math.round(n).toLocaleString('en-US') : n.toFixed(n < 10 ? 1 : 0);
  const palette = [[21,26,32],[68,42,50],[143,62,64],[214,143,77],[251,230,176]];
  const buffer = document.createElement('canvas'); buffer.width = 320; buffer.height = 220;
  const bctx = buffer.getContext('2d');

  function field(canvas, rho, magnification, lens) {
    const rect = canvas.getBoundingClientRect(), w = Math.max(rect.width, 200), h = w / (innerWidth <= 540 ? 1.7 : 1.48);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    const img = bctx.createImageData(buffer.width, buffer.height), k = w / 2 * magnification;
    for (let y = 0; y < buffer.height; y++) for (let x = 0; x < buffer.width; x++) {
      const dx = (x / buffer.width - .5) * w, dy = (y / buffer.height - .5) * h;
      const R = Math.hypot(dx, dy) / (k * rho), intensity = Math.log1p(90 * M.density(R)) / Math.log(91);
      const c = Math.min(3.9999, intensity * 4), ci = Math.floor(c), f = c - ci, index = (y * buffer.width + x) * 4;
      for (let j = 0; j < 3; j++) img.data[index+j] = palette[ci][j] * (1-f) + palette[ci+1][j] * f;
      img.data[index+3] = 255;
    }
    bctx.putImageData(img, 0, 0); ctx.drawImage(buffer, 0, 0, w, h);
    ctx.strokeStyle = 'rgba(239,223,190,.11)'; ctx.lineWidth = .6;
    for (let i = -3; i <= 3; i++) { const x = w/2 + i*w/8, y = h/2 + i*w/8; ctx.beginPath(); ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke(); }
    ctx.strokeStyle = 'rgba(242,217,164,.45)';ctx.lineWidth = .8;
    for (const R of [1,2]) {const radius = k*rho*R;if(radius>2 && radius<h*.65){ctx.beginPath();ctx.arc(w/2,h/2,radius,0,Math.PI*2);ctx.stroke();}}
    if (!lens) {ctx.setLineDash([4,5]);ctx.strokeStyle='#d9d0bf';ctx.beginPath();ctx.arc(w/2,h/2,h*.5/(10**Number(zoom.value)),0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
    ctx.strokeStyle='#d9d0bf';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(w/2-6,h/2);ctx.lineTo(w/2+6,h/2);ctx.moveTo(w/2,h/2-6);ctx.lineTo(w/2,h/2+6);ctx.stroke();
    const bar=w*.2;ctx.strokeStyle='#e7dcc6';ctx.beginPath();ctx.moveTo(15,h-20);ctx.lineTo(15+bar,h-20);ctx.stroke();ctx.font='11px -apple-system, sans-serif';ctx.fillStyle='#e7dcc6';ctx.fillText((.4/magnification).toPrecision(2)+' local length units',15,h-30);
  }
  function render() {
    const tau = 10 ** Number(time.value), r = M.radius(tau);
    if (follow.checked) zoom.value = Number(time.value) / 2;
    const mag = 10 ** Number(zoom.value);
    $('time-value').textContent = fmt(tau)+' T₀'; $('zoom-value').textContent=fmt(mag)+'×';$('zoom-badge').textContent=fmt(mag)+'×';
    time.setAttribute('aria-valuetext',fmt(tau)+' times the reference time');zoom.setAttribute('aria-valuetext',fmt(mag)+' times magnification');
    $('radius-value').textContent=r.toFixed(4);$('mass-value').textContent=(1/tau).toFixed(4);
    $('lens-caption').textContent=follow.checked?'The lens follows the concentration radius.':'Magnification is independent of the flow clock.';
    $('scale-discovery').textContent=follow.checked?'When magnification grows with the square root of time, the profile holds its shape in the lens.':tau>1000 && mag<3?'The fixed view has almost lost the profile. Choose “Find the profile” to follow it down to its own scale.':'The object and the instrument have different scales. Change the magnification to see how their relationship matters.';
    field($('global-field'),.28*r,1,false);field($('lens-field'),.28*r,mag,true);
    $('global-field').setAttribute('aria-label',`Fixed view: radius is ${r.toFixed(4)} of its initial value at ${fmt(tau)} times the reference time.`);
    $('lens-field').setAttribute('aria-label',`Lens at ${fmt(mag)} times magnification. ${follow.checked?'The normalized profile remains the same size.':'The visible radius depends on magnification.'}`);
  }
  function stop() {running=false;cancelAnimationFrame(animation);$('play-flow').setAttribute('aria-pressed','false');$('play-flow').textContent=reduced.matches?'Advance time':'Play time';}
  function tick(now) {if(!running)return;if(now-lastFrame>65){const dt=lastFrame?Math.min(now-lastFrame,150):65;lastFrame=now;time.value=Math.min(4,Number(time.value)+dt/6500);render();if(Number(time.value)>=4){stop();return;}}animation=requestAnimationFrame(tick);}
  $('play-flow').addEventListener('click',()=>{if(reduced.matches){time.value=Number(time.value)>=4?0:Math.min(4,Number(time.value)+.4);render();return;}if(running){stop();return;}if(Number(time.value)>=4)time.value=0;running=true;lastFrame=0;$('play-flow').textContent='Pause time';$('play-flow').setAttribute('aria-pressed','true');animation=requestAnimationFrame(tick);});
  time.addEventListener('input',()=>{stop();render();});zoom.addEventListener('input',()=>{follow.checked=false;render();});follow.addEventListener('change',render);
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{stop();if(b.dataset.view==='point'){time.value=4;zoom.value=0;follow.checked=false;}else if(b.dataset.view==='follow'){follow.checked=true;}else{time.value=1.20412;zoom.value=.60206;follow.checked=true;}render();}));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});reduced.addEventListener('change',stop);

  function profile() {
    const R=Number($('ball-radius').value), left=49, right=515, top=20, bottom=270;
    const x=r=>left+(right-left)*r/4, y=v=>bottom-(bottom-top)*v;
    let s='';for(const v of [0,.25,.5,.75,1])s+=`<path class="grid" d="M${left} ${y(v)}H${right}"/><text x="${left-9}" y="${y(v)+4}" text-anchor="end">${v*100}%</text>`;
    for(const v of [0,1,2,3,4])s+=`<text x="${x(v)}" y="292" text-anchor="middle">${v}</text>`;
    s+='<text x="282" y="317" text-anchor="middle">Radius R = r / ρ</text>';
    for(const [f,cls] of [[M.energy,'wine'],[M.inclusion,'blue']]){const pts=Array.from({length:161},(_,i)=>`${i?'L':'M'}${x(i/40).toFixed(2)} ${y(f(i/40)).toFixed(2)}`).join(' ');s+=`<path class="${cls}" d="${pts}"/>`;}
    s+=`<path class="axis" stroke-dasharray="3 4" d="M${x(R)} ${top}V${bottom}"/><circle cx="${x(R)}" cy="${y(M.energy(R))}" r="5" fill="var(--wine)"/><circle cx="${x(R)}" cy="${y(M.inclusion(R))}" r="4" fill="var(--blue)"/>`;
    $('profile-plot').innerHTML=s;$('ball-value').textContent=R.toFixed(2);$('energy-percent').textContent=(M.energy(R)*100).toFixed(1)+'%';$('height-percent').textContent=(M.inclusion(R)*100).toFixed(1)+'%';
    $('ball-note').textContent=Math.abs(R-1)<.005?'At R = 1, the ball contains half the bubble energy. The inclusion profile also reaches half its limiting height here.':R===0?'A ball of zero radius contains no energy in the smooth limiting profile.':R<1?'This ball lies inside the half-energy radius. The energy and inclusion height grow differently as the radius increases.':'Outside the half-energy radius, both quantities approach their full values. The energy approaches its limit more quickly.';
    $('profile-plot').setAttribute('aria-label',`At radius ${R.toFixed(2)}, the ball contains ${(M.energy(R)*100).toFixed(1)} percent of the bubble energy; the inclusion height is ${(M.inclusion(R)*100).toFixed(1)} percent.`);
  }
  $('ball-radius').addEventListener('input',profile);$('half-radius').addEventListener('click',()=>{$('ball-radius').value=1;profile();});
  function boundary() {
    const t=Number($('boundary-position').value), radius=(1-t)*40;
    let s='<defs><radialGradient id="defect-glow"><stop stop-color="#f5d595"/><stop offset=".25" stop-color="#c48867" stop-opacity=".9"/><stop offset="1" stop-color="#aa6170" stop-opacity="0"/></radialGradient></defs>';
    for(let j=0;j<7;j++){const y=55+j*28;s+=`<path d="M25 ${y} Q180 ${y-35} 260 ${y} T495 ${y}" fill="none" stroke="#779399" stroke-opacity=".4"/>`;}
    for(const [x,y,label] of [[175,125,'p'],[350,180,'q']]){s+=`<circle cx="${x}" cy="${y}" r="${radius*2.1}" fill="url(#defect-glow)"/>`;if(t<1)s+=`<circle cx="${x}" cy="${y}" r="${radius}" fill="none" stroke="#e3c58a" stroke-opacity=".65"/>`;else s+=`<circle cx="${x}" cy="${y}" r="5" fill="#f5d595"/><circle cx="${x}" cy="${y}" r="14" fill="none" stroke="#f5d595"/>`;s+=`<text x="${x+18}" y="${y-17}">${label}${t===1?' · charge 1':''}</text>`;}
    s+=`<text x="260" y="283" text-anchor="middle">${t===1?'Residual connection + marked defect cycle':'Smooth connection · concentrating regions'}</text>`;
    $('boundary-plot').innerHTML=s;$('boundary-value').textContent=t===1?'Ideal limit':t===0?'Smooth':'Approaching';
    $('boundary-copy').textContent=t===1?'The limiting object records a smooth residual connection and the two points p and q, each with unit charge. These data belong together.':'Two small regions carry concentrated curvature. Away from them, a smooth residual connection is emerging.';
  }
  $('boundary-position').addEventListener('input',boundary);
  let resizeFrame;window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(render);});
  stop();render();profile();boundary();
})();
