"""Error-taxonomy + envelope contract.

Three layers, all against the real wheel:
  A. the 7-code vocabulary maps 1:1 to statuses and produces one envelope shape;
  B. fault-injected 408/429/500 (+ typed Rust exceptions) land on that envelope
     via `register_error_handlers` on a throwaway app;
  C. the assembled app produces the envelope for its real 400/404/422 paths.
"""

import pytest
from fastapi import FastAPI, Request
from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient
from slowapi import Limiter
from slowapi.util import get_remote_address

pytest.importorskip("csp_solver")

import csp_solver

from app.core.errors import (
    _RETRYABLE,
    _STATUS_FOR_CODE,
    ApiError,
    ApiErrorCode,
    envelope,
    register_error_handlers,
)
from app.main import app

# ── (A) Taxonomy vocabulary: 7 codes, one envelope shape ─────────────────────


def test_taxonomy_has_exactly_seven_codes():
    assert len(ApiErrorCode) == 7
    assert {c.value for c in ApiErrorCode} == {
        "UNSATISFIABLE",
        "BUDGET_EXCEEDED",
        "INVALID_INPUT",
        "TIMEOUT",
        "NOT_FOUND",
        "RATE_LIMITED",
        "INTERNAL",
    }


def test_every_code_maps_to_status_and_wellformed_envelope():
    for code in ApiErrorCode:
        assert code in _STATUS_FOR_CODE
        env = envelope(code, "some message")
        assert set(env["error"]) == {"code", "message", "retryable"}
        assert env["error"]["code"] == code.value
        assert env["error"]["message"] == "some message"
        assert env["error"]["retryable"] is (code in _RETRYABLE)


# ── (B) Fault-injected handlers on a throwaway app: 500/408/429 + typed ──────


@pytest.fixture
def fault_client():
    # A fresh Limiter per fixture instance keeps the 429 test's in-memory
    # counter isolated from the shared app limiter and from other tests.
    local_limiter = Limiter(key_func=get_remote_address)
    fault_app = FastAPI()
    fault_app.state.limiter = local_limiter
    register_error_handlers(fault_app)

    @fault_app.get("/boom")
    async def _boom() -> dict[str, str]:
        raise RuntimeError("secret internal rust file:line detail")

    @fault_app.get("/apitimeout")
    async def _apitimeout() -> dict[str, str]:
        raise ApiError(ApiErrorCode.TIMEOUT, "solver timed out")

    @fault_app.get("/budget")
    async def _budget() -> dict[str, str]:
        raise csp_solver.BudgetExceededError("search gave up at node budget")

    @fault_app.get("/unsat")
    async def _unsat() -> dict[str, str]:
        raise csp_solver.UnsatisfiableError("no solution exists")

    @fault_app.get("/limited")
    @local_limiter.limit("1/minute")
    async def _limited(request: Request) -> dict[str, bool]:
        return {"ok": True}

    return TestClient(fault_app, raise_server_exceptions=False)


def _assert_envelope(body: dict, code: str) -> None:
    assert set(body) == {"error"}
    assert set(body["error"]) == {"code", "message", "retryable"}
    assert body["error"]["code"] == code


def test_internal_500_is_enveloped_and_does_not_leak(fault_client: TestClient):
    resp = fault_client.get("/boom")
    assert resp.status_code == 500
    _assert_envelope(resp.json(), "INTERNAL")
    # Must NOT leak the raised exception's internal detail.
    assert resp.json()["error"]["message"] == "internal server error"
    assert "secret" not in resp.text


def test_timeout_408_via_api_error(fault_client: TestClient):
    resp = fault_client.get("/apitimeout")
    assert resp.status_code == 408
    _assert_envelope(resp.json(), "TIMEOUT")
    assert resp.json()["error"]["retryable"] is True


def test_budget_exceeded_408_via_typed_exception(fault_client: TestClient):
    resp = fault_client.get("/budget")
    assert resp.status_code == 408
    _assert_envelope(resp.json(), "BUDGET_EXCEEDED")


def test_unsatisfiable_400_via_typed_exception(fault_client: TestClient):
    resp = fault_client.get("/unsat")
    assert resp.status_code == 400
    _assert_envelope(resp.json(), "UNSATISFIABLE")


def test_rate_limited_429(fault_client: TestClient):
    first = fault_client.get("/limited")
    assert first.status_code == 200
    second = fault_client.get("/limited")
    assert second.status_code == 429
    _assert_envelope(second.json(), "RATE_LIMITED")


# ── (C) Real assembled app: 400 / 404 / 422 envelope paths ───────────────────


@pytest.fixture
async def client():
    async with app.router.lifespan_context(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            yield ac


async def test_invalid_size_400(client: AsyncClient):
    resp = await client.get("/api/v1/board/random/6/EASY")
    assert resp.status_code == 400
    _assert_envelope(resp.json(), "INVALID_INPUT")


async def test_missing_template_404(client: AsyncClient):
    # N=5 hard has no template bank — the locked N=5 policy rejects it here.
    resp = await client.get("/api/v1/board/random/5/HARD")
    assert resp.status_code == 404
    _assert_envelope(resp.json(), "NOT_FOUND")


async def test_pydantic_validation_422(client: AsyncClient):
    resp = await client.post("/api/v1/board/solve", json={"values": {}, "size": 10})
    assert resp.status_code == 422
    _assert_envelope(resp.json(), "INVALID_INPUT")


async def test_unsatisfiable_board_400(client: AsyncClient):
    # Two 1s in the same 4x4 unit — Rust proves UNSAT (no _has_conflicts port).
    resp = await client.post(
        "/api/v1/board/solve", json={"values": {"0": 1, "1": 1}, "size": 2}
    )
    assert resp.status_code == 400
    _assert_envelope(resp.json(), "UNSATISFIABLE")
