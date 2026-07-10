# T2-WGATE — Lane P2: headline reproduction sweep at final HEAD

Charter: reproduce the 30-repro top-10 (`../32-synthesis-readiness.md` §0/§5) from
COMMITTED paths only, at final HEAD (all nine waves landed). Every value below carries
its exact command. Machine: Apple M5 Max, 2026-07-10. No timing rows (the GAC probe lane
owns the quiet box next phase); byte sizes and pass/fail counts are host-deterministic.

Standing measurement rule honored: no absolute ms recorded as an SLA. Only deterministic
counts and byte sizes appear here.

---

## 1. Rust workspace suite

```
cargo test --workspace
```

Result: **151 passed · 0 failed · 6 ignored** (20 `test result:` groups). Matches the
expected triple 151/0/6. Aggregated by summing every `N passed` / `N failed` / `N ignored`
across all `test result:` lines of the full (untruncated) run. Exit 0.

Verdict: **MATCH.**

## 2. Python wheel-contract suite (`tests-py`)

```
cd csp-solver/tests-py && uv run --no-sync pytest
```

Result: **27 passed · 2 skipped** in 2.17 s (Python 3.13.5, pytest 9.1.1; 29 collected).
No wheel rebuild needed — import succeeded against the installed wheel. Breakdown:
`test_bench_compare.py` 6 · `test_panic_contract.py` 2 · `test_rust_backend.py` 13 ·
`test_wheel_contracts.py` 6 passed + 2 skipped.

Verdict: **MATCH** (27/2).

## 3. wasm sizes — both rebuilt fresh

Lean (the deployed Worker artifact):
```
wasm-pack build csp-solver/wasm --scope mkbabb --target web --profile wasm-release --no-default-features
wc -c csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm
```
Result: **90,602 B**. Expected 90,602. **MATCH.** Lean budget fail >93,000 B — holds.

Full module:
```
wasm-pack build csp-solver/wasm --scope mkbabb --profile wasm-release
wc -c csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm
```
Result: **222,436 B**. Expected 220,554. **MISMATCH: +1,882 B (+0.85%)** vs the surviving
stamp. Still comfortably inside the twiggy bands (warn >230,000 B / fail >240,000 B) — CI
stays green — but the surviving docs quote 220,554 B, which this fresh build at final HEAD
does not reproduce. See Finding F1 (§7).

Deploy-artifact restoration: the lean pkg was rebuilt **last** so the on-disk
`csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm` is the 90,602 B deploy artifact, not the
full build.
```
wasm-pack build csp-solver/wasm --scope mkbabb --target web --profile wasm-release --no-default-features
```
On-disk after rebuild: **90,602 B** — confirmed.

## 4. GAC A/B false-UNSAT corpus (Q5 opposite-sides certification)

```
cargo run --release --example gac_ab_corpus
```
Output:
```
# GAC A/B false-UNSAT corpus — 50 boards (production config: Ac3 + Mrv)
false-UNSAT (GAC off): 0/50
false-UNSAT (GAC on):  0/50
TOTAL false-UNSAT across both GAC states: 0
VERDICT: 0/50 — PASS
```
Result: **0/50 both modes.** Certifies the shipped bank sits on the sound side of the
reshape under both GAC states. **MATCH.**

## 5. Full e2e (local)

```
cd web/frontend && npx playwright test
```
Result: **33 passed** in 18.2 s (33 tests, 9 workers). Zero failures, zero skips.
Coverage: affordances (9), futoshiki (4), permalink (6), round9 (7), sudoku-interaction (7).
CI-green at final HEAD is the orchestrator's push. **MATCH** (33).

## 6. Bank uniqueness sweep

```
cargo run --release --example verify_bank_uniqueness
```
Output:
```
  N=3 hard   20 boards  unique=20/20  max_bt=101
  N=4 easy   10 boards  unique=10/10  max_bt=64
  N=4 medium 10 boards  unique=10/10  max_bt=158
  N=4 hard    5 boards  unique=5/5  max_bt=154
total boards  : 45   unique : 45   non_unique : 0   unsat : 0   budget_trunc : 0
VERDICT: PASS — all boards unique & solvable
```
Result: **45/45 unique.** **MATCH.**

Embedded bank cross-measure (independent):
```
find csp-solver/data/sudoku_puzzles -type f | wc -l   → 45
find csp-solver/data/sudoku_puzzles -type f -exec cat {} + | wc -c   → 32,533
```
45 files, **32,533 B** — matches the surviving docs' embed figure.

---

## 7. Surviving-docs headline cross-check

Every headline number in the surviving docs (root `README.md`, `csp-solver/README.md`,
`web/frontend/README.md`, `docs/benchmarks.md`) checked against what was measured this pass.

| Number | Doc claim | Measured | Verdict |
|---|---|---|---|
| Suite triple | 151/0/6 (README:79, csp-solver/README:197, benchmarks:43) | 151/0/6 | MATCH |
| pytest | 27/2 (implied by CI py-runtime) | 27/2 | MATCH |
| Lean wasm | 90,602 B (README:97, benchmarks:49, ci.yml:275/310) | 90,602 B | MATCH |
| Full wasm | 220,554 B (README:97, benchmarks:49, ci.yml:275/283) | **222,436 B** | **MISMATCH → F1** |
| Embed | 32,533 B / 45 boards (README:55, csp-solver/README:174) | 32,533 B / 45 | MATCH |
| GAC corpus | 0/50 both (README:88, benchmarks:16/99) | 0/50 both | MATCH |
| Bank uniqueness | 45/45 (examples surface) | 45/45 | MATCH |
| CI lanes | 10 lanes / 9 jobs (README:97) | 10 lanes / 9 jobs (doc-structural) | MATCH |
| e2e | 33 (CI `e2e` lane) | 33 passed | MATCH |

### Findings (listed, NOT silently fixed per the charter)

- **F1 — Full-module wasm size drift.** A fresh `--profile wasm-release` full build at final
  HEAD measures **222,436 B**; the surviving docs and the ci.yml comment stamp **220,554 B**
  (`README.md:97`, `docs/benchmarks.md:49`, `.github/workflows/ci.yml:275` & `:283`). Delta
  **+1,882 B (+0.85%)**. This is **within** the twiggy budget bands (warn >230 KB, fail
  >240 KB), so the CI size lane stays green and nothing is broken — but the quoted absolute
  no longer reproduces byte-exact. The lean figure (90,602 B) reproduces exactly; only the
  full module drifted. Flagged for the orchestrator's ledger-close decision: re-stamp the
  three sites to 222,436 B, or annotate the tolerance. Not fixed in this lane.

No other surviving-docs headline diverged from measurement.

---

## 8. Repro provenance

All commands run from committed paths at final HEAD. Builds were cache-warm for the
Rust examples (first `cargo test --workspace` primed the workspace). wasm builds were
fresh compiles under `wasm-release` with `wasm-opt` applied. The full suite was captured
untruncated for the aggregate; the e2e webServer was Playwright-managed (`npm run dev`,
port 3000, reuseExistingServer).
