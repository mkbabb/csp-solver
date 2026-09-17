// R5 round-zero census — the per-player ink walk, measured on THIS tree.
// Re-derives every number playerIdentity.ts and index.css claim, over the FULL cycle
// rather than the 40 indices the shipped comment quotes.
// READ-ONLY: writes nothing but stdout.

// ── colour maths ────────────────────────────────────────────────────────────────
const srgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

function oklchToLinear(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3,
    m = m_ ** 3,
    s = s_ ** 3;
  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const inGamut = (rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);
const clip = (rgb) => rgb.map((v) => Math.min(1, Math.max(0, v)));

function linearToOklab(r, g, b) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
const hexToLinear = (hex) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
};
function hslToLinear(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)].map(lin);
}
const relLum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const ratio = (a, b) => {
  const [x, y] = [relLum(a), relLum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const okOf = (linRGB) => {
  const [L, a, b] = linearToOklab(...linRGB);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C: Math.hypot(a, b), h };
};
const hueGap = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

// ── the grounds (index.css, THIS tree) ──────────────────────────────────────────
const G = {
  lightBg: hslToLinear(48, 15, 98), // --color-background
  lightCard: hslToLinear(48, 12, 99), // --color-card
  darkBg: hslToLinear(24, 8, 6),
  darkCard: hslToLinear(24, 6, 7),
};

// ── the walk (playerIdentity.inkFor) ────────────────────────────────────────────
const CHROMA = 0.11;
const STEP = 137.5;
const L_LIGHT = 0.5; // --peer-ink-l :root
const L_DARK = 0.8; // --peer-ink-l .dark
const hueAt = (i) => +(((i * STEP) % 360).toFixed(1)); // the STRING the product emits

// cycle length
const seen = new Map();
let cycle = 0;
for (let i = 0; i < 100000; i++) {
  const h = hueAt(i);
  if (seen.has(h)) {
    cycle = i - seen.get(h);
    break;
  }
  seen.set(h, i);
}
console.log(`CYCLE: distinct hues = ${seen.size}, repeats at index ${cycle}`);

// min separation among the first N
for (const N of [4, 8, 16, 40, 144]) {
  let min = 360,
    pair = null;
  for (let i = 0; i < N; i++)
    for (let j = i + 1; j < N; j++) {
      const d = hueGap(hueAt(i), hueAt(j));
      if (d < min) {
        min = d;
        pair = [i, j];
      }
    }
  console.log(`MIN-HUE-GAP over first ${N}: ${min.toFixed(1)}deg  (i=${pair[0]}, j=${pair[1]})`);
}

// ── contrast over the full cycle ────────────────────────────────────────────────
function sweep(L, grounds, label) {
  const rows = [];
  let outOfGamut = 0;
  for (let i = 0; i < 144; i++) {
    const h = hueAt(i);
    const raw = oklchToLinear(L, CHROMA, h);
    if (!inGamut(raw)) outOfGamut++;
    const c = clip(raw);
    const r = {};
    for (const [g, ground] of Object.entries(grounds)) r[g] = ratio(c, ground);
    rows.push({ i, h, ...r });
  }
  for (const g of Object.keys(grounds)) {
    const worst = rows.reduce((a, b) => (a[g] <= b[g] ? a : b));
    const best = rows.reduce((a, b) => (a[g] >= b[g] ? a : b));
    console.log(
      `${label} vs ${g}: worst ${worst[g].toFixed(2)}:1 @ i=${worst.i} (h=${worst.h}) · best ${best[g].toFixed(2)}:1 @ i=${best.i}`,
    );
  }
  console.log(`${label}: out-of-sRGB-gamut indices = ${outOfGamut}/144`);
  return rows;
}
console.log("\n── CONTRAST, full 144-index cycle ──");
const lightRows = sweep(L_LIGHT, { bg: G.lightBg, card: G.lightCard }, "light L=0.5");
const darkRows = sweep(L_DARK, { bg: G.darkBg, card: G.darkCard }, "dark  L=0.8");

// AA floors
for (const [label, rows, keys, floor] of [
  ["light", lightRows, ["bg", "card"], 4.5],
  ["dark", darkRows, ["bg", "card"], 4.5],
]) {
  const fails = rows.filter((r) => keys.some((k) => r[k] < floor));
  console.log(`${label}: indices under AA 4.5:1 = ${fails.length}/144`);
}
// non-text 3:1 floor (the swatch dot, the ring)
for (const [label, rows] of [
  ["light", lightRows],
  ["dark", darkRows],
]) {
  const fails = rows.filter((r) => r.bg < 3 || r.card < 3);
  console.log(`${label}: indices under non-text 3:1 = ${fails.length}/144`);
}

// ── the reserved inks: the collision set ────────────────────────────────────────
const RESERVED = {
  "user-ink (light, YOUR ink)": "#2563eb",
  "user-ink (dark, YOUR ink)": "#60a5fa",
  "focus-sketch (light)": "#3a7bc4",
  "crayon-blue (light)": "#4a90d9",
  "crayon-blue (dark, =focus dark)": "#6aabeb",
  "teacher-red / crayon-rose (light)": "#e8315b",
  "teacher-red / crayon-rose (dark)": "#ff5c7c",
  "red-ink (light)": "#d02a52",
  "progress-ink (light)": "#8b5cf6",
  "progress-ink (dark)": "#7c3aed",
  "gold-star / crayon-gold (light)": "#c99a2e",
  "gold-star / crayon-gold (dark)": "#e5c74d",
  "crayon-green (light)": "#2dc653",
  "crayon-orange (light)": "#f4a236",
  "green-ink (light)": "#1d7f35",
  "orange-ink (light)": "#a26009",
  "gold-ink (light)": "#8c691d",
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
};
console.log("\n── THE COLLISION SET: nearest peer index to each reserved ink ──");
console.log("name | ok hue | nearest i (of first 16) | dHue | nearest i (of 144) | dHue");
const rowsOut = [];
for (const [name, hex] of Object.entries(RESERVED)) {
  const ok = okOf(hexToLinear(hex));
  const near = (N) => {
    let best = { i: -1, d: 360 };
    for (let i = 0; i < N; i++) {
      const d = hueGap(hueAt(i), ok.h);
      if (d < best.d) best = { i, d };
    }
    return best;
  };
  const n16 = near(16),
    n144 = near(144);
  rowsOut.push({ name, hex, h: ok.h, L: ok.L, C: ok.C, n16, n144 });
  console.log(
    `${name.padEnd(36)} h=${ok.h.toFixed(1).padStart(5)} L=${ok.L.toFixed(3)} C=${ok.C.toFixed(3)} | i16=${String(n16.i).padStart(3)} d=${n16.d.toFixed(1).padStart(5)} | i144=${String(n144.i).padStart(3)} d=${n144.d.toFixed(1).padStart(5)}`,
  );
}
const under30 = rowsOut.filter((r) => r.n16.d < 30);
console.log(`\nreserved inks within 30deg of one of the FIRST 16 peer hues: ${under30.length}`);
for (const r of under30)
  console.log(`  ${r.name} — peer index ${r.n16.i} (h=${hueAt(r.n16.i)}) is ${r.n16.d.toFixed(1)}deg away`);

// ── the first sixteen, printed as the room actually sees them ───────────────────
console.log("\n── THE FIRST SIXTEEN (a room's realistic span) ──");
console.log("i | hue | light hex / vs card | dark hex / vs card");
for (let i = 0; i < 16; i++) {
  const h = hueAt(i);
  const lRGB = clip(oklchToLinear(L_LIGHT, CHROMA, h));
  const dRGB = clip(oklchToLinear(L_DARK, CHROMA, h));
  const hexOf = (rgb) =>
    "#" + rgb.map((v) => Math.round(srgb(v) * 255).toString(16).padStart(2, "0")).join("");
  console.log(
    `${String(i).padStart(2)} | ${String(h).padStart(5)} | ${hexOf(lRGB)} ${ratio(lRGB, G.lightCard).toFixed(2)}:1 | ${hexOf(dRGB)} ${ratio(dRGB, G.darkCard).toFixed(2)}:1`,
  );
}
