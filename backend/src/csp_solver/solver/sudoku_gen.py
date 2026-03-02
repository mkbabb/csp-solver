"""Sudoku board generation: solution creation, hole-digging, difficulty calibration."""

import json
import pathlib
import random

from csp_solver.solver.sudoku import (
    SudokuDifficulty,
    create_sudoku_csp,
    solve_sudoku,
)

DATA_DIR = pathlib.Path(__file__).parent.parent / "data"


def _load_solution_board(N: int) -> dict[str, int]:
    """Load a random pre-computed solution board for size N."""
    solution_dir = DATA_DIR / "sudoku_solutions" / str(N)
    if not solution_dir.exists():
        raise FileNotFoundError(f"No solution directory for N={N}: {solution_dir}")

    solutions = list(solution_dir.glob("*.json"))
    if not solutions:
        raise FileNotFoundError(f"No solution files in {solution_dir}")

    filepath = random.choice(solutions)
    board = json.loads(filepath.read_text())

    # Normalize: ensure all values are integers (fixes N=3 string issue)
    return {str(k): int(v) for k, v in board.items()}


def _generate_solution(N: int) -> dict[str, int]:
    """Generate a complete Sudoku solution on-the-fly.

    Seeds the first row with a random permutation, then solves.
    """
    M = N**2
    first_row = list(range(1, M + 1))
    random.shuffle(first_row)

    values = {str(i): first_row[i] for i in range(M)}
    csp = create_sudoku_csp(N=N, values=values, max_solutions=1)
    solve_sudoku(csp)

    if csp.solutions:
        return {str(k): int(v) for k, v in csp.solutions[0].items()}

    raise RuntimeError(f"Failed to generate solution for N={N}")


def _has_unique_solution(N: int, board: dict[str, int]) -> bool:
    """Check if a board has exactly one solution."""
    values = {k: v for k, v in board.items() if v != 0}
    csp = create_sudoku_csp(N=N, values=values, max_solutions=2)
    solve_sudoku(csp)
    return len(csp.solutions) == 1


def _measure_difficulty(N: int, board: dict[str, int]) -> int:
    """Measure puzzle difficulty by counting backtracks needed to solve."""
    values = {k: v for k, v in board.items() if v != 0}
    csp = create_sudoku_csp(N=N, values=values, max_solutions=1)
    solve_sudoku(csp)
    return csp.backtrack_count


def create_random_board(
    N: int,
    difficulty: SudokuDifficulty = SudokuDifficulty.EASY,
) -> dict[str, int]:
    """Generate a random Sudoku board with uniqueness-verified hole digging.

    For N<=3, dynamically generates solutions. For N>=4, uses pre-computed boards.
    Difficulty is calibrated by backtrack count:
    - EASY: 0 backtracks (solvable by naked singles / forward checking alone)
    - MEDIUM: < 50 backtracks
    - HARD: > 100 backtracks
    """
    M = N**2
    total = M**2

    # Get a complete solution
    try:
        if N <= 3:
            try:
                solution = _generate_solution(N)
            except RuntimeError:
                solution = _load_solution_board(N)
        else:
            solution = _load_solution_board(N)
    except FileNotFoundError:
        solution = _generate_solution(N)

    # Target removal counts based on difficulty
    if difficulty == SudokuDifficulty.EASY:
        target_remove = total // 4
    elif difficulty == SudokuDifficulty.MEDIUM:
        target_remove = int(total / 1.75)
    else:
        target_remove = int(total / 1.25)

    # Dig holes with uniqueness verification
    board = dict(solution)
    positions = list(board.keys())
    random.shuffle(positions)

    removed = 0
    for pos in positions:
        if removed >= target_remove:
            break

        old_val = board[pos]
        board[pos] = 0

        if _has_unique_solution(N, board):
            removed += 1
        else:
            board[pos] = old_val

    # For EASY/MEDIUM, verify difficulty matches expectations
    # If the puzzle is too hard for its category, restore some cells
    if difficulty in (SudokuDifficulty.EASY, SudokuDifficulty.MEDIUM):
        backtracks = _measure_difficulty(N, board)
        max_backtracks = 0 if difficulty == SudokuDifficulty.EASY else 50

        # If too hard, restore cells until difficulty target met
        empty_positions = [p for p in positions if board[p] == 0]
        random.shuffle(empty_positions)
        for pos in empty_positions:
            if backtracks <= max_backtracks:
                break
            board[pos] = solution[pos]
            backtracks = _measure_difficulty(N, board)

    return board
