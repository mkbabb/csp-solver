"""Validate the Rust CSP solver backend via PyO3.

Tests generate + solve across board sizes (4×4, 9×9, 16×16) and
verifies backtrack counts on canonical hard puzzles.
"""

import math
import time

import pytest

sudoku_rs = pytest.importorskip("sudoku_rs")
from sudoku_rs import SudokuDifficulty, create_random_board, create_sudoku_csp, solve_sudoku


def is_valid_solution(solution: dict[str, int], n: int) -> bool:
    """Check that a solution dict is a valid completed Sudoku board."""
    m = n * n
    total = m * m

    if len(solution) != total:
        return False

    grid = [0] * total
    for pos_str, val in solution.items():
        pos = int(pos_str)
        if pos < 0 or pos >= total:
            return False
        if val < 1 or val > m:
            return False
        grid[pos] = val

    # Rows
    for r in range(m):
        row = [grid[r * m + c] for c in range(m)]
        if len(set(row)) != m:
            return False

    # Columns
    for c in range(m):
        col = [grid[r * m + c] for r in range(m)]
        if len(set(col)) != m:
            return False

    # Sub-grids
    for bi in range(n):
        for bj in range(n):
            cells = []
            for di in range(n):
                for dj in range(n):
                    cells.append(grid[(bi * n + di) * m + (bj * n + dj)])
            if len(set(cells)) != m:
                return False

    return True


# ── Board generation + solving ───────────────────────────────────────────────


@pytest.mark.parametrize("n", [2, 3])
def test_generate_and_solve(n: int):
    """Generate a board and verify it's solvable with a valid solution."""
    board = create_random_board(n, SudokuDifficulty.EASY)
    assert isinstance(board, dict)
    assert len(board) == (n**2) ** 2

    csp = create_sudoku_csp(n, board)
    solved = solve_sudoku(csp)
    assert solved, f"Generated {n**2}x{n**2} board should be solvable"
    assert len(csp.solutions) == 1
    assert is_valid_solution(csp.solutions[0], n)


def test_generate_16x16():
    """16×16 generation + solve — the stress test."""
    board = create_random_board(4, SudokuDifficulty.EASY)
    assert len(board) == 256

    csp = create_sudoku_csp(4, board)
    solved = solve_sudoku(csp)
    assert solved, "Generated 16x16 board should be solvable"
    assert is_valid_solution(csp.solutions[0], 4)


# ── Canonical hard 9×9 puzzles ───────────────────────────────────────────────

HARD_PUZZLES = {
    "Al Escargot": "100007090030020008009600500005300900010080002600004000300000010040000007007000300",
    "Platinum Blonde": "000000012000000003002300400001800005060070800000009000008500000900040500470006000",
    "Golden Nugget": "000000039000001005003050800008090006070002000100400000009080050020000600400700000",
    "Inkala 2010": "005300000800000020070010500400005300010070006003200080060500009004000030000009700",
    "17-clue minimal": "000000010400000000020000000000050407008000300001090000300400200050100000000806000",
}


@pytest.mark.parametrize("name,puzzle", list(HARD_PUZZLES.items()))
def test_hard_9x9(name: str, puzzle: str):
    """Solve canonical hard 9×9 puzzles and verify valid solution."""
    values = {str(i): int(c) for i, c in enumerate(puzzle) if c != "0"}
    csp = create_sudoku_csp(3, values)
    solved = solve_sudoku(csp)
    assert solved, f"{name} should be solvable"
    assert is_valid_solution(csp.solutions[0], 3), f"{name} solution must be valid"


# ── SudokuDifficulty enum ────────────────────────────────────────────────────


def test_difficulty_enum():
    d = SudokuDifficulty.get("EASY")
    assert d is not None

    d2 = SudokuDifficulty.get("INVALID")
    assert d2 is None

    d3 = SudokuDifficulty.get("INVALID", SudokuDifficulty.MEDIUM)
    assert d3 is not None


# ── Performance sanity ───────────────────────────────────────────────────────


def test_performance_sanity():
    """Rust solver should handle Al Escargot in under 50ms."""
    puzzle = HARD_PUZZLES["Al Escargot"]
    values = {str(i): int(c) for i, c in enumerate(puzzle) if c != "0"}

    start = time.perf_counter()
    csp = create_sudoku_csp(3, values)
    solve_sudoku(csp)
    elapsed_ms = (time.perf_counter() - start) * 1000

    assert elapsed_ms < 50, f"Al Escargot took {elapsed_ms:.1f}ms (expected <50ms)"
    assert csp.backtrack_count < 500, f"Too many backtracks: {csp.backtrack_count}"
