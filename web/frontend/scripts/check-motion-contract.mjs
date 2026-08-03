#!/usr/bin/env node
// T7-W3 cross-cutting gate 2 — the per-file MOTION CONTRACT.
//
// Every e2e spec runs against a surface that either boils at ~8 Hz or is frozen at pose 0, and
// until now not one of them said which. That silence is CH-65's real residue: the finding that
// `test.use({ reducedMotion })` is VOID at @playwright/test 1.61.1 was measured on 2026-07-11
// (`b4d7aedf9`), written into a comment in ONE spec, and the golden family re-derived it from
// scratch 22 days later — a finding held in prose with no gate propagates to nobody. A spec's
// motion state is a CONTRACT: it decides whether a geometry read is stable, whether a golden
// pins pose 0 or "pose 1, ~one beat after settle", and whether a flake is the runner's fault
// or the author's. So each file declares it, in its head, in one grammar:
//
//   // PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before goto
//   // PRM: live, because <reason>
//
// Three checks, all evaluated before the verdict:
//
//   1  DECLARED   every e2e/*.spec.ts carries a `PRM:` declaration inside its first HEAD_LINES
//                 lines. Undeclared reds — the file is listed by name.
//   2  GRAMMAR    the declaration parses: mode is `frozen` or `live`; `frozen` carries a cite
//                 after the em-dash; `live` carries `, because <reason>`. Two declarations that
//                 disagree red too — a file has ONE motion state.
//   3  ROUTE      a `frozen` claim is backed by the route that provably lands: an
//                 `emulateMedia({ … reducedMotion … })` call in the file, or in an e2e helper the
//                 declaration cites by path. A file whose only PRM route is `test.use` /
//                 config `use` reds here, because that route silently drops (measured; pinned
//                 live by e2e/prm-void-audition.spec.ts). This is the check that makes CH-65
//                 un-re-derivable: the void form can never again masquerade as a freeze.
//
// The gate reads heads, not behaviour — it cannot know a spec is honest, only that it has
// committed to an answer. That's the point: the declaration is the thing a reviewer diffs.
//
// TWO SCOPE CONSTRAINTS, stated rather than left implied (T7-W3 residue, from this script's own
// gap list):
//
//   · RECURSIVE COLLECTION. `specs()` walks `e2e/` AND every directory under it. It was a flat
//     `readdirSync` at birth, which meant a spec filed one level down — the ordinary shape the
//     first time this suite is grouped by family — carried no obligation at all and the gate
//     stayed green over it. A contract with a directory-shaped hole is not a contract. Helpers
//     resolve the same way, so a `frozen` file may cite one by bare filename from any depth.
//
//   · HEAD_LINES = 20, AND THAT IS A LIMIT, NOT A PREFERENCE. The declaration must sit inside a
//     file's first twenty lines — after the imports and any one-line banner, ABOVE the doc
//     essay. Twenty is chosen so the contract lands in a diff hunk's context and on the first
//     screen of `head`; raising it would let a contract hide behind a prologue, which is the
//     exact failure this gate exists for. A file whose header grows is expected to carry the
//     `PRM:` line up with it, and check 1 says so by name when it finds a declaration below the
//     window rather than reporting a bare "silent".
//
// Run: `node scripts/check-motion-contract.mjs` (cwd web/frontend).
//      `--self-test` re-runs each check against a known-bad model and FAILS if any of them
//      passes — the canary. It sabotages the collected copy, never the repo.

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const E2E = join(ROOT, "e2e");

/** The declaration is a HEAD declaration — it's read before the first import is understood. */
const HEAD_LINES = 20;

/** Shortest cite/reason that can carry meaning. Below this it's a placeholder. */
const MIN_REASON = 8;

/** Any comment line that claims the contract, well-formed or not. Check 2 judges the shape. */
const CLAIM = /^\s*(?:\/\/|\*|\/\*)\s*PRM:\s*(.+?)\s*$/;

/** The two lawful forms. `—` is the estate's em-dash; `--` and `-` are accepted as typo-mercy
 *  ONLY in the cite position, never as a mode. */
const FROZEN = /^frozen\s*(?:—|--|-)\s*(.+)$/i;
const LIVE = /^live\s*,\s*because\s+(.+)$/i;
/** Enough to tell "wrong mode word" from "not a declaration at all". */
const MODE = /^([A-Za-z-]+)/;

/** The route that lands: an emulateMedia call carrying reducedMotion (any formatting). */
const EMULATE_ROUTE = /emulateMedia\s*\(\s*\{[\s\S]{0,200}?reducedMotion/;
/** The route that does NOT land at 1.61.1 — declared contract, no effect. */
const USE_ROUTE = /test\.use\s*\(\s*\{[\s\S]{0,400}?reducedMotion/;

/* ── collection ────────────────────────────────────────────────────────────── */

/**
 * Every `.ts` under `e2e/`, RECURSIVELY, as paths relative to `e2e/` — so a red names the file
 * the way the runner does (`family/foo.spec.ts`), and a spec in a subdirectory cannot escape the
 * contract by being filed one level down. Dot-directories and `node_modules` are skipped;
 * nothing else is.
 */
const walk = (rel = "") =>
  readdirSync(join(E2E, rel), { withFileTypes: true }).flatMap((d) => {
    const path = rel ? `${rel}/${d.name}` : d.name;
    if (d.isDirectory())
      return d.name.startsWith(".") || d.name === "node_modules" ? [] : walk(path);
    return path.endsWith(".ts") ? [path] : [];
  });

const specs = () =>
  walk()
    .filter((f) => f.endsWith(".spec.ts"))
    .sort();

/** Every non-spec .ts under e2e/ is a candidate helper a frozen file may cite for its route.
 *  Keyed by path-relative-to-e2e; check 3 matches a cite against the basename, so a helper is
 *  citable by filename alone from any depth. */
const helpers = () =>
  Object.fromEntries(
    walk()
      .filter((f) => !f.endsWith(".spec.ts"))
      .map((f) => [f, readFileSync(join(E2E, f), "utf8")]),
  );

function collect() {
  const files = specs().map((file) => {
    const source = readFileSync(join(E2E, file), "utf8");
    const lines = source.split("\n");
    return { file, head: lines.slice(0, HEAD_LINES).join("\n"), source };
  });
  return { files, helpers: helpers() };
}

/** The claims a file's head makes, in order. */
const claimsOf = (head) =>
  head
    .split("\n")
    .map((l) => l.match(CLAIM)?.[1])
    .filter(Boolean);

/* ── the checks ────────────────────────────────────────────────────────────── */

function check1Declared({ files }) {
  const bad = [];
  for (const { file, head, source } of files) {
    if (claimsOf(head).length) continue;
    const late = claimsOf(source).length
      ? ` (a \`PRM:\` line exists further down — move it into the first ${HEAD_LINES} lines; ` +
        `a contract read after 200 lines of setup is not a contract)`
      : "";
    bad.push(
      `${file}: NO motion declaration${late}. Add one to the head:\n` +
        `        // PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before goto\n` +
        `        // PRM: live, because <reason>`,
    );
  }
  return bad;
}

function check2Grammar({ files }) {
  const bad = [];
  for (const { file, head } of files) {
    const claims = claimsOf(head);
    const modes = new Set();
    for (const claim of claims) {
      const frozen = claim.match(FROZEN);
      const live = claim.match(LIVE);
      if (frozen) {
        modes.add("frozen");
        if (frozen[1].trim().length < MIN_REASON)
          bad.push(
            `${file}: \`PRM: frozen\` with no usable cite — name the route and where it runs ` +
              `(the estate's form: "emulateMedia({reducedMotion:'reduce'}) before goto").`,
          );
        continue;
      }
      if (live) {
        modes.add("live");
        if (live[1].trim().length < MIN_REASON)
          bad.push(
            `${file}: \`PRM: live, because\` with no usable reason. Motion left running is a ` +
              `choice; say what the spec measures that needs it.`,
          );
        continue;
      }
      const mode = claim.match(MODE)?.[1] ?? claim.slice(0, 20);
      bad.push(
        `${file}: unparseable declaration \`PRM: ${claim.slice(0, 60)}\` — mode read as ` +
          `"${mode}". Exactly two are lawful: \`frozen — <cite>\` or \`live, because <reason>\`.`,
      );
    }
    if (modes.size > 1)
      bad.push(
        `${file}: declares BOTH ${[...modes].sort().join(" and ")}. A file has one motion ` +
          `state; per-test exceptions live at the test, and the head states the file's rule.`,
      );
  }
  return bad;
}

function check3Route({ files, helpers }) {
  const bad = [];
  for (const { file, head, source } of files) {
    const frozen = claimsOf(head).some((c) => FROZEN.test(c));
    if (!frozen) continue;
    if (EMULATE_ROUTE.test(source)) continue;
    // A freeze may live in an e2e helper — the declaration has to name it by path.
    const cited = [...head.matchAll(/([\w./-]+\.ts)/g)].map((m) =>
      m[1].split("/").pop(),
    );
    if (
      Object.entries(helpers).some(
        ([path, src]) =>
          cited.includes(path.split("/").pop()) && EMULATE_ROUTE.test(src),
      )
    )
      continue;
    bad.push(
      `${file}: declares \`PRM: frozen\` but no \`emulateMedia({ reducedMotion })\` runs — ` +
        (USE_ROUTE.test(source)
          ? `its only PRM route is \`test.use({ reducedMotion })\`, which is VOID at ` +
            `@playwright/test 1.61.1 (the runner drops it; e2e/prm-void-audition.spec.ts pins ` +
            `that live). The declared freeze never happens and the beat runs under every ` +
            `assertion in this file. `
          : `nothing in the file applies PRM at all. `) +
        `Call \`page.emulateMedia({ reducedMotion: 'reduce' })\` before goto, or cite the e2e ` +
        `helper that does by filename.`,
    );
  }
  return bad;
}

const CHECKS = [
  ["1 DECLARED", check1Declared],
  ["2 GRAMMAR", check2Grammar],
  ["3 ROUTE", check3Route],
];

/* ── self-test: every check shown able to fail ─────────────────────────────── */

const cloneModel = (m) => ({
  files: m.files.map((f) => ({ ...f })),
  helpers: { ...m.helpers },
});

/** Operate on a file that is declared TODAY, so the sabotage is a real regression shape. */
function declaredFile(m) {
  const f = m.files.find(({ head }) => claimsOf(head).some((c) => FROZEN.test(c)));
  if (!f)
    throw new Error(
      "--self-test needs at least one file already declaring `PRM: frozen` to wound. None on " +
        "disk — the born-RED tree is expected; re-run --self-test once the sweep lands.",
    );
  return f;
}

const rewriteHead = (f, fn) => {
  f.head = f.head
    .split("\n")
    .map((l) => (CLAIM.test(l) ? fn(l) : l))
    .join("\n");
};

const SABOTAGES = [
  [
    "1 DECLARED",
    "the declaration is deleted in a refactor (the silent-by-default state)",
    (m) => rewriteHead(declaredFile(m), () => "// (header rewritten)"),
  ],
  [
    "1 DECLARED",
    "the declaration slides below the head window during a doc-block edit",
    (m) => {
      const f = declaredFile(m);
      f.source = f.head + "\n" + f.source;
      rewriteHead(f, () => "// (header rewritten)");
    },
  ],
  [
    "2 GRAMMAR",
    "a third mode is invented (`PRM: reduced`)",
    (m) => rewriteHead(declaredFile(m), () => "// PRM: reduced — sounds official"),
  ],
  [
    "2 GRAMMAR",
    "`PRM: live` lands with no reason — a declaration that says nothing",
    (m) => rewriteHead(declaredFile(m), () => "// PRM: live, because x"),
  ],
  [
    "2 GRAMMAR",
    "`PRM: frozen` lands with an empty cite",
    (m) => rewriteHead(declaredFile(m), () => "// PRM: frozen — yes"),
  ],
  [
    "2 GRAMMAR",
    "two declarations disagree (a merge keeps both sides)",
    (m) => {
      const f = declaredFile(m);
      f.head += "\n// PRM: live, because the celebration crest has to actually run";
    },
  ],
  [
    "3 ROUTE",
    "CH-65 regresses — the freeze is 'restored' as `test.use({ reducedMotion })`",
    (m) => {
      const f = declaredFile(m);
      f.source =
        `test.use({ reducedMotion: 'reduce' });\n` +
        f.source.replace(/emulateMedia/g, "emulateMediaX");
      f.head = f.head.replace(/emulateMedia/g, "emulateMediaX");
    },
  ],
  [
    "3 ROUTE",
    "a frozen file loses its emulateMedia call entirely",
    (m) => {
      const f = declaredFile(m);
      f.source = f.source.replace(/emulateMedia/g, "emulateMediaX");
      f.head = f.head.replace(/emulateMedia/g, "emulateMediaX");
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
  return vacuous;
}

/* ── main ──────────────────────────────────────────────────────────────────── */

const wantSelfTest = process.argv.includes("--self-test");
const model = collect();

const declared = model.files.filter(({ head }) => claimsOf(head).length).length;
console.log(
  `MOTION CONTRACT — ${model.files.length} specs, ${declared} declaring, ` +
    `${model.files.length - declared} silent (head = first ${HEAD_LINES} lines)`,
);

const failures = [];
for (const [name, fn] of CHECKS) {
  const found = fn(model);
  console.log(
    `  ${found.length ? "✗" : "✓"} ${name}${found.length ? ` — ${found.length}` : ""}`,
  );
  for (const f of found) failures.push(`[${name}] ${f}`);
}

if (wantSelfTest) {
  console.log("\nSELF-TEST — each check against a known-bad model:");
  try {
    failures.push(...selfTest(model).map((v) => `[SELF-TEST] ${v}`));
  } catch (err) {
    failures.push(`[SELF-TEST] ${err.message}`);
  }
}

if (failures.length) {
  console.error(`\n${failures.length} failure(s):\n`);
  for (const f of failures) console.error(`  • ${f}\n`);
  process.exit(1);
}

console.log(
  `\nOK — ${model.files.length} specs, every one declaring its motion state, every ` +
    `\`frozen\` backed by the route that lands.`,
);
