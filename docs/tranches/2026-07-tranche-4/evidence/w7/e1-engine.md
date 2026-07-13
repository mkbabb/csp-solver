# T4-W7 E1 — the technique engine core (born-RED greps + test output)

Lane E1 of T4-W7. A pure, game-agnostic human-deduction engine that grades over
**self-computed basic candidates** (never `propagateBoard`'s GAC masks — r3 KILL-LIST #3),
names the cheapest technique (naked/hidden single, naked pair/triple, pointing/box-line,
X-wing = R1–R3), and grades a dealt board by the hardest technique the ladder needed.

Files (this lane's entire footprint — zero-wasm gate GREEN):

- `web/frontend/src/games/shared/techniqueEngine.ts` — the game-agnostic core (types +
  `findStep` + `gradeBoard` + `fillAllForced` + bit helpers).
- `web/frontend/src/games/shared/techniqueEngine.test.ts` — core units (detectors over the
  abstract view; the futoshiki-seam proof: one engine grades a rows/cols-only 4×4).
- `web/frontend/src/games/sudoku/technique/sudokuTechnique.ts` — the sudoku adapter
  (row/col/box houses + basic-elimination `computeCandidates`; `gradeSudoku`/`fillForcedSudoku`
  per-deal API for the composables).
- `web/frontend/src/games/sudoku/technique/sudokuTechnique.test.ts` — the sudoku ladder proofs
  (singles→tier-1, X-wing→tier-3, fill-forced, the substrate tripwire, deal-time latency).

---

## Substrate gate — BORN RED

At the wave's base SHA no technique layer exists anywhere. The spec's grep
(`naked single|hidden single|x-wing|pointing|swordfish|technique`, r3 x1:15) over
`web/frontend/src`, excluding the new W7 layer, returns only two **incidental comments** —
no implementation:

```
$ grep -rniE 'naked single|hidden single|x-wing|pointing|swordfish|technique' src/ \
    --exclude-dir=technique --exclude='techniqueEngine*'
src/assets/index.css:86:     scale rungs carry no family, so re-pointing these four vars once re-flavors
src/games/sudoku/SudokuBoard/SudokuBoard.vue:441:// ... W7's technique engine supplies the real
```

The CSS line is "re-**pointing** [CSS vars]"; the SudokuBoard line is a comment *anticipating*
this wave. Neither is a solving technique. The three born-RED premises stand: no technique
layer, no named deduction, no measured grade.

**After.** `techniqueEngine.ts` names the ladder (`naked-single | hidden-single | naked-pair |
naked-triple | pointing | box-line | x-wing`), grades a known singles-only board **tier-1** and
a known X-wing board **tier-3**, and computes candidates itself — asserted **NOT equal** to the
GAC-collapsed `propagateBoard` masks on a board where GAC over-prunes past the human sequence.

## The corrupted-substrate tripwire (r3 KILL-LIST #3) — permanent unit test

The load-bearing invariant. The engine grades over `1..n minus filled row/col/box peers`, NOT
the post-full-GAC masks (which collapse a served board to all-singleton domains,
`sudoku.rs:186-188`). The tripwire, on the X-wing fixture (unique solution, 24 clues):

- self-computed candidates `!==` the GAC-collapsed masks (the headline assertion);
- **57** empty cells are self-computed as ambiguous (popcount ≥ 2) while GAC pins them to a
  singleton — GAC over-prunes past the human sequence;
- **every** empty cell is a singleton under the GAC substrate — so a grader reading it sees all
  naked singles;
- the substrate is load-bearing: self-computed grades **tier-3** (needs an X-wing); reading the
  GAC substrate would grade **tier-1** (`findStep` over it returns a naked single).

The test fails the instant any rung starts reading `propagateBoard`'s masks.

## Fill-all-forced (W7 owns the detector; W8 wires the button)

R1's single detector applied to every cell in **one sweep** — apply every naked+hidden single
present, then stop (no search, no cascade). Verified: fills **exactly** the forced-cell set (an
independent re-derivation from the candidates), all placements correct and on empty cells; the
sweep **stops** with cells still empty and a second sweep makes more progress (proving no
cascade); a deadly-rectangle board (no forced cell) is left untouched.

## Deal-time grade latency — the live-dug 9×9 path

Grade-to-completion over the **20 real dug 9×9 hard boards** in `TEMPLATE_BANK[3].hard`
(the deal-time input), 20 iterations, n=400:

```
[T4-W7] deal-time grade latency (9×9 hard, n=400): mean 0.246ms, worst 0.972ms
```

Sub-millisecond, comfortably within a frame — the grade is pure TS, no search, no wasm.

## Test run

```
$ npx vitest run src/games/shared/techniqueEngine.test.ts \
    src/games/sudoku/technique/sudokuTechnique.test.ts
 Test Files  2 passed (2)
      Tests  25 passed (25)
```

Full frontend battery (all GREEN): `vue-tsc -b --force` (0 errors) · `npm run test:unit`
(17 files, **158** tests) · `npm run lint:eslint` (clean) · `npm run lint:knip` (clean —
every export consumed, no unused files) · `prettier --check src/` (clean) · `npm run build`
(173 modules, built; the engine is test-only until E3/W8 wire it, so the bundle is unchanged).

## Zero-wasm gate — GREEN

This lane's diff touches only `web/frontend/src/games/shared/techniqueEngine.{ts,test.ts}` and
`web/frontend/src/games/sudoku/technique/`. No `csp-solver/`, no `wasm/`, no
`scripts/sync-csp-solver-vendor.sh`, no release. (The `csp-solver/wasm/src/*.rs` edits in the
working tree are lane E4's `nodes_explored`/`propagations` telemetry getters — see
`e4-telemetry.md` — not this lane's.)

## The futoshiki seam (lane E2 plugs in — no second implementation)

The core reasons over an abstract `PuzzleView = { n, candidates, houses, constraints? }`. The
all-different rungs are pure functions of `houses` + `candidates`, so any game with
all-different houses gets naked/hidden single, naked pair/triple, and X-wing for free — proven
by the shared test grading a **rows/cols-only 4×4** (futoshiki's shape, no boxes) with the same
engine. E2's futoshiki adapter supplies rows/cols as `houses`, folds inequality-forcing into
`computeCandidates`, and appends inequality rungs that read `view.constraints` (already typed
here as `Constraint`, and asserted inert for the sudoku ladder). No ladder re-implementation.
