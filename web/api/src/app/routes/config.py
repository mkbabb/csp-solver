"""Shared runtime configuration exposed to the frontend.

The frontend's client-side `AbortSignal` timeout needs to be provably `>=`
the server's own `solver_timeout_s` instead of an independently hardcoded
guess two files can silently drift apart from. Rather than inventing a
cross-language-constant-sharing mechanism (a generated file, a build-time
embed), this exposes the live value over the wire the service already speaks:
the frontend fetches it once at boot and derives its `AbortSignal.timeout(...)`
from the response instead of a hardcoded literal.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.settings import Settings, get_settings

router = APIRouter()


class ClientConfig(BaseModel):
    solver_timeout_s: float


@router.get("/config")
async def get_config(settings: Settings = Depends(get_settings)) -> ClientConfig:
    return ClientConfig(solver_timeout_s=settings.solver_timeout_s)
