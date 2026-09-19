/**
 * T9-W7 pass 2 · MRK-ABS research — THE WINDOW IS THE CONSTANT.
 *
 * `ringK` is not a property of the ring; it is the shape constant of ONE sampling window over
 * `wobbleRect`'s polyline. This computes that constant OFFLINE, off the shipped library, for
 * four candidate windows, at the three board sizes with the product's own seeds, plus a
 * population run (4096 cells) that separates the window's true constant from seed noise.
 *
 * Geometry note the whole family turns on: with `roughness = sigma / (cellSize * 0.015 * k)`,
 * `maxDisplace = roughness * len * 0.015 = sigma / k` EXACTLY — independent of cellSize. The
 * wobble's shape in board units is therefore identical at 4x4, 9x9 and 16x16; every per-size
 * difference in a measured sigma is seed noise or instrument error, never geometry.
 *
 * Run: node k-window.mjs   (from web/frontend, so the package resolves)
 */
import { wobbleRect } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@mkbabb/pencil-boil/dist/index.js";

const TARGET = 1.75; // ringSigmaUnits
const K_SHIPPED = 0.3241; // ringK in the pass-1 diff

/** Parse pointsToLinear output ("Mx,y L x,y L ... Z" with the corner M tokens stripped). */
function parse(d) {
  const pts = [];
  for (const m of d.matchAll(/([ML])\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g)) {
    pts.push([parseFloat(m[2]), parseFloat(m[3])]);
  }
  return pts;
}

/** Cumulative arc length of a closed polyline (Z closes back to pts[0]). */
function arc(pts) {
  const ring = [...pts, pts[0]];
  const cum = [0];
  for (let i = 1; i < ring.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(ring[i][0] - ring[i - 1][0], ring[i][1] - ring[i - 1][1]));
  }
  return { ring, cum, total: cum[cum.length - 1] };
}

/** SVG getPointAtLength for a polyline — exact. */
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

/** r0's estimator: RMS perpendicular residual to the CHORD between first and last sample. */
function sigmaChord(pts) {
  const [ax, ay] = pts[0];
  const [bx, by] = pts[pts.length - 1];
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  let sum = 0;
  let max = 0;
  for (const [x, y] of pts) {
    const dd = Math.abs((x - ax) * dy - (y - ay) * dx) / len;
    sum += dd * dd;
    if (dd > max) max = dd;
  }
  return { sigma: Math.sqrt(sum / pts.length), max };
}

/** Residual to the NOMINAL line y = y0 (or x = x0) — no chord fit, no trend removal. */
function sigmaNominal(pts, axis, c0) {
  let sum = 0;
  let max = 0;
  for (const p of pts) {
    const dd = Math.abs((axis === "h" ? p[1] : p[0]) - c0);
    sum += dd * dd;
    if (dd > max) max = dd;
  }
  return { sigma: Math.sqrt(sum / pts.length), max };
}

/** Walk a window [l0,l1] of total arc length with `samples`+1 points. */
function walk(g, l0, l1, samples) {
  const pts = [];
  for (let i = 0; i <= samples; i++) pts.push(pointAt(g, g.total * (l0 + (l1 - l0) * (i / samples))));
  return pts;
}

/** The four windows, each returning sigma in board units for one cell's ring. */
function windows(d, x, y, cs) {
  const pts = parse(d);
  const g = arc(pts);
  const out = {};

  // W1 — r0's shipped window: arc 0.02..0.22 of the whole closed path, 33 samples, chord-fit.
  out.W1_r0 = sigmaChord(walk(g, 0.02, 0.22, 32)).sigma;

  // W2 — the whole perimeter, 129 samples, residual to the nearest nominal rect edge.
  {
    const p = walk(g, 0, 1, 128);
    let sum = 0;
    for (const [px, py] of p) {
      const dTop = Math.abs(py - y),
        dBot = Math.abs(py - (y + cs)),
        dLeft = Math.abs(px - x),
        dRight = Math.abs(px - (x + cs));
      const dd = Math.min(dTop, dBot, dLeft, dRight);
      sum += dd * dd;
    }
    out.W2_perimeter = Math.sqrt(sum / p.length);
  }

  // W3 — the node polyline: the 5 nodes of the first (top) edge, residual to the chord.
  out.W3_nodes5 = sigmaChord(pts.slice(0, 5)).sigma;

  // W4 — THE DECLARED WINDOW (proposed): each of the four edges walked over the MIDDLE 80% of
  // its own arc length, 33 samples per edge, residual to that edge's NOMINAL line, pooled.
  {
    // Edge boundaries in the parsed point list: the corner M tokens are stripped, so the
    // closed polyline is 17 points: top 0..4, right 4..8, bottom 8..12, left 12..16, Z to 0.
    const bounds = [
      [0, 4, "h", y],
      [4, 8, "v", x + cs],
      [8, 12, "h", y + cs],
      [12, 16, "v", x],
    ];
    let sum = 0;
    let n = 0;
    for (const [i0, i1, axis, c0] of bounds) {
      const sub = pts.slice(i0, i1 + 1);
      const gg = arc(sub);
      // open polyline: drop the Z-closure leg the helper appends
      const open = { ring: sub, cum: gg.cum.slice(0, sub.length), total: gg.cum[sub.length - 1] };
      const p = walk(open, 0.1, 0.9, 32);
      const s = sigmaNominal(p, axis, c0);
      sum += s.sigma * s.sigma * p.length;
      n += p.length;
    }
    out.W4_declared = Math.sqrt(sum / n);
  }

  // The bbox excursion beyond the nominal rect (what MA-C's clearance actually spends).
  let exc = 0;
  for (const [px, py] of pts) {
    exc = Math.max(exc, x - px, px - (x + cs), y - py, py - (y + cs));
  }
  out.excursion = exc;
  return out;
}

function stats(v) {
  const m = v.reduce((a, b) => a + b, 0) / v.length;
  const sd = Math.sqrt(v.reduce((a, b) => a + (b - m) * (b - m), 0) / v.length);
  return { mean: m, cv: sd / m, min: Math.min(...v), max: Math.max(...v) };
}

const K = K_SHIPPED;
const rows = [];
for (const N of [4, 9, 16]) {
  const cs = 1000 / N;
  const roughness = TARGET / (cs * 0.015 * K);
  const acc = {};
  for (let pos = 0; pos < N * N; pos++) {
    const r = Math.floor(pos / N),
      c = pos % N;
    const d = wobbleRect(c * cs, r * cs, cs, cs, {
      roughness,
      segments: 4,
      seed: 42 + 500 + pos * 7,
      jagged: true,
    });
    const w = windows(d, c * cs, r * cs, cs);
    for (const k of Object.keys(w)) (acc[k] ??= []).push(w[k]);
  }
  const row = { N, cellSize: cs, roughness: +roughness.toFixed(4), maxDisplace: TARGET / K, n: N * N };
  for (const k of Object.keys(acc)) row[k] = stats(acc[k]);
  rows.push(row);
}

// Population run: 4096 independent cells, one geometry (units are size-invariant), N=16 seeds.
{
  const cs = 1000 / 16;
  const roughness = TARGET / (cs * 0.015 * K);
  const acc = {};
  for (let pos = 0; pos < 4096; pos++) {
    const d = wobbleRect(0, 0, cs, cs, {
      roughness,
      segments: 4,
      seed: 42 + 500 + pos * 7,
      jagged: true,
    });
    const w = windows(d, 0, 0, cs);
    for (const k of Object.keys(w)) (acc[k] ??= []).push(w[k]);
  }
  const row = { N: "pop4096", cellSize: cs, roughness: +roughness.toFixed(4), maxDisplace: TARGET / K, n: 4096 };
  for (const k of Object.keys(acc)) row[k] = stats(acc[k]);
  rows.push(row);
}

const fmt = (s) => `${s.mean.toFixed(4)} (CV ${(s.cv * 100).toFixed(1)}%)`;
console.log(`ringSigmaUnits target ${TARGET} · ringK shipped ${K} · maxDisplace = sigma/k = ${(TARGET / K).toFixed(4)} units\n`);
console.log("size  n     W1_r0(0.02-0.22,chord)  W2_perimeter        W3_nodes5           W4_declared(mid80,nominal)  excursion");
for (const r of rows) {
  console.log(
    `${String(r.N).padEnd(6)}${String(r.n).padEnd(6)}${fmt(r.W1_r0).padEnd(24)}${fmt(r.W2_perimeter).padEnd(20)}${fmt(r.W3_nodes5).padEnd(20)}${fmt(r.W4_declared).padEnd(28)}${r.excursion.max.toFixed(3)}`,
  );
}
console.log("\nThe window's shape constant k_w = measured_sigma / maxDisplace, and ringK must EQUAL it");
console.log("for the rendered sigma to read the target. Refit per window, off the population run:\n");
const pop = rows[rows.length - 1];
for (const w of ["W1_r0", "W2_perimeter", "W3_nodes5", "W4_declared"]) {
  const kw = pop[w].mean / (TARGET / K);
  console.log(
    `  ${w.padEnd(14)} k_w = ${kw.toFixed(4)}   (shipped 0.3241 is ${(((K - kw) / kw) * 100).toFixed(1)}% off)  ` +
      `-> sigma read at ringK=0.3241: ${((TARGET / K) * kw).toFixed(4)} units`,
  );
}
console.log("\nper-size spread of each window at the product's own seeds (max-min)/mean:");
for (const w of ["W1_r0", "W2_perimeter", "W3_nodes5", "W4_declared"]) {
  const m = rows.slice(0, 3).map((r) => r[w].mean);
  console.log(
    `  ${w.padEnd(14)} ${m.map((x) => x.toFixed(4)).join(" / ")}  spread ${(((Math.max(...m) - Math.min(...m)) / (m.reduce((a, b) => a + b) / 3)) * 100).toFixed(2)}%`,
  );
}
