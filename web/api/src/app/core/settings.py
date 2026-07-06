"""Centralized application settings — DI-injected, test-overridable.

Replaces the module-level globals this service used instead of settings
(`os.getenv` in the old `api/main.py`, a hardcoded `SOLVER_TIMEOUT = 30`
and a fragile triple-`.parent` `DATA_DIR` traversal in the old
`api/routes/board.py`) with one `pydantic_settings.BaseSettings`, injected
via `Depends(get_settings)` everywhere a route or service needs
configuration. Overridable in tests via
`app.dependency_overrides[get_settings] = ...` instead of monkeypatching
module globals.
"""

from __future__ import annotations

from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="SUDOKU_API_", env_file=".env", extra="ignore")

    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]

    # Shared with the frontend via `GET /api/v1/config` (see
    # `routes/config.py`) so the client's `AbortSignal` timeout is provably
    # >= this value instead of an independently hardcoded guess two files
    # can silently drift apart from.
    solver_timeout_s: float = 30.0

    # NB: no `data_dir`. Puzzle-data ownership has moved to the Rust crate
    # (`csp-solver/data`, be-colocation manifest §2.5/§3.4); the old Python
    # `_load_templates`/`DATA_DIR` glob loader is deleted and `SudokuService`
    # calls `csp_solver.create_random_board(...)` alone, which owns its own
    # template bank (embedded via `include_dir!` when the crate ships it).

    # Split executors: board generation is cheap and bursty; solving is
    # expensive and slow. One shared implicit platform-default pool lets a
    # burst of slow solves starve board generation, and vice versa.
    random_executor_workers: int = 4
    solve_executor_workers: int = 4

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_comma_separated(cls, v: object) -> object:
        """Accept `SUDOKU_API_CORS_ORIGINS="a,b, c"` and `.strip()` each entry
        — an operator-set env var with a space after a comma must not silently
        break CORS for that origin. A JSON array (`'["a","b"]'`) still works
        via pydantic-settings' default complex-type parsing, tried first.
        """
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v


@lru_cache
def get_settings() -> Settings:
    """FastAPI dependency factory. `lru_cache` gives every request the same
    instance without a global; `app.dependency_overrides[get_settings]` swaps
    it cleanly in tests.
    """
    return Settings()
