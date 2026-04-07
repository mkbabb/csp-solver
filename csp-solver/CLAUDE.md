# csp-solver — Rust Crate

Generalized CSP (Constraint Satisfaction Problem) solver. Edition 2024, nightly toolchain. Optional PyO3 bindings (`#[cfg(feature = "py")]`).

## Module Structure

```
src/
├── lib.rs                  Csp<D>, SolveConfig, Pruning, PropagationStrategy, SolveStats, Unsatisfiable
├── constraint/
│   ├── traits.rs           Constraint trait, VarId (u32), Revision
│   ├── not_equal.rs        NotEqual — binary inequality
│   ├── all_different.rs    AllDifferent — n-ary all-different
│   ├── lambda.rs           LambdaConstraint — generic closure-based
│   ├── dispatch.rs         ConstraintEnum — devirtualized enum dispatch (NotEqual | AllDifferent | Custom)
│   └── mod.rs
├── domain/
│   ├── traits.rs           Domain trait (iter(), remove(), contains(), len(), is_empty()), LatticeDomain trait
│   ├── bitset.rs           BitsetDomain (u128), BitsetIter (zero-alloc trailing_zeros iteration)
│   ├── finite.rs           FiniteDomain<T> — generic HashSet-backed domain
│   ├── lattice.rs          BitsetLatticeDomain — Domain + LatticeDomain (meet/join/bottom/top)
│   └── mod.rs
├── solver/
│   ├── ac3.rs              AC-3 bitset worklist propagation (ac3_full, ac3_from)
│   ├── backtrack.rs        Chronological backtracking search (BacktrackConfig, Solution)
│   ├── backjump.rs         Conflict-directed backjumping (BackjumpConfig)
│   ├── propagate.rs        Forward checking, AC-FC hybrid
│   ├── monotonic.rs        Fixed-point sweep over all constraints (propagate_monotonic)
│   ├── gac_alldiff.rs      GAC all-different (Regin 1994) — Hopcroft-Karp + Tarjan SCC
│   ├── local_search.rs     Min-conflicts hill-climbing
│   ├── nogoods.rs          Bounded nogood store with LRU eviction
│   └── mod.rs
├── puzzles/
│   ├── sudoku/
│   │   ├── csp.rs          create_sudoku_csp(), solve with initial propagation
│   │   ├── generate.rs     generate_board(), generate_board_with_templates() (hole-digging + templates)
│   │   ├── transform.rs    Symmetry transforms (digit/row/col/band/stack permutation + transpose)
│   │   ├── rng.rs          Lightweight PRNG (no external dep)
│   │   └── mod.rs
│   ├── futoshiki/
│   │   ├── csp.rs          create_futoshiki_csp(), solve_futoshiki(), FutoshikiPuzzle
│   │   └── mod.rs
│   └── mod.rs
├── adjacency.rs            Flat arena storage — Vec<u32> pool + offset/len per variable
├── ordering.rs             Chronological, FailFirst (MRV), DomWdeg (failure-driven)
├── variable.rs             Variable<D> with prune/restore undo log
└── py.rs                   PyO3 bindings (#[cfg(feature = "py")]), module name: csp_solver
```

## Public API

### `Csp<D: Domain>`

Core solver struct. Generic over domain type.

**Construction:**
- `add_variable(domain) -> VarId`
- `add_variables(domain, count) -> Vec<VarId>`
- `add_not_equal(x, y)` — devirtualized fast path
- `add_all_different(vars)` — devirtualized fast path
- `add_equals(var, value)` — lambda constraint
- `add_less_than(x, y)` — lambda constraint
- `add_greater_than(x, y)` — lambda constraint
- `add_constraint(impl Constraint)` — boxed Custom variant
- `add_constraint_enum(ConstraintEnum)` — direct enum insertion

**Solving:**
- `finalize()` — build adjacency graph + constraint weights. Required before `solve()`.
- `propagate()` — auto-selects: AC-3 if `finalize()` called, sweep otherwise.
- `propagate_with(PropagationStrategy)` — explicit strategy selection.
- `solve(config) -> Vec<Solution>` — backtracking/backjumping search. Requires `finalize()`.
- `solve_with_given(config, given) -> Vec<Solution>` — pre-assign values, propagate, then search.
- `stats() -> &SolveStats`

### Configuration Types

- `SolveConfig` — pruning, ordering, max_solutions, backjumping
- `Pruning` — None, ForwardChecking, Ac3, AcFc
- `Ordering` — Chronological, FailFirst, DomWdeg
- `PropagationStrategy` — Auto, Ac3, Sweep

## BBNF Usage

All IR passes in bbnf-lang call `csp.propagate()` without `finalize()` — auto-selects sweep strategy. Lattice domains:

- `CharSetDomain` — FIRST/FOLLOW set computation (128-bit charset)
- `BoolDomain` — span eligibility, nullable analysis
- `TypeDomain` — type inference
- `DispatchDomain` — dispatch table generation
- `RewriteDomain` — regex algebra optimization

These are defined in bbnf-lang, not in this crate. They implement `Domain` (and sometimes `LatticeDomain`).

## Build

```bash
cargo test                              # 83 tests
cargo bench                             # Criterion: sudoku, queens, map_coloring, lattice
maturin develop --release --features py # Build PyO3 wheel into active venv
```

## Tests

83 tests across 7 files in `tests/`:
- `solver.rs` — core CSP ops, pruning strategies, AC-3, backjumping
- `sudoku.rs` — sudoku creation, solving, generation, transforms
- `lattice.rs` — BitsetLatticeDomain, monotonic propagation
- `gac.rs` — GAC all-different correctness
- `futoshiki.rs` — futoshiki creation + solving
- `local_search.rs` — min-conflicts
- `nogoods.rs` — nogood store

Zero inline tests — all tests live in `tests/`.

## Benchmarks

Criterion benchmarks in `benches/`:
- `sudoku.rs` — solve 9x9 easy/medium/hard
- `queens.rs` — N-queens (8, 12)
- `map_coloring.rs` — Australia map coloring
- `lattice.rs` — lattice domain propagation

Examples in `examples/`:
- `profile_csp.rs` — profiling target
- `profile_sudoku.rs` — sudoku profiling target
- `time_sudoku.rs` — wall-clock timing
