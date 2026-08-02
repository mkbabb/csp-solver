import { describe, it, expect, vi, afterEach } from "vitest";
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

/**
 * T5-W4 pass 6 — THE BERTH IS PART OF THE MOUNT NOW, and it is not a test convenience.
 *
 * On the portrait dock the play verbs are TELEPORTED out of the card into the scene's
 * `#fold-tools` band, so they can be reached with the sheet shut. `GameScene` mints that berth;
 * this file mounts the SHELL alone, so it must mint it too or the Teleport has nowhere to land
 * — and jsdom's `matchMedia` stub reports no match for `(min-width: 1024px)`, which puts every
 * mount here in exactly the regime that teleports.
 *
 * This was found by SIX RED ROWS, not by reading: without a berth the target resolves null,
 * the play tools leave the tree, and the render then crashes downstream (which is how two rows
 * that never touch a play verb — fill-forced, the fine-pointer Clear — went red with them).
 * `defer` on the Teleport is the other half of the same lesson, and it lives in the component:
 * `GameScene` mints `#fold-tools` AFTER the panel in its own template, so an undeferred
 * Teleport resolves its target too early and loses the tools in the real app the same way.
 */
function mountPanel(overrides: Record<string, unknown> = {}) {
  document.getElementById("fold-tools")?.remove();
  const berth = document.createElement("div");
  berth.id = "fold-tools";
  document.body.appendChild(berth);
  return mount(GameControlPanel, {
    attachTo: document.body,
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

/**
 * The play verbs are read FROM THE BERTH, and that is the assertion as much as the mechanism:
 * on the portrait dock these four must be reachable with the sheet shut, which is only true if
 * they are in `#fold-tools` and not in the card. A `wrapper.get()` would search the component's
 * own subtree and cannot see them — so a row that still passed through the wrapper would be a
 * row that had stopped watching the thing it is for.
 */
const inFold = (sel: string): HTMLElement => {
  const el = document.querySelector<HTMLElement>(`#fold-tools ${sel}`);
  if (!el) throw new Error(`no ${sel} in the fold's play-verbs band`);
  return el;
};

describe("GameControlPanel — touch play tools (T4-WM §2, T5-W4 pass 6: in the fold)", () => {
  it("renders tappable undo / redo / hint buttons with written sublabels, IN the fold band", () => {
    mountPanel();
    expect(inFold(UNDO).querySelector(".icon-sublabel")!.textContent).toBe("Undo");
    expect(inFold(REDO).querySelector(".icon-sublabel")!.textContent).toBe("Redo");
    expect(inFold(HINT).querySelector(".icon-sublabel")!.textContent).toBe("Hint");
    // …and the card does NOT also hold a copy. One tree, one instance: a teleport that left a
    // twin behind would double every one of these verbs.
    expect(document.querySelectorAll(`${UNDO}`).length).toBe(1);
  });

  it("each play button carries the .icon-btn grammar (the 44px coarse floor rides that class)", () => {
    mountPanel();
    for (const sel of [UNDO, REDO, HINT]) {
      expect([...inFold(sel).classList]).toContain("icon-btn");
    }
  });

  it("the peek chip joins them, and its visible word IS its accessible name", () => {
    // Graft G2: the divider's hold cannot work from inside a raised sheet, so the gesture
    // rehomes here. One string does both jobs — no aria-label to drift away from the ink.
    mountPanel();
    const chip = inFold(".peek-chip");
    expect([...chip.classList]).toContain("icon-btn");
    expect(chip.textContent!.trim()).toBe("peek");
    expect(chip.getAttribute("aria-label")).toBeNull();
  });

  it("undo / redo / hint each emit their own event on tap", async () => {
    const w = mountPanel();
    for (const sel of [UNDO, REDO, HINT]) inFold(sel).click();
    await w.vm.$nextTick();
    expect(w.emitted("undo")).toHaveLength(1);
    expect(w.emitted("redo")).toHaveLength(1);
    expect(w.emitted("hint")).toHaveLength(1);
  });

  it("the play tools disable with the board (loading) — no undo mid-solve", () => {
    mountPanel({ loading: true });
    for (const sel of [UNDO, REDO, HINT]) {
      expect(inFold(sel).hasAttribute("disabled")).toBe(true);
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

  // T5-W3 row 3.6 (a11y r1 M9). The mobile tab was `<button><h2 class="section-heading">`:
  // `<button>` takes phrasing content and `<h2>` is flow content, so the nesting was invalid
  // and its parse — hence the tab's accessible name — engine-dependent; the AX tree carried
  // the heading role anyway, which put an H-key reader INSIDE an interactive control with an
  // ambiguous next keystroke. The APG disclosure shape is the inverse. Both halves are gated:
  // the heading wraps the button, and no heading survives inside one.
  it("the mobile tab is a heading WRAPPING a button, never a heading inside one", () => {
    const w = mountPanel();
    const tabs = w.findAll(".mobile-heading-row .mobile-heading-btn");
    expect(tabs).toHaveLength(2);
    for (const tab of tabs) {
      expect(tab.element.tagName).toBe("BUTTON");
      expect(
        tab.element.parentElement?.tagName,
        "the tab's parent is its heading",
      ).toBe("H2");
      expect(
        tab.findAll("h1,h2,h3,h4,h5,h6"),
        "no heading inside the control",
      ).toHaveLength(0);
    }
    // The heading is box-less by class contract, so the row's flex layout is untouched.
    expect(w.findAll("h2.mobile-heading-head")).toHaveLength(2);
    // The name each tab announces is unchanged: the section's word, and the eyebrow's own
    // `aria-label` where the section declares one, still ride the element inside the button —
    // so the button's name-from-content computes exactly what it computed before.
    const eyebrows = w.findAll(".mobile-heading-btn .section-heading");
    expect(eyebrows.map((h) => h.text())).toEqual(["Size", "Difficulty"]);
    expect(eyebrows.map((h) => h.attributes("aria-label"))).toEqual(
      SECTIONS.map((s) => ("ariaLabel" in s ? s.ariaLabel : undefined)),
    );
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
    expect(mountPanel().get(".check-status").text()).toContain("ask again");
    const marking = mountPanel({ proactiveCheck: true });
    expect(marking.get(".check-status").text()).toContain("showing mistakes");
    expect(marking.get(".check-status").classes()).toContain("is-marking");
  });
});

// ── The hold-to-peek recognizer (F3 pass-1 blocker 3) ──────────────────────────────────
// The band self-cancelling on slop was ASSERTED by F3's spec and false against the code:
// there was no `pointermove` handler at all, and on touch `pointerleave` never fires once
// implicit capture lands, so a drag that began on the divider still flashed the answer key
// at 350ms. These rows pin the recognizer's two halves against each other — the second is
// the negative control, and it reds if the slop test is ever "passed" by disarming the hold.
describe("hold-to-peek — a hold is a press that stays", () => {
  afterEach(() => vi.useRealTimers());

  // jsdom's MouseEvent keeps clientX/clientY read-only, so test-utils' `trigger` options
  // cannot carry them — the gesture has to be dispatched as a real event or the probe is
  // measuring a pointer that never moved.
  const at = (type: string, x: number, y: number) =>
    new MouseEvent(type, { clientX: x, clientY: y, bubbles: true });

  const press = async (w: ReturnType<typeof mountPanel>, moves: [number, number][]) => {
    const band = w.get(".peek-hold-surface").element;
    band.dispatchEvent(at("pointerdown", 100, 100));
    for (const [x, y] of moves) band.dispatchEvent(at("pointermove", x, y));
    vi.advanceTimersByTime(400);
    await w.vm.$nextTick();
    return w.emitted("peek-start");
  };

  it("a drag off the band cancels the pending hold — no answer-key flash mid-gesture", async () => {
    vi.useFakeTimers();
    // 60px up: a deliberate drag, well past the 10px slop.
    expect(
      await press(mountPanel(), [
        [102, 96],
        [100, 40],
      ]),
    ).toBeUndefined();
  });

  it("a still press — and a hand's own 4px tremor — still peeks", async () => {
    vi.useFakeTimers();
    expect(await press(mountPanel(), [])).toHaveLength(1);
    expect(
      await press(mountPanel(), [
        [103, 97],
        [98, 102],
      ]),
    ).toHaveLength(1);
  });
});
