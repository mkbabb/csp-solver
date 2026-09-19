# PASS-2 SYNTHESIS · PLR-PLACE · The seating chart

§11 (icon · lobby) · §12 · M14. Synthesized 2026-09-18 from `../research/PLR-PLACE/README.md`
(arms A–I on HEAD, both engines; ground-maths; chart-maths) against the pass-1 record,
`CHAIR-RULINGS.md` and R6. Read-only on the product. U-10: this proposes; if the owner disposes
against the size split the family is a KILL (the research's own word). F1 side stated: the BOARD
KEEPS YOUR BLUE (`useSession.ts:537` untouched); I2 RED by ruling.

THE RETIRE TRIGGER IS ANSWERED, and the answer is two lines, both measured on HEAD:
`@pointerdown.prevent` on the sign (the grid's focusout never fires; no `cur {p:null}`; the cell
keeps focus; 1 click, `aria-expanded` moves, Enter/Space untouched — both engines) plus
`focusedPos` lifted to the session as `lastCell` (written only at GameBoard.vue:458, cleared only
in `clearCursors()`, read only by the chart). The ring paints from the live cursor under a real
press; a keyboard Tab to the sign is an honest leave and the chart survives it from `lastCell`.

Planned and reviewed against the tells before writing. What moved:

1. **The phone arm and the desk arm are both OPAQUE** — not coarse-only. `--ink-press-quiet`
   reads 4.20:1 in BOTH themes over the wordmark (arm H, real bytes ±1); the desk sheet sits on
   the wordmark's box 19.9% too. One ground for the lobby, the law-44 arm promoted; the `@mbabb`
   card untouched. Declared delta.
2. **Pitch held, not the box**: chart = 10.667 · N (4×4 42.7 · 9×9 96 · 16×16 170.7), dot 8.00px
   and gap 2.667px at every size. The height is paid (+74.7px at 16×16) and declared; a fixed
   96px box at 16×16 is a density picture, and this family is a seating chart or nothing.
3. **Attribution is a QUERY, not a claim to four**: hover a row (fine pointers) and its dot alone
   keeps full opacity while the rest drop to `--ink-press-rule`'s pressure — one CSS state, R6
   law 14's one-affordance grammar. On coarse there is no hover; the rows show everyone and the
   chart shows the settled dots, said plainly.
4. **The unknown peer has NO dot** (BoardHost.vue:75-79's decided law); the `?? --color-user-ink`
   fallback dies.
5. **Your ring is stroke 2** (the `HandDrawnOutline :stroke-width="2"` keep width); 1.5px at
   3.18:1 on the phone ground was inside the noise. On the opaque ground it reads 4.96 / 7.52.
6. **The sheet's `@click.stop` dies**; a tap on the sheet dismisses (zero focusable elements).
   The incumbent card's 12 stolen cells (chromium: the tap lands on the GitHub link) are booked as
   a HEAD ledger row with arm C as the trigger; the family fixes its own.

---

## 1 · Tokens

| role | token | light | dark |
|---|---|---|---|
| sign frame + count, solo | `--ink-press-quiet` | 5.12:1 on the page | 6.01:1 |
| sign frame + count, live | `--color-user-ink` | #2563eb 4.96:1 | #60a5fa 7.52:1 |
| chart frame / subgrid | `--color-pencil-graphite` at 0.95 / `--ink-press-rule` (55%) | 12.48 / 3.52 on the opaque sheet | 10.95 / 4.37 |
| a peer's dot · a peer's row swatch | `inkFor(k[peer])`, fill, opacity 1; queried-away dots at `opacity: 0.55` | 5.23–6.11 on the sheet | 9.52–10.63 |
| your ring · your row swatch | `--color-user-ink`, stroke 2, no fill | 4.96 | 7.52 |
| names | `--color-pencil-graphite` | 14.65 | 12.19 |
| state line, qualifiers, foot | `--ink-press-quiet` on the opaque popover | 5.20 | 6.11 |
| sheet ground | `var(--color-popover)` opaque | ≈#fcfbf9 | ≈#121110 |
| sheet edge / radius / padding / width | the `@mbabb` pose | | |
| focus ring | `2px dashed currentColor` offset 3 (DrawerTab's form; §6's chrome token when it ships — the lobby reads it, never writes it) | | |
| tap floor | `--tap-floor` on the sign, both dimensions (reads EMPTY off `documentElement`; probe `.page-root`) | 44×44 | |

Demand on PAL-TIN: index 15 must not sit 0.4° from `--color-user-ink` (your ring and a dot would
share a hue with only their shape apart); the first four ≥50° (52.5° today defends it: the N=4
closest pair is 4.05× the N=15 pair in oklab ΔE).

## 2 · Type

| surface | face | rung | weight |
|---|---|---|---|
| the count inside the sign | Patrick Hand | `--type-small` (1–2 digits in a 28px box) | 500 |
| state line | Patrick Hand | `--type-tag` | 500 |
| row name | Patrick Hand | `--type-small` | 400 |
| qualifier, `and N more` | Patrick Hand | `--type-tag` | 400 |
| option caption `your cell` | `.zone-row-label`, lowercase (the row-caption register) | | |
| option chips `Shown` / `Hidden` | Fira Code at `--type-option`, Capitalised (the chip register) | | |

Rows take M01's raise; the state line does not. All inside the cut (digits in; no comma/colon).

## 3 · Components

### 3.1 The head wrapper — as PLR-SELF §3.1, landed once

Slot gated to `view === 'playing'` both platforms; CH-70 deletion on `.attribution-trigger`.

### 3.2 The sign — `PlayerSign`

`<button data-player-mark :aria-label="stateLine" :aria-expanded :aria-controls
@click.stop="toggle" @pointerdown.prevent>` padded `0.618rem 0.786rem`; coarse `min-width/
min-height: var(--tap-floor)`. Inside: a 28×28 box on `HandDrawnOutline :stroke-width="2"
:outset="0" :pose="0"` (no beat, no filter — the ribbon precedent) and, centred, the count of
OTHERS in Patrick Hand. NO `@keydown.enter`.

| state | frame | inside |
|---|---|---|
| solo | quiet | empty |
| live, N others | `--color-user-ink` | `N` in `--color-user-ink` (the numeral equals the digits in the name — 2.5.3) |
| hover (fine) | the ink lift quiet → graphite, solo only | |
| focus-visible | + `2px dashed currentColor` offset 3 | keyboard only |
| open | `aria-expanded="true"` | |
| PRM | identical; ink transition 0s | |

Nothing in the sign responds to `cur` (G4: zero DOM mutations in the head over a 60s sweep).

### 3.3 The chart + roster — `PlayerLobby` + `PlaceChart`

The `@mbabb` pose with an OPAQUE ground, `data-lobby`, plain markup, no role, no `@click.stop`.
The pose box stays MOUNTED (the `.hover-card` rule verbatim: opacity/transform 150ms
`--ease-standard`, `visibility 0s linear 150ms` on close — the declared 150ms, now
implemented); the CHART is `v-if="open"` inside it so a shut sheet does no `cur` work.

```
┌────────────────────────── 256 ──────────────────────────┐
│  3 other players                                        │   others; rows show everyone
│  ┌──────────────┐                                       │   chart 10.667·N (96 at 9×9), top-left
│  │  ●      ●    │                                       │   frame 2 / subgrid 1.25 CSS px, pose 0
│  │      ◉       │                                       │   dots r 4 (8px), gap 2.667
│  │  ●        ●  │                                       │   ◉ = you, a RING, stroke 2, your blue
│  └──────────────┘                                       │
│  ◉  tragic-mockingbird  you                             │   the row's swatch IS the dot
│  ●  literary-panda           ← hovered: its dot alone   │   at full opacity; the rest 0.55
│  ●  opposite-heron  26 seconds ago                      │
│  and 1 more                                             │
└─────────────────────────────────────────────────────────┘
```

Chart: `generateGridBoilFrames(size).frame[0]` + `.subgridLines[*][0]` scaled to `10.667 · N`
CSS px (pose 0, geometry only; 9 → 9). A dot per peer with a settled `cur`; a peer at `p: null`
(looked away, or `Hidden`) has no dot and keeps its row; a peer with NO ink has no dot (BoardHost's
law). You are a ring at `lastCell` (stroke 2), never at `peerCursors`, never at anything a
focusout can reach. Dots STEP when a peer's `cur` has held one cell for `WASH.placeSettleMs`
(700; the G1 webkit 40.6 re-run at 800 with the SLOW arm as control, reported, never predicted);
no transition property (PRM by construction).

Query: `.pl-row` carries `data-peer`; on `mouseenter` (fine pointers, `(hover: hover)`) the lobby
sets `queried`; `.chart-dot:not([data-peer=queried])` takes `opacity: 0.55` — the rule's own
pressure, one affordance. Coarse: no query; the spec says the chart is the settled dots and the
rows are everyone.

Rows beneath the chart at the full 224 width; swatch = the same dot / ring at 8px; names
graphite; qualifiers stamped at OPEN. `ROWS = { tall: 5, short: 2 }` on `(min-height: 800px)`;
the chart is always shown. Line/height law: sheet bottom = `216.8 + 24.0 · L` at 9×9 (measured,
zero rows includes the chart); +74.7 at 16×16.

Keys: Space/Enter toggle; Escape window-bound while open (one owner, `defaultPrevented`
honoured — the sheet cannot hear it after `@pointerdown.prevent`); the sign's `@focusout`
closes. Bounds, three: sun (256 < 326 / 1072, hard); wordmark (covered while open, opaque —
declared; one tap uncovers); board — the lap is a LAW: `lap(vh, L) = 417.07 + 24.0L − 0.5·vh`
(≥592; pinned below), zero lap needs `vh ≥ 834.2 + 48L`, so no 390-wide phone holds two rows
without lapping; the gate asserts the measured lap equals the law ±4px at 664 and 844 × L ∈
{0, 2, 5} AND every lapped cell's centre tap dismisses the sheet and hits no control. Desk: laps
the board's top-left structurally; booked U-10.

### 3.4 The well (controls stay in controls)

Invite, `players-status`, `players-roster` (sr-only, `role="log"`), `players-alone`, `leave` as
PLR-SELF §3.4 — `.player-swatch` STAYS sr-only until join-language:175 / multiplayer:193 / :580
and r0 I2/I4 are re-pointed at `[data-lobby] .pl-row .pl-swatch` in one diff (this lane's side
is delete; the chair's §7 makes the re-point the condition). Plus ONE option row in the
OptionSelector grammar beside `candidates`:

| caption | chips | default | hint tape |
|---|---|---|---|
| `your cell` | `Shown` / `Hidden` | `Shown` | `everyone on this board can see which cell you are on` |

`Hidden` sends one `cur {p: null}` and `noteFocus` short-circuits after; the peer keeps its row
and loses its dot. After `@pointerdown.prevent`, opening the sheet puts NOTHING on the wire, so
"one null, then silence" means the control and only the control (G5 distinguishable again).
`Shown`/`Hidden` is a deliberate second two-state vocabulary (a visibility, not a feature); the
caption stays lowercase, the chips Capitalised — both registers as the estate already splits them.

### 3.5 Speech

The chart is `aria-hidden` (positions the log already speaks); the rows are the readable list.
Six regions in order on the playing view (+2 on the deck); the label mutates; M19.

## 4 · Copy

`no other players` · `1 other player` / `N other players` · `you` · `N seconds ago` · `and N
more` · `your cell` · `Shown` · `Hidden` · `everyone on this board can see which cell you are on`.
The lobby's five as `LOBBY_COPY` (font derive `lobbyStrings` + copy `COPY_SOURCES`); `your cell`
derives as a `.zone-row-label`; the tape as a static `SheetWashiLabel text`. No em dash, no first
person, the cut.

## 5 · Motion

| event | what moves | duration · curve · home |
|---|---|---|
| the room becomes ≥2 / drops to 1 | the sign's `color` | `MOTION.presenceInkMs: 400` (shared with PLR-SELF's row; do not orphan `cardStepMs`'s doc block) · `--ease-standard` · PRM 0s |
| the count changes | same-frame numeral swap | none |
| a peer settles on a cell (sheet open) | its dot's `cx/cy` | a step; gated by `WASH.placeSettleMs: 700` (useJoinWash WASH, the damping home) |
| a row is hovered | the other dots' opacity 1 → 0.55 | same-frame (no transition; one affordance) |
| a peer looks away / `Hidden` | its dot unmounts | none |
| the sheet | 150ms `--ease-standard`, `.hover-card` verbatim | inherited; MOT-LADDER's rung if named |

The head has ZERO event-driven motion beyond the 400ms ink.

## 6 · Desktop and mobile, light and dark

Desk: sign 45.2×39.8 at (75.5,12); sheet at (0,51.8), opaque, 256 × (216.8 + 24L − 44 + 51.8);
laps the wordmark box and the board's top-left (declared). Phone coarse 844: sign 44×44 at
(75.5,0); sheet at (0,44); L=2 laps 43.1px (declared, tap dismisses). Phone 664: L=2 laps
133.1px (declared). 16×16: +74.7px. Dark: dots L 0.8, the ring #60a5fa, frame the dark graphite
arm; quiet 6.11 on the opaque ground.

---

## 7 · Plan

1. `useJoinWash.ts:101` — `WASH.placeSettleMs: 700`; the roster half (`arriving`/`departing`/
   `rowArmMs`, the 740ms hold) DIES with the roster's pixels — this family's consequence, owned;
   join-language-prm:97 re-aimed.
2. `useSession.ts` — `lastCell` ref beside `clearCursors()` (written at GameBoard.vue:458,
   cleared at :966-977, read by the chart); `lastHeard` + `PRESENCE_QUIET_MS`; `shareCursor`
   (default true) consulted by `noteFocus`; `:537` UNTOUCHED.
3. `PlayerSign.vue` — `@pointerdown.prevent`; no Enter handler; window Escape on open;
   `@focusout` close; slotted through `AttributionCard`'s `#mark` (PLR-SELF's graft, once).
4. `PlayerLobby.vue` + `PlaceChart.vue` — opaque ground; no `@click.stop`; mounted pose box with
   the chart `v-if`; pitch-held chart; ring stroke 2; no-ink-no-dot; the hover query; `ROWS` on
   the height MQL; `LOBBY_COPY`.
5. `GameControlPanel.vue` — the `your cell` row; roster sr-only; one-shots die; swatch stays.
6. `App.vue:802/:813` — the gated slot.
7. `e2e/player-place.spec.ts` (`PRM:` line; LOCAL) + the rate replay (700 and 800 arms, SLOW
   control); `check-font-coverage` `lobbyStrings`; `check-copy-register` `COPY_SOURCES`.
8. r0 I3 Enter arm + `:visible` (`instruments/r0-I3-enter-arm.md`) — MOVED; LEDGER CH-70 + the
   stolen-cells HEAD row (arm C the trigger).

Dies: the 24px miniature; the `?? --color-user-ink` fallback; the 1.5px ring; the fixed 96px
box; the claim-to-four sentence; the `v-if` pose box; the 80% ground; the sheet's `@click.stop`.

## 8 · Prototype brief

Replay `pass1/prototype/PLR-PLACE/patch-tracked.diff` + `new-files` into a FRESH worktree (the
pass-1 worktree is gone), apply §7, serve on 127.0.0.1:4243 (scratch `.mts`, private cacheDir),
scratch PW config; `?wire=local` pair plus the lane's 14 driven peers for N=15; every opening
through a REAL press (`locator.click()`), never `el.click()` in `page.evaluate`; both pages in
ONE pointer regime for any π rect census.

Frames (≤4): the chart at 9×9 N=3 phone light with `.chart-self` PAINTED under a real press
(the frame pass 1 could not take); the same at 16×16 N=6 desk dark (170.7px, dots 8px, gap
2.667); a hovered row with the other dots at 0.55; the `your cell` row.

Censuses: filterBudget (settled 9) with the sign and the open chart, both engines, both regimes;
`hue-census.mjs` copied and re-pointed (29 rows); heading census (the caption is a row caption,
not a heading); r0 I3 through the Enter-arm diff; I2 RED by ruling; I4/I5/family law bare; the
rate replay at 700 and 800; arm C (cells stolen) on the lobby, expecting a dismissing tap.

Numbers that mean success: `.chart-self` count 1 after a REAL press, both engines, mouse AND
keyboard (from `lastCell`); the wire carries NO `cur` on a mouse press, both engines; B's ghost
of A stays 1 while A reads the chart; Enter opens (one toggle); Escape closes a mouse-opened
sheet on both engines; filters 9→9; sign frame ≥3:1 at 28px painted bytes; dots ≥3:1 at r 4
(≥5.23 on the opaque ground); ring stroke 2 ≥4.96 / 7.52; `--ink-press-quiet` ≥5.20 / 6.11 on
the sheet over the wordmark; ≤40 moves/min/peer (700) and the 800 reading reported; `cur
{p:null}` then silence within 200ms of `Hidden`; 44×44 coarse; lap == law ±4 at 664/844 × L 0/2/5
and every lapped tap dismisses, no link hit; 16×16 chart 170.7 with 53.3 spare; zero head DOM
mutations over 60s; regions 6 in order; woff2 4,312 B; copy 0; `your cell` fits 48.8px.

## 9 · Born-RED gates

| id | asserts | at HEAD |
|---|---|---|
| r0 I3 (MOVED) | `[data-lobby]:visible` 1 of 2; Enter arm opens | RED |
| G1 rate | ≤40 moves/min/peer at 700 on the banked trace, ≤3 on the sweep; the 800 arm reported | RED |
| G2 self-ring | `.chart-self` present under a REAL press (mouse, keyboard), both engines; stroke 2 ≥3:1 painted | RED (absent) |
| G3 seam | a mouse press sends no `cur`; the peer's ghost stays; the cell keeps focus | RED |
| G4 head-still | zero mutations under `[data-player-mark]` over 60s, sheet shut | RED |
| G5 opt-out | `Hidden`: one `cur {p:null}` then silence; row survives, dot does not — and OPENING sends nothing | RED |
| G6 M19-whole | focus unmoved, sheet shut, label mutated | RED |
| G7 filter-census | 9 with the sign + open chart | extended |
| G8 lap-law | measured lap == `417.07 + 24L − 0.5vh` ±4 at 664/844 × L 0/2/5; every lapped tap dismisses, hits no control | RED |
| G9 caption-width | `your cell` fits at 390 and 1023 | RED |
| G10 board-unbound | 81 cells, 0 bindings solo; after a self write | GREEN today; guards F1 |
| G11 live-regions | six in order; deck +2 | RED |
| G12 font / copy | woff2 4,312 B; `lobbyStrings` derive; `COPY_SOURCES` reads the constant | GREEN by construction |
| G13 sheet-AA | quiet ≥4.5, rule ≥3, ring ≥3, worst dot ≥3 on the opaque ground over the wordmark, both themes | RED (4.20) |
| G14 pitch | dot 8.00 and gap 2.667 at 4×4, 9×9, 16×16; chart == 10.667N | RED |
| G15 no-ink-no-dot | a peer with no ink renders no dot (unit) | RED |
| G16 query | hover a row: its dot opacity 1, the rest 0.55; coarse: no change | RED |
| G17 keys | Space/Enter/Escape off `el.focus()` both engines; Tab route chromium, webkit skipped loudly | RED |
| G18 pi-regime | the rect census runs both pages in one pointer regime (declares it) | RED (the +32.83 artifact) |
