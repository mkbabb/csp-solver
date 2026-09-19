/**
 * T9-W7 pass 2 · MRK-ABS PROTOTYPE — THE RING AND THE RULE IN ONE WINDOW (G-ABS-1, G-ABS-2).
 *
 * Copied from ../research/MRK-ABS/probe/k-window.mjs and re-pointed at the PROTOTYPE's
 * geometry (RING_GEOMETRY: wanderUnits 5.4, inset 0.86, kW4 0.4430) and at the SHIPPED grid
 * rule generation (gridPaths.ts: cell lines roughness 0.4 / segments 4, subgrid 0.7 / 5,
 * boilLineFrames frame 0), so the ring's sigma and the rule's sigma are taken in the SAME
 * window (W4) in the same run. The r0 row (W1, chord-fit, n=1 rule) is MOVED, not re-cut.
 *
 * W4: each edge walked over the middle 80% of its own arc length, 33 samples, residual to
 * that edge's NOMINAL line, pooled. A rule is one edge; a ring is four, pooled.
 *
 * Run: node .pass2-mrkabs/k-window-p2.mjs   (from web/frontend)
 */
import {
  wobbleRect,
  boilLineFrames,
} from "@mkbabb/pencil-boil";

const RING = { wanderUnits: 5.4, inset: 0.86, kW4: 0.443 };
const VIEWBOX = 1000;
const SEED = 42;
// Measured px-per-board-unit on the prototype at 1280x800 (filled from the DOM probe).
const SCALE = {
  // ghost element: viewBox is the cell box padded 0.15*cellSize each side
  ghostPerUnit: (boardPx) => boardPx / (VIEWBOX * 1.3),
  gridPerUnit: (boardPx) => boardPx / VIEWBOX,
};

function parse(d) {
  const pts = [];
  for (const m of d.matchAll(/([ML])\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g)) {
    pts.push([parseFloat(m[2]), parseFloat(m[3])]);
  }
  return pts;
}
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
  for (let i = 0; i <= samples; i++) out.push(pointAt(g, g.total * (l0 + (l1 - l0) * (i / samples))));
  return out;
}
/** pooled sum-of-squares on one edge, residual to its NOMINAL line */
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
/** W4 over a closed wobbleRect at (x,y,size) — 17 parsed points, 4 edges of 5 */
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
  `RING_GEOMETRY wanderUnits ${RING.wanderUnits} · inset ${RING.inset} · kW4 ${RING.kW4}` +
    `  ->  declared sigma = ${(RING.wanderUnits * RING.kW4).toFixed(4)} units\n`,
);

// ── THE RING, at the product's own seeds ────────────────────────────────────
const ringRows = [];
for (const N of [4, 9, 16]) {
  const cs = VIEWBOX / N;
  const ringSize = RING.inset * cs;
  const pad = ((1 - RING.inset) / 2) * cs;
  const roughness = RING.wanderUnits / (0.015 * ringSize);
  const sig = [];
  let excursion = 0;
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
    for (const [px, py] of parse(d))
      excursion = Math.max(excursion, x - px, px - (x + ringSize), y - py, py - (y + ringSize));
  }
  ringRows.push({ N, n: N * N, roughness: +roughness.toFixed(4), s: stats(sig), excursion });
}
// population: 4096 independent seeds, one geometry (units are size-invariant)
{
  const cs = VIEWBOX / 16;
  const ringSize = RING.inset * cs;
  const roughness = RING.wanderUnits / (0.015 * ringSize);
  const sig = [];
  for (let pos = 0; pos < 4096; pos++) {
    const d = wobbleRect(0, 0, ringSize, ringSize, {
      roughness,
      segments: 4,
      seed: SEED + 500 + pos * 7,
      jagged: true,
    });
    sig.push(w4Rect(d, 0, 0, ringSize));
  }
  ringRows.push({ N: "pop4096", n: 4096, roughness: +roughness.toFixed(4), s: stats(sig), excursion: 0 });
}

console.log("RING (W4, all cells, board units):");
console.log("  size    n     roughness   W4 sigma            dev from 2.392   excursion");
for (const r of ringRows) {
  const dev = ((r.s.mean - RING.wanderUnits * RING.kW4) / (RING.wanderUnits * RING.kW4)) * 100;
  console.log(
    `  ${String(r.N).padEnd(8)}${String(r.n).padEnd(6)}${String(r.roughness).padEnd(12)}` +
      `${r.s.mean.toFixed(4)} (CV ${(r.s.cv * 100).toFixed(1)}%)`.padEnd(20) +
      `${dev >= 0 ? "+" : ""}${dev.toFixed(2)}%`.padEnd(17) +
      (r.excursion ? r.excursion.toFixed(3) : "-"),
  );
}
const perSize = ringRows.slice(0, 3).map((r) => r.s.mean);
console.log(
  `  per-size spread ${(((Math.max(...perSize) - Math.min(...perSize)) / (perSize.reduce((a, b) => a + b) / 3)) * 100).toFixed(2)}%`,
);

// ── THE RULE, same window, shipped generation ───────────────────────────────
// gridPaths.ts:492-535 — boilLineFrames(x, pad, x, viewBox-pad, frameCount, boil, opts).
const BOIL = { frameCount: 4, subgridBoil: 0.6, cellBoil: 0.3 };
const PAD = 26;
const SUBGRID = { 4: 2, 9: 3, 16: 4 };
console.log("\nRULE (W4, every cell rule + every subgrid rule, frame 0, board units):");
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
      const pts = parse(frames[0]);
      const e = edgeSS(pts, axis === "v" ? "v" : "h", at);
      (isSub ? subg : cell).push(Math.sqrt(e.ss / e.n));
    }
  }
  const all = [...cell, ...subg];
  ruleRows.push({ N, cell: stats(cell), sub: subg.length ? stats(subg) : null, all: stats(all), nCell: cell.length, nSub: subg.length });
  const r = ruleRows[ruleRows.length - 1];
  console.log(
    `  ${String(N).padEnd(6)}${`${r.nCell}/${r.nSub}`.padEnd(13)}` +
      `${r.cell.mean.toFixed(4)} (CV ${(r.cell.cv * 100).toFixed(1)}%)`.padEnd(21) +
      (r.sub ? `${r.sub.mean.toFixed(4)} (CV ${(r.sub.cv * 100).toFixed(1)}%)` : "-").padEnd(21) +
      `${r.all.mean.toFixed(4)}`,
  );
}

// ── G-ABS-1: the ratio, in board units and on the screen ────────────────────
// Board px measured on the prototype (1280x800): 4x4 renders smaller than 9/16.
const BOARD_PX = { 4: 412, 9: 636, 16: 636 };
console.log("\nG-ABS-1 — ring sigma / rule sigma, SAME window, same board:");
console.log("  size  ring_u   rule_u   ratio(units)  ring_px  rule_px  ratio(px)  band [0.5,2.0]");
for (let i = 0; i < 3; i++) {
  const N = ringRows[i].N;
  const ru = ringRows[i].s.mean;
  const gu = ruleRows[i].all.mean;
  const bp = BOARD_PX[N];
  const rpx = ru * SCALE.ghostPerUnit(bp);
  const gpx = gu * SCALE.gridPerUnit(bp);
  const ratioU = ru / gu;
  const ratioPx = rpx / gpx;
  console.log(
    `  ${String(N).padEnd(6)}${ru.toFixed(4).padEnd(9)}${gu.toFixed(4).padEnd(9)}${ratioU.toFixed(3).padEnd(14)}` +
      `${rpx.toFixed(3).padEnd(9)}${gpx.toFixed(3).padEnd(9)}${ratioPx.toFixed(3).padEnd(11)}` +
      (ratioPx >= 0.5 && ratioPx <= 2.0 ? "GREEN" : "RED"),
  );
}
