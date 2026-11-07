/* easter eggs: de site onthoudt je, tab-titel, play again */
/* trofeeën */
window.Ach=(function(){
  const LIST=[
    ["boot","FIRST BOOT","Turn on the CATSOLE."],
    ["back","WELCOME BACK","Come back for a second visit."],
    ["pet","CAT WHISPERER","Pet the cat 25 times."],
    ["tale","CAT-TALE CHAMP","Beat DEADLINE in CAT-TALE."],
    ["chonk","CHONKY","Feed the cat until it's too fat."],
    ["slayer","DEADLINE SLAYER","Defeat DEADLINE in the boss fight."],
    ["flee","STRATEGIC RETREAT","Run away from the boss fight."],
    ["zero","ROCK BOTTOM","Lose all hearts."],
    ["burglar","CAT BURGLAR","Sneak the cat into the secret museum."],
    ["snoop","SNOOP","Find the boss's private log."],
    ["trash","DUMPSTER DIVER","Dig through the trash."],
    ["snip","SNIP SNIP","Cut all 11 sunflowers."],
    ["royal","ROYALTY","Enter the legendary cheat code."],
    ["love","TOO MUCH LOVE","Click the title cat until it leaves."],
    ["copy","COPYCAT","Copy some text from this site."],
    ["speed","SPEEDRUNNER","Beat CAT-TALE in under 60 seconds."],
    ["barely","BARELY SCRATCHED","Beat CAT-TALE with at least 6 HP left."],
    ["maxlove","MAX LOVE","Fill the love meter in PET THE CAT."],
    ["scratch","OUCH","Let the cat's love drop to zero."],
    ["gym","GYM RAT","Send the cat to the gym."],
    ["windows","WINDOW SHOPPER","Open all 5 info windows on the CATSOLE."],
    ["mini","MINIMALIST","Minimize a window."],
    ["read","BOOKWORM","Read the full story of every mission."],
    ["lang","BILINGUAL","Switch the language."],
    ["disco","DISCO","Switch between dark and light 10 times in a row."],
    ["linkedin","NETWORKER","Click the LinkedIn button."],
    ["sleep","GOOD NIGHT","Turn the CATSOLE off and close it."],
    ["archivist","ARCHIVIST","Find all 5 lost diary pages."],
    ["story","NOT FORGOTTEN","Finish the museum story."],
    ["escape","THE GREAT ESCAPE","Get your cat back from the museum.",1],
    ["trashcat","TRASH CAT","Find the trash cat and bring it to the museum.",1],
    ["flawless","UNTOUCHABLE","Beat CAT-TALE without getting hit.",2],
    ["owl","NIGHT OWL","Visit between 22:00 and 05:00.",2],
    ["eyes","MY EYES!!","Switch to light mode in the middle of the night.",2],
    ["movie","MOVIE NIGHT","Watch the whole story movie.",2]];
  const nl=()=>document.documentElement.lang==="nl";
  let got={}; try{ got=JSON.parse(localStorage.getItem("catTrophies")||"{}")||{}; }catch(e){}
  const q=[]; let busy=false;
  /* met 5 hartjes (meisjesnaam) is rock bottom een bonus-trofee */
  const T3=a=>a[0]==="zero"&&localGet("catHeartMax")==="5"?2:a[3];
  function render(){
    const main=LIST.filter(a=>T3(a)!==2), n=main.filter(a=>got[a[0]]).length, c=document.getElementById("trCount"), b=document.getElementById("trBar"), l=document.getElementById("trList");
    if(c) c.textContent="TROPHIES "+n+"/"+main.length; if(b) b.style.width=(n/main.length*100)+"%";
    const item=a=>{ const g=!!got[a[0]], hid=T3(a)===1&&!g;
      return `<li class="tr${g?" got":""}${T3(a)===2?" bonus":""}"><span class="tr-ic">${sprite(g?"trophy":"lock",2)}</span><div><b>${hid?"???":a[1]}</b><span>${hid?"hidden achievement":a[2]}${a[0]==="story"&&g&&window.Story&&Story.ending()?`<em class="tr-end">${Story.ending()==="stay"?"♥ stayed":"freed them all"}</em>`:""}</span></div></li>`; };
    const sec=(t,f,note)=>{ const g=LIST.filter(f), k=g.filter(a=>got[a[0]]).length;
      return `<li class="tr-h"><span>${t}</span><em>${k}/${g.length}</em></li>`+(note?`<li class="tr-note">${note}</li>`:"")+g.map(item).join(""); };
    if(l) l.innerHTML=sec("NORMAL",a=>!T3(a))+sec("HIDDEN",a=>T3(a)===1)+sec("BONUS",a=>T3(a)===2,"not needed for 100%");
  }
  function next(){ const id=q.shift(); if(!id){ busy=false; return; } busy=true; if(id==="ALL"){ celebrate(); setTimeout(next,5400); return; } const a=LIST.find(x=>x[0]===id);
    const el=document.createElement("div"); el.className="ach-pop"; el.setAttribute("role","status");
    el.innerHTML=`<span class="ac-i">${sprite("trophy",3)}</span><div><small>ACHIEVEMENT UNLOCKED</small><b>${a[1]}</b></div>`;
    document.body.appendChild(el); setTimeout(()=>{ el.remove(); setTimeout(next,250); },3400); }
  function allPlus(){ return LIST.every(a=>got[a[0]]); }
  let tsDone=false;
  function addTop(){
    if(document.getElementById("topBtn")) return; const menu=document.getElementById("menu"); if(!menu) return;
    const li=document.createElement("li"); li.innerHTML='<button id="topBtn" data-win="w-tops">TOPSECRET.TXT</button>'; menu.appendChild(li); menu.classList.add("ten"); if(menu.children.length>=11) menu.classList.add("eleven");
    const b=li.firstChild; items.push(b); b.addEventListener("click",()=>{ if(!ds.classList.contains("off")) choose(items.indexOf(b)); }); setSel(sel);
  }
  function topSecret(live){ if(tsDone||!allPlus()) return; tsDone=true; addTop();
    if(live) setTimeout(()=>window.Memo&&Memo.toast(nl()?"* ...wacht. er staat nog een bestand op de CATSOLE. dit is TOP SECRET.":"* ...wait. another file appeared on the CATSOLE. this one is TOP SECRET.",5000),4000);
    setTimeout(()=>{
    const H="font-family:monospace;font-size:13px;line-height:1.6;color:#bbb", R="font-family:monospace;font-size:13px;line-height:1.6;color:#ff2b2b;font-weight:bold";
    console.log("%c████ CLASSIFIED · LEVEL ∞ ████","font-family:monospace;font-size:15px;font-weight:bold;color:#000;background:#ffd23f;padding:4px 8px");
    console.log("%c* ok. you're in the console. again.\n* you read SECRET.TXT. you read TOPSECRET.TXT. and you STILL kept digging.\n* there is nothing left. i promise.\n* ...",R);
    console.log("%c* fine. here are the real secrets:\n*   - the cat has no name. it never told me.\n*   - PIXEL's site is from 2002. so am i. you noticed, right?\n*   - DEADLINE is based on a real deadline. it won. several times.\n*   - this whole site started as \"just a simple portfolio\".\n* type meow() if you want. it does nothing. probably.",H);
    console.log("%c— QH, logging off","font-family:monospace;font-size:12px;font-style:italic;color:#ffd23f");
    window.meow=()=>{ const n=(window.__meows=(window.__meows||0)+1);
      const say=n===1?"meow.":n===2?"meow. (again)":n===3?"...the cat is sitting on your keyboard now.":n<6?"meow"+"!".repeat(n-2):"* the cat has left. it needs a nap. try again tomorrow.";
      console.log("%c /\\_/\\\n( o.o )  "+say+"\n > ^ <","font-family:monospace;font-size:14px;line-height:1.2;color:#ffd23f"); return "♥"; };
    },60); }
  function unlock(id){ if(got[id]||!LIST.some(a=>a[0]===id)) return; got[id]=1; if(window.SFX) setTimeout(SFX.trophy,150); try{ localStorage.setItem("catTrophies",JSON.stringify(got)); }catch(e){} render(); q.push(id); if(Object.keys(got).length&&done()&&!localGet("catAllDone")){ localPut("catAllDone","1"); q.push("ALL"); } if(!busy) next(); topSecret(true); }
  function localGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function localPut(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function done(){ return LIST.every(a=>T3(a)===2||got[a[0]]); }
  const setOf=k=>{ try{ return new Set(JSON.parse(localGet(k)||"[]")); }catch(e){ return new Set(); } };
  function saw(win){ const S=setOf("catSeenWin"); S.add(win); localPut("catSeenWin",JSON.stringify([...S])); if(["w-hello","w-tools","w-train","w-skills","w-proj"].every(w=>S.has(w))) unlock("windows"); }
  function read(i){ if(!MISSIONS[i]||!MISSIONS[i].more) return; const S=setOf("catRead"); S.add(i); localPut("catRead",JSON.stringify([...S])); if(MISSIONS.every((m,j)=>!m.more||S.has(j))) unlock("read"); }
  let flips=[]; function theme(){ const n=Date.now(); flips.push(n); flips=flips.filter(t=>n-t<8000); if(flips.length>=10) unlock("disco"); }
  /* 100%: feest + secret.txt in het consolemenu */
  function addSecret(){
    if(document.getElementById("secretBtn")) return; const menu=document.getElementById("menu"); if(!menu) return;
    const li=document.createElement("li"); li.innerHTML='<button id="secretBtn" data-win="w-secret">SECRET.TXT</button>'; menu.appendChild(li); menu.classList.add(menu.children.length>=10?"ten":"nine"); if(menu.children.length>=11) menu.classList.add("eleven");
    const b=li.firstChild; items.push(b); b.addEventListener("click",()=>{ if(!ds.classList.contains("off")) choose(items.indexOf(b)); }); setSel(sel);
    const tw=document.getElementById("w-trophy"); if(tw) tw.classList.add("done");
  }
  function celebrate(){
    const o=document.createElement("div"); o.className="all-pop"; o.setAttribute("role","status"); let cf="";
    const C=["#ffd23f","var(--red)","var(--ink)","#5bc0ff"];
    for(let k=0;k<44;k++) cf+=`<i style="left:${(k*37)%100}%;animation-delay:${-(k*.23%3).toFixed(2)}s;animation-duration:${(2.2+k%5*.3).toFixed(2)}s;background:${C[k%4]}"></i>`;
    o.innerHTML=`<div class="all-cf">${cf}</div><div class="all-box"><span class="ac-i">${sprite("trophy",8)}</span><b>100%</b><small>ALL TROPHIES</small></div>`;
    document.body.appendChild(o);
    const close=()=>{ if(!o.isConnected) return; o.remove(); addSecret(); setTimeout(()=>window.Memo&&Memo.toast(nl()?"* psst. er staat een nieuw bestand op de console.":"* psst. there's a new file on the console.",4500),400); };
    o.addEventListener("click",close); setTimeout(close,5000);
  }
  render(); if(done()) addSecret(); topSecret();
  let cheatSaid=false;
  function cheat(ids){ localPut("cheater","1"); ids.forEach(unlock);
    if(!cheatSaid){ cheatSaid=true; setTimeout(()=>window.Memo&&Memo.toast(nl()?"* ...goed geprobeerd. de kat zag je in de console. * nieuwe titel: VALSSPELER. 🃏":"* ...nice try. the cat saw you in the console. * new title unlocked: CHEATER. 🃏",6000),1200); }
    return nl()?"* de kat heeft het gezien. 🃏":"* the cat saw that. 🃏"; }
  return {earn:unlock,unlock:id=>cheat([id]),all:()=>cheat(LIST.map(a=>a[0])),has:id=>!!got[id],done,saw,read,theme,refresh:render};
})();
