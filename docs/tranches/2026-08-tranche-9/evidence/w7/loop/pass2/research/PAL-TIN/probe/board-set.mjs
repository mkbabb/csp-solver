#!/usr/bin/env node
/**
 * PAL-TIN pass 2 — THE SET GATE 1 SHOULD ACTUALLY MEASURE AGAINST.
 *
 * The pass-1 gate puts every stick against 29 reserved-ink DECLARATIONS regardless of whether
 * that ink can ever be on screen beside a player's digit. Three sets, measured:
 *
 *   ALL    — every chromatic token in `index.css` (what pass 1 measured against)
 *   BOARD  — the inks that paint ON or AROUND the grid (grepped; the citations are in
 *            `out/board-surface.md`)
 *   CELL   — the inks that can paint INSIDE a cell box, i.e. what a reader's eye holds at
 *            one saccade with a player's digit
 *
 * For each set: what the tin holds, and the CEILING (the best any hue could hold at that
 * lightness band at the sRGB gamut's own chroma). A floor above the ceiling is not a gate.
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
/** grepped, `out/board-surface.md`: paints inside a CELL box beside a player's digit. */
const CELL = new Set(["user-ink", "solver-ink-1", "solver-ink-2", "solver-ink-3",
  "solver-ink-4", "solver-ink-5", "teacher-red", "focus-sketch", "crayon-blue"]);
/** CELL plus what paints on the grid frame the same eye holds. */
const BOARD = new Set([...CELL, "progress-ink", "crayon-rose"]);

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
  const l = res(BLOCK.light, null, n); if (l) RES.light.push({ n, hex: l });
  const d = res(BLOCK.dark, BLOCK.light, n); if (d) RES.dark.push({ n, hex: d });
}
const TIN = { light: ["#b24f00", "#5f7d00", "#008086", "#5a61ce", "#a5439a"],
              dark: ["#ff9a62", "#a0c942", "#00d0d9", "#a4b1ff", "#f48ce6"] };
const SETS = { ALL: () => true, BOARD: (n) => BOARD.has(n), CELL: (n) => CELL.has(n) };

const out = [];
const say = (s = "") => { out.push(s); console.log(s); };
say("# PAL-TIN pass 2 — three reserved sets, the tin's holding and the paper's ceiling");
say();
for (const [arm, L] of [["light", 0.545], ["dark", 0.780]]) {
  say(`## ${arm} (band L ${L})`);
  say("| set | members | tin worst ΔE | which stick | tin worst deg | CEILING ΔE (best hue on the circle) | at h | circle under ΔE 0.10 |");
  say("|---|---|---|---|---|---|---|---|");
  for (const [sname, pick] of Object.entries(SETS)) {
    const set = RES[arm].filter((r) => pick(r.n));
    let worst = 1e9, who = "", wdeg = 1e9;
    for (const hex of TIN[arm]) for (const r of set) {
      const e = dE(hex, r.hex); if (e < worst) { worst = e; who = `${hex} vs --color-${r.n}`; }
      wdeg = Math.min(wdeg, gap(hueOf(hex), hueOf(r.hex)));
    }
    let ceil = 0, ceilH = 0, under = 0, n = 0;
    for (let h = 0; h < 360; h += 0.5) {
      const p = paint(L, chromaAt(L, h), h);
      let best = 1e9; for (const r of set) best = Math.min(best, dE(p.hex, r.hex));
      if (best > ceil) { ceil = best; ceilH = h; }
      if (best < 0.10) under++; n++;
    }
    say(`| ${sname} | ${set.length} | **${worst.toFixed(3)}** | ${who} | ${wdeg.toFixed(2)} | **${ceil.toFixed(3)}** | ${ceilH} | ${under}/${n} |`);
  }
  say();
  // Five-stick packing: the largest min-ΔE-to-set achievable by ANY five hues >=40deg apart
  for (const [sname, pick] of Object.entries(SETS)) {
    const set = RES[arm].filter((r) => pick(r.n));
    const rows = [];
    for (let h = 0; h < 360; h += 0.5) {
      const p = paint(L, chromaAt(L, h), h);
      let best = 1e9; for (const r of set) best = Math.min(best, dE(p.hex, r.hex));
      rows.push({ h, minDE: best, hex: p.hex });
    }
    // greedy: take the widest berths, keep >=40deg apart, until five
    const picked = [];
    for (const r of [...rows].sort((a, b) => b.minDE - a.minDE)) {
      if (picked.every((p) => gap(p.h, r.h) >= 40)) picked.push(r);
      if (picked.length === 5) break;
    }
    const floor = picked.length === 5 ? Math.min(...picked.map((p) => p.minDE)) : null;
    say(`- ${sname}: the best FIVE berths ≥40deg apart hold min ΔE **${floor === null ? "n/a (fewer than five)" : floor.toFixed(3)}** — ${picked.map((p) => `h ${p.h}/${p.minDE.toFixed(3)}`).join(" · ")}`);
  }
  say();
}
fs.writeFileSync(new URL("../out/board-set.md", import.meta.url), out.join("\n") + "\n");
