// PAL-WALK pass-2 SYNTHESIS probe: does PAL-TIN's band lever move the WALK's numbers? The arc
// walk is re-built from pass 1's own constants (guard 13, six reserved arcs from index.css at
// HEAD, STEP = OPEN/φ²) and each hand is painted at C = min(cap, chromaAt(L_light,h),
// chromaAt(L_dark,h)) — pass 1's one-string rule — at pass 1's bands and at the moved bands.
// Arithmetic only (OKLab, sRGB round trip); the prototype paints it.
import { chromaAt, dE, paint, ratio } from "./color.mjs";
const OPEN = [[27.1616,51.1659],[108.7459,133.985],[178.6121,236.3332],[275.8809,279.7172],[306.5712,333.0]];
const SPAN = OPEN.reduce((s,[a,b]) => s + (b-a), 0);
const STEP = SPAN * ((3 - Math.sqrt(5)) / 2);
const hueAt = (t) => { for (const [a,b] of OPEN) { if (t < b-a) return a + t; t -= (b-a); } return OPEN[0][0]; };
const hue = (i) => hueAt((i * STEP) % SPAN);
const LIGHT = { "crayon-rose":"#e8315b","red-ink":"#d02a52","orange-ink":"#a26009","crayon-orange":"#f4a236","solver-5":"#92600a","gold-ink":"#8c691d","crayon-gold":"#c99a2e","crayon-green":"#2dc653","green-ink":"#1d7f35","solver-4":"#047857","crayon-blue":"#4a90d9","focus":"#3a7bc4","solver-3":"#2059c8","user-ink":"#2563eb","progress":"#8b5cf6","solver-2":"#7c3aed","solver-1":"#c2286e" };
const DARK = { "crayon-rose":"#ff5c7c","crayon-orange":"#f5b35c","crayon-gold":"#e5c74d","solver-5":"#fde68a","crayon-green":"#3dd968","solver-4":"#6ee7b7","crayon-blue":"#6aabeb","solver-3":"#93c5fd","user-ink":"#60a5fa","progress":"#7c3aed","solver-2":"#c4b5fd","solver-1":"#f9a8d4","focus":"#3a7bc4" };
const GL = ["#fbfaf9","#fdfdfc"], GD = ["#110f0e","#131211"];
const REF = 0.0764; // the house's two nearest light crayons
function run(label, Ll, Ld, cap) {
  console.log(`\n## ${label}: L ${Ll} / ${Ld}, cap ${cap}`);
  const N = 144;
  const hands = Array.from({length:N}, (_, i) => { const h = hue(i); const C = Math.min(cap, chromaAt(Ll,h), chromaAt(Ld,h)); return { i, h, C, l: paint(Ll,C,h).hex, d: paint(Ld,C,h).hex }; });
  for (const [arm, key, TOK, GR] of [["light","l",LIGHT,GL],["dark","d",DARK,GD]]) {
    const near = hands.map((x) => { const e = Object.entries(TOK).map(([n,c]) => [n, dE(x[key], c)]).sort((p,q)=>p[1]-q[1])[0]; return { i:x.i, n:e[0], d:e[1] }; });
    const under = near.filter((r) => r.d < REF).length;
    const worst8 = near.slice(0,8).sort((p,q)=>p.d-q.d)[0];
    const worst = near.slice().sort((p,q)=>p.d-q.d)[0];
    const aa = Math.min(...hands.flatMap((x) => GR.map((g) => ratio(x[key], g))));
    const pp = (n) => { let m = 1e9; for (let a=0;a<n;a++) for (let b=a+1;b<n;b++) m = Math.min(m, dE(hands[a][key], hands[b][key])); return m; };
    const meanC = hands.reduce((s,x)=>s+x.C,0)/N;
    console.log(`${arm}: hands closer to a token than ${REF}: ${under}/144 · worst of first 8: i=${worst8.i} ΔE ${worst8.d.toFixed(4)} (${worst8.n}) · worst of 144: i=${worst.i} ${worst.d.toFixed(4)} (${worst.n}) · peer-vs-peer N=3 ${pp(3).toFixed(4)} N=4 ${pp(4).toFixed(4)} N=8 ${pp(8).toFixed(4)} N=16 ${pp(16).toFixed(4)} · worst AA ${aa.toFixed(2)} · mean C ${meanC.toFixed(4)}`);
  }
  console.log(`first six: ${hands.slice(0,6).map(x=>`${x.h.toFixed(1)}° ${x.l}/${x.d}`).join("  ")}`);
}
console.log(`OPEN span ${SPAN.toFixed(2)}° STEP ${STEP.toFixed(2)}°`);
run("pass 1", 0.50, 0.80, 0.166);
run("moved bands", 0.44, 0.65, 0.166);
run("moved bands, cap 0.215", 0.44, 0.65, 0.215);
run("light only moved", 0.44, 0.80, 0.166);
run("dark only moved", 0.50, 0.65, 0.166);
