<script setup lang="ts">
import { computed, ref } from 'vue'
import { Eraser } from 'lucide-vue-next'
import SolveIcon from './SolveIcon.vue'
import DiceIcon from './DiceIcon.vue'
import type { Difficulty } from '@/composables/useSudoku'
import { ghostUnderline, scribbleUnderline } from '@/lib/scribbleUnderline'
import { useTheme } from '@/composables/useTheme'
import { useLineBoil } from '@mkbabb/pencil-boil'
import { generateLineBoilFrames } from '@/lib/gridPaths'
import { BOIL_CONFIG } from '@/lib/pencilConfig'

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

// Boil divider line frames
const dividerFrames = computed(() =>
  generateLineBoilFrames(
    20, 8, 980, 8,
    { roughness: 0.2, segments: 3, seed: 314, jagged: true },
    BOIL_CONFIG.frameBoil, BOIL_CONFIG.frameCount,
  )
)
const { currentFrame: dividerFrame } = useLineBoil(
  () => BOIL_CONFIG.frameCount,
  () => BOIL_CONFIG.intervalMs,
)
const dividerPath = computed(() => dividerFrames.value[dividerFrame.value] ?? '')

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

const expandedPanel = ref<'size' | 'difficulty'>('size')

const solveAnimating = ref(false)
const randomizeAnimating = ref(false)
const clearAnimating = ref(false)

function onRandomize() {
  randomizeAnimating.value = true
  emit('randomize')
  setTimeout(() => { randomizeAnimating.value = false }, 500)
}

function onClear() {
  clearAnimating.value = true
  emit('clear')
  setTimeout(() => { clearAnimating.value = false }, 400)
}

function onSolve() {
  solveAnimating.value = true
  emit('solve')
  setTimeout(() => { solveAnimating.value = false }, 500)
}

</script>

<template>
  <!-- ═══ Mobile layout ═══ -->
  <div v-if="mobile" class="control-panel-wrap mobile-control-panel mt-3">
    <!-- Size / Difficulty toggle headings + options -->
    <div class="control-panel-filtered">
      <div class="mobile-heading-row">
        <button class="mobile-heading-btn" @click="expandedPanel = 'size'">
          <h2
            class="section-heading text-muted-foreground"
            :class="{ 'is-active': expandedPanel === 'size' }"
          >Size</h2>
        </button>
        <button class="mobile-heading-btn" @click="expandedPanel = 'difficulty'">
          <h2
            class="section-heading transition-colors duration-250"
            :class="[
              difficulty === 'EASY' ? 'crayon-green'
                : difficulty === 'MEDIUM' ? 'crayon-orange'
                : 'crayon-rose',
              { 'is-active': expandedPanel === 'difficulty' }
            ]"
          >Difficulty</h2>
        </button>
      </div>

      <div v-show="expandedPanel === 'size'" class="options-row">
        <button
          v-for="s in sizes"
          :key="s.value"
          @click="emit('update:size', s.value); triggerBoil()"
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

      <div v-show="expandedPanel === 'difficulty'" class="options-row">
        <button
          v-for="d in difficulties"
          :key="d.value"
          @click="emit('update:difficulty', d.value); triggerBoil()"
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

    <!-- Boil divider -->
    <div class="boil-divider-wrap">
      <svg viewBox="0 0 1000 16" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          :d="dividerPath"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-opacity="0.7"
          stroke-linejoin="round"
          stroke-linecap="round"
          filter="url(#grain-static)"
        />
      </svg>
    </div>

    <!-- Action buttons -->
    <div class="flex items-center justify-evenly">
      <button
        @click="onRandomize()"
        :disabled="loading"
        class="icon-btn"
        aria-label="Randomize board"
      >
        <DiceIcon :size="28" :playing="randomizeAnimating" />
      </button>
      <button
        @click="onClear()"
        :disabled="loading"
        class="icon-btn"
        aria-label="Clear board"
      >
        <span :class="{ 'eraser-scrub': clearAnimating }">
          <Eraser :size="28" />
        </span>
      </button>
      <button
        @click="onSolve()"
        :disabled="loading"
        class="icon-btn"
        aria-label="Solve puzzle"
      >
        <svg v-if="loading && !solveAnimating" class="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        <SolveIcon v-else :size="28" class="sparkle-icon" :playing="solveAnimating" />
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
            @click="emit('update:size', s.value); triggerBoil()"
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
            @click="emit('update:difficulty', d.value); triggerBoil()"
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

    <!-- Boil divider -->
    <div class="boil-divider-wrap my-2">
      <svg viewBox="0 0 1000 16" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          :d="dividerPath"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-opacity="0.7"
          stroke-linejoin="round"
          stroke-linecap="round"
          filter="url(#grain-static)"
        />
      </svg>
    </div>

    <!-- Action buttons — outside filtered region so tooltips are legible -->
    <div class="flex items-center justify-evenly">
      <button
        @click="onRandomize()"
        :disabled="loading"
        class="icon-btn group relative"
        aria-label="Randomize board"
      >
        <DiceIcon :size="28" :playing="randomizeAnimating" />
        <span class="tooltip">Randomize</span>
      </button>

      <button
        @click="onClear()"
        :disabled="loading"
        class="icon-btn group relative"
        aria-label="Clear board"
      >
        <span :class="{ 'eraser-scrub': clearAnimating }">
          <Eraser :size="28" />
        </span>
        <span class="tooltip">Clear</span>
      </button>

      <button
        @click="onSolve()"
        :disabled="loading"
        class="icon-btn group relative"
        aria-label="Solve puzzle"
      >
        <svg v-if="loading && !solveAnimating" class="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
        <SolveIcon v-else :size="28" class="sparkle-icon" :playing="solveAnimating" />
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

.section-heading:hover {
  filter: url(#wobble-heart);
}

.ctrl-btn:hover {
  filter: url(#wobble-heart);
}

/* Shared underline positioning — content-box origin so left 0 = text edge */
.selected-item,
.hover-item {
  text-decoration: none;
  background-repeat: no-repeat;
  background-origin: content-box;
  background-position: left bottom;
  padding-bottom: 6px;
}

/* Crayon-style underline for selected items */
.selected-item {
  background-image: var(--scribble-underline);
  background-size: var(--scribble-width, 4ch) 8px;
}

/* Ghost underline on hover for non-selected items */
.hover-item {
  background-image: none;
  background-size: var(--ghost-width, 4ch) 8px;
}

.hover-item:hover {
  background-image: var(--ghost-underline);
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

/* Boil divider — SVG is position:absolute so its viewBox intrinsic width (1000px)
   doesn't inflate the flex column's cross-axis sizing */
.boil-divider-wrap {
  position: relative;
  height: 14px;
}

.boil-divider-wrap svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
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

.options-row {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.25rem 0;
}

/* Eraser scrub animation */
.eraser-scrub {
  display: inline-flex;
  animation: eraserScrub 400ms ease;
}

@keyframes eraserScrub {
  0%   { transform: translateX(0) rotate(0deg); }
  15%  { transform: translateX(-4px) rotate(-8deg); }
  30%  { transform: translateX(4px) rotate(6deg); }
  45%  { transform: translateX(-3px) rotate(-5deg); }
  60%  { transform: translateX(3px) rotate(4deg); }
  80%  { transform: translateX(-1px) rotate(-1deg); }
  100% { transform: translateX(0) rotate(0deg); }
}
</style>
