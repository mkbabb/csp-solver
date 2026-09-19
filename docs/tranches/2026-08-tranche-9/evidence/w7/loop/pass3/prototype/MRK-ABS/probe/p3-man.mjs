/**
 * T9-W7 pass 3 · MRK-ABS PROTOTYPE — G-ABS-7, MA-N: the ring never enters a neighbour.
 *
 * Boundary C, per cell, at the HEAVIEST tiers the sheet draws: the ring's OUTER painted edge
 * against its own cell's nominal boundary (where the neighbour begins), in projected board
 * coordinates — the ghost svg is `inset-0` on the cell and carries a viewBox padded 0.15·cellSize
 * a side, so every ghost coordinate divides by 1.3 on its way to the board.
 *
 *   C(u) = (cellSize)  −  [ (ringOuterInk_ghost − cellOrigin + 0.15·cellSize) / 1.3 ]
 *
 * Reported at desktop and phone boardPx, over EVERY cell of EVERY shipped board, at tier 2
 * (stroke 7, keyboard selection) and tier 2x3 (stroke 10, invalid AND selected — the heaviest
 * mark the estate can paint). The f = 1.00 / W = 5.4 candidate is run beside it as the WITNESS
 * that the inset is load-bearing: same wander, no inset, and the ring enters the neighbour.
 */
const PB =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@mkbabb/pencil-boil/dist/index.js";
const { wobbleRect } = await import(PB);

const VB = 1000,
  GHOST_PAD = 0.15,
  SQUEEZE = 1.3,
  SEED = 42;
const BOARD_PX = { desk: { 4: 412, 9: 556, 16: 556 }, phone: { 4: 236, 9: 365, 16: 365 } };
const TIERS = [
  ["tier 2   selection", 7],
  ["tier 2x3 invalid+selected", 10],
];
const ARMS = [
  ["PROTO  f=0.86 W=5.4", 0.86, 5.4],
  ["WITNESS f=1.00 W=5.4", 1.0, 5.4],
  ["HEAD   f=1.00 r=0.4", 1.0, null],
];

const parse = (d) => {
  const pts = [];
  for (const m of d.matchAll(/([ML])\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g))
    pts.push([parseFloat(m[2]), parseFloat(m[3])]);
  return pts;
};

/** worst boundary C, in board units, over every cell of an N-board */
function worstC(N, f, wander, halfStroke) {
  const cs = VB / N,
    size = f * cs,
    pad = ((1 - f) / 2) * cs;
  const roughness = wander === null ? 0.4 : wander / (0.015 * size);
  const segments = wander === null && N >= 16 ? 2 : 4;
  let worst = Infinity,
    neg = 0,
    n = 0;
  const hsProj = halfStroke / SQUEEZE; // the stroke is drawn in ghost units too
  for (let pos = 0; pos < N * N; pos++) {
    const r = Math.floor(pos / N),
      c = pos % N;
    const ox = c * cs,
      oy = r * cs;
    const x = ox + pad,
      y = oy + pad;
    const d = wobbleRect(x, y, size, size, {
      roughness,
      segments,
      seed: SEED + 500 + pos * 7,
      jagged: true,
    });
    for (const [px, py] of parse(d)) {
      // project ghost coords into painted board coords
      const bx = ox + (px - ox + GHOST_PAD * cs) / SQUEEZE;
      const by = oy + (py - oy + GHOST_PAD * cs) / SQUEEZE;
      // distance from each of the four cell boundaries to the ring's painted outer ink
      const cands = [bx - hsProj - ox, ox + cs - (bx + hsProj), by - hsProj - oy, oy + cs - (by + hsProj)];
      for (const v of cands) {
        n++;
        if (v < worst) worst = v;
        if (v < 0) neg++;
      }
    }
  }
  return { worstU: worst, neg, n, cells: N * N };
}

const px = (u, bp) => (u * bp) / VB;
const pad = (s, w) => String(s).padEnd(w);

console.log("T9-W7 pass 3 · MRK-ABS — G-ABS-7, MA-N (boundary C >= 0 for every cell)\n");
let allGreen = true;
for (const [tierName, sw] of TIERS) {
  console.log(`### ${tierName} (stroke ${sw})`);
  console.log(
    "  arm                    board  cells  worst_u   desk_px   phone_px  cells clean",
  );
  for (const [arm, f, W] of ARMS) {
    for (const N of [4, 9, 16]) {
      const r = worstC(N, f, W, sw / 2);
      const ok = r.worstU >= 0;
      if (arm.startsWith("PROTO") && !ok) allGreen = false;
      console.log(
        `  ${pad(arm, 23)}${pad(N + "x" + N, 7)}${pad(r.cells, 7)}` +
          `${r.worstU.toFixed(3).padStart(8)}  ${px(r.worstU, BOARD_PX.desk[N]).toFixed(3).padStart(8)}  ` +
          `${px(r.worstU, BOARD_PX.phone[N]).toFixed(3).padStart(8)}  ` +
          `${r.n - r.neg}/${r.n} samples  ${ok ? "CLEAR" : "ENTERS"}`,
      );
    }
  }
  console.log("");
}
console.log(`G-ABS-7 (the PROTO arm, every board, both tiers): ${allGreen ? "GREEN" : "RED"}`);
