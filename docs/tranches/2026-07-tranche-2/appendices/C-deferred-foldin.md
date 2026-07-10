# Appendix C — Deferred ledger, folded in

The complete deferred/booked/parked corpus (L25-01…L25-58, lane 25 of Pass-1), with **verify-25's four mandatory edits applied** (strike L25-28 · close L25-35 · re-base L25-49 · add L25-59), the R1–R9 ratification effects folded, and **every row homed**: a T2 wave, a trigger-bound re-booking, an excision, or a closure. Chronic markers (deferred ≥2 passes) preserved. Source of record for the original 58 rows: `pass1/25-deferred-ledger.md` (session-scoped) as verified by `verify-25` (grade B); dispositions below are this tranche's.

## A. Standing deferrals (tranche-1 appendix D)

| ID | Item | Final |
|---|---|---|
| L25-01 | Restart/CHS driver (chronic ×2) | **FORECLOSED by R4** — the substrate itself is excised at 0.3.0 (W3); the deferral ends. The 3 `witness_*` canaries die with `tests/nogoods.rs`/`restart_nogood_soundness.rs` |
| L25-02 | S1 TieredCostEval | **DEFER** — trigger unfired (no cost-eval consumer beyond the builder); survives the W3 soft-island excision (`CostDomain`/`OptimizationMode` kept) |
| L25-03 | S2 `solve_with_warm_start` | **DEFER** — trigger unfired |
| L25-04 | S3 Unified Constraint trait | **DEFER** — reopens only through the ThreadSafe/sync-gate tripwire, never around it |
| L25-05 | S4 tracing spans | **DEFER** — trigger unfired; the L25-01 observability note is moot (driver foreclosed) |
| L25-06 | N11 wall-clock budget in `SolveConfig` | **RE-BASED DEFER** — post-R1 the wasm/Worker path owns budgets (`budget_exceeded` live on the wire); trigger = a caller needs true wall-time |
| L25-07 | `useCelestialSun` (M4, parked on failed gate) | **DEFER** — trigger = a real second consumer; owner = pencil-boil maintainer (0.7.0 in W5 doesn't fire it) |
| L25-08 | morph Float64Array wire | **OUT-OF-REPO** — `mkbabb/morph` item post-excision |
| L25-09 | keyframes engine export-split + consumer dynamic-import | **MOOT by R8** — `@mkbabb/keyframes.js` is excised wholesale in W5 (zero imports); the upstream ask stays filed for that repo's own sake |
| L25-10 | csp-solver repo split (chronic ×2) | **EXCISED — T2-1, VOID.** W7 records the de-booking. R9 also retires the never-push-origin guard (bbnf's own order stands) |
| L25-11 | iai-callgrind CI (chronic — never executed) | **LANDS → W3** — P6 cleared it (deterministic 1,585,722 across 3 runners; ~40 s warm/~2 m cold); the chronic marker finally clears |
| L25-12 | event-lite full priority model | **DEFER** — still last |
| L25-13 | mimalloc A/B (chronic) | **DEFER per D20** — the verified L26 profile re-prioritized the kernel beats (W3); mimalloc + allocator-conflict fix stay behind a real-workload A/B trigger |
| L25-14 | PGO | **DEFER, re-scoped** — Docker-stage home dies in W2; a native profile-gen path is the only future shape; trigger unfired |
| L25-15 | AllDifferent internal-collect residual | **LANDS → W3** — this IS the singletons-Vec beat (86%/75%/~55% of malloc), pinned POOL-not-fuse per Q9 |
| L25-16 | `tests/solver.rs`/`tests/lattice.rs` file splits | **FOLD → W3** — rides the inline-test migration pass, proportionate |

## B. Appendix A/C residue (tranche 1)

| ID | Item | Final |
|---|---|---|
| L25-17 | R15 `optimization_mode` on the py wire | **DEFER** — py/ survives (R1 keeps the bindings); deferral stays recorded in `py/config.rs` |
| L25-18 | P12 pyproject naming collision (chronic) | **LANDS → W1** — the dist-info rename `sudoku_rs-0.1.0`→`csp_solver-0.2.0` (Q3-cleared placement) |
| L25-19 | SudokuBoard `gridPaths`/`mulberry32` straddle (chronic) | **DEFER** — legal under the direction rule; re-point cheaply if W5 touches the file |
| L25-20 | `gac_alldiff` differential-oracle hypothesis | **DEFER with tripwire** — unverified this campaign; note Q6 found bbnf's *vendored* `tests/gac.rs` already rotted against the 0.2.0 excisions (pruned in W3's re-vendor); the csc411-side read stays booked |
| L25-21 | wasm-opt per-module split | **OUT-OF-REPO** (morph) / csc411 module settled by D21 (`opt-level=z` KEEP) |
| L25-22 | SE/HoDoKu-class difficulty rater | **DEFER** — large, unbooked, no trigger |
| L25-23 | N=5 Medium/Hard (chronic re-litigation) | **EXCISED permanent** — and R1 now kills N=5-Easy too (W2 feature, W4 data); the do-not-reopen clause covers all of 25×25 |

## C. Wave residual-risks (tranche 1)

| ID | Item | Final |
|---|---|---|
| L25-24 | Wheel-lane Python pin unverified on runner | **FOLD → W1/W2 gates** — the rebuilt-wheel 108/2 + retargeted py-runtime lane are the verification |
| L25-25 | `lib.rs` split spec-only | **CLOSED** — landed `4adab144` (tranche-1 W1); suite green at `8913023e` |
| L25-26 | `/config`-endpoint graceful degradation | **CLOSED by W2** — the server dies; the shipped path never called it (`useApi` dead, verified) |
| L25-27 | Template derivation two-homes | **FOLD → W4** — the reshape single-sources via `P1-reshape_bank.py` + the `include_dir!` embed |
| L25-28 | `useReducedMotion.ts` retirement | **STRUCK (verify-25 edit 1)** — the file doesn't exist; consumers migrated; refuted row |
| L25-29 | OD-2 taste placements | **DEFER** — owner re-points cheaply at review |
| L25-30 | Celebration 4th workstream | **DEFER** — chains=1 held at `8913023e`; verify-or-drop stays booked, non-blocking |
| L25-31 | Foil-gleam tail | **DEFER** — severable by design |
| L25-32 | Grain geometric bake escape hatch (chronic) | **RE-BASED** — P3's hoist landed the transition cut (W5); the hatch at `pencilConfig.ts:170-189` stays booked, unused |
| L25-33 | Band-A quantization enforcement | **DEFER** — members verified on-grid; scheduler-owned tick multiples remain the residual piece |
| L25-34 | OD-1 dark-rim taste call | **DEFER** — no-glass default safe |
| L25-35 | `BoilDivider` heldFrameCount parity | **CLOSED (verify-25 edit 2)** — parity landed in tranche-1 W12 |
| L25-36 | Futoshiki N=7/N=8 cliff (chronic) | **DEFER w/ note** — W3's beats are behaviorally frozen (Q9 P5 node-freeze), so no propagation-strength change triggers the F2 re-measure; trigger stands for any future strength change |
| L25-37 | Futoshiki caret aesthetic review | **FOLD → W5** — rides the hardening flip-test discipline (H3 touches the caret) |
| L25-38 | Futoshiki G4 a11y label collapse | **FOLD → W6** — one-clause polish alongside the affordance e2e work |
| L25-39 | bbnf lattice behavioral confluence | **DEFER** — `--verify`'s test stage is the practical check (runs in W3's re-vendor); never-push-bound |
| L25-40 | Full bbnf-workspace compile (chronic, the recurring −1) | **FOLD → W3** — `--verify`'s consumer-compile matrix (root ∪ skinny ∪ vendored × cfg) runs as the excision backstop AND again post-beats (Q9 P3) |

## D. Session-report residue (tranche 1)

| ID | Item | Final |
|---|---|---|
| L25-41 | bbnf-buddy `^0.2.0` bump + MRV call-site check | **OUT-OF-REPO DEFER** (csc411 side verified clean) |
| L25-42/43/44 | morph-core publish · morph CI secrets · buddy remote | **OUT-OF-REPO DEFER** (owner actions) |
| L25-45 | Tracked `.env` (chronic W0→W5→live) | **LANDS → W0** — `git rm --cached .env`; the chronic-trivial poster child closes |
| L25-46 | morph tier1_resample alloc | **OUT-OF-REPO** (morph) |
| L25-47 | M5b headers in Dockerfile nginx | **CLOSED by W2 deletion** — the gap's home is excised (R1/T2-7 fires) |
| L25-48 | Lockfile nodeVersion vs Docker Node 22 | **CLOSED by W2 deletion** + W1 moves CI to Node 24 |
| L25-49 | `--type-*` token swap for wordmark heights | **RE-BASED (verify-25 edit 3) → W5 H4** — the scale IS vendored at HEAD; only 3 logo-height literals remain; H4's ladder-bind is exactly this |
| L25-50 | e2e frame-line/chain tests never committed (chronic) | **LANDS → W0** — the suite wired into CI; the throwaway-harness era ends (constraint T2-3's spirit) |

## E. Tranche-II mandate rows

| ID | Item | Final |
|---|---|---|
| L25-51 | Server abrogation gate | **RESOLVED — R1 GO** → W2 |
| L25-52 | Docker abrogation (conditional) | **FIRES with R1** → W2 |
| L25-53 | Inline tests → tests/ | → W3 |
| L25-54 | CLAUDE.md removal (chronic rewrite→removal) | → W7 (R2 fold shape) |
| L25-55 | Modern Rust/wasm + legacy sweep | → W1 + W3 |
| L25-56 | examples/benches/data interrogation | → W0 + W3 + W4 |
| L25-57 | UI affordances/mobile/glass/KISS | → W5 + W6 |
| L25-58 | pencil-boil perf + facilities | → W5 (0.7.0) |

## F. Added this campaign

| ID | Item | Final |
|---|---|---|
| **L25-59** | `test_budget_exceeded_error_end_to_end` permanent skip (**verify-25 edit 4** — the skip narrates an out-of-band fuzz campaign, body `pass`) | **RECORDED** — rides the W2 rehome intact; un-skip only if a real end-to-end budget fuzz gets built |

## G. New deferrals opened by this tranche (each with owner + trigger)

Every row carries both an **owner** (who re-opens it) and a **trigger** (what fires it). Owners are functional (single human owner, role-framed).

| Item | Owner | Trigger | Source |
|---|---|---|---|
| wasm `opt-level=s` (+17% solve, +2.1 KB, in-budget) | wasm/build maintainer | hard-16×16 latency felt on low-power mobile; **re-derive the s cell before pulling** (bracketed-plausible, not rebuilt) | D21 |
| H7, H10 hardening items | FE hardening lead | next FE hardening pass | verify-33/Q8 |
| §8b bitset-parallel GAC | engine maintainer | prototype-gated; user-imperceptible even at full ceiling (~0.3 ms on ~1 ms) | D23 |
| TypeScript 7.x | FE toolchain maintainer | Vue language-tools unblock | D26 |
| Mobile digit pad | FE/product | mobile usage evidence | L15 chain |
| `apiError`/`solverError` twins unification | FE maintainer | divergence pressure (genuinely-owned copies today, 68–92% divergent) | D16 |
| CSR adjacency · Vec-indexed warm cache · mimalloc · GAC on/off policy (the D20 set) | engine maintainer | real-workload A/B / profile shift | D20 |
| Memoized/idle-chunked transition path regen (the @4× CPU half: `generateGridBoilFrames` + 256 `wobbleRect` + mounts) | pencil/FE maintainer | the ~100–150 ms-class @4× worst frame becomes user-felt | verify-P3-P4 A2 |
| N=3-hard bank aggressive excision (3,591 B sparse) | data/bank maintainer | a genuine low-power device clears gen p95 ≤ 50 ms | verify-P1-P2 |
| `generate_templates.rs` N=5 arg-range refusal | engine maintainer | next touch of the file | Q2 §E |
| C1/C2 `index.css` `@layer` extractions | FE maintainer | a cascade-layer proof or a visual-diff pass lifts the hold (targeted **W8**) | C1/C2 |
| Vendored-test prune completeness (bbnf `--update --delete` semantics) | bbnf maintainer (out-of-repo) | next re-vendor after W3's | Q6 §3.5 |

**Landed this tranche, no longer deferred** (recorded here so the census stays honest):

| Item | Disposition | Source |
|---|---|---|
| ~~Engine-domains pencil marks~~ | **LANDED → W6** — owner override 2026-07-10 folded the tier×surface bundle into this tranche (opt-in full-GAC behind the peek/hint grammar; +1,779 B); was tranche-III booked. No longer a deferral | P4 + verify-P3-P4 A4 (README §4) |

## Chronic roll-up after this fold

Closing the fold empties the chronic list to trigger-bound healthy deferrals only: L25-07 (failed-gate park), L25-12, L25-13, L25-14, L25-19, L25-20, L25-22, L25-36, L25-39, the out-of-repo set—plus the two permanent excisions (L25-10 split, L25-23 N=5-M/H). Every other chronic item **lands or closes inside this tranche**: L25-01 (foreclosed), L25-11 (W3), L25-15 (W3), L25-18 (W1), L25-32 (re-based), L25-40 (W3), L25-45 (W0), L25-46 (out-of-repo), L25-50 (W0), L25-54 (W7). W-GATE re-checks this roll-up at close.
