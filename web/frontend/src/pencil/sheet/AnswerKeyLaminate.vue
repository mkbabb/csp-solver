<script setup lang="ts">
/**
 * Answer-key laminate — the flagship translucent object (design-union §3 row 9).
 * Physical object: a clear laminated answer key, held over your page. Press-and-
 * hold (or K) → the boil freezes IN PLACE, a board-shaped laminate lays down over
 * it, and the missing answers print in teacher-red through the milk. Release/Esc/K
 * → it lifts away and your own entries are untouched.
 *
 * OD-1 (no-glass build): the laminate is blur-0 — its `.sheet-laminate` class
 * carries no glass filter, so the board shows through the milk dimmed but not
 * blurred (in-family with glass-ui's own blur-0 plate). Kill-gate discipline:
 * mounted as a SIBLING over the board (never inside HandDrawnGrid's filtered
 * group), no scrim, no nested translucent surface; pointer-events pass through.
 *
 * BLOCKING PRT fix (W9 §3): under prefers-reduced-transparency the laminate goes
 * fully opaque (construction paper — the fallback IS pure pencil). The board no
 * longer shows THROUGH it, so an "answers only over blanks" key would leave holes
 * where the givens were. When opaque we therefore render the COMPLETE solution —
 * every cell, givens included — a standalone printed key.
 */
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { getVariant, toDisplayChar } from '@pencil/glyph/glyphRegistry'
import { acquireHold, releaseHold } from '@pencil/composables/boilHoldGate'

const props = defineProps<{
  active: boolean
  solution: Record<string, number>
  boardSize: number
  subgridSize: number
  /** pristine given positions — these already sit on the page, no key needed
   *  UNLESS the laminate is opaque (PRT), when the whole key must be printed. */
  originalGivenCells: Set<string>
}>()

const LIFT_MS = 200

// prefers-reduced-transparency OR prefers-contrast: more — index.css flips the
// sheet to opaque construction paper under BOTH arms, so the ref must track
// both or the opaque sheet renders holes (the PRT defect, resurfaced under the
// contrast arm). When opaque we render the COMPLETE key — the blocking fix.
const opaqueQueries =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? [
        window.matchMedia('(prefers-reduced-transparency: reduce)'),
        window.matchMedia('(prefers-contrast: more)'),
      ]
    : []
const opaque = ref(opaqueQueries.some((q) => q.matches))
function onOpaqueChange() {
  opaque.value = opaqueQueries.some((q) => q.matches)
}
onMounted(() => opaqueQueries.forEach((q) => q.addEventListener('change', onOpaqueChange)))
onUnmounted(() => opaqueQueries.forEach((q) => q.removeEventListener('change', onOpaqueChange)))

const render = ref(false) // in the DOM (mounted through the lift-out window)
const shown = ref(false) // opacity/scale target (drives the lay/lift transition)
const announce = ref('')
let unmountTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.active,
  (a) => {
    if (a) {
      if (unmountTimer) {
        clearTimeout(unmountTimer)
        unmountTimer = null
      }
      acquireHold('answer-key') // freeze the page IN PLACE
      render.value = true
      announce.value = 'peeking at the answer key'
      requestAnimationFrame(() => {
        shown.value = true // trigger lay-down flourish
      })
    } else {
      shown.value = false // trigger lift-away
      announce.value = ''
      unmountTimer = setTimeout(() => {
        render.value = false
        releaseHold('answer-key') // boil resumes mid-cadence
        unmountTimer = null
      }, LIFT_MS)
    }
  },
)

onUnmounted(() => {
  if (unmountTimer) clearTimeout(unmountTimer)
  releaseHold('answer-key')
})

// Board-shape-agnostic cellRects: a per-cell rectangle (fractional % of the
// board box) derived purely from boardSize — no hardcoded size, no reliance on
// CSS-grid auto-placement — so the printed key aligns to the uniform .board-cells
// grid at every board size (4×4 … 25×25) and survives any future non-square layout.
interface KeyCell {
  pos: number
  d: string
  leftPct: number
  topPct: number
  sizePct: number
}
const keyCells = computed<KeyCell[]>(() => {
  const out: KeyCell[] = []
  const n = props.boardSize
  const total = n * n
  const sizePct = 100 / n
  for (let pos = 0; pos < total; pos++) {
    const key = String(pos)
    const isGiven = props.originalGivenCells.has(key)
    // Translucent laminate: givens already show through the milk — key the blanks
    // only. Opaque (PRT) laminate: nothing shows through — print EVERY cell.
    if (isGiven && !opaque.value) continue
    const val = props.solution[key]
    if (!val) continue
    const char = toDisplayChar(val, n)
    const glyph = getVariant(char, pos)
    if (!glyph) continue
    out.push({
      pos,
      d: glyph.d,
      leftPct: (pos % n) * sizePct,
      topPct: Math.floor(pos / n) * sizePct,
      sizePct,
    })
  }
  return out
})
</script>

<template>
  <div
    v-if="render"
    class="answer-key-laminate sheet-laminate"
    :class="{ 'is-shown': shown }"
    aria-hidden="true"
  >
    <div
      v-for="cell in keyCells"
      :key="cell.pos"
      class="key-cell"
      :style="{
        left: cell.leftPct + '%',
        top: cell.topPct + '%',
        width: cell.sizePct + '%',
        height: cell.sizePct + '%',
      }"
    >
      <svg class="key-glyph" viewBox="0 0 40 56" xmlns="http://www.w3.org/2000/svg">
        <path
          :d="cell.d"
          fill="none"
          stroke="var(--color-teacher-red)"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
  <!-- marginalia: the teacher's murmur, announced to AT -->
  <span class="sr-only" role="status">{{ announce }}</span>
</template>

<style scoped>
.answer-key-laminate {
  position: absolute;
  inset: 0;
  z-index: 3; /* above the cells layer, a sibling over the board — never inside its <g> */
  border-radius: 0.75rem; /* match board-wrapper rounded-xl */
  pointer-events: none;
  /* lift-away (leaving): fast + easeInCubic (the erase-family asymmetry) */
  opacity: 0;
  transform: scale(1.02);
  transition:
    opacity 200ms cubic-bezier(0.55, 0.055, 0.675, 0.19),
    transform 200ms cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.answer-key-laminate.is-shown {
  /* lay-down (arriving): the physical-flourish curve, 280ms */
  opacity: 1;
  transform: scale(1);
  transition:
    opacity 280ms cubic-bezier(0.34, 1.56, 0.64, 1),
    transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.key-cell {
  position: absolute;
}

.key-glyph {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 65%;
  height: 65%;
  opacity: 0;
  /* pre-printed: flat 150ms fade, no draw-in, no stagger */
  animation: keyFade 150ms linear forwards;
}

@keyframes keyFade {
  to {
    opacity: 0.9;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .answer-key-laminate,
  .answer-key-laminate.is-shown {
    transform: none;
    transition: opacity 150ms linear;
  }
  .key-glyph {
    animation: none;
    opacity: 0.9;
  }
}
</style>
