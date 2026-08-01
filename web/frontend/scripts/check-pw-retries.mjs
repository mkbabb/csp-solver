#!/usr/bin/env node
/**
 * check-pw-retries.mjs — T5-W1 1.6. THE RETRIES POLICY, enforced rather than written down.
 *
 * The ruling this gate carries (playwright-throttle.config.ts, head docstring): a retried pass
 * never greens a lane. Before T5-W1 that was true of nothing — `grep -rn failOnFlakyTests
 * *.config.ts` returned zero across all three configs while two projects carried `retries: 1`,
 * and run 30690204551 had already cashed it: `wordmark-webkit`'s `sudoku` row red on attempt 1,
 * green on attempt 2, reported flaky, lane exit 0.
 *
 * A ruling that lives only in a comment is re-litigated by the next person who adds a retry to
 * quiet a red. So the ruling and its enforcement land together:
 *
 *   1 THE LAW      — any config granting a retry must declare `failOnFlakyTests: true`.
 *   2 THE CENSUS   — every non-zero retry is a NAMED grant with its class and its reason. An
 *                    ungranted retry reds; a grant whose value drifted reds; a grant whose
 *                    project no longer exists reds (no fossils).
 *   3 THE REVOKED  — `wordmark-webkit` stays at 0. Its grant was written for the empty pose
 *                    blob and 71456713 measured that a retry cannot clear it (the blob is
 *                    terminal; 3 of 4 rows failed the second attempt too), while on the
 *                    deterministic half it laundered a real red into a flaky-green.
 *   4 NO OPT-OUT   — `failOnFlakyTests: false` is never declared. Absent is allowed only where
 *                    no retry is granted (check 1 already covers the rest); false is a choice.
 *
 * The configs are READ THROUGH THEIR OWN MODULE — `import()` of the actual `defineConfig`
 * export, not a regex over the source. A comment cannot satisfy this gate and a reformat
 * cannot break it.
 *
 * `--self-test` re-runs all four checks against synthetic censuses that violate each one, and
 * fails if any check stays green. The gate proves it can bite on every run, not just once.
 *
 * Exit 0 green, 1 with every violation printed. No `continue-on-error`, no `|| true`.
 */
import { pathToFileURL } from "node:url";
import { resolve, basename } from "node:path";
import process from "node:process";

const CONFIGS = [
  "playwright.config.ts",
  "playwright-golden.config.ts",
  "playwright-throttle.config.ts",
];

/**
 * The closed set of retry grants. A retry that is not here is not sanctioned.
 * Keyed `<config basename>::<project name>`; `::<top-level>` for a config-scope retries.
 */
const GRANTS = {
  "playwright-throttle.config.ts::throttled-void": {
    retries: 1,
    class: "2 — resource contention under a deliberate throttle",
    why:
      "The D3 probe races a 30 KB/s + 500 ms budget on a shared runner; one host stall is not " +
      "a product defect. Kept at T5-W1 1.6 and no longer green-buying: under failOnFlakyTests " +
      "the second attempt is a second OBSERVATION, not a pass.",
  },
};

/** Projects whose retries are pinned to 0 by a ruling, with the ruling cited. */
const REVOKED = {
  "playwright-throttle.config.ts::wordmark-webkit":
    "T5-W1 1.6 class 1 — granted for the empty pose blob, which 71456713 measured a retry " +
    "cannot clear (terminal blob; 3 of 4 rows failed attempt 2). On the deterministic half it " +
    "converted a genuine one-shot edge-clip red into the flaky-green run 30690204551 recorded.",
};

/** `{ config, project|null, retries, failOnFlakyTests }` rows — the census the checks read. */
async function census(configFiles, root = process.cwd()) {
  const rows = [];
  for (const file of configFiles) {
    const mod = await import(pathToFileURL(resolve(root, file)).href);
    const cfg = mod.default ?? {};
    const name = basename(file);
    const fof = cfg.failOnFlakyTests;
    const top = cfg.retries ?? 0;
    rows.push({ config: name, project: null, retries: top, failOnFlakyTests: fof });
    for (const p of cfg.projects ?? [])
      rows.push({
        config: name,
        project: p.name,
        retries: p.retries ?? top,
        failOnFlakyTests: fof,
      });
  }
  return rows;
}

const key = (r) => `${r.config}::${r.project ?? "<top-level>"}`;

// ── the four checks: pure functions over a census, so --self-test can feed them anything ──

function checkLaw(rows) {
  const bad = [];
  const byConfig = new Map();
  for (const r of rows) {
    const e = byConfig.get(r.config) ?? { fof: r.failOnFlakyTests, grants: [] };
    if (r.retries > 0) e.grants.push(key(r));
    byConfig.set(r.config, e);
  }
  for (const [config, e] of byConfig)
    if (e.grants.length && e.fof !== true)
      bad.push(
        `${config}: grants retries (${e.grants.join(", ")}) but failOnFlakyTests is ` +
          `${String(e.fof)} — a retried pass would exit 0.`,
      );
  return bad;
}

function checkCensus(rows) {
  const bad = [];
  const seen = new Set();
  for (const r of rows) {
    if (r.retries <= 0) continue;
    const k = key(r);
    seen.add(k);
    const g = GRANTS[k];
    if (!g) {
      bad.push(
        `${k}: retries=${r.retries} is an UNGRANTED retry — add it to GRANTS with its class and reason, or set 0.`,
      );
      continue;
    }
    if (g.retries !== r.retries)
      bad.push(
        `${k}: retries=${r.retries} but the grant records ${g.retries} — the grant drifted.`,
      );
  }
  for (const k of Object.keys(GRANTS))
    if (!seen.has(k))
      bad.push(
        `${k}: a GRANTS entry with no live non-zero retry — a fossil grant; delete it.`,
      );
  return bad;
}

function checkRevoked(rows) {
  const bad = [];
  const byKey = new Map(rows.map((r) => [key(r), r]));
  for (const [k, why] of Object.entries(REVOKED)) {
    const r = byKey.get(k);
    if (!r) {
      bad.push(
        `${k}: pinned to retries 0 by a ruling, but the project is gone — re-argue or drop the pin.`,
      );
      continue;
    }
    if (r.retries !== 0)
      bad.push(`${k}: retries=${r.retries}, but the grant is REVOKED. ${why}`);
  }
  return bad;
}

function checkNoOptOut(rows) {
  const bad = [];
  for (const r of rows)
    if (r.project === null && r.failOnFlakyTests === false)
      bad.push(
        `${r.config}: failOnFlakyTests is declared FALSE — flaky-green is opted into by hand.`,
      );
  return bad;
}

const CHECKS = [
  ["1 THE LAW      retries imply failOnFlakyTests", checkLaw],
  ["2 THE CENSUS   every retry is a named grant", checkCensus],
  ["3 THE REVOKED  wordmark-webkit stays at 0", checkRevoked],
  ["4 NO OPT-OUT   failOnFlakyTests is never false", checkNoOptOut],
];

// ── the self-test: each check must go RED against a census built to violate it ──

const T = (config, project, retries, fof) => ({
  config,
  project,
  retries,
  failOnFlakyTests: fof,
});
const HEALTHY = [
  T("playwright-throttle.config.ts", null, 0, true),
  T("playwright-throttle.config.ts", "throttled-void", 1, true),
  T("playwright-throttle.config.ts", "wordmark-webkit", 0, true),
];
const CANARIES = [
  ["1 THE LAW", checkLaw, HEALTHY.map((r) => ({ ...r, failOnFlakyTests: undefined }))],
  [
    "2 THE CENSUS",
    checkCensus,
    [...HEALTHY, T("playwright-throttle.config.ts", "filter-census-webkit", 2, true)],
  ],
  [
    "3 THE REVOKED",
    checkRevoked,
    HEALTHY.map((r) => (r.project === "wordmark-webkit" ? { ...r, retries: 1 } : r)),
  ],
  [
    "4 NO OPT-OUT",
    checkNoOptOut,
    HEALTHY.map((r) => ({ ...r, failOnFlakyTests: false })),
  ],
];

function selfTest() {
  const dead = [];
  for (const [name, fn, bad] of CANARIES) {
    const out = fn(bad);
    console.log(
      `  canary ${name.padEnd(14)} → ${out.length ? `RED (${out.length})` : "STAYED GREEN"}`,
    );
    if (!out.length) dead.push(name);
  }
  // The healthy census must also pass every check, or the canaries prove nothing.
  for (const [name, fn] of CHECKS) {
    const out = fn(HEALTHY);
    if (out.length) dead.push(`${name} reds on the HEALTHY census: ${out.join("; ")}`);
  }
  return dead;
}

const main = async () => {
  const wantSelfTest = process.argv.includes("--self-test");
  let failed = false;

  if (wantSelfTest) {
    console.log("SELF-TEST — every check re-run against a census built to violate it");
    const dead = selfTest();
    if (dead.length) {
      console.error("\nDEAD CHECKS (a gate that cannot fail is not a gate):");
      for (const d of dead) console.error(`  · ${d}`);
      failed = true;
    }
    console.log("");
  }

  const rows = await census(CONFIGS);
  console.log("RETRIES CENSUS");
  for (const r of rows)
    console.log(
      `  ${key(r).padEnd(52)} retries=${r.retries}  failOnFlakyTests=${String(r.failOnFlakyTests)}`,
    );
  console.log("");

  for (const [name, fn] of CHECKS) {
    const bad = fn(rows);
    console.log(`  ${bad.length ? "RED  " : "green"} ${name}`);
    for (const b of bad) console.error(`         · ${b}`);
    if (bad.length) failed = true;
  }

  if (failed) {
    console.error("\ncheck-pw-retries: FAILED");
    process.exit(1);
  }
  console.log("\ncheck-pw-retries: all checks green");
};

main().catch((e) => {
  console.error(`check-pw-retries: ${e?.stack ?? e}`);
  process.exit(1);
});
