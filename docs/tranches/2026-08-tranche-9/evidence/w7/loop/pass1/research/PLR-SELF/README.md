# PLR-SELF · pass 1 (RESEARCH) — your mark, in your ink

T9-W7 §11 (the player mark: icon · lobby) · §12 · mark M14 (resolving M08). One family, alone.
Lane port 127.0.0.1:4241. Read-only on the product: every pixel below is a `page.evaluate`
overlay over the live head (`proto/overlay.js`). Nothing in `src/`, `e2e/` or `scripts/` was
touched, nothing committed.

**Verdict: DEVELOP the CRAYON STUB. KILL the written NAME, on three measured grounds. The
second variable resolves to a third reading — move the DRAWING, never the REGION.**

| what ran | where |
|---|---|
| the prototype probe, 15 cases, both engines, 15/15 green | `probe/plr-self.spec.ts` + `probe/plr-self.config.ts`, readings `probe/readings.txt` |
| r0's I2/I3/I4/I5 re-run UNCHANGED (md5 `ee3066b1a5ef2a7320c818746e33b4ba`, byte-identical to r0's file) | `probe/r0-instruments-rerun.txt` |
| r0's family-law instrument re-run | `probe/instruments-family-law-rerun.txt` (diff vs r0's banked reading: **identical**) |
| the hand's cut, read off the shipped woff2 (`cmapCodepoints` lifted verbatim from `scripts/check-font-coverage.mjs:245-381`) | `probe/hand-cut.mjs` + `probe/hand-cut.txt` |
| 4 crops, 31 KB total | `frames/` |

---

## 1 · Substrate, verified on this tree (file:line)

- **The @mbabb pose, re-measured.** `AttributionCard.vue:129-189`. Trigger 75.5 × 39.8 at
  (0, 12) desk / (0, 0) phone, Fira Code **14px**; card `min-width: 16rem`, `padding: 1rem`,
  `border: 2px solid color-mix(… --color-border 30%, transparent)`, `border-radius: 1rem`,
  ground `color-mix(… --color-popover 80%, transparent)`, `z-index: 50`, hung `top: 100%; left: 0`
  off a wrapper at `top: var(--head-rule); left: 0; z-index: 40`. Both engines agree to ≤0.1px.
- **Two instances, one visible.** `App.vue:802` (`.corner-left`, `hidden md:block`) and
  `App.vue:813` (`.mobile-attribution`, `md:hidden`, **`v-show="view === 'playing'"`**). The
  hidden one measures 0 × 0 — a probe that queries `.attribution-trigger` without filtering for
  a painted box reads the wrong instance on a phone (this lane walked into it and says so).
  DOM order is tab order (`App.vue:804-812`, W3 §3.7): a new head control must be declared
  between the two instances and `.corner-right` or the phone tabs right-then-left again.
- **Dismissal is central.** `App.vue:334-337 closeAll()` calls `close()` on both card refs;
  the page root carries `@click="closeAll"` (`:793`) and the card stops its own clicks. A mark
  with a sheet is a third disclosure and must enter that function, not grow its own listener.
- **The disclosure primitive exists.** `useHoverCard.ts` (60 lines): `isOpen/toggle/close/
  onHoverEnter/onHoverLeave`, one module-level `(pointer: coarse)` MQL, the coarse gate that
  stops tap-opens-then-toggles-closed. Reusable as-is; `defineExpose({ close })` is the contract
  `closeAll` reads.
- **Identity, colour, index.** `playerIdentity.ts:64-70 inkFor` (the one-line walk),
  `:27 WRITEABLE = /^[a-ik-wyz]+/`, `:98 IDENTITY_CAP = 8`; `useSession.ts:537 mint()` (self
  gets `ink: {}`), `:547-568 adoptInk`, `:712` `k` rides every `st`, `:402-411 authorInk`.
- **Presence.** `useSession.ts:616 HEARTBEAT_MS = 15000`, `:624 PRESENCE_EXPIRY_MS = 45000`,
  `:630-635 armPresenceExpiry` — **called from exactly one site, `:660`**, and `grep` over
  `games/shared` finds **no `lastSeen` / `seenAt` state anywhere**. The timer exists; the
  timestamp does not.
- **The well.** `GameControlPanel.vue:1086-1188` — three live regions
  (`players-status` polite, `players-roster` `role="log"` + `aria-label="who's on this board"`
  + conditional `tabindex`, `players-alone` sr-only), the roster row grammar
  (`:1149-1151` swatch · name · `you`), `leave` at `:1198`; styles `:1642-1826`
  (`max-height: 7.5rem`, swatch `0.7rem`, row in `--font-hand` at `--type-tag`).
- **The drawn-edge primitives.** `HandDrawnOutline.vue:27-48` (`strokeWidth/outset/radius/pose`;
  `:pose` = enrol no beat) and the icon family `src/pencil/chrome/icons/*.vue` — decorative
  `aria-hidden` static SVG, `currentColor`, no filter, no beat. **There is no `wobbleRect`
  export on this tree**; the charter's word for it is `generateRectBoilFrames`
  (`gridPaths.ts:213`), which `HandDrawnOutline` consumes. A stub drawn in the icon family's
  idiom costs the filter census nothing (measured below).
- **The tokens.** `App.vue:943 --head-rule: calc(0.75rem + env(safe-area-inset-top))`,
  `:961 --tap-floor: 2.75rem`, `:994` head-rule → `env(safe-area-inset-top)` on the phone arm;
  `index.css:162/375 --peer-ink-l` 0.5/0.8; `typography.css:123 --type-tag: var(--type-caption)`.

---

## 2 · What the prototype measured

Every number re-derived on THIS tree, 2026-09-17, both engines, at its viewport.
Raw: `probe/readings.txt`.

### 2.1 The head's band, and the two forms

| | desk 1280×800 | phone 390×844 |
|---|---|---|
| `--head-rule` | `calc(0.75rem + 0px)` → y 12 | `0px` → y 0 |
| @mbabb trigger | 75.5 × 39.8 at (0, 12) | 75.5 × 39.8 at (0, 0) |
| sun (`.corner-right`) | 208 × 208 at x 1072 | 64 × 64 at x 326 |
| free band between them | **996.5px** | **250.5px** |
| STUB mark, shut | **44 × 44** at (76, 12) | **44 × 44** at (76, 0) |
| NAME mark, shut | 78.0 × 44 (webkit 78.1) at (76, 12) | 69.8 × 44 at (76, 0) |
| the hand at `--type-tag` | 14.048px | **12.179px** |
| solo resting colour | `rgb(38, 38, 38)` (graphite) | same |

The stub is a constant box in both engines and both viewports. The name is not: over the REAL
dictionary (measured, not assumed — `node -e` against `unique-names-generator` with
`playerIdentity.ts:27`'s filter) the 345 surviving animals run **3 to 13 characters**, not the
charter's 5–11 (20 are `ant`-length; `hippopotamus` and `tyrannosaurus` exceed 11). Rendered in
the hand at `--type-tag`:

| | desk | phone |
|---|---|---|
| `ant` | 16.7px | 14.5px |
| `mockingbird` | 62.0px | 53.8px |
| `tyrannosaurus` | 73.0px | 63.3px |
| `architectural-caterpillar` (the longest full slug, 25 chars) | 124.9px | 108.3px |
| `16 on this board` | 79.5px | 68.9px |
| `last heard from 30 seconds ago` | 158.5px | 137.4px |

### 2.2 The lobby

Sheet width is the card's own `min-width: 16rem` → **256px** in every cell. Height is linear in
rows, and the two engines return the same figure to 0.1px:

```
desk   h = 80.5 + 20.56·L      (3 rows → 142.3 · 10 lines → 286.2)
phone  h = 76.0 + 18.00·L      (3 rows → 130.0 · 10 lines → 256.2)     L = roster lines
```

`you` sits **5.6px** after the name in every cell. Against the well at HEAD, re-derived at the
GLYPH (`Range.getBoundingClientRect`, not the flex box): the qualifier is **153.3px** from the
last letter of the name it qualifies (webkit 156.1) — R5's F10 at ~145 was measured off the box
edge; at the glyph it is worse. **153.3 → 5.6 is the lobby's whole claim on this row.**

The longest possible slug (124.9px) plus a swatch and `you` fits the sheet's 224px inner width
with room to spare, so no roster row ever needs an ellipsis at the card's pose.

### 2.3 AA, off the engine's compositor, on the sheet's REAL ground

The @mbabb pose is **translucent** (`--color-popover` at 80%), so `--color-card` is not the
sheet's ground. Every reading below paints the ground stack and then the ink ON it and reads the
bytes back off a 2D canvas — the estate's own honest read, and the one that stopped this lane
reporting a false 14.5:1 for `--ink-press-quiet` (a `color-mix(… 68%, transparent)` read off a
cleared canvas returns its solid rgb).

| ground (light / dark) | first-16 walk, worst | `--ink-press-quiet` | graphite | `--color-user-ink` |
|---|---|---|---|---|
| `--color-background` | 5.26 / 9.71 | 5.12 / 6.01 | 14.52 / 12.25 | **4.96** / 7.52 |
| `--color-card` | 5.39 / 9.50 | 5.16 / 5.96 | 14.87 / 11.99 | **5.08** / 7.36 |
| popover 80% over background | 5.31 / 9.66 | 5.16 / 6.03 | 14.65 / 12.19 | **5.00** / 7.48 |
| popover 80% over card | 5.35 / 9.65 | 5.19 / 6.03 | 14.78 / 12.18 | **5.05** / 7.48 |

(chromium; webkit agrees within 0.09 on every cell.) Three readings out of this:

1. **Translucency is not a contrast hazard here.** The composited ground moves every ratio by
   ≤0.13 against the opaque card. The sheet may keep the @mbabb pose unchanged.
2. **Nothing the lobby paints is near the floor.** Worst text ratio on the sheet is 5.00:1;
   the 3:1 non-text floor is cleared by 4–5×. The graphite resting stub reads **14.65:1** light
   and **12.19:1** dark on the sheet's ground — the resting state is not faint.
3. **The floor is `--color-user-ink` itself** — the reserved Tailwind blue, at 4.96:1 on the
   page, lower than any of the first 16 walk indices. F1 retires it from every row but your own
   solo one, which is the only row that is not a comparison.

### 2.4 Solo stays byte-identical, and the filter census does not move

24 cells' inline styles + computed `color` + resolved `--color-user-ink` + the glyph's `stroke`,
hashed before and after the overlay mounts both forms and opens both sheets:

| | desk | phone |
|---|---|---|
| chromium | `c8a9573efab0` → `c8a9573efab0`, **same** | `c8a9573efab0` → `c8a9573efab0`, **same** |
| webkit | `d71fc9fbc33a` → `d71fc9fbc33a`, **same** | `d71fc9fbc33a` → `d71fc9fbc33a`, **same** |

Filter census by `filterBudget.ts`'s own rule (own `filter` ≠ none AND own `display` ≠ none):
**9 → 9**, both engines, both viewports. (A cold load reads 21 — the boot poses the budget's
header names; the probe polls the census to a fixed point before taking the baseline, which is
the trap this lane banks.) `--reveal-delay` is excluded from the fingerprint and the reason is
on the line: it is the deal stagger, and it moves between two reads of an untouched board.

### 2.5 F1, on a live pair — and it is green on BOTH pages

`?wire=local`, page A opens the room, page B follows the link. The mark reads the ROOM's index
for you (`k`, which your own page already holds) instead of the incumbent blue:

| | A's own mark | what the room paints for A | B's own mark | what the room paints for B |
|---|---|---|---|---|
| chromium | `oklch(0.5 0.11 0)` | `oklch(0.5 0.11 0)` | `oklch(0.5 0.11 137.5)` | `oklch(0.5 0.11 137.5)` |
| webkit | `oklch(0.5 0.11 0)` | `oklch(0.5 0.11 0)` | `oklch(0.5 0.11 137.5)` | `oklch(0.5 0.11 137.5)` |

**I2 is GREEN under the overlay on both pages of the pair, in both engines** — against
`rgb(37, 99, 235)` vs `oklch(0.5 0.11 0)` at HEAD. F1 answered: colour arriving on your own mark
means somebody else is here, and a solo board binds nothing (§2.4).

**And it lands the host on hue 0.0°.** `mint` hands index 0 to the first id it meets and the
starter meets itself first, so the page that opened the room is always index 0 — measured twice,
both engines. r0's family-law instrument, re-run here with a reading **identical to r0's banked
one** (37 collisions, exit 1), reds index 0 at **1.0° from `--color-solver-ink-1`**. So F1's cure
puts the walk's worst-placed index on the one object the owner will look at first. This family
does not design the palette (§4), but it is the family that hands §3/R2 that requirement:
**the indices the mark can wear must clear the reserved set, and index 0 most of all.**

### 2.6 M19, and what a third arrival does

A types in a cell, C joins the room, roster goes 2 → 3:

| | focus before | focus after | lobby |
|---|---|---|---|
| chromium | `cell-native-input …` | identical | shut |
| webkit | `cell-native-input …` | identical | shut |

Focus unmoved, nothing opened, both engines. Honest scope: the overlay is static, so this is
**green by construction** for the half that matters (a remote event touches no focus and opens
no surface) and **unproven** for the half a real mark adds — the state line must change under
the reader without moving them. An `aria-label` mutation on an unfocused button moves nothing;
that is the shape the cure has to keep, and it is not asserted here.

### 2.7 The sheet's two geometric collisions (phone, 390×844)

```
sheet at 16 people (9 rows + a compression line): 256 × 256.2 at (76, 44)
board top: y = 252.5 (chromium) / 252.2 (webkit)   →  the sheet laps the board 256 × 47.6px
sun box:  64 × 64 at (326, 0)                      →  the sheet laps the sun    6 × 20px
z: mark 40 · sheet 50 · sun 60                     →  THE SUN PAINTS OVER THE LOBBY
```

Two numbers fall out of this and both are design inputs, not opinions:

- **The compression bound is 7 lines on a phone, not 9.** Clearing the board wants
  `76 + 18.0·L ≤ 252.5 − 44` → `L ≤ 7.36`. Nine rows plus a compression line is two lines too
  many; six names plus `and 10 more` clears.
- **A 256px sheet may not hang at x = 76 on a phone.** Either hang it off the PAGE's left edge
  (x = 0 — which is the @mbabb card's *literal* pose, `left: 0`, and puts the sheet's right edge
  at 256, clearing the sun by 70px) or cap the phone sheet at 242px, under the card's own
  `min-width`. The first keeps the pose and costs the lobby and the @mbabb card one origin
  between them; the second keeps them apart and breaks the pose. **Recommend the first**: the
  two surfaces are mutually exclusive (one trigger each, one `closeAll`) and the pose is the
  precedent the charter named.

### 2.8 Identity loss (I4 / I5), measured

Eight other tables written over the binding (`IDENTITY_CAP = 8`), `sessionStorage` cleared, the
same link re-opened, with a second page holding the room live throughout:

| | your slug | your ink on the room's page |
|---|---|---|
| chromium | `inevitable-caribou` → `average-monkey` | hue 0.0° → **275.0°** |
| webkit | `swift-salmon` → `smart-spoonbill` | hue 0.0° → **275.0°** |

Both halves move: the name AND the colour. The room's roster did not double (`ghostRows: 0`) —
a reload tears the wire down, so the old id departs rather than ghosting to the 45s expiry; the
ghost is a crashed-tab case, not a reload case. **What the sheet has to say** is therefore one
plain sentence about the reader, not an error: `this board gave you a new name` (priced below).
Saying nothing is the alternative and it is worse — the reader's digits are still on the board
under the name they lost, and the one surface that claims to say who you are would be the
surface that did not mention it.

### 2.9 The hand's cut, and every string this family would render

`probe/hand-cut.txt` — the shipped `patrickhand-subset.woff2` holds **46 codepoints**:
`" !'-.0123456789?CRSabcdefghiklmnopqrstuvwyz×—…"`. **All ten digits are already in the cut.**

| where | string | in the cut |
|---|---|---|
| state line, solo | `only you` | ok |
| state line, N | `3 on this board` / `16 on this board` | ok (digits present) |
| the qualifier | `you` | ok (renders today) |
| the foot | `last heard from a moment ago` | ok |
| the foot, aged | `last heard from 30 seconds ago` | ok |
| the compression | `and 7 more` | ok |
| identity loss | `this board gave you a new name` | ok |
| — | ~~`last heard from just now`~~ | **MISS — `j`** |

**The whole lobby costs zero woff2 re-cut** except the one string with a `j` in it, which the
charter already refused for the same reason it refused `just you`. Digits over spellings, on the
estate's own precedent (`GameGallery.vue:219-222`, "counts, not feelings") — the prototype
rendered `and seven more` and it should render `and 7 more`.

---

## 3 · The two research variables

### 3.1 THE FORM — the name dies, the stub develops

Three measured grounds, any one of which is enough:

1. **WCAG 2.5.3 (Label in Name, Level A) contradicts the charter's own naming ruling — for the
   name form only.** A control whose visible label is text must carry that text in its
   accessible name. So a mark that draws `mockingbird` cannot be named `3 on this board`; it
   must be named `mockingbird, 3 on this board`, and the state line stops being the name. The
   stub draws no word, so its name is free to be exactly the state line — which is what the
   charter asked for and what the estate's one-name law (R6 #33) wants. **Measured corollary**:
   r0's I3 addresses the mark by `/player|lobby|who.s (here|on this board)/i` and finds
   **0 candidates even with the mark mounted and open**, because `only you` matches none of
   those words. The instrument's locator encodes a naming assumption this family's ruling
   breaks; it needs the adjustment in §6, not the design.
2. **The name has no box.** 16.7 → 73.0px desk, 14.5 → 63.3px phone across the real dictionary.
   The head's left corner would breathe by 4× between one player and the next, beside a fixed
   75.5px @mbabb. The stub is 44 × 44 in every cell measured.
3. **At the phone the name renders at 12.179px**, in a second face, 1.8px under the @mbabb it
   sits beside and below every read floor the estate argues about elsewhere (R7's M01 frame is
   the owner complaining about 14px). `frames/desk-head-name-shut.png` is the clutter question
   at its most favourable — desk, 14.048px, in ink — and it still reads as a second byline;
   `frames/desk-head-stub-shut.png` is the stub in the same pose.

The kill condition the charter wrote for the stub — "an abstract glyph a reader must learn" —
is answered by presence and contrast rather than by argument: the stub is mounted from the
first session at 14.65:1 (light) / 12.19:1 (dark) on the sheet's ground, graphite until the room
gives it a colour. The name's own kill condition — "an indication nobody sees at rest is one
nobody learns" — is the one that actually fires, because a graphite `mockingbird` beside
`@mbabb` is two authorship claims in the quietest corner and the resting state is the state a
solo reader lives in.

### 3.2 MIRROR vs MOVE — both are wrong, and the seam is the answer

Measured (desk, room of 3): the players well is **284.2 × 109** with the roster (roster 60px);
with `.players-roster`, `.players-status` and `.players-alone` hidden it is **284.2 × 45**.
So MOVE buys the controls card **64px** and leaves invite + leave, which is M14's "controls stay
in controls" read literally.

But MOVE as written cannot be built: **a live region inside a shut sheet does not announce.**
The sheet is `display: none` shut in this prototype and the estate's own precedent is
`visibility: hidden` (`AttributionCard.vue` UI-6 note, which exists precisely because that
property removes the subtree from the tab order and the a11y tree). Move `role="log"` into a
surface that is closed 99% of the time and arrivals stop being spoken at all — W3 §3.4's whole
cure, undone by a relocation.

MIRROR as written is the other failure: two drawn rosters, one of them saying what the other
already says (R6 #9, W3's one-region law).

**The seam: move the DRAWING, keep the REGION.** One `role="log"` exists, it stays mounted and
unconditional where it is (the well, or the page as an sr-only twin — W3 §3.4 already proved
the pattern: unconditional region, conditional sentence, `sr-only` when it holds nothing), and
the LOBBY renders the same rows as plain markup with no role and no `aria-live`. Then:

| | the well shows | the sheet shows | on a third arrival, lobby shut | regions minted |
|---|---|---|---|---|
| today | invite · 3 regions · roster · leave | — | `role="log"` announces the addition | 3 |
| **the seam** | invite · 3 regions (roster sr-only) · leave | state line · rows in ink · foot | the same `role="log"` announces it, unmoved | **3 — none new, none lost** |

The well keeps its 64px only if the roster goes `sr-only` rather than away, which is the same
trick `players-alone` has worn since T8-W3 and costs the well no pixels. That is the reading
this lane recommends and it is the one the next pass should spec.

---

## 4 · The ink source this family assumes

The room's `k` index (`useSession.ts:712` publishes it on every `st`, `:547-568` adopts it) into
the EXISTING formula `inkFor(index)` (`playerIdentity.ts:64-70`) at `--peer-ink-l` 0.5/0.8,
chroma 0.11. The family designs no palette. What it needs from whatever §3/R2 rules:

1. one ink per person, stable for the life of the room (I4 is RED today — `adoptInk` reassigns,
   `useSession.ts:553`, and the ink moved 137.5° → 327.5° in this lane's re-run);
2. AA ≥ 4.5:1 for the name and ≥ 3:1 for the stub, on **popover-80%-over-background AND
   over-card**, both themes — the grounds table in §2.3 is the shape of the answer required;
3. **index 0 must be clean**, because the host always wears it (§2.5);
4. a resting ink that is not a walk index at all — graphite today, at 14.65:1 / 12.19:1.

---

## 5 · Sketches

```
┌─ 390 × 844, shut, STUB ──────────────────────────────────────────┐
│ @mbabb  ▰                                                   ☀    │  y 0…44   (--head-rule 0)
│ 0    75.5│76  120                                       326  390 │  free band 250.5
│          └ 44×44, graphite solo / your room ink live             │
│            accessible name = the state line                      │
└──────────────────────────────────────────────────────────────────┘

┌─ open, 3 on this board ──────────────────────────────────────────┐
│ @mbabb  ▰                                                   ☀    │
│ ┌────────────────────────── 256 ─────────────┐                   │  the @mbabb pose exactly:
│ │ 3 on this board                            │  ← quiet rung     │  popover 80%, 2px @30%,
│ │ ▰ tragic-mockingbird  you                  │  ← 5.6px, not 153 │  radius 16, padding 16
│ │ ▰ literary-panda                           │                   │  hung off --head-rule
│ │ ▰ opposite-heron                           │                   │  at the PAGE's left (x=0)
│ │ last heard from 26 seconds ago             │  ← only when late │  so the sun (z 60) cannot
│ └────────────────────────────────────────────┘                   │  paint over it
│   phone h = 76 + 18.0·L        desk h = 80.5 + 20.56·L           │
└──────────────────────────────────────────────────────────────────┘

┌─ 16 on this board, phone — the bound ────────────────────────────┐
│ …7 lines is the ceiling (76 + 18·L ≤ 208.5), so:                 │
│   6 names, then  "and 10 more"      ← never a scroll in a scroll │
│ at 9 rows + a compression line the sheet is 256.2 tall and laps  │
│ the board by 47.6px — measured, both engines                     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 6 · Instruments — before and after

| id | asserts | HEAD, this tree | under the overlay |
|---|---|---|---|
| I1 `instruments-family-law.mjs` | no peer ink in the first 16 within 12° of a reserved ink | **RED**, 37 collisions, exit 1 — diff vs r0's banked reading: identical | **still RED**, and the family says why it matters more now: index 0 is the host's own mark, 1.0° from `--color-solver-ink-1` |
| I2 | your own swatch is the colour the room paints for you | **RED** both engines (`rgb(37,99,235)` vs `oklch(0.5 0.11 0)`) | **GREEN**, both engines, **both pages** of the pair |
| I3 | a player mark in the head's left corner whose press opens a lobby | **RED**, 0 candidates both engines | mark present at (76, 12) 44 × 44, `x<200`, `y<120`, press opens `[data-lobby]` — **but r0's locator still returns 0** (§3.1.1). GREEN on geometry and behaviour, RED on the name regex |
| I4 | an agreed ink index survives a rival `st` | **RED**, 137.5° → 327.5° on one page only, both engines | untouched — this family SPEAKS to it (§2.8), it does not cure it |
| I5 | a live claim is never re-issued | **RED**, `collided: true`, both engines | untouched — same |
| new: solo identity | a solo board is byte-identical under the mark | — | **GREEN by construction**, 4 cells hashed equal (§2.4) |
| new: π | the filter census does not move | 9 settled | **9 → 9**, both engines, both viewports |
| new: tap floor | 44px in BOTH dimensions | — | stub **44 × 44** every cell; name 78.0/69.8 × 44 (width by padding, not by the word) |
| new: font | every rendered string inside the cut | — | **GREEN**, 15/16 strings; the one `j` string refused |

---

## 7 · Risks and kill conditions

| | status |
|---|---|
| two authorship claims in the quietest corner | **FIRES for the name**, cleared for the stub (no word is drawn) |
| a 14px slug reading as clutter | **FIRES** — and it is 12.179px on the phone, not 14 |
| an empty solo state nobody learns | **cleared for the stub** (always mounted, graphite at 14.65:1), fires for the name |
| mirroring says one thing twice | real; resolved by the seam in §3.2 (the drawing moves, the region does not) |
| moving touches three regions W3 just landed | real, and worse than it looks: a region in a shut sheet is a region that never speaks |
| a stub is a glyph a reader must learn | live. It is the one cost this recommendation accepts, and the press + the state line are how it is taught |
| the sun paints over the lobby | measured, 6 × 20px, z 60 vs 50; cured by hanging the sheet at the page's left edge |
| the sheet laps the board at 16 | measured, 47.6px; cured by the 7-line bound |
| the foot is a near-constant line | **live and unresolved.** With a 15s beat and a 45s expiry, a live peer's last word is almost always under 15s, so `last heard from a moment ago` is what the line says nearly always. Recommend it appear only past 20s — silence then means everyone is current |
| "last heard from" is an invented fact | **no** — but it does not exist yet either. `armPresenceExpiry` (`useSession.ts:630`, one call site at `:660`) sets a timer and stores no timestamp; `grep` finds no `lastSeen` in `games/shared`. One `Date.now()` at that call site is a local derivation at zero wire cost and no new message kind. A *ticking* line would need a timer the estate does not have; compute it when the sheet opens |
| index 0 = hue 0.0° on the host's own mark | measured; handed to §3/R2 as a requirement, not designed here |

---

## 8 · Recommendation

**DEVELOP**, as the crayon stub, with the seam of §3.2 and the three adjustments of §2.7/§2.9.

The idea survives its own prototype: I2 goes green on both pages of a live pair in both engines,
a solo board stays byte-identical to the hash, the filter census holds at 9, the whole copy set
lands inside the shipped woff2 without a re-cut, the sheet is the @mbabb card's pose unchanged
with 4–5× of AA headroom on its real translucent ground, and the `you` qualifier moves from
153.3px adrift to 5.6px. The fork resolves cleanly and against the charter's first-listed
option: the written name is refused by WCAG 2.5.3 the moment its accessible name is the state
line, has no fixed box across a dictionary that runs 3 to 13 characters, and renders at 12.179px
beside a 14px @mbabb on the phone — three separate failures, each sufficient. The second
variable resolves to neither of its two arms: the roster's DRAWING moves to the sheet, the
roster's REGION stays mounted where it can still speak, and the count of live regions stays
exactly three. What this lane does not close and hands on: the ink system itself (index 0 sits
1.0° from the solver's first ink and the host always wears it), I4's reassignment, and the
foot's near-constancy. U-10 — nothing here closes a mark.
