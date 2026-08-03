#!/usr/bin/env node
// T4-W4 — the prod-shake proof (FAM-5).
//
// FilterTuner.vue / rafInstrumentation.ts (src/pencil/dev/) are NOT dead — they
// are `import.meta.env.DEV`-gated (App.vue, main.ts) and tree-shaken out of the
// production bundle. This wave PROVES that, it does not excise the tooling: the
// dev probes stay in source, and this standing check asserts the three dev-only
// identifiers never leak into a shipped bundle. If any appears, the DEV gate
// broke (a dev import escaped the `import.meta.env.DEV` fence) and the dev tuner
// would ride to production — fail loud here, do NOT relax the check.
//
// Symbols proven-absent: FilterTuner (the tuner component), rafInstrumentation
// (the RAF probe module), __schedulerDebug (the global the dev probe writes).
//
// T7-W6 — THE THIRD SYMBOL WAS VACUOUS. It read `schedulerDebugInfo` until this wave:
// pencil-boil's export name, which the probe imports as a LOCAL BINDING
// (rafInstrumentation.ts:26) and esbuild renames to one letter on the way through. So
// the literal could never appear in a bundle, leaked or not, and a third of this check
// was asserting the absence of a string the minifier had already deleted. Measured with
// the DEV fence deliberately broken (a two-line entry doing exactly what the probe does,
// `npx esbuild --bundle --minify`): `schedulerDebugInfo` 0 occurrences,
// `__schedulerDebug` 1 — `window.__schedulerDebug=d`. A property written on `window`
// survives minification because renaming it would break the read; that is why the global,
// not the import, is the symbol worth policing. Banked:
// docs/tranches/2026-08-tranche-7/evidence/w6/prod-shake-symbol-swap.txt.
//
// THE CAVEAT this check cannot outrun: substring-policing a minified bundle only reaches
// identifiers minification has a reason to KEEP — property names, string literals, and
// the chunk FILE NAMES vite derives from a dynamically-imported module (they land in the
// parent chunk as import specifiers). `FilterTuner` and `rafInstrumentation` are caught
// on that last path. Neither would survive as a plain local binding, so this gate proves
// "the dev chunk is not referenced", not "no dev code is present" — the ink-level claim
// belongs to the filter census, not here.
//
// Run: `node scripts/check-prod-shake.mjs [dir]`
// — dir defaults to the first existing production build dir. CI runs it right
// after a bundled build so a dist actually exists (compute-cost DAG: reuse the
// throttle gate's `dist-throttle`, no redundant build).

import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const FRONTEND_ROOT = fileURLToPath(new URL("..", import.meta.url));
// `__schedulerDebug`, NOT `schedulerDebugInfo` — see the swap note in the header. The
// rule for adding a fourth: it must be a symbol the minifier is obliged to preserve.
//
// The fourth (T7-W4): `wire=local`, the same-device transport's opt-in. It is a STRING
// LITERAL, which is the one category minification is obliged to keep whole, and it is written
// as one `key=value` token in `useSession.ts` for exactly that reason — a `get("wire") ===
// "local"` pair is two literals the minifier never joins, so policing the joined form would
// have been vacuous by construction. Gated on `import.meta.env.DEV` in the same wave: read
// unconditionally the param survived every strip path and rode copied invite links, and the
// built page's `BroadcastChannel` answered with a room that never left the recipient's device.
const FORBIDDEN = [
  "FilterTuner",
  "rafInstrumentation",
  "__schedulerDebug",
  "wire=local",
];
// The bundled build dir: an explicit CLI arg wins; else the first that exists.
const CANDIDATE_DIRS = ["dist-throttle", "dist"];

function exists(p) {
  try {
    statSync(p);
    return true;
  } catch {
    return false;
  }
}

const argDir = process.argv[2];
const buildDir = argDir
  ? join(FRONTEND_ROOT, argDir)
  : CANDIDATE_DIRS.map((d) => join(FRONTEND_ROOT, d)).find(exists);

if (!buildDir || !exists(buildDir)) {
  // No bundle to police is NOT a pass — the check can't prove shaking against
  // nothing. Fail loud so a missing build never reads as a green prod-shake.
  console.error(
    `[prod-shake] FAIL — no production build dir found ` +
      `(looked for ${argDir ?? CANDIDATE_DIRS.join(", ")} under ${relative(
        process.cwd(),
        FRONTEND_ROOT,
      )}).\n  Build first (e.g. \`npx vite build\`) then re-run.`,
  );
  process.exit(1);
}

/** Recursively collect every *.js under a dir (chunks may be nested). */
function collectJs(dir) {
  let out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(collectJs(p));
    else if (e.isFile() && e.name.endsWith(".js")) out.push(p);
  }
  return out;
}

const jsFiles = collectJs(buildDir);

if (jsFiles.length === 0) {
  console.error(
    `[prod-shake] FAIL — no *.js under ${relative(FRONTEND_ROOT, buildDir)}; ` +
      `the build produced no JS to check.`,
  );
  process.exit(1);
}

const leaks = [];
for (const f of jsFiles) {
  const src = readFileSync(f, "utf8");
  const rel = relative(FRONTEND_ROOT, f);
  for (const sym of FORBIDDEN) {
    if (src.includes(sym)) leaks.push({ rel, sym });
  }
}

console.log(
  `[prod-shake] ${jsFiles.length} bundle chunk(s) under ` +
    `${relative(FRONTEND_ROOT, buildDir)}; asserting ${FORBIDDEN.length} dev-only ` +
    `symbol(s) absent: ${FORBIDDEN.join(", ")}`,
);

if (leaks.length > 0) {
  console.error(
    `\n[prod-shake] FAIL — ${leaks.length} dev-only symbol(s) leaked into the prod bundle:`,
  );
  for (const l of leaks) console.error(`  ${l.sym}  in  ${l.rel}`);
  console.error(
    `\nA dev import escaped its \`import.meta.env.DEV\` fence — trace it and re-fence; ` +
      `do NOT relax this check.`,
  );
  process.exit(1);
}

console.log(`[prod-shake] PASS — the dev tuner is fully tree-shaken from production.`);
process.exit(0);
