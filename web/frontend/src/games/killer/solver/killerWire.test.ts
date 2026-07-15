import { describe, it, expect } from "vitest";
import { encodeCages, decodeCages } from "./killerWire";
import type { KillerCage } from "../types";

describe("killer cage wire codec", () => {
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
});
