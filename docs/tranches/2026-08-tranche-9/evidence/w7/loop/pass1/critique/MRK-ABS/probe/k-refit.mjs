/**
 * CRITIQUE · independent re-derivation of ringK and the sigma-in-units claim.
 * Reads the SAME library the product draws with; no browser needed for the geometry half.
 * Walks the drawn path's FIRST EDGE (the window the prototype's DOM probe uses, 0.02-0.22
 * of the closed path) and takes the RMS perpendicular residual off that edge's chord, in
 * board units. Also reports the full-path residual so the window choice is visible.
 */
const LIB = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@mkbabb/pencil-boil/dist/path.js";
const { wobbleRect } = await import(LIB);

const SIGMA_UNITS = 1.75, K = 0.3241;
function pts(d) {
  const p = [];
  for (const m of d.matchAll(/([ML])\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g)) p.push([+m[2], +m[3]]);
  return p;
}
function rms(points) {
  const [ax, ay] = points[0], [bx, by] = points[points.length - 1];
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
  let s = 0;
  for (const [x, y] of points) { const d = Math.abs((x - ax) * dy - (y - ay) * dx) / len; s += d * d; }
  return Math.sqrt(s / points.length);
}
const out = {};
for (const n of [4, 9, 16]) {
  const cellSize = 1000 / n;
  const rough = SIGMA_UNITS / (cellSize * 0.015 * K);
  const sig = [], exc = [];
  for (let pos = 0; pos < n * n; pos++) {
    const x = (pos % n) * cellSize, y = Math.floor(pos / n) * cellSize;
    const d = wobbleRect(x, y, cellSize, cellSize, { roughness: rough, segments: 4, seed: 42 + 500 + pos * 7, jagged: true });
    const P = pts(d);
    // first edge = points 0..segments (5 points at segments 4)
    sig.push(rms(P.slice(0, 5)));
    let e = 0;
    for (const [px, py] of P) {
      e = Math.max(e, Math.max(Math.max(x - px, px - (x + cellSize), 0), Math.max(y - py, py - (y + cellSize), 0)));
    }
    exc.push(e);
    if (pos === 0) out[`nodes_${n}`] = P.length;
  }
  const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
  const m = mean(sig);
  const sd = Math.sqrt(mean(sig.map(v => (v - m) ** 2)));
  out[`n${n}`] = {
    roughness: +rough.toFixed(4),
    sigmaUnitsMean: +m.toFixed(4),
    sigmaUnitsCV: +(sd / m).toFixed(3),
    sigmaUnitsMin: +Math.min(...sig).toFixed(3),
    sigmaUnitsMax: +Math.max(...sig).toFixed(3),
    deltaFromTargetPct: +(((m - SIGMA_UNITS) / SIGMA_UNITS) * 100).toFixed(2),
    kImplied: +(SIGMA_UNITS / (cellSize * 0.015 * rough) * (m / SIGMA_UNITS)).toFixed(4),
    excursionMaxUnits: +Math.max(...exc).toFixed(3),
    excursionMeanUnits: +mean(exc).toFixed(3),
  };
}
const means = [out.n4.sigmaUnitsMean, out.n9.sigmaUnitsMean, out.n16.sigmaUnitsMean];
out.spreadPct = +(((Math.max(...means) - Math.min(...means)) / Math.min(...means)) * 100).toFixed(2);
console.log(JSON.stringify(out, null, 2));
