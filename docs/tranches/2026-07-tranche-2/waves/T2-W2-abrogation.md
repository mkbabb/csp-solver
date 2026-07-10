# T2-W2 — Abrogation execution

**R1 GO, unconditional: the server, docker, and nginx go; the wasm path is the product.** The IFF's factual condition is MET—full user-facing parity, ≥10× at every interactive touch (~0.42 ms wasm 9×9-hard vs ~16 ms live-warm; band ~10–330×). This is the tranche's largest destructive change; every bullet below is the Q1-amended manifest (fresh grep at HEAD, five gaps closed) plus Q10's doc-reference sweep. **First act: rehearse the whole wave in a throwaway worktree** (delete `web/api`, run `cargo test` + the py-runtime lane)—Q1's findings are static-derived, never red-to-green rehearsed.

**Dependencies**: ← W0 (the regression net), W1. **Effort**: L.

---

## Scope

### EXCISE

`web/api/` (whole package—8 app-coupled test files die with it) · `docker-compose.yml` / `.override.yml` / `.prod.yml` · `web/api/Dockerfile` · `web/frontend/Dockerfile` · `web/nginx/` · `.dockerignore` · `scripts/deploy.sh`. CI has zero Docker anywhere—the docker excision has zero CI blast radius (L03 §B2).

### `scripts/dev.sh` — reduce to a frontend-only launcher (Q1 GAP 1)

Native "mode" is NOT a drop-in replacement—it IS the backend launcher. Excise the `--docker`/`MODE` two-mode machinery **and** the entire native backend stanza: the `web/api/src` existence guard (`:33-36`, exits 1 post-excision), the `uv run --directory web/api uvicorn app.main:app` start (`:74-79`), and the `BACKEND_PORT`/`CORS_ORIGINS`/`VITE_API_URL` plumbing (`:18,60,63,75,82,91`). What remains: `npm --prefix web/frontend run dev`.

### SPLIT `apiError.ts` (both games) — the exact symbol map (Q1 §C)

- **KEEP** exactly: `classifyError`, `classifyCode`, `PAPER_NOTE_COPY` + their internal closure—`Fiction`, `PaperNoteVariant`, `PAPER_NOTE_VARIANT`, `TEACHER_RED_CODES` (holds `INVALID_INPUT`, a live wasm code), and the `import { SolverError } from './solverError'`. The backend-only table entries (`UNSATISFIABLE`, `TIMEOUT`, `RATE_LIMITED`, `NOT_FOUND`, `INTERNAL`) are unreachable post-split but zero-risk—keep, no churn on the live classifier.
- **DELETE**: `apiErrorFromResponse`, `isApiErrorEnvelope`, `ApiErrorEnvelope`, `ApiErrorCode`, **and `ApiError` (class) together with the coupled edit removing `classifyError`'s `if (e instanceof ApiError)` branch**—deleting `ApiError` alone is a compile error. Delete both `useApi.ts` outright (imported by nothing—grep-verified).
- Sweep the retained headers (`web/api/.../errors.py` / `/api/v1/*` references) and the `ApiErrorCode`-mentioning comments at `useSudoku.ts:59`, `SudokuBoard.vue:31`. `SolverErrorNote.vue` (both games) is unaffected—pure presentational.

### REHOME the 4 wheel-contract tests (Q1 GAP 2)

`test_bench_compare` / `test_rust_backend` / `test_panic_contract` / `test_wheel_contracts` (618 L, proven self-contained: `pytest.importorskip("csp_solver")` + stdlib only, no `app`/`httpx`/`asyncio`) → `csp-solver/tests-py/`. **Create `csp-solver/tests-py/pyproject.toml`** (uv-manageable) declaring `pytest` + `pytest-timeout` with a minimal `[tool.pytest.ini_options]` (`testpaths=["."]`, `timeout=120`)—`uv sync` requires a project at the new working-directory. Retarget all three CI steps' `working-directory: web/api` → `csp-solver/tests-py` and shrink the wheel path `../../target/wheels/*.whl` → the new relative depth; sweep the lane-5 header comments (`ci.yml:21,142-153`) and the `:337` frontend-Dockerfile citation.

### Companion edits (each would silently red or dangle without it)

- `csp-solver/tests/difficulty_parity.rs:145,163` — drop the line-143–147 `../web/api/...models.py` tuple (load-bearing: the test `fs::read_to_string`s it and hard-fails on read error) + the `"../web/api/src"` SCAN_ROOTS entry; the mirror set becomes 3 (PyO3, wasm, frontend TS). Also the module-doc `:42` + reconciliation note.
- Doc-comment sweep: `error.rs:20`, `py/mod.rs:4`, `py/sudoku_api.rs:63,189`, `csp-solver/examples/generate_templates.rs:4`.
- **`_redirects` = TRIM, not delete**: remove the `/api/*`-proxy commentary (lines 4-22); **keep line 27 `/*  /index.html  200`**—the load-bearing SPA fallback.
- **`_headers`**: drop `https://api.sudoku.babb.dev` from `connect-src` at line 68 (→ `connect-src 'self'`) + trim the comment block `:41-48`. The Dockerfile/nginx CSP copies die with their files.

### Doc-reference sweep (Q10 Finding 1—closes the W2/W7 gate-ordering gap)

Strip or one-line-forward-point every `web/api` hit in files this wave does NOT delete: root `CLAUDE.md` (intro, dir-tree, `## API`, dev/test commands), root `README.md` (mirrors), `csp-solver/CLAUDE.md:157` (SCAN_ROOTS prose—keep in lockstep with the `difficulty_parity.rs` edit above), `web/frontend/CLAUDE.md:5,106` (Option-A framing), `web/frontend/src/games/futoshiki/README.md:5` (dead `useApi` fallback line). This is NOT the register rewrite or the fold—that's W7—just the minimum so this wave's gate is true at its own close.

### Retirements

- **N=5-easy retired as a feature** (the lone server-only capability—already unreachable at `vite.config.ts:30` and unrenderable past glyph G; the embed excision itself is W4).
- **API box decommission** (owner-side, R1): stop sudoku's vhost + uvicorn service on the shared origin `34.197.214.67`—NOT the box or the 7-SAN LE cert, which serve six other apps (verify-31 F8). OD-4 already executed; the only DNS action is removing `api.sudoku.babb.dev`'s A record when the service stops. The CORS P0 dies unfixed, correctly.

## Gates

| Gate | Value |
|---|---|
| Rust | `cargo test` green incl. `difficulty_parity` (mirror set = 3) |
| Python | py-runtime green from `csp-solver/tests-py/` (`uv sync` against the new pyproject) |
| Grep | zero `web/api` hits outside `docs/tranches/` across source, config, CI, **and prose alike** (the doc-reference sweep makes this satisfiable at W2's close—Q10); one enumerated exemption: `docs/grand-audit-2026-06-02.md`, which W7 relocates into `docs/tranches/` |
| Frontend | build + e2e green; both games' error notes still classify wasm errors (the split's keep-set live) |
| Live | site unaffected (it never called the API) |

## Seeds

- [`../evidence/pass3/Q1-w2-manifest-completeness.md`](../evidence/pass3/Q1-w2-manifest-completeness.md) — the manifest authority (fresh grep, symbol map, exact amendment text).
- [`../evidence/pass3/Q10-w7-fold-fidelity.md`](../evidence/pass3/Q10-w7-fold-fidelity.md) — the doc-sweep file list.
- [`../evidence/synthesis-pass1.md`](../evidence/synthesis-pass1.md) D1/D2/D3 (the IFF evidence chain: L01/L02/L03/L04 + verify-31 live probes).

## Residual risks

- **No red-to-green rehearsal exists** (Q1's FAIL-EXPLICIT)—hence the worktree rehearsal as the wave's first act. The dev.sh and tests-py findings are static-derived from launch/CI logic.
- The owner-side box decommission is out-of-repo and spec-only; six other SANs share the origin—service-only, never the box or cert.
- A missed grep is exactly this wave's failure mode; the gate's grep runs over the whole tree, not the touched files.
