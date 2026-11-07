/* paint: kleurwiel + tekenen op de hele map */
(function(){
  const L=(en,nl)=>document.documentElement.lang==="nl"?nl:en;
  const SW=["#ff2b2b","#ff8a1f","#ffd23f","#3ecf5a","#5bc0ff","#7a5cff","#ff7ac8","#8b5a2b","#ffffff","#000000"];
  let col="#ff2b2b", size=6, erase=false, drawing=false, strokes=[], cur=null, pop=null;
  try{ const s=JSON.parse(localStorage.getItem("mapDrawing")||"null"); if(Array.isArray(s)) strokes=s; const c=localStorage.getItem("paintCol"); if(c) col=c; }catch(e){}
  const cv=document.createElement("canvas"); cv.className="draw-cv"; cv.setAttribute("aria-hidden","true"); document.body.appendChild(cv);
  const g=cv.getContext("2d");
  const hud=document.querySelector(".hud"); function clipHud(){ const h=hud?Math.max(0,hud.getBoundingClientRect().bottom):0; cv.style.clipPath=h?`inset(${h}px 0 0 0)`:""; }
  function fit(){ clipHud(); const d=Math.min(devicePixelRatio||1,2); cv.width=innerWidth*d; cv.height=innerHeight*d; cv.style.width=innerWidth+"px"; cv.style.height=innerHeight+"px"; g.setTransform(d,0,0,d,0,0); redraw(); }
  function line(s,from){ const p=s.p; if(!p.length) return; g.globalCompositeOperation=s.e?"destination-out":"source-over"; g.strokeStyle=s.c; g.fillStyle=s.c; g.lineWidth=s.w; g.lineCap="round"; g.lineJoin="round";
    const ox=scrollX, oy=scrollY;
    if(p.length===2&&from===undefined){ g.beginPath(); g.arc(p[0]-ox,p[1]-oy,s.w/2,0,7); g.fill(); return; }
    g.beginPath(); const i0=from===undefined?0:Math.max(0,from-2); g.moveTo(p[i0]-ox,p[i0+1]-oy); for(let i=i0+2;i<p.length;i+=2) g.lineTo(p[i]-ox,p[i+1]-oy); g.stroke(); }
  function redraw(){ g.save(); g.setTransform(1,0,0,1,0,0); g.clearRect(0,0,cv.width,cv.height); g.restore(); strokes.forEach(s=>line(s)); g.globalCompositeOperation="source-over"; }
  function save(){ try{ let js=JSON.stringify(strokes); while(js.length>1500000&&strokes.length){ strokes.shift(); js=JSON.stringify(strokes); } localStorage.setItem("mapDrawing",js); }catch(e){} }
  addEventListener("resize",fit); addEventListener("scroll",()=>{ clipHud(); redraw(); },{passive:true}); fit();
  cv.addEventListener("pointerdown",e=>{ if(!drawing) return; e.preventDefault(); cv.setPointerCapture(e.pointerId); const rc=e.button===2; cur={c:col,w:rc?Math.max(size*2.5,14):size,e:(erase||rc)?1:0,p:[Math.round(e.clientX+scrollX),Math.round(e.clientY+scrollY)]}; strokes.push(cur); line(cur); });
  cv.addEventListener("pointermove",e=>{ if(!cur) return; const n=cur.p.length; cur.p.push(Math.round(e.clientX+scrollX),Math.round(e.clientY+scrollY)); line(cur,n); g.globalCompositeOperation="source-over"; });
  const end=()=>{ if(!cur) return; cur=null; save(); };
  cv.addEventListener("contextmenu",e=>{ if(drawing) e.preventDefault(); });
  cv.addEventListener("pointerup",end); cv.addEventListener("pointercancel",end);
  const btn=document.getElementById("pntBtn");
  function setCol(c){ col=c; erase=false; try{ localStorage.setItem("paintCol",c); }catch(e){} document.documentElement.style.setProperty("--pc",c); if(pop) syncPop(); }
  document.documentElement.style.setProperty("--pc",col);
  function setDraw(on){ drawing=on; document.documentElement.classList.toggle("drawing",on); if(btn) btn.setAttribute("aria-pressed",on); if(pop) syncPop(); }
  function wheel(c){ const x=c.getContext("2d"), r=c.width/2; for(let a=0;a<360;a++){ const gr=x.createRadialGradient(r,r,0,r,r,r); gr.addColorStop(0,"#fff"); gr.addColorStop(1,`hsl(${a},100%,50%)`); x.beginPath(); x.moveTo(r,r); x.arc(r,r,r,(a-1.5)*Math.PI/180,(a+.5)*Math.PI/180); x.closePath(); x.fillStyle=gr; x.fill(); } }
  function syncPop(){ if(!pop) return; pop.querySelector(".pp-h i").style.background=erase?"transparent":col; pop.querySelectorAll(".pp-sw button").forEach(b=>b.classList.toggle("on",!erase&&b.dataset.c===col));
    const d=pop.querySelector(".pp-draw"); d.classList.toggle("on",!erase);
    pop.querySelector(".pp-er").classList.toggle("on",erase); const r=pop.querySelector("input"); r.value=size; r.style.setProperty("--v",(size-2)/38*100+"%"); pop.querySelector(".pp-n").textContent=size+"px"; }
  function place(){ if(!pop||!btn) return; const r=btn.getBoundingClientRect(), w=pop.offsetWidth; pop.style.top=(r.bottom+8)+"px"; pop.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2))+"px"; }
  function closePop(){ if(!pop) return; pop.remove(); pop=null; if(btn) btn.setAttribute("aria-expanded","false"); setDraw(false); }
  function openPop(){ pop=document.createElement("div"); pop.className="pnt-pop"; pop.setAttribute("role","dialog"); pop.setAttribute("aria-label","Paint");
    pop.innerHTML=`<div class="pp-h"><span>${L("PAINT","VERF")}</span><i></i></div>      <div class="pp-sw">${SW.map(c=>`<button type="button" data-c="${c}" style="background:${c}" aria-label="${c}"></button>`).join("")}</div>
      <div class="pp-h"><span>${L("BRUSH","PENSEEL")}</span><b class="pp-n"></b></div><input type="range" min="2" max="40" step="1" aria-label="${L("brush size","penseelgrootte")}">
      <div class="pp-row"><button type="button" class="pp-draw">${L("DRAW","TEKEN")}</button><button type="button" class="pp-er">${L("ERASE","GUM")}</button><button type="button" class="pp-clr wide">${L("CLEAR","WISSEN")}</button></div>`;
    document.body.appendChild(pop); if(btn) btn.setAttribute("aria-expanded","true");
    pop.querySelectorAll(".pp-sw button").forEach(b=>b.addEventListener("click",()=>{ setCol(b.dataset.c); if(window.SFX) SFX.click&&SFX.click(); }));
    const r=pop.querySelector("input"); r.addEventListener("input",()=>{ size=+r.value; syncPop(); });
    pop.querySelector(".pp-draw").addEventListener("click",()=>{ erase=false; syncPop(); });
    pop.querySelector(".pp-er").addEventListener("click",()=>{ erase=true; syncPop(); });
    pop.querySelector(".pp-clr").addEventListener("click",()=>{ strokes=[]; save(); redraw(); if(window.SFX&&SFX.paper) SFX.paper(); });
    setDraw(true); syncPop(); place(); }
  addEventListener("resize",place); addEventListener("scroll",place,{passive:true});
  if(btn){ btn.innerHTML=(typeof sprite==="function"?sprite("brush",2):"")+'<i class="sw"></i>'; btn.addEventListener("click",e=>{ e.stopPropagation(); if(pop) closePop(); else openPop(); }); }
  document.addEventListener("pointerdown",e=>{ if(pop&&!drawing&&!e.target.closest(".pnt-pop,#pntBtn")) closePop(); },true);
  addEventListener("keydown",e=>{ if(e.key==="Escape"&&(drawing||pop)){ setDraw(false); closePop(); } });
  window.Paint={setDraw,clear:()=>{ strokes=[]; save(); redraw(); },get strokes(){ return strokes; }};
})();
