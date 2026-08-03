# T8-W4 — the logo low-res class (M6), root-caused and cured (2026-08-03)

Third bite of the bake-degrade family; the invariant came first (lessons §3). Agent F's
full report is the wave record; this file banks the mechanism and the numbers.

## The mechanism (new — not the FLIP lead)

`@vueuse/core@14.3.0`'s `useElementSize` special-cases SVG targets and reads
`getBoundingClientRect()` for them — a rect carrying every ancestor CSS transform. A
ResizeObserver fires on LAYOUT and a transform is not layout: a tick landing inside a
transform window (the gallery fold FLIPs `h1.masthead` to `scale(3.60555)`, and the
`inertHeading` button↔span swap re-creates the svg inside it) latches the wrong box, and
when the transform resolves to identity NOTHING FIRES AGAIN. The bake is permanently
poisoned. Measured both engines: under the live transform, `contentRect` reads
382×112 while `getBoundingClientRect` reads 1379×404.

Second, independent arm: `flipTransform` scaled off the h1's WIDTH ratio — 1020px playing
(stretched flex item) vs 283px in the gallery — 3.61× applied to ink that changes 1.39×.

**The owner's sighting is state A5/A7: after ONE gallery visit, the playing wordmark is a
quarter-resolution bitmap (226 device px of ink over 765), permanently, every cycle.**

## The invariant (stated at the bake site)

In every SETTLED state, for every pose: intrinsic device px ÷ (rendered box × DPR) ∈
[0.99, 1.5]; count of settled states outside the band = 0. Floor 0.99 for
`latchWholePx`'s whole-css-px hold; the ceiling because the over-bake is the same defect
with the other sign (the gallery stack shipped 3.6× over-baked for a tranche — 12.9×
excess pixels per pose). Probe: `e2e/gallery.spec.ts` §7b, born-RED both engines against
the incumbent lens (gallery 1.53/1.39, post-unfold 0.66/0.70), both band ends firing.

## The cure (+182/−4)

- `rasterPose.ts`: `useLayoutBoxSize` — one `useResizeObserver`, `entry.contentRect`.
- `HandwrittenLogo.vue`: one line swapped; `@vueuse/core` import gone.
- `App.vue`: the FLIP measures `wordmarkEl()` (the wordmark's own box, stable across the
  view flip) instead of the masthead h1 — 3.61× becomes the honest 1.39×.
- Settled ratios after: [0.9946, 1.0067] across 14 states × both engines. Goldens 4/4
  unmoved (derived then confirmed: with no transform live, both lenses agree).

## The sibling cure (chair, same commit)

`HandDrawnGrid.vue` carried the same lens LIVE — board rules measured 0.918 closed-pose /
1.0898 returning, drifting per drawer toggle — one-line swap to `useLayoutBoxSize`;
grid-corner golden re-run against the built dist: unmoved.

## Residue (named, not cured)

- The enter fold's honest 1.39× magnification (~14 frames of ~500ms on a moving element)
  — declined on parsimony; numbers banked for a re-open.
- The toggle softens 8% under `:hover { scale(1.08) }` (bake 416² over a 208 box hovered)
  — not this class (its lens observes a button, never poisoned); recorded.
- Pinch-zoom never re-bakes (visual-viewport zoom moves no DPR) — a page-wide bitmap
  property, not this surface's defect.
- DarkModeToggle's `useElementSize` observes a BUTTON — the SVG special-case never bites;
  left as-is.

Ladder: CURED — PENDING OWNER RE-LOOK (the playing wordmark after a gallery round trip is
the eye this wave can't take for itself).
