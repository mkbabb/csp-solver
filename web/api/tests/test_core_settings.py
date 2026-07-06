"""Settings: the CORS comma-split validator + DI override reaching /config."""

import pytest
from httpx import ASGITransport, AsyncClient

pytest.importorskip("csp_solver")

from app.core.settings import Settings, get_settings
from app.main import app

# ── CORS comma-split validator ───────────────────────────────────────────────


def test_cors_comma_separated_is_split_and_stripped():
    s = Settings(cors_origins="http://a, http://b ,http://c")
    assert s.cors_origins == ["http://a", "http://b", "http://c"]


def test_cors_list_passes_through_untouched():
    s = Settings(cors_origins=["http://a", "http://b"])
    assert s.cors_origins == ["http://a", "http://b"]


def test_cors_empty_entries_dropped():
    s = Settings(cors_origins="http://a, ,http://b,")
    assert s.cors_origins == ["http://a", "http://b"]


# ── DI override: swapping Settings changes what /config reports ───────────────


async def test_config_route_reflects_settings_override():
    app.dependency_overrides[get_settings] = lambda: Settings(solver_timeout_s=1.5)
    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            resp = await ac.get("/api/v1/config")
        assert resp.status_code == 200
        assert resp.json() == {"solver_timeout_s": 1.5}
    finally:
        app.dependency_overrides.clear()
