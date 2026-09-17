import { describe, it, expect } from "vitest";
import { defineComponent, h } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { useGameState, type GameStateDomain } from "./useGameState";

/**
 * T9-W3 §3.5 (folded) · THE SWEEP COUNTS ITSELF.
 *
 * The forced-fill announcement used to read its count off `animatingCells`, the reveal wave the
 * board draws. Four writers share that ref, so the sweep could only be told apart from the
 * other three by inference, and the cheapest inference — "more than one cell, because a
 * one-cell wave is the hint's shape" — made a sweep that forces EXACTLY ONE square silent.
 *
 * `lastFill` is the act's own receipt, written at the one place a sweep lands and nowhere else:
 * the count the sweep actually inked, plus a monotonic stamp so two sweeps of equal size are
 * two acts rather than one unchanged value. What the board speaks is read from here, so no
 * surface has to guess which writer moved the wave.
 */

type Dealt = { values: Record<string, number> };
interface Persisted {
  values: Record<string, number>;
  givenCells: string[];
  originalGivenCells: string[];
  solvedValues: Record<string, number>;
  boardGeneration: number;
  size: number;
  difficulty: "EASY";
}
type Domain = GameStateDomain<"EASY", Dealt, Record<string, never>, Persisted>;
type Model = ReturnType<
  typeof useGameState<"EASY", Dealt, Record<string, never>, Persisted>
>;

/** A 9×9 with two clues; every other square empty and therefore fillable. */
const DEALT: Dealt = { values: { "0": 5, "1": 3 } };

/** A domain whose detector forces exactly the placements it is handed. */
function makeDomain(placements: { cell: number; value: number }[]): Domain {
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
    fillForced: () => ({ placements }),
    hint: () => null,
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

async function mountModel(domain: Domain) {
  let model!: Model;
  const wrapper = mount(
    defineComponent({
      setup() {
        model = useGameState(domain);
        return () => h("div");
      },
    }),
  );
  await flushPromises(); // the mount deal settles
  return { model, wrapper };
}

describe("the forced sweep records its own count (T9-W3 §3.5)", () => {
  it("records nothing until a sweep lands", async () => {
    const { model, wrapper } = await mountModel(makeDomain([{ cell: 40, value: 4 }]));
    expect(model.lastFill.value).toBeNull();
    wrapper.unmount();
  });

  it("a sweep that forces EXACTLY ONE square records a count of 1", async () => {
    // The board's own silence, at its source: this is the sweep the old inference could not
    // tell from the hint's single cell, so it said nothing at all.
    const { model, wrapper } = await mountModel(makeDomain([{ cell: 40, value: 4 }]));

    model.fillForced();

    expect(model.lastFill.value?.count).toBe(1);
    expect(model.values.value["40"]).toBe(4);
    wrapper.unmount();
  });

  it("counts the squares the sweep actually INKED, not the placements it was handed", async () => {
    // A detector may name a cell that is already filled; the sweep inks empties only, so the
    // receipt counts what changed. Cell 0 is a clue carrying 5 — it is not re-inked.
    const { model, wrapper } = await mountModel(
      makeDomain([
        { cell: 0, value: 5 },
        { cell: 40, value: 4 },
        { cell: 41, value: 6 },
      ]),
    );

    model.fillForced();

    expect(model.lastFill.value?.count).toBe(2);
    wrapper.unmount();
  });

  it("a sweep that forces NOTHING records nothing — no act, no receipt", async () => {
    const { model, wrapper } = await mountModel(makeDomain([]));

    model.fillForced();

    expect(model.lastFill.value).toBeNull();
    expect(model.undoDepth.value).toBe(0);
    wrapper.unmount();
  });

  it("two sweeps of the same size are two acts — the stamp advances, the count does not", async () => {
    const { model, wrapper } = await mountModel(makeDomain([{ cell: 40, value: 4 }]));

    model.fillForced();
    const first = model.lastFill.value;
    expect(first).toEqual({ count: 1, stamp: 1 });

    // Undo the sweep so the same square is forceable again, then force it again. Same count,
    // and a reader is owed the sentence twice.
    model.undo();
    await flushPromises();
    model.fillForced();

    expect(model.lastFill.value?.count).toBe(1);
    expect(model.lastFill.value?.stamp).toBe(2);
    wrapper.unmount();
  });
});
