import { describe, it, expect, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import GameBoard from "./GameBoard.vue";
import { useControlsDrawer } from "./useControlsDrawer";

/**
 * T9-W3 §3.1 — THE OCCLUSION LAW, AT THE ATTRIBUTE.
 *
 * The risen controls sheet paints the board out and every covered cell stayed in the tab order
 * and in the accessibility tree. Measured at HEAD on this tree, both engines, sheet up: 59/81
 * and 62/81 cells hit-tested as covered at 390x844, 47/81 and 46/81 at 768x1024, 40/81 and
 * 42/81 at 820x1180 — and 81 of 81 stayed focusable at all three
 * (`evidence/w3/panel-census-head.txt`). A Tab walk from inside the sheet landed on 20 of them.
 *
 * THE BEHAVIOUR is proved where it happens, in a real browser at real viewports, by
 * `e2e/spoken-controls.spec.ts` — jsdom has no layout, so it cannot witness an occlusion. What
 * this layer pins is the CONTRACT the behaviour rides on, and specifically the half a browser
 * row would never notice: `undefined` and not `false`, so the attribute is ABSENT at rest.
 * A present-and-false `inert` is still an inert element in every engine that ships it, and it
 * would also move every DOM snapshot the estate has committed off the dock.
 *
 * jsdom's `matchMedia` stub matches nothing, so `(min-width: 1024px)` is false and every mount
 * here sits in the dock regime — which is the regime under test.
 */

const grid = (w: ReturnType<typeof mountBoard>) => w.get(".board-cells");

function emptyValues(total = 16) {
  const v: Record<string, number> = {};
  for (let i = 0; i < total; i++) v[String(i)] = 0;
  return v;
}

function mountBoard() {
  document.getElementById("fold-tools")?.remove();
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
      freshBoardCopy: () => "",
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

/** The drawer is module state, so every row hands it back the pose it borrowed. */
const { drawerOpen, toggleDrawer } = useControlsDrawer();
const restore = (open: boolean) => {
  if (drawerOpen.value !== open) toggleDrawer();
};

afterEach(() => restore(true));

describe("GameBoard — the covered grid must not answer (T9-W3 §3.1)", () => {
  it("the risen sheet makes the grid inert", () => {
    restore(true);
    const w = mountBoard();
    expect(grid(w).attributes("inert")).toBeDefined();
    w.unmount();
  });

  it("a shut sheet leaves NO inert attribute at all — absent, never present-and-false", async () => {
    restore(false);
    const w = mountBoard();
    await nextTick();
    expect(
      grid(w).attributes("inert"),
      "a present-and-false `inert` is still an inert element, and it moves every committed DOM snapshot off the dock",
    ).toBeUndefined();
    w.unmount();
  });

  it("the inert lands on the GRID, never on the shell — a covered board can still speak", () => {
    restore(true);
    const w = mountBoard();
    // The shell carries the margin's status region and the board's own voice. If the whole
    // shell went inert, a deal made FROM the risen sheet (which is where Deal lives on the
    // dock) would be announced into a subtree no assistive technology reads.
    expect(w.get(".board-shell").attributes("inert")).toBeUndefined();
    expect(w.find(".board-voice").exists()).toBe(true);
    expect(w.get(".board-voice").element.closest("[inert]")).toBeNull();
    w.unmount();
  });
});
