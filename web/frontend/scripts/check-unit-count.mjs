#!/usr/bin/env node
// T5-W1.1 — the FE unit lane's count floor (audit finding A1).
//
// 332 test blocks across 31 files ran in NO CI lane: `npm run test:unit` existed and
// nothing invoked it. W1.1 wires the lane; this file is the part that makes the lane
// hard to fake. A bare `vitest run` greens just as loudly on 332 tests as on 3 — a
// narrowed `include` glob, a `describe.skip` over a whole file, a stray `exclude`, or
// a collection error that swallows most of the estate all exit 0 with a cheerful
// summary. So the lane asserts a FLOOR on the number of tests that actually EXECUTED.
//
// Executed = passed + failed. Pending (`.skip`) and todo are NOT executed and never
// count toward the floor — that is the whole point: silent exclusion must move the
// number the gate reads.
//
// FLOOR comes from `scripts/census.stamp.json` — the ONE stamped census, shared with
// check-pw-projects.mjs. It sits ~10% below the stamped live census, so ordinary churn
// (a unit retired with its subject) doesn't red the lane while a wholesale exclusion
// does. The floor is coarse by construction — it catches estate-scale loss, not one
// dropped file — and is re-derived, never nudged down to meet a red.
//
// Beyond the floor, five cheap checks keep the *report* itself from being the lie:
//   · shape    — the counters must be present; a missing key fails, never defaults to 0
//   · freshness — a stale (e.g. committed) report can't green a run that never happened
//   · green     — `success` + zero failures, so a `vitest || true` step can't pass here
//   · self-consistency — the summary counters must equal the per-file assertion census,
//     so a hand-edited `numPassedTests` fails
//   · band        — the floor must sit at or above 85% of `max(stamped census, live)`, so
//     a floor hand-lowered under the band fails AND an estate that grows past its floor
//     without a restamp fails. Slack can no longer accumulate in silence.
//
// `--self-test` runs every check against a known-bad input and fails if any of them
// PASSES (the check-ink-pressure house pattern): a gate that cannot fail is not a gate.
//
// T7-W6 — THE FLOOR IS SLACK AND HAS NO INSTRUMENT. A hand-typed constant with no way to
// re-derive it makes "re-derive from a fresh census" advice rather than a command, and
// advice erodes: 300 against 471 executed was 36% of room. `--restamp` is the command.
//
// T9-W5 §5.2 — THE PROVENANCE SPLIT DIES, AND THE SLACK GETS AN INSTRUMENT.
//   · The number moved OUT of this file into `scripts/census.stamp.json`, which
//     check-pw-projects.mjs reads too. One stamp, one floor, one census. The audit found the
//     same floor written three ways (script 434 / gates.json 300 / ci.yml prose stale), which
//     is a fact nobody could look up.
//   · A floor alone cannot see slack GROW. 434 against 735 executed is 41% of room and every
//     check below was green about it. The BAND arm closes that: floor >= 85% of
//     `max(stamped census, live)`. It reds when the floor is hand-lowered, when the stamp is
//     inflated past the tree, and when the estate outgrows its floor unrestamped.
//   · `--restamp` is a RATCHET — max(banked, derived) — so it round-trips on an unmoved tree
//     instead of proposing a lowering nobody asked for (the defect V4 reproduced in the
//     sibling gate). Only a floor that would land ABOVE live is a real lowering.
//
// FLOOR TIMING (W6 §floor timing, binding): the MECHANISM lands in the wave, the NUMBER
// restamps at WGATE — after the last row lands anywhere in the tranche. The figure stamped
// today is WAVE-TIME truth and says so in its own stamp; the band is what makes the WGATE's
// restamp compulsory rather than advisory if the estate has moved since.
//
//   node scripts/check-unit-count.mjs <vitest-report.json> [--floor=N] [--max-age-min=N]
//   node scripts/check-unit-count.mjs --self-test
//   node scripts/check-unit-count.mjs --restamp <vitest-report.json> [--dry] [--allow-lower "why"]

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const SELF = fileURLToPath(import.meta.url);

/* THE ONE STAMPED CENSUS. Read, never hard-coded: a second copy of a floor is how the
 * provenance split was born. `--restamp` rewrites this file and nothing else. */
const STAMP_PATH = join(dirname(SELF), "census.stamp.json");
const readStamp = () => JSON.parse(readFileSync(STAMP_PATH, "utf8"));
const STAMP = readStamp();
const LAW = STAMP.law;

/** The band's own floor: what `n` live tests oblige, at 85%. */
const bandFloor = (n) => Math.ceil(n * LAW.band);

/**
 * The house derivation, identical in check-pw-projects.mjs and stated once in the stamp's
 * `law.derive`. The max() is load-bearing: floor(11 * 0.9) = 9 sits UNDER ceil(11 * 0.85) = 10,
 * so the plain churn rule would derive a floor its own band rejects.
 */
const deriveFloor = (live) =>
  live <= LAW.exactAtOrBelow
    ? live
    : Math.max(Math.floor(live * LAW.churnRoom), bandFloor(live));

/** Where the floor beside it came from. The census is printed on the lane's own line. */
const stampLine = (s) =>
  `${s.sha} · ${s.date} · ${s.wave}` + (s.note ? ` · ${s.note}` : "");

const MAX_AGE_MIN = 120; // a report older than the job that made it is not evidence

/**
 * Read + verify one vitest JSON report (`--reporter=json --outputFile.json=…`).
 * Returns every failure it finds rather than throwing on the first — one run of the
 * gate should name everything wrong with the lane.
 */
function check(
  reportPath,
  {
    stamp = STAMP,
    floor = stamp.unit.floor,
    band = true,
    maxAgeMin = MAX_AGE_MIN,
    now = Date.now(),
  } = {},
) {
  const failures = [];

  let raw;
  try {
    raw = readFileSync(reportPath, "utf8");
  } catch (err) {
    return {
      failures: [
        `no report at ${reportPath} (${err.code}) — the vitest step must write one`,
      ],
      stats: null,
    };
  }

  let report;
  try {
    report = JSON.parse(raw);
  } catch (err) {
    return {
      failures: [`report at ${reportPath} is not JSON: ${err.message}`],
      stats: null,
    };
  }

  // Shape. Absent counters FAIL — they never fall back to 0, which would let a report
  // from a different tool green the floor by arithmetic accident.
  const counters = [
    "numTotalTests",
    "numPassedTests",
    "numFailedTests",
    "numPendingTests",
    "numTodoTests",
    "startTime",
  ];
  const missing = counters.filter((k) => typeof report[k] !== "number");
  if (missing.length || !Array.isArray(report.testResults)) {
    return {
      failures: [
        `report at ${reportPath} is not a vitest JSON report — missing/invalid: ` +
          [...missing, Array.isArray(report.testResults) ? null : "testResults[]"]
            .filter(Boolean)
            .join(", "),
      ],
      stats: null,
    };
  }

  const executed = report.numPassedTests + report.numFailedTests;
  const stats = {
    files: report.testResults.length,
    suites: report.numTotalTestSuites,
    total: report.numTotalTests,
    executed,
    passed: report.numPassedTests,
    failed: report.numFailedTests,
    skipped: report.numPendingTests,
    todo: report.numTodoTests,
    ageMin: (now - report.startTime) / 60000,
  };

  // Freshness.
  if (!(stats.ageMin <= maxAgeMin) || stats.ageMin < -5) {
    failures.push(
      `report is stale or time-travelled: startTime is ${stats.ageMin.toFixed(1)} min from now ` +
        `(window 0..${maxAgeMin} min) — the gate reads THIS run's report, not a committed one`,
    );
  }

  // Green. The lane's own exit code should have caught this; assert it here too so a
  // step that swallows vitest's status can't hand us a red report and pass.
  if (report.numFailedTests > 0 || report.success !== true) {
    failures.push(
      `report is not a passing run: ${report.numFailedTests} failed, success=${report.success}`,
    );
  }

  // Self-consistency — the summary counters vs the per-file assertion census.
  const census = { passed: 0, failed: 0, skipped: 0, todo: 0, seen: 0 };
  for (const file of report.testResults) {
    for (const a of file.assertionResults ?? []) {
      census.seen += 1;
      if (a.status === "passed") census.passed += 1;
      else if (a.status === "failed") census.failed += 1;
      else if (a.status === "pending" || a.status === "skipped") census.skipped += 1;
      else if (a.status === "todo") census.todo += 1;
    }
  }
  if (
    census.passed !== report.numPassedTests ||
    census.failed !== report.numFailedTests
  ) {
    failures.push(
      `summary counters disagree with the per-file census: summary ${report.numPassedTests} passed / ` +
        `${report.numFailedTests} failed vs census ${census.passed} passed / ${census.failed} failed ` +
        `over ${census.seen} assertions in ${report.testResults.length} files`,
    );
  }

  // The floor.
  if (executed < floor) {
    failures.push(
      `only ${executed} tests EXECUTED (${report.numPassedTests} passed + ${report.numFailedTests} failed), ` +
        `floor is ${floor} — tests were excluded, skipped or never collected. ` +
        `(${report.numPendingTests} skipped, ${report.numTodoTests} todo, ${report.numTotalTests} total)`,
    );
  }

  // The band (T9-W5 §5.2). Held against whichever is HIGHER, the stamp or the tree, so it
  // reds in both directions: an inflated stamp is a claim the tree refuses, and an estate
  // that outgrows its floor is slack accumulating in silence — the disease this arm exists
  // for. A floor is never allowed to drift more than 15% under the truth.
  if (band) {
    const stamped = stamp.unit.census.executed;
    const ref = Math.max(stamped, executed);
    const need = bandFloor(ref);
    stats.band = { stamped, ref, need };
    if (floor < need)
      failures.push(
        `floor ${floor} is OUT OF BAND: ${((1 - floor / ref) * 100).toFixed(1)}% under ` +
          `${ref} (stamped census ${stamped}, live ${executed}); the band is ` +
          `${(LAW.band * 100).toFixed(0)}%, so the floor owes ${need}. ` +
          (executed > stamped
            ? `The estate GREW past its floor and nothing restamped it — that is silent slack, `
            : executed < stamped
              ? `The stamped census sits above the tree it claims to have measured — an inflated ` +
                `stamp is a claim, `
              : `The floor was never re-derived from the census stamped beside it — slack banked, `) +
          `not churn room. ` +
          `Re-derive: node scripts/check-unit-count.mjs --restamp <report>`,
      );
  }

  return { failures, stats };
}

/* ── self-test: every check shown able to fail ──────────────────────────── */

/** A well-formed report of `n` passing tests spread over `files` files. */
function fabricate(
  n,
  { files = 4, startTime = Date.now(), success = true, failed = 0 } = {},
) {
  const testResults = [];
  const per = Math.ceil(n / files);
  let left = n;
  for (let f = 0; f < files; f += 1) {
    const take = Math.min(per, left);
    left -= take;
    testResults.push({
      name: `/repo/src/fabricated-${f}.test.ts`,
      status: "passed",
      assertionResults: Array.from({ length: take }, (_, i) => ({
        title: `t${i}`,
        fullName: `fabricated ${f} > t${i}`,
        status: f === 0 && i < failed ? "failed" : "passed",
        failureMessages: [],
      })),
    });
  }
  return {
    numTotalTestSuites: files,
    numPassedTestSuites: files,
    numFailedTestSuites: 0,
    numPendingTestSuites: 0,
    numTotalTests: n,
    numPassedTests: n - failed,
    numFailedTests: failed,
    numPendingTests: 0,
    numTodoTests: 0,
    startTime,
    success,
    testResults,
  };
}

/** The stamp with one field bent — the band fixtures' negative controls. */
const bentStamp = (unit) => ({
  ...STAMP,
  unit: {
    ...STAMP.unit,
    ...unit,
    census: { ...STAMP.unit.census, ...(unit.census ?? {}) },
  },
});

function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "unit-count-selftest-"));
  const write = (name, body) => {
    const p = join(dir, name);
    writeFileSync(p, typeof body === "string" ? body : JSON.stringify(body));
    return p;
  };
  const now = Date.now();
  const FLOOR = STAMP.unit.floor;
  const CENSUS = STAMP.unit.census.executed;

  // Every case must FAIL. `absent` is a path nothing was written to.
  const mustFail = [
    ["missing report", join(dir, "absent.json")],
    ["malformed JSON", write("malformed.json", "{ not json")],
    ["wrong shape (no counters)", write("shape.json", { hello: "world" })],
    [
      "shape with counters but no testResults[]",
      write("shape2.json", {
        ...fabricate(400, { startTime: now }),
        testResults: undefined,
      }),
    ],
    // Fixtures DERIVE from FLOOR (T7-WGATE): the close's restamp moved FLOOR 300→434 and
    // the then-hardcoded 299/300 pair silently became deep-red/red — the self-test failed
    // its own mustPass on the first post-restamp run. A literal here desyncs on every
    // restamp by construction; FLOOR±0/−1 cannot.
    [
      `below the floor (${FLOOR - 1})`,
      write("low.json", fabricate(FLOOR - 1, { startTime: now })),
    ],
    [
      "stale report (3h old)",
      write("stale.json", fabricate(400, { startTime: now - 180 * 60000 })),
    ],
    [
      "future report (clock forgery)",
      write("future.json", fabricate(400, { startTime: now + 60 * 60000 })),
    ],
    [
      "red run (failures present)",
      write("red.json", fabricate(400, { startTime: now, success: false, failed: 3 })),
    ],
    [
      "forged counters (summary 400, census 5)",
      write("forged.json", {
        ...fabricate(5, { startTime: now }),
        numPassedTests: 400,
      }),
    ],
    [
      `skips carry the floor (${FLOOR - 1} executed + 40 skipped)`,
      write("skipped.json", {
        ...fabricate(FLOOR - 1, { startTime: now }),
        numPendingTests: 40,
        numTotalTests: FLOOR - 1 + 40,
      }),
    ],
    // THE BAND (T9-W5 §5.2). Both canaries, on a report that clears every other check:
    // a stamp inflated over the tree, and a floor quietly walked down under 85%.
    [
      `census stamped 20% above live (${Math.round(CENSUS * 1.2)} claimed, ${CENSUS} run)`,
      write("inflated.json", fabricate(CENSUS, { startTime: now })),
      { stamp: bentStamp({ census: { executed: Math.round(CENSUS * 1.2) } }) },
    ],
    [
      `floor hand-lowered one under the band (${bandFloor(CENSUS) - 1} vs ${bandFloor(CENSUS)})`,
      write("lowered.json", fabricate(CENSUS, { startTime: now })),
      { stamp: bentStamp({ floor: bandFloor(CENSUS) - 1 }) },
    ],
  ];

  // These must PASS — a gate that fails everything is equally useless.
  const mustPass = [
    [
      `exactly at the floor (${FLOOR})`,
      write("ok.json", fabricate(FLOOR, { startTime: now })),
    ],
    [
      `the stamped tree itself (${CENSUS} executed, floor ${FLOOR}, band ${bandFloor(CENSUS)})`,
      write("stamped.json", fabricate(CENSUS, { startTime: now })),
    ],
  ];

  const vacuous = [];
  for (const [name, path, opts] of mustFail) {
    const { failures } = check(path, { now, ...opts });
    console.log(`  ${failures.length ? "reds" : "GREENS"}  ${name}`);
    if (!failures.length)
      vacuous.push(`self-test: "${name}" PASSED the gate — the check is vacuous`);
  }
  for (const [name, path, opts] of mustPass) {
    const { failures } = check(path, { now, ...opts });
    console.log(`  ${failures.length ? "REDS" : "greens"}  ${name}`);
    if (failures.length)
      vacuous.push(`self-test: "${name}" failed the gate — ${failures.join(" | ")}`);
  }

  rmSync(dir, { recursive: true, force: true });
  return vacuous;
}

/* ── --restamp: re-derive the floor from a live census (WGATE only) ─────── */

function restamp(reportPath, { dry, allowLower, wave }) {
  const { failures, stats } = check(reportPath, { floor: 0, band: false });
  // A red or stale report cannot found a floor. `floor: 0` above removes the floor's own
  // opinion from that judgment, and `band: false` the band's — every OTHER check still has
  // to pass. (The band is the reason a restamp is being asked for; it cannot also be the
  // reason the restamp refuses.)
  if (failures.length) {
    console.error(
      `--restamp REFUSED: the report is not a clean census.\n` +
        failures.map((f) => `  · ${f}`).join("\n"),
    );
    process.exit(1);
  }

  const banked = STAMP.unit.floor;
  const derived = deriveFloor(stats.executed);
  // THE RATCHET (law.ratchet). Closing slack must never hand any back, so the banked floor
  // wins when it is the higher of the two — which is also why a restamp on an unmoved tree
  // proposes nothing and round-trips. A derived floor that would land ABOVE live is the one
  // true lowering: it means tests actually left.
  let want = Math.max(banked, derived);
  const lowering = want > stats.executed;
  if (lowering) want = derived;

  const sha = execFileSync("git", ["rev-parse", "--short", "HEAD"], {
    cwd: join(SELF, "..", "..", ".."),
    encoding: "utf8",
  }).trim();
  console.log(
    `RESTAMP — ${stats.executed} executed / ${stats.files} files / ${stats.suites} suites\n` +
      `  derived ${derived}  ·  banked ${banked}  ·  ratchet → floor ${want}` +
      `${want === banked ? "   (unmoved — the arm round-trips)" : ""}` +
      `${want < banked ? "   ↓ LOWERED" : ""}\n` +
      `  band at ${(LAW.band * 100).toFixed(0)}% of ${stats.executed} is ${bandFloor(stats.executed)}` +
      `  ·  ${sha} · ${new Date().toISOString().slice(0, 10)} · ${wave}`,
  );

  if (want < banked && !allowLower) {
    console.error(
      `\n--restamp REFUSED: the floor would DROP ${banked} -> ${want}. Lowering a floor is a\n` +
        `  re-baseline, and the house does not re-baseline on a red. Say where the tests went:\n` +
        `  --restamp <report> --allow-lower "<reason>"`,
    );
    process.exit(1);
  }
  if (dry) {
    console.log("\n--dry — nothing written.");
    return;
  }
  const next = readStamp();
  next.unit = {
    ...next.unit,
    stamp: {
      sha,
      date: new Date().toISOString().slice(0, 10),
      wave,
      note: allowLower ? `LOWERED — ${allowLower}` : "",
    },
    census: { executed: stats.executed, files: stats.files, suites: stats.suites },
    floor: want,
  };
  writeFileSync(STAMP_PATH, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`\nwritten -> scripts/census.stamp.json (unit)`);
}

/* ── main ───────────────────────────────────────────────────────────────── */

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? Number(hit.split("=")[1]) : fallback;
};

if (argv.includes("--self-test")) {
  console.log("check-unit-count --self-test — each check against a known-bad input:");
  const vacuous = selfTest();
  if (vacuous.length) {
    console.error(`\nSELF-TEST FAILED\n${vacuous.map((v) => `  · ${v}`).join("\n")}`);
    process.exit(1);
  }
  console.log(
    "\nself-test OK — every check fails on its known-bad input, and passes at the floor.",
  );
  process.exit(0);
}

/** The value after a `--name` flag, and the index it occupies (so it never reads as the report). */
const valueFlags = ["--allow-lower", "--wave"];
const valueOf = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? (argv[i + 1] ?? "(no value given)") : null;
};
const consumed = new Set(
  valueFlags
    .map((f) => argv.indexOf(f))
    .filter((i) => i >= 0)
    .map((i) => i + 1),
);
const reportPath = argv.find((a, i) => !a.startsWith("--") && !consumed.has(i));
if (!reportPath) {
  console.error(
    "usage: node scripts/check-unit-count.mjs <vitest-report.json> [--floor=N] [--max-age-min=N]\n" +
      "       node scripts/check-unit-count.mjs --self-test\n" +
      '       node scripts/check-unit-count.mjs --restamp <report> [--dry] [--wave "T9-WGATE"] [--allow-lower "why"]',
  );
  process.exit(2);
}

if (argv.includes("--restamp")) {
  restamp(reportPath, {
    dry: argv.includes("--dry"),
    allowLower: valueOf("--allow-lower"),
    wave: valueOf("--wave") ?? "unlabelled restamp",
  });
  process.exit(0);
}

const floor = flag("floor", STAMP.unit.floor);
const { failures, stats } = check(reportPath, {
  floor,
  maxAgeMin: flag("max-age-min", MAX_AGE_MIN),
});

if (stats) {
  console.log(
    `FE unit lane — ${stats.executed} executed (${stats.passed} passed / ${stats.failed} failed), ` +
      `${stats.skipped} skipped, ${stats.todo} todo, over ${stats.files} files / ${stats.suites} suites; ` +
      `floor ${floor}; report age ${stats.ageMin.toFixed(1)} min.\n` +
      `  floor stamped: ${stampLine(STAMP.unit.stamp)}` +
      (stats.band
        ? `\n  band: floor ${floor} vs ${stats.band.need} owed on ${stats.band.ref} ` +
          `(${(LAW.band * 100).toFixed(0)}% of max(stamp ${stats.band.stamped}, live ${stats.executed}))`
        : "") +
      (stats.executed >= floor
        ? `  ·  slack ${(((stats.executed - floor) / floor) * 100).toFixed(0)}%`
        : ""),
  );
}

if (failures.length) {
  console.error(
    `\nUNIT COUNT GATE FAILED\n${failures.map((f) => `  · ${f}`).join("\n")}`,
  );
  process.exit(1);
}

console.log(`unit count OK — ${stats.executed} >= ${floor}.`);
