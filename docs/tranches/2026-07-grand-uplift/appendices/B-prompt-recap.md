# Appendix B — Prompt-recap coverage matrix

Every mandate ever issued to this codebase (Pass-1 §5's consolidation from git archaeology + the fold), updated with the 2026-07-04 ratifications and 2026-07-05 edict. **Status after this tranche is SPECIFIED**: each row names the wave that discharges it. "Chronic" markers preserved.

## Historical mandates (commit-sourced)

| # | Mandate | Status after Pass 1 | Status after this tranche |
|---|---|---|---|
| R1 | Port solver Python→Rust, isomorphic API | ADDRESSED, py binding broken, stale docstrings | **SPECIFIED** — W1 (py/ tree, typed exceptions), W13 (docstrings) |
| R2 | Devirtualize constraint dispatch | ADDRESSED with rot (dead Lambda variant, Custom dominant) | **SPECIFIED** — W2 decides Lambda WIRE-or-EXCISE (appendix A R1) |
| R3 | No god modules (>500 L) | PARTIAL — 3 violations | **SPECIFIED** — `lib.rs` split W1; `isomorphic.rs` split W6; `align.rs` split W11 ph.1. Two at-budget files flagged-not-actioned (`search.rs` 507, `gac/mod.rs` 470—single-reason-to-change, [`be-colocation-manifest.md`](../evidence/be-colocation-manifest.md) §2.3) |
| R4 | No test files in src/ | ADDRESSED (Rust) | **HELD** — one live, correct exception (`error.rs` 16-line whitebox `mod tests`); precept amendment W13 (appendix A / manifest §2.4) |
| R5 | Delete legacy Python solver | code ADDRESSED / docs FAILED | **SPECIFIED** — W13 items 3/11 |
| R6 | web/ restructure | code ADDRESSED / fallout FAILED | **SPECIFIED** — W0 (gitignore, scripts, CI paths) |
| R7 | Fail explicitly, no silent handling | REGRESSED (~40 ledger violations) | **SPECIFIED** — appendix A is the item-by-item discharge map; the standing FAIL-EXPLICIT posture is a binding precept |
| R8 | Decouple pencil UI from CSP domain | PARTIAL→SPEC'D | **SPECIFIED** — W7 makes it structural + mechanically enforced (3 ESLint boundary blocks, 3-probe verified) |
| R9 | PRM across all animation loops | PARTIAL (chronic) | **SPECIFIED** — W8 centralized scheduler gate (the required design, Pass-2 prototype 10); W12 pencil-boil 0.5.0 carries it upstream |
| R10 | Shared skin → pencil-boil, never glass-ui | ADDRESSED (posture) | **HELD + SHARPENED** — the union adopt-partial ships **zero** glass-ui imports and (default) zero `backdrop-filter`; W9 gates grep the dist for it |
| R11 | COP support | ADDRESSED with defects | **SPECIFIED** — R8 budget variant W2; B&B verified sound + solves n=12 the baseline can't ([`kernel-behavior-preservation.md`](../evidence/kernel-behavior-preservation.md)) |
| R12 | wasm bindings solver+morph | ADDRESSED, surface unconsumed | **SPECIFIED** — W6 makes the solver surface the product; W11 gives morph its own repo + first real wasm tests |
| R13 | Publish to @mkbabb suite | ADDRESSED with the R7 aliasing bug shipped | **SPECIFIED** — W12 republishes everything post-fix; W1 carries the R7 fix |
| M1/M1b/M1c | keyframes/value/pencil-boil spec+lock (chronic ×2, P0) | escalated, prototyped | **SPECIFIED** — W7 lands the 5.1.0 migration content; W12 bumps `^0.6.0` |
| M2 | pencil-boil reactive-PRM teardown (chronic ×3) | unaddressed at lib | **SPECIFIED** — W12, own changeset in 0.5.0, never bundled with M4 |
| M3 | Controls-LEFT | SETTLED | **HELD** — exemption re-recorded |
| M4/M4b | Sun mascot / roadmap | booked | **SPECIFIED** — `useCelestialSun` **parked** (gate failed on inspection, Pass-2 D7); celestial proofs land in 0.6.0 (W12); trigger re-booked in appendix D |
| M5/M5b | DNS tuple / headers | verified + escalated P0 | **SPECIFIED** — W5 + OD-4 |
| D1 | Docs isomorphic with code | FAILED | **SPECIFIED** — W13, gate: every number traces |
| D2 | Root CLAUDE.md reflects web/ layout | PARTIAL | **SPECIFIED** — W13 |
| G1 | No build artifacts tracked | FAILED (11,406) | **SPECIFIED** — W0 |
| C1 | Deferred extensions documented | ADDRESSED | **HELD** — appendix D re-books S1–S4 |
| C2 | CHANGELOG coverage | PARTIAL | **SPECIFIED** — W11 per-crate CHANGELOGs; W13 item 15 |

## 2026-07-04 ratifications (owner, binding)

| Directive | Discharged by |
|---|---|
| Deploy Option A **and** C, concomitant | W5 ∥ W6 |
| Legacy API host NXDOMAIN — owner infra action | OD-4/W5 |
| FastAPI kept as hardened reference | W4 (the hardening) + W5 (the box) |
| Futoshiki = committed product wave | W10 (spec: [`futoshiki-wave-spec.md`](../evidence/futoshiki-wave-spec.md)) |
| One coordinated cross-repo release window | W12 + OD-6 (the date) |
| Delete dangling `api.csp-solver.babb.dev` CNAME | OD-4, verified in W5 |
| NEVER push bbnf-lang origin | standing order, restated in W12; all bbnf edits local |

## 2026-07-05 edict (owner, binding)

| Directive | Discharged by |
|---|---|
| Recursive colocation, ALL dirs, both stacks, idiomatic per language | W1 (`lib.rs` split, gac nesting), W4 (`games/` packages), W6 (`wasm/sudoku.rs`), W7 (the frontend manifest)—each with the manifests' measured contestables named, not smoothed |
| Long-running flat dirs → encapsulated modules | the census says no repo-wide dir qualifies ([`be-colocation-manifest.md`](../evidence/be-colocation-manifest.md) §4); the two oversized test *files* flagged as proportionate future cleanup |
| Animation layer = `src/pencil` (never "skin"—one UI) | W7; the `?skin=` flag excised, never authored |
| `src/games/{sudoku,futoshiki}` via `@pencil`/`@games`; games import pencil, never the reverse, never each other | W7 aliases + 3 boundary blocks; W10 slots in with zero renaming |
| Git hygiene (untrack the 11,406) | W0 |
| Morph renamed + excised per the spec | W11 (directory `morph-wasm/`, package identity frozen—OD-3) |

**Nothing in any prior mandate is unaccounted for.** Rows marked HELD need no work; every other row has a wave.
