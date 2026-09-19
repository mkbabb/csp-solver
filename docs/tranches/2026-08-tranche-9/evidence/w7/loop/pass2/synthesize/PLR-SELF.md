# PASS-2 SYNTHESIS · PLR-SELF · Your mark, in your ink

§11 (icon · lobby) · §12 · M14. Synthesized 2026-09-18 from `../research/PLR-SELF/README.md`
(r2-self / r2-live / r2-bounds / r2-ground / r2-aa / r2-keys, both engines) against the pass-1
record, `CHAIR-RULINGS.md` and R6. Read-only on the product. U-10: this proposes. F1 side stated:
YES — your page paints you the colour the room paints you, so colour on your own mark means
somebody else is here (the Gutenberg counter-position is read and refused for this product).

The design was planned as tokens/type/layout/principles first and reviewed against the generic
tells before this spec was written (the synthesizer's preamble). What moved in that review:

1. **The hover lift is a POSE SWAP, not a pressure lift.** Pass 2's cure ("the lift raises pressure,
   never hue") costs a live mark resting at 68% alpha, and by the ladder's own arithmetic that
   fails 1.4.11 in LIGHT: an oklch L 0.5 ink (Y≈0.125, sRGB ≈99) mixed 68% over paper 252 lands at
   ≈148 → Y≈0.30 → **≈2.9:1** on `--color-background`. Dark passes (≈5.3). So the mark never
   changes ink or alpha on hover or focus; its one affordance is the house's own path swap —
   `generateRectBoilFrames(…, boilAmount 0.4, frameCount 2)[1]` (gridPaths.ts:213), the stub
   "picked up", zero filters. One rule for solo and live; no `.is-live` in any hover/focus
   selector, so the ordering trap cannot return.
2. **The sheet's ground is OPAQUE by default.** The law-44 arm (PlayerLobby.vue:82-86) becomes
   the default for the lobby: a list needs a ground it can be measured against; 4.23:1 on the
   204 bleed was one stroke of luck away. The `@mbabb` card is untouched (π). Declared as the
   DELTA the owner disposes at the re-look.
3. **The lobby's `@click.stop` DIES.** The sheet has zero focusable elements; a tap on it should
   dismiss it, not do nothing. This is the phone's dismissal-a-reader-can-find and it prices the
   lap: whatever the sheet covers, one tap uncovers.
4. **The focusout seam has ONE substrate row for the section**: `@pointerdown.prevent` on
   `[data-player-mark]` (PLR-PLACE arm I, both engines: 1 click, `aria-expanded` moves, Enter/
   Space untouched, the cell keeps focus). Opening the sheet is not looking away — the board stays
   mounted under it, unlike the deck (App.vue:607-609, whose ruling stands for the deck). Tab to
   the mark stays an honest leave. The `relatedTarget` cure is dead (WebKit hands `null`).

---

## 1 · Tokens

No new hex. Resolved values for the reader; the source is the token.

| role | token | light | dark |
|---|---|---|---|
| sheet ground | `var(--color-popover)` — OPAQUE (the law-44 arm promoted) | `hsl(48 10% 98.5%)` ≈ #fcfbf9 | `hsl(24 7% 6.5%)` ≈ #121110 |
| sheet edge / radius / padding / width | `2px solid color-mix(in srgb, var(--color-border) 30%, transparent)` · `1rem` · `1rem` · `min-width: 16rem` | ≈#e6e5e2 @30% | ≈#2a2827 @30% |
| the mark's ink | `--mark-ink`: solo `var(--ink-press-quiet)` (graphite 68%); live `var(--color-user-ink)` rebound by `inkFor(k[self])` | #262626@68% → rgb(107) on paper, 5.19:1; live worst 5.26:1 over 40 | 6.06:1; live worst 9.56:1 |
| state line, qualifiers, `and N more` | `--ink-press-quiet` on the opaque popover | 5.19:1 (glyph core 107 on 252) | 6.06:1 |
| row name | `--color-user-ink` per row (the person's ink) | worst 5.26:1 | worst 9.56:1 |
| row stub | `currentColor` = the row's ink | | |
| your ink, solo board | `--color-user-ink` #2563eb / #60a5fa — nothing bound (byte-identical) | | |
| focus ring | `2px dashed currentColor`, offset 3 — the DrawerTab's form (R6 law 39), not a minted value; takes §6's chrome token the day one ships (§6.1) | ≥5.19:1 | ≥6.06:1 |
| tap floor | `--tap-floor: 2.75rem` on the mark, both dimensions, `(pointer: coarse)` | 44×44 | |

Demand on PAL-TIN, unchanged and numbered: index 0 (the host's) is 1.0° from
`--color-solver-ink-1` (#c2286e); 37 collisions in the first 16. Every `oklch(0.5 0.11 0)` in
this lane's readings re-mints when the walk moves. The 40-index sweep at 100% on
`--color-background` and `--color-card`, both themes, is the band this spec relies on; the 68%
sweep is NOT needed (nothing rests at 68% except graphite).

## 2 · Type

| surface | face | rung | weight | resolved |
|---|---|---|---|---|
| state line (`no other players`) | Patrick Hand | `--type-tag` | 500 | 14.048 desk · 14 coarse phone |
| row name | Patrick Hand | `--type-small` | 400 | 16 desk · 16 coarse |
| qualifier (`you` / `26 seconds ago`), `and N more` | Patrick Hand | `--type-tag` | 400 | 14.048 |

M01 resolved against the six-line budget: the ROWS take the raise (one rung above the well's
tag, already in pass 1); the state line, qualifier and foot do NOT (a raise on all three spends
16.2px against 12.4px held; the state line is a caption, not a control). Line-height 1.35
throughout (21.6 / 19.0px measured). Every glyph inside the 46-codepoint cut; woff2 4,312 B
asserted.

## 3 · Components

### 3.1 The head wrapper — `AttributionCard` (landed ONCE for §11)

- The four hover handlers move one level in onto `.attribution-disclosure` (trigger + card);
  `<slot name="mark" />` is its flex sibling AFTER it. Measured (PLR-COUNT graft.spec on this
  worktree): hovering the mark leaves the card at opacity 0 / `aria-expanded` false; the card's
  own pose stays (0,51.75) 256×151 byte for byte.
- `provide(headDisclosures, { register, claim })`; `closeAll` (App.vue:334) unchanged.
- DOM order = tab order: `@mbabb` → mark → sun.
- `.attribution-trigger`'s own `@keydown.enter.stop` is CH-70 (ledger row: Enter double-toggle
  on a native button; owner §11's leader; trigger: PLR-SELF research row B — coarse Enter does
  not open, Space does). Cured in the same diff by deletion: `useHoverCard.ts:47`'s comment is
  refuted by its own code and is rewritten.
- The slot is gated `<template #mark v-if="view === 'playing'">` on BOTH instances (the mark
  says who is on THIS board; the deck is not a board — App.vue:607's own reasoning). The mobile
  card's `v-show` is untouched.

### 3.2 The mark — `PlayerMark` + `PlayerStub`

`<button type="button" data-player-mark :aria-label="stateLine" :aria-expanded
:aria-controls="lobbyId" @click.stop="toggle" @pointerdown.prevent>` padded `0.618rem 0.786rem`
(45.2×39.8 fine, on `@mbabb`'s centre line; 44×44 coarse). NO `@keydown.enter`. Inside: the
crayon stub, 20×13 units in a 24×24 viewBox, `fill: currentColor`, `aria-hidden`.

| state | ink | pose | when |
|---|---|---|---|
| rest, solo | `--mark-ink` = quiet graphite | [0] (seed 67, boilAmount 0) | no room, or a room of one |
| rest, live | `--mark-ink` = `--color-user-ink` (self's `k` index bound on the button) | [0] | ≥2 at the table |
| hover (fine, `(hover: hover)`) | UNCHANGED | [1] (`generateRectBoilFrames(…, 0.4, 2)[1]`) | the stub is picked up; ink and alpha never move |
| focus-visible | UNCHANGED | [1] + `2px dashed currentColor` offset 3 | keyboard only; a mouse press never focuses (pointerdown prevented) |
| open | as its state; `aria-expanded="true"` | | |
| PRM | identical; the ink transition is 0s; the pose swap is a swap already | | |

CSS shape (the whole of the cure for the inversion):

```
.player-mark { --mark-ink: var(--ink-press-quiet); color: var(--mark-ink);
               transition: color var(--presence-ink-dur) var(--ease-standard); }
.player-mark.is-live { --mark-ink: var(--color-user-ink); }
/* no colour in :hover or :focus-visible — the pose swaps, the ink stays */
```

### 3.3 The sheet — `PlayerLobby`

The `@mbabb` card's POSE (position, edge, radius, padding, width, z 50, `visibility`-delayed
150ms fade) with an OPAQUE ground. `data-lobby`. Plain markup, no role, no live region. NO
`@click.stop`: a tap anywhere on the sheet reaches the root's `closeAll` and shuts it.

```
┌────────────────────────── 256 ──────────────────────────┐   y = 44 phone (coarse), 51.8 desk
│  2 other players                                        │   state · --type-tag · quiet
│  ▰  dirty-coyote  you                                   │   stub 14×9 + name, ONE ink
│  ▰  grim-lemming                                        │   --type-small
│  ▰  opposite-heron  26 seconds ago                      │   qualifier in the row's own gap
└─────────────────────────────────────────────────────────┘   opaque popover, 2px edge at 30%
```

Counting, declared once: **the state line and the accessible name count OTHERS; the rows show
EVERYONE, you first; `and N more` counts the remainder of the rows.** Three populations, one
sentence.

Rows: `ROWS = { tall: 5, short: 2 }` on a HEIGHT query `(min-height: 800px)` (one MQL beside the
coarse probe's idiom). Tall: state + ≤5 rows, or state + 4 rows + `and N more`. Short: state +
≤2 rows, or state + 1 row + `and N more`. Never a scroll. Height law (measured, PLR-COUNT):
`H(r, m) = 58.95 + 23.6r + 20.55m`.

Qualifiers read at OPEN (no timer): `you` on self; `N seconds ago` on a peer whose `lastHeard`
is ≥ `PRESENCE_QUIET_MS` (20 000) — 20…44 only. Compressed peers get none.

Focus/keys: Space and Enter toggle (native click, one handler); **Escape** is window-bound while
open, one owner, honours `defaultPrevented`, added on open and removed on close (the
GameGallery.vue:696-721 idiom, written out once); the mark's `@focusout` closes the sheet
(nothing inside it can take focus).

Bounds (G8's successor is THREE): sun — right edge 256 < sun left (326 at 390, 1072 at 1280),
hard. Wordmark — covered while open (opaque; desk 19.9% of the sheet's box, phone coarse laps
63px); declared, and one tap uncovers it. Board — desk laps structurally (256 > the 131.89
gutter; 2–4 of 81 cells); phone tall clears at 5 rows (3.98–12.4px); phone short laps by the
law; every lapped cell's centre tap DISMISSES the sheet and reaches no control.

### 3.4 The well (M14: controls stay in controls)

`.players-roster` → `sr-only` unconditionally, keeps `role="log"`, `aria-live="polite"`,
`aria-label`, drops `tabindex`; the departing rows and the three one-shots die;
`max-height` dies. **`.player-swatch` markup and CSS STAY** (sr-only, zero pixels) until
`e2e/join-language.spec.ts:175`, `e2e/multiplayer.spec.ts:193`, `:580` and r0 I2/I4 are
re-pointed at `[data-lobby] .lobby-row .lobby-stub path` — named here so its removal is a
two-line job (CHAIR §7). `useJoinWash`'s `arriving`/`departing`/`rowArmMs` and the 740ms hold
DIE (the sheet is still; no reader); `e2e/join-language-prm.spec.ts:97` re-aimed at the board
trace's PRM arm in the same commit.

BoardHost.vue:74-77's guard restated BY ID (`if (from === selfId.value) continue`); the
comment rewritten (self's ink is defined with F1; `peerCursors` keyed by `from` is the brace).

### 3.5 Speech

Six playing-view regions, in order: board-voice, copy-status, margin-note, players-alone,
players-roster, players-status; the deck adds `.gallery-live` and `.gallery-guard-live`. The
product comment says SIX and names the view. The mark's `aria-label` mutates; focus never
moves; the sheet never opens on a remote event (M19).

## 4 · Copy (M16, the cut)

`no other players` · `1 other player` / `N other players` · `you` · `N seconds ago` ·
`and N more`. Five strings, authored as `LOBBY_COPY` in `PlayerLobby.vue` (static halves) so the
`lobbyStrings` derive (font coverage) and the proposed `COPY_SOURCES` arm (copy register) read
ONE constant. No em dash, no first person, no `j`/`x`/comma/colon.

## 5 · Motion

| event | what moves | duration · curve · home |
|---|---|---|
| the room becomes ≥2 / drops to 1 | the mark's `color` | `MOTION.presenceInkMs: 400` (pencilConfig, one comment; v-bound `--presence-ink-dur`) · `--ease-standard` · PRM 0s. Mid-flight gate: at 200ms the ink is between the endpoints (both channels) |
| hover / focus-visible | the stub's path `d` | same-frame swap [0]→[1]; no transition |
| sheet open / shut | opacity + `scale(0.9) translateY(8px)` | 150ms `--ease-standard`, the `.hover-card` rule verbatim (`visibility 0s linear 150ms` on close); consumes MOT-LADDER's rung if one is named for it |
| a row arrives while open | nothing | still |

One choreographed moment: the board's join trace (1180ms) and the mark's 400ms land on the same
`join`. Nothing else in the head moves.

## 6 · Desktop and mobile, light and dark

- Desk 1280×800: `@mbabb` 75.5×39.8 at (0,12); mark 45.2×39.8 at (75.5,12); sheet at (0,51.8)
  256 wide, opaque; laps the wordmark's box 19.9% and the board's top-left (declared).
- Phone 390×844 coarse: mark 44×44 at (75.5,0); sheet at (0,44); 5 rows bottom ≤ 217.75 < 221.73.
- Phone 390×664 coarse: 2 rows; lap measured against the law; taps on the lap dismiss.
- Dark: `--peer-ink-l` 0.8, quiet 6.06:1, ground #121110. Nothing else changes.
- Gallery: no mark (slot gated to playing, both platforms). `.game-card-swatch`
  (GameCard.vue:365) repaints to the walk ink in a room — DECLARED with one crop as F1's
  consequence on the deck, not scoped away.
- `prefers-reduced-transparency` / `prefers-contrast: more`: already opaque; the arm becomes
  a no-op and is deleted.

---

## 7 · Plan

1. `useSession.ts:537` — self takes `inkFor(index)` when `roomId` is set (F1); solo binds
   nothing. `:630` `lastHeard[id]`; `PRESENCE_QUIET_MS = 20_000` beside `HEARTBEAT_MS`.
2. `pencilConfig.ts` MOTION — `presenceInkMs: 400`.
3. `icons/PlayerStub.vue` — poses [0] and [1]; prop `pose`.
4. `AttributionCard.vue` + `useHoverCard.ts` — §3.1 whole; delete `@keydown.enter.stop`
   (CH-70); rewrite the :47 comment.
5. `PlayerMark.vue` — `@pointerdown.prevent`; delete `:106`; `--mark-ink`; window Escape on
   open; `@focusout` close. `PlayerLobby.vue` — opaque ground; delete `@click.stop`; `ROWS` on
   the height MQL; `LOBBY_COPY`.
6. `App.vue:802/:813` — `<template #mark v-if="view === 'playing'">` both instances.
7. `GameControlPanel.vue:1124-1170` — roster sr-only; one-shots die; swatch STAYS (named).
   `useJoinWash.ts` — roster half dies. `BoardHost.vue:74-77` by id.
8. `GameControlPanel.liveRegions.test.ts:209/:221` re-cut; `join-language-prm.spec.ts:97`
   re-aimed; `check-font-coverage.mjs` `lobbyStrings` derive; `check-copy-register.mjs`
   `COPY_SOURCES` arm (from `research/PLR-SELF/instruments/`).
9. `e2e/player-mark.spec.ts` — §9, `PRM:` line in the first 20 lines; LOCAL (O-12).
10. r0 I3 diff (`:visible` + `toHaveCount(2)` + exactly-one-visible) — MOVED; LEDGER CH-70 +
    the stolen-cells row for the incumbent card (next id; trigger = PLR-PLACE arm C).

Dies: the pressure lift; the hover-region slot; `@keydown.enter` on both marks; the lobby's
`@click.stop`; the 80% ground on the lobby; the law-44 arm (now default); the roster's pixels;
the 740ms hold. Substrate rows made visible, not cured: I4/I5, the family law (PAL-*).

## 8 · Prototype brief

Replay `pass1/prototype/PLR-SELF/patch-tracked.diff` + `new-files` into a FRESH worktree
(`wf_e58b4764-0fc-46` is the pass-1 record), apply §7, `npx vite --config <scratch .mts with
private cacheDir> --host 127.0.0.1 --port 4241 --strictPort`, scratch PW config (no webServer,
chromium + webkit, `NODE_PATH` to the estate's node_modules), a second real tab on `?wire=local`.

Frames (≤4, ≤150 KB): (1) desk light, four at the table, sheet open, pointer parked at
(900,740) — the mark and the `you` row one ink on the OPAQUE ground; (2) phone 390×844 coarse
dark, N=7, the compression line; (3) the hovered live mark at pose [1] beside its rest crop
(one strip); (4) the deck's `.game-card-swatch` in a room (the declared F1 delta).

Censuses: filterBudget (poll to the settled 9) sheet open, both engines, both regimes; R6
`hue-census.mjs` COPIED and OUT re-pointed (29 rows unchanged); heading census unchanged; r0
`instruments.spec.ts` I2/I4/I5 verbatim and I3 through the proposed diff; family law bare.

Numbers that mean success: I2 GREEN both pages; I3 GREEN through the diff (pair count 2, one
visible, press reveals `[data-lobby]`); hovered AND focus-visible live mark `color` ==
`oklch(0.5 0.11 h)` (both engines; today rgb(38,38,38)); pose [1] `d` ≠ pose [0] `d` on hover;
mid-flight sample at 200ms strictly between endpoints; wire silent on a mouse press (no `cur`
frame, both engines) and the cell keeps focus; keys off `el.focus()`: Space open, Space close,
Enter open, Escape close, focus on the mark, both engines; Tab route + ring: chromium, webkit
loudly skipped; every glyph core on the sheet ≥4.5:1 over the OPAQUE ground with the wordmark
under it (darkest-pixel method; 5.19/6.06 expected); 40-index sweep at 100% ≥3:1 both grounds
both themes; sheet right edge 256; tall-phone bottom < 221.73; short-phone lap == law ±4px and
every lapped cell tap dismisses; filters 9→9; solo fingerprint identical; live-region roll 6 in
order, deck +2; woff2 4,312 B; copy gate 0 unadmitted with the new arm reading 5/5 strings;
`.players-well` ≤ 284.2×48.

## 9 · Born-RED gates

| id | asserts | at HEAD |
|---|---|---|
| r0 I2 | own swatch == room ink | RED |
| r0 I3 (MOVED) | `[data-lobby]:visible` count 1 of 2 after a press; button `/player/` in the head | RED |
| G1 solo-identity | 24-cell hash solo, no room vs mark mounted | RED |
| G2 filter-census | 9 with the sheet open, both regimes | extended |
| G3 tap-floor | 44×44 coarse; 40px negative control fails | RED |
| G4 three-bounds | right edge < sun; tall phone bottom < grid top; short phone / desk lap == law ±4 AND every lapped-cell tap dismisses and hits no control | RED |
| G5 sheet-AA | glyph cores ≥4.5:1 on the opaque ground with the wordmark under the sheet, sudoku + futoshiki, both themes | RED (80% ground) |
| G6 live-regions | the six-node playing roll IN ORDER; the deck adds exactly two, removes none | RED |
| G7 M19-whole | third page joins: focus unmoved, sheet shut, `aria-label` mutated | RED |
| G8 keys-1 | off `el.focus()`: Space/Space/Enter/Escape contract, focus stays; both engines | RED (Enter nets zero) |
| G9 keys-2 | real Tab reaches the mark, `:focus-visible` ring + pose [1]; chromium, webkit `test.skip` with reason | RED |
| G10 inversion | hovered and focus-visible LIVE mark `color` == the walk ink | RED |
| G11 seam | a mouse press on the mark sends no `cur`; the cell keeps focus; both engines | RED |
| G12 mid-flight | 200ms after a join the mark's ink is strictly between quiet and the walk ink | RED |
| G13 font-cut / copy | woff2 4,312 B; `COPY_SOURCES` reads `LOBBY_COPY` | GREEN by construction; the arm reds on a bound dash |
| G14 deck-swatch | `.game-card-swatch` in a room == the walk ink (declared) | RED |
| G15 well-height | `.players-well` ≤ 284.2×48 live | RED (109) |
