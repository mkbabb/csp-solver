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
      isDirty: false,
      solveState: "idle",
      mobile: true,
      pencilMode: "off",
      errorCheckMode: "on-demand",
      candidatesPinned: false,
      share: () => Promise.resolve(),
      ...overrides,
    },
  });
}

const UNDO = 'button[aria-label="Undo last move"]';
const REDO = 'button[aria-label="Redo move"]';
const HINT = 'button[aria-label="Reveal a hint in the selected cell"]';
const FILL = 'button[aria-label="Fill in the forced cells"]';

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

// T4-W8 (twin of the sudoku panel's) — the fill-forced partial-solve button (W7's fillAllForced).
// The panel reports the press; the game routes it to the futoshiki composable's `fillForced`,
// which inks the forced cells through the existing reveal draw-in.
describe("Futoshiki ControlPanel — fill-forced button (T4-W8)", () => {
  it("renders a Fill button in the icon-btn grammar with a written sublabel", () => {
    const w = mountPanel();
    const fill = w.get(FILL);
    expect(fill.classes()).toContain("icon-btn");
    expect(fill.find(".icon-sublabel").text()).toBe("Fill");
  });

  it("emits fill-forced on tap", async () => {
    const w = mountPanel();
    await w.get(FILL).trigger("click");
    expect(w.emitted("fill-forced")).toHaveLength(1);
  });

  it("disables with the board (loading) — no forced fill mid-solve", () => {
    const w = mountPanel({ loading: true });
    expect(w.get(FILL).attributes("disabled")).toBeDefined();
  });
});

// T4-WU/U3 (twin of the sudoku panel's) — the conditional confirm (dirty-gated two-tap on Deal +
// Clear) is COARSE-ONLY. jsdom presents a FINE pointer, so Deal and Clear commit on a SINGLE click
// regardless of isDirty; the two-tap arm rides the coarse mobile e2e. Pins the fine path: one click.
describe("Futoshiki ControlPanel — Deal / Clear one-click on a fine pointer (T4-WU/U3 coarse-only)", () => {
  const DEAL = 'button[aria-label="Deal a new board"]';
  const CLEAR = 'button[aria-label="Clear board"]';
  it("Deal emits once on a single fine-pointer click, even when the board is dirty", async () => {
    const w = mountPanel({ isDirty: true });
    await w.get(DEAL).trigger("click");
    expect(w.emitted("deal")).toHaveLength(1);
  });
  it("Clear emits once on a single fine-pointer click, even when the board is dirty", async () => {
    const w = mountPanel({ isDirty: true });
    await w.get(CLEAR).trigger("click");
    expect(w.emitted("clear")).toHaveLength(1);
  });
});
