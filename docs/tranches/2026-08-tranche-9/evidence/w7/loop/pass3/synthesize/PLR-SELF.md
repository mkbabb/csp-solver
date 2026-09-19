# PASS-3 SYNTHESIS · PLR-SELF · The stub is you (§11's LEADER)

§11 (icon · lobby) · M14. Synthesized 2026-09-18 from `../research/PLR-SELF/README.md` (R1–R6 at
`74a2b5d9`, both engines) against `pass2/synthesize/PLR-SELF.md`, `pass2/critique/PLR-SELF.md`,
`pass3/CHAIR-RULINGS.md` and registry-v2 §2/§6. Read-only on the product; this proposes; U-10.
Base for every file:line is `74a2b5d9` unless it says "pass 2" or "worktree -52".

The design was re-planned as tokens/type/layout/principles and reviewed against the tell list
before this spec (the frontend-design method, second pass at this base). What moved in the review:

1. **The sheet's furniture is ONE law for the section, seated here.** Three families measured
   three row boxes (21.6 / 23.6 / 24.0) because each let the row's height fall out of its content
   and the pointer regime. The substrate now DECLARES the row: `min-height: 1.4rem` (22.40px) with
   `line-height: 1.35` on the sheet, `gap: 0` on the list. In both regimes the row is 22.40 (coarse
   name box 16 × 1.35 = 21.6 < 22.4; PLR-COUNT's 22px stroke fits; PLR-PLACE's 8px dot fits). The
   registry's coupling-16 graft (`H = 57.36 + 21.6r + 18.96m`) is reported MOVED, superseded by the
   furniture's law in §3.3 with PLR-COUNT's three residuals named; PLR-PLACE's `gap`/`min-height`
   cure is the same cure, taken.
2. **The keyboard open moves focus INTO the sheet; the mouse open never does.** This is the A4
   disposition (§3.6) and it restores the APG premise the critic's Escape defect broke: Escape
   returns focus to the mark only when focus is inside the disclosure. The mark's `@focusout`
   DIES; the section's focus dismissal is one document `focusin` listener while open (no
   `relatedTarget`, which WebKit hands as `null`).
3. **`COPY_SOURCES` DIES.** The fold's `COPY_TABLE_NAME` (check-copy-register.mjs:344) discovers
   `LOBBY_COPY` by name and reads its object body including template-literal static segments. Two
   readers of one subject is the alias family; the born-RED row is "a planted dash inside
   `LOBBY_COPY` reds EXACTLY ONCE". Pass 2's +131-line arm is struck; the re-cut is named (CHAIR,
   "the base moved").
4. **The `.player-swatch` re-point is a SUBTRACTION, not a move.** Both rules that the estate's
   five roster reads resolve through STAY (`.player-row { color }` at GameControlPanel.vue:1670 and
   `.player-swatch { background }` at :1689); only the swatch's geometry dies. Zero estate reads
   move; the r0 hue-census rows (`.player-row .player-name` color, `.player-swatch`
   background-color) still resolve, so nothing is reported MOVED for them.
5. **CH-71 gets its census and its gate.** The head's disclosures lap the board today (4 cells at
   HEAD, a click at two of them opens GitHub). The sheet laps more and the gate says by how much
   and asserts the click-through is gone for the lobby; the incumbent's is a LEDGER row.

F1 side: YES on the artifacts (chair §6.8 — three of four leaders); both arms stay buildable and
are framed; nothing folds until the owner's eye.

---

## 1 · Tokens

No new hex. Resolved values for the reader; the source is the token.

| role | token | light | dark |
|---|---|---|---|
| sheet ground | `var(--color-popover)` OPAQUE (index.css:137 / :366) | `hsl(48 10% 98.5%)` = rgb(252,251,251) | `hsl(24 7% 6.5%)` = rgb(18,16,15) |
| sheet edge · radius · padding · width | `2px solid color-mix(in srgb, var(--color-border) 30%, transparent)` · `1rem` · `1rem` · `min-width: 16rem` (256) | | |
| the mark's ink, solo | `--mark-ink: var(--ink-press-quiet)` (index.css:262, graphite at 68%) | ≈rgb(107) on paper · 5.19:1 | 6.06:1 |
| the mark's ink, live | `--mark-ink: var(--color-user-ink)` rebound by `inkFor(k[self])` (F1) | walk worst-of-40 on popover **5.279** (idx 38) · card 5.358 · background 5.231 | **9.637** (idx 13) · 9.504 · 9.710 |
| state line · qualifier · `and N more` | `--ink-press-quiet` on the opaque popover | 5.19–5.28:1 | 6.06–6.10:1 |
| row name | `--color-user-ink` per row (the person's ink, inline on `.pl-row`) | worst 5.279 | worst 9.637 |
| row stub | `currentColor` | | |
| your ink, solo board | `--color-user-ink` #2563eb / #60a5fa, NOTHING bound (byte-identical) | | |
| focus ring | `2px dashed var(--ring-ink, currentColor)`, `outline-offset: 3px` (DrawerTab.vue:152's form) | ≥5.19 | ≥6.06 |
| tap floor | `min-width/min-height: var(--tap-floor, 2.75rem)` under `(pointer: coarse)` | 44×44 | |
| head anchor | `top: var(--head-rule)` — NO fallback; publisher registered (§3.7) | 12px desk · 0 phone | |

Two fallbacks, two laws, stated once so no reviewer reads either as a violation: CHAIR §6.5 strikes
fallbacks on MEASURED tokens the estate publishes from TS before first paint (`--masthead-foot`,
`--pin-band`, `--card-pad-t`, `--washi-tag-rung`, the motion rungs) — `--head-rule` is that class and
loses its fallback here. `--tap-floor` is a static declaration on `.page-root` (App.vue:961) whose
fallback IS the shipped literal by index.css:825-827's own law, obeyed by all five estate consumers;
`--ring-ink` does not exist at HEAD (zero hits) and registry-v2 ruling 4 has MRK-LIVE mint it with
every consumer writing `var(--ring-ink, currentColor)`. The mark obeys both.

AA is worst-index-named (38 light, 13 dark) so a future palette change has a number to red
against; the sampler is WCAG luminance through a canvas (registry coupling 16), never a
darkest-byte read.

## 2 · Type

| surface | face | rung | weight | line-height | resolved |
|---|---|---|---|---|---|
| state line (`no other players` / `N other players`) | Patrick Hand | `--type-tag` | 500 | 1.35 | 14.048 desk · 14 coarse → 18.965 / 18.9 |
| row name | Patrick Hand | `--type-small` | 400 | 1.35 | 16 both → 21.6, inside the 22.4 floor |
| qualifier (`you` / `N seconds ago`), `and N more` | Patrick Hand | `--type-tag` | 400 | 1.35 | 14.048 / 14 |

`line-height: 1.35` is DECLARED on `[data-lobby]` (pass 2 inherited 1.5 in one family's box and
1.35 in another's — that is the regime dependency, cured by saying it). Every glyph inside the
46-codepoint cut (index.css:94-96: every digit, no `j`, no `x`); woff2 4,312 B asserted.

## 3 · Components — the substrate, seated ONCE (chair §6.9 · §6.12)

Everything in §3.1, §3.3, §3.4, §3.5, §3.6, §3.7 is section substrate. PLR-COUNT and PLR-PLACE
replay their centres on top of it and STRIP their own copies of every hunk named here.

### 3.1 The head wrapper — `AttributionCard` + `useHoverCard`

- The four hover handlers move one level in onto `.attribution-disclosure` (trigger + card);
  `<slot name="mark" />` is its flex sibling AFTER it in `.head-left-row`. DOM order = tab order:
  `@mbabb` → card links (2) → DEV toggle → mark → sun (the MEASURED route, chromium press 4; pass
  2's "@mbabb → mark" wording is struck).
- `headDisclosures = new Set<() => void>()` + `claimHeadDisclosure(mine)` (PLR-COUNT's five-line
  graft, useHoverCard.ts:26-30 in worktree -53) — called from `open()` and from the mark's open.
  **Section law: the head has ONE open disclosure and ONE dismissal set.** The incumbent card has
  no Escape today (useHoverCard.ts:18-60, no key listener; measured `aria-expanded` stays true) —
  the window Escape owner in §3.6 closes whichever disclosure is claimed, so the law is written
  here, not inherited.
- `.attribution-trigger`'s `@keydown.enter.stop` deleted (CH-70; useHoverCard.ts:47's comment
  rewritten).
- The slot is gated `<template #mark v-if="view === 'playing'">` on BOTH instances (App.vue:805-841
  at HEAD). No mark on the deck.

### 3.2 The mark — `PlayerMark` + `PlayerStub` (this family's centre)

`<button type="button" data-player-mark :aria-label="stateLine" :aria-expanded
:aria-controls="lobbyId" @click.stop="toggle" @pointerdown.prevent>`, padded `0.618rem 0.786rem`
(45.13 × 39.75 fine on `@mbabb`'s centre line; 44 × 44 coarse). Inside: the crayon stub, 20×13
units in a 24×24 viewBox, `fill: currentColor`, `aria-hidden`.

| state | ink | pose | when |
|---|---|---|---|
| rest, solo | quiet graphite | [0] (seed 67, boilAmount 0) | no room, or a room of one |
| rest, live | `--color-user-ink` = self's `k` index (F1) | [0] | ≥2 at the table |
| hover, `(hover: hover)` | UNCHANGED | [1] = `generateRectBoilFrames(…, 0.4, 2)[1]` | picked up; ink and alpha never move |
| focus-visible | UNCHANGED | [1] + the ring | keyboard only; a mouse press never focuses (pointerdown prevented) |
| open | as its state; `aria-expanded="true"` | | |
| PRM | identical; the 400ms ink transition is 0s; the swap is a swap | | |

**The pose swap gets a perceptual floor** (critique gap 6). Two numbers, both born-RED at
`boilAmount 0`: (a) the minimum vertex displacement between pose[0] and pose[1], in CSS px at the
rendered 20×13, ≥ 0.5; (b) the raster mean-abs-diff over the mark's own painted box (both engines,
dpr 2) ≥ 8/255. The prototype measures what 0.4 actually yields and the gate pins THAT number as
the floor with the `boilAmount 0` negative control in the same run; a spec that pins a number
nobody measured is the vacuous-gate mode.

```
.player-mark { --mark-ink: var(--ink-press-quiet); color: var(--mark-ink);
               transition: color var(--presence-ink-dur) var(--ease-standard); }
.player-mark.is-live { --mark-ink: var(--color-user-ink); }
.player-mark:focus-visible { outline: 2px dashed var(--ring-ink, currentColor); outline-offset: 3px; }
@media (pointer: coarse) { .player-mark { min-width: var(--tap-floor, 2.75rem); min-height: var(--tap-floor, 2.75rem); } }
/* no colour in :hover or :focus-visible — the pose swaps, the ink stays */
```

### 3.3 The sheet — `PlayerLobby` (furniture; the row content is each family's)

The `@mbabb` card's POSE (fixed at `(0, var(--head-rule) + trigger height)`, z 50, the `.hover-card`
opacity/transform rule verbatim: 150ms `--ease-standard`, `visibility 0s linear 150ms` on close)
with an OPAQUE ground. `data-lobby`, `tabindex="-1"`, `role="group"`, `:aria-label="stateLine"`.
NO `@click.stop`: a tap anywhere on the sheet reaches the root's `closeAll` and shuts it.

```
┌────────────────────────── 256 ──────────────────────────┐   y = 44 phone coarse · 51.75 desk
│  2 other players                                        │   state · --type-tag 500 · quiet
│  ▰  dirty-coyote  you                                   │   stub 14×9 + name, ONE ink
│  ▰  grim-lemming                                        │   row 22.4 · --type-small
│  ▰  opposite-heron  26 seconds ago                      │   qualifier in the row's own gap
└─────────────────────────────────────────────────────────┘   opaque popover · 2px edge at 30%
```

Furniture, declared (the only numbers a family may not change):

```
[data-lobby]            { padding: 1rem; border: 2px solid …; min-width: 16rem; line-height: 1.35 }
.pl-state               { font: 500 var(--type-tag)/1.35 var(--font-hand) }        S = tag × 1.35
.pl-rows                { margin-top: 0.35rem; display: flex; flex-direction: column; gap: 0 }
.pl-row                 { min-height: 1.4rem; display: flex; align-items: center; gap: 0.5rem }
.pl-more                { margin-top: 0.1rem; font: 400 var(--type-tag)/1.35 var(--font-hand) }
```

**The section's height law** (a PREDICTION from the box; the prototype measures every part in one
`evaluate` on an open sheet, regime witnessed first):

```
H(r, m) = 36 + S + 5.6 + 22.4·r + (1.6 + S)·m          S = 18.965 desk 1280 · 18.9 coarse 390
        = 60.565 + 22.4r + 20.565m  (desk)             = 60.5 + 22.4r + 20.5m  (coarse)
```

Against pass 2: PLR-COUNT's `58.965 + 23.6r + 20.565m` differs by the 1.6 gap it charged per row
and the 22 floor (its residuals 173.93/173.88 desk, 173.80/173.75 tall phone, 103.00/102.97 short
phone were right for ITS box); PLR-SELF's `57.36 + 21.6r + 18.96m` was the 21.6 line box with no
floor. Both are superseded, and coupling 16's graft is reported MOVED with those three residuals.
Tall phone (844 coarse, sheet at y 44): H(5,0) = 172.5 → bottom 216.5 < grid top 221.73, clears
5.2; H(4,1) = 170.6, clears 7.1. Desk (sheet at y 51.75): H(5,0) = 172.6 → bottom 224.3 — laps the
board's top-left (CH-71, §3.8).

Rows: `ROWS = { tall: 5, short: 2 }` on ONE module-scope MQL `(min-height: 800px)`. Tall: state + ≤5
rows, or state + 4 + `and N more`. Short: state + ≤2 rows, or state + 1 + `and N more` — PLR-COUNT
proposes the short regime's foot dies (its §3.3); that is a family row on top of this furniture,
not a change to it. Never a scroll.

Counting, declared once for THIS family: the state line and the accessible name count OTHERS; the
rows show EVERYONE, you first; `and N more` counts the remainder of the rows. (PLR-COUNT's base
counts everyone; the two bases stay distinct — the agglomerator's decision, not this spec's.)

Qualifiers read at OPEN (`openedAt`, no timer): `you` on self; `N seconds ago` on a peer whose
`lastHeard` is ≥ `PRESENCE_QUIET_MS` (20 000, exported from useSession.ts beside `HEARTBEAT_MS`
and `PRESENCE_EXPIRY_MS` at :616-624; the component's `quietAfterMs: 20000` prop default DIES).
The band is (20 s, 45 s) and reachable only through a missed beat — §8 says how it is proven.

PRM: the reduce arm is written `.player-lobby, .player-lobby.is-open { transition: none }` (a media
query adds no specificity; `.is-open` at (0,2,0) beats a bare (0,1,0) arm — PLR-PLACE's critic's
trap, cured in the furniture so no family can re-open it).

### 3.4 The well (M14: controls stay in controls)

`.players-roster` → `sr-only` UNCONDITIONALLY; keeps `role="log"`, `aria-live="polite"`,
`aria-label="who's on this board"`; `tabindex` DIES (the A4 disposition, §3.6); the departing rows,
the three one-shots and `max-height` die; `useJoinWash`'s roster half (`arriving`, `departing`,
both `rowArmMs`, `rowHoldMs`, `armRow`, the timers pool) dies. **`.player-row { color:
var(--color-user-ink) }` (:1670) and `:style="p.ink"` (:1152) STAY. `.player-swatch` STAYS as a
ZERO-BOX COLOUR HOOK**: `background: var(--color-user-ink)` kept; `flex`, `width`, `height`,
`border-radius` deleted. The estate's reads, measured, every one still resolving:

| read | node · property | after |
|---|---|---|
| join-language.spec.ts:96-100 | `.player-row` color | resolves (rule kept) |
| join-language.spec.ts:162-168 | peer vs self `.player-row` color | resolves |
| join-language.spec.ts:170-177 | `.player-swatch` backgroundColor == row color | resolves (both strings serialise from the same inline custom property — measured side by side, PLR-COUNT's risk 5) |
| multiplayer.spec.ts:191-195, :580 | `.player-swatch` backgroundColor | resolves |
| multiplayer.spec.ts:379 | `.players-roster` `toBeVisible()` | RE-AIMED at `[data-lobby]` `toBeVisible()` after a press — the new VISIBLE surface, never a bare count |
| presence:48 · session-substrate:29/206/225 · access:370 · follow-still:71 | `.player-row` count / texts | resolve (sr-only keeps the DOM) |
| join-language-prm.spec.ts:83-100 | `.player-name` animationName / clipPath, `is-arriving` | RE-CUT: the board ring's PRM arm (progress 0, :70-89/:145-155) plus the OPEN sheet's computed `transition-duration` `0s, 0s, 0s` under reduce (G-PRM) |
| GameControlPanel.liveRegions.test.ts:199/209/214/221 | sr-only conditional, tabindex | re-cut to unconditional sr-only, no tabindex |
| r0 hue-census.probe.ts:127-128 | `.player-row .player-name` color · `.player-swatch` background-color | UNCHANGED — not MOVED |

The well inside W2's portrait dock: the −64 px is CARD pixels, not board (measured: the open dock
covers the whole board and `.play-controls[inert]` is W2's answer); `.players-well` ≤ 284.2 × 48
live is the gate and the dock's settled pose either side is banked (poll `.controls-card` y to
rest, ≥700ms).

### 3.5 Speech

Six playing-view regions IN THE MEASURED ORDER at this base, both engines: margin-note · board-voice ·
players-status · players-roster · players-alone · copy-status (pass 2's alphabetised order stays
refuted; G6 pins the measurement). The deck adds exactly ONE (`gallery-live`, measured +1 — pass
2's "+2" is struck; G6's deck arm asserts what is mounted). The mark's `aria-label` mutates on a
join; focus never moves on a remote event; the sheet never opens on one (M19).

### 3.6 Keys, focus and the A4 disposition (the leader's row, chair §6.7)

**T7-W2 A4 — disposed.** A4's reason (GameControlPanel.vue:1120: "a focusable box with nothing in
it is a dead stop on the tab route") bought a keyboard route to a log that is otherwise
write-only, on a surface that DREW its rows. Under this design the roster is `sr-only` at every
N, and A4's own reason then holds MORE strongly: an invisible focusable box is a dead stop with no
visible focus (2.4.7). So the `tabindex` goes WITH the pixels, by A4's law and not against it, and
the keyboard route to the rows moves to the door that draws them:

- **Keyboard open** (Space/Enter on the focused mark — focus is on the mark, which is how a
  keyboard open is told from a mouse open; no `event.detail` heuristics): the sheet opens AND
  takes focus (`el.focus()` on `[data-lobby]`, `tabindex="-1"`, `role="group"` named by the state
  line) — the rows are read by AT as the focused group's contents. This closes PLR-COUNT's gap 7
  (option ii) under the leader.
- **Mouse open**: `@pointerdown.prevent` — the cell keeps focus, no `cur` frame, focus moves
  NOWHERE (the seam, PLR-PLACE's arm I, both engines).
- **Escape**: window-bound while open, one owner, honours `defaultPrevented`, added on open and
  removed on close (the GameGallery.vue:696-721 idiom). Focus return is GUARDED:
  `if (sheet.value?.contains(document.activeElement) || mark.value === document.activeElement) mark.value.focus()`
  — the APG's return with its premise restored. After a mouse open, Escape leaves
  `document.activeElement` exactly where it was (the cell), sends no `cur` (the critic's defect,
  cured).
- **Focus leaving**: the mark's `@focusout` DIES. While open, ONE document `focusin` listener
  closes the disclosure when `e.target` is outside `[data-player-mark]` and `[data-lobby]` (fires
  on the NEW element; no `relatedTarget`). Tab from the focused sheet lands on the next tabbable
  after the mark in DOM order and the sheet closes — an honest leave.
- **Outside press**: App.vue's `closeAll`, unchanged.

Reachability in both engines: the contract is asserted off `el.focus()` on chromium AND webkit
(G8); the real-Tab route on chromium (G9); on webkit, Tab does not visit buttons without macOS
full keyboard access, which Playwright cannot set (playwright#2114/#5609/#20629) — G9's webkit row
is a `test.skip` carrying that reason, declared per-row in `check-pw-projects`' form. That is the
platform, not a gap, and the disposition does not wait on it: the mark is a native `<button>` in
DOM tab order on both engines.

### 3.7 `--head-rule` gets its publisher (CHAIR §6.5, inherited)

`.corner-left, .mobile-attribution { top: var(--head-rule, 0.75rem) }` (AttributionCard.vue:131)
resolves to its fallback — `getPropertyValue('--head-rule')` reads EMPTY at the root, both engines.
The mark hangs off the same anchor. Landed here, resolved toward §10's leader's hunk if that lands
first: `@property --head-rule { syntax: '<length>'; inherits: true; initial-value: 0.75rem }` in
index.css beside the registered rungs; the phone pose declares its own `--head-rule: 0` where it
declares its pose today; the consumer's fallback is struck. Born-RED: delete the registration and
the corner's `top` computes `auto` — the KILLER (research risk 9) is the gate.

### 3.8 Bounds and CH-71 — the lap, counted

Three bounds: **sun** — right edge 256 < sun left (326 at 390, 1072 at 1280), hard. **Wordmark** —
covered while open (opaque; desk 19.9% of the sheet's box), declared, one tap uncovers. **Board** —
desk laps structurally; tall phone clears by the law; short phone laps by the law.

CH-71 at HEAD, both engines (the control): the incumbent `.hover-card` `[0, 51.75, 256, 151]` laps
cells 0, 1, 9, 10 (4992 / 3777 / 540 / 408 px²); at 0 and 1 the top element is `a.text-foreground`
and a click opens GitHub. The lobby at H(5,0) = 172.6 laps MORE cells — the gate counts them and
asserts, at every lapped cell's centre, `elementFromPoint` is `[data-lobby]` (never a link, never
a cell) and a tap DISMISSES. The incumbent's click-through is booked as the LEDGER row (trigger:
this census) and framed for the owner: the same corner with both sheets drawn — may the head's
disclosures lap the board at all (U-10).

## 4 · Copy (M16, the cut)

`no other players` · `1 other player` · `other players` (prefixed by N) · `you` · `seconds ago`
(prefixed by N) · `and` … `more` (around N). Every STATIC HALF lives in `LOBBY_COPY` in
`src/pencil/chrome/PlayerMark/copy.ts` as a plain string property; the numerals come from the count
(digits are in the cut). No sentence is composed outside the table: a grep row asserts
`PlayerLobby.vue`'s template carries no string literal that is not `LOBBY_COPY.*`. The fold's
`COPY_TABLE_NAME` reads the table by NAME; `check-font-coverage.mjs`'s `lobbyStrings` derive keeps the
house `return body ? … : []` shape (caught at :495-501). No em dash, no first person, no `j`/`x`,
no comma, no colon.

## 5 · Motion

| event | what moves | duration · curve · home |
|---|---|---|
| the room becomes ≥2 / drops to 1 | the mark's `color` | `MOTION.presenceInkMs: 400` (pencilConfig, one doc comment; v-bound `--presence-ink-dur`) · `--ease-standard` · PRM 0s; at 200ms the ink is strictly between the endpoints |
| hover / focus-visible | the stub's `d` | same-frame swap [0]→[1]; no transition |
| sheet open / shut | opacity + `scale(0.9) translateY(8px)` | 150ms `--ease-standard` (`.hover-card` verbatim); consumes §13's ladder rung for show/hide if one is published, else the literal; PRM `none` on BOTH selectors |
| a row arrives while open | nothing | still |

One choreographed moment: the board's join trace (1180ms) and the mark's 400ms land on the same
`join`. Nothing else in the head moves.

## 6 · Desktop and mobile, light and dark

- Desk 1280×800 fine: `@mbabb` 75.53×39.75 at (0,12); mark 45.13×39.75 at (75.53,12); sheet at
  (0,51.75) 256 wide, opaque; laps the wordmark 19.9% and the board's top-left (§3.8, counted).
- Phone 390×844 COARSE (`hasTouch: true`, declared in every phone arm): mark 44×44 at (75.53,0);
  sheet at (0,44); 5 rows bottom 216.5 < 221.73.
- Phone 390×664 coarse: 2 rows; lap == law ±4; every lapped tap dismisses.
- Dark: `--peer-ink-l` 0.8, quiet 6.06, ground rgb(18,16,15). Nothing else changes.
- Gallery: no mark (slot gated). `.game-card-swatch` repaints to the walk ink in a room — F1's
  declared consequence on the deck, one crop.

---

## 7 · Plan (files, order, what dies; every hunk re-cut for "the base moved" named)

1. `useSession.ts` — F1 at :537/:556 (self takes `inkFor(index)` when `roomId` is set; solo binds
   nothing; both arms buildable behind one const); `lastHeard` stamped in `armPresenceExpiry`
   (:630-635); `export const PRESENCE_QUIET_MS = 20_000` at :616-624.
2. `pencilConfig.ts` MOTION — `presenceInkMs: 400`.
3. `index.css` — `@property --head-rule`; `AttributionCard.vue:131` drops the fallback.
4. `AttributionCard.vue` + `useHoverCard.ts` — §3.1 whole, incl. `claimHeadDisclosure` (from
   worktree -53) and CH-70's deletion.
5. `icons/PlayerStub.vue` (poses [0]/[1]) · `PlayerMark.vue` (§3.2, §3.6: guarded Escape, document
   `focusin`, NO `@focusout`, NO `:116` unconditional focus) · `PlayerLobby.vue` (§3.3 furniture,
   `tabindex="-1"` + `role="group"`, keyboard-open focus, PRM double selector, `LOBBY_COPY`) ·
   `PlayerMark/copy.ts` · `types.ts:7`'s stale comment rewritten.
6. `App.vue` — `<template #mark v-if="view === 'playing'">` both instances.
7. `GameControlPanel.vue:1131-1137, :1649-1695` — §3.4 (roster sr-only, tabindex dies, one-shots
   die, swatch geometry dies, `color` rule STAYS); `useJoinWash.ts` roster half dies;
   `BoardHost.vue:74-77` guard by id.
8. Gates re-cut: `liveRegions.test.ts:199-221`; `join-language-prm.spec.ts:83-100`;
   `multiplayer.spec.ts:379`; `multiplayer.spec.ts:190-191`'s stale comment; `filter-census.spec.ts`
   gains the OPEN-disclosure scene (§8); `check-pw-projects.mjs` SPEC_MANIFEST + `player-mark.spec.ts`
   with its webkit row declared.
9. `e2e/player-mark.spec.ts` — §9, `PRM:` line in the first 20 lines, an `emulateMedia` call in
   the file (check-motion-contract check 3); LOCAL (O-12).
10. **Struck from pass 2 (the base moved)**: the `COPY_SOURCES` arm (+131 on check-copy-register.mjs)
    whole; `check-font-coverage.mjs`'s conflict resolved toward the fold (`what fits`, `paperNoteCopy`);
    `quietAfterMs` prop default; the mark's `@focusout`; `PlayerMark.vue:116`.
11. r0 I3 diff (`:visible` + `toHaveCount(2)` + exactly-one-visible) — MOVED; coupling-16 height
    graft — MOVED; LEDGER: CH-70 (Enter double-toggle) + the CH-71 incumbent click-through row.

Dies: the pressure lift; `@keydown.enter` on both marks; the lobby's `@click.stop`; the 80% ground on
the lobby; the roster's pixels and its `tabindex`; the 740ms hold; `COPY_SOURCES`; the mark's
`@focusout`; the swatch's geometry; the `--head-rule` fallback. Files PLR-COUNT and PLR-PLACE must
STRIP from their replays (the siblings' returns name them): `AttributionCard.vue`, `useHoverCard.ts`,
`App.vue`, `GameControlPanel.vue`'s roster hunk, `useSession.ts`'s `lastHeard`/`PRESENCE_QUIET_MS`,
`useJoinWash.ts`'s roster half, `check-copy-register.mjs`, `check-font-coverage.mjs`'s `lobbyStrings`,
`join-language.spec.ts`, `join-language-prm.spec.ts`, `multiplayer.spec.ts`, `liveRegions.test.ts`,
`PlayerLobby.vue`'s furniture and `LOBBY_COPY`'s static halves.

## 8 · Prototype brief

Fresh worktree from `74a2b5d9`; replay worktree -52's diff (`filesTouched` from
`pass2/critique/PLR-SELF.md`; copy files if `git` is refused and say so), resolve every conflict
TOWARD the fold, apply §7. Serve `npx vite --config <evidence-dir scratch .mts: {...base, cacheDir:
'<worktree>/.vite-cache'}> --host 127.0.0.1 --port 4241 --strictPort`; the HEAD control is a second
read-only server on `74a2b5d9` at the next free port in 4230–4249. Scratch PW config (no webServer,
chromium + webkit, baseURL 4241, CWD `web/frontend` — never `NODE_PATH`, which node's ESM resolver
ignores; instruments use `createRequire('<abs>/web/frontend/package.json')`). Rooms on `?wire=local`;
every phone arm `hasTouch: true, isMobile: true` and the regime WITNESSED by `matchMedia` before any
number. Open the incumbent card by HOVER on fine pointers (a click toggles a hover-opened card SHUT).
Poll `.controls-card` y to rest before any dock reading. Kill both servers before returning; the
band reads empty.

Build: `npm run build` in the worktree ONLY (never main; dist identity on main is frozen) for the
filter census and the P1-class gates.

Frames (≤4, ≤150 KB, cited): (1) desk light, four at the table, sheet open over the board with the
incumbent card's box drawn beside it — the CH-71 frame for the owner; (2) phone 390×844 coarse dark,
N=7, the compression line; (3) the hovered live mark at pose [1] beside rest [0] (one strip, the
perceptual-floor frame); (4) the deck's `.game-card-swatch` in a room (F1's declared delta).

Censuses (re-run, both engines): filterBudget exact-match on the BUILT dist — settled/shut, incumbent
card OPEN (run FIRST, expect 9; if not, the arm reads the boot window, not the sheet), lobby OPEN,
both regimes; r0 `hue-census.probe.ts` COPIED to `pass3/prototype/PLR-SELF/instruments/`, OUT
re-pointed, 29 rows byte-identical + the two roster rows still resolving; heading census byte for
byte; r0 `instruments.spec.ts` I2/I4/I5 verbatim and I3 through the proposed diff; the family law bare.

Numbers that mean success: I2 GREEN both pages (F1 arm) · I3 GREEN through the diff · hovered AND
focus-visible live mark `color` == `oklch(0.5 0.11 h)` both engines · pose[1] vs pose[0]: min vertex
displacement and raster mean-abs-diff both ≥ the measured floor, and BOTH 0 at `boilAmount 0` (the
negative control in the same run) · mid-flight 200ms strictly between · mouse press: no `cur`, the
cell keeps focus, and after Escape `document.activeElement` is the SAME cell (both engines) ·
keyboard: Space opens AND `activeElement === [data-lobby]`; Escape closes AND `activeElement ===
[data-player-mark]`; Enter opens once (both engines) · Tab route chromium (press 4), webkit skipped
loudly · every glyph core ≥ 4.5:1 on the opaque ground with the wordmark under it, worst index 38 /
13 named · sheet right edge 256 · tall-phone bottom < 221.73 · short-phone lap == law ±4 and every
lapped tap dismisses · desk lapped-cell census: N cells named, `elementFromPoint` == `[data-lobby]` at
each, tap dismisses; the HEAD control's 4 cells with `a.text-foreground` reproduced · `N seconds ago`
RENDERED: `page.clock.setFixedTime(T0)` → boot, invite, B joins → `setFixedTime(T0 + 26_000)` → open
within one beat → the row reads `26 seconds ago`; then a real silence past 45 s takes the row ·
filters 9→9→9 on the dist · solo fingerprint identical (24-cell hash, no room) · live-region roll 6
in the measured order, deck +1 · woff2 4,312 B · `lint:copy` 0 with a planted dash in `LOBBY_COPY`
redding EXACTLY ONCE · `lint:knip` 0 · `check-pw-projects` 6/6 · `.players-well` ≤ 284.2×48 live ·
delete the `--head-rule` registration → the corner's `top` computes `auto` · `join-language`,
`join-language-prm`, `multiplayer`, `access`, `follow-still-authorship`, `presence`,
`session-substrate` GREEN both engines — run ONCE as a background shell script with its log polled
(the stall law), never inline.

## 9 · Born-RED gates (`e2e/player-mark.spec.ts` unless noted)

| id | asserts | at HEAD |
|---|---|---|
| r0 I2 | own swatch == room ink (F1) | RED |
| r0 I3 (MOVED) | `[data-lobby]:visible` 1 of 2 after a press; button `/player/` in the head | RED |
| G1 solo-identity | 24-cell hash solo, no room, vs mark mounted | RED |
| G2 filter-census (`filter-census.spec.ts`, dist) | 9 settled · 9 incumbent open · 9 lobby open, both regimes | extended; the HEAD-first run is the control |
| G3 tap-floor | 44×44 coarse; a 40px negative control fails | RED |
| G4 three-bounds + CH-71 | right edge < sun; tall-phone bottom < grid top; short/desk lap == law ±4; every lapped cell's `elementFromPoint` is the sheet and its tap dismisses | RED (HEAD: `a.text-foreground` at cells 0, 1) |
| G5 sheet-AA | glyph cores ≥ 4.5:1 on the opaque ground over the wordmark, both themes, worst index named | RED (80% ground) |
| G6 live-regions | the six-node roll in the MEASURED order; the deck adds exactly one | RED |
| G7 M19-whole | third page joins: focus unmoved, sheet shut, `aria-label` mutated | RED |
| G8 keys | off `el.focus()` both engines: Space → open + focus in the sheet; Escape → shut + focus on the mark; Enter once | RED |
| G8b mouse-Escape | mouse open → Escape: shut, `activeElement` the same cell before/after, no `cur` | RED (worktree -52 hands focus to the mark) |
| G9 tab-route | real Tab reaches the mark at press 4 with the ring + pose [1]; webkit `test.skip` with the platform reason, declared per row | RED |
| G10 inversion | hovered and focus-visible LIVE mark `color` == the walk ink | RED |
| G11 seam | a mouse press sends no `cur`; the cell keeps focus | RED |
| G12 mid-flight | 200ms after a join the ink is strictly between quiet and the walk ink | RED |
| G13 pose-floor | vertex displacement and raster diff ≥ the measured floor; 0 at `boilAmount 0` | RED |
| G14 deck-swatch | `.game-card-swatch` in a room == the walk ink (declared) | RED |
| G15 well-height | `.players-well` ≤ 284.2×48 live; dock pose banked either side | RED (109) |
| G16 quiet-rung | frozen clock: `26 seconds ago` renders; expiry takes the row | RED (never rendered) |
| G17 copy-once (`lint:copy` self-test) | a planted dash in `LOBBY_COPY` reds exactly once | RED-by-plant |
| G18 head-rule | delete the `@property` → `.corner-left` `top` computes `auto` | RED (no publisher at HEAD) |
| G19 focus-leave | while open, focus moving outside the disclosure root closes it (document `focusin`), both engines | RED |
| G-PRM | `.player-lobby.is-open` computed `transition-duration` `0s, 0s, 0s` under reduce, both engines | RED (0.15s in worktrees -52/-54) |

Gaps this family leaves OPEN by design and hands on: the accent-family law (12.5°/16 collisions —
PAL-WALK); I4/I5 (the substrate's reassignable index and re-issued claim — the multiplayer seam);
real iOS (M19, the owner's instrument); the relay arm beyond the one background battery run.
