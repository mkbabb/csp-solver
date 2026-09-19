# PASS-3 SYNTHESIS · PLR-PLACE · The seating chart

§11 (icon · lobby) · M14. Synthesized 2026-09-18 from `../research/PLR-PLACE/README.md` (the closed
forms, the regime finding, the P1 seal, the scope reseating) against `pass2/synthesize/PLR-PLACE.md`,
`pass2/critique/PLR-PLACE.md`, `pass3/CHAIR-RULINGS.md` and `PLR-SELF.md` §3 (the seated substrate).
Read-only on the product; this proposes; U-10 — if the owner disposes against the size split the
family is a KILL (the research's own word, carried). Base `74a2b5d9`; pass-2 lines cite worktree -54.

F1 side: the BOARD KEEPS YOUR BLUE on this route (the NO arm of the substrate's one const); I2 RED
by ruling. The chart draws you as a RING in `--color-user-ink` and peers as DOTS in their walk ink
either way, so the chart is indifferent to F1's fold — said so the owner's eye can weigh it.

Re-planned and reviewed against the tells at this base. What moved:

1. **`your cell` moves into the players WELL and exists only in a live room.** Pass 2 put it as a
   fourth zone row beside `candidates` on every board; that costs +32.83 on the phone card (a
   FINE-regime number for a COARSE surface) and, at 1280×800 coarse, lands on the P1 seal
   (`visual-regression.spec.ts:790-870`, `SEAL = 1227.5`) with ~2.7px of headroom. The seal is
   measured SOLO (`goto("./")`, no room; the well priced at 82.42 = invite 52.03 + frame 30.39). A
   row that mounts with `roomId` leaves that reading UNMOVED by construction, and in a live room it is
   paid from the roster's freed pixels (the substrate takes ~61px out of the live well: 109 → ≤48).
   Chair §6.4 (no re-mint in the loop) is obeyed with no re-price; M14 (controls stay in controls)
   is obeyed better — a visibility that means nothing solo is not shown solo. The option's home is
   the multiplayer compartment, where invite and leave already live.
2. **The lap law is restored AS WRITTEN by the furniture.** The +4.7 residual was `.lobby-rows {
   gap: 0.1rem }` (1.60 per seam, never modelled) minus 1.61 for the foot; the substrate's `gap: 0`
   + `min-height: 1.4rem` + `line-height: 1.35` makes the row 22.40 in both regimes and the law a
   closed form with the regime WITNESSED first.
3. **Every phone number declares `hasTouch: true`.** Two banked censuses disagreed by 9.19px for
   exactly this reason (typography.css:103-105 raises `--type-small`/`--type-caption` under
   `(pointer: coarse)`). A pass-3 number without its regime is not a number.
4. **This family's diff is the CENTRE only** (chair §6.9/§6.12): `PlaceChart.vue`, `useBoardShape`
   + the `BoardHost.vue:108` write, `lastCell` + `GameBoard.vue:457-460`, `shareCursor`/
   `setShareCursor` + the `your cell` row, the chart's berth inside the seated sheet, and
   `e2e/player-place.spec.ts`. Seven substrate hunks are STRIPPED and named (§7).
5. **G20 is new and born-RED from the fold itself**: pick 3C-4b's coarse tape falls back to
   `focusedPos` (GameBoard.vue:517-522), and `@pointerdown.prevent` keeps the cell focused, so on a
   phone the tape STAYS UP under the sheet. The sheet is above it (z 50) and one tap dismisses; the
   gate measures the lap and asserts the z-order with `elementFromPoint` OUTSIDE any inert subtree.

---

## 1 · Tokens

Substrate tokens as PLR-SELF §1. This family's own:

| role | token | light | dark |
|---|---|---|---|
| sign frame + count, solo | `--ink-press-quiet` | 5.12:1 on the page | 6.01:1 |
| sign frame + count, live | `--color-user-ink` | #2563eb 4.96 | #60a5fa 7.52 |
| chart frame · subgrid | `--color-pencil-graphite` at 0.95 · `--ink-press-rule` | frame 12.48; subgrid PAINTS 7.6–8.0 (the 3.52 projection was a color-mix model; a 1px antialiased line never reaches its token — registry 3.11) | 10.95 · 8.0 |
| a peer's dot · its row swatch | `inkFor(k[peer])`, fill, opacity 1; queried-away dots `opacity: 0.55` | 5.23–6.11 on the sheet | 9.52–10.63 |
| your ring · your row swatch | `--color-user-ink`, stroke 2, no fill | 4.96 | 7.52 |
| names | `--color-pencil-graphite` | 14.65 | 12.19 |
| option caption `your cell` · chips `Shown`/`Hidden` | the well's own `.zone-row-label` / `.ctrl-btn` tokens | as the estate | |

Every AA row in this table is RE-DERIVED FROM PAINTED BYTES by the prototype (the subgrid finding
says the color-mix projections err low in one direction; the other rows want the same read).
`--ring-ink` on the sign: `outline: 2px dashed var(--ring-ink, currentColor); outline-offset: 3px`
(`.player-sign-btn:focus-visible`, the rule pass 2 never wrote — gap "no `:focus-visible`"); the
fallback is registry ruling 4's, not a §6.5 violation (PLR-SELF §1 states the scoping once).

## 2 · Type

| surface | face | rung | weight |
|---|---|---|---|
| the count inside the sign | Patrick Hand | `--type-small` (1–2 digits in a 28px box) | 500 |
| state line | Patrick Hand | `--type-tag` | 500 |
| row name | Patrick Hand | `--type-small` | 400 |
| qualifier · `and N more` | Patrick Hand | `--type-tag` | 400 |
| `your cell` | `.zone-row-label`, lowercase (the row-caption register) | | |
| `Shown` / `Hidden` | Fira Code at `--type-option`, Capitalised (the chip register) | | |

Line-height 1.35 declared on the sheet (substrate); the chart is not text. All inside the cut.

## 3 · Components

### 3.1 The head wrapper — PLR-SELF §3.1, landed once; this family STRIPS its copy

### 3.2 The sign — `PlayerSign` (this family's centre, half)

`<button data-player-mark :aria-label="stateLine" :aria-expanded :aria-controls @click.stop="toggle"
@pointerdown.prevent>` padded `0.618rem 0.786rem`; coarse `min-width/min-height: var(--tap-floor,
2.75rem)`. Inside: a 28×28 box on `HandDrawnOutline :stroke-width="2" :outset="0" :pose="0"` (no
beat, no filter — the ribbon precedent) and, centred, the count of OTHERS in Patrick Hand. NO
`@keydown.enter`, no `@focusout` (the substrate's document `focusin` is the leave).

| state | frame | inside |
|---|---|---|
| solo | quiet | empty |
| live, N others | `--color-user-ink` | `N` in `--color-user-ink` (the numeral == the digits in the name, 2.5.3) |
| hover (fine) | the ink lift quiet → graphite, solo only | |
| focus-visible | + the dashed ring (rule written this pass) | keyboard only |
| open | `aria-expanded="true"` | |
| PRM | identical; ink transition 0s | |

Nothing in the sign responds to `cur` (G4: zero DOM mutations in the head over 60s, sheet shut).

### 3.3 The chart + roster — the seated sheet with this family's berth

The furniture is PLR-SELF §3.3. This family adds ONE berth between the state line and the rows:
`svg.place-chart` with `margin-top: 0.5rem` (8px), `display: block; overflow: visible`,
`aria-hidden` (positions the log already speaks). The chart is `v-if="open"` inside the MOUNTED
pose box, so a shut sheet does no `cur` work.

```
┌────────────────────────── 256 ──────────────────────────┐
│  3 other players                                        │   others; rows show everyone
│  ┌──────────────┐                                       │   chart 10.667·N (96 at 9×9), top-left
│  │  ●      ●    │                                       │   frame 2 / subgrid 1.25 CSS px, pose 0
│  │      ◉       │                                       │   dots r 4 (8px), gap 2.667
│  │  ●        ●  │                                       │   ◉ = you, a RING, stroke 2, your blue
│  └──────────────┘                                       │
│  ◉  tragic-mockingbird  you                             │   the row's swatch IS the dot (8px)
│  ●  literary-panda           ← hovered: its dot alone   │   full opacity; the rest 0.55
│  ●  opposite-heron  26 seconds ago                      │   row 22.4 · gap 0
│  and 1 more                                             │
└─────────────────────────────────────────────────────────┘
```

Chart: `generateGridBoilFrames(size).frame[0]` + `.subgridLines[*][0]` scaled to `PITCH = 32/3` CSS
px per cell (side 42.67 / 96.00 / 170.67 at 4 / 9 / 16; `U = 1000/side`; dot r `4U`, frame `2U`,
subgrid `1.25U`, self ring `2U`) — pitch held, not the box; the height is paid and declared (+74.67
at 16×16). `useBoardShape` is a plain module ref written once per board from `BoardHost.vue:108`
(`watchEffect`), so CTRL-TAPE's boot-frame sampler graft is NOT needed here (said, so no one grafts
it). A dot per peer with a settled `cur`; a peer at `p: null` (looked away, or `Hidden`) keeps its
row and has no dot; a peer with NO ink has no dot (BoardHost's law, "no ink, no dot"). You are a
ring at `lastCell` (GameBoard.vue:457-460 the one write; cleared in `clearCursors()`), never at
`peerCursors`, never at anything a focusout reaches. Dots STEP when a peer's `cur` has held one cell
for `WASH.placeSettleMs` (700); no transition property (PRM by construction).

Query: `.pl-row[data-peer]` on `mouseenter` under `(hover: hover)` sets `queried`;
`.chart-dot:not([data-peer=queried])` takes `opacity: 0.55`. Coarse: no query; the chart is the
settled dots and the rows are everyone, said plainly in the spec.

**The sheet's height and the lap, closed form** (PREDICTION; the prototype re-measures every part
in one `evaluate` on an open sheet, regime witnessed):

```
H(r, m, N) = 36 + S + 8 + 10.667·N + 5.6 + 22.4·r + (1.6 + S)·m
   9×9 coarse: 164.5 + 22.4r + 20.5m        16×16: +74.67
lap(vh, r, m, N) = max(0, (44 + H) − (0.5·vh − 200.27))          grid top = 0.5vh − 200.27, twice to 0.01
   9×9, 844: (2,0) → 31.6 · (5,0) → 98.8 · (4,1) → 96.9
   9×9, 664: (2,0) → 121.6
```

`ROWS = { tall: 5, short: 2 }` on the substrate's `(min-height: 800px)` MQL; the chart is always
shown. The e2e viewport is EXACTLY 800 and the query is a boundary — the spec WITNESSES the MQL
(`matchMedia('(min-height: 800px)').matches`) before any row count and pins the viewport in the file,
so a one-pixel project change reds the witness row, not the ink row (research risk 10 answered).
No 390-wide phone holds two rows without lapping (zero lap needs `vh ≥ 834.2 + 48L` at 9×9); every
lapped cell's centre tap DISMISSES and hits no control.

`and N more` and the sr-only log are asserted to AGREE (G24): at 664 a room of six draws two rows
while the log holds every name — the state line's count, the rows + foot, and the log's row count
reconcile at every arm.

Counting, declared once for THIS family: OTHERS on the state line and the name; EVERYONE in the
rows, you first; `and N more` the remainder (the same base as PLR-SELF; the incompatible route
against PLR-COUNT stays separate for the agglomerator).

Keys, focus, Escape, PRM (`.player-lobby, .player-lobby.is-open` — G22), bounds, CH-71: the
substrate's. The sign's `@focusout` DIES with the mark's (PLR-SELF §3.6); G21 (press twice: closes;
read the BOARD both times, CTRL-COST's WebKit pre-click blur law) stays this family's.

### 3.4 The well — the substrate's roster plus THIS family's one row

Invite, `players-status`, `players-roster` (sr-only, `role="log"`, no tabindex), `players-alone`,
`leave` as PLR-SELF §3.4. Plus ONE option row in the OptionSelector grammar INSIDE `.players-well`,
`v-if="session.roomId.value"`:

| caption | chips | default | hint tape |
|---|---|---|---|
| `your cell` | `Shown` / `Hidden` | `Shown` | `everyone on this board can see which cell you are on` |

`Hidden` sends one `cur {p: null}` and `noteFocus` short-circuits after; the peer keeps its row and
loses its dot. After `@pointerdown.prevent`, OPENING the sheet puts nothing on the wire, so "one
null, then silence" means the control and only the control (G5). `Shown`/`Hidden` is a deliberate
second two-state vocabulary (a visibility, not a feature); the caption lowercase, the chips
Capitalised — the estate's own split.

What this does to the estate's counts: `zone-grammar.spec.ts:571` (`caption` == 2 in the coarse
regime) and `GameControlPanel.test.ts:328-332` (`["marks", "what fits"]`) run SOLO and are
UNCHANGED; a new unit row asserts `["marks", "what fits", "your cell"]` with a room. The P1 seal
(solo) is UNCHANGED by construction; a new arm of the same probe in a LIVE room asserts the well
≤ HEAD's live reading (109 at two rows, PLR-SELF G15's control) — the row is paid, and the number
says from what.

### 3.5 Speech

The chart is `aria-hidden`; the rows are the readable list (focused as a group on a keyboard open,
the substrate's disposition). Six regions in the measured order (+1 on the deck). The label mutates;
M19.

## 4 · Copy

The substrate's `LOBBY_COPY` static halves (`no other players` · `1 other player` · `other players`
· `you` · `seconds ago` · `and`/`more`) — `N other players` no longer escapes because the sentence
is composed from the table's halves, never as a template outside it (the critic's escapee, closed by
the substrate's grep row). This family adds `your cell` (a `.zone-row-label`, derived as one), `Shown`,
`Hidden`, and the tape `everyone on this board can see which cell you are on` (a static
`SheetWashiLabel text`). No em dash, no first person, the cut.

## 5 · Motion

| event | what moves | duration · curve · home |
|---|---|---|
| the room becomes ≥2 / drops to 1 | the sign's `color` | `MOTION.presenceInkMs: 400` (the substrate's row) · `--ease-standard` · PRM 0s |
| the count changes | same-frame numeral swap | none |
| a peer settles on a cell (sheet open) | its dot's `cx/cy` | a step, gated by `WASH.placeSettleMs: 700` (useJoinWash `WASH`, the damping home); the 800 arm is a RE-RUN on a tree whose constant is 800, reported, never predicted |
| a row is hovered | the other dots' opacity 1 → 0.55 | same-frame, no transition (one affordance) |
| a peer looks away / `Hidden` | its dot unmounts | none |
| the sheet | the substrate's 150ms; PRM `none` on both selectors | inherited |

The head has ZERO event-driven motion beyond the 400ms ink.

## 6 · Desktop and mobile, light and dark

Desk 1280 fine: sign 45.13×39.75 at (75.53,12); sheet at (0,51.75), opaque, H(r,m,9) by the law;
laps the wordmark's box and the board's top-left (the substrate's CH-71 census counts it; the chart
makes it the tallest of the three sheets, said). Phone coarse 844 (`hasTouch: true`): sign 44×44 at
(75.53,0); sheet at (0,44); (2,0) laps 31.6 by the law — declared, tap dismisses. Phone 664: (2,0)
laps 121.6 — declared. 16×16: +74.67, no arm has measured it at any row count — the prototype
measures (5,0) and (2,0) at 844 and reports. Dark: dots L 0.8, the ring #60a5fa, frame the dark
graphite arm; quiet 6.11 on the opaque ground.

The iPad cell (1280×800 coarse, the P1 seal): the `your cell` row is ABSENT solo (the seal's own
scene) and, in a room, replaces roster pixels the substrate already removed.

---

## 7 · Plan (this family's files ONLY)

1. `useJoinWash.ts:101-115` — `WASH.placeSettleMs: 700` (the roster half's death is the substrate's).
2. `useSession.ts` — `lastCell` ref beside `clearCursors()`; `shareCursor` (default true) consulted
   by `noteFocus`; `setShareCursor`. (`lastHeard`/`PRESENCE_QUIET_MS` and `:537` are the substrate's.)
3. `GameBoard.vue:457-460` — the one `lastCell` write. `BoardHost.vue:108` — `setBoardShape`.
4. `PlayerSign.vue` — `@pointerdown.prevent`; no Enter handler; no `@focusout`; the
   `:focus-visible` rule; slotted through the substrate's `#mark`.
5. `PlaceChart.vue` + this family's berth in `PlayerLobby.vue` — pitch-held chart; ring stroke 2;
   no-ink-no-dot; the hover query; `v-if="open"` chart inside the mounted box.
6. `GameControlPanel.vue` — the `your cell` row INSIDE `.players-well`, `v-if` on `roomId`; the
   `.zone-row-label` count unit row with a room.
7. `e2e/player-place.spec.ts` (`PRM:` line + an `emulateMedia` call in the file; inside
   `tsconfig.e2e.json` and `lint:motion`'s census) + the rate replay (700 and 800 arms, SLOW control
   behind `PLC_SLOW=1`, background, polled); `check-pw-projects.mjs` SPEC_MANIFEST gains it.
8. **STRIPPED from the pass-2 replay** (the return names each): `join-language.spec.ts`,
   `multiplayer.spec.ts`, `check-copy-register.mjs` (`COPY_SOURCES` dies; no rename to `LOBBY_LINES`
   is needed — `COPY_TABLE_NAME` reads `LOBBY_COPY` by name), `App.vue`, `AttributionCard.vue`,
   `PlayerSign.vue`'s seam comment, `GameControlPanel.vue`'s roster hunk, the deletion of
   `.player-row { color }` / `:style="p.ink"` / `.player-swatch` (the substrate KEEPS them, so the r0
   hue-census rows are NOT MOVED — `instruments/r0-r2-authorship-rows.md` is withdrawn as moot), the
   `candidates` → `your cell` zone row beside the pencils group, the `is-arriving` retirement comment,
   T7-W2 A4's retirement (the leader's row, inherited).
9. Reported MOVED: r0 I3 (substrate). Reported UNCHANGED: r0 hue-census rows 127-128.

Dies: the 24px miniature; the `?? --color-user-ink` fallback; the 1.5px ring; the fixed 96px box;
the claim-to-four sentence; the `v-if` pose box; the fourth zone row on every board; the +32.83.

## 8 · Prototype brief

Fresh worktree from `74a2b5d9`; replay worktree -54's diff (`filesTouched` from
`pass2/critique/PLR-PLACE.md`), STRIP §7.8 before building, take the substrate from PLR-SELF's
worktree (copy files if `git` is refused; state the route). Serve on 127.0.0.1:4243 `--strictPort`
with a private `cacheDir` scratch `.mts`; HEAD control server on the next free port in 4230–4249;
scratch PW config, CWD `web/frontend`. `?wire=local` pair plus the lane's driven peers for N=6 and
N=15; every opening through a REAL press (`locator.click()`), never `el.click()` in `evaluate`; BOTH
pages of any π rect census in ONE declared regime (`hasTouch: true, isMobile: true` on the phone,
witnessed by `matchMedia` first). Poll `.controls-card` y to rest before any dock reading; take
`elementFromPoint` ownership readings only outside `.play-controls[inert]`. Build in the worktree
for the dist gates. Kill every server before returning.

Frames (≤4, ≤150 KB): (1) the chart at 9×9 N=3 phone COARSE light with `.chart-self` PAINTED under a
real press; (2) 16×16 N=6 desk dark (170.67px, dots 8, gap 2.667); (3) a hovered row with the other
dots at 0.55; (4) the `your cell` row inside the players well in a live room, with the same well
solo beside it (the "paid from the roster" frame).

Censuses: filterBudget on the BUILT dist — shut / open solo / open live, both engines, both regimes
(pass 2's 6/6 was a dev server; the estate's titles say "built dist"); `hue-census.probe.ts` copied
and re-pointed (29 rows byte-identical; rows 127-128 still resolving); heading census (the caption
is a row caption, not a heading); r0 I3 through the diff; I2 RED by ruling; I4/I5/family law bare;
the rate replay at 700 and 800 on WebKit with the SLOW control completing (background, polled);
the P1 seal probe (`visual-regression.spec.ts:790`) SOLO — expect byte-identical to HEAD — and its
live-room arm.

Numbers that mean success: `.chart-self` count 1 after a REAL press, both engines, mouse AND
keyboard (from `lastCell`) · the wire carries NO `cur` on a mouse press · B's ghost of A stays 1
while A reads the chart · Enter opens once; Escape closes a mouse-opened sheet with
`activeElement` the same cell (the substrate's G8b) · **G20**: at 390 coarse with a peer-authored
cell focused and the tape up, the open sheet's box vs the tape's painted box — lap reported;
`elementFromPoint` at the intersection == `[data-lobby]`; a tap there dismisses · **G21**: press
twice closes, the board read both times · G22: `0s, 0s, 0s` under reduce on the OPEN sheet, both
engines · G23: the ring's outline style/width/offset keyboard-focused · filters 9→9→9 on the dist ·
sign frame ≥ 3:1 at 28px painted; dots ≥ 3:1 at r 4 (≥5.23); ring stroke 2 ≥ 4.96 / 7.52; subgrid
and every AA row from PAINTED bytes · `--ink-press-quiet` ≥ 5.20 / 6.11 on the sheet over the
wordmark · ≤ 40 moves/min/peer at 700 and the 800 reading reported, WebKit · `cur {p:null}` then
silence within 200ms of `Hidden`; OPENING sends nothing · 44×44 coarse · **the sheet's parts
measured in one evaluate == the closed form ±0.5 at (2,0), (5,0), (4,1) × 844/664 × coarse/fine,
and lap == law ±4 at every arm**, the MQL witnessed first · 16×16 (5,0) and (2,0) at 844 reported ·
zero head DOM mutations over 60s · **P1 seal SOLO byte-identical to HEAD (1142.38 + 82.42
unchanged)**; live-room well ≤ 109 · `zone-grammar.spec.ts` and `GameControlPanel.test.ts` GREEN
unchanged solo; the new live-room caption row `["marks", "what fits", "your cell"]` · regions 6 in
order, deck +1 · woff2 4,312 B · `lint:copy` 0 · `lint:knip` 0 · `check-pw-projects` 6/6 ·
`lint:motion` 0 with the spec inside its census · the roster readers GREEN as one background shell
script, log polled.

## 9 · Born-RED gates (`e2e/player-place.spec.ts` unless noted; substrate gates inherited from PLR-SELF §9)

| id | asserts | at HEAD |
|---|---|---|
| r0 I3 (MOVED, substrate) | `[data-lobby]:visible` 1 of 2; Enter arm opens once | RED |
| G1 rate | ≤ 40 moves/min/peer at 700 on the banked trace, WebKit and chromium; the 800 arm reported with the SLOW control completing | RED |
| G2 self-ring | `.chart-self` 1 under a REAL press, mouse and keyboard, both engines; stroke 2 ≥ 3:1 painted | RED (absent) |
| G3 seam | 0 new `cur` on the press; the ghost 1→1; `document.activeElement` (not `.closest()`) names the same cell before and after | RED |
| G4 head-still | zero mutations under `[data-player-mark]` over 60s, sheet shut | RED |
| G5 opt-out | `Hidden`: one `cur {p:null}` then silence; row survives, dot does not; OPENING sends nothing | RED |
| G7 filter-census (dist) | 9 shut / open solo / open live | extended; dev-server 6/6 is not the row |
| G8′ lap-law | the closed form at ≥3 arms per regime, `max(0, …)`, regime WITNESSED; every lapped tap dismisses, hits no control | RED (+4.7 residual at HEAD's box) |
| G9 caption-width | `your cell` fits at 390 and 1023 inside the well | RED |
| G10 board-unbound | 81 cells 0 bindings solo and after a self write on this route | GREEN today; guards the NO arm |
| G12 font / copy | woff2 4,312 B; `lobbyStrings` derive non-empty; the tape and chips in the corpus | GREEN by construction |
| G13 sheet-AA (painted) | quiet ≥ 4.5, subgrid ≥ 3, ring ≥ 3, worst dot ≥ 3 on the opaque ground over the wordmark, both themes, from painted bytes | RED (4.20) |
| G14 pitch | dot 8.00 and gap 2.667 at 4×4 / 9×9 / 16×16; chart == 10.667N | RED |
| G15 no-ink-no-dot | a peer with no ink renders no dot (unit) | RED |
| G16 query | hover a row: its dot 1, the rest 0.55; coarse: no change | RED |
| G18 pi-regime | the rect census runs both pages in one DECLARED pointer regime; control `74a2b5d9` named; phone `.controls-card` height SOLO == HEAD | RED (the +32.83 was a fine-regime read) |
| G19 well-paid | `your cell` absent solo; present with `roomId`; live `.players-well` ≤ HEAD's 109; P1 seal SOLO == HEAD | RED |
| G20 tape × sheet | the open sheet's box vs the coarse attribution tape's painted box with a peer-authored cell focused; z-order asserted; tap dismisses | RED (never measured) |
| G21 press-twice | press, press: closes; the BOARD read both times | RED |
| G22 PRM-open (substrate) | `0s, 0s, 0s` under reduce on `.player-lobby.is-open` | RED (0.15s) |
| G23 focus-ring | the sign's `:focus-visible` outline, keyboard-focused | RED (no rule) |
| G24 count ↔ chart ↔ log | state count, drawn rows + foot, and the sr-only log's rows reconcile at (2,0) 664 N=6; a peer with no ink / at `p:null` / on `Hidden` each carry a qualifier a reader can tell apart | RED |

Handed on by design: T7-W2 A4 (the leader's row); the family law (PAL-WALK); I4/I5 (the seam);
real iOS (M19); the 800 arm's number if WebKit's rate rig stalls — reported as stalled, never
predicted.
