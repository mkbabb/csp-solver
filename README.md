# csp-solver

Generalized constraint satisfaction problem solver in Rust, compiled to a native
Python module via PyO3. Ships with a full-stack Sudoku + Futoshiki web app.

**Demo**: [sudoku.babb.dev](https://sudoku.babb.dev)

## Features

- **Rust CSP kernel** with PyO3 bindings—drop-in replacement for the Python solver
- **BitsetDomain**: u128 bitmask, O(1) membership/removal/iteration via popcount
- **GAC AllDifferent**: Regin's algorithm (Hopcroft-Karp matching + Tarjan SCC pruning)
- **Conflict-directed backjumping** with bounded nogood learning (LRU eviction)
- **Min-conflicts local search** for large-neighborhood problems
- **Lattice domains** with monotonic fixed-point propagation (no search required)
- **ConstraintEnum**: devirtualized dispatch for NotEqual/AllDifferent—zero vtable overhead
- **Sudoku generation**: sub-millisecond via pre-computed templates + random symmetry transforms

## Quickstart

```bash
docker compose up
```

Backend on `:8000`, frontend on `:3000`.

### Manual

```bash
# Backend (Python + native Rust module)
cd python && uv sync
cd ../csp-solver && maturin develop --release --features py
cd ../python && uv run uvicorn csp_solver_py.api.main:app --reload --port 8000

# Frontend
cd frontend && npm install && npm run dev
```

### Production

```bash
docker compose -f docker-compose.prod.yml up
```

Nginx reverse proxy on `:80`. The Docker build is multi-stage: Rust nightly
toolchain compiles the csp-solver crate, maturin packages it as a wheel, and the
final image installs the wheel into a slim Python 3.13 environment.

## Performance

Solve times on 9x9 Sudoku (FC + FailFirst, single solution). Rust vs. pure Python
on the same machine:

| Puzzle         | Rust     | Python   | Speedup |
|----------------|----------|----------|---------|
| Al Escargot    | 0.36 ms  | 11.5 ms  | 32x     |
| Golden Nugget  | 6.2 ms   | 347 ms   | 56x     |
| Inkala         | 0.52 ms  | 29.6 ms  | 57x     |

Generation (9x9, template fast path): < 1 ms per board. The symmetry group for
N=3 templates yields ~1.22 billion distinct grids per base template—digit
permutation, row/column permutation within bands/stacks, band/stack permutation,
and transposition.

## Architecture

```
Browser  <-->  Nginx (:80)  <-->  Frontend (Vue 3, :3000)
                             <-->  Backend  (FastAPI, :8000)
                                     └── csp_solver (native Rust module via PyO3)
```

The Rust crate is the solver. Python wraps it with FastAPI routes and
pre-computed puzzle template management. The frontend renders everything
as hand-drawn SVG—Rough.js decorative elements, path-based line boil on
the grid, custom glyphs with draw-in animations, and a crayon aesthetic
throughout.

## CSP Solver API

The core type is `Csp<D: Domain>`, generic over any domain implementation.

```rust
use csp_solver::{Csp, SolveConfig, Pruning};
use csp_solver::domain::bitset::BitsetDomain;
use csp_solver::ordering::Ordering;

let mut csp = Csp::new();

// Variables with domains {1, 2, 3}
let vars = csp.add_variables(&BitsetDomain::new(1..=3), 3);

// Pairwise not-equal (map coloring, etc.)
csp.add_not_equal(vars[0], vars[1]);
csp.add_not_equal(vars[1], vars[2]);

// N-ary all-different (GAC-propagated)
csp.add_all_different(vars.clone());

csp.finalize();

let config = SolveConfig {
    pruning: Pruning::Ac3,
    ordering: Ordering::FailFirst,
    max_solutions: 1,
    backjumping: false,
};

let solutions = csp.solve(&config);
```

### Pruning

| Variant           | Description                                   |
|-------------------|-----------------------------------------------|
| `None`            | Pure backtracking, no pruning                 |
| `ForwardChecking` | Prune neighbors of the assigned variable      |
| `Ac3`             | Maintaining Arc Consistency after each assign  |
| `AcFc`            | AC + forward checking hybrid                  |

### Variable Ordering

| Variant        | Description                                       |
|----------------|---------------------------------------------------|
| `Chronological`| Variables in stack order                           |
| `FailFirst`    | MRV—smallest domain first                         |
| `DomWdeg`      | Smallest domain/weighted-degree ratio              |

### Propagation Strategy

| Variant | Description                                              |
|---------|----------------------------------------------------------|
| `Auto`  | AC-3 if `finalize()` was called, sweep otherwise         |
| `Ac3`   | AC-3 worklist with adjacency graph                       |
| `Sweep` | Fixed-point sweep over all constraints (lattice domains) |

Also: `add_equals`, `add_less_than`, `add_greater_than`, and arbitrary
closures via `add_constraint(impl Constraint<D>)`.

The PyO3 module (`from csp_solver import Csp, Pruning, Ordering, SolveConfig`)
mirrors the Rust API. Built with `maturin develop --release --features py`.

## Puzzles

### Sudoku

Supports arbitrary subgrid sizes. The solver handles 4x4 (N=2), 9x9 (N=3),
16x16 (N=4), and 25x25 (N=5). The web UI exposes N=2, 3, and 4.

Board generation uses two paths:
1. **Fast path** — random template + symmetry transform. O(M^2) per transform, no search.
2. **Slow path** — generate a complete solution, dig holes with uniqueness verification, calibrate difficulty by backtrack count.

Difficulty calibration (FC + FailFirst backtrack count):
- **Easy**: 0 backtracks (propagation alone)
- **Medium**: < 50 backtracks
- **Hard**: > 100 backtracks

### Futoshiki

Latin-square puzzle with inequality constraints between adjacent cells.
Modeled as AllDifferent per row/column plus LessThan constraints from the
inequality annotations.

## Project Structure

```
CSC411_HW2_ProgrammingQuestion/
├── Cargo.toml                  # workspace root
├── csp-solver/                 # Rust crate
│   ├── Cargo.toml
│   ├── pyproject.toml          # maturin config
│   ├── src/
│   │   ├── lib.rs              # Csp<D>, SolveConfig, Pruning, PropagationStrategy
│   │   ├── py.rs               # PyO3 bindings (#[cfg(feature = "py")])
│   │   ├── constraint/         # Constraint trait, NotEqual, AllDifferent, Lambda, ConstraintEnum
│   │   ├── domain/             # Domain trait, BitsetDomain, FiniteDomain, LatticeDomain
│   │   ├── solver/             # ac3, backtrack, backjump, propagate, monotonic, gac_alldiff, local_search, nogoods
│   │   ├── puzzles/            # sudoku/ (csp, generate, transform, rng), futoshiki/
│   │   ├── adjacency.rs        # constraint-variable adjacency graph
│   │   ├── ordering.rs         # Chronological, FailFirst, DomWdeg
│   │   └── variable.rs         # Variable<D> with domain + undo log
│   ├── benches/                # criterion: sudoku, queens, map_coloring, lattice
│   ├── tests/                  # 83 tests: solver, sudoku, lattice, gac, futoshiki, local_search, nogoods
│   └── examples/               # profile_csp, profile_sudoku, time_sudoku
├── python/                     # FastAPI backend
│   ├── Dockerfile              # multi-stage: Rust nightly → maturin → wheel → slim runtime
│   ├── pyproject.toml          # uv/hatchling, ruff, mypy, pytest
│   ├── src/csp_solver_py/
│   │   ├── api/                # FastAPI routes + Pydantic models
│   │   ├── solver/             # Python CSP implementation (isomorphic to Rust)
│   │   └── data/               # pre-computed puzzle templates + solution banks
│   └── tests/                  # 107 tests: solver, api, benchmarks, stress, rust backend
├── frontend/                   # Vue 3 + TypeScript + Tailwind
│   └── src/
│       ├── components/         # game + decorative components
│       ├── composables/        # state, API, theme, line boil
│       └── lib/                # PRNG, grid paths, glyphs, scribble fill, shapes
├── nginx/                      # reverse proxy config
│   └── sudoku.conf
├── scripts/                    # deploy.sh, dev.sh
├── docker-compose.yml          # dev: backend + frontend
└── docker-compose.prod.yml     # prod: backend + frontend + nginx
```

## Development

### Tests

```bash
# Rust (83 tests)
cd csp-solver && cargo test

# Python (107 tests)
cd python && uv run pytest
```

### Benchmarks

```bash
cd csp-solver && cargo bench
```

Criterion benchmarks cover Sudoku (9x9 hard puzzles), N-Queens, map coloring,
and lattice propagation.

### Profiling

```bash
cd csp-solver && cargo build --release --example profile_sudoku
samply record ./target/release/examples/profile_sudoku
```

### Building the Native Module

```bash
cd csp-solver
PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 maturin develop --release --features py
```

This installs `csp_solver` into the active Python environment. The backend
auto-detects the native module and falls back to pure Python if it's absent.

## BBNF Integration

The csp-solver crate is used as a dependency in the
[bbnf-lang](https://github.com/mkbabb/bbnf-lang) grammar compiler, where
constraint propagation replaces hand-rolled fixed-point loops for several
analysis passes. Each pass defines a lattice domain and expresses inter-rule
dependencies as constraints, then calls `propagate()` to reach the fixed point.

| Pass               | Domain            | What it computes                           |
|--------------------|-------------------|--------------------------------------------|
| Type inference     | `TypeDomain`      | Projected types for each grammar rule      |
| FIRST sets         | `CharSetDomain`   | Leading character sets (u128 bitmask)      |
| FOLLOW sets        | `CharSetDomain`   | Trailing character sets                    |
| Span eligibility   | `BoolDomain`      | Whether a rule can use span-only codegen   |
| Dispatch tables    | `DispatchDomain`  | Constant-time alternation selection by byte|
| Regex algebra      | `RewriteDomain`   | Regex pattern simplification/fusion        |

All six use `LatticeDomain` + monotonic propagation (`PropagationStrategy::Sweep`).
Domains only grow via `join`; no backtracking search is needed. The solver
converges in 2--4 iterations for typical grammars.

## Web API

| Method | Path                                   | Purpose              |
|--------|----------------------------------------|----------------------|
| GET    | `/api/v1/board/random/{size}/{difficulty}` | Generate random board |
| POST   | `/api/v1/board/solve`                  | Solve input board    |
| GET    | `/api/v1/health`                       | Health check         |

## Sources

- Regin, J.-C. (1994). "A filtering algorithm for constraints of difference in CSPs."
  *Proceedings of the 12th National Conference on Artificial Intelligence (AAAI-94)*, 362--367.
  The AllDifferent GAC propagator: bipartite matching (Hopcroft-Karp) + SCC decomposition
  (Tarjan) to prune values not participating in any maximum matching.

- Mackworth, A. K. (1977). "Consistency in networks of relations."
  *Artificial Intelligence*, 8(1), 99--118. Arc consistency (AC-3) and the
  constraint network formalism.

- Hopcroft, J. E. & Karp, R. M. (1973). "An n^(5/2) algorithm for maximum
  matchings in bipartite graphs." *SIAM Journal on Computing*, 2(4), 225--231.

- Tarjan, R. E. (1972). "Depth-first search and linear graph algorithms."
  *SIAM Journal on Computing*, 1(2), 146--160. The SCC algorithm used in
  Regin's AllDifferent filter.

- Boussemart, F., Hemery, F., Lecoutre, C., & Sais, L. (2004). "Boosting
  systematic search by weighting constraints." *Proceedings of the 16th European
  Conference on Artificial Intelligence (ECAI-04)*, 146--150. The dom/wdeg
  variable ordering heuristic.

- Minton, S., Johnston, M. D., Philips, A. B., & Laird, P. (1992). "Minimizing
  conflicts: a heuristic repair method for constraint satisfaction and scheduling
  problems." *Artificial Intelligence*, 58(1--3), 161--205. Min-conflicts local
  search.
