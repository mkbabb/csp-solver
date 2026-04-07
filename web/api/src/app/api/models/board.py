"""Pydantic models for the board API."""

from enum import Enum

from pydantic import BaseModel, Field, field_validator


class Difficulty(str, Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"


class SolveRequest(BaseModel):
    values: dict[str, int]
    size: int = Field(ge=2, le=5)

    @field_validator("values")
    @classmethod
    def validate_values(cls, v: dict[str, int], info) -> dict[str, int]:
        # Values will be validated against size in the route
        for key, val in v.items():
            if not key.isdigit():
                raise ValueError(f"Key must be a numeric string, got: {key}")
            if not isinstance(val, int) or val < 0:
                raise ValueError(f"Value must be a non-negative integer, got: {val}")
        return v


class SolveResponse(BaseModel):
    solved: bool
    values: dict[str, int]


class BoardResponse(BaseModel):
    values: dict[str, int]
    size: int
