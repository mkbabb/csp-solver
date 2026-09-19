#!/usr/bin/env node
/**
 * PAL-TIN — THE THREE FORKS, priced side by side, on one page.
 *
 *   fork (a) FREE STICKS      — 12 free vs 8 free vs 6 free: what exhaustion costs each
 *   fork (b) SHARING AXIS     — the lightness step, against the tin's OWN inter-stick floor
 *   fork (c) DERIVATION       — twelve cuts between the anchors vs six hues x two bands
 *   plus    THE CRAYON-LAW DARK ARM (law 18's letter: L_light + 0.06…0.10) vs the peer band
 *
 * The decision number throughout is ΔE(OKLab) — hue degrees measure the distance to an
 * ANCHOR; ΔE measures whether two PLAYERS look like two people.
 */
import fs from "node:fs";

const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const MIN_SEP = 12;

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const unlin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function srgbToOklab([r, g, b]) {
  const R = lin(r), G = lin(g), B = lin(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function oklabToSrgb([L, A, B]) {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [unlin(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    unlin(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    unlin(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)];
}
const oklch = (L, C, h) => oklabToSrgb([L, C * Math.cos((h * Math.PI) / 180), C * Math.sin((h * Math.PI) / 180)]);
const inGamut = ([r, g, b]) => [r, g, b].every((v) => v >= -0.0005 && v <= 1.0005);
const to8 = ([r, g, b]) => [r, g, b].map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255));
const hex8 = (rgb) => "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");
const relLum = ([r, g, b]) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
const contrast = (a, b) => { const [x, y] = [relLum(a), relLum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const hexToRgb = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
function lchOf(hex) { const [L, A, B] = srgbToOklab(hexToRgb(hex).map((v) => v / 255)); let h = (Math.atan2(B, A) * 180) / Math.PI; if (h < 0) h += 360; return { L, C: Math.hypot(A, B), h }; }
function hslToRgb(h, s, l) { s /= 100; l /= 100; const c = (1 - Math.abs(2 * l - 1)) * s, hp = h / 60, x = c * (1 - Math.abs((hp % 2) - 1)); const t = hp < 1 ? [c, x, 0] : hp < 2 ? [x, c, 0] : hp < 3 ? [0, c, x] : hp < 4 ? [0, x, c] : hp < 5 ? [x, 0, c] : [c, 0, x]; const m = l - c / 2; return t.map((v) => Math.round((v + m) * 255)); }
const gap = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
const dE = (a, b) => { const A = srgbToOklab(a.map((v) => v / 255)), B = srgbToOklab(b.map((v) => v / 255)); return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]); };
const over = (fg, bg, a) => fg.map((v, k) => Math.round(v * a + bg[k] * (1 - a)));
function maxChroma(L, h) { let lo = 0, hi = 0.4; for (let i = 0; i < 36; i++) { const m = (lo + hi) / 2; if (inGamut(oklch(L, m, h))) lo = m; else hi = m; } return lo; }

const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const WANT = /--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;
const reserved = []; for (const h of css.matchAll(WANT)) reserved.push({ name: h[1], hex: h[2], ...lchOf(h[2]) });
const PAPER = { light: { bg: hslToRgb(48, 15, 98), card: hslToRgb(48, 12, 99) }, dark: { bg: hslToRgb(24, 8, 6), card: hslToRgb(24, 6, 7) } };

const blocked = new Array(3600).fill(false);
for (const r of reserved) for (let k = 0; k < 3600; k++) if (gap(k / 10, r.h) < MIN_SEP) blocked[k] = true;
const free = [];
for (let k = 0; k < 3600; k++) { if (blocked[k]) continue; if (free.length && free.at(-1).end === (k - 1) / 10) free.at(-1).end = k / 10; else free.push({ start: k / 10, end: k / 10 }); }
if (free.length > 1 && free[0].start === 0 && free.at(-1).end === 359.9) { free[0].start = free.at(-1).start - 360; free.pop(); }
const candidates = []; for (const f of free) for (let h = f.start; h <= f.end + 1e-9; h += 0.25) candidates.push(+(((h % 360) + 360) % 360).toFixed(2));
function placeN(n) {
  const w = free.reduce((a, b) => (b.end - b.start > a.end - a.start ? b : a));
  const p = [+((((w.start + w.end) / 2 % 360) + 360) % 360).toFixed(2)];
  while (p.length < n) { let best = null, bd = -1; for (const c of candidates) { const d = Math.min(...p.map((q) => gap(c, q))); if (d > bd) { bd = d; best = c; } } p.push(best); }
  for (let z = 0; z < 60; z++) for (let i = 0; i < p.length; i++) { const o = p.filter((_, j) => j !== i); let b = p[i], bd = Math.min(...o.map((q) => gap(p[i], q))); for (const c of candidates) { if (gap(c, p[i]) > 10) continue; const d = Math.min(...o.map((q) => gap(c, q))); if (d > bd) { bd = d; b = c; } } p[i] = b; }
  return [...new Set(p)].sort((a, b) => a - b);
}
function arm(theme, h, floors, targetC = 0.166, Lfix = null) {
  const band = theme === "light" ? [0.68, 0.22] : [0.96, 0.52];
  const Ls = Lfix != null ? [Lfix] : (() => { const o = []; for (let L = band[0]; L >= band[1]; L -= 0.005) o.push(+L.toFixed(3)); return o; })();
  let best = null;
  for (const L of Ls) {
    const cap = Math.min(maxChroma(L, h), targetC);
    for (let C = cap; C >= 0.03; C -= 0.002) {
      const rgb = to8(oklch(L, C, h));
      if (floors.every((f) => [PAPER[theme].bg, PAPER[theme].card].every((p) => contrast(f.alpha === 1 ? rgb : over(rgb, p, f.alpha), p) >= f.min))) {
        if (!best || C > best.C) best = { L, C: +C.toFixed(3), rgb, hex: hex8(rgb), h, aa: +Math.min(...["bg", "card"].map((t) => contrast(rgb, PAPER[theme][t]))).toFixed(2), ring: +Math.min(...["bg", "card"].map((t) => contrast(over(rgb, PAPER[theme][t], 0.55), PAPER[theme][t]))).toFixed(2) };
        break;
      }
    }
  }
  return best;
}
const AA = [{ alpha: 1, min: 4.5 }];
const stats = (set) => { const E = set.flatMap((x, i) => set.slice(i + 1).map((y) => dE(x.rgb, y.rgb))); E.sort((a, b) => a - b); return { min: E[0], p10: E[Math.floor(E.length * 0.1)], med: E[Math.floor(E.length / 2)], under10: E.filter((e) => e < 0.1).length, n: E.length }; };

/* ═══ FORK (c) — the derivation, priced on both themes and both floors ═══ */
console.log("═══ FORK (c) · DERIVATION — twelve cuts vs six hues x two bands");
console.log("  arrangement                       | theme | worst AA | min ΔE  | 10th-pct ΔE | pairs <0.10 | mean C");
const rows = [];
function report(label, theme, set) {
  const s = stats(set);
  console.log(`  ${label.padEnd(33)} | ${theme.padEnd(5)} | ${String(Math.min(...set.map((x) => x.aa)).toFixed(2)).padStart(8)} | ${s.min.toFixed(3)}   | ${s.p10.toFixed(3)}       | ${String(s.under10).padStart(2)}/${s.n}      | ${(set.reduce((a, x) => a + x.C, 0) / set.length).toFixed(3)}`);
  rows.push({ label, theme, worstAA: +Math.min(...set.map((x) => x.aa)).toFixed(2), minDE: +s.min.toFixed(3), under10: s.under10, meanC: +(set.reduce((a, x) => a + x.C, 0) / set.length).toFixed(3), hexes: set.map((x) => x.hex) });
}
for (const theme of ["light", "dark"]) {
  const twelve = placeN(12).map((h) => arm(theme, h, AA)).filter(Boolean);
  report("(c1) twelve cuts, one band", theme, twelve);
  for (const STEP of [0.10, 0.14]) {
    const six = placeN(6);
    const set = [];
    for (const h of six) {
      const a = arm(theme, h, AA);
      const L2 = theme === "light" ? a.L - STEP : Math.min(0.965, a.L + STEP);
      const C2 = Math.min(a.C, maxChroma(L2, h)), rgb2 = to8(oklch(L2, C2, h));
      set.push(a, { L: L2, C: C2, rgb: rgb2, hex: hex8(rgb2), h, aa: +Math.min(...["bg", "card"].map((t) => contrast(rgb2, PAPER[theme][t]))).toFixed(2), ring: 0 });
    }
    report(`(c2) six hues x 2 bands, step ${STEP.toFixed(2)}`, theme, set);
  }
}

/* ═══ FORK (a) — how many FREE sticks, and when exhaustion arrives ═══ */
console.log("\n═══ FORK (a) · FREE STICKS — exhaustion against the owner's '16+ within reason'");
console.log("  free | first sharer is player | laps needed for 16 | min ΔE of the free set (light)");
for (const n of [6, 8, 10, 12, 15]) {
  const set = placeN(n).map((h) => arm("light", h, AA)).filter(Boolean);
  console.log(`   ${String(n).padStart(2)}  | ${String(n + 1).padStart(22)} | ${String(Math.ceil(16 / n)).padStart(18)} | ${stats(set).min.toFixed(3)}`);
}

/* ═══ FORK (b) — the lightness step against the tin's OWN floor ═══ */
console.log("\n═══ FORK (b) · THE SHARING AXIS — a lightness step must be SMALLER than the tin's own min ΔE,");
console.log("               or the 13th player reads as a different pencil rather than as a sharer.");
for (const nFree of [12, 6]) {
  const hs = placeN(nFree);
  const base = hs.map((h) => arm("light", h, AA)).filter(Boolean);
  const floor = stats(base).min;
  console.log(`  free=${nFree}: the tin's own min inter-stick ΔE = ${floor.toFixed(3)}`);
  for (const STEP of [0.06, 0.10, 0.14]) {
    const lap2 = base.map((a) => { const L = a.L - STEP, C = Math.min(a.C, maxChroma(L, a.h)); return { rgb: to8(oklch(L, C, a.h)), a }; });
    const own = Math.min(...lap2.map((x) => dE(x.rgb, x.a.rgb)));
    const other = Math.min(...lap2.flatMap((x) => base.filter((b) => b.h !== x.a.h).map((b) => dE(x.rgb, b.rgb))));
    const verdict = own < 0.02 ? "INVISIBLE — the sharer is not told apart at all"
      : other < own ? "FAILS — a sharer is closer to SOMEBODY ELSE than to its own pencil"
        : own > floor ? "FAILS — the step is bigger than the gap between two different pencils" : "holds";
    console.log(`    step ${STEP.toFixed(2)}: ΔE(own pencil) ${own.toFixed(3)} · ΔE(nearest other pencil) ${other.toFixed(3)} → ${verdict}`);
  }
}

/* ═══ THE CRAYON-LAW DARK ARM ═══ */
console.log("\n═══ THE DARK ARM — law 18's letter (L_light + 0.06…0.10) against the peer band (+0.300)");
console.log("  hue   | light L | crayon-law dark L | its AA on dark paper | its ring@0.55 | peer-band dark L | its AA");
let crayonLawFails = 0;
for (const h of placeN(12)) {
  const l = arm("light", h, AA);
  const Lc = +(l.L + 0.09).toFixed(3);
  const c = arm("dark", h, [{ alpha: 1, min: 0 }], 0.166, Lc);
  const p = arm("dark", h, AA);
  if (c.aa < 4.5) crayonLawFails++;
  console.log(`  ${String(h.toFixed(1)).padStart(5)} | ${l.L.toFixed(3)}   | ${Lc.toFixed(3)}             | ${String(c.aa.toFixed(2)).padStart(20)} | ${String(c.ring.toFixed(2)).padStart(13)} | ${p.L.toFixed(3)}            | ${p.aa.toFixed(2)}`);
}
console.log(`  sticks whose CRAYON-LAW dark arm misses AA 4.5 on the dark papers: ${crayonLawFails}/12`);

fs.writeFileSync(new URL("../out/tin-forks.json", import.meta.url), JSON.stringify({ rows }, null, 2));
