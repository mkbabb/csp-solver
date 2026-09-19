#!/usr/bin/env node
/**
 * PAL-TIN pass 2 — EACH BERTH, SWEPT. The tin's five sticks sit in five arcs the reserved
 * inks leave. For each arc, hold the band (light 0.545 / dark 0.780) and the gamut's own
 * chroma, sweep the hue across the arc, and print min(ΔE light, ΔE dark) against the CELL
 * set. The best hue in each arc is what the tin could hold without moving its lightness,
 * its chroma, its count or its idea — which is the only re-cut pass 2 can afford.
 */
import fs from "node:fs";
import { chromaAt, dE, gap, hueOf, paint, ratio } from "./color.mjs";
const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const darkAt = css.indexOf("\n.dark");
const BLOCK = { light: css.slice(0, darkAt), dark: css.slice(darkAt) };
const CELLN = ["user-ink", "focus-sketch", "teacher-red", "crayon-blue", "crayon-rose",
  "solver-ink-1", "solver-ink-2", "solver-ink-3", "solver-ink-4", "solver-ink-5"];
const hslToHex = (h, s, l) => { s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const t = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return "#" + t.map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join(""); };
const rawOf = (b, n) => { const m = new RegExp(`--color-${n}:\\s*([^;]+);`).exec(b); return m ? m[1].replace(/\s+/g, " ").trim() : null; };
function res(b, fb, n, d = 0) { let r = rawOf(b, n); if (r === null && fb) r = rawOf(fb, n); if (r === null || d > 4) return null;
  let m = /^#([0-9a-fA-F]{6})$/.exec(r); if (m) return `#${m[1].toLowerCase()}`;
  m = /^hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)$/.exec(r); if (m) return hslToHex(+m[1], +m[2], +m[3]);
  m = /^var\(\s*--color-([a-z0-9-]+)\s*\)$/.exec(r); if (m) return res(b, fb, m[1], d + 1); return null; }
const SET = { light: [], dark: [] };
for (const n of CELLN) { const l = res(BLOCK.light, null, n); if (l) SET.light.push({ n, hex: l });
  const d = res(BLOCK.dark, BLOCK.light, n); if (d) SET.dark.push({ n, hex: d }); }
const G = { light: [res(BLOCK.light, null, "background"), res(BLOCK.light, null, "card")],
            dark: [res(BLOCK.dark, BLOCK.light, "background"), res(BLOCK.dark, BLOCK.light, "card")] };
const BAND = { light: 0.545, dark: 0.780 };
const at = (a, h) => { const p = paint(BAND[a], chromaAt(BAND[a], h), h);
  let m = 1e9, who = null; for (const r of SET[a]) { const e = dE(p.hex, r.hex); if (e < m) { m = e; who = r.n; } }
  return { hex: p.hex, de: m, who, aa: Math.min(...G[a].map((g) => ratio(p.hex, g))), C: p.ceiling }; };

const BERTH = [
  { name: "amber", now: 48.4, lo: 25, hi: 75 },
  { name: "green", now: 124.6, lo: 100, hi: 165 },
  { name: "teal", now: 200.6, lo: 175, hi: 225 },
  { name: "violet", now: 276.6, lo: 250, hi: 310 },
  { name: "pink", now: 332.2, lo: 315, hi: 360 },
];
const out = []; const say = (s = "") => { out.push(s); console.log(s); };
say("# PAL-TIN pass 2 — each berth swept, band and chroma held");
say("`score` = min(ΔE light, ΔE dark) against the CELL set; AA must clear 4.5 in both arms.");
say();
say("| berth | hue now | score now | best hue in arc | score there | light hex | dark hex | nearest light | nearest dark | AA l/d | Δhue |");
say("|---|---|---|---|---|---|---|---|---|---|---|");
const chosen = [];
for (const b of BERTH) {
  const nl = at("light", b.now), nd = at("dark", b.now);
  let best = null;
  for (let h = b.lo; h <= b.hi; h += 0.25) {
    const l = at("light", h), d = at("dark", h);
    if (l.aa < 4.5 || d.aa < 4.5) continue;
    const s = Math.min(l.de, d.de);
    if (!best || s > best.s) best = { h, s, l, d };
  }
  chosen.push(best);
  say(`| ${b.name} | ${b.now} | **${Math.min(nl.de, nd.de).toFixed(3)}** | **${best.h}** | **${best.s.toFixed(3)}** | ${best.l.hex} | ${best.d.hex} | ${best.l.who} ${best.l.de.toFixed(3)} | ${best.d.who} ${best.d.de.toFixed(3)} | ${best.l.aa.toFixed(2)}/${best.d.aa.toFixed(2)} | ${(best.h - b.now).toFixed(1)} |`);
}
say();
const hs = chosen.map((c) => c.h);
let sp = 1e9; for (let i = 0; i < 5; i++) sp = Math.min(sp, gap(hs[i], hs[(i + 1) % 5]));
let wp = 1e9;
for (const a of ["light", "dark"]) for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++)
  wp = Math.min(wp, dE(a === "light" ? chosen[i].l.hex : chosen[i].d.hex, a === "light" ? chosen[j].l.hex : chosen[j].d.hex));
say(`- the re-cut tin: hues ${hs.join(" / ")} · min adjacent spread ${sp.toFixed(1)}deg · min pairwise ΔE (worse arm) **${wp.toFixed(3)}** · gate-1 floor **ΔE ${Math.min(...chosen.map((c) => c.s)).toFixed(3)}**`);
say(`- light: ${chosen.map((c) => c.l.hex).join(" ")}`);
say(`- dark:  ${chosen.map((c) => c.d.hex).join(" ")}`);
say(`- pass-1 tin's own gate-1 floor on this ruler: **ΔE 0.046** (dark violet vs --color-solver-ink-2)`);
fs.writeFileSync(new URL("../out/berths.md", import.meta.url), out.join("\n") + "\n");
