#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=JSON.parse(read('data/stability-degeneration-atlas.json'));
const html=read('research/geometry/quantitative-moduli/atlas/index.html');
let checks=0;
const check=(name,fn)=>{fn();checks++;console.log('PASS '+name);};
check('All 32 IDs and editorial ranks occur exactly once',()=>{
  const expected=Array.from({length:32},(_,i)=>i+1);
  assert.deepEqual(data.papers.map(p=>p.id).sort((a,b)=>a-b),expected);
  assert.deepEqual(data.papers.map(p=>p.rank).sort((a,b)=>a-b),expected);
});
check('Publication metadata and all PDF hashes match the current paper records',()=>{
  const records=JSON.parse(read('data/papers.json')).papers;
  for(const p of data.papers){const current=records.find(x=>x.slug===p.slug);assert.ok(current);
    assert.equal(p.title,current.title);assert.equal(p.doi,current.citation_doi);assert.equal(p.status,'Public preprint');
    assert.equal(p.sha256,current.pdf.sha256);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,p.pdf))).digest('hex'),p.sha256);
  }
});
check('Every paper has a substantive six-part explanation and a static reading card',()=>{
  for(const p of data.papers){for(const k of ['question','idea','result','significance','limits','prerequisite'])assert.ok(p.explanation[k].length>35,`${p.id} ${k}`);
    assert.ok(html.includes(`data-guide-paper="${p.id}"`));assert.ok(html.includes(`id="paper-guide-${String(p.id).padStart(2,'0')}"`));
  }
});
check('54 documented dependencies and 6 thematic relations remain distinct',()=>{
  assert.equal(data.graph.edges.length,54);assert.equal(data.graph.thematicConnections.length,6);
  for(const e of data.graph.edges){assert.ok(['theorem','method'].includes(e.kind));assert.notEqual(e.from,e.to);}
  for(const e of data.graph.thematicConnections)assert.equal(e.kind,'theme');
  for(const e of [...data.graph.edges,...data.graph.thematicConnections]){assert.ok(e.evidence.length);for(const s of e.evidence){assert.match(s.url,/^https:\/\/github\.com\/bwuebben\/stability-degeneration\/blob\/[a-f0-9]{40}\/papers\/.+#L\d+$/);assert.ok(s.excerpt.length>20);}}
});
check('Shared theme, fallback reading content and no private project material',()=>{
  assert.ok(html.includes('assets/theme.css'));assert.ok(html.includes('assets/style.css'));assert.ok(html.includes('<noscript>'));
  for(const text of [html,read('data/stability-degeneration-atlas.json'),read('assets/stability-degeneration-atlas.js')]){
    assert.ok(!/papers_ai_1|\/Users\/|\.openai|\.qa\/|node_modules|private manuscript|source_notes|reviewer|codex/i.test(text));
  }
  assert.ok(read('assets/stability-degeneration-atlas.css').includes('prefers-color-scheme:dark'));
});
check('Atlas presentation cannot override shared navigation styles',()=>{
  const css=read('assets/stability-degeneration-atlas.css').replace(/\/\*[\s\S]*?\*\//g,'');
  for(const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)){
    const selectors=match[1].trim().split(',').map(s=>s.trim());
    for(const selector of selectors){
      if(selector==='.atlas-page'){
        for(const declaration of match[2].split(';').map(s=>s.trim()).filter(Boolean))assert.match(declaration,/^--atlas-[\w-]+\s*:/);
      }else assert.match(selector,/^\.atlas-page #main(?:[.#\s:]|$)/,`Style escapes atlas content: ${selector}`);
    }
  }
  assert.ok(html.indexOf('</header>')<html.indexOf('<main id="main"'),'Shared navigation is outside atlas content');
});
check('Research Programs has the Atlas section and its Degeneration link',()=>{
  const research=html.match(/<summary>Research Programs<\/summary>([\s\S]*?)<\/details>/)[1];
  assert.match(research,/class="nav-submenu-heading"[^>]*>Atlas<\/li>/);
  const link=research.match(/<a href="([^"]+)"[^>]*>Degeneration<\/a>/);
  assert.ok(link);assert.equal(new URL(link[1],'https://bwuebben.github.io/research/geometry/quantitative-moduli/atlas/').pathname,'/research/geometry/quantitative-moduli/atlas/');
  const explorers=html.match(/<summary>Explorers<\/summary>([\s\S]*?)<\/details>/)[1];
  assert.ok(!explorers.includes('Stability &amp; Degeneration Atlas'));
});
check('Programme opening is concise and points to the atlas',()=>{
  const guide=read('research/geometry/quantitative-moduli/index.html');
  const opening=guide.match(/<p class="intro">([\s\S]*?)<\/p>/)[1];
  assert.ok(opening.split(/\s+/).length<65);assert.ok(guide.includes('/research/geometry/quantitative-moduli/atlas/'));
  const dynamics=guide.slice(guide.indexOf('id="dynamics"'),guide.indexOf('</section>',guide.indexOf('id="dynamics"')));
  assert.ok(dynamics.includes('id="quantitative-correspondence"'));assert.ok(dynamics.includes('flow-profile-title'));
});
let JSDOM;
try{({JSDOM}=require('jsdom'));}catch(e){if(e.code!=='MODULE_NOT_FOUND')throw e;console.log(`${checks} static checks passed. DOM checks skipped: optional external jsdom is unavailable.`);process.exit(0);}
const dom=new JSDOM(html,{url:'https://bwuebben.github.io/research/geometry/quantitative-moduli/atlas/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document;
w.HTMLElement.prototype.scrollIntoView=function(){};
w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
w.eval(read('assets/stability-degeneration-data.js'));w.eval(read('assets/stability-degeneration-atlas.js'));
const q=s=>d.querySelector(s),qa=s=>[...d.querySelectorAll(s)],click=s=>{assert.ok(q(s),s);q(s).dispatchEvent(new w.MouseEvent('click',{bubbles:true}));};
const change=(s,value)=>{q(s).value=value;q(s).dispatchEvent(new w.Event('change',{bubbles:true}));};
const type=value=>{q('#search').value=value;q('#search').dispatchEvent(new w.Event('input',{bubbles:true}));};
const toggle=(s,value)=>{q(s).checked=value;q(s).dispatchEvent(new w.Event('change',{bubbles:true}));};
check('Initial graph renders every paper and the documented edges',()=>{assert.equal(qa('#graph .node').length,32);assert.equal(qa('#graph .edge').length,54);assert.ok(q('#inspector').textContent.includes('PAPER 15'));assert.equal(q('#papers-panel').hidden,true);});
check('Selecting Paper 28 reveals its rank, explanation and all-time qualifications',()=>{click('#graph [data-paper="28"]');assert.ok(q('#inspector').textContent.includes('RANK 10 / 32'));assert.ok(q('#inspector').textContent.includes('initial integrated discrepancy'));assert.equal(w.location.hash,'#paper-28');});
check('New inverse and defect results retain their critical limits',()=>{click('#graph [data-paper="31"]');assert.ok(q('#inspector').textContent.includes('RANK 02 / 32'));assert.ok(q('#inspector').textContent.includes('not numerically executed'));click('#graph [data-paper="32"]');assert.ok(q('#inspector').textContent.includes('RANK 05 / 32'));assert.ok(q('#inspector').textContent.includes('distinct'));click('#reset');});
check('Thematic and method controls distinguish relation types',()=>{toggle('#show-themes',true);assert.equal(qa('#graph .edge').length,60);toggle('#show-method',false);assert.equal(qa('#graph .edge').length,38);toggle('#show-themes',false);assert.equal(qa('#graph .edge').length,32);click('#reset');});
check('Predecessor and successor highlighting works',()=>{change('#neighborhood','ancestors');assert.ok(q('#chart-caption').textContent.includes('predecessors'));change('#neighborhood','descendants');assert.ok(q('#chart-caption').textContent.includes('successors'));click('#reset');});
check('Evidence dialog exposes public sources and can be closed',()=>{click('#inspector [data-evidence]');assert.equal(q('#evidence-dialog').open,true);assert.ok(q('#evidence-body a').href.startsWith('https://github.com/bwuebben/stability-degeneration/'));assert.ok(q('#evidence-body pre').textContent.length>50);click('#close-dialog');assert.equal(q('#evidence-dialog').open,false);});
check('Ranking order is preserved and links to explanations',()=>{click('[data-view="ranking"]');assert.equal(qa('.ranking-card').length,32);assert.ok(qa('.ranking-card')[0].textContent.includes('PAPER 15'));assert.ok(qa('.ranking-card')[31].textContent.includes('PAPER 05'));click('.ranking-card [data-guide="15"]');assert.equal(q('#papers-panel').hidden,false);assert.equal(q('#ranking-panel').hidden,true);});
check('Paper guide displays all 32 explanations in series order',()=>{assert.equal(qa('[data-guide-paper]:not([hidden])').length,32);assert.equal(qa('[data-guide-paper]')[0].dataset.guidePaper,'1');assert.equal(qa('[data-guide-paper]')[31].dataset.guidePaper,'32');});
check('Search includes explanation text and supports empty results',()=>{type('honeycomb');assert.equal(qa('[data-guide-paper]:not([hidden])').length,1);assert.equal(q('[data-guide-paper]:not([hidden])').dataset.guidePaper,'12');type('zzzz-no-paper');assert.equal(qa('[data-guide-paper]:not([hidden])').length,0);assert.equal(q('#papers-empty').hidden,false);click('#reset');assert.equal(qa('[data-guide-paper]:not([hidden])').length,32);});
check('Strand filters work on the explanatory guide',()=>{change('#branch','geometry');assert.equal(qa('[data-guide-paper]:not([hidden])').length,data.papers.filter(p=>p.branch==='geometry').length);click('#reset');});
check('Importance versus follow-on counts preserves all papers',()=>{click('[data-view="influence"]');assert.equal(qa('#graph .node').length,32);assert.ok(q('#chart-caption').textContent.includes('Two different kinds'));assert.equal(q('#show-themes').closest('label').hidden,true);});
check('Reading paths, paper-guide map links and keyboard selection work',()=>{click('.path-steps [data-select="23"]');assert.ok(q('#inspector').textContent.includes('PAPER 23'));click('[data-view="papers"]');click('#paper-guide-26 [data-map]');assert.equal(q('#map-panel').hidden,false);assert.ok(q('#inspector').textContent.includes('PAPER 26'));q('#graph [data-paper="22"]').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));assert.ok(q('#inspector').textContent.includes('PAPER 22'));});
check('Arrow and End keys navigate all four tabs',()=>{q('#tab-map').focus();q('.tabs').dispatchEvent(new w.KeyboardEvent('keydown',{key:'End',bubbles:true}));assert.equal(q('#tab-papers').getAttribute('aria-selected'),'true');assert.equal(q('#papers-panel').hidden,false);});
dom.window.close();
console.log(`${checks} checks passed, including DOM interactions. Browser visual inspection is a separate check.`);
