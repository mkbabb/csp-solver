# PASS-1 SYNTHESIS · MRK-WASH · The wash

Section §5 wobble law · §6 focus rings. Synthesizer: Fable 5.1. Input: the lane record at
`../research/MRK-WASH/` (verdict ADJUST: the wash cannot be the mark, but it can be the
mark's body) and the r0 censuses. Read-only on the product. Two-pass method: plan → tell
review → spec.

## 0 · Plan, then the tell review

**Tokens.** Ink: `--color-focus-sketch` `#3a7bc4` light; dark takes the same value (measured
3.99 / 4.00 as the rim on dark card/background). Three new numbers, all in
`gameCell.css` as custom properties so a tuner can move them: `--wash-a: 0.12` (fill
opacity), `--wash-rim-w: 3` (viewBox units; ~0.95 CSS px visible at 9×9 desktop once the
fill covers the inner half), `--wash-rim-o: 0.95`. Unit wash stays `--color-crayon-blue` at
7%. Digit ink unchanged. Grounds: `--color-card` / `--color-background`.

**Type.** None. No rendered string is minted.

**Layout.** Three terms, one board:

```
    your unit (7% wash, no edge)           WASH  = where a hand is (yours: a body with a rim)
   ┌────┬────┬────┬────┐                    RING  = where an eye is (a peer's cursor: dashed,
   │ ·· │ ·· │▐▓▓▌│ ·· │  ← YOU: fill 0.12          lighter, a ring, never a wash)
   ├────┼────┼────┼────┤    + a hairline rim   EDGE  = structure (the grid, the frame)
   │    │    │ ·· │    │
   ├────┼────┼────┼────┤  ONE ground per cell, by rank:
   │ ·· │ ·· │┆ P ┆│ ·· │    selection > peer cursor > hint laminate > unit
   └────┴────┴────┴────┘  (the peer's cell drops the unit wash; today it carries both)
```

**Principles.** (1) Selection is laid over the page, not drawn on it. (2) A wash has no
edge, so 1.4.11 cannot be met by a fill alone (3:1 needs alpha 0.78; the digit dies at
0.10): the fill needs a rim, and the rim is a hairline, not a ring. (3) One ground per cell.
(4) The memorable thing: the selected cell is a patch of crayon with a digit written on it,
and nobody's cursor is ever louder than yours on your own board.

**Tell review.** The generic version is Material's state layer: a 12% scrim of the accent
under the focused thing, everywhere, with a separate ring kept for a11y. The board arm
departs by putting the rim ON the same path as the fill (`paint-order: stroke`, one node,
same seed; 3.97–4.00 painted against HEAD's 7px ring at 3.68–3.76), so there is no second
indicator. The chrome arm is where the mirror bit hardest: a wax ground under chip text
takes 14 of 17 labels under 4.5:1 at 6% alpha, the smallest tried, so the ground is
REFUSED for chrome. What survives there is offered under its own name as a ballot option
(the cut-out, §2.2), not as this family's claim. The two subjects that are not boxes (the
tongue, the toggle) cannot take a ground at all; a ground law that covers five of seven
subjects is not a law.

## 1 · §5 · the wash with a rim (spec)

### 1.1 The law

> The wobble law does not apply to a wash: a fill has no edge to be straight. The selected
> cell is a crayon body (fill 0.12) whose own hairline rim (3 units at 0.95) carries the
> 3:1 the fill cannot; both live on the one resident `.cell-ghost-path` at the cell's own
> seed. Everything else on the board that marks a HAND is a wash; everything that marks an
> EYE is a ring; everything else is an edge.

### 1.2 Tier 2, rewritten

```css
/* gameCell.css — tier 2, the selection (every pointer; the modality comment dies) */
.game-cell:has(input:focus-visible) .cell-ghost-path {
  --wash-a: 0.12; --wash-rim-w: 3; --wash-rim-o: 0.95;
  paint-order: stroke;                       /* the fill covers the rim's inner half */
  fill: var(--color-focus-sketch);
  fill-opacity: var(--wash-a);
  stroke: var(--color-focus-sketch);
  stroke-width: var(--wash-rim-w);
  stroke-opacity: var(--wash-rim-o);
  stroke-dasharray: 1; stroke-dashoffset: 0;
  animation: wash-fill-in 180ms var(--ease-ghostDraw) backwards;
}
@keyframes wash-fill-in { from { fill-opacity: 0; stroke-dashoffset: 1; } }
@media (prefers-reduced-motion: reduce) { .game-cell:has(input:focus-visible) .cell-ghost-path { animation: none; } }
@media (prefers-contrast: more) { .game-cell:has(input:focus-visible) .cell-ghost-path { --wash-rim-o: 1; } }
```

Measured, four-for-four (chromium + webkit × light + dark): the mark reads 3.97 / 3.99 /
3.97 / 4.00 on 1.4.11 by state difference, above HEAD's ring (3.68 / 3.76 / 3.69 / 3.76);
the digit in the washed cell reads 4.30 (≥ 4.5 is NOT met for the digit at 0.12 in light —
4.30 is the lane's number and it is under the text floor; see §1.5). The rim's ratio is set
by its OPACITY, not its width (rim 3 @ 0.95 = 3.97 beats rim 7 @ 0.90 = 3.73), so width and
floor are separable knobs. One node, zero filters, same seed, population 16 / 81 / 256
unchanged, ghost filter `none`.

### 1.3 The state rule (forced, not chosen): one ground per cell

| rank | ground | today | under the law |
|---|---|---|---|
| 1 | selection (tier 2 wash) | never carries its own unit wash (7/20/39 = unit minus self) | unchanged |
| 2 | peer cursor (tier 4 ring) | ALSO carries `.cell-peer` when inside your unit → 1.34 vs your 1.16 light, 1.55 vs 1.13 dark: the peer out-reads you | `.cell-peer` is NOT rendered on `.is-peer-cursor` (template: `v-if="isPeer && !isPeerCursor && !isBecause"`) |
| 3 | hint laminate `.cell-because` | composites with the unit wash (observed live) | `.cell-peer` not rendered under `.cell-because` |
| 4 | unit wash `.cell-peer` 7% | the floor | unchanged |

The peer cursor keeps its RING (stroke 4 / 0.55 / dashed, fill 0.04): an eye, lighter than
your hand on every axis, the decided ranking (T8-W3 M1) preserved and now carrying meaning.
The three-ground stack was never observed painted; the rule is written from the bindings
(`DigitCell.vue:262, :273, :211`) so it cannot occur.

### 1.4 Separability from the unit wash

By dL*, not by ratio (the unit wash is 1.02:1 against paper, so "3:1 against it" is
unpassable by construction): unit wash 3.01 L* points off paper light / 5.0 dark; the
selection body 9.61 at alpha 0.20 and ≈ 7.3 at 0.12 (interpolated from the lane's sweep;
pass 2 reads it directly). The kill condition is restated as a dL* floor: selection body ≥
unit wash + 3.0 L*.

### 1.5 The digit through the wash (the number that is not yet clean)

The lane's 4.30 for the digit at 0.12 comes from a box sampler that includes the glyph's
own anti-aliased edge; the text floor is 4.5. Pass 2 isolates the glyph's core pixels. If
the isolated figure is under 4.5 in light, `--wash-a` drops to 0.10 (digit ≥ 4.5 by the
lane's curve at 0.08–0.10; the rim, not the fill, carries 1.4.11 so the mark holds at
~3.9). The spec pins the fill at 0.12 pending that read; dark can carry up to 0.28.

### 1.6 R3-a under this family

σ over space is 0.065px before and after (the geometry is the same `wobbleRect`; only its
paint changed), and a 3-unit rim wanders LESS than the 7-unit ring by the library's own
length law. The family does not satisfy §5 as scored on σ and says so: it asks the wave to
score §5 on stroked marks ≥ 2px visible width, which a hairline rim is not. The wobble
probe's ring row stays RED under this family by that reading, and the record carries it.

### 1.7 Mobile

Same rule; at 393×699 the rim is 3 units × 0.2808 = 0.84 px of which ~0.4 shows outside
the fill. Measured modality on the phone: tap and click both paint the wash exactly as
HEAD paints tier 2 (`tapFocusVisible 1`). Frame trace across 14 arrow presses: chromium
8.30ms median, 0 over 33ms both arms; webkit 17.0ms median with ONE 34.0ms frame in 92
under the wash against 0 in 93 at control — pass 2 repeats n ≥ 5 before pricing it (M09:
nothing is bought with quality).

## 2 · §6 · chrome (the ground is dead; one door, named)

### 2.1 The refusal, stated

A wax ground on a focused control is REFUSED at every alpha: at 6% (the smallest tried) it
takes 14 of 17 labels under 4.5:1 (worst 4.66 → 4.16) while measuring 1.12:1 as an
indicator; at 40% the indicator is still 2.34:1 and the worst label is 1.97:1. Dark splits
the difference destructively. `.drawer-tab` and `.sun-moon-toggle` have no box to ground.
This family has no chrome answer of its own and does not borrow one here; the sibling
routes' §6 are the wave's candidates, and the agglomerator decides.

### 2.2 The one open door — offered under its own name: the cut-out

Invert the label: the focused control becomes a solid block of `--color-focus-sketch` at
85% and its label flips to `--color-card`. Findable and readable become the SAME number:
light 4.46 at 85% (crossing ~70%), dark 5.28 at 85% (crossing ~60%). It is not a wash and
not the house's wax vocabulary; it is a ballot row for the owner, sized: `.ctrl-btn`,
`.icon-btn`, `.info-btn`, `.attribution-trigger`, the masthead links and the deck card can
take it; the tongue and the toggle cannot and would keep a rim. Motion: the block appears
same-frame (a ground does not draw on). Copy: none. It is NOT this family's spec; it is
recorded so it is not lost.

### 2.3 What this family still owes §6 regardless

Whatever chrome idiom the wave adopts, this family's board arm requires: forced-colors keeps
the cell's real `2px solid Highlight` at offset −2px (measured surviving, both engines);
`a11y.spec.ts:536` stays 0 unnamed images; the modality comment at `gameCell.css:242-244`
dies.

## 3 · Plan (files, order, what dies)

1. `src/games/shared/gameCell.css:242-258` — tier 2 rewritten per §1.2; the modality comment
   replaced by the true sentence; `wash-fill-in` keyframe added; `ghost-draw-on` stays for
   tier 4 (the peer ring still draws on).
2. `src/games/shared/DigitCell.vue:261-265` — `.cell-peer` gated `isPeer && !isPeerCursor
   && !isBecause` (the one-ground rule at the binding, so the CSS never has to fight).
3. `gameCell.css:119-131` comment gains the rank line (selection > peer > laminate > unit).
4. `gameCell.css:352-357` forced-colors arm unchanged (asserted by gate).
5. Gates (§5) in the same commit, red before step 1, green after step 2.
6. R3 census: the wash row's σ is struck (a fill has no edge); the ring row is carried RED
   with this family's reading written beside it.

Dies: the 7px ring as the selection, the false modality comment, the peer's double ground.
Mounted: nothing. No new node, no new filter, no new token hex.

## 4 · Prototype brief (pass 2)

Build: the §3 diff (~25 lines: one CSS block, one `v-if`) in a throwaway worktree under
the scratchpad (`../research/MRK-WASH/proto/wash-board.css` is the replayable overlay),
`npx vite --host 127.0.0.1 --port 4240 --strictPort`, scratch config
`../research/MRK-WASH/probe/pw.config.ts`, a second page on `?wire=local` for the peer
arm. Poses to screenshot, 330×210 crops ≤ 20 KB, both engines, light and dark: (a) the
selected cell inside its washed unit with a peer's cursor cell adjacent and a neutral
neighbour, 1280×800 (the lane's two crops re-cut with the exclusivity rule live, so the
peer cell shows ONE ground); (b) the same at 393×699 dpr3 at 9×9. Four crops.

Measure: `delta.mjs` (the mark isolated as a state change: rim 1.4.11 on four cells ≥ 3.5,
edge-ratio ≠ body-ratio), the digit's 4.5 with the glyph core isolated (the number §1.5
waits on), `rim.mjs` dL* separability (selection body ≥ unit + 3.0 L*), `peer.mjs` rank
(your cell ≥ the peer's cell on dL* in both themes; `peerAlsoUnit: false`), `budget.probe.ts`
9 light AND the dark census (the lane read 11 in dark from `CrayonHeart.vue:315`'s
`saturate(0.85)`, a wave-level finding, not this family's; the gate must emulate both
schemes), population 16/81/256, `wobble.probe.ts` R3-a carried RED with the reading,
`click`/`mobile` R3-j/R3-i (tap = click = key), the phone frame trace repeated n ≥ 5 (the
one 34ms webkit frame priced or dismissed), `spoken-gallery.spec.ts` 16/16, `access.spec.ts`
2.1/2.2/2.3, `a11y.spec.ts` 3.5, forced-colors (`2px solid Highlight`, offset −2px), R6
`hue-census.mjs` (zero new hexes), the heading census asserted unchanged.

Success is: rim 1.4.11 ≥ 3.5 four-for-four (expected 3.97–4.00); digit ≥ 4.5 light with
the glyph isolated (else `--wash-a` 0.10 and re-read); selection dL* ≥ unit + 3.0 both
themes; peer cell never out-reads yours; 9/9/9 light with the dark census explained;
population unchanged; 0 long frames over 5 runs; forced-colors solid; 16/16, 2.1/2.2/2.3,
3.5 green.

## 5 · Born-RED gates this family lands with

- **G-WASH-1 the mark by state difference** — the selected cell's rim ≥ 3:1 (target ≥ 3.5)
  on painted bytes, chromium + webkit × light + dark, with edge-ratio > body-ratio (a fill
  alone reports them equal). RED at HEAD by construction of the row (HEAD's ring reads
  3.68–3.76 but the row is written for the rim's node: `paint-order: stroke` absent → the
  row asserts the fill-covered rim geometry, which HEAD does not have).
- **G-WASH-2 one ground per cell** — on `?wire=local` with a peer's cursor inside your unit,
  the peer's cell carries exactly one ground and reads lower than your selected cell on dL*
  in both themes. RED at HEAD (`peerAlsoUnit: true`; 1.34 vs 1.16 light, 1.55 vs 1.13 dark).
- **G-WASH-3 the digit through the wash** — the digit in the selected cell ≥ 4.5:1 with the
  glyph core isolated, both themes. Born beside G-WASH-1 (HEAD's digit at fill 0.08 reads
  4.58, so this row is a guard at HEAD and RED under the prototype until §1.5's read).
- **G-WASH-4 separability by dL*** — selection body ≥ unit wash + 3.0 L*, both themes. RED at
  HEAD for the row's existence (HEAD's body at 0.08 is ≈ 1.10:1 ≈ +2.4 L*).
- **G-WASH-5 the filter census in both schemes** — 9/9/9 with `prefers-color-scheme: dark`
  emulated as well as light. RED at HEAD in dark (11: `svg.crayon-heart` `saturate(0.85)` ×2,
  `filterBudget.ts:143` allowlists the `g`, not the `svg`). Wave-level; landed here because
  this lane found it.
- Guards that must stay green: population 16/81/256 and ghost filter `none`; forced-colors
  `2px solid Highlight` at −2px; a11y 3.5; access 2.1/2.2/2.3; §3.7; tap = click = key;
  phone trace 0 > 33ms over n ≥ 5.

U-10: nothing here closes. Whether a fill-in on every arrow press reads as motion is an
eye question for the owner at the re-look, not a number.
