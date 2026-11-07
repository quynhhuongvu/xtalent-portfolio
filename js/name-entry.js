/* naam invoeren (eerste keer console aan) */
window.playerName=()=>{ try{ return localStorage.getItem("playerName")||""; }catch(e){ return ""; } };
window.NameEntry=(function(){
  const get=k=>{ try{ return localStorage.getItem(k); }catch(e){ return null; } }, put=(k,v)=>{ try{ localStorage.setItem(k,v); }catch(e){} };
  const MAX=9, TT=x=>window.T?T(x):x; let ov=null, name="", done=null, kd=null;
  function need(){ return !get("playerName")&&!get("playerNameSkip"); }
  function paint(){ if(!ov) return; ov.querySelector(".nm-sr").textContent=name; [...ov.querySelectorAll(".nm-sl")].forEach((sl,i)=>{ sl.textContent=name[i]&&name[i]!==" "?name[i]:""; sl.classList.toggle("cur",i===name.length); }); ov.querySelector(".nm-name").classList.toggle("full",name.length>=MAX); }
  function add(ch){ if(name.length>=MAX){ shake(); return; } if(ch===" "&&(!name||name.endsWith(" "))) return; name+=ch; paint(); }
  function del(){ name=name.slice(0,-1); paint(); }
  function shake(){ const b=ov&&ov.querySelector(".nm-name"); if(!b) return; b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); }
  function finish(skip){ const n=name.trim(); if(!skip&&!n){ shake(); return; }
    const close=()=>{ removeEventListener("keydown",kd,true); if(ov) ov.remove(); ov=null; const cb=done; done=null; if(cb) cb(skip?"":n); };
    if(skip){ put("playerNameSkip","1"); close(); return; }
    const dk=/^deadline$/i.test(n)?"deadline":/^(nata|nataniel|nathaniel)$/i.test(n)?"nata":null; if(dk){ removeEventListener("keydown",kd,true); ov.remove(); ov=null; die(dk); return; }
    if(ov.classList.contains("judging")) return;
    if(/^(catha|catharina|quynh|huong|qh|quynh huong)$/i.test(n)){ ov.classList.add("judging"); if(window.SFX) SFX.hit();
      const nl=(()=>{ try{ return localStorage.getItem("lang")==="nl"; }catch(e){ return false; } })(), line=nl?"* hé, dat is MIJN naam?? ...bedrieger?? probeer opnieuw.":"* hey, that's MY name?? ...imposter?? try again.", p=ov.querySelector(".nm-judge"); let i=0;
      (function ty(){ if(!ov) return; p.textContent=line.slice(0,++i); if(i<line.length) setTimeout(ty,45); else setTimeout(()=>{ if(!ov) return; ov.classList.remove("judging"); p.textContent=""; name=""; paint(); shake(); ov.querySelector(".nm-card").focus({preventScroll:true}); },1700); })();
      return; }
    put("playerName",n); ov.classList.add("judging");
    fx=0; const line=judge(n), p=ov.querySelector(".nm-judge"); let i=0;
    (function ty(){ if(!ov) return; p.textContent=line.slice(0,++i); if(i<line.length) setTimeout(ty,45); else { if(fx&&window.Life){ Life.setMax(fx>0?5:1); if(window.SFX) (fx>0?SFX.trophy:SFX.hit)(); } setTimeout(close,fx?2200:1600); } })(); }
  let fx=0;
  const BOYS="adam,adrian,ahmed,alex,alexander,ali,andreas,andrew,anthony,arne,arthur,axel,ben,benjamin,bert,bob,bram,brent,brian,bryan,charles,chris,christian,christopher,daan,daniel,dave,david,dennis,dieter,dirk,dries,dylan,eddy,elias,emiel,emil,eric,erik,ethan,felix,filip,finn,frank,frederik,gert,gilles,glenn,hans,harry,henk,henry,hugo,ian,jack,jacob,jake,james,jan,jannes,jari,jason,jasper,jef,jelle,jens,jeroen,jesse,jim,joachim,joe,joey,johan,john,jonas,jonathan,joost,jordy,joris,jos,joseph,josh,julien,karel,kevin,kobe,koen,kyle,lars,leo,liam,louis,lucas,luc,luca,luke,lukas,marc,mark,mario,mark,martijn,martin,mathias,matthias,matteo,mattias,max,maxim,michael,michiel,mike,milan,mohamed,nathan,nick,nico,niels,noah,olivier,oscar,owen,patrick,paul,peter,philip,pieter,quinten,raf,rob,robbe,robert,ruben,ryan,sam,sander,sebastian,senne,seppe,simon,stef,stefan,steven,stijn,thomas,tim,timo,tom,toon,vincent,warre,wim,wout,wouter,xander,yannick,yoran,zakaria,anh,minh,duc,hung,huy,khoa,long,nam,phuc,quang,thanh,tuan,viet,vinh,isaia,melvin,bjorn,abdul,son,rong,badi,mehmet".split(",");
  const GIRLS="robin,veerle,amber,amelie,amy,ana,anna,anne,annelies,astrid,aya,bente,bo,camille,charlotte,chloe,clara,dana,elena,elien,eline,elise,ella,ellen,elisa,ema,emily,emma,eva,evi,febe,fien,fleur,hanna,hannah,helena,ines,isa,isabel,jana,jasmine,jessica,jolien,julia,julie,justine,kaat,karen,kate,katrien,kim,laura,lena,lien,lies,lisa,lise,lore,lotte,louise,lucy,luna,maaike,mae,margot,maria,marie,marieke,marthe,maya,mila,mira,nina,noor,nora,olivia,paulien,rachel,rani,renee,rose,sara,sarah,silke,sofie,sophie,stephanie,tess,tine,tessa,valerie,vanessa,vera,yana,yasmine,zoe,zoë,lan,linh,mai,ngoc,nhi,thao,trang,uyen,vy,hoa,huong,thu,kalena,gigi,angel,may".split(",");
  const ANIMALS=[[["dog", "hond", "doggo", "puppy"], ["* a DOG?? in MY house?? ...the cat hisses at you.", "* een HOND?? in MIJN huis?? ...de kat blaast naar je."]], [["monkey", "aap", "ape", "chimp"], ["* ...ooh ooh aah aah. the cat is not impressed.", "* ...oe oe aa aa. de kat is niet onder de indruk."]], [["baboon", "baviaan", "gorilla"], ["* ...a baboon. bold choice. please don't touch the keyboard.", "* ...een baviaan. gedurfd. raak het toetsenbord niet aan aub."]], [["mouse", "muis", "rat"], ["* ...a mouse? the cat is looking at you. hungrily.", "* ...een muis? de kat kijkt naar je. hongerig."]], [["fish", "vis", "tuna", "salmon", "zalm", "tonijn"], ["* ...a fish. the cat is drooling now. run.", "* ...een vis. de kat kwijlt nu. ren."]], [["bird", "vogel", "birdie", "parrot", "papegaai"], ["* tweet tweet? the cat is doing that chatter thing.", "* tjilp tjilp? de kat maakt dat klappergeluidje."]], [["cow", "koe"], ["* moo. ...the cat doesn't speak cow.", "* boe. ...de kat spreekt geen koe."]], [["pig", "varken", "piggy"], ["* oink. at least you're honest.", "* knor. je bent tenminste eerlijk."]], [["horse", "paard", "pony"], ["* neigh. you're too big for this console.", "* hihihi. je bent te groot voor deze console."]], [["donkey", "ezel"], ["* ...donkey. who hurt you?", "* ...ezel. wie heeft je pijn gedaan?"]], [["bear", "beer", "teddy"], ["* a bear. the cat is pretending you're not there.", "* een beer. de kat doet alsof je er niet bent."]], [["frog", "kikker", "toad", "pad"], ["* ribbit. the cat wants to bat you around now.", "* kwaak. de kat wil nu met je spelen."]], [["snake", "slang"], ["* hsss. the cat hisses back. louder.", "* sss. de kat blaast terug. harder."]], [["duck", "eend", "duckie"], ["* quack. you may pass. the cat respects ducks.", "* kwak. je mag erdoor. de kat respecteert eenden."]], [["rabbit", "bunny", "konijn"], ["* a bunny! ...the cat is trying to act cool.", "* een konijntje! ...de kat probeert cool te doen."]], [["hamster", "cavia"], ["* a hamster. tiny. snackable. (just kidding.)", "* een hamster. klein. snackbaar. (grapje.)"]], [["lion", "leeuw", "tiger", "tijger"], ["* ...a big cat. the small cat bows respectfully.", "* ...een grote kat. de kleine kat buigt beleefd."]], [["chicken", "kip", "kippetje"], ["* bawk. the cat smells dinner.", "* tok tok. de kat ruikt avondeten."]], [["goat", "geit", "sheep", "schaap"], ["* baa. ...the cat is confused but polite.", "* bèè. ...de kat is in de war maar beleefd."]], [["fox", "vos"], ["* a fox. sneaky. the cat is watching you closely.", "* een vos. sluw. de kat houdt je goed in de gaten."]], [["owl", "uil"], ["* hoo. a night owl. explains the 3am visit.", "* oehoe. een nachtuil. dat verklaart het bezoek om 3u."]], [["penguin", "pinguin"], ["* a penguin! fancy. the cat approves the suit.", "* een pinguïn! chique. de kat keurt het pak goed."]], [["panda"], ["* a panda. the cat demands to know your secrets.", "* een panda. de kat wil al je geheimen weten."]], [["shark", "haai"], ["* a shark?? on land?? the cat backs away slowly.", "* een haai?? op het land?? de kat loopt langzaam weg."]], [["giraffe"], ["* a giraffe. please mind the ceiling.", "* een giraf. let op het plafond aub."]], [["spider", "spin"], ["* a spider. the cat has questions. and claws.", "* een spin. de kat heeft vragen. en klauwen."]], [["bee", "bij", "wasp", "wesp"], ["* bzzz. the cat swats at the screen.", "* bzzz. de kat mept naar het scherm."]], [["goose", "gans"], ["* honk. the cat leaves. it wants no trouble.", "* gak. de kat gaat weg. hij wil geen gedoe."]]];
  function judge(n){ const nl=(document.documentElement.lang||"").startsWith("nl")||(()=>{ try{ return localStorage.getItem("lang")==="nl"; }catch(e){ return false; } })(), lo=n.toLowerCase();
    const P=(en,d)=>nl?d:en;
    if(/^(cat|kat|kitty|poes|pixel)$/.test(lo)) return P("* ...nice try. the cat is already taken.","* ...goed geprobeerd. de kat is al bezet.");
    { const an=ANIMALS.find(a=>a[0].includes(lo)); if(an) return nl?an[1][1]:an[1][0]; }
    if(BOYS.includes(lo)){ fx=-1; return P("* ....men..... you don't deserve more than 1 life.","* ....mannen..... je verdient maar 1 leven."); }
    if(GIRLS.includes(lo)){ fx=1; return P("* OMG A GIRL!!! yay!! ♥ the cat LOVES you!! have 2 extra hearts!!","* OMG EEN MEISJE!!! joepie!! ♥ de kat is VERLIEFD op jou!! hier, 2 extra hartjes!!"); }
    if(n.length>=9) return P("* ...that's a long name. the cat fell asleep.","* ...lange naam. de kat viel in slaap.");
    if(n.length<=2) return P(`* ...${n}? that's it?`,`* ...${n}? is dat alles?`);
    const L=[[`* ...${n}. what a special name.`,`* ...${n}. wat een speciale naam.`],[`* ${n}... hm. the cat is judging you.`,`* ${n}... hm. de kat kijkt je raar aan.`],[`* ...${n}? interesting choice.`,`* ...${n}? interessante keuze.`],[`* ${n}. okay. we'll go with that.`,`* ${n}. oké. we doen het ermee.`],[`* ...${n}. the cat will remember that.`,`* ...${n}. de kat gaat dat onthouden.`]];
    const k=L[Math.floor(Math.random()*L.length)]; return nl?k[1]:k[0]; }
  function open(cb){ if(ov) return; done=cb; name="";
    const L="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    ov=document.createElement("div"); ov.className="nm";
    ov.innerHTML=`<div class="nm-card" role="dialog" aria-modal="true" aria-labelledby="nmQ" tabindex="-1">
      <p class="nm-q" id="nmQ">${TT("* what's your name, player?")}</p>
      <div class="nm-name" aria-live="polite"><span class="nm-sr"></span>${Array.from({length:9},()=>`<i class="nm-sl" aria-hidden="true"></i>`).join("")}</div><p class="nm-judge" aria-live="polite"></p>
      <div class="nm-keys">${L.map(c=>`<button type="button" class="nm-k" data-c="${c}">${c}</button>`).join("")}</div>
      <div class="nm-row"><button type="button" class="nm-k nm-w" data-a="sp">${TT("SPACE")}</button><button type="button" class="nm-k nm-w" data-a="del">${TT("DEL")}</button><button type="button" class="nm-k nm-w nm-ok" data-a="ok">${TT("DONE")} &#9654;</button></div>
      <div class="nm-foot"><button type="button" class="nm-skip" data-a="skip">${TT("SKIP")}</button></div></div>`;
    document.body.appendChild(ov);
    ov.addEventListener("click",e=>{ const b=e.target.closest("button"); if(!b) return; const c=b.dataset.c, a=b.dataset.a;
      if(ov.classList.contains("judging")) return;
      if(c) add(name.length&&!name.endsWith(" ")?c.toLowerCase():c); else if(a==="sp") add(" "); else if(a==="del") del(); else if(a==="ok") finish(false); else if(a==="skip") finish(true); });
    kd=e=>{ if(!ov) return; if(ov.classList.contains("judging")){ e.stopImmediatePropagation(); return; } const k=e.key, ae=document.activeElement, onBtn=ae&&ov.contains(ae)&&ae.tagName==="BUTTON";
      if(k==="Escape"){ e.preventDefault(); e.stopImmediatePropagation(); finish(true); return; }
      if(k==="Enter"){ if(onBtn) return; e.preventDefault(); e.stopImmediatePropagation(); finish(false); return; }
      if(k==="Backspace"){ e.preventDefault(); e.stopImmediatePropagation(); del(); if(window.SFX) SFX.blip(); return; }
      if(k==="Tab"||k.startsWith("Arrow")){ e.stopImmediatePropagation(); return; }
      if(k.length===1&&/[\p{L}\p{N} .\-']/u.test(k)&&!e.ctrlKey&&!e.metaKey&&!e.altKey){ e.preventDefault(); e.stopImmediatePropagation(); add(k); if(window.SFX) SFX.blip(); const ae2=document.activeElement; if(ae2&&ae2.classList&&ae2.classList.contains("nm-k")) ov.querySelector(".nm-card").focus({preventScroll:true}); return; }
      e.stopImmediatePropagation(); };
    addEventListener("keydown",kd,true); paint(); ov.querySelector(".nm-card").focus({preventScroll:true}); }
  /* easter egg: wie deadline als naam typt, gaat meteen dood */
  function die(kind){ const nl=(()=>{ try{ return localStorage.getItem("lang")==="nl"; }catch(e){ return false; } })(), cat=kind==="nata";
    if(window.SFX){ if(cat){ SFX.meow(); setTimeout(SFX.hit,450); setTimeout(SFX.hit,620); setTimeout(SFX.hit,790); } else { SFX.hit(); setTimeout(SFX.hit,600); } setTimeout(SFX.lose,1700); }
    if(window.Life) Life.set(0);
    const intro=cat?`<div class="dl-claw" aria-hidden="true"><span class="cc">${sprite("blackcat",10)}</span><i></i><i></i><i></i></div>`:`<div class="dl-heart" aria-hidden="true"><span class="h1">${sprite("heart",12)}</span><span class="h2">${sprite("heart",12)}</span></div>`;
    const top=cat?`<div class="dl-mon dl-cat">${sprite("catfront",7)}</div>`:`<div class="dl-mon">${SPR.deadline?sprite("deadline",8):""}</div>`;
    const o=document.createElement("div"); o.className="museum go-scr dl-die"+(cat?" dl-nata":""); o.setAttribute("role","alertdialog"); o.setAttribute("aria-modal","true"); o.setAttribute("aria-label","Game over");
    o.innerHTML=`${intro}<div class="mu-in">${top}<div class="go-t">GAME OVER</div><div class="mu-box"><p></p><p></p></div></div>`;
    document.body.appendChild(o); document.documentElement.style.overflow="hidden";
    const lines=cat?(nl?["* de kat herkent die naam.","* ...en koos voor geweld."]:["* the cat recognizes that name.","* ...and chose violence."])
                   :(nl?["* je typte MIJN naam.","* ...dat had je niet moeten doen."]:["* you typed MY name.","* ...you shouldn't have done that."]);
    const ps=o.querySelectorAll(".mu-box p"); let li=0, ci=0;
    setTimeout(function ty(){ if(!o.isConnected) return; if(li>=lines.length){ setTimeout(restart,1800); return; } ps[li].textContent=lines[li].slice(0,++ci);
      if(ci>=lines[li].length){ li++; ci=0; setTimeout(ty,800); } else setTimeout(ty,55); },2300);
    function restart(){ /* terug naar het startscherm: console uit en dicht, naam opnieuw vragen */
      o.classList.add("dl-out"); setTimeout(()=>{ o.remove(); document.documentElement.style.overflow=""; done=null;
        if(typeof ds!=="undefined"){ if(!ds.classList.contains("off")) power(); ds.classList.add("closed"); setTimeout(()=>typeof drawWires==="function"&&drawWires(),850); }
        if(window.Life) Life.setMax(3); const t=document.getElementById("titel"); if(t) t.scrollIntoView({behavior:"instant",block:"start"}); scrollTo(0,0); },700); }
  }
  return {need,open};
})();
document.querySelector(".title .hero img").addEventListener("click",()=>{ const h=document.querySelector(".title .hero"); h.classList.remove("jump"); void h.offsetWidth; h.classList.add("jump"); if(window.SFX) SFX.jump(); });
function power(){
  const on=ds.classList.toggle("off")===false;
  if(on){ screen.classList.remove("boot"); void screen.offsetWidth; screen.classList.add("boot"); if(window.SFX) SFX.boot(); setTimeout(()=>{ const hi=n=>{ let cw=0, ch=0; try{ cw=localStorage.getItem("coward")==="1"; ch=localStorage.getItem("cheater")==="1"; }catch(e){} say("> Hii, "+(n||"player")+(cw&&ch?" the cheating coward":cw?" the coward":ch?" the cheater":"")+"!"); }; if(NameEntry.need()) NameEntry.open(hi); else hi(playerName()); },window.SFX&&SFX.on?950:500); if(window.Memo) Memo.greet(); if(window.Ach) Ach.earn("boot"); }
  else { if(window.SFX) SFX.off(); Game.stop(); Pet.stop(); screen.classList.remove("show-stats"); msg.classList.remove("on"); document.querySelectorAll(".win[data-wire]").forEach(w=>{ w.hidden=true; w.classList.remove("min","flash","pop"); }); drawWires(); }
}
document.getElementById("lidBack").addEventListener("click",openLid);
let lidT=0;
function closeLid(){ if(ds.classList.contains("closed")||!ds.classList.contains("off")) return; ds.classList.add("closed"); if(window.Ach) Ach.earn("sleep"); setTimeout(drawWires,850); }
ds.addEventListener("click",e=>{
  if(e.target.closest("#lidBack,button,.cpad,.touch,canvas")) return;
  if(performance.now()-lidT<900) return;
  closeLid();
});
function press(k){ if(window.SFX) SFX.click();
  if(ds.classList.contains("closed")){ if(k==="a") openLid(); return; }
  if(k==="power"){ power(); return; }
  if(ds.classList.contains("off")) return;
  if(k==="home"){ Game.stop(); Pet.stop(); screen.classList.remove("show-stats"); msg.classList.remove("on"); setSel(0); { const h=window.catHome&&catHome(); if(h){ say(h==="back"?"I'm back!!":"I escaped!!",3200); return; } } say("> HOME"); return; }
  if(Pet.active){ if(k==="b"||k==="select") Pet.stop(); else if(k==="x") Pet.treat(); else if(k==="y") Pet.play(); else if(["a","up","start"].includes(k)) Pet.pet(); return; }
  if(Game.active){ if(k==="b"||k==="select") Game.stop(); else if(k==="x") Game.pause(); else if(k==="y") Game.restart(); else if(["a","start"].includes(k)) Game.jump(); return; }
  if(k==="up"||k==="left") setSel(sel-1);
  else if(k==="down"||k==="right") setSel(sel+1);
  else if(k==="a"||k==="start") choose(sel);
  else if(k==="b"){ screen.classList.remove("show-stats"); msg.classList.remove("on"); }
  else if(k==="x"||k==="select"){ screen.classList.toggle("show-stats"); say(screen.classList.contains("show-stats")?"> STATS":"> SPELER"); }
  else if(k==="y"){ sImg.classList.remove("jump"); void sImg.offsetWidth; sImg.classList.add("jump"); }
}
items.forEach((b,i)=>b.addEventListener("click",()=>{ if(!ds.classList.contains("off")) choose(i); }));
document.querySelectorAll(".ds [data-k]").forEach(b=>b.addEventListener("click",()=>press(b.dataset.k)));
const keymap={" ":"a",p:"power",ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",Enter:"a",a:"a",b:"b",Escape:"b",x:"x",y:"y"};
ds.addEventListener("keydown",e=>{ if(e.target!==ds) return; const k=keymap[e.key]; if(k){e.preventDefault();press(k);} });
setSel(0);
