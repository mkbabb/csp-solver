<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import SudokuGame from '@games/sudoku/SudokuGame.vue'
import DarkModeToggle from '@pencil/celestial/DarkModeToggle.vue'
import SvgFilters from '@pencil/chrome/SvgFilters.vue'
import { HandwrittenLogo, AttributionCard } from '@pencil/chrome'

// OD-8 in-app game selector. Futoshiki's whole scene (board + controls + its own useFutoshiki
// + Worker) is async + `v-if`-gated below, so it only downloads and spins up when Futoshiki is
// selected. Sudoku rides the main chunk (eager/static import) — the default game's load is
// byte-unchanged (ratified asymmetry, P4 #4).
const FutoshikiGame = defineAsyncComponent(() => import('@games/futoshiki/FutoshikiGame.vue'))

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
const game = ref<GameId>(parseGame())
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
          />
        </div>

        <!-- Two symmetric scenes, one mounted at a time. Sudoku eager/static (default game,
             main chunk); Futoshiki async so useFutoshiki + its Worker only start when selected. -->
        <SudokuGame v-if="game === 'sudoku'" />
        <FutoshikiGame v-if="game === 'futoshiki'" />
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
