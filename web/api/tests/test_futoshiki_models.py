"""Pydantic-layer unit tests for `FutoshikiSolveRequest` — pure Python, no
`csp_solver` wheel dependency (unlike the router/service tests, this layer's
whole point is to reject *before* any Rust boundary is reached).

This is the G3 acceptance gate's dedicated Pydantic-layer negative control:
"non-adjacent pair -> 400/422 with the typed envelope, never silent." Here it
is verified directly against the model (`pydantic.ValidationError`); the
HTTP-boundary version of the same gate lives in
`test_futoshiki_router.py::test_solve_board_non_adjacent_pair_rejected_422`.
"""

import pytest
from pydantic import ValidationError

from app.games.futoshiki.models import FutoshikiSolveRequest, validate_adjacent_inequalities


def test_adjacent_horizontal_pair_accepted():
    req = FutoshikiSolveRequest(values={}, inequalities=[(0, 1)], board_size=4)
    assert req.inequalities == [(0, 1)]


def test_adjacent_vertical_pair_accepted():
    # cell 0 and cell 4 are vertically adjacent on a 4x4 board.
    req = FutoshikiSolveRequest(values={}, inequalities=[(0, 4)], board_size=4)
    assert req.inequalities == [(0, 4)]


def test_empty_inequalities_accepted():
    req = FutoshikiSolveRequest(values={}, inequalities=[], board_size=4)
    assert req.inequalities == []


def test_non_adjacent_opposite_corners_rejected():
    with pytest.raises(ValidationError):
        FutoshikiSolveRequest(values={}, inequalities=[(0, 15)], board_size=4)


def test_diagonal_neighbor_rejected():
    """Manhattan distance 2 (diagonal) is the near-miss case: visually close,
    but no shared edge for a caret to render on."""
    with pytest.raises(ValidationError):
        FutoshikiSolveRequest(values={}, inequalities=[(0, 5)], board_size=4)


def test_same_row_non_adjacent_rejected():
    """(0, 2) share row 0 but are not orthogonally adjacent (one cell apart)."""
    with pytest.raises(ValidationError):
        FutoshikiSolveRequest(values={}, inequalities=[(0, 2)], board_size=4)


def test_out_of_range_index_rejected():
    with pytest.raises(ValidationError):
        FutoshikiSolveRequest(values={}, inequalities=[(0, 999)], board_size=4)


def test_negative_index_rejected():
    with pytest.raises(ValidationError):
        FutoshikiSolveRequest(values={}, inequalities=[(-1, 0)], board_size=4)


@pytest.mark.parametrize("board_size", [2, 3, 8, 20])
def test_out_of_range_board_size_rejected(board_size: int):
    with pytest.raises(ValidationError):
        FutoshikiSolveRequest(values={}, inequalities=[], board_size=board_size)


@pytest.mark.parametrize("board_size", [4, 5, 6, 7])
def test_shipped_board_sizes_accepted(board_size: int):
    req = FutoshikiSolveRequest(values={}, inequalities=[], board_size=board_size)
    assert req.board_size == board_size


def test_bad_value_key_rejected():
    with pytest.raises(ValidationError):
        FutoshikiSolveRequest(values={"not-a-digit": 1}, inequalities=[], board_size=4)


def test_negative_value_rejected():
    with pytest.raises(ValidationError):
        FutoshikiSolveRequest(values={"0": -1}, inequalities=[], board_size=4)


# ── Shared helper, exercised directly (used by the service too) ─────────────


def test_validate_adjacent_inequalities_raises_on_non_adjacent():
    with pytest.raises(ValueError, match="not orthogonally adjacent"):
        validate_adjacent_inequalities(4, [(0, 15)])


def test_validate_adjacent_inequalities_raises_on_out_of_range():
    with pytest.raises(ValueError, match="out of range"):
        validate_adjacent_inequalities(4, [(0, 999)])


def test_validate_adjacent_inequalities_passes_on_adjacent():
    validate_adjacent_inequalities(4, [(0, 1), (0, 4)])  # no raise
