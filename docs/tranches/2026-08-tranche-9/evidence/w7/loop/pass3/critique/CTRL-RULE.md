# T9-W7 · pass 3 · CRITIQUE · CTRL-RULE — the margin column, arm (b), the pin kept

Adversarial read by a critic who wrote neither the spec nor the prototype. Every number below
that is not attributed to the lane was re-measured here, on the lane's own worktree
(`wf_f72f3b5a-83a-28`, 12 modified + 4 untracked over `74a2b5d9`), served at `127.0.0.1:4233`
against the `74a2b5d9` HEAD control at `:4234`, both engines, private vite caches, both servers
killed and the band read clear before this file was written.

Instruments and readings: `pass3/critique/CTRL-RULE/instruments/` · `…/readings/`.

---

## 0 · THE HEADLINE, CONFIRMED BY A SECOND HAND

The chair's §6.3(a) refusal is answered. The pin is kept, it lives in a column no control
occupies, and that is not a promise — it is a reading I took myself:

| row | my read (chromium) | my read (webkit) | lane's |
|---|---|---|---|
| ROW A · orphaned field (fieldVis ≥ 0.33 ⟹ nameVis > 0) | 0/12 @1280 · 0/11 @900 · 0/8 @390 · 0/12 @320 | — | 0/13 · 0/8 · 0/13 |
| ROW B · stale name | 0 at every cell | — | 0 |
| name ∩ control, clipped, pseudo-elements included | 0.000 at 5 states × 4 cells | 0.000 | 0.000 |
| the pin HOLDS (name.top vs the scrollport's padding edge, only where the group is astride it) | 16 astride reads, worst \|Δ\| **0.641 px** | 16 reads, worst **0.609 px** | "0.000" |
| ink, composited on `--color-card`: red-ink · ring-ink · muted-fg · rule | 4.990 · 3.703 · 4.659 · 3.536 (light) | same tokens | 4.99 / 3.145 claimed |
| the same, dark | 6.303 · 4.670 · 7.681 · 4.358 | same | — |

`check-copy-register` exit 0 (0 unadmitted, 0 ADMITTED), `check-theme-selectors` exit 0,
`check-font-coverage` exit 0 — re-run by me in the worktree. M16 is clean. Every AA floor this
family's own tokens must clear, clears, in **both** themes: the red word 4.99/6.30 against
1.4.3's 4.5, the authored ring 3.70/4.67 against 1.4.11's 3.0, the names 4.66/7.68.

That is a real result and it is the pass's earned half.

---

## 1 · WHAT THE LANE MEASURED THAT IT SHOULD NOT HAVE BELIEVED

### 1.1 · "worst |Δ| 0.000 px over every held read" is a gate that cannot fail

`name-truth.mjs:89` defines `held = |bb.top − (port.top + padT)| ≤ 0.75`, and
`pinnedTopWorstDelta` is then `max |t − padT|` **over the rows `held` selected**. The population
is the predicate. A name that pinned at the wrong place is not a red — it is excluded, and the
lane's own comment promising the excluded rows are "reported, never swallowed" describes code
that was never written (there is no such row in the output).

Its own log says so out loud: `readings/mechanical-gates.txt` reads `worst pin-top Δ **null**`
at all three chromium cells in the final arm — `held` never fired once in chromium — while the
return states "worst |delta| 0.000 px over every held read, 3 cells x 2 engines". A null is not a
zero, and a gate that reads null in one of two engines is not a gate that passed in both.

My unfiltered read (`critic-probe2.mjs`, only the states where a group is astride the pin line,
raw offset reported whatever it is) gives the honest number: **0.641 px chromium, 0.609 px
webkit**. The pin works. It also misses the spec's own "± 0.5 px" by 0.14 px, which nobody knows
because the instrument could not have found it.

### 1.2 · the rule's contrast — BOTH of the lane's numbers are wrong in opposite directions

The lane banks "worst PAINTED column 1.638 light / 1.356 dark, gate ≥ 3.0, UNMET" and concludes
"no 2px stroke at 55% alpha reaches 3:1 on a painted column".

I screenshot the first rule's own band at rest and decode it (`sharp`, deviceScaleFactor 1,
worst-over-columns of max-over-rows): **3.530 chromium light · 3.483 webkit light · 4.364 both
engines dark**. Every column of the sampled span carries a pixel at the token's full-coverage
composite. The universal claim is false; I have the counterexample.

What the lane actually measured is the worst of **four forced sub-pixel phases**, and at a
straddled phase a 2px stroke splits its coverage across two device rows and no column reaches
full ink. Both readings are real. What is missing is the ruling nobody made: WCAG 1.4.11 does
not ask that every sub-pixel phase of an anti-aliased line clear 3:1, and no stroke of any
weight at any alpha on this ramp can pass the gate as the lane wrote it. So the family is
holding a gate that **cannot be passed** and calling its failure the design's biggest defect.
One of the two has to move, and the pass decided neither.

Also standing: the dark sweep banked **1 read of 28** (the lane's clip-bounds guard skipped 27),
so the dark arm of its own headline gap rests on a single crop.

### 1.3 · the spec's ablation is vacuous, and the lane says so — then ships the vacuous gate's twin

Credit where due: the lane found that `align-items: stretch` never reaches an item carrying
`align-self: start`, and substituted `.rp-name{align-self:stretch}` as the true travel ablation
(RED 4/13, 2/13, both engines). That is exactly the work a prototype owes. The GATES block in
the charter still names the vacuous one, and the agglomerator must carry the substitution
forward or the wave re-inherits a born-GREEN control.

---

## 2 · THE CHAIR'S RULING THIS FAMILY BREAKS, UNMEASURED BY THE LANE

**§6.4 — "the card's width outranks its content; no re-mint in the loop."**

Measured, 1280×800, chromium, prototype vs the `74a2b5d9` control on the same box:

```
.controls-card   324.22 px  →  373.50 px     (+49.28)
.masthead          x 129.89 →  x 105.25      (−24.64)
svg.handwritten-logo x 129.89 → x 105.25     (−24.64)
.drawer-tab        x 761.89 →  x 737.25      (−24.64)
```

The margin column is 121.6 px of a card W2 sized at 324.22, so the field takes the card wider by
15.2% and the whole rail re-centres: the **wordmark, the masthead and the drawer tab each move
24.64 px on a surface this family does not claim**. The chair named this exact defect on
CTRL-COST at +41.75 px and refused it ("cured by the width law, never by a golden"). CTRL-RULE's
is larger and is nowhere in its return.

The lane's π evidence cannot see it: it censused the **gallery** (11 rows, Δ 0.00 — which I do
not dispute; at 390/1280 the gallery is untouched) and nothing else. π is not one surface.

At 390×844 the only move is the declared one: `.scene-controls` and `.drawer-case` shorten by
**9.64 px** (chromium) / **9.62** (webkit) — the `--sheet-chrome` 12 → 12.6rem change, declared
in `scene.css` as §2.9. Good. `#card-foot` is new at both cells, by design.

---

## 3 · THE PROSE THAT THE DIFF CONTRADICTS

### 3.1 · `align-items: first baseline` is asserted as a differentiator and does not hold

`RuledGroup.vue:28-33` argues the name and the first chip sit on ONE baseline, and calls it "one
of the four things separating this page from a settings form". `align-self: start` on the item
outranks the container's `align-items` — the lane knows this (it is the whole argument for the
travel) and books the consequence as "unmeasured, unreconciled".

Measured. Name tops with `align-self: start`, then with `align-self: baseline` injected, 1280,
light:

```
chromium  shift per group:  0 · 0 · 24.80 · 6.93 · 6.94 · 6.94 · 18.53  px
webkit    shift per group:  0 · 1.20 · 26.33 · 8.44 · 9.64 · 10.84 · 22.77 px
```

Five of seven names are **6.9 to 26.3 px off** the relation the component's own docblock claims
as its identity. Either the prose is struck or the pin gives up its travel; the design cannot
have both, and pass 3 shipped both.

### 3.2 · "ONE FACE" ships two strokes for the same word

`GameGallery.vue`'s new comment: "the two ribbons are ONE FACE and a house that asks the same
question twice must ask it in one voice." The card's `keep` takes `:stroke-width="1.5"`. The
gallery's `keep` is untouched at **2** (R6 census row 48: "keep at `strokeWidth 2`"). The
sentence is refuted by the file it is written in.

### 3.3 · the `@property` registration cites a consumer that no longer exists

`index.css:123` justifies the provisional block with "the pin rests at `top: var(--card-pad-t)`
with no fallback". The shipped pin is `top: 0` (correctly — the lane measured the double count).
So the registration's stated reason is false at the moment it ships, and, as the lane's own gap
admits, `--card-pad-t` has no consumer left in this family.

### 3.4 · the ONE STRING is two strings for two of the seven names

`RuledGroup`'s contract: "the ONE string: printed ink, document heading and accessible name."
Shipped, the `<h2>` textContent reads **`Size`** and **`Level`** (they come from
`section.heading`) and only paint lowercase through `text-transform`. The drawn word and the
accessible name are not one string for 2/7, which is R6 law 33's subject and precisely what
`zone-grammar.spec.ts:129` asserts — one of the 42 reds the lane files as an unwritten "re-aim".

---

## 4 · §6.5 — THE NO-FALLBACK LAW IS HALF-KEPT, AND THE HALF THAT IS KEPT IS INERT

- **Struck**: `, 0px` at `scene.css:138` and `:582`. As claimed.
- **Minted, in the same diff**: `scene.css:348` `padding-inline: var(--card-pad-x, 0px)` —
  `--card-pad-x` is script-published (`GameControlPanel.vue:718`), so it is exactly the class of
  token §6.5 governs, and it is a new masked fallback.
- **Left standing on the token this family registered**: `--card-pad-t` still carries `, 0px` at
  `scene.css:361, :364, :365, :368` — four of them, in the file the lane edited, on the token it
  wrote the `@property` block for. The registration→cite→strike chain is 2 struck, 4 standing.
- **The registration does not do what the law asks.** `@property --card-foot-h { initial-value:
  0px }` means an absent publisher resolves to **0px** — byte-identical to the `, 0px` that was
  struck. §6.5's stated purpose ("an absent publisher fails at computed-value time and is caught
  by a born-RED row that deletes the publisher") is delivered by the born-RED row, and **no such
  row is written** in this diff. As shipped, the strike is a comment.

(`var(--tap-floor, 2.75rem)` in `ConfirmRibbon` copies the estate's own idiom at
`index.css:891/:906` and is not this family's invention — noted, not charged.)

---

## 5 · THE THIRD OF THE SPEC THAT WAS NEVER MEASURED

§15, the confirm, never armed: `armGuard` needs `isCoarse && isDirty` and the lane could not
dirty the board. Unrun, by the lane's own honest count: ribbon width vs the foot, ∩ with live
controls, the 1.5/2.5 computed strokes, the red word on bare card, the ≥44 floor on the ribbon's
own verbs, press 1 arms / press 2 fires in both engines, the 2500 ms lapse. Crop 2 is labelled
for what it is — the bar, not the ribbon — which is the right thing to do and does not make the
numbers exist. The estate's `gallery-deal.spec.ts` already arms this guard; the fixture is
borrowable and the whole block is a morning's work, not a research question.

Also unrun and named by the lane: the filter census off the built dist (the build exists; a
preview was never served), goldens 4/4, R6's L1/L3/L4/L5 probes, the hue census against the
control, R7's I2 and I4, W2 §2.2 reachability at 844×390 and 812×375, the R3 re-aim to the bar's
subtree. My dev-server ref census reads the same 12 filter references at all four cells and the
lane's `FILTER_BUDGET` rows are untouched in the diff, which is an argument and not the gate.

And the 42 e2e reds stand as one undifferentiated number: the `74a2b5d9` control run was killed
at 108/238, so not one of the 42 is yet known to be a re-aim rather than a defect — while §3.4
above shows at least one of them is a defect.

---

## 6 · WHAT IS GENUINELY STRONG

1. **The centre is proven, adversarially.** `NAMES PIN IN A COLUMN NO CONTROL OCCUPIES` is
   arithmetic, not a promise, and the arithmetic holds in my hands too: 0 orphans, 0 stale, 0.000
   coverage, four cells, both engines, with `position: static` reading 4/13 and 3/13 as the
   honest born-RED control.
2. **HEAD is refused as a control and the lane says so** — `74a2b5d9` has no
   `[data-ruled-group]`, so ROW A is VACUOUS there, not green. That sentence is worth more than
   most of the numbers around it.
3. **Three instrument defects found and cured** (pseudo-element blindness, unclipped rects
   reporting unpainted ink, a box-based `nameVis` that cannot see a stretched name), each of
   which had been hiding a green. Two of the three are wave-wide lessons.
4. **Three near-rung durations deleted** rather than minted, with the publisher and both its
   bindings going with them.
5. **The ring is authored once, unscoped, at a measured value** — 3.703 light / 4.670 dark
   against a WebKit UA ring at 2.147, and it reaches the eight `OptionSelector` chips a
   panel-scoped selector could never match.
6. **M16 and the mechanical gates are clean in the worktree**, re-run by me.

---

## 7 · CONVERGENCE — 58%, AND WHY NOT MORE

The mechanism converged. The family did not. Earned: the pin's two rows and their ablations, the
predicate, the pin's hold (both engines, at 0.64 not 0.00), the ink arithmetic in both themes,
R1 rows 1 and 2, the gallery's π, the mechanical gates, the deletions. Not earned: a third of the
spec (§15) never ran; the rule's gate is unmet on one reading, unpassable on another, and
unadjudicated on both; a chair ruling is broken by 49.28 px with three unclaimed boxes moving;
four §6.5 fallbacks stand on the token this family registered; two of the component's own
identity claims are refuted by its own diff; 42 e2e reds are one number.

None of it is a missing primitive — every gap closes with a measurement, a re-word, or the width
law the chair already wrote. So: **ADVANCE**, with §6.4 as the first cure and §15 as the second.
