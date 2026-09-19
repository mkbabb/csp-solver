#!/usr/bin/env node
import { chromaAt, dE, paint, ratio, lOf, chromaOf, hueOf } from "./color.mjs";
const CELLL = ["#2563eb","#c2286e","#7c3aed","#2059c8","#047857","#92600a","#e8315b","#3a7bc4","#4a90d9"];
console.log("light CELL inks:", CELLL.map((h) => `${h} L${lOf(h).toFixed(3)} C${chromaOf(h).toFixed(3)} h${hueOf(h).toFixed(0)}`).join(" · "));
const GR = ["#fbfaf9","#fdfdfc"];
const HUES = [48.4, 124.6, 200.6, 276.6, 332.2];
console.log("\n| peer band L | worst ΔE | which | worst AA | min pairwise | hexes |");
console.log("|---|---|---|---|---|---|");
for (const L of [0.40,0.44,0.47,0.50,0.52,0.545,0.58,0.62,0.66]) {
  const hexes = HUES.map((h) => paint(L, chromaAt(L, h), h).hex);
  let worst = 1e9, which = -1;
  hexes.forEach((x, i) => { for (const r of CELLL) { const e = dE(x, r); if (e < worst) { worst = e; which = i; } } });
  let pw = 1e9; for (let i=0;i<5;i++) for (let j=i+1;j<5;j++) pw = Math.min(pw, dE(hexes[i], hexes[j]));
  const aa = Math.min(...hexes.flatMap((x) => GR.map((g) => ratio(x, g))));
  console.log(`| ${L.toFixed(3)} | **${worst.toFixed(3)}** | ${["amber","green","teal","violet","pink"][which]} | ${aa.toFixed(2)} | ${pw.toFixed(3)} | ${hexes.join(" ")} |`);
}
