# Backend — CSP Solver API

FastAPI REST API wrapping a generalized CSP solver. Python 3.13, uv package manager, hatchling build.

## File Tree

```
backend/
├── Dockerfile                          # Multi-stage: dev (uvicorn --reload) / prod (4 workers)
├── pyproject.toml                      # Deps, ruff, mypy, pytest config
├── uv.lock
├── scripts/
│   └── generate_templates.py           # Offline puzzle template generation
├── docs/
│   └── csp_optimization.md             # Optimization notes and benchmarks
├── src/csp_solver/
│   ├── __init__.py
│   ├── solver/
│   │   ├── __init__.py
│   │   ├── csp.py                      # CSP class: backtrack, solve, FC/AC3/AC-FC, revise, dom/wdeg
│   │   ├── bitset_domain.py            # Bitmask-backed domain: O(1) copy, POPCNT len, bit-trick iter
│   │   ├── gac_alldiff.py              # GAC all-different (Régin 1994): Hopcroft-Karp + Tarjan SCC
│   │   ├── nogoods.py                  # Bounded nogood store with LRU eviction
│   │   ├── local_search.py             # Min-conflicts local search: num_conflicts, min_conflicts
│   │   ├── constraints.py              # Constraint HOFs: all_different, less_than, lambda_constraint, etc.
│   │   ├── sudoku.py                   # Sudoku CSP creation, solving, board generation, template fast-path
│   │   ├── sudoku_transforms.py        # Symmetry transforms: digit/row/col/band/stack perm, transpose
│   │   └── futoshiki.py                # Futoshiki CSP creation, file parser
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI app: CORS, rate limiting (slowapi), router mounts
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── board.py                # GET /random/{size}/{difficulty}, POST /solve (30s timeout)
│   │   │   └── health.py               # GET /health
│   │   └── models/
│   │       ├── __init__.py
│   │       └── board.py                # Pydantic: SolveRequest, SolveResponse, BoardResponse, Difficulty
│   └── data/
│       ├── __init__.py
│       ├── sample_input.txt            # Futoshiki sample (N=5)
│       ├── sudoku_solutions/           # Pre-computed complete boards (JSON)
│       │   ├── 2/                      # 20 boards (4×4)
│       │   ├── 3/                      # 100 boards (9×9)
│       │   ├── 4/                      # 20 boards (16×16)
│       │   └── 5/                      # 2 boards (25×25)
│       └── sudoku_puzzles/             # Pre-computed puzzle templates (JSON)
│           ├── 2/{easy,medium,hard}/   # 10 templates each
│           ├── 3/{easy,medium,hard}/   # 20/12/20 templates
│           └── 4/{easy,medium,hard}/   # 10/10/5 templates
└── tests/
    ├── __init__.py
    ├── test_solver.py                  # 24 tests: CSP basics, BitsetDomain, DWO, AC-2001, dom/wdeg, GAC, nogoods, transforms, generation
    ├── test_api.py                     # 5 async tests: health, random board, solve, validation
    ├── test_benchmarks.py              # Parametrized correctness + regression across solver configs
    └── test_stress.py                  # Hard 9×9 puzzles (Al Escargot, Platinum Blonde, etc.) + 16×16
```

## CSP Engine

### `solver/csp.py` — Problem representation + search + pruning

The CSP class unifies problem state and all pruning methods:

- **Core**: `add_variables()`, `add_constraint()`, `backtrack()`, `solve()`, `solve_with_initial_propagation()`
- **Pruning** (inline methods): `forward_check()`, `AC3()`, `AC_FC()`, `revise()` — all with DWO early termination
- **AC-2001**: Residual support caching in `revise()` — O(ed²) optimal arc consistency
- **Pair-constraint index**: `is_valid_pair()` checks only shared constraints between two variables
- **dom/wdeg**: `_wdeg()`, `_increment_weights_on_dwo()` — failure-driven constraint weighting
- **GAC all-different**: `_propagate_gac_alldiff()` — delegates to Régin's algorithm via `gac_alldiff.py`
- **Initial propagation**: `solve_with_initial_propagation()` — one-hop + full AC3 cascade for given cells

### `solver/bitset_domain.py` — Bitmask domain container

Duck-typed set replacement for integer domains. O(1) copy via int assignment, POPCNT-based `len()`, bit-trick iteration. Auto-selected by `_make_domain()` when all values are non-negative integers.

### `solver/gac_alldiff.py` — GAC all-different (Régin 1994)

Hopcroft-Karp maximum bipartite matching → directed residual graph → Tarjan SCC → prune values not in any maximum matching and not in the same SCC. Integer-indexed nodes, list-based adjacency, iterative Tarjan.

### `solver/nogoods.py` — Bounded nogood store

Hash-based conflict tuple store with LRU eviction. Records partial assignments known to be dead ends; checks if a new assignment would complete any stored nogood.

### `solver/local_search.py` — Min-conflicts hill-climbing

`min_conflicts(csp, iteration_count)` — randomly initialize, iteratively fix conflicts.

### Variable Ordering

| Strategy | Behavior |
|---|---|
| `FAIL_FIRST` | MRV heuristic — smallest domain first |
| `DOM_WDEG` | domain size / weighted degree — failure-driven |
| `NO_ORDERING` | Sequential |

### Optimizations

- BitsetDomain: O(1) copy, POPCNT len, bit-trick iteration for integer domains
- AC-2001 residual supports: cached support values avoid redundant arc checks
- Pair-constraint index: O(1) lookup of shared constraints between variable pairs
- dom/wdeg ordering: constraint weights increment on DWO for adaptive variable selection
- GAC all-different: global constraint propagation catches inferences binary AC misses
- Integer variable keys (faster hashing than strings)
- Temporary assign/restore pattern (avoids dict.copy)
- Initial AC3 cascade for given cells (singleton propagation chains)
- Backtrack counter for difficulty measurement

## Sudoku (`solver/sudoku.py`)

Unified module: CSP creation, solving, and board generation.

- `create_sudoku_csp(N, values, max_solutions)` — Build CSP with row/col/subgrid constraints, dom/wdeg + GAC all-different
- `solve_sudoku(csp)` — Solve with initial propagation when given values exist
- `create_random_board(N, difficulty)` — Fast path: template + symmetry transform; slow path: hole-digging + difficulty calibration
- `_load_puzzle_templates()` — Cached template loading from `data/sudoku_puzzles/{N}/{difficulty}/`
- `SudokuTransform.random(N).apply(board, N)` — Digit/row/col/band/stack permutation + transpose (~1.22B grids per template for N=3)
- **Difficulty**: EASY (0 backtracks), MEDIUM (<50), HARD (>100)
- **Pre-computed solutions**: `data/sudoku_solutions/{N}/` for complete boards
- **Pre-computed templates**: `data/sudoku_puzzles/{N}/{difficulty}/` for puzzle+solution pairs

## Constraints (`solver/constraints.py`)

All constraints are HOFs returning `(checker_fn, variables_list)`:
- `all_different_constraint(*vars)` — Early-exit set check; tagged `_is_alldiff` for GAC detection
- `less_than_constraint(a, b)` / `greater_than_constraint(a, b)`
- `equals_constraint(node, value)`
- `lambda_constraint(func, *vars)` — Generic wrapper
- `map_coloring_constraint(p1, p2)` — Binary inequality

## API Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/board/random/{size}/{difficulty}` | Generate random board (size 2-5) |
| POST | `/api/v1/board/solve` | Solve board (30s timeout, thread pool) |
| GET | `/api/v1/health` | Health check |

## Commands

```bash
uv sync                                        # Install deps
uv run uvicorn csp_solver.api.main:app --reload # Dev server
uv run pytest                                   # Run tests (88 tests)
uv run ruff check .                             # Lint
uv run mypy .                                   # Type check
```
