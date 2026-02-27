"""Tests for the FastAPI endpoints."""

import pytest
from httpx import ASGITransport, AsyncClient

from csp_solver.api.main import app


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    resp = await client.get("/api/v1/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_get_random_board(client: AsyncClient):
    resp = await client.get("/api/v1/board/random/2/EASY")
    assert resp.status_code == 200
    data = resp.json()
    assert "values" in data
    assert data["size"] == 2


@pytest.mark.asyncio
async def test_solve_board(client: AsyncClient):
    # Get a random board first
    resp = await client.get("/api/v1/board/random/2/EASY")
    board = resp.json()

    # Solve it
    resp = await client.post(
        "/api/v1/board/solve",
        json={"values": board["values"], "size": 2},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "solved" in data
    assert "values" in data
    # All values should be non-zero in the solution
    assert all(v != 0 for v in data["values"].values())


@pytest.mark.asyncio
async def test_invalid_size(client: AsyncClient):
    resp = await client.get("/api/v1/board/random/6/EASY")
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_invalid_solve_request(client: AsyncClient):
    resp = await client.post(
        "/api/v1/board/solve",
        json={"values": {}, "size": 10},
    )
    assert resp.status_code == 422  # Pydantic validation error
