<script setup lang="ts">
import { computed } from 'vue'
import SudokuCell from './SudokuCell.vue'
import type { SolveState } from '@/composables/useSudoku'

const props = defineProps<{
  size: number
  boardSize: number
  totalCells: number
  values: Record<string, number>
  givenCells: Set<string>
  solveState: SolveState
  solvedValues: Record<string, number>
}>()

const emit = defineEmits<{
  (e: 'updateCell', position: number, value: number): void
}>()

const gridTemplateColumns = computed(() => `repeat(${props.boardSize}, minmax(0, 1fr))`)

const boardWidth = computed(() => {
  if (props.boardSize <= 4) return 'min(22rem, 80vw)'
  if (props.boardSize <= 9) return 'min(36rem, 85vw)'
  return 'min(44rem, 90vw)'
})

const boardClasses = computed(() => {
  const base = 'rounded-xl bg-card overflow-hidden transition-all duration-500'
  if (props.solveState === 'solved') return `${base} solve-success`
  if (props.solveState === 'failed') return `${base} solve-failure`
  return `${base} cartoon-shadow-md`
})

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
  <div :class="boardClasses" :style="{ width: boardWidth, aspectRatio: '1' }">
    <div
      class="grid h-full w-full"
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
        @update="(p, v) => emit('updateCell', p, v)"
      />
    </div>
  </div>
</template>
