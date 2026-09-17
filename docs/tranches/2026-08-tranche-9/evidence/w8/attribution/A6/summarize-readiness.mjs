#!/usr/bin/env node
// RUN: node summarize-readiness.mjs readiness.jsonl   (medians per cell; tainted windows excluded)
import { readFileSync } from "node:fs";
const rows = readFileSync(process.argv[2], "utf8").trim().split("\n").map((l) => JSON.parse(l));
const med = (a) => { const v = a.filter((x) => typeof x === "number").sort((x, y) => x - y);
  return v.length ? Math.round(v[(v.length - 1) >> 1]) : null; };
const by = new Map();
for (const r of rows) { if (r.error) { console.error("ERR", r.cell, r.error); continue; }
  if (!by.has(r.cell)) by.set(r.cell, []); by.get(r.cell).push(r); }
const F = ["firstPaintMs","fcpMs","lcpMs","boardReadyMs","firstBakeMs","firstBoilTickMs",
  "controlsInteractiveMs","tbt3000Ms","busyToBoardReadyMs","rafGapProxyTbtMs","longtasks3000",
  "longestTaskMs","worstRafGapMs","loadEventMs","transferBytes"];
console.log("| cell | n | " + F.map((f) => f.replace(/Ms$/, "")).join(" | ") + " | tainted | notes |");
console.log("| --- |".repeat(F.length + 4).slice(0, -1));
for (const [cell, all] of by) {
  const clean = all.filter((r) => !r.tainted);
  const n = clean.length, t = all.length - n;
  const cells = F.map((f) => { const v = med(clean.map((r) => r[f]));
    return v === null ? "NOT MEASURED" : String(v); });
  const how = [...new Set(clean.map((r) => r.controlsHow))].join(" / ");
  console.log(`| ${cell} | ${n} | ${cells.join(" | ")} | ${t} | ${how} |`);
}
