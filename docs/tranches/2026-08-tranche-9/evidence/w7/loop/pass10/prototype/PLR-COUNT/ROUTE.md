# PLR-COUNT × PLR-PLACE · the one route (CHAIR pass-10 §9, PICK 9) — COUNT's side, written for PLACE

- **The shipped arm stands: PLACE's chart.** `PlayerLobby.vue`'s `<p v-if="!chart" class="pl-state">` is the union's
  arm (the WAVE 954bbbab, A3). COUNT moves no product byte for the eleven reds; COUNT's rows follow the arm.
- **COUNT's rows, re-authored (`e2e/player-tally.spec.ts` only):** one predicate on both arms, `stateWhy()`, read on the
  open sheet: the name counts the room; a chart and a drawn state line never share a sheet; with no chart the state
  line is drawn once and reads the count. The arm is read from PlayerLobby.vue's source (`CHART_ARM`, the `SIX_ARM`
  idiom). Each half is planted in the run (`STATE_PLANTS`: the state line flipped, the chart flipped) and must red.
  - `:539` short phone, `:569` tall phone, `:620` ×5 widest board: `.pl-state` text → `stateWhy(…) = []`.
  - `:888` ×4 G14: under the chart arm the `.pl-state` rung is read where it is drawn, alone (`1 player`, its own named
    payload, its own control read), before the room arrives; `.pl-qual`/`.pl-more` are read in the room. Every quiet
    line is read once, asserted.
  - `:1589` quiet peer: under a drawn chart the early read is `LOBBY_COPY.unplaced` (read from copy.ts), never a time.
- **Stacking:** COUNT's on-WAVE delta touches `e2e/player-tally.spec.ts` alone and is cut on 954bbbab + homes v3
  (`homes.on-WAVE.diff` 0723d508 → 8c46d9de) + PLR-SELF's `pass10.delta.on-WAVE.diff` 540b93da. A PLACE delta that
  leaves player-tally.spec.ts alone commutes with it; one that edits it is the conflict to name.
- `player-place:307` is PLACE's row; COUNT does not touch it.

## The one red the route leaves (read 02:54, chromium, the union `455b6956`)

`:569` the tall phone (390×844 coarse, sixteen people), re-authored to the shipped arm: under PLACE's drawn chart the
key draws **1 row** (`and 15 more`), and **the sheet's bottom reads 224.47 against the board's first cell top 221.73: a
2.74 px lap** (WebKit, the same run of the route at 02:54–02:58: 1 row, 224.47 against 221.42, a 3.05 px lap) (COUNT's tree, no chart: 4 rows, the sheet clear). The clause "the sheet clears the board's own top on the
tall phone" is not re-worded. PLACE's chart is drawn only where it "laps no more of the board than the list alone"; here
the list alone laps nothing and the chart's pose laps 2.74 px. That predicate is PLACE's to price or cure; COUNT carries
the red with its number.

## The one route run whole (03:49–03:56): SELF + COUNT + PLACE pass 10 on 8c46d9de (frontend `e999e521`)

PLACE's pass-10 delta does not move the tall phone: TRI (chromium) reads 1 row under the chart, **224.47 against
221.73**, and WTRI (WebKit) **224.47 against 221.42**, the same 2.74 px / 3.05 px laps (now `:630` in the stacked spec).
The other three reds on the route are TIN × SELF's (`:1504` ×2, `:1716`), GREEN on COUNT's tree. Everything else on the
route is GREEN in both engines: 25/29 chromium, 24/29 WebKit with `:540` skipped.
