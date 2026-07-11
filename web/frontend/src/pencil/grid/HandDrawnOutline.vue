<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useBoilFrame } from '@mkbabb/pencil-boil'
import { generateRectBoilFrames } from './gridPaths'
import { BOIL_CONFIG } from '@pencil/config/pencilConfig'

// Px-native geometry — registration by construction (T3-W10 F1). The path is generated
// in a viewBox equal to the measured px border box padded by `outset` on every side:
// one number, one coordinate system, so the frame hugs its card at EVERY host size.
// (The old mixed system — a fixed -6px CSS outset against a proportional 8/1000-unit
// path inset — only registered at one size; the popover, the smallest host by 3–4×,
// floated ~5–6px.) Scale is 1:1, so preserveAspectRatio="none", vector-effect, and the
// anisotropic-wobble side effect all vanish.
const props = withDefaults(defineProps<{
  strokeWidth?: number
  /** Air between the card's border box and the drawn frame, in px (per-host tunable). */
  outset?: number
  /** Corner radius in px. Omit to read the slotted card's own border-radius token. */
  radius?: number
}>(), {
  strokeWidth: 6,
  outset: 0,
  radius: undefined,
})

const containerRef = ref<HTMLElement | null>(null)
const width = ref(0)
const height = ref(0)

// Radius agreement by construction: the slotted card's computed border-radius IS the
// source — single token, no duplicated literal — unless a host passes `radius`.
const measuredRadius = ref(0)
function readRadius() {
  const el = containerRef.value?.firstElementChild
  if (!(el instanceof HTMLElement)) return
  measuredRadius.value = Number.parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0
}

useResizeObserver(containerRef, (entries) => {
  const entry = entries[0]
  if (entry) {
    width.value = entry.contentRect.width
    height.value = entry.contentRect.height
    readRadius()
  }
})

onMounted(readRadius)

const { currentFrame } = useBoilFrame(
  () => BOIL_CONFIG.frameCount,
  () => BOIL_CONFIG.intervalMs,
)

const radius = computed(() => props.radius ?? measuredRadius.value)

const frames = computed(() => {
  if (width.value === 0 || height.value === 0) return []
  const vbW = width.value + props.outset * 2
  const vbH = height.value + props.outset * 2
  return generateRectBoilFrames(
    0, 0, vbW, vbH,
    { roughness: 0.5, segments: 6, seed: 77, jagged: true },
    BOIL_CONFIG.frameBoil, BOIL_CONFIG.frameCount,
    radius.value,
  )
})

const viewBox = computed(
  () => `0 0 ${width.value + props.outset * 2} ${height.value + props.outset * 2}`,
)

const currentPath = computed(() => frames.value[currentFrame.value] ?? '')
</script>

<template>
  <div
    ref="containerRef"
    class="outline-container"
    :style="{ '--outline-outset': `${props.outset}px` }"
  >
    <slot />
    <svg
      v-if="currentPath"
      class="outline-svg"
      :viewBox="viewBox"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        :d="currentPath"
        fill="none"
        stroke="currentColor"
        :stroke-width="props.strokeWidth"
        stroke-opacity="0.95"
        stroke-linejoin="round"
        stroke-linecap="round"
        filter="url(#grain-static)"
      />
    </svg>
  </div>
</template>

<style scoped>
.outline-container {
  position: relative;
  overflow: visible;
}

.outline-svg {
  position: absolute;
  inset: calc(var(--outline-outset, 0px) * -1);
  width: calc(100% + var(--outline-outset, 0px) * 2);
  height: calc(100% + var(--outline-outset, 0px) * 2);
  pointer-events: none;
  z-index: 1;
  overflow: visible;
}
</style>
