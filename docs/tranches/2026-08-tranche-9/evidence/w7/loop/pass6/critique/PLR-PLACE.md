# PASS-6 CRITIQUE · PLR-PLACE · Where everyone is (§11)

Adversarial. I didn't write the charter or the prototype. Base and π control `74a2b5d9`. Work tree
`.claude/worktrees/w7-p4-PLR-PLACE` (uncommitted; `git diff HEAD --stat` 30 files +3,665/−406 at
open and at return, no file newer than the lane's README). HEAD control: the shared `w7-control` dist,
verified by its asset hash `index-CubiZsMVSwTc.js`.

**CONVERGENCE: 84 (pass 5: 80). VERDICT: ADVANCE.**

The ghost is cured, landed, and I can red it. I re-ran each of its ablations on the FINAL file, both
engines. Pass 5's small untruths are closed too (lint:sleep, the census row, the dist identity,
`copy.ts`, the tape clause retired by name), and each one reproduces.

What holds the number down is the lane's new third arm. `CHART_YIELDS` is the arm the lane leans
toward, and its headline claim is that it "equals the list on every 390-wide phone ≤844 tall". That's
true only for the pose at open. Open the sheet at 390×860, where the chart draws with lap 0, then
shrink the viewport to 390×664 while it's open. The yielded arm then keeps the chart and laps the
board **94.64 / 94.95 px, 21 cells**, where its own fresh open reads 17.53 / 17.84, 7 cells (both
engines). The chart arm does the same. The measured key is read at open and on a room change, never
on resize. That is the leader critic's stale-key finding, carried into the chart, and it costs 77 px
here. The kill condition itself reproduces to the hundredth. It remains the owner's (U-10).

## 0 · What I ran myself

My servers, each killed by its recorded PID (listener + npx parent):
- dev `127.0.0.1:4238`: the work tree, private cacheDir `scratchpad/plr-place-crit6/vc-dev`
- control dist `:4239`: `w7-control`, its own `.vite-control.config.ts`, verified `index-CubiZsMVSwTc.js`
- my rebuilt dist `:4244`: `index-BUf-CEbcTq99.js`

4240 and 4241 were held by a sibling, and 4231–4234 by others. None of them was touched. Ports
4238/4239/4244 read free at return. My scratch lives entirely OUTSIDE the tree
(`scratchpad/plr-place-crit6/`, with `node_modules` symlinked for the spec imports), so no Tailwind
source leaked into the dev CSS. Nothing ran `rm`, and no git was run in the control.

| # | what | chromium | webkit |
|---|---|---|---|
| E2E | `player-place.spec.ts` WHOLE, dev, final tree | **18/18** | **18/18** (36/36, exit 0, 3.2 min) |
| GHOST | plant = pass-5 leave loop, row 13 `--repeat-each 3` | unseeded **✘×3** (C drawn at cx 277.78), seeded ✓×3 | **✘×3**, ✓×3 |
| E4 | the sheet's `@click="close"` removed, row 14 | ✘: in 1–2 → cell, below 1–3 → cell | ✘: in 1–3 → cell |
| SEAM_A | `TAP_IS_A_LOOK=false`, rows 7 + 11 | row 7 ✘ ("the release swallowed"), row 11 tapped ✘ ("tapped: your ring"), row 11 mouse/keyed ✓ | same |
| PASS (mine) | `.player-lobby.is-open{pointer-events:none}`, rows 7 + 12 | row 7 ✘ (hit-test clause), row 12 ✘ | same |
| E4 on row 7 (mine) | row 7 under E4 | **✓** | **✓** |
| UNIT | `src/pencil/chrome/PlayerMark` | 2 files / 17 tests green; GHOST plant: K-GHOST ✘, K-LEAVE ✘, K-SEEDED ✓ (2 failed / 9 passed) | — |
| KILL | the lane's probe copied, payload `ATMuMTk3NjA0NT…` read back per page, coarse witnessed | 664 n2: chart 182.38 / **94.64** / 21 · list 105.27 / **17.53** / 7 · yield = list | chart **94.95** · list **17.84** · yield = list |
| KILL+ (new cells) | 360×800 n2 · 844×390 n2 | chart **16.06** / 7 cells, list 0, yield = list · chart 6 cells, list **4**, yield **6** (chart kept) | chart **16.36** / 7, list 0, yield = list · 6 / 4 / 6 |
| RSZ (mine) | open at 390×860 n2, resize to 390×664 while open | chart arm: lap 0 → **94.64**/21 · yield arm: lap 0 → **94.64**/21 (fresh open 17.53/7) | **94.95**/21 · **94.95**/21 (fresh 17.84/7) |
| ROT (mine) | open at 844×390 with five, rotate to 390×844 | the visible mark swaps, `aria-expanded=false`; the landscape sheet stays `.is-open` with a 0×0 box | same |
| EV (mine) | the tap on the mark, 390×844 coarse | pointerdown·pointerup·touchend·**click (PointerEvent, `touch`)** → `onClick` ignores it, open | pointerdown·pointerup·touchend, **no click**, open |
| LEADER | `player-mark.spec.ts:507` on this tree | **✘** 390×800: `lapped 7` vs 0 | **✘** same |
| DIST | rebuilt by me from the final tree, scratch outside | **`index-BUf-CEbcTq99.js`, 43 files, 916 KB** (the cited identity, reproduced) | |
| FILT | `filter-census.spec.ts` on my dist | 6/6 | 6/6 (12/12, exit 0) |
| π | the leader's `p6-pi.spec.ts` copied, control ×2 vs my dist, 8 cells, shut + card open | noise 0; mine **62 = 14 property deltas + 48 ONLY-MINE** every cell | the same |
| REPLAY | `git archive 74a2b5d9` + `pass5.diff` + `pass6-over-pass5.diff`, `cmp` against the tree | **30 files, 0 mismatches** | |

Gates bare on the tree (control readings: the lane's `readings/battery.txt`, not re-run by me):
- `lint:sleep` 0 · `lint:lanes` 0 · `lint:theme-tokens` 0 · `npm run lint` (the scoped prettier) 0 · `eslint .` 0
- `test:e2e:projects` **1** and `check-pw-projects` **1**. Both are check 8 only (chromium live 267 / floor 214, webkit 265 / 212); the control is 0. The chair restamps it.
- `lint:sleep` widened with the chair's `getAttribute` diff (a scratch copy of the script, the tree's `e2e/` symlinked): exit 1, and the only flag is `viewport-law.spec.ts:111` (inherited). `player-place.spec.ts` has **0**.
- `check-copy-register` 0.
- `check-property-block --fe` 0, and `--dist` on my dist 0.
- L5b: tree **GREEN** (9 sites), control **RED** (exit 1, `.hover-card` border).
- The undefined-token census: plain = 2 bare `--tap-floor` + STALE `--refuse-dur`, exit 1. With the admitted A.3 row = 0 bare + STALE, exit 1 (net GREEN under A.1 r4). Control = 0 + STALE, exit 1.

## 1 · Defects the prototype did not see

### 1.1 THE YIELD ARM'S PROMISE IS A POSE AT OPEN (both engines): a height change while open laps 94.64 px

`fit()` runs from `watch([isOpen, () => people.value.length])` and from nothing else. The two arms
where the key matters most can't survive a resize at rest:

| arm | open at 390×860 n2 | resized to 390×664, still open | a fresh open at 390×664 |
|---|---|---|---|
| chart (ships) | 182.38, lap 0 | **lap 94.64 / 94.95, 21 cells** | 94.64 / 94.95, 21 |
| yield (`CHART_YIELDS=true`) | 182.38, lap 0, chart drawn | **lap 94.64 / 94.95, 21 cells, chart still drawn** | **105.27, 17.53 / 17.84, 7, no chart** |

The README's gap 3 and its ballot say the yield arm "never laps more than the list does on a phone".
My reading is the counterexample: 94.64 against the list's 17.53, 77.11 px, the whole kill condition,
restored by one height change. A height-only change while a sheet is open isn't exotic on a phone
(browser chrome showing and hiding, a soft keyboard, split view). This is the leader critic's gap
(`critique/PLR-SELF.md`: 390×844 → 390×800 leaves four rows over 7 cells), and on PLACE's tree the
chart makes it 77 px larger. To close: re-fit on a resize at rest (publish on `transitionend` and at
rest, LAWS P5), with a landed row. Open at 390×860 → resize to 390×664 → under the yield arm the chart
yields and the lap equals the list's 17.53 / 17.84, both engines. Its negative control is today's
tree, which reads 94.64.

### 1.2 The yield arm is a ballot arm with no frame where it differs

At 390×664 the yield arm draws the list's pixels (my KILL row reproduces this to the hundredth), so
crop 1 serves it there. But the owner is asked to choose yield over list and chart. Yield differs from
the chart and from the list at other cells, and none of them is framed:
- 430×932 n5: 5 names and no chart, against the chart arm's 1 row + `and 4 more`
- 390×860 n2: the chart drawn with lap 0
- 844×390 n2: the chart kept at 6 lapped cells, against the list's **4**

U-10 / registry-v4 §2.9 want every arm framed on one payload with one variable. To close: one crop
pair, yield vs chart at 430×932 n5 (or yield vs list at 844×390 n2), on the banked payload, within the
four-crop cap.

### 1.3 The yield arm does not dominate the list: it keeps the chart in landscape and on the tablet

Taking my numbers and the lane's together:
- 844×390 two at the table: chart and yield both lap **6** cells, the list **4**.
- 844×390 seven at the table: 8 cells vs 6 (the lane's).
- 768×1024: 69.47 px / 3 cells in both chart arms.

This comes from the leader's one-axis proxy (`board.left <= rowsStart`), which the yield inherits, so
yield is the list only on portrait phones. The lane states 768 and 844×390 n7. The n2 landscape cell,
W2 §2.2's own, wasn't read. The ballot sentence "it never laps more than the list does on a phone" is
false at W2 §2.2's landscape phone cell, before resize is even considered.

### 1.4 LAWS P5's 360×800 cell was not read

"A regime keyed on a height reads 390×800 and 360×800 too." The lane read 390×800 only. At 360×800
two at the table, the chart laps **16.06 / 16.36 px, 7 cells** (list 0, yield = list). It's one more
cell where the shipping default laps the board, and it belongs in the ballot's table.

### 1.5 The break battery predates the final source, undeclared

`readings/e2e-breaks.txt` and `readings/unit-ghost.txt` plant and restore `PlayerMark.vue` at sha1
**`5cb65df4fd`**. The final file is **`6fa921b071`** (the `CHART_YIELDS` edit came later; the
leader-row reading plants YIELD against `6fa921b071`). Incident I3 declares that the dist, the filter
census and π predate that edit, but it doesn't say this about the GHOST / E4 / SEAM_A e2e breaks or the
unit GHOST break. The return says "each has its ablation red in-run on both engines" of a file that
isn't the one returned. I re-ran all four on `6fa921b071` and got the same verdicts (§0), so the
substance holds, and the record is corrected here.

The census's cited sites have the same staleness: `PlayerMark.vue:437/438` in the return, **459/460**
on the returned tree.

### 1.6 Row 13 proves its interleave only under the plant

Row 13 asserts that the deal landed within 700 ms of C's click. It never asserts that C's `cur`
reached A before the deal, which is the state that arms the timer the cure must clear. On a green
run, "A draws nobody" is also what a run where C's `cur` arrived late would read (LAWS P5: a row that
exists to prove an interleave deals the state and ASSERTS it). The GHOST plant reds the unseeded arm
**6 of 6** runs (3 per engine), so in practice the interleave deals every time. The row still can't
tell a vacuous green from a real one. To close: before B deals, poll A's board for C's peer cursor on
cell 20 (or a DEV-only count of pending clocks). Then assert the 700 ms bound from that arrival.

### 1.7 Row 7's re-cut dismissal clause has not been shown to fail on its own

Row 7's last clause changed from "reached no cell" (`not.toMatch(/^Row \d/)`) to "not the cell under
the tap" (`not.toBe(under)`). Arm (b) keeps your own cell focused, so the change is justified. Under
E4, row 7 stays **green** in both engines: the page root's `closeAll` dismisses it anyway, per
`PlayerLobby.vue`'s own note. Under my PASS plant (the open sheet passes taps through), row 7 reds
on its EARLIER clause, "the sheet owns the hit test over the lapped board". So no plant has yet
isolated the new clause. Row 12 reds under both plants and carries the subject. This is a minor
gap. To close: a plant that keeps `elementFromPoint` on the sheet and lets the tap's focus reach
the cell (for example a `pointerup` re-dispatch to the cell under it). The alternative is to state
that rows 12/14 carry this subject and row 7's clause is a belt.

### 1.8 The seam's click guard reads `pointerType` (the leader's code, carried here)

In my EV probe, Chromium sends a `click` (`PointerEvent`, `touch`) that `onClick` ignores. Emulated
WebKit sends no click at all. The leader's critic reads WebKit's touch-generated click, where one is
sent, as `pointerType: "mouse"`, and `onClick` would take that as a second toggle. In this tree arm (b)
holds in WebKit because the click is absent, not because the guard catches it. Real iOS is the
unread case (M19). The RUNSHEET line "the sheet opens on the first tap" is the owner-run check. The
cure is the leader's: key the guard on the sequence (a flag set in `onRelease`), never on
`pointerType`.

## 2 · What is earned (reproduced by me)

- **THE GHOST is cured.** The leave loop walks `settled ∪ timers` (5 lines). Units K-GHOST / K-LEAVE /
  K-SEEDED are green, and the GHOST plant reds both leave rows while K-SEEDED stays green. E2E row 13
  is green in both engines and reds 6/6 under the plant with C drawn at cx 277.78, with the seeded arm
  green 6/6 in the same runs. This is the pass-5 critic's reading exactly, now landed.
- **The outside band is pinned both ways.** Row 14's map reproduces, and E4 turns it into the lane's
  printed map to the pixel in both engines (Chromium inside 1–2 → cell, below 1–3 → cell; WebKit
  inside 1–3 → cell). The trade is Chromium-only and declared, and the RUNSHEET line is written.
- **The seam arm (b) pays the pass-5 price.** Row 11 tapped holds your ring at cell 30 past the
  120 ms window, and B draws you there. SEAM_A reds it in both engines. I5, the lane's own
  cannot-fail catch, is honest.
- **The kill condition reproduces to the hundredth.** Both arms, both engines, one payload (read back
  per page): 94.64 / 94.95 vs 17.53 / 17.84, +77.11 px. The long-slug floor (+20.79 per wrapped row)
  is written into the law's comment at `App.vue:757–763` and into the ballot. Crop 1 is lawful: I
  looked at it, and the board digits match in all four panels. It's chart left and list right, the
  const is the one variable, and the random slugs, the WebKit join wash and the unparked sun are
  stated.
- **The dist identity rebuilds** (`BUf-CEbcTq99`, 43 files, 916 KB). The filter census is 12/12 on it,
  and `check-property-block` on its CSS is 0.
- **π holds.** 8 cells × shut/open, noise 0, 62 deltas, all the leader's classified set (mark, lobby,
  the head-sheet edge, `.hover-card` border 2 → 0 and padding 16 → 18, the roster flex → block).
  No PlaceChart node shows up solo.
- **lint:sleep and the census are closed.** With `getAttribute` added to the verb list this spec reads
  0 (pass 5: 3). The `--tap-floor` INHERITED row is the chair's admitted A.3 row, net GREEN.
- **The replay route is exact.** The leader's delta was merged per file with the line-count check,
  and pass5.diff + pass6-over-pass5.diff reproduce the tree 30/30 byte-for-byte.
- **Two corrections hold.** `copy.ts`'s header no longer claims a gate that doesn't exist. The tape
  clause is retired to 3C-4 by name, with the HEAD reading banked, and in the spec the
  `tape-after-open` read is an annotation, not a gate.
- **The one-regime graft holds.** The chart's mount and reveal are keyed on the measured fit. There's
  no media predicate, and the chart holds no filter. NOTE-LEDGER's graft reads 0 WAAPI movers, and
  the close is three CSS transitions on the sheet (the lane's reading; row 10 stays the frame gate).

## 3 · Open gaps (each closable, numbers attached)

1. **The measured key goes stale on a resize at rest, and the yield arm's promise breaks.** Open at
   390×860, resize to 390×664 while open: the yield arm laps **94.64 / 94.95, 21 cells** (its fresh
   open: 17.53 / 17.84, 7), and the chart arm reads the same (§1.1). To close: re-fit at rest on
   resize, with a landed row (390×860 → 390×664 → yield = list's 17.53/17.84, both engines) whose
   negative control is today's tree.
2. **THE KILL CONDITION (the owner's, U-10).** Chart 94.64 / 94.95 vs list 17.53 / 17.84 at 390×664
   two at the table. Every figure is a one-line floor (+20.79 per wrapped row; 115.44 / 115.75 with
   the longest slug). At 390×800 the chart laps 26.64 / 26.95, and at **360×800 16.06 / 16.36**
   (7 cells, list 0). Nothing shrinks the 96 px chart. It stays open until the owner disposes.
3. **The leader's landed row `player-mark.spec.ts:507` is RED on this tree in both engines** (390×800:
   `lapped 7` vs 0) under the shipping default, and GREEN under `PLACE_CHART=false`. The family's
   default breaks the section leader's landed law. To close: the owner picks list or yield, or the
   leader re-cuts the row to price the chart (the leader's call; nobody re-words it here).
4. **The yield arm is unframed where it differs** (§1.2). To close: one lawful crop pair on the banked
   payload, yield vs chart at 430×932 n5 or yield vs list at 844×390 n2.
5. **The yield arm keeps the chart in landscape and on the tablet** (§1.3): 844×390 n2 laps **6 cells
   vs the list's 4**, n7 8 vs 6, and 768×1024 69.47 px / 3 cells. The ballot sentence "never laps
   more than the list does on a phone" is false at W2 §2.2's cell. To close: correct the sentence
   with these numbers, or key the yield on the lap itself rather than on the leader's
   `board.left <= rowsStart` proxy.
6. **The break battery was read on `5cb65df4fd`, not the returned `6fa921b071`**, and the census
   lines are cited stale (437/438 vs 459/460) (§1.5). The substance was re-proven by me. To close:
   bank the re-run (this critique's readings) in the fold record.
7. **Row 13 doesn't assert its interleave** (§1.6). The plant reds it 6/6, but a green run can't
   prove C's clock was armed. To close: poll A's board for C's peer cursor at cell 20 before B deals.
8. **Row 7's re-cut dismissal clause has never red alone** (§1.7): green under E4, and under PASS it
   reds on the hit-test clause first. To close: isolate it with a plant, or state that rows 12/14
   carry it.
9. **The seam's click guard reads `pointerType`** (§1.8, the leader's). In WebKit, arm (b) holds only
   because emulation sends no click. Real iOS is unread. The cure is the leader's (key on the
   sequence), and the RUNSHEET line is owed.
10. **The outside band is pinned, not cured.** Chromium `hasTouch` taps 1–3 px below the sheet's edge
    shut it and reach nothing. The RUNSHEET line (real finger, both sides of the edge) is owed (M19).
11. **Carried, not re-run by anyone:**
    - C2 (after a deal the chart is empty until peers move), to the `cur` receiver's owner
    - S1
    - G1, a fixed trace with spread 0 by construction
    - G10, board-unbound
    - `multiplayer.spec.ts`'s relay arm (W8 §8.3)
    - the goldens
    - real iOS (M19)
    - painted AA this pass: PlaceChart is untouched since pass 5, and the sheet ground and edge are the leader's (A.4's tag rung is the estate row)
    - π on a ROOM: a dist is solo, so the chart and the `TAP_IS_A_LOOK` room behaviour have no π row
12. **`check-pw-projects` check 8 RED** (267/214, 265/212; control 0), the chair's restamp.
    **`check-evidence-policy`** is wave-wide, the chair's sweep.

## 4 · Failure-mode checklist

| tell | hit |
|---|---|
| vacuous convergence | no |
| spec cites itself | no |
| **gates that cannot fail** | **PARTIAL.** Row 13 proves its interleave only under the plant (6/6 red there; a green run is unwitnessed). Row 7's new dismissal clause has never red alone. Every other landed row reds under a named plant on the final file, in both engines (GHOST, E4, SEAM_A, PASS) |
| **elegant-reduction trap** | **YES.** "The chart yields where it would lap": the yield is decided once at open, and the hard part (a resize at rest) is not handled. It reads 94.64 there (§1.1) |
| legacy aliases | no (`SELF_TAKES_A_HAND` has one home, and the struck `SELF_TAKES_ROOM_INK` comment is removed) |
| **masked fallbacks** | **YES, inherited.** `laps()` returns `null` when the board box is missing, and `fit()` reads that as "doesn't lap" (tall). The one-axis `board.left <= rowsStart` calls a centred tablet board "beside" and keeps the chart over 3 cells |
| unverified gestalt | **PARTIAL.** The yield arm has no frame where it differs (§1.2) |
| consumer-less substrate | no (`CHART_YIELDS` is a built U-10 arm, default off, and it is measured) |
| generic default | no. The crop shows a hand-drawn sheet and a 9×9 chart at box pitch: no cream + terracotta, no eyebrows, no numbered markers |
| π (the undeclared pixel) | no on solo (62 = the leader's set, reproduced). The room is unmeasured (declared) |
| **constraint it forgot** | **PARTIAL.** LAWS P5's 360×800 cell went unread (16.06 / 16.36 laps there). LAWS P5's "rebuild after the last edit" was honoured for the dist, but not for the break battery or the census cites. The following are CLEAR: AA (unchanged surfaces), filterBudget (12/12 on the rebuilt dist), M16 (register 0), W2's mechanics (the ghost cure touches no wire; the seam is the leader's ballot arm), the @property law (the family registers nothing; the block check is 0 on the tree and the dist), the undefined-token census (net 0 under A.3), and the decided history (r0 L1–L6 GREEN and R1–R3 born-RED, identical to the control per the lane, with no row MOVED; L5b GREEN) |

## 5 · Ballots and fork rows

- **OWNER (U-10), the kill condition, three arms, one payload `ATMuMTk3NjA0NT…`.**
  - Chart (default): 94.64 / 94.95 at 390×664. It also laps at 390×800 (26.64 / 26.95) and 360×800 (16.06 / 16.36). Every figure is a one-line floor (+20.79 per wrapped row).
  - List: 17.53 / 17.84. It laps 0 at 360/390×800 and at 390×844.
  - Yield: equals the list on a portrait phone AT OPEN. After a height change while open it laps like the chart (94.64). In landscape it is the chart (6 cells vs 4).
  - Crop 1 is lawful for chart vs list. Yield needs its own pair (gap 4) before it goes to the eye.
- **LEADER (PLR-SELF).**
  - Re-fit on resize at rest (gap 1): it is your gap, and PLACE's chart makes it 77 px.
  - The click guard keyed on the sequence (gap 9).
  - `:507` reds under PLACE's chart arm (gap 3).
  - The rotation leaves the hidden landscape sheet `.is-open` at 0×0 (my ROT row, both engines): read what a rotation back shows.
- **CHAIR.**
  - Check 8's restamp.
  - C2 to the `cur` receiver's owner.
  - The two RUNSHEET lines (both sides of the edge; the tap on the mark keeps your cell and opens on the first tap).
  - Bank this critique's re-run of the break battery as the record's reading (gap 6).

## 6 · Cross-pollination

1. **A measured fit re-measures on a resize at rest.** Any arm that decides "draw / don't draw" at open
   (PLACE's yield, COUNT's corner, every §10 sheet keyed on a box read at open) owes an
   open-then-resize row. The number is the one that matters when a phone's chrome moves.
2. **A new ballot arm is framed where it differs, not where it coincides.** Framing the arm at a cell
   where its pixels equal another arm's is not a frame of that arm.
3. **Re-run the break battery after the last edit.** LAWS P5's rebuild law covers the dist, and the
   same logic covers every plant's sha1: a break battery keyed to a pre-edit sha is a reading of
   another file.
4. **An interleave row asserts its interleave on the green run**, not only under the plant (row 13's
   shape).
5. **A clause re-cut under a new mechanic ships a plant that reds THAT clause**, not an earlier one in
   the same row (row 7).

## 7 · Incidents (the critic's own)

- **K1.** My first PASS plant was malformed (a heredoc turned `\n` into a newline and python rejected
  `plant.py`). The run went ahead on the UNPLANTED tree and read green. I caught it from the
  `SyntaxError`, confirmed the file unchanged (sha1 `bf1be5b39d`), fixed the plant, and re-ran. Only
  the re-run is cited.
- **K2.** I tried to serve my dist on :4240 without re-scanning, and it was a sibling's. `--strictPort`
  refused and nothing of theirs was touched. I re-scanned and served on :4244.
- **K3.** The plants (NO_ARM, YIELD ×2, GHOST ×2 incl. unit, E4 ×2, SEAM_A, PASS) were HMR'd under my
  running dev server through my copy of the lane's `plant.py` (private backup dir). Each was restored
  and sha1-verified OK. At return the tree's `git status` shows 30 product files, and `PlayerMark.vue`
  `6fa921b071`, `PlayerLobby.vue` `bf1be5b39d`, `App.vue` `8d11da55e2` are as at open.
- **K4.** No two of my Playwright runs overlapped. The battery lints and the dist build ran beside
  none of them. vitest ran alone.
- **K5.** My scratch (`scratchpad/plr-place-crit6/`: configs, the dist, caches, raw logs, a scratch
  copy of `check-sleep-lint.mjs` with the tree's `e2e/` symlinked) is the chair's to clean. Banked
  here are only `critique/PLR-PLACE/instruments/` (crit6.spec.ts, plant.py, batch.sh, pw.config.ts)
  and `readings/` (three summaries). No crop was banked.
