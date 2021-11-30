import sys
from typing import *

from flask import Flask, render_template, request, jsonify

from csp.sudoku import SudokuDifficulty, create_random_board, create_sudoku_csp

app = Flask(__name__)

@app.before_request
def before_request():
    app.jinja_env.cache = {}


@app.route("/")
def index():
    """Displays the index page accessible at '/'"""
    return render_template("index.html")


@app.route("/getRandomBoard/<int:size>/<difficulty>")
def get_random_board(size: int, difficulty: str):
    print("hi")
    difficulty = SudokuDifficulty.get(difficulty)

    board = create_random_board(N=size, difficulty=difficulty)
    print(board)

    return board


@app.route("/solve")
def solve():
    body = request.get_json()

    values = body.get("values", {})
    size = body["size"]

    csp = create_sudoku_csp(N=size, values=values)

    csp.solve()

    if len(csp.solutions) == 0:
        return "invalid solution", 404
    else:
        return csp.solutions[0]
