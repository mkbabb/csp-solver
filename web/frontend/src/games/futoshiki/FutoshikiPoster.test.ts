import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PosterBoard from "@games/shared/PosterBoard.vue";
import FutoshikiPoster from "./FutoshikiPoster.vue";
import type { PreviewBoard } from "@games/shared/useStagingBridge";

/**
 * THE STILL'S OWN GUARD — `FutoshikiPoster`'s `pairsFor`, row by refusal (T9-W5).
 *
 * `src/games/posters.test.ts` gates the deck's shared property across all five families: a saved
 * board renders itself, a bad clue falls back whole. It carries ONE futoshiki refusal (a
 * non-adjacent pair) because it speaks for five games at once. This file is the family's own,
 * and its subject is the guard's remaining arms — the ones a crafted `?board=` link actually
 * reaches for.
 *
 * The guard is the strictest of the five for the reason the component's own header gives: an
 * unchecked pair set renders one floating caret per pair and freezes the main thread, and a
 * non-adjacent pair draws a caret on an edge that does not exist. Every arm below refuses to the
 * CANNED face whole, never to the saved digits under canned carets.
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

const mountWith = (saved: Record<string, unknown>, size = 4, values = {}) =>
  mount(FutoshikiPoster, {
    props: { preview: preview({ size, values, saved }) },
    global: { stubs },
  });

const digits = (w: ReturnType<typeof mountWith>) =>
  w.findAll(".poster-cell .g").map((g) => g.attributes("data-v"));

const caretGlyphs = (w: ReturnType<typeof mountWith>) =>
  w.findAll(".poster-caret .g").map((g) => g.attributes("data-v"));

// The canned 5×5 worksheet, as the component ships it: five givens at 2/6/12/18/22 and the six
// printed pairs. Naming the face here is what makes "fell back WHOLE" an assertion.
const CANNED_SIDE = 5;
const CANNED_DIGITS = ["5", "2", "4", "1", "3"];
const CANNED_CARETS = 6;

/** Every orthogonally adjacent pair of an n×n board, each edge once — `2·n·(n−1)` of them,
 *  which is the exact bound the guard enforces. */
const allEdges = (n: number): [number, number][] => {
  const out: [number, number][] = [];
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      const p = r * n + c;
      if (c + 1 < n) out.push([p, p + 1]);
      if (r + 1 < n) out.push([p, p + n]);
    }
  return out;
};

describe("FutoshikiPoster — no true board to show, so the canned worksheet", () => {
  it("a card nobody has played renders the canned 5×5, carets and all", () => {
    const w = mount(FutoshikiPoster, { global: { stubs } });
    expect(w.getComponent(PosterBoard).props("boardSize")).toBe(CANNED_SIDE);
    expect(w.getComponent(PosterBoard).props("subgridSize")).toBe(CANNED_SIDE);
    // No given set at all — PosterBoard reads that as "every digit is a given", which is what
    // an example worksheet is. A canned face has no authorship to hand down either.
    expect(w.getComponent(PosterBoard).props("givens")).toBeUndefined();
    expect(w.getComponent(PosterBoard).props("authorInk")).toBeUndefined();
    expect(digits(w)).toEqual(CANNED_DIGITS);
    expect(caretGlyphs(w)).toHaveLength(CANNED_CARETS);
  });

  it("a size off the 4/5/6/7 band is refused before its clue is even read", () => {
    // 3 is a legal raw selector value in the BOXED families (sudoku's 3 is a 9×9). Latin
    // geometry reads the raw value as the side itself, so a 3 here is a board this game cannot
    // deal, and its digits would land in a grid drawn at the wrong size.
    const w = mountWith({ inequalities: [[0, 1]] }, 3, { "0": 9 });
    expect(w.getComponent(PosterBoard).props("boardSize")).toBe(CANNED_SIDE);
    expect(digits(w)).toEqual(CANNED_DIGITS); // not the saved 9
  });
});

describe("FutoshikiPoster — the pair guard, arm by arm", () => {
  it("a saved board with no inequality furniture is not a futoshiki board", () => {
    // Two shapes that both reach the guard as "not an array": the field absent (another
    // family's blob), and the pre-T5 wire spelling `1-0,5-0`, which is a string.
    for (const saved of [{}, { inequalities: "0-1,5-0" }]) {
      const w = mountWith(saved, 4, { "0": 3 });
      expect(w.getComponent(PosterBoard).props("boardSize")).toBe(CANNED_SIDE);
      expect(digits(w)).toEqual(CANNED_DIGITS);
    }
  });

  it("refuses on COUNT alone once the set exceeds 2·n·(n−1)", () => {
    // AT the bound: all 24 edges of a 4×4, every one of them legal, and all 24 print.
    const edges = allEdges(4);
    expect(edges).toHaveLength(2 * 4 * 3);
    const atBound = mountWith({ inequalities: edges }, 4);
    expect(atBound.getComponent(PosterBoard).props("boardSize")).toBe(4);
    expect(caretGlyphs(atBound)).toHaveLength(24);

    // ONE over it, and the extra entry is itself a perfectly well-formed pair (the first edge
    // read the other way). Nothing about any single pair is wrong here — the count is, and the
    // count is checked before a single pair is walked. That ordering IS the freeze guard: a
    // crafted 100k-pair link must cost a length read, not 100k adjacency tests.
    const over = mountWith({ inequalities: [...edges, [edges[0][1], edges[0][0]]] }, 4);
    expect(over.getComponent(PosterBoard).props("boardSize")).toBe(CANNED_SIDE);
    expect(caretGlyphs(over)).toHaveLength(CANNED_CARETS);
  });

  it("refuses anything that is not a two-cell pair", () => {
    // A triple has no shared edge to sit on; a bare number is not a pair at all.
    for (const inequalities of [[[0, 1, 2]], [0, 1], [[0]]]) {
      const w = mountWith({ inequalities }, 4);
      expect(w.getComponent(PosterBoard).props("boardSize")).toBe(CANNED_SIDE);
      expect(caretGlyphs(w)).toHaveLength(CANNED_CARETS);
    }
  });

  it("refuses an endpoint that is not a cell of THIS board", () => {
    // 99 is off a 4×4 entirely; 1.5 is between two cells. Both would place a caret against an
    // edge the grid never drew — the caret math has no answer for either.
    for (const pair of [
      [0, 99],
      [0, 1.5],
      [-1, 0],
    ]) {
      const w = mountWith({ inequalities: [pair] }, 4);
      expect(w.getComponent(PosterBoard).props("boardSize")).toBe(CANNED_SIDE);
      expect(caretGlyphs(w)).toHaveLength(CANNED_CARETS);
    }
  });

  it("claims an EDGE, not a direction — one caret per edge, whichever way it is written", () => {
    // The pair's order is the constraint's direction: `[0,1]` prints `>`, `[1,0]` prints `<`,
    // and both mark the same boundary. So the dedupe key is written smaller-first: an edge is
    // claimed at most once however the pair was spelled.
    expect(caretGlyphs(mountWith({ inequalities: [[0, 1]] }, 4))).toEqual([">"]);
    expect(caretGlyphs(mountWith({ inequalities: [[1, 0]] }, 4))).toEqual(["<"]);

    // Both at once is one edge asked to carry two carets saying opposite things. Refused, and
    // the still falls back whole rather than printing the first and dropping the second.
    const both = mountWith(
      {
        inequalities: [
          [0, 1],
          [1, 0],
        ],
      },
      4,
    );
    expect(both.getComponent(PosterBoard).props("boardSize")).toBe(CANNED_SIDE);
    expect(caretGlyphs(both)).toHaveLength(CANNED_CARETS);
  });
});
