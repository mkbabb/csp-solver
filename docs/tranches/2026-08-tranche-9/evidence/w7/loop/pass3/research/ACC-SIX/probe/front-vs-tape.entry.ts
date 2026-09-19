// ACC-SIX pass-3 RESEARCH probe 2 — WHERE THE FRONT IS WHEN THE TAPE IS UP.
// Pure geometry on the product's own poses (74a2b5d9). No browser: the ring is bake-time.
// Answers the two numbers the count tape's zero-occlusion claim rests on:
//   (a) the fill fraction at which the clockwise front first enters the tape's box, per
//       viewport (the tape's left edge in viewBox units), worst pose;
//   (b) the fill counts that fraction admits, per board size × difficulty (writable cells
//       from csp-solver's own target_holes bands).
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
const lengths = poses.map((p) => {
  let t = 0;
  for (let i = 1; i < p.length; i++) t += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
  return t;
});

/** First cumulative fraction at which the pose's point x reaches `xu` while still on the top run. */
function fracAtX(pose: [number, number][], total: number, xu: number): number {
  let run = 0;
  for (let i = 1; i < pose.length; i++) {
    run += Math.hypot(pose[i][0] - pose[i - 1][0], pose[i][1] - pose[i - 1][1]);
    if (pose[i][0] >= xu && pose[i][1] < VB / 2) return run / total;
  }
  return 1;
}
/** Cumulative fraction at the pose's rightmost top point (the top-right corner itself). */
function fracAtTopRight(pose: [number, number][], total: number) {
  let run = 0,
    best = { frac: 1, x: -Infinity };
  for (let i = 1; i < pose.length; i++) {
    run += Math.hypot(pose[i][0] - pose[i - 1][0], pose[i][1] - pose[i - 1][1]);
    if (pose[i][1] < VB / 2 && pose[i][0] > best.x) best = { frac: run / total, x: pose[i][0] };
  }
  return best;
}

const out: Record<string, unknown> = {};
out.poses = poses.map((p, i) => ({ pose: i, segments: p.length - 1, lengthUnits: +lengths[i].toFixed(3) }));
out.topRight = poses.map((p, i) => {
  const b = fracAtTopRight(p, lengths[i]);
  return { pose: i, fracAtRightmostTopPoint: +b.frac.toFixed(5), xUnits: +b.x.toFixed(2) };
});

// The tape's box, per the pass-2 spec's placement: right inset = FRAME_X_PAD scaled to the
// board's px, width measured on the surface. Board px and tape px are the pass-2 readings.
const VIEWPORTS = [
  { name: "desk 1280x800", boardPx: 636, tapePx: 118, rightInsetPx: 7.6 },
  { name: "phone 393x699 dpr3", boardPx: 365, tapePx: 105, rightInsetPx: 4.4 },
  { name: "landscape 844x390", boardPx: 306, tapePx: 105, rightInsetPx: 3.7 },
  // the 16x16 arm: a three-digit count on both sides widens the drawn string
  { name: "desk 1280x800 · 3-digit count", boardPx: 636, tapePx: 140, rightInsetPx: 7.6 },
];
out.tapeEntry = VIEWPORTS.map((v) => {
  const leftEdgeUnits = ((v.boardPx - v.rightInsetPx - v.tapePx) / v.boardPx) * VB;
  const per = poses.map((p, i) => fracAtX(p, lengths[i], leftEdgeUnits));
  return {
    ...v,
    tapeLeftEdgeUnits: +leftEdgeUnits.toFixed(2),
    fracAtEntryPerPose: per.map((f) => +f.toFixed(5)),
    worstPoseEntryFrac: +Math.min(...per).toFixed(5),
    worstPoseEntryPct: +(Math.min(...per) * 100).toFixed(2),
  };
});

// Writable cells per shipped deal — csp-solver target_holes (sudoku/killer/thermo band:
// Easy len/4, Medium len/1.75, Hard len/1.25; kenken = whole board; futoshiki = density).
const DEALS = [
  { board: "4x4 (sudoku/killer/thermo)", cells: 16, easy: 4, medium: 9, hard: 12 },
  { board: "9x9", cells: 81, easy: 20, medium: 46, hard: 64 },
  { board: "16x16", cells: 256, easy: 64, medium: 146, hard: 204 },
];
out.fillShare = DEALS.flatMap((d) =>
  (["easy", "medium", "hard"] as const).map((k) => ({
    board: d.board,
    level: k,
    writable: d[k],
    fill1: +((1 / d[k]) * 100).toFixed(2),
    fill2: +((2 / d[k]) * 100).toFixed(2),
    fill3: +((3 / d[k]) * 100).toFixed(2),
  })),
);

// The closed form the lane banked, evaluated: the tape may be up while progress < entry.
const entryDesk = Math.min(...poses.map((p, i) => fracAtX(p, lengths[i], ((636 - 7.6 - 118) / 636) * VB)));
out.layDownVerdict = (out.fillShare as { board: string; level: string; writable: number; fill3: number }[]).map(
  (r) => ({
    board: r.board,
    level: r.level,
    writable: r.writable,
    maxFillsClear: Math.max(0, Math.ceil(entryDesk * r.writable) - 1),
    threeFillsClear: r.fill3 / 100 < entryDesk,
  }),
);
out.entryDeskFrac = +entryDesk.toFixed(5);

process.stdout.write(JSON.stringify(out, null, 2) + "\n");
