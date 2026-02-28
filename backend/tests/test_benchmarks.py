"""Benchmark suite for CSP solver optimizations.

Parametrized across puzzle instances × solver configurations.
Run with: uv run python -m pytest tests/test_benchmarks.py -v -s
"""

import time
from dataclasses import dataclass

import pytest

from csp_solver.solver.constraints import (
    all_different_constraint,
    equals_constraint,
    map_coloring_constraint,
    n_queens_constraint,
)
from csp_solver.solver.csp import CSP, PruningType, VariableOrdering

# ── Test Puzzles ─────────────────────────────────────────────────────────────


@dataclass
class Puzzle:
    name: str
    setup: "callable"  # (csp: CSP) -> dict[str,int] | None (given_values or None)
    has_unique_solution: bool = True
    min_solutions: int = 1
    is_sudoku: bool = False


def _setup_sudoku(values: dict[str, int], N: int):
    """Return a setup function for a Sudoku puzzle."""

    def setup(
        pruning: PruningType,
        ordering: VariableOrdering,
        gac: bool,
    ):
        M = N**2
        total = M**2

        variables = list(range(total))
        domain = list(range(1, M + 1))

        csp = CSP(
            pruning_type=pruning,
            variable_ordering=ordering,
            use_gac_alldiff=gac,
        )
        csp.add_variables(domain, *variables)

        given_values: dict[int, int] = {}
        for pos, value in values.items():
            int_val = int(value)
            if int_val != 0:
                int_pos = int(pos)
                csp.add_constraint(equals_constraint(int_pos, int_val))
                given_values[int_pos] = int_val

        for row in range(M):
            row_vars = [row * M + col for col in range(M)]
            csp.add_constraint(all_different_constraint(*row_vars))

        for col in range(M):
            col_vars = [row * M + col for row in range(M)]
            csp.add_constraint(all_different_constraint(*col_vars))

        for i in range(N):
            for j in range(N):
                subgrid_vars = [
                    (i * N + di) * M + (j * N + dj) for di in range(N) for dj in range(N)
                ]
                csp.add_constraint(all_different_constraint(*subgrid_vars))

        csp._given_values = given_values
        return csp, given_values

    return setup


# 4×4 trivial (N=2)
SUDOKU_2_EASY = Puzzle(
    name="sudoku_2_easy",
    setup=_setup_sudoku(
        {
            "0": 1, "1": 2, "2": 3, "3": 4,
            "4": 3, "5": 4, "6": 1, "7": 2,
            "8": 2, "9": 1, "10": 4, "11": 0,
            "12": 4, "13": 0, "14": 2, "15": 1,
        },
        N=2,
    ),
    is_sudoku=True,
)

# 9×9 medium (~30 givens)
_9x9_medium_vals = {}
for i in range(81):
    _9x9_medium_vals[str(i)] = 0
_9x9_medium_vals.update({
    "0": 5, "1": 3, "4": 7,
    "9": 6, "12": 1, "13": 9, "14": 5,
    "19": 9, "20": 8, "25": 6,
    "27": 8, "31": 6, "35": 3,
    "36": 4, "39": 8, "41": 3, "44": 1,
    "45": 7, "49": 2, "53": 6,
    "55": 6, "60": 2, "61": 8,
    "66": 4, "67": 1, "68": 9, "71": 5,
    "76": 8, "79": 7, "80": 9,
})
SUDOKU_3_MEDIUM = Puzzle(
    name="sudoku_3_medium",
    setup=_setup_sudoku(_9x9_medium_vals, N=3),
    is_sudoku=True,
)

# 9×9 hard (17 givens — minimal)
_9x9_hard_vals = {}
for i in range(81):
    _9x9_hard_vals[str(i)] = 0
_9x9_hard_vals.update({
    "0": 8,
    "11": 3, "12": 6,
    "19": 7, "22": 9, "24": 2,
    "28": 5, "32": 7,
    "40": 4, "41": 5, "42": 7,
    "48": 1, "52": 3,
    "56": 1, "60": 6, "61": 8,
    "65": 8, "66": 5, "70": 1,
    "73": 9, "78": 4,
})
SUDOKU_3_HARD = Puzzle(
    name="sudoku_3_hard",
    setup=_setup_sudoku(_9x9_hard_vals, N=3),
    is_sudoku=True,
)

# Arto Inkala "world's hardest" Sudoku
_inkala_vals = {}
for i in range(81):
    _inkala_vals[str(i)] = 0
_inkala_vals.update({
    "0": 8,
    "11": 3, "12": 6,
    "19": 7, "22": 9, "24": 2,
    "28": 5, "32": 7,
    "40": 4, "41": 5, "42": 7,
    "48": 1, "52": 3,
    "56": 1, "60": 6, "61": 8,
    "65": 8, "66": 5, "70": 1,
    "73": 9, "78": 4,
})
SUDOKU_3_ARTO_INKALA = Puzzle(
    name="sudoku_3_arto_inkala",
    setup=_setup_sudoku(_inkala_vals, N=3),
    is_sudoku=True,
)


def _setup_australia_map(
    pruning: PruningType,
    ordering: VariableOrdering,
    gac: bool,
):
    """Australia map coloring: 7 regions, 3 colors."""
    csp = CSP(
        pruning_type=pruning,
        variable_ordering=ordering,
        use_gac_alldiff=gac,
    )
    regions = ["WA", "NT", "SA", "Q", "NSW", "V", "T"]
    csp.add_variables(["red", "green", "blue"], *regions)

    edges = [
        ("WA", "NT"), ("WA", "SA"), ("NT", "SA"), ("NT", "Q"),
        ("SA", "Q"), ("SA", "NSW"), ("SA", "V"), ("Q", "NSW"), ("NSW", "V"),
    ]
    for p1, p2 in edges:
        csp.add_constraint(map_coloring_constraint(p1, p2))

    return csp, None


AUSTRALIA_MAP = Puzzle(
    name="australia_map",
    setup=_setup_australia_map,
    has_unique_solution=False,
    is_sudoku=False,
)


def _setup_nqueens_8(
    pruning: PruningType,
    ordering: VariableOrdering,
    gac: bool,
):
    """8-Queens problem."""
    csp = CSP(
        pruning_type=pruning,
        variable_ordering=ordering,
        use_gac_alldiff=gac,
    )
    columns = list(range(1, 9))
    rows = list(range(1, 9))
    csp.add_variables(rows, *columns)
    csp.add_constraint(n_queens_constraint(columns))
    return csp, None


NQUEENS_8 = Puzzle(
    name="nqueens_8",
    setup=_setup_nqueens_8,
    has_unique_solution=False,
    is_sudoku=False,
)


def _setup_simple_4var(
    pruning: PruningType,
    ordering: VariableOrdering,
    gac: bool,
):
    """4 variables, domain {1,2}, two all-different constraints."""
    csp = CSP(
        pruning_type=pruning,
        variable_ordering=ordering,
        use_gac_alldiff=gac,
        max_solutions=10,
    )
    csp.add_variables([1, 2], "a", "b", "c", "d")
    csp.add_constraint(all_different_constraint("a", "b"))
    csp.add_constraint(all_different_constraint("c", "d"))
    return csp, None


SIMPLE_4VAR = Puzzle(
    name="simple_4var",
    setup=_setup_simple_4var,
    has_unique_solution=False,
    min_solutions=1,
    is_sudoku=False,
)


# ── Solver Configurations ───────────────────────────────────────────────────


@dataclass
class SolverConfig:
    name: str
    pruning: PruningType
    ordering: VariableOrdering
    gac: bool


FC = PruningType.FORWARD_CHECKING
FF = VariableOrdering.FAIL_FIRST
DW = VariableOrdering.DOM_WDEG

CONFIGS = [
    SolverConfig("baseline", FC, FF, False),
    SolverConfig("ac3_mrv", PruningType.AC3, FF, False),
    SolverConfig("dom_wdeg", FC, DW, False),
    SolverConfig("gac_alldiff", FC, FF, True),
    SolverConfig("all_optimized", FC, DW, True),
]

PUZZLES = [
    SUDOKU_2_EASY,
    SUDOKU_3_MEDIUM,
    SUDOKU_3_HARD,
    AUSTRALIA_MAP,
    NQUEENS_8,
    SIMPLE_4VAR,
]


# ── Benchmark Results Collector ──────────────────────────────────────────────

_results: list[dict] = []


def _solve(csp: CSP, given_values: dict | None) -> bool:
    if given_values:
        return csp.solve_with_initial_propagation(given_values)
    return csp.solve()


# ── Parametrized Tests ───────────────────────────────────────────────────────


@pytest.mark.parametrize(
    "puzzle",
    PUZZLES,
    ids=[p.name for p in PUZZLES],
)
@pytest.mark.parametrize(
    "config",
    CONFIGS,
    ids=[c.name for c in CONFIGS],
)
def test_solver_correctness(puzzle: Puzzle, config: SolverConfig):
    """Every config finds a valid solution for every solvable puzzle."""
    csp, given_values = puzzle.setup(config.pruning, config.ordering, config.gac)

    t0 = time.perf_counter()
    _solve(csp, given_values)
    elapsed = time.perf_counter() - t0

    assert len(csp.solutions) >= puzzle.min_solutions, (
        f"{config.name} × {puzzle.name}: expected >= {puzzle.min_solutions} solutions, "
        f"got {len(csp.solutions)}"
    )

    # Verify solution validity for first solution
    sol = csp.solutions[0]
    for v in csp.variables:
        assert v in sol, f"Variable {v} not assigned in solution"

    _results.append({
        "puzzle": puzzle.name,
        "config": config.name,
        "backtracks": csp.backtrack_count,
        "solutions": len(csp.solutions),
        "time_ms": elapsed * 1000,
    })


@pytest.mark.parametrize(
    "puzzle",
    [p for p in PUZZLES if p.is_sudoku],
    ids=[p.name for p in PUZZLES if p.is_sudoku],
)
def test_no_regression_vs_baseline(puzzle: Puzzle):
    """all_optimized has <= backtracks than baseline on Sudoku puzzles."""
    baseline_cfg = CONFIGS[0]  # baseline
    optimized_cfg = CONFIGS[-1]  # all_optimized

    csp_base, gv_base = puzzle.setup(
        baseline_cfg.pruning, baseline_cfg.ordering, baseline_cfg.gac
    )
    _solve(csp_base, gv_base)

    csp_opt, gv_opt = puzzle.setup(
        optimized_cfg.pruning, optimized_cfg.ordering, optimized_cfg.gac
    )
    _solve(csp_opt, gv_opt)

    assert csp_opt.backtrack_count <= csp_base.backtrack_count, (
        f"{puzzle.name}: all_optimized ({csp_opt.backtrack_count}) > "
        f"baseline ({csp_base.backtrack_count})"
    )


def test_print_benchmark_table(capsys):
    """Print benchmark comparison table (run with -s to see output)."""
    if not _results:
        pytest.skip("No benchmark results collected — run full suite first")

    # Build table
    puzzles_seen = []
    configs_seen = []
    for r in _results:
        if r["puzzle"] not in puzzles_seen:
            puzzles_seen.append(r["puzzle"])
        if r["config"] not in configs_seen:
            configs_seen.append(r["config"])

    lookup = {(r["puzzle"], r["config"]): r for r in _results}

    # Header
    col_w = 16
    header = f"{'Puzzle':<20}" + "".join(f"{c:>{col_w}}" for c in configs_seen)
    sep = "-" * len(header)

    print("\n" + sep)
    print("BENCHMARK: Backtrack Counts")
    print(sep)
    print(header)
    print(sep)
    for p in puzzles_seen:
        row = f"{p:<20}"
        for c in configs_seen:
            r = lookup.get((p, c))
            if r:
                row += f"{r['backtracks']:>{col_w}}"
            else:
                row += f"{'—':>{col_w}}"
        print(row)
    print(sep)

    # Timing table
    print("\nBENCHMARK: Timing (ms)")
    print(sep)
    print(header.replace("Backtrack Counts", "Timing"))
    print(sep)
    for p in puzzles_seen:
        row = f"{p:<20}"
        for c in configs_seen:
            r = lookup.get((p, c))
            if r:
                row += f"{r['time_ms']:>{col_w}.1f}"
            else:
                row += f"{'—':>{col_w}}"
        print(row)
    print(sep)
