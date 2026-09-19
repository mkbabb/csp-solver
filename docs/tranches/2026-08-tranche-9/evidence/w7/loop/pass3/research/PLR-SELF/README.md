# PASS-3 RESEARCH · PLR-SELF · the stub is you (§11 LEADER)

Read-only on product files. Everything below is measured on **HEAD `74a2b5d9`** (the W7 execution
fold — the chair's new base), on my own server `127.0.0.1:4241` with a private vite `cacheDir`
outside the frozen tree, chromium **and** webkit, both killed before this was written
(`lsof -ti tcp:4241` = 0). Probe, configs and every raw line are in `probe/`
(`r3-measure.spec.ts`, `r3-lap.spec.ts`, `readings.txt`, `run*.log`). Zero crops banked — every
row below is a number or a file:line, and the wave's cap is 2 MB.

Where a figure is pass 2's and not re-taken here, it says so.

---

## 0 · The one thing that changed under this family since pass 2

`74a2b5d9` re-cut **`scripts/check-copy-register.mjs`** (G17 + two repairs). The gate now
DISCOVERS its subjects rather than reading a declared list:

| grammar | file:line | what it claims |
|---|---|---|
| `COPY_TABLE_NAME` | `scripts/check-copy-register.mjs:345` | any `const|let|var` whose NAME contains `COPY`/`Copy` and whose initializer is an object literal — **every literal inside it is copy** |
| `SPOKEN_SUFFIXES` / `SPOKEN_NAME` | `:388-419` | `aria*`, `*Label/Text/Caption/Heading/Sublabel/Placeholder/Title/Note/Line/Word/Name/Message/Sentence/Announce*`, TitleCase **and** SCREAMING_SNAKE, singular **and** plural |
| `SPOKEN_SOURCE_NAME` | `:429` | a declaration **or** a `.value` write |
| `SPOKEN_SOURCE_FN` | `:443` | `function <spokenName>(…): string` |
| `SPOKEN_SOURCE_PROP` | `:458` | the same name rule on an object property, colon GLUED (a Vue bind is not a key) |
| the walk | `:884-894` | **all of `src/**` plus `index.html`** — 137 files at HEAD |

Measured at HEAD: `npm run lint:copy` → `copy register scanned across 137 files · 0 em/en dashes ·
0 hits, 0 admitted, 0 unadmitted (lexicon 25) · 52 self-test colours, each RED-or-GREEN as
required`, exit 0.

**Consequence for the seating the chair gave this lane (§6.9).** `LOBBY_COPY` in
`PlayerMark/copy.ts` is discovered by `COPY_TABLE_NAME` the moment the file lands — no
declaration needed, and `N other players` (PLR-PLACE's escapee) is caught by the same rule
wherever it is written, because the rule is now the NAME, not a file list. So the pass-2
`COPY_SOURCES` arm (+131 lines on this gate in worktree -52) is **a second reader of a subject the
estate already reads**. The design question the synthesizer must answer in one sentence: does
`COPY_SOURCES` survive at all, and if it does, as what? The only job left for it is the one the
two critics named — **coverage**, fail-CLOSED: "this module is declared a copy source; if its
block cannot be found, RED" — which is a *different* claim from "these literals are copy", and is
worth ~15 lines, not 131. Recommendation: keep the fold's discovery as the reader; re-cut
`COPY_SOURCES` as a coverage assertion over MODULES (the chair's "the module, not the object
literal") with its own planted self-test colour; strike the balanced-initializer reader the fold
now owns. Every hunk re-cut for this reason is a §8-fold hunk the lane must name (CHAIR §"the
base moved").

Nothing else in the fold touches §11's surfaces: there is still **no `PlayerMark/` on main**
(`find src -path '*PlayerMark*'` → empty), no `claimHeadDisclosure`, no `LOBBY_COPY`, no
`PRESENCE_QUIET_MS`.

---

## 1 · The surfaces this family touches, at HEAD, with their numbers

### 1.1 The head (where the mark goes)

| reading | chromium | webkit |
|---|---|---|
| `.corner-left` (desk 1280×800) | `[0, 12, 75.53, 39.75]` | identical |
| `.attribution-trigger` | same box as its host | identical |
| `.mobile-attribution` (390×844) | `[0, 0, 75.53, 39.75]` | identical |
| wordmark `svg.handwritten-logo`, desk | `[129.89, 5.53, 382.39, 111.92]` | `[129.84, 5.83, 380.53, 111.92]` |
| wordmark, phone | `[58.14, 174.30, 243.33, 71.22]` | `[58.73, 174.58, 242.14, 71.22]` |
| `.board-cells`, desk | `[131.89, 124.45, 636, 636]` | `[131.84, 124.16, 636, 636]` |
| `.board-cells`, phone | `[14, 252.52, 362, 362]` | `[14, 252.20, 362, 362]` |

The mark's berth is the strip to the RIGHT of `@mbabb` and LEFT of the wordmark: desk
`75.53 → 129.89` = **54.36 px** of free head; on the phone the two marks are on different rows
(attribution `y 0–39.75`, wordmark `y 174.30`), so the phone berth is vertical, not horizontal
(`R6.head-berth` reads a *negative* 17.39 px horizontal gap and that number means "they do not
share a line", not "they collide"). Pass 2 put the mark at `x 75.53, w 45.125` — exactly this
strip, and it fits with 9.2 px to spare on the desk.

**`--head-rule` reads EMPTY at the root** (`R3.tokens.*`) while `.corner-left` consumes it as
`top: var(--head-rule, 0.75rem)` (`AttributionCard.vue:131`). That is a CHAIR §6.5 subject — a
consumed token with no publisher, surviving on its fallback. The mark hangs off the same anchor,
so §11's leader inherits the row: either the publisher lands (with `@property` + `initial-value`,
§6.5's form) or the fallback is the design and says so.

### 1.2 The head's ONE existing disclosure — CH-71 priced, at HEAD, both engines

Opened the way a fine pointer opens it (**hover**, not click: `useHoverCard.onHoverEnter` opens on
`mouseenter` and the click then *toggles it shut* — the first cut of my probe clicked and read
`aria-expanded=false`, which is the trap any pass-3 gate on this surface will hit):

| reading | chromium | webkit |
|---|---|---|
| `.hover-card` open box | `[0, 51.75, 256, 151]` | `[0, 51.75, 256, 150.95]` |
| its ground | `color(srgb 0.9865 0.9859 0.9835 / **0.8**)` | identical |
| live-filter census, settled, sheet SHUT | **9** | **9** |
| live-filter census, disclosure OPEN | **9** | **9** |
| board cells its box laps | **4** (0, 1, 9, 10) | **4** (0, 1, 9, 10) |
| top element at cell 0's intersection centre | `a.text-foreground` | `a.text-foreground` |
| top element at cells 9/10 | `div.hover-card` | `div.hover-card` |
| click at cell 0's lapped centre | focus lands on the **GitHub link** | focus cleared |
| `Escape` while open | `aria-expanded` stays **true** | stays **true** |
| activeElement while open (hover path) | unchanged, still the cell input | unchanged |

Four facts the synthesizer can build on:

1. **CH-71 is real and now has a number**: the incumbent head disclosure covers 4 live cells and
   a click on the two biggest lands on a *link*, not the cell. §11 does not create this; §11 adds
   the dismissal that makes it answerable — and the sheet it adds is 256 × 122–165 (pass 2), i.e.
   the **same width and a taller box**, so the lap grows unless the design says otherwise.
2. **An open head disclosure costs ZERO filters** (9 → 9, both engines, settled). filterBudget 9
   survives a second sheet **as long as the sheet mints no filter** — the opaque ground and a
   drawn stub are both filter-free idioms (`HandDrawnOutline` bakes its grain; `R6 law 9/10`).
3. **The incumbent ground is 0.8 alpha**, which is exactly what the family's ONE declared DELTA
   (an opaque ground) fixes, and why AA on the sheet was luck before and a number after.
4. **The incumbent has no Escape.** `useHoverCard` has `toggle`/`close`/hover handlers and no key
   listener at all (`useHoverCard.ts:18-60`). So "the head has one open disclosure, and one
   dismissal" is a SECTION law this family writes, not a consistency it inherits — and the
   honest framing for the chair is that the mark's Escape is **new behaviour for the head**, which
   is why the composition row (mouse-open → Escape) had no incumbent to copy.

### 1.3 The roster and the well, inside W2's portrait dock — the −64 px row, measured

Two real pages in one context, `&wire=local`, invited from the desk page, joiner at 390×844
coarse, PRM reduced. The dock **slides**: the card's `y` was polled to rest before every read.

| reading | chromium | webkit |
|---|---|---|
| dock SHUT · `.controls-card` | `[0, 844, 390, 611.27]` | `[0, 844, 390, 611.25]` |
| dock SHUT · `.drawer-tab` | `[286, 610.52, 92, 48]` | `[286, 610.20, 92, 48]` |
| dock SHUT · `.play-controls[inert]` | **false** | false |
| dock OPEN settled · `.controls-card` | `[0, **232.73**, 390, 611.27]` | `[0, **233.00**, 390, 611.25]` |
| dock OPEN · `.drawer-tab` | `[342, 140.73, 44, 92]` | `[342, 141, 44, 92]` |
| dock OPEN · `aria-expanded` | true | true |
| dock OPEN · `.play-controls[inert]` (`ribbonCovered`) | **true** | **true** |
| the roster's `.tray-well` (4 wells; it is index **3**) | `[8, 686.48, 374, **80.58**]` | `[8, 686.73, 374, 80.58]` |
| `.players-roster`, 2 rows | `[16, 700.02, 358, **34.44**]` | `[16, 700.27, 358, 34.44]` |
| `max-height` / `overflow-y` | `120px` / `auto` | identical |
| `tabindex` / `sr-only` | **`0`** / **false** | identical |
| `.player-row` | `[16, 700.02, 358, **16.42**]` | identical |
| `.player-swatch` | `[16, 702.63, **11.19 × 11.19**]` | identical |
| card `scrollHeight` / `clientHeight` | 611 / 611 | 611 / 611 |
| live-filter census, dock open, phone | **9** | **9** |

**The dock covers the board.** Open and settled, the sheet's top is `232.73` and the board's top
is `252.52`: at 390×844 the open portrait dock sits over the whole board, and `ribbonCovered` →
`inert` on `.play-controls` is W2's answer to it (`GameControlPanel.vue:720`, `:1390`). So the
well's −64 px is spent inside a sheet that is already the whole screen: **the 64 px the roster
gives back are not board pixels, they are pixels of a card the player is already scrolled
through** (`scrollHeight == clientHeight == 611`, so the card does not scroll at two players — it
will at more). State it that way and the row stops being a loss.

**F1's subject, read at HEAD.** In the same room: self's row `color` and swatch are
`rgb(37, 99, 235)` (`--color-user-ink`'s incumbent `#2563eb`, no inline binding); the peer's are
`oklch(0.5 0.11 0)` from `style="--color-user-ink: oklch(var(--peer-ink-l) 0.11 0.0deg)"`. One
line each at `useSession.ts:537` and `:556` (`ink: id === selfId.value ? {} : ident!.inkFor(index)`)
is the whole of F1, exactly as pass 2 had it, and the fold did not move either line.

### 1.4 `.player-swatch` — the ONE re-point, and who reads what off which node (CHAIR §6.9)

| # | estate read | file:line | node | property | survives a `.player-row { color }` deletion? |
|---|---|---|---|---|---|
| 1 | peer's row ink ≠ incumbent | `e2e/join-language.spec.ts:96-100` | `.controls-card .player-row` (peer) | `color` | **NO** |
| 2 | peer ≠ self | `e2e/join-language.spec.ts:162-168` | `.player-row` peer **and** self | `color` | **NO** |
| 3 | swatch == row | `e2e/join-language.spec.ts:170-177` | `.player-row .player-swatch` | `backgroundColor` | half (the swatch half) |
| 4 | two colours on one screen | `e2e/multiplayer.spec.ts:191-195` | `.player-swatch` | `backgroundColor` | yes |
| 5 | the same, second room | `e2e/multiplayer.spec.ts:580` | `.player-swatch` | `backgroundColor` | yes |
| 6 | roster rows exist | `e2e/access.spec.ts:370` | `.controls-card .players-roster .player-row` | count | yes |
| 7 | roster rows exist | `e2e/follow-still-authorship.spec.ts:71` | same | `toHaveCount(2)` | yes |
| 8 | roster rows exist | `e2e/presence.spec.ts:48`, `e2e/session-substrate.spec.ts:29`, `e2e/multiplayer.spec.ts:136` | same | count | yes |
| 9 | the roster is VISIBLE | `e2e/multiplayer.spec.ts:379` | `.controls-card .players-roster` | `toBeVisible()` | **NO** under an unconditional `sr-only` |
| 10 | `you` is the self row's word | `e2e/multiplayer.spec.ts:181`, `:865` | `.players-roster .player-self` | `toHaveText("you")` | yes |
| 11 | the well's verb lives beside it | `e2e/join-language.spec.ts:149` | `.tray-well:has(.players-roster, .players-alone) .icon-btn` | — | yes |

The two rules are `GameControlPanel.vue:1670` (`.player-row { color: var(--color-user-ink) }`) and
`:1689` (`.player-swatch { flex/width/height/border-radius/background }`). Reads 1–3 come off the
ROW's `color`; 3–5 come off the SWATCH's `background`; both resolve the same inline var that
`:style="p.ink"` puts on the row (`GameControlPanel.vue:1152`). **PLR-COUNT's diff deletes the row
rule and reds 1–3; this lane's tree keeps it.** The re-point the chair asked for is therefore
*one sentence plus one table*: the row keeps `color`, the swatch keeps `background`, and the
swatch is a **zero-box colour hook** if its geometry goes — it is `11.19 × 11.19` today
(`0.7rem`), and deleting `flex/width/height/border-radius` leaves `getComputedStyle(...).backgroundColor`
resolving for reads 3–5 on a box of 0 inside an `sr-only` list. Say that; do not say "STAYS".

Read 9 is the one that flips and it is a live, currently-green assertion —
`multiplayer.spec.ts:379`'s own comment says the roster is what the resolution IS. Under an
unconditional `sr-only` roster the honest re-aim is `toHaveCount(2)` on the rows plus the head
sheet's own visible list, and it is a REVERSAL that needs the disposition §6.7 assigns to this
lane.

### 1.5 T7-W2 A4 — the reversal, with the estate's current words

At HEAD the roster is conditionally reachable and conditionally hidden:

```
GameControlPanel.vue:1131-1137
  class="players-roster"
  :class="{ 'sr-only': !rosterRows.length && !departing.length }"
  role="log"  aria-live="polite"  aria-label="who's on this board"
  :tabindex="rosterRows.length ? 0 : undefined"
```

Measured: solo → `sr-only` **true**, `tabindex` **(none)**; two at the table → `sr-only`
**false**, `tabindex` **`0`**, `roster.tabIndex >= 0` true (both engines). The unit rows that
guard it are `GameControlPanel.liveRegions.test.ts:199, 209, 214, 221`, and the header at
`:1120` states A4's reason in the estate's own voice ("a focusable box with nothing in it is a
dead stop on the tab route"). The disposition this lane owes the chair is therefore narrow and
answerable: **A4 bought a keyboard route to a log that is otherwise write-only; the head
disclosure is a keyboard route to the same rows on a surface that also draws them.** If the
disclosure's reachability is proven in BOTH engines (G9 is chromium-only today), A4's reason is
met by another door and the `tabindex` may go; if it is not, A4 stands. Either way the row is
written in the return, not in a test comment (`useJoinWash.test.ts` / the re-cut unit's comment
is where pass 2 argued it).

### 1.6 The live regions, at HEAD, both engines

`["margin-note:status:polite", "board-voice:status:polite", "players-status::polite",
"players-roster:log:polite", "players-alone::polite", "copy-status:status:polite"]`

Six, in this DOM order, identical on both engines — the order pass 1 banked and pass 2's G6
pinned, now a third independent reading on the NEW base. The synthesis spec's alphabetised order
stays refuted. Solo: `players-alone` is EMPTY (not `you are alone`); the roster is mounted with
zero rows and `sr-only`.

### 1.7 Presence, and why `N seconds ago` has never rendered

| constant | file:line | value |
|---|---|---|
| `HEARTBEAT_MS` | `useSession.ts:616` | 15 000 |
| `PRESENCE_EXPIRY_MS` | `useSession.ts:624` | 45 000 (armed on ANY traffic, `:630-635`; the cursor ghost shares it, `:953`) |
| pass 2's `PRESENCE_QUIET_MS` | worktree -52 | 20 000 |
| pass 2's `quietAfterMs` prop default | worktree -52, `PlayerMark.vue` | 20000 — the duplicate |

**The quiet rung's band is (20 s, 45 s) — 25 s wide — and it is only reachable by a MISSED BEAT.**
A live peer re-announces every 15 s, so `lastHeard` for a healthy peer never passes ~15 s + jitter;
the string exists for the peer whose beat has stopped but whose expiry has not fired. That is why
no banked row has ever seen it and why "wait 20 s" is the wrong instrument: the right one **stops
the beat** (or freezes the clock) and reads the rung at, say, 21 s and again at 44 s, then lets
the expiry take the row. One home for the constant: `PRESENCE_QUIET_MS` beside its two siblings at
`useSession.ts:616-624`, exported like `quietMsOf`, prop default **removed** (a prop with a
literal default is the masked fallback the critic named).

### 1.8 The AA arithmetic, re-derived at the new base

Painted through a canvas, WCAG 2.x luminance, all 40 walk indices at the theme's own
`--peer-ink-l`, against the three grounds resolved through the cascade. Identical on both engines:

| | light (L 0.5) | dark (L 0.8) |
|---|---|---|
| `--color-popover` — the sheet's ground | **5.279** (worst idx **38**) on `rgb(252,251,251)` | **9.637** (worst idx **13**) on `rgb(18,16,15)` |
| `--color-card` | 5.358 | 9.504 |
| `--color-background` | 5.231 | 9.710 |

These reproduce the pass-2 critic's 5.28 / 9.64 to three decimals on the NEW base — so the
family's AA claim survives the fold untouched, and the worst index is named (38 light, 13 dark)
so a future palette change has something to red against. Tokens at HEAD: `--peer-ink-l` 0.5 /
0.8; `--color-popover` `hsl(48 10% 98.5%)` / `hsl(24 7% 6.5%)`; `--color-user-ink` `#2563eb` /
`#60a5fa`.

---

## 2 · The primitives this family may reuse (named, with their seams)

| primitive | file:line | what it gives §11 |
|---|---|---|
| `useHoverCard` | `src/pencil/chrome/AttributionCard/useHoverCard.ts:18` | the head's open/close grammar: module-level `(pointer: coarse)` MQL, `closeDelay` 150 ms, the cancel-before-gate order (a measured T6 cure), `defineExpose({ close })` on the card |
| `claimHeadDisclosure` | worktree -53 `useHoverCard.ts:26-30` (PLR-COUNT) | 5 lines, a module `Set<() => void>`; whoever opens shuts the others. Takes the two heads to one open. **Graft it into `useHoverCard` itself**, so the incumbent card joins by construction rather than by remembering |
| `inkFor` | `src/games/shared/playerIdentity.ts:68-70` | one line, one binding: `--color-user-ink: oklch(var(--peer-ink-l) 0.11 {(i × 137.5) % 360}deg)` |
| `mint` / `adoptInk` | `useSession.ts:525-539`, `:547-568` | F1's two lines; `k` rides every `st` (`:763`) |
| `HandwrittenGlyph` | `src/pencil/glyph/HandwrittenGlyph.vue` | strokes with `--color-user-ink` and mints **zero** filters — the precedent for a drawn stub that costs the budget nothing |
| `HandDrawnOutline` | `src/pencil/grid/HandDrawnOutline.vue` | the ONE box grammar, grain BAKED into the geometry (no filter); `:pose` present → one frame, no beat |
| `mulberry32`, `heldFrameCount`, `usePrefersReducedMotion`, `createBoilTicker` | `@mkbabb/pencil-boil` via `src/pencil/composables/boilBeat.ts:22`, `BoilDivider.vue:3`, `App.vue:14` | the seeded-variant + pose-swap idiom the stub's two poses ride; PRM is read from the library, never re-implemented |
| `rasterPose` | `src/pencil/composables/rasterPose.ts:19` | the bake seam, and CH-67's law (capture the LAYOUT box) if the stub ever bakes |
| `sr-only` | the estate utility (`HandwrittenLogo`, `players-alone`) | the roster's clip, already the idiom |
| `useLiveRegion` | `src/composables/useLiveRegion.ts:11` | the spoken half; the six-region roll is its census |
| `--tap-floor` | `src/assets/index.css:821-849` (`var(--tap-floor, 2.75rem)`) | W2's landed token for the 44 px floor — the mark's coarse box reads it, never 44 |
| `useTallyStrokes` | worktree -53 (PLR-COUNT) | the per-member draw map; the stub's drawing primitive if the section folds one way of drawing a person |
| `filterBudget` + `assertCensus` | `src/pencil/config/filterBudget.ts`, `e2e/filter-census.spec.ts:218-300` | the census the open sheet must join: `census(page, selectors)` + `unionArea(page)` + the injected-control arm, already written; extending it is a **regime**, not a new spec |

---

## 3 · Constraints this family collides with

1. **filterBudget 9, on the BUILT dist, with the sheet OPEN.** `e2e/filter-census.spec.ts` runs
   under `playwright-throttle.config.ts` (bundled preview), regimes `row` (1280) and `coarse`
   (393×699 dpr3) plus a `:hover` arm and a PICKER arm — and never opens a disclosure. My 9 → 9
   readings are **dev-server** readings and say so. The extension is an `assertCensus(page,
   "row-sheet-open")`-shaped arm after `settleBoard`, plus the union-area budget for the same
   regime (`FILTER_BUDGET_UNION_AREA`), or the row is still blind to the scene §11 adds.
2. **The dock is the container** (W2, LANDED): `portraitDock` (`useControlsDrawer.ts:139`),
   `ribbonCovered` (`GameControlPanel.vue:720`), `inert` on `.play-controls` (`:1390`), the
   `.drawer-tab` (`DrawerTab.vue:60`). The sheet SLIDES — poll `.controls-card`'s `y` to rest
   (~700 ms; I polled to 0.01 px).
3. **`elementFromPoint` is blinded by `inert`** (standing trap) — and the open dock sets `inert`
   on `.play-controls`, so any "what is on top" probe inside the dock reads past it.
4. **M16** — `LOBBY_COPY` is caught by the fold's `COPY_TABLE_NAME` automatically; the five lines
   must survive the 46-codepoint Patrick Hand cut (`index.css:94-96`: every digit, no `j`, no
   `x`) and the 25-entry lexicon. `player`, `players`, `you`, `more`, `seconds ago` are all clean.
5. **AA on both themes, all 40 hues, on `--color-popover`** — §1.8's numbers, which is why the
   opaque ground is the one declared DELTA (the incumbent is 0.8 alpha, measured).
6. **R6 law 39** — the ring is READ, never written. The mark's ring IS the walk ink (pass 2:
   `2px dashed currentColor` offset 3, DrawerTab's form), so whatever §6 ships must hold against
   40 hues at L 0.5 and L 0.8, not against one colour. Say it in the return; §6's leader rules
   the value.
7. **R6 law 14** — one hover affordance per interactive text surface, three forms and no fourth;
   the pose swap is form 2 (a drawn mark). **R6 law 13** — no text boils, ever.
8. **CHAIR §6.5** — every measured token registered with `@property` + `initial-value`, consumers
   with NO fallback. `--head-rule` is consumed with a fallback and has no publisher at the root
   (measured); `--tap-floor` likewise (`index.css:834`, `:849`). §10's leader lands the
   registration; this lane cites the two sites it consumes.
9. **O-12** — CI is sixteen lanes, browserless. Every gate this family lands in `e2e/` is a LOCAL
   instrument; the PRM stance is declared in the first 20 lines (the estate's own convention,
   `presence.spec.ts:3`).
10. **U-10** — nothing closes; F1, the sheet, the ground, the A4 disposition and the `sr-only`
    roster are all proposals with frames.

---

## 4 · Sketches

### 4.1 The head, desk 1280 — the berth, measured

```
x=0        75.53          129.89                                  512.28
│           │               │                                        │
├──@mbabb───┼──[ mark ]─────┼────────  s u d o k u  ────────────────┤   y 5.53–117.45
│  75.53w   │   45.13w      │            382.39w                     │
│  39.75h   │   44h coarse  │
└ y=12      └ 54.36px of free head; pass 2 spends 45.13 ─────────────┘

         open, the two sheets share ONE anchor and ONE dismissal:
         ┌─ .hover-card  256 × 151  @ (0, 51.75)  ground 0.8α  ← incumbent
         └─ .player-lobby 256 × H   @ (0, 51.75)  ground OPAQUE ← §11, the declared DELTA
            H = 57.36 + 21.6·rows + 18.96·(and N more)     [pass 2's law, 3 points, Δ ≤ 0.12]
```

### 4.2 What the open head disclosure costs the board (CH-71, measured at HEAD)

```
 board cells 0,1,9,10 lie under the card's box:

   ┌───────── .hover-card  (0,51.75) 256×151 ─────────┐
   │                                                   │
   │   cell 0 ██ 4992 px²  → top element = a.text-fg   │  ← a click here opens GitHub
   │   cell 1 ██ 3777 px²  → top element = a.text-fg   │
   │   cell 9 ▓  540 px²   → top element = div.hover-card
   │   cell10 ▓  408 px²   → top element = div.hover-card
   └───────────────────────────────────────────────────┘
        census 9 → 9 (the card mints no filter, both engines)
        Escape → aria-expanded STAYS true (no key owner today)
```

### 4.3 The well inside the portrait dock (390×844, open + settled)

```
 y=0    ┌─────────────────────────────── viewport 390 × 844
 232.73 ╞═══ .controls-card  390 × 611.27  (SLIDES; poll to rest) ══╗
 252.52 │   .board-cells 362×362 sits BEHIND the sheet             ║
        │   .play-controls[inert] = true   ← W2's ribbonCovered    ║
        │                                                          ║
 686.48 │   ┌ .tray-well #3 of 4   374 × 80.58 ────────────────┐   ║
 700.02 │   │  ul.players-roster 358 × 34.44  max-h 120  auto  │   ║
        │   │   li.player-row 358 × 16.42                      │   ║
        │   │    ▪ .player-swatch 11.19 × 11.19  ← the hook    │   ║
        │   │   tabindex="0" (T7-W2 A4)   sr-only = false      │   ║
        │   └──────────────────────────────────────────────────┘   ║
 844    ╚══════════════════════════════════════════════════════════╝
        card scrollHeight == clientHeight == 611  (no scroll at 2)
        the −64 px the roster gives back are CARD pixels, not board pixels
```

---

## 5 · Risks, each with the number that would kill it

| # | risk | what reds it |
|---|---|---|
| 1 | **`COPY_SOURCES` is re-landed as written and duplicates the fold.** +131 lines on a gate that now discovers by name; two readers of one subject is the alias family the estate keeps killing | the fold's own self-test: a planted `LOBBY_COPY` jargon line must red exactly ONCE, not twice |
| 2 | **The Escape cure over-narrows.** `if (el.contains(document.activeElement)) el.focus()` is right for the mouse case; for the KEYBOARD case focus is on the mark already, so the guard must not silently drop the keyboard refocus | G8's sequence (Space/Space/Enter/Escape from `el.focus()`) must stay green on both engines while the new mouse row goes green — one gate cannot prove both |
| 3 | **The lap grows.** §11's sheet is the same 256 wide and taller than the incumbent's 151, so it laps ≥4 cells; the dismissal makes it answerable but the count is a number the owner will see | a lapped-cell census either side of the change, both engines, with the click-through owner named (mine is the control) |
| 4 | **The filter census extension reds on the dist for a reason that is not §11's** — the coarse regime's settled population is the gate's subject and the sheet's open scene has never been censused | run the extended arm at HEAD FIRST (born-RED discipline in reverse: prove 9 with the *incumbent* card open on the dist before claiming 9 with the new one) |
| 5 | **`multiplayer.spec:379` is re-aimed to a weaker row.** Swapping `toBeVisible()` for a count deletes the only assertion that the roster is on a screen | the re-aim must assert the new visible surface (the sheet's list) — a count alone is the vacuous-gate failure mode |
| 6 | **The A4 disposition is written and G9 stays chromium-only.** The reversal's whole warrant is that the head disclosure is keyboard-reachable | G9 on webkit, or A4 stands and the `tabindex` stays |
| 7 | **The pose swap still has no floor.** `d` 397 → 394 chars is a string diff; mean 5.65/255 per channel is one pixel of wobble | a perceptual floor stated as a number (mean-abs-diff over the mark's own box, or a min path-vertex displacement) that reds at `boilAmount` → 0 |
| 8 | **The relay arm stays unmeasured** and `multiplayer.spec.ts` unrun — a slow two-page battery that holds reads 4, 5, 9, 10 of §1.4's table | the battery once, as a SHELL SCRIPT in the background (stall law), log polled |
| 9 | **`--head-rule` has no publisher.** The mark hangs off a token that resolves to its fallback | delete the fallback at the consumer and watch the corner move — if it does not, the publisher is missing and §6.5 owns it |
| 10 | **Two lanes strip the substrate at once.** §6.9 seats it here and PLR-COUNT/PLACE strip their copies; a replay order that lands their strip before this seating leaves the section with no `LOBBY_COPY` at all | the seating diff names every file the siblings must strip, and the siblings' returns name the files stripped |

---

## 6 · What the synthesizer should write (my recommendation, one paragraph)

Keep the centre exactly as pass 2 left it — the drawn stub in your room colour, the roster out of
the well and `sr-only`, an opaque ground, the lift a pose, one open disclosure — because every
number that held at `a8fee1f5` holds at `74a2b5d9` (AA to three decimals, the six-region order,
the census, the head's geometry). Spend the pass on the four things that are not the centre:
(a) the Escape composition, cured with the containment guard and covered by a row that starts
from a MOUSE open; (b) the eleven gates landed in `e2e/player-mark.spec.ts` and the census arm
landed in `e2e/filter-census.spec.ts`, because a ruling that lands without its enforcing config is
the one rule this campaign wrote down; (c) the substrate seated ONCE, with `COPY_SOURCES` re-cut
to the coverage claim the fold left it and `claimHeadDisclosure` grafted into `useHoverCard`
itself so the incumbent card joins by construction; (d) the four dispositions that are prose, not
code — A4, the `.player-swatch` zero-box sentence, the quiet constant's one home, and the two
stale comments. The one design decision left open is what §11 does about CH-71 now that it has a
number: 4 cells, two of them opening a link. That is the owner's to see (U-10), and the frame to
put in front of them is the same corner with both sheets drawn.
