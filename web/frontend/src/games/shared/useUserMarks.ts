import { ref, watch, type Ref } from "vue";

/**
 * User pencil marks (T4-W8 ROW 1 — the player's own notes) — the counterpart to
 * `usePencilMarks.ts`'s ENGINE marks, and deliberately its own store. The engine marks
 * ARE the solver's propagated domains, peek-gated and non-editable; these are the player's
 * authored candidates, persistent and editable. The two share a cell but mean different
 * things, so they never share state: an engine-mark refresh or a peek toggle mutates
 * nothing here (the collision gate — `useUserMarks.test.ts` pins it permanently).
 *
 * Snyder notation (the setter-grade standard in SudokuPad/f-puzzles) = two placement slots
 * on ONE surface: CORNER marks hug the cell's corners, CENTER marks sit in a centred row.
 * `pencilMode` routes a digit to one slot or the other (or 'off' → the digit is a value, the
 * frozen T4-WM native-entry path). Game-agnostic by construction: it closes over nothing but
 * `boardGeneration`, so both games mount the identical store.
 *
 * Marks are non-destructive w.r.t. values: they are held independent of the board and the
 * render gates them on an empty cell (a filled cell hides its notes; erasing the digit brings
 * them back — mistake-tolerant, the same gate the engine marks use). A fresh board (clear /
 * randomize / size swap, all of which bump `boardGeneration`) voids every note — stale
 * geometry, a new puzzle — while the mode, a standing preference, survives.
 */
export type PencilMode = "off" | "corner" | "center";

/** The mode cycle for the bare-'P' keyboard toggle: off → corner → center → off. */
const MODE_CYCLE: PencilMode[] = ["off", "corner", "center"];

export function useUserMarks(boardGeneration: Ref<number>) {
  const pencilMode = ref<PencilMode>("off");
  // position-key → sorted candidate digits, one map per placement slot.
  const cornerMarks = ref<Record<string, number[]>>({});
  const centerMarks = ref<Record<string, number[]>>({});

  function setPencilMode(mode: PencilMode) {
    pencilMode.value = mode;
  }
  function cyclePencilMode() {
    const i = MODE_CYCLE.indexOf(pencilMode.value);
    pencilMode.value = MODE_CYCLE[(i + 1) % MODE_CYCLE.length];
  }

  // Toggle `value` in `mapRef[key]`, keeping the array sorted and dropping the key when it
  // empties. Reassigns the map (never mutates in place) so the render tracks it cleanly.
  function toggleIn(mapRef: Ref<Record<string, number[]>>, key: string, value: number) {
    const cur = mapRef.value[key] ?? [];
    const next = cur.includes(value)
      ? cur.filter((v) => v !== value)
      : [...cur, value].sort((a, b) => a - b);
    const map = { ...mapRef.value };
    if (next.length) map[key] = next;
    else delete map[key];
    mapRef.value = map;
  }

  // Erase every note at a cell (both slots) — the pencil-mode Backspace on an empty cell.
  function eraseAt(key: string) {
    if (cornerMarks.value[key]) {
      const next = { ...cornerMarks.value };
      delete next[key];
      cornerMarks.value = next;
    }
    if (centerMarks.value[key]) {
      const next = { ...centerMarks.value };
      delete next[key];
      centerMarks.value = next;
    }
  }

  // Set one slot's list at a cell directly (empty ⇒ erase) — the T4-WU undo/redo replay
  // primitive for a `mark` entry. Bypasses the toggle so a recorded prev/next list restores
  // verbatim. Reassigns the map (never mutates in place) so the render tracks it cleanly.
  function setMarkSlot(slot: PencilMode, key: string, list: number[]) {
    if (slot === "off") return;
    const mapRef = slot === "corner" ? cornerMarks : centerMarks;
    const map = { ...mapRef.value };
    if (list.length) map[key] = [...list];
    else delete map[key];
    mapRef.value = map;
  }

  /**
   * The single authoring seam, symmetric with the cell's `update(pos, value)`: a digit
   * (1..boardSize, validated upstream by the cell) toggles a mark in the active slot; `value
   * === 0` erases the cell's notes. A no-op while the mode is off — marks are only authored in
   * pencil mode, so a stray call can never write a note behind the player's back.
   */
  function toggleUserMark(pos: number, value: number) {
    if (pencilMode.value === "off") return;
    const key = String(pos);
    if (value === 0) {
      eraseAt(key);
      return;
    }
    toggleIn(pencilMode.value === "corner" ? cornerMarks : centerMarks, key, value);
  }

  function clearUserMarks() {
    cornerMarks.value = {};
    centerMarks.value = {};
  }

  // Restore both slots wholesale — the T4-WU board-undo replay, which travels the marks that
  // annotated a board alongside the board itself. Set under `restoring` so the void-watch
  // below no-ops on the accompanying generation bump.
  function setUserMarks(
    corner: Record<string, number[]>,
    center: Record<string, number[]>,
  ) {
    cornerMarks.value = { ...corner };
    centerMarks.value = { ...center };
  }

  // The restore-order flag (T4-WU, E9 r2's sharpest edge): a `board` undo restores the board
  // AND its marks, but a board swap bumps `boardGeneration`, whose void-watch would wipe the
  // marks just restored. The composable raises this for exactly the restore (lowered on the
  // next tick, after the watch has flushed), so the void-watch no-ops only then. Every other
  // generation bump — a real deal/clear/resize — still voids the notes.
  const restoring = ref(false);

  // A fresh board voids all notes; the mode survives (a standing preference). Suppressed
  // during a history restore (the marks are being deliberately re-hydrated).
  watch(boardGeneration, () => {
    if (restoring.value) return;
    clearUserMarks();
  });

  return {
    pencilMode,
    cornerMarks,
    centerMarks,
    setPencilMode,
    cyclePencilMode,
    toggleUserMark,
    clearUserMarks,
    setMarkSlot,
    setUserMarks,
    restoring,
  };
}
