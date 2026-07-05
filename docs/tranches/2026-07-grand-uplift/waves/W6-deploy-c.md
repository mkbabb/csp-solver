# W6 — Deploy Option C (in-browser solve via wasm + Worker)

**The static SPA solves and generates in-browser, structurally retiring the GIL/DoS class for served sizes.** Runs concomitant with W5 per ratification. Pass-3's critique found both named pieces unbuilt—then built and measured them; this wave lands those artifacts.

**Dependencies**: ← W1 (wasm surface); ∥ W5. Frontend files target the W7 topology (state the paths against it). **Effort**: M (2–4 days).

---

## Scope (file-level)

### Rust/wasm side

- **`wasm/src/isomorphic.rs` split first** (per [`be-colocation-manifest.md`](../evidence/be-colocation-manifest.md) §2.7): the generic config/`Csp` mirror stays in `isomorphic.rs` (~420 L, behind the `full-mirror` feature—bbnf-buddy's `solveAssignmentCop` intact, excluded from the deploy artifact), everything from `SudokuDifficulty` down moves to **`wasm/src/sudoku.rs`** (~165 L + the Pass-2 flat-wire re-key: flat-index `Uint32Array`, seeded RNG—the `SystemTime::now()` wasm32 panic fix rides this).
- **Budget fix** (`pass3/option-c/sudoku.rs.budget-fix.diff`): `coded_error` + `budget_exceeded` getter + optional `node_budget` param + `BUDGET_EXCEEDED`/`INVALID_INPUT` codes—taxonomy-consistent, self-contained for the lean build (the lean build compiles `isomorphic.rs`'s `WasmCspError` out; this closes that seam). Retires the old silently-discarded `node_budget_ms` wire field (Pass-1 W2 FAIL-EXPLICIT) with an explicit node-count budget.
- **The hardened difficulty two-test lands in the same commit as `wasm/src/sudoku.rs`**: [`../artifacts/difficulty_parity.hardened.rs`](../artifacts/difficulty_parity.hardened.rs)—casing-aware parity + filesystem discovery guard; verified to catch a planted 7th definition (a Futoshiki composable—the rehearsal of the exact likely W10 mistake). `SCAN_ROOTS` extends the moment any new hand-authored Difficulty surface appears (`pass3/difficulty-sixth-definition.md`).
- **Publish `@mkbabb/csp-solver-wasm`** and retire the vendored copy—Pass-2 risk 5 stays open until the frontend consumes the registry package.

### Frontend side (the Worker harness, built + measured by the Pass-3 critique)

Paths per the W7 topology (the critique's files were authored pre-rename):

- `src/games/sudoku/solver.worker.ts` + `protocol.ts` — solve off the main thread; typed errors through `postMessage`.
- `src/games/sudoku/lib/solverError.ts`, `src/games/sudoku/composables/useSolver.ts` — the API-free solve path.
- `src/games/sudoku/data/templates.ts` — SPA template assets **derived by a build rule from the canonical data home** (`web/api/src/app/data/sudoku_puzzles/` today; `csp-solver/data/sudoku_puzzles/` once W4 moves it—single source of truth, never a fork).
- `useSudoku.ts::solve()` gains a user-facing, size-scaled `node_budget` control.

## Acceptance gates

| Gate | Proven value | Evidence |
|---|---|---|
| Parity | **0/26 mismatches**, bit-exact solve+generate native↔wasm incl. seeded generation | `pass2/client-wasm-solve.md` |
| Size | lean artifact ≤93 KB band (measured 92,897 B raw / **37,261 B gzip**); twiggy lane enforces | ibid. |
| Latency | 4×4 0.031 ms / 9×9-easy 0.568 ms / 16×16-easy 2.394 ms vs 0.504 ms localhost round-trip floor; 16×16-hard tail 148–659 ms → **must run off-main-thread** | ibid. |
| Main-thread health | 16×16-hard solve in the Worker with boil **chains=1 throughout** (the tail is exactly why the Worker is the product surface, not a nicety) | `pass3/option-c-readiness.md` |
| Decoupling | `useSolver` path has zero `useApi` imports (grep gate) | ibid. |
| Errors | budget-exhaustion vs provable-UNSAT distinguishable on the wire (pre-fix they were wire-identical); typed through postMessage | ibid. |
| Difficulty | the hardened pair passes; planted-7th-definition catch demonstrated once | `pass3/difficulty-sixth-definition.md` |

## Seed artifacts

- `pass3/option-c/sudoku.rs.budget-fix.diff` + the Worker harness files (`pass3/option-c/`) — **re-apply with path retargeting** to the W7 topology.
- `pass2/client-wasm-solve.diff` — the flat-wire re-key + `full-mirror` gate; port onto the landed tree (its base predates the kernel).
- [`../artifacts/difficulty_parity.hardened.rs`](../artifacts/difficulty_parity.hardened.rs) — re-apply verbatim, same commit as `sudoku.rs`.

## Residual risks

- The `/config`-endpoint dependency (client timeout sharing the server constant) contradicts a zero-backend static deploy—under A+C concomitant this is moot (the endpoint exists), but the Worker path must degrade gracefully when the API origin is absent.
- Template derivation has two sequential homes (W4 moves the data)—land the build rule pointing at a single variable, flip it when W4 lands, never copy the JSON into the frontend tree by hand.
