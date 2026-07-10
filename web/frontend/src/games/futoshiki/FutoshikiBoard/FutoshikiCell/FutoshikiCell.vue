<script setup lang="ts">
import { computed, ref } from 'vue'
import HandwrittenGlyph from '@pencil/glyph/HandwrittenGlyph.vue'
import { toDisplayChar } from '@pencil/glyph/glyphRegistry'

const props = defineProps<{
  position: number
  value: number
  isGiven: boolean
  isOverridden: boolean
  isSolved: boolean
  isRevealed: boolean
  noiseDelay: number
  boardSize: number
  /** Pre-computed ghost rect path in 1000×1000 board viewBox coords */
  ghostPath: string
  /** 1-based grid coordinates (ARIA grid + aria-label derivation, §4.1) */
  rowIndex: number
  colIndex: number
  /** Roving tabindex (§4.1): 0 for the one focused cell, -1 for every other. */
  tabIndex: number
  /** This cell participates in a Latin-square duplicate or inequality violation (§1.4/§4.2). */
  isInvalid: boolean
  /** Folded inequality constraints touching this cell (F6) — e.g. "greater than the cell to
   *  the right and less than the cell below". Empty when the cell borders no caret. Appended
   *  to the accessible name so a screen reader hears the relation while arrowing the grid; the
   *  caret glyphs themselves are aria-hidden. */
  constraintLabel: string
}>()

const emit = defineEmits<{
  (e: 'update', position: number, value: number): void
  (e: 'cellFocus', position: number): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isHovered = ref(false)
const isFocused = ref(false)

const isActive = computed(() => isHovered.value || isFocused.value)

// Compute the cell's viewBox region in 1000×1000 board coords
const cellViewBox = computed(() => {
  const cellSize = 1000 / props.boardSize
  const col = props.position % props.boardSize
  const row = Math.floor(props.position / props.boardSize)
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

const glyphChar = computed(() => toDisplayChar(props.value, props.boardSize))

const cellKind = computed<'empty' | 'given' | 'user' | 'solved'>(() => {
  if (props.value === 0) return 'empty'
  if (props.isSolved) return 'solved'
  if (props.isGiven && !props.isOverridden) return 'given'
  return 'user'
})

const ariaLabel = computed(() => {
  const loc = `Row ${props.rowIndex}, column ${props.colIndex}`
  let core: string
  switch (cellKind.value) {
    case 'given':
      core = `given clue ${glyphChar.value}`
      break
    case 'user':
      core = `your entry ${glyphChar.value}`
      break
    case 'solved':
      core = `solver's answer ${glyphChar.value}`
      break
    default:
      core = 'empty'
  }
  const base = `${loc}, ${core}`
  // F6: the inequality is a property of the CELL to the reader, not a free-floating glyph.
  return props.constraintLabel ? `${base}, ${props.constraintLabel}` : base
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const raw = target.value.replace(/\D/g, '')

  if (raw === '') {
    emit('update', props.position, 0)
    target.value = ''
    return
  }

  // Board sizes are 4..7 (single digit), so the last digit is the entry — enables one-click override.
  const trimmed = raw.slice(-1)
  const num = parseInt(trimmed, 10)
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
  // Arrow / Home / End fall through to the board's roving-tabindex controller.
}

function focusInput() {
  inputRef.value?.focus()
}

function onFocus() {
  isFocused.value = true
  emit('cellFocus', props.position)
}

defineExpose({ focus: focusInput })
</script>

<template>
  <div
    class="futoshiki-cell relative flex items-center justify-center"
    role="gridcell"
    :aria-rowindex="rowIndex"
    :aria-colindex="colIndex"
    :class="{ 'cell-reveal-animated': isRevealed, 'is-active': isActive, 'is-invalid': isInvalid }"
    :style="isRevealed ? { '--reveal-delay': `${noiseDelay}ms` } : undefined"
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
      maxlength="2"
      :tabindex="tabIndex"
      :aria-label="ariaLabel"
      :aria-invalid="isInvalid || undefined"
      @input="handleInput"
      @keydown="handleKeydown"
      @focus="onFocus"
      @blur="isFocused = false"
      class="absolute inset-0 h-full w-full cursor-pointer bg-transparent text-center opacity-0 outline-none"
    />

    <!-- SVG handwritten glyph overlay -->
    <HandwrittenGlyph
      v-if="value !== 0"
      :value="glyphChar"
      :is-given="isGiven"
      :is-overridden="isOverridden"
      :is-solved="isSolved"
      :is-revealed="isRevealed"
      :noise-delay="noiseDelay"
      :position="position"
      :board-size="boardSize"
      :is-hovered="isHovered"
    />

    <!-- Ghost cell highlight — three-tier pencil-sketch focus/hover/invalid ring (§4.2). -->
    <div
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
          pathLength="1"
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

/* Conflict mark persists whether or not the cell is hovered/focused (§1.4). */
.futoshiki-cell.is-invalid .cell-ghost {
  opacity: 1;
}

/* Tier 1 — hover / base: graphite pencil border + faint tinted fill (§4.2). */
.cell-ghost-path {
  fill: var(--color-pencil-graphite, var(--grid-line-color));
  fill-opacity: 0.06;
  stroke: var(--color-pencil-graphite, var(--grid-line-color));
  stroke-width: 5;
  stroke-opacity: 0.65;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Tier 2 — keyboard focus: crayon-blue, heavier, sketched on over 180ms. */
.futoshiki-cell:has(input:focus-visible) .cell-ghost-path {
  fill: var(--color-focus-sketch, var(--color-crayon-blue));
  fill-opacity: 0.08;
  stroke: var(--color-focus-sketch, var(--color-crayon-blue));
  stroke-width: 7;
  stroke-opacity: 0.9;
  stroke-dasharray: 1;
  animation: ghost-draw-on 180ms cubic-bezier(0.215, 0.61, 0.355, 1) both;
}

@keyframes ghost-draw-on {
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}

/* Tier 3 — aria-invalid conflict: the teacher's red pencil. Tier collisions are resolved
   by specificity, never source order — this (0,3,0) rule loses every shared property to
   tier-2's (0,3,1); the focused-and-conflicting case is owned by the tier-2×3 compound
   rule below. */
.futoshiki-cell.is-invalid .cell-ghost-path {
  fill: var(--color-teacher-red, var(--color-crayon-rose));
  fill-opacity: 0.1;
  stroke: var(--color-teacher-red, var(--color-crayon-rose));
  stroke-width: 9;
  stroke-opacity: 1;
}

/* Tier 2×3 — focused AND conflicting: the teacher's red pencil, pressed harder.
   (0,4,1) beats tier-2's (0,3,1); every tier-2 paint property is re-asserted —
   partial overrides leak blue through the higher-specificity focus rule.
   ghost-draw-on is deliberately NOT suppressed: it re-sketches in red as the
   focus cue (the ghost is this cell's only focus affordance; PRM block governs). */
.futoshiki-cell.is-invalid:has(input:focus-visible) .cell-ghost-path {
  fill: var(--color-teacher-red, var(--color-crayon-rose));
  fill-opacity: 0.16;
  stroke: var(--color-teacher-red, var(--color-crayon-rose));
  stroke-width: 10;
  stroke-opacity: 1;
}

/* Neutralize the generic global focus-within ring — the SVG ghost is the focus affordance. */
.futoshiki-cell:focus-within {
  background: transparent;
  outline: none;
}

@media (prefers-reduced-motion: reduce) {
  .futoshiki-cell:has(input:focus-visible) .cell-ghost-path {
    animation: none;
    stroke-dashoffset: 0;
  }
}

@media (prefers-contrast: more) {
  .cell-ghost-path {
    stroke-opacity: 0.9;
  }
  .futoshiki-cell.is-invalid .cell-ghost-path {
    stroke-opacity: 1;
  }
}

.futoshiki-cell {
  overflow: visible;
  contain: layout style;
}
.futoshiki-cell.is-active {
  z-index: 10;
}
</style>
