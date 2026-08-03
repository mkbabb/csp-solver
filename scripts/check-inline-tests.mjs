#!/usr/bin/env node
// T7-W6 — THE INLINE-TEST GATE (T7-R01). Rust tests live in `tests/`, never in `src/`.
//
// The edict is old and was certified with a two-file grep. `ed07ba6b` (T3-W5, 2026-07-10)
// declared the estate at zero inline test modules; `csp-solver/src/builder/kuhn_munkres.rs`
// grew a `#[cfg(test)] mod tests` **19 h 18 m later**, in the same directory as the file U-09
// split, and nothing in CI could say so for two tranches. A declaration nobody enforces is a
// declaration that expires quietly — so the law gets an instrument.
//
// THE LAW. No `#[cfg(test)]`, no `#[test]`, no `#[wasm_bindgen_test]` anywhere under a
// workspace member's `src/`. Unit tests go one directory over, to `<member>/tests/`, where
// Cargo already links them as their own binaries (the U-09 precedent: `cage.rs`'s tests moved
// to `csp-solver/tests/cage.rs`). A private, dependency-free module is reachable from there via
// `#[path = "../src/…"] mod …;` — `csp-solver/tests/kuhn_munkres.rs` is the worked example — so
// "it's private" never buys an exemption and there is no waiver list here to argue with.
//
// SCOPE IS DERIVED, NEVER ENUMERATED. The members come off the root `Cargo.toml`, so a third
// crate is bound the day it joins the workspace — the hand-enumeration failure the boundary
// matrix already cured one layer up (`eslint.boundary.config.js`).
//
// WHAT IT DOES NOT RED ON: prose. A `//` comment or a `//!` doc line naming the attribute is
// the law being explained, not broken — every line is comment-stripped before the match, and
// quoted strings go with it so `#[cfg(feature = "test")]` stays legal. `#[cfg_attr(test, …)]`
// is a conditional attribute, not a test module, and passes.
//
// Run: `node scripts/check-inline-tests.mjs [--self-test]`
// `--self-test` proves every arm able to FAIL, and able NOT to fire on a clean tree, against
// synthetic sources before the real audit runs. IT DOES NOT EXIT — control falls through to the
// audit below on purpose. See the main block.

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import process from "node:process";

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));

/**
 * The three spellings of an inline test, in one table so the failure output can name which one
 * it caught. `#[cfg(...)]` matches any predicate mentioning a bare `test` token — `all(test, …)`
 * and `any(test, …)` are the same breach wearing a hat.
 */
const RULES = [
  ["cfg-test", /#\[\s*cfg\s*\([^\]]*\btest\b[^\]]*\)\s*\]/],
  ["test-attr", /#\[\s*test\s*\]/],
  ["wasm-test-attr", /#\[\s*wasm_bindgen_test\s*\]/],
];

/**
 * Strip what is not code: quoted strings first (so `feature = "test"` cannot masquerade as the
 * `test` cfg token), then line comments, then whole-line block-comment bodies. Crude by design —
 * this is an attribute grep, not a parser, and every arm it can get wrong is a self-test case.
 */
function codeOf(line) {
  const noStrings = line.replace(/"(?:[^"\\]|\\.)*"/g, '""');
  if (/^\s*(\/\/|\*|\/\*)/.test(noStrings)) return "";
  return noStrings.replace(/\/\/.*$/, "");
}

/** Every `.rs` file under `dir`, recursively. */
function walkRs(dir) {
  let out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return out;
    throw err;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walkRs(p));
    else if (e.isFile() && e.name.endsWith(".rs")) out.push(p);
  }
  return out;
}

/** Workspace members off the root manifest — derived, so a new crate is bound on arrival. */
function membersOf(root) {
  const manifest = join(root, "Cargo.toml");
  if (!existsSync(manifest)) throw new Error(`no workspace manifest at ${manifest}`);
  return (readFileSync(manifest, "utf8").match(/members\s*=\s*\[([^\]]*)\]/)?.[1] ?? "")
    .split(",")
    .map((s) => s.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

/** The whole law in one pure function, so `--self-test` can run it over a synthetic tree. */
function audit(root) {
  const members = membersOf(root);
  if (members.length === 0)
    throw new Error("the root manifest declares no workspace members");
  const scopes = members.map((m) => join(m, "src"));
  const files = scopes.flatMap((s) => walkRs(join(root, s))).sort();
  // A gate that finds no source is a broken instrument, not a clean estate — a moved crate or a
  // renamed member would otherwise green forever on zero files.
  if (files.length === 0)
    throw new Error(`no .rs files under ${scopes.join(", ")} — the scope moved`);

  const hits = [];
  for (const abs of files) {
    const rel = relative(root, abs).split(sep).join("/");
    readFileSync(abs, "utf8")
      .split("\n")
      .forEach((line, i) => {
        const code = codeOf(line);
        for (const [rule, re] of RULES)
          if (re.test(code))
            hits.push({ rule, path: rel, line: i + 1, text: line.trim() });
      });
  }
  return { members, scopes, files: files.length, hits };
}

// ---------------------------------------------------------------- self-test

function selfTest() {
  const cases = [
    {
      name: "the T7-R01 shape — an inline `#[cfg(test)] mod tests` reds",
      files: [
        ["a/src/lib.rs", "#[cfg(test)]\nmod tests {\n    #[test]\n    fn t() {}\n}\n"],
      ],
      want: { "cfg-test": 1, "test-attr": 1 },
    },
    {
      name: '`#[cfg(all(test, feature = "x"))]` reds — the same breach wearing a hat',
      files: [["a/src/lib.rs", '#[cfg(all(test, feature = "x"))]\nmod tests {}\n']],
      want: { "cfg-test": 1 },
    },
    {
      name: "a bare `#[test]` with no cfg gate reds",
      files: [["a/src/lib.rs", "#[test]\nfn t() {}\n"]],
      want: { "test-attr": 1 },
    },
    {
      name: "`#[wasm_bindgen_test]` in src reds too — the wasm crate is in scope",
      files: [["b/src/lib.rs", "#[wasm_bindgen_test]\nfn t() {}\n"]],
      want: { "wasm-test-attr": 1 },
    },
    {
      name: "prose naming the attribute does NOT red — a doc line is the law explained",
      files: [
        [
          "a/src/lib.rs",
          "//! Tests: no `#[cfg(test)]` here.\n// see #[test] in tests/\npub fn f() {}\n",
        ],
      ],
      want: {},
    },
    {
      name: '`#[cfg(feature = "test")]` does NOT red — quoted strings are stripped first',
      files: [["a/src/lib.rs", '#[cfg(feature = "test")]\npub fn f() {}\n']],
      want: {},
    },
    {
      name: "`#[cfg_attr(test, …)]` does NOT red — a conditional attribute is not a test module",
      files: [["a/src/lib.rs", "#[cfg_attr(test, allow(dead_code))]\npub fn f() {}\n"]],
      want: {},
    },
    {
      name: "tests under `<member>/tests/` are out of scope — that is where they belong",
      files: [
        ["a/src/lib.rs", "pub fn f() {}\n"],
        ["a/tests/it.rs", "#[test]\nfn t() {}\n"],
      ],
      want: {},
    },
    {
      // The anti-vacuity control: an instrument that reds on everything is not a gate.
      name: "a conformant tree reds nowhere",
      files: [
        ["a/src/lib.rs", "pub fn f() {}\n"],
        ["b/src/lib.rs", "pub fn g() {}\n"],
      ],
      want: {},
    },
    {
      name: "an empty scope throws rather than reading as a clean tree",
      files: [["a/README.md", "no rust here\n"]],
      wantThrow: /the scope moved/,
    },
  ];

  let failed = 0;
  for (const c of cases) {
    const root = mkdtempSync(join(tmpdir(), "inline-tests-selftest-"));
    try {
      writeFileSync(join(root, "Cargo.toml"), '[workspace]\nmembers = ["a", "b"]\n');
      for (const [rel, text] of c.files) {
        const abs = join(root, rel);
        mkdirSync(dirname(abs), { recursive: true });
        writeFileSync(abs, text);
      }
      let got = {};
      let threw = null;
      try {
        for (const h of audit(root).hits) got[h.rule] = (got[h.rule] ?? 0) + 1;
      } catch (err) {
        threw = err;
      }
      const ok = c.wantThrow
        ? threw !== null && c.wantThrow.test(threw.message)
        : threw === null && JSON.stringify(got) === JSON.stringify(c.want);
      if (ok) {
        console.log(`[inline-tests] self-test ok    — ${c.name}`);
      } else {
        failed += 1;
        console.error(
          `[inline-tests] self-test FAIL  — ${c.name}\n` +
            `    want ${c.wantThrow ? `a throw matching ${c.wantThrow}` : JSON.stringify(c.want)}\n` +
            `    got  ${threw ? `throw ${threw.message}` : JSON.stringify(got)}`,
        );
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }

  if (failed > 0) {
    console.error(
      `\n[inline-tests] SELF-TEST FAILED — ${failed} of ${cases.length} case(s). ` +
        `The instrument is broken; do not trust a green from it.`,
    );
    process.exit(1);
  }
  console.log(
    `[inline-tests] self-test PASS — ${cases.length}/${cases.length} cases.\n`,
  );
}

// ---------------------------------------------------------------- main

// THE FALL-THROUGH IS LOAD-BEARING. `--self-test` proves the instrument, it does not replace the
// audit: control MUST reach `audit()` below and the process MUST exit on ITS verdict. Two scripts
// in this estate have shipped an `exit(0)` at the end of their self-test and greened CI while
// auditing nothing. Do not add one here.
if (process.argv.includes("--self-test")) selfTest();

let r;
try {
  r = audit(REPO_ROOT);
} catch (err) {
  console.error(`[inline-tests] FAIL — the instrument cannot run: ${err.message}`);
  process.exit(1);
}

console.log(
  `[inline-tests] scope ${r.scopes.join(" + ")} — ${r.files} .rs file(s) across ` +
    `${r.members.length} workspace member(s)`,
);

if (r.hits.length > 0) {
  console.error(`\n[inline-tests] FAIL — ${r.hits.length} inline test attribute(s):`);
  for (const h of r.hits)
    console.error(`  ${h.rule.padEnd(15)} ${h.path}:${h.line}: ${h.text}`);
  console.error(
    `\nMove the module to <member>/tests/ (Cargo links it as its own binary). A private, ` +
      `dependency-free module is reachable from there with ` +
      `\`#[path = "../src/…"] mod …;\` — see csp-solver/tests/kuhn_munkres.rs. There is no waiver list.`,
  );
  process.exit(1);
}

console.log(`[inline-tests] PASS — no test attribute under any member's src/.`);
process.exit(0);
