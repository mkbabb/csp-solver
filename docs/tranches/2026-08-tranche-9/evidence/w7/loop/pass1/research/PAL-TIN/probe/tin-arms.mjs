#!/usr/bin/env node
/**
 * PAL-TIN — THE ARMS, measured. Everything the family's forks turn on, in one report.
 *
 * Reads the REAL stylesheet for the reserved set and the papers; re-implements no product
 * formula it can read (the walk's step and chroma come out of playerIdentity.ts).
 *
 *  A · the wheel's capacity   — free arc at MIN_SEP; the honest tin size (sweep N)
 *  B · perceptual separation  — OKLab ΔE between sticks, which hue degrees do NOT measure
 *  C · the 3:1 non-text floor at the DRAWN pressures, tin vs the incumbent walk (control)
 *  D · arm (b1) the lightness step, in the SAFE direction (more pressure, away from the paper)
 *  E · fork (c) six anchors × two lightness bands
 *  F · the crayon dark law, as the crayons themselves actually obey it
 */
import fs from "node:fs";
import process from "node:process";

const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const MIN_SEP = 12;

/* ── colour ────────────────────────────────────────────────────────────── */
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
function lchOf(hex) {
  const [L, A, B] = srgbToOklab(hexToRgb(hex).map((v) => v / 255));
  let h = (Math.atan2(B, A) * 180) / Math.PI; if (h < 0) h += 360;
  return { L, C: Math.hypot(A, B), h };
}
function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s, hp = h / 60, x = c * (1 - Math.abs((hp % 2) - 1));
  const t = hp < 1 ? [c, x, 0] : hp < 2 ? [x, c, 0] : hp < 3 ? [0, c, x] : hp < 4 ? [0, x, c] : hp < 5 ? [x, 0, c] : [c, 0, x];
  const m = l - c / 2; return t.map((v) => Math.round((v + m) * 255));
}
const gap = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
const dE = (a, b) => { const A = srgbToOklab(a.map((v) => v / 255)), B = srgbToOklab(b.map((v) => v / 255)); return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]); };
const over = (fg, bg, a) => fg.map((v, k) => Math.round(v * a + bg[k] * (1 - a)));

/* ── sources ───────────────────────────────────────────────────────────── */
const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const pid = fs.readFileSync(`${ROOT}/src/games/shared/playerIdentity.ts`, "utf8");
const wm = pid.match(/oklch\(var\(--peer-ink-l\)\s+([\d.]+)\s+\$\{\(\(index\s*\*\s*([\d.]+)\)\s*%\s*360\)/);
const WALK = { C: +wm[1], STEP: +wm[2] };
const WANT = /--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;
const reserved = [];
for (const hit of css.matchAll(WANT)) reserved.push({ name: hit[1], hex: hit[2], ...lchOf(hit[2]) });
const PAPER = { light: { bg: hslToRgb(48, 15, 98), card: hslToRgb(48, 12, 99) }, dark: { bg: hslToRgb(24, 8, 6), card: hslToRgb(24, 6, 7) } };
const PEER_L = { light: +css.match(/--peer-ink-l:\s*([\d.]+)/)[1], dark: +css.slice(css.indexOf("\n.dark {")).match(/--peer-ink-l:\s*([\d.]+)/)[1] };

/* ── the wheel ─────────────────────────────────────────────────────────── */
const blocked = new Array(3600).fill(false);
for (const r of reserved) for (let k = 0; k < 3600; k++) if (gap(k / 10, r.h) < MIN_SEP) blocked[k] = true;
const free = [];
for (let k = 0; k < 3600; k++) {
  if (blocked[k]) continue;
  if (free.length && free.at(-1).end === (k - 1) / 10) free.at(-1).end = k / 10; else free.push({ start: k / 10, end: k / 10 });
}
if (free.length > 1 && free[0].start === 0 && free.at(-1).end === 359.9) { free[0].start = free.at(-1).start - 360; free.pop(); }
const freeDeg = free.reduce((a, f) => a + (f.end - f.start + 0.1), 0);
const candidates = [];
for (const f of free) for (let h = f.start; h <= f.end + 1e-9; h += 0.25) candidates.push(+(((h % 360) + 360) % 360).toFixed(2));

function placeN(n) {
  const widest = free.reduce((a, b) => (b.end - b.start > a.end - a.start ? b : a));
  const picked = [+((((widest.start + widest.end) / 2 % 360) + 360) % 360).toFixed(2)];
  while (picked.length < n) {
    let best = null, bestD = -1;
    for (const c of candidates) { const d = Math.min(...picked.map((p) => gap(c, p))); if (d > bestD) { bestD = d; best = c; } }
    picked.push(best);
  }
  for (let pass = 0; pass < 60; pass++)
    for (let i = 0; i < picked.length; i++) {
      const others = picked.filter((_, j) => j !== i);
      let best = picked[i], bestD = Math.min(...others.map((o) => gap(picked[i], o)));
      for (const c of candidates) { if (gap(c, picked[i]) > 10) continue; const d = Math.min(...others.map((o) => gap(c, o))); if (d > bestD) { bestD = d; best = c; } }
      picked[i] = best;
    }
  return [...new Set(picked)].sort((a, b) => a - b);
}
const minSpread = (hs) => Math.min(...hs.flatMap((a, i) => hs.slice(i + 1).map((b) => gap(a, b))));

/* ── arms ──────────────────────────────────────────────────────────────── */
function maxChroma(L, h) { let lo = 0, hi = 0.4; for (let i = 0; i < 36; i++) { const m = (lo + hi) / 2; if (inGamut(oklch(L, m, h))) lo = m; else hi = m; } return lo; }
/**
 * Pick (L,C) for one arm. `floors` is a list of {alpha, min} the colour must clear on BOTH
 * papers of that theme — opaque AA 4.5 plus whatever drawn pressures the family must survive.
 * Maximises chroma (kinship with the wax), searching L across the theme's usable band.
 */
function arm(theme, h, floors, targetC = 0.166) {
  const band = theme === "light" ? { from: 0.68, to: 0.22, d: -0.005 } : { from: 0.96, to: 0.55, d: -0.005 };
  let best = null;
  for (let L = band.from; theme === "light" ? L >= band.to : L >= band.to; L += band.d) {
    const cap = Math.min(maxChroma(L, h), targetC);
    for (let C = cap; C >= 0.04; C -= 0.002) {
      const rgb = to8(oklch(L, C, h));
      const ok = floors.every((f) =>
        [PAPER[theme].bg, PAPER[theme].card].every((p) => contrast(f.alpha === 1 ? rgb : over(rgb, p, f.alpha), p) >= f.min));
      if (ok) { if (!best || C > best.C) best = { L: +L.toFixed(3), C: +C.toFixed(3), rgb, hex: hex8(rgb) }; break; }
    }
  }
  if (best) {
    for (const t of ["bg", "card"]) best[t] = +contrast(best.rgb, PAPER[theme][t]).toFixed(2);
    for (const a of [0.55, 0.95, 0.65, 0.45])
      best[`p${a}`] = +Math.min(...["bg", "card"].map((t) => contrast(over(best.rgb, PAPER[theme][t], a), PAPER[theme][t]))).toFixed(2);
  }
  return best;
}

const AA = [{ alpha: 1, min: 4.5 }];
const AA_RING = [{ alpha: 1, min: 4.5 }, { alpha: 0.55, min: 3 }];

/* ═══ A · capacity ═════════════════════════════════════════════════════ */
console.log(`═══ A · THE WHEEL'S CAPACITY (MIN_SEP ${MIN_SEP}deg to ${reserved.length} reserved inks, both theme arms)`);
console.log(`FORBIDDEN ${(360 - freeDeg).toFixed(1)}deg (${((360 - freeDeg) / 3.6).toFixed(0)}% of the wheel) · FREE ${freeDeg.toFixed(1)}deg in ${free.length} arcs`);
for (const f of free) console.log(`  arc ${String(f.start.toFixed(1)).padStart(6)} … ${String(f.end.toFixed(1)).padStart(5)}  width ${(f.end - f.start + 0.1).toFixed(1)}deg`);
console.log(`\n  n | min inter-stick hue gap | verdict at a 12deg self-separation floor`);
for (let n = 5; n <= 16; n++) {
  const hs = placeN(n), s = minSpread(hs);
  console.log(`  ${String(n).padStart(2)} | ${s.toFixed(1)}deg${" ".repeat(19)}| ${s >= 12 ? "fits" : "CROWDED — two sticks closer to each other than the law allows to an anchor"}`);
}

const TIN = placeN(12);
console.log(`\nTHE TWELVE (hue): ${TIN.map((h) => h.toFixed(1)).join(", ")}`);
console.log(`  arc occupancy: ${free.map((f) => `${f.start.toFixed(0)}–${f.end.toFixed(0)} holds ${TIN.filter((h) => { const x = h > 180 && f.start < 0 ? h - 360 : h; return x >= f.start - 0.01 && x <= f.end + 0.01; }).length}`).join(" · ")}`);

/* ═══ B + C · the arms, AA-only and AA+ring ════════════════════════════ */
for (const [label, floors] of [["AA ONLY (4.5:1 opaque, both papers)", AA], ["AA + THE RING (4.5:1 opaque AND 3:1 at stroke-opacity 0.55)", AA_RING]]) {
  console.log(`\n═══ B/C · THE TIN UNDER ${label}`);
  const sticks = TIN.map((h, i) => ({ i: i + 1, h, light: arm("light", h, floors), dark: arm("dark", h, floors) }));
  const dead = sticks.filter((s) => !s.light || !s.dark);
  if (dead.length) console.log(`  ${dead.length} stick(s) have NO arm under this floor: ${dead.map((s) => s.h.toFixed(1)).join(", ")}`);
  const live = sticks.filter((s) => s.light && s.dark);
  console.log("  stick | hue   | light hex  L     C     bg    card  @0.55 | dark hex   L     C     bg    card  @0.55");
  for (const s of live)
    console.log(`    ${String(s.i).padStart(2)}  | ${String(s.h.toFixed(1)).padStart(5)} | ${s.light.hex} ${s.light.L.toFixed(3)} ${s.light.C.toFixed(3)} ${String(s.light.bg).padStart(5)} ${String(s.light.card).padStart(5)} ${String(s.light["p0.55"]).padStart(5)} | ${s.dark.hex} ${s.dark.L.toFixed(3)} ${s.dark.C.toFixed(3)} ${String(s.dark.bg).padStart(5)} ${String(s.dark.card).padStart(5)} ${String(s.dark["p0.55"]).padStart(5)}`);
  if (!live.length) continue;
  for (const theme of ["light", "dark"]) {
    const E = live.flatMap((a, i) => live.slice(i + 1).map((b) => ({ a: a.i, b: b.i, e: dE(a[theme].rgb, b[theme].rgb) })));
    E.sort((x, y) => x.e - y.e);
    console.log(`  ΔE(OKLab) ${theme}: worst pair ${E[0].a}↔${E[0].b} = ${E[0].e.toFixed(3)} · 2nd ${E[1].a}↔${E[1].b} ${E[1].e.toFixed(3)} · 3rd ${E[2].a}↔${E[2].b} ${E[2].e.toFixed(3)} · median ${E[Math.floor(E.length / 2)].e.toFixed(3)}`);
    console.log(`    pairs under ΔE 0.10 = ${E.filter((x) => x.e < 0.1).length}/${E.length}  ·  under 0.15 = ${E.filter((x) => x.e < 0.15).length}/${E.length}`);
  }
  console.log(`  worst AA: light ${Math.min(...live.map((s) => Math.min(s.light.bg, s.light.card))).toFixed(2)}:1 · dark ${Math.min(...live.map((s) => Math.min(s.dark.bg, s.dark.card))).toFixed(2)}:1`);
  console.log(`  worst @0.55 (the cursor ring): light ${Math.min(...live.map((s) => s.light["p0.55"])).toFixed(2)}:1 · dark ${Math.min(...live.map((s) => s.dark["p0.55"])).toFixed(2)}:1`);
  console.log(`  worst @0.95/0.65/0.45 (the join trace): ${[0.95, 0.65, 0.45].map((a) => `${a}→${Math.min(...live.flatMap((s) => [s.light[`p${a}`], s.dark[`p${a}`]])).toFixed(2)}:1`).join(" · ")}`);
  console.log(`  chroma mean: light ${(live.reduce((a, s) => a + s.light.C, 0) / live.length).toFixed(3)} · dark ${(live.reduce((a, s) => a + s.dark.C, 0) / live.length).toFixed(3)}  (mean crayon 0.166, walk ${WALK.C})`);
  if (floors === AA) globalThis.__tinAA = live;
  else globalThis.__tinRing = live;
}

/* ═══ C-control · the INCUMBENT walk at the drawn pressures ════════════ */
console.log(`\n═══ C-control · THE INCUMBENT WALK at the drawn pressures (the standing estate, first 16 indices)`);
for (const theme of ["light", "dark"]) {
  const rows = [];
  for (let i = 0; i < 16; i++) {
    const rgb = to8(oklch(PEER_L[theme], WALK.C, (i * WALK.STEP) % 360));
    for (const t of ["bg", "card"]) for (const a of [1, 0.55, 0.95, 0.65, 0.45])
      rows.push({ i, a, c: contrast(a === 1 ? rgb : over(rgb, PAPER[theme][t], a), PAPER[theme][t]) });
  }
  for (const a of [1, 0.55, 0.95, 0.65, 0.45]) {
    const s = rows.filter((r) => r.a === a);
    const worst = s.reduce((x, y) => (y.c < x.c ? y : x));
    const floor = a === 1 ? 4.5 : 3;
    console.log(`  ${theme} @${a === 1 ? "opaque" : a}: worst ${worst.c.toFixed(2)}:1 at index ${worst.i} · floor ${floor} → ${worst.c >= floor ? "PASS" : "FAIL"} (${s.filter((r) => r.c < floor).length}/${s.length} readings under floor)`);
  }
}

/* ═══ D · arm (b1) the lightness step, SAFE direction ══════════════════ */
const base = globalThis.__tinAA;
console.log(`\n═══ D · ARM (b1) — THE SECOND LAP as MORE PRESSURE (light goes darker, dark goes lighter: away from the paper, so AA only improves)`);
for (const STEP of [0.06, 0.09, 0.12, 0.15]) {
  const lap2 = base.map((s) => ({
    i: s.i,
    light: (() => { const L = s.light.L - STEP, C = Math.min(s.light.C, maxChroma(L, s.h)), rgb = to8(oklch(L, C, s.h)); return { rgb, L, C, aa: Math.min(contrast(rgb, PAPER.light.bg), contrast(rgb, PAPER.light.card)), e: dE(rgb, s.light.rgb) }; })(),
    dark: (() => { const L = Math.min(0.97, s.dark.L + STEP), C = Math.min(s.dark.C, maxChroma(L, s.h)), rgb = to8(oklch(L, C, s.h)); return { rgb, L, C, aa: Math.min(contrast(rgb, PAPER.dark.bg), contrast(rgb, PAPER.dark.card)), e: dE(rgb, s.dark.rgb) }; })(),
  }));
  const aaW = Math.min(...lap2.flatMap((s) => [s.light.aa, s.dark.aa]));
  const eW = Math.min(...lap2.flatMap((s) => [s.light.e, s.dark.e]));
  const eM = lap2.flatMap((s) => [s.light.e, s.dark.e]).sort((a, b) => a - b)[lap2.length];
  // the DANGEROUS collision: does a lap-two stick now read as a DIFFERENT lap-one stick?
  const cross = Math.min(...lap2.flatMap((s) => base.filter((o) => o.i !== s.i).flatMap((o) => [dE(s.light.rgb, o.light.rgb), dE(s.dark.rgb, o.dark.rgb)])));
  console.log(`  step ${STEP.toFixed(2)}: worst AA ${aaW.toFixed(2)}:1 (${lap2.flatMap((s) => [s.light.aa, s.dark.aa]).filter((x) => x < 4.5).length}/24 under 4.5) · ΔE(lap1,lap2) worst ${eW.toFixed(3)} median ${eM.toFixed(3)} · nearest OTHER stick ΔE ${cross.toFixed(3)} ${cross < eW ? "← A SHARER READS AS SOMEBODY ELSE" : ""}`);
}

/* ═══ E · fork (c) — six anchors × two lightness bands ═════════════════ */
console.log(`\n═══ E · FORK (c) — SIX HUES × TWO LIGHTNESS BANDS (the whole tin derived as bands, not twelve cuts)`);
const SIX = placeN(6);
console.log(`  six hues: ${SIX.map((h) => h.toFixed(1)).join(", ")} · min gap ${minSpread(SIX).toFixed(1)}deg`);
for (const STEP of [0.10, 0.14, 0.18]) {
  const pairs = SIX.map((h) => {
    const a = arm("light", h, AA), b = arm("dark", h, AA);
    const a2 = (() => { const L = a.L - STEP, C = Math.min(a.C, maxChroma(L, h)), rgb = to8(oklch(L, C, h)); return { rgb, aa: Math.min(contrast(rgb, PAPER.light.bg), contrast(rgb, PAPER.light.card)), e: dE(rgb, a.rgb) }; })();
    const b2 = (() => { const L = Math.min(0.97, b.L + STEP), C = Math.min(b.C, maxChroma(L, h)), rgb = to8(oklch(L, C, h)); return { rgb, aa: Math.min(contrast(rgb, PAPER.dark.bg), contrast(rgb, PAPER.dark.card)), e: dE(rgb, b.rgb) }; })();
    return { h, a, b, a2, b2 };
  });
  const all = pairs.flatMap((p) => [p.a.rgb, p.a2.rgb]);
  const E = all.flatMap((x, i) => all.slice(i + 1).map((y) => dE(x, y)));
  console.log(`  step ${STEP.toFixed(2)}: 12 colours · worst AA light ${Math.min(...pairs.map((p) => Math.min(p.a.bg, p.a.card, p.a2.aa))).toFixed(2)}:1 · worst pairwise ΔE across all twelve ${Math.min(...E).toFixed(3)} · band ΔE (same hue) worst ${Math.min(...pairs.map((p) => p.a2.e)).toFixed(3)}`);
}

/* ═══ F · the crayon dark law, as the crayons obey it ══════════════════ */
console.log(`\n═══ F · THE CRAYON DARK LAW, measured on the crayons themselves (law 18: hue ±3, L +0.06…0.10)`);
const lightBlock = css.slice(css.indexOf("@theme {"), css.indexOf("\n.dark {"));
const darkBlock = css.slice(css.indexOf("\n.dark {"));
for (const name of ["crayon-green", "crayon-orange", "crayon-rose", "crayon-blue", "crayon-gold", "user-ink", "progress-ink"]) {
  const l = lightBlock.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  const d = darkBlock.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!l || !d) continue;
  const L = lchOf(l[1]), D = lchOf(d[1]);
  console.log(`  ${name.padEnd(14)} L ${L.L.toFixed(3)} → ${D.L.toFixed(3)} (Δ ${(D.L - L.L >= 0 ? "+" : "") + (D.L - L.L).toFixed(3)}) · C ${L.C.toFixed(3)} → ${D.C.toFixed(3)} · Δh ${gap(L.h, D.h).toFixed(1)}deg`);
}
console.log(`  --peer-ink-l  L ${PEER_L.light.toFixed(3)} → ${PEER_L.dark.toFixed(3)} (Δ +${(PEER_L.dark - PEER_L.light).toFixed(3)}) · C held ${WALK.C} · Δh 0deg   ← the peer BAND is not a crayon step`);

if (process.argv.includes("--json")) {
  const out = process.argv[process.argv.indexOf("--json") + 1];
  fs.writeFileSync(out, JSON.stringify({ MIN_SEP, freeDeg, free, TIN, tinAA: globalThis.__tinAA, tinRing: globalThis.__tinRing, PAPER, PEER_L, WALK }, null, 2));
  console.log(`\nbanked → ${out}`);
}
