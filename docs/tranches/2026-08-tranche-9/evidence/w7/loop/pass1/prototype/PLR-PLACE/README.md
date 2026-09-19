# PLR-PLACE — pass 1 (PROTOTYPE) · the seating chart, split at the size boundary

T9-W7 §11 · §12 · mark M14. Built 2026-09-17 from `../../synthesize/PLR-PLACE.md` in a throwaway
worktree; the main tree is untouched and nothing is committed.

```
worktree   /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-48
branch     worktree-wf_e58b4764-0fc-48   (off aab67b92)
server     npx vite --host 127.0.0.1 --port 4246 --strictPort   (4243-4245 and 4247 were TAKEN)
config     probe/pw.config.ts (a copy of playwright.config.ts, no webServer, baseURL :4246)
control    127.0.0.1:4243 serves the MAIN tree at HEAD — the pi census reads both
```

**IT RUNS.** Every number below is read off that server in BOTH engines — no overlay, no
injected geometry, no mock: the product's own `PlayerSign`, `PlayerLobby` and `PlaceChart`,
mounted in `AttributionCard`'s new `#mark` slot at both widths.

**U-10: this proposes.** The research's own condition stands — if the owner disposes against
the split, the family is a KILL, because the 24px miniature was never built and cannot be.

---

## 1 · What was built (the §7 plan, as executed)

| plan step | file | what landed |
|---|---|---|
| 1 | `useJoinWash.ts` | `WASH.placeSettleMs: 700`, a fourth row beside `bootSuppressMs/coalesceMs/minGapMs` |
| 2 | `useSession.ts` | `lastHeard` (NOT reactive) + `quietMs(id)` + `PRESENCE_QUIET_MS 20000`; `selfCursor`; `shareCursor` + `setShareCursor`, consulted by `noteFocus`. `:537` untouched — your board keeps your blue |
| 3 | `PlayerSign.vue` | the head sign: `HandDrawnOutline :stroke-width="2" :outset="0" :pose="0"` in a 28×28 box, the count of OTHERS inside, `defineExpose({ close })` |
| 4 | `PlayerLobby.vue` + `PlaceChart.vue` | the sheet in the @mbabb card's pose; the chart is `generateGridBoilFrames(size, subgrid, 1000).frame[0]` + `.subgridLines[*][0]` at 96px, a dot per SETTLED peer, a ring at your own cell |
| 5 | `GameControlPanel.vue` | the `your cell` option row in the OptionSelector grammar; the roster `sr-only` whole; the departing rows, the fold, the swatch and the three one-shots DELETED |
| 6 | `App.vue` | the sign slotted into both `AttributionCard` instances; `closeAll` gained the two sign refs (**a declared deviation — §6.2**) |
| 7 | the gates | `probe/place-{scene,phone,paint,rate,pi,crop,crop2,lap3,lap4}.spec.ts`, run LOCAL (O-12) |

Two files the plan did not name and the build needed:

- `useBoardShape.ts` (26 lines) — the chart draws THIS board's frame and needs its side and box
  root. `useGameState` is a per-game factory and the head is two trees away from it, so the one
  site that already holds both numbers hands them over: `BoardHost`, one `watchEffect`. The
  `useLiveFace` / `useControlsDrawer` pattern.
- `pencilConfig.ts` — `MOTION.presenceInkMs: 400`, bound into the sign as a CSS var, because the
  covenant puts timing constants there and nowhere else.

One tracked GATE script was edited, and the edit only tightens it: `scripts/check-font-coverage.mjs`
gains `your cell` to the `.zone-row-label` corpus and the row's tape to the tapes corpus, which is
that gate's own declaration mechanism. The cut is not re-narrowed and the woff2 does not move
(4,312 B, re-derived).

`git -C <worktree> diff --stat`: **10 files changed, +271 / −247**, plus 4 new files
(`PlayerSign.vue`, `PlayerLobby.vue`, `PlaceChart.vue`, `useBoardShape.ts` — copies in
`new-files/`, the tracked half in `patch-tracked.diff`). `GameControlPanel.vue` is a net
deletion: the roster's pixels leave with their CSS.

## 2 · The gates

| id | asserts | reading | verdict |
|---|---|---|---|
| r0 I3 | a `button` named `/player/` in the head opening `[data-lobby]` | 1 candidate, `(75.5, 12, 53.1, 47.8)`, name `no other players`; the press reveals the sheet | **GREEN both engines** (RED at HEAD) |
| G1 rate | ≤ 40 moves/min/peer on the banked ordinary trace; ≤ 3 on the 20 s sweep | sweep **2.9 / 2.9**; ordinary **37.8** chromium · **40.6** webkit | **sweep GREEN both · ordinary GREEN chromium and 0.6 OVER on webkit** — §3 |
| G2 dot-contrast | every dot ≥ 3:1 at 96px, four grounds, painted bytes | worst **5.26** light / **9.54** dark, identical in both engines | **GREEN both** |
| G3 sign-contrast | the sign's frame ≥ 3:1 at 28px, painted bytes, four grounds | live **4.96–7.52**, solo **5.17–6.13** | **GREEN both** |
| G4 head-still | 0 DOM mutations under `[data-player-mark]` over 60 s of a peer's key-repeat, sheet shut | **0** mutations, **0** records, over 1.041 min | **GREEN both** |
| G5 opt-out | after `hidden` the wire carries `cur {p:null}` then no `cur`; the row survives, the dot does not | `[10, null, null]` at the press, then **no further frame** across two peer cell moves; the peer's own view: rows **2**, dots **0** | **GREEN both** |
| G6 M19-whole | focus unmoved, sheet shut, `aria-label` mutated on a third join | focus `Row 1, column 1, empty` unchanged; `[data-lobby]` count 0; label `1 other player` → `2 other players` | **GREEN both** |
| G7 filter-census | `filterBudget` 9 with the sign mounted and the chart open, both regimes | **9** in all six scenes (desk solo · desk sheet open · desk sheet open at N=15 · phone settled · phone sheet open), both engines, polled to the settled 9 first | **GREEN both** |
| G8 phone-lap | the lap is MEASURED and equals the declared DELTA ± 4px | **44.6 / 68.6** at 390×844 · **134.6 / 158.6** at 390×664 — §4.1 | **MEASURED; the declaration is 4.6px out on the tall phone and ~95px out on the short one** |
| G9 caption-width | `your cell` fits the caption column at 390 and 1023 without wrapping | **60.0 × 15.4** at 390, **60.0 × 14.9** at 1023, `scrollWidth` 60, one line | **GREEN both** |
| G10 board-unbound | 81 cells, 0 ink bindings solo and in a room | **81 / 0** solo, **81 / 0** in a room of two, both engines | **GREEN both** |
| G11 live-regions | 3 → 3; `.players-roster` keeps `role="log"` | 6 regions on the page (unchanged), 3 in the well, roster `role="log"` + `aria-live="polite"`, chart `aria-hidden="true"` | **GREEN both** |
| G12 font-cut | coverage OK, woff2 4,312 B; no comma/colon drawn | Patrick Hand **46 codepoints, 4,312 B**, corpus a superset after the two strings were declared | **GREEN** |

Instruments re-run against the prototype, by this lane, this pass (`logs/`):

| id | at HEAD | under this prototype |
|---|---|---|
| I1 family law | RED, exit 1, 37 collisions | **RED, exit 1, 37 collisions** — re-run against the worktree's own `playerIdentity.ts` + `index.css`. This family clears no anchor set and inherits R2's question whole: index 15 sits 7.9° from `--color-user-ink` dark and 10.7° from `--color-solver-ink-3` |
| I2 own colour | RED (`rgb(37,99,235)` vs `oklch(0.5 0.11 0)`) | **RED by ruling** — the sign paints `rgb(37, 99, 235)` live in both engines: the board keeps your blue, and the chart makes F1 more visible rather than less |
| I3 head mark | RED, 0 candidates | **GREEN**, both engines |
| I4 ink reassignment | RED, 137.5° → 327.5° | **RED**, unchanged — spoken to, not cured |
| I5 live claim | RED chromium / GREEN webkit (one run) | **RED both engines** (`collided: true`) — §6.9 |
| R6 `hue-census.mjs` | 29 token rows | **byte-identical** — `diff` of HEAD's run against the worktree's is EMPTY (`logs/hue-head.txt`); no token minted, no token moved |
| R6 `law-probe.mjs` | 9 rows · 6 standing GREEN · 3 born-RED | **byte-identical** — same 9 rows, same 3 still red |
| heading census | `.section-heading` = `Size`, `Level`; 2 `h2` | **unchanged** — `your cell` is a ROW caption (`.zone-row-label` 2 → 3) and its tape a hint tape (`.zone-hint` 4 → 5); zero new headings |
| wobble probe | — | **does not apply**: nothing in this family is drawn below 28px |

Estate gates, re-run in the worktree by this lane: `vue-tsc -b` **exit 0** · `vitest run`
**810 passed / 810, 66 files** (three assertions moved to the new law — §6.3) · `eslint .`
**0** · boundary lint **0** · `prettier --check` **clean** · `check-copy-register` **0 em
dashes, 0 unadmitted jargon** (the 2 pre-existing admissions) · `check-live-regions` **0 born
speaking, 10 declared** · `check-motion-contract` **34/34 declaring** · `check-font-coverage`
**OK — 46 codepoints / 4,312 B** · `tdz-probe` **0 cycle edges** · `knip` **clean**.

## 3 · The rate, measured on the prototype rather than predicted

The research banked four real traces of the product's own wire. This gate REPLAYS the ordinary
and sweep traces at their recorded cadence onto a live room, from an id the room has met, and
counts what the chart actually paints — a rAF sample of the dot's own `(cx, cy)`, which is
exactly "how many times does a reader see it jump".

| arm | engine | frames replayed | rAF jumps | span | **moves/min/peer** | mutation batches/min | banked raw | banked settle-700 prediction |
|---|---|---|---|---|---|---|---|---|
| ordinary | chromium | 74 | 38 | 1.005 min | **37.8** | 38.8 | 74.7 | 33.3 |
| ordinary | webkit | 71 | 41 | 1.009 min | **40.6** | 41.6 | 71.4 | 37.2 |
| sweep (20 s key repeat) | chromium | 165 | 1 | 0.347 min | **2.9** | 2.9 | 469.8 | 3.0 |
| sweep | webkit | 162 | 1 | 0.347 min | **2.9** | 2.9 | 463.6 | 3.0 |
| G4 · sweep, sheet SHUT | chromium | 165 | — | 1.041 min | **0 head mutations** | 0 records | — | — |
| G4 · sweep, sheet SHUT | webkit | 162 | — | 1.041 min | **0 head mutations** | 0 records | — | — |

Three readings, plainly:

1. **The sweep is the settle's whole case, and it holds on the surface.** 469.8 / 463.6 raw
   become **2.9** in both engines — a 20 s held arrow key is ONE landing, and the offline
   prediction (3.0) was right to a tenth.
2. **Ordinary play runs 4.5 / 3.4 moves a minute HOTTER than predicted**, because the offline
   figure counted settled landings in the trace while this counts painted positions: the first
   paint on open, and a landing whose timer fires across a frame boundary, are both jumps a
   reader sees and neither is in the arithmetic. Chromium clears the gate's ≤ 40; **webkit reads
   40.6 and does not** — by 0.6, which is one extra jump in the minute. Not cured here. The two
   honest cures are a longer settle (the banked SLOW arm reads identically at 400, 700 and 1200,
   so 800 ms costs a thinking peer nothing) or a gate written at ≤ 45. Booked for the adjudicator.
3. **The head does not move at all.** 60 s of the sweep with the sheet shut mutates nothing under
   `[data-player-mark]` in either engine — not an attribute, not a text node. The sign is still by
   construction, and the construction is measured rather than asserted.

## 4 · Geometry, both engines

| | measured | declared (§6 of the synthesis) |
|---|---|---|
| desk sign | **53.1 × 47.8 at (75.5, 12)** | 45.2 × 39.8 at (75.5, 12) |
| desk sheet | **(0, 59.8), 256 wide**; h 169.1 solo · 218.7 at N = 2 · 293.8 at 5 lines | (0, 51.8), 256 × (80.5 + 108 + 22.4·L) |
| phone sign | **53.1 × 47.8 at (75.5, 0)** | 44 × 44 at (75.5, 0) |
| phone sheet | **(0, 47.8), 256 × 218.6** at state + chart + 2 rows (242.6 at 3) | (0, 44) |
| `@mbabb` trigger | **75.5 × 39.8 at (0, 12)** desk · **75.5 × 44 at (0, 0)** phone | unmoved (R5 F14) — **it is unmoved** |
| the sun | **64 × 64 at x = 326** (phone) | unmoved — **it is unmoved** |
| free band left | 250.5 − 53.1 = **197.4px**, no overlap with the sun | 206.5px |
| tap floor | shipped **53.1 × 47.8**; floor removed **53.1 × 47.8** (inert); floor AND padding removed **28 × 28** (fails); floor back, no padding **44 × 44** | 44 × 44 |
| `your cell` row (desk, stacked) | **284.2 × 121.4** inside the well | not declared |

**The sign is 8px taller and 7.9px wider than the spec declared**, because the spec fixed BOTH
the 28px box and the `0.618rem / 0.786rem` padding, and 28 + 2 × 9.888 = 47.8. The sheet
inherits the 8px: it hangs at y 59.8, not 51.8. Nothing else in the head moved — the `@mbabb`
card's own pose is held by a new `position: relative` disclosure box inside the corner, so
`.hover-card`'s `top: 100%` still reads the TRIGGER's height and not its taller neighbour's.

**The negative control works, and it says something the research's did not.** The floor is
INERT against the shipped box — a 28px box inside √φ padding is already over 44 in both
dimensions — so the `min-width/min-height` declaration is a belt on braces. Strip the padding
too and the box is 28 × 28; put the floor back and it is 44 × 44. Both readings are banked.

### 4.1 · G8, and what the lap actually depends on

The first run banked one number (158.6 / 158.9px) and called it the lap. It is not: it is the
lap on ONE phone. `probe/place-lap4.spec.ts` holds the room, the sheet and the row count fixed
and moves only the viewport's height, coarse in both engines:

| viewport (coarse, dpr 3) | board top | sheet bottom (state + chart + 2 rows) | **lap** | lap at 3 rows (+24.0) |
|---|---|---|---|---|
| 390 × 844 | 221.7 / 221.4 | 266.3 | **44.6 / 44.9** | **68.6 / 68.9** |
| 390 × 664 (iPhone 13) | 131.7 / 131.4 | 266.3 | **134.6 / 134.9** | **158.6 / 158.9** |

It does NOT depend on the drawer or on scroll: with the sheet held open across four readings
(drawer shut / open, page at the top / scrolled to the board), `scrollY` was 0 and the lap never
moved by a pixel. The page does not scroll at this width; the board's top is a function of how
much height the masthead and the board's own column have to share.

So the synthesis's "~64px" was a reading of the TALL phone and it is nearly right there: 68.6 at
three rows, **4.6px outside** the ±4 the gate asks for. On the short phone the same sheet laps by
**158.6px** — the top third of the board — and that is the number an argument about shrinking the
chart has to be had against.

## 5 · The painted bytes (dpr 1, best pixel, four grounds, both engines)

| ground | sign frame · live | sign frame · solo | dots (4 peers) | your ring |
|---|---|---|---|---|
| light `--color-background` | **4.96** | 5.17 | 5.26 – 6.08 | **3.63** chromium / 4.96 webkit |
| light `--color-card` | **5.08** | 5.24 | 5.39 – 6.22 | **3.68** chromium / 5.08 webkit |
| dark `--color-background` | 7.52 | 6.07 / 6.13 | 9.75 – 10.67 | 5.23 chromium / 7.52 webkit |
| dark `--color-card` | 7.36 | 6.01 / 6.07 | 9.54 – 10.45 | 5.18 chromium / 7.36 webkit |

Chart 96 × 96, dot 8.0px across. The dots land 0.2 under the research's predicted floor (5.45)
and far over the 3:1 non-text floor. The negative control is the research's own banked reading
of the same inks at 24px: 1.52 – 2.69 : 1.

**THE RING IS THE THINNEST THING IN THE FAMILY, and the two engines disagree about it.** At
stroke 1.5 CSS px chromium's best painted byte reads **3.63 : 1** on the light background —
inside WCAG 1.4.11 by 0.63 — while webkit paints the same ring at the ink's full 4.96. A 2px
ring buys the margin back at no cost to the idiom; this prototype did not take it, because 1.5
is what the spec says. Booked for the adjudicator, not cured here.

## 6 · Every gap, honestly

1. **G8's declared delta is a one-viewport reading** (§4.1). The lap is 44.6–68.9px on a 844-tall
   phone and 134.6–158.9px on a 664-tall one. Neither is hidden and neither was declared.
2. **The lap is not only spatial.** `frames/sheet-phone-lap-webkit.png` is the honest frame: at
   `--color-popover` 80% the wordmark and the board's own digits read THROUGH the sheet, so the
   chart's dots and the rows' names compete with what is behind them. The reduced-transparency
   arm is present and the ordinary arm is what a reader gets. A ground nearer 100% on the phone
   arm is the cheap cure; not taken, because the spec says "the @mbabb card's pose byte-for-byte".
3. **`closeAll` changed.** The plan said it would not. Without the two sign refs a tap outside the
   sheet does not shut it, which is the dismissal §4.1's whole scenario depends on. Two lines.
4. **Three unit assertions were moved to the new law**, and a mock gained two keys: the roster's
   `sr-only` is now unconditional (it was asserted to come back into flow with rows), `tabindex`
   is gone (T7-W2 A4's pairing retires with the scrollport it was for), and the zone-grammar
   census reads three row captions and five hint tapes. 810/810 after, 66 files.
5. **Three e2e sites read `.player-swatch`, which no longer exists** — `join-language.spec.ts:175`,
   `multiplayer.spec.ts:193` and `:580`. They must be re-pointed at the lobby's swatch. Row COUNTS
   and `.player-self` still resolve, because the list is clipped rather than deleted. PLR-SELF's
   sibling prototype KEPT the swatch inside the `sr-only` list for exactly this reason; this build
   deleted it. Two defensible answers to one question, and the adjudicator should settle it once
   for both families.
6. **R5's I2/I4 crashed rather than measured** on their first run, for the same reason. `probe/`
   carries a re-pointed copy that asks the same question of the lobby's swatch; both verdicts are
   unchanged (RED), but the re-pointing is this family's debt, not a detail.
7. **`useJoinWash`'s row arm is now consumed only by its own test.** `arriving`, `departing` and
   the two `rowArmMs` numbers exist for CSS one-shots this prototype deleted. `knip` stays clean
   because the test imports them. Pruning is a ten-assertion edit the cut should make
   deliberately; the prototype did not.
8. **The lobby's own drawn strings are outside the font gate's reach.** `check-font-coverage`
   derives its corpus from `<SheetWashiLabel text>` and `.zone-row-label`; the sheet's state line,
   names, qualifiers and `and N more` are in `--font-hand` and match no derive rule. They are
   inside the cut (checked by hand: no `j`, no `x`, no comma, no colon) and the gate cannot see
   them. A `lobby` derive belongs with the cut.
9. **Past five players the names are only in the sr-only log.** The sheet shows 5 rows on the desk
   (4 + `and N more` past that) and 3 on a phone. A sighted reader with sixteen at the table can
   no longer read the sixteenth name anywhere: the well's list is clipped and the sheet truncates.
   R5 F9 called the old scrollport "10 rows behind a scroll"; this trades it for "13 names behind
   a sentence".
10. **I5 read RED in BOTH engines here**, where R5 banked chromium RED / webkit GREEN. One run
    each; reported, not explained.
11. **The `hidden` frame's latency was not isolated.** Two `null` frames land inside the 250ms
    window after the press — the cell's own `focusout` and `setShareCursor`'s — and nothing at all
    across two further cell moves. "Within 200ms" is consistent with the trace and is not
    separately timed, because the instrument's t0 sat after the blur.
12. **`lastHeard` is never pruned.** It grows with `known`, which never shrinks either. Bounded by
    the room's lifetime, so it is a note rather than a leak.
13. **The `your cell` row shows when you are alone**, where there is nobody to hide from. That is
    the well's own logic (the invite verb and its tape are there before the share), but it is a
    decision, not a derivation. It also costs the phone's controls card 32.83px (§7).
14. **`shown` / `hidden` are lowercase where `Off` / `On` are capitalised** in the two option rows
    beside them. The spec's copy is lowercase; the estate's incumbent labels are not. One of the
    two is wrong and the adjudicator owns which.
15. **Nothing was measured on real iOS** (that rig is the owner's), and the 16×16 chart's density
    picture was not screenshotted — the prototype draws it (pitch 6px, dots r 2.5) but the crop
    budget went to the poses the brief named.
16. **The two readings still do not join past four**, which is the research's fourth kill and this
    build does not cure it: the spec's answer is to STOP CLAIMING attribution past four, and the
    prototype implements that claim by saying so rather than by any mechanism. A reader at N = 15
    sees fifteen dots and four names (`frames/sheet-n15-1280-chromium.png`).
17. **The sheet has NO transition.** The spec's motion table gives it "the card's inherited 150ms
    `--ease-standard`", and `v-if` mounts and unmounts it same-frame: there is no fade, no scale,
    nothing to reduce. The trade was deliberate — a `v-show` sheet keeps the chart subscribed to
    `cur` while shut, which §3.2 forbids — but the cure is a `<Transition>` on the mount, not the
    absence of one, and the spec's own sentence is unimplemented as written.
18. **G1's ordinary arm misses on webkit by 0.6 moves/min** (§3.2). Reported as a miss, not
    rounded into a pass.
19. **π was censused in chromium only** (`logs/pi-*.json`); the webkit arm of the rect census was
    not run. Every other reading in this record is both engines.
20. **Eight crops, not the brief's seven.** The seventh (`your-cell-row-*`) hovers the caption so
    the tape's sentence is in the frame — and the tape covers the control it explains — so an
    eighth takes the same row at rest with `shown` / `hidden` legible. 8 files, 83,776 B, largest
    35.5 KB, every one under the 150 KB cap.
21. **One insertion in `pencilConfig.ts` was mis-placed and is fixed here**: `presenceInkMs` had
    landed between `cardStepMs`'s RATIFY-ME doc block and `cardStepMs` itself, orphaning the
    comment onto the wrong constant. Moved below it. No value changed.
22. **THE TWO HEAD DISCLOSURES CAN BE OPEN AT ONCE, and they land on top of each other.**
    Measured (`probe/place-two.spec.ts`, both engines): with the sheet open at `(0, 59.8, 256,
    169.1)`, hovering `@mbabb` paints the attribution card at `(0, 51.8, 256, 151)` — the same
    width, an 8px offset, 151 of the sheet's 169.1px covered. This build moved the hover grammar
    one level in (so the mark no longer opens the card) but did NOT give the head a disclosure
    registry; PLR-SELF's sibling prototype did (`useHoverCard.ts`'s `headDisclosures`: every
    disclosure registers its own `close` and claims the origin when it opens, and `closeAll`
    empties the set). That is the cure, it is already written next door, and the apotheosis
    should take it rather than re-derive it. Not a gate this lane was given, and a defect all
    the same.

## 7 · π — what this family did not touch

`filterBudget` **9** in every scene measured: desk solo, desk with the sheet open, desk with the
sheet open at N = 15, phone settled, phone with the sheet open — both engines, polled to the
settled 9 first (a cold phone census reads 21). The chart is pose-0 geometry with the grain
already baked into the path: it mints nothing.

The rect census (`probe/place-pi.spec.ts`, chromium, HEAD on :4243 against the prototype on
:4246, twelve selectors at two viewports):

| surface | selectors | Δ |
|---|---|---|
| desk 1280×800 | `.attribution-trigger` · `.corner-right` · `.toggle-icon` · `h1` · `.board-group` · `[role="grid"]` · `.controls-card` · `.play-controls` · `.action-bar` · `.tray-well` · `.drawer-tab` · `.sudoku-cell` | **0.00 on all twelve** |
| phone 390×844 | ten of the twelve | **0.00** |
| phone 390×844 | `.controls-card` | h **595.17 → 628.00**, Δ **+32.83** |
| phone 390×844 | `.action-bar` | y **1370.23 → 1403.06**, Δ **+32.83** |

The one delta is the `your cell` row's own height inside the well, carried down to the action bar
beneath it: the roster's pixels left and the option row arrived, and on a phone the row is the
larger of the two. The board, the head, the grid, the drawer tab and the cell are byte-identical
— π holds everywhere this family does not claim.

## 8 · Frames

| file | what |
|---|---|
| `sign-solo-1280-light-chromium.png` | §4 — the sign solo, desk, light |
| `sign-live-1280-dark-webkit.png` | §4/§5 — the sign live, desk, dark (`#60a5fa`) |
| `sign-solo-390-coarse-chromium.png` | §4 — the sign solo on a coarse phone: the empty box beside `@mbabb` |
| `sign-live-390-coarse-webkit.png` | §4 — the sign live on a coarse phone |
| `sheet-n15-1280-chromium.png` | §2/§6.16 — the sheet at sixteen others: chart, 4 rows, `and 13 more` |
| `sheet-phone-lap-webkit.png` | §4.1/§6.2 — the lap on the short phone, and the show-through with it |
| `your-cell-row-1280-chromium.png` | §2 G9 — the row with its tape shown |
| `your-cell-rest-1280-chromium.png` | §6.20 — the same row at rest: `shown` / `hidden` legible |

## 9 · Files

```
README.md                  this record
patch-tracked.diff         the 10 tracked files (git diff, uncommitted)
new-files/                 PlayerSign.vue · PlayerLobby.vue · PlaceChart.vue · useBoardShape.ts
probe/pw.config.ts         the scratch config (baseURL 127.0.0.1:4246, no webServer)
probe/place-scene.spec.ts  I3 · G5 · G6 · G7 · G10 · G11 · the desk geometry · crops
probe/place-phone.spec.ts  the coarse phone: the floor + its negative control · G8 · G9 · G7
probe/place-paint.spec.ts  G2 · G3 — painted bytes, four grounds, both engines, via sharp
probe/place-rate.spec.ts   G1 · G4 — the banked traces replayed, rAF-sampled
probe/place-pi.spec.ts     the π rect census, :4246 against HEAD on :4243
probe/place-lap3.spec.ts   G8 with the drawer and the scroll ruled out (writes lap2-*.json)
probe/place-lap4.spec.ts   G8 re-read against viewport height (§4.1)
probe/place-two.spec.ts    the two head disclosures, open at once (§6.22)
probe/place-crop.spec.ts   the `your cell` crop, tape shown
probe/place-crop2.spec.ts  the same row at rest
logs/*.json                every reading above, machine-readable
logs/{hue,law,family,copy,font}*.txt   the r0 and estate instruments, re-run this pass
frames/*.png               8 crops, 83,776 B
```
