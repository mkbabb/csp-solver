# Pass 7 · MRK-LIVE · the live mark (prototype record)

Work tree `.claude/worktrees/wf_f72f3b5a-83a-35` (base `74a2b5d9`), uncommitted, advanced IN PLACE on the
chair's bank `pass6/prototype/MRK-LIVE/pass6.diff`. An earlier pass-7 attempt on this tree
(`wf_e1efa465-923`) died of a network outage after ~25 minutes; its edits were still in the tree. Every
number below was re-measured by this run; nothing the dead attempt printed is cited. Control = `74a2b5d9`:
the chair's `w7-control` dist (`index-CubiZsMVSwTc.js`, verified by hash on :4239) for dist rows, a dev
server of that tree (:4240, private cacheDir in the scratchpad, no git in the control) for spec rows, and
a `git archive 74a2b5d9` for the lint battery. The lane's dist is built outside the tree, rebuilt after the
last edit: `index-B72YBnilT3zJ.js` / `index-CmuiKvTTB16E.css`. The pass-7 number is the critic's.

**Box load.** 1-min load 29–368 over the run (a foreign workload; 392 node/chrome processes at the start).
Nothing below is a timing verdict; every rate-free row is a painted or DOM reading.

## 0 · Gaps first (open, each with the number that holds it)

1. **HEAD's own frame cell still has stations under 3:1, and the shipped default keeps them.** The
   16×16 frame cell (cell 0) reads **44/240 under 3:1 chromium, 24/240 webkit** on the lane's HEAD default,
   the same count as the control (`74a2b5d9` dist). The 9×9 frame corner reads **66/240** on both. The
   size-keyed arm (`sized`) cures 9×9 (0/240) and holds 16×16 at 44/24. **No arm clears the 16×16 frame
   cell whole.** The ring's side on the frame rule is the cause, and only an arm that moves the ring off
   the rule at 16×16 cures it. None built here does.
2. **The deck card's ring is ADMITTED, not cured.** G-LIVE-23 reads its right and bottom sides at
   **2.322 / 1.709 light, 2.964 / 2.226 dark** (webkit; chromium 2.327 / 1.729 and 2.964 / 2.261): the card's
   own drawn sketch lies over the ring on two sides. The row admits those two sides at a floor of 1.5 with
   the reason printed and a STALE clause. The cure is MRK-ABS's D0 (the ring at offset 0), PROPOSED to the
   deck owners (FACE/TAPE) and the chair, not built here (row 8).
3. **INTAKE-22 row 44 stays OPEN, on lane and control alike.** The `.info-btn` 'i' at rest, DPR 2, reads
   **2.510 (chromium light), 2.872 (webkit light), 4.368 (webkit dark)**, all under 4.5; only chromium dark
   clears (4.697). The intake's '4.66 / 7.68 at rest' does not reproduce on either tree: those two figures
   equal the chair's "Size" heading reading (4.659 / 7.681, `pass7/instruments/README.md` §4). The glyph
   is not the ring's; its ink is the control panel's (§10) or T9-R8's rung. Open is at 9.42–17.45, green.
4. **The file plants ran on the rows that could see them, not the whole file.** X5 on G-LIVE-19; X4 and
   CLIP0 on G-LIVE-16 + G-LIVE-23; X4b on G-LIVE-14 + G-LIVE-16 + G-LIVE-23 (§2). The whole file ran
   clean at the final sha1, 20/20.
5. **X4b also reds G-LIVE-16, for a plant interaction, not for faintness.** `.cell-ghost.is-active
   { opacity: 0.2 !important }` beats G-LIVE-16's own in-run X2 plant (opacity 0, not `!important`), so
   G-LIVE-16's self-check ("X2 … turns input.cell-native-input RED") fails. G-LIVE-16 still does not read
   visibility; G-LIVE-23 does. G-LIVE-14 stays GREEN under X4b (it reads the rule ladder, not the painted
   element): a tier-2 ghost at 0.2 under a 0.65 hover sketch passes the rank row.
6. **The undefined-token census reds this tree +2 over the control**, unchanged from pass 6:
   `gameCell.css:300/302`, bare `--color-peer-cursor-ink` (lane exit 1: 2 bare + 1 inherited STALE; control
   exit 1: 0 bare + the same STALE). The PROPOSED `INHERITED` row
   (`pass6/prototype/MRK-LIVE/instruments/undefined-token-census.inherited-row.PROPOSED.diff`) is the
   chair's A.3 row. Not re-landed.
7. **The dark filter census reds both dists identically**: 4 failed / 8 passed, lane `index-B72YBnilT3zJ.js`
   and control `index-CubiZsMVSwTc.js`, every failure `svg.crayon-heart.idle ⟨saturate(0.85)⟩`. The deletion
   is the chair's ratified fold pick (pass7/CHAIR-RULINGS §2). Light 12/12 on both.
8. **G-LIVE-4's at-least-one-reversal clause is checked only by the second engine of a run.** Each engine
   records its deal; the first engine to finish has no sibling record and prints "unchecked". In both final
   runs chromium reversed in place and webkit cut; webkit checked chromium's record.
9. **G-LIVE-17's covering is still a per-room reading.** The deal is pinned now (`mintSudoku(3)`), but the
   author's slug is minted per room, so the covering moves: 6–8 cells / 3,866–4,392 px² across this pass's
   runs. It is printed, never asserted (T9-R7, the chair's).
10. **The instruments import from the loop's record.** G-LIVE-19 and G-LIVE-23 import the chair's
    `pass7/instruments/{shape-census,edge-bands}.mjs` by path (main tree, or `PASS7_INSTRUMENTS`). The W7
    fold must vendor them beside `e2e/`, or CI cannot run these two rows. A missing copy throws; it never
    skips.
11. **GRAPHITE's retrace is still not carried**; `RING_ARM = "graphite"` is not framable as the owner's
    arm (the comment now says so, and says the flip deletes nothing). Tape arm B is the owner's, not built.
12. **Not re-run this pass:** the 60/120 Hz reading, R2's WebKit subject (WebKit deals no reversal), and
    the 'over its own fill' worst column (median only, pass 6).

## 1 · The charter rows

| # | row | status | numbers (lane · control `74a2b5d9`) |
|---|---|---|---|
| 1 | `RING_GEOMETRY` → HEAD default; graft behind the const; T9-B29 restated; G-LIVE-22's witness demoted | **CLOSED** | `RING_GEOMETRY.arm = "head"` ships; `"graft"` and `"sized"` build from the same const. Resident `d` identical to HEAD's recipe **256/81/16** (G-LIVE-22, both engines); the ring π reads **d differs 0** at rest and hover, 9×9 and 16×16, both engines (§4). The witness prints and asserts nothing; the control is GREEN on G-LIVE-22 (a return to HEAD reds no landed gate). `gridPaths.test.ts` pins HEAD's recipe spelled from `74a2b5d9` at 4×4/9×9/16×16. The false "−0.501 px is HEAD's" is struck from the comment; the figure table is HEAD +1.958 · graft +1.639 (16×16), +5.382 · +6.880 (9×9), +9.826 · +14.141 (4×4), held to the DOM within 0.01 px. |
| 2 | the size-keyed inset: ≤ 44 at 16×16 AND 0 at 9×9 | **CLOSED as an arm** (`arm: "sized"`, `sizedFrom: 16`) | Whole ring, cell 0, dropped counted: **16×16 44 cr / 24 wk; 9×9 0; 4×4 0**, both themes, two photographs equal. Negative in the same battery: `.cell-ghost { clip-path: inset(50%) }` → **240/240** (chromium 9×9 light 234/240 with 180 unpainted: six stations still read ≥ 3 under the clip, cause unread). |
| 3 | X4/X4b on all four bands, per-band core-median floor | **CLOSED** — G-LIVE-23 | Chrome ring, 11 stop keys, every band ≥ 3 except the admitted deck card (gap 2); tier 2 on 9×9 cell 40 **3.972/3.92 light, 3.989 dark chromium; 3.965 / 3.997 webkit**. In-run plants, each RED on the band it hits (§3). File plants X4, X4b, CLIP0 red G-LIVE-23 in both engines (§2). Control: RED (no drawn ring: "every side of every ring on the light walk"). |
| 4 | the dowry: chrome floor ×10 keys; forced-colours walk to gallery + guard; G-ABS-5 figure clause; f = 1.00 at HEAD | **CLOSED** | Chrome floor: **11 keys reached** both themes both engines (8 home stops + deck scrollport + staging face + armed guard), each read on four bands. Forced colours (G-LIVE-21): deck card, staging face (new) and guard verb each outline in the engine's resolved Highlight (chromium `rgba(5, 0, 73, 0.8)`, webkit `rgba(128, 188, 254, 0.6)`), the guard's painted **260 / 256 px**; in-run negative CanvasText → not-Highlight. Control RED: "the active card's outline is the system Highlight". Figure clause (G-LIVE-22): every numeral in the comment is a DOM-held table figure or a verified phrase; six numeral plants, a falsified table and a deleted row each red it in-run. The f = 1.00 witness at HEAD's recipe is HEAD's own clearance: **+1.958 px** (stroke 10) / **+2.691 px** (stroke 7) at 16×16. |
| 5 | INTAKE-22 row 44 | **OPEN** (gap 3) | Rest at 2×: 2.510 / 4.697 chromium, 2.872 / 4.368 webkit (light / dark), population 82–84 px; open 9.420 / 10.183, 17.445 / 14.309. Lane = control on every read. |
| 6 | T9-R8/T9-R7 re-point; `ledger-diff --verify-cites` 0 | **CLOSED** | The spec's cite reads 'ledger T9-R7 (the loop's pass-5 label, re-pointed by pass6/RE-POINT.md)'; no T9-R5/T9-R6 left under `src/`, `e2e/`, `scripts/`. `node scripts/ledger-diff.mjs --require-ledger --assert-state --verify-cites --self-test`: **exit 0** on this tree. |
| 7 | the peer-cursor ring coupling | **NOT DECLARED**: the graft does not ship | HEAD is the default. The peer-cursor ring is the same `.cell-ghost-path` (`gameCell.css:295–302`), so if the owner fires `graft` or `sized` at T9-B29, every peer ring on 9×9/4×4 (and on 16×16 under `graft`) redraws with it. The coupling is declared then, to PLR-COUNT/PLR-PLACE. |
| 8 | ABS's D0 and the law-39 tab deletion | **PROPOSED, cited, not built** | D0 (the deck ring at offset 0; `pass6/prototype/MRK-ABS/`) goes to the deck owners (CTRL-FACE, CTRL-TAPE) and the chair: it is the cure for gap 2. The law-39 tab deletion is the chair's row (pass4/CHAIR-RULINGS §1.3). |

### What else moved this pass (claimed, declared)

- **The chrome ring is clipped to the page's width** (`FocusRing.vue`). A stop flush with the viewport
  edge drew a side the reader could not see: the attribution trigger's ring started at **x −3** and the
  toggle's ended at **1,282 of 1,280**. Now they read **0 → 78.53** and **1,070 → 1,280**, both engines. That
  is what lets G-LIVE-23 read all four sides of those two stops. G-LIVE-4's framing error reads the
  clipped left the same way.
- **G-LIVE-19 reads every site** through the chair's shape-census library: every `<style>`, every
  stylesheet under `src/` and `public/`, `index.html`, and every template and script. In-run plants X3
  (`<style>`), X5 (template `style=`), X5b (`:style` string), X5c (script `setProperty`) each caught.
- **G-LIVE-4 no longer pins §13's dock mechanics**: the deal each engine makes is printed, and the ring's
  per-frame framing bound is the assertion (gap 8).
- **G-LIVE-17's deal is pinned** (gap 9).
- `index.css`'s focus-ink comment no longer restates painted figures; it points at G-LIVE-23 and T9-B29.

## 2 · Break tests (final sha1s; each file restored sha1-equal; the plant copy served on :4245)

Files at the final battery: `focus-ring.spec.ts 4dd6ac5d`, `FocusRing.vue 8f9eb6b7`, `gameCell.css d1c60786`,
`AnswerKeyLaminate.vue e54be0c0`, `pencilConfig.ts ea683d12`, `gridPaths.ts 9f61648b`. The plants ran on a
scratch copy of the tree, which was restored from the tree after each plant (sha1 printed before and after).

| plant (file) | rows run | reds | stays green |
|---|---|---|---|
| X5 `<i style="animation-duration: var(--motion-note, 280ms)">` in the laminate's template | G-LIVE-19 | G-LIVE-19 ×2: "no var(…, fallback) … at any source site" | — |
| X4 `.focus-ring { opacity: 0.15 }` (FocusRing.vue) | G-LIVE-16, G-LIVE-23 | G-LIVE-23 ×2: "every side of every ring on the light walk reads 3:1 or better" | G-LIVE-16 ×2 (existence) |
| X4b `.cell-ghost.is-active { opacity: 0.2 !important }` (gameCell.css) | G-LIVE-14, -16, -23 | G-LIVE-23 ×2: "… on the light walk reads 3:1 or better"; G-LIVE-16 ×2 by plant interaction (gap 5) | G-LIVE-14 ×2 (gap 5) |
| CLIP0 `.focus-ring { clip-path: inset(50%) }` (FocusRing.vue) | G-LIVE-16, -23 | G-LIVE-16 ×2: "every judged estate stop PAINTS an indicator"; G-LIVE-23 ×2: "… on the light walk …" | — |

## 3 · The four-band X4 table (G-LIVE-23, final run; core median / stations per band)

| subject | chromium light | chromium dark | webkit light | webkit dark |
|---|---|---|---|---|
| clean chrome stop (`button.tuner-toggle`) | 4.188 ×4 | 4.379 ×4 | 4.188 ×4 | 4.379 ×4 |
| **X4** ring at 0.15 | **1.199** ×4 | — | **1.196** ×4 | — |
| **FADE15** ink at 15 % | **1.054** ×4 | — | **1.054** ×4 | — |
| **X6** bottom clipped | top/left/right 4.188, **bottom 1.00 (32/32 dropped)** | — | same | — |
| **CLIP0** painted to zero | **1.00 ×4, all dropped** | — | same | — |
| clean tier 2, 9×9 cell 40 | 3.972 · 3.972 · 3.972 · 3.92 | 3.989 ×4 | 3.965 ×4 | 3.997 ×4 |
| **X4b** tier 2 at 0.2 | **1.278** ×4 | — | **1.269–1.278** | — |
| **X6** tier 2 bottom clipped | bottom **1.077** | — | bottom **1.097** | — |
| lowest non-admitted chrome band | 3.716 (guard, bottom, dark) | | 3.505 (guard, bottom, dark) | |

The plants run in light; each must red its stop, else the row fails ("this row cannot see a ring").

## 4 · T9-B29, the ring's geometry (the owner's; nothing fires before the eye)

One payload per board (`mintSudoku(n)`), cell 0 (the frame crossing), focused by keyboard, PRM, 1280×800
fine, 240 stations, dropped counted, two photographs equal in every row.

| arm | MA-N stroke 10 16×16 · 9×9 · 4×4 | whole ring under 3:1, 16×16 (cr / wk) | 9×9 corner | 4×4 | 16×16 worst (cr L/D) | resident wander |
|---|---|---|---|---|---|---|
| **HEAD** (default; = `74a2b5d9`) | **+1.958 · +5.382 · +9.826** | **44 / 24** | **66** | 0 | 2.812 / 2.404 | 0.375 / 0.666 / 1.494 u (pass-6 critic) |
| graft (inset 0.86, 5.4 u) | +1.639 · +6.880 · +14.141 | 78 / 78 | 0 | 0 | 2.812 / 2.404 | 5.40 u every board (pass-6 critic) |
| sized (graft below 16×16) | +1.958 · +6.880 · +14.141 | 44 / 24 | 0 | 0 | 2.812 / 2.404 | HEAD's at 16×16, the graft's below |
| control dist `74a2b5d9` | +1.958 · +5.382 · +9.826 | 44 / 24 | 66 | 0 | 2.69 / 2.309 | 0.375 / 0.666 / 1.494 u |

- **The default's losses, named (LAWS P6 §G):** HEAD loses the 9×9 corner to `sized` and `graft` (66 vs 0)
  and MA-N headroom below 16×16 to both (+5.382 vs +6.880; +9.826 vs +14.141). It loses nothing at 16×16,
  and it does not lose to the control on any statistic here (its worst is higher: the 0.95 ink, T9-B8 arm A).
- **`sized`'s cost:** below 16×16 it redraws every ring tier with the graft's wander (the critic's 9×9
  cell-40 pair: hover 1,231–1,244 px, invalid 1,677–1,694 px per cell) and carries the peer-cursor coupling
  (row 7). At 16×16 it is HEAD byte for byte.
- **`graft`'s cost:** 16×16 78/78 against 44/24, MA-N −0.319 px, the wander ×14.4.
- **The frames** (one payload, one variable: the ring's `d`; every computed paint property equal): HEAD |
  graft on 16×16 cell 0 focused, light and dark (below). `sized` differs from HEAD only below 16×16 and from
  the graft only at 16×16, so it is framed by these two pairs plus the critic's 9×9 pair
  (`pass6/critique/MRK-LIVE/geometry-ballot-graft-vs-head-9x9-cell40-hover-invalid-light-chromium-1280x800-fine-prm.png`).
- **T9-B8** (the ring's ink) is unchanged: A alias `#3a7bc4`@0.95 ships. Its pass-6 pair is retired by the two
  frames below; its numbers stand in `pass6/prototype/MRK-LIVE/README.md` §5, restated on HEAD's geometry by
  the whole-ring table above (arm A: 44 / 24 at 16×16).

## 5 · Crops (2; one lawful pair, one payload, one variable)

| crop | bytes | engine · theme · viewport · pointer · DPR · payload | retires (`pass6/SWEEP.md` names) |
|---|---|---|---|
| `t9-b29-geometry-head-vs-graft-16x16-cell0-focused-light-chromium-1280x800-fine-dpr1-prm.png` | 6,058 | chromium · light · 1280×800 · fine · DPR 1 · `?size=4&board=mintSudoku(4)`, cell 0 focused, PRM, ×3 nearest-neighbour | `ballot-ring-token-3arms-16x16-cells0-1-light-chromium-1280x800-fine-prm.png` |
| `t9-b29-geometry-head-vs-graft-16x16-cell0-focused-dark-chromium-1280x800-fine-dpr1-prm.png` | 7,543 | the same, dark | `ballot-ring-token-3arms-16x16-cells0-1-dark-chromium-1280x800-fine-prm.png` |

Labels are burned in with the chromium counts (44 vs 78 of 240). Quantized with pngquant 60–90. I looked at
both: HEAD's ring is a near-square on the cell's own edges; the graft's is a crumpled quadrilateral whose
left side lies on the frame rule. 13.6 KB against the 20.5 KB retired.

## 6 · Measurements beside the rows

- **The whole spec file** (`focus-ring.spec.ts`, 20 rows × both engines):
  - lane dev :4238, final sha1 `4dd6ac5d`: **20 passed, EXIT 0** (load 121 → 96);
  - control dev :4240 (`74a2b5d9`): **16 failed / 4 passed, EXIT 1**. Green there: G-LIVE-17 (a guard) and
    G-LIVE-22 (a return to HEAD reds nothing). Red, each for its named reason: G-LIVE-4/15/20 "the ring lands
    on …", G-LIVE-14 "tier 2 outranks tier 1 in the more arm", G-LIVE-16 "the walk judged a stop good by its
    drawn ring", G-LIVE-19 "--focus-ring-outset is registered exactly once", G-LIVE-21 "the active card's
    outline is the system Highlight", G-LIVE-23 no clean stop (no drawn ring).
- **π, the ring's geometry** (`instruments/pi-ring-d.mjs`, lane dist vs control dist, PRM): rest and hover,
  9×9 and 16×16, both engines: **d differs 0, paint differs 0** (113/113, 358/358). Focus: the three living-
  mark pose paths (only-lane, claimed since pass 5) and tier 2's opacity 0.9 → 0.95 (T9-B8 arm A, claimed).
  The invalid ring is the same path's class; its `d` is identical by the rest row.
- **π, whole DOM** (`instruments/pi-wholedom.mjs`, boil parked): lane `index-B72YBnilT3zJ.js` vs control, both engines: **4,136 nodes, 0 paint deltas, 0 only-here/only-there, ring-claimed 0**; control-vs-control floor 0; the same 113 labelled cells read back. It drives board, deck and dark, not focus; the ring's states are the row above.
- **check-property-block**: source 0 (lane and control); served 0 on `index-B72YBnilT3zJ.js` (45 registrations
  in 7 css) and on the control's `index-CubiZsMVSwTc.js`.
- **Filter census**: light 12/12 lane and control; dark 4 failed / 8 passed on both (gap 7).
- **vitest**, in the work tree, chunked: pencil **9/77**, games **57/743**, composables **3/16**: 69 files /
  836 tests, EXIT 0 each (load 191–306). `src/lib` has no tests.
- **vue-tsc -b**: 0 on a copy of the final tree; control 0.
- **ledger-diff --verify-cites**: 0.

## 7 · Pre-return battery (bare; lane = final tree with scratch moved out · control = `git archive 74a2b5d9`)

| gate | lane | control |
|---|---|---|
| the whole spec file (`focus-ring.spec.ts`, both engines) | **0** (20/20) | 1 (16 failed / 4 passed, §6) |
| lint:lanes | 0 | 0 (the first control read exited 2: my archive lacked `.github`; re-archived, 0) |
| lint:theme-tokens | 0 | 0 |
| lint:sleep | 0 | 0 |
| lint:copy (check-copy-register; no new UI string) | 0 | 0 |
| lint:motion | 0 (first read 1: the `PRM:` line had slid below line 20; moved back) | 0 |
| test:e2e:projects (check-pw-projects) | 0 | 0 |
| `npm run lint` (prettier, the scoped form `src/ scripts/ ../../scripts/ ../relay/`) | 0 (first read 1: `FocusRing.vue` unformatted; `prettier --write` on that file) | 0 |
| check-property-block, source · served | 0 · 0 | 0 · 0 |
| eslint . | 0 (scratch configs moved out first) | 0 |
| vue-tsc -b (on a copy of the final tree) | 0 | 0 |
| the undefined-token census (the chair's pass-6 copy) | 1 (2 bare + 1 STALE, gap 6) | 1 (0 bare + the same STALE) — inherited, DECLARED |
| lint:bands · lint:verbs | not on this tree (they land from VERB/LADDER) | not on `74a2b5d9` |
| ledger-diff --verify-cites | 0 | — |

## 8 · Replay route, incidents, moved rows

**Replay.** IN PLACE; nothing replayed. At the start the tree's product diff (temporary index, untracked
files intent-added) was **22 files +2,639/−175** against the bank's **22 files +2,253/−175**: the dead
attempt's +386 lines in six files (`focus-ring.spec.ts`, `index.css`, `FocusRing.vue`, `pencilConfig.ts`,
`gridPaths.ts`, `gridPaths.test.ts`). `pass6.diff` applied clean to a fresh archive of `74a2b5d9`, and the
interdiff against the tree was read hunk by hunk. Kept whole: the HEAD default with `graft`/`sized` behind
the const, G-LIVE-22's re-cut and figure clause, G-LIVE-23, G-LIVE-19 on the shape library, G-LIVE-4's
printed deal, G-LIVE-17's pinned deal, the page-width clip in `FocusRing.vue`, the two comment corrections.
Finished by this run: G-LIVE-21's staging face and Highlight clauses with the CanvasText negative;
G-LIVE-23's light-walk verdict ahead of its plants (a faint ring now reds on the visibility clause by
name); the witness label; the `PRM:` header moved back into the first 20 lines (lint:motion); `prettier` on
`FocusRing.vue`. Reverted: nothing. The dead attempt's unused `visibility-walk.mjs` went to the scratch
trash. At return: **22 files +2,697/−175** (tracked 19 files +586/−175, plus the same 3 untracked files);
`git apply --check` on a fresh `74a2b5d9` archive: **exit 0**; the diff (product paths, `--binary`) is
181,195 B, sha1 `5874d446`. §5 §6 is not a merged section, so there is no integrated-tree check.

**sha1 pair.** The battery ran on the final files listed in §2; the tree at return has the same sha1s.

**Incidents.**
1. The first vitest run was on a scratch COPY of the tree: `src/pencil` read "no tests" and `src/games` 4 of
   696 failed on 480-second timeouts at load 368. Discarded; the work-tree run above is the reading.
2. My first control dev server ran from the lane's directory with the control's config, so it served the
   lane's source. Caught by reading `pencilConfig.ts` off both ports; restarted with `root` set to the control
   (verified: `RING_GEOMETRY` absent on :4240, present on :4238).
3. Ports 4241, 4247 and 4248 were held by other lanes; `--strictPort` refused them, and my servers moved to
   4244 and 4246.
4. The first whole-spec lane run (20/20) and the first plant battery ran on an intermediate spec sha1. Both
   were re-run on the final sha1 (§2, §6).
5. The first lane dist (`index-D9Kox6x8Mcbv.js`) predates the `prettier` edit; it was rebuilt, the chunk
   hashes cascaded, and every dist row was re-run on `index-B72YBnilT3zJ.js`.
6. No `rm`. Scratch lives in `<scratchpad>/mrklive-p7/`; the in-tree `.mrklive7/` went to
   `<scratchpad>/trash-mrklive-p7-1/` before the battery.
7. Servers, killed by recorded PID: 49990 (lane dev :4238), 49993 (control dist :4239), 50136 (control dev :4240), 52342 (sized :4242), 53397 (graft :4244), 69400 (plant copy :4245), 76440 and 85810 (lane dists :4246). All my ports were empty after; a later listener on :4246 is ERASE's (`wf_f72f3b5a-83a-47`), not mine. No git ran in the control tree. Nothing was committed, pushed, stashed, installed or deployed.

**Moved rows.** R6 law 39's form list stays MOVED on this tree, as since pass 4 (the chair's row, PROPOSED,
not re-landed). R1 stays booked. The L-rows and the r0 probe are untouched. No instrument's subject moved.

**INTAKE-22 §7:** row 44 **OPEN** (gap 3). **INTAKE-23 §4:** row 37 (none owed; LIVE reads row 9's composed
tree once before it folds) **OPEN**: row 9's composed tree is not on this lane's tree, and the read belongs
to the fold.

## 9 · Leader's line

The marks section's number is the critic's. ABS rows NOT landed, each with why: **D0** (the deck ring at
offset 0): the deck owners' file, PROPOSED (row 8); **the law-39 tab deletion**: the chair's row; **G-ABS-4's
"host reached" negative** (a de-tabbable viewport): not built, since the reach clauses already red when
focus does not land, but no plant proves it; **G-ABS-3's `.info-btn` dark row**: its subject is INTAKE-22
row 44, still open; **arm H**: it is T9-B29's HEAD arm and now ships as the default.
