#!/usr/bin/env node
// T9-W8 C05 REPAIR ROUND 2 — pool the interleaved sets whose RAW windows are banked, so a mark
// can be read per battery AND over all of them. RUN: node pool.mjs <cycle> <dir>[:label] …
// Reads base-w*.jsonl / cured-w*.jsonl (plain or .gz) written by fold-frames.mjs. Tainted
// windows are named and excluded. Verifier finding (3) is read off the `exit` block: a mark is
// only "disjoint" when the arms' full ranges do not overlap — in every battery AND pooled.
import { readdirSync, readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";

const cycleFilter = Number(process.argv[2]);
const specs = process.argv.slice(3).map((s) => {
  const i = s.lastIndexOf(":");
  return i > 2 ? { dir: s.slice(0, i), label: s.slice(i + 1) } : { dir: s, label: s };
});

const med = (v) => {
  const s = [...v].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : null;
};
const rng = (v) => `${Math.min(...v)}–${Math.max(...v)}`;
const MARKS = [
  ["worstMs", (r) => r.choreo.worstMs],
  ["p95", (r) => r.choreo.p95],
  ["fps", (r) => r.choreo.fps],
  ["long33", (r) => r.choreo.long33],
  ["jankMs", (r) => r.choreo.jankMs],
  [
    "lt>150 in win",
    (r) =>
      Array.isArray(r.longtasks)
        ? r.longtasks.filter((l) => l.dur > 150 && l.at <= (r.dir === "entry" ? 1100 : 760)).length
        : 0,
  ],
];

const read = (p) =>
  (p.endsWith(".gz") ? gunzipSync(readFileSync(p)).toString("utf8") : readFileSync(p, "utf8"))
    .trim()
    .split("\n")
    .map(JSON.parse);

const all = { base: [], cured: [] };
const per = new Map();
const tainted = [];
for (const { dir, label } of specs) {
  const bucket = { base: [], cured: [] };
  per.set(label, bucket);
  for (const f of readdirSync(dir).sort()) {
    const m = /^(base|cured)-w(\d+)\.jsonl(\.gz)?$/.exec(f);
    if (!m) continue;
    for (const r of read(`${dir}/${f}`).slice(1)) {
      if (r.cycle !== cycleFilter) continue;
      if (r.tainted) {
        tainted.push(`${label}/${f} c${r.cycle} ${r.dir}`);
        continue;
      }
      bucket[m[1]].push(r);
      all[m[1]].push(r);
    }
  }
}
if (tainted.length) console.log(`TAINTED (excluded): ${tainted.join(", ")}`);

const line = (name, b, c) => {
  const disjoint = Math.max(...c) < Math.min(...b) || Math.min(...c) > Math.max(...b);
  return (
    `${name.padEnd(14)} base ${String(med(b)).padStart(7)} (${rng(b)}) n=${b.length}  ` +
    `cured ${String(med(c)).padStart(7)} (${rng(c)}) n=${c.length}  ` +
    `${disjoint ? "DISJOINT" : "inside spread"}`
  );
};

for (const dirName of ["entry", "exit"]) {
  console.log(`\n══ ${dirName}, cycle ${cycleFilter}`);
  for (const [name, get] of MARKS) {
    const b = all.base.filter((r) => r.dir === dirName).map(get);
    const c = all.cured.filter((r) => r.dir === dirName).map(get);
    if (!b.length || !c.length) continue;
    console.log(`  POOLED  ${line(name, b, c)}`);
    for (const [label, bucket] of per) {
      const bb = bucket.base.filter((r) => r.dir === dirName).map(get);
      const cc = bucket.cured.filter((r) => r.dir === dirName).map(get);
      if (!bb.length || !cc.length) continue;
      console.log(`    ${label.padEnd(8)}${line(name, bb, cc)}`);
    }
  }
}
