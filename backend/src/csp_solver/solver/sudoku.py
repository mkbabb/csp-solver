"""Sudoku CSP creation and solving interface."""

import math
from enum import Enum, auto

from csp_solver.solver.constraints import all_different_constraint, equals_constraint
from csp_solver.solver.csp import CSP, PruningType, VariableOrdering


class SudokuDifficulty(Enum):
    EASY = auto()
    MEDIUM = auto()
    HARD = auto()

    @classmethod
    def get(cls, key: str, default: "SudokuDifficulty | None" = None) -> "SudokuDifficulty | None":
        if key in cls._member_names_:
            return cls[key]
        return default


def solution_to_array(solution: dict) -> list[list[int]]:
    """Convert solution dict to 2D list grid."""
    L = len(solution)
    M = int(math.sqrt(L))
    grid = [0] * L
    for pos, value in solution.items():
        grid[int(pos)] = int(value)
    return [grid[i * M : (i + 1) * M] for i in range(M)]


def create_sudoku_csp(
    N: int,
    values: dict[str, int],
    max_solutions: int = 1,
) -> CSP:
    """Create a CSP for an N^2 x N^2 Sudoku grid.

    Uses integer variables (0..M^2-1) instead of string keys for faster hashing.
    """
    M = N**2
    total = M**2

    variables = list(range(total))
    domain = list(range(1, M + 1))

    csp = CSP(
        pruning_type=PruningType.FORWARD_CHECKING,
        variable_ordering=VariableOrdering.FAIL_FIRST,
        max_solutions=max_solutions,
    )
    csp.add_variables(domain, *variables)

    # Add given value constraints
    given_values: dict[int, int] = {}
    for pos, value in values.items():
        int_val = int(value)
        if int_val != 0:
            int_pos = int(pos)
            csp.add_constraint(equals_constraint(int_pos, int_val))
            given_values[int_pos] = int_val

    # Row constraints
    for row in range(M):
        row_vars = [row * M + col for col in range(M)]
        csp.add_constraint(all_different_constraint(*row_vars))

    # Column constraints
    for col in range(M):
        col_vars = [row * M + col for row in range(M)]
        csp.add_constraint(all_different_constraint(*col_vars))

    # Subgrid constraints
    for i in range(N):
        for j in range(N):
            subgrid_vars = [
                (i * N + di) * M + (j * N + dj) for di in range(N) for dj in range(N)
            ]
            csp.add_constraint(all_different_constraint(*subgrid_vars))

    # Store given values for initial propagation
    csp._given_values = given_values

    return csp


def solve_sudoku(csp: CSP) -> bool:
    """Solve a Sudoku CSP, using initial propagation if given values exist."""
    given = getattr(csp, "_given_values", {})
    if given:
        return csp.solve_with_initial_propagation(given)
    return csp.solve()
