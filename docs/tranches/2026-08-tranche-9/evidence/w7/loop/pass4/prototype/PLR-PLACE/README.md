# PLR-PLACE · pass 4 (PROTOTYPE) — where the room is, rebuilt on the substrate

T9-W7 §11, family PLR-PLACE. REBUILD lane: the pass-3 worktree was lost, so the pass-2 patch was
replayed, then the tree was re-seated on PLR-SELF's banked `substrate.diff` and the family's own
pieces re-grafted onto the leader's `PlayerMark/`. Nothing committed. U-10: this proposes. The pass-4
number is the critic's.

| | |
|---|---|
| worktree | `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE`, branch `w7/p4-plr-place`, base **`74a2b5d9`** |
| diff | `git diff --stat` = 28 files, +2,647 / −374 vs `74a2b5d9` (substrate + PLACE; new files intent-to-add). PLACE's own delta over the substrate: 14 tracked files +366/−32 + 5 new (PlaceChart.vue 148, useBoardShape.ts 26, two unit files 213, `e2e/player-place.spec.ts` 531) — banked as `place-over-substrate.diff`; the whole tree as `pass4.diff` (`git apply --check` on a `git archive 74a2b5d9`: exit 0) |
| dev | `127.0.0.1:4243`, private cacheDir `.vite-cache-plr-place` — killed by PID |
| HEAD control | `127.0.0.1:4244`, the shared `w7-control` dist, verified **`index-CubiZsMVSwTc.js`** — killed by PID |
| built dist | `127.0.0.1:4245`, own cacheDir `.vite-cache-plr-place-build`, identity **`index-DNV3QLTCvEPL.js`** — killed by PID |
| frames | 4, 57,720 B total, each a chromium∣webkit pair on ONE encoded board, each a replacement (§6) |

## 0 · Gaps first

1. **The kill condition holds, smaller.** 390×664 coarse, two at the table: the sheet is 182.38 tall
   and laps the board by **94.64** (webkit 94.95). Pass 3 read 127.69; the 33.05 saved is the state
   line struck by law 33 (S 18.89), the chart's 8px berth, the 3.75 head the substrate shortened,
   and 2.4 of row margin. The list-only arm (the substrate alone, frame 4) laps by **17.53**. The chart
   costs **+77.1 px of lap** on a short phone, and at 390×844 five at the table now lap by **71.81**
   where the list arm clears. Nothing in this design makes the chart smaller. The owner disposes.
2. **A tap now opens the sheet by leaving the cell** (§3.2). On a phone the room hears one
   `cur {p: null}` and loses your dot (measured both engines: `cur [null]`, B's chart 0 dots for A).
   "Opening sends nothing" holds for a mouse only. The alternative (prevent the touch, toggle on
   `pointerup`) keeps the cell and costs a second handler; it is the leader's row, not the owner's (§5).
3. **The thin-lap tap reaches the board.** At 390×844 two rows (lap 4.64 / 4.95) a TAP 2px inside the
   sheet's bottom edge, over the board, focuses the cell under it, both engines; a mouse click at the
   same point does not; taps 6, 12, 24px in do not. Every other lapped arm (13) dismisses at its lap
   centre with no cell reached. A finger is wider than 4.6px.
4. **The coarse attribution tape (3C-4) never rises in Chromium `hasTouch`**, on the HEAD control
   exactly as here: 0 of 25 samples over 1.2s after a tap on a peer digit, seven cells, both trees.
   WebKit raises it 4/4. That is the fold's row, not this family's; row 7's "no tape under the
   sheet" clause is therefore vacuous in Chromium and says so in an annotation.
5. **G1 is one run per arm.** WebKit 700 read **35.7** moves/min (≤40 GREEN) against passes 1–2's
   40.6 on older trees; 800 read **32.7**. n = 1 each, so the spread is unknown and 700 is not
   proven safe by one reading. Chromium was not re-run this pass.
6. **The box rule sits at its token's ceiling.** After the cure (§3.4) every row of the painted rule
   reads ≥3.468:1 light, and 3.515 is `--ink-press-rule`'s own full-ink ratio on the sheet: 0.47 of
   margin, and no stroke weight buys more.
7. **The mark's focus ring (the leader's) has an antialiased fringe**: 24% (chromium) / 18% (webkit)
   of ring pixels under 3:1 light, 19% / 17% dark; the core reads 6.136 / 9.711.
8. **Not run**: G10 board-unbound; `multiplayer.spec.ts` (relay) and the golden estate; real iOS
   (M19: the WebKit tap finding in §3.2 wants the owner's RUNSHEET line).
9. **Inherited from the substrate and touched here** (the leader's to book): `player-mark.spec.ts`
   was missing from `SPEC_MANIFEST` (check-pw-projects RED on the bare substrate); the sheet wears a
   CSS `border` (R6 L5 binds every drawn edge this pass mints; the r0 probe's L5 row reads the guard
   verbs only, so it stays GREEN and cannot see it).

## 1 · The replay, and every conflict

**Route: in place.** The work tree was NOT clean at open (see incident I1): a killed attempt of this
lane had left the substrate staged plus a graft, and two servers up. Its state was banked to the
scratchpad, the tree `git reset --hard 74a2b5d9` + `git clean -fd`, then:

1. `git apply --3way pass2/prototype/PLR-PLACE/pass2.diff` — **31 files, 28 clean, 3 conflicted**:

| file | conflict | resolution |
|---|---|---|
| `scripts/check-copy-register.mjs` | 2 hunks (pass 2's `COPY_SOURCES` vs the fold's `COPY_TABLE_NAME`) | fold's file whole (`cmp` = HEAD) |
| `scripts/check-font-coverage.mjs` | 3 hunks | both derives kept; the fold's strings (`what fits`, `finishes the board for you`) won |
| `GameControlPanel.test.ts` | 1 hunk (pass 2's solo `your cell` caption) | fold's (the row is room-only since pass 3) |

   **Line-count check, every file** (`base + additions − deletions` vs disk): **28 of 31 exact**; the
   three misses are the three files with markers (+6, +10, +6 — marker lines, not dropped hunks).
   `vue-tsc -b` **exit 0** on the resolved replay. The patch's non-product dirs (`crit-probe/`,
   `probe/`) were unstaged and moved out.
2. **Re-seat (charter):** tree reset again, `git apply --3way pass4/prototype/PLR-SELF/substrate.diff`
   — **20 files, 20 clean, line count 20/20 exact**. PLACE's pieces were then grafted onto the
   leader's `PlayerMark/` (the killed attempt's graft, reviewed hunk by hunk and re-applied; `git diff
   HEAD` byte-identical to its bank, `cmp`). The pass-2 stand-ins (`PlayerSign`, `PlayerLobby`,
   `lobbyCopy` in `games/shared`) are gone; `PlaceChart.vue` moved to `PlayerMark/` unchanged.

## 2 · The numbers

### 2.1 The family's e2e, `e2e/player-place.spec.ts` — 8 rows × 2 engines

**20 / 20** on the first full run; on the final tree **19 / 20** (row 7 Chromium RED on its tape
precondition, gap 4), then row 7 re-cut to READ that precondition and re-run ×2 per engine, **4 / 4**; and
**born-RED demonstrated on this tree**: with the four cures ablated in one run (the seed, the self
query, the Shown republish, the PRM block) rows 1, 2, 3, 8 went **8 / 8 RED** —
`openMs 706.3 / 709` (the pass-3 emptiness), the query and wire rows, and
`0.15s, 0.15s, 0s|0s, 0s, 0.15s` under reduce; with the ring binding ablated row 2 went RED on both
(`rgb(37, 99, 235)` against the mark's `oklch(0.5 0.11 0)`); row 7 carries its negative control in
the same run (the pass-3 seam planted: WebKit `aria-expanded false`, Chromium `true`).

| row | charter | reading |
|---|---|---|
| 1 cold open | 1 | first dot **inside 100 ms** of the press, 3 of 3 peers; a move after the press still held at +300 ms and stepped after |
| 2 query at four | 2, 4 | peer row: one dot `1`, two `0.55`; own row: `1,1,1`, ring `1`; ring stroke = the mark's ink |
| 3 Hidden / Shown | 3 | Hidden `cur [null]`, B draws 0 dots for A; Shown `cur [30]` once, B's dot at (3,3) to 3 decimals |
| 4 head still | 5 | 0 mutations on the mark's PARENT (button + sheet) over 30 cells shut; the same scope > 0 once open |
| 5 pitch | 6 | 4×4 / 9×9 / 16×16 unconditional: side 42.656 / 96 / 170.656 (`32/3·N`, 1/64 px snap), dot and ring 8.00 |
| 6 qualifiers | 7 | `you` · `2x seconds ago` on the silent peer · `no cell shown` · `""` on the placed peer; name `3 other players`, roster 4 |
| 7 phone tap | 9, 10 | tap opens both engines; tape count 0 under the open sheet; the sheet owns `elementFromPoint` in the lap; one tap there shuts it, no cell reached, values unchanged |
| 8 reduce | 12 | `0s|0s` on every `[data-lobby]`, shut and open |

### 2.2 The lap law — fourteen arms, regime witnessed, dismissal at every lapped arm

In a room the chart is the first line (§3.1), so the law loses the state line and the berth:

```
H = 36 + 10.667·N + 5.6 + 22.39·r + (1.6 + S)·m        N the board's side, r rows, m ∈ {0,1}
lap = max(0, sheetTop + H − gridTop)   sheetTop 44 coarse · 51.75 fine
```

Δ against the measure: **−0.02 / −0.05 at every arm, both engines** — the residual is the row's
1/64 px snap (1.4rem lays out 22.390625), so with 22.39 the law is exact.

| arm | r·m | H | lap chromium / webkit |
|---|---|---|---|
| 390×844 coarse 9×9, 2 at the table | 2·0 | 182.38 | 4.64 / 4.95 |
| 390×844 coarse 9×9, 5 | 5·0 | 249.55 | 71.81 / 72.13 |
| 390×844 coarse 9×9, 6 | 4·1 | 247.64 | 69.91 / 70.22 |
| **390×664 coarse 9×9, 2** | 2·0 | 182.38 | **94.64 / 94.95** |
| 390×664 coarse 9×9, 6 | 1·1 | 180.47 | 92.73 / 93.05 |
| 390×844 coarse **16×16**, 5 | 5·0 | 324.20 | 146.47 / 146.78 |
| 390×844 coarse **16×16**, 2 | 2·0 | 257.03 | 79.30 / 79.61 |
| 1280×800 fine, 2 / 5 / 6 | 2·0 / 5·0 / 4·1 | 182.38 / 249.55 / 247.70 | 109.67 / 176.84 / 175.00 (wk +0.30) |
| 1280×720 · 900 · 1000 fine, 2 | 2·0 | 182.38 | 109.67 · 75.67 · 25.67 (wk +0.30) |
| 1024×800 fine, 2 | 2·0 | 182.38 | 109.22 / 109.52 |

Dismissal (a tap or click at the lap's centre): **owner `sheet`, shut, values unchanged at all 14**;
no cell reached at 13 — the 14th is gap 3.

**The desk `gridTop` law, written** (1280 wide, fine): `gridTop = max(124.45, 0.5·vh − 291.55)` —
exact at 720 and 800 (the floor) and at 900 and 1000 (158.45, 208.45); WebKit sits 0.29 lower at
every height; 1024×800 reads 124.91. The phone law stands: `0.5·vh − 200.27` at 390 wide.

### 2.3 π against the HEAD control `74a2b5d9`, solo, ONE encoded board

Both arms loaded the same product-minted `?board=` payload (the invite's share link;
`sameBoard: true`), regime witnessed on both pages. Eleven keys read for box, colour, background,
font family/size/line-height/weight and tag. **Exactly one key differs**, in both regimes, both
engines: `.corner-left` (1280×800 fine) / `.mobile-attribution` (390×844 coarse) **75.53 → 120.66
wide** — the substrate's mark (PLR-SELF's claimed surface), same paint, same tag. Nothing this
family adds exists solo.

### 2.4 The well (G19) and the caption (G9)

| well holding the room's verbs, 1280×800 | solo | two at the table |
|---|---|---|
| HEAD `74a2b5d9` | 66.38 | 88.47 |
| this tree | **66.38** | **100.02** |

G19 `≤ 109`: **GREEN** — the `your cell` row costs +11.55 in a room, paid by the substrate's roster
move (pass 3 read +55.03 unpaid). G9: `your cell` one line, row overflow 0, chips inside the well,
chips 44 tall at 390 coarse and 45 at 1023 fine, both engines.

### 2.5 Painted AA — bytes, DPR 1, both themes, both engines

| row | light | dark |
|---|---|---|
| your ring (now YOUR ink, §3.3) | 6.193 | 9.639 |
| peer dot vs the sheet | 5.594 | 10.548 |
| chart frame | 12.595 | 10.872 (wk 11.093) |
| box rule, best row | 3.515 (wk 4.274) | 4.359 (wk 5.212) |
| box rule, **worst row / rows under 3:1** | **3.515 / 0** (wk 3.468 / 0) | **4.359 / 0** (wk 4.364 / 0) |
| mark focus ring (leader's) p50 / share under 3:1 | 6.136 / 0.239 (wk 0.176) | 9.711 / 0.189 (wk 0.169) |

Before the rule cure the same clip read worst row **2.095** (wk 2.071), median 3.25, **25% / 36%**
of rows under 3:1 light. Pass 3's "painted 7.565" is not reproduced: the best row this pass is
3.515, which is the token's own projection pass 3 called an under-read. The pass-3 number was wrong.

### 2.6 The budget, on the BUILT dist `index-DNV3QLTCvEPL.js`

- `e2e/filter-census.spec.ts` (the estate's): **12 / 12**, both engines.
- The three poses (shut · open solo · open live with a dot), fine and coarse, with and without
  reduce, both engines: live filters **9 · 9 · 9 in all 16 readings**, `<filter>` elements 15 · 15 · 15.
- `patrickhand-subset` on the dist **4,312 B**, unchanged.

### 2.7 G1 and the 60-second stillness (WebKit, the replay copied from pass 2, OUT re-pointed)

| arm | ordinary | sweep | SLOW control (⅓ cadence) | G4, 60 s shut |
|---|---|---|---|---|
| `PLACE_SETTLE_MS` 700 | **35.7**/min | 2.9 | 21.4 (64 of 71 frames survive) | 0 mutations / 62.5 s |
| 800 (flipped, run, flipped back) | **32.7**/min | 2.9 | 21.4 | 0 / 62.5 s |

The SLOW control reads the input (a third of the cadence, most moves outlast the settle), so the
counter is not clamping. G4 now observes the mark's PARENT for the stated 60 s, not 6.

### 2.8 Battery, bare, final tree

`vue-tsc -b` 0 · `vue-tsc -p tsconfig.e2e.json` 0 · `check-copy-register --self-test` 0 and bare 0
(0 dashes, 0 unadmitted, **0 admitted**) · `check-font-coverage` 0 (Patrick Hand 46 codepoints,
4,312 B, 30 strings over 5 groups, `lobbyStrings` derived + `no cell shown` declared) ·
`check-motion-contract` 0 · `check-pw-projects` 0 (36 specs, 581 tests; floor band re-stamped, 2
floors moved) · `check-theme-tokens` 0 · `check-live-regions` 0 · prettier 0 · eslint 0 · boundary 0
· knip 0 · vitest **70 files / 841 tests** (chrome 9/77 · games/shared 34/430 · rest 27/334) · r0
law probe (copy, FE re-pointed) exit 0, **all nine rows as on main**.

Estate specs, both engines: `presence`, `session-substrate`, `access`, `follow-still-authorship`,
`join-language-prm`, `zone-grammar`, `player-mark`, `player-place` — all green after one re-aim
(§4) and one re-run (the reporter died of ENOSPC after 79 tests; the unfinished WebKit
`zone-grammar` rows ran separately, 11 / 11).

## 3 · What pass 4 changed on the substrate

1. **Law 33 (charter 11, registry §2.5).** In a room the chart is the sheet's first line and the
   state line is not drawn (`v-if="!chart"`); alone, it is drawn and `aria-hidden` (the ear heard it
   as the button's name). The count is said once.
2. **The touch seam.** `@pointerdown.prevent` → `onPress`: mouse and pen prevented, touch not.
   Under a WebKit touch the cancelled `pointerdown` cancelled the tap's click: the mark NEVER opened
   on a tapped phone (`aria-expanded false`; the `@mbabb` trigger opened in the same context). This is
   the leader's file and a graft back to PLR-SELF.
3. **Your ring wears your ink.** Unbound, the ring inherited the estate's default blue while the mark
   beside it wore the room's colour for you (frame 2 caught it). `PlaceChartInput.selfInk` = the mark's
   `ink`, bound on the chart, so the ring follows F1 in both arms.
4. **The box rule 1.25 → 2px** (§2.5).
5. The four pass-3 critic cures, re-built: the seed on open, the self row asks nothing, `Shown`
   republishes `lastCell` (and sets `curSent`), the PRM double selector with `transition-delay: 0s`.
6. `your cell` (room only), `no cell shown`, `curSent`, `lastCell`, `useBoardShape` — replayed.

## 4 · r0 / R6 rows MOVED

- **r0 law probe**: no row moved (L1–L6 GREEN, R1–R3 RED, identical to main).
- **R6 law 33**: cured on this surface; the LEADER'S e2e row `player-mark.spec.ts` "the sheet never
  scrolls…" is **MOVED** (it read `.pl-state` = `8 other players`; it now reads `''` and the mark's
  name `8 other players`) — run green both engines. The leader's row to accept.
- **`SPEC_MANIFEST`** gains `player-mark.spec.ts` (the substrate's miss) and `player-place.spec.ts`;
  `census.stamp.json` re-stamped for the floor band.
- R6 L17 (as amended): `data-peer` on a dot is a hook, no style reads it; the dim is a class.
- M16 row 13: `no colour yet` no longer exists in any rendered string; `colour` appears only in
  comments. No chair row needed.

## 5 · For the owner (U-10) — the ballot, both frames on one board

**The kill condition.** Frame 1 (the chart, 182.38 tall, laps 94.64 at 390×664) against frame 4 (the
list alone, 105.27, laps 17.53), two at the table, one encoded board, both engines. The chart shows
where everyone is; on a short phone it covers the top two rows of the board while you read it, and
one tap anywhere on it gives them back. Default leans the chart where the lap is priced by one tap;
the owner disposes.

## 6 · Frames (4, each chromium ∣ webkit, one encoded board)

| file | engine · theme · viewport · pointer | shows | retires (pass 3) |
|---|---|---|---|
| `frames/1-kill-664-chart-arm-coarse-light.png` (19,208 B) | both · light · 390×664 · coarse `hasTouch` | the chart arm, lap 94.64 / 94.95 | `1-chart-9x9-phone-coarse-light.png` |
| `frames/2-query-at-four-desk-fine-light.png` (8,949 B) | both · light · 1280×800 · fine (mouse hover) | peer row hovered: one dot 1, two 0.55; your ring in your ink | `3-query-hovered-row.png` |
| `frames/3-cold-press-first-frame-desk-fine-light.png` (14,413 B) | both · light · 1280×800 · fine | two rAFs after a cold press: the dots are there inside the fade | `2-chart-16x16-desk-dark.png` (the pitch is now row 5's numbers) |
| `frames/4-kill-664-list-arm-coarse-light.png` (14,706 B) | both · light · 390×664 · coarse `hasTouch` | the NO arm (list only, a source flip, reverted), lap 17.53 / 17.84 | `4a-well-live-room.png` + `4b-well-solo.png` (the well is §2.4's numbers) |

## 7 · Incidents, self-declared

- **I1** — the tree was dirty at open: a killed attempt of this lane (15:11–15:18) had staged the
  substrate and a graft and left `vite` on 4243 (PIDs 1826/1890) and a control on 4244 (1898) up for
  23 min. Killed by those PIDs, the state banked, the tree reset and replayed from scratch.
- **I2** — the first Chromium e2e run hung on row 7: after `invite` on a phone the dock stayed open
  and the board inert. Killed by PID (32843/32815/32814). The helper now shuts the dock.
- **I3** — my own instrument errors: the pitch read inside the sheet's 150ms scale-in (38.39 for
  42.67), then at 2-decimal precision against a 1/64 px layout; the dot AA clip's modal pixel is the
  dot, so that row reads dot-vs-sheet (the same ratio, stated).
- **I4** — one geometry arm failed on a roster join (3 of 5) while the battery ran beside it;
  re-run alone, green. Concurrency, not product.
- **I5** — the first 800-arm run died "execution context destroyed": the constant flip's HMR
  reload reached the test page. Re-run after a 12s settle; the constant is back at 700 (`grep`).
- **I6** — ENOSPC: the box's data volume hit 100% during the estate run (1.6–3.2 GiB free when read
  after) and the reporter crashed after 79 tests; not this lane's bytes (its scratch was < 3 MB).
- **I7** — the pass-3 record's painted rule (7.565 / 7.974) is wrong (§2.5).

## 8 · Where things are

`logs/` — the e2e runs (`e2e-place-both`, `e2e-place-final`, `e2e-r7`, `e2e-born-red-ablated`,
`e2e-ring-ablated`, `e2e-mark-row`, `e2e-zone-wk`, `estate-roster-specs`), `geom-readings.txt` +
`lap-*.json` + `geom-desk.log`, `pi-*.json`, `well-*.json`, `paint-final.log` +
`paint-before-rule-cure.log`, `filters-dist.log`, `rate-700-webkit.log` + `rate-800-webkit.log`,
`touchseam*.log`, `touchwire.log`, `thinlap.log`, `tapedebug-4243/4244.log`, `battery-final.log`,
`law-probe.txt`. `instruments/` — every probe run, the scratch PW and vite configs, the battery,
the law-probe copy. The work tree's scratch (`.plr-place/`, both cacheDirs) is deleted.
