import sys
from typing import *

from flask import Flask, render_template, request

from csp.sudoku import SudokuDifficulty, create_random_board, create_sudoku_csp

app = Flask(__name__)


@app.route("/")
def index():
    """Displays the index page accessible at '/'"""
    return render_template("index.html")


@app.route("/getRandomBoard/size/<difficulty>/", endpoint="get_random_board")
def get_random_board(size: int, difficulty: str):
    difficulty = SudokuDifficulty.get(difficulty)

    board = create_random_board(N=size, difficulty=difficulty)

    return board


@app.route("/solve/", endpoint="solve")
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
