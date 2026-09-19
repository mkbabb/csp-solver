/**
 * T9-W7 pass 3 · MRK-ABS PROTOTYPE — G-ABS-8: POSE 0 IS THE SHIPPED ARTIFACT.
 * The board's resident `d` for cell 0, read off the live DOM by `p3-census.spec.ts` test A and
 * banked in `boardpx-<engine>.json`, recomputed OFFLINE from the library alone with the same
 * seed and RING_GEOMETRY. Byte identity, or the gate is red.
 */
const PB =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@mkbabb/pencil-boil/dist/index.js";
const { wobbleRect } = await import(PB);
import { readFileSync } from "node:fs";

const RING = { wanderUnits: 5.4, inset: 0.86 };
const VIEWBOX = 1000,
  SEED = 42;
const LOGS =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/MRK-ABS/logs";

const expected = (N, pos) => {
  const cs = VIEWBOX / N,
    size = RING.inset * cs,
    pad = ((1 - RING.inset) / 2) * cs;
  const r = Math.floor(pos / N),
    c = pos % N;
  return wobbleRect(c * cs + pad, r * cs + pad, size, size, {
    roughness: RING.wanderUnits / (0.015 * size),
    segments: 4,
    seed: SEED + 500 + pos * 7,
    jagged: true,
  });
};

let allOk = true;
for (const engine of ["chromium", "webkit"]) {
  let rows;
  try {
    rows = JSON.parse(readFileSync(`${LOGS}/boardpx-${engine}.json`, "utf8"));
  } catch {
    console.log(`${engine}: no board log`);
    continue;
  }
  for (const row of rows) {
    const N = parseInt(row.board, 10);
    const want = expected(N, 0);
    const ok = want === row.d0;
    if (!ok) allOk = false;
    console.log(
      `  ${engine.padEnd(9)}${row.board.padEnd(7)}boardPx ${String(row.boardPx).padEnd(8)}` +
        `DOM d ${String(row.d0.length).padEnd(5)}B  library d ${String(want.length).padEnd(5)}B  ${ok ? "IDENTICAL" : "DIFFERS"}`,
    );
    if (!ok) console.log(`      DOM: ${row.d0.slice(0, 96)}\n      LIB: ${want.slice(0, 96)}`);
  }
}
console.log(`\nG-ABS-8: ${allOk ? "GREEN" : "RED"}`);
