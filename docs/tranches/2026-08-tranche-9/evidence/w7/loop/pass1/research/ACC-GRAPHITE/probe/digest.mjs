/**
 * digest.mjs — the census, reduced to the figures the .md cites.
 *
 * Three questions the JSON answers but does not state:
 *   1. What share of RESTING chromatic content sits in the house's one warm band?
 *   2. How far is each interactive accent from the nearest crayon anchor (the kin rule)?
 *   3. Which product inks are VERBATIM Tailwind default-palette colours — i.e. stock,
 *      chosen by a framework rather than by this house?
 *
 * Run: node digest.mjs  (from this probe dir; reads ../census/*.json, writes ../census/digest.json)
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const HERE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/r2-accent-family";
const C = join(HERE, "census");
const TW =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/tailwindcss/theme.css";

const srgbToLinear = (c) => {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
};
function rgbToOklch(r, g, b) {
  const lr = srgbToLinear(r),
    lg = srgbToLinear(g),
    lb = srgbToLinear(b);
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_ = Math.cbrt(l),
    m_ = Math.cbrt(m),
    s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  let h = (Math.atan2(bb, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C: Math.hypot(a, bb), h };
}
const hex = (s) => {
  const n = parseInt(s.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
function rgbToHslHue(r, g, b) {
  const mx = Math.max(r, g, b),
    mn = Math.min(r, g, b),
    d = mx - mn;
  if (!d) return 0;
  let h;
  if (mx === r) h = 60 * (((g - b) / d) % 6);
  else if (mx === g) h = 60 * ((b - r) / d + 2);
  else h = 60 * ((r - g) / d + 4);
  return (h + 360) % 360;
}
const hueDist = (a, b) => {
  const d = Math.abs(((a - b) % 360) + 360) % 360;
  return d > 180 ? 360 - d : d;
};

// ── 1. the warm band ───────────────────────────────────────────────────────
// THE HOUSE WARM BAND, declared: OKLCH hue 40°…115°. It is not a taste call — it is the
// arc every RESTING surface of this product already occupies: the cream papers
// (hsl(48 …)), the graphite rules, crayon-orange 68.7°, crayon-gold 83.7°. The band's
// edges are the two crayons that bound it, rounded out to the nearest 5°.
const WARM_LO = 40,
  WARM_HI = 115;
const bandShare = (p) => {
  let warm = 0;
  for (let i = 0; i < 36; i++) {
    const mid = i * 10 + 5;
    if (mid >= WARM_LO && mid <= WARM_HI) warm += p.bins10deg[i];
  }
  return { warmPx: warm, warmShare: warm / p.chromaticPixels };
};

const out = { warmBand: [WARM_LO, WARM_HI], readings: {}, stock: [], hsl: {}, kinTable: [] };

for (const engine of ["chromium", "webkit"]) {
  for (const scheme of ["light", "dark"]) {
    const f = join(C, `census-${engine}-${scheme}.json`);
    if (!existsSync(f)) continue;
    const j = JSON.parse(readFileSync(f, "utf8"));
    for (const [state, p] of Object.entries(j.pixels)) {
      const b = bandShare(p);
      const top = p.binShares
        .map((s, i) => ({ band: `${i * 10}-${i * 10 + 10}`, share: s, px: p.bins10deg[i] }))
        .filter((r) => r.px > 0)
        .sort((x, y) => y.share - x.share)
        .slice(0, 6);
      out.readings[`${engine}/${scheme}/${state}`] = {
        chromaticPixels: p.chromaticPixels,
        chromaticShareOfViewport: +(p.chromaticShare * 100).toFixed(2),
        warmFamilyShareOfChromatic: +(b.warmShare * 100).toFixed(2),
        offFamilyShareOfChromatic: +((1 - b.warmShare) * 100).toFixed(2),
        topBands: top.map((r) => `${r.band}° ${(r.share * 100).toFixed(2)}%`),
      };
    }
  }
}

// ── 2. the kin table (measured tokens, both themes, from the live browser) ─────
const light = JSON.parse(readFileSync(join(C, "census-chromium-light.json"), "utf8"));
const dark = JSON.parse(readFileSync(join(C, "census-chromium-dark.json"), "utf8"));
const anchorsOf = (j) =>
  ["--color-crayon-green", "--color-crayon-orange", "--color-crayon-rose", "--color-crayon-blue", "--color-crayon-gold"].map(
    (k) => ({ name: k.replace("--color-", ""), ...j.tokensOklch[k] }),
  );

for (const [scheme, j] of [
  ["light", light],
  ["dark", dark],
]) {
  const A = anchorsOf(j);
  for (const [tok, o] of Object.entries(j.tokensOklch)) {
    if (!o || o.C < 0.02) continue;
    let best = null,
      bd = 999;
    for (const a of A) {
      const d = hueDist(o.h, a.h);
      if (d < bd) {
        bd = d;
        best = a.name;
      }
    }
    out.kinTable.push({
      scheme,
      token: tok,
      rgb: j.tokens[tok],
      L: o.L,
      C: o.C,
      h: o.h,
      nearestCrayon: best,
      hueDist: +bd.toFixed(1),
      kin: bd <= 12,
    });
  }
}

// ── 3. stock provenance: every product ink against Tailwind's own default palette ──
const tw = readFileSync(TW, "utf8");
const twTokens = [];
for (const line of tw.split("\n")) {
  const m = /--color-([a-z]+)-(\d+):\s*oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)\)/.exec(line);
  if (m) twTokens.push({ name: `${m[1]}-${m[2]}`, L: +m[3] / 100, C: +m[4], h: +m[5] });
}
const PRODUCT = {
  "user-ink (light)": "#2563eb",
  "user-ink (dark)": "#60a5fa",
  "focus-sketch": "#3a7bc4",
  "crayon-blue (light)": "#4a90d9",
  "crayon-blue (dark)": "#6aabeb",
  "progress-ink (light)": "#8b5cf6",
  "progress-ink (dark)": "#7c3aed",
  "solver-ink-1 (light)": "#c2286e",
  "solver-ink-2 (light)": "#7c3aed",
  "solver-ink-3 (light)": "#2059c8",
  "solver-ink-4 (light)": "#047857",
  "solver-ink-5 (light)": "#92600a",
  "solver-ink-1 (dark)": "#f9a8d4",
  "solver-ink-2 (dark)": "#c4b5fd",
  "solver-ink-3 (dark)": "#93c5fd",
  "solver-ink-4 (dark)": "#6ee7b7",
  "solver-ink-5 (dark)": "#fde68a",
  "sparkle glow (hardcoded rgba)": "#c4b5fd",
  "crayon-green (light)": "#2dc653",
  "crayon-orange (light)": "#f4a236",
  "crayon-rose (light)": "#e8315b",
  "crayon-gold (light)": "#c99a2e",
};
for (const [name, h] of Object.entries(PRODUCT)) {
  const [r, g, b] = hex(h);
  const o = rgbToOklch(r, g, b);
  // MATCH ON L AND HUE, never on chroma. Tailwind v4 states its palette in wide-gamut
  // `oklch()`; an sRGB hex is that colour GAMUT-MAPPED, which moves chroma and leaves
  // lightness and hue where they were. So a hex lifted verbatim from the v3 palette shows
  // up here as an exact (L, h) hit with a chroma the mapping shaved — which is precisely
  // what `#2563eb` vs `oklch(54.6% 0.245 262.881)` is.
  // The grey families are excluded for a chromatic ink: `neutral-500` sits at C 0.0 and
  // wins an L-weighted race against every hue, which names a nearest that means nothing.
  const GREY = /^(neutral|gray|slate|zinc|stone)-/;
  let best = null,
    bd = 1e9;
  for (const t of twTokens) {
    if (o.C > 0.05 && GREY.test(t.name)) continue;
    const d = Math.abs(o.L - t.L) + hueDist(o.h, t.h) / 200;
    if (d < bd) {
      bd = d;
      best = t;
    }
  }
  const verbatim = Math.abs(o.L - best.L) <= 0.0015 && hueDist(o.h, best.h) <= 0.5;
  out.stock.push({
    ink: name,
    hex: h,
    L: +o.L.toFixed(4),
    C: +o.C.toFixed(4),
    h: +o.h.toFixed(2),
    nearestTailwind: best.name,
    tw: `oklch(${(best.L * 100).toFixed(1)}% ${best.C} ${best.h})`,
    dL: +(o.L - best.L).toFixed(4),
    dH: +hueDist(o.h, best.h).toFixed(2),
    verbatim,
  });
}

// ── the two blues, in both spaces, because the formation cited one ────────────
const pairs = [
  ["user-ink", "#2563eb", "focus-sketch", "#3a7bc4"],
  ["user-ink", "#2563eb", "crayon-blue", "#4a90d9"],
  ["focus-sketch", "#3a7bc4", "crayon-blue", "#4a90d9"],
  ["progress-ink", "#8b5cf6", "user-ink", "#2563eb"],
  ["progress-ink", "#8b5cf6", "crayon-blue", "#4a90d9"],
];
out.hsl = Object.fromEntries(
  pairs.map(([an, a, bn, b]) => {
    const [r1, g1, b1] = hex(a),
      [r2, g2, b2] = hex(b);
    return [
      `${an} vs ${bn}`,
      {
        hslDeg: +hueDist(rgbToHslHue(r1, g1, b1), rgbToHslHue(r2, g2, b2)).toFixed(1),
        oklchDeg: +hueDist(rgbToOklch(r1, g1, b1).h, rgbToOklch(r2, g2, b2).h).toFixed(1),
      },
    ];
  }),
);

// ── the violet hole: the biggest empty arc on the house wheel ────────────────
const anchors = anchorsOf(light)
  .map((a) => a.h)
  .sort((x, y) => x - y);
let gaps = [];
for (let i = 0; i < anchors.length; i++) {
  const a = anchors[i],
    b = anchors[(i + 1) % anchors.length];
  const span = (b - a + 360) % 360;
  gaps.push({ from: +a.toFixed(1), to: +b.toFixed(1), span: +span.toFixed(1) });
}
gaps.sort((x, y) => y.span - x.span);
out.wheelGaps = gaps;

writeFileSync(join(C, "digest.json"), JSON.stringify(out, null, 2));

// ── printed summary ──────────────────────────────────────────────────────────
console.log(`WARM BAND ${WARM_LO}–${WARM_HI}° (OKLCH)`);
for (const [k, v] of Object.entries(out.readings))
  console.log(
    `  ${k.padEnd(26)} chromatic ${String(v.chromaticShareOfViewport).padStart(5)}% of viewport · warm ${String(v.warmFamilyShareOfChromatic).padStart(6)}% / off-family ${String(v.offFamilyShareOfChromatic).padStart(6)}%`,
  );
console.log("\nHUE GAPS ON THE HOUSE WHEEL (largest first)");
for (const g of out.wheelGaps) console.log(`  ${g.from}° → ${g.to}°  span ${g.span}°`);
console.log("\nPAIR DISTANCES");
for (const [k, v] of Object.entries(out.hsl))
  console.log(`  ${k.padEnd(28)} HSL ${String(v.hslDeg).padStart(5)}°   OKLCH ${String(v.oklchDeg).padStart(5)}°`);
console.log("\nSTOCK PROVENANCE (verbatim = same OKLCH L (±0.0015) AND hue (±0.5°) as a Tailwind default)");
for (const s of out.stock)
  console.log(
    `  ${s.verbatim ? "STOCK " : "      "}${s.ink.padEnd(30)} ${s.hex}  → ${s.nearestTailwind.padEnd(12)} dL=${s.dL} dh=${s.dH}`,
  );
console.log("\nKIN TABLE (light) — kin = OKLCH hue within 12° of a crayon anchor");
for (const r of out.kinTable.filter((r) => r.scheme === "light"))
  console.log(
    `  ${r.kin ? "kin " : "OFF "}${r.token.padEnd(26)} h=${String(r.h).padStart(5)} C=${r.C}  nearest ${r.nearestCrayon.padEnd(14)} Δ=${r.hueDist}`,
  );
console.log("\nKIN TABLE (dark)");
for (const r of out.kinTable.filter((r) => r.scheme === "dark"))
  console.log(
    `  ${r.kin ? "kin " : "OFF "}${r.token.padEnd(26)} h=${String(r.h).padStart(5)} C=${r.C}  nearest ${r.nearestCrayon.padEnd(14)} Δ=${r.hueDist}`,
  );
