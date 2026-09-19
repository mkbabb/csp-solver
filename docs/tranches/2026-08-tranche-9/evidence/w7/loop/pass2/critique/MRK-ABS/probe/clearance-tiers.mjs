/**
 * T9-W7 pass 2 · MRK-ABS PROTOTYPE — MA-R (boundary B) and MA-N (boundary C), PER CELL.
 *
 * Copied from ../research/MRK-ABS/probe/clearance.mjs and re-pointed at the prototype's
 * RING_GEOMETRY (wanderUnits 5.4, inset 0.86). The research form scored the model's closed
 * form; this form scores EVERY CELL's own path — each cell's real outward excursion beyond the
 * rect it was drawn on — so "B >= 0 for every cell" is a count, not an average.
 *
 * All lengths in the ghost's user units (= board units), converted to px at boardPx/1300
 * (the ghost SVG is `inset-0 h-full w-full` over a viewBox padded 0.15*cellSize per side, so
 * one ghost unit is 1/1.3 of a grid unit on screen). The rule's half band is 2.5 BOARD units
 * = 3.25 ghost units.
 *
 * Run: node .pass2-mrkabs/clearance-p2.mjs   (from web/frontend)
 */
import { wobbleRect } from "@mkbabb/pencil-boil";
import process from "node:process";

const RING = { wanderUnits: 5.4, inset: 0.86, kW4: 0.443 };
const VIEWBOX = 1000;
const PAD = 0.15; // useGameCell.ts:91
const HALF_STROKE = Number(process.env.HS ?? 3.5); // CRITIC: parameterised over the four tiers
const RULE_HALF = (5 / 2) * 1.3; // HandDrawnGrid stroke 5 board units -> 3.25 ghost units
const SEED = 42;
const BOARD_PX = { desk: { 4: 412, 9: 636, 16: 636 }, phone: { 4: 236, 9: 365, 16: 365 } };

function parse(d) {
  const pts = [];
  for (const m of d.matchAll(/([ML])\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g))
    pts.push([parseFloat(m[2]), parseFloat(m[3])]);
  return pts;
}

function run(N, f) {
  const cs = VIEWBOX / N;
  const size = f * cs;
  const pad = ((1 - f) / 2) * cs;
  const roughness = RING.wanderUnits / (0.015 * size);
  const margin = PAD * cs + pad; // ring rect edge -> cell's nominal box edge
  const rows = [];
  for (let pos = 0; pos < N * N; pos++) {
    const r = Math.floor(pos / N),
      c = pos % N;
    const x = c * cs + pad,
      y = r * cs + pad;
    const d = wobbleRect(x, y, size, size, {
      roughness,
      segments: 4,
      seed: SEED + 500 + pos * 7,
      jagged: true,
    });
    let exc = 0;
    for (const [px, py] of parse(d))
      exc = Math.max(exc, x - px, px - (x + size), y - py, py - (y + size));
    const A = margin - exc - HALF_STROKE;
    rows.push({ pos, exc, A, B: A - RULE_HALF, C: A + RULE_HALF });
  }
  return { N, cs, size, roughness, margin, rows };
}

const px = (u, boardPx) => (u * boardPx) / (VIEWBOX * 1.3);
const min = (a) => a.reduce((m, v) => (v < m ? v : m), Infinity);
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];

for (const f of [1.0, 0.9, 0.86]) {
  console.log(`\n=== f = ${f.toFixed(2)} ${f === RING.inset ? "(SHIPPED)" : f === 0.9 ? "(the U-10 alternate)" : "(pass 1)"}`);
  console.log("  view    N     n     inset_px  worstB_px  medB_px   B>=0      worstC_px  C>=0");
  for (const view of ["desk", "phone"]) {
    for (const N of [4, 9, 16]) {
      const g = run(N, f);
      const bp = BOARD_PX[view][N];
      const B = g.rows.map((r) => px(r.B, bp));
      const C = g.rows.map((r) => px(r.C, bp));
      const nB = B.filter((v) => v >= 0).length;
      const nC = C.filter((v) => v >= 0).length;
      console.log(
        `  ${view.padEnd(8)}${String(N).padEnd(6)}${String(g.rows.length).padEnd(6)}` +
          `${px(((1 - f) / 2) * g.cs, bp).toFixed(2).padEnd(10)}` +
          `${min(B).toFixed(3).padEnd(11)}${med(B).toFixed(3).padEnd(10)}` +
          `${`${nB}/${g.rows.length}`.padEnd(10)}${min(C).toFixed(3).padEnd(11)}${nC}/${g.rows.length}`,
      );
    }
  }
}

console.log("\nCEILINGS (where each boundary reaches zero, at f = 0.86, worst-case excursion 5.400):");
for (const [name, extra] of [
  ["A  the cell's nominal box", 0],
  ["B  the rule's inner painted edge", RULE_HALF],
  ["C  the neighbour (rule's outer edge)", -RULE_HALF],
]) {
  const need = 5.4 + HALF_STROKE + extra;
  const cs = need / (PAD + (1 - RING.inset) / 2);
  console.log(
    `  ${name.padEnd(36)} zero at cellSize ${cs.toFixed(2)} -> boardSize ${(VIEWBOX / cs).toFixed(2)}  (largest whole board ${Math.floor(VIEWBOX / cs)})`,
  );
}
