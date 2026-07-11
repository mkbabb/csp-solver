<script setup lang="ts">
/**
 * The felt heart at the crest — F2-C's reward, rendered as F7 §3.2's Heart Fruit
 * (T3-W9). Board BOTTOM-RIGHT, ~2.75rem, shared Sudoku/Futoshiki — the diagonal
 * opposite of the margin text, so the star-note collision class dies by geometry.
 *
 * This component owns the celebration variant's MOTION only; CrayonHeart owns the
 * geometry. Budget: ONE transient `sequence` subscriber (the bounce) + ONE setTimeout
 * (the blink) + a CSS-keyframe murmur wiggle (zero subscribers) — inside the
 * chains=1/subscribers=10 envelope; the heart settles ≈3.2s, at the crest cap.
 *
 * Every scale/squash/blink transform lands on this HOST WRAPPER or the eyes group —
 * never the filtered <g> (#wobble-heart's ±10% region stays honest, and the preset
 * itself is NEVER retuned: three hover easter eggs share it, F7 §1.4).
 *
 * PRM: mounts static at scale 1 — no bounce, no blink; the murmur wiggle no-ops.
 */
import { nextTick, ref, watch, onUnmounted } from 'vue'
import {
  createSequenceSubscription,
  usePrefersReducedMotion,
  type SequenceHandle,
} from '@mkbabb/pencil-boil'
import { CELEBRATION } from '@pencil/config/pencilConfig'
import { registerMurmurHeart, unregisterMurmurHeart } from '@pencil/composables/celebration'
import CrayonHeart from './AttributionCard/CrayonHeart.vue'

const props = defineProps<{ active: boolean }>()

// Stable template ref (task-4 discipline): the bounce transform is written imperatively
// to `.style`, never bound, so a re-render can't revert a settled frame.
const hostRef = ref<HTMLDivElement | null>(null)
const visible = ref(false)
const blinking = ref(false)
const murmuring = ref(false)
const reducedMotion = usePrefersReducedMotion()

let bounceSeq: SequenceHandle | null = null
let blinkTimer: ReturnType<typeof setTimeout> | null = null
let blinkEndTimer: ReturnType<typeof setTimeout> | null = null
let murmurEndTimer: ReturnType<typeof setTimeout> | null = null

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/** The reciprocal-axis squash IS the entire Yoshi bounce (F7 §3.2):
 *  grow 0 → (1.15, 0.92) wide-and-squashed, rebound to (0.97, 1.02) tall,
 *  settle at 1 — an overall scale 0 → ~1.12 → 1 read, nothing snaps. */
function bounceTransform(p: number): string {
  let sx: number
  let sy: number
  if (p < 0.55) {
    const t = easeOut(p / 0.55)
    sx = lerp(0, 1.15, t)
    sy = lerp(0, 0.92, t)
  } else if (p < 0.8) {
    const t = easeOut((p - 0.55) / 0.25)
    sx = lerp(1.15, 0.97, t)
    sy = lerp(0.92, 1.02, t)
  } else {
    const t = easeOut((p - 0.8) / 0.2)
    sx = lerp(0.97, 1, t)
    sy = lerp(1.02, 1, t)
  }
  return `scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`
}

/** Murmur participation (F2 §C): 1-in-8 seeded windows the classroom's wiggle is
 *  the heart's. A one-shot CSS keyframe on the host wrapper — zero subscribers. */
function wiggleOnce() {
  if (reducedMotion.value || blinking.value) return
  if (murmurEndTimer) clearTimeout(murmurEndTimer)
  murmuring.value = false
  // Two-frame retrigger so the keyframe restarts on repeat windows.
  requestAnimationFrame(() => {
    murmuring.value = true
    murmurEndTimer = setTimeout(() => {
      murmuring.value = false
      murmurEndTimer = null
    }, 650)
  })
}

function scheduleBlink() {
  // ONE blink, ~1.8s post-settle: eyes grouped, scaleY(0.1) held 140ms, once.
  blinkTimer = setTimeout(() => {
    blinkTimer = null
    blinking.value = true
    blinkEndTimer = setTimeout(() => {
      blinking.value = false
      blinkEndTimer = null
    }, 140)
  }, CELEBRATION.heartBlinkDelayMs)
}

function reset() {
  if (bounceSeq) {
    try { bounceSeq.stop() } catch { /* ignore */ }
    bounceSeq = null
  }
  for (const t of [blinkTimer, blinkEndTimer, murmurEndTimer]) {
    if (t) clearTimeout(t)
  }
  blinkTimer = blinkEndTimer = murmurEndTimer = null
  blinking.value = false
  murmuring.value = false
  unregisterMurmurHeart()
  visible.value = false
}

async function play(settled = false) {
  reset()
  visible.value = true
  await nextTick()
  const el = hostRef.value
  if (!el) return

  if (settled || reducedMotion.value) {
    // PRM, or a settled activation (T3-W12 §1 P5 — mounted with `active` already
    // true, i.e. a remount while solved): the reward is simply there — static at
    // scale 1, no bounce, no blink; it still murmurs with the classroom.
    el.style.transform = 'scale(1)'
    registerMurmurHeart({ wiggleOnce }) // wiggleOnce PRM-gates itself
    return
  }

  el.style.transform = 'scale(0)'
  bounceSeq = createSequenceSubscription({
    durationMs: CELEBRATION.heartBounceMs,
    delayMs: CELEBRATION.heartCrestMs,
    easing: (t: number) => t, // piecewise-eased inside bounceTransform
    onProgress: (p) => {
      el.style.transform = bounceTransform(p)
    },
    onComplete: () => {
      el.style.transform = 'scale(1)'
      scheduleBlink()
      registerMurmurHeart({ wiggleOnce })
    },
  })
  bounceSeq.start()
}

// `immediate` + the `prev === undefined` probe: mounted-with-active (a remount while
// solved) settles instantly; a live false→true flip keeps the crest bounce (§1 P5).
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
  <div
    v-if="visible"
    ref="hostRef"
    class="celebration-heart"
    :class="{ 'is-blinking': blinking, 'is-murmuring': murmuring }"
    aria-hidden="true"
  >
    <CrayonHeart variant="celebration" :size="44" />
  </div>
</template>

<style scoped>
/* Straddles the board's bottom-right corner — the sticker register, diagonal
   opposite of the margin voice. T3-W12 §1 R1: risen to 3.5rem at bottom -0.4rem —
   CROWNING the corner instead of grazing the fold (the a1 forensics had its old
   -1.1rem overhang ending 7px shy of the viewport edge at 1440×806). */
.celebration-heart {
  position: absolute;
  right: -0.9rem;
  bottom: -0.4rem;
  width: 3.5rem;
  height: 3.5rem;
  pointer-events: none;
  z-index: 3;
  transform: scale(0); /* pre-crest; play() takes over imperatively */
  will-change: transform;
}

.celebration-heart :deep(svg) {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* The blink: eyes grouped inside the (unscaled) filtered content — squashing an
   interior child never grows the filter region. Held 140ms, then released. */
.celebration-heart :deep(.eyes) {
  transform-box: view-box;
  transform-origin: 50px 40px;
}
.celebration-heart.is-blinking :deep(.eyes) {
  transform: scaleY(0.1);
}

/* Murmur wiggle — one soft toy-bob on the host wrapper, then still. CSS keyframes
   beat the inline settled transform for the animation's duration, then hand back. */
.celebration-heart.is-murmuring {
  animation: heart-murmur 600ms ease-in-out 1;
}

@keyframes heart-murmur {
  0% {
    transform: scale(1, 1);
  }
  35% {
    transform: scale(1.06, 0.94) rotate(-2deg);
  }
  70% {
    transform: scale(0.97, 1.03) rotate(1.5deg);
  }
  100% {
    transform: scale(1, 1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .celebration-heart {
    transform: scale(1);
  }
  .celebration-heart.is-murmuring {
    animation: none;
  }
  .celebration-heart.is-blinking :deep(.eyes) {
    transform: none;
  }
}
</style>
