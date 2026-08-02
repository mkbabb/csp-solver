import { ref } from "vue";

// Coarse-pointer probe, pencil-local by necessity: this composable lives in the pencil layer,
// which the boundary lint (eslint.config.js `pencilMayNotImportGames`) forbids from importing
// games/shared's `useCoarsePointer`. One module-level MediaQueryList, shared by every hover-card
// instance — the exact idiom of that composable, kept self-contained here so pencil stays
// game-agnostic. The `matchMedia` guard is for the no-DOM case (SSR, jsdom), not for any
// browser: every engine at the declared support floor carries MQL and its listeners.
const coarse = ref(false);
if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
  const mq = window.matchMedia("(pointer: coarse)");
  coarse.value = mq.matches;
  mq.addEventListener("change", (e) => {
    coarse.value = e.matches;
  });
}

export function useHoverCard(closeDelay = 150) {
  const isOpen = ref(false);
  let closeTimer: ReturnType<typeof setTimeout> | null = null;

  function toggle() {
    isOpen.value = !isOpen.value;
  }

  function close() {
    isOpen.value = false;
  }

  function onHoverEnter() {
    // The pending close is cancelled BEFORE the coarse gate, and the order is the whole fix
    // (T6, debug lane's evidence). A tap inside the open card fires focusout → focusin: the
    // focusout arms a 150ms close, and the focusin that immediately follows returned here at
    // the gate below without disarming it — so on touch the card shut itself ~150ms after any
    // tap in it, reproduced on the incumbent GitHub link. Cancelling first is right for both
    // pointers: a re-entered card must never close on a timer it has already outrun.
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    // The attribution tap bug (T4-WM §2; r2 §3): on a coarse pointer a single tap fires
    // focusin (this handler, via the wrapper's @focusin) AND click (the trigger's @click
    // toggle) in one gesture — open-then-toggled-closed, net closed, so the card never
    // opens by tap. There is no hover on touch, so the focus-OPEN half stands down and the
    // click toggle owns open/close; focusout still closes on an outside tap. Fine pointers
    // keep the full hover + focus-within disclosure (the UI-6 keyboard path is fine-pointer),
    // and a coarse keyboard user still opens via the trigger's Enter (@keydown.enter=toggle).
    if (coarse.value) return;
    isOpen.value = true;
  }

  function onHoverLeave() {
    closeTimer = setTimeout(() => {
      isOpen.value = false;
      closeTimer = null;
    }, closeDelay);
  }

  return { isOpen, toggle, close, onHoverEnter, onHoverLeave };
}
