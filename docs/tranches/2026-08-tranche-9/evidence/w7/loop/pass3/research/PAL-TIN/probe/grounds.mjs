#!/usr/bin/env node
/**
 * PAL-TIN pass-3 research · THE GROUNDS THE PASS-2 ARITHMETIC NEVER HAD.
 *
 * Read-only, zero-dependency, no browser. Three questions pass 2 did not ask:
 *
 *  1. The W7 EXECUTION FOLD (74a2b5d9, pick 3B-1) made the ATTRIBUTION TAPE wear the peer's
 *     own ink (`GameBoard.vue:1093` binds `hoveredAuthor.ink`; `:1240` colours the label
 *     `var(--color-user-ink)`). The tape's paper is `--sheet-washi-neutral` — a THIRD ground
 *     that did not exist when pass 2 measured AA on `--color-background` and `--color-card`.
 *  2. The chair (pass-3 §6.6) keeps the peer ring at HEAD's `stroke-opacity: 0.55`
 *     (`gameCell.css:234`; `e2e/join-language-prm.spec.ts:153` pins it). Pass 2's ring row was
 *     measured at 0.80. What does the tin's own ring read at each candidate alpha?
 *  3. A digit written by a peer sits UNDER the hint laminate's 15% teacher-red wash
 *     (`gameCell.css:139-147`). Nobody has priced a stick against that ground either.
 *
 * Usage: node grounds.mjs
 */

// ── colour ────────────────────────────────────────────────────────────────────────────────
const hex = (h) => {
  const s = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255);
};
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
const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
/** src-over: `fg` at alpha `a` over opaque `bg`. */
const over = (fg, a, bg) => fg.map((v, i) => a * v + (1 - a) * bg[i]);
/** CSS `color-mix(in srgb, c1 p, c2)` where c2 may carry alpha; returns [rgb, alpha]. */
const mix = (c1, p, a1, c2, a2) => {
  const w1 = p,
    w2 = 1 - p;
  const A = w1 * a1 + w2 * a2;
  const rgb = c1.map((v, i) => (w1 * a1 * v + w2 * a2 * c2[i]) / A);
  return [rgb, A];
};

// ── the estate's own bytes (index.css, HEAD 74a2b5d9) ─────────────────────────────────────
const G = {
  light: {
    bg: hsl(48, 15, 98), //  :134
    card: hsl(48, 12, 99), //  :136
    fg: hsl(0, 0, 3.9), //  :135
    washiTint: hsl(0, 0, 100), //  :286-290  hsl(0 0% 100% / 0.82)
    washiAlpha: 0.82,
    rose: hex("#e8315b"), //  :172  --color-crayon-rose → --color-teacher-red (:212)
    userInk: hex("#2563eb"), //  :151
  },
  dark: {
    bg: hsl(24, 8, 6), //  :363
    card: hsl(24, 6, 7), //  :365
    fg: hsl(48, 10, 92), //  :364
    washiTint: hsl(24, 5, 21), //  :427-431  hsl(24 5% 21% / 0.92)
    washiAlpha: 0.92,
    rose: hex("#ff5c7c"), //  :380
    userInk: hex("#60a5fa"), //  :372
  },
};

// The pass-2 tin (synthesize/PAL-TIN.md §1.2) — unchanged here; only the GROUNDS are new.
const TIN = {
  light: {
    "peer-1 amber": "#853900",
    "peer-2 green": "#455c00",
    "peer-3 teal": "#005f63",
    "peer-4 violet": "#3e32c5",
    "peer-5 pink": "#8b0081",
  },
  dark: {
    "peer-1 amber": "#e06600",
    "peer-2 green": "#799f00",
    "peer-3 teal": "#00a3aa",
    "peer-4 violet": "#747eff",
    "peer-5 pink": "#d64fc8",
  },
};

for (const arm of ["light", "dark"]) {
  const g = G[arm];
  // The tape's paper: color-mix(in srgb, foreground 6%, <tint>/<alpha>) over the page.
  const [tapeRgb, tapeA] = mix(g.fg, 0.06, 1, g.washiTint, g.washiAlpha);
  const tapeOverBg = over(tapeRgb, tapeA, g.bg);
  const tapeOverCard = over(tapeRgb, tapeA, g.card);
  // The hint laminate: teacher-red 15% over the paper (gameCell.css:139-147).
  const laminate = over(g.rose, 0.15, g.bg);
  const laminateHC = over(g.rose, 0.24, g.bg); // prefers-contrast: more (:158-170)

  console.log(`\n── ${arm.toUpperCase()} ─────────────────────────────────────────────`);
  console.log(
    `grounds: bg ${g.bg.map((v) => Math.round(v * 255))} · card ${g.card.map((v) => Math.round(v * 255))} · ` +
      `washi-over-bg ${tapeOverBg.map((v) => Math.round(v * 255))} (tape alpha ${tapeA.toFixed(4)}) · ` +
      `laminate15 ${laminate.map((v) => Math.round(v * 255))}`,
  );
  console.log(
    "stick            bg     card   TAPE   laminate  laminateHC   ring@0.55 ring@0.65 ring@0.80",
  );
  const worst = { tape: [1e9, ""], lam: [1e9, ""], r55: [1e9, ""], r80: [1e9, ""] };
  for (const [name, h] of Object.entries(TIN[arm])) {
    const ink = hex(h);
    const rBg = ratio(ink, g.bg);
    const rCard = ratio(ink, g.card);
    const rTape = ratio(ink, tapeOverBg);
    const rLam = ratio(ink, laminate);
    const rLamHC = ratio(ink, laminateHC);
    // The ring: stroke at alpha over the paper, against its OWN 4% fill over the same paper.
    const ringAt = (a) => ratio(over(ink, a, g.bg), over(ink, 0.04, g.bg));
    const r55 = ringAt(0.55),
      r65 = ringAt(0.65),
      r80 = ringAt(0.8);
    console.log(
      `${name.padEnd(15)} ${rBg.toFixed(3).padStart(6)} ${rCard.toFixed(3).padStart(6)} ` +
        `${rTape.toFixed(3).padStart(6)} ${rLam.toFixed(3).padStart(8)} ${rLamHC.toFixed(3).padStart(10)} ` +
        `${r55.toFixed(3).padStart(10)} ${r65.toFixed(3).padStart(9)} ${r80.toFixed(3).padStart(9)}`,
    );
    if (rTape < worst.tape[0]) worst.tape = [rTape, name];
    if (rLam < worst.lam[0]) worst.lam = [rLam, name];
    if (r55 < worst.r55[0]) worst.r55 = [r55, name];
    if (r80 < worst.r80[0]) worst.r80 = [r80, name];
  }
  // The incumbent, for scale: the local hand is never in the tin.
  const ui = g.userInk;
  console.log(
    `--color-user-ink  ${ratio(ui, g.bg).toFixed(3).padStart(6)} ${ratio(ui, g.card).toFixed(3).padStart(6)} ` +
      `${ratio(ui, tapeOverBg).toFixed(3).padStart(6)} ${ratio(ui, laminate).toFixed(3).padStart(8)} ` +
      `${ratio(ui, laminateHC).toFixed(3).padStart(10)} ` +
      `${ratio(over(ui, 0.55, g.bg), over(ui, 0.04, g.bg)).toFixed(3).padStart(10)}`,
  );
  console.log(
    `WORST  tape ${worst.tape[0].toFixed(3)} (${worst.tape[1]}) · laminate ${worst.lam[0].toFixed(3)} ` +
      `(${worst.lam[1]}) · ring@0.55 ${worst.r55[0].toFixed(3)} (${worst.r55[1]}) · ring@0.80 ${worst.r80[0].toFixed(3)}`,
  );
}

// ── the corner's geometry, re-derived per board size ──────────────────────────────────────
// useGameCell.ts:86-97 — the ghost svg's viewBox is the cell padded 15% each side, so the
// drawn rect spans [0.15, 1.15] / 1.3 of the cell and `stroke-width: 5` (gameCell.css:193)
// is 5/(1.3 · 1000/boardSize) of the cell. Tier 4 (the peer ring) is width 4 (:233).
// The FOURTH tenant: the grid line is centred on the cell edge and reaches
// 0.05 · w · boardSize cell-% INTO the cell (HandDrawnGrid.vue:339 frame w12, :353 subgrid w8,
// :366 cell line w5, all in the 1000-unit BOARD viewBox). The tick's own stroke is
// `3 · boardSize / 9` of a hundredth of a cell (PlayerTick.vue:96-100) with round caps, so the
// ink box is the authored band ± half of it.
console.log("\n── THE USABLE BAND, ALL FOUR TENANTS (cell-% / px) ──────────────────────");
console.log(
  "board  width  row-kind    lineIn  ringOut  band-top  band-bot  band%   tickStroke%   DRAWABLE px",
);
for (const [n, width] of [
  [9, 640],
  [9, 366],
  [16, 640],
  [16, 366],
]) {
  const cellPx = width / n;
  // wobbleRect's own amplitude: roughness 0.4 × edge length × 0.015 (pencil-boil path.js:63),
  // in cell-% — board-size independent, because both numerator and denominator scale.
  const wobble = ((0.4 * (1000 / n) * 0.015) / (1.3 * (1000 / n))) * 100;
  const ring = (1.15 / 1.3) * 100 + (5 / 2 / (1.3 * (1000 / n))) * 100 + wobble;
  const tick = (3 * n) / 9; // cell-% (of 100), the stroke
  for (const [kind, w] of [
    ["interior", 5],
    ["sub-grid", 8],
    ["frame", 12],
  ]) {
    const lineIn = 0.05 * w * n;
    const top = Math.max(91, ring);
    const bot = 100 - lineIn;
    const band = bot - top;
    const drawable = ((band - tick) / 100) * cellPx;
    console.log(
      `${n}×${n}  ${String(width).padStart(4)}  ${kind.padEnd(9)} ${lineIn.toFixed(2).padStart(6)} ` +
        `${ring.toFixed(2).padStart(8)} ${top.toFixed(2).padStart(9)} ${bot.toFixed(2).padStart(9)} ` +
        `${band.toFixed(2).padStart(6)} ${tick.toFixed(2).padStart(12)} ${drawable.toFixed(2).padStart(13)}`,
    );
  }
}

console.log("\n── THE CORNER, PER BOARD (cell-%) ───────────────────────────────────────");
console.log(
  "board  cellPx@640  cellPx@366   ring-outer(w5)  ring-outer(w4)  rim@640  rim@366  strip@640  strip@366",
);
for (const n of [4, 6, 7, 9, 16]) {
  const cell640 = 640 / n,
    cell366 = 366 / n;
  const halfW5 = ((5 / 2 / (1.3 * (1000 / n))) * 100) / 1;
  const halfW4 = (4 / 2 / (1.3 * (1000 / n))) * 100;
  const ringOuter5 = (1.15 / 1.3) * 100 + halfW5;
  const ringOuter4 = (1.15 / 1.3) * 100 + halfW4;
  const rim640 = (2 / cell640) * 100; // .cell-because box-shadow inset 2px (gameCell.css:148)
  const rim366 = (2 / cell366) * 100;
  // the unowned strip: below BOTH the laminate's 91% box and the ring's outer edge
  const strip640 = 100 - Math.max(91, ringOuter5);
  const strip366 = 100 - Math.max(91, ringOuter5);
  console.log(
    `${String(n).padStart(2)}×${n}  ${cell640.toFixed(2).padStart(10)} ${cell366.toFixed(2).padStart(11)} ` +
      `${ringOuter5.toFixed(2).padStart(15)} ${ringOuter4.toFixed(2).padStart(15)} ` +
      `${rim640.toFixed(2).padStart(8)} ${rim366.toFixed(2).padStart(8)} ` +
      `${strip640.toFixed(2).padStart(10)}% = ${(((strip640 / 100) * cell640) | 0).toFixed(0)}px ` +
      `${strip366.toFixed(2).padStart(6)}% = ${((strip366 / 100) * cell366).toFixed(2)}px`,
  );
}
