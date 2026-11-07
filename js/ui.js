/* thema-knop */
(function(){
  const b=document.getElementById("themeBtn"), l=document.getElementById("themeLbl");
  const sync=()=>{ l.textContent=document.documentElement.dataset.theme==="light"?"DARK":"LIGHT"; };
  sync();
  b.addEventListener("click",()=>{
    const n=document.documentElement.dataset.theme==="light"?"dark":"light";
    document.documentElement.dataset.theme=n; try{localStorage.setItem("portfolioThema",n);}catch(e){}
    sync(); if(typeof drawWires==="function") drawWires(); if(n==="light"&&window.Memo) Memo.eyes(); if(window.Ach) Ach.theme();
  });
})();

/* marquees */
const mq=document.querySelectorAll(".marquee .track");
["Over mij","Missies","Logboek"].forEach((t,i)=>{ if(mq[i]) mq[i].innerHTML=Array(16).fill(`<span>${t}</span>`).join(""); });

/* start */
const screen=document.getElementById("screen"), ds=document.getElementById("ds");
function start(){
  document.getElementById("level1").scrollIntoView({behavior:"smooth"});
  setTimeout(()=>ds.focus({preventScroll:true}),600);
}
document.getElementById("startBtn").addEventListener("click",start);
document.addEventListener("keydown",e=>{
  if(e.key==="Enter" && window.scrollY<window.innerHeight*.5 && document.activeElement===document.body){e.preventDefault();start();}
});

/* hud: xp-balk + stage */
const xp=document.getElementById("xpbar"), sn=document.getElementById("stageName");
const stages=[...document.querySelectorAll("[data-stage]")];
function onScroll(){
  const max=document.documentElement.scrollHeight-innerHeight;
  xp.style.width=(max>0?Math.min(100,scrollY/max*100):0)+"%";
  let cur=stages[0];
  stages.forEach(s=>{ if(s.getBoundingClientRect().top<innerHeight*.45) cur=s; });
  if(max>0&&scrollY>=max-4) cur=stages[stages.length-1];
  sn.textContent="STAGE: "+cur.dataset.stage;
}
addEventListener("scroll",onScroll,{passive:true}); onScroll();

/* console */
const items=[...document.querySelectorAll("#menu button")];
const msg=document.getElementById("sMsg"), sImg=document.getElementById("sImg");
let sel=0, msgT;
function setSel(i){ const ns=(i+items.length)%items.length; if(ns!==sel&&window.SFX&&SFX.move) SFX.move(); sel=ns; items.forEach((b,j)=>b.setAttribute("aria-current",j===sel)); }
let typeI=0;
/* consoleberichten typen letter per letter, zoals in een rpg */
