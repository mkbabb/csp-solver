#!/usr/bin/env node
/**
 * PAL-TIN — THE TIN AS THE NUMBERS ACTUALLY CUT IT.
 *
 * The three earlier probes ruled out the family's first shape:
 *   · the law read per theme does NOT widen the wheel (a stick keeps ONE hue across both arms,
 *     so it must clear the UNION — `tin-widen.mjs` W1: hue 346.9 is 12.1deg off every light ink
 *     and 0.8deg off a dark one);
 *   · twelve cuts in 147.3deg of free arc put five sticks in one cyan arc: min ΔE 0.024, which
 *     is two players who look the same (`tin-arms.mjs` B);
 *   · letting the optimiser pick L collapses the two bands onto one lightness (min ΔE 0.000 in
 *     dark, `tin-widen.mjs` W2) — the bands must be PINNED, not derived.
 *
 * So: SIX HUES cut into the wheel's gaps, TWO PINNED LIGHTNESS BANDS per theme. Twelve sticks,
 * and the second band IS the sharing axis — the same pencil pressed harder — rather than a
 * thirteenth colour nobody has room for.
 *
 *   node tin-final.mjs [--json out.json]
 */
import fs from "node:fs";
import process from "node:process";

const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const MIN_SEP = 12;
/** The pinned bands. Light: the ink sits UNDER the paper, so more pressure is DARKER.
 *  Dark: the wax glows, so more pressure is LIGHTER (the crayon doctrine, index.css:165-169). */
const BAND = { light: { soft: 0.545, firm: 0.415 }, dark: { soft: 0.720, firm: 0.860 } };
const TARGET_C = 0.166; // the mean crayon chroma (R2 §7)
/** AXIS=L  — the second lap is a lightness step (away from the paper: more graphite).
 *  AXIS=C  — the second lap is a CHROMA step at one lightness (more pigment, same pressure
 *            of line). Set by env; both are measured and the record reports both. */
const AXIS = process.env.AXIS ?? "L";
const C_SOFT = 0.075; // the chroma arm's soft stick

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
const over = (fg, bg, a) => fg.map((v, k) => Math.round(v * a + bg[k] * (1 - a)));
function maxChroma(L, h) { let lo = 0, hi = 0.4; for (let i = 0; i < 36; i++) { const m = (lo + hi) / 2; if (inGamut(oklch(L, m, h))) lo = m; else hi = m; } return lo; }

const css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8");
const WANT = /--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;
const reserved = []; for (const h of css.matchAll(WANT)) reserved.push({ name: h[1], hex: h[2], ...lchOf(h[2]) });
const PAPER = { light: { bg: hslToRgb(48, 15, 98), card: hslToRgb(48, 12, 99) }, dark: { bg: hslToRgb(24, 8, 6), card: hslToRgb(24, 6, 7) } };

/* the free arcs, union reading */
const blocked = new Array(3600).fill(false);
for (const r of reserved) for (let k = 0; k < 3600; k++) if (gap(k / 10, r.h) < MIN_SEP) blocked[k] = true;
const free = [];
for (let k = 0; k < 3600; k++) { if (blocked[k]) continue; if (free.length && free.at(-1).end === (k - 1) / 10) free.at(-1).end = k / 10; else free.push({ start: k / 10, end: k / 10 }); }
if (free.length > 1 && free[0].start === 0 && free.at(-1).end === 359.9) { free[0].start = free.at(-1).start - 360; free.pop(); }
const cand = []; for (const f of free) for (let h = f.start; h <= f.end + 1e-9; h += 0.25) cand.push(+(((h % 360) + 360) % 360).toFixed(2));
function placeN(n) {
  const w = free.reduce((a, b) => (b.end - b.start > a.end - a.start ? b : a));
  const p = [+((((w.start + w.end) / 2 % 360) + 360) % 360).toFixed(2)];
  while (p.length < n) { let best = null, bd = -1; for (const c of cand) { const d = Math.min(...p.map((q) => gap(c, q))); if (d > bd) { bd = d; best = c; } } p.push(best); }
  for (let z = 0; z < 80; z++) for (let i = 0; i < p.length; i++) { const o = p.filter((_, j) => j !== i); let b = p[i], bd = Math.min(...o.map((q) => gap(p[i], q))); for (const c of cand) { if (gap(c, p[i]) > 12) continue; const d = Math.min(...o.map((q) => gap(c, q))); if (d > bd) { bd = d; b = c; } } p[i] = b; }
  return [...new Set(p)].sort((a, b) => a - b);
}

const HUES = placeN(6);
const pressures = { ring: 0.55, joinTrace: 0.95, rejoinTrace: 0.65, leaveTrace: 0.45 };
function stick(h, theme, band) {
  const L = AXIS === "C" ? BAND[theme].soft : BAND[theme][band];
  const C = AXIS === "C"
    ? Math.min(band === "soft" ? C_SOFT : TARGET_C, maxChroma(L, h))
    : Math.min(TARGET_C, maxChroma(L, h));
  const rgb = to8(oklch(L, C, h));
  const out = { h, theme, band, L, C: +C.toFixed(3), rgb, hex: hex8(rgb) };
  out.bg = +contrast(rgb, PAPER[theme].bg).toFixed(2);
  out.card = +contrast(rgb, PAPER[theme].card).toFixed(2);
  for (const [k, a] of Object.entries(pressures)) out[k] = +Math.min(...["bg", "card"].map((t) => contrast(over(rgb, PAPER[theme][t], a), PAPER[theme][t]))).toFixed(2);
  return out;
}

const TIN = [];
HUES.forEach((h, i) => { for (const band of ["soft", "firm"]) TIN.push({ stick: TIN.length + 1, hue: h, band, light: stick(h, "light", band), dark: stick(h, "dark", band) }); });

console.log(`═══ THE TIN — ${HUES.length} hues x 2 pressures = ${TIN.length} pencils`);
console.log(`hues: ${HUES.map((h) => h.toFixed(1)).join(", ")}  ·  min inter-hue gap ${Math.min(...HUES.flatMap((a, i) => HUES.slice(i + 1).map((b) => gap(a, b)))).toFixed(1)}deg`);
console.log(`bands: light soft L ${BAND.light.soft} / firm L ${BAND.light.firm} · dark soft L ${BAND.dark.soft} / firm L ${BAND.dark.firm}`);
console.log("\n  # | hue   | band | light hex  C     bg    card  ring@.55 | dark hex   C     bg    card  ring@.55 | Δh nearest reserved");
for (const t of TIN) {
  const n = reserved.map((r) => ({ ...r, d: gap(t.hue, r.h) })).sort((a, b) => a.d - b.d)[0];
  console.log(`  ${String(t.stick).padStart(2)}| ${String(t.hue.toFixed(1)).padStart(5)} | ${t.band.padEnd(4)} | ${t.light.hex} ${t.light.C.toFixed(3)} ${String(t.light.bg).padStart(5)} ${String(t.light.card).padStart(5)} ${String(t.light.ring).padStart(8)} | ${t.dark.hex} ${t.dark.C.toFixed(3)} ${String(t.dark.bg).padStart(5)} ${String(t.dark.card).padStart(5)} ${String(t.dark.ring).padStart(8)} | ${n.name} ${n.d.toFixed(1)}deg`);
}

for (const theme of ["light", "dark"]) {
  const set = TIN.map((t) => t[theme]);
  const E = set.flatMap((x, i) => set.slice(i + 1).map((y) => ({ i, j: i + 1, e: dE(x.rgb, y.rgb) }))).sort((a, b) => a.e - b.e);
  const sameHue = TIN.filter((_, i) => i % 2 === 0).map((_, k) => dE(set[2 * k].rgb, set[2 * k + 1].rgb));
  console.log(`\n  ${theme.toUpperCase()}: worst AA ${Math.min(...set.map((s) => Math.min(s.bg, s.card))).toFixed(2)}:1 · worst ring@0.55 ${Math.min(...set.map((s) => s.ring)).toFixed(2)}:1 · worst trace@0.95 ${Math.min(...set.map((s) => s.joinTrace)).toFixed(2)}:1`);
  console.log(`    min pairwise ΔE ${E[0].e.toFixed(3)} · pairs<0.10 ${E.filter((x) => x.e < 0.1).length}/${E.length} · median ${E[Math.floor(E.length / 2)].e.toFixed(3)}`);
  console.log(`    SAME-PENCIL step ΔE (soft↔firm): ${sameHue.map((e) => e.toFixed(3)).join(", ")} — worst ${Math.min(...sameHue).toFixed(3)}`);
  /* THE SHARING LAW, stated as a clustering condition: a pencil and its own second lap must be
     nearer to each other than either is to ANY other pencil. Anything else and the sharer looks
     like a stranger rather than like the same stick pressed harder. */
  let broken = 0, worstMargin = Infinity;
  for (let k = 0; k < set.length; k += 2) {
    const own = dE(set[k].rgb, set[k + 1].rgb);
    const other = Math.min(...set.filter((_, j) => j !== k && j !== k + 1).flatMap((o) => [dE(set[k].rgb, o.rgb), dE(set[k + 1].rgb, o.rgb)]));
    if (own >= other) broken++;
    worstMargin = Math.min(worstMargin, other - own);
  }
  console.log(`    THE SHARING LAW (own lap nearer than any other pencil): ${broken === 0 ? "HOLDS" : `BREAKS on ${broken}/${set.length / 2} pencils`} · worst margin ${worstMargin.toFixed(3)}`);
  console.log(`    mean C ${(set.reduce((a, s) => a + s.C, 0) / set.length).toFixed(3)} (crayon 0.166, incumbent walk 0.11)`);
}

const worstLaw = Math.min(...TIN.map((t) => Math.min(...reserved.map((r) => gap(t.hue, r.h)))));
console.log(`\n  FAMILY LAW: worst Δh to any of the ${reserved.length} reserved inks = ${worstLaw.toFixed(1)}deg (floor ${MIN_SEP}) → ${worstLaw >= MIN_SEP ? "GREEN by construction" : "RED"}`);
console.log(`  ANCHOR TEST: is any stick a reserved ink? ${TIN.some((t) => reserved.some((r) => r.hex.toLowerCase() === t.light.hex || r.hex.toLowerCase() === t.dark.hex)) ? "YES — a stick IS an anchor" : "no — every stick is a pen BESIDE the anchors"}`);

if (process.argv.includes("--json")) {
  const out = process.argv[process.argv.indexOf("--json") + 1];
  fs.writeFileSync(out, JSON.stringify({ MIN_SEP, BAND, TARGET_C, HUES, free, TIN, reservedCount: reserved.length }, null, 2));
  console.log(`\nbanked → ${out}`);
  const tokens = TIN.map((t, i) => `  --color-peer-${i + 1}: ${t.light.hex}; /* hue ${t.hue.toFixed(1)} ${t.band} · ${t.light.bg}:1 bg, ${t.light.card}:1 card */`).join("\n");
  const dtokens = TIN.map((t, i) => `  --color-peer-${i + 1}: ${t.dark.hex}; /* ${t.dark.bg}:1 bg, ${t.dark.card}:1 card */`).join("\n");
  fs.writeFileSync(new URL("../proto/tin-tokens.css", import.meta.url), `:root {\n${tokens}\n}\n.dark {\n${dtokens}\n}\n`);
  console.log(`banked → proto/tin-tokens.css`);
}
