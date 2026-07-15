import { describe, it, expect } from "vitest";
import { encodeThermometers, decodeThermometers } from "./thermoWire";
import type { ThermoLine } from "../types";

describe("thermometer wire codec", () => {
  it("round-trips a set of variable-length tubes through the flat buffer", () => {
    const thermos: ThermoLine[] = [
      [0, 1, 2],
      [10, 19, 28, 37],
      [40, 41],
    ];
    const flat = encodeThermometers(thermos);
    // Length-prefixed: [3,0,1,2, 4,10,19,28,37, 2,40,41]
    expect(Array.from(flat)).toEqual([3, 0, 1, 2, 4, 10, 19, 28, 37, 2, 40, 41]);
    expect(decodeThermometers(flat)).toEqual(thermos);
  });

  it("round-trips the empty set", () => {
    expect(Array.from(encodeThermometers([]))).toEqual([]);
    expect(decodeThermometers(new Uint32Array())).toEqual([]);
  });

  it("preserves bulb→tip order (the constraint direction)", () => {
    const thermos: ThermoLine[] = [[8, 7, 6, 5]]; // a tube whose cells descend in index
    const decoded = decodeThermometers(encodeThermometers(thermos));
    expect(decoded[0]).toEqual([8, 7, 6, 5]);
  });
});
