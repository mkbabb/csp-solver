<script setup lang="ts">
import { computed } from "vue";
import { heldFrameCount } from "@mkbabb/pencil-boil";
import { generateLineBoilFrames } from "@pencil/grid/gridPaths";
import { BOIL_CONFIG, beatsFor } from "@pencil/config/pencilConfig";
import { useBeatFrame } from "@pencil/composables/boilBeat";

/**
 * Self-contained hand-drawn "boiling" divider line. Extracted from `ControlPanel.vue`,
 * where it was hand-inlined verbatim at two template sites (mobile + desktop layout
 * variants) — pure pencil chrome with zero sudoku semantics, now a single pencil-local
 * component consumed twice instead.
 *
 * W7 (topology) extracted it on `@mkbabb/pencil-boil`'s `useLineBoil`; W8 migrates it
 * onto the unified rAF scheduler (`useBoilFrame`) so the two mounted instances stop
 * being an independent rAF chain — this is the move-created 4th chain the W8 §Unified
 * scheduler spec calls out.
 *
 * T3-W13 §1-P2: the per-beat `d`-swap under the live filter was one of the six
 * per-beat painters (b1's inventory, node 1002). The geometric bake FAILED this
 * surface's soul gate — the divider is 100% stroke, so a differently-realized noise
 * field can't correlate window-wise (measured SSIM 0.809 @DPR2 settled vs the
 * live-filter reference; gate 0.983) — so the surface takes the wave's banked
 * per-surface fallback: a grain-hoist stack (P3 mechanics, the grid's steady-state
 * template verbatim). Each pose is a STATIC sibling `<g>` carrying grain-static
 * (params never written per beat — the SvgFilters watcher only writes wobble
 * presets), so each rasters ONCE; the beat only flips opacity. Steady-state raster:
 * zero, look byte-faithful (same filter, same field). Measured memory price
 * recorded in the W13 l4 lane report: 4 poses × ~531×31 device px × 4B ≈ 0.26 MB.
 */
const dividerFrames = computed(() =>
  generateLineBoilFrames(
    20,
    8,
    980,
    8,
    { roughness: 0.2, segments: 3, seed: 314, jagged: true },
    BOIL_CONFIG.frameBoil,
    BOIL_CONFIG.frameCount,
  ),
);
// WebKit paints SVG content unlayered — `will-change: opacity` on an inner <g> earns
// no compositor layer there — so each beat's opacity flip re-rasters the live
// grain-static pose through the surrounding card's filter chain: measured ~10 fps
// steady-state on desktop Safari against the deployed edge (2026-07-15), recovering
// to 98 fps with the divider pinned. This is the app's ONE remaining live-filtered
// pose stack (the geometric grain bake failed this surface's SSIM soul gate — see
// the note above), so the engine gate lives here and nowhere else: on Apple WebKit
// the divider holds pose 0 (a static hand-drawn line, byte-faithful); Chromium and
// Firefox keep the full boil, where the flip really is compositor-only. The ≤1
// frameCount contract freezes in place without a new mechanism.
const LIVE_FILTER_FROZEN =
  typeof navigator !== "undefined" && navigator.vendor === "Apple Computer, Inc.";

// Freeze-in-place while the answer-key laminate holds the page (W9 §2). On the
// shared beat (T3-W12 §2 P1) so both mounted instances swap in the same dirty frame
// as the rest of the page's boils.
const dividerFrame = useBeatFrame(
  heldFrameCount(() => (LIVE_FILTER_FROZEN ? 1 : BOIL_CONFIG.frameCount)),
  () => beatsFor(BOIL_CONFIG.intervalMs),
);
</script>

<template>
  <div class="boil-divider-wrap">
    <!-- T3-W13 §1-P2 fallback — grain-hoist stack (the grid's steady-state template
         VERBATIM, filter kept): static geometry per sibling, grain-static rasters
         once each, the beat only flips opacity. -->
    <svg
      viewBox="0 0 1000 16"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        v-for="(d, f) in dividerFrames"
        :key="f"
        class="boil-pose"
        :class="{ 'is-active': dividerFrame === f }"
        filter="url(#grain-static)"
      >
        <path
          :d="d"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-opacity="0.7"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.boil-divider-wrap {
  position: relative;
  height: 14px;
}

.boil-divider-wrap svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* The grid hoist's sibling discipline (HandDrawnGrid.vue): each pose promoted so
   the beat's opacity toggle is a compositor-only blend, never a repaint. */
.boil-pose {
  opacity: 0;
  will-change: opacity;
}

.boil-pose.is-active {
  opacity: 1;
}
</style>
