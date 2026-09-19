/**
 * MRK-ABS pass-1 · THE SECOND KILL — does the compensated ring stay inside its own cell?
 *
 * The ring is drawn in an svg whose viewBox is the cell padded 15% each side
 * (`useGameCell.ts:86-97`) and whose CSS box is the cell itself, `overflow: visible`
 * (`DigitCell.vue:414`). So the drawn rect sits inside the cell with a margin of
 * (cellPx − ringEdgePx)/2, and the ink reaches that margin as
 * (peak outward excursion) + (half the stroke). `gameCell.css:250` sets stroke-width 7 in
 * ghost-viewBox units. Cross it and the focus ring paints over the neighbour's cell — and
 * over the neighbour's own ghost and `.cell-peer` wash.
 *
 * This walks the WHOLE closed path of every cell (not the σ window), takes the true maximum
 * outward excursion beyond the nominal rect, adds half the stroke, and compares with the
 * margin — at HEAD's roughness and at the compensated roughness, per size.
 *
 * Run: node clearance.mjs
 */
const LIB =
  process.env.PENCIL_BOIL ??
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@mkbabb/pencil-boil/dist/path.js";
const { wobbleRect } = await import(LIB);

// MEASURED, this tree, both engines (logs/scale-*.json).
const GEOM = {
  4: { cellPx: 103.0, pxPerUnit: 0.3169 },
  9: { cellPx: 70.6563, pxPerUnit: 0.4892 },
  16: { cellPx: 39.75, pxPerUnit: 0.4892 },
};
const PHONE = {
  4: { cellPx: 91.25, pxPerUnit: 0.2808 },
  9: { cellPx: 40.5469, pxPerUnit: 0.2807 },
  16: { cellPx: 22.8125, pxPerUnit: 0.2808 },
};
const STROKE_UNITS = 7; // gameCell.css:250 — tier 2, the focus ring
const BASE_ROUGHNESS = 0.4; // gridPaths.ts:63
const TARGET = 1.443; // the mark rung
const K_BY_SEGMENTS = { 2: 0.2076, 4: 0.3241, 6: 0.4167, 8: 0.4989 }; // k-segments.json, pooled

function pts(d) {
  const p = [];
  for (const m of d.matchAll(/([ML])\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g)) p.push([+m[2], +m[3]]);
  return p;
}
/** Max outward excursion of the drawn path beyond the nominal rect, in user units. */
function excursion(d, x, y, w, h) {
  let out = 0;
  for (const [px, py] of pts(d)) {
    const dx = Math.max(x - px, px - (x + w), 0);
    const dy = Math.max(y - py, py - (y + h), 0);
    out = Math.max(out, Math.max(dx, dy));
  }
  return out;
}

const rows = [];
for (const [label, G] of [
  ["desktop", GEOM],
  ["phone", PHONE],
]) {
  for (const n of [4, 9, 16]) {
    const cellSize = 1000 / n;
    const { cellPx, pxPerUnit } = G[n];
    const ringEdgePx = cellSize * pxPerUnit;
    const marginPx = (cellPx - ringEdgePx) / 2;
    const halfStrokePx = (STROKE_UNITS / 2) * pxPerUnit;
    for (const [tag, segments, roughness] of [
      ["HEAD", n >= 16 ? 2 : 4, BASE_ROUGHNESS],
      ["compensated·seg4", 4, TARGET / (cellSize * 0.015 * K_BY_SEGMENTS[4] * GEOM[n].pxPerUnit)],
      ["compensated·seg6", 6, TARGET / (cellSize * 0.015 * K_BY_SEGMENTS[6] * GEOM[n].pxPerUnit)],
    ]) {
      const exc = [];
      for (let pos = 0; pos < n * n; pos++) {
        const x = (pos % n) * cellSize;
        const y = Math.floor(pos / n) * cellSize;
        const d = wobbleRect(x, y, cellSize, cellSize, {
          roughness,
          segments,
          seed: 42 + 500 + pos * 7,
          jagged: true,
        });
        exc.push(excursion(d, x, y, cellSize, cellSize) * pxPerUnit);
      }
      const sorted = [...exc].sort((a, b) => a - b);
      const mean = exc.reduce((a, b) => a + b, 0) / exc.length;
      const worst = sorted[sorted.length - 1];
      const inkWorst = worst + halfStrokePx;
      const crossing = exc.filter((e) => e + halfStrokePx > marginPx).length;
      rows.push({
        viewport: label,
        boardSize: n,
        tag,
        segments,
        roughness: +roughness.toFixed(3),
        cellPx: +cellPx.toFixed(2),
        ringEdgePx: +ringEdgePx.toFixed(2),
        marginPx: +marginPx.toFixed(2),
        halfStrokePx: +halfStrokePx.toFixed(2),
        excursionMeanPx: +mean.toFixed(3),
        excursionMaxPx: +worst.toFixed(3),
        inkReachMaxPx: +inkWorst.toFixed(3),
        headroomPx: +(marginPx - inkWorst).toFixed(3),
        cellsCrossingOwnBox: crossing,
        cellsTotal: n * n,
        fracCrossing: +(crossing / (n * n)).toFixed(3),
      });
    }
  }
}
console.log(JSON.stringify({ strokeUnits: STROKE_UNITS, target: TARGET, rows }, null, 2));
