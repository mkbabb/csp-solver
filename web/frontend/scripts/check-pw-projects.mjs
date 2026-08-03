#!/usr/bin/env node
// NOT-A-LANE: the browser-executing CI lanes (e2e, e2e-webkit, perf-subset) were removed on the owner's ruling of 2026-08-03 — the Playwright suites are local instruments now and this project-matrix lint rides them locally via `npm run test:e2e:projects`; see docs/tranches/2026-08-tranche-7/DISPOSITIONS.md (row O-12).
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
// FLOOR TIMING (W6 §floor timing, binding): the MECHANISM lands here; the NUMBERS restamp at
// WGATE, after the last row lands anywhere in the tranche. `--restamp` is that instrument —
// it re-derives every floor from a live census and stamps the SHA into this file. It is not
// run at W6's own seal: a floor derived here is stale on arrival, which is the exact slack
// these rows exist to remove. The two quarantine subtractions below ARE landed now, because
// leaving them would have the mechanism red the linux lane on its first run.
//
// Run: `node scripts/check-pw-projects.mjs` (npm run test:pw-projects), cwd web/frontend.
//      `--self-test` re-runs each check against a known-bad matrix and FAILS if any of them
//      passes — the canary. It sabotages the collected model rather than the repo, so it needs
//      no branch and leaves no residue.
//      `--restamp` re-derives the floors from the live census and rewrites them in this file
//      (WGATE only). `--restamp --dry` prints the diff and writes nothing.

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

/* FLOOR STAMP — rewritten by `--restamp`, never by hand. It records WHEN the floors below
 * were last derived and from what tree, so a floor citing a tranche-old SHA is legible as
 * slack rather than as a decision. */
const FLOOR_STAMP = "T5-W1 1.10 birth — never restamped";

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

// `floor` is a floor on LIVE tests — listed minus any declared quarantine that applies on
// the running platform. Small projects sit at their exact live count (their arity is
// deliberate); the two big ones carry ~10%'s worth of churn room. Both restamp at WGATE.
const CONFIGS = [
  {
    file: "playwright.config.ts",
    projects: [
      { name: "chromium", engine: "chromium", floor: 115 },
      { name: "webkit", engine: "webkit", floor: 110 },
    ],
  },
  {
    file: "playwright-golden.config.ts",
    projects: [{ name: UNNAMED, engine: "chromium", floor: 4 }],
  },
  {
    file: "playwright-throttle.config.ts",
    projects: [
      { name: "throttled-void", engine: "chromium", floor: 1 },
      { name: "filter-census-chromium", engine: "chromium", floor: 6 },
      { name: "filter-census-webkit", engine: "webkit", floor: 6 },
      { name: "wordmark-webkit", engine: "webkit", floor: 1 },
      { name: "theme-bake-chromium", engine: "chromium", floor: 2 },
      { name: "theme-bake-webkit", engine: "webkit", floor: 0 },
      { name: "theme-quadrants-chromium", engine: "chromium", floor: 14 },
      { name: "theme-quadrants-webkit", engine: "webkit", floor: 14 },
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
  "mobile-affordances.spec.ts",
  "mobile-platform.spec.ts",
  "multiplayer.spec.ts",
  "permalink.spec.ts",
  "prm-void-audition.spec.ts",
  "share-truth.spec.ts",
  "sudoku-interaction.spec.ts",
  "theme-bake-freshness.spec.ts",
  "theme-quadrants.spec.ts",
  "throttled-void.spec.ts",
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

function check5CountFloors({ configs }) {
  const bad = [];
  for (const { file, matrix } of configs)
    for (const p of CONFIGS.find((c) => c.file === file).projects) {
      const got = matrix.get(p.name)?.tests ?? 0;
      const live = liveTests(p.name, got);
      if (live < p.floor)
        bad.push(
          `${file} [${p.name}]: ${live} LIVE tests${live === got ? "" : ` (${got} listed − ${got - live} quarantined)`}, ` +
            `floor ${p.floor}. Tests left the project. Raise the floor only alongside the ` +
            `reason they went.`,
        );
    }
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
  return vacuous;
}

/* ── --restamp: re-derive the floors from a live census (WGATE only) ───────── */

/**
 * The floor rule, stated once so the bank and the gate never diverge: a project with more
 * than ten live tests keeps ~10% of churn room; a smaller one sits at its exact live count,
 * because its arity is a decision and one lost test there is the signal, not noise.
 */
const floorFor = (live) => (live > 10 ? Math.floor(live * 0.9) : live);

function restamp(model, { dry, allowLower }) {
  const src = readFileSync(SELF, "utf8");
  let next = src;
  const rows = [];
  for (const { file, matrix } of model.configs)
    for (const p of CONFIGS.find((c) => c.file === file).projects) {
      const listed = matrix.get(p.name)?.tests ?? 0;
      // WORST CASE across platforms, never the running one. A restamp taken on darwin (where
      // no quarantine applies) would bank floors of 6 and 10 for the two parked projects and
      // red the ubuntu lane on its next run — a floor derived where the defect isn't.
      const q = QUARANTINES[p.name];
      const live = liveTests(p.name, listed, q?.platform ?? process.platform);
      const want = floorFor(live);
      rows.push({ file, project: p.name, listed, live, was: p.floor, now: want });
      // Every project literal is one line: `{ name: "x", engine: "y", floor: N },`.
      const re = new RegExp(
        `(\\{\\s*name:\\s*(?:"${p.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"|UNNAMED)\\s*,[^}]*floor:\\s*)\\d+`,
      );
      if (!re.test(next))
        throw new Error(`--restamp: cannot locate the floor literal for "${p.name}"`);
      next = next.replace(re, `$1${want}`);
    }
  const sha = execFileSync("git", ["rev-parse", "--short", "HEAD"], {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();
  const stamp =
    `${sha} · ${new Date().toISOString().slice(0, 10)} · platform ${process.platform} · ` +
    `live census ${rows.reduce((n, r) => n + r.live, 0)} of ${rows.reduce((n, r) => n + r.listed, 0)} listed`;
  next = next.replace(
    /const FLOOR_STAMP = "[^"]*";/,
    `const FLOOR_STAMP = "${stamp}";`,
  );

  const w = Math.max(...rows.map((r) => r.project.length));
  console.log(
    `\nRESTAMP — floors re-derived: >10 live tests keep ~10% churn room, ≤10 sit exact.\n` +
      `  Quarantines are subtracted at their DECLARED platform, not the running one.`,
  );
  for (const r of rows)
    console.log(
      `  ${r.project.padEnd(w)}  listed ${String(r.listed).padStart(3)}  live ${String(r.live).padStart(3)}  ` +
        `floor ${String(r.was).padStart(3)} → ${String(r.now).padStart(3)}${r.now < r.was ? "   ↓ LOWERED" : ""}`,
    );
  console.log(`  stamp: ${stamp}`);

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
  writeFileSync(SELF, next);
  console.log(`\nwritten -> scripts/${SELF.split("/").pop()}`);
}

/* ── main ──────────────────────────────────────────────────────────────────── */

const wantSelfTest = process.argv.includes("--self-test");
const wantRestamp = process.argv.includes("--restamp");

console.log(
  `PW PROJECT MATRIX — ${CONFIGS.length} configs, ` +
    `${CONFIGS.reduce((n, c) => n + c.projects.length, 0)} projects, ` +
    `${SPEC_MANIFEST.length} manifest specs, ${Object.keys(HOLDOUTS).length} declared ` +
    `single-engine holdouts, ${Object.keys(QUARANTINES).length} declared quarantines ` +
    `(T5-W1 1.10 / CH-56 · T7-W6)\n` +
    `  floors stamped: ${FLOOR_STAMP}`,
);

const model = await collect();

if (wantRestamp) {
  const i = process.argv.indexOf("--allow-lower");
  restamp(model, {
    dry: process.argv.includes("--dry"),
    allowLower: i >= 0 ? (process.argv[i + 1] ?? "(no reason given)") : null,
  });
  process.exit(0);
}

// The live census, printed whether or not a floor bites — a quarantined project's real
// assertion count is the number this gate exists to keep visible.
for (const { file, matrix } of model.configs)
  for (const p of CONFIGS.find((c) => c.file === file).projects) {
    const listed = matrix.get(p.name)?.tests ?? 0;
    const live = liveTests(p.name, listed);
    if (live === listed) continue;
    console.log(
      `  QUARANTINED  ${p.name}: ${listed} listed − ${listed - live} parked on ` +
        `${QUARANTINES[p.name].platform} = ${live} LIVE (floor ${p.floor})` +
        `${live === 0 ? "  ← asserts NOTHING on this platform" : ""}`,
    );
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
