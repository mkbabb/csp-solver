# PASS-4 CRITIQUE · PLR-PLACE · Where the room is (§11)

Adversarial. I didn't write the charter or the prototype. Base and π control `74a2b5d9`. Work tree
`.claude/worktrees/w7-p4-PLR-PLACE` (branch `w7/p4-plr-place`, nothing committed, `git diff --stat`
28 files +2647/−374, matching the return). HEAD control is the shared `w7-control` dist, verified by
its asset hash `index-CubiZsMVSwTc.js`.

**CONVERGENCE: 74 (pass 3: 62). VERDICT: ADVANCE.**

Every one of the fourteen charter rows now has a number, and I reproduced the ones that carry the
family: the cold open, the self row asking nothing, law 33, the lap, the dismissal, π, the filter
budget, M16 and the font cut. But the family's one mechanism, the damping ("hold the latest arrival,
restart on a newer one"), is wrong whenever two things in the room move at once. One peer walking,
or you walking, freezes every other peer's dot for as long as the walk lasts. I measured it on both
engines, made a unit test that goes RED on this tree, and wrote a 3-line cure that turns it GREEN.
Three gates missed it (e2e row 1's negative control, the unit test "holds a MOVE", G1), because each
one has a single mover. There are also two unframed behaviours: the close drops the chart in one
frame at full opacity, and a tapped or keyed open leaves your own chart showing you on a cell the
room no longer has you on. And the kill condition still stands at 94.64 px. None of this breaks a
constraint, and each item is closable, so the verdict is ADVANCE, not BLOCK or RETIRE.

## 0 · What I ran myself (run 2)

These are my servers, each on a private cacheDir, and all were killed by recorded PID before I returned:
- dev `127.0.0.1:4246`: the work tree, cacheDir `.vite-cache-plr-place-crit`
- control `:4247`: `w7-control` dist, `index-CubiZsMVSwTc.js`
- built dist `:4248`: my own build, cacheDir `.vite-cache-plr-place-crit-build`, outDir in the scratch
  dir. **It hashes to `index-DNV3QLTCvEPL.js`, the prototype's claimed identity, reproduced.**

Instruments and logs are in `critique/PLR-PLACE/run2/` (92 KB). An earlier attempt of this critic
(17:06–17:07, died before writing this file) left `critic-readings.txt`, `aa-*.json` and
`instruments/critic-k*.spec.ts`. Its K1 (hostage) and K6 (close) readings pointed me at two of the
defects below. I re-ran both myself this run and cite only run-2 numbers, except where a line says
"attempt 1".

| # | what | chromium | webkit |
|---|---|---|---|
| H | hostage. C moves once while nobody, peer B, or you (A) walk at 4 steps/s for ~4.2 s. C's dot on A's open chart, sampled every ~520 ms | none: steps by **1038 ms**. B walks: held **8/8 samples, 4177 ms**. A walks: held **8/8, 4117 ms** | none: **1087**. B: **8/8, 4451**. A: **8/8, 4384** |
| CL | close, Escape and mark click: last open frame → first shut frame | **182.38 → 86.38 at opacity 1, chart gone**; 18 visible shut frames, all without the chart | **182.38 → 86.37/86.38**; 15 frames, all without the chart |
| K4 | kill arm 390×664 coarse `hasTouch`, two at the table, regime witnessed on both pages | lap **94.64**, H 182.38, chart 96, gridTop 131.73; a tap at the lap centre hits the `sheet`, shuts it, values unchanged, active `BODY` | lap **94.95**, gridTop 131.42, same |
| K2 | tapped open, 390×844 coarse | B saw A's dot before (1). After A tapped its mark: **A's own chart draws A's ring (1), B's chart draws 0 dots for A** | same, **1 / 0** |
| PI | π solo, ONE product-minted encoded payload (`ATMuMjA0…`, sameBoard true), regime witnessed; arms dist-vs-HEAD, dev-vs-HEAD, HEAD-vs-HEAD | dist: **2 keys**, `.mobile-attribution`/`.corner-left` 75.53→120.66 (claimed) and `.players-roster` (sr-only 1×1: `flex`→`block`, x −1, y −3.39). dev adds a third, `.zone-row-label` colour `color(srgb 0.14902…)` → `0.15`. HEAD-vs-HEAD **0** | identical key sets, both regimes |
| SENS | threshold-sensitivity rows for the ring and a peer dot, per ink column, against paper (1280×800 DPR 1) | ring: worst column **5.131** light / **8.016** dark, 0 columns under 3:1. Dot (cell 10): **4.942 / 9.343**, 0 under 3:1 | ring **5.653 / 8.796**. Dot **5.026 / 9.544**. 0 under 3:1 |
| FILT | built dist `DNV3QLTCvEPL`: estate `filter-census.spec.ts` + the prototype's pose probe | estate **6/6**. Poses: live **9·9·9**, `<filter>` 15·15·15, 4/4 | estate **6/6**. Poses 9·9·9 in all readings. **One of 4 coarse-reduce runs drew 0 dots** (3/3 on re-run). A probe flake, not a filter reading |
| E2E | `e2e/player-place.spec.ts`, 10 tests per engine, on the dev tree | **10/10** | **10/10** (20/20, 3.2 min, exit 0). Green on a tree carrying §1.1–§1.3 |
| unit | `PlayerMark.hostage.test.ts` (2 rows, fake timers) on a scratch copy of the tree | **2/2 RED** (`p2 at +1000 ms` unmoved). With the 3-line cure: **3 files 12/12 GREEN**, the family's 10 existing rows included | n/a |

`vue-tsc -b` exit 0. vitest chunked `src/pencil/chrome` + `src/games/shared`: **43 files / 507 tests**, exit 0 (the prototype's 9/77 + 34/430). I also ran these gates bare on the work tree, all exit 0: `check-copy-register` (bare, and
`--self-test`), `check-font-coverage`, `check-pw-projects --self-test`, `check-motion-contract
--self-test`, `check-theme-tokens --self-test`, `check-live-regions --self-test`. The first pass of
four `--self-test` runs exited 1 with a Node crash while a WebKit run was loading the box. Re-run
alone, all were exit 0 (incident C2). The r0 law probe copy exits 0, with L1–L6 GREEN and R1–R3 RED
as on main, reproduced. MOT-VERB's undefined-token census (copied from the §13 tree, root re-pointed)
reads **0 timing / 0 other**.

**Every gate I could plant against went RED on a broken copy:**
- census: 2 planted `var(--place-undeclared-dur)` → 2 timing hits
- copy-register: an em dash in `LOBBY_COPY.unplaced` → exit 1. `candidate` in the same string → exit 1
- font coverage: a planted `x` → exit 1, "THE RANSOM NOTE"

## 1 · The defects pass 4 did not see

### 1.1 THE HOSTAGE: one party's move restarts every other peer's settle clock (both engines)

`PlayerMark.vue` watches `[isOpen, () => props.place?.cursors]` with `deep: true`. On every fire it
does `clearTimeout(timers[id])` and re-arms the timer for **every** id whose position differs from
`settled`, not only the id that changed. So any change to the map re-arms all pending peers: a
walker's `cur`, a join, a leave. With `deep: true`, Vue also runs the callback every time the getter
re-runs, and `App.vue`'s `markPlace` is rebuilt whenever your own `lastCell` moves, so your own walk
does the same. The file's own sentence ("restart on a newer one") and the constant's comment ("hold
the latest arrival, restart on a newer one, draw when it fires") both describe a per-peer clock. The
code keeps one clock shared by the room.

Measured (H): C's single move is held for the whole 4.1–4.5 s walk, 8/8 samples on both engines,
whether B walks or A walks. With nobody walking, C steps inside ~1.04–1.09 s. In any room of three or
more where one person is typing, every other dot is frozen until that person stops. The chart answers
"where has everyone settled", and when someone is active it answers wrongly.

The gates can't see it. e2e row 1's negative control moves ONE peer. The unit row "holds a MOVE" moves
ONE peer. G1 replays ONE walker. `run2/instruments/PlayerMark.hostage.test.ts` has two rows, a peer
walking and your own cell walking. Both are RED on this tree and GREEN under
`run2/instruments/PROPOSED-hostage-cure.diff`: a `pending[id]`, plus `if (id in timers &&
pending[id] === pos) continue`, 3 lines. The family's existing unit rows stay green (12/12). The e2e
needs the three-party row, both engines.

### 1.2 THE CLOSE IS A CUT, THEN A FADE OF A DIFFERENT SHEET (both engines)

`PlayerLobby.vue` mounts the chart `v-if="open && chart"`. On close, the chart unmounts in the first
shut frame while the sheet is still at opacity 1. The sheet goes from 182.38 to 86.38 in one frame,
and the 150 ms fade plays over a list-only sheet: 18 visible frames in Chromium, 15 in WebKit, none
with the chart. The same holds for Escape and a mark click. No frame and no row covers it. That makes
it the unverified-gestalt tell on the state every reader meets at every close, and it's a 96 px jump
in the middle of a surface that otherwise only fades. The fix is closable: keep the chart mounted
through the fade (`v-if="chart"`; `settled` doesn't move while shut, so G4's shut clause holds), and
add a CL row with its planted negative control.

### 1.3 YOUR CHART SAYS YOU ARE ON A CELL THE ROOM SAYS YOU LEFT (touch and keyboard opens, both engines)

The touch cure is honest about its price ("the room hears one null and loses your dot"), and that
price is declared. What is NOT declared is the other half. `markPlace.self` reads `lastCell`, which
outlives the `null` the blur sent, so A's own chart keeps drawing A's ring. K2 reads **ring 1 on A,
0 dots for A on B**, both engines. Attempt 1's K2k read the same after a keyboard open (Tab to the
mark, Enter). That brings back pass-3 §1.3's class, "your chart and the room's chart disagree", by a
different road. Meanwhile `useSession.ts:997–998` still says "so the chart you read and the chart the
room reads agree". To close it, pick one:
- the ring reads what the wire holds (`curSent`), so on a tapped open you see yourself unplaced, as the room does; or
- the leader's arm (b), prevent the touch and toggle on `pointerup`, which keeps the cell and the dot.

Either way the row asserts that A's ring and B's dot agree after a tap and after a keyboard open.

### 1.4 THE OWNER'S NO ARM IS FRAMED BUT NOT BUILDABLE

Frame 4, the list-only arm, is "a source flip, reverted". The tree holds no const, prop or flag that
builds it. U-10 asks for both arms "buildable and framed". PLR-SELF's `SELF_TAKES_ROOM_INK` is the
estate's own form for this: one un-exported const, and flipping it is the whole arm. To close it, add
`const PLACE_CHART = true` (or omit `place` behind it). Frame 4 then says which const it flipped.

## 2 · What is earned (reproduced by me, run 2)

- **Cold open is cured.** Attempt 1 read 5.8 / 6.0 ms from press to first dot, 3/3 peers (pass 3:
  804/812 ms empty). e2e row 1 is green on both engines this run, and the prototype showed its ablation
  RED at 706/709 ms.
- **The self row asks nothing, the ring is 1, and law 33 holds in a room.** The sheet's first element is
  `svg.place-chart` with 0 `.pl-state`, and the mark's name is `3 other players` (attempt 1 K3, both
  engines). e2e row 2 is green.
- **The kill arm reproduces to 0.01:** 94.64 / 94.95 at 390×664, H 182.38. The lap-centre tap is owned
  by the sheet, shuts it, and changes no value. The dismissal the pass-3 critic said was never asserted
  now is, and I reproduced it at the arm that matters.
- **π for this family is clear, dist-vs-dist.** Nothing the chart adds exists solo. The two keys that
  move are the substrate's: the mark's width (claimed) and a 1×1 `sr-only` roster box. The HEAD-vs-HEAD
  noise floor is 0.
- **The filter budget holds on a built dist whose hash I reproduced.** Live filters 9 through three
  poses, two regimes, reduce and not, both engines, and the estate census 12/12.
- **Painted AA with the sensitivity row the prototype didn't carry.** The ring and the dot clear 3:1 in
  EVERY ink column on both themes and both engines. The worst column is the dot at 4.942 light
  (Chromium). The box rule's per-row figure (3.515 / 3.468 worst) was reproduced by attempt 1 (same
  instrument, same numbers).
- **M16, the font cut, the census and the r0 probe all hold, and each can fail** (§0).
- **The touch-seam finding is real, and it grafts back to the leader.** A WebKit `hasTouch` tap on a
  `pointerdown.prevent`ed button never clicks. Row 7 plants the pass-3 seam as its negative control
  in-run, and its reading is engine-asymmetric in the right direction.
- **The box rule cure is measured, not argued** (25–36 % of rows under 3:1 → 0). The pass-3 record's
  7.565 is corrected against the family.
- Not a generic default. There's no consumer-less substrate, and no legacy alias beyond one stale
  sentence (`useBoardShape.ts`: "the chart must be able to draw an empty board solo". The chart never
  draws solo, `chart` is `null` when `!live`.)

## 3 · Open gaps (each closable, numbers attached)

1. **The hostage.** A walking peer, or your own walk, holds every other peer's pending dot for the whole
   walk: 8/8 samples over 4.1–4.5 s, both engines (control 1.04–1.09 s). To close: land the 3-line
   `pending[id]` guard and a three-party e2e row, both engines, with the ablation RED in-run.
2. **The close cut.** The chart unmounts at opacity 1 (182.38 → 86.38 in one frame), with 18/15 visible
   frames of a chart-less fade. To close: keep the chart mounted through the fade and add a close row
   with its negative control.
3. **Your ring vs the room's dot after a tapped or keyed open.** Ring 1 on A, 0 dots for A on B, both
   engines. To close: have the ring read `curSent` or build the leader's arm (b), then add the
   agreement row. Until then, restate `useSession.ts:997–998`.
4. **The NO arm isn't buildable.** To close: one un-exported const, with frame 4 re-shot from it.
5. **THE KILL CONDITION (the owner's, U-10).** The chart arm laps 94.64 / 94.95 at 390×664 with two at
   the table, against 17.53 / 17.84 for the list arm. The chart costs +77.1 px of lap, and 390×844 with
   five at the table laps 71.81. Nothing in the design shrinks the chart. This row stays open until the
   owner disposes, with both frames on one encoded board.
6. **Thin-lap tap.** At 390×844 with two rows (lap 4.64 / 4.95), a tap 2 px inside the sheet's bottom
   edge focuses the board cell under it, on both engines. To close: a tap-floor-sized dismissal margin,
   or measure the finger footprint at the real device (RUNSHEET).
7. **G1 is n=1 per arm, WebKit only** (700: 35.7/min, 800: 32.7/min). To close: n ≥ 3 per arm with the
   spread, plus Chromium. Re-run it after gap 1's cure, because the cure changes when dots step (more
   steps with several movers).
8. **Row 7's tape clause is vacuous in Chromium `hasTouch`** (0/25 samples, HEAD `74a2b5d9`
   identically). It's the fold's row (3C-4). The chair needs its owner's re-measure and an M19 RUNSHEET
   line for the real iPhone tap on the mark.
9. **Carried from the substrate (the leader's to book, not PLACE's cure).** The sheet's CSS `border`
   (R6 L5, and the r0 L5 row can't see it). `.players-roster` solo `flex`→`block` / y −3.39 on a 1×1
   `sr-only` box (paint-free, missing from the prototype's 11-key census). The mark's focus-ring fringe:
   24 % of ring pixels under 3:1 light in Chromium. WebKit read 0.176 in the prototype's run and 0.441
   in attempt 1's run of the same instrument, same p50 6.136, so the fringe figure is unstable across
   runs.
10. **Not run by anyone:** G10 board-unbound, `multiplayer.spec.ts` (relay), the golden estate, and real
    iOS (M19).
11. **Box-rule margin:** worst row 3.468 in WebKit light is 0.47 over the floor at the token's own
    ceiling. The row is honest, and no stroke weight buys more.

## 4 · Failure-mode checklist

| tell | hit |
|---|---|
| vacuous convergence | no |
| spec cites itself | no |
| **gates that cannot fail** | **PARTIAL.** Row 7's tape clause in Chromium (annotated by the lane). The damping gates CAN fail, but all are single-mover, so the cross-peer restart is outside every one of them (§1.1). The ring/dot AA rows were single best pixel with no sensitivity row (now read by me: clean) |
| **elegant-reduction trap** | **YES.** The kill condition at 94.64, in the lane's own words: "nothing in this design makes the chart smaller" |
| legacy aliases | no (one stale rationale sentence in `useBoardShape.ts`) |
| **masked fallbacks** | **YES.** `lastCell` outlives the wire's `null`, so your ring is drawn where the room has you nowhere (§1.3) |
| **unverified gestalt** | **YES.** The close: a 96 px cut at full opacity, then 150 ms of fade on a sheet nobody framed (§1.2) |
| consumer-less substrate | no |
| generic default | no |
| **π (the pixel it didn't declare)** | **no** for this family, dist-vs-dist both regimes both engines. The two deltas are the substrate's (one claimed, one a paint-free 1×1 box the leader books). The dev arm's `.zone-row-label` colour serialisation (`0.14902` vs `0.15`) is a pipeline artifact: π rows must be dist-vs-dist |
| **constraint it forgot** | **PARTIAL.** U-10's "buildable" on the NO arm (§1.4). R6 L5 on the sheet, carried from the substrate. The LAWS sensitivity row on thin strokes was absent (closed by my reading). AA, filterBudget, M16, W2's mechanics, the @property law (no registration minted by this family; `--head-rule`'s is the leader's) and the token census are all CLEAR |

## 5 · Ballots and fork rows

- **OWNER (U-10), the kill condition.** Frame 1 (chart arm, 182.38 tall, lap 94.64 / 94.95) against
  frame 4 (list arm, 105.27, lap 17.53 / 17.84). 390×664 coarse light, one encoded board, both engines.
  I reproduced both laps on my own run of the chart arm. Frame 4's arm needs gap 4 closed before the
  ballot is clean.
- **LEADER (PLR-SELF), the touch seam.** (a), landed here: you lose your dot to the room, and with
  §1.3 open your own chart lies about it. (b), unbuilt: keeps the cell. Gap 3's cure decides which
  arm leaves the least residue. Pass-3's prevent-all is not lawful (WebKit's tap is dead).
- **CHAIR.** The 3C-4 tape in Chromium `hasTouch` (gap 8), and the RUNSHEET line for the real iPhone
  tap on the mark.

## 6 · Cross-pollination

1. **The multi-mover row for any receiver-side debounce.** Every per-key timer map in the wave
   (PLR-COUNT's tweens and `settle()`, any `useTwoTap`-like clock) should be tested with TWO keys moving
   at once. One mover can't see a shared clock, and a `deep: true` watch re-fires on every getter re-run,
   not only on the key that changed.
2. **A close is a pose too.** Any `v-if` coupled to an `open` flag inside a fading container cuts at
   opacity 1. Grep `v-if="open &&` / `v-if="isOpen &&` inside transitioned sheets.
3. **π is dist-vs-dist.** A dev server serialises `color-mix`/literal colours differently from the
   minified dist (`0.14902` vs `0.15` on `.zone-row-label`), so a dev-vs-dist census reads a pipeline
   delta as a product one. Keep a HEAD-vs-HEAD arm as the noise floor.
4. **The sensitivity row is cheap** (`run2/instruments/probe-ringsens.spec.ts`): per ink column, the
   best pixel, then the worst column at 50/70/90/100 % of median mass. Watch a clip that catches a
   neighbouring rule (my first dot clip at cell 20 read 3.53 off the box rule: incident C3).

## 7 · Incidents (the critic's own)

- **C1.** An earlier attempt of this critique (17:06–17:07) died before writing the file. Its
  readings, `aa-*.json` and two spec files stay in `critique/PLR-PLACE/` and are cited only as
  "attempt 1". Its dist build hashed `index-CSUeP6ayvFiw.js`, not the prototype's. My run-2 build
  reproduces `DNV3QLTCvEPL`, and the cause of attempt 1's hash is unknown.
- **C2.** Four `--self-test` gates exited 1 with a Node crash while a WebKit run loaded the box. Re-run
  bare and alone, all were exit 0. The disk read 99 % full (35–36 GiB free, down from 74 GiB at
  open), and none of it was this lane's (scratch < 1 MB).
- **C3.** My first sensitivity clip for the dot (B on cell 20) took in the 1/3 box rule and read a
  worst full-mass column of 3.533. Re-cut with B on cell 10: 4.942. The first figure is struck.
- **C4.** The prototype's pose probe (`probe-filters`) drew 0 dots in 1 of 4 WebKit coarse-reduce runs
  (live filters 9 throughout). A timing flake in the probe (the peer's `cur` arriving after the open
  waits its 700 ms by design), not a budget reading.
