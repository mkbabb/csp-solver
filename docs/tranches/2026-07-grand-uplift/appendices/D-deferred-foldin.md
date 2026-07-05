# Appendix D — Deferred ledger, folded in

The full deferred ledger (M-series from the 2026-06-02 fold, S-series crate extensions, N-series Pass-1 discoveries), each item either **folded into a wave** or **explicitly re-booked** with its trigger and owner. Chronic markers (deferred ≥2 passes) preserved—chronicity was itself a Pass-1 P0 escalation signal.

## M-series (fold mandates)

| ID | Item | History | Final |
|---|---|---|---|
| M1 | keyframes.js spec+lock | **chronic ×2 → P0**; became a proven build-breaker; prototyped as a 14-line rename + lockfile heal (prototype 8, subsumed into two-layer) | **→ W7** (content re-lands at canonical paths) |
| M1b | value.js spec+lock | chronic ×2 | **→ W7** (direct dep dropped; transitive only) |
| M1c | pencil-boil `^0.2.0`→current | consumer couldn't reach the boil-guard fix | **→ W12** (`^0.6.0` bump + scheduler-deletion grep gate) |
| M2 | pencil-boil reactive-PRM teardown | **chronic ×3**—the lib shipped 3 releases, none was this | **→ W12** (own changeset in 0.5.0; the centralized-scheduler-gate design amendment from prototype 10 rides with it) |
| M3 | Controls-LEFT | settled | **exemption re-recorded**, no work |
| M4 | Orange-sun lift (`useCelestialSun`) | booked → gate **failed** on direct inspection (bbnf-buddy uses glass-ui's toggle; fourier's touchpoint is a one-shot baker—Pass-2 D7) | **PARKED, re-booked**: trigger = a real second consumer appears; owner = pencil-boil maintainer. Celestial *proofs* land in 0.6.0 regardless (real consumers exist) |
| M4b | pencil-boil version roadmap | substantially discharged at lib | residual → **W12** (train order 0.5.0/0.5.1/0.6.0) |
| M5 | babb.dev DNS tuple | verified worse than suspected (P0 takeover shape) | **→ W5 + OD-4** (owner account action) |
| M5b | CSP/HSTS/X-Frame headers | absent at both nginx layers | **→ W5** (`_headers`) |

## S-series (documented crate extensions—healthy deferrals unless noted)

| ID | Item | Final |
|---|---|---|
| S1 | TieredCostEval | **RE-BOOKED** — trigger unfired (no cost-eval consumer beyond the builder); owner csp-solver |
| S2 | `solve_with_warm_start` | **RE-BOOKED** — trigger unfired; note: the kernel's pre-seeded-assignment `Feasibility` policy (one function serving plain + `_with_given`) is adjacent substrate if the trigger ever fires |
| S3 | Unified Constraint trait | **RE-SCOPED** — partially subsumed by the kernel; the trait surface now carries the cfg-gated `ThreadSafe` marker (W1) and a sync-gate allow-list tripwire (W12); any further unification re-opens *through that gate*, never around it |
| S4 | tracing spans | **RE-BOOKED** — trigger unfired; owner csp-solver. If the chs-driver ever lands, its `SolveStats.restarts/conflicts` addition is the cheaper observability first step |

## N-series (Pass-1 discoveries)

| ID | Item | Final |
|---|---|---|
| N1 | `node_budget`/`budget_exceeded` half-migration (P0, broken 29 commits) | **RESOLVED** (prototype 5 P0-1; in the W1 seed; wire surfacing W4/W6) |
| N2 | dom/wdeg scaffolding frozen | **substrate landed** (blame signal, unconditional); the weighting driver is the deferred chs-driver → **W2** records; trigger = a heavy-tailed workload production actually exhibits |
| N3 | NogoodStore abandoned | **substrate + canaries landed** (W1); driver deferred with N2 |
| N4 | GAC-in-AllDifferent excluded, rationale lost | **ADOPTED default-ON** → W2 (13.36× aggregate; minority cost disclosed) |
| N5 | `isomorphic.rs`/`solveAssignmentCop` abandoned-in-progress | **SETTLED** (prototype 6): lean `sudoku.rs` product surface + `full-mirror` gate → W6 |
| N6 | `min_conflicts` never wired | **EXCISE** → W2 (verified still present in v2) |
| N7 | Futoshiki: zero product surface, falsely advertised | **SUPERSEDED by ratification** → W10 (committed product wave; the ad becomes true) |
| N8 | N=5: no data, unbounded path | **BOUNDED** → W4 (Easy pregenerate 9/9 @ 610–627 ms; Medium/Hard rejected with the do-not-reopen clause) |
| N9 | bbnf vendor sync gate + repo split | gate **upgraded** (text-diff `--check` + enforced-compile `--verify` incl. skinny + both cfg branches) → W12; **split re-booked next tranche**; the stale `mkbabb/csp-solver` remote landmine + never-push standing order hold |
| N10 | grain hoist + glyph-scheduler batching | **PROVEN** → W8 (−72.9% raster; chains → 1) |
| N11 | Wall-clock budget in `SolveConfig` | **RE-BOOKED** — the W6 budget-fix retires the silently-discarded `node_budget_ms` wire field with an explicit node-count budget; true wall-clock semantics remain unbuilt. Trigger: a caller needs wall-time (today the route timeout + thread pool covers it); owner csp-solver |

## Chronic-marker audit

Three items ever went chronic: **M1** (×2, escalated P0—now specified, W7), **M2** (×3—now specified with its own changeset, W12), **M5/M5b** (booked-not-chronic by the fold's own accounting—now specified, W5). After this tranche the chronic list is empty; the only PARKED item (M4) is parked on a *failed gate*, not on neglect, with a named re-trigger.

**Standing deferrals that survive this tranche** (all healthy, all with triggers): S1, S2, S4, N11, the chs-driver (N2/N3), the morph Float64Array wire (first post-excision PR), the keyframes engine export-split (W12 files the ask), the csp-solver repo split (next tranche), `useCelestialSun` (M4), iai-callgrind (appendix C), event-lite propagation's full priority model, mimalloc (pending the W3 A/B), the AllDifferent internal-collect residual (W3), and `tests/solver.rs`/`tests/lattice.rs` file splits ([`be-colocation-manifest.md`](../evidence/be-colocation-manifest.md) §2.4, proportionate-not-blocking).
