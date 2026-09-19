# PASS-1 SYNTHESIS · PLR-SELF · Your mark, in your ink

Section §11 (icon · lobby) · §12 · M14. Synthesized 2026-09-17 from the pass-1 research
lane (`../research/PLR-SELF/README.md`, 15/15 probe cases green both engines) against the
r0 ground (R5, R6) and the owner's frames. Read-only on the product. U-10: this proposes.

Verdict carried forward: the CRAYON STUB, not the written name (WCAG 2.5.3 and the 4× head
breathing kill the name); the SEAM, not mirror or move (a region in a shut sheet cannot
speak); F1 ruled SELF's way: your page paints you the colour the room paints you.

Two corrections made in synthesis, both against the research's own numbers:

1. The `last heard from …` FOOT dies. It was "a moment ago" nearly always, unreachable past
   45 s, and a seventh line inside a 6.4-line phone bound. The fact survives in the ROW: the
   qualifier berth after a name carries `you` for self and `26 seconds ago` for a peer
   whose last traffic is past 20 s. Zero extra lines, per-peer truth, same berth.
2. The state line is recut from `only you` / `3 on this board` to `no other players` /
   `2 other players`. It is the estate's own count idiom (`GameGallery.vue:219` "3 other
   players", R6 law 32), it is the mark's accessible name verbatim (one-name law), and it
   greens r0's I3 locator (`/player|…/i`) without editing the instrument — the research's
   "the locator moves" is refused; the copy moves.

---

## 1 · Tokens

No new hex. Every value below is an existing token; the hexes are the tokens' resolved
values for the reader (≈ where the source is hsl).

| role | token | light | dark |
|---|---|---|---|
| sheet ground | `color-mix(in srgb, var(--color-popover) 80%, transparent)` | ≈#fcfbfa @80% | ≈#121010 @80% |
| sheet edge | `2px solid color-mix(in srgb, var(--color-border) 30%, transparent)` | ≈#e6e5e2 @30% | ≈#2a2827 @30% |
| mark at rest, state line, qualifiers | `--ink-press-quiet` (graphite 68%) | 5.16:1 on the sheet, 5.12:1 on the page | 6.03 / 6.01 |
| mark hovered (fine pointers) | `--color-pencil-graphite` | #262626 (14.65:1) | the dark arm of `--grid-line-color` (12.19:1) |
| your ink, in a room | `inkFor(k[self])` = `oklch(var(--peer-ink-l) 0.11 h)` | L 0.5, worst 5.31:1 over the first 16 | L 0.8, worst 9.66:1 |
| your ink, solo | `--color-user-ink` #2563eb / #60a5fa | untouched; nothing bound | |
| a peer's row | `inkFor(k[peer])` | as above | |
| radius / padding / width | `1rem` / `1rem` / `min-width: 16rem` (256px) | the @mbabb card's pose byte-for-byte | |
| tap floor | `--tap-floor: 2.75rem` (44px), declared on the mark itself in BOTH dimensions (`.attribution-trigger` is excluded from the coarse min-width arm, index.css:849) | | |

The palette is not this family's. What the mark demands of PAL-WALK / PAL-TIN, stated
exactly: one ink per `k` index, ≥4.5:1 on popover-80%-over-background AND over-card both
themes, clear of the 29 reserved inks AND of the head's 12 warm tokens (PLR-COUNT's
finding), and index 0 clean above all — the host always wears index 0, and today it is
1.0° from `--color-solver-ink-1`.

## 2 · Type

| surface | face | rung | weight | resolved |
|---|---|---|---|---|
| state line (`no other players`) | Patrick Hand | `--type-tag` | 500 | 14.048 desk · 14 coarse phone · 12.179 fine 390 |
| row name | Patrick Hand | `--type-small` | 400 | 16 desk · 16 coarse · 14 fine 390 |
| qualifier (`you` / `26 seconds ago`) | Patrick Hand | `--type-tag` | 400 | as the state line |
| compression (`and 3 more`) | Patrick Hand | `--type-tag` | 400 | `--ink-press-quiet` |

Rows sit one rung ABOVE the well's `--type-tag` on purpose (M01's direction: raise, never
lower). Every glyph is inside the shipped 46-codepoint cut (`" !'-.0123456789?CRSabcdefgh
iklmnopqrstuvwyz×—…"`): zero woff2 re-cut, asserted by byte size (4,312 B) at the gate.
Lowercase by CSS law (R6 §28), no comma, no colon, no `j`, no `x`.

## 3 · Components

### 3.1 The mark — `PlayerStub`

A crayon stub: ONE filled hand-drawn rectangle, 20×13 user units in a 24×24 viewBox,
`generateRectBoilFrames(… roughness 0.4, segments 4, jagged: true, seed 67)[0]` — pose 0 of
the players well's own washi seed (67), so the head's stub and the well's tag are one
hand. `fill="currentColor"`, no stroke, no filter, no beat: the icon family's static-SVG
idiom (`src/pencil/chrome/icons/*.vue`, `aria-hidden`), measured to cost the census nothing.

| state | fill | when |
|---|---|---|
| rest, solo | `--ink-press-quiet` | no room, or a room of one (`session.players.length ≤ 1`) |
| hover / focus-visible (fine pointers only, `@media (hover: hover)`) | `--color-pencil-graphite` | the ink lift — the same lift `@mbabb` takes (muted → foreground); ONE affordance, no ground, no mark (R6 law 14) |
| live | `var(--color-user-ink)` with `inkFor(k[self])` bound on the button | ≥2 players; the room's `k` names your index on every page including your own |
| open | as its state; `aria-expanded="true"` | |
| PRM | identical; the ink transition is 0 s | |

Box: `<button type="button" data-player-mark :aria-label="stateLine" :aria-expanded
:aria-controls="lobbyId">` padded `0.618rem 0.786rem` — the `@mbabb` trigger's own √φ
rungs — so at a fine pointer it is 45.2 × 39.8, the same height as `@mbabb` (the stub's
20px line box + 2 × 9.9), and the two marks sit on ONE centre line; under `(pointer:
coarse)` it declares `min-width: var(--tap-floor); min-height: var(--tap-floor)` on itself
and measures 44 × 44, as `@mbabb` measures 75.5 × 44 there. Focus ring: `2px dashed
currentColor`, offset 3 (the DrawerTab's form). Colour: `transition: color
var(--presence-ink-dur) var(--ease-standard)`.

Position: inside `AttributionCard`'s wrapper as a flex sibling of the trigger (§5 plan), so
it inherits `position: fixed; top: var(--head-rule); left: 0; z-index: 40; padding-left:
env(safe-area-inset-left)` and lands at x = 75.5 on both platforms with no second pose.
Measured band to the sun: 250.5px on a phone; the mark takes 44–45 of it.

### 3.2 The sheet — `PlayerLobby`

The `@mbabb` card's `.hover-card` pose byte-for-byte: `position: absolute; top: 100%;
left: 0` off the wrapper (so x = 0 on the PAGE — right edge 256, clearing the sun's x = 326
by 70px on a phone; hung at x = 76 it lapped the sun by 6 × 20px with the sun painting
over it), popover 80%, 2px border 30%, radius 1rem, padding 1rem, `min-width: 16rem`,
`z-index: 50`, `visibility: hidden` shut (UI-6), `pointer-events: none` shut, `@click.stop`
on the box. Attribute `data-lobby` (I3's locator). No `role`, no `aria-live` — plain
markup; the region stays in the well (§3.4).

```
┌────────────────────────── 256 ──────────────────────────┐   y = 44 phone (coarse), 51.8 desk
│  2 other players                                        │   state · --type-tag · quiet
│  ▰  tragic-mockingbird  you                             │   stub 14×9 + name in ITS ink
│  ▰  literary-panda                                      │   --type-small
│  ▰  opposite-heron  26 seconds ago                      │   qualifier berth, 0.35rem after the name
└─────────────────────────────────────────────────────────┘
```

Row grammar: `<li :style="p.ink">` → stub (the same path at 14 × 9, `fill: currentColor`
— no separate swatch token) · name (`color: var(--color-user-ink)`) · qualifier
(`--ink-press-quiet`, `margin-left: 0.35rem` — measured 5.6px against the well's 153.3px).
Self first, then arrival order (`session.players`). The longest slug (124.9px desk) fits
the 224px inner width; no ellipsis, ever.

Line budget: SIX lines total on a phone (`76 + 22 · 6 = 208 ≤ 208.5`, the board's top at
252.5 less the head's 44) — state + up to 5 rows, or state + 4 rows + `and N more` when
N > 5. Desk: the same six until the desk board-top is measured (gate G8; the research did
not measure it). Never a scroll inside the sheet.

Qualifier rules: `you` on the self row; `N seconds ago` on a peer row when `Date.now() −
lastHeard[id] ≥ PRESENCE_QUIET_MS (20 000)`, computed at OPEN (no timer; a held-open sheet
does not tick); a row past 45 s does not exist. Compressed peers get no qualifier.

Identity loss: the research's `this board gave you a new name` is NOT derivable at claim
time — a reload reclaims through the tab half, and a new tab is honestly a stranger with
no memory of the name it never had — so the sheet does not say it. The sheet says only what
the wire carries. Banked as a risk row (§7), not minted as copy.

### 3.3 The well (M14: controls stay in controls)

`invite` (with its note berth), `players-status`, `players-roster`, `players-alone`,
`leave` all stay. The roster loses its PIXELS, not its office: `.players-roster` becomes
`sr-only` unconditionally, keeps `role="log"`, `aria-live="polite"`, `aria-label="who's on
this board"`, drops `tabindex` (an unseen scrollport is not a stop; the readable surface is
now the sheet's plain list). The well measures 284.2 × 45 (was 109): 64px handed to the
controls card.

### 3.4 Speech (W3's idiom rides it)

Live regions: three today, three after — none minted, none lost. Arrivals speak from the
log in the well whether the sheet is open or shut. The mark's `aria-label` mutates with the
count; focus never moves; the sheet never opens on a remote event (M19). The sheet's rows
are plain markup reachable by Tab (a disclosure, not a dialog; `aria-controls` binds it).

## 4 · Copy (M16, the hand's cut)

| string | where | notes |
|---|---|---|
| `no other players` | state line = accessible name, solo | matches I3's `/player/` |
| `1 other player` / `N other players` | state line = accessible name, live | digits, never spellings |
| `you` | self row qualifier | |
| `N seconds ago` | peer row qualifier, past 20 s | 20…44 only |
| `and N more` | compression line | |

Five strings, all inside the 46-codepoint cut, zero re-cut, no first person, no em dash, no
machine's name. The `connecting…` state stays the well's (`players-status`); the mark
shows rest ink while connecting.

## 5 · Motion

| event | what moves | duration · curve · home |
|---|---|---|
| a room becomes ≥2 (colour arrives on your mark) | the stub's `color` | `MOTION.presenceInkMs: 400` (NEW row in `pencilConfig` MOTION, v-bound as `--presence-ink-dur`) · `--ease-standard` · PRM 0 s |
| the room drops to 1 | the same, back to quiet | same row |
| the sheet opens / shuts | the card's pose: opacity + `scale(0.9) translateY(8px)` → identity | 150ms `--ease-standard`, inherited from `.hover-card` verbatim; PRM: the estate's global reduce arm |
| a row arrives while the sheet is open | nothing | the sheet is still; the well's join one-shots do NOT travel with the drawing |

One choreographed moment: the board's join trace (`useJoinWash` 1180ms) and the stub's
400ms ink land on the same `join` event; the mark finishes first, the board's wash carries
on. Nothing else in the head moves.

## 6 · Desktop and mobile, light and dark

- Desk 1280×800: `@mbabb` 75.5 × 39.8 at (0,12); mark 45.2 × 39.8 at (75.5,12); sheet 256
  wide at (0,51.8); `h = 80.5 + 22.4·L` (rows at 16px).
- Phone 390×844 coarse dpr3: `@mbabb` 75.5 × 44 at (0,0); mark 44 × 44 at (75.5,0); sheet
  at (0,44), right edge 256 < sun 326; `h = 76 + 22·L ≤ 208`.
- Dark: `--peer-ink-l` 0.8; the quiet ramp 6.03:1; the sheet ground is popover-80% over
  ≈#110f0e. Nothing else changes.
- Gallery: the mark follows `@mbabb`'s own persistence per platform (desk `.corner-left`
  stays painted, phone `.mobile-attribution` is `v-show` playing) — one head, one rule.
- `prefers-reduced-transparency` / `prefers-contrast: more`: the sheet goes opaque
  (`--color-popover`), law 44.

---

## 7 · Plan

Files, in order; what dies.

1. `src/games/shared/useSession.ts:537` — `mint()`: self gets `ink: inkFor(index)` when
   `roomId` is set (F1). Solo (no room) binds nothing: byte-identical by construction.
   `:630` `armPresenceExpiry(id)` records `lastHeard[id] = Date.now()`; export a
   `lastHeardAt(id)` reader; `PRESENCE_QUIET_MS = 20_000` declared beside `HEARTBEAT_MS`
   (protocol constants live together; this is not motion).
2. `src/pencil/config/pencilConfig.ts` MOTION — `presenceInkMs: 400`, one comment line.
3. `src/pencil/chrome/icons/PlayerStub.vue` — the 24×24 static path (pose 0, seed 67).
4. `src/pencil/chrome/AttributionCard/AttributionCard.vue` — the wrapper becomes
   `display: flex; align-items: center` and takes a `#mark` slot after the trigger;
   `provide('head-disclosures', registry)` so a sibling disclosure registers its `close`,
   `close()` closes both, and opening one closes the other (they share the x = 0 origin).
5. `src/pencil/chrome/PlayerMark/PlayerMark.vue` (+ `PlayerLobby.vue`) — `useHoverCard`,
   `defineExpose({ close })`, props `{ stateLine, ink, rows, quietAfterMs }`; the pencil
   layer imports nothing from games (the boundary lint); App.vue feeds it.
6. `src/App.vue:802/:813` — `<AttributionCard><template #mark><PlayerMark …/></template>
   </AttributionCard>` on both instances; `closeAll()` unchanged (it already calls the card's
   `close`, which now closes the registry).
7. `src/games/shared/GameControlPanel.vue:1124-1170` — `.players-roster` → `sr-only`
   always; drop `:tabindex`; the departing `<li>`s and `.is-arriving/.is-returning/
   .is-leaving` one-shots (:1705-1760) DIE; `.player-swatch` CSS DIES; roster `max-height`
   DIES. `players-status`, `players-alone`, invite, leave untouched.
8. `e2e/player-mark.spec.ts` — the born-RED rows of §9, a LOCAL instrument (O-12).
9. `scripts/check-font-coverage.mjs` run; `check-copy-register.mjs` run; no admission.

Substrate rows this family makes visible but does not cure: I4 (`adoptInk` unguarded,
`useSession.ts:553` — W6/§11c), I5 (`IDENTITY_CAP` re-issue), the family law (37
collisions — PAL-*).

## 8 · Prototype brief

The smallest build that proves it on the real surface: the §7 patch as a `.diff` applied
in a throwaway worktree under the scratchpad (never committed), `npx vite --host 127.0.0.1
--port 4241 --strictPort`, the lane's scratch config (`research/PLR-SELF/probe/
plr-self.config.ts`, webServer dropped, chromium + webkit), a second page on `?wire=local`.

Screenshots (crops ≤150 KB, few): head shut solo and live at 390 coarse and 1280, light
and dark, both engines (8 crops, ~4 KB each); the sheet open at N=3 and N=16 on the phone
(the compression line), one engine each; ≤12 frames, ≤60 KB.

Censuses to re-run unchanged: `filterBudget` census (poll the settled 9 first — a cold
load reads 21), both engines, both regimes, with the sheet open; R6's `hue-census.mjs`
(29 rows, unchanged — the family mints no token); R6's heading census (unchanged — no
heading is added); the wobble probe does not apply (no ring is touched); r0's
`instruments.spec.ts` I2/I3/I4/I5 verbatim and `instruments-family-law.mjs` bare.

Numbers that mean success: I2 GREEN both pages both engines (self swatch = room ink); I3
GREEN (1 candidate, x < 200, y < 120, press reveals `[data-lobby]`); I4/I5 RED unchanged
(substrate); family law RED unchanged (PAL-*'s); filters 9 → 9; solo fingerprint hash
identical before/after (excluding `--reveal-delay`); mark 44 × 44 coarse with the 40px
negative control failing; sheet right edge 256 < 326; sheet bottom ≤ 252.5 at six lines
on the phone; every row ink ≥ 4.5:1 on popover-80%-over-background and -card, both themes,
canvas read-back; `you` glyph gap ≤ 8px; live regions 3 → 3; M19 both halves (focus
unmoved, sheet shut, AND `aria-label` mutated under a parked focus); woff2 4,312 B
unchanged; copy gate 0 unadmitted; well 284.2 × 45.

## 9 · Born-RED gates (land with the family)

| id | asserts | at HEAD |
|---|---|---|
| r0 I2 | a player's own swatch is the colour the room paints for them | RED |
| r0 I3 | a `button` named `/player/` in the head, x<200 y<120, opens `[data-lobby]` | RED (0 candidates) |
| G1 solo-identity | 24 cells' inline style + computed color + `--color-user-ink` hashed, no room vs mark mounted: identical, excluding `--reveal-delay` | RED (no mark exists) |
| G2 filter-census | 9 exact-match with the mark and the open sheet, both engines, both regimes | passes today, extended scene |
| G3 tap-floor | mark ≥44 in BOTH dimensions under coarse; a 40px negative control fails each | RED |
| G4 sheet-geometry | right edge ≤ 256 at 390; bottom ≤ board top at six lines; never overflows the inner 224 width | RED |
| G5 sheet-AA | first-16 walk inks ≥4.5:1 on popover-80% over background and card, light and dark, painted bytes | RED (no sheet) |
| G6 live-regions | count of `[aria-live], [role=log], [role=status]` on the page = HEAD's count; `.players-roster` keeps `role="log"` | RED once the roster moves |
| G7 M19-whole | a third page joining: `activeElement` unchanged, `[data-lobby]` hidden, AND the mark's `aria-label` changed | RED |
| G8 desk-bound | desk sheet bottom at six lines ≤ desk board top (to be measured) | RED (unmeasured) |
| G9 font-cut | `check-font-coverage.mjs` OK and `patrickhand-subset.woff2` = 4,312 B | GREEN by construction; reds on any re-cut |
| G10 well-height | `.players-well` ≤ 284.2 × 48 with a live room | RED (109) |
