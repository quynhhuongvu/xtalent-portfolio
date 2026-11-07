/* cursor: stylus (eigen ontwerp) */
(function(){
  if(!matchMedia("(pointer:fine)").matches) return;
  // pixel-stylus: punt linksonder (hotspot), dop rechtsboven
  const cells=[];
  for(let k=0;k<13;k++){
    const x=3+k*2, y=27-k*2;
    const col=k<1?"#e6e6e6":k<3?"#9a9a9a":k>10?"#2b2b2b":(k%2?"#6a6a6a":"#7c7c7c");
    cells.push(`<rect x="${x}" y="${y-2}" width="3" height="3" fill="${col}"/>`);
    if(k>=3&&k<=10) cells.push(`<rect x="${x+1}" y="${y-2}" width="1" height="1" fill="#cfcfcf"/>`);
  }
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" shape-rendering="crispEdges">
    <g filter="url(#o)">${cells.join("")}<rect x="1" y="28" width="2" height="2" fill="#fff"/></g>
    <defs><filter id="o" x="-20%" y="-20%" width="140%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="2" result="d2"/><feFlood flood-color="#fff"/><feComposite in2="d2" operator="in" result="w"/><feMorphology in="SourceAlpha" operator="dilate" radius="1" result="d"/><feFlood flood-color="#000"/><feComposite in2="d" operator="in" result="k"/><feMerge><feMergeNode in="w"/><feMergeNode in="k"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>`;
  document.documentElement.style.setProperty("--cur",`url("data:image/svg+xml,${encodeURIComponent(svg)}") 1 30`);
  document.documentElement.classList.add("cubes");
})();
