"""Type stubs for the csp_solver PyO3 extension module.

Hand-written against the current pruned surface: futoshiki bindings and
caller-dead symbols pruned. maturin auto-detects this root `csp_solver.pyi`
(module-name == stub stem) and ships it as `csp_solver/__init__.pyi` alongside
an auto-added `py.typed` — no `[tool.maturin]` config, no Cargo change.

Kept in lockstep with `src/py/` by the tests-py `mypy.stubtest` contract, which
runs flag-free (no `--ignore-missing-stub`) so surface *growth* also fails loud.
The `__all__` below mirrors pyo3's auto-generated module `__all__`; keep the two
identical or stubtest flags the drift.
"""

from typing import Optional, final

__all__ = [
    "Pruning",
    "Ordering",
    "SolveConfig",
    "SolveStats",
    "CancelToken",
    "Csp",
    "SudokuDifficulty",
    "SudokuCSP",
    "create_sudoku_csp",
    "solve_sudoku",
    "create_random_board",
    "UnsatisfiableError",
    "BudgetExceededError",
    "InvalidInputError",
    "CspTimeoutError",
]

# ── enums ────────────────────────────────────────────────────────────────────

@final
class Pruning:
    NONE: Pruning
    FORWARD_CHECKING: Pruning
    AC3: Pruning
    AC_FC: Pruning

@final
class Ordering:
    CHRONOLOGICAL: Ordering
    FAIL_FIRST: Ordering
    MRV: Ordering

@final
class SudokuDifficulty:
    EASY: SudokuDifficulty
    MEDIUM: SudokuDifficulty
    HARD: SudokuDifficulty
    @classmethod
    def get(
        cls, key: str, default: Optional[SudokuDifficulty] = ...
    ) -> Optional[SudokuDifficulty]: ...

# ── cancellation + config ────────────────────────────────────────────────────

@final
class CancelToken:
    def __init__(self) -> None: ...
    def cancel(self) -> None: ...
    @property
    def is_cancelled(self) -> bool: ...

@final
class SolveConfig:
    pruning: Pruning
    ordering: Ordering
    max_solutions: int
    node_budget: Optional[int]
    cancel: Optional[CancelToken]
    def __new__(
        cls,
        pruning: Pruning = ...,
        ordering: Ordering = ...,
        max_solutions: int = ...,
        node_budget: Optional[int] = ...,
        cancel: Optional[CancelToken] = ...,
    ) -> SolveConfig: ...

@final
class SolveStats:
    @property
    def backtracks(self) -> int: ...
    @property
    def nodes_explored(self) -> int: ...
    @property
    def propagations(self) -> int: ...
    @property
    def budget_exceeded(self) -> bool: ...
    @property
    def cancelled(self) -> bool: ...

# ── generic solver ───────────────────────────────────────────────────────────

@final
class Csp:
    def __init__(self) -> None: ...
    def add_variable(self, domain: list[int]) -> int: ...
    def add_not_equal(self, x: int, y: int) -> None: ...
    def add_all_different(self, vars: list[int]) -> None: ...
    def finalize(self) -> None: ...
    def propagate(self) -> bool: ...
    def solve(self, config: SolveConfig) -> list[dict[int, int]]: ...
    @property
    def stats(self) -> SolveStats: ...

# ── sudoku convenience surface ───────────────────────────────────────────────

@final
class SudokuCSP:
    @property
    def solutions(self) -> list[dict[str, int]]: ...
    @property
    def backtrack_count(self) -> int: ...

def create_sudoku_csp(
    N: int, values: dict[str, int], max_solutions: int = ...
) -> SudokuCSP: ...
def solve_sudoku(csp: SudokuCSP, cancel: Optional[CancelToken] = ...) -> bool: ...
def create_random_board(
    N: int,
    difficulty: SudokuDifficulty = ...,
    templates: Optional[list[dict[str, int]]] = ...,
) -> dict[str, int]: ...

# ── typed exceptions ─────────────────────────────────────────────────────────

class UnsatisfiableError(Exception): ...
class BudgetExceededError(Exception): ...
class InvalidInputError(Exception): ...
class CspTimeoutError(Exception): ...
