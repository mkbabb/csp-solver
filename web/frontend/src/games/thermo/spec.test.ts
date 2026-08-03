/**
 * Thermo's `GameSpec` acceptance (T5-W2 F2) — the successor to `game.test.ts`.
 *
 * The retired suite proved a NOVEL clue type could satisfy `GameDefinition` with zero shell
 * edits. That claim is now structural: `defineGame<ReturnType<typeof useThermo>, ThermoLine[]>`
 * type-checks or it does not compile, and `TModel extends GameModel` moved the shell's read
 * contract onto the author. What is left to assert at runtime is what a TYPE cannot say — that
 * the eight slots carry thermo's own facts rather than sudoku's, and that the clue seam's four
 * members are the SAME modules the board and the Worker already use, not a second copy.
 *
 * The wire round-trip itself is `thermoWire.test.ts`'s claim; the retired suite duplicated it.
 * Here the seam is pinned by IDENTITY — `clues.encode === encodeThermometers` — which is the
 * stronger statement: one codec, two consumers.
 */
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { thermoSpec } from "./spec";
import ThermoTube from "./ThermoTube.vue";
import DigitCell from "@games/shared/DigitCell.vue";
import { encodeThermometers, decodeThermometers } from "./clue";
import { nodeBudgetForSize, persistence } from "./composables/useThermo";
import type { ThermoLine } from "./types";

describe("thermo — the eight slots (T5-W2 §1)", () => {
  it("declares the boxed grammar with thermo's OWN render facts", () => {
    // A Thermo-Sudoku IS a Sudoku variant — but it is not sudoku, and the noun is where the
    // grid's accessible name stops being a copy.
    expect(thermoSpec.id).toBe("thermo");
    expect(thermoSpec.grammar).toEqual({
      geometry: "boxed",
      noun: "thermo board",
      requestVoice: true,
    });
  });

  it("mounts THE cell and THE model, never a per-game twin", () => {
    expect(thermoSpec.furniture.cell).toBe(DigitCell);
    expect(typeof thermoSpec.model).toBe("function");
  });

  it("names the ONE node-budget table and the ONE board key", () => {
    // The spec NAMES what the model already reads; a mirrored literal here would be a second
    // source for a fact that has one.
    expect(thermoSpec.solver.nodeBudget).toBe(nodeBudgetForSize);
    expect(thermoSpec.solver.nodeBudget(3)).toBe(2_000_000);
    // `solver` is back to the charter's `{ nodeBudget }`: F1's `prewarm` amendment
    // discharged at F3, when one Worker left one warm for the shell to perform.
    expect(Object.keys(thermoSpec.solver)).toEqual(["nodeBudget"]);
    expect(thermoSpec.urlCodec.key).toBe(persistence.key);
    expect(thermoSpec.urlCodec.key).toBe("thermo-board-v1");
  });

  it("deals off sudoku's two selector bands (the ratified variant reuse)", () => {
    expect(thermoSpec.deal.sizes.map((o) => o.label)).toEqual(["4×4", "9×9", "16×16"]);
    expect(thermoSpec.deal.difficulty.map((o) => o.value)).toEqual([
      "EASY",
      "MEDIUM",
      "HARD",
    ]);
  });

  it("builds a size + difficulty section over the LIVE model", () => {
    const sections = thermoSpec.deal.options(thermoSpec.model());
    expect(sections.map((s) => s.key)).toEqual(["size", "difficulty"]);
  });
});

// The clue seam is thermo's whole divergence from sudoku, so it carries its own suite. `null`
// is sudoku's stated absence; thermo's is the four-member seam — and each member is asserted
// against the module the rest of the game already uses.
describe("thermo — the clue seam (the ONE divergence)", () => {
  const thermos: ThermoLine[] = [
    [0, 1, 2],
    [30, 39, 48],
  ];

  it("carries the seam whole — never a boolean, never a partial", () => {
    const clues = thermoSpec.clues!;
    expect(clues).not.toBeNull();
    expect(clues.overlay).toBe(ThermoTube);
    expect(clues.encode).toBe(encodeThermometers);
    expect(clues.decode).toBe(decodeThermometers);
  });

  it("props the overlay with exactly what the overlay declares", () => {
    expect(thermoSpec.clues!.props(thermos, 9)).toEqual({
      thermometers: thermos,
      boardSize: 9,
    });
  });

  it("the seam's props RENDER through the overlay it declares — one tube group per thermometer", () => {
    // The seam is only honest if its own output mounts its own component. Two tubes in, two
    // tube groups out, on the `#overlay`-layer SVG `BoardHost` slots directly.
    const w = mount(thermoSpec.clues!.overlay, {
      props: thermoSpec.clues!.props(thermos, 9),
    });
    expect(w.find("svg.thermo-tube-overlay").exists()).toBe(true);
    expect(w.findAll("g.thermo-tube")).toHaveLength(2);
    // Decorative: the thermometer rule is the puzzle's, read by the board's own labelling.
    expect(w.get("svg").attributes("aria-hidden")).toBe("true");
  });
});
