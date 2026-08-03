import { describe, it, expect, beforeAll } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import GameGallery from "./GameGallery.vue";
import type { GalleryCard } from "./types";

/**
 * T5-W3 row 3.2 — THE GUARD SPEAKS, at the unit layer.
 *
 * The destructive-work guard (`.gallery-guard`) shipped as a NAMED `alertdialog` that no
 * assistive tech ever heard: `aria-modal` absent, focus never entering it, and the only live
 * region on the page still reading the CARD (`evidence/audit/r2/verify-gate-criticals.md` §H2 —
 * reproduced through to the destroyed board, user entries 1 → 0, silent). The e2e family
 * `a11y.spec.ts` §3.2 gates the same contract against the real engines; this battery gates the
 * COMPONENT's own semantics, where every branch of both intents is reachable in a millisecond
 * and the one-string rule is checkable as an equality rather than as prose.
 *
 * THE ONE-STRING RULE (charter, the loop's guard-names row): the ribbon's drawn heading and its
 * accessible name are the SAME string. Two literals for one name is how they drifted apart in
 * the first place — HEAD drew "deal over this puzzle?" and told AT "Deal a new board?".
 *
 * SEMANTIC LAYER ONLY. Nothing here asserts a pixel; the ribbon's visuals are held by verify's
 * golden run. What the units add over the e2e is the deal intent (whose ribbon copy differs) and
 * the dismissal paths, which the browser probe reaches only through a full deal transaction.
 */

// jsdom provisions neither of these; `useCarouselGlide` observes the viewport on mount and the
// FLIP tween asks for WAAPI. Neither is under test — stub, don't skip.
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

/** Centered on `sudoku` with a dirty `futoshiki` mounted — a DIFFERENT, destructive select. */
function mountGallery() {
  return mount(GameGallery, {
    attachTo: document.body,
    props: {
      cards: [card("sudoku"), card("futoshiki")],
      snappedIndex: 0,
      dirty: true,
      currentId: "futoshiki",
    },
    global: {
      stubs: {
        GameCard: true,
        StagingBand: true,
        // The ribbon's note lives in this slot; a bare stub would swallow the whole subject.
        HandDrawnOutline: { template: "<div><slot /></div>" },
      },
    },
  });
}

type Wrapper = ReturnType<typeof mountGallery>;

/** Arm the ribbon from the listbox: Enter is the select intent, `d` the deal intent. */
async function arm(w: Wrapper, key: "Enter" | "d") {
  await w.get(".gallery-viewport").trigger("keydown", { key });
  await flushPromises();
  expect(w.find(".gallery-guard").exists(), `${key} must arm the ribbon`).toBe(true);
}

const guard = (w: Wrapper) => w.get(".gallery-guard");

/** Every live region on the page, as an AT would poll them. */
const liveRegions = (w: Wrapper) =>
  w
    .findAll('[aria-live],[role="status"],[role="alert"]')
    .map((r) => r.text().replace(/\s+/g, " ").trim());

/** The e2e helper's own predicate (a11y.spec.ts:162), re-run against the component tree: the
 *  guard is heard when a live region speaks the guard's OWN name — never a hardcoded copy. */
function announced(w: Wrapper): boolean {
  const g = guard(w);
  const key = (g.attributes("aria-label") ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/[?.!]+$/, "");
  if (!key) return false;
  return liveRegions(w).some((t) => t.toLowerCase().includes(key));
}

describe("the destructive-work guard speaks — 3.2", () => {
  it("arming utters the guard's own name into an ASSERTIVE region", async () => {
    const w = mountGallery();
    await arm(w, "Enter");
    expect(
      announced(w),
      `the armed guard was never announced; live regions said ${JSON.stringify(
        liveRegions(w),
      )}`,
    ).toBe(true);
    // Assertive, not polite: this interrupts. A destructive prompt queued behind the deck's
    // snap chatter is the silence again, one beat later.
    const alert = w.get('[role="alert"]');
    expect(alert.text()).not.toBe("");
    expect(alert.attributes("aria-live") ?? "assertive").not.toBe("polite");
    w.unmount();
  });

  it("the assertive region is PERSISTENT — it exists before it speaks", () => {
    // A live region born already-populated is unreliably announced; the node has to be in the
    // tree, empty, when the guard arms. Unarmed: present and silent.
    const w = mountGallery();
    const alert = w.find('[role="alert"]');
    expect(alert.exists()).toBe(true);
    expect(alert.text()).toBe("");
    w.unmount();
  });

  it("dismissal retires the utterance (no stale prompt left to re-read)", async () => {
    const w = mountGallery();
    await arm(w, "Enter");
    await w.get(".guard-keep").trigger("click");
    await flushPromises();
    expect(w.find(".gallery-guard").exists()).toBe(false);
    expect(w.get('[role="alert"]').text()).toBe("");
    w.unmount();
  });

  it("claims modality and TAKES focus", async () => {
    const w = mountGallery();
    // Control: the listbox holds focus until the ribbon arms. (`onMounted` focuses the viewport
    // after a tick — the deck's own contract — so the control reads the SETTLED mount.)
    await flushPromises();
    expect(document.activeElement).toBe(w.get(".gallery-viewport").element);
    await arm(w, "Enter");
    const g = guard(w);
    expect(g.attributes("role")).toBe("alertdialog");
    expect(g.attributes("aria-modal")).toBe("true");
    expect(
      g.element.contains(document.activeElement),
      `focus stayed outside the armed dialog (on ${document.activeElement?.className})`,
    ).toBe(true);
    w.unmount();
  });

  it("contains focus: Tab cycles the ribbon's verbs and never escapes to the deck", async () => {
    const w = mountGallery();
    await arm(w, "Enter");
    const keep = w.get(".guard-keep").element as HTMLElement;
    const leave = w.get(".guard-leave").element as HTMLElement;

    await guard(w).trigger("keydown", { key: "Tab" });
    expect(document.activeElement).toBe(keep);
    await guard(w).trigger("keydown", { key: "Tab" });
    expect(document.activeElement).toBe(leave);
    // Off the end, back to the top — never out into the listbox behind the modal.
    await guard(w).trigger("keydown", { key: "Tab" });
    expect(document.activeElement).toBe(keep);
    await guard(w).trigger("keydown", { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(leave);
    w.unmount();
  });

  it("returns focus to the listbox when the ribbon retires", async () => {
    const w = mountGallery();
    await arm(w, "Enter");
    await guard(w).trigger("keydown", { key: "Escape" });
    await flushPromises();
    expect(w.find(".gallery-guard").exists()).toBe(false);
    expect(document.activeElement).toBe(w.get(".gallery-viewport").element);
    w.unmount();
  });

  it("describes itself: aria-describedby resolves to the stake sub-line", async () => {
    const w = mountGallery();
    await arm(w, "Enter");
    const id = guard(w).attributes("aria-describedby");
    expect(id, "the dialog must name what is at stake").toBeTruthy();
    const sub = document.getElementById(id!);
    expect(sub?.textContent).toBe("your marks aren't saved");
    w.unmount();
  });
});

describe("ONE name, drawn and spoken — the one-string rule", () => {
  for (const [intent, key] of [
    ["select", "Enter"],
    ["deal", "d"],
  ] as const) {
    it(`${intent}: the accessible name IS the drawn heading, character for character`, async () => {
      const w = mountGallery();
      await arm(w, key);
      const drawn = w.get(".guard-note-title").text();
      expect(drawn).not.toBe("");
      expect(
        guard(w).attributes("aria-label"),
        `${intent}: the ribbon draws "${drawn}" — AT must hear the same string`,
      ).toBe(drawn);
      w.unmount();
    });
  }

  it("the two intents still say different things (the rule is one name, not one copy)", async () => {
    const w1 = mountGallery();
    await arm(w1, "Enter");
    const select = guard(w1).attributes("aria-label");
    w1.unmount();
    const w2 = mountGallery();
    await arm(w2, "d");
    expect(guard(w2).attributes("aria-label")).not.toBe(select);
    w2.unmount();
  });

  it("the utterance is built from that same name, so copy can never drift out of it", async () => {
    const w = mountGallery();
    await arm(w, "d");
    const drawn = w.get(".guard-note-title").text();
    expect(w.get('[role="alert"]').text().toLowerCase()).toContain(drawn.toLowerCase());
    w.unmount();
  });
});

describe("the armed ribbon still resolves — the Wave D contract, under moved focus", () => {
  it("Enter on the focused dialog confirms LEAVE (the verb HEAD bound it to)", async () => {
    const w = mountGallery();
    await arm(w, "Enter");
    await guard(w).trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(w.emitted("select")?.[0]).toEqual(["sudoku"]);
    w.unmount();
  });

  it("Enter on the KEEP button keeps — the native button owns its own activation", async () => {
    const w = mountGallery();
    await arm(w, "Enter");
    (w.get(".guard-keep").element as HTMLElement).focus();
    // The container's delegating handler must stand aside here, or the ribbon's own Enter
    // branch fires alongside the button's click and "keep" resolves as "leave".
    await w.get(".guard-keep").trigger("keydown", { key: "Enter" });
    await w.get(".guard-keep").trigger("click");
    await flushPromises();
    expect(w.emitted("select")).toBeUndefined();
    expect(w.find(".gallery-guard").exists()).toBe(false);
    w.unmount();
  });

  // T8 M7a — ESC IS THE WINDOW'S, and the ribbon comes first. The deck's other keys are the
  // listbox's and are bound on the viewport; Escape is bound on the WINDOW, because a way out
  // that only answers while one element holds focus is not a way out (measured: it was inert
  // after a click on the staging band, on a pip, or on bare page — four of six ordinary
  // states). These two rows pin the precedence at the component layer, where "which handler
  // answered" is checkable: one press retires the ribbon and NOTHING else, the next leaves.
  it("Esc from OUTSIDE the deck retires the ribbon first — the deck stays", async () => {
    const w = mountGallery();
    await arm(w, "Enter");
    document.body.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await flushPromises();
    expect(w.find(".gallery-guard").exists()).toBe(false);
    expect(w.emitted("cancel"), "one press, one level").toBeUndefined();
    w.unmount();
  });

  it("…and the next Esc from outside leaves the deck", async () => {
    const w = mountGallery();
    await flushPromises();
    document.body.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await flushPromises();
    expect(w.emitted("cancel")).toHaveLength(1);
    w.unmount();
  });

  it("an unmounted deck no longer answers Escape (the listener dies with it)", async () => {
    const w = mountGallery();
    await flushPromises();
    w.unmount();
    document.body.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await flushPromises();
    expect(w.emitted("cancel")).toBeUndefined();
  });

  it("an arrow through the armed ribbon dismisses it, as it did from the listbox", async () => {
    const w = mountGallery();
    await arm(w, "Enter");
    await guard(w).trigger("keydown", { key: "ArrowRight" });
    await flushPromises();
    expect(w.find(".gallery-guard").exists()).toBe(false);
    expect(w.emitted("select")).toBeUndefined();
    expect(w.emitted("snap")?.[0]).toEqual([1]);
    w.unmount();
  });
});
