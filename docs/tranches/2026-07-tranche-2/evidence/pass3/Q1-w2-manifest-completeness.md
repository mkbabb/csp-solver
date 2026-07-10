# Pass-3 Q1 — W2 manifest completeness (adversarial re-derivation)

**Author:** pass-3 critique fleet, lane Q1 · **Repo HEAD:** `8913023e` (verified `git rev-parse HEAD`), READ-ONLY · **Method:** fresh `git grep` at HEAD; every claim below re-derived, no prior lane trusted.

**Verdict:** the authored manifest is **~85% complete but NOT zero-dangling as written.** Five gaps, two of them build-/CI-red material (dev.sh native mode, tests-py Python project), one a gate self-contradiction, one cosmetic-but-gate-catchable, and one apiError precision hole that can *compile-break* if executed naively. The `apiError.ts` split's live-symbol set is now pinned exactly.

---

## A. What the fresh grep confirms HOLDS as authored

Re-derived the full web/api reference set:
```
git grep -n -I -E 'web/api|\.\./web/api|/api/v1|api\.sudoku' -- . \
  ':(exclude)web/api/**' ':(exclude)**/node_modules/**' \
  ':(exclude)web/frontend/dist/**' ':(exclude)docs/tranches/**'
```
plus a docker/nginx/uvicorn/Dockerfile/app.main sweep over the same exclusions.

Authored items that are **correct and complete**:

- **`difficulty_parity.rs:145,163`** — verified against the actual test logic (read in full). Line 145 is the `SIBLING_DEFINITIONS` tuple `("games/sudoku/models.py::Difficulty (Pydantic)", "../web/api/src/app/games/sudoku/models.py", Casing::Verbatim)`; line 163 is `SCAN_ROOTS = ["src", "wasm/src", "../web/api/src", "../web/frontend/src"]`. **Coupling re-derived:** the *load-bearing* removal is the line-143–147 tuple — `difficulty_variants_agree_across_all_known_definitions` does `fs::read_to_string("../web/api/src/app/games/sudoku/models.py")` and pushes a hard failure on read error, so a deleted web/api **reds the test** unless that tuple is dropped. Line 163's root removal is cleanliness-only (`scan_root_for_difficulty_definitions` early-returns on a missing dir), *but* required for the `stale`/`unscanned` set-equality to stay honest. Both authored → correct. Post-edit the mirror set is 3 (PyO3, wasm, frontend TS), which is right.
- **docker excision** — `docker-compose.yml:9,16`, `.override.yml:13,14`, `.prod.yml`, `web/api/Dockerfile`, `web/frontend/Dockerfile`, `web/nginx/`, `.dockerignore`, `scripts/deploy.sh` all confirmed present and all confirmed to have **zero live code importers** (only doc/comment refs remain, handled below). Nothing outside these files `include`s or `COPY`s them.
- **py-runtime retarget target files** — the 4 wheel-contract files all exist at `web/api/tests/{test_bench_compare,test_rust_backend,test_panic_contract,test_wheel_contracts}.py`. **Verified self-contained:** each does `pytest.importorskip("csp_solver")`; imports are only `pytest` + stdlib (`time/math/signal/subprocess/threading/ctypes`). **No** `import app`, **no** `httpx`, **no** `async def`, **no** `@pytest.mark.timeout` (the two `asyncio` hits in `test_wheel_contracts.py:59,124` are prose in comments). So the rehome carries only a pytest + wheel dependency — clean.
- **`useApi.ts` is dead-wired** — `grep -rE "^\s*import .*useApi|from ['\"].*useApi['\"]"` returns **empty**. Nothing imports either `useApi.ts`. Deleting both is safe; the "live site unaffected" claim holds (the shipped path is `useSolver`/Worker).
- **N=5 already unreachable** — `vite.config.ts` `SIZES = [2, 3, 4]`; N=5 never enters the frontend embed. Retiring it as a feature in W2 touches no code path; the embed excision is correctly W4.

---

## B. GAPS — where the manifest does NOT leave zero danglers

### GAP 1 — `dev.sh` needs more than a `--docker` trim (MATERIAL: breaks default dev)
The manifest says *"trim `scripts/dev.sh` `--docker` branch (native mode is already the replacement — nothing to build)."* **This is wrong about native mode.** `dev.sh` default (native) mode itself boots the backend against web/api:
- `dev.sh:33-36` — a hard guard: `[[ -d "$ROOT/web/api/src" ]] || { echo "ERROR: ... web/api backend package." >&2; exit 1; }`. After excision this **exits 1** on every native run.
- `dev.sh:74-79` — `CORS_ORIGINS=... uv run --directory web/api uvicorn app.main:app --host 0.0.0.0 --port "$BACKEND_PORT" --reload --reload-dir src &` — starts a uvicorn against a deleted package.
- plus the `BACKEND_PORT` plumbing (`:18,60,63,91`) and `VITE_API_URL=http://localhost:$BACKEND_PORT` (`:82`) feeding a now-nonexistent origin.

Native mode is **not** a clean replacement — it *is* the backend launcher. The correct edit excises the whole backend stanza (guard 33-36, backend-start 74-79, the two-mode `MODE` machinery, BACKEND_PORT/CORS/VITE_API_URL) and leaves a frontend-only script (`npm --prefix web/frontend run dev`). The one-line "trim --docker branch" under-specifies this by an order of magnitude.

### GAP 2 — tests-py rehome has no Python project for `uv sync` to resolve (MATERIAL: reds the py-runtime CI lane)
The 4 files currently run under `web/api/pyproject.toml`, which supplies (a) the `dev` dependency-group (`pytest`, `pytest-timeout`, `pytest-asyncio`, `httpx`, ruff, mypy) and (b) `[tool.pytest.ini_options] asyncio_mode=auto, testpaths=["tests"], timeout=120`. The CI lane's steps are literally `working-directory: web/api` → `uv sync` → `uv pip install ../../target/wheels/*.whl` → `uv run --no-sync pytest`.

The manifest says only *"retarget `ci.yml` py-runtime (`working-directory` + wheel-relative path)."* But **`uv sync` requires a pyproject at the new working-directory** — moving the 4 files to `csp-solver/tests-py/` without creating a project there leaves `uv sync` with nothing to resolve, and the `timeout=120` ini key requires the `pytest-timeout` plugin be installed or pytest errors on the unknown config option. Because the 4 files proved self-contained (GAP-2 upside), the new project is minimal — but it **must exist**. Companion edit the manifest omits: create `csp-solver/tests-py/pyproject.toml` (or a uv-manageable equivalent) declaring at least `pytest` + `pytest-timeout`, carrying a minimal `[tool.pytest.ini_options]`. Then retarget all three CI steps' `working-directory` to `csp-solver/tests-py` (or `csp-solver`) and fix the wheel-relative path accordingly.

### GAP 3 — the W2 gate "zero web/api grep hits outside docs/tranches/" is UNSATISFIABLE at W2 (gate self-contradiction)
The gate as authored: *"zero `web/api` grep hits outside `docs/tranches/` archives."* But these files reference web/api, are **not** in `docs/tranches/`, and are **explicitly W7-owned** (docs describe the post-excision tree; W7 depends on all prior → runs *after* W2):
- root `CLAUDE.md:3,29,31,33-35,93,103,106-107,113,144,166`
- root `README.md:11,64,67-68,74,87-88,96`
- `csp-solver/CLAUDE.md:157` (documents the SCAN_ROOTS incl. `../web/api/src`)
- `web/frontend/CLAUDE.md:5,11,106`
- `docs/grand-audit-2026-06-02.md` (multiple; W7 *relocates* it to `docs/tranches/`)

At the moment W2's gate runs, every one of these is a live hit. The gate contradicts the W2/W7 boundary. It must be scoped to executable surface (code, CI, build scripts, tests, transport config), explicitly exempting the living docs and `docs/*` that W7 owns.

### GAP 4 — the doc-comment sweep enumeration is incomplete (cosmetic, but the literal gate catches it)
Manifest lists `error.rs:20, py/mod.rs:4, py/sudoku_api.rs:63,189`. Fresh grep finds additional **code** (non-living-doc) comments mentioning web/api that a literal grep-gate flags:
- `csp-solver/examples/generate_templates.rs:4` — *"Replaces the dead `web/api/scripts/generate_templates.py`…"* (not in the list)
- `.github/workflows/ci.yml` comment lines `21, 142-153` (the whole lane-5 header narrates "the web/api uv venv", "authored under web/api/tests") and `:337` (*"the same skew fixed in web/frontend/Dockerfile"* — the excised Dockerfile citation the W1 note flagged as "dies in W2")
- `difficulty_parity.rs` module-doc (`:42` and the W6 reconciliation note) still narrates the `api/models/board.py → games/sudoku/models.py` web/api mirror
- the **retained** `apiError.ts` header comments (see GAP 5)

None break a build; all are caught by the literal gate → either sweep them in-pass or (better) scope the gate per GAP 3.

### GAP 5 — the `apiError.ts` split spec is imprecise at the `ApiError` boundary (can COMPILE-BREAK)
See §C for the full symbol map. The spec says *"delete the `{error:{code,message,retryable}}` envelope parsing + `useApi.ts`."* That phrase cleanly covers `apiErrorFromResponse` + `isApiErrorEnvelope` + `ApiErrorEnvelope`. It is **silent on two symbols it must rule on:**
- **`ApiError` (class)** — constructed *only* by `apiErrorFromResponse`. Once that dies, `ApiError` is referenced by exactly one live site: `classifyError`'s `if (e instanceof ApiError)` branch (a branch that can never match again). **Deleting `ApiError` without also editing `classifyError` is a compile error** (`classifyError` references an undefined name). Keeping it leaves inert dead code the tranche is otherwise excising. Either way the spec must name the decision AND, if deleting, name the coupled `classifyError` edit.
- **`ApiErrorCode` (type)** — zero real importers (`grep` finds only JSDoc/comment mentions at `useSudoku.ts:59`, `SudokuBoard.vue:31`). Dead export; delete-eligible, and its removal drifts those two comments.

Also: the retained file's header (sudoku `apiError.ts:18-22,42`; futoshiki `apiError.ts:6-9,35`) references `web/api/src/app/core/errors.py` and the `/api/v1/*` boundary — stale post-split, needs a doc sweep in the same pass.

### Minor — pin the `_headers`/`_redirects` edits (the manifest says only "verify-03-flagged")
- **`_redirects`** is a **TRIM, not a delete**: lines 4-22 are the `/api/*`-proxy commentary (references `useApi.ts`, `api.sudoku.babb.dev`, OD-5) — remove; **line 27 `/*  /index.html  200`** is the load-bearing SPA fallback — **keep**.
- **`_headers`**: drop `https://api.sudoku.babb.dev` from `connect-src` at **line 68** (leaving `connect-src 'self'`) and trim the associated comment block `:41-48`. The `Dockerfile:48` and `nginx/sudoku.conf:32` copies of the same CSP die with their whole files (no separate edit).

---

## C. The `apiError.ts` split — EXACT live-symbol map (attacked, pinned)

Every real `import` from a `lib/apiError` module at HEAD (`grep -rE "from ['\"].*lib/apiError['\"]|@games/[a-z]+/lib/apiError"`):

| Importer | Symbols | Survives W2? |
|---|---|---|
| `games/sudoku/composables/useSudoku.ts:18` | `classifyError` | ✅ live |
| `games/sudoku/SudokuBoard/SudokuBoard.vue:13` | `classifyCode`, `PAPER_NOTE_COPY` | ✅ live |
| `games/futoshiki/composables/useFutoshiki.ts:14` | `classifyError` | ✅ live |
| `games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue:25` | `classifyCode`, `PAPER_NOTE_COPY` | ✅ live |
| `games/{sudoku,futoshiki}/composables/useApi.ts:2/15` | `apiErrorFromResponse` | ❌ dies with `useApi.ts` |

**LIVE for wasm errors — the exact keep-set** (these three exports + their transitive internal closure):
- **`classifyError`** — the wasm/Worker entry point. Handles `SolverError` (the wasm error, from `./solverError`), `TypeError` (rejected fetch — vestigial but harmless), and a fallback. Internally references `ApiError` (see caveat), `classifyCode`, `PAPER_NOTE_COPY`.
- **`classifyCode`** — maps a code string → `Fiction`. Serves all three wasm `SolverErrorCode`s: `INVALID_INPUT`→teacher-red (via `TEACHER_RED_CODES`), `BUDGET_EXCEEDED`→`budget`, `WORKER_FAILURE`→`network`. Verified complete against `solverError.ts`.
- **`PAPER_NOTE_COPY`** — the note-card copy table.
- transitive-live internals: **`Fiction`**, **`PaperNoteVariant`** (types), **`PAPER_NOTE_VARIANT`**, **`TEACHER_RED_CODES`** (const tables), and the **`import { SolverError } from './solverError'`**. `TEACHER_RED_CODES` must stay — it holds `INVALID_INPUT`, a live wasm code. The extra backend-only entries in the tables (`UNSATISFIABLE`, `TIMEOUT`, `RATE_LIMITED`, `NOT_FOUND`, `INTERNAL`) are unreachable post-split but zero-risk; recommend **keeping** them to avoid churn on the live classifier.

**DEAD — the envelope-parsing surface to delete:**
- `apiErrorFromResponse` (only `useApi.ts` consumed it), `isApiErrorEnvelope` (only `apiErrorFromResponse` consumed it), `ApiErrorEnvelope` (typed only those two), `ApiErrorCode` (zero real importers).
- **`ApiError` (class)** — dead once `apiErrorFromResponse` goes, but **coupled to `classifyError`** (GAP 5). Delete it *only together with* removing `classifyError`'s `instanceof ApiError` branch, or keep it inert; the spec must pick.

`SolverErrorNote.vue` (both games) import only `@pencil/grid/HandDrawnOutline.vue` — pure presentational, fed by `classifyCode`'s output via props. They do not touch `apiError.ts` and are unaffected.

---

## D. THE EXACT WAVE-SPEC AMENDMENT (W2)

Replace the three affected W2 bullets and the gate line as follows.

**1. `dev.sh` bullet — REPLACE** "trim `scripts/dev.sh` `--docker` branch (native mode is already the replacement — nothing to build)." **WITH:**
> Reduce `scripts/dev.sh` to a frontend-only launcher: excise the `--docker`/`MODE` two-mode machinery *and* the entire native backend stanza — the `web/api/src` existence guard (`:33-36`), the `uv run --directory web/api uvicorn app.main:app` backend start (`:74-79`), and the `BACKEND_PORT`/`CORS_ORIGINS`/`VITE_API_URL` plumbing (`:18,60,63,75,82,91`). Native "mode" is the backend launcher, not a drop-in replacement; what remains is `npm --prefix web/frontend run dev`.

**2. REHOME bullet — APPEND:**
> Also create `csp-solver/tests-py/pyproject.toml` (uv-manageable) declaring `pytest` + `pytest-timeout` and a minimal `[tool.pytest.ini_options]` (`testpaths=["."]`, `timeout=120`) — the 4 files are self-contained on `pytest` + the `csp_solver` wheel (no `app`/`httpx`/`asyncio`/`pytest-asyncio`), so nothing else is needed, but `uv sync` requires a project at the new working-directory. Retarget all three CI steps' `working-directory: web/api` → `csp-solver/tests-py` and fix the wheel-relative install path; sweep the lane-5 header comments (`ci.yml:21,142-153`) and the `:337` frontend-Dockerfile citation.

**3. SPLIT bullet — REPLACE** the `apiError.ts` line **WITH:**
> Split `apiError.ts` (both games): **keep** exactly `classifyError`, `classifyCode`, `PAPER_NOTE_COPY` and their internal closure (`Fiction`, `PaperNoteVariant`, `PAPER_NOTE_VARIANT`, `TEACHER_RED_CODES`, `import { SolverError }`). **Delete** `apiErrorFromResponse`, `isApiErrorEnvelope`, `ApiErrorEnvelope`, `ApiErrorCode`, **and** `ApiError` — the last requires the coupled edit removing `classifyError`'s `if (e instanceof ApiError)` branch (deleting `ApiError` alone is a compile error). Delete both `useApi.ts` outright (imported by nothing — grep-verified). Sweep the retained header comments (`web/api/.../errors.py` / `/api/v1/*`) and the `ApiErrorCode`-mentioning comments at `useSudoku.ts:59`, `SudokuBoard.vue:31`.

**4. Companion-edits bullet — APPEND** to the doc-comment sweep: `csp-solver/examples/generate_templates.rs:4`, `difficulty_parity.rs` module-doc (`:42` + reconciliation note), `ci.yml:337`. And pin the transport edits: `_redirects` = trim the `/api/*` commentary, **keep** the `/*  /index.html  200` SPA fallback; `_headers` = drop `https://api.sudoku.babb.dev` from `connect-src` (line 68 → `connect-src 'self'`) + trim comment `:41-48`.

**5. Gate line — REPLACE** "zero `web/api` grep hits outside `docs/tranches/` archives" **WITH:**
> zero `web/api` grep hits in executable surface (code, CI, build scripts, tests, transport config) — the living docs (root + package `CLAUDE.md`/`README.md`) and `docs/*` are W7-owned and exempt at the W2 gate.

---

*Deliverable of record. HEAD 8913023e, fresh grep. Manifest holds at decision granularity; five named completeness gaps at execution granularity, amendment above. FAIL-EXPLICIT: I did not `cargo test` a post-excision worktree (READ-ONLY charter) — the dev.sh and tests-py findings are static-derived from the launch/CI logic, not a rehearsed red-to-green; a W0/W2 executor should confirm by actually deleting web/api in a worktree and running `cargo test` + the py-runtime lane.*
