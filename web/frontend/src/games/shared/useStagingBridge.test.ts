import { beforeEach, describe, expect, it, vi } from "vitest";
import { computed, ref } from "vue";

/**
 * THE MODULE IS BOOTED PER TEST, not reset by a seam it exports.
 *
 * The bridge is a module singleton over reactive refs, so a unit that mutates it would leak
 * into the next one. It used to ship `__resetStagingBridge()` for exactly that — a public
 * reset on a module singleton, which is a second lifecycle, shipped to production, called
 * only by this file (T5-W2 2.3c, dead-code S7). `vi.resetModules()` + a fresh dynamic import
 * gives the real thing instead: module init runs again, top to bottom, off whatever is on
 * disk. That is also what a page reload IS, so the two "reload" tests below stopped
 * simulating one and started performing one.
 */
type Bridge = typeof import("./useStagingBridge");
let bridge: Bridge;
const bootBridge = async (): Promise<Bridge> => {
  vi.resetModules();
  return import("./useStagingBridge");
};

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

beforeEach(async () => {
  window.localStorage.clear();
  bridge = await bootBridge();
});

describe("reactivity — the pass-1 defect this module exists to kill", () => {
  it("a computed over the ledger INVALIDATES on publish", () => {
    // Pass 1 held the ledger in a plain module `let` and read it through a `computed`. A
    // computed over non-reactive state evaluates once and never invalidates, so the picker
    // could not see a publish no matter how many landed. This is that test, and it reds
    // against any re-introduction of a non-reactive holder.
    const view = computed(
      () => bridge.useStagedLedger().value.sudoku?.difficulty ?? "none",
    );
    expect(view.value).toBe("none");

    bridge.publishMountedGame("sudoku");
    bridge.publishStagedLedger({
      size: 3,
      difficulty: "HARD",
      board: true,
      userMoves: false,
    });

    expect(view.value).toBe("HARD");
  });

  it("publishes nothing when no game is mounted (the row has no key to take)", () => {
    bridge.publishStagedLedger({
      size: 3,
      difficulty: "HARD",
      board: true,
      userMoves: true,
    });
    expect(bridge.useStagedLedger().value).toEqual({});
    expect(window.localStorage.getItem(LEDGER)).toBeNull();
  });

  it("an identical republish neither re-writes storage nor churns the ref", () => {
    bridge.publishMountedGame("kenken");
    const row = { size: 6, difficulty: "HARD", board: true, userMoves: true };
    bridge.publishStagedLedger(row);
    const first = bridge.useStagedLedger().value;
    bridge.publishStagedLedger({ ...row });
    expect(bridge.useStagedLedger().value).toBe(first); // same object identity ⇒ no re-render
  });
});

describe("the id-keyed handoff", () => {
  it("is delivered to its own game and to no other", () => {
    // Sizes are bare numbers with per-game meaning (sudoku 3 = 9×9, kenken 4 = 4×4), so an
    // unkeyed arm consumed by whichever game mounted next dealt a wrong-size board.
    bridge.stageHandoff("kenken", { size: 6, difficulty: "HARD" });
    expect(bridge.consumeHandoff("sudoku")).toBeNull();
    // …and it is GONE — a mis-routed arm dies at the first mount rather than lying in wait,
    // which is why there is no TTL and no clock.
    expect(bridge.consumeHandoff("kenken")).toBeNull();
  });

  it("is a ONE-SHOT for the right game", () => {
    bridge.stageHandoff("kenken", { size: 6, difficulty: "HARD" });
    expect(bridge.consumeHandoff("kenken")).toEqual({ size: 6, difficulty: "HARD" });
    expect(bridge.consumeHandoff("kenken")).toBeNull();
  });

  it("survives a null mounted id without throwing", () => {
    bridge.stageHandoff("thermo", { size: 3, difficulty: "EASY" });
    expect(bridge.consumeHandoff(null)).toBeNull();
  });
});

describe("the mounted source", () => {
  it("bridge.dealStaged reports FALSE when no game is mounted to deal into", async () => {
    // The discarded return was pass 2's silent success: App awaited nothing and called the
    // transaction done. The caller re-stages on `false`; this is the signal it needs.
    await expect(bridge.dealStaged({ size: 3, difficulty: "EASY" })).resolves.toBe(
      false,
    );
  });

  it("bridge.dealStaged drives the registered source and reports TRUE", async () => {
    const deal = vi.fn(async () => {});
    bridge.registerStagingSource({
      pair: ref({ size: 3, difficulty: "EASY" }),
      deal,
      flush: vi.fn(),
    });
    await expect(bridge.dealStaged({ size: 4, difficulty: "HARD" })).resolves.toBe(
      true,
    );
    expect(deal).toHaveBeenCalledWith({ size: 4, difficulty: "HARD" });
  });

  it("the clear is identity-guarded (mount-before-unmount during a scene swap)", async () => {
    const outgoing = {
      pair: ref({ size: 3, difficulty: "EASY" }),
      deal: vi.fn(async () => {}),
      flush: vi.fn(),
    };
    const incoming = {
      pair: ref({ size: 6, difficulty: "HARD" }),
      deal: vi.fn(async () => {}),
      flush: vi.fn(),
    };
    bridge.registerStagingSource(outgoing);
    bridge.registerStagingSource(incoming); // the new scene registers at setup…
    bridge.clearStagingSource(outgoing); // …before the old one's onUnmounted runs
    await bridge.dealStaged({ size: 6, difficulty: "HARD" });
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

    bridge.backfillLedger(SOURCES);

    expect(bridge.useStagedLedger().value.sudoku).toEqual({
      size: 3,
      difficulty: "HARD",
      board: true,
      userMoves: false,
    });
    expect(bridge.useStagedLedger().value.kenken?.size).toBe(6);
    expect(bridge.useStagedLedger().value.futoshiki).toBeUndefined(); // no board on disk ⇒ no row
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
    bridge.backfillLedger(SOURCES);
    expect(bridge.useStagedLedger().value.sudoku).toMatchObject({
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
    bridge.backfillLedger(SOURCES);
    expect(bridge.useStagedLedger().value.sudoku).toMatchObject({
      board: true,
      userMoves: true,
    });
  });

  it("NEVER overwrites a live row — the mounted game's publish always wins", () => {
    bridge.publishMountedGame("sudoku");
    bridge.publishStagedLedger({
      size: 4,
      difficulty: "MEDIUM",
      board: true,
      userMoves: true,
    });
    window.localStorage.setItem(
      "sudoku-board-state",
      persistedBoard({ sizeKey: "size", size: 2, difficulty: "EASY", given: ["0"] }),
    );

    bridge.backfillLedger(SOURCES); // the debounced per-game persist trails the live row by ≤300ms

    expect(bridge.useStagedLedger().value.sudoku).toMatchObject({
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
    expect(() => bridge.backfillLedger(SOURCES)).not.toThrow();
    expect(bridge.useStagedLedger().value).toEqual({});
  });

  it("survives a corrupt LEDGER on disk — a bad cache is not a boot failure", async () => {
    window.localStorage.setItem(LEDGER, "]]not json[[");
    bridge = await bootBridge();
    expect(bridge.useStagedLedger().value).toEqual({});
  });

  it("rehydrates both board facts from a written ledger", async () => {
    bridge.publishMountedGame("thermo");
    bridge.publishStagedLedger({
      size: 3,
      difficulty: "HARD",
      board: true,
      userMoves: true,
    });
    bridge = await bootBridge(); // a real reload: module init re-reads its own key
    expect(bridge.useStagedLedger().value.thermo).toEqual({
      size: 3,
      difficulty: "HARD",
      board: true,
      userMoves: true,
    });
  });
});

describe("the mounted id", () => {
  it("is what App published, and clears to null", () => {
    bridge.publishMountedGame("futoshiki");
    expect(bridge.mountedGameId()).toBe("futoshiki");
    bridge.publishMountedGame(null);
    expect(bridge.mountedGameId()).toBeNull();
  });
});

/**
 * THE STILL OWES THE TABLE ITS COLOURS (T8-R13).
 *
 * A still is `values` + `givenCells` off disk, and every non-given digit in it was inked with
 * whatever `--color-user-ink` resolved to on the reading page — so a peer's 7 and your own 5 read
 * as one author on the very card the live board draws them apart on. The clock that separates
 * them is in memory, never on disk, and it is about ONE board: the mounted one.
 */
describe("the still's authorship — a peer's digit keeps a peer's ink (T8-R13)", () => {
  const SOURCES = [
    { id: "sudoku", persistKey: "sudoku-board-state" },
    { id: "futoshiki", persistKey: "futoshiki-board-state" },
  ];
  const PEER = { "9": { "--color-user-ink": "oklch(0.6 0.11 137.5deg)" } };

  beforeEach(() => {
    for (const s of SOURCES)
      window.localStorage.setItem(
        s.persistKey,
        persistedBoard({
          sizeKey: "size",
          size: 3,
          difficulty: "EASY",
          given: ["0"],
          mine: ["9"],
        }),
      );
    bridge.backfillLedger(SOURCES);
  });

  it("the MOUNTED game's still carries the board's per-cell ink", () => {
    bridge.publishMountedGame("sudoku");
    bridge.registerAuthorInk(() => PEER);
    expect(bridge.previewFor("sudoku")?.authorInk).toEqual(PEER);
  });

  it("no OTHER game's still does — the clock is about one shared board", () => {
    bridge.publishMountedGame("sudoku");
    bridge.registerAuthorInk(() => PEER);
    // futoshiki's saved board was written in some other room, or in none; the mounted clock
    // says nothing about whose hand wrote its digits, and a guess is what this row refuses.
    expect(bridge.previewFor("futoshiki")?.authorInk).toBeUndefined();
  });

  it("a solo page carries none — the still is the one that shipped", () => {
    bridge.publishMountedGame("sudoku");
    bridge.registerAuthorInk(() => ({}));
    expect(bridge.previewFor("sudoku")?.authorInk).toBeUndefined();
  });

  it("with no source registered at all the read is unchanged", () => {
    bridge.publishMountedGame("sudoku");
    expect(bridge.previewFor("sudoku")?.authorInk).toBeUndefined();
  });
});
