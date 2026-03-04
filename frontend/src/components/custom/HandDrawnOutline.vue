<script setup lang="ts">
import { computed, ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useLineBoil } from '@mkbabb/pencil-boil'
import { generateRectBoilFrames } from '@/lib/gridPaths'
import { BOIL_CONFIG } from '@/lib/pencilConfig'

const VIEWBOX = 1000
const PAD = 8

const containerRef = ref<HTMLElement | null>(null)
const width = ref(0)
const height = ref(0)

useResizeObserver(containerRef, (entries) => {
  const entry = entries[0]
  if (entry) {
    width.value = entry.contentRect.width
    height.value = entry.contentRect.height
  }
})

const { currentFrame } = useLineBoil(
  () => BOIL_CONFIG.frameCount,
  () => BOIL_CONFIG.intervalMs,
)

const frames = computed(() => {
  if (width.value === 0 || height.value === 0) return []
  const aspect = width.value / height.value
  const vbW = VIEWBOX
  const vbH = VIEWBOX / aspect
  return generateRectBoilFrames(
    PAD, PAD, vbW - PAD * 2, vbH - PAD * 2,
    { roughness: 0.5, segments: 6, seed: 77, jagged: true },
    BOIL_CONFIG.frameBoil, BOIL_CONFIG.frameCount,
  )
})

const viewBox = computed(() => {
  if (width.value === 0 || height.value === 0) return `0 0 ${VIEWBOX} ${VIEWBOX}`
  const aspect = width.value / height.value
  return `0 0 ${VIEWBOX} ${VIEWBOX / aspect}`
})

const currentPath = computed(() => frames.value[currentFrame.value] ?? '')
</script>

<template>
  <div ref="containerRef" class="outline-container">
    <slot />
    <svg
      v-if="currentPath"
      class="outline-svg"
      :viewBox="viewBox"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        :d="currentPath"
        fill="none"
        stroke="currentColor"
        stroke-width="6"
        stroke-opacity="0.95"
        stroke-linejoin="round"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
        filter="url(#grain-static)"
      />
    </svg>
  </div>
</template>

<style scoped>
.outline-container {
  position: relative;
}

.outline-svg {
  position: absolute;
  inset: -4px;
  width: calc(100% + 8px);
  height: calc(100% + 8px);
  pointer-events: none;
  z-index: 1;
}
</style>
