# web/api/ — FastAPI service

FastAPI REST API wrapping the Rust `csp_solver` native module (PyO3). Python 3.13+, uv package manager, hatchling build. Import package: `app`. Project name: `sudoku-api`.

There is no Python solver — `csp_solver` (the Rust native module) is the sole engine. Routes never compute; they delegate to `games/<game>/service.py`, which calls `csp_solver`.

> Minimal de-stale pass (W4). Full rewrite rides W13.

## File Tree

```
web/api/
├── Dockerfile                          # Multi-stage: Rust nightly → maturin → wheel → uvicorn
├── pyproject.toml                      # project: sudoku-api, wheel: app, PEP 735 dependency-groups
├── uv.lock
├── docs/
│   └── csp_optimization.md             # Optimization notes and benchmarks
├── src/app/
│   ├── __init__.py
│   ├── main.py                         # App assembly ONLY: lifespan, CORS, error handlers, router mounts
│   ├── core/                           # Cross-cutting, app-global (no per-game code)
│   │   ├── settings.py                 # Settings (pydantic-settings BaseSettings), get_settings()
│   │   ├── executors.py                # Split ThreadPoolExecutors (random vs solve), get_executors()
│   │   ├── errors.py                   # ApiError/ApiErrorCode (7 codes) + register_error_handlers()
│   │   └── limiter.py                  # slowapi Limiter instance
│   ├── games/
│   │   ├── sudoku/
│   │   │   ├── router.py               # Thin HTTP: GET /board/random/{size}/{difficulty}, POST /board/solve
│   │   │   ├── service.py              # SudokuService: generate/solve orchestration, CancelToken wiring
│   │   │   └── models.py               # SolveRequest, SolveResponse, BoardResponse, Difficulty
│   │   └── futoshiki/                  # Skeleton only — router/service/models land in W10
│   └── routes/                         # Cross-cutting routes (not per-game)
│       ├── health.py                   # GET /health
│       └── config.py                   # GET /config — exposes solver_timeout_s to the frontend
└── tests/
    ├── test_sudoku_router.py           # HTTP-shape: random/solve/health/config, over the real wheel
    ├── test_sudoku_service.py          # Orchestration: generate/solve/typed-failure paths + timeout cancel
    ├── test_core_errors.py             # Error taxonomy: 7 codes, fault-injected 408/429/500, envelope shape
    ├── test_core_settings.py           # CORS comma-split validator + DI override reaching /config
    ├── test_rust_backend.py            # csp_solver parity (4×4/9×9/16×16, canonical hard puzzles)
    ├── test_bench_compare.py           # Rust solve-time benchmarks (<50ms hard puzzles)
    ├── test_panic_contract.py          # PyO3 unwind→PanicException / abort→SIGABRT contract
    └── test_wheel_contracts.py         # Wheel probes: GIL heartbeat, CancelToken timeout/cancel, typed exceptions
```

Puzzle data (`sudoku_puzzles/`) is owned by the Rust crate (`csp-solver/data/`), not this package — `create_random_board` embeds/selects it internally (be-colocation manifest §2.5).

## Architecture

Thin router → service → `csp_solver`. DI via `Depends`: `get_settings`, `get_executors`, `get_sudoku_service` — all overridable in tests through `app.dependency_overrides`. One JSON error envelope for every failure:

```
{"error": {"code": "<ApiErrorCode>", "message": "<str>", "retryable": <bool>}}
```

`ApiErrorCode` ∈ {UNSATISFIABLE, BUDGET_EXCEEDED, INVALID_INPUT, TIMEOUT, NOT_FOUND, RATE_LIMITED, INTERNAL}; the four solver-originated codes mirror `CspError::code()` verbatim. Rate limiting (slowapi): `/board/random` 60/min, `/board/solve` 30/min.

## Docker

Multi-stage Dockerfile. Build context is the project root (needed for `csp-solver/`):

1. **rust-builder** — Rust nightly + maturin; builds the PyO3 wheel from `csp-solver/`.
2. **uv-installer** — uv from ghcr.io.
3. **development** — `uv sync` (dev group) + wheel install; `uvicorn app.main:app --reload`.
4. **production** — `uv sync --no-dev` + wheel install; `uvicorn app.main:app` (4 workers, proxy headers).

## API Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/board/random/{size}/{difficulty}` | Generate random board (size 2–5; N=5 easy only) |
| POST | `/api/v1/board/solve` | Solve board (wall-clock timeout + CancelToken) |
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/config` | Expose `solver_timeout_s` to the frontend |

## Commands

```bash
uv sync                                  # Install deps (dev group by default)
# csp_solver wheel is built + installed out-of-band via maturin:
uvx maturin build -m ../../csp-solver/Cargo.toml --release --interpreter "$(uv python find 3.13)"
uv pip install ../../target/wheels/sudoku_rs-*.whl
uv run uvicorn app.main:app --reload     # Dev server (:8000)
uv run pytest tests/                     # Full suite
uv run ruff check .                       # Lint
uv run mypy src/app                       # Type check (src is strict-clean)
```

## Key Conventions

- **Python**: ruff (line-length 100, rules E/F/I/UP), mypy strict on `src/app`, pytest-asyncio (auto mode), pytest-timeout.
- **Rust imports**: `from csp_solver import ...` — the Rust native module (dist `sudoku-rs`, import `csp_solver`).
- **N=5 policy (locked)**: easy pregenerated; medium/hard rejected at the API (`NOT_FOUND`).
- **Difficulty**: EASY / MEDIUM / HARD (`StrEnum`).
