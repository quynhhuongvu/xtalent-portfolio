/* hartjes: verlies er een bij overslaan of vluchten */
window.Life=(function(){
  const nl=()=>document.documentElement.lang==="nl";
  let els=[...document.querySelectorAll('.hud .p1>[data-sprite="heart"]')]; const wrap=document.querySelector(".hud .p1");
  let MAX=3; try{ const m=+localStorage.getItem("catHeartMax"); if(m>=1&&m<=5) MAX=m; }catch(e){}
  function build(){ if(!wrap) return; els.forEach(e=>e.remove()); els=[]; const lbl=wrap.querySelector("span:not([data-sprite])");
    for(let i=0;i<MAX;i++){ const e=document.createElement("span"); e.setAttribute("data-sprite","heart"); e.setAttribute("data-s","2"); wrap.insertBefore(e,lbl); els.push(e); } }
  if(MAX!==3) build();
  let h=MAX; try{ const v=localStorage.getItem("catHearts"); if(v!==null&&v!=="") h=Math.max(0,Math.min(MAX,+v||0)); }catch(e){}
  function draw(){ els.forEach((e,i)=>{ const full=i<h; e.innerHTML=sprite(full?"heart":"heartE",2); e.classList.toggle("lost",!full); }); if(wrap) wrap.classList.toggle("dead",h===0); }
  function set(v){ const old=h; h=Math.max(0,Math.min(MAX,v)); try{ localStorage.setItem("catHearts",h); }catch(e){} draw(); if(h<old&&old>=0&&window.SFX) SFX.heartLoss();
    const e=els[h<old?h:old]; if(e&&h!==old){ e.classList.remove("hpop"); void e.offsetWidth; e.classList.add("hpop"); } }
  function lose(){ if(h<=0) return; set(h-1);
    if(h===0){ if(window.Ach) Ach.earn("zero"); setTimeout(gameOver,MAX===1?3400:2800); } }
  function gameOver(){ if(document.querySelector(".go-scr")) return; if(window.SFX){ SFX.hit(); setTimeout(SFX.hit,600); setTimeout(SFX.lose,1700); }
    const o=document.createElement("div"); o.className="museum go-scr"; o.setAttribute("role","dialog"); o.setAttribute("aria-modal","true"); o.setAttribute("aria-label","Game over");
    o.innerHTML=`<div class="mu-in"><div class="go-t">GAME OVER</div><div class="go-cat">${sprite("catcry",7)}</div><div class="mu-box"><p></p><p></p></div><button type="button" class="btn mu-x" hidden>CONTINUE &#9829;</button></div>`;
    document.body.appendChild(o); document.documentElement.style.overflow="hidden";
    const lines=nl()?["* je hebt geen hartjes meer.","* ...maar de kat vergeeft je."]:["* you ran out of hearts.","* ...but the cat forgives you."];
    const ps=o.querySelectorAll(".mu-box p"), btn=o.querySelector(".mu-x"); let li=0, ci=0;
    (function ty(){ if(li>=lines.length){ btn.hidden=false; btn.focus({preventScroll:true}); return; } ps[li].textContent=lines[li].slice(0,++ci);
      if(ci>=lines[li].length){ li++; ci=0; setTimeout(ty,700); } else setTimeout(ty,45); })();
    const close=()=>{ if(!o.isConnected) return; o.remove(); document.documentElement.style.overflow=""; set(1); };
    btn.addEventListener("click",close); addEventListener("keydown",e=>{ if(e.key==="Escape"&&!btn.hidden) close(); });
  }
  draw(); if(h===0) setTimeout(gameOver,700);
  function setMax(m){ MAX=Math.max(1,Math.min(5,m)); try{ localStorage.setItem("catHeartMax",MAX); }catch(e){} build(); h=-1; set(MAX); if(window.Ach&&Ach.refresh) Ach.refresh(); }
  return {get:()=>h,max:()=>MAX,set,add:n=>set(h+n),lose,full:()=>set(MAX),setMax};
})();

window.Memo=(function(){
  const nl=()=>document.documentElement.lang==="nl";
  const get=k=>{ try{ return localStorage.getItem(k); }catch(e){ return null; } };
  const put=(k,v)=>{ try{ localStorage.setItem(k,v); }catch(e){} };
  let prev=null; try{ prev=JSON.parse(get("catMemo")||"null"); }catch(e){}
  const back=!!get("catSeen"); put("catSeen","1");
  { const hh=new Date().getHours(); if(hh>=22||hh<5) setTimeout(()=>window.Ach&&Ach.earn("owl"),2500); if(back) setTimeout(()=>window.Ach&&Ach.earn("back"),2600); }
  let rec=null, feeds=0, greeted=false, pending=false, wonNow=false;
  function save(){ rec=rec||{feeds:0,skipped:false}; rec.feeds=feeds; put("catMemo",JSON.stringify(rec)); }
  function text(){
    if(prev&&prev.skipped&&!prev.feeds) return nl()?"...vorige keer gaf je de kat geen eten. hij onthoudt het.":"...last time you didn't feed the cat. it remembers.";
    const pn=window.playerName?playerName():"", w=pn?", "+pn:"";
    if(prev&&prev.feeds>0){ const n=prev.feeds; return nl()?`...je bent teruggekomen${w}. Vorige keer gaf je de kat ${n} keer eten.`:`...you came back${w}. Last time you fed the cat ${n} time${n===1?"":"s"}.`; }
    return nl()?`...je bent teruggekomen${w}.`:`...you came back${w}.`;
  }
  function timeMsg(){ const d=new Date(), h=d.getHours(), hm=String(h).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");
    if(h<5) return nl()?`het is ${hm}. de kat slaapt. waarom jij niet?`:`it's ${hm}. the cat is asleep. why aren't you?`;
    if(h<8) return nl()?"vroege vogel. de kat is niet onder de indruk.":"early bird. the cat is not impressed.";
    if(h>=22) return nl()?`het is ${hm}. moet jij niet in bed liggen?`:`it's ${hm}. shouldn't you be in bed?`;
    return null; }
  function greet(){
    if(greeted||pending) return; pending=true;
    const q=[back?text:null,timeMsg].filter(Boolean);
    (function next(wait){ if(!q.length){ pending=false; greeted=true; return; }
      setTimeout(()=>{ if(ds.classList.contains("off")){ pending=false; return; } const t=q.shift()(); if(t) say(t,5200); next(t?5600:0); },wait); })(3300);
  }
  function endBad(){ const pc=document.querySelector(".end .p-cat"); if(pc){ pc.innerHTML=sprite("catback",4)+'<i class="crown">'+sprite("crown",3)+'</i>'+(()=>{ const sz=3; return '<i class="xhat"><i class="xh-r">'+sprite("hatred",sz)+'</i><i class="xh-w">'+sprite("hatwhite",sz)+'</i></i>'; })(); pc.classList.add("back"); } }
  function fed(){ feeds++; save(); }
  function skip(){ rec=rec||{feeds:0,skipped:false}; rec.skipped=true; save(); if(!feeds){ if(window.SFX) SFX.eerie(); badRoute=true; endBad(); if(window.Life) Life.lose(); } }
  function won(){ wonNow=true; put("catBossWon","1"); try{ localStorage.removeItem("coward"); }catch(e){} if(window.Ach) Ach.earn("slayer"); if(window.Life) Life.full(); }
  const hasWon=()=>wonNow||!!get("catBossWon");
  /* tab-titel als je weggaat */
  let base=null, tt=0;
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden){ if(base==null) base=document.title; document.title=nl()?"kom terug...":"come back..."; clearTimeout(tt);
      tt=setTimeout(()=>{ if(document.hidden) document.title=nl()?"de kat wacht nog steeds":"the cat is still waiting"; },8000); }
    else { clearTimeout(tt); if(base!=null) document.title=base; base=null; }
  });
  /* play again terwijl je al gewonnen hebt */
  const a=document.getElementById("againBtn"); let pop=null, hideT=0, typeT=0, asked=false;
  function show(t,ms,who){ who=who||"deadline";
    if(!pop){ pop=document.createElement("div"); pop.className="dl-pop"; pop.setAttribute("role","status"); document.body.appendChild(pop); }
    if(pop.dataset.who!==who){ pop.dataset.who=who; pop.classList.toggle("cat",who==="cat");
      pop.innerHTML=`<span class="dl-s">${who==="cat"?sprite("catfront",4):sprite("deadline",3)}</span><div><b>${who==="cat"?"THE CAT":"DEADLINE"}</b><span class="dl-t"></span></div>`; }
    pop.hidden=false; pop.style.animation="none"; void pop.offsetWidth; pop.style.animation="";
    const s=pop.querySelector(".dl-t"); let i=0; clearTimeout(typeT); (function ty(){ s.textContent=t.slice(0,++i); if(i<t.length) typeT=setTimeout(ty,38); })();
    clearTimeout(hideT); hideT=setTimeout(()=>{ pop.hidden=true; asked=false; },ms);
  }
  if(a) a.addEventListener("click",e=>{
    if(!hasWon()) return; e.preventDefault();
    if(!asked){ asked=true; if(window.SFX) SFX.eerie(); show(nl()?"je hebt al gewonnen. waarom doe je het opnieuw?":"you already won. why are you doing it again?",5200); return; }
    show(nl()?"...goed dan. ga maar.":"...fine. go.",1800); asked=false;
    setTimeout(()=>document.getElementById("titel").scrollIntoView({behavior:"smooth"}),1000);
  });
  /* kopiëren: de kat ziet het */
  let copyT=0;
  document.addEventListener("copy",()=>{ if(window.Ach) Ach.earn("copy"); const n=Date.now(); if(n-copyT<15000) return; copyT=n;
    show(nl()?"* heb je dat net gekopieerd? de kat zag het.":"* did you just copy that? the cat saw it.",4200,"cat"); });
  /* idle: na 60 s stilte gluurt een kat binnen vanaf een willekeurige rand */
  let lastAct=Date.now(), peeks=[], used=new Set();
  function act(){ lastAct=Date.now(); if(peeks.length) retreatAll(); }
  ["mousemove","pointerdown","keydown","wheel","scroll","touchstart"].forEach(ev=>addEventListener(ev,act,{passive:true,capture:true}));
  const OFF={bottom:"translate(-50%,100%)",top:"translate(-50%,-100%)",left:"translate(-100%,-50%)",right:"translate(100%,-50%)"};
  const IN={bottom:"translate(-50%,30%)",top:"translate(-50%,-30%)",left:"translate(-30%,-50%)",right:"translate(30%,-50%)"};
  const ROT={bottom:0,top:180,left:90,right:-90};
  const GAP=125;
  function slots(){ const hb=60, out=[], W=innerWidth, H=innerHeight;
    const nx=Math.max(1,Math.floor((W-160)/GAP)), ox=(W-(nx-1)*GAP)/2; for(let i=0;i<nx;i++){ out.push({side:"bottom",x:ox+i*GAP}); out.push({side:"top",x:ox+i*GAP}); }
    const ny=Math.max(1,Math.floor((H-hb-260)/GAP)), oy=hb+(H-hb-(ny-1)*GAP)/2; for(let i=0;i<ny;i++){ out.push({side:"left",y:oy+i*GAP}); out.push({side:"right",y:oy+i*GAP}); }
    return out; }
  const maxCats=()=>slots().length;
  function type(el,delay){ const b=el.querySelector(".peek-b"), t=nl()?"...ben je er nog?":"...are you still here?"; let i=0;
    el._t=setTimeout(function ty(){ if(!el.isConnected||el._gone) return; b.classList.add("on"); i++; b.textContent=t.slice(0,i);
      if(i<t.length) el._t=setTimeout(ty,t[i-1]==="."?650:t[i-1]===" "?320:190); },delay); }
  function spawn(){
    const all=slots(), free=all.map((s,i)=>i).filter(i=>!used.has(i)); if(!free.length) return;
    const k=free[Math.random()*free.length|0], sl=all[k]; used.add(k); const side=sl.side, first=!peeks.length;
    const el=document.createElement("div"); el.className="peek s-"+side+(first?"":" many"); el.setAttribute("aria-hidden","true");
    el.innerHTML=`<div class="peek-c" style="transform:rotate(${ROT[side]}deg)">${sprite("catfront",9)}</div><div class="peek-b"></div>`;
    if(side==="bottom"){ el.style.bottom="0"; el.style.left=sl.x+"px"; } if(side==="top"){ el.style.top="60px"; el.style.left=sl.x+"px"; }
    if(side==="left"){ el.style.left="0"; el.style.top=sl.y+"px"; } if(side==="right"){ el.style.right="0"; el.style.top=sl.y+"px"; }
    el.style.transform=OFF[side]; el._side=side; document.body.appendChild(el); peeks.push(el);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{ el.style.transform=IN[side]; }));
    if(first) type(el,4000); else { peeks.forEach(p=>p.classList.add("many")); type(el,2000); }
  }
  function retreatAll(){ const all=peeks; peeks=[]; used.clear(); all.forEach(el=>{ el._gone=true; clearTimeout(el._t); el.querySelector(".peek-b").classList.remove("on");
    el.classList.add("go"); el.style.transform=OFF[el._side]; setTimeout(()=>el.remove(),500); }); }
  setInterval(()=>{ if(document.hidden) return; const idle=Date.now()-lastAct; if(idle>60000*(peeks.length+1)&&peeks.length<maxCats()) spawn(); },1000);
  window.Peek={afk:ms=>{ lastAct-=ms; }};
  document.addEventListener("visibilitychange",()=>{ if(!document.hidden) lastAct=Date.now(); });
  /* devtools: voor wie onder de motorkap kijkt */
  try{
    const art=SPR.catfront.map(r=>r.replace(/#/g,"██").replace(/\./g,"  ")).join("\n");
    console.log("%c"+art,"font-family:monospace;line-height:1;color:#ff2b2b");
    console.log("%c* you're not supposed to be in here.","font-family:monospace;font-size:14px;font-weight:bold;color:#ff2b2b");
    console.log("%c...but since you are: hi. the cat sees you.","font-family:monospace;font-size:12px;color:#999");
  }catch(e){}
  function eyes(){ const h=new Date().getHours(); if(h>=22||h<5){ show(nl()?"* MIJN OGEN.":"* MY EYES.",3200,"cat"); if(window.Ach) Ach.earn("eyes"); } }
  function flee(){ try{ localStorage.setItem("coward","1"); }catch(e){} if(window.Ach) Ach.earn("flee"); setTimeout(()=>show(nl()?"* ...je liep weg. de kat heeft alles gezien. * nieuwe titel: LAFAARD. 🐔":"* ...you ran. the cat saw everything. * new title unlocked: COWARD. 🐔",5200,"cat"),900); }
  const toast=(t,ms)=>show(t,ms||4200,"cat");
  return {greet,fed,skip,won,hasWon,eyes,flee,toast};
})();

(function(){
  const nl=()=>document.documentElement.lang==="nl";
  /* kroontjes klaarzetten op alle katten */
  [["#sCat",2],[".title .cat",3],["#walker",3],[".end .p-cat",3]].forEach(([q,sz])=>{ const el=document.querySelector(q); if(el) el.insertAdjacentHTML("beforeend",'<i class="crown">'+sprite("crown",sz)+'</i>'+'<i class="xhat"><i class="xh-r">'+sprite("hatred",sz)+'</i><i class="xh-w">'+sprite("hatwhite",sz)+'</i></i>'); });
  /* winter: 1 december t/m 6 januari (of testen met localstorage catwinter=1) */
  { const d=new Date(), m=d.getMonth(), dd=d.getDate(); let force=false; try{ force=localStorage.getItem("catWinter")==="1"; }catch(e){}
    if(m===11||(m===0&&dd<=6)||force){ document.documentElement.classList.add("winter");
      const sec=document.getElementById("titel"); if(sec){ const sn=document.createElement("div"); sn.className="snow"; sn.setAttribute("aria-hidden","true");
        let h=""; for(let k=0;k<46;k++){ const sz=2+(k*7%3)*2; h+=`<i style="left:${(k*37+11)%100}%;width:${sz}px;height:${sz}px;animation-duration:${(6+(k*13%7)).toFixed(1)}s;animation-delay:-${(k*.9%9).toFixed(1)}s;--dx:${(k%2?1:-1)*(10+k%4*6)}px"></i>`; }
        sn.innerHTML=h; sec.appendChild(sn); } } }
  let royal=false; try{ royal=!!localStorage.getItem("catRoyal"); }catch(e){}
  const setRoyal=v=>{ royal=v; document.documentElement.classList.toggle("royal",v); try{ localStorage.setItem("catRoyal",v?"1":""); }catch(e){} };
  setRoyal(royal);
  /* konami-code: ↑ ↑ ↓ ↓ ← → ← → b a (toetsenbord of consoleknoppen) */
  const KON="up,up,down,down,left,right,left,right,b,a"; let buf=[];
  function input(k){ buf.push(k); if(buf.length>10) buf.shift(); if(buf.join()!==KON) return; buf=[];
    setRoyal(!royal);
    if(royal){ if(window.Ach) Ach.earn("royal"); Memo.toast(nl()?"* ...een kroon? voor mij? eindelijk wat respect.":"* ...a crown? for me? finally, some respect.",4500); }
    else Memo.toast(nl()?"* hé. geef dat terug.":"* hey. give that back.",3000); }
  const KM={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",b:"b",B:"b",a:"a",A:"a"};
  addEventListener("keydown",e=>{ if(["Shift","Control","Alt","Meta"].includes(e.key)) return; input(KM[e.key]||"?"); },{capture:true});
  document.querySelectorAll(".ds [data-k]").forEach(b=>b.addEventListener("click",()=>input(b.dataset.k)));
  /* titelkat: 10 keer klikken en hij loopt weg */
  const tc=document.querySelector(".title .cat");
  if(tc){ let n=0, gone=false, tt=0; const tip=document.createElement("i"); tip.className="tc-tip"; tip.hidden=true; tc.appendChild(tip);
    const L={3:["* hm?","* hm?"],6:["* stop that.","* stop daarmee."],9:["* last warning.","* laatste waarschuwing."],10:["* ok. i'm leaving.","* oké. ik ga weg."]};
    tc.addEventListener("click",()=>{ if(gone) return; n++; tc.classList.remove("poke"); void tc.offsetWidth; tc.classList.add("poke");
      const l=L[n]; if(l){ tip.textContent=nl()?l[1]:l[0]; tip.hidden=false; clearTimeout(tt); tt=setTimeout(()=>tip.hidden=true,1600); }
      if(n<10) return; gone=true; if(window.SFX&&SFX.huff) SFX.huff(); if(window.Ach) Ach.earn("love");
      setTimeout(()=>{ tip.hidden=true; if(window.Story&&!Story.has(5)){ const sec=document.getElementById("titel"), sr=sec.getBoundingClientRect(), cr=tc.getBoundingClientRect();
          const pg=document.createElement("i"); pg.className="tc-pg"; pg.title="?"; pg.innerHTML=sprite("doc",3); pg.style.left=(cr.left-sr.left+cr.width/2-12)+"px"; pg.style.bottom=(sr.bottom-cr.bottom)+"px"; sec.appendChild(pg);
          pg.addEventListener("click",()=>{ pg.remove(); Story.find(5); }); }
        const d=innerWidth-tc.getBoundingClientRect().left+40;
        tc.style.transition="none"; tc.style.transform="translateX(0px) scaleX(1)"; void tc.offsetWidth;
        tc.style.transition="transform 4s linear"; tc.style.transform=`translateX(${d}px) scaleX(1)`; if(window.SFX&&SFX.steps) SFX.steps(11);
        setTimeout(()=>{ tc.style.transition="none"; tc.style.transform=`translateX(${d}px) scaleX(-1)`; void tc.offsetWidth;
          tc.style.transition="transform 4s linear"; tc.style.transform="translateX(0px) scaleX(-1)"; if(window.SFX&&SFX.steps) SFX.steps(11);
          setTimeout(()=>{ tc.style.transition=""; tc.style.transform=""; gone=false; n=0; },4100); },20000); },1500); });
  }
  /* vuilnisbak op het eindscherm */
  const tr=document.getElementById("trashCan");
  if(tr){ const F=[["fishbone","* an old fish bone. still crunchy.","* een oude visgraat. nog krokant."],["paper","* a crumpled CV. draft 14.","* een verfrommeld cv. versie 14."],["paper","* ...DEADLINE's to-do list? it just says 'you'.","* ...de to-dolijst van DEADLINE? er staat alleen 'jij'."],["sock","* one sock. where is the other one?","* één sok. waar is de andere?"],[null,"* nothing. the cat ate it.","* niks. de kat heeft het opgegeten."]];
    let fi=0, tt=0; const tip=document.createElement("span"); tip.className="door-tip trash-tip"; tip.hidden=true; tr.parentNode.appendChild(tip);
    let pg=null;
    function dropPage(){ if(pg) return; pg=document.createElement("button"); pg.type="button"; pg.className="trash-page"; pg.setAttribute("aria-label",nl()?"Een dagboekpagina viel uit de vuilnisbak":"A diary page fell out of the trash can");
      pg.innerHTML=sprite("diarypg",4); tr.parentNode.appendChild(pg);
      setTimeout(()=>{ if(pg) pg.classList.add("landed"); },900);
      tip.textContent=nl()?"* er viel iets uit...":"* something fell out..."; tip.hidden=false; clearTimeout(tt); tt=setTimeout(()=>tip.hidden=true,3400);
      pg.addEventListener("click",e=>{ e.stopPropagation(); if(!pg) return; pg.remove(); pg=null; tip.hidden=true; Story.find(1); }); }
    tr.addEventListener("click",()=>{ if(window.Story&&!Story.has(1)&&fi===2){ fi++; tr.classList.remove("dig"); void tr.offsetWidth; tr.classList.add("dig"); if(window.SFX) SFX.rustle(); tip.hidden=true; if(window.Ach) Ach.earn("trash"); dropPage(); return; } const f=F[fi++%F.length]; tr.classList.remove("dig"); void tr.offsetWidth; tr.classList.add("dig"); if(window.SFX) SFX.rustle();
      if(f[0]){ const it=document.createElement("i"); it.className="trash-item"; it.style.setProperty("--dx",((Math.random()<.5?-1:1)*(18+Math.random()*22))+"px"); it.innerHTML=sprite(f[0],4); tr.parentNode.appendChild(it); setTimeout(()=>it.remove(),1300); }
      tip.textContent=nl()?f[2]:f[1]; tip.hidden=false; clearTimeout(tt); tt=setTimeout(()=>tip.hidden=true,3400);
      if(window.Ach) Ach.earn("trash");
      let moved=false; try{ moved=!!localStorage.getItem("catTrash"); }catch(e){}
      if(!window.tcatOut&&!moved&&Math.random()<1/30){ tip.textContent=nl()?"* ...wacht. er bewoog iets.":"* ...wait. something moved."; setTimeout(spawnTcat,700); } });
    /* de vuilniskat: schiet uit de bak, oppakken en naar de deur slepen */
    function spawnTcat(){
      if(window.tcatOut) return; window.tcatOut=true; const pr=tr.parentNode, door=document.getElementById("secretDoor");
      const c=document.createElement("i"); c.className="tcat shoot"; c.innerHTML=tcatHTML(4)+`<span class="tc-hold"><span class="tc-b">${sprite("cathold",4)}</span><span class="tc-p">${sprite("patchhold",4)}</span></span><i class="tc-say"></i>`;
      const tl=tr.offsetLeft; c.style.left=(tl+110)+"px"; c.style.bottom="0px"; pr.appendChild(c);
      const say=c.querySelector(".tc-say"); say.textContent=nl()?"* arr. wie stoort mij?":"* arr. who disturbs me?"; setTimeout(()=>say.textContent="",3000);
      setTimeout(()=>c.classList.remove("shoot"),1100);
      let held=false;
      const near=(x,y)=>{ if(!door) return false; const r=door.getBoundingClientRect(); return x>r.left-14&&x<r.right+14&&y>r.top-14&&y<r.bottom+14; };
      c.addEventListener("pointerdown",e=>{ e.preventDefault(); held=true; c.classList.add("held"); if(window.SFX) SFX.pickup(); say.textContent=""; try{ c.setPointerCapture(e.pointerId); }catch(_){} });
      c.addEventListener("pointermove",e=>{ if(!held) return; const r=pr.getBoundingClientRect();
        c.style.left=(e.clientX-r.left-32)+"px"; c.style.bottom=Math.max(0,r.bottom-e.clientY-30)+"px"; if(door) door.classList.toggle("near",near(e.clientX,e.clientY)); });
      const drop=e=>{ if(!held) return; held=false; c.classList.remove("held"); if(window.SFX) SFX.drop(); if(door) door.classList.remove("near");
        if(near(e.clientX,e.clientY)&&window.openMuseum){ c.remove(); window.tcatOut=false; openMuseum("trash"); return; }
        c.style.transition="bottom .35s steps(4)"; c.style.bottom="0px"; setTimeout(()=>c.style.transition="",400); };
      c.addEventListener("pointerup",drop); c.addEventListener("pointercancel",drop);
    }
  }
  /* zonnebloemen knippen: kopje eraf, voor altijd */
  SPR.sunhead=SPR.sunflower.slice(0,11); SPR.sunstem=SPR.sunflower.map((r,y)=>y<=10?".".repeat(r.length):r);
  const FL=[...document.querySelectorAll('.title .flowers [data-sprite="sunflower"], .end .props [data-sprite="sunflower"]')];
  let cut={}; try{ cut=JSON.parse(localStorage.getItem("catCut")||"{}")||{}; }catch(e){}
  const allCut=()=>FL.every((f,i)=>cut[i]||!f.getClientRects().length);
  /* gieter: zonnebloemen weer laten groeien */
  const can=document.getElementById("wCan"); let canFol=null;
  const anyCut=()=>Object.keys(cut).length>0;
  const canMove=e=>{ if(canFol){ canFol.style.left=(e.clientX-6)+"px"; canFol.style.top=(e.clientY-30)+"px"; } };
  const syncCan=()=>{ if(can){ can.hidden=!anyCut(); can.classList.toggle("home",!!window.canHeld); can.title=window.canHeld?(nl()?"zet terug":"put back"):"?"; } };
  setTimeout(syncCan,0);
  function dropCan(){ window.canHeld=false; if(canFol){ canFol.remove(); canFol=null; } removeEventListener("pointermove",canMove); document.documentElement.classList.remove("watering"); syncCan(); }
  if(can){ can.addEventListener("click",e=>{ e.stopPropagation(); if(window.canHeld){ dropCan(); if(window.SFX) SFX.clink(); return; } window.canHeld=true; syncCan(); document.documentElement.classList.add("watering"); if(window.SFX) SFX.clink();
      canFol=document.createElement("i"); canFol.className="can-follow"+(matchMedia("(pointer:fine)").matches?"":" fixed"); canFol.setAttribute("aria-hidden","true"); canFol.innerHTML=sprite("wcan",3);
      document.body.appendChild(canFol); canMove(e); addEventListener("pointermove",canMove);
      Memo.toast(nl()?"* water de stengels om de zonnebloemen terug te laten groeien.":"* water the stems to grow the sunflowers back.",3600); });
    addEventListener("keydown",e=>{ if(e.key==="Escape"&&window.canHeld) dropCan(); }); }
  /* ruime hitbox: de dichtstbijzijnde geknipte stengel binnen bereik */
  function nearCut(x,y){ let best=-1, bd=1e9; FL.forEach((f,i)=>{ if(!cut[i]) return; const r=f.getBoundingClientRect(); if(!r.width) return;
      const dx=Math.max(r.left-x,0,x-r.right), dy=Math.max(r.top-(y-30),0,(y-30)-r.bottom, r.top-y, 0)*0+Math.max(r.top-y,0,y-r.bottom-20); const d=Math.hypot(dx,dy);
      if(d<70&&d<bd){ bd=d; best=i; } }); return best; }
  addEventListener("pointermove",e=>{ if(!window.canHeld) return; const t=nearCut(e.clientX,e.clientY); FL.forEach((f,i)=>f.classList.toggle("target",i===t)); });
  addEventListener("click",e=>{ if(!window.canHeld||e.target.closest("#wCan")) return; const t=nearCut(e.clientX,e.clientY); if(t<0) return;
    e.preventDefault(); e.stopPropagation(); regrow(FL[t],t,+FL[t].dataset.s||4); },true);
  function regrow(f,i,sz){ f.classList.remove("target");
    delete cut[i]; try{ localStorage.setItem("catCut",JSON.stringify(cut)); }catch(e){}
    if(canFol){ canFol.classList.remove("pour"); void canFol.offsetWidth; canFol.classList.add("pour"); }
    f.innerHTML=sprite("sunflower",sz)+[0,1,2].map(k=>`<i class="sun-drop" style="left:${6+k*10}px;animation-delay:${k*.12}s">${sprite("drop",2)}</i>`).join("");
    f.classList.remove("cut"); f.classList.remove("grow"); void f.offsetWidth; f.classList.add("grow"); if(window.SFX) SFX.water();
    setTimeout(()=>f.querySelectorAll(".sun-drop").forEach(d=>d.remove()),1000);
    if(!anyCut()){ dropCan(); const tcat=document.querySelector(".title .cat");
      if(tcat){ let n=0; const hop=()=>{ tcat.classList.remove("poke"); void tcat.offsetWidth; tcat.classList.add("poke"); if(++n<4) setTimeout(hop,300); }; hop(); }
      setTimeout(()=>Memo.toast(nl()?"* ...de tuin is terug. dankjewel. ♥":"* ...the garden is back. thank you. ♥",4500),700); }
  }
  FL.forEach((f,i)=>{ const sz=+f.dataset.s||4; f.classList.add("snippable");
    if(cut[i]){ f.innerHTML=sprite("sunstem",sz); f.classList.add("cut"); }
    f.addEventListener("click",()=>{ if(window.canHeld){ if(cut[i]) regrow(f,i,sz); return; } if(cut[i]) return; cut[i]=1; try{ localStorage.setItem("catCut",JSON.stringify(cut)); }catch(e){}
      f.innerHTML=sprite("sunstem",sz)+'<i class="sun-head">'+sprite("sunhead",sz)+'</i>'; f.classList.add("cut"); if(window.SFX) SFX.snip();
      setTimeout(()=>{ const h=f.querySelector(".sun-head"); if(h) h.remove(); },1300);
      syncCan(); if(allCut()&&window.Ach&&!Ach.has("snip")){ Ach.earn("snip"); setTimeout(()=>Memo.toast(nl()?"* ...de tuin is weg. ben je nu blij?":"* ...the garden is gone. are you happy now?",4500),1400); } });
  });
  /* groot scherm voor cat-tale en pet the cat */
  const scr=document.getElementById("screen"), lidEl=document.getElementById("lid"), dsw=document.getElementById("dsWrap"), gcv=document.getElementById("gameCv");
  if(scr&&lidEl&&dsw){
    const fsb=document.createElement("button"); fsb.type="button"; fsb.className="fs-btn"; fsb.setAttribute("aria-label","Bigger screen"); fsb.title="bigger screen"; fsb.innerHTML="<i></i>"; scr.parentNode.appendChild(fsb);
    const bg=document.createElement("div"); bg.className="big-bg"; bg.hidden=true; lidEl.appendChild(bg);
    const isBig=()=>scr.classList.contains("big");
    function setBig(v){ scr.classList.toggle("big",v); ds.classList.toggle("bigmode",v); dsw.classList.toggle("bigwrap",v); bg.hidden=!v;
      fsb.setAttribute("aria-label",v?"Smaller screen":"Bigger screen"); fsb.title=v?"smaller screen":"bigger screen"; ds.focus({preventScroll:true}); }
    fsb.addEventListener("click",e=>{ e.stopPropagation(); setBig(!isBig()); });
    bg.addEventListener("click",e=>{ e.stopPropagation(); setBig(false); });
    new MutationObserver(()=>{ fsb.classList.toggle("on",scr.classList.contains("game")); if(isBig()&&!scr.classList.contains("game")) setBig(false); }).observe(scr,{attributes:true,attributeFilter:["class"]});
    addEventListener("keydown",e=>{ if(e.key==="Escape"&&isBig()) setBig(false); });
    /* in het grote scherm: sleep over het scherm om de kat te sturen (handig op gsm) */
    let st=false, sx=0, sy=0;
    gcv.addEventListener("pointerdown",e=>{ if(!isBig()||!Game.active) return; st=true; sx=e.clientX; sy=e.clientY; try{ gcv.setPointerCapture(e.pointerId); }catch(_){} });
    gcv.addEventListener("pointermove",e=>{ if(!st) return; let dx=(e.clientX-sx)/40, dy=(e.clientY-sy)/40; const d=Math.hypot(dx,dy); if(d>1){ dx/=d; dy/=d; } Game.stick(dx,dy); });
    ["pointerup","pointercancel"].forEach(ev=>gcv.addEventListener(ev,()=>{ if(st){ st=false; Game.stick(0,0); } }));
  }
  /* pootafdrukken op de missiekaart */
  const mapEl=document.getElementById("map"), wk=document.getElementById("walker");
  window.pawTrail=(from,to)=>{ if(!mapEl||!wk) return; const dist=Math.abs(to-from), n=Math.floor(dist/26); if(n<1) return;
    const dir=to>from?1:-1, y=wk.offsetTop+wk.offsetHeight-8;
    for(let k=0;k<n;k++){ const x=from+dir*(k*26+13)+40-5;
      setTimeout(()=>{ const pw=document.createElement("i"); pw.className="paw"; pw.innerHTML=sprite("paw",2);
        pw.style.left=x+"px"; pw.style.top=(y+(k%2?4:-2))+"px"; mapEl.appendChild(pw); setTimeout(()=>pw.remove(),3200); },(k+.5)/n*900); } };
  /* favicon: pixelkat, slapend als je wegklikt */
  function icon(name,ox,oy){ const m=SPR[name], c=document.createElement("canvas"); c.width=c.height=32; const g=c.getContext("2d");
    const dot=(col,dx,dy)=>{ g.fillStyle=col; m.forEach((row,y)=>{ for(let x=0;x<row.length;x++) if(row[x]==="#") g.fillRect((ox+x)*2+dx,(oy+y)*2+dy,2,2); }); };
    [[2,0],[-2,0],[0,2],[0,-2]].forEach(([a,b])=>dot("#fff",a,b)); dot("#000",0,0); return c.toDataURL("image/png"); }
  let fav=document.querySelector('link[rel~="icon"]'); if(!fav){ fav=document.createElement("link"); fav.rel="icon"; document.head.appendChild(fav); }
  const AWAKE=icon("catA",2,1), SLEEP=icon("catsleep",0,1); fav.type="image/png"; fav.href=AWAKE;
  document.addEventListener("visibilitychange",()=>{ fav.href=document.hidden?SLEEP:AWAKE; });
  /* het verhaal: the forgotten mascot */
  window.Story=(function(){
    const L=(en,n)=>nl()?n:en;
    const get=k=>{ try{ return localStorage.getItem(k); }catch(e){ return null; } }, put=(k,v)=>{ try{ localStorage.setItem(k,v); }catch(e){} };
    let pages=[]; try{ pages=JSON.parse(get("catPages")||"[]"); }catch(e){}
    const has=n=>pages.includes(n), count=()=>pages.length, ending=()=>get("catEnding");
    const PAGES={
      1:["i was a mascot once. a student made me in 2002. she called me PIXEL. i lived on her portfolio, right next to the start button.","ik was ooit een mascotte. een student maakte me in 2002. ze noemde me PIXEL. ik woonde op haar portfolio, vlak naast de startknop."],
      2:["i had a best friend. a small cat with an eyepatch. we called him CAPTAIN. together we guarded her projects.","ik had een beste vriend. een kleine kat met een ooglapje. we noemden hem CAPTAIN. samen bewaakten we haar projecten."],
      3:["then she graduated. one night DEADLINE came. the site went offline. the lights went out. CAPTAIN was deleted. i stayed behind in the dark.","toen studeerde ze af. op een nacht kwam DEADLINE. de site ging offline. de lichten gingen uit. CAPTAIN werd gewist. ik bleef achter in het donker."],
      4:["it was so quiet. so i started collecting cats from forgotten websites. if they are with me, nobody is forgotten. not completely.","het was zo stil. dus begon ik katten te verzamelen van vergeten websites. als ze bij mij zijn, is niemand vergeten. niet helemaal."],
      5:["there is a new student now. she has a black cat. she will graduate too. and then her cat will be alone. like me. i have to find it first.","er is nu een nieuwe student. ze heeft een zwarte kat. zij studeert ook af. en dan is haar kat alleen. zoals ik. ik moet hem eerst vinden."]};
    function bossC(sz){ return `<span class="bossc"><span class="b">${sprite("bosscat",sz)}</span><span class="w">${sprite("bossshirt",sz)}</span><span class="w ey">${sprite("bosseyes",sz)}</span><span class="t">${sprite("bosstie",sz)}</span><span class="cv">${sprite("bosscover",sz)}</span><span class="w xx">${sprite("bossxx",sz)}</span></span>`; }
    function typer(el,t,sp,done){ let i=0; const iv=setInterval(()=>{ if(!el.isConnected){ clearInterval(iv); return; } if(el.closest(".paused")) return; el.textContent=t.slice(0,++i); if(i>=t.length){ clearInterval(iv); if(done) done(); } },sp||30); return iv; }
    /* een gevonden pagina tonen */
    function find(n,auto){
      const isNew=!has(n); if(!isNew&&auto) return;
      if(isNew){ pages.push(n); pages.sort(); put("catPages",JSON.stringify(pages)); }
      const all=isNew&&count()===5;
      const o=document.createElement("div"); o.className="page-pop"; o.setAttribute("role","dialog"); o.setAttribute("aria-label","Diary page");
      o.innerHTML=`<div class="pg-card"><div class="pg-top"><b>${L("DIARY PAGE","DAGBOEKPAGINA")} ${n}</b><em>${count()}/5 ${L("found","gevonden")}</em></div><p class="pg-txt"></p><p class="pg-more"></p><button type="button" class="btn pg-x pg-read" disabled>${L("CLOSE","SLUITEN")} &#10005;</button></div>`;
      document.body.appendChild(o); const x=o.querySelector(".pg-x");
      let ok=false; const ready=()=>setTimeout(()=>{ if(!o.isConnected) return; ok=true; x.disabled=false; x.classList.add("rdy"); x.focus({preventScroll:true}); },700);
      const close=()=>{ if(ok&&o.isConnected) o.remove(); }; x.addEventListener("click",close);
      addEventListener("keydown",function k(e){ if(!o.isConnected){ removeEventListener("keydown",k); return; } if(e.key==="Escape"&&ok){ close(); removeEventListener("keydown",k); } });
      typer(o.querySelector(".pg-txt"),"* "+PAGES[n][nl()?1:0],38,()=>{ if(all) typer(o.querySelector(".pg-more"),L("* ...a door creaks open somewhere in the museum.","* ...ergens in het museum kraakt een deur open."),38,ready); else ready(); });
      if(all&&window.Ach) Ach.earn("archivist");
    }
    /* het dagboek: alle gevonden pagina's teruglezen */
    const HINTS={1:["* it smells like old fish where this page fell.","* waar deze pagina viel, ruikt het naar oude vis."],
      2:["* stuck between the lines of someone's private log.","* vast tussen de regels van iemands privélogboek."],
      3:["* lost somewhere you lose a fight.","* verloren op een plek waar je een gevecht verliest."],
      4:["* hidden behind a reflection.","* verstopt achter een spiegelbeeld."],
      5:["* left behind by a cat who got annoyed.","* achtergelaten door een kat die het beu was."]};
    const label=()=>L("DIARY","DAGBOEK")+" "+count()+"/5";
    function diary(){
      const o=document.createElement("div"); o.className="page-pop"; o.setAttribute("role","dialog"); o.setAttribute("aria-label","Diary");
      o.innerHTML=`<div class="pg-card dg-card"><div class="pg-top"><b>${L("PIXEL'S DIARY","PIXELS DAGBOEK")}</b><em>${count()}/5 ${L("found","gevonden")}</em></div>
        ${[1,2,3,4,5].map(n=>has(n)?`<div class="dg-pg"><b>${L("PAGE","PAGINA")} ${n}</b><p>* ${PAGES[n][nl()?1:0]}</p></div>`:`<div class="dg-pg miss"><b>${L("PAGE","PAGINA")} ${n} · ???</b><p>${HINTS[n][nl()?1:0]}</p></div>`).join("")}
        <button type="button" class="btn pg-x">${L("CLOSE","SLUITEN")} &#10005;</button></div>`;
      document.body.appendChild(o); const x=o.querySelector(".pg-x"); x.focus({preventScroll:true});
      const close=()=>{ if(o.isConnected) o.remove(); }; x.addEventListener("click",close);
      addEventListener("keydown",function k(e){ if(e.key==="Escape"){ e.stopImmediatePropagation(); close(); removeEventListener("keydown",k,true); } },true);
    }
    /* de achterkamer met de keuze */
    function room(mu){
      if(!mu||mu.querySelector(".mu-room")) return; const en=ending();
      const r=document.createElement("div"); r.className="mu-room";
      r.innerHTML=`<div class="rm-in"><div class="rm-site"><div class="rm-bar">PIXEL'S HOME · est. 2002</div>
        <div class="rm-marq"><span>~*~ welcome to my homepage!!! ~*~ sign my guestbook ~*~ best viewed in 800x600 ~*~</span></div>
        <div class="rm-mid"><div class="rm-pix">${en==="free"?"":bossC(4)}</div><div class="rm-side"><i class="rm-uc">UNDER CONSTRUCTION</i><i class="rm-cnt">VISITORS: 000042</i><i class="rm-cap">${tcatHTML(3)}</i></div></div></div>
        <div class="mu-box rm-box"><p></p><p></p><p></p></div>
        <div class="rm-choice" hidden><button type="button" class="btn rm-stay">${L("STAY A WHILE","BLIJF EVEN")} &#9829;</button><button type="button" class="btn rm-free">${L("FREE THE CATS","LAAT DE KATTEN VRIJ")} &#9654;</button></div>
        <button type="button" class="btn rm-back">&#9664; ${L("BACK","TERUG")}</button></div>`;
      mu.appendChild(r); r.querySelector(".rm-back").addEventListener("click",()=>r.remove()); r.querySelector(".rm-back").focus({preventScroll:true});
      if(!hasCaptain()||en==="free") r.querySelector(".rm-cap").remove();
      const ps=[...r.querySelectorAll(".rm-box p")];
      const say=(lines,done)=>{ ps.forEach(p=>p.textContent=""); let k=0; (function nx(){ if(k>=lines.length){ if(done) setTimeout(done,900); return; } typer(ps[k],lines[k],38,()=>{ k++; setTimeout(nx,450); }); })(); };
      const gift=(direct)=>{ if(!r.isConnected||r.querySelector(".rm-gift")) return; const g=document.createElement("div"); g.className="rm-gift";
        r.querySelector(".rm-box").insertAdjacentElement("afterend",g);
        const showPhoto=()=>{ g.innerHTML='<p class="rm-gift-t"></p>'+family(); const t=g.querySelector(".rm-gift-t"); requestAnimationFrame(()=>g.classList.add("show"));
          const fr=ending()==="free";
          typer(t,direct?(fr?L("* (the photo stayed behind. they took a copy with them.)","* (de foto bleef achter. ze namen een kopie mee.)"):L("* our photo. i look at it every day.","* onze foto. ik kijk er elke dag naar.")):L("* ...that's me. falling. ...it's perfect.","* ...dat ben ik. vallend. ...hij is perfect."),38,()=>{ if(!direct&&fr) setTimeout(()=>{ if(!r.isConnected) return; r.classList.add("rm-gone"); typer(t,L("* ...let's take it with us. bye! ♥","* ...die nemen we mee. daag! ♥"),38); },1500); }); };
        if(direct){ showPhoto(); return; }
        const grp=[["catfront",2],["cat",2],["catback",2],["phcat",2]].map(([n,z])=>`<span class="fam-c">${sprite(n,z)}</span>`).join("")+`<span class="fam-c">${tcatHTML(2)}</span><span class="ph-gap"></span><span class="fam-c">${sprite("blackcat",2)}</span><span class="fam-c">${sprite("catcry",2)}</span>`;
        g.innerHTML=`<p class="rm-gift-t"></p><div class="ph-set"><button type="button" class="ph-cam" aria-label="Take the photo">${sprite("camera",4)}<i class="ph-led"></i></button><i class="ph-hint" hidden>&#9664; ${L("CLICK THE CAMERA","KLIK OP DE CAMERA")}</i>
          <i class="ph-count"></i><div class="ph-grp fam-row">${grp}</div><span class="ph-pix">${bossC(2)}</span><i class="ph-floor"></i><i class="ph-flash"></i></div>`;
        const t=g.querySelector(".rm-gift-t"), cam=g.querySelector(".ph-cam"), cnt=g.querySelector(".ph-count"), pix=g.querySelector(".ph-pix"), set=g.querySelector(".ph-set");
        typer(t,L("* ...wait. let's take a picture. all of us. together.","* ...wacht. laten we een foto maken. wij allemaal. samen."),38,()=>{ g.querySelector(".ph-hint").hidden=false; cam.classList.add("ready"); cam.focus({preventScroll:true}); });
        cam.addEventListener("click",()=>{ if(!cam.classList.contains("ready")) return; cam.classList.remove("ready"); g.querySelector(".ph-hint").hidden=true; set.classList.add("timer");
          t.textContent=""; typer(t,L("* oh no. the timer. wait for me!!","* oh nee. de timer. wacht op mij!!"),38);
          ["3","2","1"].forEach((n,k)=>setTimeout(()=>{ cnt.textContent=n; cnt.classList.remove("pop"); void cnt.offsetWidth; cnt.classList.add("pop"); },k*800));
          setTimeout(()=>pix.classList.add("run"),300);
          setTimeout(()=>{ cnt.textContent="SNAP!"; set.classList.add("flash"); },2400);
          setTimeout(showPhoto,3400); });
      };
      const last=(direct)=>{ ps.forEach(p=>p.textContent=""); ps[0].classList.add("rm-last"); typer(ps[0],L("* every project ends. not every project is forgotten.","* elk project eindigt. niet elk project wordt vergeten."),45,()=>setTimeout(()=>gift(direct),1600)); };
      if(en){ say(en==="stay"?[L("* you're here again.","* je bent er weer."),L("* the lights stay on now. because of you.","* de lichten blijven nu aan. dankzij jou.")]:[L("* (nobody's here anymore.)","* (er is hier niemand meer.)"),L("* (someone left the lights on. and a note: 'gone exploring.')","* (iemand liet de lichten aan. en een briefje: 'op avontuur.')")],()=>last(true)); return; }
      say([L("* this was my home.","* dit was mijn thuis."),L("* a student made it in 2002. CAPTAIN and i guarded her projects.","* een student maakte het in 2002. CAPTAIN en ik bewaakten haar projecten."),L("* then she graduated. and DEADLINE turned off the lights.","* toen studeerde ze af. en DEADLINE deed de lichten uit.")],()=>
        say([L("* now there is a new student. with a black cat.","* nu is er een nieuwe student. met een zwarte kat."),L("* she will graduate too. and then her cat will be alone.","* zij studeert ook af. en dan is haar kat alleen."),L("* ...will you remember me?","* ...zal jij mij onthouden?")],()=>{
          const ch=r.querySelector(".rm-choice"); ch.hidden=false; ch.querySelector("button").focus({preventScroll:true});
          const pick=v=>{ ch.hidden=true; put("catEnding",v); setTimeout(crew,0); { const hn=mu.querySelector(".mu-hint"); if(hn&&!mu.querySelector(".fam")) hn.insertAdjacentHTML("beforebegin",family()); } { const d=new Date(); put("catEndDate",String(d.getDate()).padStart(2,"0")+"/"+String(d.getMonth()+1).padStart(2,"0")+"/"+d.getFullYear()); }
            const pl=mu.querySelector(".mu-plate"); if(pl) pl.textContent="PIXEL"; const fb=document.querySelector('#filters [aria-pressed="true"]'); if(fb) fb.click(); if(window.Ach) Ach.earn("story"); postCredits(); wall(mu,v);
            if(v==="stay") say([L("* ...","* ..."),L("* ...thank you.","* ...dankjewel."),L("* i think i can stop collecting now.","* ik denk dat ik nu kan stoppen met verzamelen.")],last);
            else { r.classList.add("rm-freeing"); say([L("* ...you're right.","* ...je hebt gelijk."),L("* they deserve to be remembered somewhere else.","* ze verdienen het om ergens anders herinnerd te worden."),L("* go. all of you.","* ga maar. allemaal.")],()=>
              say([L("* ...wait. if they can go...","* ...wacht. als zij mogen gaan..."),L("* ...can i go too?","* ...mag ik dan ook gaan?"),L("* CAPTAIN. let's go exploring. ♥","* CAPTAIN. kom, we gaan op avontuur. ♥")],last)); } };
          ch.querySelector(".rm-stay").addEventListener("click",()=>pick("stay")); ch.querySelector(".rm-free").addEventListener("click",()=>pick("free"));
        }));
    }
    const hasCaptain=()=>!!get("catTrash");
    /* de museummuur aanpassen na de keuze */
    function wall(mu,v){ const w=mu.querySelector(".mu-wall"); if(!w) return; const fr=[...w.querySelectorAll(".mu-fr")];
      if(v==="free"){ const sg=mu.querySelector(".mu-sign"); if(sg) sg.textContent="CAT MUSEUM · CLOSED"; const bs=mu.querySelector(".mu-boss"); if(bs){ bs.insertAdjacentHTML("afterend",letterBtn()); bs.remove(); const pl=mu.querySelector(".mu-plate"); if(pl) pl.remove(); mu.querySelector(".mu-letter").addEventListener("click",letter); } }
      if(v==="free") fr.filter((f,i)=>i<5||/^CAPTAIN/.test(f.dataset.k||"")).forEach((f,i)=>setTimeout(()=>{ const pc=f.querySelector(".mu-pic"); pc.classList.add("empty"); pc.innerHTML="?"; f.dataset.k="FREE"; f.querySelector("figcaption").textContent="FREE"; },i*400));
      else { const last=fr[fr.length-1]; last.insertAdjacentHTML("beforebegin",`<figure class="mu-fr" data-k="PIXEL"><div class="mu-pic pix-pic acq">${bossC(2)}</div><figcaption>PIXEL</figcaption></figure>`); } }
    /* post-credits op het titelscherm */
    let pcI=0;
    function postCredits(){ const sec=document.getElementById("titel"), en=ending(); if(!sec||!en) return; sec.querySelectorAll(".pc-boss").forEach(e=>e.remove()); clearInterval(pcI);
      if(en==="stay"){ const b=document.createElement("span"); b.className="deco pc-boss"; b.setAttribute("aria-hidden","true"); b.innerHTML=bossC(2)+'<i class="pc-say"></i>'; sec.appendChild(b);
        const LINES=[["* hehe. you remembered me. ♥","* hihi. je hebt me onthouden. ♥"],["* >.< that tickles!","* >.< dat kietelt!"],["* thank you for staying.","* bedankt dat je bleef."],["* i'm not lonely anymore.","* ik ben niet meer eenzaam."]];
        let li=0; const say=()=>{ b.querySelector(".pc-say").textContent=LINES[li++%LINES.length][nl()?1:0]; };
        b.addEventListener("mouseenter",say); b.addEventListener("click",()=>{ say(); b.classList.add("hov"); clearTimeout(b._t); b._t=setTimeout(()=>b.classList.remove("hov"),2500); }); }
      else { const walk=()=>{ const P=[[sprite("cat",3),0],[sprite("catA",3),1],[sprite("phcat",3),1],[tcatHTML(3),1],[bossC(2),0]];
          P.forEach(([h,fl],k)=>setTimeout(()=>{ const c=document.createElement("i"); c.className="pc-walk"+(fl?" pc-flip":"")+(k===P.length-1?" pc-px":""); c.setAttribute("aria-hidden","true"); c.innerHTML=h; sec.appendChild(c); setTimeout(()=>c.remove(),14500); },k*1300)); };
        setTimeout(walk,2500); pcI=setInterval(walk,26000); } }
    postCredits();
    /* eindscherm: na het verhaal (of de film) springt de hele bende mee */
    function crew(){ const pt=document.querySelector(".end .party"); if(!pt||pt.classList.contains("crew")||!(ending()||get("catMovie"))) return; pt.classList.add("crew");
      const me=pt.querySelector(".p-me"), bk=pt.querySelector(".p-cat"); let d=0; const mk=h=>{ const e=document.createElement("span"); e.className="p-crew"; e.style.animationDelay=(-(d+=.17)).toFixed(2)+"s"; e.innerHTML=h; return e; };
      [sprite("catfront",3),sprite("cat",3),sprite("catback",3)].forEach(h=>pt.insertBefore(mk(h),me));
      [tcatHTML(3),bossC(3),sprite("phcat",3),sprite("catcry",3)].reverse().forEach(h=>bk.insertAdjacentElement("afterend",mk(h))); }
    crew();
    /* de film: voor wie niet wil gamen */
    const SC=[
      {v:()=>`<div class="mv-site"><div class="mv-bar">PIXEL'S HOME · 2002</div><div class="mv-marq"><span>~*~ welcome to my homepage!!! ~*~ sign my guestbook ~*~</span></div><i class="mv-uc">UNDER CONSTRUCTION</i><i class="mv-cnt">VISITORS: 000042</i></div>
          <i class="mv-a" style="left:70px;top:66px">${bossC(3)}</i><i class="mv-a mv-bob" style="left:136px;top:108px">${tcatHTML(2)}</i><i class="mv-a mv-pop" style="left:122px;top:72px;animation-delay:1.2s">${sprite("heart",2)}</i>`,
       c:[["* 2002. a student built her portfolio.","* 2002. een student bouwde haar portfolio."],["* its mascot was a cat called PIXEL. his best friend was CAPTAIN.","* de mascotte was een kat die PIXEL heette. zijn beste vriend was CAPTAIN."]]},
      {v:()=>`<div class="mv-site"><div class="mv-bar">PIXEL'S HOME · 2002</div><i class="mv-cnt">VISITORS: 000042</i></div>
          <i class="mv-a" style="left:70px;top:66px">${bossC(3)}</i><i class="mv-a mv-fade" style="left:136px;top:108px">${tcatHTML(2)}</i>
          <i class="mv-a mv-dl">${sprite("deadline",4)}</i><i class="mv-off"><b>SITE OFFLINE</b></i>`,
       c:[["* then the student graduated.","* toen studeerde de student af."],["* DEADLINE came. the site went offline. CAPTAIN was deleted.","* DEADLINE kwam. de site ging offline. CAPTAIN werd gewist."]]},
      {v:()=>`<i class="mv-spot"></i><i class="mv-a" style="left:144px;top:113px">${bossC(2)}</i>${[["catfront",17,20],["cat",77,12],["catback",138,8],["phcat",198,12],["catcry",259,20]].map(([sp,x,y],k)=>`<i class="mv-fr" style="left:${x}px;top:${y}px;animation-delay:${(1.5+k*.7).toFixed(1)}s">${sprite(sp,2)}</i>`).join("")}`,
       c:[["* PIXEL stayed behind. alone. in the dark.","* PIXEL bleef achter. alleen. in het donker."],["* so he collected cats from forgotten websites. so nobody would be forgotten.","* dus verzamelde hij katten van vergeten websites. zodat niemand vergeten werd."]]},
      {v:()=>`<i class="mv-a mv-shake" style="left:56px;bottom:12px">${sprite("trash",5)}</i><i class="mv-a" style="left:210px;top:70px">${bossC(3)}</i>
          <i class="mv-a mv-shoot" style="left:150px;bottom:12px">${tcatHTML(3)}</i><i class="mv-a mv-pop" style="left:186px;top:50px;animation-delay:3s">${sprite("heart",3)}</i><i class="mv-floor"></i>`,
       c:[["* years later, someone dug through the recycle bin...","* jaren later groef iemand door de prullenbak..."],["* \"...CAPTAIN? is that really you?\"","* \"...CAPTAIN? ben jij het echt?\""]]},
      {v:()=>`<i class="mv-a" style="left:34px;top:70px">${bossC(3)}</i><i class="mv-q">?</i><i class="mv-a mv-cat" style="left:212px;bottom:12px">${sprite("blackcat",4)}</i><i class="mv-floor"></i>`,
       c:[["* now there is a new student. she has a black cat.","* nu is er een nieuwe student. ze heeft een zwarte kat."],["* she will graduate too. PIXEL is afraid her cat will be alone. like he was.","* zij studeert ook af. PIXEL is bang dat haar kat alleen zal zijn. zoals hij."]]},
      {v:()=>`<i class="mv-split"></i><i class="mv-lbl" style="left:0;width:159px">STAY A WHILE</i><i class="mv-lbl" style="left:161px;width:159px">FREE THE CATS</i>
          <i class="mv-a" style="left:58px;top:70px">${bossC(2)}</i><i class="mv-a mv-pop" style="left:70px;top:48px;animation-delay:1s">${sprite("heart",3)}</i><i class="mv-nf">NOT FORGOTTEN</i>
          <i class="mv-a" style="right:14px;bottom:12px;color:var(--ink)">${curtainDoor(3)}</i>${[0,1,2].map(k=>`<i class="mv-walk" style="animation-delay:${k*1.3}s">${sprite("cat",2)}</i>`).join("")}<i class="mv-walk mv-wpx" style="animation-delay:3.9s">${bossC(1)}</i><i class="mv-floor"></i>`,
       c:[["* \"...will you remember me?\"","* \"...zal jij mij onthouden?\""],["* stay, and PIXEL is never alone again. or free them all, PIXEL included.","* blijf, en PIXEL is nooit meer alleen. of laat ze allemaal vrij, PIXEL ook."]]},
      {v:()=>`<i class="mv-a" style="left:14px;bottom:12px;color:var(--ink)">${sprite("camera",3)}</i><i class="mv-led"></i>
          <i class="mv-c3">3</i><i class="mv-c3 c2">2</i><i class="mv-c3 c1">1</i>
          <i class="mv-grp">${[["catfront",2],["cat",2],["catback",2]].map(([n,z])=>`<span class="mv-cat">${sprite(n,z)}</span>`).join("")}<span>${tcatHTML(2)}</span><span class="mv-gap"></span><span class="mv-cat">${sprite("blackcat",2)}</span><span class="mv-cat">${sprite("phcat",2)}</span><span class="mv-cat">${sprite("catcry",2)}</span></i>
          <i class="mv-a mv-trip" style="left:56px;bottom:12px">${bossC(2)}</i><i class="mv-floor"></i><i class="mv-flash"></i><i class="mv-pback"></i><i class="mv-photo">${family()}</i>`,
       c:[["* one last thing: a photo. all of them, together.","* nog één ding: een foto. allemaal samen."],["* the timer was too fast. PIXEL tripped. it became his favourite picture.","* de timer was te snel. PIXEL struikelde. het werd zijn lievelingsfoto."]]},
      {v:()=>`${[[30,20],[80,50],[150,16],[230,40],[280,24],[110,30]].map(([x,y],k)=>`<i class="mv-a mv-tw" style="left:${x}px;top:${y}px;animation-delay:${-k*.3}s">${sprite("star",2)}</i>`).join("")}
          <i class="mv-a" style="left:104px;bottom:12px">${bossC(2)}</i><i class="mv-a mv-cat" style="left:150px;bottom:12px">${sprite("blackcat",2)}</i><i class="mv-a" style="left:190px;bottom:12px">${tcatHTML(2)}</i><i class="mv-floor"></i>
          <i class="mv-end">a portfolio game by<br><b>QUYNH HUONG VU</b></i>`,
       c:[["* every project ends.","* elk project eindigt."],["* not every project is forgotten.","* niet elk project wordt vergeten."]]}];
    function movie(){
      if(document.querySelector(".movie")) return; let k=0, adv=0;
      const o=document.createElement("div"); o.className="movie"; o.setAttribute("role","dialog"); o.setAttribute("aria-label","The story");
      o.innerHTML=`<div class="mv-wrap"><div class="mv-stage"></div></div><div class="mv-cap"><p></p><p></p></div>
        <div class="mv-ctl"><button type="button" class="mv-prev" aria-label="Previous scene">&#9664;&#9664;</button><button type="button" class="mv-pause" aria-label="Pause">&#10074;&#10074;</button><button type="button" class="mv-next" aria-label="Next scene">&#9654;&#9654;</button><b class="mv-n"></b><button type="button" class="mv-x" aria-label="Close">&#10005;</button></div>`;
      document.body.appendChild(o); document.documentElement.style.overflow="hidden";
      const st=o.querySelector(".mv-stage"), wr=o.querySelector(".mv-wrap"), ps=[...o.querySelectorAll(".mv-cap p")];
      const fit=()=>{ const s=Math.max(1,Math.min((innerWidth*.92)/320,(innerHeight-210)/180,3.4)); st.style.transform=`scale(${s})`; wr.style.width=320*s+"px"; wr.style.height=180*s+"px"; };
      fit(); addEventListener("resize",fit);
      let ivs=[], tms=[], tok=0, ready=false;
      const cap=o.querySelector(".mv-cap"); cap.insertAdjacentHTML("beforeend",'<b class="mv-more" hidden>&#9654;&#9654;</b>');
      const more=cap.querySelector(".mv-more");
      function stopAll(){ ivs.forEach(clearInterval); tms.forEach(clearTimeout); ivs=[]; tms=[]; }
      function finished(){ ready=true; more.hidden=false; more.innerHTML=k<SC.length-1?"&#9654;&#9654;":"THE END"; }
      function show(i){ stopAll(); tok++; const my=tok; ready=false; more.hidden=true;
        k=Math.max(0,Math.min(SC.length-1,i)); const sc=SC[k];
        st.innerHTML=sc.v(); o.querySelector(".mv-n").textContent=(k+1)+"/"+SC.length; ps.forEach(p=>p.textContent="");
        if(k===SC.length-1){ if(window.Ach) Ach.earn("movie"); put("catMovie","1"); crew(); }
        let j=0; (function nx(){ if(my!==tok) return; if(j>=sc.c.length){ finished(); return; }
          ivs.push(typer(ps[j],sc.c[j][nl()?1:0],58,()=>{ if(my!==tok) return; j++; tms.push(setTimeout(nx,700)); })); })(); }
      /* klik: tekst meteen afmaken, of naar de volgende scène */
      function advance(){ if(o.classList.contains("paused")) return;
        if(!ready){ stopAll(); tok++; const sc=SC[k]; sc.c.forEach((l,j)=>{ ps[j].textContent=l[nl()?1:0]; }); finished(); return; }
        if(k<SC.length-1) show(k+1); }
      cap.addEventListener("click",advance); st.addEventListener("click",advance);
      const close=()=>{ stopAll(); tok++; removeEventListener("resize",fit); o.remove(); document.documentElement.style.overflow=""; };
      o.querySelector(".mv-x").addEventListener("click",close);
      o.querySelector(".mv-next").addEventListener("click",()=>show(k+1)); o.querySelector(".mv-prev").addEventListener("click",()=>show(k-1));
      const pb=o.querySelector(".mv-pause"); pb.addEventListener("click",()=>{ const p=o.classList.toggle("paused"); pb.innerHTML=p?"&#9654;":"&#10074;&#10074;"; pb.setAttribute("aria-label",p?"Play":"Pause"); });
      addEventListener("keydown",function kd(e){ if(!o.isConnected){ removeEventListener("keydown",kd); return; } if(e.key==="Escape") close(); else if(e.key==="ArrowRight"||e.key==="Enter"){ e.preventDefault(); advance(); } else if(e.key==="ArrowLeft") show(k-1); else if(e.key===" "){ e.preventDefault(); pb.click(); } });
      o.querySelector(".mv-x").focus({preventScroll:true}); show(0);
    }
    /* spoilerwaarschuwing vóór de film (overslaan als je het verhaal al uitspeelde) */
    function askMovie(){
      if(ending()){ movie(); return; }
      const o=document.createElement("div"); o.className="page-pop"; o.setAttribute("role","dialog"); o.setAttribute("aria-label","Spoiler alert");
      o.innerHTML=`<div class="pg-card sp-card"><div class="pg-top"><b>&#9888; ${L("SPOILER ALERT","SPOILERALARM")}</b></div>
        <p class="pg-txt">${L("* this movie shows the whole secret museum story, ending included.","* deze film toont het hele geheime museumverhaal, inclusief het einde.")}</p>
        <p class="pg-txt">${L("* watch it now, or uncover the story yourself by playing first?","* nu kijken, of eerst zelf spelen en het verhaal ontdekken?")}</p>
        <div class="sp-btns"><button type="button" class="btn sp-no">${L("I'LL PLAY FIRST","EERST SPELEN")}</button><button type="button" class="btn sp-yes">${L("WATCH IT NOW","NU KIJKEN")} &#9654;</button></div></div>`;
      document.body.appendChild(o); const no=o.querySelector(".sp-no"); no.focus({preventScroll:true});
      const close=()=>{ if(o.isConnected) o.remove(); };
      no.addEventListener("click",close);
      o.querySelector(".sp-yes").addEventListener("click",()=>{ close(); movie(); });
      addEventListener("keydown",function k(e){ if(e.key==="Escape"){ close(); removeEventListener("keydown",k); } });
    }
    const mb=document.getElementById("movieBtn"); if(mb) mb.addEventListener("click",askMovie);
    /* pagina 2 (geheim logboek) en pagina 4 (achter de spiegel) */
    const tlog=document.getElementById("tl"); if(tlog) tlog.addEventListener("click",e=>{ if(e.target.closest(".ev.secret")) find(2); });
    const ds2=document.getElementById("dShot"); if(ds2) ds2.addEventListener("click",e=>{ if(e.target.closest(".mr-mirror")&&ds2.classList.contains("reveal")) find(4); });
    function family(){
      const cats=[["catfront",3],["cat",3],["catback",3],["phcat",3],["catcry",3]].map(([n,z])=>`<span class="fam-c">${sprite(n,z)}</span>`);
      const mid=`<span class="fam-pixel fell"><i class="fam-star">&#10022;</i>${bossC(3)}</span>`, cap=`<span class="fam-c">${tcatHTML(3)}</span>`, bk=`<span class="fam-c">${sprite("blackcat",3)}</span>`;
      return `<figure class="fam"><div class="fam-pic"><i class="fam-hearts">&#9829; &#9829; &#9829;</i><div class="fam-row">${cats[0]}${cats[1]}${cats[2]}${cap}${mid}${bk}${cats[3]}${cats[4]}</div></div><div class="easel" aria-hidden="true"><i class="es-tray"></i><b class="l1"></b><b class="l2"></b><b class="l3"></b></div><figcaption>TOGETHER · FOR PIXEL</figcaption></figure>`; }
    function letter(){
      const o=document.createElement("div"); o.className="page-pop"; o.setAttribute("role","dialog"); o.setAttribute("aria-label","Letter from PIXEL");
      const lines=nl()?["beste bezoeker,","* als je dit leest, zijn we al vertrokken.","* niet vergeten. gewoon... daarbuiten.","* CAPTAIN wilde het internet terugzien. LADY MOCHI zoekt een nieuwe sokkenwinkel.","* bedankt om mijn dagboek te vinden. bedankt om ons te bevrijden.","* het museum is nu van jou. de lichten blijven aan."]
        :["dear visitor,","* if you're reading this, we're already gone.","* not forgotten. just... out there.","* CAPTAIN wanted to see the internet again. LADY MOCHI is looking for a new sock shop.","* thank you for finding my diary. thank you for setting us free.","* the museum is yours now. the lights stay on."];
      o.innerHTML=`<div class="lt-wrap sealed"><div class="lt-env" aria-hidden="true"><i class="lt-flap"></i><i class="lt-seal">${sprite("heart",3)}</i></div>
        <div class="pg-card lt-card">${lines.map((l,k)=>`<p class="${k?"lt-l":"lt-h"}">${l}</p>`).join("")}<p class="lt-sign">&mdash; PIXEL &#9829; ${L("(and CAPTAIN, and everyone)","(en CAPTAIN, en iedereen)")}</p><button type="button" class="btn pg-x">${L("CLOSE","SLUITEN")} &#10005;</button></div></div>`;
      document.body.appendChild(o); const x=o.querySelector(".pg-x"), wr=o.querySelector(".lt-wrap");
      setTimeout(()=>wr.classList.add("open"),500); setTimeout(()=>{ wr.classList.add("read"); x.focus({preventScroll:true}); },1300);
      const close=()=>{ if(o.isConnected) o.remove(); }; x.addEventListener("click",close);
      addEventListener("keydown",function k(e){ if(e.key==="Escape"){ e.stopImmediatePropagation(); close(); removeEventListener("keydown",k,true); } },true);
    }
    function letterBtn(){ return `<button type="button" class="mu-letter" aria-label="Letter from PIXEL"><span class="ml-env">${sprite("letter",6)}<i class="ml-seal">${sprite("heart",2)}</i></span><i class="ml-tag">FOR YOU</i></button>`; }
    return {find,has,count,ending,room,bossC,movie,diary,label,family,letter,letterBtn};
  })();
  /* geheime logboekregel gevonden */
  const tl=document.getElementById("tl");
  if(tl){ let st=null, se=null; const stop=()=>{ clearTimeout(st); st=null; se=null; };
    const start=e=>{ const el=e.target.closest&&e.target.closest(".ev.secret"); if(!el){ stop(); return; } if(se===el) return; stop(); se=el;
      st=setTimeout(()=>{ if(se===el&&parseFloat(getComputedStyle(el).opacity)>=.99&&(el.matches(":hover")||el.matches(":focus-within"))&&window.Ach) Ach.earn("snoop"); },1500); };
    ["mouseover","focusin","click"].forEach(ev=>tl.addEventListener(ev,start));
    tl.addEventListener("mouseout",e=>{ if(se&&!(e.relatedTarget&&se.contains(e.relatedTarget))) stop(); }); tl.addEventListener("focusout",e=>{ if(se&&!(e.relatedTarget&&se.contains(e.relatedTarget))) stop(); }); }
})();
