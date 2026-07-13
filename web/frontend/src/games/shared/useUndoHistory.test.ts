import { describe, it, expect, vi } from "vitest";
import { useUndoHistory } from "./useUndoHistory";

// FE-unit layer (T4-W2): the bounded undo/redo stack (UNDO_CAP = 128). Only the four
// closures are exported, so the internal `{pos,prev,next}` history is exercised through
// its observable effect — which `(pos, value)` the writer is asked to apply. Covers cap
// overflow (shift), the fresh-fork redo-tail drop, pointer bounds, the prev===next no-op,
// and given-cell immunity (undo/redo only ever writes a recorded position).

function harness() {
  const board: Record<number, number> = {};
  const apply = vi.fn((pos: number, value: number) => {
    board[pos] = value;
  });
  return { board, apply, ...useUndoHistory(apply) };
}

/** The last `(pos, value)` the writer was asked to apply. */
const lastCall = (apply: { mock: { calls: number[][] } }) =>
  apply.mock.calls[apply.mock.calls.length - 1];

describe("record → undo → redo", () => {
  it("undo restores prev, redo restores next", () => {
    const { apply, recordEdit, undo, redo } = harness();
    recordEdit(5, 0, 3); // user wrote 0 → 3 at cell 5
    undo();
    expect(lastCall(apply)).toEqual([5, 0]);
    redo();
    expect(lastCall(apply)).toEqual([5, 3]);
  });

  it("a no-op write (prev === next) records nothing — the immunity primitive", () => {
    const { apply, recordEdit, undo } = harness();
    recordEdit(5, 4, 4); // re-entering a cell's own value never enters history
    undo();
    expect(apply).not.toHaveBeenCalled();
  });
});

describe("pointer bounds", () => {
  it("undo at the start and redo at the end are no-ops", () => {
    const { apply, recordEdit, undo, redo } = harness();
    undo(); // empty history
    redo();
    expect(apply).not.toHaveBeenCalled();

    recordEdit(1, 0, 2);
    undo(); // index → 0, applies (1,0)
    apply.mockClear();
    undo(); // already at 0 → no-op
    expect(apply).not.toHaveBeenCalled();

    redo(); // index → 1, applies (1,2)
    apply.mockClear();
    redo(); // already at end → no-op
    expect(apply).not.toHaveBeenCalled();
  });
});

describe("fresh-fork redo-tail drop", () => {
  it("a new edit after an undo splices off the stale redo branch", () => {
    const { apply, recordEdit, undo, redo } = harness();
    recordEdit(0, 0, 5);
    recordEdit(0, 5, 7);
    undo(); // → (0,5)
    undo(); // → (0,0)
    redo(); // → (0,5), index back at 1
    recordEdit(0, 5, 9); // fork: drops {0,5,7}, pushes {0,5,9}

    apply.mockClear();
    redo(); // index === length → no-op (the old 7 branch is gone)
    expect(apply).not.toHaveBeenCalled();

    undo(); // walks the NEW branch: (0,5)
    expect(lastCall(apply)).toEqual([0, 5]);
    undo(); // (0,0)
    expect(lastCall(apply)).toEqual([0, 0]);
    // 7 was never reachable again after the fork.
    expect(apply.mock.calls.some(([, v]) => v === 7)).toBe(false);
  });
});

describe("cap overflow (UNDO_CAP = 128) shifts the oldest out", () => {
  it("holds at most 128 edits; the two oldest become unreachable", () => {
    const { apply, recordEdit, undo } = harness();
    // 130 distinct edits on one cell → the first two (values 0→1, 1→2) shift out.
    for (let i = 0; i < 130; i++) recordEdit(0, i, i + 1);

    apply.mockClear();
    for (let i = 0; i < 130; i++) undo();
    // Exactly 128 undos land (the cap), the rest are no-ops at the pointer floor.
    expect(apply).toHaveBeenCalledTimes(128);
    // The oldest SURVIVING record is {0, prev: 2, next: 3}; its prev is 2, not 0 —
    // proof the two overflow records were dropped, not merely hidden.
    expect(lastCall(apply)).toEqual([0, 2]);
  });
});

describe("given-cell immunity is structural", () => {
  it("undo/redo only ever writes a position that was recorded", () => {
    const { apply, recordEdit, undo, redo } = harness();
    // Cell 0 is a "given": setCell never records it. Only cell 5 is ever an edit target.
    recordEdit(5, 0, 3);
    undo();
    redo();
    undo();
    expect(apply.mock.calls.every(([pos]) => pos === 5)).toBe(true);
  });
});

describe("clearUndo", () => {
  it("empties the stack so a subsequent undo is a no-op", () => {
    const { apply, recordEdit, clearUndo, undo } = harness();
    recordEdit(2, 0, 8);
    recordEdit(2, 8, 1);
    clearUndo();
    apply.mockClear();
    undo();
    undo();
    expect(apply).not.toHaveBeenCalled();
  });
});
