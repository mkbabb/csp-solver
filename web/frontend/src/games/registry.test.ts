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
import {
  defineGame,
  gameRegistry,
  GAMES,
  type GameDefinition,
  type GameCard,
} from "./registry";

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

// ── The card FACE of the registration (T4-W12 Wave A) ───────────────────────────────────────

describe("game card contract (T4-W12 carousel)", () => {
  it("exposes all five games as GameCard rows; id === name; the two mechanical games are gameRegistry keys", () => {
    // T4-W13: the three new games (thermo/killer/kenken) landed as GAMES rows — registered by
    // CONVENTION (loose `id: string`, ZERO gameRegistry edit; the drop-in invariant proved below).
    expect(GAMES.map((c) => c.id)).toEqual([
      "sudoku",
      "futoshiki",
      "thermo",
      "killer",
      "kenken",
    ]);
    // The card names the SAME game its id registers under — never a parallel identity.
    for (const card of GAMES) expect(card.name).toBe(card.id);
    // The two mechanically-declared games ARE `gameRegistry` keys; the three new ones ride the
    // loose-id drop-in (no gameRegistry edit), so they are deliberately absent from that map.
    expect(gameRegistry).toHaveProperty("sudoku");
    expect(gameRegistry).toHaveProperty("futoshiki");
    expect(gameRegistry).not.toHaveProperty("thermo");
  });

  it("preserves the Sudoku-eager / Futoshiki-lazy chunking asymmetry", () => {
    const [sudoku, futoshiki] = GAMES;
    expect(sudoku.eager).toBe(true);
    expect(futoshiki.eager).toBeFalsy();
  });

  it("carries a size sub-line derived from each game's own selector vocabulary", () => {
    const [sudoku, futoshiki] = GAMES;
    expect(sudoku.range.levels).toEqual(["4×4", "9×9", "16×16"]);
    expect(futoshiki.range.levels).toEqual(["4×4", "5×5", "6×6", "7×7"]);
  });

  it("resolves each card's poster + scene loaders to components", async () => {
    for (const card of GAMES) {
      const poster = await card.poster();
      const scene = await card.scene();
      expect(poster).toBeTruthy();
      expect(scene).toBeTruthy();
    }
  });

  it("drops a third game in with ZERO edits outside GAMES (id is a loose string)", () => {
    // The born-RED drop-in gate, at the type level: a card with a NOVEL id (unknown to
    // `gameRegistry`) pushes to a GameCard[] and type-checks. A stricter id
    // (`keyof typeof gameRegistry`) would force a registry edit too — this proves it doesn't.
    const DemoPoster = defineComponent({ name: "DemoPoster", render: () => null });
    const DemoScene = defineComponent({ name: "DemoScene", render: () => null });
    const demoCard: GameCard = {
      id: "demo",
      name: "demo",
      range: { label: "size", levels: ["3×3"] },
      poster: () => Promise.resolve(DemoPoster),
      scene: () => Promise.resolve(DemoScene),
    };
    const withDemo: GameCard[] = [...GAMES, demoCard];
    expect(withDemo).toHaveLength(GAMES.length + 1); // the five landed games + the demo drop-in
    expect(gameRegistry).not.toHaveProperty("demo"); // no registry edit was needed
  });
});
