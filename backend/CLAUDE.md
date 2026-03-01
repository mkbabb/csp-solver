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
│   │   ├── csp.py                      # Core CSP engine: backtracking, FC, AC3, AC-FC, min-conflicts
│   │   ├── constraints.py              # Constraint HOFs: all_different, less_than, lambda_constraint, etc.
│   │   ├── sudoku.py                   # Sudoku CSP creation, board generation, difficulty calibration
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

## CSP Engine (`solver/csp.py`)

### Pruning Strategies
| Strategy | Behavior |
|---|---|
| `FORWARD_CHECKING` | Removes inconsistent values from neighbors on assignment |
| `AC3` | Full arc consistency via queue-based propagation |
| `AC_FC` | Hybrid: AC3 + forward checking |
| `NO_PRUNING` | Plain backtracking |

### Variable Ordering
| Strategy | Behavior |
|---|---|
| `FAIL_FIRST` | MRV heuristic — smallest domain first |
| `NO_ORDERING` | Sequential |

### Key Methods
- `backtrack()` — Main search with configurable pruning
- `forward_check()` — Domain reduction for assigned variable's neighbors
- `AC3()` — Arc consistency with agenda set for O(1) membership
- `min_conflicts()` — Hill-climbing local search alternative
- `solve_with_initial_propagation()` — Pre-removes clue values from peer domains (20-40% speedup)

### Optimizations
- Integer variable keys (faster hashing than strings)
- Temporary assign/restore pattern (avoids dict.copy)
- Set-based domains for O(1) removal
- Backtrack counter for difficulty measurement

## Sudoku (`solver/sudoku.py`)

Board generation: random solution → hole-digging → uniqueness check → difficulty calibration.

- **Difficulty**: EASY (0 backtracks), MEDIUM (<50), HARD (>100)
- **Pre-computed solutions**: Loaded from `data/sudoku_solutions/{N}/` for N≥4; generated dynamically for N≤3
- **Uniqueness**: Enforced by finding up to 2 solutions per puzzle

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
