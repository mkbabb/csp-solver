# T3-W5 L1 — assignment A/B (hungarian → hand-rolled Kuhn-Munkres)

The quiet-box before/after owned by the library lane's KM-swap (R-12). Ratios,
not absolute SLAs — the machine is the owner's dev box, numbers are only
meaningful relative to each other in the same session.

## Method

- **Bench**: `cargo bench -p csp-solver --bench assignment -- '(square_dense|rectangular)/csp'`
- **Targets**: only the LAP-dispatch path (group-free / pin-free `csp` arms) —
  these are the sole benches the swap touches (`solve()` → `solve_lap()` →
  `kuhn_munkres::minimize`). The `square_roled/csp/50x50_2roles` B&B pathology
  (G6, ~745 s) and the `pinned` / `edge_cases` groups are filtered away by the
  regex (they route to `solve_csp`, unchanged by this swap).
- **Quiet-box**: `pgrep -f "cargo bench|criterion|node.*probe"` polled to clear
  before each run (the concurrent T3-W8 FE-perf probe lane was active; both runs
  waited it out).
- **Before**: unmodified tree (hungarian-backed `solve_lap`). **After**: the
  hand-rolled `builder/kuhn_munkres.rs`. Same bench harness, same LCG seeds; the
  two `hungarian::minimize` reference-floor arms were removed from the bench
  (their crate is gone) — the `csp` arms are unchanged and are the A/B subjects.
- criterion default config (100 samples, 3 s warm-up). Median (mid estimate) banked.

## Numbers

| target | before — hungarian | after — hand KM | ratio (after/before) | speedup |
|---|---|---|---|---|
| `square_dense/csp/10x10`   | 3.3381 µs | 1.6372 µs | 0.490  | 2.04× |
| `square_dense/csp/50x50`   | 598.67 µs | 88.658 µs | 0.148  | 6.75× |
| `square_dense/csp/200x200` | 92.223 ms | 1.7868 ms | 0.0194 | 51.6× |
| `rectangular/csp/10x20`    | 3.5445 µs | 1.8595 µs | 0.525  | 1.91× |
| `rectangular/csp/50x30`    | 482.23 µs | 181.56 µs | 0.377  | 2.66× |

## Reading

The hand-rolled O(rows²·cols) potential/augmenting-path solver is **faster than
`hungarian` 1.1.1 at every measured point**, and the gap widens with n: 2× at
n=10, ~7× at n=50, ~52× at n=200. `hungarian` 1.1.1's ndarray-backed inner solve
carries a large constant and scales worse on the augmented `n × (m+n)` matrix the
caller builds (the sentinel columns double the width); the hand impl works the
flat slice directly. Outliers stayed ≤10 % (background FE preview servers); the
medians are stable and the ratios are far larger than any noise band, so the
direction is unambiguous — the swap is a strict performance win on top of the
9→ dependency prune.

## Dependency mass (the other half of the win)

`cargo tree -i hungarian` → *no match* post-swap; `grep -c hungarian Cargo.lock`
→ 0. Crates dropped from the lock (7): `hungarian`, `ndarray`, `num-complex`
(the dead-code crate — complex algebra compiled for an integer LAP),
`matrixmultiply`, `num-integer`, `rawpointer`, `fixedbitset`.

**Correction to the wave's "9-crate" estimate**: `libm` and `autocfg` do **not**
drop — they are pulled by `num-traits`, which survives via `criterion` /
`plotters` / `proptest` / `wasm-bindgen-test` (all dev-deps, independent of
hungarian). They were never exclusive to the hungarian subtree, so the true
delta is **7 crates**, not 9. The two headline wins — `num-complex` (dead) and
`ndarray` (the graph's largest no-dev crate) — both land.
