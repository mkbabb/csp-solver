<script setup lang="ts">
/**
 * Futoshiki control panel — own file, not shared with Sudoku's (games never import each
 * other; F5 flags `size` vs `board_size` as a live footgun against any shared-panel
 * temptation). Structurally the Sudoku panel minus the difficulty section (F3): a single
 * board-size selector, the hold-to-peek BoilDivider, and the three action buttons.
 */
import { computed, ref, onBeforeUnmount } from 'vue'
import { Eraser } from 'lucide-vue-next'
import SolveIcon from '@pencil/chrome/SolveIcon.vue'
import DiceIcon from '@pencil/chrome/DiceIcon.vue'
import OptionSelector from '@pencil/chrome/OptionSelector/OptionSelector.vue'
import BoilDivider from '@pencil/chrome/BoilDivider.vue'
import SheetWashiLabel from '@pencil/sheet/SheetWashiLabel.vue'
import ScribbleLoader from '@pencil/chrome/ScribbleLoader.vue'
import { useTheme } from '@/composables/useTheme'
import { useButtonAnimation } from '@pencil/composables/useButtonAnimation'
import { boardSizeOptions } from './constants'

const { isDark } = useTheme()

// Underline boil: brief burst on selection change, then settle
const boilFrame = ref(0)
let boilTimer: ReturnType<typeof setTimeout> | null = null

function triggerBoil() {
  if (boilTimer) clearTimeout(boilTimer)
  let frame = 1
  boilFrame.value = frame
  const tick = () => {
    frame++
    if (frame >= 5) {
      boilFrame.value = 0
      boilTimer = null
      return
    }
    boilFrame.value = frame
    boilTimer = setTimeout(tick, 120)
  }
  boilTimer = setTimeout(tick, 120)
}

const panelFilter = computed(() => (isDark.value ? 'url(#stroke-dark)' : 'url(#stroke-light)'))

defineProps<{
  boardSize: number
  loading: boolean
  solveState: string
  mobile?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:boardSize', value: number): void
  (e: 'randomize'): void
  (e: 'clear'): void
  (e: 'solve'): void
  (e: 'peek-start'): void
  (e: 'peek-end'): void
}>()

// ── Hold-to-peek gesture on the BoilDivider (the hold surface) ──
const PEEK_HOLD_MS = 350
let peekTimer: ReturnType<typeof setTimeout> | null = null
const isPeeking = ref(false)

function onDividerHoldStart() {
  if (peekTimer) clearTimeout(peekTimer)
  peekTimer = setTimeout(() => {
    peekTimer = null
    isPeeking.value = true
    emit('peek-start')
  }, PEEK_HOLD_MS)
}

function onDividerHoldEnd() {
  if (peekTimer) {
    clearTimeout(peekTimer)
    peekTimer = null
  }
  if (isPeeking.value) {
    isPeeking.value = false
    emit('peek-end')
  }
}

onBeforeUnmount(() => {
  if (peekTimer) clearTimeout(peekTimer)
  if (isPeeking.value) emit('peek-end')
})

const { animating: solveAnimating, trigger: triggerSolve } = useButtonAnimation(500)
const { animating: randomizeAnimating, trigger: triggerRandomize } = useButtonAnimation(500)
const { animating: clearAnimating, trigger: triggerClear } = useButtonAnimation(400)

function onRandomize() {
  triggerRandomize()
  emit('randomize')
}

function onClear() {
  triggerClear()
  emit('clear')
}

function onSolve() {
  triggerSolve()
  emit('solve')
}

function onBoardSizeChange(val: string | number) {
  emit('update:boardSize', val as number)
  triggerBoil()
}
</script>

<template>
  <!-- Mobile layout -->
  <div v-if="mobile" class="control-panel-wrap mobile-control-panel mt-3">
    <div class="control-panel-filtered">
      <div class="mobile-heading-row">
        <h2 class="section-heading text-muted-foreground" aria-label="Board size">Board Size</h2>
      </div>

      <OptionSelector
        :options="boardSizeOptions"
        :selected="boardSize"
        :boil-frame="boilFrame"
        mobile
        @change="onBoardSizeChange"
      />
    </div>

    <!-- Hold the boiling divider to peek at the answer key. -->
    <div
      class="peek-hold-surface"
      title="Hold to peek at the answer key"
      @pointerdown="onDividerHoldStart()"
      @pointerup="onDividerHoldEnd()"
      @pointerleave="onDividerHoldEnd()"
      @pointercancel="onDividerHoldEnd()"
    >
      <BoilDivider />
    </div>

    <!-- Action buttons -->
    <div class="flex items-center justify-evenly">
      <button @click="onRandomize()" :disabled="loading" class="icon-btn" aria-label="Randomize board">
        <DiceIcon :size="28" :playing="randomizeAnimating" />
      </button>
      <button @click="onClear()" :disabled="loading" class="icon-btn" aria-label="Clear board">
        <span :class="{ 'eraser-scrub': clearAnimating }">
          <Eraser :size="28" />
        </span>
      </button>
      <button @click="onSolve()" :disabled="loading" class="icon-btn" aria-label="Solve puzzle">
        <ScribbleLoader v-if="loading && !solveAnimating" :size="22" class="text-muted-foreground" />
        <SolveIcon v-else :size="28" class="sparkle-icon" :playing="solveAnimating" />
      </button>
    </div>
  </div>

  <!-- Desktop layout -->
  <div v-else class="control-panel-wrap flex flex-col items-center md:items-stretch">
    <div class="control-panel-filtered flex flex-col items-center md:items-stretch">
      <div class="flex flex-col items-center gap-1 md:items-stretch">
        <h2 class="section-heading text-muted-foreground" aria-label="Board size">Board Size</h2>
        <OptionSelector
          :options="boardSizeOptions"
          :selected="boardSize"
          :boil-frame="boilFrame"
          @change="onBoardSizeChange"
        />
      </div>
    </div>

    <!-- Hold the boiling divider to peek at the answer key. -->
    <div
      class="peek-hold-surface my-2"
      title="Hold to peek at the answer key"
      @pointerdown="onDividerHoldStart()"
      @pointerup="onDividerHoldEnd()"
      @pointerleave="onDividerHoldEnd()"
      @pointercancel="onDividerHoldEnd()"
    >
      <BoilDivider />
    </div>

    <!-- Action buttons -->
    <div class="flex items-center justify-evenly">
      <button @click="onRandomize()" :disabled="loading" class="icon-btn group relative" aria-label="Randomize board">
        <DiceIcon :size="28" :playing="randomizeAnimating" />
        <SheetWashiLabel text="Randomize" :seed="11" />
      </button>

      <button @click="onClear()" :disabled="loading" class="icon-btn group relative" aria-label="Clear board">
        <span :class="{ 'eraser-scrub': clearAnimating }">
          <Eraser :size="28" />
        </span>
        <SheetWashiLabel text="Clear" :seed="23" />
      </button>

      <button @click="onSolve()" :disabled="loading" class="icon-btn group relative" aria-label="Solve puzzle">
        <ScribbleLoader v-if="loading && !solveAnimating" :size="22" class="text-muted-foreground" />
        <SolveIcon v-else :size="28" class="sparkle-icon" :playing="solveAnimating" />
        <SheetWashiLabel text="Solve" :seed="37" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.control-panel-wrap {
  font-family: 'Fraunces', serif;
  font-optical-sizing: auto;
}

.control-panel-filtered {
  filter: v-bind(panelFilter);
}

.section-heading {
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
}

@media (min-width: 768px) {
  .section-heading {
    font-size: 1.5rem;
    line-height: 1.75rem;
    text-align: left;
    padding-left: 0.75rem;
  }
}

.section-heading:hover {
  filter: url(#wobble-heart);
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.5rem;
  color: var(--color-muted-foreground);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 150ms;
  filter: url(#grain-static);
}

.icon-btn:hover {
  color: var(--color-foreground);
  background: var(--color-accent);
  filter: url(#wobble-celestial);
}

.icon-btn:active {
  transform: scale(0.93);
}

.icon-btn:disabled {
  opacity: 0.4;
  pointer-events: none;
}

.peek-hold-surface {
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.peek-hold-surface:active {
  cursor: grabbing;
}

.sparkle-icon :deep(*) {
  stroke: url(#sparkle-rainbow) !important;
  fill: url(#sparkle-rainbow) !important;
}

.sparkle-icon {
  filter: drop-shadow(0 0 2px rgba(196, 181, 253, 0.3));
  transition: all 200ms;
}

.icon-btn:hover .sparkle-icon {
  filter: drop-shadow(0 0 5px rgba(196, 181, 253, 0.6));
}

.mobile-control-panel {
  font-family: 'Fraunces', serif;
  font-optical-sizing: auto;
}

.mobile-heading-row {
  display: flex;
  justify-content: center;
}

/* Eraser scrub animation */
.eraser-scrub {
  display: inline-flex;
  animation: eraserScrub 400ms ease;
}

@keyframes eraserScrub {
  0% { transform: translateX(0) rotate(0deg); }
  15% { transform: translateX(-4px) rotate(-8deg); }
  30% { transform: translateX(4px) rotate(6deg); }
  45% { transform: translateX(-3px) rotate(-5deg); }
  60% { transform: translateX(3px) rotate(4deg); }
  80% { transform: translateX(-1px) rotate(-1deg); }
  100% { transform: translateX(0) rotate(0deg); }
}
</style>
