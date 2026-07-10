# CSP Solver — Project Guide

Constraint-satisfaction solver. A Rust engine (`csp-solver/`, with a wasm sibling crate) and a Vue 3 frontend (`web/frontend/`). Two games ride the same engine: Sudoku and Futoshiki.

The Rust `csp_solver` crate is the sole solver. The frontend solves in the browser via `@mkbabb/csp-solver-wasm` (wasm in a Worker) — the only shipped solve path. `csp_solver`'s PyO3 bindings still build as a wheel (consumed by bbnf-lang and the wheel-contract tests), but there is no HTTP service in this repo.

## Directory Structure

```
.
├── csp-solver/                    Rust workspace root — the CSP engine
│   ├── src/
│   │   ├── constraint/            Constraint trait, ConstraintEnum, NotEqual, AllDifferent
│   │   ├── domain/                Domain trait, BitsetDomain (u128), lattice domains
│   │   ├── solver/                search.rs (unified kernel), ac3, gac/, monotonic, propagate,
│   │   │                         restart, nogoods, heuristic, optimize
│   │   ├── puzzles/               sudoku/, futoshiki/ (generation + validation)
│   │   ├── builder/               AssignmentBuilder (B&B assignment/COP surface)
│   │   ├── py/                    PyO3 bindings (#[cfg(feature = "py")]) — module `csp_solver`
│   │   └── error.rs               typed CspError (+ narrow #[cfg(test)] block)
│   ├── data/sudoku_puzzles/       embedded template bank (include_dir!)
│   ├── tests/                     integration tests (13 files)
│   ├── tests-py/                  wheel-contract pytest suite (bench/backend/panic/wheel)
│   ├── benches/                   criterion — sudoku, queens, map_coloring, lattice
│   ├── examples/                  profiling + timing targets (time_sudoku, profile_sudoku, …)
│   └── wasm/                      csp-solver-wasm crate → npm @mkbabb/csp-solver-wasm
├── web/
│   └── frontend/                  Vue 3 + TypeScript + Tailwind v4 (in-browser wasm solve)
├── docs/                          algorithms, sudoku, benchmarks, bbnf-integration, optimizations
├── scripts/                       dev.sh (frontend launcher)
└── Cargo.toml                     workspace members = ["csp-solver", "csp-solver/wasm"]
```

`morph-core` and `wasm-morph` were excised to [github.com/mkbabb/morph](https://github.com/mkbabb/morph); the pre-deletion state is tagged `pre-morph-excision`. The general-purpose `AssignmentBuilder` surface morph was built on stays here; morph now consumes `csp-solver` as an ordinary crates.io dependency. See `csp-solver/CHANGELOG.md`.

## Architecture

```
Browser ── in-browser solve: @mkbabb/csp-solver-wasm in a Worker ── csp_solver (Rust)

Static SPA (CF Pages, sudoku.babb.dev) ── _redirects: SPA fallback only
```

### CSP engine (Rust)

- `ConstraintEnum` — devirtualized dispatch (NotEqual, AllDifferent, Custom); the common two inline `revise()`/`check()`, no vtable on the hot path.
- `BitsetDomain` — u128-backed, zero-alloc iteration via `BitsetIter`; a release-guarded 0..128 invariant.
- AC-3 bitset-worklist propagation (`solver/ac3.rs`); monotonic sweep for lattice domains (`solver/monotonic.rs`).
- GAC all-different (Régin 1994) via Hopcroft-Karp + iterative Tarjan SCC — **default-ON**, gated at live-participant count ≥ `GAC_MIN_PARTICIPANTS` (3).
- Unified backtracking search kernel (`solver/search.rs`). Conflict-directed backjumping was removed with the kernel unification (the `SolveConfig::backjumping` field is gone).
- `Pruning` — None, ForwardChecking, Ac3 (MAC), AcFc (FC + singleton propagation).
- `Ordering` — Chronological, FailFirst (MRV), Mrv (domain-size / Σ weights; weights frozen at 1.0, so a static heuristic — the old `DomWdeg` name was a proven misnomer).
- `SolveConfig::default()` — `Ac3` + `FailFirst`, `max_solutions = 1`, `node_budget = Some(1_000_000)`.
- Typed `CspError` with a stable `code()`; `restart`/`nogood` substrate present (driver deferred); `cancel` + `node_budget` + `optimization_mode` on `SolveConfig`.

### GAC on Sudoku — the corrected story

Pre-tranche, GAC was documented as running on Sudoku but ran at forward-checking strength (the n-ary propagator was gated off). It now runs at GAC strength, default-ON. The causal story from the Pass-1 audit **inverted**: the AssignmentBuilder speedup once attributed to GAC incrementalization was actually the builder's `Pruning::AcFc → Ac3` wiring — GAC was invoked zero times on the profiled probe. The headline lever is the pruning-strategy swap (~2,670×); incrementalization is a secondary 1.2–1.6× enabler (`evidence/synthesis-pass2.md` §D1).

### PyO3 bindings

`#[cfg(feature = "py")]` in `csp-solver/src/py/`. Module name: `csp_solver`. Exposes `Csp`, `SolveConfig`, `SolveStats`, `Pruning`, `Ordering`, `SudokuCSP`, futoshiki + sudoku constructors, and four typed exceptions mirroring `CspError::code()`. Built with `maturin`.

### bbnf-lang integration

This repo is the source of truth for the solver. `bbnf-lang` consumes it as a **vendored byte-identical copy pinned at a rev** (not a `.cargo/config.toml` patch — that framing is dead). The vendor stays honest via a sync gate (`scripts/sync-csp-solver-vendor.sh`, in bbnf-lang):

- `--check` — text-diff provenance gate: diffs the vendored `src/` against `git show <pin>:csp-solver/src`, fails on byte drift.
- `--verify` — enforced-compile gate: builds root `{bbnf, bbnf-ir, egraph}` ∪ skinny `{passes}` ∪ the vendored crate under **both** cfg branches (`default`, `py`), plus structural trait-surface + `SolveConfig`/`SolveStats` field-add tripwires. The pre-push hook runs both.

bbnf uses six IR passes over lattice domains (type inference, FIRST/FOLLOW, span eligibility, dispatch tables, regex algebra) — all `propagate()` with monotonic domains, sweep auto-selected since `finalize()` isn't called. See `docs/bbnf-integration.md`.

## The two games

| Game | Formulation | Sizes | Surfaces |
|---|---|---|---|
| Sudoku | M² vars, domain 1..M, AllDifferent per row/col/subgrid | N=2..5 (web: N=2,3,4 + N=5-easy) | Rust, PyO3, wasm, frontend |
| Futoshiki | N×N Latin square + inequality constraints between adjacent cells | N=4..7 (v1) | Rust, PyO3, wasm, frontend |

Both ship generation and validation. Futoshiki's uniqueness check (`max_solutions = 2` under Ac3) is sound after the kernel's AC-3 trail-push fix.

## Frontend

Vue 3 Composition API, no router, no state library. `src/pencil/` is the shared hand-drawn aesthetic (grid, glyphs, celestial chrome, filters, scheduler); `src/games/{sudoku,futoshiki}/` are the two game surfaces. Solving runs in a Web Worker over `@mkbabb/csp-solver-wasm` — there is no backend path. Animation is scheduled by `@mkbabb/pencil-boil` (`^0.6.0`); all motion respects `prefers-reduced-motion`. The grid is an ARIA grid with keyboard navigation and a hold-to-peek affordance.

## `max_solutions` semantics

`max_solutions = 1` under `Ac3` returns the **first** solution the search reaches, which on a multi-solution instance is valid-but-different and trajectory-dependent — different pruning/ordering may return a different (still-correct) member of the solution set. Treat it as a satisfiability probe or a uniqueness cap (`= 2`), never as a guarantee of a specific solution (`evidence/kernel-soundness-closure.md` §7.2).

## Development

```bash
# Rust engine
cd csp-solver && cargo test --workspace && cargo bench

# Wheel-contract pytest suite (needs the csp_solver wheel built out-of-band via maturin)
cd csp-solver/tests-py && uv sync && uv pip install ../../target/wheels/*.whl && uv run --no-sync pytest

# Frontend (in-browser wasm solve; scripts/dev.sh is a thin frontend launcher)
cd web/frontend && npm install && npm run dev
```

## Testing

```bash
# Rust — cargo test --workspace: 150 passed, 0 failed, 6 ignored (17 binaries)
#   measured at d9781e29, Apple M5 Max, 2026-07-06
cargo test --workspace

# Python — csp-solver/tests-py wheel-contract suite (against the installed wheel)
cd csp-solver/tests-py && uv run --no-sync pytest

# Criterion — sudoku, queens, map_coloring, lattice
cargo bench

# Queens-bench ground-truth asserts (CI-only; cargo test can't see bench asserts)
cargo bench -p csp-solver --bench queens -- --test
```

## Deployment

Topology: **in-browser wasm, static SPA.** The SPA is a Cloudflare Pages static deploy (sudoku.babb.dev); it solves and generates in a Worker over `@mkbabb/csp-solver-wasm`, structurally retiring the GIL/DoS class for served sizes. `_headers` carries CSP/HSTS/X-Frame-Options; `_redirects` carries the SPA fallback only.

- **Pending owner action (OD-4):** delete the dangling `api.csp-solver.babb.dev` CNAME (a subdomain-takeover shape).

The Docker/FastAPI reference stack was retired in the T2-W2 abrogation.

## CI

Repo-root `.github/workflows/ci.yml` — 8 lanes: `lint` (fmt + clippy `-D warnings`), `rust` (build/test `--workspace` + the queens-bench smoke assert), `py-compile` (`cargo check --features py`, Python ≤3.13 for the PyO3 0.24 ceiling), `py-runtime` (maturin wheel → uv venv → pytest), `wasm` (`wasm-pack test --node` + clippy `--target wasm32`), `twiggy` (size budgets), `frontend` (`npm ci` + `vue-tsc`). The wasm builds use `--profile wasm-release` (opt-level `z`, panic `abort`, workspace-root only). Size budgets: full module fail >240 KB / warn >215 KB; separate lean-sudoku budget fail >93 KB (the deployed lean artifact measures 87,853 B raw — measured at d9781e29, Apple M5 Max, 2026-07-06).

## Published artifacts

| Artifact | Registry | Version |
|---|---|---|
| `csp-solver` | crates.io | 0.2.0 |
| `@mkbabb/csp-solver-wasm` | npm | 0.2.0 |
| `@mkbabb/morph` | npm (now from mkbabb/morph) | 0.2.0 |
| `@mkbabb/pencil-boil` | npm (frontend dep) | 0.6.0 |

## Performance

See `docs/benchmarks.md` for the reproducible, stamped numbers. Headline: GAC default-ON gives a 13.36× corpus aggregate over a 113-board bank, with a disclosed minority cost — 3 of 5 named hard 9×9 boards run 1.3–2.5× slower ON. No cross-language speedup headline and no profile-percentage band are claimed; the pre-tranche 7–57× and 10–25% figures were non-reproducible and are retired.

## Key conventions

- **Rust**: nightly toolchain, edition 2024. `cargo test --workspace` never per-crate. Any `SolveConfig`/`SolveStats` field change sweeps exhaustive literals or uses `..Default::default()`.
- **Python**: the only Python surface is `csp-solver/tests-py` — wheel-contract tests (`pytest.importorskip("csp_solver")` + stdlib, pytest + pytest-timeout, per-test 120s ceiling). `from csp_solver import ...` (the Rust native module).
- **TypeScript**: strict mode, `@/*` + `@puzzles/*` aliases, Prettier + tailwind plugin.
- **Difficulty**: `EASY / MEDIUM / HARD`; N=5 is easy-only (medium/hard rejected `NOT_FOUND`). Casing parity is guarded by a contract test (`csp-solver/tests/difficulty_parity.rs`).
- **Puzzle data**: template bank owned by the Rust crate (`csp-solver/data/sudoku_puzzles/`), embedded via `include_dir!`; the frontend derives SPA templates from that single source, never a hand-copied fork.
