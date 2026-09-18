import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, h } from "vue";
import GameBoard from "./GameBoard.vue";
import { session } from "./useSession";
import { useControlsDrawer } from "./useControlsDrawer";

/**
 * T9-W7 exec 3C-4 — A FINGER HAS NO HOVER.
 *
 * The attribution tape is the one surface that names who wrote a digit, and it was raised by
 * `mouseenter` alone. On a coarse pointer that event never comes, so on every phone and tablet
 * the tape could not appear at all — the asymmetry the shipped stylesheet named out loud and
 * then closed with `display: none`.
 *
 * A tap gives FOCUS, and the board already tracks it. So the coarse arm is the roving
 * tabindex's own position and nothing else, gated on the grid actually HOLDING focus — the
 * same `unitFocused` gate the peer-unit wash has carried since T4-W8, and for the same reason:
 * `focusedPos` rests at 0 on a fresh board with nothing selected, so an ungated read would pin
 * a tape over cell 0 before the player had touched anything, and leave it there after focus
 * walked off the board.
 *
 * WHAT THIS LAYER CANNOT SEE: jsdom applies no stylesheet, so the `@media not all and
 * (hover: hover) and (pointer: fine)` rule that hid the tape on coarse surfaces is invisible
 * here. Deleting that rule is the other half of the cure, and its proof is the browser arm at
 * 390x844 banked under `evidence/w7/exec/3C-4/`, not this file. What this file pins is the
 * MOUNT contract: which cells raise the tape on which pointer, and the ways it stays silent.
 */

const coarse = vi.hoisted(() => ({ value: false }));
vi.mock("@games/shared/useCoarsePointer", async (importOriginal) => {
  const actual = await importOriginal<object>();
  return { ...actual, useCoarsePointer: () => coarse };
});

const PEER = 3;
const MINE = 5;
const AUTHORS = {
  [String(PEER)]: { slug: "brave-otter", self: false },
  [String(MINE)]: { slug: "swift-heron", self: true },
};

type SlotApi = {
  focusedPos: number;
  onCellFocus: (pos: number) => void;
  onCellHover: (pos: number | null) => void;
};
let api: SlotApi | null = null;

type Authors = Record<string, { slug: string; self: boolean }>;

function mountBoard(authors: Authors | undefined) {
  document.getElementById("fold-tools")?.remove();
  return mount(GameBoard, {
    props: {
      boardSize: 3,
      totalCells: 9,
      values: Object.fromEntries([...Array(9)].map((_, i) => [String(i), 0])),
      givenCells: new Set<string>(),
      animatingCells: new Set<string>(),
      solveState: "idle",
      boardGeneration: 1,
      subgridSize: 3,
      gridLabel: "3 by 3 board",
      conflictsFn: () => ({ positions: new Set<string>(), unit: null }),
      peersFn: () => new Set<string>(),
      freshBoardCopy: () => "",
      cellAuthors: authors,
    },
    slots: {
      cells: ((props: SlotApi) => {
        api = props;
        return h("i", { class: "cell" });
      }) as unknown as string,
    },
    global: {
      stubs: {
        HandDrawnGrid: true,
        CelebrationStar: true,
        CelebrationHeart: true,
        CompletionVignette: true,
        SolverErrorNote: true,
        MarginNote: true,
      },
    },
  });
}

type Board = ReturnType<typeof mountBoard>;

/** A tap: the cell takes focus and the grid sees the focusin, exactly as a browser orders it. */
async function tap(w: Board, pos: number) {
  await w.get(".board-cells").trigger("focusin");
  api!.onCellFocus(pos);
  await nextTick();
}

/** Focus walks off the board entirely. */
async function blurBoard(w: Board) {
  await w.get(".board-cells").trigger("focusout", { relatedTarget: document.body });
  await nextTick();
}

/**
 * An arrow key: focus leaves the old cell for another cell of the SAME grid, and no pointer
 * event of any kind is fired. The grid sees focusout with a relatedTarget it contains (so the
 * `unitFocused` gate stays up), then focusin, then the new cell's own focus handler.
 */
async function keyFocus(w: Board, pos: number) {
  const grid = w.get(".board-cells");
  await grid.trigger("focusout", { relatedTarget: grid.element });
  await grid.trigger("focusin");
  api!.onCellFocus(pos);
  await nextTick();
}

const tape = (w: Board) => w.find(".attribution-tape");

const { drawerOpen, toggleDrawer } = useControlsDrawer();
const room = session.roomId as unknown as { value: string | null };

beforeEach(() => {
  coarse.value = false;
  api = null;
  room.value = "ROOM7";
  if (drawerOpen.value) toggleDrawer();
});
afterEach(() => {
  coarse.value = false;
  room.value = null;
});

describe("GameBoard — the coarse pointer reaches the attribution tape through focus", () => {
  it("raises the tape on a peer-authored cell the finger has focused", async () => {
    coarse.value = true;
    const w = mountBoard(AUTHORS);
    await tap(w, PEER);
    expect(tape(w).exists(), "a tap is the coarse pointer's only hover").toBe(true);
    expect(tape(w).text()).toContain("brave-otter");
    w.unmount();
  });

  it("says nothing over a cell you wrote yourself", async () => {
    coarse.value = true;
    const w = mountBoard(AUTHORS);
    await tap(w, MINE);
    expect(tape(w).exists()).toBe(false);
    w.unmount();
  });

  it("says nothing over an unauthored cell", async () => {
    coarse.value = true;
    const w = mountBoard(AUTHORS);
    await tap(w, 8);
    expect(tape(w).exists()).toBe(false);
    w.unmount();
  });

  it("mints nothing at all on a solo board", async () => {
    coarse.value = true;
    room.value = null;
    const w = mountBoard(undefined);
    await tap(w, PEER);
    expect(tape(w).exists(), "outside a session there is no author to name").toBe(
      false,
    );
    w.unmount();
  });

  it("mounts nothing before the board is touched — a resting board is bare", async () => {
    // `focusedPos` rests at 0, and cell 0 can be a peer's. Ungated, the tape would be on
    // screen at load with nothing selected.
    coarse.value = true;
    const w = mountBoard({ "0": { slug: "brave-otter", self: false } });
    await nextTick();
    expect(tape(w).exists()).toBe(false);
    w.unmount();
  });

  it("drops the tape when focus leaves the board", async () => {
    coarse.value = true;
    const w = mountBoard(AUTHORS);
    await tap(w, PEER);
    expect(tape(w).exists()).toBe(true);
    await blurBoard(w);
    expect(tape(w).exists(), "a tape left behind names a cell nobody is on").toBe(
      false,
    );
    w.unmount();
  });
});

describe("GameBoard — the fine pointer's tape is untouched", () => {
  it("still rides the hover, and only the hover", async () => {
    const w = mountBoard(AUTHORS);
    await tap(w, PEER);
    expect(tape(w).exists(), "focus is not hover on a mouse").toBe(false);
    api!.onCellHover(PEER);
    await nextTick();
    expect(tape(w).exists()).toBe(true);
    expect(tape(w).text()).toContain("brave-otter");
    api!.onCellHover(null);
    await nextTick();
    expect(tape(w).exists()).toBe(false);
    w.unmount();
  });

  it("still says nothing over your own digit", async () => {
    const w = mountBoard(AUTHORS);
    await nextTick();
    api!.onCellHover(MINE);
    await nextTick();
    expect(tape(w).exists()).toBe(false);
    w.unmount();
  });
});

describe("GameBoard — a live pointer still outranks the focused cell", () => {
  it("a synthesised coarse hover takes the focused cell's place while it lasts", async () => {
    coarse.value = true;
    const w = mountBoard({
      [String(PEER)]: { slug: "brave-otter", self: false },
      "7": { slug: "quiet-lynx", self: false },
    });
    await tap(w, PEER);
    expect(tape(w).text()).toContain("brave-otter");
    api!.onCellHover(7);
    await nextTick();
    expect(tape(w).text()).toContain("quiet-lynx");
    w.unmount();
  });
});

/**
 * T9-W7 exec 3C-4b — the hover that arrives and never leaves.
 *
 * A hover-in with no hover-out is a real coarse-device shape (a phone with an external
 * keyboard, an engine that synthesises `mouseenter` on a tap and no `mouseleave` after it).
 * `pointedPos` outranks the focus fallback, so once it is stale the tape names the cell the
 * player left rather than the one they are on. The grid's `focusout` bubbles from the old cell
 * on EVERY focus move, so it is where the stale pointer is dropped — on coarse pointers only.
 */
describe("GameBoard — a stale coarse hover does not strand the tape", () => {
  it("hands the tape to the cell the keyboard moved to", async () => {
    coarse.value = true;
    const w = mountBoard({
      [String(PEER)]: { slug: "brave-otter", self: false },
      "7": { slug: "quiet-lynx", self: false },
    });
    await tap(w, PEER);
    api!.onCellHover(PEER); // a hover-in that never gets its hover-out
    await nextTick();
    expect(tape(w).text()).toContain("brave-otter");
    await keyFocus(w, 7);
    expect(
      tape(w).text(),
      "the tape names the cell the player is on, not the one they left",
    ).toContain("quiet-lynx");
    expect(tape(w).text()).not.toContain("brave-otter");
    w.unmount();
  });

  it("drops the tape when the keyboard moves to an unauthored cell", async () => {
    coarse.value = true;
    const w = mountBoard(AUTHORS);
    await tap(w, PEER);
    api!.onCellHover(PEER);
    await nextTick();
    expect(tape(w).exists()).toBe(true);
    await keyFocus(w, 8);
    expect(tape(w).exists(), "nobody wrote cell 8").toBe(false);
    w.unmount();
  });

  it("drops the tape when focus leaves the board with the hover still live", async () => {
    // The clear is not guarded on where focus GOES: the same focusout fires when focus leaves
    // the board entirely, so a hover that never ended cannot hold the tape up over a board
    // nobody is on any more. This is the widened arm of the cure, pinned so it cannot drift.
    coarse.value = true;
    const w = mountBoard(AUTHORS);
    await tap(w, PEER);
    api!.onCellHover(PEER); // a hover-in that never gets its hover-out
    await nextTick();
    expect(tape(w).exists()).toBe(true);
    await blurBoard(w);
    expect(tape(w).exists(), "nobody is on the board").toBe(false);
    w.unmount();
  });

  it("leaves a fine pointer's hover exactly where it was", async () => {
    // A mouse that still hovers A while focus goes to B by keyboard keeps its hover, which is
    // the desktop grammar as it shipped: the tape rides the pointer, not the selection.
    const w = mountBoard({
      [String(PEER)]: { slug: "brave-otter", self: false },
      "7": { slug: "quiet-lynx", self: false },
    });
    await tap(w, PEER);
    api!.onCellHover(PEER);
    await nextTick();
    expect(tape(w).text()).toContain("brave-otter");
    await keyFocus(w, 7);
    expect(tape(w).text(), "the mouse never left cell 3").toContain("brave-otter");
    w.unmount();
  });
});
