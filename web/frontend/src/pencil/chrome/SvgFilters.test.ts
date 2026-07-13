import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SvgFilters from "./SvgFilters.vue";
import {
  FILTER_PRESETS,
  wobblePoseFrequencies,
  wobblePoseId,
} from "@pencil/config/pencilConfig";

// FE-unit layer (T4-W2): the SVG-filter REGISTRY contract, migrated out of
// e2e/visual-regression.spec.ts (Test 1) into a jsdom mount — it never needed a real browser,
// only that SvgFilters renders one `<filter>`/`<linearGradient>` def per preset. The rendered
// PIXELS of these filters stay in the golden system (visual-golden.spec.ts); the CSS-cascade
// asserts (crayon vars, font-family, box-shadow) stay in e2e — jsdom applies no stylesheet.

describe("SvgFilters — filter registry DOM contract", () => {
  const wrapper = mount(SvgFilters);
  const has = (id: string) => wrapper.find(`[id="${id}"]`).exists();

  // P4 rule (T4-W4): every emitted BASE filter def must have a live `url(#id)` consumer.
  // These five are the base defs with a consumer (grep `url(#…)` across src); the pose
  // defs (`${id}-p{n}`) are a separate, live surface excluded below.
  const CONSUMED_BASE_DEFS = [
    "grain-static",
    "wobble-celestial",
    "wobble-heart",
    "stroke-light",
    "stroke-dark",
  ];
  // Orphaned base defs — retired at T4-W4: grain-outline is baked into the outline pose
  // geometry (gridPaths §Grain bake); wobble-logo is consumed only as its `-p{i}` pose
  // stack (HandwrittenLogo). Neither has a `url(#id)` consumer, so neither ships a base def.
  const ORPHAN_BASE_DEFS = ["grain-outline", "wobble-logo"];

  it("registers a base def for every consumed preset", () => {
    for (const id of CONSUMED_BASE_DEFS) expect(has(id), id).toBe(true);
  });

  it("emits NO orphan base def — P4: every base def id has a consumer", () => {
    for (const id of ORPHAN_BASE_DEFS) expect(has(id), id).toBe(false);
    // The standing check: the set of emitted base `<filter>` ids (pose defs `${id}-p{n}`
    // excluded) must equal the consumed set exactly — an orphan base def (a filter with no
    // `url(#id)` consumer) would add an id outside CONSUMED_BASE_DEFS and red this line.
    const baseFilterIds = wrapper
      .findAll("filter")
      .map((f) => f.attributes("id") ?? "")
      .filter((id) => id && !/-p\d+$/.test(id));
    expect([...baseFilterIds].sort()).toEqual([...CONSUMED_BASE_DEFS].sort());
  });

  it("registers exactly one frozen pose variant per declared pose frequency (T3-W13 §1-P3)", () => {
    for (const id of ["wobble-logo", "wobble-celestial", "wobble-heart"]) {
      const poses = wobblePoseFrequencies(FILTER_PRESETS[id]);
      expect(poses.length).toBeGreaterThan(0);
      for (let i = 0; i < poses.length; i++) {
        expect(has(wobblePoseId(id, i)), wobblePoseId(id, i)).toBe(true);
      }
    }
  });

  it("registers the sparkle-rainbow and solver-ink gradients", () => {
    expect(has("sparkle-rainbow")).toBe(true);
    expect(has("solver-ink")).toBe(true);
  });
});
