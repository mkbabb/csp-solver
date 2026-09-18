import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { markRaw, ref } from "vue";
import BoardHost from "./BoardHost.vue";
import type { AnyGameSpec, GameModel } from "./defineGame";

/**
 * T9-W7 exec 3B-1 — A HAND IS ONLY CLAIMABLE ON A DIGIT THAT HAND WROTE.
 *
 * The ledger stamps a position on every write, and three kinds of write leave a digit that is
 * NOT the stamped hand's: a reveal (the solver's, and the glyph wears the solver's ink to say
 * so), a deal (a printed clue is nobody's), and an erase (there is no digit left to own). The
 * stamp outlives all three, so the map the board reads claimed a peer over cells they never
 * wrote.
 *
 * ONE RENDERED SURFACE was lying at `aab67b92`: the washi tape (`cell-authors` → `GameBoard`),
 * which mounts on whatever the map holds. The other consumer, the cell's own accessible name
 * (`author-name` → the cell), already spoke the truth for all three kinds — T9-W3 §3.3 moved
 * authorship into the name's kind-branch (`useGameCell.ts:140`), and
 * `DigitCell.attribution.test.ts` pins it with `authorName` set: "revealed answer 4",
 * "given clue 4", "empty". Narrowing the map at its single source is surface-agreement at the
 * source, not a second cured lie.
 *
 * So the `named()` rows below hold the PROP the cell is handed (the stub echoes `authorName`
 * into `data-author`), NOT the sentence the cell speaks — that sentence is DigitCell's row's
 * to hold. They are here because a narrowing that moved only the tape would leave the two
 * consumers reading different maps for one square.
 */

/** The board is not the subject — it is stubbed to the one prop under test plus the cell slot
 *  it hands back, so the grid, the reveal wave and the marginalia stay out of this file. */
const GameBoardStub = {
  name: "GameBoard",
  props: ["cellAuthors"],
  setup() {
    const slotProps = {
      setCellApi: () => {},
      isRevealed: () => false,
      conflicts: { positions: new Set<string>(), unit: null },
      hintBecause: new Set<string>(),
      peerCells: new Set<string>(),
      noiseDelays: new Map<string, number>(),
      focusedPos: null,
      cellRects: {} as Record<number, string>,
      marksFor: () => [] as number[],
      onCellUpdate: () => {},
      onMark: () => {},
      onCellFocus: () => {},
      onCellHover: () => {},
      onPeekStart: () => {},
      onPeekEnd: () => {},
    };
    return { slotProps };
  },
  template: `<div class="board-stub"><slot name="cells" v-bind="slotProps" /></div>`,
};

/** The cell is stubbed to the name clause alone — `DigitCell`'s own rows own the sentence. */
const CellStub = {
  name: "CellStub",
  props: ["position", "value", "isGiven", "isSolved", "authorName"],
  template: `<i class="cell" :data-pos="position" :data-author="authorName" />`,
};

const SPEC = {
  grammar: { geometry: "boxed", noun: "board", requestVoice: false },
  furniture: { cell: markRaw(CellStub) },
  clues: null,
} as unknown as AnyGameSpec;

/**
 * Four cells, one peer stamp each, four different truths about who wrote the digit:
 *   0 — the peer wrote it and it is still theirs (the ONE claimable cell)
 *   1 — the solver revealed it after the peer asked
 *   2 — the deal printed it
 *   3 — the peer erased it
 */
const STAMP = { slug: "brave-otter", self: false };

function makeModel(): GameModel {
  return {
    boardSize: ref(3),
    totalCells: ref(9),
    values: ref({ "0": 4, "1": 7, "2": 5, "3": 0 }),
    givenCells: ref(new Set(["2"])),
    originalGivenCells: ref(new Set(["2"])),
    lastRefusal: ref(null),
    animatingCells: ref(new Set<string>()),
    lastFill: ref(null),
    solveState: ref("idle"),
    solvedValues: ref({ "1": 7 }),
    solveStats: ref(null),
    boardGeneration: ref(1),
    difficulty: ref("EASY"),
    loading: ref(false),
    errorCode: ref(""),
    linkError: ref(false),
    isDirty: ref(false),
    hintReasoning: ref(null),
    gradeTally: ref({ graded: true }),
    pencilMarks: ref({}),
    cornerMarks: ref({}),
    centerMarks: ref({}),
    pencilMode: ref("off"),
    errorCheckMode: ref("off"),
    proactiveCheck: ref(false),
    candidatesPinned: ref(false),
    authorInk: ref({}),
    cellAuthors: ref({ "0": STAMP, "1": STAMP, "2": STAMP, "3": STAMP }),
    setCell: () => {},
    toggleUserMark: () => {},
    cyclePencilMode: () => {},
    setPencilMode: () => {},
    setErrorCheckMode: () => {},
    setCandidatesPinned: () => {},
    setMarksActive: () => {},
    peekSolution: async () => ({}),
    shareBoard: async () => {},
    shareSession: async () => {},
    deal: () => {},
    clearBoard: () => {},
    solve: () => {},
    fillForced: () => {},
    hintCell: () => {},
    undo: () => {},
    redo: () => {},
  } as unknown as GameModel;
}

function mountHost() {
  const model = makeModel();
  const w = mount(BoardHost, {
    props: { spec: SPEC, model },
    global: { stubs: { GameBoard: GameBoardStub } },
  });
  return {
    w,
    /** the tape's read: which positions the board is told a peer owns */
    taped: () =>
      Object.keys(
        (w.findComponent(GameBoardStub).props("cellAuthors") ?? {}) as Record<
          string,
          unknown
        >,
      ).sort(),
    /** the name's read: the slug printed into each cell's accessible name */
    named: (pos: number) =>
      w.get(`.cell[data-pos="${pos}"]`).attributes("data-author") ?? "",
  };
}

describe("BoardHost — a peer is claimed only where a peer's digit stands", () => {
  it("claims the peer's own live digit, on both surfaces", () => {
    const h = mountHost();
    expect(h.taped()).toContain("0");
    expect(h.named(0)).toBe("brave-otter");
    h.w.unmount();
  });

  it("claims nobody on a revealed cell — the digit is the solver's", () => {
    const h = mountHost();
    expect(h.taped()).not.toContain("1");
    expect(h.named(1)).toBe("");
    h.w.unmount();
  });

  it("claims nobody on a printed clue — the deal wrote it", () => {
    const h = mountHost();
    expect(h.taped()).not.toContain("2");
    expect(h.named(2)).toBe("");
    h.w.unmount();
  });

  it("claims nobody on an emptied cell — there is no digit to own", () => {
    const h = mountHost();
    expect(h.taped()).not.toContain("3");
    expect(h.named(3)).toBe("");
    h.w.unmount();
  });

  it("narrows to exactly the one claimable cell, and both consumers agree", () => {
    // One assertion over the whole map: a narrowing that leaked a fourth key would pass the
    // three rows above only by accident of which cell it leaked.
    const h = mountHost();
    expect(h.taped()).toEqual(["0"]);
    expect([0, 1, 2, 3].map((p) => h.named(p))).toEqual(["brave-otter", "", "", ""]);
    h.w.unmount();
  });
});

/** The solo board must stay byte-identical: an empty ledger narrows to an empty map. */
describe("BoardHost — the solo board claims nothing at all", () => {
  it("passes an empty map when the ledger is empty", () => {
    const model = makeModel();
    (model.cellAuthors as unknown as { value: Record<string, unknown> }).value = {};
    const w = mount(BoardHost, {
      props: { spec: SPEC, model },
      global: { stubs: { GameBoard: GameBoardStub } },
    });
    expect(w.findComponent(GameBoardStub).props("cellAuthors")).toEqual({});
    expect(w.get('.cell[data-pos="0"]').attributes("data-author")).toBe("");
    w.unmount();
  });

  it("re-narrows when the ledger moves — the map is derived, never stamped once", async () => {
    // A peer writes into the cell they had erased; the claim must come back with the digit.
    const model = makeModel();
    const w = mount(BoardHost, {
      props: { spec: SPEC, model },
      global: { stubs: { GameBoard: GameBoardStub } },
    });
    (model.values as unknown as { value: Record<string, number> }).value = {
      ...model.values.value,
      "3": 8,
    };
    await w.vm.$nextTick();
    expect(
      Object.keys(
        w.findComponent(GameBoardStub).props("cellAuthors") as Record<string, unknown>,
      ).sort(),
    ).toEqual(["0", "3"]);
    w.unmount();
  });
});
