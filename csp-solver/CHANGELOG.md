# Changelog

This workspace ships two publishable artifacts across two registries:

- `csp-solver` — the CSP solver crate (crates.io)
- `@mkbabb/csp-solver-wasm` — wasm-pack bindings for `csp-solver` (npm)

**Excised:** `morph-core` (crates.io) and `@mkbabb/morph` (npm) moved to
[`github.com/mkbabb/morph`](https://github.com/mkbabb/morph) at commit
`4568dc7e` (tag `pre-morph-excision`). Their `0.1.0` entries below stay as
historical record; they really did ship from this repo, but everything past
`morph-core 0.1.0` / `@mkbabb/morph 0.1.1` lives in that repo's changelog. The
general-purpose `csp_solver::assignment()` / `AssignmentBuilder` surface morph
was built on stays here; `morph` now consumes it as an ordinary crates.io
dependency (`csp-solver = "0.2"`).

## 0.7.0 — 2026-08-25 (T9-W4 — generation truth)

_Version stamped, not yet published: the crates.io tarball and the npm publish
are the wave seal's act, not this bump's. The `0.7.0` slot is a **minor** bump
because both surfaces break._

### crates.io — `csp-solver`

- **BREAKING — `PuzzleClass` gains a per-deal solver and an honest candidate
  verdict.** `solve_candidate(&self, board, clues, max) -> Vec<Vec<u32>>`
  becomes `solve_candidate(&self, &mut Self::Solver, board, max) ->
  CandidateOutcome`, alongside the new associated type `Solver` and
  `build_solver(&self, clues) -> Self::Solver`. The five witnesses build their
  CSP once per deal instead of once per removal — the **skeleton hoist**, the
  crate's own documented ~40% win, previously applied to sudoku alone and now
  paid forward to futoshiki, thermo, killer and kenken.
- **The budget-exhaustion law.** `CandidateOutcome::{Complete, Exhausted}` with
  `proves_unique()` — `true` only when the search *closed* and found exactly
  one solution. A dig previously read a budget-exceeded enumeration as a
  uniqueness proof and could mint a multi-solution puzzle from it; exhaustion
  is now a distinct outcome the dig treats as NOT-PROVEN and puts the cell
  back. This is the lever that makes any future budget tightening safe.
- **The attempt-stop.** `PuzzleClass::rejection_leash()`, defaulting to
  `DEFAULT_REJECTION_LEASH = 8`: the dig ends after that many consecutive
  refused removals rather than walking every remaining index of an unreachable
  hole target. Measured on thermo 16×16 Hard — max 50.7 s → 17.2 s (2.95×),
  median 11.2 s → 7.9 s — with every 9×9 rung and thermo 16×16 Medium dealing
  identical given-counts to an unleashed dig. The constant's table is on the
  const, its measurement in `tests/generation_leash.rs`.
- **`Difficulty::target_holes` is the one hole-target formula.** The clue-count
  bands were copied at four sites through T4-W13; the semantics are unchanged
  (`/4`, `/1.75`, `/1.25`) and the target is now documented as an *aim*: at
  16×16 Hard it asks for 204 holes of 256 and the dig lands at 172–180.

- **BREAKING — `puzzles::futoshiki` conforms to the five-family shape.**
  `create_futoshiki_csp(board, n, inequalities) -> (Csp, given)` and
  `solve_futoshiki(board, n, inequalities, &SolveConfig) -> Option<Vec<u32>>`
  now match sudoku/thermo/killer/kenken exactly. The sparse `FutoshikiPuzzle`
  struct is **removed**: its validation is `validate_futoshiki(board, n,
  inequalities) -> Result<(), CspError>` and its CSC411 text reader is
  `parse_futoshiki(input) -> (n, board, inequalities)`. No compatibility
  shim—futoshiki was the one family whose givens rode `add_equals` constraints
  instead of the given seam, and keeping both encodings was the divergence.
- **`CspError::aborted(&SolveStats) -> Option<CspError>`**—the one place an
  empty solve becomes a typed error: `cancelled` ⇒ `Timeout`,
  `budget_exceeded` ⇒ `BudgetExceeded`, neither ⇒ `None` (a completed search
  that found nothing is a proof, not an abort). This wires `CspError::Timeout`,
  reserved since `0.4.0` "until the cancel-driver lands"—the driver
  (`SolveConfig::cancel` + `SolveStats::cancelled`) is live, so PyO3's
  `CspTimeoutError` is raisable for the first time, and a cancelled
  `solve_sudoku` no longer returns `False` as though the board were unsolvable.
- **`SudokuClass::from_difficulty(n, difficulty)`**—the fifth and last
  `PuzzleClass` witness to get the constructor its siblings had.
- `builder::assignment` is a directory module (`error` / `lap` /
  `branch_and_bound`); the re-exported surface is unchanged.

### npm — `@mkbabb/csp-solver-wasm`

- **BREAKING — the template bank is part of the generate contract for all five
  families.** `generateThermo`, `generateKiller`, `generateKenKen` and
  `generateFutoshiki` gain a fourth positional `templates: Uint32Array`,
  mirroring `generateSudoku(n, difficulty, seed, templates)`. Empty ⇒ the live
  dig, byte-identical to the native seeded dealer; non-empty ⇒ the seed picks
  one banked record and it deals verbatim. Through `0.6.0` only sudoku could be
  handed a bank at all, so a thermo 16×16 Hard deal had no path but the dig —
  `useThermo.ts`'s `templates: null` was inert against a surface that did not
  exist.
- **The bank record.** A bank is a flat `Uint32Array` of
  `[clue_len, board…, clue…]` records: the count first so a record skips by
  arithmetic, then the dense board, then exactly the buffer that family's
  `PuzzleData` getter emits. A caller banks a deal by concatenating
  `[d.cages.length, ...d.board, ...d.cages]`, and the tail is validated through
  the family's own `solve*` decoder at the *deal*, so a malformed bank throws
  `INVALID_INPUT` there rather than surfacing as a broken board later.
  `generateSudoku` keeps its bare `total`-chunked bank — sudoku carries no clue
  furniture, so every prefix would be a constant `0`. No symmetry transform
  rides a clue-carrying bank: sudoku's digit permutation inverts a thermometer
  chain and falsifies a cage target, so a record deals as it was banked.
- **`node_budget = 0` documented as what it is.** All five `solve*` doc
  comments said `0` selected the 1,000,000-node default; the code has always
  read it as a literal zero-node budget that throws `BUDGET_EXCEEDED` before
  the first node. The literal stays and the prose is corrected — a caller who
  computes a budget to zero is asking for no search. `undefined` still takes
  the default.
- Four bank boundary tests (`wasm/tests/bank_boundary.rs`) and a five-verb
  `node_budget` pin, so neither contract can drift from its prose again.
- All five `generate*` verbs now throw a typed error carrying
  `.code === "INVALID_INPUT"`. `generateSudoku`, `generateThermo` and
  `generateKiller` previously threw a bare `Error` with no discriminant.
- `board_total` lives in `errors.rs`, the module that declares itself the home
  for exactly this; three hand-copied twins and two inlined checks are gone.
- 15 boundary tests, one per exported verb (`wasm/tests/verb_boundary.rs`):
  marshalling, native parity, and the typed-error contract.

## 0.6.0 — 2026-07-15

_Crate published to crates.io. This is the release that carries the five-family
surface: `0.5.0`'s tarball predates it (the puzzle-class work landed after that
bump), so `0.6.0` is the first published version where source and registry
agree. The Python wheel version joins at `0.6.0` (it had lagged at `0.4.0`).
The wasm npm tarball still stays at `0.2.0`—the frontend file-links the lean
build._

### crates.io

- **`csp-solver@0.5.0 → 0.6.0`**—the five-family generation surface:
  - `puzzles::class`—the `PuzzleClass` trait (five seams: `seed_solution`,
    `place_clues`, `solve_candidate`, `target_holes`, `assemble`) and the
    generic `generate_by_digging<C>` dealer; every family generates through one
    hole-digging path. `SimpleRng` is now `pub` (additive).
  - `puzzles::{thermo,killer,kenken}`—three new native families:
    `create_thermo_csp` (strict-increase tube chains as binary less-than),
    `create_killer_csp` (cage sums + per-cage AllDifferent), `create_kenken_csp`
    (boxless Latin square, `+ − × ÷` cage targets), each with its `generate_*`
    dealer and uniqueness proven under `max_solutions = 2`.
  - **`CageSum` / `CageProduct`**—two n-ary bounds-consistent propagators as
    first-class `ConstraintEnum` variants (an fn-pointer value seam keeps the
    enum domain-generic), reached through `Csp::add_cage_sum` /
    `add_cage_product`. Real pruning, not lambda fallbacks: search-node drops of
    −77% (Killer 9×9) and −78% (KenKen 6×6) against the lambda encoding,
    identical solution sets, 2×2000-iteration randomized soundness oracles.
  - Sudoku and Futoshiki are untouched; Thermo, Killer, and KenKen add no engine
    constraints beyond the two cage propagators.

## 0.5.0 — 2026-07-13

_Crate published to crates.io. The wasm bump is source-only; the npm tarball
stays at `0.2.0` (the frontend file-links the lean build, not the registry
package)._

### crates.io

- **`csp-solver@0.4.0 → 0.5.0`** — additive public surface: futoshiki grows a
  `Difficulty` axis it never had (GEN-2). New exports under
  `puzzles::futoshiki`: the `Difficulty` enum (`Easy`/`Medium`/`Hard`) and
  `generate_futoshiki_difficulty_seeded(n, difficulty, seed)`, a keep-density +
  inequality-density ladder (Easy 0.6 / Medium 0.45 / Hard 0.3 keep; carets ≈
  n / 1.5n / 2n) wired through the existing `generate_futoshiki_tuned_seeded`.
  Givens fall strictly Easy→Hard (15/11/8 on a 5×5), each tier unique 30/30. The
  single-tier `generate_futoshiki` / `generate_futoshiki_seeded` entries are
  unchanged. Minor bump per the pre-1.0 discipline (new surface across the 0.x
  minor slot).
- **Solver micro-rows (output-identical)** — the perf-audit rows, each gated on
  byte-identical dealt boards and solve traces:
  - *GENREUSE* — generation's slow hole-dig reuses one finalized CSP skeleton
    across all hole candidates instead of rebuilding it per candidate. New
    `puzzles::sudoku` exports `sudoku_csp_skeleton(n)` + `sudoku_given(board)`
    (`create_sudoku_csp` composes them, signature unchanged). Allocations/deal
    fall 7–14× (9×9-Medium 39.1k → 5.3k, 16×16-Medium 362.8k → 26.1k).
  - *VALUES* — the search kernel's per-node domain snapshot uses `SmallVec`
    (inline for domains ≤ 16), removing ~1 alloc/node. New dependency
    `smallvec = "1"`; **+2,869 B** lean wasm (89,995 B, clears the 93 KB budget).
  - *MRV* — the `Ordering::Mrv` weighted degree is precomputed once
    (`ordering::precompute_var_wdeg`) instead of re-summed per node.
    **BREAKING (internal API):** `ordering::select_variable` takes a `var_wdeg`
    slice in place of `(constraint_weights, var_constraint_ids)`. Size-neutral.

### npm (source-only, not published)

- **`@mkbabb/csp-solver-wasm@0.4.0 → 0.5.0`** — **BREAKING**. `generateFutoshiki`
  gains a `difficulty` argument: `generateFutoshiki(boardSize, seed)` →
  `generateFutoshiki(boardSize, difficulty, seed)`, mirroring
  `generateSudoku(n, difficulty, seed)`. New `FutoshikiDifficulty`
  (`Easy`/`Medium`/`Hard`) enum export. The frontend Worker call-site is updated
  alongside. Minor bump encodes the breaking signature change across the 0.x
  minor slot. Source-only: the npm registry stayed at `0.2.0`.

## 0.4.0 — 2026-07-10

_Crate published to crates.io. The wasm bump is source-only; the npm tarball
stays at `0.2.0`._

### crates.io

- **`csp-solver@0.3.0 → 0.4.0`** — encapsulation pass, no solver-behavior
  change. Breaking (pre-1.0 minor-bump class): 12 `pub` items demoted to
  `pub(crate)` where the `private_interfaces` lint forced it (`ac3_full`,
  `feasibility_search`, `branch_and_bound`, reached through their `&Adjacency`
  parameters). `adjacency.rs` relocated from the crate root to `solver/`.
  `solver/gac.rs` split its scratch substrate out to `solver/gac/scratch.rs`
  (`pub(super)`, no logic edit). `ImplicationConstraint` gained ten in-repo
  tests (bbnf constructs it live; now the crate proves it). The reserved Timeout
  path stays reserved, no constructor until the cancel-driver lands. tests-py
  held at 27 passed / 0 skipped on the `0.4.0` wheel.

### npm (source-only, not published)

- **`@mkbabb/csp-solver-wasm@0.2.0 → 0.4.0`** — **BREAKING**. The `full-mirror`
  feature and its `isomorphic` module are excised; the published `.d.ts` drops
  `Csp`, `SolveConfig`, `SolveStats`, `OptimizationMode`, `Ordering`,
  `PropagationStrategy`, `Pruning` (the generic py-mirror surface, 7 exports).
  The shipped surface is now the purpose-built `sudoku` + `futoshiki` +
  `assignment` layers only. No in-repo consumer is affected: the frontend Worker
  imports `solveSudoku` / `solveFutoshiki` / `generate*` / `solveAssignmentCop`
  only, never the isomorphic classes; the lean deploy build never compiled the
  isomorphic surface, and its bytes are byte-identical pre/post. The `0.4.0`
  minor bump encodes the breaking removal across the 0.x minor slot and aligns
  the package to the core crate's `0.4.0` surface. Source-only: the npm registry
  stayed at `0.2.0`.

## 0.3.0 — 2026-07-10 (substrate excision)

### crates.io

- **`csp-solver@0.3.0`** — dead-substrate excision. Breaking (pre-1.0 minor-bump
  class — a `0.2.1` would stay inside the `^0.2` (`>=0.2.0,<0.3.0`) compat range
  and let the crates.io `morph` consumer (`csp-solver = "0.2"`) silently pick up
  the removals; the `0.3.0` minor bump keeps that contract honest):
  - Removed the deferred-driver substrate: `solver/restart.rs` (Luby),
    `solver/heuristic.rs` (conflict-history weighting), `solver/nogoods.rs`
    (`NogoodStore`) and their `solver/mod.rs` `pub mod` lines. The restart /
    nogood / CHS driver was never wired onto the unified kernel; the modules
    were inert public API.
  - `Ordering::Chs` deleted (its only distinction from `Mrv` was the dynamic
    conflict-history weighting that lived in the now-removed `heuristic.rs`;
    weights are frozen at 1.0, so `Chs ≡ Mrv` in behavior).
  - `SolveConfig::restarts` field deleted (accepted-but-inert flag; breaks
    exhaustive struct literals — spread `..Default::default()`).
  - The `SoftConstraint` island removed: the `SoftConstraint` trait,
    `SoftLambdaConstraint` (`constraint/soft.rs`), `ConstraintEnum::Soft`, and
    `Csp::add_soft_constraint`. Branch-and-bound now scores domain costs only.
    `OptimizationMode` / `CostDomain` / `DomainCostEval` are **kept** — bbnf's
    live `MinimizeCost` path draws cost from `CostDomain::cost` via
    `DomainCostEval`, not from soft penalties.
  - `Variable::clear_log` / `Variable::reset_to` deleted (dead restart-driver
    helpers with no remaining caller).
  - Tests: `tests/optimize.rs` trimmed to the `CostDomain` cases;
    `tests/nogoods.rs` and `tests/restart_nogood_soundness.rs` deleted.

## 0.2.0 — 2026-07-06 (kernel wave)

### crates.io

- **`csp-solver@0.2.0`** — the kernel wave. Breaking (pre-1.0 minor-bump class):
  - `Ordering::DomWdeg` → `Ordering::Mrv` (the name was a proven misnomer:
    weights frozen at 1.0; `Chs ≡ DomWdeg` bit-for-bit).
  - `SolveConfig::backjumping` deleted (CBJ excised with the unified search
    kernel; breaks exhaustive struct literals — spread `..Default::default()`).
  - `SolveConfig::default()` → `Ac3` + `FailFirst` (was ForwardChecking +
    Chronological); behavior-visible for default-config consumers.
  - New: unified search kernel (`solver/search.rs`), GAC-in-AllDifferent
    default-ON (Régin, warm-started incremental matching; corpus aggregate
    13.36×, nodes 41,807→5,948), restart/nogood substrate (driver deferred),
    typed `CspError` + `py/` module with 4 typed exceptions, `cancel` +
    `node_budget` + `optimization_mode` on `SolveConfig`, zero-alloc hot path,
    release-guarded `BitsetDomain` 0..128 invariant, Futoshiki generation +
    `FutoshikiPuzzle::from_parts` validation, crate-owned embedded puzzle data
    (`include_dir!`), `AssignmentError::BudgetExceeded`.
  - Excised: `min_conflicts` local search, `CardinalityConstraint`,
    `ConstraintEnum::Lambda` (zero construction sites), CLI-format fixtures.
  - Soundness: the AC-3 `Unsatisfiable` trail-push fix (false-UNSAT 26/113→0/113);
    lattice AC-3 termination fix (default revise honors `prune`'s bool);
    parity matrix 170 rows, 0 completeness violations; solution-set invariance
    + 11 restart/nogood canaries standing guard.

### npm

- **`@mkbabb/csp-solver-wasm@0.2.0`** — split surface: lean sudoku+futoshiki
  deploy artifact (87,853 B raw under `--profile wasm-release
  --no-default-features`) vs the `full-mirror` feature (generic `Csp` mirror,
  `solveAssignmentCop`). Flat-index `Uint32Array` wires with seeded RNG; coded
  errors (`BUDGET_EXCEEDED` vs `UNSAT` distinguishable); `MRV` on the wire;
  vestigial `backjumping` removed; hardened difficulty-parity contract tests.

## 0.1.0 — 2026-05-28 (first publish)

First registry publish of the workspace.

### crates.io

- **`csp-solver@0.1.0`** — generic constraint satisfaction problem solver: chronological
  backtracking + conflict-directed backjumping, AC-3 + AC-FC propagation, GAC
  all-different (Regin 1994), min-conflicts local search, bitset + finite + lattice
  domains. Cargo.toml carries the crates.io-mandatory `description` + `license = "MIT"`
  + `repository` fields.
- **`morph-core@0.1.0`** — form alignment + landmark matching primitives, built on
  `csp-solver`. Depended on `csp-solver` via a registry version pin alongside the
  workspace-internal path (`csp-solver = { version = "0.1.0", path = ".." }`); the
  path resolved local builds, the version resolved the crates.io edge. _Excised to
  [`mkbabb/morph`](https://github.com/mkbabb/morph); `0.2.0` onward ships from there._

### npm (@mkbabb scope)

- **`@mkbabb/csp-solver-wasm@0.1.0`** — wasm-pack-emitted bindings for `csp-solver`.
  Published under the `@mkbabb/*` scope; emitted JS surface is `csp_solver_wasm.{js,d.ts,_bg.wasm}`.
- **`@mkbabb/morph@0.1.0`** — wasm-pack-emitted bindings for `morph-core`. The
  underlying Rust crate is named `morph`; the emitted JS surface is
  `morph.{js,d.ts,_bg.wasm}`. Consumed by bbnf-buddy through the npm registry.
  _Excised to [`mkbabb/morph`](https://github.com/mkbabb/morph); `0.2.0` onward
  ships from there. (`0.1.1` — the next patch — was the last release from this repo.)_
