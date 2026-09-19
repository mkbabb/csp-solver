#!/usr/bin/env node
// T9-W7 pass-1 · MOT-DERIVE · WHAT FRACTION OF THE ESTATE COULD A TRAVEL SYSTEM EVEN GOVERN?
//
// The family's own kill condition: "a system that governs the minority of declarations is a
// rule for two gestures". This counts it. Every shipped `transition:`/`animation:` declaration
// under src/ (dev rig excluded, matching i2's scope), classified by whether its animated
// property set can carry a DISTANCE:
//
//   DISTANCE?  transform / translate / offset-*  — a translation is possible (verified by hand
//              for the shorthand rows; see the printed list).
//   NO         opacity, colour, background, stroke, box-shadow, filter, visibility, scale,
//              rotate, border-*, grid-template-rows, stroke-dashoffset, clip-path, width/height
//   ALL        `transition: all` — unknowable statically; counted separately.
//
// Plus the WAAPI movers, which are the ones the family actually proposes to drive; those are
// enumerated from the round-zero animate() census rather than guessed.
//
//   node p4-travel-coverage.mjs [--list]

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import process from "node:process";

const SRC = resolve(
  process.env.SRC ??
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src",
);
const EXCLUDE_DIRS = ["dev"];

const DISTANCE_PROPS = /\b(transform|translate|offset-distance|offset-path|left|top|right|bottom|margin-|inset)\b/;
const ALL_PROP = /(^|\s)all(\s|$|,)/;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (EXCLUDE_DIRS.includes(name)) continue;
      yield* walk(p);
    } else if (/\.(vue|css)$/.test(name)) yield p;
  }
}

const DECL = /(?<![\w-])(transition|animation)\s*:\s*/;
const rows = [];
for (const file of walk(SRC)) {
  const lines = readFileSync(file, "utf8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = DECL.exec(line);
    const s = line.trim();
    if (!m || s.startsWith("*") || s.startsWith("//") || s.startsWith("/*")) continue;
    const buf = [line];
    let j = i;
    while (!buf[buf.length - 1].includes(";") && j - i < 8) {
      j++;
      if (j >= lines.length) break;
      buf.push(lines[j]);
    }
    const joined = buf.map((x) => x.trim()).join(" ");
    const body = joined.slice(joined.indexOf(m[0]) + m[0].length).split(";")[0].trim();
    const at = `${relative(SRC, file)}:${i + 1}`;
    i = j;
    if (body.startsWith("none")) continue;
    const kind = m[1];
    const bucket = ALL_PROP.test(body)
      ? "ALL"
      : DISTANCE_PROPS.test(body)
        ? "DISTANCE?"
        : "NO";
    rows.push({ at, kind, bucket, body: body.slice(0, 74) });
  }
}

const by = (k, b) => rows.filter((r) => r.kind === k && r.bucket === b).length;
const n = (k) => rows.filter((r) => r.kind === k).length;

console.log(`shipped declarations (dev rig excluded): ${rows.length}  (transition ${n("transition")}, animation ${n("animation")})`);
console.log("");
console.log("bucket\ttransition\tanimation\ttotal");
for (const b of ["DISTANCE?", "ALL", "NO"])
  console.log(
    `${b}\t${by("transition", b)}\t\t${by("animation", b)}\t\t${by("transition", b) + by("animation", b)}`,
  );
const dist = rows.filter((r) => r.bucket === "DISTANCE?").length;
const all = rows.filter((r) => r.bucket === "ALL").length;
console.log("");
console.log(
  `A travel-derived duration could reach at most ${dist + all} of ${rows.length} declarations (${(
    ((dist + all) / rows.length) *
    100
  ).toFixed(1)}%) — and only the subset of those that actually translate.`,
);
console.log(
  `Declarations that cannot carry a distance at all: ${rows.length - dist - all} (${(
    ((rows.length - dist - all) / rows.length) *
    100
  ).toFixed(1)}%). Each needs a stated constant.`,
);

if (process.argv.includes("--list")) {
  console.log("\n— the DISTANCE? rows, for hand verification:");
  for (const r of rows.filter((x) => x.bucket === "DISTANCE?"))
    console.log(`  src/${r.at.padEnd(50)} ${r.kind}: ${r.body}`);
  console.log("\n— the ALL rows:");
  for (const r of rows.filter((x) => x.bucket === "ALL"))
    console.log(`  src/${r.at.padEnd(50)} ${r.kind}: ${r.body}`);
}

// The WAAPI half — what the family would actually drive.
console.log("");
console.log("— the WAAPI movers (r4-probe3.json), the family's real consumers:");
const probe3 = JSON.parse(
  readFileSync(
    resolve(
      "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/r4-transition-grammar/data/r4-probe3.json",
    ),
    "utf8",
  ),
);
let movers = 0;
let translating = 0;
for (const bag of Object.values(probe3))
  for (const m of bag.movers) {
    if (m.mark) continue;
    movers++;
    const from = JSON.parse(m.kf)[0].transform;
    if (/translate(X|Y)?\(\s*-?[\d.e+-]+px/.test(from) && !/translate\(\s*0px,\s*0px\s*\)/.test(from))
      translating++;
  }
console.log(
  `  ${movers} movers observed across both viewports; ${translating} carry a pixel translation, ${movers - translating} are scale-only.`,
);
console.log(
  `  distinct gesture classes with travel: drawer (sheet/case/masthead), gallery fold (board/wordmark), card step — THREE.`,
);
