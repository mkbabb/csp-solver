"""Futoshiki puzzle solver."""

import math
from dataclasses import dataclass

from csp_solver.solver.constraints import (
    all_different_constraint,
    equals_constraint,
    greater_than_constraint,
)
from csp_solver.solver.csp import CSP, PruningType


@dataclass(frozen=True)
class Node:
    pos: tuple[int, int]

    def __repr__(self) -> str:
        return str(self.pos)


def create_futoshiki_csp(filename: str, pruning_type: PruningType) -> CSP:
    def split_line(line: str) -> list[int]:
        return list(map(int, line.split(" ")))

    with open(filename) as file:
        N = int(file.readline())
        Ls = split_line(file.readline())
        Vs = split_line(file.readline())

        As = split_line(file.readline())
        Bs = split_line(file.readline())

        grid = [Node((i, j)) for i in range(N) for j in range(N)]

        csp = CSP(pruning_type=pruning_type, max_solutions=99999)

        domain = list(range(1, N + 1))
        csp.add_variables(domain, *grid)

        for ix, value in zip(Ls, Vs):
            csp.add_constraint(equals_constraint(grid[ix], value))

        for a, b in zip(As, Bs):
            csp.add_constraint(greater_than_constraint(grid[a], grid[b]))

        # Row constraints
        for i in range(N):
            row = grid[i * N : (i + 1) * N]
            csp.add_constraint(all_different_constraint(*row))

        # Column constraints
        for j in range(N):
            col = [grid[i * N + j] for i in range(N)]
            csp.add_constraint(all_different_constraint(*col))

        return csp


def print_solutions(csp: CSP) -> None:
    N = int(math.sqrt(len(csp.variables)))

    for solution in csp.solutions:
        for i in range(N):
            nodes = (csp.variables[i * N + j] for j in range(N))
            row = ", ".join(str(solution.get(x)) for x in nodes)
            print(row)
        print("###############")
