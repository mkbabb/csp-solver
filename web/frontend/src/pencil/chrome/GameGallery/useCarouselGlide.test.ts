import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, ref } from "vue";
import { useCarouselGlide } from "./useCarouselGlide";

/**
 * T9 chair fold, lane FA7 — THE DECK KEEPS ITS CHOICE ACROSS A RESIZE.
 *
 * The glide's geometry is a browser fact and is gated in `e2e/gallery.spec.ts` in both engines.
 * What lives here is the one DECISION the composable makes that a browser cannot be asked about
 * cheaply: whether a settle it did not write is the reader's choice or the engine's own re-snap
 * after the frame changed shape.
 *
 * Measured on the live edge before this file existed (evidence/w6/fold/FA7-walk-timeline):
 * WebKit, 1440×900 → 640×900, the engine adjusts `scrollLeft` on its own and `scrollend` — which
 * is undebounced — reaches `reportSnap` 31ms later, 59ms BEFORE the ResizeObserver re-pins. The
 * deck published card 1 out of a window that changed size: 14–17 of every 20 rotations.
 */

/** jsdom lays nothing out, so the boxes are FABRICATED and what these rows pin is the arithmetic
 *  the composable does with them. One slot per card, a frame that holds several of them at the
 *  desk and one at the phone — the two rungs whose clamp behaviour differs. */
const SLOT = 300;
const CARDS = 5;
const DESK_W = 1200;
const PHONE_W = 400;
/** `targetScrollLeft(1)` at the phone rung: 1·300 + 150 − 200, inside `maxScroll`. */
const CARD_1_AT_PHONE = 250;

/** The drivable observer — jsdom ships none, and a no-op stub would make every row below
 *  unfalsifiable rather than red. Collected in construction order, which is the order a real
 *  broadcast delivers them in. */
const resizeBroadcast: Array<() => void> = [];
function broadcastResize() {
  for (const cb of [...resizeBroadcast]) cb();
}
class StubResizeObserver {
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
}

beforeAll(() => {
  Element.prototype.animate ??= (() => ({
    cancel() {},
    finish() {},
    onfinish: null,
  })) as unknown as typeof Element.prototype.animate;
});

type Glide = ReturnType<typeof useCarouselGlide>;

const Harness = defineComponent({
  props: { snap: { type: Function, required: true } },
  setup(props) {
    const viewport = ref<HTMLElement | null>(null);
    const track = ref<HTMLElement | null>(null);
    const glide = useCarouselGlide(viewport, track, {
      reducedMotion: () => true,
      onSnap: (i: number) => (props.snap as (i: number) => void)(i),
    });
    return { viewport, track, glide };
  },
  template: `<div class="gallery-viewport" ref="viewport">
      <div class="gallery-track" ref="track">
        <div class="gallery-card-slot" v-for="i in ${CARDS}" :key="i" />
      </div>
    </div>`,
});

/** A whole fabricated deck: a frame whose width the row can change, a scroll position the row
 *  can write the way an engine writes it, and slot rects that follow both. */
function deck(hasObserver = true) {
  const g = globalThis as unknown as { ResizeObserver?: unknown };
  const hadObserver = g.ResizeObserver;
  if (hasObserver) g.ResizeObserver = StubResizeObserver;
  else delete g.ResizeObserver;

  let frame = DESK_W;
  let scroll = 0;
  const rects = vi
    .spyOn(Element.prototype, "getBoundingClientRect")
    .mockImplementation(function (this: Element) {
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
      if (this.classList[0] === "gallery-viewport") return box(0, frame);
      if (this.classList[0] === "gallery-card-slot") {
        const i = [...(this.parentElement?.children ?? [])].indexOf(this);
        return box(i * SLOT - scroll, SLOT);
      }
      return box(0, 0);
    });

  const snap = vi.fn();
  const w = mount(Harness, { attachTo: document.body, props: { snap } });
  const vp = w.get(".gallery-viewport").element as HTMLElement;
  Object.defineProperty(vp, "clientWidth", { get: () => frame, configurable: true });
  Object.defineProperty(vp, "scrollWidth", {
    get: () => CARDS * SLOT,
    configurable: true,
  });
  Object.defineProperty(vp, "scrollLeft", {
    get: () => scroll,
    set: (v: number) => {
      scroll = v;
    },
    configurable: true,
  });

  // The deck is OPEN and pinned on card 0 in the desk frame — the pose every row starts from.
  const glide = (w.vm as unknown as { glide: Glide }).glide;
  glide.jumpTo(0);
  snap.mockClear();

  return {
    w,
    vp,
    snap,
    glide,
    /** The frame changes shape, and the engine re-snaps the position ON ITS OWN — no gesture,
     *  no composable write. This is what WebKit does 31ms after a rotation. */
    rotate(to = PHONE_W, engineLands = CARD_1_AT_PHONE) {
      frame = to;
      scroll = engineLands;
    },
    settle() {
      vp.dispatchEvent(new Event("scrollend"));
    },
    get scroll() {
      return scroll;
    },
    restore() {
      rects.mockRestore();
      w.unmount();
      if (hadObserver) g.ResizeObserver = hadObserver;
      else delete g.ResizeObserver;
    },
  };
}

let live: ReturnType<typeof deck> | null = null;
beforeEach(() => {
  resizeBroadcast.length = 0;
});
afterEach(() => {
  live?.restore();
  live = null;
});

describe("a resize is not a gesture (T9 fold FA7)", () => {
  it("the engine's own re-snap after the frame changed is NOT reported as the reader's choice", () => {
    live = deck();
    live.rotate();
    live.settle();
    // BORN RED. At HEAD this is `onSnap(1)`: `restingIndex()` reads the engine's 250 against the
    // new 400px frame, answers 1, and the deck hands its CHOICE to a window that changed size —
    // the reader lands on a different puzzle, and an armed consent ribbon holding focus goes
    // with it, with nothing announcing the loss.
    expect(live.snap).not.toHaveBeenCalled();
  });

  it("the deck's own re-pin then lands on the card it KEPT, not the one the engine drifted to", () => {
    live = deck();
    live.rotate();
    live.settle();
    broadcastResize(); // the ResizeObserver's `jumpTo(currentIndex)`, ~59ms behind the settle
    // `targetScrollLeft(0)` clamps to 0 at either rung. Uncured, `currentIndex` was already 1 by
    // now and this same re-pin faithfully pinned the WRONG card — the re-pin was never the
    // defect, which is why the cure is at the report and needs no extra frame.
    expect(live.scroll).toBe(0);
  });

  it("the seam RE-OPENS in the new frame: a real swipe there is still the reader's", () => {
    live = deck();
    live.rotate();
    live.settle();
    broadcastResize(); // the deck re-pins, and that is what re-arms the report
    live.snap.mockClear();
    // Now a hand swipes, in the frame the deck has pinned. Nothing about this is a resize.
    live.vp.scrollLeft = CARD_1_AT_PHONE;
    live.settle();
    expect(live.snap).toHaveBeenCalledWith(1);
  });

  it("a settle with the frame UNCHANGED is the reader's, resize or no resize", () => {
    live = deck();
    live.vp.scrollLeft = SLOT; // a swipe at the desk rung — `targetScrollLeft(2)` is nearest
    live.settle();
    expect(live.snap).toHaveBeenCalled();
  });

  it("no ResizeObserver, no suppression — nothing would ever re-pin, so nothing is held back", () => {
    // The fail-safe, stated as a row. Armed unconditionally, a deck on a browser without the
    // observer would stop following touch for the rest of the page's life after one resize.
    live = deck(false);
    live.rotate();
    live.settle();
    expect(live.snap).toHaveBeenCalledWith(1);
  });
});
