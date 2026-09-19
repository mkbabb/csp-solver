// PAL-TIN pass-2 SYNTHESIS probe: the band move at the tin's OWN chroma cap (0.166), not the
// gamut ceiling the research sweep used. Same five hues as pass 1. Prints the candidate tokens.
import { chromaAt, dE, paint, ratio } from "./color.mjs";
const CELLL = ["#2563eb","#c2286e","#7c3aed","#2059c8","#047857","#92600a","#e8315b","#3a7bc4","#4a90d9"];
const CELLD = ["#60a5fa","#f9a8d4","#c4b5fd","#93c5fd","#6ee7b7","#fde68a","#ff5c7c","#6aabeb","#3a7bc4"];
const GL = ["#fbfaf9","#fdfdfc"], GD = ["#110f0e","#131211"];
const HL = [48.4,124.6,200.6,276.6,332.2], HD = [48.7,124.7,200.3,276.2,332.1];
const CAP = 0.166;
const NAMES = ["amber","green","teal","violet","pink"];
function row(L, hues, cell, gr, arm) {
  const hex = hues.map((h) => paint(L, Math.min(CAP, chromaAt(L, h)), h).hex);
  const near = hex.map((x) => Math.min(...cell.map((c) => dE(x, c))));
  let pw = 1e9; for (let i=0;i<5;i++) for (let j=i+1;j<5;j++) pw = Math.min(pw, dE(hex[i],hex[j]));
  const aa = hex.map((x) => Math.min(...gr.map((g) => ratio(x, g))));
  console.log(`${arm} L ${L.toFixed(3)} · worst ΔE(cell) ${Math.min(...near).toFixed(3)} (${NAMES[near.indexOf(Math.min(...near))]}) · min pairwise ${pw.toFixed(3)} · worst AA ${Math.min(...aa).toFixed(2)}`);
  hex.forEach((x,i)=>console.log(`   ${NAMES[i].padEnd(6)} ${x}  C ${Math.min(CAP, chromaAt(L, hues[i])).toFixed(3)} (ceiling ${chromaAt(L,hues[i]).toFixed(3)})  ΔE(cell) ${near[i].toFixed(3)}  AA ${aa[i].toFixed(2)}`));
}
for (const L of [0.545, 0.50, 0.47, 0.46, 0.45, 0.44, 0.43]) row(L, HL, CELLL, GL, "light");
for (const L of [0.78, 0.70, 0.68, 0.66, 0.65, 0.64, 0.63]) row(L, HD, CELLD, GD, "dark");
