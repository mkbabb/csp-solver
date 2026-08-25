import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import GameBoard from "./GameBoard.vue";
import { findConflicts } from "./conflicts";

/**
 * T9-W1 §1.2 — THE NOTES BELOW THE BOARD, AND WHEN THEY GO AWAY.
 *
 * Three defects, one strip. The verdict named a unit the board had not broken (it read the
 * row index off the earliest circled cell whatever unit actually conflicted). The hint note
 * had no way to leave: the `props.hint` watch carried no falsy arm, and the idle wipe only
 * clears a NON-graphite tone, so a graphite hint stood at full opacity through every act
 * that followed. And the paper note asserted "ran out of steps" for a fault nobody had
 * classified as budget exhaustion.
 *
 * The strip is read where the shell writes it, through the two stubs that carry the strings.
 * §1.1's spoken refusal rides the same strip: the model's `lastRefusal` arrives as a prop,
 * the margin says "that's a given clue" in the teacher's red, and the model's disarm — ink
 * that lands, a deal, a wipe — retracts it through the same falsy arm the hint note uses.
 */

const STUBS = {
  HandDrawnGrid: true,
  CelebrationStar: true,
  CelebrationHeart: true,
  CompletionVignette: true,
  MarginNote: {
    props: ["text", "tone", "meta", "quiet"],
    template: `<p class="margin-note" :data-tone="tone">{{ text }}</p>`,
  },
  SolverErrorNote: {
    props: ["text", "retryable"],
    template: `<p class="error-note">{{ text }}</p>`,
  },
};

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
      subgridSize: 2,
      gridLabel: "4 by 4 sudoku board",
      conflictsFn: () => ({ positions: new Set<string>(), unit: null }),
      peersFn: () => new Set<string>(),
      freshBoardCopy: () => "",
      ...props,
    },
    global: { stubs: STUBS },
  });
}

const margin = (w: ReturnType<typeof mountBoard>) => w.get(".margin-note").text();

describe("GameBoard — the verdict names the unit the board actually broke", () => {
  it("a pure column duplicate sends the reader to the column, not to a clean row", async () => {
    // 4×4 boxed. A 3 at r0c1 and a 3 at r3c1: every row holds one digit and the two boxes
    // differ, so the ONLY broken unit is column 2 (1-based).
    const values = { ...emptyValues(), "1": 3, "13": 3 };
    const w = mountBoard({
      values,
      conflictsFn: (v: Record<string, number>, n: number) =>
        findConflicts(v, n, { subgridSize: 2 }),
    });
    await w.setProps({ solveState: "failed" });
    await nextTick();
    expect(margin(w)).toBe("check column 2");
    w.unmount();
  });

  it("a row duplicate still reads as its row", async () => {
    const values = { ...emptyValues(), "0": 3, "3": 3 };
    const w = mountBoard({
      values,
      conflictsFn: (v: Record<string, number>, n: number) =>
        findConflicts(v, n, { subgridSize: 2 }),
    });
    await w.setProps({ solveState: "failed" });
    await nextTick();
    expect(margin(w)).toBe("check row 1");
    w.unmount();
  });

  it("a game whose own furniture is what broke says so", async () => {
    const w = mountBoard({
      conflictsFn: () => ({
        positions: new Set(["2", "6"]),
        unit: { kind: "cage", index: null },
      }),
    });
    await w.setProps({ solveState: "failed" });
    await nextTick();
    expect(margin(w)).toBe("check the cage");
    w.unmount();
  });

  it("an unsolvable board with nothing visibly circled keeps the honest fallback", async () => {
    const w = mountBoard();
    await w.setProps({ solveState: "failed" });
    await nextTick();
    expect(margin(w)).toBe("no solution from here");
    w.unmount();
  });
});

describe("GameBoard — a hint note can leave", () => {
  const hint = {
    technique: "naked-single" as const,
    cell: 0,
    value: 4,
    becauseCells: [0],
  };

  it("hint to null RETRACTS the note instead of standing there forever", async () => {
    const w = mountBoard();
    await w.setProps({ hint });
    await nextTick();
    expect(margin(w)).toBe("only 4 fits here");
    await w.setProps({ hint: null });
    await nextTick();
    expect(margin(w)).toBe("");
    w.unmount();
  });

  it("the retraction only ever wipes the hint's own line", async () => {
    // A hint, then a clear: the wipe receipt is the live line when the hint drops, and the
    // retraction must not reach for it.
    const w = mountBoard({ dealt: true, values: { ...emptyValues(), "0": 3 } });
    await w.setProps({ hint });
    await nextTick();
    expect(margin(w)).toBe("only 4 fits here");
    await w.setProps({
      hint: null,
      dealt: false,
      values: emptyValues(),
      boardGeneration: 2,
    });
    await nextTick();
    expect(margin(w)).toBe("the board is clear");
    w.unmount();
  });

  it("a hint that never armed leaves the strip alone", async () => {
    const w = mountBoard({ dealt: false, freshBoardCopy: () => "<announce>" });
    await w.setProps({ dealt: true, boardGeneration: 2 });
    await nextTick();
    await w.setProps({ hint: null });
    await nextTick();
    expect(margin(w)).toBe("<announce>");
    w.unmount();
  });
});

describe("GameBoard — the paper note claims only what it knows", () => {
  const note = (w: ReturnType<typeof mountBoard>) => w.get(".error-note").text();

  it("an UNCLASSIFIED fault says something true instead of blaming the step budget", async () => {
    const w = mountBoard();
    await w.setProps({ solveState: "error" });
    await nextTick();
    expect(note(w)).toBe("something went wrong.");
    expect(note(w)).not.toContain("ran out of steps");
    w.unmount();
  });

  it("an empty code is no code at all", async () => {
    const w = mountBoard();
    await w.setProps({ solveState: "error", errorCode: "" });
    await nextTick();
    expect(note(w)).toBe("something went wrong.");
    w.unmount();
  });

  it("budget exhaustion still says it ran out of steps", async () => {
    const w = mountBoard();
    await w.setProps({ solveState: "error", errorCode: "BUDGET_EXCEEDED" });
    await nextTick();
    expect(note(w)).toBe("the solver ran out of steps on this board.");
    w.unmount();
  });

  it("a dead worker still says it could not be reached", async () => {
    const w = mountBoard();
    await w.setProps({ solveState: "error", errorCode: "WORKER_FAILURE" });
    await nextTick();
    expect(note(w)).toBe("couldn't reach the solver.");
    w.unmount();
  });
});

describe("GameBoard — the refusal is spoken where the board speaks (T9-W1 §1.1)", () => {
  const refusal = { pos: 0, reason: "given" as const, seq: 1 };

  it("a refused write puts its sentence in the margin, in the teacher's red", async () => {
    const w = mountBoard();
    await w.setProps({ refusal });
    await nextTick();
    expect(margin(w)).toBe("that's a given clue");
    expect(w.get(".margin-note").attributes("data-tone")).toBe("teacher-red");
    w.unmount();
  });

  it("the model's disarm retracts the sentence", async () => {
    const w = mountBoard();
    await w.setProps({ refusal });
    await nextTick();
    expect(margin(w)).toBe("that's a given clue");
    await w.setProps({ refusal: null });
    await nextTick();
    expect(margin(w)).toBe("");
    w.unmount();
  });

  it("a refusal that never fired leaves the strip alone", async () => {
    const w = mountBoard({ dealt: false, freshBoardCopy: () => "<announce>" });
    await w.setProps({ dealt: true, boardGeneration: 2 });
    await nextTick();
    await w.setProps({ refusal: null });
    await nextTick();
    expect(margin(w)).toBe("<announce>");
    w.unmount();
  });
});
