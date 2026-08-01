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
// FLOOR = 300 (gates.json `W1.unitLane.floor`). Observed at the wave base f38c5130:
// 332 executed / 31 files / 133 suites, 0 skipped, 0 todo. 300 sits ~10% below, so
// ordinary churn (a unit retired with its subject) doesn't red the lane while a
// wholesale exclusion does. The floor is coarse by construction — it catches estate-
// scale loss, not one dropped file — and is re-derived, never nudged down to meet a
// red.
//
// Beyond the floor, four cheap checks keep the *report* itself from being the lie:
//   · shape    — the counters must be present; a missing key fails, never defaults to 0
//   · freshness — a stale (e.g. committed) report can't green a run that never happened
//   · green     — `success` + zero failures, so a `vitest || true` step can't pass here
//   · self-consistency — the summary counters must equal the per-file assertion census,
//     so a hand-edited `numPassedTests` fails
//
// `--self-test` runs every check against a known-bad input and fails if any of them
// PASSES (the check-ink-pressure house pattern): a gate that cannot fail is not a gate.
//
//   node scripts/check-unit-count.mjs <vitest-report.json> [--floor=N] [--max-age-min=N]
//   node scripts/check-unit-count.mjs --self-test

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";

const FLOOR = 300; // gates.json W1.unitLane.floor
const MAX_AGE_MIN = 120; // a report older than the job that made it is not evidence

/**
 * Read + verify one vitest JSON report (`--reporter=json --outputFile.json=…`).
 * Returns every failure it finds rather than throwing on the first — one run of the
 * gate should name everything wrong with the lane.
 */
function check(
  reportPath,
  { floor = FLOOR, maxAgeMin = MAX_AGE_MIN, now = Date.now() } = {},
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

function selfTest() {
  const dir = mkdtempSync(join(tmpdir(), "unit-count-selftest-"));
  const write = (name, body) => {
    const p = join(dir, name);
    writeFileSync(p, typeof body === "string" ? body : JSON.stringify(body));
    return p;
  };
  const now = Date.now();

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
    ["below the floor (299)", write("low.json", fabricate(299, { startTime: now }))],
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
      "skips carry the floor (299 executed + 40 skipped)",
      write("skipped.json", {
        ...fabricate(299, { startTime: now }),
        numPendingTests: 40,
        numTotalTests: 339,
      }),
    ],
  ];

  // This one must PASS — a gate that fails everything is equally useless.
  const mustPass = [
    [
      "exactly at the floor (300)",
      write("ok.json", fabricate(300, { startTime: now })),
    ],
  ];

  const vacuous = [];
  for (const [name, path] of mustFail) {
    const { failures } = check(path, { now });
    console.log(`  ${failures.length ? "reds" : "GREENS"}  ${name}`);
    if (!failures.length)
      vacuous.push(`self-test: "${name}" PASSED the gate — the check is vacuous`);
  }
  for (const [name, path] of mustPass) {
    const { failures } = check(path, { now });
    console.log(`  ${failures.length ? "REDS" : "greens"}  ${name}`);
    if (failures.length)
      vacuous.push(`self-test: "${name}" failed the gate — ${failures.join(" | ")}`);
  }

  rmSync(dir, { recursive: true, force: true });
  return vacuous;
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

const reportPath = argv.find((a) => !a.startsWith("--"));
if (!reportPath) {
  console.error(
    "usage: node scripts/check-unit-count.mjs <vitest-report.json> [--floor=N] [--max-age-min=N]\n" +
      "       node scripts/check-unit-count.mjs --self-test",
  );
  process.exit(2);
}

const floor = flag("floor", FLOOR);
const { failures, stats } = check(reportPath, {
  floor,
  maxAgeMin: flag("max-age-min", MAX_AGE_MIN),
});

if (stats) {
  console.log(
    `FE unit lane — ${stats.executed} executed (${stats.passed} passed / ${stats.failed} failed), ` +
      `${stats.skipped} skipped, ${stats.todo} todo, over ${stats.files} files / ${stats.suites} suites; ` +
      `floor ${floor}; report age ${stats.ageMin.toFixed(1)} min.`,
  );
}

if (failures.length) {
  console.error(
    `\nUNIT COUNT GATE FAILED\n${failures.map((f) => `  · ${f}`).join("\n")}`,
  );
  process.exit(1);
}

console.log(`unit count OK — ${stats.executed} >= ${floor}.`);
