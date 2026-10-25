(function(){
 "use strict";
 const key="bernd-site-review-2026-10-25", form=document.getElementById("review-form"), status=document.getElementById("save-status");
 let saved={};
 try{saved=JSON.parse(localStorage.getItem(key)||"{}");}catch(e){status.textContent="Browser storage is unavailable. Export your notes before closing.";}
 for(const el of form.elements)if(el.name&&saved[el.name]!==undefined)el.value=saved[el.name];
 function data(){return Object.fromEntries(Array.from(form.elements).filter(x=>x.name).map(x=>[x.name,x.value]));}
 form.addEventListener("submit",e=>e.preventDefault());
 form.addEventListener("input",()=>{try{localStorage.setItem(key,JSON.stringify(data()));status.textContent="Saved in this browser.";}catch(e){status.textContent="Could not save locally. Export your notes to keep them."; }});
 document.getElementById("export-notes").addEventListener("click",()=>{
  const blob=new Blob([JSON.stringify({date:new Date().toISOString(),preview:"site-direction-2026-10-25",notes:data()},null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="website-review.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 });
})();
