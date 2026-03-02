#!/usr/bin/env python3
"""Generate pre-computed puzzle templates for fast board generation.

Run from backend/:
    uv run python scripts/generate_templates.py

Generates templates at data/sudoku_puzzles/{N}/{difficulty}/template-{i}.json
Each template contains: {"solution": {...}, "puzzle": {...}, "backtracks": int}
"""

import json
import math
import pathlib
import random
import sys
import time

# Add backend src to path
sys.path.insert(0, str(pathlib.Path(__file__).parent.parent / "src"))

from csp_solver.solver.sudoku import (
    SudokuDifficulty,
    _has_unique_solution,
    _measure_difficulty,
    create_sudoku_csp,
    solve_sudoku,
)

DATA_DIR = pathlib.Path(__file__).parent.parent / "src" / "csp_solver" / "data"
OUTPUT_DIR = DATA_DIR / "sudoku_puzzles"

# Template counts per N. N=4,5 use fewer because generation is slow (~minutes/puzzle).
TEMPLATE_COUNTS: dict[int, int] = {
    2: 10,
    3: 20,
    4: 5,
    5: 2,
}

# Per-N difficulty thresholds: {N: {difficulty: (min_bt, max_bt)}}
# N=2 (4x4) is trivial — solver never backtracks, so accept 0 for all difficulties.
DIFFICULTY_THRESHOLDS: dict[int, dict[SudokuDifficulty, tuple[int, int]]] = {
    # N=2 (4x4) and N=4 (16x16): solver never backtracks with FC+GAC+dom/wdeg.
    # N=5 (25x25): similarly trivial for the solver. Accept 0 for all difficulties.
    2: {d: (0, 0) for d in SudokuDifficulty},
    4: {d: (0, 0) for d in SudokuDifficulty},
    5: {d: (0, 0) for d in SudokuDifficulty},
}
DEFAULT_THRESHOLDS = {
    SudokuDifficulty.EASY: (0, 0),
    SudokuDifficulty.MEDIUM: (1, 50),
    SudokuDifficulty.HARD: (100, 100_000),
}


def generate_solution(N: int) -> dict[str, int]:
    """Generate a complete valid Sudoku solution."""
    M = N ** 2
    first_row = list(range(1, M + 1))
    random.shuffle(first_row)

    values = {str(i): first_row[i] for i in range(M)}
    csp = create_sudoku_csp(N=N, values=values, max_solutions=1)
    solve_sudoku(csp)

    if csp.solutions:
        return {str(k): int(v) for k, v in csp.solutions[0].items()}
    raise RuntimeError(f"Failed to generate solution for N={N}")


def create_puzzle_from_solution(
    N: int,
    solution: dict[str, int],
    difficulty: SudokuDifficulty,
) -> tuple[dict[str, int], int] | None:
    """Dig holes from a solution to create a puzzle at target difficulty.

    Returns (puzzle, backtracks) or None if difficulty target not met.
    """
    M = N ** 2
    total = M ** 2

    thresholds = DIFFICULTY_THRESHOLDS.get(N, DEFAULT_THRESHOLDS)
    min_bt, max_bt = thresholds[difficulty]

    # Target removal counts based on difficulty
    if difficulty == SudokuDifficulty.EASY:
        target_remove = total // 4
    elif difficulty == SudokuDifficulty.MEDIUM:
        target_remove = int(total / 1.75)
    else:
        target_remove = int(total / 1.25)

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

    # Measure difficulty
    backtracks = _measure_difficulty(N, board)

    # For EASY/MEDIUM, if too hard, restore cells
    if difficulty in (SudokuDifficulty.EASY, SudokuDifficulty.MEDIUM):
        empty_positions = [p for p in positions if board[p] == 0]
        random.shuffle(empty_positions)
        for pos in empty_positions:
            if backtracks <= max_bt:
                break
            board[pos] = solution[pos]
            backtracks = _measure_difficulty(N, board)

    # Check if difficulty target met
    if min_bt <= backtracks <= max_bt:
        return board, backtracks

    return None


def generate_templates(N: int, difficulty: SudokuDifficulty, count: int) -> list[dict]:
    """Generate `count` puzzle templates for given N and difficulty."""
    templates = []
    attempts = 0
    max_attempts = count * 20  # give up after too many failures

    while len(templates) < count and attempts < max_attempts:
        attempts += 1
        try:
            solution = generate_solution(N)
        except RuntimeError:
            continue

        result = create_puzzle_from_solution(N, solution, difficulty)
        if result is not None:
            puzzle, backtracks = result
            templates.append({
                "solution": solution,
                "puzzle": puzzle,
                "backtracks": backtracks,
            })
            print(f"  [{len(templates)}/{count}] backtracks={backtracks}")

    return templates


def main():
    sizes = [2, 3, 4, 5]

    # Allow filtering by size via CLI args
    if len(sys.argv) > 1:
        sizes = [int(x) for x in sys.argv[1:]]

    for N in sizes:
        count = TEMPLATE_COUNTS.get(N, 10)
        M = N ** 2

        for difficulty in SudokuDifficulty:
            diff_name = difficulty.name.lower()
            out_dir = OUTPUT_DIR / str(N) / diff_name
            out_dir.mkdir(parents=True, exist_ok=True)

            # Skip if already generated
            existing = list(out_dir.glob("template-*.json"))
            if len(existing) >= count:
                print(f"N={N} {diff_name}: {len(existing)} templates exist, skipping")
                continue

            print(f"N={N} {diff_name}: generating {count} templates ({M}x{M} grid)...")
            start = time.time()
            templates = generate_templates(N, difficulty, count)
            elapsed = time.time() - start

            for i, template in enumerate(templates):
                filepath = out_dir / f"template-{i}.json"
                filepath.write_text(json.dumps(template))

            print(f"  Done: {len(templates)} templates in {elapsed:.1f}s\n")


if __name__ == "__main__":
    main()
