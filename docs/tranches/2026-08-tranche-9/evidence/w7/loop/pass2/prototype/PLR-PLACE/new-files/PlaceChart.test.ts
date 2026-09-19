import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import PlaceChart from "@games/shared/PlaceChart.vue";

/**
 * G14 (pitch) and G15 (no ink, no dot) — T9-W7 PLR-PLACE.
 *
 * The chart is geometry, so most of it is provable without a browser. What a browser is for is
 * the PAINT, and that is G2/G13's business on the real surface.
 */
const base = { size: 9, subgrid: 3, peers: [], self: null, queried: null };

describe("PlaceChart — the pitch is held", () => {
  it("is 10.667 CSS px per cell at every size", () => {
    for (const [size, side] of [
      [4, 42.666666666666664],
      [9, 96],
      [16, 170.66666666666666],
    ] as const) {
      const w = mount(PlaceChart, {
        props: { ...base, size, subgrid: Math.sqrt(size) | 0 || size },
      });
      expect(+w.find("svg").attributes("width")!).toBeCloseTo(side, 6);
      w.unmount();
    }
  });

  it("draws a dot of r 4 CSS px whatever the board is", () => {
    for (const [size, subgrid] of [
      [4, 2],
      [9, 3],
      [16, 4],
    ] as const) {
      const w = mount(PlaceChart, {
        props: {
          ...base,
          size,
          subgrid,
          peers: [{ id: "p1", ink: "#c026d3", pos: 0 }],
        },
      });
      // the viewBox is 1000 whatever the size, so r in USER units is 4 × (1000 / side)
      const r = +w.find(".chart-dot").attributes("r")!;
      const side = (32 / 3) * size;
      expect(r).toBeCloseTo(4 * (1000 / side), 6);
      // ...which is 8.00 painted px across, at every size
      expect((2 * r * side) / 1000).toBeCloseTo(8, 6);
      w.unmount();
    }
  });
});

describe("PlaceChart — a peer with no ink has no dot", () => {
  it("renders exactly the peers it was given, and never invents an ink", () => {
    const w = mount(PlaceChart, {
      props: {
        ...base,
        peers: [
          { id: "p1", ink: "#c026d3", pos: 10 },
          { id: "p2", ink: "#65a30d", pos: 40 },
        ],
      },
    });
    const dots = w.findAll(".chart-dot");
    expect(dots).toHaveLength(2);
    expect(dots.map((d) => d.attributes("fill"))).toEqual(["#c026d3", "#65a30d"]);
    // no dot carries the incumbent blue — the `?? --color-user-ink` fallback is dead, and a
    // stranger is never drawn in YOUR colour on your own chart
    expect(w.html()).not.toContain('fill="var(--color-user-ink)"');
  });

  it("is a RING at your own cell, stroked and never filled", () => {
    const w = mount(PlaceChart, { props: { ...base, self: 40 } });
    const ring = w.find(".chart-self");
    expect(ring.exists()).toBe(true);
    expect(ring.attributes("fill")).toBe("none");
    // stroke 2 CSS px, in user units
    expect(+ring.attributes("stroke-width")!).toBeCloseTo(2 * (1000 / 96), 6);
    expect(w.findAll(".chart-dot")).toHaveLength(0);
  });

  it("has no ring when your cell is unknown or hidden", () => {
    const w = mount(PlaceChart, { props: { ...base, self: null } });
    expect(w.find(".chart-self").exists()).toBe(false);
  });
});

describe("PlaceChart — the query dims the others and nothing else", () => {
  it("dims every dot but the queried one, and dims none when nothing is queried", () => {
    const peers = [
      { id: "p1", ink: "#c026d3", pos: 10 },
      { id: "p2", ink: "#65a30d", pos: 40 },
      { id: "p3", ink: "#0891b2", pos: 70 },
    ];
    const none = mount(PlaceChart, { props: { ...base, peers } });
    expect(none.findAll(".chart-dot.is-dimmed")).toHaveLength(0);
    const one = mount(PlaceChart, { props: { ...base, peers, queried: "p2" } });
    const dimmed = one.findAll(".chart-dot.is-dimmed");
    expect(dimmed).toHaveLength(2);
    expect(one.find('.chart-dot[data-peer="p2"]').classes()).not.toContain("is-dimmed");
  });
});
