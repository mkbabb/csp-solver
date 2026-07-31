/**
 * The eager scene's hand copy ≡ the declaration (T4-P1 Lane D ship 3).
 *
 * `SudokuGame.vue` builds its `sections` from `./ControlPanel/constants` instead of reading
 * `sudokuGame.options(model)` the way thermo/killer/kenken do, and it MUST: sudoku is the
 * eager game, so `registry.ts` statically imports both this scene (:24) and `./game` (:18).
 * A `./game` import here would close scene → game → registry → scene and registry's body would
 * evaluate `gameRegistry = { sudoku: sudokuGame }` with that const still in its TDZ — the app
 * dies at boot with "Cannot access 'sudokuGame' before initialization".
 *
 * The cycle is real; the second copy it forces is a liability. Ship 3 deleted the per-game
 * ControlPanel wrappers on the grounds that they were a byte-for-byte second copy of this
 * list — so leaving the same duplication behind guarded by a prose comment would just have
 * relocated it. THIS is the guard: the two lists must agree in shape AND in what their
 * `onChange` handlers move. Divergence reds here, not on glass.
 */
import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import GameControlPanel, {
  type ControlSection,
} from "@games/shared/GameControlPanel.vue";
import SudokuGame from "./SudokuGame.vue";
import { sudokuGame } from "./game";

// The eager scene prewarms the solver on a timer; jsdom provisions no `Worker`. A no-op
// constructor keeps the cold-start path from throwing into the run without stubbing the
// module — the sections this file asserts are built at setup, upstream of any of it.
vi.stubGlobal(
  "Worker",
  class {
    postMessage() {}
    terminate() {}
    addEventListener() {}
  },
);

/** everything but `onChange` — functions never deep-equal across two builders */
const shape = (s: ControlSection[]) =>
  s.map(({ key, heading, ariaLabel, options, selected }) => ({
    key,
    heading,
    ariaLabel,
    options,
    selected,
  }));

/**
 * The sections the SCENE actually hands the panel, read off the mounted stub. Everything is
 * shallow-stubbed except GameScene, which is replaced by a stub that DOES render the named
 * `controls` slot — that slot is where the scene's list crosses into the panel, so a default
 * stub (which renders no slots) would leave this test asserting nothing.
 */
function sceneSections() {
  const wrapper = mount(SudokuGame, {
    shallow: true,
    global: {
      stubs: {
        GameScene: {
          template: `<div><slot name="controls" :mobile="false" /></div>`,
        },
      },
    },
  });
  const panel = wrapper.findComponent(GameControlPanel);
  expect(panel.exists()).toBe(true);
  return { wrapper, read: () => panel.props("sections") as ControlSection[] };
}

describe("sudoku sections — scene hand copy ≡ sudokuGame.options", () => {
  it("declares the same sections, headings, labels and option lists", () => {
    const { wrapper, read } = sceneSections();
    expect(shape(read())).toEqual(shape(sudokuGame.options(sudokuGame.model())));
    wrapper.unmount();
  });

  it("routes each onChange to the same model field", async () => {
    // Behavioural equality: apply the same value through each list's own handler and require
    // both to report it back through `selected`. A handler rewired to the wrong field (or
    // dropped) reds here even though the shape above still matches.
    const declaredModel = sudokuGame.model();
    const declared = () => sudokuGame.options(declaredModel);
    const { wrapper, read } = sceneSections();

    const probes = [
      { i: 0, value: 4 },
      { i: 1, value: "HARD" },
    ] as const;

    for (const { i, value } of probes) {
      declared()[i].onChange(value);
      read()[i].onChange(value);
    }
    await wrapper.vm.$nextTick();

    expect(shape(read()).map((s) => s.selected)).toEqual(
      shape(declared()).map((s) => s.selected),
    );
    expect(shape(read()).map((s) => s.selected)).toEqual([4, "HARD"]);
    wrapper.unmount();
  });
});
