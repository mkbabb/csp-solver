/**
 * The clue seam's wire head, pinned. Moved verbatim from `solver/kenkenWire.ts` at T5-W2 F3
 * when the per-game solver directory died — the codec is the SEAM's, not a worker's,
 * and one protocol over one worker leaves the buffer shape as the only per-game wire fact.
 */
import { describe, it, expect } from "vitest";
import { encodeCages, decodeCages, kenkenClue } from "./clue";
import type { KenKenCage } from "./types";

describe("kenken clue seam — the cage wire codec", () => {
  it("round-trips a set of operator cages through the flat buffer", () => {
    const cages: KenKenCage[] = [
      { op: "+", target: 6, cells: [0, 1, 2] },
      { op: "-", target: 3, cells: [10, 19] },
      { op: "×", target: 24, cells: [40, 41, 50, 51] },
      { op: "÷", target: 2, cells: [7, 8] },
    ];
    const flat = encodeCages(cages);
    // Length-prefixed with op ordinal + target:
    // [3,0,6,0,1,2, 2,1,3,10,19, 4,2,24,40,41,50,51, 2,3,2,7,8]
    expect(Array.from(flat)).toEqual([
      3, 0, 6, 0, 1, 2, 2, 1, 3, 10, 19, 4, 2, 24, 40, 41, 50, 51, 2, 3, 2, 7, 8,
    ]);
    expect(decodeCages(flat)).toEqual(cages);
  });

  it("round-trips the empty set", () => {
    expect(Array.from(encodeCages([]))).toEqual([]);
    expect(decodeCages(new Uint32Array())).toEqual([]);
  });

  it("round-trips a singleton given cage (+ with the cell's value)", () => {
    const cages: KenKenCage[] = [{ op: "+", target: 5, cells: [40] }];
    const flat = encodeCages(cages);
    expect(Array.from(flat)).toEqual([1, 0, 5, 40]);
    expect(decodeCages(flat)).toEqual(cages);
  });

  // The codec pair `spec.clues` spreads and the pair the solver client is handed are the SAME
  // functions, by identity — not two homes that agree today. `games/shared`'s own parity unit
  // stubs its codecs (it may not import a game), so this identity is where the real pair meets
  // the real seam.
  it("is the ONE pair the spec spreads and the solver client is handed", () => {
    expect(kenkenClue.encode).toBe(encodeCages);
    expect(kenkenClue.decode).toBe(decodeCages);
  });
});
