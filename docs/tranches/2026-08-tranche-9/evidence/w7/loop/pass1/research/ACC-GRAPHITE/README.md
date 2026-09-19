# ACC-GRAPHITE — pass 1 (RESEARCH)

T9-W7 convergent design loop, family **ACC-GRAPHITE — graphite for state**.
Sections §3 the accent family · §4 the fill meter · §12 multiplayer chrome · mark M07.

Measured 2026-09-17 on HEAD `7b0610cc` plus the tree's uncommitted lane work, against this
lane's own dev server `http://127.0.0.1:4237`, **chromium and webkit, light and dark, at
1280×800 and 393×699** — eight cells for every reading below. Read-only on the product:
nothing under `web/frontend/src`, `e2e/` or `scripts/` was touched. Every arm is a stylesheet
injected with `page.addStyleTag`; no worktree, no patch, no product file.

**Recommendation: ADJUST**, on three specific points. The ring lives, and it is measurably
*more* findable achromatic than it is today — but only once its weight is stated as a ratio to
the board's own heaviest rule, which the charter's arm does not do. The meter as the charter
states it — the board's own ink at heavier pressure — **dies on its own kill condition**, at
1.05–1.15:1 over the rule it retraces, and the estate already shipped the cure. And one
premise in the charter is false on this tree: your hand is `--color-user-ink` in a room today,
so "your room ink when another hand is present" is a feature to build, not a token to retire.

---

## 0. The headline, in five numbers

| the question | HEAD | under the family | where |
|---|---|---|---|
| does playing the game add colour to the page? | yes — chromatic pixels **19,609 → 21,266 → 24,874** (rest → focused → mid-board), +27% | **no — 19,595 / 19,595 / 19,595, off-family 6.72% at all three** | §2 |
| is the ring the thickest mark on the board? | no — **0.449× the frame line at every viewport**; rank 3–49 of 81, 12–49 rivals within 10% | **yes at 22 units (1.41×)** — rank 1 of 81, **0 rivals within 10%, all 8 cells, at focus and at mid-board** | §1 |
| the ring's change-of-state contrast (WCAG 2.4.13) | 3.67 light / 3.72 dark | **14.87 light / 11.99 dark** | §1.4 |
| the fill trace over the rule it retraces | **2.92:1** light — already under the 3:1 floor | **1.05–1.15:1** — the kill fires; only FORM survives it | §4 |
| your digit vs a clue, in the visible layer | hue (blue vs black) + 4.5 against 5 units | weight and value alone — **10%** and **1.19:1** | §3 |

---

## 1. FINDABILITY — the carrier is WEIGHT, and the charter's number for it is wrong

### 1.1 The board's weight ladder, measured

`readings/substrate-chromium.json`, 1280×800. Board scale **0.636** CSS px per board-viewBox
unit; the ghost ring lives in the CELL's viewBox at **0.4893** px per unit.

| mark | units | stroke-opacity | CSS px at 1280 | **× the frame line, at every viewport** |
|---|---|---|---|---|
| frame line | 12 (board vb) | 0.95 | 7.63 | 1.000 |
| box (subgrid) line | 8 (board vb) | 0.90 | 5.09 | 0.667 |
| cell line | 5 (board vb) | 0.70 | 3.18 | 0.417 |
| the fill trace | 8 (board vb) | 0.95 | 5.09 | 0.667 |
| a given's glyph | 5 (glyph vb) | 1.00 | 5.74 | — |
| your digit's glyph | 4.5 (glyph vb) | 1.00 | 5.17 | — |
| **the selection ring** | **7 (cell vb)** | 0.90 | **3.42** | **0.449** |

The last column is the number the family turns on. `cellScale / boardScale = 0.4893 / 0.636 =
**0.7693**`, and that ratio is a property of the layout (9 cells across a 1000-unit board),
not of the viewport — so a ring of *N* cell-units weighs `N × 0.7693 / 12` of the frame line at
**every** scale. The shipped ring is **0.449× the frame line**: less than half the weight of
the board's heaviest rule, on every device. Today it carries nothing but hue. Remove the hue
and nothing is left, which is the charter's own fear, stated as a number.

Room to pay for it: the ghost svg carries 16.67 units of bleed each side (`viewBox
"-16.67 -16.67 144.44 144.44"` around a 111.11-unit rect), so up to ~33 units of stroke fits
inside the cell's own svg.

    ring units   7      12     16     18     20     22     24
    × frame   0.449  0.769  1.026  1.154  1.282  1.410  1.539

### 1.2 The instrument: thickness by distance transform, not run length

`probe/graphite-arm.probe.ts` §C. For each of the 81 cells: take the tile (cell rect dilated
6 CSS px), threshold ink at a quarter of the paper-to-graphite luminance distance, and run a
two-pass chamfer distance transform — a mark's thickness is twice the radius of the largest
disk inside it. A run length lies at a junction (where two rules cross, both runs are the
tile's whole width), and the first cut of this instrument reported 83 px for **every** cell
for exactly that reason. The numbers below are the corrected ones.

### 1.3 The reading — five arms on ONE page, ONE deal, eight cells

The app deals a random puzzle per load, so an arm measured on its own page is measured on its
own puzzle. Every arm here is a stylesheet toggled on the same page at the same game state.

Selected cell's peak thickness, its **rank among all 81**, and **rivals within 10%** — at
focus, and again at mid-board (62–67 cells filled, 0 conflicts in every run):

| arm | desk light chr | desk dark chr | desk light wk | desk dark wk | phone light chr | phone dark chr | phone light wk | phone dark wk |
|---|---|---|---|---|---|---|---|---|
| control, focus | r7 · 17 rivals | r49 · 49 | r28 · 48 | r14 · 48 | r4 · 15 | r16 · 47 | r3 · 12 | r20 · 45 |
| control, mid | r7 · 17 | r49 · 49 | r34 · 55 | r26 · 41 | r4 · 15 | r16 · 47 | r6 · 18 | r18 · 43 |
| G3 (16 units), focus | **r1 · 0** | **r1 · 0** | **r1 · 0** | **r1 · 0** | r1 · **3** | r1 · **1** | r1 · **2** | **r2** · 1 |
| G3, mid | r28 | **r1 · 0** | r1 · 11 | r1 · 2 | r1 · 3 | **r3** · 3 | r1 · 2 | **r5** · 10 |
| **G4 (22 units), focus** | **r1 · 0** | **r1 · 0** | **r1 · 0** | **r1 · 0** | **r1 · 0** | **r1 · 0** | **r1 · 0** | **r1 · 0** |
| **G4, mid** | r8 · 17 | **r1 · 0** | **r1 · 0** | **r1 · 0** | **r1 · 0** | **r1 · 0** | **r1 · 0** | **r1 · 0** |

Raw: `readings/arms-{desk,phone}-{light,dark}-{chromium,webkit}.json` →
`arms.*.findability` and `arms.*.findabilityMid`.

**The two findings.**

1. **The shipped ring has no weight signal.** Its rank runs from 3rd to 49th of 81 depending on
   where the selection lands, with **12 to 49 cells within 10% of it** in every one of the eight
   readings. In the worst cell (desk dark chromium) it is the 49th thickest mark on its own
   board with 49 rivals. The second feature says the same thing more quietly: ranked by ink
   mass among the empty cells the shipped ring wins seven of eight, but by margins of
   **1.03× to 1.34×** — and loses one outright (phone dark chromium, rank 2, margin 0.994×).
   A 3% lead over an ordinary empty cell is not a signal. Under G4 the same margins are
   **1.70× to 3.71×**, rank 1 in all eight.
2. **16 units is a tie, 22 units is a win.** The charter's "heavier stroke" left unquantified
   lands on 16 units, which is **1.026× the frame line** — a tie by rounding, and the phone
   readings show it: rank 2 in one cell, and rank 3 and 5 at mid-board where the board's
   corners stack ink. At **22 units = 1.41×** the ring is rank 1 with **zero rivals within
   10%** in all eight cells at focus, and in seven of eight at mid-board. The one exception
   (desk light chromium, mid, rank 8) is the cell where 64 digits are on the board and the
   tile's own digit joins the count — the honest caveat, not a pass.

This is a proxy and is named as one: pop-out in visual search requires the target to hold a
unique value on a single feature dimension, and thickness is measured here as that dimension.
**The blind five-second read is the owner's and this lane does not claim it.** Four crops are
banked for it — `frames/ring-{control,G4}-desk-{light,dark}-chromium.png`, 244×244 px, the
same selected cell and its eight neighbours, control against arm, light and dark.

### 1.3b What the crops say that the numbers do not

Two observations from looking at the banked frames, recorded because a rank of 1 with zero
rivals is a number and not a judgement.

**The 22-unit ring reads as a printed block, not a pencil mark.**
`frames/ring-G4-desk-light-chromium.png` against `frames/ring-control-desk-light-chromium.png`:
10.76 CSS px of graphite on a 70.66 px cell leaves a small pale square inside a heavy dark
band, and the eye reads a filled tile rather than a ring somebody drew. It also inherits R3's
finding that the ring is the only CAD-precise mark on a hand-drawn board (ring σ 0.00 px
against grid σ 2.5 px), and weight makes that precision louder. **The weight that wins the
findability number costs the house hand**, and the synthesis has to buy the weight in a form
that is still a pencil: two thinner strokes at a wide offset (the `scribbleUnderline` retrace
the estate already owns) rather than one fat one, or a hatch, or the wobble the §5 families
are designing anyway. This lane prototyped the crude version on purpose — it is the version
that isolates weight — and says plainly that the crude version is not the answer.

**The offset alone does not make the meter a gauge.**
`frames/meter-G4-desk-light-chromium.png` against `frames/meter-control-desk-light-chromium.png`:
the violet stripe is unmistakably a second object sitting above the frame; the graphite one,
even offset inward by a stroke width, reads as **a slightly thicker frame edge**. The 1.15:1
number and the picture agree. The offset is necessary — without it the two fuse completely —
but it is not sufficient. **The meter needs a form no rule on this board has**: a dash, a tick
series, or a figure that is not a retrace at all. §4.4 lists what that costs.

### 1.4 The ring's ratios, off the painted bytes

Measured by DIFFERENCE: a mark's footprint is the set of pixels that change when the mark is
hidden; its ink is what those pixels read with the mark shown, its ground what the SAME pixels
read with it hidden. That is both the 1.4.11 reading and, at the same pixels, WCAG 2.2 SC
2.4.13's change-of-state reading.

| arm | light, ink | over `--color-card` | dark, ink | over `--color-card` |
|---|---|---|---|---|
| control | `rgb(76,135,201)` | **3.67** | `rgb(54,113,180)` | **3.72** |
| G1–G4 | `rgb(38,38,38)` | **14.87** | `rgb(209,207,199)` | **11.99** |

Identical in both engines and both viewports. The control re-derives the ledger (`index.css:219`
books 3.60; r0 measured 3.63 / 3.69; painted bytes here say 3.67 / 3.72). The graphite ring
clears 1.4.11 by 4× and 2.4.13's 3:1 change-of-state by 4×; footprint 3,956 px² against
2.4.13's floor of a 2 px perimeter on a 70.66 px cell (≈565 px²).

**What the family may not claim.** The ring's problem was never its hue's contrast — 3.67:1 was
already over the floor. Retiring `--color-focus-sketch` changes nothing a reader sees. The cure
is **22 units of stroke at opacity 1.0**, and the record should say that rather than let
"achromatic" take the credit.

---

## 2. THE PIXEL CENSUS — under the whole family, playing the game adds no colour at all

Re-run under r0's own band (OKLCH 40°–115°) and chroma floor (C ≥ 0.012), same method, same
viewport, all five arms toggled on one page at one game state.
`readings/arms-*.json` → `arms.*.census{Rest,Focused,Mid}`.

**Off-family share of chromatic content, rest / focused / mid-board:**

| arm | desk light chr | desk dark chr | desk light wk | desk dark wk |
|---|---|---|---|---|
| control (HEAD) | 6.79 / 14.05 / **26.52** | 12.96 / 21.13 / **31.14** | 6.94 / 11.34 / **39.99** | 13.33 / 20.46 / **62.96** |
| G1 charter-literal | 6.72 / 9.97 / 13.09 | 12.73 / 14.07 / 19.62 | 6.86 / 6.86 / 6.86 | 13.12 / 13.12 / 14.26 |
| G3 whole family | 6.72 / **6.72** / 10.06 | 12.73 / 10.57 / 15.48 | 6.86 / 6.86 / 6.86 | 13.12 / 13.12 / 19.06 |
| **G4** | 6.72 / **6.72** / **6.72** | 12.73 / 10.56 / 15.47 | 6.86 / **6.86** / **6.86** | 13.12 / 13.12 / 19.06 |

Phone (393×699): control focused/mid **29.04 / 60.36** light-chromium, **37.30 / 73.82**
dark-chromium, **27.08 / 77.89** dark-webkit; G4 **0.00 / 0.00** in three of four cells.

**And the count behind the share**, which is the cleaner statement
(`arms.*.census*.chromaticPixels`, desk light chromium, 1280×800):

    control   rest 19,609   focused 21,266   mid-board 24,874     +27%
    G4        rest 19,595   focused 19,595   mid-board 19,595      0%

    phone light chromium
    control   rest  1,806   focused  2,545   mid-board  4,556    +152%
    G4        rest  1,806   focused  1,806   mid-board  1,806      0%

**Under the whole family, touching a cell and filling 64 of them changes the number of coloured
pixels on the page by zero.** That is the family's sentence turned into an integer, and it is
the strongest result this lane has.

**Three qualifications, stated rather than smoothed.**

1. **G3/G4 is the arm that gets there, and the charter does not authorise it.** The gap between
   G1 (9.97 focused) and G3 (6.72) is one rule: the 7% `--color-crayon-blue` unit wash at
   `gameCell.css:124`. The charter's retirement list names focus-sketch, progress-ink,
   user-ink and the sparkle literals; it does not name the wash. See §7.
2. **Dark mode does not reach flat**: 10.56 focused against a 12.73 rest in chromium (below
   rest, so the target is met) but 15.47 at mid-board, and webkit-dark 19.06. The residue is
   not conflict ink — `midBoardConflicts.invalidCells` is **0** in all eight runs — and this
   lane did not isolate it. One cell (phone dark webkit) rises 972 → 1,605 chromatic px at
   mid-board under G4, 633 px = 0.23% of the viewport, unexplained. Pass 2 should bin the
   residual hues rather than inherit this sentence.
3. **Graphite never enters the count.** Measured on the live root, `--color-pencil-graphite`
   resolves to C **0.0000** light and C **0.0111** dark — under the census's own 0.012 floor.
   The dark graphite's hue is 95.2°, inside the warm band and 0.0° from dark `crayon-gold`, so
   even if the floor moved it would land in the family.

---

## 3. YOUR DIGITS — the seam exists, it is one line, and it is 10% wide

`HandwrittenGlyph.vue:82-90` is the whole of authorship in the visible layer:

    const strokeColor = computed(() => {
      if (props.isSolved) return "url(#solver-ink)";
      if (isGivenOriginal.value) return "var(--color-foreground)";
      return "var(--color-user-ink, #2563eb)";
    });
    const strokeWidth = computed(() => (props.isGiven || props.isSolved ? 5 : 4.5));

Measured on the page (`arms.*.authorship`, `glyphPainted`):

| | a clue | your entry | the difference |
|---|---|---|---|
| accessible name | `Row 1, column 1, given clue 5` | `Row 4, column 1, your entry 1` | already spoken |
| stroke, source | 5 units | 4.5 units | **10%** |
| stroke, rendered | **5.74 CSS px** | **5.17 CSS px** | 0.57 px |
| ink light, HEAD | `rgb(10,10,10)` · 19.45:1 | `rgb(37,99,235)` · 5.08:1 | hue |
| ink light, family | `rgb(10,10,10)` · 19.45:1 | `rgb(38,38,38)` · **14.87:1** | **value, 1.19:1** |
| ink dark, family | `rgb(237,236,233)` · 15.84:1 | `rgb(209,207,199)` · **11.99:1** | value, 1.19:1 |

The estate already writes a clue harder than an entry, so the family does not have to invent
the seam. But **0.57 CSS px of stroke and a 1.19:1 value step are not a legible difference**,
and the charter names this kill exactly: if the only real difference is the accessible name,
the board has lost authorship in the visible layer, which is M07's own subject.

Both tokens are already there and cost no hex — a clue is `--color-foreground` (`hsl(0 0% 3.9%)`
light) and your hand is `--grid-line-color` (`hsl(0 0% 15%)`). Pass 2 must widen the seam on
weight (the numbers say 4.5 vs 5 has to become nearer 3.5 vs 5.5) or take a second axis the
glyph layer already owns, and then measure it the way §1 measures the ring. **This lane did
not prototype the widened seam; it measured that the shipped one is 10%.**

---

## 4. THE METER — the charter's own arm kills it, and the estate already shipped the cure

### 4.1 The reading

Measured by difference over the board's top edge: the trace's ink from its own footprint, the
rule's ink from the same strip with the trace hidden, restricted to the rows the frame line
occupies. `arms.*.meter`.

**trace ink ÷ rule ink** — the one number the kill condition asks for:

| arm | desk light chr | desk dark chr | desk light wk | desk dark wk | phone light chr | phone dark chr |
|---|---|---|---|---|---|---|
| control (violet) | **2.92** | 3.56 | 2.92 | 3.56 | 2.92 | 3.57 |
| G1 `--ink-press-quiet` | 2.71 | 1.99 | 2.71 | 1.99 | 2.47 | 1.82 |
| G3/G4 graphite, offset | **1.15** | **1.10** | **1.15** | **1.09** | **1.15** | **1.08** |

and the rest of the meter's geometry, under G4:

| | control | G4 | |
|---|---|---|---|
| rendered stroke, 1280 | 5.09 px | 6.36 px | 8 → 10 units |
| rendered stroke, phone | 2.92 px | 3.65 px | |
| overhang above the board box | **6.00 px** desk / 3–4 px phone | **1.00 px** desk chr, 2.00 wk / 1.00 phone | |
| share of the trace's footprint landing ON the rule | 0.316 desk-light, 0.519 phone-light | 0.276 / 0.334 | |
| trace over the paper it now sits on | 3.76 | **14.87** light, **11.99** dark | |

**Three findings, in order of weight.**

1. **The shipped violet meter is already under the floor.** On the bytes it actually covers it
   reads **2.92:1** in light in both engines and both viewports. `index.css:267-278` books
   3.57 / 3.35 and r0 carried 3.36 / 3.46 — both are hex arithmetic against
   `--grid-line-color`, but the rule is painted at stroke-opacity 0.95 over `--color-card`,
   which is a different colour. **This correction stands whatever the wave decides about hue.**
2. **The charter's own prototype is the second kill, twice over.** `--ink-press-quiet` is 68%
   graphite — *lighter* than the frame line it retraces, not heavier — so the charter's idea
   text ("the board's own ink at a heavier pressure") and its prototype spec
   ("`--ink-press-quiet` stroke 8") are two different arms, and the prototype measures
   **1.82–2.71:1** over the rule: under 3:1 in every one of the eight cells.
3. **Full pressure is worse, and FORM is the only thing that saves it.** At
   `--color-pencil-graphite`, opacity 1, in registration, the trace *is* the rule: dark
   `rgb(209,207,199)` against `rgb(198,196,186)`, **1.08–1.10:1**. What G3/G4 add is the
   **shipped `.join-pose` offset** — `transform: scale(0.984)`, origin 50% 50%, one stroke
   width inward — which drops the share of the footprint on the rule (0.519 → 0.334 on the
   phone, 0.316 → 0.276 on the desk) and puts the rest on paper at 14.87 / 11.99:1.

### 4.2 The estate already ruled this, in its own words

`HandDrawnGrid.vue:596-612`, on the join trace, from a MUST-LOOK gate in both engines, twice:

> A second seed on the same rect is not a second ring: at a peer hue near the progress ink the
> two strokes fuse into one fringed band and the fill gauge is simply gone. … So the second
> pass is offset, which is what the estate's own retrace idiom always was (`scribbleUnderline`:
> "slightly offset retrace for pencil double-stroke", offset ~1× the stroke width). … INWARD,
> not outward, and that direction is a constraint rather than a taste: the gallery card's live
> face clips (`.live-face-slot { overflow: hidden }`).

**The graphite family proposes that exact collision at hue distance zero.** The ruling, the
direction, the ratio (`1 − 8/500 = 0.984`) and the reason for the direction are already
written down and shipped. That is the primitive the synthesis reuses, by name.

### 4.3 The overhang, and a tension nobody has named

`gridPaths.ts:338` — `FRAME_X_PAD 12`, `FRAME_Y_PAD 0`. Re-derived: the top ink band starts at
page-y 118.45 against a board box at 124.45 — **6.00 CSS px outside the box**, asymmetric with
the sides. R3 measured the same 6 px.

The tension: **that overhang is part of why the violet stripe is visible at all** — it is the
only part of the top trace not over the rule. Set `FRAME_Y_PAD` to 12 and a graphite trace sits
entirely on the frame line and disappears. The `scale(0.984)` cure fixes both at once, measured
**6.00 → 1.00 px** (chromium; 6.00 → 2.00 webkit; 3–4 → 1 on the phone), because pulling the
retrace off the rule and pulling it inside the box are the same motion. **One primitive, two
marks.**

### 4.4 What the meter still has no answer for

- **At 0% it is not rendered at all** (`HandDrawnGrid.vue:461`, `v-for … progress > 0 ? …`). A
  gauge that only exists once you have used it cannot teach itself. An empty-state tick, a
  first-run whisper and a visible label are three different designs and §4 of the wave owns
  the choice; this family has not made it.
- **A dash is not expressible on this path.** `stroke-dasharray`/`stroke-dashoffset` are the
  fill front's own mechanism (`pathLength 1000`, offset `1000·(1−p)`). A dashed gauge needs a
  second, static, fully-drawn tick path — another pre-baked pose stack, and the π-guard
  (`filterBudget` 9, exact match both directions) says filterless geometry, never a live
  filter, never a second `BoilDivider`.
- **No visible label.** The only one is `role="progressbar" aria-label="board fill"` on a 1×1
  sr-only div (`HandDrawnGrid.vue:294-307`); the only visible word "Fill" on the page belongs
  to the FILL-FORCED button, a different act.

---

## 5. THE ROOM — the charter's premise is FALSE on this tree

`readings/room-chromium.json` and `room-webkit.json`, a live two-page `?wire=local` session.
**Both engines agree to the byte.**

| state | what is bound |
|---|---|
| solo | `cellsWithInkBinding` **0**, roster rows **0**, no host binding — **byte-identical, confirmed** |
| in a room, your own roster row | `inlineInk` **empty**; swatch paints **`rgb(37,99,235)`** — the incumbent `--color-user-ink` |
| in a room, a peer's row | `inlineInk` `oklch(var(--peer-ink-l) 0.11 137.5deg)`; swatch the same |
| after the peer writes | exactly **one** cell carries a binding, and it is the peer's |

`useSession.ts:525-537` says it outright — `ink: id === selfId.value ? {} : ident!.inkFor(index)`
— with the comment *"You still keep `--color-user-ink` — nothing is bound on your cells, so
solo is byte-identical."*

**So "your digits take your room ink only when another hand is present" does not exist. Your
hand is `--color-user-ink` in a room exactly as it is solo.** The family's sentence is a
FEATURE, and it has a precise shape: the index is already minted for you (`useSession.ts:527`
— *"EVERY id takes an index, including your own"*), so the change is the condition on that one
ternary in `mint()` and its twin in `adoptInk()`, gated on the roster holding more than one
live player.

A cost the charter does not price: **the roster's swatch is the digit's own ink**
(`GameControlPanel.vue:1679-1687` — *"The swatch is the digit's own ink, not a legend for
it"*). Re-point `--color-user-ink` to graphite without adding the self-binding and, in a room,
every peer keeps a colour and **you become the one player without one** — a graphite chip in a
list of coloured ones. Measured: your swatch reads `rgb(37,99,235)` today and `rgb(38,38,38)`
under the arm.

---

## 6. THE GUARD — green by construction; the ruling is the whole change

r0 measured the armed deal guard whole (`r0/r2-accent-family/census/states-chromium.json`):
frame background `rgba(0,0,0,0)`, border-top `--color-border`, text `--color-foreground` at
Patrick Hand 18.18px, sub `--color-muted-foreground` 16.36px, and the destructive verb marked
by `background: color-mix(foreground 8%)` and nothing else. **Zero chromatic content.**

Under this family that is not a defect to cure but the ruling to write down: the guard is
already achromatic and stays so, and the verb is told by a ground, a weight and its word. The
AA arm holds on this tree — `--color-foreground` over `--color-card` measures **19.45:1**
(painted bytes, §3) and `--color-muted-foreground` is gated at **4.65 light / 7.69 dark** by
`scripts/check-ink-pressure.mjs`, run here and banked at `readings/ink-pressure.txt`.

**This lane's probe could not arm the guard in either engine** on the click path it tried
(`readings/guard-{chromium,webkit}.json` are both `null`); r0 reached it in chromium only,
never in webkit. A W7 gate on the confirm's face must reach it in both engines or declare the
holdout at row grain. Stated as a gap, not measured away.

---

## 7. RETIREMENTS — and the one the charter missed

| token | consumers at HEAD | under the family |
|---|---|---|
| `--color-focus-sketch` | **2 VAR** — `gameCell.css:246, :248` | retires; the ring reads `--color-pencil-graphite` |
| `--color-progress-ink` | **1 VAR** — `HandDrawnGrid.vue:471` | retires; the trace reads `--color-pencil-graphite` |
| `--color-user-ink` | **24 VAR across 13 files** | does NOT retire — it is REBOUND (§5); its default becomes graphite |
| the sparkle literals | `GameControlPanel.vue:2081, :2087` — reachable by no token | retire; measured gone (`kin-arm-*.json` → `sparkleLiteralGone: true`, both engines) |
| `#2563eb`, `HandwrittenGlyph.vue:85` | a `var()` fallback | retires with the default |
| **`--color-crayon-blue`** | **5 VAR + 13 CLASS** | **the one the charter does not name** |

Re-derived here by `probe/consumers.mjs` (r0's instrument, re-run, output redirected):
`readings/consumers.json`.

`--color-crayon-blue` has exactly three jobs and the family takes all three:

1. the 7% unit wash, `gameCell.css:124` (and its `prefers-contrast: more` 13% arm at `:129`);
2. the focus ring's fallback, `gameCell.css:246, :248`;
3. **your own pencil marks** — `gameCell.css:76`, `.user-marks { color: var(--color-crayon-blue) }`,
   whose comment reads *"the player's own hand — deliberately a DIFFERENT tone from the
   engine's graphite peek marks"*. Under this family your notes are your hand, so they are
   graphite — and they then collide with the engine's peek marks by the estate's own stated
   reasoning.

What is left is `.crayon-blue { color: var(--color-crayon-blue) }` at `index.css:473`, whose own
comment says *"crayon-blue is the focus wax and takes no ink tier (no text use)"* — a class with
no text use, on a wax with no job. **The family's honest statement is that it retires the fourth
crayon.** That is a bigger claim than retiring three tokens, and the wave should hear it said.
The estate has cut this exact shape three times (`--color-easy/medium/hard`, the `firm` rung,
the difficulty aliases) under its own rule that *an alias with no consumer is a third name for
a colour that already has two*.

### The kinship rows, under the arm

`readings/kin-arm-{light,dark}-{chromium,webkit}.json`. Two limits recorded rather than smoothed:

- **Row 4 (off-token literals) turns GREEN**, both engines — the sparkle's
  `rgba(196,181,253,…)` is gone, replaced by a `color-mix` on graphite.
- **Rows 1/2 turn only for `--color-user-ink`** — measured C **0.0000** light / **0.0111** dark,
  achromatic, so it *leaves* the kin test rather than passing it. `--color-focus-sketch` and
  `--color-progress-ink` still read their old hues **as tokens**, because an `addStyleTag`
  overlay re-points a RULE and cannot delete a declaration. The cure deletes both tokens; the
  overlay proves the painted marks (`painted.ringStroke` `rgb(38,38,38)`, stroke-width `16px`),
  not the token estate. **Said plainly so the next pass does not read this as a pass.**
- **Row 3 (a control's focus ring) is not this family's row.** Every control wears the Tailwind
  preflight `outline-ring/50` (`index.css:445`), already achromatic; the row moves identically
  under any §3 proposal, and its subject-count vacuity guard (webkit reaches 0 controls by Tab)
  stands untouched.
- **Row 5 (the exceptions pay their toll) stays GREEN** — the family touches neither the solver
  rainbow nor the peer walk, the two declared discriminability exceptions.

### Print and forced colours, by emulation, with the arm injected

`readings/modes-{chromium,webkit}.json`:

| | glyph stroke | grid line | ghost ring | cell outline |
|---|---|---|---|---|
| screen | `rgb(10,10,10)` + `rgb(38,38,38)` | `rgb(38,38,38)` | `rgb(38,38,38)` | `2px solid rgb(38,38,38)` |
| print | `rgb(0,0,0)` | `rgb(0,0,0)` | `rgb(0,0,0)` | `2px solid rgb(0,0,0)` |
| forced-colors | `rgb(0,0,0)` | `rgb(38,38,38)` | `rgb(38,38,38)` | chromium `rgb(0,0,0)` · webkit `rgb(38,38,38)` |

Print survives whole: `index.css:894-947` already inks `--color-user-ink` to `#000` and
`--grid-line-color` to black — the family's own argument, made by the estate years ago. The
webkit screen row carries **two** glyph strokes, `rgb(10,10,10)` and `rgb(38,38,38)`, which is
§3's authorship seam visible in one reading.

**One regression the arm exposes.** G2/G3/G4 add
`.game-cell:has(input:focus-visible) { outline: 2px solid <graphite> }`, and under forced
colours that outline out-ranks `gameCell.css:348-356`'s `outline: 2px solid Highlight` on
source order at equal specificity — so a high-contrast reader loses the **Highlight** ring and
gets ordinary text colour (chromium) or plain graphite (webkit). Any new outline on the cell
must sit above that block in the cascade or carry its own forced-colors arm. In the cure the
second stroke is a second `<path>` on the ghost's own seed, not an outline, which avoids this
entirely.

---

## 8. WHAT STAYS CHROMATIC — five jobs, and nothing else

| job | token | why it keeps colour |
|---|---|---|
| difficulty | `crayon-green` / `crayon-orange` / `crayon-rose` + their ink tiers | the puzzle's own property; kin at 0.2 / 4.5 / 0.6° |
| the machine wrote it | `--color-solver-ink-1…5` | declared exception, discriminability; pays **5.29–6.21:1** on `--color-card` |
| it is wrong | `--color-teacher-red` → `crayon-rose`, `--color-red-ink` | kin at 0° / 0.6°, AA 4.98:1 |
| it is done | `--color-gold-star` → `crayon-gold`, `--color-gold-ink` | kin at 0° / 1.3° |
| a person wrote it | the 137.5° peer walk at C 0.11 | declared exception; worst **5.36:1** over 40 indices |

Every remaining accent is a crayon, a verdict or one of the two exceptions the estate already
declared. The wheel does not grow: **zero new hexes, and three fewer.**

The sentence the family buys with all of it: **on a solo board, colour means the puzzle's
difficulty, the machine's answer, a mistake, or a finish. Colour on the BOARD means more than
one of us is here.**

---

## 9. Three sketches

### 9.1 The weight ladder — what the ring has to beat, as a ratio to the frame line

    cell rule   ▏ 0.417×
    ring TODAY  ▎ 0.449×   ← less than half the board's heaviest rule, at EVERY viewport
    box rule    ▍ 0.667×
    the trace   ▍ 0.667×
    frame line  ▋ 1.000×
    ──────────────────────────────────────────────────────────────────────
    ring @16u   ▊ 1.026×   a tie by rounding — rank 2 and rank 5 on the phone
    ring @22u   █ 1.410×   rank 1 of 81, 0 rivals within 10%, all eight cells

    (N cell-units × 0.7693 ÷ 12 = the ratio; 0.7693 = cellScale/boardScale, layout-fixed)

### 9.2 The meter: in registration it is the rule; offset, it is a gauge

    IN REGISTRATION (the charter's arm)        OFFSET scale(0.984) (the shipped join idiom)

    board box top ─┐                           board box top ─┐
                   ▼                                          ▼
     ░░░░░░░ paper ░░░░░░░                      ░░░░░ paper ░░░░░
     ███████████████████████  frame rule        ██████████████████  frame rule
     ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░  trace, fused      ░░░░░░░░░░░░░░░░░░
            1.05 – 1.15 : 1                     ▓▓▓▓▓▓▓▓▒▒▒░░░░░░░  trace, on paper
                                                      14.87 : 1  light
                                                      11.99 : 1  dark
     overhang above the box   6.00 px           overhang above the box   1.00 px
     footprint on the rule    0.316 (desk)      footprint on the rule    0.276
                              0.519 (phone)                              0.334

### 9.3 Authorship — what a reader has to see, and what is there now

                     a clue            your digit         a peer's digit
    ink (light)      #0a0a0a           graphite #262626   oklch(.5 .11 h)
    stroke units     5                 4.5                4.5
    rendered px      5.74              5.17               5.17
    the difference   ├───── 1.19 : 1 and 0.57 px ─────┤   ├─── colour ───┤
    spoken           "given clue 5"    "your entry 1"     the roster's row

    what the family needs                    what ships today
    ┌────────────┐  ┌────────────┐           ┌────────────┐  ┌────────────┐
    │   ███████  │  │   ▒▒▒▒▒    │           │   ███████  │  │   ██████   │
    │  ██     ██ │  │  ▒▒   ▒▒   │           │  ██     ██ │  │  ██    ██  │
    │       ██   │  │      ▒▒    │           │       ██   │  │      ██    │
    │  ███████   │  │  ▒▒▒▒▒▒    │           │  ███████   │  │  ██████    │
    └────────────┘  └────────────┘           └────────────┘  └────────────┘
       pressed         drawn light              5 units        4.5 units
       (a clue)        (your hand)              10% apart, and that is all

---

## 10. Primitives the synthesis can reuse, by name

| primitive | where | what it gives this family |
|---|---|---|
| `--ink-press-rule` 55% / `--ink-press-quiet` 68% | `index.css:227-266`, gated by `scripts/check-ink-pressure.mjs` in three scopes | the pressure axis, AA-gated light / dark / print, strictly increasing |
| `.join-pose { transform: scale(0.984) }` | `HandDrawnGrid.vue:596-612` | the offset retrace: its direction (inward), its ratio (one stroke width) and its ruling |
| `generateFrameTraceFrames`, `FRAME_X_PAD`/`FRAME_Y_PAD` | `gridPaths.ts:331-370` | the meter's geometry, one source shared with the frame |
| `ghost-draw-on 180ms var(--ease-ghostDraw)` | `gameCell.css:257-266` | the ring's motion; a heavier ring draws on the same beat, no new timing constant |
| `HandDrawnOutline :pose="0"` | law 37 (T8-W1 M4) | the only lawful new drawn edge — never a CSS border on chrome |
| `playerIdentity.inkFor(index)`, `--peer-ink-l` | `playerIdentity.ts:69`, `index.css:151 / :372` | the room ink: cap-free, AA-banded, worst 5.36:1 over 40 indices. §5 needs its self arm |
| print arm `--color-user-ink: #000` | `index.css:944` | the estate's own statement that your ink is graphite when it matters |
| forced-colors `outline: 2px solid Highlight` | `gameCell.css:348-356` | the HC ring the cure must not out-rank |
| the glyph's `strokeWidth` computed | `HandwrittenGlyph.vue:88-90` | §3's seam, already one line, already 5 vs 4.5 |

---

## 11. Kill conditions, answered

| the charter's kill | verdict |
|---|---|
| the ring is not findable in five seconds | **CLEARED on the measurable proxies, and only at 22 units — but the crop says the cure is not yet in the house hand (§1.3b).** Unique maximum of thickness, rank 1 of 81, 0 rivals within 10%, all eight cells at focus and seven of eight at mid-board; change-of-state contrast 14.87 / 11.99 against a 3:1 floor. At the charter's implied 16 units it is a tie (1.026× the frame line) and the phone readings show it failing to rank 1. The blind human read is the owner's and is not claimed here; four crops banked. |
| a graphite trace under 3:1 over a graphite rule | **FIRED, in every cell.** 1.82–2.71:1 on the charter's own `--ink-press-quiet` arm; 1.05–1.15:1 at full pressure. The meter cannot be the board's ink in registration. It survives only by FORM — the shipped 0.984 inward offset, which also takes the overhang 6.00 → 1.00 px — and the dashed tick it wants needs a second pose stack. |
| your digit indistinguishable from a clue in the visible layer | **AT RISK.** The seam exists but is 10% of stroke and 1.19:1 of value. Not a kill at pass 1; it is the single thing pass 2 must design and measure. |

Other risks, measured or named:

- **The wash is load-bearing and unbudgeted.** Only the arms that retire the 7% unit wash reach
  the resting figure, and that retires `--color-crayon-blue`'s last job — the fourth crayon.
- **Your own swatch goes colourless in a room** unless §5's self-binding lands in the same
  commit as the token move. One line in `useSession.ts`, but a substrate change, not a CSS one.
- **Forced colours can lose the Highlight ring** if a new cell outline out-ranks
  `gameCell.css:348-356`. Measured under the arm, both engines.
- **A 22-unit ring bleeds 10.76 CSS px on a 70.66 px cell** at 1280 (4.1 px on a 26 px phone
  cell). The ghost svg's 16.67 units of bleed hold it, but it sits closer to its neighbours'
  rules than anything on the board does today. Pass 2 should measure the ring's clearance to
  the adjacent rule, in px, at 393×699.
- **The dark-mode census does not reach flat** (15.47 / 19.06 at mid-board) and the residue is
  not conflict ink (0 invalid cells in all eight runs). Unbinned; pass 2 should bin it.
- **`--color-progress-ink` dark `#7c3aed` is byte-identical to light `--color-solver-ink-2`**
  (R6 §3.3): retiring it removes a collision as well as a hue.
- **The estate's own ledger for the meter is wrong** — 3.57 / 3.35 booked, 2.92 measured over
  the rule. That has to be re-cut whatever the wave decides.

---

## 12. How to replay this

    # this lane's dev server
    cd web/frontend && npx vite --host 127.0.0.1 --port 4237 --strictPort

    # the probes resolve @playwright/test from web/frontend/node_modules, so they were run from
    # a scratchpad copy with that directory symlinked (r0's own precedent). No product file and
    # no package.json was touched; the sources banked here are the record.
    VP=desk  npx playwright test --config probe/pw.config.ts -g "the arms on one deal"
    VP=phone npx playwright test --config probe/pw.config.ts -g "the arms on one deal"
    npx playwright test --config probe/pw.config.ts probe/family-rows.probe.ts

Arms, replayable with `addStyleTag` against any build:

    proto/G1-charter-literal.css   the charter's literal prototype
    proto/G2-form-carried.css      + the offset retrace and the doubled ring
    proto/G3-whole-family.css      + the selection wash retired
    proto/G4-ratio-weight.css      G3 with the ring at 22 units (1.41× the frame line)

`probe/hue-census.probe.ts`, `probe/accent-kinship.probe.ts`, `probe/consumers.mjs` and
`probe/digest.mjs` are r0's instruments, re-run unchanged except for their output directory
(one string), so this lane never overwrites another lane's banked census.

**One provenance note, stated because it is the kind of thing a record must not swallow.**
r0's probes carry an ABSOLUTE `OUT` path into r0's own census directory. One full-suite run in
this lane (16:50–16:51, before the redirect above was applied) therefore re-ran them and wrote
into `r0/r2-accent-family/census/`: six chromium files have new mtimes. Checked immediately
after: `git diff HEAD -- docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` is **empty** —
the re-run reproduced r0's banked bytes exactly, so nothing was lost and r0's readings are
re-derived rather than disturbed. The copies under `probe/` here now point at this lane's own
`readings/`, so it cannot recur.

**And one hazard of the shared tree, for the next lane.** At 16:59 another lane rebuilt
`csp-solver/wasm/pkg`, and this lane's dev server started returning
`Failed to resolve import "@mkbabb/csp-solver-wasm"` on every load; five probe rows failed with
a 30 s boot timeout and no other symptom. The cure is to restart vite, not to debug the probe.
Any W7 lane sharing :4230-4249 with a wasm build should expect it.

Frames (eight, 660 KB for the whole lane, each frame ≤ 15 KB):
`frames/ring-{control,G4}-desk-{light,dark}-chromium.png` (244×244) — the selected cell and its
eight neighbours, for the owner's five-second read; and
`frames/meter-{control,G4}-desk-{light,dark}-chromium.png` (300×44) — the board's top edge,
where the overhang and the offset are both visible.

---

## 13. Recommendation

**ADJUST**, and the adjustment is specific.

Keep the family's centre. Colour means who or what made this mark; every UI state is graphite
on the ink-press ramp. The census says it works, and says it as an integer: under the whole
family, focusing a cell and filling sixty-four of them changes the number of coloured pixels on
the page **by zero**, against +27% on the desk and +152% on the phone today. Three tokens and
two inline literals retire, the wheel loses three hexes and gains none, and the selection ring
becomes the single most distinctive mark on the board instead of the 49th-thickest one.

Three things must change before this is a spec.

1. **State the ring's weight as a ratio, not a number.** The shipped ring is 0.449× the frame
   line; the charter's "heavier stroke" lands on 16 units, which is 1.026× — a tie, and the
   phone readings show it losing rank at mid-board. **22 units = 1.41×** is rank 1 with zero
   rivals in all eight cells, at ink-mass margins of 1.70–3.71× against the shipped 0.99–1.34×. Write the law as *the selection ring is the heaviest mark on the
   board by at least 40%*, and gate it that way, so it survives a change to the board's own
   line weights.
2. **The meter is not "the board's ink at heavier pressure."** That arm measures 1.05–1.15:1
   over the rule and it is dead. The offset is necessary — the board's ink **offset inward by
   one stroke width**, the estate's own shipped retrace idiom with its ruling and its
   direction constraint, which clears the rule, fixes the `FRAME_Y_PAD` overhang in the same
   motion (6.00 → 1.00 px), and leaves the gauge at 14.87:1 against the paper it now sits on.
   **It is not sufficient**: the crop shows an offset graphite retrace reading as a thicker
   frame edge, not as a gauge. The meter needs a form the board's rules do not have — a dash,
   a tick series, or a figure that is not a retrace — and then a separate decision about what
   shows at 0% and what names it. The family has no answer for either yet.
3. **`--color-user-ink` is a feature, not a retirement.** A room binds only peers today. The
   sentence "colour on the board means more than one of us is here" needs one new condition in
   `useSession.ts:mint()` and its twin in `adoptInk()`, landed in the same commit as the token
   move — or you become the only player in the room without a colour.

And one thing pass 1 could not do and pass 2 must: widen the authorship seam. 4.5 against 5
units is 10%, and 10% is not a difference a reader can use.
