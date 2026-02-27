<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  position: number
  value: number
  isGiven: boolean
  isRevealed: boolean
  boardSize: number
  subgridSize: number
}>()

const emit = defineEmits<{
  (e: 'update', position: number, value: number): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const row = computed(() => Math.floor(props.position / props.boardSize))
const col = computed(() => props.position % props.boardSize)

const borderClasses = computed(() => {
  const classes: string[] = []
  const N = props.subgridSize

  // Thicker borders at subgrid boundaries
  if (row.value % N === 0 && row.value !== 0) classes.push('border-t-2 border-t-foreground/30')
  if (col.value % N === 0 && col.value !== 0) classes.push('border-l-2 border-l-foreground/30')

  // Right/bottom edge
  if (col.value === props.boardSize - 1) classes.push('border-r border-r-border')
  if (row.value === props.boardSize - 1) classes.push('border-b border-b-border')

  return classes.join(' ')
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
</script>

<template>
  <div
    class="relative flex items-center justify-center border border-border/50"
    :class="[
      borderClasses,
      isRevealed ? 'animate-[cell-reveal_0.3s_cubic-bezier(0.68,-0.55,0.265,1.55)]' : '',
    ]"
  >
    <input
      ref="inputRef"
      type="text"
      inputmode="numeric"
      :value="displayValue"
      :disabled="isGiven"
      :maxlength="boardSize >= 10 ? 2 : 1"
      @input="handleInput"
      @keydown="handleKeydown"
      class="fira-code h-full w-full bg-transparent text-center outline-none transition-colors duration-150"
      :class="[
        isGiven
          ? 'font-bold text-foreground cursor-default'
          : 'text-blue-600 dark:text-blue-400 hover:bg-accent/50 focus:bg-accent focus:ring-1 focus:ring-ring/30',
        boardSize <= 9 ? 'text-lg sm:text-xl' : 'text-xs sm:text-sm',
      ]"
    />
  </div>
</template>
