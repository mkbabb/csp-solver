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
 *   · `authorName` → the accessible name's tail. It is the coarse-pointer route to attribution,
 *     stated as a real asymmetry rather than papered over: hover is a fine-pointer grammar and
 *     long-press is already spent on the peek, so a thumb gets the NAME or it gets nothing.
 */

function mountCell(overrides: Record<string, unknown> = {}) {
  return mount(DigitCell, {
    props: {
      position: 0,
      value: 4,
      isGiven: false,
      isOverridden: false,
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

describe("attribution — the accessible name carries who wrote it", () => {
  it("says nothing extra when nobody else wrote the cell", () => {
    const label = mountCell().get("input").attributes("aria-label");
    expect(label).toBe("Row 2, column 3, your entry 4");
  });

  it("appends the author, in plain English, after the value", () => {
    const label = mountCell({ authorName: "brave-otter" })
      .get("input")
      .attributes("aria-label");
    expect(label).toBe("Row 2, column 3, your entry 4, written by brave-otter");
  });

  it("rides the SAME tail the clue vocabulary uses, and keeps its order", () => {
    // `ariaSuffix` is one seam, not two: futoshiki's inequality and the author land in one
    // comma-joined clause rather than the author minting a second describedby nobody points at.
    const label = mountCell({
      geometry: "latin",
      boardSize: 5,
      constraintLabel: "greater than the cell to the right",
      authorName: "keen-lynx",
    })
      .get("input")
      .attributes("aria-label");
    expect(label).toBe(
      "Row 2, column 3, your entry 4, greater than the cell to the right, written by keen-lynx",
    );
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
