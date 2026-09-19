# MRK-WASH · pass 1 (RESEARCH) — THE WASH

T9-W7 §5 (the wobble law) · §6 (focus rings). Lane port 127.0.0.1:4240, `npx vite --host
127.0.0.1 --port 4240 --strictPort`. Chromium + WebKit, light + dark, 1280×800 and 393×699
dpr3. No product file was edited; every prototype is an `addStyleTag` overlay banked under
`proto/`. Numbers are re-derived on THIS tree; where a census figure moved, the row says so.

**Recommendation: ADJUST.** The grammar survives and is worth keeping. The claim that a wash
can replace the line does not: on painted pixels a translucent fill needs α ≈ 0.78 to reach
1.4.11's 3:1, and the digit in that cell drops under 4.5:1 at α ≈ 0.10 (light) / 0.30 (dark).
The two windows never meet, in either theme, in either engine. The same arithmetic kills the
chrome wax ground outright: a 6% graphite ground already takes 14 of 17 control labels under
4.5:1 while measuring 1.12:1 as an indicator. What survives, measured and cheap, is a wash
with a **wax rim on the same path** — `paint-order: stroke`, fill over stroke, one node, zero
filters — which reads 3.97 / 3.99 / 3.97 / 4.00 four-for-four, above HEAD's own ring, on a
body light enough to leave the digit at 4.3:1. The family then has to say out loud that its
third term is not "no line" but "a thinner line the wash sits on".

---

## 1. Substrate verified on this tree (file:line)

| claim | where | reading |
|---|---|---|
| the unit wash is a CSS box, 7% crayon-blue | `src/games/shared/gameCell.css:123-125` | confirmed; **the census cites `:132` — the rule is at `:123-125` on this tree** |
| the peer cursor is a RING, lighter than yours | `gameCell.css:229-240` | confirmed: stroke 4 / 0.55, fill 0.04, `stroke-dasharray: 1`, `ghost-draw-on 180ms backwards` |
| tier 2 is the focus ring | `gameCell.css:245-258` | `#3a7bc4`, stroke 7, 0.9, fill 0.08 |
| forced-colors keeps a real outline | `gameCell.css:352-357` | confirmed, and it SURVIVES the overlay (§6.4) |
| the ghost path is one node per cell | `DigitCell.vue:410-423` | 16 / 81 / 256 paths; `filter: none` at every size |
| the peer wash div | `DigitCell.vue:261-265` | `v-if="isPeer"`, `aria-hidden` |
| the seed | `gridPaths.ts:42-70` `generateCellRects` | `wobbleRect(roughness 0.4, segments 4 — 2 at ≥16, seed 42+500+pos*7, jagged)` |
| the hover fill | `GameControlPanel.vue:1965-1968` | `--color-accent` over `--color-card` |

**A fourth ground the charter does not name.** `gameCell.css:139-155` `.cell-because` is a
15% teacher-red laminate with a `box-shadow: inset 0 0 0 2px` rim at 50%, mounted by its own
`v-if` (`DigitCell.vue:272-276`). It is independent of `.cell-peer` and of
`.is-peer-cursor`, so the deepest stack this board can build is **unit + laminate + peer
cursor**, with your own selection making a fourth on a cell you focus. Two of those
combinations were observed live (§4).

**The focused cell is excluded from its own unit wash.** Measured, not inferred:
`peerWashes` = 7 / 20 / 39 at 4×4 / 9×9 / 16×16 (`logs/budget-*.json`), which is row+col+box
minus self at each size, and `focusedIsUnit: false` on every arm of `logs/peer-stack.json`.
So "three grounds on one cell" is never selection + unit; it is unit + laminate + peer.

**The hover fill, re-derived.** `--color-accent` hsl(48 8% 96.1%) = rgb(246,246,244), L\*
96.84; `--color-card` hsl(48 12% 99%) = rgb(253,253,252), L\* 99.28. The step is **2.45 L\*
points, 1.063:1** — the charter's "2.9-point" figure is close but not this tree's. It is
below the ~3-point step the unit wash itself makes, so the statement "the hover fill is
invisible" holds at a smaller number than claimed.

---

## 2. Instruments re-run at HEAD (before rows)

Copied verbatim from `r0/r3-marks/probe/` into `probe/` and pointed at :4240; only the
config's port changed.

| row | reading at HEAD, this tree | vs round zero |
|---|---|---|
| **R3-a** wobble | ring σ **0.092px**, grid σ 1.443px, band [0.722, 2.886] — **RED, both engines** | unmoved |
| **R3-a2** length law | 4×4 7.5 · 9×9 15.7 · 16×16 8.2 | unmoved |
| **R3-h** π-guard | filter census **9** light, ghost `filter: none`, ghostPaths 16/81/256 | unmoved in LIGHT; see §6.5 |
| **R3-e** deck ring | reach 6px, air 9.6/713.6/24/24, headroom **3.6px**, one owner, both engines | unmoved |
| **R3-f** focus contrast | ring 3.63 · logo-trigger 2.70 · deck card 2.70 · toggle/tab 18.99 | unmoved (webkit returns one row — its Tab does not stop on buttons) |
| **R3-j** click | tier 2 paints on click, click-then-move, and key — the modality gate is fiction | unmoved |
| **R3-i** phone | tier 2 on tap; scale 0.365 | unmoved |

`logs/` holds all of them. R3-a is the born-RED row this family was asked to move.

---

## 3. THE WASH'S CONTRAST — the two windows never meet

Method: `probe/wash.mjs`, `probe/rim.mjs`, `probe/delta.mjs`. Every number is decoded from a
PNG screenshot (sharp, raw RGB), median of an inset box; the mark is isolated the way the
standard frames it, as a change of state on the same pixels (focus parked off the board →
ON), with the moved set ranked by |ΔL\*| so a graphite grid rule can never be mistaken for the
mark. ΔL\* is banked beside every ratio because "separable at a glance" is a JND question, not
a ratio question.

### 3.1 The body

Selection wash vs an unwashed neighbour, fill-only, both engines agreeing to the hundredth
(`logs/wash-*.json`, `logs/rim-windows.json`):

| α | light: wash vs paper | ΔL\* | dark: wash vs paper | digit through it (light / dark) |
|---|---|---|---|---|
| 0.08 (HEAD's own fill) | 1.10 | −3.70 | 1.08 | **4.58** / **6.56** |
| 0.12 | 1.16 | −5.91 | 1.13 | 4.30 / 5.94 |
| 0.20 | 1.28 | −9.61 | 1.24 | 3.85 / 5.39 |
| 0.28 | 1.42 | −13.33 | 1.37 | 3.47 / **4.63** |
| 0.40 | 1.68 | −19.0 | 1.65 | 2.88 / 3.61 |
| 0.70 | 2.64 | — | 2.69 | 1.73 / 1.88 |
| **0.80** | **3.08** | — | **3.16** | **1.45 / 1.52** |

- **3:1 arrives at α ≈ 0.78–0.80.** Both themes, both engines.
- **4.5:1 for the digit is lost at α ≈ 0.10 (light) and α ≈ 0.30 (dark).**
- `washReaches3AtAlpha: 0.8` and `digitHolds45UntilAlpha: 0.08`, `overlap: false`, in all four
  cells (`logs/rim-windows.json`). **There is no alpha where a wash is both the indicator and
  a ground you can write on.** That is the family's central claim, refuted on its own terms.

### 3.2 Separable from the 7% unit wash?

By ratio, never: the unit wash is itself only **1.02:1** against paper, so "3:1 between two
washes" is unreachable by construction. By ΔL\*, yes and cheaply: the unit wash is **3.01 L\***
points off the paper in light (5.0 in dark), and the selection wash passes it at α ≈ 0.10 and
is **6.6 points clear at α 0.20** (9.61 vs 3.01). So the family's own kill condition — "not
separable at a glance" — is **cleared**, but only once you stop asking a wash to answer a
contrast ratio. The charter's literal test (3:1 against the unit wash) is unpassable and
should be restated as a ΔL\* floor.

### 3.3 The wax rim is what carries 1.4.11

`paint-order: stroke` on the same path: the fill covers the inner half of the stroke, so only
the outer half shows — a crayon that pressed harder where the hand turned. One node, no new
filter, the same seed (`proto/wash-board.css`). Measured by difference, ranked by |ΔL\*|
(`logs/delta-mark.json`):

| arm | chromium light | chromium dark | webkit light | webkit dark | digit |
|---|---|---|---|---|---|
| CONTROL (HEAD's 7px ring) | 3.68 | 3.76 | 3.69 | 3.76 | 4.58 / 6.56 |
| fill only, α 0.08…0.40 | 1.10…1.68 | 1.08…1.65 | 1.10…1.68 | 1.08…1.65 | falls with α |
| fill 0.12 + **rim 2 @ 0.95** | 3.52 | 3.41 | 3.58 | 3.70 | 4.30 |
| fill 0.12 + **rim 3 @ 0.95** | **3.97** | **3.99** | **3.97** | **4.00** | **4.30** |
| fill 0.18 + rim 4 @ 0.92 | 3.86 | 3.83 | 3.86 | 3.83 | 3.97 |
| fill 0.18 + rim 7 @ 0.90 | 3.73 | 3.77 | 3.77 | 3.81 | 3.97 |

Three things fall out:

1. **The rim's ratio is set by its OPACITY, not its width** (rim 3 @ 0.95 beats rim 7 @ 0.90).
   The width buys mass and presence; the opacity buys the floor. A synthesizer can pick them
   separately.
2. At 9×9 the board's scale is 0.636 CSS px per viewBox unit, so a 3-unit rim is **1.91 px of
   stroke, ~0.95 px of it outside the body** — a hairline, not a ring. HEAD's 7-unit ring is
   4.45px. The family's refusal of "a 7px ring" survives; its refusal of "a line" does not.
3. The fill-only arms report `edge == body` exactly. **A wash has no edge — that is measured,
   not asserted, and it is precisely why it cannot carry the standard.**

### 3.4 The area, for the record

The mark covers 97–113% of the cell at every arm (`logs/delta-mark.json`, `coverage`), so
2.4.13's area test is not what fails here; the contrast is.

---

## 4. THREE GROUNDS ON ONE CELL

`probe/peer.mjs`, two pages in one context on `?wire=local` (a `BroadcastChannel` is
origin-scoped within a context — `e2e/access.spec.ts:372`). Page B parks a cursor on cell 40;
page A focuses cell 36, so the peer's cell is inside A's unit.

Measured stack, all four engine×theme cells (`logs/peer-stack.json`):

- `peerCursorCells: [40]`, `unitCells: 20`, **`peerAlsoUnit: true`** — a peer's cell inside
  your unit carries two grounds TODAY, at HEAD, before this family adds anything.
- `becauseCells` is 1 cell per hint on these deals, and `twoGround` (unit + laminate) was
  observed live in chromium-light (`[0]`).
- unit + laminate + peer-cursor did not co-occur on four deals. Nothing in the code prevents
  it: the three are independent bindings (`DigitCell.vue:262`, `:273`, `:211`). Treat it as
  rare, not impossible.

Composited ratios against a neutral cell (chromium light / dark):

| cell | HEAD | wash α 0.18 | wash α 0.12 + rim 3 | + peer wash 0.16 |
|---|---|---|---|---|
| unit only | 1.08 / 1.10 | 1.08 / 1.10 | 1.08 / 1.10 | 1.08 / 1.10 |
| unit + laminate | 1.33 / — | 1.33 | 1.33 | 1.33 |
| **peer cursor + unit** | 1.14 / 1.17 | 1.26 / 1.42 | 1.24 / 1.34 | **1.34 / 1.55** |
| **your selection** | 1.10 / 1.08 | 1.25 / 1.21 | 1.16 / 1.13 | **1.16 / 1.13** |

**The decided ranking inverts.** T8-W3's law is that a peer presses less hard than you do
(`gameCell.css:199-224`). Under the prototype, a peer's cell that also carries your unit wash
reads **1.34** where your own selected cell reads **1.16** in light, and **1.55 against 1.13**
in dark. The peer out-reads you on your own board, because the unit wash adds to the peer's
wash and never to yours (you are excluded from your own unit). This is the STATE RULE the
family owes, and it is not a preference — it is forced:

> **Either** the unit wash is suppressed on a cell that carries a peer mark, **or** the peer
> wash's alpha is cut until `peer + unit < yours` at every theme. On these numbers the second
> needs the peer wash at ≈ 0.06 in light and ≈ 0.04 in dark, which is below the unit wash's
> own step and therefore invisible. **The exclusive rule is the only one that survives.**

The family is therefore a state rule, stated: **washes are EXCLUSIVE by rank — selection
beats peer beats laminate beats unit — and a cell paints exactly one.** That also retires the
"composite the whole stack" question rather than answering it.

**Crops.** `frames/wash-stack-light-chromium.png` and `frames/wash-stack-dark-chromium.png`
(330×210, 13 KB each): the selected cell at α 0.12 + rim 3, its unit, the peer's cell one
square along, a neutral neighbour. The light crop is where the rank inversion is visible to
the eye as well as to the meter.

---

## 5. CHROME FOCUS — the wax ground fails harder than the board wash

`probe/ground.mjs` (painted pixels) and `probe/access23.mjs` (the gate's own computed-style
method, `e2e/access.spec.ts:440-511`, copied). Seven subjects; **5 of 7 reached in light, 6 of
7 in dark** — over the three-subject guard.

### 5.1 Findable vs readable, light, graphite ground

| α | the ground's own ratio | worst control label (gate method) | labels under 4.5:1 |
|---|---|---|---|
| HEAD | — | **4.66** | 0 / 17 |
| 6% | 1.12 | **4.16** | **14 / 17** |
| 14% | 1.32 | 3.55 | 14 / 17 |
| 24% | 1.63 | 2.88 | 14 / 17 |
| 40% | 2.34 | 1.97 | 14 / 17 |

**At the smallest alpha tried the gate's floor is already broken, and at the largest the
indicator is still under 3:1.** Crayon-blue is worse as an indicator (1.53 at 40%). Dark is
kinder to some labels and crueller to others: `icon-btn` text rises 3.38 → 5.13 while
`info-btn` falls 2.59 → 1.83 and `attribution-trigger` 3.00 → 1.74, because a darkening
ground helps light ink and hurts dark ink in the same sweep.

### 5.2 The one door that is open: invert the label

`proto/wax-ground-invert.css` — the ground goes heavy and the label flips to `--color-card`,
so the control reads as a word cut out of wax. Then findable and readable are the SAME number
(the label is the paper's colour), and they stop fighting. By pixels (`phone.mjs`, arm A):

| α | light find = text | dark find = text |
|---|---|---|
| 40% | 1.85 / 1.79 | 2.11 / 2.05 |
| 55% | 2.39 / 2.31 | 2.89 / 2.80 |
| 65% | 2.91 / 2.76 | **3.57 / 3.45** |
| 75% | **3.58 / 3.35** | 4.36 / 4.17 |
| 85% | 4.46 / 4.10 | 5.28 / 5.01 |

(chromium / webkit; the box includes the icon glyph, so these are conservative.) The crossing
is ≈ 70% light, ≈ 60% dark. **This is the only §6 shape in this family that clears both floors,
and it is no longer a "ground" in the wash sense — it is a solid wax block.** Pass 2 should
price it against the house's own register before proposing it.

### 5.3 Two of seven controls have no box to ground

`drawer-tab` and `sun-moon-toggle` never moved (ΔL\* 0.00 at every alpha). The tongue paints
its own `--color-card` body behind a `HandDrawnOutline`, and the toggle is bare SVG with no
box at all. **A ground law cannot cover a control that is not a box** — which is exactly two
of the six bespoke rects the section set out to retire.

### 5.4 R3-e WHOLE — a ground has no reach, with a measurement trap

Under the overlay the subjects compute `outline-style: none`, so nothing paints outside the
border box and the deck's **3.6px of headroom stops being a constraint**. TRAP, measured:
Chromium still reports `outline-width: 3px` on an element whose `outline-style` is `none`, so
a probe that computes `outlineOffset + outlineWidth` reads a reach of 3px for an outline that
does not exist. Read the STYLE, not the width.

### 5.5 Two ways this cure would have been invisible to the gate that should catch it

1. **`access.spec.ts` 2.3 never focuses anything.** It samples `.icon-sublabel` and `.ctrl-btn`
   at rest, so a background that only paints on `:focus-visible` is outside what it
   composites. Measured: HEAD-at-rest and HEAD-focused both read 4.66, and the 6% ground only
   appears once the probe focuses each subject in turn.
2. **A ground that fades in is invisible to a computed-style read taken inside its own
   transition.** `.ctrl-btn` carries `transition-colors duration-150`
   (`OptionSelector.vue:52`). Measured on the same element in the same frame:
   `getComputedStyle().backgroundColor` returns `oklab(0 0 0 / 0)` — transparent — while the
   painted pixel is `[167, 167, 166]`. Any focus-ground gate must settle the transition first;
   this lane waits 400ms.

---

## 6. BUDGET, MODALITY, THE TREE, AND THE WOBBLE LAW

### 6.1 π holds for this family

Under the overlay, at 9×9: `liveFilterTotal` **9** (light), `ghostPaths` **81**, `ghostSvgs`
**81**, `cells` 81, ghost `filter: none`. **No new node per cell, no new filter, no growth in
`FILTER_BUDGET_UNION_AREA`** — the prototype is a repaint of one existing path.

### 6.2 …but the census is not 9 in the dark, and that is not this family's doing

`probe/budget-dark.mjs`, no overlay injected, both engines, settled 2.5s:

```
chromium light  9    webkit light  9
chromium dark  11    webkit dark  11
```

The two extra rows are `svg.crayon-heart.idle` carrying `saturate(0.85)` from
`CrayonHeart.vue:315-318` (`.crayon-heart:not(.celebration):is(.dark *)`). `filterBudget.ts:143`
allowlists `svg.crayon-heart g` at count 2 — the `g`, not the `svg`. The gate
(`e2e/filter-census.spec.ts`) never emulates a colour scheme, so it runs light only and cannot
see this. R6's law 9 says "both regimes"; **on this tree the law is false in dark, by two**.
It is a `saturate()` shorthand, not a reference filter, so the cost is likely benign — but the
count is wrong and the gate is blind to it. Handed to the wave, not claimed by this lane.

### 6.3 Modality — one mark for every pointer, unchanged

`probe/phone.mjs` at 393×699 dpr3. Under the wash, TAP and mouse CLICK both paint the
selection mark (stroke 3px / 0.95, fill 0.12), exactly as HEAD paints tier 2 on both
(`tapFocusVisible: 1`). **The family neither fixes nor worsens the modality fiction**
(`gameCell.css:243`'s comment is still wrong). R3-j and R3-i re-read green at HEAD and their
readings are unmoved by the overlay.

### 6.4 Forced colors

With the overlay live and `forcedColors: active`, the focused cell still computes
`2px solid <Highlight>` at `outline-offset: -2px` in both engines
(`rgba(5,0,73,0.8)` chromium, `rgba(128,188,254,0.6)` webkit). `gameCell.css:352-357` is
untouched by a paint change and **the real outline stays**.

### 6.5 `a11y.spec.ts:536`

The gate's own census (`getByRole('img')` total vs named) reads **0 / 0 / 0 unnamed** at
CONTROL and **0 / 0 / 0** under the wash. The wash changes paint, never nodes; the per-cell
svgs stay `aria-hidden`. Green either way.

### 6.6 R3-a's LAW, not its reading

σ is **0.065px** on the phone at CONTROL and **0.065px** under the wash — identical, because
the geometry is the same `wobbleRect` path and only its paint changed. The reading does not
move and cannot: **this family does not answer §5's wobble row at the level of σ.** What it
does is change the question. The grid's rules and the board's frame are STROKES, and σ asks
how straight a stroke is. A wash is a FILL; it has no edge to be straight, so the ring's
"7.9× below the floor" stops being a defect and becomes undefined — which is a legitimate
answer to §5 only if the wave accepts that the selection mark leaves the stroke family
altogether. The wax rim brought back by §3.3 puts it straight back in, with a 1.91-unit edge
whose σ would be lower still than the 7-unit ring's. **Stated plainly: this family, taken with
its own rim, makes R3-a WORSE, not better** — a shorter edge under the same
`maxDisplace = roughness × len × 0.015` law wanders less.

### 6.7 The fill-in, and the frames

The 180ms `ghost-draw-on` becomes `wash-fill-in` on the same duration, the same
`--ease-ghostDraw`, `backwards`, with the end state equal to the cascade (house law, R6 §2
motion 6). rAF trace at 393×699 dpr3 across 14 arrow presses:

| engine | arm | frames | median | p95 | >33ms | max |
|---|---|---|---|---|---|---|
| chromium | CONTROL | 189 | 8.30 | 10.10 | 0 | 10.20 |
| chromium | wash | 188 | 8.30 | 10.10 | 0 | 10.40 |
| webkit | CONTROL | 93 | 17.00 | 19.00 | 0 | 19.00 |
| webkit | wash | 92 | 17.00 | 19.00 | **1** | **34.00** |

One 34.0ms frame in 92 under the wash against zero in 93 at control. One sample is not a
trend; pass 2 repeats it before anyone calls it a cost. Whether a fill-in on every arrow press
reads as motion is not a number this lane can produce — it goes to the owner's eye (U-10).

---

## 7. Kill conditions

| condition | verdict |
|---|---|
| selection and unit wash not separable at a glance | **CLEARED** by ΔL\* (9.61 vs 3.01 at α 0.20), **NOT** by ratio (1.19 vs 3:1) |
| three overlapping translucent grounds on one cell | **MET as a state rule.** The exclusive rule is forced by the rank inversion (§4); the family IS a state rule and says so |
| the composite failing chip-text contrast | **MET, decisively.** 6% ground → 14 of 17 labels under 4.5:1 while the indicator reads 1.12:1 |
| your wash and a peer's colliding when the accent law retires your blue | **STANDING.** Both marks are the same material at the same alpha band; hue is the only separator, and §3's accent family owns that hue. If `--color-user-ink` and `--color-focus-sketch` (9.6° apart in OKLCH, per R6 §3.3) collapse to one, wash-vs-wash becomes wash-vs-wash at ΔL\* ≈ 0. **This family cannot be adopted before §3 rules on the accent.** |
| the wash carries 1.4.11 by itself | **FAILED.** No alpha satisfies both floors, four-for-four |

---

## 8. What a synthesizer can take

1. **The three-term grammar, kept and corrected.** wash = where a hand is · ring = where an eye
   is · line = structure — with the correction that a wash needs a rim and the rim is a
   hairline (1.91 units, ~0.95 CSS px outside the body), not a ring. Call the third term
   "edge", and the grammar holds.
2. **`paint-order: stroke` on `.cell-ghost-path`**, fill 0.12, stroke 3 @ 0.95. One node, no
   filter, same seed, 3.97–4.00 on 1.4.11 in every cell, digit 4.30. This is the concrete spec.
3. **The exclusivity rule**, stated as rank: selection > peer > laminate > unit, one ground per
   cell. It is forced by the measured rank inversion, not chosen.
4. **`wash-fill-in`** on the existing 180ms / `--ease-ghostDraw` / `backwards` seam.
5. **Do not take the chrome wax ground.** If §6 wants a ground, it must be the inverted block
   (≈70% light / ≈60% dark with a `--color-card` label), and that is a different proposal
   wearing this one's name.
6. **Two controls have no box** (the tongue, the celestial toggle) — any §6 law needs a second
   form for them.
7. Two banked-for-the-wave findings this lane turned up on the way: the **dark-mode filter
   census is 11** (`CrayonHeart.vue:315`), and **`access.spec.ts` 2.3 cannot see a focus
   ground** (never focuses; and a computed read inside a 150ms transition returns transparent).

---

## Files

- `probe/lib.mjs` — painted-byte sampler (sharp), L\*, the cell census
- `probe/wash.mjs` — W1: the alpha sweep, the digit, budget-under-overlay, forced colors
- `probe/rim.mjs` — W1b: the two windows, fine sweep, ΔL\*
- `probe/delta.mjs` — W1c: the mark isolated by state difference, body vs edge
- `probe/ground.mjs` — W4: the chrome ground by pixels, seven subjects, two inks, seven alphas
- `probe/access23.mjs` — W4b: the gate's own method, focused, settled
- `probe/invert.mjs` — the inverted arm through the gate's method
- `probe/peer.mjs` — W2/W3: `?wire=local`, the stack, the crops
- `probe/phone.mjs` — W5–W8: inverted ground by pixels, the phone, modality, the tree, σ, frames
- `probe/budget-dark.mjs` — the π-guard in both regimes, no overlay
- `probe/*.probe.ts` + `probe/pw.config.ts` — the r0 instruments, re-run unchanged at :4240
- `proto/wash-board.css`, `proto/wax-ground.css`, `proto/wax-ground-invert.css` — the overlays
- `logs/*.json` — the r0 instruments' own readings land here unzipped; this lane's larger
  readings are `.json.gz` to stay inside the wave's 2 MB bucket (whole lane: 412 KB), and the
  four biggest carry a `-digest.json` beside them with the rows the record quotes
- `frames/wash-stack-{light,dark}-chromium.png` — 330×210, cited in §4

To re-run: `ln -s web/frontend/node_modules probe/node_modules`, start vite on :4240, then
`node probe/<name>.mjs` from `probe/`.

---

## 9. Sketches

### 9.1 The mark, in section — why the rim is not optional

```
       HEAD (tier 2)                 fill only, a 0.12        fill 0.12 + rim 3 @ 0.95
   ┌───────────────────┐         ┌───────────────────┐      ┌───────────────────┐
   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ 7u ring │···················│      │▐·················▌│  <- 3u rim,
   │▓                 ▓│  3.68:1 │···················│      │▐                 ▌│     half of it
   │▓    ░░ 5 ░░      ▓│         │···  ░░ 5 ░░  ·····│      │▐··  ░░ 5 ░░  ····▌│     outside
   │▓                 ▓│         │···················│      │▐                 ▌│
   │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│         │···················│      │▐·················▌│
   └───────────────────┘         └───────────────────┘      └───────────────────┘
     mark   3.68             mark  1.16  (no edge)            mark  3.97
     digit  4.58             digit 4.30                       digit 4.30
                             ^ passes nothing                 ^ passes both

   the fill's own curve:  a 0.08 → 1.10 ... a 0.40 → 1.68 ... a 0.80 → 3.08
                          digit 4.58            2.88             1.45
                          the two never meet
```

### 9.2 The rank inversion, and the rule it forces

```
   your unit (20 cells, 7% blue)      YOU are not in your own unit
   ┌────┬────┬────┬────┬────┐
   │ 7% │ 7% │ YOU│ 7% │ 7% │        YOU        = wash a0.12 + rim   -> 1.16 vs paper
   ├────┼────┼────┼────┼────┤        PEER       = wash a0.16         -> 1.21
   │    │    │ 7% │    │    │        PEER + 7%  = both grounds       -> 1.34   <-- LOUDER
   ├────┼────┼────┼────┼────┤                                                       THAN YOU
   │ 7% │ 7% │PEER│ 7% │ 7% │        (dark: 1.13 vs 1.55 — worse)
   └────┴────┴────┴────┴────┘
                 ^ carries .cell-peer AND .is-peer-cursor today, at HEAD

   THE RULE:  one ground per cell, by rank
              selection  >  peer  >  laminate  >  unit
```

### 9.3 The §6 window, drawn

```
  ratio
   5 |                                                   ,-'  inverted block
   4 |                                              ,-'        (label -> --color-card:
 3:1 |- - - - - - - - - - - - - - - - - - - - -,-'- - - - -     find AND text are one number)
   3 |                                     ,-'
   2 |                   ground ,,,,,,,,''''
   1 |,,,,,,'''''''''''''
     +----+----+----+----+----+----+----+----+----+----+---> ground alpha
      6%  10%  14%  18%  24%  30%  40%  55%  65%  75%  85%
  text 4.16 3.85 3.55 3.27 2.88 2.51 1.97   |    |    |
       ^ADY UNDER 4.5 AT THE SMALLEST ALPHA |  crossing ~70% light, ~60% dark
                                             (the label has flipped by here)
```
