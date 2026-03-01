<script setup lang="ts">
import { computed, ref } from 'vue'
import { Shuffle, Eraser, Sparkles } from 'lucide-vue-next'
import type { Difficulty } from '@/composables/useSudoku'
import { mulberry32 } from '@/lib/handDrawnPaths'
import { useTheme } from '@/composables/useTheme'
import { useLineBoil } from '@/composables/useLineBoil'

const { isDark } = useTheme()
// Boil the scribble underline at ~8fps for wobble effect
const { currentFrame: boilFrame } = useLineBoil(6, 500)

// Reactive filter URL for control panel — avoids :global(.dark) CSS scoping bug
const panelFilter = computed(() => isDark.value ? 'url(#stroke-dark)' : 'url(#stroke-light)')

/** Generate a lighter ghost underline for hover state (thinner, more transparent) */
function ghostUnderline(seed: number, color: string): string {
    const rng = mulberry32(seed * 7 + 31);
    const w = 100, h = 12;
    const startX = 4 + rng() * 4;
    const endX = w - 4 - rng() * 4;
    const baseY = h * 0.5;

    let d = `M${startX.toFixed(1)},${(baseY + (rng() - 0.5) * 2).toFixed(1)}`;
    const segs = 3 + Math.floor(rng() * 2);
    for (let i = 1; i <= segs; i++) {
        const x = startX + ((endX - startX) * i) / segs;
        const y = baseY + (rng() - 0.5) * 3;
        const cpx = startX + ((endX - startX) * (i - 0.5)) / segs + (rng() - 0.5) * 6;
        const cpy = baseY + (rng() - 0.5) * 4;
        d += ` Q${cpx.toFixed(1)},${cpy.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
    }

    const sw = 1.2 + rng() * 0.8;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'><path d='${d}' fill='none' stroke='${color}' stroke-width='${sw.toFixed(1)}' stroke-linecap='round' stroke-linejoin='round' opacity='0.4'/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function scribbleUnderline(seed: number, color: string): string {
    const rng = mulberry32(seed * 13 + 47);
    const w = 100, h = 12;
    // Start slightly inward for centering
    const startX = 2 + rng() * 3;
    const endX = w - 2 - rng() * 3;
    const baseY = h * 0.5;

    // First pass — main wobbly stroke
    let d = `M${startX.toFixed(1)},${(baseY + (rng() - 0.5) * 3).toFixed(1)}`;
    const segs = 4 + Math.floor(rng() * 3);
    for (let i = 1; i <= segs; i++) {
        const x = startX + ((endX - startX) * i) / segs;
        const y = baseY + (rng() - 0.5) * 5;
        const cpx = startX + ((endX - startX) * (i - 0.5)) / segs + (rng() - 0.5) * 8;
        const cpy = baseY + (rng() - 0.5) * 6;
        d += ` Q${cpx.toFixed(1)},${cpy.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
    }

    // Second pass — slightly offset retrace for pencil "double-stroke" effect
    const offset = 1.5 + rng() * 1.5;
    d += ` M${(endX - rng() * 4).toFixed(1)},${(baseY + offset + (rng() - 0.5) * 2).toFixed(1)}`;
    const segs2 = 3 + Math.floor(rng() * 2);
    for (let i = 1; i <= segs2; i++) {
        const x = endX - ((endX - startX) * i) / segs2;
        const y = baseY + offset + (rng() - 0.5) * 4;
        const cpx = endX - ((endX - startX) * (i - 0.5)) / segs2 + (rng() - 0.5) * 10;
        const cpy = baseY + offset + (rng() - 0.5) * 5;
        d += ` Q${cpx.toFixed(1)},${cpy.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
    }

    // Varying stroke width simulated via multiple thin strokes in the SVG
    const sw = 1.8 + rng() * 1.2;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'><path d='${d}' fill='none' stroke='${color}' stroke-width='${sw.toFixed(1)}' stroke-linecap='round' stroke-linejoin='round' opacity='0.85'/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

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

const props = defineProps<{
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

const currentSizeLabel = computed(() =>
  sizes.find((s) => s.value === props.size)?.label ?? '9×9'
)

const currentDifficultyLabel = computed(() =>
  difficulties.find((d) => d.value === props.difficulty)?.label ?? 'Easy'
)

const currentDifficultyColor = computed(() =>
  difficulties.find((d) => d.value === props.difficulty)?.colorClass ?? 'crayon-green'
)
</script>

<template>
  <!-- ═══ Mobile layout ═══ -->
  <div v-if="mobile" class="control-panel-wrap mobile-control-panel">
    <!-- Chip row -->
    <div class="chip-row">
      <button
        class="chip"
        :class="{ 'is-active': expandedPanel === 'size' }"
        @click="togglePanel('size')"
      >
        <span class="chip-label">{{ currentSizeLabel }}</span>
      </button>
      <button
        class="chip"
        :class="[currentDifficultyColor, { 'is-active': expandedPanel === 'difficulty' }]"
        @click="togglePanel('difficulty')"
      >
        <span class="chip-label">{{ currentDifficultyLabel }}</span>
      </button>
    </div>

    <!-- Expandable options panel -->
    <div
      class="options-panel"
      :class="{ 'is-open': expandedPanel !== null }"
    >
      <div class="options-panel-inner">
        <!-- Size options -->
        <div v-if="expandedPanel === 'size'" class="options-row">
          <button
            v-for="s in sizes"
            :key="s.value"
            @click="emit('update:size', s.value); expandedPanel = null"
            class="option-btn"
            :class="size === s.value ? 'is-selected' : ''"
          >
            {{ s.label }}
          </button>
        </div>

        <!-- Difficulty options -->
        <div v-if="expandedPanel === 'difficulty'" class="options-row">
          <button
            v-for="d in difficulties"
            :key="d.value"
            @click="emit('update:difficulty', d.value); expandedPanel = null"
            class="option-btn"
            :class="[d.colorClass, difficulty === d.value ? 'is-selected' : '']"
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
        <Sparkles v-else :size="28" class="sparkle-icon" />
      </button>
    </div>
  </div>

  <!-- ═══ Desktop layout ═══ -->
  <div v-else class="control-panel-wrap flex flex-col items-center sm:items-stretch">
    <!-- Filtered region: size + difficulty selectors -->
    <div class="control-panel-filtered flex flex-col items-center sm:items-stretch">
      <!-- Size selector -->
      <div class="flex flex-col items-center gap-1 sm:items-stretch">
        <h2 class="section-heading text-muted-foreground" aria-label="Size">
          Size
        </h2>
        <div class="flex flex-col items-center sm:items-stretch">
          <button
            v-for="s in sizes"
            :key="s.value"
            @click="emit('update:size', s.value)"
            class="ctrl-btn rounded-md px-3 py-1.5 text-center text-[1.375rem] transition-all duration-150 sm:py-0.5 sm:text-left sm:text-[1.25rem]"
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
      <div class="flex flex-col items-center gap-1 sm:items-stretch">
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
        <div class="flex flex-col items-center sm:items-stretch">
          <button
            v-for="d in difficulties"
            :key="d.value"
            @click="emit('update:difficulty', d.value)"
            class="ctrl-btn rounded-md px-3 py-1.5 text-center text-[1.375rem] transition-all duration-150 sm:py-0.5 sm:text-left sm:text-[1.25rem]"
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
        <Sparkles v-else :size="28" class="sparkle-icon" />
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
  font-size: 1.625rem;
  line-height: 2rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
}

@media (min-width: 640px) {
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

@media (min-width: 640px) {
  .selected-item {
    background-position: left 0.75rem bottom 0px;
  }
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
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

.chip-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.chip {
  font-family: 'Fira Code', monospace;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  border: 2px solid var(--color-border);
  background: var(--color-accent);
  color: var(--color-foreground);
  cursor: pointer;
  transition: all 150ms;
}

.chip.is-active {
  border-color: var(--color-foreground);
  background: var(--color-card);
}

.chip:active {
  transform: scale(0.95);
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
}

.options-row {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.option-btn {
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  border: none;
  background: transparent;
  color: var(--color-muted-foreground);
  cursor: pointer;
  transition: all 150ms;
}

.option-btn:hover {
  color: var(--color-foreground);
  background: var(--color-accent);
}

.option-btn.is-selected {
  font-weight: 700;
  color: var(--color-foreground);
  background: var(--color-accent);
}
</style>
