/** (a) the exact per-hue in-gamut chroma ceiling at each band (bisection on the gamut test,
 *  not on a readback — the engine's own bisection went noisy at C->0);
 *  (b) what the peer cursor ring would need to clear 3:1 in light. */
import fs from "fs";
import { inGamut, oklchToSrgb255, contrast, buildWalk, ROOT } from "./arcWalk.mjs";
const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const w = buildWalk(css, "scaled", 12.25);
function hsl(h,s,l){s/=100;l/=100;const k=n=>(n+h/30)%12;const a=s*Math.min(l,1-l);const f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return [f(0),f(8),f(4)].map(v=>Math.round(v*255));}
const CARD_L = hsl(60,9.1,99.2), BG_L = hsl(48,15,98);
const ceil = (L,h)=>{let lo=0,hi=0.45;for(let k=0;k<40;k++){const m=(lo+hi)/2;if(inGamut(L,m,h))lo=m;else hi=m;}return lo;};
for (const [theme,L] of [["light",0.5],["dark",0.8]]) {
  const c = Array.from({length:144},(_,i)=>ceil(L,w.hueAt(i)));
  const c16 = c.slice(0,16);
  console.log(`${theme} L=${L}: per-hue in-gamut ceiling over the arc walk — min ${Math.min(...c).toFixed(4)} · mean ${(c.reduce((a,b)=>a+b,0)/144).toFixed(4)} · max ${Math.max(...c).toFixed(4)} · at/over 0.166: ${c.filter(x=>x>=0.166).length}/144 · at/over 0.110: ${c.filter(x=>x>=0.11).length}/144`);
  console.log(`   first 16: min ${Math.min(...c16).toFixed(4)} · mean ${(c16.reduce((a,b)=>a+b,0)/16).toFixed(4)}`);
  // contrast if every hue took its own ceiling capped at 0.166
  let worstBg=99,worstCard=99;
  for (let i=0;i<144;i++){const C=Math.min(0.166,c[i]);const px=oklchToSrgb255(L,C,w.hueAt(i));worstBg=Math.min(worstBg,contrast(px,theme==="light"?BG_L:hsl(24,8,6)));worstCard=Math.min(worstCard,contrast(px,theme==="light"?CARD_L:hsl(24,6,7)));}
  console.log(`   capped at min(0.166, ceiling): worst vs bg ${worstBg.toFixed(2)}:1 · vs card ${worstCard.toFixed(2)}:1`);
}
console.log("\n── THE RING (light, over --color-card) — what 3:1 costs ──");
for (const L of [0.5,0.45,0.40,0.35,0.30]) {
  for (const a of [0.55,0.7,0.85,1.0]) {
    let worst=99;
    for (let i=0;i<144;i++){const fg=oklchToSrgb255(L,0.11,w.hueAt(i));const b=fg.map((v,k)=>Math.round(a*v+(1-a)*CARD_L[k]));worst=Math.min(worst,contrast(b,CARD_L));}
    process.stdout.write(`  L=${L.toFixed(2)} a=${a.toFixed(2)} worst ${worst.toFixed(2)}:1 ${worst>=3?"PASS":"fail"}   `);
  }
  console.log("");
}
