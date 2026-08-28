import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PosterBoard from "@games/shared/PosterBoard.vue";
import KenKenPoster from "./KenKenPoster.vue";
import type { PreviewBoard } from "@games/shared/useStagingBridge";

/**
 * THE STILL'S OWN GUARD — `KenKenPoster`'s `cagesFor` and its size band (T9-W5).
 *
 * `src/games/posters.test.ts` speaks for five families at once and carries KenKen's ONE cage
 * refusal (an operator outside the four). This file is the family's own, and its subject is the
 * two arms that decide whether a saved board is shown AT ALL: the raw selector value has to be
 * one this game deals, and the saved blob has to carry cage furniture.
 *
 * KenKen prints no givens, so its true still is nothing but the reader's own handwriting — which
 * is exactly why a half-refused still would be the worst of the five: the digits are the user's
 * work, and showing them inside a canned partition would attribute that work to a puzzle they
 * never touched.
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
  mount(KenKenPoster, {
    props: { preview: preview({ size, values, saved }) },
    global: { stubs },
  });

const digits = (w: ReturnType<typeof mountWith>) =>
  w.findAll(".poster-cell .g").map((g) => g.attributes("data-v"));

const cageLabels = (w: ReturnType<typeof mountWith>) =>
  w.findAll("g.kenken-cage .kenken-cage-label").map((t) => t.text());

// The canned 6×6 worksheet, as the component ships it: a full 17-cage partition, no digits at
// all. Naming the face here is what makes "fell back WHOLE" an assertion.
const CANNED_SIDE = 6;
const CANNED_TARGETS = [
  "12×",
  "9+",
  "3-",
  "2÷",
  "8+",
  "20×",
  "1-",
  "11+",
  "3",
  "30×",
  "3÷",
  "2-",
  "8×",
  "7+",
  "4-",
  "15+",
  "12+",
];

describe("KenKenPoster — no true board to show, so the canned worksheet", () => {
  it("a card nobody has played renders the canned, BOXLESS 6×6 with its full partition", () => {
    const w = mount(KenKenPoster, { global: { stubs } });
    const board = w.getComponent(PosterBoard);
    expect(board.props("boardSize")).toBe(CANNED_SIDE);
    // Latin geometry: subgrid = board side, so the grid draws no interior box lines.
    expect(board.props("subgridSize")).toBe(CANNED_SIDE);
    expect(board.props("givens")).toBeUndefined();
    expect(board.props("authorInk")).toBeUndefined();
    // The one canned face in the deck with nothing written on it — KenKen prints no givens,
    // and an unplayed card has no marks either.
    expect(digits(w)).toEqual([]);
    expect(cageLabels(w)).toEqual(CANNED_TARGETS);
  });

  it("a size off the 4/5/6 band is refused before its cages are even read", () => {
    // 3 is a legal raw value in the BOXED families (sudoku's 3 is a 9×9). Caged-latin geometry
    // reads the raw value as the side itself, and this game has no 3×3 rung.
    const w = mountWith(
      3,
      { cages: [{ op: "+", target: 3, cells: [0, 1] }] },
      { "0": 2 },
    );
    expect(w.getComponent(PosterBoard).props("boardSize")).toBe(CANNED_SIDE);
    expect(digits(w)).toEqual([]); // not the saved 2
    expect(cageLabels(w)).toEqual(CANNED_TARGETS);
  });
});

describe("KenKenPoster — the cage guard", () => {
  it("a saved board with no cage furniture is not a kenken board", () => {
    // Three shapes that all reach the guard as "not an array": the field absent (another
    // family's blob), a single cage handed over unwrapped, and a `null` that survived a decode.
    for (const saved of [
      {},
      { cages: { op: "+", target: 3, cells: [0, 1] } },
      { cages: null },
    ]) {
      const w = mountWith(4, saved, { "0": 2 });
      expect(w.getComponent(PosterBoard).props("boardSize")).toBe(CANNED_SIDE);
      // The user's own digit is NOT drawn into the canned partition — the still goes back
      // whole, which on this game means back to an empty worksheet.
      expect(digits(w)).toEqual([]);
      expect(cageLabels(w)).toEqual(CANNED_TARGETS);
    }
  });

  it("a board this game DOES deal, with cages it can draw, is shown as saved", () => {
    // The negative control for both rows above: same mount path, nothing refused. Every digit
    // on a KenKen still is a mark, never a given — the family prints none.
    const w = mountWith(
      4,
      {
        cages: [
          { op: "×", target: 12, cells: [0, 1] },
          { op: "+", target: 3, cells: [2] },
        ],
      },
      { "0": 3 },
    );
    expect(w.getComponent(PosterBoard).props("boardSize")).toBe(4);
    expect(digits(w)).toEqual(["3"]);
    // A singleton cage prints its target bare — no operator to speak of.
    expect(cageLabels(w)).toEqual(["12×", "3"]);
  });
});
