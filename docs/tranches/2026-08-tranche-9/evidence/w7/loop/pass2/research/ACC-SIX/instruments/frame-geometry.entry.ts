// ACC-SIX pass-2 · the frame's geometry in viewBox units, read out of the SHIPPED generator.
// Read-only: nothing is patched. The FRAME_Y_PAD=12 arm is produced by calling the exported
// generateRectBoilFrames with the pads the pass-1 diff would have set, so no source moves.
import {
  generateFrameTraceFrames,
  generateGridBoilFrames,
  generateRectBoilFrames,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/pencil/grid/gridPaths";
import { BOIL_CONFIG, FILTER_PRESETS } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/pencil/config/pencilConfig";

const V = 1000;
const SEED = 42;
const grain = FILTER_PRESETS["grain-static"]?.grain;

const bbox = (d: string) => {
  const nums = (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  const xs: number[] = [], ys: number[] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) { xs.push(nums[i]); ys.push(nums[i + 1]); }
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
};

const f = (n: number) => n.toFixed(3);

function report(label: string, poses: string[]) {
  const rows = poses.map(bbox);
  console.log(`\n## ${label}  (${poses.length} poses)`);
  rows.forEach((b, i) =>
    console.log(`  pose ${i}: y0 ${f(b.y0)}  y1 ${f(b.y1)}  x0 ${f(b.x0)}  x1 ${f(b.x1)}`),
  );
  const agg = (k: "x0" | "x1" | "y0" | "y1") => rows.map((r) => r[k]);
  const span = (k: "x0" | "x1" | "y0" | "y1") =>
    `${f(Math.min(...agg(k)))} … ${f(Math.max(...agg(k)))}  (amp ${f(Math.max(...agg(k)) - Math.min(...agg(k)))})`;
  console.log(`  ENVELOPE over poses:`);
  console.log(`    y0 ${span("y0")}`);
  console.log(`    y1 ${span("y1")}`);
  console.log(`    x0 ${span("x0")}`);
  console.log(`    x1 ${span("x1")}`);
  // per-side inset from the viewBox edge, per pose
  const insets = rows.map((b) => ({ top: b.y0, bottom: V - b.y1, left: b.x0, right: V - b.x1 }));
  console.log(`  INSETS from the 1000-unit viewBox edge (pose 0): top ${f(insets[0].top)}  bottom ${f(insets[0].bottom)}  left ${f(insets[0].left)}  right ${f(insets[0].right)}`);
  const asym = insets.map((i) => Math.abs(i.top - i.left));
  console.log(`  |top inset − left inset| per pose: ${asym.map(f).join("  ")}  → max ${f(Math.max(...asym))} units = ${f(Math.max(...asym) * 0.636)} CSS px at the 636px desk board`);
  return rows;
}

console.log(`BOIL_CONFIG.frameCount=${BOIL_CONFIG.frameCount} frameBoil=${BOIL_CONFIG.frameBoil} grain=${JSON.stringify(grain)}`);

// 1. HEAD, exactly as HandDrawnGrid calls it.
const headTrace = generateFrameTraceFrames(V, SEED, BOIL_CONFIG.frameCount, BOIL_CONFIG.frameBoil, grain);
report("HEAD fill trace (FRAME_X_PAD 12 / FRAME_Y_PAD 0, grain baked)", headTrace);

// 2. HEAD join trace (seed 91) — the same rect, second hand.
const headJoin = generateFrameTraceFrames(V, 91, BOIL_CONFIG.frameCount, BOIL_CONFIG.frameBoil, grain);
report("HEAD join trace (seed 91)", headJoin);

// 3. HEAD graphite grid frame.
const grid = generateGridBoilFrames(9, 3, V, SEED, BOIL_CONFIG.frameCount, BOIL_CONFIG.frameBoil);
report("HEAD graphite grid frame", (grid as { frame: string[] }).frame);

// 4. The FRAME_Y_PAD = 12 arm, WITHOUT touching the source: same call shape, pads 12/12.
const symTrace = generateRectBoilFrames(
  12, 12, V - 24, V - 24,
  { roughness: 0.5, segments: 6, seed: SEED, jagged: true },
  BOIL_CONFIG.frameBoil, BOIL_CONFIG.frameCount, 0, grain,
);
report("PROPOSED FRAME_Y_PAD 12 fill trace (pads 12/12)", symTrace);

// 5. perimeter arithmetic
const peri = (xp: number, yp: number) => 2 * (V - 2 * xp) + 2 * (V - 2 * yp);
console.log(`\n## perimeter (nominal rect, viewBox units)`);
console.log(`  HEAD  (12,0):  ${peri(12, 0)}`);
console.log(`  PROPOSED (12,12): ${peri(12, 12)}   Δ ${peri(12, 12) - peri(12, 0)} units = ${((peri(12,12)-peri(12,0))/peri(12,0)*100).toFixed(2)}%`);
console.log(`  12 units on a 636 CSS px board = ${(12 * 0.636).toFixed(3)} CSS px; on a 365 px phone board = ${(12 * 0.365).toFixed(3)} CSS px`);
