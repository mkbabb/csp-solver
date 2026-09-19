# PASS-1 SYNTHESIS · MRK-ABS · One visible hand

Section §5 wobble law · §6 focus rings. Synthesizer: Fable 5.1. Input: the lane record at
`../research/MRK-ABS/` (verdict ADJUST) and the r0 censuses. Read-only on the product. The
frontend-design skill's two-pass method was followed: plan → tell review → spec.

## 0 · Plan, then the tell review

**Tokens.** Five named values, all already in the tree or derived from one that is:
`--color-focus-sketch` light `#3a7bc4` (crayon-blue's ink tier, unchanged) · its dark arm
`#6aabeb` (= `--color-crayon-blue` dark, an alias, zero new hex) · `--color-pencil-graphite`
(tier 1, unchanged) · `--color-card` / `--color-background` as the four grounds the ring is
measured on. One new NUMBER: `RING_SIGMA_UNITS = 1.75` (board units; one constant for
three boards). One new CSS pair: `--focus-ring: 2px solid var(--color-focus-sketch)` and
`--focus-offset: 3px`.

**Type.** None. This family mints no rendered string; the woff2 subsets are untouched.

**Layout.** Two surfaces, one law:

```
   ON THE BOARD (drawn)                   OFF THE BOARD (the token)
   ┌──────┬──────┬──────┐                  ┌──────────────────────────┐
   │      │ ,--. │      │  the hand:       │  ┌────────────────────┐  │
   │      │( 5  )│      │  the ring is     │  │ [ normal ] corner  │  │  2px, offset 3,
   │      │ `--' │      │  the same hand   │  └────────────────────┘  │  one blue, both
   ├──────┼──────┼──────┤  as the rule,    │        ^ the only ring   │  themes, every
   │      │      │      │  0.6× its wander │          off the board   │  tab stop
   └──────┴──────┴──────┘                  └──────────────────────────┘
```

**Principles.** (1) A reader judges wander in screen pixels; the ring wanders a fixed
fraction of the rule's own wander at the same viewport, and one constant serves 4×4, 9×9
and 16×16. (2) The ring never leaves its cell. (3) Off the board there is exactly ONE focus
colour and one geometry, authored where every bespoke geometry rule can still win. (4) The
memorable thing per surface: on the board, a visibly hand-drawn square where a CAD box used
to be; off it, one blue ring in the whole product and no browser default anywhere.

**Tell review.** The generic version of this spec is `outline: 2px solid #2563eb;
outline-offset: 2px` on `*:focus-visible`, the Tailwind ring, and a per-size roughness
table for the board. Three departures, each for a reason in the record: the colour is the
crayon's ink tier (the house's own blue, 9.6° from the stock one and 0.084 lower in chroma),
not a stock accent; the offset is 3 because the tongue's `HandDrawnOutline :outset="3"` is
3 and the guard-face's stroke is 2, so the token's numbers are numbers the house already
draws with; and the board is EXEMPT, because the page there is drawn and a rect on a drawn
page is what §6 was written against. The per-size table is refused (the family dies on it);
the constant is bought by deleting one line. What was cut after the mirror: the wash limb
(1.08:1, unspendable) and the mark rung (a blob at 16×16).

## 1 · §5 · the wobble law (spec)

### 1.1 The law

The ring's wander is an ABSOLUTE target in board units, one number:

```
RING_SIGMA_UNITS = 1.75          // σ of the ring's edge, in the 1000-unit board space
K_SEG4           = 0.3241        // measured shape constant, segments 4 (spread 4.2%)
roughness(cell)  = RING_SIGMA_UNITS / (cellSize × 0.015 × K_SEG4)
                 → 4×4  cellSize 250   : 1.44
                 → 9×9  cellSize 111.1 : 3.24
                 → 16×16 cellSize 62.5 : 5.76
```

Stated in board units the target is viewport-honest: the ring and the rule scale together,
so the px figure is a consequence, quoted with its viewport. At 1280×800 (ring px/unit
0.4892 at 9×9 and 16×16, 0.3169 at 4×4): σ ≈ **0.86px** at 9×9 and 16×16, **0.55px** at
4×4. At 393×699 (0.2808): 0.49px at 9×9/16×16. The corner spur (`overshoot = roughness ×
len × 0.003`) becomes a constant 1.08 units ≈ 0.53px desktop at every size.

### 1.2 Why the floor, not the rung

The lane's one crop (`../research/MRK-ABS/frames/ring-band-dpr3.png`) reads the mark rung
(σ 1.443px) as a squashed pentagon at 9×9 and a blob over the grid line at 16×16, and the
clearance model has 237 of 256 rings crossing their own cell at 16×16 (headroom −1.58px).
The floor (σ 0.85px) reads as a hand at 4×4 and 9×9 and a soft lozenge at 16×16, and clears
the cell (ceiling ~0.93px). 1.75 units sits 0.07px under the 16×16 ceiling at 1280×800 and
inside the band at every size measured against the SAME size's grid σ:

| board | grid σ px (R3) | ring σ HEAD | ring σ spec | ring÷grid HEAD → spec | in [0.5, 2.0] |
|---|---|---|---|---|---|
| 4×4 | 1.031 | 0.151 | 0.55 | 0.146 → 0.54 | yes |
| 9×9 | 1.443 | 0.105 | 0.86 | 0.073 → 0.59 | yes |
| 16×16 | 0.631 | 0.042 | 0.86 | 0.067 → 1.36 | yes |

The 9×9/16×16 figures are the crop's "floor" column exactly (r3.2 / r5.7); the 4×4 sits
between "head" and "floor" on that crop because the 4×4 board renders smaller (0.412
px/unit), which is what an honest units law does.

### 1.3 The one deleted line

`gridPaths.ts:52 const cellSegments = boardSize >= 16 ? 2 : 4` becomes `const cellSegments
= 4`. That is what makes k one number (30% split → 4.2%). Price, stated: the 16×16 board's
resident `d` strings go 58.6 KB → 114 KB (256 cells × 446 B), generated once per deal into
the `cellRects` LRU (cap 24, key unchanged: no scale term, because the target is in units).
Accepted. Segments 6 (212 KB, spread 2.8%) is refused: the spread gain is not worth 2×.

### 1.4 States on the board (the tier cascade, unchanged in structure)

| tier | trigger | paint | motion |
|---|---|---|---|
| 1 hover | pointer over, no focus | graphite, stroke 5, opacity 0.65, fill 0.06 | none |
| 2 selection | `input:focus-visible` (every pointer) | `--color-focus-sketch`, stroke 7, opacity 0.9, fill 0.08 | `ghost-draw-on 180ms var(--ease-ghostDraw) backwards` (unchanged) |
| 3 conflict | `.is-invalid` | teacher-red (unchanged) | unchanged |
| 4 peer cursor | `.is-peer-cursor` | peer ink, stroke 4, 0.55, dashed (unchanged) | unchanged |

Every tier rides the same compensated geometry; the hover sketch and the peer's cursor
become a hand too, for free. The wash `.cell-peer` stays a CSS box at 7% (13% under
`prefers-contrast: more`): its edge is 1.08:1 light / 1.10:1 dark from painted bytes and no
σ spent there can be seen. R3-a's "the wash likewise" clause is struck from the gate.

### 1.5 Modality

`gameCell.css:242-244` is deleted and replaced with one true sentence: the focus target is a
text input, so `:focus-visible` matches on click, tap and key; one mark for every pointer.
No behaviour changes.

## 2 · §6 · focus rings (spec)

### 2.1 The graded law, written down

> A thing with focus ON the board wears the house hand (the cell ghost, tier 2). A thing
> with focus OFF the board wears the token: `2px solid var(--color-focus-sketch)` at
> `outline-offset 3px`, both themes. The browser's own ring appears nowhere. The two are one
> system because they share the ink (the crayon's ink tier), the rank (≥3:1 on every ground
> the product paints) and the rule that nothing else may be blue on touch.

### 2.2 The token, authored once

```css
/* assets/index.css, @layer base (replaces `outline-ring/50` at :445) */
@layer base {
  :root { --focus-ring: 2px solid var(--color-focus-sketch); --focus-offset: 3px; }
  :focus-visible { outline: var(--focus-ring); outline-offset: var(--focus-offset); }
  .cell-native-input:focus-visible,           /* the board keeps the hand */
  .gallery-viewport:focus-visible { outline: none; }   /* spoken-gallery §3.7: one owner */
  @media (forced-colors: active) { :focus-visible { outline-color: Highlight; } }
}
```

Specificity (0,1,0) inside `@layer base`: every bespoke geometry rule still wins, which is
the point (a `:is(button,a,[tabindex]):not():not()` sweep computes (0,4,0) and buried the
light toggle's ring to zero painted pixels in both engines).

The dark arm, in `.dark`: `--color-focus-sketch: var(--color-crayon-blue);` (#6aabeb, an
alias, law 23). The `:219-222` comment is rewritten to the painted numbers: token 4.29 over
card light, 4.19 over background light, 7.70 over card dark, 7.86 over background dark;
board ring 3.68 light / 6.53 dark.

### 2.3 The six bespoke rules, disposed one by one

| rule | today | under the law |
|---|---|---|
| `HandwrittenLogo.vue:544` | 2px color-mix(fg 40%), offset 4 — 2.70:1 | DELETED; falls to the token (4.19) |
| `DrawerTab.vue:151` | 2px dashed currentColor, offset 3 | DELETED; falls to the token (same offset, one idiom) |
| `GameCard.vue:436` `.game-card.is-center` | 2px color-mix(fg 40%), offset 4 — 2.70:1 | REWRITTEN to `outline: var(--focus-ring); outline-offset: var(--focus-offset)` (it is published by `aria-activedescendant`, so it cannot fall to `:focus-visible`); reach 6 → 5, headroom 3.6 → 4.6px, WHOLE |
| `StagingBand.vue:431` `.staging-face`, `GameGallery.vue:1450` | 2px color-mix(fg 45%) on the face | REWRITTEN to the token pair (the face keeps carrying the ring; the button's `outline: none` stays) |
| `DarkModeToggle.vue:740` | `2px solid var(--color-ring)`, offset `calc(2px − var(--toggle-bleed))` (54px) | REWRITTEN colour only: `outline: var(--focus-ring)`; the 54px ornament offset is W2 §2.4's cure and stays |
| UA default (`.ctrl-btn`, `.icon-btn`, `.info-btn`, `.attribution-trigger`, masthead links) | `outline: auto` — 1.78–2.15:1 in WebKit | covered by the base rule; the UA ring appears nowhere |

Net: one colour token with two arms, one width, one offset (plus the toggle's declared
exception), zero `outline: auto` in the tab order.

### 2.4 Mobile

Same rule, same numbers: the token is 2px at every viewport (an outline does not scale with
the board). The tongue in its portrait-shut berth (tucked 8px under the paper at `z-index:
−1`) shows the ring's visible arc exactly as its dashed ring showed today; the bottom tab
(W2 §2.7) takes the token like every other button. The board ring at 393×699 is 0.49px σ
against a grid σ scaled by the same 0.365/0.636, so the ratio row holds on the phone.

### 2.5 Copy and motion

No copy. No new motion: the board ring keeps `ghost-draw-on 180ms`; the token ring appears
same-frame (outlines do not transition; PRM identical). Home in `pencilConfig`: nothing new
to mint; `RING_SIGMA_UNITS` lives in `BOIL_CONFIG` beside `cellBoil`, not in MOTION (it is
geometry, not time).

## 3 · Plan (files, order, what dies)

1. `src/pencil/config/pencilConfig.ts` — add `ringSigmaUnits: 1.75` and `ringK: 0.3241` to
   `DEFAULT_BOIL_CONFIG` with the law as its comment (px figures quoted at 1280×800).
2. `src/pencil/grid/gridPaths.ts:52` — `cellSegments = 4`; `:59-67` roughness computed from
   `cellSize` per §1.1. Cache key unchanged.
3. `src/assets/index.css` — `:445` `outline-ring/50` DIES; the `@layer base` block of §2.2
   lands in its place; `.dark` gains the `--color-focus-sketch` alias; `:219-222` comment
   rewritten to painted numbers.
4. `HandwrittenLogo.vue:544`, `DrawerTab.vue:151` — rules DELETED.
5. `GameCard.vue:436`, `StagingBand.vue:431`, `GameGallery.vue:1450`, `DarkModeToggle.vue:740`
   — rewritten to `var(--focus-ring)` (offsets as §2.3).
6. `src/games/shared/gameCell.css:242-244` — comment replaced; `:245-258` unchanged.
7. Gates (§5) land in the same commit, red before step 1 and green after step 6.
8. `evidence/w7/loop/r0/r3-marks/R3-census.md` gets a "moved" row: R3-a is scored per size
   against that size's grid σ, sampled over ≥24 cells; the wash clause struck.

Dies: one board-size branch, two focus rules, the `outline-ring/50` sweep, the false
modality comment, the false dark-mode comment. Nothing new is mounted.

## 4 · Prototype brief (pass 2)

Build: the §3 diff (~40 lines) applied in a throwaway worktree under the scratchpad, dev
server `npx vite --host 127.0.0.1 --port 4239 --strictPort`, scratch playwright config from
`../research/MRK-ABS/probe/pw.config.ts`. Poses to screenshot, dpr3 crops ≤150 KB, both
engines, light and dark: (a) one focused cell with its four neighbours at 9×9 and at 16×16,
1280×800, beside `r0/r3-marks/frames/ring-on-grid.png` at the same scale; (b) the same at
393×699; (c) one chrome composite: a `.ctrl-btn`, the tongue, the toggle and the deck's
centre card, each focused. Six crops at most.

Measure: R3-a per size over every cell (`wobble.probe.ts` widened to n = 16/81/256), the
k-constant (σ_units mean per size within 5%), clearance (headroom ≥ 0 for 256/256 at 16×16,
desktop and phone), `budget.probe.ts` 9/9/9 with ghost filter `none` and population
16/81/256, `token-ring.probe.ts` from painted bytes on every tab stop × four grounds × two
engines, the toggle's changed-pixel count > 0 both engines, `deckring` reach/air/WHOLE,
`click`/`mobile` R3-j/R3-i, the phone frame trace (0 frames > 33ms), `spoken-gallery.spec.ts`
16/16, `access.spec.ts` 2.1/2.2/2.3, `a11y.spec.ts` 3.5, the forced-colors arm, and R6's
`hue-census.mjs` (zero new hexes: the dark arm must appear as an alias row).

Success is: ring÷grid 0.54 / 0.59 / 1.36 (±0.1) at the three sizes; σ_units 1.75 ±5% at all
three; 0 rings crossing their cell; every focus stop ≥3:1 painted (expected 4.19–4.29 light,
7.70–7.86 dark); toggle ring painted in both engines; deck headroom 4.6px; one outline
colour in the tab order; 9/9/9; population unchanged; 16/16, 2.1/2.2/2.3, 3.5 green.

## 5 · Born-RED gates this family lands with

- **G-ABS-1 R3-a per size** — ring σ ÷ grid σ at the same size and viewport ∈ [0.5, 2.0] at
  4×4 / 9×9 / 16×16, n ≥ 24 cells (the single-cell probe flakes at CV 0.27–0.60). RED at
  HEAD: 0.146 / 0.073 / 0.067.
- **G-ABS-2 one constant** — mean σ_units per size within 5% across the three boards. RED
  at HEAD (k 0.3177 / 0.3232 / 0.2268, a 30% split).
- **G-ABS-3 focus contrast from painted bytes** — every tab stop's ring ≥3:1 on its ground,
  chromium + webkit, light + dark. RED at HEAD (WebKit UA 1.78–2.15; logo 2.70; deck 2.70).
- **G-ABS-4 one focus colour** — every `:focus-visible` stop and the deck card compute the
  same outline colour per theme, and `outline-style: auto` appears nowhere. RED at HEAD
  (five colours, six UA stops).
- **G-ABS-5 the dark arm** — `.dark` computes `--color-focus-sketch` ≠ the light value (R6
  law-probe R1). RED at HEAD.
- Guards that must stay green: clearance (0/256 crossing), toggle ring painted > 0 px both
  engines, spoken-gallery §3.7 one owner + WHOLE, budget 9/9/9 + population, forced-colors
  outline solid, phone trace 0 > 33ms.

U-10: nothing here closes. The owner sees the crops at the re-look.
