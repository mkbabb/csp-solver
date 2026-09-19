#!/usr/bin/env node
/**
 * PAL-TIN — CUT THE TIN. The twelve pencils, derived (never hand-picked), priced, printed.
 *
 * Reads the REAL sources:
 *   · web/frontend/src/assets/index.css  → every reserved ink, both theme arms, and the papers
 *
 * THE CUT, in order:
 *   1. every reserved hue (the same 29 the family-law instrument reads) becomes a FORBIDDEN ARC
 *      of ±MIN_SEP degrees; what is left is the wheel's FREE ARCS;
 *   2. twelve hues are placed inside the free arcs by a greedy farthest-point walk, so the tin
 *      is the most separated twelve the wheel still has room for — never a golden angle;
 *   3. each stick takes the LIGHT arm's lightness/chroma from a search that clears AA 4.5:1 on
 *      BOTH papers at the HIGHEST chroma the sRGB gamut and the floor allow (kinship with the
 *      wax: mean crayon C 0.166, R2 §7), then the DARK arm under the crayon law (hue held,
 *      L raised +0.06…0.10, chroma allowed to rise).
 *   4. prints the tin, the worst contrast, the nearest reserved ink per stick, and the
 *      lightness-step second lap (arm b1) with its own AA and its own ΔE to lap one.
 *
 *   node tin-cut.mjs [--json out.json]
 */
import fs from "node:fs";
import process from "node:process";

const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const MIN_SEP = 12; // the family law's floor, in degrees of OKLCH hue
const N = 12;

/* ── colour ────────────────────────────────────────────────────────────── */
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const unlin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function srgbToOklab([r, g, b]) {
  const R = lin(r), G = lin(g), B = lin(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function oklabToSrgb([L, A, B]) {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    unlin(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    unlin(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    unlin(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}
const oklch = (L, C, h) => oklabToSrgb([L, C * Math.cos((h * Math.PI) / 180), C * Math.sin((h * Math.PI) / 180)]);
const inGamut = ([r, g, b]) => [r, g, b].every((v) => v >= -0.0005 && v <= 1.0005);
const to8 = ([r, g, b]) => [r, g, b].map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255));
const hex8 = (rgb) => "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");
const relLum = ([r, g, b]) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
const contrast = (a, b) => {
  const [x, y] = [relLum(a), relLum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
function hexToRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function lchOf(hex) {
  const [L, A, B] = srgbToOklab(hexToRgb(hex).map((v) => v / 255));
  let h = (Math.atan2(B, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C: Math.hypot(A, B), h };
}
function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s, hp = h / 60, x = c * (1 - Math.abs((hp % 2) - 1));
  const t = hp < 1 ? [c, x, 0] : hp < 2 ? [x, c, 0] : hp < 3 ? [0, c, x] : hp < 4 ? [0, x, c] : hp < 5 ? [x, 0, c] : [c, 0, x];
  const m = l - c / 2;
  return t.map((v) => Math.round((v + m) * 255));
}
const gap = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
/** OKLab ΔE (Euclidean in Lab) — the lap-two discriminability number. */
const dE = (a, b) => {
  const A = srgbToOklab(a.map((v) => v / 255)), B = srgbToOklab(b.map((v) => v / 255));
  return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
};

/* ── the reserved set, read from the real stylesheet ───────────────────── */
const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const WANT = /--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;
const reserved = [];
for (const hit of css.matchAll(WANT)) reserved.push({ name: hit[1], hex: hit[2], ...lchOf(hit[2]) });
if (reserved.length !== 29) console.error(`NOTE: reserved set is ${reserved.length}, not the census's 29 — say so in the record`);

/* the papers, read from the same file */
const PAPER = {
  light: { bg: hslToRgb(48, 15, 98), card: hslToRgb(48, 12, 99) },
  dark: { bg: hslToRgb(24, 8, 6), card: hslToRgb(24, 6, 7) },
};

/* ── 1. the free arcs ──────────────────────────────────────────────────── */
const blocked = new Array(3600).fill(false); // 0.1deg resolution
for (const r of reserved)
  for (let k = 0; k < 3600; k++) if (gap(k / 10, r.h) < MIN_SEP) blocked[k] = true;
const free = [];
for (let k = 0; k < 3600; k++) {
  if (blocked[k]) continue;
  if (free.length && free.at(-1).end === (k - 1) / 10) free.at(-1).end = k / 10;
  else free.push({ start: k / 10, end: k / 10 });
}
// wrap-join
if (free.length > 1 && free[0].start === 0 && free.at(-1).end === 359.9) {
  free[0].start = free.at(-1).start - 360;
  free.pop();
}
const freeDeg = free.reduce((a, f) => a + (f.end - f.start + 0.1), 0);

/* ── 2. place twelve by farthest-point (greedy maximin), then relax ────── */
const candidates = [];
for (const f of free) for (let h = f.start; h <= f.end + 1e-9; h += 0.5) candidates.push(+(((h % 360) + 360) % 360).toFixed(1));
function placeN(n) {
  // seed at the widest arc's centre, then repeatedly take the candidate farthest from the set
  const widest = free.reduce((a, b) => (b.end - b.start > a.end - a.start ? b : a));
  const picked = [+((((widest.start + widest.end) / 2 % 360) + 360) % 360).toFixed(1)];
  while (picked.length < n) {
    let best = null, bestD = -1;
    for (const c of candidates) {
      const d = Math.min(...picked.map((p) => gap(c, p)));
      if (d > bestD) { bestD = d; best = c; }
    }
    picked.push(best);
  }
  return picked.sort((a, b) => a - b);
}
let hues = placeN(N);
// one relaxation sweep: nudge each stick to the local point that maximises its own min-gap
for (let pass = 0; pass < 40; pass++) {
  for (let i = 0; i < hues.length; i++) {
    const others = hues.filter((_, j) => j !== i);
    let best = hues[i], bestD = Math.min(...others.map((o) => gap(hues[i], o)));
    for (const c of candidates) {
      if (Math.abs(gap(c, hues[i])) > 8) continue;
      const d = Math.min(...others.map((o) => gap(c, o)));
      if (d > bestD) { bestD = d; best = c; }
    }
    hues[i] = best;
  }
}
hues = [...new Set(hues)].sort((a, b) => a - b);

/* ── 3. the arms ───────────────────────────────────────────────────────── */
/** highest in-gamut chroma at (L,h) */
function maxChroma(L, h) {
  let lo = 0, hi = 0.4;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklch(L, mid, h))) lo = mid; else hi = mid;
  }
  return lo;
}
/** the light arm: the highest chroma that still clears `floor` on BOTH papers, searching L down */
function armLight(h, floor = 4.5, targetC = 0.166) {
  let best = null;
  for (let L = 0.62; L >= 0.36; L -= 0.005) {
    const cap = Math.min(maxChroma(L, h), targetC);
    for (let C = cap; C >= 0.06; C -= 0.002) {
      const rgb = to8(oklch(L, C, h));
      const cb = contrast(rgb, PAPER.light.bg), cc = contrast(rgb, PAPER.light.card);
      if (Math.min(cb, cc) >= floor) {
        const score = C * 100 + Math.min(cb, cc) * 0.1;
        if (!best || score > best.score) best = { L: +L.toFixed(3), C: +C.toFixed(3), rgb, cb, cc, score };
        break;
      }
    }
  }
  return best;
}
/** the dark arm under the crayon law: hue held, L raised +0.06…+0.10, chroma may rise */
function armDark(h, Llight, floor = 4.5, targetC = 0.166) {
  let best = null;
  for (let dL = 0.10; dL >= 0.06 - 1e-9; dL -= 0.005) {
    const L = Math.min(0.95, Llight + dL + 0.22); // the dark band sits high (peer-ink-l 0.8 today)
    const cap = Math.min(maxChroma(L, h), targetC + 0.02);
    for (let C = cap; C >= 0.06; C -= 0.002) {
      const rgb = to8(oklch(L, C, h));
      const cb = contrast(rgb, PAPER.dark.bg), cc = contrast(rgb, PAPER.dark.card);
      if (Math.min(cb, cc) >= floor) {
        const score = C * 100;
        if (!best || score > best.score) best = { L: +L.toFixed(3), C: +C.toFixed(3), rgb, cb, cc, score };
        break;
      }
    }
  }
  return best;
}

const tin = hues.map((h, i) => {
  const l = armLight(h), d = armDark(h, l.L);
  const nearest = reserved
    .map((r) => ({ ...r, d: +gap(h, r.h).toFixed(1) }))
    .sort((a, b) => a.d - b.d)[0];
  return { i: i + 1, h, light: l, dark: d, nearest };
});

/* ── 4. print ──────────────────────────────────────────────────────────── */
console.log(`RESERVED INKS read from index.css: ${reserved.length}  ·  MIN_SEP ${MIN_SEP}deg`);
console.log(`FORBIDDEN arc total: ${(360 - freeDeg).toFixed(1)}deg  ·  FREE: ${freeDeg.toFixed(1)}deg in ${free.length} arcs`);
for (const f of free) console.log(`  free arc ${f.start.toFixed(1)} … ${f.end.toFixed(1)}  (${(f.end - f.start + 0.1).toFixed(1)}deg)`);
const minGap = Math.min(...tin.flatMap((a, i) => tin.slice(i + 1).map((b) => gap(a.h, b.h))));
console.log(`\nTHE TIN — ${tin.length} sticks, min inter-stick hue gap ${minGap.toFixed(1)}deg`);
console.log("stick | hue   | light hex  L     C     vs bg  vs card | dark hex   L     C     vs bg  vs card | nearest reserved");
for (const s of tin) {
  console.log(
    `  ${String(s.i).padStart(2)}  | ${String(s.h.toFixed(1)).padStart(5)} | ${hex8(s.light.rgb)} ${s.light.L.toFixed(3)} ${s.light.C.toFixed(3)} ${s.light.cb.toFixed(2)}:1 ${s.light.cc.toFixed(2)}:1 | ` +
      `${hex8(s.dark.rgb)} ${s.dark.L.toFixed(3)} ${s.dark.C.toFixed(3)} ${s.dark.cb.toFixed(2)}:1 ${s.dark.cc.toFixed(2)}:1 | ${s.nearest.name} ${s.nearest.hex} ${s.nearest.d}deg`,
  );
}
const worst = (arm, key) => tin.reduce((a, s) => Math.min(a, s[arm][key]), Infinity);
console.log(`\nWORST light: ${worst("light", "cb").toFixed(2)}:1 vs background · ${worst("light", "cc").toFixed(2)}:1 vs card`);
console.log(`WORST dark : ${worst("dark", "cb").toFixed(2)}:1 vs background · ${worst("dark", "cc").toFixed(2)}:1 vs card`);
console.log(`WORST Δh to any reserved ink: ${Math.min(...tin.map((s) => s.nearest.d)).toFixed(1)}deg (floor ${MIN_SEP})`);
console.log(`Chroma: light mean ${(tin.reduce((a, s) => a + s.light.C, 0) / tin.length).toFixed(3)} (mean crayon 0.166) · dark mean ${(tin.reduce((a, s) => a + s.dark.C, 0) / tin.length).toFixed(3)}`);

/* the 3:1 non-text arm, at the pressures the ring and the trace are drawn at */
const over = (fg, bg, a) => fg.map((v, k) => Math.round(v * a + bg[k] * (1 - a)));
console.log(`\nNON-TEXT 3:1 at the DRAWN pressures (cursor ring stroke-opacity 0.55 · join trace 0.95/0.65/0.45)`);
for (const [pressure, label] of [[0.55, "ring 0.55"], [0.95, "trace join 0.95"], [0.65, "trace rejoin 0.65"], [0.45, "trace leave 0.45"]]) {
  const rows = tin.flatMap((s) => [
    contrast(over(s.light.rgb, PAPER.light.bg, pressure), PAPER.light.bg),
    contrast(over(s.light.rgb, PAPER.light.card, pressure), PAPER.light.card),
    contrast(over(s.dark.rgb, PAPER.dark.bg, pressure), PAPER.dark.bg),
    contrast(over(s.dark.rgb, PAPER.dark.card, pressure), PAPER.dark.card),
  ]);
  console.log(`  ${label.padEnd(18)} worst ${Math.min(...rows).toFixed(2)}:1  ${Math.min(...rows) >= 3 ? "PASS" : "FAIL"}`);
}

/* ── ARM (b1): the lightness step, lap two ─────────────────────────────── */
const STEP = +(process.env.LSTEP ?? 0.12);
console.log(`\nARM b1 — THE SECOND LAP at a lightness step of ${STEP} (light: lighter; dark: deeper)`);
let lapWorst = Infinity, dEWorst = Infinity, lapFail = 0;
for (const s of tin) {
  const l2 = to8(oklch(s.light.L + STEP, s.light.C, s.h));
  const d2 = to8(oklch(s.dark.L - STEP, s.dark.C, s.h));
  const c = [contrast(l2, PAPER.light.bg), contrast(l2, PAPER.light.card), contrast(d2, PAPER.dark.bg), contrast(d2, PAPER.dark.card)];
  const e = Math.min(dE(l2, s.light.rgb), dE(d2, s.dark.rgb));
  lapWorst = Math.min(lapWorst, ...c);
  dEWorst = Math.min(dEWorst, e);
  if (Math.min(...c) < 4.5) lapFail++;
  console.log(`  stick ${String(s.i).padStart(2)} lap2 light ${hex8(l2)} ${Math.min(c[0], c[1]).toFixed(2)}:1 · dark ${hex8(d2)} ${Math.min(c[2], c[3]).toFixed(2)}:1 · ΔE(lap1,lap2) ${e.toFixed(3)}`);
}
console.log(`  LAP TWO worst AA ${lapWorst.toFixed(2)}:1 · sticks under 4.5 = ${lapFail}/${tin.length} · worst ΔE ${dEWorst.toFixed(3)}`);

if (process.argv.includes("--json")) {
  const out = process.argv[process.argv.indexOf("--json") + 1];
  fs.writeFileSync(out, JSON.stringify({ MIN_SEP, reserved, free, tin: tin.map((s) => ({ i: s.i, h: s.h, light: { ...s.light, hex: hex8(s.light.rgb) }, dark: { ...s.dark, hex: hex8(s.dark.rgb) }, nearest: s.nearest })), step: STEP }, null, 2));
  console.log(`\nbanked → ${out}`);
}
