#!/usr/bin/env node
// PAL-WALK pass-3 research — every number re-derived from the tree at the NEW base 74a2b5d9.
// Read-only. No product file touched, no server started.
//
// It re-derives: the chromatic census and the reserved arcs; the walk (STEP over the open
// complement, chromaAt by bisection, intoArc); ΔE to the house inks; the house's own nearest
// pair (the 0.0764 citation); peer-vs-peer capacity; the chroma spread; AA on four grounds;
// and — the row the chair's §6.6 ruling makes decisive — the RING'S CONTRAST at every candidate
// stroke-opacity, composited the way the cascade composites it.
import { readFileSync } from "node:fs";

const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const css = readFileSync(`${ROOT}/src/assets/index.css`, "utf8");

// ── colour ─────────────────────────────────────────────────────────────────────────────────
const srgbToLin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const linToSrgb = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

function hexToRgb(h) {
  const s = h.replace("#", "");
  const n = s.length === 3 ? s.split("").map((c) => c + c).join("") : s;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
}
function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const t = [[c,x,0],[x,c,0],[0,c,x],[0,x,c],[x,0,c],[c,0,x]][Math.floor(h / 60) % 6];
  return t.map((v) => v + m);
}
function rgbToOklab([r, g, b]) {
  const R = srgbToLin(r), G = srgbToLin(g), B = srgbToLin(b);
  const l = Math.cbrt(0.4122214708*R + 0.5363325363*G + 0.0514459929*B);
  const m = Math.cbrt(0.2119034982*R + 0.6806995451*G + 0.1073969566*B);
  const s = Math.cbrt(0.0883024619*R + 0.2817188376*G + 0.6299787005*B);
  return [
    0.2104542553*l + 0.7936177850*m - 0.0040720468*s,
    1.9779984951*l - 2.4285922050*m + 0.4505937099*s,
    0.0259040371*l + 0.7827717662*m - 0.8086757660*s,
  ];
}
const oklabToLch = ([L, a, b]) => [L, Math.hypot(a, b), ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360];
function oklchToRgb(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180), b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774*a + 0.2158037573*b) ** 3;
  const m = (L - 0.1055613458*a - 0.0638541728*b) ** 3;
  const s = (L - 0.0894841775*a - 1.2914855480*b) ** 3;
  return [
     4.0767416621*l - 3.3077115913*m + 0.2309699292*s,
    -1.2684380046*l + 2.6097574011*m - 0.3413193965*s,
    -0.0041960863*l - 0.7034186147*m + 1.7076147010*s,
  ];
}
const inGamut = (L, C, h) => oklchToRgb(L, C, h).every((v) => v >= -1e-4 && v <= 1.0001);
const clamp01 = (v) => Math.min(1, Math.max(0, v));
// what the ENGINE paints: OKLab → LINEAR sRGB (what `oklchToRgb` returns) → the transfer
// function → clip → the 8-bit byte triple. Skipping `linToSrgb` was this instrument's own
// first defect: it read every hand ~0.15 ΔE too far from the house and would have "proved"
// the law with a number about nobody.
const paintBytes = (L, C, h) => oklchToRgb(L, C, h).map((v) => Math.round(clamp01(linToSrgb(v)) * 255) / 255);
const dE = (p, q) => Math.hypot(p[0]-q[0], p[1]-q[1], p[2]-q[2]);
const relLum = ([r, g, b]) => 0.2126*srgbToLin(r) + 0.7152*srgbToLin(g) + 0.0722*srgbToLin(b);
const contrast = (a, b) => {
  const [x, y] = [relLum(a), relLum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const over = (fg, bg, alpha) => fg.map((v, i) => v * alpha + bg[i] * (1 - alpha));

// ── the token census, per arm, from the sheet ──────────────────────────────────────────────
// THE ARMS ARE BLOCKS, NOT SUFFIXES. Slicing "everything after `.dark`" swallows `@media print`
// (`index.css:894`) and `@media (forced-colors: active)` (`:946`), which re-pitch
// `--grid-line-color` to pure black and `--color-user-ink` to #000 — so a reader that takes the
// LAST declaration reads a dark peer ring against a PRINT graphite. Brace-matched here.
const darkAt = css.indexOf("\n.dark");
function block(src, from) {
  const open = src.indexOf("{", from);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}" && --depth === 0) return src.slice(open + 1, i);
  }
  return src.slice(open + 1);
}
const lightSrc = css.slice(0, darkAt);
const darkSrc = block(css, darkAt);
function decls(src) {
  const out = {};
  // hex and hsl() declarations of --color-* / --peer-* tokens
  for (const m of src.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8}|hsl\([^)]*\))\s*;/g)) {
    const [, name, val] = m;
    let rgb = null;
    if (val.startsWith("#")) rgb = hexToRgb(val.slice(0, 7));
    else {
      const n = val.match(/-?[\d.]+/g).map(Number);
      rgb = hslToRgb(n[0], n[1], n[2]);
    }
    out[name] = { raw: val, rgb };
  }
  return out;
}
// ALIASES ARE COLOURS TOO. The dark block collapses four ink tiers onto the wax
// (`--color-gold-ink: var(--color-crayon-gold)` …). A gate that reads the sheet by regex and
// stops at hex/hsl keeps the LIGHT value for those four tokens in its dark arm — a var is not a
// colour, exactly as a name is not a colour. Resolved here, and the cost of not resolving it is
// reported (`census.aliasDefect`).
function aliases(src) {
  const out = {};
  for (const m of src.matchAll(/(--[\w-]+)\s*:\s*var\(\s*(--[\w-]+)\s*\)\s*;/g)) out[m[1]] = m[2];
  return out;
}
function resolve(base, aliasMap) {
  const out = { ...base };
  for (const [name, target] of Object.entries(aliasMap)) {
    let t = target, guard = 0;
    while (aliasMap[t] && guard++ < 8) t = aliasMap[t];
    if (out[t]) out[name] = { raw: `var(${target}) → ${out[t].raw}`, rgb: out[t].rgb };
  }
  return out;
}
const light = resolve(decls(lightSrc), aliases(lightSrc));
const darkRaw = { ...light, ...decls(darkSrc) };
// AND THE ALIAS MAP IS THE SHEET'S, NOT THE BLOCK'S. `--color-teacher-red` and
// `--color-pencil-graphite` are declared ONCE, in `:root`, as `var(--color-crayon-rose)` /
// `var(--grid-line-color)`; the cascade re-resolves them per theme because the TARGET has a
// dark arm. A reader that only applies the dark block's own aliases keeps the light value for
// both — which is how this instrument first read a dark peer ring against a light graphite.
const dark = resolve(darkRaw, { ...aliases(lightSrc), ...aliases(darkSrc) });

const CHROMA_GATE = 0.06;
function chromatic(arm) {
  const rows = [];
  for (const [name, v] of Object.entries(arm)) {
    const [L, C, h] = oklabToLch(rgbToOklab(v.rgb));
    if (C > CHROMA_GATE) rows.push({ name, raw: v.raw, L, C, h });
  }
  return rows.sort((a, b) => a.h - b.h);
}
const chrLight = chromatic(light), chrDark = chromatic(dark);
const allChr = [...chrLight, ...chrDark];
// the price of the alias defect, stated: what the unresolved dark arm would have reserved
const chrDarkUnresolved = chromatic(darkRaw);
const aliasDefect = {
  darkResolved: chrDark.length, darkUnresolved: chrDarkUnresolved.length,
  wrongHues: chrDarkUnresolved
    .filter((r) => { const t = chrDark.find((x) => x.name === r.name); return t && Math.abs(t.h - r.h) > 0.01; })
    .map((r) => ({ token: r.name, unresolvedHue: +r.h.toFixed(2), trueHue: +chrDark.find((x) => x.name === r.name).h.toFixed(2) })),
};

const GUARD = 13;
function arcs(rows) {
  const spans = rows.map((r) => [r.h - GUARD, r.h + GUARD]).flatMap(([a, b]) =>
    a < 0 ? [[0, b], [a + 360, 360]] : b > 360 ? [[a, 360], [0, b - 360]] : [[a, b]],
  ).sort((p, q) => p[0] - q[0]);
  const merged = [];
  for (const [a, b] of spans) {
    const last = merged[merged.length - 1];
    if (last && a <= last[1]) last[1] = Math.max(last[1], b);
    else merged.push([a, b]);
  }
  return merged;
}
const RESERVED = arcs(allChr);

// ── the walk, exactly as the module writes it ──────────────────────────────────────────────
const OPEN = [];
{ let cut = 0; for (const [a, b] of RESERVED) { if (a > cut) OPEN.push([cut, a]); cut = Math.max(cut, b); } if (cut < 360) OPEN.push([cut, 360]); }
const SPAN = OPEN.reduce((s, [a, b]) => s + (b - a), 0);
const STEP = SPAN * ((3 - Math.sqrt(5)) / 2);
const intoArc = (h, a, b) => Math.min(Math.max(Math.round(h*100)/100, Math.ceil(a*100)/100), Math.floor(b*100)/100);
function hueAt(i) {
  let p = (((i * STEP) % SPAN) + SPAN) % SPAN;
  for (const [a, b] of OPEN) { if (p < b - a) return intoArc(a + p, a, b); p -= b - a; }
  const [a, b] = OPEN[OPEN.length - 1]; return intoArc(b, a, b);
}
const CAP = 0.215;
const BAND = { light: 0.44, dark: 0.65 };
function chromaAt(h) {
  const holds = (c) => inGamut(BAND.light, c, h) && inGamut(BAND.dark, c, h);
  if (holds(CAP)) return CAP;
  let lo = 0, hi = CAP;
  for (let k = 0; k < 20; k++) { const m = (lo + hi) / 2; if (holds(m)) lo = m; else hi = m; }
  return lo;
}
const N = 144;
const hands = Array.from({ length: N }, (_, i) => {
  const h = hueAt(i), c = chromaAt(h);
  return { i, h, c, light: paintBytes(BAND.light, c, h), dark: paintBytes(BAND.dark, c, h) };
});

// ── the 0.0764 citation, re-derived ────────────────────────────────────────────────────────
function nearestHousePair(rows, label) {
  let best = null;
  for (let a = 0; a < rows.length; a++) for (let b = a + 1; b < rows.length; b++) {
    const d = dE(rgbToOklab((label === "light" ? light : dark)[rows[a].name].rgb),
                 rgbToOklab((label === "light" ? light : dark)[rows[b].name].rgb));
    if (!best || d < best.d) best = { d, a: rows[a].name, b: rows[b].name };
  }
  return best;
}
const crayonsOnly = (rows) => rows.filter((r) => /^--color-crayon-/.test(r.name));
const REF = {
  crayons_light: nearestHousePair(crayonsOnly(chrLight), "light"),
  crayons_dark: nearestHousePair(crayonsOnly(chrDark), "dark"),
  allchromatic_light: nearestHousePair(chrLight, "light"),
  allchromatic_dark: nearestHousePair(chrDark, "dark"),
};

// ── ΔE hand → nearest house ink, per arm ───────────────────────────────────────────────────
function nearestInk(hand, arm, rows) {
  let best = null;
  for (const r of rows) {
    const d = dE(rgbToOklab(hand[arm]), rgbToOklab((arm === "light" ? light : dark)[r.name].rgb));
    if (!best || d < best.d) best = { d, token: r.name };
  }
  return best;
}
const near = { light: hands.map((x) => nearestInk(x, "light", chrLight)),
               dark: hands.map((x) => nearestInk(x, "dark", chrDark)) };
const REFERENCE = REF.crayons_light.d;

// ── peer-vs-peer capacity ──────────────────────────────────────────────────────────────────
function minPair(n, arm) {
  let m = Infinity, at = null;
  for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) {
    const d = dE(rgbToOklab(hands[a][arm]), rgbToOklab(hands[b][arm]));
    if (d < m) { m = d; at = [a, b]; }
  }
  return { min: m, at };
}

// ── AA on the four grounds ─────────────────────────────────────────────────────────────────
const GROUNDS = ["--color-background", "--color-card", "--color-popover"];
function aaRows(arm) {
  const tk = arm === "light" ? light : dark;
  const out = {};
  for (const g of GROUNDS) {
    let worst = null;
    for (const hd of hands) {
      const r = contrast(hd[arm], tk[g].rgb);
      if (!worst || r < worst.r) worst = { r, i: hd.i };
    }
    out[g] = worst;
  }
  // the selection wash: crayon-blue at 8% over the card (gameCell.css `.cell-peer`)
  const wash = over(tk["--color-crayon-blue"].rgb, tk["--color-card"].rgb, 0.08);
  let worst = null;
  for (const hd of hands) { const r = contrast(hd[arm], wash); if (!worst || r < worst.r) worst = { r, i: hd.i }; }
  out["selection-wash(8% crayon-blue over card)"] = worst;
  return out;
}

// ── §6.6 · THE RING SURVIVAL TABLE ─────────────────────────────────────────────────────────
// The tier-4 rule paints, on the cell's own ground:
//   fill   = ink at fill-opacity 0.04        (gameCell.css:231)
//   stroke = ink at stroke-opacity ALPHA     (gameCell.css:234)
// 1.4.11 asks a non-text control's boundary for 3:1 against ADJACENT colour. The two adjacent
// colours a ring has are (a) its own fill inside it and (b) the bare cell ground outside it.
// Both are priced. A `.cell-peer` wash may also sit under it (your own selection's reach).
const RING_CANDIDATES = [0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.9, 0.95];
function ringRows(arm) {
  const tk = arm === "light" ? light : dark;
  const card = tk["--color-card"].rgb, bg = tk["--color-background"].rgb;
  const out = {};
  for (const alpha of RING_CANDIDATES) {
    let vsFill = null, vsGround = null, under3vsFill = 0, under3vsGround = 0;
    for (const hd of hands) {
      const ink = hd[arm];
      const fill = over(ink, card, 0.04);
      const stroke = over(ink, card, alpha);          // stroke paints over the cell ground
      const strokeOnFill = over(ink, fill, alpha);    // and the fill is under it inside the box
      const rF = contrast(strokeOnFill, fill);
      const rG = contrast(stroke, card);
      if (!vsFill || rF < vsFill.r) vsFill = { r: rF, i: hd.i };
      if (!vsGround || rG < vsGround.r) vsGround = { r: rG, i: hd.i };
      if (rF < 3) under3vsFill++;
      if (rG < 3) under3vsGround++;
    }
    out[alpha] = {
      worstVsOwnFill: vsFill, under3_vsOwnFill: under3vsFill,
      worstVsCardGround: vsGround, under3_vsCardGround: under3vsGround,
      bareCardVsBackground: contrast(card, bg),
    };
  }
  // tier 1's own hover ring, for the rank: graphite at 0.65 over the card.
  const gr = tk["--color-pencil-graphite"] ?? null;
  return { rows: out, tier1: gr ? { ink: gr.raw, at065: contrast(over(gr.rgb, card, 0.65), card) } : null };
}

// ── the chroma spread ──────────────────────────────────────────────────────────────────────
const cs = hands.map((h) => h.c).sort((a, b) => a - b);
const spread = {
  min: cs[0], median: cs[Math.floor(cs.length / 2)], max: cs[cs.length - 1],
  mean: cs.reduce((a, b) => a + b, 0) / cs.length,
  atCap: cs.filter((c) => c >= CAP - 1e-9).length,
  ratio: cs[cs.length - 1] / cs[0],
  minIndex: hands.find((h) => h.c === cs[0]).i,
  // is a floor hand still A COLOUR? price it against the gate's own chromatic threshold and
  // against the neutral it would be mistaken for (same L, chroma 0).
  floorVsNeutral: (() => {
    const h = hands.find((x) => x.c === cs[0]);
    return {
      light: dE(rgbToOklab(h.light), rgbToOklab(paintBytes(BAND.light, 0, h.h))),
      dark: dE(rgbToOklab(h.dark), rgbToOklab(paintBytes(BAND.dark, 0, h.h))),
      timesTheGate: cs[0] / CHROMA_GATE,
    };
  })(),
};

// ── §3's renames: what a 30th chromatic token does to the two thresholds ───────────────────
// Sweep a hypothetical new chromatic token around the wheel at the estate's own median chroma
// and report where tier 3's two assertions break.
function sweepNewToken() {
  const worst = { redsNearest: [], redsUnderRef: [], safeSpan: 0 };
  for (let h = 0; h < 360; h += 1) {
    const r2 = arcs([...allChr, { name: "--color-new", h, C: 0.15, L: 0.5 }]);
    const open2 = []; { let cut = 0; for (const [a, b] of r2) { if (a > cut) open2.push([cut, a]); cut = Math.max(cut, b); } if (cut < 360) open2.push([cut, 360]); }
    const span2 = open2.reduce((s, [a, b]) => s + (b - a), 0);
    if (span2 <= 0) { worst.redsNearest.push(h); continue; }
    const step2 = span2 * ((3 - Math.sqrt(5)) / 2);
    const hue2 = (i) => { let p = (((i * step2) % span2) + span2) % span2; for (const [a, b] of open2) { if (p < b - a) return intoArc(a + p, a, b); p -= b - a; } const [a, b] = open2[open2.length - 1]; return intoArc(b, a, b); };
    let minNear = Infinity, underRef = 0;
    for (let i = 0; i < N; i++) {
      const hh = hue2(i), cc = chromaAt(hh), px = paintBytes(BAND.light, cc, hh);
      const nn = nearestInk({ light: px }, "light", chrLight);
      if (nn.d < minNear) minNear = nn.d;
      if (nn.d < REFERENCE) underRef++;
    }
    if (minNear < 0.07) worst.redsNearest.push(h);
    if (underRef > 5) worst.redsUnderRef.push(h);
  }
  worst.safeSpan = 360 - new Set([...worst.redsNearest, ...worst.redsUnderRef]).size;
  return worst;
}

// ── report ─────────────────────────────────────────────────────────────────────────────────
const R = {
  base: "74a2b5d9 (index.css byte-identical to a8fee1f5 — the fold touched neither this file nor any PAL-WALK product file)",
  census: {
    chromaGate: CHROMA_GATE,
    light: chrLight.length, dark: chrDark.length, union: allChr.length,
    reservedArcs: RESERVED.map(([a, b]) => [Number(a.toFixed(4)), Number(b.toFixed(4))]),
    openArcs: OPEN.map(([a, b]) => [Number(a.toFixed(4)), Number(b.toFixed(4))]),
    SPAN: Number(SPAN.toFixed(4)), STEP: Number(STEP.toFixed(4)),
    aliasDefect,
    canyon: (() => {
      const near06 = allChr.concat(
        Object.entries(light).map(([name, v]) => { const [L,C,h]=oklabToLch(rgbToOklab(v.rgb)); return {name,C,h,L}; }),
      );
      const below = near06.filter((r) => r.C <= CHROMA_GATE).map((r) => r.C).sort((a,b)=>b-a);
      const above = allChr.map((r) => r.C).sort((a,b)=>a-b);
      return { highestNonChromatic: below[0], lowestChromatic: above[0] };
    })(),
  },
  houseReference: REF,
  referenceUsed: REFERENCE,
  citation_0_0764: {
    claimedInSource: 0.0764,
    reDerived_crayonsOnly_light: REF.crayons_light,
    reDerived_crayonsOnly_dark: REF.crayons_dark,
    reDerived_allChromatic_light: REF.allchromatic_light,
    reDerived_allChromatic_dark: REF.allchromatic_dark,
  },
  walk: {
    n: N,
    nearestHouseInk: {
      light: near.light.reduce((w, x, i) => (!w || x.d < w.d ? { ...x, i } : w), null),
      dark: near.dark.reduce((w, x, i) => (!w || x.d < w.d ? { ...x, i } : w), null),
    },
    underReference: {
      light: near.light.filter((x) => x.d < REFERENCE).length,
      dark: near.dark.filter((x) => x.d < REFERENCE).length,
    },
    minHueGap: (() => { const hs = hands.map(h=>h.h).sort((a,b)=>a-b); let m=Infinity; for (let i=1;i<hs.length;i++) m=Math.min(m,hs[i]-hs[i-1]); return m; })(),
    duplicateHues: hands.length - new Set(hands.map((h) => h.h)).size,
    spread,
  },
  capacity: {
    light: Object.fromEntries([2,3,4,5,8,12,16].map((n) => [n, minPair(n, "light")])),
    dark: Object.fromEntries([2,3,4,5,8,12,16].map((n) => [n, minPair(n, "dark")])),
    holdsAtFloor: Object.fromEntries([REFERENCE, 0.05, 0.04, 0.03, 0.02].map((f) => {
      // the largest room whose CLOSEST pair still clears the floor, both arms
      const largest = (arm) => { let n = 2; while (n < 40 && minPair(n, arm).min >= f) n++; return n - 1; };
      return [f.toFixed(4), { light: largest("light"), dark: largest("dark") }];
    })),
  },
  aa: { light: aaRows("light"), dark: aaRows("dark") },
  ring: { light: ringRows("light"), dark: ringRows("dark") },
  section3Sweep: (() => { const s = sweepNewToken(); return {
    degreesThatRedNearest0_07: s.redsNearest.length,
    degreesThatRedUnderRefLE5: s.redsUnderRef.length,
    safeDegrees: s.safeSpan,
    firstFewRedNearest: s.redsNearest.slice(0, 12),
  }; })(),
};
console.log(JSON.stringify(R, null, 2));
