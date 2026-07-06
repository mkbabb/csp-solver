"""HTTP-shape tests for the Futoshiki router: random/solve, over the real
`csp_solver` wheel — mirrors `test_sudoku_router.py`'s discipline (nothing
mocked, drives the real assembled app).

Also carries the G3 acceptance-gate negative control at the HTTP boundary: a
non-adjacent inequality pair must produce `422`/`INVALID_INPUT`, never a
silent accept or a bare 500.
"""

import pytest
from httpx import ASGITransport, AsyncClient

pytest.importorskip("csp_solver")
from app.main import app


@pytest.fixture
async def client():
    # `ASGITransport` does not run the app's lifespan, so the split executors
    # (built in `main.lifespan`) would be absent from `app.state`. Enter the
    # lifespan context explicitly around the client — same as the Sudoku
    # router tests.
    async with app.router.lifespan_context(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            yield ac


async def test_get_random_board(client: AsyncClient):
    resp = await client.get("/api/v1/futoshiki/random/4")
    assert resp.status_code == 200
    data = resp.json()
    assert data["board_size"] == 4
    assert isinstance(data["values"], dict)
    assert isinstance(data["inequalities"], list)
    # Every inequality pair is a 2-element (a, b) list/tuple over the wire.
    for pair in data["inequalities"]:
        assert len(pair) == 2


@pytest.mark.parametrize("board_size", [4, 5, 6, 7])
async def test_get_random_board_all_shipped_sizes(client: AsyncClient, board_size: int):
    """v1 locked scope: N=4-7 (F2/F3) — every shipped size must generate."""
    resp = await client.get(f"/api/v1/futoshiki/random/{board_size}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["board_size"] == board_size
    assert len(data["values"]) <= board_size * board_size


@pytest.mark.parametrize("board_size", [2, 3, 8, 20])
async def test_get_random_board_out_of_range_size_rejected(client: AsyncClient, board_size: int):
    """Out-of-range board_size -> INVALID_INPUT, never a silent 200/500."""
    resp = await client.get(f"/api/v1/futoshiki/random/{board_size}")
    assert resp.status_code == 400
    body = resp.json()
    assert body["error"]["code"] == "INVALID_INPUT"


async def test_solve_board(client: AsyncClient):
    resp = await client.get("/api/v1/futoshiki/random/4")
    board = resp.json()

    resp = await client.post(
        "/api/v1/futoshiki/solve",
        json={
            "values": board["values"],
            "inequalities": board["inequalities"],
            "board_size": board["board_size"],
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "solved" in data
    assert "values" in data
    # A full solution: every cell non-zero.
    assert all(v != 0 for v in data["values"].values())


async def test_solve_board_non_adjacent_pair_rejected_422(client: AsyncClient):
    """G3 — HTTP boundary negative control (F4): opposite corners of a 4x4
    board (indices 0 and 15) are not orthogonally adjacent. The Pydantic
    `model_validator` (models.py) must reject this before the service/solver
    ever sees it — 422, typed INVALID_INPUT envelope, never a silent solve."""
    resp = await client.post(
        "/api/v1/futoshiki/solve",
        json={"values": {}, "inequalities": [[0, 15]], "board_size": 4},
    )
    assert resp.status_code == 422
    body = resp.json()
    assert body["error"]["code"] == "INVALID_INPUT"


async def test_solve_board_diagonal_pair_rejected_422(client: AsyncClient):
    """Diagonal neighbors (Manhattan distance 2) are the classic near-miss:
    visually close but not sharing an edge, so no caret can render it."""
    resp = await client.post(
        "/api/v1/futoshiki/solve",
        json={"values": {}, "inequalities": [[0, 5]], "board_size": 4},
    )
    assert resp.status_code == 422
    body = resp.json()
    assert body["error"]["code"] == "INVALID_INPUT"


async def test_solve_board_out_of_range_index_rejected_422(client: AsyncClient):
    resp = await client.post(
        "/api/v1/futoshiki/solve",
        json={"values": {}, "inequalities": [[0, 999]], "board_size": 4},
    )
    assert resp.status_code == 422
    body = resp.json()
    assert body["error"]["code"] == "INVALID_INPUT"


async def test_solve_board_out_of_range_board_size_rejected_422(client: AsyncClient):
    resp = await client.post(
        "/api/v1/futoshiki/solve",
        json={"values": {}, "inequalities": [], "board_size": 99},
    )
    assert resp.status_code == 422
    body = resp.json()
    assert body["error"]["code"] == "INVALID_INPUT"
