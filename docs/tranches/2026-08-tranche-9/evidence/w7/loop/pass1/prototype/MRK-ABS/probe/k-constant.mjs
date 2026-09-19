/**
 * MRK-ABS pass-1 · THE CONSTANT, taken over EVERY cell instead of one.
 *
 * The family's law is `roughness = targetSigma / (len × 0.015 × k)` with ONE k across
 * 4×4 / 9×9 / 16×16. R3 measured ONE cell per size in a browser; one cell of a 4-segment
 * wobble carries 3 uniform draws, so a single reading cannot tell a constant from noise.
 * This runs the SAME sigma fit `r0/r3-marks/probe/wobble.probe.ts` runs, in pure node,
 * against the real library, over ALL 16 / 81 / 256 cells per size, and reports k's mean and
 * spread — and what a compensated ring actually reads at each rung.
 *
 * Fidelity to the product path (every constant cited):
 *   - geometry `wobbleRect(x, y, cellSize, cellSize, {roughness, segments, seed: 42+500+pos*7,
 *     jagged: true})` — `src/pencil/grid/gridPaths.ts:59-67 generateCellRects`, verbatim.
 *   - segments `boardSize >= 16 ? 2 : 4` — `gridPaths.ts:52`.
 *   - the ring's OWN px-per-unit, MEASURED on this tree (logs/scale-*.json, both engines
 *     identical): the ghost svg's viewBox is the cell padded 15% on each side
 *     (`src/games/shared/useGameCell.ts:86-97`) drawn into the cell's CSS box, so
 *     pxPerUnit = cellPx / (cellSize × 1.3) and it is NOT the same number at every size.
 *   - sampling: `getPointAtLength` over [0.02, 0.22] of the CLOSED path, 33 samples, RMS
 *     perpendicular residual off the chord (`wobble.probe.ts:48-99`). The polyline walk here
 *     is exact for a jagged M/L…Z path.
 *
 * Run: node k-constant.mjs   (no deps beyond the frontend's own node_modules)
 */
import { createRequire } from "node:module";
const require_ = createRequire(import.meta.url);
const LIB =
  process.env.PENCIL_BOIL ??
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@mkbabb/pencil-boil/dist/path.js";
const { wobbleRect } = await import(LIB);

/** MEASURED, this tree, both engines identical (logs/scale-desktop-*.json, scale-phone-*.json). */
const SCALE = {
  desktop: { 4: 0.3169, 9: 0.4892, 16: 0.4892 }, // ghost svg px-per-unit at 1280×800
  phone: { 4: 0.2808, 9: 0.2807, 16: 0.2808 }, // at 393×699 dpr3
};
/** The GRID rule's own px-per-unit — the board svg, unpadded (same logs). */
const GRID_SCALE = { desktop: { 4: 0.412, 9: 0.636, 16: 0.636 }, phone: { 4: 0.365, 9: 0.365, 16: 0.365 } };

const BASE_ROUGHNESS = 0.4; // gridPaths.ts:63
const BAND = { floor: 0.722, ceiling: 2.886, target: 1.443 }; // R3-census, 9×9 desktop
const SIZES = [4, 9, 16];

function parsePolyline(d) {
  const pts = [];
  for (const m of d.matchAll(/([ML])\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g)) pts.push([+m[2], +m[3]]);
  pts.push([pts[0][0], pts[0][1]]); // the Z closing segment
  return pts;
}
function cumulative(pts) {
  const acc = [0];
  for (let i = 1; i < pts.length; i++)
    acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return acc;
}
function pointAt(pts, acc, s) {
  const total = acc[acc.length - 1];
  const t = Math.max(0, Math.min(total, s));
  let i = 1;
  while (i < acc.length && acc[i] < t) i++;
  if (i >= acc.length) return pts[pts.length - 1];
  const seg = acc[i] - acc[i - 1] || 1;
  const f = (t - acc[i - 1]) / seg;
  return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f];
}
function fit(d, pxPerUnit, l0 = 0.02, l1 = 0.22, samples = 32) {
  const pts = parsePolyline(d);
  const acc = cumulative(pts);
  const total = acc[acc.length - 1];
  const walk = [];
  for (let i = 0; i <= samples; i++) {
    const p = pointAt(pts, acc, total * (l0 + (l1 - l0) * (i / samples)));
    walk.push([p[0] * pxPerUnit, p[1] * pxPerUnit]);
  }
  const [ax, ay] = walk[0];
  const [bx, by] = walk[walk.length - 1];
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  let sum = 0;
  let max = 0;
  for (const [x, y] of walk) {
    const dist = Math.abs((x - ax) * dy - (y - ay) * dx) / len;
    sum += dist * dist;
    if (dist > max) max = dist;
  }
  return { sigma: Math.sqrt(sum / walk.length), max };
}
function stats(xs) {
  const n = xs.length;
  const mean = xs.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  const s = [...xs].sort((a, b) => a - b);
  const q = (p) => s[Math.min(n - 1, Math.max(0, Math.round(p * (n - 1))))];
  const r = (v) => +v.toFixed(4);
  return { n, mean: r(mean), sd: r(sd), cv: +(sd / mean).toFixed(3), min: r(s[0]), p10: r(q(0.1)), p50: r(q(0.5)), p90: r(q(0.9)), max: r(s[n - 1]) };
}
function board(n, roughness, pxPerUnit) {
  const cellSize = 1000 / n;
  const segments = n >= 16 ? 2 : 4;
  const sig = [];
  const mx = [];
  for (let pos = 0; pos < n * n; pos++) {
    const d = wobbleRect((pos % n) * cellSize, Math.floor(pos / n) * cellSize, cellSize, cellSize, {
      roughness,
      segments,
      seed: 42 + 500 + pos * 7,
      jagged: true,
    });
    const f = fit(d, pxPerUnit);
    sig.push(f.sigma);
    mx.push(f.max);
  }
  const inBand = sig.filter((v) => v >= BAND.floor && v <= BAND.ceiling).length / sig.length;
  return {
    boardSize: n,
    segments,
    roughness: +roughness.toFixed(4),
    cellSizeUnits: +cellSize.toFixed(3),
    pxPerUnit,
    ringEdgePx: +(cellSize * pxPerUnit).toFixed(2),
    maxDisplacePx: +(roughness * cellSize * 0.015 * pxPerUnit).toFixed(4),
    overshootPx: +(roughness * cellSize * 0.003 * pxPerUnit).toFixed(4),
    sigma: stats(sig),
    maxDev: stats(mx),
    fracCellsInBand: +inBand.toFixed(3),
  };
}

// ── (1) k AT HEAD, per size, at both viewports ───────────────────────────────
// k ≡ σpx / (roughness × len_units × 0.015 × pxPerUnit): the shape constant the family
// assumes is one number. If it moves with the size, one k cannot serve three boards.
const head = {};
for (const vp of ["desktop", "phone"]) {
  head[vp] = SIZES.map((n) => {
    const b = board(n, BASE_ROUGHNESS, SCALE[vp][n]);
    const denom = BASE_ROUGHNESS * (1000 / n) * 0.015 * SCALE[vp][n];
    return {
      ...b,
      kMean: +(b.sigma.mean / denom).toFixed(4),
      kP10: +(b.sigma.p10 / denom).toFixed(4),
      kP90: +(b.sigma.p90 / denom).toFixed(4),
    };
  });
}

// ── (2) THE FAMILY'S OWN FORMULA, literally: roughness = target / (len × 0.015 × k) ──
// with k a single pooled constant and NO scale term (as written in the charter). Run at the
// desktop rung, then re-read at the phone rung with the SAME geometry (roughness is baked at
// generation time; nothing regenerates on a viewport change).
const kPooledCharter = +(head.desktop.reduce((a, h) => a + h.kMean, 0) / 3).toFixed(4);
const charterLaw = SIZES.map((n) => {
  const cellSize = 1000 / n;
  const roughness = BAND.target / (cellSize * 0.015 * kPooledCharter);
  return {
    boardSize: n,
    roughness: +roughness.toFixed(3),
    desktop: board(n, roughness, SCALE.desktop[n]),
    phone: board(n, roughness, SCALE.phone[n]),
  };
});

// ── (3) THE REPAIRED FORMULA — the scale term restored, k fit per size ───────────────
// roughness = target / (len × 0.015 × k × pxPerUnit), k the pooled SHAPE constant only.
const kShape = +(
  head.desktop.reduce((a, h) => a + h.sigma.mean / (BASE_ROUGHNESS * (1000 / h.boardSize) * 0.015 * h.pxPerUnit), 0) / 3
).toFixed(4);
const repairedLaw = SIZES.map((n) => {
  const cellSize = 1000 / n;
  const roughness = BAND.target / (cellSize * 0.015 * kShape * SCALE.desktop[n]);
  return {
    boardSize: n,
    roughness: +roughness.toFixed(3),
    desktop: board(n, roughness, SCALE.desktop[n]),
    phone: board(n, roughness, SCALE.phone[n]),
  };
});

// ── (4) THE CROP ARGUMENT — σ as a fraction of the mark's OWN edge, px against px ──
const cropMath = {
  gridRule: { sigmaPx: 1.443, chordPx: 567.8, pctOfOwnEdge: +((1.443 / 567.8) * 100).toFixed(3) },
  frame: { sigmaPx: 1.145, chordPx: 503.7, pctOfOwnEdge: +((1.145 / 503.7) * 100).toFixed(3) },
  ringAtHead: SIZES.map((n) => ({
    boardSize: n,
    edgePx: +((1000 / n) * SCALE.desktop[n]).toFixed(2),
    sigmaPx: head.desktop.find((h) => h.boardSize === n).sigma.mean,
    pctOfOwnEdge: +(
      (head.desktop.find((h) => h.boardSize === n).sigma.mean / ((1000 / n) * SCALE.desktop[n])) *
      100
    ).toFixed(3),
  })),
  ringCompensated: SIZES.map((n) => ({
    boardSize: n,
    edgePx: +((1000 / n) * SCALE.desktop[n]).toFixed(2),
    sigmaPx: BAND.target,
    pctOfOwnEdge: +((BAND.target / ((1000 / n) * SCALE.desktop[n])) * 100).toFixed(3),
  })),
  note: "the charter's 1.3% vs 0.15% divides px by USER UNITS; these divide px by px",
};

console.log(
  JSON.stringify(
    { band: BAND, scale: SCALE, gridScale: GRID_SCALE, head, kPooledCharter, charterLaw, kShape, repairedLaw, cropMath },
    null,
    2,
  ),
);
