/**
 * separation.mjs — the three questions the first sweep leaves open, each answered with
 * a number instead of a preference:
 *
 *  A. THE WEIGHT-PRESERVING BLUE. `#0075cf` clears AA but reads LIGHTER than today's
 *     blue-600 (4.64 vs 5.08 on the card). Find the L at crayon-blue's locked hue that
 *     reproduces today's contrast EXACTLY, so the kinship is bought at zero cost to the
 *     digit's weight — and print the chroma the gamut allows along the way.
 *  B. PEN vs RING. One hue now carries the wash, the pen and the focus ring. Measure
 *     what is left to tell them apart: ΔL, ΔC, and the ratio of each against the other.
 *     If the pen and the ring land on the same mark, the family has traded a colour
 *     problem for a legibility one and must say so.
 *  C. THE SLIVER. Does one gold serve BOTH the verdict-text floor (>=4.5 on the card)
 *     and the trace's two 3:1 floors? If it does, `--color-progress-ink` can alias
 *     `--color-gold-ink` and the estate spends no new hex at all in light.
 *
 *   node probe/separation.mjs      (writes readings/separation.json)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { rgbToOklch, oklchToRgb, hueDist, ratio, over, hex, lum } from "./oklch.mjs";

const HERE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-FIVE";
const G = JSON.parse(readFileSync(`${HERE}/readings/grounds.json`, "utf8")).chromium;
const rgb = (t, k) => {
  const [r, g, b] = G[t][k].rgb;
  return { r, g, b };
};
function maxChroma(L, h) {
  let lo = 0,
    hi = 0.4;
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    if (oklchToRgb(L, m, h).inGamut) lo = m;
    else hi = m;
  }
  return Math.floor(lo * 1000) / 1000;
}
const out = {};

/* ── A. the weight-preserving blue ─────────────────────────────────────────── */
out.blueWeight = {};
for (const th of ["light", "dark"]) {
  const h = G[th]["--color-crayon-blue"].h;
  const card = rgb(th, "--color-card");
  const bg = rgb(th, "--color-background");
  const inc = rgb(th, "--color-user-ink");
  const target = ratio(inc, card);
  const rows = [];
  for (let L = 0.30; L <= 0.90; L += 0.001) {
    const C = maxChroma(L, h);
    const c = oklchToRgb(L, C, h);
    rows.push({
      L: +L.toFixed(3),
      C: +C.toFixed(3),
      hex: hex(c),
      card: +ratio(c, card).toFixed(3),
      bg: +ratio(c, bg).toFixed(3),
      dh: +hueDist(rgbToOklch(c.r, c.g, c.b).h, h).toFixed(2),
    });
  }
  // the row whose card ratio is nearest today's
  let bestW = rows[0];
  for (const r of rows) if (Math.abs(r.card - target) < Math.abs(bestW.card - target)) bestW = r;
  // the row with the MOST chroma that still clears AA on both papers
  const aa = rows.filter((r) => r.card >= 4.5 && r.bg >= 4.5);
  let bestC = aa[0];
  for (const r of aa) if (r.C > bestC.C) bestC = r;
  out.blueWeight[th] = {
    lockedHue: h,
    incumbent: {
      css: G[th]["--color-user-ink"].css,
      L: G[th]["--color-user-ink"].L,
      C: G[th]["--color-user-ink"].C,
      h: G[th]["--color-user-ink"].h,
      card: +target.toFixed(3),
      bg: +ratio(inc, bg).toFixed(3),
    },
    weightMatched: bestW,
    maxChromaAA: bestC,
    chromaPeak: rows.reduce((a, b) => (b.C > a.C ? b : a)),
  };
}

/* ── B. pen vs ring vs wash, on one hue ────────────────────────────────────── */
out.separation = {};
for (const th of ["light", "dark"]) {
  const card = rgb(th, "--color-card");
  const h = G[th]["--color-crayon-blue"].h;
  const ringTok = th === "light" ? "--color-focus-sketch" : "--color-crayon-blue"; // the proposed dark arm
  const ring = rgb(th, ringTok);
  const ringO = rgbToOklch(ring.r, ring.g, ring.b);
  const pens = {};
  for (const [name, hx] of Object.entries(out.blueWeight[th]).filter(([k]) =>
    ["weightMatched", "maxChromaAA"].includes(k),
  )) {
    const c = oklchToRgb(hx.L, hx.C, h);
    const o = rgbToOklch(c.r, c.g, c.b);
    // the composite the eye receives: the pen is opaque, the ring rides at 0.9
    const ringComp = over({ ...ring, a: 0.9 }, card);
    pens[name] = {
      hex: hx.hex,
      penL: +o.L.toFixed(4),
      penC: +o.C.toFixed(4),
      ringToken: ringTok,
      ringHex: G[th][ringTok].css,
      ringL: +ringO.L.toFixed(4),
      ringC: +ringO.C.toFixed(4),
      dL: +(o.L - ringO.L).toFixed(4),
      dC: +(o.C - ringO.C).toFixed(4),
      dHue: +hueDist(o.h, ringO.h).toFixed(2),
      penVsRingComposite: +ratio(c, ringComp).toFixed(2),
      penVsWash: +ratio(c, over({ ...rgb(th, "--color-crayon-blue"), a: 0.07 }, card)).toFixed(2),
    };
  }
  out.separation[th] = pens;
}

/* ── C. the sliver: one gold for the verdict AND the trace? ────────────────── */
out.goldSliver = {};
for (const th of ["light", "dark"]) {
  const h = G[th]["--color-crayon-gold"].h;
  const card = rgb(th, "--color-card");
  const grid = rgb(th, "--grid-line-color");
  const rows = [];
  for (let L = 0.35; L <= 0.95; L += 0.001) {
    const C = maxChroma(L, h);
    const c = oklchToRgb(L, C, h);
    const traceCard = ratio(over({ ...c, a: 0.95 }, card), card);
    const traceGrid = ratio(over({ ...c, a: 0.95 }, grid), grid);
    const textCard = ratio(c, card);
    const textBg = ratio(c, rgb(th, "--color-background"));
    const serves = traceCard >= 3 && traceGrid >= 3;
    const both = serves && textCard >= 4.5 && textBg >= 4.5;
    rows.push({
      L: +L.toFixed(3),
      C: +C.toFixed(3),
      hex: hex(c),
      traceGrid: +traceGrid.toFixed(2),
      traceCard: +traceCard.toFixed(2),
      textCard: +textCard.toFixed(2),
      textBg: +textBg.toFixed(2),
      serves,
      both,
    });
  }
  const bothRows = rows.filter((r) => r.both);
  const traceRows = rows.filter((r) => r.serves);
  out.goldSliver[th] = {
    lockedHue: h,
    traceWindow: traceRows.length
      ? { Lmin: traceRows[0].L, Lmax: traceRows[traceRows.length - 1].L, n: traceRows.length }
      : null,
    dualWindow: bothRows.length
      ? { Lmin: bothRows[0].L, Lmax: bothRows[bothRows.length - 1].L, n: bothRows.length, rows: bothRows }
      : null,
    goldInkToday: {
      css: G[th]["--color-gold-ink"].css,
      L: G[th]["--color-gold-ink"].L,
      h: G[th]["--color-gold-ink"].h,
      dHueToAnchor: +hueDist(G[th]["--color-gold-ink"].h, h).toFixed(2),
    },
    // the balanced trace pick: maximise the minimum of the two 3:1 ratios
    balanced: traceRows.reduce(
      (a, b) => (Math.min(b.traceGrid, b.traceCard) > Math.min(a.traceGrid, a.traceCard) ? b : a),
      traceRows[0],
    ),
  };
}

writeFileSync(`${HERE}/readings/separation.json`, JSON.stringify(out, null, 2));
console.log("== A. blue, weight-preserving ==");
for (const th of ["light", "dark"]) console.log(th, JSON.stringify(out.blueWeight[th]));
console.log("== B. pen vs ring ==");
for (const th of ["light", "dark"]) console.log(th, JSON.stringify(out.separation[th]));
console.log("== C. gold sliver ==");
for (const th of ["light", "dark"])
  console.log(
    th,
    "trace window",
    JSON.stringify(out.goldSliver[th].traceWindow),
    "dual",
    JSON.stringify(out.goldSliver[th].dualWindow ? { Lmin: out.goldSliver[th].dualWindow.Lmin, Lmax: out.goldSliver[th].dualWindow.Lmax, n: out.goldSliver[th].dualWindow.n, mid: out.goldSliver[th].dualWindow.rows[Math.floor(out.goldSliver[th].dualWindow.n / 2)] } : null),
    "balanced",
    JSON.stringify(out.goldSliver[th].balanced),
    "goldInkToday",
    JSON.stringify(out.goldSliver[th].goldInkToday),
  );
