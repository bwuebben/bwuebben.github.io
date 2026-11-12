'use strict';
(() => {
  const D = window.ATLAS_DATA;
  const papers = D.papers;
  const byId = new Map(papers.map(p => [p.id,p]));
  const allEdges = D.graph.edges;
  const themes = D.graph.thematicConnections || [];
  const state = {selected:15, view:'map', query:'', branch:'all', method:true, themes:false, neighborhood:'direct'};
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num = n => String(n).padStart(2,'0');
  const color = p => D.branches[p.branch].color;
  const ordered = () => [...papers].sort((a,b)=>a.rank-b.rank);
  const activeEdges = () => allEdges.filter(e=>state.method || e.kind==='theorem');
  const matches = p => (state.branch==='all' || state.branch===p.branch) && (!state.query || `${p.id} ${num(p.id)} paper ${p.id} ${p.title} ${p.short} ${p.rationale} ${p.role} ${p.scope} ${Object.values(p.explanation).join(" ")}`.toLowerCase().includes(state.query));
  const visible = () => papers.filter(matches);
  const pos = {
    1:[85,135],2:[85,350],3:[245,390],4:[245,145],5:[85,550],6:[245,265],7:[270,550],
    8:[435,395],9:[435,535],10:[605,550],11:[435,90],12:[600,90],13:[600,190],14:[575,310],
    15:[745,410],16:[765,555],17:[760,135],18:[875,250],19:[910,90],20:[925,405],21:[925,555],
    22:[1095,610],23:[1060,80],24:[1165,190],25:[1040,300],26:[1165,405],27:[1165,510],28:[1180,300],29:[1325,565],30:[1470,395],31:[1480,150],32:[605,675]
  };
  const svg = (tag, attrs={}, text) => {
    const e=document.createElementNS('http://www.w3.org/2000/svg',tag);
    for(const [k,v] of Object.entries(attrs)) e.setAttribute(k,v);
    if(text!==undefined)e.textContent=text;
    return e;
  };
  function closure(id,direction,edges=activeEdges()) {
    const seen=new Set([id]);const queue=[id];
    while(queue.length){const curr=queue.shift();for(const e of edges){const next=direction==='ancestors'?(e.to===curr?e.from:null):(e.from===curr?e.to:null);if(next!==null&&!seen.has(next)){seen.add(next);queue.push(next);}}}
    return seen;
  }
  function highlightSet(){
    const edges=activeEdges();
    if(state.neighborhood==='all')return new Set(papers.map(p=>p.id));
    if(state.neighborhood!=='direct')return closure(state.selected,state.neighborhood,edges);
    return new Set([state.selected,...[...edges,...(state.themes?themes:[])].filter(e=>e.from===state.selected||e.to===state.selected).flatMap(e=>[e.from,e.to])]);
  }
  function select(id,scroll=false){
    state.selected=id;history.replaceState(null,'',`#paper-${num(id)}`);render();
    if(scroll)$('#explore').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function setView(view){state.view=view;render();}
  function edgePath(e){
    const a=pos[e.from],b=pos[e.to]; const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1;
    const ra=11+(papers.length+1-byId.get(e.from).rank)*.45,rb=11+(papers.length+1-byId.get(e.to).rank)*.45;
    const x1=a[0]+dx/len*(ra+3),y1=a[1]+dy/len*(ra+3),x2=b[0]-dx/len*(rb+7),y2=b[1]-dy/len*(rb+7);
    const bend=Math.min(60,len*.1)*((e.from+e.to)%2?1:-1);
    return `M${x1},${y1} Q${(x1+x2)/2-dy/len*bend},${(y1+y2)/2+dx/len*bend} ${x2},${y2}`;
  }
  function labelLines(label,max=21){
    const words=label.split(' '),lines=[''];for(const word of words){const i=lines.length-1;if((lines[i]+' '+word).trim().length>max&&lines[i])lines.push(word);else lines[i]+=(lines[i]?' ':'')+word;}return lines;
  }
  function drawNode(root,p,x,y,r,opacity=1,scatter=false){
    const selected=p.id===state.selected;
    const g=svg('g',{class:`node ${selected?'selected':''}`,transform:`translate(${x} ${y})`,opacity,role:'button',tabindex:'0','aria-label':`Paper ${p.id}, ${p.short}, importance rank ${p.rank}`,'aria-pressed':String(selected),'data-paper':p.id});
    g.append(svg('title',{},`Paper ${p.id} · Rank ${p.rank}\n${p.title}`));
    g.append(svg('circle',{class:'node-ring',r:r+6,fill:'none',stroke:selected?color(p):'transparent','stroke-width':selected?1.4:1}));
    g.append(svg('circle',{r,fill:color(p),'fill-opacity':selected?1:.88,stroke:color(p),'stroke-width':1}));
    g.append(svg('text',{class:'node-number','text-anchor':'middle',dy:4,'font-size':scatter?10:12},num(p.id)));
    if(!scatter){
      const text=svg('text',{class:'node-label','text-anchor':'middle',y:r+20});
      labelLines(p.short).forEach((line,i)=>text.append(svg('tspan',{x:0,dy:i?15:0},line)));
      g.append(text);
    }
    g.addEventListener('click',()=>select(p.id));
    g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(p.id);}});
    root.append(g);
  }
  function renderMap(){
    const root=$('#graph');root.replaceChildren();root.setAttribute('viewBox','0 0 1600 790');root.style.minWidth='1300px';root.setAttribute('aria-label',`Selected direct theorem and method dependencies among ${papers.length} papers`);
    const defs=svg('defs');
    for(const [id,c] of [['normal','var(--ink-soft)'],['focus','var(--accent)']]){const m=svg('marker',{id:`arrow-${id}`,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:5,markerHeight:5,orient:'auto-start-reverse'});m.append(svg('path',{d:'M 0 1 L 9 5 L 0 9',fill:'none',stroke:c,'stroke-width':1.5}));defs.append(m);}root.append(defs);
    for(const [x,t] of [[45,'ORIGINS'],[395,'FLOW & CATEGORIES'],[700,'K3 & LOCAL THEORY'],[1010,'DEGENERATING BASES'],[1350,'COMMON-FAMILY RECOVERY']])root.append(svg('text',{x,y:25,class:'group-label'},t));
    for(let x=35;x<1590;x+=35)for(let y=50;y<780;y+=35)root.append(svg('circle',{cx:x,cy:y,r:.65,fill:'var(--rule)',opacity:.25}));
    const highlighted=highlightSet();
    const edges=[...activeEdges(),...(state.themes?themes:[])];
    for(const e of edges){
      const both=matches(byId.get(e.from))&&matches(byId.get(e.to));
      const focus=state.neighborhood==='direct'?(e.from===state.selected||e.to===state.selected):highlighted.has(e.from)&&highlighted.has(e.to);
      const stroke=e.kind==='theme'?'var(--atlas-category)':focus?'var(--accent)':'var(--ink-soft)';
      const path=svg('path',{d:edgePath(e),class:'edge',stroke,opacity:!both?.045:focus?.9:.2,'stroke-dasharray':e.kind==='method'?'6 5':e.kind==='theme'?'2 6':'none',...(e.kind!=='theme'?{'marker-end':`url(#arrow-${focus?'focus':'normal'})`}:{})});
      path.append(svg('title',{},`Paper ${e.from} ${e.kind==='theme'?'↔':'→'} ${e.to}: ${e.reason}`));root.append(path);
    }
    for(const p of papers.filter(p=>p.id!==state.selected).concat(byId.get(state.selected))){
      const opacity=!matches(p)?.13:highlighted.has(p.id)?1:.4;
      drawNode(root,p,...pos[p.id],11+(papers.length+1-p.rank)*.45,opacity);
    }
    const n=highlighted.size-1;
    $('#chart-caption').innerHTML=`<strong>Paper ${num(state.selected)} · ${esc(byId.get(state.selected).short)}</strong> — ${state.neighborhood==='all'?'all documented connections shown':state.neighborhood==='direct'?`${n} directly connected papers highlighted`:state.neighborhood==='ancestors'?`${n} selected-graph predecessors highlighted`:`${n} selected-graph successors highlighted`}.`;
    $('#graph-footnote').textContent='Numbers identify papers. Larger circles indicate higher editorial rank. Positions group research strands; distances have no mathematical meaning. On a small screen, scroll the map sideways.';
  }
  function renderInfluence(){
    const root=$('#graph');root.replaceChildren();root.setAttribute('viewBox','0 0 1000 930');root.style.minWidth='1000px';root.setAttribute('aria-label','Editorial rank versus selected direct follow-on papers');
    const edges=activeEdges(),counts=new Map(papers.map(p=>[p.id,new Set(edges.filter(e=>e.from===p.id).map(e=>e.to)).size]));
    const max=Math.max(5,...counts.values());const x=n=>145+n*(710/max);const y=rank=>65+(rank-1)*25;
    root.append(svg('rect',{x:105,y:40,width:795,height:155,rx:8,fill:'var(--bg-panel)',opacity:.5}));
    for(let n=0;n<=max;n++){root.append(svg('line',{x1:x(n),y1:40,x2:x(n),y2:865,stroke:'var(--rule)','stroke-width':1,'stroke-dasharray':'2 6'}));root.append(svg('text',{x:x(n),y:892,class:'plot-label','text-anchor':'middle'},n));}
    for(const rank of [1,8,16,24,32]){root.append(svg('text',{x:72,y:y(rank)+4,class:'plot-label','text-anchor':'end'},`#${rank}`));root.append(svg('line',{x1:105,y1:y(rank),x2:900,y2:y(rank),stroke:'var(--rule)',opacity:.4}));}
    root.append(svg('text',{x:35,y:28,class:'group-label'},'EDITORIAL RANK ↑'));
    root.append(svg('text',{x:510,y:920,class:'plot-label','text-anchor':'middle'},'Number of distinct direct follow-on papers in the selected graph →'));
    for(const p of papers){
      const opacity=matches(p)?1:.13;drawNode(root,p,x(counts.get(p.id)),y(p.rank),9.5,opacity,true);
      if(p.rank<=6||[11,12].includes(p.id)||p.id===state.selected){const left=x(counts.get(p.id))>650;const tx=x(counts.get(p.id))+(left?-18:18);root.append(svg('text',{x:tx,y:y(p.rank)+4,class:'plot-label',opacity,'text-anchor':left?'end':'start',fill:p.id===state.selected?'var(--ink)':'var(--ink-soft)'},p.short));}
    }
    $('#chart-caption').innerHTML='<strong>Two different kinds of significance.</strong> Vertical position is the editorial ranking. Horizontal position counts documented direct follow-ons; isolated advances can still rank highly.';
    $('#graph-footnote').textContent=`Counts use ${state.method?'theorem and method':'theorem'} edges only; thematic links never contribute. These are selected intra-series connections, not bibliometric citations, proof counts or objective impact scores.`;
  }
  function connectionRows(edges,incoming=false){
    if(!edges.length)return '<p class="connection-empty">None in this selected graph.</p>';
    return edges.map(e=>{const other=byId.get(incoming?e.from:e.to);const idx=allEdges.indexOf(e);return `<div class="connection-row"><button data-select="${other.id}" title="${esc(other.title)}"><span class="connection-id">${num(other.id)}</span>${esc(other.short)}</button><button class="evidence-button" data-evidence="${idx}" aria-label="View ${e.kind} evidence for Paper ${e.from} to ${e.to}">${e.kind} ↗</button></div>`;}).join('');
  }
  function renderInspector(){
    const p=byId.get(state.selected),incoming=allEdges.filter(e=>e.to===p.id),outgoing=allEdges.filter(e=>e.from===p.id),related=themes.filter(e=>e.from===p.id||e.to===p.id);
    const x=p.explanation;
    $('#inspector').innerHTML=`<div class="inspector-main"><div class="paper-meta"><span style="color:${color(p)}">PAPER ${num(p.id)}</span><span class="rank-badge">RANK ${num(p.rank)} / ${papers.length}</span></div><p class="role" style="color:${color(p)}">${esc(p.role)}</p><h3>${esc(p.short)}</h3><p class="full-title">${esc(p.title)}</p><h4>The question</h4><p class="explanation">${esc(x.question)}</p><h4>The main result</h4><p class="explanation">${esc(x.result)}</p><h4>Why this rank</h4><p class="rationale">${esc(p.rationale)}</p><details><summary>The idea behind the result</summary><p>${esc(x.idea)}</p></details><div class="scope"><strong>Scope and limits</strong>${esc(x.limits)}</div><div class="paper-links"><a href="${p.page}">Full abstract ↗</a><a href="${p.pdf}" target="_blank" rel="noopener">Read PDF ↗</a><button class="quiet-button" data-guide="${p.id}">Paper guide →</button></div><p class="paper-status">Public preprint · <a href="https://doi.org/${esc(p.doi)}">Archived version ↗</a></p></div><div class="inspector-connections"><p class="connection-heading">Uses or extends · ${incoming.length}</p>${connectionRows(incoming,true)}<p class="connection-heading">Used or extended by · ${outgoing.length}</p>${connectionRows(outgoing)}${related.length?`<p class="connection-heading">Thematic connections · not dependencies</p>${related.map(e=>{const other=byId.get(e.from===p.id?e.to:e.from);return `<div class="connection-row"><button data-select="${other.id}"><span class="connection-id">${num(other.id)}</span>${esc(other.short)}</button><button class="evidence-button" data-theme="${themes.indexOf(e)}" aria-label="Read thematic connection to Paper ${other.id}">theme ↗</button></div>`;}).join('')}`:''}<button class="show-all-rank" id="see-ranked">See in the importance ranking →</button></div>`;
  }
  function renderRanking(){
    const list=ordered().filter(matches);
    $('#ranking-list').innerHTML=list.map(p=>`<article class="ranking-card ${p.id===state.selected?'focused':''}" id="rank-${p.rank}"><span class="rank-number">${num(p.rank)}</span><div><div class="card-meta"><span style="color:${color(p)}">PAPER ${num(p.id)}</span><span>${esc(p.role)}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.rationale)}</p><p><strong>The question.</strong> ${esc(p.explanation.question)}</p><details><summary>Result, scope and limits</summary><p>${esc(p.explanation.result)}</p><p>${esc(p.explanation.limits)}</p></details><div class="card-actions"><button data-guide="${p.id}">Read the explanation →</button><a href="${p.page}">Full abstract ↗</a><a href="${p.pdf}" target="_blank" rel="noopener">Read PDF ↗</a><button data-map="${p.id}">Show on the map →</button></div></div></article>`).join('');
    $('#empty').hidden=!!list.length;
  }
  function render(){
    $$('.tabs button').forEach(b=>{const active=b.dataset.view===state.view;b.setAttribute('aria-selected',active);b.tabIndex=active?0:-1;});
    $('#map-panel').hidden=!['map','influence'].includes(state.view);$('#ranking-panel').hidden=state.view!=='ranking';$('#papers-panel').hidden=state.view!=='papers';
    $('#map-panel').setAttribute('aria-labelledby',state.view==='influence'?'tab-influence':'tab-map');
    $('#graph-options').hidden=state.view==='ranking';$('#show-themes').closest('label').hidden=state.view==='influence';$('.network-control').hidden=state.view==='influence';$('#graph-key').hidden=state.view==='influence';
    $('#result-count').textContent=`${visible().length} of ${papers.length} papers`;
    $$('#legend button').forEach(b=>b.classList.toggle('active',b.dataset.branch===state.branch));
    if(state.view==='ranking')renderRanking();else if(state.view==='papers'){$$('[data-guide-paper]').forEach(card=>card.hidden=!matches(byId.get(Number(card.dataset.guidePaper)))) ;$('#papers-empty').hidden=visible().length>0;}else {renderInspector();state.view==='map'?renderMap():renderInfluence();}
  }
  function showEvidence(edge){
    const a=byId.get(edge.from),b=byId.get(edge.to);
    $('#evidence-body').innerHTML=`<h3 id="evidence-title">Paper ${num(a.id)} ${edge.kind==='theme'?'↔':'→'} Paper ${num(b.id)}</h3><p><strong>${esc(a.short)}</strong><br>${edge.kind==='theme'?'is thematically related to':'is an acknowledged input or predecessor to'}<br><strong>${esc(b.short)}</strong></p><span class="rank-badge">${edge.kind==='theorem'?'THEOREM INPUT':edge.kind==='method'?'METHOD EXTENSION':'THEME ONLY'}</span><p>${esc(edge.reason)}</p>${edge.evidence.map(e=>`<p><a href="${esc(e.url)}" target="_blank" rel="noopener">Read the public source, lines ${e.line}${e.endLine?'–'+e.endLine:''} ↗</a></p><details><summary>Show the quoted mathematical source</summary><pre>${esc(e.excerpt)}</pre></details>`).join('')}`;
    $('#evidence-dialog').showModal();
  }
  $('#leaders').innerHTML=ordered().slice(0,4).map(p=>`<article class="leader"><span class="ordinal">${num(p.rank)}</span><div><button class="leader-select" data-select="${p.id}" data-scroll="true"><span class="paper-label">PAPER ${num(p.id)} / LEADING CONTRIBUTION</span><strong>${esc(p.short)}</strong></button><a class="leader-link" href="${esc(p.page)}" aria-label="Paper webpage: ${esc(p.title)}">Paper webpage ↗</a></div></article>`).join('');
  for(const [key,b] of Object.entries(D.branches)){$('#branch').insertAdjacentHTML('beforeend',`<option value="${key}">${esc(b.name)}</option>`);$('#legend').insertAdjacentHTML('beforeend',`<button data-branch="${key}"><i style="background:${b.color}"></i>${esc(b.name)}</button>`);}
  const journeys=[
    {title:'Find the general mechanism',copy:'From the original spectral estimate to quotient geometry, the general local theorem and its dynamical counterpart.',ids:[1,4,6,14,15,16]},
    {title:'Follow the geometry outward',copy:'Start with one K3 wall crossing, then connect compact metric limits, integral cycles and canonical singular metrics.',ids:[13,14,17,18,20]},
    {title:'Let the underlying space degenerate',copy:'Move from intersection-controlled spectra to actual nonlinear flow, genuine gluing and every relaxation time. Paper 27 gives a type-K branch; the next path follows Ricci-flat conifolds.',ids:[23,25,26,28,27]},
    {title:'Recover integral topology on one family',copy:'Start with the compact transition and fixed-ray spectrum, pass to independent node scales and nonflat bundle dynamics, then recover the integral vanishing-cycle map from certified marked periods.',ids:[2,22,29,30,31]},
    {title:'Resolve the singular-flow law',copy:'A toric example exposes the failure of a smooth graded model. Follow the obstruction to the inverse-time law and shrinking charge-one profile, keeping the reduced distinct-factor hypothesis visible.',ids:[2,10,32]}
  ];
  $('#journey-grid').innerHTML=journeys.map((j,i)=>`<article class="journey"><span class="journey-no">PATH ${num(i+1)}</span><h3>${j.title}</h3><p>${j.copy}</p><div class="path-steps">${j.ids.map((id,k)=>`${k?'<span aria-hidden="true">→</span>':''}<button data-select="${id}" data-scroll="true" title="${esc(byId.get(id).title)}" aria-label="Explore Paper ${id}: ${esc(byId.get(id).short)}">${num(id)}</button>`).join('')}</div></article>`).join('');
  $('#ranking-method').textContent=D.method;$('#edge-total').textContent=allEdges.length;
  document.addEventListener('click',e=>{
    const el=e.target.closest('button');if(!el)return;
    if(el.dataset.select){if(!['map','influence'].includes(state.view))state.view='map';select(Number(el.dataset.select),el.dataset.scroll==='true');}
    if(el.dataset.view)setView(el.dataset.view);
    if(el.dataset.guide){state.query='';state.branch='all';$('#search').value='';$('#branch').value='all';state.selected=Number(el.dataset.guide);setView('papers');history.replaceState(null,'',`#paper-${num(state.selected)}`);requestAnimationFrame(()=>$(`#paper-guide-${num(state.selected)}`).scrollIntoView({behavior:'smooth',block:'start'}));}
    if(el.dataset.map){state.view='map';select(Number(el.dataset.map),true);}
    if(el.dataset.evidence!==undefined)showEvidence(allEdges[Number(el.dataset.evidence)]);
    if(el.dataset.theme!==undefined)showEvidence(themes[Number(el.dataset.theme)]);
    if(el.dataset.branch){state.branch=state.branch===el.dataset.branch?'all':el.dataset.branch;$('#branch').value=state.branch;render();}
    if(el.id==='see-ranked'){state.query='';state.branch='all';$('#search').value='';$('#branch').value='all';setView('ranking');requestAnimationFrame(()=>$(`#rank-${byId.get(state.selected).rank}`).scrollIntoView({behavior:'smooth',block:'center'}));}
  });
  $('.tabs').addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;const tabs=$$('.tabs button');let i=tabs.indexOf(document.activeElement);if(i<0)return;e.preventDefault();i=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;setView(tabs[i].dataset.view);tabs[i].focus();});
  $('#search').addEventListener('input',e=>{state.query=e.target.value.trim().toLowerCase();render();});
  $('#branch').addEventListener('change',e=>{state.branch=e.target.value;render();});
  $('#show-method').addEventListener('change',e=>{state.method=e.target.checked;render();});
  $('#show-themes').addEventListener('change',e=>{state.themes=e.target.checked;render();});
  $('#neighborhood').addEventListener('change',e=>{state.neighborhood=e.target.value;render();});
  $('#reset').addEventListener('click',()=>{Object.assign(state,{selected:15,query:'',branch:'all',method:true,themes:false,neighborhood:'direct'});$('#search').value='';$('#branch').value='all';$('#show-method').checked=true;$('#show-themes').checked=false;$('#neighborhood').value='direct';history.replaceState(null,'','#explore');render();});
  $('#close-dialog').addEventListener('click',()=>$('#evidence-dialog').close());
  $('#evidence-dialog').addEventListener('click',e=>{if(e.target===$('#evidence-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
  $('#download-ranking').addEventListener('click',()=>{const lines=['Stability & Degeneration — Editorial Ranking','Snapshot: '+D.asOf,'',D.method,'',...ordered().flatMap(p=>[`${p.rank}. Paper ${p.id} — ${p.title}`,p.rationale,'Question: '+p.explanation.question,'Result: '+p.explanation.result,'Limits: '+p.explanation.limits,'Read: https://bwuebben.github.io'+p.page,''])];const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='stability-degeneration-ranking.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  const initial=location.hash.match(/^#paper-(\d+)$/);if(initial&&byId.has(Number(initial[1])))state.selected=Number(initial[1]);
  render();
})();
