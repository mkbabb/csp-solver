# T4-W6 · L4 — Solver micro-rows (the §7 perf-audit addendum)

Lane L4 of wave T4-W6. Scope: the three identity-gated solver micro-rows stamped
to W6 by the pre-execution perf audit (README §7 → W6, `evidence/perf/p2-solver-backend.md`):
**GENREUSE**, **VALUES**, **MRV**. Each row lands only if the dealt boards *and*
the solve results stay byte-identical pre/post; otherwise it reverts. All three
hold. No frontend source touched (the concurrent T4-WM edits web/frontend); the
change surface is six `csp-solver` files plus the smallvec dependency.

Machine: darwin 25.4.0, aarch64 (18-core Mac17,7), cargo nightly, native
`--release opt-level=3`. Allocation counts are deterministic (host-independent);
wall times are load-stamped (the campaign's own workflows ran alongside).

Base tree: the current working tree as found (L1's futoshiki axis + L2's grading
regen already applied; lean wasm 87,152 B, `csp-solver` 0.5.0).

---

## Identity harness — the gate

`scratchpad/l4-identity/src/identity.rs`: a standalone probe (`path`-linked to
`csp-solver`, zero repo-tree mutation) that deals a fixed seeded sweep through
the **slow hole-dig path** GENREUSE reshapes, then solves every dealt board
under both the FailFirst gen config and the Mrv production config — exercising
VALUES on every solve and MRV on the Mrv solves. Every identity-relevant field
(dealt board, solution set, backtracks, nodes) folds into a 64-bit FNV digest;
allocation counts and wall times are reported separately and are *expected* to
move.

Sweep: sudoku `generate_board_seeded` n∈{2,3,4} × Easy/Medium/Hard × seeds (4×4
& 9×9 five seeds each, 16×16 Easy/Medium two seeds + Hard one — the slow-dig is
seconds/deal at 16×16); futoshiki `generate_futoshiki_difficulty_seeded` n∈{4..7}
× tier × three seeds; a five-seed 9×9-Medium alloc headline. **71 identity lines.**

The digest re-runs the entire sweep at each step and compares against the base
tree captured before any edit:

```
baseline (base tree)          DIGEST 7d816e7f86b9e98e
after GENREUSE                DIGEST 7d816e7f86b9e98e   diff(IDENT) empty
after GENREUSE + VALUES       DIGEST 7d816e7f86b9e98e   diff(IDENT) empty
after GENREUSE + VALUES + MRV DIGEST 7d816e7f86b9e98e   diff(IDENT) empty
```

`diff` over the 71 `IDENT` lines is empty at every step — dealt boards and both
solve traces byte-identical. **All three rows LANDED.** No revert.

Why identity holds by construction, per row:
- **GENREUSE** — the dig sequence and each uniqueness verdict depend only on the
  solve's solution *count* (≤2), which reusing the finalized skeleton cannot
  perturb: the GAC matching warm-start is a thread-local, correctness-invariant
  hint (`solver/gac/scratch.rs`), and `solve_with_given` resets every domain on
  entry. The dealt board is a pure function of `(n, difficulty, seed)`.
- **VALUES** — the `SmallVec` collect yields the same values in the same
  iteration order as the `Vec`; the feasibility policy leaves the order
  untouched. Trajectory unchanged.
- **MRV** — `var_wdeg[v]` is the same sum walked in the same order as the old
  per-node loop, so each Mrv score is bit-identical f64. The Mrv-config solve
  traces confirm it.

---

## ROW 1 — GENREUSE (LANDED)

`generate_board_slow_with_rng` rebuilt the whole Sudoku CSP — `Csp::new` + 27
`add_all_different` + `finalize` (adjacency CSR + var-constraint map) — for every
hole candidate (`generate.rs:306`, ~one solve per removed cell). The constraint
graph is board-independent; only the given cells change. The fix builds the
finalized skeleton **once** per deal and re-seeds the givens per solve.

- `puzzles/sudoku/csp.rs` — split `create_sudoku_csp` into the board-independent
  `sudoku_csp_skeleton(n)` and the per-board `sudoku_given(board)`;
  `create_sudoku_csp` now composes them (signature unchanged, no call-site churn).
- `puzzles/sudoku/generate.rs` — the slow path builds one `sudoku_csp_skeleton`
  and reuses it for both the seed-solution solve and every hole candidate,
  re-seeding via `sudoku_given` (`solve_with_given` resets domains on entry).

Allocations per deal (deterministic, seed=1), base → after all three rows:

| board | tier | base allocs | after | reduction |
|---|---|--:|--:|--:|
| 4×4 | Easy | 831 | 284 | 2.9× |
| 4×4 | Medium | 1,609 | 358 | 4.5× |
| 4×4 | Hard | 2,534 | 510 | 5.0× |
| 9×9 | Easy | 15,953 | 2,460 | 6.5× |
| 9×9 | Medium | 39,073 | 5,285 | 7.4× |
| 9×9 | Hard | 68,446 | 9,360 | 7.3× |
| 16×16 | Easy | 147,331 | 11,136 | 13.2× |
| 16×16 | Medium | 362,792 | 26,143 | 13.9× |
| 16×16 | Hard | 678,732 | 57,334 | 11.8× |

The win scales with candidate count — biggest on the resident 16×16 board. On
the 9×9-Medium headline (the audit's live-dig heavy cell, five seeds):

```
base   : allocs 37,738–38,875   bytes ~3.68–3.78 MB   best wall 5.27 ms
after  : allocs  4,995– 5,259   bytes ~0.49–0.51 MB   best wall 3.44 ms
```

Per-row alloc attribution on 9×9-Medium (seed=1): base 38,875 → GENREUSE 6,500
→ +VALUES 5,259 → +MRV 5,259. **GENREUSE removes ~32,300 allocs/deal** (the
per-candidate CSP rebuilds); the residual is the ~47 internal solves' own
allocations.

**Wall, stated honestly.** Best-of-five wall on 9×9-Medium: 5.27 → 3.44 ms
(~1.8 ms/deal) on a loaded box — below the audit's ~3.5 ms estimate because
native malloc is cheap and the box carried load; the deterministic alloc
reduction (7.4× here, scaling to 14× at 16×16) is the load-immune figure. In
wasm, where per-node heap allocation is costlier, the wall share is larger — a
browser-lane measurement, not this native one.

**Scope note.** GENREUSE is Sudoku-only, as the audit measured (`generate.rs:306`).
Futoshiki's `csp_from_board` bakes fixed cells into the CSP as `add_equals`
constraints, so its dig skeleton is *not* board-independent; reusing it would
demand restructuring fixed-cells into `given`, a larger change the audit neither
scoped nor measured (futoshiki deals are 0.05–0.55 ms). Left untouched.

**Correction to the stamped estimate.** The audit's "38,147 → ~600 allocs/deal"
conflated per-*solve* (~590/solve, `p2` census) with per-*deal*; the honest
post-figure is ~5,300/deal on 9×9-Medium (still a 7.4× cut). No inflation.

---

## ROW 2 — VALUES (LANDED, size cost disclosed)

`solver/search.rs:242` — the per-node domain snapshot `let values: Vec<_> =
domain.iter().collect()` becomes `SmallVec<[D::Value; 16]>`. Sixteen inline slots
cover every shipped puzzle heap-free (sudoku's 16×16 is the largest domain at 16
values); larger domains spill to the heap exactly as the `Vec` did. `order_values`
derefs to the slice, so the branch-and-bound sort is unchanged.

- `Cargo.toml` (workspace) + `csp-solver/Cargo.toml` — `smallvec = "1"`
  (pure-Rust, wasm-compatible, resolved 1.15.2).
- `solver/search.rs` — the collect + `use smallvec::SmallVec`.

Alloc effect: ~1 alloc/node removed. On 9×9-Medium it trims ~1,240 allocs/deal
(6,500 → 5,259, seed=1) across the ~47 internal solves; on futoshiki (which
GENREUSE leaves alone) it is the *only* mover — ~5–6%:

```
futoshiki (seed=1)   base → after
  n=5 Easy    4,763 → 4,498     n=5 Hard   9,453 → 9,006
  n=7 Easy   18,435 → 17,462    n=7 Hard  39,125 → 37,129
```

**Size cost — flagged for the lead.** VALUES is the *only* row that moves the
lean wasm, and it moves it a non-trivial **+2,869 B** (isolated by reverting just
this row and rebuilding: GENREUSE+MRV alone measure 87,126 B, all three 89,995 B).
It clears the CI budget (89,995 < 93,000, 3,005 B headroom) and passes identity,
so on the stated revert criterion (identity only) it **lands** — but the trade is
+2.87 KB of monomorphized SmallVec code for a win the audit rated "small (<~5%
wall, sub-ms solves already)". If a later size pass tightens the budget, VALUES
is the first micro-row to reconsider; its in-browser wall benefit (where wasm
malloc is dearer) is unmeasured here and would inform that call. Recommend the
lead weigh it explicitly.

---

## ROW 3 — MRV (LANDED, size-neutral)

`ordering.rs` — the `Ordering::Mrv` branch re-summed `Σ constraint_weights[cid]`
over each stacked variable's incident constraints at *every* node. The weights
are frozen at 1.0 (no dom/wdeg bumping is wired — confirmed: `constraint_weights`
is set once in `finalize` and never mutated during search), so the sum is static.

- `ordering.rs` — new `precompute_var_wdeg(ordering, weights, var_cids)` computes
  the per-variable weighted degree once, returning an empty vec for the orderings
  that ignore it (Chronological / FailFirst pay nothing — not one add).
  `select_variable` drops `(constraint_weights, var_constraint_ids)` for a single
  `var_wdeg: &[f64]` lookup.
- `solver/search.rs` — the `Kernel` carries the precomputed `var_wdeg`; both entry
  points compute it at search entry. The `&mut constraint_weights` seam stays in
  the signatures (documented: a future dom/wdeg bump must recompute `var_wdeg`).

Production consumes Mrv (`wasm/src/sudoku.rs:148`, `wasm/src/futoshiki.rs:241`),
so this is the browser solve path. Gain is marginal (the audit's ~41 self-samples
— the per-node inner sum) and alloc-neutral (compute, not allocation: 9×9-Medium
allocs are identical pre/post-MRV, 5,259 both). Byte-neutral (the removed
inline sum offsets the new function: GENREUSE+MRV = 87,126 B, −26 B vs L1).

---

## iai gate — CI-Linux-only (cannot measure locally)

`benches/iai_gate.sh` golden **1529452 ±2%**. The bench (`iai_queens.rs`,
8-queens first-solution, **Ac3 + FailFirst**) needs callgrind; Valgrind does not
run on arm64-macOS (`which valgrind` → absent), so no instruction count can be
produced on this box. The bench compiles clean against the new
`select_variable`/`Kernel` signatures (`cargo build --benches` green).

Per-row instruction-count reasoning for the CI re-measure:
- **GENREUSE** — generation only; the queens bench never deals. Zero impact.
- **MRV** — the queens path is FailFirst: `precompute_var_wdeg` early-returns an
  empty vec (no sum, no alloc) and `select_variable`'s FailFirst branch is
  unchanged. A handful of instructions once per solve. ≈ Zero.
- **VALUES** — on the queens path (domain ≤ 8, fully inline), the `SmallVec`
  collect **removes a malloc/free pair per node** the `Vec` collect paid. This is
  a legitimate *decrease*; whether it exceeds −2% over 8-queens' node count is for
  CI to measure.

If the CI iai lane exits the band, it is VALUES's alloc removal (a real win, not
a regression) — **do not auto-re-mint**; the lead re-baselines `iai_queens.baseline`
deliberately with the attribution above, per the gate's own re-baseline rule.

---

## wasm ship build + byte budget

Built with the only sanctioned recipe from repo root:

```
$ make -C csp-solver/wasm wasm
    Finished `wasm-release` profile [optimized]
[INFO]: Optimizing wasm binaries with `wasm-opt`… ✨ Done
```

```
bytes:  89,995 B   (base 87,152 B; delta +2,843 B, all from VALUES/smallvec)
sha256: 1402f40a68edb71b12e8687e482ea4be136cc6ba0ae5297f10a9b344ae0cb8c6
file:   csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm
```

CI byte budget (`.github/workflows/ci.yml`, "lean raw-size budget (fail >93 KB)"):
threshold 93,000 B. **89,995 < 93,000 — clears with 3,005 B headroom.** Per-row:
GENREUSE + MRV net **−26 B** (87,126 B); VALUES **+2,869 B** → 89,995 B.

---

## Full rust battery (verbatim)

```
$ cargo fmt --check                                       → FMT CLEAN
$ cargo clippy --workspace --all-targets -- -D warnings   → clean
    (only the pre-existing proc-macro-error2 future-incompat NOTE, not our code)
$ cargo test --workspace                                  → 0 failures
    (all suites ok; the slow tests/gac_kernel_beats 12/12 in 69.96s,
     oracle_and_invariance 7/7, sudoku_generate 10/10, solver 41/41,
     futoshiki 11/11, futoshiki_difficulty 3/3, sudoku 7/7 …)
$ cargo run -p csp-solver --release --example zzz_gen_truth_probe
    VERDICT: PASS — every banked tier orders honestly (exit 0)
$ cargo run -p csp-solver --release --example verify_bank_uniqueness
    VERDICT: PASS — all boards unique & solvable   (45/45, exit 0)
```

The two generation gates (L2's, which drive generation hard) confirm GENREUSE
leaves the grading and bank-uniqueness intact.

---

## Files changed (L4)

- `csp-solver/src/puzzles/sudoku/csp.rs` — `sudoku_csp_skeleton` + `sudoku_given`
  split; `create_sudoku_csp` composes them (GENREUSE).
- `csp-solver/src/puzzles/sudoku/generate.rs` — slow-dig reuses one skeleton
  (GENREUSE).
- `csp-solver/src/solver/search.rs` — `SmallVec` value snapshot (VALUES);
  `Kernel.var_wdeg` precompute (MRV).
- `csp-solver/src/ordering.rs` — `precompute_var_wdeg`; `select_variable` takes
  `var_wdeg` (MRV).
- `Cargo.toml` (workspace) + `csp-solver/Cargo.toml` — `smallvec = "1"` (VALUES).
- `Cargo.lock` — smallvec 1.15.2.
- `csp-solver/wasm/pkg/*` — regenerated by the sanctioned `make wasm`.

## Disposition

| Row | Disposition | Identity | Gain (measured) | Size |
|---|---|---|---|---|
| GENREUSE | **LANDED** | byte-identical | 9×9-M allocs 39.1k → 5.3k (7.4×); 16×16-M 362.8k → 26.1k (13.9×); ~1.8 ms/deal wall on a loaded box | −0 B |
| VALUES | **LANDED** (size flagged) | byte-identical | ~1 alloc/node; ~1.24k/deal on 9×9-M; ~5–6% on futoshiki | **+2,869 B** |
| MRV | **LANDED** | byte-identical | per-node wdeg sum → one lookup (audit ~41 samples); Mrv is the browser path | −26 B (with GENREUSE) |

Not in scope (audit-certified at optimum, no lever): release-profile flags, PGO,
the GAC Régin core, thread-local scratch.

Rerun: `cd scratchpad/l4-identity && cargo run --release --bin identity` (the base
digest `7d816e7f86b9e98e` is the identity oracle).
