import atexit
import csv
import json
import os


from typing import *


from flask import Flask, request

from api.sudoku import SudokuDifficulty, create_random_board, create_sudoku_csp


app = Flask(__name__)


@app.route("/getRandomBoard/size/<difficulty>")
def get_random_board(size: int, difficulty: str):
    difficulty = SudokuDifficulty.get(difficulty)

    board = create_random_board(N=size, difficulty=difficulty)

    return board


@app.route("/solve")
def get_random_board():
    body = request.get_json()

    values = body.get("values", {})
    size = body["size"]

    csp = create_sudoku_csp(N=size, values=values)

    csp.solve()

    if len(csp.solutions) == 0:
        return "invalid solution", 404
    else:
        return csp.solutions[0]
