"""Extracted constraint functions for CSP solver."""

from collections.abc import Callable
from typing import Any

type Solution[V, D] = dict[V, D]


def get_current_solution_values[V, D](
    variables: list[V], current_solution: Solution[V, D]
) -> list[D]:
    return [current_solution[v] for v in variables if v in current_solution]


def map_coloring_constraint(p1: str, p2: str):
    def check(current_solution: Solution) -> bool:
        if p1 not in current_solution or p2 not in current_solution:
            return True
        return current_solution[p1] != current_solution[p2]

    return check, [p1, p2]


def n_queens_constraint(columns: list[int]):
    def check(current_solution: Solution) -> bool:
        for q1c, q1r in current_solution.items():
            for q2c in range(q1c + 1, len(columns) + 1):
                if q2c in current_solution:
                    q2r = current_solution[q2c]
                    if q1r == q2r:
                        return False
                    if abs(q1r - q2r) == abs(q1c - q2c):
                        return False
        return True

    return check, list(columns)


def lambda_constraint(func: Callable[..., bool], *variables: Any):
    def check(current_solution: Solution) -> bool:
        current_values = get_current_solution_values(list(variables), current_solution)
        if len(variables) == len(current_values):
            return func(*current_values)
        return True

    return check, list(variables)


def less_than_constraint(a: Any, b: Any):
    return lambda_constraint(lambda x, y: x < y, a, b)


def greater_than_constraint(a: Any, b: Any):
    return lambda_constraint(lambda x, y: x > y, a, b)


def equals_constraint(node: Any, value: int):
    return lambda_constraint(lambda x: x == value, node)


def all_different_constraint(*variables: Any):
    """Check that all assigned variables have distinct values.

    Uses early-exit set check instead of building full list then comparing lengths.
    """

    def check(current_solution: Solution) -> bool:
        seen: set = set()
        for v in variables:
            if v in current_solution:
                val = current_solution[v]
                if val in seen:
                    return False
                seen.add(val)
        return True

    check._is_alldiff = True  # type: ignore[attr-defined]
    return check, list(variables)
