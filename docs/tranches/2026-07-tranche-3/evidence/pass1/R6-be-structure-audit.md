# Lane R6 — BE Structure Audit (`csp-solver/src` + `csp-solver/wasm/src`)

Scope: module-dir topology, `pub`/`pub(crate)` encapsulation discipline, cohesion,
per-dir break/encapsulate candidates. Read-only. Every claim cites `file:line`.
Consumer set for "leak" scoring = the only things allowed to require `pub`:
`wasm/`, `py/` (same crate, so does not itself justify `pub`), `tests/`, `benches/`,
`examples/`, and the bbnf-lang vendored copy (opaque — flagged where it matters).

---

## 0. Inventory (measured)

`csp-solver/src`: 51 `.rs` files, 7,118 LoC. Largest: `builder/assignment.rs` (604),
`solver/gac/mod.rs` (555), `solver/search.rs` (504), `py/sudoku_api.rs` (338),
`puzzles/sudoku/generate.rs` (318), `csp/solve.rs` (305). Nothing exceeds the ~600 ceiling.

`csp-solver/wasm/src`: 5 files, 1,379 LoC — `isomorphic.rs` (460), `futoshiki.rs` (346),
`sudoku.rs` (299), `assignment.rs` (221), `lib.rs` (53).

Root residents (`lib.rs:18-32`): `adjacency`, `bitscan`, `cancel`, `config`, `error`,
`ordering`, `variable` (+ the `builder`/`constraint`/`csp`/`domain`/`puzzles`/`py`/`solver` dirs).

Module-dir layout is already sound for the mid-size dirs (`constraint/`, `domain/`,
`puzzles/{sudoku,futoshiki}/`, `solver/{gac/}`, `py/`, `builder/`) — the edict's "long dirs
into encapsulated modules" is largely satisfied. The findings below are (A) `pub`-surface
leaks, (B) two root files that want a module home, (C) the wasm `isomorphic.rs` question,
(D) the wasm error-helper cohesion smell, (E) the `py/sudoku_api.rs` question, (F) the
constraint-family question.

---

## A. Encapsulation leaks — `pub` items with ZERO external consumer

Method: for each `pub` (non-`pub(crate)`) item, grep `wasm/src`, `tests`, `benches`,
`examples` for any use. Zero hits ⇒ leak candidate (should be `pub(crate)`), unless bbnf
plausibly consumes it. These are the clearest edict wins — they tighten the published
0.3.0 semver surface.

### A1. `solver/` internals leaking (strongest cluster)

| Item | Decl | External files | Verdict |
|---|---|---|---|
| `BitsetWorklist` + `::new` | `solver/ac3.rs:20,28` | 0 | → `pub(crate)`. Pure AC-3 arc queue; `bitscan` grep = 0 too. |
| `propagate_monotonic` | `solver/monotonic.rs:21` | 0 | → `pub(crate)`. bbnf reaches this via `propagate()` auto-select, never by name (`docs/bbnf-integration.md`). |
| `propagate_stratified` | `solver/monotonic.rs:58` | 0 | → `pub(crate)`. |
| `PropResult` (type alias) | `solver/propagate.rs:17` | 0 | → `pub(crate)`. Only appears in already-`pub(crate)` `forward_check`/`ac_fc` signatures (`propagate.rs:25,88`). |
| `SearchParams` (+ 6 pub fields) | `solver/search.rs:51-60` | 0 | → `pub(crate)`. Internal kernel config; the public knob is `SolveConfig`. |
| `PERMANENT_DEPTH` | `solver/search.rs:41` | 0 | → `pub(crate)`. |
| `ZeroCost` | `solver/optimize.rs:38` | 0 | → `pub(crate)`. (`DomainCostEval` trait IS used by `tests/optimize.rs:250` — keep it pub.) |
| `CostDomainEval` | `solver/optimize.rs:56` | 0 | → `pub(crate)`. |
| `GAC_CORE_CALLS` (static) | `solver/gac/mod.rs:49` | 0 | → `pub(crate)`. Sibling `GAC_IN_ALLDIFF_ENABLED` (`gac/mod.rs:67`) IS used by `examples/`, and `next_gac_id`/`propagate_gac_core` by `tests/gac_kernel_beats.rs:23` — those earn pub. |

Net: **9 solver items** demotable to `pub(crate)` with no consumer breakage.

### A2. `adjacency` — whole module leaks

`pub mod adjacency` (`lib.rs:18`), `pub struct Adjacency` + 3 pub methods
(`adjacency.rs:25,111,115,119`). External type/module use = 0 (every `adjacency`
grep hit in tests/benches/examples is the *word* "adjacency graph" in a doc-comment,
not the type). The only public leak path is `Csp::adjacency()` (`csp/solve.rs:272`,
returns `Option<&Adjacency>`) — also 0 external consumers. **Verdict:** demote both the
accessor and the module to `pub(crate)` (`pub(crate) mod adjacency`, drop
`Csp::adjacency()` or make it `pub(crate)`). `Adjacency` is a pure internal index; nothing
outside the crate constructs or reads it.

### A3. `constraint::ImplicationConstraint` — no in-repo consumer

`ImplicationConstraint` (`constraint/implication.rs`, re-exported `constraint/mod.rs:14`):
0 hits across wasm/tests/benches/examples. Contrast the sibling built-ins:
`LambdaConstraint` (10 files), `AllDifferentExcept` (2), `AllDifferent`/`NotEqual` (many).
`ImplicationConstraint` is a public built-in with **no test and no in-repo caller**.
bbnf *may* use it (11+ `Custom` constraint types, opaque vendor). **Verdict:** either add a
test + keep pub, or confirm-with-bbnf then demote/remove. At minimum it is untested public
surface — flag for the py/bbnf lane to confirm before 0.4.0.

### A4. `bitscan` — correctly already `pub(crate)`

`bitscan` is `pub(crate) mod` (`lib.rs:19`) and `pop_lowest_bit`/`BitWord` are
`pub(crate)` (`bitscan.rs:14,44`). 0 external use confirms the tighter visibility is right.
This is the model the A1/A2 items should match — cite it as precedent.

### A5. Test-only `pub` (weaker earn, note not demote)

`ac3_full` (`ac3.rs:76`, 1 test), `feasibility_search` (`search.rs:289`, 1 test),
`solve_with_cost_eval` (`csp/solve.rs:227`, 1 test) are `pub` solely because integration
tests in `tests/` compile as separate crates and cannot see `pub(crate)`. They are
"test-driven pub" — legitimate but weak. If a future move puts these behind a
`#[cfg(feature = "internals")]` or an in-crate `#[cfg(test)]` unit-test home, they could
tighten. `branch_and_bound` (`search.rs:444`, 3 files) and `solve_optimized`
(`solve.rs:287`, 3 files incl. bbnf-shaped optimize path) earn genuine pub.

---

## B. Root files — do they earn root residency?

Per the recursive-colocation edict, a root `.rs` should either be a genuinely cross-cutting
primitive or move into the module it serves.

- **Earns root:** `error.rs` (crate-wide taxonomy, mapped by py + wasm), `variable.rs`
  (`Variable<D>` is in the `Constraint::revise` signature — public extension point, used by
  tests/bbnf), `ordering.rs` (public `Ordering` enum + `select_variable`), `cancel.rs`
  (public `CancelToken`), `config.rs` (the `Csp<D>` container + `SolveConfig`/`SolveStats`
  vocabulary — though `config` is already `pub(crate) mod`, its items re-exported at
  `lib.rs:38`). These are fine.

- **Wants a module home — `bitscan.rs`:** it is a `pub(crate)` scan primitive whose own
  doc (`bitscan.rs:3-11`) says it serves exactly two callers — `domain/bitset.rs` (`BitsetIter`)
  and `solver/ac3.rs` (`BitsetWorklist`). It is neither a domain concept nor a solver concept
  standing alone; it is a shared bit-word utility. **Candidate:** move to
  `src/util/bitscan.rs` (a new `util/` leaf) or, since both consumers are bitset-shaped, into
  `domain/` as `domain/bitscan.rs`. Low urgency (already `pub(crate)`, 52 LoC), pure tidiness.

- **`adjacency.rs`:** see A2 — beyond the visibility demotion, it is a solver support
  structure built by `Csp::finalize` and consumed only by `solver/{ac3,search}`. A
  defensible move is `solver/adjacency.rs` (colocate with its only readers). Combine with the
  A2 `pub(crate)` demotion.

---

## C. `wasm/src/isomorphic.rs` — is it needed? (mandate anchor)

**Recommendation: REMOVE (or hard-gate behind a non-default feature + add a drift test).**
Evidence it is dead weight that has already rotted:

1. **No shipped consumer.** The deployed lean artifact builds `--no-default-features`
   (`.github/workflows/ci.yml:304,344,397`), which drops `full-mirror`
   (`wasm/Cargo.toml:38-39`) and therefore `isomorphic.rs` (`wasm/lib.rs:30-31`,
   `#[cfg(feature = "full-mirror")]`). The frontend imports **only** the flat-wire
   `solveSudoku`/`solveFutoshiki` (`web/frontend/src/games/{sudoku,futoshiki}/solver/solver.worker.ts`),
   never the generic `Csp`. No JS consumer of the isomorphic surface exists in-repo.

2. **It has already drifted from the core it claims to mirror.** `isomorphic.rs:1-8` promises
   "argument orders and return shapes match `py.rs` exactly," yet:
   - `SolveStats` (`isomorphic.rs:267-272`) is **missing `cancelled`** — the core
     `SolveStats` carries it (`config.rs:120`) and both `py/config.rs` and the flat wasm
     `sudoku.rs` expose it.
   - `SolveConfig` (`isomorphic.rs:162-168`) has **no `cancel` field**; `from` hard-codes
     `cancel: None` (`isomorphic.rs:256`) — core `SolveConfig` has it (`config.rs:85`).
   - The constructor doc (`isomorphic.rs:174-176`) claims defaults are "`FORWARD_CHECKING`
     pruning, `CHRONOLOGICAL` ordering," and the code honors that (`isomorphic.rs:186-187`)
     — but the core default is **`Ac3` + `FailFirst`** (`config.rs:95-96`). The "isomorphic"
     mirror ships a *different* default posture than the thing it mirrors.

3. **Contrast with the `assignment` sibling, which is genuinely live.** `wasm/lib.rs:20-23`
   documents `assignment` as "bbnf-buddy's live consumer"; `full-mirror`/`isomorphic` is
   documented only as "Kept for PyO3-parity reference" (`wasm/lib.rs:16-18`) — reference with
   no reader and provable drift is a maintenance liability, not parity insurance. If PyO3
   parity is genuinely wanted, the honest form is a compile-time cross-check test, not a
   hand-maintained 460-line copy that silently diverges.

---

## D. wasm crate — error-helper cohesion smell

The wasm error taxonomy is an inline `coded_error(code, message) -> JsValue` **defined in a
game module** (`wasm/sudoku.rs:37`) and reached back into by the *other* game
(`wasm/futoshiki.rs:37` `use crate::sudoku::coded_error;`, 6 call sites
`futoshiki.rs:155,164,189,242,296,322`). Futoshiki structurally depends on Sudoku for an
error helper that belongs to neither. Worse, the core `error.rs:19` doc-comment references a
`wasm/src/errors.rs` "typed `WasmCspError`" — **that file does not exist** (`ls wasm/src` =
`assignment, futoshiki, isomorphic, lib, sudoku`). **Candidate:** extract
`wasm/src/errors.rs` (or `wasm/src/wire/mod.rs`) hosting `coded_error` (and the shared
`SolveResult`/getter boilerplate `sudoku.rs` and `futoshiki.rs` duplicate), so neither game
module imports the other. This is the wasm mirror of the core's `error.rs` centralization and
closes the dangling doc reference.

---

## E. `py/sudoku_api.rs` — split into a sudoku module, or remove as deprecated? (mandate anchor)

**Not deprecated — reject that option.** It is the live PyO3 Sudoku surface, explicitly
registered in the pymodule (`py/mod.rs:47-49,62-69`) and exercised by the tests-py wheel
contracts + bbnf's py-isolated compile gate (the two consumers the tranche kept the bindings
for). Removing it deletes shipped API.

**Split into a module: not on size grounds** — 338 LoC (`py/sudoku_api.rs`), under the
py-dir's own stated 500-line budget (`py/mod.rs:14`). It is cohesive (one enum
`SudokuDifficulty` + one `SudokuCSP` pyclass + 5 free functions, all Sudoku-wire). Splitting
into `py/sudoku/{difficulty,csp,generate}.rs` would be over-decomposition at this size.

**The real structural improvement (edict-aligned): mirror the core's `puzzles/` colocation.**
The crate root splits games into `puzzles/sudoku/` and `puzzles/futoshiki/` subdirs
(`puzzles/mod.rs:3-4`), but `py/` keeps them flat as `sudoku_api.rs` + `futoshiki_api.rs`
alongside the generic `csp.rs`/`config.rs`/`enums.rs`/`errors.rs` (`py/mod.rs:33-38`). For
isomorphism with the recursive-colocation edict, move both game bindings under
`py/puzzles/{sudoku,futoshiki}.rs`, leaving `py/{csp,config,enums,errors,mod}.rs` as the
generic core. That gives `py/` the same generic-vs-puzzles split the crate root has — the
strongest single edict win in the py dir, and it drops the awkward `_api` suffix that exists
only to disambiguate flat-dir collision. Treat futoshiki_api.rs identically (symmetry).

---

## F. `constraint/` — one-file-per-kind: split into families?

`constraint/` = 8 files + `mod.rs`, none over 211 LoC: `all_different.rs` (132),
`all_different_except.rs` (160), `dispatch.rs` (75), `implication.rs` (99), `lambda.rs` (48),
`not_equal.rs` (73), `scratch.rs` (47, `pub(crate)`), `traits.rs` (211).

**Verdict: do NOT split into families (e.g. `alldiff/{...}`).** Reasons:
1. The "alldiff family" is only 2 files (`all_different` + `all_different_except`) — a subdir
   for 2 cohesive files is over-nesting, not encapsulation.
2. The all-different propagator is **already** split along the real cohesion seam: the
   `check`/`scope`/`revise_impl` structural half lives in `constraint/all_different.rs`, while
   the GAC revision *engine* (Régin/Hopcroft-Karp/Tarjan) lives in `solver/gac/`
   (`mod.rs` + `matching.rs`). That is the meaningful decomposition and it already exists.
3. Every file is well under budget and single-concept. The dir reads cleanly as
   one-file-per-constraint-kind; a families layer would add path depth without cohesion gain.

The one constraint-dir action item is A3 (`ImplicationConstraint` untested/unconsumed), not a
reshape.

---

## G. Priority-ranked candidate list (for Pass-2 authoring)

1. **[HIGH, mechanical] Demote 9 solver leaks + `adjacency` to `pub(crate)`** (A1, A2).
   Zero-consumer, tightens 0.3.0→0.4.0 semver surface. Guard with the bbnf sync gate
   `--verify` (it already tripwires trait-surface/field changes — these fn/struct demotions
   are below that surface).
2. **[HIGH, mandate] Remove/hard-gate `wasm/isomorphic.rs`** (C). No consumer + proven drift.
   If retained, add a drift-assertion test so it can't silently diverge again.
3. **[MED, mandate] Reshape `py/` to `py/puzzles/{sudoku,futoshiki}.rs`** (E). Mirrors core
   `puzzles/` colocation; kills the `_api` suffix. `sudoku_api.rs` is neither deprecated nor
   too big — this is the correct interpretation of the anchor.
4. **[MED] Extract `wasm/src/errors.rs`** (D). Removes the sudoku→futoshiki back-dependency
   and closes the dangling `error.rs:19` doc reference to a file that never existed.
5. **[LOW] Resolve `ImplicationConstraint`** (A3): test-or-demote after bbnf confirmation.
6. **[LOW, tidiness] Relocate `bitscan.rs`** (B) into `domain/` or a new `util/`; optionally
   `adjacency.rs` into `solver/`.

No file currently violates a size ceiling; the audit is about visibility discipline and
two mandate-named reshapes, not breaking up oversized files.
