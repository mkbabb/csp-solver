# r1-gate-soundness — can each gate actually fail?

Lens: gate soundness across the T3 wave gate tables (`docs/tranches/2026-07-tranche-3/waves/*.md`), the 9-job CI matrix (`.github/workflows/ci.yml`), and the Playwright e2e suite (`web/frontend/e2e/*.spec.ts`) used as a gate. Hunting vacuous greens — gates whose probe cannot distinguish pass from fail.

Repo HEAD 65425697 (master). All probes banked beside this file, rerunnable.

---

## P0 — the iai lane cannot detect a perf regression (family: baseline-not-asserted)

**`.github/workflows/ci.yml:494-591` (Lane 10, `iai`).** The lane's header sells it as "deterministic instruction-count baseline for the solver hot path" (`:495`) and cites "1,585,722 instructions" (`:501`) as the guarded figure. The GATE step (`:552-591`) does **not** assert that figure or any absolute count. It runs the SAME bench binary twice (`:544-551`, run1/run2 of the identical commit), extracts each log's `Instructions:` count, and asserts only `DELTA_PCT = |I2−I1|/I1 < 1%` (`:574,586`).

Instruction count is a pure function of the compiled binary (the lane's own comment says so, `:500`), so run1 == run2 for any unchanged commit and the delta is identically 0. The only absolute baseline (1,585,722) is never stored across commits and never compared. The lane's one real failure mode is a log that produces no parseable `Instructions:` line (`:568-573`) — i.e. the bench didn't run at all. A commit that doubles, triples, or halves the hot-path instruction count sails through green.

**Demonstrated** (`probe-iai-vacuous.sh`, replays the gate's exact `extract`/awk logic):
```
abs-instrs=1585722  delta=0.000000%  gate=PASS   # baseline
abs-instrs=3171444  delta=0.000000%  gate=PASS   # 2x regression — same verdict
```
A 2× instruction-count regression is indistinguishable from the baseline. No committed baseline exists (`git ls-files | grep iai` → only `csp-solver/benches/iai_queens.rs`; nothing in `target/iai`). The lane is a determinism tautology dressed as a perf gate; its record ("guards the solver hot path") is a lie against tree truth.

Fix class: assert `I1` against a committed golden count with a tolerance band (iai-callgrind's native baseline-diff, or a checked-in `iai_queens.baseline`), not run1-vs-run2 self-agreement.

---

## P1 — the "visual-regression" suite performs no visual comparison (family: capture-not-compared)

**`web/frontend/e2e/visual-regression.spec.ts`.** File header calls itself the "Visual-regression register" (`:3`); tests are named "light mode: … visual snapshot" (`:102`), "dark mode: … visual snapshot" (`:195`). Each "snapshot" is a bare `page.screenshot({ path: 'e2e/screenshots/{light,dark,9x9}.png' })` (`:190,214,343`) — a **write to disk with no assertion on the pixels**. There is no `toHaveScreenshot`/`toMatchSnapshot` call anywhere in `e2e/`, and no reference PNG is committed (`e2e/screenshots/*` is gitignored — `git check-ignore` confirms).

So the suite cannot catch any *visual* regression: the grain-static filter rendering the board solid black, a theme-color inversion, a filter that fails to paint, a broken boil layer — all pass green as long as the file's DOM assertions (filter-element counts `:85-97`, class checks `:116-120`, computed-style probes) still hold. The DOM assertions are real gates; the "visual snapshot" claim is not one. Every screenshot the suite writes is orphaned — captured, never compared — which is precisely the "declared captures / vacuous visual gate" close-class lie.

**Demonstrated** (`probe-no-visual-compare.sh`): zero `toHaveScreenshot|toMatchSnapshot` hits; three capture-only `page.screenshot` writes; no committed reference; path gitignored.

Fix class: convert the three writes to `expect(page).toHaveScreenshot()` with committed references, or drop the "visual-regression"/"visual snapshot" framing from the record.

---

## P1 — the T3 SSIM "soul gates" are recorded as standing but exist nowhere executable (family: gate-not-wired)

**`docs/tranches/2026-07-tranche-3/waves/T3-W13-motion-perf-recut.md:38,125,131`** anchors P2/P3 on a per-surface "SSIM ≥ 0.983 vs its live-filter reference @DPR2" gate — "each behind the grid's own SSIM soul gate (0.983–0.985)" (`:38`), and the idle-perf gate row requires "SSIM ≥ 0.983 per P2/P3-baked surface" (`:131`). The wave frames these as "measurable, all rerunnable" in-wave gates (`:121`).

There is no SSIM computation anywhere the CI or e2e suite can run it: `grep -rin ssim` over `web/frontend/e2e`, `web/frontend/scripts`, `.github/`, `csp-solver/examples` returns nothing. The soul gate was a one-shot manual measurement at wave-execution time, not a standing gate — so a future change that regresses a baked pose stack below 0.983 (the exact regression the "soul discipline" claims to guard) trips nothing. The record's "all rerunnable from the banked probe recipes" (`:121`) is true only in the sense that a human could re-run a probe by hand; nothing in the merge gate enforces it. Additionally the reference is the *live-filter* rendering and the *baked* surface is compared to it — a reference captured from the pre-bake mechanism, but since the gate never re-runs, drift is invisible either way.

Fix class: wire an SSIM assertion into the e2e suite against committed references, or stop recording it as a gate.

---

## P2 — throttled-void budget sits at ~2× the observed bound, and its OR-clause only ever tests one branch (family: threshold-slack)

**`web/frontend/e2e/throttled-void.spec.ts:25,63`.** `VOID_RECOVERY_BUDGET_MS = 25000` against a measured recovery of ~13.0 s (`:21-24`) — "~90% margin." A regression that nearly doubles first-select latency (to ~24 s under the same throttle) still passes; the gate only catches a *permanent* void, not a degraded one, which is what the comment claims ("bounded, not permanent") but undersells relative to the 13 s the record treats as normal. Separately, the wait target `.scribble-loader, .board-shell` (`:63`) is an OR where `.scribble-loader` provably does not exist today (the file says so at `:16,62` — "no fast pre-chunk loader exists today"), so the OR degenerates to a `.board-shell` mount check. Harmless today, but the OR masks the absence of the loader it names: if `.board-shell` ever mounts before the (future) loader, the loader's absence never fails here. Behavior asserted (scene recovers) is real; the threshold and the phantom OR-branch are the soft spots.

---

## Gates that DO bite (verified sound — no defect)

Banked so the census isn't just the failures:

- **`ci.yml:107-114` queens-bench smoke** — criterion `--test` fires the embedded `assert_eq!(solutions.len(), 92/14200)`; a broken enumerate-continuation fails non-zero. Real.
- **`ci.yml:121-132` + `csp-solver/examples/gac_ab_corpus.rs:288-299`** — `std::process::exit(1)` on any false-UNSAT or on the node-count spine moving off `40,513→4,678`. Absolute invariant asserted, exits non-zero. Real.
- **`ci.yml:335-363` twiggy budgets** — `wc -c` on the built `.wasm` vs hard `>240000`/`>93000` bytes with `exit 1`; measured 222,436 / 90,602 leave 7.8% / 2.6% headroom. A real byte-growth trips it. Real.
- **`ci.yml:206-217` stub-stem tripwire** and **`:246-253` flag-free stubtest** — assert a file exists and that surface growth has no missing stub; both `exit 1` on violation. Real.
- **`web/frontend/e2e/drawer.spec.ts:130-136`** — monotone `railL` within 0.5px, zero-overshoot, rail-never-above-sheet, settle-drift ≤6px: a real mid-glide teleport (the ~249px F1 bug the wave targets) trips these. Real behavioral assertions, not existence-only.

---

## Probes banked (rerunnable)
- `probe-iai-vacuous.sh` — replays the iai GATE math; shows a 2× regression = PASS.
- `probe-no-visual-compare.sh` — shows zero screenshot-comparison APIs; capture-only writes; no committed reference.
- SSIM absence: `grep -rin ssim web/frontend/e2e web/frontend/scripts .github csp-solver/examples` → empty.
