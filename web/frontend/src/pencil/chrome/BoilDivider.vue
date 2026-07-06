<script setup lang="ts">
import { computed } from 'vue'
import { useBoilFrame } from '@pencil/composables/boilScheduler'
import { heldFrameCount } from '@pencil/composables/boilHoldGate'
import { generateLineBoilFrames } from '@pencil/grid/gridPaths'
import { BOIL_CONFIG } from '@pencil/config/pencilConfig'

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
 */
const dividerFrames = computed(() =>
  generateLineBoilFrames(
    20, 8, 980, 8,
    { roughness: 0.2, segments: 3, seed: 314, jagged: true },
    BOIL_CONFIG.frameBoil, BOIL_CONFIG.frameCount,
  )
)
// Freeze-in-place while the answer-key laminate holds the page (W9 §2).
const { currentFrame: dividerFrame } = useBoilFrame(
  heldFrameCount(() => BOIL_CONFIG.frameCount),
  () => BOIL_CONFIG.intervalMs,
)
const dividerPath = computed(() => dividerFrames.value[dividerFrame.value] ?? '')
</script>

<template>
  <div class="boil-divider-wrap">
    <svg viewBox="0 0 1000 16" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path
        :d="dividerPath"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-opacity="0.7"
        stroke-linejoin="round"
        stroke-linecap="round"
        filter="url(#grain-static)"
      />
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
</style>
