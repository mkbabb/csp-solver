<script setup lang="ts">
import { computed } from 'vue'
import { useLineBoil } from '@mkbabb/pencil-boil'
import { generateLineBoilFrames } from '@pencil/grid/gridPaths'
import { BOIL_CONFIG } from '@pencil/config/pencilConfig'

/**
 * Self-contained hand-drawn "boiling" divider line. Extracted from `ControlPanel.vue`,
 * where it was hand-inlined verbatim at two template sites (mobile + desktop layout
 * variants) — pure pencil chrome with zero sudoku semantics, now a single pencil-local
 * component consumed twice instead.
 *
 * W7 (topology) extracts it on `@mkbabb/pencil-boil`'s `useLineBoil` — the same primitive
 * `ControlPanel.vue` inlined. Its migration onto the unified rAF scheduler (so it stops
 * being an independent rAF chain) is W8's — see W8 §Unified scheduler ("Migrate
 * BoilDivider.vue — the move-created 4th rAF chain").
 */
const dividerFrames = computed(() =>
  generateLineBoilFrames(
    20, 8, 980, 8,
    { roughness: 0.2, segments: 3, seed: 314, jagged: true },
    BOIL_CONFIG.frameBoil, BOIL_CONFIG.frameCount,
  )
)
const { currentFrame: dividerFrame } = useLineBoil(
  () => BOIL_CONFIG.frameCount,
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
