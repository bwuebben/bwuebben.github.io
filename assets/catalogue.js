(function(){
 "use strict";
 const main=document.querySelector("main.papers"), form=document.getElementById("paper-filters");
 const query=document.getElementById("paper-search"), subject=document.getElementById("paper-subject");
 const compact=document.getElementById("compact-view"), status=document.getElementById("result-count");
 const rows=Array.from(main.querySelectorAll(".entries>li"));
 const normalize=s=>s.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[–—−]/g,"-");
 const groups=new Map([["Markets and quantitative finance","markets"],["Mathematics","mathematics"],["Theoretical physics","physics"],["AI and the machine economy","ai"],["International relations and politics","politics"]]);
 let current="";
 for(const node of main.children){
  if(node.matches("h2.paper-category")) current=groups.get(node.textContent.trim());
  if(node.matches("ul.entries")) for(const row of node.children){row.dataset.subject=current; row.dataset.search=normalize(row.textContent);}
 }
 const headings=Array.from(main.querySelectorAll("h2.paper-category,h3.paper-topic,h4.paper-series"));
 function update(){
  const terms=normalize(query.value).trim().split(/\s+/).filter(Boolean);
  let count=0;
  for(const row of rows){ const hit=(!subject.value||row.dataset.subject===subject.value)&&terms.every(t=>row.dataset.search.includes(t)); row.hidden=!hit; if(hit)count++; }
  for(const ul of main.querySelectorAll("ul.entries")) ul.hidden=!Array.from(ul.children).some(n=>!n.hidden);
  for(const h of headings){
   const level=Number(h.tagName.slice(1)); let next=h.nextElementSibling, any=false;
   while(next){
    if(/^H[234]$/.test(next.tagName)&&Number(next.tagName.slice(1))<=level)break;
    if(next.matches("ul.entries")&&!next.hidden)any=true;
    next=next.nextElementSibling;
   }
   h.hidden=!any;
  }
  for(const p of main.querySelectorAll(".subsection-note")){
   let next=p.nextElementSibling;
   while(next&&!next.matches("ul.entries"))next=next.nextElementSibling;
   p.hidden=!!next&&next.hidden;
  }
  document.body.classList.toggle("compact",compact.checked);
  status.textContent=count+" of "+rows.length+" papers";
  document.getElementById("empty-results").hidden=count!==0;
  const params=new URLSearchParams();
  if(query.value.trim())params.set("q",query.value.trim());
  if(subject.value)params.set("subject",subject.value);
  if(compact.checked)params.set("view","compact");
  history.replaceState(null,"",location.pathname+(params.size?"?"+params:"")+location.hash);
 }
 const initial=new URLSearchParams(location.search);
 query.value=initial.get("q")||""; subject.value=initial.get("subject")||""; compact.checked=initial.get("view")==="compact";
 form.hidden=false; form.addEventListener("submit",e=>e.preventDefault());
 query.addEventListener("input",update); subject.addEventListener("change",update); compact.addEventListener("change",update);
 document.getElementById("clear-filters").addEventListener("click",()=>{query.value="";subject.value="";update();query.focus();});
 for(const a of document.querySelectorAll(".catalogue-nav a"))a.addEventListener("click",()=>{query.value="";subject.value="";update();});
 update();
})();
