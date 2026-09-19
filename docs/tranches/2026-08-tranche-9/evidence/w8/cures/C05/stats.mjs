#!/usr/bin/env node
// T9-W8 C05 — medians and spreads over an interleaved set. RUN: node stats.mjs <dir> [cycleFilter]
// Reads every base-w*.jsonl / cured-w*.jsonl `fold-frames` output in <dir> and reports, per
// direction, the median and full range of the choreographed window's marks. Tainted windows are
// named and excluded. `cycleFilter` keeps only that cycle index (0 = the page's FIRST fold).
import { readdirSync, readFileSync } from "node:fs";

const dir = process.argv[2];
const cycleFilter = process.argv[3] === undefined ? null : Number(process.argv[3]);
const med = (v) => {
  const s = [...v].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : null;
};
const rng = (v) => `${Math.min(...v)}–${Math.max(...v)}`;

const arms = { base: [], cured: [] };
const tainted = [];
for (const f of readdirSync(dir).sort()) {
  const m = /^(base|cured)-w(\d+)\.jsonl$/.exec(f);
  if (!m) continue;
  const rows = readFileSync(`${dir}/${f}`, "utf8").trim().split("\n").map(JSON.parse);
  for (const r of rows.slice(1)) {
    if (cycleFilter !== null && r.cycle !== cycleFilter) continue;
    if (r.tainted) {
      tainted.push(`${f} c${r.cycle} ${r.dir}`);
      continue;
    }
    arms[m[1]].push(r);
  }
}
if (tainted.length) console.log(`TAINTED (excluded): ${tainted.join(", ")}`);

const MARKS = [
  ["worstMs", (r) => r.choreo.worstMs],
  ["long33", (r) => r.choreo.long33],
  ["long50", (r) => r.choreo.long50],
  ["p95", (r) => r.choreo.p95],
  ["jankMs", (r) => r.choreo.jankMs],
  ["fps", (r) => r.choreo.fps],
  ["bakes", (r) => r.bakes],
  // A bake pose the size of the board is a task over 150 ms in this regime; counted INSIDE the
  // choreographed window, which is the window the fold's frames are graded over.
  [
    "lt>150 in win",
    (r) =>
      Array.isArray(r.longtasks)
        ? r.longtasks.filter((l) => l.dur > 150 && l.at <= (r.dir === "entry" ? 1100 : 760)).length
        : 0,
  ],
];
for (const dirName of ["entry", "exit"]) {
  console.log(`\n── ${dirName} ${cycleFilter === null ? "(all cycles)" : `(cycle ${cycleFilter})`}`);
  for (const [name, get] of MARKS) {
    const b = arms.base.filter((r) => r.dir === dirName).map(get);
    const c = arms.cured.filter((r) => r.dir === dirName).map(get);
    if (!b.length || !c.length) continue;
    const disjoint = Math.max(...c) < Math.min(...b) || Math.min(...c) > Math.max(...b);
    console.log(
      `${name.padEnd(13)} base ${String(med(b)).padStart(8)} (${rng(b)}) n=${b.length}   ` +
        `cured ${String(med(c)).padStart(8)} (${rng(c)}) n=${c.length}   ` +
        `${disjoint ? "DISJOINT" : "inside spread"}`,
    );
  }
}
