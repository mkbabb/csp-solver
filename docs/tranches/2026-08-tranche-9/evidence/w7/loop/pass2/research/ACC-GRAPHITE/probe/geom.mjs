/**
 * ACC-GRAPHITE pass-2 RESEARCH — the arithmetic the pass-1 prototype asserted and did not
 * compute: the tally's pitch/ink/gap across every board size the estate ships, and the two
 * focus passes' fusion as a function of RETRACE_INSET.
 *
 * Runs the WORKTREE's real generators (bundled by esbuild from
 * .claude/worktrees/wf_e58b4764-0fc-43/web/frontend/src/pencil/grid/gridPaths.ts), never a
 * re-implementation. Read-only: it writes one JSON into this lane's readings/.
 */
import { writeFileSync } from "node:fs";
import {
  generateFrameTraceFrames,
  generateCellRects,
  generateCellRetraceRects,
  tickMarksAlong,
} from "./gridPaths.bundle.mjs";

const VIEWBOX = 1000;
const FRAME_COUNT = 4;
const FRAME_BOIL = 1.5;

const pts = (d) =>
  (d.match(/-?\d[\d.e+-]*,-?\d[\d.e+-]*/g) ?? []).map((p) => p.split(",").map(Number));
const arcLen = (P) => {
  let s = 0;
  for (let i = 1; i < P.length; i++) s += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
  return s;
};
const subpaths = (d) => (d.match(/M/g) ?? []).length;
const round = (v, n = 3) => Math.round(v * 10 ** n) / 10 ** n;

// ── The boards the estate ships, with their real writable counts ────────────────────────
// writable = totalCells - givens (GameBoard.vue:358 `fillable`). Given counts are the
// generator's own bands, read from the puzzle data layer; the 9x9 figure 51 is the
// prototype's masked default (HandDrawnGrid.vue:114 `props.writable ?? 51`).
const BOARDS = [
  { n: 4, label: "4x4", writable: [10, 12] },
  { n: 6, label: "6x6", writable: [20, 26] },
  { n: 9, label: "9x9", writable: [43, 51, 58] },
  { n: 16, label: "16x16", writable: [150, 200, 210] },
];

// Rendered scale, measured on the running pass-1 prototype (prototype README section 2:
// a 12-unit cell-ghost stroke renders 5.87 CSS px desk / 3.37 CSS px phone). The BOARD svg
// is a plain 1000-unit viewBox with no pad, so its px/unit is the board's own width/1000.
const SCALES = {
  // board px at 1280x800 dpr1 and 393x699 dpr3, read off the pass-1 readings
  desk: 0.56, // ~560 px board
  phone: 0.322, // ~322 px board
};
const CELL_GHOST_SCALE = { desk: 5.87 / 12, phone: 3.37 / 12 };

const out = { tally: [], retrace: [], fusion: [], counts: [] };

// ── 1 · the tally ────────────────────────────────────────────────────────────────────────
const frames = generateFrameTraceFrames(VIEWBOX, 42, FRAME_COUNT, FRAME_BOIL, undefined);
const framePerim = arcLen(pts(frames[0]));
const STROKE_UNITS = 10; // HandDrawnGrid.vue:512 stroke-width="10", linecap butt
const DUTY = 0.57; // gridPaths.ts:163 tickMarksAlong default

for (const b of BOARDS) {
  for (const w of b.writable) {
    const pitch = framePerim / w;
    const ink = pitch * DUTY;
    const gap = pitch - ink;
    for (const [vp, s] of Object.entries(SCALES)) {
      out.tally.push({
        board: b.label,
        writable: w,
        viewport: vp,
        perimUnits: round(framePerim, 1),
        pitchUnits: round(pitch, 2),
        inkUnits: round(ink, 2),
        gapUnits: round(gap, 2),
        pitchPx: round(pitch * s, 2),
        inkPx: round(ink * s, 2),
        gapPx: round(gap * s, 2),
        strokePx: round(STROKE_UNITS * s, 2),
        // a tick is legible AS a tick when it is longer than it is thick
        tickAspect: round(ink / STROKE_UNITS, 2),
        // the connected-component floor the pass-1 probe used
        overSixPxFloor: ink * s >= 6,
      });
    }
  }
}

// ── 2 · tickMarksAlong really emits k subpaths at every board/k ──────────────────────────
for (const b of BOARDS) {
  const w = b.writable[Math.floor(b.writable.length / 2)];
  for (const k of [1, 3, 20, Math.round(w / 2), w - 1, w]) {
    if (k < 1 || k > w) continue;
    const d = tickMarksAlong(frames[0], k, w);
    out.counts.push({ board: b.label, writable: w, k, subpaths: subpaths(d), equal: subpaths(d) === k });
  }
}

// ── 3 · the two focus passes: what INSET buys ────────────────────────────────────────────
// Both passes are 12 units wide (gameCell.css tier 2). Centreline separation is the inset;
// paper between the painted bands is inset - 12. Fused band = inset + 12.
const RING_STROKE = 12;
for (const inset of [10, 12, 14, 16, 18, 20, 24]) {
  const paperUnits = inset - RING_STROKE;
  const bandUnits = inset + RING_STROKE;
  out.fusion.push({
    insetUnits: inset,
    paperUnits,
    bandUnits,
    paperPxDesk: round(paperUnits * CELL_GHOST_SCALE.desk, 2),
    paperPxPhone: round(paperUnits * CELL_GHOST_SCALE.phone, 2),
    paperDevicePxPhone: round(paperUnits * CELL_GHOST_SCALE.phone * 3, 2),
    bandPxDesk: round(bandUnits * CELL_GHOST_SCALE.desk, 2),
    peakPxDesk: round((paperUnits > 0 ? RING_STROKE : bandUnits) * CELL_GHOST_SCALE.desk, 2),
    peakPxPhone: round((paperUnits > 0 ? RING_STROKE : bandUnits) * CELL_GHOST_SCALE.phone, 2),
    // the phone-light-chromium rival the pass-1 rank gate lost to
    beatsFrameCorner893: (paperUnits > 0 ? RING_STROKE : bandUnits) * CELL_GHOST_SCALE.phone > 8.33,
  });
}

// ── 4 · are the two passes' edges independent? (the claim a single heavy stroke cannot make)
// Per-vertex radial deviation of each path from its own nominal rect, at 9x9 and 16x16.
for (const n of [4, 9, 16]) {
  const outer = generateCellRects(n, 3, VIEWBOX, 42);
  const inner = generateCellRetraceRects(n, VIEWBOX, 42);
  const cellSize = VIEWBOX / n;
  const pos = Math.floor((n * n) / 2);
  const dev = (d, x0, y0, size) => {
    const P = pts(d);
    return P.map(([x, y]) => {
      // signed distance outward from the nominal rect edge the vertex belongs to
      const dl = x - x0,
        dr = x0 + size - x,
        dt = y - y0,
        db = y0 + size - y;
      const m = Math.min(dl, dr, dt, db);
      return -m; // outward positive
    });
  };
  const insetUsed = Math.min(10, cellSize / 4);
  const r = Math.floor(pos / n),
    c = pos % n;
  const dOuter = dev(outer[pos], c * cellSize, r * cellSize, cellSize);
  const dInner = dev(inner[pos], c * cellSize + insetUsed, r * cellSize + insetUsed, cellSize - insetUsed * 2);
  const sd = (a) => {
    const m = a.reduce((s, v) => s + v, 0) / a.length;
    return Math.sqrt(a.reduce((s, v) => s + (v - m) ** 2, 0) / a.length);
  };
  // the inner path is REVERSED, so compare it against the outer read backwards
  const rev = [...dOuter].reverse();
  const nmin = Math.min(dInner.length, rev.length);
  const a = dInner.slice(0, nmin),
    bb = rev.slice(0, nmin);
  const ma = a.reduce((s, v) => s + v, 0) / nmin,
    mb = bb.reduce((s, v) => s + v, 0) / nmin;
  let cov = 0,
    va = 0,
    vb = 0;
  for (let i = 0; i < nmin; i++) {
    cov += (a[i] - ma) * (bb[i] - mb);
    va += (a[i] - ma) ** 2;
    vb += (bb[i] - mb) ** 2;
  }
  out.retrace.push({
    board: `${n}x${n}`,
    cellSizeUnits: round(cellSize, 2),
    insetUsed: round(insetUsed, 2),
    insetClampedByCellQuarter: insetUsed < 10,
    outerVerts: dOuter.length,
    innerVerts: dInner.length,
    outerSigmaUnits: round(sd(dOuter), 3),
    innerSigmaUnits: round(sd(dInner), 3),
    edgeCorrelation: round(cov / Math.sqrt(va * vb || 1), 4),
  });
}

writeFileSync(
  new URL("../readings/geom.json", import.meta.url),
  JSON.stringify(out, null, 1),
);
console.log(JSON.stringify(out, null, 1));
