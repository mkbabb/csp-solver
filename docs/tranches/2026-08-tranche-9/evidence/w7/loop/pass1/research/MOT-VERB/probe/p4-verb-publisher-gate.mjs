#!/usr/bin/env node
/**
 * P4 — THE PUBLISHER GATE.  i3 check A, widened from ONE curve to THE WHOLE SET.
 *
 * i3 asserts `MOTION.curves.drawerGlide` is byte-identical to `--ease-glassGlide`. Under the
 * verb grammar there are seven curves and six rungs living in both layers, so the same
 * assertion has to run over the whole set or the two-layer rule is enforced on 1/13 of itself.
 *
 * This is the GATE half of the publisher. The publisher half is a generator that WRITES the
 * @theme rows from MOTION; the gate proves the tree's CSS equals what the generator would
 * emit, which makes byte-identity a build fact rather than a prose claim.
 *
 * FE=<worktree>/web/frontend node p4-verb-publisher-gate.mjs [--emit]
 *   --emit prints the @theme block the publisher would write.
 */
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import process from "node:process";

const FE = resolve(process.env.FE ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend");
const ts = readFileSync(join(FE, "src/pencil/config/pencilConfig.ts"), "utf8");
const css = readFileSync(join(FE, "src/assets/index.css"), "utf8");

const block = (name) => {
  const i = ts.indexOf(`  ${name}: {`);
  if (i < 0) return null;
  let d = 0, j = i + name.length + 4;
  for (; j < ts.length; j++) {
    if (ts[j] === "{") d++;
    else if (ts[j] === "}") { d--; if (!d) break; }
  }
  return ts.slice(i, j + 1);
};
const rungsBlk = block("rungs");
const verbsBlk = block("verbs");
if (!rungsBlk || !verbsBlk) {
  console.log("MOTION.rungs / MOTION.verbs absent — the set is not declared (RED at HEAD, by construction)");
  process.exit(1);
}
const rungs = [...rungsBlk.matchAll(/([a-z]+):\s*(\d+),/g)].map((m) => [m[1], +m[2]]);
const verbs = [...verbsBlk.matchAll(/^\s{4}([a-zA-Z]+):\s*\{\s*ease:\s*"([^"]+)"/gm)].map((m) => [m[1], m[2]]);

const want = [
  ...rungs.map(([n, v]) => [`--rung-${n}`, `${v}ms`]),
  ...verbs.map(([n, e]) => [`--verb-${n}-ease`, e]),
];
if (process.argv.includes("--emit")) {
  for (const [k, v] of want) console.log(`  ${k}: ${v};`);
  process.exit(0);
}
let bad = 0;
for (const [k, v] of want) {
  const m = new RegExp(`^\\s*${k.replace(/[-]/g, "\\-")}:\\s*([^;]+);`, "m").exec(css);
  const got = m?.[1]?.trim() ?? null;
  const ok = got === v;
  if (!ok) bad++;
  console.log(`  ${ok ? "OK  " : "RED "} ${k.padEnd(24)} TS ${String(v).padEnd(34)} CSS ${got ?? "(absent)"}`);
}
console.log(`\n${want.length} published rows, ${bad} divergent`);
console.log(bad ? "RED" : "GREEN");
process.exit(bad ? 1 : 0);
