# Benchmarks

## Posture

This document reports only what is reproducible and stamped. Two classes of pre-tranche number were retired as non-reproducible:

- **The 7–57× "Rust vs Python" headline.** It was not apples-to-apples (each solver measured under a different config), and there is no longer a Python solver to compare against -- `csp_solver` (Rust) is the sole engine. The specific claim of Platinum Blonde at 2.57 ms (against 0.44 ms measured) was among the non-reproducible entries.
- **The "10–25% optimization headroom" profile band.** Refuted at load: it was load-average-50 contention noise. On a quiet host, `lto=fat + codegen-units=1 + strip` alone is +16–17% slower and the package nets ≈0% (`evidence/synthesis-pass3.md` §1 #14). CI therefore keeps the default release profile with none of those levers.

Numbers below trace either to a named campaign artifact under `docs/tranches/2026-07-grand-uplift/evidence/`, or to a command run here and quoted with its stamp. Stamp shape for locally-run commands: `measured at d9781e29, Apple M5 Max, 2026-07-06`.

## GAC default-ON: the corpus result and its cost

GAC-in-AllDifferent is default-ON, gated at live-participant count ≥ `GAC_MIN_PARTICIPANTS` (3). The decision rests on a 113-board A/B corpus -- 5 named hard 9×9, all 107 template-bank puzzles (N=2..4), and one N=5 -- solved under the exact production config (`Ac3 + Mrv`), GAC off vs on (`evidence/synthesis-pass3.md` row 2; `waves/W2-gac-search.md`):

| Measure | Value | Source |
|---|---|---|
| Corpus aggregate speedup (ON) | **13.36×** (14.2–14.6× across reruns) | `synthesis-pass3.md` row 2 |
| Search nodes, off → on | 41,807 → 5,948 | ibid. |
| Best single-board win | N=4, up to ~112× | ibid. |

**The minority cost, disclosed:** 3 of the 5 named hard 9×9 boards are reproducibly slower with GAC on -- Al Escargot 0.50×, Golden Nugget 0.79×, Inkala 2010 0.40× (i.e. 1.3–2.5× slower). The aggregate win is dominated by the N=4 boards; the hard-9×9 minority pays GAC's per-propagation constant. The default stands because the corpus aggregate and the 16×16 failure-to-success result outweigh it, and every N-keyed gate tested was ≤ blanket-ON.

**The gate threshold:** `GAC_MIN_PARTICIPANTS` swept 2–6 stays within ~7%; at 9 it is 1.79× worse. 3 is retained.

## The criterion tradeoff on hard 9×9

Isolated criterion, same host, byte-identical solve counts: `sudoku_9x9/al_escargot/ac3_failfirst` runs ≈370 µs baseline → ≈677 µs composed -- **≈1.8× slower** -- attributable to GAC per-propagation overhead (`evidence/kernel-behavior-preservation.md` §criterion; `synthesis-pass3.md` row 1). This is the same constant cost the corpus minority pays, measured in isolation. It is a disclosed, accepted tradeoff for the aggregate win, not a regression to fix.

## Kernel soundness parity

The unified search kernel is verified sound, not merely fast. Evidence from `evidence/kernel-soundness-closure.md`:

- **Solution-set invariance.** The enumerate-all solution *set* is identical across all 12 Pruning × Ordering combinations at `budget=false`: queens8 = 92, queens12 = 14,200, futoshiki_loose = 288, futoshiki_constr = 16 (§2, §6). Standing guard: `tests/solution_set_invariance.rs`.
- **False-UNSAT closed.** The 113-board GAC corpus goes 0/113 false-UNSAT post-fix; the revert control reproduces 26/113, proving the harness exercises the buggy path (§4).
- **`time_sudoku` byte-identical counts** vs the `91bb8b0` baseline (§5): Al Escargot `Ac3+FailFirst` 62 backtracks / 962 propagations, Platinum 3 / 293, Inkala 105 / 1,539; `ForwardChecking` rows 207/789, 0/242, 501/1765.

Local test suite, run here:

```
cargo test --workspace  →  150 passed, 0 failed, 6 ignored (17 binaries)
# measured at d9781e29, Apple M5 Max, 2026-07-06
```

## Wasm artifact sizes

Built under `--profile wasm-release` (opt-level `z`, panic `abort`). The deployed lean Sudoku+Futoshiki artifact measures **87,853 B raw** (`web/frontend/dist/assets/csp_solver_wasm_bg-*.wasm`, measured at d9781e29, Apple M5 Max, 2026-07-06; also recorded in `csp-solver/wasm/CHANGELOG.md`). CI enforces size budgets in the `twiggy` lane: full module fail >240 KB / warn >215 KB; separate lean-Sudoku budget fail >93 KB. The CI lane records 201,053 B full / 72,429 B lean at the W6 gate (`.github/workflows/ci.yml`) -- the lean figure predates the Futoshiki surface the deployed artifact now carries.

## Reproducing

```bash
# Criterion benchmarks (Sudoku, Queens, map coloring, lattice)
cargo bench

# Queens-bench ground-truth asserts (92 / 14200) — the only harness that encodes
# solution-count ground truth; cargo test cannot see bench asserts
cargo bench -p csp-solver --bench queens -- --test

# Wall-clock Sudoku timing + backtrack/propagation counts
cargo run --release --example time_sudoku

# GAC A/B corpus (off vs on, production config)
cargo run --release --example gac_ab_corpus

# Profiling target (build with debug symbols, record with samply)
CARGO_PROFILE_RELEASE_DEBUG=true cargo build --release --example profile_sudoku
samply record --no-open ./target/release/examples/profile_sudoku
```

## Methodology

Criterion runs use the default sample size and warm-up. Each iteration constructs a fresh `Csp`, adds variables and constraints, calls `finalize()`, and solves -- cold benchmarks only, measuring end-to-end throughput including CSP setup. The A/B corpus and `time_sudoku` report deterministic node/backtrack/propagation counts (host-independent) alongside wall time (host-dependent); the counts are the load-bearing figures for soundness, the wall times for the disclosed GAC tradeoff.
