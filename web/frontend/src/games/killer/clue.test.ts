/**
 * The clue seam's wire head, pinned. Moved verbatim from `solver/killerWire.ts` at T5-W2 F3
 * when the per-game solver directory died — the codec is the SEAM's, not a worker's,
 * and one protocol over one worker leaves the buffer shape as the only per-game wire fact.
 */
import { describe, it, expect } from "vitest";
import { encodeCages, decodeCages, killerClue, cageViolations } from "./clue";
import { findConflicts } from "@games/shared/conflicts";
import { formatConflictNote } from "@games/shared/techniqueVoice";
import { killerSpec } from "./spec";
import type { KillerCage } from "./types";

describe("killer clue seam — the cage wire codec", () => {
  it("round-trips a set of variable-size cages through the flat buffer", () => {
    const cages: KillerCage[] = [
      { sum: 6, cells: [0, 1, 2] },
      { sum: 17, cells: [10, 19] },
      { sum: 12, cells: [40, 41, 50, 51] },
    ];
    const flat = encodeCages(cages);
    // Length-prefixed with sum: [3,6,0,1,2, 2,17,10,19, 4,12,40,41,50,51]
    expect(Array.from(flat)).toEqual([
      3, 6, 0, 1, 2, 2, 17, 10, 19, 4, 12, 40, 41, 50, 51,
    ]);
    expect(decodeCages(flat)).toEqual(cages);
  });

  it("round-trips the empty set", () => {
    expect(Array.from(encodeCages([]))).toEqual([]);
    expect(decodeCages(new Uint32Array())).toEqual([]);
  });

  it("round-trips a singleton cage (sum = the cell's value)", () => {
    const cages: KillerCage[] = [{ sum: 5, cells: [40] }];
    const flat = encodeCages(cages);
    expect(Array.from(flat)).toEqual([1, 5, 40]);
    expect(decodeCages(flat)).toEqual(cages);
  });

  // -- 2.2d, THE WIRE GUARD --------------------------------------------------------
  // A length-prefixed group whose members run off the end of the buffer is a MALFORMED frame,
  // not a short one. It used to be absorbed by a bare `break` -- the fail-explicit defect this wave
  // names: the caller received a cage it never sent and could not tell. The guard is shared
  // (`@games/shared/solver/wire`), so all three length-prefixed codecs refuse identically.
  it("THROWS on a truncated group rather than absorbing it (2.2d)", () => {
    // The group claims 2 cells; only 1 follows.
    expect(() => decodeCages(new Uint32Array([2, 7, 0]))).toThrow(/truncated/i);
    // A dangling count with no sum.
    expect(() => decodeCages(new Uint32Array([2]))).toThrow(/truncated/i);
    // Control: the well-formed frame still decodes.
    expect(decodeCages(new Uint32Array([2, 7, 0, 1]))).toEqual([
      { sum: 7, cells: [0, 1] },
    ]);
  });

  // The codec pair `spec.clues` spreads and the pair the solver client is handed are the SAME
  // functions, by identity — not two homes that agree today. `games/shared`'s own parity unit
  // stubs its codecs (it may not import a game), so this identity is where the real pair meets
  // the real seam.
  it("is the ONE pair the spec spreads and the solver client is handed", () => {
    expect(killerClue.encode).toBe(encodeCages);
    expect(killerClue.decode).toBe(decodeCages);
  });
});

// ── T9-W1 §1.2 — THE CAGE JOINS THE BOARD'S LAW ────────────────────────────────────────────
// Killer's cage arithmetic was absent from the conflict derivation entirely: a board wrong in
// nothing but a cage total was graded 'failed' and told to check a row that held nothing wrong.
// The sink is shaped exactly like futoshiki's inequality sweep — the same second argument, the
// same idempotent adds — and the unit word rides the spec beside it.
describe("killer clue seam — the cage conflict sink", () => {
  const sweep = (cages: KillerCage[], values: Record<string, number>): number[] => {
    const hit: number[] = [];
    cageViolations(cages)(values, (pos) => hit.push(pos));
    return hit.sort((a, b) => a - b);
  };

  it("a full cage that misses its printed total circles the whole cage", () => {
    expect(sweep([{ sum: 6, cells: [0, 1] }], { "0": 1, "1": 2 })).toEqual([0, 1]);
  });

  it("a cage that adds up is left alone", () => {
    expect(sweep([{ sum: 7, cells: [0, 1] }], { "0": 3, "1": 4 })).toEqual([]);
  });

  it("a repeat inside a cage circles the repeat (a cage is all-different)", () => {
    expect(sweep([{ sum: 4, cells: [0, 6, 9] }], { "0": 2, "6": 2 })).toEqual([0, 6]);
  });

  it("a partly filled cage that has already overshot is provably wrong", () => {
    // 4 + 3 with one cell still empty: the empty cell holds at least 1, so the cage cannot
    // reach 5 from here whatever goes in it.
    expect(sweep([{ sum: 5, cells: [0, 1, 2] }], { "0": 4, "1": 3 })).toEqual([
      0, 1, 2,
    ]);
  });

  it("a partly filled cage still inside its total is not yet wrong", () => {
    expect(sweep([{ sum: 9, cells: [0, 1, 2] }], { "0": 4, "1": 3 })).toEqual([]);
  });

  it("an empty cage says nothing, and neither does an empty set", () => {
    expect(sweep([{ sum: 6, cells: [0, 1] }], {})).toEqual([]);
    expect(sweep([], { "0": 1 })).toEqual([]);
  });

  it("a singleton cage is judged against its own label", () => {
    expect(sweep([{ sum: 3, cells: [5] }], { "5": 2 })).toEqual([5]);
    expect(sweep([{ sum: 3, cells: [5] }], { "5": 3 })).toEqual([]);
  });

  // The row that matters to a reader: a board whose rows, columns and boxes are all clean and
  // whose CAGE is wrong must say cage.
  it("names the cage in the verdict when nothing else on the board is broken", () => {
    const c = findConflicts({ "0": 1, "1": 2 }, 4, {
      subgridSize: 2,
      extra: cageViolations([{ sum: 6, cells: [0, 1] }]),
      extraUnit: "cage",
    });
    expect(c.unit).toEqual({ kind: "cage", index: null });
    expect(formatConflictNote(c.unit)).toBe("check the cage");
  });

  it("is the sink the spec hands the board", () => {
    expect(killerSpec.clues?.conflicts).toEqual({ unit: "cage", sink: cageViolations });
  });
});
