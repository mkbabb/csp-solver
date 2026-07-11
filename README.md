# CSP Solver

A constraint-satisfaction engine in Rust, and two hand-drawn games that ride it—Sudoku and Futoshiki. The engine (`csp-solver/`, with a wasm sibling crate) is the sole solver; the Vue 3 frontend (`web/frontend/`) solves entirely in the browser, in a Web Worker over `@mkbabb/csp-solver-wasm`. The PyO3 bindings build as the `csp_solver` wheel—consumed by bbnf-lang and the wheel-contract tests—but there's no HTTP service here: no server ever touches a puzzle.

**Live**: [sudoku.babb.dev](https://sudoku.babb.dev)

## Directory structure

```
.
├── csp-solver/                  the CSP engine (crates.io: csp-solver)
│   ├── src/
│   │   ├── constraint/          Constraint trait, ConstraintEnum, NotEqual, AllDifferent
│   │   ├── domain/              Domain trait, BitsetDomain (u128), lattice domains
│   │   ├── solver/              search.rs (unified kernel), ac3, gac/, monotonic, propagate, optimize
│   │   ├── puzzles/             sudoku/, futoshiki/ — generation + validation
│   │   ├── builder/             AssignmentBuilder (B&B assignment/COP surface)
│   │   └── py/                  PyO3 bindings (feature = "py") — module `csp_solver`
│   ├── data/sudoku_puzzles/     embedded template bank — N=3-hard + N=4 (include_dir!)
│   ├── tests/                   integration suite (14 files)
│   ├── tests-py/                wheel-contract pytest suite
│   ├── benches/                 criterion — sudoku, queens, map_coloring, lattice, assignment,
│   │                            cost_finite_domain; iai_queens (callgrind)
│   ├── examples/                time_sudoku, gac_ab_corpus, verify_bank_uniqueness, …
│   └── wasm/                    csp-solver-wasm crate → npm @mkbabb/csp-solver-wasm
├── web/frontend/                Vue 3 + TypeScript + Tailwind v4
│   ├── src/pencil/              the shared hand-drawn aesthetic — grid, glyphs, chrome, filters
│   ├── src/games/               sudoku/, futoshiki/ — each with its own solver/ Worker module
│   └── e2e/                     Playwright suite
├── docs/                        algorithms, sudoku, benchmarks, bbnf-integration, optimizations
├── scripts/dev.sh               thin frontend launcher
├── rust-toolchain.toml          stable pin, wasm32 target
└── Cargo.toml                   workspace = ["csp-solver", "csp-solver/wasm"]
```

## Architecture

```
Browser ── Web Worker: @mkbabb/csp-solver-wasm (lean build) ── csp_solver (Rust)

Static SPA (Cloudflare Pages, sudoku.babb.dev) ── _redirects: SPA fallback only
```

The engine in brief: devirtualized `ConstraintEnum` dispatch (no vtable on the hot path), u128-backed `BitsetDomain` with zero-alloc iteration, AC-3 bitset-worklist propagation plus a monotonic sweep for lattice domains, GAC all-different (Régin 1994, via Hopcroft-Karp + iterative Tarjan SCC) default-ON at ≥3 live participants, and a unified backtracking kernel (`solver/search.rs`). `SolveConfig::default()` is `Ac3 + FailFirst`, `max_solutions = 1`, node budget 1M.

Depth lives elsewhere, single-homed: the public API, `max_solutions` semantics, GAC posture, and build/test recipes in [`csp-solver/README.md`](csp-solver/README.md); propagation strategies and ordering heuristics in [`docs/algorithms.md`](docs/algorithms.md); the bbnf-lang vendor contract (byte-identical copy, pinned rev, two-fold sync gate) in [`docs/bbnf-integration.md`](docs/bbnf-integration.md).

## The two games

| Game | Formulation | Sizes |
|---|---|---|
| Sudoku | M² vars, domain 1..M, AllDifferent per row/col/subgrid | N=2,3,4 (4×4, 9×9, 16×16) |
| Futoshiki | N×N Latin square + inequalities between adjacent cells | N=4..7, one tier |

Both generate and validate in the Worker. Sudoku's N=2 and N=3 easy/medium boards are generated live; N=3-hard and all N=4 come from the embedded bank—45 boards, 32,533 B, owned by `csp-solver/data/sudoku_puzzles/` and derived into the SPA at build time. Futoshiki generates live and proves uniqueness (`max_solutions = 2`).

## Frontend

Vue 3 Composition API—no router, no state library. `src/pencil/` carries the hand-drawn aesthetic; `src/games/{sudoku,futoshiki}/` are the surfaces, each with its own `solver/` Worker module (boundaries ESLint-enforced). Affordances: undo, hint, pencil marks, hold-to-peek, board+seed permalinks, PWA offline. Animation runs on `@mkbabb/pencil-boil`'s scheduler and defers to `prefers-reduced-motion`; the grid is an ARIA grid with keyboard navigation. Fonts are three self-hosted woff2 subsets, 17,708 B total.

## Development

| Tool | Version | Used for |
|---|---|---|
| cargo | stable, MSRV 1.88 (`rust-toolchain.toml`) | the engine + wasm crate |
| uv | Python 3.13 (host 3.14 is PyO3-incompatible) | the wheel-contract suite |
| npm | ≥ 11 (npm 10 mis-resolves the lockfile) | frontend + e2e |

```bash
# Rust engine — the Cargo workspace root is the repo root
cargo test --workspace && cargo bench

# Wheel-contract suite (build the csp_solver wheel with maturin first)
cd csp-solver/tests-py && uv sync && uv pip install ../../target/wheels/*.whl && uv run --no-sync pytest

# Frontend — the whole dev loop (scripts/dev.sh is the thin launcher)
cd web/frontend && npm install && npm run dev
```

## Testing

All counts measured at the tranche-III gate SHA `b4d7aedf` (T3-W12, the tranche close), Apple M5 Max, 2026-07-11.

```bash
# Rust — 171 passed, 0 failed, 6 ignored (21 test binaries)
cargo test --workspace

# Python wheel-contract — 27 passed, 0 skipped (the two Timeout-gated skips deleted at W4)
cd csp-solver/tests-py && uv run --no-sync pytest

# e2e — 43 Playwright tests in 8 files
cd web/frontend && npx playwright test

# GAC A/B false-UNSAT corpus — 0/50 off, 0/50 on
cargo run --release --example gac_ab_corpus

# Queens ground-truth asserts (92 / 14,200) — bench-only; cargo test can't see them
cargo bench -p csp-solver --bench queens -- --test
```

## CI

`.github/workflows/ci.yml`—nine jobs carrying the full lane set: `lint` (fmt + clippy `-D warnings`) · `rust` (build/test `--workspace` + the queens-bench, gac-ab, and corpus node-count smokes — the 40,513→4,678 spine asserts in CI) · `py-compile` (`cargo check --features py`) · `py-runtime` (maturin wheel → uv venv → pytest + flag-free stubtest + the stub-stem tripwire) · `wasm` (`wasm-pack test --node` + clippy `--target wasm32`) · `twiggy` (size budgets) · `frontend` (`npm ci` + `vue-tsc` + knip, the standing dead-export gate) · `e2e` (lean wasm build → Playwright) · `iai` (callgrind instruction-count baseline). Wasm builds use `--profile wasm-release` (opt-level `z`, panic `abort`). Budgets: full module fail >240 KB / warn >230 KB—222,436 B at the T2-WGATE re-measure; lean fail >93 KB—the deployed artifact measures 86,746 B (gate `b4d7aedf`, 2026-07-11, Apple M5 Max; the T3-W6 engine-perf trim from 90,602 B, `pkg/` source == `dist/`).

## Deployment

A Cloudflare Pages static deploy. Solving and generation never leave the visitor's browser—the server-side solve hazard class is retired structurally, not mitigated. `_headers` carries CSP/HSTS/X-Frame-Options; `_redirects` carries the SPA fallback only. The PWA installs and plays offline after first load.

## Published artifacts

| Artifact | Registry | Version |
|---|---|---|
| `csp-solver` | crates.io | 0.3.0—published |
| `@mkbabb/csp-solver-wasm` | npm | 0.2.0—the SPA consumes the file:-linked lean build, not the registry package |
| `@mkbabb/pencil-boil` | npm (frontend dep) | ^0.7.0 |

## Performance

`docs/benchmarks.md` carries the reproducible, stamped numbers. Headline: GAC default-ON gives a 12.6–12.7× aggregate over the 50-board post-W4 A/B corpus, with a disclosed minority cost—3 of 5 named hard 9×9 boards run 1.8–3.3× slower ON. The timing figures are first-party, from the committed `gac_timing_probe` example (`ede25188`), not an inherited scratch harness; the sibling `gac_ab_corpus` is the soundness gate (0/50 false-UNSAT in both GAC states). No cross-language speedup headline and no profile-percentage band are claimed—the pre-tranche figures were non-reproducible and are retired.

## Key conventions

- **Rust**: stable toolchain pin (`rust-toolchain.toml`, MSRV 1.88), edition 2024, PyO3 0.29. `cargo test --workspace`, never per-crate. Any `SolveConfig`/`SolveStats` field change sweeps exhaustive literals or uses `..Default::default()`.
- **Python**: the sole Python surface is `csp-solver/tests-py`—wheel-contract tests against the installed `csp_solver` wheel. `from csp_solver import ...` (the Rust native module).
- **TypeScript**: strict mode; `@/*`, `@games/*`, `@pencil/*` aliases; Prettier + tailwind plugin; Vite 8, TS 6.
- **Difficulty**: `EASY / MEDIUM / HARD`; casing parity guarded by `csp-solver/tests/difficulty_parity.rs`.
- **Puzzle data**: one source of truth—`csp-solver/data/sudoku_puzzles/`, embedded via `include_dir!`; the frontend's template bank is generated from those files at build time (`vite.config.ts`), never a hand-copied fork.

## Sources

- Régin, J.-C. (1994). "A filtering algorithm for constraints of difference in CSPs." *AAAI-94*, 362–367.
- Mackworth, A. K. (1977). "Consistency in networks of relations." *Artificial Intelligence*, 8(1), 99–118.
- Hopcroft, J. E. & Karp, R. M. (1973). "An n^(5/2) algorithm for maximum matchings in bipartite graphs." *SIAM J. Comput.*, 2(4), 225–231.
- Tarjan, R. E. (1972). "Depth-first search and linear graph algorithms." *SIAM J. Comput.*, 1(2), 146–160.
- Boussemart, F. et al. (2004). "Boosting systematic search by weighting constraints." *ECAI-04*, 146–150.

## Contributing

Branch, test, PR—the full flow, plus the release posture, is in [`CONTRIBUTING.md`](./CONTRIBUTING.md). Build and test recipes single-home in [`csp-solver/README.md`](csp-solver/README.md).

## License

[MIT](./LICENSE) © 2026 Mike Babb
