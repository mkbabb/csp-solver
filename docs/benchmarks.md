# Benchmarks

## Posture

This document reports only what is reproducible and stamped. Two classes of pre-tranche number were retired as non-reproducible:

- **The 7–57× "Rust vs Python" headline.** It was not apples-to-apples (each solver measured under a different config), and there is no longer a Python solver to compare against -- `csp_solver` (Rust) is the sole engine. The specific claim of Platinum Blonde at 2.57 ms (against 0.44 ms measured) was among the non-reproducible entries.
- **The "10–25% optimization headroom" profile band.** Refuted at load: it was load-average-50 contention noise. On a quiet host, `lto=fat + codegen-units=1 + strip` alone is +16–17% slower and the package nets ≈0% (`evidence/synthesis-pass3.md` §1 #14). CI therefore keeps the default release profile with none of those levers.

Numbers below trace either to a named campaign artifact under `docs/tranches/2026-07-grand-uplift/evidence/`, or to a command run here and quoted with its stamp. Stamp shape for locally-run commands: `measured at c14995eb, Apple M5 Max, 2026-07-10`.

## GAC default-ON: the corpus result and its cost

GAC-in-AllDifferent is default-ON, gated at live-participant count ≥ `GAC_MIN_PARTICIPANTS` (3). The decision rests on the A/B corpus result below: a **12.6–12.7× aggregate** (12.58× / 12.73× across two consistency-checked runs) measured first-party on the **50-board** post-W4 corpus -- 5 named hard 9×9 + the shipped template bank (N=3-hard 20 + N=4 25) -- solved under the exact production config (`Ac3 + Mrv`), GAC off vs on, by the committed `gac_timing_probe` example (`measured at ede25188, Apple M5 Max, 2026-07-10`; `docs/tranches/2026-07-tranche-2/evidence/execution/T2-WGATE-gac-probe.md`). Ratios are off/on wall time (interleaved, best-of-5); node counts are deterministic. _Historical note:_ a pre-reshape **13.36×** figure on a 112-board corpus (N=2..4 dense) was carried on inherited trust from a since-deleted scratch harness; it is retired -- the first-party 50-board number above supersedes it and is in the same class.

The sibling `gac_ab_corpus` example runs the same 50-board bank and reports **false-UNSAT counts only** (0/50 in both GAC states, § Kernel soundness parity below) -- a soundness gate, not the source of the timing rows above.

| Measure | Value | Source |
|---|---|---|
| Corpus aggregate speedup (ON) | **12.6–12.7×** (12.58× / 12.73×, two runs) | `gac_timing_probe` @ `ede25188` |
| Search nodes, off → on | 40,513 → 4,678 (8.66× fewer) | ibid. (deterministic) |
| Best bucket win | N=4 medium/hard, ≈25.7–26.8× | ibid. |

**The minority cost, disclosed (deeper than the retired figure implied):** 3 of the 5 named hard 9×9 boards are reproducibly slower with GAC on -- **Al Escargot 0.40–0.42×, Golden Nugget 0.56×, Inkala 2010 0.30–0.33×** (i.e. 1.8–3.3× slower, first-party). The retired scratch-harness prose put this at 1.3–2.5×; the committed probe measures a deeper slowdown, Inkala worst. The aggregate win is dominated by the N=4 boards; the hard-9×9 minority pays GAC's per-propagation constant. The default stands because the corpus aggregate and the 16×16 failure-to-success result outweigh it, and every N-keyed gate tested was ≤ blanket-ON.

**The gate threshold:** `GAC_MIN_PARTICIPANTS` swept 2–6 stays within ~7%; at 9 it is 1.79× worse. 3 is retained.

## The criterion tradeoff on hard 9×9

Isolated criterion, same host, byte-identical solve counts: `sudoku_9x9/al_escargot/ac3_failfirst` runs ≈370 µs baseline → ≈677 µs composed -- **≈1.8× slower** -- attributable to GAC per-propagation overhead (`evidence/kernel-behavior-preservation.md` §criterion; `synthesis-pass3.md` row 1). This is the same constant cost the corpus minority pays, measured in isolation. It is a disclosed, accepted tradeoff for the aggregate win, not a regression to fix.

## Kernel soundness parity

The unified search kernel is verified sound, not merely fast. Evidence from `evidence/kernel-soundness-closure.md`:

- **Solution-set invariance.** The enumerate-all solution *set* is identical across all 12 Pruning × Ordering combinations at `budget=false`: queens8 = 92, queens12 = 14,200, futoshiki_loose = 288, futoshiki_constr = 16 (§2, §6). Standing guard: `tests/solution_set_invariance.rs`.
- **False-UNSAT closed.** The GAC corpus goes 0/50 false-UNSAT post-fix (`cargo run --release --example gac_ab_corpus`, re-derived locally at c14995eb — 50 boards post-W4 bank shrink); the revert control reproduces 26/113 against tranche-1's then-113-board corpus, proving the harness exercises the buggy path (§4).
- **`time_sudoku` byte-identical counts** vs the `91bb8b0` baseline (§5): Al Escargot `Ac3+FailFirst` 62 backtracks / 962 propagations, Platinum 3 / 293, Inkala 105 / 1,539; `ForwardChecking` rows 207/789, 0/242, 501/1765.

Local test suite, run here:

```
cargo test --workspace  →  151 passed, 0 failed, 6 ignored (18 test binaries)
# measured at c14995eb, Apple M5 Max, 2026-07-10
```

## Wasm artifact sizes

Built under `--profile wasm-release` (opt-level `z`, panic `abort`). The deployed lean Sudoku artifact -- the `--no-default-features` build the frontend Worker ships -- measures **90,602 B raw** (`wc -c csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm`, measured at c14995eb, Apple M5 Max, 2026-07-10). The full module measures **222,436 B** (T2-WGATE re-measure at `c14995eb`, 2026-07-10 -- the W6 beat-9 propagate ops ride the full module too, +1,882 B over the T2-W3 stamp; the assignment surface's transitive `ndarray` accounts for the bulk of the delta over the lean build, which compiles assignment out). CI enforces size budgets in the `twiggy` lane: full module fail >240 KB / warn >230 KB; separate lean budget fail >93 KB -- both hold with headroom.

## Reproducing

```bash
# Criterion benchmarks (Sudoku, Queens, map coloring, lattice, assignment,
# cost_finite_domain). The lattice bench runs each workload under BOTH propagation
# paths: the default groups (adjacency built → AC-3) and the `*_sweep` groups
# (no finalize() → monotonic sweep, bbnf's actual path).
cargo bench

# Criterion --save-baseline discipline (MANDATORY for any before/after claim):
# criterion's default compares each run against its OWN previous run, so a solo
# `cargo bench` reports self-referential deltas — the phantom "−17%" self-baseline
# pathology. Always name a saved baseline and compare against it, same box:
cargo bench -- --save-baseline before      # on the base commit
#   …apply the change…
cargo bench -- --baseline before           # compare vs the NAMED baseline
# Never quote a criterion delta that wasn't taken against a named --baseline on the
# same host in the same session.

# Queens-bench ground-truth asserts (92 / 14200) — the only harness that encodes
# solution-count ground truth; cargo test cannot see bench asserts
cargo bench -p csp-solver --bench queens -- --test

# Deterministic instruction-count baseline (Linux/CI only — Valgrind can't run on
# arm64-macOS). The `iai` CI lane (.github/workflows/ci.yml) runs this under
# callgrind; instruction counts are a pure function of the compiled binary, so the
# delta is exactly 0 on an unchanged binary (P6: 1,585,722 across 3 runners).
cargo bench -p csp-solver --bench iai_queens   # needs valgrind + iai-callgrind-runner

# Wall-clock Sudoku timing + backtrack/propagation counts
cargo run --release --example time_sudoku

# GAC A/B false-UNSAT corpus check (off vs on, production config) — this
# reports false-UNSAT counts only, not timing or search-node counts. It is
# a soundness gate, not the source of the "Corpus aggregate speedup" /
# "Search nodes, off → on" row above (see the inherited-trust flag there).
cargo run --release --example gac_ab_corpus

# Profiling target (build with debug symbols, record with samply)
CARGO_PROFILE_RELEASE_DEBUG=true cargo build --release --example profile_sudoku
samply record --no-open ./target/release/examples/profile_sudoku
```

Actual output, this repro pass (`measured at c14995eb, Apple M5 Max, 2026-07-10`; corpus is 50 boards post-W4 bank shrink — N=3-hard + N=4 sparse + 5 named hard 9×9):

```
$ cargo run --release --example gac_ab_corpus
# GAC A/B false-UNSAT corpus — 50 boards (production config: Ac3 + Mrv)
false-UNSAT (GAC off): 0/50
false-UNSAT (GAC on):  0/50
TOTAL false-UNSAT across both GAC states: 0
VERDICT: 0/50 — PASS

$ cargo run --release --example time_sudoku
puzzle/config                  | found | backtracks | propagations | time
--------------------------------------------------------------------------------
Al Escargot/AC3+FailFirst      | true  |       62 bt |      962 prop | 0.86 ms
Al Escargot/AC3+Mrv            | true  |       62 bt |      962 prop | 0.86 ms
Al Escargot/FC+FailFirst       | true  |      207 bt |      789 prop | 0.87 ms
Platinum/AC3+FailFirst         | true  |        3 bt |      293 prop | 0.52 ms
Platinum/AC3+Mrv               | true  |        3 bt |      293 prop | 0.51 ms
Platinum/FC+FailFirst          | true  |        0 bt |      242 prop | 0.44 ms
Inkala 2010/AC3+FailFirst      | true  |      105 bt |     1539 prop | 0.88 ms
Inkala 2010/AC3+Mrv            | true  |      105 bt |     1539 prop | 0.83 ms
Inkala 2010/FC+FailFirst       | true  |      501 bt |     1765 prop | 1.42 ms
```

The backtrack/propagation counts are host-independent and match the kernel-soundness-parity §5 baseline verbatim. Wall times are host-dependent, quoted only as regimes (30-repro rule) — re-measure locally rather than gate on the absolute ms.

## Methodology

Criterion runs use the default sample size and warm-up. Each iteration constructs a fresh `Csp`, adds variables and constraints, calls `finalize()`, and solves -- cold benchmarks only, measuring end-to-end throughput including CSP setup. The A/B corpus and `time_sudoku` report deterministic node/backtrack/propagation counts (host-independent) alongside wall time (host-dependent); the counts are the load-bearing figures for soundness, the wall times for the disclosed GAC tradeoff.
