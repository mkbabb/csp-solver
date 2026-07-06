"""Futoshiki board routes: random board generation and puzzle solving.

Thin HTTP-concerns-only router: status codes and request/response shaping
only. Domain logic (generation, validation, solve orchestration) lives in
`FutoshikiService` (`app/games/futoshiki/service.py`); the error taxonomy
lives in `app/core/errors.py` (reused verbatim — zero new codes/variants).

Route surface is deliberately smaller than Sudoku's: v1 ships no difficulty
parameter (F3), so generation is `GET /random/{board_size}` only, not
`/random/{size}/{difficulty}`. `board_size`, never `size` (F5) — see
`models.py`'s module docstring.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, Request

from app.core.limiter import limiter
from app.games.futoshiki.models import (
    FutoshikiBoardResponse,
    FutoshikiSolveRequest,
    FutoshikiSolveResponse,
)
from app.games.futoshiki.service import FutoshikiService, get_futoshiki_service

router = APIRouter(prefix="/futoshiki")


@router.get("/random/{board_size}")
@limiter.limit("60/minute")
async def get_random_board(
    request: Request,  # noqa: ARG001 — required by slowapi's decorator, not used directly
    board_size: int,
    service: FutoshikiService = Depends(get_futoshiki_service),
) -> FutoshikiBoardResponse:
    values, inequalities = await service.get_random_board(board_size)
    return FutoshikiBoardResponse(values=values, inequalities=inequalities, board_size=board_size)


@router.post("/solve")
@limiter.limit("30/minute")
async def solve_board(
    request: Request,  # noqa: ARG001 — required by slowapi's decorator, not used directly
    body: FutoshikiSolveRequest,
    service: FutoshikiService = Depends(get_futoshiki_service),
) -> FutoshikiSolveResponse:
    solved, values = await service.solve_board(body.values, body.inequalities, body.board_size)
    return FutoshikiSolveResponse(solved=solved, values=values)
