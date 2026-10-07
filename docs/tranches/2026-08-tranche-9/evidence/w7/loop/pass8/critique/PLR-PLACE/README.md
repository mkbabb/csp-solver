# PASS-8 CRITIQUE · PLR-PLACE · The placed lobby (§11)

Adversarial. I didn't write the charter or the prototype. Base and π control `74a2b5d9`. Work tree
`.claude/worktrees/w7-p4-PLR-PLACE` (uncommitted), read only through a temporary index (`GIT_INDEX_FILE`). Every
battery ran on MY byte copy of the tree (`74a2b5d9` + `pass7.diff` + `homes.diff` + `pass8.delta.diff`, 37/37 files
`cmp`-identical to the tree), served by vite dev on `:4243`; the HEAD control dist on `:4251` (served
`index-CubiZsMVSwTc.js`, read off its HTML). Box load 1-min **36–49** throughout.

**CONVERGENCE: 88 (pass 7: 87). VERDICT: ADVANCE.**

Every number I re-derived reproduces to the hundredth: the widest-board table, the kill cell, the list's laps, the
chart's red on the leader's rows, and `:610`'s red under the list. The bank re-cuts to the same tree and sha1. The
pass-7 plant reds both re-cut rows. The outside band is cured on the bottom edge in Chromium, and arm (a) now shuts.

What holds the number is the cure's own gate. **The re-cut row 14 has no clause-sabotage battery (LAWS P7 §F(ii)),
and when I ran one, four of `outside()`'s five clauses deleted GREEN.** One of the four is a live band: in Chromium,
a touch 1–3 px to the RIGHT of the sheet, over the board, reaches nothing once `e.clientX > r.right` is struck (my
side row, 3/3 taps). No landed row reads that edge. Also, the tree is red in its own estate under EVERY arm, not
only the chart.

## 0 · Gaps first (exact, open)

1. **THE CURE'S GATE CANNOT FAIL ON FOUR OF ITS FIVE CLAUSES** (LAWS P7 §F(ii), registry-v7 §2.5). Rows 12 and 14,
   final bytes `3c46f26a881b`, clauses deleted one at a time:

   | plant | row 12 cr · wk | row 14 cr · wk | critic's side row (right edge, 9×9 390×664) cr · wk |
   |---|---|---|---|
   | none | ✓ · ✓ | ✓ · ✓ | out 1/2/3/6 px `cell` · same |
   | NO_BOTTOM (`e.clientY > r.bottom`) | ✓ · ✓ | **✘** · ✓ | — |
   | **NO_RIGHT** (`e.clientX > r.right`) | ✓ · ✓ | **✓ · ✓** | **out 1/2/3 px `none`**, 6 px `cell` · `cell` ×4 |
   | NO_LEFT | ✓ · ✓ | ✓ · ✓ | the left edge is the viewport's (L = 0): unreachable |
   | NO_TOP | ✓ · ✓ | ✓ · ✓ | the top edge (T = 44) sits above the board (131.73): unreachable here |
   | NO_TOUCHKEY (`e.pointerType === "touch" &&`) | ✓ · ✓ | ✓ · ✓ | ✓ (a mouse never aims off its point) |

   The right edge is a real band at every lapping phone cell: the sheet is 256 wide at L = 0, and the board runs to
   376. The cure covers it. The rows don't, so a regression there ships green. Owed: a landed row on the side edge,
   with NO_RIGHT as its negative. LEFT/TOP/TOUCHKEY each need a plant or a stated reason they can't be reached.
2. **THE TREE'S ESTATE IS RED UNDER EVERY ARM.** Reproduced, both engines:
   - Chart (ships): `:543` 390×800 lapped **7** vs 0; `:610` 700×800 coarse **12** vs 4.
   - List (`PLACE_CHART = false`): `:610` 1056×768 coarse **1 row / 3 cells** vs 4 / 6.

   No arm the owner can fire in B-CHART gives a green `player-mark.spec.ts` on this tree. The 1056 red is SELF's
   fitted `UNDER_BOARD = 0.7` (0.672 on SELF's sheet, 0.028 from the flip) crossing on this lane's sheet. This lane
   took that key by sha, and the key doesn't transfer. The fold can't land the file red. Either this lane prices
   the cell in its own row set, or SELF re-keys it. As merged, it's neither.
3. **THE KILL CONDITION STANDS and is the owner's (U-10).** 9×9 390×664: chart 94.64 / 94.95 over 21 against the
   list's 17.53 / 17.84 over 7. 16×16 at the same cell: 169.30 / 169.61 over **88** against 17.53 / 17.84 over 11.
   Numbers only, no frame (0 B spent).
4. **Row 14's WebKit column can't fail by construction** (lane gap 6): every plant, the pass-7 one included, is
   GREEN in WebKit. Real iOS aim is unwitnessed (RUNSHEET M19).
5. **Row 14 reads one cell and one edge** (9×9 390×844, bottom). The 16×16 band (79.30 px lap) and the side edge
   (gap 1) are unread by any landed row.
6. **`PlayerLobby.vue:57–62`, re-corrected, is still arm-(b)-only.** "A TOUCH sends no click here: the mark prevents
   its `touchend`" is false under arm (a), the arm this pass repaired (`onSheetTouchEnd` prevents only when
   `TAP_IS_A_LOOK`), and false for an outside touch in either arm. Comment only.
7. **Painted AA of the names is RED in light** on the tree (2.972 / 3.009) and on the control (2.713 / 2.443). This is
   T9-R8, cited. Not re-derived by me.
8. **Check 8** is 276 / 214 and 274 / 212, the fold's. `pass8.diff` refuses on `s10` at 4 files (informational;
   §11 is in no union). Not re-derived by me.
9. **SELF's pass-8 critic gaps ride here by sha**: the unplanted forgiveness clauses, B3 at 1.5, the fitted key's
   cliff, 1366×768 and 1194×834 unpriced, the `!short` flip, and the 124.45 rounding. Gap 2 is where one lands on
   this tree.

## 1 · Re-derived (both engines, final bytes)

| what | lane | critic | verdict |
|---|---|---|---|
| bank tree / sha1 / bytes / shortstat | `6535a918` · `a9e30f5b` · 553,377 · 37 +11,052/−407 | same, re-cut through my own temporary index | ✓ |
| `apply --check` on a fresh `74a2b5d9` | 0 | 0 | ✓ |
| delta over `74a2b5d9` + pass7 + homes | `--check` 0, 6 files | 0; the replay is 37/37 `cmp`-identical to the tree | ✓ |
| SELF merge | spec 1,001 + 142 = 1,143; PlayerMark = SELF's key inside this lane's yield | my apply of SELF's `pass8.diff`: PlayerMark `d41d87dd`, spec `9695e530` (1,141). The spec differs by the one PLACE row; PlayerMark differs by PLACE's additions only | ✓ |
| 9×9 390×664 chart | 182.38 · 94.64 / 94.95 · 21 | 182.38 · **94.64 / 94.95 · 21** | ✓ |
| 16×16 390×664 chart | 257.03 · 169.30 / 169.61 · 88 | 257.03 · **169.30 / 169.61 · 88** | ✓ |
| 16×16 390×844 chart | 79.30 / 79.61 · 44 | **79.30 / 79.61 · 44** | ✓ |
| 16×16 430×932 chart | 55.30 / 55.61 · 30 | **55.30 / 55.61 · 30** | ✓ |
| list 9×9 / 16×16 390×664; 16×16 430×932 | 105.27 · 7 / 11; 0 | 105.27 · **17.53 / 17.84 · 7 / 11**; **0** | ✓ |
| rows 12 + 14 clean | GREEN ×2 | GREEN ×2 | ✓ |
| **pass-7 plant first** (TOUCHEND: the `touchend` handler struck) | — | row 12 ✘ (1/2/3 px reach `Row 1, column 2`), row 14 ✘ (`in 1–3px: cell`) in chromium; ✓ in WebKit | the re-cut rows red on pass 7's negative |
| NO_BOTTOM ≈ lane's BAND_EDGE | row 14 ✘ chromium | row 14 ✘ chromium (below 1–3 `none`) | ✓ |
| `:543` / `:610` under chart | red ×2 | 7 vs 0 / 12 vs 4 at 700×800, ×2 | ✓ |
| `:610` under list | red ×2 at 1056×768 | 1/3 vs 4/6, ×2 | ✓ (gap 2) |

My reader (`instruments/c8-lap.spec.ts`) is my own code: rect overlap on both axes, lap = sheet bottom − grid top.
It imports no lane file and no instrument; the settle is two equal reads 200 ms apart after 700 ms. Ids are pinned
as the lane's (B `p-0000000b0b0b`, A seeded) so a slug can't wrap. The unpinned side row shows the difference: a
wrapped row makes the 9×9 sheet 247.17 tall, +20.79.

## 2 · Constraints

- **Instruments by product path**: `e2e/player-mark.spec.ts` → `./lib/edge-bands.mjs`. `docs/` imports in `e2e/`
  and `scripts/`: **0** (grep). The lane's `p8-*.spec.ts` imported `../e2e/lib/{rest-probes,glyph-pop}.mjs` from a
  scratch dir. None is banked as product.
- **M16**: the pass-8 product delta adds no user-visible string. Every added line is code or a comment (read whole).
- **filterBudget 9 / @property**: the delta touches no CSS and no filter. The lane's census is 12/12 on both dists,
  and it cites 43 vs 42 served `@property` (`--head-rule`, SELF's). Not re-run by me.
- **π**: not re-run by me. The lane reports 62 in every solo read, with 0 outside the claimed set in a room.
- **Frames**: none banked; 0 B of the 151,826 B headroom spent. Pass-7 crop 1 stands.

## 3 · The charter's rows as I read them

| # | row | critic |
|---|---|---|
| 1 | widest board restated | **closed**: the table reproduces on four cells, both engines, and the comments name the board size |
| 2 | leader rows under chart | **named, not cured**. Worse than stated: the list reds `:610` too (gap 2) |
| 3 | kill condition | the owner's |
| 4 | outside band | **bottom edge closed in Chromium**. The right edge is cured but unguarded (gap 1). WebKit can't fail (gap 4) |
| 4b | arm (a) dismissal | closed on the lane's SEAM_A / ARMA_TE plants (not re-run by me) |
| 5 | SELF's cures by sha, area primitive handed | closed (merge verified) |
| 6 | T9-R8 | cited |
| 7 | unrun rows | the lane's figures, not re-derived by me except the leader rows |
| 8 | INTAKE-22 row 48 | closed by number (lane's s10 read, +20.99 / +21.00; not re-derived) |

## 4 · Why 88

The lane did the charter's work, and every number I touched reproduces. One point for the widest board read whole
and a real cure with the pass-7 negative reding it. It isn't more because the cure's gate misses a live edge: the
§2.5 battery reds only one of five clauses, and it wasn't run by the lane. And the tree ships a spec file red under
every arm the owner could pick. Both are lane-closable next pass without the owner.

## 5 · Incidents (critic)

1. **K1 · a plant restore failed and one reading is VOID.** My `plant.py` TOUCHEND used an empty replacement, so
   `restore` asserted (count of `''`). NO_BOTTOM then ran on TOUCHEND+NO_BOTTOM (sha `23cffcf1824b`). I stopped the
   battery, restored the copy's PlayerMark from the tree (`3c46f26a881b`) and fixed the four empty replacements.
   I added a restore guard that aborts on any sha other than `3c46f26a881b`, and re-ran from NO_BOTTOM. The void
   block is marked in `readings/band.txt`. TOUCHEND's own verdict ran on a correctly applied plant
   (`ecb5420be7ed`) and stands.
2. **K2 · a `git status` with the lane's REAL index** in the lane's tree at open, before I switched to
   `GIT_INDEX_FILE`. It was a read, but it may have refreshed the index's stat cache. No content moved.
3. **K3 · my first lap run found no tests** (ESM `import.meta` without `"type":"module"`). It produced no readings,
   and the log was moved aside as `lap-run0-noload.txt` in scratch.
4. **K4 · my first side run rode inside the lap battery** (its testMatch caught `c8-side`). It was read-only on the
   same unplanted and LIST-planted copy, and it is labelled by arm in `lap.txt`.
5. Servers: `:4243` PID 21001 (cwd = my copy) and `:4251` PID 21092 (cwd = `w7-control/web/frontend`, preview
   only, no git). Both were killed by PID after a cwd check, and both ports are free. No `rm`; a moved-aside
   `csp-solver` extraction sits in `<scratchpad>/trash-plrplace8crit-1/`. Nothing was written to the lane's tree or
   the control.

## 6 · Replay

`instruments/`: `lap.sh` (chart, then LIST plant), `band.sh` (after the fix: the clean and TOUCHEND blocks ran in
run 1, per `band.txt`), `leader.sh`, `plant.py` (ast-checked), `c8-lap.spec.ts`, `c8-side.spec.ts`,
`pw.crit.config.ts`, and `vite.crit.mts` (private cacheDir; `fs.allow` adds the real wasm pkg). The copy is `git
archive 74a2b5d9 web/frontend` + `pass7/prototype/PLR-PLACE/pass7.diff` + `pass8/instruments/homes.diff` +
`pass8/prototype/PLR-PLACE/pass8.delta.diff`, with `csp-solver` symlinked to the lane tree's. Readings are in
`readings/{lap,band,leader}.txt`, each block stamped with its sha1 set and load.
