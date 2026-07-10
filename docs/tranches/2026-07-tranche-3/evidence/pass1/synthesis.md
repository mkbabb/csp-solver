# Tranche-III Pass-1 Synthesis — Encapsulation + Modularization Spec

Synthesized from R1–R8 (`scratchpad/tranche3/pass1/R{1..8}-*.md`). Every decision carries its
evidence chain back to a lane report (which carries `file:line` / URL); two cross-lane conflicts
were resolved by direct re-verification this pass (§0). This is a specification and plan — no
implementation. Prototypes run in their own worktrees; the main tree hosts a live closing wave.

---

## 0. Cross-lane conflicts, resolved by fresh evidence

**C-α — isomorphic.rs "kept for bbnf-buddy" (R7) vs "zero consumers" (R3, R6).**
The tranche-2 record (`W6-deploy-c.md:13-14`, `A-excision-ledger.md:63`, per R7 §5-N5) says the
mirror stays "for bbnf-buddy's `solveAssignmentCop`." Re-verified this pass:
`solveAssignmentCop` is defined in `wasm/src/assignment.rs:125-126` under the **`assignment`**
feature (`wasm/Cargo.toml:35,40`), not in `isomorphic.rs` under **`full-mirror`**
(`Cargo.toml:34,39`). The record conflated two independent features. R3/R6's zero-consumer
verdict for `isomorphic.rs` stands unrebutted: no frontend import (R3 §3 — workers import only
`solveSudoku`/`solveFutoshiki`), no wasm test (R3 §3 — `dualization.rs` tests assignment,
`futoshiki_parity.rs` imports the parent crate), no shipped bytes (R3 §3 — the committed lean
`pkg/` d.ts has no `class Csp`), and **proven drift** from the core it claims to mirror (R6 §C.2:
`SolveStats` missing `cancelled` vs `config.rs:120`; `SolveConfig` hard-codes `cancel: None` at
`isomorphic.rs:256` vs `config.rs:85`; defaults documented as FC+Chronological at
`isomorphic.rs:174-187` vs the core's Ac3+FailFirst at `config.rs:95-96`).

**C-β — `ImplicationConstraint` "zero consumer, demote" (R6 §A3) vs "bbnf imports it" (R2 §3).**
Re-verified this pass: bbnf-lang constructs it live —
`bbnf-lang/crates/ir/src/passes/csp_strategy/constraints/engine.rs:86`
(`use csp_solver::constraint::{ImplicationConstraint, VarId}`) and `:170`
(`csp.add_constraint(ImplicationConstraint::new(...))`), outside the vendored copy. R2 wins.
Disposition: **KEEP `pub`, add an in-repo test** (it is currently untested public surface, R6 §A3).

---

## 1. Decisions

### 1.1 `py/futoshiki_api.rs` — REMOVE (owner ratification requested, §4-Q2)

Consumer truth is total: zero tests-py references (R4 §3 — `grep -rl futoshiki tests-py/` empty),
zero bbnf calls (R2 §3 — bbnf's gate is compile-only, `sync-csp-solver-vendor.sh:211-256`), no
FastAPI (excised T2-W2), product Futoshiki rides `wasm/src/futoshiki.rs` not the wheel (R4 §1).
234 LOC compiled-but-uninvoked; zero parity coupling (not in `SIBLING_DEFINITIONS`, R4 §4);
revivable byte-for-byte from git. "Comprehensive for a hypothetical `pip install`" has no basis —
the wheel is not published to PyPI (artifacts table: crates.io + npm only). Blast radius: 0 test
deaths, one `mod.rs` re-export prune, bbnf gate goes green via `--update` (R4 §6-A).

### 1.2 `py/sudoku_api.rs` — KEEP, PRUNE, RENAME; no directory split

**Not deprecated** — 20 expanded tests-py tests depend on it (R4 §3) and it's a registered
pymodule surface (`py/mod.rs:47-50,62-69`, R6 §E). **No split into `py/sudoku/`**: it is 338 LOC,
under the dir's own 500-line budget (`py/mod.rs:14`), and after pruning the caller-dead entries —
`solve_sudoku_board` (`:200`), `template_count` (`:336`), the `backtracks()` alias, the
`budget_exceeded`/`cancelled` getters (all zero-caller per R2 §4) — plus the `py/common.rs`
extraction (§1.4) it lands near ~200 LOC. A subdir for one cohesive file is over-decomposition
(R6 §E concurs). This **confirms** T2-W8 Lane B's "no break earned" verdict (R7 §5) with fresh
evidence rather than overturning it. What DOES change: **rename `sudoku_api.rs → py/sudoku.rs`**,
dropping the `_api` suffix that existed only to disambiguate the flat-dir collision with the
now-removed futoshiki twin (R6 §E). Mandatory paired edit: `difficulty_parity.rs:135-140`
SIBLING_DEFINITIONS path retarget — both parity tests fail by construction otherwise (R4 §4,
R2 §7); the `:47` header already records precedent for exactly this retarget.

Also pruned crate-wide in the same wave: `Csp::{add_equals, add_less_than, add_greater_than,
solve_with_given, propagate_with}`, `PropagationStrategy` (sole use is the dead `propagate_with`),
and the `CspError::to_pyerr` `Timeout` arm (`errors.rs:59` — `CspError::Timeout` has zero
constructor sites, R2 §4). The `CspTimeoutError` **class** stays exported pending §4-Q6.

### 1.3 `wasm/src/isomorphic.rs` — EXCISE, with the `full-mirror` feature

Per §0-C-α. Delete the file, delete `full-mirror` (`default = ["assignment"]`), drop the
`lib.rs:30-31,39-40` cfg lines. serde stays (also enabled by `assignment`, `Cargo.toml:40`) — no
lockfile churn. Lean 93 KB band byte-identical (isomorphic never enters that compile, R3 §5);
full-module band shrinks under its 240 KB gate. `assignment.rs` is explicitly NOT in scope — it
has a test, a documented consumer, and a keep mandate (`morph-excision-spec.md §4`, R3 §6-A).
Docs to co-edit: `wasm/README.md:18,76,106`, `lib.rs:16-19`, `Cargo.toml:6` description ("isomorphic
mirror" is the package description), CHANGELOG. The stale "mirror of `py.rs`" doc-comments
(6 occurrences, stale since the W1 `py/` split — R7 §5-N5 new finding) die with the file.

### 1.4 py/ vs the July-2026 SOTA — adopt/reject per convention

R1's scored table (42/55) localizes every deficit to packaging, not code. Dispositions:

| Convention | Verdict | Reason |
|---|---|---|
| pyproject version sync 0.3.0 + metadata (urls/description/classifiers) | **ADOPT, unconditional** | It's a live packaging bug — maturin stamps a 0.2.0 wheel against a 0.3.0 crate (`pyproject.toml:7` vs `Cargo.toml:3`, R1 defect 1). Trivial. |
| `.pyi` type stubs | **ADOPT, path gated by P3** | The single largest SOTA deficit (R1 defect 2). But the consumer set is tests-py + editors only, and the post-prune surface is ~20 symbols — a hand-written `csp_solver.pyi` may beat the full pyo3-stub-gen mixed-layout churn (`python-source` + `csp_solver._internal` rename, R1 §1.5). Prototype P3 picks the path. |
| abi3 (+ abi3t plan) | **ADOPT abi3 at py310; DEFER abi3t** | Crate uses only stable-API surface (R1 defect 3); collapses the wheel matrix. abi3t waits on an actual free-threaded consumer — the wheel isn't even on PyPI (§4-Q4). |
| `csp_solver.sudoku` submodule namespacing (native `#[pymodule(submodule)]` + `__init__.py` shim) | **REJECT** | R1's own trigger is "once a domain grows past a handful of symbols"; post-§1.1/§1.2 there is ONE domain (~8 sudoku symbols) in a ~15-symbol module. Polars — R1's own reference — keeps the compiled surface flat (R1 §1.5). The shim + mixed layout is machinery without a consumer. Revisit only if P3's stub path forces mixed layout anyway. |
| Declarative `#[pymodule]` migration | **REJECT for now** | Procedural form is fully supported and what large production crates ship (R1 §1.1); the auto-`__module__` benefit matters chiefly for submodules, which we rejected. Not worth churn in a live surface. |
| `py/common.rs` extraction | **ADOPT** | The 4× solutions-marshalling, the triplicated config literal, the position-parse loop, and the budget contract (R2 §5) collapse to three helpers. With futoshiki gone the duplication count halves, but the marshalling is still repeated in `csp.rs:88-95` + `sudoku` twice — a real seam, not speculative. |
| PascalCase/snake_case/UPPER_CASE naming | **ALREADY SOTA** | R1 table rows scored 5/5; no action. |
| R15 `optimization_mode` on the py wire | **KEEP OFF** | Deliberate, self-documented (`py/config.rs:59-70`, R7 §5-R15); zero py-side callers want it. Adding surface to a caller-less wire contradicts the whole tranche. |

### 1.5 FE — what "re-structured" means concretely (beyond W8)

W8's game/*/solver colocation is genuinely clean (R5 §4); the remaining drift is scene-level and
composable-level. Accepted rows, in R5's priority order:

1. **Extract `games/sudoku/SudokuGame.vue`** (R5 D1). App.vue is a god-file: shell + `?game=`
   selector + the entire Sudoku scene (`App.vue:65,77-132,170-251`) while Futoshiki has a
   self-contained `FutoshikiGame.vue`. Restores game symmetry; App.vue drops to a pure shell.
2. **De-twin the peek/scene wiring** (R5 D2) — extract `useAnswerKeyPeek(...)` + shared scene CSS
   from the near-verbatim `App.vue:81-132` ≡ `FutoshikiGame.vue:27-83` duplication (the code
   self-labels the twin at `FutoshikiGame.vue:53`). Largest FE de-dup.
3. **Break the god-composables** (R5 L1): `useSudoku.ts` (482) / `useFutoshiki.ts` (472) each
   bundle undo/redo, peek+hint, and debounced pencil-marks machines that are byte-parallel twins
   across games — extract shared `useUndoHistory(applyValue)` and `usePencilMarks(propagateFn, …)`.
4. **One shared-composables home** (R5 D5): today `src/composables/` holds exactly one file while
   `pencil/composables/` holds two other cross-cutting true-globals — same category, two dirs, no
   rule. Consolidate under `src/composables/` (canonical: pencil is the aesthetic layer, not the
   shared-logic home); `pencil/composables/` keeps only pencil-internal composables. §4-Q7.
5. **Post-excision hygiene** (R5 D3+D4): rename both `solver/apiError.ts` (zero API references
   in the file; a FastAPI fossil, W8 itself flagged the rename as optional —
   `T2-W8-manifest.md:171`, R7 §1) → `classifyError.ts`; hoist the byte-identical
   `toBase64Url`/`fromBase64Url` (`useUrlState.ts:73-81` both games) to `src/lib/base64url.ts` —
   the one justified cross-game shared primitive (R5 D4).
6. **`pencil/index.ts` barrel + deep-import lint** (R8 G10/G11 light form): 11 deep pencil import
   sites today; add the barrel and a `no-restricted-imports` depth rule. NOT the full
   `packages/ui` extraction (§1.7).
7. **`pencil/chrome/` regroup** (R5 L3): `icons/` (DiceIcon+SolveIcon, both consumed by both
   ControlPanels) and a `pencil/filters/` home reuniting `SvgFilters.vue` with `dev/FilterTuner.vue`
   + `rafInstrumentation` — the two halves of one filter subsystem currently split across dirs.
8. **`index.css` partial split** (R5 L2) — gated by prototype P6, because the C1/C2 `@layer`
   extraction HOLD is live (`C-deferred-foldin.md:108`, rules unmoved at `index.css:271-291,352`,
   R7 §2). An `@import` partial split keeps rules in the same global sheet/layer — plausibly
   hold-compatible, but the hold demands a cascade proof; P6 supplies it or the row stays HELD.
9. Polish: `pencil/types.ts` 1-liner rehomed (R5 D6), `pencil/README.md` (D7), glyph-dir
   consistency (L4, optional).

### 1.6 BE encapsulation rows

1. **Demote 9 solver leaks + `adjacency` to `pub(crate)`** (R6 A1/A2): `BitsetWorklist`,
   `propagate_monotonic`, `propagate_stratified`, `PropResult`, `SearchParams`, `PERMANENT_DEPTH`,
   `ZeroCost`, `CostDomainEval`, `GAC_CORE_CALLS`, plus the `adjacency` module + `Csp::adjacency()`
   — all zero-external-consumer by grep, tightening the 0.3.0→0.4.0 semver surface. Precedent:
   `bitscan` is already correctly `pub(crate)` (R6 A4). Gated by prototype P5 (bbnf compile sweep).
2. **Relocate `adjacency.rs` → `solver/adjacency.rs`** (R6 B) in the same change — built by
   `finalize`, read only by `solver/{ac3,search}`. `bitscan.rs` relocation is optional tidiness.
3. **Extract `wasm/src/errors.rs`** (R6 D): futoshiki reaches into sudoku for `coded_error`
   (`futoshiki.rs:37`, 6 call sites) — a cross-game back-dependency owned by neither; and the core
   `error.rs:19` doc references a `wasm/src/errors.rs` that has never existed. One extraction
   closes both.
4. **`ImplicationConstraint`: keep pub + add a test** (§0-C-β).
5. **Re-litigate the two at/over-budget solver files** (R7 §5-R3): `gac/mod.rs` is 555 LOC and
   *grew* from the 470 flagged in tranche-1 — split along the existing `matching.rs` seam (e.g.
   extract the Tarjan SCC half). `search.rs` (504) gets a recorded single-reason-to-change waiver
   unless the critique pass objects — the unified kernel is one concept (§4-Q8).
6. **Hygiene fold-ins** (R7): delete the 2 stale examples (`probe_futoshiki_gen.rs`,
   `parity_probe.rs` — flagged at W8, still present); add the 4 missing `//! Tests:` doc pointers
   (`cost_finite.rs`, `solver/optimize.rs`, `solver/gac/`, a `puzzles/` pointer to
   `difficulty_parity.rs`); `.env.example` residual docker keys (`BACKEND_PORT`/`VITE_API_URL`)
   against the server excision. The dead `java` branch and 46 stale worktrees stay owner-gated
   (never a wave deliverable, per the L19 precedent).

### 1.7 REJECTED as overengineering (the KISS bar)

- **`py/sudoku/` directory split** — under budget, one cohesive concern post-prune (§1.2; R6 §E:
  "over-decomposition at this size"). The T2-W8 "no break earned" verdict re-confirmed.
- **`py/puzzles/{sudoku,futoshiki}/` symmetric reshape** (R6 §E's proposal) — moot once futoshiki
  is removed; a `puzzles/` layer over one file is path depth without cohesion gain.
- **`csp_solver.sudoku` Python namespacing + mixed layout** — machinery without a consumer
  (§1.4); the compiled surface stays flat per the Polars reference model.
- **`constraint/` family subdirs** — 2-file "family," already split along the real seam
  (structural half in `constraint/`, GAC engine in `solver/gac/` — R6 §F).
- **`mod.rs` → self-named-module rename sweep** (R8 G1, 11 files) — valid house-style, zero
  encapsulation gain, git-history noise across the whole crate during an active campaign. Offer
  to the owner as a separate one-commit mechanical follow-up with the
  `clippy.self_named_module_files` lint; not a tranche-III wave row (§4-Q5).
- **Full `packages/pencil` monorepo extraction** (R8 G10 heavy form / G12) — one deployed SPA;
  FSD's apps/packages split is for multi-app repos by its own framing. The barrel + lint (§1.5.6)
  captures the encapsulation value at ~5% of the cost.
- **`pencilConfig.ts` split** (R5 L5) — a single config hub is a deliberate, documented pattern.
- **wasm `isomorphic` drift-assertion test** (R6 §C fallback) — superseded by excision.

---

## 2. Wave skeleton

Dependencies flow downward; W-A/W-B/W-C are independently landable after their prototypes.

- **W-A — py packaging truth** (no structural change; lands first, unblocks everything py):
  pyproject 0.3.0 sync + metadata enrichment + abi3 feature. Gate: fresh wheel builds, tests-py
  green against it (the current `.venv` wheel is stale 0.2.0 — R4 §3 note). Feeds P3.
- **W-B — dead-surface excision** (gated by P1 + P2): `isomorphic.rs` + `full-mirror` (§1.3);
  `futoshiki_api.rs` + dead py symbols + `PropagationStrategy` + `Timeout` arm (§1.1, §1.2);
  stale examples. Co-edits: wasm README/lib doc, `mod.rs` re-exports, CHANGELOG.
- **W-C — BE encapsulation** (gated by P5): pub(crate) demotions + adjacency relocation;
  `wasm/src/errors.rs` extraction; `ImplicationConstraint` test; `gac/mod.rs` split +
  `search.rs` waiver record; `//! Tests:` pointers. Semver: with W-B this is the 0.4.0 surface.
- **W-D — py reshape** (after W-B; small): `sudoku_api.rs → py/sudoku.rs` rename +
  `difficulty_parity.rs:139` retarget (same commit); `py/common.rs` extraction; stub shipping per
  P3's chosen path.
- **W-E — FE scene symmetry** (gated by P4): `SudokuGame.vue` extraction; `useAnswerKeyPeek`
  de-twin + shared scene CSS. Zero-behavior-change bar: e2e + screenshot parity.
- **W-F — FE module hygiene** (after W-E; P6 gates only the index.css row): god-composable breaks
  (`useUndoHistory`, `usePencilMarks`); shared-home consolidation; `apiError` rename; base64url
  hoist; pencil barrel + deep-import lint; chrome `icons/`/`filters/` regroup; index.css partials
  (or record HELD-again); types/README polish.
- **W-G — docs + record**: READMEs, `docs/` updates, CHANGELOGs, deferral ledger, gate re-runs
  (CI lanes, twiggy bands, bbnf `--update && --verify`).

---

## 3. Prototype charters (fan-out verbatim; see structured output)

P1 isomorphic-excision blast radius · P2 py dead-surface prune blast radius · P3 stub-shipping
path spike · P4 SudokuGame extraction + peek de-twin probe · P5 pub-surface tightening sweep ·
P6 index.css partial split under the C1/C2 hold. All mutate → all need worktrees.

---

## 4. Open questions for the critique pass

- **Q1** — Does ANY external consumer build `@mkbabb/csp-solver-wasm` with default features and
  import the isomorphic surface? The committed `pkg/` is the lean build (no `class Csp` in its
  d.ts, R3 §3), but confirm the *published npm 0.2.0* tarball matches the lean artifact before
  W-B lands; if npm shipped the full module, excision is a breaking npm change needing a bump.
- **Q2** — Owner ratification: removing `futoshiki_api.rs` deletes published-crate (`py`-gated)
  surface. Ride it on the 0.4.0 bump with W-C's demotions, or does the owner want py-Futoshiki
  kept-and-tested instead (the rejected alternative, R4 §6-B)?
- **Q3** — P3's fork: hand-written `csp_solver.pyi` (pure-Rust layout) vs pyo3-stub-gen (mixed
  layout, `csp_solver._internal` rename). If the gen path forces mixed layout anyway, does that
  reopen the §1.4 namespacing rejection?
- **Q4** — Is there any intent to publish the wheel to PyPI? If never, abi3's wheel-matrix value
  is CI-only — still worth it, but the abi3t/free-threaded plan row should be dropped entirely.
- **Q5** — `mod.rs` → self-named modules: does the owner want the mechanical follow-up commit
  (with the clippy lint) despite the rejection here?
- **Q6** — `CspTimeoutError` + the dead `Timeout` arm: the class is exported and documented but
  unconstructable from Rust (zero `CspError::Timeout` constructor sites, R2 §4). Remove the class
  (surface honesty) or keep it as reserved taxonomy? Frontend error-fiction codes don't consume
  it (the wasm wire has its own coded errors), but confirm no doc contract names it.
- **Q7** — Shared-composables canonical home: `src/composables/` (proposed) vs
  `pencil/composables/` — does the pencil-is-aesthetic-only framing survive `celebration.ts`,
  which is arguably pencil-domain?
- **Q8** — `search.rs` at 504: accept the single-reason-to-change waiver, or does the critique
  pass see a seam (e.g. the B&B half, `search.rs:444`) worth a split alongside `gac/mod.rs`?
- **Q9** — Does the C1/C2 hold's lifting condition ("a cascade-layer proof or a visual-diff
  pass") accept P6's computed-style diff as the proof, and who signs off — the same owner gate
  that placed the hold?
