"""Rust CSP solver performance benchmarks.

Validates solve times on canonical hard puzzles.
"""

import time

import pytest

csp_solver = pytest.importorskip("csp_solver")

HARD_PUZZLES = {
    "Al Escargot": "100007090030020008009600500005300900010080002600004000300000010040000007007000300",
    "Platinum Blonde": "000000012000000003002300400001800005060070800000009000008500000900040500470006000",
    "Golden Nugget": "000000039000001005003050800008090006070002000100400000009080050020000600400700000",
    "Inkala 2010": "005300000800000020070010500400005300010070006003200080060500009004000030000009700",
    "17-clue minimal": "000000010400000000020000000000050407008000300001090000300400200050100000000806000",
}


def solve_rust(puzzle_str: str) -> tuple[float, int]:
    values = {str(i): int(c) for i, c in enumerate(puzzle_str) if c != "0"}
    csp = csp_solver.create_sudoku_csp(N=3, values=values)
    start = time.perf_counter()
    csp_solver.solve_sudoku(csp)
    elapsed = (time.perf_counter() - start) * 1000
    return elapsed, csp.backtrack_count


@pytest.mark.parametrize("name,puzzle", list(HARD_PUZZLES.items()))
def test_solve_under_50ms(name: str, puzzle: str):
    """Each hard puzzle must solve in under 50ms."""
    elapsed, bt = solve_rust(puzzle)
    assert elapsed < 50, f"{name}: {elapsed:.2f}ms (expected <50ms)"


def test_print_performance_table():
    """Print solve times for all hard puzzles."""
    print(f"\n{'Puzzle':25} {'Time':>10} {'Backtracks':>12}")
    print("-" * 50)
    for name, puzzle in HARD_PUZZLES.items():
        times = [solve_rust(puzzle)[0] for _ in range(3)]
        bt = solve_rust(puzzle)[1]
        best = min(times)
        print(f"{name:25} {best:>9.2f}ms {bt:>12}")
