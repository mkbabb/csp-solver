import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, nextTick, ref } from "vue";
import { useLiveRegion } from "./useLiveRegion";

/**
 * T9-W3 §3.4 — the idiom's own battery.
 *
 * Every row asserts against the RENDERED NODE rather than the ref, because the ref is not what
 * an assistive technology reads. The claim under test is an ordering claim: the region is in the
 * document, empty, BEFORE its first word — including when the state it narrates was already
 * true at setup, which is the 0→1 case the estate got wrong three times.
 */

const narrator = (source: () => string) =>
  defineComponent({
    setup() {
      const { text } = useLiveRegion(source);
      return { text };
    },
    template: `<p class="region" aria-live="polite">{{ text }}</p>`,
  });

const speaker = defineComponent({
  setup() {
    const { text, say, clear } = useLiveRegion();
    return { text, say, clear };
  },
  template: `<p class="region" role="status">{{ text }}</p>`,
});

describe("useLiveRegion — born empty, persists, filled after mount", () => {
  it("a source that is ALREADY speaking at setup still enters the document silent", async () => {
    const w = mount(
      narrator(() => "connecting…"),
      { attachTo: document.body },
    );
    const region = w.get(".region").element;
    // The node is in the document and says nothing. Had the composable read its source eagerly,
    // the sentence would be part of the region's birth markup and no announcement would exist.
    expect(region.textContent).toBe("");

    await nextTick();
    expect(w.get(".region").element).toBe(region);
    expect(region.textContent).toBe("connecting…");
    w.unmount();
  });

  it("a state that turns true later lands in that same node", async () => {
    const alone = ref(false);
    const w = mount(
      narrator(() => (alone.value ? "you're the only one on this board." : "")),
      { attachTo: document.body },
    );
    await nextTick();
    const region = w.get(".region").element;
    expect(region.textContent).toBe("");

    alone.value = true;
    await nextTick();
    expect(w.get(".region").element).toBe(region);
    expect(region.textContent).toBe("you're the only one on this board.");
    w.unmount();
  });

  it("and going quiet empties the region rather than removing it", async () => {
    const alone = ref(true);
    const w = mount(
      narrator(() => (alone.value ? "you're the only one on this board." : "")),
      { attachTo: document.body },
    );
    await nextTick();
    const region = w.get(".region").element;

    alone.value = false;
    await nextTick();
    expect(w.get(".region").element).toBe(region);
    // Nothing stale can be re-read off the page, and an empty region can be taken out of flow
    // at a drawn site so persistence costs no pixels.
    expect(region.textContent).toBe("");
    w.unmount();
  });

  it("without a source it is an utterance channel: say fills it, clear empties it", async () => {
    const w = mount(speaker, { attachTo: document.body });
    const region = w.get(".region").element;
    expect(region.textContent).toBe("");

    w.vm.say("sudoku, 1 of 5. 9×9 easy, new game");
    await nextTick();
    expect(w.get(".region").element).toBe(region);
    expect(region.textContent).toBe("sudoku, 1 of 5. 9×9 easy, new game");

    w.vm.clear();
    await nextTick();
    expect(w.get(".region").element).toBe(region);
    expect(region.textContent).toBe("");
    w.unmount();
  });
});
