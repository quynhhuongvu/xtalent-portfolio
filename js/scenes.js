/* extra pixelscènes per missie (klik = volgende) */
function slTyped(lines,x,y,lh,d0,step){ return lines.map((l,k)=>`<i class="sl-tl" style="left:${x}px;top:${y+k*lh}px;--n:${l[0].length};animation-delay:${(d0+k*step).toFixed(2)}s;${l[1]?"color:"+l[1]:""}">${l[0]}</i>`).join(""); }
function slPodium(top,cats){ return `<i class="sl-pod" style="left:58px;height:52px"><b>2</b></i><i class="sl-pod" style="left:110px;height:72px"><b>1</b></i><i class="sl-pod" style="left:162px;height:38px"><b>3</b></i>${cats}${confetti()}<i class="sl-big">${top}</i>`; }
const SLIDES={
  sub:[
    ()=>`<i class="sl-cap">TEAM STOEPTEGEL</i><i class="sl-rec">&#9679; REC</i><i class="sl-vf"></i>
      <i class="sl-cat sl-laugh" style="left:52px;top:52px">${sprite("catlaugh",5)}</i><i class="sl-cat sl-laugh" style="left:146px;top:56px;animation-delay:-.2s">${sprite("catlaugh",5)}</i>
      <i class="sl-ha" style="left:40px;top:30px">HA!</i><i class="sl-ha" style="left:196px;top:34px;animation-delay:-.5s">HAHA</i><i class="sl-flash"></i>`,
    ()=>`<i class="sl-cap">CODING...</i>${[[28,68,0],[208,136,1]].map(([c,l,fl],k)=>`<i class="sl-cat" style="left:${c}px;bottom:4px${fl?";transform:scaleX(-1)":""}">${sprite("catA",3)}</i>
      <i class="sl-lap" style="left:${l}px"><i class="sl-scr">${[[5,40],[13,28],[21,46],[29,22]].map(([y,w],j)=>`<i class="sl-code${j===2?" r":""}" style="top:${y}px;--w:${w}px;animation-delay:${-(j*.5+k*.8).toFixed(1)}s"></i>`).join("")}</i><i class="sl-base"></i></i>`).join("")}<i class="es-floor"></i>`
  ],
  phish:[
    ()=>`<i class="sl-cap">ARCTIC SECURITY SHIELD</i><i class="sl-win"><i class="sl-bar"><i></i><i></i><i></i></i>
      <i class="sl-url sl-a">paypa1-login.com</i><i class="sl-url sl-b">pxl.be</i>
      <i class="sl-shield">${sprite("shield",5)}</i>
      <i class="sl-stamp sl-a">PHISHING!</i><i class="sl-stamp ok sl-b">SAFE &#10003;</i></i>`,
    ()=>`<i class="sl-big">BEST ETHICAL INNOVATION</i><i class="sl-ban np" style="left:74px;top:24px"><b>ARCTIC</b><b>INTELLIGENCE</b></i>
      <i class="sl-tro sl-big-tro" style="left:108px;top:72px">${sprite("trophy",6)}<i class="sl-two">2</i></i>
      ${[[18,0],[52,.2],[192,.4],[226,.6]].map(([x,d])=>`<i class="sl-cat sl-hop" style="left:${x}px;bottom:6px;animation-delay:-${d}s">${x>150?sprite("catA",2).replace("<svg ",`<svg style="transform:scaleX(-1)" `):sprite("catA",2)}</i>`).join("")}
      <i class="sl-ha" style="left:30px;top:84px">YAY!</i><i class="sl-ha" style="left:206px;top:80px;animation-delay:-.3s">YAY!</i><i class="es-floor"></i>${confetti()}`
  ]
};
function startSlides(shot,key){
  const base=shot.innerHTML, F=SLIDES[key]; if(!F) return; const n=F.length+1;
  const nav=document.createElement("div"); nav.className="sl-nav"; nav.innerHTML=`<button type="button" class="sl-p" aria-label="Previous picture">&#9664;</button><b></b><button type="button" class="sl-n" aria-label="Next picture">&#9654;</button>`;
  shot.parentNode.appendChild(nav);
  const st={k:0,n,draw(){ shot.innerHTML=(st.k===0?base:F[st.k-1]()); nav.querySelector("b").textContent=(st.k+1)+"/"+n; }};
  nav.querySelector(".sl-p").addEventListener("click",e=>{ e.stopPropagation(); st.k=(st.k-1+n)%n; st.draw(); });
  nav.querySelector(".sl-n").addEventListener("click",e=>{ e.stopPropagation(); st.k=(st.k+1)%n; st.draw(); });
  shot._sl=st; st.draw();
}
document.getElementById("dShot").addEventListener("click",e=>{ const sh=e.currentTarget, st=sh._sl; if(!st) return;
  st.k=(st.k+(e.target.closest(".sl-p")?-1:1)+st.n)%st.n; st.draw(); });
function confetti(){ let r=""; for(let k=0;k<14;k++) r+=`<i class="cf${k%3?"":" cf2"}" style="left:${(k*19+7)%262}px;animation-delay:${-(k*.37%2.4).toFixed(2)}s;animation-duration:${(2+k%4*.35).toFixed(2)}s"></i>`; return r; }
function gymScene(){
  return `<i class="gy-rack" style="left:58px"></i><i class="gy-rack" style="left:196px"></i>
    <i class="gy-bench"></i><i class="gy-bleg" style="left:70px"></i><i class="gy-bleg" style="left:180px"></i>
    <i class="gy-fat" id="gyFat"><i class="gy-lay"><i class="es-cat">${sprite("blackcat",5)}</i></i><i class="gy-bar"><i class="gy-plate" style="left:0"></i><i class="gy-plate" style="right:0"></i></i></i>
    <i class="gy-t" id="gyT">10</i><i class="gy-txt">GYM TIME!</i><i class="es-floor"></i>`;
}
function goGym(){
  if(gymT) return; gymT=true; openMission(curM,false);
  const f=document.getElementById("gyFat"); f.style.setProperty("--fx",1+fat*.12); f.style.setProperty("--fy",1+fat*.08);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{ const g=document.getElementById("gyFat"); if(g){ g.style.transition="transform 10s linear"; g.style.setProperty("--fx",1); g.style.setProperty("--fy",1); } }));
  let left=10;
  gymT=setInterval(()=>{ left--; const t=document.getElementById("gyT"); if(t) t.textContent=left;
    if(left<=0){ clearInterval(gymT); gymT=null; fat=0; fitDone=true; if(window.Ach) Ach.earn("gym"); if(MISSIONS[curM].rest){ openMission(curM,false); const s=document.getElementById("dShot"), w=document.createElement("i"); w.className="es-warn fit"; w.textContent="FIT AGAIN! :) READY FOR THE BOSS"; s.appendChild(w); } } },1000);
}
function meter(){ let s='<span class="fl">FULL</span>'; for(let k=0;k<FAT_MAX;k++) s+=k<fat?'<b class="on"></b>':"<b></b>"; return s; }
function bossNo(){
  const shot=document.getElementById("dShot");
  if(gymT){ const g=shot.querySelector(".gy-txt"); if(g){ g.textContent="STILL AT THE GYM!"; g.classList.remove("es-warn","shake"); void g.offsetWidth; g.classList.add("shake"); } return; }
  let w=shot.querySelector(".es-warn");
  if(!w){ w=document.createElement("i"); w.className="es-warn"; shot.appendChild(w); }
  w.classList.remove("fit","shake");
  w.textContent=gymT?"STILL AT THE GYM...":fat>=FAT_MAX?"TOO FAT FOR THE BOSS!! GO GYM":!fitDone?"TOO HUNGRY TO FIGHT!! FEED ME":"BEAT THE BOSS FIRST!!";
  void w.offsetWidth; w.classList.add("shake");
}
document.getElementById("dBoss").addEventListener("click",()=>{
  if(bossDone){ openMission(MISSIONS.findIndex(x=>x.no==="XX")); return; }
  if(Boss.on) return;
  if(!fitDone||gymT||fat>=FAT_MAX){ bossNo(); return; }
  Boss.start(); document.getElementById("dLink").disabled=true; document.getElementById("dBoss").innerHTML="FIGHT!!";
});

function skipAsk(){
  if(bossDone) return; const shot=document.getElementById("dShot"); if(shot.querySelector(".sk")) return;
  if(Boss.on){ /* tijdens het baasgevecht: deadline lacht je uit */
    const d=document.createElement("div"); d.className="sk"; d.setAttribute("role","dialog"); d.setAttribute("aria-label","Vluchten?");
    d.innerHTML=`<div class="sk-cat sk-dl">${sprite("deadline",3)}</div>
      <div class="sk-q">* Running away? ...fine. I'll just move myself 1 day earlier.</div>
      <div class="sk-btns"><button type="button" id="skFight">NO, FIGHT &#9876;</button><button type="button" id="skFlee">YES, FLEE &#9654;</button></div>`;
    shot.appendChild(d); document.getElementById("skFight").focus();
    document.getElementById("skFight").addEventListener("click",()=>{ d.remove(); const n=document.querySelector(".bf-menu button:not(:disabled)"); if(n) n.focus(); });
    document.getElementById("skFlee").addEventListener("click",()=>{ Boss.stop(); bossFled=true; if(window.Memo) Memo.flee(); fat=0; fitDone=true; bossDone=true; openMission(MISSIONS.findIndex(x=>x.no==="XX")); });
    return; }
  const d=document.createElement("div"); d.className="sk"; d.setAttribute("role","dialog"); d.setAttribute("aria-label","Overslaan?");
  d.innerHTML=`<div class="sk-cat">${sprite("catcry",4)}<div class="sk-tear" style="left:8px"></div><div class="sk-tear" style="left:36px;animation-delay:-.5s"></div></div>
    <div class="sk-q">Are you sure you don't want to feed the cat?</div>
    <div class="sk-btns"><button type="button" id="skNo">NO, FEED &#9829;</button><button type="button" id="skYes">YES, SKIP &#9654;</button></div>`;
  shot.appendChild(d); document.getElementById("skNo").focus();
  document.getElementById("skNo").addEventListener("click",()=>{ d.remove(); if(!Boss.on&&!gymT&&fat<FAT_MAX) feedCat(); });
  document.getElementById("skYes").addEventListener("click",()=>{ if(Boss.on) Boss.stop(); if(gymT){ clearInterval(gymT); gymT=null; } if(window.Memo) Memo.skip(); fat=0; fitDone=true; bossDone=true; openMission(MISSIONS.findIndex(x=>x.no==="XX")); });
}
document.getElementById("dSkip").addEventListener("click",skipAsk);
function feedCat(){
  if(gymT||Boss.on) return; const sk=document.querySelector("#dShot .sk"); if(sk) sk.remove(); if(fat>=FAT_MAX){ goGym(); return; }
  const shot=document.getElementById("dShot"), nom=shot.querySelector(".es-nom"); if(!nom) return;
  fat++; if(window.SFX) SFX.meow(); if(window.Memo) Memo.fed(); const mt=shot.querySelector(".es-meter"); if(mt) mt.innerHTML=meter(); const fw=shot.querySelector(".es-fat"); if(fw){ fw.style.setProperty("--fx",1+fat*.12); fw.style.setProperty("--fy",1+fat*.08); }
  const old=shot.querySelector(".es-warn.fit"); if(old) old.remove();
  if(fat>=FAT_MAX){ if(window.Ach) Ach.earn("chonk"); const ml=document.getElementById("dLink"); ml.innerHTML="GO GYM &#9654;"; if(!shot.querySelector(".es-warn")){ const w=document.createElement("i"); w.className="es-warn"; w.textContent="TOO FAT!"; shot.appendChild(w); } }
  for(let k=0;k<4;k++){ const p=document.createElement("i"); p.className="kib";
    p.style.left=(176+Math.random()*58|0)+"px"; p.style.animationDelay=(k*.13)+"s"; if(Math.random()<.5) p.classList.add("kib2");
    shot.appendChild(p); setTimeout(()=>p.remove(),1500+k*130); }
  nom.classList.remove("fed"); void nom.offsetWidth; nom.classList.add("fed");
}
let walkT;
function moveWalker(i,quiet){
  const n=nodeEls[i], mp=document.getElementById("map").getBoundingClientRect(), r=n.getBoundingClientRect();
  const nx=r.left-mp.left+r.width/2-40, ox=parseFloat(walker.style.left)||0;
  if(!quiet&&Math.abs(nx-ox)>2){ if(ox&&window.pawTrail) pawTrail(ox,nx); clearTimeout(walkT); walker.classList.toggle("flip",nx<ox); walker.classList.add("walk"); walkT=setTimeout(()=>walker.classList.remove("walk"),900); }
  walker.style.left=nx+"px";
}
nodeEls.forEach((n,i)=>n.addEventListener("click",()=>openMission(i)));
openMission(0,false); requestAnimationFrame(()=>{ moveWalker(0); placeBoss(); }); addEventListener("load",placeBoss);
document.querySelectorAll("[data-mission]").forEach(a=>a.addEventListener("click",()=>setTimeout(()=>openMission(+a.dataset.mission),400)));
addEventListener("resize",()=>{ placeBoss(); });
document.getElementById("nodes").addEventListener("scroll",()=>{ walker.classList.add("nt"); moveWalker(nodeEls.findIndex(n=>n.getAttribute("aria-pressed")==="true"),true); placeBoss(); clearTimeout(walker._nt); walker._nt=setTimeout(()=>walker.classList.remove("nt"),120); },{passive:true}); addEventListener("resize",()=>moveWalker(nodeEls.findIndex(n=>n.getAttribute("aria-pressed")==="true")));
