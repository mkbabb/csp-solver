import { describe, it, expect } from "vitest";
import { encodeCages, decodeCages } from "./kenkenWire";
import type { KenKenCage } from "../types";

describe("kenken cage wire codec", () => {
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
});
