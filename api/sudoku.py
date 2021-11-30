from dataclasses import dataclass
from typing import *
from enum import Enum, auto
import random
import math

import numpy as np

from csp import (
    CSP,
    PruningType,
    all_different_constraint,
    equals_constraint,
)


class SudokuDifficulty(Enum):
    EASY = auto()
    MEDIUM = auto()
    HARD = auto()

    @classmethod
    def get(cls, key: str, default=None):
        if key in cls._member_names_:
            return cls[key]
        else:
            return default


def create_sudoku_csp(N: int, values: Dict[int, int]):
    M = N ** 2

    grid = np.arange(M ** 2)

    domain = list(range(1, M + 1))
    csp = CSP(PruningType.NO_PRUNING)
    csp.add_variables(domain, *grid)

    for pos, value in values.items():
        csp.add_constraint(equals_constraint(grid[pos], value))

    grid = grid.reshape((M, M))

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

    return csp


def solution_to_array(solution: dict):
    L = len(solution)
    M = int(math.sqrt(L))
    grid = np.zeros((L), dtype=int)

    for pos, value in solution.items():
        grid[pos] = value

    return grid.reshape((M, M))


def create_random_board(N: int, difficulty: SudokuDifficulty = SudokuDifficulty.EASY):
    L = N ** 4
    csp = create_sudoku_csp(N, {})
    csp.solve()

    board = random.choice(csp.solutions)

    remove_count = L // 4

    keys = list(board.keys())

    for _ in range(remove_count):
        key = random.choice([i for i in keys if board[i] != 0])
        board[key] = 0

    return board


if __name__ == "__main__":
    # N = 2
    # M = N ** 2
    # values = {}
    # csp = create_sudoku_csp(N=N, values=values)

    # csp.solve()

    # for solution in csp.solutions:
    #     for i in range(M):
    #         nodes = (csp.variables[i * M + j] for j in range(M))
    #         row = ", ".join(map(lambda x: str(solution.get(x)), nodes))
    #         print(row)
    #     print("###############")

    board = create_random_board(2)
    arr = solution_to_array(board)

    print(arr)
    # for i in range(M):
    #         nodes = (csp.variables[i * M + j] for j in range(M))
    #         row = ", ".join(map(lambda x: str(solution.get(x)), nodes))
    #         print(row)
    #     print("###############")
