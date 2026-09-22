import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import PlayerMark from "./PlayerMark.vue";
import type { MarkRow, PlaceInput } from "./types";

/**
 * THE SEATING CHART'S CLOCK (T9-W7 PLR-PLACE). The sheet OPENS on where the room is now and
 * damps only the moves that come after; a row with no dot asks the chart nothing.
 */
const ROWS: MarkRow[] = [
  { id: "me", name: "swift-heron", ink: { "--color-user-ink": "#2563eb" }, self: true },
  {
    id: "p1",
    name: "brave-otter",
    ink: { "--color-user-ink": "#c026d3" },
    self: false,
  },
  { id: "p2", name: "calm-wren", ink: { "--color-user-ink": "#65a30d" }, self: false },
  { id: "p3", name: "shy-lynx", ink: { "--color-user-ink": "#0891b2" }, self: false },
];
const place = (
  cursors: Record<string, number | null>,
  self: number | null = 40,
): PlaceInput => ({
  size: 9,
  subgrid: 3,
  cursors,
  self,
  settleMs: 700,
});

const dots = () =>
  [...document.querySelectorAll<SVGCircleElement>("[data-lobby] .chart-dot")].map(
    (d) => ({
      id: d.dataset.peer,
      cx: d.getAttribute("cx"),
      dim: d.classList.contains("is-dimmed"),
    }),
  );

function mountMark(cursors: Record<string, number | null>) {
  return mount(PlayerMark, {
    attachTo: document.body,
    props: { stateLine: "3 other players", ink: {}, rows: ROWS, place: place(cursors) },
  });
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = "";
});

// CRITIC (pass 4): a settle timer is ONE PEER's — nobody else's move may restart it.
describe("the hostage: one peer's clock is its own", () => {
  it("p2 moves once while p1 walks every 250 ms: p2 steps 700 ms after ITS move", async () => {
    const w = mountMark({ p1: 10, p2: 20, p3: 30 });
    await w.find("button").trigger("click");
    const before = dots().find((d) => d.id === "p2")!.cx;
    let p1 = 10;
    await w.setProps({ place: place({ p1, p2: 60, p3: 30 }) });
    for (let t = 250; t <= 1000; t += 250) {
      vi.advanceTimersByTime(250);
      p1 += 1;
      await w.setProps({ place: place({ p1, p2: 60, p3: 30 }) });
    }
    await w.vm.$nextTick();
    expect(dots().find((d) => d.id === "p2")!.cx, "p2 at +1000 ms").not.toBe(before);
    w.unmount();
  });
  it("your own cell moving (a new place object, same cursors) restarts no peer's clock", async () => {
    const w = mountMark({ p1: 10, p2: 20, p3: 30 });
    await w.find("button").trigger("click");
    const before = dots().find((d) => d.id === "p2")!.cx;
    const cursors = { p1: 10, p2: 60, p3: 30 };
    await w.setProps({ place: place(cursors, 40) });
    for (let t = 250, self = 41; t <= 1000; t += 250, self++) {
      vi.advanceTimersByTime(250);
      await w.setProps({ place: place(cursors, self) });
    }
    await w.vm.$nextTick();
    expect(dots().find((d) => d.id === "p2")!.cx, "p2 at +1000 ms").not.toBe(before);
    w.unmount();
  });
});
