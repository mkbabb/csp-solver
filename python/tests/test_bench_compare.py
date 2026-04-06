"""Cross-language benchmark: Python solver vs Rust solver via PyO3.

Rust must equal or exceed Python on every instance.
This is the permanent regression gate before Python solver removal.
"""

import time

import pytest

from csp_solver_py.solver.constraints import all_different_constraint
from csp_solver_py.solver.csp import CSP, PruningType, VariableOrdering
from csp_solver_py.solver.sudoku import SudokuDifficulty, create_sudoku_csp, solve_sudoku

csp_solver = pytest.importorskip("csp_solver")

HARD_PUZZLES = {
    "Al Escargot": "100007090030020008009600500005300900010080002600004000300000010040000007007000300",
    "Platinum Blonde": "000000012000000003002300400001800005060070800000009000008500000900040500470006000",
    "Golden Nugget": "000000039000001005003050800008090006070002000100400000009080050020000600400700000",
    "Inkala 2010": "005300000800000020070010500400005300010070006003200080060500009004000030000009700",
    "17-clue minimal": "000000010400000000020000000000050407008000300001090000300400200050100000000806000",
}


def solve_python(puzzle_str: str) -> tuple[float, int]:
    """Solve with Python CSP solver. Returns (time_ms, backtracks)."""
    values = {str(i): int(c) for i, c in enumerate(puzzle_str) if c != "0"}
    csp = create_sudoku_csp(N=3, values=values)
    start = time.perf_counter()
    solve_sudoku(csp)
    elapsed = (time.perf_counter() - start) * 1000
    return elapsed, csp.backtrack_count


def solve_rust(puzzle_str: str) -> tuple[float, int]:
    """Solve with Rust CSP solver via PyO3. Returns (time_ms, backtracks)."""
    values = {str(i): int(c) for i, c in enumerate(puzzle_str) if c != "0"}
    csp = csp_solver.create_sudoku_csp(N=3, values=values)
    start = time.perf_counter()
    csp_solver.solve_sudoku(csp)
    elapsed = (time.perf_counter() - start) * 1000
    return elapsed, csp.backtrack_count


@pytest.mark.parametrize("name,puzzle", list(HARD_PUZZLES.items()))
def test_rust_faster_than_python(name: str, puzzle: str):
    """Rust must be faster than Python on every hard puzzle."""
    py_time, py_bt = solve_python(puzzle)
    rs_time, rs_bt = solve_rust(puzzle)

    print(f"\n  {name}:")
    print(f"    Python: {py_time:.2f}ms, {py_bt} backtracks")
    print(f"    Rust:   {rs_time:.2f}ms, {rs_bt} backtracks")
    print(f"    Speedup: {py_time / rs_time:.1f}×")

    assert rs_time < py_time, (
        f"{name}: Rust ({rs_time:.2f}ms) must be faster than Python ({py_time:.2f}ms)"
    )


def test_print_comparison_table():
    """Print a formatted comparison table."""
    results = {}
    for name, puzzle in HARD_PUZZLES.items():
        py_time, py_bt = solve_python(puzzle)
        rs_time, rs_bt = solve_rust(puzzle)
        results[name] = (py_time, py_bt, rs_time, rs_bt)

    print("\n" + "-" * 72)
    print(f"{'Puzzle':25} {'Python':>10} {'Rust':>10} {'Speedup':>10} {'Py bt':>8} {'Rs bt':>8}")
    print("-" * 72)
    for name, (py_t, py_bt, rs_t, rs_bt) in results.items():
        speedup = py_t / rs_t if rs_t > 0 else float("inf")
        print(f"{name:25} {py_t:>9.2f}ms {rs_t:>9.2f}ms {speedup:>9.1f}× {py_bt:>8} {rs_bt:>8}")
    print("-" * 72)
