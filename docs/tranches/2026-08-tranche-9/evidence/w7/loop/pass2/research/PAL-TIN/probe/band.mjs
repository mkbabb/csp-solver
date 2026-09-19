#!/usr/bin/env node
/**
 * PAL-TIN pass 2 — THE BAND IS THE LEVER, NOT THE HUE (the dark arm's structural finding).
 *
 * Dark `--color-solver-ink-1..5` are five pale pastels at L 0.78–0.84 and the tin's dark arm
 * is five pale pastels at L 0.780. Ten inks, one band, one grid. Hue cannot separate them —
 * the sRGB chroma ceiling in the dark band runs 0.111–0.265, so the arc between two pastels
 * IS short in ΔE whatever the degrees say. Lightness can. Sweep the peer band and print what
 * each L buys, in ΔE and in AA, holding the tin's five hues.
 */
import { chromaAt, dE, paint, ratio, lOf, chromaOf, hueOf } from "./color.mjs";
import fs from "node:fs";
const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const dk = css.slice(css.indexOf("\n.dark"));
const CELLD = ["#60a5fa","#f9a8d4","#c4b5fd","#93c5fd","#6ee7b7","#fde68a","#ff5c7c","#6aabeb"];
console.log("dark CELL inks:", CELLD.map((h) => `${h} L${lOf(h).toFixed(3)} C${chromaOf(h).toFixed(3)} h${hueOf(h).toFixed(0)}`).join(" · "));
const GR = ["#110f0e","#131211"];
const HUES = [48.7, 124.7, 200.3, 276.2, 332.1];
console.log("\n| peer band L | worst ΔE to a cell ink | which stick | worst AA | min pairwise ΔE | hexes |");
console.log("|---|---|---|---|---|---|");
for (const L of [0.60, 0.65, 0.68, 0.70, 0.72, 0.75, 0.78, 0.82]) {
  const hexes = HUES.map((h) => paint(L, chromaAt(L, h), h).hex);
  let worst = 1e9, which = -1;
  hexes.forEach((x, i) => { for (const r of CELLD) { const e = dE(x, r); if (e < worst) { worst = e; which = i; } } });
  let pw = 1e9;
  for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) pw = Math.min(pw, dE(hexes[i], hexes[j]));
  const aa = Math.min(...hexes.flatMap((x) => GR.map((g) => ratio(x, g))));
  console.log(`| ${L.toFixed(2)} | **${worst.toFixed(3)}** | ${["amber","green","teal","violet","pink"][which]} | ${aa.toFixed(2)} | ${pw.toFixed(3)} | ${hexes.join(" ")} |`);
}
