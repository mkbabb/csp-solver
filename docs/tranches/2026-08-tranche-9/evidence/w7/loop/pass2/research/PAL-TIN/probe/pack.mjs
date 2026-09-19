#!/usr/bin/env node
/**
 * PAL-TIN pass 2 — WHAT THE PAPER CAN ACTUALLY HOLD, in ΔE, in BOTH arms at once.
 *
 * The pass-1 gate asserts hue degrees; the critique asks for ΔE. Neither asks the question
 * that decides it: given the reserved inks a player's mark shares a cell with, what is the
 * LARGEST ΔE floor five hue-locked sticks can hold simultaneously in light and dark?
 *
 * Max-min by binary search on the floor: keep the hues that clear t in BOTH arms, then ask
 * whether five of them fit the circle at the spread. Prints the floor, the five hues, their
 * bytes, their pairwise ΔE and their AA — everything gate 1's re-cut needs to be defensible.
 */
import fs from "node:fs";
import { chromaAt, dE, gap, hueOf, lin, oklab, paint, ratio } from "./color.mjs";

const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const darkAt = css.indexOf("\n.dark");
const BLOCK = { light: css.slice(0, darkAt), dark: css.slice(darkAt) };
const NAMES = ["user-ink", "focus-sketch", "progress-ink", "teacher-red", "gold-star",
  "crayon-green", "crayon-orange", "crayon-rose", "crayon-blue", "crayon-gold",
  "green-ink", "orange-ink", "red-ink", "gold-ink",
  "solver-ink-1", "solver-ink-2", "solver-ink-3", "solver-ink-4", "solver-ink-5"];
const CELL = new Set(["user-ink", "solver-ink-1", "solver-ink-2", "solver-ink-3",
  "solver-ink-4", "solver-ink-5", "teacher-red", "focus-sketch", "crayon-blue"]);
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
for (const n of NAMES) { if (!CELL.has(n)) continue;
  const l = res(BLOCK.light, null, n); if (l) SET.light.push({ n, hex: l });
  const d = res(BLOCK.dark, BLOCK.light, n); if (d) SET.dark.push({ n, hex: d }); }
const G = { light: { bg: res(BLOCK.light, null, "background"), card: res(BLOCK.light, null, "card") },
            dark: { bg: res(BLOCK.dark, BLOCK.light, "background"), card: res(BLOCK.dark, BLOCK.light, "card") } };
const BAND = { light: 0.545, dark: 0.780 };
const STEP = 0.5;

/** per hue: painted hex at the gamut's chroma, min ΔE to the CELL set, AA on both grounds. */
const arm = {};
for (const a of ["light", "dark"]) {
  arm[a] = [];
  for (let h = 0; h < 360; h += STEP) {
    const p = paint(BAND[a], chromaAt(BAND[a], h), h);
    let m = 1e9, who = null;
    for (const r of SET[a]) { const e = dE(p.hex, r.hex); if (e < m) { m = e; who = r.n; } }
    arm[a].push({ h, hex: p.hex, minDE: m, who, aa: Math.min(ratio(p.hex, G[a].bg), ratio(p.hex, G[a].card)) });
  }
}
const idx = (h) => Math.round((h % 360) / STEP);

const out = [];
const say = (s = "") => { out.push(s); console.log(s); };
say("# PAL-TIN pass 2 — the paper's own five-stick ceiling, in ΔE, both arms at once");
say(`CELL reserved set: light ${SET.light.length} (${SET.light.map((r) => r.n).join(", ")})`);
say(`bands: light L ${BAND.light} on ${G.light.bg}/${G.light.card} · dark L ${BAND.dark} on ${G.dark.bg}/${G.dark.card}`);
say(`sticks are at the sRGB gamut's own chroma at their (L,h) — the ceiling, not a chosen number.`);
say();

function fits(t, spread, aaFloor) {
  const ok = arm.light.map((r, i) => r.minDE >= t && arm.dark[i].minDE >= t && r.aa >= aaFloor && arm.dark[i].aa >= aaFloor);
  // circular greedy from every admissible start
  for (let s = 0; s < ok.length; s++) {
    if (!ok[s]) continue;
    const picked = [s];
    let cur = s;
    for (let k = 0; k < 4; k++) {
      let nxt = -1;
      for (let d = Math.ceil(spread / STEP); d < ok.length; d++) {
        const j = (cur + d) % ok.length;
        if (!ok[j]) continue;
        if (gap(j * STEP, s * STEP) < spread && j !== s) continue;
        nxt = j; break;
      }
      if (nxt < 0) break;
      picked.push(nxt); cur = nxt;
    }
    if (picked.length === 5 && gap(picked[4] * STEP, s * STEP) >= spread) return picked;
  }
  return null;
}

for (const [spread, aaFloor] of [[40, 4.5], [50, 4.5], [55, 4.5], [40, 0]]) {
  let lo = 0, hi = 0.20, best = null;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const f = fits(mid, spread, aaFloor);
    if (f) { lo = mid; best = f; } else hi = mid;
  }
  if (!best) { say(`- spread ≥${spread}deg, AA ≥${aaFloor}: no five-stick tin exists`); continue; }
  const hs = best.map((i) => i * STEP);
  say(`## spread ≥${spread}deg · AA ≥${aaFloor}:1 → FLOOR ΔE **${lo.toFixed(3)}**`);
  say("| h | light hex | ΔE(cell,light) | nearest | AA light | dark hex | ΔE(cell,dark) | nearest | AA dark |");
  say("|---|---|---|---|---|---|---|---|---|");
  for (const h of hs) {
    const l = arm.light[idx(h)], d = arm.dark[idx(h)];
    say(`| ${h} | ${l.hex} | ${l.minDE.toFixed(3)} | ${l.who} | ${l.aa.toFixed(2)} | ${d.hex} | ${d.minDE.toFixed(3)} | ${d.who} | ${d.aa.toFixed(2)} |`);
  }
  let wp = 1e9;
  for (const a of ["light", "dark"]) for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++)
    wp = Math.min(wp, dE(arm[a][idx(hs[i])].hex, arm[a][idx(hs[j])].hex));
  say(`- min pairwise ΔE among the five, worse arm: **${wp.toFixed(3)}**`);
  say();
}

/* the incumbent tin, scored on the same ruler */
const TIN = { light: ["#b24f00", "#5f7d00", "#008086", "#5a61ce", "#a5439a"],
              dark: ["#ff9a62", "#a0c942", "#00d0d9", "#a4b1ff", "#f48ce6"] };
say("## the pass-1 tin on the same ruler");
let tinFloor = 1e9, tinRow = "";
for (const a of ["light", "dark"]) for (const hex of TIN[a]) {
  let m = 1e9, who = null;
  for (const r of SET[a]) { const e = dE(hex, r.hex); if (e < m) { m = e; who = r.n; } }
  if (m < tinFloor) { tinFloor = m; tinRow = `${a} ${hex} vs --color-${who}`; }
}
say(`- the tin's own floor against the CELL set, worse arm: **ΔE ${tinFloor.toFixed(3)}** (${tinRow})`);
say(`- spreads: light ${TIN.light.map((h) => hueOf(h).toFixed(1)).join(" / ")} · dark ${TIN.dark.map((h) => hueOf(h).toFixed(1)).join(" / ")}`);
const sp = TIN.light.map((h) => hueOf(h)).sort((a, b) => a - b);
say(`- min adjacent spread: **${Math.min(...sp.map((h, i) => gap(h, sp[(i + 1) % 5]))).toFixed(1)}deg**`);
fs.writeFileSync(new URL("../out/pack.md", import.meta.url), out.join("\n") + "\n");
