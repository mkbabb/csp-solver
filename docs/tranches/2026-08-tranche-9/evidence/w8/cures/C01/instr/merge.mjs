// RUN: node merge.mjs <w1.jsonl> <w2.jsonl> … > arm.jsonl
// T9-W8 §8.2 cure C01 — stitches one-window `bake-census.mjs` runs into one arm file that
// A1's `summarize.mjs` and `double-bake-proof.mjs` read unchanged: the first run's meta line,
// then every window renumbered in the order given, then a final `end` carrying the first and
// last loadavg the set saw.
import { readFileSync } from "node:fs";
const files = process.argv.slice(2);
let meta = null, lastEnd = null, n = 0;
const out = [];
for (const f of files) {
  const L = readFileSync(f, "utf8").trim().split("\n").map((l) => JSON.parse(l));
  const m = L.find((x) => x.k === "meta");
  if (!meta) meta = m;
  for (const w of L.filter((x) => x.k === "window")) out.push({ ...w, window: ++n, src: f.split("/").pop() });
  const e = L.find((x) => x.k === "end");
  if (e) lastEnd = e;
}
console.log(JSON.stringify(meta));
for (const w of out) console.log(JSON.stringify(w));
console.log(JSON.stringify({ k: "end", windows: n, loadavgEnd: lastEnd?.loadavgEnd ?? null }));
