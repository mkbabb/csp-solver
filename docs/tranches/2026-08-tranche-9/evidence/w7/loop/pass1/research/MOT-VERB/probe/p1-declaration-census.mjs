#!/usr/bin/env node
/**
 * P1 — THE DECLARATION CENSUS, ROW BY ROW.  (MOT-VERB pass 1, research)
 *
 * R7's I6 counts 77 declarations spelling 35 distinct literal durations; R4's census tables
 * 35 NAMED transitions. Neither hands the assignment table a ROW LIST. This probe is I6's
 * static arm re-implemented row-wise: same corpus (`src/**` .vue/.css/.ts, dev rig INCLUDED
 * exactly as I6 includes it), same regex family, but it emits one record per declaration with
 * file:line, the property list, every duration, every curve, and the delay — so a verb can be
 * assigned to a ROW rather than to a count.
 *
 * Two corpora are printed, because the two census lanes use two:
 *   I6-CORPUS   — every `.vue`/`.css`/`.ts` under src/, dev rig included (R7's number: 77/35)
 *   I2-CORPUS   — `.vue`/`.css` only, `src/pencil/dev/` excluded (R4's number: 39 transitions)
 *
 * Run: node p1-declaration-census.mjs            → the table
 *      node p1-declaration-census.mjs --json     → the records
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import process from "node:process";

const FE = resolve(
  process.env.FE ??
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend",
);
const SRC = join(FE, "src");

function* walk(dir, { skipDev }) {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (skipDev && name === "dev") continue;
      yield* walk(p, { skipDev });
    } else if (skipDev ? /\.(vue|css)$/.test(name) : /\.(vue|css|ts)$/.test(name)) yield p;
  }
}

/** I6's own matcher: `transition|animation` + any longhand suffix, body to the `;`. */
const DECL = /(?:transition|animation)[a-z-]*:\s*([^;]+);/g;
const DUR = /\b\d+(?:\.\d+)?m?s\b/g;
const HOUSE = /var\(--ease-[A-Za-z]+\)/g;
const KEYWORD = /(?<![\w-])(ease-in-out|ease-out|ease-in|ease|linear|step-end|step-start)(?![\w-])/g;
const CUBIC = /cubic-bezier\([^)]*\)/g;

function collect(files, label) {
  const rows = [];
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    // line index for every char offset
    const starts = [0];
    for (let i = 0; i < text.length; i++) if (text[i] === "\n") starts.push(i + 1);
    const lineOf = (off) => {
      let lo = 0,
        hi = starts.length - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (starts[mid] <= off) lo = mid;
        else hi = mid - 1;
      }
      return lo + 1;
    };
    DECL.lastIndex = 0;
    let m;
    while ((m = DECL.exec(text))) {
      const body = m[1].replace(/\s+/g, " ").trim();
      const durs = body.match(DUR);
      if (!durs) continue; // I6 counts only declarations that SPELL a duration
      const head = text.slice(m.index, m.index + m[0].indexOf(":"));
      rows.push({
        file: relative(FE, f),
        line: lineOf(m.index),
        prop: head.trim(),
        body: body.slice(0, 160),
        durations: durs,
        houseCurves: body.match(HOUSE) ?? [],
        keywordCurves: body.match(KEYWORD) ?? [],
        rawCubic: body.match(CUBIC) ?? [],
        corpus: label,
      });
    }
  }
  return rows;
}

const i6 = collect([...walk(SRC, { skipDev: false })], "I6");
const i2 = collect([...walk(SRC, { skipDev: true })], "I2");

const tally = (rows) => {
  const lit = new Map();
  for (const r of rows) for (const d of r.durations) lit.set(d, (lit.get(d) || 0) + 1);
  return lit;
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ i6, i2 }, null, 1));
  process.exit(0);
}

for (const [label, rows] of [
  ["I6-CORPUS (src/** vue+css+ts, dev INCLUDED)", i6],
  ["I2-CORPUS (src/** vue+css, dev EXCLUDED)", i2],
]) {
  const lit = tally(rows);
  console.log(`\n== ${label}`);
  console.log(`   declarations spelling a duration : ${rows.length}`);
  console.log(`   distinct literal durations       : ${lit.size}`);
  console.log(
    `   top                              : ${[...lit.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([k, v]) => `${k}x${v}`)
      .join(", ")}`,
  );
  const named = rows.filter((r) => r.houseCurves.length).length;
  const kw = rows.filter((r) => !r.houseCurves.length && r.keywordCurves.length).length;
  const bare = rows.filter((r) => !r.houseCurves.length && !r.keywordCurves.length && !r.rawCubic.length).length;
  console.log(`   carrying a var(--ease-*)         : ${named}`);
  console.log(`   bare UA keyword only             : ${kw}`);
  console.log(`   no curve at all                  : ${bare}`);
  const raw = rows.filter((r) => r.rawCubic.length);
  console.log(`   raw cubic-bezier at a call site  : ${raw.length}${raw.length ? " -> " + raw.map((r) => `${r.file}:${r.line}`).join(" ") : ""}`);
}

console.log("\n== EVERY ROW (I6 corpus), file:line | property | durations | curves");
for (const r of i6) {
  const curves =
    [...r.houseCurves, ...r.rawCubic, ...(r.houseCurves.length ? [] : r.keywordCurves)].join(" ") || "(none)";
  console.log(
    `${(r.file + ":" + r.line).padEnd(56)} ${r.prop.padEnd(26)} ${r.durations.join("/").padEnd(18)} ${curves}`,
  );
}
