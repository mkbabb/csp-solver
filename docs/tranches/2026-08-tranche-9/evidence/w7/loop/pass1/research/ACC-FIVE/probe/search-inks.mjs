/**
 * search-inks.mjs — the FIVE-crayon ink search, run on the grounds the engine painted
 * (`readings/grounds.json`, taken off the live page in both engines and both themes).
 *
 * The house's ink-tier move, stated as an algorithm rather than as taste: hold the
 * crayon's OKLCH HUE, hold as much chroma as the sRGB gamut allows there, and walk
 * LIGHTNESS until the floor is cleared. `red-ink`/`green-ink`/`orange-ink`/`gold-ink`
 * are four worked examples of it; this script asks the same question for blue and for
 * gold, and — the part that matters — prints the FEASIBLE WINDOW, not just an answer,
 * so the next pass can see how much headroom the family is buying.
 *
 * Every ratio is taken on the COMPOSITE the reader receives: a stroke at
 * `stroke-opacity 0.95` is 95% ink over its own ground, never the declared hex.
 *
 *   node probe/search-inks.mjs      (writes readings/ink-search.json)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { rgbToOklch, oklchToRgb, hueDist, ratio, over, hex, lum } from "./oklch.mjs";

const HERE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-FIVE";
const G = JSON.parse(readFileSync(`${HERE}/readings/grounds.json`, "utf8")).chromium;

const rgb = (theme, tok) => {
  const [r, g, b] = G[theme][tok].rgb;
  return { r, g, b };
};
const KIN_DEG = 5;

/** Max in-gamut chroma at (L, h), to 0.001. */
function maxChroma(L, h) {
  let lo = 0;
  let hi = 0.4;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (oklchToRgb(L, mid, h).inGamut) lo = mid;
    else hi = mid;
  }
  return Math.floor(lo * 1000) / 1000;
}

/**
 * Walk L over a locked hue; at each L take chroma = min(capC, gamut max); report every
 * ratio the caller asked for, and whether the row clears its floors.
 */
function sweep({ h, capC, alpha, tests, Lmin = 0.2, Lmax = 0.85, step = 0.002 }) {
  const rows = [];
  for (let L = Lmin; L <= Lmax + 1e-9; L += step) {
    const C = Math.min(capC, maxChroma(L, h));
    const c = oklchToRgb(L, C, h);
    const back = rgbToOklch(c.r, c.g, c.b);
    const row = {
      L: +L.toFixed(3),
      C: +C.toFixed(3),
      hex: hex(c),
      hRoundTrip: +back.h.toFixed(1),
      dHue: +hueDist(back.h, h).toFixed(2),
      ratios: {},
      ok: true,
    };
    for (const t of tests) {
      const composite = alpha < 1 ? over({ ...c, a: alpha }, t.ground) : c;
      const r = ratio(composite, t.ground);
      row.ratios[t.name] = +r.toFixed(2);
      if (r < t.floor) row.ok = false;
    }
    if (row.dHue > KIN_DEG) row.ok = false;
    rows.push(row);
  }
  return rows;
}

const window_ = (rows) => {
  const ok = rows.filter((r) => r.ok);
  return ok.length
    ? { lo: ok[0].L, hi: ok[ok.length - 1].L, count: ok.length, rows: ok }
    : { lo: null, hi: null, count: 0, rows: [] };
};

const out = { grounds: {}, anchors: {}, blueInk: {}, goldProgress: {}, incumbents: {} };

for (const th of ["light", "dark"]) {
  out.grounds[th] = {
    card: G[th]["--color-card"].css,
    background: G[th]["--color-background"].css,
    gridLine: G[th]["--grid-line-color"].css,
  };
  out.anchors[th] = Object.fromEntries(
    ["green", "orange", "rose", "blue", "gold"].map((n) => {
      const t = G[th][`--color-crayon-${n}`];
      return [n, { css: t.css, L: t.L, C: t.C, h: t.h }];
    }),
  );
}

/* ── the incumbents, re-derived so every claim below has its before ─────────── */
{
  const rows = {};
  const price = (label, theme, tok, alpha, grounds) => {
    const c = rgb(theme, tok);
    const o = rgbToOklch(c.r, c.g, c.b);
    rows[label] = {
      theme,
      token: tok,
      css: G[theme][tok].css,
      L: +o.L.toFixed(4),
      C: +o.C.toFixed(4),
      h: +o.h.toFixed(1),
      alpha,
      ratios: Object.fromEntries(
        grounds.map((g) => {
          const gc = rgb(theme, g);
          return [g, +ratio(alpha < 1 ? over({ ...c, a: alpha }, gc) : c, gc).toFixed(2)];
        }),
      ),
    };
  };
  for (const th of ["light", "dark"]) {
    price(`user-ink ${th}`, th, "--color-user-ink", 1, ["--color-card", "--color-background"]);
    price(`focus-sketch ${th} @0.9`, th, "--color-focus-sketch", 0.9, ["--color-card"]);
    price(`crayon-blue ${th} @0.9`, th, "--color-crayon-blue", 0.9, ["--color-card"]);
    price(`progress-ink ${th} @0.95`, th, "--color-progress-ink", 0.95, [
      "--grid-line-color",
      "--color-card",
    ]);
    price(`crayon-gold ${th} @0.95`, th, "--color-crayon-gold", 0.95, [
      "--grid-line-color",
      "--color-card",
    ]);
    price(`gold-ink ${th} @0.95`, th, "--color-gold-ink", 0.95, [
      "--grid-line-color",
      "--color-card",
    ]);
    price(`crayon-blue ${th} wash7`, th, "--color-crayon-blue", 0.07, ["--color-card"]);
  }
  out.incumbents = rows;
}

/* ── BLUE-INK: crayon-blue's hue, darkened to the AA TEXT floor ─────────────── */
for (const th of ["light", "dark"]) {
  const h = G[th]["--color-crayon-blue"].h;
  const tests = [
    { name: "--color-card", ground: rgb(th, "--color-card"), floor: 4.5 },
    { name: "--color-background", ground: rgb(th, "--color-background"), floor: 4.5 },
  ];
  const rows = sweep({ h, capC: 0.4, alpha: 1, tests, Lmin: 0.2, Lmax: 0.95 });
  const w = window_(rows);
  out.blueInk[th] = {
    lockedHue: h,
    feasible: { Lmin: w.lo, Lmax: w.hi, n: w.count },
    // the pick: the LIGHTEST L that still clears both floors is the smallest change to
    // the digit's weight; report it and its neighbours either side.
    pick: th === "light" ? w.rows[w.rows.length - 1] : w.rows[0],
    frontier: w.rows.filter((_, i) => i % 5 === 0 || i === w.rows.length - 1),
  };
}

/* ── GOLD PROGRESS: the trace at 0.95 must clear 3:1 over the frame AND the paper ── */
for (const th of ["light", "dark"]) {
  const h = G[th]["--color-crayon-gold"].h;
  const tests = [
    { name: "--grid-line-color", ground: rgb(th, "--grid-line-color"), floor: 3 },
    { name: "--color-card", ground: rgb(th, "--color-card"), floor: 3 },
  ];
  const rows = sweep({ h, capC: 0.4, alpha: 0.95, tests, Lmin: 0.2, Lmax: 0.95 });
  const w = window_(rows);
  // the pick maximises the MINIMUM of the two ratios: the trace is squeezed between a
  // dark frame and a light paper (light) or a light frame and a dark paper (dark), so
  // the middle of the window is the only place with headroom on both sides.
  let pick = null;
  let best = -1;
  for (const r of w.rows) {
    const m = Math.min(...Object.values(r.ratios));
    if (m > best) {
      best = m;
      pick = r;
    }
  }
  out.goldProgress[th] = {
    lockedHue: h,
    feasible: { Lmin: w.lo, Lmax: w.hi, n: w.count },
    pick,
    worstRatioAtPick: pick ? +best.toFixed(2) : null,
    frontier: w.rows.filter((_, i) => i % 5 === 0 || i === w.rows.length - 1),
  };
}

/* ── the relative-luminance band the trace must live in, stated directly ────── */
out.luminanceBands = {};
for (const th of ["light", "dark"]) {
  const gl = rgb(th, "--grid-line-color");
  const cd = rgb(th, "--color-card");
  const Lg = lum(gl.r, gl.g, gl.b);
  const Lc = lum(cd.r, cd.g, cd.b);
  out.luminanceBands[th] = {
    gridLineLum: +Lg.toFixed(4),
    cardLum: +Lc.toFixed(4),
    note: "opaque bounds; the 0.95 composite narrows both ends",
    needVsGrid: th === "light" ? `>= ${(3 * (Lg + 0.05) - 0.05).toFixed(4)}` : `<= ${((Lg + 0.05) / 3 - 0.05).toFixed(4)}`,
    needVsCard: th === "light" ? `<= ${((Lc + 0.05) / 3 - 0.05).toFixed(4)}` : `>= ${(3 * (Lc + 0.05) - 0.05).toFixed(4)}`,
  };
}

writeFileSync(`${HERE}/readings/ink-search.json`, JSON.stringify(out, null, 2));

const p = (o) => console.log(JSON.stringify(o));
console.log("== anchors ==");
p(out.anchors);
console.log("== incumbents ==");
for (const [k, v] of Object.entries(out.incumbents))
  console.log(k.padEnd(28), v.css.padEnd(20), "h", String(v.h).padStart(6), "C", v.C, JSON.stringify(v.ratios));
console.log("== blue-ink ==");
for (const th of ["light", "dark"])
  console.log(th, "hue", out.blueInk[th].lockedHue, "window L", out.blueInk[th].feasible, "pick", JSON.stringify(out.blueInk[th].pick));
console.log("== gold progress ==");
for (const th of ["light", "dark"])
  console.log(th, "hue", out.goldProgress[th].lockedHue, "window L", out.goldProgress[th].feasible, "pick", JSON.stringify(out.goldProgress[th].pick), "worst", out.goldProgress[th].worstRatioAtPick);
console.log("== luminance bands ==");
p(out.luminanceBands);
