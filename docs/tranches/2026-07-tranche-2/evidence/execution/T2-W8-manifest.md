# T2-W8 — Grand Recursive Colocation Manifest (Lane M, re-derived)

Read-only derivation against the **live** post-W6 tree (2026-07-10). Every row is a
`git mv` proposal with imports rewritten and **zero behavior change**. Rationale keyed to
one edict clause: `colocate-family` · `break-long-dir` · `shared-dir-justified` · `stay-flat`.

Consumer facts were re-derived by grep against the live tree — the stale pass-1 `19-repo-org.md`
manifest was **not** found on disk (search returned nothing); nothing was carried blind.

---

## 1. FE — `games/{sudoku,futoshiki}/` solver family + lib dissolution

The `{solver.worker.ts, protocol.ts, lib/solverError.ts, lib/apiError.ts}` sprawl plus its
sole client composable `useSolver.ts` are **one encapsulated concern** (the in-browser Worker
solve path: the Worker, its wire types, its typed error, the error→fiction renderer, and the
composable that owns the Worker's lifecycle). They collapse into a per-game `solver/` module.

**`apiError` "sole consumer" hypothesis — FALSIFIED post-W2.** The task posited apiError's
remainder colocates with a single consumer. Live grep shows **two** consumers per game and they
straddle two families: the solve orchestration (`composables/useSudoku.ts::classifyError`) **and**
the render surface (`SudokuBoard.vue::classifyCode`,`PAPER_NOTE_COPY`). So apiError is not a
loner — it's the shared error-rendering half of the solver concern and belongs **in `solver/`**
(the encapsulated-concern framing), not colocated with one consumer. (Its name is a misnomer —
no API path survives; optional rename to `errorFiction.ts` noted, not a move row.)

`conflicts.ts` is a different concern (board conflict-mark detection), sole consumer the Board —
it colocates **into the Board dir**, not `solver/`. With apiError+solverError→`solver/` and
conflicts→Board, `lib/` is empty and dissolves.

| # | old | new | clause | rationale | Done |
|---|-----|-----|--------|-----------|------|
| S1 | `games/sudoku/solver.worker.ts` | `games/sudoku/solver/solver.worker.ts` | colocate-family | Worker is the core of the solve concern | DONE |
| S2 | `games/sudoku/protocol.ts` | `games/sudoku/solver/protocol.ts` | colocate-family | Worker wire types; only importer is useSolver+worker | DONE |
| S3 | `games/sudoku/lib/solverError.ts` | `games/sudoku/solver/solverError.ts` | colocate-family | the Worker's typed error; imported by worker/protocol/useSolver/apiError | DONE |
| S4 | `games/sudoku/lib/apiError.ts` | `games/sudoku/solver/apiError.ts` | colocate-family | error→fiction renderer; 2 consumers both inside the solve concern | DONE |
| S5 | `games/sudoku/composables/useSolver.ts` | `games/sudoku/solver/useSolver.ts` | colocate-family | sole importer of protocol+worker; the concern's public composable | DONE |
| S6 | `games/sudoku/lib/conflicts.ts` | `games/sudoku/SudokuBoard/conflicts.ts` | colocate-family | sole consumer is `SudokuBoard.vue::findConflicts` | DONE |
| S7 | `games/sudoku/lib/` (dir) | — (removed) | break-long-dir | empty after S3/S4/S6; dissolve the bucket | DONE |
| F1 | `games/futoshiki/solver.worker.ts` | `games/futoshiki/solver/solver.worker.ts` | colocate-family | mirror of S1 | DONE |
| F2 | `games/futoshiki/protocol.ts` | `games/futoshiki/solver/protocol.ts` | colocate-family | mirror of S2 | DONE |
| F3 | `games/futoshiki/lib/solverError.ts` | `games/futoshiki/solver/solverError.ts` | colocate-family | mirror of S3 | DONE |
| F4 | `games/futoshiki/lib/apiError.ts` | `games/futoshiki/solver/apiError.ts` | colocate-family | mirror of S4 | DONE |
| F5 | `games/futoshiki/composables/useSolver.ts` | `games/futoshiki/solver/useSolver.ts` | colocate-family | mirror of S5 | DONE |
| F6 | `games/futoshiki/lib/conflicts.ts` | `games/futoshiki/FutoshikiBoard/conflicts.ts` | colocate-family | sole consumer `FutoshikiBoard.vue::findConflicts` | DONE |
| F7 | `games/futoshiki/lib/` (dir) | — (removed) | break-long-dir | empty after F3/F4/F6 | DONE |

**Import-rewrite map (movers):**
- `useSudoku.ts`/`useFutoshiki.ts`: `'../lib/apiError'`→`'../solver/apiError'`; `'./useSolver'`→`'../solver/useSolver'`.
- `SudokuBoard.vue`/`FutoshikiBoard.vue`: `'@games/*/lib/apiError'`→`'@games/*/solver/apiError'`; `'@games/*/lib/conflicts'`→`'./conflicts'`.
- moved `useSolver.ts`: `'../lib/solverError'`→`'./solverError'`; `'../protocol'`→`'./protocol'`; `new URL('../solver.worker.ts',…)`→`'./solver.worker.ts'`; `pencil/types` path unchanged (`solver/` and `composables/` are equidepth).
- moved `solver.worker.ts`/`protocol.ts`: `'./lib/solverError'`→`'./solverError'`; sibling `'./protocol'` unchanged.

**Satellite audit (new-since-W6, no move):**
- `composables/useUrlState.ts` (permalink codec) — **1 consumer** (`useSudoku`/`useFutoshiki`); already adjacent in `composables/`; stays. `shared-dir-justified`: `composables/` retains ≥2 game-state members (`useSudoku`+`useUrlState`) after useSolver leaves — a coherent game-state family, not ceremony.
- undo history + marks state — inline in `useSudoku`/`useFutoshiki`; no satellite file; nothing to move.
- `types.ts` (game root) — cross-family game types, ≥2 consumers (composables + Board); `shared-dir-justified` at game root; stays.

## 2. FE — `pencil/chrome/` break-up

The `Component/ + satellites` convention (`AttributionCard/`, `HandwrittenLogo/`, `OptionSelector/`)
already generalizes fully: every satellite-bearing member is foldered, every remaining flat member
is a genuine loner. **No moves.**

| member | disposition | clause | rationale |
|--------|-------------|--------|-----------|
| `AttributionCard/`, `HandwrittenLogo/`, `OptionSelector/` | keep foldered | colocate-family | already carry `CrayonHeart`+`useHoverCard` / `useGameMenu` / `scribbleUnderline` |
| `BoilDivider`, `CelebrationStar`, `DiceIcon`, `MarginNote`, `ScribbleLoader`, `SolveIcon`, `SvgFilters` | stay flat | stay-flat | single-file, no owned satellite |
| `celestial/DarkModeToggle.vue` | stay (note) | stay-flat | lone file in `celestial/`; a bespoke category, no satellites — optional flatten to `chrome/` is pure churn, skip |
| `pencil/composables/{celebration,useButtonAnimation}.ts` | stay | shared-dir-justified | `celebration` 3 consumers (2 games + glyph); `useButtonAnimation` 2 consumers (both ControlPanels) — cross-family, both ≥2 |
| `pencil/glyph/{glyphAnimations,glyphPaths,glyphRegistry}.ts` | stay | shared-dir-justified | tight 4-file module; `glyphRegistry` 4 cross-family consumers is the public entry. `glyphAnimations` sole consumer is `HandwrittenGlyph` — foldering it is ceremony inside a 4-file module; skip |
| `pencil/grid/gridPaths.ts`, `pencil/config/pencilConfig.ts`, `pencil/types.ts` | stay | shared-dir-justified | module/global-level, many cross-family consumers (gridPaths 6, pencilConfig 11, types 10) |

## 3. FE — `index.css` component-specific extractions

Tokens (`@theme`, `.dark`, `@font-face`) and true globals (`.cartoon-shadow*`, `.fira-code`,
`.handwritten`, print + coarse-pointer + reduced-motion arms, cross-family `.solve-success`/
`.solve-failure`/`.cell-reveal-animated`) **stay**. Only two rule-blocks have a single owner:

| # | old | new | clause | rationale | Done |
|---|-----|-----|--------|-----------|------|
| C1 | `index.css` `.sudoku-cell:focus-within` | `SudokuCell.vue` scoped style | colocate-family | sole consumer `SudokuCell.vue`; sudoku-only | HELD |
| C2 | `index.css` `.sheet-laminate` (+ its `prefers-reduced-transparency` + `prefers-contrast` arms) | `AnswerKeyLaminate.vue` | colocate-family | sole consumer `AnswerKeyLaminate.vue` | HELD |

**Behavior caveat (movers):** both live in `@layer utilities`. Moving into a `<style>` block
changes cascade layer; use non-scoped or `:global()` as needed and preserve the two media-query
arms verbatim on C2 — this is the one FE row with real regression surface. If the layer semantics
can't be reproduced 1:1 without risk, **hold C1/C2** (the edict forbids any behavior change).

**Lane F disposition — C1/C2 HELD (2026-07-10).** Both rules live in `@layer utilities`; an SFC
`<style>` extraction changes their cascade layer (unlayered SFC styles outrank `@layer` rules; a
`<style scoped>` variant additionally needs `:global()` to keep matching the global `.sudoku-cell`
/`.sheet-laminate` class hooks). Reproducing the layer 1:1 would require an `@layer utilities {…}`
wrapper inside the SFC whose layer-order merge cannot be confirmed behavior-identical by this lane's
automated gates: the e2e suite selects `.sudoku-cell` but asserts none of its `:focus-within`
background/outline nor the laminate's opacity/PRT/PRC arms, and build+tsc+eslint see no cascade.
Per the manifest's own escape hatch and the edict's zero-behavior-change bar, both are HELD rather
than risk a silent visual regression. Recorded for owner adjudication (a visual-diff pass could
lift the hold). Zero index.css bytes changed by Lane F.

## 4. BE — `csp-solver/src/` cohesion, `examples/`, `tests-py/`

**LANE B — DONE (2026-07-10).** Re-derived against the live tree; conclusions hold verbatim.
Per-dir flat counts confirmed (constraint 9, py 7, domain 6, builder 2, solver 6 files +
`gac/` subdir; `puzzles/` = `{sudoku,futoshiki}/` submodules). No break earned → **zero moves**.
examples/ dispositions confirmed (9 examples live; `probe_futoshiki_gen`+`parity_probe` stale
flags recorded, out of W8 scope, not actioned). tests-py/ = 4 test files + pyproject+uv.lock,
stay-flat confirmed; no tracked artifacts. Gates: `cargo test --workspace` **151 passed, 0
failed, 6 ignored**; `cargo clippy --workspace --all-targets -D warnings` clean; `cargo check
--features py` clean; `cargo check --target wasm32-unknown-unknown` clean; `grep -rn '#[cfg(test)]'
src/` → **NONE**.

**src/ — no moves.** `solver/` SHRANK post-excision (heuristic.rs, nogoods.rs, restart.rs,
soft.rs deleted) → 8 entries incl. `gac/` subdir; nothing bloated to compensate. Per-dir flat
counts: constraint 9, puzzles 9 (2 subdirs), py 7, domain 6, builder 2, root-loose 8. The only
"long" flat dir is `constraint/` (9), but it's a cohesive one-file-per-constraint-kind family
(`not_equal`,`all_different`,`all_different_except`,`implication`,`lambda` + `traits`/`dispatch`/
`scratch`/`mod`), not a grab-bag — `stay-flat`. `puzzles/` is already `{sudoku,futoshiki}/` sub-
modules. No break earned.

**examples/ — no moves** (Cargo convention dir); keep-vs-stale dispositions only:

| example | disposition | evidence |
|---------|-------------|----------|
| `verify_bank_uniqueness`, `gac_ab_corpus`, `time_sudoku`, `alloc_count` | keeper | named keepers; live doc + CI refs |
| `generate_templates` | keeper | template-bank build tool, 14 refs |
| `profile_sudoku`, `profile_csp` | keeper | live `docs/benchmarks.md`+`docs/optimizations.md` refs |
| `probe_futoshiki_gen` | **stale candidate** | refs only historical `grand-uplift` evidence + CLAUDE.md; one-off gen probe |
| `parity_probe` | **stale candidate** | refs only historical `grand-uplift` W1-kernel evidence + CLAUDE.md; kernel-preservation one-off |

Stale flags are an owner cleanup call, **out of W8 colocation scope** — recorded, not actioned.

**tests-py/ — stay flat.** 4 tracked test files (`test_bench_compare`,`test_panic_contract`,
`test_rust_backend`,`test_wheel_contracts`) + `pyproject.toml`+`uv.lock` — one cohesive wheel-
contract suite; `stay-flat`. Hygiene verified: `.venv/`, `__pycache__/`, `.pytest_cache/` are
untracked (gitignored) — no tracked-artifact rows.

## 5. tests/ mirror discipline — tests-of-record pointers

**LANE B — DONE (2026-07-10).** Re-verified: every `tests/*.rs` name referenced by a `//! Tests:`
doc-comment resolves to a live file in `tests/` (11 distinct targets, all present). **0 broken
pointers → no fix rows.**

Every `//! Tests:` doc-comment in `src/` was resolved against live `tests/`. **All 12 resolve;
0 broken pointers.** No pointer references a deleted test (`nogoods.rs`,
`restart_nogood_soundness.rs` deletions left no dangling doc-comment).

| src module | pointer(s) | resolves? |
|---|---|---|
| `error.rs` | `tests/error.rs` | ✓ |
| `config.rs`, `csp/mod.rs`, `constraint/not_equal.rs` | `tests/solver.rs` | ✓ |
| `solver/search.rs`, `csp/solve.rs` | `tests/solver.rs`,`tests/solution_set_invariance.rs` | ✓ |
| `puzzles/sudoku/generate.rs` | `tests/sudoku_generate.rs`,`tests/sudoku.rs` | ✓ |
| `puzzles/futoshiki/csp.rs` | `tests/futoshiki.rs` | ✓ |
| `builder/assignment.rs` | `tests/assignment_builder.rs`,`tests/assignment_proptest.rs` | ✓ |
| `domain/lattice.rs` | `tests/lattice.rs` | ✓ |
| `constraint/all_different.rs` | `tests/solver.rs`,`tests/sudoku.rs`,`tests/futoshiki.rs` | ✓ |
| `constraint/lambda.rs` | `tests/optimize.rs` | ✓ |
| `constraint/all_different_except.rs` | `tests/all_different_except.rs` | ✓ |

*Gap (not a broken pointer, no row):* `domain/cost_finite.rs`, `solver/gac/`, `solver/optimize.rs`,
`puzzles/difficulty_parity` have tests (`cost_finite.rs`,`gac_kernel_beats.rs`,`optimize.rs`,
`difficulty_parity.rs`) but **lack** a `//! Tests:` doc-comment. Optional doc-add, not a move.

---

## Row summary

- **Actionable move/extract rows:** 14 — S1–S6, F1–F6 (12 FE file moves) + C1, C2 (2 CSS extractions). Plus 2 dir removals (S7, F7) as a consequence.
- **Verify/stay rows:** pencil §2 (all stay), BE src/examples/tests-py §4 (all stay), tests/ pointers §5 (0 broken).
- **Flagged non-W8:** apiError rename (optional), 2 stale examples, 4 missing test-doc pointers.

### 5 highest-churn rows (movers' attention)

1. **S1–S5 — sudoku `solver/` creation** (5 files + import rewrites in `useSudoku`, `SudokuBoard`, and 4 intra-module edges). Largest single blast radius.
2. **F1–F5 — futoshiki `solver/` creation** (byte-symmetric mirror; keep the two games identical).
3. **S6/F6 — `conflicts.ts` → Board dir** (rewrites the `@games/*/lib/conflicts` alias import to `./conflicts` in both Boards; the sole cross-cut that changes an `@games` alias to relative).
4. **S7/F7 — `lib/` dissolution** (verify no dangling `lib/` reference survives; update `web/frontend/CLAUDE.md` file-tree, which still documents `lib/` + `protocol.ts`/`solver.worker.ts` at game root).
5. **C2 — `.sheet-laminate` extraction** (only row with regression surface: `@layer utilities` → SFC cascade-layer change + two media-query arms must survive verbatim; hold if not reproducible 1:1).
