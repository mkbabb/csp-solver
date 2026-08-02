import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SheetWashiLabel from "./SheetWashiLabel.vue";

// T5-W3 row 3.6 (a11y r1 L11) — THE TAPE IS A LABEL OR IT IS DECORATION. NEVER AN ORPHAN
// TOOLTIP.
//
// At `78448760` the default (hover/focus) tape carried `role="tooltip"` and the live AX tree
// carried five of them, while `aria-describedby` had ZERO hits estate-wide. An ARIA tooltip is
// a description a control POINTS AT; five that nothing points at are furniture in the reading
// order, and each one's text is its own button's `aria-label` re-spelled.
//
// The three arms are asserted together, because the distinction is the whole row:
//   tag        → a compartment's name; an `aria-labelledby` target; in the tree, no role.
//   persistent → the peek surface's name, pinned at opacity 1 on coarse; in the tree, no role.
//   default    → decoration; out of the tree, no role.
// A `role="tooltip"` returning to ANY arm reddens here, which is what the estate's own
// e2e/zone-grammar row asks for at the live layer.

const tape = (props: Record<string, unknown>) =>
  mount(SheetWashiLabel, { props: { text: "Deal", seed: 11, ...props } });

const attrs = (props: Record<string, unknown>) => {
  const a = tape(props).get("span").attributes();
  return { role: a.role, hidden: a["aria-hidden"] };
};

describe("SheetWashiLabel — no tape claims a role nothing points at", () => {
  it("the default hover/focus tape is decorative: no role, out of the tree", () => {
    expect(attrs({})).toEqual({ role: undefined, hidden: "true" });
  });

  it("the same is true of an explicit 'above' anchor and of a wide note", () => {
    expect(attrs({ anchor: "above" })).toEqual({ role: undefined, hidden: "true" });
    expect(attrs({ wide: true })).toEqual({ role: undefined, hidden: "true" });
  });

  it("a tag IS the name — it stays in the tree so `aria-labelledby` can reach it", () => {
    expect(attrs({ anchor: "tag" })).toEqual({ role: undefined, hidden: undefined });
  });

  it("a persistent tape IS the name of the surface it sits on — it stays in the tree", () => {
    expect(attrs({ anchor: "center", persistent: true })).toEqual({
      role: undefined,
      hidden: undefined,
    });
  });

  it("no arm carries role=tooltip", () => {
    for (const props of [
      {},
      { anchor: "above" },
      { anchor: "center" },
      { anchor: "tag" },
      { persistent: true },
      { anchor: "tag", persistent: true },
    ])
      expect(attrs(props).role, JSON.stringify(props)).toBeUndefined();
  });

  it("the text still renders in every arm — hiding it from AT never hides it from eyes", () => {
    expect(tape({}).text()).toBe("Deal");
    expect(tape({ anchor: "tag" }).text()).toBe("Deal");
  });
});
