# Benchmarks

## Sudoku Solve Times

Hard 9x9 puzzles, single solution. Rust uses AC3 + DomWdeg (its strongest configuration). Python uses FC + FailFirst + GAC (its strongest configuration). Each solver's best -- they don't share the same optimal config because the overhead profile differs.

| Puzzle | Rust | Python | Speedup |
|--------|------|--------|---------|
| Al Escargot | 0.36 ms | 11.5 ms | 32x |
| Platinum Blonde | 2.57 ms | 30.6 ms | 12x |
| Golden Nugget | 6.2 ms | 347 ms | 56x |
| Inkala 2010 | 0.52 ms | 29.6 ms | 57x |
| 17-clue minimal | 4.6 ms | 28.1 ms | 6x |

The speedup variance (6x to 57x) reflects how much each puzzle relies on propagation vs. search. Golden Nugget requires deep search with many backtracks -- Rust's inlined constraint dispatch and bitset operations compound across thousands of `revise()` calls. The 17-clue puzzle, by contrast, is propagation-heavy with minimal search, so the per-operation advantage doesn't compound as dramatically.

Al Escargot and Inkala 2010 both solve in under a millisecond. These are famous "hardest Sudoku" puzzles, but strong AC-3 propagation with DomWdeg ordering finds solutions with minimal backtracking.

## Generation Times

Template-based fast path vs. hole-digging slow path. Templates apply a random symmetry transform; hole-digging generates a solution then removes cells with uniqueness verification.

| Size | Template | Hole-digging |
|------|----------|-------------|
| 4x4 | 0.01 ms | 0.04 ms |
| 9x9 | 0.09 ms | 1.3 ms |
| 16x16 | 0.16 ms | 36.5 ms |

Template generation is O(M^2) -- just permute cells and digits. The cost is dominated by the permutation application, not the random number generation. Hole-digging's cost grows superlinearly because each removed cell requires a uniqueness solve, and the solve cost itself increases with board size.

For the web app, templates are pre-computed for each supported size and difficulty level. The API endpoint returns a puzzle in <1ms regardless of difficulty.

## BBNF Compile Pipeline

Full grammar-to-code compilation. Includes parsing, IR lowering, all 18 optimization passes (including the 6 CSP-based passes), and Rust codegen.

| Grammar | Lines | Time |
|---------|-------|------|
| JSON | 30 | 0.70 ms |
| EBNF | 51 | 1.10 ms |
| CSS monolithic | 69 | 2.00 ms |
| Google Sheets | 115 | 1.80 ms |
| BBNF | 80 (+imports) | 3.79 ms |
| CSS L4 | 973 (15 files) | 113 ms |

CSS L4 is the outlier. 973 lines across 15 files with deep `@import` chains and hundreds of alternation branches. The compile time is dominated by literal prefix factoring (trie construction over string literals) and regex-with-lookahead factoring. The 6 CSP passes contribute <0.1% of the total.

The jump from Google Sheets (1.8ms, 115 lines) to CSS L4 (113ms, 973 lines) isn't linear in grammar size. CSS L4's complexity comes from its extreme alternation widths -- some rules have 50+ branches of string literals that need prefix factoring, dispatch table computation, and regex algebra optimization.

## Profiling: Sudoku

samply + Firefox Profiler. Workload: 3 hard 9x9 puzzles x 1000 iterations each, plus 8-Queens and Australia map coloring. Built with `CARGO_PROFILE_RELEASE_DEBUG=true`.

Inverted call tree, self-time:

| Function | Self-time |
|----------|-----------|
| `ConstraintEnum::revise` | 33% |
| `Iterator::next` (domain iteration) | 13% |
| `ac3_from_variable` | 6% |
| `BitsetWorklist::pop` | 6% |

The solver spends a third of its time in constraint revision -- the actual productive work of pruning domains. Domain iteration (13%) is `BitsetIter::next`, which is already a single `trailing_zeros` + bit-clear per value. The worklist and AC-3 scaffolding are 12% combined. No obvious bottleneck remains in the infrastructure layer.

## Profiling: BBNF Compile

samply on the CSS L4 compile pipeline. The pre-FxHash profile showed 40% of self-time in `SipHash` operations from `HashMap<String, u32>` lookups in the literal prefix factoring pass. These hash maps are compiler-internal -- no adversarial input, no DoS risk.

Switching to `FxHashMap` (multiply-and-rotate, ~3x faster than SipHash for small keys) cut total compile time from 211ms to 113ms. The remaining time is split across prefix trie construction, regex-syntax HIR analysis, and codegen token emission. The CSP passes don't register on the profile.

## Methodology

All Rust benchmarks use criterion with default sample size and warm-up. Each iteration constructs a fresh `Csp`, adds variables and constraints, calls `finalize()`, and solves -- cold benchmarks only, no warm/cached runs that reuse a pre-constructed solver. This measures end-to-end throughput including CSP setup, which is the realistic usage pattern. Reusing a pre-constructed solver would measure combinator cache throughput, not parse/solve throughput.

Python benchmarks use `time.perf_counter()` around the equivalent `Csp` construction and solve sequence, averaged over 100 iterations per puzzle.

## Reproducing

```bash
# Criterion benchmarks (Sudoku, Queens, map coloring, lattice)
cargo bench

# Wall-clock Sudoku timing
cargo run --release --example time_sudoku

# Profile with samply
CARGO_PROFILE_RELEASE_DEBUG=true cargo build --release --example profile_sudoku
samply record --no-open ./target/release/examples/profile_sudoku
# Open the printed URL in Firefox/Chrome for the interactive flame graph
```

The `profile_csp.rs` example runs a mixed workload (Sudoku + Queens + map coloring) for aggregate profiling. The `profile_sudoku.rs` example focuses on Sudoku with 1000 iterations of each hard puzzle for stable sampling.
