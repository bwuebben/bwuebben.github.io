(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const fmt = (n, places=1) => n.toLocaleString("en-US", {maximumFractionDigits:places,minimumFractionDigits:places});
  const number = id => Number($(id).value);
  function evidenceUpdate() {
    const n=number("voices"), rho=number("correlation")/100, m=ResearchModels.evidence(n,rho);
    $("add-voices").disabled=n>=20;
    document.querySelectorAll("[data-evidence]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.evidence===n+","+(rho*100)));
    $("voices-out").textContent=n+" voices"; $("correlation-out").textContent=fmt(rho,2);
    $("effective").textContent=fmt(m.effective); $("overstatement").textContent=fmt(m.precisionOverstatement)+"×";
    $("evidence-mobile").textContent=fmt(m.effective)+" independent estimates · "+fmt(m.precisionOverstatement)+"× precision overstatement";
    $("naive-bar").style.width=(m.naiveError*100)+"%"; $("actual-bar").style.width=(m.actualError*100)+"%";
    $("naive-out").textContent=fmt(m.naiveError*100,0)+"%"; $("actual-out").textContent=fmt(m.actualError*100,0)+"%";
    $("evidence-conclusion").textContent=n+" estimates with correlation "+fmt(rho,2)+" carry the averaging precision of "+fmt(m.effective)+" independent estimates. Counting all "+n+" as independent overstates precision by "+fmt(m.precisionOverstatement)+" times.";
    const svg=$("evidence-network"); svg.replaceChildren();
    const ns="http://www.w3.org/2000/svg";
    for(let i=0;i<n;i++) {
      const angle=2*Math.PI*i/n-Math.PI/2, x=220+160*Math.cos(angle), y=160+115*Math.sin(angle);
      const line=document.createElementNS(ns,"line");
      for(const [k,v] of Object.entries({x1:220,y1:160,x2:x,y2:y,stroke:"var(--accent)","stroke-width":1+rho*4,opacity:.1+rho*.65})) line.setAttribute(k,v);
      svg.append(line);
      const circle=document.createElementNS(ns,"circle");
      for(const [k,v] of Object.entries({cx:x,cy:y,r:8,fill:"var(--bg)",stroke:"var(--green)","stroke-width":2})) circle.setAttribute(k,v);
      svg.append(circle);
    }
    const hub=document.createElementNS(ns,"circle");
    for(const [k,v] of Object.entries({cx:220,cy:160,r:12+rho*20,fill:"var(--accent)",opacity:.2+rho*.7})) hub.setAttribute(k,v);
    svg.append(hub);
    svg.setAttribute("aria-label",n+" estimates connected to a common source; line strength illustrates correlation "+fmt(rho,2)+".");
  }
  if($("voices")) {
    ["voices","correlation"].forEach(id=>$(id).addEventListener("input",evidenceUpdate));
    document.querySelectorAll("[data-evidence]").forEach(b=>b.addEventListener("click",()=>{
      const [n,r]=b.dataset.evidence.split(","); $("voices").value=n; $("correlation").value=r; evidenceUpdate();
    }));
    $("add-voices").addEventListener("click",()=>{ $("voices").value=Math.min(20,number("voices")+5); evidenceUpdate(); });
    evidenceUpdate();
  }
  function powerUpdate() {
    const chips=number("chips")*1000, grid=number("grid"), cooling=number("cooling"), use=number("utilization")/100;
    $("more-chips").disabled=chips>=600000;
    document.querySelectorAll("[data-power]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.power===[chips/1000,grid,cooling,use*100].join(",")));
    const m=ResearchModels.deployment(chips,grid,cooling,use);
    $("chips-out").textContent=fmt(chips/1000,0)+" thousand"; $("grid-out").textContent=fmt(grid,0)+" MW";
    $("cooling-out").textContent=fmt(cooling,0)+" MW IT"; $("utilization-out").textContent=fmt(use*100,0)+"%";
    $("operating").textContent=fmt(m.operating/1000,1)+"k"; $("useful-hours").textContent=fmt(m.usefulHours/1e6,2)+"m";
    $("power-mobile").textContent=fmt(m.operating/1000,1)+"k active · "+fmt(m.usefulHours/1e6,2)+"m useful accelerator-hours / day";
    const max=Math.max(...Object.values(m.limits));
    for(const key of Object.keys(m.limits)) {
      $(key+"-bar").style.width=(m.limits[key]/max*100)+"%";
      $(key==="power" ? "power-out" : key+"-capacity-out").textContent=fmt(m.limits[key]/1000,0)+"k";
    }
    const names={chips:"installed chips",power:"electricity supply",cooling:"cooling capacity"};
    $("power-conclusion").textContent="The limiting resource is "+m.binding.map(x=>names[x]).join(" and ")+". "+fmt(m.stranded/1000,1)+" thousand installed accelerators cannot operate at the assumed load. The operating fleet requires "+fmt(m.facilityMW,1)+" MW of facility power.";
  }
  if($("chips")) {
    ["chips","grid","cooling","utilization"].forEach(id=>$(id).addEventListener("input",powerUpdate));
    document.querySelectorAll("[data-power]").forEach(b=>b.addEventListener("click",()=>{
      const values=b.dataset.power.split(",");
      ["chips","grid","cooling","utilization"].forEach((id,i)=>$(id).value=values[i]);
      powerUpdate();
    }));
    $("more-chips").addEventListener("click",()=>{ $("chips").value=Math.min(600,number("chips")*2); powerUpdate(); });
    powerUpdate();
  }
})();
