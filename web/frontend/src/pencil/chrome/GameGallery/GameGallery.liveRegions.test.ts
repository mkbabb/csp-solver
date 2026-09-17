import { describe, it, expect, beforeAll } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import GameGallery from "./GameGallery.vue";
import type { GalleryCard } from "./types";

/**
 * T9-W3 §3.4 — THE DECK'S TWO REGIONS, held to the same law as the well's three.
 *
 * The gallery is where the estate got this right first (T5-W3 §3.2): both regions are born
 * empty, live for the deck's whole life, and take their content as a mutation. These rows are
 * GREEN AT HEAD by measurement and they are here so that the CONVERGENCE cannot quietly lose
 * what the hand-rolled version already had — the shared idiom now supplies both, and a shared
 * mechanism that regressed one site would otherwise be caught by nothing.
 *
 * The claim every row makes is NODE IDENTITY across the transition: the region an assistive
 * technology was watching before is the region the words landed in.
 */

// jsdom provisions neither; `useCarouselGlide` observes the viewport on mount and the FLIP tween
// asks for WAAPI. Neither is under test — stub, don't skip.
beforeAll(() => {
  const g = globalThis as unknown as { ResizeObserver?: unknown };
  g.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.animate ??= (() => ({
    cancel() {},
    finish() {},
    onfinish: null,
  })) as unknown as typeof Element.prototype.animate;
});

const axis = (value: number | string, label: string) => ({
  label,
  options: [{ value, label: String(value) }],
  default: value,
});

const card = (id: string): GalleryCard => ({
  id,
  name: id,
  range: { label: "", levels: [] },
  staging: { size: axis(3, "size"), difficulty: axis("EASY", "difficulty") },
  poster: () => Promise.resolve({ template: "<i />" } as never),
});

function mountGallery(props: Record<string, unknown> = {}) {
  return mount(GameGallery, {
    attachTo: document.body,
    props: {
      cards: [card("sudoku"), card("futoshiki")],
      snappedIndex: 0,
      ...props,
    },
    global: {
      stubs: {
        GameCard: true,
        StagingBand: true,
        HandDrawnOutline: { template: "<div><slot /></div>" },
      },
    },
  });
}

type Wrapper = ReturnType<typeof mountGallery>;

const node = (w: Wrapper, sel: string) => w.get(sel).element;
const said = (w: Wrapper, sel: string) => w.get(sel).text().trim();

/** A dirty board on a shared table is what arms the select ribbon (the live pass killed the
 *  solo arm: a solo select is lossless under M12 persistence). */
const SHARED = {
  dirty: true,
  currentId: "futoshiki",
  session: {
    inRoom: true,
    players: [
      { id: "you", slug: "you", ink: {} },
      { id: "peer", slug: "peer", ink: {} },
    ],
  },
};

describe("GameGallery — the deck's live regions (T9-W3 §3.4)", () => {
  it("both regions are in the document at mount, and both are silent", () => {
    const w = mountGallery();
    expect(said(w, ".gallery-live")).toBe("");
    expect(said(w, ".gallery-guard-live")).toBe("");
    w.unmount();
  });

  it("the deck's first word arrives INTO the region that mounted empty", async () => {
    const w = mountGallery();
    const region = node(w, ".gallery-live");
    // The mount hook announces the centred card AFTER the tree is in the document — which is
    // the whole mechanism: the first utterance is a mutation, not a birth.
    await flushPromises();
    expect(node(w, ".gallery-live")).toBe(region);
    expect(said(w, ".gallery-live")).toContain("sudoku");
    w.unmount();
  });

  it("a step lands in that same region", async () => {
    const w = mountGallery();
    await flushPromises();
    const region = node(w, ".gallery-live");
    await w.get(".gallery-viewport").trigger("keydown", { key: "ArrowRight" });
    await flushPromises();
    expect(node(w, ".gallery-live")).toBe(region);
    expect(said(w, ".gallery-live")).toContain("futoshiki");
    w.unmount();
  });

  it("the guard arms into the assertive region that was already there, and retiring empties it", async () => {
    const w = mountGallery(SHARED);
    await flushPromises();
    const region = node(w, ".gallery-guard-live");
    expect(said(w, ".gallery-guard-live")).toBe("");

    await w.get(".gallery-viewport").trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(node(w, ".gallery-guard-live")).toBe(region);
    expect(said(w, ".gallery-guard-live")).not.toBe("");

    await w.get(".gallery-viewport").trigger("keydown", { key: "Escape" });
    await flushPromises();
    expect(node(w, ".gallery-guard-live")).toBe(region);
    // Nothing stale can be re-read off the page.
    expect(said(w, ".gallery-guard-live")).toBe("");
    w.unmount();
  });

  it("the deck's chatter never lands in the assertive region", async () => {
    const w = mountGallery();
    await flushPromises();
    await w.get(".gallery-viewport").trigger("keydown", { key: "ArrowRight" });
    await flushPromises();
    expect(said(w, ".gallery-guard-live")).toBe("");
    w.unmount();
  });
});
