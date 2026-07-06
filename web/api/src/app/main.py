"""FastAPI application entry point — app assembly only.

Lifespan (split thread pools built once per process), middleware (CORS), the
one JSON error envelope, the rate limiter, and the router mounts. All domain
logic lives in `games/<game>/service.py`; all cross-cutting vocabulary lives
in `core/`. This module wires them together and nothing else.

Uvicorn entrypoint: `app.main:app`.
"""

from __future__ import annotations

from collections.abc import AsyncIterator
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.errors import register_error_handlers
from app.core.executors import Executors
from app.core.limiter import limiter
from app.core.settings import get_settings
from app.games.sudoku.router import router as sudoku_router
from app.routes.config import router as config_router
from app.routes.health import router as health_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Build the split thread pools once per process and tear them down
    cleanly at shutdown — not the implicit, platform-default,
    shared-between-everything pool the un-refactored service inherited."""
    settings = get_settings()
    app.state.executors = Executors(
        random=ThreadPoolExecutor(
            max_workers=settings.random_executor_workers, thread_name_prefix="board-random"
        ),
        solve=ThreadPoolExecutor(
            max_workers=settings.solve_executor_workers, thread_name_prefix="board-solve"
        ),
    )
    yield
    app.state.executors.shutdown()


app = FastAPI(
    title="Sudoku API",
    description="Sudoku (and, W10, Futoshiki) puzzle solver API over the Rust csp_solver engine",
    version="0.1.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
# One JSON error envelope for every route (core/errors.py) — this also owns
# the RateLimitExceeded -> 429 mapping, superseding slowapi's own default
# handler (the limiter was previously wired but applied to zero routes).
register_error_handlers(app)

settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes — all under /api/v1
app.include_router(health_router, prefix="/api/v1")
app.include_router(sudoku_router, prefix="/api/v1")
app.include_router(config_router, prefix="/api/v1")
