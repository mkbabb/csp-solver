// T9-W7 pass 5 · MRK-LIVE · the RING_GEOMETRY graft's witness, re-derived (charter row 11).
// Metric, stated: over every cell at 16x16 (board viewBox 1000, the product seed 42), the
// largest distance any ring VERTEX lies outside its own cell square; the ink passes the square
// by that + half the stroke (tier 2x3 = 10, tier 2 = 7). HEAD = roughness 0.4, 2 segments;
// ABS = pencilConfig RING_GEOMETRY {wanderUnits 5.4, inset f}, 4 segments (its gridPaths hunk).
import { wobbleRect } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@mkbabb/pencil-boil/dist/index.js";
const V = 1000, seed = 42;
function run(N, inset, segs, rough) {
  const cell = V / N; let worst = -Infinity, sample = null;
  for (let pos = 0; pos < N * N; pos++) {
    const r = Math.floor(pos / N), c = pos % N;
    let x = c * cell, y = r * cell, size = cell, rg = rough;
    if (inset !== null) { const s = inset * cell; const pad = (cell - s) / 2; x += pad; y += pad; size = s; rg = 5.4 / (0.015 * s); }
    const d = wobbleRect(x, y, size, size, { roughness: rg, segments: segs, seed: seed + 500 + pos * 7, jagged: true });
    if (!sample) sample = d.slice(0, 120);
    const nums = d.match(/-?\d+(\.\d+)?(e-?\d+)?/g).map(Number);
    for (let i = 0; i + 1 < nums.length; i += 2) {
      const px = nums[i], py = nums[i + 1];
      const out = Math.max(c * cell - px, px - (c + 1) * cell, r * cell - py, py - (r + 1) * cell);
      if (out > worst) worst = out;
    }
  }
  return { worst: +worst.toFixed(3), sample };
}
const a = run(16, null, 2, 0.4), b = run(16, 1.0, 4, null), c = run(16, 0.86, 4, null);
console.log("sample d:", a.sample);
for (const [n, v] of [["HEAD 16x16 (roughness 0.4, seg 2)", a], ["ABS f=1.00", b], ["ABS f=0.86", c]])
  console.log(n, "max vertex excursion past its square (u):", v.worst, "| + stroke 10/2 →", +(v.worst + 5).toFixed(3), "| + stroke 7/2 →", +(v.worst + 3.5).toFixed(3));
