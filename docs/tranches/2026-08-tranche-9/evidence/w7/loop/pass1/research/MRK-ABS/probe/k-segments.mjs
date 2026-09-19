/**
 * MRK-ABS pass-1 · WHY k SPLITS, and the one change that makes it a constant.
 *
 * `k-constant.mjs` reads k (the shape constant in σ = k × roughness × len × 0.015 × pxPerUnit)
 * as 0.318 / 0.323 / 0.227 at 4×4 / 9×9 / 16×16. The first two agree to 1.7%; the third is
 * 30% low. The only thing that differs at 16×16 is `gridPaths.ts:52` —
 * `const cellSegments = boardSize >= 16 ? 2 : 4` — so k is not a property of the board, it is
 * a property of the SEGMENT COUNT. This sweeps segments 2/4/6/8/10 at each size and reports
 * k, its per-cell spread, the in-band fraction and the path's own byte cost, so the family can
 * say whether "one constant across three sizes" is buyable and what it costs.
 *
 * Run: node k-segments.mjs
 */
const LIB =
  process.env.PENCIL_BOIL ??
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@mkbabb/pencil-boil/dist/path.js";
const { wobbleRect } = await import(LIB);

const SCALE = { 4: 0.3169, 9: 0.4892, 16: 0.4892 }; // MEASURED, logs/scale-desktop-*.json
const BAND = { floor: 0.722, ceiling: 2.886, target: 1.443 };
const BASE_ROUGHNESS = 0.4;

function parse(d) {
  const p = [];
  for (const m of d.matchAll(/([ML])\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g)) p.push([+m[2], +m[3]]);
  p.push([p[0][0], p[0][1]]);
  return p;
}
function cum(p) {
  const a = [0];
  for (let i = 1; i < p.length; i++) a.push(a[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
  return a;
}
function at(p, a, s) {
  const t = Math.max(0, Math.min(a[a.length - 1], s));
  let i = 1;
  while (i < a.length && a[i] < t) i++;
  if (i >= a.length) return p[p.length - 1];
  const seg = a[i] - a[i - 1] || 1;
  const f = (t - a[i - 1]) / seg;
  return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * f, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * f];
}
function fit(d, s, l0 = 0.02, l1 = 0.22, n = 32) {
  const p = parse(d);
  const a = cum(p);
  const T = a[a.length - 1];
  const w = [];
  for (let i = 0; i <= n; i++) {
    const q = at(p, a, T * (l0 + (l1 - l0) * (i / n)));
    w.push([q[0] * s, q[1] * s]);
  }
  const [ax, ay] = w[0];
  const [bx, by] = w[w.length - 1];
  const dx = bx - ax;
  const dy = by - ay;
  const L = Math.hypot(dx, dy) || 1;
  let sum = 0;
  let mx = 0;
  for (const [x, y] of w) {
    const dd = Math.abs((x - ax) * dy - (y - ay) * dx) / L;
    sum += dd * dd;
    if (dd > mx) mx = dd;
  }
  return { sigma: Math.sqrt(sum / w.length), max: mx };
}
function stats(xs) {
  const n = xs.length;
  const mean = xs.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  const s = [...xs].sort((a, b) => a - b);
  const q = (p) => s[Math.round(p * (n - 1))];
  const r = (v) => +v.toFixed(4);
  return { mean: r(mean), cv: +(sd / mean).toFixed(3), p10: r(q(0.1)), p90: r(q(0.9)) };
}

const out = [];
for (const n of [4, 9, 16]) {
  for (const segments of [2, 4, 6, 8, 10]) {
    const cellSize = 1000 / n;
    const s = SCALE[n];
    // k at the base roughness
    const sig0 = [];
    let bytes0 = 0;
    for (let pos = 0; pos < n * n; pos++) {
      const d = wobbleRect((pos % n) * cellSize, Math.floor(pos / n) * cellSize, cellSize, cellSize, {
        roughness: BASE_ROUGHNESS,
        segments,
        seed: 42 + 500 + pos * 7,
        jagged: true,
      });
      sig0.push(fit(d, s).sigma);
      bytes0 += d.length;
    }
    const st0 = stats(sig0);
    const k = st0.mean / (BASE_ROUGHNESS * cellSize * 0.015 * s);
    // the compensated ring at this segment count, k fit HERE
    const roughness = BAND.target / (cellSize * 0.015 * k * s);
    const sig1 = [];
    const mx1 = [];
    let bytes1 = 0;
    for (let pos = 0; pos < n * n; pos++) {
      const d = wobbleRect((pos % n) * cellSize, Math.floor(pos / n) * cellSize, cellSize, cellSize, {
        roughness,
        segments,
        seed: 42 + 500 + pos * 7,
        jagged: true,
      });
      const f = fit(d, s);
      sig1.push(f.sigma);
      mx1.push(f.max);
      bytes1 += d.length;
    }
    const st1 = stats(sig1);
    out.push({
      boardSize: n,
      segments,
      shipped: segments === (n >= 16 ? 2 : 4),
      k: +k.toFixed(4),
      sigmaAtHead: st0.mean,
      cvAtHead: st0.cv,
      roughnessForTarget: +roughness.toFixed(3),
      sigmaCompensated: st1.mean,
      cvCompensated: st1.cv,
      p10: st1.p10,
      p90: st1.p90,
      fracInBand: +(sig1.filter((v) => v >= BAND.floor && v <= BAND.ceiling).length / sig1.length).toFixed(3),
      maxDevMean: stats(mx1).mean,
      pathBytesTotal: bytes1,
      pathBytesPerCell: Math.round(bytes1 / (n * n)),
      shippedBytesTotal: bytes0,
    });
  }
}

// One k, fit across the three sizes at a COMMON segment count, then re-read each size.
const unified = [];
for (const segments of [4, 6, 8]) {
  const ks = out.filter((r) => r.segments === segments).map((r) => r.k);
  const kBar = ks.reduce((a, b) => a + b, 0) / ks.length;
  const rows = [4, 9, 16].map((n) => {
    const cellSize = 1000 / n;
    const s = SCALE[n];
    const roughness = BAND.target / (cellSize * 0.015 * kBar * s);
    const sig = [];
    for (let pos = 0; pos < n * n; pos++) {
      const d = wobbleRect((pos % n) * cellSize, Math.floor(pos / n) * cellSize, cellSize, cellSize, {
        roughness,
        segments,
        seed: 42 + 500 + pos * 7,
        jagged: true,
      });
      sig.push(fit(d, s).sigma);
    }
    const st = stats(sig);
    return {
      boardSize: n,
      roughness: +roughness.toFixed(3),
      sigma: st.mean,
      cv: st.cv,
      errVsTarget: +((st.mean / BAND.target - 1) * 100).toFixed(1),
      fracInBand: +(sig.filter((v) => v >= BAND.floor && v <= BAND.ceiling).length / sig.length).toFixed(3),
    };
  });
  unified.push({ segments, kBar: +kBar.toFixed(4), kSpreadPct: +(((Math.max(...ks) - Math.min(...ks)) / kBar) * 100).toFixed(1), rows });
}

console.log(JSON.stringify({ band: BAND, scale: SCALE, sweep: out, unified }, null, 2));
