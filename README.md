# `csp-solver`

Generalized constraint satisfaction problem solver in Rust, compiled to a native Python module via PyO3. Includes a demo, fully-featured, Sudoku application.

Used by the [bbnf-lang](https://github.com/mkbabb/bbnf-lang) grammar compiler for type inference, FIRST/FOLLOW set computation, and dispatch table generation across lattice domains.

**Demo**: [sudoku.babb.dev](https://sudoku.babb.dev)

## Usage

```rust
use csp_solver::{Csp, SolveConfig, Pruning, PropagationStrategy};
use csp_solver::domain::bitset::BitsetDomain;
use csp_solver::ordering::Ordering;

let mut csp = Csp::new();
let domain = BitsetDomain::new(1..=4);
let vars: Vec<_> = (0..4).map(|_| csp.add_variable(domain.clone())).collect();

csp.add_all_different(vars.clone());
csp.add_greater_than(vars[0], vars[1]);

csp.finalize();
let solutions = csp.solve(&SolveConfig {
    pruning: Pruning::Ac3,
    ordering: Ordering::FailFirst,
    max_solutions: 1,
    backjumping: false,
});
```

```python
from csp_solver import Csp, SolveConfig, Pruning, Ordering

csp = Csp()
v0 = csp.add_variable([1, 2, 3, 4])
v1 = csp.add_variable([1, 2, 3, 4])
csp.add_not_equal(v0, v1)
csp.finalize()
solutions = csp.solve(SolveConfig(pruning=Pruning.AC3, ordering=Ordering.FAIL_FIRST))
```

Built with `maturin develop --release --features py`.

## Architecture

`Csp<D: Domain>` is generic over a domain type. The `Domain` trait requires `iter()` as its primary iteration primitive, alongside `remove()`, `add()`, `contains()`, and `singleton_value()`. `BitsetDomain` implements these via a `u128` bitmask—membership, removal, and iteration are all O(1) bitops (`popcount`, `trailing_zeros`, bit-clear).

Constraints are stored as `ConstraintEnum<D>`, a devirtualized enum with variants for `NotEqual`, `AllDifferent`, `Lambda` (closure-based), and `Custom` (boxed trait object). The first two inline their `revise()` and `check()` directly—no vtable dispatch on the hot path.

The adjacency graph maps variables to constraints and constraints to neighbors via a flat `Vec<u32>` arena with `(offset, len)` indexing. One allocation, sequential reads.

`propagate()` auto-selects strategy: AC-3 worklist if `finalize()` was called, fixed-point sweep otherwise. `propagate_with(strategy)` allows explicit selection.

| Strategy | Trigger | Use case |
|----------|---------|----------|
| `Auto` | Default | Picks AC-3 or sweep based on adjacency presence |
| `Ac3` | `finalize()` called | Search (Sudoku, queens, coloring) |
| `Sweep` | No adjacency | Lattice domains (type inference, FIRST/FOLLOW) |

## Algorithms

### AC-3

Arc consistency via a bitset worklist (`Vec<u64>`). When a constraint's `revise()` prunes a domain, only its neighbor constraints are re-enqueued—the bitset gives O(1) insert and O(words) scan for the next constraint to process.

`NotEqual::revise()` checks singleton domains: if one side is fixed to value `v`, prune `v` from the other. `AllDifferent` propagates assigned values to all peers. The default `revise()` (for closures and custom constraints) does pairwise support checking with a reusable assignment buffer.

### GAC AllDifferent

Régin's (1994) algorithm for generalized arc consistency on n-ary all-different constraints:

1. **Maximum matching** — Hopcroft-Karp on the variable-value bipartite graph, O(E√V). If the matching doesn't cover all variables, the constraint is unsatisfiable.
2. **Residual graph** — matched edges reversed (val→var), unmatched forward (var→val). Free values get BFS-reachability edges back to all candidate variables.
3. **SCC decomposition** — iterative Tarjan. A (var, val) pair can be pruned if the edge isn't in the matching, var and val are in different SCCs, and the value isn't reachable from a free vertex.

### Backjumping

Conflict-directed backjumping with a bitset conflict set. When a dead end is reached, the conflict set records which previously-assigned variables caused the failure. The search jumps directly to the most recent conflicting variable rather than backtracking chronologically.

## Optimizations

- **ConstraintEnum dispatch** — the enum match on `NotEqual`/`AllDifferent` compiles to a direct branch. `scope()`, `check()`, and `revise()` are `#[inline]`.
- **Arena adjacency** — all neighbor lists live in a single `Vec<u32>` pool. Each variable/constraint has an `(offset, len)` pair into the pool.
- **BitsetIter** — `BitsetDomain::iter()` copies the `u128` and yields values via `trailing_zeros`. Zero allocation, no borrow—the domain can be mutated while iterating.
- **Worklist bitset** — AC-3 uses `Vec<u64>` words. O(1) insert, O(words) pop. No `VecDeque`.
- **Assign-check-unassign** — forward checking tests each value by writing into the mutable assignment slice, checking constraints, then unwriting. No per-value allocation.

## Puzzles

### Sudoku

M² variables with domain 1..M, AllDifferent constraints on each row, column, and N×N subgrid. Handles N=2 (4×4) through N=5 (25×25). The web app exposes N=2, 3, 4.

Generation has two paths. The fast path picks a random pre-computed template and applies a random symmetry transform—sub-millisecond. The symmetry group for N=3 comprises digit permutation (9!), row permutation within bands (3!³), column permutation within stacks (3!³), band permutation (3!), stack permutation (3!), and transposition (×2). Product: ~1.22 billion distinct grids per template.

The slow path generates a complete solution (seed first row, solve), digs holes one at a time with uniqueness verification, and calibrates difficulty by backtrack count: easy (0), medium (<50), hard (>100).

### Futoshiki

N×N Latin square with inequality constraints between adjacent cells. `add_all_different` per row and column, `add_equals` for fixed cells, `add_greater_than` for the inequality annotations. Rust-only (no web UI).

## BBNF Integration

The [bbnf-lang](https://github.com/mkbabb/bbnf-lang) grammar compiler uses `csp-solver` for six IR analysis passes. Each constructs a `Csp` with a lattice domain—values only grow via `join()`, no backtracking. None call `finalize()`, so `propagate()` auto-selects the sweep strategy.

| Pass | Domain | Lattice direction | Variables |
|------|--------|--------------------|-----------|
| Type inference | `TypeDomain` | `None → Some(ty)` | 2 per IR node |
| FIRST sets | `CharSetDomain` (128-bit) | ∅ → union | 1 per rule |
| FOLLOW sets | `CharSetDomain` | ∅ → union | 1 per rule |
| Span eligibility | `BoolDomain` | top-down refinement | 1 per rule |
| Dispatch tables | `DispatchDomain` | Unknown → Dispatchable/NonDispatchable | 1 per Alt |
| Regex algebra | `RewriteDomain` | Pending → CanRewrite/CannotRewrite | 1 per Alt |

For CSS L4 (265 rules, 15 files, deep `@import` chain), the full compile pipeline runs in 113ms. The CSP passes are <0.1% of that—the compile bottleneck is literal prefix factoring, mitigated by FxHash (which cut the total from 211ms).

## Performance

Solve times on hard 9×9 Sudoku (AC3 + DomWdeg, single solution):

| Puzzle | Rust | Python | Speedup |
|--------|------|--------|---------|
| Al Escargot | 0.36 ms | 11.5 ms | 32× |
| Golden Nugget | 6.2 ms | 347 ms | 56× |
| Inkala 2010 | 0.52 ms | 29.6 ms | 57× |

BBNF compile pipeline:

| Grammar | Lines | Time |
|---------|-------|------|
| JSON | 30 | 0.70 ms |
| EBNF | 51 | 1.10 ms |
| Google Sheets | 115 | 1.80 ms |
| CSS L4 | 973 (15 files) | 113 ms |

## Development

```bash
cargo test                              # 83 Rust tests
cargo bench                             # criterion: sudoku, queens, map_coloring, lattice
maturin develop --release --features py # build PyO3 wheel

docker compose up                       # dev: api + frontend
```

```
csp-solver/
├── src/
│   ├── lib.rs              # Csp<D>, SolveConfig, PropagationStrategy
│   ├── py.rs               # PyO3 bindings (#[cfg(feature = "py")])
│   ├── constraint/         # Constraint trait, ConstraintEnum, NotEqual, AllDifferent, Lambda
│   ├── domain/             # Domain trait, BitsetDomain, FiniteDomain, BitsetLatticeDomain
│   ├── solver/             # ac3, backtrack, backjump, propagate, monotonic, gac_alldiff, local_search, nogoods
│   └── puzzles/            # sudoku/, futoshiki/
├── benches/                # criterion
├── tests/                  # 83 integration tests
└── examples/               # profiling targets
web/
├── api/                    # FastAPI backend (Python package: app)
├── frontend/               # Vue 3 + TypeScript + Tailwind, custom pencil-boil aesthetic
└── nginx/                  # reverse proxy (production)
```

## Sources

- Régin, J.-C. (1994). "A filtering algorithm for constraints of difference in CSPs." *AAAI-94*, 362–367.
- Mackworth, A. K. (1977). "Consistency in networks of relations." *Artificial Intelligence*, 8(1), 99–118.
- Hopcroft, J. E. & Karp, R. M. (1973). "An n^(5/2) algorithm for maximum matchings in bipartite graphs." *SIAM J. Comput.*, 2(4), 225–231.
- Tarjan, R. E. (1972). "Depth-first search and linear graph algorithms." *SIAM J. Comput.*, 1(2), 146–160.
- Boussemart, F. et al. (2004). "Boosting systematic search by weighting constraints." *ECAI-04*, 146–150.
- Minton, S. et al. (1992). "Minimizing conflicts." *Artificial Intelligence*, 58(1–3), 161–205.
