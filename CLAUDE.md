# CSP Solver — Project Guide

Fullstack CSP solver. Rust solver (`csp-solver/`) + Python FastAPI (`python/`) + Vue 3 frontend (`frontend/`).

The Rust `csp_solver` native module is the defacto solver. The Python package is `csp_solver_py` (legacy solver, to be removed). FastAPI routes import from `csp_solver` (Rust native module via PyO3), not from `csp_solver_py.solver`.

## Directory Structure

```
.
├── csp-solver/                 Rust crate — CSP solver engine
│   ├── src/                    Core library (constraint/, domain/, solver/, puzzles/)
│   ├── tests/                  83 integration tests (7 files)
│   ├── benches/                Criterion benchmarks (sudoku, queens, map_coloring, lattice)
│   └── examples/               Profiling targets (profile_csp, profile_sudoku, time_sudoku)
├── python/                     FastAPI + legacy Python solver
│   ├── Dockerfile              Multi-stage: Rust nightly → maturin → wheel → uvicorn
│   ├── pyproject.toml          Package: csp-solver, wheel target: csp_solver_py
│   ├── src/csp_solver_py/      Python package (api/, solver/ [legacy], data/)
│   └── tests/                  107 Python tests (6 files)
├── frontend/                   Vue 3 + TypeScript + Tailwind v4
│   ├── Dockerfile              Multi-stage: dev (Vite HMR) / prod (nginx)
│   └── src/                    Components, composables, lib
├── nginx/
│   └── sudoku.conf             Reverse proxy config (production)
├── scripts/
│   ├── deploy.sh               Production deployment
│   └── dev.sh                  Development startup
├── Cargo.toml                  Workspace: members = ["csp-solver"]
├── docker-compose.yml          Dev: backend + frontend
└── docker-compose.prod.yml     Prod: backend + frontend + nginx
```

## Architecture

```
Browser ←→ Nginx (:80) ←→ Frontend (Vue 3, :3000)
                         ←→ Backend (FastAPI, :8000)
                              ├── csp_solver (Rust native, PyO3)
                              └── csp_solver_py (legacy Python, unused by routes)
```

### CSP Solver (Rust)

- `ConstraintEnum` — devirtualized dispatch (NotEqual, AllDifferent, Custom)
- `BitsetDomain` — u128-backed, zero-alloc iteration via `BitsetIter`
- AC-3 bitset worklist propagation (`solver/ac3.rs`)
- `PropagationStrategy` — Auto (AC-3 if finalized, sweep otherwise), Ac3, Sweep
- Monotonic sweep for lattice domains (`solver/monotonic.rs`)
- GAC all-different (Regin 1994) via Hopcroft-Karp + Tarjan SCC
- Backtracking + conflict-directed backjumping
- Variable ordering: Chronological, FailFirst (MRV), DomWdeg

### PyO3 Bindings

`#[cfg(feature = "py")]` in `csp-solver/src/py.rs`. Module name: `csp_solver`. Exposed types: `Csp`, `SolveConfig`, `SolveStats`, `Pruning`, `Ordering`, `PropagationStrategy`, `SudokuDifficulty`, `SudokuCSP`. Functions: `create_sudoku_csp`, `solve_sudoku`, `create_random_board`.

### BBNF Integration

`csp-solver` is patched into `bbnf-lang` via `.cargo/config.toml`. Used for type inference, FIRST/FOLLOW sets, span eligibility, dispatch tables, regex algebra. All use `propagate()` with lattice domains (CharSetDomain, BoolDomain, TypeDomain, DispatchDomain, RewriteDomain) — sweep strategy auto-selected since `finalize()` isn't called.

## Development

```bash
# Docker (dev)
docker compose up

# Docker (prod)
docker compose -f docker-compose.yml -f docker-compose.prod.yml build && \
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Rust only
cd csp-solver && cargo test && cargo bench

# Python only (requires Rust wheel installed)
cd python && uv sync && uv run uvicorn csp_solver_py.api.main:app --reload --port 8000

# Frontend only
cd frontend && npm install && npm run dev
```

## Testing

```bash
# Rust — 83 tests (solver, sudoku, lattice, gac, futoshiki, local_search, nogoods)
cargo test --workspace

# Python — 107 tests (27 solver, 10 rust backend, 6 bench compare, 25 stress, 38 benchmarks, 1 API)
cd python && uv run pytest tests/

# Benchmarks — criterion (sudoku, queens, map_coloring, lattice)
cargo bench
```

## Performance

Rust solving 7-57x faster than Python across puzzle types. CSS L4 compile 113ms after FxHash optimization.

## API Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/board/random/{size}/{difficulty}` | Generate random board (size 2-5) |
| POST | `/api/v1/board/solve` | Solve board (30s timeout, thread pool) |
| GET | `/api/v1/health` | Health check |

## Key Conventions

- **Rust**: Nightly toolchain, edition 2024.
- **Python**: ruff (line-length 100, rules E/F/I/UP), mypy strict, pytest-asyncio (auto mode). Package name `csp_solver_py`, uvicorn entrypoint `csp_solver_py.api.main:app`.
- **TypeScript**: strict mode, `@/*` path aliases, Prettier + tailwind plugin.
- **Docker**: Multi-stage build — Rust nightly → maturin → wheel. `csp-solver/` copied into builder stage at `/build/csp-solver/`, wheel installed into uv venv.
- **Constraints as HOFs** (Python legacy): return `(checker_fn, variables_list)`.
- **Sudoku boards**: Pre-computed solution banks in `data/sudoku_solutions/{N}/`. Pre-computed puzzle templates in `data/sudoku_puzzles/{N}/{difficulty}/`. Fast-path: random template + symmetry transform.
