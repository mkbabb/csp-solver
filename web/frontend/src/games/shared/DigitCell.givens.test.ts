import { describe, it, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import DigitCell from "./DigitCell.vue";

/**
 * T9-W1 §1.1 · THE CELL'S HALF OF THE GIVEN'S LAW (family F17, ballot B7's default).
 *
 * The model rules on the write (`useGameState.givens.test.ts`); what the CELL owes is that
 * its own surface never claims a write the model refused, and that the refusal is felt.
 *
 *   · the native input goes back to the clue's digit — it had already taken the keystroke
 *   · the root arms the refusal cue for one window, then disarms itself
 *   · the accessible name still reads "given clue N", because nothing re-labels a given
 *
 * The write still TRAVELS: the cell asks and the model rules, so one refusal is heard by the
 * undo spine, the room and the status region alike rather than three predicates agreeing.
 */

/** The most-recent `update` emission (avoids Array.prototype.at — the app lib targets < es2022). */
function lastUpdate(wrapper: ReturnType<typeof mountCell>): unknown[] | undefined {
  const evs = wrapper.emitted("update");
  return evs ? evs[evs.length - 1] : undefined;
}

function mountCell(overrides: Record<string, unknown> = {}) {
  return mount(DigitCell, {
    props: {
      position: 0,
      value: 5,
      isGiven: true,
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

/** Type a character into the cell's input at `caret`, the way a browser leaves it: the value
 *  already carries the insertion and the caret sits just past it. */
async function typeAt(
  wrapper: ReturnType<typeof mountCell>,
  raw: string,
  caret: number,
) {
  const input = wrapper.get("input");
  const el = input.element as HTMLInputElement;
  el.value = raw;
  el.setSelectionRange(caret, caret);
  await input.trigger("input");
  return el;
}

describe("the given cell's own surface (T9-W1 §1.1)", () => {
  it("puts the clue's digit back — the input never keeps a refused keystroke", async () => {
    const w = mountCell({ value: 5, isGiven: true });
    const el = await typeAt(w, "57", 2); // '7' appended at the caret

    expect(el.value).toBe("5");
    // The cell asks; the model rules. The write travels so ONE refusal is heard everywhere.
    expect(lastUpdate(w)).toEqual([0, 7]);
  });

  it("keeps the clue on Backspace too — an erase is a write", async () => {
    const w = mountCell({ value: 5, isGiven: true });
    const input = w.get("input");
    await input.trigger("keydown", { key: "Backspace" });

    expect((input.element as HTMLInputElement).value).toBe("5");
    expect(lastUpdate(w)).toEqual([0, 0]);
  });

  it("says the refusal on the root, where the house cascade can draw it", async () => {
    const w = mountCell({ value: 5, isGiven: true });
    await typeAt(w, "57", 2);

    expect(w.classes()).toContain("is-refused");
    // One number draws the cue, bound as a custom property (the `--draw-dur` precedent).
    expect(w.attributes("style")).toContain("--refuse-dur");
  });

  it("the cue is a pulse, not a state — it disarms itself", async () => {
    vi.useFakeTimers();
    const w = mountCell({ value: 5, isGiven: true });
    await typeAt(w, "57", 2);
    expect(w.classes()).toContain("is-refused");

    vi.advanceTimersByTime(1000);
    await w.vm.$nextTick();

    expect(w.classes()).not.toContain("is-refused");
  });

  it("an ordinary cell arms nothing — the cue belongs to the refusal alone", async () => {
    const w = mountCell({ value: 0, isGiven: false });
    await typeAt(w, "7", 1);

    expect(w.classes()).not.toContain("is-refused");
    expect(lastUpdate(w)).toEqual([0, 7]);
  });

  it("announces a given clue whatever else is claimed of the cell", () => {
    // The retired demotion flag is passed on purpose: nothing re-labels a given any more.
    const w = mountCell({ value: 5, isGiven: true, isOverridden: true });
    expect(w.get("input").attributes("aria-label")).toBe(
      "Row 1, column 1, given clue 5",
    );
  });

  afterEach(() => vi.useRealTimers());
});

/**
 * V8's half-write (T9-W1 §1.1's P1 rider). The clamp took the LAST digits of the whole input
 * regardless of where the character landed, so with the caret parked at 0 the first keystroke
 * on a filled cell was swallowed — the cell re-committed the digit it already held, and the
 * given it was aimed at was reclassified by a write of nothing. The typed character wins now:
 * the clamp reads the digits ending AT THE CARET.
 */
describe("the caret no longer decides the digit (V8's swallow)", () => {
  it("a keystroke at the head of a filled cell commits what was typed", async () => {
    const w = mountCell({ value: 5, isGiven: false, boardSize: 9 });
    await typeAt(w, "75", 1); // '7' typed with the caret at 0

    expect(lastUpdate(w)).toEqual([0, 7]);
  });

  it("the same at 16×16, where the width is two", async () => {
    const w = mountCell({ value: 12, isGiven: false, boardSize: 16 });
    await typeAt(w, "312", 1); // '3' typed at the head of '12'

    expect(lastUpdate(w)).toEqual([0, 3]);
  });

  it("an append still commits the appended digit (the one-keystroke override)", async () => {
    const w = mountCell({ value: 9, isGiven: false, boardSize: 9 });
    await typeAt(w, "93", 2);

    expect(lastUpdate(w)).toEqual([0, 3]);
  });

  it("two-digit entry still accumulates whole at 16×16", async () => {
    const w = mountCell({ value: 1, isGiven: false, boardSize: 16 });
    await typeAt(w, "16", 2);

    expect(lastUpdate(w)).toEqual([0, 16]);
  });

  it("a digit off the board is still rejected, and the cell keeps its own", async () => {
    const w = mountCell({ value: 4, isGiven: false, boardSize: 9 });
    const el = await typeAt(w, "04", 1); // a 0 typed at the head — no cell holds 0

    expect(w.emitted("update")).toBeUndefined();
    expect(el.value).toBe("4");
  });
});
