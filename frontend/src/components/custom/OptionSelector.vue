<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { ghostUnderline, scribbleUnderline } from '@/lib/scribbleUnderline'

const { isDark } = useTheme()

defineProps<{
  options: { value: string | number; label: string; colorClass?: string }[]
  selected: string | number
  boilFrame: number
  mobile?: boolean
}>()

const emit = defineEmits<{
  (e: 'change', value: string | number): void
}>()

function inkColor() {
  return isDark.value ? '#ffffff' : '#1a1a1a'
}

function scribbleSeed(val: string | number): number {
  return typeof val === 'number' ? val : val.charCodeAt(0)
}
</script>

<template>
  <div :class="mobile ? 'options-row' : 'flex flex-col items-center md:items-stretch'">
    <button
      v-for="opt in options"
      :key="opt.value"
      @click="emit('change', opt.value)"
      class="ctrl-btn rounded-md px-3 py-1.5 text-center transition-all duration-150"
      :class="[
        mobile ? 'text-[1rem] md:text-[1.375rem]' : 'text-[1.375rem] md:py-0.5 md:text-left md:text-[1.25rem]',
        selected === opt.value
          ? `font-bold selected-item ${opt.colorClass ?? 'text-foreground'}`
          : 'text-muted-foreground hover:text-foreground hover-item'
      ]"
      :style="selected === opt.value
        ? { '--scribble-underline': scribbleUnderline(scribbleSeed(opt.value) + boilFrame * 1000, inkColor()), '--scribble-width': `${opt.label.length + 1}ch` }
        : { '--ghost-underline': ghostUnderline(scribbleSeed(opt.value) + 500, inkColor()), '--ghost-width': `${opt.label.length + 1}ch` }"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped>
.ctrl-btn {
  font-family: 'Fira Code', monospace;
}

.ctrl-btn:hover {
  filter: url(#wobble-heart);
}

.selected-item,
.hover-item {
  text-decoration: none;
  background-repeat: no-repeat;
  background-origin: content-box;
  background-position: left bottom;
  padding-bottom: 6px;
}

.selected-item {
  background-image: var(--scribble-underline);
  background-size: var(--scribble-width, 4ch) 8px;
}

.hover-item {
  background-image: none;
  background-size: var(--ghost-width, 4ch) 8px;
}

.hover-item:hover {
  background-image: var(--ghost-underline);
}

.options-row {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.25rem 0;
}
</style>
