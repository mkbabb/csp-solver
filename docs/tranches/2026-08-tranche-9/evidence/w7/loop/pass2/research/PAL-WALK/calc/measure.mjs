#!/usr/bin/env node
/**
 * PAL-WALK pass-2 RESEARCH — the arithmetic, off HEAD's index.css and pass 1's banked engine
 * bytes. No browser: every painted figure here is read out of
 * `pass1/prototype/PAL-WALK/readings/bytes-<engine>-<theme>.json` (READ-ONLY; the pass-1 record
 * is frozen and nothing here writes to it).
 *
 *   node calc/measure.mjs
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const REPO = join(HERE, "../../../../../../../../../..");
const CSS = join(REPO, "web/frontend/src/assets/index.css");
const BYTES = join(REPO, "docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/PAL-WALK/readings");

// ── colour ────────────────────────────────────────────────────────────────────────────
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const srgbToOklab = (r8, g8, b8) => {
  const [r, g, b] = [r8, g8, b8].map((v) => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};
const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const oklabOfHex = (hex) => srgbToOklab(...hexToRgb(hex));
const dE = (A, B) => Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
const hueOfLab = ([, a, b]) => {
  const h = (Math.atan2(b, a) * 180) / Math.PI;
  return h < 0 ? h + 360 : h;
};
const chromaOfLab = ([, a, b]) => Math.hypot(a, b);
const gap = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

// ── the sheet ─────────────────────────────────────────────────────────────────────────
const css = readFileSync(CSS, "utf8");
const RE =
  /--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;
// Which block a declaration sits in: the dark block opens at the `.dark` selector.
const darkStart = css.indexOf("\n.dark {"); // index.css:362 — the only top-level dark block
const inks = [...css.matchAll(RE)].map((m) => ({
  name: m[1],
  hex: m[2],
  theme: m.index > darkStart ? "dark" : "light",
  lab: oklabOfHex(m[2]),
}));
for (const k of inks) {
  k.h = hueOfLab(k.lab);
  k.C = chromaOfLab(k.lab);
  k.L = k.lab[0];
}

console.log(`# 1 · THE RESERVED SET, re-derived from index.css at HEAD`);
console.log(`total ink declarations matched: ${inks.length}`);
for (const t of ["light", "dark"]) {
  const s = inks.filter((i) => i.theme === t);
  console.log(`  ${t}: ${s.length}`);
}
const byHue = [...inks].sort((a, b) => a.h - b.h);
console.log(`\nhue · chroma · L · token (theme)`);
for (const i of byHue)
  console.log(
    `  ${i.h.toFixed(2).padStart(7)}°  C=${i.C.toFixed(4)}  L=${i.L.toFixed(3)}  --color-${i.name} ${i.hex} (${i.theme})`,
  );

// distinct hues (the arcs only care about hue)
const uniq = [];
for (const i of byHue) if (!uniq.some((u) => Math.abs(u.h - i.h) < 1e-9)) uniq.push(i);
console.log(`\ndistinct hues: ${uniq.length}`);

// ── arcs at a sweep of guards ─────────────────────────────────────────────────────────
function arcsAt(guard, hues) {
  const raw = [];
  for (const h of hues) {
    const a = h - guard;
    const b = h + guard;
    if (a < 0) raw.push([a + 360, 360], [0, b]);
    else if (b > 360) raw.push([a, 360], [0, b - 360]);
    else raw.push([a, b]);
  }
  raw.sort((p, q) => p[0] - q[0]);
  const merged = [];
  for (const iv of raw) {
    const last = merged[merged.length - 1];
    if (last && iv[0] <= last[1] + 1e-9) last[1] = Math.max(last[1], iv[1]);
    else merged.push([...iv]);
  }
  return merged;
}
const openOf = (arcs) => {
  const open = [];
  let cut = 0;
  for (const [a, b] of arcs) {
    if (a > cut) open.push([cut, a]);
    cut = Math.max(cut, b);
  }
  if (cut < 360) open.push([cut, 360]);
  return open;
};
const spanOf = (open) => open.reduce((s, [a, b]) => s + (b - a), 0);
const walkHues = (open, n, stepFrac = (3 - Math.sqrt(5)) / 2) => {
  const span = spanOf(open);
  const step = span * stepFrac;
  return Array.from({ length: n }, (_, i) => {
    let p = (((i * step) % span) + span) % span;
    for (const [a, b] of open) {
      if (p < b - a) return a + p;
      p -= b - a;
    }
    return open[open.length - 1][1];
  });
};
const minSep = (hs) => {
  let m = 360;
  for (let i = 0; i < hs.length; i++)
    for (let k = i + 1; k < hs.length; k++) m = Math.min(m, gap(hs[i], hs[k]));
  return m;
};

console.log(`\n# 2 · ARC GEOMETRY vs the guard`);
console.log(`guard  arcs  open  span°    step°   room@12°(requested)`);
const allHues = inks.map((i) => i.h);
for (const g of [12, 12.25, 12.5, 13, 13.5, 14, 15, 16, 18, 20]) {
  const arcs = arcsAt(g, allHues);
  const open = openOf(arcs);
  const span = spanOf(open);
  let room = 0;
  for (let n = 2; n <= 40; n++) {
    if (minSep(walkHues(open, n)) >= 12) room = n;
    else break;
  }
  console.log(
    `${String(g).padStart(5)}  ${String(arcs.length).padStart(4)}  ${String(open.length).padStart(4)}  ${span.toFixed(2).padStart(7)}  ${(span * ((3 - Math.sqrt(5)) / 2)).toFixed(2).padStart(6)}   ${room}`,
  );
}

// ── the painted bytes ─────────────────────────────────────────────────────────────────
const bytes = {};
for (const e of ["chromium", "webkit"])
  for (const t of ["light", "dark"])
    bytes[`${e}-${t}`] = JSON.parse(readFileSync(join(BYTES, `bytes-${e}-${t}.json`), "utf8"));

console.log(`\n# 3 · PEER-vs-TOKEN, in ΔE over the PAINTED bytes (pass-1 readings)`);
console.log(`the house's own reference: the two closest LIGHT crayon inks`);
const lightCrayons = inks.filter((i) => i.theme === "light" && /^crayon-/.test(i.name));
let refMin = Infinity,
  refPair = "";
for (let i = 0; i < lightCrayons.length; i++)
  for (let k = i + 1; k < lightCrayons.length; k++) {
    const d = dE(lightCrayons[i].lab, lightCrayons[k].lab);
    if (d < refMin) {
      refMin = d;
      refPair = `${lightCrayons[i].name} vs ${lightCrayons[k].name}`;
    }
  }
console.log(`  ΔE = ${refMin.toFixed(4)}  (${refPair})`);

for (const key of Object.keys(bytes)) {
  const b = bytes[key];
  const theme = key.endsWith("dark") ? "dark" : "light";
  const tokens = inks.filter((i) => i.theme === theme);
  const rows = [];
  for (let i = 0; i < b.painted.length; i++) {
    const p = b.painted[i];
    const lab = srgbToOklab(...p.rgb.split(",").map(Number));
    let best = Infinity,
      who = "";
    for (const t of tokens) {
      const d = dE(lab, t.lab);
      if (d < best) {
        best = d;
        who = t.name;
      }
    }
    rows.push({ i, dE: best, who, h: p.h });
  }
  rows.sort((a, b2) => a.dE - b2.dE);
  console.log(`\n  ${key} — the six hands nearest a reserved ink (of 144):`);
  for (const r of rows.slice(0, 6))
    console.log(
      `    i=${String(r.i).padStart(3)}  ΔE ${r.dE.toFixed(4)}  → --color-${r.who}   (hue ${r.h}°)`,
    );
  const first8 = rows.filter((r) => r.i < 8).sort((a, b2) => a.dE - b2.dE);
  console.log(`    worst of the first EIGHT dealt: i=${first8[0].i} ΔE ${first8[0].dE.toFixed(4)} → --color-${first8[0].who}`);
  const under = rows.filter((r) => r.dE < refMin).length;
  console.log(`    hands closer to a token than the house's own crayon pair (${refMin.toFixed(4)}): ${under}/144`);
}

console.log(`\n# 4 · PEER-vs-PEER, ΔE over the painted bytes — the capacity question`);
const dEroom = (labs, n) => {
  let m = Infinity;
  for (let i = 0; i < n; i++) for (let k = i + 1; k < n; k++) m = Math.min(m, dE(labs[i], labs[k]));
  return m;
};
for (const key of Object.keys(bytes)) {
  const b = bytes[key];
  const labs = b.painted.map((p) => srgbToOklab(...p.rgb.split(",").map(Number)));
  const line = [2, 3, 4, 5, 6, 7, 8, 12, 16].map((n) => `${n}:${dEroom(labs, n).toFixed(4)}`);
  console.log(`  ${key.padEnd(16)} ${line.join("  ")}`);
  // capacity at each candidate ΔE floor
  const cap = (floor) => {
    for (let n = 2; n <= 144; n++) if (dEroom(labs, n) < floor) return n - 1;
    return 144;
  };
  console.log(
    `    capacity at ΔE floor  0.0764(house crayons): ${cap(refMin)}   0.05: ${cap(0.05)}   0.04: ${cap(0.04)}   0.03: ${cap(0.03)}   0.02: ${cap(0.02)}`,
  );
}

console.log(`\n# 5 · THE CHROMA, and the two-var fallback — measured, not priced`);
for (const key of Object.keys(bytes)) {
  const b = bytes[key];
  const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
  const reqC = b.requested.map((r) => r.C);
  const paintC = b.painted.map((p) => p.C);
  const fbC = b.paintedFb.map((p) => p.C);
  console.log(
    `  ${key.padEnd(16)} requested mean C ${mean(reqC).toFixed(4)}  painted ${mean(paintC).toFixed(4)}  FALLBACK painted ${mean(fbC).toFixed(4)}  (min painted ${Math.min(...paintC).toFixed(4)})`,
  );
  const r = b.rows;
  for (const g of ["background", "card"])
    console.log(
      `      ${g.padEnd(10)} opaque worst ${r[g + "|opaque"].worst}  (under4.5 ${r[g + "|opaque"].under45})   FALLBACK worst ${r[g + "|fallback"].worst}  (under4.5 ${r[g + "|fallback"].under45})`,
    );
  console.log(
    `      ring080 bg ${r["background|ring080"].worst} / card ${r["card|ring080"].worst}  (under3 ${r["background|ring080"].under3}/${r["card|ring080"].under3})   ring055 bg ${r["background|ring055"].worst} (under3 ${r["background|ring055"].under3})   trace095 bg ${r["background|trace095"].worst}`,
  );
}

console.log(`\n# 6 · THE 8-BIT FLOOR — painted hue vs requested, over 144`);
for (const key of Object.keys(bytes)) {
  const b = bytes[key];
  let worst = 0,
    at = -1;
  for (let i = 0; i < b.painted.length; i++) {
    const d = gap(b.painted[i].h, b.requested[i].h);
    if (d > worst) {
      worst = d;
      at = i;
    }
  }
  console.log(`  ${key.padEnd(16)} max |Δhue| ${worst.toFixed(3)}° @ i=${at}`);
}
