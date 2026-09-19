// The light violet is the only contested berth: sweep ITS chroma at three candidate bands and
// read ΔE to the nearest cell ink, to its tin neighbours, and AA. Everything else stays capped.
import { chromaAt, dE, paint, ratio } from "./color.mjs";
const CELLL = ["#2563eb","#c2286e","#7c3aed","#2059c8","#047857","#92600a","#e8315b","#3a7bc4","#4a90d9"];
const NAMEL = ["user-ink","solver-1","solver-2","solver-3","solver-4","solver-5","teacher-red","focus","crayon-blue"];
const GL = ["#fbfaf9","#fdfdfc"];
for (const L of [0.44, 0.45, 0.46]) {
  const teal = paint(L, Math.min(0.166, chromaAt(L, 200.6)), 200.6).hex;
  const pink = paint(L, Math.min(0.166, chromaAt(L, 332.2)), 332.2).hex;
  for (const C of [0.166, 0.18, 0.20, 0.215, 0.23, 0.25, chromaAt(L, 276.6)]) {
    const v = paint(L, C, 276.6).hex;
    const d = CELLL.map((c) => dE(v, c)); const m = Math.min(...d);
    console.log(`L ${L} C ${C.toFixed(3)} ${v}  ΔE(cell) ${m.toFixed(3)} (${NAMEL[d.indexOf(m)]})  vs teal ${dE(v,teal).toFixed(3)} vs pink ${dE(v,pink).toFixed(3)}  AA ${Math.min(...GL.map(g=>ratio(v,g))).toFixed(2)}`);
  }
}
