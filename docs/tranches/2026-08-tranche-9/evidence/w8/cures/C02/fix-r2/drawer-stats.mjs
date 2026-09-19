#!/usr/bin/env node
// RUN: node drawer-stats.mjs <raw/drawer dir>
// T9-W8 C02 repair round 2 — the drawer's gesture, read off A4 `drawer-trace.mjs` raws.
// FIRST open is cycle 0 (the one the verifier's §7.5 tell lives on: long33 1 -> 2 in 3 of 3);
// steady is cycles 1..n. Medians and spreads per arm, plus the long-frame counts each cycle
// carried, so "inside the spread" and "the count went up" are separable facts.
import { readFileSync, readdirSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { join } from "node:path";

const med = (a) => {
  const s = [...a].sort((x, y) => x - y);
  return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : null;
};
const f1 = (x) => (x == null ? "—" : (+x).toFixed(1));
const dir = process.argv[2];

function arm(prefix) {
  const rows = [];
  for (const f of readdirSync(dir).filter((f) => f.startsWith(prefix)).sort()) {
    const buf = readFileSync(join(dir, f));
    const text = f.endsWith(".gz") ? gunzipSync(buf).toString("utf8") : buf.toString("utf8");
    for (const line of text.trim().split("\n")) rows.push(JSON.parse(line));
  }
  return rows;
}

console.log(`A4 drawer-trace VERBATIM (only --port differs) · ${process.argv[3] ?? ""}`);
console.log("| arm | gesture | dir | worst ms (median) | spread | long33 (each) | long50 (each) | tainted |");
console.log("|---|---|---|---|---|---|---|---|");
for (const [tag, prefix] of [["base", "base-"], ["cured", "cured-"]]) {
  const rows = arm(prefix);
  for (const [label, pick] of [["FIRST", (r) => r.cycle === 0], ["steady", (r) => r.cycle > 0]]) {
    for (const g of ["open", "close"]) {
      const sel = rows.filter(pick);
      const worst = sel.map((r) => r[g].worst);
      console.log(
        `| ${tag} | ${label} | ${g} | ${f1(med(worst))} | [${f1(Math.min(...worst))}–${f1(Math.max(...worst))}] | ` +
          `${sel.map((r) => r[g].long33).join(",")} | ${sel.map((r) => r[g].long50).join(",")} | ` +
          `${sel.filter((r) => r.tainted).length}/${sel.length} |`,
      );
    }
  }
}
