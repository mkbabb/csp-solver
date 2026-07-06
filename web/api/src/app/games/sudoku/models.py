"""Pydantic request/response models for the Sudoku API."""

from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel, Field, field_validator


class Difficulty(StrEnum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"


class SolveRequest(BaseModel):
    values: dict[str, int]
    size: int = Field(ge=2, le=5)

    @field_validator("values")
    @classmethod
    def validate_values(cls, v: dict[str, int]) -> dict[str, int]:
        # Range-vs-size validation happens in the service; this guards only
        # the key/value *shape* (numeric-string keys, non-negative values).
        for key, val in v.items():
            if not key.isdigit():
                raise ValueError(f"Key must be a numeric string, got: {key}")
            if val < 0:
                raise ValueError(f"Value must be a non-negative integer, got: {val}")
        return v


class SolveResponse(BaseModel):
    solved: bool
    values: dict[str, int]


class BoardResponse(BaseModel):
    values: dict[str, int]
    size: int
