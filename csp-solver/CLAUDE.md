# csp-solver — Rust Crate

Generalized CSP (Constraint Satisfaction Problem) solver. Edition 2024, nightly
toolchain. `0.2.0` on crates.io. The sole solver in this workspace — the optional
PyO3 (`feature = "py"`) and wasm bindings wrap this core, they don't mirror a
separate implementation.

The workspace has two members: `csp-solver` and `csp-solver/wasm`
(`@mkbabb/csp-solver-wasm`, 0.2.0 on npm). `morph-core`/`wasm-morph` were excised
to [github.com/mkbabb/morph](https://github.com/mkbabb/morph); the pre-deletion
state is tagged `pre-morph-excision`.

## Module Structure

```
src/
├── lib.rs                  crate root — module decls + re-exports
├── config.rs               Pruning, PropagationStrategy, OptimizationMode, SolveConfig, SolveStats, Csp<D>
├── csp/
│   ├── mod.rs              builder surface — add_variable(s), add_*, finalize
│   └── solve.rs            propagate/solve dispatch into the search kernel; Unsatisfiable
├── error.rs                CspError — the typed error family (whitebox #[cfg(test)], see Tests)
├── cancel.rs               CancelToken — cooperative cancellation handle
├── bitscan.rs              pub(crate) bit-scan primitive (shared by domain/bitset + solver/ac3)
├── adjacency.rs            flat-arena adjacency storage — Vec<u32> pool + offset/len per variable
├── ordering.rs             Ordering — Chronological, FailFirst, Mrv, Chs
├── variable.rs             Variable<D> with prune/restore undo log
├── constraint/
│   ├── traits.rs           Constraint trait, VarId (u32), Revision
│   ├── not_equal.rs        NotEqual — binary inequality
│   ├── all_different.rs    AllDifferent — n-ary; GAC entry point (Régin 1994)
│   ├── all_different_except.rs  AllDifferentExcept — sentinel-aware all-different (assignment COP)
│   ├── implication.rs      Implication
│   ├── soft.rs             soft/weighted constraint (COP objective term)
│   ├── lambda.rs           LambdaConstraint — generic closure-based
│   ├── dispatch.rs         ConstraintEnum — devirtualized enum dispatch
│   └── mod.rs
├── domain/
│   ├── traits.rs           Domain, LatticeDomain, CostDomain traits
│   ├── bitset.rs           BitsetDomain (u128) + BitsetIter (zero-alloc trailing_zeros)
│   ├── finite.rs           FiniteDomain<T> — generic HashSet-backed
│   ├── cost_finite.rs      CostFiniteDomain — costed values for COP
│   ├── lattice.rs          BitsetLatticeDomain — Domain + LatticeDomain (meet/join/bottom/top)
│   └── mod.rs
├── solver/
│   ├── search.rs           unified backtracking search kernel + branch/bound policies
│   ├── ac3.rs              AC-3 bitset worklist propagation (ac3_full, ac3_from_variable)
│   ├── propagate.rs        forward checking, AC-FC hybrid
│   ├── monotonic.rs        fixed-point sweep over all constraints (lattice domains)
│   ├── gac/
│   │   ├── mod.rs          GAC all-different core — incremental Régin, warm-started matching cache
│   │   └── matching.rs     Hopcroft-Karp + Tarjan SCC primitives
│   ├── restart.rs          Luby restart substrate (driver deferred)
│   ├── heuristic.rs        conflict-history weighting (feeds Chs ordering)
│   ├── nogoods.rs          bounded nogood store with LRU eviction
│   ├── optimize.rs         branch-and-bound hooks (bound-prune / value-order / leaf)
│   └── mod.rs
├── builder/
│   ├── assignment.rs       AssignmentBuilder — bipartite assignment COP; Pruning::Ac3
│   └── mod.rs
├── puzzles/
│   ├── sudoku/
│   │   ├── csp.rs          create_sudoku_csp()
│   │   ├── generate.rs     generate_board(), measure_difficulty(); template bank via include_dir!
│   │   ├── transform.rs    symmetry transforms
│   │   ├── rng.rs          lightweight PRNG (no external dep)
│   │   └── mod.rs
│   ├── futoshiki/
│   │   ├── csp.rs          FutoshikiPuzzle, create_futoshiki_csp(), solve_futoshiki()
│   │   ├── generate.rs     generate_futoshiki(), generate_futoshiki_seeded(), measure_difficulty()
│   │   └── mod.rs
│   └── mod.rs
└── py/                     PyO3 bindings (feature = "py"), module name: csp_solver
    ├── mod.rs              #[pymodule] registration
    ├── enums.rs            Pruning / Ordering / PropagationStrategy + From impls
    ├── config.rs           SolveConfig, SolveStats, CancelToken
    ├── csp.rs              general-purpose Csp pyclass (wraps Csp<BitsetDomain>)
    ├── sudoku_api.rs       SudokuCSP, create_sudoku_csp, solve_sudoku, create_random_board
    ├── futoshiki_api.rs    FutoshikiCSP, create_futoshiki_csp, solve_futoshiki, create_random_futoshiki
    └── errors.rs           typed exceptions — one per CspError variant

wasm/                       csp-solver-wasm crate (@mkbabb/csp-solver-wasm) — see wasm/README.md
data/sudoku_puzzles/{N}/{difficulty}/  template bank, embedded at build time (include_dir!)
```

Excised in `0.2.0`: `min_conflicts` local search, `CardinalityConstraint`,
`ConstraintEnum::Lambda`, and the old `backtrack.rs`/`backjump.rs` (folded into
the unified `solver/search.rs`; CBJ dropped with them).

## Public API

### `Csp<D: Domain>`

Core solver struct, generic over domain type.

**Construction** (`csp/mod.rs`): `add_variable(domain)`, `add_variables(domain,
count)`, `add_not_equal`, `add_all_different`, `add_equals`, `add_less_than`,
`add_greater_than`, `add_constraint(impl Constraint)`,
`add_constraint_enum(ConstraintEnum)`.

**Solving** (`csp/solve.rs`):
- `finalize()` — build adjacency graph + constraint weights. Required before `solve()`.
- `propagate()` — auto-selects AC-3 if `finalize()` ran, sweep otherwise.
- `propagate_with(PropagationStrategy)` — explicit strategy.
- `solve(config) -> Vec<Solution>` — backtracking search. Requires `finalize()`.
- `solve_with_given(config, given)` — pre-assign, propagate, then search.
- `solve_optimized(config)` — branch-and-bound for `CostDomain` (COP).
- `stats() -> &SolveStats`

### Configuration Types (`config.rs`)

- `SolveConfig` — `pruning`, `ordering`, `max_solutions`, `restarts`,
  `optimization_mode`, `node_budget`, `cancel`.
  `default()` is `Ac3` + `FailFirst`, `max_solutions = 1`, `node_budget =
  Some(1_000_000)`.
- `Pruning` — None, ForwardChecking, Ac3, AcFc.
- `Ordering` — Chronological, FailFirst, Mrv, Chs. (`DomWdeg` was a misnomer —
  weights are frozen at 1.0 — and became `Mrv` in `0.2.0`.)
- `PropagationStrategy` — Auto, Ac3, Sweep.
- `OptimizationMode` — Feasibility, MinimizeCost.

### `max_solutions = 1` semantics

`max_solutions = 1` is a satisfiability probe. On a problem with more than one
solution, the specific first solution returned under `Pruning::Ac3` is
trajectory-dependent — different pruning/ordering combinations may return
different valid members of the solution set. It is always a genuine member of
that set (proven for `futoshiki_constr` in `kernel-soundness-closure.md` §2b),
but callers must not depend on *which* one. Only enumerate-all
(`max_solutions = usize::MAX`) has a defined, invariant solution set.

### GAC posture

GAC all-different (Régin 1994) is default-ON for any `AllDifferent` with at least
`GAC_MIN_PARTICIPANTS = 3` live participants (`solver/gac/mod.rs`); a
`GAC_IN_ALLDIFF_ENABLED` atomic toggles it. It's a net win on the 113-board
sudoku corpus — 13.36× aggregate — but not uniformly: 3 of 5 named hard 9×9
boards (Al Escargot, Golden Nugget, Inkala) run 1.3–2.5× slower with it on, and
`al_escargot/ac3_failfirst` carries a ~1.8× criterion delta at identical solve
counts. The N=4 wins (up to 112×) dominate the aggregate; the threshold of 3 is
the measured floor (2–6 sit within ~7%, 9 is ~1.79× worse). Full stamped tables
live in `docs/benchmarks.md`; the disclosure traces to the W2 GAC corpus
(`docs/tranches/2026-07-grand-uplift/waves/W2-gac-search.md`).

## Difficulty casing policy

`Difficulty` has one canonical native enum — PascalCase Rust
(`Easy`/`Medium`/`Hard`) in `src/puzzles/sudoku/generate.rs`. The wire format is
SCREAMING_SNAKE (`EASY`/`MEDIUM`/`HARD`): every cross-language mirror (PyO3,
Pydantic, the frontend TS union) spells it that way verbatim. The one idiomatic
exception is `wasm/src/sudoku.rs::SudokuDifficulty`, which uses PascalCase Rust
identifiers.

`tests/difficulty_parity.rs` guards both facts. Each sibling definition is paired
with an explicit `Casing` (`Verbatim` or `PascalCase`), and
`no_unscanned_difficulty_definitions_exist` walks `SCAN_ROOTS` (`src`,
`wasm/src`, `../web/api/src`, `../web/frontend/src`), greps for any
Difficulty-shaped declaration, and asserts the discovered set is *exactly* the
`SIBLING_DEFINITIONS` allowlist — a new mirror fails the test until it's
registered. **Extension rule:** when a new surface adds a `Difficulty` mirror
(e.g. a Futoshiki-specific frontend package in a fresh root), add its path +
`Casing` to `SIBLING_DEFINITIONS` and, if it lives outside the four roots, add
that root to `SCAN_ROOTS`. A third casing is a one-line addition to
`Casing::expected`.

## BBNF Usage

bbnf-lang vendors `csp-solver` (kept in sync via an enforced-compile gate,
`sync-csp-solver-vendor.sh --verify`) and drives its lattice domains through
`csp.propagate()` — no `finalize()`, so the sweep strategy is auto-selected.
Domains (defined in bbnf-lang, not here): `CharSetDomain` (FIRST/FOLLOW),
`BoolDomain` (span eligibility, nullability), `TypeDomain` (type inference),
`DispatchDomain` (dispatch tables), `RewriteDomain` (regex algebra). Each
implements `Domain`, some `LatticeDomain`.

## Build

```bash
cargo test --workspace                  # 150 passed, 0 failed, 6 ignored
cargo bench                             # criterion: sudoku, queens, map_coloring, lattice, assignment, cost_finite_domain
PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 \
  maturin develop --release --features py   # build the PyO3 wheel (Python ≤3.13)
```

`cargo test --workspace` measured at d9781e29, Apple M5 Max, 2026-07-06.

Regenerate the embedded sudoku template bank:

```bash
cargo run --release --example generate_templates -- <N> <difficulty> <count>
# then rebuild the wheel to re-embed via include_dir!
```

## Tests

Two disciplines, complementary:

- **Blackbox integration** — always in `tests/`, one file per concern:
  `solver`, `sudoku`, `futoshiki`, `lattice`, `gac` (via `all_different_except`),
  `nogoods`, `optimize`, `cost_finite`, `assignment_builder`,
  `assignment_proptest`, `restart_nogood_soundness`, `solution_set_invariance`,
  `difficulty_parity`. Plus `wasm/tests/` (`dualization`, `futoshiki_parity`).
- **Narrow whitebox** — a `#[cfg(test)] mod tests` inline is the sanctioned
  exception for a single private contract, not a substitute for the blackbox
  suite. Two precedents: `error.rs` (the `CspError::code()` string-stability
  invariant + `Unsatisfiable → CspError` conversion) and
  `puzzles/sudoku/generate.rs` (template-bank parsing internals).

## Benchmarks & Examples

Criterion benches in `benches/`: `sudoku`, `queens`, `map_coloring`, `lattice`,
`assignment`, `cost_finite_domain`. The queens bench embeds ground-truth
`assert_eq!` counts (92 / 14200) that only run under `cargo bench --bench queens
-- --test` — the CI queens-bench smoke lane.

Examples in `examples/`: `generate_templates` (the template-bank pipeline),
`time_sudoku`, `profile_csp`, `profile_sudoku`, `alloc_count`, `gac_ab_corpus`,
`parity_probe`, `probe_futoshiki_gen`.
