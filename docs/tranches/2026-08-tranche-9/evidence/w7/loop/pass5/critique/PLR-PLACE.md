# PASS-5 CRITIQUE · PLR-PLACE · Where the room is (§11)

Adversarial. I didn't write the charter or the prototype. Base and π control `74a2b5d9`. Work tree
`.claude/worktrees/w7-p4-PLR-PLACE` (branch `w7/p4-plr-place`, nothing committed; `git diff HEAD
--stat` 29 files +3,355/−405 at open and at return, matching the return). HEAD control: the shared
`w7-control` dist, verified by its asset hash `index-CubiZsMVSwTc.js`.

**CONVERGENCE: 80 (pass 4: 74). VERDICT: ADVANCE.**

All four of pass 4's defects are cured on the real surface, and I reproduced each cure and its
ablation on both engines: the hostage, the close cut, the ring against the room, and the NO arm,
which now reads to the hundredth on one payload. The thin-lap cure works too. But the same watch
that cured the hostage still leaks a clock. A peer's first move, pending when the room's map empties
(a deal), outlives the clear and draws that peer on a cell of the board that's gone. I read it on
both engines on the real surface, with the seeded control green, and a 2-line cure turns it green
(4/4 e2e, 17/17 unit).

Five more findings are new this pass:
- The thin-lap cure moved Chromium's board hit area by 3 px, and nobody declared it.
- The height law breaks on a long slug. That explains the prototype's unexplained 25.75.
- `lint:sleep`'s "0" can't see the three `getAttribute` sleeps in row 7.
- MOT-VERB's undefined-token census reds 2 on this tree, 0 on the control. The prototype didn't run it.
- The cited dist identity doesn't rebuild from the returned tree.

None of this breaks a constraint beyond repair, and each item is closable.

## 0 · What I ran myself

These were my servers, each killed by recorded PID. All three ports were free when I returned:
- dev `127.0.0.1:4246`: the work tree, cacheDir in the scratchpad
- control `:4247`: the `w7-control` dist, `index-CubiZsMVSwTc.js`
- my built dist `:4248`

My scratch `.plr-place-crit/` was parked outside the tree for the build and for `eslint .`, then
deleted. The tree's `git status` shows product files only.

| # | what | chromium | webkit |
|---|---|---|---|
| E2E | `player-place.spec.ts` WHOLE file, dev | **15/15**, exit 0 | **15/15**, exit 0 |
| H | row 9, the hostage (B walks, C moves once) | C steps at **769 / 778 ms** (×2), 13 of B's steps after | **776 ms**, 13 after |
| CL | row 10, a close is a pose | escape {drop **0**, 23–24 fading, **0** chart-less}; mark {0, 21, 0}; planted {**96**, 21, 21} | {0, 15, 0} ×2; planted {96, 15, 15} |
| E1 | break: the `pending[id]` guard removed | row 9 **RED** (stepped −1 ms: never inside the walk); sha1 restored | **RED** |
| E4 | break: the sheet's `@click="close"` removed | row 12 **RED**; sha1 restored | **RED** |
| KILL | the prototype's probe (copied), its banked payload `ATMuMTk3NjA0NT…` reused, read back per page, coarse witnessed | chart H 182.38 / lap **94.64** (664 n2), 4.64 (844 n2), 71.81 (844 n5, H 249.55). List (`PLACE_CHART = false`, sha1 restored) H 105.27 / lap **17.53**, 0, 0 (H 172.44) | chart **94.95**, 4.95, 72.13. List **17.84**, 0, 0 |
| FILT | `filter-census.spec.ts` on MY dist (`index-BV5ywSwQPJLE.js`, 43 files, 916 KB) | 6/6 | 6/6 (**12/12**, exit 0) |
| UNIT | vitest (my config merged the include, so it ran the estate too) | **70 product files / 845 tests green**, the prototype's count. Plus my 3 rows: 2 RED, 1 control green | — |

Gates bare on the tree: `eslint .` 0 · `prettier --check` (`lint`) 0 · `lint:lanes` 0 ·
`lint:theme-tokens` 0 · `lint:sleep` 0 · `test:font-coverage` 0 · `check-copy-register` 0 ·
`check-pw-projects` 1 (check 8 only: 264/262 vs floors 214/212, declared by the prototype, the
chair's restamp).

I tried to break them:
- `check-copy-register` with an em dash planted in `LOBBY_COPY.unplaced`: exit 1, named. It can fail.
- The same string with first person ("I have no cell shown"): exit **0** (§1.6).

## 1 · The defects pass 5 did not see

### 1.1 THE GHOST: a pending first move survives the clear and draws a peer on a dead board (both engines)

The cure made each clock its own, but the watch's leave loop still walks `settled` alone
(`PlayerMark.vue:278`). A timer armed for a peer who isn't in `settled` is never cleared when that
peer leaves the map. That covers a peer whose first `cur` arrived after your open, i.e. anyone who
joined, or who hadn't touched a cell, when you opened. When it fires, it writes the old cell into
`settled`, and the chart draws it.

The e2e I wrote reads it on the real surface (`instruments/k-ghost.spec.ts`):
- three at the table; A opens the sheet; C taps cell 20 (C's first cur since A's open); B deals a
  new board, and the deal lands on A at **172 / 174 ms**.
- 1.5 s later, A's chart draws **C at cell 20 of the board that's gone**, on both engines
  (`p-0c9f@277.8,277.8` / `p-de0f@277.8,277.8`).
- The seeded control (C moved before A opened) reads `[]` on both engines.
- The dot stays until C moves again. After a deal every OTHER peer is unplaced (C2, below), so the
  ghost is the only dot on the chart.

Unit rows (`instruments/K-GHOST.test.ts`): K-GHOST (clear) **RED**, K-LEAVE (drop) **RED**, K-SEEDED
control green.

The cure is `instruments/PROPOSED-ghost-cure.diff`: walk `settled ∪ timers`, and delete from
`settled` only what's there. It's 2 lines. Planted on the tree it reads **3/3 unit + the family's 14
green**, and **K-GHOST e2e 4/4 green on both engines**. The file was restored by sha1.

This is the TWO-MOVERS law's sibling: a per-key timer map needs a LEAVE-WHILE-PENDING row too.

### 1.2 The thin-lap cure moved Chromium's board hit area, undeclared

`@click="close"` makes the sheet a click target, and Chromium's touch adjustment now snaps taps
OUTSIDE the sheet onto it. `instruments/k-below.spec.ts` tests this at 390×844 `hasTouch` with two at
the table, tapping at x=60 at 1/2/3/4/6/10 px BELOW the sheet's bottom edge. `elementFromPoint`
there is a board cell at every depth.

| arm | 1–3 px below | 4–10 px below |
|---|---|---|
| tree, Chromium | **the sheet shuts and focus goes to BODY: no cell** | the cell |
| E4-ablated (pass-4 form), Chromium | the cell | the cell |
| tree, WebKit | the cell | the cell |
| E4-ablated, WebKit | the cell | the cell |

So the cure trades the inside band (1–3 px, fixed) for an outside band (1–3 px, new) in Chromium. It
may be the right trade, but it's a pixel this family moved on the board's own hit area and didn't
declare. The RUNSHEET line for the real finger should read both sides of the edge.

### 1.3 The height law breaks on a long slug, and the kill numbers are floors

`instruments/k-wrap.spec.ts` sets the rendered names to the dictionaries' longest writable slugs.
Its one uncontrolled variable is stated: a text swap, since the peer ids are random. The sheet is
pinned at **W 256**. `straightforward-tyrannosaurus` (29 characters) wraps: its row goes 22.39 →
**43.19**, and H goes 182.38 → **203.17**. The lap at 390×844 with two at the table goes 4.64 →
**25.44** (Chromium) and 4.95 → **25.75** (WebKit).

That is the prototype's "unexplained" I6 exactly (25.75, +20.8). My own E4 WebKit run hit it
naturally (sheet bottom 247.17 vs 226.38). About 6.6 % of writable names are ≥ 20 characters.
`H = … + 22.4·r`, and `ROWS.tall = 5` ("5.3px between five rows and the board's top"), assume one
line a row, so both are false for long slugs. Every kill number in the ballot is the one-line floor.

The row furniture is the leader's, but the owner's ballot quotes PLACE's numbers. The fix is either:
- the ballot states the band (+20.79 px a wrapped row), or
- the row stops wrapping (nowrap + a clip), and that cure is itself measured.

### 1.4 `lint:sleep`'s 0 can't see this spec's own disease (row 7)

The gate's live-read verbs (`scripts/check-sleep-lint.mjs:119`) omit `getAttribute`. Row 7 has three
fixed sleeps, each followed by a one-shot `getAttribute` assert:
- `:486` (400 ms → `plantedOpen`)
- `:506` (400 ms → "a tap opens the sheet")
- `:540` (300 ms → the dismissal)

None of them carries a `sleep-ok`. With a one-word widening (`instruments/check-sleep-lint.getAttribute.PROPOSED.diff`), the tree reds **4**: these 3 plus `viewport-law:111`. The control reds **1** (`viewport-law:111`, inherited).

The prototype's sentence "every fixed wait became a poll or carries a `sleep-ok`" is false for these
three. `:486`'s WebKit half ("never opens") is an absence, and a `sleep-ok` is honest there. `:506`
and `:540` are pollable. The gate's blind verb is the estate's row (cross-pollination 3).

### 1.5 MOT-VERB's undefined-token census reds on this tree, and the battery didn't run it

The census copy (`pass5/prototype/MOT-VERB/instruments/undefined-token-census.copy.mjs`, FE by env),
run bare:
- **tree:** 2 bare `var()` naming no declaration in scope, both `--tap-floor` at `PlayerMark.vue:428/429`. The token is declared file-locally on `.page-root` at `App.vue:1020`, and there's no INHERITED row for the pair.
- **control:** 0.
- Both exit 1, on the inherited stale `--refuse-dur` row.

The line is the leader's (the `--tap-floor` fallback struck in pass 4). It rides in this tree, and the
task's constraint list names this census, but the prototype's battery table doesn't have it. To
close it: one INHERITED row `--tap-floor :: App.vue -> pencil/chrome/PlayerMark/PlayerMark.vue`, then
re-run to 0.

### 1.6 Smaller untruths in the record

- **The cited dist doesn't rebuild from the returned tree.** My build from the returned tree is
  `index-BV5ywSwQPJLE.js`, where the prototype cites `index-Tuaodqx5Y3Wj.js`. With hashes
  normalised, the index chunk is identical. The CSS (94,380 B each) differs only in `PlayerMark.vue`'s
  scope id (`0ed53f96` → `d542307d`), which is the prototype's post-battery comment-only edit. So π
  and the filter count hold in substance, but LAWS P4's "rebuild the dist you cite and compare its
  identity" wasn't honoured after the last edit, and the return doesn't say so.
- **`copy.ts`'s header claims a gate that doesn't exist.** It says `check-copy-register`'s
  `COPY_SOURCES` arm names `LOBBY_COPY` by identifier and enforces "no first person". No script in
  any tree contains `COPY_SOURCES`, and a planted "I have no cell shown" exits 0. Dashes are caught by
  the literal scan (planted: exit 1). The fix is one sentence (or the arm).
- **Row 7's tape clause (registry §2.10, struck) was annotated, not re-cut.** In Chromium
  `tape-before-open` read **false in 1 of my 2 runs** (the prototype read 3 of 4 live), and there
  `toHaveCount(0)` passes vacuously. The in-run negative control already exists (the planted
  pass-3 seam keeps focus in the cell, so the tape should stay). It's applied to `aria-expanded` and
  never to the tape clause. A struck gate counts only when re-cut WITH its negative control, so this
  one still doesn't count.

## 2 · What is earned (reproduced by me)

- **The hostage is cured.** C steps at 769–778 ms with B still walking, on both engines. The guard's
  ablation reds on both engines (C never steps inside the walk). The `deep` exclusion is honestly
  declared a belt.
- **A close is a pose.** Drop 0, and 0 chart-less frames in 15–24 fading frames, by Escape and by
  the mark, on both engines. The planted cut in the same run reads 96 / every frame.
- **The ring agrees with the room** (row 11, whole file green, both engines). The price is
  declared: no ring for a phone or keyboard reader.
- **The NO arm is buildable, and the kill condition reproduces to the hundredth on ONE payload,
  both arms, both engines** (94.64/94.95 vs 17.53/17.84; +77.11 px). One variable, the const. Crop 1
  holds the pair: one payload (the board digits match across all four panels), and the uncontrolled
  slugs and the WebKit join-wash frame are stated. It retires the two pass-4 crops it names.
- **The thin lap inside the edge is cured** (E4 reds on both engines). §1.2 prices the other side.
- **The filter budget holds** on a dist I built (census 12/12). `PlaceChart.vue` mints no
  `filter`/`url(#`, and the chart mounted while shut holds none. Note: a dist arm forms no room, so
  "9 = 9 = 9 with the lobby open" on a dist is a SOLO lobby. The room pose's filter reading is
  dev-only, which is honest but should be said.
- **M16 copy** (the dash is caught), `eslint .`, `prettier`, `lint:lanes`, `lint:theme-tokens` and
  font coverage are all 0. The @property law: this family registers nothing (`--head-rule` at file
  scope is the leader's, initial 0px). There's no generic-default tell in the crop.
- **The unit count** (70 / 845) reproduces.

## 3 · Open gaps (each closable, numbers attached)

1. **THE GHOST.** A peer's pending FIRST move survives an epoch clear (or a leave) and draws them on
   the dead board's cell. Read on both engines with the seeded control green (§1.1). To close: land
   the 2-line `settled ∪ timers` leave loop, add the K-GHOST e2e row (and K-LEAVE unit) with its
   ablation RED in-run.
2. **The outside band.** In Chromium `hasTouch`, taps 1–3 px below the open sheet's edge now shut it
   and reach no cell, where the pass-4 form reached the cell. WebKit is unchanged (§1.2). To close:
   declare it as the cure's price, with a row reading both sides of the edge on both engines, and add
   it to the RUNSHEET line.
3. **The height law vs a long slug.** A 29-character slug wraps at W 256: +20.79 px a row, and the
   lap goes 4.64/4.95 → 25.44/25.75 at 390×844 with two at the table (§1.3). To close: either state
   the band in the owner's ballot and in the law, or stop the wrap and re-measure.
4. **THE KILL CONDITION (the owner's, U-10).** 94.64/94.95 vs 17.53/17.84 at 390×664 with two at the
   table; 71.81/72.13 with five at 390×844. Nothing in the design shrinks the chart. Open until the
   owner disposes. Gap 3 makes every figure a floor.
5. **A phone or keyboard reader never sees their own ring.** Under the leader's arm (a) the wire says
   `null` after a tap or a keyed open. Arm (b) is unbuilt. It's the leader's row, and PLACE's chart
   pays the price.
6. **C2 (the wire's).** A joiner, or any page after a deal (`clearCursors` sets `lastCell = null`
   and nobody re-sends), draws no dot for a peer who sits still. The chart's "where everyone is" is
   empty until people move. It goes to whoever owns the `cur` receiver. It isn't PLACE's cure, but
   it's PLACE's claim.
7. **S1 (PAL-WALK's same-epoch `st` race)** is RED on this tree. Carried.
8. **`lint:sleep` is blind to `getAttribute`**, and row 7 carries three unannotated
   sleep→`getAttribute` one-shot reads (`:486/:506/:540`; tree 3, control 0 in this spec under the
   widening) (§1.4). To close: poll `:506`/`:540` and tag `:486`'s absence half. The estate widens
   the verb list.
9. **Undefined-token census: 2 on the tree, 0 on the control** (`--tap-floor`, PlayerMark.vue:428/429,
   no INHERITED row) (§1.5). To close: one ledger row, and the census in the lane's battery.
10. **Row 7's tape clause** is still vacuous in Chromium when the tape didn't rise (1 of 2 of my
    runs). It was annotated, not re-cut with its negative control (§1.6). To close: assert the tape
    clause under the planted seam (it must red), or retire the clause to the fold's 3C-4 row by name.
    The 3C-4 HEAD reading under this rig is still owed.
11. **G1 has no spread.** A fixed banked trace reads one number n times. Live variance is unmeasured
    (declared).
12. **The cited dist identity** (`Tuaodqx5Y3Wj`) doesn't rebuild from the returned tree
    (`BV5ywSwQPJLE`; normalised-identical, scope id from a post-build comment edit). To close: cite
    the rebuilt identity. Also, `copy.ts`'s header claims a `COPY_SOURCES` arm and a first-person
    rule that don't exist. To close: one sentence.
13. **Not run by anyone:** G10 board-unbound, `multiplayer.spec.ts` (relay, W8 §8.3), the golden
    estate, real iOS (M19). Painted AA wasn't re-measured by me this pass. The prototype's rows carry
    the sensitivity row and the ring-OFF subtraction, and pass 4's critic reproduced the same
    instrument.
14. **`check-pw-projects` check 8** is RED (264/262 vs 214/212), declared: the chair restamps at the
    fold. **`check-evidence-policy`** is over the wave's cap, declared: the chair's sweep.

## 4 · Failure-mode checklist

| tell | hit |
|---|---|
| vacuous convergence | no |
| spec cites itself | no |
| **gates that cannot fail** | **PARTIAL.** Row 7's tape clause (Chromium, 1 of 2) is still vacuous and not re-cut. `lint:sleep`'s 0 is blind to `getAttribute` (3 sites in this spec). The hostage, close, ring and thin-lap rows all CAN fail (E1–E4, reproduced E1/E4 both engines) |
| elegant-reduction trap | **YES, carried.** The kill condition, and now a height law that assumes one line a row |
| legacy aliases | no |
| **masked fallbacks** | **YES.** The ghost: a timer the leave loop can't see paints a dead board's cell as a live peer (§1.1) |
| unverified gestalt | no for the close (cured and framed by number). The ghost has no frame. It's a number on both engines, and the fix is mechanical |
| consumer-less substrate | no |
| generic default | no |
| **π (the pixel it didn't declare)** | **YES.** Chromium's board hit area loses 1–3 px under the open sheet's edge (§1.2). The solo π dist-vs-dist stands (normalised-identical dist) |
| **constraint it forgot** | **PARTIAL.** The undefined-token census wasn't run and reds 2 (leader's line, in this tree). LAWS P4's dist identity was not re-honoured after the last edit. AA, filterBudget, M16 (dashes), W2's mechanics (voice on top, no new mechanic; the ghost cure touches no wire), the @property law and the decided history (r0 L1–L6 GREEN, R1–R3 born-RED identical to the control per the prototype; no row MOVED) are CLEAR |

## 5 · Ballots and fork rows

- **OWNER (U-10), the kill condition.** Crop 1 is a clean pair: one payload, one variable (the
  const), both engines, coarse light, and I reproduced all twelve figures. Add one line to its
  caption: every figure is the one-line floor, and a wrapped slug adds +20.79 px (gap 3).
- **LEADER (PLR-SELF).**
  - The touch seam: (a) is landed, with no own ring for touch or keyboard; (b) is unbuilt.
  - `--tap-floor`'s missing INHERITED row.
  - The row furniture's wrap (gap 3's other half).
- **CHAIR.**
  - The 3C-4 HEAD reading under this rig.
  - Check 8's restamp.
  - C2 to the `cur` receiver's owner.
  - `lint:sleep`'s verb list (`getAttribute`).
  - The RUNSHEET line for the real finger, reading both sides of the sheet's edge.

## 6 · Cross-pollination

1. **LEAVE-WHILE-PENDING is the second row every per-key timer map owes** (beside TWO-MOVERS). A
   leave loop over the SETTLED set can't see a key whose first arrival is still pending. Grep every
   `timers[id]` map for a cleanup loop that walks something other than `timers` (PLR-COUNT's tweens
   and `settle()`, any `useTwoTap`-like clock).
2. **A dismissal target moves the hit test on both sides of its edge.** Any cure that makes an
   overlay answer taps (`@click` on a sheet) owes a row reading taps just OUTSIDE its edge on
   Chromium `hasTouch`, where touch adjustment snaps outward.
3. **`lint:sleep`'s live-read verbs omit `getAttribute`.** A one-word widening reds 3 unannotated
   sites in `player-place.spec.ts`, and `viewport-law:111` on both trees. It's the estate's gate, so
   every family's spec is exposed.
4. **Any row-count height law needs its longest-string row.** Slugs run to 29 characters, and a
   pinned-width sheet wraps them.

## 7 · Incidents (the critic's own)

- **C1.** My scratch vitest config (`mergeConfig`) merged the `include` arrays, so the first run
  executed the whole estate beside my three rows. I've kept it as a reading (70 / 845 green) and
  don't claim it as a chunked run.
- **C2.** I piped the undefined-token census through `tail` once, which ate its exit code. Re-run bare,
  it's tree 1 / control 1 (§1.5).
- **C3.** My first K-BELOW WebKit recorder timed out on its `stable` read. I re-cut it to poll opacity
  1 first, then the bottom to 0.1 px. Both engines are green, and the reading is the re-cut's.
- **C4.** K-WRAP's banked re-run overlapped the tail of the filter-census run: two Playwright runs at
  once for ~10 s. Both were green and the numbers were identical to the first K-WRAP run.
- **C5.** My scratch `.plr-place-crit/` sat inside the tree while the dev server ran, which makes it a
  Tailwind source for the dev CSS. It was parked outside the tree for the build and for `eslint .`,
  and deleted before return.
- **C6.** The session scratchpad is shared with the prototype's, and its dist is at
  `scratchpad/build/dist`. I read it for the identity diff and wrote nothing there. My files live
  under `scratchpad/crit/`.
- Every planted edit (E1, E4, `PLACE_CHART`, the ghost cure, the copy dash / first-person) was
  restored and sha1-verified. `git diff HEAD --stat` at return: 29 files, +3,355/−405, the same as at
  open.
