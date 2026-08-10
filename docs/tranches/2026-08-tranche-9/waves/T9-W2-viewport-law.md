# T9-W2 — THE VIEWPORT'S LAW

The layout stops hiding the product. Registry family F12, adjudicated to the pixel by
V7 (both engines, live edge, fresh contexts; every root cause below is V7's measured
mechanism, not inference). DesignSync owns each cure's shape; π/DELTA per claim.

## 2.1 The gallery deck's height law (the P0, V7-adjusted)

The scrollport declares NO height and NO floor (`GameGallery.vue:968-982`;
`min-height:auto` resolves to 0 on a scroll container under `:948-957`'s
`flex:1; min-height:0`), while the track keeps its intrinsic ~408px card. The
measured truth: captions clip from ~692px of viewport height, first name slices at
~660px, all five names by ~641px; at phone size the clip is **70%** and every name
is fully invisible — with 309px of interior scroll hidden behind
`scrollbar-width:none` + a suppressed webkit scrollbar (`:980-986`) and zero
affordance. The deck stays FUNCTIONAL while illegible (a tap on a nameless sliver
selects that game) — the defect is legibility with no cue, not reachability.

The cure is a law, not a patch — DesignSync chooses among: a height floor with the
deck scaling its cards; card content that survives clipping (name pinned within the
visible band); or an owned scroll with a real affordance. Whatever the choice: **at
every viewport the product ships, the five names are legible at first paint or one
cued gesture away.**

- Born-RED: the name-visibility probe (V7's `c1-fresh.mjs` promoted to a spec) at
  the measured threshold cells — 1440×640, 844×390 — red at HEAD (visFrac 0).

## 2.2 The short-landscape control estate (the P0, V7-adjusted)

`scene.css:221-223` hides `.fold-tools`/`.drawer-handle` UNSCOPED and only the
portrait arm (`:284/:339/:355`) re-enables them — a landscape phone matches the
max-width arm but not the portrait arm, so it gets neither. V7's correction stands
IN the charter: the board itself is playable (81 opacity-0 native inputs in the
first viewport, the docked wordmark is the picker entry) — what's unreachable is
every game CONTROL (deal, level, solve, share, undo, hint: the card sits wholly
below a 390px fold on a page whose first screen gives no hint it scrolls,
docScrollH 1157). The cure: the landscape arm exists — the drawer tab (or an
equivalent cued entry) lives in short landscape, and the N1 status-line residue
(19.19px under the fold at 844×390) rides the same media-arm work.

- Born-RED: a reachability probe at 844×390 + 812×375 — some visible, cued path to
  the deal/level controls within one gesture — red at HEAD.

## 2.3 The controls card's fold made honest (P1, confirmed 42.8–63.2%)

`scene.css:126-131` caps the card and scrolls it with no gutter, no fade, and (on
darwin) an overlay scrollbar of zero layout width; the only cue is a half-cut
control straddling the fold (V7: real but weak — and the Play entry sits ~317px of
unhinted scroll below it). The card's fold gets a designed affordance (fade, gutter,
or a fold cue in the house hand), and the mobile drawer's residue clip (32–97px,
always shearing a frame stroke or washi tab) is cured by the same discipline: the
card's own chrome never straddles its case edge.

## 2.4 The toggle stops stealing (P1, V7-demonstrated)

The theft is real and DEMONSTRATED: at 1024×768 a click inside the "4×4" size
button flips the theme (the toggle's inscribed r=104 CIRCLE owns 79.7% of the
sampled overlap; `App.vue:938-966` fixed at `z-index:60` over the card). At 1280×800
the shared box is outside the circle (no theft); at 1920×1080 no overlap; the art
never clips (that claim died). The cure: the toggle's hit surface matches its art
and never overlaps an interactive sibling — geometry (size/position per width band)
decided with DesignSync, the hit-test law absolute.

- Born-RED: the theft probe — click every control in the overlap band, assert no
  theme flip — red at HEAD at 1024-class widths.

## 2.5 The washi tape flips (P1, a family per V7)

`SheetWashiLabel.vue:91-126` has no downward/flip arm and no collision logic; the
players slab's tape covers 68% of the Live option, and the whole sticky tool row's
tapes hang up onto the Play entry (17–24% each). T7-W7 already touched this exact
tape (z-order, `:1852-1863`) without curing placement — second bite of the class,
so the CLASS gets the law: a tape never covers an interactive element; it flips,
shifts, or yields.

- Born-RED: hover census over the slab + tool row asserting zero
  tape-over-interactive overlap — red at HEAD.

## Gate spine

- The four born-RED probes above land as e2e rows (count pins move → doc gates in
  the same commit).
- π identity on every surface this wave does not claim; DELTA before/after crops per
  cure at the probe's own cells (≤150KB each, evidence-policy).
- DesignSync record per §2.1/§2.3/§2.4 decision, banked under `evidence/w2/design/`.
- The V7 probe scripts are the instruments of record — promoted from scratchpad into
  the wave's evidence with their measured baselines.
