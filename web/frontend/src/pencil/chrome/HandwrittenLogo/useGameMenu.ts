import { ref } from "vue";

export interface GameMenuOption {
  value: string;
  label: string;
}

/**
 * Collapsible-listbox state for the wordmark-as-game-picker (ARIA-APG "Select-Only
 * Combobox"). DOM focus stays on the trigger button throughout; the highlighted option is
 * tracked with `aria-activedescendant`, so there is no focus trap and no roving tabindex to
 * collide with the board grid's own arrow-key handling (a different focus subtree).
 *
 * `onKeydown` is bound to the trigger. While the menu is OPEN it calls `stopPropagation()`
 * for its own keys — critically Escape — so they never reach the `window` keydown listeners
 * in App.vue / FutoshikiGame that drive the answer-key peek. The menu's Escape is its own.
 */
export function useGameMenu(
  options: () => GameMenuOption[],
  current: () => string,
  select: (value: string) => void,
) {
  const isOpen = ref(false);
  const highlighted = ref(0);

  function currentIndex(): number {
    const i = options().findIndex((o) => o.value === current());
    return i >= 0 ? i : 0;
  }

  function open() {
    if (isOpen.value) return;
    highlighted.value = currentIndex();
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
  }

  function toggle() {
    if (isOpen.value) close();
    else open();
  }

  function move(delta: number) {
    const n = options().length;
    if (n === 0) return;
    highlighted.value = (highlighted.value + delta + n) % n;
  }

  function selectIndex(i: number) {
    const opt = options()[i];
    close();
    if (opt) select(opt.value);
  }

  function onKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen.value) open();
        else {
          e.stopPropagation();
          move(1);
        }
        return;
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen.value) open();
        else {
          e.stopPropagation();
          move(-1);
        }
        return;
      case "Home":
        if (isOpen.value) {
          e.preventDefault();
          e.stopPropagation();
          highlighted.value = 0;
        }
        return;
      case "End":
        if (isOpen.value) {
          e.preventDefault();
          e.stopPropagation();
          highlighted.value = options().length - 1;
        }
        return;
      case "Enter":
      case " ":
      case "Spacebar":
        e.preventDefault();
        if (!isOpen.value) open();
        else {
          e.stopPropagation();
          selectIndex(highlighted.value);
        }
        return;
      case "Escape":
        if (isOpen.value) {
          // Shield the app-/game-level `window` Escape (answer-key peek) — this
          // Escape belongs to the menu alone.
          e.preventDefault();
          e.stopPropagation();
          close();
        }
        return;
      case "Tab":
        // Let focus leave naturally; just collapse.
        if (isOpen.value) close();
        return;
    }
  }

  return {
    isOpen,
    highlighted,
    open,
    close,
    toggle,
    move,
    selectIndex,
    onKeydown,
    currentIndex,
  };
}
