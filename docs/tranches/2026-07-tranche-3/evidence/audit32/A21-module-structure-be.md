# A21 — MODULE STRUCTURE (BE)

Consumed: `scratchpad/tranche3/pass1/R6-be-structure-audit.md` (BE structure),
`R2-py-dissection.md` (py/ dissection), `R4-py-game-api-disposition.md` (py game-API
disposition), `synthesis.md` §1.2/1.3/1.6/1.7 (settled decisions). Verified every load-bearing
claim in R6/R2/R4 against HEAD `3b75eca2` (2026-07-10 14:35:53 -0400) — **all hold, byte-exact**:
LoC counts (`csp-solver/src` 7,118, `wasm/src` 1,379), the 8 zero-consumer `grep` results for
A1's solver leaks, `Adjacency`/`ImplicationConstraint` grep results, `wasm/lib.rs` feature-gate
text, `error.rs:19` doc reference to a nonexistent `wasm/src/errors.rs`, `py/mod.rs:14-23` module
doc, and the `difficulty_parity.rs:137-138` `SIBLING_DEFINITIONS` path pin. No drift since pass-1
authored these reports (same day). This report does not re-derive what R6/R2/R4/synthesis.md
already settled — it adds fresh verification evidence + rows the two settled shapes (py/
restructure, wasm feature-split) into tranche-III authoring, plus closes two gaps pass-1 left
open (crate-root `lib.rs` surface beyond solver/adjacency; a rename-collision caveat).

---

## 1. Verification ledger (spot-checks beyond what pass-1 ran)

| Claim (source) | Check run | Result |
|---|---|---|
| 9 solver items zero-consumer (R6 A1) | `grep -rl <item> wasm/src tests benches examples` for all 8 named items | **0 hits each**, confirmed |
| `Adjacency` zero-consumer (R6 A2) | same grep | **0 hits**, confirmed |
| `ImplicationConstraint` zero in-repo consumer (R6 A3) but bbnf-live (synthesis §0 C-β) | grepped `~/Programming/bbnf-lang/crates/ir/src/passes/csp_strategy/constraints/engine.rs` | **confirmed**: `use csp_solver::constraint::{ImplicationConstraint, VarId}` (:86), `ImplicationConstraint::new(...)` construction (:170) — synthesis's "KEEP pub + add test" is right, R6's raw in-repo-only grep undersold it |
| `wasm/lib.rs` feature doc (`full-mirror`/lean split) | read `wasm/Cargo.toml:31-40`, `wasm/lib.rs:1-53` | verbatim match to R6/R3 quotes |
| `wasm/src/errors.rs` doesn't exist (R6 D) | `ls wasm/src` | confirmed: `assignment, futoshiki, isomorphic, lib, sudoku` — no `errors.rs` |
| `error.rs:19` still dangling-references it | read `src/error.rs:1-22` | **confirmed, and now self-aware**: the doc explicitly flags "`wasm/src/errors.rs`, not reconciled in this pass — see report" — tranche-2 already logged the gap, tranche-III can close it |
| Domain/builder pub surfaces have no analogous leaks | `grep -rl` for every `pub` item in `domain/{bitset,cost_finite,finite,lattice,traits}.rs` and `builder/assignment.rs` against `wasm/src tests benches examples` | **all have ≥1 external consumer** — `FiniteDomain`/`CostDomain` used by 4-7 test/bench/src files, `AssignmentBuilder` methods used by `wasm/assignment.rs` + 3 test files + 1 bench + 1 example. **No additional pub(crate) demotion candidates exist outside R6's solver/+adjacency list** — this closes the "did R6 miss a dir" question the lane was asked to extend. |
| `CspError::Timeout` zero constructor sites (R2 §4) | `grep -rn "CspError::Timeout" src/ tests/` | **confirmed**: only the `to_pyerr` match arm (`py/errors.rs:59`) and a unit-test `.code()` assertion (`tests/error.rs:30`) — no constructor anywhere |
| `py/mod.rs` exact registration shape (R2 §2) | read `py/mod.rs:1-89` | verbatim match |
| `tests-py/` still present, unabrogated | `ls csp-solver/tests-py/` | confirmed: 4 test files + pyproject/uv.lock, matches R4's 20-test count basis |

**No contradictions found.** Pass-1's C-α (isomorphic zero-consumer) and C-β
(ImplicationConstraint bbnf-live) resolutions in `synthesis.md` §0 stand.

---

## 2. New finding: rename caveat for `sudoku_api.rs → py/sudoku.rs`

Synthesis §1.2 mandates renaming `py/sudoku_api.rs → py/sudoku.rs` (dropping the `_api` suffix
now that `futoshiki_api.rs` is gone, §1.1). Two mechanical edits pass-1 didn't spell out that the
implementing wave needs, both cheap but easy to miss:

1. **Self-referential import collision risk (non-blocking, but confusing without a note).**
   `py/sudoku_api.rs:12` does `use crate::sudoku::{self, Difficulty};` — importing the
   crate-root puzzle module `crate::sudoku` (re-exported `lib.rs:41`) under the local name
   `sudoku`, *inside a file that will become the module `crate::py::sudoku`*. This compiles fine
   (Rust's per-module namespace means a module can `use` an item that shares its own outward
   name — the module doesn't refer to itself by bare identifier), but it is exactly the kind of
   naming knot a reviewer will pause on. Flag it as a non-issue in the wave's commit message so
   it isn't investigated as a bug.
2. **`py/mod.rs:14-23` doc-comment submodule list still says `sudoku_api`.** The module-doc
   itself (`- \`sudoku_api\` — the Sudoku convenience API…`, `py/mod.rs:21`) needs the same
   rename the file gets, or the doc drifts the moment the split lands — same class of staleness
   R6 flagged for `error.rs:19`. One-line co-edit, same commit.

Both are sub-mechanical (no design decision), but belong in the wave's edit list alongside the
already-identified `difficulty_parity.rs:135-140` retarget (R4 §4, synthesis §1.2) so the
implementing agent doesn't treat them as follow-up debt.

---

## 3. Structure rows for tranche-III authoring (deduped against pass-1)

Rows already fully specified by `synthesis.md` §1.1–1.3/1.6 are **not repeated** here — cite them
directly. This table adds only what pass-1 left as a gap, a caveat, or an explicit "gated by
prototype" placeholder that this lane can now close with evidence.

| # | Row | Status after this lane's verification | Cite |
|---|---|---|---|
| S1 | `py/futoshiki_api.rs` — REMOVE | Confirmed zero blast radius at HEAD (tests-py has no futoshiki reference, bbnf compile-only). Ready to author verbatim. | synthesis §1.1, R4 §3/§6-A |
| S2 | `py/sudoku_api.rs` → KEEP, PRUNE 5 dead symbols + 1 dead alias + 2 dead getters, RENAME → `py/sudoku.rs`, no dir split | Confirmed under-budget (338→~200 LoC est. post-prune), confirmed rename is mechanically safe (§2 above) with 2 co-edits (`py/mod.rs:21` doc line, `difficulty_parity.rs:137-138`) | synthesis §1.2, R2 §4/§6, R4 §4 |
| S3 | `wasm/src/isomorphic.rs` + `full-mirror` feature — EXCISE | Confirmed zero consumer at HEAD (no change since pass-1 authored same-day); `default = ["full-mirror","assignment"]` → `["assignment"]` at `wasm/Cargo.toml:38`; serde stays alive via `assignment` (`Cargo.toml:40`), no lockfile churn | synthesis §1.3, R3 §6 Option A |
| S4 | Demote 9 solver items + `Adjacency`/`Csp::adjacency()` to `pub(crate)`; relocate `adjacency.rs → solver/adjacency.rs` | Confirmed zero-consumer at HEAD for all 9+1 items (re-grepped, §1 above). **Closed gap**: swept `domain/` + `builder/` for parallel leaks — none found, so this list is exhaustive, not just solver-scoped | synthesis §1.6.1-2, R6 A1/A2/B |
| S5 | Extract `wasm/src/errors.rs` (shared `coded_error` + solution-marshalling), removing futoshiki→sudoku back-dependency and closing the `error.rs:19` dangling doc reference | Confirmed still dangling at HEAD; core `error.rs` doc-comment (`src/error.rs:19-20`) now *self-documents* the gap as "not reconciled in this pass" — tranche-2 explicitly deferred it, tranche-III is the designated closer | synthesis §1.6.3, R6 §D |
| S6 | `ImplicationConstraint` — KEEP pub, ADD in-repo test | Re-confirmed bbnf-lang constructs it live (`bbnf-lang/crates/ir/.../constraints/engine.rs:86,170`) outside the vendored copy — this is a genuine external consumer via the sibling repo, not just "someday." The test gap is real: 0 hits in csp-solver's own `tests/` | synthesis §0 C-β, §1.6.4, R2 §3 |
| S7 | `gac/mod.rs` (555 LoC, grew from 470) — split along the `matching.rs` seam (extract Tarjan SCC) | Not independently re-measured by this lane (out of BE-structure scope per R6's own file-size ceiling note — "nothing exceeds the ~600 ceiling," so this is a should-not-must); flagged in pass-1 as needing the critique pass's sign-off | synthesis §1.6.5, R7 §5-R3 |
| S8 | REJECT: `py/sudoku/` dir split, `py/puzzles/{sudoku,futoshiki}/` symmetric reshape, `constraint/` family subdirs | Re-confirmed no forcing function exists post-verification: `constraint/` files all ≤211 LoC (R6 §F unchanged at HEAD), `py/sudoku.rs` post-prune lands ~200 LoC — a subdir for one file is unjustified either way | synthesis §1.7, R6 §E/§F |

**No new rows beyond S1–S8 are warranted.** This lane's extension mandate ("py/ restructure
shape, wasm crate split, lib.rs surface tightening") maps onto S1/S2 (py restructure), S3/S5
(wasm — note: this is a **feature-axis split within one crate**, not a multi-crate split; no
evidence anywhere in the repo, CI matrix, or npm packaging supports literally splitting
`csp-solver-wasm` into separate published crates — the lean/full boundary is already achieved via
Cargo features + `--no-default-features`, which is the correct mechanism and should not be
re-litigated as a crate-split), and S4 (lib.rs / crate-root surface tightening, extended to
confirm domain/builder are already clean).

---

## 4. Files/evidence referenced

- `csp-solver/src/lib.rs:1-42`
- `csp-solver/src/py/mod.rs:1-89`, `src/py/sudoku_api.rs:12`, `src/py/errors.rs:1-73`
- `csp-solver/src/error.rs:1-22`
- `csp-solver/wasm/src/lib.rs`, `wasm/src/sudoku.rs:30-45`, `wasm/src/futoshiki.rs:30-40`,
  `wasm/Cargo.toml:31-40`
- `csp-solver/src/domain/{mod,bitset,cost_finite,finite,lattice,traits}.rs`
- `csp-solver/src/builder/{mod,assignment}.rs`
- `csp-solver/tests/difficulty_parity.rs:135-140`
- `csp-solver/tests-py/` (directory listing)
- `~/Programming/bbnf-lang/crates/ir/src/passes/csp_strategy/constraints/engine.rs:86,170`
- `scratchpad/tranche3/pass1/{R2,R4,R6,synthesis}.md`
