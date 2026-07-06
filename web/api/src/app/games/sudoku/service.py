"""`SudokuService` — owns solve/generate orchestration + template loading.

`games/sudoku/router.py` is HTTP-concerns-only (status codes,
request/response shaping); this module owns the domain logic, injected via
`Depends(get_sudoku_service)`.

Two findings are excised here, not patched:

- **`_has_conflicts`** — a hand-rolled Python re-implementation of row/col/box
  `AllDifferent` (changing the response contract for trivial conflicts vs.
  deep ones with no documented reason) is gone. The Rust engine already
  rejects a conflicting board via its own propagation in sub-millisecond time
  (0.228 ms / 8 backtracks for a two-`5`s-in-a-row case). There is exactly one
  "no solution" path now.
- **`except Exception: return False, {}`** — a genuine crash propagates as a
  genuine Python exception and lands on the `Exception` catch-all in
  `core/errors.py` (-> 500/INTERNAL); a provably-unsatisfiable board raises
  `ApiError(UNSATISFIABLE, ...)` explicitly; a budget-exhausted search raises
  the typed `csp_solver.BudgetExceededError` from `solve_sudoku` itself. Three
  distinct causes, three distinct outcomes — never silently folded into one.
"""

from __future__ import annotations

import asyncio
import functools

import csp_solver  # type: ignore[import-untyped]  # PyO3 native module, no py.typed marker/stubs yet
from fastapi import Depends

from app.core.errors import ApiError, ApiErrorCode
from app.core.executors import Executors, get_executors
from app.core.settings import Settings, get_settings

# Route-level cap: exactly one solution. Cancel latency splits into a
# ~7-9 ms Rust-layer cost (size/GAC-independent) plus an unbounded
# O(solutions-found) GIL-held marshaling tail (6-19 us/solution) — inert at
# max_solutions=1, so this route caps it. Any future enumerate caller must
# interleave conversion instead (wave §Cancellation).
_MAX_SOLUTIONS = 1


class SudokuService:
    def __init__(self, settings: Settings, executors: Executors) -> None:
        self._settings = settings
        self._executors = executors

    async def get_random_board(self, size: int, difficulty: str) -> dict[str, int]:
        if size < 2 or size > 5:
            raise ApiError(ApiErrorCode.INVALID_INPUT, "size must be between 2 and 5")

        sudoku_difficulty = csp_solver.SudokuDifficulty.get(difficulty)
        if sudoku_difficulty is None:
            raise ApiError(ApiErrorCode.INVALID_INPUT, f"invalid difficulty: {difficulty}")

        # Locked N=5 policy: easy is pregenerated; medium/hard are rejected at
        # the API (the uniqueness-proof generation wall near the minimal-clue
        # frontier does not clear 60s, and GAC shifts it only ~6-9 density
        # points — do not re-open on propagation-strength gains alone). Enforced
        # explicitly here rather than by template-directory presence, since
        # puzzle-data ownership has moved to the Rust crate (be-colocation
        # manifest §2.5/§3.4) and no Python-side template dir is authoritative.
        if size == 5 and difficulty.upper() != "EASY":
            raise ApiError(ApiErrorCode.NOT_FOUND, f"N=5 {difficulty} is not available")

        # The Rust `create_random_board` owns puzzle data end-to-end: it selects
        # from its embedded template bank (`include_dir!`) when the crate ships
        # one, and hole-digs otherwise. There is no Python-side glob/`data_dir`.
        loop = asyncio.get_running_loop()
        board: dict[str, int] = await loop.run_in_executor(
            self._executors.random,
            functools.partial(
                csp_solver.create_random_board,
                N=size,
                difficulty=sudoku_difficulty,
            ),
        )
        return board

    async def solve_board(self, values: dict[str, int], size: int) -> tuple[bool, dict[str, int]]:
        m = size**2
        max_val = m
        max_pos = m**2 - 1
        for pos_str, val in values.items():
            pos = int(pos_str)
            if pos < 0 or pos > max_pos:
                raise ApiError(
                    ApiErrorCode.INVALID_INPUT, f"position {pos} out of range [0, {max_pos}]"
                )
            if val != 0 and (val < 1 or val > max_val):
                raise ApiError(
                    ApiErrorCode.INVALID_INPUT, f"value {val} out of range [1, {max_val}]"
                )

        # Cooperative cancellation handle: fired below if the wall-clock
        # deadline elapses, so the Rust search actually stops on its worker
        # thread instead of running on as a GIL-holding zombie (`asyncio.wait_for`
        # only abandons the awaiting coroutine, never the thread).
        cancel = csp_solver.CancelToken()

        def _solve() -> tuple[bool, dict[str, int]]:
            # `max_solutions=1` caps the route (see `_MAX_SOLUTIONS`). The node
            # budget is the Rust-side default (1_000_000 nodes) baked into
            # `solve_sudoku`'s internal `SolveConfig` — `solve_sudoku` does not
            # expose it as a tunable Python argument; the `CancelToken` is the
            # wall-clock stop layered on top.
            csp = csp_solver.create_sudoku_csp(N=size, values=values, max_solutions=_MAX_SOLUTIONS)
            # Documented asymmetry (kept, not "fixed"): `solve_sudoku` RAISES
            # `BudgetExceededError` when the search gave up with zero solutions
            # found (`solutions.is_empty() && budget_exceeded`); its single-call
            # sibling `solve_sudoku_board` instead returns a `SudokuCSP` with the
            # `budget_exceeded` flag set and never raises. This service uses the
            # raising two-call path deliberately, so a budget-exhausted search
            # lands on the shared `BudgetExceededError` -> 408/BUDGET_EXCEEDED
            # envelope handler rather than being silently reported as "no solution".
            csp_solver.solve_sudoku(csp, cancel=cancel)

            if not csp.solutions:
                # Search completed (budget not exceeded, not cancelled) and
                # found nothing: provably unsatisfiable — not a crash, not a
                # timeout. Explicit, not a silently-returned falsy pair.
                raise ApiError(
                    ApiErrorCode.UNSATISFIABLE, "no valid solution exists for this board"
                )

            solution = {str(k): int(v) for k, v in csp.solutions[0].items()}
            given = {k: v for k, v in values.items() if v != 0}
            already_solved = all(solution.get(k) == v for k, v in given.items())
            return already_solved, solution

        loop = asyncio.get_running_loop()
        try:
            return await asyncio.wait_for(
                loop.run_in_executor(self._executors.solve, _solve),
                timeout=self._settings.solver_timeout_s,
            )
        except TimeoutError as e:
            cancel.cancel()
            raise ApiError(
                ApiErrorCode.TIMEOUT, f"solver timed out after {self._settings.solver_timeout_s}s"
            ) from e


def get_sudoku_service(
    settings: Settings = Depends(get_settings),
    executors: Executors = Depends(get_executors),
) -> SudokuService:
    """FastAPI dependency factory. `Depends(get_settings)` /
    `Depends(get_executors)` are themselves injected as this dependency's own
    parameters, so overriding either in tests
    (`app.dependency_overrides[get_settings] = ...`) transitively changes what
    `SudokuService` sees, without `SudokuService` needing a bespoke override
    hook."""
    return SudokuService(settings, executors)
