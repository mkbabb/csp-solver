"""Local search (min-conflicts) for CSP solving."""

from __future__ import annotations

import random
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from csp_solver.solver.csp import CSP

type Solution = dict[Any, Any]


def num_conflicts(csp: CSP, v: Any, d: Any, solution: Solution) -> int:
    """Count constraint violations for assigning value d to variable v."""
    count = 0
    old_val = solution.get(v)
    solution[v] = d
    for constraint in csp.constraints[v]:
        if not constraint(solution):
            count += 1
    if old_val is not None:
        solution[v] = old_val
    elif v in solution:
        del solution[v]
    return count


def conflicting_variables(csp: CSP, solution: Solution) -> list[Any]:
    """Return all variables with at least one constraint violation."""
    return [
        v
        for v in csp.variables
        if v in solution and num_conflicts(csp, v, solution[v], solution) > 0
    ]


def min_conflicting_value(csp: CSP, v: Any, solution: Solution) -> Any:
    """Find domain value with minimum conflicts using pure Python min()."""
    return min(csp.domains[v], key=lambda d: num_conflicts(csp, v, d, solution))


def min_conflicts(csp: CSP, iteration_count: int = 10000) -> bool:
    """Hill-climbing local search: randomly initialize, iteratively fix conflicts."""
    solution: Solution = {}
    random.shuffle(csp.variables)

    for v in csp.variables:
        solution[v] = min_conflicting_value(csp, v, solution)

    for _ in range(iteration_count):
        conflicted = conflicting_variables(csp, solution)

        if len(conflicted) == 0:
            csp.solutions.append(solution.copy())
            return True

        v = random.choice(conflicted)
        d = min_conflicting_value(csp, v, solution)
        solution[v] = d

    return False
