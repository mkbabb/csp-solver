#!/usr/bin/env node
// T9-W8 C05 REPAIR ROUND 1 — the per-window print the headline is restated on.
// stats.mjs gives medians, ranges and disjointness; this prints EVERY window's value for the
// marks the verifier asked to be restated, so a reader can count windows rather than trust a
// median: "tasks over 150 ms inside the choreographed window" is a per-window 1/0, and the
// claim is how many windows of each arm carry one.
// RUN: node summarize.mjs <dir> <cycle>
import { readdirSync, readFileSync } from "node:fs";

const dir = process.argv[2];
const cycle = Number(process.argv[3] ?? 0);
const WIN = { entry: 1100, exit: 760 };
const med = (v) => {
  const s = [...v].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : null;
};

const rows = { base: [], cured: [] };
for (const f of readdirSync(dir).sort()) {
  const m = /^(base|cured)-w(\d+)\.jsonl$/.exec(f);
  if (!m) continue;
  const lines = readFileSync(`${dir}/${f}`, "utf8").trim().split("\n").map(JSON.parse);
  for (const r of lines.slice(1)) {
    if (r.cycle !== cycle || r.tainted) continue;
    rows[m[1]].push({ w: Number(m[2]), ...r });
  }
}

for (const dirName of ["entry", "exit"]) {
  console.log(`\n== ${dirName}, cycle ${cycle}`);
  for (const arm of ["base", "cured"]) {
    const set = rows[arm].filter((r) => r.dir === dirName).sort((a, b) => a.w - b.w);
    const big = set.map(
      (r) => (r.longtasks ?? []).filter((l) => l.dur > 150 && l.at <= WIN[dirName]).length,
    );
    console.log(
      `${arm.padEnd(5)} n=${set.length}  worst=[${set.map((r) => r.choreo.worstMs).join(", ")}]  ` +
        `med ${med(set.map((r) => r.choreo.worstMs))}`,
    );
    console.log(
      `      lt>150 in win per window=[${big.join(", ")}]  windows carrying one: ` +
        `${big.filter((n) => n > 0).length}/${big.length}`,
    );
    console.log(
      `      p95=[${set.map((r) => r.choreo.p95).join(", ")}]  fps=[${set.map((r) => r.choreo.fps).join(", ")}]  ` +
        `long33=[${set.map((r) => r.choreo.long33).join(", ")}]  bakes=[${set.map((r) => r.bakes).join(", ")}]`,
    );
  }
}
