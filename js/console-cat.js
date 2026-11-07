/* circle pad: zwarte kat bewegen, ik kijk :o */
(function(){
  const pad=document.getElementById("cpad"), nub=document.getElementById("nub"), kat=document.getElementById("sCat");
  const FACE=sImg.src, WOW="img/player-wow.png"; new Image().src=WOW;
  let on=false, cx=0, cy=0, vx=0, vy=0, px=0, py=0, raf=0, wow=false, d3=false, out=false, gx=0, gy=0;
  const d3b=document.getElementById("d3"), home=kat.parentNode, homeNext=kat.nextSibling;
  function face(w){ if(w!==wow){ wow=w; sImg.src=w?WOW:FACE; } }
  function base(){ /* bovenhoek van de kat op (0,0) in het scherm, in paginacoordinaten */
    const sr=screen.getBoundingClientRect(), w=kat.offsetWidth, h=kat.offsetHeight;
    return {x:sr.left+scrollX+sr.width*.06, y:sr.bottom+scrollY-sr.height*.03-h-screen.clientTop, maxX:sr.width*.88-w, minY:-sr.height*.6};
  }
  function goOut(){ const b=base(); gx=b.x+px; gy=b.y+py; out=true; document.body.appendChild(kat); kat.classList.add("out3d"); kat.style.translate=gx+"px "+gy+"px"; say("Come back! It's dangerous!",Infinity); }
  function goIn(x,y){ out=false; msg.classList.remove("on"); kat.classList.remove("out3d"); home.insertBefore(kat,homeNext); px=x; py=y; kat.style.translate=px+"px "+py+"px"; }
  function set3d(v){
    d3=v; d3b.classList.toggle("on",v); d3b.setAttribute("aria-pressed",v); ds.classList.toggle("d3on",v);
    if(!v && out){ goIn(0,0); face(false); }
  }
  d3b.addEventListener("click",e=>{ e.stopPropagation(); if(ds.classList.contains("off")) return; set3d(!d3); });
  new MutationObserver(()=>{ if(ds.classList.contains("off")||ds.classList.contains("closed")) set3d(false); }).observe(ds,{attributes:true,attributeFilter:["class"]});
  function loop(){
    const b=base(), sp=out?7:3.5;
    if(!out){
      px+=vx*sp; py+=vy*sp;
      if(d3 && (px<0||px>b.maxX||py<b.minY||py>0)) goOut();
      else { px=Math.max(0,Math.min(b.maxX,px)); py=Math.max(b.minY,Math.min(0,py)); kat.style.translate=px+"px "+py+"px"; }
    } else {
      const W=document.documentElement.scrollWidth-kat.offsetWidth*1.4, H=document.documentElement.scrollHeight-kat.offsetHeight*1.6;
      gx=Math.max(kat.offsetWidth*.3,Math.min(W,gx+vx*sp)); gy=Math.max(kat.offsetHeight*.6,Math.min(H,gy+vy*sp));
      kat.style.translate=gx+"px "+gy+"px";
      const vy0=gy-scrollY; if(vy>0&&vy0>innerHeight-90) scrollBy(0,vy*sp); if(vy<0&&vy0<110) scrollBy(0,vy*sp);
      const lx=gx-b.x, ly=gy-b.y; if(lx>=-2&&lx<=b.maxX+2&&ly>=b.minY-2&&ly<=2) goIn(Math.max(0,Math.min(b.maxX,lx)),Math.max(b.minY,Math.min(0,ly)));
    }
    const moving=Math.hypot(vx,vy)>.15;
    kat.classList.toggle("walk",moving); if(Math.abs(vx)>.1) kat.classList.toggle("flip",vx<0);
    face(moving||out);
    if(on) raf=requestAnimationFrame(loop);
  }
  function move(e){
    const r=pad.getBoundingClientRect(), R=r.width*.32;
    let dx=e.clientX-cx, dy=e.clientY-cy; const d=Math.hypot(dx,dy);
    if(d>R){dx=dx/d*R;dy=dy/d*R;}
    nub.style.transform=`translate(${dx}px,${dy}px)`; vx=dx/R; vy=dy/R; if(Math.abs(vx)<.2) vx=0; if(Math.abs(vy)<.2) vy=0; if(Game.active) Game.stick(vx,vy);
  }
  pad.addEventListener("pointerdown",e=>{
    if(ds.classList.contains("off")||Pet.active||captured) return;
    const r=pad.getBoundingClientRect(); cx=r.left+r.width/2; cy=r.top+r.height/2;
    on=true; pad.classList.add("drag"); pad.setPointerCapture(e.pointerId); move(e); if(Game.active){ on=false; pad.classList.add("drag"); return; } cancelAnimationFrame(raf); loop();
  });
  pad.addEventListener("pointermove",e=>{ if(on||(Game.active&&pad.classList.contains("drag"))) move(e); });
  const stop=()=>{ on=false; vx=vy=0; if(Game.active) Game.stick(0,0); pad.classList.remove("drag"); nub.style.transform=""; kat.classList.remove("walk"); face(out); };
  pad.addEventListener("pointerup",stop); pad.addEventListener("pointercancel",stop);
  /* easter egg: kat vastpakken + geheime deur naar het kattenmuseum */
  kat.insertAdjacentHTML("beforeend",'<span class="fh">'+sprite("cathold",3)+'</span>');
  const door=document.getElementById("secretDoor"); let held=false, lastX=0, lastY=0, dragRaf=0, inMuseum=false;
  function overDoor(x,y){ if(!door) return false; const r=door.getBoundingClientRect(); return r.width>0&&x>r.left-14&&x<r.right+14&&y>r.top-14&&y<r.bottom+14; }
  function place(){ gx=lastX+scrollX-22; gy=lastY+scrollY+29; kat.style.translate=gx+"px "+gy+"px"; if(door) door.classList.toggle("near",overDoor(lastX,lastY)); }
  function dragTick(){ if(!held) return; if(lastY>innerHeight-70) scrollBy(0,14); else if(lastY<90) scrollBy(0,-14); place(); dragRaf=requestAnimationFrame(dragTick); }
  kat.addEventListener("pointerdown",e=>{ if(!out||inMuseum) return; e.preventDefault(); e.stopPropagation(); held=true; lastX=e.clientX; lastY=e.clientY; kat.classList.add("held"); if(window.SFX) SFX.pickup(); kat.classList.remove("walk"); try{ kat.setPointerCapture(e.pointerId); }catch(_){} place(); cancelAnimationFrame(dragRaf); dragRaf=requestAnimationFrame(dragTick); });
  kat.addEventListener("pointermove",e=>{ if(!held) return; lastX=e.clientX; lastY=e.clientY; });
  function drop(){ if(!held) return; held=false; cancelAnimationFrame(dragRaf); kat.classList.remove("held"); if(window.SFX) SFX.drop();
    if(door) door.classList.remove("near");
    if(overDoor(lastX,lastY)){ openMuseum(); return; }
    const b=base(), lx=gx-b.x, ly=gy-b.y; if(lx>=-10&&lx<=b.maxX+10&&ly>=b.minY-10&&ly<=10){ goIn(Math.max(0,Math.min(b.maxX,lx)),Math.max(b.minY,Math.min(0,ly))); face(false); }
  }
  kat.addEventListener("pointerup",drop); kat.addEventListener("pointercancel",drop);
  const TT=s=>(window.T?T(s):s);
  function boss(){ const s=8; return `<div class="mu-boss" aria-hidden="true"><span class="b">${sprite("bosscat",s)}</span><span class="w">${sprite("bossshirt",s)}</span><span class="w">${sprite("bosseyes",s)}</span><span class="t">${sprite("bosstie",s)}</span></div>`; }
  function frame(sp,name,s){ return `<figure class="mu-fr" data-k="${name}"><div class="mu-pic${sp?"":" empty"}">${sp?sprite(sp,s):"?"}</div><figcaption>${name}</figcaption></figure>`; }
  let mu=null, typeT=0, acquired=false, captured=false, leaving=false;
  const homeBtn=document.querySelector(".pills .home");
  /* home haalt de ontsnapte kat terug */
  window.openMuseum=openMuseum;
  const SE=()=>window.Story?Story.ending():null;
  function pixelFrame(){ return `<figure class="mu-fr" data-k="PIXEL"><div class="mu-pic pix-pic">${window.Story?Story.bossC(2):""}</div><figcaption>PIXEL</figcaption></figure>`; }
  const PLAQUE={"SIR WHISKERS":"* the first one. he came from a website about bread. it was deleted in 2019.",
    "LADY MOCHI":"* from a webshop that sold socks. it closed. she is still waiting for orders.",
    "THE THINKER":"* from a philosophy blog. the last post was 'why?'. nobody ever answered.",
    "CAPTAIN PHISH":"* from an old spam filter. he caught 10,000 phishing mails. then he was replaced.",
    "SAD KITTY":"* from a 404 page. she was the error. nobody ever stayed long.",
    "CAPTAIN":"* CAPTAIN. my oldest friend. deleted in 2002. found in the recycle bin.",
    "CAPTAIN · REUNITED":"* CAPTAIN. my oldest friend. deleted in 2002. found in the recycle bin.",
    "DEFEATED 2026":"* DEADLINE. he ended my website. now he hangs on my wall.",
    "RESERVED":"* for your cat. so it will never be alone. ...like me.",
    "ACQUIRED 2026":"* your cat. safe. here. ...you can still take it HOME.",
    "PIXEL":"* that's me. PIXEL. someone remembered.",
    "FREE":"* empty now. they are remembered somewhere else."};
  let plT=0;
  function plaque(t){ const box=mu.querySelector(".mu-box"); clearTimeout(plT);
    { const r=box.getBoundingClientRect(); if(r.top<0||r.bottom>innerHeight) box.scrollIntoView({behavior:"smooth",block:"center"}); } box.innerHTML='<p class="pl"></p>'; const pp=box.firstChild; let i=0;
    (function ty(){ if(!mu) return; pp.textContent=t.slice(0,++i); if(i<t.length) plT=setTimeout(ty,38); })(); }
  const isMember=()=>{ try{ return !!localStorage.getItem("catMuseum"); }catch(e){ return false; } };
  const hasTrash=()=>{ try{ return !!localStorage.getItem("catTrash"); }catch(e){ return false; } };
  function trashFrame(cap){ return `<figure class="mu-fr" data-k="${cap}"><div class="mu-pic tcat-pic">${tcatHTML(3)}</div><figcaption>${cap}</figcaption></figure>`; }
  function acquireTrash(){ if(!mu) return; const wall=mu.querySelector(".mu-wall"), last=[...wall.querySelectorAll(".mu-fr")].pop();
    last.insertAdjacentHTML("beforebegin",trashFrame("CAPTAIN · REUNITED")); const p=last.previousElementSibling.querySelector(".mu-pic"); p.classList.add("acq");
    try{ localStorage.setItem("catTrash","1"); }catch(e){} if(window.Ach) Ach.earn("trashcat");
    mu.classList.remove("caught"); void mu.offsetWidth; mu.classList.add("caught");
    const g=document.createElement("p"); g.className="gotcha"; mu.querySelector(".mu-box").appendChild(g);
    const gt=TT("* i thought you were deleted forever."); let gi=0; typeT=setTimeout(function ty(){ if(!mu) return; g.textContent=gt.slice(0,++gi); if(gi<gt.length) typeT=setTimeout(ty,38); },900); }
  window.catHome=()=>{ if(!captured) return false; captured=false; if(window.Ach) Ach.earn("escape"); if(homeBtn) homeBtn.classList.remove("call"); screen.classList.remove("empty"); kat.style.visibility=""; goIn(0,0); face(false); kat.classList.remove("jump"); void kat.offsetWidth; kat.classList.add("jump"); return true; };
  function acquire(){ if(!mu) return; if(window.SFX){ SFX.eerie(); if(SFX.gotcha) SFX.gotcha(); } const f=[...mu.querySelectorAll(".mu-fr")].pop(); if(!f) return;
    const p=f.querySelector(".mu-pic"), c=f.querySelector("figcaption");
    p.classList.remove("empty"); p.innerHTML=sprite("blackcat",3); p.classList.add("acq"); c.textContent="ACQUIRED 2026"; f.dataset.k="ACQUIRED 2026"; acquired=true;
    mu.classList.remove("caught"); void mu.offsetWidth; mu.classList.add("caught");
    const g=document.createElement("p"); g.className="gotcha"; mu.querySelector(".mu-box").appendChild(g);
    const gt=TT("* Gotcha."); let gi=0; typeT=setTimeout(function ty(){ if(!mu) return; g.textContent=gt.slice(0,++gi); if(gi<gt.length) typeT=setTimeout(ty,90); },900); }
  function closeMuseum(){ if(!mu) return;
    if(acquired&&!leaving){ leaving=true; clearTimeout(typeT); const box=mu.querySelector(".mu-box"), og=box.querySelector(".gotcha"); if(og) og.textContent=TT("* Gotcha.");
      const g=document.createElement("p"); g.className="gotcha"; box.appendChild(g); const t=TT("* Your cat stays here now... unless it finds its way HOME."); let i=0;
      (function ty(){ if(!mu) return; g.textContent=t.slice(0,++i); if(i<t.length) typeT=setTimeout(ty,38); else typeT=setTimeout(closeMuseum,1800); })(); return; }
    leaving=false; clearTimeout(typeT); mu.remove(); mu=null; inMuseum=false; document.documentElement.style.overflow="";
    if(door){ door.classList.remove("opened"); door.innerHTML=sprite("door",9); }
    goIn(0,0); face(false);
    if(acquired){ acquired=false; captured=true; kat.style.visibility="hidden"; screen.classList.add("empty"); if(homeBtn) homeBtn.classList.add("call"); } else if(!captured) kat.style.visibility=""; }
  function openMuseum(who){ const tr=who==="trash", vis=who==="visit"; const wasMember=isMember(); try{ localStorage.setItem("catMuseum","1"); }catch(e){}
    inMuseum=true; acquired=false; leaving=false; if(window.SFX) SFX.creak(); if(window.Ach&&!vis) Ach.earn("burglar"); if(door){ door.classList.add("opened"); door.innerHTML=sprite("door_open",9); }
    if(!who){ kat.style.transition="scale .5s steps(5), opacity .5s steps(5)"; kat.style.scale="0.2"; kat.style.opacity="0"; }
    setTimeout(()=>{ if(!who){ kat.style.transition=""; kat.style.scale=""; kat.style.opacity=""; kat.style.visibility="hidden"; }
      mu=document.createElement("div"); mu.className="museum"; mu._vis=vis; mu.setAttribute("role","dialog"); mu.setAttribute("aria-modal","true"); mu.setAttribute("aria-label","Het geheime kattenmuseum");
      mu.innerHTML=`<div class="mu-in"><div class="mu-sign">${SE()==="free"?"CAT MUSEUM · CLOSED":"CAT MUSEUM · PRIVATE COLLECTION"}</div>
        <div class="mu-wall">${SE()==="free"?[0,1,2,3,4].map(()=>frame(null,"FREE",0)).join(""):frame("catfront","SIR WHISKERS",4)+frame("cat","LADY MOCHI",4)+frame("catback","THE THINKER",4)+frame("phcat","CAPTAIN PHISH",3)+frame("catcry","SAD KITTY",4)}${SE()==="stay"?pixelFrame():""}${window.Ach&&Ach.done()?frame("deadline","DEFEATED 2026",4):""}${!tr&&hasTrash()?(SE()==="free"?frame(null,"FREE",0):trashFrame("CAPTAIN")):""}${vis&&captured?frame("blackcat","ACQUIRED 2026",3):frame(null,"RESERVED",0)}</div>
        ${SE()&&window.Story?Story.family():""}<p class="mu-hint">click a painting to read its story</p>
        <div class="mu-hall"><div class="mu-carpet"></div><div class="mu-rope l"><i></i></div><div class="mu-rope r"><i></i></div>${SE()==="free"&&window.Story?Story.letterBtn():boss()}${!who&&SE()?`<span class="mu-guest">${sprite("blackcat",4)}</span>`:""}${SE()==="free"?"":`<div class="mu-plate">${SE()?"PIXEL":"THE BOSS"}</div>`}${(()=>{ const op=window.Story&&Story.count()>=5; return `<button type="button" class="mu-altar${window.Story&&Story.count()?" lit":""}" aria-label="Diary" title="${window.Story?Story.label():""}"><span class="al-book">${sprite("book",5)}</span><span class="al-base">${sprite("altar",7)}</span><span class="al-plate">${window.Story?Story.label():""}</span></button><button type="button" class="mu-door${op?" open":""}" aria-label="Back room" title="${op?"BACK ROOM":"?"}">${(op?curtainDoor(6):sprite("door",6))}</button>`; })()}</div>
        <div class="mu-box" aria-live="polite"><p></p><p></p><p></p></div>
        <div class="mu-btns"><button type="button" class="btn mu-x">LEAVE &#9654;</button></div></div>`;
      document.body.appendChild(mu); document.documentElement.style.overflow="hidden";
      mu.querySelector(".mu-x").addEventListener("click",closeMuseum);
      { const lt=mu.querySelector(".mu-letter"); if(lt) lt.addEventListener("click",()=>{ if(!mu._ready){ clearTimeout(typeT); mu._ready=true; } if(window.Story) Story.letter(); }); }
      mu.querySelector(".mu-door").addEventListener("click",()=>{ if(!mu._ready&&!mu._vis) return; if(!mu._ready){ clearTimeout(typeT); mu._ready=true; } if(window.Story&&Story.count()>=5) Story.room(mu); else { if(window.SFX&&SFX.locked) SFX.locked(); const dr=mu.querySelector(".mu-door"); if(dr){ dr.classList.remove("rattle"); void dr.offsetWidth; dr.classList.add("rattle"); } plaque(TT("* that door stays locked. ...it only opens for those who know my story.")); }; });
      mu.querySelector(".mu-altar").addEventListener("click",()=>{ if(!mu._ready&&!mu._vis) return; if(!mu._ready){ clearTimeout(typeT); mu._ready=true; } if(window.Story) Story.diary(); });
      mu.addEventListener("click",e=>{ if(!e.target.closest(".fam")||!mu) return; if(!mu._ready&&!mu._vis) return; if(!mu._ready){ clearTimeout(typeT); mu._ready=true; }
        plaque(TT(SE()==="free"?"* (a note behind the frame: 'we took a copy with us. - PIXEL')":"* they made this for me. all of us. together.")); });
      mu.querySelector(".mu-wall").addEventListener("click",e=>{ const f=e.target.closest(".mu-fr"); if(!f||!mu||(!mu._ready&&!mu._vis)) return; if(!mu._ready){ clearTimeout(typeT); mu._ready=true; } const t=(f.dataset.k==="RESERVED"&&SE())?"* this was for your cat. now it's just... a guest room.":PLAQUE[f.dataset.k]; if(t) plaque(TT(t)); }); mu.querySelector(".mu-x").focus({preventScroll:true});
      const pc=window.Story?Story.count():0, en=SE();
      const lines=(vis?(en==="stay"?["* you came back.","* ...you remembered me. thank you."]:en==="free"?["* (the museum is empty.)","* (there's a letter on the floor. it says: FOR YOU.)"]:wasMember?["* Oh. it's you again.","* No cat this time? ...fine. look around.",pc>=5?"* you found my whole diary... the back room is open.":"* ...also. i lost my diary. 5 pages. somewhere out there."]:["* ...how did you get a key?","* Fine. you may look. but don't touch anything."]):tr?["* Oh no... you caught me.","* ...wait. that eyepatch...","* ...CAPTAIN? is that really you?"]:SE()==="stay"?["* oh! the black cat.","* don't worry. i'm not keeping anyone anymore.","* ...but it can visit. anytime. ♥"]:SE()==="free"?["* (the museum is empty. your cat sniffs around.)","* (there's a letter on the floor. it says: FOR YOU.)"]:["* Oh no... you caught me.","* Welcome to my secret cat collection.","* That empty frame? ...it was saved for your cat."]).map(TT), ps=[...mu.querySelectorAll(".mu-box p")];
      let li=0, ci=0; (function type(){ if(!mu) return; if(li>=lines.length){ mu._ready=true; if(!vis&&!(SE()&&!tr)) typeT=setTimeout(tr?acquireTrash:acquire,1200); return; } ci++; ps[li].textContent=lines[li].slice(0,ci); if(ci>=lines[li].length){ li++; ci=0; typeT=setTimeout(type,500); } else typeT=setTimeout(type,38); })();
    },550);
  }
  addEventListener("keydown",e=>{ if(mu&&e.key==="Escape") closeMuseum(); });
  /* hulptip boven de geheime deur */
  if(door){
    const tip=document.createElement("span"); tip.className="door-tip"; tip.hidden=true; door.parentNode.appendChild(tip); let tipT=0;
    const tipText=()=>window.keyHeld?"the key fits. click to enter.":(isMember()&&!out&&!window.tcatOut)?"welcome back, member. click to enter.":captured&&!window.tcatOut?"your cat is already inside. press HOME.":(out||window.tcatOut)?"grab the cat and bring it to me.":"only cats may enter. ...yours is still stuck in the console.";
    const showTip=()=>{ if(held||inMuseum) return; clearTimeout(tipT); tip.textContent=tipText(); tip.hidden=false; };
    const hideTip=()=>{ tip.hidden=true; };
    door.addEventListener("mouseenter",showTip); door.addEventListener("mouseleave",hideTip);
    door.addEventListener("click",()=>{ if(inMuseum) return;
      if(window.keyHeld||(isMember()&&!out&&!window.tcatOut)){ if(window.keyHeld&&window.dropKey){ dropKey(); if(window.SFX&&SFX.unlockDoor) SFX.unlockDoor(); } hideTip(); openMuseum("visit"); return; }
      showTip(); tipT=setTimeout(hideTip,3500); });
    /* de sleutel tussen de muntjes: oppakken en de deur ermee openen */
    const key=document.getElementById("museumKey");
    if(key){ let fol=null; const fine=matchMedia("(pointer:fine)").matches;
      const move=e=>{ if(fol){ fol.style.left=(e.clientX+14)+"px"; fol.style.top=(e.clientY+14)+"px"; } };
      window.dropKey=()=>{ window.keyHeld=false; key.style.visibility=""; if(fol){ fol.remove(); fol=null; } removeEventListener("pointermove",move); };
      key.addEventListener("click",e=>{ e.stopPropagation(); if(window.keyHeld){ dropKey(); return; }
        window.keyHeld=true; key.style.visibility="hidden"; if(window.SFX&&SFX.keyup) SFX.keyup(); fol=document.createElement("i"); fol.className="key-follow"+(fine?"":" fixed"); fol.setAttribute("aria-hidden","true"); fol.innerHTML=sprite("key",3);
        document.body.appendChild(fol); if(fine){ move(e); addEventListener("pointermove",move); } });
      addEventListener("keydown",e=>{ if(e.key==="Escape"&&window.keyHeld) dropKey(); });
    }
  }
})();
