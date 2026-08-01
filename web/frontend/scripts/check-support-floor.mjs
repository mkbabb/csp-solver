#!/usr/bin/env node
/**
 * check-support-floor — T5-W1 row 1.11 (audit C5 + J3 residue).
 *
 * The estate shipped for a year with NO declared support floor. The consequence
 * was not academic: two `mq.addEventListener?.("change", …)` guards sat in
 * production source under the comment "Safari <14 lacks addEventListener on
 * MQL", and there was no artifact on the tree they could be measured against —
 * r2 could only call them PLAUSIBLY dead ("no declared floor exists to be
 * below"). A guard nobody can adjudicate is permanent: it survives every review
 * because every reviewer has to re-litigate the policy first.
 *
 * So this gate makes the floor a fact and then holds five things to it.
 *
 *   1 FLOOR DECLARED   `browserslist` in web/frontend/package.json — one array,
 *                      one entry per engine, each `<engine> >= <version>`.
 *   2 FLOOR SUFFICIENT the declaration is re-derived, not trusted: the CSS the
 *                      build emits is compiled by Tailwind v4's bundled Lightning
 *                      CSS against targets HARD-CODED in `@tailwindcss/node`.
 *                      Those targets are the binding constraint on every byte of
 *                      shipped CSS, so the declaration must meet or exceed them.
 *   3 TARGET COHERENT  vite `build.target`'s ES year must be parseable by the
 *                      declared floor — the compiled JS floor may sit BELOW the
 *                      policy floor (headroom is fine), never above it.
 *   4 SHIMS DEAD       zero optional-call event guards (`addEventListener?.(`)
 *                      and zero `Engine <N` sub-floor comments naming a version
 *                      at or under the declared floor, anywhere in `src/`.
 *   5 README CITES     the root README states the same versions the declaration
 *                      carries — the floor is a published promise or it is not
 *                      one.
 *
 * WHY `browserslist` WHEN NOTHING READS IT. Measured, not assumed: two `vite
 * build` runs into separate outDirs, identical source, differing only by the
 * presence of the key, produce 44 byte-identical files (manifest sha256
 * b17917ad46240b21f3787144faa107f68c180353c3108dd5663495cd9fcf7db0 both times —
 * evidence/w1/support-floor-GREEN.txt §2). Vite reads `build.target`; Tailwind v4
 * compiles CSS against Lightning targets hard-coded in `@tailwindcss/node`.
 * Neither consults browserslist. So the key is the POLICY surface — the one place
 * a human states the promise — and checks 2 and 3 are what make it load-bearing:
 * they bind the declaration to both floors the toolchain does consume, in the only
 * direction that is safe (the compiled floors may sit under the promise, never
 * over it). A declaration no gate reads would be decoration; this one reds.
 *
 * NOTHING IS PINNED. Check 2 reads the live Lightning CSS target literal off the
 * installed toolchain, so a Tailwind bump that raises the CSS baseline reds the
 * declaration instead of silently outrunning it. Check 5 compares the README to
 * the declaration, not to a literal in this file. The only constants here are
 * the ES-year → engine table in `ES_YEAR_FLOORS` (a language-spec fact, cited
 * inline) and the engine roster.
 *
 * `--self-test` re-runs all five checks against deliberately-broken inputs and
 * fails if any of them stays green. The gate proves it can bite on every run.
 *
 * Exit 0 = all five green. Exit 1 = one line per violation.
 *
 * Zero dependencies, ESM, node-only. Runs identically on ubuntu and darwin.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
// Explicit import, matching check-golden-bytes / check-ink-pressure: eslint runs this
// file with browser globals, so the implicit `process` is a no-undef error here.
import process from "node:process";
import { fileURLToPath } from "node:url";

const FE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = resolve(FE, "..", "..");

/* ── version algebra ─────────────────────────────────────────────────────── */

/** `16.4` / `111` → comparable tuple. */
const parseVersion = (s) => {
  const parts = String(s).trim().split(".").map(Number);
  if (parts.some((n) => !Number.isFinite(n))) return null;
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0];
};
const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
const show = (v) => (v[2] ? v.join(".") : v[1] ? `${v[0]}.${v[1]}` : `${v[0]}`);

/** Lightning CSS packs a version as `major << 16 | minor << 8 | patch`. */
const decodeLightning = (n) => [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];

/* ── the one hard-coded table, and its provenance ────────────────────────── */

/**
 * The first engine version that parses each ES output year esbuild can emit.
 * These are language-spec facts (the year's syntax set), not tree facts, so they
 * are written here rather than derived. Sourced from MDN's per-feature Browser
 * Compatibility tables, taken at the LAST syntax feature each year shipped:
 *   es2020  optional chaining / nullish coalescing / BigInt  — Chrome 80, Firefox 74, Safari 13.1
 *   es2021  logical assignment / numeric separators          — Chrome 85, Firefox 79, Safari 14.1
 *   es2022  class fields / static blocks / top-level await   — Chrome 94, Firefox 93, Safari 16.4
 *   es2023  (no new syntax; library only)                    — inherits es2022
 * `esnext` is deliberately absent: it has no floor, so it can never be shown
 * coherent with one, and check 3 says so out loud.
 */
const ES_YEAR_FLOORS = {
  es2020: { chrome: "80", firefox: "74", safari: "13.1", ios_saf: "13.4", edge: "80" },
  es2021: { chrome: "85", firefox: "79", safari: "14.1", ios_saf: "14.5", edge: "85" },
  es2022: { chrome: "94", firefox: "93", safari: "16.4", ios_saf: "16.4", edge: "94" },
  es2023: { chrome: "94", firefox: "93", safari: "16.4", ios_saf: "16.4", edge: "94" },
};

/** Every engine the declaration must name. `edge` is Chromium: it rides chrome. */
const ENGINES = ["chrome", "edge", "firefox", "safari", "ios_saf"];

/* ── input collection (all five checks read these, and only these) ───────── */

const readIf = (p) => (existsSync(p) ? readFileSync(p, "utf8") : null);

/** Every `.ts`/`.vue`/`.js` under `web/frontend/src`, as {path, text}. */
function collectSrc(root) {
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir).sort()) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(ts|vue|js|mts|cts)$/.test(name))
        out.push({ path: relative(REPO, p), text: readFileSync(p, "utf8") });
    }
  };
  if (existsSync(root)) walk(root);
  return out;
}

function collectInputs() {
  return {
    pkg: readIf(join(FE, "package.json")),
    tailwind: readIf(join(FE, "node_modules/@tailwindcss/node/dist/index.js")),
    vite: readIf(join(FE, "vite.config.ts")),
    src: collectSrc(join(FE, "src")),
    readme: readIf(join(REPO, "README.md")),
  };
}

/* ── the checks ──────────────────────────────────────────────────────────── */

/**
 * Parse the `browserslist` declaration into {engine: version-tuple}.
 * Returns {floor, errors} — `floor` is null when the declaration is unusable.
 */
function parseDeclaration(pkgText) {
  const errors = [];
  if (pkgText === null) return { floor: null, errors: ["package.json is unreadable"] };

  let pkg;
  try {
    pkg = JSON.parse(pkgText);
  } catch (e) {
    return { floor: null, errors: [`package.json does not parse: ${e.message}`] };
  }

  const list = pkg.browserslist;
  if (list === undefined)
    return {
      floor: null,
      errors: [
        "NO SUPPORT FLOOR DECLARED — web/frontend/package.json has no `browserslist` key. " +
          "Nothing in the tree states which engines this product runs on, so no guard, " +
          "polyfill or shim in it can be adjudicated (audit C5; r2 verify-masked-and-drift §3.3).",
      ],
    };
  if (!Array.isArray(list) || list.length === 0)
    return { floor: null, errors: ["`browserslist` must be a non-empty array"] };

  const floor = {};
  for (const entry of list) {
    const m = /^([a-z_]+)\s*>=\s*([\d.]+)$/.exec(String(entry).trim());
    if (!m) {
      errors.push(
        `\`browserslist\` entry ${JSON.stringify(entry)} is not a floor — every entry must ` +
          "read `<engine> >= <version>` so the floor is a single readable number per engine",
      );
      continue;
    }
    const v = parseVersion(m[2]);
    if (!v) {
      errors.push(
        `\`browserslist\` entry ${JSON.stringify(entry)} carries an unparseable version`,
      );
      continue;
    }
    floor[m[1]] = v;
  }
  for (const e of ENGINES)
    if (!floor[e]) errors.push(`\`browserslist\` names no floor for \`${e}\``);

  return { floor: errors.length ? null : floor, errors };
}

/** CHECK 2 — the declaration vs the CSS the build actually compiles. */
function checkSufficient(floor, tailwindText) {
  const out = [];
  if (tailwindText === null)
    return [
      "@tailwindcss/node is not installed — check 2 cannot re-derive the compiled CSS " +
        "targets. Run `npm ci` in web/frontend; this gate does not pass on a missing input.",
    ];

  const m = /targets:\{([^}]*)\}/.exec(tailwindText);
  if (!m)
    return [
      "@tailwindcss/node no longer carries a `targets:{…}` literal — the CSS baseline moved " +
        "somewhere this gate cannot read. Re-derive it and update check 2 (do NOT pin a number).",
    ];

  const compiled = {};
  for (const [, engine, expr] of m[1].matchAll(/([a-z_]+):([0-9<|]+)/g)) {
    // `16<<16|1024` — evaluate the shift expression without eval: the regex above
    // admits only digits, `<<` and `|`, so a two-token fold is the whole grammar.
    const packed = expr
      .split("|")
      .map((term) =>
        term
          .split("<<")
          .map(Number)
          .reduce((a, b) => a << b),
      )
      .reduce((a, b) => a | b, 0);
    compiled[engine] = decodeLightning(packed);
  }
  if (Object.keys(compiled).length === 0)
    return ["@tailwindcss/node's `targets:{…}` literal decoded to nothing"];

  // edge is Chromium; the CSS targets do not name it, so it inherits chrome's.
  if (compiled.chrome) compiled.edge ??= compiled.chrome;

  for (const [engine, need] of Object.entries(compiled)) {
    const have = floor[engine];
    if (!have) {
      out.push(
        `declared floor names no \`${engine}\`, but the CSS compiles against ${engine} ` +
          `${show(need)} — the shipped stylesheet is not down-levelled below it`,
      );
      continue;
    }
    if (cmp(have, need) < 0)
      out.push(
        `declared floor \`${engine} >= ${show(have)}\` sits BELOW the CSS the build emits ` +
          `(Lightning CSS target ${engine} ${show(need)}, hard-coded in @tailwindcss/node). ` +
          "A client at the declared floor would be served syntax it cannot parse.",
      );
  }
  return out;
}

/** CHECK 3 — the compiled JS target must be reachable at the declared floor. */
function checkTargetCoherent(floor, viteText) {
  if (viteText === null) return ["vite.config.ts is unreadable"];

  const m = /\btarget:\s*'([^']+)'/.exec(viteText);
  if (!m)
    return [
      "vite.config.ts declares no `build.target` — the compiled JS floor is implicit",
    ];

  const target = m[1];
  if (!(target in ES_YEAR_FLOORS))
    return [
      `vite \`build.target: '${target}'\` has no stated engine floor in this gate's ES-year ` +
        "table, so it cannot be shown coherent with the declaration. Use a dated es-year " +
        "(esnext is by construction unfloorable).",
    ];

  const out = [];
  for (const [engine, v] of Object.entries(ES_YEAR_FLOORS[target])) {
    const need = parseVersion(v);
    const have = floor[engine];
    if (have && cmp(have, need) < 0)
      out.push(
        `vite \`build.target: '${target}'\` emits syntax first parsed by ${engine} ${show(need)}, ` +
          `above the declared floor \`${engine} >= ${show(have)}\` — the bundle would not parse ` +
          "at the floor the product promises.",
      );
  }
  return out;
}

/** CHECK 4 — no guard in src defends a browser at or below the declared floor. */
function checkShimsDead(floor, srcFiles) {
  const out = [];

  // 4a — an optional CALL on an event method is always a sub-floor guard: every
  // engine at any declarable floor has EventTarget.addEventListener.
  for (const { path, text } of srcFiles)
    text.split("\n").forEach((line, i) => {
      const m = /\b(add|remove)EventListener\?\.\(/.exec(line);
      if (m)
        out.push(
          `${path}:${i + 1} — \`${m[1]}EventListener?.(\` guards an engine without ` +
            "EventTarget listeners. No engine at or above the declared floor is such an " +
            "engine; the branch is unreachable and untestable. Drop the `?.`.",
        );
    });

  // 4b — a comment naming `Engine <N` where N is at or under the floor is a
  // gravestone for a browser the product no longer claims.
  const alias = {
    safari: "safari",
    ios: "ios_saf",
    chrome: "chrome",
    firefox: "firefox",
    edge: "edge",
  };
  for (const { path, text } of srcFiles)
    text.split("\n").forEach((line, i) => {
      for (const m of line.matchAll(
        /\b(Safari|iOS|Chrome|Firefox|Edge)\s*<\s*([\d.]+)/g,
      )) {
        const engine = alias[m[1].toLowerCase()];
        const cited = parseVersion(m[2]);
        const have = floor[engine];
        if (!cited || !have) continue;
        if (cmp(cited, have) <= 0)
          out.push(
            `${path}:${i + 1} — "${m[1]} <${m[2]}" names a browser at or below the declared ` +
              `floor \`${engine} >= ${show(have)}\`. The floor already excludes it; the ` +
              "prose and whatever it justifies both go.",
          );
      }
    });

  return out;
}

/** CHECK 5 — the README states the declaration, version for version. */
function checkReadmeCites(floor, readmeText) {
  if (readmeText === null) return ["README.md is unreadable"];

  const missing = ENGINES.filter((engine) => {
    const v = show(floor[engine]);
    // The README writes engines in prose ("Safari 16.4", "iOS Safari 16.4"),
    // so match the version against a nearby engine word rather than the key.
    const word = {
      chrome: "Chrome",
      edge: "Edge",
      firefox: "Firefox",
      safari: "Safari",
      ios_saf: "iOS",
    }[engine];
    return !new RegExp(`${word}[^.\\n]{0,24}?\\b${v.replace(".", "\\.")}\\b`).test(
      readmeText,
    );
  });

  return missing.length
    ? [
        "README.md does not cite the declared floor for: " +
          missing.map((e) => `${e} ${show(floor[e])}`).join(", ") +
          ". The floor is a published promise — package.json states it to the toolchain, " +
          "the README states it to the reader, and the two must be the same numbers.",
      ]
    : [];
}

/* ── driver ──────────────────────────────────────────────────────────────── */

/** All five checks over one input set → {check: [violations]}. */
function run(inputs) {
  const { floor, errors } = parseDeclaration(inputs.pkg);
  if (!floor)
    return {
      "1 FLOOR DECLARED": errors,
      "2 FLOOR SUFFICIENT": ["skipped — no usable declaration to measure"],
      "3 TARGET COHERENT": ["skipped — no usable declaration to measure"],
      "4 SHIMS DEAD": checkShimsDead({}, inputs.src).concat(
        // With no floor, 4b cannot adjudicate, but 4a is floor-independent.
        ["4b skipped — no declared floor to measure sub-floor prose against"],
      ),
      "5 README CITES": ["skipped — no usable declaration to measure"],
      _floor: null,
    };

  return {
    "1 FLOOR DECLARED": errors,
    "2 FLOOR SUFFICIENT": checkSufficient(floor, inputs.tailwind),
    "3 TARGET COHERENT": checkTargetCoherent(floor, inputs.vite),
    "4 SHIMS DEAD": checkShimsDead(floor, inputs.src),
    "5 README CITES": checkReadmeCites(floor, inputs.readme),
    _floor: floor,
  };
}

/** Mutate one input into a known-bad state; each mutant must red its check. */
function selfTest(inputs) {
  const withPkg = (mut) => ({
    ...inputs,
    pkg: JSON.stringify(mut(JSON.parse(inputs.pkg)), null, 2),
  });
  const mutants = [
    [
      "1 FLOOR DECLARED",
      "browserslist deleted",
      withPkg((p) => ({ ...p, browserslist: undefined })),
    ],
    [
      "1 FLOOR DECLARED",
      "an entry that is not a floor",
      withPkg((p) => ({ ...p, browserslist: ["last 2 versions"] })),
    ],
    [
      "2 FLOOR SUFFICIENT",
      "safari floor dropped under the CSS target",
      withPkg((p) => ({
        ...p,
        browserslist: p.browserslist.map((e) =>
          e.startsWith("safari") ? "safari >= 14" : e,
        ),
      })),
    ],
    [
      "3 TARGET COHERENT",
      "build.target raised above the floor",
      {
        ...inputs,
        vite: String(inputs.vite).replace(/\btarget:\s*'es\d+'/, "target: 'es2022'"),
        pkg: JSON.stringify(
          {
            ...JSON.parse(inputs.pkg),
            browserslist: [
              "chrome >= 111",
              "edge >= 111",
              "firefox >= 92",
              "safari >= 16.4",
              "ios_saf >= 16.4",
            ],
          },
          null,
          2,
        ),
      },
    ],
    [
      "4 SHIMS DEAD",
      "an optional-call listener guard re-enters src",
      {
        ...inputs,
        src: [
          ...inputs.src,
          { path: "MUTANT.ts", text: 'mq.addEventListener?.("change", f);\n' },
        ],
      },
    ],
    [
      "4 SHIMS DEAD",
      "a sub-floor comment re-enters src",
      {
        ...inputs,
        src: [...inputs.src, { path: "MUTANT.ts", text: "// Safari <14 lacks it\n" }],
      },
    ],
    [
      "5 README CITES",
      "the README floor sentence removed",
      { ...inputs, readme: "# csp-solver\n\nNo floor here.\n" },
    ],
  ];

  let failures = 0;
  for (const [check, what, mutant] of mutants) {
    const res = run(mutant);
    const bit = (res[check] ?? []).length > 0;
    console.log(`  ${bit ? "BITES" : "BLIND"}  ${check} — ${what}`);
    if (!bit) failures++;
  }
  return failures;
}

const args = process.argv.slice(2);
const inputs = collectInputs();
const result = run(inputs);

console.log("check-support-floor — T5-W1 row 1.11 (C5 + J3)\n");
console.log(`  src files scanned: ${inputs.src.length}`);
console.log(
  `  declared floor:    ${result._floor ? ENGINES.map((e) => `${e} ${show(result._floor[e])}`).join(" · ") : "NONE"}\n`,
);

let violations = 0;
for (const [check, rows] of Object.entries(result)) {
  if (check.startsWith("_")) continue;
  if (rows.length === 0) {
    console.log(`GREEN  ${check}`);
    continue;
  }
  violations += rows.length;
  console.log(`RED    ${check}`);
  for (const r of rows) console.log(`         ${r}`);
}

let selfTestFailures = 0;
if (args.includes("--self-test")) {
  console.log("\nself-test — every check against a known-bad input:");
  if (!result._floor) {
    console.log(
      "  SKIPPED — the self-test mutates a valid declaration, and there is none to mutate.",
    );
    console.log(
      "  (This is the born-RED state: the gate's own canary cannot run until the floor exists.)",
    );
  } else {
    selfTestFailures = selfTest(inputs);
  }
}

console.log(
  `\n${violations === 0 && selfTestFailures === 0 ? "PASS" : "FAIL"} — ${violations} violation(s)` +
    (args.includes("--self-test") ? `, ${selfTestFailures} blind check(s)` : ""),
);
process.exit(violations === 0 && selfTestFailures === 0 ? 0 : 1);
