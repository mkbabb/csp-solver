import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import KeyboardLegend from "./KeyboardLegend.vue";
import { SINGLE_KEY_SHORTCUTS } from "@/composables/useShortcutPolicy";

// T5-W3 row 3.6 (a11y r1 L10) — THE CRIB TELLS THE TRUTH, AND TELLS ALL OF IT.
//
// Two defects, both live at `78448760`:
//   · it printed `⇧ Z` for redo. Shift+Z alone does nothing — `GameBoard.vue:458-466` reaches
//     the `z` case only under `ctrlKey || metaKey` and only THEN branches on shift. A
//     keyboard-only player was told a chord that is not bound.
//   · it named K, H and P and neither G nor D, so two of the five bare keys the estate binds
//     were advertised on no surface at all (WCAG 2.1.4's whole subject).
//
// The single-key half is asserted against `SINGLE_KEY_SHORTCUTS` rather than a hardcoded
// list: the policy table is the one place the five are written down, so a sixth shortcut
// added there and left out of the crib reddens here without this file being touched.

const legend = () => mount(KeyboardLegend);
const rows = (w: ReturnType<typeof legend>) =>
  w.findAll(".legend-row").map((r) => ({
    keys: r.findAll("kbd").map((k) => k.text()),
    does: r.get("dd").text(),
  }));

describe("KeyboardLegend — every bare key the estate binds, and only chords it binds", () => {
  it("names all five single-key shortcuts, in the policy's own words", () => {
    const printed = rows(legend()).filter((r) => r.keys.length === 1);
    expect(printed.map((r) => ({ key: printed && r.keys[0], does: r.does }))).toEqual(
      SINGLE_KEY_SHORTCUTS.map((s) => ({ key: s.key, does: s.does })),
    );
  });

  it("the crib's key set IS the policy's key set — no shortcut advertised nowhere", () => {
    const named = new Set(
      rows(legend())
        .filter((r) => r.keys.length === 1)
        .map((r) => r.keys[0].toLowerCase()),
    );
    const bound = SINGLE_KEY_SHORTCUTS.map((s) => s.key.toLowerCase());
    expect(bound.filter((k) => !named.has(k))).toEqual([]);
  });

  it("redo prints the chord the board actually binds: a modifier, shift, and Z", () => {
    const redo = rows(legend()).find((r) => r.does === "redo");
    expect(redo, "the crib must still carry a redo row").toBeDefined();
    // The lie was `["⇧","Z"]` — shift and the letter, with no ⌘/Ctrl in front of them.
    expect(redo!.keys).not.toEqual(["⇧", "Z"]);
    expect(redo!.keys).toContain("⇧");
    expect(redo!.keys.some((k) => k === "⌘" || k === "Ctrl")).toBe(true);
    // Order matters to a reader: the modifier is held first.
    expect(redo!.keys.indexOf("⇧")).toBeGreaterThan(0);
    expect(redo!.keys[redo!.keys.length - 1]).toBe("Z");
  });

  it("undo keeps its own chord, unmodified by the redo cure", () => {
    const undo = rows(legend()).find((r) => r.does === "undo");
    expect(undo!.keys).toEqual(["⌘", "Ctrl", "Z"]);
    expect(undo!.keys).not.toContain("⇧");
  });

  it("stays one named help surface: the row-3.4 gate counts `keyboard shortcuts` labels", () => {
    const w = legend();
    expect(w.get("dl").attributes("aria-label")).toBe("Keyboard shortcuts");
    expect(w.findAll("[aria-label='Keyboard shortcuts']")).toHaveLength(1);
  });
});
