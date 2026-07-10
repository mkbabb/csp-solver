# PASS-2 AGGLOMERATION — tranche-III encapsulation/modularization

**Lane:** pass2-agglomeration (core design model) · **Closes:** PASS 2
**Inputs:** P2-L1…L8, crit-{py 78, fe 85, be 87, coherence 76}, `pass1/pass1-agglomeration.md`,
transcripts (`baseline-verify.log`, `treatment-verify.log`), persisted worktrees + `p6-accepted/`.
**Audit-32 status:** `audit32/synthesis-path-forward.md` is **ABSENT** (raw lane files A1–A22/F-series
exist, but the audit's own synthesis hasn't landed). Per charter: noted, and this agglomeration is
**scoped to pass-2** — folding raw audit rows would front-run that audit's agglomeration. When it
lands, its design/perf/library rows reconcile against §1 T5/T6 (module-structure) and §3 RES-7.
**Posture:** honesty over momentum. Pass-1 closed at 64; every pass-2 residual it named was executed.

---

## 0. Agglomeration-pass resolutions (fresh moves this lane)

**A2-1 — C1 (the "13-demotion" error in the owner memo) is HEALED at the distillation layer.**
P2-L7 + crit-be + crit-coherence triple-derived the true count: **12 demotions + 2 removals + 1
relocation**. P2-L3's memo carries "13" at three sites and enumerates 11. The owner never sees the
memo raw — the orchestrator carries THIS lane's distillation (§5), which states **12+2+1** with the
twelve-symbol table cited (P2-L7 §1). The memo file itself still needs the three-site edit before any
archival use; flagged in RES-5.

**A2-2 — C4 (pyproject version lag re-opening) is HEALED by folding into the ballot + wave text.**
The recommended option of owner question 2 (§5) explicitly carries the version-triple alignment:
pyproject.toml, crate, and wasm package all advance to **0.4.0** in W-B/W-C — W-A's 0.2.0→0.3.0 stamp
is an interim truth-fix only. The S6 discipline now extends one bump forward; a wave-text row records it.

**A2-3 — C2 and C3 are converted, not closed.** The shared-home contradiction (P2-L5 `games/shared/`
vs P2-L6 `src/composables/`) and the `PropagationStrategy` reclassification (P2-L3(a) reopening S4)
are genuine owner gates — their designed resolution path is the ballot (§5 Q3, Q1). They stay deducted
until answered.

**A2-4 — symmetric pricing of owner-gate pendency.** crit-be explicitly declined to price W-C's
pending owner gates (0.4.0 ratification, `propagate_stratified` fork) against the lanes, while crit-py
priced R2 at −8. For weighting parity this lane deducts **−5 from be** (87→82 effective). Method
detail in §4.

---

## 1. THE PASS-2 SETTLED SET (adds to pass-1 S1–S13; each row author-ready as stated)

### T1 — npm truth: published 0.2.0 is FULL → the excision is BREAKING; stamp everything 0.4.0 (R1 closed)
The published `@mkbabb/csp-solver-wasm@0.2.0` tarball ships the full module — `class Csp`,
`SolveConfig`, `SolveStats` + 4 enums in the d.ts, 1:1 with `isomorphic.rs`'s 7 exports
(P2-L1 §1; crit-py CONFIRMED against the actual registry bytes, shasum `b05d3a96…` matched to the
digit). The K10 "lean ⇒ non-breaking" hedge is dead. **W-B stanza:** package 0.2.0 → **0.4.0**
(BREAKING, 0.x minor slot), `wasm/Cargo.toml:3` re-stamped in the excision commit, aligned to the core
0.4.0 W-B+W-C surface; must-not-remain-0.2.0 is a hard constraint. Lean build **90,602 B byte-identical
pre/post** (CONFIRMED on disk); `Cargo.lock` unchanged (CONFIRMED). Full-module figures
222,436 → 198,652 B (−10.69%) are **indicative-strong, transient** (crit-py KP2) — re-measure in-wave.

### T2 — the real bbnf gate is GREEN on the combined P2+P5 diff, both arms, nil differential (R3 closed mod. re-run)
Real `sync-csp-solver-vendor.sh --update && --verify`, paired arms (baseline `3b75eca2`, treatment
`be044e41`), both exit 0 — tripwires OK, 4/4 compile stages, lattice 16/16, transcripts persisted
(P2-L2 §2; crit-py CONFIRMED from the logs). Clean compile of root+skinny against the vendored crate is
the mechanical E0432/E0603 proof that bbnf references none of the 12 demotions + 2 removals + py prune.
bbnf's live deps survive verbatim (core `solve_with_given`, `solve_optimized`, `ImplicationConstraint`
still `pub`). The `ImplicationConstraint` in-repo test exists: 10 tests (count CONFIRMED), the S2/C-β
W-C row. bbnf state restored, never pushed. **Carried forward:** in-wave re-run at the real merged HEAD
(arms ran at `3b75eca2`; main is ahead) — mechanics carry, only the SHA changes.

### T3 — stub path DECIDED: hand-written; abi3-py310 GO; stubtest wired flag-free (R4 + R5 closed; Q3 fully)
`maturin generate-stubs` (1.14.1, `experimental-inspect`, pyo3 0.29) emits a type-empty `Incomplete`
stub — worse than none, since `py.typed` would advertise typing that doesn't exist (P2-L4 §1; the K14
residue resolved **by execution**, not omission). Hand stub ships via maturin's pure-Rust
auto-detection, zero config; mixed-layout rejection (S7) stands unreopened. abi3-py310: opt-in
`abi3 = ["py","pyo3/abi3-py310"]` feature (CONFIRMED in Cargo.toml), one `cp310-abi3` wheel builds,
tests-py 27/2 against it, imports+solves on 3.10/3.11/3.12, stub + `py.typed` land unchanged
(transient runs — PLAUSIBLE per crit-py; scaffolding all CONFIRMED). stubtest wired in the py-runtime
lane flag-free with a **one-regex allowlist** (private submodule only, never `--ignore-missing-stub`);
injected-drift matrix 5/5 caught loud incl. surface growth (the crit-P3 C6 hazard, closed by `__all__`
declaration); module-name/stub-stem tripwire in CI (both steps CONFIRMED present). Stub is **135**
lines (not 130 — crit-py KP1). **Scope fence (C3, honest):** the stub's `__all__` (15 names) encodes
the *maximal* prune; if the owner keeps futoshiki or `PropagationStrategy` (§5 Q1), the surface and
`__all__` re-derive — mechanism conclusions are surface-invariant, contents are not.

### T4 — FE seams closed at the code level (R6 closed; Q7 ruled)
(a) `awaitTickBeforeActivate` is a **proven no-op** — `AnswerKeyLaminate.vue:86 {immediate:true}`
covers async and static mounts; Sudoku's shipped path is already the sync-set pattern; delete the
option, the composable ships branch-free (K19 resolved to UNNECESSARY; crit-fe re-derived and could not
construct a breaking race). Wording fix: the case-2 else-branch arms an unmount timer the true branch
clears — `releaseHold` never fires (K36). (b) `SolveState` + `SolveStats` are byte-identical twins →
hoist to `games/shared/types.ts` with per-game re-exports, zero consumer churn. (c) **`celebration.ts`
stays pencil-domain** — census-proven aesthetic substrate (pencil-boil + pencilConfig imports, a pencil
consumer at `HandwrittenGlyph.vue:10`); the synthesis's "move to `src/composables/`" is dead (K35).
`useTheme.ts` stays app-global. (d) `.board-cells` → shared constant, both boards bound to it, rendered
class value unchanged (scoped rules unaffected); scene.css gets a class-contract header comment.
**The one open half:** which home the cross-game composables get is C2 → owner Q3 (§5).

### T5 — W-F hygiene rows all feasible under the full gate set (R13 closed mod. C2)
All five rows built and gated in-worktree (P2-L6; crit-fe verified the substrate exactly — LOC deltas
409/395 exact, rename-aware diff +80/−228 byte-exact, barrels present, depth rule bites with a proven
negative control): `useUndoHistory` (50) + `usePencilMarks` (81) extracted from the 482/472 twins;
**subdir barrels** (`@pencil/chrome`, `@pencil/grid`) — the synthesis's root barrel is **bundle-risky**
and dead as the mechanism; depth lint scoped external with the **flat-config append discipline** (a
naive second block would silently clobber the cross-game boundary — real finding, correctly handled);
`apiError.ts → classifyError.ts`; base64url hoist to `src/lib/`; chrome `icons/` + `filters/` regroup.
"11 deep sites" is dead — **6 external** (K37, crit-fe re-grepped). **Pixel method upgraded:** the P4
single animated control is a weak bound (jitter 0–4107 px); `reducedMotion:'reduce'` renders
deterministic — **AE=0 on all four before/after pairs**. W-E/W-F adopt reduced-motion determinism as
the parity bound (K38). Gate integers indicative, re-run at authoring (K10/K18).

### T6 — the W-C sweep is GREEN at real HEAD; the count is **12+2+1**; gac splits at scratch, search.rs gets the waiver (R7c + R12 closed)
Applied at `3b75eca2`: 12 files +23 −92, relocation a pure R100 rename (crit-be CONFIRMED exact).
Full merge bar green: build, clippy `-D warnings`, `cargo test --workspace` all-binaries 0-failed,
queens bench asserts, `--features py`, **wasm lane** (clippy `--target wasm32` + `wasm-pack test
--node` 14/14) — the PASS-1 gap, now run (merge bar itself PLAUSIBLE-not-re-run per crit-be −6; diff
verified visibility-only). **"13 demotions" is dead everywhere** (K28) — wave text and semver stanza
read 12+2+1. `cargo doc` is **pre-broken at HEAD (20 errors) and CI never runs it**; the sweep nudges
it by +3/−1 links → a W-G disposition row (adopt the `-A private_intra_doc_links` internal-doc
invocation or de-link 3 spans), not a W-C patch. Mechanism wording: warn-level lint promoted by
`-D warnings`, not deny-by-default (K34). **gac/mod.rs split:** the charter's "Tarjan half out" is
stale — Tarjan already lives in `matching.rs:102` (K33); the real seam is the ≈130-LOC scratch-pool
substrate → `gac/scratch.rs` as `pub(super)`, mod.rs → ≈425, zero visibility widening.
**search.rs: WAIVER** — a B&B split would force the private `SearchPolicy`/`search` kernel to
`pub(super)`, an encapsulation regression inside an encapsulation tranche (crit-be confirmed the
decisive privacy facts); the single-reason-to-change waiver text is settled.

### T7 — P6/index.css: both branches author-ready; the switch is the owner's (R8 technical closure)
Byte-identity artifact fully re-verified (all four shas CONFIRMED by crit-be, incl. the distinct
pre-fix `42c6c83f…` proving a real debug cycle). Accepted branch built end-to-end: pure 5-line
`@import` manifest, theme/utilities/print partials (216/160/73), `@font-face` into theme.css with the
load-bearing `../fonts/` rebase proven in prod (byte-id) **and** dev (HTTP 200), the font-URL smoke
guard **built** and validated PASS/FAIL/PASS against the three real build states, HMR/watch parity
clean. Rejected branch: the HELD-again record with default-drop argued (net-zero runtime benefit, a
new silent-404 footgun class, under the "long dirs" threshold). Owner ballot Q4 (§5) flips the switch;
no new work either way.

### T8 — version-triple alignment discipline (C4, settled as wave text)
pyproject.toml, crate, wasm package move **together** to 0.4.0 in W-B/W-C. W-A's 0.2.0→0.3.0 pyproject
stamp is the interim truth-fix; leaving it at 0.3.0 past the crate bump re-creates the exact S6 defect
the tranche fixes. One-line edits, now a named row.

### T9 — W-B/W-C sequencing constraint (P2-L7 §6, settled)
The 2 removals are `-D warnings`-**forced** by the W-C demotions (demote → `dead_code` fires →
denied). The wave DAG must land them **with** the demotions in one commit, or sequence W-B's removals
strictly before W-C — a bare W-C cannot compile. S13's W-B filing is amended accordingly.

---

## 2. THE KILL LEDGER — pass-2 deaths (continues pass-1 K1–K27)

| # | Dead claim | Killed by | Replacement |
|---|---|---|---|
| K28 | "13 demotions" (S9, §0-A0-1, P2-L3 ×3 sites, P2-L7 charter line) | P2-L7 §2 + crit-be kill 1 + crit-coherence C1 (triple-derived) | **12 + 2 + 1**, symbol table at P2-L7 §1 |
| K29 | K10's "lean ⇒ non-breaking" hedge / "published surface unknown" | P2-L1 §1 + crit-py (registry bytes fetched) | Published 0.2.0 is FULL; excision is a BREAKING npm change; 0.4.0 stanza |
| K30 | P2-L1 full-module bytes as "measured facts, not projections" | crit-py KP2 | Transient-build figures; lean 90,602 B is the only disk-persisted fact; re-measure in-wave |
| K31 | "hand stub 130 lines" | crit-py KP1 | 135 lines (`wc -l`) |
| K32 | K14 residue: "`maturin --generate-stubs` unexamined" | P2-L4 §1 (executed on 1.14.1) | Executed and REJECTED on demonstrated emptiness at pyo3 0.29; hand stub wins on stated grounds |
| K33 | gac split premise "Tarjan SCC half out along the matching.rs seam" | P2-L7 §4 + crit-be L7-12 | Tarjan already extracted (`matching.rs:102`); real seam = `gac/scratch.rs` substrate |
| K34 | "`rustdoc::private_intra_doc_links` is deny-by-default" | crit-be L7-10 | Warn-level lint promoted by `-D warnings`; observable unchanged |
| K35 | Synthesis D5 one-home collapse + "move `celebration.ts` to `src/composables/`" | P2-L5 census + crit-fe [3] | Three-home rule; `celebration.ts` is pencil-domain (pencil consumer proven); which-home-for-cross-game → owner Q3 |
| K36 | R6(a) case-2 "spurious `setTimeout → releaseHold` on a hold never acquired" | crit-fe [1] | Else branch arms an unmount timer the true branch clears; `releaseHold` never executes |
| K37 | "11 deep-import sites" (R8/synthesis §1.5.6) | P2-L6 #2 + crit-fe [11] | **6** external 3-level sites; the 11 counted pencil-internal imports the rule correctly ignores |
| K38 | P4's single-animated-control pixel bound as the parity method | P2-L6 (control AE up to 1109 < treatment 4107) | `reducedMotion:'reduce'` determinism: AE=0 both control and treatment — the definitive bound |
| K39 | P2-L5 "R6(c) closed" + P2-L6 "R13 closed" (jointly) | crit-fe kill 1 + crit-coherence C2 (REFUTED-as-closed) | Incompatible homes for the same category; one rule owner-ratified (Q3) before W-E/W-F author |
| K40 | S4's `PropagationStrategy` prune as SETTLED | crit-coherence C3 (P2-L3(a) reopens it) | Owner sub-fork inside Q1; stub `__all__` re-derives on "keep" |
| K41 | Root pencil barrel as the depth-lint mechanism | P2-L6 #1 | Bundle-risky (would defeat the lazy laminate chunk); subdir barrels are the shape |

Note: nothing in P2-L1…L8 was hard-REFUTED by any critique — the deaths above are corrections,
downgrades, and composition failures. Cluster tally: crit-py 0 refuted, crit-be 0, crit-fe 0;
crit-coherence refuted only joint-closure claims.

---

## 3. THE RESIDUAL SET — below-100 items, each with its blocker

| # | Item | Blocking question | Closing evidence |
|---|---|---|---|
| RES-1 | **The owner ballot** (§5, 4 questions) | Q1 py-surface scope (PyPI intent + rule + futoshiki + convenience fns + `PropagationStrategy`); Q2 core 0.4.0 ratification (+`propagate_stratified` fork, `Timeout` reserve); Q3 FE shared-home rule; Q4 index.css hold. | Owner answers, one sitting. Second-round items (below the 4-cap) in §5.5. |
| RES-2 | In-wave re-runs at the real merged HEAD | All gate integers are worktree-local at `3b75eca2`; main is ahead. | bbnf `--update <release-rev> && --verify` (pin rewrite); full-module wasm bytes; merge bar; vue-tsc/eslint/build/e2e; reduced-motion AE bound. Mechanics proven; only SHAs/integers refresh. |
| RES-3 | Stub-surface re-derivation (C3/K40 dependency) | Does Q1 keep futoshiki and/or `PropagationStrategy`? | If yes: P2-L4's stub + `__all__` + the P2-L2 combined diff re-derive to the ratified scope. Wave DAG: owner answer → prune → stub, strictly. |
| RES-4 | abi3-gate interaction | W-A's abi3 flip changes the ABI surface after P2-L2's non-abi3 gate arms. | Re-run the bbnf `--verify` py stage against the abi3 build before landing (P2-L2 §5 flag). |
| RES-5 | Artifact hygiene before archival | P2-L3's memo still says "13" at `:183,185,362` and enumerates 11. | Three-site edit + list reconciled to P2-L7 §1. (Owner-facing distillation already corrected — A2-1.) |
| RES-6 | W-G rows | `cargo doc` disposition (option a: `-A private_intra_doc_links` internal invocation + fix `invalid_html_tags`; option b: de-link 3 spans); S12 doc-truth corrections; 12+2+1 swept through all wave text; C5 advisory — state the stub-apparatus-vs-no-PyPI call (keep: tests-py + editor types justify it) rather than leave the KISS bar uneven. | W-G authoring. |
| RES-7 | Untouched pass-1 residuals | R9 (`py/common.rs` extraction — recount post-prune, adopt-with-enums or drop) — no pass-2 lane touched it. Audit-32 synthesis fold-in pending its landing. | Post-Q1 recount; audit reconcile when `synthesis-path-forward.md` lands. |
| RES-8 | Optional cosmetics (explicitly not blockers) | `#[pyclass(module="csp_solver")]` repr fix (8-site churn, zero drift-detection gain); runtime PRT sample (needs a forced-media harness); laminate else-branch prune. | Owner appetite only. |

---

## 4. OVERALL CONVERGENCE — **83%**

**Method: wave-effort weighting, inherited from pass-1 (total 16 units), with clusters mapped to the
waves they gate.** Cluster scores are the sibling critiques' per-deduction arithmetic; two
agglomeration adjustments applied per §0 (both stated, both directional-honest):
coherence 76 → **87** (C1 healed at the distillation layer +8, C4 folded into the ballot/wave text +3;
C2 −7 and C3 −4 stay deducted as open owner gates); be 87 → **82** (−5 symmetric pricing of the W-C
owner-gate pendency crit-be declined to count — parity with crit-py's −8 for R2).

| Cluster | Gates (wave-effort) | Weight | Convergence | Weighted |
|---|---|---|---|---|
| py (P2-L1/L2/L4 · crit-py) | W-B both halves (3.0) + W-D stub (1.0) | 4.0 | 78 | 312.0 |
| be (P2-L7/L8 · crit-be, adj.) | W-C (3.0) + W-F index.css (0.5) | 3.5 | 82 | 287.0 |
| fe (P2-L5/L6 · crit-fe) | W-E (3.0) + W-F hygiene (2.0) | 5.0 | 85 | 425.0 |
| coherence (P2-L3 + corpus · crit-coherence, adj.) | W-A + W-D non-stub + W-G + cross-wave seams | 3.5 | 87 | 304.5 |
| **Total** | | **16.0** | | **1328.5** |

**1328.5 / 16.0 = 83.03 → 83%** (floored). Pass-1 closed at 64; the 19-point advance is earned —
every pass-1 technical residual (R1, R3, R4, R5, R6, R7c, R8-technical, R12, R13) is executed and
critique-survived, with zero hard refutations across four adversarial critiques. The remaining 17
points are concentrated in exactly two shapes: **the owner ballot** (Q1–Q4 gate portions of W-B, W-C,
W-E/W-F, and W-F's index.css row) and **in-wave re-runs** (RES-2/RES-4 — mechanics proven, integers
worktree-local). No unexamined technical fork remains.

---

## 5. THE OWNER BALLOT (distilled from P2-L3 + the critiques' new gates; carried verbatim by the orchestrator)

Four questions, merged where honest, recommendation first. **Answer order: Q1 → Q2, Q3 and Q4
independent.** Q1 merges P2-L3 rows (f)+(a)+(b)+(c) — one dependency chain, the memo's own "answer (f)
first, (a) is the rule (b)/(c) apply." Q2 merges rows (e)+(d)+(g) — one 0.4.0 core-surface signature.
Q3 is the crit-coherence C2 gate (new since the memo). Q4 is P2-L8's Q9+KISS (one switch).
All counts corrected per K28 (12, not 13).

### Q1 — Python wheel: PyPI intent + prune scope (rows f, a, b, c + the C3 sub-fork)
1. **(Recommended)** No PyPI (abi3 CI-only, abi3t dropped); adopt the four-class rule; remove
   `futoshiki_api.rs`; prune `solve_sudoku_board` + `template_count`; remove `PropagationStrategy` +
   `propagate_with` (capability loss accepted — matches the gated/spiked surface; stub `__all__`=15 stands).
2. No PyPI + rule, but **keep `PropagationStrategy`** as a class-(iv) capability — stub/`__all__`/diff re-derive.
3. **PyPI-bound**: keep-and-test `futoshiki_api` (~40 LOC tests), keep capabilities, plan abi3t.
4. Defer whole-surface calls to a publish-readiness wave; prune only getters/aliases/wrappers now.

### Q2 — Core crate 0.4.0: the 12+2+1 sweep + the two taxonomy calls (rows e, d, g)
1. **(Recommended)** Ratify **0.4.0** = 12 demotions + 2 removals + 1 relocation; remove
   `propagate_stratified` (wire-in filed as a scoped backlog item with the memo as spec); **reserve**
   `CspError::Timeout` + `CspTimeoutError` with a `// reserved: no constructor until cancel-driver`
   note; pyproject + wasm stamps ride to 0.4.0 in the same wave.
2. Ratify 0.4.0 but **wire in** `propagate_stratified` this tranche (SCC precompute + dispatch + bench — scope expansion).
3. Ratify 0.4.0 but **remove** `CspError::Timeout` too (5-file core edit + bbnf vendor re-sync tail).
4. Deprecation cycle first: 0.3.x `#[deprecated]` re-exports, remove at 0.4.0 (slower; re-leaks sealed surface).

### Q3 — FE shared-home rule (crit-coherence C2; P2-L5 Q7 vs P2-L6 placement)
1. **(Recommended)** Adopt the three-home rule: NEW `src/games/shared/` for cross-game-never-pencil
   (`useAnswerKeyPeek`, `scene.css`, `types.ts`, `constants.ts` **and relocate** `useUndoHistory` +
   `usePencilMarks` there); `celebration.ts` stays pencil; `useTheme` stays `src/composables/`;
   `useButtonAnimation` follows the rule into `games/shared/`; include the ~10-line eslint tripwire.
2. Same rule, skip the eslint tripwire (KISS-minimum).
3. One home: everything cross-cutting in `src/composables/` (P2-L6's placement stands; no `games/shared/`).
4. Split the difference: only peek/scene/types/constants get `games/shared/`; undo/marks stay in
   `src/composables/` (two homes, rule documented).

### Q4 — index.css hold: Q9 proof-substitution + KISS include-or-drop (P2-L8)
1. **(Recommended)** **Drop** — HELD-again record lands in W-F; `index.css` stays monolithic;
   the byte-identity bundle + built font-URL guard are banked; hold re-opens on the same trigger
   (critique default: net-zero runtime benefit, one new silent-404 footgun class).
2. Accept byte-identity as the cascade-layer proof **and include**: 5-line manifest +
   theme/utilities/print partials, `../fonts/` rebase, guard wired into build/CI (all built and proven).
3. Accept the proof (hold lifted on the record) but defer authoring to a later wave.
4. Reject the proof-substitution — hold stands on original terms (the visual-diff arm is proven
   unsatisfiable on this app, so this is effectively a permanent hold).

### §5.5 Second-round items (beyond the 4-cap; carry only if the owner has appetite)
- `mod.rs` → self-named-file flip (P2-L3 row h): recommended as a **post-tranche one-commit follow-up**
  with `clippy.self_named_module_files` enabled; alternatives: fold into W-C/W-D, lint-only ratchet, or drop.
- `#[pyclass(module="csp_solver")]` cosmetic repr fix (8 sites, zero drift-detection gain).
- Runtime `prefers-reduced-transparency` sample (needs a forced-media harness; byte-identity covers the arm).

---

## 6. THE PASS-3 CHARTER — thin, gated on the ballot (no new evidence lanes needed)

Pass 2 leaves **no unexamined technical fork**. Pass 3 is fold-and-author, not investigate:

1. **P3-A — ballot fold + conditional re-derivation.** Ingest the owner's Q1–Q4 answers. If Q1 ≠
   option 1: re-derive the P2-L4 stub (`__all__`, symbol set) and the P2-L2 combined diff to the
   ratified scope, re-run the paired bbnf arms on the revised diff (RES-3). If Q3 ≠ option 1: rewrite
   the W-E/W-F file plans' home paths accordingly. If Q4 = include: lift the hold record, wire the guard.
2. **P3-B — wave authoring (W-A → W-G).** Author the wave documents from the settled set (pass-1
   S1–S13 as amended + pass-2 T1–T9), with: 12+2+1 in every count site; the version-triple 0.4.0
   alignment; the T9 sequencing constraint (removals ride the W-C commit or strictly precede it);
   subdir barrels + flat-config append discipline; reduced-motion AE=0 as the parity bound; the
   memo's three "13" sites fixed (RES-5).
3. **P3-C — in-wave gate execution** (RES-2/RES-4): every integer re-measured at the real merged HEAD —
   bbnf `--update && --verify` (and once more on the abi3 build), wasm bytes, merge bar, FE gates,
   pixel bound. All mechanics are proven; this is execution, not research.

---

*Report by the agglomeration lane, PASS 2 closed at **83** (floored). Zero hard refutations across
four adversarial critiques; the corpus's composition failures (C1–C4) healed or converted to the
ballot; the gap to 100 is the owner's four answers and the re-runs only authoring can perform.*
