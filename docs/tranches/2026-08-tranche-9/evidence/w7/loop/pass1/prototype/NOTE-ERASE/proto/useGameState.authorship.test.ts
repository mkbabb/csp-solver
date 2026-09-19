import { describe, it, expect, vi } from "vitest";
import { defineComponent, h } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { useGameState, type GameStateDomain } from "./useGameState";
import type { HintResult } from "./techniqueEngine";

/**
 * T9-W7 §7 · WHOSE HAND WROTE IT — the authorship seam on the one write primitive.
 *
 * `applyCellValue` is shared by a keystroke, an undo replay and a digit off the wire, and it
 * nulled the margin's two voices for all three. The margin speaks TO THE READER, so a peer's
 * digit in the far corner took the reader's own hint note and refusal off the page (measured
 * live, both engines). The seam narrows the retraction: your act always retracts; a peer's act
 * retracts the hint only when it lands on the square the sentence is about, and never touches
 * the refusal, which answered YOUR keystroke on a clue no peer can write either.
 */

const captured = vi.hoisted(() => ({
  source: null as null | {
    applyValue: (pos: number, value: number, solved: boolean) => void;
  },
}));

vi.mock("./useSession", async (importOriginal) => {
  const mod = await importOriginal<typeof import("./useSession")>();
  return {
    ...mod,
    registerSessionSource: (s: {
      applyValue: (pos: number, value: number, solved: boolean) => void;
    }) => {
      captured.source = s;
      mod.registerSessionSource(s as Parameters<typeof mod.registerSessionSource>[0]);
    },
  };
});

interface Persisted {
  values: Record<string, number>;
  givenCells: string[];
  originalGivenCells: string[];
  solvedValues: Record<string, number>;
  boardGeneration: number;
  size: number;
  difficulty: "EASY";
}
type Dealt = { values: Record<string, number> };
type Domain = GameStateDomain<"EASY", Dealt, Record<string, never>, Persisted>;
type Model = ReturnType<
  typeof useGameState<"EASY", Dealt, Record<string, never>, Persisted>
>;

/** Clues at 0 and 1; the hint names cell 40 and its argument turns on 41 and 42 as well. */
const DEALT: Dealt = { values: { "0": 5, "1": 3 } };
const HINT: HintResult = {
  technique: "hidden-single",
  cell: 40,
  value: 4,
  becauseCells: [40, 41, 42],
  houseAxis: "row",
};

function makeDomain(): Domain {
  return {
    initial: {
      difficulty: "EASY",
      source: "fresh",
      persisted: null,
      boardLink: "absent",
    },
    initialSize: 3,
    boardSizeOf: (raw) => raw * raw,
    getRandomBoard: async () => DEALT,
    applyDealFurniture: () => {},
    resetFurniture: () => {},
    grade: () => ({ hardestTechnique: null, solved: true }),
    solve: async (values) => ({
      solved: true,
      values,
      backtracks: 0,
      nodesExplored: 0,
      propagations: 0,
      solutionCount: 1,
    }),
    propagate: async () => new Uint32Array(0),
    fillForced: () => ({ placements: [] }),
    hint: () => HINT,
    snapshotExtra: () => ({}),
    restoreExtra: () => {},
    restorePersistedFurniture: () => {},
    syncToUrl: () => {},
    persist: () => {},
    clearPersisted: () => {},
    dropBoardParam: () => {},
    writeShareUrl: () => {},
  };
}

async function mountModel() {
  let model!: Model;
  const wrapper = mount(
    defineComponent({
      setup() {
        model = useGameState(makeDomain());
        return () => h("div");
      },
    }),
  );
  await flushPromises();
  return { model, wrapper };
}

/** The wire's own entry point, as `useSession` holds it. */
const peerWrite = (pos: number, value: number, solved = false) =>
  captured.source!.applyValue(pos, value, solved);

describe("the authorship seam (T9-W7 §7)", () => {
  it("a peer's write outside the armed hint leaves the note standing", async () => {
    const { model, wrapper } = await mountModel();
    await model.hintCell(40);
    expect(model.hintReasoning.value).not.toBeNull();

    peerWrite(60, 7);

    expect(model.values.value["60"]).toBe(7);
    expect(model.hintReasoning.value).not.toBeNull();
    wrapper.unmount();
  });

  it("a peer's write at the cell the note NAMES retracts it", async () => {
    const { model, wrapper } = await mountModel();
    await model.hintCell(40);

    peerWrite(40, 4);

    expect(model.hintReasoning.value).toBeNull();
    wrapper.unmount();
  });

  it("a peer's write at a cell the argument turns on retracts it", async () => {
    const { model, wrapper } = await mountModel();
    await model.hintCell(40);

    peerWrite(42, 9);

    expect(model.hintReasoning.value).toBeNull();
    wrapper.unmount();
  });

  it("a peer's REVEAL at the named cell retracts it too", async () => {
    const { model, wrapper } = await mountModel();
    await model.hintCell(40);

    peerWrite(40, 4, true); // solved: true — the answer-key path, a write like any other

    expect(model.hintReasoning.value).toBeNull();
    wrapper.unmount();
  });

  it("a peer's write anywhere leaves your refusal alone", async () => {
    const { model, wrapper } = await mountModel();
    model.setCell(0, 7); // a keystroke on a clue: refused, and spoken
    expect(model.lastRefusal.value).toEqual({ pos: 0, reason: "given", seq: 1 });

    peerWrite(60, 7);
    expect(model.lastRefusal.value).toEqual({ pos: 0, reason: "given", seq: 1 });

    peerWrite(40, 4); // even on the square your hint named
    expect(model.lastRefusal.value).toEqual({ pos: 0, reason: "given", seq: 1 });
    wrapper.unmount();
  });

  it("your own ink still retracts both, wherever it lands", async () => {
    const { model, wrapper } = await mountModel();
    await model.hintCell(40);
    model.setCell(0, 7);
    expect(model.lastRefusal.value).not.toBeNull();
    expect(model.hintReasoning.value).not.toBeNull();

    model.setCell(60, 7); // a landing keystroke in the far corner — yours

    expect(model.hintReasoning.value).toBeNull();
    expect(model.lastRefusal.value).toBeNull();
    wrapper.unmount();
  });
});
