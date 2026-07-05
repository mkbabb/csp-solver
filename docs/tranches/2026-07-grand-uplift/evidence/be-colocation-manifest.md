# Backend Recursive-Colocation Manifest — Pass 4 (closure)

**Agent**: be-colocation-manifest · **Repo**: `CSC411_HW2_ProgrammingQuestion` (worktree `wf_0c754e24-d3c-5`)
**Base evaluated**: `pass4/composed-csp-solver-v2.tgz` (Rust — the blocker-1 export exists, used per assignment routing) + current tree at HEAD `91bb8b0` (Python, docs, scripts — no Python-side composed artifact exists, so the live tree is the base) + `pass2/api-error-taxonomy.md` §3 + `pass2/api-error-taxonomy-stubs/*.py` (DI skeleton) + `pass1/fastapi-service.md` §3 + `pass1/rust-search-core.md` §9–10 + `pass2/rust-owned-puzzle-data.md` + `pass4/morph-excision-spec.md`.
**Owner edict governing this manifest** (2026-07-05, binding): recursive colocation for all dirs; only module/global-level items in shared dirs; long-running flat dirs broken into encapsulated modules; pencil/animation is `src/pencil` (frontend, out of scope here); Morph leans EXCISE to a sibling repo.
**Method**: every claim below is measured against an extracted tarball or the live worktree — commands and output are in §7 (evidence log). No claim is asserted from memory of the spec docs alone.

---

## 0. Worktree-defect fix (precondition, done before auditing)

The worktree was stale exactly as the STATE note warned: `git log -1` returned `bc37f4d` (73 commits behind `master`), not `91bb8b0`. Verified `bc37f4d` is an ancestor of `master` (`git merge-base HEAD 91bb8b0` = `bc37f4d`, `git status --short` clean) — a pure fast-forward, no divergent local work to lose:

```
git merge --ff-only master
git log -1 --oneline   # → 91bb8b0d docs: constellation grand-audit fold (2026-06-03)
```

This is the exact `bc37f4d` defect flagged in `pass3/synthesis-pass3.md`'s W12 hygiene scope ("worktree base-ref provisioning fix... every Pass-3 agent had to reset around"). All findings below are against the now-current `91bb8b0` tree plus the composed Rust export.

---

## 1. Verdict summary

| Surface | Status vs. edict | Action needed |
|---|---|---|
| Rust `lib.rs` | **Not done** — still the 567-line pre-split monolith (config vocab + builder + solve dispatch in one file) | Split into `config.rs` + `csp/{mod,solve}.rs` per `rust-search-core.md` §10 (manifest §2.2) |
| Rust `solver/` post-kernel | **Done**, one contestable | `search.rs` kernel + `restart.rs` + `heuristic.rs` + propagation trio + `gac/{mod,matching}.rs` are cohesive; `backtrack.rs`/`backjump.rs` correctly deleted (S2/S4). Contestable: `gac_alldiff{,_except}.rs` sit flat in `solver/` next to search policy files but are GAC-only and, per fresh measurement, **have zero production callers** (§2.3) |
| Rust `constraint/` | **Done** structurally; tests-of-record pointers **absent** | Per-constraint modules already exist (9 files). Zero src files carry a "Tests:" backlink comment. Reconciliation with the no-tests-in-src precept in §2.4 |
| Rust `puzzles/sudoku/` | **Done** | csp/generate/rng/transform/mod, 5 files, already colocated |
| Rust `puzzles/futoshiki/` | **Correctly minimal, not a gap** | Only csp.rs+mod.rs exist because generation is unbuilt (Pass-3 W8, not yet landed) — asymmetry with sudoku is a status fact, not a defect |
| Rust data-embedding (`rust-owned-puzzle-data`) | **Decided, unlanded** | Neither the interim Docker-copy nor the end-state `include_dir!` has landed in the composed tree or the live tree; data still lives at `web/api/src/app/data/` |
| Rust `py/` | **Done** | 5-file directory-module exactly as its own doc-comment states; confirmed against the 405-line pre-split `py.rs` still in the live tree |
| Rust `wasm/` | **Not done** | `isomorphic.rs` (632 L) still mixes generic config/Csp mirror with Sudoku-specific bindings; needs the `sudoku.rs` split the `option-c-readiness` critique already assumes exists |
| Rust `domain/`, `builder/` | **Done, no action** | Already one-file-per-domain-kind / single-consumer-shape; further nesting would fragment, not clarify |
| Rust `morph-core/`, `wasm-morph/` | **Excluded from this manifest** | Excise-bound to a new sibling repo per ratified `morph-excision-spec.md`; colocating code that is leaving is wasted motion |
| Python routes/models/services | **Undecided in the base; this manifest picks `games/{sudoku,futoshiki}/{router,service,models}.py`** | See §3.3 — justified against over-engineering, not a reflexive application of the edict |
| Python `core/{settings,errors,executors,limiter}` | **Correctly shared already in the Pass-2 prototype** | No change — this is exactly the edict's "module/global-level items in shared dirs" exception |
| Python tests mirror | **Flat-but-named, not a subdirectory mirror** | Recommended: proportionate to current test count (§3.5) |
| Repo-wide flat dirs (`scripts/`, `docs/`, `data/`) | **Keep flat** — none qualifies as "long-running" | Sizes measured in §4; the one real data-ownership defect is already covered by the Rust data-embedding item, not a colocation-breakup item |

---

## 2. Rust (`csp-solver/`)

### 2.1 Base and provenance

`pass4/composed-csp-solver-v2.tgz` (281,420 bytes) was extracted and diffed against the live `91bb8b0` tree. It is materially different from — and newer than — `pass3/composed-csp-solver.tgz`: it adds `src/error.rs`, `src/cancel.rs`, `src/bitscan.rs`, the `src/py/` directory-module (replacing `src/py.rs`), and `src/solver/{search,restart,heuristic}.rs` + `src/solver/gac/{mod,matching}.rs` (replacing `src/solver/{backtrack,backjump}.rs`). This confirms blocker-1 (kernel-soundness-closure) had exported a v2 by the time this beat ran, per the routing instruction.

```
tar tzf pass4/composed-csp-solver-v2.tgz | grep -c 'src/.*\.rs$'   # 62 files (excl. morph-core/wasm-morph)
```

### 2.2 `lib.rs` decomposition — NOT DONE

Measured: 567 lines, unchanged in shape from the state `rust-search-core.md` §10 audited (that report measured 532 L pre-composition; the delta is the composition wave's additions to `SolveConfig`/`SolveStats`, not a restructuring).

```
$ grep -n "^pub struct\|^pub enum\|^pub fn\|^impl\|^mod \|^pub mod" csp-solver/src/lib.rs
11:pub mod adjacency;
13:pub mod builder;
14:pub mod cancel;
15:pub mod constraint;
16:pub mod domain;
17:pub mod error;
18:pub mod ordering;
20:pub mod py;
21:pub mod puzzles;
22:pub mod solver;
23:pub mod variable;
43:pub enum Pruning { ... }
56:pub enum PropagationStrategy { ... }
67:pub enum OptimizationMode { ... }
78:pub struct SolveConfig { ... }
112:impl Default for SolveConfig
129:pub struct SolveStats { ... }
149:pub struct Csp<D: Domain> { ... }
160:impl<D: Domain> Csp<D> { ... }        # lines 160-538 — builder + solve dispatch, one impl block
539:impl<D: Domain> Default for Csp<D>
545:impl<D: domain::CostDomain> Csp<D>    # solve_optimized
559:pub struct Unsatisfiable;
```

Exact line-level split, sized against `rust-search-core.md`'s own targets:

| New file | Source lines | Content | Target size | Measured |
|---|---|---|---|---|
| `lib.rs` | 1–23 (rewritten) | module decls + re-exports only | ~40 L | matches |
| `config.rs` | 25–158 | `Pruning`, `PropagationStrategy`, `OptimizationMode`, `SolveConfig`(+Default), `SolveStats`, `Csp` struct definition | ~150 L | 133 L raw — under budget |
| `csp/mod.rs` | 160–277 | `new`/`add_variable(s)`/`add_constraint*`/`add_not_equal`/`add_all_different`/`add_equals`/`add_less_than`/`add_greater_than`/`finalize` — the builder surface | ~120 L | 117 L — matches |
| `csp/solve.rs` | 277–559 | `propagate`/`propagate_with`/`solve`/`solve_with_given`/`solve_with_cost_eval`/`solve_optimized`/`stats`/`adjacency`/`Default` — search dispatch | ~230 L | 282 L — slightly over the original ~230 estimate because `SolveConfig`'s composition-wave field growth widened several signatures; still one reason-to-change (dispatch into the kernel) |
| **Contestable** — `Unsatisfiable` (559–567) | its sole use-site is `propagate`/`propagate_with`'s `Result<(), Unsatisfiable>` | Recommend colocating with `csp/solve.rs` (its only consumer), not `config.rs` — `config.rs` is vocabulary/shape, `Unsatisfiable` is a control-flow marker. Either placement is defensible; flagging so it isn't silently placed by whoever executes this split. |||

This is unchanged from the Pass-1 finding (S8) — it has not moved in three subsequent Rust composition waves (rust-composition, gil-liberation, py-module-reconciliation) because none of those beats touched `lib.rs`'s own shape, only its `SolveConfig`/`SolveStats` field lists and `use` block. **This manifest confirms it is still open and still exactly as specified.**

### 2.3 `solver/` post-kernel shape — DONE, one contestable, one fresh finding

```
$ wc -l csp-solver/src/solver/*.rs csp-solver/src/solver/gac/*.rs | sort -n
      28 solver/gac_alldiff.rs
      57 solver/restart.rs
      58 solver/gac_alldiff_except.rs
      66 solver/mod.rs
      75 solver/optimize.rs
     110 solver/heuristic.rs
     110 solver/monotonic.rs
     149 solver/propagate.rs
     167 solver/nogoods.rs
     173 solver/gac/matching.rs
     176 solver/local_search.rs
     185 solver/ac3.rs
     470 solver/gac/mod.rs
     507 solver/search.rs
```

`backtrack.rs` (98 L) and `backjump.rs` (238 L) — the two files `rust-search-core.md` S1/S2/S4 identified as the triplicated, partly-unsound skeleton — are **absent**, correctly deleted, their behavior absorbed as `SearchPolicy` impls inside `search.rs` (507 L: the one generic `search()` kernel + `Feasibility`/`BranchBound`/whatever backjump policy survived, per the design in `rust-search-core.md` §9.2). `optimize.rs` shrank from the ~400-line `bb_recurse` file the audit measured to 75 L (bound-prune/value-order/leaf hooks only — the shared skeleton moved into `search.rs`). `restart.rs` (Luby) and `heuristic.rs` (CHS/ERWA weighting) are new, correctly search-internal (not crate-root vocabulary — `ordering.rs` at the crate root stays the pure `Ordering` enum; `heuristic.rs` is the solve-time algorithm one of its variants invokes — no duplication, verified by reading both files).

`gac/mod.rs` (470 L) + `gac/matching.rs` (173 L) is a legitimate, cohesive split: `mod.rs` is the unified incremental Régin-1994 core (`propagate_gac_core`, thread-local `GacScratch`, per-constraint matching-cache warm-start) and `matching.rs` is the Hopcroft-Karp/Tarjan graph primitives it calls. Both `search.rs` (507 L) and `gac/mod.rs` (470 L) sit at or just over the ~500-line budget the crate's own convention elsewhere states explicitly (`py/mod.rs`'s doc-comment: "each well under the 500-line budget") — **contestable, not actioned**: each is one tightly-coupled algorithm (one search function + its policies; one GAC pipeline + its scratch/cache), and splitting further on line-count alone would fragment single-reason-to-change code. Flagging the number, not recommending a cut.

**Fresh finding, not in any upstream report** — `gac_alldiff.rs`/`gac_alldiff_except.rs` placement is wrong on a different axis than line count: they are GAC-specific (their own doc-comments: "thin, stateless entry point over the unified `propagate_gac_core`") but live flat in `solver/` beside the generic search-policy files (`search.rs`, `restart.rs`, `heuristic.rs`), not nested under `solver/gac/` where their only dependency (`propagate_gac_core`) lives. Worse — traced their actual callers:

```
$ grep -rn "propagate_gac_alldiff\b" csp-solver/
tests/gac.rs:7:   use csp_solver::solver::gac_alldiff::propagate_gac_alldiff;
tests/gac.rs:20,114: (2 call sites, both in tests/)
src/solver/gac_alldiff.rs:19: pub fn propagate_gac_alldiff<D: Domain>( ... )   # the definition

$ grep -n "propagate_gac_core\|propagate_gac_alldiff" csp-solver/src/constraint/all_different.rs
# revise_impl calls crate::solver::gac::propagate_gac_core(...) directly, with Some(self.gac_id) for warm-start
# propagate_gac_alldiff (the "thin, stateless, no cache" entry point) is NEVER called from constraint/all_different.rs
```

Same result for `all_different_except.rs` vs `propagate_gac_alldiff_except` (its doc-comment even cross-references the function as "see also," not as its call path — the live `revise_impl` calls `gac::propagate_gac_core` with the sentinel directly). **`solver::gac_alldiff` and `solver::gac_alldiff_except` are public API with zero production (`src/`-internal) callers** — exercised only from `tests/gac.rs` / `tests/gac_alldiff_except.rs`. This is structurally the same pattern `rust-search-core.md` S4 flagged for `backjump.rs`/`local_search.rs`/`nogoods.rs` ("legacy — fold-with-real-callers or delete"), except here the likely intent is different: a deliberately simple, obviously-correct **reference/oracle implementation kept for differential testing** against the cached, incremental, sentinel-generic core — a legitimate pattern, but currently undocumented as such (neither file's doc-comment says "test-only," both read as if they were the live constraint-time entry points). Recommendation: nest both under `solver/gac/{alldiff.rs,alldiff_except.rs}` (fixes the colocation gap) **and** add one line to each doc-comment — "no production caller; kept as a differential-test oracle against `propagate_gac_core`'s incremental path, exercised from `tests/gac{,_alldiff_except}.rs`" — so a future reader doesn't mistake dead-looking code for a bug. Do not delete: unlike `backjump.rs`, these have live test coverage and a defensible testing rationale, just an undocumented one.

### 2.4 `constraint/` — per-constraint modules done; tests-of-record reconciliation

```
$ wc -l csp-solver/src/constraint/*.rs
     104 all_different.rs        135 all_different_except.rs   134 cardinality.rs
      96 dispatch.rs              99 implication.rs              38 lambda.rs
      21 mod.rs                   61 not_equal.rs                70 soft.rs
     167 traits.rs                                                       925 total
```

Already fully decomposed, one file per constraint kind plus `traits.rs` (shared trait defs) and `dispatch.rs` (the `ConstraintEnum` devirtualized dispatch) — no action needed on the module shape itself.

**Reconciliation the assignment asked for, stated explicitly**: `csp-solver/CLAUDE.md` documents "Zero inline tests — all tests live in `tests/`," and this is true for every constraint/solver/puzzle module **except one** — measured:

```
$ grep -rn "#\[cfg(test)\]\|mod tests" csp-solver/src/
src/error.rs:131:#[cfg(test)]
src/error.rs:132:mod tests {
```

Sixteen lines, testing `CspError::code()`'s string-stability contract and the `Unsatisfiable → CspError` conversion — genuinely whitebox, module-private-detail testing (`use super::*`), the idiomatic Rust home for exactly this kind of narrow contract test. This is a live, current exception to the documented precept, not a hypothetical one. **Reconciliation stance taken by this manifest**: do not mechanically move these 16 lines to `tests/error.rs` to satisfy a literal reading of "zero inline tests" — the documented precept is stricter than idiomatic Rust practice and the codebase itself already deviates from it, correctly. Recommended fix is to the *documentation*, not the code: amend `csp-solver/CLAUDE.md`'s line to distinguish the two disciplines explicitly — "Public-API / cross-module behavior is always verified in `tests/` (blackbox, one file per concern); narrow whitebox unit tests for a single private contract (e.g. `error.rs`'s stable-code invariant) may use `#[cfg(test)] mod tests` inline — the two are complementary, never a substitute for each other." Given that amendment, "colocated tests-of-record pointers" for every other `src/` module is satisfied purely at the **documentation** layer — a one-line doc-comment per file naming its integration-test file(s), never test *code* moving into `src/`. None of these pointers currently exist (`grep -rn "tests/" csp-solver/src/constraint/*.rs` — zero hits); recommended additions, derived by cross-referencing `tests/*.rs` against the type names they exercise:

| `src/` module | Tests-of-record (measured, not asserted) |
|---|---|
| `constraint/all_different.rs` | `tests/gac.rs` (oracle path), `tests/solver.rs` (live path via `Csp::add_all_different`) |
| `constraint/all_different_except.rs` | `tests/all_different_except.rs`, `tests/gac_alldiff_except.rs` |
| `constraint/soft.rs`, `constraint/cardinality.rs`, `constraint/lambda.rs` | `tests/optimize.rs` (B&B + soft-constraint suite, 576 L) |
| `constraint/not_equal.rs` | `tests/local_search.rs`, `tests/solver.rs` |
| `domain/lattice.rs` | `tests/lattice.rs` (944 L — the BBNF monotonic/lattice suite) |
| `builder/assignment.rs` | `tests/assignment_builder.rs`, `tests/assignment_proptest.rs` |
| `solver/nogoods.rs` | `tests/nogoods.rs` |
| `solver/search.rs` (the kernel itself) | `tests/solver.rs` (1555 L — general solve correctness) + the new `tests/solution_set_invariance.rs` (159 L, R1's property test, already present in this v2 export) |

The last row is itself evidence for a second, smaller flat-file finding inside `tests/`: `tests/solver.rs` is 1555 lines / 48 `#[test]` functions with zero internal `mod` grouping, and `tests/lattice.rs` is 944 lines — both are "long-running flat" **files** (not directories; `tests/` itself has only 14 entries, not a flat-dir problem by count). Cargo's `tests/<name>/main.rs` convention permits splitting these into per-concern submodules without adding separate test binaries (avoiding the "more files under `tests/` = more linked binaries = slower `cargo test --workspace`" cost the composed rust-composition report flagged as a standing CI-time concern). Recommend, if this is ever actioned: `tests/solver/{main.rs, alldiff.rs, not_equal.rs, lambda.rs, config.rs}` — but this is proportionate cleanup, not blocking; flagged for completeness, not booked as a gating item.

### 2.5 `puzzles/{sudoku,futoshiki}/` and data-embedding

```
$ wc -l csp-solver/src/puzzles/sudoku/*.rs
      57 csp.rs   123 generate.rs   10 mod.rs   36 rng.rs   105 transform.rs   (331 total)
$ wc -l csp-solver/src/puzzles/futoshiki/*.rs
     120 csp.rs     7 mod.rs                                (127 total)
```

Sudoku is already fully colocated per-concern (csp construction / generation / RNG / symmetry transform, one file each). Futoshiki has only `csp.rs` (the solver-facing CSP construction) — **this is not a colocation defect**: `synthesis-pass3.md` W8 books `futoshiki/generate.rs` as net-new work, gated on the kernel-soundness fix (R1) because Futoshiki's uniqueness checker is exactly the `max_solutions:2` pattern the §0 P0 corrupts. The asymmetry between the two puzzle directories is a true snapshot of what's built, not a structural gap to fix by this manifest.

**Data-embedding (`rust-owned-puzzle-data` spec) — decided, not landed, in either the composed export or the live tree:**

```
$ tar tzf pass4/composed-csp-solver-v2.tgz | grep -c 'data/'      # 0
$ find csp-solver/data -maxdepth 3   (live tree)                  # no such directory
$ grep -n "include_dir\|CARGO_MANIFEST" csp-solver/src/puzzles/sudoku/generate.rs  # no hits, either tree
$ grep -rn "sudoku_puzzles\|sudoku_solutions" web/api/src --include="*.py" | grep -v test
web/api/src/app/api/routes/board.py:31: template_dir = DATA_DIR / "sudoku_puzzles" / str(n) / difficulty_name
```

`pass2/rust-owned-puzzle-data.md` §4.3 decided: interim = Docker-stage-copy from `csp-solver/data/sudoku_puzzles/` (crate-root sibling to `src/`, matching the existing `tests/`/`benches/`/`examples/` convention — data is not code and does not belong nested inside `src/puzzles/sudoku/`, the `include_dir!` macro's `$CARGO_MANIFEST_DIR` addressing is crate-root-relative by Cargo idiom); end-state = full `include_dir!` compile-time embedding, deleting Python's `_load_templates`/`DATA_DIR`/`functools.cache` runtime-glob code entirely. **Neither step has executed.** The live tree still has Python doing the file-glob directly against `web/api/src/app/data/sudoku_puzzles/` — the exact ownership inversion `fastapi-service.md` F13 flagged (puzzle-domain content nested inside a Python package flagged legacy at the top level). This is booked in `synthesis-pass3.md` W3 ("data ownership + generator binary + `include_dir!` end-state as in Pass-2 §3.2") — this manifest's contribution is confirming, by direct measurement, that it is still fully open at the point this beat ran, and stating the target shape precisely: `csp-solver/data/sudoku_puzzles/{N}/{difficulty}/` (crate root, unchanged from Pass-2's `git mv` recommendation), consumed via `include_dir!` colocated at its one call site in `puzzles/sudoku/generate.rs`. No `data/futoshiki/` is warranted yet — Futoshiki's v1 scope (per W8) generates every board on the fly (seeded Latin square + solver-driven hole-dig), it has no template bank to embed.

### 2.6 `py/` — DONE

```
$ wc -l csp-solver/src/py.rs                (live tree, pre-split)     405
$ wc -l csp-solver/src/py/*.rs               (composed export)
     118 config.rs   119 csp.rs   63 enums.rs   70 errors.rs   70 mod.rs   276 sudoku_api.rs   (716 total)
```

Matches its own doc-comment exactly (enums/config/csp/sudoku_api/errors, "each well under the 500-line budget"), and matches the Pass-3 `py-module-reconciliation` report's claim (T9, closed, 172/172 tests). Growth from 405→716 lines is the typed-exception work (`errors.rs` is net-new), not scope creep.

### 2.7 `wasm/` — NOT DONE

```
$ wc -l csp-solver/wasm/src/*.rs
     221 assignment.rs   632 isomorphic.rs   38 lib.rs   (891 total)
```

`assignment.rs` (the `AssignmentBuilder` wasm wrapper, per `morph-excision-spec.md` §4 confirmed to stay — it has a second, non-morph consumer) is already correctly isolated. `isomorphic.rs` at 632 lines is not: it mixes three genuinely separate concerns in one file, verified by symbol inspection —

```
$ grep -n "^pub struct\|^struct \|^pub fn\|^#\[wasm_bindgen\]" csp-solver/wasm/src/isomorphic.rs
 lines  50–326  Pruning/Ordering/PropagationStrategy/OptimizationMode/SolveConfig/SolveStats mirrors   (generic config surface, ~280 L)
 lines 327–470  Csp wasm wrapper                                                                       (generic solve surface, ~140 L)
 lines 471–632  SudokuDifficulty/SudokuCspWire/create_sudoku_csp/solve_sudoku/create_random_board       (Sudoku-specific, ~160 L)
```

The Sudoku-specific third is exactly what `pass2/synthesis-pass1.md`'s carried-forward critique #6 (`option-c-readiness`) already assumes is a separate file — it refers to the target directly as `wasm/src/sudoku.rs` (e.g. "`wasm/src/sudoku.rs` had no `budget_exceeded` field and no error path") when in the *actual* tree today that code lives inside `isomorphic.rs`. **Recommended split**: `isomorphic.rs` keeps the generic config/enum/`Csp` mirror (~420 L, under budget) and everything from `SudokuDifficulty` down moves to new `wasm/src/sudoku.rs` (~165 L) — this both satisfies the colocation edict (game-specific code isolated, mirroring `puzzles/sudoku/` on the native side) and gives the already-planned `budget_exceeded`/typed-error fix (`option-c/sudoku.rs.budget-fix.diff`, per `synthesis-pass3.md` W5) a file that actually matches its own name before that diff lands, instead of requiring the diff's author to first invent the split as an undocumented side effect.

### 2.8 `domain/`, `builder/` — DONE, no action

```
$ wc -l csp-solver/src/domain/*.rs
      13 mod.rs   55 finite.rs   80 lattice.rs   121 traits.rs   147 bitset.rs   176 cost_finite.rs
$ wc -l csp-solver/src/builder/*.rs
      13 mod.rs   444 assignment.rs
```

`domain/` is already one file per domain kind (bitset / finite / cost_finite / lattice) plus `traits.rs` — no further nesting is warranted; these are leaf value types, not components with sub-components. `builder/` has exactly one builder pattern today (`AssignmentBuilder`); `mod.rs` is a 13-line re-export shim documented as the home for "each frequently-recurring constraint pattern" — correctly scoped to grow sideways (`builder/<new_pattern>.rs`) if a second builder ever appears, not to be restructured now for a single occupant.

### 2.9 Cross-cutting top-level files — correctly NOT nested under any puzzle/constraint dir

`error.rs` (148 L, unified `CspError` family), `cancel.rs` (44 L, `CancelToken`), `bitscan.rs` (52 L, `pub(crate)` shared bit-scan primitive used by both `domain/bitset.rs` and `solver/ac3.rs`) are all genuinely crate-wide, consumed from ≥2 unrelated subtrees (`py/`, `wasm/`, `solver/`, `domain/`) — this is exactly the edict's carve-out ("only truly module/global-level items in shared dirs"), already correctly placed at the crate root. No action.

### 2.10 `morph-core/`, `wasm-morph/` — EXCLUDED

`morph-excision-spec.md` (ratified, this same Pass-4 tranche) targets both for a new sibling repo (`mkbabb/morph`, directory-rename-only for the wasm crate, package identity `@mkbabb/morph` frozen). §4 of that spec confirms the *only* piece that stays in `csc411` is `builder/assignment.rs` (already covered in §2.8 — it has a second consumer, `csp-solver/wasm`, that isn't moving). Applying the recursive-colocation edict to code whose own accepted spec is "delete this directory from this repo" would be wasted engineering motion; this manifest explicitly excludes `morph-core/` and `wasm-morph/` from scope rather than silently omitting them.

### 2.11 `tests/`, `benches/`, `examples/` — appropriately flat, one file-size flag carried from §2.4

```
$ find csp-solver/examples -type f    # profile_csp.rs, profile_sudoku.rs, time_sudoku.rs
$ find csp-solver/benches -type f     # queens, sudoku, lattice, assignment, map_coloring, cost_finite_domain (.rs)
```

Both directories are one file per Cargo binary/bench target — that granularity is a Cargo structural requirement, not a colocation choice, and both are well within any reasonable size ceiling (1,649 combined lines across 9 files). No action. The one carried-forward flag is `tests/solver.rs` (1555 L) / `tests/lattice.rs` (944 L) from §2.4 — proportionate future cleanup, not gating.

### 2.12 Full old → new manifest, every `.rs` file

Legend: **UNCHANGED** (already colocated correctly) · **SPLIT** (one file becomes several) · **MOVE** (relocates, same content) · **NEW** (doesn't exist yet, target path given) · **EXCLUDED** (out of scope, excise-bound).

| Old path | New path(s) | Disposition |
|---|---|---|
| `src/lib.rs` (567 L) | `src/lib.rs` (~40 L, decls+re-exports) | **SPLIT** |
| — | `src/config.rs` (~135 L) | **SPLIT** (new, carved from lib.rs) |
| — | `src/csp/mod.rs` (~120 L) | **SPLIT** (new) |
| — | `src/csp/solve.rs` (~280 L) | **SPLIT** (new) |
| `src/adjacency.rs` | unchanged | **UNCHANGED** |
| `src/bitscan.rs` | unchanged | **UNCHANGED** (§2.9) |
| `src/cancel.rs` | unchanged | **UNCHANGED** (§2.9) |
| `src/error.rs` | unchanged (doc-comment amendment only, §2.4) | **UNCHANGED** |
| `src/ordering.rs` | unchanged | **UNCHANGED** |
| `src/variable.rs` | unchanged | **UNCHANGED** |
| `src/builder/mod.rs`, `builder/assignment.rs` | unchanged | **UNCHANGED** (§2.8) |
| `src/domain/{mod,traits,bitset,finite,cost_finite,lattice}.rs` | unchanged | **UNCHANGED** (§2.8) |
| `src/constraint/{mod,traits,dispatch,all_different,all_different_except,cardinality,implication,lambda,not_equal,soft}.rs` | unchanged (+ "Tests:" doc-comment line each, §2.4) | **UNCHANGED** |
| `src/solver/mod.rs` | unchanged | **UNCHANGED** |
| `src/solver/search.rs` | unchanged | **UNCHANGED** (§2.3, size flagged not actioned) |
| `src/solver/restart.rs`, `heuristic.rs` | unchanged | **UNCHANGED** |
| `src/solver/ac3.rs`, `propagate.rs`, `monotonic.rs` | unchanged | **UNCHANGED** |
| `src/solver/nogoods.rs`, `local_search.rs`, `optimize.rs` | unchanged | **UNCHANGED** |
| `src/solver/gac/mod.rs`, `gac/matching.rs` | unchanged | **UNCHANGED** |
| `src/solver/gac_alldiff.rs` | `src/solver/gac/alldiff.rs` | **MOVE** (§2.3) |
| `src/solver/gac_alldiff_except.rs` | `src/solver/gac/alldiff_except.rs` | **MOVE** (§2.3) |
| `src/puzzles/mod.rs` | unchanged | **UNCHANGED** |
| `src/puzzles/sudoku/{mod,csp,generate,rng,transform}.rs` | unchanged | **UNCHANGED** |
| `src/puzzles/futoshiki/{mod,csp}.rs` | unchanged | **UNCHANGED** (asymmetry is status, not defect) |
| — | `src/puzzles/futoshiki/generate.rs` | **NEW**, gated on R1 (kernel-soundness-closure), W8 scope |
| — | `csp-solver/data/sudoku_puzzles/{N}/{difficulty}/*.json` | **NEW** (crate-root, moved from `web/api/src/app/data/`, §2.5) |
| `src/py/{mod,config,csp,enums,errors,sudoku_api}.rs` | unchanged | **UNCHANGED** (§2.6) |
| `wasm/src/lib.rs` | unchanged | **UNCHANGED** |
| `wasm/src/assignment.rs` | unchanged | **UNCHANGED** (§2.7) |
| `wasm/src/isomorphic.rs` (632 L) | `wasm/src/isomorphic.rs` (~420 L, generic config/Csp mirror only) | **SPLIT** |
| — | `wasm/src/sudoku.rs` (~165 L) | **SPLIT** (new, carved from isomorphic.rs) |
| `morph-core/**`, `wasm-morph/**` | *(new sibling repo `mkbabb/morph`)* | **EXCLUDED** (§2.10) |

### 2.13 Module graph (target state, post-split)

```
                         ┌───────────────────────┐
                         │        lib.rs          │  module decls + re-exports only
                         └──────────┬────────────┘
             ┌───────────┬──────────┼──────────┬───────────┬─────────────┐
             ▼           ▼          ▼          ▼           ▼             ▼
       config.rs     csp/mod.rs  csp/solve.rs error.rs  cancel.rs   bitscan.rs(crate)
       (vocab)       (builder)   (dispatch)   (shared)  (shared)    (shared, pub(crate))
             │           │          │
             │           └────┬─────┘
             │                ▼
             │          ┌───────────┐      ┌────────────┐     ┌───────────┐
             │          │ constraint │◀────▶│   domain   │◀───▶│  variable │
             │          │  (9 files) │      │  (6 files) │     │           │
             │          └─────┬─────┘      └────────────┘     └───────────┘
             │                │
             │                ▼
             │          ┌────────────────────────────────────────┐
             │          │  solver/                                │
             │          │   search.rs (kernel + policies)         │
             │          │   restart.rs, heuristic.rs               │
             │          │   ac3.rs, propagate.rs, monotonic.rs      │
             │          │   nogoods.rs, local_search.rs, optimize.rs│
             │          │   gac/{mod,matching,alldiff,alldiff_except}.rs │
             │          └────────────────┬─────────────────────────┘
             │                           │
             ▼                           ▼
       puzzles/{sudoku,futoshiki}/  ◀────┘   (consumes constraint + domain + solver::search via csp/solve.rs)
             │
             ├── sudoku/{mod,csp,generate,rng,transform}.rs ── data/sudoku_puzzles/ (crate root, NEW)
             └── futoshiki/{mod,csp}.rs (+ generate.rs, NEW, ← R1)
             │
             ▼
       builder/{mod,assignment}.rs  (also consumed by wasm/src/assignment.rs — the sole cross-crate reuse)
             │
    ┌────────┴─────────┐
    ▼                   ▼
  py/ (feature-gated,   wasm/ (separate crate, `csp-solver-wasm`)
  6 files)               ├── lib.rs
                          ├── assignment.rs  (wraps builder::assignment)
                          ├── isomorphic.rs  (generic config/Csp mirror)
                          └── sudoku.rs (NEW — split out of isomorphic.rs)

  EXCLUDED (excise-bound, separate repo): morph-core/, wasm-morph/
```

---

## 3. Python (`web/api/`)

### 3.1 Base

No composed Python artifact exists for this beat (the only Python-touching Pass-3/4 export is `reconciled-csp-solver.tgz`, which is the Rust `py/` reconciliation, not a `web/api` change). The base is therefore the **live worktree tree** at `91bb8b0` cross-referenced against the **unlanded DI-skeleton prototype** in `pass2/api-error-taxonomy-stubs/*.py` and its governing spec, `pass1/fastapi-service.md` §3.

### 3.2 Current, measured baseline

```
$ find web/api/src -name "*.py"
src/app/__init__.py
src/app/api/__init__.py
src/app/api/main.py                    (40 L)
src/app/api/models/__init__.py
src/app/api/models/board.py            (37 L)
src/app/api/routes/__init__.py
src/app/api/routes/board.py            (149 L)   ← matches fastapi-service.md's own measured "149-line file"
src/app/api/routes/health.py           (10 L)

$ find web/api/tests -name "*.py"
tests/__init__.py, test_api.py (63 L), test_bench_compare.py (45 L), test_rust_backend.py (135 L)
```

Flat, layer-based (`routes/`, `models/`), single game only — Futoshiki has zero API surface today (no route, no model, no service; confirmed by absence, not by a stale doc claim). `Settings`/DI/split-executors/typed-error-envelope/service-layer do not exist in the live tree at all — they exist only as the Pass-2 prototype stub. `web/api/CLAUDE.md` still documents a `app/solver/` legacy package and `test_solver.py`/`test_stress.py`/`test_benchmarks.py` (107 tests, 6 files) that were deleted from the tree entirely by the same commit that fast-forwarded this worktree (confirmed via the merge diffstat in §0 — `backend/src/csp_solver/solver/*.py` and `backend/tests/test_{solver,stress,benchmarks}.py` all show as deletions). This is the exact staleness `fastapi-service.md` F8 flagged, now further aged; it's a precondition for any colocation move to land cleanly, called out here because it directly affects what "tests mirror" means in §3.5.

### 3.3 Decision: `games/{sudoku,futoshiki}/{router,service,models}.py` vs. flat `api/routes|models` — adopted, justified

**Adopted target:**

```
src/app/
├── main.py                       # app assembly only: lifespan, middleware, router mounts
├── core/
│   ├── settings.py                # Settings (BaseSettings), get_settings()
│   ├── executors.py               # Executors dataclass, get_executors()
│   ├── errors.py                  # ApiError/ApiErrorCode, register_error_handlers()
│   └── limiter.py                 # slowapi Limiter instance
├── games/
│   ├── sudoku/
│   │   ├── router.py              # thin HTTP-only APIRouter, prefix "/board"
│   │   ├── service.py             # SudokuService (solve/generate orchestration)
│   │   └── models.py              # BoardResponse, Difficulty, SolveRequest, SolveResponse
│   └── futoshiki/
│       ├── router.py               # NEW, W8-gated
│       ├── service.py              # NEW, W8-gated
│       └── models.py               # NEW, W8-gated
└── routes/
    ├── health.py                  # not per-game — stays flat
    └── config.py                  # not per-game — exposes Settings fields to the frontend
```

**Why this, not the flat `api/routes|models` split the Pass-2 prototype actually shipped:**

1. **The prototype itself already did a 3-way split per game (`routes/board.py` + `services/sudoku_service.py` + `models/board.py`) — the only open question is directory nesting, not file count.** Moving to `games/sudoku/{router,service,models}.py` is a 1:1 rename of three existing files into one directory, not new machinery. The "over-engineering" risk the assignment asks me to weigh against is therefore much smaller than it would be if this were inventing new indirection — it isn't; it's renaming files that already exist as one-per-concern.
2. **Futoshiki is a committed, ratified product wave (owner ratification, 2026-07-04), not speculative.** `games/futoshiki/` can be added without touching a single line inside `games/sudoku/` — the colocation boundary is exactly the seam W8 needs. Under the flat layout, W8 would instead add `routes/futoshiki.py` + `services/futoshiki_service.py` + `models/futoshiki.py` — three files added to three *different* directories, each requiring a new import line in three unrelated places, with nothing textually marking them as belonging to the same feature. The `games/` layout collapses that to "add one directory."
3. **This is the documented, widely-used idiomatic FastAPI expression at exactly this scale** — the community "domain package per feature" convention (`router.py`/`service.py`/`schemas.py` colocated per domain) is specifically recommended once an application has ≥2 non-trivial, independently-evolving feature domains, which is precisely Sudoku + Futoshiki. FastAPI's own official tutorial structure (`routers/` as a flat layer) is aimed at APIs with many *thin*, largely-independent routers sharing one data model — not this app's shape, where each game owns its own request/response schema and its own orchestration logic end-to-end.
4. **Cross-stack symmetry** — the frontend is explicitly named in this same edict as `src/games/{sudoku,futoshiki}` (`@games/*` alias, decoupled from `src/pencil`). Naming the backend's per-game trees identically (`games/{sudoku,futoshiki}/`) is a direct, low-cost payoff for a codebase whose owner has stated a preference for isomorphism between parallel structures elsewhere in this repo (root `CLAUDE.md`/`README.md`).
5. **Counter-argument, stated honestly, not hidden**: this reshuffle is real churn — every import in `main.py`, `tests/`, and the Docker `COPY`/wheel-packaging path that currently reaches `app.api.routes.board`/`app.api.models.board`/`app.services.sudoku_service` needs updating, and it means re-diffing the already-written `api-error-taxonomy-stubs` prototype (which chose the flat shape) before it lands rather than applying it as-is. At exactly 2 games with ~150–250 lines of service code each, a reasonable adjacent-agent-in-a-hurry could ship the flat version with zero functional loss. This manifest's call is that the edict is explicit and binding ("recursive colocation for ALL dirs") and the concrete, ratified Futoshiki wave makes the colocation payoff immediate rather than speculative — but it is marked **contestable** (§5) precisely because the counter-argument is real, not because the reasoning above is shaky.

`health.py` and the prototype's `config.py` (exposes `solver_timeout_s` etc. to the frontend, per `api-surface-consistency.md`'s B3 finding about client/server timeout drift) are correctly **not** under `games/` — neither is puzzle-specific, both are true cross-cutting/global concerns, matching the edict's own "only module/global-level items in shared dirs" clause.

### 3.4 `settings`/`errors`/`executors` placement — already correct, no change

The Pass-2 prototype's `app/core/{settings,executors,errors,limiter}.py` is exactly the edict's shared/global-level exception, already correctly shaped before the edict was even issued (dated one day after the prototype). No colocation change needed here; the only open item is that it doesn't exist in the live tree yet — landing it is a `fastapi-service.md` §3 implementation task, not a colocation-manifest correction.

One placement note the prototype leaves implicit: `Settings.data_dir` (`Path(__file__).resolve().parent.parent / "data"`, i.e. `app/data/`) is the **interim** shape only. Once the Rust data-embedding end-state (§2.5) lands, `data_dir` and the file-glob loader it backs are deleted from `SudokuService` entirely — `games/sudoku/service.py` then only calls `csp_solver.create_random_board(...)`, which owns its own data internally. This manifest records both states explicitly so a future agent doesn't colocate Python-side puzzle data under `games/sudoku/data/` only to delete it the moment the Rust move lands.

### 3.5 Tests mirror

Current: 3 flat files, 21 tests total (`test_api.py`, `test_bench_compare.py`, `test_rust_backend.py`), none of them exercising DI, the error taxonomy, the split executors, or per-game services — because none of that exists in the live tree yet. Recommended mirror, proportionate to this test count (not a deep subdirectory tree — that would itself be the over-engineering the assignment asks to guard against, at ~20–40 tests total post-W3/W8):

```
tests/
├── test_sudoku_router.py       # HTTP-shape only (status codes, request/response validation)
├── test_sudoku_service.py      # orchestration logic, mocked csp_solver calls where useful
├── test_futoshiki_router.py    # NEW, W8
├── test_futoshiki_service.py   # NEW, W8
├── test_core_errors.py         # error-envelope/taxonomy smoke (7 codes, fault-injected — per synthesis-pass3 W3 gate)
├── test_core_settings.py       # CORS comma-split validator, override-via-dependency_overrides
├── test_rust_backend.py        # unchanged — exercises csp_solver directly, not an app/ concern
└── test_bench_compare.py       # unchanged — cross-language parity, not an app/ concern
```

Flat, file-per-concern, **named** to mirror `games/{name}/` and `core/` without nesting `tests/games/sudoku/` — matches the "flat-but-named" call already made for the Rust `constraint/` tests-of-record question (§2.4) for the same reason: test count doesn't yet justify directory-level mirroring. Revisit if either game's test file exceeds ~10 files on its own (the same "one, two, many" threshold applied to the `games/` decision itself in §3.3).

### 3.6 Full old → new manifest, Python

| Old path | New path | Disposition |
|---|---|---|
| `src/app/api/main.py` | `src/app/main.py` | **MOVE** + rewritten for DI/lifespan (per prototype) |
| `src/app/api/routes/board.py` (149 L) | `src/app/games/sudoku/router.py` | **MOVE + shrink** (thin HTTP layer only) |
| `src/app/api/models/board.py` (37 L) | `src/app/games/sudoku/models.py` | **MOVE** |
| — | `src/app/games/sudoku/service.py` | **NEW** (carved out of the old `routes/board.py`'s domain logic — `_has_conflicts` deleted per F5/F9, not ported) |
| `src/app/api/routes/health.py` | `src/app/routes/health.py` | **MOVE**, stays flat (cross-cutting) |
| — | `src/app/routes/config.py` | **NEW** (settings-exposure route, per prototype) |
| — | `src/app/core/{settings,executors,errors,limiter}.py` | **NEW** (per prototype, unchanged shape) |
| — | `src/app/games/futoshiki/{router,service,models}.py` | **NEW**, W8-gated |
| `tests/test_api.py` | split across `test_sudoku_router.py`/`test_core_errors.py` | **SPLIT** |
| `tests/test_bench_compare.py`, `test_rust_backend.py` | unchanged | **UNCHANGED** |
| `web/api/CLAUDE.md` | rewritten | doc-rot fix, prerequisite (§3.2), not itself a colocation item |
| `web/api/src/app/data/{sudoku_puzzles,sudoku_solutions}` | deleted from the Python package (moves to `csp-solver/data/`, §2.5) | **MOVE** (cross-language, tracked in the Rust manifest, not duplicated here) |

---

## 4. Repo-wide flat-dir census

| Directory | Files | Total lines | Verdict |
|---|---|---|---|
| top-level `scripts/` | 2 (`dev.sh`, `deploy.sh`) | 105 | **KEEP flat** — cross-cutting stack orchestration, nowhere near "long-running" |
| `csp-solver/scripts/` | 1 (`bench-compare.sh`) | 47 | **KEEP flat** — already correctly scoped/colocated with the crate it serves (a positive example, not a gap) |
| `docs/` | 6 (`algorithms.md`, `bbnf-integration.md`, `benchmarks.md`, `grand-audit-2026-06-02.md`, `optimizations.md`, `sudoku.md`) | 541 | **KEEP flat** — topically distinct, module/global-level documentation (algorithms, integration notes, benchmarks), none over 118 lines. This is exactly the "module/global-level items in shared dirs" exception, correctly already flat |
| `web/api/src/app/data/{sudoku_puzzles,sudoku_solutions}` | 249 JSON files | n/a (1.1 MB) | **Not a flat-dir problem** — already hierarchically partitioned by size×difficulty (`{N}/{difficulty}/template-*.json`); the defect here is *ownership* (Python package housing puzzle-domain content, F13), already fully covered as the Rust data-embedding item (§2.5), not a "break into modules" item — there is no module structure to apply to JSON fixtures beyond the partitioning it already has |
| `csp-solver/examples/`, `csp-solver/benches/` | 3 + 6 = 9 | 1,649 | **KEEP flat** — one file per Cargo target is a structural requirement, not an organizational choice (§2.11) |
| `csp-solver/tests/` | 14 | 4,987 | **KEEP as a directory** (only 14 entries — not "long-running" by count); two individual **files** are oversized (`solver.rs` 1555 L, `lattice.rs` 944 L) — flagged in §2.4 as proportionate future cleanup via Cargo's `tests/<name>/main.rs` submodule convention, not blocking |

No repo-wide directory qualifies as "long-running flat" in the sense the edict targets (many files, unrelated content, accumulating over time without a partitioning principle). The one real ownership defect (`web/api/src/app/data/`) is a language-boundary problem already tracked in the Rust manifest, not a repo-wide flat-dir problem needing a break-up verdict of its own.

---

## 5. Self-attack — contestables, ranked by how much I'd bet against myself

1. **Highest**: §3.3's `games/{sudoku,futoshiki}/` verdict. The counter-argument is real and stated in the same section — at N=2 with ~150–250 lines of service code per game, a defensible reviewer ships the flat layout and calls the directory nesting bikeshedding. I adopted colocation because the edict is explicit and binding and the churn cost is a rename, not new machinery — but if the owner's actual intent behind "recursive colocation for ALL dirs" was aimed at the *frontend's* component sprawl (the concrete pain point named in the edict) and not meant to force a backend reshuffle at this scale, this section over-reads the mandate.
2. **`gac_alldiff{,_except}.rs` "zero production callers" claim** (§2.3). I traced every call site with `grep -rn` across the whole crate and found only `tests/` callers — but I did not read `tests/gac.rs`/`tests/gac_alldiff_except.rs` in full to confirm the differential-oracle hypothesis (vs. these simply being genuinely dead code nobody has pruned). The recommendation (move + document, don't delete) is deliberately conservative against that uncertainty; if it turns out there's no actual differential assertion comparing the two paths' outputs, the S4-style "delete" verdict may be more honest than the "keep as documented oracle" one I gave.
3. **`config.rs` vs `csp/solve.rs` for `Unsatisfiable`** (§2.2) — explicitly flagged as a coin-flip in the table itself; I have a mild preference (colocate with its sole consumer) but no strong evidence either placement is wrong.
4. **Cargo `tests/<name>/main.rs` submodule recommendation** (§2.4, §2.11) — I did not build a proof-of-concept to confirm this doesn't silently change `cargo test --workspace`'s parallelism/output shape in a way `rust-composition`'s "gate between every step" rule would care about; flagged as proportionate-not-blocking specifically because I haven't verified it end-to-end.
5. **Lowest — I'd defend this one**: the `wasm/src/sudoku.rs` split (§2.7). This isn't a judgment call; `option-c-readiness`'s own prose already refers to a file by that name that doesn't yet exist at that path, so this manifest is just making the split the critique already assumed happen.

---

## 6. Convergence

This beat is a **manifest/spec deliverable**, not a code change — consistent with every upstream pass1–4 report it builds on (`rust-search-core.md`, `fastapi-service.md`, `rust-owned-puzzle-data.md` are all audit documents, none applied). No source files in `csp-solver/` or `web/api/` were modified by this beat; the only tree mutation was the worktree fast-forward in §0 (a defect fix, not manifest content). Every claim above traces to a command in §7 or a specific line range read directly — no claim rests on the upstream `.md` prose alone without an independent measurement against either the composed export or the live tree.

Residual gaps in *this* deliverable, stated honestly: (a) the `games/` vs. flat verdict (§3.3) is a judgment call under genuine tension, correctly flagged rather than smoothed over; (b) the `gac_alldiff` oracle hypothesis (§2.3) is inferred from doc-comments and call-graph shape, not confirmed by reading the differential assertion itself; (c) this manifest does not re-verify that R1 (kernel-soundness-closure) or R2 (constraint-trait-bound-spike) — the two items barring `readyToAuthor` in `synthesis-pass3.md` §4 — are closed; it takes the composed export's existence as sufficient evidence blocker-1 ran, per the routing instruction, without independently re-deriving that beat's verdict.

---

## 7. Evidence log (representative commands, all read-only against tracked state or the extracted tarball)

```bash
# worktree staleness
git log -1 && git merge-base HEAD 91bb8b0 && git branch --contains 91bb8b0
git merge --ff-only master

# composed Rust export
tar tzf pass4/composed-csp-solver-v2.tgz | grep -c 'src/.*\.rs$'
tar xzf pass4/composed-csp-solver-v2.tgz -C pass4/extract-v2

# lib.rs decomposition sizing
grep -n "^pub struct\|^pub enum\|^pub fn\|^impl\|^mod \|^pub mod" csp-solver/src/lib.rs
grep -n "^    pub fn \|^impl<D" csp-solver/src/lib.rs

# solver/ post-kernel shape
wc -l csp-solver/src/solver/*.rs csp-solver/src/solver/gac/*.rs | sort -n
cat csp-solver/src/solver/mod.rs

# gac_alldiff caller trace
grep -rn "propagate_gac_alldiff\b" csp-solver/
grep -n "propagate_gac_core\|propagate_gac_alldiff" csp-solver/src/constraint/all_different.rs
grep -n "gac" csp-solver/src/constraint/all_different_except.rs

# constraint/ + tests-of-record
wc -l csp-solver/src/constraint/*.rs
grep -rn "#\[cfg(test)\]\|mod tests" csp-solver/src/
for f in csp-solver/tests/*.rs; do grep -o "AllDifferent[A-Za-z]*\|NotEqual\|..." "$f"; done

# puzzles/ + data-embedding
wc -l csp-solver/src/puzzles/sudoku/*.rs csp-solver/src/puzzles/futoshiki/*.rs
find csp-solver/data -maxdepth 3   # not found, live tree
grep -rn "sudoku_puzzles\|sudoku_solutions" web/api/src --include="*.py" | grep -v test

# py/ split confirmation
wc -l csp-solver/src/py.rs   # live, pre-split, 405 L
wc -l pass4/extract-v2/csp-solver/src/py/*.rs   # composed, 716 L across 6 files

# wasm/ isomorphic.rs symbol inventory
wc -l csp-solver/wasm/src/*.rs
grep -n "^pub struct\|^struct \|^pub fn\|^#\[wasm_bindgen\]" csp-solver/wasm/src/isomorphic.rs

# morph excision status
cat Cargo.toml   # workspace members still include morph-core, wasm-morph — not yet excised

# Python baseline
find web/api/src -name "*.py"; wc -l web/api/src/app/api/main.py web/api/src/app/api/models/board.py \
  web/api/src/app/api/routes/board.py web/api/src/app/api/routes/health.py
find web/api/tests -name "*.py"; wc -l web/api/tests/*.py
cat web/api/pyproject.toml | grep name; cat csp-solver/pyproject.toml | grep name

# doc-rot corroboration
wc -l web/api/CLAUDE.md
grep -n "solver/\|test_solver\|test_stress\|test_benchmarks\|107" web/api/CLAUDE.md

# repo-wide flat-dir census
wc -l docs/*.md
wc -l scripts/*.sh csp-solver/scripts/*.sh
find web/api/src/app/data -maxdepth 2 -type d; find web/api/src/app/data -name "*.json" | wc -l
```
