#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const M=require('../assets/stability-spectral-hero.js');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'research/geometry/quantitative-moduli/atlas/index.html'),'utf8');
const close=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<=tol*Math.max(Math.abs(a),Math.abs(b),1e-15),`${a} != ${b}`);
let checks=0;
function check(name,fn){fn();checks++;console.log('PASS '+name);}
check('Twelve leading modes reproduce the leading determinant 16 h^17',()=>{
  for(const h of [.1,.03,.01,.001]){
    const rates=M.leadingRates(h);assert.equal(rates.reduce((s,r)=>s+r.multiplicity,0),12);
    close(rates.reduce((p,r)=>p*r.value**r.multiplicity,1),16*h**17);
    assert.ok(rates.every(r=>r.value>0));
  }
});
check('A tenfold change in h separates the first, second and fourth powers',()=>{
  const a=M.leadingRates(.1),b=M.leadingRates(.01);
  for(let i=0;i<3;i++)close(a[i].value/b[i].value,10);
  close(a[3].value/b[3].value,100);close(a[4].value/b[4].value,10000);
  close(b[2].value/b[4].value,(2+Math.SQRT2)*1e6);
});
check('Every plotted rate stays within the logarithmic chart throughout the slider range',()=>{
  for(let p=1;p<=3.001;p+=.02){const h=10**(-p);for(const r of M.leadingRates(h)){
    const point=M.coordinates(h,r.value);assert.ok(point.x>=59.99&&point.x<=454.01);assert.ok(point.y>=34&&point.y<=274.01);
  }}
});
check('The static SVG and no-script readouts match the default model',()=>{
  for(const r of M.leadingRates(.01)){
    const mark=html.match(new RegExp(`id="spectral-${r.id}"[^>]*cx="([^"]+)" cy="([^"]+)"`));assert.ok(mark);
    const p=M.coordinates(.01,r.value);assert.ok(Math.abs(Number(mark[1])-p.x)<.01);assert.ok(Math.abs(Number(mark[2])-p.y)<.01);
  }
  assert.ok(html.includes('id="spectral-inverse">10⁸'));
  assert.ok(html.includes('aria-labelledby="spectral-chart-title spectral-chart-desc"'));
  assert.ok(html.includes('higher-order corrections'));
});
check('Slider input updates the cursor, all markers, readouts and accessible value',()=>{
  const elements=new Map();
  for(const id of ['spectral-parameter','spectral-cursor','spectral-h-value','spectral-inverse','spectral-spread','spectral-live',...M.leadingRates(.01).map(r=>'spectral-'+r.id)]){
    elements.set(id,{value:'2',disabled:true,attributes:{},events:{},textContent:'',setAttribute(k,v){this.attributes[k]=String(v);},addEventListener(k,fn){this.events[k]=fn;}});
  }
  M.init({getElementById:id=>elements.get(id)});
  const slider=elements.get('spectral-parameter');assert.equal(slider.disabled,false);
  for(const power of ['1','2','3']){
    slider.value=power;slider.events.input();
    const h=10**(-Number(power));close(Number(elements.get('spectral-cursor').attributes.x1),M.coordinates(h,h).x);
    for(const r of M.leadingRates(h))close(Number(elements.get('spectral-'+r.id).attributes.cy),M.coordinates(h,r.value).y);
    assert.equal(elements.get('spectral-inverse').textContent,M.scientific(h**-4));
    assert.ok(slider.attributes['aria-valuetext'].includes('h = '));
    assert.ok(elements.get('spectral-live').textContent.includes('times the slowest'));
  }
});
check('Invalid parameters are rejected and a page without the figure is harmless',()=>{
  for(const h of [0,-1,Infinity,NaN])assert.throws(()=>M.leadingRates(h),RangeError);
  assert.doesNotThrow(()=>M.init({getElementById:()=>null}));
});
console.log(`${checks} spectral model and interaction checks passed.`);
