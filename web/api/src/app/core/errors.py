"""One JSON error envelope for every route; typed-exception -> HTTP mapping.

Before this: independent body shapes across the status codes, all consumed
identically by the frontend (which only checks `res.ok`). After this: every
route/handler below produces exactly one shape —

    {"error": {"code": "<ApiErrorCode>", "message": "<str>", "retryable": <bool>}}

`ApiErrorCode` is the one vocabulary every layer of the taxonomy shares:
`code.value` is verbatim `CspError::code()` for the four solver-originated
members (`csp-solver/src/error.rs`) — the same string a Rust-side
`except`/`catch` on `csp_solver.UnsatisfiableError` et al. or a wasm `.code`
property check would compare against. The frontend's `ApiError`
(`web/frontend/src/.../apiError.ts`) branches on this exact string.

The 6 HTTP statuses this service produces, and why each maps where it does:

- 400 — `UNSATISFIABLE` / `INVALID_INPUT`: bad size/value range, no solution
- 404 — `NOT_FOUND`: missing template directory (e.g. N=5 medium/hard)
- 408 — `TIMEOUT` / `BUDGET_EXCEEDED`: wall-clock `asyncio.wait_for` vs. Rust node budget
- 422 — `INVALID_INPUT`: Pydantic request-model validation (FastAPI default)
- 429 — `RATE_LIMITED`: slowapi
- 500 — `INTERNAL`: uncaught exception (the one remaining catch-all)

408 deliberately carries two distinct `code`s: the HTTP status is a coarse
"the search didn't finish" summary shared by both triggers (both are
`retryable`), while `code` keeps the *why* — node-count budget vs. wall-clock
deadline — precise.
"""

from __future__ import annotations

from enum import StrEnum
from typing import Any

import csp_solver  # type: ignore[import-untyped]  # PyO3 native module, no py.typed marker/stubs yet
from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from starlette.exceptions import HTTPException as StarletteHTTPException


class ApiErrorCode(StrEnum):
    UNSATISFIABLE = "UNSATISFIABLE"
    BUDGET_EXCEEDED = "BUDGET_EXCEEDED"
    INVALID_INPUT = "INVALID_INPUT"
    TIMEOUT = "TIMEOUT"
    NOT_FOUND = "NOT_FOUND"
    RATE_LIMITED = "RATE_LIMITED"
    INTERNAL = "INTERNAL"


_STATUS_FOR_CODE: dict[ApiErrorCode, int] = {
    ApiErrorCode.UNSATISFIABLE: status.HTTP_400_BAD_REQUEST,
    ApiErrorCode.INVALID_INPUT: status.HTTP_400_BAD_REQUEST,
    ApiErrorCode.NOT_FOUND: status.HTTP_404_NOT_FOUND,
    ApiErrorCode.TIMEOUT: status.HTTP_408_REQUEST_TIMEOUT,
    ApiErrorCode.BUDGET_EXCEEDED: status.HTTP_408_REQUEST_TIMEOUT,
    ApiErrorCode.RATE_LIMITED: status.HTTP_429_TOO_MANY_REQUESTS,
    ApiErrorCode.INTERNAL: status.HTTP_500_INTERNAL_SERVER_ERROR,
}

# Codes a client can usefully retry without changing its request.
_RETRYABLE = {
    ApiErrorCode.TIMEOUT,
    ApiErrorCode.BUDGET_EXCEEDED,
    ApiErrorCode.RATE_LIMITED,
    ApiErrorCode.INTERNAL,
}


def envelope(code: ApiErrorCode, message: str) -> dict[str, Any]:
    return {"error": {"code": code.value, "message": message, "retryable": code in _RETRYABLE}}


def error_response(
    code: ApiErrorCode, message: str, *, status_code: int | None = None
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code or _STATUS_FOR_CODE[code], content=envelope(code, message)
    )


class ApiError(Exception):
    """Raise from a service/route for an explicit, typed failure — replaces
    `HTTPException(500, f"...: {e}")` (leaks internals) and the
    `except Exception: return False, {}` conflation of crash-vs-unsatisfiable
    with one class carrying an explicit `code`."""

    def __init__(self, code: ApiErrorCode, message: str, *, status_code: int | None = None) -> None:
        self.code = code
        self.message = message
        self.status_code = status_code or _STATUS_FOR_CODE[code]
        super().__init__(message)


def register_error_handlers(app: FastAPI) -> None:
    """Wire every failure mode this service can produce onto the one envelope
    shape. Call once from `main.py` at app construction."""

    @app.exception_handler(ApiError)
    async def _handle_api_error(_: Request, exc: ApiError) -> JSONResponse:
        return error_response(exc.code, exc.message, status_code=exc.status_code)

    # The typed Rust exceptions (`create_exception!`, `csp-solver/src/py/errors.rs`)
    # — if a service method lets one propagate uncaught instead of catching and
    # re-raising as `ApiError`, it still lands on the shared envelope rather
    # than a raw 500 traceback.
    @app.exception_handler(csp_solver.UnsatisfiableError)
    async def _handle_unsatisfiable(_: Request, exc: Exception) -> JSONResponse:
        return error_response(ApiErrorCode.UNSATISFIABLE, str(exc))

    @app.exception_handler(csp_solver.BudgetExceededError)
    async def _handle_budget_exceeded(_: Request, exc: Exception) -> JSONResponse:
        return error_response(ApiErrorCode.BUDGET_EXCEEDED, str(exc))

    @app.exception_handler(csp_solver.InvalidInputError)
    async def _handle_invalid_input(_: Request, exc: Exception) -> JSONResponse:
        return error_response(ApiErrorCode.INVALID_INPUT, str(exc))

    @app.exception_handler(csp_solver.CspTimeoutError)
    async def _handle_csp_timeout(_: Request, exc: Exception) -> JSONResponse:
        return error_response(ApiErrorCode.TIMEOUT, str(exc))

    @app.exception_handler(RequestValidationError)
    async def _handle_validation(_: Request, exc: RequestValidationError) -> JSONResponse:
        return error_response(
            ApiErrorCode.INVALID_INPUT,
            str(jsonable_encoder(exc.errors())),
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        )

    # slowapi's `RateLimitExceeded` is itself a `StarletteHTTPException`
    # subclass; registering it explicitly takes priority over the generic
    # handler below (FastAPI resolves by exact type first).
    @app.exception_handler(RateLimitExceeded)
    async def _handle_rate_limited(_: Request, exc: RateLimitExceeded) -> JSONResponse:
        return error_response(ApiErrorCode.RATE_LIMITED, str(exc.detail))

    @app.exception_handler(StarletteHTTPException)
    async def _handle_http_exception(_: Request, exc: StarletteHTTPException) -> JSONResponse:
        # Bridges any remaining plain `HTTPException(...)` raise onto the same
        # envelope, keyed by the status code it already chose.
        code = {
            status.HTTP_404_NOT_FOUND: ApiErrorCode.NOT_FOUND,
            status.HTTP_408_REQUEST_TIMEOUT: ApiErrorCode.TIMEOUT,
            status.HTTP_429_TOO_MANY_REQUESTS: ApiErrorCode.RATE_LIMITED,
        }.get(
            exc.status_code,
            ApiErrorCode.INVALID_INPUT if exc.status_code < 500 else ApiErrorCode.INTERNAL,
        )
        return error_response(code, str(exc.detail), status_code=exc.status_code)

    @app.exception_handler(Exception)
    async def _handle_uncaught(_: Request, exc: Exception) -> JSONResponse:
        # The one remaining catch-all. Reports honestly as INTERNAL — never
        # conflated with "no solution" (the old `except Exception: return
        # False, {}` pattern), and never leaks `str(exc)` (which, for a PyO3
        # panic boundary, could include internal Rust file/line/type detail).
        return error_response(ApiErrorCode.INTERNAL, "internal server error")
