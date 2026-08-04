# The wordmark first-frames "clip" (G2's hand-off) — adjudicated NOT A DEFECT

G2's W7 report handed the chair: "the wordmark paints clipped for the first frames after
every mount ('sudok', 'kenke') and completes when the bake lands — reproduced in the built
dist as well as dev."

## What the probes found

Per-frame rAF capture of `viewBox.width` vs the measuring text's `getBBox` run (`fit`),
counting every frame where ink exceeds the box, on the built dist:

| scenario | chromium | webkit |
|---|---|---|
| cold mount (capture armed pre-boot) | 0 / 88 frames | 0 / 90 |
| gallery open (svg re-created, `:is` swap) | 0 / 30 | 0 / 30 |
| return from gallery | 0 / 90 | 0 / 90 |
| cold mount, Fraunces delayed 600ms | 0 / 120 | 0 / 120 |

`vb == fit` from the first frame the svg exists, every scenario. The suspected mechanisms
are each exonerated by construction:

- The `estimateWidth` seed (34 u/glyph, pre-`opsz 52` calibration) never paints: `measure()`
  runs in a microtask that beats first paint.
- The `:is` button↔span swap re-creates the ELEMENT, not the component — `vbWidth`,
  `isDrawn`, and the raster stack survive a gallery round trip, so remounts paint whole.
- The font-swap window closes the same way: the `fonts.ready` re-measure's forced layout
  sees the activated face before the swap's own paint (0 overflow frames at 600ms delay).

## What G2 saw

The authored reveal: `clip-path: inset(0 100% 0 0) → inset(0 0% 0 0)` over 1.2s on cold
mount (T3-era, `--ease-noteWrite`). A left→right wipe paints "sudok" mid-beat by design,
and it completes on the same timescale the first bake lands — matching the hand-off's
description exactly. Whether the wipe should survive is a design ballot for the owner's
re-look, not a bug row.

Probe scripts: session scratchpad `wordmark-clip-probe.mjs` / `wordmark-clip-slowfont.mjs`.
