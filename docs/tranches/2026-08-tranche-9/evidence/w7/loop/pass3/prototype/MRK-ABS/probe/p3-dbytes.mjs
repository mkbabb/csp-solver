/** T9-W7 pass 3 · MRK-ABS PROTOTYPE — the price of the pinned segment count, at the SHIPPED
 *  geometry (inset 0.86, wanderUnits 5.4). Re-pointed copy of ../research/…/probe/dbytes.mjs. */
const PB = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@mkbabb/pencil-boil/dist/index.js";
const { wobbleRect } = await import(PB);
const RING = { wanderUnits: 5.4, inset: 0.86 };
for (const N of [4, 9, 16]) {
  const cs = 1000 / N;
  const size = RING.inset * cs;
  const pad = ((1 - RING.inset) / 2) * cs;
  const rough = RING.wanderUnits / (0.015 * size);
  console.log(`${N}x${N}:`);
  for (const [label, segs, r, f] of [
    [`HEAD (segments ${N >= 16 ? 2 : 4}, roughness 0.4, f 1.00)`, N >= 16 ? 2 : 4, 0.4, 1.0],
    ["prototype: segments 4, compensated, f 0.86", 4, rough, RING.inset],
    ["segments 6, compensated, f 0.86", 6, rough, RING.inset],
  ]) {
    let bytes = 0, nodes = 0;
    const sz = f * cs, pd = ((1 - f) / 2) * cs;
    for (let pos = 0; pos < N * N; pos++) {
      const row = Math.floor(pos / N), col = pos % N;
      const d = wobbleRect(col * cs + pd, row * cs + pd, sz, sz, {
        roughness: f === 1.0 ? r : RING.wanderUnits / (0.015 * sz),
        segments: segs,
        seed: 42 + 500 + pos * 7,
        jagged: true,
      });
      bytes += d.length;
      nodes += (d.match(/[ML]/g) || []).length;
    }
    console.log(
      `   ${label.padEnd(44)} ${String(bytes).padStart(7)} B  ${String((bytes / 1024).toFixed(1)).padStart(6)} KiB  ` +
        `${Math.round(bytes / (N * N))} B/cell  ${nodes / (N * N)} nodes/path`,
    );
  }
}
