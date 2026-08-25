/**
 * The clue seam's wire head, pinned. Moved verbatim from `solver/thermoWire.ts` at T5-W2 F3
 * when the per-game solver directory died — the codec is the SEAM's, not a worker's,
 * and one protocol over one worker leaves the buffer shape as the only per-game wire fact.
 */
import { describe, it, expect } from "vitest";
import {
  encodeThermometers,
  decodeThermometers,
  thermoClue,
  chainViolations,
} from "./clue";
import { findConflicts } from "@games/shared/conflicts";
import { formatConflictNote } from "@games/shared/techniqueVoice";
import { thermoSpec } from "./spec";
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

  // -- 2.2d, THE WIRE GUARD --------------------------------------------------------
  // A length-prefixed group whose members run off the end of the buffer is a MALFORMED frame,
  // not a short one. It used to be absorbed silently, by the `j < k && i < flat.length` loop bound -- the fail-explicit defect this wave
  // names: the caller received a tube it never sent and could not tell. The guard is shared
  // (`@games/shared/solver/wire`), so all three length-prefixed codecs refuse identically.
  it("THROWS on a truncated group rather than absorbing it (2.2d)", () => {
    // The group claims 3 cells; only 2 follow.
    expect(() => decodeThermometers(new Uint32Array([3, 0, 1]))).toThrow(/truncated/i);
    // A dangling count with no cells at all.
    expect(() => decodeThermometers(new Uint32Array([2]))).toThrow(/truncated/i);
    // Control: the well-formed frame still decodes.
    expect(decodeThermometers(new Uint32Array([2, 0, 1]))).toEqual([[0, 1]]);
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

// ── T9-W1 §1.2 — THE THERMOMETER JOINS THE BOARD'S LAW ─────────────────────────────────────
// Thermo's chain ordering was absent from the conflict derivation entirely: a board whose only
// fault ran DOWN a tube was graded 'failed' and told to check a row with nothing wrong in it.
// The rule is the tube's own: values strictly increase bulb to tip, so any two filled cells in
// path order that do not increase are provably wrong, gaps between them or not.
describe("thermo clue seam — the chain-order conflict sink", () => {
  const sweep = (thermos: ThermoLine[], values: Record<string, number>): number[] => {
    const hit: number[] = [];
    chainViolations(thermos)(values, (pos) => hit.push(pos));
    return hit.sort((a, b) => a - b);
  };

  it("a value that falls along the tube circles the pair that fell", () => {
    expect(sweep([[0, 4, 8]], { "0": 3, "4": 2 })).toEqual([0, 4]);
  });

  it("two equal values along the tube are wrong too (the increase is strict)", () => {
    expect(sweep([[0, 4]], { "0": 2, "4": 2 })).toEqual([0, 4]);
  });

  it("reads across an empty cell — the order is the whole path's, not each step's", () => {
    expect(sweep([[0, 4, 8]], { "0": 3, "8": 2 })).toEqual([0, 8]);
  });

  it("a rising tube is left alone, filled or part filled", () => {
    expect(sweep([[0, 4, 8]], { "0": 1, "4": 2, "8": 3 })).toEqual([]);
    expect(sweep([[0, 4, 8]], { "0": 1, "8": 3 })).toEqual([]);
    expect(sweep([[0, 4, 8]], { "4": 2 })).toEqual([]);
  });

  it("an empty tube and an empty set both say nothing", () => {
    expect(sweep([[0, 4, 8]], {})).toEqual([]);
    expect(sweep([], { "0": 1 })).toEqual([]);
  });

  it("a one-cell tube can never be out of order", () => {
    expect(sweep([[5]], { "5": 4 })).toEqual([]);
  });

  it("every falling pair on a longer tube is circled, not just the first", () => {
    expect(sweep([[0, 4, 8, 12]], { "0": 4, "4": 3, "8": 2 })).toEqual([0, 4, 8]);
  });

  it("names the thermometer in the verdict when nothing else on the board is broken", () => {
    const c = findConflicts({ "0": 3, "4": 2 }, 4, {
      subgridSize: 2,
      extra: chainViolations([[0, 4, 8]]),
      extraUnit: "thermometer",
    });
    expect(c.unit).toEqual({ kind: "thermometer", index: null });
    expect(formatConflictNote(c.unit)).toBe("check the thermometer");
  });

  it("is the sink the spec hands the board", () => {
    expect(thermoSpec.clues?.conflicts).toEqual({
      unit: "thermometer",
      sink: chainViolations,
    });
  });
});
