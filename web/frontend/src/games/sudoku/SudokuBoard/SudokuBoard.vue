<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import SudokuCell from './SudokuCell/SudokuCell.vue'
import HandDrawnGrid from '@pencil/grid/HandDrawnGrid/HandDrawnGrid.vue'
import CelebrationStar from '@pencil/chrome/CelebrationStar.vue'
import { mulberry32 } from '@mkbabb/pencil-boil'
import { generateGridPaths } from '@pencil/grid/gridPaths'
import { revealStaggerMs } from '@pencil/config/pencilConfig'
import { setMurmurSeed, notifyUserEdit, resetMurmur } from '@pencil/composables/celebration'
import type { SolveState } from '@games/sudoku/types'
import type { AnimationState } from '@pencil/types'

const props = defineProps<{
  size: number
  boardSize: number
  totalCells: number
  values: Record<string, number>
  givenCells: Set<string>
  overriddenCells: Set<string>
  animatingCells: Set<string>
  solveState: SolveState
  solvedValues: Record<string, number>
  boardGeneration: number
}>()

const emit = defineEmits<{
  (e: 'updateCell', position: number, value: number): void
}>()

const gridTemplateColumns = computed(() => `repeat(${props.boardSize}, minmax(0, 1fr))`)

// Pre-computed ghost rect paths in board viewBox coordinates (1000×1000)
const VIEWBOX_SIZE = 1000
const cellRects = computed(() =>
  generateGridPaths(props.boardSize, props.size, VIEWBOX_SIZE, 42).cellRects
)

const boardSizeClasses = computed(() => {
  if (props.boardSize <= 4) return 'w-[min(26rem,calc(100vw-1.5rem))] md:w-[min(26rem,85vw)] md:max-w-[calc(100dvh-10rem)]'
  if (props.boardSize <= 9) return 'w-[min(42rem,calc(100vw-1.5rem))] md:w-[min(42rem,85vw)] md:max-w-[calc(100dvh-10rem)]'
  return 'w-[min(52rem,calc(100vw-1.5rem))] md:w-[min(52rem,90vw)] md:max-w-[calc(100dvh-10rem)]'
})

const boardClasses = computed(() => {
  const base = 'transition-all duration-500'
  if (props.solveState === 'solved') return `${base} solve-success`
  if (props.solveState === 'failed') return `${base} solve-failure`
  return base
})

// Beat 1 — the reveal wave. Noise-order stagger (Fisher-Yates + mulberry32), but
// board-normalized (design §1.3): stagger = clamp(round(1200 / blankCount), 4, 24) so the
// reveal window is ~1.2s at every board size instead of the old fixed 15ms/cell (which ran
// ~0.75s on a 9×9 but ~3s on a full 16×16 — outstaying its welcome exactly when the board is
// most impressive).
const noiseDelays = computed(() => {
  const delays = new Map<string, number>()
  const cells = Array.from(props.animatingCells)
  if (cells.length === 0) return delays

  const stagger = revealStaggerMs(cells.length)

  // Fisher-Yates shuffle with seeded RNG
  const rng = mulberry32(cells.length * 17 + 7)
  const shuffled = [...cells]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  for (let i = 0; i < shuffled.length; i++) {
    delays.set(shuffled[i], i * stagger)
  }
  return delays
})

// Celebration trigger (design §1.3: the trigger lives on the board; the skin owns the beats).
// A solve success with newly-filled cells crests the gold-star garnish; an idempotent re-solve
// (zero new cells) skips the fanfare — the grid recolor carries it.
const celebrating = ref(false)
watch(
  () => props.solveState,
  (state, prev) => {
    if (state === 'solved' && prev !== 'solved' && props.animatingCells.size > 0) {
      setMurmurSeed(props.boardGeneration * 31 + 1)
      celebrating.value = true
    } else if (state !== 'solved') {
      celebrating.value = false
    }
  },
)
watch(
  () => props.boardGeneration,
  () => {
    celebrating.value = false
    resetMurmur()
  },
)

function onCellUpdate(pos: number, value: number) {
  notifyUserEdit() // the page is being written on — hold the murmur this window (§1.3)
  emit('updateCell', pos, value)
}

// Grid animation state machine
const gridAnimState = ref<AnimationState>('hidden')

function onGridAnimComplete(state: 'drawn' | 'hidden') {
  if (state === 'drawn') {
    gridAnimState.value = 'drawn'
  } else if (state === 'hidden') {
    // After erase, redraw
    gridAnimState.value = 'drawing'
  }
}

onMounted(() => {
  gridAnimState.value = 'drawing'
})

// On board generation change (size change, randomize, clear), erase and redraw
watch(
  () => props.boardGeneration,
  (_newVal, oldVal) => {
    if (oldVal === undefined) return // skip initial
    if (gridAnimState.value === 'drawn') {
      gridAnimState.value = 'erasing'
    } else {
      gridAnimState.value = 'drawing'
    }
  },
)

function isRevealed(pos: number): boolean {
  return props.animatingCells.has(String(pos))
}
</script>

<template>
  <div
    class="board-wrapper cartoon-shadow-md aspect-square rounded-xl bg-card"
    :class="[boardClasses, boardSizeClasses]"
  >
    <!-- Hand-drawn SVG grid overlay -->
    <HandDrawnGrid
      :board-size="boardSize"
      :subgrid-size="size"
      :anim-state="gridAnimState"
      @animation-complete="onGridAnimComplete"
    />

    <!-- Interactive cell grid -->
    <div
      class="board-cells grid"
      :style="{
        gridTemplateColumns,
        gridTemplateRows: gridTemplateColumns,
      }"
    >
      <SudokuCell
        v-for="pos in totalCells"
        :key="pos - 1"
        :position="pos - 1"
        :value="values[String(pos - 1)] ?? 0"
        :is-given="givenCells.has(String(pos - 1))"
        :is-overridden="overriddenCells.has(String(pos - 1))"
        :is-solved="String(pos - 1) in solvedValues"
        :is-revealed="isRevealed(pos - 1)"
        :noise-delay="noiseDelays.get(String(pos - 1)) ?? 0"
        :board-size="boardSize"
        :subgrid-size="size"
        :ghost-path="cellRects[pos - 1] ?? ''"
        @update="onCellUpdate"
      />
    </div>

    <!-- Gold-star garnish + union foil-gleam tail — beat-2 crest accent (§4.3) -->
    <CelebrationStar :active="celebrating" />
  </div>
</template>

<style scoped>
.board-wrapper {
  position: relative;
  overflow: visible;
  contain: layout style;
}

.board-cells {
  position: absolute;
  inset: 0;
  z-index: 2;
}
</style>
