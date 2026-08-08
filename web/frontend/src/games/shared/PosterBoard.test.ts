import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PosterBoard from "./PosterBoard.vue";

/**
 * T8-W3 M12 — THE FACE IS THE BOARD: the shared floor's half.
 *
 * The five posters' own rows are `src/games/posters.test.ts` — this file may not name a
 * concrete game (the shared floor stays game-agnostic, `lint:boundary`).
 *
 * The deck's flank faces were canned arrays: a card said "9×9 hard · dealt" in words off the
 * ledger while the picture under it showed a board nobody had ever played. These rows gate the
 * three properties that make the picture true, and the one that keeps it free:
 *
 *   1. A SAVED BOARD RENDERS ITSELF — its size, its digits, its furniture.
 *   2. A GAME NEVER PLAYED RENDERS ITS CANNED FACE — the honest picture of an example, and
 *      the same picture that shipped.
 *   3. A CLUE THAT DOES NOT HOLD FALLS BACK WHOLE. Real digits inside canned cages is a
 *      picture of no puzzle at all, so the still goes back to the canned board entire rather
 *      than to half of each.
 *   4. THE SOUL GATE — a mark is `is-overridden` and settles; it never enrols a draw-in.
 *      `HandwrittenGlyph` starts a 150ms stroke draw-in per non-given cell, and four flank
 *      posters doing that per written cell is the sparse-writer disease the gate refuses.
 */

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

describe("PosterBoard — givens and marks are inked apart, and both settle", () => {
  it("no given set supplied: every digit is a given (the canned face, unchanged)", () => {
    const w = mount(PosterBoard, {
      props: { boardSize: 4, subgridSize: 2, values: { "0": 1, "5": 2 } },
      global: { stubs },
    });
    expect(digits(w)).toEqual([
      { v: "1", given: true, mark: false },
      { v: "2", given: true, mark: false },
    ]);
  });

  it("a given set splits them: the rest are marks, and a mark NEVER draws in", () => {
    const w = mount(PosterBoard, {
      props: {
        boardSize: 4,
        subgridSize: 2,
        values: { "0": 1, "5": 2 },
        givens: ["0"],
      },
      global: { stubs },
    });
    const [given, mark] = digits(w);
    expect(given).toEqual({ v: "1", given: true, mark: false });
    // `is-overridden` is the settle branch in HandwrittenGlyph — it returns BEFORE the
    // `!isGiven` draw-in. A poster enrols nothing; this pair is how it stays that way.
    expect(mark).toEqual({ v: "2", given: false, mark: true });
  });
});

/**
 * T8-R13 — WHOSE HAND WROTE IT, on the still.
 *
 * `HandwrittenGlyph` strokes a mark with `var(--color-user-ink)`, so a still with no per-cell
 * rebinding draws every mark in the READING page's ink: a peer's digit and your own read as one
 * author on the card, while the live board that unfolds out of it draws them apart. The rebinding
 * is `BoardHost`'s, at this component's own single cell-mount site — one `:style`, no new colour
 * and no second vocabulary.
 */
const inkOf = (w: {
  findAll: (s: string) => { attributes: (a: string) => string | undefined }[];
}) => w.findAll(".poster-cell .g").map((g) => g.attributes("style") ?? "");

describe("PosterBoard — a peer's digit keeps a peer's ink", () => {
  const PEER = { "--color-user-ink": "oklch(0.6 0.11 137.5deg)" };
  const props = {
    boardSize: 4,
    subgridSize: 2,
    values: { "0": 1, "5": 2, "9": 3 },
    givens: ["0"],
  };

  it("a peer-authored cell rebinds the ink var; your own cell binds nothing", () => {
    const w = mount(PosterBoard, {
      props: { ...props, authorInk: { "5": PEER } },
      global: { stubs },
    });
    const [given, peer, mine] = inkOf(w);
    expect(given).toBe("");
    expect(peer).toContain("--color-user-ink: oklch(0.6 0.11 137.5deg)");
    // Yours keeps the incumbent binding — the session holds an entry only for cells a PEER
    // wrote, and a still that painted your own ink explicitly would be the same lie inverted.
    expect(mine).toBe("");
  });

  it("no authorship supplied: every cell binds nothing (the solo still, unchanged)", () => {
    const w = mount(PosterBoard, { props, global: { stubs } });
    expect(inkOf(w)).toEqual(["", "", ""]);
  });
});
