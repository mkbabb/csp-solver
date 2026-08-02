/**
 * The clue seam's wire head, pinned. Moved verbatim from `solver/thermoWire.ts` at T5-W2 F3
 * when the per-game solver directory died — the codec is the SEAM's, not a worker's,
 * and one protocol over one worker leaves the buffer shape as the only per-game wire fact.
 */
import { describe, it, expect } from "vitest";
import { encodeThermometers, decodeThermometers, thermoClue } from "./clue";
import type { ThermoLine } from "./types";

describe("thermo clue seam — the thermometer wire codec", () => {
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

  // The codec pair `spec.clues` spreads and the pair the solver client is handed are the SAME
  // functions, by identity — not two homes that agree today. `games/shared`'s own parity unit
  // stubs its codecs (it may not import a game), so this identity is where the real pair meets
  // the real seam.
  it("is the ONE pair the spec spreads and the solver client is handed", () => {
    expect(thermoClue.encode).toBe(encodeThermometers);
    expect(thermoClue.decode).toBe(decodeThermometers);
  });
});
