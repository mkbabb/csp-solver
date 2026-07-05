# Appendix A — Excision ledger, final dispositions

Pass-1 §2 ([`../evidence/synthesis-pass1.md`](../evidence/synthesis-pass1.md)) carried ~40 EXCISE/FAIL-EXPLICIT/WIRE-or-EXCISE items. This is the ledger updated through Passes 2–4, with each item's **final disposition** and the wave that executes it. Status vocabulary: **RESOLVED** (landed in the W1 seed tree or a verified diff) · **DECIDED→Wx** (evidence-complete, executes in that wave) · **OPEN→Wx** (verified still live in the composed v2 tree by this tranche's own checks; newly booked) · **SUPERSEDED** (a ratification/edict changed the disposition).

## Rust core

| # | Item | Final disposition |
|---|---|---|
| R1 | `ConstraintEnum::Lambda` — zero constructors | **OPEN→W2** — verified still zero construction sites in v2 (`add_greater_than` boxes through `Custom`). W2 decides: EXCISE (Pass-1 default) or WIRE the devirtualization, which would also address Futoshiki F10 |
| R2 | `CardinalityConstraint` dead | **DECIDED→W2** — still present (134 L, `pub use` only, not in the dispatch enum); EXCISE, re-add on real consumer |
| R3 | `propagate_gac_alldiff` dead + 224 L duplication | **RESOLVED** (WIRE) — unified sentinel-generic `propagate_gac_core` landed (W1 seed); duplication excised; the thin entry points survive as test oracles → **W2** moves them under `gac/` + documents the oracle role |
| R4 | `NogoodStore` orphaned | **RESOLVED-as-substrate** — sound, mutation-tested, landed with 11 canary tests (3 `witness_*` invert when a driver lands); the restart **driver** is explicitly deferred, optional engineering (**W2** records; Pass-3 #4). No silent half-state: the canaries make the state loud |
| R5 | `min_conflicts` as silent fallback | **DECIDED→W2** — EXCISE (Pass-2 settled #26); verified still present in v2 (`local_search.rs`, 176 L) |
| R6 | `SoftLambdaConstraint` penalty silently discarded | **RESOLVED** — separate `ConstraintEnum::Soft` variant + explicit add path (verified in v2 `dispatch.rs:19`, `lib.rs:199`) |
| R7 | `BitsetDomain` 0..128 `debug_assert!` only (release aliasing, reachable from published bindings) | **OPEN→W1** — verified still `debug_assert!` in v2 (`bitset.rs:28,41`); FAIL-EXPLICIT release check or type-level guarantee + wasm doc fix |
| R8 | AssignmentBuilder budget→`Infeasible` conflation | **OPEN→W2** — the performance manifestation is cured (prototype 2: n=12 25 s→2–5 ms) but `AssignmentError` still has only `Infeasible` (verified v2 `:113–137`); add `BudgetExceeded`, EXCISE the ambiguity-blessing test. morph unaffected (never inspects the error) |
| R9 | `finalize()` panic + VarId index panic across FFI | **RESOLVED** — typed exceptions end-to-end (`py/errors.rs`, 4 raised via wheel; `pass3/py-module-reconciliation.md`) |
| R10 | `tests/optimize.rs` duplicate CostFiniteDomain | **OPEN→W2** — verified still hand-rolled (v2 `tests/optimize.rs:14`) |
| R11 | `FiniteDomain::iter`/`CostFiniteDomain::iter` dead-weight overrides | **RESOLVED-BY-REWORK** — the zero-alloc `use<>` capture rework made the overrides the optimization (verified v2) |
| R12 | `generate_from_template`/`apply_random_transform` twins | **OPEN→W4** — verified still byte-identical twins in v2 (`generate.rs:34` ≡ `transform.rs:102`) |
| R13 | `difficulty` silently discarded on the template fast path | **RESOLVED-mechanism** (prototype 13: debug-gated consistency assert, 0 release cost) — lands with **W4**'s data ownership |
| R14 | `sudoku_solutions/` bank read by nothing | **DECIDED→W4** — EXCISE (142 files, corrected count; still present in the live tree) |
| R15 | Bare `PyRuntimeError` for Unsatisfiable; `optimization_mode` truncated | **half-RESOLVED / half-OPEN→W4** — typed Unsatisfiable landed; `optimization_mode` still absent from the py wire (verified v2 `py/config.rs`) |
| R16 | `SolveConfig::default()` = the 7.6 s pathology | **DECIDED→W1/W12** — Ac3+FailFirst-family default adopted; coordination-gated (two live bbnf `finalize()+solve_optimized` consumers, Pass-2 D6); executes inside the W12 window |

## Python service

| # | Item | Final disposition |
|---|---|---|
| P1 | Dead `generate_templates.py` | **DECIDED→W4** — EXCISE; Rust generator binary replaces (prototype 13) |
| P2 | `_has_conflicts` contract fork | **DECIDED→W4** — EXCISE whole function; one no-solution path |
| P3 | `except Exception` → leaked 500 / crash-as-no-solution | **RESOLVED-shape** (taxonomy envelope, 7 codes, fault-injected—prototype 14) — port lands **W4** |
| P4 | slowapi wired to zero routes | **DECIDED→W4** — WIRE (`/solve` strict, `/random` loose) |
| P5 | No `budget_exceeded` on the wire | **RESOLVED** (prototype 5 P0-1; in the W1 seed) — surfaced distinctly per taxonomy in **W4** |
| P6 | Unreachable defensive Difficulty branch | **DECIDED→W4** — EXCISE |
| P7 | Dev deps in the wrong stanza | **DECIDED→W4** — PEP 735 `[dependency-groups]` + pytest-timeout |
| P8 | Futoshiki advertised, no route | **SUPERSEDED** — the 2026-07-04 ratification commits the surface; **W10** makes the ad true (better than deletion) |
| P9 | `numpy` declared, zero imports | **DECIDED→W4** — EXCISE |
| P10 | `HARD_PUZZLES` duplication; `test_bench_compare` comparing nothing | **DECIDED→W4** — conftest dedup; fold/rename the file (the tests mirror in [`be-colocation-manifest.md`](../evidence/be-colocation-manifest.md) §3.5 is the target shape) |
| P11 | Changelog for the deleted Python solver | **DECIDED→W13** — EXCISE (archive) |
| P12 | Naming collision (`app` vs `csp_solver` imports; project names) | **partially SUPERSEDED** — the be-colocation manifest (Pass 4) retains package `app` across its target shape; the pyproject *project-name* half stays open, settled or explicitly deferred in **W4** |

## Frontend

| # | Item | Final disposition |
|---|---|---|
| F1 | Dead decorative subtree (6 files + roughjs pull) | **RESOLVED×2** (prototypes 8+11, 1,497 L) — re-lands via **W7** excision list |
| F2 | shadcn scaffold (7 artifacts) | **RESOLVED×2** — same, **W7** |
| F3 | `FilterTuner` dead-in-prod by convention | **RESOLVED** — `import.meta.env.DEV` + `defineAsyncComponent`, 0 prod bytes (prototype 11) — **W7** |
| F4 | Animation `try/catch` swallows | **DECIDED→W8** — FAIL-EXPLICIT during the scheduler migration |
| F5 | Silent error architecture (errorMessage unconsumed, conflated failures, no AbortSignal) | **RESOLVED-shape** (typed `ApiError`, prototype 14) — rendering fictions land **W9**; client timeout shares the server constant via `/config` (**W4/W6**) |
| F6 | Composables duplicating @vueuse/pencil-boil | **DECIDED→W8** — EXCISE duplicates; `useReducedMotion.ts` retires only when its 2 verified remaining consumers migrate ([`fe-colocation-manifest.md`](../evidence/fe-colocation-manifest.md) §0) |
| F7 | Dual mobile+desktop mounts | **DECIDED→W7** — single `useMediaQuery` mount |
| F8 | `lint` script = configless prettier rewrite | **DECIDED→W7** — commit `.prettierrc` + register the tailwind plugin |
| F9 | Redundant autoprefixer under Tailwind v4 | **DECIDED→W7** — EXCISE |
| F10 | `@mkbabb/value.js` direct dep, zero imports | **RESOLVED** (prototype 8 dropped it) — re-lands **W7** |
| F11 | node_modules symlinks over tracked content | **RESOLVED-BY-G1** — **W0** untracking + lockfile heal |

## Wasm / morph

| # | Item | Final disposition |
|---|---|---|
| W1 | `isomorphic.rs` mirror, zero consumers | **RESOLVED** (prototype 6): lean `sudoku.rs` + `full-mirror` feature gate; mirror stays for bbnf-buddy's `solveAssignmentCop`, excluded from the deploy artifact — lands **W6** |
| W2 | `node_budget_ms` silently discarded | **RESOLVED-BY-REPLACEMENT** — the W6 budget-fix ships an explicit node-count budget + typed `BUDGET_EXCEEDED`; the ms field dies. The wall-clock budget itself stays booked (deferred N11) |
| W3 | `wasm/pkg/` tracked + `.gitignore`-strip lines | **DECIDED→W0/W11** — untrack with G1; the strip lines die with W11's Makefile cleanup |
| W4 | Correspondence hints silently dropped | **RESOLVED-Rust-half** (prototype 12: `point_pairs` through `wire.rs`) — lands **W11** phase 1; TS producer + republish ride **W12** |
| W5 | `NEXT_ID` atomic, dead pub surface, wire duplication | **DECIDED→W11** — EXCISE all three during phase 1 |
| W6 | Procrustes Step-7 dormant inversion bug | **DECIDED→W11** — fix + test in phase 1 (recorded so it can't ride along silently) |
| W7 | bbnf-buddy docstring lie (Tier-2 via wasm) | **DECIDED→W12** — doc fix in the consumer bump |

## Deploy / repo / docs

| # | Item | Final disposition |
|---|---|---|
| G1 | 11,406 tracked artifacts | **DECIDED→W0** — untrack, re-anchor, `.dockerignore` |
| G2 | Broken dev.sh / NXDOMAIN deploy.sh | **DECIDED→W0** — rewrite, FAIL-EXPLICIT on hosts |
| G3 | CI disabled | **DECIDED→W0** — re-enabled with the amended gate set |
| G4 | Prod compose points at the dead deployment | **DECIDED→W0/W5** — committed defaults per the ratified topology |
| G5 | Dangling `api.csp-solver.babb.dev` | **RATIFIED→OD-4** — owner Cloudflare action; verify in **W5** |
| G6 | Docs lying about code (the full catalogue) | **DECIDED→W13** — the doc-truth ledger, item by item |

**Newly opened by this tranche's own verification** (no prior pass caught them post-composition): R1, R7, R8, R10, R12, R15-half—all verified against [`../artifacts/composed-csp-solver-v2.tgz`](../artifacts/composed-csp-solver-v2.tgz) on 2026-07-05 and booked into W1/W2/W4 above. Nothing else in the Pass-1 ledger is unaccounted for.
