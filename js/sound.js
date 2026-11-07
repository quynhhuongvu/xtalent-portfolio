/* geluid: 8-bit bleeps (web audio, standaard uit) */
window.SFX=(function(){
  let on=true, vol=35; try{ const v=parseInt(localStorage.getItem("sndVol"),10); if(v>=0&&v<=100) vol=v; if(localStorage.getItem("sndMuted")==="1") on=false; }catch(e){} if(!vol) on=false;
  let ac=null, out=null, last={};
  function ctx(){ if(!ac){ const A=window.AudioContext||window.webkitAudioContext; if(!A) return null; ac=new A(); out=ac.createGain(); out.gain.value=2.5*vol/50; out.connect(ac.destination); loadClips(ac); } if(ac.state!=="running") ac.resume(); return ac; }
  function unlock(){ if(!on) return; const c=ctx(); if(!c) return; try{ const b=c.createBuffer(1,1,22050), s=c.createBufferSource(); s.buffer=b; s.connect(c.destination); s.start(0); }catch(e){} }
  ["pointerdown","touchend","keydown","click"].forEach(ev=>addEventListener(ev,unlock,{capture:true,passive:true}));
  function gate(k,ms){ const n=performance.now(); if(n-(last[k]||0)<ms) return false; last[k]=n; return true; }
  function tone(f,d,o){ o=o||{}; if(!on) return; const c=ctx(); if(!c) return; const t=c.currentTime+(o.at||0), os=c.createOscillator(), g=c.createGain();
    os.type=o.type||"triangle"; os.frequency.setValueAtTime(f,t); if(o.to) os.frequency.exponentialRampToValueAtTime(o.to,t+d*(o.tw||1));
    if(o.mid){ os.frequency.linearRampToValueAtTime(o.mid,t+d*.35); if(o.end) os.frequency.linearRampToValueAtTime(o.end,t+d); }
    const v=(o.v||.05); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+.008); g.gain.exponentialRampToValueAtTime(.0001,t+d);
    os.connect(g); g.connect(out); os.start(t); os.stop(t+d+.03); }
  function noise(d,v,at){ if(!on) return; const c=ctx(); if(!c) return; const t=c.currentTime+(at||0), n=Math.floor(c.sampleRate*d), b=c.createBuffer(1,n,c.sampleRate), x=b.getChannelData(0);
    for(let i=0;i<n;i++) x[i]=(Math.random()*2-1)*(1-i/n); const s=c.createBufferSource(), g=c.createGain(), lp=c.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=900; g.gain.value=(v||.05)*.6; s.buffer=b; s.connect(lp); lp.connect(g); g.connect(out); s.start(t); }
  /* echte miauw: zaagtand-stem + 2 formant-filters (m -> ie -> a -> oe) + vibrato */
  function meowAt(c,dst,t,pm,dm,vm){ /* kleine kitten-mew: hoog, kort, zacht */ const p=(.92+Math.random()*.18)*(pm||1), D=.42*(dm||1);
    const mk=(type,mul,v)=>{ const o=c.createOscillator(); o.type=type; const fr=o.frequency;
      fr.setValueAtTime(900*p*mul,t); fr.linearRampToValueAtTime(1350*p*mul,t+.1); fr.linearRampToValueAtTime(1250*p*mul,t+.2); fr.exponentialRampToValueAtTime(820*p*mul,t+D);
      const g=c.createGain(); g.gain.value=v; o.connect(g); return [o,g]; };
    const voices=[mk("triangle",1,1),mk("sine",2,.18)];
    const lfo=c.createOscillator(), ld=c.createGain(); lfo.frequency.value=11; ld.gain.value=18; lfo.connect(ld); voices.forEach(([o])=>ld.connect(o.frequency));
    const bp=c.createBiquadFilter(); bp.type="peaking"; bp.Q.value=2; bp.gain.value=6; bp.frequency.setValueAtTime(1400,t); bp.frequency.linearRampToValueAtTime(2200,t+.12); bp.frequency.linearRampToValueAtTime(1100,t+D);
    const lp=c.createBiquadFilter(); lp.type="lowpass"; lp.frequency.setValueAtTime(900,t); lp.frequency.linearRampToValueAtTime(4000,t+.06); lp.frequency.linearRampToValueAtTime(1600,t+D);
    const env=c.createGain(); env.gain.setValueAtTime(0,t); env.gain.linearRampToValueAtTime(.05*(vm||1),t+.04); env.gain.setValueAtTime(.047*(vm||1),t+.22); env.gain.exponentialRampToValueAtTime(.001,t+D);
    voices.forEach(([o,g])=>g.connect(bp)); bp.connect(lp); lp.connect(env); env.connect(dst);
    voices.forEach(([o])=>{ o.start(t); o.stop(t+D+.05); }); lfo.start(t); lfo.stop(t+D+.05); }
  function anyMeow(c,t){ const k=Math.random(); if(k<.4) meowAt(c,out,t); else if(k<.65) trillAt(c,out,t); else if(k<.85){ meowAt(c,out,t,1.12,.6,.6); meowAt(c,out,t+.2,1.22,.6,.6); } else meowAt(c,out,t,.8,1.35); }
  /* echte opnames (pixabay, vrij te gebruiken), als base64 ingebakken */
  const CLIPS={snip:"audio/snip.mp3",water:"audio/water.mp3"}, BUF={};
  function loadClips(c){ Object.keys(CLIPS).forEach(k=>{ if(BUF[k]!==undefined) return; BUF[k]=null;
    fetch(CLIPS[k]).then(r=>{ if(!r.ok) throw 0; return r.arrayBuffer(); }).then(ab=>new Promise((ok,no)=>c.decodeAudioData(ab,ok,no))).then(b=>{ BUF[k]=b; }).catch(()=>{ delete BUF[k]; }); }); }
  function play(k,v){ const c=ac; if(!c||!BUF[k]) return false; const s=c.createBufferSource(), g=c.createGain(); s.buffer=BUF[k]; g.gain.value=v; s.connect(g); g.connect(out); s.start(); return true; }
  function bpNoise(c,t,d,fq,q,v){ const n=Math.max(1,Math.floor(c.sampleRate*d)), b=c.createBuffer(1,n,c.sampleRate), x=b.getChannelData(0); for(let i=0;i<n;i++) x[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);
    const s=c.createBufferSource(), bp=c.createBiquadFilter(), g=c.createGain(); bp.type="bandpass"; bp.frequency.value=fq; bp.Q.value=q; g.gain.value=v; s.buffer=b; s.connect(bp); bp.connect(g); g.connect(out); s.start(t); }
  function trillAt(c,dst,t){ /* "brrrp?" kattentril */ const p=.92+Math.random()*.15, D=.38, o=c.createOscillator(); o.type="triangle";
    o.frequency.setValueAtTime(620*p,t); o.frequency.linearRampToValueAtTime(980*p,t+D*.8); o.frequency.linearRampToValueAtTime(1150*p,t+D);
    const am=c.createGain(); am.gain.value=.5; const lfo=c.createOscillator(), ld=c.createGain(); lfo.type="square"; lfo.frequency.value=27; ld.gain.value=.5; lfo.connect(ld); ld.connect(am.gain);
    const env=c.createGain(); env.gain.setValueAtTime(0,t); env.gain.linearRampToValueAtTime(.06,t+.03); env.gain.setValueAtTime(.06,t+D*.7); env.gain.exponentialRampToValueAtTime(.001,t+D);
    const lp=c.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=2600; o.connect(am); am.connect(lp); lp.connect(env); env.connect(dst); o.start(t); lfo.start(t); o.stop(t+D+.05); lfo.stop(t+D+.05); }
  function purrAt(c,dst,t){ /* zacht spinnen */ const D=1.1, n=Math.floor(c.sampleRate*D), b=c.createBuffer(1,n,c.sampleRate), x=b.getChannelData(0); for(let i=0;i<n;i++) x[i]=Math.random()*2-1;
    const s=c.createBufferSource(); s.buffer=b; const lp=c.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=260; lp.Q.value=4;
    const am=c.createGain(); am.gain.value=.5; const lfo=c.createOscillator(), ld=c.createGain(); lfo.frequency.value=24; ld.gain.value=.5; lfo.connect(ld); ld.connect(am.gain);
    const env=c.createGain(); env.gain.setValueAtTime(0,t); env.gain.linearRampToValueAtTime(.3,t+.15); env.gain.setValueAtTime(.3,t+D*.6); env.gain.exponentialRampToValueAtTime(.001,t+D);
    s.connect(lp); lp.connect(am); am.connect(env); env.connect(dst); s.start(t); lfo.start(t); s.stop(t+D); lfo.stop(t+D); }
  function seq(ns,st,o){ ns.forEach((f,i)=>f&&tone(f,st*1.6,Object.assign({},o,{at:((o&&o.at)||0)+i*st}))); }
  const S={
    blip(){ if(gate("blip",45)) tone(560+Math.random()*80,.035,{v:.025}); },
    talk(){ if(gate("talk",200)) seq([620,0,700],.05,{v:.03}); },
    click(){ if(gate("click",60)) tone(980,.035,{v:.035}); },
    keyup(){ if(!on||!gate("keyup",200)) return; tone(2100,.07,{type:"square",v:.012}); tone(2650,.09,{type:"square",v:.01,at:.06}); tone(3150,.12,{type:"triangle",v:.02,at:.12}); },
    unlockDoor(){ if(!on) return; const c=ctx(); if(!c) return; const t=c.currentTime; bpNoise(c,t,.04,2400,6,.07); bpNoise(c,t+.16,.05,1800,6,.08); tone(160,.08,{type:"square",v:.03,at:.16,to:110});
      seq([523,659,784,1047],.07,{type:"triangle",v:.04,at:.32}); },
    gotcha(){ if(!on) return; const c=ctx(); if(!c) return; const t=c.currentTime; bpNoise(c,t,.12,2600,3,.08); tone(1180,.18,{type:"square",v:.025,to:1100}); tone(1570,.14,{type:"square",v:.018}); tone(90,.25,{type:"sine",v:.12,to:55});
      seq([392,370,0,247],.16,{type:"triangle",v:.05,at:.95}); },
    locked(){ if(!on||!gate("locked",500)) return; const c=ctx(); if(!c) return; const t=c.currentTime; for(let i=0;i<4;i++){ bpNoise(c,t+i*.075,.05,1600+(i%2)*500,6,.06); tone(240+(i%2)*40,.04,{type:"square",v:.018,at:i*.075}); } tone(130,.14,{type:"triangle",v:.06,at:.34,to:90}); },
    huff(){ if(!on) return; const c=ctx(); if(!c) return; const t=c.currentTime; bpNoise(c,t,.32,4200,1.2,.05); tone(170,.18,{type:"sawtooth",v:.022,to:120,at:.05}); },
    steps(n){ if(!on) return; const c=ctx(); if(!c) return; const t=c.currentTime; for(let i=0;i<(n||10);i++){ const v=.05*(1-i/((n||10)+2)); bpNoise(c,t+i*.34,.05,900+(i%2)*250,2,v); } },
    move(){ if(on&&gate("move",50)) tone(660,.03,{type:"square",v:.018}); },
    boot(){ seq([392,523,659,784,1047],.085,{v:.045}); const q=performance.now()+500; last.talk=q; last.blip=q; last.boot=performance.now(); },
    hit(){ if(!gate("hit",120)) return; tone(260,.2,{type:"square",to:70,v:.025}); noise(.12,.05); },
    coin(){ seq([988,1319],.06,{v:.045}); },
    win(){ seq([523,659,784,1047,0,784,1047],.1,{v:.05}); },
    lose(){ seq([392,330,262,196],.17,{type:"triangle",v:.07}); },
    meow(){ if(!gate("meow",450)||!on) return; const c=ctx(); if(!c) return; anyMeow(c,c.currentTime); },
    pet(){ if(!gate("meow",450)||!on) return; const c=ctx(); if(!c) return; const t=c.currentTime; if(Math.random()<.4) purrAt(c,out,t); else anyMeow(c,t); },
    paper(){ if(!on) return; const c=ctx(); if(!c) return; const t=c.currentTime; for(let i=0;i<4;i++) bpNoise(c,t+i*.04,.04,3000+Math.random()*2500,1.2,.1); },
    heartLoss(){ if(!gate("hl",300)) return; last.hlAt=performance.now(); tone(880,.12,{v:.06,to:440}); tone(440,.16,{v:.06,at:.13,to:180}); noise(.12,.06,.13); },
    off(){ if(!on||!gate("off",400)) return; seq([784,659,523,392],.075,{v:.04}); tone(196,.22,{type:"sine",v:.05,at:.3,to:98}); },
    jump(){ if(!on||!gate("jump",200)) return; tone(330,.16,{type:"square",v:.03,to:880}); },
    pickup(){ if(!on||!gate("pick",250)) return; const c=ctx(); if(!c) return; tone(520,.12,{v:.045,to:1040}); meowAt(c,out,c.currentTime+.08,1.25,.55,.7); },
    drop(){ if(!on||!gate("drop",250)) return; tone(300,.09,{type:"triangle",v:.06,to:150}); tone(180,.06,{type:"sine",v:.05,at:.07}); },
    clink(){ tone(1760,.18,{type:"sine",v:.04}); tone(2640,.12,{type:"sine",v:.025,at:.01}); },
    rustle(){ if(!gate("rustle",150)||!on) return; /* cartoon rommelen: tonk + 3 bloops */ tone(520,.09,{type:"sine",v:.05}); tone(780,.07,{type:"sine",v:.025});
      [[300,.09],[240,.17],[360,.25]].forEach(([fq,at])=>tone(fq*(.9+Math.random()*.2),.07,{v:.05,at,to:fq*.7})); },
    snip(){ if(!on) return; const c=ctx(); if(!c) return; if(play("snip",.12)) return; const t=c.currentTime; [0,.11].forEach(d=>{ bpNoise(c,t+d,.025,5200,3,.22); tone(2600,.07,{type:"sine",v:.035,at:d}); tone(3900,.05,{type:"sine",v:.02,at:d}); }); tone(240,.18,{type:"triangle",to:120,v:.05,at:.26}); },
    water(){ if(!on) return; const c=ctx(); if(!c) return; if(play("water",.06)) return; const t=c.currentTime; for(let i=0;i<5;i++) bpNoise(c,t+i*.08,.12,1100+Math.random()*700,.7,.035); for(let i=0;i<4;i++){ const f0=480+Math.random()*400; tone(f0,.06,{type:"sine",to:f0*1.7,v:.02,at:.05+i*.09+Math.random()*.03}); } },
    creak(){ tone(70,.9,{type:"triangle",mid:120,end:85,v:.06}); noise(.25,.03,.6); },
    eerie(){ if(!gate("eerie",800)) return; tone(110,1.6,{type:"sine",v:.09}); tone(116.5,1.6,{type:"sine",v:.07}); tone(55,1.8,{type:"triangle",v:.05}); },
    trophy(){ const nw=performance.now(), w=Math.max(0,((last.boot||0)+1700-nw)/1000,((last.hlAt||0)+900-nw)/1000); seq([784,988,1175,1568],.075,{v:.045,at:w}); },
    get on(){ return on; },
    set(v){ on=!!v&&vol>0; try{ localStorage.setItem("sndMuted",on?"0":"1"); }catch(e){} if(on){ unlock(); S.coin(); } paint(); },
    vol(v){ vol=Math.max(0,Math.min(100,v|0)); try{ localStorage.setItem("sndVol",vol); }catch(e){} if(out) out.gain.value=2.5*vol/50; on=vol>0; if(on){ unlock(); S.blip(); } paint(); }
  };
  function paint(){ const b=document.getElementById("sndBtn"); if(!b) return; b.innerHTML=(typeof sprite==="function"?sprite(on?"spk":"spkoff",2):"")+"<span>"+(on?"ON":"OFF")+"</span>"; b.setAttribute("aria-pressed",on); b.title=on?"Sound: on":"Sound: off";
    if(pop){ pop.querySelector(".sp-tg").textContent=on?"MUTE":"UNMUTE"; const r=pop.querySelector("input"); r.value=vol; r.style.setProperty("--v",vol+"%"); pop.querySelector(".sp-n").textContent=vol; } }
  let pop=null;
  function place(){ const b=document.getElementById("sndBtn"); if(!pop||!b) return; const r=b.getBoundingClientRect(), w=pop.offsetWidth; pop.style.top=(r.bottom+8)+"px"; pop.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2))+"px"; }
  function closePop(){ if(!pop) return; pop.remove(); pop=null; const b=document.getElementById("sndBtn"); if(b) b.setAttribute("aria-expanded","false"); }
  function openPop(){ const b=document.getElementById("sndBtn"); pop=document.createElement("div"); pop.className="snd-pop"; pop.setAttribute("role","dialog"); pop.setAttribute("aria-label","Volume");
    pop.innerHTML='<div class="sp-h"><span>VOLUME</span><b class="sp-n"></b></div><input type="range" min="0" max="100" step="5" aria-label="Volume"><button type="button" class="sp-tg"></button>';
    document.body.appendChild(pop); b.setAttribute("aria-expanded","true");
    const r=pop.querySelector("input"); r.addEventListener("input",()=>S.vol(r.value));
    pop.querySelector(".sp-tg").addEventListener("click",e=>{ e.stopPropagation(); if(!on&&vol===0) S.vol(35); else S.set(!on); });
    paint(); place(); r.focus({preventScroll:true}); }
  addEventListener("resize",place); addEventListener("scroll",place,{passive:true});
  addEventListener("keydown",e=>{ if(pop&&e.key==="Escape"){ closePop(); const b=document.getElementById("sndBtn"); if(b) b.focus(); } });
  document.addEventListener("pointerdown",e=>{ if(pop&&!e.target.closest(".snd-pop,#sndBtn")) closePop(); },true);
  document.addEventListener("DOMContentLoaded",paint); setTimeout(paint,0);
  document.addEventListener("click",e=>{ const b=e.target.closest&&e.target.closest("#sndBtn"); if(b){ if(pop) closePop(); else { if(!on) S.set(true); openPop(); } return; }
    if(on&&e.target.closest&&e.target.closest("button,a.btn,.node,[role=button]")&&!e.target.closest(".ds")) S.click(); },true);
  /* typ-blip: tekst die letter per letter groeit */
  const prev=new WeakMap();
  new MutationObserver(ms=>{ if(!on) return; for(const m of ms){ const el=m.target.nodeType===3?m.target.parentNode:m.target; if(!el||el.closest&&el.closest("script,style,.cr")) continue;
      const tx=el.textContent||"", p=prev.get(el); prev.set(el,tx); if(p!=null&&tx.length>p.length&&tx.length-p.length<=2&&tx.startsWith(p)&&/\S$/.test(tx)){ S.blip(); return; } } })
    .observe(document.documentElement,{childList:true,characterData:true,subtree:true});
  return S;
})();
function say(t,ms){ if(window.SFX) SFX.talk();
  let txt=document.documentElement.dataset.theme==="light"?t:"* "+t.replace(/^> /,""); if(window.T) txt=T(txt);
  msg.classList.add("on"); clearTimeout(msgT); clearInterval(typeI); let i=0; msg.textContent="";
  typeI=setInterval(()=>{ i++; msg.textContent=txt.slice(0,i);
    if(i>=txt.length){ clearInterval(typeI); if(ms!==Infinity) msgT=setTimeout(()=>msg.classList.remove("on"),ms||2600); } },38);
}
function choose(i){
  setSel(i); const b=items[sel];
  if(b.dataset.closet){ say(document.documentElement.lang==="nl"?"> KLEERKAST GEOPEND":"> CLOSET OPENED"); if(window.Closet) Closet.open(); return; }
  if(b.dataset.game){ if(b.dataset.game==="pet") Pet.start(); else { Pet.stop(); Game.start(); } ds.scrollIntoView({behavior:"smooth",block:"center"}); return; }
  if(b.dataset.go){ say("> NAAR "+b.textContent+"..."); document.getElementById(b.dataset.go).scrollIntoView({behavior:"smooth"}); return; }
  const w=document.getElementById(b.dataset.win);
  const wasHidden=w.hidden; w.hidden=false; w.classList.remove("min","flash","pop"); void w.offsetWidth; w.classList.add(wasHidden?"pop":"flash");
  say("> "+b.textContent+" GELADEN"); if(window.Ach) Ach.saw(b.dataset.win);
  requestAnimationFrame(()=>w.scrollIntoView({behavior:"smooth",block:"center",inline:"center"}));
  drawWires();
}
function openLid(){ if(!ds.classList.contains("closed")) return; lidT=performance.now(); ds.classList.remove("closed"); setTimeout(drawWires,850); }
