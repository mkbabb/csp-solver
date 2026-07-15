/**
 * Thermo-Sudoku contract acceptance (T4-W13, ROW 1) — the FE half of the contract proof,
 * grown from W11's `registry.test.ts` compile-time stub into the real game.
 *
 * Two claims:
 *   1. The REAL `thermoGame` satisfies `GameDefinition` with a NOVEL clue type
 *      (`ThermoLine[]`) and ZERO shell edits — the `defineGame<…, ThermoLine[]>(…)`
 *      type-checking IS that proof; the runtime asserts below exercise the furniture slots.
 *   2. This unit test is the knip anchor that keeps the whole thermo subtree (game →
 *      useThermo → useSolver → protocol/worker/furniture) non-orphan until W12 wires the
 *      `GAMES[]` registry row.
 */
import { describe, it, expect } from "vitest";
import type { GameDefinition } from "@games/registry";
import { thermoGame } from "./game";
import type { ThermoLine } from "./types";
import { encodeThermometers, decodeThermometers } from "./solver/thermoWire";

// The explicit annotation pins that the real game satisfies the contract with TClue =
// ThermoLine[] — a third clue kind beyond Sudoku's `void` and Futoshiki's `Inequality[]`.
const _typecheck: GameDefinition<
  ReturnType<(typeof thermoGame)["model"]>,
  (typeof thermoGame)["cellFurniture"],
  ThermoLine[]
> = thermoGame;
void _typecheck;

describe("Thermo-Sudoku game contract (T4-W13)", () => {
  it("declares the bulb+tube clue furniture as a component slot, never a boolean", () => {
    expect(thermoGame.clueFurniture).not.toBeNull();
    expect(typeof thermoGame.model).toBe("function");
    expect(typeof thermoGame.solverPayloads).toBe("function");
  });

  it("exposes a size + difficulty section over the live model", () => {
    const sections = thermoGame.options(thermoGame.model());
    expect(sections.map((s) => s.key)).toEqual(["size", "difficulty"]);
  });

  it("threads thermometer clues through the wire codec losslessly", () => {
    const thermos: ThermoLine[] = [
      [0, 1, 2],
      [30, 39, 48],
    ];
    expect(decodeThermometers(encodeThermometers(thermos))).toEqual(thermos);
  });
});
