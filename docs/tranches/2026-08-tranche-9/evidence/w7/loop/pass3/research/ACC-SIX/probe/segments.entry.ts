// ACC-SIX pass-3 RESEARCH probe — the geometry the dash law is actually about.
// Read-only: imports the product's own generators at 74a2b5d9 and prints numbers.
// Bundled with esbuild, run in node (no browser, no server).
import {
  generateFrameTraceFrames,
  generateGridBoilFrames,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/pencil/grid/gridPaths";
import { BOIL_CONFIG, FILTER_PRESETS } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/pencil/config/pencilConfig";

const VIEWBOX_SIZE = 1000;

function points(d: string): [number, number][] {
  const nums = d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi);
  if (!nums || nums.length < 4) return [];
  const pts: [number, number][] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push([Number(nums[i]), Number(nums[i + 1])]);
  if (/z\s*$/i.test(d) && pts.length) pts.push(pts[0]);
  return pts;
}
const len = (pts: [number, number][]) => {
  let t = 0;
  for (let i = 1; i < pts.length; i++) t += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return t;
};

const out: Record<string, unknown> = {};

// 1 · the fill gauge's ring, exactly as HandDrawnGrid.vue:99-108 builds it
const grain = FILTER_PRESETS["grain-static"]?.grain;
const trace = generateFrameTraceFrames(
  VIEWBOX_SIZE,
  42,
  BOIL_CONFIG.frameCount,
  BOIL_CONFIG.frameBoil,
  grain,
);
out.boilConfig = {
  frameCount: BOIL_CONFIG.frameCount,
  frameBoil: BOIL_CONFIG.frameBoil,
  intervalMs: BOIL_CONFIG.intervalMs,
  grainDeclared: !!grain,
};
out.fillGauge = trace.map((d, i) => {
  const p = points(d);
  return {
    pose: i,
    chars: d.length,
    points: p.length,
    segments: Math.max(0, p.length - 1),
    lengthUnits: +len(p).toFixed(3),
    closedZ: /z\s*$/i.test(d),
    commands: (d.match(/[A-Za-z]/g) || []).join(""),
  };
});
const L = (out.fillGauge as { lengthUnits: number }[]).map((r) => r.lengthUnits);
out.fillGaugeSpread = {
  min: Math.min(...L),
  max: Math.max(...L),
  spreadUnits: +(Math.max(...L) - Math.min(...L)).toFixed(3),
  spreadPct: +(((Math.max(...L) - Math.min(...L)) / Math.min(...L)) * 100).toFixed(4),
};

// 2 · the join ring (seed 91), same generator — the second dashed consumer in the same file
const join = generateFrameTraceFrames(VIEWBOX_SIZE, 91, BOIL_CONFIG.frameCount, BOIL_CONFIG.frameBoil, grain);
out.joinRing = join.map((d, i) => {
  const p = points(d);
  return { pose: i, points: p.length, segments: Math.max(0, p.length - 1), lengthUnits: +len(p).toFixed(3) };
});

// 3 · the ungrained ring — the same call with `grain` omitted, to price the grain bake's
//     contribution to the SEGMENT COUNT (the discriminator ACC-FIVE measured at ~128)
const ungrained = generateFrameTraceFrames(VIEWBOX_SIZE, 42, BOIL_CONFIG.frameCount, BOIL_CONFIG.frameBoil);
out.fillGaugeUngrained = ungrained.map((d, i) => {
  const p = points(d);
  return { pose: i, points: p.length, segments: Math.max(0, p.length - 1), lengthUnits: +len(p).toFixed(3) };
});

// 4 · the grid's own frame, for registration (the graphite the violet retraces)
const gridFrames = generateGridBoilFrames(
  9,
  3,
  VIEWBOX_SIZE,
  42,
  BOIL_CONFIG.frameCount,
  BOIL_CONFIG.frameBoil,
  BOIL_CONFIG.subgridBoil,
  BOIL_CONFIG.cellBoil,
);
out.gridFrameFirstPose = (() => {
  const g = gridFrames as unknown as Record<string, string[]>;
  const keys = Object.keys(g);
  const d = String((g.frame ?? g[keys[0]] ?? [""])[0] ?? "");
  const p = points(d);
  return { keys, chars: d.length, points: p.length, subpaths: (d.match(/M/gi) || []).length };
})();

// 5 · where the clockwise front is at each fraction — the corner-arrival arithmetic the
//     count tape's zero-occlusion claim rests on, recomputed on pose 0.
{
  const p = points(trace[0]);
  const total = len(p);
  // corner arrivals: walk the polyline and note the cumulative length at each 90° turn of the
  // rect (the ring starts at the top-left and runs clockwise).
  const marks: { atUnits: number; frac: number; corner: string }[] = [];
  const corners: [number, number][] = [
    [1000 - 12, 0], // top-right
    [1000 - 12, 1000], // bottom-right
    [12, 1000], // bottom-left
  ];
  let run = 0;
  const names = ["top-right", "bottom-right", "bottom-left"];
  let ci = 0;
  for (let i = 1; i < p.length && ci < corners.length; i++) {
    run += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
    const [cx, cy] = corners[ci];
    if (Math.hypot(p[i][0] - cx, p[i][1] - cy) < 40) {
      marks.push({ atUnits: +run.toFixed(2), frac: +(run / total).toFixed(5), corner: names[ci] });
      ci++;
    }
  }
  out.frontCorners = { totalUnits: +total.toFixed(2), marks };
}

process.stdout.write(JSON.stringify(out, null, 2) + "\n");
