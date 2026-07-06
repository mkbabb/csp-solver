# web/api/ — FastAPI service

FastAPI REST API wrapping the Rust `csp_solver` native module (PyO3). Python 3.13+, uv package manager, hatchling build. Import package: `app`. Project name: `sudoku-api`.

There is no Python solver — `csp_solver` (the Rust native module) is the sole engine. Routes never compute; they delegate to `games/<game>/service.py`, which calls `csp_solver`. Two games are live: Sudoku and Futoshiki.

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
│   ├── main.py                         # App assembly ONLY: lifespan (split executors), CORS, error handlers, router mounts
│   ├── core/                            # Cross-cutting, app-global (no per-game code)
│   │   ├── settings.py                 # Settings (pydantic-settings BaseSettings), get_settings()
│   │   ├── executors.py                # Split ThreadPoolExecutors (random vs solve), get_executors()
│   │   ├── errors.py                   # ApiError/ApiErrorCode (7 codes) + register_error_handlers()
│   │   └── limiter.py                  # slowapi Limiter instance (shared to dodge a main↔router import cycle)
│   ├── games/
│   │   ├── sudoku/
│   │   │   ├── router.py               # Thin HTTP: GET /board/random/{size}/{difficulty}, POST /board/solve
│   │   │   ├── service.py              # SudokuService: generate/solve orchestration, CancelToken wiring
│   │   │   └── models.py               # SolveRequest, SolveResponse, BoardResponse, Difficulty
│   │   └── futoshiki/
│   │       ├── router.py               # Thin HTTP: GET /futoshiki/random/{board_size}, POST /futoshiki/solve
│   │       ├── service.py              # FutoshikiService: mirrors SudokuService's shape verbatim
│   │       └── models.py               # FutoshikiSolveRequest/Response, FutoshikiBoardResponse — `board_size`, never `size`
│   └── routes/                         # Cross-cutting routes (not per-game)
│       ├── health.py                   # GET /health
│       └── config.py                   # GET /config — exposes solver_timeout_s to the frontend
└── tests/
    ├── test_sudoku_router.py           # HTTP-shape: random/solve/health/config, over the real wheel
    ├── test_sudoku_service.py          # Orchestration: generate/solve/typed-failure paths + timeout cancel
    ├── test_futoshiki_router.py        # Futoshiki HTTP-shape
    ├── test_futoshiki_service.py       # Futoshiki orchestration + timeout cancel
    ├── test_futoshiki_models.py        # Pydantic validators: adjacency, range, board_size bounds
    ├── test_futoshiki_contract.py      # Guards the `board_size`-never-`size` naming invariant across router/service/models
    ├── test_core_errors.py             # Error taxonomy: 7 codes, fault-injected 408/429/500, envelope shape
    ├── test_core_settings.py           # CORS comma-split validator + DI override reaching /config
    ├── test_rust_backend.py            # csp_solver parity (4×4/9×9/16×16, canonical hard puzzles)
    ├── test_bench_compare.py           # Rust solve-time benchmarks (<50ms hard puzzles)
    ├── test_panic_contract.py          # PyO3 unwind→PanicException / abort→SIGABRT contract
    └── test_wheel_contracts.py         # Wheel probes: GIL heartbeat, CancelToken timeout/cancel, typed exceptions
```

Puzzle data (Sudoku template bank) is owned by the Rust crate (`csp-solver/data/sudoku_puzzles/`, embedded via `include_dir!`), not this package — `create_random_board` selects from it internally. Futoshiki has no template bank at all: `create_random_futoshiki` hole-digs a fresh board every call (Rust-owned, uniqueness-checked generation, `puzzles/futoshiki/generate.rs`).

## Architecture

Thin router → service → `csp_solver`. DI via `Depends`: `get_settings`, `get_executors`, `get_sudoku_service`, `get_futoshiki_service` — all overridable in tests through `app.dependency_overrides`. One JSON error envelope for every failure:

```
{"error": {"code": "<ApiErrorCode>", "message": "<str>", "retryable": <bool>}}
```

`ApiErrorCode` ∈ {UNSATISFIABLE, BUDGET_EXCEEDED, INVALID_INPUT, TIMEOUT, NOT_FOUND, RATE_LIMITED, INTERNAL}; the four solver-originated codes mirror `CspError::code()` verbatim (`csp-solver/src/error.rs`). Six HTTP statuses carry the seven codes: 400 (UNSATISFIABLE/INVALID_INPUT), 404 (NOT_FOUND), 408 (TIMEOUT/BUDGET_EXCEEDED — two distinct codes, same coarse status: wall-clock deadline vs. Rust node budget), 422 (INVALID_INPUT via Pydantic validation), 429 (RATE_LIMITED), 500 (INTERNAL catch-all). Rate limiting (slowapi): `/board/random` and `/futoshiki/random` 60/min, `/board/solve` and `/futoshiki/solve` 30/min.

Both services share one shape: split thread-pool executors (`random` vs `solve`, built once at app startup in `main.py`'s lifespan, torn down at shutdown), a `csp_solver.CancelToken()` fired on `asyncio.wait_for` timeout so the Rust search actually stops on its worker thread (not a GIL-holding zombie), and `max_solutions=1` capped at the route (an O(solutions-found) GIL-held marshaling tail is otherwise inert only at 1 — any future enumerate caller must interleave conversion instead). **`max_solutions=1` semantics**: under `Ac3` propagation (`SolveConfig::default()`), the first solution found for a given-cells board need not be the *only* valid completion — a different, still-valid completion is unspecified-but-correct behavior, not a bug (`kernel-soundness-closure.md` §7.2). Both `solve_board` methods treat "search completed, zero solutions" as provably UNSATISFIABLE (not a timeout, not a crash) and a budget-exhausted search as the typed `BudgetExceededError` → 408/BUDGET_EXCEEDED, never a silently-returned `solved: false`.

Futoshiki mirrors Sudoku's service shape with two load-bearing differences: no `Difficulty` (v1 ships a single high-density tier, `board_size` 4–7 only) and `board_size`, never `size` (Sudoku's `size` is the *subgrid* side; Futoshiki has no subgrid) — `test_futoshiki_contract.py` guards the naming invariant. Inequality-pair adjacency (`(row,col)` Manhattan distance 1) is validated independently at three layers: the Pydantic model (`model_validator`), the service (defense in depth for non-HTTP callers), and the Rust `FutoshikiPuzzle::from_parts` boundary — deliberately redundant, never deduplicated away.

## Docker

Multi-stage Dockerfile. Build context is the project root (needed for `csp-solver/`):

1. **rust-builder** — Rust nightly (curl-installed, minimal profile) + maturin; builds the PyO3 wheel from `csp-solver/` with `--features py`.
2. **uv-installer** — uv from `ghcr.io/astral-sh/uv:latest`.
3. **development** — `uv sync --frozen` (dev group) + wheel install; `uvicorn app.main:app --reload` (:8000).
4. **production** — `uv sync --frozen --no-dev` + wheel install; non-root `app` user; `uvicorn app.main:app` (4 workers, proxy headers, `--forwarded-allow-ips "*"`).

## API Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/board/random/{size}/{difficulty}` | Sudoku random board (size 2–5; N=5 easy only) |
| POST | `/api/v1/board/solve` | Sudoku solve (wall-clock timeout + CancelToken) |
| GET | `/api/v1/futoshiki/random/{board_size}` | Futoshiki random board (board_size 4–7, single tier) |
| POST | `/api/v1/futoshiki/solve` | Futoshiki solve (wall-clock timeout + CancelToken) |
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/config` | Expose `solver_timeout_s` to the frontend |

## Commands

```bash
uv sync                                  # Install deps (dev group by default)
# csp_solver wheel is built + installed out-of-band via maturin:
uvx maturin build -m ../../csp-solver/Cargo.toml --release --features py --interpreter "$(uv python find 3.13)"
uv pip install ../../target/wheels/sudoku_rs-*.whl
uv run uvicorn app.main:app --reload     # Dev server (:8000)
uv run pytest tests/                     # Full suite
uv run ruff check .                       # Lint
uv run mypy src/app                       # Type check (src is strict-clean)
```

Test count (measured at `d9781e29`, `uv run pytest tests/ -q`): **108 passed, 2 skipped**.

## Key Conventions

- **Python**: ruff (line-length 100, rules E/F/I/UP), mypy strict on `src/app`, pytest-asyncio (auto mode), pytest-timeout (120s per-test ceiling — the cancel/timeout/heartbeat wheel contracts run ~0.6–1.5s each; a genuinely hung solve must fail loud, not wedge CI).
- **Rust imports**: `from csp_solver import ...` — the Rust native module (maturin project name `sudoku-rs` per `csp-solver/pyproject.toml`, import `csp_solver`), built with `--features py`.
- **N=5 policy (locked)**: easy pregenerated; medium/hard rejected at the API (`NOT_FOUND`) — the uniqueness-proof generation wall near the minimal-clue frontier doesn't clear 60s at that size, and GAC only shifts the density frontier ~6–9 points; do not re-open on propagation-strength gains alone.
- **Futoshiki v1 scope (locked)**: `board_size` 4–7, single high-density tier, no difficulty parameter — fabricated EASY/MEDIUM/HARD bands with no measured separation are worse than shipping none.
- **`max_solutions=1`**: caps every solve route; see Architecture above for the unspecified-first-solution semantics under `Ac3`.
- **Difficulty**: EASY / MEDIUM / HARD (`StrEnum`, SCREAMING_SNAKE) — Sudoku only.
