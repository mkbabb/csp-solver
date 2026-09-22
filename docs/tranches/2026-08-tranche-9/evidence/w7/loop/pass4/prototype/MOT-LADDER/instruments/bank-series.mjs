/**
 * Fold the two engines' audition readings into `scripts/motion-dock-series.json`, the file
 * G-DOCK-BAND reads. Never hand-typed: the gate's evidence is the probe's own output.
 */
import { readFileSync, writeFileSync } from "node:fs";

const R =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/MOT-LADDER/readings";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend/scripts/motion-dock-series.json";

const poses = [];
let ceiling = 2400;
for (const engine of ["chromium", "webkit"]) {
  const j = JSON.parse(readFileSync(`${R}/dock-audition-${engine}.json`, "utf8"));
  ceiling = j.ceilingPxPerSec;
  const byPose = new Map();
  for (const r of j.rows) {
    if (r.skipped) continue;
    if (!byPose.has(r.pose)) byPose.set(r.pose, []);
    byPose.get(r.pose).push(r);
  }
  for (const [name, rows] of byPose) {
    const clocks = {};
    for (const r of rows)
      clocks[String(r.clock)] = {
        worstRatePxPerSec: r.worstRatePxPerSec,
        worstStepPx: r.worstStepPx,
        excessAreaPx: r.excessAreaPx,
        samples: r.samples,
        travelPx: r.travelPx,
        settleRunning: r.settle ? r.settle.running : null,
      };
    poses.push({
      engine,
      name,
      // the pose's FULL excursion: the largest travel any round sampled. The per-round
      // spread is the sampler's start latency against the tap, not a layout difference,
      // and it is reported as a gap rather than averaged away.
      travelPx: Math.max(...rows.map((r) => r.travelPx)),
      travelSpreadPx: +(
        Math.max(...rows.map((r) => r.travelPx)) - Math.min(...rows.map((r) => r.travelPx))
      ).toFixed(2),
      clocks,
    });
  }
}

const doc = {
  at: new Date().toISOString(),
  base: "74a2b5d9",
  build: "index-BvdTwOp8Owkm.js",
  shippedMs: 520,
  ceilingPxPerSec: ceiling,
  ceilingWhy:
    "the 40px-per-60Hz-frame threshold this wave's dock instrument has scored excess area against since pass 2, re-expressed as a rate. A PARAMETER the owner disposes (U-10), not a finding.",
  instrument:
    "pass4/prototype/MOT-LADDER/instruments/dock-audition.spec.ts — one build, the clock substituted at Element.prototype.animate for useFlipGlide's exact signature; rates taken on a resampled 60Hz grid.",
  poses,
};
writeFileSync(OUT, JSON.stringify(doc, null, 1) + "\n");

const clocks = [...new Set(poses.flatMap((p) => Object.keys(p.clocks).map(Number)))].sort(
  (a, b) => a - b,
);
const clears = (ms) =>
  poses.every((p) => p.clocks[String(ms)]?.worstRatePxPerSec <= ceiling);
const won = clocks.find(clears);
console.log(`poses ${poses.length} · clocks ${clocks.join("/")} · ceiling ${ceiling}px/s`);
for (const c of clocks)
  console.log(
    `  @${c}: worst rate over all poses ${Math.max(...poses.map((p) => p.clocks[String(c)]?.worstRatePxPerSec ?? 0)).toFixed(0)}px/s · clears ${clears(c)}`,
  );
console.log(`PICK = ${won ?? clocks[clocks.length - 1]}  (cleared: ${won !== undefined})`);
console.log("\nTHE BALLOT TABLE — ceiling → pick (the criterion's interior optimum):");
const worstAt = (ms) =>
  Math.max(...poses.map((p) => p.clocks[String(ms)]?.worstRatePxPerSec ?? Infinity));
for (const ceil of [7000, 6500, 6000, 5500, 5000, 4800, 4500, 4100, 4000, 2400]) {
  const w = clocks.find((c) => worstAt(c) <= ceil);
  console.log(`  ceiling ${ceil}px/s → pick ${w ?? "NONE CLEARS"}`);
}
console.log("\nworst rate over all poses, per clock:");
for (const c of clocks) console.log(`  @${c}ms  ${worstAt(c).toFixed(0)}px/s`);
console.log(
  "travel ends: " +
    poses
      .map((p) => `${p.engine} ${p.name} ${p.travelPx.toFixed(1)}px (spread ${p.travelSpreadPx})`)
      .join(" · "),
);
