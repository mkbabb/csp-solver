# T4-W7 · lane E4 — the free-win telemetry getters

**Row**: T4-W7 §"Free win, do regardless (R1)" — surface the already-computed `nodes_explored` + `propagations` from Rust `SolveStats` (`config.rs:108-110`) through the wasm getters (`sudoku.rs` today dropped them — only `backtracks` was exposed). The wave's SOLE sanctioned wasm touch; R1's engine itself needs none. **Base**: `3b587b86`. **Stamp**: MacBook Pro, macOS 26.4.1 (25E253), 2026-07-13; node v26.0.0 / npm 11.12.1; cargo 1.97.0 / clippy 0.1.97 / wasm-pack 0.15.0.

## The gate row — born RED → GREEN

| Gate | Born-RED at base | Now |
|---|---|---|
| getters absent from the `.d.ts` surface | `csp_solver_wasm.d.ts` exposed only `readonly backtracks: bigint` on `SudokuSolveResult`/`FutoshikiSolveResult`; `nodesExplored`/`propagations` **nowhere on the wasm surface** — the two counters `SolveStats` already tallies (`search.rs:237` `nodes_explored += 1`; `propagate.rs:74`/`ac3.rs:93,148`/`monotonic.rs:36` `propagations += 1`) were dropped at the wire | **GREEN** — rebuilt `csp_solver_wasm.d.ts` now carries `readonly nodesExplored: bigint` + `readonly propagations: bigint` on **both** result types (sudoku `:79,:85`; futoshiki `:146,:152`), plus their `__wbg` thunks (`sudokusolveresult_nodesExplored`, `futoshikisolveresult_propagations`, …). Both are genuine, non-zero telemetry — the counters are incremented in the search/propagation kernels, not stubbed |

## The build — lean bytes + sha256

**Recipe** (the only sanctioned one): `make -C csp-solver/wasm wasm` → `wasm-pack build --scope mkbabb --target web --profile wasm-release --no-default-features`.

| | bytes | sha256 |
|---|---|---|
| baseline (pre-getters) | 89,995 B | `1402f40a68edb71b12e8687e482ea4be136cc6ba0ae5297f10a9b344ae0cb8c6` |
| **after (two getter pairs)** | **90,249 B** | `7e9f691cacff45396f8e12b8e5ecb7bc902c03972842b3229cf7eef095a37cec` |
| delta | **+254 B** | — |
| CI raw-size budget (`ci.yml:455`, fail >93,000) | 93,000 B | headroom after = **2,751 B** |

Under budget; the budget is NOT raised. `dist/assets/csp_solver_wasm_bg-*.wasm` = 90.24 kB in the fresh frontend build, confirming the `file:`-linked pkg is the one that ships.

## Rust — the getters (both games; futoshiki is the confirmed twin)

Both `SudokuSolveResult` and `FutoshikiSolveResult` stored only `backtracks: u64` and dropped `stats.nodes_explored` / `stats.propagations` at construction. The same drop existed in both, so the futoshiki twin was mirrored (per scope: mirror only if the same stats exist there — they do).

- **`csp-solver/wasm/src/sudoku.rs`** — added `nodes_explored: u64` + `propagations: u64` struct fields; `#[wasm_bindgen(getter, js_name = nodesExplored)]` + `#[wasm_bindgen(getter)] propagations` (following the module's explicit-`js_name` camelCase convention, as `solutionCount`/`budgetExceeded` do); bound `stats.nodes_explored`/`stats.propagations` in `solve_sudoku` and threaded both into the `Ok(SudokuSolveResult { … })`.
- **`csp-solver/wasm/src/futoshiki.rs`** — the byte-parallel mirror on `FutoshikiSolveResult` / `solve_futoshiki`.

No new compute — the counters were already summed by the search; this is a wire-surface addition only. u64 crosses as JS `bigint` (same marshalling as `backtracks`).

## Frontend — threaded to the stat-line data object, no new UI

A stat-line surface already exists (`solveTally.ts` renders `backtracks` in the margin), so per scope the two stats are threaded through the worker protocol + `useSolver` stat-line and on into the `SolveStats` data object — the terminus the display reads from. The **display is left untouched** (`solveTally.ts` still formats only `backtracks`/`elapsedMs`): rendering `nodesExplored`/`propagations` is W9's. Both games threaded symmetrically so the shared `SolveStats` isn't asymmetrically populated.

| File (×2, sudoku + futoshiki) | Change |
|---|---|
| `games/{game}/solver/protocol.ts` | solve response frame gains `nodesExplored: string` + `propagations: string` (wasm bigint → string, structured-clone-safe, mirroring `backtracks`) |
| `games/{game}/solver/solver.worker.ts` | populate `result.nodesExplored.toString()` / `result.propagations.toString()` |
| `games/{game}/solver/useSolver.ts` | `SolveResponse` gains the two `number` fields; `solveBoard` parses them via `Number(res.…)` |
| `games/{game}/composables/use{Game}.ts` | `solveStats.value` carries `nodesExplored` / `propagations` |
| `games/shared/types.ts` (once) | `SolveStats` interface gains `nodesExplored: number` + `propagations: number` (required, as `backtracks` is) — the shared data object both games and the margin read |

`solveTally.ts`, `MarginNote.vue`, `SudokuBoard.vue`/`FutoshikiBoard.vue` render surfaces: **unchanged**. W9-B1 reads `solveStats.nodesExplored`/`.propagations` when it builds the tally; it need thread nothing.

## Battery — exit codes verbatim

| Command | Exit | Note |
|---|---|---|
| `cargo fmt --all --check` | **0** | clean |
| `cargo clippy --workspace --all-targets -- -D warnings` | **0** | clean (only the pre-existing transitive `proc-macro-error2` future-incompat *note*) |
| `cargo clippy -p csp-solver-wasm --target wasm32-unknown-unknown -- -D warnings` | **0** | clean |
| `cargo test --workspace` | **0** | unit + parity/dualization + 4 doctests |
| `wasm-pack test --node csp-solver/wasm` | **0** | dualization 5/5 + futoshiki_parity 9/9 |
| `npx vue-tsc -b --force` | **0** | clean — the two required `SolveStats` fields typecheck through both games |
| `npm run test:unit` (vitest run) | **0** | 15 files / **133 tests** — protocol.test.ts (both games) green; they construct request/error frames only, so the widened solve frame is source-compatible |
| `npm run lint:eslint` | **0** | clean |
| `npm run lint:knip` | **0** | error-level; no dead file/dep/export/type (interface members set-but-unread-until-W9 are not knip's surface) |
| `npx prettier --check src/` | **0** | all matched files clean |
| `npm run build` | **0** | 173 modules; dist wasm 90.24 kB |

## Scope boundaries held

- **The lone wasm touch.** `git diff --stat`: `csp-solver/wasm/src/{sudoku,futoshiki}.rs` + frontend threading only. No `csp-solver/src/`, no `scripts/sync-csp-solver-vendor.sh`, no release/version bump — the getters are the wave's sole flagged wasm touch, exactly as R1's zero-wasm design permits.
- **No new UI.** The margin rendering of the two counters is W9-B1's; E4 stops at the `SolveStats` data object.
- **No commit.** Team-lead commits; pkg/ is a gitignored `file:`-link artifact, not staged.
