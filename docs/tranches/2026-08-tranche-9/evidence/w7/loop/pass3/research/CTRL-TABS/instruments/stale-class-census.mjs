/**
 * The §6 map: which e2e TEST BODIES address the classes/ids this family deletes.
 * Static, so it costs no server; run from `web/frontend`.
 *
 *   node <this> > ../readings/stale-classes.txt
 */
import { readdirSync, readFileSync } from "node:fs";

const CLS = [
  "peek-hold-surface",
  "fold-tools",
  "play-controls",
  "washi-tag",
  "tray-well",
  "mobile-heading",
  "section-heading",
];

const out = {};
for (const f of readdirSync("e2e").filter((n) => n.endsWith(".spec.ts"))) {
  const lines = readFileSync("e2e/" + f, "utf8").split("\n");
  let cur = null;
  let curLine = 0;
  lines.forEach((line, i) => {
    const m = /^\s*(test|test\.describe)\s*\(\s*[`'"]([^`'"]{0,90})/.exec(line);
    if (m) {
      cur = m[2];
      curLine = i + 1;
    }
    for (const c of CLS) {
      // a comment mentioning a class is not an assertion against it
      if (line.includes(c) && !/^\s*(\*|\/\/)/.test(line)) {
        const k = `${f}  ::  ${cur ?? "(file scope)"} @${curLine}`;
        (out[k] ??= new Set()).add(c);
      }
    }
  });
}
for (const [k, v] of Object.entries(out)) console.log(k, "  ->", [...v].join(", "));
console.log(`\n${Object.keys(out).length} test bodies`);
