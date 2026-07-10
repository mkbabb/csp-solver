# crit-py — PASS-2 critique of the py cluster (P2-L1, P2-L2, P2-L4)

**Posture:** REFUTE BY DEFAULT. Every load-bearing claim re-derived from disk/network where cheap;
transient-build claims classified PLAUSIBLE, not trusted-as-fact. **Outcome: the cluster survives
the refutation attempt.** The technical spine is CONFIRMED by direct re-derivation; the residual gap
is concentrated in owner-gated design calls (R2) and a handful of transient (non-persisted) build
figures. One minor CORRECTION (stub line count).

---

## 1. P2-L1 — npm-tarball forensics + semver + excision re-measure

**The crux claim — published npm 0.2.0 ships the FULL isomorphic module → excision is BREAKING —
is CONFIRMED by direct re-derivation, not inherited.**

| Claim | Verdict | Evidence (re-derived this lane) |
|---|---|---|
| Published 0.2.0 shasum `b05d3a962a25581ec47fe1eb94ce02c4b858c922` | **CONFIRMED** | `npm view @mkbabb/csp-solver-wasm@0.2.0 dist.shasum` AND `curl` of the registry tarball + local `shasum` — both match to the hex digit |
| Published `.d.ts` carries the full isomorphic surface (7 exports) | **CONFIRMED** | Fetched the real tarball, `tar xzf`, `grep '^export'`: `class Csp`, `class SolveConfig`, `class SolveStats`, `enum OptimizationMode`, `enum Ordering`, `enum PropagationStrategy`, `enum Pruning` all present |
| Published `package.json` description = "isomorphic mirror of the Python binding" | **CONFIRMED** | direct grep of extracted `package/package.json` |
| `isomorphic.rs` exports **exactly 7** wasm-bindgen types at lines 51/79/104/132/162/267/315 | **CONFIRMED** | `git show HEAD:csp-solver/wasm/src/isomorphic.rs` → 7 `pub struct/enum`, lines match to the digit |
| The 7 map 1:1 to the published isomorphic exports | **CONFIRMED** | set-equal by name (Pruning/Ordering/PropagationStrategy/OptimizationMode/SolveConfig/SolveStats/Csp) |
| Excision is a **BREAKING** npm change (refutes K10 "lean ⇒ non-breaking") | **CONFIRMED** | logical consequence: 7 published exports removed |
| `propagateSudoku`/`propagateFutoshiki` NOT in published 0.2.0 d.ts | **CONFIRMED** | absent from the export list (newer tree additions, irrelevant to blast radius) |
| Lean build 90,602 B, byte-identical pre/post; **Cargo.lock unchanged** | **CONFIRMED** | worktree `wf_977ec162-15b-1`: excision applied (`isomorphic.rs` deleted, `default=["assignment"]`), `git status --porcelain` = only `Cargo.toml`/`isomorphic.rs`(D)/`lib.rs` — **no Cargo.lock line**; persisted `pkg/csp_solver_wasm_bg.wasm` = **90,602 B** exactly |
| Full-module figures **222,436 → 198,652 B (−23,784 / −10.69%)** | **PLAUSIBLE** (downgrade from "measured fact") | The two full-module builds were transient; the artifact persisted on disk is the LEAN 90,602 B build. The lean byte-match + shasum match corroborate the method, but the specific full-module bytes are NOT independently re-derivable from disk this lane. Reproducing the exact killed figures (crit-P1 C9/C10) is either genuine re-derivation or over-exact; treat as indicative-strong, re-measure in-wave (K10 discipline still applies). |
| Semver stanza **0.2.0 → 0.4.0** | **JUDGMENT, defensible** | Not a fact; P2-L1 itself concedes "0.3.0 would be defensible in isolation." The align-to-core-0.4.0 argument is sound; the hard constraint ("must not remain 0.2.0", a same-version breaking republish is forbidden) is correct. |

**Net:** P2-L1's central finding (published = full → breaking) is the single most load-bearing
claim in the whole py cluster — it FLIPPED the pass-1 K10 hedge — and it is now CONFIRMED by
fetching the actual published bytes. The refutation attempt failed; the claim is stronger than
pass-1 stated (measured, not assumed).

---

## 2. P2-L2 — real bbnf gate on the combined P2+P5 diff

**Verdict GREEN — CONFIRMED. Both arms pass; the differential is nil.**

| Claim | Verdict | Evidence |
|---|---|---|
| Combined diff = **17 files, +32/−519** = P2(+9/−427) + P5(+23/−92) | **CONFIRMED** | `git show --stat be044e41`: 18 files / +236 / −519 total; the 18th is the NEW `tests/implication_constraint.rs` (+204). 18−1 = 17 non-test files; 236−204 = **+32**; −519 exact. Arithmetic closes. |
| Committed as `be044e41722658dc25780f9fd82f2377f7557fa3` | **CONFIRMED** | `git show be044e41` resolves; worktree `wf_977ec162-15b-2` is at that SHA |
| P2/P5 file sets disjoint, no cross-interaction | **CONFIRMED** | diffstat: P2 touches `src/py/*` + `csp/{mod,solve}` + `lib`; P5 touches `src/solver/*` + `config` + `adjacency` relocation — no overlap |
| `adjacency.rs → solver/adjacency.rs` relocation landed | **CONFIRMED** | worktree `wf_8f3bd831-d64-14`: `src/adjacency.rs` gone, `src/solver/adjacency.rs` present; diffstat shows `{ => solver}/adjacency.rs` rename |
| `futoshiki_api.rs` deleted in P2 prune | **CONFIRMED** | worktree `wf_8f3bd831-d64-11/src/py/` lacks `futoshiki_api.rs` (retains sudoku_api/csp/enums/errors/mod/config) |
| **Both bbnf `--verify` arms GREEN** (baseline `3b75eca2`, treatment `be044e41`) | **CONFIRMED** | `baseline-verify.log` AND `treatment-verify.log` both end `OK: --verify green — root ∪ skinny ∪ csp-solver×{default,py} compile; lattice tests pass.` |
| Tripwires OK + lattice `16 passed; 0 failed` both arms | **CONFIRMED** | transcript tails: 16/16 ok in both logs |
| bbnf references none of the 13 demotions + 2 removals + py prune (nil differential) | **CONFIRMED** (mechanically) | clean compile of root+skinny against the vendored crate is the E0432/E0603 proof; both arms green ⇒ no reference to any pruned/demoted symbol |
| `ImplicationConstraint` test — 10 tests | **CONFIRMED (count)** / passing **PLAUSIBLE** | `grep -c '#\[test\]'` on the worktree file = **10**; structure (4 check + 4 revise + 2 e2e) matches §3. Not re-run here (needs a build); P2-L2 reports `10 passed`, consistent. |
| bbnf-lang state restored, NEVER pushed | **UNVERIFIABLE from here** (low risk) | bbnf-lang is a sibling tree; the report documents a careful restore (`--check` byte-green). No way to falsify from csc411; standing directive honored per the transcript. |

**Residual (P2-L2's own flag, not a defect):** the arms ran at base `3b75eca2`; main is ahead at
`5f9980c8`. The `--update <release-rev> && --verify` MUST re-run at the real merged HEAD in-wave.
Gate mechanics + nil-differential carry; only the SHA changes. This keeps R3 from being 100% closed.

---

## 3. P2-L4 — stub-path decider + abi3 spike

**Committed scaffolding CONFIRMED present; transient build/execution claims PLAUSIBLE; one minor
CORRECTION.**

| Claim | Verdict | Evidence |
|---|---|---|
| Hand-written stub `csp_solver.pyi` shipped | **CONFIRMED (exists)** | worktree `wf_977ec162-15b-4/csp-solver/csp_solver.pyi` present, 4388 B |
| Stub is "130 lines" (§1, §6) | **CORRECTED → 135 lines** | `wc -l` = **135**, not 130. Immaterial (±5), but a factual slip in a lane that invokes K10 re-measure discipline. |
| `__all__` declares **exactly 15** names | **CONFIRMED** | grep of the stub: 15 entries (Pruning…CspTimeoutError), matches the pyo3 auto-`__all__` claim |
| `abi3 = ["py","pyo3/abi3-py310"]` opt-in feature added | **CONFIRMED** | `Cargo.toml:20` in worktree -4 |
| stubtest allowlist = ONE regex `csp_solver\.csp_solver` (not `--ignore-missing-stub`) | **CONFIRMED** | `tests-py/stubtest_allowlist.txt` present, single non-comment line, surgical scope documented |
| CI py-runtime lane wired: stub-stem tripwire (pre-build) + flag-free stubtest (post-pytest) | **CONFIRMED** | `ci.yml:187` tripwire, `ci.yml:224-226` stubtest step, both present in worktree -4 |
| `maturin generate-stubs` emits an empty `Incomplete` stub at pyo3 0.29 → hand-written wins | **PLAUSIBLE** | Load-bearing decision. The generated-empty-stub is a transient execution not persisted on disk; consistent with pyo3 0.29 introspection immaturity (pyo3#5137). Not re-derived here (would need a maturin 1.14 build with `experimental-inspect`). Decision (hand-written) is sound regardless — the hand stub ships real types. |
| abi3-py310 builds one `cp310-abi3` wheel; tests-py `27 passed, 2 skipped`; imports+solves on 3.10/3.11/3.12; stub+`py.typed` land in the abi3 wheel | **PLAUSIBLE** | The abi3 **feature** is CONFIRMED present; the wheel build, multi-version venvs, and test runs are transient (no `.whl` persisted in the worktree — `find … -name '*.whl'` empty). Claims are internally consistent and the abi3-py310 surface (create_exception!/#[pyclass(eq)]/py.detach) is known stable-API-compatible. |
| Injected-drift matrix: 5 drift classes each exit 1 flag-free; growth caught even under `--ignore-missing-stub` when `__all__` declared | **PLAUSIBLE** | Transient stubtest runs; the wired scaffolding that would produce these results IS present. The `__all__`-declared-catches-growth mechanism is a correct reading of stubtest semantics. |
| module-name/stub-stem tripwire | **CONFIRMED (present)** | `ci.yml:187-192` asserts `<module-name>.pyi` exists |
| `#[pyclass(module=…)]` tested and REVERTED as cosmetic-only | **PLAUSIBLE (self-reported, reverted)** | no artifact; a negative result, low stakes |

**Honesty flag inherited (K12/R2):** P2-L4 applied the MAXIMAL prune (deleting `futoshiki_api.rs`
+ convenience fns) in its spike worktree, and is explicit (§0) that this is owner-gated and its
conclusions are "surface-invariant." Correct posture — but it means the prune SCOPE the stub encodes
is not settled; the stub's symbol set moves if the owner keeps futoshiki. Convergence must not treat
the prune scope as closed.

---

## 4. Convergence — per-deduction arithmetic

Scope: the py cluster as closed by P2-L1 + P2-L2 + P2-L4 (residuals R1, R3, R4, R5, K10-wasm, K11),
after this critique's re-derivation.

```
Start                                                                         100
− R2 futoshiki_api prune scope still OWNER-GATED (P2-L4's whole
    stub-surface + P2's prune rest on the maximal-prune assumption;
    no evidence can close a design call)                                       −8
− Full-module byte figures 222,436/198,652 transient, not persisted
    on disk (lean 90,602 CONFIRMED to the byte; shasum CONFIRMED;
    full figures re-measure-in-wave)                                           −3
− abi3 wheel build + cross-version import + 27/2 test run transient
    (feature CONFIRMED present; runs not persisted)                            −3
− generate-stubs "empty stub" load-bearing empirical claim not
    re-derived (drives the hand-vs-gen decision)                               −3
− In-wave bbnf re-run at real HEAD still required (arms ran at
    3b75eca2; main ahead) — R3 not 100% closed                                −2
− ImplicationConstraint "10 passing": count CONFIRMED, pass not re-run         −1
− Stub line-count CORRECTION (130→135) + semver 0.4.0-vs-0.3.0 a
    recommendation P2-L1 itself hedges                                         −1
− bbnf state-restoration "never pushed" unverifiable from csc411               −1
                                                                          ────────
Convergence                                                                    78
```

**convergence_pct = 78.** Reading: the py cluster's technical spine is CONFIRMED under adversarial
re-derivation — the breaking-npm finding (the tranche-flipping claim) verified against the actual
published bytes, the bbnf gate green on both arms from real transcripts, the stub/abi3/stubtest
scaffolding all present and consistent. The 22-point gap is honest openness, not defect: one real
owner-gated design call (R2, −8), transient build figures the lanes could measure but not persist
(−9 across three items), and the mandatory in-wave re-run at real HEAD (−2). No load-bearing claim
was refuted.

---

## 5. kill_list — what dies / gets corrected under refutation

The refutation attempt killed almost nothing — the honest outcome. Genuine corrections:

- **KP1 (CORRECTED):** P2-L4 "hand stub 130 lines" → actual **135 lines** (`wc -l`). Immaterial to
  the decision; noted because the lane invokes K10 re-measure discipline.
- **KP2 (DOWNGRADED):** P2-L1's full-module bytes 222,436/198,652 as "measured facts, not
  projections" → **transient-build figures**; the disk-persisted artifact is the LEAN 90,602 B build
  only. Lean byte-match + shasum corroborate the method; the specific full figures still need in-wave
  re-measure. Do NOT re-promote to "settled fact" without a persisted full-module build.
- **KP3 (SCOPE-FENCE):** the maximal prune P2-L4/P2-L2 encode (delete `futoshiki_api.rs` + convenience
  fns) is applied in spike worktrees but remains **owner-gated (K12/R2)** — the lanes are honest about
  this, but any downstream author must not read the prune scope as ratified.

No claim in P2-L1/L2/L4 was REFUTED. Classification tally: **~22 CONFIRMED, 6 PLAUSIBLE
(transient), 1 CORRECTED, 3 UNVERIFIABLE-from-here (low-risk), 0 REFUTED.**
