#!/usr/bin/env node
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
//   5  COUNT FLOORS      per (config, project) test counts never fall below the recorded floor.
//
// Run: `node scripts/check-pw-projects.mjs` (npm run test:pw-projects), cwd web/frontend.
//      `--self-test` re-runs each check against a known-bad matrix and FAILS if any of them
//      passes — the canary. It sabotages the collected model rather than the repo, so it needs
//      no branch and leaves no residue.

import { readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import process from "node:process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
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
      { name: "wordmark-webkit", engine: "webkit", floor: 6 },
      { name: "theme-bake-chromium", engine: "chromium", floor: 2 },
      { name: "theme-bake-webkit", engine: "webkit", floor: 2 },
      { name: "theme-quadrants-chromium", engine: "chromium", floor: 14 },
      { name: "theme-quadrants-webkit", engine: "webkit", floor: 14 },
    ],
  },
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

function check5CountFloors({ configs }) {
  const bad = [];
  for (const { file, matrix } of configs)
    for (const p of CONFIGS.find((c) => c.file === file).projects) {
      const got = matrix.get(p.name)?.tests ?? 0;
      if (got < p.floor)
        bad.push(
          `${file} [${p.name}]: ${got} tests, floor ${p.floor}. Tests left the project. Raise ` +
            `the floor only alongside the reason they went.`,
        );
    }
  return bad;
}

const CHECKS = [
  ["1 DECLARED MATRIX", check1DeclaredMatrix],
  ["2 SPEC OWNERSHIP", check2SpecOwnership],
  ["3 ENGINE COVERAGE", check3EngineCoverage],
  ["4 HOLDOUTS CLOSED", check4HoldoutsClosed],
  ["5 COUNT FLOORS", check5CountFloors],
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
  return vacuous;
}

/* ── main ──────────────────────────────────────────────────────────────────── */

const wantSelfTest = process.argv.includes("--self-test");

console.log(
  `PW PROJECT MATRIX — ${CONFIGS.length} configs, ` +
    `${CONFIGS.reduce((n, c) => n + c.projects.length, 0)} projects, ` +
    `${Object.keys(HOLDOUTS).length} declared single-engine holdouts (T5-W1 1.10 / CH-56)`,
);

const model = await collect();
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
