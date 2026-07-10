# T2-W4 gate lane — independent re-verification

**Stamp:** Darwin arm64 (Apple M-series) · 2026-07-10 · working tree at tranche-2
HEAD `5f9980c8` (uncommitted; no commit/push per wave rule). Every number below
re-derived fresh, not read from the lane reports.

Surviving bank = N=3-hard (20) + N=4 all tiers (25) = **45 boards, 32,533 B** on disk.

| Gate | Bar | Result |
|---|---|---|
| Uniqueness | P1 harness over surviving bank, all unique + max_backtracks | **PASS** — `total boards 45 · unique 45 · non_unique 0 · unsat 0 · budget_trunc 0 · max_backtracks 158 · elapsed 0.035s · VERDICT: PASS`. Per-bucket max_bt: N=3-hard 101, N=4-easy 64, N=4-medium 158, N=4-hard 154. |
| Rust | `cargo test --workspace` 151/0/6 | **PASS** — 151 passed · 0 failed · 6 ignored (20 test binaries). |
| gac_ab_corpus | 0/N, N post-kill | **PASS** — `# GAC A/B false-UNSAT corpus — 50 boards (production config: Ac3 + Mrv)` / `false-UNSAT (GAC off): 0/50` / `false-UNSAT (GAC on): 0/50` / `VERDICT: 0/50 — PASS`. N=50 = 5 named hard 9×9 + 45 surviving templates. |
| Vite parse | `npm run build` regenerates templates.ts over surviving boards, clean, no ENOENT | **PASS** — `vite v8.1.4 … ✓ built in 349ms`, exit 0. templates.ts banner `45 boards, 8020 u32 cells total`; parsed bank N=3 {easy:0, medium:0, hard:20}, N=4 {easy:10, medium:10, hard:5}, N=2 key absent. Missing-tier (N=3-easy/medium git-rm'd dirs, N=2 subtree) handled by `existsSync` guard + `?? []` → live-gen; zero ENOENT. |
| wasm | lean artifact < 93,000 B raw | **PASS** — rebuilt via `wasm-pack build csp-solver/wasm --scope mkbabb --target web --profile wasm-release --no-default-features`; `csp_solver_wasm_bg.wasm` = **87,763 B** raw (5,237 B headroom). Bank not wasm-linked; reshape does not touch this artifact. |
| Record | embed byte-count in evidence/execution/ | **PASS** — 32,533 B (N=3-hard 3,591 + N=4 28,942); recorded here and in `T2-W4-bank.md` ledger. |
| N=5 grep | zero SUDOKU shipped-tier hits outside docs/tranches, precepts, audits | **PASS (classified below).** |

## N=5 grep classification

`git grep "N=5\|25x25\|25×25"` excluding `docs/tranches/*`, `docs/precepts/*`,
`docs/audits/*`. No hit asserts N=5 ships as a playable sudoku tier except the
three W7-booked root-doc claims. Full enumeration:

| Hit | Class |
|---|---|
| `CLAUDE.md:77`, `CLAUDE.md:150`, `README.md:43` | **W7-booked** — stale root-doc claims "web: N=5-easy" / "N from 2 to 5". Not this wave's to rewrite. |
| `csp-solver/src/puzzles/futoshiki/generate.rs:33` "N=5–7" | **Legitimate** — Futoshiki's own N range, unrelated to sudoku. |
| `csp-solver/src/puzzles/sudoku/generate.rs:110,129,130,133` | **Legitimate** — documents the locked N=5 rejection policy (zero embedded templates → not shipped). Enforces the kill, doesn't claim shipping. |
| `csp-solver/src/py/sudoku_api.rs:305,314,329,330` | **Legitimate** — the API's N=5 rejection logic + docs. |
| `csp-solver/examples/generate_templates.rs:17` | **Legitimate** — the generator stays N-general (`2,3,4,5 -> 25x25` describes its parameter, not the shipped bank). |
| `csp-solver/examples/gac_ab_corpus.rs:206` | **Legitimate** — `--n5`-gated (default OFF) graceful "not found, skipping" branch; bank excised, degrades cleanly. Default 50-board run never touches it. |
| `csp-solver/tests/sudoku_generate.rs:62` | **Legitimate** — test doc-comment stating "N=5 medium is deliberately not shipped." |
| `csp-solver/tests-py/test_wheel_contracts.py:271,273` | **Legitimate** — historical prose inside a `@pytest.mark.skip` reason (fuzzing across N=3/4/5); not executed, not a shipping claim. |
| `web/frontend/src/pencil/sheet/AnswerKeyLaminate.vue:97` | **Legitimate** — comment noting the grid renders "4×4 … 25×25", a generality assertion, not a size offered. |
| `web/frontend/vite.config.ts:32` | **Legitimate** — the W4 excision comment itself ("the whole N=5 subtree were excised"). |

**Zero surviving hit claims N=5 is a playable/shipped sudoku size** outside the
three root-doc lines already booked for W7.

## git status classification

**This wave (T2-W4):**
- Data bank: **71 deletions** (9 N=5 + 30 N=2 + 20 N=3-easy + 12 N=3-medium) + **45
  modifications** (reshaped survivors) under `csp-solver/data/sudoku_puzzles/`.
- `csp-solver/examples/generate_templates.rs` (M) — emit sparse puzzle-only JSON.
- `csp-solver/src/puzzles/sudoku/generate.rs` (M) — parse doc-comment + N=5 comment precision.
- `csp-solver/src/py/sudoku_api.rs` (M) — N=5 comment precision.
- `csp-solver/examples/verify_bank_uniqueness.rs` (??) — new P1 uniqueness harness.
- `docs/sudoku.md` (M) — bank language (N=2..4).
- `web/frontend/src/games/sudoku/data/templates.ts` (M) — regenerated (45 boards).
- `docs/tranches/2026-07-tranche-2/evidence/execution/T2-W4-{bank,laneB-frontend,gate-verification}.md` (??).

**Shared file (W4 + W6):**
- `web/frontend/vite.config.ts` (M) — W4's `SIZES=[3,4]` + `existsSync` guard AND
  W6's `VitePWA(...)` plugin coexist; no conflict.

**Cross-wave (T2-W6 — PWA/frontend/wasm, not this lane's surface):**
- `.gitignore`, `web/frontend/package.json`, `web/frontend/package-lock.json` (M).
- `web/frontend/src/App.vue`, `src/assets/index.css`, `src/assets/fonts/patrickhand-subset.woff2` (M).
- `web/frontend/src/games/futoshiki/{FutoshikiBoard/FutoshikiBoard.vue,FutoshikiGame.vue,composables/useFutoshiki.ts,composables/useSolver.ts,protocol.ts,solver.worker.ts,types.ts}` (M).
- `web/frontend/src/games/sudoku/{SudokuBoard/SudokuBoard.vue,composables/useSolver.ts,composables/useSudoku.ts,protocol.ts,solver.worker.ts,types.ts}` (M).
- `web/frontend/e2e/pwa-offline-smoke.mjs`, `web/frontend/public/pwa-{192x192,512x512,maskable-512x512}.png` (??).
