// PROPOSED (critic, pass 5): G16's CI half as BEHAVIOUR, not text. jsdom + @vue/test-utils with the
// Transition UNSTUBBED runs the real @before-leave. Green on the tree (1/1); RED with
// stopTheClock's body dead and its text intact (`if (el) return;`), where the lane's text-keyed
// G16 stays 11/11 green (logs/feas.log, logs/feas2.log). Lives beside marginNote.motion.test.ts.
import { it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import MarginNote from "./MarginNote.vue";
it("G16 (CI half): the leaving node carries transition:none !important", async () => {
  const w = mount(MarginNote, { props: { text: "one", seq: 1 }, global: { stubs: { transition: false } }, attachTo: document.body });
  await nextTick();
  const first = w.element.querySelector(".margin-note-ink") as HTMLElement;
  expect(first).toBeTruthy();
  await w.setProps({ text: "two", seq: 2 });
  await nextTick();
  expect(`${first.style.getPropertyValue("transition")}|${first.style.getPropertyPriority("transition")}`).toBe("none|important");
});
