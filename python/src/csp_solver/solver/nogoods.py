"""Bounded nogood store with LRU eviction for CSP backtracking."""

from __future__ import annotations

from collections import OrderedDict
from typing import Any


class NogoodStore:
    """Hash-based nogood store recording conflict tuples.

    A nogood is a frozenset of (variable, value) pairs that cannot
    all simultaneously hold in any solution. Used with CBJ to prune
    dead subtrees without re-exploring them.

    Bounded by max_length (max vars per nogood) and max_entries (LRU eviction).
    """

    __slots__ = ("max_length", "max_entries", "_store", "_var_index")

    def __init__(self, max_length: int = 6, max_entries: int = 1000) -> None:
        self.max_length = max_length
        self.max_entries = max_entries
        self._store: OrderedDict[frozenset[tuple[Any, Any]], None] = OrderedDict()
        self._var_index: dict[Any, list[frozenset[tuple[Any, Any]]]] = {}

    def record(self, conflict_assignments: dict[Any, Any]) -> None:
        """Record a nogood from a conflict assignment dict {var: val}."""
        if len(conflict_assignments) > self.max_length or not conflict_assignments:
            return

        nogood = frozenset(conflict_assignments.items())
        if nogood in self._store:
            self._store.move_to_end(nogood)
            return

        # Evict oldest if at capacity
        if len(self._store) >= self.max_entries:
            evicted, _ = self._store.popitem(last=False)
            for var, _ in evicted:
                idx = self._var_index.get(var)
                if idx is not None:
                    try:
                        idx.remove(evicted)
                    except ValueError:
                        pass

        self._store[nogood] = None

        # Index by variable for fast lookup
        for var, _ in nogood:
            if var not in self._var_index:
                self._var_index[var] = []
            self._var_index[var].append(nogood)

    def is_nogood(self, variable: Any, value: Any, solution: dict[Any, Any]) -> bool:
        """Check if assigning variable=value would complete any stored nogood."""
        candidates = self._var_index.get(variable)
        if not candidates:
            return False

        for nogood in candidates:
            # Check if (variable, value) is in this nogood
            if (variable, value) not in nogood:
                continue
            # Check if all other assignments in the nogood match the solution
            match = True
            for var, val in nogood:
                if var == variable:
                    continue
                if solution.get(var) != val:
                    match = False
                    break
            if match:
                self._store.move_to_end(nogood)
                return True
        return False

    def clear(self) -> None:
        """Reset the store."""
        self._store.clear()
        self._var_index.clear()
