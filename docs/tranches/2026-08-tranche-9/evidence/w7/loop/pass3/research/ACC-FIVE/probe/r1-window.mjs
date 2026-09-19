#!/usr/bin/env node
/** ACC-FIVE pass-3 RESEARCH r1 — THE PAINTED WINDOW, AND WHAT FITS IN IT.
 *
 *  The pass-2 critic falsified the contamination defence and left the dark ink failing
 *  1.4.11 on painted bytes (2.845 chromium / 2.805 webkit against the frame line it
 *  retraces). This probe does NOT re-argue that. It asks the only question a re-pitch can
 *  be chosen on: given the two grounds the trace has at once, WHAT LUMINANCE WINDOW is
 *  left, and can a gold kin to the crayon live inside it?
 *
 *  THE MODEL, stated so it can be falsified by r2's paint:
 *    the trace paints at stroke-opacity 0.95 over whatever is under it, so
 *      core_over_line = 0.95·T + 0.05·LINE   (compared against LINE)
 *      core_over_card = 0.95·T + 0.05·CARD   (compared against CARD)
 *    LINE and CARD are the PAINTED bytes the critic measured, not the tokens: a 12-unit
 *    hand-drawn stroke antialiases and never reaches its own token value.
 *
 *  Arms:
 *    A · validate the model against the critic's four measured cells (band-lowfill.json).
 *    B · the feasible window per theme: the [min,max] painted-core luminance that clears
 *        3:1 against BOTH grounds, and how wide it is.
 *    C · the search: hue held at the crayon's own OKLCH hue, L and C swept, every in-gamut
 *        candidate scored by its WORST of the four arms; the best few printed with the
 *        painted hue a kinship census would read off them.
 *    D · the incumbents priced in the same space (#7d6902, #a47903, HEAD's violets).
 *
 *  Pure arithmetic — no server, no product file touched.
 */
import { writeFileSync } from "node:fs";
import { rgbToOklch, oklchToRgb, srgbToLinear, hueDist } from "./oklch.COPY.mjs";

const OUT = process.argv[2];
if (!OUT) throw new Error("usage: node r1-window.mjs <out.json>");

const lum = ([r, g, b]) =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(3);
};
const hex2rgb = (h) => {
  const n = parseInt(h.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = ([r, g, b]) =>
  "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
const over = (T, G, a = 0.95) => T.map((v, i) => v * a + G[i] * (1 - a));

/** hsl() → rgb, for the tokens index.css writes in hsl. */
const hsl = (h, s, l) => {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const seg = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][Math.floor(h / 60) % 6];
  return seg.map((v) => Math.round((v + m) * 255));
};

// ── the grounds ────────────────────────────────────────────────────────────────────────
// PAINTED line: the critic's read, byte-identical traced and untraced, both engines
// (pass2/critique/ACC-FIVE/readings/band-lowfill.json).
const GROUND = {
  light: {
    linePainted: [49, 49, 49],
    lineToken: hsl(0, 0, 15), // --grid-line-color
    card: hsl(48, 12, 99), // --color-card
    background: hsl(48, 15, 98),
    crayonGold: "#c99a2e",
    incumbent: "#a47903",
    head: "#8b5cf6",
  },
  dark: {
    linePainted: [199, 197, 190],
    lineToken: hsl(48, 10, 80),
    card: hsl(24, 6, 7),
    background: hsl(24, 8, 6),
    crayonGold: "#e5c74d",
    incumbent: "#7d6902",
    head: "#7c3aed",
  },
};

const out = { model: {}, window: {}, search: {}, incumbents: {} };

// ── A · does the blend model reproduce the critic's painted cores? ─────────────────────
const MEASURED = {
  "light/chromium": { core: [158, 117, 5], token: "#a47903" },
  "light/webkit": { core: [158, 118, 6], token: "#a47903" },
  "dark/chromium": { core: [130, 112, 14], token: "#7d6902" },
  "dark/webkit": { core: [131, 113, 16], token: "#7d6902" },
};
for (const [cell, m] of Object.entries(MEASURED)) {
  const theme = cell.split("/")[0];
  const g = GROUND[theme];
  const pred = over(hex2rgb(m.token), g.linePainted).map(Math.round);
  out.model[cell] = {
    measuredCore: m.core,
    predictedCoreOverLine: pred,
    deltaRgb: pred.map((v, i) => v - m.core[i]),
    measuredRatioVsLine: ratio(m.core, g.linePainted),
    predictedRatioVsLine: ratio(pred, g.linePainted),
  };
}

// ── B · the window ─────────────────────────────────────────────────────────────────────
for (const theme of ["light", "dark"]) {
  const g = GROUND[theme];
  const Lline = lum(g.linePainted);
  const Lcard = lum(g.card);
  const Lbg = lum(g.background);
  // vs the LINE: light theme → the trace must be LIGHTER than the dark line; dark theme →
  // the trace must be DARKER than the light line.
  const vsLine =
    theme === "light"
      ? { kind: "core must be LIGHTER", minCoreL: 3 * (Lline + 0.05) - 0.05, maxCoreL: null }
      : { kind: "core must be DARKER", minCoreL: null, maxCoreL: (Lline + 0.05) / 3 - 0.05 };
  // vs the CARD: light card is near-white (trace must be darker), dark card is near-black
  // (trace must be lighter). The card is the worse of card/background in both themes?
  const worseGround = Math.abs(Lcard - Lbg) < 1e-9 ? "equal" : Lcard > Lbg ? "card" : "background";
  const vsCard =
    theme === "light"
      ? { kind: "core must be DARKER", maxCoreL: (Lcard + 0.05) / 3 - 0.05, minCoreL: null }
      : { kind: "core must be LIGHTER", minCoreL: 3 * (Lcard + 0.05) - 0.05, maxCoreL: null };
  const lo = Math.max(vsLine.minCoreL ?? 0, vsCard.minCoreL ?? 0);
  const hi = Math.min(vsLine.maxCoreL ?? 1, vsCard.maxCoreL ?? 1);
  out.window[theme] = {
    Lline: +Lline.toFixed(5),
    Lcard: +Lcard.toFixed(5),
    Lbackground: +Lbg.toFixed(5),
    lineTokenRgb: g.lineToken,
    linePaintedRgb: g.linePainted,
    lineTokenVsPaintedRatio: ratio(g.lineToken, g.linePainted),
    vsLine,
    vsCard,
    coreLmin: +lo.toFixed(5),
    coreLmax: +hi.toFixed(5),
    widthOfWindow: +(hi - lo).toFixed(5),
    empty: hi <= lo,
    worseAchromaticGround: worseGround,
  };
}

// ── C · the search, hue held at the crayon's own ───────────────────────────────────────
const arms = (T, g, a = 0.95) => {
  const coreLine = over(T, g.linePainted, a);
  const coreCard = over(T, g.card, a);
  const coreBg = over(T, g.background, a);
  return {
    vsLine: ratio(coreLine, g.linePainted),
    vsCard: ratio(coreCard, g.card),
    vsBackground: ratio(coreBg, g.background),
    vsLineToken: ratio(over(T, g.lineToken, a), g.lineToken),
    corePaintedOverLine: coreLine.map(Math.round),
    corePaintedOverCard: coreCard.map(Math.round),
  };
};
const worstOfFour = (a) => Math.min(a.vsLine, a.vsCard, a.vsBackground, a.vsLineToken);

// THE ALPHA LEVER. `stroke-opacity="0.95"` (HandDrawnGrid.vue:473) blends the ground the
// gauge is measured AGAINST into the gauge itself — 5% of a near-white frame line lifts the
// dark ink toward the very thing it must stay 3:1 below. Priced here as a sweep, because it
// is one attribute and it moves the corridor more than any hue does.
const ALPHAS = [0.95, 1];
for (const theme of ["light", "dark"]) {
  const g = GROUND[theme];
  const goldHue = rgbToOklch(...hex2rgb(g.crayonGold)).h;
  out.search[theme] = { crayonGoldHue: +goldHue.toFixed(2), byAlpha: {} };
  for (const alpha of ALPHAS) {
    const cands = [];
    for (let L = 0.2; L <= 0.85; L += 0.002) {
      for (let C = 0.02; C <= 0.2; C += 0.002) {
        const { r, g: gg, b, inGamut } = oklchToRgb(L, C, goldHue);
        if (!inGamut) continue;
        const T = [r, gg, b];
        const a = arms(T, g, alpha);
        const w = worstOfFour(a);
        const painted = rgbToOklch(...a.corePaintedOverLine);
        cands.push({
          hex: toHex(T),
          rgb: T,
          oklch: { L: +L.toFixed(3), C: +C.toFixed(3), h: +goldHue.toFixed(1) },
          ...a,
          worst: +w.toFixed(3),
          paintedHueOverLine: +painted.h.toFixed(1),
          paintedDHueFromCrayonGold: +hueDist(painted.h, goldHue).toFixed(2),
        });
      }
    }
    cands.sort((a, b) => b.worst - a.worst);
    const kin = cands.filter((c) => c.paintedDHueFromCrayonGold <= 5);
    out.search[theme].byAlpha[alpha] = {
      candidatesInGamut: cands.length,
      best: cands.slice(0, 4),
      bestWithPaintedKinship5deg: kin.slice(0, 4),
      bestAtChromaAtLeast: Object.fromEntries(
        [0.08, 0.1, 0.12, 0.14].map((c) => [
          String(c),
          cands.filter((x) => x.oklch.C >= c).slice(0, 2),
        ]),
      ),
      incumbentAtThisAlpha: Object.fromEntries(
        [g.incumbent, g.head, g.crayonGold].map((h) => {
          const a = arms(hex2rgb(h), g, alpha);
          return [h, { worst: +worstOfFour(a).toFixed(3), vsLine: a.vsLine, vsCard: a.vsCard }];
        }),
      ),
    };
  }
}

// ── D · the incumbents, in the same space ──────────────────────────────────────────────
for (const theme of ["light", "dark"]) {
  const g = GROUND[theme];
  const goldHue = rgbToOklch(...hex2rgb(g.crayonGold)).h;
  const row = {};
  for (const [name, h] of [
    ["proposed(pass2)", g.incumbent],
    ["HEAD violet", g.head],
    ["crayon-gold(wax)", g.crayonGold],
    ["gold-ink", theme === "light" ? "#8c691d" : g.crayonGold],
  ]) {
    const T = hex2rgb(h);
    const a = arms(T, g);
    const o = rgbToOklch(...T);
    const painted = rgbToOklch(...a.corePaintedOverLine);
    row[name] = {
      hex: h,
      oklch: { L: +o.L.toFixed(3), C: +o.C.toFixed(3), h: +o.h.toFixed(1) },
      dHueFromCrayonGold: +hueDist(o.h, goldHue).toFixed(2),
      ...a,
      worst: +worstOfFour(a).toFixed(3),
      paintedHueOverLine: +painted.h.toFixed(1),
      paintedCoreL: +lum(a.corePaintedOverLine).toFixed(5),
    };
  }
  out.incumbents[theme] = row;
}

writeFileSync(OUT, JSON.stringify(out, null, 2));
// a legible digest on stdout
for (const theme of ["light", "dark"]) {
  const w = out.window[theme];
  console.log(
    `\n${theme.toUpperCase()}  window core-L [${w.coreLmin} .. ${w.coreLmax}] width ${w.widthOfWindow}${w.empty ? "  ** EMPTY **" : ""}`,
  );
  for (const [n, r] of Object.entries(out.incumbents[theme]))
    console.log(
      `   ${n.padEnd(16)} ${r.hex}  line ${r.vsLine}  card ${r.vsCard}  bg ${r.vsBackground}  lineToken ${r.vsLineToken}  worst ${r.worst}  coreL ${r.paintedCoreL}`,
    );
  const k = out.search[theme].byAlpha["0.95"].bestWithPaintedKinship5deg[0];
  if (k)
    console.log(
      `   BEST(kin≤5°)     ${k.hex}  line ${k.vsLine}  card ${k.vsCard}  bg ${k.vsBackground}  lineToken ${k.vsLineToken}  worst ${k.worst}  OKLCH ${k.oklch.L}/${k.oklch.C}/${k.oklch.h}`,
    );
}
console.log("\nbanked", OUT);
