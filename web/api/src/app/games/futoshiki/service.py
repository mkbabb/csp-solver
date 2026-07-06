"""`FutoshikiService` — owns solve/generate orchestration, mirroring
`SudokuService`'s shape verbatim (split executors, `CancelToken` wall-clock
cancellation, one explicit "no solution" path).

Two differences from `SudokuService`, both load-bearing:

- **No difficulty parameter** (F3): `get_random_board` takes only
  `board_size` — v1 ships a single high-density tier, so there is no
  `NOT_FOUND`-on-missing-template-bank branch to replicate (Futoshiki
  generation is Rust-owned hole-digging every call, not a pregenerated-bank
  lookup like Sudoku's N=5 policy).
- **Adjacency is re-validated here too** (defense in depth, F4/G3): the
  Pydantic layer (`models.py::FutoshikiSolveRequest`) already rejects a
  non-adjacent pair before this method is ever reached over HTTP, but
  `solve_board` is also callable directly (tests, a future non-HTTP caller)
  bypassing that model entirely — so the same
  `validate_adjacent_inequalities` helper runs again here, translated into
  `ApiError(INVALID_INPUT)` instead of a `pydantic.ValidationError`. The
  Rust (`FutoshikiPuzzle::from_parts`) and PyO3 boundaries validate a third
  and fourth time independently — G3's "negative control per layer" is
  deliberately redundant, not deduplicated away.
"""

from __future__ import annotations

import asyncio
import functools

import csp_solver  # type: ignore[import-untyped]  # PyO3 native module, no py.typed marker/stubs yet
from fastapi import Depends

from app.core.errors import ApiError, ApiErrorCode
from app.core.executors import Executors, get_executors
from app.core.settings import Settings, get_settings
from app.games.futoshiki.models import validate_adjacent_inequalities

# Route-level cap: exactly one solution — same rationale as SudokuService's
# `_MAX_SOLUTIONS` (see that module's docstring re: the O(solutions-found)
# GIL-held marshaling tail).
_MAX_SOLUTIONS = 1

# v1 locked scope (F2/F3): N=4-7, single high-density tier. Below N=4 the
# generation floor is untested; above N=7 the density cliff is unmeasured
# for the shipped tier (rust-surgeon's G1 probe stops at N=8, out of scope).
_MIN_BOARD_SIZE = 4
_MAX_BOARD_SIZE = 7


class FutoshikiService:
    def __init__(self, settings: Settings, executors: Executors) -> None:
        self._settings = settings
        self._executors = executors

    async def get_random_board(
        self, board_size: int
    ) -> tuple[dict[str, int], list[tuple[int, int]]]:
        if board_size < _MIN_BOARD_SIZE or board_size > _MAX_BOARD_SIZE:
            raise ApiError(
                ApiErrorCode.INVALID_INPUT,
                f"board_size must be between {_MIN_BOARD_SIZE} and {_MAX_BOARD_SIZE}",
            )

        # Rust-owned generation end-to-end (uniqueness-checked hole-digging,
        # `generate.rs`'s `generate_futoshiki`) — no Python-side template
        # dir, no difficulty branch, matching this wave's locked v1 scope.
        # `create_random_futoshiki` returns a `FutoshikiBoard` (not a tuple):
        # `.values`/`.inequalities`/`.board_size` getters, mirroring
        # `SudokuCSP`'s attribute shape.
        loop = asyncio.get_running_loop()
        board = await loop.run_in_executor(
            self._executors.random,
            functools.partial(csp_solver.create_random_futoshiki, board_size=board_size),
        )
        return board.values, board.inequalities

    async def solve_board(
        self,
        values: dict[str, int],
        inequalities: list[tuple[int, int]],
        board_size: int,
    ) -> tuple[bool, dict[str, int]]:
        if board_size < _MIN_BOARD_SIZE or board_size > _MAX_BOARD_SIZE:
            raise ApiError(
                ApiErrorCode.INVALID_INPUT,
                f"board_size must be between {_MIN_BOARD_SIZE} and {_MAX_BOARD_SIZE}",
            )

        total = board_size * board_size
        for pos_str, val in values.items():
            pos = int(pos_str)
            if pos < 0 or pos >= total:
                raise ApiError(
                    ApiErrorCode.INVALID_INPUT, f"position {pos} out of range [0, {total})"
                )
            if val != 0 and (val < 1 or val > board_size):
                raise ApiError(
                    ApiErrorCode.INVALID_INPUT,
                    f"value {val} out of range [1, {board_size}]",
                )

        # G3 defense in depth (see module docstring) — same geometry the
        # Pydantic model validates, re-run here for direct/non-HTTP callers.
        try:
            validate_adjacent_inequalities(board_size, inequalities)
        except ValueError as e:
            raise ApiError(ApiErrorCode.INVALID_INPUT, str(e)) from e

        # Cooperative cancellation handle — same wall-clock-stop pattern as
        # SudokuService.solve_board.
        cancel = csp_solver.CancelToken()

        def _solve() -> tuple[bool, dict[str, int]]:
            csp = csp_solver.create_futoshiki_csp(
                board_size=board_size,
                values=values,
                inequalities=inequalities,
                max_solutions=_MAX_SOLUTIONS,
            )
            csp_solver.solve_futoshiki(csp, cancel=cancel)

            if not csp.solutions:
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


def get_futoshiki_service(
    settings: Settings = Depends(get_settings),
    executors: Executors = Depends(get_executors),
) -> FutoshikiService:
    """FastAPI dependency factory — same override-through-DI shape as
    `get_sudoku_service`."""
    return FutoshikiService(settings, executors)
