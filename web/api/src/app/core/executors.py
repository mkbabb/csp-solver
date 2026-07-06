"""Split, explicitly-sized thread pool executors.

Neither `/board/random` nor `/board/solve` used to specify an executor —
both silently shared Python's platform-default `ThreadPoolExecutor`
(`min(32, cpu_count+4)` workers), with no isolation between cheap board
generation and expensive solving. A burst of slow solves could starve
board generation and vice versa. This gives each route its own bounded
pool, built once at app startup (see `main.py`'s lifespan) and torn down
at shutdown.
"""

from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass

from fastapi import Request


@dataclass(slots=True)
class Executors:
    random: ThreadPoolExecutor
    solve: ThreadPoolExecutor

    def shutdown(self) -> None:
        self.random.shutdown(wait=False, cancel_futures=True)
        self.solve.shutdown(wait=False, cancel_futures=True)


def get_executors(request: Request) -> Executors:
    """FastAPI dependency — reads the pools built once at app startup off
    `app.state`. Overridable in tests via
    `app.dependency_overrides[get_executors]`."""
    # `Starlette.State` attribute access is untyped (`Any`) by design; the
    # assert is the one place that boundary is made explicit instead of
    # leaking `Any` into every caller's inferred return type.
    executors = request.app.state.executors
    assert isinstance(executors, Executors)
    return executors
