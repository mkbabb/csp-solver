import json
import math
import os
import pathlib
import random
from enum import Enum, auto
from typing import *

import numpy as np

from csp.csp import CSP, PruningType, all_different_constraint, equals_constraint


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


def solution_to_array(solution: dict):
    L = len(solution)
    M = int(math.sqrt(L))
    grid = np.zeros((L), dtype=int)

    for pos, value in solution.items():
        grid[int(pos)] = value

    return grid.reshape((M, M))


def create_sudoku_csp(N: int, values: Dict[int, int], max_solutions: int = 1):
    M = N ** 2

    grid = np.arange(M ** 2)
    grid = grid.astype(str)

    domain = list(range(1, M + 1))
    csp = CSP(pruning_type=PruningType.AC3, max_solutions=max_solutions)
    csp.add_variables(domain, *grid)

    for pos, value in values.items():
        if value != 0:
            csp.add_constraint(equals_constraint(grid[int(pos)], value))

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


def create_random_board(N: int, difficulty: SudokuDifficulty = SudokuDifficulty.EASY):
    L = N ** 4

    here = pathlib.Path(os.path.dirname(__file__))
    solution_dir = here.joinpath("data/sudoku_solutions")

    if not solution_dir.exists():
        raise FileNotFoundError(f"Dir {here} was invalid")

    solutions = list(solution_dir.joinpath(f"{N}").glob("*"))
    solution_filepath: pathlib.Path = random.choice(solutions)

    board = json.loads(solution_filepath.read_text())

    remove_count = 0

    if difficulty == SudokuDifficulty.EASY:
        remove_count = L // 4
    elif difficulty == SudokuDifficulty.MEDIUM:
        remove_count = int(L / 1.75)
    elif difficulty == SudokuDifficulty.HARD:
        remove_count = int(L / 1.25)

    keys = list(board.keys())

    for _ in range(remove_count):
        key = random.choice([i for i in keys if board[i] != 0])
        board[key] = 0

    return board


if __name__ == "__main__":
    values = json.load(open("data/sample.json", "r"))
    csp = create_sudoku_csp(3, values)

    csp.solve()

    for solution in csp.solutions:
        grid = solution_to_array(solution)
        print(grid)

    # N = 3
    # M = N ** 2
    # solution_dir = pathlib.Path("data/sudoku_solutions/").joinpath(f"{N}")

    # if not solution_dir.exists():
    #     os.makedirs(solution_dir)

    # random_pos = random.randint(0, M ** 2 - 1)
    # random_value = random.randint(1, 9)

    # values = {random_pos: random_value}
    # csp = create_sudoku_csp(N=N, values=values, max_solutions=100)

    # csp.solve()

    # random.shuffle(csp.solutions)

    # for n, solution in enumerate(csp.solutions):
    #     filename = solution_dir.joinpath(f"board-{n}.json")

    #     with open(filename, "w") as file:
    #         json.dump(solution, file)

    #     grid = solution_to_array(solution)
    #     print(grid)
