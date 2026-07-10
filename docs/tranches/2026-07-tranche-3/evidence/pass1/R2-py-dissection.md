# LANE R2 — CODEBASE DISSECTION: `csp-solver/src/py/*`

Pure code truth. Every claim cites `file:line`. No web research.

## 1. Module inventory + line counts

`csp-solver/src/py/` — 7 files, 1080 LOC total (`wc -l`):

| File | LOC | Contents |
|---|---|---|
| `mod.rs` | 88 | `#[pymodule] csp_solver`, submod decls, re-exports |
| `enums.rs` | 72 | `Pruning`, `Ordering`, `PropagationStrategy` + 3 `From` impls |
| `errors.rs` | 68 | 4 `create_exception!` + `CspError::to_pyerr` + `From<CspError> for PyErr` |
| `config.rs` | 149 | `CancelToken`, `SolveConfig`, `SolveStats` |
| `csp.rs` | 131 | generic `Csp` pyclass (wraps `Csp<BitsetDomain>`) |
| `sudoku_api.rs` | 338 | `SudokuDifficulty`, `SudokuCSP`, 5 pyfunctions |
| `futoshiki_api.rs` | 234 | `FutoshikiCSP`, `FutoshikiBoard`, 3 pyfunctions |

All files under the 500-line budget. The two largest (`sudoku_api` 338, `futoshiki_api` 234) are the "twins" (§5).

## 2. Exact exported surface

Registered in `#[pymodule]` `mod.rs:52-88`. Re-exported `mod.rs:40-50`.

### pyclasses (14 `add_class`)
- `Pruning` `enums.rs:14` — `NONE/FORWARD_CHECKING/AC3/AC_FC`, `#[pyclass(eq, eq_int, from_py_object)]`
- `Ordering` `enums.rs:37` — `CHRONOLOGICAL/FAIL_FIRST/MRV`
- `PropagationStrategy` `enums.rs:58` — `AUTO/AC3/SWEEP`
- `SolveConfig` `config.rs:77` — `skip_from_py_object`; get/set fields `pruning,ordering,max_solutions,node_budget,cancel`; `#[new]` sig `config.rs:99`
- `SolveStats` `config.rs:132` — `skip_from_py_object`; get-only `backtracks,nodes_explored,propagations,budget_exceeded,cancelled`
- `CancelToken` `config.rs:26` — `from_py_object`; `#[new]`, `cancel()`, `is_cancelled` getter
- `Csp` `csp.rs:14` — `unsendable`; 13 methods (§3)
- `SudokuDifficulty` `sudoku_api.rs:18` — `from_py_object`; enum `EASY/MEDIUM/HARD` + `#[classmethod] get` `sudoku_api.rs:30`
- `SudokuCSP` `sudoku_api.rs:57` — `skip_from_py_object`; get fields `solutions,backtrack_count,budget_exceeded,cancelled` + `backtracks()` getter `sudoku_api.rs:83`
- `FutoshikiCSP` `futoshiki_api.rs:41` — `skip_from_py_object`; get `board_size,solutions,backtrack_count,budget_exceeded,cancelled` + `backtracks()`/`inequalities()` getters `futoshiki_api.rs:63,70`
- `FutoshikiBoard` `futoshiki_api.rs:184` — `skip_from_py_object`; get `values,inequalities,board_size`

### pyfunctions (8)
- `create_sudoku_csp` `sudoku_api.rs:90`
- `solve_sudoku` `sudoku_api.rs:144`
- `solve_sudoku_board` `sudoku_api.rs:200` (single-call collapse of the above two)
- `create_random_board` `sudoku_api.rs:264`
- `template_count` `sudoku_api.rs:336`
- `create_futoshiki_csp` `futoshiki_api.rs:87`
- `solve_futoshiki` `futoshiki_api.rs:132`
- `create_random_futoshiki` `futoshiki_api.rs:205`

### exceptions (4, `errors.rs:24-48`)
`UnsatisfiableError`, `BudgetExceededError`, `InvalidInputError`, `CspTimeoutError` — each `create_exception!(csp_solver, …, PyException, …)`. Explicitly re-added to the module dict `mod.rs:77-86` (so `from csp_solver import UnsatisfiableError` resolves). Mapped from `CspError` variants in `CspError::to_pyerr` `errors.rs:53-61`.

### `Csp` methods (`csp.rs`)
`new` :21, `add_variable` :29, `add_not_equal` :34, `add_all_different` :39, `add_equals` :44, `add_less_than` :49, `add_greater_than` :54, `finalize` :59, `propagate` :68, `propagate_with` :76, `solve` :84, `solve_with_given` :99, `stats` getter :121.

## 3. Consumer map

### csp-solver/tests-py (the ONLY calling consumers)
- `test_rust_backend.py` — imports `SudokuDifficulty, create_random_board, create_sudoku_csp, solve_sudoku` (:13); uses `SudokuDifficulty.get` (:129-137), `InvalidInputError` (:90), `.solutions` (:79), `.backtrack_count` (:154).
- `test_wheel_contracts.py` — `Csp` (`add_variable,add_all_different,add_not_equal,finalize,propagate,solve,stats`), `SolveConfig`, `Pruning.NONE`, `Ordering.CHRONOLOGICAL`, `CancelToken` (`.cancel/.is_cancelled`), `create_sudoku_csp`, all 4 exception *classes* (:249-256), `UnsatisfiableError`/`InvalidInputError` end-to-end (:222,:234). `csp.stats.budget_exceeded/cancelled` at :105,155,156,197 are on the **generic `Csp`/`SolveStats`**, not `SudokuCSP`.
- `test_panic_contract.py` — `Csp`, `SolveConfig` (panic path `csp.solve()` before `finalize`).
- `test_bench_compare.py` — `create_sudoku_csp`, `solve_sudoku`, `.backtrack_count`.

### bbnf-lang (`~/Programming/bbnf-lang`) — COMPILE-ONLY, ZERO py-symbol calls
bbnf vendors a byte-identical copy at `crates/csp-solver`. Machine grep of its root+skinny crates for py symbols returns **zero** hits on any `py/` export (`SudokuCSP`, `create_sudoku_csp`, `UnsatisfiableError`, `CancelToken`, …). Every bbnf `csp_solver::` use is the **Rust core**: `Csp`, `constraint::{Constraint,Revision,VarId,ImplicationConstraint,LambdaConstraint}`, `domain::{Domain,LatticeDomain}`, `variable::Variable`, `ordering::Ordering`, `Pruning`, `SolveConfig`, `CspError`, `OptimizationMode` (e.g. `crates/ir/src/passes/csp_strategy/mod.rs:142`, `crates/egraph/src/csp_scheduler.rs:30`).

bbnf's verify gate (`scripts/sync-csp-solver-vendor.sh`) `verify_py_isolated` (:211-245) runs `cargo check --features py` on the vendored `src/` in a **detached single-crate workspace** at pyo3 0.29 (`:246-256`, step `[4/4]`). This **compiles the entire `py/` branch** (proving it still builds under the `ThreadSafe ⟹ Csp: Send` cfg fix) but **invokes nothing**. Consequence for the dead-symbol analysis below: bbnf constrains only that the branch *compiles*, never that any symbol is *called* — so removing a caller-dead py symbol is bbnf-safe as long as the module still compiles.

### Everything else on this machine — NONE
- Repo-wide grep for py-symbol callers outside `src/py`+`tests-py`: only TS/Vue name-collisions (`SudokuDifficulty` ordinal in `web/frontend/src/games/sudoku/solver/`, `FutoshikiBoard.vue` the component) and doc/artifact prose — no Python/PyO3 call sites. The FastAPI service that used these was excised (T2-W2; `difficulty_parity.rs:` reconciliation note confirms the Pydantic mirror is gone).
- Machine-wide `grep -rl "import csp_solver"` across `~/Programming` (excluding this repo's tests-py, venvs, site-packages): **no other Python consumers**.

## 4. LIVE / DEAD matrix

"DEAD-to-callers" = zero non-test **and** zero test call sites. bbnf compiles but never calls, so it does not make a symbol live.

| Symbol | Test callers | Verdict |
|---|---|---|
| `Csp` + `add_variable/add_all_different/add_not_equal/finalize/propagate/solve/stats` | wheel, panic | **LIVE** |
| `Csp.add_equals/add_less_than/add_greater_than` | none | **DEAD** |
| `Csp.solve_with_given` | none | **DEAD** |
| `Csp.propagate_with` | none | **DEAD** |
| `PropagationStrategy` (whole enum) | none — its sole use is `propagate_with` (dead) | **DEAD** |
| `SolveConfig`, `SolveStats`, `CancelToken` | wheel | **LIVE** |
| `Pruning` (NONE used), `Ordering` (CHRONOLOGICAL/MRV) | wheel/backend | **LIVE** (FORWARD_CHECKING/AC_FC/FAIL_FIRST/AC3 variants never named by a test) |
| `create_sudoku_csp`, `solve_sudoku`, `create_random_board` | backend/wheel/bench | **LIVE** |
| `SudokuDifficulty` + `.get` | backend | **LIVE** |
| `SudokuCSP.solutions/backtrack_count` | backend/bench | **LIVE** |
| `SudokuCSP.backtracks()` getter alias | none (tests use `backtrack_count`) | **DEAD** |
| `SudokuCSP.budget_exceeded/cancelled` getters | none (the wheel reads `Csp.stats.*`, not `SudokuCSP.*`) | **DEAD** |
| `solve_sudoku_board` | none | **DEAD** |
| `template_count` | none | **DEAD** |
| entire **futoshiki_api** — `FutoshikiCSP`, `FutoshikiBoard`, `create_futoshiki_csp`, `solve_futoshiki`, `create_random_futoshiki`, `inequalities`/`backtracks` getters | **none** (zero `futoshiki` refs in tests-py) | **DEAD** |
| `UnsatisfiableError`, `InvalidInputError` | wheel end-to-end | **LIVE** |
| `BudgetExceededError` | class-existence only; end-to-end `@skip` (`test_wheel_contracts.py:259-283` — config too strong to reach) | **PARTIAL** |
| `CspTimeoutError` | class-existence only; end-to-end `@skip` (`:286-306`) | **PARTIAL** |
| `CspError::to_pyerr` `Timeout` arm `errors.rs:59` | — `CspError::Timeout` has **zero constructor sites** in `src/` (only the enum unit test + this arm) | **DEAD arm** |

Headline: the **entire Futoshiki PyO3 surface (5 functions + 2 classes, 234 LOC) has zero callers** anywhere on the machine — no test, no FastAPI (excised), no bbnf call. It exists purely as a compiled-but-uninvoked mirror. Product-facing Futoshiki solving runs through the **wasm** crate (`csp-solver/wasm/src/futoshiki.rs`), not this py binding.

## 5. The twins — `sudoku_api` vs `futoshiki_api` duplication

Near-verbatim structural mirror. The `solve_*` bodies are ~95% identical:

- **config block** `sudoku_api.rs:149-155` ≡ `futoshiki_api.rs:137-143` — same `Ac3`+`Mrv`+`max_solutions`+`cancel`+`..Default::default()` literal (also re-copied a third time in `solve_sudoku_board` `:226-232`).
- **stats writeback** `sudoku_api.rs:168-170` ≡ `futoshiki_api.rs:156-158` — byte-identical 3 lines.
- **solutions marshalling** `sudoku_api.rs:172-180` ≡ `futoshiki_api.rs:160-168` ≡ `solve_sudoku_board` `:240-248` ≡ `Csp.solve` `csp.rs:88-95` — the `.into_iter().enumerate().map(|(i,v)| (i.to_string(), v as i32))` collect, repeated **4×** (String keys) / the u32-key variant twice more in `csp.rs`.
- **budget contract** `sudoku_api.rs:182-184` ≡ `futoshiki_api.rs:170-172` — identical `if empty && budget_exceeded { Err(BudgetExceeded) }`.
- **position-string parse loop** (`pos_str.parse … CspError::invalid_input("invalid position") … out of range`) triplicated: `create_sudoku_csp:101-115`, `solve_sudoku_board:211-224`, `create_futoshiki_csp:94-101`.
- **the `*CSP` pyclass shape** — both carry `solutions/backtrack_count/budget_exceeded/cancelled` + a `backtracks()` alias getter; the getter alias is dead in both.

Asymmetry worth noting: `sudoku_api` calls `sudoku::create_sudoku_csp` (a free fn) inside detach; `futoshiki_api` pre-validates into a `FutoshikiPuzzle` at construction (`from_parts` `futoshiki_api.rs:106`) then rebuilds via `build_futoshiki_csp` — Futoshiki's shape is cleaner (validation front-loaded, `FutoshikiCSP` stores the validated puzzle). Sudoku re-parses the flat board on every call.

`enums.rs` is itself triplicated: three `#[pyclass]` enum + `From` blocks with identical `#[allow(non_camel_case_types)]` boilerplate (`:11-30`, `:33-51`, `:54-72`).

## 6. Structure assessment

**Good:** clean split under budget; `mod.rs` re-export + registration is legible; the `skip_from_py_object`/`from_py_object` pyo3-0.29 discipline is deliberate and documented per-class (`config.rs:74-76`, `sudoku_api.rs:54-56`); `From<CspError> for PyErr` centralizes error mapping so call sites `?` (`errors.rs:14-16`).

**Weak:**
1. **Flat, not colocated.** Under the recursive-colocation edict, `sudoku_api.rs` (338 LOC, 1 enum + 1 class + 5 fns) and `futoshiki_api.rs` are single files, not `py/sudoku/{difficulty,csp,solve,generate}` modules. They mirror the engine's own per-game `puzzles/{sudoku,futoshiki}/` colocation nowhere.
2. **No shared solve helper.** The 4× duplicated marshalling + 2×/3× config/parse/budget blocks (§5) want a `py/common.rs` (or `py/marshal.rs`): a `flatten_solutions_to_string_map`, a `production_config(max_solutions, cancel)`, a `parse_position_map`. None exists.
3. **Dead weight compiled.** Whole `futoshiki_api` + `solve_sudoku_board` + `template_count` + 4 dead `Csp` methods + `PropagationStrategy` + dead getters carried into every wheel. bbnf's `--features py` gate compiles all of it each verify.
4. **Dead error arm.** `CspTimeoutError`/`to_pyerr` `Timeout` (`errors.rs:59`) forward-declared, unreachable — the tests-py skip reasons (`:286-306`) already document this as a known no-constructor gap.
5. **`SudokuCSP.backtracks()` alias** duplicates the `backtrack_count` get-field; both live, neither dead-safe to keep both.

## 7. `difficulty_parity` mirror coupling

`csp-solver/tests/difficulty_parity.rs` hard-references `src/py/sudoku_api.rs` as a `SIBLING_DEFINITIONS` entry (`:135-140`, `Casing::Verbatim`) — one of three surviving mirrors (PyO3, wasm PascalCase, frontend TS) after the FastAPI/Pydantic mirror was excised (:reconciliation note). Two structural couplings:
- **Path-pinned:** the test greps `src/py/sudoku_api.rs` by literal path. Splitting `sudoku_api.rs` into a `py/sudoku/` module (recommendation §6.1) **must** retarget this entry (line 138) or the parity test fails to find the enum. The header comment (`:47`) already records the prior `py.rs → py/sudoku_api.rs` retarget from the W1 split — precedent for exactly this.
- **Discovery guard:** `no_unscanned_difficulty_definitions_exist` walks `SCAN_ROOTS` (`:161`, includes `src`) and asserts the discovered `*Difficulty`-shaped-definition file set is *exactly* `SIBLING_DEFINITIONS`'s paths. If a py-module split relocates `SudokuDifficulty` to `src/py/sudoku/difficulty.rs`, the guard discovers a new file and **fails by construction** until the allowlist path is updated. So any `py/` restructure that moves the enum is coupled to a one-line `SIBLING_DEFINITIONS` edit.

## 8. Actionable findings for Pass-2

- **Excise or gate Futoshiki py surface** (234 LOC, zero callers) — or add tests-py coverage if the py Futoshiki binding is intended to ship. Decision needs owner: it's the largest dead block.
- **Prune caller-dead symbols**: `solve_sudoku_board`, `template_count`, `Csp::{add_equals,add_less_than,add_greater_than,solve_with_given,propagate_with}`, `PropagationStrategy`, the `backtracks()` getter aliases, `SudokuCSP.{budget_exceeded,cancelled}` getters, the `CspTimeoutError`/`Timeout` arm — each has zero live consumers; bbnf compile-gate is the only thing touching them and it won't miss what's removed.
- **Extract `py/common.rs`** for the 4× solution-marshalling, the production config literal, the position-parse loop, and the budget-exceeded contract.
- **Colocate** into `py/sudoku/` + `py/futoshiki/` modules per the recursive-colocation edict, retargeting `difficulty_parity.rs:138` in the same change.
