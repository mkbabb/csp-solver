# W13 LANE b2-lowres-forensics — Finding 5a: the low-res toggle whirl

**Verdict: CONFIRMED.** The dark-mode whirl composites a promotion-cached bitmap.
Any frame where the icon's scale exceeds 1.0 — the spring overshoot, the plush-land
tail, the hover — bitmap-stretches that cached texture instead of re-rasterizing the
vector, and reads as low-res. At scale ≤ 1.0 it is crisp. Removing the promotion
restores crispness at every scale (A/B proven). Reproduced at :3001, DPR2, headed
Chromium 128 (`--enable-gpu`), 13rem (lg) toggle.

Probes: `probe.mjs` (layer dump + static A/B + live burst), `probe2.mjs` (edge
threshold A/B). All PNGs in this dir.

---

## 1. The mechanism, confirmed

`.corner-right` (App.vue:212–224) carries `will-change: transform` — the D1/P2 fence
(comment at App.vue:218–223: "the toggle's celestial on its own promoted layer"). The
probe read it live: `cornerWillChange: "transform"`, and crucially `cornerTransform:
"none"` — **the promoted layer itself never moves.** The whirl transforms live on the
CHILD SVG icons (`.toggle-sun` / `.toggle-moon`, DarkModeToggle.vue:384–424), which
scale 0.1 → 1 with a back-out spring `cubic-bezier(0.34, 1.56, 0.64, 1)`
(DarkModeToggle.vue:391, 401). The rest state read `moon transform = matrix(0, 0.1,
-0.1, 0, ...)` i.e. `scale(0.1) rotate(-270deg)`, `visibility: hidden`.

So the shipped structure is: a **static** promoted compositing layer (`.corner-right`)
whose subtree — the two filtered SVG icons — is rastered ONCE into that layer's backing
texture at native scale (1.0), then GPU-composited. When a child scales, Chrome does
NOT re-run the SVG vectorization + `#wobble-celestial` displacement filter per frame;
it **bitmap-samples the cached texture** under the child transform. Sampling above the
texture's native resolution = magnification blur. This is the classic promoted-SVG
"low-res on transform" failure, and the SVG `feDisplacementMap` (SvgFilters.vue:84–107)
is baked into the cached texture, so the stretched pixels carry the displacement noise —
the softness reads as "low-res," not clean blur.

### A/B causation (static, scale forced, transition off — isolates raster from motion)
`static-promoted-1_6.png` vs `static-unpromoted-1_6.png` (same sun, `scale(1.6)`, DPR2):
- **promoted (shipped `will-change: transform`): visibly blurry** — soft fuzzy
  outlines, a bitmap stretched past its resolution.
- **unpromoted (`will-change: auto`): crisp** — sharp vector strokes, clean ray tips.
Toggling one property flips blurry↔crisp with everything else held. Causation nailed.

### Threshold (edge crops, `probe2.mjs`)
- `edge-promoted-1_0.png` vs `edge-unpromoted-1_0.png` — at **scale 1.0 both are
  equally crisp.** The promoted layer is cached at the correct DPR2 density; this is
  **NOT** a half-res / wrong-raster-DPR bug.
- `edge-promoted-1_1.png` vs `edge-unpromoted-1_1.png` — at **scale 1.1 the promoted
  icon is clearly softer** than the unpromoted one (crisp ray tips vs fuzzy).
- **Blur onset is strictly scale > 1.0.** The cache is rastered at 1.0; up-sampling
  begins to blur the instant the transform exceeds it.

### Where the real gesture crosses 1.0 (the "on animation" the owner saw)
The whirl-IN itself is minification (0.1 → 1.0), which samples the native texture and
stays crisp — confirmed by `static-promoted-0_5.png` (scale-down is clean) and the live
mid-whirl frames `live-promoted-f2/f3.png` (moon near scale 1, acceptable). The low-res
bites at the frames that exceed 1.0:
- **spring overshoot** — `cubic-bezier(0.34, 1.56, 0.64, 1)` on the 0.1→1 scale peaks
  around **1.09–1.10** (DarkModeToggle.vue:391/401/413/423).
- **plush-land** keyframe — `scale: 1.05 0.95` at 90% (DarkModeToggle.vue:466).
- **hover** — `transform: scale(1.08)` (DarkModeToggle.vue:359).
Each stretches the 1.0-cached texture. Mild per-frame (~10%), but it's exactly the
crest/land frames the eye lands on, and it's absent when unpromoted.

### Sub-question answered: does it raster-at-small and scale UP (worst case)? — NO.
The incoming icon rests at `visibility: hidden` (DarkModeToggle.vue:388/409 + the
comment at :371–374), so it is **not painted** at scale(0.1); the cache is minted at
native size when it activates. The 0.1→1 leg is minification of a native texture (clean).
The worst-case "rasterize at 10% then scale up 10×" does NOT occur. The damage is the
comparatively minor >1.0 overshoot/hover up-sample — which is nonetheless real and
visible, and would become SEVERE under Finding 5's requested redesign (a storybook
"grow" that deliberately scales past 1.0). Flag for the design lane.

### Layer dump
`LayerTree` enumerated 78 comp layers at rest (`layers-rest.json`); offsets returned in
layer-local space (all 0) so per-layer device sizes aren't cleanly attributable from the
snapshot — the visual A/B is the decisive evidence and needs no layer-size corroboration.

---

## 2. Fix options (crisp-scale), each with its tradeoff

The tension is structural: the P2 promotion exists to STOP the per-frame SVG+displacement
raster (the a1 baseline measured ~25 paints/s of scrolling-layer damage from the celestial
boil). Crispness through the overshoot and that paint saving pull against each other.

**A. Unpromote `.corner-right` (drop `will-change: transform`).**
Crispest possible — the vector re-rasters every frame at true on-screen size (proven by
every unpromoted shot). *Tradeoff:* reintroduces exactly the per-frame main-thread raster
of the filtered SVG that P2 promoted to eliminate — a straight perf regression during the
whirl and on hover. Rejected on its own; it's the thing D1 fixed.

**B. Over-raster the texture (2×/peak-scale pre-raster) — KEEP the promotion.**
Give the icon a cached texture denser than its display size so the overshoot still samples
within native resolution. Concretely: render the SVG at a larger intrinsic box (e.g.
~1.2× → 250px for the 208px display) with a compensating baseline `scale(1/1.2)`, so the
promoted texture is minted at the overshoot resolution; scaling up to 1.15 effective stays
at/under native → crisp. *Tradeoff:* ~1.4× texture memory for one element (trivial), a bit
of geometry bookkeeping. **Keeps the promotion's paint savings AND stays crisp through the
overshoot** — best balance if the redesign keeps modest overshoot.

**C. Cap the whirl scale at ≤ 1.0 (move the bounce off the scale axis).**
The texture is cached at 1.0; if nothing ever exceeds 1.0, nothing up-samples → crisp,
promotion retained, zero memory cost. Land the spring at exactly 1.0 (ease-out, not
back-out) and express the "plush" via translate/rotate or a squash that stays ≤1.
*Tradeoff:* loses overshoot on the scale axis — and **directly conflicts with Finding 5's
"shrink and grow like a storybook-popup,"** which WANTS to grow past 1.0. Cheapest, but
design-incompatible with the requested redesign. Note for the design lane.

**D. Filter-isolation via pre-rastered layers (the GRAIN HOIST precedent, tranche-1).**
Pre-raster the displacement-filtered sun/moon at 2× into static bitmaps and transform/
opacity-swap them for the whirl, so the animated element is a high-res raster that scales
cleanly with no live SVG filter re-run. *Tradeoff:* the live boil pauses on the icon during
the 800ms whirl (acceptable — resume at rest); asset/pipeline work. Highest crispness +
best perf, most build cost. In-family with how the grid boil already ships (path-swap +
pre-rastered filter layers).

**E. Raster-scale hinting (re-raster trigger).**
There's no direct CSS knob to tell Chrome "raster this layer at scale 1.2." Practically
this collapses into B (over-raster the source) or a per-frame `will-change` toggle
(remove on gesture start so it re-rasters, re-add at rest) — which is fragile, jank-prone,
and effectively option A during the gesture. Not recommended as a primary.

**F. Transform on an unpromoted parent / decouple filter from the scaled node.**
Move the scale animation onto a wrapper and keep the filter on a separate crisp node.
Doesn't help here: the `#wobble-celestial` filter lives on the SAME SVG that scales, so any
node that carries the filter and the scale together caches-then-stretches. Would require
splitting geometry from filter — more churn than B or D for the same end.

### Recommendation for the W13 spec
Because Finding 5 explicitly asks the whirl to **grow past 1.0** ("shrinking and growing,
storybook-popup"), option **C is out** and the fix must survive scale > 1.0 while keeping
the promotion's paint savings. Lead with **B (over-raster, keep promotion)** for the
near-term crisp fix; pair with **D (pre-rastered filter layers)** as the durable path that
also carries the boil cleanly — same GRAIN-HOIST pattern the codebase already trusts. Hand
the exact overshoot peak + desired growth amplitude to the design lane so B's over-raster
factor is sized to the redesigned spring, not the current 1.10.
