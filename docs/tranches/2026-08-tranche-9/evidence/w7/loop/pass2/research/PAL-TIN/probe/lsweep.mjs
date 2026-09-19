#!/usr/bin/env node
/**
 * PAL-TIN pass 2 — THE ONE FREE AXIS. Three of the five light sticks and three of the five
 * dark ones sit ON the sRGB chroma ceiling at their (L, h): chroma is spent. Hue is spent too
 * (the five berths are what the reserved arcs leave). So the only axis left for a stick that
 * reads too close to a reserved ink is LIGHTNESS — and lightness is what AA is made of.
 *
 * Per stick, per arm: sweep L, hold the hue, take the gamut's own chroma, and print the
 * min ΔE to the CELL set and the worst AA. The band the synthesizer can spend is the
 * intersection: ΔE up, AA ≥ 4.5.
 */
import fs from "node:fs";
import { chromaAt, dE, hueOf, paint, ratio } from "./color.mjs";

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
const TIN = { light: ["#b24f00", "#5f7d00", "#008086", "#5a61ce", "#a5439a"],
              dark: ["#ff9a62", "#a0c942", "#00d0d9", "#a4b1ff", "#f48ce6"] };
const out = [];
const say = (s = "") => { out.push(s); console.log(s); };
say("# PAL-TIN pass 2 — lightness is the only axis left (chroma and hue are spent)");
say(`CELL set: ${SET.light.map((r) => r.n).join(", ")}`);
say();
say("| arm | stick | h | L now | ΔE now | AA now | best L with AA≥4.5 | ΔE there | AA there | hex there | gain |");
say("|---|---|---|---|---|---|---|---|---|---|---|");
for (const a of ["light", "dark"]) for (const [k, hex] of TIN[a].entries()) {
  const h = hueOf(hex);
  const score = (L) => { const p = paint(L, chromaAt(L, h), h);
    let m = 1e9; for (const r of SET[a]) m = Math.min(m, dE(p.hex, r.hex));
    return { hex: p.hex, de: m, aa: Math.min(...G[a].map((g) => ratio(p.hex, g))), C: p.ceiling }; };
  const now = score(a === "light" ? 0.545 : 0.780);
  let best = null;
  for (let L = 0.30; L <= 0.95; L += 0.002) { const s = score(L);
    if (s.aa >= 4.5 && (!best || s.de > best.de)) best = { ...s, L }; }
  say(`| ${a} | peer-${k + 1} | ${h.toFixed(1)} | ${(a === "light" ? 0.545 : 0.78).toFixed(3)} | ${now.de.toFixed(3)} | ${now.aa.toFixed(2)} | **${best.L.toFixed(3)}** | **${best.de.toFixed(3)}** | ${best.aa.toFixed(2)} | ${best.hex} | +${(best.de - now.de).toFixed(3)} |`);
}
say();
say("Read: a stick's ΔE to the nearest cell-mate is bought with lightness, and AA 4.5 is the wall.");
fs.writeFileSync(new URL("../out/lsweep.md", import.meta.url), out.join("\n") + "\n");
