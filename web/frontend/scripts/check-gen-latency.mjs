#!/usr/bin/env node
// THE GENERATION-LATENCY GATE (T9-W4 §"Gate spine", registry family F14).
//
// What it prices: the SHIPPED wasm artifact's five generate verbs, at the top of
// each family's own size band, MEDIUM and HARD, called exactly the way the
// production worker calls them — `csp-solver/wasm/pkg` imported directly, the
// same `templates` buffer `useSudoku.ts` builds, the same difficulty ordinals
// `solver.worker.ts` passes through. No browser, no Vite, no rig README: an
// executed lane whose green is a measurement.
//
// WHY THE LANE EXISTS. Thermo 16×16 HARD shipped with no leash anywhere on the
// path — median 19.9 s per deal, max 473 s, every control disabled throughout
// (V2's sharpened reading of F14's P0). Nothing in the estate could say so. A
// timing claim nobody executes is a rig README claim, and this repo has been
// bitten by that class before; so the claim is a gate.
//
// W4 cured that cell twice over while this file was being written — the crate's
// attempt-stop, then thermo's own bank — and the table below is GREEN because of
// it, not because the ceilings were chosen to be. The pre/post readings, taken on
// this instrument against a wasm built from the uncured tree, are in the evidence
// file. What the lane is FOR is the next one: a bank quietly dropped, a tier
// re-declared, a dig that grows a factor nobody measured.
//
// ── the size bands are the production bands, not a slogan ────────────────────
// "16×16" names the BOXED families only. `games/shared/selectors.ts` offers
// sudoku/thermo/killer a sub-grid band of {2,3,4} (4 ⇒ 16×16), futoshiki a
// Latin band of {4..7} and kenken {4..6} — and the wasm contract agrees:
// `generateFutoshiki` throws INVALID_INPUT outside `4..=7`, `generateKenKen`
// outside `3..=9` with the picker stopping at 6. A futoshiki 16×16 cell would
// not be a slow deal, it would be a thrown error. So every family is priced at
// the LARGEST BOARD IT CAN ACTUALLY BE DEALT: 16×16 for the three boxed
// families, 7×7 for futoshiki, 6×6 for kenken.
//
// ── engine parity, stated because the ceilings are absolute ──────────────────
// V2 measured the production bank path on BOTH node and chromium and read them
// in ~3% agreement (0.0–0.5 ms either way), which is what licenses a node-only
// lane to gate a browser product: for this workload the two engines are the same
// instrument. SAFARI IS NOT COVERED AND IS NOT CLAIMED. Real JSC is
// unmeasurable by law in this estate (M19 — no screen seizure, no puppeting of
// the owner's desktop Safari), which is exactly why T8-R05's 684 ms/25 s Safari
// rows cannot be re-derived here and are restated as Safari rows rather than
// corrected. W8's owner-run device readings are the Safari truth; this gate is
// the node/chromium truth and says nothing beyond it.
//
// ── how a cell is graded ─────────────────────────────────────────────────────
// N=3 deals per cell at the fixed seeds below (the first three integers, chosen
// before anything was measured — a seed set picked after the fact is a
// selection, not a sample). The median is REPORTED because it is the figure the
// record cites. EVERY deal is GRADED, because a ceiling only the median respects
// is not a ceiling. The estate's own P0 is the argument: thermo 16×16 HARD's
// live dig, measured on this instrument before §4.1.3's bank replaced it, read a
// ~1.7 s median beside a third deal of 14.1–17.0 s over six passes — a
// median-only rule would have printed it green. The rule outlives that cell,
// because the dig is one declaration away from returning.
//
// The ceilings are absolute milliseconds, derived below with their date and
// their margin arithmetic shown. They are NOT re-derived at run time — a gate
// that recomputes its own threshold from the tree it is grading cannot fail.
//
// RED-CAPABILITY: `--self-test` re-proves, before every graded run, that the
// comparison bites both colours — five fixture arms, off invented numbers rather
// than off the tree, because a self-test that measures is a self-test whose
// colour depends on how loaded the runner is that morning. `--plant-ceiling=<ms>`
// is the same lever by hand, against real deals.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { spawnSync } from "node:child_process";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND = path.resolve(HERE, "..");
const require = createRequire(path.join(FRONTEND, "package.json"));

/* ── the ceiling table ─────────────────────────────────────────────────────── */

/**
 * DERIVED 2026-08-25, on the T9-W4 tree (crate + wasm 0.7.0; the attempt-stop,
 * the budget-exhaustion law and thermo's 16×16 bank all landed), against `csp-solver/wasm/pkg`
 * `csp_solver_wasm_bg.wasm` at 122,541 B. Host: darwin arm64 (18 cores), node
 * 26. THREE `--derive` passes through this file's own enforcing path, and the
 * figure taken is the SLOWEST median of the three, not the best — the host was
 * carrying a load average of 7.6–9.9 throughout, which is stated because T8-R05
 * is in this wave's docket for pricing a bench box at load 10.75 on 8 cores
 * while its README said no row was suspect. A conservative median under stated
 * load is a defensible derivation; a best-of-three under an unstated one is the
 * defect being restated. Every reading is banked at
 * `docs/tranches/2026-08-tranche-9/evidence/w4/gen-latency.md`.
 *
 * THE MARGIN, both factors named rather than rolled into one round number:
 *
 *   ceiling = clamp( max(FLOOR_MS, median × 3 × 2.5), UI_CAP_MS )
 *
 *   × 3    seed/derivation margin — the spread a different seed set buys. It is
 *          the wave's own suggested figure and it is measured, not assumed:
 *          across cells the max/median ratio at these seeds runs 1.0–1.8, killer
 *          HARD the widest of the greens, so 3 clears observed seed spread with
 *          room.
 *   × 2.5  host margin — this table is derived on darwin arm64 and enforced on
 *          `ubuntu-latest` (4 vCPU). 2.5 is an allowance, a guard rather than a
 *          measurement; under it the tightest green cell still clears its own
 *          worst observed deal by 4.1×, so no green here sits near its edge.
 *   FLOOR  a sub-millisecond median cannot carry a multiplicative margin —
 *          3 × 0.0 is 0. Cells that deal in microseconds get an absolute 50 ms
 *          floor, which still catches a 100× regression on the bank path.
 *   UI_CAP the ceiling above which the margin stops being allowed to grow. A
 *          deal blocks its whole family's controls while it runs; past ~3 s a
 *          disabled DEAL control reads as broken rather than busy. A cell whose
 *          honest margin lands above this does not get the margin — it gets the
 *          cap, and it reds. That is the clamp's entire purpose.
 *
 * RE-DERIVING: run `node scripts/check-gen-latency.mjs --derive`, which prints
 * the table this block would become. Re-deriving is a REVIEWED act (the iai
 * gate's discipline): a real speedup should move these numbers in a commit
 * somebody read, and a regression must never move them at all.
 */
const DERIVED_ON = "2026-08-25";
const FLOOR_MS = 50;
const UI_CAP_MS = 3_000;
const SEED_MARGIN = 3;
const HOST_MARGIN = 2.5;

/** Fixed seeds, N=3. Chosen before measurement; never re-picked to fit. */
const SEEDS = [1, 2, 3];

/**
 * One row per graded cell: the family, the board it is dealt at, the tier, the
 * median measured on the derivation host, and the ceiling that median produced.
 * `note` carries what the number means where the number alone would mislead.
 */
const CELLS = [
  {
    id: "sudoku/16x16/MEDIUM",
    family: "sudoku",
    dim: 4,
    label: "16×16",
    tier: "MEDIUM",
    derivedMedianMs: 0.0,
    ceilingMs: 50,
    note: "bank-backed — production's real path, a pick and a symmetry transform",
  },
  {
    id: "sudoku/16x16/HARD",
    family: "sudoku",
    dim: 4,
    label: "16×16",
    tier: "HARD",
    derivedMedianMs: 0.0,
    ceilingMs: 50,
    note: "bank-backed; T8-R05's 684 ms priced an empty-bank path production never takes",
  },
  {
    id: "thermo/16x16/MEDIUM",
    family: "thermo",
    dim: 4,
    label: "16×16",
    tier: "MEDIUM",
    derivedMedianMs: 0.0,
    ceilingMs: 50,
    note: "bank-backed since §4.1.3; the floor is also this tier's bank-presence alarm",
  },
  {
    id: "thermo/16x16/HARD",
    family: "thermo",
    dim: 4,
    label: "16×16",
    tier: "HARD",
    derivedMedianMs: 0.0,
    ceilingMs: 50,
    // THE P0, CURED — and the cell whose 50 ms floor does the most work in this
    // table. F14 measured this deal at a 19.9 s median and a 473 s max, unleashed.
    // The crate's attempt-stop took it to ~1.7 s / ~15 s on this instrument: real
    // work, and still not shippable, because `class.rs`'s own leash table says why
    // a refusal stop cannot go further — most of the wall time sits inside
    // SUCCESSFUL late removals, each a uniqueness solve on a near-empty 16×16
    // board. §4.1.3's bank is what closed it, and the dig it replaced is measured
    // pre/post in the evidence file.
    //
    // SO THIS FLOOR IS A BANK-PRESENCE ALARM, not decoration. `thermoTierSource`
    // decides live-gen versus bank by DECLARATION, so a tier quietly re-declared
    // `livegen` — or a bank deleted and the table left stale — returns this cell
    // to a ~1.7 s median against a 50 ms ceiling, and the gate reds by 30×. The
    // 16×16 thermo bank is now load-bearing, and this is the line that says so.
    note: "THE P0, cured by the bank; the floor is this tier's bank-presence alarm",
  },
  {
    id: "killer/16x16/MEDIUM",
    family: "killer",
    dim: 4,
    label: "16×16",
    tier: "MEDIUM",
    derivedMedianMs: 147.3,
    ceilingMs: 1_200,
    note: "live dig; the cages carry the uniqueness",
  },
  {
    id: "killer/16x16/HARD",
    family: "killer",
    dim: 4,
    label: "16×16",
    tier: "HARD",
    derivedMedianMs: 274.4,
    ceilingMs: 2_100,
    note: 'live dig — F14\'s ">25 s" arm, refuted on the shipped artifact',
  },
  {
    id: "futoshiki/7x7/MEDIUM",
    family: "futoshiki",
    dim: 7,
    label: "7×7",
    tier: "MEDIUM",
    derivedMedianMs: 1.1,
    ceilingMs: 50,
    note: "top of the Latin band — 16×16 is outside the wasm contract's 4..=7",
  },
  {
    id: "futoshiki/7x7/HARD",
    family: "futoshiki",
    dim: 7,
    label: "7×7",
    tier: "HARD",
    derivedMedianMs: 2.1,
    ceilingMs: 50,
    note: "top of the Latin band",
  },
  {
    id: "kenken/6x6/MEDIUM",
    family: "kenken",
    dim: 6,
    label: "6×6",
    tier: "MEDIUM",
    derivedMedianMs: 2.2,
    ceilingMs: 50,
    note: "top of the caged-Latin band; kenken digs the whole board by design",
  },
  {
    id: "kenken/6x6/HARD",
    family: "kenken",
    dim: 6,
    label: "6×6",
    tier: "HARD",
    derivedMedianMs: 1.7,
    ceilingMs: 50,
    note: "top of the caged-Latin band",
  },
];

/** The arithmetic the table above claims, executable — `--derive` prints it. */
const ceilingFor = (medianMs) =>
  Math.min(
    UI_CAP_MS,
    Math.max(FLOOR_MS, roundUp2(medianMs * SEED_MARGIN * HOST_MARGIN)),
  );

/** Round up to two significant figures, so a ceiling reads as a decision. */
function roundUp2(ms) {
  if (ms <= 0) return 0;
  const mag = 10 ** (Math.floor(Math.log10(ms)) - 1);
  return Math.ceil(ms / mag) * mag;
}

/* ── the measurement ───────────────────────────────────────────────────────── */

/** Difficulty ordinals as `csp_solver_wasm.d.ts` declares them; both enums agree. */
const TIER_ORDINAL = { EASY: 0, MEDIUM: 1, HARD: 2 };

/**
 * THE BANKS, read out of the modules the app actually bundles — never
 * re-derived from the canonical data under `csp-solver/data/`. Re-deriving would
 * mean re-implementing each generator plugin's encoding here and then pricing a
 * buffer production never builds, which is the exact species of error this wave
 * is restating T8-R05 for.
 *
 * TWO FAMILIES CARRY A BANK, and their wire forms differ, so both are named:
 *
 *   sudoku  `src/games/sudoku/data/templates.ts` — fixed-width dense boards,
 *           `(n*n)^2` cells each, concatenated (`useSudoku.ts::sudokuTemplates`).
 *   thermo  `src/games/thermo/data/templates.ts` — `bank_pick` RECORDS of
 *           varying length (board plus its thermometer furniture), and the flat
 *           concatenation IS the encoding (`useThermo.ts::thermoTemplates`).
 *
 * Both honour their module's DECLARED tier table rather than whether the bank
 * happens to hold rows: a tier that says `livegen` sends an empty buffer because
 * it was declared to, never because a directory went missing. That is the
 * discipline sudoku bought after a `git rm` shipped a silent live-gen
 * regression, and reproducing it here is what makes this gate price the same
 * decision production makes.
 */
const BANKS = {
  sudoku: {
    rel: "src/games/sudoku/data/templates.ts",
    bankDecl: "export const TEMPLATE_BANK",
    /** T9-W8 C10 moved the tier table out of the bank chunk (tiers.ts, not render-blocking). */
    tierRel: "src/games/sudoku/data/tiers.ts",
    tierDecl: "const TIER_SOURCE",
    /** Fixed-width boards: every record is exactly `(n*n)^2` cells. */
    flatten: (records, n) => {
      const total = (n * n) ** 2;
      const out = new Uint32Array(records.length * total);
      records.forEach((b, i) => out.set(b, i * total));
      return out;
    },
  },
  thermo: {
    rel: "src/games/thermo/data/templates.ts",
    bankDecl: "export const THERMO_BANK",
    tierDecl: "const TIER_SOURCE",
    /** Variable-length `bank_pick` records: the join is the encoding. */
    flatten: (records) => {
      const out = new Uint32Array(records.reduce((n, r) => n + r.length, 0));
      let at = 0;
      for (const r of records) {
        out.set(r, at);
        at += r.length;
      }
      return out;
    },
  },
};

function loadBanks() {
  const loaded = {};
  for (const [family, spec] of Object.entries(BANKS)) {
    const src = readFileSync(path.join(FRONTEND, spec.rel), "utf8");
    const tierSrc = spec.tierRel
      ? readFileSync(path.join(FRONTEND, spec.tierRel), "utf8")
      : src;
    const pick = (decl, text = src, rel = spec.rel) => {
      const lines = text.split("\n");
      const at = lines.findIndex((l) => l.startsWith(decl));
      if (at < 0)
        throw new Error(`${rel}: no \`${decl}\` — the bank module's shape moved`);
      // One-line JSON (the generated bank) or a multi-line object literal closing at a bare
      // `}` / `};` line (the generated tier table): both are the generator's output, read as data.
      const first = lines[at].slice(lines[at].indexOf("= ") + 2).replace(/;\s*$/, "");
      try {
        return JSON.parse(first);
      } catch {
        /* multi-line: fall through */
      }
      let end = at;
      while (!/^\s*}\s*;?\s*$/.test(lines[end])) {
        end += 1;
        if (end >= lines.length)
          throw new Error(
            `${rel}: \`${decl}\` never closes — the bank module's shape moved`,
          );
      }
      const literal = lines
        .slice(at, end + 1)
        .join("\n")
        .replace(/;\s*$/, "");
      const body = literal.slice(literal.indexOf("= ") + 2);
      const json = body
        .replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":')
        .replace(/,(\s*[}\]])/g, "$1");
      return JSON.parse(json);
    };
    loaded[family] = {
      bank: pick(spec.bankDecl),
      tiers: pick(spec.tierDecl, tierSrc, spec.tierRel ?? spec.rel),
      flatten: spec.flatten,
      rel: spec.rel,
    };
  }
  return loaded;
}

const EMPTY = new Uint32Array(0);

/** The buffer a banked family's composable would build for this (n, tier). */
function templatesFor(banks, family, n, tier) {
  const b = banks[family];
  if (!b) return EMPTY;
  const key = tier.toLowerCase();
  const row = b.tiers[n];
  if (!row) throw new Error(`${b.rel}: no tier declared for size ${n}`);
  if (row[key] === "livegen") return EMPTY;
  return b.flatten(b.bank[n][key], n);
}

/**
 * One deal, timed. The unbanked families take the empty buffer their composables
 * pass (`templates: null` → `new Uint32Array(0)` on the wire), so those cells
 * price the dig, which is the whole point of pricing them.
 */
function dealer(wasm, banks) {
  const t = (family, dim, tier) => templatesFor(banks, family, dim, tier);
  return {
    sudoku: (dim, tier, seed) =>
      wasm.generateSudoku(dim, TIER_ORDINAL[tier], seed, t("sudoku", dim, tier)),
    thermo: (dim, tier, seed) =>
      wasm.generateThermo(dim, TIER_ORDINAL[tier], seed, t("thermo", dim, tier)),
    killer: (dim, tier, seed) =>
      wasm.generateKiller(dim, TIER_ORDINAL[tier], seed, EMPTY),
    futoshiki: (dim, tier, seed) =>
      wasm.generateFutoshiki(dim, TIER_ORDINAL[tier], seed, EMPTY),
    kenken: (dim, tier, seed) =>
      wasm.generateKenKen(dim, TIER_ORDINAL[tier], seed, EMPTY),
  };
}

/** Measure every cell in this process, streaming one NDJSON row per cell. */
function measure(emit) {
  const jsPath = require.resolve("@mkbabb/csp-solver-wasm");
  const binPath = require.resolve("@mkbabb/csp-solver-wasm/csp_solver_wasm_bg.wasm");
  const bytes = readFileSync(binPath);
  emit({ kind: "artifact", path: binPath, bytes: bytes.length });
  return import(jsPath).then((wasm) => {
    const t0 = performance.now();
    wasm.initSync({ module: bytes });
    emit({ kind: "init", ms: performance.now() - t0 });
    const banks = loadBanks();
    const deal = dealer(wasm, banks);
    for (const cell of CELLS) {
      emit({ kind: "cell-start", id: cell.id });
      const runs = [];
      let givens = 0;
      for (const seed of SEEDS) {
        const t = performance.now();
        const puzzle = deal[cell.family](cell.dim, cell.tier, seed);
        runs.push(performance.now() - t);
        const board = puzzle instanceof Uint32Array ? puzzle : puzzle.board;
        givens = board.reduce((a, v) => a + (v !== 0 ? 1 : 0), 0);
        if (typeof puzzle.free === "function") puzzle.free();
      }
      emit({ kind: "cell", id: cell.id, runs, givens });
    }
  });
}

/* ── grading ───────────────────────────────────────────────────────────────── */

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const h = s.length >> 1;
  return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
};
const ms = (n) => (n >= 100 ? n.toFixed(0) : n.toFixed(1)).padStart(9) + " ms";

/**
 * A cell passes when EVERY deal is under its ceiling. Returns the failing rows.
 */
function grade(results, ceilings) {
  const rows = [];
  for (const cell of CELLS) {
    const r = results.get(cell.id);
    const ceiling = ceilings.get(cell.id);
    if (!r) {
      rows.push({
        cell,
        ceiling,
        verdict: "MISSING",
        detail: "no deal completed — the run was walled or the verb threw",
      });
      continue;
    }
    const worst = Math.max(...r.runs);
    rows.push({
      cell,
      ceiling,
      median: median(r.runs),
      min: Math.min(...r.runs),
      max: worst,
      runs: r.runs,
      givens: r.givens,
      verdict: worst <= ceiling ? "PASS" : "FAIL",
    });
  }
  return rows;
}

function report(rows, meta) {
  const w = Math.max(...CELLS.map((c) => c.id.length));
  console.log(
    `generation latency — ${meta.artifactBytes.toLocaleString()} B artifact, ` +
      `node ${process.versions.node} on ${process.platform}/${process.arch}, ` +
      `init ${meta.initMs.toFixed(1)} ms, N=${SEEDS.length} seeds [${SEEDS.join(", ")}]`,
  );
  console.log(
    `ceiling table derived ${DERIVED_ON} (see the header for the arithmetic)\n`,
  );
  for (const row of rows) {
    if (row.verdict === "MISSING") {
      console.log(`FAIL   ${row.cell.id.padEnd(w)}  ${row.detail}`);
      continue;
    }
    console.log(
      `${row.verdict === "PASS" ? "ok  " : "FAIL"}   ${row.cell.id.padEnd(w)}  ` +
        `median ${ms(row.median)}  max ${ms(row.max)}  ceiling ${ms(row.ceiling)}  ` +
        `givens ${String(row.givens).padStart(3)}`,
    );
    console.log(
      `       ${" ".repeat(w)}  deals [${row.runs.map((x) => x.toFixed(1)).join(", ")}] · ${row.cell.note}`,
    );
  }
  const bad = rows.filter((r) => r.verdict !== "PASS");
  console.log("");
  if (!bad.length) {
    console.log(`${rows.length}/${rows.length} cells under ceiling.`);
    return 0;
  }
  for (const row of bad)
    // The dealt size is spelled BOTH ways here, because the estate's own F5 trap
    // lives in this argument: sudoku/thermo/killer take `n`, the SUB-GRID root,
    // so the cell that reds at `dim=4` is a 16×16 board and not a 4×4 one.
    console.log(
      `::error::${row.cell.id} (dim ${row.cell.dim} ⇒ ${row.cell.label} board) — ` +
        `${row.verdict === "MISSING" ? row.detail : `slowest deal ${row.max.toFixed(0)} ms against a ${row.ceiling} ms ceiling`}`,
    );
  console.log(
    `\n${bad.length} of ${rows.length} cells BUST. A deal blocks its family's controls for its ` +
      `whole duration; a ceiling is what the product can spend, not what the tree happens to cost.`,
  );
  return 1;
}

/* ── the run ───────────────────────────────────────────────────────────────── */

/** Collect a measurement pass — in-process, or in a child under a wall. */
async function collect({ wall }) {
  const results = new Map();
  const meta = { initMs: 0, artifactBytes: 0 };
  if (!wall) {
    await measure((row) => absorb(row, results, meta));
    return { results, meta, walled: null };
  }
  const child = spawnSync(
    process.execPath,
    [fileURLToPath(import.meta.url), "--measure"],
    {
      cwd: FRONTEND,
      encoding: "utf8",
      timeout: wall,
      maxBuffer: 64 * 1024 * 1024,
    },
  );
  for (const line of (child.stdout ?? "").split("\n"))
    if (line.trim()) absorb(JSON.parse(line), results, meta);
  if (child.stderr) process.stderr.write(child.stderr);
  const walled =
    child.error?.code === "ETIMEDOUT"
      ? (meta.inFlight ?? "an unnamed cell")
      : child.status !== 0 && child.status !== null
        ? `the measuring child exited ${child.status}`
        : null;
  return { results, meta, walled };
}

function absorb(row, results, meta) {
  if (row.kind === "init") meta.initMs = row.ms;
  else if (row.kind === "artifact") meta.artifactBytes = row.bytes;
  else if (row.kind === "cell-start") meta.inFlight = row.id;
  else if (row.kind === "cell")
    results.set(row.id, { runs: row.runs, givens: row.givens });
}

/**
 * THE WALL. The wasm verbs are synchronous, so a runaway deal cannot be
 * interrupted in-process — the measuring pass therefore runs in a child this
 * file spawns, and the child gets a hard deadline. Six times what the whole
 * table permits: generous enough that a merely SLOW tree still reports its
 * numbers (the point of a ceiling is the figure, not the hang), tight enough
 * that F14's pre-cure thermo — 473 s for one deal — is killed in under three
 * minutes with the in-flight cell named. A walled run is a FAIL, never a skip.
 */
const WALL_MS = 6 * SEEDS.length * CELLS.reduce((a, c) => a + c.ceilingMs, 0) + 30_000;

const ARGV = process.argv.slice(2);
const flag = (name) => ARGV.some((a) => a === `--${name}`);
const planted = ARGV.find((a) => a.startsWith("--plant-ceiling="));

if (flag("measure")) {
  // The measuring child. One NDJSON row per event; the parent grades.
  await measure((row) => process.stdout.write(JSON.stringify(row) + "\n"));
  process.exit(0);
}

if (flag("derive")) {
  // Re-derive the table from a fresh pass, THROUGH THE ENFORCING PATH (the same
  // walled child the gate grades), so derivation and enforcement never differ by
  // their instrument. Prints; never writes — re-deriving is a reviewed act, and
  // this spares the arithmetic, not the reading.
  const { results } = await collect({ wall: WALL_MS });
  console.log(
    `# re-derived ${new Date().toISOString().slice(0, 10)} on ${process.platform}/${process.arch}`,
  );
  for (const cell of CELLS) {
    const r = results.get(cell.id);
    const m = r ? median(r.runs) : NaN;
    const c = ceilingFor(m);
    console.log(
      `${cell.id.padEnd(24)} median ${m.toFixed(1).padStart(9)} ms → ceiling ${String(c).padStart(6)} ms` +
        `${c === UI_CAP_MS && m * SEED_MARGIN * HOST_MARGIN > UI_CAP_MS ? "   (CLAMPED at the UI cap — this cell reds)" : ""}`,
    );
  }
  process.exit(0);
}

const REAL = new Map(CELLS.map((c) => [c.id, c.ceilingMs]));

/**
 * RED-CAPABILITY, re-proven before every graded run and off FIXTURES rather than
 * off the tree — a self-test that measures is a self-test whose colour depends
 * on how fast the runner is that morning. Four arms, each the whole reason a
 * rule exists:
 *
 *   1. an under-ceiling cell greens          — the gate can pass;
 *   2. the same cell under a 1 ms ceiling reds — the comparison can fail;
 *   3. a cell whose MEDIAN clears and whose MAX does not reds — this is the max
 *      rule, and thermo 16×16 HARD is exactly this shape, so an arm that only
 *      graded medians would print the estate's P0 green;
 *   4. a cell with no result at all reds     — a walled or thrown cell is a
 *      failure, never an absence;
 *   5. every shipped ceiling still equals the arithmetic that claims to produce
 *      it — the arm that stops a ceiling from being quietly raised while its
 *      derived median stays put. A table that no longer obeys its own rule is a
 *      table of preferences.
 */
function selfTest() {
  const probe = CELLS[0];
  const one = (runs, ceiling) => {
    const rs = new Map(runs ? [[probe.id, { runs, givens: 0 }]] : []);
    return grade(rs, new Map([[probe.id, ceiling]])).find((r) => r.cell.id === probe.id)
      .verdict;
  };
  const drifted = CELLS.filter((c) => ceilingFor(c.derivedMedianMs) !== c.ceilingMs);
  const arms = [
    ["an under-ceiling cell greens", one([5, 10, 7], 1_000), "PASS"],
    ["a planted 1 ms ceiling reds", one([5, 10, 7], 1), "FAIL"],
    ["median clears, max busts → reds", one([1, 1, 5_000], 3_000), "FAIL"],
    ["a cell that never dealt reds", one(null, 1_000), "MISSING"],
    [
      `every ceiling obeys the stated arithmetic (${CELLS.length} cells)`,
      drifted.length
        ? drifted
            .map(
              (c) =>
                `${c.id} says ${c.ceilingMs}, the rule says ${ceilingFor(c.derivedMedianMs)}`,
            )
            .join("; ")
        : "clean",
      "clean",
    ],
  ];
  const bad = arms.filter(([, got, want]) => got !== want);
  for (const [name, got, want] of arms)
    console.log(`  ${got === want ? "ok  " : "BAD "} ${name} — ${got} (want ${want})`);
  if (bad.length) {
    console.error(
      `self-test FAILED on ${bad.length} arm(s); the gate's colours mean nothing.`,
    );
    process.exit(2);
  }
  console.log("self-test ok — the comparison bites both colours.\n");
}

if (flag("self-test")) selfTest();

const ceilings = planted
  ? new Map(CELLS.map((c) => [c.id, Number(planted.split("=")[1])]))
  : REAL;
if (planted)
  console.log(
    `!! every ceiling PLANTED at ${planted.split("=")[1]} ms — the red-capability lever, not the gate\n`,
  );

const { results, meta, walled } = await collect({ wall: WALL_MS });
if (walled) {
  console.error(
    `::error::the measuring pass never finished — walled at ${WALL_MS} ms with ${walled} in flight. ` +
      `The table permits ${CELLS.reduce((a, c) => a + c.ceilingMs, 0) * SEEDS.length} ms of dealing in total.`,
  );
  process.exit(1);
}
process.exit(report(grade(results, ceilings), meta));
