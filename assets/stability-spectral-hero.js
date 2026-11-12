/* Leading terms of the twelve weak eigenvalues in Paper 28, Section 8.
   These are asymptotic model rates, not a simulation of nonlinear HYM flow. */
(function(root){
  'use strict';
  const superscript=n=>String(n).replace(/[-0-9]/g,c=>({'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'}[c]));
  function scientific(value){
    const power=Math.floor(Math.log10(value)+1e-12),coefficient=value/10**power;
    return Math.abs(coefficient-1)<1e-9?'10'+superscript(power):coefficient.toFixed(2).replace(/\.00$/,'')+' × 10'+superscript(power);
  }
  function leadingRates(h){
    if(!Number.isFinite(h)||h<=0)throw new RangeError('h must be positive and finite');
    return [
      {id:'fast-low',value:(2-Math.SQRT2)*h,multiplicity:3},
      {id:'fast-middle',value:2*h,multiplicity:3},
      {id:'fast-high',value:(2+Math.SQRT2)*h,multiplicity:3},
      {id:'middle',value:h*h/2,multiplicity:2},
      {id:'slow',value:h**4,multiplicity:1}
    ];
  }
  function coordinates(h,rate){return {x:60+197*(-Math.log10(h)-1),y:34-20*Math.log10(rate)};}
  function init(doc){
    const slider=doc.getElementById('spectral-parameter');
    if(!slider)return;
    const get=id=>doc.getElementById(id);
    function update(){
      const power=Number(slider.value),h=10**(-power),rates=leadingRates(h),x=coordinates(h,h).x;
      get('spectral-cursor').setAttribute('x1',x);get('spectral-cursor').setAttribute('x2',x);
      for(const rate of rates){const point=coordinates(h,rate.value),marker=get('spectral-'+rate.id);marker.setAttribute('cx',point.x);marker.setAttribute('cy',point.y);}
      const hText=h.toPrecision(3),slowInverse=1/rates[4].value,spread=rates[2].value/rates[4].value;
      get('spectral-h-value').textContent='h = '+hText;
      get('spectral-inverse').textContent=scientific(slowInverse);
      get('spectral-spread').textContent=scientific(spread);
      slider.setAttribute('aria-valuetext','h = '+hText+'; inverse slowest model rate '+scientific(slowInverse));
      get('spectral-live').textContent='h = '+hText+'. The fastest model rate is '+scientific(spread)+' times the slowest.';
    }
    slider.addEventListener('input',update);slider.disabled=false;update();
  }
  const api={leadingRates,coordinates,scientific,init};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root.document)init(root.document);
})(typeof window!=='undefined'?window:globalThis);
