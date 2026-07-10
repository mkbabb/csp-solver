<script setup lang="ts">
import { ref, watch, defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import { useSudoku } from '@games/sudoku/composables/useSudoku'
import SudokuBoard from '@games/sudoku/SudokuBoard/SudokuBoard.vue'
import ControlPanel from '@games/sudoku/ControlPanel/ControlPanel.vue'
import DarkModeToggle from '@pencil/celestial/DarkModeToggle.vue'
import SvgFilters from '@pencil/chrome/SvgFilters.vue'
import HandwrittenLogo from '@pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue'
import AttributionCard from '@pencil/chrome/AttributionCard/AttributionCard.vue'
import HandDrawnOutline from '@pencil/grid/HandDrawnOutline.vue'
// Async + mounted-on-first-peek: keeps the laminate's ~227 LOC out of the main
// chunk (the W9 bundle gate) — same discipline as FilterTuner. The chunk loads
// on the first K/hold, imperceptible locally.
const AnswerKeyLaminate = defineAsyncComponent(() => import('@pencil/sheet/AnswerKeyLaminate.vue'))

// OD-8 in-app game selector. Futoshiki's whole scene (board + controls + its own
// useFutoshiki + Worker) is async + `v-if`-gated below, so it only downloads and spins
// up when Futoshiki is selected — the default Sudoku load is byte-unchanged.
const FutoshikiGame = defineAsyncComponent(() => import('@games/futoshiki/FutoshikiGame.vue'))

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
  // Switching away from Sudoku ends any in-flight Sudoku peek so its laminate doesn't
  // linger under the (unmounted) Sudoku scene.
  if (next !== 'sudoku') endPeek()
}

// Share act (W6): encode the current Sudoku board into `?board=`, write it to the
// address bar (URL wins over storage on reload), and copy the full link. The clipboard
// write may reject without a user-gesture/permission — the param write already happened,
// so the shared link is live in the address bar regardless.
function onShare() {
  const url = sudoku.shareBoard()
  navigator.clipboard?.writeText(url).catch(() => {})
}

// Dev-only tuning tool — explicit env gate, not a commented-out import. import.meta.env.DEV
// is statically inlined at build time, so the dynamic import()'s chunk is dead-code-eliminated
// from production builds rather than merely being unreferenced source.
const FilterTuner = import.meta.env.DEV
  ? defineAsyncComponent(() => import('@pencil/dev/FilterTuner.vue'))
  : null

const sudoku = useSudoku()

const desktopAttribution = ref<InstanceType<typeof AttributionCard> | null>(null)
const mobileAttribution = ref<InstanceType<typeof AttributionCard> | null>(null)
const logoMenu = ref<InstanceType<typeof HandwrittenLogo> | null>(null)

function closeAll() {
  desktopAttribution.value?.close()
  mobileAttribution.value?.close()
  logoMenu.value?.close()
}

// ── Answer-key peek — hold-to-peek at the teacher's laminated key ────
// State lives here (App owns the board+laminate stacking context); ControlPanel
// drives it by holding the BoilDivider, and K/Esc are an unconditional motor-a11y
// alternative. The laminate is read-only — the peek never touches `values`.
const peekActive = ref(false)
const peekTouched = ref(false) // first peek mounts the async laminate; stays true
const peekSolutionValues = ref<Record<string, number>>({})

async function startPeek() {
  if (game.value !== 'sudoku') return // Futoshiki owns its own peek (FutoshikiGame.vue)
  if (peekActive.value) return
  // Guard: no peek mid-solve (design-union §4.2).
  if (sudoku.solveState.value === 'solving') return
  peekTouched.value = true
  peekActive.value = true // freeze + lay the laminate down immediately
  try {
    peekSolutionValues.value = await sudoku.peekSolution()
  } catch {
    // solve unavailable — lift the (empty) laminate back off, fail quietly.
    peekActive.value = false
  }
}

function endPeek() {
  if (!peekActive.value) return
  peekActive.value = false
}

// Engine-domains pencil marks (W6 beat 9): the marks ride the SAME `peekActive`
// the laminate rides — no new handler, so K-peek/Esc isolation carries over
// untouched. Every path that ends the peek (release, Esc, K, the startPeek
// failure catch, a game switch via setGame → endPeek) funnels through
// `peekActive`, so the marks can never outlive the gesture.
watch(peekActive, (a) => sudoku.setMarksActive(a))

// Keyboard: K toggles the peek, Esc closes it (both unconditional).
function onKeydown(e: KeyboardEvent) {
  if (game.value !== 'sudoku') return // Futoshiki's K/Esc is handled in FutoshikiGame.vue
  if (e.key === 'Escape') {
    endPeek()
    return
  }
  if (e.key === 'k' || e.key === 'K') {
    const t = e.target as HTMLElement | null
    // W6: the guard blocks exactly the roving-tabindex resting state (a board
    // cell input) — nothing else. The old tag-based block also swallowed K from
    // any input-shaped element outside the board.
    if (t?.closest('.board-cells')) return
    e.preventDefault()
    if (peekActive.value) endPeek()
    else startPeek()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
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
        <!-- Board + Controls row (Sudoku) -->
        <div v-if="game === 'sudoku'" class="app-layout">
          <!-- Board + the held answer-key laminate (a sibling over the board, never
               inside the grid's filtered group — kill-gate rule 6). The host tightly
               wraps the board box so the laminate's inset:0 aligns to .board-cells. -->
          <div class="board-peek-host">
            <SudokuBoard
              :size="sudoku.size.value"
              :board-size="sudoku.boardSize.value"
              :total-cells="sudoku.totalCells.value"
              :values="sudoku.values.value"
              :given-cells="sudoku.givenCells.value"
              :overridden-cells="sudoku.overriddenCells.value"
              :animating-cells="sudoku.animatingCells.value"
              :solve-state="sudoku.solveState.value"
              :solved-values="sudoku.solvedValues.value"
              :board-generation="sudoku.boardGeneration.value"
              :difficulty="sudoku.difficulty.value"
              :error-code="sudoku.errorCode.value"
              :solve-stats="sudoku.solveStats.value"
              :pencil-marks="sudoku.pencilMarks.value"
              @update-cell="(pos: number, val: number) => sudoku.setCell(pos, val)"
              @retry="sudoku.solve()"
              @undo="sudoku.undo()"
              @redo="sudoku.redo()"
              @hint="(pos: number) => sudoku.hintCell(pos)"
            />
            <AnswerKeyLaminate
              v-if="peekTouched"
              :active="peekActive"
              :solution="peekSolutionValues"
              :board-size="sudoku.boardSize.value"
              :subgrid-size="sudoku.size.value"
              :original-given-cells="sudoku.originalGivenCells.value"
            />
          </div>

          <!-- Stacked (<lg, incl. iPad portrait — R3): unified controls card below board -->
          <div class="mobile-board-width lg:hidden">
            <HandDrawnOutline :stroke-width="3">
              <div class="rounded-lg bg-card px-2 py-1.5">
                <ControlPanel
                  :size="sudoku.size.value"
                  :difficulty="sudoku.difficulty.value"
                  :loading="sudoku.loading.value"
                  :solve-state="sudoku.solveState.value"
                  mobile
                  @update:size="sudoku.size.value = $event"
                  @update:difficulty="sudoku.difficulty.value = $event"
                  @randomize="sudoku.randomize()"
                  @clear="sudoku.clearBoard()"
                  @solve="sudoku.solve()"
                  @share="onShare()"
                  @peek-start="startPeek()"
                  @peek-end="endPeek()"
                />
              </div>
            </HandDrawnOutline>
          </div>

          <!-- Row-regime sidebar (≥lg — R3: iPad portrait clips at md): controls card,
               vertically centered against the board (H8-centering-only). -->
          <div class="hidden lg:flex lg:flex-col lg:items-start">
            <HandDrawnOutline :stroke-width="3">
              <div class="controls-card rounded-xl bg-card p-5">
                <ControlPanel
                  :size="sudoku.size.value"
                  :difficulty="sudoku.difficulty.value"
                  :loading="sudoku.loading.value"
                  :solve-state="sudoku.solveState.value"
                  @update:size="sudoku.size.value = $event"
                  @update:difficulty="sudoku.difficulty.value = $event"
                  @randomize="sudoku.randomize()"
                  @clear="sudoku.clearBoard()"
                  @solve="sudoku.solve()"
                  @share="onShare()"
                  @peek-start="startPeek()"
                  @peek-end="endPeek()"
                />
              </div>
            </HandDrawnOutline>
          </div>
        </div>

        <!-- Board + Controls (Futoshiki) — its own self-contained scene, lazy-mounted so
             useFutoshiki + its Worker only start when the game is actually selected. -->
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

/* H8-centering-only: in the row regime the controls card centers vertically against
   the board (was flex-start); stacked, the same value centers the column cross-axis. */
.app-layout {
  display: flex;
  align-items: center;
  gap: 2rem;
}

/* Positioning context for the answer-key laminate. Shrink-wraps the board box
   (the board-wrapper carries a definite, viewport-driven width + aspect-square),
   so the absolutely-positioned laminate's inset:0 tracks the board exactly. The
   below-board margin strip lives inside the board and paints past this host. */
.board-peek-host {
  position: relative;
  display: flex;
}

/* Stacked regime — <lg after R3 (iPad portrait clips in the row layout: board 85vw +
   2rem gap + the controls card overflow 768px by double digits). */
@media (max-width: 1023px) {
  .app-layout {
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    width: 100%;
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

.controls-card {
  position: relative;
  z-index: 45;
}

.mobile-board-width {
  width: min(42rem, calc(100vw - 1.5rem));
}
</style>
