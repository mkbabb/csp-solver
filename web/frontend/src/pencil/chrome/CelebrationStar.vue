<script setup lang="ts">
/**
 * The gold-star garnish + the union's foil-gleam tail (design-refinement.md §4.3,
 * design-union.md §4.3). A tiny hand-drawn star draws on at beat-2's crest (~t=2.65→3.0s,
 * inside the ≤3.2s cap) on the shared scheduler's `sequence` kind — then a single 400ms
 * specular sweep crosses it (a CSS `mask-position` animation: compositor-cheap, zero raster
 * ticks, zero backdrop sampling). Fiction: gold-star stickers are foil; foil gleams once when
 * the light catches it.
 *
 * OD-1 default executes: the foil-gleam SHIPS unconditionally (it is severable by design —
 * delete the `.gleam` element to drop it — but it is not gated behind anything here).
 * PRM: the star appears instantly drawn; no gleam ever fires.
 */
import { nextTick, ref, watch, onUnmounted } from 'vue'
import {
  createSequenceSubscription,
  easeOutCubic,
  usePrefersReducedMotion,
  type SequenceHandle,
} from '@mkbabb/pencil-boil'
import { CELEBRATION, YOSHI_COLORS } from '@pencil/config/pencilConfig'

// T3-W10 celestial rewire (F8 §2.2): the star's gold is the celestial family's —
// sparkle fill + rays stroke from YOSHI_COLORS, not duplicated hexes. Values unchanged.
const GOLD = YOSHI_COLORS.celestial.sun

const props = defineProps<{ active: boolean }>()

// Stable template ref (task-4 discipline): the draw-on dashoffset is written imperatively to
// `.style`, never bound, so a re-render can't revert a completed reset.
const starPathRef = ref<SVGPathElement | null>(null)
const visible = ref(false)
const gleaming = ref(false)
const reducedMotion = usePrefersReducedMotion()

let drawSeq: SequenceHandle | null = null
let gleamTimer: ReturnType<typeof setTimeout> | null = null

// A slightly wonky hand-drawn 5-point star (viewBox 0 0 48 48), open at Z for a crayon feel.
const STAR_D =
  'M23.5,4.2 L28.9,17.3 L43.2,18.1 L31.4,26.6 L36,40.4 L24.2,31.7 L12,40 L16.6,26.3 L4.8,17.6 L19.1,17.7 Z'

function reset() {
  if (drawSeq) {
    try { drawSeq.stop() } catch { /* ignore */ }
    drawSeq = null
  }
  if (gleamTimer) {
    clearTimeout(gleamTimer)
    gleamTimer = null
  }
  gleaming.value = false
  visible.value = false
}

async function play(settled = false) {
  reset()
  visible.value = true
  // The <path> mounts on Vue's next flush; a same-tick ref read is null on
  // every first activation, silently skipping the draw-in + gleam.
  await nextTick()
  const el = starPathRef.value
  if (!el) return

  // Settled activation (T3-W12 §1 P5): `active` was already true when this component
  // mounted — a remount while solved (state-derived `celebrating`), not a fresh crest.
  // The sticker is simply THERE, fully drawn: no crest-delayed redraw, no second gleam.
  if (settled || reducedMotion.value) {
    el.style.strokeDasharray = 'none'
    el.style.strokeDashoffset = '0'
    return // no gleam under PRM / on a settled remount
  }

  const len = el.getTotalLength()
  el.style.strokeDasharray = String(len)
  el.style.strokeDashoffset = String(len)

  drawSeq = createSequenceSubscription({
    durationMs: CELEBRATION.starDrawInMs,
    delayMs: CELEBRATION.starCrestMs,
    easing: easeOutCubic,
    onProgress: (eased) => {
      el.style.strokeDashoffset = String(len * (1 - eased))
    },
    onComplete: () => {
      el.style.strokeDasharray = 'none'
      el.style.strokeDashoffset = '0'
      // Union foil-gleam tail — one sweep, then it goes quiet (a moment, not a state).
      gleaming.value = true
      gleamTimer = setTimeout(() => {
        gleaming.value = false
        gleamTimer = null
      }, CELEBRATION.gleamMs + 80)
    },
  })
  drawSeq.start()
}

// `immediate` + the `prev === undefined` probe: a component that MOUNTS with
// active=true (remount while solved) settles instantly; a live false→true flip
// keeps the full crest choreography. The composition survives remounts (§1 P5).
watch(
  () => props.active,
  (a, prev) => {
    if (a) play(prev === undefined)
    else reset()
  },
  { immediate: true },
)

onUnmounted(reset)
</script>

<template>
  <div v-if="visible" class="celebration-star" aria-hidden="true">
    <svg class="star-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path
        ref="starPathRef"
        :d="STAR_D"
        :fill="GOLD.sparkle"
        fill-opacity="0.9"
        :stroke="GOLD.rays"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
        filter="url(#grain-static)"
      />
    </svg>
    <div class="gleam" :class="{ play: gleaming }"></div>
  </div>
</template>

<style scoped>
/* T3-W9 §2: the star is a foil sticker pressed into the completion block's slot —
   in flow beside the verdict (the slot owns the 3.25rem square), no overlay anchor,
   no z-index. Collision with the margin text impossible by construction. `relative`
   with zero offsets is the in-flow ("static") placement the hoist asks for, kept
   positioned only so the gleam's `inset: 0` keeps anchoring to the star itself. */
.celebration-star {
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.star-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Foil-gleam: a diagonal specular band masked over a gold plate, swept once via
   mask-position — a compositor transform, no repaint, no raster tick. */
.gleam {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, #fde68a, #fffdf0 55%, #fde68a);
  -webkit-mask-image: linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.85) 50%, transparent 60%);
  mask-image: linear-gradient(105deg, transparent 40%, hsl(0 0% 100% / 0.85) 50%, transparent 60%);
  -webkit-mask-size: 260% 100%;
  mask-size: 260% 100%;
  -webkit-mask-position: 160% 0;
  mask-position: 160% 0;
  mix-blend-mode: screen;
  opacity: 0;
  pointer-events: none;
}

.gleam.play {
  animation: gleam-sweep 400ms linear 1;
}

@keyframes gleam-sweep {
  0% {
    -webkit-mask-position: 160% 0;
    mask-position: 160% 0;
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    -webkit-mask-position: -160% 0;
    mask-position: -160% 0;
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gleam.play {
    animation: none;
    opacity: 0;
  }
}
</style>
