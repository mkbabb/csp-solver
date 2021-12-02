from typing import *

from csp.sudoku import SudokuDifficulty, create_random_board, create_sudoku_csp
from flask import Flask, render_template, request

app = Flask(__name__)


@app.before_request
def before_request():
    app.jinja_env.cache = {}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/getRandomBoard/<int:size>/<difficulty>")
def get_random_board(size: int, difficulty: str):
    difficulty = SudokuDifficulty.get(difficulty)
    board = create_random_board(N=size, difficulty=difficulty)
    
    return board


@app.route("/solve/", methods=["POST"])
def solve():
    body = request.get_json()

    values = body.get("values", {})
    size = int(body["size"])

    csp = create_sudoku_csp(N=size, values=values)

    try:
        csp.solve()
    except Exception as e:
        print(e)

    if len(csp.solutions) == 0:
        return "Invalid solution", 400
    else:
        solution = csp.solutions[0]
        return {"solved": values == solution, "values": solution}
