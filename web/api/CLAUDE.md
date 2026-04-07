# web/api/ — FastAPI + Legacy Python Solver

FastAPI REST API wrapping the Rust `csp_solver` native module (PyO3). Python 3.13+, uv package manager, hatchling build.

Package name: `app`. The Python solver (`app/solver/`) is legacy and to be removed. FastAPI routes import from `csp_solver` (Rust native module), NOT from `app.solver`.

## File Tree

```
web/api/
├── Dockerfile                          # Multi-stage: Rust nightly → maturin → wheel → uvicorn
├── pyproject.toml                      # Package: csp-solver, wheel: app
├── uv.lock
├── scripts/
│   └── generate_templates.py           # Offline puzzle template generation
├── docs/
│   └── csp_optimization.md             # Optimization notes and benchmarks
├── src/app/
│   ├── __init__.py
│   ├── solver/                         # LEGACY — Python CSP engine (to be removed)
│   │   ├── __init__.py
│   │   ├── csp.py                      # CSP class: backtrack, solve, FC/AC3/AC-FC, revise, dom/wdeg
│   │   ├── bitset_domain.py            # Bitmask-backed domain: O(1) copy, POPCNT len
│   │   ├── gac_alldiff.py              # GAC all-different (Regin 1994)
│   │   ├── nogoods.py                  # Bounded nogood store with LRU eviction
│   │   ├── local_search.py             # Min-conflicts local search
│   │   ├── constraints.py              # Constraint HOFs
│   │   ├── sudoku.py                   # Sudoku CSP creation, solving, generation
│   │   ├── sudoku_transforms.py        # Symmetry transforms
│   │   └── futoshiki.py                # Futoshiki CSP creation, file parser
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI app: CORS, rate limiting (slowapi), router mounts
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── board.py                # GET /random/{size}/{difficulty}, POST /solve (30s timeout)
│   │   │   │                           # Imports from csp_solver (Rust), not app
│   │   │   └── health.py              # GET /health
│   │   └── models/
│   │       ├── __init__.py
│   │       └── board.py                # Pydantic: SolveRequest, SolveResponse, BoardResponse, Difficulty
│   └── data/
│       ├── __init__.py
│       ├── sample_input.txt            # Futoshiki sample (N=5)
│       ├── sudoku_solutions/           # Pre-computed complete boards (JSON)
│       │   ├── 2/                      # 20 boards (4x4)
│       │   ├── 3/                      # 100 boards (9x9)
│       │   ├── 4/                      # 20 boards (16x16)
│       │   └── 5/                      # 2 boards (25x25)
│       └── sudoku_puzzles/             # Pre-computed puzzle templates (JSON)
│           ├── 2/{easy,medium,hard}/   # 10 templates each
│           ├── 3/{easy,medium,hard}/   # 20/12/20 templates
│           └── 4/{easy,medium,hard}/   # 10/10/5 templates
└── tests/
    ├── __init__.py
    ├── test_solver.py                  # 27 tests: CSP basics, BitsetDomain, DWO, AC-2001, dom/wdeg, GAC, nogoods, transforms, generation
    ├── test_rust_backend.py            # 10 tests: Rust native module parity
    ├── test_bench_compare.py           # 6 tests: Python vs Rust performance comparison
    ├── test_stress.py                  # 25 tests: Hard 9x9 puzzles (Al Escargot, Platinum Blonde, etc.) + 16x16
    ├── test_benchmarks.py              # 38 tests: Parametrized correctness + regression across solver configs
    └── test_api.py                     # 1 test: async API endpoints (health, random board, solve, validation)
```

## Docker

Multi-stage Dockerfile (`web/api/Dockerfile`):

1. **rust-builder** — Rust nightly + maturin. Copies `csp-solver/` crate, builds PyO3 wheel.
2. **uv-installer** — uv from ghcr.io.
3. **development** — uv sync + wheel install. `uvicorn --reload`.
4. **production** — uv sync (no-dev) + wheel install. 4 workers, proxy headers.

Build context is the project root (not `web/api/`) — needed to access `csp-solver/`.

## API Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/board/random/{size}/{difficulty}` | Generate random board (size 2-5) |
| POST | `/api/v1/board/solve` | Solve board (30s timeout, thread pool) |
| GET | `/api/v1/health` | Health check |

## Commands

```bash
uv sync                                            # Install deps
uv run uvicorn app.api.main:app --reload  # Dev server (:8000)
uv run pytest tests/                                # 107 tests
uv run ruff check .                                 # Lint
uv run mypy .                                       # Type check
```

## Key Conventions

- **Python**: ruff (line-length 100, rules E/F/I/UP), mypy strict, pytest-asyncio (auto mode).
- **Rust imports**: `from csp_solver import Csp, SolveConfig, ...` — the Rust native module, NOT the Python package.
- **Legacy solver**: `app/solver/` still exists but isn't used by API routes. Tests still exercise it for parity checks.
- **Difficulty**: EASY (0 backtracks), MEDIUM (<50), HARD (>100).
- **Pre-computed data**: Solution banks + puzzle templates in `src/app/data/`.
