#!/usr/bin/env node
/** PAL-TIN pass 2 — the violet berth, the only contested one, under HEAD / ACC-FIVE / ACC-SIX. */
import { chromaAt, dE, gap, hueOf, paint, ratio } from "./color.mjs";
const GR = { light: ["#fbfaf9","#fdfdfc"], dark: ["#110f0e","#131211"] };
const BAND = { light: 0.545, dark: 0.780 };
const NEIGH = {
  HEAD:      { light: ["#2563eb","#7c3aed","#8b5cf6","#3a7bc4"], dark: ["#60a5fa","#c4b5fd","#7c3aed","#6aabeb"] },
  "ACC-FIVE":{ light: ["#026fc4","#7c3aed","#8b5cf6"],           dark: ["#47a7ff","#c4b5fd","#7c3aed"] },
  "ACC-SIX": { light: ["#2f76bd","#7c3aed","#8b5cf6"],           dark: ["#47a7ff","#c4b5fd","#8b5cf6"] },
};
console.log("| world | best violet hue | score (min ΔE, worse arm) | light hex | dark hex | AA l/d | tin's 276.4 scores |");
console.log("|---|---|---|---|---|---|---|");
for (const [w, n] of Object.entries(NEIGH)) {
  const at = (arm, h) => { const p = paint(BAND[arm], chromaAt(BAND[arm], h), h);
    let m = 1e9; for (const r of n[arm]) m = Math.min(m, dE(p.hex, r));
    return { hex: p.hex, de: m, aa: Math.min(...GR[arm].map((g) => ratio(p.hex, g))) }; };
  let best = null;
  for (let h = 240; h <= 320; h += 0.25) { const l = at("light", h), d = at("dark", h);
    if (l.aa < 4.5 || d.aa < 4.5) continue;
    const s = Math.min(l.de, d.de); if (!best || s > best.s) best = { h, s, l, d }; }
  const cl = at("light", 276.6), cd = at("dark", 276.2);
  console.log(`| ${w} | **${best.h}** | **${best.s.toFixed(3)}** | ${best.l.hex} | ${best.d.hex} | ${best.l.aa.toFixed(2)}/${best.d.aa.toFixed(2)} | light ${cl.de.toFixed(3)} · dark ${cd.de.toFixed(3)} |`);
}
