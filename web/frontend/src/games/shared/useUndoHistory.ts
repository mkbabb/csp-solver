import { ref } from 'vue'

/**
 * Bounded undo/redo (W6) — a capped `{pos,prev,next}[]` linear history, shared by both
 * games (D16 twin, folded to one home per ballot Q3). Every user cell write records
 * prev→next; Ctrl/Cmd+Z walks the pointer back, Ctrl/Cmd+Shift+Z forward. Only user
 * edits (setCell) are recorded — solve/randomize/clear/hint are not; the stack is reset
 * whenever the board itself is replaced.
 *
 * `applyValue` is the game's cell-write primitive (`applyCellValue`), taken as an arrow
 * wrapper so the composable call is hoisting-safe (the primitive is a function
 * declaration defined later in each game's setup). Given-cell immunity is structural:
 * a pristine given is never a recorded edit target, so undo/redo never writes into a
 * live given.
 */
const UNDO_CAP = 128

export function useUndoHistory(applyValue: (pos: number, value: number) => void) {
  const undoStack = ref<{ pos: number; prev: number; next: number }[]>([])
  const undoIndex = ref(0)
  function clearUndo() {
    undoStack.value = []
    undoIndex.value = 0
  }
  function recordEdit(pos: number, prev: number, next: number) {
    if (prev === next) return
    // Drop the redo tail — a fresh edit forks the timeline.
    if (undoIndex.value < undoStack.value.length) undoStack.value.splice(undoIndex.value)
    undoStack.value.push({ pos, prev, next })
    if (undoStack.value.length > UNDO_CAP) undoStack.value.shift()
    undoIndex.value = undoStack.value.length
  }
  function undo() {
    if (undoIndex.value === 0) return
    undoIndex.value--
    const e = undoStack.value[undoIndex.value]
    applyValue(e.pos, e.prev)
  }
  function redo() {
    if (undoIndex.value >= undoStack.value.length) return
    const e = undoStack.value[undoIndex.value]
    undoIndex.value++
    applyValue(e.pos, e.next)
  }

  return { clearUndo, recordEdit, undo, redo }
}
