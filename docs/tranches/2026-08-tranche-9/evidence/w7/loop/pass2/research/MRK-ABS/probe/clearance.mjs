/**
 * T9-W7 pass 2 · MRK-ABS research — MA-C RE-CUT AGAINST THE RULE'S PAINTED BAND, and the
 * price of every lever, in closed form.
 *
 * The model, all in the GHOST element's user units (the ring's own space), then in px:
 *
 *   ghost viewBox   = the nominal cell box padded by 0.15*cellSize on all four sides
 *                     (useGameCell.ts:91), so the element's px-per-unit is
 *                     cellPx / (1.3*cellSize) = boardPx / 1300 — the SAME scalar at every
 *                     board size, and 1/1.3 of the board SVG's own boardPx/1000.
 *   margin          = 0.15 * cellSize                       (ghost units; the only term that
 *                                                            shrinks as the board grows)
 *   excursion       = maxDisplace = ringSigmaUnits / ringK   (verified 5.379/5.379/5.399 by
 *                                                            k-window.mjs; exact, not fitted)
 *   half stroke     = strokeWidth / 2                        (gameCell.css:250, 7 units)
 *   rule half-band  = (cellLineStroke / 2) * 1.3             (HandDrawnGrid.vue:366 — 5 BOARD
 *                                                            units = 6.5 ghost units, so 3.25)
 *
 * Three boundaries a clearance guard can score, and they are 3.25 ghost units apart:
 *   A  the cell's NOMINAL box       — what pass-1's MA-C scores (headroom 0.233px at 16x16)
 *   B  the rule's INNER painted edge — where the ink actually starts (A minus 3.25 units)
 *   C  the rule's OUTER painted edge — the neighbour's true boundary (A plus 3.25 units)
 */

const VIEWBOX = 1000;
const PAD = 0.15; // useGameCell.ts:91
const RULE_BOARD_STROKE = 5; // HandDrawnGrid.vue:366 / :442, board units
const RULE_HALF = (RULE_BOARD_STROKE / 2) * 1.3; // ghost units = 3.25

const BOARD_PX_DESK = 636; // measured 1280x800 (scale 0.636 board / 0.489 ghost)
const BOARD_PX_4x4 = 412; // the 4x4 board renders smaller (scale 0.412 / 0.317)
const BOARD_PX_PHONE = 365; // 393x699 (ghost scale 0.2808)

function pxPerUnit(boardPx) {
  return boardPx / (VIEWBOX * 1.3);
}

function headroom({ N, sigma = 1.75, k = 0.3241, stroke = 7, ringFrac = 1.0 }) {
  const cellSize = VIEWBOX / N;
  const inset = ((1 - ringFrac) / 2) * cellSize;
  const margin = PAD * cellSize + inset;
  const excursion = sigma / k; // = maxDisplace, exact
  const half = stroke / 2;
  const A = margin - excursion - half; // vs the cell's nominal box
  return { N, cellSize, margin, excursion, half, A, B: A - RULE_HALF, C: A + RULE_HALF };
}

const px = (u, boardPx) => u * pxPerUnit(boardPx);

console.log("MODEL CHECK against pass-1's measured MA-C (boundary A, desktop):");
for (const [N, bp, want] of [
  [4, BOARD_PX_4x4, 9.071],
  [9, BOARD_PX_DESK, 3.809],
  [16, BOARD_PX_DESK, 0.233],
]) {
  const h = headroom({ N });
  console.log(
    `  ${N}x${N}  margin ${px(h.margin, bp).toFixed(3)}px  headroom_A ${px(h.A, bp).toFixed(3)}px   (pass-1 measured ${want})`,
  );
}

console.log("\nTHE THREE BOUNDARIES, at ringSigmaUnits 1.75 / ringK 0.3241 / stroke 7 / ring on the cell box:");
console.log("  N     cellSize  margin_u  A_units  A_px    B_units  B_px     C_units  C_px");
for (const N of [4, 9, 12, 16, 17]) {
  const h = headroom({ N });
  const bp = N === 4 ? BOARD_PX_4x4 : BOARD_PX_DESK;
  console.log(
    `  ${String(N).padEnd(6)}${h.cellSize.toFixed(2).padEnd(10)}${h.margin.toFixed(3).padEnd(10)}` +
      `${h.A.toFixed(3).padEnd(9)}${px(h.A, bp).toFixed(3).padEnd(8)}` +
      `${h.B.toFixed(3).padEnd(9)}${px(h.B, bp).toFixed(3).padEnd(9)}` +
      `${h.C.toFixed(3).padEnd(9)}${px(h.C, bp).toFixed(3)}`,
  );
}

console.log("\nWHERE EACH BOUNDARY REACHES ZERO (the law's ceiling on board size):");
for (const [name, extra] of [
  ["A  nominal cell box", 0],
  ["B  rule's inner painted edge", RULE_HALF],
  ["C  neighbour (rule's outer edge)", -RULE_HALF],
]) {
  const need = 1.75 / 0.3241 + 3.5 + extra;
  const cs = need / PAD;
  const n = VIEWBOX / cs;
  console.log(
    `  ${name.padEnd(34)} zero at cellSize ${cs.toFixed(2)} -> boardSize ${n.toFixed(2)}  (largest whole board ${Math.floor(n)})`,
  );
}

console.log("\nTHE LEVERS AT 16x16, scored on boundary B (the re-cut MA-C). Deficit to close: 2.774 units / 1.357px.");
const levers = [
  ["HEAD of this family (f=1.00, stroke 7, sigma 1.75)", { N: 16 }],
  ["stroke 7 -> 5 at 16x16 only", { N: 16, stroke: 5 }],
  ["sigma 1.75 -> 1.476 (the grid band's 0.722px floor)", { N: 16, sigma: 1.476 }],
  ["stroke 5 AND sigma at the band floor", { N: 16, stroke: 5, sigma: 1.476 }],
  ["ring at 0.911*cellSize (the minimum that clears B)", { N: 16, ringFrac: 0.911 }],
  ["ring at 0.90*cellSize", { N: 16, ringFrac: 0.9 }],
  ["ring at 0.88*cellSize", { N: 16, ringFrac: 0.88 }],
  ["ring at 0.86*cellSize (pass-1's named lever)", { N: 16, ringFrac: 0.86 }],
  ["ring 0.86 + stroke 5", { N: 16, ringFrac: 0.86, stroke: 5 }],
];
for (const [label, opt] of levers) {
  const h = headroom(opt);
  const b = px(h.B, BOARD_PX_DESK);
  const a = px(h.A, BOARD_PX_DESK);
  console.log(
    `  ${label.padEnd(52)} A ${a.toFixed(3).padStart(7)}px   B ${b.toFixed(3).padStart(7)}px  ${b >= 0 ? "GREEN" : "RED"}`,
  );
}

console.log("\nWHAT LEVER f COSTS THE OTHER TWO BOARDS (the ring's inset from its cell edge):");
for (const f of [0.911, 0.9, 0.88, 0.86]) {
  const row = [4, 9, 16]
    .map((N) => {
      const inset = ((1 - f) / 2) * (VIEWBOX / N);
      const bp = N === 4 ? BOARD_PX_4x4 : BOARD_PX_DESK;
      return `${N}x${N} ${px(inset, bp).toFixed(2)}px`;
    })
    .join("  ");
  console.log(`  f=${f}   ${row}`);
}

console.log("\nPHONE (393x699, boardPx 365) on boundary B:");
for (const N of [4, 9, 16]) {
  const h = headroom({ N });
  console.log(`  ${N}x${N}  A ${px(h.A, BOARD_PX_PHONE).toFixed(3)}px   B ${px(h.B, BOARD_PX_PHONE).toFixed(3)}px`);
}

console.log("\nSIGMA IN PX (what a reader judges) and the grid's own widened band, per size:");
const gridSigma = { 4: 0.813, 9: 1.07, 16: 1.262 }; // pass-1, n=16/48/96 rules, r0's window
for (const [N, sig] of [
  [4, 1.7145],
  [9, 1.7562],
  [16, 1.8228],
]) {
  const bp = N === 4 ? BOARD_PX_4x4 : BOARD_PX_DESK;
  const ringPx = px(sig, bp);
  const g = gridSigma[N];
  console.log(
    `  ${N}x${N}  ring ${ringPx.toFixed(3)}px  grid ${g}px  ratio ${(ringPx / g).toFixed(3)}  band [${(g * 0.5).toFixed(3)}, ${(g * 2).toFixed(3)}]`,
  );
}
