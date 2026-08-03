# CSP Solver

A constraint-satisfaction engine in Rust, and five hand-drawn games that ride it: Sudoku, Futoshiki, Thermo, Killer, and KenKen. The engine (`csp-solver/`, with a wasm sibling crate) is the sole solver; the Vue 3 frontend (`web/frontend/`) solves entirely in the browser, in a Web Worker over `@mkbabb/csp-solver-wasm`. The PyO3 bindings build as the `csp_solver` wheel, consumed by bbnf-lang and the wheel-contract tests, and there's no HTTP service here: no server ever touches a puzzle.

**Live**: [sudoku.babb.dev](https://sudoku.babb.dev)

## Directory structure

```
.
├── csp-solver/                  the CSP engine (crates.io: csp-solver)
│   ├── src/
│   │   ├── constraint/          Constraint trait, ConstraintEnum, NotEqual, AllDifferent
│   │   ├── domain/              Domain trait, BitsetDomain (u128), lattice domains
│   │   ├── solver/              search.rs (unified kernel), ac3, gac/, monotonic, propagate, optimize
│   │   ├── puzzles/             sudoku/, futoshiki/, thermo/, killer/, kenken/ (generation + validation)
│   │   ├── builder/             AssignmentBuilder (B&B assignment/COP surface)
│   │   └── py/                  PyO3 bindings (feature = "py"): module `csp_solver`
│   ├── data/sudoku_puzzles/     embedded template bank (N=3-hard + N=4, include_dir!)
│   ├── tests/                   integration suite (23 files)
│   ├── tests-py/                wheel-contract pytest suite
│   ├── benches/                 criterion: assignment, cost_finite_domain, futoshiki, gac_ab,
│   │                            lattice, map_coloring, queens, sudoku; iai_queens (callgrind)
│   ├── examples/                time_sudoku, gac_ab_corpus, verify_bank_uniqueness, …
│   └── wasm/                    csp-solver-wasm crate → npm @mkbabb/csp-solver-wasm
├── web/frontend/                Vue 3 + TypeScript + Tailwind v4
│   ├── src/pencil/              the shared hand-drawn aesthetic: grid, glyphs, chrome, filters
│   ├── src/games/               sudoku/, futoshiki/, thermo/, killer/, kenken/ + shared/ (which holds the one solver Worker)
│   └── e2e/                     Playwright suite
├── docs/                        algorithms, sudoku, benchmarks, bbnf-integration, optimizations, animation
├── scripts/                     the gate scripts and the thin frontend launcher
├── rust-toolchain.toml          stable pin, wasm32 target
└── Cargo.toml                   workspace = ["csp-solver", "csp-solver/wasm"]
```

## Architecture

```
Browser ── Web Worker: @mkbabb/csp-solver-wasm (lean build) ── csp_solver (Rust)

Static SPA (Cloudflare Pages, sudoku.babb.dev) ── _redirects: two rules (/assets/* 404, SPA fallback)
```

The engine in brief. `ConstraintEnum` dispatch is devirtualized, so the hot path carries no vtable; a u128-backed `BitsetDomain` iterates without allocating. AC-3 runs a bitset-worklist propagation, with a monotonic sweep for lattice domains, and GAC all-different (Régin 1994, via Hopcroft-Karp plus iterative Tarjan SCC) is default-ON at ≥3 live participants. Backtracking lives in one kernel, `solver/search.rs`. `SolveConfig::default()` is `Ac3 + FailFirst`, `max_solutions = 1`, node budget 1M.

Depth lives elsewhere, single-homed: the public API, `max_solutions` semantics, GAC posture, and build/test recipes in [`csp-solver/README.md`](csp-solver/README.md); propagation strategies and ordering heuristics in [`docs/algorithms.md`](docs/algorithms.md); the bbnf-lang vendor contract (byte-identical copy, pinned rev, two-fold sync gate) in [`docs/bbnf-integration.md`](docs/bbnf-integration.md).

## The five games

| Game | Formulation | Sizes |
|---|---|---|
| Sudoku | M² vars, domain 1..M, AllDifferent per row/col/subgrid | N=2,3,4 (4×4, 9×9, 16×16) |
| Futoshiki | N×N Latin square, inequalities between adjacent cells | N=4..7 (4×4–7×7) |
| Thermo | Sudoku plus thermometer chains whose values strictly increase along the tube (a chain of binary less-than) | 4×4, 9×9, 16×16 |
| Killer | Sudoku plus arithmetic cages: AllDifferent within a cage and a target sum | 4×4, 9×9, 16×16 |
| KenKen | N×N Latin square (no subgrids), cages carrying a `+ − × ÷` target | N=4,5,6 (4×4–6×6) |

The carousel game-select is the front door. Each game registers one card (`web/frontend/src/games/cards.ts`) plus one `GameSpec`, and the carousel mounts it lazily on pick: Sudoku rides the main chunk, the rest download on select. All five generate and validate in the Worker. Sudoku's N=2 and N=3 easy/medium boards are dealt live; N=3-hard and all N=4 come from the embedded bank of 45 boards (32,095 B), owned by `csp-solver/data/sudoku_puzzles/` and derived into the SPA at build time. Futoshiki, Thermo, Killer, and KenKen deal live and prove uniqueness under a `max_solutions = 2` check.

## Frontend

Vue 3 Composition API, no router, no state library. `src/pencil/` carries the hand-drawn aesthetic; `src/games/{sudoku,futoshiki,thermo,killer,kenken}/` are the surfaces, all five riding the one Worker module, `games/shared/solver/solver.worker.ts`, with cross-boundary imports ESLint-enforced. Affordances: the carousel game-select, an undo spine (one shared history, cap 200), a named-technique hint, the player's own pencil marks (Snyder corner/center notation) beside the solver's peek-gated engine marks, error-check assists (off / on-demand / live, on-demand the default and never a lives counter), hold-to-peek, and board permalinks. All five—Sudoku, Futoshiki, Thermo, Killer, and KenKen—round-trip a whole board over `?board=` through one shared codec. Animation runs on `@mkbabb/pencil-boil`'s scheduler and defers to `prefers-reduced-motion`; the grid is an ARIA grid with keyboard navigation. Fonts are three self-hosted woff2 subsets under the SIL Open Font License, 21,724 B total.

The hint grammar sits in one place: a technique engine (`src/games/shared/techniqueEngine.ts`) names the cheapest human-deduction step for the board and grades the board by the hardest technique that step-ladder needs. Sudoku and Futoshiki carry named-technique modules (naked single, hidden single, and up); Thermo, Killer, and KenKen surface the solver-derived hint through the same margin voice.

## Development

| Tool | Version | Used for |
|---|---|---|
| cargo | stable, MSRV 1.88 (`rust-toolchain.toml`) | the engine + wasm crate |
| uv | Python 3.13 (host 3.14 is PyO3-incompatible) | the wheel-contract suite |
| npm | ≥ 11 (npm 10 mis-resolves the lockfile) | frontend + e2e |

```bash
# Rust engine: the Cargo workspace root is the repo root
cargo test --workspace && cargo bench

# Wheel-contract suite (build the csp_solver wheel with maturin first)
cd csp-solver/tests-py && uv sync && uv pip install ../../target/wheels/*.whl && uv run --no-sync pytest

# Frontend: the whole dev loop (scripts/dev.sh is the thin launcher)
cd web/frontend && npm install && npm run dev
```

## Testing

All counts measured at `e961bdb7`, Apple M5 Max, 2026-08-01 — except the e2e census, which `scripts/check-doc-truth.mjs` re-derives from all three Playwright configs on every run, and which T5-W1 rows 1.6 and 1.10 widened (WebKit 91 → 110 in the default config, the built-dist gates 23 → 39).

```bash
# Rust: 212 passed, 0 failed, 0 ignored (29 test binaries + 4 doctests)
cargo test --workspace

# Python wheel-contract: 27 passed, 0 skipped
cd csp-solver/tests-py && uv run --no-sync pytest

# e2e: 325 Playwright tests across 17 spec files in the default config (Chromium 165,
#      WebKit 160). Five further specs are held out of it and ride two configs of their
#      own: the pixel goldens (4 tests in 1 file) and the built-dist gates (39 in 4).
#      22 spec files on disk, 368 tests in all.
cd web/frontend && npx playwright test
cd web/frontend && npx playwright test --config playwright-golden.config.ts && npm run test:e2e:throttle

# GAC A/B false-UNSAT corpus: 0/50 off, 0/50 on
cargo run --release --example gac_ab_corpus

# Queens ground-truth asserts (92 / 14,200): bench-only; cargo test can't see them
cargo bench -p csp-solver --bench queens -- --test
```

## CI

`.github/workflows/ci.yml` runs eighteen lanes: fmt+clippy, the Rust/wasm/Python builds and tests, the wasm size budgets and the shipped package's resolution contract, the frontend typecheck+knip+support-floor gate, the unit estate under its count and coverage floors, e2e, the cross-game boundary law, a headless perf subset against the P1 idle thresholds, the doc-truth and evidence-policy gates, a callgrind instruction-count baseline, and the cargo-audit and npm-audit advisory scans. Budgets and measured artifact sizes live in [`docs/benchmarks.md`](docs/benchmarks.md).

## Deployment

A Cloudflare Pages static deploy. Solving and generation never leave the visitor's browser, so there's no server-side solve path to secure. `_headers` carries CSP/HSTS/X-Frame-Options; `_redirects` carries two rules: the `/assets/*` → `/404.html` guard that keeps an unknown hashed asset from resolving to the shell and poisoning the edge cache, and the SPA fallback.

One companion Worker deploys beside it and only shared boards ever reach it: `web/relay`, a hibernating Durable Object speaking the slice of NIP-01 a shared board needs. It stores nothing, hibernates between messages, and its origin is named in the page's `connect-src`—so the two deploy together or the socket is refused. Since T6.2 the board itself rides those frames: the WebRTC arm is retired, and with it the class of pair that could see a roster and never a digit.

## Declarations

- **Browser support**: Chromium and WebKit, each with its own lane. `playwright.config.ts` declares the two projects and CI installs both bundles, so "solves entirely in the browser" is asserted in each engine. One file sits out the WebKit project: `share-truth.spec.ts` wants a clipboard permission Playwright's WebKit doesn't grant. Gecko carries no lane; Firefox is unasserted. The declared support floor is Chrome 111, Edge 111, Firefox 128, Safari 16.4 and iOS Safari 16.4 (`web/frontend/package.json`, `browserslist`)—an arithmetic figure rather than a preference, since Tailwind v4 compiles every stylesheet against precisely those targets and nothing below them is served CSS it can parse. The bundle's own syntax targets ES2020, which sits well under that floor; `npm run test:support-floor` holds the declaration to both and refuses any guard in the source that defends a browser beneath it.
- **English only**: the copy is authored inline in English, `<html lang="en">`, with no i18n or locale-negotiation layer.
- **No telemetry**: nothing is measured and nothing is phoned home. There is no third-party network hit at all—the attribution avatar was bundled same-origin at T4-W8, which retired the last one. Board state lives in the URL and stays on the device. A shared board opens exactly one socket, to our own relay (`web/relay`, a Cloudflare Durable Object), and only for as long as the session lasts: it carries presence and the players' cell writes between the players, it is stored nowhere at either end, and a page playing alone never loads the transport at all.
- **No offline mode**: there's no service worker and no web-app manifest, so the shell and the wasm module come off the network at every cold load, and an unvisited game's chunk downloads on select. Once a game is resident, its generation and solving run wholly on-device.

## Published artifacts

| Artifact | Registry | Version |
|---|---|---|
| `csp-solver` | crates.io | 0.6.0 (published; the first release carrying all five puzzle families) |
| `@mkbabb/csp-solver-wasm` | npm | 0.2.0 on npm; source is 0.6.0. The SPA file-links the lean build, not the registry package. |
| `@mkbabb/pencil-boil` | npm (frontend dep) | ^0.12.0 (tagged `v0.12.0`; the pose-stack cache `poseCacheSize` atop 0.11's `stop()` no-throw contract and `rasterizePoseToBlob()`) |

## Performance

`docs/benchmarks.md` carries the reproducible, stamped numbers. GAC default-ON gives a 64.8–65.7× aggregate over the 47 boards of the 50-board A/B corpus both states can finish — the other three are boards GAC-off cannot solve at all inside its node budget — with a disclosed minority cost: 3 of the 5 named hard 9×9 boards run 1.6–2.9× slower ON. The timing figures are first-party, from the committed `gac_timing_probe` example (`a3ada202`); the sibling `gac_ab_corpus` is the soundness gate (0/50 false-UNSAT in both GAC states).

## Key conventions

- **Rust**: stable toolchain pin (`rust-toolchain.toml`, MSRV 1.88), edition 2024, PyO3 0.29. `cargo test --workspace`, never per-crate. Any `SolveConfig`/`SolveStats` field change sweeps exhaustive literals or uses `..Default::default()`.
- **Python**: the sole Python surface is `csp-solver/tests-py`, the wheel-contract tests against the installed `csp_solver` wheel. `from csp_solver import ...` (the Rust native module).
- **TypeScript**: strict mode; `@/*`, `@games/*`, `@pencil/*` aliases; Prettier + tailwind plugin; Vite 8, TS 6.
- **Difficulty**: `EASY / MEDIUM / HARD`; casing parity guarded by `csp-solver/tests/difficulty_parity.rs`.
- **Puzzle data**: one source of truth, `csp-solver/data/sudoku_puzzles/`, embedded via `include_dir!`; the frontend's template bank is generated from those files at build time (`vite.config.ts`), never a hand-copied fork.

## Sources

- Régin, J.-C. (1994). "A filtering algorithm for constraints of difference in CSPs." *AAAI-94*, 362–367.
- Mackworth, A. K. (1977). "Consistency in networks of relations." *Artificial Intelligence*, 8(1), 99–118.
- Hopcroft, J. E. & Karp, R. M. (1973). "An n^(5/2) algorithm for maximum matchings in bipartite graphs." *SIAM J. Comput.*, 2(4), 225–231.
- Tarjan, R. E. (1972). "Depth-first search and linear graph algorithms." *SIAM J. Comput.*, 1(2), 146–160.
- Boussemart, F. et al. (2004). "Boosting systematic search by weighting constraints." *ECAI-04*, 146–150.

## Contributing

Branch off master, add the change plus its tests, and open the PR; CI runs the same gates. Build and test recipes single-home in [`csp-solver/README.md`](csp-solver/README.md).

## License

[MIT](./LICENSE) © 2026 Mike Babb
