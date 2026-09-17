#!/usr/bin/env node
// RUN: node <thisdir>/make-tables.mjs   — folds every raw-*.jsonl in this dir into the markdown tables.
import { readFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const ALL = readFileSync(`${DIR}/raw-all.jsonl`, "utf8").trim().split("\n").map((x) => JSON.parse(x));
const files = [...new Set(ALL.map((r) => r.cell))];
const n = (v) => (v === null || v === undefined ? "NOT MEASURED" : v);

const rows = [];
const boot = [];
for (const f of files) {
  const L = ALL.filter((r) => r.cell === f);
  const s = L.find((x) => x.SUMMARY);
  const w = L.filter((x) => !x.SUMMARY);
  if (!s) continue;
  const cell = f;
  boot.push([cell, s.windows, s.medBoardReadyMs, s.medBootBakeCount, s.medIdleCtrlFps, s.medIdleCtrlLong33, w[0].boardReadySel, w[0].dpr, w.map((r) => r.boardReadyMs).join(" / ")]);
  for (const t of s.toggles) {
    rows.push([cell, t.n, t.toTheme, n(t.medClickToSettleMs), n(t.medBakeCount), n(t.medBakeMs), s.longtaskSupported ? n(t.medLongTaskMs) : "NOT MEASURED", n(t.medWhirlLong33), n(t.medWhirlWorstMs), n(t.medWhirlFrames), n(t.medWhirlFps), s.longtaskSupported ? n(t.medRecalcStyleMs) : "NOT MEASURED", t.anyTainted ? "TAINTED" : ""]);
  }
}

const table = (head, body) => [`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`, ...body.map((r) => `| ${r.join(" | ")} |`)].join("\n");

console.log("### Boot (per cell, median of the cell's windows)\n");
console.log(table(["cell", "windows", "board-ready ms (med)", "boot bakes", "idle rAF control fps", "control long33", "board-ready element", "dpr", "board-ready per window"], boot));
console.log("\n### The toggle table (invocation N, median over the cell's windows)\n");
console.log(table(["cell", "N", "to theme", "click→settle ms", "bakes", "Σ bake wall ms", "Σ longtask ms", "whirl long33", "whirl worst ms", "whirl rAF frames", "whirl rAF fps", "Δ recalc-style ms", "taint"], rows));
