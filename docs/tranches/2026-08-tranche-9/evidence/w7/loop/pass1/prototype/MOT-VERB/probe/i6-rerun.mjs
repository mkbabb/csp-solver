#!/usr/bin/env node
/**
 * I6 RE-RUN (T9-W7 §13 prototype, MOT-VERB) — r7's own static instrument, verbatim in its
 * rule and its regex, with the source root taken from SRC so the same reading can be taken
 * of HEAD and of the prototype. r7 hardcodes the main tree; nothing else changes.
 *
 *   SRC=<...>/web/frontend/src node i6-rerun.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const SRC = process.env.SRC;
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(vue|css|ts)$/.test(f)) files.push(p);
  }
})(SRC);

const literals = new Map();
let decls = 0;
for (const f of files) {
  const t = readFileSync(f, "utf8");
  for (const m of t.matchAll(/(?:transition|animation)[a-z-]*:\s*([^;]+);/g)) {
    const body = m[1];
    const found = body.match(/\b\d+(?:\.\d+)?m?s\b/g);
    if (!found) continue;
    decls++;
    for (const d of found) literals.set(d, (literals.get(d) || 0) + 1);
  }
}
const top = [...literals.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([k, v]) => `${k}x${v}`)
  .join(", ");
console.log(
  `I6 ${literals.size === 0 ? "GREEN" : "RED"}: ${decls} declarations spell ${literals.size} distinct literal durations (${top || "none"})`,
);
