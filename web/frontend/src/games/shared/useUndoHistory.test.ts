import { describe, it, expect, vi } from "vitest";
import { useUndoHistory, type BatchDelta } from "./useUndoHistory";

// FE-unit layer (T4-WU / E9): the history spine — one tagged inverse-delta log over a
// content-hash-deduped board pool. The dispatcher is exercised through the effect it invokes
// (which primitive, which argument), so the collision/restore-order behaviour is observable
// without a live composable. Covers: the value delta (W6 carried forward), hint-ink tone,
// mark deltas (one and both slots), whole-board pointer swaps, pool dedup + refcount + FIFO
// GC, redo-tail truncation, the 200 cap, and the refuse-while-pending race gate.

interface Board {
  tag: string;
  values: Record<string, number>;
}
interface Marks {
  corner: Record<string, number[]>;
  center: Record<string, number[]>;
}
const emptyMarks = (): Marks => ({ corner: {}, center: {} });
const board = (tag: string, values: Record<string, number> = {}): Board => ({
  tag,
  values,
});

/**
 * T6 mark 13 — THE HARNESS NOW HOLDS A BOARD, and it has to. The no-clobber guard reads the
 * cell's CURRENT digit, so a harness whose effects wrote nowhere would report every cell as 0
 * and skip every undo. The live machine writes and THEN records (`setCell` → `applyCellValue`
 * → `recordEdit`), so the recorders below are wrapped to do the same: `cells` is the board,
 * the effects mutate it exactly as the composable's do, and a spec that wants the guard to
 * FIRE writes over a cell through `peerWrites` — which is what a teammate's op does.
 */
function harness(pendingInitial = false) {
  let paused = pendingInitial;
  const cells: Record<number, number> = {};
  const effects = {
    applyValue: vi.fn((pos: number, value: number) => {
      cells[pos] = value;
    }),
    applyHintInk: vi.fn((pos: number, value: number) => {
      cells[pos] = value;
    }),
    removeHintInk: vi.fn((pos: number, prev: number) => {
      cells[pos] = prev;
    }),
    applyMark:
      vi.fn<(slot: "corner" | "center", pos: number, list: number[]) => void>(),
    restoreBoard: vi.fn((b: Board, _m: Marks) => {
      Object.assign(cells, b.values);
    }),
    pending: () => paused,
    readValue: (pos: number) => cells[pos] ?? 0,
    onEntry: vi.fn<(entry: unknown) => void>(),
  };
  const h = useUndoHistory<Board, Marks>(effects);
  return {
    effects,
    cells,
    /** a teammate's write — lands on the board WITHOUT entering this player's log. */
    peerWrites: (pos: number, value: number) => {
      cells[pos] = value;
    },
    pause: (v: boolean) => {
      paused = v;
    },
    ...h,
    recordEdit: (pos: number, prev: number, next: number) => {
      cells[pos] = next;
      h.recordEdit(pos, prev, next);
    },
    recordHintInk: (pos: number, prev: number, next: number) => {
      cells[pos] = next;
      h.recordHintInk(pos, prev, next);
    },
    recordBatch: (deltas: BatchDelta[]) => {
      for (const d of deltas) cells[d.pos] = d.next;
      h.recordBatch(deltas);
    },
  };
}

const lastCall = <T extends unknown[]>(fn: { mock: { calls: T[] } }): T =>
  fn.mock.calls[fn.mock.calls.length - 1];

describe("value delta — record → undo → redo (the W6 spine, carried forward)", () => {
  it("undo restores prev, redo restores next", () => {
    const { effects, recordEdit, undo, redo } = harness();
    recordEdit(5, 0, 3);
    undo();
    expect(lastCall(effects.applyValue)).toEqual([5, 0]);
    redo();
    expect(lastCall(effects.applyValue)).toEqual([5, 3]);
  });

  it("a no-op write (prev === next) records nothing", () => {
    const { effects, recordEdit, undo } = harness();
    recordEdit(5, 4, 4);
    undo();
    expect(effects.applyValue).not.toHaveBeenCalled();
  });

  it("undo at the start and redo at the end are no-ops", () => {
    const { effects, recordEdit, undo, redo } = harness();
    undo();
    redo();
    expect(effects.applyValue).not.toHaveBeenCalled();
    recordEdit(1, 0, 2);
    undo();
    effects.applyValue.mockClear();
    undo();
    expect(effects.applyValue).not.toHaveBeenCalled();
    redo();
    effects.applyValue.mockClear();
    redo();
    expect(effects.applyValue).not.toHaveBeenCalled();
  });
});

describe("hint ink — a value entry tagged 'solved' (T4-WU: a reveal IS a user action)", () => {
  it("undo strips the solver tone (removeHintInk), never a plain value write", () => {
    const { effects, recordHintInk, undo, redo } = harness();
    recordHintInk(7, 0, 4); // a hint inked digit 4 into an empty cell
    undo();
    expect(lastCall(effects.removeHintInk)).toEqual([7, 0]);
    expect(effects.applyValue).not.toHaveBeenCalled();
    redo();
    expect(lastCall(effects.applyHintInk)).toEqual([7, 4]);
    expect(effects.applyValue).not.toHaveBeenCalled();
  });
});

describe("mark delta — the W8 user notes enter history (born RED: toggle bypassed it)", () => {
  it("a single-slot toggle round-trips through applyMark", () => {
    const { effects, recordMark, undo, redo } = harness();
    recordMark(3, { corner: { prev: [], next: [5] } });
    undo();
    expect(lastCall(effects.applyMark)).toEqual(["corner", 3, []]);
    redo();
    expect(lastCall(effects.applyMark)).toEqual(["corner", 3, [5]]);
  });

  it("an erase (both slots) is ONE entry — one gesture, one undo restores both slots", () => {
    const { effects, recordMark, undo, redo } = harness();
    recordMark(3, {
      corner: { prev: [1, 2], next: [] },
      center: { prev: [9], next: [] },
    });
    undo();
    // Both slots restored on the single undo.
    expect(effects.applyMark).toHaveBeenCalledWith("corner", 3, [1, 2]);
    expect(effects.applyMark).toHaveBeenCalledWith("center", 3, [9]);
    effects.applyMark.mockClear();
    redo();
    expect(effects.applyMark).toHaveBeenCalledWith("corner", 3, []);
    expect(effects.applyMark).toHaveBeenCalledWith("center", 3, []);
  });
});

describe("batch entry — the triggered conditional (born RED: the W8 Fill sweep was off-log)", () => {
  it("undo inverts every delta in ONE step (inverse order); redo re-applies in ONE step", () => {
    const { effects, recordBatch, undo, redo } = harness();
    // One Fill press forced three solver-tone cells — one gesture, one entry.
    recordBatch([
      { pos: 1, prev: 0, next: 5, tone: "solved" },
      { pos: 2, prev: 0, next: 7, tone: "solved" },
      { pos: 3, prev: 0, next: 9, tone: "solved" },
    ]);
    undo();
    // Every cell stripped of solver tone in a SINGLE undo, inverse order (last placed first
    // undone) — never a plain value write (the tone rides each delta).
    expect(effects.removeHintInk.mock.calls).toEqual([
      [3, 0],
      [2, 0],
      [1, 0],
    ]);
    expect(effects.applyValue).not.toHaveBeenCalled();
    effects.applyHintInk.mockClear();
    redo();
    // Re-inked in the solver's tone, forward order, all in a SINGLE redo.
    expect(effects.applyHintInk.mock.calls).toEqual([
      [1, 5],
      [2, 7],
      [3, 9],
    ]);
    expect(effects.applyValue).not.toHaveBeenCalled();
  });

  it("a plain-tone batch round-trips through applyValue (tone is per-delta)", () => {
    const { effects, recordBatch, undo, redo } = harness();
    recordBatch([
      { pos: 0, prev: 2, next: 8 },
      { pos: 4, prev: 0, next: 3 },
    ]);
    undo();
    expect(effects.applyValue.mock.calls).toEqual([
      [4, 0],
      [0, 2],
    ]);
    expect(effects.removeHintInk).not.toHaveBeenCalled();
    effects.applyValue.mockClear();
    redo();
    expect(effects.applyValue.mock.calls).toEqual([
      [0, 8],
      [4, 3],
    ]);
  });

  it("a zero-placement sweep (Δ0 stop) records NOTHING — no empty entry", () => {
    const { effects, recordBatch, undo, _historyLength } = harness();
    recordBatch([]); // the Fill forced nothing
    expect(_historyLength()).toBe(0);
    // an all-no-op batch (every prev===next) collapses to nothing too
    recordBatch([{ pos: 1, prev: 4, next: 4 }]);
    expect(_historyLength()).toBe(0);
    undo();
    expect(effects.applyValue).not.toHaveBeenCalled();
    expect(effects.removeHintInk).not.toHaveBeenCalled();
  });

  it("one sweep counts as ONE entry toward the 200 cap (nine placements, one slot)", () => {
    const { recordBatch, recordEdit, _historyLength } = harness();
    recordBatch(
      Array.from({ length: 9 }, (_, i) => ({
        pos: i,
        prev: 0,
        next: i + 1,
        tone: "solved" as const,
      })),
    );
    expect(_historyLength()).toBe(1); // nine cells, ONE entry
    for (let i = 0; i < 199; i++) recordEdit(0, i, i + 1); // → 200 total; the batch is entry 1
    expect(_historyLength()).toBe(200);
    recordEdit(0, 199, 200); // entry 201 evicts the batch FIFO — still 200, never 208
    expect(_historyLength()).toBe(200);
  });
});

describe("board swap — a pointer entry into the pool (born RED: deals wiped history)", () => {
  it("undo restores prev board + prev marks; redo restores next board + next marks", () => {
    const { effects, recordBoard, undo, redo } = harness();
    const prevB = board("prev", { "0": 1 });
    const nextB = board("next", { "0": 9 });
    const prevM: Marks = { corner: { "0": [2, 3] }, center: {} };
    const nextM = emptyMarks();
    recordBoard(prevB, nextB, prevM, nextM, "deal");

    undo();
    expect(lastCall(effects.restoreBoard)).toEqual([prevB, prevM]);
    redo();
    expect(lastCall(effects.restoreBoard)).toEqual([nextB, nextM]);
  });
});

describe("the DELTA probe — deal → edits → deal → undo restores the prior board WITH its marks", () => {
  it("a single undo of the second deal restores board1 (+ its edits + marks); redo returns board2", () => {
    const { effects, recordMark, recordEdit, recordBoard, undo, redo } = harness();
    // board1 is dealt; the player edits a value and pencils a mark on it, then deals board2.
    // The second deal's `prevBlob` is board1-with-the-edit; its `prevMarks` the pencilled note.
    recordEdit(10, 0, 4); // an edit on board1
    recordMark(10, { center: { prev: [], next: [4] } }); // a note on board1
    const board1WithEdit = board("board1", { "10": 4 });
    const board1Marks: Marks = { corner: {}, center: { "10": [4] } };
    const board2 = board("board2", { "0": 9 });
    recordBoard(board1WithEdit, board2, board1Marks, emptyMarks(), "deal");

    // ONE undo of the deal restores board1 + its marks in a single gesture — the edits/notes
    // below it stay in the undo portion (they annotate the restored board1).
    undo();
    expect(lastCall(effects.restoreBoard)).toEqual([board1WithEdit, board1Marks]);
    // Redo returns the SAME board2, marks voided (a fresh deal carries no notes forward).
    redo();
    expect(lastCall(effects.restoreBoard)).toEqual([board2, emptyMarks()]);
  });
});

describe("the content-hash pool — dedup, refcount, FIFO GC", () => {
  it("the SAME board content occupies ONE pool slot (two distinct objects, one blob)", () => {
    const { recordBoard, _poolSize } = harness();
    // Identical CONTENT, different object identities → one hash → one slot.
    const a1 = board("A", { "0": 1 });
    const a2 = board("A", { "0": 1 });
    recordBoard(a1, a2, emptyMarks(), emptyMarks(), "deal");
    // one board hash + one (empty) marks hash = 2 slots
    expect(_poolSize()).toBe(2);
    // A second entry over the same content adds NO slots (refcount up, no new blob).
    recordBoard(board("A", { "0": 1 }), a1, emptyMarks(), emptyMarks(), "clear");
    expect(_poolSize()).toBe(2);
  });

  it("a shared blob survives eviction of ONE referrer; a unique blob GCs when its last ref drops", () => {
    const { recordBoard, undo, recordEdit, _poolSize } = harness();
    const a = board("A", { "0": 1 });
    const b = board("B", { "0": 2 });
    const c = board("C", { "0": 3 });
    // Entry 1 references A(prev) + B(next). Entry 2 references B(prev) + C(next). B is shared.
    recordBoard(a, b, emptyMarks(), emptyMarks(), "deal"); // refs: A=1,B=1,empty=2
    recordBoard(b, c, emptyMarks(), emptyMarks(), "clear"); // refs: A=1,B=2,C=1,empty=4
    expect(_poolSize()).toBe(4); // A, B, C, empty
    // Fork-truncate entry 2: undo past it, then a fresh value edit drops the redo tail.
    undo();
    recordEdit(0, 0, 1); // releases B(2→1: survives, shared) and C(1→0: GC'd)
    expect(_poolSize()).toBe(3); // A, B, empty remain; C is gone
  });

  it("FIFO eviction at the cap GCs the evicted board's now-unreferenced blob", () => {
    const { recordBoard, _poolSize, _historyLength } = harness();
    // 201 board entries, each a DISTINCT board (distinct marks empty-shared). Entry 201 evicts
    // entry 1 (FIFO) → entry 1's unique board blob GCs; the shared empty-marks blob stays.
    for (let i = 0; i < 201; i++) {
      recordBoard(
        board(`b${i}`, { "0": i }),
        board(`n${i}`, { "0": i + 1000 }),
        emptyMarks(),
        emptyMarks(),
        "deal",
      );
    }
    expect(_historyLength()).toBe(200); // the cap holds
    // 200 entries × 2 distinct board blobs = 400, + 1 shared empty-marks blob = 401.
    expect(_poolSize()).toBe(401);
  });
});

describe("cap = 200 (born RED: UNDO_CAP was 128) — FIFO shift of the oldest", () => {
  it("holds at most 200 value edits; entry 201 evicts entry 1", () => {
    const { effects, recordEdit, undo, _historyLength } = harness();
    for (let i = 0; i < 202; i++) recordEdit(0, i, i + 1); // 202 edits → 2 shift out
    expect(_historyLength()).toBe(200);
    effects.applyValue.mockClear();
    for (let i = 0; i < 202; i++) undo();
    expect(effects.applyValue).toHaveBeenCalledTimes(200); // exactly the cap lands
    // Oldest SURVIVING record wrote 2→3, so its prev is 2 (not 0) — the two overflow deltas
    // were dropped, not hidden.
    expect(lastCall(effects.applyValue)).toEqual([0, 2]);
  });
});

describe("fresh-fork redo-tail drop (uniform across kinds)", () => {
  it("a new edit after an undo splices off the stale redo branch", () => {
    const { effects, recordEdit, undo, redo } = harness();
    recordEdit(0, 0, 5);
    recordEdit(0, 5, 7);
    undo();
    undo();
    redo();
    recordEdit(0, 5, 9); // fork: drops {0,5,7}
    effects.applyValue.mockClear();
    redo();
    expect(effects.applyValue).not.toHaveBeenCalled(); // the 7 branch is gone
    undo();
    expect(lastCall(effects.applyValue)).toEqual([0, 5]);
    expect(effects.applyValue.mock.calls.some(([, v]) => v === 7)).toBe(false);
  });
});

describe("refuse-while-pending — the race gate (born RED: keyboard Z was ungated)", () => {
  it("undo and redo no-op while a board op is in flight", () => {
    const { effects, recordEdit, undo, redo, pause } = harness();
    recordEdit(5, 0, 3);
    pause(true); // a generate/solve is now pending
    undo();
    redo();
    expect(effects.applyValue).not.toHaveBeenCalled(); // both refused
    pause(false);
    undo();
    expect(lastCall(effects.applyValue)).toEqual([5, 0]); // works once the op resolves
  });
});

describe("clearUndo — full reset also GCs the pool", () => {
  it("empties the stack, the pool, and the pointer", () => {
    const { recordBoard, clearUndo, undo, effects, _poolSize, _historyLength } =
      harness();
    recordBoard(board("a"), board("b"), emptyMarks(), emptyMarks(), "deal");
    clearUndo();
    expect(_historyLength()).toBe(0);
    expect(_poolSize()).toBe(0); // the whole pool GC'd
    undo();
    expect(effects.restoreBoard).not.toHaveBeenCalled();
  });
});

describe("canUndo / canRedo / undoDepth — the signals a dirty gate reads", () => {
  it("track the pointer", () => {
    const { recordEdit, undo, canUndo, canRedo, undoDepth } = harness();
    expect(canUndo.value).toBe(false);
    expect(canRedo.value).toBe(false);
    recordEdit(0, 0, 1);
    expect(canUndo.value).toBe(true);
    expect(undoDepth.value).toBe(1);
    undo();
    expect(canUndo.value).toBe(false);
    expect(canRedo.value).toBe(true);
    expect(undoDepth.value).toBe(0);
  });
});

// ── T6 mark 13 — the log as the PER-PLAYER ledger ────────────────────────────────

describe("onEntry — the one seam the local op stream leaves by", () => {
  it("fires after every push, with the entry, and never for a peer's write", () => {
    const { effects, recordEdit, recordBatch, recordMark, peerWrites } = harness();
    recordEdit(5, 0, 3);
    recordBatch([{ pos: 7, prev: 0, next: 4, tone: "solved" }]);
    recordMark(9, { corner: { prev: [], next: [1] } });
    peerWrites(11, 8); // a teammate's digit — on the board, off this player's log
    expect(
      effects.onEntry.mock.calls.map(([e]) => (e as { kind: string }).kind),
    ).toEqual(["value", "batch", "mark"]);
  });

  it("a no-op write fires nothing — the immunity primitive holds at the new seam too", () => {
    const { effects, recordEdit, recordBatch } = harness();
    recordEdit(5, 4, 4);
    recordBatch([{ pos: 7, prev: 2, next: 2 }]);
    expect(effects.onEntry).not.toHaveBeenCalled();
  });
});

describe("the no-clobber guard (BORN RED — the one silently-wrong-able spot)", () => {
  it("skips and CONSUMES an undo whose cell a peer has overwritten", () => {
    const { effects, cells, recordEdit, undo, canUndo, canRedo, peerWrites } =
      harness();
    recordEdit(5, 0, 3); // I wrote 3 over an empty cell
    peerWrites(5, 8); // a teammate wrote 8 over my 3 — the cell is theirs now
    undo();
    // Born RED here: without the guard this called `applyValue(5, 0)` and DELETED the 8,
    // then propagated the deletion as this player's authoritative write.
    expect(effects.applyValue).not.toHaveBeenCalled();
    expect(cells[5]).toBe(8); // their digit stands
    // Consumed, not refused: the undo is spent, so the pointer moved.
    expect(canUndo.value).toBe(false);
    expect(canRedo.value).toBe(true);
  });

  it("undoes the deltas of a batch a peer half-overwrote, and only those", () => {
    const { effects, cells, recordBatch, undo, peerWrites } = harness();
    recordBatch([
      { pos: 1, prev: 0, next: 4, tone: "solved" },
      { pos: 2, prev: 0, next: 6, tone: "solved" },
    ]);
    peerWrites(2, 9);
    undo();
    expect(effects.removeHintInk.mock.calls).toEqual([[1, 0]]); // 2 skipped, 1 undone
    expect(cells).toMatchObject({ 1: 0, 2: 9 });
  });

  it("solo is bit-identical: nothing else writes, so the guard never fires", () => {
    const { effects, recordEdit, undo, redo } = harness();
    recordEdit(5, 0, 3);
    recordEdit(5, 3, 7);
    undo();
    undo();
    redo();
    expect(effects.applyValue.mock.calls).toEqual([
      [5, 3],
      [5, 0],
      [5, 3],
    ]);
  });

  it("the cap still evicts at 200 under mixed local + peer traffic", () => {
    const { recordEdit, peerWrites, _historyLength, undoDepth } = harness();
    for (let i = 0; i < 250; i++) {
      recordEdit(i, 0, 1);
      peerWrites(1000 + i, 5); // peer traffic is not log traffic
    }
    expect(_historyLength()).toBe(200);
    expect(undoDepth.value).toBe(200);
  });
});
