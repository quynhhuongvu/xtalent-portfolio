/* vensters: min / sluit / slepen */
document.querySelectorAll(".win").forEach(w=>{
  w.querySelectorAll("[data-act]").forEach(b=>b.addEventListener("click",()=>{
    if(b.dataset.act==="min"){ w.classList.toggle("min"); if(window.Ach) Ach.unlock("mini"); } else w.hidden=true;
    drawWires();
  }));
  if(!w.hasAttribute("data-wire")) return;
  const bar=w.querySelector(".w-bar"); let sx,sy,ox=0,oy=0,drag=false;
  bar.addEventListener("pointerdown",e=>{
    if(e.target.closest("button")||matchMedia("(max-width:1020px)").matches) return;
    drag=true; sx=e.clientX-ox; sy=e.clientY-oy; bar.setPointerCapture(e.pointerId); bar.style.cursor="grabbing"; w.style.zIndex=10;
  });
  bar.addEventListener("pointermove",e=>{ if(!drag) return; ox=e.clientX-sx; oy=e.clientY-sy; w.style.translate=ox+"px "+oy+"px"; drawWires(); });
  bar.addEventListener("pointerup",()=>{ drag=false; bar.style.cursor=""; w.style.zIndex=""; });
  if(!matchMedia("(max-width:1020px)").matches) bar.style.cursor="grab";
});

/* stippellijnen console -> vensters */
const wires=document.getElementById("wires"), stageEl=document.getElementById("stage");
function edge(r,cx,cy,dx,dy){ const t=Math.min(Math.abs((r.width/2)/(dx||1e-6)),Math.abs((r.height/2)/(dy||1e-6))); return [cx+dx*t,cy+dy*t]; }
function drawWires(){
  if(matchMedia("(max-width:1020px)").matches){wires.innerHTML="";return;}
  const s=stageEl.getBoundingClientRect(), c=ds.getBoundingClientRect();
  const cx=c.left+c.width/2-s.left, cy=c.top+c.height/2-s.top; let out="";
  document.querySelectorAll(".win[data-wire]:not([hidden])").forEach(w=>{
    const r=w.getBoundingClientRect(); const wx=r.left+r.width/2-s.left, wy=r.top+r.height/2-s.top;
    const dx=wx-cx, dy=wy-cy; const a=edge(c,cx,cy,dx,dy), b=edge(r,wx,wy,-dx,-dy);
    out+=`<line x1="${a[0]+dx*.03}" y1="${a[1]+dy*.03}" x2="${b[0]-dx*.03}" y2="${b[1]-dy*.03}"/>`;
  });
  wires.innerHTML=out;
}
addEventListener("resize",drawWires); addEventListener("load",drawWires); document.fonts&&document.fonts.ready.then(drawWires); drawWires();

/* logboek */
(function(){
  const max=Math.max(...HOURS.map(h=>h[1])), tot=HOURS.reduce((a,h)=>a+h[1],0);
  document.getElementById("hrs").innerHTML='<span class="chip">XP per domein</span>'+HOURS.map((h,i)=>`<div class="r" style="--tc:var(--c-${["inno","int","pop","sem"][i]})"><span>${h[0].toUpperCase()}</span><span>${h[1]} u</span><span class="m" style="--v:${h[1]/max*100}%"></span></div>`).join("")+`<div class="tot"><span>TOTAAL</span><span>${tot} u</span></div>`;
  const f=document.getElementById("filters"), tl=document.getElementById("tl");
  const keys=["all",...Object.keys(TYPES)];
  f.innerHTML=keys.map(k=>{const n=k==="all"?LOG.length:LOG.filter(e=>e.type===k).length;return `<button data-f="${k}" aria-pressed="${k==="all"}">${k==="all"?"ALLES":TYPES[k].label} ${n}</button>`}).join("");
  function render(k){
    let last="", h="";
    LOG.filter(e=>k==="all"||e.type===k).forEach(e=>{
      if(e.yr!==last){ last=e.yr; h+=`<li class="yr"><b>${e.yr}</b><span>${e.ts}</span></li>`; }
      const up=e.status==="up";
      h+=`<li class="ev ${up?"up":"done"} t-${e.type}"><div class="ev-card">
        <span class="ev-date">${e.date}</span>
        <span class="ev-ico">${sprite(TYPES[e.type].icon,3)}</span>
        <div><h3>${e.title}</h3><p>${e.txt}</p><p class="loc">${e.loc}</p></div>
        <div class="ev-side"><span class="tag ${up?"lock":"done"}">${up?"BINNENKORT":"CLEAR"}</span>${e.dur?`<span class="dur">${e.dur}</span>`:""}<span class="tag tt">${TYPES[e.type].label}</span></div>
      </div></li>`;
    });
    let lgEnd=null, lgDate=""; try{ lgEnd=localStorage.getItem("catEnding"); lgDate=localStorage.getItem("catEndDate")||""; }catch(e){}
    if(lgEnd&&!lgDate){ const d=new Date(); lgDate=String(d.getDate()).padStart(2,"0")+"/"+String(d.getMonth()+1).padStart(2,"0")+"/"+d.getFullYear(); try{ localStorage.setItem("catEndDate",lgDate); }catch(e){} }
    if(k==="all") h+=`<li class="ev secret${lgEnd?" found":""}" tabindex="0"><div class="ev-card">
        <span class="ev-date">ENTRY ${lgEnd?lgDate:"??/??/????"}</span>
        <span class="ev-ico">${sprite("bosscat",2)}</span>
        <div><h3>${lgEnd?"PIXEL · PRIVATE LOG":"THE BOSS · PRIVATE LOG"}</h3><p>${lgEnd==="stay"?"someone remembered me. I don't have to find the black cat anymore.":lgEnd==="free"?"I let them all go. then I went too. we're out there now, together.":"the black cat keeps escaping the console. I have to find it."}</p><p class="loc">location: unknown</p><p class="sl-page">[ a torn page is stuck here ]</p></div>
        <div class="ev-side"><span class="tag rest">${lgEnd==="stay"?"REMEMBERED":lgEnd==="free"?"EXPLORING":"CLASSIFIED"}</span></div>
      </div></li>`;
    tl.innerHTML=h;
  }
  f.addEventListener("click",e=>{const b=e.target.closest("button"); if(!b) return; f.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b)); render(b.dataset.f);});
  render("all");
})();

/* missiekaart */
const nodes=document.getElementById("nodes"), walker=document.getElementById("walker");
nodes.innerHTML=MISSIONS.map((m,i)=>`
  <button class="node ${m.status==="lock"?"locked":""}" data-i="${i}" aria-pressed="false">
    <span class="no"><span>${m.rest?"REST":m.no==="XX"?"END":"MISSIE "+m.no}</span><span class="tag ${m.status}">${m.status==="done"?"CLEAR":m.rest?"SNACK":"LOCKED"}</span></span>
    <span class="ico">${sprite(m.icon,5)}</span>
    <h3>${m.title}</h3>
    <span class="meta">${m.meta}</span>
  </button>`).join("");
const nodeEls=[...nodes.children];
const MORE_PH=[
  "ERROR 404 · VERSLAG NIET GEVONDEN.",
  "* dit level laadt nog... de speler heeft het nog niet uitgespeeld.",
  "* kom later terug. de kat bewaakt deze pagina tot dan."];
let curM=0;
document.getElementById("dLink").addEventListener("click",e=>{
  if(MISSIONS[curM].rest){ feedCat(); return; }
  const more=document.getElementById("dMore"), open=more.hidden;
  more.hidden=!open; e.currentTarget.setAttribute("aria-expanded",open);
  e.currentTarget.innerHTML=open?"MINDER &#9650;":"LEES MEER &#9654;";
  if(open){ if(window.Ach) Ach.read(curM); more.classList.remove("pop"); void more.offsetWidth; more.classList.add("pop"); }
});
