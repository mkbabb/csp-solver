#!/usr/bin/env node
/**
 * THE CREST-RATE TALLY — pass 5, Lane D, work order (1).
 *
 * Pass 4's Lane-D row was assigned to COUNT rather than recite, and it recited: the dossier
 * published `toggle-crest-dark` ✓ 7/11 · ✘ 4/11 where its own eleven banked runs read 6/11 · 5/11,
 * and commit `64fa37a4`'s body published 6/8 where the eight runs it had on disk read 5/8. The
 * cure for a recitation defect is not a better recitation. This script walks the banked logs and
 * prints the rate, so the next document quotes a command instead of a paragraph.
 *
 *   node docs/.../pass5/D/rig/crest-rate-tally.mjs           # table
 *   node docs/.../pass5/D/rig/crest-rate-tally.mjs --json    # machine-readable
 *
 * COUNTING RULE, stated because the number depends on it: one RUN = one appearance of the
 * `golden · toggle crest (dark, moon)` row in a Playwright list-reporter log, green (`✓`) or
 * red (`✘`). Magnitude-instrument logs (`golden-magnitude.mjs`, W3) count differently and are
 * tallied separately: there a run is one `######## … RUN n ########` block, and the row is
 * "OVER THE FLOOR" (what would red the gate) versus under it or byte-identical.
 *
 * NOT POOLED BY DEFAULT. The arms below are different trees, different sessions and different
 * hosts-of-a-day; the sun-crest clause's own claim is that this subject is load/session
 * sensitive, which is exactly the assumption pooling denies. The pooled figure is printed last
 * with that caveat attached, and NO rate here — pooled or not — authorises a re-baseline
 * (CH-42 is WATCH-ONLY; pass-5 lead adjudication row 8).
 */
import { readFileSync, existsSync } from "node:fs";
import { globSync } from "node:fs";
import { dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const LOOP = resolve(HERE, "../../..");
const EV = resolve(LOOP, ".."); // …/2026-08-tranche-5/evidence

const g = (p) => globSync(p, { cwd: LOOP }).sort();
const num = (f) => Number(/(\d+)\.log$/.exec(f)?.[1] ?? 0);

/** Playwright list-reporter arms: [label, files, what the arm is]. */
const PW_ARMS = [
  ["pass3 MEASURE · BASE r1..r3", g("pass3/measure/gates-golden-BASE-r*.log"), "pre-remint, base dist"],
  ["pass3 MEASURE · HEAD r1..r3", g("pass3/measure/gates-golden-r*.log"), "pre-remint, pass-3 HEAD"],
  ["pass4 D · pre-remint BEFORE", g("pass4/logs/D/gates-golden-BEFORE.log"), "the run that opened pass 4"],
  [
    "pass4 D · POST-REMINT (the row)",
    [
      "pass4/logs/D/gates-golden-AFTER-r1r2r3.log",
      "pass4/logs/D/gates-golden-AFTER-r4r8.log",
      "pass4/logs/D/gates-FINAL-e2e.log",
    ].filter((f) => existsSync(resolve(LOOP, f))),
    "the eleven D published as 7/11 · 4/11",
  ],
  ["pass4 D · the 8 on disk at 64fa37a4", ["pass4/logs/D/gates-golden-AFTER-r1r2r3.log", "pass4/logs/D/gates-golden-AFTER-r4r8.log"], "what the commit body counted"],
  ["pass4 MEASURE · head r1..r8", g("pass4/logs/measure/gates-golden-head-r*.log"), "non-author, same host, same day"],
  ["pass4 F3 · final HEAD 1..14", g("pass4/logs/F3/final/goldens-head-*.log").sort((a, b) => num(a) - num(b)), "F3's rate arm"],
  ["pass4 F3 · final NO-OP 1..14", g("pass4/logs/F3/final/goldens-noop-*.log").sort((a, b) => num(a) - num(b)), "F3's no-op control arm"],
  ["pass4 F3 · final BASE 1..7", g("pass4/logs/F3/final/goldens-base-*.log").sort((a, b) => num(a) - num(b)), "F3's base arm"],
  ["pass4 A · gates-goldens", g("pass4/logs/A/gates-goldens.log"), "Lane A's single sweep"],
];

/** The W3 magnitude instrument (a different measurement, tallied on its own terms). */
const MAG_ARMS = [
  ["W3-verify · W3 dist (6 runs)", resolve(EV, "w3/verify/08-pi-magnitude-w3.txt")],
  ["W3-verify · HEAD CONTROL (6 runs)", resolve(EV, "w3/verify/11-pi-magnitude-HEAD-control.txt")],
];

const ROW = /golden · toggle crest/;
function tallyPw(files) {
  let green = 0, red = 0;
  for (const f of files) {
    const p = resolve(LOOP, f);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split("\n")) {
      if (!ROW.test(line)) continue;
      if (line.includes("✓")) green++;
      else if (line.includes("✘")) red++;
    }
  }
  return { green, red, n: green + red };
}

function tallyMag(file) {
  if (!existsSync(file)) return null;
  const t = readFileSync(file, "utf8");
  const blocks = t.split(/######## .*? ########/).slice(1);
  let over = 0, under = 0, identical = 0, worstPx = 0;
  for (const b of blocks) {
    // The READING row, not the "floors in force: … toggle-crest-dark 0.017" preamble line and
    // not the JSON tail — the row is the one that starts at column 3 with the subject name.
    const line = b.split("\n").find((l) => /^\s{2}toggle-crest-dark\s/.test(l));
    if (!line) continue;
    const px = Number(/\s(\d+)\s+\d+×\d+/.exec(line)?.[1] ?? 0);
    worstPx = Math.max(worstPx, px);
    if (/OVER THE FLOOR/.test(line)) over++;
    else if (/byte-for-byte identical/.test(line)) identical++;
    else under++;
  }
  return { runs: blocks.length, over, under, identical, worstPx };
}

const pw = PW_ARMS.map(([label, files, what]) => ({ label, what, files: files.map((f) => basename(f)), ...tallyPw(files) }));
const mag = MAG_ARMS.map(([label, file]) => ({ label, file: basename(file), ...(tallyMag(file) ?? {}) }));

// The pooled figure — printed, caveated, and not a basis for anything.
const poolLabels = new Set([
  "pass4 D · POST-REMINT (the row)",
  "pass4 MEASURE · head r1..r8",
  "pass4 F3 · final HEAD 1..14",
  "pass4 F3 · final NO-OP 1..14",
  "pass4 F3 · final BASE 1..7",
  "pass4 D · pre-remint BEFORE",
  "pass4 A · gates-goldens",
]);
const pooled = pw.filter((a) => poolLabels.has(a.label)).reduce((acc, a) => ({ green: acc.green + a.green, red: acc.red + a.red, n: acc.n + a.n }), { green: 0, red: 0, n: 0 });

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ pw, mag, pooled }, null, 2));
} else {
  console.log("TOGGLE-CREST-DARK — every banked arm, re-derived from the logs (pass 5, Lane D)\n");
  console.log("arm                                   green   red     n   red-rate   what it is");
  for (const a of pw) {
    const rate = a.n ? `${((a.red / a.n) * 100).toFixed(1)}%` : "—";
    console.log(`${a.label.padEnd(36)}  ${String(a.green).padStart(4)}  ${String(a.red).padStart(4)}  ${String(a.n).padStart(4)}   ${rate.padStart(7)}   ${a.what}`);
  }
  console.log("\nthe W3 magnitude instrument (runs, not test rows) — OVER THE FLOOR is what reds the gate\n");
  for (const m of mag) {
    console.log(`${m.label.padEnd(36)}  runs ${m.runs}  ·  OVER ${m.over}  ·  under-floor ${m.under}  ·  byte-identical ${m.identical}  ·  worst ${m.worstPx} px`);
  }
  console.log(`\nPOOLED across the pass-4 host-day (caveat in the header): ${pooled.green} green · ${pooled.red} red · n=${pooled.n} · ${((pooled.red / pooled.n) * 100).toFixed(1)}%`);
  console.log("NO rate here authorises a re-baseline. CH-42 is WATCH-ONLY (lead adjudication row 8).");
}
