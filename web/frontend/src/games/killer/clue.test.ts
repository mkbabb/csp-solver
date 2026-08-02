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

  // The codec pair `spec.clues` spreads and the pair the solver client is handed are the SAME
  // functions, by identity — not two homes that agree today. `games/shared`'s own parity unit
  // stubs its codecs (it may not import a game), so this identity is where the real pair meets
  // the real seam.
  it("is the ONE pair the spec spreads and the solver client is handed", () => {
    expect(killerClue.encode).toBe(encodeCages);
    expect(killerClue.decode).toBe(decodeCages);
  });
});
