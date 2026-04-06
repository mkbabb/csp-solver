"""Lattice domain for monotonic constraint satisfaction.

In a lattice CSP, values only grow via join — they never shrink.
AC-3 propagation alone reaches the unique fixed point.
No backtracking, no search. The domain is always a singleton
(the current accumulated value).

This is the Python counterpart of what BBNF uses for type inference,
FIRST sets, and FOLLOW sets.

Examples:
    - Set domain: value is a frozenset, join is union
    - Boolean domain: value is bool, join is logical OR
    - Type domain: value is a type descriptor, join is least upper bound
"""

from __future__ import annotations

from collections.abc import Callable, Iterator
from typing import TypeVar

T = TypeVar("T")


class LatticeDomain:
    """Domain for monotonic CSP — values grow via join(), never shrink.

    AC-3 propagation alone reaches the unique fixed point.
    No backtracking, no search. The domain is always a singleton
    (the current accumulated value).

    Examples:
        - Set domain: value is a frozenset, join is union
        - Boolean domain: value is bool, join is logical OR
        - Type domain: value is a type descriptor, join is least upper bound
    """

    def __init__(self, bottom: T, join_fn: Callable[[T, T], T]) -> None:
        """
        Args:
            bottom: Initial value (least element of the lattice).
            join_fn: (current, other) -> new_value. Must be monotonic.
        """
        self._value: T = bottom
        self._join_fn = join_fn

    @property
    def value(self) -> T:
        return self._value

    def join(self, other_value: T) -> bool:
        """Join other_value into this domain. Returns True if value changed."""
        new = self._join_fn(self._value, other_value)
        if new != self._value:
            self._value = new
            return True
        return False

    def size(self) -> int:
        return 1  # Always singleton

    def is_singleton(self) -> bool:
        return True

    def __contains__(self, item: object) -> bool:
        return item == self._value

    def __iter__(self) -> Iterator[T]:
        yield self._value

    def __len__(self) -> int:
        return 1

    def __repr__(self) -> str:
        return f"LatticeDomain({self._value!r})"


def set_lattice(initial: frozenset = frozenset()) -> LatticeDomain:
    """Lattice domain over sets — join is union."""
    return LatticeDomain(initial, lambda a, b: a | b)


def bool_lattice(initial: bool = False) -> LatticeDomain:
    """Lattice domain over booleans — join is OR."""
    return LatticeDomain(initial, lambda a, b: a or b)
