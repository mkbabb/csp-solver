# Changelog

This workspace ships two publishable artifacts across two registries:

- `csp-solver` — the CSP solver crate (crates.io)
- `@mkbabb/csp-solver-wasm` — wasm-pack bindings for `csp-solver` (npm)

**Excised (W11/W12):** `morph-core` (crates.io) and `@mkbabb/morph` (npm) moved
to [`github.com/mkbabb/morph`](https://github.com/mkbabb/morph) at commit
`4568dc7e` (tag `pre-morph-excision`). Their `0.1.0` entries below stay as
historical record — they really did ship from this repo — but everything past
`morph-core 0.1.0` / `@mkbabb/morph 0.1.1` lives in that repo's changelog. The
general-purpose `csp_solver::assignment()` / `AssignmentBuilder` surface morph
was built on stays here; `morph` now consumes it as an ordinary crates.io
dependency (`csp-solver = "0.2"`).

## 0.5.0 — 2026-07-13 (tranche-4, W6 — generation truth: futoshiki difficulty axis)

_Staged, unpublished — the team lead owns the crates.io/`file:`-link publish._

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
- **Solver micro-rows (W6 lane L4, output-identical)** — the §7 perf-audit rows,
  each gated on byte-identical dealt boards and solve traces:
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

### npm

- **`@mkbabb/csp-solver-wasm@0.4.0 → 0.5.0`** — **BREAKING**. `generateFutoshiki`
  gains a `difficulty` argument: `generateFutoshiki(boardSize, seed)` →
  `generateFutoshiki(boardSize, difficulty, seed)`, mirroring
  `generateSudoku(n, difficulty, seed)`. New `FutoshikiDifficulty`
  (`Easy`/`Medium`/`Hard`) enum export. The frontend Worker call-site is updated
  in the same tranche (W6 lane L3). Minor bump encodes the breaking signature
  change across the 0.x minor slot.

### npm

- **`@mkbabb/csp-solver-wasm@0.2.0 → 0.4.0`** — **BREAKING**. The `full-mirror`
  feature and its `isomorphic` module are excised; the published `.d.ts` drops
  `Csp`, `SolveConfig`, `SolveStats`, `OptimizationMode`, `Ordering`,
  `PropagationStrategy`, `Pruning` (the generic py-mirror surface — 7 exports).
  The shipped surface is now the purpose-built `sudoku` + `futoshiki` +
  `assignment` layers only. No in-repo consumer is affected — the frontend
  Worker imports `solveSudoku` / `solveFutoshiki` / `generate*` /
  `solveAssignmentCop` only, never the isomorphic classes; the lean deploy build
  never compiled the isomorphic surface, and its bytes are byte-identical
  pre/post. The `0.4.0` minor bump both encodes the breaking removal across the
  0.x minor slot and aligns the package to the core crate's `0.4.0` surface.

## 0.3.0 — 2026-07-10 (tranche-2, W3 — substrate excision)

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

## 0.2.0 — 2026-07-06 (grand-uplift tranche, W1–W12)

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

## 0.1.0 — 2026-05-28 (G.W5 — first publish)

First registry publish of the workspace, landed as part of the muster tranche G
release-engineering wave (G.W5 sub-wave A, CSC411-fold pass).

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
