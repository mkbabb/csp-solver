import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import SudokuCell from "./SudokuCell.vue";

// FE-unit layer (T4-WM §1, the pad abrogation): the native-bounded-entry DOM contract.
// With the custom keypad excised, the per-cell `<input>` is the sole entry surface on every
// pointer, so its shape is load-bearing: `type=text` + `inputmode=numeric` raises the iOS
// keypad, `maxlength` is the only declarative single-digit bound (ignored on type=number),
// the autocorrect/autocapitalize/spellcheck trio kill the software-keyboard meddling, and the
// input's own `@input`/`@keydown` write path stays byte-identical to the keyboard's (the
// excision touched the tray, never the handlers). The 16px zoom-de-risk is a COMPUTED-style
// claim (jsdom applies no stylesheet — this layer's standing caveat), so it stays in the
// mobile e2e; here we pin the attribute contract and the write path.

/** The most-recent `update` emission (avoids Array.prototype.at — the app lib targets < es2022). */
function lastUpdate(wrapper: ReturnType<typeof mountCell>): unknown[] | undefined {
  const evs = wrapper.emitted("update");
  return evs ? evs[evs.length - 1] : undefined;
}

function mountCell(overrides: Record<string, unknown> = {}) {
  return mount(SudokuCell, {
    props: {
      position: 0,
      value: 0,
      isGiven: false,
      isOverridden: false,
      isSolved: false,
      isRevealed: false,
      noiseDelay: 0,
      boardSize: 9,
      subgridSize: 3,
      ghostPath: "",
      rowIndex: 1,
      colIndex: 1,
      tabIndex: 0,
      isInvalid: false,
      ...overrides,
    },
  });
}

describe("SudokuCell — native bounded entry contract (T4-WM §1)", () => {
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

  it("inputmode is a static 'numeric' — no path that suppresses the OS keyboard survives", () => {
    // The abrogated pad flipped this to inputmode='none'; native entry keeps it numeric on
    // every pointer, hardware or touch. No prop can force it back to 'none'.
    expect(mountCell().get("input").attributes("inputmode")).toBe("numeric");
  });

  // maxlength is board-sized to the digit width PLUS ONE (2 for single-digit boards, 3 for
  // 16×16): the extra char is the in-place override affordance — the input takes one digit
  // beyond the display so a keystroke on a filled cell appends and `handleInput` slices to the
  // digit width. handleInput's clamp is the effective bound (spec §1: "the existing handleInput
  // clamp already owns semantics"); this is the ONLY override mechanism that survives the coming
  // `user-select:none` cell discipline (select-on-focus can't select) and Vue's reactive `:value`
  // patch (which re-fills a cleared input). See impl-a-entry.md.
  it("maxlength admits the digit width + 1 override char — 2 for single-digit boards", () => {
    expect(
      mountCell({ boardSize: 9, subgridSize: 3 }).get("input").attributes("maxlength"),
    ).toBe("2");
  });

  it("maxlength admits 3 for the two-glyph 16×16 board (two display digits + 1 override)", () => {
    expect(
      mountCell({ boardSize: 16, subgridSize: 4 }).get("input").attributes("maxlength"),
    ).toBe("3");
  });

  it("the native @input write path is preserved (typing emits the clamped value)", async () => {
    const wrapper = mountCell({ boardSize: 9 });
    const input = wrapper.get("input");
    (input.element as HTMLInputElement).value = "7";
    await input.trigger("input");
    expect(lastUpdate(wrapper)).toEqual([0, 7]);
  });

  it("handleInput clamps to the digit width — an append on a filled cell overrides in place", async () => {
    // The real bound: on a single-digit board the LAST digit wins (one-keystroke override),
    // so an append of '3' onto '9' commits 3, never 93.
    const wrapper = mountCell({ boardSize: 9, value: 9 });
    const input = wrapper.get("input");
    (input.element as HTMLInputElement).value = "93";
    await input.trigger("input");
    expect(lastUpdate(wrapper)).toEqual([0, 3]);
  });

  it("two-digit entry works at 16×16 (values 10–16 commit whole)", async () => {
    const wrapper = mountCell({ boardSize: 16, subgridSize: 4 });
    const input = wrapper.get("input");
    (input.element as HTMLInputElement).value = "12";
    await input.trigger("input");
    expect(lastUpdate(wrapper)).toEqual([0, 12]);
  });

  it("Backspace erases through the same emit path", async () => {
    const wrapper = mountCell({ boardSize: 9, value: 5 });
    const input = wrapper.get("input");
    await input.trigger("keydown", { key: "Backspace" });
    expect(lastUpdate(wrapper)).toEqual([0, 0]);
  });
});

// The long-press candidate peek (T4-WM §3, lane E). useLongPress owns the gesture machine (proven
// under fake timers in its own spec); here we pin the CELL wiring: a recognized hold on an EMPTY
// cell emits candidatePeekStart→End (the board forwards these to the game's marks activation), a
// filled cell has no glimpse to arm, a short tap or a slop-move never peeks, and the tap that ends
// a hold is swallowed so the peek release never focuses (no keyboard) — while a plain tap still
// focuses through the native-entry path.
describe("SudokuCell — long-press candidate peek (T4-WM §3)", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  // The pointer events carry coordinates for the slop maths; @vue/test-utils' `trigger` can't set
  // the read-only clientX/clientY post-construction, so dispatch a MouseEvent (PointerEvent's base,
  // which takes them in its init) directly at the cell element — the @pointer* listeners fire on
  // the type name regardless.
  function fire(el: Element, type: string, x = 0, y = 0) {
    el.dispatchEvent(new MouseEvent(type, { clientX: x, clientY: y, bubbles: true }));
  }

  it("a hold on an empty cell opens the candidate peek; release closes it", () => {
    const w = mountCell({ value: 0 });
    const cell = w.get(".sudoku-cell").element;
    fire(cell, "pointerdown", 5, 5);
    expect(w.emitted("candidatePeekStart")).toBeUndefined(); // not until the timer survives
    vi.advanceTimersByTime(450);
    expect(w.emitted("candidatePeekStart")).toHaveLength(1);
    fire(cell, "pointerup", 5, 5);
    expect(w.emitted("candidatePeekEnd")).toHaveLength(1);
  });

  it("a filled cell has no candidate glimpse — the hold never arms", () => {
    const w = mountCell({ value: 5 });
    fire(w.get(".sudoku-cell").element, "pointerdown", 5, 5);
    vi.advanceTimersByTime(450);
    expect(w.emitted("candidatePeekStart")).toBeUndefined();
  });

  it("a short tap never opens the peek", () => {
    const w = mountCell({ value: 0 });
    const cell = w.get(".sudoku-cell").element;
    fire(cell, "pointerdown", 5, 5);
    vi.advanceTimersByTime(200);
    fire(cell, "pointerup", 5, 5);
    vi.advanceTimersByTime(1000);
    expect(w.emitted("candidatePeekStart")).toBeUndefined();
  });

  it("moving past the slop cancels the pending peek (a scroll, not a hold)", () => {
    const w = mountCell({ value: 0 });
    const cell = w.get(".sudoku-cell").element;
    fire(cell, "pointerdown", 0, 0);
    fire(cell, "pointermove", 0, 40);
    vi.advanceTimersByTime(450);
    expect(w.emitted("candidatePeekStart")).toBeUndefined();
  });

  it("the click that ends a recognized hold is swallowed — the peek release never focuses", async () => {
    const w = mountCell({ value: 0 });
    const cell = w.get(".sudoku-cell");
    const focusSpy = vi.spyOn(w.get("input").element as HTMLInputElement, "focus");
    fire(cell.element, "pointerdown", 5, 5);
    vi.advanceTimersByTime(450);
    fire(cell.element, "pointerup", 5, 5);
    await cell.trigger("click");
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it("a plain tap still focuses the cell (the native-entry path is preserved)", async () => {
    const w = mountCell({ value: 0 });
    const focusSpy = vi.spyOn(w.get("input").element as HTMLInputElement, "focus");
    await w.get(".sudoku-cell").trigger("click");
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });
});
