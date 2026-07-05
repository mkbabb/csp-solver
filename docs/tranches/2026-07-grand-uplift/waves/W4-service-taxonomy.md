# W4 — PyO3 service + taxonomy + backend colocation

**The FastAPI service becomes the hardened reference the owner ratified**: typed error envelope, DI, cancellation, the per-game package layout, and data ownership moved to the Rust crate.

**Dependencies**: ← W1 (the `py/` tree + typed exceptions it consumes). **Effort**: M–L (3–5 days).

---

## Scope (file-level)

### Backend colocation (per [`be-colocation-manifest.md`](../evidence/be-colocation-manifest.md) §3.3/§3.6—adopted, contestable counter-argument recorded there)

```
web/api/src/app/
├── main.py                        # app assembly only: lifespan, middleware, router mounts (MOVE from api/main.py, rewritten for DI)
├── core/{settings,executors,errors,limiter}.py    # NEW — the Pass-2 DI skeleton, already correctly shaped
├── games/
│   ├── sudoku/{router,service,models}.py           # MOVE+shrink from api/routes/board.py + api/models/board.py; service carved out
│   └── futoshiki/{router,service,models}.py        # NEW, W10-gated
└── routes/{health,config}.py                        # cross-cutting — health MOVEs, config NEW (exposes Settings to the frontend)
```

- `_has_conflicts`: **EXCISE**, not ported (Pass-1 P2—Rust rejects the same input in 0.228 ms/8 backtracks; one consistent no-solution path).
- Tests mirror, flat-but-named (§3.5): `test_sudoku_router.py`, `test_sudoku_service.py`, `test_core_errors.py`, `test_core_settings.py`; `test_rust_backend.py`/`test_bench_compare.py` unchanged.
- The error-taxonomy/DI prototype (`pass2/api-error-taxonomy-stubs/*.py`) chose the flat layout—**port it into the `games/` shape, don't apply it** (the standing ported-not-applied rule).
- `web/api/CLAUDE.md` stale-tree fix is a precondition for clean landing (documents a deleted `app/solver/` package and 107 ghost tests)—minimal correction here; full rewrite rides W13.
- Pass-1 P4 (limiter wired to zero routes): WIRE—`@limiter.limit` on `/solve` (strict) + `/random` (loose). P7 (dependency-groups stanza, PEP 735 + pytest-timeout). P9 (`numpy` EXCISE).

### Cancellation + marshaling posture (per the gil-liberation amendments, [`synthesis-pass3.md`](../evidence/synthesis-pass3.md) §1 #5)

- `board.py`→`games/sudoku/service.py` wires `CancelToken` + a sane `node_budget`.
- **Route-level `max_solutions` cap (=1)**: cancel latency splits into ~7–9 ms Rust-layer (size/GAC-independent) + an unbounded O(solutions-found) GIL-held marshaling tail (6–19 µs/solution)—inert at `max_solutions=1`, so the route caps it; any future enumerate caller interleaves conversion.
- `/health` completion-stall documented: steady-state ~10 ms flat, but a reproducible 1.6–2.4 s tail stall when concurrent solves complete and workers reacquire the GIL to marshal—the cap is the first mitigation.
- Probe workloads hardened: `probe_gil.py`'s N=4-empty workload is vacuous under GAC-on (~30 ms)—cancellation demos use N=5/adversarial boards.
- `solve_sudoku_board`'s no-`BudgetExceededError`-on-empty+budget is an **intentional, documented asymmetry** (Pass-3 #7).
- Heartbeat claims always report with the same-host ceiling calibration (sleep-control ≈0.747, busy-floor ≈0.487, real 0.639)—the ~8–11-pt gap is marshaling residue, not GIL retention.

### N=5 policy (locked—do not re-open)

Easy: pregenerate 9/9 at 610–627 ms on the GAC-on tree. Medium/Hard: **rejected at the API**—2/2 + 2/2 still blow 60 s, 150 s long-leash still diverging; GAC collapses the single-solve cliff (45 s → 53 ms) but the generation wall is the uniqueness-proof re-solve near the minimal-clue frontier, which GAC shifts only ~6–9 density points (≈58→≈49% vs targets 42.9%/20%). **Do not re-open on propagation-strength improvements alone—only a search-breadth change (dedicated uniqueness-count algorithm, or relaxing uniqueness) could move it** (`pass3/n5-rejection-staleness.md` §4, verbatim clause).

### Data ownership (Pass-2 prototype 13; measured still-fully-open by [`be-colocation-manifest.md`](../evidence/be-colocation-manifest.md) §2.5)

- `git mv web/api/src/app/data/sudoku_puzzles → csp-solver/data/sudoku_puzzles/{N}/{difficulty}/` (crate root, sibling of `tests/`).
- Rust generator binary replaces the dead Python pipeline (Pass-1 P1 EXCISE—`generate_templates.py` imports a module deleted at `08c339b`).
- End-state: `include_dir!` compile-time embed (+170 KiB, working sketch) at its one call site in `puzzles/sudoku/generate.rs`; **delete** Python's `_load_templates`/`DATA_DIR`/`functools.cache` glob loader—`games/sudoku/service.py` then only calls `csp_solver.create_random_board(...)`. Interim Docker-copy acceptable; don't colocate Python-side data under `games/sudoku/data/` only to delete it (manifest §3.4).
- `sudoku_solutions/` bank (142 files, read by nothing): **EXCISE** (Pass-1 R14, re-measured).
- R13 FAIL-EXPLICIT: difficulty honored on the template fast path, debug-gated consistency assert (0 release cost).

### Pass-1 ledger items verified still open (booked here)

- **R12 (EXCISE one)**: `generate_from_template` and `apply_random_transform` remain byte-identical twins (verified in v2: `generate.rs:34` ≡ `transform.rs:102`)—delete one, repoint callers.
- **R15 (half-open)**: the typed-`Unsatisfiable` half is RESOLVED (`py/errors.rs`); `optimization_mode` is still not exposed on the py wire (verified: zero hits in `py/config.rs`)—expose it or record the deliberate deferral alongside GF-7's restarts/Chs-off-the-wire decision.

## Acceptance gates

| Gate | Proven value | Evidence |
|---|---|---|
| Taxonomy smoke | 7 typed codes live via TestClient against the real wheel, fault-injected 408/429/500 | `pass2/api-error-taxonomy.md` |
| Typed exceptions | 4 exceptions raised end-to-end; 172/172 via wheel | `pass3/py-module-reconciliation.md` |
| Docker | `docker compose build` of the wheel path green |  |
| Cancel | Rust-layer ≤28 ms at `max_solutions=1` (measured 21–28 ms Pass-2; 7–9 ms split Pass-3) | `pass2/pyo3-liberation.md`, `pass3/gil-liberation-completeness.md` |
| GIL heartbeat | ≥71% of expected ticks during a multi-second solve (with ceiling calibration reported) | ibid. |
| Timeout | `asyncio.wait_for(1.0)` fires at 1.000–1.002 s | ibid. |
| Data | one-command template regeneration; pytest green post-glob-deletion | `pass2/rust-owned-puzzle-data.md` |

## Seed artifacts

- `pass2/api-error-taxonomy.diff` + `api-error-taxonomy-stubs/` — **port** into the `games/` shape.
- `pass3/py-module-reconciliation.diff` — already inside the v2 tarball (W1); don't re-apply.
- `pass2/rust-owned-puzzle-data-code.diff` — re-derive against the landed tree (its base predates the kernel).
- Colocation moves: re-derive (renames per the manifest table §3.6).

## Residual risks

- The service rebase is the one surface never built against the composed base (−0.5 in the convergence record)—the stubs are proven against the old tree; the port is real work.
- `games/` nesting at N=2 games is the manifest's own highest-ranked contestable (§5.1)—the edict is explicit and Futoshiki is committed, but if W10 slips a full cycle, the flat layout would've been equal-value; proceed anyway (rename churn is bounded, machinery is not new).
- pyproject naming collision (Pass-1 P12: project `csp-solver` vs import `app`, dist `sudoku-rs` vs import `csp_solver`) remains open—the manifest retains package `app`; settle the *project-name* half here or record the deferral in appendix A.
