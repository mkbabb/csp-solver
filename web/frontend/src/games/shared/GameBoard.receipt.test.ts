import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import GameBoard from "./GameBoard.vue";

/**
 * T7-W7 — THE DEAL RECEIPT ON A BOARD THAT DEALS NO GIVENS.
 *
 * The generation watch used to read the receipt off the grid: a same-size bump with no
 * givens left could only be a clear. KenKen prints no digit at all on 69% of its deals,
 * so 69% of KenKen deals announced "the board is clear" — the wipe receipt, for a board
 * nobody had wiped. A dealt empty grid and a cleared one are the same pixels; only the
 * ACT tells them apart, and `dealt` carries it.
 *
 * Two rows, one for each side of the gate, because the cure has to hold BOTH: the deal
 * must stop saying "clear", and the clear must keep saying it.
 *
 * T8-W6 · M16 — the announce these rows ROUTE to is now empty on an ordinary deal (the board
 * caption was the mark's own exemplar and is deleted at `BoardHost`). The routing is still the
 * subject, so the stub returns a SENTINEL rather than any string a reader would ever see; the
 * production shape gets its own row at the foot, where the deal must leave the strip silent
 * and must still not reach for the wipe receipt.
 */

// The board's furniture is not the subject — stub the SVG grid, the celebration, and the
// note card, and read the receipt where the shell writes it (MarginNote's `text`).
const STUBS = {
  HandDrawnGrid: true,
  CelebrationStar: true,
  CelebrationHeart: true,
  CompletionVignette: true,
  SolverErrorNote: true,
  MarginNote: {
    props: ["text", "tone", "meta", "quiet"],
    template: `<p class="margin-note">{{ text }}</p>`,
  },
};

/** A 4×4 KenKen deal: cages on the board, not one digit printed. */
function emptyValues(total = 16) {
  const v: Record<string, number> = {};
  for (let i = 0; i < total; i++) v[String(i)] = 0;
  return v;
}

function mountBoard(props: Record<string, unknown> = {}) {
  return mount(GameBoard, {
    props: {
      boardSize: 4,
      totalCells: 16,
      values: emptyValues(),
      givenCells: new Set<string>(),
      animatingCells: new Set<string>(),
      solveState: "idle",
      boardGeneration: 1,
      subgridSize: 4,
      gridLabel: "4 by 4 kenken board",
      conflictsFn: () => ({ positions: new Set<string>(), firstRow: null }),
      peersFn: () => new Set<string>(),
      freshBoardCopy: () => "<announce>",
      ...props,
    },
    global: { stubs: STUBS },
  });
}

const receipt = (w: ReturnType<typeof mountBoard>) => w.get(".margin-note").text();

describe("GameBoard — the generation receipt on a no-givens family", () => {
  it("a zero-given DEAL announces the fresh-board line, never the clear one", async () => {
    const w = mountBoard({ dealt: false });
    // The deal lands: the model grades the dealt board, then bumps the generation.
    await w.setProps({ dealt: true, boardGeneration: 2 });
    await nextTick();
    expect(receipt(w)).toBe("<announce>");
    expect(receipt(w)).not.toContain("clear");
    w.unmount();
  });

  it("an actual clear still announces the wipe — the receipt follows the act, not the emptiness", async () => {
    // A dealt board with work on it; the clear blanks the values AND the model's grade.
    const w = mountBoard({ dealt: true, values: { ...emptyValues(), "0": 3, "5": 1 } });
    await w.setProps({ dealt: false, values: emptyValues(), boardGeneration: 2 });
    await nextTick();
    expect(receipt(w)).toBe("the board is clear");
    w.unmount();
  });
});

// The KenKen deal that started this: `givenCells` is empty on both sides of the bump, so the
// givens 0→N announce never fires and the generation watch is the only voice in the room.
describe("GameBoard — the givens watch stays the announcer where there ARE givens", () => {
  it("a sudoku-shaped deal keeps its 0→N fresh line and draws no second receipt", async () => {
    const w = mountBoard({ dealt: false });
    await w.setProps({
      dealt: true,
      givenCells: new Set(["0", "5", "9"]),
      values: { ...emptyValues(), "0": 1, "5": 2, "9": 3 },
      boardGeneration: 2,
    });
    await nextTick();
    expect(receipt(w)).toBe("<announce>");
    w.unmount();
  });
});

// T8-W6 · M16 — THE PRODUCTION SHAPE. `BoardHost.freshBoardCopy` returns "" on every ordinary
// deal now, so the row that matters is the one the sentinel cannot state: a deal must leave the
// strip SILENT, and silence must not be mistaken for the wipe. The defect this guards is the
// caption coming back, in either direction.
describe("GameBoard — an ordinary deal says nothing at all", () => {
  it("routes to an empty announce and never falls through to the wipe receipt", async () => {
    const w = mountBoard({ dealt: false, freshBoardCopy: () => "" });
    await w.setProps({ dealt: true, boardGeneration: 2 });
    await nextTick();
    expect(receipt(w)).toBe("");
    w.unmount();
  });

  it("the corrupt-link clause is the one thing that still speaks on arrival", async () => {
    const w = mountBoard({
      dealt: false,
      freshBoardCopy: () => "this shared link couldn't be read",
    });
    await w.setProps({ dealt: true, boardGeneration: 2 });
    await nextTick();
    expect(receipt(w)).toBe("this shared link couldn't be read");
    expect(receipt(w)).not.toMatch(/[—–]/);
    w.unmount();
  });
});

vi.restoreAllMocks();
