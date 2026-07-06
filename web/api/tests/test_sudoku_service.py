"""SudokuService orchestration: generate/solve happy paths + typed failures.

Constructs the service directly with real `Settings`/`Executors` (no HTTP
layer). The timeout branch mocks `csp_solver.solve_sudoku` to prove the
wall-clock stop fires the `CancelToken`; everything else drives the real wheel.
"""

import time
from concurrent.futures import ThreadPoolExecutor

import pytest

pytest.importorskip("csp_solver")

import app.games.sudoku.service as service_mod
from app.core.errors import ApiError, ApiErrorCode
from app.core.executors import Executors
from app.core.settings import Settings
from app.games.sudoku.service import SudokuService


def make_service(**settings_overrides):
    settings = Settings(**settings_overrides)
    executors = Executors(
        random=ThreadPoolExecutor(max_workers=1),
        solve=ThreadPoolExecutor(max_workers=1),
    )
    return settings, executors, SudokuService(settings, executors)


# ── Generation ───────────────────────────────────────────────────────────────


async def test_get_random_board_returns_full_grid():
    _, ex, svc = make_service()
    try:
        board = await svc.get_random_board(2, "EASY")
        assert isinstance(board, dict)
        assert len(board) == (2**2) ** 2  # 4x4 = 16 cells
    finally:
        ex.shutdown()


async def test_get_random_board_invalid_size_raises_invalid_input():
    _, ex, svc = make_service()
    try:
        with pytest.raises(ApiError) as ei:
            await svc.get_random_board(6, "EASY")
        assert ei.value.code == ApiErrorCode.INVALID_INPUT
    finally:
        ex.shutdown()


async def test_get_random_board_invalid_difficulty_raises_invalid_input():
    _, ex, svc = make_service()
    try:
        with pytest.raises(ApiError) as ei:
            await svc.get_random_board(2, "NOPE")
        assert ei.value.code == ApiErrorCode.INVALID_INPUT
    finally:
        ex.shutdown()


async def test_get_random_board_missing_templates_raises_not_found():
    # N=5 hard has no template bank (locked N=5 policy).
    _, ex, svc = make_service()
    try:
        with pytest.raises(ApiError) as ei:
            await svc.get_random_board(5, "HARD")
        assert ei.value.code == ApiErrorCode.NOT_FOUND
    finally:
        ex.shutdown()


# ── Solving ──────────────────────────────────────────────────────────────────


async def test_solve_returns_completed_solution():
    _, ex, svc = make_service()
    try:
        board = await svc.get_random_board(2, "EASY")
        solved, values = await svc.solve_board(board, 2)
        assert len(values) == 16
        assert all(v != 0 for v in values.values())
    finally:
        ex.shutdown()


async def test_solve_unsatisfiable_raises():
    _, ex, svc = make_service()
    try:
        with pytest.raises(ApiError) as ei:
            # Two 1s in the same 4x4 unit → Rust proves UNSAT.
            await svc.solve_board({"0": 1, "1": 1}, 2)
        assert ei.value.code == ApiErrorCode.UNSATISFIABLE
    finally:
        ex.shutdown()


async def test_solve_position_out_of_range_raises_invalid_input():
    _, ex, svc = make_service()
    try:
        with pytest.raises(ApiError) as ei:
            await svc.solve_board({"999": 1}, 2)  # max_pos for N=2 is 15
        assert ei.value.code == ApiErrorCode.INVALID_INPUT
    finally:
        ex.shutdown()


async def test_solve_timeout_fires_cancel_token(monkeypatch):
    """When the wall-clock deadline elapses, the service fires the CancelToken
    so the (here, simulated-stuck) native solve is asked to stop, and raises
    ApiError(TIMEOUT)."""
    captured: dict[str, object] = {}

    def fake_solve(csp, cancel=None):
        captured["token"] = cancel
        time.sleep(0.4)  # ignores the token — simulates an unresponsive native solve
        return False

    monkeypatch.setattr(service_mod.csp_solver, "solve_sudoku", fake_solve)

    _, ex, svc = make_service(solver_timeout_s=0.05)
    try:
        with pytest.raises(ApiError) as ei:
            await svc.solve_board({"0": 1}, 2)
        assert ei.value.code == ApiErrorCode.TIMEOUT
    finally:
        ex.shutdown()

    token = captured["token"]
    assert token is not None
    # The timeout branch called token.cancel().
    assert token.is_cancelled
