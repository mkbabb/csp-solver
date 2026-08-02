#!/usr/bin/env node
// T5-W1.13 — THE MAGNITUDE REPORT (the blind-band cure).
//
// The band, from r3/goldens-estate §5.2 H3:
//
//     darwin soul floor   0.017
//     observed drift      0.03   ← logo-light (3,948 px) AND toggle-crest-dark (1,028/1,194 px)
//     linux clause floor  0.05   ← the sun-crest clause, and the ONLY platform CI runs
//
// Between 0.017 and 0.05 the two clause-relaxed goldens are green on the runner AND
// SILENT: Playwright prints "N pixels (ratio R …)" only when an assertion fails, so a
// green run bans its own measurement. Seventeen consecutive linux greens therefore say
// nothing about a 0.03 drift — the estate records a verdict where it should record a
// magnitude, and throws away the number.
//
// This is not a gate. It changes no floor, mints no baseline, adds no engine. It runs the
// two clause-relaxed goldens a second time with GOLDEN_MAGNITUDE=1 — which asserts them at
// maxDiffPixelRatio 0, a strictly TIGHTER floor that cannot manufacture a green — and
// prints the ratio Playwright then reports. Same capture, same helpers, same per-pixel
// `threshold: 0.3`, so the number is on the identical scale as the floors it is read
// against.
//
// EXIT CODE: 0 whenever both goldens yield a measurement, WHATEVER the magnitude — a drift
// is reported, never enforced (the floors alone gate, in the step before this one). Exit 1
// only when the instrument itself fails to measure, because a silent instrument is the
// defect this row exists to kill.
//
// Run: node scripts/golden-magnitude.mjs   [PLAYWRIGHT_BASE_URL=… to reuse a served app]

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const FRONTEND_ROOT = fileURLToPath(new URL("..", import.meta.url));

// The two clause-relaxed goldens, and the floors in force for each platform. Mirrors
// visual-golden.spec.ts LOGO_FLOOR/CREST_FLOOR — re-derived here, not imported, because a
// spec import would register its tests; the values are asserted against the spec text below.
const SOUL_FLOOR = 0.017;
const CLAUSE_FLOOR = 0.05;
const GOLDENS = [
  { key: "logo-light", match: "logo wordmark" },
  { key: "toggle-crest-dark", match: "toggle crest" },
];
const floorFor = () => (process.platform === "linux" ? CLAUSE_FLOOR : SOUL_FLOOR);

const run = spawnSync(
  "npx",
  [
    "playwright",
    "test",
    "--config",
    "playwright-golden.config.ts",
    "--reporter=json",
    "-g",
    GOLDENS.map((g) => g.match).join("|"),
  ],
  {
    cwd: FRONTEND_ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, GOLDEN_MAGNITUDE: "1", PW_TEST_HTML_REPORT_OPEN: "never" },
  },
);

/** The JSON reporter writes one object to stdout; anything else means it never ran. */
function parseReport(stdout) {
  const start = stdout.indexOf("{");
  if (start < 0) return null;
  try {
    return JSON.parse(stdout.slice(start));
  } catch {
    return null;
  }
}

/** Flatten suites → [{title, status, messages[]}]. */
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

const report = parseReport(run.stdout ?? "");
const specs = report ? flatten(report) : [];

console.log(
  "[golden-magnitude] T5-W1.13 — REPORT ONLY. No floor changes; no baseline is written.",
);
console.log(
  `  platform ${process.platform} · floors in force: logo-light ${floorFor()} · ` +
    `toggle-crest-dark ${floorFor()}  (linux ${CLAUSE_FLOOR} = the sun-crest clause; darwin soul ${SOUL_FLOOR})`,
);
console.log(
  floorFor() > SOUL_FLOOR
    ? `  blind band on this platform: [${SOUL_FLOOR}, ${floorFor()}) — a drift in here is GREEN and, ` +
        `without this step, unprinted. This is the platform CI runs.`
    : `  no blind band on this platform: the floor IS the soul floor ${SOUL_FLOOR}. The band is a ` +
        `linux phenomenon [${SOUL_FLOOR}, ${CLAUSE_FLOOR}); here the magnitude is printed anyway, ` +
        `so darwin and linux logs read on one scale.`,
);
console.log(
  `  measured with GOLDEN_MAGNITUDE=1 (assert at ratio 0) against the committed ` +
    `*-${process.platform}.png baselines.\n`,
);

// Playwright prints the ratio CEILED to two decimals — 1,028 px of a 220×220 crop is
// 0.0212 and prints "0.03". Every "0.03" in the campaign's banked logs is therefore
// (0.02, 0.03], a whole floor's width of ambiguity. So the exact ratio is recomputed here
// from the baseline's own IHDR geometry, and both numbers are printed: the exact one to
// read against the floors, Playwright's to reconcile with the record.
function baselinePixels(key) {
  const p = join(FRONTEND_ROOT, "e2e", "goldens", `${key}-${process.platform}.png`);
  const b = readFileSync(p); // IHDR is fixed-offset: width at 16, height at 20
  return {
    px: b.readUInt32BE(16) * b.readUInt32BE(20),
    w: b.readUInt32BE(16),
    h: b.readUInt32BE(20),
  };
}

const RATIO = /(\d[\d,]*) pixels \(ratio ([\d.]+) of all image pixels\) are different/g;
const rows = [];
let unmeasured = 0;

for (const g of GOLDENS) {
  const spec = specs.find((s) => s.title.includes(g.match));
  if (!spec) {
    rows.push({
      key: g.key,
      reading: "NOT RUN — the instrument never reached this golden",
    });
    unmeasured++;
    continue;
  }
  // Every capture attempt logs its own count (toHaveScreenshot re-captures until two
  // frames agree). The FIRST match is the comparison's verdict; the rest are the spread —
  // and the spread is the CH-42 hypothesis (settle race vs load) in one run.
  const hits = spec.messages.flatMap((m) => [...m.matchAll(RATIO)]);
  if (hits.length > 0) {
    const geom = baselinePixels(g.key);
    const counts = hits.map((h) => Number(h[1].replace(/,/g, "")));
    const ratio = counts[0] / geom.px;
    const floor = floorFor();
    const reading =
      ratio >= floor
        ? `OVER THE FLOOR ${floor} — the gate itself reds`
        : ratio >= SOUL_FLOOR
          ? `BLIND BAND — green at ${floor}, would red at the ${SOUL_FLOOR} soul floor`
          : `under the ${SOUL_FLOOR} soul floor`;
    rows.push({
      key: g.key,
      ratio,
      pwPrint: hits[0][2],
      px: counts[0],
      geom: `${geom.w}×${geom.h}`,
      spread:
        counts.length > 1
          ? `${Math.min(...counts)}…${Math.max(...counts)} (n=${counts.length})`
          : "—",
      spreadRatio: counts.length > 1 ? Math.max(...counts) / geom.px : null,
      reading,
    });
  } else if (spec.status.includes("passed")) {
    // Asserted at ratio 0 and passed → not one pixel differs.
    const geom = baselinePixels(g.key);
    rows.push({
      key: g.key,
      ratio: 0,
      pwPrint: "—",
      px: 0,
      geom: `${geom.w}×${geom.h}`,
      spread: "—",
      spreadRatio: null,
      reading: "byte-for-byte identical to the baseline",
    });
  } else {
    rows.push({
      key: g.key,
      reading: `NO MAGNITUDE — status ${spec.status}: ${(spec.messages[0] ?? "").split("\n")[0].slice(0, 160)}`,
    });
    unmeasured++;
  }
}

const w = Math.max(...GOLDENS.map((g) => g.key.length));
console.log(
  `  ${"golden".padEnd(w)}   exact    pw     px      baseline    attempts min…max   reading`,
);
for (const r of rows) {
  console.log(
    `  ${r.key.padEnd(w)}   ${(r.ratio === undefined ? "—" : r.ratio.toFixed(4)).padStart(6)}  ` +
      `${(r.pwPrint ?? "—").padStart(4)}  ${(r.px === undefined ? "—" : String(r.px)).padStart(6)}  ` +
      `${(r.geom ?? "—").padStart(9)}  ${(r.spread ?? "—").padStart(16)}   ${r.reading}`,
  );
  if (
    r.spreadRatio !== null &&
    r.spreadRatio !== undefined &&
    r.spreadRatio >= SOUL_FLOOR &&
    r.ratio < SOUL_FLOOR
  ) {
    console.log(
      `  ${" ".repeat(w)}   ↳ worst attempt ${r.spreadRatio.toFixed(4)} crosses the ${SOUL_FLOOR} soul ` +
        `floor while the verdict attempt did not — the CH-42 signal, non-convergence, in one run.`,
    );
  }
}

// One grep-able line so a run's magnitudes can be collected across the campaign without
// re-reading the log prose.
console.log(
  `\n[golden-magnitude] JSON ${JSON.stringify({
    platform: process.platform,
    floor: floorFor(),
    soulFloor: SOUL_FLOOR,
    measured: Object.fromEntries(
      rows.map((r) => [
        r.key,
        r.ratio === undefined
          ? null
          : { ratio: Number(r.ratio.toFixed(5)), px: r.px, worst: r.spreadRatio },
      ]),
    ),
  })}`,
);

if (unmeasured > 0) {
  console.error(
    `\n[golden-magnitude] INSTRUMENT FAILED — ${unmeasured} of ${GOLDENS.length} goldens yielded no ` +
      `magnitude. A silent instrument is the defect this step exists to kill, so this is a red.`,
  );
  if (!report) {
    console.error(
      `  playwright exit ${run.status}; stderr:\n${(run.stderr ?? "").slice(0, 2000)}`,
    );
  }
  process.exit(1);
}

console.log(
  `\n[golden-magnitude] reported ${rows.length}/${GOLDENS.length}. Magnitudes are REPORTED, never ` +
    `enforced here — the floors gate in the step before this one.`,
);
process.exit(0);
