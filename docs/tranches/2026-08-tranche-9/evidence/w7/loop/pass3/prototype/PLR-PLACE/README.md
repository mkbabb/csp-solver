# PASS-3 PROTOTYPE · PLR-PLACE · The seating chart

Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-53`,
branch `worktree-wf_f72f3b5a-83a-53`, base `74a2b5d9`. Nothing committed, pushed or stashed in any
tree; no file outside this worktree was edited. Servers: prototype dev `127.0.0.1:4243`, HEAD
control (the MAIN tree at `74a2b5d9`, read-only) `127.0.0.1:4244`, built-dist preview
`127.0.0.1:4245` — each on its own `cacheDir`, all killed before this was written.

## 0 · The replay, and what it carried

`git` aimed at the pass-2 worktree is REFUSED by the worktree isolation, so the replay route is the
chair's declared fallback: **files copied** out of `wf_8630d340-e56-54`, hand-merged where the fold
had moved the same file. `git diff --stat a8fee1f5 74a2b5d9` names the sixteen files the fold
moved; every one was re-cut ONTO the fold's version and the fold won every conflict.

| pass-2 file | route | note |
|---|---|---|
| `PlaceChart.vue` · `PlaceChart.test.ts` · `PlayerLobby.vue` · `PlayerSign.vue` · `lobbyCopy.ts` · `useBoardShape.ts` | copied whole | new files; the fold never touched them |
| `useSession.ts` · `useJoinWash.ts` · `pencilConfig.ts` | copied whole | outside the fold's sixteen |
| `BoardHost.vue` | hand-applied, 2 hunks | the fold's 3B-1 `cellAuthors` narrowing KEPT; pass 2 would have reverted it |
| `GameBoard.vue` | hand-applied, 2 hunks | pass 2's file reverts 3C-4/3C-4b whole (the coarse tape, the focusout clear, `hoveredPos`). Only the `lastCell` import and the one write in `onCellFocus` were taken |
| `GameControlPanel.vue` | hand-applied, 3 hunks | the `your cell` row moved INSIDE the room's own `<template v-if="session.roomId.value">`; the imports; the chips. B1b's `what fits` and the fold's solve tape kept |
| `App.vue` · `AttributionCard.vue` | copied whole | **substrate stand-in — see the gaps** |

STRIPPED, each named: `join-language.spec.ts` · `multiplayer.spec.ts` · `check-copy-register.mjs`
(`COPY_SOURCES` never replayed — the fold's `COPY_TABLE_NAME` reads `LOBBY_COPY` by name and
`lint:copy` is 0 without it) · `GameControlPanel.vue`'s roster hunk · the deletion of
`.player-row { color }` / `:style="p.ink"` / `.player-swatch` (the substrate keeps them, so r0
hue-census rows 127–128 are UNCHANGED and `instruments/r0-r2-authorship-rows.md` stays withdrawn) ·
the `candidates` → `your cell` zone row beside the pencils group · the `is-arriving` retirement
comment · T7-W2 A4's retirement · `PlayerSign.vue`'s seam comment.

## 1 · What pass 3 changed on top of the replay

1. `lobbyCopy.ts` — `LOBBY_COPY.many` holds the plural's WORDS; only the digit is composed on. The
   one lobby string that varies is now inside the table both gates read (critique §6).
2. `PlayerLobby.vue` — `.lobby-rows { gap: 0 }` (the `+4.7` residual's whole author, §5 below),
   `line-height: 1.35` declared on the sheet, the PRM block re-selectored to
   `.player-lobby, .player-lobby.is-open`, and a qualifier that tells the three silences apart.
3. `PlayerSign.vue` — `@focusout` DIES for a document `focusin` (WebKit hands `relatedTarget: null`
   for a press and for a Tab alike); `.player-sign-btn:focus-visible` written.
4. `GameControlPanel.vue` — `your cell` mounts only with a `roomId`.
5. `useSession.ts` — `setShareCursor(false)` sends its null only if the room is not already holding
   one (G5's two-nulls defect, reproduced and cured; §4).
6. `e2e/player-place.spec.ts` lands, inside `tsconfig.e2e.json` and `lint:motion`'s census, and
   `check-pw-projects`' SPEC_MANIFEST gains it.
7. `check-font-coverage.mjs` — the two new rendered strings declared in the corpus.

## 2 · π — the rect census, both pages in ONE declared regime (G18)

Control: the MAIN tree at **`74a2b5d9`** on :4244. Prototype on :4243. Both pages built from the
same `browser.newContext()` options; the regime is witnessed by `matchMedia` on both sides before
any rect is read. Solo scene (`?size=3&difficulty=EASY`), chromium. `logs/pi-census.json`.

| surface | 390×844 coarse | 1280×800 fine | 1280×800 coarse |
|---|---|---|---|
| `.controls-card` | **π** | **π** | **π** |
| `.action-bar` | **π** | **π** | **π** |
| `.board-wrapper` · `.page-root` · `.zone-row` · `.corner-right` | π | π | π |
| `.corner-left` / `.mobile-attribution` (the head corner) | +53.13 w, +3.75 h | +53.13 w, +8 h | +53.13 w, +3.75 h |

**Pass 2's `+32.83` is gone, measured, not argued**: the `your cell` row does not exist solo, so
the card and the action bar are byte-identical to HEAD in all three arms. The only surface that
moves is the one this family claims — the head corner, which grows by exactly the sign
(53.13 × 47.75) beside `@mbabb`. The P1 seal's scene (`goto("./")`, no room) is therefore unmoved
by construction, and the seal's own `.controls-card` reading is in the table above.

## 3 · The sheet's parts and the lap law (G8′) — closed form, ZERO residual

Seven arms, each in ONE declared regime with `(min-height: 800px)` WITNESSED first, every part read
in one `evaluate` on a sheet opened by a REAL press. `logs/lap-parts.json`.

```
H(n) = C + 22.39·n          C = 166.89 coarse · 166.95 fine      n = drawn rows, foot included
       C = 36 (pad 32 + border 4) + S + 8 + 10.667·N + 8         S = 18.89 coarse · 18.95 fine
lap    = max(0, sheetTop + H − gridTop)   sheetTop = 47.75 coarse · 59.75 fine
gridTop (coarse, 390 wide) = 0.5·vh − 200.27                     844 → 221.73 · 664 → 131.73 EXACT
```

| arm | rows | H measured | H by law | lap |
|---|---|---|---|---|
| 390×844 coarse (2,0) | 2 | 211.67 | 211.67 | 37.69 |
| 390×844 coarse (5,0) | 5 | 278.84 | 278.84 | 104.86 |
| 390×844 coarse (4,1) | 4+foot | 278.84 | 278.84 | 104.86 |
| 390×664 coarse (2,0) | 2 | 211.67 | 211.67 | 127.69 |
| 1280×800 fine (2,0) | 2 | 211.73 | 211.73 | 147.03 |
| 1280×800 fine (5,0) | 5 | 278.91 | 278.91 | 214.21 |
| 1280×800 fine (4,1) | 4+foot | 278.91 | 278.91 | 214.21 |

**Delta from the law: 0.00 at all seven.** Every `.pl-row` is 22.39 in BOTH regimes, the `and N
more` foot included — so the spec's separate `(1.6 + S)·m` term is struck: with `gap: 0` the foot is
simply another row, and `m` folds into `n`. Two of the spec's constants moved and both are named:
the sheet's top is the SIGN's own height (47.75 coarse, 59.75 fine = 12 + 47.75), not the 44 tap
floor — the floor never binds because the natural box is already over it — and the coarse constant
is 166.89, not 164.5. The `+4.7` residual is gone and its author is named: `.lobby-rows { gap:
0.1rem }`, 1.60 per seam.

`gridTop = 0.5·vh − 200.27` is EXACT in the coarse/narrow regime (both heights) and does NOT
describe the desk (1280×800 fine reads 124.45 against the law's 199.73) — the board is sized by a
different rule there. Declared, not smoothed.

## 4 · The wire (G3 · G5)

- **Opening sends NOTHING.** Tapped on the room's own `BroadcastChannel`: 0 `cur` frames in the
  300 ms after a real mouse press on the sign, both engines.
- **`Hidden` sends exactly one `cur {p: null}`, then silence** — and getting there cost a cure.
  Pass-2 gap 5 ("two nulls where the gate says one") REPRODUCED at pass 3, and the mechanism is
  named: pressing the chip is itself a focus move off the board, so the grid's `focusout` has
  already said `null` a beat earlier. `setShareCursor` now tracks what this page actually put on
  the wire (`curSent`) and does not repeat it. One null, measured, both engines.
- **The seam**: `document.activeElement` names the same cell before and after the press, both
  engines; B's ghost of A stays at its count while A reads the chart.

## 5 · Painted AA (G13) — every row from bytes, both themes

`deviceScaleFactor: 1` screenshots, decoded with `sharp`; ink = the pixel whose luminance is
furthest from the clip's modal ground; WCAG through the canvas. `logs/aa-painted.json`.
The sheet laps the wordmark's box by **7,317.1 px²** while these are taken (pass 2's ~7,300, to the
decimal).

| row | light | dark |
|---|---|---|
| sign frame + count at 28px, live | 4.958 | 7.519 |
| state line (`--ink-press-quiet`) | **5.159** | **6.099** |
| chart frame (graphite at 0.95) | 12.595 | 11.201 |
| chart subgrid rule | **7.565** | **7.974** |
| peer dot | 5.594 | 10.548 |
| your ring (stroke 2) | 5.004 | 7.463 |
| row name | 14.651 | 12.163 |

Every G13 floor is cleared (quiet ≥4.5, subgrid ≥3, ring ≥3, worst dot ≥3). Two corrections to the
spec's table, both from paint: the subgrid's `color-mix` projection of 3.52/4.37 erred low by more
than 2× (it paints 7.57/7.97), and the ring's dark reading is **7.463**, not the token's 7.52 — a
2px antialiased stroke never reaches its token, which is the same finding the subgrid row taught,
pointed the other way.

## 6 · The chart (G14 · G15 · G16)

- Pitch held: **96.00** at 9×9 and **170.66** at 16×16 (`10.667·N`), dot **8.00 px** across at both,
  square to 0.01. The 16×16 sheet is **353.56** against 9×9's 278.91 at the same row count:
  **+74.65**, the declared +74.67 to within a rounding.
- No ink, no dot: `PlaceChart.test.ts` (replayed) holds the unit; a peer whose `--color-user-ink`
  is empty is filtered before the list is built.
- The query: hovering the second row leaves its dot at opacity **1** and puts the other two at
  **0.55** (frame 3, measured in the same evaluate).

## 7 · The budget (G7) — the estate's own gate, on the BUILT DIST

`e2e/filter-census.spec.ts` against the dist preview: **12 passed, both engines** — the exact-match
`filterBudget.ts` allowlist, the coarse-regime arm and both `:hover` arms included. Pass 2's 6/6 was
a dev server and one engine; this is the artifact that deploys.

Beside it, the document's own `<filter>` count through the three poses, both engines, both regimes:
**15 → 15 → 15** (shut · open solo · open live with a dot drawn). `logs/filters-dist-*.json`.

## 8 · The gates that landed (`e2e/player-place.spec.ts`)

Twelve rows, chromium and webkit, against the dev server. Every one is RED at `74a2b5d9`, where
none of these elements exists.

**24 passed, 0 failed, 48.7 s** — twelve rows × two engines:
r0 I3 · G2 (mouse and keyboard) · G3 · G4 (zero mutations under `[data-player-mark]` while a peer
sweeps 30 cells) · G5 · G14 · G16 · G19 · G21 · G22 (`0s, 0s, 0s` on the OPEN sheet under reduce —
pass 2 read `0.15s, 0.15s, 0s`) · G23 · G24.

## 9 · The mechanical battery

| gate | reading |
|---|---|
| `vue-tsc -b` | 0 |
| `vue-tsc -p tsconfig.e2e.json` | 0 |
| `vitest` (the six touched files, incl. the fold's two new ones) | **6 files / 107 tests passed** |
| the new live-room caption row | `["marks", "what fits", "your cell"]` GREEN; the SOLO row unchanged at `["marks", "what fits"]` |
| `lint:copy` | 0 em/en dashes, 0 unadmitted jargon, **0 admitted** |
| `lint:motion` | 0 — 35 specs, the new one inside the census |
| `check-pw-projects` | 8/8 checks OK, 35 specs, 571 resolved tests |
| `check-font-coverage` | OK — Patrick Hand **4,312 B**, 46 codepoints, unchanged; the two new strings need no new letter |
| `vite build` | OK |

## 10 · G19 — what the row costs, measured against HEAD

`logs/well-heights.json`, 1280×800 fine, chromium, the well being `.tray-well:has(.players-status)`.

| | solo | live (2 at the table) |
|---|---|---|
| HEAD `74a2b5d9` (:4244) | 66.38 | 88.47 |
| prototype (:4243) | **66.38** | **143.50** |

Solo is π to the hundredth — the row does not exist there, so the P1 seal's own scene is unmoved
and pass 2's `+32.83` has no successor. **In a live room the row costs `+55.03` and it is NOT
paid**: the pixels it was to be paid from are the roster's, and moving the roster out of the well is
PLR-SELF's substrate hunk, STRIPPED here by plan §7.8. G19's `≤ 109` is therefore **RED on this
tree by construction**, and the number that closes it is the substrate's, not this family's.
Reported, not smoothed.

## 11 · The gates, as they stand

| id | verdict | the reading |
|---|---|---|
| r0 I3 | GREEN | 2 signs, 1 visible; 2 sheets, 0 visible shut and 1 open; both engines |
| G1 rate | **NOT RUN** | the WebKit rate replay at 700/800 with the SLOW control — see the gaps |
| G2 self-ring | GREEN | `.chart-self` == 1 after a real mouse press AND after Enter from the sign, both engines; painted ring 5.004 / 7.463 |
| G3 seam | GREEN | 0 `cur` on the press; `document.activeElement` names the same cell either side; the ghost count unmoved |
| G4 head-still | GREEN | 0 mutations under `[data-player-mark]` while a peer sweeps 30 cells |
| G5 opt-out | GREEN, after a cure | one `cur {p:null}`, then silence; opening sends nothing |
| G7 filter-census | GREEN | the estate's own spec, 12/12 on the BUILT DIST, both engines; `<filter>` 15→15→15 |
| G8′ lap-law | GREEN | closed form, delta 0.00 at seven arms, regime witnessed first |
| G9 caption-width | **NOT RUN** | `your cell` at 390 and 1023 inside the well |
| G10 board-unbound | NOT RUN | (GREEN today at HEAD; guards the NO arm) |
| G12 font/copy | GREEN | woff2 4,312 B unchanged; `lint:copy` 0 with 0 admitted |
| G13 sheet-AA | GREEN | all seven rows from painted bytes, both themes |
| G14 pitch | GREEN | 96.00 / 170.66, dot 8.00, +74.65 at 16×16 |
| G15 no-ink-no-dot | GREEN (unit) | `PlaceChart.test.ts` replayed; no e2e arm |
| G16 query | GREEN | 1 / 0.55 / 0.55 measured; coarse has no query |
| G18 pi-regime | GREEN | `.controls-card` and `.action-bar` π at three arms; control named |
| G19 well-paid | **RED** | solo π; live +55.03 unpaid — §10 |
| G20 tape × sheet | **NOT RUN** | the coarse attribution tape under the open sheet |
| G21 press-twice | GREEN | closes; the board read both times |
| G22 PRM-open | GREEN | `0s, 0s, 0s` on `.is-open` under reduce, both engines |
| G23 focus-ring | GREEN | `dashed 2px`, offset 3, `:focus-visible` true — chromium by **Tab**, webkit by **`focus()`** (WebKit's Tab walks links and fields only, the macOS keyboard-access grammar; the route is named, not assumed) |
| G24 reconcile | GREEN | state count, rows + foot and the sr-only log agree; three distinguishable qualifiers now exist |

## 12 · Gaps, each one named

1. **The substrate is a STAND-IN.** PLR-SELF's pass-3 worktree did not exist when this lane opened
   (no `PlayerLobby.vue` anywhere under `.claude/worktrees/wf_f72f3b5a-83a-*`), so `App.vue`,
   `AttributionCard.vue`, the head's slot, `lastHeard`/`PRESENCE_QUIET_MS`/`quietMs`,
   `MOTION.presenceInkMs` and the document-`focusin` leave are replayed or written HERE. They are
   PLR-SELF's by the chair's §6.9/§6.12 and must be taken from its diff at the fold, not from mine.
   Everything §11 calls GREEN was measured on that stand-in.
2. **G19 is RED and the cure is not this family's** — §10.
3. **G1 was not run at all.** The WebKit rate replay at 700 and 800 with the `PLC_SLOW=1` control is
   the one number owed since pass 1 (40.6 at 700, 0.6 over), and it is still owed. `placeSettleMs`
   700 is in the tree and the damping is implemented; nothing here measures it.
4. **G20 was never measured** — the coarse attribution tape's painted box against the open sheet,
   the `elementFromPoint` ownership reading and the dismissing tap. It is the gate this pass minted
   and it is the gate this pass did not reach.
5. **G9 not run**: `your cell` at 390 and at 1023 inside the well.
6. **16×16 was measured at the DESK only** (353.56, +74.65). The spec asks for (5,0) and (2,0) at
   844 and neither was taken.
7. **The `and N more` foot has no `m` term any more** — with `gap: 0` it is a row. The spec's
   `(1.6 + S)·m` is struck by measurement; if the agglomerator wants the foot to read differently
   it now costs a rule, not a constant.
8. **`lobbyStrings` has no derive in `check-font-coverage`.** The two strings THIS family renders are
   declared and the gate is green, but the sheet's own `LOBBY_COPY` is covered only incidentally.
   The derive is PLR-SELF's §7 row.
9. **The desk `gridTop` law is unwritten.** `0.5·vh − 200.27` is exact at 390 wide and wrong at
   1280; the desk lap numbers are a table, not a law.
10. **The estate's five roster specs were not run** (`presence`, `session-substrate`, `access`,
    `follow-still-authorship`, `join-language-prm`). The roster hunk is stripped so they should be
    untouched, which is an argument and not a run.
11. **`zone-grammar.spec.ts` was not re-run.** Its coarse caption count is 2 and the `your cell`
    row mounts only with a `roomId`, so it should be unmoved — again an argument, not a run.
12. **The lap is reported, the DISMISSAL is not.** Every lapped tap dismissing and hitting no
    control is asserted nowhere; only the geometry is measured.
13. **And then the hard part**: the sheet at 390×664 laps the board by 127.69 px with only two rows
    on it. The law says so exactly, and nothing in this design makes that number smaller — the
    chart is 96 px of the 211.67 and it is the reason the family exists.

## 13 · The frames (4 cited, 5 files, 129 KB total)

1. `frames/1-chart-9x9-phone-coarse-light.png` — the sheet at 390x844 COARSE, light, opened by a
   real press: **2 dots + 1 ring** over the state line **`2 other players`**. The caption is the
   picture this time (pass 2's three captions each named a scene they did not show).
2. `frames/2-chart-16x16-desk-dark.png` — 16x16, N=6, desk dark: side **170.66** (`10.667*16`),
   dot **8.00** across, 5 dots + 1 ring, sheet **353.56** (= the 9x9 arm **+74.65**).
3. `frames/3-query-hovered-row.png` — the second row hovered: its dot **1**, the other two **0.55**.
4. `frames/4a-well-live-room.png` + `frames/4b-well-solo.png` — the well with the `your cell` row
   in a live room (143.50) beside the same well solo (66.38, byte-identically HEAD's). One frame,
   two halves: it is the "paid from the roster" claim, and section 10 is why it is not paid yet.
