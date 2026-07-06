"""HTTP-shape tests for the assembled app: the Sudoku router + liveness.

Wire-shape only (status codes, request/response body shape). Orchestration
logic is covered in `test_sudoku_service.py`; the error envelope in
`test_core_errors.py`. Nothing here is mocked — it drives the real app over
the real `csp_solver` wheel.
"""

import pytest
from httpx import ASGITransport, AsyncClient

pytest.importorskip("csp_solver")
from app.main import app


@pytest.fixture
async def client():
    # `ASGITransport` does not run the app's lifespan, so the split executors
    # (built in `main.lifespan`) would be absent from `app.state`. Enter the
    # lifespan context explicitly around the client.
    async with app.router.lifespan_context(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            yield ac


async def test_health(client: AsyncClient):
    """App-liveness smoke — confirms the DI/lifespan assembly imports + mounts."""
    resp = await client.get("/api/v1/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


async def test_get_random_board(client: AsyncClient):
    resp = await client.get("/api/v1/board/random/2/EASY")
    assert resp.status_code == 200
    data = resp.json()
    assert "values" in data
    assert data["size"] == 2
    assert isinstance(data["values"], dict)


async def test_solve_board(client: AsyncClient):
    resp = await client.get("/api/v1/board/random/2/EASY")
    board = resp.json()

    resp = await client.post(
        "/api/v1/board/solve",
        json={"values": board["values"], "size": 2},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "solved" in data
    assert "values" in data
    # A full solution: every cell non-zero.
    assert all(v != 0 for v in data["values"].values())


async def test_config_exposes_solver_timeout(client: AsyncClient):
    """The NEW /config route hands the frontend the server's solve timeout."""
    resp = await client.get("/api/v1/config")
    assert resp.status_code == 200
    data = resp.json()
    assert "solver_timeout_s" in data
    assert data["solver_timeout_s"] > 0
