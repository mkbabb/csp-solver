# G6 — BASELINE RUN (pass-3 closing lane)

**Charter:** synthesis §2.7.7 + a24 §G6 + §4-Q10 — *"Run rust+py+e2e at `3b75eca2`, stamp real
counts"* (closes A4 C12: counts stamped "this tree", never a SHA). Lane note adds the criterion
`--save-baseline pre-t3` + felt-latency anchors for the T3-W6/W8 perf waves.

**Base commit:** `3b75eca2595de26d5e60718f31bf46bc5ebfe25a` (master, working tree CLEAN — `git status
--short` = 0 lines; the session-start gitStatus snapshot was stale). Apple M5 Max, macOS 25.4,
rustc 1.97.0 (2026-07-07), 2026-07-10 ~17:00–17:45 local. **Load caveat:** run under load-avg ~3.8
with the sibling vite dev server(s) live (:3210 app + :4953 preview) — timing anchors are
load-inflated; **counts and node-counts are exact**. Logs banked under `pass3/g6/`.

## The three suites — ALL GREEN, all match doc claims

| Suite | Command | Result | Doc claim | Verdict |
|---|---|---|---|---|
| **Rust** | `cargo test --workspace` | **151 passed / 0 failed / 6 ignored** (18 bin harnesses, 20 result-lines incl. doctests) | 151/0/6 (a24/synthesis) | **MATCH**, exit 0 |
| **Py** | fresh cp313 wheel from HEAD → `pytest` in `csp-solver/tests-py/` | **27 passed / 2 skipped** in 2.83 s | 27/2 (A5) | **MATCH**, exit 0 |
| **E2e** | `playwright test` (33 specs) vs the served app | **33 passed** in 24.3 s | "green" (unstamped) | **GREEN, now stamped at 33** |

- The stale system-prompt CLAUDE.md says "150 passed … 17 binaries @ d9781e29" — superseded; HEAD is
  **151/0/6 across 18 harnesses**. The +1 vs the stale cache is expected drift (§1.4-3: that CLAUDE.md
  is a dead cache).
- The **2 py skips are `test_budget_exceeded_error_end_to_end` + `test_csp_timeout_error_end_to_end`**
  (`test_wheel_contracts.py`) — i.e. exactly the `CspError::Timeout`/`time_budget` pair the owner memo
  gates at **W1(e) / Q6 / L25-06+L25-59**. Baseline confirms: skipped-not-failed at HEAD, so the
  "excise variant + delete the skipped test" resolution loses nothing green today.

## Baseline findings (the value beyond "green" — feed W0/W2/W5/W6/CI)

1. **pyproject↔Cargo version drift is LIVE.** At HEAD `csp-solver/Cargo.toml` = **0.3.0** but
   `csp-solver/pyproject.toml` = **0.2.0** (both HEAD and worktree identical). maturin names the wheel
   from pyproject → `csp_solver-0.2.0-cp313…whl`. Confirms A20 / synthesis §2.4 / S6-agg (the
   unconditional-and-lands-first `0.2.0→0.3.0` fix). The installed test wheel was already 0.2.0, so
   version-consistent with HEAD's pyproject — but the crate/wheel semver disagree.

2. **maturin host-interpreter trap (NEW — flag to W0/W5 + CI py-runtime).** A bare
   `maturin build --release --features py` picked the **host Python 3.14** and emitted a **cp314**
   wheel, which will not load in the `tests-py` venv (Python 3.13.5, pinned `>=3.13,<3.14` for the
   pyo3-0.29 cp313 ABI). The faithful baseline required
   `maturin build … -i csp-solver/tests-py/.venv/bin/python` → cp313 wheel. Any W0 "rebuild wheel +
   tests-py green" step and the CI py-runtime lane must pin the interpreter, or they build an
   uninstallable artifact. (MEMORY already flags host-3.14 as PyO3-incompatible; here it *built* but
   ABI-mismatched the test venv.)

3. **E2e `:3000` harness fragility (NEW).** `playwright.config.ts` sets `baseURL
   http://localhost:3000` + `webServer{ port:3000, reuseExistingServer:true }`, and `vite.config.ts`
   sets **no explicit `server.port`**. My first run went **0/33** — every spec timed out on
   `svg.handwritten-logo`. Cause: the live sibling dev server was launched `--port 3210 --strictPort`,
   so the **app is served on :3210** while **`[::1]:3000` is that vite process's HMR websocket** (plain
   GET → `426 Upgrade Required`); `reuseExistingServer:true` latched onto the ws and the app never
   loaded. Re-pointed `PLAYWRIGHT_BASE_URL=http://localhost:3210` → **33/33 green**. The e2e pass is
   real; the config silently mis-binds whenever a dev server occupies :3000 without serving the app.
   Worth a W7 config-hardening note (pin `server.port`, or assert the target actually serves the SPA).

4. **GAC minority-cost direction reproduced; the headline ratio is load-sensitive.**
   `cargo run --release --example gac_timing_probe` (A18's first-party oracle), this run:
   - **Corpus wall ratio (Σoff/Σon): 10.51×**; **nodes 40,513 → 4,678 (8.66× fewer, deterministic)**.
   - **Named hard 9×9: 3/5 SLOWER with GAC ON** — Al Escargot 2.19×, Golden Nugget 1.66×, Inkala 2010
     3.36× slower; Platinum Blonde 2.10× / 17-clue 18.39× faster.
   - vs A18's re-run (13.79×, 3/5 at 1.68–3.12×) and `docs/benchmarks.md` (12.6–12.7×, 1.8–3.3×): the
     **direction and the disclosed minority cost are stable and reproduced**; the **absolute ratio is
     lower here (10.51×) purely from elevated load** (node counts prove the work is identical).
     **Implication for T3-W6:** the CSR/Vec-cache before/after (ROW-1) MUST be measured on a quiet box —
     the headline number swings ~10.5–13.8× on this same binary by machine load alone.

## Criterion `pre-t3` baseline — banked for T3-W6 `--baseline pre-t3`

`cargo bench -p csp-solver --bench {sudoku,queens,map_coloring,lattice,cost_finite_domain} --
--save-baseline pre-t3` — **exit 0, all groups saved** under `target/criterion/*/pre-t3/`. Note
`cargo bench --workspace -- --save-baseline …` **fails** (the flag is forwarded to the lib libtest
harness, which rejects it — banked as `criterion.log`); select `[[bench]]` targets by name.

Headline medians (this run, load-inflated — use as *shape*, re-measure quiet in W6):
| group | median |
|---|---|
| sudoku_9x9/al_escargot/ac3_mrv | 921 µs |
| sudoku_9x9/golden_nugget/ac3_mrv | 12.80 ms |
| sudoku_9x9/inkala_2010/ac3_mrv | 1.83 ms |
| sudoku_9x9/minimal_17/ac3_mrv | 414 µs |
| sudoku_16x16/ac3_mrv | 11.16 ms |
| queens_all/ac3_failfirst/12 | 1.47 s |
| queens_first/ac3_failfirst/16 | 699 µs |

**`assignment` + `iai_queens` deliberately EXCLUDED from the baseline:**
- `assignment` (the LAP/hungarian bench, relevant to A20's hungarian-kill / W5) hit a pathological
  CSP case — `square_roled/csp/50x50_2roles` estimated **745 s** for one sample group. Killed to avoid
  a 12-min thrash under load. Only its `square_dense/*` + one `square_roled` group banked (partial).
  **The W5 hungarian-kill lane owns the assignment A/B baseline anyway** (it needs before/after) — run
  it quiet there.
- `iai_queens` needs valgrind (unavailable on macOS/arm) — not runnable here; it's a callgrind lane.

## Byte anchors (felt-perf / size budgets)
- **Lean wasm `csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm` = 90,602 B** — matches the documented **W6
  figure** (synthesis §1.4); no drift.
- **`web/frontend/dist/assets/csp_solver_wasm_bg-*.wasm` = 90,602 B** — byte-identical to the source
  pkg; no build-path drift. (The stale CLAUDE.md's 87,853 B is the pre-W6 lean figure — dead.)

## Artifacts banked (`pass3/g6/`)
`rust-test.log` (151/0/6) · `pytest.log` (27/2, fresh wheel) · `e2e.log` (the 0/33 :3000 misbind) ·
`e2e-3210.log` (33/33 green) · `gac_timing_probe.log` · `criterion3.log` (banked benches) ·
`criterion.log`+`criterion2.log` (the `--workspace` and assignment-first failures, kept as evidence);
plus `target/criterion/*/pre-t3/` baselines and the fresh `target/wheels/csp_solver-0.2.0-cp313…whl`.

## Bottom line
**The audit's load-bearing premise — "tranche-2 landed green" — is now OBSERVED, not asserted, at
`3b75eca2`: rust 151/0/6, py 27/2, e2e 33/33, all exit 0.** Doc counts reconcile. Five findings feed
downstream (pyproject semver, maturin `-i` pin, e2e `:3000` fragility, the load-sensitive GAC
headline, the `pre-t3` criterion baseline). A24 G6 CLOSED; A4 C12 (SHA-stamped counts) closed jointly.
