# A7 — Wave Re-Audit W3 at HEAD (3b75eca2)

Scope: Q9 battery green, frozen counts intact, substrate gone, iai lane healthy,
bench suite state, gac_timing_probe now part of the story. Read-only.

## HOLDS

### H1 — Q9 kernel-beat battery green
`cd csp-solver && cargo test --test gac_kernel_beats` → **13 passed; 0 failed; 0
ignored** (finished 49.60s). All P1–P6 cases green:
p1_warm_cold_pruning_parity_single_call, p1_warm_cold_parity_multi_call_universe_shrink,
p2_cross_universe_scratch_reset, p3_generic_finite_domain_string_monomorphizes_and_solves,
p4a/p4b/p4c/p4d, p5_bnb_node_counts_frozen, p5_n20_lap_proven_optimal,
p5_queens8_enumerate_92, p6_sudoku/p6_futoshiki. File header at
`csp-solver/tests/gac_kernel_beats.rs:1-16` traces to
`docs/tranches/2026-07-tranche-2/evidence/pass3/Q9-kernel-beat-risk.md`.

### H2 — Frozen counts intact
Asserted-and-passing in `tests/gac_kernel_beats.rs`:
- n=10 assign: `nodes_explored == 506`, `backtracks == 515` (:318–319)
- n=15 assign: `nodes_explored == 4016`, `backtracks == 4043` (:323–324)
- n=20 assign: `nodes_explored == 1_000_000` (budget cap), `backtracks ==
  1_000_019`, `budget_exceeded` true (:328–333)
- n=20 LAP: `nodes_explored == 0` (Hungarian dispatch, no search), proven-optimal
  cost, columns pairwise-distinct, beats budget-blown B&B best-so-far (:351–373)
- 8-queens enumerate: `== 92` (:403)
The `p5_bnb_node_counts_frozen` doc calls these "a live regression tripwire" (:315).

### H3 — Substrate truly gone
`src/solver/nogoods.rs`, `restart.rs`, `heuristic.rs` — all **GONE** (`ls` fails
on all three; matches the `D` entries in git status). Grep for
`nogood|Nogood|NoGood|restart|Restart` across `src/`,`tests/` yields a single hit:
`src/solver/gac/mod.rs:231` — a comment "clear the stamps once and restart at 1"
(a counter-reset, not the substrate). No `backjumping|Nogood|nogoods|restart`
symbols in `src/config.rs` or `src/solver/mod.rs`. `src/solver/` now holds only:
ac3.rs, gac/, mod.rs, monotonic.rs, optimize.rs, propagate.rs, search.rs.

### H4 — iai lane healthy (last CI)
Latest CI run **29115123183** at HEAD `3b75eca2`, conclusion **success**, 2m26s
(`gh run list --limit 1`). Per-job (`gh run view 29115123183 --json jobs`): all
**9 lanes green** — e2e, rust, frontend, py-runtime, py-compile, lint, **iai**,
twiggy, wasm. iai lane not skipped; it ran and passed.

### H5 — bench suite state
`csp-solver/benches/`: assignment.rs, cost_finite_domain.rs, lattice.rs,
map_coloring.rs, queens.rs, sudoku.rs (criterion, `harness = false`) + iai_queens.rs
(iai-callgrind, `harness = false`). Cargo.toml:43 criterion workspace dep;
iai-callgrind 0.16.1 dev-dep (:49) pinned in lockstep with the runner
(Cargo.toml:43–85). iai_queens is Linux/CI-only (Valgrind can't run arm64-macOS;
no-ops off CI — Cargo.toml:44–45,80–85). Queens smoke assert
(`assert_eq!(92/14200)`) runs in the `rust` lane via
`cargo bench -p csp-solver --bench queens -- --test` (ci.yml:107).

### H6 — gac_timing_probe now part of the story
`csp-solver/examples/gac_timing_probe.rs` committed, **builds clean**
(`cargo build --example gac_timing_probe` → Finished). It's the first-party home
of the GAC aggregate speedup (header :1-24: "committed home of the GAC aggregate
speedup number… the 13.36×-class figure"). Wired into the story:
- `docs/benchmarks.md:14` — "**12.6–12.7× aggregate** (12.58× / 12.73×)…
  measured first-party on the **50-board** post-W4 corpus… by the committed
  `gac_timing_probe` example (`measured at ede25188, Apple M5 Max, 2026-07-10`)".
- `docs/benchmarks.md:20` — table row cites `gac_timing_probe @ ede25188`.
- `docs/benchmarks.md:24` — disclosed minority now first-party & deeper: Al
  Escargot 0.40–0.42×, Golden Nugget 0.56×, Inkala 2010 0.30–0.33× (1.8–3.3×
  slower ON).
- `docs/tranches/2026-07-tranche-2/evidence/execution/T2-WGATE-gac-probe.md` —
  the recertification: inherited 13.36× "survives as first-party-corroborated"
  on the 50-board corpus; two runs recorded.

## DRIFTS

### D1 (material) — README headline still carries the RETIRED GAC figure
`README.md:113` presents as the live headline: "GAC default-ON gives a **13.36×
aggregate over the 112-board A/B corpus**… 3 of 5 named hard 9×9 boards run
**1.3–2.5× slower** ON." But `docs/benchmarks.md:14,24` (edited in the **same**
HEAD commit 3b75eca2) **retires** exactly this: first-party number is **12.6–12.7×
on 50 boards**, minority cost is **1.8–3.3× slower** (deeper than 1.3–2.5×). WGATE
updated benchmarks.md and the README's own inherited-trust hedge but left the
numeric headline stale — README now contradicts benchmarks.md at HEAD.
`git log -1 -- README.md` and `-- docs/benchmarks.md` both = 3b75eca2, so this is
an intra-commit inconsistency, not a lag. The stale 13.36×/112-board/1.3–2.5×
triplet is the current live headline; benchmarks.md is the correct source.
(Root `CLAUDE.md` is gone — folded to README.md at W7 per plan; the stale figure
lives only in README.md, not in any CLAUDE.md.)

### D2 (process) — pass-1 encapsulation artifacts not materialized
`scratchpad/tranche3/pass1/` is absent/empty (both `ls` and `find … -type d`
return nothing under scratchpad/tranche3). The "consume, don't duplicate" input
this lane was told to draw on isn't on disk yet. `audit32/` also didn't exist
(created by this lane). Not a repo defect — a coordination note for tranche-III
authoring: the parallel pass-1 loop hadn't flushed at this lane's runtime.

## Verdict
5 of 6 charges hold clean at HEAD. One material documentation drift (D1:
README.md:113 retired 13.36×/112-board/1.3–2.5× headline vs benchmarks.md's
first-party 12.6–12.7×/50-board/1.8–3.3×) is the single actionable finding for
tranche-III authoring. gac_timing_probe is fully in the story and the correct
fix-source for D1.
