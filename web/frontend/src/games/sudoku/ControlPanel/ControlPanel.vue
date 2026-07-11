<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from 'vue'
import { Eraser, Share2 } from '@lucide/vue'
import { SolveIcon, DiceIcon, OptionSelector } from '@pencil/chrome'
import BoilDivider from '@pencil/chrome/BoilDivider.vue'
import SheetWashiLabel from '@pencil/sheet/SheetWashiLabel.vue'
import ScribbleLoader from '@pencil/chrome/ScribbleLoader.vue'
import type { Difficulty } from '@games/sudoku/types'
import { useTheme } from '@/composables/useTheme'
import { useButtonAnimation } from '@games/shared/useButtonAnimation'
import { sizeOptions, difficultyOptions } from './constants'

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

// Reactive filter URL for control panel — avoids :global(.dark) CSS scoping bug
const panelFilter = computed(() => isDark.value ? 'url(#stroke-dark)' : 'url(#stroke-light)')

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
  (e: 'share'): void
  (e: 'peek-start'): void
  (e: 'peek-end'): void
}>()

// ── Hold-to-peek gesture on the BoilDivider (the hold surface, fe-composition
// §7b — the union diff held Solve, stale post-extraction). Press-and-hold ≥350ms
// → the answer-key laminate; a shorter press does nothing (the divider has no
// click action, so no click-suppression bookkeeping is needed). App.vue owns the
// peek state; this only reports the gesture. Keyboard peek rides App.vue's K/Esc.
const PEEK_HOLD_MS = 350
let peekTimer: ReturnType<typeof setTimeout> | null = null
const isPeeking = ref(false)

function onDividerHoldStart() {
  if (peekTimer) clearTimeout(peekTimer)
  peekTimer = setTimeout(() => {
    peekTimer = null
    isPeeking.value = true
    emit('peek-start')
  }, PEEK_HOLD_MS)
}

function onDividerHoldEnd() {
  if (peekTimer) {
    clearTimeout(peekTimer)
    peekTimer = null
  }
  if (isPeeking.value) {
    isPeeking.value = false
    emit('peek-end')
  }
}

onBeforeUnmount(() => {
  if (peekTimer) clearTimeout(peekTimer)
  if (isPeeking.value) emit('peek-end')
  if (shareConfirmTimer) clearTimeout(shareConfirmTimer)
})

// ── Share-on-demand permalink (W6): copy a `?board=` link, confirm in the washi ──
// The parent owns the encode + address-bar write + clipboard copy (@share); this only
// flips the washi label to a transient "copied!" so the confirmation wears the same
// tape grammar as every other button tooltip.
const { animating: shareAnimating, trigger: triggerShare } = useButtonAnimation(500)
const shareConfirm = ref(false)
let shareConfirmTimer: ReturnType<typeof setTimeout> | null = null
function onShare() {
  triggerShare()
  emit('share')
  shareConfirm.value = true
  if (shareConfirmTimer) clearTimeout(shareConfirmTimer)
  shareConfirmTimer = setTimeout(() => {
    shareConfirm.value = false
  }, 1600)
}

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

    <!-- Hold the boiling divider to peek at the answer key (the hold surface). -->
    <div
      class="peek-hold-surface"
      title="Hold to peek at the answer key"
      @pointerdown="onDividerHoldStart()"
      @pointerup="onDividerHoldEnd()"
      @pointerleave="onDividerHoldEnd()"
      @pointercancel="onDividerHoldEnd()"
    >
      <BoilDivider />
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
        <ScribbleLoader v-if="loading && !solveAnimating" :size="22" class="text-muted-foreground" />
        <SolveIcon v-else :size="28" class="sparkle-icon" :playing="solveAnimating" />
      </button>
      <button
        @click="onShare()"
        :disabled="loading"
        class="icon-btn"
        :aria-label="shareConfirm ? 'Link copied' : 'Share board link'"
        :title="shareConfirm ? 'Link copied' : 'Share board link'"
      >
        <Share2 :size="26" :class="{ 'share-pop': shareAnimating }" />
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

    <!-- Hold the boiling divider to peek at the answer key (the hold surface).
         L14: a washi label makes the hidden affordance discoverable — same tape
         grammar as the buttons; the native title yields to it (no double tooltip). -->
    <div
      class="peek-hold-surface group relative my-2"
      @pointerdown="onDividerHoldStart()"
      @pointerup="onDividerHoldEnd()"
      @pointerleave="onDividerHoldEnd()"
      @pointercancel="onDividerHoldEnd()"
    >
      <BoilDivider />
      <SheetWashiLabel text="hold to peek" :seed="53" />
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
        <SheetWashiLabel text="Randomize" :seed="11" />
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
        <SheetWashiLabel text="Clear" :seed="23" />
      </button>

      <button
        @click="onSolve()"
        :disabled="loading"
        class="icon-btn group relative"
        aria-label="Solve puzzle"
      >
        <ScribbleLoader v-if="loading && !solveAnimating" :size="22" class="text-muted-foreground" />
        <SolveIcon v-else :size="28" class="sparkle-icon" :playing="solveAnimating" />
        <SheetWashiLabel text="Solve" :seed="37" />
      </button>

      <button
        @click="onShare()"
        :disabled="loading"
        class="icon-btn group relative"
        aria-label="Share board link"
      >
        <Share2 :size="26" :class="{ 'share-pop': shareAnimating }" />
        <SheetWashiLabel :text="shareConfirm ? 'copied!' : 'share link'" :seed="71" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.control-panel-wrap {
  font-family: var(--font-display);
  font-optical-sizing: auto;
}

.control-panel-filtered {
  filter: v-bind(panelFilter);
  /* R3 (W5 repair): own compositing layer. Unlayered, this 3-pass stroke filter
     re-rasterizes whenever the panel repaints OR MOVES — and H8's centered
     .app-layout moves it on every board-height change (a size switch re-centers
     the card), which carried ~+125 ms of size-switch raster past the p3 class.
     Layerized, a move is a compositor offset and boil-tick invalidations stop
     sharing tiles with the filter (measured −57% switch raster vs unlayered). */
  will-change: transform;
}

/* .section-heading type register lives in assets/typography.css (@layer
   components) — the √φ subheading→heading eyebrow, shared with futoshiki (D4).
   Only the component-local hover flourish stays scoped here. */

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

/* Hold surface for the answer-key peek — hosts the BoilDivider, giving the
   press-and-hold a comfortable target and disabling text-select / touch-scroll
   so the browser doesn't swallow the gesture. The button tooltips are now washi
   labels (SheetWashiLabel), which carry their own hover + :focus-visible reveal. */
.peek-hold-surface {
  cursor: grab;
  touch-action: none;
  user-select: none;
}

.peek-hold-surface:active {
  cursor: grabbing;
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

/* Mobile layout */
.mobile-control-panel {
  font-family: var(--font-display);
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

/* Share pop — a small tape-press flourish on the share act (Band C one-shot). */
.share-pop {
  display: inline-flex;
  animation: sharePop 500ms ease;
}

@keyframes sharePop {
  0% { transform: scale(1) rotate(0deg); }
  30% { transform: scale(1.18) rotate(-6deg); }
  55% { transform: scale(0.96) rotate(4deg); }
  100% { transform: scale(1) rotate(0deg); }
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
