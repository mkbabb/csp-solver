/**
 * The clue seam's wire head, pinned. Moved verbatim from `solver/killerWire.ts` at T5-W2 F3
 * when the per-game solver directory died — the codec is the SEAM's, not a worker's,
 * and one protocol over one worker leaves the buffer shape as the only per-game wire fact.
 */
import { describe, it, expect } from "vitest";
import { encodeCages, decodeCages, killerClue } from "./clue";
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
