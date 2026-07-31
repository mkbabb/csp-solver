import { beforeEach, describe, expect, it, vi } from "vitest";
import { computed, ref } from "vue";
import {
  __resetStagingBridge,
  backfillLedger,
  clearStagingSource,
  consumeHandoff,
  dealStaged,
  mountedGameId,
  publishMountedGame,
  publishStagedLedger,
  registerStagingSource,
  stageHandoff,
  useStagedLedger,
} from "./useStagingBridge";

/**
 * THE STAGING BRIDGE (T4-P1 F4) — the unit layer the pass-2 lane owed.
 *
 * Every describe below is a defect that SHIPPED once, written as the test that would have
 * caught it. The first is the whole reason this module is refs and not module `let`s.
 */

const LEDGER = "staging-ledger-v1";

/** A persisted board in the estate's own shape. `given` cells are the deal's; `mine` are the
 *  user's. `sizeKey` picks the field name — sudoku/thermo/killer write `size`, futoshiki and
 *  kenken write `boardSize`, and the backfill has to read both. */
function persistedBoard(opts: {
  sizeKey: "size" | "boardSize";
  size: number;
  difficulty: string;
  given?: string[];
  mine?: string[];
}) {
  const values: Record<string, number> = { "0": 0, "1": 0 };
  for (const k of opts.given ?? []) values[k] = 7;
  for (const k of opts.mine ?? []) values[k] = 4;
  return JSON.stringify({
    [opts.sizeKey]: opts.size,
    difficulty: opts.difficulty,
    values,
    givenCells: opts.given ?? [],
  });
}

beforeEach(() => {
  window.localStorage.clear();
  __resetStagingBridge();
});

describe("reactivity — the pass-1 defect this module exists to kill", () => {
  it("a computed over the ledger INVALIDATES on publish", () => {
    // Pass 1 held the ledger in a plain module `let` and read it through a `computed`. A
    // computed over non-reactive state evaluates once and never invalidates, so the picker
    // could not see a publish no matter how many landed. This is that test, and it reds
    // against any re-introduction of a non-reactive holder.
    const view = computed(() => useStagedLedger().value.sudoku?.difficulty ?? "none");
    expect(view.value).toBe("none");

    publishMountedGame("sudoku");
    publishStagedLedger({ size: 3, difficulty: "HARD", board: true, userMoves: false });

    expect(view.value).toBe("HARD");
  });

  it("publishes nothing when no game is mounted (the row has no key to take)", () => {
    publishStagedLedger({ size: 3, difficulty: "HARD", board: true, userMoves: true });
    expect(useStagedLedger().value).toEqual({});
    expect(window.localStorage.getItem(LEDGER)).toBeNull();
  });

  it("an identical republish neither re-writes storage nor churns the ref", () => {
    publishMountedGame("kenken");
    const row = { size: 6, difficulty: "HARD", board: true, userMoves: true };
    publishStagedLedger(row);
    const first = useStagedLedger().value;
    publishStagedLedger({ ...row });
    expect(useStagedLedger().value).toBe(first); // same object identity ⇒ no re-render
  });
});

describe("the id-keyed handoff", () => {
  it("is delivered to its own game and to no other", () => {
    // Sizes are bare numbers with per-game meaning (sudoku 3 = 9×9, kenken 4 = 4×4), so an
    // unkeyed arm consumed by whichever game mounted next dealt a wrong-size board.
    stageHandoff("kenken", { size: 6, difficulty: "HARD" });
    expect(consumeHandoff("sudoku")).toBeNull();
    // …and it is GONE — a mis-routed arm dies at the first mount rather than lying in wait,
    // which is why there is no TTL and no clock.
    expect(consumeHandoff("kenken")).toBeNull();
  });

  it("is a ONE-SHOT for the right game", () => {
    stageHandoff("kenken", { size: 6, difficulty: "HARD" });
    expect(consumeHandoff("kenken")).toEqual({ size: 6, difficulty: "HARD" });
    expect(consumeHandoff("kenken")).toBeNull();
  });

  it("survives a null mounted id without throwing", () => {
    stageHandoff("thermo", { size: 3, difficulty: "EASY" });
    expect(consumeHandoff(null)).toBeNull();
  });
});

describe("the mounted source", () => {
  it("dealStaged reports FALSE when no game is mounted to deal into", async () => {
    // The discarded return was pass 2's silent success: App awaited nothing and called the
    // transaction done. The caller re-stages on `false`; this is the signal it needs.
    await expect(dealStaged({ size: 3, difficulty: "EASY" })).resolves.toBe(false);
  });

  it("dealStaged drives the registered source and reports TRUE", async () => {
    const deal = vi.fn(async () => {});
    registerStagingSource({ pair: ref({ size: 3, difficulty: "EASY" }), deal });
    await expect(dealStaged({ size: 4, difficulty: "HARD" })).resolves.toBe(true);
    expect(deal).toHaveBeenCalledWith({ size: 4, difficulty: "HARD" });
  });

  it("the clear is identity-guarded (mount-before-unmount during a scene swap)", async () => {
    const outgoing = {
      pair: ref({ size: 3, difficulty: "EASY" }),
      deal: vi.fn(async () => {}),
    };
    const incoming = {
      pair: ref({ size: 6, difficulty: "HARD" }),
      deal: vi.fn(async () => {}),
    };
    registerStagingSource(outgoing);
    registerStagingSource(incoming); // the new scene registers at setup…
    clearStagingSource(outgoing); // …before the old one's onUnmounted runs
    await dealStaged({ size: 6, difficulty: "HARD" });
    expect(incoming.deal).toHaveBeenCalledTimes(1);
    expect(outgoing.deal).not.toHaveBeenCalled();
  });
});

describe("cold-start backfill — the falsity the whole installed base saw", () => {
  const SOURCES = [
    { id: "sudoku", persistKey: "sudoku-board-state" },
    { id: "futoshiki", persistKey: "futoshiki-board-state" },
    { id: "kenken", persistKey: "kenken-board-v1" },
  ];

  it("seeds rows from BOTH persisted size field names", () => {
    window.localStorage.setItem(
      "sudoku-board-state",
      persistedBoard({ sizeKey: "size", size: 3, difficulty: "HARD", given: ["4"] }),
    );
    window.localStorage.setItem(
      "kenken-board-v1",
      persistedBoard({
        sizeKey: "boardSize",
        size: 6,
        difficulty: "MEDIUM",
        given: ["2"],
      }),
    );

    backfillLedger(SOURCES);

    expect(useStagedLedger().value.sudoku).toEqual({
      size: 3,
      difficulty: "HARD",
      board: true,
      userMoves: false,
    });
    expect(useStagedLedger().value.kenken?.size).toBe(6);
    expect(useStagedLedger().value.futoshiki).toBeUndefined(); // no board on disk ⇒ no row
  });

  it("GIVENS ARE NOT WORK — a dealt, untouched board has no user moves", () => {
    // Pass 2 counted every non-zero cell, so every freshly dealt game read "in progress" and
    // armed the guard against destroying nothing.
    window.localStorage.setItem(
      "sudoku-board-state",
      persistedBoard({
        sizeKey: "size",
        size: 3,
        difficulty: "EASY",
        given: ["0", "1", "2"],
      }),
    );
    backfillLedger(SOURCES);
    expect(useStagedLedger().value.sudoku).toMatchObject({
      board: true,
      userMoves: false,
    });
  });

  it("a digit the user wrote IS work", () => {
    window.localStorage.setItem(
      "sudoku-board-state",
      persistedBoard({
        sizeKey: "size",
        size: 3,
        difficulty: "EASY",
        given: ["0"],
        mine: ["9"],
      }),
    );
    backfillLedger(SOURCES);
    expect(useStagedLedger().value.sudoku).toMatchObject({
      board: true,
      userMoves: true,
    });
  });

  it("NEVER overwrites a live row — the mounted game's publish always wins", () => {
    publishMountedGame("sudoku");
    publishStagedLedger({
      size: 4,
      difficulty: "MEDIUM",
      board: true,
      userMoves: true,
    });
    window.localStorage.setItem(
      "sudoku-board-state",
      persistedBoard({ sizeKey: "size", size: 2, difficulty: "EASY", given: ["0"] }),
    );

    backfillLedger(SOURCES); // the debounced per-game persist trails the live row by ≤300ms

    expect(useStagedLedger().value.sudoku).toMatchObject({
      size: 4,
      difficulty: "MEDIUM",
    });
  });

  it("survives corrupt and half-shaped boards without a row and without throwing", () => {
    window.localStorage.setItem("sudoku-board-state", "{not json");
    window.localStorage.setItem(
      "futoshiki-board-state",
      JSON.stringify({ boardSize: 5 }),
    );
    window.localStorage.setItem(
      "kenken-board-v1",
      JSON.stringify({ difficulty: "HARD" }),
    );
    expect(() => backfillLedger(SOURCES)).not.toThrow();
    expect(useStagedLedger().value).toEqual({});
  });

  it("survives a corrupt LEDGER on disk — a bad cache is not a boot failure", () => {
    window.localStorage.setItem(LEDGER, "]]not json[[");
    __resetStagingBridge();
    expect(useStagedLedger().value).toEqual({});
  });

  it("rehydrates both board facts from a written ledger", () => {
    publishMountedGame("thermo");
    publishStagedLedger({ size: 3, difficulty: "HARD", board: true, userMoves: true });
    __resetStagingBridge(); // a reload: the module re-reads its own key
    expect(useStagedLedger().value.thermo).toEqual({
      size: 3,
      difficulty: "HARD",
      board: true,
      userMoves: true,
    });
  });
});

describe("the mounted id", () => {
  it("is what App published, and clears to null", () => {
    publishMountedGame("futoshiki");
    expect(mountedGameId()).toBe("futoshiki");
    publishMountedGame(null);
    expect(mountedGameId()).toBeNull();
  });
});
