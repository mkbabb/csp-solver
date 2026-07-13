# T4-W2 — Tests + gates re-founded

**The gate foundation: make every gate able to fail, mint the visual-golden machinery every later wave's π cites, and prune the overfit the owner mandated out.** Owner edict (M7) — total re-formulation of tests (rust, js, e2e) with grand superfluity + overfit pruning. This wave runs EARLY because it builds the π/DELTA machinery — a real capture-compare-review golden system replacing write-only screenshots — that W1's identity gate, W9's border, W11's shells, W12's carousel, and W13's new games all consume. It also converts the two vacuous greens the audit proved (the iai tautology, the visual suite that compares nothing) into gates that bite, adds the missing FE unit base, and re-cuts the CI into a compute-cost DAG.

**Dependencies**: ← W0 (base SHA). Co-develops with W1 (W1's browser-harness identity gate rides this wave's runner conventions; the golden-crop convention W1 defines generalizes here). **Effort**: L, EARLY.

---

## Scope

### iai lane → real baseline comparison — born RED against a deliberate regression (FAM-1 / P0)

`.github/workflows/ci.yml:494-591` (Lane 10, `iai`) sells itself as "deterministic instruction-count baseline for the solver hot path" citing 1,585,722 instructions (`:501`), but the GATE (`:552-591`) runs the **same bench binary twice** (`:544-551`) and asserts only `|I2−I1|/I1 < 1%` (`:574,586`). Instruction count is a pure function of the compiled binary, so run1 ≡ run2 for any commit — the delta is identically 0. The only absolute baseline is never stored across commits, never compared. A 2× regression sails green (`probe-iai-vacuous.sh`: `abs-instrs=3171444 delta=0.000000% gate=PASS`). It is a determinism tautology dressed as a perf gate.

- **Fix**: commit a golden baseline (`csp-solver/benches/iai_queens.baseline` or iai-callgrind's native baseline-diff) and fail on delta-vs-baseline with a tolerance band. Demote the lane's stated purpose honestly if it stays determinism-only.
- **Born RED**: inject a deliberate hot-path regression (double an inner loop) → the lane must go **red** (today: PASS, indistinguishable from baseline).

### The visual golden system — the π/DELTA MINT (FAM-1 / P1)

`web/frontend/e2e/visual-regression.spec.ts` calls itself the "Visual-regression register" with tests titled "…visual snapshot" (`:102,195,344`), but every `page.screenshot()` (`:190,214,343`) writes a PNG **never compared** — no `toHaveScreenshot`/`toMatchSnapshot` anywhere in `e2e/` (`probe-no-visual-compare.sh`: zero hits), no committed reference (`e2e/screenshots/*` gitignored). A board rendered solid black, a theme inversion, a filter that fails to paint — all pass green. This wave **replaces** it with a real golden system, specced concretely:

- **Capture recipe**: Playwright `toHaveScreenshot()` (or an SSIM-compare step) at **DPR2, settled** (the `.is-active` handoff / `expect.poll` settle condition, never a fixed sleep), against **committed reference crops**. Each golden is a **small crop of the asserted surface** — the grid, a cell, the logo, the toggle crest, the progress border segment — **NOT a full-viewport PNG** (FAM-15/B1 discipline: the estate is already 70 MB of PNGs; goldens must not repeat it). Crop bounds are named per golden.
- **Comparison tool**: SSIM (or Playwright's `maxDiffPixelRatio`) with an explicit **tolerance floor ≥ 0.98** per golden (the W1 identity floor, generalized — a bitmap capture vs live render legitimately diverges ~2% at edges in WebKit; equality would false-red). Per-engine where the surface is engine-sensitive.
- **Review flow**: a baseline is created/updated only by a deliberate `--update-snapshots` run reviewed against the DELTA pair; the diff artifact uploads on failure (Playwright's `test-results/`) for inspection. No silent baseline drift — an updated golden is a reviewed commit.
- **Storage discipline**: goldens live under `web/frontend/e2e/goldens/` (committed, small crops); the count and byte-budget are policed by a lane that fails if a golden exceeds a per-image ceiling (small-crop enforcement) — the FAM-15 bloat guard applied to the very artifacts a golden system tends to grow.
- **This machinery is the deliverable W1/W9/W11/W12/W13 cite** — their π obligations resolve to "a golden crop + the ≥0.98 SSIM compare in this system."

### W13 SSIM soul gates wired executable (FAM-1 / P1)

`T3-W13:38,125,131` anchors per-surface "SSIM ≥ 0.983 vs live-filter reference @DPR2" gates recorded as standing/rerunnable, but `grep -rin ssim web/frontend/e2e web/frontend/scripts .github csp-solver/examples` → **empty** — the soul gate was a one-shot manual measurement, wired nowhere. A change regressing a baked pose below the floor trips nothing. Wire the W13 baked-surface SSIM asserts into the golden system above (they become goldens like any other), so the "soul discipline" is a standing gate, not a claim.

### eslint boundary rig into CI (FAM-1 / P2)

`web/frontend/eslint.config.js` is 194 lines of colocation-edict boundary rules (pencil↮games, sudoku↮futoshiki, 3-level depth) wired to `lint:eslint` — it loads and runs clean but **CI never invokes it** (the frontend lane runs `vue-tsc --noEmit` + `knip` only; the job named `lint:` is Rust fmt+clippy). A PR reaching from `src/pencil/**` into `@games/**` passes all 9 lanes. Add `npm run lint:eslint` to the frontend CI lane. **Born RED**: a deliberate cross-boundary import must red the lane (today: green).

### FE unit layer — vitest + jsdom (FAM-2 / F6)

The frontend has **zero unit tests** (`package.json` scripts = `test:e2e`/`test:e2e:ui`/`test:pwa` only; no vitest/jsdom/@vue/test-utils dep; `find src -name '*.test.ts'` → none). The url-state codec (encode/decode/fail-closed + the W3 version byte), the undo/redo history stack (`UNDO_CAP=128`, overflow shift, redo-tail splice), and the solver worker protocol/error frames are exercised **only** through Playwright — slow, flaky, unable to enumerate branches (malformed params, history bounds, protocol error frames). Add a vitest + jsdom layer:

- **codec**: encode/decode round-trip, every fail-closed branch (oversize, non-canonical size, out-of-range cell, short count, bad base64, the futoshiki ineq guards), the W3 version-byte accept/reject.
- **undo/redo**: cap overflow, fresh-fork redo-tail drop, pointer bounds, given-cell immunity.
- **worker protocol**: request/response framing, `describeError` → `WORKER_FAILURE` mapping, the error-path frames.
- Move DOM-contract asserts (filter registry, class toggles, crayon vars, font family) out of `visual-regression.spec.ts` into jsdom units; keep e2e for true integration.

### Overfit + superfluity pruning (FAM-2, owner-mandated)

- **28 hard sleeps** (`grep -rn waitForTimeout e2e/*.spec.ts | wc -l` → 28) → `waitForSelector`/`expect.poll` on the actual settle condition (generalize the existing `.is-active` handoff). Several gate real asserts (`visual-regression.spec.ts:223`).
- **Frozen node-counts → bands** (F8): `gac_kernel_beats.rs:318-333` `p5_bnb_node_counts_frozen` asserts exact `nodes_explored == 506` etc. — reds on any legitimate search-order improvement. Keep **ONE** frozen-count tripwire with a loud "search-trajectory lock — improvements must re-baseline deliberately" comment; the soundness half is already guarded (solution-set invariance + the corpus node-spine `ci.yml:121-132`).
- **Wrong-config ignored tests fixed-or-deleted** (F5): the 6 `#[ignore]`'d hard-sudoku tests (`solver.rs:1402,1417,1432,1447,1462,1480`) pin `Pruning::ForwardChecking` (non-production — prod is GAC-default-ON) and duplicate tests-py's five boards. Delete them (covered in py) OR rewrite to the default GAC config and un-ignore (the gac_ab_corpus gate proves hard boards solve fast under GAC, so the "too slow with binary FC" reason no longer applies).
- **queens8 ×7 collapsed** (F9): the same OEIS ground truth enumerated in `solver.rs:398,966`, `solution_set_invariance.rs:129`, `gac_alldiff_oracle.rs:172`, `gac_kernel_beats.rs:378`, `queens.rs:87,143` + the CI smoke → one canonical enumerate + set-equality; the others assert only their unique delta (config-invariance, GAC on/off node monotonicity).
- **futoshiki invariance ×2** (F10): `futoshiki_engine_probe::solution_set_is_config_invariant` is a strict subset of `solution_set_invariance.rs:139,146` — fold the independent brute-force oracle into the invariance harness, drop the duplicate config check. Merge `gac_alldiff_oracle` + the oracle halves + `solution_set_invariance` → one `oracle_and_invariance.rs`.
- **knip promoted** (dead-code P2): `knip.json:24-27` reports `exports`/`types` at `warn` → CI runs bare `npx knip` exit 0 despite 9 dead items; the two pencil barrels are `entry` points (`knip.json:3`) so barrel re-exports are marked used. Promote `exports`/`types` to `error` and drop the barrels from `entry` (the barrels themselves die in W4). Then W4's dead-surface retirements are gated.

### Flaky pair fixed (FAM-2 / F3, F4)

- **throttled-void** (`throttled-void.spec.ts:25` `VOID_RECOVERY_BUDGET_MS=25000`, `retries:0`): recovery measured 12.87–13.22 s (>50% of budget on a quiet host); on a loaded runner the per-module ESM latency compounds and reds the whole e2e lane. Bundle the futoshiki chunk for the throttle probe (or serve a preview build), assert on a fast pre-chunk loader instead of full-scene mount, and/or grant this one spec `retries`. Also close the phantom OR (`.scribble-loader, .board-shell` where `.scribble-loader` provably doesn't exist, `:16,62`).
- **deal-luck skip** (`affordances.spec.ts:126` `test.skip(b2 === -1, …)`): the stale-note test needs two blank cells in the first blank row; a random deal that doesn't provide them skips at runtime and asserts nothing. Construct a deterministic conflicting board (permalink `?board=` or a fixed given set).

### Live-gen uniqueness gate (FAM-9)

Live-gen uniqueness has **zero test coverage** — the bank gate is an example CI never runs. The generator can already deal real unique puzzles; add a standing gate that asserts a live-generated puzzle is unique (single solution) across the served sizes. (Pairs with W6's generation-truth work; the gate lives here in the test estate.)

### CI compute-cost DAG (FAM-15 / r4-corrected)

`ci.yml` = **9 jobs, ZERO `needs:` edges** — fully flat fan-out. The **lean wasm artifact is rebuilt 3× independently** (twiggy `:353`, frontend `:393`, e2e `:454`) + 1 full build + 1 wasm-test compile; the Rust toolchain installs in ~9 jobs; `download-artifact` count = 0 (the two `upload-artifact` calls are diagnostic-only). **Framing (r4, binding)**: a DAG saves **compute cost (redundant CI minutes), NOT wall-time** — inserting a `needs:` predecessor *serializes* the build onto each dependent's critical path and can *increase* latency. Re-cut for compute-cost:

- A single `build-lean-wasm` predecessor job uploads `csp-solver/wasm/pkg` once; `frontend`, `e2e`, and `twiggy`(lean half) `needs:` it + `download-artifact`. Kills 2 redundant lean builds + ~8 redundant toolchain installs.
- Add a sensible gating order (lint before build) only where it doesn't lengthen the critical path.
- The `proof:browser` (W1) and `cargo-audit` (W5) lanes slot into this shape as cheap independent jobs.

## Gates

| Gate | Value |
|---|---|
| Headline | every named vacuous green now bites — a deliberate hot-path regression reds `iai`, a deliberate theme inversion reds a visual golden, a deliberate cross-boundary import reds eslint; the golden system captures-compares-reviews small crops at ≥0.98; the FE unit layer covers codec/undo/protocol; the overfit set is pruned; the CI is a compute-cost DAG (lean wasm built once) |

Component checks (born RED at HEAD unless marked; every RED cites today's failing value):

| Gate | Value (current failing probe → target) |
|---|---|
| iai-baseline | inject a 2× hot-path regression → **today `gate=PASS`** (`probe-iai-vacuous.sh`: `abs-instrs=3171444 delta=0.000000% PASS`) → gate reds vs the committed baseline |
| visual-golden | a deliberate grain-static→solid-black (or theme inversion) → **today green** (zero `toHaveScreenshot\|toMatchSnapshot` in `e2e/`, no committed reference) → reds the golden compare at the ≥0.98 floor; goldens are small committed crops (per-image byte-ceiling enforced) |
| w13-soul | `grep -rin ssim web/frontend/e2e .github` = **empty today** → the W13 baked-surface SSIM asserts run as goldens; a sub-0.983 pose reds |
| eslint-ci | a `src/pencil/** → @games/**` import **today passes all 9 lanes** (eslint never in CI) → reds the frontend lane |
| fe-unit | `find web/frontend/src -name '*.test.ts'` = **none today**; no vitest dep → vitest+jsdom layer covers codec (incl. W3 version byte), undo/redo bounds, worker protocol error frames |
| overfit | `grep -rn waitForTimeout e2e/*.spec.ts \| wc -l` = **28 today** → settle-condition waits; `gac_kernel_beats` frozen counts → ONE re-baseline-noted tripwire (today 4 exact `nodes_explored ==`); queens8 enumerations **7 today** → 1 canonical; the 6 `#[ignore]` FC tests deleted-or-un-ignored (today ignored, wrong config) |
| knip | `npx knip; echo $?` = **exit 0 with 9 dead items printed today** (`exports`/`types` at warn; barrels are `entry`) → `exports`/`types` at `error`, barrels off `entry`, exit non-zero on dead surface |
| flaky | `throttled-void` no longer reds under a loaded runner (today ~13 s vs 25 s budget, `retries:0`); `affordances.spec.ts:126` asserts on a deterministic conflicting board (today `test.skip` on deal luck — asserts nothing when unlucky) |
| live-gen-unique | a live-generated puzzle asserted single-solution across served sizes (today: zero coverage; the bank gate is an example CI never runs) |
| ci-dag | `download-artifact` count = **0 today**; lean wasm rebuilt **3× today** (twiggy/frontend/e2e) → a `build-lean-wasm` predecessor uploads once, 3 lanes `needs:` + download; compute cost drops (NOT wall-time — a `needs:` must not lengthen the critical path) |

## π / DELTA

This wave *is* the π/DELTA machinery — it does not consume it. Its own gates are test-infrastructure, not rendered surfaces, so:

- **The golden system is validated by a self-DELTA**: capture a baseline crop, apply a deliberate visual regression (theme inversion, grain→black), confirm the compare reds; revert, confirm green. This before/after IS the proof the machinery bites, banked in evidence — the machinery's own acceptance test.
- No product-pixel change from W2 (parity: full existing e2e green after the prune, the *coverage* changes, not the app). The one visible-surface obligation W2 owns is that the goldens it commits are **small crops** — the FAM-15 guard is a gate (per-image byte ceiling), not just a convention.

## Seeds

- `r1-gate-soundness.md` §P0/§P1 — the iai tautology (with the 2× regression probe), the visual-regression no-compare, the W13 SSIM wired-nowhere; the gates that DO bite (banked so the prune doesn't cut real coverage).
- `r1-tests-audit.md` F1–F13 — the full estate census (171/0/6 rust, 27 py, 44 e2e), the overfit set (28 sleeps, frozen counts, ignored FC tests, queens8 ×7, futoshiki ×2), the FE-unit gap, the lean-pyramid re-formulation.
- `r1-dead-code.md` §P2 — knip warn-level + barrel-blind (the gate promotion this wave lands so W4's retirements are enforced).
- `r1-config-census.md` §P2 — the eslint boundary rig never gated by CI.
- `r4-verify-r3new.md` Row 4 — the CI-no-DAG compute-cost correction (a DAG saves compute, not wall-time; a `needs:` can lengthen latency).
- `families.md` FAM-1/2 + FAM-9 (live-gen uniqueness) + FAM-15 (golden-crop bloat discipline).

## Residual risks

- **The golden system tends to grow the exact bloat FAM-15 names** — committed screenshot baselines are how PNG estates balloon. The small-crop discipline + the per-image byte-ceiling gate are load-bearing, not cosmetic; if a surface genuinely needs a large capture, it's a reviewed exception, not the default. The B1 policy (W0) governs where goldens live and how they're stored (committed crops vs LFS).
- **The iai baseline must be re-baselined deliberately on legitimate wins** — a committed instruction-count golden reds on a real speedup as well as a regression (same tripwire class as the frozen node-counts). The lane's comment must say so, and the re-baseline is a reviewed commit, not an auto-update — else it becomes the tautology again by drift.
- **The TS 7 bump (W5) and vitest must co-exist** — the FE unit layer is added here under TS 6; W5 bumps to TS 7. Sequence so the vitest config is TS-7-clean, or the unit lane reds on the bump. The FE-unit layer's config is the seam.
- **eslint-in-CI will surface latent boundary violations** — turning the 194-line rig into a gate may red on existing deep-import crossings the barrels masked; W4 removes the barrels and settles the one deep-import grammar, so sequence the eslint gate to expect W4's boundary, or land it first and let W4's excision clear the reds it exposes (co-develop the boundary rule with W4).
- **Pruning coverage is a two-way risk** — deleting the 6 ignored FC tests is safe only because tests-py owns the hard-sudoku path; if W-later work moves hard sudoku back to Rust (F5's alternative), the un-ignore path is the one to take. The gates that DO bite (`r1-gate-soundness` list) are the floor the prune must not cut below.

---
## Execution record (2026-07-13)

Workflow `wf_2291485c-c70`, 7 lanes, all green. Every named vacuous green now bites, each proven born-RED then re-proven green.

| Gate | Born-RED | Close |
|---|---|---|
| iai-baseline | same-binary-twice tautology (2× regression sailed `delta=0.000000% PASS`) | committed golden `iai_queens.baseline` = 1,529,452 instr (real callgrind, provenance in-file) ±2% via `iai_gate.sh` (spike `ff5d9de3` parser hardening folded); deliberate 2× AC-3 scan regression → **+54.63% FAIL**; revert → PASS |
| visual-golden | screenshots written, never compared | capture/compare/review live: 4 committed crops ×(darwin+linux), DPR2, PRM-frozen, baked-aware settles; deliberate theme inversion REDS all crops (0.71–0.85 vs ≤0.02 floor); byte ceiling gate PASS (96 KB total); stability ×3 green |
| w13-soul | SSIM gates wired nowhere | logo/toggle-crest/grid-corner run as goldens every CI e2e job |
| eslint-ci | rig never in CI | `lint:eslint` in the frontend lane; deliberate pencil→games import EXIT 1, revert EXIT 0 |
| fe-unit | zero unit tests | vitest+jsdom: **69 tests/7 files** — codec (incl. W3 version byte accept/reject/ratchet), undo cap/fork, worker protocol + describeError extraction, DOM-contract moves |
| overfit | 28 sleeps; 4 frozen counts; queens8 ×7; 6 wrong-config ignores | 30 sleeps → settle conditions (0 remain); ONE search-trajectory tripwire; queens8 → 1 canonical enumerate; the 6 FC ignores DELETED (tests-py owns the boards); futoshiki oracle merged → `oracle_and_invariance.rs` |
| knip | warn-level, 9 dead items, exit 0 | error-level; 9 excised (6 folded internal, 2 deleted, TextureConfig folded); barrels STAY on `entry` — dropping them = W4's atomic barrel-death (32 reds, 23 = W4's named surface) |
| flaky | throttled-void ~13 s/25 s budget; deal-luck runtime skip | bundled-preview throttle config (:4188): **783 ms** recovery, phantom `.scribble-loader` OR closed; deal-luck deterministic `?board=` — always asserts |
| live-gen-unique | zero coverage | `sudoku_generate.rs::live_generated_boards_are_unique_across_served_sizes` (N∈{2,3,4}, real deal path, max_solutions=2, exactly 1) — born-RED proven; futoshiki analog pre-existed, cross-referenced |
| ci-dag | 9 jobs, 0 `needs:`, lean wasm ×3 | `build-lean-wasm` predecessor uploads once; frontend/e2e/twiggy download (Node-only, no Rust toolchain); iai lane intact; actionlint clean; **golden + throttle gates wired into the e2e job at seal** (they'd have been dark otherwise) |

Evidence: `../evidence/w2/gates.md`. Seal notes: golden settles made baked-aware post-W1 (R1) and the logo/crest goldens re-baselined under the documented review flow (R2, reviewed diffs); linux goldens re-minted in the v1.61.1 Playwright container. Handoffs to W4 banked in the lane record (barrel entry-drop atomic with barrel death; 9-item overlap done-list). Full sweep at seal: cargo test/fmt/clippy green; 69 units; 47/47 e2e; throttle 1/1; goldens 4/4 ×3.
