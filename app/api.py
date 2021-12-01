import json
from typing import *

from csp.sudoku import SudokuDifficulty, create_random_board, create_sudoku_csp
from flask import Flask, render_template, request

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
    difficulty = SudokuDifficulty.get(difficulty)

    print(f"Randomizing board of size {size}")

    board = create_random_board(N=size, difficulty=difficulty)
    print(board)

    return board


@app.route("/solve/", methods=["POST"])
def solve():
    body = request.get_json()

    values = body.get("values", {})

    json.dump(values, open("data/tmp.json", "w"))

    size = int(body["size"])

    csp = create_sudoku_csp(N=size, values=values)

    csp.solve()

    if len(csp.solutions) == 0:
        return "invalid solution", 400
    else:
        solution = csp.solutions[0]
        return {"solved": values == solution, "values": solution}
