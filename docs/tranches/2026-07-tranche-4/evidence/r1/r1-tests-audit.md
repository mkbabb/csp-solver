# r1-tests-audit — the test estate, toward lean re-formulation

HEAD 65425697, master. All probes rerunnable from repo root unless noted.

## Census (verified, not trusted)

| Estate | Count | Probe | Verdict |
|---|---|---|---|
| Rust `cargo test --workspace` | **171 passed / 0 failed / 6 ignored**, 21 binaries | `cd csp-solver && cargo test --workspace 2>&1 \| grep -E "test result:"` then sum | matches `docs/benchmarks.md:43` — **TRUE** |
| Rust wasm_bindgen tests | 18 (dualization 7 + futoshiki_parity 11) run as **0** under `cargo test` | same run: both wasm harnesses print `0 passed` | wasm tests need `wasm-pack test --node` (ci.yml:284); the "171 across 21 harnesses" figure counts 2 harnesses that contribute 0 to the native run |
| tests-py | **27 collected** | `csp-solver/tests-py/.venv/bin/python -m pytest --collect-only -q` → `27 tests collected` | matches "27/0" — **TRUE** (16 `def test_`, parametrize expands to 27) |
| e2e | **44** across 8 spec files | `grep` per file, tests-in-describe counted, `test.use`/`test.describe`/inline `test.skip` excluded | matches "44 e2e" — **TRUE** |
| pencil-boil proofs | 5 (`proofs/*.proof.ts`, 701 LOC) | `cd ../../pencil-boil && wc -l proofs/*.proof.ts` | dependency-free Node assertion scripts, drive real composables — **sound**, light touch |

Rust harness map (integration, `csp-solver/tests/`): solver.rs (48, the monolith), lattice.rs (16, bbnf type-inference lattice — orthogonal subject), optimize.rs (13), gac_kernel_beats.rs (13), futoshiki.rs (11), implication.rs (10), assignment_builder.rs (8), sudoku_generate.rs (7/8), assignment_proptest.rs (7 + 1 proptest block, cases=256), cost_finite.rs (7), sudoku.rs (7), all_different_except.rs (6), error.rs (5), solution_set_invariance.rs (4), difficulty_parity.rs (2), futoshiki_engine_probe.rs (2), gac_alldiff_oracle.rs (2). Benches-as-tests (CI `-- --test`): queens.rs, gac_ab.rs, iai_queens.rs + example gac_ab_corpus.

---

## Findings

### F1 — [P1] iai lane is a determinism tautology, not a perf-regression gate (gate-cannot-fail)
`.github/workflows/ci.yml:494-591`. The "iai — deterministic instruction-count baseline" lane runs the **same binary twice** (`Run 1 — establish baseline` / `Run 2 — re-measure the identical binary`) and the GATE step asserts `|I1−I2| < 1%`. Callgrind instruction counts are a pure function of the compiled binary, so I1≡I2 **by construction** — the gate's own comment says so (`ci.yml:501`, "run-to-run delta is exactly 0 on an unchanged binary"). There is **no committed baseline** to compare against:
- Probe: `git ls-files | grep -iE "iai|baseline|callgrind"` → only `benches/iai_queens.rs` + prose docs; no `*.json` baseline in git.
- The GATE (`ci.yml:552-591`) parses `Instructions:` from both logs and compares them to **each other**, never to a stored figure. Run 1 overwrites `target/iai` before Run 2, so iai-callgrind's own cross-commit regression output is discarded.
Consequence: a code change that **doubles** the hot-path instruction count ships green — both runs agree with each other. The record sells this lane as the perf-regression oracle (P6 "1,585,722 instructions" narrative); it guards determinism only. Fix: commit a baseline and fail on delta-vs-baseline, or demote the lane's stated purpose to "callgrind determinism smoke."
family_hint: `gate-cannot-fail`

### F2 — [P1] visual-regression.spec.ts performs zero visual assertion (vacuous-visual)
`web/frontend/e2e/visual-regression.spec.ts`. Named "Visual-regression register"; three tests carry "visual snapshot" in their titles (`:102`, `:195`, `:344`). Probe: `grep -rn "toMatchSnapshot\|toHaveScreenshot" e2e/` → **NONE**. Every `page.screenshot()` (`:190`, `:214`, `:343`) writes a PNG that is **never compared** — write-only artifacts into `e2e/screenshots/`. The image half of every "visual snapshot" test **cannot fail**. What the suite actually asserts is DOM/computed-style contracts (filter ids present, class toggles, geometry) — real but mis-titled. The record's "visual-regression" claim is a lie: a rendering regression (color shift, filter blowout, layout break that keeps the DOM shape) ships green. Fix: adopt Playwright `toHaveScreenshot()` with committed baselines, or rename the suite `dom-contract` and strip the "visual snapshot" language.
family_hint: `vacuous-visual-assert`

### F3 — [P1] throttled-void is flaky under load with retries:0 (test-overfit-timing)
`web/frontend/e2e/throttled-void.spec.ts:25` (`VOID_RECOVERY_BUDGET_MS = 25000`) + `playwright.config.ts:8` (`retries: 0`). The single test throttles CDP to 30 KB/s + 500 ms latency then waits ≤25 s for the lazy Futoshiki chunk to mount over an **unbundled dev-server ESM graph** (per-module 500 ms tax). The harness's own comment (`:21`) records recovery at **12.87–13.22 s** — already >50% of budget on a quiet host. On a loaded/parallel CI runner the per-module latency compounds across the chunk's import fan-out; a single slow run blows the budget and, with `retries: 0`, reds the entire e2e lane. This is the named flaky case. Fix: bundle the futoshiki chunk for the throttle probe (or serve a preview build), assert on a fast pre-chunk loader (the F6 beat-2 item the OR already admits) instead of full-scene mount, and/or grant this one spec `retries`.
family_hint: `test-overfit-timing`

### F4 — [P2] affordances stale-note test silently self-skips on deal luck (deal-luck-skip)
`web/frontend/e2e/affordances.spec.ts:126` — `test.skip(b2 === -1, 'no two blank cells share the first blank row on this deal')`. The "stale-note" test needs two blank cells in the first blank row to force a row conflict; when the random deal doesn't provide them, the test **skips at runtime and asserts nothing** — a green that proves nothing. The whole teacher-red + gold-star lifecycle (the test's payload) can silently evaporate. Auto-deal is random per run, so this is nondeterministic vacuity. Fix: construct a deterministic conflicting board (permalink `?board=` or a fixed given set) instead of depending on the deal.
family_hint: `deal-luck-skip`

### F5 — [P2] six hard-sudoku Rust tests are ignored, pin the wrong config, and duplicate tests-py (superfluity + masked gap)
`csp-solver/tests/solver.rs:1402,1417,1432,1447,1462,1480` — the 6 `#[ignore]`'d tests (the "6 ignored" in 171/0/6). Each pins `Pruning::ForwardChecking` (binary FC) with reason "requires GAC alldiff — too slow with binary FC" (`:1402`). So they:
1. Never run (ignored in CI).
2. Test a **non-production config** — production is GAC-default-ON (MEMORY; ci.yml:132 gac_ab_corpus runs Ac3+Mrv).
3. Are fully **redundant** with tests-py: the identical five boards (Al Escargot, Platinum Blonde, Golden Nugget, Inkala 2010, 17-clue minimal) run through the wheel under the default path — probe: `csp-solver/tests-py/.venv/bin/python -m pytest --collect-only -q` shows `test_hard_9x9[Al Escargot-…]` etc.
Net: Rust has **no active** hard-sudoku coverage — only dead tests for the wrong solver mode. Fix: delete them (covered in py) OR rewrite to the default GAC config and un-ignore (the gac_ab_corpus gate proves hard boards solve fast under GAC, so the "too slow" reason no longer applies).
family_hint: `stale-ignore-wrong-config`

### F6 — [P2] frontend has zero unit tests; codecs/undo/composables are e2e-only (coverage-gap-no-unit)
`web/frontend/package.json` — scripts are `test:e2e`, `test:e2e:ui`, `test:pwa` only; no `vitest`, no `jsdom`/`@vue/test-utils` dep (probe: `grep -n "vitest\|jsdom\|@vue/test-utils" package.json` → empty). Probe: `find src -name "*.test.ts" -o -name "*.spec.ts"` → none. The url-state codec (`?board=`/`?size=` encode/decode + fall-closed logic), the undo/redo history stack, and the solver worker protocol/composable are exercised **only** through Playwright — slow, flaky, and unable to hit edge cases (malformed params, history bounds, protocol error frames) at unit granularity. permalink.spec.ts/affordances.spec.ts drive the codec end-to-end but can't enumerate its branches. This is the biggest structural gap in the estate. Fix: add a vitest+jsdom layer; move codec/undo/protocol invariants down to unit; keep e2e for true integration.
family_hint: `coverage-gap-no-unit`

### F7 — [P2] visual-regression encodes implementation geometry, not intent (test-overfit-geometry)
`web/frontend/e2e/visual-regression.spec.ts`. Constants that pin the current render math, not user-visible behavior:
- Test 8 rest-pose (`:365-370`): `scale ∈ (0.05,0.07)`, `rotateDeg ∈ (8,16)`, `|slide| < 2px` — hard-codes the CSS transform (0.06 / +12°). A design retune to scale 0.08 reds a green feature.
- Sun rays (`:181`): `pairs.length === 20` (exact 10-ray polygon).
- Logo pose stack (`:166`): `logoText toHaveCount(4)` — asserts the 4-pose implementation, not "the wordmark reads 'sudoku'."
- Grid cell-lines (`:338` `=== 12`, `:322` `>= 2`, `:339` frame `=== 1`) — exact per-variant path counts.
These break on legitimate rendering refactors that preserve intent. Fix: assert ranges/intent (wordmark text, "exactly one pose visible," "grid drawn") and push exact geometry to a real screenshot baseline (see F2).
family_hint: `test-overfit-geometry`

### F8 — [P2] gac_kernel_beats freezes exact node/backtrack counts (test-overfit-frozen-counts)
`csp-solver/tests/gac_kernel_beats.rs:318-333` — `p5_bnb_node_counts_frozen` asserts `nodes_explored == 506`, `backtracks == 515` (n=10), `4016`/`4043` (n=15), `1_000_000`/`1_000_019` (n=20). Intended as a tripwire ("ANY delta means a beat moved propagation strength", `:315`), but it also reds on any **legitimate** search-order improvement that preserves correctness — the test cannot distinguish a soundness regression from a speedup. The soundness half is already guarded independently (solution-set invariance F-refs, the corpus node-spine `ci.yml:121-132`). Keep one frozen-count tripwire as an explicit "search-trajectory lock" with a loud comment that improvements must re-baseline it deliberately; don't scatter the pattern.
family_hint: `test-overfit-frozen-counts`

### F9 — [P3] queens8=92 re-litigated ~6× across the estate (superfluity)
The same OEIS ground truth is enumerated and asserted in: `solver.rs:398` (test_8_queens), `solver.rs:966` (test_cross_config_8queens), `solution_set_invariance.rs:129`, `gac_alldiff_oracle.rs:172-187`, `gac_kernel_beats.rs:378`, `benches/queens.rs:87` **and** `:143`, plus the CI queens smoke. Full 8-queens enumeration ×7 is redundant compute; one canonical enumerate + set-equality suffices, with the others asserting only their unique delta (config-invariance, GAC on/off node monotonicity).
family_hint: `superfluity-duplicate-assert`

### F10 — [P3] futoshiki config-invariance asserted in two harnesses (superfluity)
`csp-solver/tests/futoshiki_engine_probe.rs:127` (`solution_set_is_config_invariant`, 2 configs) is a strict subset of `solution_set_invariance.rs:139,146` (futoshiki over 4 prunings × 3 orderings = 12 configs). The genuinely unique asset in futoshiki_engine_probe is the **independent brute-force oracle** (`:112`); its config-invariance test is dead weight. Fold the oracle into the invariance harness; drop the duplicate config check.
family_hint: `superfluity-duplicate-assert`

### F11 — [P3] 28 hard-sleep `waitForTimeout` calls across e2e (timing-debt)
Probe: `grep -rn "waitForTimeout" e2e/*.spec.ts | wc -l` → 28 (sudoku-interaction 12, visual-regression 8, affordances 3, digit-pad 3, drawer 1, permalink 1). Fixed sleeps (`waitForTimeout(2000)` etc.) are slower than necessary on fast hosts and race-prone on slow ones; several gate real assertions (`visual-regression.spec.ts:223` "wait ~2000ms then assert draw-in complete"). Replace with `waitForSelector`/`expect.poll` on the actual settle condition (the suite already uses `.is-active` handoff in `steadyGridCounts` — generalize it).
family_hint: `test-overfit-timing`

### F12 — [P3] tests-py performance-threshold tests flake under load (timing-debt)
`csp-solver/tests-py/test_bench_compare.py:31` (`test_solve_under_50ms`, parametrized over HARD_PUZZLES) and `test_rust_backend.py:143` (`test_performance_sanity`). Wall-clock thresholds (<50 ms) are load-sensitive; ci.yml:41-46 already documents the release-profile requirement to keep them from being vacuous, but a contended runner can still breach 50 ms on the Golden Nugget. Node-count/instruction assertions (already present elsewhere) are load-invariant and the honest regression oracle; the wall-clock ones belong in a non-gating perf report, not the pass/fail gate.
family_hint: `test-overfit-timing`

### F13 — [P3] difficulty_parity substring checks pass on incidental matches (weak-assertion)
`csp-solver/tests/difficulty_parity.rs:203` — `text.contains(&expected)` for `"EASY"/"MEDIUM"/"HARD"`. A sibling file passes as long as the string appears **anywhere** — including a comment or unrelated identifier — not in an actual variant declaration. The companion `no_unscanned_difficulty_definitions_exist` (`:307`) guards the file set but not the semantic content. Low blast radius (drift-detection is the real intent), noted for completeness.
family_hint: `weak-assertion`

---

## Re-formulated estate — the lean pyramid

**Rust — collapse 3 harnesses into 1, un-rot the ignores.**
- *Keep as unique unit-grade:* `all_different_except`, `implication`, `cost_finite`, `assignment_builder`, `error`, `sudoku_generate`, the bitset/finite-domain algebra currently buried in `solver.rs:477-620,1239-1577` (hoist to a `domain.rs` harness).
- *Merge* `gac_alldiff_oracle` + `futoshiki_engine_probe` (oracle halves) + `solution_set_invariance` → one **`oracle_and_invariance.rs`**: independent brute-force oracles (small alldiff, futoshiki 4×4) + one solution-set-invariance sweep per problem. Drop the duplicate config checks (F10) and the redundant queens8 enumerations (F9) down to one canonical.
- *Keep* `gac_kernel_beats` warm/cold + scratch-reset + generic-monomorphize proofs (P1–P4, P6) — genuinely unique kernel invariants; retain ONE frozen-count tripwire (P5) with an explicit re-baseline note (F8).
- *Hard sudoku:* delete the 6 ignored FC tests (F5) or rewrite to default GAC and un-ignore; the corpus + tests-py already own the production path.
- *proptest:* keep `assignment_proptest`; widen n and pin a seed for CI reproducibility.
- *benches-as-tests + corpus + iai:* these ARE the load-invariant regression oracles — keep the queens/gac_ab `-- --test` asserts and the corpus node-spine; **fix iai** to compare against a committed baseline (F1).

**Python — keep thin, drop the overlap.**
- Keep the binding contracts: typed exceptions, heartbeat/GIL, cancel-token, wheel/stub. These are unique to the FFI boundary.
- Either drop `test_hard_9x9` (once Rust owns hard sudoku again) or bless it as the SOLE hard-sudoku active guard. Move the <50 ms wall-clock asserts (F12) to a non-gating perf report.

**Frontend — build the missing base (the biggest win).**
- ADD a **vitest + jsdom** unit layer (F6): url-state codec encode/decode/fall-closed, undo/redo history bounds, solver worker protocol framing + error paths. These are e2e-only today.
- MOVE DOM-contract assertions (filter registry, class toggles, crayon vars, font family) out of `visual-regression.spec.ts` into jsdom units; rename the residue.
- CONVERT the "visual snapshot" tests to real `toHaveScreenshot()` baselines (F2) or drop the visual pretense; replace exact geometry with intent + a screenshot baseline (F7).
- KEEP e2e for true integration: composed-keyboard, drawer, permalink round-trip, futoshiki twin. Fix throttled-void's flake (F3) and the deal-luck skip (F4); replace hard sleeps with settle-condition waits (F11).

Named suites OUT: `visual-regression.spec.ts` (as a visual suite — vacuous), 6 ignored hard-sudoku Rust tests, `futoshiki_engine_probe::solution_set_is_config_invariant`, duplicate queens8 enumerations. Named suites IN (new): `web/frontend` vitest units (codec/undo/protocol), a real `toHaveScreenshot` visual baseline, merged `oracle_and_invariance.rs`.
