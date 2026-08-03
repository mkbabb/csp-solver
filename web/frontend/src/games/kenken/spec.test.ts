/**
 * KenKen's `GameSpec` acceptance + the operator-cage furniture's π face (T5-W2 F2) — the
 * successor to `game.test.ts`, re-derived through the contract that replaced `GameDefinition`.
 *
 * The old file's `GameDefinition<…, KenKenCage[]>` type assertion is gone because it moved to
 * the DECLARATION: `defineGame` constrains `TModel extends GameModel`, so a kenken model that
 * failed the shell's read contract could not have been written in the first place. What
 * survives here is what a type cannot say —
 *   1. every slot the shell reads is present and of the kind the shell reads it as, and the
 *      Latin grammar's four fields carry what `KenKenBoard` used to print;
 *   2. the CLUE SEAM, live: the same `props` mapping the host hands `CageOverlay` draws the
 *      dotted boundaries and the operator targets (`game.test.ts` called `cageFigures`
 *      directly and so proved one link short of the seam);
 *   3. the seam's codec is kenken's real wire codec, round-tripping every operator kind;
 *   4. the board's key on disk has ONE source — the codec that owns it.
 */
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { kenkenSpec } from "./spec";
import { persistence } from "./composables/useKenken";
import CageOverlay from "@games/shared/CageOverlay.vue";
import type { KenKenCage } from "./types";

/**
 * Mount the clue layer THE WAY THE BOARD DOES — `spec.clues.overlay` with `spec.clues.props`
 * bound over it, both read off the seam, neither named concretely. `BoardHost` renders
 * `<component :is="spec.clues.overlay" v-bind="clueProps" />`, so the erased pair IS the
 * contract; naming `CageOverlay` here and hand-building its props would prove a component
 * renders, not that KENKEN'S SEAM draws a cage.
 */
function mountClueLayer(cages: KenKenCage[], dim: number) {
  const seam = kenkenSpec.clues!;
  return mount(seam.overlay, { props: seam.props(cages, dim) });
}

describe("KenKen's GameSpec (T5-W2 F2 — the migrated contract)", () => {
  it("fills every slot the shell reads at mount", () => {
    expect(kenkenSpec.id).toBe("kenken");
    expect(typeof kenkenSpec.model).toBe("function");
    expect(kenkenSpec.furniture.cell).toBeTruthy();
    expect(typeof kenkenSpec.solver.nodeBudget).toBe("function");
    // `solver` is back to the charter's `{ nodeBudget }`: F1's `prewarm` amendment
    // discharged at F3, when one Worker left one warm for the shell to perform.
    expect(Object.keys(kenkenSpec.solver)).toEqual(["nodeBudget"]);
  });

  it("declares the BOXLESS Latin grammar, and the two marginalia clauses it does not carry", () => {
    expect(kenkenSpec.grammar.geometry).toBe("latin");
    expect(kenkenSpec.grammar.noun).toBe("kenken board");
    // `KenKenBoard`'s grid label named no difficulty word and its margin carried no request
    // clause — the same axis, false on both counts.
    expect(kenkenSpec.grammar.requestVoice).toBe(false);
  });

  it("declares the operator-cage clue seam as furniture + a codec, never a boolean", () => {
    expect(kenkenSpec.clues).not.toBeNull();
    expect(kenkenSpec.clues!.overlay).toBe(CageOverlay);
    expect(typeof kenkenSpec.clues!.props).toBe("function");
    expect(typeof kenkenSpec.clues!.encode).toBe("function");
    expect(typeof kenkenSpec.clues!.decode).toBe("function");
  });

  it("exposes a boardSize + difficulty section over the live model", () => {
    const sections = kenkenSpec.deal.options(kenkenSpec.model());
    expect(sections.map((s) => s.key)).toEqual(["boardSize", "difficulty"]);
    // The bands the drawer renders are the bands the card stages from — one vocabulary.
    expect(sections[0].options).toBe(kenkenSpec.deal.sizes);
    expect(sections[1].options).toBe(kenkenSpec.deal.difficulty);
  });

  it("names its board on disk once — the codec's own key", () => {
    expect(kenkenSpec.urlCodec.key).toBe(persistence.key);
    expect(kenkenSpec.urlCodec.key).toBe("kenken-board-v1");
  });

  it("scales the node budget off the RAW selector size (a Latin side is the raw value)", () => {
    expect(kenkenSpec.solver.nodeBudget(4)).toBe(2_000_000);
    expect(kenkenSpec.solver.nodeBudget(6)).toBe(10_000_000);
    expect(kenkenSpec.solver.nodeBudget(99)).toBe(4_000_000);
  });
});

describe("the operator-cage clue seam, drawn (the π face)", () => {
  it("draws a dotted boundary + a target-with-operator per cage, through the seam's own props", () => {
    const cages: KenKenCage[] = [
      { op: "×", target: 12, cells: [0, 1, 4] }, // an L-shape on a 4×4
      { op: "-", target: 3, cells: [2, 3] },
    ];
    const wrapper = mountClueLayer(cages, 4);

    // One <g> per cage, each with a dashed boundary path and a target <text>.
    expect(wrapper.findAll("g.kenken-cage").length).toBe(2);

    const boundaries = wrapper.findAll("path.kenken-cage-boundary");
    expect(boundaries.length).toBe(2);
    // The boundary is DOTTED (a dasharray) and non-empty.
    for (const p of boundaries) {
      expect(p.attributes("stroke-dasharray")).toBeTruthy();
      expect(p.attributes("d")).toBeTruthy();
    }

    // The targets print WITH their operator glyph — "12×" and "3−".
    expect(wrapper.findAll("text.kenken-cage-label").map((t) => t.text())).toEqual([
      "12×",
      "3-",
    ]);

    // Decorative to AT — the whole overlay is aria-hidden.
    expect(wrapper.get("svg").attributes("aria-hidden")).toBe("true");
  });

  it("prints a bare number (no operator) for a singleton given cage", () => {
    const cages: KenKenCage[] = [{ op: "+", target: 4, cells: [0] }];
    const wrapper = mountClueLayer(cages, 4);
    expect(wrapper.findAll("text.kenken-cage-label").map((t) => t.text())).toEqual([
      "4",
    ]);
  });

  it("renders nothing for an empty cage set", () => {
    const wrapper = mountClueLayer([], 6);
    expect(wrapper.findAll("g.kenken-cage").length).toBe(0);
  });

  it("threads every operator cage kind through the seam's own wire codec losslessly", () => {
    const cages: KenKenCage[] = [
      { op: "+", target: 6, cells: [0, 1, 2] },
      { op: "-", target: 3, cells: [5, 6] },
      { op: "×", target: 24, cells: [10, 11, 12] },
      { op: "÷", target: 2, cells: [20, 21] },
    ];
    const seam = kenkenSpec.clues!;
    expect(seam.decode(seam.encode(cages), 6)).toEqual(cages);
  });
});
