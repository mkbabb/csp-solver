# T4-W2 — gates evidence (verify lane)

Banked under `EVIDENCE-POLICY.md` (B1): text-first, no images. This dir carries
**zero `*.png`** — the wave's pixel goldens live under the golden machinery
(`web/frontend/e2e/goldens/`, their own budget line), not here.

Host: darwin 25.4.0 (Apple silicon), 2026-07-13. Rust nightly per
`rust-toolchain.toml`; node v26, npm 11.12.1. `cargo test` is debug/unoptimized.

---

## 1. Live-gen uniqueness gate (this lane's deliverable — FAM-9)

**Added:** `csp-solver/tests/sudoku_generate.rs ::
live_generated_boards_are_unique_across_served_sizes`.

Homed at the generation-test estate (native Rust, against the generator itself),
runs under `cargo test --workspace` (`ci.yml:122`) — no CI wiring change needed.
Iterates the served Sudoku sub-grid sizes `[2, 3, 4]` (mirrors the frontend
`VALID_SIZES`, `web/frontend/src/games/sudoku/composables/useUrlState.ts:5`), deals a
**live** board via `generate_board_seeded` (the real hole-digging path, not the
static template shortcut), then re-solves each board independently with
`max_solutions: 2` and asserts exactly one solution. Distinct from the static bank
sweep `examples/verify_bank_uniqueness.rs`, which CI never runs.

`Difficulty::Easy` (fewest holes, `total/4`) keeps it cheap.

| | born value | close value |
|---|---|---|
| live-gen-unique | zero coverage (bank gate is an example CI never runs) | dealt board single-solution at N∈{2,3,4}, **0.44s** debug, every CI run |

```
$ cargo test -p csp-solver --test sudoku_generate live_generated_boards_are_unique_across_served_sizes
test live_generated_boards_are_unique_across_served_sizes ... ok
test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 7 filtered out; finished in 0.44s
```

**Born-RED self-DELTA** (temporary probe, run then removed — proves the
`solutions.len() == 1` compare bites): fed the same harness an empty 4×4 board
(NOT what the generator deals — hundreds of completions):

```
thread 'probe_live_gen_gate_reds_on_nonunique_board' panicked at csp-solver/tests/sudoku_generate.rs:127:5:
assertion `left == right` failed: N=2: a live-generated board must have exactly one solution, got 2
  left: 2
 right: 1
test probe_live_gen_gate_reds_on_nonunique_board ... FAILED
```

The Futoshiki family already carries its analog (`tests/futoshiki.rs ::
generated_puzzles_are_unique_and_valid`, N=4–7) — see Reconciliation R3.

---

## 2. The three born-RED demonstrations (recorded by the earlier lanes; verified here)

### 2a. iai — a 2× hot-path regression reds vs the committed baseline

Pulled verbatim from the iai lane's real amd64/Linux callgrind logs
(`iai_docker_measure.sh` — clean / doubled AC-3 support-scan / reverted) and run
through the **committed** gate `csp-solver/benches/iai_gate.sh` against the
committed baseline `csp-solver/benches/iai_queens.baseline` (golden `1529452`,
band ±2%):

```
$ bash csp-solver/benches/iai_gate.sh run_base.log   iai_queens.baseline   # clean
iai gate — measured=1529452 golden=1529452 delta=0.000000%  band=+/-2.0% => PASS   (exit 0)

$ bash csp-solver/benches/iai_gate.sh run_reg.log    iai_queens.baseline   # 2× hot-path regression
iai gate — measured=2365065 golden=1529452 delta=54.634797% band=+/-2.0% => FAIL   (exit 1)  ← REDS

$ bash csp-solver/benches/iai_gate.sh run_revert.log iai_queens.baseline   # reverted
iai gate — measured=1529452 golden=1529452 delta=0.000000%  band=+/-2.0% => PASS   (exit 0)
```

| | born value (the tautology it replaced) | close value |
|---|---|---|
| iai-baseline | `probe-iai-vacuous.sh`: `abs-instrs=3171444 delta=0.000000% gate=PASS` — a 2× regression sailed **green** (run-it-twice determinism, no stored baseline) | 2× regression **reds** at +54.63% vs the committed golden `1529452`; clean/revert pass at 0% |

Instruction-count LOCK: the gate also reds a legitimate speedup — re-baseline is a
reviewed edit of `iai_queens.baseline`, never a silent auto-update (comment in
both the gate and the baseline file).

### 2b. visual-golden — a deliberate theme inversion reds the compare

Re-run here on this host against the committed darwin goldens (dev server on the
**418x** convention, port 4188 — 3000/3001 left to the concurrent lanes). The
spec's built-in `GOLDEN_DELTA` self-DELTA hook flips the theme.

Baseline compare (goldens are real committed crops; `toHaveScreenshot` at the
`maxDiffPixelRatio ≤ 0.02` floor):

```
✓ toggle crest (dark, moon)      — pass
✓ single cell with given glyph   — pass
✓ grid top-left corner (light)   — pass
✘ logo wordmark (light)          — 3128 px (ratio 0.02) — borderline at the exact floor (see R2)
```

`GOLDEN_DELTA=invert` (theme inversion) — the compare reds hard on every surface:

```
✘ logo wordmark (light)        — 122045 px (ratio 0.71) different
✘ single cell (light)          —  15661 px (ratio 0.76) different
✘ grid top-left corner (light) — 109036 px (ratio 0.85) different
✘ toggle crest (dark)          — reds (theme-class + pixel)
```

| | born value | close value |
|---|---|---|
| visual-golden | zero `toHaveScreenshot`/`toMatchSnapshot` in `e2e/`; every `page.screenshot()` written-never-compared (a solid-black board passed green) | committed small-crop goldens **compared**; theme inversion reds at ratio **0.71–0.85** vs the ≤0.02 floor |

FAM-15 small-crop / byte-ceiling gate (no server):

```
$ npm run test:golden:bytes
[golden-bytes] 8 golden(s), 82.5 KB total; per-image ceiling 150 KB
  ok  3.8 KB cell-*  ·  15.x KB grid-corner-*  ·  15.x KB logo-*  ·  6.x KB toggle-crest-*
[golden-bytes] PASS — every golden within the per-image ceiling.   (exit 0)
```

Caveat: the baseline compare required relaxing the settle wait to
`state: 'attached'` (temporary probe, reverted) because W1's landed bake hides the
settle selector — **Reconciliation R1**. The invert RED and the 3 baseline passes
were observed under that relaxation.

### 2c. eslint — a cross-boundary import reds the frontend lane

A throwaway `src/pencil/__w2_boundary_probe.ts` importing `@games/futoshiki/types`
(the colocation edict forbids `src/pencil/** → src/games/**`); created, run,
deleted:

```
$ npm run lint:eslint            # with the deliberate cross-boundary import
src/pencil/__w2_boundary_probe.ts
  4:1  error  '@games/futoshiki/types' import is restricted ... src/pencil/** must not import
              from src/games/** (the domain layer) ...  no-restricted-imports
✖ 1 problem (1 error, 0 warnings)          exit 1  ← REDS
$ rm src/pencil/__w2_boundary_probe.ts
$ npm run lint:eslint                       exit 0  ← green restored
```

| | born value | close value |
|---|---|---|
| eslint-ci | 194-line boundary rig loaded but CI never invoked it — a `pencil → @games` import passed all 9 lanes | `npm run lint:eslint` in CI reds the frontend lane on the cross-boundary import (exit 1) |

---

## 3. Full local verification (every command verbatim)

All run at repo root / `web/frontend`. `npm run lint` bare was never invoked
(only `lint:eslint` / `lint:knip`).

| # | command | outcome | exit |
|---|---|---|---|
| 1 | `cargo test --workspace` | all green — incl. the new live-gen gate; no failures across the estate | 0 |
| 2 | `cargo fmt --check` | clean | 0 |
| 3 | `cargo clippy --workspace --all-targets -- -D warnings` | clean (lone line: transitive `proc-macro-error2` future-incompat notice, not a workspace lint) | 0 |
| 4 | `npm run test:unit` | **7 files, 69 tests passed** (868 ms) — vitest+jsdom (codec incl. W3 version byte, undo/redo, worker protocol) | 0 |
| 5 | `npx vue-tsc --noEmit` | clean | 0 |
| 6 | `npm run lint:eslint` | clean | 0 |
| 7 | `npm run lint:knip` | clean (exports/types promoted to `error`, barrels off `entry`) | 0 |
| + | `npm run test:golden:bytes` | PASS — 8 goldens, 82.5 KB, all < 150 KB | 0 |

Selected verbatim tails:

```
# cargo test --workspace  (representative — full estate green)
test result: ok. 41 passed; 0 failed; ...    (solver unit)
test result: ok.  7 passed; 0 failed; ...    (sudoku.rs)
test result: ok.  8 passed; 0 failed; ...    (sudoku_generate.rs — incl. live_generated_boards_are_unique_across_served_sizes)
Doc-tests: ok. 4 passed; 0 failed.
→ CARGO_TEST_WORKSPACE_EXIT=0

# npm run test:unit
Test Files  7 passed (7)
     Tests  69 passed (69)
```

### Targeted e2e (full suite is the team-lead seal)

Per lane scope, only the golden-system specs were driven (§2b above): 3/4 golden
crops match the committed darwin references; the invert self-DELTA reds. The
functional e2e specs the prune lanes touched (`affordances`, `drawer`,
`permalink`, `sudoku-interaction`, `throttled-void`, `share-truth`, …) were **not**
run here — they require the app server and belong to the team lead's seal sweep.
They are additionally gated on R1 (the golden/W1 settle seam has an e2e cousin:
any spec that waits on `g.boil-frame-layer.is-active` visible inherits the same
`baked-hidden` timeout — the seal sweep must confirm none do).

---

## 4. Reconciliations (flagged, not silently resolved)

**R1 — W1 × W2 settle seam (BLOCKING for the golden lane; the headline).**
W1's landed bake-once swap (`HandDrawnGrid.vue:291`, `showBaked`) marks the steady
vector layer `g.boil-frame-layer.is-active` with `baked-hidden`
(`@media screen { display:none }`, `:370`) and paints the surface via
`.boil-frame-bitmap.is-active` `<image>` instead. The golden spec's `loadSettled`
(`visual-golden.spec.ts:89`) waits for that vector layer to be **visible** —
which now never happens, so **all 4 goldens time out at settle before any
compare** on the current concurrent tree. The compare only ran here after
temporarily relaxing that wait to `state: 'attached'`. Fix (W1/W2 seam owner):
point the golden settle at W1's real surface (`.boil-frame-bitmap.is-active`), or
accept the vector layer in `attached` state. Not resolved by this lane — the exact
final settle contract is W1's call, and W1 is still in flight. The spec's own
header already anticipated co-developing with "W1's bitmap pose-stack swap."

**R2 — the goldens likely need a reviewed re-baseline post-W1.** Even with settle
working, `logo-light` sits exactly at the `maxDiffPixelRatio 0.02` floor
(3128 px) on this host — a borderline pass/near-miss, consistent with a W1
baked-logo-pose drift or dev-vs-capture-condition delta. The golden config
already names the remedy: "a re-baseline after W1's bitmap pose-stack swap is ONE
reviewed `--update-snapshots` run." The seal should re-baseline the darwin (and
linux) goldens against W1's final baked surfaces and review the DELTA — not an
auto-update. (The other 3 crops passed, so this is a per-golden touch-up, not a
wholesale remint.)

**R3 — Futoshiki live-gen uniqueness already exists; the gap was Sudoku-only.**
The spec's live-gen-unique row reads "today: zero coverage," but
`tests/futoshiki.rs :: generated_puzzles_are_unique_and_valid` (N=4–7, committed,
unmodified) already asserts live-generated Futoshiki puzzles are unique. The true
gap was the **Sudoku** generator, which this lane's new test closes. No
duplication introduced; the new test cross-references the Futoshiki analog so both
families now carry a standing live-gen uniqueness gate. If the seal wants the FAM-9
row to read literally, note it covers both families across their respective served
sizes (Sudoku {2,3,4}; Futoshiki {4,5,6,7}).

**R4 — served-size wording: `VALID_SIZES` is the source of truth, not the wasm
doc-comment.** `wasm/src/sudoku.rs:115` describes n∈{2,3,4}; the frontend
`VALID_SIZES=[2,3,4]` (Sudoku) and `VALID_BOARD_SIZES=[4,5,6,7]` (Futoshiki) are
the served sets the gate iterates. N=5 Sudoku is deliberately unshipped (empty
bank; the new test does not touch it). No conflict — recorded so a later size
change updates the gate's `SERVED_SIZES` alongside the frontend constant.

**R5 — W3 version-byte coverage seam (informational, no conflict).** W3's codec
version byte is covered at the FE-unit layer (`useUrlState.test.ts` for both
games, part of the 69 vitest tests, all green here). The Rust live-gen gate does
not touch the codec — the two coverages are disjoint by design. Flagged only so
the seal doesn't expect the version byte in the Rust estate.

---

## 5. Working-tree state left by this lane

Only `csp-solver/tests/sudoku_generate.rs` (+63/−2: imports + the live-gen test).
Every probe was reverted: the `visual-golden.spec.ts` settle patch restored, the
`sudoku_generate.rs` born-RED probe removed, `src/pencil/__w2_boundary_probe.ts`
deleted. No `ci.yml`, `package.json`, `vite.config.ts`, or other W1/W3-shared file
was touched. Ports 3000/3001 untouched (owned by concurrent lanes throughout); the
lane's own preview ran on 4188 and was stopped.
