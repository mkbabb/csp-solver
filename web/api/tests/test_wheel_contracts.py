"""Wheel-probe + typed-exception contract tests against the real `csp_solver`
wheel — GIL-release/heartbeat, wall-clock timeout, cooperative cancel, and
the four typed exception classes.

Closes a W1 py-gate residual (gate-py.md, "Wave gate-table reconciliation"):
the wave's gate row "wheel probes 3/3 + 2/2 (heartbeat 74%/65%, timeout
@1.001-1.002s, cancel works)" plus "four typed exceptions end-to-end" had no
corresponding pytest tests anywhere in this repo. These are real,
mechanism-level tests driving the installed wheel — nothing here is mocked.

Two of the four typed exceptions (`BudgetExceededError`, `CspTimeoutError`)
are marked `skip` with a cited, fail-explicit reason rather than faked or
silently omitted — see their docstrings/reasons below.
"""

import threading
import time

import pytest

csp_solver = pytest.importorskip("csp_solver")


# ── Shared: a genuinely slow, GIL-released "hard board" ──────────────────────
#
# The generic `Csp` Python surface only exposes NotEqual/AllDifferent/
# less-than/greater-than/equals (no generic lambda constraint — that's
# Rust-only, `LambdaConstraint`), so a pigeonhole instance — n variables,
# domain size n-1, one `AllDifferent` — is the simplest thing constructible
# through this API that is both (a) slow enough under `Pruning.NONE` +
# `Ordering.CHRONOLOGICAL` to exercise heartbeat/timeout/cancel meaningfully,
# and (b) small enough to be deterministic and safely bounded in CI once a
# `node_budget`/`cancel` net is in place.
#
# Empirically (this host, release wheel): n=8 (domain size 7) -> ~0.6s,
# ~960K nodes, genuinely proven UNSAT well under any reasonable budget. n=9
# (domain size 8) runs into the tens-of-seconds-to-minutes range if left
# unbounded — used ONLY under an external cancel/timeout below, with a large
# `node_budget` safety net, so it can never free-run past the test.


def _build_pigeonhole(n: int, m: int):
    csp = csp_solver.Csp()
    variables = [csp.add_variable(list(range(m))) for _ in range(n)]
    csp.add_all_different(variables)
    csp.finalize()
    return csp


# ── (a) Heartbeat: GIL released enough for a Python ticker to keep pace ─────


def test_heartbeat_duty_cycle_during_solve():
    """A solve on a hard board must release the GIL well enough that a
    Python-side ticker thread keeps making progress: >50% of its
    free-running tick rate must land during the solve.

    `Csp.solve()` wraps the search in `py.allow_threads` (py/csp.rs) for
    exactly this reason — an `asyncio` heartbeat/health-check coroutine (or,
    here, a plain ticker thread) must not stall for the ~0.6s the search is
    on-CPU in Rust.
    """
    tick_interval = 0.005

    def _run_ticker(stop: threading.Event, counter: list[int]) -> None:
        while not stop.is_set():
            counter[0] += 1
            time.sleep(tick_interval)

    # Baseline: the ticker's free-running rate, uncontended.
    baseline_stop = threading.Event()
    baseline_counter = [0]
    baseline_thread = threading.Thread(
        target=_run_ticker, args=(baseline_stop, baseline_counter), daemon=True
    )
    t0 = time.perf_counter()
    baseline_thread.start()
    time.sleep(0.3)
    baseline_stop.set()
    baseline_thread.join(timeout=5)
    baseline_elapsed = time.perf_counter() - t0
    baseline_rate = baseline_counter[0] / baseline_elapsed

    # During solve: same ticker, running concurrently with a ~0.6s Rust solve.
    csp = _build_pigeonhole(8, 7)
    config = csp_solver.SolveConfig(
        pruning=csp_solver.Pruning.NONE,
        ordering=csp_solver.Ordering.CHRONOLOGICAL,
        max_solutions=1,
        backjumping=False,
        node_budget=5_000_000,
    )
    solve_stop = threading.Event()
    solve_counter = [0]
    solve_thread = threading.Thread(
        target=_run_ticker, args=(solve_stop, solve_counter), daemon=True
    )
    t1 = time.perf_counter()
    solve_thread.start()
    solutions = csp.solve(config)
    solve_elapsed = time.perf_counter() - t1
    solve_stop.set()
    solve_thread.join(timeout=5)

    assert solutions == []  # pigeonhole (n=8, domain=7) is genuinely UNSAT
    assert not csp.stats.budget_exceeded, "should prove UNSAT well under budget"

    rate_during_solve = solve_counter[0] / solve_elapsed
    duty_cycle = rate_during_solve / baseline_rate

    assert duty_cycle > 0.5, (
        f"ticker only achieved {duty_cycle:.0%} of its free-running rate "
        f"during the solve ({solve_counter[0]} ticks / {solve_elapsed:.3f}s "
        f"vs baseline {baseline_rate:.1f} ticks/s) — GIL-release regression?"
    )


# ── (b) Wall-clock "timeout": a CancelToken fired by a timer thread ─────────


def test_timeout_via_cancel_token_bounds_wall_time():
    """A ~1.0s wall-clock "timeout" — wired the way the codebase's own docs
    prescribe (config.rs: "keep [the token] on the calling side to flip when
    a timeout elapses"; sudoku_api.rs's comment names exactly this gap: "the
    FastAPI asyncio.wait_for theater that today cancels only the awaiting
    coroutine, never the search") — must abort an effectively-unbounded
    search and return within ~1.0-1.5s wall, not run to natural completion.

    Board: pigeonhole n=9 (domain size 8) under `Pruning.NONE` +
    `Ordering.CHRONOLOGICAL` — proving it UNSAT unaided takes on the order of
    minutes on this host, so returning inside the assertion window can only
    happen via the timer-fired cancellation.
    """
    csp = _build_pigeonhole(9, 8)
    token = csp_solver.CancelToken()
    config = csp_solver.SolveConfig(
        pruning=csp_solver.Pruning.NONE,
        ordering=csp_solver.Ordering.CHRONOLOGICAL,
        max_solutions=1,
        backjumping=False,
        node_budget=200_000_000,  # safety net far above what ~1s of search reaches
        cancel=token,
    )

    timeout_s = 1.0

    def _fire_after(seconds: float) -> None:
        time.sleep(seconds)
        token.cancel()

    timer = threading.Thread(target=_fire_after, args=(timeout_s,), daemon=True)
    t0 = time.perf_counter()
    timer.start()
    solutions = csp.solve(config)
    elapsed = time.perf_counter() - t0

    assert csp.stats.cancelled, "CancelToken fired but stats.cancelled is False"
    assert not csp.stats.budget_exceeded, "should be cancelled, not budget-exhausted"
    assert solutions == []
    # Cancellation is checked at the search's node cadence (config.rs: "a
    # handful of search nodes"), so overshoot past the fired deadline should
    # be small — bounded generously here for CI scheduling jitter.
    assert timeout_s <= elapsed <= timeout_s + 0.5, (
        f"expected completion within [{timeout_s}, {timeout_s + 0.5}]s of the "
        f"fired timeout, took {elapsed:.3f}s"
    )


# ── (c) Cancel: fired promptly from another thread aborts a long solve ─────


def test_cancel_token_aborts_long_solve_promptly():
    """Firing `CancelToken.cancel()` from another thread shortly after a long
    solve starts must abort it promptly — not after the search would
    otherwise have finished naturally (minutes, for this board).
    """
    csp = _build_pigeonhole(9, 8)
    token = csp_solver.CancelToken()
    config = csp_solver.SolveConfig(
        pruning=csp_solver.Pruning.NONE,
        ordering=csp_solver.Ordering.CHRONOLOGICAL,
        max_solutions=1,
        backjumping=False,
        node_budget=200_000_000,
        cancel=token,
    )

    cancel_after_s = 0.15

    def _cancel_after(seconds: float) -> None:
        time.sleep(seconds)
        token.cancel()

    canceller = threading.Thread(target=_cancel_after, args=(cancel_after_s,), daemon=True)
    t0 = time.perf_counter()
    canceller.start()
    solutions = csp.solve(config)
    elapsed = time.perf_counter() - t0

    assert csp.stats.cancelled
    assert solutions == []
    assert elapsed < cancel_after_s + 1.0, (
        f"expected prompt abort shortly after the {cancel_after_s}s cancel "
        f"fired, took {elapsed:.3f}s"
    )
    assert token.is_cancelled


# ── (d) Four typed exceptions, end-to-end ───────────────────────────────────


def test_unsatisfiable_error_end_to_end():
    """`Csp.propagate()` must raise `UnsatisfiableError` when AC-3 wipes a
    variable's domain to empty — the one reachable path to this exception
    (py/csp.rs maps `Err(Unsatisfiable)` -> `CspError::Unsatisfiable` ->
    `UnsatisfiableError`). `Csp.solve()` itself never raises it — see the
    pigeonhole boards above, which return `[]` on UNSAT rather than raising.
    """
    csp = csp_solver.Csp()
    x = csp.add_variable([0])
    y = csp.add_variable([0])
    csp.add_not_equal(x, y)
    csp.finalize()

    with pytest.raises(csp_solver.UnsatisfiableError) as excinfo:
        csp.propagate()

    message = str(excinfo.value).lower()
    assert "unsatisfiable" in message or "no solution" in message


def test_invalid_input_error_end_to_end():
    """`create_sudoku_csp` must raise `InvalidInputError` for a
    structurally-invalid position key — both the out-of-range and
    non-numeric cases take this path (sudoku_api.rs `create_sudoku_csp`).
    """
    with pytest.raises(csp_solver.InvalidInputError) as excinfo:
        csp_solver.create_sudoku_csp(N=3, values={"9999": 5})
    assert "out of range" in str(excinfo.value)

    with pytest.raises(csp_solver.InvalidInputError) as excinfo:
        csp_solver.create_sudoku_csp(N=3, values={"not-a-number": 5})
    assert "invalid position" in str(excinfo.value)


def test_all_four_typed_exception_classes_exist_and_are_exceptions():
    """All four typed exception classes are exported and are proper
    `Exception` subclasses (unlike the panic-contract's `PanicException`,
    which deliberately is NOT one — see test_panic_contract.py) — including
    the two not exercised end-to-end below; see their skip reasons for why.
    """
    for name in (
        "UnsatisfiableError",
        "BudgetExceededError",
        "InvalidInputError",
        "CspTimeoutError",
    ):
        cls = getattr(csp_solver, name)
        assert issubclass(cls, Exception)


@pytest.mark.skip(
    reason=(
        "BudgetExceededError has exactly one reachable path — solve_sudoku "
        "(sudoku_api.rs): `solutions.is_empty() && budget_exceeded`, gated on "
        "the *hardcoded* Pruning.AC3 + Ordering.DOM_WDEG config exhausting "
        "its fixed 1_000_000 node_budget before finding or refuting a "
        "solution (`solve_sudoku`'s Python signature does not expose "
        "node_budget for tuning it down). Empirically this configuration is "
        "too strong to reach via ad hoc adversarial construction: 500+ "
        "fuzzed trials across N=3/4/5 (single- and multi-clue corruption of "
        "known-hard puzzles, plus random boards; given-density from 17 to "
        "550 out of up to 625 cells) found a worst case of 16 backtracks to "
        "prove UNSAT (295 givens / 1 corrupted clue, N=5) and 3724 "
        "backtracks for a slow-but-SAT case (245 givens / 3 corrupted "
        "clues, N=5) — three-plus orders of magnitude short of the budget. "
        "Reaching this contract for real needs either a research-grade "
        "adversarial UNSAT sudoku instance or a lower-budget knob on the "
        "exposed API — out of this lane's scope (csp-solver/** owned by a "
        "concurrent lane). Reported to the LEAD as a W1 py-closure "
        "deviation; see test_all_four_typed_exception_classes_exist_and_"
        "are_exceptions above for the class-shape check that does run."
    )
)
def test_budget_exceeded_error_end_to_end():
    pass


@pytest.mark.skip(
    reason=(
        "CspTimeoutError (CspError::Timeout) has zero constructing call "
        "sites anywhere in csp-solver/src — confirmed via "
        "`rg CspError::Timeout src/`: the only two hits are the enum's own "
        "unit test (error.rs) and the dead `to_pyerr` match arm "
        "(py/errors.rs). It is forward-declared for the wall-clock "
        "time_budget deferred item (error.rs's own doc comment: "
        "'Forward-declared for the wall-clock time_budget deferred item ... "
        "N11'), not yet wired to any solve path — no real solver call can "
        "raise it today. See test_timeout_via_cancel_token_bounds_wall_time "
        "above for the CancelToken-based timeout mechanism that IS wired "
        "and tested (a distinct, already-working path to a similar "
        "caller-side timeout outcome). Reported to the LEAD as a W1 "
        "py-closure deviation; lands when the deferred time_budget item "
        "does (out of this lane's scope, csp-solver/** owned by a "
        "concurrent lane)."
    )
)
def test_csp_timeout_error_end_to_end():
    pass
