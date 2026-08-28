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
const QUARANTINES = {
  "wordmark-webkit": {
    platform: "linux",
    tests: 5,
    cite: "e2e/linux-webkit-bake-quarantine.ts — the five game rows of wordmark-integrity.spec.ts, THIRD PINNING (CH-62). 1 of 6 rows asserts on ubuntu·webkit.",
  },
  "theme-bake-webkit": {
    platform: "linux",
    tests: 10,
    cite: "e2e/linux-webkit-bake-quarantine.ts — all 10 rows of theme-bake-freshness.spec.ts (2 starts × 5 games), THIRD PINNING (CH-62). 0 of 10 assert on ubuntu·webkit; the project is a name, not a gate, on the platform CI runs.",
  },
};
const QUARANTINE_CITE_FILES = ["e2e/linux-webkit-bake-quarantine.ts"];

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
  "drawer.spec.ts",
  "filter-census.spec.ts",
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
  "prm-void-audition.spec.ts",
  "session-substrate.spec.ts",
  "share-truth.spec.ts",
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
 * The single-engine estate, closed. Each entry is a spec that does NOT run in both engines,
 * the engines it does run in, and the reason — a Playwright API gap, an engine-only defect
 * class, or a row that owns the decision. A spec absent from this table must run in both.
 *
 * CH-56's residue was six specs; it is four, and each of the four carries a cite that can be
 * re-auditioned. `mobile-affordances` and `mobile-platform` left this table at T5-W1 1.10.
 */
const HOLDOUTS = {
  "share-truth.spec.ts": {
    engines: ["chromium"],
    why:
      "PW-WebKit has no clipboard-write permission — `browserContext.grantPermissions: " +
      "Unknown permission: clipboard-write` (re-measured at @playwright/test 1.61.1). The spec " +
      "asserts a REAL clipboard write (share-truth.spec.ts:65,76); there is no honest way to " +
      "grant one there. Cited on the exclusion line in playwright.config.ts.",
  },
  "throttled-void.spec.ts": {
    engines: ["chromium"],
    why:
      "CDP-only: the spec throttles the network through `page.context().newCDPSession(page)` " +
      "(throttled-void.spec.ts:50), and CDP is a Chromium protocol — `:49` says so. Widening " +
      "needs a non-CDP throttle, not a project.",
  },
  "wordmark-integrity.spec.ts": {
    engines: ["webkit"],
    why:
      "WEBKIT-only by charter, the one holdout that runs in the second engine rather than the " +
      "first: the defects it guards are WebKit's own (the SVG-as-image bake at its declared " +
      "intrinsic), so it 'asserts in WebKit or asserts nothing' — playwright-throttle.config.ts:82-83.",
  },
  "visual-golden.spec.ts": {
    engines: ["chromium"],
    why:
      "playwright-golden.config.ts declares no `projects` and no `use.browserName`, so the " +
      "goldens run under Playwright's default engine alone. T5-W1 row 1.13 owns this decision " +
      "(r3/goldens-estate: 'the goldens' chromium-only engine pin argued or widened') — when " +
      "1.13 rules, this entry and the CONFIGS row above move in the same commit. A second " +
      "engine there also needs {projectName} in snapshotPathTemplate; check-golden-bytes.mjs " +
      "check 6 owns that collision.",
  },
};

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
  return bad;
}

/** Tests a project LISTS minus the declared quarantine that applies on this platform. */
function liveTests(projectName, listed, platform = process.platform) {
  const q = QUARANTINES[projectName];
  return q && q.platform === platform ? Math.max(0, listed - q.tests) : listed;
}

/**
 * The WORST CASE across platforms, never the running one — the figure both the band and the
 * restamp reason about. A census taken on darwin, where no quarantine applies, would bank
 * floors of 6 and 10 for the two parked projects and red the ubuntu lane on its next run.
 */
const worstCaseLive = (projectName, listed) =>
  liveTests(
    projectName,
    listed,
    QUARANTINES[projectName]?.platform ?? process.platform,
  );

/** The floor a project owes, from the one stamp; a project with no row owes nothing here (check 8 reds). */
const floorOf = (file, project) => stampRow(file, project)?.floor ?? 0;

function check5CountFloors({ configs }) {
  const bad = [];
  for (const { file, matrix } of configs)
    for (const p of CONFIGS.find((c) => c.file === file).projects) {
      const got = matrix.get(p.name)?.tests ?? 0;
      const live = liveTests(p.name, got);
      const floor = floorOf(file, p.name);
      if (live < floor)
        bad.push(
          `${file} [${p.name}]: ${live} LIVE tests${live === got ? "" : ` (${got} listed − ${got - live} quarantined)`}, ` +
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
      const live = worstCaseLive(p.name, listed);
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
    "4 HOLDOUTS CLOSED",
    "share-truth is widened but the holdout record is left standing",
    (m) => defaultCfg(m).matrix.get("webkit").specs.add("share-truth.spec.ts"),
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
      const live = worstCaseLive(p.name, listed);
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

console.log(
  `PW PROJECT MATRIX — ${CONFIGS.length} configs, ` +
    `${CONFIGS.reduce((n, c) => n + c.projects.length, 0)} projects, ` +
    `${SPEC_MANIFEST.length} manifest specs, ${Object.keys(HOLDOUTS).length} declared ` +
    `single-engine holdouts, ${Object.keys(QUARANTINES).length} declared quarantines ` +
    `(T5-W1 1.10 / CH-56 · T7-W6 · T9-W5 §5.2)\n` +
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
      const live = worstCaseLive(p.name, listed);
      const floor = floorOf(file, p.name);
      const row = stampRow(file, p.name);
      console.log(
        `  ${p.name.padEnd(w)}  listed ${String(listed).padStart(3)}  live ${String(live).padStart(3)}  ` +
          `derived ${String(deriveFloor(live)).padStart(3)}  floor ${String(floor).padStart(3)}  ` +
          `band ${String(bandFloor(Math.max(row?.census ?? 0, live))).padStart(3)}` +
          (live !== listed
            ? `   ← ${listed - live} parked on ${QUARANTINES[p.name].platform}` +
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
    `except the ${Object.keys(HOLDOUTS).length} recorded holdouts.`,
);
