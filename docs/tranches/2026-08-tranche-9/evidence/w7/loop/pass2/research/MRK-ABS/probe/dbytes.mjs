/** T9-W7 pass 2 · MRK-ABS — the price of the pinned segment count, computed off the library. */
import { wobbleRect } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@mkbabb/pencil-boil/dist/index.js";
const K = 0.3241, TARGET = 1.75;
for (const N of [4, 9, 16]) {
  const cs = 1000 / N;
  const rows = [];
  for (const [label, segs, rough] of [
    ["HEAD (segments " + (N >= 16 ? 2 : 4) + ", roughness 0.4)", N >= 16 ? 2 : 4, 0.4],
    ["pinned 4 + compensated roughness", 4, TARGET / (cs * 0.015 * K)],
    ["segments 6 + compensated", 6, TARGET / (cs * 0.015 * K)],
  ]) {
    let bytes = 0, nodes = 0;
    for (let pos = 0; pos < N * N; pos++) {
      const r = Math.floor(pos / N), c = pos % N;
      const d = wobbleRect(c * cs, r * cs, cs, cs, { roughness: rough, segments: segs, seed: 42 + 500 + pos * 7, jagged: true });
      bytes += d.length; nodes += (d.match(/[ML]/g) || []).length;
    }
    rows.push({ label, bytes, kib: +(bytes / 1024).toFixed(1), perCell: Math.round(bytes / (N * N)), nodesPerPath: nodes / (N * N) });
  }
  console.log(`${N}x${N}:`);
  for (const r of rows) console.log(`   ${r.label.padEnd(40)} ${String(r.bytes).padStart(7)} B  ${String(r.kib).padStart(6)} KiB  ${r.perCell} B/cell  ${r.nodesPerPath} nodes/path`);
}
