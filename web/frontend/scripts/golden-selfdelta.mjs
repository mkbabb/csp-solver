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
// T7-W3 — THE SECOND OCCURRENCE, and the same shape: `black` styled a CASCADE at surfaces
// that are BITMAPS. It reached the wordmark's baked `<image>` stack only through the rim of
// the un-hidden measuring text — 6,766 px, ratio 0.0390 — which reds darwin's 0.017 soul
// floor and PASSES linux's 0.05 clause floor, so the arm read verified locally and went
// green on the one platform CI runs (run 30799424855). The arm now COVERS each asserted
// surface with an opaque box and hit-tests that the cover landed; the same four crops
// measure 0.65–0.86. Cure in visual-golden.spec.ts §GOLDEN_DELTA=black.
//
// Hence the MAGNITUDE column below: every red prints the ratio it bit at. A row that bites
// by a hair is a row about to be a green somewhere else, and the old grading — every golden
// red, every red at a `toHaveScreenshot` — could not see the difference. On the chair's
// 2026-08-03 ruling it is GRADED, not merely printed: `MIN_ARM_RATIO`, below.
//
// Exit: 0 every golden red at the compare, past the blind-band floor, in every arm
//       1 an arm did not bite, bit for the wrong reason, or bit too faintly to prove anything
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
    "every asserted surface covered opaque — the grain-static→solid class, geometric since T7-W3",
  ],
  ["invert", "the theme flipped under the capture — direction-aware since T7-W6"],
];

/** The only failure text that proves the COMPARE red. */
const COMPARE_MARKER = /toHaveScreenshot/;
/** The compare's own measurement. GRADED since the chair's 2026-08-03 ruling — see below. */
const MAGNITUDE = /([\d,]+) pixels \(ratio ([\d.]+)/;

/**
 * THE BLIND-BAND FLOOR (chair ruling, 2026-08-03).
 *
 * 0.10 = 2× the 0.05 linux sun-crest coarse floor, the widest floor enforced anywhere in the
 * estate (visual-golden.spec.ts LOGO_FLOOR / CREST_FLOOR on linux). An arm delta that can't
 * clear TWICE the coarsest floor isn't a proof that the compare bites — it's a coin flip
 * against AA and hinting drift, and it wins or loses that flip per platform.
 *
 * The incident that priced it: on 2026-08-03 the `black` arm reached the wordmark's baked
 * pose bitmap only through a rim on the glyph edges — 6,766 px, ratio 0.0390. That reds
 * darwin's 0.017 soul floor and PASSES linux's 0.05, so the arm read verified locally and
 * went green on the only platform CI runs (run 30799424855). Nothing in the grading could
 * tell that row from a row that bit by a mile. Now it can, and it says so by name.
 * Root cause + cure: evidence/w3/selfdelta-wordmark-arm-cure.txt.
 *
 * STRICTLY AN ADDITION. Every row that failed before still fails, identically; this only
 * moves rows OUT of `ok`, never into it — so "fix the ARM, never the grading" stands, since
 * the remedy for a faint row is a stronger delta, never a smaller number here.
 *
 * Playwright CEILS its printed ratio to 2dp, so the number graded is an UPPER bound on the
 * real one: a row that fails this floor fails it on the compare's own most generous reading.
 */
const MIN_ARM_RATIO = 0.1;

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
    const m = r.messages.map((x) => MAGNITUDE.exec(x ?? "")).find(Boolean);
    const ratio = m ? Number(m[2]) : null;
    const magnitude = m ? ` — ${m[1]} px, ratio ${m[2]}` : "";
    // The two classes the floor adds, both of them subsets of "red at the compare" — the
    // rows that USED to be `ok` on the strength of the red alone.
    const mute = red && atCompare && ratio === null;
    const faint = red && atCompare && ratio !== null && ratio < MIN_ARM_RATIO;
    const ok = red && atCompare && !mute && !faint;
    const verdict = !red
      ? "GREEN — THE DELTA DID NOT BITE"
      : !atCompare
        ? "RED, BUT NOT AT THE COMPARE"
        : mute
          ? "RED AT THE COMPARE, STATING NO MAGNITUDE"
          : faint
            ? `BIT, BUT INSIDE THE BLIND BAND${magnitude} < ${MIN_ARM_RATIO}`
            : `red at the compare${magnitude}`;
    console.log(`  ${ok ? "ok  " : "FAIL"} ${r.title}\n       ${verdict}`);
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
    else if (mute)
      failures.push(
        `[${arm}] ${r.title}: red at the compare but it stated no ratio, so the delta's ` +
          `magnitude is unknown — a row that can't state how hard it bit can't prove it bit ` +
          `hard enough to be a proof. First error: ${oneLine(r.messages[0])}`,
      );
    else if (faint)
      failures.push(
        `[${arm}] ${r.title}: BIT, BUT INSIDE THE BLIND BAND — ratio ${m[2]} is under the ` +
          `${MIN_ARM_RATIO} floor (2× the coarsest floor the estate enforces). A delta this ` +
          `faint reds on a tight floor and goes GREEN on a coarse one, which is how the ` +
          `2026-08-03 wordmark row shipped; make the ARM bite harder.`,
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
    `its toHaveScreenshot and clear of the ${MIN_ARM_RATIO} blind-band floor. The golden ` +
    `compare still compares.`,
);
process.exit(0);
