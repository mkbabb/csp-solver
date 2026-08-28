import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PosterBoard from "@games/shared/PosterBoard.vue";
import KillerPoster from "./KillerPoster.vue";
import type { PreviewBoard } from "@games/shared/useStagingBridge";

/**
 * THE STILL'S OWN GUARD — `KillerPoster`'s `cagesFor` and its size band (T9-W5).
 *
 * `src/games/posters.test.ts` speaks for five families at once and carries Killer's ONE cage
 * refusal (a cell off the board). This file is the family's own, and its subject is the two arms
 * that decide whether a saved board is shown AT ALL: the raw selector value has to be one this
 * game deals, and the saved blob has to carry cage furniture.
 *
 * Both refusals go to the canned face WHOLE. Real digits under canned cages is a picture of no
 * puzzle at all — the component's own header says so, and these rows are what hold it to it.
 */

const preview = (p: Partial<PreviewBoard> & { size: number }): PreviewBoard => ({
  difficulty: "EASY",
  values: {},
  givenCells: [],
  saved: {},
  ...p,
});

/** The glyph is stubbed to a marker carrying only the props under test — the pencil chain has
 *  nothing to say about which board a poster chose, and mounting it drags the boil in. */
const glyphStub = {
  props: ["value", "isGiven", "isOverridden"],
  template: `<i class="g" :data-v="value" :data-given="String(isGiven)" :data-mark="String(isOverridden)" />`,
};

const stubs = { HandwrittenGlyph: glyphStub };

const mountWith = (size: number, saved: Record<string, unknown>, values = {}) =>
  mount(KillerPoster, {
    props: { preview: preview({ size, values, saved }) },
    global: { stubs },
  });

const digits = (w: ReturnType<typeof mountWith>) =>
  w.findAll(".poster-cell .g").map((g) => g.attributes("data-v"));

const cageLabels = (w: ReturnType<typeof mountWith>) =>
  w.findAll("g.killer-cage .killer-cage-label").map((t) => t.text());

// The canned 9×9 worksheet, as the component ships it: three givens at 20/40/60 and eight
// printed cages. Naming the face here is what makes "fell back WHOLE" an assertion.
const CANNED_SIDE = 9;
const CANNED_DIGITS = ["8", "5", "2"];
const CANNED_SUMS = ["15", "8", "17", "9", "12", "20", "14", "7"];

describe("KillerPoster — no true board to show, so the canned worksheet", () => {
  it("a card nobody has played renders the canned 9×9 in 3×3 bands, cages and all", () => {
    const w = mount(KillerPoster, { global: { stubs } });
    const board = w.getComponent(PosterBoard);
    expect(board.props("boardSize")).toBe(CANNED_SIDE);
    expect(board.props("subgridSize")).toBe(3);
    // No given set at all — PosterBoard reads that as "every digit is a given", which is what
    // an example worksheet is. A canned face has no authorship to hand down either.
    expect(board.props("givens")).toBeUndefined();
    expect(board.props("authorInk")).toBeUndefined();
    expect(digits(w)).toEqual(CANNED_DIGITS);
    expect(cageLabels(w)).toEqual(CANNED_SUMS);
  });

  it("a size off the 2/3/4 band is refused before its cages are even read", () => {
    // Killer's raw selector value is the sub-grid ROOT: 3 is the 9×9 it deals, and 5 would be a
    // 25×25 board it has no rung for. Its digits would otherwise land in a grid drawn at the
    // wrong size, under the wrong cages.
    const w = mountWith(5, { cages: [{ sum: 6, cells: [0, 1] }] }, { "0": 7 });
    expect(w.getComponent(PosterBoard).props("boardSize")).toBe(CANNED_SIDE);
    expect(digits(w)).toEqual(CANNED_DIGITS); // not the saved 7
    expect(cageLabels(w)).toEqual(CANNED_SUMS); // not the saved 6
  });
});

describe("KillerPoster — the cage guard", () => {
  it("a saved board with no cage furniture is not a killer board", () => {
    // Three shapes that all reach the guard as "not an array": the field absent (another
    // family's blob), a single cage handed over unwrapped, and a `null` that survived a decode.
    for (const saved of [{}, { cages: { sum: 6, cells: [0, 1] } }, { cages: null }]) {
      const w = mountWith(2, saved, { "0": 3 });
      // A 4×4's digits under a 9×9's cages would be the exact half-and-half the fallback
      // exists to prevent, so the size goes back too.
      expect(w.getComponent(PosterBoard).props("boardSize")).toBe(CANNED_SIDE);
      expect(digits(w)).toEqual(CANNED_DIGITS);
      expect(cageLabels(w)).toEqual(CANNED_SUMS);
    }
  });

  it("a board this game DOES deal, with cages it can draw, is shown as saved", () => {
    // The negative control for both rows above: same mount path, nothing refused.
    const w = mountWith(
      2,
      {
        cages: [
          { sum: 6, cells: [0, 1] },
          { sum: 9, cells: [2] },
        ],
      },
      { "0": 3 },
    );
    expect(w.getComponent(PosterBoard).props("boardSize")).toBe(4);
    expect(w.getComponent(PosterBoard).props("subgridSize")).toBe(2);
    expect(digits(w)).toEqual(["3"]);
    expect(cageLabels(w)).toEqual(["6", "9"]);
  });
});
