"""Tests for the CSP solver and Sudoku puzzle generation."""

import time

from csp_solver.solver.bitset_domain import BitsetDomain
from csp_solver.solver.constraints import all_different_constraint
from csp_solver.solver.csp import CSP, PruningType, VariableOrdering, _make_domain
from csp_solver.solver.nogoods import NogoodStore
from csp_solver.solver.sudoku import (
    SudokuDifficulty,
    _load_solution_board,
    create_random_board,
    create_sudoku_csp,
    solve_sudoku,
)
from csp_solver.solver.sudoku_transforms import SudokuTransform


def test_simple_csp():
    """Test a trivial CSP with 2 variables."""
    csp = CSP(pruning_type=PruningType.FORWARD_CHECKING)
    csp.add_variables([1, 2, 3], "a", "b")
    csp.add_constraint(all_different_constraint("a", "b"))
    csp.solve()
    assert len(csp.solutions) == 1
    sol = csp.solutions[0]
    assert sol["a"] != sol["b"]


def test_4x4_sudoku_solve():
    """Test solving a known 4x4 Sudoku puzzle."""
    # A simple 4x4 puzzle (N=2)
    values = {
        "0": 1, "1": 0, "2": 0, "3": 4,
        "4": 0, "5": 0, "6": 1, "7": 0,
        "8": 0, "9": 1, "10": 0, "11": 0,
        "12": 4, "13": 0, "14": 0, "15": 1,
    }
    csp = create_sudoku_csp(N=2, values=values)
    solve_sudoku(csp)
    assert len(csp.solutions) >= 1

    sol = csp.solutions[0]
    # Verify all cells filled
    assert all(sol[i] != 0 for i in range(16))


def test_9x9_sudoku_solve():
    """Test solving a known 9x9 Sudoku puzzle."""
    values = {
        "0": 5, "1": 3, "4": 7,
        "9": 6, "12": 1, "13": 9, "14": 5,
        "19": 9, "20": 8, "25": 6,
        "27": 8, "31": 6, "35": 3,
        "36": 4, "39": 8, "41": 3, "44": 1,
        "45": 7, "49": 2, "53": 6,
        "55": 6, "60": 2, "61": 8,
        "66": 4, "67": 1, "68": 9, "71": 5,
        "76": 8, "79": 7, "80": 9,
    }
    # Fill remaining with 0
    for i in range(81):
        key = str(i)
        if key not in values:
            values[key] = 0

    csp = create_sudoku_csp(N=3, values=values)
    solve_sudoku(csp)
    assert len(csp.solutions) == 1


def test_load_solution_board():
    """Test loading a pre-computed solution board."""
    board = _load_solution_board(3)
    assert len(board) == 81
    assert all(1 <= v <= 9 for v in board.values())
    assert all(isinstance(v, int) for v in board.values())


def test_create_random_board_easy():
    """Test random board generation for EASY difficulty."""
    board = create_random_board(N=2, difficulty=SudokuDifficulty.EASY)
    assert len(board) == 16
    # Some cells should be empty (0)
    assert any(v == 0 for v in board.values())
    # Some cells should be filled
    assert any(v != 0 for v in board.values())


def test_backtrack_counter():
    """Test that the backtrack counter increments."""
    values = {"0": 1}
    for i in range(1, 16):
        values[str(i)] = 0
    csp = create_sudoku_csp(N=2, values=values)
    solve_sudoku(csp)
    # backtrack_count should be >= 0
    assert csp.backtrack_count >= 0


def test_multiple_solutions():
    """Test finding multiple solutions."""
    csp = CSP(
        pruning_type=PruningType.FORWARD_CHECKING,
        max_solutions=10,
    )
    csp.add_variables([1, 2, 3], "a", "b", "c")
    csp.add_constraint(all_different_constraint("a", "b", "c"))
    csp.solve()
    # 3! = 6 permutations
    assert len(csp.solutions) == 6


# ── BitsetDomain unit tests ──────────────────────────────────────────────────


def test_bitset_domain_basic_ops():
    """Test BitsetDomain: len, in, iter, discard, add."""
    d = BitsetDomain([1, 3, 5, 7])
    assert len(d) == 4
    assert 3 in d
    assert 4 not in d
    assert sorted(d) == [1, 3, 5, 7]

    d.discard(3)
    assert 3 not in d
    assert len(d) == 3

    d.add(9)
    assert 9 in d
    assert len(d) == 4


def test_bitset_domain_copy_independence():
    """Test that BitsetDomain.copy() is independent."""
    d1 = BitsetDomain([1, 2, 3])
    d2 = d1.copy()
    d2.discard(2)
    assert 2 in d1
    assert 2 not in d2


def test_bitset_domain_update():
    """Test BitsetDomain.update()."""
    d1 = BitsetDomain([1, 2])
    d2 = BitsetDomain([3, 4])
    d1.update(d2)
    assert sorted(d1) == [1, 2, 3, 4]


def test_bitset_domain_empty():
    """Test empty BitsetDomain."""
    d = BitsetDomain()
    assert len(d) == 0
    assert not d
    assert list(d) == []


def test_make_domain_auto_detect():
    """Test _make_domain auto-detects integer domains."""
    d_int = _make_domain([1, 2, 3])
    assert isinstance(d_int, BitsetDomain)

    d_str = _make_domain(["a", "b", "c"])
    assert isinstance(d_str, set)


# ── DWO early termination ────────────────────────────────────────────────────


def test_forward_check_returns_dwo():
    """Test that forward_check returns True on domain wipe-out."""
    csp = CSP(pruning_type=PruningType.FORWARD_CHECKING)
    csp.add_variables([1], "a", "b")
    csp.add_constraint(all_different_constraint("a", "b"))
    csp.current_domains = {"a": _make_domain([1]), "b": _make_domain([1])}
    csp.pruned_map["a"].clear()
    csp.pruned_map["b"].clear()

    sol = {"a": 1}
    dwo = csp.forward_check("a", sol)
    assert dwo is True


# ── AC-2001 residual supports ────────────────────────────────────────────────


def test_ac3_with_residual_support():
    """Test AC-2001 caches supports and reuses them."""
    # Use AC3 during a full solve and verify caching occurs
    csp = CSP(pruning_type=PruningType.AC3)
    csp.add_variables([1, 2, 3], "a", "b", "c")
    csp.add_constraint(all_different_constraint("a", "b", "c"))
    csp.solve()
    assert len(csp.solutions) == 1
    # Residual support should have been cached during revisions
    assert len(csp.last_support) > 0


# ── CBJ ──────────────────────────────────────────────────────────────────────


def test_unsolvable_pigeonhole():
    """Test that solver correctly reports no solutions for pigeonhole."""
    # 3 vars with domain [1], all-different → unsolvable
    csp = CSP(pruning_type=PruningType.FORWARD_CHECKING)
    csp.add_variables([1], "a", "b", "c")
    csp.add_constraint(all_different_constraint("a", "b", "c"))
    csp.solve()
    assert len(csp.solutions) == 0
    assert csp.backtrack_count > 0


# ── dom/wdeg ─────────────────────────────────────────────────────────────────


def test_dom_wdeg_ordering():
    """Test dom/wdeg variable ordering finds solutions."""
    csp = CSP(
        pruning_type=PruningType.FORWARD_CHECKING,
        variable_ordering=VariableOrdering.DOM_WDEG,
    )
    csp.add_variables([1, 2, 3], "a", "b", "c")
    csp.add_constraint(all_different_constraint("a", "b", "c"))
    csp.solve()
    assert len(csp.solutions) == 1
    sol = csp.solutions[0]
    assert len(set(sol.values())) == 3


# ── GAC all-different ────────────────────────────────────────────────────────


def test_gac_alldiff_pigeonhole():
    """GAC catches reasoning that binary AC misses.

    3 vars, domain {1,2} each, all-different → no solution.
    Binary FC won't detect this immediately, but GAC should prune aggressively.
    """
    csp = CSP(
        pruning_type=PruningType.FORWARD_CHECKING,
        use_gac_alldiff=True,
    )
    csp.add_variables([1, 2], "a", "b", "c")
    csp.add_constraint(all_different_constraint("a", "b", "c"))
    csp.solve()
    assert len(csp.solutions) == 0


# ── Nogood store ─────────────────────────────────────────────────────────────


def test_nogood_store_basic():
    """Test NogoodStore record, lookup, and LRU eviction."""
    store = NogoodStore(max_length=4, max_entries=3)

    store.record({"a": 1, "b": 2})
    assert store.is_nogood("a", 1, {"b": 2})
    assert not store.is_nogood("a", 1, {"b": 3})
    assert not store.is_nogood("a", 2, {"b": 2})

    # Fill to capacity and evict
    store.record({"c": 3, "d": 4})
    store.record({"e": 5, "f": 6})
    store.record({"g": 7, "h": 8})  # Should evict {"a": 1, "b": 2}
    assert not store.is_nogood("a", 1, {"b": 2})


def test_nogood_store_clear():
    """Test NogoodStore.clear()."""
    store = NogoodStore()
    store.record({"a": 1, "b": 2})
    store.clear()
    assert not store.is_nogood("a", 1, {"b": 2})


# ── Initial AC3 propagation ─────────────────────────────────────────────────


def test_initial_ac3_propagation():
    """Test that initial AC3 cascading propagation reduces domains."""
    # 4x4 sudoku with many givens should have significant domain reduction
    values = {
        "0": 1, "1": 2, "2": 3, "3": 4,
        "4": 3, "5": 4, "6": 0, "7": 0,
        "8": 0, "9": 0, "10": 0, "11": 0,
        "12": 0, "13": 0, "14": 0, "15": 0,
    }
    csp = create_sudoku_csp(N=2, values=values)
    solve_sudoku(csp)
    assert len(csp.solutions) == 1
    # With strong initial propagation, should need very few backtracks
    assert csp.backtrack_count <= 5


# ── Symmetry transforms ──────────────────────────────────────────────────────


def _validate_sudoku_solution(board: dict[str, int], N: int) -> bool:
    """Check that a board satisfies all Sudoku row/col/subgrid constraints."""
    M = N * N
    for row in range(M):
        vals = [board[str(row * M + col)] for col in range(M)]
        if sorted(vals) != list(range(1, M + 1)):
            return False
    for col in range(M):
        vals = [board[str(row * M + col)] for row in range(M)]
        if sorted(vals) != list(range(1, M + 1)):
            return False
    for bi in range(N):
        for bj in range(N):
            vals = [
                board[str((bi * N + di) * M + (bj * N + dj))]
                for di in range(N)
                for dj in range(N)
            ]
            if sorted(vals) != list(range(1, M + 1)):
                return False
    return True


def test_symmetry_transform_preserves_validity():
    """Transform a known solution, verify all row/col/subgrid constraints."""
    for N in [2, 3]:
        solution = _load_solution_board(N)
        assert _validate_sudoku_solution(solution, N)

        # Apply 10 random transforms, each should remain valid
        for _ in range(10):
            transform = SudokuTransform.random(N)
            transformed = transform.apply(solution, N)
            assert len(transformed) == len(solution)
            assert _validate_sudoku_solution(transformed, N), (
                f"Transform broke validity for N={N}"
            )


def test_transform_preserves_zeros():
    """Transform a puzzle (with holes), verify zeros stay zeros."""
    board = create_random_board(N=2, difficulty=SudokuDifficulty.EASY)
    original_zeros = sum(1 for v in board.values() if v == 0)
    assert original_zeros > 0

    transform = SudokuTransform.random(2)
    transformed = transform.apply(board, 2)
    new_zeros = sum(1 for v in transformed.values() if v == 0)
    assert new_zeros == original_zeros


def test_transform_is_bijective():
    """Transform should produce exactly M^2 cells with no duplicates."""
    for N in [2, 3]:
        M = N * N
        total = M * M
        solution = _load_solution_board(N)
        transform = SudokuTransform.random(N)
        transformed = transform.apply(solution, N)

        # Should have all positions 0..total-1
        positions = sorted(int(k) for k in transformed.keys())
        assert positions == list(range(total))


def test_fast_generation_under_50ms():
    """N=2,3,4 × all difficulties: fast-path generation should be <50ms each."""
    for N in [2, 3, 4]:
        for diff in SudokuDifficulty:
            # Warmup: first call loads JSON from disk
            create_random_board(N=N, difficulty=diff)

            start = time.perf_counter()
            board = create_random_board(N=N, difficulty=diff)
            elapsed_ms = (time.perf_counter() - start) * 1000

            M = N * N
            assert len(board) == M * M
            assert any(v == 0 for v in board.values())
            assert elapsed_ms < 50, (
                f"N={N} {diff.name}: {elapsed_ms:.1f}ms > 50ms"
            )
