#!/usr/bin/env node
// T9-W8 C05 REPAIR ROUND 2 — the capture-identity census, counted per WINDOW rather than read
// by eye, so findings (4) and (5) can be quoted as rates. RUN: node encodes.mjs <dir> …
// Reads base-*.jsonl / cured-*.jsonl written by attrib/fold-identity.mjs and reports, per arm
// and per fold window, how many LOGO encodes landed and when — split at GESTURE_QUIET_MS
// (1,160 ms), which is the line the cure draws: at/behind the box change is the LIVE re-key,
// past 1,160 ms is the relocated warm.
import { readdirSync, readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";

const QUIET = 1160;
const read = (p) =>
  (p.endsWith(".gz") ? gunzipSync(readFileSync(p)).toString("utf8") : readFileSync(p, "utf8"))
    .trim()
    .split("\n")
    .map(JSON.parse);

const tally = { base: new Map(), cured: new Map() };
for (const dir of process.argv.slice(2)) {
  for (const f of readdirSync(dir).sort()) {
    const m = /^(base|cured)-(\d+)\.jsonl(\.gz)?$/.exec(f);
    if (!m) continue;
    const arm = m[1];
    for (const r of read(`${dir}/${f}`)) {
      if (r.phase !== "fold") continue;
      const logo = r.bakes.filter((b) => b.surface === "logo");
      const box = r.boxes.filter((b) => b.ev === "rect");
      const key = `c${r.cycle} ${r.dir}`;
      if (!tally[arm].has(key)) tally[arm].set(key, []);
      tally[arm].get(key).push({
        run: `${dir.split("/").slice(-2).join("/")}/${f}`,
        n: logo.length,
        at: logo.map((b) => b.at),
        late: logo.filter((b) => b.at > QUIET).length,
        early: logo.filter((b) => b.at <= QUIET).length,
        box: box.map((b) => b.at),
        tainted: !!r.tainted,
      });
    }
  }
}

for (const arm of ["base", "cured"]) {
  console.log(`\n══ ${arm}`);
  for (const [key, runs] of [...tally[arm]].sort()) {
    const withAny = runs.filter((r) => r.n > 0).length;
    const withLate = runs.filter((r) => r.late > 0).length;
    console.log(
      `  ${key.padEnd(9)} runs=${runs.length}  any-logo-encode ${withAny}/${runs.length}  ` +
        `past ${QUIET}ms ${withLate}/${runs.length}`,
    );
    for (const r of runs)
      console.log(
        `     ${r.run}  n=${r.n} early=${r.early} late=${r.late} at=[${r.at.join(",")}] box=[${r.box.join(",")}]${r.tainted ? " TAINTED" : ""}`,
      );
  }
}
