import { computed, ref, type Ref } from "vue";

/**
 * Engine-domains pencil marks (W6 beat 9 — the P4 spike landed as product; D16 twin,
 * folded to one home per ballot Q3). The marks ARE the solver's propagated domains
 * (root AC-3 + GAC, zero search), but they are OPT-IN, never ambient: at full GAC
 * strength most served boards collapse to all-singleton domains (the P4 spoiler
 * finding), so always-on marks would be a disclosure, not a hint. They ride the
 * existing peek gesture — each scene mirrors `peekActive` into `setMarksActive`, no new
 * handler — visible only while the hold-to-peek is held; release clears them. UNSAT (the
 * user wrote a contradiction) or any worker fault simply clears the marks: they are a
 * courtesy, never an error surface.
 *
 * `propagate` is a per-game thunk closing over each game's live solve state (Sudoku's
 * `(values, size)` vs Futoshiki's `(values, boardSize, inequalities)`); it is the sole
 * per-game variance. `marksActive` is RETURNED so each game keeps its identical
 * `watch([values, boardGeneration], () => { if (marksActive.value) refreshMarks() },
 * {deep:true})` byte-preserved — the guard is deliberately NOT moved inside (that would
 * alter the timer-set behavior).
 */
export function usePencilMarks(
  propagate: () => Promise<Uint32Array>,
  values: Ref<Record<string, number>>,
  boardSize: Ref<number>,
  totalCells: Ref<number>,
) {
  const marksActive = ref(false);
  const pencilMasks = ref<Uint32Array | null>(null);
  let marksTimer: ReturnType<typeof setTimeout> | null = null;
  let marksSeq = 0;
  function refreshMarks(delayMs = 150) {
    if (marksTimer) clearTimeout(marksTimer);
    marksTimer = setTimeout(async () => {
      marksTimer = null;
      const seq = ++marksSeq;
      try {
        const masks = await propagate();
        // Last-write-wins seq guard + the gesture may have released mid-flight.
        if (seq === marksSeq && marksActive.value) pencilMasks.value = masks;
      } catch {
        if (seq === marksSeq) pencilMasks.value = null;
      }
    }, delayMs);
  }
  function setMarksActive(on: boolean) {
    if (marksActive.value === on) return;
    marksActive.value = on;
    if (on) {
      refreshMarks(0); // the gesture is held NOW — no debounce on the first paint
    } else {
      if (marksTimer) {
        clearTimeout(marksTimer);
        marksTimer = null;
      }
      marksSeq++; // void any in-flight round-trip
      pencilMasks.value = null;
    }
  }

  const pencilMarks = computed<Record<string, number[]>>(() => {
    const masks = pencilMasks.value;
    const bs = boardSize.value;
    // Stale-shape guard: a size switch mid-flight leaves masks from the
    // previous geometry; render nothing until the next round-trip lands.
    if (!masks || masks.length !== totalCells.value) return {};
    const out: Record<string, number[]> = {};
    for (let i = 0; i < masks.length; i++) {
      if ((values.value[String(i)] ?? 0) !== 0) continue;
      const cand: number[] = [];
      for (let v = 1; v <= bs; v++) {
        if (masks[i] & (1 << v)) cand.push(v);
      }
      // Only show marks where propagation has actually bitten — a cell
      // with its full domain intact carries no information, just noise.
      if (cand.length > 0 && cand.length < bs) out[String(i)] = cand;
    }
    return out;
  });

  return { marksActive, refreshMarks, setMarksActive, pencilMarks };
}
