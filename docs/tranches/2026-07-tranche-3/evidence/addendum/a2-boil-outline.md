# LANE a2-boil-outline — Finding 2: "boiling too hairline, outline changed"

**Verdict: hypothesis CONFIRMED, and it's three regressions stacked, not one.** W10's F1 px-native
change (working tree, uncommitted) kept the side-wobble energy perfectly — the wobble amplitude in
`wobbleLinePoints` is length-proportional (`roughness · len · 0.015`, pencil-boil `src/path.ts:88`)
and survives the coordinate-system change untouched. What broke is everything expressed in
**absolute user units**: the grain filter, the boil amount, the corner treatment, and the air
around the card. The stroke-width itself never changed (3 CSS px in both regimes) — "hairline" is
filter erosion plus long-wavelength waver, not a thinner line.

## The regime shift, quantified (controls card, 251×437 px, dark, DPR 2)

Old regime (08f3ddd9): path in a `1000 × 1000/aspect` viewBox, `preserveAspectRatio="none"`,
`vector-effect="non-scaling-stroke"`, CSS `inset: -6px`. Screen scale k = (w+12)/1000 ≈ **0.263**
(k ranges ~0.24–0.37 across the outlined hosts). New regime (working tree
`web/frontend/src/pencil/grid/HandDrawnOutline.vue:44-77`): px-native viewBox, 1:1, both
attributes deleted.

| quantity | W9 on screen | W10 on screen | ratio |
|---|---|---|---|
| grain displacement (`grain-static` scale 2.5, `pencilConfig.ts:147`) | 2.5·k ≈ **0.65 px** | **2.5 px** | 3.8× |
| grain wavelength (baseFrequency 0.04 → 25 units) | ≈ **6.6 px** | **25 px** | 3.8× |
| frame boil (`BOIL_CONFIG.frameBoil` 1.2, `pencilConfig.ts:112` — "viewBox units" by its own comment) | 1.2·k ≈ **0.31 px** | **1.2 px** | 3.9× |
| side wobble maxDisplace | 1.9 px (h) / 3.4 px (v) | 1.88 / 3.28 px | **1.0× — preserved** |
| stroke width | 3 px (non-scaling-stroke) | 3 px (1:1) | 1.0× |
| air between card edge and frame | 6 − 8·k ≈ **3.9 px** | **0 px** (`outset` defaults 0, no caller passes it) | — |
| corners | square, jagged, overshoot ≈ 0.8–1.4 px screen | quarter-arc r=12 (auto-read border-radius), jitter amp `0.5·12·0.06` = **0.36 px** | — |

Filter mechanics: `grain-static` is feTurbulence + feDisplacementMap with primitives in
**userSpaceOnUse** (`SvgFilters.vue:75-89`, `pencilConfig.ts:144-148`). In the old 1000-unit space
those units rendered at k ≈ 0.26; px-native makes them literal. A ±1.25 px displacement at 25 px
wavelength on a 3 px stroke shifts the whole stroke body — the line *wavers* and its core thins to
the hairline in the owner's shot. And because the noise field is static while the path boils under
it at 6.7 fps with 4× the old perturbation, the erosion pattern redistributes every 150 ms —
flicker on top of waver.

The corner change is the "outline was changed herein": `generateRectBoilFrames` grew a `radius`
parameter with arc-sampled corner joins (`gridPaths.ts:154-215`), and HandDrawnOutline auto-reads
the slotted card's border-radius (12 px on `rounded-xl`). Corner jitter amp (0.36 px) is 5–9×
below the adjacent sides' (1.9–3.3 px), so the corners read as clean geometric arcs — and the
owner's screenshot even catches a join discontinuity at top-left. The BEFORE frame was square,
hand-ruled sides crossing with overshoot at the corners, floating ~4 px off the card.

Note: the W10 comment's celebrated "anisotropic wobble side effect" was ≤2% at these aspect
ratios (scale_x 0.263 vs scale_y 0.258) — killing it bought nothing visible.

## Live validation (all screenshots in `a2-shots/`, DPR 2, dark)

- `live-controls-card-bad.png` — working tree as-is: exact reproduction of the owner's
  `boil-hairline.png` (thin waver, smooth arcs, TL corner artifact).
- `live-controls-card-before.png` / `zoom-tl-before.png` — W9 regime reconstructed in-page
  (1000-unit viewBox + PAD 8 + non-scaling-stroke + inset −6px, frames from the live `gridPaths`
  module): square overshot corners, ~4 px air, crisp full-presence stroke.
- `live-controls-card-fixspec.png` / `zoom-tl-fixspec.png` — the fix spec below, injected live
  (px-native geometry, outset 4, radius 0, grain 0.75/0.13, boil 0.45 px): **near-pixel match to
  the W9 reconstruction.** Registration stays px-native by construction.
- `live-controls-card-fix.png` — grain compensation alone: solider core but corners/air still
  wrong. Confirms all three fixes are load-bearing.

## FIX SPEC — keep px-native registration, restore the BEFORE presence

All in `web/frontend/src/pencil/grid/HandDrawnOutline.vue`, `gridPaths.ts`, `pencilConfig.ts`.

1. **Dedicated `grain-outline` preset** (new row in `DEFAULT_PRESETS`, `pencilConfig.ts:144`):
   `{ baseFrequency: 0.13, numOctaves: 3, scale: 0.75, seed: 2 }`, margin 5. HandDrawnOutline's
   path switches to `filter="url(#grain-outline)"`. Derivation: old screen displacement = 2.5·k,
   k* = 0.3 for the host band → scale 0.75; baseFrequency 0.04/0.3 = 0.133 → 0.13. Do NOT retune
   the shared `grain-static` — the grid (1000-unit space), glyphs, and 20–32 px icons still depend
   on its current values. Side effect disclosed: all outline hosts now share one tooth scale
   (before it varied ±25% with host size); at k = 0.24–0.37 the delta from BEFORE is ≤0.15 px.
2. **`outset` default 0 → 4** (or every caller passes `:outset="4"`; default is cleaner — no
   caller passes it today). Restores the old net air (6 px CSS − 8·k path pad ≈ 3.8–4.1 px). The
   outset participates in the same px coordinate system, so registration is unaffected.
3. **Corners back to square**: default `radius` to 0 and delete the auto border-radius read
   (`measuredRadius`/`readRadius`, HandDrawnOutline.vue:31-38) — the BEFORE character is straight
   sides with jagged overshoot crossings, and `generateRectBoilFrames(..., 0)` reproduces it
   exactly (the r=0 branch is bit-identical to W9). Keep the `radius` prop + arc machinery for
   future opt-in; if any host ever opts in, floor the arc jitter at
   `max(roughness·r·0.06, 0.75px)` so corners boil in-family with sides.
4. **Own boil constant**: stop passing the grid's `BOIL_CONFIG.frameBoil` (1.2 — viewBox units by
   its own comment; a unit bug now that the outline is px-native). Add
   `BOIL_CONFIG.outlineBoilPx: 0.45` and pass it as `boilAmount`. Old screen energy was
   0.31–0.44 px across hosts; 1.2 px flat is ~4× hot and feeds the shimmer.
5. **Unchanged**: px-native viewBox + resize-observer measurement (the W10 registration win),
   stroke-width 3 / stroke-opacity 0.95, roughness 0.5 / segments 6 / seed 77 / jagged, 4 frames
   @ 150 ms. No `preserveAspectRatio` / `vector-effect` resurrection — at 1:1 they're no-ops.

Page state after probing: probes removed, `grain-static` reset via `resetPreset`, live svgs
unhidden. No repo file touched.
