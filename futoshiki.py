import math
import sys
from dataclasses import dataclass
from typing import *

import numpy as np

from csp import (
    CSP,
    PruningType,
    all_different_constraint,
    equals_constraint,
    greater_than_constraint,
)


@dataclass(frozen=True)
class Node:
    pos: Tuple[int, int]

    def __repr__(self):
        return str(self.pos)


def create_futoshiki_csp(filename: str, pruning_type: PruningType) -> CSP:
    def split_line(line: str):
        return list(map(int, line.split(" ")))

    with open(filename, "r") as file:
        N = int(file.readline())
        Ls = split_line(file.readline())
        Vs = split_line(file.readline())

        As = split_line(file.readline())
        Bs = split_line(file.readline())

        grid: np.array = np.asarray([Node((i, j)) for i in range(N) for j in range(N)])

        csp = CSP(pruning_type=pruning_type, find_all_solutions=True)

        domain = list(range(1, N + 1))
        csp.add_variables(domain, *grid)

        for ix, value in zip(Ls, Vs):
            csp.add_constraint(equals_constraint(grid[ix], value))

        for a, b in zip(As, Bs):
            csp.add_constraint(greater_than_constraint(grid[a], grid[b]))

        grid = grid.reshape((N, N))

        for row in grid:
            csp.add_constraint(all_different_constraint(*row))

        for column in grid.T:
            csp.add_constraint(all_different_constraint(*column))

        return csp


def print_solutions(csp: CSP):
    N = int(math.sqrt(len(csp.variables)))

    for solution in csp.solutions:
        for i in range(N):
            nodes = (csp.variables[i * N + j] for j in range(N))
            row = ", ".join(map(lambda x: str(solution.get(x)), nodes))
            print(row)
        print("###############")


if __name__ == "__main__":
    filename = "data/sample_input.txt"
    algorithm = "MAC"

    # algorithm = sys.argv[1]
    # filename = sys.argv[2]

    pruning_type = (
        PruningType.FORWARD_CHECKING
        if algorithm == "FC"
        else PruningType.AC3
        if algorithm == "MAC"
        else PruningType.NO_PRUNING
    )

    csp = create_futoshiki_csp(filename, pruning_type)

    csp.solve()

    # solutions = list(map(str, csp.solutions))
    # print(len(solutions), len(set(solutions)))

    print_solutions(csp)
