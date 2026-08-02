import { onBeforeUnmount, onMounted } from "vue";

/**
 * THE SINGLE-KEY SHORTCUT POLICY (T5-W3 row 3.4 — a11y r1 M4, WCAG 2.1.4 Character Key
 * Shortcuts).
 *
 * Five bare letters drive the estate, and each grew its own guard where it was bound — which is
 * exactly why three of them drifted apart:
 *
 *   k  peek    `useAnswerKeyPeek.ts` — a WINDOW keydown with no modifier guard at all, and a
 *              `preventDefault`, so Ctrl+K (Chrome's search-from-address-bar) and Cmd+K flashed
 *              the answer key over the player's board instead of reaching the browser.
 *   g  games   `App.vue` — the correct pattern: returns on any of Ctrl/Cmd/Alt, exempts
 *              editable targets.
 *   h  hint    `GameBoard.vue` — returns on Ctrl/Cmd, NOT on Alt.
 *   p  pencil  `GameBoard.vue` — the same half-guard.
 *   d  deal    `StagingBand.vue` / `GameGallery.vue` — the correct pattern.
 *
 * Five hand-rolled guards cannot state one rule, so this states it once, at the top of the
 * CAPTURE phase, before any of them runs: a character key is the app's only when it is BARE and
 * the focus is not in a prose field. Everything else is the browser's, and is handed back here.
 *
 * `stopPropagation`, never `preventDefault`: the chord is being GIVEN BACK, so the browser's own
 * binding must survive intact. A capture listener on `window` is the first listener in the path,
 * so this beats a bubble-phase window listener on the same window — that is what reaches the
 * peek's own handler without touching it (measured both in jsdom, `useShortcutPolicy.test.ts`,
 * and live in both engines, `e2e/a11y.spec.ts` 3.4).
 */

export interface ShortcutRow {
  /** The bare key, as a crib prints it and as `aria-keyshortcuts` spells it. */
  key: string;
  /** What it does, in the crib's voice. */
  does: string;
}

/**
 * THE FIVE, and the one place they are written down. The policy below derives its key set from
 * this table rather than re-spelling it, so a shortcut cannot exist unguarded, and a crib that
 * renders these rows cannot omit one (r1 L10: the legend named K/H/P and neither G nor D).
 */
export const SINGLE_KEY_SHORTCUTS: readonly ShortcutRow[] = [
  { key: "K", does: "peek" },
  { key: "G", does: "games" },
  { key: "H", does: "hint" },
  { key: "P", does: "pencil" },
  { key: "D", does: "deal" },
];

const KEYS = new Set(SINGLE_KEY_SHORTCUTS.map((s) => s.key.toLowerCase()));

/**
 * A prose field — where a character key is a character and never a command.
 *
 * THE ONE EXEMPTION is the board's own digit cell: its opacity-0 `<input>` is the roving
 * tabindex's HOME, so a keyboard player sits in one the entire game. UI-7(a) removed the old
 * `.board-cells` exemption on purpose (K did nothing from the grid, which is where the player
 * always is); the cell filters to 1..N and reverts anything else, so a letter there is never
 * entry. Scoped to `role="gridcell"` — the cell's own contract (`DigitCell.vue:140`), not a
 * class name.
 */
export function isTypingContext(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || typeof el.tagName !== "string") return false;
  if (el.isContentEditable || el.getAttribute?.("contenteditable") === "true")
    return true;
  if (!/^(input|textarea|select)$/i.test(el.tagName)) return false;
  return !el.closest?.("[role='gridcell']");
}

/**
 * Is this keydown the browser's rather than the board's? Shift is deliberately NOT a modifier
 * here: `K` is `k` typed with the shift key, and every handler in the estate matches both cases.
 */
export function isForeignChord(e: KeyboardEvent): boolean {
  if (typeof e.key !== "string" || !KEYS.has(e.key.toLowerCase())) return false;
  if (e.metaKey || e.ctrlKey || e.altKey) return true;
  return isTypingContext(e.target);
}

/** Install the policy for the life of the calling component (App owns it, once, for the page). */
export function useShortcutPolicy() {
  function onKeydownCapture(e: KeyboardEvent) {
    if (isForeignChord(e)) e.stopPropagation();
  }
  onMounted(() => window.addEventListener("keydown", onKeydownCapture, true));
  onBeforeUnmount(() => window.removeEventListener("keydown", onKeydownCapture, true));
}
