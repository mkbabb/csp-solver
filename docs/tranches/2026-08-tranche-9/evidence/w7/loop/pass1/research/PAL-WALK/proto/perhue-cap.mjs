/** The per-hue chroma cap applied to the FULL-CIRCLE shipped walk — the half of this family
 *  that survives even if the arcs do not. */
import { inGamut, oklchToSrgb255, contrast, gap } from "./arcWalk.mjs";
function hsl(h,s,l){s/=100;l/=100;const k=n=>(n+h/30)%12;const a=s*Math.min(l,1-l);const f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return [f(0),f(8),f(4)].map(v=>Math.round(v*255));}
const G = { "light/bg":[hsl(48,15,98),0.5], "light/card":[hsl(60,9.1,99.2),0.5], "dark/bg":[hsl(24,8,6),0.8], "dark/card":[hsl(24,6,7),0.8] };
const ceil=(L,h)=>{let lo=0,hi=0.45;for(let k=0;k<40;k++){const m=(lo+hi)/2;if(inGamut(L,m,h))lo=m;else hi=m;}return lo;};
const hue=i=>(i*137.5)%360;
for (const mode of ["shipped C=0.110 flat", "capped min(0.166, per-hue ceiling)"]) {
  console.log(`\n── ${mode} ──`);
  for (const [name,[rgb,L]] of Object.entries(G)) {
    let worst=99, ring=99, cs=[];
    for (let i=0;i<144;i++){
      const C = mode.startsWith("shipped") ? 0.11 : Math.min(0.166, ceil(L,hue(i)));
      cs.push(C);
      const px=oklchToSrgb255(L,C,hue(i));
      worst=Math.min(worst,contrast(px,rgb));
      const b=px.map((v,k)=>Math.round(0.55*v+0.45*rgb[k]));
      ring=Math.min(ring,contrast(b,rgb));
    }
    console.log(`  ${name.padEnd(11)} worst opaque ${worst.toFixed(2)}:1 · ring@0.55 ${ring.toFixed(2)}:1 · chroma min ${Math.min(...cs).toFixed(4)} mean ${(cs.reduce((a,b)=>a+b,0)/144).toFixed(4)}`);
  }
}
