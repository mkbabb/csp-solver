#!/usr/bin/env node
/** PAL-TIN pass 2 — the violet berth: chroma headroom, and the hue window the neighbours leave. */
import { chromaAt, dE, gap, hueOf, paint, ratio, oklab } from "./color.mjs";
const GR = { light: ["#fbfaf9","#fdfdfc"], dark: ["#110f0e","#131211"] };
const BAND = { light: 0.545, dark: 0.780 };
const N = { light: ["#2563eb","#7c3aed","#8b5cf6","#3a7bc4","#4a90d9"],
            dark:  ["#60a5fa","#c4b5fd","#7c3aed","#6aabeb"] };
const OTHER = { light: ["#008086","#a5439a"], dark: ["#00d0d9","#f48ce6"] };
const sc = (arm, L, C, h) => { const p = paint(L, C, h);
  let m = 1e9, who = -1; N[arm].forEach((r, i) => { const e = dE(p.hex, r); if (e < m) { m = e; who = i; } });
  let sib = 1e9; for (const r of OTHER[arm]) sib = Math.min(sib, dE(p.hex, r));
  return { hex: p.hex, de: m, who: N[arm][who], sib, aa: Math.min(...GR[arm].map((g) => ratio(p.hex, g))), C: Math.min(C, p.ceiling) }; };

console.log("## chroma headroom at the tin's own violet hue (L and h held)");
console.log("| arm | C | hex | ΔE to nearest blue/answer | which | ΔE to teal/pink | AA |");
console.log("|---|---|---|---|---|---|---|");
for (const arm of ["light","dark"]) {
  const h = arm === "light" ? 276.6 : 276.2;
  for (const C of [0.112, 0.140, 0.166, 0.19, 0.22, 0.255]) {
    const r = sc(arm, BAND[arm], C, h);
    console.log(`| ${arm} | ${C.toFixed(3)}${C > r.C + 1e-9 ? ` (clipped ${r.C.toFixed(3)})` : ""} | ${r.hex} | **${r.de.toFixed(3)}** | ${r.who} | ${r.sib.toFixed(3)} | ${r.aa.toFixed(2)} |`);
  }
}
console.log("\n## the hue window: violet must stay ≥40deg from teal 200.5 and pink 332.2");
console.log("| arm | h | ΔE nearest | which | AA |");
console.log("|---|---|---|---|---|");
let best = null;
for (let h = 245; h <= 292; h += 0.5) {
  const l = sc("light", BAND.light, 0.30, h), d = sc("dark", BAND.dark, 0.30, h);
  if (l.aa < 4.5 || d.aa < 4.5) continue;
  const s = Math.min(l.de, d.de);
  if (!best || s > best.s) best = { h, s, l, d };
}
console.log(`| light+dark | **${best.h}** | **${best.s.toFixed(3)}** | l ${best.l.who} ${best.l.de.toFixed(3)} / d ${best.d.who} ${best.d.de.toFixed(3)} | ${best.l.aa.toFixed(2)}/${best.d.aa.toFixed(2)} |`);
console.log(`- at the gamut's own chroma: light ${best.l.hex} (C ${best.l.C.toFixed(3)}) · dark ${best.d.hex} (C ${best.d.C.toFixed(3)})`);
