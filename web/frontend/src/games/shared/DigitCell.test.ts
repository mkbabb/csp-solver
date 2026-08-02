import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import DigitCell from "./DigitCell.vue";

// FE-unit layer (T4-WM §1, the pad abrogation): the native-bounded-entry DOM contract, on THE
// cell. `SudokuCell` and `FutoshikiCell` ran this suite twice, 2.7% apart; one component means
// one suite, with the Latin family's own claims pinned at the foot rather than in a twin file.
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
  return mount(DigitCell, {
    props: {
      position: 0,
      value: 0,
      isGiven: false,
      isOverridden: false,
      isSolved: false,
      isRevealed: false,
      noiseDelay: 0,
      boardSize: 9,
      geometry: "boxed",
      ghostPath: "",
      rowIndex: 1,
      colIndex: 1,
      tabIndex: 0,
      isInvalid: false,
      ...overrides,
    },
  });
}

describe("DigitCell (boxed) — native bounded entry contract (T4-WM §1)", () => {
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
    expect(mountCell({ boardSize: 9 }).get("input").attributes("maxlength")).toBe("2");
  });

  it("maxlength admits 3 for the two-glyph 16×16 board (two display digits + 1 override)", () => {
    expect(mountCell({ boardSize: 16 }).get("input").attributes("maxlength")).toBe("3");
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
    const wrapper = mountCell({ boardSize: 16 });
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
describe("DigitCell (boxed) — long-press candidate peek (T4-WM §3)", () => {
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
    const cell = w.get(".game-cell").element;
    fire(cell, "pointerdown", 5, 5);
    expect(w.emitted("candidatePeekStart")).toBeUndefined(); // not until the timer survives
    vi.advanceTimersByTime(450);
    expect(w.emitted("candidatePeekStart")).toHaveLength(1);
    fire(cell, "pointerup", 5, 5);
    expect(w.emitted("candidatePeekEnd")).toHaveLength(1);
  });

  it("a filled cell has no candidate glimpse — the hold never arms", () => {
    const w = mountCell({ value: 5 });
    fire(w.get(".game-cell").element, "pointerdown", 5, 5);
    vi.advanceTimersByTime(450);
    expect(w.emitted("candidatePeekStart")).toBeUndefined();
  });

  it("a short tap never opens the peek", () => {
    const w = mountCell({ value: 0 });
    const cell = w.get(".game-cell").element;
    fire(cell, "pointerdown", 5, 5);
    vi.advanceTimersByTime(200);
    fire(cell, "pointerup", 5, 5);
    vi.advanceTimersByTime(1000);
    expect(w.emitted("candidatePeekStart")).toBeUndefined();
  });

  it("moving past the slop cancels the pending peek (a scroll, not a hold)", () => {
    const w = mountCell({ value: 0 });
    const cell = w.get(".game-cell").element;
    fire(cell, "pointerdown", 0, 0);
    fire(cell, "pointermove", 0, 40);
    vi.advanceTimersByTime(450);
    expect(w.emitted("candidatePeekStart")).toBeUndefined();
  });

  it("the click that ends a recognized hold is swallowed — the peek release never focuses", async () => {
    const w = mountCell({ value: 0 });
    const cell = w.get(".game-cell");
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
    await w.get(".game-cell").trigger("click");
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });
});

// User pencil marks (T4-W8 ROW 1). The FROZEN native input is reinterpreted by pencil mode (the
// WM seam — mode toggle only, no second input surface): while a slot is armed a digit authors a
// `mark` instead of an `update`, Backspace erases the cell's notes, and Normal mode keeps the
// value write byte-identical. The render pins the two placement slots in their OWN layers/classes
// (never the engine's `.pencil-marks`) — the two mark systems share the cell but never collide.
describe("DigitCell (boxed) — user pencil marks authoring (T4-W8 ROW 1)", () => {
  it("Normal mode still writes a value — the WM native-entry path is untouched", async () => {
    const w = mountCell({ boardSize: 9, pencilMode: "off" });
    const input = w.get("input");
    (input.element as HTMLInputElement).value = "5";
    await input.trigger("input");
    expect(lastUpdate(w)).toEqual([0, 5]);
    expect(w.emitted("mark")).toBeUndefined();
  });

  it("corner mode routes a digit to `mark`, never `update`", async () => {
    const w = mountCell({ boardSize: 9, pencilMode: "corner" });
    const input = w.get("input");
    (input.element as HTMLInputElement).value = "5";
    await input.trigger("input");
    expect(w.emitted("mark")?.[0]).toEqual([0, 5]);
    expect(w.emitted("update")).toBeUndefined();
    expect((input.element as HTMLInputElement).value).toBe(""); // the note never fills the input
  });

  it("pencil-mode Backspace on an empty cell erases the notes via mark(pos, 0)", async () => {
    const w = mountCell({ boardSize: 9, pencilMode: "center", value: 0 });
    await w.get("input").trigger("keydown", { key: "Backspace" });
    expect(w.emitted("mark")?.[0]).toEqual([0, 0]);
    expect(w.emitted("update")).toBeUndefined();
  });

  it("pencil mode ignores a digit on a FILLED cell — a note only lands on an empty one", async () => {
    const w = mountCell({ boardSize: 9, pencilMode: "corner", value: 7 });
    const input = w.get("input");
    (input.element as HTMLInputElement).value = "73";
    await input.trigger("input");
    expect(w.emitted("mark")).toBeUndefined();
    expect(w.emitted("update")).toBeUndefined();
  });
});

describe("DigitCell (boxed) — user marks render distinctly from the engine marks (T4-W8 ROW 1)", () => {
  it("corner + center notes render in their OWN layers, never the engine `.pencil-marks`", () => {
    const w = mountCell({ value: 0, cornerMarks: [1, 4], centerMarks: [2, 9] });
    expect(w.find(".user-corner-marks").exists()).toBe(true);
    expect(w.find(".user-center-marks").exists()).toBe(true);
    expect(w.find(".pencil-marks").exists()).toBe(false); // the engine class is NOT reused
  });

  it("a filled cell hides its notes — the empty-cell gate the engine marks also use", () => {
    const w = mountCell({ value: 5, cornerMarks: [1, 2], centerMarks: [3] });
    expect(w.find(".user-corner-marks").exists()).toBe(false);
    expect(w.find(".user-center-marks").exists()).toBe(false);
  });
});

// Peer-unit wash (T4-W8 ROW 4). The board derives the peer set over `focusedPos` and hands each
// cell an `isPeer` flag; the cell lights a faint crayon-blue wash on its OWN layer (never the
// conflict / hint tiers), whether the cell is filled or blank — the whole unit reads at a glance.
describe("DigitCell (boxed) — peer-unit wash (T4-W8 ROW 4)", () => {
  it("renders the peer wash when isPeer, on its own `.cell-peer` layer", () => {
    expect(mountCell({ isPeer: true }).find(".cell-peer").exists()).toBe(true);
  });

  it("no wash when the cell is not in the focused unit", () => {
    expect(mountCell({ isPeer: false }).find(".cell-peer").exists()).toBe(false);
  });

  it("the wash covers the whole unit — a filled peer cell washes too, not just blanks", () => {
    expect(mountCell({ isPeer: true, value: 5 }).find(".cell-peer").exists()).toBe(
      true,
    );
  });
});

// ── The Latin family (futoshiki / kenken) ────────────────────────────────────────────────
// Everything above holds on a BOXED board; these are the four claims the retired
// `FutoshikiCell.test.ts` made that the boxed suite cannot: the family class, the width bound
// on a 4..7 board, the clue clause folded into the accessible name, and the engine-marks
// rectangle. The rest of that file was a byte-twin of this one and died with the component.
describe("DigitCell (latin) — the geometry-derived divergence", () => {
  it("wears the latin family class — the frozen DOM contract e2e + index.css key on", () => {
    expect(mountCell({ boardSize: 5, geometry: "latin" }).classes()).toContain(
      "futoshiki-cell",
    );
    expect(mountCell({ boardSize: 9 }).classes()).toContain("sudoku-cell");
  });

  it("bounds a 4..7 Latin board at maxlength 2 — the digit width + 1 override char", () => {
    expect(
      mountCell({ boardSize: 7, geometry: "latin" })
        .get("input")
        .attributes("maxlength"),
    ).toBe("2");
  });

  it("folds the clue's constraint clause into the accessible name", () => {
    const w = mountCell({
      boardSize: 5,
      geometry: "latin",
      constraintLabel: "greater than the cell to the right",
    });
    expect(w.get("input").attributes("aria-label")).toContain(
      "greater than the cell to the right",
    );
    // A game with no on-cell clue clause yields the identical name it always did.
    expect(
      mountCell({ boardSize: 9 }).get("input").attributes("aria-label"),
    ).not.toContain("greater than");
  });

  it("lays the engine-marks mini-grid on the tightest ceil-√ rectangle", () => {
    // 5..7 → 3 columns; a boxed 9 → 3 columns AND 3 rows (the sub-grid it always borrowed).
    const latin = mountCell({ boardSize: 5, geometry: "latin", marks: [1, 2, 3] });
    expect(latin.get(".pencil-marks").attributes("style")).toContain(
      "grid-template-columns: repeat(3",
    );
    const boxed = mountCell({ boardSize: 9, marks: [1, 2, 3] });
    expect(boxed.get(".pencil-marks").attributes("style")).toContain(
      "grid-template-columns: repeat(3",
    );
    expect(boxed.get(".pencil-marks").attributes("style")).toContain(
      "grid-template-rows: repeat(3",
    );
  });
});
