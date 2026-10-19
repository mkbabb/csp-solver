# Pass 9 · ACC-GRAPHITE · the critic's read

Critic lane `crit-ACC-GRAPHITE`, 2026-10-08 19:55–. Non-author. Work tree served on :4235, HEAD control on :4254. Durable scratch `.claude/t9-scratch/work/pass9/crit-ACC-GRAPHITE/` (archives, builds, logs, plants; nothing under /tmp). The numbers below are the critic's own unless a row says "lane's".

## 0 · The bank, re-checked from fresh archives

Every archive is `git archive 74a2b5d9` taken through the prototype's worktree gitdir (no git on main or the control), applied with `GIT_CEILING_DIRECTORIES` at the scratch dir, exits written bare.

| Check | Exit |
|---|---|
| `pass9.diff` (sha1 `457a7984`, 600,007 B, 37 files) `--check` on fresh `74a2b5d9` | 0 |
| `pass9.diff` on `74a2b5d9` + `s13-s7-s3.diff` | 1 (as declared) |
| `pass9.delta.on-WAVE.diff` (sha1 `126f99e6`, 25,695 B, 10 files) on the WAVE union `74a2b5d9` + `WAVE.diff` (sha1 `0dc4fd85`) | **0** |
| the same on the union + `homes.on-WAVE.diff` (sha1 `a0f8e6f3`) = `acde977b` | **0**, applied for real |
| `pass9.delta.on-s13-s7-s3.diff` (sha1 `292d9e8e`) on s13-s7-s3 | 0 |
| `pass9.delta.on-WAVE.diff` on s13-s7-s3 | 1 (`index.css`, `GameControlPanel.vue`, as declared) |

- The work tree `wf_f72f3b5a-83a-40/web/frontend` equals `74a2b5d9 + pass9.diff` (`diff -rq`, build output, `node_modules` and `test-results` excluded: no difference). My own temporary-index write-trees (`f7667231` for the tree, `10acef8b` for the union + delta) do not reproduce the lane's `df9999af`/`ff709150`; the content diff is clean, so I read this as an index-method difference (force-add of ignored paths, symlinked `node_modules` in docs), not a content one. Declared, not resolved.
- Homes v2 by sha: `homes.diff` (`1f70cfda`) applied to a fresh base; all 13 home paths in the tree are byte-equal to it (`cmp` 13/13). `pass9.delta.own.diff` carries no home path; the on-WAVE delta carries none either. `.prettierignore` and `eslint.config.js` equal the base (`cmp` 0).
- Greps over all four banks: `scratchpad|/private/tmp|/tmp/|.claude/t9-scratch` 0, `^+++ .*/\.` 0; every `+++` path is under `web/frontend/`.
- Builds (private `cacheDir` under the critic's scratch): the union + delta builds `index-CBvmTgNKzptx.js` and the union control `index-BRpbF3dGtZoj.js`, the lane's exact hashes. The served bytes are the lane's.
- The pass-9 advance over `pass8.diff` (both applied to fresh archives, `diff -rq`): product changes only in `GameBoard.vue` (predicate moved out), `boardRaster.ts` + `.test.ts` (new), `gameCell.css` (one-spend selector, threshold comment), `gridPaths.ts` (one comment), `gridPaths.tally.test.ts` (MOVED 56→55), `check-ink-pressure.mjs`; the rest is homes v2 and the two reverted fork lines.

## 1 · Row 1 (the batch gate), re-derived on the union, both engines

The union + delta (`index-CBvmTgNKzptx.js`, built by the critic) on :4235 against the HEAD control `w7-control` (`index-CubiZsMVSwTc.js`) on :4254. Instrument: the pass-7 critic's `bandc.crit.ts` (sha1 `f256121a`) + `band-stat.mjs` (`d2e2d620`) + `band-lib.ts` (`48fe6062`), unchanged; `GATE=1 STAT=tb` (A.1 top/bottom over the whole frame as painted, CHAIR §2), DPR 1, light, PRM reduce, `mintBoard(3, 30)`. Exit read bare from the file the run wrote.

| Rig (board px) | chromium t/b | webkit t/b | control cr / wk |
|---|---|---|---|
| desk 1280×800 (636) | 1.377 | 1.426 | 0.545 / 0.543 RED |
| phone 393×699 coarse (365) | 1.392 | 1.371 | 0.521 / 0.229 RED |
| tablet 768×1024 coarse (668) | 1.386 | 1.381 | 0.528 / 0.531 RED |
| tablet 1024×768 coarse (604) | 1.430 | 1.434 | 0.580 / 0.568 RED |
| laptop 1280×800 coarse (636) | 1.377 | 1.426 | 0.545 / 0.543 RED |
| **exit** | **0** (load 58.7 → 60.0) | **0** (load 60.0 → 55.8) | — |

- Every cell equals the lane's to the thousandth. **Row 1 is MET, and the critic re-derived it** (LAWS P8 §C, §H: GRAPHITE leaves 71/76 on a non-author read).
- The margins are the lane's: 0.021 below (webkit phone 1.371), 0.016 above (webkit 1024×768 1.434). The 1024×768 tree reads SIDES≠ in chromium (top 14.753 fused to a grid line, bottom 9.970); the stamp takes the lower side, so the gate reads the unfused one.

## 2 · Rows 2, 3 and the raster unit row, re-derived (the 74a2b5d9 tree, critic's archive)

| Row | Born-RED / sabotage, same run | Clean | 
|---|---|---|
| R2 `lint:ink` | `SHAPE_SABOTAGE=publisher-split`: 28 violations, exit 1 | exit 0 (tree) · union control `lint:ink` 0 |
| R3 tally MOVED 56→55 | pass-8's `gridPaths.tally.test.ts` copied beside the tree's: 3 failed / 3 passed, exit 1 | the tree's: 6/6, exit 0 |
| `boardRaster.test.ts` | clause sabotage on `boardRaster.ts`, each plant `cmp`-verified landed: `<`→`<=` exit 1 · bound 376 exit 1 · DPR factor deleted exit 1 · width-0 guard deleted exit 1 | 4/4, exit 0; file restored (`cmp` 0) |

- Bound 376 reds only because the test pins `SMALL_RASTER_DPX` to 375 by value; the boundary rows (`375 − 0.01` small, `375` not) are what would catch a moved comparison. Both are present. The unit row pins the predicate, not the cliff: nothing in it knows the ratio. The cliff is pinned only by the sweep (§4), which is not a product row.

## 3 · The on-WAVE delta, read line by line

What it lands on the union is the band and nothing else (retrace path, `generateCellRetraceRects` + `reverseLinearPath`, the 12 + 15 no-fill graphite tier 2, the red pair, the PRM line, `boardRaster.ts` + `data-raster`), plus two writes into other families' files (LADDER's `check-motion-bands.mjs` MOVED row; §6's `--ring-ink` line). Both are declared. Findings the lane did not name:

1. **The span key reads `window.devicePixelRatio` inside a `computed` that tracks only the width.** DPR is not reactive. A window dragged between a 1× and a 2× display at the same CSS width keeps the old key until the width moves. Small, but it is the key's own input.
2. **Every real phone takes the 15-unit arm, and no rig reads it there.** The key multiplies by DPR, so the 393×699 phone at DPR 2 is 730 dpx and at DPR 3 is 1,095 dpx, both "large". The five ruled rigs and the 13-span sweep are all DPR 1. The `small` arm only ever paints on a 1× phone-sized window, which is close to no real phone. §5 reads DPR 2 and 3.
3. **`useGameCell.ts` hard-codes `generateCellRetraceRects(props.boardSize, 1000, 42)`** where the sibling ring comes from `GameBoard.vue`'s `generateCellRects(…, VIEWBOX_SIZE, 42)`. Two literals copied, not one constant shared: if the board's viewBox or seed moves, the second pass silently stops sitting one stroke inside the first. Low risk today, but it is the legacy-alias shape.
4. **Stale product prose, two sites.** `gameCell.css` `.cell-ghost-retrace` says the band is read against "its left and right lines; the top and bottom are half strokes cut by the grid's bakes". That is the pass-7 frame, contradicted by VERB's un-clipped frame and by the CHAIR §2 re-stamp (A.1 top/bottom). `index.css:526` (union + delta) still cites "§6's ONE line at `--color-focus-sketch` above", which the fold deleted.
5. **The served CSS** (union control `index-gBa5qWEljPF5.css` against union + delta `index-BYLUNcK7TK9_.css`, scope hashes normalised): exactly one class added, `.cell-ghost-retrace`. No Tailwind utility minted by the three changed comments. `--color-focus-sketch` leaves the served CSS (4 → 0 occurrences), and no source or dist consumer remains. This closes the orphan-utility half of the lane's R7 gap 4. The whole-DOM π does not (§6).
6. **Counting disagrees inside the lane's own record.** README §5 says "thirteen spans" and tabulates twelve. `boardRaster.ts` says "a sweep of eleven spans". The cited cliff evidence has three sizes.
7. **The lane's `readings/rows4-6-plants.txt` has no webkit exit** for the re-sited re-clip plant (`u-pl-clipG webkit … |  |`), but README §3 prints "1 / 1". The webkit numbers are RED on every rig printed (the tablet cell is "…" in the README), so the exit is very likely 1. It is not on file.
8. **The MOVED row's key is truncated.** `check-motion-bands.mjs` `selectorOf` cuts a selector list at 80 chars (`:663`), so the new key ends `…, .game-cell:has(input:focus`. A third selector added to that list later gets the same key, and B6 would not see the 180 ms spend widen. That is LADDER's class (every list longer than 80 chars has it), but GRAPHITE's one-spend cure is the first row that leans on it. I name it for LADDER. It does not count against GRAPHITE's number.

## 4 · The union's gates beside the union control (critic's runs, exit read bare from file)

| Gate | union control `acde977b` | union + delta |
|---|---|---|
| `lint:verbs` | 0 | 0 |
| `lint:ink` | 0 | 0 |
| `lint:motion` | 0 | 0 |
| `lint:theme-tokens` | 1 | 1. The `diff` of the two outputs is the declared counts only: `@theme declared` 64→63, custom properties 177→176 |
| `vitest boardRaster.test.ts` | — | 4/4, 0 |

`lint:bands` was not run by the critic: B6 needs `74a2b5d9` reachable, and a `git archive` has no history (LAWS P8 §F). The lane's 0 (1 before the MOVED row) is the lane's number. The verbs born-RED (1 before the one-spend cure) was not re-planted by the critic.

## 5 · The band's plants on the union, critic's own, both engines

Each plant was a file under the critic's scratch with its bytes checked by `od -c`, injected into the tree arm only through `bandw.crit.ts` (sha1 `8bab180f`) `EXTRA_CSS`. `GATE=1 STAT=tb`, five rigs; the HEAD control on :4254 is RED in every row (0.229–0.580). The table gives tree t/b in the order desk / phone / tablet / 1024×768 / laptop-coarse.

| Plant (load at open) | chromium | webkit | exit cr / wk |
|---|---|---|---|
| second pass removed `.cell-ghost-retrace{display:none!important}` (49 / 37) | 0.728 / 0.841 / 0.761 / 0.759 / 0.728 | 0.761 / 0.818 / 0.769 / 0.752 / 0.761 | **1 / 1** |
| second pass at 20 units (40 / 41) | 1.536 / 1.671 / 1.550 / 1.595 / 1.536 | 1.588 / 1.633 / 1.550 / 1.591 / 1.588 | **1 / 1** |
| the pointer key put back (`@media (pointer:coarse)` → 12) (36 / 30) | 1.377 / 1.392 / **1.290 / 1.314 / 1.282** | 1.426 / 1.371 / **1.287 / 1.316 / 1.325** | **1 / 1** |
| X6, the ring with no sides `.cell-ghost{clip-path:inset(0 22% 0 22%)}` (29 / 24) | 1.377 / 1.392 / 1.386 / 1.430 / 1.377 | 1.426 / 1.371 / 1.381 / 1.434 / 1.426 | **0 / 0 — G2 BLIND** |
| a shallow re-clip, `.grid-ink,svg.hand-drawn-grid{clip-path:inset(0.4% 0 0.4% 0)}` (31 / 25) | 1.380 / 1.393 / 1.387 / 1.431 / 1.380 | **1.442** / 1.388 / 1.383 / 1.436 / **1.442** | 0 / 0 |
| CLAUSE sabotage of the instrument: the band's `Math.min(top, bottom)` → `Math.max` (`bandwMAX`), 1024×768 | 2.116 | 2.114 | **1 / 1** |

- The pointer, thin and thick plants reproduce the lane's numbers exactly (the pointer key reds all three coarse ≥ 604 dpx rigs). The min-side clause holds load: deleting it lets the fused side through (2.11 both engines).
- **X6 is blind in both engines, re-derived.** A ring clipped to its middle 56 % (no left or right side) reads identical to clean to the thousandth. G2 reads top and bottom only, the four-band graft through `edge-bands.mjs` is untaken for a fourth pass, and no product row exists (R6). **Under registry-v8 §2.12 this gate is OPEN for its class.** It reds the plants it was cut for (thin, thick, pointer, the fused side). It is not cured for a whole class of ring damage it cannot see: sides missing, one side clipped.
- **My shallow re-clip is a declared non-red.** It clips 2.5 px at desk, which does not reach the frame's half-stroke in chromium. In webkit it lifts desk from 1.426 to **1.442, inside by 0.008**: a mild clip moves webkit's desk two-thirds of the way to the upper bound and the gate does not see it. The lane's re-sited plant (2.3–3.0, RED) is a near-total clip. **The band has no plant at the half-clip the pass-8 frame actually had.** A deeper re-clip (1.2 %) is in §7.

## 6 · Threshold sabotage and the real-device DPR (critic's new rows)

**Threshold (bound ± ε), webkit, where both margins sit**, five rigs, `bandw.crit.ts` `WIN`:

| Window | Reds | Exit (load) |
|---|---|---|
| [1.372, 1.45] (low bound + 0.002) | phone 1.371 only | **1** (26.8) |
| [1.35, 1.433] (high bound − 0.002 against 1.434) | 1024×768 1.434 only | **1** (24.7) |
| [1.370, 1.435] | none | **0** (36.7) |

The window is pinned on both sides, and each bound reds exactly one cell. That also says the band sits **0.001 to 0.002 inside the tightest window it can pass**: webkit's spread 1.371–1.434 nearly fills [1.35, 1.45] less ε at each end.

**DPR 2 and 3: what every real phone paints.** The span key multiplies by DPR, so a phone at DPR ≥ 2 takes the 15-unit arm. No lane rig had read that arm on a phone. `GATE=1 STAT=tb`, `bandw.crit.ts DPR=n`, tree vs HEAD control:

| Rig (CSS board → device px) | chromium | webkit | control cr / wk | exit cr / wk (load) |
|---|---|---|---|---|
| phone 393×699 @2 (365 → 730) | 1.402 | 1.418 | 0.499 / 0.628 RED | 0 / 0 (31.5 / 30.4) |
| phone 812×375 @2 (347 → 694) | 1.378 | 1.422 | 0.516 / 0.520 RED | |
| tablet 768×1024 @2 (668 → 1,336) | 1.373 | 1.375 | 0.759 / 0.768 RED | |
| phone 393×699 @3 (365 → 1,095) | 1.381 | 1.419 | 0.620 / 0.744 RED | 0 / 0 (35.5 / 29.6) |
| phone 812×375 @3 (347 → 1,041) | 1.370 | 1.422 | 0.661 / 0.674 RED | |

- **The band holds at DPR 2 and 3 in both engines.** This is the strongest evidence this pass that the key does what it says: the 812×375 board that reds at 1× (1.349, the lane's row 5) reads 1.378/1.422 at 2× and 1.370/1.422 at 3×. Row 5's red is a 1×-only red.
- The margin at 3× is thin in chromium: 812×375 @3 reads 1.370, 0.020 above the floor. This is a critic reading at one payload and one cell. It has no product row.

## 7 · The union's own born-RED, the deep re-clip, π and the look

The control on :4254 was swapped to the union WITHOUT GRAPHITE (`acde977b`, `index-BRpbF3dGtZoj.js`, critic-built). The HEAD control was killed by its recorded PID after a cwd check.

| Row | chromium | webkit | exit cr / wk (load) |
|---|---|---|---|
| row 1 vs the union control, five rigs: tree | 1.377 / 1.392 / 1.386 / 1.430 / 1.377 | 1.426 / 1.371 / 1.381 / 1.434 / 1.426 | 0 / 0 (33.9 / 27.5) |
| the same: union control (born-RED) | 0.280 / 0.260 / 0.269 / 0.298 / 0.280 | 0.283 / **0.114** / 0.270 / 0.298 / 0.283 | RED every rig |
| deep re-clip `.grid-ink,svg.hand-drawn-grid{clip-path:inset(1.2% 0 1.2% 0)}`, desk / phone / tablet | 2.307 / 2.317 / 2.786 | 2.992 / 2.718 / 2.781 | **1 / 1** (37.3 / 29.1) |

- The deep re-clip reproduces the lane's re-sited plant to the thousandth, so the lane's plant was this inset. **The webkit exit the lane did not file is 1.** Between 0.4 % (no red; webkit desk +0.016) and 1.2 % (×2) the gate reds somewhere, and the critic did not read where. A frame clipped to half its stroke has no named plant.
- **π on the union (`pi.crit.ts`, critic's probe):** the union + delta against the union control, same payload, PRM reduce, light, a tree-vs-tree noise floor in the same run.
  - At rest: **0 px differ** (noise 0) at desk (440,896 px) and phone (154,449 px), both engines. The 81 hidden retrace paths and `data-raster` paint nothing.
  - Focused: 3,659 / 3,658 px differ at desk, 1,204 / 1,229 at the phone (cr / wk). At desk the diff's bounding box is 61×61 px, inside the focused cell, and nothing outside it moves.
  - `data-raster="small"` sits on the 1× phone board and is absent at desk, as the key says.
  - **π against `74a2b5d9` (the law's control) was not read:** the union itself moves most of the page off `74a2b5d9`, so that read is the WAVE's, not GRAPHITE's. The lane's R7 gap 4 stays open as written.
- **The look** (chromium phone 1×, the focused centre cell, a given 9; crops in the critic's scratch, not banked). The band paints as one solid graphite square inset in the cell, at the weight of the 3×3 box rules. It does not touch the grid lines. The glyph's ascender sits about 1–2 px from the ring's inner edge. **Ring-to-glyph clearance has no row**, and at the phone the band crowds a tall digit. This is one frame, one engine, a gestalt read. Gap.
- **AA from painted bytes:** the stamp's own `ink 10.0 / paper 252.9` luma (the board's darkest 0.5 %, the ring included when focused) puts the ring's core at about 19:1 on its paper in light (luma treated as sRGB grey: an estimate, not a WCAG reading). Dark, contrast-more, forced colours and the AA of the ring's anti-aliased edge were not read by the critic.

## 8 · The number, the gaps, the verdict

**Verdict: ADVANCE at 79** (71 held by law → 76 at the v8 fold on the lane's read → **79 on this critic's read**). CHAIR §2's row 1 is MET and re-derived: the on-WAVE delta exists, `--check`s 0 on `acb9c08e` and on `acde977b`, and the band reads inside [1.35, 1.45] at all five rigs in both engines on the union (exit 0/0), with both controls RED in the same runs. No BANK.

Why not higher. Each gap below holds points.

1. **G2 is OPEN for its class (registry-v8 §2.12).** X6 (no left or right side) is blind in both engines, re-derived (0/0). A shallow re-clip moves webkit desk to 1.442 unseen. No plant sits at the half-clip. The four-band graft through `edge-bands.mjs` is untaken a fourth pass.
2. **R6 not landed: there is no product band row.** The only gate is a set of docs-resident copies (`bandc` `f256121a`, `bandw` `8bab180f`, `band-lib` `48fe6062`, `band-stat` `d2e2d620`). The registry sentence rests on a scratch instrument, and the checklist's "instrument imported from docs/" applies to the gate itself.
3. **16×16 RED** (lane: phone 1.622–1.653 both engines; webkit 1024×768 1.453; not re-read by the critic), cause unread. **Chromium 450 dpx 1.457** and **812×375 @1× 1.349** RED. 366–379 dpx unread. `SMALL_RASTER_DPX = 375` is a fitted constant (LAWS P8 §E) whose cliff is pinned by no product row. The unit row pins the predicate, not the ratio.
4. **R7 mostly unrun:**
   - π vs `74a2b5d9`, the filter census, goldens, G1/G1b, G4, G10, print, forced colours, `check-property-block --dist/--served`, AA in dark / contrast-more / painted edge.
   - The critic closed two pieces only: π against the union control (rest 0 px, focused confined to the cell) and the served-CSS orphan-utility list (one class, no utility).
5. **R8:** the OUTSIDE gauge (B-TALLY-16) is not built on the union. The tally is not on the union at all. The wash plants are filed for SIX, and both gates are blind to them (the lane's reading, not re-run).
6. **One payload, one game.** Every band read is sudoku `mintBoard(3, 30)`. Futoshiki, killer (cage dashes near the cell edge), kenken and thermo share `DigitCell`'s ring and are unread. Ring-to-glyph clearance is unread, and the phone frame shows the band crowding a tall digit.
7. **Readings on edited bytes:** the lane's sweep, matrix and plants ran on `D9D8GeClGw57` before the key move. The critic re-read on the final bytes row 1, the plants (thin, thick, pointer, X6, re-clips), the thresholds and DPR 2/3. The regime matrix (dark, motion, contrast) and the sweep were not re-read on final bytes.
8. **Hygiene:**
   - Two stale product comments (§3.4).
   - A non-reactive DPR read (§3.1).
   - Copied literals `1000, 42` (§3.3).
   - Span counts disagree (§3.6).
   - The webkit re-clip exit was missing from the lane's file (§3.7; the critic read it as 1).
   - The write-tree is not reproduced by the critic's index method (§0).
9. **Writes into others' files** (declared by the lane): LADDER's `check-motion-bands.mjs` MOVED row, on a key truncated at 80 chars (§3.8, LADDER's class); §6's `--ring-ink` line.

What earned the move from 76: the critic re-derived row 1 (and its born-RED against both controls); rows 2 and 3 with their born-REDs; the raster unit row's clause battery; the band plants; both bounds' threshold sabotage; an instrument clause sabotage (min→max reds the fused side); π at rest 0 against the union control; and a new result, **the band holds at DPR 2 and 3 on both phones in both engines** (1.370–1.422), which no lane had read and which is what a real phone paints.

## 9 · Incidents (the critic's own)

- **A misread exit, caught.** The first build script echoed `exit $?` after a `$(basename …)` substitution inside the same string, so every printed exit was the substitution's 0. The `apply --check` of the on-WAVE delta on s13-s7-s3 printed "exit 0" beside its own errors. The checks were re-run with the exit written bare (§0 is the re-run). Nothing was cited from the first script's exits.
- **Two shell `&!` launches** (the row-1 driver and the phase-2 driver) instead of `run_in_background`. Both wrote their own logs and exit files, and both completed.
- **One response carried two tool calls** (the two server launches).
- **One vacuous plant of my own:** the 0.4 % re-clip did not reach the frame in chromium. It is declared as a non-red, with its webkit shift, and the 1.2 % re-clip was added.
- **The temporary-index write-trees** do not match the lane's (§0). Unresolved.
- No git on main or the control tree. Every archive came through the prototype worktree's gitdir, with `GIT_CEILING_DIRECTORIES` at the scratch dir. No commit, stash or `rm` (discards moved to `trash/`). The tally copy and `boardRaster.ts.orig` were moved to trash, and the scratch tree's `boardRaster.ts` was restored (`cmp` 0).
- Servers: :4235 (PID 44259, cwd `crit-ACC-GRAPHITE/unionG/web/frontend`), :4254 HEAD control (PID 44323, cwd `w7-control/web/frontend`), then :4254 union control (PID 95912, cwd `crit-ACC-GRAPHITE/union/web/frontend`). Each was killed by its recorded PID after a cwd check. Both ports were free at return.
- Box: 1-minute load 24.2–60.0 at every browser row's open (each log's START/END line). No row opened above 120.

## 10 · Replay

Scratch `.claude/t9-scratch/work/pass9/crit-ACC-GRAPHITE/`:
- `build.sh` + `verify.sh`: the archives and the bare-exit checks.
- `vbuild.sh`: builds with a private cacheDir via `.critg.vite.mts`, a scratch config that is never banked.
- `rig/` holds:
  - `spec/` = `bandc.crit.ts`, `bandw.crit.ts`, `bandwMAX.crit.ts` (the min→max sabotage), `band-lib.ts`, `band-stat.mjs`, `pi.crit.ts`;
  - `e2e/wire.ts` and `src/lib/base64url.ts` from the union tree;
  - the lane's `pw.config.ts`.
- `run.sh <name> <project> <spec> ENV…` writes `logs/<name>-<project>.{log,exit}`.
- `batt2.sh`, `batt3.sh`, `phase2.sh`: the batteries. `plants/*.css` are the plant files (`od -c` verified). `gates*.sh` and `rastersab.sh` are the browserless rows. `sum.sh` summarises.
