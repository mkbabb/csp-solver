import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DifficultyTally from "./DifficultyTally.vue";
import type { TallyDescriptor } from "./techniqueVoice";

// T5-W3 row 3.6 (a11y r1 L12) — THE DEAD TAB STOP.
//
// `role="img"` + `tabindex="0"`: the stop existed to trigger a hover/focus reveal that pass 4
// retired (the component's own note records the retirement; the `tabindex` stayed behind). The
// live tab order at 1440 had it sitting between "Deal a new board" and "Normal" — one Tab press
// onto something that activates nothing and reveals nothing, and whose name the reader has
// already heard, on every pass through the control cluster.
//
// The graphic itself is NOT retired: `role="img"` and the always-on `aria-label` stay, which is
// how a non-interactive graphic is published to a reader BROWSING the card. Both halves are
// asserted, so "cure" can never quietly become "delete the name too".

const descriptor: TallyDescriptor = {
  graded: true,
  filled: 1,
  total: 5,
  // pass 6 (dt-name): the label carries the EXACT step. It read "singles only" here, which was
  // the same sentence a naked-single board produced — the conflation F3-G3 measured.
  ariaLabel: "difficulty — needs a hidden single (1 of 5)",
};

const tally = (d: Partial<TallyDescriptor> = {}) =>
  mount(DifficultyTally, { props: { descriptor: { ...descriptor, ...d } } });

describe("DifficultyTally — a graphic, not a tab stop", () => {
  it("takes no tabindex: the retired reveal took its stop with it", () => {
    expect(tally().get(".difficulty-tally").attributes("tabindex")).toBeUndefined();
  });

  it("keeps the graphic role and the always-on name it announces", () => {
    const el = tally().get(".difficulty-tally");
    expect(el.attributes("role")).toBe("img");
    expect(el.attributes("aria-label")).toBe(descriptor.ariaLabel);
  });

  it("the ungraded arm is equally unfocusable and equally named", () => {
    const el = tally({
      graded: false,
      filled: 0,
      ariaLabel: "difficulty — not yet graded",
    }).get(".difficulty-tally");
    expect(el.attributes("tabindex")).toBeUndefined();
    expect(el.attributes("aria-label")).toBe("difficulty — not yet graded");
  });

  it("no descendant smuggles the stop back in", () => {
    expect(tally().findAll("[tabindex]")).toHaveLength(0);
  });
});
