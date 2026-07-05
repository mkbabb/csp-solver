# Pass-3 Critique — Kernel Behavior Preservation

**Agent**: kernel-behavior-preservation (Pass 3, adversarial hardening) · **Date**: 2026-07-05
**Worktree**: `.claude/worktrees/wf_34cf008e-c2c-4` (isolated; reset stale `bc37f4d` → `91bb8b0` before work; primary tree untouched; never pushed)
**Base under test**: the integrated tree from `pass3/composed-csp-solver.tgz` (extracted verbatim; rust-composition.md marks it green — 170/170 workspace, 139/139 csp-solver). Baseline oracle: my worktree `csp-solver/` @ `91bb8b0` (pre-kernel), copied to a symmetric standalone tree. Both built as isolated standalone crates in scratch; identical `Cargo.toml`, same nightly `rustc 1.96.0-nightly (9602bda1d)`, same host.

**Target claim (synthesis §T?, "unified kernel")**: *"The unified kernel preserves behavior — 139/139 tests, byte-identical solve counts, criterion parity."* The claim's parity evidence rests on **9 sudoku combos** (`time_sudoku`) and **one 2 s criterion pair** (`al_escargot/ac3_{failfirst,domwdeg}`). Attack: widen the byte-parity net to queens, map-colouring, futoshiki, COP/AssignmentBuilder, multi-solution enumerate-all, and `solve_with_given`, under **every Pruning × Ordering combo that compiles**; delete the vacuous `backjumping` field and re-run; quiet-host criterion on sudoku + queens + assignment.

---

## VERDICT: **REFUTED.**

The unified kernel does **not** preserve behavior. The narrow sudoku slice the claim rests on *does* hold byte-for-byte — which is precisely why the regression hid. Off that slice the attack found a **hard soundness bug**: under `Pruning::Ac3` (MAC) with `max_solutions > 1`, when a global constraint (AllDifferent, routed through the composed GAC/Regin propagator) coexists with binary constraints, the kernel **silently drops valid solutions and reports the search as complete** (`budget_exceeded=false`). 8-queens enumerate-all returns **45 or 5** solutions instead of the ground-truth **92**; a loose 4×4 futoshiki returns **1** instead of **288**. The repo's **own** `benches/queens.rs` asserts `solutions.len() == 92` and **panics** on the composed tree (`left: 5, right: 92`). The 139/139 suite is blind to it because `test_8_queens` uses `ForwardChecking`, and no test asserts an Ac3 enumerate-all solution count.

Secondary findings: the `backjumping` field deletion is confirmed byte-neutral (safe to land); the AssignmentBuilder B&B path is *sound* (optimum preserved) and legitimately far faster; but same-host sudoku wall-time regresses ~1.8× despite byte-identical counts, and the report's "criterion parity/at-or-faster" was measured against a pass-2 intermediate, not against `91bb8b0`.

---

## 1. Method

A single probe (`scratchpad/parity_probe.rs`) compiled **identically** against both trees. Portability across the two struct shapes is via `..Default::default()` for `SolveConfig` (composed adds `restarts`/`cancel`; baseline lacks them) and by reading only the four `SolveStats` fields common to both (`nodes_explored`, `backtracks`, `propagations`, `budget_exceeded`). Each row prints those four counts plus the solution count, an **order-sensitive** FNV-1a of the ordered solution list (`solhash`), and an **order-insensitive** XOR-of-per-solution-hashes (`sethash`) — so an enumeration-order change is distinguishable from a solution-*set* change.

Matrix: 9 problem families × up to {`max_solutions=1`, `max_solutions=∞`} × 4 Pruning × 3 Ordering = **170 rows**, node_budget pinned to `Some(1_000_000)` on both sides.

| family | constraints | path exercised |
|---|---|---|
| `queens6`, `queens8` | AllDifferent + binary Lambda (diag) | `solve()` |
| `australia3` | binary NotEqual only | `solve()` (map-colouring) |
| `perm5`, `perm6` | AllDifferent only | `solve()` multi-solution enumerate |
| `futoshiki_constr`, `futoshiki_loose` | AllDifferent(row/col) + binary greater_than | `create_futoshiki_csp` → `solve()` |
| `given_perm5`, `given_perm6` | AllDifferent + pins | `solve_with_given()` |
| `assignment5x5`, `assignment6x6grp`, plus a scale probe | CostFiniteDomain B&B (matching = alldiff) | `AssignmentBuilder::solve()` / `solve_optimized` |

Both binaries are fully deterministic (baseline sha `6c798d97…` stable ×2; composed sha `d89c9632…` stable ×3).

Commands (abridged):
```
tar xzf pass3/composed-csp-solver.tgz                     # composed base
cp -R csp-solver  scratch/baseline-tree/csp-solver         # baseline @ 91bb8b0
cp parity_probe.rs  {baseline,composed}/csp-solver/examples/
cargo build --release --example parity_probe               # both
./target/release/examples/parity_probe > parity-{baseline,composed}.txt
diff parity-baseline.txt parity-composed.txt
```

---

## 2. Result — the byte-parity net (170 rows)

**Not byte-identical.** `sha256`: baseline `6c798d97…` ≠ composed `d89c9632…`. Every divergent row is under **`Pruning::Ac3` and nothing else**:

| family (constraints) | rows divergent | verdict |
|---|---|---|
| `australia3` (binary only) | **0 / 24** | holds under all combos incl. Ac3 |
| `perm5`, `perm6`, `given_perm5`, `given_perm6` (AllDifferent only) | **0** | holds under all combos incl. Ac3 |
| `queens6` (AllDiff + binary) | 6 / 24 — **all Ac3** | count drift, set correct |
| `queens8` (AllDiff + binary) | 6 / 24 — **all Ac3** | **DROPS SOLUTIONS** |
| `futoshiki_constr` (AllDiff + binary) | 6 / 24 — **all Ac3** | count drift, set correct |
| `futoshiki_loose` (AllDiff + binary) | 3 / 12 — **all Ac3** | **DROPS SOLUTIONS** (Chronological) |
| `assignment*` (B&B) | all COP rows | counts diverge, **optimum preserved** |

Mechanism isolation is clean: **pure-binary (australia) and pure-global-AllDifferent (perm, given_perm) are byte-identical under Ac3.** The divergence needs a **global constraint (GAC/Regin) AND binary constraints coexisting, on the AC-3 (MAC) path.**

### 2a. Two severities within the Ac3 divergence

**(i) Count drift, sound** — same solution set (`sethash` matches), different work. E.g. `queens6 Ac3 Chronological max=1`:
```
baseline  nodes=10 bt=12 prop=58   nsol=1
composed  nodes=8  bt=8  prop=57   nsol=1   (solhash identical)
```
This alone already **refutes "byte-identical solve counts"** off the sudoku slice — the composed GAC all-different prunes differently, so node/backtrack/propagation counts shift on every Ac3 row.

**(ii) Completeness violation, UNSOUND** — valid solutions dropped, search reported complete:
```
queens8   Ac3 Chronological max=all   baseline: nsol=92  |  composed: nsol=45  budget=false  nodes=272
queens8   Ac3 FailFirst     max=all   baseline: nsol=92  |  composed: nsol=5   budget=false  nodes=50
futoshiki_loose Ac3 Chronological     baseline: nsol=288 |  composed: nsol=1   budget=false  nodes=19
```
8-queens has exactly **92** solutions (OEIS A000170). The composed runs terminated with `budget_exceeded=false` and tiny node counts — the solver *claims* exhaustive enumeration yet returned 45 / 5 / 1.

---

## 3. Self-inconsistency proof (no external oracle needed)

A sound, complete solver's solution **set** for `max_solutions=∞` is invariant under pruning/ordering — pruning changes efficiency, never which solutions exist. **Within the composed tree**, every `budget_exceeded=false` pruning for `queens8` enumerate-all returns 92 — *except* Ac3:

```
composed queens8 max=all, budget=false:
  None            {Chrono,FF,DomWdeg}  nsol=92   sethash=0xc92b90bae8443c00
  ForwardChecking {Chrono,FF,DomWdeg}  nsol=92   sethash=0xc92b90bae8443c00
  AcFc            {Chrono,FF,DomWdeg}  nsol=92   sethash=0xc92b90bae8443c00
  Ac3   Chronological                  nsol=45   sethash=0x5bbdea1dc6035ace   ← disagrees
  Ac3   FailFirst / DomWdeg            nsol=5    sethash=0x95214c2e5ecc44ce   ← disagrees
```
`futoshiki_loose` shows the same internal contradiction: composed FC/AcFc/None all give 288, composed Ac3-FailFirst/DomWdeg give 288, but composed **Ac3-Chronological gives 1** (`budget=false, nodes=19`). One pruning strategy contradicting the others on the *same CSP* is intrinsic proof of unsoundness.

**Fairness check — is this a budget truncation, not a bug?** No. The one low baseline count (`None+FailFirst futoshiki_loose = 208`) is explicitly `nodes=1000000 budget=true` — a documented cap, legitimate. Every composed Ac3 drop is `budget=false` with node counts of 19–272 — a genuine (wrong) completion. The distinction is load-bearing and it holds.

**Ordering/scale dependence** (queens6 Ac3 enumerate is *correct* nsol=4; queens8 breaks; futoshiki_loose breaks only under Chronological) points at a **state-restoration (trail-undo) defect on the MAC enumerate-continuation path** when GAC-alldiff prunes and binary AC-3 revisions interleave: after a solution is recorded and search backtracks past it, some domain reductions are not undone, so later branches run with over-pruned domains and their solutions are never found. Which branches are corrupted depends on visit order (ordering) and depth (scale) — exactly the observed signature. Pure-alldiff (perm) and pure-binary (australia) both survive because only one propagator class touches domains; the mix is what the undo mishandles.

---

## 4. The repo's own bench already asserts this — and panics

`benches/queens.rs` embeds ground-truth assertions:
```rust
// queens_all / ac3_failfirst / 8
let solutions = csp.solve(&config);   // Pruning::Ac3, FailFirst, max_solutions=usize::MAX
assert_eq!(solutions.len(), 92);
```
Running it on the composed tree (field intact, fresh extraction):
```
$ cargo bench --bench queens -- 'queens_all'
Benchmarking queens_all/ac3_failfirst/8: Warming up ...
thread 'main' panicked at benches/queens.rs:89:13:
assertion `left == right` failed
  left: 5
 right: 92
error: bench failed, to rerun pass `--bench queens`
```
Baseline passes the same assertion (`nsol=92`, `time: 2.6251 ms`). `queens_configs` asserts `== 92` for `ac3_failfirst` and `ac3_domwdeg` too, and `queens_all/12` asserts `== 14200`. **The "criterion parity" claim provably never ran the queens bench** — it would have panicked. Evidence in the composition report confirms only `composed-criterion-sudoku.txt` was captured. `cargo test` never runs benches, so `--workspace 170/170` cannot catch it either.

---

## 5. Why 139/139 and the sudoku slice still pass (the blind spots)

- **`time_sudoku` is byte-identical** on both trees — the exact invariant the claim rests on:
  ```
  Al Escargot/AC3+FailFirst   62 bt / 962 prop   (both)
  Platinum/AC3+FailFirst       3 bt / 293 prop   (both)
  Inkala 2010/AC3+FailFirst  105 bt / 1539 prop  (both)
  ... FC 501/1765 (both)
  ```
  Sudoku solves for the **unique** solution with `max_solutions` small, so the search stops at the first solution and the enumerate-continuation trail-undo bug **never fires**. The narrow slice is real but unrepresentative.
- **`test_8_queens` uses `Pruning::ForwardChecking`** (tests/solver.rs:391), which returns 92 correctly on both trees. There is **no** test asserting an Ac3 enumerate-all count. Composed suite: **139 passed, 0 failed** — confirmed — *while harboring the bug*.

---

## 6. `backjumping` field deletion (booked mechanical follow-up) — HOLDS

`SolveConfig::backjumping` is never read in `src/` (grep of `.backjumping` outside `py/` construction is empty; `src/solver/` never mentions it) — a vacuous survivor of the kernel (D3). Deleted the field + its default + the two default-build construction sites (`puzzles/sudoku/generate.rs` ×3, `puzzles/futoshiki/csp.rs`), rebuilt (default features), re-ran a field-less probe:
```
composed WITH-field  sha256 = d89c9632…
composed WITHOUT-field sha256 = d89c9632…   →  BYTE-IDENTICAL
```
Deletion is behavior-neutral. Safe to land as booked (the ~60 test-literal removals are mechanical, no logic). The PyO3 wire config still exposes `backjumping` (`py/config.rs`) — that removal is a separate `--features py` sweep, out of scope for the default-build parity test.

---

## 7. Quiet-host criterion (sudoku + queens + assignment)

Host: 18 cores (`hw.ncpu=18`); load average across the runs **1.6–3.4** (per-core ≪ 1 — quiet). Bounded runs (`--sample-size 10 --measurement-time 0.8`) — absolute µs are directional, not the load-bearing signal.

| bench | baseline @91bb8b0 | composed | note |
|---|---|---|---|
| `sudoku_9x9/al_escargot/ac3_failfirst` | ~370 µs | ~677 µs | **composed ~1.8× SLOWER, same host, identical counts** — GAC per-propagation overhead |
| `queens_all/ac3_failfirst/8` | 2.625 ms (nsol=92 ✓) | **PANIC** (`5 != 92`) | bug, §4 |
| `assignment square_dense/csp/10x10` | 2.25 s | 0.388 ms | composed ~5800× faster — **sound** (§8) |

The sudoku wall-time point matters: the composition report's "at-or-faster (composed 659 µs vs pass-2 kernel-only 751 µs)" compares composed against a **pass-2 intermediate**, not against the `91bb8b0` baseline. Same-host, same-conditions, composed sudoku is materially **slower** than the pristine baseline even though node/backtrack/propagation counts are byte-identical. Not a correctness issue; a perf regression the framing masks.

---

## 8. Assignment / COP B&B — behavior differs but is SOUND (a genuine win)

Cost-parity probe (`scratchpad/assign_probe.rs`) replicating the bench's exact problem (`lcg_cost_matrix(n,n,0xDEADBEEF)`, `unmatch_penalty(1000)`):

```
n=6   baseline cost=37.181846 nodes=105     | composed cost=37.181846 nodes=48    assign IDENTICAL
n=8   baseline cost=71.923055 nodes=11332   | composed cost=71.923055 nodes=320   assign IDENTICAL
n=10  baseline cost=55.838787 nodes=183974  | composed cost=55.838787 nodes=382   assign IDENTICAL
n=12  baseline .expect() PANIC "Infeasible" | composed cost=71.095027 nodes=739   composed SOLVES it
```
Where both complete (n≤10) the **optimum cost and the assignment vector are byte-identical**; composed reaches it with 100–500× fewer nodes (real GAC/zero-alloc gain). At n=12 baseline exhausts the 1 M budget and returns `Infeasible`; composed solves it. So the 5800× wall-time gap is a **legitimate, sound speedup**, not a regression — the opposite failure mode from §2's queens bug. This confirms GAC-alldiff is sound *by itself*; the unsoundness is specifically the **alldiff × binary × MAC-enumerate** interaction.

---

## 9. Product-risk callout (Futoshiki committed wave)

Futoshiki is `AllDifferent(rows/cols) + greater_than(binary)` — **exactly** the constraint mix that triggers §2's bug. The shipping path is currently **safe by accident**: `solve_futoshiki()` hard-codes `Pruning::ForwardChecking` (csp.rs), and FC is complete on both trees. But:
- Any switch of the futoshiki route to `Ac3`, or an "enumerate all solutions" feature, breaks.
- A **uniqueness checker** (`max_solutions=2`, common in puzzle generation to verify a single solution) under `Ac3` could report a multi-solution futoshiki as unique — a silent content-correctness defect in the generator.
Gate the Futoshiki wave on §10.2 landing, or pin its solve path to FC/AcFc with a comment and a test.

---

## 10. Amendments (what must change for "preserves behavior" to hold)

1. **Scope the claim honestly.** "Byte-identical solve counts" holds only for **sudoku first-solution** (and pure-binary / pure-AllDifferent problems). It is false for every `Ac3` row once global + binary constraints mix. Restate as "sudoku-parity-preserving," not "behavior-preserving."
2. **BLOCKER — fix the Ac3/MAC enumerate unsoundness before any release.** Root-cause the trail-undo on the `search.rs` MAC path when GAC-alldiff prunes interleave with binary AC-3 revisions across the enumerate-continuation. Until fixed, `Pruning::Ac3` with `max_solutions > 1` is unsafe on mixed-constraint problems (queens, futoshiki, any AllDifferent+binary model). Gate G-? behind this.
3. **Close the test blind spot.** Add (a) a **solution-set-invariance** property test: for queens8 and futoshiki-loose, assert the enumerate-all solution *set* is identical across all Pruning × Ordering with `budget=false`; (b) run `cargo bench --bench queens` (its `assert_eq!` already encodes ground truth) in a CI smoke lane — `cargo test --workspace` cannot see bench assertions.
4. **Re-baseline the criterion claim against `91bb8b0`, not a pass-2 intermediate.** Report the same-host sudoku ~1.8× wall-time regression (GAC overhead) explicitly and decide whether it's acceptable for the production `Ac3+Mrv` sudoku path.
5. **(Positive, ready to land)** Deleting the vacuous `backjumping` field is confirmed byte-neutral. The AssignmentBuilder B&B path is sound and materially faster — a genuine improvement, not a regression; keep it.

---

## 11. Convergence

**convergencePct ≈ 25.** The kernel composes and passes the pre-existing suite, and the sudoku slice + pure-constraint problems are byte-preserved — but the attack surfaced a **reproducible, deterministic soundness regression** (silently dropped solutions on the Ac3/MAC enumerate path with mixed constraints), independently confirmed by the repo's own queens bench panic, and invisible to the 139/139 evidence and the 9-combo sudoku parity the claim rested on. "Preserves behavior" is refuted as stated. The path to convergence is well-defined (amendments §10, especially the §10.2 blocker), but the plan element cannot be marked settled while a completeness bug ships in the default `Ac3` code path.

---

## 12. Evidence files (all under `scratchpad/`, this session)

- `parity_probe.rs`, `assign_probe.rs` — the two probes (compile identically on both trees).
- `parity-baseline.txt` / `parity-composed.txt` / `parity-composed-nobj.txt` — 170-row matrices (baseline, composed, composed-after-field-deletion) + `parity-diff.txt`.
- `assign-baseline.txt` / `assign-composed.txt` — assignment cost-parity at n=6/8/10/12.
- Baseline tree: `scratchpad/baseline-tree/csp-solver` (@91bb8b0). Composed tree: `scratchpad/composed-tree/csp-solver` (field-deleted) and `scratchpad/composed-bench/csp-solver` (pristine, for the panicking bench).
- Reproduce the money shot: `cd scratchpad/composed-bench/csp-solver && cargo bench --bench queens -- queens_all` → panics `left: 5, right: 92`.
