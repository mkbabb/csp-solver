# PLR-COUNT — THE TALLY (T9-W7 pass 2, RESEARCH)

§11 the player mark (icon · lobby) · §12 · M14. Lane port 127.0.0.1:4242 (`--strictPort`,
private vite `cacheDir`), plus 4243 for the graft rig; both killed before this returned.
**Read-only on the product**: the pass-1 worktree `wf_e58b4764-0fc-47` is served exactly as it
stands and nothing in `src/`, `e2e/` or `scripts/` is touched. The only in-page mutations are
`page.evaluate` overlays that hide a glyph to read its ground and put it back.

Every number below is re-derived on THIS tree, at its own viewport, in **both engines**. Where
it moves against pass 1's spec or critique, the row that carries it says so and re-cuts it at
its citation (§1.5 and §1.9 are the two that move).

| file | what it is |
|---|---|
| `probe/r2.spec.ts` | A width · B the sheet's real ground · C the desk bound · D the counting rule · E the pre-game · F hover + the 6↔7 swap · G the focusout seam · H the filter census · I a departure |
| `probe/r2b.spec.ts` | J the wordmark · K the board bound both regimes · L G4 · M I2'/I4' |
| `probe/r2c.spec.ts` | L' the binding, diagnosed off `authorInk` / `cellAuthors` / the DOM at one instant |
| `probe/graft.spec.ts` | the graft measured on PLR-SELF's own worktree (`wf_e58b4764-0fc-46`, :4243) |
| `probe/ground.mjs` | the painted-ground reader (sharp): per run, the ground's extremes and the ratio the run's own ink makes on the worst of them |
| `probe/heading-voice.copy.spec.ts` | r0's heading census, COPIED and re-pointed (it writes no file; it takes `PLAYWRIGHT_BASE_URL`) |
| `probe/crops.spec.ts`, `probe/pw.config.ts`, `probe/vite/` | the two crops, the scratch Playwright config, the two scratch vite configs |
| `instruments/` | I2'/I4' re-pointed (PROPOSED), G4's re-aim, and `pixels.mjs` handed to PAL-TIN |
| `readings/` | every reading, both engines |
| `frames/` | **2** crops, 95 KB total |

---

## 1 · The ten rows, closed or priced

### 1.1 Two popovers on one anchor — CURED BY THE GRAFT, and the graft is measured

The defect stands exactly as the critique took it. Re-measured here, both engines, desk 1280
(`readings/f-hover-swap-*.json`):

```
hover the MARK   card opacity 1, visibility visible, (0, 51.75) 256 × 151, z 50
                 .attribution-trigger aria-expanded = true      <- the tally opened somebody else's card
press the MARK   card   (0, 51.75) 256 × 151      z 50
                 lobby  (0, 51.75) 256 × 173.88   z 50
                 elementFromPoint at a register row -> div.flex-1   (inside the card)
```

The cause is one line of DOM: `AttributionCard`'s ROOT div carries `@mouseenter`/`@mouseleave`/
`@focusin`/`@focusout`, and PLR-COUNT's diff puts `.head-left-row` — and therefore the `#mark`
slot — inside it. `mouseenter` fires on an ancestor when any descendant is entered; `focusin`
bubbles. So the mark is inside somebody else's hover region by construction, not by accident.

**PLR-SELF's cure, measured on PLR-SELF's worktree** (`readings/graft-disclosure-*.json`, both
engines). The four handlers move one level in onto a `.attribution-disclosure` div and the
`#mark` slot becomes that div's FLEX SIBLING:

| | chromium | webkit |
|---|---|---|
| hover the trigger → card | (0, 51.75) **256 × 151**, expanded `true` | (0, 51.75) 256 × 150.95, `true` |
| hover the MARK → card | opacity 0, **visibility hidden**, expanded `false` | opacity 0, hidden, `false` |
| press the MARK → card | still hidden | still hidden |
| press the MARK → lobby | (0, 51.75) 256 × 54.95, mark expanded `true` | identical |
| `markIsInsideDisc` | **false** | false |

Two things the synthesizer needs from this: the card's pose is **byte-identical** after the move
(256 × 151 at (0, 51.75) — r0's census number, unmoved), and the mark's hover no longer reaches
it. **Take the graft whole**: the isolation div, the `#mark` slot AFTER the disclosure (DOM order
is tab order: @mbabb → mark → sun), and `headDisclosures` (`useHoverCard.ts:11-20` in fc-46 —
`register(close) => remove` + `claim(self)`), so `App.vue`'s single `closeAll` keeps its one
owner and one head surface is open at a time.

Cost of the graft, named: `AttributionCard` gains a node and `useHoverCard` gains an exported
`InjectionKey`. Both are PLR-SELF's diff, not this family's, so §11's two families must land
the wrapper change ONCE.

### 1.2 The 7→6 return tweens — the mechanism, exactly

`PlayerTally.vue:40` `drawn = count <= 6 ? count : 0`, and `:60-62`:

```ts
watch(drawn, (now, was) => { if (now > was) drawIn(range(was, now)) });
```

At seven people `drawn` is **0**. One leaves and `drawn` goes 0 → 6, so `now > was` is true and
all six strokes re-draw from zero on the 90 ms stagger. The critique sampled it
(`pass1/critique/PLR-COUNT/data/c3-7to6-tween-chromium.json`): `['0','0','0','0','0.12','4.79']`
at t = 552 ms. Two things break together — the motion table's `6 → 7 and 7 → 6 | same-frame
swap | none`, and `useTallyStrokes`'s own stated law ("a tally is a SET: re-arming one member
must not un-draw another").

The guard must be on the CROSSING, not on the magnitude, because the magnitude lies exactly
here. The shape:

```ts
watch(drawn, (now, was) => {
  if (!now) return;                 // the written count: nothing to draw
  if (!was || now < was) settle(range(0, now));   // re-entry from the number, or a departure
  else if (now > was) drawIn(range(was, now));    // arrivals only, and only the new ones
});
```

`settle` already exists (`useTallyStrokes.ts:109`) and is called once at setup
(`PlayerTally.vue:56`); it is the one-line cure and nobody reached for it.

### 1.3 The counting rule — FOUR bases on one object, and one of them is a Level A row

Measured across every N, both engines (`readings/d-counting-*.json`):

| N | strokes | glyph | `aria-label` = state line | rows listed | foot |
|---|---|---|---|---|---|
| 1 | 1 | — | `no other players` | 1 (`you`) | — |
| 2 | 2 | — | `1 other player` | 2 | — |
| 3 | 3 | — | `2 other players` | 3 | — |
| **6** | **6** | — | `5 other players` | **4** | `and 2 more` |
| 7 | 0 | **`7`** | `6 other players` | 4 | `and 3 more` |
| 12 | 0 | `12` | `11 other players` | 4 | `and 8 more` |
| 16 | 0 | `16` | `15 other players` | 4 | `and 12 more` |

Four bases: strokes and glyph count EVERYONE; the name and the state line count OTHERS; the
rows count everyone and cap at four; the foot counts the remainder of everyone. At N=6 the mark
draws six objects over a list of four. `frames/phone664-sheet-over-grid.png` has the whole
disagreement in one frame: the head reads `16`, the sheet's first line reads `15 other players`.

**The glyph/name pair is WCAG 2.5.3 (Label in Name, Level A)**, not merely an inconsistency: the
mark's visible label at N ≥ 7 is the text `12`, and its accessible name must CONTAIN that text.
`11 other players` omits and contradicts it. 2.5.3's exception is for symbolic characters (a
`B` meaning bold); a numeral standing for its own value is not symbolic.

**The recommendation: one base, and the base is EVERYONE at this board** — because that is what
the object already is (one stroke per person, self first, solo = one stroke). That makes the
copy `1 player` / `N players`:

- it carries the glyph's digits, so 2.5.3 is satisfied by construction;
- it matches r0's I3 locator `/player|lobby|who.s (here|on this board)/i` at every N;
- every glyph is inside Patrick Hand's 46-codepoint cut (`src/assets/index.css:88-96`:
  `U+0061-0069, U+006B-0077, U+0079-007A` — no `j`, no `x`; `U+0030-0039` present, so a written
  count is free). `just you` is undrawable and stays retired; `only you` is drawable but does
  not match I3;
- the sheet's own first row already says `you`, so the solo case is not mute.

The alternative — keep `no other players` / `N other players` and re-base the drawing to OTHERS —
costs the solo graphite stroke its meaning (a stroke standing for zero) and breaks the glyph's
identity with the strokes it replaces. It is cheaper to move the words.

**And the two thresholds must agree.** `MAX_MARKS = 6` (`PlayerTally.vue:35`) against
`ROWS = 5` (`PlayerLobby.vue:31`) is why N=6 draws six and lists four. Either the sheet carries
six rows where the viewport allows it (§1.6) or the mark's last drawn count is five. Whichever
the synthesizer picks, **one number**.

### 1.4 G4 — re-aimed, and now able to fail

See `instruments/README.md` for the full reading. In one line: in a room of two where both have
written, `authorInk` holds **0** entries for self-authored positions and **1** for the peer's,
and the DOM agrees (`readings/lprime-binding-*.json`, both engines). The gate asserts BOTH
halves, so the empty room that made pass 1's version a tautology fails it.

### 1.5 AA on the sheet's real ground — the number, measured in painted bytes

The register reuses the @mbabb card's pose, `color-mix(in srgb, var(--color-popover) 80%,
transparent)`. On a phone the sheet's box is (0, 44) 256 × 173.75 and the `sudoku` wordmark sits
at (58.14, 143.52) 243.33 × 71.22 — so the sheet's bottom band stands **on a letter**.

Read off the sheet's own box, shot at dpr 3 with every glyph hidden, N=16
(`readings/ground-bytes.json`, `probe/ground.mjs`):

| run | ink | worst ground | light chr | light wk | dark chr | dark wk |
|---|---|---|---|---|---|---|
| `.pl-state` | `--ink-press-quiet` (68% graphite) | paper | 5.206 | 5.201 | 6.099 | 6.099 |
| `.pl-name` | `--color-pencil-graphite` | paper | 14.651 | 14.625 | 12.183 | 12.183 |
| `.pl-qualifier` | `--ink-press-quiet` | paper | 5.206 | 5.201 | 6.099 | 6.099 |
| **`.pl-more`** | `--ink-press-quiet` | **rgb(204,203,203)** light · **rgb(61,60,59)** dark | **4.192** | **4.166** | **4.207** | 4.207 |

**Worst 4.166:1, webkit light, under AA 4.5 by 0.334.** Exactly one run fails, and it is the
LAST line of the sheet — 52–53% of its box stands on the wordmark (18,618 of 35,332 device px,
webkit light). The critique's ≈3.3:1 was pessimistic: it composited the quiet ink onto the card
first and then re-read that result over the bleed. Composited once, onto the ground it actually
lands on, it is 4.17–4.21.

Four cures, priced:

1. **Give the foot the name's ink.** `and N more` is a COUNT, and the estate's own ruling on the
   tally is that the name is the count and only the count (`techniqueVoice.ts:114,125`). Graphite
   reads 14.65 / 12.18 on the same ground. One declaration, no token minted, no pose moved.
2. Raise the sheet's own ground to opaque. Costs the pose its byte-identity with the @mbabb
   card, which is the family's whole argument for the surface.
3. Bound the sheet so it never reaches the wordmark. §1.6 shows that costs rows.
4. Re-pitch `--ink-press-quiet`. Out of scope: the ladder is asserted estate-wide by
   `scripts/check-ink-pressure.mjs` and re-pitching it re-prices seven surfaces.

**1 is the recommendation.** It also removes the last reason the foot line reads as a caption
rather than as part of the count.

### 1.6 G8 — the desk bound, the phone bound, and the per-regime ROWS

The sheet's height is arithmetic, and it re-derives to 0.02 px
(`readings/c-desk-bound-*.json`, `readings/jk-wordmark-board-*.json`):

```
H(rows r, foot m) = 58.95 + 23.6·r + (m ? 20.55 : 0)      [4 border + 32 padding
                                                           + 18.95 state + 5.6 list margin
                                                           + 22 per row + 1.6 per gap
                                                           + 1.6 + 18.95 for the foot]
   r=1 m=0 -> 82.55   (measured 82.55)
   r=3 m=0 -> 129.75  (measured 129.73)
   r=4 m=1 -> 173.90  (measured 173.88 desk / 173.75 phone)
```

Against the grid's top in each regime:

| regime | sheet top | grid top | budget | largest sheet that CLEARS | at ROWS=5 |
|---|---|---|---|---|---|
| desk 1280×800 | 51.75 | **124.45** (wk 124.16) | 72.70 | **state line only** (54.95) | **4 of 81 cells lapped** (124.11 × 101.18) |
| phone 390×844 | 44 | **221.73** (wk 221.42) | 177.73 | 5 rows (176.95) or 4+foot (173.75) | **clears by 3.98 px** |
| phone 390×664 | 44 | **131.73** (wk 131.42) | 87.73 | **1 row, no foot** (82.55) | **21 of 81 cells lapped** |

Three findings the owner's row needs:

- **On the desk no row count ≥ 1 clears the board.** One row is already 82.55 against a 72.70
  budget. And it is not a ROWS problem: the desk's left gutter is 131.89 px and the sheet is
  256 wide (`min-width: 16rem`, the card's pose), so a 256-wide sheet hung at the page's left
  edge cannot clear a board that starts at 131.89 at ANY height. The lap is 2 cells at N ≤ 5 and
  4 cells at N ≥ 6. `frames/desk-register-over-board.png`.
- **The 844 phone clears by 3.98 px** at the shipped ROWS=5 — real, and one row of slack from
  not clearing.
- **The short phone is where it bites**: 21 cells at N=16, and the sheet also covers the
  wordmark. This is PLR-PLACE's 664 row, on this family's surface.

And the lap has a second tooth, inherited from PLR-PLACE's critic: `.player-lobby` carries
`@click.stop` on its root (`PlayerLobby.vue:60`) and holds **zero focusable elements**, so a tap
on the sheet over a lapped cell reaches neither the cell nor the dismissal — it does nothing at
all. Dropping `@click.stop` from a sheet with nothing to click makes a tap on it dismiss it,
which is the right behaviour for this surface and costs nothing.

So: **book G8 for the owner (U-10) with these three numbers**, and give `PlayerLobby` a
per-regime `ROWS` for the phone half (5 at 844, 1 at 664 — a coarse-height media query, not a
width one), because the desk half is an anchor question rather than a row count.

### 1.7 The tally before any game exists — the two regimes already disagree

`./` deals a board, so the pre-game state is `?view=gallery`. Measured
(`readings/e-pregame-*.json`), both engines:

| | desk 1280 | phone 390 |
|---|---|---|
| marks in DOM | 2 | 2 |
| **visible** | **1** — named `no other players`, (75.53, 12) 44 wide | **0** |

The mobile `AttributionCard` carries `v-show="view === 'playing'"` (`App.vue:813` at HEAD, `:821` under this diff) and the
desktop one does not, so slotting into both instances inherited an asymmetry: in the gallery a
desk reader sees a player count for a board that is not on screen and a phone reader does not.
Decide it once for both. The cheap, consistent answer is to gate the SLOT, not the card:
`<template #mark v-if="view === 'playing'">`, which leaves @mbabb where it is on both platforms
and moves no pixel that the wave has not claimed. The opposite ruling (present at `/`) is
defensible only by also ungating the mobile instance, which moves an unclaimed surface.

### 1.8 r0's instruments — MOVED, re-pointed, measured

Full table and the proposed diff in `instruments/`. Summary: I2' and I4' re-point from
`.player-swatch`'s `backgroundColor` to `[data-lobby] .pl-row .pl-row-mark path`'s `stroke`,
they READ where the originals throw, and they reproduce r0's verdicts exactly — I2' RED **by
ruling** (F1 is decided the other way), I4' RED (137.5° → 327.5° on one page). I3 stands; its
last line needs `:visible`, not one lobby.

### 1.9 The spec's width table — re-cut at its citation

`boxWidth = 13·(N + (N>5 ? 1 : 0))` viewBox units at `36/44` px per unit, plus `0.618rem`
padding each side (19.776 px at a 16 px root), floored at `--tap-floor`. Measured at 390 coarse,
both engines identical (`readings/a-width-*.json`):

| N | 1 | 2 | 3 | 4 | 5 | 6 | ≥7 |
|---|---|---|---|---|---|---|---|
| **measured** | **44** | **44** | **51.66** | **62.28** | **72.92** | **94.20** | **44** |
| pass-1 spec | 44 | — | 52.81 | 63 | 74.08 | 95.36 | ≤60 |
| arithmetic | 30.41→44 | 41.05→44 | 51.69 | 62.32 | 72.96 | 94.23 | 44 |

The spec is **1.12–1.16 px high at every N** — it carried 20.90 px of padding where the button
has 19.776 — and it omits N=2, which is the TAP FLOOR (41.05 wants 44) exactly as N=1 is. The
head's free band re-derives at **250.47 px** (trigger 75.53 wide at x=0; `.corner-right` at
x=326), so N=6 is **37.61%** of it, not 38%. Past six the mark is the floor, 44, not "≤60".

### 1.10 The hover lift, and the 6↔7 swap

Both engines (`readings/f-hover-swap-*.json`). Hover lift: the solo graphite stroke goes
`stroke-opacity` **0.95 → 1**, and a coloured stroke does not change — the spec's claim, on the
surface. The swap: the mark's box is **36 px tall at every N** and the head row's is **39.75**,
unchanged at 5 → 6 → 7 → 8; the glyph's own box is 20.36 (wk 20.34) at y 19.81. **The head line
does not step.** What jumps is the WIDTH: 94.20 → 44, a 50.2 px collapse in one frame, which is
the thing the motion table should be asked about rather than the height.

---

## 2 · Three things pass 1 and its critic did not name

### 2.1 The object a person owns SLIDES when somebody before them leaves

`PlayerTally.vue:44-50` seeds each stroke `11 + 12·i` where `i` is the index in the CURRENT
people array, so the wobble is bound to POSITION and the ink to the PERSON. Measured, N=5, a
middle peer sends `bye` (`readings/i-departure-*.json`, both engines):

```
before  [ user-ink , oklch h137.5 , oklch h275 , oklch h52.5 , oklch h190 ]
after   [ user-ink , oklch h137.5 ,              oklch h52.5 , oklch h190 ]
                                     ^ h275 gone; h52.5 and h190 each slid one pitch LEFT
```

So the reader who has learned "I am the third stroke" is the second stroke a moment later, and
the SHAPE at position 3 stays put while its owner changes. This is ACC-SIX's seeded-geometry
warning turned inside out — the geometry does not re-roll, the ownership does — and it is the
same class as §1.2: the tally is described as a set and implemented as a list. Keying the pose
to the person (`seed` from the id's FNV hash, `:key="p.id"`) costs one line and makes both the
departure and the 7→6 crossing honest at once.

### 2.2 Opening the register tells the room you looked away — on this mark too

PLR-PLACE's focusout seam, measured on PLR-COUNT's mark with two real pages
(`readings/g-focusout-*.json`), both engines:

```
focus a cell           A activeElement = the cell's input      B sees 1 peer ghost
press the mark         A activeElement = .pt-mark (chr) / none (wk)    B sees 0
```

The chain is `GameBoard.vue:471-477` `onGridFocusout → noteFocus(null)` →
`useSession.ts:934-940`, which sends `cur {p: null}` on the wire. So every other reader's board
loses your cursor for as long as you are reading the register, and your own place goes with it.
The mark inherits this from the head, it is not this family's invention, and it is not this
family's to cure alone — but the register is the one surface that can be honest about it, and a
`cur` suppressed while a head disclosure is open is the narrow fix. State it; do not design
around it.

### 2.3 Escape dismisses on chromium and not on webkit

`PlayerTally.vue:105` puts `@keydown.esc="close"` on the wrapper `<span>`, so the key must land
inside it. After a MOUSE press, chromium focuses the button and Escape closes (`escapeClosed:
true`); webkit does not focus a button on click, the keydown goes to `body`, and the sheet stays
open (`escapeClosed: false`). One engine, one input path, and it is the path a desk reader is
on. The idiom that survives both is a document-level `keydown` while open, or `close()` on the
button's own `blur` — the estate's own `AttributionCard` closes on `focusout`.

---

## 3 · Surfaces, tokens and primitives — what a spec may name

**Product files this family touches** (pass-1 diff, `wf_e58b4764-0fc-47`):
`src/games/shared/PlayerTally.vue` (new) · `PlayerLobby.vue` (new) · `useTallyStrokes.ts` (new,
extracted from `DifficultyTally.vue:84-183`) · `DifficultyTally.vue` (−123/+15) ·
`GameControlPanel.vue` (−213 net: the roster's pixels, the three one-shots, `.player-swatch`,
`max-height`) · `useSession.ts` (+16: `PRESENCE_QUIET_MS`, `lastHeard`) ·
`AttributionCard.vue` (the head row) · `pencilConfig.ts` (`MOTION.tallyStaggerMs: 90`,
`BOIL_CONFIG.tallyBoil: 0.6`) · `App.vue` (two slots, two refs, `closeAll`).

**Tokens, all existing — this family mints none:**

| role | token | value |
|---|---|---|
| solo stroke | `--color-pencil-graphite` (`index.css:223`) at `stroke-opacity .95` | 12.48 / 10.95 |
| your stroke, your row, the written count | `--color-user-ink` (`:151` / `:372`) | `#2563eb` / `#60a5fa` |
| a peer's stroke and row mark | `inkFor(k)` (`playerIdentity.ts:68-70`), `--peer-ink-l` `:162`/`:375` | worst 4.771 / 8.579 at 0.95 |
| register names | `--color-pencil-graphite` | 14.65 / 12.18 on the sheet |
| state line, qualifier, foot | `--ink-press-quiet` (`:262-266`, 68%) | 5.21 / 6.10 on paper, **4.17 / 4.21 on the wordmark** |
| sheet ground / border / radius / padding / width | `--color-popover` 80%, `--color-border` 30%, 1rem, 1rem, 16rem | the @mbabb card's pose |
| tap floor | `--tap-floor` (`App.vue:961`) | 2.75rem = 44 |
| the stagger, the perturbation | `MOTION.tallyStaggerMs`, `BOIL_CONFIG.tallyBoil` | 90 ms, 0.6 units |

**Primitives to reuse, by name:** `generateLineBoilFrames` (`gridPaths.ts:380-410`) with
`FILTER_PRESETS["grain-static"].grain` baked into the point IR · `useBeatFrame` +
`heldFrameCount` + `beatsFor` (the shared boil beat — one driver, ref-counted) ·
`createSequenceSubscription` + `easeOutCubic` + `DRAW_IN_PRESETS.glyph.duration` ·
`usePrefersReducedMotion` · `headDisclosures` / `useHoverCard` (fc-46) · `authorInk` /
`cellAuthors` / `peerCursors` / `session.players` · `PRESENCE_QUIET_MS` + `lastHeard`.

**π, held:** the live-filter census by the estate's own counting rule (own `filter ≠ none` AND
own `display ≠ none`, `e2e/filter-census.spec.ts:36`) reads **9 closed and 9 with the tally
boiling and the sheet open at N=16**, both engines, both regimes (`readings/h-filters-*.json`).
The heading census re-runs on this worktree and returns **r0's HEAD reading byte for byte** —
8 group names, 3 voices (`Fraunces · 25.89 · 800 · lowercase`, `Patrick Hand · 14.05 · 500 ·
lowercase`, `Patrick Hand · 14.05 · 400 · none`), 2 of 8 document headings, phone rank 1.0175 —
so 213 lines out of `GameControlPanel` moved no heading.

---

## 4 · The couplings, stated

**F1.** This family is on the "the board keeps your blue" side with ACC-FIVE/SIX, PLR-PLACE and
PAL-*: self's cells bind nothing (`useSession.ts:537`), a solo board is byte-identical, and the
mark and the register carry a room-relative label. Measured price, unchanged from pass 1: the
digit you just wrote is `rgb(37,99,235)` (h 262.9°) and your own row mark on your neighbour's
page is `oklch(0.5 0.11 0)` — **97.1° apart**, both in the page's left column. The register's
`you` at 5.6–8 px off your own name is the mitigation; the mark does not argue it.

**`.player-swatch`.** PLR-COUNT deletes it; PLR-SELF keeps it because the estate's instruments
read the room's colour off it. The chair's §7 ruling is that the swatch stays until the
instruments that read it are re-pointed **in the same diff**. This lane's side: **delete it, and
pay the chair's price in the same diff** — `instruments/i2-i4-repointed.spec.ts` is written and
measured, so the condition is satisfiable today. The cost to name: the re-pointed instruments
gain a gesture (the register is a disclosure; the roster was always mounted), so both rows must
press the mark and settle ~700 ms before reading, and a future instrument that wants the room's
colour without a gesture has nowhere to read it. If §11 rules the other way, the swatch survives
as an `sr-only`-adjacent dot with no reader, which is a consumer-less substrate by the wave's
own standard.

**PAL-TIN.** `pixels.mjs` and the demand go over with a number: minimum PAINTED pairwise hue
separation **12.7° webkit / 13.3° chromium** in light from N=3 onward, 19.7–20.4° dark; the ask
is ≥30° over the first six indices, clearing the 29 board inks and the head's 12 warm tokens
(h 2.8–100.8) at a 2.18–2.62 px stroke, index 0 out of the logo's rose (2.8° today).

---

## 5 · Sketches

**A — the head, corrected. The row's boxes are the measured ones.**

```
 phone 390 coarse, free band 250.47 after @mbabb
 ┌──────────────────────────────────────────────────────────────────────┐
 │ @mbabb  │                                                     ☀      │  N=1  44   (floor; strokes want 30.41)
 │ 0  75.53                                                  326  390   │  N=2  44   (floor; strokes want 41.05)
 │         │ │ │                                                        │  N=3  51.66
 │         │ │ │ │ │                                                    │  N=5  72.92
 │         │ │ │ │ │  │                                                 │  N=6  94.20  = 37.61% of the band
 │         16                                                           │  N≥7  44     the count, in your blue
 └──────────────────────────────────────────────────────────────────────┘
   the row's height is 39.75 and the mark's 36 at EVERY N — the line never steps.
   what jumps at 6→7 is the width: 94.20 -> 44 in one frame.
```

**B — the sheet against the three grids it has to live over.**

```
                desk 1280x800            phone 390x844           phone 390x664
 sheet top      51.75                    44                      44
 H(4 rows+foot) 173.88 -> btm 225.63     173.75 -> btm 217.75    173.75 -> btm 217.75
 grid top       124.45                   221.73                  131.73
                ────────────────         ────────────────        ────────────────
                LAPS 101.18 x 124.11     CLEARS by 3.98          LAPS
                4 of 81 cells            0 cells                 21 of 81 cells
 largest sheet  state line only          5 rows (176.95)         1 row, no foot (82.55)
 that clears    (54.95)                  or 4+foot (173.75)
                └ and 256 > the 131.89 left gutter, so NO height clears the desk board
```

**C — the ground the last line stands on (phone, N=16).**

```
 ┌ 256 ───────────────────────────────────┐  y 44
 │ 15 other players            5.21 : 1   │  <- paper
 │ │ crucial-chameleon  you    14.65 : 1  │
 │ │ shiny-duck                            │
 │ │ colorful-wasp         ░░ the wordmark ░░ begins ~ y 190
 │ │ vivid-turkey           ░░░░░░░░░░░░░░░░
 │ and 12 more    4.17 : 1  ░░ rgb(204,203,203) light / rgb(61,60,59) dark
 └─────────────────────────────────────────┘  y 217.75
   52-53% of the foot's box stands on a letter. It is the only run under AA,
   and it is the only run that is a COUNT — which is also why graphite fits it.
```

---

## 6 · Prior art (background only — the verdict is the codebase's)

- The facepile/overflow pattern is the nearest external idiom: N faces then a `+N` chip. Its
  known defect is precisely this family's §1.3 — the visible `+12` is not a usable accessible
  name on its own, and the sentence form belongs in the name rather than beside it. Several
  design systems ship the overflow chip as a non-interactive `div`, which strands the readers it
  is counting. PLR-COUNT's mark is already a `<button>` with `aria-expanded`/`aria-controls`,
  which is the right half of that lesson; the name is the half still open.
- WCAG 2.5.3 (Label in Name, Level A) is unambiguous that a control whose visible label is text
  must carry that text in its accessible name, and its exception is for symbolic glyphs, not for
  numerals standing for their own value. That makes `12` / `11 other players` a Level A row, not
  a taste row.
- Tally marks as an interface idiom: the five-bar gate is a MAGNITUDE notation — its fifth mark
  is a binding stroke across the other four, which is why it reads as a quantity and not as a
  roll of names. Pass 1 dropped it for exactly this reason and the painted bytes agreed (the
  gate fuses to one 126–128 device-px run at N=5). Nothing found externally argues the other
  way; the plain chunked upright is the correct half of the idiom for a set of people.

Sources: [Cord presence facepile](https://docs.comment.workcanvas.com/components/cord-presence-facepile) ·
[Fluent UI facepile overflow](https://github.com/microsoft/fluentui/issues/17182) ·
[W3C · Understanding SC 2.5.3](https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html) ·
[Make Things Accessible · Say what you see](https://www.makethingsaccessible.com/guides/say-what-you-see-wcag-2-5-3-label-in-name-level-a/)

---

## 7 · Risks a synthesizer should carry

1. **The graft is somebody else's diff.** `.attribution-disclosure` + the `#mark` slot +
   `headDisclosures` live in PLR-SELF's worktree. If §11 lands two families, the wrapper change
   must land ONCE and both marks must consume it; if it lands one, the chosen family inherits
   the whole graft including its `#mark`-slot warning.
2. **The desk lap is not curable inside this family.** 256 > 131.89 is structural. Anything that
   fixes it moves either the card's pose, the board's left gutter, or the anchor — all three are
   surfaces this wave has not claimed. Book it (U-10); do not quietly shrink the sheet.
3. **The 844 phone clears by 3.98 px.** Any row that grows — a taller qualifier, a second line,
   a larger `--type-small` — takes the phone into the grid without anybody deciding to.
4. **`ROWS` per regime wants a HEIGHT query, not a width one.** 390×844 and 390×664 are the same
   width and opposite answers.
5. **The attribution half cannot converge here.** 12.7° at N=3 is the palette's number, not this
   family's; 100% is unreachable inside PLR-COUNT whatever the cures.
6. **Two engines, two keyboard truths.** Escape works on chromium and not on webkit after a
   mouse press (§2.3); a peer's write does not land under `keyboard.press` in webkit, which is
   why G4's re-aim uses `fill()` (rig trap, banked in `instruments/README.md`).
7. **The foot line's ink is the cheapest AA cure and the only one that changes a rendered
   string's colour** — π asks for a DELTA crop on the register when it lands, and the font cut
   is untouched (no new codepoints, so no woff2 re-cut: `and N more` is already drawn).
8. **`@click.stop` on a sheet with no focusables** currently eats a tap that reaches neither the
   cell under it nor the dismissal. Removing it is a behaviour change on a surface the wave
   claims, so it needs a gate, not a silent deletion.
