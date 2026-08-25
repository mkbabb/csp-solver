import { describe, it, expect, afterEach } from "vitest";
import { defineComponent, h } from "vue";
import { flushPromises, mount } from "@vue/test-utils";
import { useGameState, type GameStateDomain } from "./useGameState";
import { publishMountedGame, stageBoardFollow } from "./useStagingBridge";
import { SolverError, type SolverErrorCode } from "./solver/solverError";

/**
 * T9-W1 §1.1 · THE GIVEN CELL'S LAW (family F17, ballot B7's default).
 *
 * The board's one inviolable invariant, pinned at the ONE place every write passes through.
 * `applyCellValue` is the sole write primitive — user edits, undo/redo replay and a peer's
 * digit all land there — so the law is stated once and five games inherit it.
 *
 * Every row here was RED at HEAD by measurement: the machine did not lack a guard, it
 * carried a deliberate DEMOTION (`givenCells.delete` → `overriddenCells.add`), so a
 * keystroke on a clue re-labelled it and Backspace erased it, while the cell's own name
 * still read "given clue N". The rows assert the cure from three sides: the value stands,
 * the two given names cannot diverge, and nothing is recorded or written to disk that
 * remembers a demotion.
 */

/** The saved-board shape, carrying the LEGACY `overriddenCells` field a pre-cure disk write
 *  left behind — the load-clean rows below are what a player's stored board hits on upgrade. */
interface Persisted {
  values: Record<string, number>;
  givenCells: string[];
  originalGivenCells: string[];
  overriddenCells: string[];
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

/** The dealt board every row starts from: clues at 0 and 1, the rest of the 9×9 empty. */
const DEALT: Dealt = { values: { "0": 5, "1": 3 } };

function makeDomain(persisted: Persisted | null = null): Domain {
  return {
    initial: {
      difficulty: "EASY",
      source: persisted ? "storage-only" : "fresh",
      persisted,
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

/** Mount the machine inside a host so its `onUnmounted` hooks have an instance to hang on. */
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
  await flushPromises(); // the mount deal (or the restore) settles
  return { model, wrapper };
}

describe("the given cell refuses the write (T9-W1 §1.1, F17)", () => {
  it("a digit typed over a clue changes nothing — the value stands, the cell stays given", async () => {
    const { model, wrapper } = await mountModel(makeDomain());
    expect(model.values.value["0"]).toBe(5);

    const outcome = model.setCell(0, 7);

    expect(model.values.value["0"]).toBe(5);
    expect(model.givenCells.value.has("0")).toBe(true);
    expect(outcome).toBe("refused-given");
    wrapper.unmount();
  });

  it("an erase is a write — Backspace on a clue is refused too", async () => {
    const { model, wrapper } = await mountModel(makeDomain());

    expect(model.setCell(1, 0)).toBe("refused-given");

    expect(model.values.value["1"]).toBe(3);
    expect(model.givenCells.value.has("1")).toBe(true);
    wrapper.unmount();
  });

  it("the refusal records nothing — the undo spine never sees a write that did not happen", async () => {
    const { model, wrapper } = await mountModel(makeDomain());
    expect(model.undoDepth.value).toBe(0);

    model.setCell(0, 7);

    expect(model.undoDepth.value).toBe(0);
    expect(model.canUndo.value).toBe(false);
    expect(model.isDirty.value).toBe(false);
    wrapper.unmount();
  });

  it("publishes the refusal for the surfaces that speak it, once per attempt", async () => {
    const { model, wrapper } = await mountModel(makeDomain());
    expect(model.lastRefusal.value).toBeNull();

    model.setCell(0, 7);
    expect(model.lastRefusal.value).toEqual({ pos: 0, reason: "given", seq: 1 });

    // The SAME cell refused twice is two events: a watcher fires on the second keystroke too.
    model.setCell(0, 9);
    expect(model.lastRefusal.value).toEqual({ pos: 0, reason: "given", seq: 2 });
    wrapper.unmount();
  });

  it("an empty cell is untouched by the law — the ordinary write still lands and records", async () => {
    const { model, wrapper } = await mountModel(makeDomain());

    expect(model.setCell(40, 4)).toBe("written");

    expect(model.values.value["40"]).toBe(4);
    expect(model.undoDepth.value).toBe(1);
    expect(model.lastRefusal.value).toBeNull();
    wrapper.unmount();
  });

  it("your own entry stays yours to overwrite and to erase", async () => {
    const { model, wrapper } = await mountModel(makeDomain());
    model.setCell(40, 4);

    expect(model.setCell(40, 6)).toBe("written");
    expect(model.values.value["40"]).toBe(6);
    expect(model.setCell(40, 0)).toBe("written");
    expect(model.values.value["40"]).toBe(0);
    wrapper.unmount();
  });
});

describe("the demotion machinery is retired (no-legacy)", () => {
  it("the model publishes no overridden-cell set", async () => {
    const { model, wrapper } = await mountModel(makeDomain());
    expect("overriddenCells" in model).toBe(false);
    wrapper.unmount();
  });

  it("the two given names hold ONE truth — nothing can make them diverge", async () => {
    const { model, wrapper } = await mountModel(makeDomain());
    model.setCell(0, 7); // the act that used to split them

    expect([...model.givenCells.value].sort()).toEqual(
      [...model.originalGivenCells.value].sort(),
    );
    wrapper.unmount();
  });

  it("undo/redo across a board swap carries the givens whole", async () => {
    const { model, wrapper } = await mountModel(makeDomain());
    model.clearBoard(); // one undoable board entry
    expect(model.givenCells.value.size).toBe(0);

    model.undo();
    await flushPromises();

    expect([...model.givenCells.value].sort()).toEqual(["0", "1"]);
    expect([...model.originalGivenCells.value].sort()).toEqual(["0", "1"]);
    expect(model.setCell(0, 7)).toBe("refused-given");
    wrapper.unmount();
  });
});

describe("a saved board written by the old build loads clean", () => {
  /** The disk state a demotion left: cell 0's clue was typed over, so the save carries it as
   *  overridden — out of `givenCells`, still in `originalGivenCells`, the user's 7 in `values`. */
  function demotedSave(): Persisted {
    const values: Record<string, number> = {};
    for (let i = 0; i < 81; i++) values[String(i)] = 0;
    values["0"] = 7;
    values["1"] = 3;
    return {
      values,
      givenCells: ["1"],
      originalGivenCells: ["0", "1"],
      overriddenCells: ["0"],
      solvedValues: {},
      boardGeneration: 4,
      size: 3,
      difficulty: "EASY",
    };
  }

  it("restores the clue's own standing — the original givens are the truth on disk", async () => {
    const { model, wrapper } = await mountModel(makeDomain(demotedSave()));

    expect(model.givenCells.value.has("0")).toBe(true);
    expect(model.setCell(0, 2)).toBe("refused-given");
    wrapper.unmount();
  });

  it("never mints a clue with no digit — an erased given comes back writable", async () => {
    // The digit a demotion erased is unrecoverable from disk. Calling that cell a given would
    // mint a cell nobody can ever fill, so an empty original given restores as an empty cell.
    const save = demotedSave();
    save.values["0"] = 0;

    const { model, wrapper } = await mountModel(makeDomain(save));

    expect(model.givenCells.value.has("0")).toBe(false);
    expect(model.setCell(0, 2)).toBe("written");
    expect(model.values.value["0"]).toBe(2);
    wrapper.unmount();
  });

  it("and can be hinted too — what a write may not touch is what a hint may not touch", async () => {
    // The hint's two "is this a clue?" tests used to ask the pristine clue LIST, which on this
    // one board disagrees with the live set: the cell is writable and the hint refused it, so
    // the square was one the player could neither be helped with nor reason about.
    const save = demotedSave();
    save.values["0"] = 0;
    const domain = makeDomain(save);
    // The answer key the peek solves — cell 0's true digit is the 5 the demotion erased.
    domain.solve = async (cells) => ({
      solved: true,
      values: { ...cells, "0": 5 },
      backtracks: 0,
      nodesExplored: 0,
      propagations: 0,
      solutionCount: 1,
    });

    const { model, wrapper } = await mountModel(domain);
    await model.hintCell(0);

    expect(model.hintReasoning.value).toEqual({
      technique: "reveal",
      cell: 0,
      value: 5,
      becauseCells: [0],
    });
    wrapper.unmount();
  });
});

describe("the hint path classifies a solver rejection like every other path (T9-W1 §1.2)", () => {
  function throwingDomain(code: SolverErrorCode): Domain {
    const domain = makeDomain();
    domain.solve = async () => {
      throw new SolverError(code, "solver said no");
    };
    return domain;
  }

  it("a provably-broken board answers Hint with the teacher's red, not with silence", async () => {
    const { model, wrapper } = await mountModel(throwingDomain("UNSAT"));

    await model.hintCell(40); // empty, no nameable single — the reveal fallback peeks

    expect(model.solveState.value).toBe("failed");
    expect(model.hintReasoning.value).toBeNull();
    wrapper.unmount();
  });

  it("a machinery fault answers with the paper note and carries its code", async () => {
    const { model, wrapper } = await mountModel(throwingDomain("WORKER_FAILURE"));

    await model.hintCell(40);

    expect(model.solveState.value).toBe("error");
    expect(model.errorCode.value).toBe("WORKER_FAILURE");
    wrapper.unmount();
  });
});

describe("a staged follow off the wire is met with suspicion (T9-W1 §1.3)", () => {
  afterEach(() => publishMountedGame(null));

  it("a misshapen staged blob adopts nothing — the mount boots its own board", async () => {
    publishMountedGame("sudoku");
    stageBoardFollow("sudoku", 3, { b: { values: 3 }, m: null });

    const { model, wrapper } = await mountModel(makeDomain());

    // The stage was refused whole; the ordinary mount deal landed instead of a throw.
    expect(model.values.value["0"]).toBe(5);
    expect(model.givenCells.value.has("0")).toBe(true);
    wrapper.unmount();
  });

  it("a well-formed staged blob still adopts ahead of the mount deal", async () => {
    const values: Record<string, number> = {};
    for (let i = 0; i < 81; i++) values[String(i)] = 0;
    values["2"] = 9;
    publishMountedGame("sudoku");
    stageBoardFollow("sudoku", 3, {
      b: { values, origGiven: ["2"], solved: {} },
      m: { corner: {}, center: {} },
    });

    const { model, wrapper } = await mountModel(makeDomain());

    expect(model.values.value["2"]).toBe(9);
    expect(model.givenCells.value.has("2")).toBe(true);
    expect(model.values.value["0"]).toBe(0); // the room's board, not the mount deal
    wrapper.unmount();
  });
});
