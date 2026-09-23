import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import PlayerMark from "../src/pencil/chrome/PlayerMark/PlayerMark.vue";
import type { MarkRow, PlaceInput } from "../src/pencil/chrome/PlayerMark/types";
const ROWS: MarkRow[] = [
  { id: "me", name: "swift-heron", ink: { "--color-user-ink": "#2563eb" }, self: true },
  { id: "p1", name: "brave-otter", ink: { "--color-user-ink": "#c026d3" }, self: false },
  { id: "p2", name: "calm-wren", ink: { "--color-user-ink": "#65a30d" }, self: false },
];
const place = (cursors: Record<string, number | null>, self: number | null = 40): PlaceInput => ({ size: 9, subgrid: 3, cursors, self, settleMs: 700 });
const dots = () => [...document.querySelectorAll<SVGCircleElement>("[data-lobby] .chart-dot")].map((d) => d.dataset.peer);
beforeEach(() => vi.useFakeTimers());
afterEach(() => { vi.useRealTimers(); document.body.innerHTML = ""; });

// K-GHOST: p2 sends its FIRST cur after the open (not in the seed, so not in `settled`), then the
// room's cur map empties (clearCursors on a new epoch) inside p2's 700 ms. The leave loop walks
// `settled` only, so p2's pending timer survives and draws p2 on a cell of the OLD board.
it("K-GHOST: an epoch clear inside a first move's settle window leaves no dot", async () => {
  const w = mount(PlayerMark, { attachTo: document.body, props: { ink: {}, rows: ROWS, place: place({ p1: 10 }) } });
  await w.find("button").trigger("click");
  expect(dots()).toEqual(["p1"]);
  await w.setProps({ place: place({ p1: 10, p2: 55 }) });
  vi.advanceTimersByTime(300);
  await w.setProps({ place: place({}) }); // clearCursors: peerCursors = {}
  await w.vm.$nextTick();
  expect(dots(), "right after the clear").toEqual([]);
  vi.advanceTimersByTime(1000);
  await w.vm.$nextTick();
  expect(dots(), "1000 ms after the clear, nobody has sent a cur on the new board").toEqual([]);
  w.unmount();
});

// K-LEAVE: same leak through a leave (p2 dropped from the map while its row stays, e.g. a cursor
// expiry or a bye whose roster row lags).
it("K-LEAVE: a peer dropped from the map inside its first settle window draws no dot", async () => {
  const w = mount(PlayerMark, { attachTo: document.body, props: { ink: {}, rows: ROWS, place: place({ p1: 10 }) } });
  await w.find("button").trigger("click");
  await w.setProps({ place: place({ p1: 10, p2: 55 }) });
  vi.advanceTimersByTime(300);
  await w.setProps({ place: place({ p1: 10 }) });
  vi.advanceTimersByTime(1000);
  await w.vm.$nextTick();
  expect(dots()).toEqual(["p1"]);
  w.unmount();
});

// K-SEEDED control: the same clear for a peer that WAS in the seed (in `settled`) — the loop sees it.
it("K-SEEDED (control): a seeded peer's pending move is cancelled by the clear", async () => {
  const w = mount(PlayerMark, { attachTo: document.body, props: { ink: {}, rows: ROWS, place: place({ p1: 10, p2: 20 }) } });
  await w.find("button").trigger("click");
  await w.setProps({ place: place({ p1: 10, p2: 55 }) });
  vi.advanceTimersByTime(300);
  await w.setProps({ place: place({}) });
  vi.advanceTimersByTime(1000);
  await w.vm.$nextTick();
  expect(dots()).toEqual([]);
  w.unmount();
});
