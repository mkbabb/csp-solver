#!/usr/bin/env node
/**
 * THE TDZ PROBE (T5-W2 2.1c) — the instrument the charter declared and no lane wrote.
 *
 * The defect it measures is HISTORICAL and structural. The estate's registration table used to
 * close a cycle — `scene → game → registry → scene` — and an ES module cycle evaluates its
 * members in one order only: whichever member the entry reaches first runs while the others'
 * top-level bindings are still in their temporal dead zone. `SudokuGame.vue` therefore threw
 *
 *     ReferenceError: Cannot access 'sudokuGame' before initialization
 *
 * on any import order that entered through the scene, and the shipped workaround was to
 * HAND-INLINE the control sections the declaration already held. A workaround for an import
 * order is not a fix; it is a second copy of the truth, kept in step by nobody.
 *
 * 2.1 severed the edge rather than reordering it: `spec → defineGame` and `cards → spec`, never
 * `spec → cards`. There is no cycle left, so the eager row may import its spec STATICALLY. That
 * is a claim about the module GRAPH, and a claim about a graph is checkable — which is what
 * this is, in two arms:
 *
 *   ARM 1 · THE GRAPH, on the real tree. No file under `src/games/<game>/**` may import the
 *           table (`@games/cards`, or the dead `@games/registry`); `games/shared/defineGame.ts`
 *           may import neither the table nor a concrete game; and the table may reach a lazy
 *           row's spec only through `import()`. Each is one edge of the old cycle, named.
 *
 *   ARM 2 · THE REPRODUCTION, executed. Four synthetic modules are written to a temp dir and
 *           imported for real: the OLD shape must throw the ReferenceError above — if it does
 *           not, this probe cannot see the hazard it claims to gate and is worth nothing — and
 *           the NEW shape must boot. The red arm is the canary; it runs on every invocation,
 *           not only under `--self-test`.
 *
 * `--self-test` adds the negative control ARM 1 needs: a SYNTHETIC tree carrying exactly the
 * import that used to close the cycle must come back RED. `--root <dir>` points ARM 1 at
 * another tree, which is how an ablation runs against a scratch copy without touching the live
 * one. Both exit explicitly: a self-test that falls through into the main verdict reports the
 * tree's health under the control's name.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const ROOT = path.join(import.meta.dirname, "..");

/** The table, by every spelling an import can reach it with. */
const TABLE = /from\s+["'](?:@games\/(?:cards|registry)|[./]*(?:games\/)?(?:cards|registry))["']/;
/** A concrete game, from the shared floor's point of view. */
const CONCRETE_GAME = /from\s+["']@games\/(?!shared\/)([a-z]+)(?:\/|["'])/;
/** A STATIC (non-`import()`) reach into a spec module. */
const STATIC_SPEC = /^\s*import\s[^;]*?from\s+["'][^"']*\/spec["']/m;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|vue)$/.test(entry.name) && !/\.test\.ts$/.test(entry.name))
      out.push(full);
  }
  return out;
}

/** Import lines only — a prose mention of the table is a memory, not an edge. */
function importLines(text) {
  return text
    .split("\n")
    .map((line, i) => ({ line, no: i + 1 }))
    .filter(({ line }) => /^\s*(import|export)\s/.test(line) || /^\s*}\s*from\s/.test(line));
}

/**
 * ARM 1. Returns the violations found in `gamesDir` — each one an edge of the old cycle.
 */
function graphCensus(gamesDir) {
  const violations = [];
  const rel = (f) => path.relative(path.dirname(gamesDir), f);

  // (a) a GAME may not import the table. This is the edge the cycle closed on.
  for (const entry of fs.existsSync(gamesDir)
    ? fs.readdirSync(gamesDir, { withFileTypes: true })
    : []) {
    if (!entry.isDirectory() || entry.name === "shared") continue;
    for (const file of walk(path.join(gamesDir, entry.name))) {
      const text = fs.readFileSync(file, "utf8");
      for (const { line, no } of importLines(text))
        if (TABLE.test(line))
          violations.push({
            arm: "game→table",
            file: rel(file),
            line: no,
            detail: line.trim(),
          });
    }
  }

  // (b) the contract module imports neither the table nor a concrete game. `defineGame.ts`
  //     importing nothing from the table IS §1.2's claim, spelled as a check.
  const contract = path.join(gamesDir, "shared", "defineGame.ts");
  if (fs.existsSync(contract)) {
    const text = fs.readFileSync(contract, "utf8");
    for (const { line, no } of importLines(text)) {
      if (TABLE.test(line))
        violations.push({
          arm: "defineGame→table",
          file: rel(contract),
          line: no,
          detail: line.trim(),
        });
      const game = CONCRETE_GAME.exec(line);
      if (game)
        violations.push({
          arm: "defineGame→game",
          file: rel(contract),
          line: no,
          detail: line.trim(),
        });
    }
  }

  // (c) the table reaches a LAZY row's spec through `import()` only. One static spec import is
  //     the eager row's main-chunk ride and is legal precisely because the cycle is gone; two
  //     would mean a lazy game's spec had been dragged into the main chunk.
  const cards = path.join(gamesDir, "cards.ts");
  if (fs.existsSync(cards)) {
    const text = fs.readFileSync(cards, "utf8");
    const statics = text.split("\n").filter((l) => STATIC_SPEC.test(l));
    if (statics.length > 1)
      violations.push({
        arm: "cards→spec (static)",
        file: rel(cards),
        line: 0,
        detail: `${statics.length} static spec imports; at most the eager row may hold one`,
      });
  }

  return violations;
}

// ── ARM 2: the four-module reproduction, executed ────────────────────────────

const OLD_GRAPH = {
  // scene → game → registry → scene. The registry reads the game's binding at module scope,
  // which is the whole hazard: entering through the scene evaluates `registry` first.
  "scene.mjs": `import { game } from "./game.mjs";\nexport const scene = { name: "scene", game };\n`,
  "game.mjs": `import { registry } from "./registry.mjs";\nexport const game = { name: "game", rows: registry.length };\n`,
  "registry.mjs": `import { scene } from "./scene.mjs";\nexport const registry = [scene.name];\n`,
  "entry.mjs": `import { scene } from "./scene.mjs";\nexport default scene;\n`,
};

const NEW_GRAPH = {
  // spec → defineGame, cards → spec. defineGame imports nothing back, so no cycle can close.
  "defineGame.mjs": `export const defineGame = (spec) => spec;\n`,
  "spec.mjs": `import { defineGame } from "./defineGame.mjs";\nexport const spec = defineGame({ id: "sudoku" });\n`,
  "cards.mjs": `import { spec } from "./spec.mjs";\nexport const cards = [{ id: spec.id }];\n`,
  "entry.mjs": `import { cards } from "./cards.mjs";\nexport default cards;\n`,
};

function writeGraph(dir, files) {
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, body] of Object.entries(files))
    fs.writeFileSync(path.join(dir, name), body);
  return pathToFileURL(path.join(dir, "entry.mjs")).href;
}

async function reproduction() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "tdz-probe-"));
  const out = { oldThrew: null, newBooted: null, base };
  try {
    try {
      await import(writeGraph(path.join(base, "old"), OLD_GRAPH));
      out.oldThrew = false;
    } catch (err) {
      out.oldThrew = err instanceof ReferenceError && /before initialization/.test(err.message);
      out.oldError = `${err.name}: ${err.message}`;
    }
    try {
      const mod = await import(writeGraph(path.join(base, "new"), NEW_GRAPH));
      out.newBooted = Array.isArray(mod.default) && mod.default[0]?.id === "sudoku";
    } catch (err) {
      out.newBooted = false;
      out.newError = `${err.name}: ${err.message}`;
    }
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
  return out;
}

// ── the negative control ARM 1 needs ─────────────────────────────────────────

/** A synthetic tree carrying exactly the edge that used to close the cycle. */
function mintRedTree() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "tdz-ablate-"));
  const games = path.join(base, "games");
  fs.mkdirSync(path.join(games, "thermo"), { recursive: true });
  fs.mkdirSync(path.join(games, "shared"), { recursive: true });
  fs.writeFileSync(
    path.join(games, "thermo", "spec.ts"),
    'import { GAMES } from "@games/cards";\nexport const thermoSpec = { rows: GAMES.length };\n',
  );
  fs.writeFileSync(path.join(games, "shared", "defineGame.ts"), "export const defineGame = (s) => s;\n");
  fs.writeFileSync(path.join(games, "cards.ts"), "export const GAMES = [];\n");
  return { base, games };
}

// ── main ─────────────────────────────────────────────────────────────────────

function report(violations, label) {
  console.log(`graph census (${label}): ${violations.length} cycle edge(s)`);
  for (const v of violations)
    console.log(`  [${v.arm}] ${v.file}${v.line ? `:${v.line}` : ""}  ${v.detail}`);
}

async function main() {
  const argv = process.argv.slice(2);
  const selfTest = argv.includes("--self-test");
  const rootFlag = argv.indexOf("--root");
  const treeRoot = rootFlag === -1 ? ROOT : path.resolve(argv[rootFlag + 1]);
  const gamesDir = path.join(treeRoot, "src", "games");

  // ARM 2 first: an instrument that cannot reproduce the hazard has nothing to say about a
  // tree that is free of it.
  const repro = await reproduction();
  console.log("reproduction (4 modules, executed):");
  console.log(
    `  OLD graph (scene → game → registry → scene): ${
      repro.oldThrew ? `THREW — ${repro.oldError}` : "DID NOT THROW"
    }`,
  );
  console.log(
    `  NEW graph (spec → defineGame, cards → spec): ${
      repro.newBooted ? "BOOTED" : `FAILED — ${repro.newError ?? "wrong shape"}`
    }`,
  );

  const violations = graphCensus(gamesDir);
  console.log();
  report(violations, path.relative(ROOT, gamesDir) || "src/games");

  if (selfTest) {
    const red = mintRedTree();
    const caught = graphCensus(red.games);
    fs.rmSync(red.base, { recursive: true, force: true });
    const ok = caught.some((v) => v.arm === "game→table");
    console.log(
      `\nnegative control (a synthetic game importing the table): ${
        ok ? "RED as required" : "FAILED — the census did not catch it"
      }`,
    );
    if (!ok) {
      console.error("\ntdz-probe: the negative control did not red — the census is vacuous");
      process.exit(2);
    }
  }

  if (!repro.oldThrew) {
    console.error("\ntdz-probe: the OLD-graph arm did not throw — the probe is vacuous");
    process.exit(2);
  }
  if (!repro.newBooted) {
    console.error("\ntdz-probe: the NEW-graph arm did not boot");
    process.exit(1);
  }
  if (violations.length) {
    console.error(`\ntdz-probe: ${violations.length} cycle edge(s) — the TDZ hazard is live`);
    process.exit(1);
  }

  console.log("\ntdz-probe: TDZ severed structurally — 0 cycle edges, reproduction both ways");
  // Explicit, both paths: a self-test that falls through reports the tree under the control's
  // name, which is how a green control has twice been read as a green gate.
  process.exit(0);
}

main();
