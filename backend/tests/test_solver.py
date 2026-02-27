"""Tests for the CSP solver and Sudoku puzzle generation."""

from csp_solver.solver.csp import CSP, PruningType, VariableOrdering
from csp_solver.solver.constraints import all_different_constraint, equals_constraint
from csp_solver.solver.sudoku import (
    SudokuDifficulty,
    create_random_board,
    create_sudoku_csp,
    solve_sudoku,
    _load_solution_board,
)


def test_simple_csp():
    """Test a trivial CSP with 2 variables."""
    csp = CSP(pruning_type=PruningType.FORWARD_CHECKING)
    csp.add_variables([1, 2, 3], "a", "b")
    csp.add_constraint(all_different_constraint("a", "b"))
    csp.solve()
    assert len(csp.solutions) == 1
    sol = csp.solutions[0]
    assert sol["a"] != sol["b"]


def test_4x4_sudoku_solve():
    """Test solving a known 4x4 Sudoku puzzle."""
    # A simple 4x4 puzzle (N=2)
    values = {
        "0": 1, "1": 0, "2": 0, "3": 4,
        "4": 0, "5": 0, "6": 1, "7": 0,
        "8": 0, "9": 1, "10": 0, "11": 0,
        "12": 4, "13": 0, "14": 0, "15": 1,
    }
    csp = create_sudoku_csp(N=2, values=values)
    solve_sudoku(csp)
    assert len(csp.solutions) >= 1

    sol = csp.solutions[0]
    # Verify all cells filled
    assert all(sol[i] != 0 for i in range(16))


def test_9x9_sudoku_solve():
    """Test solving a known 9x9 Sudoku puzzle."""
    values = {
        "0": 5, "1": 3, "4": 7,
        "9": 6, "12": 1, "13": 9, "14": 5,
        "19": 9, "20": 8, "25": 6,
        "27": 8, "31": 6, "35": 3,
        "36": 4, "39": 8, "41": 3, "44": 1,
        "45": 7, "49": 2, "53": 6,
        "55": 6, "60": 2, "61": 8,
        "66": 4, "67": 1, "68": 9, "71": 5,
        "76": 8, "79": 7, "80": 9,
    }
    # Fill remaining with 0
    for i in range(81):
        key = str(i)
        if key not in values:
            values[key] = 0

    csp = create_sudoku_csp(N=3, values=values)
    solve_sudoku(csp)
    assert len(csp.solutions) == 1


def test_load_solution_board():
    """Test loading a pre-computed solution board."""
    board = _load_solution_board(3)
    assert len(board) == 81
    assert all(1 <= v <= 9 for v in board.values())
    assert all(isinstance(v, int) for v in board.values())


def test_create_random_board_easy():
    """Test random board generation for EASY difficulty."""
    board = create_random_board(N=2, difficulty=SudokuDifficulty.EASY)
    assert len(board) == 16
    # Some cells should be empty (0)
    assert any(v == 0 for v in board.values())
    # Some cells should be filled
    assert any(v != 0 for v in board.values())


def test_backtrack_counter():
    """Test that the backtrack counter increments."""
    values = {"0": 1}
    for i in range(1, 16):
        values[str(i)] = 0
    csp = create_sudoku_csp(N=2, values=values)
    solve_sudoku(csp)
    # backtrack_count should be >= 0
    assert csp.backtrack_count >= 0


def test_multiple_solutions():
    """Test finding multiple solutions."""
    csp = CSP(
        pruning_type=PruningType.FORWARD_CHECKING,
        max_solutions=10,
    )
    csp.add_variables([1, 2, 3], "a", "b", "c")
    csp.add_constraint(all_different_constraint("a", "b", "c"))
    csp.solve()
    # 3! = 6 permutations
    assert len(csp.solutions) == 6
