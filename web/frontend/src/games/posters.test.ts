import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PosterBoard from "@games/shared/PosterBoard.vue";
import SudokuPoster from "@games/sudoku/SudokuPoster.vue";
import KillerPoster from "@games/killer/KillerPoster.vue";
import KenKenPoster from "@games/kenken/KenKenPoster.vue";
import ThermoPoster from "@games/thermo/ThermoPoster.vue";
import FutoshikiPoster from "@games/futoshiki/FutoshikiPoster.vue";
import type { PreviewBoard } from "@games/shared/useStagingBridge";

/**
 * T8-W3 M12 — THE FACE IS THE BOARD, across all five families.
 *
 * A card's face shows the board actually saved in that game: its size, its digits, its own
 * furniture. These rows gate the three properties that make the picture true, and the one that
 * keeps it free:
 *
 *   1. A SAVED BOARD RENDERS ITSELF, at ITS size — the raw selector value is each family's own
 *      arithmetic (boxed `n**2`, latin `n`), and the poster is the one component that knows it.
 *   2. A GAME NEVER PLAYED RENDERS ITS CANNED FACE — an honest example of the game, and the
 *      same picture that shipped.
 *   3. A CLUE THAT DOES NOT HOLD FALLS BACK WHOLE. Real digits inside canned cages is a picture
 *      of no puzzle at all, so the still returns to the canned board entire rather than to half
 *      of each. Every guard here is a shape the permalink's own round-trip guard would refuse.
 *   4. THE SOUL GATE — every poster stays on pose 0 and enrols nothing, true or canned.
 *
 * This file lives at `src/games/` rather than `src/games/shared/` because it names all five
 * families, which the shared floor may not (`lint:boundary`, `cards.test.ts`'s own precedent).
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

const digits = (w: {
  findAll: (s: string) => { attributes: (a: string) => string | undefined }[];
}) =>
  w.findAll(".poster-cell .g").map((g) => ({
    v: g.attributes("data-v"),
    given: g.attributes("data-given") === "true",
    mark: g.attributes("data-mark") === "true",
  }));

describe("the five posters — a true still, or an honest canned one", () => {
  it("sudoku: no preview renders the canned 9×9", () => {
    const w = mount(SudokuPoster, { global: { stubs } });
    expect(w.getComponent(PosterBoard).props("boardSize")).toBe(9);
    expect(w.getComponent(PosterBoard).props("givens")).toBeUndefined();
    expect(digits(w).length).toBe(30); // the canned worksheet's own count
  });

  it("sudoku: a saved 4×4 renders AT 4×4, with its own digits and its own marks", () => {
    const w = mount(SudokuPoster, {
      props: {
        preview: preview({ size: 2, values: { "0": 1, "3": 4 }, givenCells: ["0"] }),
      },
      global: { stubs },
    });
    const board = w.getComponent(PosterBoard);
    // BOXED arithmetic, and the poster is the one component that knows it: raw 2 is a 4×4
    // board banded 2×2. A still that ignored the size would draw the saved digits into a 9×9.
    expect(board.props("boardSize")).toBe(4);
    expect(board.props("subgridSize")).toBe(2);
    expect(digits(w)).toEqual([
      { v: "1", given: true, mark: false },
      { v: "4", given: false, mark: true },
    ]);
  });

  it("sudoku: a size off the band is refused — the canned face, not a broken grid", () => {
    const w = mount(SudokuPoster, {
      props: { preview: preview({ size: 7, values: { "0": 1 } }) },
      global: { stubs },
    });
    expect(w.getComponent(PosterBoard).props("boardSize")).toBe(9);
    expect(digits(w).length).toBe(30);
  });

  it("killer: the saved board brings its OWN cages", () => {
    const cages = [
      { sum: 6, cells: [0, 1] },
      { sum: 9, cells: [2, 3] },
    ];
    const w = mount(KillerPoster, {
      props: {
        preview: preview({
          size: 2,
          values: { "0": 1 },
          givenCells: ["0"],
          saved: { cages },
        }),
      },
      global: { stubs },
    });
    expect(w.getComponent(PosterBoard).props("boardSize")).toBe(4);
    // The figures are derived by the game's own `cageFigures`, so the count is the assertion
    // that the SAVED set was the one that reached the overlay.
    expect(w.findAll(".cage-overlay path").length).toBeGreaterThan(0);
    expect(digits(w)).toEqual([{ v: "1", given: true, mark: false }]);
  });

  it("killer: a cage pointing off the board sends the WHOLE still back to canned", () => {
    const w = mount(KillerPoster, {
      props: {
        preview: preview({
          size: 2, // a 4×4 board, so cell 80 cannot exist
          values: { "0": 1 },
          saved: { cages: [{ sum: 6, cells: [0, 80] }] },
        }),
      },
      global: { stubs },
    });
    // Not the saved digits under canned cages — the canned board, whole.
    expect(w.getComponent(PosterBoard).props("boardSize")).toBe(9);
    expect(digits(w).map((d) => d.v)).toEqual(["8", "5", "2"]); // cells 20 · 40 · 60
  });

  it("kenken: an operator outside the four is refused", () => {
    const bad = mount(KenKenPoster, {
      props: {
        preview: preview({
          size: 4,
          saved: { cages: [{ op: "^", target: 3, cells: [0, 1] }] },
        }),
      },
      global: { stubs },
    });
    expect(bad.getComponent(PosterBoard).props("boardSize")).toBe(6);

    const good = mount(KenKenPoster, {
      props: {
        preview: preview({
          size: 4,
          values: { "0": 3 },
          saved: { cages: [{ op: "÷", target: 3, cells: [0, 1] }] },
        }),
      },
      global: { stubs },
    });
    expect(good.getComponent(PosterBoard).props("boardSize")).toBe(4);
    // KenKen prints no givens at all, so every digit on its still is the user's own hand.
    expect(digits(good)).toEqual([{ v: "3", given: false, mark: true }]);
  });

  it("thermo: a tube of in-range cells renders; a stray index falls back", () => {
    const ok = mount(ThermoPoster, {
      props: {
        preview: preview({ size: 2, saved: { thermometers: [[0, 1, 2]] } }),
      },
      global: { stubs },
    });
    expect(ok.getComponent(PosterBoard).props("boardSize")).toBe(4);

    const bad = mount(ThermoPoster, {
      props: {
        preview: preview({ size: 2, saved: { thermometers: [[0, 99]] } }),
      },
      global: { stubs },
    });
    expect(bad.getComponent(PosterBoard).props("boardSize")).toBe(9);
  });

  it("futoshiki: non-adjacent pairs are refused — the caret math has no answer for them", () => {
    const ok = mount(FutoshikiPoster, {
      props: {
        preview: preview({ size: 4, saved: { inequalities: [[0, 1]] } }),
      },
      global: { stubs },
    });
    expect(ok.getComponent(PosterBoard).props("boardSize")).toBe(4);
    expect(ok.findAll(".poster-caret").length).toBe(1);

    const bad = mount(FutoshikiPoster, {
      props: {
        preview: preview({ size: 4, saved: { inequalities: [[0, 3]] } }),
      },
      global: { stubs },
    });
    expect(bad.getComponent(PosterBoard).props("boardSize")).toBe(5);
    expect(bad.findAll(".poster-caret").length).toBe(6); // the canned set
  });

  /**
   * T8-R13 — the still's authorship reaches the shared floor, in all five families.
   *
   * The ink rides the preview because the preview is already the vehicle for everything only the
   * game knows how to read; the poster hands it straight through, exactly as it hands `givens`.
   * A family that forgot the pass-through would draw a peer's digits in the reading page's own
   * ink while the board under the card drew them apart, which is the defect this row is.
   */
  it("every poster hands the still's per-cell authorship down", () => {
    const authorInk = { "1": { "--color-user-ink": "oklch(0.6 0.11 137.5deg)" } };
    for (const [P, p] of [
      [SudokuPoster, preview({ size: 3, values: { "1": 4 }, authorInk })],
      [
        ThermoPoster,
        preview({ size: 3, saved: { thermometers: [[0, 1]] }, authorInk }),
      ],
      [
        KillerPoster,
        preview({ size: 3, saved: { cages: [{ sum: 3, cells: [0, 1] }] }, authorInk }),
      ],
      [KenKenPoster, preview({ size: 4, saved: { cages: [] }, authorInk })],
      [FutoshikiPoster, preview({ size: 4, saved: { inequalities: [] }, authorInk })],
    ] as const) {
      const w = mount(P, { props: { preview: p }, global: { stubs } });
      expect(w.getComponent(PosterBoard).props("authorInk")).toEqual(authorInk);
    }
  });

  it("a canned face has no authorship to hand down", () => {
    const w = mount(SudokuPoster, { global: { stubs } });
    expect(w.getComponent(PosterBoard).props("authorInk")).toBeUndefined();
  });

  it("every poster stays on pose 0 — a still enrols nothing, true or canned", () => {
    for (const [P, p] of [
      [SudokuPoster, preview({ size: 3, values: { "0": 1 } })],
      [ThermoPoster, preview({ size: 3, saved: { thermometers: [[0, 1]] } })],
      [
        KillerPoster,
        preview({ size: 3, saved: { cages: [{ sum: 3, cells: [0, 1] }] } }),
      ],
      [KenKenPoster, preview({ size: 4, saved: { cages: [] } })],
      [FutoshikiPoster, preview({ size: 4, saved: { inequalities: [] } })],
    ] as const) {
      const w = mount(P, { props: { preview: p }, global: { stubs } });
      expect(w.getComponent(PosterBoard).props("pose") ?? 0).toBe(0);
    }
  });

  /**
   * THE NODE BUDGET, and it is the one number a true still can grow that a canned one cannot.
   *
   * The apotheosis prices the deck at four full posters — 1,056 nodes, measured on the CANNED
   * sizes, which are 9×9-class. A still is now rendered at the size the board was SAVED at, so
   * a 16×16 sudoku draws 256 cells where the canned face drew 81. Node count is the whole of
   * the cost (the tree is static, enrols nothing, paints nothing at rest), so it gets a ceiling
   * rather than a paragraph, and the ceiling is measured from the shape rather than guessed:
   * an empty cell is 1 node, an inked one 3 (measured in the browser, `evidence/w3-deck`).
   *
   * MEASURED: a full 16×16 still is 547 nodes against the canned 9×9's 132. The ceiling is 600
   * — the measurement plus a tenth, so a real growth reds it and grain noise does not. Four of
   * these at once puts the deck near 2,900 against the apotheosis's ~1,650, which is the true
   * -still worst case and is stated in the lane's report rather than hidden here.
   */
  it("a FULL 16x16 still is bounded — the budget the true stills can actually move", () => {
    const values: Record<string, number> = {};
    const givens: string[] = [];
    for (let i = 0; i < 256; i++) {
      values[String(i)] = (i % 16) + 1;
      if (i % 2 === 0) givens.push(String(i));
    }
    const w = mount(SudokuPoster, {
      props: { preview: preview({ size: 4, values, givenCells: givens }) },
      global: { stubs },
    });
    expect(w.getComponent(PosterBoard).props("boardSize")).toBe(16);
    expect(digits(w).length).toBe(256);
    const nodes = 1 + w.get(".poster-board").element.querySelectorAll("*").length;
    expect(nodes).toBeLessThanOrEqual(600);
  });
});
