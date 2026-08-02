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
// (the RAF probe module), schedulerDebugInfo (pencil-boil's scheduler introspect,
// re-exposed only by the dev probe). Run: `node scripts/check-prod-shake.mjs [dir]`
// — dir defaults to the first existing production build dir. CI runs it right
// after a bundled build so a dist actually exists (compute-cost DAG: reuse the
// throttle gate's `dist-throttle`, no redundant build).

import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const FRONTEND_ROOT = fileURLToPath(new URL("..", import.meta.url));
const FORBIDDEN = ["FilterTuner", "rafInstrumentation", "schedulerDebugInfo"];
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
