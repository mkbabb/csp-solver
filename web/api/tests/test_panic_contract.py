"""PyO3 panic-contract tests (Pass-2 prototype 7, verified both directions).

Two opposing guarantees for the Rust `csp_solver` native module, exercised
through the real wheel:

1. **Unwind → catchable.** A Rust panic surfaced across the PyO3 boundary
   arrives in Python as a `pyo3_runtime.PanicException` — a `BaseException`
   (deliberately *not* an `Exception`, so a bare `except Exception:` cannot
   silently swallow it), catchable, with the interpreter left usable.
2. **Abort → uncatchable (negative control).** A forced `abort()` (the same
   `SIGABRT` a Rust `panic=abort` build or `std::process::abort()` delivers)
   is *not* catchable: it terminates the process. Proven under subprocess
   isolation so the child's death by signal is observable.

These ride the `py-runtime` CI lane. The unwind test needs the PyO3 wheel,
which lands in W1; until then it is skipped with an explicit, import-tied
reason (never a silent skip). The abort negative control is toolchain-only and
runs unconditionally on POSIX.
"""

import signal
import subprocess
import sys

import pytest


@pytest.fixture
def csp_solver_mod():
    """The Rust native module, or an explicit skip tied to its import failure.

    At HEAD the wheel is unbuilt (W1 lands it), so this skips with a reason
    naming that dependency rather than failing opaquely.
    """
    return pytest.importorskip(
        "csp_solver",
        reason=(
            "csp_solver native module not importable — the PyO3 wheel lands in "
            "W1; until then the unwind→PanicException contract rides the "
            "py-runtime CI lane skipped, not silently green"
        ),
    )


# ── (1) Unwind panic → catchable PanicException ──────────────────────────────


def test_rust_unwind_panic_is_catchable_panic_exception(csp_solver_mod):
    """A Rust panic must cross the boundary as a catchable PanicException.

    Panic path: `Csp.solve()` before `finalize()`. `Csp::solve` (lib.rs) opens
    with `self.adjacency.as_ref().expect("call finalize() before solve()")`;
    on a fresh `Csp` adjacency is `None`, so the `.expect` panics. This is a
    documented-precondition violation reachable purely through the public
    Python surface — an `.expect`, not a `debug_assert!`, so it fires in the
    release wheel too. (If W1 exposes a dedicated panic hook, prefer it; this
    precondition is a stable lib.rs invariant regardless.)
    """
    Csp = csp_solver_mod.Csp
    SolveConfig = csp_solver_mod.SolveConfig

    # pyo3 0.24.2 does NOT register `pyo3_runtime` as an importable
    # `sys.modules` entry (`import pyo3_runtime` raises `ModuleNotFoundError`
    # even after a panic has fired) — `PanicException.__module__` is the
    # string "pyo3_runtime", but that string names no importable module on
    # this pyo3 version. Obtain the class from the caught instance instead:
    # the contract under test ("catchable, typed, BaseException-not-Exception")
    # is fully exercised either way — only the *acquisition* mechanism changes.
    csp = Csp()  # no finalize() — violates solve()'s precondition
    with pytest.raises(BaseException) as excinfo:
        csp.solve(SolveConfig())
    panic_exc = type(excinfo.value)
    assert panic_exc.__module__ == "pyo3_runtime"
    assert panic_exc.__name__ == "PanicException"

    # It is a BaseException but NOT an Exception: a bare `except Exception:`
    # must not be able to swallow a Rust panic (the "both directions" contract).
    assert issubclass(panic_exc, BaseException)
    assert not issubclass(panic_exc, Exception)

    # Survives: interpreter + module remain usable after the caught panic.
    survivor = Csp()
    assert survivor.add_variable([0, 1]) == 0


# ── (2) Forced abort → uncatchable SIGABRT (negative control) ────────────────

# Child program: force a hard abort and prove Python cannot intercept it. Even
# `except BaseException:` must not shield the process from the signal — reaching
# any print below would refute the contract and fail the parent's assertions.
_ABORT_CHILD = """
import ctypes, sys
try:
    ctypes.CDLL(None).abort()  # libc abort() -> SIGABRT; unwinds nothing
except BaseException:
    sys.stdout.write("ABORT_WAS_CAUGHT")
    sys.stdout.flush()
    sys.exit(0)
sys.stdout.write("ABORT_RETURNED")
sys.stdout.flush()
sys.exit(0)
"""


@pytest.mark.skipif(
    sys.platform == "win32",
    reason="POSIX signal contract; ctypes.CDLL(None) libc handle is POSIX-only",
)
def test_forced_abort_is_uncatchable_sigabrt():
    """A forced abort must kill the process by signal, uncatchable in Python.

    The negative control opposite to the unwind test: this is what a Rust
    `panic=abort` build or `std::process::abort()` would deliver at the PyO3
    boundary — `SIGABRT`, which no Python `try/except` can trap. Run in a child
    process so the death-by-signal is observable without taking down the runner.
    """
    proc = subprocess.run(
        [sys.executable, "-c", _ABORT_CHILD],
        capture_output=True,
        timeout=30,
    )

    # Killed by SIGABRT: POSIX reports signal death as a negative return code.
    assert proc.returncode == -signal.SIGABRT, (
        f"expected child killed by SIGABRT (-{signal.SIGABRT}); got "
        f"returncode={proc.returncode}, stdout={proc.stdout!r}, "
        f"stderr={proc.stderr!r}"
    )
    # The abort must have been uncatchable: neither branch of the child ran.
    assert proc.stdout == b"", (
        f"abort must be uncatchable, but the child produced output: {proc.stdout!r}"
    )
