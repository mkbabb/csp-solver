<script setup lang="ts">
import { ref, defineAsyncComponent, h } from 'vue'
import { usePrefersReducedMotion } from '@mkbabb/pencil-boil'
import SudokuGame from '@games/sudoku/SudokuGame.vue'
import DarkModeToggle from '@pencil/celestial/DarkModeToggle.vue'
import SvgFilters from '@pencil/chrome/SvgFilters.vue'
import ScribbleLoader from '@pencil/chrome/ScribbleLoader.vue'
import { HandwrittenLogo, AttributionCard } from '@pencil/chrome'

// OD-8 in-app game selector. Futoshiki's whole scene (board + controls + its own useFutoshiki
// + Worker) is async + `v-if`-gated below, so it only downloads and spins up when Futoshiki is
// selected. Sudoku rides the main chunk (eager/static import) — the default game's load is
// byte-unchanged (ratified asymmetry, P4 #4).
// F6-D3 cold fallback: the chunk preloads on menu-OPEN (see preloadFutoshiki), so by selection
// it's normally cached. If it's genuinely cold (throttled first select — G10's
// `first-select-void-400ms.png`): blank paper ≤300ms, then the thinking-scribble — never a
// spinner (design §5.1).
const FutoshikiGame = defineAsyncComponent({
  loader: () => import('@games/futoshiki/FutoshikiGame.vue'),
  loadingComponent: {
    render: () => h('div', { class: 'scene-loading' }, [h(ScribbleLoader, { size: 56 })]),
  },
  delay: 300,
})

// Dev-only tuning tool — explicit env gate, not a commented-out import. import.meta.env.DEV
// is statically inlined at build time, so the dynamic import()'s chunk is dead-code-eliminated
// from production builds rather than merely being unreferenced source.
const FilterTuner = import.meta.env.DEV
  ? defineAsyncComponent(() => import('@pencil/dev/FilterTuner.vue'))
  : null

type GameId = 'sudoku' | 'futoshiki'
const gameOptions = [
  { value: 'sudoku', label: 'sudoku' },
  { value: 'futoshiki', label: 'futoshiki' },
]
function parseGame(): GameId {
  return new URLSearchParams(window.location.search).get('game') === 'futoshiki'
    ? 'futoshiki'
    : 'sudoku'
}
// ── F6 page-turn orchestrator (T3-W10) ───────────────────────────────────
// The two games are exercises in the same graded workbook: a switch is the pencil erasing
// this exercise, then drawing the next — erase (beat 1, the existing animateErase routed at
// last) → seam (beat 2, the v-if flip on the erase's completion) → draw-in (beat 3, the mount
// behavior as shipped). Two refs split state from paint: `game` is the SELECTED game and
// updates at CLICK (ARIA/label/URL truthful immediately); `scene` is the MOUNTED scene and
// flips at the seam. Under prefers-reduced-motion the beat-1 hold is SKIPPED — the swap stays
// a same-frame cut (a PRM user waiting 250ms for an invisible animation is a regression).
//
// keyframes.js CLOSED-REJECT covenant (F6 §3, G3 source-verified): both animated halves of
// this transition — the erase and the draw-in — are one-shot `sequence` subscribers on the ONE
// pencil-boil rAF chain (usePathAnimation.ts); the fades are compositor-only CSS. Re-adopting
// @mkbabb/keyframes.js (standalone at 5.2.0 though it now is) would add a second animation
// brain + a runtime CSS parser to run 2 fades + 2 existing sequences, re-splitting the clock
// W8/W12 unified. Re-entry is a CAPABILITY GAP — numeric path morphing / spring physics
// (glyphPaths.ts's dormant affordance) — never a version number.
const game = ref<GameId>(parseGame()) // selected — truthful at click
const scene = ref<GameId>(game.value) // mounted — flips at the seam
const leaving = ref(false) // beat 1 in flight: outgoing grid erases, chrome fades
let seamGuard: number | null = null
const reducedMotion = usePrefersReducedMotion()

function setGame(val: string | number) {
  const next: GameId = val === 'futoshiki' ? 'futoshiki' : 'sudoku'
  if (next === game.value) return
  game.value = next
  const url = new URL(window.location.href)
  url.searchParams.set('game', next)
  // Accretion fix (W6): each game's URL params co-exist by design, but a `?board=` blob
  // (up to ~256 chars) riding into the other game's URL defeats the clean-URL rationale
  // that made the permalink share-on-demand. Strip BOTH games' board/size params on
  // switch — the incoming game re-adds only its own via its composable's syncToUrl.
  for (const key of ['board', 'size', 'difficulty', 'board_size']) url.searchParams.delete(key)
  history.replaceState(null, '', url.toString())
  // Switching games unmounts the outgoing scene (v-if), which stops its keyboard listener and
  // ends any in-flight peek with it — no cross-scene teardown needed here.
  if (reducedMotion.value) {
    scene.value = next // PRM: same-frame cut, no beat-1 hold
    return
  }
  leaving.value = true // beat 1: the mounted scene erases; `erased` fires the seam
  // Seam guard: if the outgoing "scene" can't erase — e.g. it's still the async loading
  // placeholder (no board mounted, so no `erased` will ever come) — force the seam late
  // rather than never. A page-turn that degrades to a hard cut is a blemish; a switch
  // that deadlocks (`next === game.value` guards re-selects) is a bug.
  seamGuard = window.setTimeout(onSceneErased, 900)
}

// Beat 2 — the seam. The paper (bg + grain) never changes; only ink swaps. If the user
// re-selected the outgoing game mid-erase, `scene` stays put and the board redraws itself
// (its `leaving` watch sees false + 'hidden' → 'drawing') — a page-turn back to the same page.
function onSceneErased() {
  if (seamGuard !== null) {
    clearTimeout(seamGuard)
    seamGuard = null
  }
  if (!leaving.value) return // guard + real seam can't double-fire
  scene.value = game.value
  leaving.value = false
}

// F6-D3: warm the other scene's chunk the moment the picker OPENS — by selection time it's
// cached, killing the first-select void structurally (G10 dramatized it: 150–3000ms of pure
// empty paper under CDP throttle). Sudoku rides the main chunk; only Futoshiki is lazy.
let futoshikiWarm = false
function preloadFutoshiki() {
  if (futoshikiWarm) return
  futoshikiWarm = true
  import('@games/futoshiki/FutoshikiGame.vue').catch(() => {
    futoshikiWarm = false // a failed warm retries on the next open
  })
}

const desktopAttribution = ref<InstanceType<typeof AttributionCard> | null>(null)
const mobileAttribution = ref<InstanceType<typeof AttributionCard> | null>(null)
const logoMenu = ref<InstanceType<typeof HandwrittenLogo> | null>(null)

function closeAll() {
  desktopAttribution.value?.close()
  mobileAttribution.value?.close()
  logoMenu.value?.close()
}
</script>

<template>
  <div
    class="flex h-screen flex-col bg-background py-1 md:py-3 text-foreground"
    @click="closeAll"
  >
    <!-- Shared SVG filter definitions -->
    <SvgFilters />

    <!-- Filter tuner — dev tool, env-gated (import.meta.env.DEV), absent from prod builds -->
    <component :is="FilterTuner" v-if="FilterTuner" />

    <!-- Desktop: fixed corner overlay -->
    <AttributionCard ref="desktopAttribution" />

    <div class="corner-right" @click.stop>
      <DarkModeToggle />
    </div>

    <main class="main-content flex min-h-0 flex-1 flex-col items-center justify-center px-1 md:px-4">
      <div class="board-group">
        <!-- Mobile: @mbabb in-flow, left-aligned with logo -->
        <AttributionCard ref="mobileAttribution" mobile />
        <!-- Masthead: the pencil wordmark renders the CURRENT game's name and IS the game
             picker — a real <button> opening a hand-drawn paper-note listbox of both games.
             Selection swaps the game via the existing ?game= mechanism (setGame). Pencil
             never imports games: the id + options are props; the choice comes back via @select. -->
        <div class="masthead">
          <HandwrittenLogo
            ref="logoMenu"
            :game="game"
            :options="gameOptions"
            @select="setGame"
            @open="preloadFutoshiki"
          />
        </div>

        <!-- Two symmetric scenes, one mounted at a time (v-if on `scene`, which flips at the
             page-turn's seam — `game` is the selected id and drives the wordmark/URL at click).
             Sudoku eager/static (default game, main chunk); Futoshiki async so useFutoshiki +
             its Worker only start when selected. -->
        <SudokuGame v-if="scene === 'sudoku'" :leaving="leaving" @erased="onSceneErased" />
        <FutoshikiGame v-if="scene === 'futoshiki'" :leaving="leaving" @erased="onSceneErased" />
      </div>

    </main>
  </div>
</template>

<style scoped>
.corner-right {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 60;
  --toggle-size: 5rem;
}

/* The 8rem md rung died with the md row regime (R3): at 768–1023 the layout now
   stacks, and a 128px fixed sun grazed the board's top-right frame. Stacked keeps
   the 5rem mobile sun; the row regime (≥lg) keeps its 13rem corner celestial. */
@media (min-width: 1024px) {
  .corner-right {
    --toggle-size: 13rem;
  }
}

@media (max-width: 767px) {
  .corner-right {
    top: -0.25rem;
    right: 0.25rem;
  }
}

/* R3 — the 42×32px logo-button↔toggle contention at 375: the centered wordmark's
   caret end ran under the fixed 5rem toggle. One rung down on the toggle + a small
   masthead clearance separates the two hit targets completely. */
@media (max-width: 480px) {
  .corner-right {
    --toggle-size: 4rem;
  }

  .masthead {
    margin-top: 0.75rem;
  }
}

.board-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: visible;
}

/* F6-D3 cold fallback host — the thinking-scribble centered on otherwise-blank paper,
   sized so the page doesn't collapse to zero height while the chunk fetches. */
.scene-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 16rem;
  color: var(--color-muted-foreground);
}

/* Masthead: the wordmark-as-game-picker (renders the current game, opens the picker menu). */
.masthead {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
}

@media (max-width: 1023px) {
  .masthead {
    align-items: center;
  }
}

@media (max-width: 1023px) {
  .board-group {
    align-items: center;
  }
}

@media (max-width: 1023px) {
  .main-content {
    justify-content: flex-start;
    padding-top: 0.25rem;
    padding-bottom: 0.5rem;
  }
}
</style>
