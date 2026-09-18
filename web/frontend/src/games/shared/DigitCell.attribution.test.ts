import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DigitCell from "./DigitCell.vue";

/**
 * T8-W3 · THE CELL'S HALF OF M1 — attribution and the peer's ghost.
 *
 * Two surfaces cross the cell's boundary here and neither is a picture, which is why they can
 * be pinned at unit speed while the tier's own paint is pinned in the e2e (jsdom applies no
 * stylesheet — this layer's standing caveat):
 *
 *   · `isPeerCursor` → the root state class. The ring's whole form lives in `gameCell.css`; the
 *     class is the only thing the cell decides.
 *   · `authorName` → the accessible name's CORE (T9-W3 §3.3 moved it there from the tail). It is
 *     the spoken route to attribution and it reads the same on every pointer. The LOOK is no
 *     longer withheld from a thumb either: T9-W7 3C-4 gave the washi tape the focused cell to
 *     ride where there is no hover, so a touch user gets the tape and the name both.
 */

function mountCell(overrides: Record<string, unknown> = {}) {
  return mount(DigitCell, {
    props: {
      position: 0,
      value: 4,
      isGiven: false,
      // `isOverridden` retired with the demotion (T9-W1 §1.1) — the cell declares no such prop,
      // so passing it here would only stamp a stray attribute on the root.
      isSolved: false,
      isRevealed: false,
      noiseDelay: 0,
      boardSize: 9,
      geometry: "boxed",
      ghostPath: "",
      rowIndex: 2,
      colIndex: 3,
      tabIndex: 0,
      isInvalid: false,
      ...overrides,
    },
  });
}

describe("ghost tier 4 — a peer's pencil is on this square", () => {
  it("is off by default: a solo board carries no cursor state at all", () => {
    expect(mountCell().classes()).not.toContain("is-peer-cursor");
  });

  it("names itself on the root, where the four-tier cascade can reach it", () => {
    expect(mountCell({ isPeerCursor: true }).classes()).toContain("is-peer-cursor");
  });

  it("is orthogonal to your own states — both can be true on one cell", () => {
    // Someone else pointing at the cell you are conflicting in is an ordinary frame, and the
    // cascade decides which ring wins. The cell asserts both and rules on neither.
    const c = mountCell({ isPeerCursor: true, isInvalid: true });
    expect(c.classes()).toContain("is-peer-cursor");
    expect(c.classes()).toContain("is-invalid");
  });
});

/**
 * T9-W3 §3.3 — RE-CUT. The rows below used to pin "your entry 4, written by brave-otter": one
 * sentence claiming two different hands wrote one digit, and the gate held it there. A gate that
 * enshrines a defect is itself a defect, so the pin moved to the truth.
 *
 * THE RULE THE ROWS NOW STATE: the writing hand is named ONCE, in the core, by the only clause
 * that claims one. `authorName` is a PEER's slug and nothing else (BoardHost's `authorNameAt`
 * returns "" for your own cells and for the unauthored), so a peer's digit is the peer's and
 * yours is yours. The kinds whose core names a different hand — a printed clue (nobody wrote
 * it) and a revealed answer (it was filled in, and the glyph wears the solver's ink to say so)
 * — take no authorship clause at all, because a second hand in the sentence is a contradiction
 * whichever way it is read.
 */
describe("attribution — the accessible name names ONE hand, truly", () => {
  it("says your own entry is yours", () => {
    const label = mountCell().get("input").attributes("aria-label");
    expect(label).toBe("Row 2, column 3, your entry 4");
  });

  it("speaks a peer's digit as the PEER's, in plain English", () => {
    const label = mountCell({ authorName: "brave-otter" })
      .get("input")
      .attributes("aria-label");
    expect(label).toBe("Row 2, column 3, brave-otter's entry 4");
  });

  it("never claims two hands wrote one digit", () => {
    const label = mountCell({ authorName: "brave-otter" })
      .get("input")
      .attributes("aria-label")!;
    expect(label).not.toContain("your entry");
    expect(label).not.toContain("written by");
  });

  it("keeps the clue clause after the value, and keeps its order", () => {
    // The authorship rides the CORE and the constraint rides the suffix, so the two never
    // compete for one tail: who wrote it, then what the clue says about it.
    const label = mountCell({
      geometry: "latin",
      boardSize: 5,
      constraintLabel: "greater than the cell to the right",
      authorName: "keen-lynx",
    })
      .get("input")
      .attributes("aria-label");
    expect(label).toBe(
      "Row 2, column 3, keen-lynx's entry 4, greater than the cell to the right",
    );
  });

  it("leaves a revealed answer revealed, whoever asked for it", () => {
    // A peer's solve stamps the ledger, so a revealed cell can carry a peer's slug. The digit
    // was still filled in rather than written — it wears the solver's ink — and one hand is
    // what gets named. T9-W7 · B1 recut the core from `solver's answer 4`: the machine does
    // not name itself to a reader, and `revealed` is the word for what the player asked for.
    const label = mountCell({ isSolved: true, authorName: "brave-otter" })
      .get("input")
      .attributes("aria-label");
    expect(label).toBe("Row 2, column 3, revealed answer 4");
    expect(label).not.toContain("solver");
  });

  it("leaves a printed clue unauthored, whatever the ledger holds", () => {
    const label = mountCell({ isGiven: true, authorName: "brave-otter" })
      .get("input")
      .attributes("aria-label");
    expect(label).toBe("Row 2, column 3, given clue 4");
  });

  it("attributes nothing on an emptied cell — there is no digit to own", () => {
    // An erase is a write, so the clock keeps the position and the slug outlives the value.
    const label = mountCell({ value: 0, authorName: "brave-otter" })
      .get("input")
      .attributes("aria-label");
    expect(label).toBe("Row 2, column 3, empty");
  });

  it("holds M16's register: the clause carries no dash of any kind", () => {
    const label = mountCell({ authorName: "brave-otter" })
      .get("input")
      .attributes("aria-label")!;
    expect(/[—–]/.test(label)).toBe(false);
  });
});

describe("the hover the board-level tape reads", () => {
  it("publishes the position on enter and null on leave", async () => {
    // ONE washi label sits over the hovered cell rather than eighty-one waiting their turn, so
    // the cell's own `isHovered` stays the cell's and only the POSITION leaves.
    const c = mountCell({ position: 17 });
    await c.trigger("mouseenter");
    await c.trigger("mouseleave");
    expect(c.emitted("cellHover")).toEqual([[17], [null]]);
  });
});
