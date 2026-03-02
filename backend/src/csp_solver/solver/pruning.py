"""Pruning algorithms for CSP solving: forward checking, AC3, and AC-FC hybrid."""

from __future__ import annotations

from collections import deque
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from csp_solver.solver.csp import CSP

type Solution = dict[Any, Any]


def revise(csp: CSP, variable: Any, Xi: Any, Xj: Any, solution: Solution) -> bool:
    """Arc revision: iterate over copy to avoid mutation-during-iteration."""
    removed = False

    for x in list(csp.current_domains[Xi]):
        old_xi = solution.get(Xi)
        old_xj = solution.get(Xj)
        solution[Xi] = x

        found_support = False
        for y in csp.current_domains[Xj]:
            solution[Xj] = y
            if csp.is_valid(Xj, solution):
                found_support = True
                break

        if old_xj is not None:
            solution[Xj] = old_xj
        elif Xj in solution:
            del solution[Xj]
        if old_xi is not None:
            solution[Xi] = old_xi
        elif Xi in solution:
            del solution[Xi]

        if not found_support:
            csp.current_domains[Xi].remove(x)
            csp.pruned_map[variable][Xi].add(x)
            removed = True

    return removed


def forward_check(csp: CSP, variable: Any, solution: Solution) -> None:
    """Remove inconsistent values from neighbors' domains on assignment."""
    agenda = [i for i in csp.get_neighbors(variable) if i not in solution]

    for Xi in agenda:
        for x in list(csp.current_domains[Xi]):
            old_val = solution.get(Xi)
            solution[Xi] = x
            valid = csp.is_valid(Xi, solution)
            if old_val is not None:
                solution[Xi] = old_val
            else:
                del solution[Xi]

            if not valid:
                csp.current_domains[Xi].remove(x)
                csp.pruned_map[variable][Xi].add(x)


def AC_FC(csp: CSP, variable: Any, solution: Solution) -> bool:
    """Hybrid arc consistency + forward checking."""
    consistent = True
    agenda = deque(
        (Xj, variable)
        for Xj in csp.get_neighbors(variable)
        if Xj not in solution
    )
    while len(agenda) > 0 and csp.is_valid(variable, solution):
        Xi, Xj = agenda.pop()
        if revise(csp, variable, Xi, Xj, solution):
            consistent = len(csp.current_domains[Xi]) > 0
            if not consistent:
                break
    return consistent


def AC3(csp: CSP, variable: Any, solution: Solution) -> None:
    """AC3 with DWO detection and O(1) agenda membership via companion set."""
    agenda = deque(
        (Xj, variable)
        for Xj in csp.get_neighbors(variable)
        if Xj not in solution
    )
    agenda_set = set(agenda)

    while len(agenda) > 0:
        arc = agenda.pop()
        agenda_set.discard(arc)
        Xi, Xj = arc

        if revise(csp, variable, Xi, Xj, solution):
            if len(csp.current_domains[Xi]) == 0:
                return

            for Xk in csp.get_neighbors(Xi):
                p = (Xk, Xi)
                if Xk != Xj and p not in agenda_set and Xk not in solution:
                    agenda.append(p)
                    agenda_set.add(p)
