(function(){
document.querySelectorAll('.win .w-in').forEach(function(wi){
  var body=wi.querySelector('.w-body'),sc=wi.querySelector('.w-scroll');if(!body||!sc)return;
  var up=sc.firstElementChild,dn=sc.lastElementChild,th=sc.querySelector('.thumb');
  function max(){return body.scrollHeight-body.clientHeight}
  function track(){return sc.clientHeight-up.offsetHeight-dn.offsetHeight-th.offsetHeight-8}
  function sync(){var m=max();sc.classList.toggle('live',m>2);th.style.transform='translateY('+(m>2?Math.round(body.scrollTop/m*track()):0)+'px)'}
  body.addEventListener('scroll',sync);window.addEventListener('resize',sync);
  new MutationObserver(sync).observe(wi.closest('.win'),{attributes:true,attributeFilter:['hidden','class']});
  up.addEventListener('click',function(e){e.stopPropagation();body.scrollBy({top:-90,behavior:'smooth'})});
  dn.addEventListener('click',function(e){e.stopPropagation();body.scrollBy({top:90,behavior:'smooth'})});
  sc.addEventListener('pointerdown',function(e){
    if(max()<=2||e.target===up||e.target===dn)return;e.preventDefault();e.stopPropagation();
    var r=sc.getBoundingClientRect(),off=e.target===th?e.clientY-th.getBoundingClientRect().top:th.offsetHeight/2;
    function mv(ev){var y=ev.clientY-r.top-up.offsetHeight-4-off;body.scrollTop=Math.max(0,Math.min(1,y/track()))*max()}
    mv(e);sc.setPointerCapture(e.pointerId);
    sc.onpointermove=mv;sc.onpointerup=sc.onpointercancel=function(){sc.onpointermove=null}
  });
  setTimeout(sync,300);
});
})();
