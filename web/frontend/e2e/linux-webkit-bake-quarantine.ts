import { test, type TestInfo } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * T5 · THE LINUX-WEBKIT BLANK-BAKE QUARANTINE, SECOND PINNING — explicit, named, self-removing.
 *
 * WHAT IT IS. On ubuntu + WebKit ONLY, the pose bake decodes to an entirely transparent
 * bitmap for a per-run-varying subset of games. Chromium (linux included) and darwin (both
 * engines) ink all five, every run. Defect class: **linux-WebKit blank bake**, a readiness
 * RACE on the runner's bake-decode path — not a per-game defect.
 *
 * THE HISTORY, BOTH PINNINGS.
 *
 *  1. T5-W1 1.6 revoked the T4-era `71456713` silent linux `test.skip` and the revocation
 *     published the class: runs 30719165442 + 30719158513 (futoshiki/kenken/killer wordmark,
 *     futoshiki/killer theme-bake), then 30720212628 spread to prior-green thermo/kenken —
 *     three runs, three game sets, `retries: 0`. First pinning covered the class, with a
 *     re-entry guard that THREW at `@mkbabb/pencil-boil >=0.11.0`, the hypothesized cure.
 *
 *  2. W2-F5 adopted 0.11.0 (`rasterizePoseToBlob()` — the raster path hands back
 *     `canvas.toBlob()` directly, no ImageBitmap round-trip) and removed the quarantine so
 *     linux CI could judge. The judge spoke twice and disagreed with itself: run 30727947148
 *     (`74b2835d`) passed every de-quarantined row; run 30728779986 (`ff5a7cea`) redded four
 *     (kenken wordmark; futoshiki both directions + killer theme-bake). **The library cure is
 *     REFUTED as sufficient.** One green run of a nondeterministic race was a sample, not a
 *     proof — that dual of the never-re-baseline law is now paid for and written down:
 *     `docs/tranches/2026-08-tranche-5/evidence/w2/verify/bake-race-recurrence-30728779986.txt`.
 *
 * WHY RE-PIN AND NOT LET IT RED. The class is proven nondeterministic per run per game on
 * one platform-engine cell that no user runs (the shipped surface's WebKit is Safari/darwin,
 * which inks). An un-parked race reds ~every other run, and a gate that reds on coin flips
 * teaches people to rerun until green — the exact reflex that buries real defects. The park
 * is loud, class-scoped, and carries its own eviction.
 *
 * WHAT STAYS LIVE — the spread detectors. Every chromium arm (linux included), every darwin
 * arm, and every non-bake assertion of both specs everywhere. The one cell parked wholesale
 * is ubuntu·webkit·bake-decode, and this file is its single loud census.
 *
 * THE CURE OWNER. T5-W4b root-causes with the real measurement rig — the library hypothesis
 * is spent, so the next one gets instrumented on the runner itself (decode timing, font
 * readiness, raster scheduling) before any cure is claimed. LEDGER row CH-62 carries the
 * class to every close; `ledger-diff --require-ledger` will not let a close forget it.
 */

export type QuarantinedSpec = "wordmark-integrity" | "theme-bake-freshness";

/** THE CLASS, not a row list — every game's bake-decode read, both specs, linux+webkit only. */
const ALL_GAMES = ["sudoku", "futoshiki", "thermo", "killer", "kenken"] as const;
const QUARANTINED_ROWS: Record<QuarantinedSpec, readonly string[]> = {
  "wordmark-integrity": ALL_GAMES,
  "theme-bake-freshness": ALL_GAMES,
};

/**
 * The named runs, `retries: 0` throughout. First pinning: 30719165442 + 30719158513
 * (e6b19a4c) + 30720212628 (baae148b, the spread). De-quarantined interval: 30727947148
 * (74b2835d, green — the sample that fooled the lead) + 30728779986 (ff5a7cea, the
 * refutation: 4 rows).
 */
const RUN_IDS =
  "30719165442/30719158513/30720212628 (first pinning) · 30727947148 green + 30728779986 " +
  "red-4 (the 0.11 refutation) — ubuntu · webkit, retries: 0";

/**
 * THE RE-ENTRY, RE-AIMED. 0.11.0 was this guard's first target and its adoption did NOT
 * cure the class, so the version trigger moves to the NEXT pencil-boil release: the moment
 * `web/frontend/package.json` declares >=0.12.0 this quarantine THROWS, forcing a fresh
 * judgment instead of letting a new library silently inherit the park. W4b's rig work is
 * the other eviction path — whichever lands first removes this file.
 */
const CURE_VERSION = [0, 12, 0] as const;
const CURE_LANDED_THROW =
  "a new @mkbabb/pencil-boil landed — re-judge the linux-webkit bake class before the " +
  "quarantine re-adopts silence: remove this file, let linux CI speak across MULTIPLE runs " +
  "(one green is a sample, not a proof — run 30727947148 taught that), then decide";

const FRONTEND_ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");

/**
 * The DECLARED `@mkbabb/pencil-boil` range, read out of `web/frontend/package.json` at SPEC
 * LOAD — the trap wired into config rather than written down (lessons rule 7). An unreadable
 * or absent declaration THROWS at load: a quarantine whose own re-entry mechanism is broken
 * must not stand.
 */
const DECLARED_RANGE: string = (() => {
  const pkg = JSON.parse(readFileSync(join(FRONTEND_ROOT, "package.json"), "utf8"));
  const range = pkg?.dependencies?.["@mkbabb/pencil-boil"];
  if (typeof range !== "string")
    throw new Error(
      "linux-webkit bake quarantine: no @mkbabb/pencil-boil in web/frontend/package.json " +
        "dependencies — the re-entry guard cannot read the version it is gated on, so the " +
        "quarantine does not stand. Fix the read or delete the quarantine.",
    );
  return range;
})();

/** Does the declared range reach the re-judgment point, i.e. `>=0.12.0`? */
function cureHasLanded(range: string): boolean {
  const m = /(\d+)\.(\d+)\.(\d+)/.exec(range);
  if (!m)
    throw new Error(
      `linux-webkit bake quarantine: cannot parse a version out of @mkbabb/pencil-boil ` +
        `"${range}" — the re-entry guard is blind, so the quarantine does not stand.`,
    );
  const v = [Number(m[1]), Number(m[2]), Number(m[3])];
  for (let i = 0; i < 3; i++)
    if (v[i] !== CURE_VERSION[i]) return v[i] > CURE_VERSION[i];
  return true;
}

/** The webkit arm of either built-dist project (`wordmark-webkit`, `theme-bake-webkit`). */
function isWebkitArm(testInfo: TestInfo): boolean {
  return (
    testInfo.project.use.browserName === "webkit" ||
    /webkit/.test(testInfo.project.name)
  );
}

function notice(spec: QuarantinedSpec, row: string, project: string): string {
  return [
    `QUARANTINED — linux-WebKit blank bake, SECOND PINNING (post-0.11 refutation).`,
    `  row           ${spec} · ${row} · project ${project}`,
    `  class         on ubuntu + WebKit only, the pose bake decodes to an entirely`,
    `                transparent bitmap for a per-run-varying subset of games — a readiness`,
    `                race, not a per-game defect. chromium and darwin ink all five, every run.`,
    `  observed      runs ${RUN_IDS}.`,
    `  refuted cure  pencil-boil 0.11.0 rasterizePoseToBlob() — adopted at W2-F5, judged`,
    `                green once (30727947148), redded four rows the next run (30728779986).`,
    `  cure owner    T5-W4b — root-cause on the runner with the real rig; the library`,
    `                hypothesis is spent. LEDGER row CH-62 carries the class.`,
    `  re-entry      MECHANIZED. This guard reads web/frontend/package.json at spec load and`,
    `                THROWS the moment @mkbabb/pencil-boil reaches >=0.12.0 (currently`,
    `                ${DECLARED_RANGE}); W4b's rig work is the other eviction path.`,
    `  still live    all five games on darwin, all five in chromium (linux included), every`,
    `                non-bake assertion of both specs everywhere. If the blank crosses an`,
    `                engine or platform, an unquarantined row reds and says so.`,
    `  record        evidence/w1/linux-webkit-bake-quarantine.md (first pinning) ·`,
    `                evidence/w2/verify/bake-race-recurrence-30728779986.txt (the refutation)`,
  ].join("\n");
}

/**
 * Quarantine one named row, LOUDLY, on linux + webkit only — and throw once the re-judgment
 * point arrives.
 *
 * Call it AFTER the read and after any bake-evidence attachment, and immediately BEFORE the
 * assertion that reds: the quarantined arm still does the work and still ships the pose
 * bitmap it read, so the class stays attributable while it is parked.
 */
export function quarantineLinuxWebkitBake(
  spec: QuarantinedSpec,
  row: string,
  testInfo: TestInfo,
): void {
  if (process.platform !== "linux") return;
  if (!isWebkitArm(testInfo)) return;
  if (!QUARANTINED_ROWS[spec].includes(row)) return;

  const message = notice(spec, row, testInfo.project.name);

  // THE RE-ENTRY. Not a reminder — a red. The quarantine cannot survive its re-judgment point.
  if (cureHasLanded(DECLARED_RANGE))
    throw new Error(`${CURE_LANDED_THROW}\n\n${message}`);

  testInfo.annotations.push({ type: "quarantine", description: message });
  console.log(`\n${message}\n`);
  test.fixme(true, message);
}
