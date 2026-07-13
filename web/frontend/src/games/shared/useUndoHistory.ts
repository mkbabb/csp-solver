import { computed, ref } from "vue";

/**
 * The history spine (T4-WU / E9) — one tagged inverse-delta log over a content-hash-deduped
 * board POOL, shared by both games (D16 twin). It generalises W6's cell-value-only
 * `{pos,prev,next}[]` to a heterogeneous ordered log replayed by one dispatcher:
 *
 *   - `value` — a cell write/erase (the W6 delta, ~29 B). `tone:'solved'` marks HINT INK
 *     (T4-WU): undoing strips the `solvedValues` membership through `removeHintInk`; redo
 *     re-inks in the solver's tone through `applyHintInk`.
 *   - `mark`  — a T4-W8 user pencil-mark toggle (corner and/or center slot). A digit toggle
 *     touches one slot; an erase (`value===0`) touches both — one gesture, one entry, so
 *     both slots ride a single `MarkEntry`.
 *   - `batch` — a T4-W8 Fill sweep (W7's `fillAllForced`): every forced placement the one press
 *     made, recorded as ONE entry = ONE gesture = ONE undo/redo. An array of value deltas the
 *     dispatcher applies/inverts in a single step (inverse order on undo); each carries the
 *     fill's tone, so undo strips the `solvedValues` ink exactly as the single-cell hint-ink
 *     path does. Delta-only — the board pool is NOT involved (self-contained deltas, no ref).
 *   - `board` — a whole-board swap (deal / clear / solve / resize): pointer refs into the
 *     pool, never inline copies. Git's object model in miniature — the content hash is
 *     simultaneously identifier, dedup key, and checksum, so two identical boards share one
 *     blob at no extra cost. Refcounted: a FIFO-evicted or fork-truncated entry releases its
 *     refs, and a blob GCs the instant its last reference drops.
 *
 * Why a delta log + hash pool and NOT a HAMT/trie (the owner's suggestion, adjudicated in
 * E9 r2 §1-2): a value edit touches ONE cell, so a delta spends ~29 B where a persistent map
 * would copy a root→leaf path AND retain every intermediate root — MORE bytes, more
 * complexity, no compensating bound. 200 deltas ≈ 6 KB; 200 raw 16×16 snapshots ≈ 500 KB
 * (the owner's forbidden case); the hybrid here is the honest reading of "pointers not raw
 * boards, de-duplicate."
 *
 * SESSION-ONLY, IN-MEMORY: the timeline does NOT survive reload. The persisted unit stays
 * the single-board snapshot (localStorage) + the `?board=` permalink (URL-wins on reload);
 * rehydrating a 200-entry timeline would contradict that stateless single-snapshot contract
 * and risk board/history disagreement. The board persists; the timeline does not.
 *
 * The composable is the SOLE log author — entries push AFTER an async op resolves, never
 * before, so a rejected or stale generate leaves ZERO orphan entries. Undo/redo REFUSE while
 * a board op is pending (`effects.pending`), matching the coarse buttons' `:disabled`.
 */

/** Cap 200 (E9 r2 §5, from W6's `UNDO_CAP=128`): delta-dominated and flat across 100–200
 *  (~6 KB); the pool is refcount-bounded independently, so the ceiling is a UX safety-net
 *  choice the arithmetic proves free. */
const UNDO_CAP = 200;

type MarkSlot = "corner" | "center";
type BoardOp = "deal" | "clear" | "solve" | "resize";

/** A per-slot mark delta; present on a `MarkEntry` only for the slot(s) the gesture touched. */
interface SlotDelta {
  prev: number[];
  next: number[];
}

/** One value delta in a Fill-sweep batch — the same `{pos, prev, next}` shape a `value` entry
 *  carries, with the sweep's `tone` so undo strips the solver ink (via `removeHintInk`) exactly
 *  as the single-cell hint-ink path does. `tone` absent ⇒ a plain value write on replay. */
export interface BatchDelta {
  pos: number;
  prev: number;
  next: number;
  tone?: "solved";
}

type UndoEntry =
  | { kind: "value"; pos: number; prev: number; next: number; tone?: "solved" }
  | { kind: "batch"; deltas: BatchDelta[] }
  | { kind: "mark"; pos: number; corner?: SlotDelta; center?: SlotDelta }
  | {
      kind: "board";
      prevRef: string;
      nextRef: string;
      prevMarksRef: string;
      nextMarksRef: string;
      op: BoardOp;
    };

/**
 * The replay effects the game supplies — the composable knows how to enact each kind; the
 * spine only decides WHICH effect and with WHICH argument. `B` is the game's board blob
 * (values + given/overridden/solved sets flattened to arrays, + futoshiki's inequalities),
 * `M` its marks blob (`{corner,center}` slot maps). Both must be JSON-serialisable — the
 * pool hashes them by content.
 */
interface UndoEffects<B, M> {
  /** Plain cell write (the W6 `applyCellValue`). */
  applyValue: (pos: number, value: number) => void;
  /** Redo of hint ink: write the digit AND re-add it to `solvedValues` (solver tone). */
  applyHintInk: (pos: number, value: number) => void;
  /** Undo of hint ink: write `prev` AND strip the `solvedValues` membership (re-arm flourish). */
  removeHintInk: (pos: number, prev: number) => void;
  /** Set a mark slot's list at a cell (empty list ⇒ erase). */
  applyMark: (slot: MarkSlot, pos: number, list: number[]) => void;
  /** Board + marks restore, run under the composable's transient `restoring` flag so the
   *  generation-bump void-watch no-ops for exactly this restore (the restore-order edge). */
  restoreBoard: (board: B, marks: M) => void;
  /** True while a board op is in flight — undo/redo refuse (no cancel; the transport has no
   *  abort). Mirrors the coarse buttons' `:disabled="loading"`. */
  pending: () => boolean;
}

/** FNV-1a, two offset rounds → a ~64-bit hex digest. Content-addresses a pooled blob; a
 *  collision would (at worst) restore a wrong board on undo — a recoverable UX glitch, not
 *  data loss (the persisted board is a separate unit) — and for a session's <100 distinct
 *  boards the probability is ~1e-11. */
function hashBlob(blob: unknown): string {
  const s = JSON.stringify(blob);
  let h1 = 0x811c9dc5;
  let h2 = 0x811c9dc5 ^ 0x9e3779b9;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193);
    h2 = Math.imul(h2 ^ c, 0x01000193);
  }
  return (
    (h1 >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0")
  );
}

export function useUndoHistory<B, M>(effects: UndoEffects<B, M>) {
  const undoStack = ref<UndoEntry[]>([]);
  const undoIndex = ref(0);

  // The content-addressed board pool: hash → {blob, refcount}. Only `board` entries hold
  // refs (value/mark entries are self-contained deltas).
  const pool = new Map<string, { blob: B | M; refs: number }>();

  function poolRetain(blob: B | M): string {
    const hash = hashBlob(blob);
    const e = pool.get(hash);
    if (e) e.refs++;
    else pool.set(hash, { blob, refs: 1 });
    return hash;
  }
  function poolRelease(hash: string) {
    const e = pool.get(hash);
    if (!e) return;
    e.refs--;
    if (e.refs <= 0) pool.delete(hash); // GC iff unreferenced
  }
  function poolGet<T extends B | M>(hash: string): T {
    return pool.get(hash)!.blob as T;
  }
  function releaseEntry(e: UndoEntry) {
    if (e.kind !== "board") return;
    poolRelease(e.prevRef);
    poolRelease(e.nextRef);
    poolRelease(e.prevMarksRef);
    poolRelease(e.nextMarksRef);
  }

  function clearUndo() {
    undoStack.value = [];
    undoIndex.value = 0;
    pool.clear(); // a full reset GCs the whole pool
  }

  /** Push one entry: fork-truncate the redo tail (releasing its refs), append, FIFO-evict at
   *  the cap (releasing the evicted refs). One shape for every kind. */
  function pushEntry(entry: UndoEntry) {
    if (undoIndex.value < undoStack.value.length) {
      const dropped = undoStack.value.splice(undoIndex.value);
      dropped.forEach(releaseEntry);
    }
    undoStack.value.push(entry);
    if (undoStack.value.length > UNDO_CAP) {
      const evicted = undoStack.value.shift();
      if (evicted) releaseEntry(evicted);
    }
    undoIndex.value = undoStack.value.length;
  }

  // ── Recorders (the single-writer seam) ───────────────────────────────
  /** A cell write/erase (`prev===next` no-ops — the immunity primitive). */
  function recordEdit(pos: number, prev: number, next: number) {
    if (prev === next) return;
    pushEntry({ kind: "value", pos, prev, next });
  }
  /** Hint ink — a value entry tagged `solved` (T4-WU: a reveal IS a user action). */
  function recordHintInk(pos: number, prev: number, next: number) {
    if (prev === next) return;
    pushEntry({ kind: "value", pos, prev, next, tone: "solved" });
  }
  /** A Fill sweep (T4-WU triggered conditional — W8's Fill drives W7's `fillAllForced`): ONE
   *  entry = ONE gesture = ONE undo/redo over every forced placement. No-op deltas
   *  (`prev===next`) drop; a zero-placement sweep (the Δ0 stop) records NOTHING — no empty
   *  entry. Delta-only: the deltas are self-contained, so no pool ref (unlike a `board` entry). */
  function recordBatch(deltas: BatchDelta[]) {
    const real = deltas.filter((d) => d.prev !== d.next);
    if (real.length === 0) return;
    pushEntry({ kind: "batch", deltas: real });
  }
  /** A user pencil-mark gesture — one or both slots (`corner`/`center`). */
  function recordMark(pos: number, delta: { corner?: SlotDelta; center?: SlotDelta }) {
    if (!delta.corner && !delta.center) return;
    pushEntry({ kind: "mark", pos, ...delta });
  }
  /** A whole-board swap — the blobs pool by content hash (identical boards share a slot). */
  function recordBoard(
    prevBlob: B,
    nextBlob: B,
    prevMarks: M,
    nextMarks: M,
    op: BoardOp,
  ) {
    pushEntry({
      kind: "board",
      prevRef: poolRetain(prevBlob),
      nextRef: poolRetain(nextBlob),
      prevMarksRef: poolRetain(prevMarks),
      nextMarksRef: poolRetain(nextMarks),
      op,
    });
  }

  // ── The replay dispatcher ────────────────────────────────────────────
  function replayUndo(e: UndoEntry) {
    switch (e.kind) {
      case "value":
        if (e.tone === "solved") effects.removeHintInk(e.pos, e.prev);
        else effects.applyValue(e.pos, e.prev);
        break;
      case "batch":
        // Invert every delta in ONE step, inverse order (last placed → first undone).
        for (let i = e.deltas.length - 1; i >= 0; i--) {
          const d = e.deltas[i];
          if (d.tone === "solved") effects.removeHintInk(d.pos, d.prev);
          else effects.applyValue(d.pos, d.prev);
        }
        break;
      case "mark":
        if (e.corner) effects.applyMark("corner", e.pos, e.corner.prev);
        if (e.center) effects.applyMark("center", e.pos, e.center.prev);
        break;
      case "board":
        effects.restoreBoard(poolGet<B>(e.prevRef), poolGet<M>(e.prevMarksRef));
        break;
    }
  }
  function replayRedo(e: UndoEntry) {
    switch (e.kind) {
      case "value":
        if (e.tone === "solved") effects.applyHintInk(e.pos, e.next);
        else effects.applyValue(e.pos, e.next);
        break;
      case "batch":
        // Re-apply every delta in ONE step, forward order.
        for (const d of e.deltas) {
          if (d.tone === "solved") effects.applyHintInk(d.pos, d.next);
          else effects.applyValue(d.pos, d.next);
        }
        break;
      case "mark":
        if (e.corner) effects.applyMark("corner", e.pos, e.corner.next);
        if (e.center) effects.applyMark("center", e.pos, e.center.next);
        break;
      case "board":
        effects.restoreBoard(poolGet<B>(e.nextRef), poolGet<M>(e.nextMarksRef));
        break;
    }
  }

  function undo() {
    if (effects.pending()) return; // refuse-while-pending (the race gate)
    if (undoIndex.value === 0) return;
    undoIndex.value--;
    replayUndo(undoStack.value[undoIndex.value]);
  }
  function redo() {
    if (effects.pending()) return;
    if (undoIndex.value >= undoStack.value.length) return;
    const e = undoStack.value[undoIndex.value];
    undoIndex.value++;
    replayRedo(e);
  }

  return {
    clearUndo,
    recordEdit,
    recordHintInk,
    recordBatch,
    recordMark,
    recordBoard,
    undo,
    redo,
    canUndo: computed(() => undoIndex.value > 0),
    canRedo: computed(() => undoIndex.value < undoStack.value.length),
    /** Depth of the undo portion — the honest signal an `isDirty` gate reads (E9 r2 §6). */
    undoDepth: computed(() => undoIndex.value),
    /** Test/measurement handles — the pool's live blob count + total entry count. */
    _poolSize: () => pool.size,
    _historyLength: () => undoStack.value.length,
  };
}
