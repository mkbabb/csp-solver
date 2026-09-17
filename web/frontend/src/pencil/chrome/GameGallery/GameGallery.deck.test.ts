import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import GameGallery from "./GameGallery.vue";
import GameCard from "./GameCard.vue";
import type { GalleryCard, GalleryPreview } from "./types";

/**
 * T8-W3 Lane B — THE DECK, at the unit layer.
 *
 * The geometry itself is a browser fact and is gated by the probe + `e2e/gallery.spec.ts` in
 * both engines. What lives here is everything the deck DECIDES rather than lays out: the depth
 * grade it hands each card, the read policy behind the true stills, and the ribbon's consent
 * copy in a session — where every branch is reachable in a millisecond and the strings are
 * checkable as equalities rather than as prose.
 */

/** THE DRIVABLE OBSERVER. jsdom ships none, and the deck hangs BOTH resize answers off one —
 *  the glide's track re-pin and (T9-W6 §6.4) the armed ribbon's re-anchor. A no-op stub makes
 *  the resize row below unfalsifiable rather than red, so this one collects every observing
 *  callback in construction order, which is the order a real broadcast delivers them in:
 *  `broadcastResize()` is the browser's own sequence, the deck re-pinning its track first and
 *  the ribbon re-measuring against the settled boxes second. */
const resizeBroadcast: Array<() => void> = [];
function broadcastResize() {
  for (const cb of [...resizeBroadcast]) cb();
}

beforeAll(() => {
  const g = globalThis as unknown as { ResizeObserver?: unknown };
  g.ResizeObserver = class {
    cb: () => void;
    constructor(cb: () => void) {
      this.cb = cb;
    }
    observe() {
      resizeBroadcast.push(this.cb);
    }
    unobserve() {}
    disconnect() {
      const at = resizeBroadcast.indexOf(this.cb);
      if (at >= 0) resizeBroadcast.splice(at, 1);
    }
  };
  Element.prototype.animate ??= (() => ({
    cancel() {},
    finish() {},
    onfinish: null,
  })) as unknown as typeof Element.prototype.animate;
});

// Decks from earlier rows stay mounted (nothing unmounts them), so the broadcast is emptied
// between rows: a row fires the observers ITS deck registered, and nobody else's.
beforeEach(() => {
  resizeBroadcast.length = 0;
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

const CARDS = ["sudoku", "futoshiki", "thermo", "killer", "kenken"].map(card);

type Props = Record<string, unknown>;

function mountDeck(props: Props = {}) {
  return mount(GameGallery, {
    attachTo: document.body,
    props: { cards: CARDS, snappedIndex: 0, ...props },
    global: {
      stubs: {
        StagingBand: true,
        HandDrawnOutline: { template: "<div><slot /></div>" },
      },
    },
  });
}

const player = (id: string, hue: number) => ({
  id,
  slug: id,
  ink: { "--color-user-ink": `oklch(0.6 0.11 ${hue}deg)` },
});

describe("the depth grade — distance, not a binary (M11)", () => {
  it("each card is handed its distance from the chosen one, capped at 2", () => {
    const w = mountDeck({ snappedIndex: 2 });
    expect(w.findAllComponents(GameCard).map((c) => c.props("depth"))).toEqual([
      2, 1, 0, 1, 2,
    ]);
  });

  it("the far tier is a CAP, so a five-deep spread still has three legible tiers", () => {
    const w = mountDeck({ snappedIndex: 0 });
    // 0 · 1 · 2 · 2 · 2 — the whole point of the cap: card 4 cannot be dimmer than card 2, so
    // the deck's far end is one plane rather than a fade into nothing.
    expect(w.findAllComponents(GameCard).map((c) => c.props("depth"))).toEqual([
      0, 1, 2, 2, 2,
    ]);
  });

  it("the card spends it as two compositor channels, and the tiers are the ruled table", () => {
    const styleOf = (depth: number) => {
      const c = mount(GameCard, {
        props: {
          card: CARDS[0],
          index: 0,
          count: 5,
          isActive: depth === 0,
          pose: 0,
          depth,
        },
        global: { stubs: { HandDrawnOutline: true } },
      });
      const s = c.get('[role="option"]').attributes("style") ?? "";
      return s.replace(/\s+/g, "");
    };
    expect(styleOf(0)).toContain("--d-scale:1");
    expect(styleOf(0)).toContain("--d-opacity:1");
    expect(styleOf(1)).toContain("--d-scale:0.94");
    expect(styleOf(1)).toContain("--d-opacity:0.78");
    expect(styleOf(2)).toContain("--d-scale:0.88");
    expect(styleOf(2)).toContain("--d-opacity:0.58");
  });
});

describe("the true stills — read lazily, at open and at arrival (M12)", () => {
  const saved = (size: number): GalleryPreview => ({
    size,
    values: { "0": 1 },
    givenCells: ["0"],
    saved: {},
  });

  it("every card is read ONCE at open, and the value reaches that card", () => {
    const previewFor = vi.fn((id: string) => (id === "thermo" ? saved(3) : null));
    const w = mountDeck({ previewFor });
    expect(previewFor.mock.calls.map(([id]) => id)).toEqual([
      "sudoku",
      "futoshiki",
      "thermo",
      "killer",
      "kenken",
    ]);
    const cards = w.findAllComponents(GameCard);
    expect(cards[2].props("preview")).toEqual(saved(3));
    expect(cards[0].props("preview")).toBeNull();
  });

  it("the read is in SETUP, so the first paint already carries the true face", () => {
    // Not `onMounted`: a card that renders canned and then swaps is the visible lie correcting
    // itself that M12 is about. The card holds the value on its very first render.
    const previewFor = vi.fn(() => saved(2));
    const w = mountDeck({ previewFor });
    expect(w.findAllComponents(GameCard)[0].props("preview")).toEqual(saved(2));
  });

  it("arriving at a card re-reads THAT card, and only it", () => {
    const previewFor = vi.fn((_id: string) => saved(3));
    const w = mountDeck({ previewFor });
    previewFor.mockClear();
    w.get(".gallery-viewport").trigger("keydown", { key: "ArrowRight" });
    expect(previewFor.mock.calls.map(([id]) => id)).toEqual(["futoshiki"]);
  });

  it("no reader supplied: every face is the canned poster, and nothing throws", () => {
    const w = mountDeck();
    expect(w.findAllComponents(GameCard).map((c) => c.props("preview"))).toEqual([
      null,
      null,
      null,
      null,
      null,
    ]);
  });
});

describe("the ribbon on a shared board — consent, counted (M13)", () => {
  const table = (n: number) => ({
    inRoom: true,
    players: Array.from({ length: n }, (_, i) => player(`p${i}`, i * 137)),
  });

  /** Step to a DIFFERENT card, then choose it. */
  async function chooseOther(w: ReturnType<typeof mountDeck>) {
    await w.get(".gallery-viewport").trigger("keydown", { key: "ArrowRight" });
    await w.get(".gallery-viewport").trigger("keydown", { key: "Enter" });
    await flushPromises();
  }

  it("a CLEAN board in a shared room still arms — the marks were never the subject", async () => {
    const w = mountDeck({ dirty: false, currentId: "sudoku", session: table(4) });
    await chooseOther(w);
    expect(w.find(".gallery-guard").exists()).toBe(true);
    expect(w.get(".guard-note-title").text()).toBe(
      "switch this shared board to futoshiki?",
    );
    expect(w.get(".guard-note-sub").text()).toBe("3 other players will follow");
    // The verb names what actually happens: the room, the roster and the link all survive a
    // switch under FOLLOW, so nobody is leaving anything.
    expect(w.get(".guard-leave").text()).toBe("switch");
  });

  it("one peer is one player — the count is the instrument, and it can say 1", async () => {
    const w = mountDeck({ currentId: "sudoku", session: table(2) });
    await chooseOther(w);
    expect(w.get(".guard-note-sub").text()).toBe("1 other player will follow");
  });

  it("a return switch names the last-writer price as well as the count (row 3)", async () => {
    const w = mountDeck({
      currentId: "sudoku",
      session: table(3),
      saved: {
        futoshiki: { size: 5, difficulty: "EASY", board: true, userMoves: true },
      },
    });
    await chooseOther(w);
    expect(w.get(".guard-note-sub").text()).toBe(
      "your saved board replaces the one on the table, and 2 other players will follow",
    );
  });

  it("a deal in a session arms on the table, not on the work (row 16)", async () => {
    const w = mountDeck({ dirty: false, currentId: "sudoku", session: table(4) });
    await w.get(".gallery-viewport").trigger("keydown", { key: "d" });
    await flushPromises();
    expect(w.get(".guard-note-title").text()).toBe("deal a new board?");
    expect(w.get(".guard-note-sub").text()).toBe(
      "it replaces the board for 3 other players",
    );
  });

  it("an EMPTY room arms nothing — there is nobody to drag, and no true count to print", async () => {
    const w = mountDeck({ dirty: false, currentId: "sudoku", session: table(1) });
    await chooseOther(w);
    expect(w.find(".gallery-guard").exists()).toBe(false);
    expect(w.emitted("select")).toHaveLength(1);
  });

  it("undoing to clean does NOT retire a shared ribbon", async () => {
    const w = mountDeck({ dirty: true, currentId: "sudoku", session: table(3) });
    await chooseOther(w);
    expect(w.find(".gallery-guard").exists()).toBe(true);
    await w.setProps({ dirty: false });
    await flushPromises();
    // Off a shared board this retires the ribbon (the work it guarded is gone). Here the work
    // was never what it guarded.
    expect(w.find(".gallery-guard").exists()).toBe(true);
  });

  it("SOLO, a select needs no guard: the board is saved and the switch is free", async () => {
    // The live pass measured it on the deployed edge: leave, return, board byte-identical.
    // A ribbon saying "your marks aren't saved" over that behavior was a false sentence —
    // the solo select arm died with it (attemptSelect).
    const w = mountDeck({ dirty: true, currentId: "sudoku" });
    await chooseOther(w);
    expect(w.find(".gallery-guard").exists()).toBe(false);
    expect(w.emitted("select")).toHaveLength(1);
  });

  it("SOLO, the deal guard keeps its strings — a deal genuinely writes over marks", async () => {
    const w = mountDeck({ dirty: true, currentId: "sudoku" });
    await w.get(".gallery-viewport").trigger("keydown", { key: "d" });
    await flushPromises();
    expect(w.get(".guard-note-title").text()).toBe("deal over this puzzle?");
    expect(w.get(".guard-note-sub").text()).toBe("your marks aren't saved");
    expect(w.get(".guard-leave").text()).toBe("deal");
  });
});

describe("where the armed ribbon stands (T8-R15)", () => {
  /** jsdom lays nothing out, so the boxes here are FABRICATED and what the rows pin is the
   *  arithmetic the deck does with them — the anchor is the armed card's centre expressed in the
   *  deck's own coordinates, which is a decision, not a measurement. The geometry itself is a
   *  browser fact and is gated in `e2e/gallery-guard.spec.ts` row 7, both engines. */
  const box = (left: number, width: number) =>
    ({
      left,
      width,
      right: left + width,
      x: left,
      y: 0,
      top: 0,
      bottom: 0,
      height: 0,
      toJSON: () => ({}),
    }) as DOMRect;

  /** A whole fabricated desk in five numbers: the deck's box, a track of equal slots, and the
   *  note's own width (the clamp spends half of it against the window edge). */
  type Desk = {
    deck: number;
    slot0: number;
    step: number;
    slot: number;
    note: number;
  };
  const layout = (d: Desk) =>
    function (this: Element) {
      switch (this.classList[0]) {
        case "game-gallery":
          return box(0, d.deck);
        case "gallery-card-slot": {
          const i = [...(this.parentElement?.children ?? [])].indexOf(this);
          return box(d.slot0 + i * d.step, d.slot);
        }
        case "gallery-guard":
          return box(0, d.note);
        default:
          return box(0, 0);
      }
    };

  /** The desk's real shape: a track wider than the frame, so a card whose centre is NOT the
   *  deck's middle — with zero edge air the end cards cannot travel there. */
  const DESK: Desk = { deck: 1024, slot0: 112, step: 340, slot: 340, note: 320 };
  /** The same deck after a rotation into a phone frame. Card 0's centre is 160 now. */
  const PHONE: Desk = { deck: 640, slot0: 60, step: 200, slot: 200, note: 200 };

  /** Arm the deal ribbon on card 0 (sudoku) under a fabricated desk. */
  async function armed(w: ReturnType<typeof mountDeck>) {
    await w.get(".gallery-viewport").trigger("keydown", { key: "d" });
    await flushPromises();
    return w;
  }
  const guardStyle = (w: ReturnType<typeof mountDeck>) =>
    w.get(".gallery-guard").attributes("style") ?? "";

  it("the anchor is the armed card's centre in deck coordinates, not the deck's middle", async () => {
    const rects = vi
      .spyOn(Element.prototype, "getBoundingClientRect")
      .mockImplementation(layout(DESK));
    try {
      const w = await armed(mountDeck({ dirty: true, currentId: "sudoku" }));
      // 112 + 340/2 = 282. The deck's middle is 512 — the number `left: 50%` handed the ribbon
      // at every index, and the whole of the defect at the two end cards.
      expect(guardStyle(w)).toContain("--guard-x: 282px");
    } finally {
      rects.mockRestore();
    }
  });

  /* ── THE ARMED GUARD RE-ANCHORS (T9-W6 §6.4) ──────────────────────────────────────────────
   *
   * The read above happens once, at arm, and nothing invalidated it: a rotation or a drag-resize
   * under an armed ribbon re-created the exact geometry R15 closed, because the deck re-pins its
   * track on a resize (`useCarouselGlide`'s ResizeObserver → `jumpTo`) while the note stayed
   * pinned to the box it measured before the frame moved.
   *
   * The two rows below are the choice, stated both ways: the note follows its card, and it is
   * still standing when it gets there. */
  const withWindowWidth = async (px: number, body: () => Promise<void>) => {
    const was = window.innerWidth;
    Object.defineProperty(window, "innerWidth", { value: px, configurable: true });
    try {
      await body();
    } finally {
      Object.defineProperty(window, "innerWidth", { value: was, configurable: true });
    }
  };

  it("a resize under an armed ribbon re-anchors the note onto the card's NEW box", async () => {
    const rects = vi
      .spyOn(Element.prototype, "getBoundingClientRect")
      .mockImplementation(layout(DESK));
    try {
      const w = await armed(mountDeck({ dirty: true, currentId: "sudoku" }));
      expect(guardStyle(w)).toContain("--guard-x: 282px");
      // THE ROTATION. Same card, same index, new frame — so nothing the deck watches for a
      // dismissal fires, and the measurement taken at arm is now a fact about a desk that is
      // gone. 60 + 200/2 = 160: the stale read stood 122px off the card it names.
      rects.mockImplementation(layout(PHONE));
      await withWindowWidth(640, async () => {
        broadcastResize();
        await flushPromises();
        expect(guardStyle(w)).toContain("--guard-x: 160px");
      });
    } finally {
      rects.mockRestore();
    }
  });

  it("the note re-measures AFTER the deck re-pins — observer order, not the resize event", async () => {
    const rects = vi
      .spyOn(Element.prototype, "getBoundingClientRect")
      .mockImplementation(layout(DESK));
    try {
      const w = await armed(mountDeck({ dirty: true, currentId: "sudoku" }));
      // TWO observers watch the viewport: the glide's track re-pin (`jumpTo`) and the ribbon's
      // re-anchor, in that construction order, which is the order a broadcast delivers them in.
      // The order is the cure's whole reason for being an observer rather than a `window.resize`
      // listener — the event fires BEFORE the broadcast, so a listener re-measures against the
      // track's pre-re-pin scroll. Fire them one at a time and the sequence is visible: the deck
      // moves first, and only then does the note read.
      expect(resizeBroadcast).toHaveLength(2);
      rects.mockImplementation(layout(PHONE));
      await withWindowWidth(640, async () => {
        resizeBroadcast[0]();
        await flushPromises();
        expect(guardStyle(w)).toContain("--guard-x: 282px");
        resizeBroadcast[1]();
        await flushPromises();
        expect(guardStyle(w)).toContain("--guard-x: 160px");
      });
    } finally {
      rects.mockRestore();
    }
  });

  it("a track that moves under the note re-anchors it too, broadcast or no broadcast", async () => {
    // The observer's place in the broadcast is a courtesy, not a guarantee: WebKit re-snaps on
    // its own after a resize, and a re-pin deferred by a frame would land after the callback.
    // Under an armed ribbon the deck cannot travel for any other reason, so a scroll on the
    // viewport means the track moved beneath the note — measured with no resize at all.
    const rects = vi
      .spyOn(Element.prototype, "getBoundingClientRect")
      .mockImplementation(layout(DESK));
    try {
      const w = await armed(mountDeck({ dirty: true, currentId: "sudoku" }));
      expect(guardStyle(w)).toContain("--guard-x: 282px");
      rects.mockImplementation(layout(PHONE));
      await withWindowWidth(640, async () => {
        await w.get(".gallery-viewport").trigger("scroll");
        await flushPromises();
        expect(guardStyle(w)).toContain("--guard-x: 160px");
      });
    } finally {
      rects.mockRestore();
    }
  });

  it("it re-anchors rather than retires — the unanswered question is still standing", async () => {
    const rects = vi
      .spyOn(Element.prototype, "getBoundingClientRect")
      .mockImplementation(layout(DESK));
    try {
      const w = await armed(mountDeck({ dirty: true, currentId: "sudoku" }));
      rects.mockImplementation(layout(PHONE));
      await withWindowWidth(640, async () => {
        broadcastResize();
        await flushPromises();
        // A window that changed size is not an answer to a consent prompt: the note holds
        // focus and an unanswered question, so a resize may move it but never resolve it.
        expect(w.find(".gallery-guard").exists()).toBe(true);
        expect(w.emitted("deal")).toBeUndefined();
      });
    } finally {
      rects.mockRestore();
    }
  });
});

describe("the deck's roster echo (M14)", () => {
  it("the swatches go to the CHOSEN card alone", () => {
    const players = [player("a", 0), player("b", 137)];
    const w = mountDeck({ snappedIndex: 1, session: { inRoom: true, players } });
    const cards = w.findAllComponents(GameCard);
    expect(cards[1].props("swatches")).toEqual(players);
    expect(cards[0].props("swatches")).toBeUndefined();
    // Their ink rides the element, so a peer's dot and their digits are one colour by
    // construction rather than by agreement.
    const dots = cards[1].findAll(".game-card-swatch");
    expect(dots.length).toBe(2);
    expect(dots[1].attributes("style")).toContain("137deg");
  });

  it("no session, no dots", () => {
    const w = mountDeck();
    expect(w.findAll(".game-card-swatch").length).toBe(0);
  });
});
