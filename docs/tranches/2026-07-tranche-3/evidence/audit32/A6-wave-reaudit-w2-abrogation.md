# A6 — Wave Re-Audit W2 (abrogation) at HEAD (3b75eca2)

Re-runs the T2-W2 gate (commit `98fe2562` "abrogation — the server, docker, and nginx go")
against HEAD `3b75eca2`. W2 excised the whole `web/api` FastAPI package, the docker-compose
trio, nginx, `web/frontend/Dockerfile`, `.dockerignore`, `scripts/deploy.sh`, both games'
`useApi.ts`; split `apiError` to a live-classifier keep-set; rehomed 4 wheel-contract tests to
`csp-solver/tests-py`; set the difficulty_parity mirror set to 3. This lane re-ran the narrow +
broad greps, re-verified the classifier keep-set, the tests-py contract, and checked whether any
later wave (W3..HEAD) reintroduced service residue.

Verdict: **7 holds, 3 drifts** (1 medium, 1 low-medium latent, 1 low). No service code
reintroduced by any post-W2 wave. The two substantive drifts are (D2) an un-swept `.env.example`
server/docker/deploy fossil and (D1) a classifier keep-set that still speaks the dead 7-code API
vocabulary and does not map the live `'UNSAT'` code that W6 later made throwable.

---

## HOLDS (W2 claims that still stand at HEAD)

**H1 — `web/api` package fully gone.** `web/` now contains only `frontend/` (+ a `.DS_Store`);
`ls web/` shows no `api/`. `git log 98fe2562..HEAD -- web/api docker-compose* web/nginx
scripts/deploy.sh` is **empty** — nothing reintroduced by W3, W4, W5, W6, W7, W8, or WGATE.

**H2 — docker / nginx / dockerignore / deploy.sh gone.** `docker-compose*.yml` → no matches;
`web/nginx`, `web/frontend/Dockerfile`, `web/api/Dockerfile`, `.dockerignore`, `scripts/deploy.sh`
all absent.

**H3 — `useApi.ts` gone from the live tree.** `git ls-files | grep -i useapi` → empty;
`find web -name useApi*` → empty. The 34 hits from a bare `find .` are all under
`.claude/worktrees/…` (ephemeral agent worktrees), which are git-ignored
(`git check-ignore` confirms) and tracked-count 0. Not repo residue.

**H4 — classifier keep-set live; ApiError half fully deleted.** Both
`web/frontend/src/games/{sudoku,futoshiki}/solver/apiError.ts` retain `classifyCode` /
`classifyError` and the `TypeError` branch (network fiction). `git grep` for `class ApiError`,
`instanceof ApiError`, `extends ApiError`, `ErrorEnvelope`, `.envelope`, and the bare word
`ApiError` across `web/frontend/src/**` → **zero** hits. The envelope machinery and the
`instanceof ApiError` branch are gone, exactly as W2 claimed.

**H5 — `_redirects` / `_headers` trued.** `web/frontend/public/_redirects` is the lone SPA
fallback `/*  /index.html  200` (no `/api/*` proxy line). `_headers` CSP carries
`connect-src 'self'` — no API origin whitelisted.

**H6 — `scripts/dev.sh` reduced to the FE launcher.** Header: "there is no backend to launch";
verifies `web/frontend` present, finds a free port, launches the frontend only.

**H7 — CI py-runtime retargeted + tests-py contract intact.** `.github/workflows/ci.yml`
py-runtime lane runs maturin `--release` → uv venv → `pytest` with `working-directory:
csp-solver/tests-py` (lines 191/197/202). All 4 tests rehomed
(`test_bench_compare`, `test_panic_contract`, `test_rust_backend`, `test_wheel_contracts`),
`requires-python = ">=3.13,<3.14"` (pins uv off the PyO3-incompatible host 3.14),
`pytest.importorskip("csp_solver")` guard present. Live check: `.venv/bin/python` imports
`csp_solver`; `pytest --collect-only` → **29 tests collected**.

**H8 — difficulty_parity mirror set = 3.** `SIBLING_DEFINITIONS` (tests/difficulty_parity.rs:135)
holds exactly 3 entries — `py/sudoku_api.rs`, `wasm/src/sudoku.rs`,
`web/frontend/src/games/sudoku/types.ts`. The abrogated `models.py` Pydantic mirror is gone; the
file's own header (L47-48) documents "The T2-W2 abrogation retired the FastAPI service, so the
Pydantic … mirror … is gone — the mirror set is now [3]." Justified reference, not residue.

**H9 — no live API surface in the frontend.** `git grep -nE "fetch\(|/api/v1|VITE_API_URL|
import\.meta\.env\.VITE"` over `web/frontend/src/**` (code lines) → empty. The `/api/v1` and
`apiError` strings that survive are all doc-comment "zero `/api/v1` dependency" affirmations that
W2 explicitly kept as correct.

---

## DRIFTS

### D2 — `.env.example` is an un-swept fossil of the abrogated server/docker/deploy stack (MEDIUM)

`/.env.example` (tracked) was last touched at **W0** (`7c245bed`) and never swept by W2. Of its
9 keys, **8 have zero consumers** anywhere in the tracked tree
(`git grep -l <key> -- ':!.env.example' ':!docs/tranches/**'`):

| Key | Owner (deleted at W2) | Consumers now |
|---|---|---|
| `CORS_ORIGINS` | `web/api/.../settings.py` FastAPI CORS | 0 |
| `BACKEND_PORT` | FastAPI/uvicorn | 0 |
| `VITE_API_URL` | `useApi.ts` | 0 |
| `HTTP_PORT`, `BUILD_TARGET` | docker-compose | 0 |
| `DEPLOY_PORT/USER/PATH`, `BRANCH` | `scripts/deploy.sh` + decommissioned box | 0 |
| `FRONTEND_PORT` | `scripts/dev.sh` | 1 (but dev.sh's default is **9121**, not the 3000 the example lists) |

The W2 commit body says "The CORS P0 dies unfixed, correctly" — yet the CORS config knob was left
in the committed example. This is the single largest literal server residue at HEAD: a `.env`
template advertising a FastAPI backend, a docker HTTP port, a Vite API URL, and an ssh deploy
target that no longer exist. tranche-III should reduce `.env.example` to the frontend-only surface
(or delete it) — nothing consumes `CORS_ORIGINS`/`BACKEND_PORT`/`VITE_API_URL`/`HTTP_PORT`/
`BUILD_TARGET`/`DEPLOY_*`/`BRANCH`.

### D1 — classifier keep-set carries dead API-taxonomy vocabulary; live `'UNSAT'` unmapped (LOW-MED, latent)

Both `apiError.ts` classifiers still speak the abrogated **7-code API taxonomy** rather than the
live 4-member `SolverErrorCode` union. The live worker vocabulary is
`SolverErrorCode = 'INVALID_INPUT' | 'BUDGET_EXCEEDED' | 'UNSAT' | 'WORKER_FAILURE'`
(`solver/solverError.ts:14`), and the wasm `describeError` whitelist is exactly
`INVALID_INPUT | BUDGET_EXCEEDED | UNSAT`, else `WORKER_FAILURE`
(`sudoku/solver/solver.worker.ts:61-66`).

But the classifier (`sudoku/solver/apiError.ts:44-51`, futoshiki identical):
- `TEACHER_RED_CODES = new Set(['UNSATISFIABLE', 'INVALID_INPUT'])` — the live UNSAT string is
  **`'UNSAT'`**, so `'UNSATISFIABLE'` is a **dead** string and `'UNSAT'` is **unmapped**:
  `classifyCode('UNSAT')` falls through to `paper-note` variant `'unknown'`
  ("something went sideways") instead of `teacher-red`.
- `PAPER_NOTE_VARIANT` maps `TIMEOUT`, `RATE_LIMITED`, `NOT_FOUND`, `INTERNAL` — all API-only
  codes the wasm/worker **never** emit. Dead branches, all from the abrogated 7-code taxonomy.

**Why it is not a live-visible bug today** (hence latent, not high):
1. The solve path never *throws* UNSAT — `solveSudoku` returns `solved:false` for an
   unsatisfiable board, and the "provable-UNSAT → teacher red" fiction is delivered via
   `result.solved ? 'solved' : 'failed'` (`composables/useSudoku.ts:228`), not the classifier.
2. The only path that throws code `'UNSAT'` is the **propagate** op (W6 beat-9 pencil marks;
   `wasm/src/sudoku.rs:248`, `wasm/src/futoshiki.rs:297`), whose consumer swallows it with a bare
   `catch {}` that just clears the marks (`useSudoku.ts:314-318`) and never routes it to
   `classifyError`. So `'UNSAT'` never reaches the classifier at runtime.

**Why it is a drift, not a hold:** W2's gate claimed "classifiers map the three live wasm codes."
At HEAD only 2 of the 3 (`INVALID_INPUT`, `BUDGET_EXCEEDED`) map correctly; the third, `UNSAT`,
does not. W6 **introduced** the UNSAT-throwing propagate surface *after* W2 certified the
classifier, and the classifier was never re-aligned. The inline comment
"UNSAT / INVALID_INPUT → the teacher's red pencil" (`useSudoku.ts:238`, `:242`) is **false** for a
thrown `'UNSAT'` — a latent trap for any future refactor that routes a propagate rejection through
`classifyError`. tranche-III fix: tighten both `apiError.ts` keep-sets to the exact live union —
`TEACHER_RED_CODES = {'UNSAT', 'INVALID_INPUT'}`, drop the four dead `PAPER_NOTE_VARIANT` API
codes, keep `BUDGET_EXCEEDED` + `WORKER_FAILURE`.

### D3 — surviving FastAPI-consumer comment at `csp-solver/src/py/sudoku_api.rs:273` (LOW)

W2 claimed to sweep "rust FastAPI-consumer comments." One survives: `sudoku_api.rs:271-279` cites
"pass-1 fastapi-service F1a" as the DoS-surface rationale for the GIL-release, and states "The
Python service no longer takes this branch." The F1a citation is historical/justified evidence
provenance; the present-tense "Python service" framing is stale — the PyO3 surface is now consumed
only by `csp-solver/tests-py` (a test harness), there is no service. Low severity; a wording
tighten, not a functional residue.

**Acceptable (not counted as drift):** `tests-py/pyproject.toml:2` ("FastAPI test suite") and
`tests-py/test_wheel_contracts.py:124` ("FastAPI asyncio.wait_for theater") — historical
provenance inside the rehomed contract tests, harmless.

---

## Commands (reproducible)

```
git show 98fe2562 --stat                      # W2 excision manifest
ls web/                                        # → frontend/ only
git log 98fe2562..HEAD -- web/api docker-compose* web/nginx scripts/deploy.sh   # → empty
git ls-files | grep -i useapi                  # → empty (live tree)
git grep -nw ApiError -- 'web/frontend/src/**' # → empty (class fully deleted)
git grep -l CORS_ORIGINS -- ':!.env.example' ':!docs/tranches/**'   # → empty (0 consumers)
grep -n TEACHER_RED_CODES web/frontend/src/games/sudoku/solver/apiError.ts  # 'UNSATISFIABLE' (dead)
grep -n SolverErrorCode  web/frontend/src/games/sudoku/solver/solverError.ts # union has 'UNSAT'
sed -n '135,152p' csp-solver/tests/difficulty_parity.rs   # SIBLING_DEFINITIONS = 3
cd csp-solver/tests-py && ./.venv/bin/python -m pytest --collect-only -q  # 29 collected
```
