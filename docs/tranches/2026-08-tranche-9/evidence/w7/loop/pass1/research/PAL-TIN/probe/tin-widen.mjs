#!/usr/bin/env node
/**
 * PAL-TIN — TWO WAYS TO WIDEN THE WHEEL, measured before either is proposed.
 *
 *  W1 · THE LAW READ PER THEME. A peer ink painted in light mode can only be confused with a
 *       reserved ink that is also painted in light mode. The r0 instrument reads all 29 hexes
 *       against one walk because the walk has one hue per index in BOTH themes — a TABLE does
 *       not: every stick has its own light arm and its own dark arm, so the law can be read
 *       per theme without weakening it. How much arc does that free?
 *
 *  W2 · THE DARK ARM AS A CRAYON-LAW STEP off its own light arm (L + 0.09, law 18's letter)
 *       instead of the shared `--peer-ink-l` band. Does the two-band tin survive dark mode?
 */
import fs from "node:fs";

const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const MIN_SEP = 12;
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const unlin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function srgbToOklab([r, g, b]) { const R = lin(r), G = lin(g), B = lin(b); const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B), m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B), s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B); return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s]; }
function oklabToSrgb([L, A, B]) { const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3, m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3, s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3; return [unlin(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s), unlin(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s), unlin(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)]; }
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
function maxChroma(L, h) { let lo = 0, hi = 0.4; for (let i = 0; i < 36; i++) { const m = (lo + hi) / 2; if (inGamut(oklch(L, m, h))) lo = m; else hi = m; } return lo; }

const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const lightBlock = css.slice(css.indexOf("@theme {"), css.indexOf("\n.dark {"));
const darkBlockRaw = css.slice(css.indexOf("\n.dark {"));
const WANT = /--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;
const setOf = (block) => { const o = []; for (const h of block.matchAll(new RegExp(WANT.source, "g"))) o.push({ name: h[1], hex: h[2], ...lchOf(h[2]) }); return o; };
const RES = { all: setOf(css), light: setOf(lightBlock), dark: setOf(darkBlockRaw) };
const PAPER = { light: { bg: hslToRgb(48, 15, 98), card: hslToRgb(48, 12, 99) }, dark: { bg: hslToRgb(24, 8, 6), card: hslToRgb(24, 6, 7) } };

function arcs(reserved) {
  const b = new Array(3600).fill(false);
  for (const r of reserved) for (let k = 0; k < 3600; k++) if (gap(k / 10, r.h) < MIN_SEP) b[k] = true;
  const out = [];
  for (let k = 0; k < 3600; k++) { if (b[k]) continue; if (out.length && out.at(-1).end === (k - 1) / 10) out.at(-1).end = k / 10; else out.push({ start: k / 10, end: k / 10 }); }
  if (out.length > 1 && out[0].start === 0 && out.at(-1).end === 359.9) { out[0].start = out.at(-1).start - 360; out.pop(); }
  return out;
}
function placeIn(free, n) {
  const cand = []; for (const f of free) for (let h = f.start; h <= f.end + 1e-9; h += 0.25) cand.push(+(((h % 360) + 360) % 360).toFixed(2));
  const w = free.reduce((a, b) => (b.end - b.start > a.end - a.start ? b : a));
  const p = [+((((w.start + w.end) / 2 % 360) + 360) % 360).toFixed(2)];
  while (p.length < n) { let best = null, bd = -1; for (const c of cand) { const d = Math.min(...p.map((q) => gap(c, q))); if (d > bd) { bd = d; best = c; } } p.push(best); }
  for (let z = 0; z < 60; z++) for (let i = 0; i < p.length; i++) { const o = p.filter((_, j) => j !== i); let b = p[i], bd = Math.min(...o.map((q) => gap(p[i], q))); for (const c of cand) { if (gap(c, p[i]) > 10) continue; const d = Math.min(...o.map((q) => gap(c, q))); if (d > bd) { bd = d; b = c; } } p[i] = b; }
  return [...new Set(p)].sort((a, b) => a - b);
}
function armAt(theme, h, Lfix = null, floor = 4.5, targetC = 0.166) {
  const Ls = Lfix != null ? [Lfix] : (() => { const o = []; for (let L = 0.68; L >= 0.24; L -= 0.005) o.push(+L.toFixed(3)); return o; })();
  let best = null;
  for (const L of Ls) {
    const cap = Math.min(maxChroma(L, h), targetC);
    for (let C = cap; C >= 0.03; C -= 0.002) {
      const rgb = to8(oklch(L, C, h));
      if (["bg", "card"].every((t) => contrast(rgb, PAPER[theme][t]) >= floor)) { if (!best || C > best.C) best = { L, C: +C.toFixed(3), rgb, hex: hex8(rgb), h, aa: +Math.min(...["bg", "card"].map((t) => contrast(rgb, PAPER[theme][t]))).toFixed(2) }; break; }
    }
  }
  return best;
}
const stats = (set) => { const E = set.flatMap((x, i) => set.slice(i + 1).map((y) => dE(x.rgb, y.rgb))); E.sort((a, b) => a - b); return { min: E[0], under10: E.filter((e) => e < 0.1).length, n: E.length }; };

console.log("═══ W1 · THE LAW READ PER THEME");
for (const [k, r] of Object.entries(RES)) {
  const f = arcs(r), deg = f.reduce((a, x) => a + (x.end - x.start + 0.1), 0);
  console.log(`  reserved set "${k}": ${r.length} inks → FREE ${deg.toFixed(1)}deg in ${f.length} arcs  [${f.map((x) => `${x.start.toFixed(0)}–${x.end.toFixed(0)}`).join(", ")}]`);
}
console.log("\n  n sticks placeable per reading, with the min inter-stick HUE gap and the min ΔE of the arm:");
console.log("  reading | n  | min hue gap | min ΔE (that theme's arm) | pairs <0.10");
for (const reading of ["all", "light", "dark"]) {
  const f = arcs(RES[reading]);
  for (const n of [8, 12, 16]) {
    const hs = placeIn(f, n);
    const theme = reading === "dark" ? "dark" : "light";
    const set = hs.map((h) => (theme === "dark" ? armAt("dark", h, null, 4.5) : armAt("light", h))).filter(Boolean);
    const g = Math.min(...hs.flatMap((a, i) => hs.slice(i + 1).map((b) => gap(a, b))));
    const s = stats(set);
    console.log(`  ${reading.padEnd(7)} | ${String(n).padStart(2)} | ${g.toFixed(1).padStart(11)} | ${s.min.toFixed(3).padStart(25)} | ${s.under10}/${s.n}`);
  }
}

console.log("\n═══ W2 · THE DARK ARM AS A CRAYON-LAW STEP (L_light + 0.09) vs THE SHARED BAND (--peer-ink-l 0.8)");
const freeAll = arcs(RES.all);
for (const [label, six, step] of [["six hues x 2 bands, step 0.10", placeIn(freeAll, 6), 0.10], ["six hues x 2 bands, step 0.14", placeIn(freeAll, 6), 0.14]]) {
  for (const mode of ["shared band", "crayon-law step"]) {
    const set = [];
    for (const h of six) {
      const a = armAt("light", h);
      const b = armAt("light", h, +(a.L - step).toFixed(3));
      for (const base of [a, b]) {
        if (!base) continue;
        const L = mode === "shared band" ? 0.8 : +(base.L + 0.09).toFixed(3);
        const C = Math.min(0.166, maxChroma(L, h)), rgb = to8(oklch(L, C, h));
        set.push({ rgb, hex: hex8(rgb), C, aa: +Math.min(...["bg", "card"].map((t) => contrast(rgb, PAPER.dark[t]))).toFixed(2) });
      }
    }
    const s = stats(set);
    console.log(`  ${label} · dark arm = ${mode.padEnd(16)} → worst AA ${Math.min(...set.map((x) => x.aa)).toFixed(2)}:1 · min ΔE ${s.min.toFixed(3)} · pairs<0.10 ${s.under10}/${s.n}`);
  }
}

console.log("\n═══ THE BEST ARRANGEMENT FOUND — per-theme law + six hues x two bands + crayon-law dark arm");
const fL = arcs(RES.light), fD = arcs(RES.dark);
const sixL = placeIn(fL, 6);
const STEP = 0.12;
const tin = [];
for (const h of sixL) {
  for (const which of ["press", "light"]) {
    const a = which === "light" ? armAt("light", h) : null;
    const base = a ?? armAt("light", h);
    const L = which === "light" ? base.L : +(base.L - STEP).toFixed(3);
    const C = Math.min(0.166, maxChroma(L, h)), rgb = to8(oklch(L, C, h));
    const dL = +(L + 0.09).toFixed(3), dC = Math.min(0.166, maxChroma(dL, h)), drgb = to8(oklch(dL, dC, h));
    tin.push({ h, which, light: { L, C, rgb, hex: hex8(rgb), aa: +Math.min(...["bg", "card"].map((t) => contrast(rgb, PAPER.light[t]))).toFixed(2) }, dark: { L: dL, C: dC, rgb: drgb, hex: hex8(drgb), aa: +Math.min(...["bg", "card"].map((t) => contrast(drgb, PAPER.dark[t]))).toFixed(2) } });
  }
}
console.log("  hue   | lap | light hex  L     C     AA   | dark hex   L     C     AA   | Δh to nearest LIGHT reserved | Δh to nearest DARK reserved");
for (const t of tin) {
  const nl = Math.min(...RES.light.map((r) => gap(t.h, r.h))), nd = Math.min(...RES.dark.map((r) => gap(t.h, r.h)));
  console.log(`  ${String(t.h.toFixed(1)).padStart(5)} | ${t.which === "light" ? " 1 " : " 2 "} | ${t.light.hex} ${t.light.L.toFixed(3)} ${t.light.C.toFixed(3)} ${String(t.light.aa).padStart(5)} | ${t.dark.hex} ${t.dark.L.toFixed(3)} ${t.dark.C.toFixed(3)} ${String(t.dark.aa).padStart(5)} | ${nl.toFixed(1).padStart(28)} | ${nd.toFixed(1).padStart(27)}`);
}
for (const theme of ["light", "dark"]) {
  const s = stats(tin.map((t) => t[theme]));
  console.log(`  ${theme}: worst AA ${Math.min(...tin.map((t) => t[theme].aa)).toFixed(2)}:1 · min ΔE ${s.min.toFixed(3)} · pairs<0.10 ${s.under10}/${s.n} · mean C ${(tin.reduce((a, t) => a + t[theme].C, 0) / tin.length).toFixed(3)}`);
}
const minLawL = Math.min(...tin.map((t) => Math.min(...RES.light.map((r) => gap(t.h, r.h)))));
const minLawD = Math.min(...tin.map((t) => Math.min(...RES.dark.map((r) => gap(t.h, r.h)))));
console.log(`  family law: worst Δh ${minLawL.toFixed(1)}deg light · ${minLawD.toFixed(1)}deg dark (floor ${MIN_SEP}) → ${Math.min(minLawL, minLawD) >= MIN_SEP ? "GREEN" : "RED"}`);
fs.writeFileSync(new URL("../out/tin-best.json", import.meta.url), JSON.stringify({ STEP, sixL, tin }, null, 2));
