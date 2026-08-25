import { describe, it, expect } from "vitest";
import { findConflicts, type ConflictSink } from "./conflicts";

/**
 * T9-W1 §1.2 — THE NOTE NAMES THE UNIT THAT WAS ACTUALLY BROKEN.
 *
 * The derivation built per-unit buckets and then threw them away for `min(row(pos))`, so a
 * pure COLUMN duplicate sent the reader to a row with nothing wrong in it (V8 proved it live,
 * both engines). The buckets survive to the caller now, as ONE named unit: the violation the
 * earliest circled cell belongs to, in the vocabulary the game prints.
 *
 * The rows below are ordered by what they pin: the defect itself first, then the units that
 * already worked and must keep working, then the per-game sink that lets a cage or a
 * thermometer say its own name.
 */

/** A sparse board — every position not named is empty. */
const board = (filled: Record<number, number>): Record<string, number> =>
  Object.fromEntries(Object.entries(filled).map(([k, v]) => [String(k), v]));

describe("findConflicts — the violated unit, named", () => {
  it("a PURE COLUMN duplicate names the column, never a clean row", () => {
    // 9×9, boxed. One 7 in row 0 and one 7 in row 5, both in column 4 (0-based). Every row
    // holds a single digit, so no row is broken; the two boxes differ, so no box is either.
    const c = findConflicts(board({ 4: 7, 49: 7 }), 9, { subgridSize: 3 });
    expect([...c.positions].sort()).toEqual(["4", "49"]);
    expect(c.unit).toEqual({ kind: "column", index: 5 });
  });

  it("a row duplicate still names its row", () => {
    const c = findConflicts(board({ 0: 3, 5: 3 }), 9, { subgridSize: 3 });
    expect(c.unit).toEqual({ kind: "row", index: 1 });
  });

  it("a BOX duplicate with a clean row and a clean column names the box", () => {
    // pos 0 is r0c0, pos 10 is r1c1 — different rows, different columns, the same box.
    const c = findConflicts(board({ 0: 4, 10: 4 }), 9, { subgridSize: 3 });
    expect(c.unit).toEqual({ kind: "box", index: 1 });
  });

  it("a latin board has no box band, so a same-box repeat reads as its row", () => {
    const c = findConflicts(board({ 0: 2, 1: 2 }), 4);
    expect(c.unit).toEqual({ kind: "row", index: 1 });
  });

  it("the EARLIEST circled cell picks the unit when several are broken", () => {
    // Column 1 breaks at position 1; row 2 breaks at position 8. The reader's eye lands on
    // position 1, so the note points there.
    const c = findConflicts(board({ 1: 3, 9: 3, 8: 2, 11: 2 }), 4);
    expect([...c.positions].sort()).toEqual(["1", "11", "8", "9"]);
    expect(c.unit).toEqual({ kind: "column", index: 2 });
  });

  it("a row and its own column breaking on the same cell settles on the row", () => {
    const c = findConflicts(board({ 0: 1, 1: 1, 4: 1 }), 4);
    expect(c.unit).toEqual({ kind: "row", index: 1 });
  });

  it("a clean board names nothing", () => {
    const c = findConflicts(board({ 0: 1, 5: 2 }), 4);
    expect(c.positions.size).toBe(0);
    expect(c.unit).toBeNull();
  });

  it("an empty board is not a conflict", () => {
    expect(findConflicts({}, 9, { subgridSize: 3 }).unit).toBeNull();
  });

  it("a board with no size at all yields nothing", () => {
    expect(findConflicts(board({ 0: 1 }), 0).positions.size).toBe(0);
  });
});

describe("findConflicts — the per-game sink speaks its own unit", () => {
  const pair: ConflictSink = (_values, add) => {
    add(2);
    add(6);
  };

  it("a sink violation with clean rows and columns is named by the game's word", () => {
    const c = findConflicts(board({ 2: 1, 6: 3 }), 4, {
      extra: pair,
      extraUnit: "cage",
    });
    expect([...c.positions].sort()).toEqual(["2", "6"]);
    expect(c.unit).toEqual({ kind: "cage", index: null });
  });

  it("carries the futoshiki and thermometer words through the same slot", () => {
    expect(
      findConflicts(board({ 2: 1, 6: 3 }), 4, { extra: pair, extraUnit: "inequality" })
        .unit,
    ).toEqual({ kind: "inequality", index: null });
    expect(
      findConflicts(board({ 2: 1, 6: 3 }), 4, { extra: pair, extraUnit: "thermometer" })
        .unit,
    ).toEqual({ kind: "thermometer", index: null });
  });

  it("a row duplicate the reader meets first outranks a later sink violation", () => {
    const c = findConflicts(board({ 0: 1, 1: 1, 2: 5, 6: 3 }), 4, {
      extra: pair,
      extraUnit: "cage",
    });
    expect(c.unit).toEqual({ kind: "row", index: 1 });
    expect([...c.positions].sort()).toEqual(["0", "1", "2", "6"]);
  });

  it("a sink with no word marks the cells and invents no name for them", () => {
    const c = findConflicts(board({ 2: 1, 6: 3 }), 4, { extra: pair });
    expect([...c.positions].sort()).toEqual(["2", "6"]);
    expect(c.unit).toBeNull();
  });

  it("a silent sink adds nothing", () => {
    const c = findConflicts(board({ 0: 1 }), 4, {
      extra: () => {},
      extraUnit: "cage",
    });
    expect(c.positions.size).toBe(0);
    expect(c.unit).toBeNull();
  });
});
