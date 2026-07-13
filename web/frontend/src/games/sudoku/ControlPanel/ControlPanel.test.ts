import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ControlPanel from "./ControlPanel.vue";

// FE-unit layer (T4-WM §2 — the touch affordances). Before this wave hint/undo/redo had
// ZERO touch surface: hint was H-key-only, undo/redo ⌘Z-only, and the legend documenting
// them is display:none on coarse (r2 §3) — a touch user could not reach them at all. This
// pins the coarse play-tools row: three real <button>s in the icon-btn grammar, written
// sublabels, each relaying its own emit (the game routes undo/redo to the composable and
// hint to the board's focused-cell method). The 44px floor + coarse-only display are CSS
// media claims (jsdom applies no stylesheet — this layer's standing caveat), so they ride
// the mobile e2e; here we pin the DOM contract + the wiring.

function mountPanel(overrides: Record<string, unknown> = {}) {
  return mount(ControlPanel, {
    props: {
      size: 9,
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

describe("Sudoku ControlPanel — touch play tools (T4-WM §2)", () => {
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

  it("the play tools disable with the board (loading) — no undo mid-solve", () => {
    const w = mountPanel({ loading: true });
    for (const sel of [UNDO, REDO, HINT]) {
      expect(w.get(sel).attributes("disabled")).toBeDefined();
    }
  });
});
