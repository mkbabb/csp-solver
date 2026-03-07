<script setup lang="ts">
import { computed, ref } from 'vue'
import { Eraser } from 'lucide-vue-next'
import SolveIcon from './SolveIcon.vue'
import DiceIcon from './DiceIcon.vue'
import OptionSelector from './OptionSelector.vue'
import type { Difficulty } from '@/composables/useSudoku'
import { useTheme } from '@/composables/useTheme'
import { useLineBoil } from '@mkbabb/pencil-boil'
import { useButtonAnimation } from '@/composables/useButtonAnimation'
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

const sizeOptions = [
  { value: 2, label: '4×4' },
  { value: 3, label: '9×9' },
  { value: 4, label: '16×16' },
]

const difficultyOptions: { value: Difficulty; label: string; colorClass: string }[] = [
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

const { animating: solveAnimating, trigger: triggerSolve } = useButtonAnimation(500)
const { animating: randomizeAnimating, trigger: triggerRandomize } = useButtonAnimation(500)
const { animating: clearAnimating, trigger: triggerClear } = useButtonAnimation(400)

function onRandomize() {
  triggerRandomize()
  emit('randomize')
}

function onClear() {
  triggerClear()
  emit('clear')
}

function onSolve() {
  triggerSolve()
  emit('solve')
}

function onSizeChange(val: string | number) {
  emit('update:size', val as number)
  triggerBoil()
}

function onDifficultyChange(val: string | number) {
  emit('update:difficulty', val as Difficulty)
  triggerBoil()
}
</script>

<template>
  <!-- Mobile layout -->
  <div v-if="mobile" class="control-panel-wrap mobile-control-panel mt-3">
    <div class="control-panel-filtered">
      <div class="mobile-heading-row">
        <button class="mobile-heading-btn" :aria-expanded="expandedPanel === 'size'" @click="expandedPanel = 'size'">
          <h2
            class="section-heading text-muted-foreground"
            :class="{ 'is-active': expandedPanel === 'size' }"
          >Size</h2>
        </button>
        <button class="mobile-heading-btn" :aria-expanded="expandedPanel === 'difficulty'" @click="expandedPanel = 'difficulty'">
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

      <OptionSelector
        v-show="expandedPanel === 'size'"
        :options="sizeOptions"
        :selected="size"
        :boil-frame="boilFrame"
        mobile
        @change="onSizeChange"
      />

      <OptionSelector
        v-show="expandedPanel === 'difficulty'"
        :options="difficultyOptions"
        :selected="difficulty"
        :boil-frame="boilFrame"
        mobile
        @change="onDifficultyChange"
      />
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

  <!-- Desktop layout -->
  <div v-else class="control-panel-wrap flex flex-col items-center md:items-stretch">
    <div class="control-panel-filtered flex flex-col items-center md:items-stretch">
      <!-- Size selector -->
      <div class="flex flex-col items-center gap-1 md:items-stretch">
        <h2 class="section-heading text-muted-foreground" aria-label="Size">
          Size
        </h2>
        <OptionSelector
          :options="sizeOptions"
          :selected="size"
          :boil-frame="boilFrame"
          @change="onSizeChange"
        />
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
        <OptionSelector
          :options="difficultyOptions"
          :selected="difficulty"
          :boil-frame="boilFrame"
          @change="onDifficultyChange"
        />
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

    <!-- Action buttons -->
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

.section-heading:hover {
  filter: url(#wobble-heart);
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

/* Mobile layout */
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
