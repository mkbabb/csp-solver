/**
 * The game contract's acceptance proof (T4-W11 keystone, P12).
 *
 * Two claims, both COMPILE-TIME (checked by `vue-tsc -b`; this file's mere type-checking is
 * the proof):
 *   1. Both shipped games satisfy `GameDefinition` — declared through `defineGame` and
 *      registered in `gameRegistry` (imported here, so the registry + both game declarations
 *      stay non-orphan for knip).
 *   2. A THIRD game (W13's Thermo-Sudoku) plugs into the SAME contract with ZERO shell edits
 *      and a NOVEL clue type — a thermometer path, neither Sudoku's `void` nor Futoshiki's
 *      `Inequality[]`. That the `defineGame<…, ThermoLine[]>(…)` call below type-checks
 *      unchanged is the proof the contract is the intersection, not a fork point.
 *
 * The Thermo stub is dead-by-design (un-mounted, un-registered — W13 lands the real game);
 * homed in this unit test so knip/eslint accept it. The Rust half is
 * `csp-solver/tests/thermo_acceptance.rs`.
 */
import { describe, it, expect } from "vitest";
import { defineComponent, ref, type Ref } from "vue";
import { defineGame, gameRegistry, type GameDefinition } from "./registry";

// ── The acceptance stub: Thermo-Sudoku (W13's third game), declared type-only ──────────────

/** A thermometer: an ordered path of cell indices whose values strictly increase from the
 *  bulb. The THIRD clue kind — distinct from Sudoku's `void` and Futoshiki's `Inequality[]`. */
type ThermoLine = number[];

interface ThermoModel {
  pendingSize: Ref<number>;
  difficulty: Ref<"EASY" | "MEDIUM" | "HARD">;
}

// The cell + thermometer-overlay furniture W13 will build; here compile-time stubs proving the
// contract accepts ARBITRARY furniture as component slots (never mounted — render, no template).
const ThermoCell = defineComponent({ name: "ThermoCell", render: () => null });
const ThermoLineOverlay = defineComponent({
  name: "ThermoLineOverlay",
  render: () => null,
});

// The `defineGame<ThermoModel, typeof ThermoCell, ThermoLine[]>({…})` call type-checking IS the
// acceptance proof; the explicit `GameDefinition` annotation pins that it satisfies the contract.
const thermoGame: GameDefinition<ThermoModel, typeof ThermoCell, ThermoLine[]> =
  defineGame<ThermoModel, typeof ThermoCell, ThermoLine[]>({
    model: (): ThermoModel => ({ pendingSize: ref(3), difficulty: ref("EASY") }),
    cellFurniture: ThermoCell,
    clueFurniture: ThermoLineOverlay,
    options: (m) => [
      {
        key: "size",
        heading: "Size",
        ariaLabel: "Size",
        options: [{ value: 3, label: "9×9" }],
        selected: m.pendingSize.value,
        onChange: (v) => (m.pendingSize.value = v as number),
      },
      {
        key: "difficulty",
        heading: "Difficulty",
        options: [{ value: "EASY", label: "Easy", colorClass: "crayon-green" }],
        selected: m.difficulty.value,
        onChange: (v) => (m.difficulty.value = v as "EASY" | "MEDIUM" | "HARD"),
      },
    ],
    // The novel clue type threads through solve/propagate exactly as Futoshiki's `Inequality[]`
    // does — the contract is generic over clue furniture, not forked per game.
    solverPayloads: () => ({
      getRandomBoard: async () => ({ values: {} }),
      solveBoard: async (
        values: Record<string, number>,
        _dim: number,
        thermos: ThermoLine[],
      ) => ({
        solved: thermos.every((t) => t.length >= 2),
        values,
        backtracks: 0,
        nodesExplored: 0,
        propagations: 0,
        solutionCount: 1,
      }),
      propagateBoard: async (
        _values: Record<string, number>,
        _dim: number,
        _thermos: ThermoLine[],
      ) => new Uint32Array(),
    }),
  });

describe("game contract (P12 keystone)", () => {
  it("registers both shipped games through defineGame", () => {
    expect(Object.keys(gameRegistry)).toEqual(["sudoku", "futoshiki"]);
    // Both furniture slots are components-or-null, never config booleans:
    expect(gameRegistry.sudoku.clueFurniture).toBeNull(); // Sudoku: subgrid ticks, no overlay
    expect(gameRegistry.futoshiki.clueFurniture).not.toBeNull(); // Futoshiki: the caret layer
    expect(typeof gameRegistry.sudoku.model).toBe("function");
    expect(typeof gameRegistry.futoshiki.solverPayloads).toBe("function");
  });

  it("accepts a third game (Thermo-Sudoku) with a novel clue type and ZERO shell edits", () => {
    expect(thermoGame.clueFurniture).not.toBeNull(); // Thermo carries thermometer overlay furniture
    // Exercise the contract functions on the stub (the compile-time acceptance is above):
    expect(thermoGame.options(thermoGame.model())).toHaveLength(2);
  });
});
