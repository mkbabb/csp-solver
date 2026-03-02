<script setup lang="ts">
import { computed, ref } from 'vue'
import { Shuffle, Eraser } from 'lucide-vue-next'
import SolveIcon from './SolveIcon.vue'
import type { Difficulty } from '@/composables/useSudoku'
import { ghostUnderline, scribbleUnderline } from '@/lib/scribbleUnderline'
import { useTheme } from '@/composables/useTheme'
import { useLineBoil } from '@/composables/useLineBoil'

const { isDark } = useTheme()
// Boil the scribble underline at ~8fps for wobble effect
const { currentFrame: boilFrame } = useLineBoil(6, 500)

// Reactive filter URL for control panel — avoids :global(.dark) CSS scoping bug
const panelFilter = computed(() => isDark.value ? 'url(#stroke-dark)' : 'url(#stroke-light)')

const sizes = [
  { value: 2, label: '4×4' },
  { value: 3, label: '9×9' },
  { value: 4, label: '16×16' },
]

const difficulties: { value: Difficulty; label: string; colorClass: string }[] = [
  { value: 'EASY', label: 'Easy', colorClass: 'crayon-green' },
  { value: 'MEDIUM', label: 'Medium', colorClass: 'crayon-orange' },
  { value: 'HARD', label: 'Hard', colorClass: 'crayon-rose' },
]

defineProps<{
  size: number
  difficulty: Difficulty
  loading: boolean
  solveState: string
  mobile?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:size', value: number): void
  (e: 'update:difficulty', value: Difficulty): void
  (e: 'randomize'): void
  (e: 'clear'): void
  (e: 'solve'): void
}>()

const expandedPanel = ref<'size' | 'difficulty' | null>(null)

function togglePanel(panel: 'size' | 'difficulty') {
  expandedPanel.value = expandedPanel.value === panel ? null : panel
}

</script>

<template>
  <!-- ═══ Mobile layout ═══ -->
  <div v-if="mobile" class="control-panel-wrap mobile-control-panel mt-3">
    <!-- Size / Difficulty headings row -->
    <div class="control-panel-filtered mobile-heading-row">
      <button class="mobile-heading-btn" @click="togglePanel('size')">
        <h2
          class="section-heading text-muted-foreground"
          :class="{ 'is-active': expandedPanel === 'size' }"
        >
          Size
        </h2>
      </button>
      <button class="mobile-heading-btn" @click="togglePanel('difficulty')">
        <h2
          class="section-heading transition-colors duration-250"
          :class="[
            difficulty === 'EASY' ? 'crayon-green'
              : difficulty === 'MEDIUM' ? 'crayon-orange'
              : 'crayon-rose',
            { 'is-active': expandedPanel === 'difficulty' }
          ]"
        >
          Difficulty
        </h2>
      </button>
    </div>

    <!-- Expandable options panels (v-show keeps DOM for smooth close) -->
    <div
      class="options-panel"
      :class="{ 'is-open': expandedPanel === 'size' }"
    >
      <div class="options-panel-inner">
        <div class="options-row">
          <button
            v-for="s in sizes"
            :key="s.value"
            @click="emit('update:size', s.value); expandedPanel = null"
            class="ctrl-btn rounded-md px-3 py-1.5 text-center text-[1rem] md:text-[1.375rem] transition-all duration-150"
            :class="
              size === s.value
                ? 'text-foreground font-bold selected-item'
                : 'text-muted-foreground hover:text-foreground hover-item'
            "
            :style="size === s.value
              ? { '--scribble-underline': scribbleUnderline(s.value + boilFrame * 1000, isDark ? '#ffffff' : '#1a1a1a'), '--scribble-width': `${s.label.length + 1}ch` }
              : { '--ghost-underline': ghostUnderline(s.value + 500, isDark ? '#ffffff' : '#1a1a1a'), '--ghost-width': `${s.label.length + 1}ch` }"
          >
            {{ s.label }}
          </button>
        </div>
      </div>
    </div>

    <div
      class="options-panel"
      :class="{ 'is-open': expandedPanel === 'difficulty' }"
    >
      <div class="options-panel-inner">
        <div class="options-row">
          <button
            v-for="d in difficulties"
            :key="d.value"
            @click="emit('update:difficulty', d.value); expandedPanel = null"
            class="ctrl-btn rounded-md px-3 py-1.5 text-center text-[1rem] md:text-[1.375rem] transition-all duration-150"
            :class="[
              difficulty === d.value
                ? `font-bold selected-item ${d.colorClass}`
                : 'text-muted-foreground hover:text-foreground hover-item'
            ]"
            :style="difficulty === d.value
              ? { '--scribble-underline': scribbleUnderline(d.value.charCodeAt(0) + boilFrame * 1000, isDark ? '#ffffff' : '#1a1a1a'), '--scribble-width': `${d.label.length + 1}ch` }
              : { '--ghost-underline': ghostUnderline(d.value.charCodeAt(0) + 500, isDark ? '#ffffff' : '#1a1a1a'), '--ghost-width': `${d.label.length + 1}ch` }"
          >
            {{ d.label }}
          </button>
        </div>
      </div>
    </div>

    <hr class="my-2 w-full border-border/50" />

    <!-- Action buttons -->
    <div class="flex items-center justify-evenly">
      <button
        @click="emit('randomize')"
        :disabled="loading"
        class="icon-btn"
        aria-label="Randomize board"
      >
        <Shuffle :size="28" />
      </button>
      <button
        @click="emit('clear')"
        :disabled="loading"
        class="icon-btn"
        aria-label="Clear board"
      >
        <Eraser :size="28" />
      </button>
      <button
        @click="emit('solve')"
        :disabled="loading"
        class="icon-btn"
        aria-label="Solve puzzle"
      >
        <svg v-if="loading" class="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        <SolveIcon v-else :size="28" class="sparkle-icon" />
      </button>
    </div>
  </div>

  <!-- ═══ Desktop layout ═══ -->
  <div v-else class="control-panel-wrap flex flex-col items-center md:items-stretch">
    <!-- Filtered region: size + difficulty selectors -->
    <div class="control-panel-filtered flex flex-col items-center md:items-stretch">
      <!-- Size selector -->
      <div class="flex flex-col items-center gap-1 md:items-stretch">
        <h2 class="section-heading text-muted-foreground" aria-label="Size">
          Size
        </h2>
        <div class="flex flex-col items-center md:items-stretch">
          <button
            v-for="s in sizes"
            :key="s.value"
            @click="emit('update:size', s.value)"
            class="ctrl-btn rounded-md px-3 py-1.5 text-center text-[1.375rem] transition-all duration-150 md:py-0.5 md:text-left md:text-[1.25rem]"
            :class="
              size === s.value
                ? 'text-foreground font-bold selected-item'
                : 'text-muted-foreground hover:text-foreground hover-item'
            "
            :style="size === s.value
              ? { '--scribble-underline': scribbleUnderline(s.value + boilFrame * 1000, isDark ? '#ffffff' : '#1a1a1a'), '--scribble-width': `${s.label.length + 1}ch` }
              : { '--ghost-underline': ghostUnderline(s.value + 500, isDark ? '#ffffff' : '#1a1a1a'), '--ghost-width': `${s.label.length + 1}ch` }"
          >
            {{ s.label }}
          </button>
        </div>
      </div>

      <hr class="my-3 w-full border-border/50" />

      <!-- Difficulty selector -->
      <div class="flex flex-col items-center gap-1 md:items-stretch">
        <h2
          class="section-heading transition-colors duration-250"
          :class="
            difficulty === 'EASY'
              ? 'crayon-green'
              : difficulty === 'MEDIUM'
                ? 'crayon-orange'
                : 'crayon-rose'
          "
        >
          Difficulty
        </h2>
        <div class="flex flex-col items-center md:items-stretch">
          <button
            v-for="d in difficulties"
            :key="d.value"
            @click="emit('update:difficulty', d.value)"
            class="ctrl-btn rounded-md px-3 py-1.5 text-center text-[1.375rem] transition-all duration-150 md:py-0.5 md:text-left md:text-[1.25rem]"
            :class="[
              difficulty === d.value
                ? `font-bold selected-item ${d.colorClass}`
                : 'text-muted-foreground hover:text-foreground hover-item'
            ]"
            :style="difficulty === d.value
              ? { '--scribble-underline': scribbleUnderline(d.value.charCodeAt(0) + boilFrame * 1000, isDark ? '#ffffff' : '#1a1a1a'), '--scribble-width': `${d.label.length + 1}ch` }
              : { '--ghost-underline': ghostUnderline(d.value.charCodeAt(0) + 500, isDark ? '#ffffff' : '#1a1a1a'), '--ghost-width': `${d.label.length + 1}ch` }"
          >
            {{ d.label }}
          </button>
        </div>
      </div>
    </div>

    <hr class="my-3 w-full border-border/50" />

    <!-- Action buttons — outside filtered region so tooltips are legible -->
    <div class="flex items-center justify-evenly">
      <button
        @click="emit('randomize')"
        :disabled="loading"
        class="icon-btn group relative"
        aria-label="Randomize board"
      >
        <Shuffle :size="28" />
        <span class="tooltip">Randomize</span>
      </button>

      <button
        @click="emit('clear')"
        :disabled="loading"
        class="icon-btn group relative"
        aria-label="Clear board"
      >
        <Eraser :size="28" />
        <span class="tooltip">Clear</span>
      </button>

      <button
        @click="emit('solve')"
        :disabled="loading"
        class="icon-btn group relative"
        aria-label="Solve puzzle"
      >
        <svg v-if="loading" class="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        <SolveIcon v-else :size="28" class="sparkle-icon" />
        <span class="tooltip">Solve</span>
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

/* Crayon color utilities */
.crayon-green { color: var(--color-crayon-green); }
.crayon-orange { color: var(--color-crayon-orange); }
.crayon-rose { color: var(--color-crayon-rose); }
.crayon-blue { color: var(--color-crayon-blue); }

.ctrl-btn {
  font-family: 'Fira Code', monospace;
}

.ctrl-btn:hover {
  filter: url(#wobble-heart);
}

/* Crayon-style underline for selected items */
.selected-item {
  text-decoration: none;
  background-image: var(--scribble-underline);
  background-repeat: no-repeat;
  background-position: center bottom 0px;
  background-size: var(--scribble-width, 4ch) 8px;
  padding-bottom: 6px;
}

/* Ghost underline on hover for non-selected items */
.hover-item {
  text-decoration: none;
  background-image: none;
  background-repeat: no-repeat;
  background-position: left 0.75rem bottom 0px;
  background-size: var(--ghost-width, 4ch) 8px;
  padding-bottom: 6px;
}

.hover-item:hover {
  background-image: var(--ghost-underline);
}

@media (min-width: 768px) {
  .selected-item {
    background-position: left 0.75rem bottom 0px;
  }
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

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0.375rem;
  padding: 0.25rem 0.5rem;
  font-family: 'Patrick Hand', cursive;
  font-size: 0.85rem;
  font-weight: 600;
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

/* ═══ Mobile layout ═══ */

.mobile-control-panel {
  font-family: 'Fraunces', serif;
  font-optical-sizing: auto;
}

.mobile-heading-row {
  display: flex;
  justify-content: space-evenly;
}

.mobile-heading-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.mobile-heading-btn .section-heading.is-active {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

/* Options panel — grid-template-rows expand */
.options-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.options-panel.is-open {
  grid-template-rows: 1fr;
}

.options-panel-inner {
  overflow: hidden;
  opacity: 0;
  transition: opacity 200ms ease;
}

.options-panel.is-open .options-panel-inner {
  opacity: 1;
  transition-delay: 100ms;
}

.options-row {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.25rem 0;
}
</style>
