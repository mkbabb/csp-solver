// RUN: node gapstats.mjs <base.jsonl> <cured.jsonl>
// T9-W8 §8.2 cure C03 — per-pose medians and SPREADS out of A6's gapsplit rows, so a delta is
// read against the arms' own spread rather than against a median alone. Tainted windows and
// windows the probe failed are named and excluded.
import { readFileSync } from "node:fs";
const med = (a) => { const s = [...a].sort((x, y) => x - y); const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const f = (x) => (x == null || Number.isNaN(x) ? "—" : (+x).toFixed(1));
const KEYS = ["boardReadyMs", "drawnMs", "firstBakeMs", "leg1DrawInMs", "leg2BakeMs",
  "leg1LongtaskMs", "leg2LongtaskMs", "tbt3000Ms", "longtaskCount"];
function load(file) {
  const rows = readFileSync(file, "utf8").trim().split("\n").map((l) => JSON.parse(l));
  const bad = rows.filter((r) => r.error || r.tainted || r.firstBakeMs == null);
  for (const b of bad) console.log(`  EXCLUDED ${b.step} w${b.window}: ${b.error ? "error " + b.error : b.tainted ? "tainted" : "no bake"}`);
  return rows.filter((r) => !r.error && !r.tainted && r.firstBakeMs != null);
}
const [bf, cf] = process.argv.slice(2);
console.log("exclusions:"); const B = load(bf), C = load(cf);
for (const pose of ["mob", "desk"]) {
  const b = B.filter((r) => r.step === pose), c = C.filter((r) => r.step === pose);
  if (!b.length || !c.length) continue;
  console.log(`\n## pose ${pose}  (base n=${b.length}, cured n=${c.length})`);
  console.log(`base  busy leg1/leg2: ${b.map((r) => `${r.leg1Busy?.busyMs}/${r.leg2Busy?.busyMs}`).join("  ")}`);
  console.log(`cured busy leg1/leg2: ${c.map((r) => `${r.leg1Busy?.busyMs}/${r.leg2Busy?.busyMs}`).join("  ")}`);
  console.log("| quantity | base median | base spread | cured median | cured spread | Δ | outside both spreads |");
  console.log("|---|---|---|---|---|---|---|");
  for (const k of KEYS) {
    const bv = b.map((r) => r[k]).filter((x) => x != null), cv = c.map((r) => r[k]).filter((x) => x != null);
    if (!bv.length || !cv.length) continue;
    const mb = med(bv), mc = med(cv);
    const bs = [Math.min(...bv), Math.max(...bv)], cs = [Math.min(...cv), Math.max(...cv)];
    console.log(`| ${k} | ${f(mb)} | ${f(bs[0])}–${f(bs[1])} | ${f(mc)} | ${f(cs[0])}–${f(cs[1])} | ${f(mc - mb)} | ${bs[0] > cs[1] || cs[0] > bs[1] ? "YES" : "no — inside the spread"} |`);
  }
}
