import { pointsToLinear } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend/node_modules/@mkbabb/pencil-boil/dist/path.js";

// verbatim from gridPaths.ts (prototype diff)
function posePoints(d) {
  const nums = d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi);
  if (!nums || nums.length < 4) return [];
  const pts = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push([Number(nums[i]), Number(nums[i + 1])]);
  if (/z\s*$/i.test(d) && pts.length) pts.push(pts[0]);
  return pts;
}
function poseLengths(frames) {
  return frames.map((d) => {
    const pts = posePoints(d);
    let total = 0;
    for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]);
    return total;
  });
}
function poseFronts(frames, fraction) {
  const f = Math.max(0, Math.min(1, fraction));
  if (f >= 1) return frames;
  if (f <= 0) return frames.map(() => "");
  const lengths = poseLengths(frames);
  return frames.map((d, i) => {
    const pts = posePoints(d);
    const target = lengths[i] * f;
    if (!pts.length || target <= 0) return "";
    const out = [pts[0]];
    let run = 0;
    for (let k = 1; k < pts.length; k++) {
      const seg = Math.hypot(pts[k][0]-pts[k-1][0], pts[k][1]-pts[k-1][1]);
      if (run + seg >= target) {
        const t = seg === 0 ? 0 : (target - run) / seg;
        out.push([pts[k-1][0] + (pts[k][0]-pts[k-1][0])*t, pts[k-1][1] + (pts[k][1]-pts[k-1][1])*t]);
        break;
      }
      run += seg;
      out.push(pts[k]);
    }
    return pointsToLinear(out);
  });
}

// a faithful 493-point closed ring in the 1000-unit viewBox the trace lives in
function ring(seed, n) {
  const pts = [];
  const per = Math.floor(n / 4);
  let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff - 0.5) * 1.6;
  for (let i = 0; i < per; i++) pts.push([12 + (976 * i) / per + rnd(), 0 + rnd()]);
  for (let i = 0; i < per; i++) pts.push([988 + rnd(), (1000 * i) / per + rnd()]);
  for (let i = 0; i < per; i++) pts.push([988 - (976 * i) / per + rnd(), 1000 + rnd()]);
  for (let i = 0; i < n - 3 * per; i++) pts.push([12 + rnd(), 1000 - (1000 * i) / (n - 3 * per) + rnd()]);
  return pointsToLinear(pts) + " Z";
}
const FRAMES = [0, 1, 2, 3].map((f) => ring(42 + f * 997, 493));
console.log("pose string length (chars):", FRAMES[0].length, " segments:", posePoints(FRAMES[0]).length - 1);

function bench(label, fn, iters) {
  fn(); // warm
  for (let w = 0; w < 200; w++) fn();
  const t0 = performance.now();
  for (let i = 0; i < iters; i++) fn();
  const dt = performance.now() - t0;
  console.log(`${label}: ${(dt / iters).toFixed(3)} ms/call  (${iters} iters, ${dt.toFixed(1)} ms total)`);
  return dt / iters;
}
let k = 0;
const a = bench("poseFronts(4 poses x 493 pts, f sweeping)", () => { poseFronts(FRAMES, 0.05 + ((k++ % 90) / 100)); }, 2000);
const b = bench("poseLengths only (the redundant half)", () => { poseLengths(FRAMES); }, 2000);
const c = bench("posePoints x4 only", () => { FRAMES.forEach(posePoints); }, 2000);
console.log(`\nPER-FRAME COST at 60Hz: ${a.toFixed(3)} ms of a 16.7 ms budget = ${((a/16.7)*100).toFixed(1)}% of one frame`);
console.log(`Redundant re-parse (poseLengths recomputed every call): ${b.toFixed(3)} ms/call = ${((b/a)*100).toFixed(0)}% of the call`);
console.log(`~15 frames per 240ms write -> ${(a*15).toFixed(1)} ms of main-thread JS per fill event`);
