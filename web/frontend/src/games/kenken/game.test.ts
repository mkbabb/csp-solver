/**
 * KenKen / Calcudoku contract acceptance + furniture render (T4-W13, ROW 4) — the FE half of
 * the second cage-primitive consumer.
 *
 * Four claims:
 *   1. The REAL `kenkenGame` satisfies `GameDefinition` with a NOVEL clue type
 *      (`KenKenCage[]`) and ZERO shell edits — the `defineGame<…, KenKenCage[]>(…)`
 *      type-checking IS that proof; the runtime asserts below exercise the furniture slots.
 *   2. The cage furniture (`KenKenCage.vue`) renders dotted boundaries + a corner target on
 *      the boxless Latin grid — the pencil idiom made real (the π face's DOM). A multi-cell
 *      cage prints its operator glyph; a singleton prints a bare given number.
 *   3. The cage wire codec round-trips every operator kind losslessly.
 *   4. This unit test is the knip anchor that keeps the whole kenken subtree (game →
 *      useKenken → useSolver → protocol/worker/furniture) non-orphan until W12 wires the
 *      `GAMES[]` registry row.
 */
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import type { GameDefinition } from "@games/registry";
import { kenkenGame } from "./game";
import KenKenCage from "./KenKenCage/KenKenCage.vue";
import type { KenKenCage as KenKenCageClue } from "./types";
import { encodeCages, decodeCages } from "./solver/kenkenWire";

// The explicit annotation pins that the real game satisfies the contract with TClue =
// KenKenCage[] — a fifth clue kind beyond Sudoku's `void`, Futoshiki's `Inequality[]`,
// Thermo's `ThermoLine[]`, and Killer's `KillerCage[]`.
const _typecheck: GameDefinition<
  ReturnType<(typeof kenkenGame)["model"]>,
  (typeof kenkenGame)["cellFurniture"],
  KenKenCageClue[]
> = kenkenGame;
void _typecheck;

describe("KenKen game contract (T4-W13)", () => {
  it("declares the operator-cage clue furniture as a component slot, never a boolean", () => {
    expect(kenkenGame.clueFurniture).not.toBeNull();
    expect(typeof kenkenGame.model).toBe("function");
    expect(typeof kenkenGame.solverPayloads).toBe("function");
  });

  it("exposes a boardSize + difficulty section over the live model", () => {
    const sections = kenkenGame.options(kenkenGame.model());
    expect(sections.map((s) => s.key)).toEqual(["boardSize", "difficulty"]);
  });

  it("threads every operator cage kind through the wire codec losslessly", () => {
    const cages: KenKenCageClue[] = [
      { op: "+", target: 6, cells: [0, 1, 2] },
      { op: "-", target: 3, cells: [5, 6] },
      { op: "×", target: 24, cells: [10, 11, 12] },
      { op: "÷", target: 2, cells: [20, 21] },
    ];
    expect(decodeCages(encodeCages(cages))).toEqual(cages);
  });
});

describe("KenKenCage furniture render (the π face)", () => {
  it("draws a dotted boundary + a target-with-operator per cage on the boxless grid", () => {
    const cages: KenKenCageClue[] = [
      { op: "×", target: 12, cells: [0, 1, 4] }, // an L-shape on a 4×4
      { op: "-", target: 3, cells: [2, 3] },
    ];
    const wrapper = mount(KenKenCage, { props: { cages, boardSize: 4 } });

    // One <g> per cage, each with a dashed boundary path and a target <text>.
    const groups = wrapper.findAll("g.kenken-cage");
    expect(groups.length).toBe(2);

    const boundaries = wrapper.findAll("path.kenken-cage-boundary");
    expect(boundaries.length).toBe(2);
    for (const p of boundaries) {
      expect(p.attributes("stroke-dasharray")).toBeTruthy();
      expect(p.attributes("d")).toBeTruthy();
    }

    // The targets print WITH their operator glyph — "12×" and "3−".
    const labels = wrapper.findAll("text.kenken-cage-target").map((t) => t.text());
    expect(labels).toEqual(["12×", "3-"]);

    // Decorative to AT — the whole overlay is aria-hidden.
    expect(wrapper.get("svg").attributes("aria-hidden")).toBe("true");
  });

  it("prints a bare number (no operator) for a singleton given cage", () => {
    const cages: KenKenCageClue[] = [{ op: "+", target: 4, cells: [0] }];
    const wrapper = mount(KenKenCage, { props: { cages, boardSize: 4 } });
    const labels = wrapper.findAll("text.kenken-cage-target").map((t) => t.text());
    expect(labels).toEqual(["4"]);
  });

  it("renders nothing for an empty cage set", () => {
    const wrapper = mount(KenKenCage, { props: { cages: [], boardSize: 6 } });
    expect(wrapper.findAll("g.kenken-cage").length).toBe(0);
  });
});
