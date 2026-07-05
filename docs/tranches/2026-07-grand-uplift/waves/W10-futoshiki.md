# W10 — Futoshiki product wave

**Owner-committed (ratified 2026-07-04).** A from-scratch product surface—generation, validation, wire, visual grammar, a11y—on a solver whose *solving* is done. [`futoshiki-wave-spec.md`](../evidence/futoshiki-wave-spec.md) is the spec of record; this file binds its amendments and gates. Not a thin wrapper: multi-file, multi-crate, multi-language (its own F12).

**Dependencies**: ← W1 **hard** (the `max_solutions:2` uniqueness checker was exactly the shape the P0 corrupted—now sound, with `futoshiki_constr`/`futoshiki_loose` invariance tests as standing guard); ← W4 (taxonomy/DI, `games/` package); ← W7 (topology—zero further renaming); ← W9 (visual grammar). **Effort**: L (5–8 days across all layers).

---

## Scope (file-level)

### Rust (`csp-solver/src/puzzles/futoshiki/`)

- **F1 precondition (required fix, not a gate)**: `solve_futoshiki()`'s shipped FC+FailFirst config cannot solve an *empty* N≥6 board within its own 1M-node budget (measured: N=6 → 4.56M backtracks, budget-dead at 2.09 s). One-line swap to `Ac3`+`DomWdeg`(→`Mrv` post-W1) mirrors the Sudoku production override—solves N=4–9 in **0 backtracks, sub-0.1 ms** each (`pass3/futoshiki-gen-probe-output.txt`). Regression test at N≥6 lands with it.
- **`generate.rs`** (NEW, mirrors `sudoku/generate.rs`): `seed_latin_square` (solve an empty board—reuses the solver, no bespoke algorithm), `place_inequalities` (orthogonally-adjacent pairs already satisfied by the seed—new logic, no Sudoku analog), hole-dig with `max_solutions: 2` uniqueness (the CSP at each removal includes surviving givens **and** the full inequality set—inequalities are board furniture, never blanked), `measure_difficulty` recipe reusable verbatim.
- **Validation** (`FutoshikiPuzzle::from_parts`, NEW—`parse()` is a CLI-format artifact and must not leak to the wire, F11): every pair satisfies `|row(a)−row(b)| + |col(a)−col(b)| == 1` and both indices `< n²`; reject with the existing `CspError::InvalidInput`—**no new error variant** (F4: valid-per-solver but unrenderable-per-frontend is the exact contract gap the taxonomy exists to close).

### PyO3 + wasm

- `py/` gains the Futoshiki block mirroring the Sudoku surface (~150 L).
- `wasm/src/futoshiki.rs` (NEW, option (b) per the spec—purpose-built flat wire, `Uint32Array` board + flat inequality pairs, seeded RNG; keeps the deploy build's `--no-default-features` posture; ~120–180 L).

### FastAPI (`web/api/src/app/games/futoshiki/`)

- `{router,service,models}.py` into the W4 package: `GET /api/v1/futoshiki/random/{board_size}`, `POST /api/v1/futoshiki/solve`. **`board_size`, never `size`** (F5—Sudoku's `size` is the *subgrid* side; a shared name is a live footgun). Contract-test line asserts `board_size` never appears as a bare `size` alias in the new files.
- Error taxonomy reused verbatim; `INVALID_INPUT` fires on non-adjacent pairs and out-of-range sizes.
- This wave makes `main.py`'s "Sudoku & Futoshiki" advertisement **true**—better than Pass-1 P8's deletion default (superseded by the ratification).

### Frontend (`web/frontend/src/games/futoshiki/`, per [`fe-colocation-manifest.md`](../evidence/fe-colocation-manifest.md) §1.3)

- `types.ts` (own shape—`board_size`, **no `Difficulty`**, `inequalities` never in given/overridden bookkeeping), `FutoshikiBoard/FutoshikiBoard.vue` (~90% structural copy; `gridPaths.ts` already degrades to a subgrid-free Latin grid when `subgridSize === boardSize`—verified zero-cost reuse), `FutoshikiBoard/FutoshikiCell/`, `FutoshikiBoard/FutoshikiCaret/` (**sibling to the cell, not nested in it**—a caret belongs to a boundary pair; positioned via the existing `cellSize` math; wraps `pencil/glyph/HandwrittenGlyph.vue`), `ControlPanel/{ControlPanel.vue,constants.ts}` (own file—games never import each other), `composables/{useFutoshiki,useApi,useUrlState}.ts` (own files—the Sudoku ones hardcode endpoints/keys/shapes).
- `pencil/glyph/{glyphPaths,glyphRegistry}.ts` gain 2–3 hand-drawn `<`/`>` variants through the existing `pickVariantIndex`/`cellHash` mechanism; caret boil rides `createGlyphWiggle`, not line-boil. Mirrored-vs-distinct variants are a design-review item (F7—no prior art in this repo).
- Caret a11y (F6): carets `aria-hidden`; the constraint folds into **both** adjacent cells' `aria-label`s—coherent but genuinely novel; G4 is the live test.
- Navigation: in-app selector per OD-8.
- `AnswerKeyLaminate` inherited unchanged in principle (board-shape-agnostic by design)—G5 verifies against carets in the scene.

### Scope bounds (honest reductions, not missing features)

**v1 = N=4–7, single high-density tier, no difficulty parameter** (F2/F3): the generation cliff arrives at *higher* clue density than Sudoku's (N=6 fails at 30% keep, N=7 at 40%, N=8 at 50%—no-inequality floor); uniqueness-checked hole-digging at ~75% density is 0–1 ms for N=5–7. Difficulty bands don't transfer from Sudoku and have no measurement—shipping fabricated tiers is worse than shipping none.

## Acceptance gates (G0–G6, verbatim from the spec §4)

| Gate | Proves | Bar |
|---|---|---|
| **G0** config fix | the F1 swap works | `cargo test --test futoshiki` green incl. a new N≥6 case; `budget_exceeded=false` up to the max shipped size |
| **G1** real generation cost | the no-inequality floor is representative | multi-trial (5+) probe with adjacency-valid inequality sets, 3+ densities × N∈{5..8}—the one number that could shrink the shipped size range |
| **G2** difficulty rating | bands separate before any tier ever ships | calibration run; v1 ships no tiers regardless |
| **G3** adjacency validation | F4 closed at every boundary | negative-control per layer (Rust, PyO3, wasm, Pydantic): non-adjacent pair → `INVALID_INPUT`/400/422, never a silent accept |
| **G4** caret a11y | F6 reads sensibly live | screen-reader pass (≥8 clues on a 7×7), verbosity judged |
| **G5** laminate over carets | the peek layer generalizes | mount on a Futoshiki board; solution glyphs land correctly, no caret collision |
| **G6** wasm parity | client/server never diverge | 0 mismatches native↔wasm across fixed + generated boards at each shipped size |

## Seed artifacts

- [`futoshiki-wave-spec.md`](../evidence/futoshiki-wave-spec.md) — the complete spec (§2) + attack (§3).
- `pass3/futoshiki-gen-probe-output.txt` + the probe source pattern — G1 extends it (multi-trial discipline per `pass2/rust-owned-puzzle-data.md` §3.2).
- Everything else is net-new by design—no diff exists; the spec's file-level tables are the blueprint.

## Residual risks

- G1 is the honest unknown: inequality clues should prune (lowering the effective cliff) but were never measured—if they don't move it, N=7 may be the ceiling and the spec already prices that.
- The frontend spec has no design-review precedent behind it (F7)—"technically coherent, not yet aesthetically reviewed"; the caret glyph is a visual judgment call needing the same flip-test discipline as everything else.
- If GAC-adjacent kernel changes land later, re-run the F2 cliff before widening sizes (the spec's own F9 request).
