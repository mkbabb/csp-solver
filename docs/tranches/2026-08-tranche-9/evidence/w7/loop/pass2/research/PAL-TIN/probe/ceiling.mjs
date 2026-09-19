#!/usr/bin/env node
/**
 * PAL-TIN pass 2 — THE CEILING ON GATE 1'S FLOOR.
 *
 * Two questions the pass-1 gate never asked:
 *  1. At the tin's own lightness band, what chroma can sRGB actually hold, hue by hue? (So
 *     "raise the teal's chroma until it clears solver-ink-4" can be priced, or refused.)
 *  2. Over the WHOLE circle at that band and at the gamut's own chroma, what is the largest
 *     ΔE any stick could possibly hold from the nearest reserved ink? That number is the
 *     ceiling on the floor gate 1 can assert in ΔE, and nothing this family designs can beat it.
 */
import fs from "node:fs";
import { chromaAt, dE, gap, hueOf, oklab, paint } from "./color.mjs";

const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const darkAt = css.indexOf("\n.dark");
const BLOCK = { light: css.slice(0, darkAt), dark: css.slice(darkAt) };

const NAMES = ["user-ink", "focus-sketch", "progress-ink", "teacher-red", "gold-star",
  "crayon-green", "crayon-orange", "crayon-rose", "crayon-blue", "crayon-gold",
  "green-ink", "orange-ink", "red-ink", "gold-ink",
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

const RES = { light: [], dark: [] };
for (const n of NAMES) {
  const l = res(BLOCK.light, null, n); if (l) RES.light.push({ n, hex: l, lab: oklab(l) });
  const d = res(BLOCK.dark, BLOCK.light, n); if (d) RES.dark.push({ n, hex: d, lab: oklab(d) });
}
// PAL-TIN's own five, for the marker rows
const TIN = { light: ["#b24f00", "#5f7d00", "#008086", "#5a61ce", "#a5439a"],
              dark: ["#ff9a62", "#a0c942", "#00d0d9", "#a4b1ff", "#f48ce6"] };

const out = [];
const say = (s = "") => { out.push(s); console.log(s); };
say("# PAL-TIN pass 2 — the sRGB ceiling and the ΔE ceiling, hue by hue");
say();

for (const [arm, L] of [["light", 0.545], ["dark", 0.780]]) {
  const rows = [];
  for (let h = 0; h < 360; h += 0.5) {
    const C = chromaAt(L, h);
    const p = paint(L, C, h);
    let best = 1e9, who = null, bestDeg = 1e9;
    for (const r of RES[arm]) {
      const e = dE(p.hex, r.hex); if (e < best) { best = e; who = r.n; }
      const d = gap(hueOf(p.hex), hueOf(r.hex)); if (d < bestDeg) bestDeg = d;
    }
    rows.push({ h, C: +C.toFixed(4), hex: p.hex, minDE: +best.toFixed(4), who, minDeg: +bestDeg.toFixed(2) });
  }
  fs.writeFileSync(new URL(`../out/ceiling-${arm}.json`, import.meta.url), JSON.stringify(rows, null, 0));
  const top = [...rows].sort((a, b) => b.minDE - a.minDE)[0];
  const cmin = [...rows].sort((a, b) => a.C - b.C)[0];
  say(`## ${arm} (L ${L})`);
  say(`- sRGB chroma ceiling: min **${cmin.C.toFixed(3)} at h ${cmin.h}** · max ${Math.max(...rows.map((r) => r.C)).toFixed(3)} at h ${rows.find((r) => r.C === Math.max(...rows.map((x) => x.C))).h}`);
  say(`- the best any hue can do against the reserved set, at the gamut's own chroma: **ΔE ${top.minDE.toFixed(3)} at h ${top.h}** (nearest --color-${top.who})`);
  say(`- hues where even the gamut's own chroma cannot reach ΔE 0.10 of every reserved ink: **${rows.filter((r) => r.minDE < 0.10).length}/${rows.length}** of the circle`);
  say(`- ΔE 0.08: ${rows.filter((r) => r.minDE < 0.08).length}/${rows.length} · ΔE 0.06: ${rows.filter((r) => r.minDE < 0.06).length}/${rows.length} · ΔE 0.04: ${rows.filter((r) => r.minDE < 0.04).length}/${rows.length}`);
  say("");
  say("| the tin's stick | h | C held | sRGB ceiling here | best ΔE reachable at this hue | ΔE it holds |");
  say("|---|---|---|---|---|---|");
  for (const hex of TIN[arm]) {
    const h = hueOf(hex);
    const row = rows.reduce((a, b) => (Math.abs(b.h - h) < Math.abs(a.h - h) ? b : a));
    let held = 1e9; for (const r of RES[arm]) held = Math.min(held, dE(hex, r.hex));
    const [, A, B] = oklab(hex);
    say(`| ${hex} | ${h.toFixed(1)} | ${Math.hypot(A, B).toFixed(3)} | **${row.C.toFixed(3)}** | ${row.minDE.toFixed(3)} | ${held.toFixed(3)} |`);
  }
  say("");
  // the five widest gaps in the circle — where a five-stick tin WANTS to sit
  const wide = [...rows].sort((a, b) => b.minDE - a.minDE).slice(0, 80);
  const picked = [];
  for (const r of wide) { if (picked.every((p) => gap(p.h, r.h) > 40)) picked.push(r); if (picked.length === 6) break; }
  say(`- the circle's six widest berths at this band (≥40deg apart): ${picked.map((p) => `h ${p.h} ΔE ${p.minDE.toFixed(3)}`).join(" · ")}`);
  say("");
}
fs.writeFileSync(new URL("../out/ceiling.md", import.meta.url), out.join("\n") + "\n");
