/**
 * Killer's `GameSpec` acceptance + the cage furniture's π face (T5-W2 F2) — the successor to
 * `game.test.ts`, re-derived through the contract that replaced `GameDefinition`.
 *
 * The old file's type assertion is gone because it moved to the DECLARATION: `defineGame`
 * constrains `TModel extends GameModel`, so a killer model that failed the shell's read
 * contract could not have been written. What survives here is what a type cannot say —
 *   1. every slot the shell reads is present and of the kind the shell reads it as;
 *   2. the CLUE SEAM, live: the same `props` mapping the board hands `CageOverlay` draws the
 *      dotted boundaries and the corner sums (game.test.ts called `cageFigures` directly and
 *      so proved one link short of the seam);
 *   3. the seam's codec is killer's real wire codec, round-tripping losslessly;
 *   4. the board's key on disk has ONE source — the codec that owns it.
 */
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { killerSpec } from "./spec";
import { STORAGE_KEY } from "./composables/killerUrlState";
import CageOverlay from "@games/shared/CageOverlay.vue";
import type { KillerCage } from "./types";

/**
 * Mount the clue layer THE WAY THE BOARD DOES — `spec.clues.overlay` with `spec.clues.props`
 * bound over it, both read off the seam, neither named concretely. `BoardHost` renders
 * `<component :is="spec.clues.overlay" v-bind="clueProps" />`, so the erased pair is the real
 * contract; naming `CageOverlay` here and hand-building its props would prove a component
 * renders, not that KILLER'S SEAM draws a cage.
 */
function mountClueLayer(cages: KillerCage[], dim: number) {
  const seam = killerSpec.clues!;
  return mount(seam.overlay, { props: seam.props(cages, dim) });
}

describe("Killer's GameSpec (T5-W2 F2 — the migrated contract)", () => {
  it("fills every slot the shell reads at mount", () => {
    expect(killerSpec.id).toBe("killer");
    expect(typeof killerSpec.model).toBe("function");
    expect(killerSpec.grammar.geometry).toBe("boxed");
    expect(killerSpec.grammar.noun).toBe("killer board");
    expect(killerSpec.grammar.requestVoice).toBe(true);
    expect(killerSpec.grammar.gradeHint).toBe(true);
    expect(killerSpec.furniture.cell).toBeTruthy();
    expect(typeof killerSpec.solver.nodeBudget).toBe("function");
    // `solver` is back to the charter's `{ nodeBudget }`: F1's `prewarm` amendment
    // discharged at F3, when one Worker left one warm for the shell to perform.
    expect(Object.keys(killerSpec.solver)).toEqual(["nodeBudget"]);
  });

  it("declares the dotted-cage clue seam as furniture + a codec, never a boolean", () => {
    expect(killerSpec.clues).not.toBeNull();
    expect(killerSpec.clues!.overlay).toBe(CageOverlay);
    expect(typeof killerSpec.clues!.props).toBe("function");
    expect(typeof killerSpec.clues!.encode).toBe("function");
    expect(typeof killerSpec.clues!.decode).toBe("function");
  });

  it("exposes a size + difficulty section over the live model", () => {
    const sections = killerSpec.deal.options(killerSpec.model());
    expect(sections.map((s) => s.key)).toEqual(["size", "difficulty"]);
    // The bands the drawer renders are the bands the card stages from — one vocabulary.
    expect(sections[0].options).toBe(killerSpec.deal.sizes);
    expect(sections[1].options).toBe(killerSpec.deal.difficulty);
  });

  it("names its board on disk once — the codec's own key", () => {
    expect(killerSpec.urlCodec.key).toBe(STORAGE_KEY);
    expect(killerSpec.urlCodec.key).toBe("killer-board-v1");
  });

  it("scales the node budget off the RAW selector size (the sub-grid root)", () => {
    expect(killerSpec.solver.nodeBudget(3)).toBe(2_000_000);
    expect(killerSpec.solver.nodeBudget(99)).toBe(1_000_000);
  });
});

describe("the cage clue seam, drawn (the π face)", () => {
  it("draws a dotted boundary + a corner sum per cage, through the seam's own props", () => {
    const cages: KillerCage[] = [
      { sum: 6, cells: [0, 1, 2] }, // top row of a 4×4
      { sum: 9, cells: [4, 5, 8] }, // an L-shape
    ];
    const wrapper = mountClueLayer(cages, 4);

    // One <g> per cage, each with a dashed boundary path and a sum <text>.
    expect(wrapper.findAll("g.killer-cage").length).toBe(2);

    const boundaries = wrapper.findAll("path.killer-cage-boundary");
    expect(boundaries.length).toBe(2);
    // The boundary is DOTTED (a dasharray) and non-empty.
    for (const p of boundaries) {
      expect(p.attributes("stroke-dasharray")).toBeTruthy();
      expect(p.attributes("d")).toBeTruthy();
    }

    // The sums print — 6 and 9, in the cages' corner cells.
    expect(wrapper.findAll("text.killer-cage-label").map((t) => t.text())).toEqual([
      "6",
      "9",
    ]);

    // Decorative to AT — the whole overlay is aria-hidden.
    expect(wrapper.get("svg").attributes("aria-hidden")).toBe("true");
  });

  it("renders nothing for an empty cage set", () => {
    const wrapper = mountClueLayer([], 9);
    expect(wrapper.findAll("g.killer-cage").length).toBe(0);
  });

  it("threads cage clues through the seam's own wire codec losslessly", () => {
    const cages: KillerCage[] = [
      { sum: 6, cells: [0, 1, 2] },
      { sum: 17, cells: [30, 39] },
    ];
    const seam = killerSpec.clues!;
    expect(seam.decode(seam.encode(cages), 9)).toEqual(cages);
  });
});
