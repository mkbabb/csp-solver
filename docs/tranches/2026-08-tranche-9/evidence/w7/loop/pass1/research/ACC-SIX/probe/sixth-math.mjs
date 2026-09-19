/**
 * sixth-math.mjs — ACC-SIX pass 1. The colour arithmetic BEFORE the browser, so the
 * candidates the overlay ships are derived rather than picked, and the browser's
 * painted-byte re-derivation has something to falsify.
 *
 * Ottosson OKLab↔sRGB, the same matrices `../r0/r2-accent-family/probe/oklch.ts` uses.
 * Gamut: naive per-channel clip AFTER the linear→sRGB transfer, which is what a hex
 * literal in index.css IS — the browser never sees the out-of-gamut OKLCH for a hex.
 * Where a candidate is clipped the script SAYS so (`clipped: true`) because a clipped
 * candidate is no longer the hue/chroma it claims.
 *
 *   node sixth-math.mjs            → the windows + the candidate table (stdout + JSON)
 */
import { writeFileSync } from "node:fs";

const f = (x) => +x.toFixed(4);
const srgbToLinear = (c) => {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
};
const linearToSrgb = (x) =>
  x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(Math.max(x, 0), 1 / 2.4) - 0.055;

export function rgbToOklch(r, g, b) {
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  let h = (Math.atan2(bb, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C: Math.hypot(a, bb), h };
}

export function oklchToRgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const raw = [lr, lg, lb].map((v) => linearToSrgb(v) * 255);
  const clipped = raw.some((v) => v < -0.5 || v > 255.5);
  const px = raw.map((v) => Math.round(Math.min(255, Math.max(0, v))));
  return { r: px[0], g: px[1], b: px[2], clipped };
}

const hex = ({ r, g, b }) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
const parseHex = (s) => {
  const n = parseInt(s.replace("#", ""), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};
const lum = ({ r, g, b }) =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
const ratio = (a, b) => {
  const la = lum(a), lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
const over = (ink, alpha, ground) => ({
  r: ink.r * alpha + ground.r * (1 - alpha),
  g: ink.g * alpha + ground.g * (1 - alpha),
  b: ink.b * alpha + ground.b * (1 - alpha),
});

// hsl() → rgb, for the four papers index.css states in hsl.
const hsl = (H, S, L) => {
  S /= 100; L /= 100;
  const k = (n) => (n + H / 30) % 12;
  const a = S * Math.min(L, 1 - L);
  const ch = (n) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: Math.round(255 * ch(0)), g: Math.round(255 * ch(8)), b: Math.round(255 * ch(4)) };
};

// ── the grounds, from index.css ────────────────────────────────────────────────
const G = {
  lightCard: hsl(48, 12, 99),        // index.css:135
  lightBg: hsl(48, 15, 98),          // index.css:133
  lightGrid: hsl(0, 0, 15),          // index.css:308
  darkCard: hsl(24, 6, 7),           // index.css:366
  darkBg: hsl(24, 8, 6),             // index.css:364
  darkGrid: hsl(48, 10, 80),         // index.css:401
};

// ── the estate's violets, already in the tree ─────────────────────────────────
const TREE = {
  "progress-ink light  #8b5cf6": "#8b5cf6",
  "progress-ink dark   #7c3aed": "#7c3aed",
  "solver-ink-2 light  #7c3aed": "#7c3aed",
  "solver-ink-2 dark   #c4b5fd": "#c4b5fd",
  "sparkle glow        #c4b5fd": "#c4b5fd",
  "crayon-blue light   #4a90d9": "#4a90d9",
  "crayon-blue dark    #6aabeb": "#6aabeb",
  "user-ink light      #2563eb": "#2563eb",
  "user-ink dark       #60a5fa": "#60a5fa",
  "focus-sketch        #3a7bc4": "#3a7bc4",
};

const out = { grounds: {}, tree: {}, windows: {}, candidates: {} };
for (const [k, v] of Object.entries(G)) out.grounds[k] = { ...v, hex: hex(v) };
for (const [k, v] of Object.entries(TREE)) {
  const p = parseHex(v);
  const o = rgbToOklch(p.r, p.g, p.b);
  out.tree[k] = { hex: v, L: f(o.L), C: f(o.C), h: f(o.h) };
}

// ── THE TRACE'S DOUBLE SQUEEZE ────────────────────────────────────────────────
// The fill trace is stroked at stroke-opacity 0.95 and it crosses TWO grounds in each
// theme: the graphite frame line it retraces, and the card it overhangs (FRAME_Y_PAD 0,
// svg overflow visible — R3 measured the whole top stripe OUTSIDE the board box).
// So an L that clears one can fail the other, and the two grounds sit on OPPOSITE sides
// of mid-grey in each theme. Sweep L at the house violet hue and report the window.
function window_(hueDeg, chroma, grounds, alpha = 0.95, floor = 3.0) {
  const rows = [];
  for (let L = 0.20; L <= 0.95; L += 0.005) {
    const px = oklchToRgb(L, chroma, hueDeg);
    const rs = grounds.map(([name, g]) => ({ name, r: +ratio(over(px, alpha, g), g).toFixed(3) }));
    rows.push({ L: f(L), hex: hex(px), clipped: px.clipped, rs, ok: rs.every((x) => x.r >= floor) });
  }
  const ok = rows.filter((r) => r.ok);
  return {
    hue: hueDeg, chroma, alpha, floor,
    window: ok.length ? { lo: ok[0].L, hi: ok[ok.length - 1].L, n: ok.length } : null,
    rows: rows.filter((r) => Math.abs(r.L * 200 - Math.round(r.L * 200)) < 1e-6 && (r.L * 100) % 2 === 0),
  };
}

out.windows.lightTrace = window_(293, 0.219, [["grid", G.lightGrid], ["card", G.lightCard]]);
out.windows.darkTrace = window_(293, 0.247, [["grid", G.darkGrid], ["card", G.darkCard]]);
// the same sweep at the WAX's mean chroma, for arm (a)
out.windows.lightTraceWax = window_(293, 0.166, [["grid", G.lightGrid], ["card", G.lightCard]]);
out.windows.darkTraceWax = window_(293, 0.166, [["grid", G.darkGrid], ["card", G.darkCard]]);

// ── ARM (a): the sixth as WAX, under the crayon dark law ──────────────────────
// Law (index.css:164-169): dark PRESERVES hue (±3°), RAISES L by +0.06…+0.10, chroma may
// rise. The five shipped crayons' actual ΔL, re-derived, is the honest band.
const CRAYONS = [
  ["green", "#2dc653", "#3dd968"],
  ["orange", "#f4a236", "#f5b35c"],
  ["rose", "#e8315b", "#ff5c7c"],
  ["blue", "#4a90d9", "#6aabeb"],
  ["gold", "#c99a2e", "#e5c74d"],
];
out.crayonLaw = CRAYONS.map(([n, l, d]) => {
  const a = rgbToOklch(...Object.values(parseHex(l)));
  const b = rgbToOklch(...Object.values(parseHex(d)));
  let dh = Math.abs(((b.h - a.h) % 360) + 360) % 360; if (dh > 180) dh = 360 - dh;
  return { crayon: n, light: l, dark: d, Llight: f(a.L), Ldark: f(b.L), dL: f(b.L - a.L), dHue: f(dh), dC: f(b.C - a.C) };
});

// ── candidate table ───────────────────────────────────────────────────────────
function price(name, lightHex, darkHex) {
  const li = parseHex(lightHex), da = parseHex(darkHex);
  const lo = rgbToOklch(li.r, li.g, li.b), do_ = rgbToOklch(da.r, da.g, da.b);
  let dh = Math.abs(((do_.h - lo.h) % 360) + 360) % 360; if (dh > 180) dh = 360 - dh;
  return {
    name, light: lightHex, dark: darkHex,
    lightOklch: { L: f(lo.L), C: f(lo.C), h: f(lo.h) },
    darkOklch: { L: f(do_.L), C: f(do_.C), h: f(do_.h) },
    crayonLaw: { dHue: f(dh), dL: f(do_.L - lo.L), dC: f(do_.C - lo.C),
      holds: dh <= 3 && do_.L - lo.L >= 0.06 && do_.L - lo.L <= 0.10 },
    ratios: {
      "light trace @0.95 over grid": +ratio(over(li, 0.95, G.lightGrid), G.lightGrid).toFixed(2),
      "light trace @0.95 over card": +ratio(over(li, 0.95, G.lightCard), G.lightCard).toFixed(2),
      "dark  trace @0.95 over grid": +ratio(over(da, 0.95, G.darkGrid), G.darkGrid).toFixed(2),
      "dark  trace @0.95 over card": +ratio(over(da, 0.95, G.darkCard), G.darkCard).toFixed(2),
      "light text on card": +ratio(li, G.lightCard).toFixed(2),
      "light text on bg": +ratio(li, G.lightBg).toFixed(2),
      "dark text on card": +ratio(da, G.darkCard).toFixed(2),
      "dark text on bg": +ratio(da, G.darkBg).toFixed(2),
    },
  };
}

out.candidates.HEAD = price("HEAD progress-ink", "#8b5cf6", "#7c3aed");

// arm (a) — WAX: light arm is the HEAD light violet (already wax-lightness, L .606, C .219);
// the dark arm must RISE +0.06…0.10 at hue ±3°. Derive it rather than pick it.
for (const dL of [0.06, 0.08, 0.10]) {
  const base = rgbToOklch(...Object.values(parseHex("#8b5cf6")));
  const px = oklchToRgb(base.L + dL, Math.min(0.30, base.C + 0.01), base.h);
  out.candidates[`arm a WAX dark L+${dL}`] = { ...price(`arm a (wax) dL ${dL}`, "#8b5cf6", hex(px)), clipped: px.clipped };
}
// arm (a) at the wax's MEAN chroma (0.166) instead of the violet's native 0.219
{
  const l = oklchToRgb(0.606, 0.166, 293), d = oklchToRgb(0.606 + 0.08, 0.166, 293);
  out.candidates["arm a WAX @C0.166"] = { ...price("arm a (wax) C .166", hex(l), hex(d)), clippedLight: l.clipped, clippedDark: d.clipped };
}
// arm (b) — the ANSWER material: two tiers already in the tree, crossed by theme.
out.candidates["arm b answer DEEP/PALE crossed"] = price("arm b (answer) meter", "#c4b5fd", "#7c3aed");
out.candidates["arm b answer DEEP both"] = price("arm b (answer) deep both", "#7c3aed", "#7c3aed");
out.candidates["arm b answer as HEAD keeps 8b5cf6"] = price("arm b keeps meter hexes", "#8b5cf6", "#7c3aed");

// ── BLUE: one job or two ──────────────────────────────────────────────────────
// --color-blue-ink derived from crayon-blue, hue-locked, darkened to AA as TEXT
// (the red/green/orange/gold-ink move). Sweep L at crayon-blue's hue for the AA floor
// on BOTH light papers; report the shallowest darkening that clears 4.5:1.
{
  const cb = rgbToOklch(...Object.values(parseHex("#4a90d9")));
  const rows = [];
  for (let L = 0.35; L <= 0.66; L += 0.005) {
    for (const C of [0.131, 0.150, 0.166, 0.180, 0.200]) {
      const px = oklchToRgb(L, C, cb.h);
      const rc = ratio(px, G.lightCard), rb = ratio(px, G.lightBg);
      if (rc >= 4.5 && rb >= 4.5 && !px.clipped) { rows.push({ L: f(L), C, hex: hex(px), card: +rc.toFixed(2), bg: +rb.toFixed(2) }); }
    }
  }
  // the shallowest (highest L) per chroma
  const byC = {};
  for (const r of rows) if (!byC[r.C] || r.L > byC[r.C].L) byC[r.C] = r;
  out.blueInk = { crayonBlue: { hex: "#4a90d9", L: f(cb.L), C: f(cb.C), h: f(cb.h) }, shallowestAA: byC };
  out.blueInkHEAD = {
    "user-ink light #2563eb on card": +ratio(parseHex("#2563eb"), G.lightCard).toFixed(2),
    "user-ink light #2563eb on bg": +ratio(parseHex("#2563eb"), G.lightBg).toFixed(2),
    "user-ink dark #60a5fa on card": +ratio(parseHex("#60a5fa"), G.darkCard).toFixed(2),
    "user-ink dark #60a5fa on bg": +ratio(parseHex("#60a5fa"), G.darkBg).toFixed(2),
    "crayon-blue dark #6aabeb on card": +ratio(parseHex("#6aabeb"), G.darkCard).toFixed(2),
    "crayon-blue dark #6aabeb on bg": +ratio(parseHex("#6aabeb"), G.darkBg).toFixed(2),
    "crayon-blue light #4a90d9 on card (raw wax, why the ink tier exists)": +ratio(parseHex("#4a90d9"), G.lightCard).toFixed(2),
  };
}

// ── FOCUS: the ring's dark arm ────────────────────────────────────────────────
// gameCell.css:246-248 strokes at stroke-opacity 0.9. The 1.4.11 floor is 3:1 over the
// ground the ring is drawn on — the cell's paper is --color-card.
{
  const rows = {};
  for (const [name, h] of [["#3a7bc4 (HEAD, no dark arm)", "#3a7bc4"], ["#6aabeb (crayon-blue dark, what the comment claims)", "#6aabeb"], ["#4a90d9 (crayon-blue light)", "#4a90d9"]]) {
    const p = parseHex(h);
    rows[name] = {
      "light @0.9 over card": +ratio(over(p, 0.9, G.lightCard), G.lightCard).toFixed(2),
      "dark  @0.9 over card": +ratio(over(p, 0.9, G.darkCard), G.darkCard).toFixed(2),
      "light opaque over card": +ratio(p, G.lightCard).toFixed(2),
      "dark  opaque over card": +ratio(p, G.darkCard).toFixed(2),
    };
  }
  out.focusRing = rows;
}

// ── the wheel after the sixth lands ───────────────────────────────────────────
function gaps(anchors) {
  const s = [...anchors].sort((a, b) => a.h - b.h);
  const g = [];
  for (let i = 0; i < s.length; i++) {
    const a = s[i], b = s[(i + 1) % s.length];
    g.push({ from: a.name, to: b.name, span: +(((b.h - a.h + 360) % 360)).toFixed(1) });
  }
  return g.sort((x, y) => y.span - x.span);
}
const five = [
  { name: "crayon-rose", h: 14.2 }, { name: "crayon-orange", h: 68.7 },
  { name: "crayon-gold", h: 83.7 }, { name: "crayon-green", h: 147.0 },
  { name: "crayon-blue", h: 251.4 },
];
out.wheel = { before: gaps(five), afterSixth293: gaps([...five, { name: "sixth", h: 293.0 }]) };

// the kill condition: the sixth vs solver stop 2, by hue
out.killHueDelta = {
  "sixth 293.0 vs solver-ink-2 light 293.0": 0.0,
  "sixth 293.0 vs solver-ink-2 dark 293.6": 0.6,
  note: "BY CONSTRUCTION the sixth IS stop 2's hue. The 5° kill is met at 0°, so form and weight carry the whole separation. Priced in the record.",
};

writeFileSync(new URL("../census/sixth-math.json", import.meta.url), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
