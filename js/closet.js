/* closet: kleren voor de kat (vrijspelen via trofeeën) */
window.Closet=(function(){
  const L=(en,nl)=>document.documentElement.lang==="nl"?nl:en;
  const IT=[
    {id:"none",en:"NOTHING",nl:"NIETS"},
    {id:"party",en:"PARTY HAT",nl:"FEESTHOED",c:"#ff7ac8",ach:"boot",an:"FIRST BOOT",s:["...#...","..###..",".#####.","#######"]},
    {id:"bow",en:"BOW",nl:"STRIK",c:"#ff2b2b",ach:"pet",an:"CAT WHISPERER",s:["##...##","###.###","#######","##...##"]},
    {id:"phones",en:"HEADPHONES",nl:"KOPTELEFOON",c:"#5bc0ff",ach:"lang",an:"BILINGUAL",s:[".#####.","#.....#","#.....#","##...##"]},
    {id:"beanie",en:"BEANIE",nl:"MUTS",c:"#3ecf5a",ach:"sleep",an:"GOOD NIGHT",s:["...#...",".#####.","#######","#.#.#.#"]},
    {id:"top",en:"TOP HAT",nl:"HOGE HOED",c:"#7a5cff",ach:"slayer",an:"DEADLINE SLAYER",s:[".#####.",".#####.",".#####.","#######"]},
    {id:"halo",en:"HALO",nl:"AUREOOL",c:"#fff27a",ach:"zero",an:"ROCK BOTTOM",s:[".#####.","#.....#",".#####.","......."]},
    {id:"crown",en:"CROWN",nl:"KROON",c:"#ffd23f",ach:"royal",an:"ROYALTY"}];
  IT.forEach(t=>{ if(t.s) SPR["o_"+t.id]=t.s; });
  const get=k=>{ try{ return localStorage.getItem(k); }catch(e){ return null; } }, put=(k,v)=>{ try{ localStorage.setItem(k,v); }catch(e){} };
  const has=t=>!t.ach||(window.Ach&&Ach.has&&Ach.has(t.ach));
  const spr=(t,sz)=>t.id==="crown"?sprite("crown",sz):t.s?sprite("o_"+t.id,sz):"";
  const CATS=[["#sCat",2],[".title .cat",3],["#walker",3],[".end .p-cat",3]];
  function current(){ if(document.documentElement.classList.contains("royal")) return "crown"; const o=get("catOutfit"); const t=IT.find(x=>x.id===o); return t&&t.s&&has(t)?o:"none"; }
  function apply(){ const id=get("catOutfit")||"none", t=IT.find(x=>x.id===id);
    const on=!!(t&&t.s&&has(t)); document.documentElement.classList.toggle("dressed",on);
    CATS.forEach(([q,sz])=>{ const el=document.querySelector(q); if(!el) return; let o=el.querySelector(":scope>.outfit"); if(!o){ o=document.createElement("i"); o.className="outfit"; el.appendChild(o); }
      o.innerHTML=on?spr(t,sz):""; o.style.color=on?t.c:""; }); }
  function wear(id){ const t=IT.find(x=>x.id===id); if(!t||!has(t)) return;
    const R=document.documentElement;
    if(id==="crown"){ R.classList.add("royal"); put("catRoyal","1"); put("catOutfit","none"); }
    else { R.classList.remove("royal"); put("catRoyal",""); put("catOutfit",id); }
    apply(); render(); }
  let pop=null;
  function render(){ if(!pop) return; const cur=current(), t=IT.find(x=>x.id===cur);
    pop.querySelector(".cl-top b").textContent=L("CLOSET","KLEERKAST");
    pop.querySelector(".cl-x").textContent=L("CLOSE ✕","SLUIT ✕");
    pop.querySelector(".cl-cat").innerHTML=sprite("catfront",10)+(t&&t.id!=="none"?`<i class="ch${t.id==="crown"?" royal":""}" style="color:${t.c};left:10px;top:-30px">${spr(t,10)}</i>`:"");
    pop.querySelector(".cl-name").textContent=t?(L(t.en,t.nl)):"";
    const n=IT.filter(has).length;
    pop.querySelector(".cl-grid").innerHTML=IT.map(x=>{ const ok=has(x);
      return `<button type="button" class="cl-it${x.id===cur?" on":""}" data-id="${x.id}" ${ok?"":"disabled"} aria-label="${L(x.en,x.nl)}">${x.id==="none"?'<i class="none"></i>':ok?`<i style="color:${x.c}">${spr(x,5)}</i>`:'<i style="color:#666">'+spr(x,5)+'</i>'}<span>${ok?L(x.en,x.nl):"???"}</span>${ok?"":`<span class="lk">🔒 ${x.an}</span>`}</button>`; }).join("");
    pop.querySelector(".cl-tip").textContent=L(`* ${n}/${IT.length} unlocked. earn trophies to unlock more outfits.`,`* ${n}/${IT.length} vrijgespeeld. verdien trofeeën voor meer outfits.`);
    pop.querySelectorAll(".cl-it:not(:disabled)").forEach(b=>b.addEventListener("click",()=>wear(b.dataset.id))); }
  function close(){ if(!pop) return; pop.remove(); pop=null; }
  function open(){ if(pop) return; pop=document.createElement("div"); pop.className="cl-pop"; pop.setAttribute("role","dialog"); pop.setAttribute("aria-label","Closet");
    pop.innerHTML='<div class="cl-box"><div class="cl-top"><b></b><button type="button" class="cl-x"></button></div><div class="cl-main"><div class="cl-stage"><span class="cl-name"></span><span class="cl-cat"></span></div><div><div class="cl-grid"></div><p class="cl-tip"></p></div></div></div>';
    document.body.appendChild(pop); pop.addEventListener("click",e=>{ if(e.target===pop) close(); }); pop.querySelector(".cl-x").addEventListener("click",close);
    render(); const f=pop.querySelector(".cl-it.on")||pop.querySelector(".cl-it"); if(f) f.focus({preventScroll:true}); }
  addEventListener("keydown",e=>{ if(e.key==="Escape"&&pop){ e.stopPropagation(); close(); } },true);
  apply(); new MutationObserver(()=>{ if(!document.querySelector(".end .p-cat>.outfit")) apply(); }).observe(document.querySelector(".end")||document.body,{childList:true,subtree:true});
  return {open,close,apply,wear};
})();
