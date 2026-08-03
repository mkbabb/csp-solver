#!/usr/bin/env node
// T7-W6 — THE SELF-DELTA HARNESS (grading the gate that proves the gate).
//
// `GOLDEN_DELTA=black|invert` injects a deliberate visual regression so the golden
// capture-compare can be shown to bite (visual-golden.spec.ts §SELF-DELTA hook). Since
// T5-W1.13 CI has run both arms inline and graded them on ONE bit: playwright exited
// nonzero, therefore the compare bit.
//
// THAT BIT IS NOT THE CLAIM. A spec can exit nonzero for a locator that never appeared, a
// webServer that never came up, a timeout, a syntax error — or, as measured at HEAD, for
// its OWN POSTCONDITION. The `invert` arm clicked the toggle and then asserted `html`
// carries `dark`; the crest golden BOOTS dark, so the click left it light and the row red
// three lines before any screenshot was taken:
//
//     Error: expect(locator).toHaveClass(expected) failed
//     Locator: locator('html')  ·  Expected pattern: /dark/
//
// One quarter of the acceptance test was proving its own precondition, and the inline step
// could not tell the difference. Banked: evidence/w6/selfdelta-invert-ablation.txt.
//
// So this harness grades the arms the way the claim is written: EVERY golden must fail, and
// every failure must carry a `toHaveScreenshot` message. A red for any other reason is a
// SETUP ERROR — the arm did not exercise the compare, and an arm that did not exercise the
// compare proves nothing about it. A green golden under an injected regression is the
// original defect and reds just as loudly.
//
// Exit: 0 every golden red at the compare, in every arm
//       1 an arm did not bite, or bit for the wrong reason
//       2 the instrument itself never ran (no JSON report)
//
// Run: node scripts/golden-selfdelta.mjs   [PLAYWRIGHT_BASE_URL=… to reuse a served app]

import { spawnSync } from "node:child_process";
import process from "node:process";
import { fileURLToPath } from "node:url";

const FRONTEND_ROOT = fileURLToPath(new URL("..", import.meta.url));

// `black` proves the RASTER path compares, `invert` the THEME path. They fail differently,
// so both run; neither writes a baseline.
const ARMS = [
  [
    "black",
    "every asserted surface painted solid — the grain-static→solid-black class",
  ],
  ["invert", "the theme flipped under the capture — direction-aware since T7-W6"],
];

/** The only failure text that proves the COMPARE red. */
const COMPARE_MARKER = /toHaveScreenshot/;

function runArm(arm) {
  const run = spawnSync(
    "npx",
    [
      "playwright",
      "test",
      "--config",
      "playwright-golden.config.ts",
      "--reporter=json",
    ],
    {
      cwd: FRONTEND_ROOT,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      env: {
        ...process.env,
        GOLDEN_DELTA: arm,
        PW_TEST_HTML_REPORT_OPEN: "never",
      },
    },
  );
  const start = (run.stdout ?? "").indexOf("{");
  let report = null;
  if (start >= 0) {
    try {
      report = JSON.parse(run.stdout.slice(start));
    } catch {
      report = null;
    }
  }
  return { run, report };
}

/** Flatten suites → one row per golden, with the status and the first error message. */
function flatten(node, out = []) {
  for (const s of node.suites ?? []) flatten(s, out);
  for (const spec of node.specs ?? []) {
    const results = (spec.tests ?? []).flatMap((t) => t.results ?? []);
    out.push({
      title: spec.title,
      status: results.map((r) => r.status).join(",") || "no-result",
      messages: results.flatMap((r) => (r.errors ?? []).map((e) => e.message ?? "")),
    });
  }
  return out;
}

const oneLine = (s) =>
  (s ?? "")
    // eslint-disable-next-line no-control-regex
    .replace(/\[[0-9;]*m/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(" · ");

console.log(
  "[self-delta] the gate that proves the gate — graded on WHY each arm red, not that it did.",
);

const failures = [];
let totalRows = 0;

for (const [arm, why] of ARMS) {
  console.log(`\n[self-delta] ARM ${arm} — ${why}`);
  const { run, report } = runArm(arm);
  if (!report) {
    console.error(
      `  INSTRUMENT FAILED — no JSON report (playwright exit ${run.status}).\n` +
        `  stderr:\n${(run.stderr ?? "").slice(0, 2000)}`,
    );
    process.exit(2);
  }
  const rows = flatten(report);
  if (rows.length === 0) {
    console.error(`  INSTRUMENT FAILED — the arm resolved ZERO goldens.`);
    process.exit(2);
  }
  totalRows += rows.length;
  for (const r of rows) {
    const red = r.status.includes("failed") || r.status.includes("timedOut");
    const atCompare = r.messages.some((m) => COMPARE_MARKER.test(m));
    const verdict = !red
      ? "GREEN — THE DELTA DID NOT BITE"
      : atCompare
        ? "red at the compare"
        : "RED, BUT NOT AT THE COMPARE";
    console.log(
      `  ${red && atCompare ? "ok  " : "FAIL"} ${r.title}\n       ${verdict}`,
    );
    if (!red || !atCompare) console.log(`       ${oneLine(r.messages[0])}`);
    if (!red)
      failures.push(
        `[${arm}] ${r.title}: PASSED with the regression injected — the compare has ` +
          `stopped comparing, which looks exactly like a compare that is passing.`,
      );
    else if (!atCompare)
      failures.push(
        `[${arm}] ${r.title}: red, but with no toHaveScreenshot in its message — the arm ` +
          `never reached the compare, so it proves nothing about it. First error: ` +
          `${oneLine(r.messages[0])}`,
      );
  }
}

if (failures.length) {
  console.error(`\n[self-delta] FAIL — ${failures.length} of ${totalRows} row(s):`);
  for (const f of failures) console.error(`  · ${f}`);
  console.error(
    `\nFix the ARM, never the grading: an arm that reds for its own reasons is the same\n` +
      `vacuous green in a louder costume.`,
  );
  process.exit(1);
}

console.log(
  `\n[self-delta] PASS — ${totalRows} row(s) across ${ARMS.length} arms, every one red at ` +
    `its toHaveScreenshot. The golden compare still compares.`,
);
process.exit(0);
