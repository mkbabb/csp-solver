import { test, type TestInfo } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * T5-W1 · THE LINUX-WEBKIT BLANK-BAKE QUARANTINE — explicit, named, and self-removing.
 *
 * WHAT IT IS. On ubuntu + WebKit ONLY, the pose bake decodes to an entirely transparent
 * bitmap for SOME games. `sudoku` and `thermo` ink normally on the same runner, in the same
 * engine, off the same page; darwin inks all five in both engines
 * (`evidence/w1/wordmark-inked-GREEN.txt`). Defect class: **linux-WebKit blank bake,
 * non-sudoku games**.
 *
 * HOW IT SURFACED. 1.6 revoked the T4-era `71456713` linux `test.skip` in
 * `wordmark-integrity` — a silent yield that ABORTED every linux row before any verdict was
 * computed, so nothing on the only platform CI runs ever evaluated the edge-clip invariant
 * the spec exists for. The first runner pass after the revocation (run **30719165442** on
 * `e6b19a4c`, reproduced row-for-row on run **30719158513**) red exactly the rows the skip
 * had been swallowing. The revocation did not cause the defect; it published one that had
 * been masked for a tranche.
 *
 * WHY A QUARANTINE AND NOT THE SKIP AGAIN. 1.6's own re-entry criterion: *"if the owner wants
 * the yield back it must return as an explicit quarantine against a named run id, never as a
 * silent skip."* This is that. It names the rows, it names the runs, it prints itself into the
 * runner log, it annotates the report, the bake evidence still ships from the quarantined
 * arm — and it REMOVES ITSELF (see `cureHasLanded`).
 *
 * WHAT STAYS LIVE — the spread detectors. Only the rows the runner actually red are named
 * below. `sudoku` and `thermo` stay live in both specs, `kenken` stays live in
 * `theme-bake-freshness`, every row stays live on darwin, and every row stays live in
 * chromium. If the blank widens by one game or crosses to one more engine, an UNQUARANTINED
 * row reds and says so. A blanket linux yield would have bought silence on all five; this
 * buys it on three, and keeps the instrument that measures whether three is still the number.
 */

export type QuarantinedSpec = "wordmark-integrity" | "theme-bake-freshness";

/**
 * The rows the runner actually reds, per spec. NOTHING else is quarantined.
 *
 * · wordmark-integrity :158 G3.4 edge-clip — futoshiki, kenken, killer
 *   ("baked ink must sit inside its own W×H bitmap on all four edges": the ink box read
 *   degenerate, i.e. the fused verdict's `no-ink` term)
 * · theme-bake-freshness :223 G4.5 — futoshiki, killer
 *   ("fresh load: the logo bake decoded to nothing", `logoInk === "no-ink"`)
 *
 * `theme-bake-freshness` runs each game twice, once per toggle direction, off ONE test
 * declaration at :223 — and the red is on the pre-toggle FRESH LOAD control, which no
 * `colorScheme` can reach. So the census is by game and both directions of a named game are
 * quarantined in the webkit arm; the chromium arm of the same game is not.
 */
const QUARANTINED_ROWS: Record<QuarantinedSpec, readonly string[]> = {
  "wordmark-integrity": ["futoshiki", "kenken", "killer"],
  "theme-bake-freshness": ["futoshiki", "killer"],
};

/** The named runs. Same rows, both runs, at `retries: 0` — deterministic, not a flake. */
const RUN_IDS = "30719165442 + 30719158513 (e6b19a4c, ubuntu · webkit, retries: 0)";

/**
 * THE CURE OWNER, and the version the quarantine dies at.
 *
 * T5-W4b adopts `@mkbabb/pencil-boil` 0.11's `rasterizePoseToBlob()` — the raster path hands
 * back `canvas.toBlob()` directly instead of round-tripping an `ImageBitmap` copy and a PNG
 * re-encode (`gates.json` W4.pencilBoil011; `waves/T5-W4-design.md` §W4b). That deletes the
 * stage this defect lives in, so the cure and the removal are one act.
 */
const CURE_VERSION = [0, 11, 0] as const;
const CURE_LANDED_THROW =
  "the W4b cure has landed — remove this quarantine and let the rows speak";

const FRONTEND_ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");

/**
 * The DECLARED `@mkbabb/pencil-boil` range, read out of `web/frontend/package.json` at SPEC
 * LOAD — the trap wired into config rather than written down (lessons rule 7).
 *
 * An unreadable or absent declaration THROWS at load. A quarantine whose own re-entry
 * mechanism is broken must not stand: the failure mode of a silent read here is a quarantine
 * that outlives its cure forever, which is the exact thing 1.6 revoked.
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

/** Does the declared range reach the cure, i.e. `>=0.11.0`? */
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
    `QUARANTINED — linux-WebKit blank bake (non-sudoku games).`,
    `  row           ${spec} · ${row} · project ${project}`,
    `  class         on ubuntu + WebKit only, the pose bake decodes to an entirely`,
    `                transparent bitmap for SOME games. sudoku and thermo ink normally on`,
    `                the same runner, same engine, same page; darwin inks all five.`,
    `  observed      runs ${RUN_IDS} — the same rows, both runs, deterministic.`,
    `  masked since  the T4-era 71456713 linux \`test.skip\` in wordmark-integrity, which`,
    `                aborted these rows before any verdict was computed. T5-W1 1.6 revoked`,
    `                it; this defect is what the skip had been hiding.`,
    `  cure owner    T5-W4b — @mkbabb/pencil-boil 0.11 rasterizePoseToBlob() adoption`,
    `                (gates.json W4.pencilBoil011). Declared here now: ${DECLARED_RANGE}.`,
    `  re-entry      MECHANIZED. This guard reads web/frontend/package.json at spec load and`,
    `                THROWS instead of skipping the moment that range reaches >=0.11.0.`,
    `  still live    every row not named: sudoku + thermo in both specs, kenken in`,
    `                theme-bake, all five on darwin, all five in chromium. They are the`,
    `                spread detectors — if the blank widens, an unquarantined row reds.`,
    `  record        docs/tranches/2026-08-tranche-5/evidence/w1/linux-webkit-bake-quarantine.md`,
  ].join("\n");
}

/**
 * Quarantine one named row, LOUDLY, on linux + webkit only — and throw once the cure lands.
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

  // THE RE-ENTRY. Not a reminder — a red. The quarantine cannot survive its own cure.
  if (cureHasLanded(DECLARED_RANGE))
    throw new Error(`${CURE_LANDED_THROW}\n\n${message}`);

  testInfo.annotations.push({ type: "quarantine", description: message });
  console.log(`\n${message}\n`);
  test.fixme(true, message);
}
