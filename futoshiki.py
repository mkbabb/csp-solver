
import dataclasses
import json
import math
from dataclasses import dataclass, field
from typing import *

import numpy as np

from csp import CSP, all_different_constraint, lambda_constraint


def less_than_constraint(a, b):
    return lambda_constraint(lambda x, y: x < y, a, b)


def greater_than_constraint(a, b):
    return lambda_constraint(lambda x, y: x > y, a, b)


def equals_constraint(node, value: int):
    return lambda_constraint(lambda x: x == value, node)



@dataclass(frozen=True)
class Node:
    pos: Tuple[int, int]

    def __repr__(self):
        return str(self.pos)


def create_futoshiki_csp(filename: str) -> CSP:
    def split_line(line: str):
        return list(map(int, line.split(" ")))

    with open(filename, "r") as file:
        N = int(file.readline())
        Ls = split_line(file.readline())
        Vs = split_line(file.readline())

        As = split_line(file.readline())
        Bs = split_line(file.readline())

        grid: np.array = np.asarray( [Node((i, j)) for i in range(N) for j in range(N)])
        
        domain = list(range(1, N + 1))
        csp = CSP()
        csp.add_variables(domain, *grid)

        for ix, value in zip(Ls, Vs):
            csp.add_constraint(equals_constraint(grid[ix], value))

        # for a, b in zip(As, Bs):
        #     csp.add_constraint(greater_than_constraint(grid[a], grid[b]))

        grid = grid.reshape((N, N))

        for row in grid:
            csp.add_constraint(all_different_constraint(*row))

        for column in grid.T:
            csp.add_constraint(all_different_constraint(*column))

        return csp

def print_solutions(csp: CSP):
    N = int(math.sqrt( len(csp.variables)))

    for solution in csp.solutions:
        for i in range(N):
            nodes = (csp.variables[i*N + j] for j in range(N))
            row = ", ".join(map(lambda x: str(solution.get(x)), nodes))
            print(row)
        print("###############")



if __name__ == "__main__":
    filename = "data/sample_input.txt"
    csp = create_futoshiki_csp(filename)

    csp.solve(True)

    solutions = list(map(str, csp.solutions))

    print(len(solutions), len(set(solutions)))

    print_solutions(csp)

