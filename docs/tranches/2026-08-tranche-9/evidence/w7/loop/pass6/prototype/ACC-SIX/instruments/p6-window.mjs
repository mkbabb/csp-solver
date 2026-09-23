// PASS-6 COPY of pass5/critique/ACC-SIX/instruments/c5-window.mjs (the ACC-SIX lane runs it BEFORE any mint, charter row 1). Added: the Y band per floor, derived from the painted grounds.
// ACC-SIX pass-5 CRITIC — the contrast WINDOW by arithmetic on the PAINTED grounds the differencing reads (light line 49 / edge 230,230,228 / paper 253,253,252; dark 199 / 44,43,41 / 19,18,17): the three tested rungs, the best violet at the locked hue (292–295°) for min over the three light grounds, and the best ANY colour over the three dark grounds. Painted confirmation of the found rung is c5-trace.mjs (arm balanced_8f61f6).
const lin=c=>((c/=255)<=0.04045?c/12.92:((c+0.055)/1.055)**2.4);
const Y=([r,g,b])=>0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
const CR=(a,b)=>{const x=Y(a),y=Y(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
// oklch hue
function oklch([r,g,b]){const R=lin(r),G=lin(g),B=lin(b);const l=Math.cbrt(.4122214708*R+.5363325363*G+.0514459929*B),m=Math.cbrt(.2119034982*R+.6806995451*G+.1073969566*B),s=Math.cbrt(.0883024619*R+.2817188376*G+.6299787005*B);const L=.2104542553*l+.793617785*m-.0040720468*s,a=1.9779984951*l-2.428592205*m+.4505937099*s,bb=.0259040371*l+.7827717662*m-.808675766*s;return [L,Math.hypot(a,bb),(Math.atan2(bb,a)*180/Math.PI+360)%360]}
const G={line:[49,49,49],edge:[230,230,228],paper:[253,253,252]};
const D={line:[199,199,199],edge:[44,43,41],paper:[19,18,17]};
const row=(h)=>{const c=hex(h);const o=oklch(c);return `${h} Y ${Y(c).toFixed(4)} L ${o[0].toFixed(3)} C ${o[1].toFixed(3)} h ${o[2].toFixed(1)} | light ${Object.values(G).map(g=>CR(c,g).toFixed(3)).join(' / ')} | dark ${Object.values(D).map(g=>CR(c,g).toFixed(3)).join(' / ')}`};
for(const h of ['#8b5cf6','#9b74f7','#7c3aed']) console.log(row(h));
// search: hue within 292-295, maximize min over light grounds
let best=[];
for(let r=100;r<200;r++)for(let g=60;g<140;g++)for(let b=220;b<256;b++){const c=[r,g,b];const o=oklch(c);if(o[2]<292||o[2]>295)continue;const w=Math.min(...Object.values(G).map(x=>CR(c,x)));best.push([w,c,o]);}
best.sort((a,b)=>b[0]-a[0]);
for(const [w,c] of best.slice(0,5)) console.log('best', row('#'+c.map(v=>v.toString(16).padStart(2,'0')).join('')), 'min', w.toFixed(3));
// max C among those with min>=3.15
const good=best.filter(x=>x[0]>=3.15).sort((a,b)=>b[2][1]-a[2][1]);
for(const [w,c] of good.slice(0,3)) console.log('chromaMax', row('#'+c.map(v=>v.toString(16).padStart(2,'0')).join('')),'min',w.toFixed(3));
// dark: max min over dark grounds any color
let bd=0,bc;for(let r=0;r<256;r+=3)for(let g=0;g<256;g+=3)for(let b=0;b<256;b+=3){const c=[r,g,b];const w=Math.min(...Object.values(D).map(x=>CR(c,x)));if(w>bd){bd=w;bc=c}}
console.log('dark best any colour, min over line/edge/paper', bd.toFixed(3), bc);
// PASS-6: the feasible Y band per floor on the light trio (line is the darker ground, edge the lighter).
for (const f of [3.0, 3.1]) { const lo = f * (Y(G.line) + 0.05) - 0.05, hi = (Y(G.edge) + 0.05) / f - 0.05; console.log(`light Y band for ${f}: [${lo.toFixed(4)}, ${hi.toFixed(4)}] ${lo <= hi ? 'FEASIBLE' : 'EMPTY'}`); }
for (const f of [3.0]) { const hi = (Y(D.line) + 0.05) / f - 0.05, lo = f * (Y(D.edge) + 0.05) - 0.05; console.log(`dark Y band for ${f}: need Y <= ${hi.toFixed(4)} (line) and Y >= ${lo.toFixed(4)} (edge) → ${lo <= hi ? 'FEASIBLE' : 'EMPTY'}`); }
