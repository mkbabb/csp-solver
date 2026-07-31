import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import GameControlPanel from "./GameControlPanel.vue";

// FE-unit layer for the control SHELL. This file replaces the two per-game
// `ControlPanel/ControlPanel.test.ts` twins: those mounted a thin relay wrapper and then
// asserted the shell's DOM through it, so every claim below was made twice against one
// implementation. The wrappers are gone (the scenes mount this shell directly, as
// thermo/killer/kenken always did) and the contract is pinned once, here.
//
// Covered, verbatim from the twins:
//   · T4-WM §2 — the coarse play-tools row (undo / redo / hint): real <button>s in the
//     icon-btn grammar, written sublabels, per-button emits, loading-disable.
//   · T4-W8 — the fill-forced button.
//   · T4-WU/U3 — Deal / Clear commit on ONE click at a FINE pointer even when dirty (jsdom
//     presents a fine pointer; the coarse two-tap arm rides the mobile e2e).
// The 44px floor and the coarse-only display are CSS media claims — jsdom applies no
// stylesheet (this layer's standing caveat), so they ride e2e/mobile-affordances.
//
// COVERAGE, counted not asserted: 18 tests out (9 + 9), 10 in — the twins' 9 names collapse
// one-for-one and the 10th is new. Net −8, and the two per-scene wirings the deletion created
// are NOT covered here: this file mounts the shell against a synthetic SECTIONS literal, so
// sudoku's inline list and futoshiki's `futoshikiGame.options(futoshiki)` route are out of its
// reach by construction. They are covered instead by `games/sudoku/game.test.ts` (the eager
// scene's hand copy ≡ the declaration, with a live-model behavioural leg).
// T4-P1 adds 3 rows here (the zone grammar's composition contract) and a `CheckStatus.test.ts`
// of 9; the RANKS and the tap floor those names are written at are CSS and ride
// e2e/zone-grammar.spec.ts, because a layer that applies no stylesheet cannot witness a rank.

const SECTIONS = [
  {
    key: "size",
    heading: "Size",
    ariaLabel: "Size",
    options: [
      { value: 3, label: "9×9" },
      { value: 4, label: "16×16" },
    ],
    selected: 3,
    onChange: () => {},
  },
  {
    key: "difficulty",
    heading: "Difficulty",
    options: [
      { value: "EASY", label: "easy" },
      { value: "HARD", label: "hard" },
    ],
    selected: "EASY",
    onChange: () => {},
  },
];

function mountPanel(overrides: Record<string, unknown> = {}) {
  return mount(GameControlPanel, {
    props: {
      sections: SECTIONS,
      loading: false,
      isDirty: false,
      mobile: true,
      pencilMode: "off",
      errorCheckMode: "on-demand",
      proactiveCheck: false,
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
const DEAL = 'button[aria-label="Deal a new board"]';
const CLEAR = 'button[aria-label="Clear board"]';

describe("GameControlPanel — touch play tools (T4-WM §2)", () => {
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

describe("GameControlPanel — fill-forced button (T4-W8)", () => {
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

describe("GameControlPanel — Deal / Clear one-click on a fine pointer (T4-WU/U3 coarse-only)", () => {
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

// The wrapper deletion's own guard: the Deal button carries BOTH classes. That pair is what
// the shipped rule `.icon-btn.deal-btn` (0,2,0) selects on — the ORDER-PROOF form Lane D
// ruled in over a source-order move, after a bare `.deal-btn` tied `.icon-btn` at (0,1,0),
// lost on order, and crushed the 28px die to 17.6 on every fine pointer. The rendered
// geometry rides e2e/visual-regression "the Deal die is not crushed"; the class pair is the
// half a jsdom layer can see, and the rule cannot match without it.
describe("GameControlPanel — the .deal-btn cascade (Lane D ship 1)", () => {
  it("Deal wears the icon-btn base plus the deal-btn modifier", () => {
    const w = mountPanel();
    expect(w.get(DEAL).classes()).toEqual(
      expect.arrayContaining(["icon-btn", "deal-btn"]),
    );
  });
});

// T4-P1 · the zone grammar's composition contract — the half that needs no browser. The
// RANKS (which register each name is written at, and the 44px floor) are CSS claims and ride
// e2e/zone-grammar.spec.ts; what this layer owns is that the card mounts three named wells,
// that each name is the visible tape the group points at, and that the check state actually
// reaches the status line from the prop.
describe("GameControlPanel — the zone grammar (T4-P1)", () => {
  it("three wells, each a group named by its own visible tape", () => {
    const w = mountPanel();
    const wells = w.findAll(".tray-well");
    expect(wells).toHaveLength(3);
    expect(w.findAll(".washi-tag").map((t) => t.text())).toEqual([
      "new game",
      "pencils",
      "teacher's",
    ]);
    for (const well of wells) {
      expect(well.attributes("role")).toBe("group");
      const id = well.attributes("aria-labelledby")!;
      const tag = well.find(`#${id}`);
      expect(tag.exists()).toBe(true);
      expect(tag.classes()).toContain("washi-tag");
      // A tag is a label, not a tooltip — `role="tooltip"` would make it an illegal
      // aria-labelledby target, which is the defect pass 1 fought from the outside.
      expect(tag.attributes("role")).toBeUndefined();
    }
  });

  it("six co-equal eyebrows become two, and the four that left are named one rank down", () => {
    const w = mountPanel();
    expect(w.findAll(".section-heading").map((h) => h.text())).toEqual([
      "Size",
      "Difficulty",
    ]);
    expect(w.findAll(".zone-row-label").map((l) => l.text())).toEqual([
      "marks",
      "candidates",
    ]);
  });

  it("proactiveCheck reaches the status line — the decay the card never showed", () => {
    expect(mountPanel().get(".check-status").text()).toContain("Ask again");
    const marking = mountPanel({ proactiveCheck: true });
    expect(marking.get(".check-status").text()).toContain("showing mistakes");
    expect(marking.get(".check-status").classes()).toContain("is-marking");
  });
});
