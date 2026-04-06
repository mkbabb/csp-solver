"""Bitmask-backed domain for integer CSP variables.

Duck-typed set replacement: O(1) copy via int assignment, POPCNT-based len(),
bit-trick iteration. Auto-used for integer domains where all values fit in 64 bits.
"""

from __future__ import annotations

from collections.abc import Iterator
from typing import Any


class BitsetDomain:
    """Set-like domain backed by an integer bitmask.

    Values must be non-negative integers. Supports the same interface as set
    for CSP solver interop: len, in, iter, discard, add, update, copy, bool.
    """

    __slots__ = ("_bits",)

    def __init__(self, values: Any = ()) -> None:
        bits = 0
        for v in values:
            bits |= 1 << v
        self._bits = bits

    def __contains__(self, v: object) -> bool:
        if not isinstance(v, int):
            return False
        return bool(self._bits & (1 << v))

    def __len__(self) -> int:
        return self._bits.bit_count()

    def __bool__(self) -> bool:
        return self._bits != 0

    def __iter__(self) -> Iterator[int]:
        bits = self._bits
        while bits:
            lowest = bits & -bits
            yield lowest.bit_length() - 1
            bits ^= lowest

    def __repr__(self) -> str:
        return f"BitsetDomain({set(self)})"

    def copy(self) -> BitsetDomain:
        new = object.__new__(BitsetDomain)
        new._bits = self._bits
        return new

    def discard(self, v: int) -> None:
        self._bits &= ~(1 << v)

    def add(self, v: int) -> None:
        self._bits |= 1 << v

    def update(self, other: Any) -> None:
        if isinstance(other, BitsetDomain):
            self._bits |= other._bits
        else:
            for v in other:
                self._bits |= 1 << v

    def difference(self, other: Any) -> BitsetDomain:
        result = self.copy()
        if isinstance(other, BitsetDomain):
            result._bits &= ~other._bits
        else:
            for v in other:
                result._bits &= ~(1 << v)
        return result

    def __sub__(self, other: Any) -> BitsetDomain:
        return self.difference(other)

    def __or__(self, other: BitsetDomain) -> BitsetDomain:
        result = self.copy()
        result._bits |= other._bits
        return result

    def __and__(self, other: BitsetDomain) -> BitsetDomain:
        result = self.copy()
        result._bits &= other._bits
        return result
