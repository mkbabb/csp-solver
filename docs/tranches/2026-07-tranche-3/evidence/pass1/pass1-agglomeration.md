# PASS-1 AGGLOMERATION — tranche-III encapsulation/modularization

**Lane:** pass1-agglomeration (core design model) · **Closes:** PASS 1
**Inputs:** `synthesis.md`, R1–R8, protos P1–P6, critiques crit-{spec-coherence, P1..P6} — all in
`scratchpad/tranche3/pass1/`. Convergence inputs: spec 60 · P1 77 · P2 56 · P3 70 · P4 74 · P5 60 · P6 52.
**Posture:** honesty over momentum. Nothing below is marked 100 unless the critique pass confirmed it or
this lane re-derived it fresh.

---

## 0. Agglomeration-pass resolutions (fresh evidence this lane)

**A0-1 — crit-P2's "bbnf-lang is not present on this machine" is REFUTED.** Verified this pass:
`/Users/mkbabb/Programming/bbnf-lang` exists, `scripts/sync-csp-solver-vendor.sh` exists, and the cited
consumer lines are live (`bbnf-lang/crates/ir/src/passes/csp_strategy/constraints/engine.rs:86`
`use csp_solver::constraint::{ImplicationConstraint, VarId}`; `:170`
`csp.add_constraint(ImplicationConstraint::new(...))`). crit-spec-coherence and proto-P5 both ran full
sweeps against it. Consequence: the "bbnf consumer-truth UNVERIFIABLE locally" halves of crit-P2's kills
#1 and #4 are downgraded — the census IS locally verifiable and P5's critique independently ran it clean.
What survives of those kills: bbnf gate greenness is still **conditional on `--update` re-vendor**
(true against the current pin the gate would fail on drift), and "no external caller beyond tests-py +
bbnf" still rests on the unproven not-on-PyPI premise (crit-spec C3). Adjusted P2 effective convergence:
**~62** (restores 6 of the −8).

**A0-2 — inter-critique consistency check: no other conflicts.** P1's crit and P5's crit both touch the
CI wasm lane and agree (`ci.yml:236,287,296-300,305`); P3's crit and crit-spec agree on the
pyproject 0.2.0-vs-0.3.0 bug; P4 and P6 agree the C1/C2 hold is sidestepped vs. proof-substituted
respectively (different moves — `<style scoped src>` never enters the global cascade; the `@import`
split does and needs the byte-identity proof). Coherent.

---

## 1. THE PASS-1 SETTLED SET — decisions at 100, final shape

Each item is author-ready as stated here (critique corrections folded in). Citations inherit from the
named lane reports, which carry file:line.

### S1 — `wasm/src/isomorphic.rs` + `full-mirror`: EXCISE (mandate question answered: not needed)
C-α resolved and triple-confirmed (synthesis §0, P1, crit-P1 C1/C2): zero internal-module, zero test,
zero shipped-artifact consumers; the tranche-2 record's "kept for bbnf-buddy's `solveAssignmentCop`"
conflated two features — that symbol lives in `assignment.rs:126` under `assignment`, not `full-mirror`
(`wasm/Cargo.toml:39-40`); proven drift from the core it claims to mirror (`isomorphic.rs:186-187,256`
vs `config.rs:95-96,118`). **Final shape:** delete the file; `default = ["assignment"]`; drop the
`lib.rs:30-31,39-40` cfg lines; `assignment.rs` strictly untouched; serde stays via `assignment` (no
lockfile churn). Co-edit list = the charter five PLUS `wasm/Cargo.toml:34` stale comment,
`wasm/src/sudoku.rs:13,32-33,44` dangling contrasts, `csp-solver/README.md:53`, `csp-solver/src/error.rs:11`,
CHANGELOG entries, **and `ci.yml:243` + `ci.yml:302-303`** (crit-P1 C7 — the "superset" claim died;
this list is the corrected one). W-B must **rebuild the file:-linked `pkg/`** (gitignored, consumed via
`web/frontend/package.json:19`) and **re-measure** all byte figures in-wave. Semver treatment of the
npm package is the one residual (R1) — it gates the release stanza, not the excision decision.

### S2 — `ImplicationConstraint`: KEEP `pub` + add an in-repo test (C-β)
bbnf constructs it live (`engine.rs:86,170`, re-verified this pass, §0). R6's demotion proposal is dead.
It is currently untested public surface (`grep tests/` empty, crit-spec §A) — the test is the W-C row.

### S3 — `py/sudoku_api.rs`: KEEP, PRUNE, RENAME — not deprecated, no directory split (mandate question answered)
tests-py depends on it live (`create_sudoku_csp`/`solve_sudoku`/`SudokuDifficulty`, crit-P2 C1); it is
registered pymodule surface. No `py/sudoku/` split: 338 LOC, under the dir's 500-line budget, ~200 LOC
post-prune — a subdir for one cohesive file is over-decomposition (R6 §E; T2-W8's "no break earned"
re-confirmed with fresh evidence). **Rename `sudoku_api.rs → py/sudoku.rs`** (the `_api` suffix existed
only against the futoshiki twin) **in the same commit as** the `difficulty_parity.rs` retarget — the
`SIBLING_DEFINITIONS` path literal is at `:138` (list at `:135`, guard at `:318-338`; the spec's ":139"
was off by one, crit-spec §A). Both parity tests fail by construction otherwise.

### S4 — the mechanically-dead py prune, correctly scoped (crit-spec B1/B4 folded in)
Gate-verified in P2's worktree (`cargo check --features py` clean — re-run independently by crit-P2 C3;
fresh wheel; tests-py 27 passed/2 skipped identical to baseline):
- `SudokuCSP.backtracks()` alias — remove.
- `SudokuCSP.{budget_exceeded, cancelled}` **getters** — remove. **Scope is `SudokuCSP.` only**: the
  generic `SolveStats.{budget_exceeded, cancelled}` are LIVE (`test_wheel_contracts.py:105,155,156,197`)
  and untouched. The `cancelled` **field** removal is compiler-forced (`dead_code` under
  `warnings = "deny"` once the getter goes — "keep private + reserved" would need `#[allow(dead_code)]`,
  a smell; crit-P2 C3). `budget_exceeded` field stays private (drives the `BudgetExceededError` branch).
- The **py wrapper** methods `py/csp.rs::{add_equals, add_less_than, add_greater_than, solve_with_given,
  propagate_with}` — remove. **Never phrased "crate-wide"**: the core `Csp` methods are LIVE (py wrappers
  call them; bbnf's vendored tests call `solve_with_given` at 10+ sites, crit-spec B4).
- The py `PropagationStrategy` enum: its sole remaining use dies with `propagate_with`, after which the
  same `-D warnings` forcing applies. Removal rides the same commit; the capability-reduction concern
  (crit-P2 R2c) is recorded in the wave text, not a separate gate — the capability was already
  unreachable-by-caller in every existing consumer.

### S5 — the `Timeout` arm STAYS; the synthesis row is dead (B2 resolved by P2's compile proof)
`py/errors.rs:53-61` is an exhaustive match; removing the arm alone is `E0004` (proven in-worktree,
proto-P2 §Verdict). **Final shape:** keep the arm, keep `CspTimeoutError` exported — the surface-honest
py-only minimum. "Is core `CspError::Timeout` itself dead?" is a W-C/core question with a vendor-mirror
blast radius (`error.rs:63,77,94` + bbnf `--update`), residual R11/Q6.

### S6 — W-A packaging truth: pyproject `0.2.0 → 0.3.0` + metadata
A live packaging bug, confirmed three ways (crit-spec §A, crit-P3 C4: CI's maturin currently emits a
0.2.0-labelled wheel from a 0.3.0 crate). Description/readme/classifiers/urls enrichment proven to build
and embed (P3's spike wheel, METADATA 13,213 B). Unconditional; lands first.

### S7 — stub-shipping MECHANISM: pure-Rust layout, mixed layout REJECTED (Q3 half-closed)
Proven against the actual built wheel + maturin docs (crit-P3 C1-C3): a root `csp-solver/csp_solver.pyi`
is auto-detected, shipped as `csp_solver/__init__.pyi` with auto-added `py.typed`, **zero**
pyproject/Cargo changes; maturin's pure-Rust default already emits a package folder. The mixed layout /
`csp_solver._internal` rename is not needed → the §1.4 `csp_solver.sudoku` namespacing rejection stands
unreopened. Durable authoring facts recorded: pyo3 `#[new]` stubs as `__new__` (stubtest-caught);
auto-detection keys off `module-name == stub-stem` (tripwire wanted, R4). What is NOT settled: stub
*contents* (P2-downstream), hand-written vs `maturin --generate-stubs`, and the CI guard (R4).

### S8 — FE scene extraction: SAFE and shape-settled (P4 core)
`SudokuGame.vue` extraction (App.vue 371→177, pure shell), shared `useAnswerKeyPeek`, shared scene CSS
via `<style scoped src="@/games/scene.css">` — **source de-dup with scope-hash isolation proven in the
built artifact** (`.app-layout[data-v-…]` per game, zero unscoped hits; crit-P4 C5), so the C1/C2 hold
is genuinely sidestepped, not merely argued. All four gates reproduce green under independent re-run
(vue-tsc/eslint/build with byte-identical chunk shape/playwright zero failures). Behavioral parity
settled: the `game !== 'sudoku'` guards dissolve with `v-if` mounting; `setGame`'s manual `endPeek()`
replaced by unmount teardown; the **eager-SudokuGame / lazy-FutoshikiGame import asymmetry is ratified**
(default game rides the main chunk; bundle shape byte-preserved). Wording is "structural mirror," never
"byte-mirroring." Four shape decisions remain open (R6) — they are the wave's decisions, not blockers to
the GO.

### S9 — pub-surface sweep, corrected scope: **13 demotions + 2 removals + 1 relocation** (P5)
The "10 demotions" framing is dead. Settled mechanics, all compiler-forced or census-proven
(crit-P5 C1-C5):
- 8 clean demotions to `pub(crate)`: `BitsetWorklist`(+`::new`), `propagate_monotonic`, `PropResult`,
  `SearchParams`+5 fields, `PERMANENT_DEPTH`, `ZeroCost`, `CostDomainEval`, `GAC_CORE_CALLS`.
- +3 forced demotions: `ac3_full`, `feasibility_search`, `branch_and_bound` — **doubly** forced: the
  demoted param types AND `&Adjacency` in their signatures trip the **`private_interfaces` lint**
  (not E0446) under `warnings = "deny"` (root `Cargo.toml:40-41`). The charter fence was incompatible
  with its own demotions.
- 2 removals, refiled to W-B (dead-surface wave): `propagate_stratified` (zero callers anywhere) and
  `Csp::adjacency()` (accessor dead; the field stays, read internally). Demotion of dead items trips
  `dead_code` — removal is the honest disposition (pending the R7 owner fork on `propagate_stratified`).
- Relocation `src/adjacency.rs → src/solver/adjacency.rs` as `pub(crate)`, 5 importer rewrites + the 6th
  reference dissolving with the removed accessor (sequencing stated in the wave).
Census settled: zero external consumers of all 13+2 across repo AND bbnf non-vendored crates
(independently re-swept by crit-P5 C3; bbnf's only optimization entry is `solve_optimized` at
`csp_strategy/mod.rs:603`). Residual: ratification/semver stanza + in-wave gate re-runs (R7).

### S10 — the §1.7 rejection set holds in full (the KISS bar)
crit-spec §D: the strongest part of the spec. Settled rejections: `py/sudoku/` dir split;
`py/puzzles/` symmetric reshape; `csp_solver.sudoku` namespacing + mixed layout; declarative
`#[pymodule]` migration; `constraint/` family subdirs; `mod.rs`-rename sweep as a wave row (owner
follow-up offer only, Q5); full `packages/pencil` extraction (barrel + deep-import lint captures the
value); `pencilConfig.ts` split; the isomorphic drift-assertion test (superseded by S1).

### S11 — P6 technical substrate (proof + shape), separated from its authoring decision
Settled facts, independently re-derived by crit-P6 (sha matches, worktree inspected): the `@import`
partial split can be **empirically byte-identical** in minified output (sha `ce4c09…` both builds,
runtime probe zero-diff); the provable split is **theme / utilities / print along layer/at-rule
boundaries** — a contiguous `animations.css` is impossible (rules interleaved in the merged
`@layer utilities`); `@font-face` must move into a partial (CSS `@import`-first rule) **with the
`url('./fonts/…') → url('../fonts/…')` rebase repair** (a real silent-404 footgun, proven by the
pre-fix hash differing). Whether to author at all is residual R8 (Q9 sign-off + KISS include-or-drop;
critique default: drop).

### S12 — doc-truth corrections banked for W-G
CLAUDE.md "warn >215 KB" is stale — the enforced band is fail >240,000 / warn >230,000 B
(`ci.yml:296-300`, the enforcing check, not the `:240,288` comments); the lean artifact figure is
90,602 B (CLAUDE.md's 87,853 B is pre-futoshiki-in-lean); `wasm/README.md:49` "the committed `pkg/` is
the default (full-feature) build" is doubly false — `pkg/` is gitignored and the file:-linked build is
lean; `ci.yml:243` is stale independently of S1 ("no [features]/full-mirror flag" contradicts the
current Cargo.toml).

### S13 — wave skeleton confirmed with re-filings
W-A → {P2-gate re-run} → W-B → W-C/W-D → W-E → W-F → W-G stands, amended: the two P5 dead items move
W-C→W-B; stub *contents* are strictly P2-downstream (the DAG must order P2-prune before stub authoring,
crit-P3 C7); W-B carries the npm-tarball pre-condition (R1) and the bbnf `--update && --verify`
re-vendor step; the futoshiki row is extracted from W-B into an owner gate (R2).

---

## 2. THE KILL LEDGER — claims that died this pass

| # | Dead claim | Killed by | Replacement |
|---|---|---|---|
| K1 | Synthesis §1.2 "`budget_exceeded`/`cancelled` getters zero-caller" (unscoped) | crit-spec B1 | `SudokuCSP.`-scoped only; `SolveStats.*` LIVE (`test_wheel_contracts.py:105,155,156,197`) |
| K2 | "Remove the `to_pyerr` `Timeout` arm, keep the class pending Q6" | crit-spec B2 + P2's E0004 compile proof | Arm stays; core-variant question → W-C/Q6 |
| K3 | futoshiki removal blast = "one `mod.rs` re-export prune" | crit-spec B3 | 3 `mod.rs` edits incl. the `#[pymodule]` registration block |
| K4 | "`Csp::{…}` pruned crate-wide" | crit-spec B4 | py wrapper methods in `py/csp.rs` only; core methods live (bbnf `solver.rs`, 10+ sites) |
| K5 | `py/common.rs` as "a real seam, not speculative" | crit-spec B5 | Post-prune it is 2×, differently-keyed (`String` vs `u32`); `enums.rs` triplication unaddressed → demoted to residual R9 |
| K6 | "20 expanded tests-py tests" | crit-spec B6 | 18 raw `def test_`; dependency real, count decorative |
| K7 | Tranche-2 record: isomorphic "kept for bbnf-buddy's `solveAssignmentCop`" | synthesis §0-C-α, P1, crit-P1 | Feature conflation; symbol lives in `assignment.rs` under `assignment` |
| K8 | P1 "fully self-contained — nothing outside the file breaks" | crit-P1 | "self-contained at the code-graph level"; CI comment residuals + npm question are outside and open |
| K9 | P1 co-edit list as "SUPERSET"/complete | crit-P1 C7 | Omitted `ci.yml:243`, `ci.yml:302-303` — now folded into S1 |
| K10 | Byte figures 222,436 / 198,652 / −10.7% (and P1/P2/P5 gate counts) as settled facts | crit-P1 C9/C10, crit-P5 C6 | Expected-green/indicative; re-measure in the authoring wave |
| K11 | P2 "GO — tests-py AND bbnf compile gate green with ZERO deaths" (blanket) | crit-P2 kill 1 (as amended §0-A0-1) | tests-py green; bbnf green **after `--update` re-vendor**, to be demonstrated on the real gate |
| K12 | **Deleting `futoshiki_api.rs` as a safe dead-surface prune** | crit-P2 R1 | Reverted to an open owner design question (R2); caller-dead ≠ should-be-deleted; the compile gate cannot vote; cuts against the "comprehensive" mandate verbatim |
| K13 | "The R4 prediction holds" (blanket) | crit-P2 kill 3 | Holds for tests-py only |
| K14 | P3 "pyo3-stub-gen and the mixed layout are NOT needed" (blanket) | crit-P3 C5 | Only the mixed-layout half survives; `maturin --generate-stubs` (generation WITHOUT mixed layout) is unexamined → R4 |
| K15 | "The stubtest step means the stub can never silently drift" | crit-P3 C6 | Unwired (no stubtest in tree/CI); pre-P2 `--ignore-missing-stub` cannot catch surface growth |
| K16 | The hand-written `.pyi` as "the exact diff the winning path needs," authorable now | crit-P3 C7 | P2-downstream artifact; encodes a surface absent from the tree (`mod.rs:38-48` still exports pruned symbols) |
| K17 | P4 "byte-mirroring FutoshikiGame.vue" | crit-P4 C2 | Structural mirror (different board/props, static-vs-async laminate, options arg) |
| K18 | P4 "33 passed" | crit-P4 C7 | 32 passed + 1 skipped on independent re-run; green either way, count not authorable |
| K19 | `awaitTickBeforeActivate` as a necessary behavioral seam | crit-P4 D1 | Likely no-op given `AnswerKeyLaminate.vue:86` `{immediate:true}`; resolve before authoring (R6) |
| K20 | P5 "all 10 charter demotions … land" / "all three gates GREEN" | crit-P5 kills 1,5 | 13 demotions + 2 removals + 1 relocation; wasm CI lane unrun, numbers worktree-local |
| K21 | "private-in-public, E0446" | crit-P5 kill 3 | The `private_interfaces` lint erroring under `-D warnings` |
| K22 | 3-fn demotion forced solely by `BitsetWorklist`/`SearchParams` | crit-P5 kill 4 | `&Adjacency` exposure independently forces the same three |
| K23 | `Csp::adjacency()` "relocated" | crit-P5 kill 2 | Removed as dead code; only the module file relocates |
| K24 | P6 "GO" (unconditional) + "byte-identical **by construction** … no rendering input left" | crit-P6 kills 1,2 | GO-conditional on Q9 + KISS ruling; identity is an **empirical minified-output** property (3 blank lines dropped, whitespace normalized) |
| K25 | P6's implication that the visual-diff arm "should be retired" | crit-P6 kill 3 | The hold owner's call under Q9; the prototype may offer, not retire |
| K26 | crit-P2 "bbnf-lang is not present on this machine" | this lane, §0-A0-1 | Present at `/Users/mkbabb/Programming/bbnf-lang` with the cited lines live |
| K27 | CLAUDE.md "warn >215 KB" band, 87,853 B lean figure, "committed pkg/" framing | P1 + crit-P1 C5/C8/C11 | S12 corrections |

---

## 3. THE RESIDUAL SET — below-100 items

Each with its exact blocking question and the evidence that closes it.

| # | Item | Blocking question | Closing evidence |
|---|---|---|---|
| R1 | npm semver treatment of S1 | Does the **published** `@mkbabb/csp-solver-wasm@0.2.0` tarball ship the full module (`class Csp` in its d.ts) or the lean one? CI has no publish step — publishing is out-of-band, so the tree can't answer. | Fetch the npm tarball, inspect `*.d.ts`. Lean ⇒ excision is non-breaking; full ⇒ major-bump stanza in W-B. Also settles the wasm-crate version stamp (`wasm/Cargo.toml:3` 0.2.0 vs core 0.3.0). |
| R2 | `py/futoshiki_api.rs` disposition (Q2, reopened by K12) | Owner: remove the co-equal game's py surface (asymmetry, against "comprehensive" read literally) or keep-and-test it (the R4 §6-B alternative)? And what is the **stated rule** distinguishing whole-game surface (ratification) from internal dead symbols (unconditional prune) — crit-spec C4's evenness gap? Sub-fork: do `solve_sudoku_board`/`template_count` fall under the rule's prune side or its ratify side? | A one-page owner memo: the rule + the futoshiki verdict + the convenience-fn verdict. No code evidence can close this — it is a design call. |
| R3 | bbnf gate truth for the combined P2+P5 diff | Does the **real** `sync-csp-solver-vendor.sh --update && --verify` (both cfg branches + tripwires) pass on the actual bbnf-lang after the combined prune+demotion diff? (P2 simulated the isolated stage; P5 ran a single-arm overlay without the paired baseline or the py-isolated stage inside bbnf.) | Run the real script against a worktree'd bbnf clone (never push origin — standing directive) with the combined diff; paired baseline arm included. |
| R4 | Stub path finalization (Q3 residue) | Hand-written `.pyi` + stubtest guard vs `maturin --generate-stubs` (pyo3-introspection, no mixed layout, flagged experimental)? And: stub contents are P2-blocked; stubtest is unwired in CI; `__all__` declaration; module-name/stub-stem tripwire. | Spike `--generate-stubs` on the post-P2 worktree; diff its output against the hand-written stub; wire stubtest into the py-runtime CI lane and show it fails on an injected drift, flag-free post-P2. |
| R5 | abi3-at-py310 adoption (crit-spec C1 — the one ungated ADOPT) | Does an abi3 wheel actually build and pass tests-py given `create_exception!`, `#[pyclass(eq, eq_int)]`, `py.detach` under pyo3 0.29 — and does the stub still land in the same package folder? | One `--features abi3`-style build (pyo3 `abi3-py310`) + tests-py + `unzip -l`. Q4 (PyPI intent) decides whether the abi3t plan row is dropped. |
| R6 | P4 shape decisions (crit-P4 D1-D4) | (a) Is `awaitTickBeforeActivate` a no-op given `{immediate:true}`? (b) Hoist the identical `SolveState` union to a shared type? (c) Where do shared scene.css + useAnswerKeyPeek live — `src/games/shared/`, `src/composables/`, games-root (this is Q7, incl. whether `celebration.ts` is pencil-domain)? (d) `.board-cells` shared constant? | (a) A deliberate race probe (async laminate resolving mid-gesture) or removal + full e2e; (b/c) a settled layout decision authored into W-E/W-F; (d) a one-line constant + contract note. |
| R7 | P5 ratifications | (a) Owner ratifies the 13-symbol demotion as part of the 0.4.0 semver-major (published crates.io 0.3.0 downstream is the census blind spot); (b) `propagate_stratified`: remove vs keep-reserved vs **wire in** (latent SCC-stratified optimization); (c) in-wave: wasm CI lane run + paired-baseline bbnf arm + `cargo doc` intra-doc-link check. | (a/b) owner memo rows; (c) gate runs in the authoring worktree at real HEAD. |
| R8 | P6 authoring decision (Q9) | Does the hold owner accept compiled-byte-identity as "a cascade-layer proof" (`C-deferred-foldin.md:108`)? And does the KISS bar rule include-or-drop (net-zero runtime benefit, new `url()` footgun; critique default: **drop**)? If included: the font-URL smoke guard is specified but unbuilt. | Owner sign-off; if GO, build the build-output font-URL assertion; else record HELD-again in W-F. |
| R9 | `py/common.rs` extraction (demoted by K5) | Is a generic-over-key helper for a 2× duplication worth it, and does the extraction scope include the `enums.rs:11-30,33-51,54-72` triplication it currently ignores? | Re-scope post-P2: recount the duplication in the pruned tree; adopt-with-enums or drop. |
| R10 | PyPI intent (Q4) | Will the wheel ever publish to PyPI? Load-bearing for R2's "no external caller" premise and R5's abi3t row. | Owner one-liner. |
| R11 | Core `CspError::Timeout` liveness (Q6 substance) | Zero constructor sites — dead variant, or reserved taxonomy? Removal touches `error.rs:63,77,94`, its unit test, the py class, and the bbnf vendor mirror. | W-C decision + R3's gate run; confirm no doc contract names `CspTimeoutError`. |
| R12 | `search.rs` waiver vs split (Q8) | Accept the single-reason-to-change waiver at 504 LOC, or split the B&B half (`search.rs:444`) alongside the settled `gac/mod.rs` split? | A split sketch along the `matching.rs` seam precedent; critique verdict. |
| R13 | W-F's un-prototyped rows | The god-composable breaks (`useUndoHistory`, `usePencilMarks` from the 482/472-line twins), pencil barrel + deep-import lint, `apiError.ts → classifyError.ts`, base64url hoist, chrome `icons/`/`filters/` regroup — **no PASS-1 prototype touched any of these**; they ride on R5-audit evidence alone. | A P4-style worktree prototype with the same four gates + pixel-bounding method. |

---

## 4. OVERALL CONVERGENCE — **64%**

**Method: weighted by wave-effort, not item count.** Each critiqued artifact is weighted by the
estimated authoring effort (in wave-effort units) of the wave rows it gates, from the S13 skeleton;
the spec critique carries the waves no prototype gates (W-A, W-D's non-stub rows, W-F's non-P6 rows,
W-G). P2 uses the §0-A0-1 adjusted score.

| Artifact | Gates | Weight | Convergence | Weighted |
|---|---|---|---|---|
| crit-spec-coherence | W-A + W-D(non-stub) + W-F(non-P6) + W-G | 5.5 | 60 | 330.0 |
| P1 (crit 77) | W-B isomorphic half | 1.5 | 77 | 115.5 |
| P2 (crit 56 → adj. 62) | W-B py half | 1.5 | 62 | 93.0 |
| P3 (crit 70) | W-D stub row | 1.0 | 70 | 70.0 |
| P4 (crit 74) | W-E | 3.0 | 74 | 222.0 |
| P5 (crit 60) | W-C | 3.0 | 60 | 180.0 |
| P6 (crit 52) | W-F index.css row | 0.5 | 52 | 26.0 |
| **Total** | | **16.0** | | **1036.5** |

**1036.5 / 16.0 = 64.8 → 64%** (floored; a hollow round-up poisons the tranche). Reading: the
macro-shape — excise isomorphic + full-mirror; keep-prune-rename sudoku_api with no dir split; the
corrected 13+2+1 pub sweep; FE scene symmetry via the proven scoped-CSS mechanism; the §1.7 rejection
set — is settled and author-ready. The gap to 100 is concentrated in owner gates (R2, R7a/b, R8, R10),
the two unexamined technical forks (R4 gen-vs-hand, R5 abi3), the un-prototyped W-F rows (R13), and
in-wave gate re-runs that PASS-1 could only simulate (R1, R3).

---

## 5. THE PASS-2 CHARTER — 8 lanes, verbatim

1. **P2-L1 — npm-tarball + wasm semver closure (closes R1, K10-wasm).** Fetch the published
   `@mkbabb/csp-solver-wasm@0.2.0` tarball (`npm pack` or registry API); inspect its `.d.ts` for
   `class Csp`/`SolveConfig`. Deliver: the semver stanza for W-B (non-breaking vs major), the
   wasm-crate version-stamp decision (`wasm/Cargo.toml:3` 0.2.0 vs core 0.3.0), and re-measured
   full-module byte figures on the excision worktree (replacing the killed 222,436/198,652 figures).

2. **P2-L2 — real bbnf gate on the combined diff (closes R3, K11).** In a bbnf-lang worktree (NEVER
   push origin), overlay the combined P2-prune + P5-demotion `src/`, run the actual
   `scripts/sync-csp-solver-vendor.sh --update && --verify` (both cfg branches, tripwires, py-isolated
   stage) WITH a paired baseline arm (clean HEAD src). Deliver: gate transcripts + the
   `ImplicationConstraint` in-repo test drafted (S2's W-C row).

3. **P2-L3 — the owner-gates memo (closes R2, R7a/b, R10, R11, Q5; feeds Q6).** One decision document:
   (a) the published-py-surface rule (whole-game vs internal-symbol treatment, crit-spec C4);
   (b) futoshiki_api remove vs keep-and-test, with the comprehensive-mandate reading argued both ways;
   (c) `solve_sudoku_board`/`template_count` under the rule; (d) `propagate_stratified` remove vs
   reserve vs wire-in; (e) the 13-demotion 0.4.0 semver ratification; (f) PyPI intent (kills or keeps
   the abi3t row); (g) core `CspError::Timeout` dead-vs-reserved with its vendor blast radius;
   (h) the `mod.rs`-rename mechanical follow-up offer. Every row pre-argued with evidence so the owner
   answers in one sitting.

4. **P2-L4 — stub-path decider + abi3 spike (closes R4, R5, Q3 fully).** On a worktree chained off
   P2's pruned state: spike `maturin build --generate-stubs` (pyo3-introspection) and diff its output
   against P3's hand-written stub; pick hand vs gen on stated grounds. Build one abi3-py310 wheel;
   run tests-py against it; confirm the stub + `py.typed` still land. Wire `mypy.stubtest` into the
   py-runtime CI lane and PROVE it fails loud on an injected symbol drift, flag-free post-prune; decide
   the `__all__` declaration; add the module-name/stub-stem tripwire.

5. **P2-L5 — FE seam closure (closes R6, Q7).** Resolve `awaitTickBeforeActivate` (construct the
   async-laminate-resolving-mid-gesture race or prove no-op via `AnswerKeyLaminate.vue:86`
   `{immediate:true}` and delete the option); hoist the shared `SolveState` union
   (`games/sudoku/types.ts:11` ≡ `games/futoshiki/types.ts:16`) and type the composable; settle the
   shared-home layout — `src/games/shared/` vs `src/composables/` for scene.css + useAnswerKeyPeek,
   including whether `celebration.ts` is pencil-domain (Q7); extract the `.board-cells` guard to a
   shared constant with a contract note. Deliver the final W-E file plan.

6. **P2-L6 — W-F prototype (closes R13).** A P4-style worktree probe of the un-prototyped hygiene
   rows: extract `useUndoHistory(applyValue)` + `usePencilMarks(propagateFn, …)` from the 482/472-line
   twins; pencil `index.ts` barrel + `no-restricted-imports` depth rule (11 deep-import sites);
   `solver/apiError.ts → classifyError.ts` rename; `toBase64Url`/`fromBase64Url` hoist to
   `src/lib/base64url.ts`; chrome `icons/` + `filters/` regroup. Gates: vue-tsc, eslint boundaries,
   build chunk-shape parity, full e2e, the P4 pixel-bounding method (before/after AE vs same-code
   control).

7. **P2-L7 — W-C authoring gate (closes R7c, R12).** Re-apply the corrected 13+2+1 sweep at real HEAD;
   run the full merge bar: `cargo test --workspace`, queens bench `--test`, `check --features py`,
   the **wasm CI lane** (`wasm-pack test --node` + clippy `--target wasm32`), and
   `cargo doc` for the `[crate::solver::search::branch_and_bound]` intra-doc link. Sketch the
   `gac/mod.rs` (555 LOC) split along the `matching.rs` seam (Tarjan SCC half out) and draft the
   `search.rs` waiver text vs a B&B-half split (`search.rs:444`) for the critique verdict (Q8).

8. **P2-L8 — P6/Q9 disposition (closes R8, Q9).** Present the byte-identity artifact
   (`p6/before,afterB2` shas + probe JSONs) to the hold owner as the proposed proof-substitution;
   obtain accept/reject. If rejected or the KISS ruling is drop: author the HELD-again record for W-F
   (the critique's default). If accepted: build the missing build-output font-URL assertion/smoke
   guard, confirm HMR/watch-rebuild emits no `@import`-ordering warning, and finalize the
   theme/utilities/print partial shape with the `../fonts/` rebase documented as load-bearing.

---

*Report by the agglomeration lane, PASS 1 closed. Every settled row carries its critique correction;
every residual names its blocker; the 64% is floored, not rounded.*
