import { describe, it, expect, beforeAll, vi } from "vitest";
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
