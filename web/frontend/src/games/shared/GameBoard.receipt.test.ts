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
      conflictsFn: () => ({ positions: new Set<string>(), unit: null }),
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

// ── T9-W3 §3.5 — AND THE OTHER HALF OF THE SAME SENTENCE ─────────────────────────────────
//
// The rows above are all about the MARGIN, and every one of them stays exactly as it was: the
// caption does not come back, in either direction. What was missing is that nothing else was
// listening. `freshBoardCopy` correctly returns "" on an ordinary deal, so a deal arrived, the
// board changed under the reader, and no channel anywhere said so — the silence was a
// consequence of the M16 deletion that nobody had priced.
//
// The board's second voice is that channel: `sr-only`, so the deleted ink stays deleted, and
// on the shared live-region idiom, so it is born empty and every sentence lands as a mutation.
// These rows pin the pair — the strip stays silent AND the voice speaks — because either one
// alone is a defect this file has already seen once.
const voice = (w: ReturnType<typeof mountBoard>) => w.get(".board-voice").text();

describe("GameBoard — the deal is spoken where it draws nothing", () => {
  it("is born empty: a region that arrives holding its sentence announces nothing", () => {
    const w = mountBoard({ dealt: true });
    expect(voice(w)).toBe("");
    w.unmount();
  });

  it("a deal says a board arrived and names it, while the strip stays blank", async () => {
    const w = mountBoard({ dealt: false, freshBoardCopy: () => "" });
    await w.setProps({ dealt: true, boardGeneration: 2 });
    await nextTick();
    // The grid's own accessible name is what names the board — one string, never a second
    // description that can drift from it.
    expect(voice(w)).toBe("new board. 4 by 4 kenken board");
    expect(receipt(w)).toBe("");
    // M16: the register bans the character outright, so the two clauses are two sentences.
    expect(voice(w)).not.toMatch(/[—–]/);
    w.unmount();
  });

  it("dealing the same board twice speaks twice — a repeat is still an arrival", async () => {
    const w = mountBoard({ dealt: false, freshBoardCopy: () => "" });
    await w.setProps({ dealt: true, boardGeneration: 2 });
    await nextTick();
    expect(voice(w)).toBe("new board. 4 by 4 kenken board");

    // The identical sentence written back into a region it already holds is NOT a mutation, so
    // the second deal would be silent. The idiom's own EMPTIES clause is what answers it.
    await w.setProps({ boardGeneration: 3 });
    await nextTick();
    expect(voice(w), "the region emptied first, so the repeat lands as a change").toBe(
      "",
    );
    await nextTick();
    expect(voice(w)).toBe("new board. 4 by 4 kenken board");
    w.unmount();
  });

  it("a CLEAR is the margin's receipt, not the voice's — one act, one announcement", async () => {
    const w = mountBoard({ dealt: true, values: { ...emptyValues(), "0": 3 } });
    await w.setProps({ dealt: false, values: emptyValues(), boardGeneration: 2 });
    await nextTick();
    expect(receipt(w)).toBe("the board is clear");
    expect(voice(w)).toBe("");
    w.unmount();
  });
});

/**
 * THE SWEEP COUNTS ITSELF (T9-W3 §3.5, folded).
 *
 * The count used to be read off `animatingCells`, which is the reveal WAVE and not the sweep.
 * Three other writers share that ref, so the sweep had to be fenced off from them by inference
 * — same generation (not a deal), idle solve state (not a solve), and MORE THAN ONE CELL,
 * because a one-cell wave is the hint's own shape. That last clause was not a fence, it was a
 * SILENCE: a sweep that forced exactly one square announced nothing, and a reader who pressed
 * the verb got no answer at all.
 *
 * `lastFill` is what the sweep itself recorded — the count the act holds, stamped so two equal
 * sweeps are two acts. Reading the act instead of its effect retires all three inferences at
 * once, and the singular becomes speakable because nothing else can be mistaken for it.
 */
describe("GameBoard — the forced fill says how many", () => {
  it("a sweep that inks several cells announces its count", async () => {
    const w = mountBoard({ dealt: true });
    await w.setProps({ lastFill: { count: 3, stamp: 1 } });
    await nextTick();
    expect(voice(w)).toBe("3 squares filled");
    w.unmount();
  });

  it("a sweep that forces exactly ONE square says so, in the singular", async () => {
    const w = mountBoard({ dealt: true });
    await w.setProps({ lastFill: { count: 1, stamp: 1 } });
    await nextTick();
    expect(voice(w)).toBe("1 square filled");
    w.unmount();
  });

  it("two sweeps of the same size are two acts — the stamp says so, the count cannot", async () => {
    const w = mountBoard({ dealt: true });
    await w.setProps({ lastFill: { count: 2, stamp: 1 } });
    await nextTick();
    expect(voice(w)).toBe("2 squares filled");

    // The identical sentence written back into a region it already holds is not a mutation, so
    // the second sweep would be silent. The idiom's EMPTIES clause answers that; the STAMP is
    // what lets the model say "another one" when the count alone cannot.
    await w.setProps({ lastFill: { count: 2, stamp: 2 } });
    await nextTick();
    expect(voice(w), "the region emptied first, so the repeat lands as a change").toBe(
      "",
    );
    await nextTick();
    expect(voice(w)).toBe("2 squares filled");
    w.unmount();
  });

  it("a SOLVE does not — the margin already grades it, and two voices is one too many", async () => {
    const w = mountBoard({ dealt: true });
    await w.setProps({
      animatingCells: new Set(["1", "2", "3"]),
      solveState: "solved",
    });
    await nextTick();
    expect(voice(w)).toBe("");
    expect(receipt(w)).toBe("solved it!");
    w.unmount();
  });

  it("a DEAL's own reveal wave is not a fill — the deal has its own line", async () => {
    const w = mountBoard({ dealt: false, freshBoardCopy: () => "" });
    // A deal animates its whole given set on the same tick it bumps the generation.
    await w.setProps({
      dealt: true,
      boardGeneration: 2,
      animatingCells: new Set(["0", "5", "9"]),
      givenCells: new Set(["0", "5", "9"]),
    });
    await nextTick();
    expect(voice(w)).toBe("new board. 4 by 4 kenken board");
    w.unmount();
  });

  it("the hint's one-cell ink is not a sweep — no act, no count", async () => {
    // This is the row that used to enshrine the silence: it asserted that a one-cell WAVE says
    // nothing, which was true of the hint and true of a one-square sweep alike. Now it asserts
    // the wave alone is not the subject — the hint inks a cell and records no fill, so the
    // voice stays out and the margin keeps the hint's reasoning, exactly as before.
    const w = mountBoard({ dealt: true });
    await w.setProps({ animatingCells: new Set(["7"]) });
    await nextTick();
    expect(voice(w)).toBe("");
    w.unmount();
  });
});

vi.restoreAllMocks();
