#!/usr/bin/env node
/**
 * THE LANE-MEMBERSHIP CENSUS (T7-W6).
 *
 * A gate no lane runs is not a gate — it's a decoy that reads like enforcement. `check-theme-
 * tokens.mjs` (T5-W2 2.3a) and `tdz-probe.mjs` (T5-W2 2.1c) both pass, both self-test, and
 * neither has ever run in CI: one has no npm script at all, the other has `lint:tdz` and no
 * step that calls it. Two instances is a class, and the class is cheap to close — the question
 * "does a CI lane name this file?" is answerable from two files on disk.
 *
 * So this is the LAW for the whole species: every `web/frontend/scripts/check-*.mjs` and
 * `*-probe.mjs` is either named by a CI-reachable command or carries an explicit
 * `NOT-A-LANE:` declaration with a reason and a cite. W1's selector census and W2's occlusion
 * gates land under it on day one, so a new guard cannot ship unwired again.
 *
 * Three checks, all evaluated before the verdict:
 *
 *   1  UNCLAIMED SCRIPT   every corpus file is named by a CI-reachable command, or declares
 *                         itself NOT-A-LANE. Reachability is CI-first and transitive: a
 *                         `run:` command, or an `npm run <name>` in a `web/frontend` step
 *                         resolved through `package.json` (including chained `npm run`s and
 *                         npm's own `pre`/`post` hooks). A package.json script no CI step
 *                         calls is NOT a lane — that is exactly the `lint:tdz` shape.
 *   2  DECLARATION SOUND  a `NOT-A-LANE:` line carries a real reason (>= 40 chars) and a cite,
 *                         and does not contradict itself by sitting on a file CI runs.
 *   3  LANE RESOLVES      the dual: an `npm run <name>` in a `web/frontend` step names a
 *                         script that exists, and a lane that runs `scripts/<corpus file>`
 *                         names a file that is on disk. Deleting a guard out from under its
 *                         step reds here.
 *
 * Only `run:` command text counts. ci.yml narrates these scripts by name in its comments all
 * over — a comment is documentation, not a lane, and treating one as enforcement is the exact
 * false green this exists to refuse.
 *
 * `--root <dir>` points every read at another repo tree, which is how an ablation runs against
 * a scratch copy without touching the live one. `--self-test` runs each check against fixture
 * models — negative controls that must go RED, positive controls that must stay GREEN.
 *
 * Run: `node scripts/check-lane-membership.mjs [--root <dir>] [--self-test]`, cwd web/frontend.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const REPO = (() => {
  const i = process.argv.indexOf("--root");
  const next = i >= 0 ? process.argv[i + 1] : null;
  if (next && !next.startsWith("--")) return path.resolve(next);
  return path.join(import.meta.dirname, "..", "..", "..");
})();

const FRONTEND_REL = "web/frontend";
const SCRIPTS_DIR = path.join(REPO, FRONTEND_REL, "scripts");
const CI_YML = path.join(REPO, ".github", "workflows", "ci.yml");
const PKG_JSON = path.join(REPO, FRONTEND_REL, "package.json");

/**
 * The two name-shapes under this law. `check-*` is the house's gate prefix; `*-probe` is its
 * instrument prefix. Everything else in `scripts/` (`dist-identity.mjs`, `golden-magnitude.mjs`)
 * is a helper a lane composes, not a verdict of its own, and stays out of the corpus.
 */
const CORPUS_FORMS = [/^check-[\w.-]+\.mjs$/, /^[\w.-]+-probe\.mjs$/];
const inCorpus = (name) => CORPUS_FORMS.some((re) => re.test(name));

/**
 * The escape hatch, and its price. The token must OPEN a comment line — `*`, `//`, `#` or
 * nothing but whitespace before it. Prose that QUOTES the token (this file does, twice) is
 * discussing the law, not invoking it, and a census that can't tell those apart declares
 * itself exempt on its own docstring.
 */
const DECLARATION = /^[ \t]*(?:\*|\/\/|#)?[ \t]*NOT-A-LANE:[ \t]*(.+)$/m;
/** Header window. A declaration is a header claim — buried at line 400 it is not a declaration. */
const HEADER_LINES = 60;
/** Minimum reason length. A declaration without a cite is a hole with paperwork. */
const WHY_FLOOR = 40;

/**
 * What counts as a cite: a file the reader can open, a wave/patch symbol, or a ledger row id.
 * Deliberately narrow — "not needed in CI" is a shrug, "superseded by golden-magnitude.mjs" is
 * a claim someone can check.
 */
const CITE_FORMS = [
  ["a path", /\b[\w.@/-]+\.(?:mjs|js|ts|vue|css|md|ya?ml|json|rs|toml|sh)\b/],
  ["a wave symbol", /\bT\d+(?:\.\d+)?-(?:W\d+(?:\.\d+)*|P\d+|R\d+)\b/],
  ["a ledger row", /\b[A-Z]{2,}-\d+\b/],
];
const hasCite = (why) => CITE_FORMS.some(([, re]) => re.test(why));

/* ── reading ci.yml: `run:` scalars only, comments stripped ─────────────────── */

/** Strip shell/YAML comments from a command. A `#` note beside a command is not the command. */
const stripComments = (text) =>
  text
    .split("\n")
    .map((line) => line.replace(/(^|\s)#.*$/, "$1"))
    .join("\n");

const unquote = (s) => s.trim().replace(/^['"]|['"]$/g, "");

/**
 * Every `run:` command in a workflow, with the `working-directory` of its own step. Both scalar
 * forms: inline (`run: npm ci`) and block (`run: |` + an indented body).
 *
 * `working-directory` is step-scoped, so any new list item (`- name:`, `- uses:`, `- run:`)
 * clears it. That scoping is what keeps a repo-root `node scripts/check-doc-truth.mjs` from
 * being read as a frontend lane.
 *
 * @param {string} text
 */
export function ciRunCommands(text) {
  const lines = text.split("\n");
  const out = [];
  let wd = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*-\s+[\w-]+:/.test(line)) wd = null;
    const dir = /^\s*working-directory:\s*(.+)$/.exec(line);
    if (dir) {
      wd = unquote(dir[1]);
      continue;
    }
    const run = /^(\s*(?:-\s+)?)run:\s*(.*)$/.exec(line);
    if (!run) continue;
    const keyCol = line.indexOf("run:");
    const head = run[2].trim();
    if (!/^[|>][-+\d]*$/.test(head)) {
      out.push({ line: i + 1, wd, text: stripComments(head) });
      continue;
    }
    const body = [];
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[j].trim() === "") {
        body.push("");
        continue;
      }
      if (lines[j].length - lines[j].trimStart().length <= keyCol) break;
      body.push(lines[j]);
      i = j;
    }
    out.push({ line: i + 1, wd, text: stripComments(body.join("\n")) });
  }
  return out;
}

/** `npm run <name>` / `npm run-script <name>`, the only chaining form the estate uses. */
export const npmRunNames = (text) =>
  [...text.matchAll(/\bnpm\s+run(?:-script)?\s+([\w:.-]+)/g)].map((m) => m[1]);

/**
 * The transitive closure of a set of npm script names: chained `npm run`s, plus npm's own
 * `pre<name>`/`post<name>` hooks (which run whether or not anyone spelled them — `prebuild`
 * builds the wasm on every `npm run build`).
 *
 * @param {{scripts?: Record<string,string>}} pkg
 * @param {string[]} seeds
 */
export function resolveNpmScripts(pkg, seeds) {
  const scripts = pkg.scripts ?? {};
  const resolved = new Map();
  const missing = [];
  const queue = [...seeds];
  while (queue.length) {
    const name = queue.shift();
    if (resolved.has(name)) continue;
    const cmd = scripts[name];
    if (cmd === undefined) {
      if (!missing.includes(name)) missing.push(name);
      continue;
    }
    resolved.set(name, cmd);
    for (const hook of [`pre${name}`, `post${name}`])
      if (scripts[hook] !== undefined) queue.push(hook);
    queue.push(...npmRunNames(cmd));
  }
  return { resolved, missing };
}

/* ── the model ─────────────────────────────────────────────────────────────── */

/** The `NOT-A-LANE:` claim in a file's header, if it makes one. */
export function declarationOf(text) {
  const header = text.split("\n").slice(0, HEADER_LINES).join("\n");
  const m = DECLARATION.exec(header);
  return m ? m[1].trim().replace(/\s*\*\/\s*$/, "") : null;
}

/**
 * Does this command run `scripts/<name>` in the FRONTEND? Three forms, and nothing looser: a
 * frontend-scoped step spelling the relative path, a repo-scoped step spelling the full path,
 * and a step that cds into the frontend itself.
 */
const namesFile = (lane, name) =>
  (lane.wd === FRONTEND_REL && lane.text.includes(`scripts/${name}`)) ||
  lane.text.includes(`${FRONTEND_REL}/scripts/${name}`) ||
  (lane.text.includes(FRONTEND_REL) && lane.text.includes(`scripts/${name}`));

/**
 * @param {{ciText: string, pkg: object, scripts: {name: string, text: string}[]}} input
 *   `scripts` is every file in the corpus dir — the non-corpus ones are what prove check 1
 *   doesn't demand a lane from a helper.
 */
export function buildModel({ ciText, pkg, scripts }) {
  const commands = ciRunCommands(ciText);
  const seeds = new Set();
  for (const c of commands)
    if (c.wd === FRONTEND_REL) for (const n of npmRunNames(c.text)) seeds.add(n);
  const { resolved, missing } = resolveNpmScripts(pkg, [...seeds]);

  /** Every CI-reachable command text, CI steps and the npm scripts they reach. */
  const lanes = [
    ...commands.map((c) => ({ origin: `ci.yml:${c.line}`, text: c.text, wd: c.wd })),
    ...[...resolved].map(([name, text]) => ({
      origin: `package.json scripts.${name}`,
      text,
      wd: FRONTEND_REL,
    })),
  ];

  const onDisk = new Set(scripts.map((s) => s.name));
  const corpus = scripts
    .filter((s) => inCorpus(s.name))
    .map((s) => ({ name: s.name, declaration: declarationOf(s.text) }))
    .sort((a, b) => a.name.localeCompare(b.name));

  /** name -> the lanes that run it */
  const named = new Map(
    corpus.map(({ name }) => [
      name,
      lanes.filter((l) => namesFile(l, name)).map((l) => l.origin),
    ]),
  );

  /** Every corpus-shaped `scripts/<file>` a lane names, whether or not it's on disk. */
  const refs = [];
  for (const lane of lanes)
    for (const m of lane.text.matchAll(
      /(?:^|[\s"'`(])(?:\.\/)?scripts\/([\w.-]+\.mjs)/g,
    ))
      if (
        inCorpus(m[1]) &&
        (lane.wd === FRONTEND_REL || lane.text.includes(FRONTEND_REL))
      )
        refs.push({ origin: lane.origin, file: m[1] });

  return { corpus, lanes, named, refs, onDisk, npmMissing: missing, resolved };
}

/* ── the checks ────────────────────────────────────────────────────────────── */

function check1UnclaimedScript({ corpus, named }) {
  const bad = [];
  for (const { name, declaration } of corpus) {
    if (named.get(name).length || declaration !== null) continue;
    bad.push(
      `scripts/${name} — NO CI LANE names it and it declares nothing. It runs nowhere, so ` +
        `its green means nothing and its red would never be seen. Wire it (a step beside ` +
        `\`lint:ink\`/\`lint:catch\`, or a \`node scripts/${name}\` run), delete it, or put ` +
        `\`NOT-A-LANE: <reason with a cite>\` in its header (first ${HEADER_LINES} lines).`,
    );
  }
  return bad;
}

function check2DeclarationSound({ corpus, named }) {
  const bad = [];
  for (const { name, declaration } of corpus) {
    if (declaration === null) continue;
    const lanes = named.get(name);
    if (lanes.length)
      bad.push(
        `scripts/${name} declares NOT-A-LANE and ${lanes[0]} runs it. The file contradicts ` +
          `the workflow: strike the declaration, or strike the step.`,
      );
    if (declaration.length < WHY_FLOOR)
      bad.push(
        `scripts/${name} declares NOT-A-LANE with a shrug (${declaration.length} chars, ` +
          `floor ${WHY_FLOOR}): "${declaration}". An unrun gate excused wordlessly is the ` +
          `defect wearing a badge.`,
      );
    else if (!hasCite(declaration))
      bad.push(
        `scripts/${name} declares NOT-A-LANE with no cite: "${declaration}". Name what runs ` +
          `this job instead (${CITE_FORMS.map(([w]) => w).join(", ")}) — a reason a reader ` +
          `can check, not a reason they must take on faith.`,
      );
  }
  return bad;
}

function check3LaneResolves({ refs, onDisk, npmMissing }) {
  const bad = [];
  for (const name of npmMissing)
    bad.push(
      `a web/frontend CI step runs \`npm run ${name}\` and package.json has no such script — ` +
        `the step exits non-zero on every run, or did until someone laundered it.`,
    );
  for (const { origin, file } of refs)
    if (!onDisk.has(file))
      bad.push(
        `${origin} runs \`scripts/${file}\` and no such file exists. A guard was deleted out ` +
          `from under its step.`,
      );
  return bad;
}

const CHECKS = [
  ["1 UNCLAIMED SCRIPT", check1UnclaimedScript],
  ["2 DECLARATION SOUND", check2DeclarationSound],
  ["3 LANE RESOLVES", check3LaneResolves],
];

/* ── self-test: every check shown able to fail, and able to pass ───────────── */

const CI = {
  wiredNpm: `jobs:
  frontend:
    steps:
      - name: ink pressure (graphite ladder, self-tested)
        working-directory: web/frontend
        run: npm run lint:ink
`,
  wiredNode: `jobs:
  fe-unit:
    steps:
      - name: unit count floor
        working-directory: web/frontend
        run: node scripts/check-unit-count.mjs --self-test
`,
  commentOnly: `jobs:
  frontend:
    steps:
      # the theme-token census (check-theme-tokens.mjs) asserts every @theme token
      # has a consumer — see T5-W2 2.3a
      - name: eslint
        working-directory: web/frontend
        run: npm run lint:eslint
`,
  repoRootStep: `jobs:
  record:
    steps:
      - name: doc truth
        run: node scripts/check-theme-tokens.mjs
`,
  transitive: `jobs:
  frontend:
    steps:
      - name: the static gates
        working-directory: web/frontend
        run: npm run verify:static
`,
  ghostScript: `jobs:
  frontend:
    steps:
      - name: a step naming nothing
        working-directory: web/frontend
        run: npm run lint:ghost
`,
  vanishedFile: `jobs:
  frontend:
    steps:
      - name: a step over a deleted guard
        working-directory: web/frontend
        run: node scripts/check-vanished.mjs --self-test
`,
  block: `jobs:
  frontend:
    steps:
      - name: two commands, one step
        working-directory: web/frontend
        run: |
          npm ci
          npm run lint:ink
`,
};

const PKG = {
  scripts: {
    "lint:eslint": "eslint .",
    "lint:ink": "node scripts/check-ink-pressure.mjs --self-test",
    "lint:tdz": "node scripts/tdz-probe.mjs --self-test",
    "verify:static": "npm run lint:eslint && npm run lint:ink",
  },
};

const CITED =
  "superseded by scripts/golden-magnitude.mjs, which the golden lane runs (T5-W1 1.13)";

const F = {
  ink: { name: "check-ink-pressure.mjs", text: "// the graphite ramp" },
  tokens: {
    name: "check-theme-tokens.mjs",
    text: "// THE THEME-TOKEN CENSUS (T5-W2 2.3a)",
  },
  tdz: { name: "tdz-probe.mjs", text: "// THE TDZ PROBE (T5-W2 2.1c)" },
  count: { name: "check-unit-count.mjs", text: "// the unit floor" },
  helper: { name: "golden-magnitude.mjs", text: "// a helper a lane composes" },
  declared: {
    name: "check-theme-tokens.mjs",
    text: `/**\n * THE THEME-TOKEN CENSUS.\n * NOT-A-LANE: ${CITED}\n */`,
  },
  declaredShrug: {
    name: "check-theme-tokens.mjs",
    text: "/**\n * NOT-A-LANE: not needed\n */",
  },
  declaredUncited: {
    name: "check-theme-tokens.mjs",
    text: "/**\n * NOT-A-LANE: nobody has gotten around to wiring this one up yet, sorry\n */",
  },
  declaredButRun: {
    name: "check-ink-pressure.mjs",
    text: `/**\n * NOT-A-LANE: ${CITED}\n */`,
  },
  declaredDeep: {
    name: "check-theme-tokens.mjs",
    text: `${"//\n".repeat(HEADER_LINES + 5)}// NOT-A-LANE: ${CITED}`,
  },
  declarationQuoted: {
    name: "check-theme-tokens.mjs",
    text: "/**\n * A gate may carry a `NOT-A-LANE: <reason>` header instead of a step.\n */",
  },
};

/** [check, expectation, description, ciText, pkg, scripts] */
const FIXTURES = [
  [
    "1 UNCLAIMED SCRIPT",
    "RED",
    "the wave's exact shape — a census with no npm script and no step",
    CI.wiredNpm,
    PKG,
    [F.ink, F.tokens],
  ],
  [
    "1 UNCLAIMED SCRIPT",
    "RED",
    "the tdz shape — a package.json script exists, no CI step calls it",
    CI.wiredNpm,
    PKG,
    [F.ink, F.tdz],
  ],
  [
    "1 UNCLAIMED SCRIPT",
    "RED",
    "the only mention is a ci.yml comment — documentation is not a lane",
    CI.commentOnly,
    PKG,
    [F.tokens],
  ],
  [
    "1 UNCLAIMED SCRIPT",
    "RED",
    "a same-named script under the REPO-ROOT scripts/ — wrong tree, not this lane",
    CI.repoRootStep,
    PKG,
    [F.tokens],
  ],
  [
    "1 UNCLAIMED SCRIPT",
    "RED",
    "a declaration below the header window is not a declaration",
    CI.wiredNpm,
    PKG,
    [F.ink, F.declaredDeep],
  ],
  [
    "1 UNCLAIMED SCRIPT",
    "RED",
    "a header that QUOTES the token is discussing the law, not invoking it",
    CI.wiredNpm,
    PKG,
    [F.ink, F.declarationQuoted],
  ],
  [
    "1 UNCLAIMED SCRIPT",
    "GREEN",
    "positive control — a step runs `npm run lint:ink`, which runs the file",
    CI.wiredNpm,
    PKG,
    [F.ink],
  ],
  [
    "1 UNCLAIMED SCRIPT",
    "GREEN",
    "positive control — a step runs `node scripts/…` directly",
    CI.wiredNode,
    PKG,
    [F.count],
  ],
  [
    "1 UNCLAIMED SCRIPT",
    "GREEN",
    "positive control — reached transitively through a chained npm script",
    CI.transitive,
    PKG,
    [F.ink],
  ],
  [
    "1 UNCLAIMED SCRIPT",
    "GREEN",
    "positive control — a block-scalar `run: |` body counts",
    CI.block,
    PKG,
    [F.ink],
  ],
  [
    "1 UNCLAIMED SCRIPT",
    "GREEN",
    "positive control — a helper is not a gate, and owes no lane",
    CI.wiredNpm,
    PKG,
    [F.ink, F.helper],
  ],
  [
    "1 UNCLAIMED SCRIPT",
    "GREEN",
    "positive control — the declared escape hatch",
    CI.wiredNpm,
    PKG,
    [F.ink, F.declared],
  ],
  [
    "2 DECLARATION SOUND",
    "RED",
    "a declaration whose reason is a shrug",
    CI.wiredNpm,
    PKG,
    [F.ink, F.declaredShrug],
  ],
  [
    "2 DECLARATION SOUND",
    "RED",
    "a long reason that cites nothing checkable",
    CI.wiredNpm,
    PKG,
    [F.ink, F.declaredUncited],
  ],
  [
    "2 DECLARATION SOUND",
    "RED",
    "the file says NOT-A-LANE and a lane runs it",
    CI.wiredNpm,
    PKG,
    [F.declaredButRun],
  ],
  [
    "2 DECLARATION SOUND",
    "GREEN",
    "positive control — reason above the floor, with a cite",
    CI.wiredNpm,
    PKG,
    [F.ink, F.declared],
  ],
  [
    "3 LANE RESOLVES",
    "RED",
    "a step runs an npm script package.json does not have",
    CI.ghostScript,
    PKG,
    [F.ink],
  ],
  [
    "3 LANE RESOLVES",
    "RED",
    "a step runs a guard that is not on disk",
    CI.vanishedFile,
    PKG,
    [F.ink],
  ],
  [
    "3 LANE RESOLVES",
    "GREEN",
    "positive control — every lane names something that exists",
    CI.wiredNpm,
    PKG,
    [F.ink],
  ],
];

function selfTest() {
  const broken = [];
  for (const [target, expect, description, ciText, pkg, scripts] of FIXTURES) {
    const [, fn] = CHECKS.find(([name]) => name === target);
    const found = fn(buildModel({ ciText, pkg, scripts }));
    const got = found.length ? "RED" : "GREEN";
    console.log(`  [${target}] ${description}\n      → ${got} (want ${expect})`);
    if (got !== expect)
      broken.push(
        `check "${target}" answered ${got} where ${expect} was required, on: ${description}. ` +
          (expect === "RED"
            ? "It cannot fail for the defect it names, so it is not a gate."
            : "It reds on a healthy tree, so its greens mean nothing."),
      );
  }
  return broken;
}

/* ── main ──────────────────────────────────────────────────────────────────── */

function collect() {
  for (const [what, p] of [
    ["ci.yml", CI_YML],
    ["package.json", PKG_JSON],
    ["scripts/", SCRIPTS_DIR],
  ])
    if (!fs.existsSync(p))
      throw new Error(
        `no ${what} at ${p}. This gate reads the workflow and the manifest and refuses to ` +
          `run without them rather than degrading to a green.`,
      );
  const scripts = fs
    .readdirSync(SCRIPTS_DIR)
    .filter((name) => name.endsWith(".mjs"))
    .map((name) => ({
      name,
      text: fs.readFileSync(path.join(SCRIPTS_DIR, name), "utf8"),
    }));
  return buildModel({
    ciText: fs.readFileSync(CI_YML, "utf8"),
    pkg: JSON.parse(fs.readFileSync(PKG_JSON, "utf8")),
    scripts,
  });
}

const wantSelfTest = process.argv.includes("--self-test");

let model;
try {
  model = collect();
} catch (err) {
  console.error(`check-lane-membership: ${err.message}`);
  process.exit(2);
}

console.log(
  `LANE-MEMBERSHIP CENSUS — ${model.corpus.length} gate/probe script(s) under ` +
    `${FRONTEND_REL}/scripts, ${model.lanes.length} CI-reachable command(s) ` +
    `(${model.resolved.size} npm script(s) resolved)`,
);
for (const { name, declaration } of model.corpus) {
  const lanes = model.named.get(name);
  console.log(
    `  ${lanes.length || declaration ? "·" : "✗"} ${name} — ${
      lanes.length
        ? lanes.join(", ")
        : declaration
          ? `NOT-A-LANE: ${declaration}`
          : "NOTHING RUNS IT"
    }`,
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
  console.log("\nSELF-TEST — each check against fixture models:");
  failures.push(...selfTest().map((v) => `[SELF-TEST] ${v}`));
}

if (failures.length) {
  console.error(`\n${failures.length} failure(s):\n`);
  for (const f of failures) console.error(`  • ${f}\n`);
  process.exit(1);
}

console.log(
  `\nOK — every gate and probe in ${FRONTEND_REL}/scripts is named by a CI lane or declares ` +
    `itself NOT-A-LANE with a cite, and every lane names something that exists.`,
);
