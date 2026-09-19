/**
 * PAL-WALK · THE WALK OVER OPEN ARCS — the family's own source, written so an instrument can
 * read it exactly the way `instruments-family-law.mjs` reads `playerIdentity.ts`.
 *
 * NOTHING HERE IS CHOSEN. The reserved set is the 29 literal ink hexes in `index.css`, read at
 * run time with the SAME regex the r0 instrument uses; the arc half-width is the family law's
 * own MIN_SEP (12deg) and not a taste number; the chroma is the MEAN CRAYON CHROMA re-derived
 * from the five wax hexes in the same file. Change a hex in `index.css` and every number below
 * moves with it.
 *
 * The walk: positions live on the OPEN SET (the wheel minus every reserved arc), stepping by
 * the golden angle modulo the open arc's own length, then mapped back to a real hue. The map is
 * measure-preserving, so an arclength gap is a LOWER BOUND on the hue gap it produces.
 */
import fs from "fs";

export const ROOT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";

/** The family law's floor, and the arc half-width DERIVED from it. */
export const GUARD_DEG = 12;
/** The golden angle, unchanged from `playerIdentity.ts:69`. */
export const STEP_DEG = 137.5;

// ── colour maths (sRGB <-> OKLab), the r0 instrument's own, plus the inverse ───────────────
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const unlin = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function srgbToOklch(hexOrRgb) {
  let r, g, b;
  if (Array.isArray(hexOrRgb)) [r, g, b] = hexOrRgb.map((v) => lin(v / 255));
  else {
    const n = parseInt(hexOrRgb.slice(1), 16);
    [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  }
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  let h = (Math.atan2(B, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C: Math.hypot(A, B), h };
}

/** oklch -> linear sRGB, UNCLAMPED (so the gamut test can see how far out it is). */
export function oklchToLinear(L, C, hDeg) {
  const a = C * Math.cos((hDeg * Math.PI) / 180);
  const b = C * Math.sin((hDeg * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
export const inGamut = (L, C, h) =>
  oklchToLinear(L, C, h).every((v) => v >= -1e-4 && v <= 1 + 1e-4);
export function oklchToSrgb255(L, C, h) {
  return oklchToLinear(L, C, h).map((v) =>
    Math.round(255 * unlin(Math.min(1, Math.max(0, v)))),
  );
}
/** WCAG relative luminance from 0-255 sRGB. */
export const relLum = ([r, g, b]) =>
  0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
export const contrast = (a, b) => {
  const [x, y] = [relLum(a), relLum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
export const gap = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

// ── THE RESERVED SET, read from index.css (the r0 instrument's own regex) ──────────────────
const WANT =
  /--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;

export function readReserved(css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8")) {
  const out = [];
  for (const hit of css.matchAll(WANT))
    out.push({ name: hit[1], hex: hit[2], ...srgbToOklch(hit[2]) });
  return out;
}

/** The mean crayon chroma, re-derived from the five LIGHT wax hexes (index.css:170-176). */
export function meanCrayonChroma(css = fs.readFileSync(`${ROOT}/src/assets/index.css`, "utf8")) {
  const wax = [...css.matchAll(/--color-crayon-(\w+):\s*(#[0-9a-fA-F]{6})/g)].slice(0, 5);
  const cs = wax.map((w) => srgbToOklch(w[2]).C);
  return { hexes: wax.map((w) => w[2]), chroma: cs.reduce((a, b) => a + b, 0) / cs.length };
}

// ── THE ARCS ──────────────────────────────────────────────────────────────────────────────
/** Union of [h-GUARD, h+GUARD] over every reserved hue, wrapped, merged, sorted. */
export function reservedArcs(hues, guard = GUARD_DEG) {
  const raw = [];
  for (const h of hues) {
    let a = h - guard,
      b = h + guard;
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

export function openArcs(arcs) {
  const open = [];
  let c = 0;
  for (const [a, b] of arcs) {
    if (a > c + 1e-9) open.push([c, a]);
    c = Math.max(c, b);
  }
  if (c < 360 - 1e-9) open.push([c, 360]);
  return open;
}

export const measure = (ivs) => ivs.reduce((s, [a, b]) => s + (b - a), 0);

/** position on the open set (0..L) -> real hue */
export function positionToHue(p, open) {
  let rest = p;
  for (const [a, b] of open) {
    const w = b - a;
    if (rest < w) return a + rest;
    rest -= w;
  }
  const last = open[open.length - 1];
  return last[1] - 1e-9;
}

/**
 * THE WALK. `variant`:
 *   "literal" — the estate's own 137.5deg of arclength, modulo the open arc (the charter's form)
 *   "scaled"  — the golden FRACTION of the open arc (L / phi^2), the same low-discrepancy
 *               sequence the full-circle walk is, re-expressed on a shorter circle
 */
export function buildWalk(css, variant = "literal", guard = GUARD_DEG) {
  const reserved = readReserved(css);
  const arcs = reservedArcs(
    reserved.map((r) => r.h),
    guard,
  );
  const open = openArcs(arcs);
  const L = measure(open);
  const PHI2 = (3 - Math.sqrt(5)) / 2; // 1/phi^2 = 0.3819660113
  const step = variant === "scaled" ? L * PHI2 : STEP_DEG;
  const hueAt = (i) => positionToHue(((i * step) % L + L) % L, open);
  const posAt = (i) => ((i * step) % L + L) % L;
  return { reserved, arcs, open, L, step, hueAt, posAt, variant, guard };
}

/** The family's `inkFor`, in `playerIdentity.ts`'s own shape. */
export const CHROMA = 0.166;
export function inkForFactory(walk) {
  return (index) => ({
    "--color-user-ink": `oklch(var(--peer-ink-l) ${CHROMA} ${walk.hueAt(index).toFixed(1)}deg)`,
  });
}
