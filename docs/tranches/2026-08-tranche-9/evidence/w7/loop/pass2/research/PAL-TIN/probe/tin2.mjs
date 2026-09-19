#!/usr/bin/env node
/**
 * PAL-TIN pass-2 RESEARCH probe. Re-derives, from HEAD's own `index.css`, every number the
 * pass-1 spec and critique cite, and adds the pass-2 rows: gate 1 in ΔE, the co-occurrence
 * partition, the gamut ceiling, the 8-bit margin, the walk's own collisions.
 *
 * Read-only. Writes only under this lane's evidence dir.
 *   node tin2.mjs
 */
import fs from "node:fs";
import {
  chromaAt, chromaOf, dE, gap, hueOf, lOf, oklab, paint, ratio,
} from "./color.mjs";

const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const darkAt = css.indexOf("\n.dark");
const LIGHTBLOCK = css.slice(0, darkAt);
const DARKBLOCK = css.slice(darkAt);

/* ── 1 · the reserved set — RESOLVED, aliases and all (the pass-1 gate could not) ──── */
const NAMES = [
  "user-ink", "focus-sketch", "progress-ink", "teacher-red", "gold-star",
  "crayon-green", "crayon-orange", "crayon-rose", "crayon-blue", "crayon-gold",
  "green-ink", "orange-ink", "red-ink", "gold-ink",
  "solver-ink-1", "solver-ink-2", "solver-ink-3", "solver-ink-4", "solver-ink-5",
];
const hslToHex = (h, s, l) => {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const t = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return "#" + t.map((v) => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("");
};
const rawOf = (block, name) => {
  const m = new RegExp(`--color-${name}:\\s*([^;]+);`).exec(block);
  return m ? m[1].replace(/\s+/g, " ").trim() : null;
};
function resolve(block, fallback, name, depth = 0) {
  let raw = rawOf(block, name);
  if (raw === null && fallback) raw = rawOf(fallback, name);
  if (raw === null || depth > 4) return null;
  let m = /^#([0-9a-fA-F]{6})$/.exec(raw);
  if (m) return `#${m[1].toLowerCase()}`;
  m = /^hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)$/.exec(raw);
  if (m) return hslToHex(+m[1], +m[2], +m[3]);
  m = /^var\(\s*--color-([a-z0-9-]+)\s*\)$/.exec(raw);
  if (m) return resolve(block, fallback, m[1], depth + 1);
  return null;
}
const RES = { light: new Map(), dark: new Map() };
const ALIASED = { light: [], dark: [] };
for (const n of NAMES) {
  const l = resolve(LIGHTBLOCK, null, n);
  const d = resolve(DARKBLOCK, LIGHTBLOCK, n);
  if (l) RES.light.set(n, l);
  if (d) RES.dark.set(n, d);
  if (/^var\(/.test(rawOf(LIGHTBLOCK, n) ?? "")) ALIASED.light.push(n);
  if (/^var\(/.test(rawOf(DARKBLOCK, n) ?? "")) ALIASED.dark.push(n);
  if (rawOf(DARKBLOCK, n) === null) ALIASED.dark.push(`${n}(inherits light)`);
}

/* ── 2 · the tin, as pass 1 landed it ─────────────────────────────────────────────── */
const TIN = {
  light: { 1: "#b24f00", 2: "#5f7d00", 3: "#008086", 4: "#5a61ce", 5: "#a5439a" },
  dark: { 1: "#ff9a62", 2: "#a0c942", 3: "#00d0d9", 4: "#a4b1ff", 5: "#f48ce6" },
};
const GROUND = {
  light: { background: resolve(LIGHTBLOCK, null, "background"), card: resolve(LIGHTBLOCK, null, "card") },
  dark: { background: resolve(DARKBLOCK, LIGHTBLOCK, "background"), card: resolve(DARKBLOCK, LIGHTBLOCK, "card") },
};

/* ── 3 · WHO SHARES A SURFACE WITH A PLAYER'S DIGIT (the pass-2 partition) ─────────── */
// Measured by grep in `board-surface.txt`; the set is stated here and cited there.
const BOARD = new Set([
  "user-ink", "solver-ink-1", "solver-ink-2", "solver-ink-3", "solver-ink-4",
  "solver-ink-5", "red-ink", "green-ink", "orange-ink", "gold-ink",
  "focus-sketch", "crayon-blue", "teacher-red", "progress-ink",
]);

const out = [];
const say = (s = "") => { out.push(s); console.log(s); };

say("# PAL-TIN pass 2 — the tin re-measured off HEAD index.css");
say(`reserved tokens RESOLVED: light ${RES.light.size}/${NAMES.length} · dark ${RES.dark.size}/${NAMES.length}`);
say(`grounds: light bg ${GROUND.light.background} card ${GROUND.light.card} · dark bg ${GROUND.dark.background} card ${GROUND.dark.card}`);
say(`hex-literal only (what pass 1's gate could see): light ${[...RES.light].filter(([n]) => /^#/.test(rawOf(LIGHTBLOCK, n) ?? "")).length} · dark ${[...RES.dark].filter(([n]) => /^#/.test(rawOf(DARKBLOCK, n) ?? "")).length}`);
say(`aliased or inherited in dark: ${ALIASED.dark.join(", ")}`);
say(`of those, on a board surface with a player digit: ${[...RES.light.keys()].filter((k) => BOARD.has(k)).length}`);
say();

/* ── GATE 1, TWO METRICS, TWO SETS ────────────────────────────────────────────────── */
for (const arm of ["light", "dark"]) {
  say(`## gate 1 · arm ${arm}`);
  say("| stick | hex | h | C | L | nearest reserved (deg) | deg | nearest reserved (ΔE) | ΔE | nearest BOARD ink | ΔE(board) |");
  say("|---|---|---|---|---|---|---|---|---|---|---|");
  for (const [i, hex] of Object.entries(TIN[arm])) {
    let bd = null, bdv = 1e9, be = null, bev = 1e9, bb = null, bbv = 1e9;
    for (const [name, rhex] of RES[arm]) {
      const d = gap(hueOf(hex), hueOf(rhex));
      const e = dE(hex, rhex);
      if (d < bdv) { bdv = d; bd = name; }
      if (e < bev) { bev = e; be = name; }
      if (BOARD.has(name) && e < bbv) { bbv = e; bb = name; }
    }
    say(`| peer-${i} | ${hex} | ${hueOf(hex).toFixed(1)} | ${chromaOf(hex).toFixed(3)} | ${lOf(hex).toFixed(3)} | ${bd} | **${bdv.toFixed(2)}** | ${be} | **${bev.toFixed(3)}** | ${bb} | **${bbv.toFixed(3)}** |`);
  }
  say();
}

/* ── the two spec numbers pass 2 must correct ─────────────────────────────────────── */
let worstDeg = 1e9, worstDegRow = "";
for (const arm of ["light", "dark"])
  for (const [i, hex] of Object.entries(TIN[arm]))
    for (const [name, rhex] of RES[arm]) {
      const d = gap(hueOf(hex), hueOf(rhex));
      if (d < worstDeg) { worstDeg = d; worstDegRow = `peer-${i} ${arm} ${hex} vs --color-${name} ${rhex}`; }
    }
say(`## the corrections`);
say(`- spec says "every stick >= 13.5deg from all 29 reserved inks" -> MEASURED **${worstDeg.toFixed(2)}deg** (${worstDegRow})`);
for (const arm of ["light", "dark"]) {
  const cs = Object.values(TIN[arm]).map(chromaOf);
  say(`- chroma ${arm}: min **${Math.min(...cs).toFixed(3)}** · mean ${(cs.reduce((a, b) => a + b) / cs.length).toFixed(3)} · max ${Math.max(...cs).toFixed(3)}`);
}
say();

/* ── the separation law (gate 2) and the AA arm ───────────────────────────────────── */
say("## gate 2 · pairwise separation, and AA");
for (const arm of ["light", "dark"]) {
  const ks = Object.keys(TIN[arm]);
  let w = 1e9, wr = "";
  for (let a = 0; a < ks.length; a++)
    for (let b = a + 1; b < ks.length; b++) {
      const e = dE(TIN[arm][ks[a]], TIN[arm][ks[b]]);
      if (e < w) { w = e; wr = `peer-${ks[a]} vs peer-${ks[b]}`; }
    }
  const aa = ks.flatMap((k) => Object.entries(GROUND[arm]).map(([g, gh]) => ratio(TIN[arm][k], gh)));
  say(`- ${arm}: min pairwise ΔE **${w.toFixed(3)}** (${wr}) · worst AA **${Math.min(...aa).toFixed(3)}:1** over ${aa.length} arms`);
}
say();

/* ── the gamut ceiling (PAL-WALK's graft) applied to a TABLE ──────────────────────── */
say("## the gamut ceiling, and the 8-bit margin — a table is not a formula");
say("| stick | arm | L | h | C held | chromaAt(L,h) | headroom | byte round trip Δh |");
say("|---|---|---|---|---|---|---|---|");
for (const arm of ["light", "dark"])
  for (const [i, hex] of Object.entries(TIN[arm])) {
    const L = lOf(hex), h = hueOf(hex), C = chromaOf(hex);
    const ceil = chromaAt(L, h);
    const re = paint(L, C, h);
    say(`| peer-${i} | ${arm} | ${L.toFixed(3)} | ${h.toFixed(1)} | ${C.toFixed(3)} | ${ceil.toFixed(3)} | ${(ceil - C).toFixed(3)} | ${gap(hueOf(re.hex), h).toFixed(3)} |`);
  }
say();

/* ── the incumbent walk, and the demands the tin exists to answer ─────────────────── */
say("## the incumbent walk (hue = i x 137.5 at C 0.11), painted, against the same set");
for (const [arm, L] of [["light", 0.5], ["dark", 0.8]]) {
  const rows = [];
  for (let i = 0; i < 40; i++) {
    const h = (i * 137.5) % 360;
    const p = paint(L, 0.11, h);
    let bn = null, bv = 1e9, bnd = null, bvd = 1e9;
    for (const [name, rhex] of RES[arm]) {
      const e = dE(p.hex, rhex); const d = gap(hueOf(p.hex), hueOf(rhex));
      if (e < bv) { bv = e; bn = name; }
      if (d < bvd) { bvd = d; bnd = name; }
    }
    rows.push({ i, h: +h.toFixed(1), hex: p.hex, clipped: p.clipped, ceiling: +p.ceiling.toFixed(3), painted: +hueOf(p.hex).toFixed(2), rot: +gap(hueOf(p.hex), h).toFixed(2), nearDeg: bnd, deg: +bvd.toFixed(2), nearDE: bn, de: +bv.toFixed(4) });
  }
  const bad = rows.filter((r) => r.deg < 12).map((r) => `i=${r.i} h=${r.h} ${r.deg}deg from --color-${r.nearDeg} (ΔE ${r.de})`);
  const badE = rows.filter((r) => r.de < 0.10).map((r) => `i=${r.i} ΔE ${r.de} from --color-${r.nearDE}`);
  say(`- ${arm}: max byte rotation **${Math.max(...rows.map((r) => r.rot)).toFixed(2)}deg** · clipped indices ${rows.filter((r) => r.clipped).length}/40`);
  say(`  - under 12deg of a reserved ink: ${bad.length ? bad.join("; ") : "none"}`);
  say(`  - under ΔE 0.10 of a reserved ink: **${badE.length}/40** — ${badE.slice(0, 6).join("; ")}${badE.length > 6 ? " …" : ""}`);
  // min pairwise among the first N
  for (const N of [3, 5, 6, 8, 16]) {
    let w = 1e9, wd = 1e9;
    for (let a = 0; a < N; a++) for (let b = a + 1; b < N; b++) {
      w = Math.min(w, dE(rows[a].hex, rows[b].hex));
      wd = Math.min(wd, gap(hueOf(rows[a].hex), hueOf(rows[b].hex)));
    }
    say(`  - N=${N}: min painted pairwise **${wd.toFixed(1)}deg / ΔE ${w.toFixed(3)}**`);
  }
  fs.writeFileSync(new URL(`../out/walk-sweep-${arm}.json`, import.meta.url), JSON.stringify(rows, null, 1));
}
say();

/* ── the tin's own answer to the same demands ─────────────────────────────────────── */
say("## the tin against the same demands (the roster is the tie-break past five)");
for (const arm of ["light", "dark"]) {
  for (const N of [3, 5]) {
    const ks = Object.keys(TIN[arm]).slice(0, N);
    let w = 1e9, wd = 1e9;
    for (let a = 0; a < ks.length; a++) for (let b = a + 1; b < ks.length; b++) {
      w = Math.min(w, dE(TIN[arm][ks[a]], TIN[arm][ks[b]]));
      wd = Math.min(wd, gap(hueOf(TIN[arm][ks[a]]), hueOf(TIN[arm][ks[b]])));
    }
    say(`- ${arm} N=${N}: min pairwise **${wd.toFixed(1)}deg / ΔE ${w.toFixed(3)}**`);
  }
  // self at #2563eb (light) / #60a5fa (dark) — PLR-COUNT's F1 ruling puts self in the room
  const self = arm === "light" ? "#2563eb" : "#60a5fa";
  const rows = Object.entries(TIN[arm]).map(([i, hex]) => `peer-${i} ${gap(hueOf(hex), hueOf(self)).toFixed(1)}deg/ΔE ${dE(hex, self).toFixed(3)}`);
  say(`  - vs incumbent self ${self}: ${rows.join(" · ")}`);
}

fs.writeFileSync(new URL("../out/tin2.md", import.meta.url), out.join("\n") + "\n");
