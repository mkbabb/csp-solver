# csp-solver

Generic constraint-satisfaction solver in Rust, with WebAssembly and PyO3
bindings. Unified backtracking search, AC-3 and AC-FC propagation, GAC
all-different (Régin 1994, default-ON), branch-and-bound cost optimization, over
bitset / finite / cost-finite / lattice domains. It's the sole solver in this
workspace — the optional PyO3 (`feature = "py"`) and wasm bindings wrap this
core, they don't mirror a separate implementation.

The workspace has two members, `csp-solver` and `csp-solver/wasm`, publishing to
two registries:

| Artifact | Registry | Role |
| --- | --- | --- |
| `csp-solver` | crates.io | the CSP solver crate |
| `@mkbabb/csp-solver-wasm` | npm | wasm-pack bindings for `csp-solver` |

`morph-core` (crates.io) and `@mkbabb/morph` (npm) once shipped from here; they
were excised to [github.com/mkbabb/morph](https://github.com/mkbabb/morph). The
pre-deletion state is tagged `pre-morph-excision`; the general-purpose
`AssignmentBuilder` surface morph was built on stays here, and morph now consumes
`csp-solver` as an ordinary crates.io dependency. See `CHANGELOG.md`.

The workspace source and crates.io are both at `0.3.0` — published. Edition 2024,
stable toolchain (MSRV 1.88).

## Install

```toml
# Rust — Cargo.toml
[dependencies]
csp-solver = "0.3"
```

```bash
# JavaScript / TypeScript
npm install @mkbabb/csp-solver-wasm
```

## Usage

```rust
use csp_solver::{Csp, SolveConfig};

let mut csp = Csp::new();
// declare variables + domains, push constraints, finalize, then solve:
csp.finalize();
let solutions = csp.solve(&SolveConfig::default());
```

`@mkbabb/csp-solver-wasm` exposes the same core to JS — it ships the Sudoku and
Futoshiki solve surfaces plus the assignment COP entry point. The emitted JS
entry point is `csp_solver_wasm.js`. See [`wasm/README.md`](./wasm/README.md).

## Public API

### `Csp<D: Domain>`

Core solver struct, generic over domain type.

**Construction** (`csp/mod.rs`): `add_variable(domain)`,
`add_variables(domain, count)`, `add_not_equal`, `add_all_different`,
`add_equals`, `add_less_than`, `add_greater_than`,
`add_constraint(impl Constraint)`, `add_constraint_enum(ConstraintEnum)`.

**Solving** (`csp/solve.rs`):
- `finalize()` — build the adjacency graph + constraint weights. Required before `solve()`.
- `propagate()` — auto-selects AC-3 when `finalize()` ran, the monotonic sweep otherwise.
- `propagate_with(PropagationStrategy)` — explicit strategy.
- `solve(config) -> Vec<Solution>` — backtracking search. Requires `finalize()`.
- `solve_with_given(config, given)` — pre-assign, propagate, then search.
- `solve_optimized(config)` — branch-and-bound for `CostDomain` (COP).
- `stats() -> &SolveStats`.

### Configuration types (`config.rs`)

- `SolveConfig` — `pruning`, `ordering`, `max_solutions`, `optimization_mode`,
  `node_budget`, `cancel`. `default()` is `Ac3` + `FailFirst`,
  `max_solutions = 1`, `node_budget = Some(1_000_000)`.
- `Pruning` — `None`, `ForwardChecking`, `Ac3` (MAC), `AcFc` (FC + singleton propagation).
- `Ordering` — `Chronological`, `FailFirst` (MRV), `Mrv` (domain-size / Σ weights;
  weights frozen at 1.0, so a static heuristic — the old `DomWdeg` name was a
  proven misnomer).
- `PropagationStrategy` — `Auto`, `Ac3`, `Sweep`.
- `OptimizationMode` — `Feasibility`, `MinimizeCost`.

### `max_solutions = 1` semantics

`max_solutions = 1` is a satisfiability probe. On a multi-solution instance, the
specific first solution returned under `Pruning::Ac3` is trajectory-dependent —
different pruning/ordering combinations may return different valid members of the
solution set. Each is a genuine member (proven for `futoshiki_constr` in
`kernel-soundness-closure.md`), but callers must not depend on *which* one. Only
enumerate-all (`max_solutions = usize::MAX`) has a defined, pruning-invariant set.

### GAC posture

GAC all-different (Régin 1994) is default-ON for any `AllDifferent` with at least
`GAC_MIN_PARTICIPANTS = 3` live participants (`solver/gac/mod.rs`); a
`GAC_IN_ALLDIFF_ENABLED` atomic toggles it. It's a net win on the sudoku corpus
but not uniformly — 3 of 5 named hard 9×9 boards run 1.8–3.3× slower with it on.
Stamped tables live in [`../docs/benchmarks.md`](../docs/benchmarks.md).

### Difficulty casing

`Difficulty` has one canonical native enum — PascalCase Rust (`Easy`/`Medium`/
`Hard`) in `src/puzzles/sudoku/generate.rs`. The wire format is SCREAMING_SNAKE
(`EASY`/`MEDIUM`/`HARD`): every cross-language mirror (PyO3, the frontend TS
union) spells it verbatim. `tests/difficulty_parity.rs` guards both facts — it
walks `SCAN_ROOTS`, greps for any Difficulty-shaped declaration, and asserts the
discovered set is exactly the `SIBLING_DEFINITIONS` allowlist, so a new mirror
fails the test until it's registered.

## Structure

```
src/
├── lib.rs                  crate root — module decls + re-exports
├── config.rs               Pruning, PropagationStrategy, OptimizationMode, SolveConfig, SolveStats, Csp<D>
├── cancel.rs               CancelToken — cooperative cancellation handle
├── bitscan.rs              pub(crate) bit-scan primitive (shared by domain/bitset + solver/ac3)
├── adjacency.rs            flat-arena adjacency storage — Vec<u32> pool + offset/len per variable
├── ordering.rs             Ordering — Chronological, FailFirst, Mrv
├── variable.rs             Variable<D> with prune/restore undo log
├── error.rs                CspError — the typed error family, stable code()
├── csp/
│   ├── mod.rs              builder surface — add_variable(s), add_*, finalize
│   └── solve.rs            propagate/solve dispatch into the search kernel; Unsatisfiable
├── constraint/
│   ├── traits.rs           Constraint trait, VarId (u32), Revision
│   ├── not_equal.rs        NotEqual — binary inequality
│   ├── all_different.rs    AllDifferent — n-ary; GAC entry point (Régin 1994)
│   ├── all_different_except.rs  AllDifferentExcept — sentinel-aware all-different (assignment COP)
│   ├── implication.rs      ImplicationConstraint
│   ├── lambda.rs           LambdaConstraint — generic closure-based
│   ├── scratch.rs          pub(crate) reusable scratch buffers for propagators
│   ├── dispatch.rs         ConstraintEnum — devirtualized dispatch (NotEqual, AllDifferent, AllDifferentExcept, boxed Custom)
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
│   ├── optimize.rs         branch-and-bound hooks (bound-prune / value-order / leaf)
│   ├── gac/
│   │   ├── mod.rs          GAC all-different core — incremental Régin, warm-started matching cache
│   │   └── matching.rs     Hopcroft-Karp + Tarjan SCC primitives
│   └── mod.rs
├── builder/
│   ├── assignment.rs       AssignmentBuilder — bipartite assignment COP; Pruning::Ac3
│   └── mod.rs
├── puzzles/
│   ├── sudoku/             csp.rs, generate.rs (template bank via include_dir!), transform.rs, rng.rs, mod.rs
│   ├── futoshiki/          csp.rs, generate.rs, mod.rs
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
data/sudoku_puzzles/{N}/{difficulty}/  template bank, embedded at build (include_dir!) — N=3-hard + N=4 sparse, 32,533 B
```

`0.3.0` retired the deferred restart / nogood / conflict-history substrate and
the soft-constraint module — dead code never wired to the unified kernel.
Conflict-directed backjumping went with the kernel unification (the old
`backtrack.rs`/`backjump.rs`).

## BBNF Integration

bbnf-lang vendors `csp-solver` as a byte-identical copy pinned at a rev, kept
honest by an enforced-compile sync gate (`sync-csp-solver-vendor.sh --verify`,
in bbnf-lang) that builds the vendored crate under both cfg branches plus
trait-surface and `SolveConfig`/`SolveStats` field-add tripwires. bbnf drives its
lattice domains through `csp.propagate()` — no `finalize()`, so the sweep
strategy auto-selects. Its domains (defined in bbnf-lang, not here) —
`CharSetDomain`, `BoolDomain`, `TypeDomain`, `DispatchDomain`, `RewriteDomain` —
each implement `Domain`, some `LatticeDomain`. See
[`../docs/bbnf-integration.md`](../docs/bbnf-integration.md).

## Build & Test

```bash
cargo test --workspace                     # 151 passed, 0 failed, 6 ignored — 18 test binaries (measured at 3b75eca2, Apple M5 Max, 2026-07-10)
cargo bench                                # criterion — see below
maturin develop --release --features py    # build the PyO3 wheel (Python ≤3.13)
RUSTDOCFLAGS='-A rustdoc::private_intra_doc_links' cargo doc --document-private-items  # internal-doc build (public `cargo doc` is pre-broken; the linked items are internal modules)
```

Regenerate the embedded sudoku template bank, then rebuild the wheel to re-embed
via `include_dir!`:

```bash
cargo run --release --example generate_templates -- <N> <difficulty> <count>
```

**Tests** live in `tests/` (blackbox integration, one file per concern) and
`tests-py/` (the installed-wheel pytest suite: 27 passed, 2 skipped — 27/0 post-W4). There are
**no** inline `#[cfg(test)]` modules — the whitebox exception is revoked; every
check is blackbox against the public surface.

**Benches** (`benches/`, criterion): `assignment`, `cost_finite_domain`,
`iai_queens`, `lattice`, `map_coloring`, `queens`, `sudoku`. The queens bench
embeds ground-truth `assert_eq!` counts (92 / 14200) that run only under
`cargo bench -p csp-solver --bench queens -- --test` — the CI queens smoke lane.
`iai_queens` is the deterministic instruction-count baseline (Linux/CI only —
Valgrind can't run on arm64-macOS).

**Examples** (`examples/`): `alloc_count`, `gac_ab_corpus`, `generate_templates`,
`parity_probe`, `probe_futoshiki_gen`, `profile_csp`, `profile_sudoku`,
`time_sudoku`, `verify_bank_uniqueness`.

**Contributor flow**: branch off the default branch; make the change plus tests
(and a bench for any new solver strategy); ensure `cargo test --workspace` exits
0; open the PR — CI runs the same gates. The solver's behavior is the single
source of truth: the wasm + PyO3 bindings mirror it rather than reimplementing
logic, and `CHANGELOG.md` is updated whenever crate source or `Cargo.toml`
changes. Never `cargo publish` or `npm publish` from a dev machine — publication
belongs to CI on tag.

## Conventions

Edition 2024, stable toolchain. `cargo test --workspace`, never per-crate. Any
`SolveConfig`/`SolveStats` field change sweeps exhaustive literals or uses
`..Default::default()` (the bbnf sync gate has a field-add tripwire). The
`Difficulty` casing policy is contract-tested (`tests/difficulty_parity.rs`). The
puzzle template bank is crate-owned (`data/sudoku_puzzles/`), embedded via
`include_dir!`; the frontend derives its SPA templates from that single source.

## Documentation

Algorithms, sudoku formulation, benchmarks, and the bbnf integration live under
[`../docs/`](../docs/). The README shape follows the perimeter-level
[canonical README shape](../docs/precepts/canonical-readme-shape.md).

## License

[MIT](./LICENSE) © 2026 Mike Babb.
