/* thema: zwart (standaard) of wit */
(function(){
  const DEF="dark"; let t=DEF;
  try{ t=localStorage.getItem("portfolioThema")||DEF; }catch(e){}
  document.documentElement.dataset.theme=t;
})();
/* bij verversen altijd terug naar boven (titelscherm) */
try{ history.scrollRestoration="manual"; }catch(e){}
if(location.hash){ try{ history.replaceState(null,"",location.pathname+location.search); }catch(e){} }
window.scrollTo(0,0); addEventListener("load",()=>window.scrollTo(0,0));
addEventListener("pageshow",()=>window.scrollTo(0,0));
