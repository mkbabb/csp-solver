// THE SPEC'S TOKEN TABLE. Rule: hue as pass 1 cut it; L = 0.44 light / 0.65 dark; chroma =
// min(0.215, chromaAt(L,h)) — 0.215 is --color-user-ink's own chroma, so no stick is louder
// than the ink it replaces. Prints ΔE to the CELL set, pairwise, AA on both grounds, the
// join-ring hazard row (progress-ink) and the 0.80 ring over its own 4% fill (1.4.11).
import { chromaAt, dE, paint, ratio } from "./color.mjs";
const CAP = 0.215;
const ARMS = {
  light: { L: 0.44, hues: [48.4,124.6,200.6,276.6,332.2], gr: ["#fbfaf9","#fdfdfc"],
    cell: {"user-ink":"#2563eb","solver-1":"#c2286e","solver-2":"#7c3aed","solver-3":"#2059c8","solver-4":"#047857","solver-5":"#92600a","teacher-red":"#e8315b","focus":"#3a7bc4","crayon-blue":"#4a90d9"},
    progress: "#8b5cf6", card: "#fdfdfc" },
  dark: { L: 0.65, hues: [48.7,124.7,200.3,276.2,332.1], gr: ["#110f0e","#131211"],
    cell: {"user-ink":"#60a5fa","solver-1":"#f9a8d4","solver-2":"#c4b5fd","solver-3":"#93c5fd","solver-4":"#6ee7b7","solver-5":"#fde68a","teacher-red":"#ff5c7c","focus":"#3a7bc4","crayon-blue":"#6aabeb"},
    progress: "#7c3aed", card: "#131211" },
};
const NAMES = ["amber","green","teal","violet","pink"];
const rgb = (h) => [1,3,5].map((i) => parseInt(h.slice(i,i+2),16));
const hex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2,"0")).join("");
const mix = (a, b, t) => hex(rgb(a).map((x,i) => x*t + rgb(b)[i]*(1-t)));
for (const [arm, A] of Object.entries(ARMS)) {
  const hx = A.hues.map((h) => paint(A.L, Math.min(CAP, chromaAt(A.L, h)), h).hex);
  console.log(`\n## ${arm} L ${A.L}`);
  let pw = 1e9, pwp = ""; for (let i=0;i<5;i++) for (let j=i+1;j<5;j++) { const d = dE(hx[i],hx[j]); if (d<pw){pw=d;pwp=`${NAMES[i]}/${NAMES[j]}`;} }
  hx.forEach((x, i) => {
    const ds = Object.entries(A.cell).map(([n,c]) => [n, dE(x,c)]).sort((p,q)=>p[1]-q[1]);
    const C = Math.min(CAP, chromaAt(A.L, A.hues[i]));
    const ground = mix(x, A.card, 0.04);            // the ring's own 4% fill over card
    const ring = mix(x, ground, 0.80);              // the 0.80 stroke over that
    console.log(`${NAMES[i].padEnd(6)} ${x}  h ${A.hues[i]}  C ${C.toFixed(3)}${C<chromaAt(A.L,A.hues[i])-1e-6?"":" (=ceiling)"}  ΔE(cell) ${ds[0][1].toFixed(3)} ${ds[0][0]} · next ${ds[1][1].toFixed(3)} ${ds[1][0]}  AA bg ${ratio(x,A.gr[0]).toFixed(2)} card ${ratio(x,A.gr[1]).toFixed(2)}  progress-ink ΔE ${dE(x,A.progress).toFixed(3)}  ring@0.80 vs own fill ${ratio(ring, ground).toFixed(2)}`);
  });
  console.log(`min pairwise ΔE ${pw.toFixed(3)} (${pwp}) · worst AA ${Math.min(...hx.flatMap(x=>A.gr.map(g=>ratio(x,g)))).toFixed(2)} · worst ΔE(cell) ${Math.min(...hx.map(x=>Math.min(...Object.values(A.cell).map(c=>dE(x,c))))).toFixed(3)}`);
}
