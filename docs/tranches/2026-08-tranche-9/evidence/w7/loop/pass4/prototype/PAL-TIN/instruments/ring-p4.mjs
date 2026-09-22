#!/usr/bin/env node
/**
 * PAL-TIN pass-3 prototype · THE RING ARMS, PRICED.
 *
 * The chair (§6.6) keeps the peer ring at HEAD's `stroke-opacity: 0.55`, and the tin's DIGIT
 * ink reads 2.437 light / 2.280 dark against the ring's own 4% fill at that alpha — RED by
 * construction (research `readings/grounds.txt`). Only lightness can buy it back without
 * touching `gameCell.css`, so each stick gets a RING ARM: the same hue, the same chroma rule
 * (`min(0.215, chromaAt(L, h))`), at the section's own ring lightness.
 *
 * THE PIN RULE, the same one the sticks were cut with: the LIGHTEST light / DARKEST dark that
 * clears 3.0 PAINTED with >= 0.10 headroom, swept in 0.005 steps, never raised afterwards to
 * make a number pass. PAL-WALK's scalar (0.32 / 0.79) is the starting point and is REPORTED
 * beside the pin so the graft is visible.
 *
 * Usage: node ring.mjs  (zero dependency, read-only)
 */

// -- sRGB / OKLab / OKLCH -- Ottosson's matrices, the gate's own arithmetic ----------------
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const rgbOfHex = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
const hexOfRgb = (rgb) =>
  "#" +
  rgb
    .map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0"))
    .join("");
function oklabOfRgb([r, g, b]) {
  const [R, G, B] = [r, g, b].map(lin);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function rgbOfOklab([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(gam);
}
const rgbOfOklch = (L, C, hDeg) => {
  const h = (hDeg * Math.PI) / 180;
  return rgbOfOklab([L, C * Math.cos(h), C * Math.sin(h)]);
};
const inGamut = (rgb) => rgb.every((v) => v >= -1e-6 && v <= 1 + 1e-6);
function chromaAt(L, hDeg) {
  let lo = 0,
    hi = 0.5;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(rgbOfOklch(L, mid, hDeg))) lo = mid;
    else hi = mid;
  }
  return lo;
}
const lch = (hexStr) => {
  const [L, a, b] = oklabOfRgb(rgbOfHex(hexStr));
  return { L, C: Math.hypot(a, b), h: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360 };
};

// -- WCAG over the estate's own grounds ----------------------------------------------------
const hsl = (hDeg, sPct, lPct) => {
  const s = sPct / 100,
    l = lPct / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = hDeg / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const m = l - c / 2;
  const t = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][Math.floor(hp) % 6];
  return t.map((v) => v + m);
};
const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const over = (fg, a, bg) => fg.map((v, i) => a * v + (1 - a) * bg[i]);

const G = {
  light: { bg: hsl(48, 15, 98), card: hsl(48, 12, 99), popover: hsl(48, 10, 98.5) },
  dark: { bg: hsl(24, 8, 6), card: hsl(24, 6, 7), popover: hsl(24, 7, 6.5) },
};
/** the tin's digit sticks -- index.css:161-165 / :397-401 */
const TIN = {
  light: ["#853900", "#455c00", "#005f63", "#3e32c5", "#8b0081"],
  dark: ["#e06600", "#799f00", "#00a3aa", "#747eff", "#d64fc8"],
};
const NAMES = ["amber", "green", "teal", "violet", "pink"];
const CAP = 0.215; // --color-user-ink's own chroma; a stick is never louder than the ink it replaces
const ALPHA = 0.55; // gameCell.css:234, the chair's 6.6
const FILL = 0.04; // gameCell.css:231
const FLOOR = 3.0;
const HEADROOM = 0.1;
const WALK_L = { light: 0.32, dark: 0.79 };

/** the ring arm at lightness L for a stick's hue */
const armAt = (L, h) => hexOfRgb(rgbOfOklch(L, Math.min(CAP, chromaAt(L, h)), h));
/** PAINTED: the stroke at 0.55 over the paper, against its own 4% fill over the same paper */
const painted = (hexStr, ground) => {
  const ink = rgbOfHex(hexStr);
  return ratio(over(ink, ALPHA, ground), over(ink, FILL, ground));
};

const P = (s) => console.log(s);

P("PAL-TIN pass 3 -- THE RING ARMS, priced against gameCell.css's own 0.55 / 0.04");
P(`pin rule: lightest light / darkest dark clearing ${FLOOR} PAINTED with >= ${HEADROOM} headroom`);
P("");

const pinned = {};
for (const arm of ["light", "dark"]) {
  const bg = G[arm].bg;
  const hues = TIN[arm].map((h) => lch(h).h);
  const steps = [];
  for (let L = 0.2; L <= 0.95 + 1e-9; L += 0.005) steps.push(Math.round(L * 1000) / 1000);
  const clears = steps.filter((L) =>
    hues.every((h) => painted(armAt(L, h), bg) >= FLOOR + HEADROOM),
  );
  const pin = arm === "light" ? Math.max(...clears) : Math.min(...clears);
  pinned[arm] = pin;
  const walk = WALK_L[arm];
  const walkWorst = Math.min(...hues.map((h) => painted(armAt(walk, h), bg)));
  P(
    `-- ${arm.toUpperCase()} - walk's scalar ${walk} -> worst PAINTED ${walkWorst.toFixed(3)}` +
      `  ·  PINNED --peer-ring-l ${pin}`,
  );
  P(
    "stick    ring hex   ring h     ring C   stick h   dh     PAINTED@0.55  on --color-card  on --color-popover",
  );
  const rows = [];
  hues.forEach((h, i) => {
    const hexArm = armAt(pin, h);
    const a = lch(hexArm);
    const r = painted(hexArm, bg);
    const rCard = painted(hexArm, G[arm].card);
    const rPop = painted(hexArm, G[arm].popover);
    rows.push({ name: NAMES[i], hex: hexArm, h: a.h, C: a.C, dh: a.h - h, r, rCard, rPop });
    P(
      `${NAMES[i].padEnd(8)} ${hexArm}   ${a.h.toFixed(2).padStart(6)}  ${a.C.toFixed(4)}  ` +
        `${h.toFixed(2).padStart(6)}  ${(a.h - h).toFixed(2).padStart(6)}  ` +
        `${r.toFixed(3).padStart(11)}  ${rCard.toFixed(3).padStart(14)}  ${rPop.toFixed(3).padStart(17)}`,
    );
  });
  const worst = rows.reduce((m, x) => (x.r < m.r ? x : m));
  P(
    `WORST ${worst.name} ${worst.r.toFixed(3)} (headroom ${(worst.r - FLOOR).toFixed(3)})` +
      `  ·  teal ring chroma ${rows[2].C.toFixed(4)}  ·  max |dh| ${Math.max(
        ...rows.map((x) => Math.abs(x.dh)),
      ).toFixed(3)} deg`,
  );
  P("css:");
  rows.forEach((x, i) =>
    P(
      `  --color-peer-${i + 1}-ring: ${x.hex}; /* ${x.name.padEnd(6)} h ${x.h.toFixed(1)} C ${x.C.toFixed(3)} */`,
    ),
  );
  P("");
}

P("-- the 6.6 answer, restated: the DIGIT ink on opacity alone ----------------");
for (const arm of ["light", "dark"]) {
  const bg = G[arm].bg;
  for (const a of [0.55, 0.65, 0.8]) {
    const w = Math.min(
      ...TIN[arm].map((h) => {
        const ink = rgbOfHex(h);
        return ratio(over(ink, a, bg), over(ink, FILL, bg));
      }),
    );
    P(`${arm.padEnd(6)} digit ink @ alpha ${a}  worst ${w.toFixed(3)}`);
  }
}
P("");
P(`PINNED: --peer-ring-l ${pinned.light} light / ${pinned.dark} dark`);

// ── PASS 4 ADDENDUM (the chair's registry §2.4: ONE ring scalar for §11c, decided by PAINT) ──
// The arithmetic above pins 0.295/0.775 under the ≥0.10-headroom rule; PAL-WALK pins 0.32/0.79.
// The pass-4 decision is made by SAMPLED PIXELS (`e2e/peer-tin.spec.ts` §1b), which needs the
// ring arms AT WALK'S SCALAR as CSS to override on the live surface. They are printed here so
// the browser row and this table are the same numbers.
P("");
P("-- PASS 4: the ring arms AT PAL-WALK'S SCALAR (0.32 / 0.79), for the painted comparison --");
for (const arm of ["light", "dark"]) {
  const bg = G[arm].bg;
  const hues = TIN[arm].map((h) => lch(h).h);
  const L = WALK_L[arm];
  const hexes = hues.map((h) => armAt(L, h));
  const worst = Math.min(...hexes.map((h) => painted(h, bg)));
  P(`${arm.padEnd(6)} L ${L}  worst ARITHMETIC painted ${worst.toFixed(3)}`);
  hexes.forEach((h, i) =>
    P(`  --color-peer-${i + 1}-ring: ${h}; /* ${NAMES[i].padEnd(6)} ${painted(h, bg).toFixed(3)} */`),
  );
}
