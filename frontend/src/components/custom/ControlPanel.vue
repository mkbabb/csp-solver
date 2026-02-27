<script setup lang="ts">
import { Shuffle, Eraser, Sparkles } from 'lucide-vue-next'
import type { Difficulty } from '@/composables/useSudoku'

defineProps<{
  size: number
  difficulty: Difficulty
  loading: boolean
  solveState: string
}>()

const emit = defineEmits<{
  (e: 'update:size', value: number): void
  (e: 'update:difficulty', value: Difficulty): void
  (e: 'randomize'): void
  (e: 'clear'): void
  (e: 'solve'): void
}>()

const sizes = [
  { value: 2, label: '4x4' },
  { value: 3, label: '9x9' },
  { value: 4, label: '16x16' },
]

const difficulties: { value: Difficulty; label: string; colorClass: string }[] = [
  { value: 'EASY', label: 'Easy', colorClass: 'text-green-600 dark:text-green-400' },
  { value: 'MEDIUM', label: 'Medium', colorClass: 'text-amber-600 dark:text-amber-400' },
  { value: 'HARD', label: 'Hard', colorClass: 'text-red-600 dark:text-red-400' },
]
</script>

<template>
  <div class="flex flex-col items-center sm:items-stretch">
    <!-- Size selector -->
    <div class="flex flex-col items-center gap-1 sm:items-stretch">
      <h2 class="section-heading text-muted-foreground">
        Size
      </h2>
      <div class="flex flex-col items-center sm:items-stretch">
        <button
          v-for="s in sizes"
          :key="s.value"
          @click="emit('update:size', s.value)"
          class="fira-code rounded-md px-3 py-0.5 text-center text-sm transition-all duration-150 sm:text-left"
          :class="
            size === s.value
              ? 'text-foreground font-bold'
              : 'text-muted-foreground hover:text-foreground'
          "
        >
          {{ s.label }}
        </button>
      </div>
    </div>

    <hr class="my-3 w-full border-border/50" />

    <!-- Difficulty selector -->
    <div class="flex flex-col items-center gap-1 sm:items-stretch">
      <h2
        class="section-heading transition-colors duration-250"
        :class="
          difficulty === 'EASY'
            ? 'text-green-600 dark:text-green-400'
            : difficulty === 'MEDIUM'
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-red-600 dark:text-red-400'
        "
      >
        Difficulty
      </h2>
      <div class="flex flex-col items-center sm:items-stretch">
        <button
          v-for="d in difficulties"
          :key="d.value"
          @click="emit('update:difficulty', d.value)"
          class="fira-code rounded-md px-3 py-0.5 text-center text-sm transition-all duration-150 sm:text-left"
          :class="
            difficulty === d.value
              ? `font-bold ${d.colorClass}`
              : 'text-muted-foreground hover:text-foreground'
          "
        >
          {{ d.label }}
        </button>
      </div>
    </div>

    <hr class="my-3 w-full border-border/50" />

    <!-- Action buttons (icon only) -->
    <div class="flex items-center justify-center gap-1 sm:justify-start">
      <button
        @click="emit('randomize')"
        :disabled="loading"
        class="icon-btn group relative"
        aria-label="Randomize board"
      >
        <Shuffle :size="18" />
        <span class="tooltip">Randomize</span>
      </button>

      <button
        @click="emit('clear')"
        :disabled="loading"
        class="icon-btn group relative"
        aria-label="Clear board"
      >
        <Eraser :size="18" />
        <span class="tooltip">Clear</span>
      </button>

      <button
        @click="emit('solve')"
        :disabled="loading"
        class="icon-btn group relative"
        aria-label="Solve puzzle"
      >
        <svg v-if="loading" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        <Sparkles v-else :size="18" class="sparkle-icon" />
        <span class="tooltip">Solve</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.section-heading {
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
}

@media (min-width: 640px) {
  .section-heading {
    text-align: left;
    padding-left: 0.75rem;
  }
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  color: var(--color-muted-foreground);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 150ms;
}

.icon-btn:hover {
  color: var(--color-foreground);
  background: var(--color-accent);
}

.icon-btn:active {
  transform: scale(0.93);
}

.icon-btn:disabled {
  opacity: 0.4;
  pointer-events: none;
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0.375rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem; /* text-xs */
  font-weight: 500;
  white-space: nowrap;
  color: var(--color-primary-foreground);
  background: var(--color-primary);
  border-radius: 0.375rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms;
}

.group:hover .tooltip {
  opacity: 1;
}

/* Sparkle icon - pastel rainbow filled */
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
</style>
