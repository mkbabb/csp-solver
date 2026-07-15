# T4-WGATE — Lane G2: the counts re-stamp at the gate SHA

Charter: re-measure EVERY headline figure on the WORKING TREE at the gate SHA by my own
runs (trust no doc). Grammar is T2-WGATE-repro's: **command → output → figure**, every row
reproducible. Nothing is checked out — the tree is measured at HEAD as it sits.

- **Gate SHA (tree of record)**: `d70073f30c827d8acebbc1df2388900f29d880b9` — `T4-W14: docs re-formulation …`
- **CI run of record (this SHA, master)**: run `29449438899` — `conclusion: success` (all 11 jobs green).
- **Machine**: Apple M5 Max · macOS 26.4.1 (Darwin 25.4.0, build 25E253) · 2026-07-15.
- **Toolchain**: rustc/cargo 1.97.0 (stable) · node 26.0.0 / npm 11.12.1 · vitest 4.1.10 · playwright 1.61.1 · uv 0.7.15 / CPython 3.13.5 (uv-managed) · maturin >=1,<2 / pyo3 0.29.

Standing measurement rule honored: no absolute ms recorded as an SLA. Only deterministic
counts and byte sizes appear here. Where a figure differs from the **W14 census**
(e2e 82/13 · rust 208/0/0 · unit 307/29 · CI 11 jobs · lean 121,855 B darwin / 124,091 B
runner · bank 32,095/45), it is **FLAGGED, not silently reconciled** (§10).

---

## 1. Rust triple + fmt + clippy

```
cd csp-solver && cargo test --workspace
```

Aggregated across all 28 `test result:` groups (binaries + doctests), summing every
`N passed` / `N failed` / `N ignored`:

Result: **208 passed · 0 failed · 0 ignored** (28 groups). Exit 0.

```
grep -E 'test result:' <log> \
  | awk '{for(i=1;i<=NF;i++){if($i=="passed;")p+=$(i-1);if($i=="failed;")f+=$(i-1);if($i=="ignored;")g+=$(i-1)}} END{print p,f,g}'
→ 208 0 0
```

```
cargo fmt --all --check      → FMT_EXIT=0
cargo clippy --workspace --all-targets -- -D warnings   → CLIPPY_EXIT=0
```

Both exit 0. (clippy emits one non-fatal future-incompat *note* on `proc-macro-error2 v2.0.1`
— a transitive-dep deprecation, not a lint denial; the lane is green. It is the same crate
`cargo-audit` reports as an informational `unmaintained` advisory.)

Figure: **rust 208/0/0**, fmt clean, clippy clean. **MATCH** (census 208/0/0).

## 2. tests-py — CI recipe reproduced locally

CI py-runtime recipe (ci.yml lanes 5): clean `target/wheels`, `maturin build --release` against
the pinned 3.13 interpreter, `uv pip install *.whl`, `uv run --no-sync pytest`. Reproduced:

```
PY313=~/.local/share/uv/python/cpython-3.13.5-macos-aarch64-none/bin/python3.13
rm -rf target/wheels
PYO3_PYTHON=$PY313 uvx --from 'maturin>=1.0,<2.0' maturin build --release \
  --manifest-path csp-solver/Cargo.toml --interpreter "$PY313" --out target/wheels
```

Wheel built in **3.02 s** compile (workspace warm — well under the ~10-min stop-threshold, so
the local path was taken, not the CI-cite fallback). Built artifact:
`csp_solver-0.4.0-cp313-cp313-macosx_11_0_arm64.whl` (307,999 B).

```
cd csp-solver/tests-py
uv pip install ../../target/wheels/*.whl
uv run --no-sync pytest
```

Result: **27 passed** in 2.31 s (27 collected · 0 failed · 0 skipped) —
`test_bench_compare.py` 6 · `test_panic_contract.py` 2 · `test_rust_backend.py` 13 ·
`test_wheel_contracts.py` 6.

Run of record — gate CI `py-runtime` job (run 29449438899):
```
============================== 27 passed in 4.78s ==============================
Success: no issues found in 2 modules      (stubtest, flag-free)
```

Figure: **tests-py 27/0** (stubtest clean). **MATCH** (census 27/0). See FLAG-2 (§10) — the
wheel/pyproject version is **0.4.0**, lagging the crate's **0.5.0**.

## 3. Frontend unit (vitest)

```
cd web/frontend && npx vitest run
```

Result:
```
 Test Files  29 passed (29)
      Tests  307 passed (307)
```

Figure: **307 tests · 29 files** (0 failed · 0 skipped). **MATCH** (census 307/29,
read tests/files).

## 4. e2e census — static + run of record

Static count over the committed spec set:
```
cd web/frontend
ls e2e/*.spec.ts | wc -l                → 13
grep -h 'test(' e2e/*.spec.ts | wc -l   → 83
```

Per-file `test(` breakdown (sums to 83): affordances 10 · mobile-affordances 10 ·
mobile-platform 9 · gallery 8 · sudoku-interaction 7 · visual-regression 7 · drawer 6 ·
gallery-guard 6 · permalink 6 · share-truth 5 · futoshiki 4 · visual-golden 4 ·
throttled-void 1. (`grep 'test('` matches plain `test(` only — `test.describe(` / `test.skip(`
carry a `.` and are excluded; no `test.skip/only/fixme` calls exist in the tree — the sole
`.skip` hit is a comment in `affordances.spec.ts:158`.)

Run of record — gate CI `e2e` job (run 29449438899): the default config + the two out-of-band
configs, **82 executed, all pass**:
```
Run the Playwright e2e suite        → Running 77 tests using 2 workers →  77 passed (1.7m)
Run the visual golden gate          → Running 4 tests …                →   4 passed (11.5s)
Run the throttled-void gate         → Running 1 test …                 →   1 passed (6.8s)
```

Figure: **static 83 `test(` / 13 files**; executed run-of-record **82** (77+4+1). Files 13
**MATCH**; the `test(` count is **83 vs census 82 → FLAG-1 (§10)**.

## 5. Lean wasm — file-link, dist, and the runner figure

```
find csp-solver/wasm/pkg -name '*.wasm' -exec wc -c {} +
→ 121855  csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm
```

dist was current (built today 16:38; no rebuild needed — vite copies the file-linked pkg wasm
verbatim):
```
find web/frontend/dist -name '*.wasm' -exec wc -c {} +
→ 121855  web/frontend/dist/assets/csp_solver_wasm_bg-BECxa0-b.wasm
```

Runner figure — gate CI `twiggy` job (run 29449438899), the gate figure of record:
```
lean artifact raw size: 124091 B (runner-measured 124,091 B; fail >127,500)
full module raw size: 227385 B
```

Figure: **lean 121,855 B darwin / 124,091 B runner** (runner is the band figure; fail
>127,500 B — holds with 3,409 B headroom). **MATCH** (census 121,855 / 124,091). The
full-module runner build measures **227,385 B** (inside the 240 KB fail / 230 KB warn bands —
green); the ci.yml band comment still stamps 222,436 B (drift note, §10 — not a headline
census row).

## 6. Embedded bank

```
find csp-solver/data/sudoku_puzzles -type f | wc -l              → 45
find csp-solver/data/sudoku_puzzles -type f -exec cat {} + | wc -c   → 32095
```

Figure: **45 files · 32,095 B**. **MATCH** (census 32,095/45).

## 7. Goldens

```
ls web/frontend/e2e/goldens/*.png     → 8 files
```

**4 golden pairs**, each with a darwin + a linux baseline (4 darwin + 4 linux):
`cell-light` · `grid-corner-light` · `logo-light` · `toggle-crest-dark`. The linux baselines
are the CI pass-of-record (the runner OS); darwin are the local crops. Pass of record — the
gate CI `e2e` job's visual golden gate: **4 passed** (§4).

Figure: **4 pairs / 8 PNGs (4 darwin + 4 linux)**. **MATCH** ("4 golden PNG pairs").

## 8. CI shape

```
gh run view 29449438899 --json jobs --jq '.jobs | length'   → 11
```

The gate run (headSha d70073f3, master, `conclusion: success`) — **11 jobs, all `success`**:
build-lean-wasm · lint · cargo-audit · wasm · rust · py-runtime · iai · py-compile · e2e ·
twiggy · frontend.

Figure: **11 jobs, all green**. **MATCH** (census 11 jobs).

## 9. Versions at the gate tree (source figures)

```
csp-solver/Cargo.toml            version = "0.5.0"
csp-solver/wasm/Cargo.toml       version = "0.5.0"
csp-solver/wasm/pkg/package.json "version": "0.5.0"
csp-solver/pyproject.toml        version = "0.4.0"     ← lags the crate (FLAG-2)
web/frontend/package.json        "@mkbabb/pencil-boil": "^0.9.2"
                                 "@mkbabb/csp-solver-wasm": "file:../../csp-solver/wasm/pkg"
Cargo.toml (root)                [workspace] virtual manifest — NO version key
                                 ([workspace.package] pins edition 2024 / rust-version 1.88 only;
                                  members self-version)
```

Registries (W14-confirmed, quoted — not re-probed this lane): crates.io **csp-solver 0.5.0**
published (predates the five-family surface; the 0.6.0 row is banked) · npm **wasm 0.2.0**
(vs source 0.5.0 — the recorded registry split) · **pencil-boil 0.9.2**.

Figure: crate/wasm/pkg **0.5.0** · pyproject/wheel **0.4.0** · pencil-boil pin **^0.9.2**.
Source-vs-registry splits are W14-recorded; the pyproject **0.4.0-vs-crate-0.5.0** lag is
**FLAG-2 (§10)** — it is not in the brief's registry summary.

---

## 10. Cross-check vs the W14 census

| Row | Command (this lane) | Measured | W14 census | Verdict |
|---|---|---|---|---|
| rust triple | `cargo test --workspace` | 208 / 0 / 0 | 208 / 0 / 0 | **MATCH** |
| fmt / clippy | `cargo fmt --check` · `cargo clippy … -D warnings` | exit 0 / exit 0 | green | **MATCH** |
| tests-py | CI recipe (maturin → uv → pytest) | 27 / 0 | 27 / 0 | **MATCH** |
| frontend unit | `npx vitest run` | 307 / 29 | 307 / 29 | **MATCH** |
| e2e static | `grep test( e2e/*.spec.ts` / files | **83** / 13 | **82** / 13 | **FLAG-1** (files match) |
| e2e executed | gate CI e2e job | 82 (77+4+1), pass | — | run of record |
| lean wasm darwin | `wc -c` pkg + dist | 121,855 B | 121,855 B | **MATCH** |
| lean wasm runner | gate CI twiggy log | 124,091 B | 124,091 B | **MATCH** |
| full wasm runner | gate CI twiggy log | 227,385 B | (222,436 comment) | drift (green) |
| bank | `find … \| wc -l` / `cat … \| wc -c` | 45 / 32,095 B | 45 / 32,095 B | **MATCH** |
| goldens | `ls e2e/goldens/*.png` | 4 pairs (4+4) | 4 pairs | **MATCH** |
| CI shape | `gh run view --json jobs` | 11, all success | 11 jobs | **MATCH** |
| versions | source manifests | crate 0.5.0 / py 0.4.0 / pb ^0.9.2 | 0.5.0 / ^0.9.2 | **FLAG-2** (py 0.4.0) |

### Flags (listed, NOT reconciled — per the invariant clause)

- **FLAG-1 — e2e static `test(` = 83, census = 82.** File count 13 matches. The static grep
  now finds **83** plain `test(` invocations across the 13 spec files; the W14 census records
  **82**. The executed run-of-record (gate CI e2e job) is **82** — default `npx playwright test`
  77 + visual-golden config 4 + throttled-void config 1. The one-count gap between the static
  83 and the executed 82 is **not** a `test.skip` (none exist in the tree — verified): it is a
  Playwright default-config `testMatch`/`project` filter dropping exactly one case from the
  default set (static-in-default 78 vs executed-in-default 77). The census integer **82** tracks
  the *executed* total, not the static grep. Team-lead adjudication: re-stamp the census to
  **83 static / 82 executed** (both cited), or keep 82 as the executed figure and note the
  static grep drift. The mechanics are the invariant — the suite is green unedited; only the
  integer moved.

- **FLAG-2 — Python wheel/pyproject version 0.4.0 lags the crate 0.5.0.**
  `csp-solver/pyproject.toml:7` pins `[project] version = "0.4.0"`; the crate
  (`csp-solver/Cargo.toml`, `csp-solver/wasm/Cargo.toml`, `pkg/package.json`) is **0.5.0**. The
  maturin wheel therefore ships as `csp_solver-0.4.0-*` even though it compiles `csp-solver
  v0.5.0`. The brief's registry summary records the **npm wasm 0.2.0 vs source 0.5.0** split but
  **not** this pyproject lag. Not a test defect (27/0 green regardless; the wheel has no
  `__version__` attribute, so runtime is unaffected) — a **version-truth** stamp for the ledger.
  Team-lead adjudication: bump `pyproject.toml` to 0.5.0 (source parity) or record the wheel
  version as a deliberate registry-honest lag like the wasm split.

- **Drift note (not a census row) — full-module wasm comment stale.** The runner full build is
  **227,385 B**; the ci.yml band comment (`.github/workflows/ci.yml` ~L408-416) and the T2-era
  stamp read **222,436 B** (+4,949 B). Well inside the 240 KB fail / 230 KB warn bands — CI is
  green; only the quoted absolute no longer reproduces byte-exact. The **lean** figures
  (121,855 darwin / 124,091 runner) reproduce exactly. Headline census rows measure the lean
  artifact, so this touches no headline figure; flagged for the doc-truth ledger only.

All other headline figures reproduce byte-/count-exact against the W14 census.

## 11. Repro provenance

All commands run from committed paths at the gate SHA `d70073f3` (nothing checked out — the
working tree at HEAD). The Rust suite was captured untruncated for the aggregate; the wheel
build was a warm-workspace release compile (3.02 s); vitest ran under node 26 / vitest 4.1.10.
The e2e / py-runtime / twiggy **runs of record** are the gate CI run `29449438899` (master,
`success`), quoted from `gh run view … --log`; the local pytest reproduction (27/0) corroborates
the CI py-runtime 27/0. Byte sizes and pass/fail counts are host-deterministic; the lean-wasm
runner figure (124,091 B) is the gate band figure (the known runner-vs-darwin toolchain delta,
+2,236 B over darwin's 121,855 B).
