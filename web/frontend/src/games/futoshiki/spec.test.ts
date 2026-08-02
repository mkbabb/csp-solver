/**
 * Futoshiki's `GameSpec` acceptance (T5-W2 2.1b) — the LATIN family's row.
 *
 * The twin of `sudoku/spec.test.ts`, and the same assertion classes thermo/killer/kenken
 * carry. Futoshiki is where `geometry: "latin"` is pinned against a board that genuinely has
 * no box band, and where the two render facts that CORRELATE with geometry but are not it —
 * `requestVoice`, `gradeHint` — are asserted false, which is the whole reason `BoardGrammar`
 * is a flat record rather than a tagged union.
 */
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { futoshikiSpec } from "./spec";
import CaretOverlay from "./CaretOverlay.vue";
import DigitCell from "@games/shared/DigitCell.vue";
import { caretFigures, encodeInequalities, decodeInequalities } from "./clue";
import { nodeBudgetForSize, persistence } from "./composables/useFutoshiki";
import type { Inequality } from "./types";

describe("futoshiki — the eight slots (T5-W2 §1)", () => {
  it("declares the LATIN grammar with futoshiki's OWN render facts", () => {
    expect(futoshikiSpec.id).toBe("futoshiki");
    expect(futoshikiSpec.grammar).toEqual({
      geometry: "latin",
      noun: "futoshiki board",
      // The margin carries the MEASURED signature only, and the board keeps no idle whisper —
      // two render facts that travel with the geometry without being it.
      requestVoice: false,
      gradeHint: false,
    });
  });

  it("mounts THE cell and THE model, never a per-game twin", () => {
    expect(futoshikiSpec.furniture.cell).toBe(DigitCell);
    expect(typeof futoshikiSpec.model).toBe("function");
  });

  it("names the ONE node-budget table and the ONE board key", () => {
    expect(futoshikiSpec.solver.nodeBudget).toBe(nodeBudgetForSize);
    expect(futoshikiSpec.solver.nodeBudget(5)).toBe(4_000_000);
    expect(Object.keys(futoshikiSpec.solver)).toEqual(["nodeBudget"]);
    expect(futoshikiSpec.urlCodec.key).toBe(persistence.key);
    expect(futoshikiSpec.urlCodec.key).toBe("futoshiki-board-state");
  });

  it("deals off the latin size band and the ONE difficulty band", () => {
    expect(futoshikiSpec.deal.sizes.map((o) => o.label)).toEqual([
      "4×4",
      "5×5",
      "6×6",
      "7×7",
    ]);
    expect(futoshikiSpec.deal.difficulty.map((o) => o.value)).toEqual([
      "EASY",
      "MEDIUM",
      "HARD",
    ]);
  });

  it("builds a board-size + difficulty section over the LIVE model", () => {
    const sections = futoshikiSpec.deal.options(futoshikiSpec.model());
    expect(sections.map((s) => s.key)).toEqual(["boardSize", "difficulty"]);
  });
});

// The inequality furniture is futoshiki's whole divergence from a plain Latin square, so the
// seam carries its own suite — each member asserted against the module the board, the poster
// and the Worker already use.
describe("futoshiki — the clue seam (the ONE divergence)", () => {
  const inequalities: Inequality[] = [
    [1, 0],
    [5, 0],
  ];

  it("carries the seam whole — never a boolean, never a partial", () => {
    const clues = futoshikiSpec.clues!;
    expect(clues).not.toBeNull();
    expect(clues.overlay).toBe(CaretOverlay);
    expect(clues.encode).toBe(encodeInequalities);
    expect(clues.decode).toBe(decodeInequalities);
  });

  it("props the overlay with exactly what the overlay declares", () => {
    expect(futoshikiSpec.clues!.props(inequalities, 5)).toEqual({
      carets: caretFigures(inequalities, 5),
      boardSize: 5,
    });
  });

  it("the seam's props RENDER through the overlay it declares — one caret per pair", () => {
    const w = mount(futoshikiSpec.clues!.overlay, {
      props: futoshikiSpec.clues!.props(inequalities, 5),
    });
    expect(w.find("div.caret-layer").exists()).toBe(true);
    expect(w.findAll(".futoshiki-caret")).toHaveLength(2);
    // Decorative: the constraint is read on BOTH endpoints by the cells' own labelling.
    expect(w.get("div.caret-layer").attributes("aria-hidden")).toBe("true");
  });
});
