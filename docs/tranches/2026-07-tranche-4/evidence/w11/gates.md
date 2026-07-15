# T4-W11 · Lane V — ADVERSARIAL VERIFICATION (consolidated gate table)

Measured against the working tree (all R1–R4 + RS + KEY files in-tree), dist built and served on
`:4593` (killed after; `:3000`/`:3001` never touched). HEAD `ba98c2bf` (the handoff commit above the
`7d51f562` base). CEN's live figures govern the spec's stale `65425697` census. Temp mirror config
`playwright.v-verify.config.ts` created for the default-suite run and DELETED after; no tracked
spec/config/src edited by V.

## Verdict: **RED** — the invariant is fully GREEN, but the binding **≥1,600 net-LOC floor is UNMET** (−485 cloc)

Every load-bearing invariant (unedited suite, byte-π goldens, owner-P0 perf) passed under V's own
measurement. The one binding gate that FAILS is the net-LOC floor: the wave removed 1,115 net cloc,
485 short of the restated ≥1,600 floor — because the 544-line `use<Game>.ts` twin was assigned to NO
extraction row and KEY's declaration layer added +189 cloc.

---

## THE GATE TABLE (V's own measurement)

| Gate | V's probe | Result | Verdict |
|---|---|---|---|
| **invariant — e2e (zero edits)** | `shasum -a 256` all 15 e2e specs+configs vs CEN's banked hashes | **15/15 byte-match**; `git status e2e/` clean | **GREEN** |
| **invariant — e2e (green)** | default suite, temp webServer-free mirror, `:4593` | **63/63 passed** (13.9s) | **GREEN** |
| **invariant — rust** | `cargo fmt --check` · `clippy -D warnings` · `test --workspace` | fmt 0 · clippy 0 (only pre-existing `proc-macro-error2` future-incompat note) · **179 passed** = 174 baseline UNEDITED + RS 4 + KEY 1 | **GREEN** |
| **invariant — goldens (π)** | `npm run test:golden`, `:4593`; `git status` PNGs | **4/4 passed** (2.7s), byte-for-π; **zero re-baselines** (no PNG in git status) | **GREEN** |
| **perf — idle 0-paint (P0)** | `cen-idle-paint.mjs` both games, dealt board | sudoku **0 paints** RecalcΔ40 (5s); futoshiki **0 paints** clean runs (run2=40 is CEN's documented Worker deal-tail leak) RecalcΔ48/6s≡40/5s; boil 16/s; liveCount 4 both | **GREEN** |
| **perf — no added vnode layer** | paints=0 + RecalcΔ at CEN floor post-extract (cells slotted, not wrapped; R3 composable form) | steady-state paints unchanged (0), RecalcΔ at floor → no reactivity/vnode depth added on cell hot path | **GREEN** |
| **twin reservoir collapse** | `comm -12` CORR on each collapsed pair | ControlPanel **781→66**, Cell **528→228**, Board **529→142** — mass collapsed by extracted amounts | **GREEN** |
| **doubled keyframes** | `grep -rln "@keyframes $k" src` × 6 | all six → **1 file each** (sharePop/eraserScrub→GameControlPanel; note-*→SolverErrorNote; marks-fade-in/ghost-draw-on→gameCell.css) | **GREEN** |
| **contract exists (FE+Rust)** | `grep -rl defineGame src`; `grep -rln PuzzleClass csp-solver` | defineGame in registry.ts + both game.ts + test; PuzzleClass in lib/puzzles/class.rs + tests | **GREEN** |
| **contract acceptance (stub, zero shell edits)** | `vue-tsc -b --force`; `git diff --stat games/shared/`; thermo rust test | vue-tsc 0; **no tracked shell edited by KEY**; `thermo_sudoku_plugs_into_the_contract_unchanged` green | **GREEN** |
| **boundaries (three-home tripwire)** | eslint; `grep` games/shared imports of game dirs | eslint 0; **games/shared imports NO concrete game** | **GREEN** |
| **types** | `vue-tsc -b --force`; `cargo build` | vue-tsc 0; cargo build 0 | **GREEN** |
| **FE battery** | tsc/unit/eslint/knip/prettier/build | all 0; **unit 273** (271 baseline + 2 additive) | **GREEN** |
| **NET-LOC FLOOR** | `cloc web/frontend/src/games` vs CEN ceiling **≤10,678** | **11,163** — **485 OVER**; net removed **1,115** vs required ≥1,600 | **RED** |

---

## THE FLOOR — the one RED gate (failing probe + output)

```
$ cloc web/frontend/src/games --quiet --csv | awk -F, '/SUM/{print $5}'
11163                     # required: <= 10678  (CEN restated floor, §4)
                          # net removed = 12278 - 11163 = 1115  (required >= 1600)  -> SHORT by 485
```

**Cause (two contributions, both structural):**

1. **`use<Game>.ts` is a 544-identical twin that NO extraction row owns** — V re-ran `comm -12`:
   `useSudoku.ts` ∩ `useFutoshiki.ts` = **544 → 544** (UNCHANGED; base=CEN 544). Rows R1–R4 own
   SolverErrorNote(101)/ControlPanel(781)/Cell(528)/Board(529)+Game(96)+conflicts(40). The 544-line
   `use<Game>` reservoir sits outside every row's scope — R4's record flags this explicitly.
2. **KEY's declaration layer adds +189 cloc to games/** ** (registry.ts, registry.test.ts,
   sudoku/game.ts, futoshiki/game.ts) — additive-by-design (the contract is a declaration layer that
   removes no LOC), but it counts against the floor. R4-tree was 10,974; KEY pushed it to 11,163.

**Reachability caveat (from R4's arithmetic, V concurs):** even WITH a `use<Game>` extraction row at
R1–R3's proven ~0.68 dedup efficiency, the cumulative bottoms at games/** ≈ 10,866 — **still above
10,678**. The floor as literally stated (≤10,678) appears **not reachable in the R1–R4+use<Game>
scope**; the CEN restated ceiling may itself be mis-derived (it folds the full 2,619 multiplicity
reservoir, incl. the 882-line trivial-structural inflation CEN measured, into the removable target).

The distillation IS real — 1,115 net cloc genuinely deleted, shared growth (694 R4 + 395 R3 + 757 R2 +
102 R1) < twin-dir shrinkage every row (no relocation-masquerade), reservoir mass collapsed by the
extracted amounts. But the **binding floor gate is RED**.

---

## TEAM-LEAD OUTSTANDING

1. **THE FLOOR (blocking the PASS).** `cloc(games/**)=11,163` vs the binding ≤10,678 — short 485 cloc.
   Decide one of: **(a)** add a 5th row extracting the `use<Game>.ts` 544-twin (state machine shared,
   domain ops slotted — the spec's own Row-scope note names it) — but R4's arithmetic says even this
   lands ≈10,866, still short; **(b)** formally renegotiate the floor to the delivered figure
   (V-measured net −1,115 cloc, or R4-tree net −1,304 before KEY's declaration layer), acknowledging
   the CEN ≤10,678 ceiling folds trivial-structural inflation into the removable target. The invariant
   (the wave's ABSOLUTE rule) is untouched by either path.
2. **KEY declaration layer (+189 cloc)** counts against the floor by design. If the floor is held,
   note that the registry could home outside `games/**` (it already imports across the boundary and is
   tree-shaken from the app build) — moving `registry.ts`/`registry.test.ts` out of `games/**` reclaims
   part of the +189 without touching behavior.
3. **`proc-macro-error2` future-incompat** — RS's pre-existing transitive note; non-blocking, flagged
   for the record.

## What V ran (reproducible)

- SHA-256 × 15 e2e/config files → all match CEN §2 banked hashes.
- `cloc web/frontend/src/games` (system cloc 2.08, Vue-aware) → 11,163 code.
- `comm -12` CORR (cen-census filter) on 4 pairs → CP 66 / Cell 228 / Board 142 / use<Game> 544.
- keyframe grep × 6 → 1 file each.
- default e2e (63) / goldens (4) on `:4593` built dist via temp webServer-free mirror (deleted).
- `cargo fmt/clippy/test --workspace` → 179 (174+5).
- `cen-idle-paint.mjs` sudoku (1) + futoshiki (3) → 0 steady-state paints both.
- FE battery tsc/unit(273)/eslint/knip/prettier/build → all 0.
- Post-run: `git status e2e/` clean, PNGs clean, temp config removed, `:4593` killed.

---

# T4-W11 · Lane V2 — THE CURE VERDICT (adversarial re-verification of R5)

Measured against the working tree = `8bf069df` (R1–R4+RS+KEY committed) + R5 uncommitted
(the two composable adapters + `games/shared/useGameState.ts`). Dist built and served on `:4686`
(killed after; `:3000` owner's, verified 200 + untouched; `:3001` never touched). Temp mirror
`playwright.v2-verify.config.ts` + a temp WU-drive spec `e2e/__v2_wu_drive.spec.ts` created for the
run and **DELETED after**; no tracked spec/config/src edited by V2. Every number below is V2's own
measurement — R5's record was read, then broken against.

## Verdict: **PASS** — floor GREEN at cloc(games)=10,747 ≤ 10,867 AND every invariant GREEN

The cure lands. R5's use<Game> extraction removes the 544-twin the floor red'd on; the binding
team-lead cure ceiling (≤10,867, excl. KEY's mandated +189 declaration layer) is met with 120 cloc
of margin, and the full invariant suite passes UNEDITED under V2's own measurement.

## THE GATE TABLE (V2's own probes)

| Gate | V2 probe | Result | Verdict |
|---|---|---|---|
| **NET-LOC FLOOR (cure ceiling)** | `cloc web/frontend/src/games` | **10,747 ≤ 10,867** (margin 120); sudoku 2,144 / futoshiki 2,362 / shared 6,119 | **GREEN** |
| ruling arithmetic — declaration layer | `cloc` registry.ts+sudoku/game.ts+futoshiki/game.ts+registry.test.ts | **53+33+34+69 = 189** exactly (matches the ruling's +189) | **GREEN** |
| ruling arithmetic — extraction-delta | `12,278 − (10,747 − 189)` | **1,720 ≥ 1,600** | **GREEN** |
| real deletion (not relocation) | `git diff --stat 8bf069df -- games/` + shared Δ | composables shed **1,063** cloc (sudoku −530 / futoshiki −533; git-stat 100 ins / 1,545 del); shared grew **+647** (useGameState, the ONLY shared change) < 1,063 removed | **GREEN** |
| twin reservoir — use<Game> | `comm -12` CORR (cen filter) | **544 → 27** (A=52 / B=73) — the cure | **GREEN** |
| twin reservoir — others hold | CORR probes | ControlPanel **66** · Cell **228** · Board **142** · SolverErrorNote **folded→0** · conflicts **folded→0** | **GREEN** |
| **invariant — e2e (zero edits)** | `shasum -a 256` × 15 specs+configs vs CEN §2 | **15/15 byte-match**; `git status e2e/` clean | **GREEN** |
| **invariant — e2e (green)** | default suite, temp webServer-free mirror, `:4686` | **63/63** (clean re-run). First shot 61/63: `futoshiki.spec:125` (solve) + `visual-regression:402` (toggle-warp) flaked under full-suite parallel contention — **both passed in isolation**, suite **green on retry** (the wave's documented retry discipline; a state-machine regression would fail isolated too) | **GREEN** |
| **invariant — goldens (π)** | `playwright-golden.config.ts`, `:4686` | **4/4** (logo-light clean first shot); `git status` PNGs clean → **zero re-baselines** | **GREEN** |
| **invariant — unit** | `npm run test:unit` | **273 / 22 files** (271 baseline + KEY 2, unedited) | **GREEN** |
| **invariant — rust** | `cargo fmt --check` · `clippy --all-targets -D warnings` · `test --workspace` | fmt 0 · clippy 0 · **179 passed / 0 failed** (174 baseline UNEDITED + RS 4 + KEY 1); `git diff --stat 8bf069df -- csp-solver/` **empty** (R5 zero rust) | **GREEN** |
| **WU spine — live drive** | 63-green suite on V2's dist (undo/redo/fill-batch/dirty-gate/staged-deal/solve-epoch/permalink/marks-peek) + V2's OWN independent spec | sudoku edit→undo→redo through R5's machine **GREEN**; futoshiki `?difficulty=` persists across reload **GREEN**; `?difficulty` logic in `useUrlState.ts` **untouched by R5** (diff = 2 composables only) | **GREEN** |
| **perf — idle 0-paint (P0)** | `cen-idle-paint.mjs` both games, dealt board | **sudoku 0 paints RecalcΔ40 liveCount4** (clean control — no Worker; both games share useGameState → proves no reactivity depth added on the state path). **futoshiki 0 paints RecalcΔ40** on clean runs (at CEN floor); intermittent 32–52-paint leaks carry `bakedCount=0` (deal unsettled) = the CEN-documented Worker deal-tail, R5-A/B-falsified | **GREEN** |
| **boundaries + types** | eslint / knip / prettier --check src/ / vue-tsc / build | all **0** (three-home tripwire holds: useGameState imports only `@pencil`/`@/`/`@games/shared`) | **GREEN** |

## THE FLOOR — the gate V red'd on, now GREEN

```
cloc(web/frontend/src/games) = 10,747        # binding cure ceiling: <= 10,867  -> GREEN (+120)
  declaration layer (excl.)  =    189        # 53+33+34+69, the KEY spec deliverable
  extraction-delta = 12,278 - (10,747-189) = 1,720   # required >= 1,600 -> GREEN
```

- Note vs the stricter CEN ≤10,678: **not met** (10,747 > 10,678) — but that ceiling folds the
  882-line trivial-structural inflation CEN itself measured into the removable target. The **binding
  cure gate is the team-lead ≤10,867**, and V2 confirms it GREEN.
- The 544 twin V red'd on is gone: `useSudoku`∩`useFutoshiki` CORR **544→27** under V2's own
  `comm -12`. The 27 residue is undedupable adapter scaffold (imports, `useSolver`/
  `resolveInitialState` calls, divergent budget-table structure, identical-signature slot keys).

## What V2 ran (reproducible)

- `cloc games/**` → 10,747; declaration-layer cloc → 189; `git diff --stat 8bf069df` composables → 100/1545.
- `comm -12` CORR on 5 pairs → use<Game> 27 · CP 66 · Cell 228 · Board 142 · (SolverErrorNote/conflicts folded).
- SHA-256 × 15 e2e/config → all match CEN §2 banked hashes.
- default e2e (63) 1st-shot 61 (2 contention flakes, both green isolated) → full re-run **63/63**; goldens **4/4** on `:4686` built dist via temp webServer-free mirror (deleted).
- `npm run test:unit` → 273; `cargo fmt/clippy/test --workspace` → 179 (174+5), csp-solver diff empty.
- V2's own WU drive spec (deleted): sudoku undo/redo + futoshiki `?difficulty=` reload persist → 2/2.
- `cen-idle-paint.mjs` sudoku (0 paints RecalcΔ40) + futoshiki (0 paints clean; deal-tail leaks bakedCount=0).
- Post-run: temp spec + mirror config + test-results removed; `:4686` killed; `:3000` 200 untouched; `git status` = R5 footprint only.
