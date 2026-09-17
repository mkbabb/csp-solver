#!/usr/bin/env node
// LANE NOTE (T9-W5 §5.2 retires the NOT-A-LANE claim): the browser-executing CI lanes died on the owner's ruling of 2026-08-03 (docs/tranches/2026-08-tranche-7/DISPOSITIONS.md row O-12) and the Playwright SUITES remain local instruments — but this lint executes no browser: it parses playwright configs + spec files and grades the project matrix and the stamped e2e count floors, so it rides the fe-unit lane browserlessly.
// T5-W1 row 1.10 (CH-56) — the Playwright project-matrix lint.
//
// CH-56 is the estate's last single-engine residue, and the thing that made it survivable for a
// whole campaign is that NOTHING watched the matrix. `mobile-*.spec.ts` pinned chromium at file
// scope in T4 for an infrastructure reason (CI installed no webkit); CI gained webkit; the pins
// stayed; 19 tests went on running in one engine and every count in the tranche still read green.
// A narrowing is invisible by construction — the suite passes FASTER when it covers less.
//
// So this gate does not read the config's prose. It asks Playwright itself for the resolved
// matrix (`playwright test --list --reporter=json`, the same resolution the run uses) and the
// config objects for the engine each project declares, then holds both against a manifest that
// has to be edited on purpose. Five checks, all evaluated before the verdict:
//
//   1  DECLARED MATRIX   every config's (project, engine) set is EXACTLY the manifest's — a
//                        project added, dropped, or re-engined reds here.
//   2  SPEC OWNERSHIP    every e2e/*.spec.ts on disk is claimed by exactly ONE config and at
//                        least one project. Orphans and double-claims both red.
//   3  ENGINE COVERAGE   every spec runs under BOTH engines unless it is a declared HOLDOUT,
//                        and a holdout runs under exactly the engines it declares.
//   4  HOLDOUTS CLOSED   the holdout table is a closed set: a stale entry (the spec now runs
//                        wider) reds, so the record follows the code in the same commit. New
//                        entries are a deliberate edit with a cite, never a config default.
//                        AT TWO GRAINS since T9-W6 §6.3 — per FILE against Playwright's
//                        resolution, and per ROW against the spec's own source, because a
//                        `test.skip(browserName === …)` is a runtime decision `--list` counts
//                        as coverage. An undeclared per-row engine skip reds.
//                        AND AT TWO FORMS since the T9-W3+W6 seal: a row goes dark on its
//                        ENGINE (`browserName === …`) or on an ENV GATE
//                        (`process.env.X !== …`), which fires in BOTH engines on every run
//                        that does not set the flag. Both list and neither asserts, so an
//                        undeclared skip of EITHER form reds.
//   5  COUNT FLOORS      per (config, project) LIVE test counts never fall below the floor.
//   6  SPEC MANIFEST     the e2e/*.spec.ts set on disk is EXACTLY SPEC_MANIFEST's.
//   7  QUARANTINES CLOSED every declared quarantine's cited module is still on disk.
//   8  FLOOR BAND        every floor sits at or above 85% of max(stamped census, live), and
//                        the stamp's project set is exactly the declared one.
//
// T7-W6 — checks 6 and 7, and the "LIVE" in check 5:
//
//   · A DELETED SPEC FILE STAYED GREEN (ablation-proven; e2e/drawer.spec.ts, 16 tests, removed
//     from a canary tree: 5/5 checks green, exit 0). Check 2 seeds its claim map from `onDisk`,
//     so a vanished spec is neither an orphan nor a double-claim — it simply stops existing in
//     every model the gate builds. The count floors sat 43–400% under live and absorbed the
//     loss without moving. SPEC_MANIFEST is the fix: a name set that has to be edited on
//     purpose, exactly like CONFIGS and HOLDOUTS. Banked:
//     docs/tranches/2026-08-tranche-7/evidence/w6/pw-manifest-ablation.txt.
//   · THE FLOORS COUNTED QUARANTINED ROWS AS COVERAGE. On ubuntu·webkit the bake quarantine
//     (e2e/linux-webkit-bake-quarantine.ts) `test.fixme`s 5 of wordmark-webkit's 6 rows and
//     ALL 10 of theme-bake-webkit's, so those projects assert 1 and 0 things on the only
//     platform CI runs — while `--list` still counts 6 and 10 and the floors read 6 and 2.
//     A floor is now a floor on LIVE assertions: listed minus the declared quarantine, on the
//     platform the quarantine names. theme-bake-webkit's live floor is therefore 0, and that
//     zero is the point — the gate now PRINTS that the project asserts nothing on linux
//     instead of hiding it behind a floor of 2.
//     T9-W6 §6.1 CLOSED THAT PARK. Both entries above are HISTORY now: the quarantine module
//     is deleted and the QUARANTINES table below is EMPTY. Check 7 stays, and it is the reason
//     the unwind could not be quiet — the module left the tree and this gate redded on the
//     stale subtraction in the same working copy, which is the detector doing its whole job.
//     The 15 rows returned to their projects and the two floors they were subtracted from move
//     with them, through the W5 restamp and not by hand.
//
// T9-W5 §5.2 — check 8, and the floors' new home:
//
//   · THE FLOORS LEFT THIS FILE. They live in `scripts/census.stamp.json`, the ONE stamped
//     census check-unit-count.mjs reads too. CONFIGS below still names every project and the
//     engine it must declare — the part a human has to mean — but carries no number, and
//     check 8 reds if one is smuggled back in.
//   · A FLOOR ALONE CANNOT SEE SLACK GROW. The banked floors were 45% under live (205 of 478
//     rows deletable green at the T9 audit) and checks 1-7 were unanimous about it. Check 8
//     is the instrument: floor >= 85% of max(stamped census, live), so it reds when a floor
//     is hand-lowered, when the stamp is inflated past the tree, and when the estate outgrows
//     its floor unrestamped.
//   · THE RESTAMP ARM'S TRUE DEFECT, FIXED. T7 blamed a data-loop miscount. It is not that:
//     the arm derived floors under a rule the banked floors were never authored under, so on
//     an UNMOVED tree it proposed theme-quadrants 14 -> 12, called that a LOWERING, and
//     exited 1 — the arm could not run at any WGATE without an --allow-lower claiming tests
//     had left when none had. The cure is the ratchet, max(banked, derived), which is the
//     same cure check-coverage-floor.mjs took for the identical problem at T7-W6. It also
//     closes a second hole: floor(11 * 0.9) = 9 sits UNDER ceil(11 * 0.85) = 10, so the plain
//     churn rule could derive a floor its own band rejects. `law.derive` takes the max().
//
// T9-W3+W6 SEAL (2026-09-17) — THE ENV GATE JOINS THE RECORD (prove P-2):
//
//   · THE SUITE REPORTED 4 SKIPS AND THIS GATE MODELLED 2. The two it knew are share-truth's
//     and spoken-controls' clipboard rows, held out of webkit. The other two are ONE row —
//     multiplayer.spec.ts's `test.skip(process.env.T62_REAL_RELAY !== "1", …)` — firing once
//     per engine on every run, because nothing sets the flag. Those two rows counted as LIVE
//     coverage in BOTH engines' census while asserting on no run that ever executes: the exact
//     disease the QUARANTINES comment below names in its own words ("any future park must say
//     so here or the floors will count silence as coverage"), in a form that table cannot hold
//     — the park is keyed by project and platform, and an env gate is neither.
//   · THE SMALLER EXTENSION WON, and this is why. A sibling ENV_GATED table would have needed
//     its own subtraction, its own closure check, its own self-test arm and its own rule for
//     colliding with HOLDOUTS on the same file. The `rows` grain already carries all four: an
//     env-gated row is a `rows` entry with `env` set and `engines: []`, so `rowHoldouts`
//     subtracts it from BOTH engines with no change at all, and check 4's clauses gain the env
//     spelling instead of a fifth table. One table, one grain, one reader.
//   · EFFECT: live 237 chromium / 235 webkit against floors 214 / 212 — both satisfied with
//     room, so no restamp was owed and none was run. The census printer now names WHICH source
//     a shortfall came from (park / row holdout / env gate), because "2 row-held out of webkit"
//     for an engine-agnostic flag sends the next reader to the wrong table entirely.
//
// FLOOR TIMING (W6 §floor timing, binding): the MECHANISM lands in the wave; the NUMBERS
// restamp at WGATE, after the last row lands anywhere in the tranche. A floor derived at a
// wave's own seal is stale on arrival, which is the exact slack these rows exist to remove.
// The figures stamped today are WAVE-TIME truth and say so in the stamp's own note; the band
// is what makes the WGATE's restamp compulsory rather than advisory if the estate has moved.
//
// Run: `node scripts/check-pw-projects.mjs` (npm run test:e2e:projects), cwd web/frontend.
//      `--self-test` re-runs each check against a known-bad matrix and FAILS if any of them
//      passes — the canary. It sabotages the collected model rather than the repo, so it needs
//      no branch and leaves no residue.
//      `--restamp` re-derives the floors from the live census and writes them to
//      scripts/census.stamp.json (WGATE only). `--restamp --dry` prints the diff and writes
//      nothing; on an unmoved tree it must print no movement at all.

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import process from "node:process";

const SELF = fileURLToPath(import.meta.url);
const ROOT = resolve(dirname(SELF), "..");
const E2E = join(ROOT, "e2e");

/* ── the manifest ──────────────────────────────────────────────────────────────
 * Hand-maintained ON PURPOSE, and small on purpose. Everything else in this script is
 * derived from Playwright's own resolution; this table is the part a human has to mean.
 */

/** Playwright's own default when neither the project nor the config names an engine. */
const PW_DEFAULT_ENGINE = "chromium";
const ENGINES = ["chromium", "webkit"];

/** The name the JSON reporter gives a config that declares no `projects`. */
const UNNAMED = "(default)";

/* THE ONE STAMPED CENSUS — read, never hard-coded. It carries every floor, the census each
 * was derived from, and WHEN, so a floor citing a tranche-old SHA is legible as slack rather
 * than as a decision. `--restamp` rewrites it; nothing else may. */
const STAMP_PATH = join(dirname(SELF), "census.stamp.json");
const readStamp = () => JSON.parse(readFileSync(STAMP_PATH, "utf8"));
const STAMP = readStamp();
const LAW = STAMP.law;

/** The stamp's key for a project: the config it belongs to, then its name. */
const key = (file, project) => `${file}::${project}`;
const stampRow = (file, project) => STAMP.pw.projects[key(file, project)];

/** The band's own floor: what `n` live tests oblige, at 85%. */
const bandFloor = (n) => Math.ceil(n * LAW.band);

/**
 * The house derivation, identical in check-unit-count.mjs and stated once in `law.derive`.
 * A project of deliberate arity sits at its exact live count; a bigger one keeps ~10% of
 * churn room, never so much that it falls out of its own band.
 */
const deriveFloor = (live) =>
  live <= LAW.exactAtOrBelow
    ? live
    : Math.max(Math.floor(live * LAW.churnRoom), bandFloor(live));

const FLOOR_STAMP = (() => {
  const s = STAMP.pw.stamp;
  return `${s.sha} · ${s.date} · platform ${s.platform} · ${s.wave}${s.note ? ` · ${s.note}` : ""}`;
})();

/**
 * DECLARED QUARANTINES. A `test.fixme` under a platform/engine condition is a test that
 * LISTS but does not ASSERT, and `--list` cannot tell the two apart. Each entry says how
 * many of a project's listed tests are parked, on which platform, and cites the module that
 * parks them — check 7 reds when that module leaves the tree with the subtraction still here.
 */
// T9-W6 §6.1 — EMPTY, and the emptiness is the record. Two entries stood here until this wave:
// `wordmark-webkit` (5 of 6 rows) and `theme-bake-webkit` (all 10), both citing
// `e2e/linux-webkit-bake-quarantine.ts` and both stamped "THIRD PINNING (CH-62)". CH-62 RETIRED
// at T8 formation and the park's own condition (`process.platform === "linux"`) has had no
// surface to fire on since O-12 took the browser lanes out of CI at `d1daefb3` — so the module,
// its two call sites and these two subtractions died together. The table stays because the LAW
// stays: a `test.fixme` under a platform condition is a test that lists and does not assert,
// `--list` cannot tell the two apart, and any future park must say so here or the floors will
// count silence as coverage. Check 7 keeps its teeth against an empty table — it fires on any
// cite file that stops existing, which is exactly how this unwind was caught mid-edit.
const QUARANTINES = {};
const QUARANTINE_CITE_FILES = [];

// The declared matrix: every project and the engine it must resolve to. NO FLOORS HERE — a
// floor on LIVE tests (listed minus any declared quarantine) lives in census.stamp.json, one
// row per `<config>::<project>`, and check 8 reds if a number is smuggled back into this
// table or if the stamp's project set stops matching this one.
const CONFIGS = [
  {
    file: "playwright.config.ts",
    projects: [
      { name: "chromium", engine: "chromium" },
      { name: "webkit", engine: "webkit" },
    ],
  },
  {
    file: "playwright-golden.config.ts",
    projects: [{ name: UNNAMED, engine: "chromium" }],
  },
  {
    file: "playwright-throttle.config.ts",
    projects: [
      { name: "throttled-void", engine: "chromium" },
      { name: "filter-census-chromium", engine: "chromium" },
      { name: "filter-census-webkit", engine: "webkit" },
      { name: "wordmark-webkit", engine: "webkit" },
      { name: "theme-bake-chromium", engine: "chromium" },
      { name: "theme-bake-webkit", engine: "webkit" },
      { name: "theme-quadrants-chromium", engine: "chromium" },
      { name: "theme-quadrants-webkit", engine: "webkit" },
    ],
  },
];

/**
 * THE SPEC MANIFEST (check 6). Every e2e/*.spec.ts, by name, sorted. Deleting a spec file is
 * a deliberate act and must be spelled here in the same commit; so is adding one. Nothing
 * else in this gate can see a deletion — check 2 builds its claim map FROM the disk, so a
 * spec that vanishes vanishes from the question too.
 *
 * `--restamp` does NOT touch this list. A restamp that re-derived the manifest from disk
 * would agree with any deletion it found, which is the whole defect.
 */
const SPEC_MANIFEST = [
  "a11y.spec.ts",
  "access.spec.ts",
  "affordances.spec.ts",
  "board-covisibility.spec.ts",
  "device-probe.spec.ts",
  "drawer.spec.ts",
  "filter-census.spec.ts",
  "follow-still-authorship.spec.ts",
  "font-census.spec.ts",
  "futoshiki.spec.ts",
  "gallery-deal.spec.ts",
  "gallery-guard.spec.ts",
  "gallery.spec.ts",
  "join-language-prm.spec.ts",
  "join-language.spec.ts",
  "masthead-alignment.spec.ts",
  "mobile-affordances.spec.ts",
  "mobile-platform.spec.ts",
  "multiplayer.spec.ts",
  "permalink.spec.ts",
  "presence.spec.ts",
  "prm-void-audition.spec.ts",
  "session-substrate.spec.ts",
  "share-truth.spec.ts",
  "spoken-controls.spec.ts",
  "spoken-gallery.spec.ts",
  "sudoku-interaction.spec.ts",
  "theme-bake-freshness.spec.ts",
  "theme-quadrants.spec.ts",
  "throttled-void.spec.ts",
  "viewport-law.spec.ts",
  "visual-golden.spec.ts",
  "visual-regression.spec.ts",
  "wordmark-integrity.spec.ts",
  "zone-grammar.spec.ts",
];

/**
 * The single-engine estate, closed. Each entry is a spec that does NOT run in both engines at
 * FULL grain, the engines it does run in, and the reason — a Playwright API gap, an engine-only
 * defect class, or a row that owns the decision. A spec absent from this table must run in both.
 *
 * CH-56's residue was six specs; it is four, and each of the four carries a cite that can be
 * re-auditioned. `mobile-affordances` and `mobile-platform` left this table at T5-W1 1.10.
 *
 * ── T9-W6 §6.3 · PER-ROW GRAIN, BECAUSE THE FILE GRAIN WAS ROUNDING ────────────────────────
 *
 * An entry may carry `rows`. That means the FILE runs in both engines and a NAMED TEST inside
 * it does not — the shape `share-truth.spec.ts` was in for a whole campaign while its record
 * said the file was chromium-only. Four of its five rows never touched the missing API; they
 * sat dark in the second engine because the ignore was written one grain too coarse, and a
 * file-scope ignore is invisible from inside the file, so nothing a reader of the spec could
 * see said the rows were half-run.
 *
 * `--list` CANNOT SEE A ROW SKIP — a `test.skip(browserName === …)` is a runtime decision, so
 * the row lists in webkit and asserts nothing there, which is the exact "lists but does not
 * assert" shape the QUARANTINES table above exists for. So `rows` is load-bearing twice:
 * `liveTests` subtracts it from the engine it is held out of (the floors stay floors on LIVE
 * assertions), and check 4 holds it against the spec's own source — the title must be on disk,
 * the guard must be on disk, and an UNDECLARED per-row engine skip in any manifest spec reds.
 * That last clause is the anti-growth law the file-scope list used to carry, at row grain.
 *
 * ── T9-W3+W6 SEAL · THE ENV FORM, IN THE SAME TABLE ───────────────────────────────────────
 *
 * A row may also carry `env`: the name of the variable whose absence skips it. That is the
 * OTHER way a row lists and does not assert, and it is strictly worse than the engine form,
 * because an env gate is ENGINE-AGNOSTIC — it fires in every engine, on every run that does
 * not set the flag, so the row goes dark in BOTH censuses at once. Such a row declares
 * `engines: []` (it runs in no engine by default), which needs no new subtraction: `rowHoldouts`
 * already prices a row against the engines it does NOT list, so an empty list costs both.
 * Check 4 reads the env spelling of each clause — the title on disk, the `process.env.<NAME>`
 * guard on disk with the NAME the record claims, the anti-growth clause over env skips too,
 * and one clause of its own (an env gate that also names an engine is two facts in one row).
 */
const HOLDOUTS = {
  "multiplayer.spec.ts": {
    // The FILE runs in both engines; ONE row is an opt-in chair instrument behind an ENV GATE,
    // so it is dark in both of them rather than in one. T9-W3+W6 seal, prove P-2.
    engines: ENGINES,
    rows: [
      {
        title: "the real relay carries the board with RTCPeerConnection deleted",
        env: "T62_REAL_RELAY",
        engines: [],
        why:
          "NOT an engine gap — an ENV GATE, and it fires in BOTH engines on every run that " +
          "does not set T62_REAL_RELAY=1, which is every run but a chair's. T9-W6 §6.3 " +
          "DECIDED it stays opt-in: the far end is a deployed Cloudflare Worker, and a " +
          "default-on row would make every local suite depend on a third party's uptime — a " +
          "green that needs the internet reports weather. The obligation that rides the flag " +
          "is the WGATE production pass, which runs it once against the real relay and banks " +
          "the frames; the invocation sits in the row's own header at " +
          "multiplayer.spec.ts:927-949. Until that run, the row LISTS in both engines and " +
          "ASSERTS in neither, so both floors subtract it.",
      },
    ],
    why:
      "PER-ROW, and held out of BOTH engines rather than one. Every other row in the file " +
      "drives `wire=local`, the substitute; this row alone reaches the live relay with " +
      "`RTCPeerConnection` deleted, so it alone is gated. It is declared here because the " +
      "QUARANTINES table's own law says it must be — a row that lists and does not assert has " +
      "to be spelled somewhere or the floors count silence as coverage — and because that " +
      "table is keyed by project and platform, which an engine-agnostic flag is neither.",
  },
  "share-truth.spec.ts": {
    // The FILE runs in both engines as of T9-W6 §6.3 — re-auditioned, not inherited:
    // 9 passed / 1 FAILED (evidence/w6/holdouts/audition-both-engines-after-3C1.txt). The
    // failure is the audition's whole point and PRE-DATES the declaration: the run happened
    // before the row skip existed, so the clipboard row failed in WebKit on the missing
    // permission and the other nine passed. That failing row is the declared holdout below;
    // those nine are the widening this entry earned. (Corrected at the T9-W3+W6 seal, P-3:
    // this comment read "1 skipped", which the banked file does not say.)
    engines: ENGINES,
    rows: [
      {
        title:
          "sudoku share success: label + aria confirm AND the clipboard holds the link",
        engines: ["chromium"],
        why:
          "PW-WebKit has no clipboard-write permission — `browserContext.grantPermissions: " +
          "Unknown permission: clipboard-write` (re-measured at @playwright/test 1.61.1). THIS " +
          "ROW alone asserts a REAL clipboard write (grantPermissions at " +
          "share-truth.spec.ts:75, readText at :91); there is no honest way to grant one " +
          "there. The skip and its reason ride the row itself, at share-truth.spec.ts:68-74 " +
          "(row opens at :63). Cite re-derived at the T9-W3+W6 seal; it read :58-74.",
      },
    ],
    why:
      "PER-ROW, not per-file. The one true gap reaches the success row only; the two " +
      "failure-signal rows drive a REJECTING `writeText` through `addInitScript`, which " +
      "PW-WebKit honours (measured: REJECTED NotAllowedError in 1ms, " +
      "evidence/w6/holdouts/probe-failinit-webkit.txt), and the two corrupt-link rows only " +
      "read a margin notice. See `rows` for the held-out row and playwright.config.ts:72-96 " +
      "for the audition that earned the widening.",
  },
  "spoken-controls.spec.ts": {
    // The FILE runs in both engines; ONE row needs a clipboard grant PW-WebKit cannot give.
    engines: ENGINES,
    rows: [
      {
        title:
          "the outcome is spoken, and the name agrees with the label at every beat",
        engines: ["chromium"],
        why:
          "PW-WebKit has no clipboard-write permission — `browserContext.grantPermissions: " +
          "Unknown permission: clipboard-write` (re-measured at @playwright/test 1.61.1). The " +
          "row grants clipboard-read/write to press Share for real; the same gap share-truth's " +
          "success row carries, in a second file. The skip and its reason ride the row at " +
          "spoken-controls.spec.ts:284 (row opens at :279). Cite re-derived at the T9-W3+W6 " +
          "seal; it read :242, forty-two lines adrift of the tree.",
      },
    ],
    why:
      "PER-ROW, not per-file (T9-W6 §6.3). Only the §3.6 copy-outcome row needs the grant; " +
      "every other row in the file asserts live regions that both engines publish.",
  },
  "throttled-void.spec.ts": {
    engines: ["chromium"],
    why:
      "CDP-only: the spec throttles the network through `page.context().newCDPSession(page)` " +
      "(throttled-void.spec.ts:55), and CDP is a Chromium protocol — `:52-54` says so. " +
      "Widening needs a non-CDP throttle, not a project.",
  },
  "wordmark-integrity.spec.ts": {
    engines: ["webkit"],
    why:
      "WEBKIT-only by charter, the one holdout that runs in the second engine rather than the " +
      "first: the defects it guards are WebKit's own (the SVG-as-image bake at its declared " +
      "intrinsic), so it 'asserts in WebKit or asserts nothing' — " +
      "playwright-throttle.config.ts:122-128.",
  },
  "visual-golden.spec.ts": {
    engines: ["chromium"],
    why:
      "playwright-golden.config.ts declares no `projects` and no `use.browserName`, so the " +
      "goldens run under Playwright's default engine alone (the argument sits at " +
      "playwright-golden.config.ts:53-69). T5-W1 row 1.13 owns this decision " +
      "(r3/goldens-estate: 'the goldens' chromium-only engine pin argued or widened') — when " +
      "1.13 rules, this entry and the CONFIGS row above move in the same commit. A second " +
      "engine there also needs {projectName} in snapshotPathTemplate; " +
      "check-golden-bytes.mjs:424-451 (check 6) owns that collision.",
  },
};

/* ── per-row grain: reading the spec's own source ──────────────────────────────
 * The record above is prose until something holds it against the tree. These two readers are
 * what give it teeth, and both read the SPEC FILE — never a second copy of the truth.
 */

/**
 * Every CONDITIONED `test.skip(…)` in a spec, in both forms this gate knows:
 *   {kind: "engine", engine, title, line}  ← `test.skip(browserName === '<engine>')`
 *   {kind: "env",    env,    title, line}  ← `test.skip(process.env.<NAME> !== …)`
 * One reader, because the scan is identical and only the condition differs: find the skip,
 * read the guard out of the next few lines, walk back for the row it belongs to. What the two
 * forms share is the only property the floors care about — the row LISTS and does not ASSERT.
 * What they do not share is reach: an engine guard darkens one census, an env guard darkens
 * every one of them.
 */
function skipsIn(spec) {
  const path = join(E2E, spec);
  if (!existsSync(path)) return [];
  const lines = readFileSync(path, "utf8").split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/\btest\.skip\s*\(/.test(lines[i])) continue;
    // The guard may sit on the same line or on the next few — both spellings are idiomatic
    // and neither is the point; the engine name, or the variable name, is.
    const window = lines.slice(i, i + 4).join("\n");
    const engine = /browserName\s*===\s*['"`](\w+)['"`]/.exec(window);
    // An engine guard wins when a row somehow carries both: it is the narrower claim, and the
    // gate would rather over-report reach than under-report it.
    const env = engine ? null : /process\.env\.(\w+)/.exec(window);
    if (!engine && !env) continue;
    // The row it belongs to: the nearest `test(` above it carrying a quoted title.
    let title = null;
    for (let j = i; j >= 0 && j > i - 60; j--) {
      const t = /^\s*test(?:\.\w+)*\s*\(\s*(['"`])((?:\\.|(?!\1).)*)\1/.exec(lines[j]);
      if (t) {
        title = t[2].replace(/\\(['"`])/g, "$1");
        break;
      }
    }
    out.push(
      engine
        ? { kind: "engine", engine: engine[1], title, line: i + 1 }
        : { kind: "env", env: env[1], title, line: i + 1 },
    );
  }
  return out;
}

/**
 * The per-row holdouts a project loses, BY SOURCE: rows declared as not running in this
 * project's engine, split into the engine-scoped ones and the env-gated ones. The split is
 * for the printer, not for the arithmetic — a dark row costs a floor the same either way —
 * but "row-held out of webkit" printed for an engine-agnostic flag sends the next reader to
 * the wrong table, and this gate exists to stop exactly that kind of misfiling.
 */
function rowHoldoutsBySource(engine, specs) {
  let rows = 0;
  let env = 0;
  for (const [spec, entry] of Object.entries(HOLDOUTS)) {
    if (!entry.rows || !specs?.has(spec)) continue;
    for (const r of entry.rows) {
      if (r.engines.includes(engine)) continue;
      if (r.env) env += 1;
      else rows += 1;
    }
  }
  return { rows, env };
}

/** The same figure, summed — what `liveTests` subtracts. */
function rowHoldouts(engine, specs) {
  const { rows, env } = rowHoldoutsBySource(engine, specs);
  return rows + env;
}

/** Why a project's LIVE count sits under its LISTED count, named by source. */
function shortfallSources(projectName, engine, specs) {
  const q = QUARANTINES[projectName];
  const { rows, env } = rowHoldoutsBySource(engine, specs);
  return (
    [
      q ? `${q.tests} parked on ${q.platform}` : null,
      rows ? `${rows} row-held out of ${engine}` : null,
      env ? `${env} env-gated, dark in both engines` : null,
    ]
      .filter(Boolean)
      .join(" + ") || "unattributed"
  );
}

/* ── collection: ask Playwright, don't read prose ──────────────────────────── */

/** The engine a project resolves to: its own `use.browserName`, else the config's, else PW's. */
function declaredEngine(project, config) {
  return project?.use?.browserName ?? config?.use?.browserName ?? PW_DEFAULT_ENGINE;
}

/** `--list --reporter=json` is Playwright's OWN resolution of testDir/testMatch/testIgnore
 *  against every project — the same one the run uses. Parsing the config's regexes ourselves
 *  would be a second implementation, and a second implementation is a second set of bugs. */
function listMatrix(configFile) {
  let raw;
  try {
    raw = execFileSync(
      "npx",
      ["playwright", "test", "--config", configFile, "--list", "--reporter=json"],
      {
        cwd: ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        maxBuffer: 64 << 20,
      },
    );
  } catch (err) {
    throw new Error(
      `\`playwright test --config ${configFile} --list\` failed:\n${err.stderr || err.message}`,
      { cause: err },
    );
  }
  let json;
  try {
    json = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `--list --reporter=json for ${configFile} did not emit JSON:\n${raw.slice(0, 400)}`,
      { cause: err },
    );
  }
  /** projectName -> { specs: Set<basename>, tests: number } */
  const byProject = new Map();
  const walk = (suite, inheritedFile) => {
    const file = suite.file || inheritedFile;
    for (const child of suite.suites ?? []) walk(child, file);
    for (const spec of suite.specs ?? []) {
      const basename = (spec.file || file || "").split("/").pop();
      for (const t of spec.tests ?? []) {
        const name = t.projectName || UNNAMED;
        if (!byProject.has(name)) byProject.set(name, { specs: new Set(), tests: 0 });
        const entry = byProject.get(name);
        entry.specs.add(basename);
        entry.tests += 1;
      }
    }
  };
  for (const suite of json.suites ?? []) walk(suite);
  return byProject;
}

/** The model every check runs against: what the configs DECLARE and what Playwright RESOLVES. */
async function collect() {
  const onDisk = readdirSync(E2E)
    .filter((f) => f.endsWith(".spec.ts"))
    .sort();
  const configs = [];
  for (const { file } of CONFIGS) {
    const mod = await import(join(ROOT, file));
    const cfg = mod.default;
    const declared = (cfg.projects ?? [null]).map((p) => ({
      name: p?.name ?? UNNAMED,
      engine: declaredEngine(p, cfg),
    }));
    configs.push({ file, declared, matrix: listMatrix(file) });
  }
  return { onDisk, configs };
}

/* ── the checks ────────────────────────────────────────────────────────────── */

const fmt = (xs) => [...xs].sort().join(", ") || "∅";

function check1DeclaredMatrix({ configs }) {
  const bad = [];
  for (const { file, declared } of configs) {
    const want = CONFIGS.find((c) => c.file === file).projects;
    const wantSet = want.map((p) => `${p.name}=${p.engine}`).sort();
    const gotSet = declared.map((p) => `${p.name}=${p.engine}`).sort();
    if (wantSet.join("|") !== gotSet.join("|"))
      bad.push(
        `${file}: project matrix drifted.\n    manifest: ${fmt(wantSet)}\n    config:   ${fmt(gotSet)}\n` +
          `    A project added, removed, or re-engined is a deliberate act — edit CONFIGS in ` +
          `this script in the SAME commit, with the reason.`,
      );
  }
  return bad;
}

function check2SpecOwnership({ onDisk, configs }) {
  const bad = [];
  /** basename -> configs that claim it */
  const claims = new Map(onDisk.map((f) => [f, []]));
  for (const { file, matrix } of configs)
    for (const { specs } of matrix.values())
      for (const s of specs) {
        if (!claims.has(s)) claims.set(s, []);
        const owners = claims.get(s);
        if (!owners.includes(file)) owners.push(file);
      }
  for (const [spec, owners] of [...claims].sort()) {
    if (!onDisk.includes(spec))
      bad.push(`${spec}: claimed by ${fmt(owners)} but not on disk under e2e/.`);
    else if (owners.length === 0)
      bad.push(
        `${spec}: ORPHAN — on disk, claimed by no config/project, so it never runs. A ` +
          `testIgnore that grew or a testMatch that narrowed will look exactly like this.`,
      );
    else if (owners.length > 1)
      bad.push(
        `${spec}: claimed by ${owners.length} configs (${fmt(owners)}). Each spec belongs to ` +
          `exactly one config — a double-claim runs it twice under different fixtures.`,
      );
  }
  return bad;
}

/** basename -> Set(engine) across every config and project. */
function enginesPerSpec({ configs }) {
  const out = new Map();
  for (const { file, declared, matrix } of configs)
    for (const [projectName, { specs }] of matrix) {
      const engine =
        declared.find((p) => p.name === projectName)?.engine ?? PW_DEFAULT_ENGINE;
      for (const s of specs) {
        if (!out.has(s)) out.set(s, new Set());
        out.get(s).add(engine);
      }
      void file;
    }
  return out;
}

function check3EngineCoverage(model) {
  const bad = [];
  for (const [spec, engines] of [...enginesPerSpec(model)].sort()) {
    const holdout = HOLDOUTS[spec];
    const want = holdout ? [...holdout.engines].sort() : [...ENGINES].sort();
    const got = [...engines].sort();
    if (want.join("|") === got.join("|")) continue;
    bad.push(
      holdout
        ? `${spec}: declared holdout engines {${fmt(want)}} but resolves to {${fmt(got)}}.`
        : `${spec}: runs in {${fmt(got)}} — every spec runs in BOTH engines unless HOLDOUTS ` +
            `says why. This is CH-56's exact shape: a surface that quietly covers one engine ` +
            `while the suite still reads green. Widen it, or add a HOLDOUTS entry with the cite.`,
    );
  }
  return bad;
}

function check4HoldoutsClosed(model) {
  const bad = [];
  const engines = enginesPerSpec(model);
  for (const [spec, { engines: declaredEngines, why }] of Object.entries(HOLDOUTS)) {
    if (!model.onDisk.includes(spec)) {
      bad.push(
        `HOLDOUTS lists ${spec}, which is not on disk — stale entry, delete it.`,
      );
      continue;
    }
    const got = engines.get(spec);
    if (got && got.size >= ENGINES.length && declaredEngines.length < ENGINES.length)
      bad.push(
        `HOLDOUTS lists ${spec} as ${fmt(declaredEngines)}-only, but it now resolves to ` +
          `{${fmt(got)}}. The record must follow the code: delete the entry in the same commit ` +
          `that widened it. (Recorded reason: ${why.slice(0, 90)}…)`,
      );
    if (!why || why.length < 40)
      bad.push(
        `HOLDOUTS[${spec}] carries no usable reason — a holdout without a cite is a hole.`,
      );
  }
  bad.push(...rowGrainClosed(model));
  return bad;
}

/**
 * CHECK 4, PER-ROW HALF (T9-W6 §6.3). The file-scope half above reads Playwright's resolution;
 * this half reads the SPEC SOURCE, because a `test.skip(browserName === …)` is a runtime
 * decision `--list` renders as coverage. Four clauses, and the estate was one edit from each:
 *
 *   DECLARED    every row-grain entry names a title that is actually on disk, so a retitled or
 *               deleted row cannot leave a subtraction behind (the CH-62 park's exact shape,
 *               one grain down).
 *   GUARDED     the spec carries a matching guard — `test.skip(browserName === '<engine>')`
 *               for an engine row, `test.skip(process.env.<NAME> …)` with the NAME the record
 *               claims for an env row. A record claiming a row is dark where it in fact runs
 *               is worse than none: `liveTests` subtracts it, so the floor drops for a row
 *               that asserts fine.
 *   UNDECLARED  the anti-growth clause, and the whole reason this half exists. Any per-row
 *               engine skip in a MANIFEST spec that no entry declares reds — and, since the
 *               T9-W3+W6 seal, any per-row ENV skip too. Without it, moving from a file-scope
 *               ignore to row-scope skips would have traded a watched narrowing for an
 *               unwatched one — CH-56 re-opened at row grain; and the env form was that hole
 *               already open, four skips reported by the suite against two in the model.
 *   COHERENT    row grain only means anything when the FILE runs in both engines; a per-row
 *               holdout inside a file-scope holdout is two records of one fact.
 *   AGNOSTIC    an env gate fires in every engine, so an env row that also names engines it
 *               runs in is two facts in one row, and the two will drift.
 *
 * Manifest specs only: SPEC_MANIFEST is the closed set this gate speaks for, and a spec that
 * has not joined it yet is check 6's business, not this clause's.
 */
function rowGrainClosed({ onDisk }, readSkips = skipsIn) {
  const bad = [];
  const declared = new Map(); // "spec::title::engine" -> true
  for (const [spec, entry] of Object.entries(HOLDOUTS)) {
    if (!entry.rows) continue;
    if (entry.engines.length < ENGINES.length)
      bad.push(
        `HOLDOUTS[${spec}] declares per-ROW holdouts inside a per-FILE holdout ` +
          `({${fmt(entry.engines)}}). Row grain says "the file runs everywhere, this row does ` +
          `not" — pick one grain, or the same fact is recorded twice and the two will drift.`,
      );
    const skips = readSkips(spec);
    for (const r of entry.rows) {
      if (!r.why || r.why.length < 40)
        bad.push(
          `HOLDOUTS[${spec}] row ${JSON.stringify(r.title)} carries no usable reason — a ` +
            `holdout without a cite is a hole, at every grain.`,
        );
      const held = ENGINES.filter((e) => !r.engines.includes(e));
      const onDiskTitle = skips.some((s) => s.title === r.title);
      if (!onDiskTitle)
        bad.push(
          `HOLDOUTS[${spec}] declares row ${JSON.stringify(r.title)}, which carries no ` +
            `conditioned skip on disk. Either the row was retitled or deleted and this ` +
            `subtraction outlived it, or the guard was removed and the row silently runs ` +
            `everywhere — both leave the floors counting a row that is not what the record ` +
            `says it is.`,
        );
      if (r.env) {
        // AGNOSTIC + GUARDED + the declaration key, env spelling. An env row is dark in every
        // engine, so its key is the variable rather than an engine and `held` is necessarily
        // all of them — which is what makes `engines: []` the honest declaration.
        if (r.engines.length)
          bad.push(
            `HOLDOUTS[${spec}] row ${JSON.stringify(r.title)} is env-gated on ` +
              `${r.env} AND claims to run in {${fmt(r.engines)}}. An env gate fires in every ` +
              `engine — declare \`engines: []\`, or drop \`env\` and say which engine guard ` +
              `really holds it out. Two facts in one row is how the record starts to drift.`,
          );
        declared.set(`${spec}::${r.title}::env:${r.env}`, true);
        if (
          !skips.some((s) => s.kind === "env" && s.title === r.title && s.env === r.env)
        )
          bad.push(
            `HOLDOUTS[${spec}] gates row ${JSON.stringify(r.title)} on ` +
              `\`process.env.${r.env}\`, which the spec does not carry. liveTests subtracts ` +
              `that row from BOTH engines' floors, so the record is lowering two floors for ` +
              `coverage the tree still has.`,
          );
        continue;
      }
      for (const e of held) declared.set(`${spec}::${r.title}::${e}`, true);
      for (const e of held)
        if (
          !skips.some(
            (s) => s.kind === "engine" && s.title === r.title && s.engine === e,
          )
        )
          bad.push(
            `HOLDOUTS[${spec}] holds row ${JSON.stringify(r.title)} out of ${e}, but the ` +
              `spec has no \`test.skip(browserName === '${e}')\` on it. liveTests subtracts ` +
              `that row from ${e}'s floor, so the record is lowering a floor for coverage the ` +
              `tree still has.`,
          );
    }
  }
  for (const spec of SPEC_MANIFEST) {
    if (!onDisk.includes(spec)) continue;
    for (const s of readSkips(spec)) {
      if (s.title === null) {
        bad.push(
          `${spec}:${s.line} carries a conditioned skip this gate cannot attribute to a test ` +
            `title. A skip no reader can name is a skip no record can hold — put it inside a ` +
            `\`test('…')\` whose title is on one line.`,
        );
        continue;
      }
      const k =
        s.kind === "env"
          ? `${spec}::${s.title}::env:${s.env}`
          : `${spec}::${s.title}::${s.engine}`;
      if (declared.has(k)) continue;
      bad.push(
        s.kind === "env"
          ? `${spec}:${s.line} skips ${JSON.stringify(s.title)} unless ` +
              `\`process.env.${s.env}\` is set, and HOLDOUTS does not declare it. An env gate ` +
              `is CH-56's shape with the reach of a quarantine: the row LISTS in BOTH engines ` +
              `and asserts in neither, so both floors count it as coverage on every run that ` +
              `leaves the flag unset. Declare it in HOLDOUTS[${spec}].rows with \`env\`, ` +
              `\`engines: []\` and a cite, or delete the skip.`
          : `${spec}:${s.line} skips ${JSON.stringify(s.title)} in ${s.engine} and HOLDOUTS ` +
              `does not declare it. This is CH-56's shape at ROW grain: a row that quietly ` +
              `asserts in one engine while the file reads as covering both. Declare it in ` +
              `HOLDOUTS[${spec}].rows with a cite, or delete the skip.`,
      );
    }
  }
  return bad;
}

/**
 * Tests a project LISTS minus what it does not ASSERT: the declared quarantine that applies on
 * this platform, and (T9-W6 §6.3) the declared per-row engine holdouts. Both are runtime
 * decisions `--list` counts as coverage; a floor over them is a floor over silence.
 */
function liveTests(projectName, listed, platform = process.platform, ctx) {
  const q = QUARANTINES[projectName];
  const parked = q && q.platform === platform ? q.tests : 0;
  const rows = ctx ? rowHoldouts(ctx.engine, ctx.specs) : 0;
  return Math.max(0, listed - parked - rows);
}

/**
 * The WORST CASE across platforms, never the running one — the figure both the band and the
 * restamp reason about. A census taken on darwin, where no quarantine applies, would bank
 * floors of 6 and 10 for the two parked projects and red the ubuntu lane on its next run.
 */
const worstCaseLive = (projectName, listed, ctx) =>
  liveTests(
    projectName,
    listed,
    QUARANTINES[projectName]?.platform ?? process.platform,
    ctx,
  );

/** The (engine, specs) a project resolves to — what `liveTests` needs to price its row holdouts. */
const ctxOf = (file, p, matrix) => ({
  engine: p.engine,
  specs: matrix.get(p.name)?.specs ?? new Set(),
  file,
});

/** The floor a project owes, from the one stamp; a project with no row owes nothing here (check 8 reds). */
const floorOf = (file, project) => stampRow(file, project)?.floor ?? 0;

function check5CountFloors({ configs }) {
  const bad = [];
  for (const { file, matrix } of configs)
    for (const p of CONFIGS.find((c) => c.file === file).projects) {
      const got = matrix.get(p.name)?.tests ?? 0;
      const live = liveTests(p.name, got, process.platform, ctxOf(file, p, matrix));
      const floor = floorOf(file, p.name);
      if (live < floor)
        bad.push(
          `${file} [${p.name}]: ${live} LIVE tests${live === got ? "" : ` (${got} listed − ${got - live} dark: ${shortfallSources(p.name, p.engine, matrix.get(p.name)?.specs ?? new Set())})`}, ` +
            `floor ${floor}. Tests left the project. Raise the floor only alongside the ` +
            `reason they went.`,
        );
    }
  return bad;
}

/**
 * CHECK 8 — THE FLOOR BAND (T9-W5 §5.2). Check 5 asks whether the estate fell below its
 * floor. This asks the question check 5 structurally cannot: whether the FLOOR still means
 * anything. It reds three ways, and all three were live at HEAD or one edit away:
 *
 *   · SLACK          floor under 85% of max(stamped census, live) — the estate grew past a
 *                    floor nobody restamped, or the floor was walked down under the band.
 *   · INFLATED STAMP a census claiming more than the tree resolves. The stamp is evidence,
 *                    not a wish; max() holds it against the live figure either way.
 *   · PROVENANCE     the stamp's project set must be exactly the declared one, and CONFIGS
 *                    must carry no `floor` of its own. Two homes for one number is how the
 *                    audit found the same floor written three different ways.
 */
function check8FloorBand({ configs }) {
  const bad = [];
  const declared = new Set();
  for (const { file, matrix } of configs)
    for (const p of CONFIGS.find((c) => c.file === file).projects) {
      declared.add(key(file, p.name));
      if ("floor" in p)
        bad.push(
          `CONFIGS[${file}][${p.name}] carries its own \`floor\`. The number lives in ` +
            `scripts/census.stamp.json and nowhere else — a second copy is the provenance ` +
            `split re-opening.`,
        );
      const row = stampRow(file, p.name);
      if (!row) {
        bad.push(
          `${file} [${p.name}]: no row in scripts/census.stamp.json. A project without a ` +
            `stamped floor is ungated — restamp, or delete the project.`,
        );
        continue;
      }
      const listed = matrix.get(p.name)?.tests ?? 0;
      const live = worstCaseLive(p.name, listed, ctxOf(file, p, matrix));
      const ref = Math.max(row.census, live);
      const need = bandFloor(ref);
      if (row.floor < need)
        bad.push(
          `${file} [${p.name}]: floor ${row.floor} is OUT OF BAND — ` +
            `${((1 - row.floor / ref) * 100).toFixed(1)}% under ${ref} ` +
            `(stamped census ${row.census}, live ${live}), and the band is ` +
            `${(LAW.band * 100).toFixed(0)}%, so the floor owes ${need}. ` +
            (live > row.census
              ? `The project GREW past its floor and nothing restamped it — silent slack.`
              : live < row.census
                ? `The stamped census sits above the tree it claims to have measured.`
                : `The floor was never re-derived from the census stamped beside it.`) +
            ` Re-derive: node scripts/check-pw-projects.mjs --restamp`,
        );
    }
  for (const k of Object.keys(STAMP.pw.projects))
    if (!declared.has(k))
      bad.push(
        `scripts/census.stamp.json stamps "${k}", which no config declares — a floor ` +
          `against nothing. Delete the row in the commit that deleted the project.`,
      );
  return bad;
}

function check6SpecManifest({ onDisk }) {
  const bad = [];
  const manifest = new Set(SPEC_MANIFEST);
  const disk = new Set(onDisk);
  for (const s of SPEC_MANIFEST)
    if (!disk.has(s))
      bad.push(
        `${s}: in SPEC_MANIFEST, NOT on disk. A deleted spec is invisible to every other ` +
          `check here — check 2 seeds its claim map from the disk, so a vanished spec is ` +
          `neither an orphan nor a double-claim. Delete it from the manifest in the same ` +
          `commit that deleted the file, with the reason.`,
      );
  for (const s of onDisk)
    if (!manifest.has(s))
      bad.push(
        `${s}: on disk, NOT in SPEC_MANIFEST. A new spec is a deliberate act — add it here ` +
          `in the same commit, and check its engine coverage while you are at it.`,
      );
  return bad;
}

function check7QuarantinesClosed() {
  const bad = [];
  for (const [project, q] of Object.entries(QUARANTINES)) {
    const known = CONFIGS.some((c) => c.projects.some((p) => p.name === project));
    if (!known)
      bad.push(
        `QUARANTINES names project "${project}", which no config declares — a subtraction ` +
          `against nothing. Delete the entry.`,
      );
    if (!q.cite || q.cite.length < 40)
      bad.push(
        `QUARANTINES[${project}] carries no usable cite — an undeclared park is a hole.`,
      );
  }
  for (const f of QUARANTINE_CITE_FILES)
    if (!existsSync(join(ROOT, f)))
      bad.push(
        `${f} is gone, but the floors still subtract its rows. When a quarantine is lifted ` +
          `the subtraction and the floor move together, in that commit — otherwise the lane ` +
          `silently re-earns coverage it never regained.`,
      );
  return bad;
}

const CHECKS = [
  ["1 DECLARED MATRIX", check1DeclaredMatrix],
  ["2 SPEC OWNERSHIP", check2SpecOwnership],
  ["3 ENGINE COVERAGE", check3EngineCoverage],
  ["4 HOLDOUTS CLOSED", check4HoldoutsClosed],
  ["5 COUNT FLOORS", check5CountFloors],
  ["6 SPEC MANIFEST", check6SpecManifest],
  ["7 QUARANTINES CLOSED", check7QuarantinesClosed],
  ["8 FLOOR BAND", check8FloorBand],
];

/* ── self-test: every check shown able to fail ─────────────────────────────── */

/** Deep-ish clone of the collected model (Sets and Maps included). */
const cloneModel = (m) => ({
  onDisk: [...m.onDisk],
  configs: m.configs.map((c) => ({
    file: c.file,
    declared: c.declared.map((d) => ({ ...d })),
    matrix: new Map(
      [...c.matrix].map(([k, v]) => [k, { specs: new Set(v.specs), tests: v.tests }]),
    ),
  })),
});

const defaultCfg = (m) => m.configs.find((c) => c.file === "playwright.config.ts");

/**
 * Each sabotage is a narrowing that HAS a real-world shape. `--self-test` fails if the check
 * it targets stays silent: a gate that cannot be shown failing is not evidence of anything.
 */
const SABOTAGES = [
  [
    "1 DECLARED MATRIX",
    "a third project appears (a firefox arm nobody ratified)",
    (m) => defaultCfg(m).declared.push({ name: "firefox", engine: "firefox" }),
  ],
  [
    "1 DECLARED MATRIX",
    "the webkit project is quietly re-engined to chromium",
    (m) =>
      (defaultCfg(m).declared.find((p) => p.name === "webkit").engine = "chromium"),
  ],
  [
    "2 SPEC OWNERSHIP",
    "a spec is dropped from every project (the orphan)",
    (m) => {
      for (const { specs } of defaultCfg(m).matrix.values())
        specs.delete("drawer.spec.ts");
    },
  ],
  [
    "2 SPEC OWNERSHIP",
    "a spec is claimed by two configs at once",
    (m) => m.configs[1].matrix.get(UNNAMED).specs.add("drawer.spec.ts"),
  ],
  [
    "3 ENGINE COVERAGE",
    "CH-56 regresses — mobile-affordances loses its webkit arm",
    (m) =>
      defaultCfg(m).matrix.get("webkit").specs.delete("mobile-affordances.spec.ts"),
  ],
  [
    // T9-W6 §6.3 re-cut this one. It used to widen share-truth into webkit, and share-truth IS
    // in webkit now — the sabotage had become a no-op and `--self-test` said so on the first
    // run after the narrowing, which is the canary earning its keep. throttled-void carries the
    // same file-scope shape (CDP, chromium-only), so the clause is proven on a live holdout.
    "4 HOLDOUTS CLOSED",
    "throttled-void is widened but the holdout record is left standing",
    (m) => defaultCfg(m).matrix.get("webkit").specs.add("throttled-void.spec.ts"),
  ],
  [
    "5 COUNT FLOORS",
    "the chromium project sheds half its tests",
    (m) => (defaultCfg(m).matrix.get("chromium").tests = 40),
  ],
  [
    "8 FLOOR BAND",
    "the estate grows 25% and nothing restamps it (silent slack, the disease)",
    (m) =>
      (defaultCfg(m).matrix.get("chromium").tests = Math.ceil(
        defaultCfg(m).matrix.get("chromium").tests * 1.25,
      )),
  ],
  [
    "6 SPEC MANIFEST",
    "a whole spec FILE is deleted (green on all 5 checks before T7-W6)",
    (m) => (m.onDisk = m.onDisk.filter((s) => s !== "drawer.spec.ts")),
  ],
  [
    "6 SPEC MANIFEST",
    "a spec lands on disk that the manifest never sanctioned",
    (m) => m.onDisk.push("smuggled.spec.ts"),
  ],
];

/**
 * Check 4's PER-ROW half reads the spec source and the HOLDOUTS table, not the resolved matrix,
 * so like check 7 it carries its own sabotages: bend one of the two, run the clause, put it
 * back. The reader is injected rather than the file written, so nothing touches the tree — a
 * self-test that plants a defect on disk is a self-test that can leave one there.
 */
const SHARE = "share-truth.spec.ts";
const RELAY = "multiplayer.spec.ts";
const SABOTAGES_4_ROWS = [
  [
    "UNDECLARED — a manifest spec grows a per-row engine skip nobody declared (CH-56 at row grain)",
    (m) =>
      rowGrainClosed(m, (spec) =>
        spec === "permalink.spec.ts"
          ? [
              {
                kind: "engine",
                engine: "webkit",
                title: "a row that quietly stopped covering webkit",
                line: 1,
              },
            ]
          : skipsIn(spec),
      ),
  ],
  [
    // THE SEAL'S PLANT, run without touching the tree. The disk version of this fixture is
    // banked at evidence/w6/seal/s3-*: the same skip planted in permalink.spec.ts read GREEN
    // on all eight checks before this clause existed, which is what "silence is not coverage"
    // costs when the gate has no reader for the form.
    "UNDECLARED · ENV — a manifest spec grows an env-gated skip nobody declared (dark in BOTH engines)",
    (m) =>
      rowGrainClosed(m, (spec) =>
        spec === "permalink.spec.ts"
          ? [
              {
                kind: "env",
                env: "PLANTED_ENV_GATE",
                title: "a row that quietly stopped covering anything",
                line: 1,
              },
            ]
          : skipsIn(spec),
      ),
  ],
  [
    "GUARDED · ENV — the record names a variable the spec does not gate on (two floors lowered for nothing)",
    (m) => {
      const row = HOLDOUTS[RELAY].rows[0];
      const was = row.env;
      row.env = `${was}_THAT_IS_NOT_THERE`;
      const found = rowGrainClosed(m);
      row.env = was;
      return found;
    },
  ],
  [
    "AGNOSTIC · ENV — an env-gated row also claims an engine it runs in (one row, two facts)",
    (m) => {
      const row = HOLDOUTS[RELAY].rows[0];
      const was = row.engines;
      row.engines = ["chromium"];
      const found = rowGrainClosed(m);
      row.engines = was;
      return found;
    },
  ],
  [
    "DECLARED — the row is retitled on disk and the subtraction outlives it",
    (m) => {
      const row = HOLDOUTS[SHARE].rows[0];
      const was = row.title;
      row.title = was + " (renamed out from under the record)";
      const found = rowGrainClosed(m);
      row.title = was;
      return found;
    },
  ],
  [
    "GUARDED — the record holds a row out of an engine the tree still runs it in (a floor lowered for nothing)",
    (m) => {
      const row = HOLDOUTS[SHARE].rows[0];
      const was = row.engines;
      row.engines = [];
      const found = rowGrainClosed(m);
      row.engines = was;
      return found;
    },
  ],
  [
    "COHERENT — per-row grain declared inside a per-file holdout (one fact, two records)",
    (m) => {
      const entry = HOLDOUTS[SHARE];
      const was = entry.engines;
      entry.engines = ["chromium"];
      const found = rowGrainClosed(m);
      entry.engines = was;
      return found;
    },
  ],
];

/**
 * THE POSITIVE HALF (T9-W3+W6 seal). Every fixture above proves a clause CAN fail; a gate also
 * has to be shown not failing on the truth it was built for, and one of these two facts no
 * other check can see. A key scheme that missed would red the bare gate and be caught in a
 * second — but a SUBTRACTION that missed would stay silent, and the subtraction is the entire
 * reason the row is declared. So this asserts both: the declared env row is clean at row grain,
 * AND it costs exactly one row in EACH engine's live census. Env gates are engine-agnostic; a
 * subtraction that landed on one engine would leave the other counting silence as coverage,
 * which is the defect this whole extension exists to close.
 */
const PROOFS_4_ROWS = [
  [
    "the declared T62 env row is clean at row grain AND subtracts 1 from BOTH engines",
    (m) => {
      const specs = new Set([RELAY]);
      const complaints = rowGrainClosed(m).filter((b) => b.includes(RELAY));
      const per = ENGINES.map((e) => [e, rowHoldoutsBySource(e, specs)]);
      const subtracted = per.every(([, s]) => s.env === 1 && s.rows === 0);
      return {
        ok: complaints.length === 0 && subtracted,
        detail:
          `${complaints.length} complaint(s); env-gated rows subtracted: ` +
          per.map(([e, s]) => `${e} ${s.env}`).join(", "),
        complaints,
      };
    },
  ],
];

/** Check 7 reads the tree, not the model, so its sabotage is its own. */
const SABOTAGE_7 = [
  "7 QUARANTINES CLOSED",
  "the quarantine module is deleted while the floors still subtract its rows",
  () => {
    const saved = [...QUARANTINE_CITE_FILES];
    QUARANTINE_CITE_FILES.length = 0;
    QUARANTINE_CITE_FILES.push("e2e/a-quarantine-that-is-not-there.ts");
    const found = check7QuarantinesClosed();
    QUARANTINE_CITE_FILES.length = 0;
    QUARANTINE_CITE_FILES.push(...saved);
    return found;
  },
];

/**
 * Check 8's other three shapes read the STAMP and CONFIGS rather than the collected model, so
 * like check 7 they carry their own sabotages: bend the module-level structure, run the check,
 * put it back. Nothing touches the tree.
 */
const CHROMIUM_KEY = key("playwright.config.ts", "chromium");
const SABOTAGES_8 = [
  [
    "a census stamped 20% above live (the stamp as a wish)",
    (m) => {
      const row = STAMP.pw.projects[CHROMIUM_KEY];
      const was = row.census;
      row.census = Math.round(was * 1.2);
      const found = check8FloorBand(m);
      row.census = was;
      return found;
    },
  ],
  [
    "a floor hand-lowered one step under the band",
    (m) => {
      const row = STAMP.pw.projects[CHROMIUM_KEY];
      const was = row.floor;
      row.floor = bandFloor(Math.max(row.census, was)) - 1;
      const found = check8FloorBand(m);
      row.floor = was;
      return found;
    },
  ],
  [
    "a floor smuggled back into CONFIGS (two homes for one number)",
    (m) => {
      const p = CONFIGS[0].projects[0];
      p.floor = 1;
      const found = check8FloorBand(m);
      delete p.floor;
      return found;
    },
  ],
  [
    "a stamped floor for a project no config declares (the orphan row)",
    (m) => {
      STAMP.pw.projects["playwright.config.ts::firefox"] = {
        listed: 1,
        census: 1,
        floor: 1,
      };
      const found = check8FloorBand(m);
      delete STAMP.pw.projects["playwright.config.ts::firefox"];
      return found;
    },
  ],
];

function selfTest(model) {
  const vacuous = [];
  for (const [target, description, sabotage] of SABOTAGES) {
    const wounded = cloneModel(model);
    sabotage(wounded);
    const [, fn] = CHECKS.find(([name]) => name === target);
    const found = fn(wounded);
    const mark = found.length ? "RED (as it must)" : "GREEN — VACUOUS";
    console.log(`  [${target}] ${description}\n      → ${mark}`);
    if (!found.length)
      vacuous.push(
        `check "${target}" stayed GREEN under: ${description}. It cannot fail for the defect ` +
          `it names, so it is not a gate.`,
      );
  }
  for (const [description, run] of SABOTAGES_4_ROWS) {
    const found = run(model);
    console.log(
      `  [4 HOLDOUTS CLOSED · row grain] ${description}\n      → ${found.length ? "RED (as it must)" : "GREEN — VACUOUS"}`,
    );
    if (!found.length)
      vacuous.push(
        `check "4 HOLDOUTS CLOSED" (row grain) stayed GREEN under: ${description}. It cannot ` +
          `fail for the defect it names, so it is not a gate.`,
      );
  }
  for (const [description, run] of PROOFS_4_ROWS) {
    const { ok, detail, complaints } = run(model);
    console.log(
      `  [4 HOLDOUTS CLOSED · row grain · PROOF] ${description}\n      → ` +
        `${ok ? "GREEN (as it must)" : "RED — THE RECORD DOES NOT LAND"} · ${detail}`,
    );
    if (!ok)
      vacuous.push(
        `the row-grain PROOF failed: ${description}. ${detail}` +
          (complaints.length ? `\n      ${complaints.join("\n      ")}` : "") +
          `\n      A declaration that does not subtract is a declaration that changes nothing.`,
      );
  }
  {
    const [target, description, run] = SABOTAGE_7;
    const found = run();
    console.log(
      `  [${target}] ${description}\n      → ${found.length ? "RED (as it must)" : "GREEN — VACUOUS"}`,
    );
    if (!found.length)
      vacuous.push(
        `check "${target}" stayed GREEN under: ${description}. It cannot fail for the defect ` +
          `it names, so it is not a gate.`,
      );
  }
  for (const [description, run] of SABOTAGES_8) {
    const found = run(model);
    console.log(
      `  [8 FLOOR BAND] ${description}\n      → ${found.length ? "RED (as it must)" : "GREEN — VACUOUS"}`,
    );
    if (!found.length)
      vacuous.push(
        `check "8 FLOOR BAND" stayed GREEN under: ${description}. It cannot fail for the ` +
          `defect it names, so it is not a gate.`,
      );
  }
  return vacuous;
}

/* ── --restamp: re-derive the floors from a live census (WGATE only) ───────── */

function restamp(model, { dry, allowLower, wave }) {
  const rows = [];
  for (const { file, matrix } of model.configs)
    for (const p of CONFIGS.find((c) => c.file === file).projects) {
      const listed = matrix.get(p.name)?.tests ?? 0;
      const live = worstCaseLive(p.name, listed, ctxOf(file, p, matrix));
      const was = floorOf(file, p.name);
      const derived = deriveFloor(live);
      // THE RATCHET (law.ratchet). max(banked, derived) — closing slack never hands any back,
      // and on an unmoved tree the arm therefore proposes NOTHING and round-trips. The plain
      // derivation alone is what broke this arm for two campaigns: it read theme-quadrants'
      // deliberately-exact 14 as a 10%-churn project, proposed 12, and called it a LOWERING.
      // A derived floor that would land ABOVE live is the one true lowering: tests left.
      let now = Math.max(was, derived);
      if (now > live) now = derived;
      rows.push({ file, project: p.name, listed, live, was, derived, now });
    }
  const sha = execFileSync("git", ["rev-parse", "--short", "HEAD"], {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();
  const date = new Date().toISOString().slice(0, 10);

  const w = Math.max(...rows.map((r) => r.project.length));
  console.log(
    `\nRESTAMP — floors re-derived: >${LAW.exactAtOrBelow} live tests keep ~${((1 - LAW.churnRoom) * 100).toFixed(0)}% churn room, ` +
      `≤${LAW.exactAtOrBelow} sit exact, never under the ${(LAW.band * 100).toFixed(0)}% band.\n` +
      `  Quarantines are subtracted at their DECLARED platform, not the running one.\n` +
      `  Ratchet: max(banked, derived), so an unmoved tree moves nothing.`,
  );
  for (const r of rows)
    console.log(
      `  ${r.project.padEnd(w)}  listed ${String(r.listed).padStart(3)}  live ${String(r.live).padStart(3)}  ` +
        `derived ${String(r.derived).padStart(3)}  floor ${String(r.was).padStart(3)} → ${String(r.now).padStart(3)}` +
        `${r.now < r.was ? "   ↓ LOWERED" : r.now === r.was ? "   ·" : ""}`,
    );
  const moved = rows.filter((r) => r.now !== r.was).length;
  console.log(
    `  ${moved} floor(s) move, ${rows.length - moved} unmoved  ·  ${sha} · ${date} · ` +
      `platform ${process.platform} · ${wave}  ·  live census ` +
      `${rows.reduce((n, r) => n + r.live, 0)} of ${rows.reduce((n, r) => n + r.listed, 0)} listed`,
  );

  // Lowering a floor is a re-baseline, and the house does not re-baseline on a red
  // (check-coverage-floor.mjs's `--allow-lower` law, applied to the same problem).
  const lowered = rows.filter((r) => r.now < r.was);
  if (lowered.length && !allowLower) {
    console.error(
      `\n--restamp REFUSED: ${lowered.length} floor(s) would DROP:\n` +
        lowered.map((r) => `  - ${r.project}: ${r.was} -> ${r.now}`).join("\n") +
        `\n  Say why out loud: --restamp --allow-lower "<where the tests went>".`,
    );
    process.exit(1);
  }
  if (dry) {
    console.log("\n--dry — nothing written.");
    return;
  }
  const next = readStamp();
  next.pw = {
    ...next.pw,
    stamp: {
      sha,
      date,
      platform: process.platform,
      wave,
      note: allowLower ? `LOWERED — ${allowLower}` : "",
    },
    projects: Object.fromEntries(
      rows.map((r) => [
        key(r.file, r.project),
        { listed: r.listed, census: r.live, floor: r.now },
      ]),
    ),
  };
  writeFileSync(STAMP_PATH, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`\nwritten -> scripts/census.stamp.json (pw)`);
}

/* ── main ──────────────────────────────────────────────────────────────────── */

const wantSelfTest = process.argv.includes("--self-test");
const wantRestamp = process.argv.includes("--restamp");

/** The holdout estate, counted by grain and form — the header used to call all of it
 *  "single-engine", which three of the six entries are not. */
const HOLDOUT_CENSUS = (() => {
  const entries = Object.values(HOLDOUTS);
  const rows = entries.flatMap((e) => e.rows ?? []);
  return {
    files: entries.length,
    fileScope: entries.filter((e) => e.engines.length < ENGINES.length).length,
    engineRows: rows.filter((r) => !r.env).length,
    envRows: rows.filter((r) => r.env).length,
  };
})();

console.log(
  `PW PROJECT MATRIX — ${CONFIGS.length} configs, ` +
    `${CONFIGS.reduce((n, c) => n + c.projects.length, 0)} projects, ` +
    `${SPEC_MANIFEST.length} manifest specs, ${HOLDOUT_CENSUS.files} declared holdouts ` +
    `(${HOLDOUT_CENSUS.fileScope} single-engine at file scope, ` +
    `${HOLDOUT_CENSUS.engineRows} engine row + ${HOLDOUT_CENSUS.envRows} env-gated row), ` +
    `${Object.keys(QUARANTINES).length} declared quarantines ` +
    `(T5-W1 1.10 / CH-56 · T7-W6 · T9-W5 §5.2 · T9-W3+W6 seal)\n` +
    `  floors stamped: ${FLOOR_STAMP}\n` +
    `  floors read from scripts/census.stamp.json; band = ` +
    `${(LAW.band * 100).toFixed(0)}% of max(stamped census, live)`,
);

const model = await collect();

if (wantRestamp) {
  const valueOf = (name) => {
    const i = process.argv.indexOf(name);
    return i >= 0 ? (process.argv[i + 1] ?? "(no value given)") : null;
  };
  restamp(model, {
    dry: process.argv.includes("--dry"),
    allowLower: valueOf("--allow-lower"),
    wave: valueOf("--wave") ?? "unlabelled restamp",
  });
  process.exit(0);
}

// THE GATE'S OWN RESOLUTION, printed in full whether or not a floor bites. Two reasons it
// is a whole table now rather than a quarantine footnote: a parked project's real assertion
// count is the number this gate exists to keep visible, and these columns are exactly what
// `--restamp --dry` prints — so the arm and the verdict can be held against each other row
// by row instead of taken on trust (T9-W5 §5.2's round-trip proof).
{
  const names = CONFIGS.flatMap((c) => c.projects.map((p) => p.name));
  const w = Math.max(...names.map((n) => n.length));
  for (const { file, matrix } of model.configs)
    for (const p of CONFIGS.find((c) => c.file === file).projects) {
      const listed = matrix.get(p.name)?.tests ?? 0;
      const live = worstCaseLive(p.name, listed, ctxOf(file, p, matrix));
      const floor = floorOf(file, p.name);
      const row = stampRow(file, p.name);
      console.log(
        `  ${p.name.padEnd(w)}  listed ${String(listed).padStart(3)}  live ${String(live).padStart(3)}  ` +
          `derived ${String(deriveFloor(live)).padStart(3)}  floor ${String(floor).padStart(3)}  ` +
          `band ${String(bandFloor(Math.max(row?.census ?? 0, live))).padStart(3)}` +
          // The gap between listed and live has THREE sources now (T9-W6 §6.3, then the
          // T9-W3+W6 seal) and the column must name which: a platform park, a per-row engine
          // holdout, or an env gate. "Parked" for a row that is really engine-skipped sends
          // the next reader to an empty table; "row-held out of webkit" for an engine-agnostic
          // flag hides that the SAME row is dark in chromium too.
          (live !== listed
            ? `   ← ` +
              shortfallSources(
                p.name,
                p.engine,
                matrix.get(p.name)?.specs ?? new Set(),
              ) +
              (live === 0 ? ", asserts NOTHING there" : "")
            : ""),
      );
    }
}
const failures = [];
for (const [name, fn] of CHECKS) {
  const found = fn(model);
  console.log(
    `  ${found.length ? "✗" : "✓"} ${name}${found.length ? ` — ${found.length}` : ""}`,
  );
  for (const f of found) failures.push(`[${name}] ${f}`);
}

if (wantSelfTest) {
  console.log("\nSELF-TEST — each check against a known-bad matrix:");
  failures.push(...selfTest(model).map((v) => `[SELF-TEST] ${v}`));
}

if (failures.length) {
  console.error(`\n${failures.length} failure(s):\n`);
  for (const f of failures) console.error(`  • ${f}\n`);
  process.exit(1);
}

const total = model.configs.reduce(
  (n, c) => n + [...c.matrix.values()].reduce((k, v) => k + v.tests, 0),
  0,
);
console.log(
  `\nOK — ${model.onDisk.length} specs, ${total} resolved tests, every spec in both engines ` +
    `except the ${HOLDOUT_CENSUS.files} recorded holdouts, and every row live in both except ` +
    `the ${HOLDOUT_CENSUS.engineRows} engine-skipped and ${HOLDOUT_CENSUS.envRows} env-gated ` +
    `rows the record names.`,
);
