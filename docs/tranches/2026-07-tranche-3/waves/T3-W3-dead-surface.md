# T3-W3 — Dead surface (0.4.0 begins)

**The destructive excision wave: every zero-consumer surface goes, the py binding is pruned to the ballot's maximal scope, and the version-triple's 0.4.0 arc opens.** All three census gates that once fenced this wave are CLEAN (G5: morph never touches the isomorphic surface, any demoted symbol, or the LAP path — R-5), so the excisions lose their external-consumer gate. The ballot answered Q1 at option 1 (no PyPI, maximal prune), so the py scope is settled and the P2-L4 hand stub stands **as built** — no re-derivation branch executes (R-1). **T9 binds W3→W4:** the two removals are `-D warnings`-forced by W4's demotions, so they ride W4's commit or land strictly before it — a bare W4 cannot compile.

**Dependencies**: ← W2 (doc truth, interim stamp). **Effort**: M.

---

## Scope

### S1 — isomorphic excise + `full-mirror` (A15-K3 / P2-L1 / synthesis §2.2-S1)

- Delete `csp-solver/wasm/src/isomorphic.rs` (460 L, 7 wasm-bindgen exports — `Pruning`/`Ordering`/`PropagationStrategy`/`OptimizationMode`/`SolveConfig`/`SolveStats`/`Csp`).
- `wasm/src/lib.rs`: drop `#[cfg(feature="full-mirror")] mod isomorphic;` (was `:30-31`) and the `pub use isomorphic::*;` (`:39-40`).
- `wasm/Cargo.toml`: `default = ["full-mirror","assignment"]` → **`["assignment"]`**; remove the `full-mirror = [...]` feature line (`:38-40`). **serde stays** via `assignment` (no lockfile churn — P2-L1 §4 confirmed `Cargo.lock` unchanged).
- **Corrected co-edits:** the stale `ci.yml:243` and `ci.yml:302-303` full-mirror references; `wasm/src/lib.rs:16-19` doc; `wasm/README.md`; `CHANGELOG.md`; the `package.json`/`description` "isomorphic mirror of the Python binding" string.
- **Do NOT conflate with `wasm/src/assignment.rs`** (221 L — has a wasm test, a live morph consumer, an explicit keep-mandate; KEEP).
- **Rebuild `pkg/` + re-measure** full-module bytes (K10/K48 discipline — 222,436→198,652 B is transient-strong, re-confirm in-wave); lean stays 90,602 B byte-identical.

### npm 0.4.0 BREAKING stanza (P2-L1 §2, K29/K30)

Published `@mkbabb/csp-solver-wasm@0.2.0` is **FULL** (registry bytes: `class Csp` + `SolveConfig` + `SolveStats` + 4 enums in the d.ts, shasum `b05d3a96…`). Excising the 7 exports is a **BREAKING** npm change. Re-stamp `wasm/Cargo.toml:3` **0.2.0 → 0.4.0** in the excision commit (clears the 0.2.0-vs-core lag AND encodes the breaking removal across the 0.x minor slot). **Hard constraint: must not remain 0.2.0** (re-publishing 0.2.0 with 7 exports gone is a forbidden same-version breaking republish). Author the CHANGELOG stanza (P2-L1 §2 verbatim: the shipped surface is now the purpose-built `sudoku` + `futoshiki` + `assignment` layers only; no in-repo consumer affected).

### Py maximal prune — ballot Q1, option 1 (A21-S2 / P2-L4 §0 / synthesis §2.2-S3)

Applied against the pruned tree; every deletion here is `dead_code`-forced clean under `-D warnings` (P2-L4 verified all three cfgs: py-OFF / `--features py` / `--features abi3`):

- **REMOVE `src/py/futoshiki_api.rs`** (234 L) + its `py/mod.rs` registrations/re-exports (ballot Q1 discharges the A§2.2-D2 conflict → REMOVE; K12/RES-1 close).
- **Prune** `solve_sudoku_board`, `template_count`, the `SudokuCSP.backtracks()` alias, the `budget_exceeded`/`cancelled` getters (`cancelled` field removed — `dead_code`-forced; `budget_exceeded` kept private, drives the `BudgetExceededError` branch).
- **Remove** `Csp::{add_equals, add_less_than, add_greater_than, solve_with_given, propagate_with}` and the py `PropagationStrategy` enum (capability loss accepted — matches the gated/spiked surface).
- **RENAME** `py/sudoku_api.rs` → `py/sudoku.rs` (no dir split). Two mechanical co-edits (A21 §2): the `use crate::sudoku::{self, Difficulty};` self-reference at `py/sudoku_api.rs:12` is a **non-issue** — flag it in the commit message so it isn't investigated as a bug; and `py/mod.rs:21` doc line (`- \`sudoku_api\` — …`) renames the same commit.
- **Parity retarget:** `difficulty_parity.rs:135-140` — the `SIBLING_DEFINITIONS` `py/sudoku_api.rs` entry retargets to `py/sudoku.rs` (mirror set stays 3).
- **A6-D3 wording:** `py/sudoku_api.rs:271-279` present-tense "the Python service no longer takes this branch" → historical framing (rides the py-prune commit); the F1a provenance citation stays.
- **The hand stub stands as built** (P2-L4 §6, no re-derivation — Q1 opt 1): `csp-solver/csp_solver.pyi`, 135 lines (K31, not 130), full signatures + `__all__` = **15 names** encoding the maximal-prune surface. Contents frozen post-prune here; the file *lands* in W5.
- **L25-17** `optimization_mode` off the py wire — CLOSED (note → permanent rationale, rides this commit).

### `propagate_stratified` REMOVE (A15-K1 / P2-L7 / ballot Q2 → discharged)

Delete `solver/monotonic.rs:47-110` (~64 L incl. blank + doc + body — SCC-stratified monotonic propagation, **zero callers** repo-wide; dispatch drives `PropagationStrategy::Sweep` through `propagate_monotonic`). Shared imports (`ConstraintEnum, Revision, Domain, Variable, SolveStats, Unsatisfiable`) stay live for `propagate_monotonic` — no orphaned-import fallout. **WGATE files the scoped backlog item** (the memo as spec — a latent SCC-stratified optimization, wire-in deferred with a record). This is one of the T9-forced removals — rides W4's commit or strictly before.

### A15-K2 + stale examples

- `Csp::adjacency()` accessor (`csp/solve.rs:271-274`, 3 L, zero callers) — the field stays (17 internal reads); this is the *sixth* `crate::adjacency` importer, so its removal **sequences with the W4 relocation** (see W4). The kill itself is dead-surface; the sequencing is the constraint.
- **Stale examples** (~626 L, zero crate/CI blast radius — auto-discovered, no `[[example]]`/`required-features`): `parity_probe.rs` (253 L — baseline `91bb8b0` no longer in tree), `alloc_count.rs` (251 L — author-declared throwaway) **firm**; `probe_futoshiki_gen.rs` (122 L) **soft**. KEEP `gac_timing_probe`, `gac_ab_corpus`, `generate_templates`, `verify_bank_uniqueness`, the profiling harnesses (A15).

### FE dead-surface + `#storybook-texture` KILL

- **A16 K1a** (correctness, 1 line ×2, rides W3's mechanical batch): `'UNSATISFIABLE'` → `'UNSAT'` in `TEACHER_RED_CODES` — `sudoku/solver/apiError.ts:54`, `futoshiki/solver/apiError.ts:44` (the engine stamps `'UNSAT'` at `wasm/src/sudoku.rs:247`/`futoshiki.rs:296`; the current string is a latent mis-grade tripwire). The `apiError`→`classifyError` rename + K1b four-variant prune are **W7** (not here).
- **A16 K2a** `MOTION` const delete (`pencilConfig.ts:37-59`, 23 L, references deleted `easings.ts`); **K3** `.fira-code` orphan (`assets/index.css:360` — verify the woff2 isn't separately orphaned first). K2b `YOSHI_COLORS` is **ADOPT-AS-WIRE**, consumed by F7 in W9 — do NOT delete here.
- **`#storybook-texture` filter def KILL** (`SvgFilters.vue:163-167`) — R-4: settled twice independently (G3 whole-history `git log -S`: born dead at `3b83133c`, never consumed; G10 live DOM: def present, 0 consumers). F7's felt-nap plan must **not** cite it as precedent; celestial rewires to `wobble-celestial` (K42).
- **A6-D2** `.env.example` reduce/delete (8 of 9 keys zero-consumer: `CORS_ORIGINS`, `BACKEND_PORT`, `VITE_API_URL`, `HTTP_PORT`, `BUILD_TARGET`, `DEPLOY_*`, `BRANCH`); true `FRONTEND_PORT` to dev.sh's **9121** (not the listed 3000).

### L25-02/03/05/07 note excisions (synthesis §2.6, G3 §2b)

Delete the speculative forward-decl notes (S1 TieredCostEval, S2 warm_start, S4 tracing, M4 sun note) — the fold that *shrinks* surface (no consumer, triggers retired). **M4's lift stays parked** on its ≥2-consumer gate (supply side confirmed healthy, G3) — the in-app celestial palette rewire lands via F5/F7 in W10 regardless.

### T9 — sequencing (P2-L7 §6, K-forced)

The 2 removals (`propagate_stratified`, `Csp::adjacency()`) are `-D warnings`-forced by W4's demotions. Land them **with** W4's demotion commit or **strictly before** it — a bare W4 without them cannot compile. This wave applies them; the DAG constraint W3→W4 is load-bearing.

## Gates

Verbatim from the reconciliation (§2 DAG, T3-W3):

| Gate | Value |
|---|---|
| Headline | rebuild pkg/ + re-measure full-module bytes; `maturin build -i <tests-py venv>` wheel + tests-py green; **bbnf `--update && --verify` green at merged HEAD**; stub `__all__`=15 asserts post-prune surface |

Component checks:

| Gate | Value |
|---|---|
| wasm bytes | `pkg/` rebuilt; full-module re-measured (≈198,652 B, re-confirmed not projected); lean 90,602 B unchanged; `Cargo.lock` unchanged |
| Wheel | `maturin build -i <tests-py venv python>` (cp313, the **maturin `-i` interpreter pin** — a bare build picks host 3.14 → uninstallable cp314 wheel, G6 §2 / R-11a); tests-py green on the pruned surface |
| bbnf | `sync-csp-solver-vendor.sh --update && --verify` green at the **merged HEAD** (both arms proven at `3b75eca2`↔`be044e41`, nil differential — only the SHA changes, P2-L2/RES-2) |
| Stub | stub `__all__` = 15 asserts the post-prune surface (no futoshiki, no `PropagationStrategy`) |
| npm | `wasm/Cargo.toml:3` reads 0.4.0; CHANGELOG BREAKING stanza present; zero `full-mirror` / `isomorphic` refs in `ci.yml`, `wasm/lib.rs`, README |

## Seeds

- [`audit32/A21-module-structure-be.md`](../evidence/audit32/A21-module-structure-be.md) — S1/S2/S3 rows, the rename co-edits (§2), the domain/builder no-parallel-leak closure.
- [`audit32/A15-legacy-hunt-rust.md`](../evidence/audit32/A15-legacy-hunt-rust.md) — K1/K2/K3 + the stale-examples table (~626 L).
- [`audit32/A16-legacy-hunt-fe.md`](../evidence/audit32/A16-legacy-hunt-fe.md) — K1a (the UNSAT mismatch), K2a, K3.
- [`audit32/A6-wave-reaudit-w2-abrogation.md`](../evidence/audit32/A6-wave-reaudit-w2-abrogation.md) §D2/D3 — `.env.example`, the sudoku_api comment.
- `pass2/P2-L1.md` (npm stanza + byte re-measure), `pass2/P2-L4.md` §0 (the maximal-prune surface + stub), `pass2/P2-L7.md` §6 (T9), `pass3/G5-morph-census.md` (external-consumer clean), reconciliation R-4 (storybook-texture).

## Residual risks

- **The bbnf re-run and byte re-measure are worktree-proven at `3b75eca2`, not at the merged HEAD** — mechanics carry (T2/K30/RES-2), only the integers refresh. A missed co-edit (the `ci.yml:243,302-303` stale full-mirror refs especially) is this wave's failure mode; the grep runs over the whole tree.
- **The maximal py prune is capability-destructive by design** (futoshiki-py, `PropagationStrategy`, five `Csp` methods) — the ballot ratified it (Q1 opt 1); the stub `__all__`=15 is the mechanical proof the surface matches. If any of those symbols were secretly consumed, the stubtest/tests-py gate catches it loud.
- **T9 is a compile-order trap**: if W4 lands a demotion without W3's removals in the same or prior commit, `-D warnings` reddens. The reconciliation binds W3→W4 for exactly this; do not parallelize them.
