#!/usr/bin/env node
/**
 * check-doc-truth — the doc-canon gate.
 *
 * Thirty-two rows, each of which RE-DERIVES its truth from the artifact at run
 * time and then asserts the docs say that. Nothing here is pinned: every expected
 * value comes off the tree — a byte count off the built `.wasm`, a version off
 * `Cargo.toml`/`package.json`, a test roster off the `#[test]` attributes, an
 * e2e total off `playwright test --list`. When the code moves, the gate moves
 * with it and the prose is what goes red.
 *
 * Zero dependencies, ESM, node-only. Runs identically on ubuntu and darwin.
 *
 * Exit 0 = every row green. Exit 1 = one line per failing site: row id,
 * file:line, expected, got.
 *
 * `--self-test` runs the fixtures instead: each T7-W0 and T7-W5 row against a
 * doc that lies (must RED) and the same claim told true (must GREEN). A row that
 * cannot be shown to red is a decoration; the fixtures are the proof, and the
 * GREEN ones are built from the derivations, so they rot the day the tree moves.
 *
 * A DERIVATION THAT FAILS IS A RED, NEVER A SKIP (T5-W1). The band row used to
 * drop its assertions when it could not read a budget out of the workflow and
 * still print GREEN — banked, both arms, at
 * `docs/tranches/2026-08-tranche-5/evidence/w1/integrator/02-band-canary-BEFORE-AFTER.txt`.
 * Every derivation that can come back empty now says so as a failing site.
 *
 * ── Derivation notes (the toolchain-drift-tolerant choices) ────────────────
 *
 * Rust test count: counted statically — `#[test]` and `#[wasm_bindgen_test]`
 * attributes across `csp-solver/**`, comment lines elided — rather than through
 * `cargo test --list`, which wants a full workspace compile (17 GB of `target/`
 * here) and reports a total that shifts with the toolchain's doctest handling.
 * The static count is the NATIVE host roster: `csp-solver/src` + `csp-solver/
 * tests`. Doctests aren't statically countable, so a doc citing a `cargo test
 * --workspace` total passes when its own split reconciles — total minus the
 * doctests it declares must equal the derived attribute count — and when its
 * test-binary figure equals the derived one (lib targets + integration files).
 *
 * Lean wasm bytes: measured off whichever built artifact is on disk (`pkg/`,
 * a downloaded `lean-pkg/`, or the hashed `dist/` asset). darwin and the CI
 * runner disagree by ~2 KB on the same source — the known toolchain divergence —
 * so a doc site passes by carrying the LOCALLY derived figure. A site stamped
 * with both figures passes on both platforms, which is the shape the canon
 * wants. With no artifact anywhere the row degrades: it derives the runner
 * figure from the CI band comment, says so loudly in the output, and still
 * asserts.
 *
 * Two rows carry a clause their id doesn't name. `ofl-licenses-figures` asserts
 * the font figures at both sites that state them — the README paragraph and the
 * bundled `LICENSES.md`, whose per-family byte column sits inside a license-
 * compliance statement. `install-pin-0.5` also asserts that no published surface
 * links outward into `docs/precepts/`, a submodule of campaign substrate: the
 * pin and the leak are one wave row (T5-W0 0.5) and stay one gate row.
 *
 * The multiplayer rows (T7-W5) read SOURCE as well as docs, and that is the
 * point: the session protocol is documented in four file headers written a
 * tranche apart from each other, so the prose the rows hold to the tree is
 * partly comment. `slug-space-figures` is the one row that reaches outside the
 * repo's own files — it runs the estate's writeable-name regex over the
 * dictionaries `unique-names-generator` actually ships, which wants
 * `web/frontend/node_modules` present, the same tree `playwright test --list`
 * is driven from. Absent, the row reds and says so rather than skipping.
 *
 * The `ci.yml` band comment: hand-copied measurements inside comments are a
 * chronic class (CH-32). The gate asserts only the present-tense "yields A full
 * / B lean" sentence, since the lines below it are an explicitly dated log. The
 * cure is either restamping the lean literal to the derived figure or dropping
 * it — the run line already echoes the live `$RAW`, so absence passes.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const abs = (rel) => join(ROOT, rel);

/**
 * The self-test overlay: a virtual doc layer `--self-test` mounts over the tree.
 *
 * A row that cannot be shown to RED is not a gate, it is a decoration — and the
 * only honest proof is a fixture. `--self-test` mounts prose over the doc paths a
 * row reads, runs that row alone, and asserts the colour. Derivations stay live:
 * every expected value still comes off the real tree, and each GREEN fixture is
 * BUILT from the derivation, so a cure text that rots reds its own self-test.
 * The one exception is declared per case (`stub:`) and exists to reach a posture
 * branch the tree isn't currently in — `chromium-alone-claim`'s single-engine
 * arm has no other way to be exercised while the config declares two projects.
 */
const OVERLAY = new Map();
const has = (rel) => OVERLAY.has(rel) || existsSync(abs(rel));
const read = (rel) =>
  OVERLAY.has(rel)
    ? OVERLAY.get(rel)
    : existsSync(abs(rel))
      ? readFileSync(abs(rel), "utf8")
      : null;
const bytes = (rel) => statSync(abs(rel)).size;
const fmt = (n) => n.toLocaleString("en-US");
const num = (s) => Number(String(s).replace(/,/g, ""));

/** Every line of `rel` matching `re`, 1-indexed, with the match. */
function grep(rel, re) {
  const text = read(rel);
  if (text === null) return [];
  const flags = re.flags.includes("g") ? re.flags : re.flags + "g";
  return text.split("\n").flatMap((line, i) => {
    const m = [...line.matchAll(new RegExp(re.source, flags))];
    return m.length ? [{ file: rel, line: i + 1, text: line.trim(), m }] : [];
  });
}

/** Recursive file walk, `skip` matched against each directory name. */
function walk(rel, ext, skip = /^(target|node_modules|\.venv|\.git|pkg|dist)$/) {
  const out = [];
  const rec = (dir) => {
    for (const e of readdirSync(abs(dir), { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (!skip.test(e.name)) rec(join(dir, e.name));
      } else if (e.name.endsWith(ext)) out.push(join(dir, e.name));
    }
  };
  if (has(rel)) rec(rel);
  return out;
}

const DOCS = [
  "README.md",
  ...(has("docs")
    ? readdirSync(abs("docs"))
        .filter((f) => f.endsWith(".md"))
        .map((f) => `docs/${f}`)
    : []),
  "csp-solver/README.md",
  "csp-solver/wasm/README.md",
  "csp-solver/wasm/pkg/README.md",
  "web/frontend/README.md",
].filter(has);

// ── derivations ────────────────────────────────────────────────────────────

/** The lean ship artifact's raw size, and where it was measured. */
function deriveLeanWasm() {
  const fixed = [
    "csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm",
    "lean-pkg/csp_solver_wasm_bg.wasm",
  ].find(has);
  if (fixed) return { size: bytes(fixed), source: fixed, degraded: false };

  const distDir = "web/frontend/dist/assets";
  const hashed =
    has(distDir) &&
    readdirSync(abs(distDir)).find((f) => /^csp_solver_wasm_bg-.*\.wasm$/.test(f));
  if (hashed)
    return {
      size: bytes(join(distDir, hashed)),
      source: join(distDir, hashed),
      degraded: false,
    };

  const band = grep(".github/workflows/ci.yml", /runner measures ([\d,]+) B/);
  if (band.length) {
    return {
      size: num(band[0].m[0][1]),
      source: `${band[0].file}:${band[0].line} (CI band config — NO artifact on disk)`,
      degraded: true,
    };
  }
  return {
    size: null,
    source: "unmeasurable — no artifact, no band config",
    degraded: true,
  };
}

/** `playwright test --list` totals for a config. */
function pwList(configArgs = []) {
  const cwd = abs("web/frontend");
  const local = join(cwd, "node_modules/.bin/playwright");
  const [bin, head] = existsSync(local) ? [local, []] : ["npx", ["playwright"]];
  try {
    const out = execFileSync(bin, [...head, "test", "--list", ...configArgs], {
      cwd,
      encoding: "utf8",
      timeout: 180_000,
      maxBuffer: 64 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const m = out.match(/Total:\s+(\d+)\s+tests?\s+in\s+(\d+)\s+files?/);
    return m
      ? { tests: Number(m[1]), files: Number(m[2]) }
      : { error: "no Total: line in --list output" };
  } catch (e) {
    const m = String(e.stdout ?? "").match(
      /Total:\s+(\d+)\s+tests?\s+in\s+(\d+)\s+files?/,
    );
    return m
      ? { tests: Number(m[1]), files: Number(m[2]) }
      : { error: (e.message ?? String(e)).split("\n")[0] };
  }
}

/** Native `#[test]` roster, wasm-only roster, and the test-binary count. */
function deriveRustTests() {
  const isComment = (l) => /^\s*(\/\/|\*|\/\*)/.test(l);
  let native = 0;
  let wasm = 0;
  for (const f of walk("csp-solver", ".rs")) {
    const wasmCrate = f.includes("csp-solver/wasm/");
    for (const line of readFileSync(abs(f), "utf8").split("\n")) {
      if (isComment(line)) continue;
      const t = (line.match(/#\[test\]/g) ?? []).length;
      const w = (line.match(/#\[wasm_bindgen_test\]/g) ?? []).length;
      if (wasmCrate) wasm += t + w;
      else native += t + w;
    }
  }
  const members = (read("Cargo.toml")?.match(/members\s*=\s*\[([^\]]*)\]/)?.[1] ?? "")
    .split(",")
    .map((s) => s.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
  const binaries = members.reduce((n, m) => {
    const lib = has(join(m, "src/lib.rs")) ? 1 : 0;
    const its = has(join(m, "tests"))
      ? readdirSync(abs(join(m, "tests"))).filter((f) => f.endsWith(".rs")).length
      : 0;
    return n + lib + its;
  }, 0);
  return { native, wasm, binaries, members };
}

/** Font subsets and their OFL texts. */
function deriveFonts() {
  const dir = "web/frontend/src/assets/fonts";
  if (!has(dir)) return { subsets: [], total: 0, ofl: [], paired: false, dir };
  const files = readdirSync(abs(dir));
  const subsets = files.filter((f) => f.endsWith(".woff2")).sort();
  const ofl = files.filter((f) => /^OFL-.*\.txt$/i.test(f)).sort();
  const family = (f) => f.replace(/^OFL-|-subset\.woff2$|\.txt$/gi, "").toLowerCase();
  const paired =
    subsets.length === ofl.length &&
    subsets.every((s) => ofl.some((o) => family(o) === family(s)));
  return {
    dir,
    subsets,
    ofl,
    paired,
    total: subsets.reduce((n, f) => n + bytes(join(dir, f)), 0),
  };
}

/** Byte figures the docs themselves declare stale. */
function deriveStaleFigures() {
  return DOCS.flatMap((rel) =>
    grep(rel, /\bstale\b/i).flatMap((h) =>
      [...h.text.matchAll(/(\d{2,3},\d{3})\s*B\b/g)].map((m) => ({
        site: `${h.file}:${h.line}`,
        value: num(m[1]),
      })),
    ),
  );
}

/**
 * Enforced twiggy bands, read out of the workflow's own guards.
 *
 * The scan window is the STEP, not a line count. The 25-line window this
 * replaced was one line too short for a four-line comment edit inside the lean
 * step: `-gt 127500` fell out of range, the band re-derived as 0 B, and the row
 * printed GREEN with its assertion silently gone (T5-W0 f3-notes.md §c.4, and
 * the mechanized canary at evidence/w1/integrator/02-band-canary-BEFORE-AFTER.txt).
 * A step ends where the next `- name:`/`- uses:` item at its own indent begins,
 * or where the steps list dedents — so a comment of any length rides inside it.
 *
 * Every band that cannot be derived comes back `null` with a note naming why;
 * the row turns those into failing sites rather than dropping the check.
 */
function deriveBands() {
  const rel = ".github/workflows/ci.yml";
  const text = read(rel);
  const notes = [];
  if (text === null) {
    notes.push(`${rel}: file absent`);
    return { fullFail: null, fullWarn: null, leanFail: null, notes };
  }
  const lines = text.split("\n");
  const stepValues = (anchor, label) => {
    const i = lines.findIndex((l) => anchor.test(l));
    if (i < 0) {
      notes.push(
        `${label}: no line in ${rel} matches ${anchor} — the step was renamed or removed`,
      );
      return [];
    }
    const indent = lines[i].match(/^\s*/)[0].length;
    let end = i + 1;
    while (end < lines.length) {
      const l = lines[end];
      if (l.trim() !== "") {
        const ind = l.match(/^\s*/)[0].length;
        if (ind < indent) break; // dedented out of the steps list
        if (ind === indent && /^\s*-\s/.test(l)) break; // the next step item
      }
      end++;
    }
    const vals = lines
      .slice(i, end)
      .flatMap((l) => [...l.matchAll(/-gt\s+(\d+)/g)].map((m) => Number(m[1])));
    if (!vals.length)
      notes.push(`${label}: no \`-gt <n>\` guard between ${rel}:${i + 1} and :${end}`);
    return vals;
  };
  const [fullFail = null, fullWarn = null] = stepValues(
    /twiggy top \+ raw-size budget/,
    "full band",
  );
  const [leanFail = null] = stepValues(/lean raw-size budget/, "lean band");
  return { fullFail, fullWarn, leanFail, notes };
}

/** The workflow's own job keys — the lanes the README counts. */
function deriveCiLanes() {
  const rel = ".github/workflows/ci.yml";
  const lines = (read(rel) ?? "").split("\n");
  const start = lines.findIndex((l) => /^jobs:\s*$/.test(l));
  if (start < 0) return { rel, jobs: [] };
  const jobs = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (/^\S/.test(lines[i])) break; // a new top-level key ends `jobs:`
    const m = lines[i].match(/^ {4}([a-z][\w-]*):\s*$/);
    if (m) jobs.push(m[1]);
  }
  return { rel, jobs };
}

/**
 * The `--flag` / `--flag value` set of a wasm-pack command line, sorted so a
 * reordering is not a difference. A flag takes the next token as its value ONLY
 * when that token looks like one: prose around a documented command line ends in
 * arrows and punctuation (`--no-default-features → pkg/`), and swallowing those
 * would make the doc's recipe differ from the Makefile's for no reason.
 */
const wasmPackFlags = (text) =>
  [...text.matchAll(/--[a-z][a-z-]*(?:[ \t]+[\w@./][\w@./-]*)?/g)]
    .map((m) => m[0].replace(/\s+/g, " ").trim())
    .sort();

/**
 * The `make wasm` recipe as the Makefile actually runs it, plus the comment
 * block that describes it. CH-32's class: a hand-written claim about a command,
 * sitting beside the command itself, drifting from it.
 */
function deriveWasmMake() {
  const rel = "csp-solver/wasm/Makefile";
  const text = read(rel);
  if (text === null) return { rel, build: null, flags: [], comment: [] };
  const lines = text.split("\n");
  const i = lines.findIndex((l) => /^wasm:\s*$/.test(l));
  if (i < 0) return { rel, build: null, flags: [], comment: [] };
  const recipe = [];
  for (let k = i + 1; k < lines.length && /^\t/.test(lines[k]); k++)
    recipe.push({ line: k + 1, text: lines[k].trim() });
  const build = recipe.find((r) => /wasm-pack build/.test(r.text)) ?? null;
  const flags = build ? wasmPackFlags(build.text) : [];
  const comment = [];
  for (let k = i - 1; k >= 0 && /^#/.test(lines[k]); k--)
    comment.unshift({ line: k + 1, text: lines[k] });
  return {
    rel,
    build,
    recipe,
    flags,
    comment,
    lean: flags.includes("--no-default-features"),
  };
}

/**
 * The ENFORCED iai golden, read through the workflow's own gate invocation —
 * the baseline path comes off ci.yml, not out of this file, so a repointed
 * baseline moves the gate with it.
 */
function deriveIai() {
  const rel = ".github/workflows/ci.yml";
  const ci = read(rel) ?? "";
  const bench = ci.match(/IAI_BENCH:\s*(\S+)/)?.[1] ?? null;
  // Anchored on the INVOCATION (`bash …/iai_gate.sh <log> <baseline>`), not on
  // any mention of the gate: the lane comment names both the script and the
  // baseline in prose, and a loose match reads the prose as configuration.
  // `[\w./-]+` rather than `\S+` so a backticked path is one path.
  const cited = [
    ...new Set(
      [
        ...ci.matchAll(
          /bash\s+[\w./-]*iai_gate\.sh[\s\S]{0,300}?([\w./-]+\.baseline)/g,
        ),
      ].map((m) => m[1]),
    ),
  ];
  const gate = cited[0] ?? null;
  const out = {
    rel,
    bench,
    path: gate,
    cited,
    count: null,
    tolerancePct: ci.match(/IAI_TOLERANCE_PCT:\s*'?([\d.]+)/)?.[1] ?? null,
    why: [],
  };
  if (!bench) out.why.push(`${rel}: no IAI_BENCH env to name the bench`);
  if (!gate)
    out.why.push(
      `${rel}: no \`bash …/iai_gate.sh <log> <baseline>\` invocation — the lane grades nothing`,
    );
  if (gate && !has(gate))
    out.why.push(`${gate}: the workflow's gate baseline does not exist on disk`);
  if (gate && has(gate)) {
    const line = read(gate)
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith("#"));
    const n = line && /^\d+$/.test(line) ? Number(line) : null;
    if (n === null)
      out.why.push(
        `${gate}: no bare instruction count on its first non-comment line (read ${JSON.stringify(line ?? "")})`,
      );
    out.count = n;
  }
  if (bench && !has(`csp-solver/benches/${bench}.rs`))
    out.why.push(
      `csp-solver/benches/${bench}.rs: IAI_BENCH names a bench with no source`,
    );
  if (bench && gate && !gate.endsWith(`${bench}.baseline`))
    out.why.push(
      `${gate} does not belong to bench ${bench} — the gate grades a baseline minted for something else`,
    );
  if (cited.length > 1)
    out.why.push(
      `${rel} invokes the gate against ${cited.length} baselines (${cited.join(", ")}) — the enforced golden is ambiguous`,
    );
  return out;
}

// ── T7-W0 derivations: the doc-drift census (D1–D20) ───────────────────────

/** Words 0–20, for the docs that spell their counts. */
const WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
];

/** A repo walk that also refuses the agent worktrees under `.claude/`. */
const SKIP_DIRS =
  /^(target|node_modules|\.venv|\.git|\.claude|pkg|lean-pkg|dist|runs|coverage|test-results|playwright-report)$/;

/**
 * The games whose permalink is WIRED, read off the specs themselves: a game
 * carries a shareable board iff its `spec.ts` declares a `urlCodec`. CH-16's
 * inversion survived three tranches because every site restated the claim and
 * nothing read the specs.
 */
function derivePermalinkGames() {
  const dir = "web/frontend/src/games";
  if (!has(dir)) return { wired: [], all: [], dir };
  const all = readdirSync(abs(dir), { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== "shared")
    .map((e) => e.name)
    .sort();
  const wired = all.filter((g) =>
    /urlCodec\s*:/.test(read(`${dir}/${g}/spec.ts`) ?? ""),
  );
  return { dir, all, wired };
}

/** Every `*.worker.ts` the shipped frontend source declares. */
function deriveWorkers() {
  const out = [];
  const rec = (rel) => {
    for (const e of readdirSync(abs(rel), { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (!SKIP_DIRS.test(e.name)) rec(join(rel, e.name));
      } else if (/\.worker\.ts$/.test(e.name)) out.push(join(rel, e.name));
    }
  };
  if (has("web/frontend/src")) rec("web/frontend/src");
  return out.sort();
}

/** `ConstraintEnum`'s variants, parsed from the enum itself. */
function deriveConstraintVariants() {
  const rel = "csp-solver/src/constraint/dispatch.rs";
  const text = read(rel);
  if (text === null) return { rel, variants: [] };
  const body = text.match(/pub enum ConstraintEnum<[^>]*>\s*\{([\s\S]*?)\n\}/);
  if (!body) return { rel, variants: [] };
  const variants = [...body[1].matchAll(/^\s*([A-Z]\w*)\s*\(/gm)].map((m) => m[1]);
  return { rel, variants };
}

/** The `[[bench]]` roster, off the manifest that declares it. */
function deriveBenchTargets() {
  const rel = "csp-solver/Cargo.toml";
  const text = read(rel) ?? "";
  const names = [...text.matchAll(/\[\[bench\]\]\s*\nname\s*=\s*"([^"]+)"/g)].map(
    (m) => m[1],
  );
  return { rel, names: [...new Set(names)].sort() };
}

/** The two gate-script rosters, off the directories that hold them. */
function deriveScriptRosters() {
  const roster = (dir, re) =>
    has(dir)
      ? readdirSync(abs(dir))
          .filter((f) => re.test(f))
          .sort()
      : [];
  return {
    frontendDir: "web/frontend/scripts",
    frontend: roster("web/frontend/scripts", /\.mjs$/),
    rootDir: "scripts",
    root: roster("scripts", /\.(mjs|sh)$/),
  };
}

/** `_redirects`, as Cloudflare reads it: rules are the non-comment lines. */
function deriveRedirects() {
  const rel = "web/frontend/public/_redirects";
  const text = read(rel);
  if (text === null) return { rel, rules: [] };
  const rules = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
  return { rel, rules };
}

/**
 * The perf rig's scenario table, partitioned the way the rig itself partitions
 * it: keys off `probe.js`'s `SCENARIOS`, the diagnostic ones off their own
 * `"diagnostic only"` note, the default set off the drivers' `SCENARIOS=`
 * default, and the CI-gated ones off `ci-subset.mjs`'s query strings.
 */
function deriveScenarios() {
  const probeRel = "web/frontend/perf-rig/probe.js";
  const text = read(probeRel);
  if (text === null)
    return { probeRel, keys: [], diagnostic: [], defaults: [], gated: [] };
  const lines = text.split("\n");
  const start = lines.findIndex((l) => /var SCENARIOS = \{/.test(l));
  const keys = [];
  const diagnostic = [];
  if (start >= 0) {
    let cur = null;
    for (let i = start + 1; i < lines.length; i++) {
      if (/^\s{2}\};/.test(lines[i])) break;
      const m = lines[i].match(/^\s{4}([A-Za-z_]\w*):\s*\{/);
      if (m) {
        cur = m[1];
        keys.push(cur);
      }
      if (cur && /"diagnostic only"/.test(lines[i]) && !diagnostic.includes(cur))
        diagnostic.push(cur);
    }
  }
  const defaults = [
    ...new Set(
      [
        "web/frontend/perf-rig/run-sim.sh",
        "web/frontend/perf-rig/run-safari.sh",
      ].flatMap(
        (r) =>
          (read(r) ?? "").match(/SCENARIOS="\$\{2:-([^"}]+)\}"/)?.[1]?.split(",") ?? [],
      ),
    ),
  ];
  const ci = read("web/frontend/perf-rig/ci-subset.mjs") ?? "";
  const gated = [
    ...new Set(
      [...ci.matchAll(/__scenarios=([\w,]+)/g)].flatMap((m) => m[1].split(",")),
    ),
  ].sort();
  return { probeRel, keys, diagnostic, defaults, gated };
}

/**
 * The docs whose backticked paths are asserted against the tree, and the tree
 * index those paths resolve into.
 */
const CITED_DOCS = DOCS.filter(
  (d) => d === "README.md" || d === "web/frontend/README.md" || d.startsWith("docs/"),
);

const PATH_EXT =
  /\.(ts|tsx|vue|rs|mjs|cjs|js|json|toml|sh|ya?ml|css|html|baseline|lock|wasm|py|jsonl)$/;

/** Every source basename in the tree (campaign substrate deliberately out). */
function deriveBasenames() {
  const out = new Map();
  const rec = (rel) => {
    for (const e of readdirSync(abs(rel), { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (!SKIP_DIRS.test(e.name) && join(rel, e.name) !== "docs/tranches")
          rec(join(rel, e.name));
      } else if (PATH_EXT.test(e.name) && !out.has(e.name))
        out.set(e.name, join(rel, e.name));
    }
  };
  rec("");
  return out;
}

/**
 * A doc line that RETIRES or FOREIGN-SOURCES a path is not claiming it exists.
 * `backtrack.rs`/`backjump.rs` are named as the files the kernel unification
 * replaced; `prefix.rs`/`lr.rs` and `sync-csp-solver-vendor.sh` are bbnf-lang's.
 * Reading those as broken cites would make the row lie in the other direction.
 */
const RETIRED_LINE =
  /\b(former(?:ly)?|excised|retired|deleted|removed|dead|no longer|went out|is gone|bbnf-lang|not reproducible here)\b/i;

/** Prefixes that are campaign substrate or gitignored build output. */
const OFF_TREE_PREFIX =
  /^(evidence|docs\/tranches|node_modules|target|pkg|dist|runs|lean-pkg)\//;

const PATH_ALIAS = [
  [/^@games\//, "web/frontend/src/games/"],
  [/^@pencil\//, "web/frontend/src/pencil/"],
  [/^@\//, "web/frontend/src/"],
];

/** The roots a relative source cite legitimately hangs off. */
const PATH_BASES = [
  "",
  "web/frontend/",
  "web/frontend/src/",
  "csp-solver/",
  "csp-solver/src/",
];

/** Resolve a cited path; `null` when nothing in the tree answers to it. */
function resolveCite(tok, docRel) {
  let t = tok;
  for (const [re, to] of PATH_ALIAS) if (re.test(t)) t = t.replace(re, to);
  for (const b of [...PATH_BASES, dirname(docRel) + "/"]) {
    const p = join(b, t).replace(/^\.\//, "");
    if (has(p)) return p;
  }
  return null;
}

/**
 * The file-tree blocks: every node the tree draws, plus every child its own
 * trailing comment names. D4's `SudokuBoard/`/`KillerCage/` live in those
 * comments, which is why a backtick-only scan never reached them.
 */
function treeCites(rel) {
  const lines = (read(rel) ?? "").split("\n");
  const out = [];
  let inFence = false;
  let base = null;
  let stack = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      base = null;
      stack = [];
      continue;
    }
    if (!inFence) continue;
    if (base === null) {
      const r = line.match(/^(\.|[\w.-]+\/)\s*$/);
      if (r) base = r[1] === "." ? "" : rel.includes("/") ? dirname(rel) + "/" : "";
      continue;
    }
    const m = line.match(/^((?:[│|]\s{3}|\s{4})*)(?:├──|└──)\s+(\S+)/);
    if (!m) continue;
    const depth = Math.floor(m[1].length / 4);
    const isDir = m[2].endsWith("/");
    stack.length = depth;
    stack[depth] = m[2].replace(/\/$/, "");
    const node = base + stack.slice(0, depth + 1).join("/");
    out.push({ line: i + 1, path: node, tok: m[2] });
    const comment = line.slice(m[0].length).match(/#\s*(.*)$/);
    if (!isDir || !comment) continue;
    for (const raw of comment[1].split(/[\s,;·]+/)) {
      const t = raw.replace(/^[(+[]+/, "").replace(/[)\].,:;]+$/, "");
      if (/^[A-Za-z][\w.-]*\/$/.test(t))
        out.push({ line: i + 1, path: `${node}/${t.replace(/\/$/, "")}`, tok: t });
    }
  }
  return out;
}

// ── T7-W5 derivations: the multiplayer seam ────────────────────────────────
//
// The session is one protocol written down in two places that no gate held
// together: a client under `web/frontend/src/games/shared` and a Durable Object
// under `web/relay`, whose only commit predates the client that speaks to it.
// Every derivation below reads the seam's OWN declarations — the CSP grant, the
// `Kind` union, `EVENT_KIND`, `RETRY_MS`, the writeable-slug regex, the ink
// template, the stress consts — so the prose is what moves when the code does.

const MP = {
  relay: "web/relay/relay.ts",
  relayTest: "web/relay/relay.test.ts",
  toml: "web/relay/wrangler.toml",
  headers: "web/frontend/public/_headers",
  session: "web/frontend/src/games/shared/useSession.ts",
  wire: "web/frontend/src/games/shared/relayWire.ts",
  wireTest: "web/frontend/src/games/shared/relayWire.test.ts",
  ident: "web/frontend/src/games/shared/playerIdentity.ts",
  css: "web/frontend/src/assets/index.css",
  stress: "web/frontend/src/games/shared/useSession.stress.test.ts",
  undo: "web/frontend/src/games/shared/useUndoHistory.ts",
  page: "docs/multiplayer.md",
};

/**
 * The prose a multiplayer claim can be made in: the published docs plus the four
 * headers that ARE this protocol's documentation. `docs/multiplayer.md` joins
 * through `DOCS` the moment it exists, so the page inherits every row below.
 */
const mpProse = () => [...DOCS, MP.session, MP.wire, MP.relay];

/** Windows of `span` lines over `rel`, 1-indexed at the window's first line. */
function windows(rel, span = 2) {
  const lines = (read(rel) ?? "").split("\n");
  return lines.map((_, i) => ({
    file: rel,
    line: i + 1,
    text: lines
      .slice(i, i + span)
      .join(" ")
      .trim(),
  }));
}

/**
 * Sentences, for the claims that outrun a line. A band stated as "0.5 on paper
 * and 0.8 at night" wraps in every file that states it, and a sliding window
 * always has an edge that holds half of it — which would red on the true prose.
 * Comment furniture comes off first so the sentence reads as the author wrote it.
 */
function sentences(rel) {
  return (read(rel) ?? "")
    .replace(/^\s*(\/\*+|\*+\/|\*|\/\/|#)\s?/gm, "")
    .replace(/\s*\n\s*/g, " ")
    .split(/(?<=[.!?;])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const digits = (s) => Number(String(s).replace(/[_,]/g, ""));
const hostOf = (u) => (u ? u.replace(/^wss:\/\//, "").replace(/\/.*$/, "") : null);

/**
 * The relay's identity, in the three files that each hold a copy of it: the CSP
 * `connect-src` grant, the client's `RELAY_URLS` default, and the Worker's name.
 */
function deriveRelayOrigin() {
  const policy =
    (read(MP.headers) ?? "").match(/^\s*Content-Security-Policy:.*$/m)?.[0] ?? "";
  const csp = policy.match(/connect-src[^;]*?(wss:\/\/[^\s;]+)/)?.[1] ?? null;
  const url =
    (read(MP.session) ?? "")
      .match(/const RELAY_URLS\s*=\s*\[([\s\S]*?)\]/)?.[1]
      ?.match(/"(wss:\/\/[^"]+)"/)?.[1] ?? null;
  const name = (read(MP.toml) ?? "").match(/^name\s*=\s*"([^"]+)"/m)?.[1] ?? null;
  return { csp, url, name, cspHost: hostOf(csp), urlHost: hostOf(url) };
}

/** The ephemeral kind, on both sides of the seam, and the range it is drawn from. */
function deriveEventKind() {
  const kindOf = (rel) =>
    read(rel)?.match(/const EVENT_KIND\s*=\s*([\d_]+)/)?.[1] ?? null;
  const range = (read(MP.wire) ?? "").match(/(\d{5})\s*[–—-]\s*(\d{5})/);
  const client = kindOf(MP.wire);
  const test = kindOf(MP.relayTest);
  return {
    kind: client === null ? null : digits(client),
    testKind: test === null ? null : digits(test),
    range: range ? [digits(range[1]), digits(range[2])] : [],
  };
}

/**
 * The wire's grammar. `Kind` is the session's own three; the fourth word rides
 * the `Kind | "bye"` extension every arm widens its signature with — it never
 * reaches `onMessage`, which is exactly why the type says three and the wire
 * speaks four. `sent` is the other direction: every kind literal this estate
 * actually puts on a socket, so a fifth word reds the row from the code.
 */
function deriveWireVerbs() {
  const session = read(MP.session) ?? "";
  const wire = read(MP.wire) ?? "";
  const lits = (s, re) => [...s.matchAll(re)].map((m) => m[1]);
  const kinds = lits(
    session.match(/export type Kind\s*=\s*([^;]+);/)?.[1] ?? "",
    /"(\w+)"/g,
  );
  const extra = lits([session, wire].join("\n"), /Kind\s*\|\s*"(\w+)"/g);
  const sent = [
    ...lits(session, /\b(?:wire\.send|post)\(\s*"(\w+)"/g),
    ...lits(wire, /\bsend\(\s*"(\w+)"/g),
    ...lits(read(MP.relay) ?? "", /\bkind:\s*"(\w+)"/g),
  ];
  return {
    kinds,
    verbs: [...new Set([...kinds, ...extra])],
    sent: [...new Set(sent)].sort(),
  };
}

/**
 * The writeable name space: the estate's OWN filter regex applied to the OWN
 * dictionaries the app ships, not a count anyone typed. The library is required
 * out of the frontend's `node_modules` — the same tree `playwright test --list`
 * is driven from a few rows up.
 */
function deriveSlugSpace() {
  const src = read(MP.ident) ?? "";
  const source = src.match(/const WRITEABLE\s*=\s*\/([^/]+)\//)?.[1] ?? null;
  if (!source) return { source: null, rows: [], names: null, error: null };
  let dicts = null;
  let error = null;
  try {
    dicts = createRequire(abs("web/frontend/package.json"))("unique-names-generator");
  } catch (e) {
    error = String(e.message).split("\n")[0];
  }
  if (!dicts) return { source, rows: [], names: null, error };
  const re = new RegExp(source);
  const rows = ["adjectives", "animals"]
    .filter((k) => Array.isArray(dicts[k]))
    .map((k) => ({
      k,
      all: dicts[k].length,
      kept: dicts[k].filter((w) => re.test(w)).length,
    }));
  return {
    source,
    rows,
    names: rows.length === 2 ? rows.reduce((a, r) => a * r.kept, 1) : null,
    error,
  };
}

/** The peer-ink formula: one template in `playerIdentity.ts`, one band in the CSS. */
function deriveInk() {
  const src = read(MP.ident) ?? "";
  const tpl = src.match(/oklch\(var\((--[\w-]+)\)\s+([\d.]+)\s/);
  const angle = src.match(/index \* ([\d.]+)/)?.[1] ?? null;
  const wheel = src.match(/index \* [\d.]+\)\s*%\s*(\d+)/)?.[1] ?? null;
  const varName = tpl?.[1] ?? null;
  const band = varName
    ? [
        ...(read(MP.css) ?? "").matchAll(
          new RegExp(`${varName}\\s*:\\s*([\\d.]+)`, "g"),
        ),
      ].map((m) => m[1])
    : [];
  return {
    varName,
    chroma: tpl?.[2] ?? null,
    angle,
    wheel,
    band,
    light: band[0] ?? null,
    dark: band[1] ?? null,
  };
}

/** The large run's dimensions, off the stress file, against the SHIPPED undo cap. */
function deriveStress() {
  const s = read(MP.stress) ?? "";
  const c = (name) => {
    const m = s.match(new RegExp(`const ${name}\\s*=\\s*([\\d_]+)`));
    return m ? digits(m[1]) : null;
  };
  const shipped = read(MP.undo)?.match(/const UNDO_CAP\s*=\s*([\d_]+)/)?.[1] ?? null;
  return {
    ops: c("OPS"),
    authors: c("AUTHORS"),
    cells: c("CELLS"),
    cap: c("UNDO_CAP"),
    shippedCap: shipped === null ? null : digits(shipped),
  };
}

/** Lines: the shipped module, and the whole directory it sits in. */
function deriveRelayLoc() {
  const count = (rel) => {
    const text = read(rel);
    if (text === null) return { total: 0, code: 0 };
    const lines = text.split("\n");
    if (lines[lines.length - 1] === "") lines.pop();
    let block = false;
    let code = 0;
    for (const raw of lines) {
      const t = raw.trim();
      if (block) {
        if (t.includes("*/")) block = false;
        continue;
      }
      if (!t || t.startsWith("//") || t.startsWith("#")) continue;
      if (t.startsWith("/*")) {
        if (!t.includes("*/")) block = true;
        continue;
      }
      code++;
    }
    return { total: lines.length, code };
  };
  const files = has("web/relay")
    ? readdirSync(abs("web/relay"))
        .filter((f) => /\.(ts|toml)$/.test(f))
        .sort()
    : [];
  const dir = files.reduce((a, f) => a + count(`web/relay/${f}`).total, 0);
  return { ...count(MP.relay), dir, files };
}

/** The reconnect ladder, off the array the arm indexes. */
function deriveLadder() {
  const arr = (read(MP.wire) ?? "").match(/const RETRY_MS\s*=\s*\[([^\]]*)\]/)?.[1];
  return arr
    ? arr
        .split(",")
        .map((s) => digits(s.trim()))
        .filter((n) => Number.isFinite(n))
    : [];
}

/** Every dependency naming the retired peer-connection arm. */
function deriveRetiredDeps() {
  const pkg = JSON.parse(read("web/frontend/package.json") ?? "{}");
  return Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).filter((k) =>
    /trystero/i.test(k),
  );
}

const D = {
  lean: deriveLeanWasm(),
  fonts: deriveFonts(),
  rust: deriveRustTests(),
  bands: deriveBands(),
  make: deriveWasmMake(),
  iai: deriveIai(),
  ci: deriveCiLanes(),
  staleFigures: deriveStaleFigures(),
  crate:
    read("csp-solver/Cargo.toml")?.match(/^version\s*=\s*"(\d+)\.(\d+)\.(\d+)"/m) ??
    null,
  pencil:
    JSON.parse(read("web/frontend/package.json") ?? "{}")?.dependencies?.[
      "@mkbabb/pencil-boil"
    ] ?? null,
  lint: JSON.parse(read("web/frontend/package.json") ?? "{}")?.scripts?.lint ?? null,
  // THE TABLE, wherever it lives: T5-W2 F1 moved the five card rows out of
  // `registry.ts` (the 2-of-5 parallel map that dies with the file) into
  // `cards.ts`, the estate's one registration list. The instrument follows the
  // table — a derivation pointed at a retired file greens vacuously.
  games: grep("web/frontend/src/games/cards.ts", /^\s*id:\s*"([a-z]+)"/).map(
    (h) => h.m[0][1],
  ),
  projects: grep("web/frontend/playwright.config.ts", /name:\s*"([a-z]+)"/).map(
    (h) => h.m[0][1],
  ),
  specs: walk("web/frontend/e2e", ".spec.ts").length,
  e2e: pwList(),
  golden: pwList(["-c", "playwright-golden.config.ts"]),
  throttle: pwList(["-c", "playwright-throttle.config.ts"]),
  permalink: derivePermalinkGames(),
  workers: deriveWorkers(),
  variants: deriveConstraintVariants(),
  benches: deriveBenchTargets(),
  rosters: deriveScriptRosters(),
  redirects: deriveRedirects(),
  scenarios: deriveScenarios(),
  basenames: deriveBasenames(),
  origin: deriveRelayOrigin(),
  kind: deriveEventKind(),
  verbs: deriveWireVerbs(),
  slugs: deriveSlugSpace(),
  ink: deriveInk(),
  stress: deriveStress(),
  loc: deriveRelayLoc(),
  ladder: deriveLadder(),
  retiredDeps: deriveRetiredDeps(),
};
D.pin = D.crate ? `${D.crate[1]}.${D.crate[2]}` : null;

// ── rows ───────────────────────────────────────────────────────────────────

const fail = (site, expected, got) => ({ site, expected, got });

const ROWS = [
  {
    id: "frontend-readme-two-games",
    derived: () =>
      `${D.games.length} games registered (${D.games.join(", ")}) · pencil-boil ${D.pencil} · lint script ${JSON.stringify(D.lint)}`,
    run: () =>
      !has("web/frontend/README.md")
        ? [fail("web/frontend/README.md", "the frontend reference", "file absent")]
        : grep("web/frontend/README.md", /two games|0\.7\.0|prettier --write/i).map(
            (h) =>
              fail(
                `${h.file}:${h.line}`,
                `no match for /two games|0\\.7\\.0|prettier --write/i — the app registers ${D.games.length} games, depends on pencil-boil ${D.pencil}, and lints with ${JSON.stringify(D.lint)}`,
                h.text,
              ),
          ),
  },
  {
    id: "root-readme-e2e-counts",
    derived: () =>
      D.e2e.error
        ? `UNDERIVED: playwright test --list failed (${D.e2e.error})`
        : `${D.e2e.tests} tests in ${D.e2e.files} files (default) · ${D.specs} .spec.ts on disk · golden ${D.golden.tests ?? "?"}/${D.golden.files ?? "?"} · throttle ${D.throttle.tests ?? "?"}/${D.throttle.files ?? "?"}`,
    run: () => {
      if (D.e2e.error)
        return [
          fail(
            "web/frontend",
            "playwright test --list to enumerate the suite",
            `it failed: ${D.e2e.error} — run npm ci in web/frontend`,
          ),
        ];
      const out = [];
      for (const h of grep("README.md", /(\d[\d,]*)\s+Playwright tests?/)) {
        const got = num(h.m[0][1]);
        if (got !== D.e2e.tests)
          out.push(
            fail(
              `${h.file}:${h.line}`,
              `${D.e2e.tests} Playwright tests (playwright test --list)`,
              `${fmt(got)} — ${h.text}`,
            ),
          );
      }
      for (const h of grep("README.md", /(\d[\d,]*)\s+spec files?/)) {
        const got = num(h.m[0][1]);
        if (got !== D.e2e.files && got !== D.specs)
          out.push(
            fail(
              `${h.file}:${h.line}`,
              `${D.e2e.files} (--list) or ${D.specs} (on disk) spec files`,
              `${fmt(got)} — ${h.text}`,
            ),
          );
      }
      if (!grep("README.md", /(\d[\d,]*)\s+Playwright tests?/).length)
        out.push(
          fail(
            "README.md",
            `an e2e count citing ${D.e2e.tests} Playwright tests`,
            "no e2e count in the file at all",
          ),
        );
      return out;
    },
  },
  {
    // T7-W0 0.4. TWO DEFECTS, BOTH FIXED HERE.
    //
    // (1) THE DIRECTION WAS INVERTED. `if (D.projects.length < 2) return []`
    //     greened the FALSE case: a config declaring one engine while the docs
    //     promise two is precisely the drift this row exists to catch, and it
    //     was the one shape that could not red. The posture now decides which
    //     way the assertion points — multi-engine config forbids a
    //     single-browser claim, single-engine config forbids a both-engines
    //     claim — so neither drift direction has a hole.
    //
    // (2) THE MATCHES SCOOPED PROSE. `/known-broken|Safari is known/i` fires on
    //     any sentence carrying those words, and the ci.yml grep's `[^\n]*`
    //     swallowed the rest of the run line into the derived posture. Both are
    //     anchored now: the claim patterns want the claim's own shape, and the
    //     install grep captures the browser tokens alone.
    id: "chromium-alone-claim",
    derived: () => {
      const installs = [
        ...new Set(
          grep(
            ".github/workflows/ci.yml",
            /playwright install(?:\s+--with-deps)?((?:\s+[a-z]+)+)/,
          ).flatMap((h) => h.m[0][1].trim().split(/\s+/)),
        ),
      ].sort();
      return `playwright projects: ${D.projects.join(" + ") || "none parsed"} · ci installs: ${installs.join(" + ") || "none"}`;
    },
    run: () => {
      if (!D.projects.length)
        return [
          fail(
            "web/frontend/playwright.config.ts",
            "a parseable project list to derive the browser posture from",
            "no projects parsed",
          ),
        ];
      const multi = D.projects.length > 1;
      const claims = multi
        ? [
            /\bchromium\s+alone\b/i,
            /\bchromium[-\s]only\b/i,
            /\bonly\s+chromium\b/i,
            /\bsingle[-\s]browser\b/i,
            /\bone\s+browser\s+(?:project|lane)\b/i,
          ]
        : [
            /\bchromium\s*\+\s*webkit\b/i,
            /\bboth\s+engines\b/i,
            /\beach\s+with\s+its\s+own\s+lane\b/i,
            /\btwo\s+(?:browser\s+)?projects\b/i,
          ];
      const want = multi
        ? `no single-browser claim — playwright.config.ts declares ${D.projects.length} projects (${D.projects.join(", ")})`
        : `no multi-engine claim — playwright.config.ts declares ${D.projects.length} project (${D.projects.join(", ")})`;
      const out = [];
      for (const rel of DOCS)
        for (const re of claims)
          for (const h of grep(rel, re))
            out.push(fail(`${h.file}:${h.line}`, want, h.text));
      return out;
    },
  },
  {
    id: "lean-wasm-4-sites",
    derived: () =>
      D.lean.size === null
        ? "UNDERIVED: no lean wasm artifact and no band config"
        : `${fmt(D.lean.size)} B ← ${D.lean.source}${D.lean.degraded ? "  [DEGRADED: derived from the band config, not an artifact]" : ""}`,
    run: () => {
      if (D.lean.size === null)
        return [
          fail(
            "csp-solver/wasm/pkg",
            "a built lean artifact to measure",
            "none found — run `make -C csp-solver/wasm wasm`",
          ),
        ];
      const sites = [
        "docs/benchmarks.md",
        "csp-solver/wasm/README.md",
        "csp-solver/wasm/pkg/README.md",
        ".github/workflows/ci.yml",
      ];
      const want = fmt(D.lean.size);
      return sites.flatMap((s) => {
        // In degraded mode the figure comes OUT of ci.yml, so checking
        // ci.yml against it proves nothing. Say so rather than pass.
        if (D.lean.degraded && s === ".github/workflows/ci.yml")
          return [
            fail(
              s,
              `a lean-artifact figure re-derived from a built artifact`,
              "UNVERIFIABLE — the fallback figure was read from this same file; build the lean wasm or download the lean-wasm-pkg artifact",
            ),
          ];
        const text = read(s);
        if (text === null)
          return [fail(s, `a lean-artifact figure of ${want} B`, "file absent")];
        if (text.includes(want) || text.includes(String(D.lean.size))) return [];
        const cited = grep(s, /(\d{2,3},\d{3})\s*B/).filter((h) =>
          /lean|measures|artifact/i.test(h.text),
        );
        const where = cited.length
          ? cited
              .map(
                (h) => `${h.file}:${h.line} cites ${h.m.map((x) => x[1]).join(", ")} B`,
              )
              .join(" · ")
          : `${s}: no byte figure found`;
        return [fail(s, `${want} B (measured now at ${D.lean.source})`, where)];
      });
    },
  },
  {
    id: "ci-band-comment-406",
    derived: () =>
      `enforced bands — full fail >${fmt(D.bands.fullFail ?? 0)} B / warn >${fmt(D.bands.fullWarn ?? 0)} B · lean fail >${fmt(D.bands.leanFail ?? 0)} B; lean artifact ${D.lean.size === null ? "unmeasured" : fmt(D.lean.size) + " B"}; canon-declared stale: ${D.staleFigures.map((s) => `${fmt(s.value)} B (${s.site})`).join(", ") || "none"}`,
    run: () => {
      const rel = ".github/workflows/ci.yml";
      const out = [];
      // AN UNDERIVED BAND IS A DEAD GATE, AND A DEAD GATE MUST BE LOUD.
      // These three assertions come FIRST and are unconditional: before
      // T5-W1 a band that derived to nothing simply dropped the checks
      // below it and the row still printed GREEN (both arms banked at
      // evidence/w1/integrator/02-band-canary-BEFORE-AFTER.txt). The
      // `derived:` line published the 0 the whole time; nobody reads a
      // derived line under a GREEN.
      for (const [label, value] of [
        ["full fail", D.bands.fullFail],
        ["full warn", D.bands.fullWarn],
        ["lean fail", D.bands.leanFail],
      ])
        if (!Number.isInteger(value) || value <= 0)
          out.push(
            fail(
              rel,
              `a positive \`-gt <n>\` guard to derive the ${label} band from`,
              `${value === null ? "UNDERIVED" : `${value} B`} — ${D.bands.notes.join(" · ") || "the guard left its step, or the step was renamed"}`,
            ),
          );
      const lines = (read(rel) ?? "").split("\n");
      const start = lines.findIndex((l) =>
        /--profile wasm-release is REQUIRED/.test(l),
      );
      if (start < 0)
        return [
          ...out,
          fail(rel, "the wasm-release band comment", "anchor comment not found"),
        ];
      let end = start;
      while (end + 1 < lines.length && /^\s*#/.test(lines[end + 1])) end++;
      const block = lines.slice(start, end + 1);
      const joined = block.map((l) => l.replace(/^\s*#\s?/, "")).join(" ");
      const yields = joined.match(
        /yields\s+([\d,]+)\s*B\s+full\s*\/\s*([\d,]+)\s*B\s+lean/,
      );
      if (!yields) return out;
      const leanLit = num(yields[2]);
      const fullLit = num(yields[1]);
      const at = (lit) => {
        const i = block.findIndex((l) => l.includes(lit));
        return `${rel}:${start + (i < 0 ? 0 : i) + 1}`;
      };
      if (D.lean.size !== null && leanLit !== D.lean.size)
        out.push(
          fail(
            at(yields[2]),
            `${fmt(D.lean.size)} B lean (measured at ${D.lean.source}) — or drop the literal, the run line already echoes the live $RAW`,
            `${fmt(leanLit)} B lean, hand-copied and ${fmt(Math.abs(D.lean.size - leanLit))} B off the artifact`,
          ),
        );
      if (D.bands.fullWarn && fullLit > D.bands.fullWarn)
        out.push(
          fail(
            at(yields[1]),
            `a full-module figure under the enforced warn band (${fmt(D.bands.fullWarn)} B)`,
            `${fmt(fullLit)} B`,
          ),
        );
      // The full module isn't measurable without a default-feature build,
      // so it's cross-checked instead: a figure the canon itself declares
      // stale can't stand as the workflow's current yield.
      for (const s of D.staleFigures)
        if ([leanLit, fullLit].includes(s.value))
          out.push(
            fail(
              at(fmt(s.value)),
              `no figure the canon declares stale — ${s.site} says ${fmt(s.value)} B is stale, "do not quote it as current"`,
              `${fmt(s.value)} B quoted as what wasm-release yields`,
            ),
          );
      return out;
    },
  },
  {
    id: "sudoku-md-sections",
    derived: () =>
      `games registered: ${D.games.join(", ")} — each owed a section in docs/sudoku.md`,
    run: () => {
      const rel = "docs/sudoku.md";
      const text = read(rel);
      if (text === null)
        return [fail(rel, "the puzzle-family reference", "file absent")];
      const present = (text.match(/^## .*/gm) ?? []).map((h) => h.trim());
      return [/^## Thermo/m, /^## Killer/m, /^## KenKen/m]
        .filter((re) => !re.test(text))
        .map((re) =>
          fail(
            rel,
            `a section matching ${re}`,
            `headings stop at: ${present.slice(-1)[0] ?? "none"}`,
          ),
        );
    },
  },
  {
    id: "ofl-licenses-figures",
    derived: () =>
      `${D.fonts.subsets.length} woff2 subsets, ${fmt(D.fonts.total)} B total (${D.fonts.subsets.map((f) => `${f} ${fmt(bytes(join(D.fonts.dir, f)))} B`).join(", ")}) · OFL texts: ${D.fonts.ofl.join(", ") || "none"} · paired ${D.fonts.paired}`,
    run: () => {
      const out = [];
      if (!D.fonts.subsets.length)
        return [
          fail(
            D.fonts.dir,
            "the self-hosted woff2 subsets and their OFL texts",
            "directory absent or empty",
          ),
        ];
      if (!D.fonts.paired)
        out.push(
          fail(
            D.fonts.dir,
            `one OFL text per subset (${D.fonts.subsets.length})`,
            `${D.fonts.ofl.length} OFL texts: ${D.fonts.ofl.join(", ") || "none"}`,
          ),
        );
      const words = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
      ];
      const n = D.fonts.subsets.length;
      const manifest = `${D.fonts.dir}/LICENSES.md`;
      for (const rel of ["README.md", manifest].filter(has)) {
        const sites = grep(rel, /woff2 subsets/i);
        if (!sites.length) {
          out.push(
            fail(
              rel,
              `a font claim citing ${n} subsets, ${fmt(D.fonts.total)} B total`,
              "no woff2 claim in the file",
            ),
          );
          continue;
        }
        for (const h of sites) {
          const cited = h.text.match(/([\d,]+)\s*B total/);
          if (!cited || num(cited[1]) !== D.fonts.total)
            out.push(
              fail(
                `${h.file}:${h.line}`,
                `${fmt(D.fonts.total)} B total (wc -c ${D.fonts.dir}/*.woff2)`,
                cited ? `${cited[1]} B total` : "no byte total cited",
              ),
            );
          if (!new RegExp(`\\b(${n}|${words[n] ?? "\\0"})\\b`, "i").test(h.text))
            out.push(
              fail(
                `${h.file}:${h.line}`,
                `a subset count of ${n} (${words[n]})`,
                h.text,
              ),
            );
        }
      }
      // The manifest's per-family rows are a license-compliance statement: each
      // subset's byte figure is asserted against the file it names.
      for (const f of has(manifest) ? D.fonts.subsets : []) {
        const want = bytes(join(D.fonts.dir, f));
        for (const h of grep(manifest, new RegExp(`\`${f.replace(/\./g, "\\.")}\``))) {
          const cited = h.text.match(/\|\s*([\d,]+)\s*\|/);
          if (!cited || num(cited[1]) !== want)
            out.push(
              fail(
                `${h.file}:${h.line}`,
                `${fmt(want)} B for ${f}`,
                cited ? `${cited[1]} B` : "no byte figure in the row",
              ),
            );
        }
      }
      return out;
    },
  },
  {
    id: "install-pin-0.5",
    derived: () =>
      `csp-solver crate version ${D.crate ? D.crate[0].match(/"(.*)"/)[1] : "?"} → Install pin "${D.pin}" · consumer surfaces carry no outbound link into docs/precepts/`,
    run: () => {
      if (!D.pin)
        return [fail("csp-solver/Cargo.toml", "a parseable [package] version", "none")];
      const pin = grep("csp-solver/README.md", /^\s*csp-solver\s*=\s*"([^"]+)"/)
        .filter((h) => h.m[0][1] !== D.pin)
        .map((h) => fail(`${h.file}:${h.line}`, `csp-solver = "${D.pin}"`, h.text));
      const leak = DOCS.flatMap((rel) =>
        grep(rel, /\]\([^)]*docs\/precepts\//).map((h) =>
          fail(
            `${h.file}:${h.line}`,
            "no link into docs/precepts/ — a published surface stays campaign-clean",
            h.text,
          ),
        ),
      );
      return [...pin, ...leak];
    },
  },
  {
    // T7-W0 0.4, D8. THE LINE-SCOPED READ IS WHY THIS ROW MISSED ITS OWN SITE.
    // `docs/animation.md` names the package on one line and pins the range on
    // the NEXT — the row read only the naming line, found no version, and went
    // green over `^0.9.2` while the tree carried `^0.12.0`. The window is the
    // fix: i-2…i+2 around every `/pencil-boil/i` line. The window then has to
    // refuse its neighbours' versions — README's published-artifacts table
    // stacks csp-solver's rows against pencil-boil's — so a window line naming
    // ANOTHER package is skipped rather than read as this one's pin.
    id: "pencil-boil-0.9.2",
    derived: () =>
      `web/frontend/package.json dependencies["@mkbabb/pencil-boil"] = ${D.pencil}`,
    run: () => {
      if (!D.pencil)
        return [
          fail(
            "web/frontend/package.json",
            "a pencil-boil dependency",
            "none declared",
          ),
        ];
      const want = D.pencil.replace(/^\^/, "");
      const other =
        /csp[-_]solver|\bmorph\b|playwright|tailwind|\bvue\b|\bnode\b|\bnpm\b/i;
      const out = [];
      for (const rel of DOCS) {
        const lines = (read(rel) ?? "").split("\n");
        const hot = new Set();
        lines.forEach((l, i) => {
          if (/pencil-boil/i.test(l))
            for (
              let k = Math.max(0, i - 2);
              k <= Math.min(lines.length - 1, i + 2);
              k++
            )
              hot.add(k);
        });
        for (const i of [...hot].sort((a, b) => a - b)) {
          if (!/pencil-boil/i.test(lines[i]) && other.test(lines[i])) continue;
          for (const v of lines[i].matchAll(/[v^~]?(\d+\.\d+\.\d+)/g))
            if (v[1] !== want)
              out.push(
                fail(
                  `${rel}:${i + 1}`,
                  `pencil-boil ${D.pencil} (web/frontend/package.json)`,
                  `${v[0]} — ${lines[i].trim()}`,
                ),
              );
        }
      }
      return out;
    },
  },
  {
    id: "test-count-208-vs-204",
    derived: () =>
      `${D.rust.native} native #[test] attributes (csp-solver/src + csp-solver/tests, comments elided) · ${D.rust.wasm} #[wasm_bindgen_test] in the wasm crate (cfg'd to wasm32, not host-run) · ${D.rust.binaries} test binaries (${D.rust.members.join(" + ")} lib targets + integration files)`,
    run: () =>
      !D.rust.native
        ? [
            fail(
              "csp-solver",
              "a #[test] roster to count",
              "no test attributes found — nothing to derive from",
            ),
          ]
        : DOCS.flatMap((rel) =>
            grep(rel, /(\d[\d,]*)\s+passed,\s*\d+\s+failed/).flatMap((h) => {
              const total = num(h.m[0][1]);
              const bin = h.text.match(/(\d+)\s+test binaries/);
              const doc = h.text.match(/(\d+)\s+doctests?/);
              const out = [];
              const declaredDoctests = doc ? Number(doc[1]) : 0;
              if (total - declaredDoctests !== D.rust.native)
                out.push(
                  fail(
                    `${h.file}:${h.line}`,
                    `a total reconciling to ${D.rust.native} #[test] attributes${doc ? ` + ${declaredDoctests} doctests = ${D.rust.native + declaredDoctests}` : " (declare the doctest split)"}`,
                    `${fmt(total)} passed${doc ? ` with ${declaredDoctests} doctests → ${fmt(total - declaredDoctests)} attributes` : ", no doctest split declared"} — ${h.text}`,
                  ),
                );
              if (bin && Number(bin[1]) !== D.rust.binaries)
                out.push(
                  fail(
                    `${h.file}:${h.line}`,
                    `${D.rust.binaries} test binaries`,
                    `${bin[1]} test binaries — ${h.text}`,
                  ),
                );
              return out;
            }),
          ),
  },
  {
    // CH-32, members 2 and 3: a hand-written claim about a command, sitting
    // beside the command. `make wasm` builds the LEAN artifact
    // (--no-default-features, --profile wasm-release) and has since the
    // five-game landing; the README documented it as the FULL default-feature
    // --release build, and the Makefile's own flag comment still named the
    // two families that shipped at T2. Both are derived from the recipe here,
    // so the next flag change reds the prose instead of outliving it.
    id: "make-wasm-recipe",
    derived: () =>
      D.make.build === null
        ? `UNDERIVED: no \`wasm:\` target with a wasm-pack build line in ${D.make.rel}`
        : `${D.make.rel}:${D.make.build.line} runs ${D.make.flags.join(" ")} — ${D.make.lean ? "LEAN" : "default-feature"}; ${D.games.length} families registered (${D.games.join(", ")})`,
    run: () => {
      if (D.make.build === null)
        return [
          fail(
            D.make.rel,
            "a `wasm:` target whose recipe runs wasm-pack build",
            "no such target — nothing to derive the documented recipe from",
          ),
        ];
      const out = [];
      const ids = D.games;
      // (a) the Makefile's own comment block: a line that names ANY
      //     registered family must name them all, and a line that counts
      //     families must count the registered number. "sudoku + futoshiki
      //     only" against a five-family compile dies here.
      const words = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
      ];
      for (const c of D.make.comment) {
        const named = ids.filter((g) => new RegExp(`\\b${g}\\b`, "i").test(c.text));
        if (named.length && named.length !== ids.length)
          out.push(
            fail(
              `${D.make.rel}:${c.line}`,
              `every registered family named, or none — the compile carries ${ids.length} (${ids.join(", ")})`,
              `names ${named.length} of ${ids.length}: ${named.join(", ")} — ${c.text.trim()}`,
            ),
          );
        const counted = c.text.match(
          /\b(\d+|zero|one|two|three|four|five|six|seven|eight|nine)\s+(?:puzzle\s+)?(?:famil|game)/i,
        );
        if (counted) {
          const n = /^\d+$/.test(counted[1])
            ? Number(counted[1])
            : words.indexOf(counted[1].toLowerCase());
          if (n !== ids.length)
            out.push(
              fail(
                `${D.make.rel}:${c.line}`,
                `${ids.length} (${words[ids.length]}) families`,
                `${counted[1]} — ${c.text.trim()}`,
              ),
            );
        }
      }
      // (b) every published site that documents `make wasm`. A line
      //     carrying a wasm-pack fragment must carry the Makefile's exact
      //     flag set; no line may call the lean build full or
      //     default-featured.
      for (const rel of DOCS)
        for (const h of grep(rel, /make wasm/)) {
          const frag = h.text.match(/wasm-pack build[^`)]*/);
          if (frag) {
            const flags = wasmPackFlags(frag[0]);
            if (flags.join(" ") !== D.make.flags.join(" "))
              out.push(
                fail(
                  `${h.file}:${h.line}`,
                  `the recipe \`make wasm\` runs: ${D.make.flags.join(" ")}`,
                  `${flags.join(" ") || "no flags"} — ${h.text}`,
                ),
              );
          }
          // The flag tokens come out before the prose is read: the
          // recipe's own `--no-default-features` is not a claim that
          // the build is default-featured.
          if (
            D.make.lean &&
            /\bfull\b|\bdefault[- ]features?\b/i.test(
              h.text.replace(/--[a-z][a-z-]*/g, " "),
            )
          )
            out.push(
              fail(
                `${h.file}:${h.line}`,
                `no full/default-feature claim for \`make wasm\` — the target passes --no-default-features`,
                h.text,
              ),
            );
        }
      return out;
    },
  },
  {
    // CH-32 again, and the reason it is a CLASS rather than an incident: the
    // README counted the workflow's lanes in a word, the workflow grew, and
    // nothing connected the two. T5-W1 took it from eleven to eighteen. The
    // count now comes off the job keys.
    id: "ci-lane-count",
    derived: () => `${D.ci.jobs.length} jobs in ${D.ci.rel} (${D.ci.jobs.join(", ")})`,
    run: () => {
      if (!D.ci.jobs.length)
        return [
          fail(
            D.ci.rel,
            "a parseable `jobs:` block to count lanes from",
            "no job keys parsed",
          ),
        ];
      const words = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
        "twenty",
      ];
      const n = D.ci.jobs.length;
      const want = words[n] ?? String(n);
      const out = [];
      let seen = 0;
      for (const rel of DOCS)
        for (const h of grep(rel, /runs\s+([\w-]+)\s+lanes/i)) {
          seen++;
          const got = h.m[0][1].toLowerCase();
          if (got !== want && got !== String(n))
            out.push(
              fail(
                `${h.file}:${h.line}`,
                `${want} (${n}) lanes`,
                `${h.m[0][1]} — ${h.text}`,
              ),
            );
        }
      if (!seen)
        out.push(
          fail(
            "README.md",
            `a lane count citing ${want} (${n}) lanes`,
            "no lane count in any published doc",
          ),
        );
      return out;
    },
  },
  {
    // CH-32, member 4: the iai instruction count. The ENFORCED golden is the
    // number `iai_gate.sh` grades against, and the path to it is read out of
    // the workflow's own gate invocation rather than pinned here — repoint
    // the baseline and this row follows. P6's 1,585,722 is a superseded
    // measurement that outlived its own gate by two tranches.
    //
    // `csp-solver/benches/iai_queens.rs:8` carries the same dead figure and
    // is deliberately NOT gated here: it is a source comment and belongs to
    // T5-W2's charter. It joins this row when that lane lands.
    id: "iai-golden-figure",
    derived: () =>
      D.iai.count === null
        ? `UNDERIVED: ${D.iai.why.join(" · ") || "no enforced golden readable"}`
        : `${fmt(D.iai.count)} instructions enforced ±${D.iai.tolerancePct ?? "?"}% — ${D.iai.path}, gated by ${D.iai.rel}'s iai lane over bench ${D.iai.bench}`,
    run: () => {
      // Same law as the bands: a golden that cannot be derived is a dead
      // gate, and it fails here rather than passing quietly.
      if (D.iai.count === null || D.iai.why.length)
        return [
          fail(
            D.iai.rel,
            "an enforced iai golden reachable through the workflow's own gate invocation",
            D.iai.why.join(" · ") || "UNDERIVED",
          ),
        ];
      const want = D.iai.count;
      const out = [];
      for (const rel of DOCS) {
        const lines = (read(rel) ?? "").split("\n");
        const hot = new Set();
        lines.forEach((l, i) => {
          if (/\biai\b|callgrind/i.test(l))
            for (
              let k = Math.max(0, i - 6);
              k <= Math.min(lines.length - 1, i + 6);
              k++
            )
              hot.add(k);
        });
        for (const i of [...hot].sort((a, b) => a - b))
          for (const m of lines[i].matchAll(/\b(\d{1,3}(?:,\d{3}){2,}|\d{7,})\b/g)) {
            const got = num(m[1]);
            if (got !== want)
              out.push(
                fail(
                  `${rel}:${i + 1}`,
                  `${fmt(want)} — the golden ${D.iai.path} enforces (±${D.iai.tolerancePct}%)`,
                  `${m[1]} quoted beside the iai lane — ${lines[i].trim()}`,
                ),
              );
          }
      }
      return out;
    },
  },

  // ── T7-W0: the doc-drift census, gated ───────────────────────────────────

  {
    // W0 0.3, CH-16's inversion. The permalink universalised at T5 and three
    // records still say it didn't. The wired set is not a fact anyone restates
    // correctly by hand — it's whichever `spec.ts` declares a `urlCodec` — so
    // the row reads the specs and holds every permalink sentence to that set.
    // The window is ±1 line: the frontend README names the games on one line
    // and `?board=` on the next, which is how a line-scoped read would miss it.
    id: "permalink-games",
    derived: () => {
      const { wired, all, dir } = D.permalink;
      const unwired = all.filter((g) => !wired.includes(g));
      return `${wired.length}/${all.length} game specs declare a urlCodec under ${dir} — wired: ${wired.join(", ") || "none"}${unwired.length ? ` · unwired: ${unwired.join(", ")}` : ""}`;
    },
    run: () => {
      const { wired, all, dir } = D.permalink;
      if (!all.length)
        return [fail(dir, "the registered game directories", "none found")];
      if (!wired.length)
        return [
          fail(
            dir,
            "at least one spec.ts declaring a urlCodec",
            "none — nothing to hold the docs to",
          ),
        ];
      const TOKEN = /permalink|\?board=|share (?:url|link)|writeShareUrl|boardLink/i;
      const UNWIRED =
        /\bis(?:n't| not)\s+wired\b|\bnot\s+wired\b|\bno-ops?\b|\bunwired\b|hard-?coded\s+`?"absent"`?|reads\s+`?"absent"`?/i;
      const out = [];
      for (const rel of DOCS) {
        const lines = (read(rel) ?? "").split("\n");
        let last = -Infinity; // never suppress a red on the doc's first lines
        lines.forEach((line, i) => {
          // The window is ±1, so anchors within two lines are one claim.
          if (!TOKEN.test(line) || i <= last + 2) return;
          last = i;
          const win = lines
            .slice(Math.max(0, i - 1), Math.min(lines.length, i + 2))
            .join(" ");
          if (UNWIRED.test(win))
            out.push(
              fail(
                `${rel}:${i + 1}`,
                `no unwired-permalink claim — all ${wired.length} registered games declare a urlCodec (${wired.join(", ")})`,
                win.trim(),
              ),
            );
          for (const clause of win.split(/(?<=[.;])\s+/)) {
            if (!TOKEN.test(clause)) continue;
            const named = wired.filter((g) =>
              new RegExp(`\\b${g}\\b`, "i").test(clause),
            );
            if (named.length && named.length !== wired.length)
              out.push(
                fail(
                  `${rel}:${i + 1}`,
                  `every wired game named, or none — the permalink is wired for all ${wired.length} (${wired.join(", ")})`,
                  `names ${named.length}: ${named.join(", ")} — ${clause.trim()}`,
                ),
              );
          }
        });
      }
      return out;
    },
  },
  {
    // W0 0.4, the class row: D1, D2, D3, D4 are one mechanism — a doc naming a
    // file the tree doesn't have. Two token sources, because the drift lives in
    // both: backticked cites, and the file-tree blocks (whose trailing comments
    // are where `SudokuBoard/` and `KillerCage/` outlived the directories).
    //
    // Two exclusions keep the row from lying in the other direction. A line
    // that RETIRES a path (`the former backtrack.rs`) or sources it FOREIGN
    // (`resident in bbnf-lang`) isn't claiming it exists; and `evidence/…`,
    // `docs/tranches/…`, `pkg/`, `dist/` are campaign substrate or gitignored
    // output, deliberately not tree-resident.
    id: "cited-paths-exist",
    derived: () =>
      `${D.basenames.size} source basenames indexed · ${CITED_DOCS.length} docs scanned (${CITED_DOCS.join(", ")}) · roots: repo, web/frontend, web/frontend/src, csp-solver, csp-solver/src, the doc's own dir · aliases @games/ @pencil/ @/`,
    run: () => {
      if (!D.basenames.size)
        return [
          fail(
            ".",
            "a walkable source tree to resolve cites against",
            "no files indexed",
          ),
        ];
      const out = [];
      for (const rel of CITED_DOCS) {
        const lines = (read(rel) ?? "").split("\n");
        lines.forEach((line, i) => {
          if (RETIRED_LINE.test(line)) return;
          for (const m of line.matchAll(/`([^`]+)`/g)) {
            const tok = m[1];
            if (/[\s*{}<>…()|,;'"\\]/.test(tok)) continue;
            if (/:\/\/|::/.test(tok)) continue;
            if (/^@(?:mkbabb|playwright|vitejs|vueuse|tailwindcss)\//.test(tok))
              continue;
            if (OFF_TREE_PREFIX.test(tok)) continue;
            if (!PATH_EXT.test(tok)) continue;
            if (/^[\w@.-]+(?:\/[\w@.-]+)+$/.test(tok)) {
              if (resolveCite(tok, rel) === null)
                out.push(
                  fail(
                    `${rel}:${i + 1}`,
                    `a cited path that resolves — roots: repo, web/frontend, web/frontend/src, csp-solver, csp-solver/src, ${dirname(rel)}`,
                    `\`${tok}\` — nothing in the tree answers to it`,
                  ),
                );
            } else if (/^[\w.-]+$/.test(tok) && !D.basenames.has(tok)) {
              out.push(
                fail(
                  `${rel}:${i + 1}`,
                  `a source file named ${tok} somewhere in the tree`,
                  `\`${tok}\` — no file by that name`,
                ),
              );
            }
          }
        });
        for (const c of treeCites(rel))
          if (!has(c.path))
            out.push(
              fail(
                `${rel}:${c.line}`,
                `a file tree that names only paths that exist`,
                `\`${c.tok}\` → ${c.path} — absent`,
              ),
            );
      }
      return out;
    },
  },
  {
    // W0 0.4, D3. The five-game landing folded five per-game workers into one
    // shared module; every doc kept the old topology, including a count.
    id: "worker-topology",
    derived: () =>
      `${D.workers.length} worker module(s) under web/frontend/src: ${D.workers.join(", ") || "none"}`,
    run: () => {
      if (D.workers.length !== 1)
        return [
          fail(
            "web/frontend/src",
            "exactly one solver worker module — the shared transport's premise",
            `${D.workers.length}: ${D.workers.join(", ") || "none"}`,
          ),
        ];
      const shapes = [
        /\beach\s+game\s+(?:owns|has|declares|carries|gets)\b/i,
        /\bper-game\s+Worker\b/i,
        /\beach\s+with\s+its\s+own\s+`?solver\/`?\s+Worker\b/i,
        /\bone\s+Worker\s+per\s+game\b/i,
      ];
      const out = [];
      for (const rel of DOCS) {
        const lines = (read(rel) ?? "").split("\n");
        lines.forEach((line, i) => {
          for (const re of shapes)
            if (re.test(line))
              out.push(
                fail(
                  `${rel}:${i + 1}`,
                  `no per-game worker claim — the tree carries ONE worker module (${D.workers[0]}), shared by every game`,
                  line.trim(),
                ),
              );
          const n = line.match(
            /\b(\d+|one|two|three|four|five|six|seven|eight|nine)\s+workers?\b/i,
          );
          if (!n) return;
          const got = /^\d+$/.test(n[1])
            ? Number(n[1])
            : WORDS.indexOf(n[1].toLowerCase());
          if (got !== D.workers.length)
            out.push(
              fail(
                `${rel}:${i + 1}`,
                `${D.workers.length} (${WORDS[D.workers.length]}) worker module — ${D.workers[0]}`,
                `${n[1]} — ${line.trim()}`,
              ),
            );
        });
      }
      return out;
    },
  },
  {
    // W0 0.4, D6. The three sub-totals were each re-derived and each right; the
    // sum was hand-carried and wrong. Arithmetic the gate can do is arithmetic
    // the gate must do.
    id: "e2e-total-arithmetic",
    derived: () => {
      const parts = [
        ["default", D.e2e],
        ["golden", D.golden],
        ["throttle", D.throttle],
      ];
      const bad = parts.filter(([, p]) => p.error);
      if (bad.length)
        return `UNDERIVED: ${bad.map(([n, p]) => `${n}: ${p.error}`).join(" · ")}`;
      const t = parts.reduce((n, [, p]) => n + p.tests, 0);
      const f = parts.reduce((n, [, p]) => n + p.files, 0);
      return `${parts.map(([n, p]) => `${n} ${p.tests}/${p.files}`).join(" + ")} = ${t} tests in ${f} files`;
    },
    run: () => {
      const parts = [D.e2e, D.golden, D.throttle];
      const bad = parts.filter((p) => p.error);
      if (bad.length)
        return [
          fail(
            "web/frontend",
            "playwright test --list against all three configs",
            `${bad.length} config(s) failed to enumerate: ${bad.map((p) => p.error).join(" · ")} — run npm ci in web/frontend`,
          ),
        ];
      const total = parts.reduce((n, p) => n + p.tests, 0);
      const addends = `${D.e2e.tests} (default) + ${D.golden.tests} (golden) + ${D.throttle.tests} (throttle)`;
      const out = [];
      let seen = 0;
      for (const rel of DOCS)
        for (const h of grep(rel, /(\d[\d,]*)\s+tests?\s+in\s+all\b/i)) {
          seen++;
          const got = num(h.m[0][1]);
          if (got !== total)
            out.push(
              fail(
                `${h.file}:${h.line}`,
                `${total} tests in all — ${addends}`,
                `${fmt(got)} — ${h.text}`,
              ),
            );
        }
      if (!seen)
        out.push(
          fail(
            "README.md",
            `an "N tests in all" figure equal to ${total} (${addends})`,
            "no whole-suite total in any published doc",
          ),
        );
      return out;
    },
  },
  {
    // W0 0.4, D9. `Soft` was retired at 0.3.0 and the cages arrived at T4; both
    // docs still enumerate the enum as it stood two releases ago. The trigger is
    // the ENUMERATION, not a mention: naming one variant is prose, naming three
    // beside `ConstraintEnum` is a list, and a list owes the whole set.
    id: "constraint-enum-variants",
    derived: () =>
      D.variants.variants.length
        ? `${D.variants.variants.length} ConstraintEnum variants in ${D.variants.rel}: ${D.variants.variants.join(", ")}`
        : `UNDERIVED: no \`pub enum ConstraintEnum\` parsed out of ${D.variants.rel}`,
    run: () => {
      const live = D.variants.variants;
      if (!live.length)
        return [
          fail(
            D.variants.rel,
            "a parseable `pub enum ConstraintEnum` to read the variants off",
            "none — the enum moved or was renamed",
          ),
        ];
      const namedIn = (text) => live.filter((v) => new RegExp(`\\b${v}\\b`).test(text));
      const out = [];
      for (const rel of DOCS) {
        const lines = (read(rel) ?? "").split("\n");
        lines.forEach((line, i) => {
          const named = namedIn(line);
          if (/\bSoft\b/.test(line) && (named.length || /ConstraintEnum/.test(line)))
            out.push(
              fail(
                `${rel}:${i + 1}`,
                `no \`Soft\` variant — ${D.variants.rel} carries ${live.join(", ")} and nothing else`,
                line.trim(),
              ),
            );
          if (
            /ConstraintEnum/.test(line) &&
            named.length >= 3 &&
            named.length < live.length
          )
            out.push(
              fail(
                `${rel}:${i + 1}`,
                `every variant named where the enum is enumerated: ${live.join(", ")}`,
                `names ${named.length} of ${live.length}: ${named.join(", ")} — missing ${live.filter((v) => !named.includes(v)).join(", ")}`,
              ),
            );
        });
      }
      return out;
    },
  },
  {
    // W0 0.4, D17 + D19 — the two gate-script rosters. Both are names-any⇒
    // names-all: a doc that lists SOME of a directory's files has told the
    // reader the list is the directory, and a reader who trusts it is wrong.
    // The root arm is scoped to the README's own file-tree block, where D19
    // lives; the prose cite of `scripts/dev.sh` as a launcher is not a roster.
    id: "frontend-scripts-roster",
    derived: () =>
      `${D.rosters.frontend.length} in ${D.rosters.frontendDir} (${D.rosters.frontend.join(", ") || "none"}) · ${D.rosters.root.length} in ${D.rosters.rootDir} (${D.rosters.root.join(", ") || "none"})`,
    run: () => {
      const out = [];
      if (!D.rosters.frontend.length)
        out.push(
          fail(
            D.rosters.frontendDir,
            "the frontend gate-script roster",
            "empty or absent",
          ),
        );
      if (!D.rosters.root.length)
        out.push(
          fail(D.rosters.rootDir, "the root gate-script roster", "empty or absent"),
        );
      if (out.length) return out;
      const stems = D.rosters.frontend.map((f) => f.replace(/\.mjs$/, ""));
      for (const rel of DOCS) {
        const lines = (read(rel) ?? "").split("\n");
        lines.forEach((line, i) => {
          if (RETIRED_LINE.test(line)) return;
          const named = stems.filter((s) => new RegExp(`\\b${s}\\b`).test(line));
          if (named.length && named.length !== stems.length)
            out.push(
              fail(
                `${rel}:${i + 1}`,
                `every file in ${D.rosters.frontendDir} named, or none — the directory holds ${stems.length}: ${D.rosters.frontend.join(", ")}`,
                `names ${named.length} of ${stems.length}: ${named.join(", ")}`,
              ),
            );
        });
        const nodes = treeCites(rel).filter((c) => /^scripts\//.test(c.path));
        if (!nodes.length) continue;
        const named = D.rosters.root.filter((f) =>
          nodes.some((n) => n.path === `scripts/${f}`),
        );
        if (named.length !== D.rosters.root.length)
          out.push(
            fail(
              `${rel}:${nodes[0].line}`,
              `every entry of ${D.rosters.rootDir}/ in the file tree, or the directory as one node — it holds ${D.rosters.root.length}: ${D.rosters.root.join(", ")}`,
              `the tree names ${named.length}: ${named.join(", ") || "none"} — ${nodes.map((n) => n.path).join(", ")}`,
            ),
          );
      }
      return out;
    },
  },
  {
    // W0 0.4, D14. Two docs list the criterion roster; both were minted before
    // `gac_ab` and `futoshiki` were declared. A roster is a list of three or
    // more — one bench named in a sentence is prose, and the threshold says so
    // rather than reding every line that mentions the queens smoke lane.
    id: "bench-target-roster",
    derived: () =>
      `${D.benches.names.length} [[bench]] targets in ${D.benches.rel}: ${D.benches.names.join(", ") || "none"}`,
    run: () => {
      const names = D.benches.names;
      if (!names.length)
        return [
          fail(
            D.benches.rel,
            "a `[[bench]]` roster to derive from",
            "no bench targets declared",
          ),
        ];
      const out = [];
      for (const rel of DOCS) {
        const lines = (read(rel) ?? "").split("\n");
        let last = -Infinity; // never suppress a red on the doc's first lines
        for (let i = 0; i < lines.length; i++) {
          if (!/bench/i.test(lines[i]) || i <= last + 1) continue;
          const win = lines.slice(i, Math.min(lines.length, i + 2)).join(" ");
          const named = names.filter((n) => new RegExp(`\\b${n}\\b`, "i").test(win));
          if (named.length < 3 || named.length === names.length) continue;
          last = i;
          out.push(
            fail(
              `${rel}:${i + 1}`,
              `every bench target named, or fewer than three — ${D.benches.rel} declares ${names.length}: ${names.join(", ")}`,
              `names ${named.length}: ${named.join(", ")} — missing ${names.filter((n) => !named.includes(n)).join(", ")}`,
            ),
          );
        }
      }
      return out;
    },
  },
  {
    // W0 0.4, D15. `_redirects` grew the `/assets/*` 404 guard when the edge
    // cached an HTML fallback as a stylesheet for a year; two docs still call
    // it the SPA fallback ALONE, which is the sentence that made the guard
    // look droppable.
    id: "redirects-rule-count",
    derived: () =>
      `${D.redirects.rules.length} rule(s) in ${D.redirects.rel}: ${D.redirects.rules.map((r) => r.replace(/\s+/g, " ")).join(" · ") || "none"}`,
    run: () => {
      const n = D.redirects.rules.length;
      if (!n)
        return [
          fail(
            D.redirects.rel,
            "at least one redirect rule to count",
            "none — file absent or comment-only",
          ),
        ];
      const shown = D.redirects.rules.map((r) => r.replace(/\s+/g, " ")).join(" · ");
      const out = [];
      for (const rel of DOCS)
        for (const h of grep(rel, /_redirects/)) {
          if (/\bonly\b/i.test(h.text))
            out.push(
              fail(
                `${h.file}:${h.line}`,
                `no "only" claim about _redirects — it carries ${n} rules: ${shown}`,
                h.text,
              ),
            );
          const c = h.text.match(/\b(\d+|one|two|three|four|five)\s+rules?\b/i);
          if (!c) continue;
          const got = /^\d+$/.test(c[1])
            ? Number(c[1])
            : WORDS.indexOf(c[1].toLowerCase());
          if (got !== n)
            out.push(
              fail(
                `${h.file}:${h.line}`,
                `${n} (${WORDS[n]}) rules: ${shown}`,
                `${c[1]} — ${h.text}`,
              ),
            );
        }
      return out;
    },
  },
  {
    // W0 0.4, D20. The rig's own reference is the only map of its scenarios,
    // and it stopped at the six state-safe ones. Every key is named, and named
    // in its partition — the drivers' default set, the diagnostic-only pair,
    // and whatever the CI subset actually drives.
    id: "perf-rig-scenario-roster",
    derived: () => {
      const s = D.scenarios;
      return s.keys.length
        ? `${s.keys.length} SCENARIOS keys in ${s.probeRel} (${s.keys.join(", ")}) · driver default set: ${s.defaults.join(",") || "none"} · diagnostic-only: ${s.diagnostic.join(", ") || "none"} · CI-gated: ${s.gated.join(", ") || "none"}`
        : `UNDERIVED: no SCENARIOS table parsed out of ${s.probeRel}`;
    },
    run: () => {
      const s = D.scenarios;
      const rel = "web/frontend/perf-rig/README.md";
      if (!s.keys.length)
        return [
          fail(s.probeRel, "a parseable `var SCENARIOS = {` table", "no keys parsed"),
        ];
      const text = read(rel);
      if (text === null) return [fail(rel, "the perf rig's reference", "file absent")];
      const lines = text.split("\n");
      const near = (key, re) =>
        lines.some(
          (l, i) =>
            new RegExp(`\\b${key}\\b`).test(l) &&
            re.test(lines.slice(Math.max(0, i - 1), i + 2).join(" ")),
        );
      const out = [];
      for (const k of s.keys)
        if (!new RegExp(`\\b${k}\\b`).test(text))
          out.push(
            fail(
              rel,
              `the scenario \`${k}\` named — ${s.probeRel} declares it`,
              "absent from the rig's own reference",
            ),
          );
      const dflt = s.defaults.join(",");
      if (dflt && !text.includes(dflt))
        out.push(
          fail(
            rel,
            `the drivers' default set quoted verbatim: \`${dflt}\``,
            "the README's default set is not the drivers'",
          ),
        );
      for (const k of s.diagnostic)
        if (new RegExp(`\\b${k}\\b`).test(text) && !near(k, /diagnostic/i))
          out.push(
            fail(
              rel,
              `\`${k}\` named as diagnostic — probe.js returns "diagnostic only" for it`,
              "named without its partition",
            ),
          );
      for (const k of s.gated.filter((g) => s.keys.includes(g)))
        if (new RegExp(`\\b${k}\\b`).test(text) && !near(k, /\bCI\b|gate|subset/i))
          out.push(
            fail(
              rel,
              `\`${k}\` named as CI-gated — ci-subset.mjs drives it`,
              "named without its partition",
            ),
          );
      return out;
    },
  },

  // ── T7-W5: the multiplayer record ────────────────────────────────────────
  // Ten rows landing with `docs/multiplayer.md`. The relay and its client were
  // written a tranche apart and never re-read against each other; these hold the
  // seam's two halves to one truth, and hold the page to both.
  {
    // W5 row 1, and the estate's most load-bearing UNENFORCED invariant: the CSP
    // grant, the client's default URL, and the Worker's own name are one string
    // in three files that deploy separately. It was prose at `CLOSE.md` and
    // nothing else. A deploy that trues one is a socket blocked on the edge and
    // nowhere else — the failure with no console line and no server log.
    id: "relay-origin-pair",
    derived: () => {
      const o = D.origin;
      return o.cspHost && o.urlHost && o.name
        ? `connect-src ${o.csp} (${MP.headers}) · RELAY_URLS default ${o.url} (${MP.session}) · wrangler name "${o.name}" (${MP.toml}) — one origin: ${o.cspHost}`
        : `UNDERIVED: csp ${o.csp ?? "none"} · default ${o.url ?? "none"} · name ${o.name ?? "none"}`;
    },
    run: () => {
      const o = D.origin;
      const out = [];
      if (!o.csp)
        out.push(
          fail(MP.headers, "a wss:// origin in the CSP connect-src clause", "none"),
        );
      if (!o.url)
        out.push(
          fail(MP.session, "a wss:// default in the RELAY_URLS literal", "none"),
        );
      if (!o.name) out.push(fail(MP.toml, 'name = "…"', "none"));
      if (out.length) return out;
      if (o.cspHost !== o.urlHost)
        out.push(
          fail(
            `${MP.headers} + ${MP.session}`,
            `one origin — the CSP grant and the RELAY_URLS default name the same host`,
            `connect-src ${o.cspHost} vs RELAY_URLS ${o.urlHost}`,
          ),
        );
      else if (o.urlHost.split(".")[0] !== o.name)
        out.push(
          fail(
            MP.toml,
            `name = "${o.urlHost.split(".")[0]}" — the Worker's name is the first label of ${o.urlHost}`,
            `name = "${o.name}"`,
          ),
        );
      for (const rel of mpProse())
        for (const h of grep(rel, /wss:\/\/[\w.-]+/))
          for (const m of h.m) {
            // A sentence's full stop is not part of the hostname.
            const host = hostOf(m[0]).replace(/\.+$/, "");
            if (host === o.cspHost || /\.invalid$/.test(host)) continue;
            out.push(
              fail(
                `${h.file}:${h.line}`,
                `the one relay origin, wss://${o.cspHost}`,
                `${m[0]} — ${h.text}`,
              ),
            );
          }
      return out;
    },
  },
  {
    // W5 row 2. T6.2 replaced the client and nobody re-read the relay: its header
    // still describes trystero's nostr strategy as the consumer it serves —
    // batched 250-topic filters, WebRTC offer/answer payloads, `strToNum(topic)`
    // kinds — none of which has been true since. One row converts the whole
    // contradiction class (C1–C4, C9, C10) from a prose fix into a standing gate.
    //
    // A line that RETIRES the name is not naming it as the live client: the
    // autopsy is the point of `relayWire.ts`'s header and of the fixture note in
    // `relay.test.ts`, so past tense passes and present tense does not. The
    // client-side headers are out of scope by the same argument — they exist to
    // record what left and why.
    id: "retired-arm-clean",
    derived: () =>
      `trystero deps: ${D.retiredDeps.join(", ") || "none"} · scope: ${D.loc.files.map((f) => `web/relay/${f}`).join(", ")} + ${DOCS.length} published docs`,
    run: () => {
      const RETIRED_ARM =
        /\b(left|leaves|leaving|gone|went|retired|removed|deleted|dead|fossil|excised|dropped|no longer|used to|former(?:ly)?|replac\w+|since T6\.2|until T6\.2)\b/i;
      const out = D.retiredDeps.map((d) =>
        fail(
          "web/frontend/package.json",
          "no trystero dependency — the peer-connection arm went at T6.2",
          `dependency ${d}`,
        ),
      );
      for (const rel of [...D.loc.files.map((f) => `web/relay/${f}`), ...DOCS])
        for (const h of grep(rel, /trystero/i)) {
          if (RETIRED_ARM.test(h.text)) continue;
          out.push(
            fail(
              `${h.file}:${h.line}`,
              "trystero named only as the arm that LEFT — the shipped client speaks NIP-01 to this relay directly (T6.2)",
              h.text,
            ),
          );
        }
      return out;
    },
  },
  {
    // W5 row 3. The grammar is four words, and the type says three: `bye` rides
    // the `Kind | "bye"` extension both arms widen their signature with, because
    // it never reaches `onMessage`. `useSession.ts`'s header counts the type,
    // which is why the estate has documented a three-word wire since T6 and a
    // relay that says the fourth word since T7-W4.
    id: "multiplayer-wire-verbs",
    derived: () => {
      const v = D.verbs;
      return v.verbs.length
        ? `${v.verbs.length} verbs on the wire (${v.verbs.join("/")}) — Kind declares ${v.kinds.join("/")}, the arms extend it; kinds actually sent: ${v.sent.join(", ")}`
        : `UNDERIVED: no Kind union parsed out of ${MP.session}`;
    },
    run: () => {
      const { verbs, sent } = D.verbs;
      if (!verbs.length)
        return [
          fail(MP.session, "an `export type Kind` union to count", "none parsed"),
        ];
      const out = [];
      const missing = sent.filter((k) => !verbs.includes(k));
      if (missing.length || sent.length !== verbs.length)
        out.push(
          fail(
            `${MP.session} + ${MP.wire} + ${MP.relay}`,
            `the wire's verbs and the kinds it sends are one set: ${verbs.join("/")}`,
            `sent: ${sent.join(", ") || "none"}${missing.length ? ` — outside the grammar: ${missing.join(", ")}` : ""}`,
          ),
        );
      // `(?<![\w-])` keeps the version half of `NIP-01` from reading as a count.
      const COUNT =
        /(?<![\w-])(zero|one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(?:\w+\s+)?(messages?|verbs?)\b/gi;
      for (const rel of mpProse()) {
        for (const h of grep(rel, COUNT))
          for (const m of h.m) {
            const got = /^\d+$/.test(m[1])
              ? Number(m[1])
              : WORDS.indexOf(m[1].toLowerCase());
            if (got === verbs.length) continue;
            out.push(
              fail(
                `${h.file}:${h.line}`,
                `${WORDS[verbs.length]} ${m[2].toLowerCase()} — ${verbs.join("/")}`,
                `${m[1]} — ${h.text}`,
              ),
            );
          }
        // An enumeration that names three of the four is the shape the wire's
        // fourth word disappears in — the `bench-target-roster` rule, on verbs.
        for (const h of grep(rel, /`(?:hi|op|st|bye)`|\bhi\/op\/st(?:\/bye)?\b/)) {
          const named = verbs.filter((v) =>
            new RegExp(`\`${v}\`|(?<![\\w/])${v}/|/${v}(?![\\w/])`).test(h.text),
          );
          if (named.length < 3 || named.length === verbs.length) continue;
          out.push(
            fail(
              `${h.file}:${h.line}`,
              `every verb named, or fewer than three — the grammar is ${verbs.join("/")}`,
              `names ${named.length}: ${named.join(", ")} — ${h.text}`,
            ),
          );
        }
      }
      return out;
    },
  },
  {
    // W5 row 4. One constant, two sides of the seam — the client publishes on it
    // and the relay's own fixtures filter for it — plus every 5-digit kind the
    // prose quotes. NIP-01's reserved ephemeral window is the one exception, and
    // only its bounds, only on a line that says so.
    id: "relay-event-kind",
    derived: () => {
      const k = D.kind;
      return k.kind
        ? `EVENT_KIND ${k.kind} (${MP.wire}) · relay fixtures ${k.testKind ?? "none"} (${MP.relayTest}) · NIP-01 ephemeral range ${k.range.join("–") || "unstated"}`
        : `UNDERIVED: no EVENT_KIND parsed out of ${MP.wire}`;
    },
    run: () => {
      const k = D.kind;
      if (!k.kind)
        return [fail(MP.wire, "a `const EVENT_KIND` to derive from", "none")];
      const out = [];
      if (k.testKind !== k.kind)
        out.push(
          fail(
            MP.relayTest,
            `EVENT_KIND ${k.kind} — the kind the shipped arm publishes on`,
            `${k.testKind ?? "none"} — the relay's fixtures filter for a kind nothing sends`,
          ),
        );
      // Prose only. `relay.test.ts` quotes kinds it means to MISS (a filter that
      // takes another kind is the bug the fixture exists to catch), and its own
      // constant is asserted above rather than scanned.
      for (const rel of mpProse())
        for (const h of grep(rel, /kind/i)) {
          const ranged = /NIP-01|ephemeral|reserve|range/i.test(h.text);
          for (const m of h.text.matchAll(/\b\d[\d_]*\b/g)) {
            const got = digits(m[0]);
            if (String(got).length !== 5) continue;
            if (got === k.kind) continue;
            if (ranged && k.range.includes(got)) continue;
            out.push(
              fail(
                `${h.file}:${h.line}`,
                `kind ${k.kind}${k.range.length ? ` (or the bare range bounds ${k.range.join("/")} on a line that names the range)` : ""}`,
                `${m[0]} — ${h.text}`,
              ),
            );
          }
        }
      return out;
    },
  },
  {
    // W5 row 5. The name space is the estate's own filter regex over the
    // dictionaries it ships — the `j`/`x` the hand-drawn subset can't draw are
    // what cuts it — so the figures are derived by running that regex here, not
    // by trusting the three counts the comment states.
    id: "slug-space-figures",
    derived: () => {
      const s = D.slugs;
      return s.names
        ? `${s.source} over unique-names-generator: ${s.rows.map((r) => `${fmt(r.kept)} of ${fmt(r.all)} ${r.k}`).join(", ")} — ${fmt(s.names)} names`
        : `UNDERIVED: ${s.source ? `dictionaries unreadable (${s.error ?? "no roster"})` : `no WRITEABLE regex in ${MP.ident}`}`;
    },
    run: () => {
      const s = D.slugs;
      if (!s.source)
        return [
          fail(MP.ident, "a `const WRITEABLE` filter regex to derive from", "none"),
        ];
      if (!s.names)
        return [
          fail(
            "web/frontend/node_modules/unique-names-generator",
            "the shipped dictionaries, to run the filter over",
            s.error ?? "no adjectives/animals roster — run npm ci in web/frontend",
          ),
        ];
      const by = Object.fromEntries(s.rows.map((r) => [r.k, r]));
      const out = [];
      for (const rel of [...mpProse(), MP.ident]) {
        for (const h of grep(rel, /([\d,]+)\s+of\s+([\d,]+)\s+(animals|adjectives)/gi))
          for (const m of h.m) {
            const r = by[m[3].toLowerCase()];
            if (!r || (num(m[1]) === r.kept && num(m[2]) === r.all)) continue;
            out.push(
              fail(
                `${h.file}:${h.line}`,
                `${fmt(r.kept)} of ${fmt(r.all)} ${r.k} survive ${s.source}`,
                `${m[1]} of ${m[2]} — ${h.text}`,
              ),
            );
          }
        for (const h of grep(rel, /([\d][\d,]{4,})\s+names\b/g))
          for (const m of h.m) {
            if (num(m[1]) === s.names) continue;
            out.push(
              fail(
                `${h.file}:${h.line}`,
                `${fmt(s.names)} names — ${s.rows.map((r) => fmt(r.kept)).join(" × ")}`,
                `${m[1]} — ${h.text}`,
              ),
            );
          }
      }
      return out;
    },
  },
  {
    // W5 row 6. The ink claim is structural or it is a table of hand-checked
    // hexes: one golden-angle walk at one chroma, banded by a lightness the theme
    // sets twice. Three numbers, three files, and the contrast claim rests on all
    // of them agreeing.
    id: "peer-ink-formula",
    derived: () => {
      const i = D.ink;
      return i.varName && i.angle
        ? `oklch(var(${i.varName}) ${i.chroma} i × ${i.angle}° % ${i.wheel}) (${MP.ident}) · ${i.varName} band ${i.band.join(" / ") || "none"} (${MP.css})`
        : `UNDERIVED: no inkFor template parsed out of ${MP.ident}`;
    },
    run: () => {
      const i = D.ink;
      if (!i.varName || !i.angle || !i.chroma)
        return [
          fail(MP.ident, "the `inkFor` oklch template to derive from", "none parsed"),
        ];
      if (i.band.length !== 2)
        return [
          fail(
            MP.css,
            `two \`${i.varName}\` declarations — the paper band and the night one`,
            `${i.band.length}: ${i.band.join(", ") || "none"}`,
          ),
        ];
      const out = [];
      const bandSet = [i.light, i.dark].sort().join("/");
      for (const rel of [...mpProse(), MP.ident, MP.css]) {
        for (const h of grep(rel, /oklch/i)) {
          if (!h.text.includes(i.varName) || h.text.includes(i.chroma)) continue;
          out.push(
            fail(
              `${h.file}:${h.line}`,
              `chroma ${i.chroma} — the one the walk is measured at`,
              h.text,
            ),
          );
        }
        for (const h of grep(rel, /[×x]\s*([\d.]+)\s*°/g))
          for (const m of h.m) {
            if (m[1] === i.angle) continue;
            out.push(
              fail(
                `${h.file}:${h.line}`,
                `the golden angle, ${i.angle}°`,
                `${m[1]}° — ${h.text}`,
              ),
            );
          }
        for (const s of sentences(rel)) {
          // A DECLARATION is the band, not a claim about it — the CSS states the
          // two values one at a time and is not lying by doing so.
          const prose = s.replace(new RegExp(`${i.varName}\\s*:[^;]*;?`, "g"), "");
          if (
            !prose.includes(i.varName) ||
            !/\b(paper|night|light|dark)\b/i.test(prose)
          )
            continue;
          const seen = [
            ...new Set([...prose.matchAll(/\b0\.\d\b/g)].map((m) => m[0])),
          ].sort();
          if (!seen.length || seen.join("/") === bandSet) continue;
          out.push(
            fail(
              rel,
              `both lightnesses — ${i.light} on paper, ${i.dark} at night`,
              `${seen.join("/")} — ${s.slice(0, 160)}`,
            ),
          );
        }
      }
      return out;
    },
  },
  {
    // W5 row 7. The large run is the condition the trie veto was declined on, so
    // its dimensions are a claim: twenty thousand ops, sixteen authors, eighty-one
    // cells, and the SHIPPED undo cap — a stress row proving a cap the app does
    // not have proves nothing, so the two consts are held together here.
    id: "session-stress-constants",
    derived: () => {
      const s = D.stress;
      return s.ops
        ? `${fmt(s.ops)} ops · ${s.authors} authors · ${s.cells} cells · undo cap ${s.cap} (${MP.stress}), shipped cap ${s.shippedCap} (${MP.undo})`
        : `UNDERIVED: no OPS const parsed out of ${MP.stress}`;
    },
    run: () => {
      const s = D.stress;
      const missing = ["ops", "authors", "cells", "cap"].filter((k) => !s[k]);
      if (missing.length)
        return [
          fail(
            MP.stress,
            "OPS · AUTHORS · CELLS · UNDO_CAP",
            `unparsed: ${missing.join(", ")}`,
          ),
        ];
      const out = [];
      if (s.cap !== s.shippedCap)
        out.push(
          fail(
            MP.stress,
            `UNDO_CAP ${s.shippedCap} — the cap the board actually ships (${MP.undo})`,
            `${s.cap} — the run proves a cap nothing else has`,
          ),
        );
      const figure = (win, re) => {
        const m = win.match(re);
        if (!m) return null;
        return /^\d/.test(m[1]) ? num(m[1]) : WORDS.indexOf(m[1].toLowerCase());
      };
      const WORD =
        "\\d[\\d,]*|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen";
      for (const rel of [...mpProse(), MP.stress, MP.undo])
        for (const w of windows(rel)) {
          const t = w.text;
          if (/\b(ops|writes)\b/i.test(t) && /\bauthors?\b/i.test(t)) {
            const ops = figure(
              t,
              new RegExp(`(${WORD})\\s+(?:\\w+\\s+)?(?:ops|writes)\\b`, "i"),
            );
            const authors = figure(t, new RegExp(`(${WORD})\\s+authors?\\b`, "i"));
            if (ops !== null && ops !== s.ops)
              out.push(
                fail(`${w.file}:${w.line}`, `${fmt(s.ops)} ops`, `${ops} — ${t}`),
              );
            if (authors !== null && authors !== s.authors)
              out.push(
                fail(
                  `${w.file}:${w.line}`,
                  `${s.authors} authors`,
                  `${authors} — ${t}`,
                ),
              );
          }
          if (/\bcells\b/i.test(t) && /\b(ops|writes)\b/i.test(t)) {
            const cells = figure(t, new RegExp(`(${WORD})\\s+cells\\b`, "i"));
            if (cells !== null && cells !== s.cells)
              out.push(
                fail(`${w.file}:${w.line}`, `${s.cells} cells`, `${cells} — ${t}`),
              );
          }
          if (/\bundo\b/i.test(t) && /\bcapp?e?d?\b/i.test(t)) {
            const cap = figure(
              t,
              new RegExp(`cap(?:ped)?\\s*(?:at|of|=|:)?\\s*(${WORD})`, "i"),
            );
            if (cap !== null && cap !== s.cap)
              out.push(fail(`${w.file}:${w.line}`, `cap ${s.cap}`, `${cap} — ${t}`));
          }
        }
      return out;
    },
  },
  {
    // W5 row 8, C18. `useSession.ts` has called the relay "~150 lines" since
    // T6.1, and T6.2 and T7-W4 both grew it — the frame cap, the close-announce.
    // A line count is a figure that moves with every edit, so the row asserts a
    // BAND rather than an integer, and reads the qualifier: "lines" is the file,
    // "lines of code" is the file minus its comments, and both are honest.
    id: "relay-loc",
    derived: () =>
      `${MP.relay}: ${D.loc.total} lines, ${D.loc.code} of code · web/relay/: ${D.loc.dir} lines across ${D.loc.files.join(", ")}`,
    run: () => {
      const { total, code } = D.loc;
      if (!total)
        return [fail(MP.relay, "the relay module, to count", "file absent or empty")];
      const band = (n, of) => Math.abs(n - of) <= of * 0.1;
      const out = [];
      for (const rel of mpProse())
        for (const h of grep(rel, /(~|about\s+)?\b([\d,]{2,})\s+lines\b/g)) {
          if (!/web\/relay|relay\.ts/.test(h.text)) continue;
          for (const m of h.m) {
            const got = num(m[2]);
            const asCode = /lines of code|code lines?|non-comment|statements/i.test(
              h.text,
            );
            if (band(got, asCode ? code : total)) continue;
            out.push(
              fail(
                `${h.file}:${h.line}`,
                asCode
                  ? `${code} lines of code (±10%)`
                  : `${total} lines (±10%) — ${code} of them code, if that is the figure meant`,
                `${m[2]} — ${h.text}`,
              ),
            );
          }
        }
      return out;
    },
  },
  {
    // W5 row 9. The reconnect ladder is the whole of the arm's durability claim —
    // a table left open overnight must come back, and must not walk itself out to
    // a ten-minute retry. The prose may repeat the last rung (that IS the cap);
    // it may not invent one.
    id: "relay-backoff-ladder",
    derived: () =>
      D.ladder.length
        ? `RETRY_MS [${D.ladder.join(", ")}] ms, capped at ${D.ladder[D.ladder.length - 1]} (${MP.wire})`
        : `UNDERIVED: no RETRY_MS array parsed out of ${MP.wire}`,
    run: () => {
      const l = D.ladder;
      if (l.length < 2)
        return [
          fail(
            MP.wire,
            "a `const RETRY_MS` ladder to derive from",
            `${l.length} rungs`,
          ),
        ];
      const out = [];
      if (!l.every((n, i) => i === 0 || n > l[i - 1]))
        out.push(
          fail(
            MP.wire,
            "a strictly rising ladder — the cap is the last rung, which is what the arm indexes",
            `[${l.join(", ")}]`,
          ),
        );
      const want = l.join(",");
      for (const rel of [...mpProse(), MP.wireTest])
        for (const w of windows(rel)) {
          if (!/back-?off|retr(?:y|ies|ied)|reconnect/i.test(w.text)) continue;
          const seen = [...w.text.matchAll(/\b\d{3,4}\b/g)].map((m) => Number(m[0]));
          if (seen.length < 3) continue;
          while (seen.length > 1 && seen[seen.length - 1] === seen[seen.length - 2])
            seen.pop();
          if (seen.join(",") === want) continue;
          out.push(
            fail(
              `${w.file}:${w.line}`,
              `the ladder as declared: ${l.join(" · ")} ms (the last rung may repeat — that is the cap)`,
              `${seen.join(" · ")} — ${w.text}`,
            ),
          );
        }
      return out;
    },
  },
  {
    // W5 row 10. The page is one truth across a seam whose two halves deploy
    // separately; the sections a future edit is likeliest to drop are the ones
    // that document the half the editor isn't looking at. `sudoku-md-sections`'
    // shape, on the multiplayer record — plus the two links, because a page no
    // README reaches is a page nobody reads.
    id: "multiplayer-md-sections",
    derived: () =>
      `${MP.page} ${has(MP.page) ? "present" : "ABSENT"} — owed the wire, the relay, and the trust model, linked from both READMEs`,
    run: () => {
      const text = read(MP.page);
      if (text === null)
        return [
          fail(
            MP.page,
            "the client + relay reference, one page across the seam",
            "file absent",
          ),
        ];
      const heads = (text.match(/^##+ .*/gm) ?? []).map((h) => h.trim());
      const out = [/\bwire\b/i, /\brelay\b/i, /\btrust\b/i]
        .filter((re) => !heads.some((h) => re.test(h)))
        .map((re) =>
          fail(
            MP.page,
            `a section heading matching ${re}`,
            `headings: ${heads.join(" · ") || "none"}`,
          ),
        );
      for (const rel of ["README.md", "web/frontend/README.md"])
        if (!/\]\([^)]*multiplayer\.md\)/.test(read(rel) ?? ""))
          out.push(
            fail(
              rel,
              `a link to ${MP.page}`,
              "no link — the page is unreachable from here",
            ),
          );
      return out;
    },
  },
];

// ── self-test: every T7-W0 row proved able to red, and to green ────────────

/**
 * Fixtures for the nine new rows and the two fixed ones. Each RED case is a
 * doc that lies; each GREEN case is the SAME claim told true, built from the
 * derivation — so the pair is the cure contract, executable.
 */
function selfTestCases() {
  const perm = D.permalink.wired;
  const stems = D.rosters.frontend.map((f) => f.replace(/\.mjs$/, ""));
  const bench = D.benches.names;
  const live = D.variants.variants;
  const total = D.e2e.tests + D.golden.tests + D.throttle.tests;
  const s = D.scenarios;
  const perfRel = "web/frontend/perf-rig/README.md";
  const rest = s.keys.filter(
    (k) => !s.defaults.includes(k) && !s.diagnostic.includes(k),
  );
  const perf = (withRest) =>
    [
      `Default set: \`${s.defaults.join(",")}\`.`,
      `Diagnostic only: ${s.diagnostic.map((k) => `\`${k}\``).join(" / ")}.`,
      `CI-gated — the CI subset drives ${s.gated
        .filter((g) => s.keys.includes(g))
        .map((k) => `\`${k}\``)
        .join(", ")}.`,
      ...(withRest ? [`Ungated: ${rest.map((k) => `\`${k}\``).join(", ")}.`] : []),
    ].join("\n");
  const rootTree = (entries) =>
    [
      "```",
      ".",
      ...entries.map((e) => `├── scripts/${e}               a gate`),
      "```",
    ].join("\n");

  return [
    {
      row: "permalink-games",
      why: "a clause giving the permalink to a proper subset",
      docs: {
        "README.md":
          "Sudoku and Futoshiki share a board over `?board=`; the rest do not.",
      },
      expect: "RED",
    },
    {
      row: "permalink-games",
      why: "the unwired claim, over specs that all declare a urlCodec",
      docs: {
        "README.md": "Their share permalink isn't wired — `writeShareUrl` no-ops.",
      },
      expect: "RED",
    },
    {
      row: "permalink-games",
      why: "the cure: the permalink clause names every wired game",
      docs: {
        "README.md": `All five games — ${perm.join(", ")} — round-trip a board through \`?board=\`.`,
      },
      expect: "GREEN",
    },
    {
      row: "cited-paths-exist",
      why: "a backticked path and a bare basename, neither in the tree",
      docs: {
        "README.md": "`games/registry.ts` is the table; each game declares `game.ts`.",
      },
      expect: "RED",
    },
    {
      row: "cited-paths-exist",
      why: "a tree block naming a directory that does not exist",
      docs: {
        "README.md": ["```", ".", "├── web/frontend/       # SudokuBoard/", "```"].join(
          "\n",
        ),
      },
      expect: "RED",
    },
    {
      row: "cited-paths-exist",
      why: "the cure: the paths that actually hold the table and the contract",
      docs: {
        "README.md":
          "`web/frontend/src/games/cards.ts` is the table; each game declares `spec.ts`.",
      },
      expect: "GREEN",
    },
    {
      row: "worker-topology",
      why: "the per-game topology and its count",
      docs: {
        "README.md":
          "Each game owns `solver/solver.worker.ts`. Five workers ride one transport.",
      },
      expect: "RED",
    },
    {
      row: "worker-topology",
      why: `the cure: one worker module, ${D.workers[0]}`,
      docs: {
        "README.md": `One worker, \`${D.workers[0]}\`, is shared by every game.`,
      },
      expect: "GREEN",
    },
    {
      row: "e2e-total-arithmetic",
      why: "a whole-suite total that is not the sum of the three configs",
      docs: { "README.md": `${total + 1} tests in all.` },
      expect: "RED",
    },
    {
      row: "e2e-total-arithmetic",
      why: `the cure: ${D.e2e.tests} + ${D.golden.tests} + ${D.throttle.tests} = ${total}`,
      docs: { "README.md": `${total} tests in all.` },
      expect: "GREEN",
    },
    {
      row: "constraint-enum-variants",
      why: "the retired `Soft` variant, and an enumeration missing the cages",
      docs: {
        "docs/optimizations.md":
          "`ConstraintEnum` names `NotEqual`, `AllDifferent`, `AllDifferentExcept`, `Soft`, `Custom`.",
      },
      expect: "RED",
    },
    {
      row: "constraint-enum-variants",
      why: `the cure: ${live.join(", ")}`,
      docs: {
        "docs/optimizations.md": `\`ConstraintEnum\` names ${live.map((v) => `\`${v}\``).join(", ")}.`,
      },
      expect: "GREEN",
    },
    {
      row: "frontend-scripts-roster",
      why: "a roster naming two of the frontend gate scripts",
      docs: { "README.md": `The gates: \`${stems[0]}\`, \`${stems[1]}\`.` },
      expect: "RED",
    },
    {
      row: "frontend-scripts-roster",
      why: "a file tree naming one of the root scripts/ entries",
      docs: { "README.md": rootTree([D.rosters.root[0]]) },
      expect: "RED",
    },
    {
      row: "frontend-scripts-roster",
      why: `the cure: all ${stems.length} frontend gates and all ${D.rosters.root.length} root entries`,
      docs: {
        "README.md": `The gates: ${stems.join(", ")}.\n\n${rootTree(D.rosters.root)}`,
      },
      expect: "GREEN",
    },
    {
      row: "bench-target-roster",
      why: "a bench roster of three, against a manifest declaring more",
      docs: { "README.md": `Benches: ${bench.slice(0, 3).join(", ")}.` },
      expect: "RED",
    },
    {
      row: "bench-target-roster",
      why: `the cure: all ${bench.length} targets`,
      docs: { "README.md": `Benches: ${bench.join(", ")}.` },
      expect: "GREEN",
    },
    {
      row: "redirects-rule-count",
      why: "the SPA-fallback-only claim over a two-rule file",
      docs: { "README.md": "`_redirects` carries the SPA fallback only." },
      expect: "RED",
    },
    {
      row: "redirects-rule-count",
      why: "a rule count that disagrees with the file",
      docs: {
        "README.md": `\`_redirects\` carries ${D.redirects.rules.length + 1} rules.`,
      },
      expect: "RED",
    },
    {
      row: "redirects-rule-count",
      why: `the cure: ${WORDS[D.redirects.rules.length]} rules, the 404 guard named`,
      docs: {
        "README.md": `\`_redirects\` carries ${WORDS[D.redirects.rules.length]} rules: the \`/assets/*\` 404 guard and the SPA fallback.`,
      },
      expect: "GREEN",
    },
    {
      row: "perf-rig-scenario-roster",
      why: "a scenario sentence that stops short of the table",
      docs: { [perfRel]: perf(false) },
      expect: "RED",
    },
    {
      row: "perf-rig-scenario-roster",
      why: `the cure: all ${s.keys.length} keys, each in its partition`,
      docs: { [perfRel]: perf(true) },
      expect: "GREEN",
    },
    {
      row: "pencil-boil-0.9.2",
      why: "the pin on the line AFTER the package name — the miss this row was fixed for",
      docs: {
        "docs/animation.md":
          "Primitives come from [`@mkbabb/pencil-boil`](https://example)\n`^0.0.1`: the scheduler.",
      },
      expect: "RED",
    },
    {
      row: "pencil-boil-0.9.2",
      why: `the cure: ${D.pencil}, wherever in the window it sits`,
      docs: {
        "docs/animation.md": `Primitives come from [\`@mkbabb/pencil-boil\`](https://example)\n\`${D.pencil}\`: the scheduler.`,
      },
      expect: "GREEN",
    },
    {
      row: "chromium-alone-claim",
      why: "a single-browser claim against a two-project config",
      docs: { "README.md": "CI runs chromium alone." },
      expect: "RED",
    },
    {
      row: "chromium-alone-claim",
      why: "a both-engines claim against a ONE-project config — the case the old early return greened",
      stub: { projects: ["chromium"] },
      docs: {
        "README.md": "The suite runs chromium + webkit, each with its own lane.",
      },
      expect: "RED",
    },
    {
      row: "chromium-alone-claim",
      why: "the cure under a one-project config: say chromium alone",
      stub: { projects: ["chromium"] },
      docs: { "README.md": "CI runs chromium alone." },
      expect: "GREEN",
    },

    // ── T7-W5, the multiplayer record ────────────────────────────────────
    // Four of these ten rows are born RED on the tree as it stands, so their
    // GREEN case has to mount the cure over the site that lies — which makes
    // the pair the cure contract, executable, exactly as it is above.
    {
      row: "relay-origin-pair",
      why: "a doc naming a relay origin the CSP does not grant",
      docs: {
        "README.md": "The board joins over `wss://sudoku-relay-staging.workers.dev`.",
      },
      expect: "RED",
    },
    {
      row: "relay-origin-pair",
      why: `the cure: the one origin, wss://${D.origin.cspHost}`,
      docs: {
        "README.md": `The board joins over \`${D.origin.url}\` — the origin \`_headers\` grants and \`${D.origin.name}\` answers on.`,
      },
      expect: "GREEN",
    },
    {
      row: "retired-arm-clean",
      why: "the relay header describing trystero as the consumer it serves",
      docs: {
        [MP.relay]:
          "// WHAT IT SPEAKS is the subset trystero's nostr strategy actually uses.",
      },
      expect: "RED",
    },
    {
      row: "retired-arm-clean",
      why: "the cure: trystero named only as the arm that left",
      docs: {
        [MP.relay]:
          "// trystero left with the WebRTC it existed to negotiate (T6.2); the client speaks these frames itself.",
      },
      expect: "GREEN",
    },
    {
      row: "multiplayer-wire-verbs",
      why: "the header counting the type instead of the wire",
      docs: { [MP.session]: " * THREE MESSAGES, and each earns its place:" },
      expect: "RED",
    },
    {
      row: "multiplayer-wire-verbs",
      why: "an enumeration that drops the fourth word",
      docs: { "README.md": "The wire speaks `hi`, `op` and `st`." },
      expect: "RED",
    },
    {
      row: "multiplayer-wire-verbs",
      why: `the cure: ${WORDS[D.verbs.verbs.length]} verbs, ${D.verbs.verbs.join("/")}`,
      docs: {
        "README.md": `${WORDS[D.verbs.verbs.length]} messages ride it — ${D.verbs.verbs.map((v) => `\`${v}\``).join(", ")}.`,
      },
      expect: "GREEN",
    },
    {
      row: "relay-event-kind",
      why: "a kind inside the ephemeral range that is not the one the arm publishes",
      docs: { "README.md": `Ops ride ephemeral kind ${D.kind.kind + 1}.` },
      expect: "RED",
    },
    {
      row: "relay-event-kind",
      why: `the cure: kind ${D.kind.kind}, named inside its range`,
      docs: {
        "README.md": `Ops ride ephemeral kind ${D.kind.kind}, inside NIP-01's ${D.kind.range.join("–")} do-not-store range.`,
      },
      expect: "GREEN",
    },
    {
      row: "slug-space-figures",
      why: "a survivor count the filter regex does not produce",
      docs: {
        "README.md": `${fmt(D.slugs.rows[0].kept + 1)} of ${fmt(D.slugs.rows[0].all)} ${D.slugs.rows[0].k} survive the cut.`,
      },
      expect: "RED",
    },
    {
      row: "slug-space-figures",
      why: `the cure: ${D.slugs.rows.map((r) => `${fmt(r.kept)}/${fmt(r.all)}`).join(" · ")} — ${fmt(D.slugs.names)} names`,
      docs: {
        "README.md": `${D.slugs.rows.map((r) => `${fmt(r.kept)} of ${fmt(r.all)} ${r.k}`).join(" and ")} survive the cut, which is ${fmt(D.slugs.names)} names.`,
      },
      expect: "GREEN",
    },
    {
      row: "peer-ink-formula",
      why: "half the band — the night value drifted",
      docs: {
        "README.md": `A peer's \`${D.ink.varName}\` is ${D.ink.light} on paper and 0.7 at night.`,
      },
      expect: "RED",
    },
    {
      row: "peer-ink-formula",
      why: `the cure: chroma ${D.ink.chroma}, ${D.ink.angle}°, ${D.ink.light}/${D.ink.dark}`,
      docs: {
        "README.md": `Every peer writes in \`oklch(var(${D.ink.varName}) ${D.ink.chroma} hue)\` with \`hue = i × ${D.ink.angle}°\`; \`${D.ink.varName}\` is ${D.ink.light} on paper and ${D.ink.dark} at night.`,
      },
      expect: "GREEN",
    },
    {
      row: "session-stress-constants",
      why: "an author count the large run does not use",
      docs: {
        "README.md": `The ledger takes ${fmt(D.stress.ops)} ops from ${D.stress.authors + 1} authors.`,
      },
      expect: "RED",
    },
    {
      row: "session-stress-constants",
      why: `the cure: ${fmt(D.stress.ops)} · ${D.stress.authors} · ${D.stress.cells} · cap ${D.stress.cap}`,
      docs: {
        "README.md": `The ledger takes ${fmt(D.stress.ops)} ops from ${D.stress.authors} authors over ${D.stress.cells} cells, beside an undo history capped at ${D.stress.cap}.`,
      },
      expect: "GREEN",
    },
    {
      row: "relay-loc",
      why: "the ~150-line relay, three growths ago",
      docs: {
        [MP.session]: " * `web/relay/` is ~150 lines of NIP-01 on a Durable Object.",
      },
      expect: "RED",
    },
    {
      row: "relay-loc",
      why: `the cure: ${D.loc.total} lines, ${D.loc.code} of code`,
      docs: {
        [MP.session]: ` * \`web/relay/relay.ts\` is ${D.loc.total} lines of NIP-01, ${D.loc.code} of them code.`,
      },
      expect: "GREEN",
    },
    {
      row: "relay-backoff-ladder",
      why: "a rung that is not in the array",
      docs: {
        "README.md": `A dropped socket retries at ${[...D.ladder.slice(0, -2), 3000, D.ladder[D.ladder.length - 1]].join(", ")} ms.`,
      },
      expect: "RED",
    },
    {
      row: "relay-backoff-ladder",
      why: `the cure: ${D.ladder.join(" · ")} ms, the last rung repeating as the cap`,
      docs: {
        "README.md": `A dropped socket retries at ${D.ladder.join(", ")} ms, then ${D.ladder[D.ladder.length - 1]} forever.`,
      },
      expect: "GREEN",
    },
    {
      row: "multiplayer-md-sections",
      why: "a page that dropped the relay's half of the seam",
      docs: {
        [MP.page]: "# Multiplayer\n\n## The wire\n\n## Trust, and what it rests on",
        "README.md": `[the multiplayer record](${MP.page})`,
        "web/frontend/README.md": `[the multiplayer record](../../${MP.page})`,
      },
      expect: "RED",
    },
    {
      row: "multiplayer-md-sections",
      why: "the page whole, but reachable from neither README",
      docs: {
        [MP.page]:
          "# Multiplayer\n\n## The wire\n\n## The relay\n\n## Trust, and what it rests on",
      },
      expect: "RED",
    },
    {
      row: "multiplayer-md-sections",
      why: "the cure: all three sections, linked from both READMEs",
      docs: {
        [MP.page]:
          "# Multiplayer\n\n## The wire\n\n## The relay\n\n## Trust, and what it rests on",
        "README.md": `[the multiplayer record](${MP.page})`,
        "web/frontend/README.md": `[the multiplayer record](../../${MP.page})`,
      },
      expect: "GREEN",
    },
  ];
}

function runSelfTest() {
  const out = [];
  const say = (s = "") => out.push(s);
  const cases = selfTestCases();
  // The W5 rows read source, not only docs — their prose lives in the headers
  // that ARE the protocol's documentation — so the overlay has to blank those
  // too, or a fixture would be graded against the live tree beside it. Every
  // W5 derivation is taken at module load, off the real files, so blanking a
  // site here moves the assertion and never the expected value.
  const scoped = [
    ...DOCS,
    "web/frontend/perf-rig/README.md",
    ...Object.values(MP).filter((rel) => rel !== MP.page),
  ];
  let bad = 0;
  say(
    `doc-truth --self-test — ${cases.length} fixtures over ${new Set(cases.map((c) => c.row)).size} rows`,
  );
  say(`repo  ${ROOT}`);
  say();
  for (const c of cases) {
    const expect = c.expect;
    const saved = c.stub
      ? Object.fromEntries(Object.keys(c.stub).map((k) => [k, D[k]]))
      : null;
    if (c.stub) Object.assign(D, c.stub);
    OVERLAY.clear();
    for (const d of scoped) OVERLAY.set(d, "");
    for (const [k, v] of Object.entries(c.docs)) OVERLAY.set(k, v);
    const failures = ROWS.find((r) => r.id === c.row).run();
    OVERLAY.clear();
    if (saved) Object.assign(D, saved);
    const got = failures.length ? "RED" : "GREEN";
    const ok = got === expect;
    if (!ok) bad++;
    say(`${ok ? "PASS" : "FAIL"}  ${c.row}  expect ${expect} · got ${got}`);
    say(`        ${c.why}${c.stub ? ` [stub: ${JSON.stringify(c.stub)}]` : ""}`);
    for (const f of failures.slice(0, 2)) say(`        · ${f.site}: ${f.got}`);
    say();
  }
  say(
    `${cases.length - bad} PASS / ${bad} FAIL — ${bad ? "a fixture disagrees with its row" : "every row proved both colours"}`,
  );
  process.stdout.write(out.join("\n") + "\n");
  process.exitCode = bad ? 1 : 0;
}

if (process.argv.includes("--self-test")) {
  runSelfTest();
  process.exit(process.exitCode ?? 0);
}

// ── report ─────────────────────────────────────────────────────────────────

const head = (() => {
  try {
    return execFileSync("git", ["rev-parse", "--short", "HEAD"], {
      cwd: ROOT,
      encoding: "utf8",
    }).trim();
  } catch {
    return "unknown";
  }
})();

const lines = [];
const say = (s = "") => lines.push(s);

say(`doc-truth — ${ROWS.length} rows, every figure re-derived at run time`);
say(`repo  ${ROOT}`);
say(`head  ${head}`);
say(`node  ${process.version} ${process.platform}/${process.arch}`);
say(`when  ${new Date().toISOString()}`);
say();

let red = 0;
const results = [];
for (const row of ROWS) {
  const failures = row.run();
  if (failures.length) red++;
  results.push({ id: row.id, failures });
  say(`${failures.length ? "RED  " : "GREEN"}  ${row.id}`);
  say(`        derived: ${row.derived()}`);
  for (const f of failures) {
    say(`        ${f.site}`);
    say(`          expected: ${f.expected}`);
    say(`          got:      ${f.got}`);
  }
  say();
}

say(
  `${red} RED / ${ROWS.length - red} GREEN — ${red ? "doc canon disagrees with the tree" : "canon holds"}`,
);

process.stdout.write(lines.join("\n") + "\n");
process.exitCode = red ? 1 : 0;
