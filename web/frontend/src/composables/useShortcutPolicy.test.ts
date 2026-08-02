import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h, ref } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { useAnswerKeyPeek } from "@games/shared/useAnswerKeyPeek";
import {
  SINGLE_KEY_SHORTCUTS,
  isForeignChord,
  isTypingContext,
  useShortcutPolicy,
} from "./useShortcutPolicy";

/**
 * T5-W3 row 3.4 — THE SINGLE-KEY SHORTCUT POLICY, as units.
 *
 * The subject of the integration rows below is the REAL `useAnswerKeyPeek`, not a mock of it:
 * that composable's window-level keydown is the live defect (a11y r1 M4 — no modifier guard, a
 * `preventDefault`, so Ctrl+K / Cmd+K flash the answer key over the board), and a policy that
 * only beats a hand-rolled stand-in would prove nothing about the chord a player actually types.
 *
 * THE ABLATION CONTROL IS PERMANENT (`the defect, live`): the same harness mounted WITHOUT the
 * policy must still show Ctrl+K peeking. Without it this battery would green just as happily on
 * a cure that deleted the K shortcut, and the amputation is the failure mode this row invites.
 */

let wrapper: VueWrapper | null = null;
afterEach(() => {
  wrapper?.unmount();
  wrapper = null;
  document.body.innerHTML = "";
});

/** A cell as the board builds it: the opacity-0 native input inside its own `role="gridcell"`. */
function boardCell(): HTMLInputElement {
  const cell = document.createElement("div");
  cell.setAttribute("role", "gridcell");
  const input = document.createElement("input");
  input.type = "text";
  cell.appendChild(input);
  document.body.appendChild(cell);
  return input;
}

function field(tag: "input" | "textarea" | "select"): HTMLElement {
  const el = document.createElement(tag);
  document.body.appendChild(el);
  return el;
}

function press(from: EventTarget, key: string, mods: Partial<KeyboardEventInit> = {}) {
  from.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, ...mods }));
}

/**
 * The board as the player meets it: the peek composable listening at the window, with the
 * policy installed or ablated, and (either order) so the gate cannot rest on registration
 * order — the capture phase precedes every bubble listener regardless of who mounted first.
 */
function mountBoard(
  opts: { policy: boolean; policyFirst?: boolean } = { policy: true },
) {
  const Harness = defineComponent({
    setup() {
      const solveState = ref("idle");
      if (opts.policy && opts.policyFirst !== false) useShortcutPolicy();
      const peek = useAnswerKeyPeek({
        solveState,
        peekSolution: async () => ({}),
        setMarksActive: () => {},
      });
      if (opts.policy && opts.policyFirst === false) useShortcutPolicy();
      return { peekActive: peek.peekActive };
    },
    render: () => h("div"),
  });
  wrapper = mount(Harness, { attachTo: document.body });
  return wrapper as VueWrapper<{ peekActive: boolean }>;
}

describe("the single-key shortcut policy — 3.4", () => {
  it("names every single-key shortcut the estate binds, each with its prose", () => {
    expect(SINGLE_KEY_SHORTCUTS.map((s) => s.key.toLowerCase())).toEqual([
      "k",
      "g",
      "h",
      "p",
      "d",
    ]);
    for (const row of SINGLE_KEY_SHORTCUTS) {
      expect(row.key, "a crib row prints one key").toHaveLength(1);
      expect(row.does.trim(), `${row.key} must say what it does`).not.toBe("");
    }
  });

  it("a bare shortcut key is the app's; Shift is not a modifier", () => {
    for (const { key } of SINGLE_KEY_SHORTCUTS) {
      expect(
        isForeignChord(new KeyboardEvent("keydown", { key: key.toLowerCase() })),
      ).toBe(false);
      expect(
        isForeignChord(new KeyboardEvent("keydown", { key, shiftKey: true })),
      ).toBe(false);
    }
  });

  it("Ctrl / Cmd / Alt + a shortcut key belongs to the browser", () => {
    for (const { key } of SINGLE_KEY_SHORTCUTS) {
      for (const mod of ["ctrlKey", "metaKey", "altKey"] as const) {
        expect(
          isForeignChord(
            new KeyboardEvent("keydown", { key: key.toLowerCase(), [mod]: true }),
          ),
          `${mod}+${key}`,
        ).toBe(true);
      }
    }
  });

  it("keys the estate does not bind as single-key shortcuts are never claimed", () => {
    for (const key of ["z", "Escape", "ArrowRight", "1"]) {
      expect(isForeignChord(new KeyboardEvent("keydown", { key, ctrlKey: true }))).toBe(
        false,
      );
      expect(isForeignChord(new KeyboardEvent("keydown", { key }))).toBe(false);
    }
  });

  it("a typing context is a prose field — the board's digit cell is not one", () => {
    expect(isTypingContext(field("textarea"))).toBe(true);
    expect(isTypingContext(field("input"))).toBe(true);
    expect(isTypingContext(field("select"))).toBe(true);
    const editable = document.createElement("div");
    editable.setAttribute("contenteditable", "true");
    // jsdom computes no `isContentEditable`; the attribute is the honest stand-in here.
    document.body.appendChild(editable);
    expect(isTypingContext(editable)).toBe(true);
    expect(
      isTypingContext(boardCell()),
      "UI-7(a): K reaches the board from a cell",
    ).toBe(false);
    expect(isTypingContext(document.createElement("div"))).toBe(false);
    expect(isTypingContext(null)).toBe(false);
  });

  it("THE DEFECT, LIVE: without the policy, Ctrl+K reaches the peek", () => {
    const board = mountBoard({ policy: false });
    press(boardCell(), "k", { ctrlKey: true });
    expect(board.vm.peekActive, "the ablation control must show the defect").toBe(true);
  });

  it("Ctrl+K and Cmd+K never reach the peek", () => {
    const board = mountBoard({ policy: true });
    const cell = boardCell();
    press(cell, "k", { ctrlKey: true });
    expect(board.vm.peekActive).toBe(false);
    press(cell, "k", { metaKey: true });
    expect(board.vm.peekActive).toBe(false);
    press(cell, "k", { altKey: true });
    expect(board.vm.peekActive).toBe(false);
  });

  it("bare K still peeks from a focused board cell, and Escape still lifts it", () => {
    const board = mountBoard({ policy: true });
    const cell = boardCell();
    press(cell, "k");
    expect(
      board.vm.peekActive,
      "a cure that amputates the shortcut is not a cure",
    ).toBe(true);
    press(cell, "Escape");
    expect(board.vm.peekActive).toBe(false);
  });

  it("bare K typed into a prose field is a character, not a command", () => {
    const board = mountBoard({ policy: true });
    press(field("textarea"), "k");
    expect(board.vm.peekActive).toBe(false);
  });

  it("the verdict does not depend on which composable mounted first", () => {
    const board = mountBoard({ policy: true, policyFirst: false });
    press(boardCell(), "k", { ctrlKey: true });
    expect(board.vm.peekActive).toBe(false);
    press(boardCell(), "k");
    expect(board.vm.peekActive).toBe(true);
  });

  it("the policy leaves no listener behind when it unmounts", () => {
    const seen: string[] = [];
    const spy = (e: Event) => seen.push((e as KeyboardEvent).key);
    window.addEventListener("keydown", spy);
    try {
      const board = mountBoard({ policy: true });
      press(boardCell(), "k", { ctrlKey: true });
      expect(seen).toEqual([]);
      board.unmount();
      wrapper = null;
      press(boardCell(), "k", { ctrlKey: true });
      expect(seen, "the window is clean again").toEqual(["k"]);
    } finally {
      window.removeEventListener("keydown", spy);
    }
  });
});
