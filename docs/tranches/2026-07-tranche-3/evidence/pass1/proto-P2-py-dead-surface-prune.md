# Prototype P2 — PyO3 dead-surface prune (blast radius)

**Lane key:** `proto-P2-py-dead-surface-prune`
**Worktree:** `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8f3bd831-d64-11` (isolated; nothing ships)
**Base:** `csp-solver` @ `3b75eca2` (T2-WGATE), crate 0.3.0.

## The one question

Does removing the caller-dead PyO3 surface leave **tests-py** and the **bbnf compile gate** green
with zero deaths? Specifically: delete `py/futoshiki_api.rs` + its `mod.rs` registrations/re-exports;
remove `solve_sudoku_board`, `template_count`, `SudokuCSP.backtracks()`/`budget_exceeded`/`cancelled`
getters; remove `Csp::{add_equals, add_less_than, add_greater_than, solve_with_given, propagate_with}`
and the py `PropagationStrategy` enum; remove the `CspError::to_pyerr` `Timeout` arm (keep the
`CspTimeoutError` class exported).

## What I built / probed

Applied the prune in the worktree, touching only `src/py/**` (every edit is `#[cfg(feature="py")]`-gated):

- **Deleted** `src/py/futoshiki_api.rs` (234 LOC) + its `mod futoshiki_api;` line, the 5-symbol
  `pub use futoshiki_api::{...}` re-export, and its 5 pymodule registrations (`mod.rs:44-46,37,70-75`).
- **`sudoku_api.rs`:** removed `solve_sudoku_board` (63 LOC), `template_count` (12 LOC), the
  `#[pymethods] impl SudokuCSP { backtracks() }` alias block, and the `#[pyo3(get)]` exposure of
  `budget_exceeded`/`cancelled`. Kept `backtrack_count` + `solutions` getters (tests-py reads both).
  Kept `budget_exceeded` as a **private** field — it drives the `BudgetExceededError` branch at
  `sudoku_api.rs` (`if csp.solutions.is_empty() && csp.budget_exceeded`); only its Python getter was
  dead. **Removed the `cancelled` field outright** (its two write/init sites too) — nothing read it
  after the getter went; `Csp.stats.cancelled` (core `SolveStats`) is untouched and is what the
  wheel-contract tests actually assert on.
- **`csp.rs`:** removed the 3 constraint helpers + `solve_with_given` + `propagate_with` and the now-unused
  `use super::enums::PropagationStrategy;` / `use crate::constraint::VarId;`.
- **`enums.rs`:** removed the py `PropagationStrategy` enum + its `From` impl + the unused
  `PropagationStrategy as RustPropagation` import.
- **`mod.rs`:** pruned re-exports, the `add_class::<PropagationStrategy>()`, the 5 futoshiki/2 sudoku
  function registrations, and the doc import line.

**Scope discipline:** did *not* do the `sudoku_api.rs → sudoku.rs` rename (that is W-D per synthesis
§1.2, plus the `difficulty_parity.rs` `SIBLING_DEFINITIONS` retarget) — kept the module name to isolate
the pure-prune question.

## Gate result (quoted)

1. **`cargo check --features py`** (worktree, no `-D warnings` surprises):
   ```
   Checking csp-solver v0.3.0 (…/csp-solver)
   Finished `dev` profile [unoptimized + debuginfo] target(s) in 5.32s
   ```
   Zero warnings (no dead-field/unused-import fallout).

2. **Fresh wheel** — `maturin build --release --features py --interpreter <cpython-3.13.5>`:
   ```
   📦 Built wheel for CPython 3.13 to …/wheels-pruned/csp_solver-0.2.0-cp313-cp313-macosx_11_0_arm64.whl
   ```

3. **Full tests-py suite** against the pruned wheel (`python -m pytest -q`):
   ```
   ...........................ss
   27 passed, 2 skipped in 2.27s
   ```
   **Identical to the baseline wheel** (`27 passed, 2 skipped in 2.60s`) built at HEAD before any edit.
   **Zero test deaths — the R4 prediction holds.** The 2 skips are the pre-existing
   `test_budget_exceeded_error_end_to_end` / `test_csp_timeout_error_end_to_end` (skipped at HEAD too).

4. **bbnf `verify_py_isolated` simulation** — pruned `src/`+`data/` copied into a detached
   single-crate workspace (empty `[workspace]`, pyo3 0.29 `extension-module`), exactly per
   `sync-csp-solver-vendor.sh:210-256`:
   ```
   Checking csp-solver v0.1.0 (…/bbnf-isolated)
   Finished `dev` profile … in 5.55s
   → PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 cargo check --features py exit=0
   ```

5. **bbnf's default branch** (`cargo check`, py OFF): `exit=0`. Core `config.rs`
   (`SolveConfig`/`SolveStats`) and `error.rs` are **untouched** by the prune, so bbnf's
   field-set tripwire baseline is unaffected.

### LOC delta

`src/py/` total **1080 → 662 lines (−418 net)**; git: **5 files changed, +9 / −427**.
Breakdown: `futoshiki_api.rs` −234 (file), `sudoku_api.rs` −101, `csp.rs` −46, `enums.rs` −22, `mod.rs` −15.

### Post-prune py symbol inventory (introspected from the built wheel)

**16 module-level symbols** (was ~29): `Csp`, `SolveConfig`, `SolveStats`, `CancelToken`, `Pruning`,
`Ordering`, `SudokuCSP`, `SudokuDifficulty`, `create_sudoku_csp`, `solve_sudoku`, `create_random_board`,
`UnsatisfiableError`, `BudgetExceededError`, `InvalidInputError`, `CspTimeoutError`, `csp_solver`(self).
- `Csp` methods: `add_variable, add_not_equal, add_all_different, finalize, propagate, solve, stats`.
- `SudokuCSP` attrs: `backtrack_count, solutions` (only).
- Verified-absent: `solve_sudoku_board`, `template_count`, `PropagationStrategy`, all 5 futoshiki
  symbols, `Csp.{add_equals,add_less_than,add_greater_than,solve_with_given,propagate_with}`,
  `SudokuCSP.{backtracks,budget_exceeded,cancelled}` — all `hasattr(...) == False`.

## Verdict

**GO** on the full prune as specified — **except one item that is SHAPE-CHANGED:**

**The `CspError::to_pyerr` `Timeout` arm cannot be removed by a py-only lane.** `CspError::Timeout`
is a live **core** enum variant (`src/error.rs:63`), feeding `code()` → `"TIMEOUT"` (`error.rs:94`)
and `Display` (`error.rs:77`). Removing just the match arm fails compilation — proven:
```
error[E0004]: non-exhaustive patterns: `&CspError::Timeout` not covered
  --> csp-solver/src/py/errors.rs:55:15
```
The only ways to remove the arm are (a) drop `CspError::Timeout` from the core enum — a change to
`error.rs`/`code()`/`tests/error.rs` that is R2/W-C (core) scope, not py-only, or (b) add a wildcard
arm — which forfeits the 1:1 exhaustive variant→class taxonomy `errors.rs` exists to enforce (an
anti-goal). **Recommended shape:** keep the arm + keep `CspTimeoutError` exported (the surface-honest
py-only minimum); defer the "is `CspError::Timeout` itself dead?" decision to W-C + open question Q6.
Everything *else* in the charter prunes cleanly and greenly.

## What the critique pass should attack

1. **The Timeout SHAPE-CHANGE.** If W-C removes core `CspError::Timeout`, confirm the blast radius:
   `code()`→`"TIMEOUT"` is consumed by wasm `CspJsError.code` and the frontend, but the frontend's
   `TIMEOUT` is an **independent** string constant (`games/*/solver/apiError.ts:58,48`), not
   FFI-coupled to the Rust variant. `tests/error.rs` does assert on it. This is Q6's substance.
2. **`SudokuCSP.cancelled` removed as a field, not just a getter.** No test and no non-PyPI consumer
   read it, and `Csp.stats.cancelled` survives — but a future caller wanting cancel-vs-budget
   discrimination *on the sudoku convenience type* loses it. Accept the loss, or keep the field
   private + reserved?
3. **`budget_exceeded` kept private.** Confirm no consumer wanted the getter. The crate is not on
   PyPI (crates.io + npm only), so the consumer set is exactly tests-py + bbnf's compile gate — both
   green — but ratify that "not on PyPI ⇒ no external caller" holds (Q2/Q4).
4. **Wheel version stamp.** Both baseline and pruned wheels build as `0.2.0` (the `pyproject.toml`
   0.2.0-vs-Cargo-0.3.0 bug, W-A scope). tests-py doesn't assert on `__version__`, so it didn't mask
   anything here — but W-A's 0.3.0 sync should re-run *this same gate* to confirm no version-gated test.
5. **abi3 orthogonality.** This build was non-abi3, cp313-pinned. W-A's abi3-at-py310 adoption changes
   the ABI surface; re-run the prune gate on the abi3 wheel before landing W-B, since the two waves
   touch the same wheel.
6. **bbnf `--update` step.** The simulation compiled the *worktree* src as the vendored copy. The real
   gate diffs vendored `src/` against the pin; W-B must land `--update` (re-vendor) before `--verify`,
   or the text-diff provenance gate fails on drift (expected, not a defect).
