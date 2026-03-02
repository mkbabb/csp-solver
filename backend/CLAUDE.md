# Backend — CSP Solver API

FastAPI REST API wrapping a generalized CSP solver. Python 3.13, uv package manager, hatchling build.

## File Tree

```
backend/
├── Dockerfile                          # Multi-stage: dev (uvicorn --reload) / prod (4 workers)
├── pyproject.toml                      # Deps, ruff, mypy, pytest config
├── uv.lock
├── src/csp_solver/
│   ├── __init__.py
│   ├── solver/
│   │   ├── __init__.py
│   │   ├── csp.py                      # CSP class: variable/constraint state, backtrack, solve
│   │   ├── pruning.py                  # Pruning algorithms: forward_check, AC3, AC_FC, revise
│   │   ├── local_search.py             # Min-conflicts local search: num_conflicts, min_conflicts
│   │   ├── constraints.py              # Constraint HOFs: all_different, less_than, lambda_constraint, etc.
│   │   ├── sudoku.py                   # Sudoku CSP creation + solving interface
│   │   ├── sudoku_gen.py               # Board generation: solution creation, hole-digging, difficulty calibration
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
│       └── sudoku_solutions/           # Pre-computed JSON boards
│           ├── 2/                      # 20 boards (4×4)
│           ├── 3/                      # 100 boards (9×9)
│           ├── 4/                      # 20 boards (16×16)
│           └── 5/                      # 2 boards (25×25)
└── tests/
    ├── __init__.py
    ├── test_solver.py                  # 7 tests: CSP basics, 4×4/9×9 solve, board gen, backtrack counter
    └── test_api.py                     # 5 async tests: health, random board, solve, validation
```

## CSP Engine

Split across three modules:

### `solver/csp.py` — Problem representation + backtracking search
- `CSP` class: variable/constraint registration, domain state, `backtrack()`, `solve()`, `solve_with_initial_propagation()`, `get_next_variable()`
- `PruningType` enum, `VariableOrdering` enum

### `solver/pruning.py` — Arc consistency + forward checking
- `forward_check(csp, variable, solution)` — Domain reduction for assigned variable's neighbors
- `AC3(csp, variable, solution)` — Arc consistency with DWO detection, O(1) agenda set
- `AC_FC(csp, variable, solution)` — Hybrid: AC3 + forward checking
- `revise(csp, variable, Xi, Xj, solution)` — Arc revision (shared by AC3/AC_FC)

### `solver/local_search.py` — Min-conflicts hill-climbing
- `min_conflicts(csp, iteration_count)` — Randomly initialize, iteratively fix conflicts
- `num_conflicts()`, `conflicting_variables()`, `min_conflicting_value()`

### Variable Ordering
| Strategy | Behavior |
|---|---|
| `FAIL_FIRST` | MRV heuristic — smallest domain first |
| `NO_ORDERING` | Sequential |

### Optimizations
- Integer variable keys (faster hashing than strings)
- Temporary assign/restore pattern (avoids dict.copy)
- Set-based domains for O(1) removal
- Backtrack counter for difficulty measurement

## Sudoku

Split across two modules:

### `solver/sudoku.py` — CSP creation + solving interface
- `create_sudoku_csp(N, values, max_solutions)` — Build CSP with row/col/subgrid constraints
- `solve_sudoku(csp)` — Solve with initial propagation when given values exist
- `solution_to_array()`, `SudokuDifficulty` enum

### `solver/sudoku_gen.py` — Board generation lifecycle
- `create_random_board(N, difficulty)` — Random solution → hole-digging → uniqueness check → difficulty calibration
- `_generate_solution()`, `_load_solution_board()`, `_has_unique_solution()`, `_measure_difficulty()`
- **Difficulty**: EASY (0 backtracks), MEDIUM (<50), HARD (>100)
- **Pre-computed solutions**: `data/sudoku_solutions/{N}/` for N≥4; generated dynamically for N≤3

## Constraints (`solver/constraints.py`)

All constraints are HOFs returning `(checker_fn, variables_list)`:
- `all_different_constraint(*vars)` — Early-exit set check
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
uv run pytest                                   # Run tests
uv run ruff check .                             # Lint
uv run mypy .                                   # Type check
```
