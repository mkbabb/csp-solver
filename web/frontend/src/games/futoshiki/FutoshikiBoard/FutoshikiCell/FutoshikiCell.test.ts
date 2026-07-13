import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import FutoshikiCell from "./FutoshikiCell.vue";

// FE-unit layer (T4-WM §1) — the native-bounded-entry contract, futoshiki twin of
// SudokuCell's (D16). Futoshiki boards are 4..7 (always single-digit), so the width bound is
// a static maxlength=1; the attribute set + the @input/@keydown write path are otherwise
// identical to sudoku's. The 16px zoom-de-risk is a computed-style claim → the mobile e2e.

/** The most-recent `update` emission (avoids Array.prototype.at — the app lib targets < es2022). */
function lastUpdate(wrapper: ReturnType<typeof mountCell>): unknown[] | undefined {
  const evs = wrapper.emitted("update");
  return evs ? evs[evs.length - 1] : undefined;
}

function mountCell(overrides: Record<string, unknown> = {}) {
  return mount(FutoshikiCell, {
    props: {
      position: 0,
      value: 0,
      isGiven: false,
      isOverridden: false,
      isSolved: false,
      isRevealed: false,
      noiseDelay: 0,
      boardSize: 5,
      ghostPath: "",
      rowIndex: 1,
      colIndex: 1,
      tabIndex: 0,
      isInvalid: false,
      constraintLabel: "",
      ...overrides,
    },
  });
}

describe("FutoshikiCell — native bounded entry contract (T4-WM §1)", () => {
  it("carries the iOS-congruent numeric-entry attribute set", () => {
    const input = mountCell().get("input");
    const a = input.attributes();
    expect(a.type).toBe("text");
    expect(a.inputmode).toBe("numeric");
    expect(a.pattern).toBe("[0-9]*");
    expect(a.autocorrect).toBe("off");
    expect(a.autocapitalize).toBe("off");
    expect(a.spellcheck).toBe("false");
    expect(a.enterkeyhint).toBe("done");
  });

  it("inputmode is a static 'numeric' — the OS-keyboard-suppression path is gone", () => {
    expect(mountCell().get("input").attributes("inputmode")).toBe("numeric");
  });

  // Futoshiki boards are 4..7 (single-digit), so maxlength is 2 — the digit width (1) plus the
  // one-char in-place override affordance handleInput slices back down (D16 twin of sudoku's).
  it("maxlength admits the digit width + 1 override char (2)", () => {
    expect(mountCell({ boardSize: 7 }).get("input").attributes("maxlength")).toBe("2");
  });

  it("the native @input write path is preserved (typing emits the clamped value)", async () => {
    const wrapper = mountCell({ boardSize: 5 });
    const input = wrapper.get("input");
    (input.element as HTMLInputElement).value = "3";
    await input.trigger("input");
    expect(lastUpdate(wrapper)).toEqual([0, 3]);
  });

  it("handleInput clamps to a single digit — an append on a filled cell overrides in place", async () => {
    const wrapper = mountCell({ boardSize: 5, value: 4 });
    const input = wrapper.get("input");
    (input.element as HTMLInputElement).value = "42";
    await input.trigger("input");
    expect(lastUpdate(wrapper)).toEqual([0, 2]);
  });

  it("Backspace erases through the same emit path", async () => {
    const wrapper = mountCell({ boardSize: 5, value: 4 });
    const input = wrapper.get("input");
    await input.trigger("keydown", { key: "Backspace" });
    expect(lastUpdate(wrapper)).toEqual([0, 0]);
  });
});

// The long-press candidate peek (T4-WM §3, lane E) — twin of SudokuCell's. Same gesture machine
// (useLongPress), same cell wiring: a hold on an EMPTY cell emits candidatePeekStart→End, a filled
// cell never arms, a short tap or slop-move never peeks, and the tap that ends a hold is swallowed
// (no focus) while a plain tap still focuses.
describe("FutoshikiCell — long-press candidate peek (T4-WM §3)", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  // Dispatch a MouseEvent (PointerEvent's base) so the coordinates set at construction — @vue/
  // test-utils' `trigger` can't assign the read-only clientX/clientY afterward (twin of the sudoku
  // cell spec).
  function fire(el: Element, type: string, x = 0, y = 0) {
    el.dispatchEvent(new MouseEvent(type, { clientX: x, clientY: y, bubbles: true }));
  }

  it("a hold on an empty cell opens the candidate peek; release closes it", () => {
    const w = mountCell({ value: 0 });
    const cell = w.get(".futoshiki-cell").element;
    fire(cell, "pointerdown", 5, 5);
    expect(w.emitted("candidatePeekStart")).toBeUndefined();
    vi.advanceTimersByTime(450);
    expect(w.emitted("candidatePeekStart")).toHaveLength(1);
    fire(cell, "pointerup", 5, 5);
    expect(w.emitted("candidatePeekEnd")).toHaveLength(1);
  });

  it("a filled cell has no candidate glimpse — the hold never arms", () => {
    const w = mountCell({ value: 3 });
    fire(w.get(".futoshiki-cell").element, "pointerdown", 5, 5);
    vi.advanceTimersByTime(450);
    expect(w.emitted("candidatePeekStart")).toBeUndefined();
  });

  it("a short tap never opens the peek", () => {
    const w = mountCell({ value: 0 });
    const cell = w.get(".futoshiki-cell").element;
    fire(cell, "pointerdown", 5, 5);
    vi.advanceTimersByTime(200);
    fire(cell, "pointerup", 5, 5);
    vi.advanceTimersByTime(1000);
    expect(w.emitted("candidatePeekStart")).toBeUndefined();
  });

  it("moving past the slop cancels the pending peek", () => {
    const w = mountCell({ value: 0 });
    const cell = w.get(".futoshiki-cell").element;
    fire(cell, "pointerdown", 0, 0);
    fire(cell, "pointermove", 0, 40);
    vi.advanceTimersByTime(450);
    expect(w.emitted("candidatePeekStart")).toBeUndefined();
  });

  it("the click that ends a recognized hold is swallowed — the peek release never focuses", async () => {
    const w = mountCell({ value: 0 });
    const cell = w.get(".futoshiki-cell");
    const focusSpy = vi.spyOn(w.get("input").element as HTMLInputElement, "focus");
    fire(cell.element, "pointerdown", 5, 5);
    vi.advanceTimersByTime(450);
    fire(cell.element, "pointerup", 5, 5);
    await cell.trigger("click");
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it("a plain tap still focuses the cell (native entry preserved)", async () => {
    const w = mountCell({ value: 0 });
    const focusSpy = vi.spyOn(w.get("input").element as HTMLInputElement, "focus");
    await w.get(".futoshiki-cell").trigger("click");
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });
});

// User pencil marks (T4-W8 ROW 1) — twin of SudokuCell's. Pencil mode reinterprets the frozen
// native input; a digit authors a `mark`, Backspace erases the cell's notes, Normal mode keeps
// the value write byte-identical, and the two placement slots render in their own layers/classes
// (never the engine's `.pencil-marks`).
describe("FutoshikiCell — user pencil marks authoring (T4-W8 ROW 1)", () => {
  it("Normal mode still writes a value — the WM native-entry path is untouched", async () => {
    const w = mountCell({ boardSize: 5, pencilMode: "off" });
    const input = w.get("input");
    (input.element as HTMLInputElement).value = "3";
    await input.trigger("input");
    expect(lastUpdate(w)).toEqual([0, 3]);
    expect(w.emitted("mark")).toBeUndefined();
  });

  it("corner mode routes a digit to `mark`, never `update`", async () => {
    const w = mountCell({ boardSize: 5, pencilMode: "corner" });
    const input = w.get("input");
    (input.element as HTMLInputElement).value = "4";
    await input.trigger("input");
    expect(w.emitted("mark")?.[0]).toEqual([0, 4]);
    expect(w.emitted("update")).toBeUndefined();
    expect((input.element as HTMLInputElement).value).toBe("");
  });

  it("pencil-mode Backspace on an empty cell erases the notes via mark(pos, 0)", async () => {
    const w = mountCell({ boardSize: 5, pencilMode: "center", value: 0 });
    await w.get("input").trigger("keydown", { key: "Backspace" });
    expect(w.emitted("mark")?.[0]).toEqual([0, 0]);
    expect(w.emitted("update")).toBeUndefined();
  });

  it("pencil mode ignores a digit on a FILLED cell", async () => {
    const w = mountCell({ boardSize: 5, pencilMode: "corner", value: 4 });
    const input = w.get("input");
    (input.element as HTMLInputElement).value = "43";
    await input.trigger("input");
    expect(w.emitted("mark")).toBeUndefined();
    expect(w.emitted("update")).toBeUndefined();
  });
});

describe("FutoshikiCell — user marks render distinctly from the engine marks (T4-W8 ROW 1)", () => {
  it("corner + center notes render in their OWN layers, never the engine `.pencil-marks`", () => {
    const w = mountCell({ value: 0, cornerMarks: [1, 4], centerMarks: [2, 5] });
    expect(w.find(".user-corner-marks").exists()).toBe(true);
    expect(w.find(".user-center-marks").exists()).toBe(true);
    expect(w.find(".pencil-marks").exists()).toBe(false);
  });

  it("a filled cell hides its notes — the empty-cell gate the engine marks also use", () => {
    const w = mountCell({ value: 4, cornerMarks: [1, 2], centerMarks: [3] });
    expect(w.find(".user-corner-marks").exists()).toBe(false);
    expect(w.find(".user-center-marks").exists()).toBe(false);
  });
});

// Peer-unit wash (T4-W8 ROW 4, twin of SudokuCell's). The board derives the peer set over
// `focusedPos` (row + column only — futoshiki is a Latin square with no box) and hands each cell
// an `isPeer` flag; the cell lights a faint crayon-blue wash on its own `.cell-peer` layer.
describe("FutoshikiCell — peer-unit wash (T4-W8 ROW 4)", () => {
  it("renders the peer wash when isPeer, on its own `.cell-peer` layer", () => {
    expect(mountCell({ isPeer: true }).find(".cell-peer").exists()).toBe(true);
  });

  it("no wash when the cell is not in the focused unit", () => {
    expect(mountCell({ isPeer: false }).find(".cell-peer").exists()).toBe(false);
  });

  it("the wash covers the whole unit — a filled peer cell washes too, not just blanks", () => {
    expect(mountCell({ isPeer: true, value: 4 }).find(".cell-peer").exists()).toBe(
      true,
    );
  });
});
