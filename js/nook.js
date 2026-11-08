/* een speciale plek die maar voor 1 persoon bestaat.
   - een speciale naam -> lamp-scene, oneindig hartjes, ROCK BOTTOM telt niet
   - een eigen deur naast de museumdeur -> zijn kamer met de brief */
window.Nook=(function(){
  const SP={"catsit": ["........#...#.", "........##.##.", "........#####.", "........#.#.#.", "........#####.", ".......#####..", "......######..", ".....#######..", ".....#######..", ".....########.", "#....########.", "#....########.", ".#...####.###.", "..####.##.##.."], "door": ["....####....", "..########..", ".##########.", "############", "############", "############", "############", "############", "############", "############", "############", "############", "############", "############", "############", "############", "############", "############"], "plank": ["............", "............", "............", "....#..#....", "....#..#....", "....#..#....", "....#..#....", "....#..#....", "....#..#....", "....#..#....", "....#..#....", "....#..#....", "....#..#....", "....#..#....", "....#..#....", "....#..#....", "....#..#....", "....#..#...."], "hwin": ["............", "............", "............", "............", "...##..##...", "...######...", "....####....", ".....##.....", "............", "............", "............", "............", "............", "............", "............", "............", "............", "............"], "knob": ["............", "............", "............", "............", "............", "............", "............", "............", "............", "............", ".........#..", "............", "............", "............", "............", "............", "............", "............"], "moon": ["..###.", ".##...", "##....", "##....", "##....", ".##...", "..###."], "env": ["###########", "##.......##", "#.#.....#.#", "#..#...#..#", "#...###...#", "#.........#", "###########"], "cush": ["..##########################..", ".############################.", "##############################", "##############################", ".############################."], "lamp": [".#####.", "#######", "#######", ".#####.", "...#...", "...#...", "...#...", "..###.."], "lie": ["#...#...........", "##.##...........", "#####.########..", "#.#.##########..", "###############.", ".###############", "..##############", "#####..........."], "sleep": ["#...#...........", "##.##...........", "#####.########..", "##############..", "###############.", ".###############", "..##############", "#####..........."], "stain": [".###....", "#####...", "######..", ".#####..", "..###...", "...#....", ".....##.", ".....##."], "stain2": ["..##...", ".####..", "######.", ".#####.", "..###..", ".......", "....#..", "...###."], "bear": [".##......##.", "#..#....#..#", ".##########.", ".##.####.##.", ".####..####.", "..########..", ".##########.", "############", "############", ".##########.", ".##########.", ".###....###."], "bunny": ["..#...#...", "..##..##..", "..##..##..", "..##..##..", ".########.", "##.####.##", "##########", "####..####", ".########.", "##########", ".###..###."], "frog": [".....####.", "....######", "....##.###", "....######", "..#.####..", ".#######..", "#.######..", ".#######..", "..######..", ".#######..", "#########."], "paws": ["............", "............", "............", "............", "............", "............", "............", ".##......##.", ".##......##.", "............", "............", "............"]};
  Object.assign(SP,{"bushL": ["..........##", "...###...#..", "..#...#.#...", ".#.....#....", ".#..#.......", "#..#.#......", "#.......#...", ".#.....#.#..", "#...........", "#...#.......", ".#.#.#...#..", "############"], "bushR": ["##..........", "..#...###...", "...#.#...#..", "....#.....#.", "..#.......##", ".#.#..#....#", ".......#.#.#", ".#.........#", ".#.#...#...#", "..........#.", "....#......#", "############"], "bushLf": ["..........##", "...#########", "..##########", ".###########", ".###########", "############", "############", ".###########", "############", "############", ".###########", "############"], "bushRf": ["##..........", "#########...", "##########..", "###########.", "############", "############", "############", "############", "############", "###########.", "############", "############"]});
  const get=k=>{ try{ return localStorage.getItem(k); }catch(e){ return null; } }, put=(k,v)=>{ try{ localStorage.setItem(k,v); }catch(e){} };
  const on=()=>get("nookMode")==="1";
  /* naam gecodeerd; spaties, hoofdletters en accenten tellen niet mee */
  const K=["ZGF0", "ZGF0bGU=", "ZGF0dGFubGU=", "bGVkYXQ=", "bGV0YW5kYXQ="];
  const is=n=>{ try{ const k=(n||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\u0111/g,"d").replace(/[^a-z]/g,""); return K.includes(btoa(k)); }catch(e){ return false; } };
  function spr(n,s,fl){ let m=SP[n]||SPR[n]; if(!m) return ""; if(fl) m=m.map(r=>[...r].reverse().join("")); let r="";
    m.forEach((row,y)=>[...row].forEach((c,x)=>{ if(c==="#") r+=`<rect x="${x}" y="${y}" width="1.02" height="1.02"/>`; }));
    return `<svg class="spr" shape-rendering="crispEdges" stroke="currentColor" stroke-width=".08" width="${m[0].length*s}" height="${m.length*s}" viewBox="0 0 ${m[0].length} ${m.length}" fill="currentColor" aria-hidden="true">${r}</svg>`; }
  const typer=(el,t,cb,sp)=>{ let i=0; (function ty(){ if(!el.isConnected) return; el.textContent=t.slice(0,++i); if(i<t.length) setTimeout(ty,sp||38); else if(cb) cb(); })(); };

  /* ---------- 1. de naam-scene: twee katten die elkaar knuffelen ---------- */
  /* naam-scene: een vuurvliegje vindt hem in het donker */
  function scene(done){
    const o=document.createElement("div"); o.className="drh"; o.setAttribute("role","dialog"); o.setAttribute("aria-modal","true"); o.setAttribute("aria-label","...");
    o.innerHTML=`<div class="card"><div class="fyglow"></div><i class="fy"></i><div class="txt"><p></p><p></p><p></p></div></div>`;
    document.body.appendChild(o); document.documentElement.style.overflow="hidden";
    const card=o.querySelector(".card"), fy=o.querySelector(".fy"), gl=o.querySelector(".fyglow"), T=[], L=(f,ms)=>T.push(setTimeout(f,ms)); let ended=false, raf=0;
    const W=card.clientWidth, t0=performance.now(), D=3600;
    (function step(now){ if(ended) return; const t=Math.min(1,(now-t0)/D), e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
      fy.style.left=((-10+(W/2+6)*e)+40*Math.sin(e*Math.PI*3)*(1-e))+"px"; fy.style.top=(230-140*e+30*Math.sin(e*Math.PI*5)*(1-e))+"px";
      fy.style.opacity=t<.1?t*10:(Math.sin(now/180)>.85?.4:1);
      if(t<1) raf=requestAnimationFrame(step); else { gl.classList.add("on"); fy.classList.add("big"); fy.style.opacity=1; } })(t0);
    const lines=["* ...oh. it's you.","* it's been dark here for a while.","* ...not anymore."], ps=o.querySelectorAll(".txt p"); let li=0;
    L(function nx(){ if(li>=lines.length){ L(end,3400); return; } typer(ps[li],lines[li],()=>{ li++; L(nx,600); }); },4400);
    function end(){ if(ended) return; ended=true; cancelAnimationFrame(raf); T.forEach(clearTimeout); removeEventListener("keydown",kd,true); o.style.transition="opacity .6s steps(4)"; o.style.opacity="0";
      setTimeout(()=>{ o.remove(); document.documentElement.style.overflow=""; if(done) done(); },650); }
    o.addEventListener("click",()=>{ if(li>=lines.length) end(); });
    const kd=e=>{ if(e.key==="Escape"||(e.key==="Enter"&&li>=lines.length)){ e.preventDefault(); end(); } }; addEventListener("keydown",kd,true);
  }
  /* wordt aangeroepen vanuit het naamscherm */
  function activate(){ put("nookMode","1"); if(window.Life&&Life.refresh) Life.refresh(); if(window.Ach&&Ach.refresh) Ach.refresh(); addDoor(); firefly(); }

  /* ---------- 2. zijn deur, naast de museumdeur ---------- */
  function addDoor(){ if(!on()||document.getElementById("nookDoor")) return; const sd=document.getElementById("secretDoor"); if(!sd) return;
    const d=document.createElement("button"); d.type="button"; d.id="nookDoor"; d.className="dr-bush"; d.setAttribute("aria-label","a bush"); d.title="...";
    d.innerHTML=`<span class="bd lay"><span class="nk-d1">${spr("door",5.5)}</span><span class="nk-d2">${spr("plank",5.5)}</span><span class="nk-d3">${spr("hwin",5.5)}</span><span class="nk-d4">${spr("knob",5.5)}</span></span><span class="bl"><span class="bf">${spr("bushLf",8.5)}</span><span class="bo">${spr("bushL",8.5)}</span></span><span class="br"><span class="bf">${spr("bushRf",8.5)}</span><span class="bo">${spr("bushR",8.5)}</span></span>`;
    sd.parentNode.insertBefore(d,sd.parentNode.firstChild);
    /* eens geopend blijft de struik open: de deur blijft zichtbaar */
    if(get("nookBush")==="1") d.classList.add("part","ready");
    /* de eerste zonnebloemen schuiven op zodat de struik vrij staat */
    [...sd.parentNode.children].forEach(c=>{ const l=c.style.left; if(l==="4%") c.classList.add("ds1"); else if(l==="12%") c.classList.add("ds2"); else if(c.id==="trashCan") c.classList.add("ds3"); }); sd.parentNode.removeAttribute("aria-hidden");
    /* klik 1: de struik gaat open en de deur knippert. klik 2: de deur gaat open */
    let shut=0;
    d.addEventListener("click",()=>{ if(document.querySelector(".dr")||d.classList.contains("open")) return;
      if(!d.classList.contains("part")){ d.classList.add("part"); if(window.SFX&&SFX.blip) SFX.blip(); setTimeout(()=>d.classList.add("ready"),500);
        put("nookBush","1"); return; }
      if(!d.classList.contains("ready")) return; clearTimeout(shut); d.classList.remove("ready"); d.classList.add("open"); if(window.SFX&&SFX.creak) SFX.creak();
      setTimeout(()=>room(()=>{ d.classList.remove("open"); d.classList.add("ready"); }),600); }); }
  /* ---------- 2b. een vuurvliegje dat hem de weg wijst ---------- */
  let fly=null;
  function firefly(){ if(fly||!on()||get("nookRoom")==="1") return; const bush=document.getElementById("nookDoor"); if(!bush) return;
    fly=document.createElement("i"); fly.className="nk-fly"; fly.setAttribute("aria-hidden","true"); document.body.appendChild(fly);
    let fx=14, fy=innerHeight*.55, travel=true, landed=false;
    (function journey(){ if(!travel||!fly) return; const max=Math.max(1,document.documentElement.scrollHeight-innerHeight), p=scrollY/max, W=innerWidth, m=24;
      const tx=m+(W-2*m-8)*(.5-.5*Math.cos(p*Math.PI*7)), ty=innerHeight*(.5+.12*Math.sin(p*Math.PI*14));
      fx+=(tx-fx)*.06; fy+=(ty-fy)*.06; fly.style.left=fx+"px"; fly.style.top=fy+"px"; requestAnimationFrame(journey); })();
    const io=new IntersectionObserver(es=>{ es.forEach(e=>{ if(!e.isIntersecting||landed||!fly) return; landed=true; travel=false; io.disconnect();
      const r0=fly.getBoundingClientRect(), b=bush.getBoundingClientRect(), P0={x:r0.left,y:r0.top}, P3={x:b.left+b.width/2-4,y:b.top-10};
      const C1={x:P0.x+(P0.x<innerWidth/2?300:-300),y:P0.y-160}, C2={x:P3.x+260,y:P3.y-220}, D=4200, t0=performance.now();
      const bz=(a,b,c,d,t)=>{ const u=1-t; return u*u*u*a+3*u*u*t*b+3*u*t*t*c+t*t*t*d; };
      fly.classList.add("fly");
      (function step(now){ if(!fly) return; const t=Math.min(1,(now-t0)/D), e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2, lr=34*Math.sin(Math.PI*e);
        const B=bush.getBoundingClientRect(), Q={x:B.left+B.width/2-4,y:B.top-10};       /* doel volgt mee als hij scrolt */
        fly.style.left=(bz(P0.x,C1.x,C2.x,Q.x,e)+lr*Math.cos(6*Math.PI*e)-lr)+"px"; fly.style.top=(bz(P0.y,C1.y,C2.y,Q.y,e)+lr*Math.sin(6*Math.PI*e))+"px";
        if(t<1) requestAnimationFrame(step); else land(); })(t0); }); },{threshold:.6});
    io.observe(bush);
    function land(){ const par=bush.parentNode; fly.classList.remove("fly"); fly.classList.add("land"); par.appendChild(fly);
      fly.style.left=(bush.offsetLeft+bush.offsetWidth/2-4)+"px"; fly.style.top=""; fly.style.bottom=(bush.offsetHeight+8)+"px";
      if(window.Memo&&Memo.toast) Memo.toast("* (something rustles in the bushes...)",3800); bush.classList.add("rustle"); setTimeout(()=>bush.classList.remove("rustle"),3600); } }

  /* ---------- 3. de kamer ---------- */
  /* de brief staat gecodeerd zodat hij niet zomaar in de broncode te lezen is.
     aanpassen: zie LEESMIJ onderaan dit bestand */
  const LETTER=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob("W3sidCI6ICJoaSBkYXQsIn0sIHsidCI6ICIifSwgeyJ0IjogImlmIHlvdSdyZSByZWFkaW5nIHRoaXMsIHlvdSBmb3VuZCB5b3VyIHdheSBiYWNrLi4uIn0sIHsidCI6ICJpIGxlZnQgdGhlIGxpZ2h0IG9uLCBqdXN0IGluIGNhc2UuIn0sIHsidCI6ICIifSwgeyJ0IjogImkgZG9uJ3Qga25vdyB3aGVyZSB5b3UgYXJlIG5vdywifSwgeyJ0IjogIm9yIHdobyB5b3UndmUgYmVjb21lLiJ9LCB7InQiOiAiIn0sIHsidCI6ICJzb21lIGRheXMgaSBzdGlsbCB0aGluayBhYm91dCB5b3UuIn0sIHsidCI6ICJub3QgYXMgbXVjaCBhcyBiZWZvcmUuIGJ1dCBzdGlsbC4ifSwgeyJ0IjogIiJ9LCB7InQiOiAiaXQncyBiZWVuIGEgd2hpbGUuIn0sIHsidCI6ICJ0aGUgc2Vhc29ucyBjaGFuZ2VkLiBpIGRpZCB0b28uIn0sIHsidCI6ICJhIGxpdHRsZS4uLiJ9LCB7InQiOiAiIn0sIHsidCI6ICJpIHN0aWxsIG1pc3MgeW91LiIsICJzIjogMX0sIHsidCI6ICJpIHN0aWxsIG1pc3MgeW91LiIsICJzbCI6IDF9LCB7InQiOiAiaSBob3BlIHlvdSdyZSBkb2luZyB3ZWxsLiJ9LCB7InQiOiAiaSBob3BlIHlvdSdyZSBlYXRpbmcgd2VsbC4ifSwgeyJ0IjogIiJ9LCB7InQiOiAidGhlIGNhdHMgd2lsbCBrZWVwIHlvdXIgc3BvdCB3YXJtLiJ9LCB7InQiOiAiZXZlbiBpZiB5b3UgbmV2ZXIgY29tZSBiYWNrIGZvciBpdC4ifSwgeyJ0IjogIiJ9LCB7InQiOiAiaSBsb3ZlIHlvdS4iLCAieCI6IDF9LCB7InQiOiAiIn0sIHsidCI6ICItIHlvdXJzIn0sIHsidCI6ICIwOS4wOS4yMDI2IiwgImQiOiAxfV0="),c=>c.charCodeAt(0))));
  function room(onClose){
    const v2=get("nookRoom")==="1"; if(fly){ fly.remove(); fly=null; }
    const o=document.createElement("div"); o.className="dr"; o.setAttribute("role","dialog"); o.setAttribute("aria-modal","true"); o.setAttribute("aria-label","a room");
    o.innerHTML=`<div class="card room" id="drRoom">
   <div class="win"><span class="moon"></span><i class="shoot" style="left:120px;top:20px"></i><i class="sk sk-dusk"></i><i class="sk sk-day"><i class="sun"></i></i><i class="rainl"></i></div>
   <button type="button" class="cal" aria-label="calendar" title="calendar"><i class="nail"></i><b>SEP 2023</b><span class="cg"></span></button><div class="shade"></div><div class="stand"><button type="button" class="drw" aria-label="drawer" title="open"></button></div><button type="button" class="lamp" aria-label="lamp" title="turn the light off"></button><span class="cush"></span><span class="plush p-rw" title="a white bunny"></span><span class="plush p-rg" title="a grey bunny"></span><span class="plush p-fr" title="a little dino"></span><span class="plush p-bear" title="a teddy bear"></span>
   <div class="cats"><span class="b"></span><span class="w"></span><span class="hug"></span><span class="kh"></span></div>
   <button type="button" class="ddoor rdoor" aria-label="leave" title="leave"><div class="lay"><div class="r-door"></div><div class="r-plank"></div><div class="r-win"></div><div class="r-knob"></div></div><div class="mat"></div></button><div class="fade"></div>
   <div class="book"><div class="bk-in"><div class="bk-spread"><div class="bk-pg l"><div class="bk-box"><div class="bk-art"></div></div><p class="bk-cap"></p></div><i class="bk-spine"></i><div class="bk-pg r"><div class="bk-box"><div class="bk-art"></div></div><p class="bk-cap"></p></div><i class="bk-flip"></i></div>
     <div class="bk-nav"><button type="button" class="x bk-prev" aria-label="previous">&#9664;</button><span class="bk-no"></span><button type="button" class="x bk-next" aria-label="next">&#9654;</button></div>
     <button type="button" class="x bk-close">CLOSE THE BOOK</button><p class="bk-msg" aria-live="polite"></p></div><button type="button" class="bk-drop" aria-label="something fell out"></button></div>
   <div class="pol"><div class="strip"><div class="front"><div class="fr f1"></div><div class="fr f2"></div><div class="fr f3"></div><div class="fr f4"></div><p class="sdate">31 august 2025</p></div><div class="bk"><p>one of my favourite days.</p></div></div><div class="pbtn"><button type="button" class="x pflip">TURN OVER</button><button type="button" class="x px">PUT IT BACK</button></div></div>
   <button type="button" class="env" aria-label="letter"><span class="e"></span><span class="seal"></span></button>
   <p class="dlg" aria-live="polite"></p>
   <div class="letter"><div class="paper"><span class="stain" style="right:26px;top:150px"></span><span class="stain big" style="left:40%;top:300px"></span><span class="stain sm" style="left:20px;top:70px"></span><span class="stain" style="right:60px;top:430px"></span><span class="stain sm" style="right:140px;top:250px"></span><div class="lt"></div><button type="button" class="x lx">FOLD IT BACK</button></div></div>
  </div>`;
    document.body.appendChild(o); document.documentElement.style.overflow="hidden";
    const $=q=>o.querySelector(q), R=$("#drRoom"), T2=[], later=(f,ms)=>T2.push(setTimeout(f,ms));
    let joined=false, woke=false, shower=0, tT=0, dT=0, wished=v2, alone=v2, read=v2, leaving=false, closed=false;
    $(".r-door").innerHTML=spr("door",5); $(".r-plank").innerHTML=spr("plank",5); $(".r-win").innerHTML=spr("hwin",5); $(".r-knob").innerHTML=spr("knob",5);
    $(".moon").innerHTML=spr("moon",4); $(".lamp").innerHTML=spr("lamp",6)+'<i class="chain"></i>'; $(".cush").innerHTML=spr("cush",6);
    const teddy=s=>spr("bear",s)+`<i class="th" style="left:${2.5*s}px;top:${5.5*s}px">${spr("heart",s)}</i><i class="tp">${spr("paws",s)}</i>`;
    $(".p-rw").innerHTML=spr("bunny",2); $(".p-rg").innerHTML=spr("bunny",2); $(".p-fr").innerHTML=spr("frog",3); $(".p-bear").innerHTML=teddy(3); $(".cats .hug").innerHTML=teddy(2);
    $(".cats .b").innerHTML=spr("catsit",6); $(".cats .kh").innerHTML=spr("heart",2); $(".cats .w").innerHTML=spr("catsit",3,1);
    $(".env .e").innerHTML=spr("env",6); $(".env .seal").innerHTML=spr("heart",2);
    o.querySelectorAll(".stain").forEach((e,i)=>e.innerHTML=spr(i%2?"stain2":"stain",e.classList.contains("big")?7:e.classList.contains("sm")?3:5));
    const win=$(".win"); for(let i=0;i<42;i++){ win.insertAdjacentHTML("beforeend",`<i class="star${i%3?" s":""}" style="left:${4+Math.random()*92}%;top:${4+Math.random()*90}%;animation-delay:${(Math.random()*2).toFixed(2)}s"></i>`); }
    /* het raam volgt de echte tijd: dag, avond of nacht. soms regent het (1 op 4) */
    const hr=new Date().getHours(); let skyK=hr>=7&&hr<17?"day":hr>=17&&hr<20?"dusk":"night";
    const setSky=k=>{ skyK=k; win.classList.remove("day","dusk","night"); win.classList.add(k); }; setSky(skyK);
    if(Math.random()<.25) R.classList.add("rain");
    { const rl=$(".rainl"); let h=""; for(let i=0;i<34;i++) h+=`<i class="drop" style="left:${Math.random()*98}%;animation-delay:-${(Math.random()*1.2).toFixed(2)}s;animation-duration:${(.7+Math.random()*.5).toFixed(2)}s"></i>`; rl.innerHTML='<i class="cloud"></i>'+h; }
    { let h=""; for(let i=0;i<4;i++) h+='<i class="e"></i>'; for(let d=1;d<=30;d++) h+=`<i${d===9?' class="c"':""}></i>`; $(".cg").innerHTML=h; }
    { const P=(cls,html,st)=>`<span class="${cls}" style="${st}">${html}</span>`;
      $(".f1").innerHTML=P("br",spr("catfront",5),"left:22px")+P("wh",spr("catfront",3),"left:86px");
      $(".f2").innerHTML=P("br",spr("catfront",5),"left:22px")+P("wh",spr("catfront",3),"left:86px;bottom:26px;transform:rotate(12deg)");
      $(".f3").innerHTML=P("br",spr("catsit",5),"left:16px")+P("wh",spr("catsit",3,1),"left:72px;transform:rotate(-8deg) translateX(-4px)")+P("ht",spr("heart",2),"left:72px;top:6px");
      $(".f4").innerHTML=P("br",spr("lie",5,1),"left:28px")+P("wh",spr("catfront",3),"left:62px;bottom:36px"); }
    /* als er nog een vraag openstaat en er wordt iets anders gezegd, komt de vraag daarna terug */
    let pending=null, askT=0;
    /* bijzaken (knuffels, kalender, aaien) praten alleen als het verhaal even stil is */
    let storyUntil=0, sideOn=false;
    function side(t){ if(pending||Date.now()<storyUntil) return; sideOn=true; say(t,true); sideOn=false; }
    function say(t,own){ if(!sideOn) storyUntil=Date.now()+t.length*38+2200; if(!own&&pending){ const pq=pending; clearTimeout(askT); askT=setTimeout(()=>{ if(pending===pq&&!closed) ask(pq.q,pq.cb); },t.length*38+1800); T2.push(askT); }
      const d=$(".dlg"); clearTimeout(dT); d.textContent=""; d.classList.add("on"); let i=0; (function ty(){ if(closed) return; d.textContent=t.slice(0,++i); if(i<t.length) dT=setTimeout(ty,38); })(); }
    function ask(q,cb){ const d=$(".dlg"), me={q,cb}; pending=me; say(q,true); later(()=>{ if(closed||pending!==me||d.textContent!==q) return; const c=document.createElement("span"); c.className="choice"; const hs=`<i class="hs">${spr("heart",1.5)}</i>`; c.innerHTML=`<button type="button" data-v="1">${hs}YES</button><button type="button" data-v="0">${hs}NO</button>`; d.appendChild(c);
        c.addEventListener("click",e=>{ const b=e.target.closest("button"); if(!b) return; c.remove(); pending=null; clearTimeout(askT); cb(b.dataset.v==="1"); }); c.querySelector("button").focus({preventScroll:true}); },q.length*38+300); }
    function burst(){ for(let i=0;i<3;i++) setTimeout(()=>{ if(closed||!R.classList.contains("dark")||skyK!=="night"||R.classList.contains("rain")) return; const e=document.createElement("i"); e.className="fall"; e.style.left=(40+Math.random()*60)+"%"; e.style.top=(Math.random()*40)+"%"; win.appendChild(e); setTimeout(()=>e.remove(),1400); }, i*350+Math.random()*200); }
    function close(){ if(closed) return; closed=true; T2.forEach(clearTimeout); clearInterval(shower); clearTimeout(tT); clearTimeout(dT); removeEventListener("keydown",kd); o.remove(); document.documentElement.style.overflow=""; if(onClose) onClose(); }
    const kd=e=>{ if(e.key!=="Escape") return; const bk=$(".book"); if($(".pol").classList.contains("on")) $(".px").click(); else if(bk&&bk.classList.contains("on")) $(".bk-close").click(); else close(); }; addEventListener("keydown",kd);
    /* lade met fotostrip */
    /* ---- het fotoboek ---- */
    const P=(x,y,w,h,c,extra)=>`<i style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${c};${extra||""}"></i>`;
    const CATS=(x,y,s)=>`<span class="ac" style="left:${x}px;top:${y}px"><span style="color:#b5794a">${spr("catsit",s||3)}</span><span style="color:#fff;margin-left:-${(s||3)*3}px">${spr("catsit",(s||3)*.6,1)}</span></span>`;
    const sky=(c1,c2)=>P(0,0,360,240,`linear-gradient(${c1},${c2})`);
    const stars=n=>Array.from({length:n},()=>P(Math.random()*356,Math.random()*110,2,2,"#fff","opacity:.8")).join("");
    /* [naam, x, y, label-dx, label-dy] in volgorde van de reis */
    const PLACES=[["amsterdam",112,96,-86,-20],["hasselt",130,140,10,4],["brussels",96,148,-70,8],["sandefjord",250,34,10,-8],["emmen",168,82,10,-14],["genova",188,212,-60,6],["milano",224,196,10,-8],["düsseldorf",176,124,10,-6]];
    const mx=x=>x, my=y=>y;
    const PAGES=[
      ["our map",()=>P(0,0,360,240,"#e9dcc0")+`<svg class="bk-svg" width="360" height="240"><polyline points="${PLACES.map(p=>p[1]+","+p[2]).join(" ")}" fill="none" stroke="#b33" stroke-width="2" stroke-dasharray="5 4"/></svg>`
        +PLACES.map(p=>`<i class="bk-pin" style="left:${p[1]-4}px;top:${p[2]-4}px"></i><b class="bk-lbl" style="left:${p[1]+p[3]}px;top:${p[2]+p[4]}px">${p[0]}</b>`).join("")+P(18,14,22,22,"none","border:2px solid #6b5a44;border-radius:50%")+`<b class="bk-lbl" style="left:24px;top:-2px">N</b>`],
      ["amsterdam",()=>sky("#9cc7e8","#d6ecf7")+[["#c45a3c",30,70],["#e2b04a",70,58],["#3c6e8f",110,74],["#7a4e2c",150,62],["#c45a3c",190,70],["#5c8a4a",230,56],["#e2b04a",270,66],["#3c6e8f",310,72]].map(([c,x,y])=>P(x,y,40,170-y,c)+P(x+8,y-10,24,10,c)+P(x+15,y-16,10,6,c)+P(x+8,y+14,8,10,"#fff8")+P(x+24,y+14,8,10,"#fff8")+P(x+8,y+40,8,10,"#fff8")+P(x+24,y+40,8,10,"#fff8")).join("")+P(0,170,360,8,"#6b6b6b")+P(0,178,360,62,"#3d6f8e")+P(20,196,320,2,"#ffffff55")+P(80,214,200,2,"#ffffff44")+CATS(150,128,3)],
      ["hasselt",()=>P(0,0,360,240,"#e8dcc4")+P(0,180,360,60,"#a8865e")+P(40,40,90,80,"#9cc7e8","border:6px solid #fff")+P(226,22,84,56,"#fff","border:4px solid #7a4e2c")+`<b class="bk-lbl" style="left:236px;top:84px">+ brussels</b>`+P(264,32,6,6,"#9aa")+P(252,44,6,6,"#9aa")+P(276,44,6,6,"#9aa")+P(264,56,6,6,"#9aa")+P(258,50,18,1,"#9aa")+P(266,38,2,24,"#9aa")+P(150,120,120,10,"#7a4e2c")+P(158,130,8,50,"#7a4e2c")+P(254,130,8,50,"#7a4e2c")+P(170,92,40,28,"#333")+P(174,96,32,18,"#8fd")+P(232,96,10,24,"#f2c14e")+P(26,150,110,30,"#c66","border-radius:4px")+CATS(48,98,3)],
      ["sandefjord",()=>P(0,0,360,240,"#e6efe9")+P(0,196,360,44,"#c8b59a")
        +P(120,20,120,84,"#0d2238","border:6px solid #fff")+P(126,30,108,14,"linear-gradient(90deg,transparent,#3fe08a99,transparent)","transform:skewY(-6deg)")+`<svg class="bk-svg" width="360" height="240"><polygon points="126,104 156,64 176,90 200,56 234,104" fill="#2c3e50"/><polygon points="200,56 192,68 208,68" fill="#fff"/></svg>`
        +P(0,130,250,66,"#9c7a52")+P(0,126,250,6,"#e9e2d6")+P(30,140,40,40,"#8a6a44","border:2px solid #6b5132")+P(90,140,40,40,"#8a6a44","border:2px solid #6b5132")
        +P(150,112,70,16,"#444")+P(160,104,20,10,"#222","border-radius:2px")+P(176,108,16,3,"#555")+P(196,106,18,8,"#777","border-radius:0 0 6px 6px")+P(200,94,2,10,"#ffffff99")+P(206,90,2,14,"#ffffff99")
        +P(276,40,64,156,"#f4f4f4","border:2px solid #ccc")+P(276,96,64,2,"#ccc")+P(330,60,4,20,"#bbb")+P(330,108,4,30,"#bbb")+P(286,50,10,10,"#f2c14e")+P(300,52,8,8,"#7fc36a")
        +CATS(40,74,3)],
      ["emmen",()=>sky("#bfe0f5","#eaf6fb")+P(0,170,360,70,"#7bb661")+P(70,120,60,40,"#8a8a8a","border-radius:40% 40% 10% 10%")+P(140,112,80,48,"#9a9a9a","border-radius:45% 45% 10% 10%")+P(60,156,170,18,"#7a7a7a","border-radius:6px")+P(260,96,70,74,"#c45a3c")+P(252,84,86,16,"#7a3a2c")+P(284,140,18,30,"#7a4e2c")+P(270,110,14,14,"#f2e6a0")+P(306,110,14,14,"#f2e6a0")+CATS(150,158,3)],
      ["back and forth",()=>sky("#7fb6e6","#f6d7b0")
        +[[30,40,70],[250,30,80],[150,180,90],[40,170,60]].map(([x,y,w])=>P(x,y,w,14,"#fff","border-radius:8px")+P(x+12,y-8,w/2,14,"#fff","border-radius:8px")).join("")
        +`<svg class="bk-svg" width="360" height="240"><path d="M20 210 Q 180 -20 340 70" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="5 5"/><path d="M340 90 Q 200 260 20 226" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="5 5" opacity=".6"/></svg>`
        +P(90,96,190,40,"#f4f4f4","border-radius:20px 40px 40px 20px")+P(250,100,30,30,"#9cc7e8","border-radius:0 30px 30px 0")+P(150,78,40,22,"#e0e0e0","transform:skewX(-30deg)")+P(150,132,40,22,"#e0e0e0","transform:skewX(30deg)")+P(92,80,22,22,"#c33","transform:skewX(-20deg)")+P(90,130,190,4,"#c33")
        +[120,150,180,210].map(x=>P(x,106,16,14,"#bfe6ff","border-radius:4px")).join("")
        +`<span class="ac" style="left:150px;top:104px"><span style="color:#b5794a">${spr("catfront",1.3)}</span></span><span class="ac" style="left:182px;top:107px"><span style="color:#fff">${spr("catfront",1.05)}</span></span>`],
      ["genova",()=>sky("#8ec5ec","#cde9f8")+P(0,150,360,90,"#2f7fb5")+P(0,190,360,2,"#ffffff55")+["#e8a33d","#d9644a","#f1d27a","#c9765a","#e9c46a"].map((c,i)=>P(i*34,90+(i%2)*10,34,60-(i%2)*10,c)+P(i*34+10,104,8,10,"#fff9")).join("")+P(276,40,20,110,"#fff")+[52,72,92,112].map(y=>P(276,y,20,8,"#c33")).join("")+P(272,30,28,12,"#444")+P(280,22,12,10,"#f2c14e","box-shadow:0 0 14px #f2c14e")+P(190,170,50,10,"#fff","border-radius:0 0 12px 12px")+P(212,148,3,22,"#7a4e2c")+P(215,150,18,16,"#fff")+CATS(110,108,3)],
      ["milano",()=>sky("#c9dbe8","#eef3f6")+P(0,190,360,50,"#cfc6b5")+P(70,90,220,100,"#efe9dc")+[70,100,130,160,190,220,250,282].map((x,i)=>P(x,46+(i%3)*12,8,46-(i%3)*12+44,"#e4dccb")+P(x+2,38+(i%3)*12,4,10,"#d8cfbc")).join("")+P(160,130,40,60,"#a8865e","border-radius:20px 20px 0 0")+[90,120,230,260].map(x=>P(x,120,14,30,"#a9b8c4","border-radius:7px 7px 0 0")).join("")+P(176,60,8,8,"#f2c14e")+CATS(40,148,3)+P(268,196,76,10,"#555","border-radius:4px")+P(272,176,68,24,"#777","border-radius:0 0 30px 30px")+P(276,178,30,10,"#c8281e","border-radius:6px")+P(306,178,30,10,"#f0d68a","border-radius:6px")+P(305,176,2,14,"#555")+P(270,174,72,4,"#888")+[284,304,324].map((x,i)=>P(x,150-(i%2)*6,3,18,"#ffffffaa","border-radius:2px;filter:blur(1px)")).join("")+P(330,150,2,32,"#7a4e2c","transform:rotate(18deg)")+P(336,150,2,32,"#7a4e2c","transform:rotate(18deg)")],
      ["düsseldorf",()=>sky("#f3c49b","#b9d3ea")+P(0,170,360,70,"#4a7ea8")+P(0,200,360,2,"#ffffff55")+P(250,20,8,150,"#ddd")+P(240,50,28,14,"#bbb","border-radius:6px")+P(252,8,4,14,"#c33")+[0,40,80,120,160].map(x=>P(x,120,40,50,["#d8c7a8","#c9a27a","#e3d5b8","#b98e66","#d8c7a8"][x/40])).join("")+P(10,128,8,10,"#fff8")+P(90,128,8,10,"#fff8")+P(170,128,8,10,"#fff8")+`<i class="bk-slot"></i>`+CATS(196,124,3)+P(286,196,62,18,"#fff","border-radius:2px 2px 8px 8px")+[290,302,314,326,338].map((x,i)=>P(x,190+(i%2)*2,10,8,"#a8552e","border-radius:3px")).join("")+P(288,188,58,6,"#c8281e","border-radius:3px")+[292,304,318,330,340].map(x=>P(x,187,2,2,"#e8b22e")).join("")+P(344,176,2,16,"#d9d9d9")+P(342,174,6,4,"#d9d9d9")],
      ["...next?",()=>P(0,0,360,240,"#f4ead2")+`<b class="bk-q">?</b>`]];
    /* links en rechts een pagina, zoals een echt boek; op een smal scherm 1 pagina tegelijk */
    let bmT=0; function bookSay(t){ const m=$(".bk-msg"); clearTimeout(bmT); m.textContent=""; let i=0; (function ty(){ if(closed) return; m.textContent=t.slice(0,++i); if(i<t.length) bmT=setTimeout(ty,38); })(); }
    let sp=0, dropped=false, tucked=false; const one=()=>innerWidth<640, per=()=>one()?1:2, nSp=()=>Math.ceil(PAGES.length/per());
    function fit(){ const W=one()?Math.min(360,innerWidth-70):Math.min(360,(Math.min(innerWidth,980)-110)/2); o.querySelectorAll(".bk-box").forEach(bx=>{ bx.style.width=W+"px"; bx.style.height=(W*2/3)+"px"; bx.firstChild.style.transform=`scale(${W/360})`; }); $(".book").classList.toggle("one",one()); }
    function fill(){ const pgs=o.querySelectorAll(".bk-pg"); [0,1].forEach(k=>{ const i=sp*per()+k, el=pgs[k]; if(k===1&&one()){ el.style.display="none"; return; } el.style.display="";
        const pgD=PAGES[i]; el.querySelector(".bk-art").innerHTML=pgD?pgD[1]():""; el.querySelector(".bk-cap").textContent=pgD?pgD[0]:""; el.classList.toggle("blank",!pgD); });
      $(".bk-no").textContent=(sp+1)+" / "+nSp(); $(".bk-prev").disabled=sp===0; $(".bk-next").disabled=sp>=nSp()-1;
      const slot=$(".bk-slot"); if(slot&&tucked) slot.classList.add("full");
      /* in düsseldorf valt de fotostrip eruit */
      if(slot&&!dropped&&!tucked){ dropped=true; later(()=>{ const d=$(".bk-drop"); d.classList.add("on"); later(()=>window.SFX&&SFX.drop&&SFX.drop(),1300); bookSay("* (something slipped out from between the pages.)"); },900); } }
    /* zacht blad-geluid: kort, stil geritsel (eigen geluid, veel zachter dan de rest) */
    let actx=null; function leaf(){ try{ if(!window.SFX||SFX.on===false) return; actx=actx||new (window.AudioContext||window.webkitAudioContext)(); const c=actx, d=.22, n=Math.floor(c.sampleRate*d), buf=c.createBuffer(1,n,c.sampleRate), x=buf.getChannelData(0);
        for(let i=0;i<n;i++){ const t=i/n; x[i]=(Math.random()*2-1)*Math.sin(Math.PI*t)*(.6+.4*Math.sin(t*40)); }
        const src=c.createBufferSource(), f=c.createBiquadFilter(), g=c.createGain(); src.buffer=buf; f.type="bandpass"; f.frequency.value=2600; f.Q.value=.7; g.gain.value=.025; src.connect(f).connect(g).connect(c.destination); src.start(); }catch(e){} }
    function turn(dir){ const ns=Math.max(0,Math.min(nSp()-1,sp+dir)); if(ns===sp) return; const fl=$(".bk-flip"); leaf();
      fl.className="bk-flip "+(dir>0?"fwd":"back"); void fl.offsetWidth; fl.classList.add("go"); sp=ns; setTimeout(fill,220); }
    $(".drw").onclick=()=>{ $(".drw").classList.add("open"); setTimeout(()=>{ $(".book").classList.add("on"); fit(); fill(); leaf(); },450); };
    addEventListener("resize",()=>{ if($(".book").classList.contains("on")){ const p0=sp*per(); fit(); sp=Math.floor(p0/per()); fill(); } });
    $(".bk-prev").onclick=()=>turn(-1); $(".bk-next").onclick=()=>turn(1);
    { let sx=null; const sw=$(".bk-spread"); sw.addEventListener("pointerdown",e=>{ sx=e.clientX; }); sw.addEventListener("pointerup",e=>{ if(sx==null) return; const dx=e.clientX-sx; sx=null; if(Math.abs(dx)>40) turn(dx<0?1:-1); }); }
    const bkKey=e=>{ if(!$(".book").classList.contains("on")||$(".pol").classList.contains("on")) return; if(e.key==="ArrowRight") turn(1); if(e.key==="ArrowLeft") turn(-1); }; addEventListener("keydown",bkKey);
    $(".bk-close").onclick=()=>{ $(".bk-msg").textContent=""; $(".book").classList.remove("on"); $(".bk-drop").classList.remove("on"); setTimeout(()=>$(".drw").classList.remove("open"),200); };
    $(".book").addEventListener("click",e=>{ if(e.target===$(".book")) $(".bk-close").click(); });   /* naast het boek klikken = dichtdoen */
    $(".bk-drop").onclick=()=>{ $(".bk-drop").classList.remove("on"); $(".pol").classList.add("on"); };
    $(".pflip").onclick=()=>{ const st=$(".strip"); st.classList.remove("turn"); void st.offsetWidth; st.classList.add("turn"); setTimeout(()=>{ st.classList.toggle("back"); $(".pflip").textContent=st.classList.contains("back")?"TURN BACK":"TURN OVER"; },250); };
    /* terugleggen: de strip schuift terug in het boek, op de pagina van düsseldorf */
    $(".px").onclick=()=>{ $(".strip").classList.remove("back"); $(".pflip").textContent="TURN OVER"; $(".pol").classList.remove("on"); tucked=true; const sl=$(".bk-slot"); if(sl) sl.classList.add("full"); if($(".book").classList.contains("on")) bookSay("* (you tuck it back where it belongs.)"); else say("* (you tuck it back where it belongs.)"); };
    /* kalender */
    $(".cal").onclick=()=>{ const cl=$(".cal"); cl.classList.remove("wig"); void cl.offsetWidth; cl.classList.add("wig"); if(pending||Date.now()<storyUntil) return; side("* (9 september 2023. nobody turned the page.)"); later(()=>{ sideOn=true; say("* time stood still here.",true); sideOn=false; },2600); };
    /* wens */
    function maybeWish(extra){ if(!alone||wished||!R.classList.contains("dark")) return; wished=true;
      later(()=>{ if(!R.classList.contains("dark")){ wished=false; return; } $(".cats .w").innerHTML=spr("catback",3); later(()=>say("* the cat made a wish. it didn't say what."),900); later(()=>{ $(".rdoor").classList.add("call"); say("* (let her rest now. the door is open.)"); },4800); },2600+(extra||0)); }
    /* haar aaien */
    $(".cats .w").addEventListener("click",()=>{ if(leaving||joined) return; const w=$(".cats .w"), kh=$(".cats .kh");
      if(v2&&!woke||(v2&&w.innerHTML.includes("zz"))){ w.classList.remove("wig"); void w.offsetWidth; w.classList.add("wig"); side("* (she shifts a little in her sleep.)"); return; }
      if(window.SFX&&SFX.pet) SFX.pet(); kh.style.left="98px"; kh.style.top="18px"; kh.classList.remove("on"); void kh.offsetWidth; kh.classList.add("on"); });
    /* knuffels: wat ze betekenen */
    const PL={".p-rw":"* (two small rabbits. you got them for her. she never lets them sit apart.)",".p-rg":"* (two small rabbits. you got them for her. she never lets them sit apart.)",
      ".p-fr":"* (the dino you won for her at walibi. she still brags about it.)",".p-bear":"* (her very first plushie. from you. the heart is a little worn from hugging.)",".cats .hug":"* (her very first plushie. from you. the heart is a little worn from hugging.)"};
    Object.keys(PL).forEach(k=>$(k).addEventListener("click",e=>{ e.stopPropagation(); if(leaving) return; const el=$(k); el.classList.remove("wig"); void el.offsetWidth; el.classList.add("wig"); side(PL[k]); }));
    /* lamp: werkt pas als ze alleen is */
    $(".lamp").onclick=()=>{ const L=$(".lamp"); L.classList.remove("pull"); void L.offsetWidth; L.classList.add("pull"); if(v2){ if(!leaving) say("* (better leave it off. she's sleeping.)"); return; } if(!alone||leaving) return;
      const d=R.classList.toggle("dark"); L.title=d?"turn the light on":"turn the light off"; clearInterval(shower);
      if(d){ /* het licht gaat uit: de lucht wordt nacht, de regen stopt, zodat ze een wens kan doen */
        let wait=0; if(R.classList.contains("rain")){ R.classList.remove("rain"); wait=2200; } if(skyK!=="night"){ setSky("night"); wait=3200; }
        if(wait&&!wished) say("* (time passes...)"); setTimeout(burst,500+wait); shower=setInterval(burst,1300); maybeWish(wait); } else if(!v2) $(".cats .w").innerHTML=spr("catfront",3); };
    /* brief */
    $(".env").onclick=()=>{ $(".letter").classList.add("on"); const box=$(".lt"), pap=$(".paper"); box.innerHTML=""; pap.scrollTop=0; $(".lx").style.visibility="hidden"; const ps=[]; let li=0,ci=0; clearTimeout(tT);
      /* al eens gelezen: meteen de hele brief, zonder typen */
      if(get("nookRead")==="1"){ LETTER.forEach(l=>{ const p=document.createElement("p"); p.className=l.s?"st now":l.d?"dt":l.x?"sx":""; box.appendChild(p); if(l.x) scratch(p,l.t); else p.textContent=l.t; }); read=true; $(".lx").style.visibility=""; return; }
      const line=i=>{ if(!ps[i]){ const l=LETTER[i], p=document.createElement("p"); p.className=l.d?"dt":l.x?"sx":""; box.appendChild(p); ps[i]=p; } return ps[i]; };
      const follow=p=>{ const need=p.offsetTop+p.offsetHeight+70-pap.clientHeight; if(need>pap.scrollTop) pap.scrollTop=need; };
      (function ty(){ if(closed) return; if(li>=LETTER.length){ read=true; put("nookRead","1"); $(".lx").style.visibility=""; follow($(".lx")); return; } const t=LETTER[li].t; if(!t.length){ line(li); li++; tT=setTimeout(ty,250); return; }
        if(LETTER[li].x){ scratch(line(li),t); follow(ps[li]); li++; ci=0; tT=setTimeout(ty,700); return; }
        ci++; const p=line(li); p.textContent=t.slice(0,ci); follow(p);
        if(ci>=t.length){ const sp=LETTER[li].s; li++; ci=0; if(sp){ tT=setTimeout(()=>{ p.classList.add("st"); tT=setTimeout(ty,2600); },700);   /* even nadenken... */ } else tT=setTimeout(ty,350); } else tT=setTimeout(ty,LETTER[li].s?70:LETTER[li].sl?95:38); })(); };
    function scratch(p,t){ p.innerHTML=`<span>${t}</span>`; const sp=p.firstChild, W=sp.offsetWidth+12, H=sp.offsetHeight+12, Z=3;
      const c=document.createElement("canvas"); c.width=Math.ceil(W/Z); c.height=Math.ceil(H/Z); c.style.width=W+"px"; c.style.height=H+"px"; c.title="scratch"; p.appendChild(c);
      const g=c.getContext("2d"); g.fillStyle="#2a1c10"; g.globalAlpha=.88; g.fillRect(1,1,c.width-2,c.height-2); g.globalAlpha=1;
      for(let k=0;k<5;k++){ let x=0,y=2+Math.random()*(c.height-4); g.beginPath(); g.moveTo(x,y); while(x<c.width){ x+=2+Math.random()*3; y=Math.max(0,Math.min(c.height,y+(Math.random()*8-4))); g.lineTo(x,y); } g.lineWidth=2; g.strokeStyle="#1a1008"; g.stroke(); }
      const total=c.width*c.height; let down=false, done=false;
      const rub=e=>{ if(done) return; const r=c.getBoundingClientRect(), x=(e.clientX-r.left)/Z, y=(e.clientY-r.top)/Z; g.globalCompositeOperation="destination-out"; g.fillRect(Math.floor(x)-2,Math.floor(y)-2,5,5); g.globalCompositeOperation="source-over";
        const d=g.getImageData(0,0,c.width,c.height).data; let left=0; for(let i=3;i<d.length;i+=4) if(d[i]>30) left++;
        if(left/total<.35){ done=true; c.style.transition="opacity .6s steps(4)"; c.style.opacity="0"; setTimeout(()=>c.remove(),700); } };
      c.addEventListener("pointerdown",e=>{ down=true; c.setPointerCapture(e.pointerId); rub(e); });
      c.addEventListener("pointermove",e=>{ if(down||(e.pointerType==="mouse"&&e.buttons)) rub(e); });
      c.addEventListener("pointerup",()=>down=false);
      setTimeout(()=>p.classList.add("wig"),1500); }
    /* afscheid: laatste kus, weglopen, 1 keer omkijken, door de deur */
    function goodbye(){ const b=$(".cats .b"), kh=$(".cats .kh"), D=$(".rdoor"); let x=22, f=0, phase=0, tick=0;
      b.style.transform="rotate(7deg) translateX(10px)"; later(()=>kh.classList.add("on"),500);
      later(()=>{ kh.classList.remove("on"); b.style.transform="none"; },2300);
      const step=()=>{ if(closed){ clearInterval(tick); return; } f^=1; const dr=D.getBoundingClientRect(), cr=$(".cats").getBoundingClientRect(), stopX=dr.left+dr.width/2-cr.left-48;
        if(phase===0){ x+=8; b.innerHTML=spr(f?"blackcat2":"blackcat",6); b.style.left=x+"px"; if(x>=150){ phase=1; clearInterval(tick); b.innerHTML=spr("blackcat",6,1); later(()=>{ phase=2; tick=setInterval(step,200); },1400); } }
        else if(phase===2){ x+=10; b.innerHTML=spr(f?"blackcat2":"blackcat",6); b.style.left=x+"px"; if(x>=stopX-60) D.classList.add("open");
          if(x>=stopX){ clearInterval(tick); b.style.visibility="hidden"; later(()=>D.classList.remove("open"),700); alone=true; $(".cats .w").innerHTML=spr("catfront",3); R.classList.add("alone","lhint"); maybeWish();
            later(()=>{ if(!R.classList.contains("dark")&&!leaving) say("* (it's late. turn off the light for her.)"); },2500); } } };
      later(()=>{ b.innerHTML=spr("blackcat",6); tick=setInterval(step,200); },2900); }
    $(".lx").onclick=()=>{ clearTimeout(tT); $(".letter").classList.remove("on"); if(!read||alone) return; say("* (there's no stamp. it was never sent.)"); later(goodbye,3200); };
    /* weggaan: het licht gaat uit achter je, zij gaat slapen */
    $(".rdoor").onclick=()=>{ if(leaving) return;
      /* de deur gaat pas open als het verhaal klaar is: eerst de brief, dan het licht uit */
      const Dd=$(".rdoor"); if(!Dd.classList.contains("call")){ Dd.classList.remove("rattle"); void Dd.offsetWidth; Dd.classList.add("rattle"); if(window.SFX&&SFX.locked) SFX.locked();
        say(v2?"* (not yet. she's right there.)":!read?"* (not yet. there's a letter for you.)":!alone?"* (wait...)":!R.classList.contains("dark")?"* (it's late. turn off the light for her.)":"* (wait...)"); return; }
      leaving=true; const D=$(".rdoor"), w=$(".cats .w"), wasDark=R.classList.contains("dark"); D.classList.remove("call"); D.classList.add("open");
      if(!wasDark){ R.classList.add("dark"); R.classList.remove("lhint"); } clearInterval(shower);
      if(joined){ const b=$(".cats .b"); b.style.visibility="hidden"; }
      say(v2?(joined?"* (you get up quietly. she doesn't wake.)":woke?"* (behind you, she curls up again.)":"* (you close the door softly.)"):wasDark?"* (behind you, she tries to sleep.)":"* (behind you, the light turns off.)");
      if(alone&&!v2){ later(()=>{ w.innerHTML=spr("lie",3); w.style.bottom="0"; },1400); later(()=>w.innerHTML=spr("sleep",3),2400); later(()=>w.innerHTML=spr("lie",3),3400);
        later(()=>{ w.innerHTML=spr("sleep",3)+'<i class="zz" style="left:2px;top:-14px">z</i>'; },4200); }
      const tEnd=alone&&!v2?7200:3600;
      later(()=>$(".fade").classList.add("on"),tEnd);
      later(()=>{ if(alone) put("nookRoom","1"); close(); if(window.Ach&&alone) Ach.earn("wayback"); },tEnd+1600); };
    /* start */
    /* bij haar komen liggen: de bruine kat komt binnen en krult zich naast haar op */
    function join(){ joined=true; const b=$(".cats .b"), D=$(".rdoor"), kh=$(".cats .kh"), dr=D.getBoundingClientRect(), cr=$(".cats").getBoundingClientRect();
      let x=dr.left+dr.width/2-cr.left-48, f=0; const stop=4;
      D.classList.add("open"); b.style.cssText=""; b.style.left=x+"px"; b.style.visibility=""; b.innerHTML=spr("blackcat",5,1);
      later(()=>D.classList.remove("open"),900);
      const tick=setInterval(()=>{ if(closed){ clearInterval(tick); return; } f^=1; x-=10; b.innerHTML=spr(f?"blackcat2":"blackcat",5,1); b.style.left=x+"px";
        if(x<=stop){ clearInterval(tick); b.style.left=stop+"px"; b.innerHTML=spr("lie",5,1);
          const J=woke?["* (you curl up next to her.)","* (for a moment, nothing else matters.)","* (she always wished it could be like this.)","* (...maybe it still can be.)"]
                     :["* (you curl up next to her. she doesn't wake.)","* (but she moves a little closer.)","* (maybe she thinks it's a dream.)","* (...maybe it's a good one.)"];
          later(()=>{ b.innerHTML=spr("sleep",5,1); say(J[0]); b.style.transition="left 1s steps(5)"; b.style.left=(stop+12)+"px"; },900);   /* hij schuift dichter tegen haar aan */
          later(()=>{ kh.style.left="84px"; kh.style.top="34px"; kh.classList.remove("on"); void kh.offsetWidth; kh.classList.add("on"); },1700);
          later(()=>{ say(J[1]); if(!woke){ const w=$(".cats .w"), hg=$(".cats .hug"); [w,hg].forEach(e=>{ e.style.transition="transform 1.2s steps(6)"; e.style.transform="translateX(-16px)"; }); } },4400);   /* ze schuift echt een stukje dichterbij */
          later(()=>say(J[2]),8400);
          later(()=>say(J[3]),12600);
          /* hij blijft: geen deur meer, het beeld vervaagt langzaam terwijl ze samen slapen */
          later(()=>{ const fd=$(".fade"); fd.style.transition="opacity 4s steps(10)"; fd.classList.add("on"); },17000);
          later(()=>close(),21800); } },200); T2.push(tick); }
    /* tweede bezoek: donker, zij slaapt. wakker maken? */
    if(v2){ R.classList.add("holding"); $(".env").className="env under"; $(".env").title="..."; $(".cats .b").style.visibility="hidden"; R.classList.add("alone","dark"); $(".lamp").title="turn the light on";
      setTimeout(burst,1500); shower=setInterval(burst,4200);
      const w=$(".cats .w"), zz='<i class="zz" style="left:2px;top:-14px">z</i>'; w.style.bottom="0"; w.innerHTML=spr("sleep",3)+zz;
      later(()=>say("* (it's dark. she fell asleep waiting.)"),1200);
      later(()=>ask("* wake her up?",yes=>{
        if(yes){ woke=true; w.innerHTML=spr("lie",3); say("* ...");
          later(()=>{ w.style.bottom=""; w.innerHTML=spr("catfront",3); },1300);
          later(()=>{ const kh=$(".cats .kh"); kh.style.left="98px"; kh.style.top="18px"; kh.classList.add("on"); },1900);
          later(()=>say("* ...you came back."),2200);
          later(()=>say("* she was hoping you would."),5200);
          later(()=>ask("* stay a little?",y=>{ w.style.bottom="0"; w.innerHTML=spr("sleep",3)+zz;
            if(y){ say("* (she lies back down. there's room for two.)"); later(join,2400); }
            else { say("* (she falls asleep again. smiling, a little.)"); later(()=>$(".rdoor").classList.add("call"),3200); } }),8600); }
        else { say("* (you let her sleep.)");
          later(()=>ask("* stay a little?",y=>{ if(y) join();
            else { say("* (she smiles a little in her sleep.)"); later(()=>$(".rdoor").classList.add("call"),2800); } }),2600); } }),4400); }
    else { const e=$(".env"); later(()=>{ e.classList.add("fall"); later(()=>{ e.className="env down"; say("* there's a letter. it says: anh yêu"); },5000); },1200); }
  }
  addDoor(); firefly();
  return {is,on,scene,activate,room};
})();
/* LEESMIJ: de brief aanpassen
   1. open de console (F12) op je site
   2. typ: btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify([{t:"regel 1"},{t:""},{t:"doorgestreept",s:1},{t:"wegkrassen",x:1},{t:"09.09.2023",d:1}]))))
   3. plak de uitkomst tussen de aanhalingstekens bij atob("...") hierboven */
