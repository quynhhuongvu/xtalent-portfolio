/* boss: deadline, beurtgevecht met skills (eigen ontwerp) */
const Boss=(function(){
  const MON=["..##........##..","################","################","#..............#","#.##........##.#","#..###....###..#","#..............#","#...########...#","#...#.#.#.#.#..#","#...########...#","#..............#","################"];
  const SK=[
    ["LINUX","* sudo kill -9 deadline! It's super effective!"],
    ["K8S","* kubectl scale cats x10! Cat army!"],
    ["CI/CD","* Pipeline green! Auto-deploy hits hard!"],
    ["SECURITY","* Firewall up! DEADLINE got blocked!"],
    ["NETWORK","* Cisco config: DEADLINE's packets dropped!"],
    ["AWS","* Spun up 50 EC2 cats in the cloud! Meow-scale!"]];
  const REPLY=["* DEADLINE sends an 8:00 meeting invite... declined.","* DEADLINE throws a new ticket! The cat naps through it.","* DEADLINE: \"IT'S DUE TOMORROW!\" ...the cat stays calm.","* DEADLINE summons 47 unread mails! The cat sits on the keyboard.","* DEADLINE moves itself 1 day earlier!! ...the cat yawns."];
  let on=false, hp=6, turn=0, tm=[];
  const $=id=>document.getElementById(id);
  const later=(f,ms)=>tm.push(setTimeout(()=>{ if(on) f(); },ms));
  function say(t){ const b=$("bfTxt"); if(b) b.textContent=t; }
  function anim(el,c){ if(!el) return; if(c==="hit"&&window.SFX) SFX.hit(); el.classList.remove(c); void el.offsetWidth; el.classList.add(c); }
  function lock(v){ document.querySelectorAll(".bf-menu button").forEach(b=>b.disabled=v||b.classList.contains("used")); }
  function use(k,btn){
    if(!on||btn.disabled) return; btn.classList.add("used"); lock(true); say(SK[k][1]);
    later(()=>{ hp--; $("bfHp").style.width=(hp/SK.length*100)+"%"; anim($("bfMon"),"hit"); },1300);
    if(hp>1){
      later(()=>{ say(REPLY[turn]); anim($("bfCat"),"hit"); },3600);
      later(()=>{ turn++; say("* What will the cat do?"); lock(false); const n=document.querySelector(".bf-menu button:not(:disabled)"); if(n) n.focus(); },6400);
    } else {
      later(()=>{ $("bfMon").classList.add("dead"); say("* DEADLINE was defeated! +100 XP"); if(window.SFX) SFX.win(); },3200);
      later(finish,6000);
    }
  }
  function finish(){ stop(); bossDone=true; if(window.Memo) Memo.won(); openMission(curM,false);
    const shot=$("dShot"), w=document.createElement("i"); w.className="es-warn fit"; w.textContent="YOU WON!! THE EINDREFLECTIE IS OPEN"; shot.appendChild(w); }
  function stop(){ on=false; tm.forEach(clearTimeout); tm=[]; }
  function start(){
    hp=SK.length; turn=0; on=true;
    $("dShot").innerHTML=`<div class="bf" role="group" aria-label="Baasgevecht tegen DEADLINE">
      <div class="bf-top">DEADLINE<div class="bf-hp"><div id="bfHp" style="width:100%"></div></div></div>
      <div class="bf-cat" id="bfCat">${sprite("blackcat",3)}</div><div class="bf-vs">VS</div>
      <div class="bf-mon" id="bfMon">${SPR.deadline?sprite("deadline",4):""}</div>
      <div class="bf-box" id="bfTxt" aria-live="polite">* DEADLINE appears! Pick a skill to attack.</div>
      <div class="bf-menu">${SK.map((s,k)=>`<button type="button" data-k="${k}">${s[0]}</button>`).join("")}</div></div>`;
    document.querySelectorAll(".bf-menu button").forEach(b=>b.addEventListener("click",()=>use(+b.dataset.k,b)));
  }
  SPR.deadline=MON;
  return { start, stop, get on(){return on;} };
})();
let fat=0, gymT=null, fitDone=false, bossDone=false, badRoute=false, bossFled=false; const FAT_MAX=6;
function openMission(i,move){
  let blocked=false;
  if(Boss.on) Boss.stop();
  if(MISSIONS[i].no==="XX" && !bossDone){ i=MISSIONS.findIndex(x=>x.rest); blocked=true; }
  const m=MISSIONS[i];
  document.getElementById("dWhenL").textContent=m.rest?"Nom nom":"Wanneer";
  document.getElementById("dLootL").textContent=m.rest?"Nom nom nom":"Loot";
  nodeEls.forEach((n,j)=>n.setAttribute("aria-pressed",j===i));
  curM=i;
  document.getElementById("dFile").textContent=m.rest?"snack_stop.dat":"missie_"+m.no.toLowerCase()+".dat";
  document.getElementById("dNo").textContent=m.rest?"NOM NOM":m.no==="XX"?"THE END":"MISSIE "+m.no;
  document.getElementById("dTitle").textContent=m.title;
  document.getElementById("dTxt").textContent=m.txt;
  document.getElementById("dWhen").textContent=m.when;
  document.getElementById("dLoot").textContent=m.loot;
  const shot=document.getElementById("dShot"); shot.parentNode.classList.toggle("eating",!!(m.rest||m.scene)); shot._sl=null; shot.parentNode.querySelectorAll(".sl-nav").forEach(x=>x.remove());
  if(m.rest&&gymT) shot.innerHTML=gymScene();
  else if(m.rest){ shot.innerHTML=`<i class="es-fat" style="--fx:${1+fat*.12};--fy:${1+fat*.08}">${bossDone?`<i class="es-hop"><i class="es-cat es-a">${sprite("blackcat",8)}</i><i class="es-cat es-b">${sprite("blackcat2",8)}</i></i>`:`<i class="es-cat es-a">${sprite("blackcat_eat1",10)}</i><i class="es-cat es-b">${sprite("blackcat_eat2",10)}</i>`}</i>${bossDone?confetti():""}<i class="es-bowl">${sprite("bowl",8)}</i><i class="es-nom">${bossDone?"YAY!!":"NOM NOM"}</i><i class="es-meter">${meter()}</i><i class="es-floor es-rf"></i>${fat>=FAT_MAX?'<i class="es-warn">TOO FAT!</i>':""}`;
    if(blocked) bossNo(); }
  else if(m.scene==="sub") shot.innerHTML=`<i class="sc-sos">SOS</i><i class="sc-fish" style="top:22px;animation-duration:9s;animation-delay:0s"><i class="es-a">${sprite("fish1",3)}</i><i class="es-b">${sprite("fish2",3)}</i></i><i class="sc-fish" style="top:52px;animation-duration:7s;animation-delay:-4s"><i class="es-a">${sprite("fish1",2)}</i><i class="es-b">${sprite("fish2",2)}</i></i><i class="sc-fish rev" style="top:38px;animation-duration:11s;animation-delay:-2s"><i class="es-a">${sprite("fish1",2)}</i><i class="es-b">${sprite("fish2",2)}</i></i><i class="sc-fish rev" style="top:10px;animation-duration:10s;animation-delay:-6s"><i class="es-a">${sprite("fish1",3)}</i><i class="es-b">${sprite("fish2",3)}</i></i>
    <i class="sc-weed sc-w1"><i class="es-a">${sprite("weed1",6)}</i><i class="es-b">${sprite("weed2",6)}</i></i>
    <i class="sc-weed sc-w2"><i class="es-b">${sprite("weed1",5)}</i><i class="es-a">${sprite("weed2",5)}</i></i>
    <i class="sc-sub">${sprite("sub",6)}<i class="sc-cat"><i class="es-a">${sprite("subcat1",6)}</i><i class="es-b sc-blink">${sprite("subcat2",6)}</i></i><i class="sc-light"></i>
      <i class="sc-bub" style="left:62px;animation-delay:0s"></i><i class="sc-bub" style="left:72px;animation-delay:-.8s"></i><i class="sc-bub sm" style="left:156px;animation-delay:-1.5s"></i><i class="sc-bub" style="left:160px;animation-delay:-2.2s"></i></i>
    <i class="es-floor sc-sand"></i>`;
  else if(m.scene==="phish") shot.innerHTML=`<i class="ph-wave"></i><i class="ph-wave ph-w2"></i>
    <i class="sc-fish" style="top:128px;animation-duration:8s"><i class="es-a">${sprite("fish1",3)}</i><i class="es-b">${sprite("fish2",3)}</i></i>
    <i class="sc-fish rev" style="top:150px;animation-duration:11s;animation-delay:-5s"><i class="es-a">${sprite("fish1",2)}</i><i class="es-b">${sprite("fish2",2)}</i></i>
    <svg class="ph-rod" width="270" height="170" viewBox="0 0 270 170" aria-hidden="true"><path d="M58 62 L168 16" stroke-width="4"/><path d="M168 16 L206 104" stroke-width="2"/></svg>
    <i class="ph-bob"><i class="ph-float"></i><svg width="20" height="44" viewBox="0 0 20 44"><path d="M10 10 V30" stroke-width="2"/></svg><i class="ph-mail">${sprite("mail",3)}</i></i>
    <i class="ph-pier"></i><i class="ph-post" style="left:20px"></i><i class="ph-post" style="left:70px"></i>
    <i class="ph-cat"><i class="es-a">${sprite("phcat",5)}</i><i class="es-b">${sprite("phcat2",5)}</i></i>
    <i class="ph-bang">!</i><i class="ph-tag">PHISHING...</i>`;
  else if(m.scene==="mirror") shot.innerHTML=`<div class="cr" title="Klik om over te slaan"><div class="cr-roll">
      <div class="cr-big">THE END</div><div class="cr-h">a portfolio game by</div><div>QUYNH HUONG VU</div>
      <div class="cr-h">starring</div><div>THE CAT</div>${bossFled?`<div class="cr-h">and the coward</div><div>${(playerName()||"PLAYER").toUpperCase()} 🐔</div>`:""}<div class="cr-h">boss</div><div>${bossFled?"DEADLINE (undefeated)":"DEADLINE"}</div>
      <div class="cr-h">fueled by</div><div>${badRoute?"NOTHING":"SNACKS &amp; COFFEE"}</div>
      <div class="cr-big">THANKS FOR PLAYING!</div></div>
      <i class="cr-cat"><i class="es-a">${sprite("blackcat",3)}</i><i class="es-b">${sprite("blackcat2",3)}</i></i></div><i class="mr-wall"></i><i class="mr-floor"></i>
    <i class="mr-mirror"><i class="mr-glass"><i class="mr-refl">${sprite("catfront",3)}</i><i class="mr-shine"></i></i></i>
    <i class="mr-sun">${spriteSun(3)}</i><i class="mr-vase"></i>
    <i class="mr-cat">${sprite("catback",4)}</i>
    <i class="mr-box">${badRoute?'<i class="mr-l1">* The cat was hungry.</i><i class="mr-l2">&nbsp; You walked past.</i>':'<i class="mr-l1">* Despite everything,</i><i class="mr-l2">&nbsp; it\'s still you.</i>'}</i>`, startCredits(shot);
  else shot.textContent=m.status==="lock"?"LOCKED":"FOTO / SCREENSHOT";
  const more=document.getElementById("dMore"), ml=document.getElementById("dLink");
  more.innerHTML=(m.more||MORE_PH).map(p=>"<p>"+p+"</p>").join(""); more.hidden=true;
  ml.setAttribute("aria-expanded","false"); ml.innerHTML=m.rest?(gymT?"GYM...":fat>=FAT_MAX?"GO GYM &#9654;":"FEED THE CAT &#9829;"):"LEES MEER &#9654;"; ml.disabled=!!(m.rest&&gymT); document.getElementById("dBoss").hidden=!m.rest; document.getElementById("dBoss").innerHTML=bossDone?"GO TO EINDREFLECTIE &#9654;":"GO TO BOSS &#9654;";
  document.getElementById("dSkip").hidden=!(m.rest&&!bossDone);
  if(move!==false) moveWalker(i);
  placeBoss();
  if(m.scene==="sub"||m.scene==="phish") startSlides(shot,m.scene);
}
function placeBoss(){
  const b=document.getElementById("mapBoss"); if(!b) return; b.hidden=bossDone; if(bossDone) return;
  const r=nodeEls.findIndex(x=>MISSIONS[nodeEls.indexOf(x)].rest), a=nodeEls[r], c=nodeEls[r+1]; if(!a||!c) return;
  const mp=document.getElementById("map").getBoundingClientRect(), ra=a.getBoundingClientRect(), rc=c.getBoundingClientRect();
  b.style.left=((ra.right+rc.left)/2-mp.left-b.offsetWidth/2)+"px";
}
document.getElementById("mapBossS").innerHTML=sprite("deadline",4);
document.getElementById("mapBoss").addEventListener("click",()=>openMission(MISSIONS.findIndex(x=>x.rest)));
document.getElementById("dShot").addEventListener("click",e=>{ const c=e.target.closest(".cr"); if(c) c.classList.add("done"); });
/* aftiteling eerst alleen, daarna verschijnt de hele spiegel-scène in één keer */
let crT=0;
function startCredits(shot){ clearTimeout(crT); shot.classList.remove("reveal"); shot.classList.add("rolling"); const cr=shot.querySelector(".cr"); if(!cr) return;
  const end=()=>{ clearTimeout(crT); if(!cr.isConnected) return; cr.remove(); shot.classList.remove("rolling"); void shot.offsetWidth; shot.classList.add("reveal"); };
  cr.addEventListener("click",end); crT=setTimeout(end,12000); }
/* vuilniskat: grijs, met ooglapje */
function curtainDoor(sz){ return `<span class="cdoor"><span class="cd-f">${sprite("doorframe",sz)}</span><span class="cd-c">${sprite("doorcurt",sz)}</span></span>`; }
function tcatHTML(sz){ return `<span class="tc-wrap"><span class="tc-b">${sprite("blackcat",sz)}</span><span class="tc-p">${sprite("patch",sz)}</span></span>`; }
