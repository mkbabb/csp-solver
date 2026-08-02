import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import GameCard from "./GameCard.vue";
import type { GalleryCard } from "./types";

// T5-W3 row 3.3 — THE PICKER PUBLISHES FIVE.
//
// The card is an `option` in the deck's listbox. `inert` on the OPTION ROOT strips the whole
// node from the accessibility tree — the browser then publishes a one-item listbox (r1 H3 /
// r2 §H3: `["sudoku, 1 of 5"]` through CDP, four flanks eaten). The name and `aria-selected`
// were always correct; nothing could read them.
//
// So the split asserted here: the option ROOT is never inert (it is the thing being named),
// and the card's interactive INTERNALS are — which is what actually bought the no-tab-stop
// property. The click suppression that root-`inert` also provided is asserted separately
// below, because it is now carried by the handler's own guard and a silent regression there
// would let a flank be selected by pointer.
//
// jsdom does not reflect the `inert` IDL attribute, so presence is asserted, never the value
// (a browser renders `inert=""`, jsdom `inert="true"`). The AX-tree half of this row is
// e2e/a11y.spec.ts 3.3, in both engines.

const card: GalleryCard = {
  id: "futoshiki",
  name: "futoshiki",
  range: { label: "5×5 – 9×9", levels: ["easy", "hard"] },
  staging: {
    size: { label: "size", options: [{ value: 5, label: "5×5" }], default: 5 },
    difficulty: {
      label: "difficulty",
      options: [{ value: "EASY", label: "Easy" }],
      default: "EASY",
    },
  },
  poster: () => Promise.resolve({ template: "<div class='poster' />" }),
};

function mountCard(isActive: boolean, extra: Record<string, unknown> = {}) {
  return mount(GameCard, {
    props: { card, index: 1, count: 5, isActive, pose: 0, ...extra },
    // The frame is a boil surface with nothing to say about semantics; stubbing it keeps this
    // unit on the AX contract and off the pencil chain.
    global: { stubs: { HandDrawnOutline: true } },
  });
}

const inertOn = (w: ReturnType<typeof mountCard>, sel: string) =>
  w.get(sel).attributes("inert") !== undefined;

describe("GameCard — the option publishes even when it is a flank", () => {
  it("a flank's option root is NOT inert — the deck's other four stay AX-visible", () => {
    expect(inertOn(mountCard(false), '[role="option"]')).toBe(false);
  });

  it("a flank's interactive internals ARE inert — no invisible tab stops in the deck", () => {
    expect(inertOn(mountCard(false), ".game-card-deal")).toBe(true);
  });

  it("nothing between the option root and the card's own box strips the node", () => {
    const w = mountCard(false);
    const root = w.get('[role="option"]').element;
    expect(root.hasAttribute("inert")).toBe(false);
    expect(root.getAttribute("aria-hidden")).toBe(null);
    // The name and the selection state were never the defect — they are the control.
    expect(root.getAttribute("aria-label")).toBe("futoshiki, 2 of 5");
    expect(root.getAttribute("aria-selected")).toBe("false");
  });

  it("the centered card is inert nowhere — it is the one live, interactive card", () => {
    const w = mountCard(true);
    expect(inertOn(w, '[role="option"]')).toBe(false);
    expect(inertOn(w, ".game-card-deal")).toBe(false);
    expect(w.get('[role="option"]').attributes("aria-selected")).toBe("true");
  });
});

describe("GameCard — the click gate root-inert used to provide", () => {
  it("a flank cannot be selected by pointer", async () => {
    const w = mountCard(false);
    await w.get('[role="option"]').trigger("click");
    expect(w.emitted("select")).toBeUndefined();
  });

  it("a centered card under an armed guard cannot be selected by pointer", async () => {
    const w = mountCard(true, { guard: true });
    await w.get('[role="option"]').trigger("click");
    expect(w.emitted("select")).toBeUndefined();
  });

  it("the centered card selects — the gate is a gate, not an amputation", async () => {
    const w = mountCard(true);
    await w.get('[role="option"]').trigger("click");
    expect(w.emitted("select")).toHaveLength(1);
  });
});
