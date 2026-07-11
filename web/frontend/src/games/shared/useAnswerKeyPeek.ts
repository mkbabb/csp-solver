import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import { BOARD_CELLS_CLASS } from './constants'

/**
 * Answer-key peek — hold-to-peek at the teacher's laminated key, shared by both game scenes
 * (SudokuGame + FutoshikiGame). The laminate is read-only: the peek never touches `values`.
 *
 * Branch-free by construction (P2-L5 §R6(a)): `AnswerKeyLaminate`'s activation watch is
 * `{ immediate: true }`, so setting `peekTouched` then `peekActive` synchronously in one tick
 * lays the laminate down whether the component mounts sync (Futoshiki's static import) or
 * async (Sudoku's `defineAsyncComponent`) — no `nextTick` guard, no options.
 *
 * State lives in the composable; the scene stacks the board + laminate and drives the gesture
 * via ControlPanel's hold and an unconditional K/Esc keyboard alternative. Only the mounted
 * scene's listener is live (each scene is `v-if`-gated), so K/Esc always target the active game.
 */
export interface AnswerKeyPeekTarget {
  /** The game's solve-state ref — the peek is blocked mid-solve (design-union §4.2). */
  solveState: Readonly<Ref<string>>
  /** Resolve the current board's solution as a positional value map. */
  peekSolution: () => Promise<Record<string, number>>
  /** Mirror the peek's active flag into the engine-domains pencil marks (W6 beat 9). */
  setMarksActive: (active: boolean) => void
}

export function useAnswerKeyPeek(target: AnswerKeyPeekTarget) {
  const peekActive = ref(false)
  const peekTouched = ref(false) // first peek mounts the async laminate; stays true
  const peekSolutionValues = ref<Record<string, number>>({})

  async function startPeek() {
    if (peekActive.value) return
    if (target.solveState.value === 'solving') return
    peekTouched.value = true
    peekActive.value = true // freeze + lay the laminate down immediately
    try {
      peekSolutionValues.value = await target.peekSolution()
    } catch {
      // solve unavailable — lift the (empty) laminate back off, fail quietly.
      peekActive.value = false
    }
  }

  function endPeek() {
    if (!peekActive.value) return
    peekActive.value = false
  }

  // The marks ride the SAME `peekActive` the laminate rides — no new handler, so K-peek/Esc
  // isolation carries over untouched. Every path that ends the peek (release, Esc, K, the
  // startPeek failure catch, unmount on game switch) funnels through `peekActive`, so the
  // marks can never outlive the gesture.
  watch(peekActive, (a) => target.setMarksActive(a))

  // Keyboard: K toggles the peek, Esc closes it (both unconditional).
  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      endPeek()
      return
    }
    if (e.key === 'k' || e.key === 'K') {
      const t = e.target as HTMLElement | null
      // The guard blocks exactly the roving-tabindex resting state (a board cell input) —
      // nothing else. `BOARD_CELLS_CLASS` is the cell-grid container contract every board carries.
      if (t?.closest(`.${BOARD_CELLS_CLASS}`)) return
      e.preventDefault()
      if (peekActive.value) endPeek()
      else startPeek()
    }
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onUnmounted(() => window.removeEventListener('keydown', onKeydown))

  return { peekActive, peekTouched, peekSolutionValues, startPeek, endPeek }
}
