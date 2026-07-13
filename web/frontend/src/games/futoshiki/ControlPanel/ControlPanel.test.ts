import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ControlPanel from "./ControlPanel.vue";

// FE-unit layer (T4-WM §2) — twin of the sudoku panel's touch-play-tools contract (D16). The
// futoshiki panel is the sudoku panel minus the difficulty section, so the coarse play-tools
// row (undo / redo / hint) is identical; this pins that it exists here too, wired to its own
// emits (the game routes them to the futoshiki composable + the futoshiki board's focused-cell
// hint). Media-query claims (44px floor, coarse-only display) ride the mobile e2e.

function mountPanel(overrides: Record<string, unknown> = {}) {
  return mount(ControlPanel, {
    props: {
      boardSize: 5,
      difficulty: "EASY",
      loading: false,
      solveState: "idle",
      mobile: true,
      share: () => Promise.resolve(),
      ...overrides,
    },
  });
}

const UNDO = 'button[aria-label="Undo last move"]';
const REDO = 'button[aria-label="Redo move"]';
const HINT = 'button[aria-label="Reveal a hint in the selected cell"]';

describe("Futoshiki ControlPanel — touch play tools (T4-WM §2)", () => {
  it("renders tappable undo / redo / hint buttons with written sublabels", () => {
    const w = mountPanel();
    expect(w.get(UNDO).find(".icon-sublabel").text()).toBe("Undo");
    expect(w.get(REDO).find(".icon-sublabel").text()).toBe("Redo");
    expect(w.get(HINT).find(".icon-sublabel").text()).toBe("Hint");
  });

  it("each play button carries the .icon-btn grammar (the 44px coarse floor rides that class)", () => {
    const w = mountPanel();
    for (const sel of [UNDO, REDO, HINT]) {
      expect(w.get(sel).classes()).toContain("icon-btn");
    }
  });

  it("undo / redo / hint each emit their own event on tap", async () => {
    const w = mountPanel();
    await w.get(UNDO).trigger("click");
    await w.get(REDO).trigger("click");
    await w.get(HINT).trigger("click");
    expect(w.emitted("undo")).toHaveLength(1);
    expect(w.emitted("redo")).toHaveLength(1);
    expect(w.emitted("hint")).toHaveLength(1);
  });

  it("the play tools disable with the board (loading)", () => {
    const w = mountPanel({ loading: true });
    for (const sel of [UNDO, REDO, HINT]) {
      expect(w.get(sel).attributes("disabled")).toBeDefined();
    }
  });
});
