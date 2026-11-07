/* game: cat-tale, baasgevecht tegen deadline: ontwijk + vis gooien */
const Game=(function(){
  const cv=document.getElementById("gameCv"), c=cv.getContext("2d"), W=200, H=120;
  const BX=14, BY=46, BW=172, BH=54, BMAX=12;
  const MON=["..##........##..","################","################","#..............#","#.##........##.#","#..###....###..#","#..............#","#...########...#","#...#.#.#.#.#..#","#...########...#","#..............#","################"];
  const P={
    bone:["#.#.#..",".#####.","#.#.#.#"],
    yarn:[".###.","#.#.#","##.##","#.#.#",".###."],
    mouse:["..##....",".####..#","######.#",".#..#.#."],
    drop:[".#.","###",".#."]
  };
  let deadT=0, active=false, over=false, won=false, winT=0, paused=false, raf=0, t0=0, cat, shots, time, hi=0, hp, inv, frame, held=new Set(), stick={x:0,y:0}, intro, hitT, boss, fish, thrown, fishT, shootT, pat, conf=[], popT=0;
  try{ hi=+localStorage.getItem("taleBest")||0; }catch(e){}
  let INK="#fff", RED="#ff2b2b";
  function spr(m,x,y,col,z){ z=z||1; c.fillStyle=col||INK; m.forEach((row,j)=>{for(let i=0;i<row.length;i++) if(row[i]==="#") c.fillRect(Math.round(x)+i*z,Math.round(y)+j*z,z,z);}); }
  function txt(t,x,y,al,col){ c.fillStyle=col||INK; c.font=window.PXF?PXF(8):"8px 'Press Start 2P', monospace"; c.textAlign=al||"left"; c.fillText(window.T?T(t):t,x,y); }
  const mmss=s=>Math.floor(s/60)+":"+String(Math.floor(s%60)).padStart(2,"0");
  function reset(){ paused=false; over=false; won=false; winT=0; cat={x:BX+BW/2-8,y:BY+BH-14,f:false}; shots=[]; time=0; hp=9; inv=0; frame=0; intro=2.4; hitT=0;
    boss={x:W/2-16,d:1,hp:BMAX,fl:0}; conf=[]; popT=0; fish=null; thrown=null; fishT=2.6; shootT=1.2; pat=0; }
  function jump(){ if(over||won){ reset(); return; } if(paused){ paused=false; } }
  const r=(a,b)=>a+Math.random()*(b-a);
  function add(k,x,y,vx,vy,o){ const m=P[k]; shots.push(Object.assign({m,x,y,vx,vy,w:m[0].length*2,h:m.length*2,k,life:7},o||{})); }
  function attack(){
    const k=BMAX-boss.hp, mx=boss.x+16, my=38, sp=1+k*.05, n=pat++%4;
    if(n===0){ for(let i=-2;i<=2;i++) add("bone",mx-7+i*4,my,i*20*sp,48*sp); }
    else if(n===1){ const a0=r(0,6.28), m=7+Math.floor(k/3); for(let i=0;i<m;i++){ const a=a0+i/m*6.28; add("drop",mx,my,Math.cos(a)*42*sp,Math.abs(Math.sin(a))*40*sp+18); } }
    else if(n===2){ for(let i=0;i<2+Math.floor(k/4);i++){ const L=i%2===0; add("mouse",L?BX-16-i*20:BX+BW+2+i*20,r(BY+2,BY+BH-8),(L?1:-1)*56*sp,0,{flip:!L}); } }
    else { for(let i=0;i<1+Math.floor(k/5);i++){ const a=r(.6,2.5); add("yarn",mx-5,BY+2,Math.cos(a)*46*sp,Math.sin(a)*46*sp,{bounce:true,life:4.5}); } }
    shootT=Math.max(.75,1.45-k*.06);
  }
  function step(dt){
    frame+=dt; if(intro>0) intro-=dt; if(inv>0) inv-=dt; if(hitT>0) hitT-=dt; if(boss.fl>0) boss.fl-=dt;
    if(intro<=0) time+=dt;
    let dx=stick.x, dy=stick.y;
    if(held.has("left")) dx-=1; if(held.has("right")) dx+=1; if(held.has("up")) dy-=1; if(held.has("down")) dy+=1;
    const d=Math.hypot(dx,dy); if(d>1){dx/=d;dy/=d;}
    cat.x=Math.max(BX+1,Math.min(BX+BW-17,cat.x+dx*74*dt)); cat.y=Math.max(BY+1,Math.min(BY+BH-12,cat.y+dy*74*dt));
    if(Math.abs(dx)>.1) cat.f=dx<0; cat.mv=d>.1;
    boss.x+=boss.d*(22+(BMAX-boss.hp)*3)*dt; if(boss.x<BX||boss.x>BX+BW-32){ boss.d*=-1; boss.x=Math.max(BX,Math.min(BX+BW-32,boss.x)); }
    if(intro<=0){ shootT-=dt; if(shootT<=0) attack(); fishT-=dt; if(!fish&&!thrown&&fishT<=0) fish={x:r(BX+4,BX+BW-20),y:r(BY+4,BY+BH-14)}; }
    shots.forEach(s=>{ s.x+=s.vx*dt; s.y+=s.vy*dt; s.life-=dt;
      if(s.bounce&&s.y>BY){ if(s.x<BX+1||s.x+s.w>BX+BW-1){ s.vx*=-1; s.x=Math.max(BX+1,Math.min(BX+BW-1-s.w,s.x)); } if(s.y+s.h>BY+BH-1||(s.y<BY+1&&s.vy<0)){ s.vy*=-1; s.y=Math.max(BY+1,Math.min(BY+BH-1-s.h,s.y)); } } });
    shots=shots.filter(s=>s.life>0&&s.x>BX-200&&s.x<BX+BW+200&&s.y<BY+BH+10);
    /* ronde hitbox: cirkel in het midden van de kat */ const HR=3, hit=(x,y,w,h)=>{ const cx=cat.x+8, cy=cat.y+5.5, nx=Math.max(x,Math.min(cx,x+w)), ny=Math.max(y,Math.min(cy,y+h)); return (cx-nx)*(cx-nx)+(cy-ny)*(cy-ny)<HR*HR; };
    if(inv<=0) for(const s of shots){
      if(s.y+s.h<BY||s.y>BY+BH||s.x+s.w<BX||s.x>BX+BW) continue;
      if(hit(s.x,s.y,s.w,s.h)){ hp--; inv=1; hitT=.25; if(window.SFX) SFX.hit(); if(hp<=0){ over=true; if(window.SFX) setTimeout(SFX.lose,300); deadT=0; inv=0; setTimeout(()=>window.Story&&Story.find(3,true),2600); } break; }
    }
    if(fish&&hit(fish.x,fish.y,16,10)){ thrown={x:fish.x,y:fish.y}; fish=null; }
    if(thrown){ const ax=boss.x+16-thrown.x-8, ay=24-thrown.y, dd=Math.hypot(ax,ay);
      if(dd<8){ thrown=null; boss.hp--; boss.fl=.4; if(window.SFX) SFX.coin(); hitT=0; shots=[]; fishT=r(1.6,2.8);
        if(boss.hp<=0){ won=true; winT=0; if(window.SFX) SFX.win(); if(window.Ach){ Ach.earn("tale"); if(time<60) Ach.earn("speed"); if(hp>=9) Ach.earn("flawless"); if(hp>=6) Ach.earn("barely"); } const t=Math.floor(time); if(!hi||t<hi){ hi=t; try{localStorage.setItem("taleBest",hi);}catch(e){} } } }
      else { thrown.x+=ax/dd*240*dt; thrown.y+=ay/dd*240*dt; } }
  }
  function draw(){
    const lt=document.documentElement.dataset.theme==="light"; INK=lt?"#111":"#fff"; RED=getComputedStyle(document.documentElement).getPropertyValue("--red").trim()||"#ff2b2b";
    const BG=lt?"#fff":"#000"; c.fillStyle=BG; c.fillRect(0,0,W,H);
    // top: boss hp + tijd
    txt("DEADLINE",4,10,"left",RED); c.fillStyle=INK; c.fillRect(70,2,62,10); c.fillStyle=BG; c.fillRect(71,3,60,8);
    c.fillStyle=RED; c.fillRect(72,4,Math.round(58*Math.max(0,boss.hp)/BMAX),6);
    txt(mmss(time),W-4,10,"right"); if(hi) txt(T("BEST")+" "+mmss(hi),W-4,21,"right",lt?"#777":"#888");
    // baas
    const showB=!(won&&(winT>1.2||Math.floor(winT*10)%2));
    if(showB){ const sh=boss.fl>0?(Math.random()*3-1|0):0, by=16+Math.sin(frame*3)*1.5; spr(MON,boss.x+sh,by,boss.fl>0?RED:INK,2); c.fillStyle=RED; c.fillRect(boss.x+sh+4,by+10,4,2); c.fillRect(boss.x+sh+24,by+10,4,2); }
    // vak
    c.fillStyle=hitT>0?RED:INK; c.fillRect(BX-2,BY-2,BW+4,2); c.fillRect(BX-2,BY+BH,BW+4,2); c.fillRect(BX-2,BY,2,BH); c.fillRect(BX+BW,BY,2,BH);
    if(!(over&&deadT>.5)) shots.forEach(s=>{ const m=s.flip?s.m.map(row=>row.split("").reverse().join("")):s.m; spr(m,s.x,s.y,RED,2); });
    if(fish) spr(SPR.fish1,fish.x,fish.y+Math.sin(frame*6)*1.5,INK,2);
    if(thrown) spr(SPR.fish1,thrown.x,thrown.y,INK,2);
    c.save(); c.beginPath(); c.rect(BX,BY-40,BW,BH+40); c.clip();
    const BODY=lt?"#111":"#000";
    if(over){
      let cm=SPR.blackcat; if(cat.f) cm=cm.map(row=>row.split("").reverse().join(""));
      const sh=deadT<.5?Math.round(Math.random()*2-1):0;
      if(deadT>=.5) cm=cm.slice().reverse();
      const flash=deadT<.5&&Math.floor(deadT*14)%2===0;
      if(!lt||flash) [[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>spr(cm,cat.x+a+sh,cat.y+b,flash?RED:"#fff")); spr(cm,cat.x+sh,cat.y,BODY);
      if(deadT>=.5){ const fx=cat.f?cat.x-3:cat.x+7; spr(["#.#...#.#",".#.....#.","#.#.###.#"],fx,cat.y-6,RED,1); }
      if(deadT>.8){
        const k=deadT-.8, gy=cat.y-k*16, gx=cat.x+Math.sin(k*4)*2; c.globalAlpha=Math.max(0,.75-k/3.2);
        let gm=SPR.blackcat; if(cat.f) gm=gm.map(row=>row.split("").reverse().join(""));
        [[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>spr(gm,gx+a,gy+b,INK)); spr(gm,gx,gy,BG);
        const hx=cat.f?gx-1:gx+10; spr([".####.","#....#",".####."],hx,gy-5,INK);
        c.globalAlpha=1;
      }
    } else if(won&&winT>1.2){ partyDraw(lt,BODY);
    } else if(!(inv>0 && Math.floor(inv*12)%2===0)){
      let cm=cat.mv&&Math.floor(frame*8)%2?SPR.blackcat2:SPR.blackcat; if(cat.f) cm=cm.map(row=>row.split("").reverse().join(""));
      if(won&&Math.floor(winT*4)%2) cm=SPR.blackcat2;
      if(!lt) [[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>spr(cm,cat.x+a,cat.y+b,"#fff")); spr(cm,cat.x,cat.y,BODY);
    }
    c.restore();
    txt("HP",BX-2,H-6); c.fillStyle=RED; c.fillRect(BX+18,H-13,hp*4,8); c.fillStyle=lt?"#ccc":"#444"; c.fillRect(BX+18+hp*4,H-13,(9-hp)*4,8);
    txt(hp+"/9",BX+60,H-6);
    const box=(a,b,col)=>{ const py=cat.y<BY+BH/2?BY+BH-28:BY+2; c.fillStyle=BG; c.fillRect(BX+1,py,BW-2,26); txt(a,W/2,py+11,"center",col); txt(b,W/2,py+22,"center"); };
    if(over&&deadT>2) box("GAME OVER","A = OPNIEUW",RED);
    else if(won&&winT>1.4){ txt("DEADLINE VERSLAGEN!",W/2,26,"center",RED); txt(T("TIJD")+" "+mmss(time)+"  "+T("A = OPNIEUW"),W/2,38,"center"); }
    else if(intro>0){ c.fillStyle=BG; c.fillRect(BX+1,BY+1,BW-2,BH-2); txt("CAT-TALE",W/2,BY+11,"center",RED); txt(matchMedia("(pointer:coarse)").matches?"SLEEP = ONTWIJK":"PIJLTJES = ONTWIJK",W/2,BY+23,"center"); txt("PAK EEN VIS = AANVAL",W/2,BY+35,"center"); txt("B=STOP  X=PAUZE",W/2,BY+47,"center",lt?"#777":"#888"); }
  }
  const HAT=["...#...","..#.#..","..###..",".#.#.#.",".#####.","#.#.#.#","#######"], POP=["....##","...###","..###.",".###..","###...",".#...."];
  const PX=()=>BX+BW/2-16, PY=()=>BY+BH-24;
  function party(dt){
    if(winT<1.2) return; popT-=dt;
    if(popT<=0){ popT=1.1; const mx=PX()+40, my=PY()-4; for(let i=0;i<22;i++) conf.push({x:mx,y:my,vx:r(-25,75),vy:r(-82,-40),c:i%3,life:2.2,sp:r(0,6)}); }
    conf.forEach(p=>{ p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=110*dt; p.vx*=.985; p.life-=dt; p.sp+=dt*10; }); conf=conf.filter(p=>p.life>0&&p.y<BY+BH);
  }
  function partyDraw(lt,BODY){
    const x=PX(), y=PY()-(Math.floor(winT*3)%2?3:0), cm=Math.floor(winT*3)%2?SPR.blackcat2:SPR.blackcat;
    if(!lt) [[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>spr(cm,x+a,y+b,"#fff",2)); spr(cm,x,y,BODY,2);
    spr(HAT,x+22,y-13,RED,2); c.fillStyle=INK; c.fillRect(x+28,y-16,2,2);
    spr(POP,x+34,y+4,"#ffd23f",2); c.fillStyle=INK; c.fillRect(x+34,y+14,4,2);
    const COL=[INK,"#ffd23f","#5bc0ff"];
    conf.forEach(p=>{ c.fillStyle=COL[p.c]; const w=Math.floor(p.sp)%2?3:2; c.fillRect(Math.round(p.x),Math.round(p.y),w,5-w); });
    if(winT-1.2<.3){ c.fillStyle="#ffd23f"; txt("POP!",x+56,y-2,"left","#ffd23f"); }
  }
  function loop(t){ const dt=Math.min(.05,(t-t0)/1000||0); t0=t; if(over) deadT+=dt; if(won){ winT+=dt; party(dt); } if(!over&&!won&&!paused) step(dt); draw(); if(paused) txt("PAUZE  (X)",W/2,BY+30,"center"); if(active) raf=requestAnimationFrame(loop); }
  cv.addEventListener("pointerdown",e=>{ if(!active) return; e.preventDefault(); if(over||won) reset(); });
  const KD={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right"};
  addEventListener("keydown",e=>{ if(!active) return; if(KD[e.key]){ held.add(KD[e.key]); e.preventDefault(); } else if(e.key===" ") e.preventDefault(); },{capture:true});
  addEventListener("keyup",e=>{ if(KD[e.key]) held.delete(KD[e.key]); });
  document.querySelectorAll(".dpad [data-k]").forEach(b=>{
    b.addEventListener("pointerdown",()=>{ if(active) held.add(b.dataset.k); });
    ["pointerup","pointerleave","pointercancel"].forEach(ev=>b.addEventListener(ev,()=>held.delete(b.dataset.k)));
  });
  return {
    get active(){return active;},
    start(){ if(active) return; active=true; reset(); held.clear(); screen.classList.add("game"); ds.focus({preventScroll:true}); t0=performance.now(); raf=requestAnimationFrame(loop); },
    stop(){ if(!active) return; active=false; cancelAnimationFrame(raf); held.clear(); screen.classList.remove("game"); say(hi?"> BEST TIME "+mmss(hi):"> DEADLINE WINS... FOR NOW"); },
    jump, restart(){ reset(); }, pause(){ if(!over) paused=!paused; }, stick(x,y){ stick.x=x; stick.y=y; }
  };
})();
const Pet=(function(){
  const cv=document.getElementById("gameCv"), c=cv.getContext("2d"), W=200, H=120;
  let active=false, raf=0, t0=0, love, hearts, pets, recent, grumpy, purr, hop, blinkT, total=0, maxT, snack, toy, nom, scratch=0, scratchCd=0;
  try{ total=+localStorage.getItem("katPets")||0; }catch(e){}
  const CX=78, CY=44, S=4;
  function spr(m,x,y,col,s){ s=s||1; c.fillStyle=col; m.forEach((row,j)=>{for(let i=0;i<row.length;i++) if(row[i]==="#") c.fillRect(Math.round(x)+i*s,Math.round(y)+j*s,s,s);}); }
  function txt(t,x,y,al,col){ c.fillStyle=col; c.font=window.PXF?PXF(8):"8px 'Press Start 2P', monospace"; c.textAlign=al||"left"; c.fillText(window.T?T(t):t,x,y); }
  function reset(){ scratch=0; scratchCd=0; love=40; hearts=[]; pets=0; recent=[]; grumpy=0; purr=0; hop=0; blinkT=2; maxT=0; snack=null; toy=null; nom=0; }
  function treat(){ if(snack||grumpy>0) return; snack={x:CX+30,y:-8}; }
  function play(){ if(toy||grumpy>0) return; toy={x:W+6,dir:-1,t:0}; }
  function addLove(n){ love=Math.min(100,love+n); for(let i=0;i<3;i++) hearts.push({x:CX+8+Math.random()*30,y:CY+4,vx:(Math.random()-.5)*24,life:1.2}); if(love>=100&&maxT<=0){ maxT=2; hop=.5; if(window.Ach) Ach.earn("maxlove"); } }
  function pet(){ if(window.SFX) SFX.pet();
    if(grumpy>0) return;
    if(love<=0){ scratch=.8; return; }
    const now=performance.now(); recent=recent.filter(t=>now-t<1500); recent.push(now);
    if(recent.length>9){ grumpy=1.6; love=Math.max(0,love-15); recent=[]; return; }
    love=Math.min(100,love+7); pets++; total++; purr=.8; if(total>=25&&window.Ach) Ach.earn("pet");
    try{ localStorage.setItem("katPets",total); }catch(e){}
    hearts.push({x:CX+10+Math.random()*26,y:CY+4,vx:(Math.random()-.5)*18,life:1.2});
    if(love>=100&&maxT<=0){ maxT=2; hop=.5; if(window.Ach) Ach.earn("maxlove"); }
  }
  function step(dt){
    love=Math.max(0,love-dt*3.5); purr=Math.max(0,purr-dt); grumpy=Math.max(0,grumpy-dt); hop=Math.max(0,hop-dt); maxT=Math.max(0,maxT-dt);
    blinkT-=dt; if(blinkT<-.15) blinkT=2+Math.random()*3;
    hearts.forEach(h=>{h.y-=28*dt; h.x+=h.vx*dt; h.life-=dt;}); hearts=hearts.filter(h=>h.life>0);
    nom=Math.max(0,nom-dt); scratch=Math.max(0,scratch-dt);
    if(love<=0){ scratchCd-=dt; if(scratchCd<=0){ scratch=.8; scratchCd=3.5; if(window.Ach) Ach.earn("scratch"); } } else scratchCd=1.2;
    if(snack){ snack.y+=70*dt; if(snack.y>=CY+14){ snack=null; nom=1; addLove(15); } }
    if(toy){ toy.t+=dt; toy.x+=toy.dir*70*dt; if(toy.dir<0&&toy.x<=CX+50){ toy.dir=1; hop=.5; addLove(8); } if(toy.dir>0&&toy.x>W+8) toy=null; }
  }
  function draw(){
    const lt=document.documentElement.dataset.theme==="light", INK=lt?"#111":"#fff", BG=lt?"#fff":"#000", RED=lt?"#e01b1b":"#ff2b2b";
    c.fillStyle=BG; c.fillRect(0,0,W,H);
    c.fillStyle=INK; c.fillRect(0,104,W,1);
    // cushion
    c.fillRect(CX-8,100,60,4); c.fillRect(CX-4,98,52,2);
    const y=CY-(hop>0?Math.sin(hop/.5*Math.PI)*8:0);
    const eyesShut=purr>0||blinkT<0||love>=100;
    const m=SPR.phcat.map(r=>r+"...."); if(eyesShut&&scratch<=0) m[3]="......#####.....";
    if(scratch>0){ m[3]="......#.#.#...."; m[5]=".......#####..."; m[6]="......#######.#"; m[7]="#....########.#"; }
    c.save(); if(scratch>.4) c.translate((Math.random()*6-3)|0,(Math.random()*4-2)|0);
    if(!lt) [[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>spr(m,CX+a,y+b,"#fff",S));
    spr(m,CX,y,lt?"#111":"#000",S);
    c.restore();
    if(scratch>0){ const k=Math.min(1,(0.8-scratch)/0.25); c.fillStyle=RED;
      for(let i=0;i<3;i++){ const x0=118+i*14, y0=30; for(let j=0;j<Math.round(k*40);j+=2) c.fillRect(x0+j*0.6,y0+j,3,3); }
      txt("SCRATCH!",W-6,24,"right",RED); }
    else if(love<=0) txt("GRRR...",CX+52,CY+8,"left",RED);
    if(snack) spr(SPR.fish1,snack.x,snack.y,INK,2);
    if(toy){ const tx=Math.round(toy.x), ty=96; c.fillStyle=RED; c.beginPath(); c.arc(tx,ty,5,0,Math.PI*2); c.fill(); c.fillStyle=BG; c.fillRect(tx-3+((toy.t*8|0)%3)*2,ty-1,2,2); c.fillStyle=RED; c.fillRect(tx+4,ty+3,8,1); }
    if(nom>0) txt("NOM!",CX+52,CY+8,"left",RED);
    else if(toy&&toy.dir<0) txt("!",CX+30,CY-6,"left",RED);
    else if(purr>0) txt("PRRR",CX+52,CY+8,"left",INK);
    if(grumpy>0){ txt("HISS!",CX+52,CY+8,"left",RED); txt("TE SNEL...",W/2,116,"center",INK); }
    hearts.forEach(h=>spr(SPR.heart,h.x,h.y,RED,1));
    // love meter
    txt("LOVE",6,12,"left",INK);
    c.strokeStyle=INK; c.lineWidth=1; c.strokeRect(40.5,5.5,60,7); c.fillStyle=RED; c.fillRect(42,7,Math.round(57*love/100),4);
    txt("x"+pets,W-6,12,"right",INK);
    txt("B = STOP",6,24,"left",INK);
    if(maxT>0) txt("MAX LOVE!",W/2,36,"center",RED);
    if(love<=0) txt("GIMME SNACKS!!",W/2,116,"center",RED);
    else if(grumpy<=0) txt("A AAI  X SNACK  Y SPEEL",W/2,116,"center",INK);
    else if(love<10&&grumpy<=0) txt("...aai me?",CX+52,CY+8,"left",INK);
  }
  function loop(t){ const dt=Math.min(.05,(t-t0)/1000||0); t0=t; step(dt); draw(); if(active) raf=requestAnimationFrame(loop); }
  let down=false, lastX=0;
  cv.addEventListener("pointerdown",e=>{ if(!active) return; e.preventDefault(); down=true; lastX=e.clientX; pet(); });
  cv.addEventListener("pointermove",e=>{ if(!active||!down) return; if(Math.abs(e.clientX-lastX)>18){ lastX=e.clientX; pet(); } });
  addEventListener("pointerup",()=>down=false);
  return {
    get active(){return active;},
    start(){ if(active) return; if(Game.active) Game.stop(); active=true; reset(); screen.classList.add("game"); ds.focus({preventScroll:true}); t0=performance.now(); raf=requestAnimationFrame(loop); },
    stop(){ if(!active) return; active=false; cancelAnimationFrame(raf); screen.classList.remove("game"); say("> "+total+" KEER GEAAID"); },
    pet, treat, play
  };
})();
