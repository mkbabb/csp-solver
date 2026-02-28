"""Stress tests: known hard Sudoku puzzles across solver configurations.

These test correctness on adversarial instances. Run with -s to see the
performance comparison table.

    uv run python -m pytest tests/test_stress.py -v -s
"""

import time

import pytest

from csp_solver.solver.constraints import all_different_constraint, equals_constraint
from csp_solver.solver.csp import CSP, PruningType, VariableOrdering


def _make_sudoku(grid: list[int], N: int, ordering, gac, nogoods):
    M = N * N
    total = M * M
    csp = CSP(
        pruning_type=PruningType.FORWARD_CHECKING,
        variable_ordering=ordering,
        use_gac_alldiff=gac,
        use_nogoods=nogoods,
    )
    csp.add_variables(list(range(1, M + 1)), *range(total))
    given = {}
    for pos in range(total):
        if grid[pos] > 0:
            csp.add_constraint(equals_constraint(pos, grid[pos]))
            given[pos] = grid[pos]
    for row in range(M):
        csp.add_constraint(all_different_constraint(*[row * M + c for c in range(M)]))
    for col in range(M):
        csp.add_constraint(all_different_constraint(*[r * M + col for r in range(M)]))
    for bi in range(N):
        for bj in range(N):
            sg = [(bi * N + di) * M + (bj * N + dj) for di in range(N) for dj in range(N)]
            csp.add_constraint(all_different_constraint(*sg))
    return csp, given


# fmt: off
AL_ESCARGOT = [
    1,0,0,0,0,7,0,9,0, 0,3,0,0,2,0,0,0,8, 0,0,9,6,0,0,5,0,0,
    0,0,5,3,0,0,9,0,0, 0,1,0,0,8,0,0,0,2, 6,0,0,0,0,4,0,0,0,
    3,0,0,0,0,0,0,1,0, 0,4,0,0,0,0,0,0,7, 0,0,7,0,0,0,3,0,0,
]
PLATINUM_BLONDE = [
    0,0,0,0,0,0,0,1,2, 0,0,0,0,3,5,0,0,0, 0,0,0,6,0,0,0,7,0,
    7,0,0,0,0,0,3,0,0, 0,0,0,0,0,0,0,0,0, 0,0,1,0,0,0,0,0,8,
    0,4,0,0,0,2,0,0,0, 0,0,0,1,8,0,0,0,0, 2,5,0,0,0,0,0,0,0,
]
GOLDEN_NUGGET = [
    0,0,0,0,0,0,0,3,9, 0,0,0,0,0,1,0,0,5, 0,0,3,0,5,0,8,0,0,
    0,0,8,0,9,0,0,0,6, 0,7,0,0,0,2,0,0,0, 1,0,0,4,0,0,0,0,0,
    0,0,9,0,8,0,0,5,0, 0,2,0,0,0,0,6,0,0, 4,0,0,7,0,0,0,0,0,
]
INKALA_2010 = [
    0,0,5,3,0,0,0,0,0, 8,0,0,0,0,0,0,2,0, 0,7,0,0,1,0,5,0,0,
    4,0,0,0,0,5,3,0,0, 0,1,0,0,7,0,0,0,6, 0,0,3,2,0,0,0,8,0,
    0,6,0,5,0,0,0,0,9, 0,0,4,0,0,0,0,3,0, 0,0,0,0,0,9,7,0,0,
]
MINIMAL_17 = [
    0,0,0,0,0,0,0,1,0, 4,0,0,0,0,0,0,0,0, 0,2,0,0,0,0,0,0,0,
    0,0,0,0,5,0,4,0,7, 0,0,8,0,0,0,3,0,0, 0,0,1,0,9,0,0,0,0,
    3,0,0,4,0,0,2,0,0, 0,5,0,1,0,0,0,0,0, 0,0,0,8,0,6,0,0,0,
]
PUZZLE_16x16_MODERATE = [
     1, 0, 0, 4,  0, 6, 0, 8,  9, 0,11, 0, 13, 0,15, 0,
     0, 6, 0, 8,  0, 0,11, 0,  0,14, 0,16,  0, 2, 0, 4,
     9, 0,11, 0, 13, 0, 0,16,  1, 0, 3, 0,  5, 0, 7, 0,
     0,14, 0,16,  0, 2, 0, 4,  0, 6, 0, 8,  0,10, 0,12,
     2, 0, 0, 5,  0, 7, 0, 9, 10, 0,12, 0, 14, 0,16, 0,
     0, 7, 0, 9,  0, 0,12, 0,  0,15, 0, 1,  0, 3, 0, 5,
    10, 0,12, 0, 14, 0, 0, 1,  2, 0, 4, 0,  6, 0, 8, 0,
     0,15, 0, 1,  0, 3, 0, 5,  0, 7, 0, 9,  0,11, 0,13,
     3, 0, 0, 6,  0, 8, 0,10, 11, 0,13, 0, 15, 0, 1, 0,
     0, 8, 0,10,  0, 0,13, 0,  0,16, 0, 2,  0, 4, 0, 6,
    11, 0,13, 0, 15, 0, 0, 2,  3, 0, 5, 0,  7, 0, 9, 0,
     0,16, 0, 2,  0, 4, 0, 6,  0, 8, 0,10,  0,12, 0,14,
     4, 0, 0, 7,  0, 9, 0,11, 12, 0,14, 0, 16, 0, 2, 0,
     0, 9, 0,11,  0, 0,14, 0,  0, 1, 0, 3,  0, 5, 0, 7,
    12, 0,14, 0, 16, 0, 0, 3,  4, 0, 6, 0,  8, 0,10, 0,
     0, 1, 0, 3,  0, 5, 0, 7,  0, 9, 0,11,  0,13, 0,15,
]
PUZZLE_16x16_HARD = [
     1, 0, 0, 0,  0, 0, 0, 8,  0, 0, 0, 0,  0, 0,15, 0,
     0, 0, 0, 0,  0, 0,11, 0,  0,14, 0, 0,  0, 2, 0, 0,
     9, 0, 0, 0, 13, 0, 0, 0,  1, 0, 0, 0,  5, 0, 0, 0,
     0,14, 0, 0,  0, 2, 0, 0,  0, 0, 0, 8,  0, 0, 0,12,
     0, 0, 0, 5,  0, 0, 0, 0, 10, 0, 0, 0,  0, 0,16, 0,
     0, 7, 0, 0,  0, 0, 0, 0,  0, 0, 0, 1,  0, 3, 0, 0,
    10, 0, 0, 0, 14, 0, 0, 0,  0, 0, 4, 0,  6, 0, 0, 0,
     0, 0, 0, 1,  0, 3, 0, 0,  0, 7, 0, 0,  0, 0, 0,13,
     3, 0, 0, 0,  0, 0, 0,10,  0, 0, 0, 0,  0, 0, 1, 0,
     0, 8, 0, 0,  0, 0, 0, 0,  0, 0, 0, 2,  0, 4, 0, 0,
    11, 0, 0, 0, 15, 0, 0, 0,  3, 0, 0, 0,  7, 0, 0, 0,
     0, 0, 0, 2,  0, 4, 0, 0,  0, 8, 0, 0,  0, 0, 0,14,
     4, 0, 0, 0,  0, 0, 0, 0, 12, 0, 0, 0,  0, 0, 2, 0,
     0, 0, 0, 0,  0, 0,14, 0,  0, 1, 0, 0,  0, 5, 0, 0,
    12, 0, 0, 0, 16, 0, 0, 0,  4, 0, 0, 0,  8, 0, 0, 0,
     0, 1, 0, 0,  0, 5, 0, 0,  0, 0, 0,11,  0, 0, 0,15,
]
# fmt: on

FC = PruningType.FORWARD_CHECKING
FF = VariableOrdering.FAIL_FIRST
DW = VariableOrdering.DOM_WDEG

CONFIGS = [
    ("baseline",     FF, False, False),
    ("gac_alldiff",  FF, True,  False),
    ("dom_wdeg+gac", DW, True,  False),
    ("all_opt",      DW, True,  True),
]

HARD_9x9 = [
    ("Al Escargot",     AL_ESCARGOT),
    ("Platinum Blonde", PLATINUM_BLONDE),
    ("Golden Nugget",   GOLDEN_NUGGET),
    ("Inkala 2010",     INKALA_2010),
    ("17-clue minimal", MINIMAL_17),
]


_stress_results: list[dict] = []


# ── 9x9 stress tests ────────────────────────────────────────────────────────

@pytest.mark.parametrize("name,grid", HARD_9x9, ids=[n for n, _ in HARD_9x9])
@pytest.mark.parametrize(
    "cfg_name,ordering,gac,nogoods",
    CONFIGS,
    ids=[c[0] for c in CONFIGS],
)
def test_hard_9x9(name, grid, cfg_name, ordering, gac, nogoods):
    csp, given = _make_sudoku(grid, 3, ordering, gac, nogoods)
    t0 = time.perf_counter()
    csp.solve_with_initial_propagation(given)
    elapsed = (time.perf_counter() - t0) * 1000

    assert len(csp.solutions) >= 1, f"{cfg_name} failed on {name}"
    sol = csp.solutions[0]
    assert len(sol) == 81

    _stress_results.append({
        "puzzle": name, "config": cfg_name,
        "backtracks": csp.backtrack_count, "time_ms": elapsed,
    })


# ── 16x16 stress tests ──────────────────────────────────────────────────────

@pytest.mark.parametrize(
    "cfg_name,ordering,gac,nogoods",
    CONFIGS,
    ids=[c[0] for c in CONFIGS],
)
def test_16x16_moderate(cfg_name, ordering, gac, nogoods):
    csp, given = _make_sudoku(PUZZLE_16x16_MODERATE, 4, ordering, gac, nogoods)
    t0 = time.perf_counter()
    csp.solve_with_initial_propagation(given)
    elapsed = (time.perf_counter() - t0) * 1000

    assert len(csp.solutions) >= 1, f"{cfg_name} failed on 16x16 moderate"
    _stress_results.append({
        "puzzle": "16x16_mod", "config": cfg_name,
        "backtracks": csp.backtrack_count, "time_ms": elapsed,
    })


def test_16x16_hard_gac():
    """16x16 hard — only GAC alldiff can solve this in reasonable time."""
    csp, given = _make_sudoku(PUZZLE_16x16_HARD, 4, FF, True, False)
    t0 = time.perf_counter()
    csp.solve_with_initial_propagation(given)
    elapsed = (time.perf_counter() - t0) * 1000

    assert len(csp.solutions) >= 1, "GAC failed on 16x16 hard"
    _stress_results.append({
        "puzzle": "16x16_hard", "config": "gac_alldiff",
        "backtracks": csp.backtrack_count, "time_ms": elapsed,
    })


# ── No-regression: GAC <= baseline on every hard puzzle ──────────────────────

@pytest.mark.parametrize("name,grid", HARD_9x9, ids=[n for n, _ in HARD_9x9])
def test_gac_beats_baseline(name, grid):
    csp_b, gv_b = _make_sudoku(grid, 3, FF, False, False)
    csp_b.solve_with_initial_propagation(gv_b)

    csp_g, gv_g = _make_sudoku(grid, 3, FF, True, False)
    csp_g.solve_with_initial_propagation(gv_g)

    assert csp_g.backtrack_count <= csp_b.backtrack_count, (
        f"{name}: gac ({csp_g.backtrack_count}) > baseline ({csp_b.backtrack_count})"
    )


# ── Print table ──────────────────────────────────────────────────────────────

def test_print_stress_table(capsys):
    if not _stress_results:
        pytest.skip("No results")
    puzzles = list(dict.fromkeys(r["puzzle"] for r in _stress_results))
    configs = list(dict.fromkeys(r["config"] for r in _stress_results))
    lookup = {(r["puzzle"], r["config"]): r for r in _stress_results}

    col = 14
    hdr = f"{'Puzzle':<18}" + "".join(f"{c:>{col}}" for c in configs)
    sep = "-" * len(hdr)
    print(f"\n{sep}\nSTRESS: Backtracks\n{sep}\n{hdr}\n{sep}")
    for p in puzzles:
        row = f"{p:<18}"
        for c in configs:
            r = lookup.get((p, c))
            row += f"{r['backtracks']:>{col},}" if r else f"{'—':>{col}}"
        print(row)
    print(sep)
    print(f"\nSTRESS: Timing (ms)\n{sep}\n{hdr}\n{sep}")
    for p in puzzles:
        row = f"{p:<18}"
        for c in configs:
            r = lookup.get((p, c))
            row += f"{r['time_ms']:>{col},.1f}" if r else f"{'—':>{col}}"
        print(row)
    print(sep)
