/**
 * T9-W7 pass 3 · MRK-ABS PROTOTYPE — G-ABS-1 + G-ABS-2, THE RING AND THE RULE IN ONE WINDOW.
 *
 * Copied from ../../../pass2/prototype/MRK-ABS/probe/k-window-p2.mjs and re-pointed at pass 3's
 * RING_GEOMETRY (wanderUnits 5.4, inset 0.86 — kW4 LEFT THE PRODUCT and lives HERE, in the gate's
 * own file, which is the point of §1.6) and at this base's measured boardPx.
 *
 * W4: each edge walked over the middle 80% of its own arc length, 33 samples, residual to that
 * edge's NOMINAL line, pooled. A rule is one edge; a ring is four, pooled. Ring and rule come out
 * of ONE run so the ratio is a ratio and not a transposition.
 *
 * The r0 R3-a row (window W1, chord-fit, n = 1 rule) is MOVED, not re-cut — the diff that would
 * move it is banked under ../instruments/, never written into r0.
 *
 * Run from web/frontend:  node <this>
 */
const PB =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@mkbabb/pencil-boil/dist/index.js";
const { wobbleRect, boilLineFrames } = await import(PB);

/** the product's frozen pair … */
const RING = { wanderUnits: 5.4, inset: 0.86 };
/** … and the shape constant that predicts σ from it, which the PRODUCT no longer carries. */
const kW4 = 0.443;
const DECLARED = RING.wanderUnits * kW4; // 2.3922

const VIEWBOX = 1000;
const SEED = 42;
/** measured on this prototype at 1280×800, 74a2b5d9 base (see logs/boardpx.txt) */
const BOARD_PX = { 4: 412, 9: 556, 16: 556 };
const SCALE = {
  ghostPerUnit: (bp) => bp / (VIEWBOX * 1.3), // the ghost svg is the cell box padded 0.15 each side
  gridPerUnit: (bp) => bp / VIEWBOX,
};

const parse = (d) => {
  const pts = [];
  for (const m of d.matchAll(/([ML])\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g))
    pts.push([parseFloat(m[2]), parseFloat(m[3])]);
  return pts;
};
function arcOpen(pts) {
  const cum = [0];
  for (let i = 1; i < pts.length; i++)
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { ring: pts, cum, total: cum[cum.length - 1] };
}
function pointAt(g, l) {
  const t = Math.max(0, Math.min(g.total, l));
  let i = 1;
  while (i < g.cum.length - 1 && g.cum[i] < t) i++;
  const f = (t - g.cum[i - 1]) / (g.cum[i] - g.cum[i - 1] || 1);
  return [
    g.ring[i - 1][0] + f * (g.ring[i][0] - g.ring[i - 1][0]),
    g.ring[i - 1][1] + f * (g.ring[i][1] - g.ring[i - 1][1]),
  ];
}
function walk(g, l0, l1, samples) {
  const out = [];
  for (let i = 0; i <= samples; i++)
    out.push(pointAt(g, g.total * (l0 + (l1 - l0) * (i / samples))));
  return out;
}
function edgeSS(pts, axis, c0) {
  const g = arcOpen(pts);
  const p = walk(g, 0.1, 0.9, 32);
  let sum = 0;
  for (const q of p) {
    const dd = (axis === "h" ? q[1] : q[0]) - c0;
    sum += dd * dd;
  }
  return { ss: sum, n: p.length };
}
function w4Rect(d, x, y, size) {
  const pts = parse(d);
  const bounds = [
    [0, 4, "h", y],
    [4, 8, "v", x + size],
    [8, 12, "h", y + size],
    [12, 16, "v", x],
  ];
  let ss = 0,
    n = 0;
  for (const [i0, i1, axis, c0] of bounds) {
    const e = edgeSS(pts.slice(i0, i1 + 1), axis, c0);
    ss += e.ss;
    n += e.n;
  }
  return Math.sqrt(ss / n);
}
function stats(v) {
  const m = v.reduce((a, b) => a + b, 0) / v.length;
  const sd = Math.sqrt(v.reduce((a, b) => a + (b - m) * (b - m), 0) / v.length);
  return { mean: m, cv: sd / m, min: Math.min(...v), max: Math.max(...v) };
}

console.log(
  `RING_GEOMETRY wanderUnits ${RING.wanderUnits} · inset ${RING.inset}  (kW4 ${kW4} lives in THIS file)` +
    `\n  declared sigma = wanderUnits x kW4 = ${DECLARED.toFixed(4)} units\n`,
);

// ── THE RING, at the product's own seeds ───────────────────────────────────
const ringRows = [];
for (const N of [4, 9, 16]) {
  const cs = VIEWBOX / N;
  const ringSize = RING.inset * cs;
  const pad = ((1 - RING.inset) / 2) * cs;
  const roughness = RING.wanderUnits / (0.015 * ringSize);
  const sig = [];
  let excursion = 0;
  let maxDisp = 0;
  for (let pos = 0; pos < N * N; pos++) {
    const r = Math.floor(pos / N),
      c = pos % N;
    const x = c * cs + pad,
      y = r * cs + pad;
    const d = wobbleRect(x, y, ringSize, ringSize, {
      roughness,
      segments: 4,
      seed: SEED + 500 + pos * 7,
      jagged: true,
    });
    sig.push(w4Rect(d, x, y, ringSize));
    for (const [px, py] of parse(d)) {
      excursion = Math.max(excursion, x - px, px - (x + ringSize), y - py, py - (y + ringSize));
      maxDisp = Math.max(
        maxDisp,
        Math.min(Math.abs(px - x), Math.abs(px - (x + ringSize))),
        Math.min(Math.abs(py - y), Math.abs(py - (y + ringSize))),
      );
    }
  }
  ringRows.push({ N, n: N * N, roughness: +roughness.toFixed(4), s: stats(sig), excursion });
}
{
  const cs = VIEWBOX / 16;
  const ringSize = RING.inset * cs;
  const roughness = RING.wanderUnits / (0.015 * ringSize);
  const sig = [];
  for (let pos = 0; pos < 4096; pos++)
    sig.push(
      w4Rect(
        wobbleRect(0, 0, ringSize, ringSize, {
          roughness,
          segments: 4,
          seed: SEED + 500 + pos * 7,
          jagged: true,
        }),
        0,
        0,
        ringSize,
      ),
    );
  ringRows.push({ N: "pop4096", n: 4096, roughness: +roughness.toFixed(4), s: stats(sig), excursion: 0 });
}

console.log("RING (W4, every cell, board units):");
console.log("  size      n     roughness   W4 sigma              dev vs 2.3922   +-5%   excursion");
for (const r of ringRows) {
  const dev = ((r.s.mean - DECLARED) / DECLARED) * 100;
  console.log(
    `  ${String(r.N).padEnd(10)}${String(r.n).padEnd(6)}${String(r.roughness).padEnd(12)}` +
      `${r.s.mean.toFixed(4)} (CV ${(r.s.cv * 100).toFixed(1)}%)`.padEnd(22) +
      `${dev >= 0 ? "+" : ""}${dev.toFixed(2)}%`.padEnd(16) +
      (Math.abs(dev) <= 5 ? "GREEN" : "RED").padEnd(7) +
      (r.excursion ? r.excursion.toFixed(3) : "-"),
  );
}
const perSize = ringRows.slice(0, 3).map((r) => r.s.mean);
console.log(
  `  per-size spread ${(((Math.max(...perSize) - Math.min(...perSize)) / (perSize.reduce((a, b) => a + b) / 3)) * 100).toFixed(2)}%  (the n=4096 row is a pencil-boil VERSION CANARY, not a design gate)`,
);

// ── THE RULE, same window, same run, shipped generation ────────────────────
const BOIL = { frameCount: 4, subgridBoil: 0.6, cellBoil: 0.3 };
const PAD = 26;
const SUBGRID = { 4: 2, 9: 3, 16: 4 };
console.log("\nRULE (W4, every cell rule + every subgrid rule, pose 0, board units):");
console.log("  size  n(cell/sub)  cell-rule sigma      subgrid-rule sigma   all rules");
const ruleRows = [];
for (const N of [4, 9, 16]) {
  const cs = VIEWBOX / N;
  const sub = SUBGRID[N];
  const cell = [],
    subg = [];
  let seedOffset = 100;
  for (const axis of ["v", "h"]) {
    for (let i = 1; i < N; i++) {
      const at = i * cs;
      const isSub = i % sub === 0;
      const opts = {
        roughness: isSub ? 0.7 : 0.4,
        segments: isSub ? 5 : 4,
        seed: SEED + seedOffset++,
        jagged: true,
      };
      const frames =
        axis === "v"
          ? boilLineFrames(at, PAD, at, VIEWBOX - PAD, BOIL.frameCount, isSub ? BOIL.subgridBoil : BOIL.cellBoil, opts)
          : boilLineFrames(PAD, at, VIEWBOX - PAD, at, BOIL.frameCount, isSub ? BOIL.subgridBoil : BOIL.cellBoil, opts);
      const e = edgeSS(parse(frames[0]), axis === "v" ? "v" : "h", at);
      (isSub ? subg : cell).push(Math.sqrt(e.ss / e.n));
    }
  }
  const all = [...cell, ...subg];
  ruleRows.push({
    N,
    cell: stats(cell),
    sub: subg.length ? stats(subg) : null,
    all: stats(all),
    nCell: cell.length,
    nSub: subg.length,
  });
  const r = ruleRows[ruleRows.length - 1];
  console.log(
    `  ${String(N).padEnd(6)}${`${r.nCell}/${r.nSub}`.padEnd(13)}` +
      `${r.cell.mean.toFixed(4)} (CV ${(r.cell.cv * 100).toFixed(1)}%)`.padEnd(21) +
      (r.sub ? `${r.sub.mean.toFixed(4)} (CV ${(r.sub.cv * 100).toFixed(1)}%)` : "-").padEnd(21) +
      `${r.all.mean.toFixed(4)}`,
  );
}

// ── G-ABS-1: the ratio, in board units and on the screen ───────────────────
console.log("\nG-ABS-1 — ring sigma / rule sigma, SAME window, same board, ONE run:");
console.log("  size  ring_u   rule_u   ratio(u)  ring_px  rule_px  ratio(px)  band [0.5,2.0]");
const g1 = [];
for (let i = 0; i < 3; i++) {
  const N = ringRows[i].N;
  const ru = ringRows[i].s.mean,
    gu = ruleRows[i].all.mean,
    bp = BOARD_PX[N];
  const rpx = ru * SCALE.ghostPerUnit(bp),
    gpx = gu * SCALE.gridPerUnit(bp);
  const ratioPx = rpx / gpx;
  g1.push(ratioPx);
  console.log(
    `  ${String(N).padEnd(6)}${ru.toFixed(4).padEnd(9)}${gu.toFixed(4).padEnd(9)}${(ru / gu).toFixed(3).padEnd(10)}` +
      `${rpx.toFixed(3).padEnd(9)}${gpx.toFixed(3).padEnd(9)}${ratioPx.toFixed(3).padEnd(11)}` +
      (ratioPx >= 0.5 && ratioPx <= 2.0 ? "GREEN" : "RED"),
  );
}

// ── sigma in the reader's px, and the drawn-edge fraction the spec names ───
console.log("\nsigma in the reader's px (the sentence the comment carries):");
console.log("  size  px/unit   sigma_px  drawn edge px  sigma/edge");
for (let i = 0; i < 3; i++) {
  const N = ringRows[i].N,
    bp = BOARD_PX[N];
  const ppu = SCALE.ghostPerUnit(bp);
  const edgeU = RING.inset * (VIEWBOX / N);
  console.log(
    `  ${String(N).padEnd(6)}${ppu.toFixed(5).padEnd(10)}${(ringRows[i].s.mean * ppu).toFixed(3).padEnd(10)}` +
      `${(edgeU * ppu).toFixed(2).padEnd(15)}${((ringRows[i].s.mean / edgeU) * 100).toFixed(2)}%`,
  );
}
console.log(
  `\nG-ABS-1 ${g1.every((r) => r >= 0.5 && r <= 2.0) ? "GREEN" : "RED"} · G-ABS-2 ${
    ringRows.slice(0, 3).every((r) => Math.abs((r.s.mean - DECLARED) / DECLARED) <= 0.05) ? "GREEN" : "RED"
  }`,
);
