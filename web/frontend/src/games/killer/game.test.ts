/**
 * Killer-Sudoku contract acceptance + furniture render (T4-W13, ROW 3) — the FE half of the
 * `CageSum` consumer.
 *
 * Three claims:
 *   1. The REAL `killerGame` satisfies `GameDefinition` with a NOVEL clue type
 *      (`KillerCage[]`) and ZERO shell edits — the `defineGame<…, KillerCage[]>(…)`
 *      type-checking IS that proof; the runtime asserts below exercise the furniture slots.
 *   2. The cage furniture (`KillerCage.vue`) renders dotted boundaries + a corner sum from a
 *      cage set — the pencil idiom made real (the π face's DOM).
 *   3. This unit test is the knip anchor that keeps the whole killer subtree (game →
 *      useKiller → useSolver → protocol/worker/furniture) non-orphan until W12 wires the
 *      `GAMES[]` registry row.
 */
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import type { GameDefinition } from "@games/registry";
import { killerGame } from "./game";
import KillerCage from "./KillerCage/KillerCage.vue";
import type { KillerCage as KillerCageClue } from "./types";
import { encodeCages, decodeCages } from "./solver/killerWire";

// The explicit annotation pins that the real game satisfies the contract with TClue =
// KillerCage[] — a fourth clue kind beyond Sudoku's `void`, Futoshiki's `Inequality[]`, and
// Thermo's `ThermoLine[]`.
const _typecheck: GameDefinition<
  ReturnType<(typeof killerGame)["model"]>,
  (typeof killerGame)["cellFurniture"],
  KillerCageClue[]
> = killerGame;
void _typecheck;

describe("Killer-Sudoku game contract (T4-W13)", () => {
  it("declares the dotted-cage clue furniture as a component slot, never a boolean", () => {
    expect(killerGame.clueFurniture).not.toBeNull();
    expect(typeof killerGame.model).toBe("function");
    expect(typeof killerGame.solverPayloads).toBe("function");
  });

  it("exposes a size + difficulty section over the live model", () => {
    const sections = killerGame.options(killerGame.model());
    expect(sections.map((s) => s.key)).toEqual(["size", "difficulty"]);
  });

  it("threads cage clues through the wire codec losslessly", () => {
    const cages: KillerCageClue[] = [
      { sum: 6, cells: [0, 1, 2] },
      { sum: 17, cells: [30, 39] },
    ];
    expect(decodeCages(encodeCages(cages))).toEqual(cages);
  });
});

describe("KillerCage furniture render (the π face)", () => {
  it("draws a dotted boundary + a corner sum per cage", () => {
    const cages: KillerCageClue[] = [
      { sum: 6, cells: [0, 1, 2] }, // top row of a 4×4
      { sum: 9, cells: [4, 5, 8] }, // an L-shape
    ];
    const wrapper = mount(KillerCage, { props: { cages, boardSize: 4 } });

    // One <g> per cage, each with a dashed boundary path and a sum <text>.
    const groups = wrapper.findAll("g.killer-cage");
    expect(groups.length).toBe(2);

    const boundaries = wrapper.findAll("path.killer-cage-boundary");
    expect(boundaries.length).toBe(2);
    // The boundary is DOTTED (a dasharray) and non-empty.
    for (const p of boundaries) {
      expect(p.attributes("stroke-dasharray")).toBeTruthy();
      expect(p.attributes("d")).toBeTruthy();
    }

    // The sums print — 6 and 9, in the cages' corner cells.
    const sums = wrapper.findAll("text.killer-cage-sum").map((t) => t.text());
    expect(sums).toEqual(["6", "9"]);

    // Decorative to AT — the whole overlay is aria-hidden.
    expect(wrapper.get("svg").attributes("aria-hidden")).toBe("true");
  });

  it("renders nothing for an empty cage set", () => {
    const wrapper = mount(KillerCage, { props: { cages: [], boardSize: 9 } });
    expect(wrapper.findAll("g.killer-cage").length).toBe(0);
  });
});
