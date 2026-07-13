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

// T4-W8 — the fill-forced partial-solve button (W7's fillAllForced). The panel only reports
// the press; the game routes it to the composable's `fillForced`, which inks the forced cells
// through the existing reveal draw-in. Pins the control-panel affordance: a real <button> in the
// icon-btn grammar (the ≥44px WM floor rides that class), a written sublabel, its own emit, and
// the loading-disable so no forced fill fires mid-solve.
const FILL_SUBLABEL = "Fill";

describe("Sudoku ControlPanel — fill-forced button (T4-W8)", () => {
  it("renders a Fill button in the icon-btn grammar with a written sublabel", () => {
    const w = mountPanel();
    const fill = w.get(FILL);
    expect(fill.classes()).toContain("icon-btn");
    expect(fill.find(".icon-sublabel").text()).toBe(FILL_SUBLABEL);
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

// T4-WU/U3 — the conditional confirm (dirty-gated two-tap on Deal + Clear) is COARSE-ONLY, per the
// shipped Clear precedent. jsdom presents a FINE pointer (no matchMedia coarse), so Deal and Clear
// commit on a SINGLE click here regardless of isDirty — the two-tap arm rides the coarse mobile e2e
// (mobile-affordances). This pins the desktop/fine path: one click, one emit, dirty or not.
describe("Sudoku ControlPanel — Deal / Clear one-click on a fine pointer (T4-WU/U3 coarse-only)", () => {
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
