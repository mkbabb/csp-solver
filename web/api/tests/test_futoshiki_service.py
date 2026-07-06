"""FutoshikiService orchestration: generate/solve happy paths + typed
failures. Mirrors `test_sudoku_service.py`'s discipline — constructs the
service directly with real `Settings`/`Executors` (no HTTP layer); only the
timeout branch mocks `csp_solver.solve_futoshiki`, everything else drives the
real wheel.
"""

import time
from concurrent.futures import ThreadPoolExecutor

import pytest

pytest.importorskip("csp_solver")

import app.games.futoshiki.service as service_mod
from app.core.errors import ApiError, ApiErrorCode
from app.core.executors import Executors
from app.core.settings import Settings
from app.games.futoshiki.service import FutoshikiService


def make_service(**settings_overrides):
    settings = Settings(**settings_overrides)
    executors = Executors(
        random=ThreadPoolExecutor(max_workers=1),
        solve=ThreadPoolExecutor(max_workers=1),
    )
    return settings, executors, FutoshikiService(settings, executors)


# ── Generation ───────────────────────────────────────────────────────────────


async def test_get_random_board_returns_partial_grid():
    _, ex, svc = make_service()
    try:
        values, inequalities = await svc.get_random_board(4)
        assert isinstance(values, dict)
        assert isinstance(inequalities, list)
        assert len(values) <= 16  # 4x4 = 16 cells, high-density but not full
        assert all(1 <= v <= 4 for v in values.values())
    finally:
        ex.shutdown()


@pytest.mark.parametrize("board_size", [4, 5, 6, 7])
async def test_get_random_board_all_shipped_sizes(board_size: int):
    """v1 locked scope: N=4-7, single high-density tier, no difficulty param."""
    _, ex, svc = make_service()
    try:
        values, inequalities = await svc.get_random_board(board_size)
        total = board_size * board_size
        assert len(values) <= total
        for pos_str, val in values.items():
            assert 0 <= int(pos_str) < total
            assert 1 <= val <= board_size
    finally:
        ex.shutdown()


@pytest.mark.parametrize("board_size", [2, 3, 8, 100])
async def test_get_random_board_out_of_range_size_raises_invalid_input(board_size: int):
    _, ex, svc = make_service()
    try:
        with pytest.raises(ApiError) as ei:
            await svc.get_random_board(board_size)
        assert ei.value.code == ApiErrorCode.INVALID_INPUT
    finally:
        ex.shutdown()


# ── Solving ──────────────────────────────────────────────────────────────────


async def test_solve_returns_completed_solution():
    _, ex, svc = make_service()
    try:
        values, inequalities = await svc.get_random_board(4)
        solved, solution = await svc.solve_board(values, inequalities, 4)
        assert len(solution) == 16
        assert all(v != 0 for v in solution.values())
    finally:
        ex.shutdown()


async def test_solve_already_solved_board_reports_solved_true():
    _, ex, svc = make_service()
    try:
        values, inequalities = await svc.get_random_board(4)
        # Solve once to get a full solution, then feed it back as "given".
        _, full = await svc.solve_board(values, inequalities, 4)
        solved, solution = await svc.solve_board(full, inequalities, 4)
        assert solved is True
        assert solution == full
    finally:
        ex.shutdown()


async def test_solve_unsatisfiable_raises():
    _, ex, svc = make_service()
    try:
        with pytest.raises(ApiError) as ei:
            # Two 1s in the same row of a 4x4 -> Rust proves UNSAT.
            await svc.solve_board({"0": 1, "1": 1}, [], 4)
        assert ei.value.code == ApiErrorCode.UNSATISFIABLE
    finally:
        ex.shutdown()


async def test_solve_position_out_of_range_raises_invalid_input():
    _, ex, svc = make_service()
    try:
        with pytest.raises(ApiError) as ei:
            await svc.solve_board({"999": 1}, [], 4)  # max index for N=4 is 15
        assert ei.value.code == ApiErrorCode.INVALID_INPUT
    finally:
        ex.shutdown()


async def test_solve_value_out_of_range_raises_invalid_input():
    _, ex, svc = make_service()
    try:
        with pytest.raises(ApiError) as ei:
            await svc.solve_board({"0": 99}, [], 4)  # max value for N=4 is 4
        assert ei.value.code == ApiErrorCode.INVALID_INPUT
    finally:
        ex.shutdown()


async def test_solve_out_of_range_board_size_raises_invalid_input():
    _, ex, svc = make_service()
    try:
        with pytest.raises(ApiError) as ei:
            await svc.solve_board({}, [], 20)
        assert ei.value.code == ApiErrorCode.INVALID_INPUT
    finally:
        ex.shutdown()


# ── G3 — adjacency negative control (defense in depth, service layer) ────────


async def test_solve_non_adjacent_pair_raises_invalid_input():
    """Opposite corners of a 4x4 board (0 and 15) are not orthogonally
    adjacent — the service's own `validate_adjacent_inequalities` re-check
    (defense in depth, independent of the Pydantic layer this call bypasses)
    must reject it."""
    _, ex, svc = make_service()
    try:
        with pytest.raises(ApiError) as ei:
            await svc.solve_board({}, [(0, 15)], 4)
        assert ei.value.code == ApiErrorCode.INVALID_INPUT
    finally:
        ex.shutdown()


async def test_solve_diagonal_pair_raises_invalid_input():
    _, ex, svc = make_service()
    try:
        with pytest.raises(ApiError) as ei:
            await svc.solve_board({}, [(0, 5)], 4)
        assert ei.value.code == ApiErrorCode.INVALID_INPUT
    finally:
        ex.shutdown()


async def test_solve_adjacent_pair_accepted():
    """Positive control: a genuinely adjacent pair (0, 1 — same row) must NOT
    be rejected by the adjacency check."""
    _, ex, svc = make_service()
    try:
        # (0, 1) means cell 0 > cell 1 — arbitrary direction, just needs to
        # pass adjacency; may or may not be satisfiable with no other givens,
        # so accept either a solution or an UNSATISFIABLE, but never
        # INVALID_INPUT for adjacency reasons.
        try:
            await svc.solve_board({}, [(0, 1)], 4)
        except ApiError as e:
            assert e.code != ApiErrorCode.INVALID_INPUT
    finally:
        ex.shutdown()


async def test_solve_timeout_fires_cancel_token(monkeypatch):
    """When the wall-clock deadline elapses, the service fires the
    CancelToken so the (here, simulated-stuck) native solve is asked to
    stop, and raises ApiError(TIMEOUT)."""
    captured: dict[str, object] = {}

    def fake_solve(csp, cancel=None):
        captured["token"] = cancel
        time.sleep(0.4)  # ignores the token — simulates an unresponsive native solve
        return False

    monkeypatch.setattr(service_mod.csp_solver, "solve_futoshiki", fake_solve)

    _, ex, svc = make_service(solver_timeout_s=0.05)
    try:
        with pytest.raises(ApiError) as ei:
            await svc.solve_board({"0": 1}, [], 4)
        assert ei.value.code == ApiErrorCode.TIMEOUT
    finally:
        ex.shutdown()

    token = captured["token"]
    assert token is not None
    assert token.is_cancelled
