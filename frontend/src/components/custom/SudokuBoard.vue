<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import SudokuCell from './SudokuCell.vue'
import HandDrawnGrid from './HandDrawnGrid.vue'
import { generateGridPaths } from '@/lib/handDrawnPaths'
import type { SolveState } from '@/composables/useSudoku'

const props = defineProps<{
  size: number
  boardSize: number
  totalCells: number
  values: Record<string, number>
  givenCells: Set<string>
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

const boardWidth = computed(() => {
  if (props.boardSize <= 4) return 'min(22rem, 80vw)'
  if (props.boardSize <= 9) return 'min(36rem, 85vw)'
  return 'min(44rem, 90vw)'
})

// Wrapper padding matches SVG pad (26/1000 viewBox) so cells align with grid lines
const SVG_PAD_FRAC = 26 / 1000
const boardPadding = computed(() => {
  const remWidth = props.boardSize <= 4 ? 22 : props.boardSize <= 9 ? 36 : 44
  return `${(SVG_PAD_FRAC * remWidth).toFixed(2)}rem`
})

const boardClasses = computed(() => {
  const base = 'transition-all duration-500'
  if (props.solveState === 'solved') return `${base} solve-success`
  if (props.solveState === 'failed') return `${base} solve-failure`
  return base
})

// Grid animation state machine
const gridAnimState = ref<'hidden' | 'drawing' | 'drawn' | 'erasing'>('hidden')

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
  const key = String(pos)
  return (
    props.solveState === 'solved' &&
    !props.givenCells.has(key) &&
    props.solvedValues[key] !== undefined
  )
}
</script>

<template>
  <div class="board-wrapper cartoon-shadow-md rounded-xl bg-card" :class="boardClasses" :style="{ width: boardWidth, aspectRatio: '1', padding: boardPadding }">
    <!-- Hand-drawn SVG grid overlay -->
    <HandDrawnGrid
      :board-size="boardSize"
      :subgrid-size="size"
      :anim-state="gridAnimState"
      @animation-complete="onGridAnimComplete"
    />

    <!-- Interactive cell grid -->
    <div
      class="board-cells grid h-full w-full"
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
        :is-revealed="isRevealed(pos - 1)"
        :board-size="boardSize"
        :subgrid-size="size"
        :ghost-path="cellRects[pos - 1] ?? ''"
        @update="(p, v) => emit('updateCell', p, v)"
      />
    </div>
  </div>
</template>

<style scoped>
.board-wrapper {
  position: relative;
  overflow: visible;
  contain: layout style;
}

.board-cells {
  position: relative;
  z-index: 2;
}
</style>
