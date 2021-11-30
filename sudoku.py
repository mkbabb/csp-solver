from dataclasses import dataclass
from typing import *

import numpy as np

from csp import (
    CSP,
    PruningType,
    all_different_constraint,
    equals_constraint,
)


@dataclass(frozen=True)
class Node:
    pos: Tuple[int, int]

    def __repr__(self):
        return str(self.pos)


N = 2
M = N ** 2

grid: np.array = np.asarray([Node((i, j)) for i in range(M) for j in range(M)])


domain = list(range(1, M + 1))
csp = CSP(PruningType.NO_PRUNING)
csp.add_variables(domain, *grid)

grid = grid.reshape((M, M))

print(grid)

for row in grid:
    csp.add_constraint(all_different_constraint(*row))

for column in grid.T:
    csp.add_constraint(all_different_constraint(*column))

for i in range(N):
    for j in range(N):
        x = slice(i * N, (i + 1) * N)
        y = slice(j * N, (j + 1) * N)

        subgrid = grid[x, y]
        csp.add_constraint(all_different_constraint(*subgrid.flatten()))


csp.solve()

for solution in csp.solutions:
    for i in range(M):
        nodes = (csp.variables[i * M + j] for j in range(M))
        row = ", ".join(map(lambda x: str(solution.get(x)), nodes))
        print(row)
    print("###############")
