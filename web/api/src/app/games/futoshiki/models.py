"""Pydantic request/response models for the Futoshiki API.

Mirrors `games/sudoku/models.py`'s shape, with two deliberate divergences:

- **`board_size`, never `size`** (F5): Sudoku's `size` is the *subgrid* side
  (board is `size**2`); Futoshiki has no subgrid, so its natural size
  parameter is the board side directly. Reusing the bare name `size` for a
  differently-scaled quantity is a live footgun the wave spec calls out by
  name — every model here spells it `board_size`. `test_futoshiki_contract.py`
  asserts this file (and its router/service siblings) never reintroduces a
  bare `size` alias.
- **No `Difficulty`** (F3): v1 ships a single high-density tier with no
  difficulty parameter — fabricated EASY/MEDIUM/HARD bands with no measured
  separation are worse than shipping none (see the wave spec's F2/F3, and
  `rust-surgeon`'s G2 calibration record, which measured bands but ships none).

**G3 (pydantic layer)**: `_validate_adjacency` below is this layer's own
negative control for F4 (a valid-per-solver, unrenderable-per-frontend
inequality pair) — independent of the identical check `FutoshikiPuzzle::
from_parts` (Rust) and the PyO3/wasm boundaries perform. A non-adjacent pair
fails Pydantic model validation before the request ever reaches the service,
surfacing as FastAPI's `RequestValidationError` -> the shared 422
`INVALID_INPUT` envelope (`core/errors.py::_handle_validation`) — never a
silent accept, and never a bare 500.
"""

from __future__ import annotations

from pydantic import BaseModel, Field, field_validator, model_validator


def validate_adjacent_inequalities(board_size: int, inequalities: list[tuple[int, int]]) -> None:
    """Shared adjacency check — the one source of truth both the Pydantic
    `model_validator` below and `FutoshikiService` (defense in depth for
    direct/non-HTTP callers) validate against, rather than two independently
    drifting copies of the same geometry. Raises `ValueError` on a
    non-adjacent or out-of-range pair; callers translate that into their own
    layer's failure shape (a Pydantic `ValidationError` here, an `ApiError`
    in the service)."""
    total = board_size * board_size
    for a, b in inequalities:
        if a < 0 or b < 0 or a >= total or b >= total:
            raise ValueError(
                f"inequality pair ({a}, {b}) out of range for a {board_size}x{board_size} "
                f"board (both indices must be < {total})"
            )
        ra, ca = divmod(a, board_size)
        rb, cb = divmod(b, board_size)
        manhattan = abs(ra - rb) + abs(ca - cb)
        if manhattan != 1:
            raise ValueError(
                f"inequality pair ({a}, {b}) is not orthogonally adjacent: cells "
                f"({ra},{ca}) and ({rb},{cb}) are Manhattan distance {manhattan} apart"
            )


class FutoshikiSolveRequest(BaseModel):
    values: dict[str, int]
    inequalities: list[tuple[int, int]]
    board_size: int = Field(ge=4, le=7)

    @field_validator("values")
    @classmethod
    def validate_values(cls, v: dict[str, int]) -> dict[str, int]:
        # Range-vs-board_size validation happens in the service; this guards
        # only the key/value *shape* (numeric-string keys, non-negative
        # values) — same split of concerns as SolveRequest.validate_values.
        for key, val in v.items():
            if not key.isdigit():
                raise ValueError(f"Key must be a numeric string, got: {key}")
            if val < 0:
                raise ValueError(f"Value must be a non-negative integer, got: {val}")
        return v

    @model_validator(mode="after")
    def validate_inequalities_adjacent(self) -> FutoshikiSolveRequest:
        """G3 pydantic-layer negative control (F4): every `(a, b)` pair must
        be in range and orthogonally adjacent (`|Δrow| + |Δcol| == 1`) — the
        only relation a boundary caret can render. Mirrors
        `FutoshikiPuzzle::from_parts`'s check verbatim so this layer rejects
        independently, not by delegating to the Rust boundary."""
        validate_adjacent_inequalities(self.board_size, self.inequalities)
        return self


class FutoshikiSolveResponse(BaseModel):
    solved: bool
    values: dict[str, int]


class FutoshikiBoardResponse(BaseModel):
    values: dict[str, int]
    inequalities: list[tuple[int, int]]
    board_size: int
