/**
 * sixth-window.mjs — the ONE-HEX question, and the gamut ceilings.
 *
 * The fill trace crosses TWO grounds in EACH theme, and the two grounds sit on opposite
 * sides of mid-grey in each theme AND swap sides between themes:
 *
 *      light:  --grid-line-color #262626 (dark)   ·  --color-card #fdfdfc (near-white)
 *      dark:   --grid-line-color #d1cfc7 (light)  ·  --color-card #131211 (near-black)
 *
 * So a trace ink must clear WCAG 1.4.11's 3:1 against four grounds if it is ONE hex, and
 * against two grounds per arm if it is two. This sweeps (L, C) at the sixth's hue and
 * reports (1) the four-ground intersection — the one-hex window — and (2) the per-theme
 * windows, and (3) the sRGB chroma ceiling per hue, which is where the charter's
 * "chroma 0.20 at L 0.5 clips some hues" is either confirmed or refuted on numbers.
 *
 *   node sixth-window.mjs
 */
import { writeFileSync } from "node:fs";

const srgbToLinear = (c) => { const x = c / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
const linearToSrgb = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(Math.max(x, 0), 1 / 2.4) - 0.055);
function oklchToRgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180, a = C * Math.cos(h), b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b, m_ = L - 0.1055613458 * a - 0.0638541728 * b, s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const raw = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => linearToSrgb(v) * 255);
  return { r: Math.round(Math.min(255, Math.max(0, raw[0]))), g: Math.round(Math.min(255, Math.max(0, raw[1]))), b: Math.round(Math.min(255, Math.max(0, raw[2]))), clipped: raw.some((v) => v < -0.5 || v > 255.5) };
}
const hex = ({ r, g, b }) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
const lum = ({ r, g, b }) => 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
const ratio = (a, b) => { const la = lum(a), lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };
const over = (i, al, g) => ({ r: i.r * al + g.r * (1 - al), g: i.g * al + g.g * (1 - al), b: i.b * al + g.b * (1 - al) });

const GR = { lightGrid: { r: 38, g: 38, b: 38 }, lightCard: { r: 253, g: 253, b: 252 }, darkGrid: { r: 209, g: 207, b: 199 }, darkCard: { r: 19, g: 18, b: 17 } };
const A = 0.95, FLOOR = 3.0, HUE = 293.0;

const out = { hue: HUE, alpha: A, floor: FLOOR, grounds: GR };

// ── (1) the ONE-HEX window: all four grounds at once ─────────────────────────
const oneHex = [];
for (let L = 0.45; L <= 0.80; L += 0.002) {
  for (let C = 0.06; C <= 0.30; C += 0.005) {
    const px = oklchToRgb(L, C, HUE);
    if (px.clipped) continue;
    const r = {
      lg: ratio(over(px, A, GR.lightGrid), GR.lightGrid),
      lc: ratio(over(px, A, GR.lightCard), GR.lightCard),
      dg: ratio(over(px, A, GR.darkGrid), GR.darkGrid),
      dc: ratio(over(px, A, GR.darkCard), GR.darkCard),
    };
    if (r.lg >= FLOOR && r.lc >= FLOOR && r.dg >= FLOOR && r.dc >= FLOOR)
      oneHex.push({ L: +L.toFixed(3), C: +C.toFixed(3), hex: hex(px), ...Object.fromEntries(Object.entries(r).map(([k, v]) => [k, +v.toFixed(2)])) });
  }
}
out.oneHexWindow = { n: oneHex.length, rows: oneHex.slice(0, 40) };
if (oneHex.length) {
  const Ls = oneHex.map((x) => x.L), Cs = oneHex.map((x) => x.C);
  // the most headroom-balanced member: maximise the MINIMUM of the four ratios
  const best = oneHex.reduce((a, b) => (Math.min(b.lg, b.lc, b.dg, b.dc) > Math.min(a.lg, a.lc, a.dg, a.dc) ? b : a));
  out.oneHexWindow.L = [Math.min(...Ls), Math.max(...Ls)];
  out.oneHexWindow.C = [Math.min(...Cs), Math.max(...Cs)];
  out.oneHexWindow.best = best;
  out.oneHexWindow.bestWorstRatio = +Math.min(best.lg, best.lc, best.dg, best.dc).toFixed(2);
}

// ── (2) per-theme windows, so a two-arm token can be priced against a one-arm one ──
function theme(gridKey, cardKey) {
  const rows = [];
  for (let L = 0.35; L <= 0.90; L += 0.002) {
    for (let C = 0.06; C <= 0.30; C += 0.005) {
      const px = oklchToRgb(L, C, HUE);
      if (px.clipped) continue;
      const g = ratio(over(px, A, GR[gridKey]), GR[gridKey]), c = ratio(over(px, A, GR[cardKey]), GR[cardKey]);
      if (g >= FLOOR && c >= FLOOR) rows.push({ L: +L.toFixed(3), C: +C.toFixed(3), hex: hex(px), grid: +g.toFixed(2), card: +c.toFixed(2) });
    }
  }
  const Ls = rows.map((r) => r.L);
  return { n: rows.length, L: rows.length ? [Math.min(...Ls), Math.max(...Ls)] : null,
    best: rows.length ? rows.reduce((a, b) => (Math.min(b.grid, b.card) > Math.min(a.grid, a.card) ? b : a)) : null };
}
out.lightWindow = theme("lightGrid", "lightCard");
out.darkWindow = theme("darkGrid", "darkCard");

// ── (3) the sRGB chroma ceiling per hue — the charter's clip risk, priced ─────
out.gamutCeiling = {};
for (const [n, h] of Object.entries({ "crayon-rose 14.2": 14.2, "crayon-orange 68.7": 68.7, "crayon-gold 83.7": 83.7, "crayon-green 147.0": 147.0, "crayon-blue 251.4": 251.4, "focus-sketch 253.3": 253.3, "user-ink 262.9": 262.9, "the sixth 293.0": 293.0 })) {
  const row = {};
  for (const L of [0.50, 0.545, 0.575, 0.606, 0.641, 0.686, 0.70]) {
    let best = 0;
    for (let C = 0.01; C < 0.36; C += 0.001) { if (oklchToRgb(L, C, h).clipped) break; best = C; }
    row["L=" + L.toFixed(3)] = +best.toFixed(3);
  }
  out.gamutCeiling[n] = row;
}

// ── (4) the peer walk's reserved arcs, given a six-anchor wheel ───────────────
const anchors = [["crayon-rose", 14.2], ["crayon-orange", 68.7], ["crayon-gold", 83.7], ["crayon-green", 147.0], ["crayon-blue", 251.4], ["the sixth", 293.0]];
const RES = 12; // half-arc each side; stated, not assumed — see the record
out.reserved = anchors.map(([n, h]) => ({ anchor: n, h, arc: [+(((h - RES) + 360) % 360).toFixed(1), +((h + RES) % 360).toFixed(1)] }));
const walk = [];
for (let i = 0; i < 24; i++) {
  const h = (i * 137.5) % 360;
  const hit = anchors.filter(([, ah]) => { let d = Math.abs(((h - ah) % 360) + 360) % 360; if (d > 180) d = 360 - d; return d <= RES; }).map(([n]) => n);
  walk.push({ i, h: +h.toFixed(1), collides: hit });
}
out.walkVsReserved = { RES_DEG: RES, colliding: walk.filter((w) => w.collides.length), free: walk.filter((w) => !w.collides.length).length, of: walk.length };

writeFileSync(new URL("../census/sixth-window.json", import.meta.url), JSON.stringify(out, null, 2));
console.log("ONE-HEX WINDOW (all four grounds ≥3:1 at α0.95):", out.oneHexWindow.n, "members");
if (out.oneHexWindow.n) console.log("  L", out.oneHexWindow.L, "C", out.oneHexWindow.C, "\n  best:", JSON.stringify(out.oneHexWindow.best), "worst-of-four", out.oneHexWindow.bestWorstRatio);
console.log("LIGHT window  L", JSON.stringify(out.lightWindow.L), "best", JSON.stringify(out.lightWindow.best));
console.log("DARK  window  L", JSON.stringify(out.darkWindow.L), "best", JSON.stringify(out.darkWindow.best));
console.log("\nsRGB CHROMA CEILING:");
for (const [k, v] of Object.entries(out.gamutCeiling)) console.log("  " + k.padEnd(20), JSON.stringify(v));
console.log("\nWALK vs six reserved ±" + RES + "°:", out.walkVsReserved.free, "of", out.walkVsReserved.of, "free;", out.walkVsReserved.colliding.length, "collide:");
for (const c of out.walkVsReserved.colliding) console.log("   i=" + c.i, "h=" + c.h, "→", c.collides.join(", "));
