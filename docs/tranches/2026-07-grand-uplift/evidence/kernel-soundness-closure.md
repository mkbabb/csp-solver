# Pass-4 Closure — Kernel Soundness Closure (R1)

**Agent**: kernel-soundness-closure (Pass 4, closure) · **Date**: 2026-07-05
**Worktree**: `.claude/worktrees/wf_0c754e24-d3c-1` (isolated; reset stale `bc37f4d` → `91bb8b0` before work; primary tree untouched; never pushed)
**Assignment**: R1 from `pass3/synthesis-pass3.md` §4 — apply the 3-line `ac3_from_variable` `Revision::Unsatisfiable` trail-push fix onto the composed tree, then **verify sufficiency** against the full refuting evidence (`kernel-behavior-preservation.md`'s 170-row parity matrix, the queens bench, the 113-board GAC corpus, `time_sudoku`), land the solution-set-invariance tests + queens-bench CI smoke lane, refresh the composed tree (py/ reconciliation + wasm pkg), and export the v2 artifacts.

## VERDICT: **HOLDS-WITH-AMENDMENTS — the 3-line fix is SUFFICIENT.**

The composed tree's AC-3/MAC enumerate-continuation soundness regression is closed by the 3-line fix alone. Every refuting datum reverses: the queens bench that panicked `5 != 92` now exits 0; the 113-board corpus goes 26→0 false-UNSAT; every enumerate-all solution *set* is invariant across all Pruning×Ordering; `time_sudoku` counts stay byte-identical. **No Ac3 enumerate row diverges — the enumerate-continuation trail-undo in `search.rs` did NOT need root-causing; the kernel wave's scope does not change materially.** Amendments (§7) are framing/hygiene, none reopen soundness.

---

## 0. What the bug was, and the fix

`csp-solver/src/solver/ac3.rs::ac3_from_variable` — the kernel's Trail-based incremental AC-3 that replaced the old full-sweep `for v in variables { v.restore(depth) }` backtrack undo. Its `Revision::Changed` arm correctly pushes the constraint's whole scope onto the external `Trail` before any early return; its `Revision::Unsatisfiable` arm returned `Some(idx)` **without** doing so. When `revise()` prunes several scope vars before detecting a wipe-out (e.g. `AllDifferent`'s singleton-removal loop empties a peer mid-iteration, after real prunes to earlier peers), those prunes live on each `Variable`'s own depth-keyed undo log but never reach the `Trail`. `Trail::undo_to` restores only variables it was told were touched, so they **leak permanently into sibling branches** — over-pruning that manifests as (a) false-UNSAT on solvable boards and (b) silently dropped solutions on the enumerate-all path with mixed global+binary constraints.

The fix mirrors the `Changed` arm exactly (`csp-solver/src/solver/ac3.rs:166`):

```rust
Revision::Unsatisfiable => {
    let scope = constraints[idx].scope();
    for &v in scope {
        trail.push(v);
    }
    return Some(idx);
}
```

Three logical lines (the scope-push loop), comment-annotated in place.

---

## 1. Setup + provenance

```bash
git log -1                      # bc37f4d (stale worktree-base defect) → reset
git reset --hard 91bb8b0        # HEAD now 91bb8b0d (pristine pre-kernel)
tar xzf pass3/composed-csp-solver.tgz     # extract composed OVER csp-solver/
rm csp-solver/src/py.rs csp-solver/src/solver/{backjump,backtrack}.rs  # dropped by composition
```

Extract-*over* (not clean-replace) preserved the `wasm/pkg/*` + `wasm-morph/pkg/*` build outputs that the composed tarball omitted — the exact "missing pkg" gap the rust-composition amendment flagged. The composed tree restructures `src/py.rs`→`src/py/`, `backjump.rs`+`backtrack.rs`→`search.rs`, adds `gac/`, `restart.rs`, `heuristic.rs`, `cancel.rs`, `bitscan.rs`.

Toolchain: `rustc 1.96.0-nightly (9602bda1d)`, edition 2024. Baseline oracle: `pass3/parity-baseline.txt` (the kernel-behavior-preservation capture from a symmetric standalone `91bb8b0` tree). Probe reused verbatim from `scratchpad/parity_probe.rs` (the refuting agent's own probe).

Post-fix compile + full suite:
```
cargo build -p csp-solver                → Finished (1.36s)
cargo test --workspace                   → 176 passed, 0 failed (26 binaries)
```

---

## 2. Sufficiency check A — the 170-row parity matrix

`parity_probe` rebuilt against the fixed tree, diffed against the `91bb8b0` baseline (analysis: `pass4/analyze_parity.py`, `analyze_selfconsist.py`):

| classification | rows | meaning |
|---|---|---|
| byte-for-byte identical | **146** | unchanged from baseline |
| Ac3 count-drift (same nsol + **same sethash**, different work/order) | **19** | documented GAC behavior — all 19 are `Pruning::Ac3`, 0 non-Ac3 |
| budget-truncated (both sides `budget=true`, nsol=208) | 1 | legitimate cap, excluded from strict set check |
| `max=1` valid-but-different first solution (futoshiki_constr) | 2 | see §2a — **not** a completeness violation |
| **completeness violations on enumerate-all** | **0** | ✅ |

Pre-fix the same matrix carried **6** completeness violations, of which 4 were hard solution-drops:
```
queens8         Ac3 Chronological  max=all   92 → 45
queens8         Ac3 FailFirst      max=all   92 → 5
queens8         Ac3 DomWdeg        max=all   92 → 5
futoshiki_loose Ac3 Chronological  max=all  288 → 1
```
Post-fix all four return the baseline count (92, 288) with matching `sethash`. COP (AssignmentBuilder B&B) optima identical (n=6 cost=37.18, n=8 cost=71.92 — verified elsewhere; here assignment5x5 + assignment6x6grp both `optimum IDENTICAL`).

### 2a. The intrinsic soundness proof (no external oracle)

A sound, complete solver's enumerate-all solution *set* is invariant under Pruning×Ordering. Post-fix, **every** problem is self-consistent across all 12 combos at `budget=false`:

```
queens8           CONSISTENT  nsol=92  sethash=0xc92b90bae8443c00   (all 12 combos)
futoshiki_loose   CONSISTENT  nsol=288 sethash=0xe3dafa3f1b35e000
futoshiki_constr  CONSISTENT  nsol=16  sethash=0x2c3e29631e077080
queens6/perm5/perm6/australia3/given_perm5/given_perm6  all CONSISTENT
```
Pre-fix, the Ac3 rows split off (queens8 Ac3 → 45/5, disagreeing with the None/FC/AcFc consensus of 92). Post-fix the split is gone.

### 2b. The 2 residual `max=1` rows are benign — proven, not asserted

`futoshiki_constr` has 16 solutions; under `max_solutions=1` the solver returns whichever it reaches first, which is legitimately trajectory-dependent. Post-fix Ac3-FailFirst/DomWdeg land on solhash `0x822890188245916e`, which the baseline's 12 trajectories never happened to return. A dedicated `membership_probe` (archived in pass4) proves it is a genuine member of the 16-solution set:
```
enumerate-all (None): 16 solutions, 16 distinct fnv
Ac3/Chronological max=1 -> 0xcbd85ffba402ce4e  member_of_enumerate_set=true
Ac3/FailFirst     max=1 -> 0x822890188245916e  member_of_enumerate_set=true
Ac3/DomWdeg       max=1 -> 0x822890188245916e  member_of_enumerate_set=true
PASS: every Ac3 max=1 first-solution is a valid member of the 16-solution set.
```
Both trees return 4 distinct first-solutions across the 12 combos — first-solution variety under `max=1` is expected on a multi-solution problem. Not a violation.

---

## 3. Sufficiency check B — the repo's own queens bench

`benches/queens.rs` embeds `assert_eq!(solutions.len(), 92)` / `14200` under `Pruning::Ac3`, `max_solutions=usize::MAX`. Pre-fix it panicked `left: 5, right: 92`.

```bash
cargo bench --bench queens                    # full → exit 0, no panic
cargo bench --bench queens -- queens_all      # /8 (2.09ms), /12 (939ms) both complete
```
All assertion-bearing groups ran to completion: `queens_all/{8,12}`, `queens_configs/8q_all/{fc_chrono,fc_failfirst,ac3_failfirst,ac3_domwdeg,acfc_failfirst}`. A panic aborts before criterion analysis; every group printed timings → every assert passed.

---

## 4. Sufficiency check C — the 113-board GAC corpus (0/113 false-UNSAT)

Ported `gac_ab_corpus.rs` from the gac-default-on agent's worktree (`wf_34cf008e-c2c-5`) onto the composed tree (stripped the `GAC_MIN_PARTICIPANTS_OVERRIDE` threshold-sweep instrumentation, absent here — out of kernel scope; kept the `GAC_IN_ALLDIFF_ENABLED` toggle). Corpus = 5 named hard 9×9 + all 107 template-bank puzzles (N=2/3/4) + 1 stride-dug N=5 = 113 boards, solved under the exact production config (`Ac3` + `DomWdeg`, from `py/sudoku_api.rs::solve_sudoku`), both GAC states:

```
false-UNSAT (GAC off): 0/113
false-UNSAT (GAC on):  0/113
TOTAL: 0    VERDICT: 0/113 — PASS
```

**Control** (reverted the fix, rebuilt, re-ran) — proves the harness exercises the buggy path:
```
false-UNSAT (GAC off): 23/113   (Platinum Blonde, Golden Nugget, Inkala 2010, 17-clue,
                                 9× N3/hard templates, 8× N4/medium, 2× N4/hard)
false-UNSAT (GAC on):  3/113    (Golden Nugget, N3/hard/template-{7,10})
TOTAL: 26   VERDICT: REGRESSION PRESENT
```
Matches the report's 23-off (exact) + ~2-on (report said 2, measured 3 — a benign pre-fix trajectory detail immaterial to closure). Fix restored → 0/113 reconfirmed.

---

## 5. Sufficiency check D — `time_sudoku` byte-identical

The fix adds trail-pushes on the Unsatisfiable arm, which *does* fire during sudoku backtracking — so this is a real (not vacuous) invariant. Column-stripped diff (dropping wall-clock) vs `pass3/baseline-time_sudoku.txt`:
```
>>> BYTE-IDENTICAL (found/backtracks/propagations columns) <<<
Al Escargot AC3+FF 62bt/962prop · Platinum 3bt/293prop · Inkala 105bt/1539prop
FC rows 207/789, 0/242, 501/1765  — all match baseline
```
The fix restores the correct full-undo behavior (what the baseline's full-sweep did) via precise scoped-undo; sudoku parity is preserved.

---

## 6. Landed wave artifacts + tree refresh

**Solution-set-invariance property test** — `csp-solver/tests/solution_set_invariance.rs` (new). Asserts, for queens8/queens6/futoshiki_loose/futoshiki_constr, that the enumerate-all set is identical across all 12 Pruning×Ordering at `budget=false`, with expected cardinalities (92/4/288/16). **Control-verified as a real guard**: on the reverted tree, `queens8` fails (45≠92) and `futoshiki_loose` fails (1≠288) with the exact soundness-violation message; on the fixed tree all 4 pass. This is the permanent replacement for the parity_probe scaffolding — it lives in `cargo test`.

**Queens-bench CI smoke lane** — `csp-solver/.github/workflows/ci.yml` gains a `queens-bench smoke` step: `cargo bench --bench queens -- --test`. Criterion `--test` mode runs each bench closure once, executing the embedded `assert_eq!(92/14200)` (~2.1s, no measurement) — the only CI lane that sees bench assertions, since `cargo test` never runs benches.

**py/ split reconciliation** — folded `reconciled-csp-solver.tgz`'s `src/error.rs` + `src/py/errors.rs` + wiring (`lib.rs` `pub mod error`/`pub use error::CspError`, `py/{mod,csp,sudoku_api}.rs` typed-exception raises) surgically over the composed tree. `git apply` hit a git assertion bug on new-file patches, so I copied the 8 reconciled files after verifying (via `diff -rq`) that reconciled diverges from composed **only** in those files — the fixed `ac3.rs` is untouched. `cargo check --features py` compiles clean under `python3.12` (host 3.14 exceeds the PyO3-0.24 3.13 ceiling — the W0 gate's documented Python-pin; only intentional PyO3 enum-name style warnings).

**wasm pkg files** — `wasm/pkg/*` (280KB `csp_solver_wasm_bg.wasm` + `.js`/`.d.ts`/`package.json`) and `wasm-morph/pkg/*` preserved from `91bb8b0` via extract-over. These are the pre-existing build outputs; CI's `wasm-pack build` lane regenerates them byte-accurately at release (they are not rebuilt here — see amendment §7.4).

**Exports** (all in `pass4/`):
- `composed-csp-solver-v2.tgz` — full composed+fix+reconciliation tree (155 entries, `--exclude target`); verified to contain the fix, the invariance test, `error.rs`/`py/errors.rs`, the pkg files, and the diagnostic examples.
- `kernel-soundness-closure.diff` — complete `91bb8b0` → v2 delta (`git diff --cached`, 6965 lines; new files staged so they appear).
- `kernel-soundness-closure.focused.diff` — closure-only delta on the composed baseline (623 lines: the ac3 fix hunk, the new test, the ci lane, the py reconciliation).
- Evidence: `parity-composed-postfix.txt`, `queens-bench-postfix.txt`, `time_sudoku-postfix.txt`, `analyze_parity.py`, `analyze_selfconsist.py`, `membership_probe.rs`, `parity_probe.rs`, `gac_ab_corpus.rs`.

---

## 7. Amendments (framing + hygiene; none reopen soundness)

1. **Claim restatement stands** (kernel-behavior-preservation §10.1): the kernel is "sudoku-parity-preserving + sound-and-faster COP + verified-sound Ac3 enumerate," not "behavior-preserving." Byte-identity holds only for sudoku-first-solution + pure-binary + pure-AllDifferent; Ac3 rows on mixed constraints show count-drift (same set, different work) by design of GAC.
2. **`max_solutions=1` on a multi-solution problem returns a valid-but-different first solution under Ac3** (trajectory-dependent; §2b proves membership). Any future caller depending on a *specific* first solution across pruning strategies is relying on unspecified behavior — document this where `max_solutions=1` is used as anything but a satisfiability probe.
3. **Pre-existing composition clippy residuals block W0's `clippy -D warnings` gate** — 3 warnings, NONE from this closure: `gac/mod.rs:192` + `search.rs:246` (collapsible-if), `tests/assignment_proptest.rs:42` (too-many-args, a test helper). These are rust-composition/W0 hygiene, not soundness; left unfixed to keep the closure surgical (no patches-on-patches).
4. **wasm `pkg/*` are preserved 91bb8b0 build outputs, not rebuilt from composed src.** The composed `wasm/src` (assignment.rs/isomorphic.rs/lib.rs; note the option-c `sudoku.rs` budget-fix is a *separate* deploy-C diff, not in this tarball) differs from what produced these artifacts. Tarball hygiene (pkg present + valid npm structure) is satisfied; a byte-accurate rebuild is the CI wasm-pack lane's job at the release window.
5. **`SolveConfig::backjumping` field retained.** The composed tree still carries it (deletion is the byte-neutral W1 fast-follow); the probes/tests set `backjumping:false`. When W1 deletes it, `parity_probe.rs` + `solution_set_invariance.rs` sweep like the ~60 existing test literals.
6. **`--features py` verified by compile-check only** (host Python 3.14 > pyo3 ceiling; used 3.12). The full-wheel runtime evidence (172/172, 4 typed exceptions end-to-end) is py-module-reconciliation's, on a 3.13 host — not re-run here. W0's maturin-wheel lane is the runtime gate.

---

## 8. Exit state

- **R1 CLOSED.** The 3-line fix is sufficient against the entire refuting corpus; the enumerate-continuation `search.rs` trail-undo did **not** need root-causing (no enumerate row diverges). The kernel wave's foundation is now stateable without an unverified soundness caveat.
- **Futoshiki unblocked** (synthesis §W8 hard dependency): its `AllDifferent+greater_than` uniqueness checker (`max_solutions:2` under Ac3) is now sound — the `futoshiki_constr`/`futoshiki_loose` invariance tests are its standing guard.
- **R2 (B1 constraint-trait-bound spike) remains open** — not this assignment; the second synthesis blocker.
- **Convergence: 96%.** The soundness question — the actual target — is closed with decisive, controlled evidence (4 independent checks + 2 revert-controls). The 4-point residual is environmental/booked, not soundness: py-wheel runtime not re-run in-env (compile-verified), pkg not rebuilt (preserved), 3 composition clippy nits for W0, `backjumping` deletion deferred to W1.
