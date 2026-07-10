# CRITIQUE LANE — crit-spec-coherence

Target: `scratchpad/tranche3/pass1/synthesis.md` (the Pass-1 encapsulation/modularization spec).
Mode: refute-by-default. Every material claim re-derived from the tree/vendor where cheap.
Repo: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`; vendor consumer at
`/Users/mkbabb/Programming/bbnf-lang`.

---

## A. Claims re-derived and CONFIRMED

- **C-α (isomorphic zero-consumer + drift).** CONFIRMED. `solveAssignmentCop` lives in
  `wasm/src/assignment.rs:125-126` (`#[wasm_bindgen(js_name = solveAssignmentCop)]`) under the
  `assignment` feature (`wasm/Cargo.toml:40`); `isomorphic` is gated by `full-mirror`
  (`wasm/Cargo.toml:39`, `lib.rs:30-31,39-40`). The record's "kept for bbnf-buddy's
  `solveAssignmentCop`" DID conflate the two features. Drift verified: isomorphic defaults
  `FORWARD_CHECKING`+`CHRONOLOGICAL` (`isomorphic.rs:186-187` + doc `:174-176`) vs core
  `Ac3`+`FailFirst` (`config.rs:95-96`); `cancel: None` hard-coded (`isomorphic.rs:256`); core
  `SolveStats` carries `cancelled` (`config.rs:118`). Excision verdict stands.

- **C-β (`ImplicationConstraint` is a live bbnf consumer).** CONFIRMED, R6's "demote" REFUTED.
  bbnf constructs it: `bbnf-lang/.../csp_strategy/constraints/engine.rs:86` (`use
  csp_solver::constraint::{ImplicationConstraint, VarId}`) + `:170`
  (`csp.add_constraint(ImplicationConstraint::new(...))`), plus references in
  `csp_strategy/mod.rs:6,33,37,144` and `components.rs:12`. It is `pub` at
  `constraint/mod.rs:15`. Zero in-repo tests reference it (`grep tests/` empty) → "keep pub + add
  test" is justified.

- **LOC / version facts.** ALL CONFIRMED: `futoshiki_api.rs` 234, `sudoku_api.rs` 338,
  `isomorphic.rs` 460, `gac/mod.rs` 555 (over the 500 budget), `search.rs` 504, `assignment.rs`
  221. `pyproject.toml:7` = `0.2.0` vs `Cargo.toml:3` = `0.3.0` — the packaging-bug premise of
  §1.4 defect 1 is real. `pyproject.toml` also carries no description/urls/classifiers.

- **futoshiki_api is caller-dead.** CONFIRMED. `grep -rln futoshiki csp-solver/tests-py/` → empty;
  bbnf's py gate is compile-only (`verify_py_isolated` runs `cargo check --features py` +
  `cargo check` on root/skinny/vendor — `sync-csp-solver-vendor.sh` step block; NO invocation);
  no FastAPI. Product Futoshiki rides `wasm/src/futoshiki.rs`.

- **difficulty_parity coupling.** CONFIRMED. `SIBLING_DEFINITIONS` at `difficulty_parity.rs:135`
  pins `"src/py/sudoku_api.rs"` at `:138` (label `:137`) with the discovery guard at `:318-338`.
  A rename must retarget it or both parity tests fail by construction. (Nit: the spec's W-D says
  "line 139"; the path literal is `:138`.)

- **FE App.vue asymmetry.** CONFIRMED. No `games/sudoku/SudokuGame.vue` exists; `App.vue` = 371
  LOC hosting shell+selector+Sudoku scene while `FutoshikiGame.vue` = 197 LOC is self-contained.
  ("God-file" is rhetorically strong for 371 LOC, but the asymmetry is real.)

---

## B. Claims CORRECTED or REFUTED — the coherence defects

### B1. REFUTED-AS-WRITTEN — §1.2 "the `budget_exceeded`/`cancelled` getters (all zero-caller)"
The qualifier `SudokuCSP.` was dropped in synthesis and it is **load-bearing**. R2 §4 is precise:
the DEAD getters are `SudokuCSP.{budget_exceeded,cancelled}` (`sudoku_api.rs`; the wheel reads
`Csp.stats.*`, not `SudokuCSP.*` — R2 line 88). The **generic `SolveStats.{budget_exceeded,
cancelled}`** fields (`py/config.rs:143-148`) are **LIVE** — consumed by `test_wheel_contracts.py`
at `:105` (`csp.stats.budget_exceeded`), `:155`, `:156`, `:197` (`csp.stats.cancelled`). R2 line
58 explicitly flags this: "on the **generic `Csp`/`SolveStats`**, not `SudokuCSP`."
**Authored verbatim, an implementer deletes the LIVE `SolveStats` getters and breaks four wheel
assertions.** Must be re-scoped to `SudokuCSP.{budget_exceeded,cancelled}` only.

### B2. CONFIRMED-INCOHERENT — §1.2 "remove the `to_pyerr` `Timeout` arm … class stays pending Q6"
`py/errors.rs:53-61` is an **exhaustive** match over `CspError`'s four variants (no `_`). Removing
the `CspError::Timeout => …` arm at `:59` alone yields a non-exhaustive-match **compile error**
(E0004). The only way it compiles is to also delete the `CspError::Timeout` **variant**, which
touches `error.rs:63` (def), `:77` (Display), `:94` (`code() → "TIMEOUT"`), the enum's own unit
test (R2 §4), AND — because bbnf vendors byte-identically — must be mirrored into
`bbnf-lang/crates/csp-solver/src/{error.rs:80,98, py/errors.rs:59}` via `--update`, then
`--verify`. Worse, the arm is the *only* Rust reference to the `CspTimeoutError` class, so "remove
the arm but keep the class pending Q6" is self-contradictory: the arm-removal decision **is** the
class-removal decision. Q6 cannot be "open" while §1.2 commits to the arm removal. This row is
under-specified and unshippable as phrased.

### B3. CORRECTED — §1.1 blast radius "one `mod.rs` re-export prune"
Undercount. Removing `futoshiki_api.rs` requires THREE `mod.rs` edits, not one: (1) `mod
futoshiki_api;` (`mod.rs:41`), (2) the `pub use futoshiki_api::{…}` re-export (`mod.rs:44-46`),
and (3) — the load-bearing one for compilation — the `#[pymodule]` registration block
(`m.add_class::<FutoshikiCSP>` / `FutoshikiBoard` + three `wrap_pyfunction!` lines in the
`// Futoshiki` block). Plus the module docstring co-edit. Omitting (3) fails to compile.

### B4. CORRECTED — §1.2 bare `Csp::{…}` "pruned crate-wide"
Ambiguous and dangerous. The bare `Csp::{add_equals, add_less_than, add_greater_than,
solve_with_given, propagate_with}` reads as the **core** `Csp`, but R2 §4 targets the **py wrapper
methods in `py/csp.rs`** (`:44,49,54,76,99`). The **core** methods are demonstrably LIVE: the py
wrappers call them (`py/csp.rs:50 self.inner.add_less_than`), and bbnf's vendored core tests call
`csp.solve_with_given(&config, &given)` at `bbnf-lang/crates/csp-solver/tests/solver.rs:235,754,
1393,1411,1426,1441,1456,1471,1498,1528…` (10+ sites). "Pruned crate-wide" compounds the hazard.
Must read "the py `Csp` wrapper methods (`py/csp.rs`)."

### B5. KISS-bar / ROI — §1.4 `py/common.rs` extraction
The spec's own text concedes "the duplication count halves." After the §1.1+§1.2 prunes
(futoshiki_api gone, `solve_sudoku_board` gone), R2 §5's 4× marshalling collapses to **2×**:
`sudoku_api.rs` (`solve_sudoku`) and `csp.rs:88-95` — and those two differ in key type (`String`
vs `u32`), so a shared helper must be generic over the key. A common.rs for a 2×,
differently-typed duplication is borderline over the owner KISS bar; the "real seam, not
speculative" justification is materially weaker post-prune than the row admits. Additionally the
row silently drops R2 §5's `enums.rs` triplication (`enums.rs:11-30,33-51,54-72`) — a completeness
gap in what "common extraction" covers.

### B6. UNVERIFIABLE / decorative — §1.2 "20 expanded tests-py tests"
`tests-py/` has 18 raw `def test_` across 4 files; the "20" is presumably post-parametrize but is
not re-derivable this pass. The *dependency* on `sudoku_api` (via `create_sudoku_csp`,
`solve_sudoku`, `SudokuDifficulty`) is CONFIRMED-live (R2 §3); the count is decorative and wrong
as a raw figure.

---

## C. Completeness gaps the 8 lanes / spec did not probe

1. **abi3 adoption is ungated and rests on an unverified premise.** §1.4 marks abi3@py310 "ADOPT,
   unconditional" on R1's "only stable-API surface" claim, not re-verified this pass. The crate
   uses `#[pyclass(eq, eq_int, from_py_object)]` (`enums.rs`), `create_exception!` (`errors.rs`),
   and `py.detach` (`csp.rs:70`) under pyo3 0.29 — abi3-compatible in principle, but no prototype
   builds an abi3 wheel to prove it. Unlike every other structural row it has no P-gate.
2. **npm-tarball question (Q1) is correctly open but under-weighted.** `wasm/Cargo.toml:8`
   `publish = false`, version `0.2.0`; the npm `@mkbabb/csp-solver-wasm` 0.2.0 build target
   (lean vs full) is not established in-tree. If the published tarball is the full module, isomorphic
   excision is a **breaking npm change**. This gates W-B and deserves to be a hard pre-condition,
   not just a question.
3. **"Wheel not on PyPI" (load-bearing for §1.1's low-stakes framing) is asserted, not proven.**
   `pyproject.toml` shows no publish config; the artifacts table (crates.io+npm only) is the only
   support. It is consistent but UNVERIFIABLE from the tree — and the entire "removing published
   py surface is safe" argument for both futoshiki AND the §1.2 dead symbols rests on it.
4. **Consistency of published-surface treatment.** `solve_sudoku_board`, `template_count`,
   `PropagationStrategy` are all `#[pymodule]`-registered exports (verified in `py/mod.rs`), same
   class of "published py surface" as futoshiki_api — yet §1.1 routes futoshiki through owner
   ratification (Q2) while §1.2 prunes the others unconditionally. The distinction (whole game vs
   internal symbols) is defensible but the spec never states the rule, so the rigor looks uneven.

---

## D. Overengineering audit against the KISS bar — mostly PASSES

§1.7's rejections are well-judged and evidence-backed: no `py/sudoku/` split (under budget, one
concern), no `csp_solver.sudoku` namespacing (one domain, Polars-flat reference), no declarative
`#[pymodule]` churn, no `packages/pencil` monorepo, no `mod.rs`-rename sweep as a wave. This is the
strongest part of the spec and aligns with the owner KISS mandate. The only ADOPTED rows that sit
near or over the bar are B5 (common.rs, post-prune ROI) and C1 (abi3, ungated). The gac/mod.rs
split and search.rs waiver (Q8) are appropriately budget-driven and appropriately deferred.

---

## E. Verdict summary

| Claim | Class | Evidence |
|---|---|---|
| C-α isomorphic zero-consumer + drift | CONFIRMED | `assignment.rs:125`, `Cargo.toml:39-40`, `isomorphic.rs:186,256`, `config.rs:95` |
| C-β ImplicationConstraint live bbnf consumer | CONFIRMED | `engine.rs:86,170`; `constraint/mod.rs:15` |
| futoshiki_api caller-dead | CONFIRMED | empty tests-py grep; compile-only gate |
| §1.1 blast = "one re-export prune" | CORRECTED | 3 mod.rs edits incl. pymodule block |
| §1.2 `budget_exceeded/cancelled getters` zero-caller | REFUTED as written | `SolveStats.*` LIVE at `test_wheel_contracts.py:105,155,156,197` — needs `SudokuCSP.` scope |
| §1.2 `Csp::{…}` crate-wide prune | CORRECTED | core methods live (bbnf `solver.rs`, py wrappers); means py/csp.rs only |
| §1.2 remove Timeout arm, keep class pending Q6 | REFUTED (incoherent) | exhaustiveness E0004; arm-removal = variant+class removal + vendor mirror |
| §1.4 common.rs "real seam" | CORRECTED (KISS) | post-prune 2× dup, differing key types; enums.rs dup ignored |
| §1.4 pyproject 0.2.0 vs 0.3.0 packaging bug | CONFIRMED | `pyproject.toml:7`, `Cargo.toml:3` |
| §1.4 abi3 unconditional | UNVERIFIABLE | no abi3 build this pass; ungated |
| §1.2 "20 tests-py tests" | UNVERIFIABLE | 18 raw def_test; dependency real, count wrong |
| §1.5.1 App.vue asymmetry | CONFIRMED | 371 vs 197 LOC; no SudokuGame.vue |
| §1.6.5 gac/mod.rs 555 over budget | CONFIRMED | `wc -l` |

## F. Convergence

Start 100. Deductions:
- B1 REFUTED-as-written (live getters deletable) — **−9**
- B2 incoherent Timeout-arm/variant/class coupling — **−9**
- B3 futoshiki blast undercount (pymodule block) — **−3**
- B4 `Csp::{}` core/py ambiguity — **−3**
- B5 common.rs post-prune ROI + enums.rs gap — **−3**
- C1 abi3 ungated/unverified — **−2**
- C2 npm-tarball gate under-weighted (Q1) — **−3**
- C3/C4 PyPI-non-publication unproven + uneven surface rule — **−3**
- Residual open questions Q2/Q5/Q6/Q7/Q8/Q9 not settled-to-author-verbatim — **−4**
- B6 decorative count — **−1**

**Convergence ≈ 60%.** The macro-shape (excise isomorphic + full-mirror; remove futoshiki_api
pending owner; keep-rename sudoku_api, no dir split; pub(crate) demotions gated by P5; FE scene
symmetry) is CONFIRMED and author-ready. The dead-**symbol** list in §1.2 is where the spec loses
precision against consumer truth (B1/B2/B4) and must be corrected before any W-B/W-D authoring.
