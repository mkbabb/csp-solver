# PASS-1 SYNTHESIS · PLR-PLACE · The seating chart

Section §11 (icon · lobby) · §12 · M14. Synthesized 2026-09-17 from the pass-1 research
lane (`../research/PLR-PLACE/README.md`) against the r0 ground. Read-only on the product.
U-10: this proposes. The research's own word: if the owner disposes against the split,
this family is a KILL — the 24px miniature cannot pass without ceasing to be a miniature.

Verdict carried forward: ADJUST BY SPLIT at the size boundary. What dies: the 24px head
miniature (frame 0.288px / 1.52:1; wobble 0.170px, sub-pixel; dots 2.35–2.69:1; the
motion budget reaches the 8 Hz beat at 6.6 peers). What lives: the chart at 96px inside a
surface the reader OPENED, where dots read 5.45–10.63:1, the frame 9.65–19.45:1, filters
9 → 9, and motion is not ambient.

Decisions made in synthesis:

1. The head half is a SIGN, not a miniature: the board's own drawn edge at sign scale
   (`HandDrawnOutline :pose="0"`, the estate's one box grammar, R6 law 37), 28 × 28, EMPTY
   when solo, holding the count of others when live. It foreshadows the chart without
   pretending to be it, and it is still (zero `cur` reaches the head).
2. Attribution is CLAIMED ONLY TO N = 4. Past four the chart is a picture of where the room
   is working and the rows are who is in it; the two readings do not join, and the spec
   says so rather than asking the reader to discriminate 12.5° of hue. The one join that
   costs nothing is kept: the row's swatch IS the chart's dot (same r, same ink), and YOU
   are a ring, not a dot — the estate's own peer-cursor idiom (`gameCell.css:229-241`).
3. The foot line dies (PLR-SELF §0's derivation); the quiet fact rides the row's qualifier.
4. The privacy control is a CONTROL, so it lives in the well (M14's fence), as an on/off
   option row in the estate's own OptionSelector grammar. "hide where i am looking" is
   refused (first person, R6 law 36).

---

## 1 · Tokens

| role | token | light | dark |
|---|---|---|---|
| sign frame + count, solo | `--ink-press-quiet` | 5.12:1 on the page | 6.01:1 |
| sign frame + count, live | `--color-user-ink` | #2563eb, 4.96:1 | #60a5fa, 7.52:1 |
| chart frame + subgrid | `--color-pencil-graphite` at stroke-opacity 0.95 / subgrid `--ink-press-rule` (55%) | 12.48:1 / ≥3:1 | 10.95:1 |
| a peer's dot, a peer's row swatch | `inkFor(k[peer])`, fill, opacity 1 | 5.45–6.11:1 at 96px on four grounds | 9.52–10.63:1 |
| your ring | `--color-user-ink`, stroke 1.5px, no fill | 4.96:1 | 7.52:1 |
| names | `--color-pencil-graphite` | 14.65:1 on the sheet | 12.19:1 |
| state line, qualifiers | `--ink-press-quiet` | 5.16:1 | 6.03:1 |
| sheet | the @mbabb card's pose byte-for-byte | | |
| tap floor | `--tap-floor` on the sign itself, both dimensions | | |

Demand on PAL-WALK / PAL-TIN: the first four indices pairwise ≥ 50° (attribution is
claimed to four), all clearing the 29 board inks and the head's 12 warm tokens; index 15
must not sit 0.4° from `--color-user-ink`, because on this surface your ring and a dot
would be the same hue with only their SHAPE apart.

## 2 · Type

| surface | face | rung | weight |
|---|---|---|---|
| the count inside the sign | Patrick Hand | `--type-small` (a 1–2 digit numeral in a 28px box) | 500 |
| state line | Patrick Hand | `--type-tag` | 500 |
| row name | Patrick Hand | `--type-small` | 400 |
| qualifier, `and N more` | Patrick Hand | `--type-tag` | 400 |
| option caption `your cell` (the well) | the row-caption voice as §1/§10 rules it | | |

All inside the cut; no comma, no colon (neither is in the cut — the research's
`index.css:95-96` reading); zero re-cut.

## 3 · Components

### 3.1 The sign — `PlayerSign`

`<button data-player-mark :aria-label="stateLine" :aria-expanded :aria-controls>` padded
`0.618rem 0.786rem`; coarse `min-width/min-height: var(--tap-floor)`. Inside: a 28 × 28
box wearing `HandDrawnOutline :stroke-width="2" :outset="0" :pose="0"` (the guard face's
keep width; pose 0 enrols no beat; zero filters — the ribbon precedent) and, centred, the
count of OTHERS in Patrick Hand. The frame at 2 CSS px clears 3:1 at any size because it
is graphite/blue at full opacity, not a 0.288px anti-aliased hairline — the born-RED gate
G3 proves it on painted bytes rather than assumes it.

| state | frame | inside |
|---|---|---|
| solo (no room, or a room of one) | quiet | empty — the research's own "honest empty" |
| live, N others | `--color-user-ink` | `N` in `--color-user-ink` |
| hover (fine) | the ink lift, quiet → graphite, solo only | |
| open | `aria-expanded="true"` | |
| PRM | identical; ink transition 0 s | |

Nothing in the sign responds to `cur`. The head is still by construction (G4 counts DOM
mutations in the head over 60 s of a peer's key-repeat sweep: zero).

```
phone 390 coarse:
┌──────────────────────────────────────────────────────────┐
│ @mbabb  ┌──┐                                         ☀   │
│         │ 3│   ← 28×28 drawn box, "3" others, blue       │
│         └──┘      44×44 floor, still                     │
└──────────────────────────────────────────────────────────┘
```

### 3.2 The chart + roster — `PlayerLobby`

The @mbabb card's pose byte-for-byte at x = 0, `data-lobby`, plain markup. Mounted only
while open (`v-if="isOpen"` inside the pose box — the chart re-renders on `cur`, and a
shut sheet must do no work).

```
┌────────────────────────── 256 ──────────────────────────┐
│  3 other players                                        │
│  ┌──────────────┐                                       │   chart 96×96, top-left
│  │  ·      ·    │                                       │   frame stroke 2, subgrid 1.25
│  │      ◦       │                                       │   dots r 4 (0.375 of the 10.67 pitch)
│  │  ·        ·  │                                       │   ◦ = you, a ring in your blue
│  └──────────────┘                                       │
│  ◦  tragic-mockingbird  you                             │   the row's swatch IS the dot
│  ·  literary-panda                                      │
│  ·  opposite-heron  26 seconds ago                      │
│  ·  and 1 more                                          │
└─────────────────────────────────────────────────────────┘
```

Chart: `generateGridBoilFrames(size).frame[0]` and `.subgrid[0]` scaled to 96 (pose 0,
geometry only; zero filters — 9 → 9 measured with the chart mounted), stroke 2 / 1.25
CSS px. A dot per peer with a `cur` position, `r = 4px` (≥ 0.375 of the 9×9 pitch; the
research's 24px pass threshold was 0.40 of a 2.67px pitch — at 96 the dot is 8px wide and
clears every ground). A peer at `p: null` (looked away, or opted out) has NO dot and keeps
its row. You are a ring at your own cell. On a 16×16 board the pitch is 6px: dots r 2.5px,
attribution claimed to N = 2, and the spec says the 16×16 chart is a density picture only.

Dots STEP, never glide: the position updates when a peer's `cur` has held one cell for
`WASH.placeSettleMs` (700 — a NEW row beside `bootSuppressMs/coalesceMs/minGapMs` in
`useJoinWash.ts:101`, the estate's home for damping constants). Measured: 33–37
moves/min/peer on ordinary play, a 20 s key-repeat sweep collapses to 3. No transition
property on the dot (PRM green by construction).

Rows beneath the chart at full 224 width (no clipping; the research's side-by-side column
clipped 2 of 14 slugs at 112px). Row swatch = the same dot / ring at 8px. Names graphite,
qualifier quiet: `you` on self, `N seconds ago` on a peer past 20 s at open.

Line budget: the chart costs 96 + 12 = 108px ≈ 5 rows, so on a phone (bound 208.5) the
sheet holds state + chart + 2 rows + `and N more` = 76 + 22·4 + 108 = 272 — it LAPS THE
BOARD BY ~64px while open on a phone. This is declared as a DELTA, not hidden: the sheet
is a disclosure the reader opened over their own board and shuts with a tap outside; a
smaller chart walks back toward the 24px failure (64px was not measured; G8 measures it
before any shrink is argued). Desk: state + chart + 5 rows or 4 + more.

### 3.3 The well (controls stay in controls)

Invite, `players-status`, `players-roster` (sr-only, `role="log"` kept), `players-alone`,
`leave` as in PLR-SELF §3.3 — plus ONE option row in the OptionSelector grammar:

| caption | options | default | hint tape |
|---|---|---|---|
| `your cell` | `shown` / `hidden` | `shown` | `everyone on this board can see which cell you are on` |

`hidden` sends one `cur {p: null}` and stops sending (`noteFocus` short-circuits): measured
free — no new message kind; the peer keeps its roster row and loses its dot. The caption
must fit the 3.75rem caption column (48.8px at 390); gate G9 measures it.

### 3.4 Speech

The sign's `aria-label` is the state line (`no other players` / `N other players`); it
mutates, focus never moves, the sheet never opens on a remote event (M19, measured green
for the focus half; G6 asserts the label half). The chart is `aria-hidden` (a picture of
positions the log already speaks as `looked away` / cell names per W3); the rows are the
readable list. Three live regions → three.

## 4 · Copy

`no other players` · `1 other player` / `N other players` · `you` · `N seconds ago` ·
`and N more` · `your cell` · `shown` · `hidden` · `everyone on this board can see which
cell you are on`. Nine strings; the cut; M16; no first person.

## 5 · Motion

| event | what moves | duration · curve · home |
|---|---|---|
| the room becomes ≥ 2 / drops to 1 | the sign's `color` | `MOTION.presenceInkMs: 400` (shared with PLR-SELF's row) · `--ease-standard` · PRM 0 s |
| the count changes | same-frame swap of the numeral | none |
| a peer settles on a cell (sheet open) | its dot's `cx/cy` | a step, no transition; gated by `WASH.placeSettleMs: 700` |
| a peer looks away / opts out | its dot unmounts | none |
| the sheet | the card's 150ms `--ease-standard` | inherited |

The head has ZERO event-driven motion beyond the one 400ms ink; the chart moves only
inside a surface the reader opened. Nothing boils in either (pose 0 throughout).

## 6 · Desktop and mobile, light and dark

Desk: sign 45.2 × 39.8 at (75.5,12); sheet at (0,51.8), 256 × (80.5 + 108 + 22.4·L).
Phone coarse: sign 44 × 44 at (75.5,0); sheet at (0,44), laps the board by ~64px at four
lines (declared). Dark: dots at L 0.8 (9.52–10.63:1), the ring `#60a5fa`, frame the dark
graphite arm. Reduced transparency: the sheet goes opaque.

---

## 7 · Plan

1. `src/games/shared/useJoinWash.ts:101` — `WASH.placeSettleMs: 700`.
2. `src/games/shared/useSession.ts` — `lastHeard[id]` at `:630`; `PRESENCE_QUIET_MS`;
   `shareCursor` ref (default true) consulted by `noteFocus` (`GameBoard.vue:456-476`,
   `App.vue:609` unchanged); `:537` UNTOUCHED (the board keeps your blue).
3. `src/games/shared/PlayerSign.vue` — the head sign on `HandDrawnOutline :pose="0"` +
   `useHoverCard` + `defineExpose({ close })`, slotted into `AttributionCard`'s `#mark`
   (PLR-SELF §7 step 4).
4. `src/games/shared/PlayerLobby.vue` — chart + rows; the chart is a child `PlaceChart.vue`
   taking `{ size, frame, subgrid, peers: {ink, pos}[], self: pos }` and a settled
   `peerCursors` derived by a 700ms hold per id.
5. `GameControlPanel.vue` — the `your cell` option row beside `candidates` (the same
   OptionSelector call shape); the roster → `sr-only`; the departing rows and one-shots DIE.
6. `src/App.vue:802/:813` — slot the sign; `closeAll` unchanged.
7. `e2e/player-place.spec.ts` — §9's rows, LOCAL (O-12); the research's `rate.spec.ts`
   trace tap becomes the moves-per-minute instrument.

Dies: the 24px miniature (never built); the foot; the roster's pixels; the bare-path
frame of the prototype (replaced by `HandDrawnOutline` — one box grammar).

## 8 · Prototype brief

The §7 patch in a throwaway worktree, `npx vite --host 127.0.0.1 --port 4243
--strictPort`, the lane's scratch config (`research/PLR-PLACE/probe/pw.config.ts`), a
`?wire=local` pair plus the lane's 14 driven peers (`lobby.spec.ts`) for the chart at
N = 15.

Screenshots: the sign solo and live at 390 coarse light + 1280 dark (4 crops); the sheet
at N = 3 (phone, showing the lap) and N = 15 (desk); the `your cell` row. ≤7 crops.

Censuses: `filterBudget` 9 with the sign mounted and the chart open, both engines, both
regimes (poll to the settled 9 first); `hue-census.mjs` 29 rows unchanged; the heading
census unchanged (the option caption is a ROW caption, not a heading — if §1's law makes
captions headings, this row follows it); the wobble probe does not apply; r0 I2/I3/I4/I5
and the family law bare; the research's `rate.spec.ts` with `placeSettleMs` applied.

Numbers that mean success: I3 GREEN; I2 RED by ruling (the board keeps your blue —
recorded); I4/I5 and the family law RED unchanged; filters 9 → 9; sign frame ≥ 3:1 on
painted bytes at 28px both grounds both themes; dots ≥ 3:1 at r 4 on four grounds (≥ 5.45
expected); zero DOM mutations in the head across a 60 s sweep with the sheet shut;
≤ 40 moves/min/peer on the scripted ordinary trace and ≤ 3 for a 20 s sweep with the
sheet open; `cur {p:null}` on the wire within 200ms of `hidden`; 44 × 44 coarse with the
negative control; the phone lap measured and written as a DELTA row (expected ~64px);
live regions 3 → 3; M19 whole; woff2 4,312 B; copy gate clean; `your cell` fits 48.8px.

## 9 · Born-RED gates

| id | asserts | at HEAD |
|---|---|---|
| r0 I3 | a `button` named `/player/` in the head opening `[data-lobby]` | RED |
| G1 rate | with `placeSettleMs` 700, ≤ 40 moves/min/peer on the banked ordinary trace; ≤ 3 on the sweep | RED (no constant) |
| G2 dot-contrast | every dot ≥ 3:1 at 96px on background and card, light and dark, painted bytes | RED (nothing drawn) |
| G3 sign-contrast | the sign's frame ≥ 3:1 at 28px, painted bytes, both grounds both themes | RED |
| G4 head-still | zero DOM mutations under `[data-player-mark]` over 60 s of a peer's key-repeat with the sheet shut | RED |
| G5 opt-out | after `hidden`, the wire carries `cur {p:null}` then no `cur`; the row survives, the dot does not | RED (no control) |
| G6 M19-whole | focus unmoved, sheet shut, `aria-label` mutated on a third join | RED |
| G7 filter-census | 9 with the sign + open chart, both regimes | extended scene |
| G8 phone-lap | the sheet's overlap with the board's top at four lines is MEASURED and equals the declared DELTA ±4px | RED (undeclared) |
| G9 caption-width | `your cell` fits the caption column at 390 and 1023 without wrapping | RED |
| G10 board-unbound | 81 cells, 0 ink bindings solo and in a room | GREEN today; guards F1 |
| G11 live-regions | 3 → 3; `.players-roster` keeps `role="log"` | RED once moved |
| G12 font-cut | coverage OK, woff2 4,312 B; no comma/colon in any drawn string | GREEN by construction |
