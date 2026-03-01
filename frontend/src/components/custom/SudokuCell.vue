<script setup lang="ts">
import { computed, ref } from 'vue'
import HandwrittenGlyph from './HandwrittenGlyph.vue'

const props = defineProps<{
  position: number
  value: number
  isGiven: boolean
  isRevealed: boolean
  boardSize: number
  subgridSize: number
  /** Pre-computed ghost rect path in 1000×1000 board viewBox coords */
  ghostPath: string
}>()

const emit = defineEmits<{
  (e: 'update', position: number, value: number): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const cellRef = ref<HTMLDivElement | null>(null)
const isHovered = ref(false)
const isFocused = ref(false)

// Cell is "active" when hovered or focused and editable
const isActive = computed(() => !props.isGiven && (isHovered.value || isFocused.value))

// Compute the cell's viewBox region in 1000×1000 board coords
const cellViewBox = computed(() => {
  const cellSize = 1000 / props.boardSize
  const col = props.position % props.boardSize
  const row = Math.floor(props.position / props.boardSize)
  // Pad outward by half a cell to allow the ghost stroke to render without clipping
  const pad = cellSize * 0.15
  const x = col * cellSize - pad
  const y = row * cellSize - pad
  const w = cellSize + pad * 2
  const h = cellSize + pad * 2
  return `${x} ${y} ${w} ${h}`
})

const displayValue = computed(() => {
  if (props.value === 0) return ''
  return String(props.value)
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const raw = target.value.replace(/\D/g, '')

  if (raw === '') {
    emit('update', props.position, 0)
    target.value = ''
    return
  }

  const num = parseInt(raw, 10)
  if (num >= 1 && num <= props.boardSize) {
    emit('update', props.position, num)
    target.value = String(num)
  } else {
    target.value = displayValue.value
  }
}

function handleKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLInputElement
  if (event.key === 'Backspace' || event.key === 'Delete') {
    emit('update', props.position, 0)
    target.value = ''
    event.preventDefault()
  }
}

function focusInput() {
  inputRef.value?.focus()
}
</script>

<template>
  <div
    ref="cellRef"
    class="sudoku-cell relative flex items-center justify-center"
    :class="[
      isRevealed ? 'animate-[cell-reveal_0.3s_cubic-bezier(0.68,-0.55,0.265,1.55)]' : '',
      isActive ? 'is-active' : '',
    ]"
    @click="focusInput"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Hidden input for keyboard interaction -->
    <input
      ref="inputRef"
      type="text"
      inputmode="numeric"
      :value="displayValue"
      :disabled="isGiven"
      :maxlength="boardSize >= 10 ? 2 : 1"
      @input="handleInput"
      @keydown="handleKeydown"
      @focus="isFocused = true"
      @blur="isFocused = false"
      class="absolute inset-0 h-full w-full bg-transparent text-center opacity-0 outline-none"
      :class="[
        isGiven ? 'cursor-default' : 'cursor-pointer',
      ]"
    />

    <!-- SVG handwritten glyph overlay -->
    <HandwrittenGlyph
      v-if="value !== 0"
      :value="displayValue"
      :is-given="isGiven"
      :is-revealed="isRevealed"
      :position="position"
      :board-size="boardSize"
      :is-hovered="isHovered"
    />

    <!-- Ghost cell highlight — hand-drawn border on hover/focus (board-coord viewBox) -->
    <div
      v-if="!isGiven"
      class="cell-ghost pointer-events-none absolute inset-0"
      :class="{ 'is-active': isActive }"
    >
      <svg
        class="absolute inset-0 h-full w-full overflow-visible"
        :viewBox="cellViewBox"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          :d="ghostPath"
          class="cell-ghost-path"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* Ghost wrapper — instant show/hide for cursor-tracking responsiveness */
.cell-ghost {
  opacity: 0;
}

.cell-ghost.is-active {
  opacity: 1;
}

/* Ghost path styling — hand-drawn pencil border + tinted fill */
.cell-ghost-path {
  fill: var(--color-foreground);
  fill-opacity: 0.06;
  stroke: var(--color-foreground);
  stroke-width: 6;
  stroke-opacity: 0.65;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Ensure ghost overflow is not clipped */
.sudoku-cell {
  overflow: visible;
}
.sudoku-cell.is-active {
  z-index: 10;
}
</style>
