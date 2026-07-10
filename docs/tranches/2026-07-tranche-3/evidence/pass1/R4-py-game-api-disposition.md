# LANE R4 — Disposition: `csp-solver/src/py/{sudoku_api,futoshiki_api}.rs`

Tranche-III PASS 1 (knowledge/specs only; read-only on the main tree). Every codebase
claim carries `file:line`. The synthesis lane decides; this lane establishes the
consumer set, the couplings, and 3 disposition options with blast-radius tables.

---

## 1. The exact consumer set (post-abrogation)

Four surfaces could in principle consume these two files. Measured status of each:

| Surface | sudoku_api.rs | futoshiki_api.rs | Evidence |
|---|---|---|---|
| FastAPI server (`web/api`) | **GONE** | **GONE** | `web/` now holds only `frontend/` (T2-W2 abrogation, commit `98fe2562`). No runtime wheel consumer remains. |
| Frontend (`web/frontend`) | N/A (uses wasm) | N/A (uses wasm) | Frontend solves in-browser over `@mkbabb/csp-solver-wasm`, never the Python wheel. Futoshiki's Python-facing surface is `wasm/src/futoshiki.rs`, not `py/futoshiki_api.rs`. |
| bbnf-lang py-isolated gate | **compiles, never calls** | **compiles, never calls** | See §2. |
| `tests-py` wheel contracts | **20 tests depend** | **0 tests depend** | See §3. |

Net: **the wheel's only two jobs post-abrogation are (a) the `tests-py` contract suite
and (b) bbnf's `--verify [4/4]` compile gate.** There is no production/runtime Python
caller of either game API anywhere in the repo.

Confirmed no external caller repo-wide (excluding worktrees/target/docs): the only hits
on `create_sudoku_csp`/`solve_futoshiki`/etc. outside `src/py/` are (i) the Rust-core
functions of the *same name* in `csp-solver/tests/{sudoku,futoshiki}.rs` — these bind
`crate::puzzles::…`, **not** the PyO3 layer — and (ii) the `tests-py/*.py` suite.

---

## 2. bbnf-lang: compiles the symbols, calls none of them

bbnf vendors a byte-identical copy of `csp-solver/src` (whole tree, `py/` included) and
keeps it honest with `scripts/sync-csp-solver-vendor.sh`
(`/Users/mkbabb/Programming/bbnf-lang/scripts/sync-csp-solver-vendor.sh`). Two gate modes
touch these files:

- **`--check`** (byte-diff, line 136-161): diffs the vendored `src/` against
  `git archive <pin>:csp-solver/src`. It compares **file bytes**, not symbols — it never
  "compiles these files' symbols," it only demands the copy match the pin. If csc411
  deletes/moves these files, `--update` re-vendors the smaller tree and `--check` passes
  on the new byte-set. No break.
- **`--verify [4/4]`** (line 255-256, `verify_py_isolated` line 211-244): builds the
  vendored crate `cargo check --features py` in a detached single-crate workspace. This
  **does compile** `sudoku_api.rs` + `futoshiki_api.rs` (they are `#[cfg(feature="py")]`
  under `src/lib.rs:29-30`). It is a *compile* check, not a *usage* check.

What bbnf actually **imports** from `csp_solver` (grep of all non-vendored bbnf `.rs`):
`Csp`, `Pruning`, `SolveConfig`, `constraint::{Constraint, Revision, VarId}`,
`domain::{Domain, LatticeDomain, BitsetDomain, CostFiniteDomain}`, `variable::Variable`.
**Zero** references to any `sudoku_api`/`futoshiki_api` symbol. bbnf drives six lattice IR
passes over `propagate()` — it never constructs a Sudoku or Futoshiki.

The structural tripwires (`verify_tripwires`, line 95-134) key on `Constraint`/`Domain`/
`LatticeDomain` supertraits (line 104) and `SolveConfig`/`SolveStats` field-sets (line
114-119) — **none of which live in either game-API file**. So removing or splitting these
files trips **no** bbnf tripwire; the only bbnf obligation is that `mod.rs`'s re-exports
stay internally consistent so `cargo check --features py` still compiles (a csc411-side
edit that flows through `--update` cleanly).

**bbnf verdict: neither file is a functional dependency. Removal is bbnf-safe; the gate
would go green on the smaller tree with no bbnf edit.**

---

## 3. `tests-py`: which of the ~27 tests die

Test inventory (expanded over `parametrize`), tagged by what each needs:

| File | Test (expanded) | Needs | Dies on sudoku_api removal | Dies on futoshiki_api removal |
|---|---|---|---|---|
| `test_rust_backend.py:65` | `test_generate_and_solve` ×2 | `create_random_board`, `create_sudoku_csp`, `solve_sudoku`, `SudokuDifficulty` | ✅ ×2 | — |
| `test_rust_backend.py:86` | `test_excised_tiers_reject` ×3 | `create_random_board`, `SudokuDifficulty` | ✅ ×3 | — |
| `test_rust_backend.py:94` | `test_generate_16x16` | `create_random_board`, `create_sudoku_csp`, `solve_sudoku` | ✅ | — |
| `test_rust_backend.py:117` | `test_hard_9x9` ×5 | `create_sudoku_csp`, `solve_sudoku` | ✅ ×5 | — |
| `test_rust_backend.py:129` | `test_difficulty_enum` | `SudokuDifficulty` | ✅ | — |
| `test_rust_backend.py:143` | `test_performance_sanity` | `create_sudoku_csp`, `solve_sudoku` | ✅ | — |
| `test_bench_compare.py:31` | `test_solve_under_50ms` ×5 | `create_sudoku_csp`, `solve_sudoku` | ✅ ×5 | — |
| `test_bench_compare.py:37` | `test_print_performance_table` | `create_sudoku_csp`, `solve_sudoku` | ✅ | — |
| `test_wheel_contracts.py:229` | `test_invalid_input_error_end_to_end` | `create_sudoku_csp` | ✅ | — |
| `test_wheel_contracts.py` (7 others) | heartbeat/timeout/cancel/unsat/class-shape | core `Csp` only | — | — |
| `test_panic_contract.py` (2) | unwind/abort | core `Csp` only | — | — |

**sudoku_api removal kills 20 expanded tests** (all of `test_rust_backend.py`,
all of `test_bench_compare.py`, one in `test_wheel_contracts.py`).
**futoshiki_api removal kills 0 tests** — there is **zero** Futoshiki reference in all of
`tests-py/` (verified: `grep -rl futoshiki tests-py/*.py` → none).

Dead-even-within-sudoku_api: **`solve_sudoku_board`** (`sudoku_api.rs:200`) and
**`template_count`** (`sudoku_api.rs:336`) are exercised by **no** test. The getters
`SudokuCSP.budget_exceeded`/`.cancelled`/`solutions` beyond `[0]` and `.backtrack_count`
are likewise only partially touched. `mod.rs:47-50` exports them regardless.

> Note: the installed wheel in `tests-py/.venv` is stale (`csp_solver-0.2.0.dist-info`,
> `csp_solver.cpython-313-darwin.so` = 739,632 B) while the crate is `0.3.0`. Any "what
> removal saves" .so figure below is estimated, not measured against a fresh build.

---

## 4. The `difficulty_parity` SIBLING_DEFINITIONS coupling

`csp-solver/tests/difficulty_parity.rs` hard-codes `src/py/sudoku_api.rs` as a sibling
`Difficulty` definition (line 135-140):

```rust
const SIBLING_DEFINITIONS: &[(&str, &str, Casing)] = &[
    ("py/sudoku_api.rs::SudokuDifficulty (PyO3)", "src/py/sudoku_api.rs", Casing::Verbatim),
    ...
];
```

Two tests bind to it, and **both fire under either disposition**:

- `difficulty_variants_agree_across_all_known_definitions` (line 177) reads
  `src/py/sudoku_api.rs` and asserts it contains `"EASY"/"MEDIUM"/"HARD"` verbatim. If the
  file is **moved** (split), the path read fails → "could not read file" problem pushed
  (line 196-198). If the `SudokuDifficulty` enum is **removed**, the substrings vanish →
  missing-variant problem (line 204).
- `no_unscanned_difficulty_definitions_exist` (line 307) walks `SCAN_ROOTS = ["src", …]`
  (line 161) for `enum …Difficulty` and asserts the discovered set == the allowlist.
  A **split** relocates the enum to a new path under `src/` → `unscanned` assert fails
  (line 326) **and** `stale` assert fails (line 334, allowlist points at the vanished
  `src/py/sudoku_api.rs`). A **removal** deletes the enum → only the `stale` assert fires.

**Coupling conclusion: any disposition that moves or deletes `SudokuDifficulty` requires a
coordinated edit to `difficulty_parity.rs:135-140`** — a one-line path retarget (split) or
a one-entry deletion (removal). This is exactly the maintenance the test was built to force
(the D10c/T8 "sixth definition" failure mode, line 3-8). `futoshiki_api.rs` is **not** in
SIBLING_DEFINITIONS (Futoshiki has no `Difficulty` — v1 ships no difficulty tier,
`futoshiki_api.rs:10-11,193-202`), so futoshiki disposition has **zero** parity coupling.

---

## 5. What the wheel is FOR now

Post-abrogation the crate still publishes to crates.io (`csp-solver 0.2.0`) and the PyO3
module is a nominal public artifact, **but** its two live jobs in *this* repo are:

1. **bbnf vendor compile gate** — needs only the core `Csp`/domain/constraint surface
   (§2). Needs the game APIs *to compile*, not to exist functionally.
2. **`tests-py` contract suite** — needs the sudoku surface (§3), needs **nothing**
   Futoshiki.

There is **no comprehensive-public-user** story for the Python game APIs today: no server,
no notebook, no downstream import. "Keep it comprehensive because someone might `pip install`
and solve Futoshiki in Python" is a **speculative** surface — the honest disposition axis is
"orphaned-and-compiled" (futoshiki) vs "test-load-bearing" (sudoku).

---

## 6. Disposition options

### Option A — Asymmetric: REMOVE `futoshiki_api.rs`, SPLIT `sudoku_api.rs` into `py/sudoku/`

Delete the orphan; give the test-load-bearing surface the colocation-edict module shape.

| Blast dimension | Impact |
|---|---|
| tests-py deaths | **0** (futoshiki has no tests; sudoku symbols preserved through the split) |
| bbnf `--verify` | Green after `mod.rs` drops the futoshiki re-exports (`mod.rs:37,44-46,71-75`); one csc411 edit, flows via `--update` |
| difficulty_parity | **1 edit**: retarget `src/py/sudoku_api.rs` → new split path (e.g. `src/py/sudoku/mod.rs`) at `difficulty_parity.rs:139` |
| LOC removed | −234 (futoshiki_api.rs) − ~6 (mod.rs re-exports) |
| LOC restructured | 338 (sudoku_api.rs) re-homed into `py/sudoku/{difficulty,csp,generate}.rs` or similar |
| .so size | small reduction (est. few KB of futoshiki monomorphized glue; core Rust unaffected) |
| compile time | marginal (`--features py` compiles ~234 fewer lines) |
| Cost | a split of a 338-line file that is **under** the 500-line budget buys structure but not budget relief; risks over-engineering |

### Option B — Symmetric colocation: SPLIT BOTH into `py/{sudoku,futoshiki}/` submodules

The colocation-edict-maximal reading: mirror the W8 per-game `solver/` colocation inside
`py/`. Restructure `py/` to `py/{core,sudoku,futoshiki}/`.

| Blast dimension | Impact |
|---|---|
| tests-py deaths | **0** (all symbols preserved, only paths move) |
| bbnf `--verify` | Green (compile-only dependency; `--check` re-vendors the new tree byte-set) |
| difficulty_parity | **1 edit**: retarget the sudoku path (line 139); futoshiki still absent from SIBLING_DEFINITIONS |
| LOC removed | 0 |
| LOC restructured | 572 (both files) + mod.rs rewiring |
| Keeps futoshiki | ✅ — preserves the "comprehensive published surface" story even with no consumer |
| Cost | most churn, retains a **234-line consumer-less** file; contradicts "remove as deprecated" for the orphan; both files under budget so no budget forcing-function |

### Option C — Remove BOTH as deprecated; wheel becomes core-`Csp`-only

Strongest "remove as deprecated" reading. Delete both game APIs, collapse `tests-py` to the
core `Csp` + typed-exception contracts (the bbnf-relevant surface).

| Blast dimension | Impact |
|---|---|
| tests-py deaths | **20** — `test_rust_backend.py` (13) + `test_bench_compare.py` (6) + 1 in wheel_contracts; would delete/rewrite these files. Only `test_panic_contract.py` + 7 wheel_contracts survive |
| bbnf `--verify` | Green (bbnf never called them; §2) |
| difficulty_parity | **1 edit**: delete the `src/py/sudoku_api.rs` SIBLING_DEFINITIONS entry (line 137-140); the parity check drops from 3 mirrors to 2 (wasm + frontend TS) |
| LOC removed | −572 (both files) − ~14 (mod.rs) − ~20 tests worth of `tests-py` |
| .so size | largest reduction (still small in absolute terms vs the shared core) |
| Cost | **destroys the only end-to-end Sudoku validation of the wheel** (`is_valid_solution` cross-checks, hard-9×9 backtrack asserts, generate→solve round-trips). The `InvalidInputError` end-to-end path (`test_wheel_contracts.py:229`) would need re-anchoring to a core-`Csp` trigger. Loses the perf-sanity guards. |

---

## 7. Recommendation seed (synthesis lane decides)

**Lean Option A (asymmetric), with a caveat on the split.**

Rationale, evidence-anchored:

- **`futoshiki_api.rs` → REMOVE.** It is genuinely orphaned: 0 tests-py consumers, 0 bbnf
  calls, 0 server (abrogated), frontend-Futoshiki rides wasm not the wheel. 234 lines of a
  published surface nobody imports. It is revivable byte-for-byte from git the moment a
  Python Futoshiki consumer materializes. Keeping it is "comprehensive for a hypothetical" —
  which §5 shows has no basis today. Zero blast radius (no test, no parity coupling).

- **`sudoku_api.rs` → KEEP (it is load-bearing: 20 tests, §3), and PRUNE the dead entry
  points** `solve_sudoku_board` (`:200`) and `template_count` (`:336`) unless the synthesis
  lane wants tests written for them. On the **split** question: `sudoku_api.rs` is 338 lines,
  **under** the 500-line colocation budget cited in `mod.rs:14`. A split into `py/sudoku/`
  is *defensible* for symmetry with the W8 per-game solver colocation and the re-affirmed
  edict, but it is not *forced* by size and it incurs the mandatory `difficulty_parity.rs`
  path edit (§4). If the synthesis lane weights the recursive-colocation edict as
  categorical ("long dirs always broken into modules" applies to the `py/` **dir**, which is
  a flat 7-file layout), then **Option B's `py/{core,sudoku,futoshiki}/` restructure is the
  edict-faithful shape** — but that reading keeps the orphan, so the cleanest synthesis is
  **A's removal of futoshiki + B's colocation applied only to the surviving core+sudoku**.

- **Avoid Option C.** It saves the most LOC but deletes the only real thing the wheel proves
  end-to-end (Sudoku generate→solve→validate + hard-board backtrack bounds). The wheel would
  become a compile-gate artifact with almost no behavioral test — a net loss of assurance for
  a small .so gain.

**One cross-cutting invariant for whichever option lands:** every disposition that touches
`SudokuDifficulty`'s file path or existence **must** co-edit `difficulty_parity.rs:135-151`
in the same change, or both parity tests fail by construction (§4). This is a feature of that
test, not an obstacle — flag it to the implementing wave as a required paired edit.
