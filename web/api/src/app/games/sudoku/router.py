"""Sudoku board routes: random board generation and puzzle solving.

Thin HTTP-concerns-only router: status codes and request/response shaping
only. Domain logic (template loading, validation, solve orchestration) lives
in `SudokuService` (`app/games/sudoku/service.py`); the error taxonomy lives
in `app/core/errors.py`.

Rate limiting: `slowapi` was previously wired up (`main.py`) but applied to
zero routes — decorative, not protective. Both routes below carry a real
`@limiter.limit(...)`: `/random` loose, `/solve` strict.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from app.core.limiter import limiter
from app.games.sudoku.models import BoardResponse, Difficulty, SolveRequest, SolveResponse
from app.games.sudoku.service import SudokuService, get_sudoku_service

router = APIRouter(prefix="/board")


@router.get("/random/{size}/{difficulty}")
@limiter.limit("60/minute")
async def get_random_board(
    request: Request,  # noqa: ARG001 — required by slowapi's decorator, not used directly
    size: int,
    difficulty: Difficulty,
    service: SudokuService = Depends(get_sudoku_service),
) -> BoardResponse:
    values = await service.get_random_board(size, difficulty.value)
    return BoardResponse(values=values, size=size)


@router.post("/solve")
@limiter.limit("30/minute")
async def solve_board(
    request: Request,  # noqa: ARG001 — required by slowapi's decorator, not used directly
    body: SolveRequest,
    service: SudokuService = Depends(get_sudoku_service),
) -> SolveResponse:
    solved, values = await service.solve_board(body.values, body.size)
    return SolveResponse(solved=solved, values=values)
