"""Board routes: random board generation and puzzle solving."""

import asyncio
import functools
import json
import pathlib

from fastapi import APIRouter, HTTPException

from app.api.models.board import (
    BoardResponse,
    Difficulty,
    SolveRequest,
    SolveResponse,
)
from csp_solver import (
    SudokuDifficulty,
    create_random_board,
    create_sudoku_csp,
    solve_sudoku,
)

# ── Template loading (cached per-process) ────────────────────────────────────

DATA_DIR = pathlib.Path(__file__).resolve().parent.parent.parent / "data"


@functools.cache
def _load_templates(n: int, difficulty_name: str) -> list[dict[str, int]]:
    """Load pre-computed puzzle templates from disk. Cached per (n, difficulty)."""
    template_dir = DATA_DIR / "sudoku_puzzles" / str(n) / difficulty_name
    if not template_dir.exists():
        return []
    templates = []
    for filepath in sorted(template_dir.glob("template-*.json")):
        data = json.loads(filepath.read_text())
        templates.append({str(k): int(v) for k, v in data["puzzle"].items()})
    return templates

router = APIRouter(prefix="/board")


def _has_conflicts(given: dict[str, int], board_size: int) -> bool:
    """Check if given values violate any Sudoku row/col/subgrid constraint."""
    import math

    N = int(math.isqrt(board_size))

    # Group values by row, column, and subgrid
    rows: dict[int, list[int]] = {}
    cols: dict[int, list[int]] = {}
    boxes: dict[tuple[int, int], list[int]] = {}

    for pos_str, val in given.items():
        pos = int(pos_str)
        r, c = divmod(pos, board_size)
        box = (r // N, c // N)

        rows.setdefault(r, []).append(val)
        cols.setdefault(c, []).append(val)
        boxes.setdefault(box, []).append(val)

    for group in (*rows.values(), *cols.values(), *boxes.values()):
        if len(group) != len(set(group)):
            return True
    return False

SOLVER_TIMEOUT = 30  # seconds


@router.get("/random/{size}/{difficulty}")
async def get_random_board(size: int, difficulty: Difficulty) -> BoardResponse:
    if size < 2 or size > 5:
        raise HTTPException(status_code=400, detail="Size must be between 2 and 5")

    sudoku_difficulty = SudokuDifficulty.get(difficulty.value)
    if sudoku_difficulty is None:
        raise HTTPException(status_code=400, detail=f"Invalid difficulty: {difficulty}")

    try:
        templates = _load_templates(size, difficulty.value.lower())
        board = await asyncio.to_thread(
            create_random_board,
            N=size,
            difficulty=sudoku_difficulty,
            templates=templates or None,
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Board generation failed: {e}")

    return BoardResponse(values=board, size=size)


@router.post("/solve")
async def solve_board(request: SolveRequest) -> SolveResponse:
    M = request.size**2
    max_val = M
    max_pos = M**2 - 1

    # Validate values are within valid range
    for pos_str, val in request.values.items():
        pos = int(pos_str)
        if pos < 0 or pos > max_pos:
            raise HTTPException(
                status_code=400,
                detail=f"Position {pos} out of range [0, {max_pos}]",
            )
        if val != 0 and (val < 1 or val > max_val):
            raise HTTPException(
                status_code=400,
                detail=f"Value {val} out of range [1, {max_val}]",
            )

    def _solve() -> tuple[bool, dict[str, int]]:
        # Pre-validate given values for row/col/subgrid conflicts
        given = {k: v for k, v in request.values.items() if v != 0}
        if _has_conflicts(given, M):
            return False, dict(request.values)

        csp = create_sudoku_csp(N=request.size, values=request.values)
        try:
            solve_sudoku(csp)
        except Exception:
            return False, {}

        if len(csp.solutions) == 0:
            return False, {}

        solution = {str(k): int(v) for k, v in csp.solutions[0].items()}
        already_solved = all(solution.get(k) == v for k, v in given.items())
        return already_solved, solution

    try:
        solved, values = await asyncio.wait_for(
            asyncio.to_thread(_solve),
            timeout=SOLVER_TIMEOUT,
        )
    except asyncio.TimeoutError:
        raise HTTPException(
            status_code=408,
            detail=f"Solver timed out after {SOLVER_TIMEOUT}s",
        )

    if not values:
        raise HTTPException(status_code=400, detail="No valid solution found")

    return SolveResponse(solved=solved, values=values)
