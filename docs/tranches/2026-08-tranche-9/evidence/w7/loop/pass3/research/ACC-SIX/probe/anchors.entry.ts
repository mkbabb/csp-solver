// ACC-SIX pass-3 RESEARCH probe 3 — EVERY ANCHOR, PRICED. For a tape of width W at each of
// the ring's four corners, the fill fraction at which the clockwise front first enters its
// box. Pure geometry on the product's poses (74a2b5d9); worst of the four poses reported.
import { generateFrameTraceFrames } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/pencil/grid/gridPaths";
import { BOIL_CONFIG, FILTER_PRESETS } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/pencil/config/pencilConfig";

const VB = 1000;
const points = (d: string): [number, number][] => {
  const nums = d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi);
  if (!nums || nums.length < 4) return [];
  const pts: [number, number][] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push([Number(nums[i]), Number(nums[i + 1])]);
  if (/z\s*$/i.test(d) && pts.length) pts.push(pts[0]);
  return pts;
};
const frames = generateFrameTraceFrames(
  VB,
  42,
  BOIL_CONFIG.frameCount,
  BOIL_CONFIG.frameBoil,
  FILTER_PRESETS["grain-static"]?.grain,
);
const poses = frames.map(points);
const lens = poses.map((p) => {
  let t = 0;
  for (let i = 1; i < p.length; i++) t += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
  return t;
});

/** First fraction at which any pose POINT falls inside the axis-aligned box, worst pose. */
function entry(box: { x0: number; x1: number; y0: number; y1: number }) {
  const per = poses.map((p, pi) => {
    let run = 0;
    for (let i = 1; i < p.length; i++) {
      run += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
      const [x, y] = p[i];
      if (x >= box.x0 && x <= box.x1 && y >= box.y0 && y <= box.y1) return run / lens[pi];
    }
    return 1;
  });
  return { perPose: per.map((f) => +f.toFixed(5)), worst: +Math.min(...per).toFixed(5) };
}

// Board / tape in px, converted to viewBox units. Tape height 23px desk / 20px phone (pass-2
// readings); the ring's stroke is 8 units wide, so the box is padded by half a stroke.
const HALF_STROKE = 4;
const CASES = [
  { name: "desk", boardPx: 636, tapeW: 118, tapeH: 23, inset: 7.6 },
  { name: "phone", boardPx: 365, tapeW: 105, tapeH: 20, inset: 4.4 },
  { name: "landscape", boardPx: 306, tapeW: 105, tapeH: 20, inset: 3.7 },
  { name: "desk-3digit", boardPx: 636, tapeW: 140, tapeH: 23, inset: 7.6 },
];
const out: Record<string, unknown> = {};
out.anchors = CASES.map((c) => {
  const u = (px: number) => (px / c.boardPx) * VB;
  const w = u(c.tapeW),
    h = u(c.tapeH),
    i = u(c.inset);
  const boxes = {
    "top-right": { x0: VB - i - w - HALF_STROKE, x1: VB, y0: -HALF_STROKE, y1: h + HALF_STROKE },
    "top-left": { x0: -HALF_STROKE, x1: i + w + HALF_STROKE, y0: -HALF_STROKE, y1: h + HALF_STROKE },
    "bottom-right": { x0: VB - i - w - HALF_STROKE, x1: VB, y0: VB - h - HALF_STROKE, y1: VB + HALF_STROKE },
    "bottom-left": { x0: -HALF_STROKE, x1: i + w + HALF_STROKE, y0: VB - h - HALF_STROKE, y1: VB + HALF_STROKE },
  };
  const rows = Object.fromEntries(Object.entries(boxes).map(([k, b]) => [k, entry(b)]));
  return { case: c.name, tapeWidthUnits: +w.toFixed(1), tapeHeightUnits: +h.toFixed(1), rows };
});

// What each anchor's worst fraction admits, per deal (writable from csp-solver's bands).
const DEALS: [string, number][] = [
  ["4x4 easy", 4],
  ["4x4 medium", 9],
  ["4x4 hard", 12],
  ["9x9 easy", 20],
  ["9x9 medium", 46],
  ["9x9 hard", 64],
  ["16x16 easy", 64],
  ["16x16 medium", 146],
  ["16x16 hard", 204],
];
const worstAcrossViewports = (anchor: string) =>
  Math.min(
    ...(out.anchors as { rows: Record<string, { worst: number }> }[]).map((a) => a.rows[anchor].worst),
  );
out.maxFillsClear = ["top-right", "top-left", "bottom-right", "bottom-left"].map((anchor) => {
  const f = worstAcrossViewports(anchor);
  return {
    anchor,
    worstEntryFrac: +f.toFixed(5),
    worstEntryPct: +(f * 100).toFixed(2),
    fills: Object.fromEntries(DEALS.map(([n, w]) => [n, Math.max(0, Math.ceil(f * w) - 1)])),
  };
});

process.stdout.write(JSON.stringify(out, null, 2) + "\n");
