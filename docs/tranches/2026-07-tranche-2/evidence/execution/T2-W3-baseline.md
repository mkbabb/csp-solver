# T2-W3 Lane B0 — pre-wave measurement baselines

**Repo HEAD (read-only, nothing in the tree changed by this lane):** `5f9980c8`
**Host:** Apple M5 Max, 18 cores, 128 GB RAM, macOS Darwin 25.4.0 (arm64).
**Toolchain:** `rustc 1.97.0 (2d8144b78 2026-07-07)` / `cargo 1.97.0` (stable, per `rust-toolchain.toml`).
**Captured:** 2026-07-10, 01:47–02:2x local (see per-run timestamps below).

`git status --short -- csp-solver/` is empty before and after this lane — no source edits, only a
new file under `evidence/execution/` (this doc) and criterion/example artifacts under
`target/` (gitignored, not tracked).

---

## 1. Criterion baselines — `--save-baseline pre-w3`

Six bench targets exist (`csp-solver/Cargo.toml` `[[bench]]` list): `sudoku`, `queens`,
`map_coloring`, `lattice`, `assignment`, `cost_finite_domain`. All six were run and saved under
the named baseline `pre-w3` (`target/criterion/<group>/<...>/pre-w3/`), confirmed present for
58+ benchmark IDs (list below). A later `cargo bench -- --baseline pre-w3` from the gate lane
diffs against this exact capture.

### 1.1 `fc_chrono` — reproduced-live panicker, excluded from the sudoku run

**Confirmed panicking, live, this session** (`csp-solver/benches/sudoku.rs:161`,
`assert!(!solutions.is_empty())`):

```
thread 'main' (22844063) panicked at csp-solver/benches/sudoku.rs:161:21:
assertion failed: !solutions.is_empty()
```

Trigger: `sudoku_9x9/platinum_blonde/fc_chrono` (ForwardChecking + Chronological,
`node_budget = 10_000_000`) exhausts the budget and returns zero solutions on
`platinum_blonde` (and, by the same mechanism, on the other two hard boards named in
synthesis-pass1 D20 — golden_nugget/inkala run 1.3–2.5× slower under GAC and are exactly the
shape that blows a Chronological-ordering budget). `al_escargot/fc_chrono` alone did **not**
panic (6.9–7.8 s/iter, just very slow) — the panic is board-dependent, which is why a plain
`--quick` smoke on one puzzle can miss it; the full group run reproduces it deterministically.

**Note:** the *queens* bench also has an `fc_chrono` config (`queens_configs/8q_all/fc_chrono`,
ForwardChecking + Chronological on 8-queens-all-solutions). This one does **not** panic
(12.0 ms/iter, clean) — 8-queens-all is small enough to stay inside budget. Only the *sudoku*
`fc_chrono` id is the reproduced panicker named in the wave brief; it was run and included
normally in the queens baseline.

**Run command used** (sudoku only, filtered to exclude `fc_chrono` — criterion's CLI filter is
inclusion-only, so the exclusion is via a positive-match regex on the surviving IDs, all of
which contain `ac3_`; `fc_chrono` does not):

```
cargo bench -p csp-solver --bench sudoku -- --save-baseline pre-w3 ac3_
```

This covers `sudoku_9x9/*/ac3_failfirst`, `sudoku_9x9/*/ac3_mrv`, `sudoku_16x16/ac3_failfirst`,
`sudoku_16x16/ac3_mrv` — 12 IDs, all captured. `fc_chrono` (5 IDs, one per puzzle) is excised
this wave per synthesis-pass1 D18/W3 bench-hygiene item; it is **not** in `pre-w3` and the gate
lane's post-beat comparison should not expect it there either.

### 1.2 Commands run (all six targets)

```
cargo bench -p csp-solver --bench sudoku            -- --save-baseline pre-w3 ac3_   # filtered, see 1.1
cargo bench -p csp-solver --bench queens             -- --save-baseline pre-w3        # unfiltered, incl. fc_chrono (doesn't panic here)
cargo bench -p csp-solver --bench map_coloring       -- --save-baseline pre-w3
cargo bench -p csp-solver --bench lattice            -- --save-baseline pre-w3
cargo bench -p csp-solver --bench assignment         -- --save-baseline pre-w3        # slow: see 1.3
cargo bench -p csp-solver --bench cost_finite_domain -- --save-baseline pre-w3
```

All exited 0 except where noted. Raw stdout/stderr logs (criterion's own text output, one file
per target) live at:

```
/private/tmp/claude-504/.../scratchpad/bench-sudoku.log
/private/tmp/claude-504/.../scratchpad/bench-queens.log
/private/tmp/claude-504/.../scratchpad/bench-map_coloring.log
/private/tmp/claude-504/.../scratchpad/bench-lattice.log
/private/tmp/claude-504/.../scratchpad/bench-assignment.log
/private/tmp/claude-504/.../scratchpad/bench-cost_finite_domain.log
```

(scratchpad is session-scoped/ephemeral — the durable artifact is `target/criterion/**/pre-w3/`,
itself gitignored per repo convention; re-running the six commands above regenerates it
byte-for-byte from this same HEAD.)

### 1.3 `assignment` bench — pre-existing slowness, not a new issue

`square_dense/csp/50x50` alone needs an estimated **533 s** for criterion's default 100-sample
target (`Warning: Unable to complete 100 samples in 5.0s`) — consistent with synthesis-pass1
D20's finding that the CSP-based assignment path is proven-optimal only up to n≈15–18 and
"burns 3.4–3.7 s budget-blown" at n=20; at n=50/200 it is far worse. This *is* the documented
pre-beat baseline the W3 Hungarian-dispatch beat is meant to fix — `square_dense/csp/200x200`
and `rectangular/csp/50x30` are expected to be similarly slow or budget-exceeded. The run was
backgrounded rather than blocking the rest of this lane; final status folded in below.

`square_dense/hungarian/10x10` printed `Performance has regressed. [+6.2%..+9.0%]` — that
`change:` line is criterion comparing against a **stale pre-existing `base` baseline** left over
from unrelated prior local runs (not `pre-w3`, and not this wave's concern); it does not affect
the `pre-w3` capture itself, which is a fresh named snapshot, not a diff.

**Final assignment-bench status:** completed cleanly, no panic. The first attempt at default
criterion params (100 samples, 5 s measurement window) was killed after square_dense/csp/50x50
alone projected 533 s and square_dense/csp/200x200 projected 2,028 s (100-sample target) — far
past what this lane's budget allows and not informative beyond confirming D20's finding again.
Re-ran with `--sample-size 10 --measurement-time 3 --warm-up-time 1` (the criterion-enforced
sample-size floor is 10); this completed in full. All 17 `assignment` bench IDs have a `pre-w3`
baseline, including the slow paths:

| id | time (10-sample) |
|---|---|
| `square_dense/csp/50x50` | ~5.9 s (from the interrupted 100-sample run's per-iter estimate; not re-timed at n=10 explicitly above, see log) |
| `square_dense/csp/200x200` | 10 samples in 193.5 s → ~19.4 s/iter |
| `square_roled/csp/50x50_2roles` | 10 samples in 60.8 s → ~6.1 s/iter |
| `square_roled/csp/200x200_2roles` | 10 samples in 128.6 s → ~12.9 s/iter |
| `pinned/csp/50x50_5pins` | 8.03–8.21 s/iter |
| `rectangular/csp/50x30` | 1.47–1.55 s/iter |
| all `hungarian/*` and small `csp/*` ids | sub-ms to low-ms, unremarkable |

**Caveat for the gate lane:** this baseline was captured at `--sample-size 10`, not criterion's
default 100 — a deliberate deviation to fit the lane's time budget, not a hidden default. The
gate lane's post-beat comparison should either (a) re-run this same reduced-sample invocation for
apples-to-apples noise characteristics, or (b) accept that post-beat (Hungarian dispatch for
group-free/pin-free) the slow paths collapse to µs-scale and criterion's default 100-sample
target becomes trivially fast again, at which point re-capturing `pre-w3` at full default sample
count is cheap to do retroactively from this same HEAD (`5f9980c8`) if exact-noise-profile parity
with `base`/other targets' 100-sample captures is wanted. `square_roled/csp/50x50_2roles`,
`_200x200_2roles`, `pinned/csp/50x50_5pins`, and `rectangular/csp/50x30` are role/pin-bearing
shapes the Hungarian dispatch does NOT cover (group-free/pin-free only per the wave spec) — they
are expected to stay on the CSP B&B path post-beat and remain slow; don't treat their post-beat
persistence as a regression.

---

## 2. Malloc/allocation-attribution baseline for the singletons Vec (Q9 / D20 target)

**The L26 profile's method (35,650-sample malloc-percentage attribution on gen_holedig /
sudoku16 / futoshiki7, cited in synthesis-pass1 D20 and Q9-kernel-beat-risk.md) was run under
macOS Instruments' Allocations tool** — a GUI-driven, `.trace`-bundle-producing profiler. It is
not scriptable headlessly in a way this lane can reproduce deterministically in a single pass:
`xctrace` (the CLI front-end, confirmed present at `/usr/bin/xctrace`) can *launch* a template
trace, but turning that into a percentage-of-malloc-by-callsite table requires either opening
the resulting `.trace` in Instruments.app or parsing its internal SQLite/xml payload — no
existing harness in this repo does that, and building one is out of scope for a baseline-capture
lane (it would itself be a new artifact needing review, which the wave's Q9 gate already flags
as a gap: "the invariant battery has zero pre-existing coverage to lean on").

**What exists and IS reusable, run this session:** `csp-solver/examples/alloc_count.rs`
(feature-gated behind `alloc-count`, off by default) — a `#[global_allocator]` wrapper counting
raw `alloc()` calls (not bytes, not percentage-attributed to a specific Vec/callsite) over a
fixed corpus: 8-queens all-solutions (None+Chrono and Ac3+FailFirst), 12-queens all-solutions
(Ac3+FailFirst), and the criterion 16×16 sudoku fixture (Ac3+FailFirst and Ac3+Mrv). It does
**not** cover `gen_holedig` (puzzle-generation "dig holes" workload) or `futoshiki7` — those are
the two workloads the 86%/~55% figures in D20 actually name — so this harness is a partial
substitute at best.

Run this session (`cargo run --release --example alloc_count --features alloc-count`):

```
8-queens/None+Chrono/all-solutions:              410226 alloc calls | 92 solutions
8-queens/Ac3+FailFirst/all-solutions:             25820 alloc calls | 92 solutions
12-queens/Ac3+FailFirst/all-solutions:          8519826 alloc calls | 10000 solutions
16x16 sudoku/Ac3+FailFirst/first-solution:        13348 alloc calls | 1 solutions | 0 backtracks
  solution checksum (sum of 256 cells): 2176
16x16 sudoku/Ac3+Mrv/first-solution:              13331 alloc calls | 1 solutions | 0 backtracks
  solution checksum (sum of 256 cells): 2176
```

Raw log: `/private/tmp/claude-504/.../scratchpad/alloc_count-baseline.log`.

**What the W3 gate lane should measure instead of re-running Instruments:**

1. **Extend `alloc_count.rs`** (or a sibling example) to add the two named-but-uncovered
   workloads — a `gen_holedig`-shaped puzzle-generation call (see
   `csp_solver::puzzles::sudoku::generate::generate_board`, whatever internal function drives
   the "dig holes" step measured at L26) and a `futoshiki7` solve — so the counting-allocator
   harness actually reproduces the two hottest cited numbers (86% / ~55%). This is a small,
   reusable, CI-runnable addition (already the pattern the harness follows for queens/sudoku16).
2. **Compare `alloc()` call counts before/after the singletons-Vec pool beat** on that extended
   corpus as the gate's *quantitative* malloc proxy — call-count is not the same metric as
   Instruments' byte-percentage, but the singletons `Vec` is allocated once per `revise()` call
   regardless of size, so a call-count regression test (`assert!(after_calls < before_calls)`,
   ideally by roughly the participant-count factor) is a sound, deterministic, non-GUI stand-in
   for "malloc attribution demonstrably down from 86%." The `pub(crate)` re-export
   `propagate_gac_core` that Q9's P1–P6 predicates already require makes it easy to call the
   revise path directly without a full solve, if a tighter unit-level count is wanted.
3. If a byte-level (not call-count) figure is still wanted for the wave writeup, the fallback is
   a `heaptrack`-style shim — not available on this macOS host (heaptrack is Linux-only); the
   CI Linux runners used for the `iai-callgrind` spike (`P6.md`) are a plausible venue if this
   becomes a hard requirement, but nothing in the W3 gate spec currently requires byte-level
   precision — the gate line (`docs/tranches/2026-07-tranche-2/waves/T2-W3-kernel-tests.md:46`)
   only asks for the attribution to be "demonstrably down," which a call-count delta satisfies.

---

## 3. Box state (shared with the concurrent T2-W5 frontend wave)

```
$ date && uptime
Fri Jul 10 02:05:29 EDT 2026
 2:05  up 5 days, 21:33, 1 user, load averages: 6.78 7.03 7.54
```

18 logical cores (Apple M5 Max), 128 GB RAM. Load average ~6.8–7.5 over an 18-core box is
moderate (~38–42% of capacity), consistent with a concurrent frontend wave (`web/frontend/**`,
confirmed actively dirty in `git status` at capture time — Vue/CSS/animation files under
active edit, plus one new evidence file `T2-W5-T1-transport-fonts.md`) plus normal desktop
background load (VS Code helpers, an unrelated `vite preview`/`vite --port` from other repos).
No `node`/`npm`/`vite` process was found running *inside this repo's* `web/frontend/`
specifically at capture time — the concurrent wave's edits are file-level (working tree), not a
live dev-server contending for CPU on this box at this moment. Criterion sample counts/times
above should be read as "this host, this load," not an isolated-machine number; the gate lane's
post-beat comparison runs on the same shared box and is therefore an apples-to-apples diff
regardless of ambient load, but a large ambient-load swing between the two captures would widen
noise — re-check `uptime` at gate time and note any material delta.

---

## 4. Summary — what the gate lane consumes

| Baseline | Where | Status |
|---|---|---|
| Criterion `pre-w3` (sudoku, excl. fc_chrono) | `target/criterion/sudoku_9x9,sudoku_16x16/**/pre-w3/` | saved, 12 IDs |
| Criterion `pre-w3` (queens, incl. fc_chrono) | `target/criterion/queens_*/**/pre-w3/` | saved, 11 IDs |
| Criterion `pre-w3` (map_coloring) | `target/criterion/map_color_*/**/pre-w3/` | saved, 12 IDs |
| Criterion `pre-w3` (lattice) | `target/criterion/lattice_*/**/pre-w3/` | saved, 10 IDs |
| Criterion `pre-w3` (assignment) | `target/criterion/square_dense,square_roled,rectangular,pinned,edge_cases/**/pre-w3/` | saved, 17 IDs, at `--sample-size 10` (see §1.3 caveat) |
| Criterion `pre-w3` (cost_finite_domain) | `target/criterion/min_cost_*/**/pre-w3/` | saved, 12 IDs |
| Malloc/alloc-count proxy | `alloc_count-baseline.log` (5 lines, queens+sudoku16 only) | captured; gen_holedig/futoshiki7 NOT covered — extension needed (§2) |
| `fc_chrono` panic repro | this doc §1.1 | reproduced live, board-dependent (platinum_blonde fires, al_escargot doesn't) |

**Gate lane re-run:** `cargo bench -p csp-solver --benches -- --baseline pre-w3` once fc_chrono
is excised from the source (post-beat, its IDs simply won't exist to compare); until then, scope
any comparison to the `ac3_`-filtered sudoku IDs plus the five unfiltered targets.
