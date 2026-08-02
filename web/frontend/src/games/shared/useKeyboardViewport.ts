import { onMounted, onUnmounted } from "vue";
import { usePrefersReducedMotion } from "@mkbabb/pencil-boil";
import { BOARD_CELLS_CLASS } from "./constants";

/**
 * useKeyboardViewport — T4-WM §1 keyboard-avoidance (lane C, iOS platform discipline).
 *
 * The pad abrogation returns the OS software keyboard. On iOS the keyboard shrinks the
 * VISUAL viewport while the LAYOUT viewport stays full-height — WebKit ships neither the
 * `interactive-widget` viewport key nor the VirtualKeyboard API (r3 rows 2b/2c, both hard
 * refusals) — so a focused board cell below the keyboard fold is eclipsed with nothing to
 * push it up. `visualViewport` is the one cross-engine path (r3 row 2d): we publish the
 * keyboard's occlusion height as the `--keyboard-inset` custom property (the stacked scene
 * turns it into bottom scroll-room, App.vue) and, while a board cell holds focus, scroll that
 * cell clear of the keyboard band. The VirtualKeyboard API is deliberately NOT the primary
 * path (Chromium-only).
 *
 * One document-scoped install (from App.vue) covers both games: it keys on the shared
 * `.board-cells` contract and no-ops for every other focus target. On desktop the maths are
 * self-gating — with no software keyboard the visual viewport equals the layout viewport, so
 * the inset is 0 and every in-view cell yields a zero delta (no scroll, no jank).
 *
 * ── T4-P1 pass 4 · TWO CHARTER ROWS DISPOSED HERE ──────────────────────────────────────────
 *
 * THE 296px KEYPAD BAND — **CLOSED, GREEN.** The F3 charter carried the keypad as a measured
 * constant (296px on a booted device, not the 336 pass 1 assumed) and pass 3 routed it to the
 * owner because a sim's soft keypad would not rise. The keypad was never the mechanism: this
 * composable's `--keyboard-inset` IS the band, and the stacked scene spends it as bottom
 * scroll-room (App.vue), so the constant is drivable through the fake visual viewport at its
 * measured size. Driven at 296 on the built dist, both engines: the page grows 292 of the 296
 * (1132 → 1424 chromium, 1131 → 1423 webkit — the 4px shortfall is under the 8px seating
 * margin), the commit verb seats fully visible above the band with 8.05px to spare, and the
 * DEEPEST control seats clear too. Lane B's G4 charge — the verb 8.9px under the keypad at max
 * scroll — was a property of a FIXED tray; this tree's panel is in flow, so the band is a
 * scroll question and the scroll-room answers it. Gated in `mobile-platform.spec.ts`, with the
 * control that matters: stop spending the inset and the deepest control strands under the band.
 *
 * THE `--vv-height` ANCHOR — **THE TRIGGER FIRED, T5-W4 PASS 6.** The charter banked
 * `top: var(--vv-height)` + translate-up (never `bottom: 0`, never height-yield) as the iOS
 * fixed-bottom idiom, proven necessary by Lane B's G4 control where a fixed tray was 100%
 * occluded. Pass 4 retired it with its trigger written down, verbatim: *"the first
 * position:fixed surface that mounts below 1024 must anchor on `top: var(--vv-height)` with the
 * rest pose on `translate:` — publish the var HERE, in this same resize handler, vars before
 * `ensureVisible`."* That surface now exists — the portrait controls sheet (`scene.css`, the
 * `<1024`-portrait pose of `#controls-drawer`) — so the clause is honoured exactly as written,
 * in this handler, both vars before any scroll.
 *
 * WHAT THE NUMBER IS: `vv.height + vv.offsetTop` — the visual viewport's BOTTOM EDGE in layout
 * coordinates, not its height. Under a risen keyboard that edge moves up by the band; under
 * pinch-zoom `offsetTop` keeps it honest, exactly as `computeKeyboardInset` already does. A
 * sheet anchored `top: var(--vv-height)` with its rest pose on `translate` therefore rides the
 * keyboard's edge instead of being occluded by it, and never yields height (a height animation
 * is a layout animation, which is the one thing this estate's drawer never does).
 *
 * The necessity is not asserted from the idiom: it is ablated. Restore `bottom: 0` in place of
 * the anchor and the deepest chip strands under the 296px band; anchored, every seat is clear
 * at `scrollY 0` in both engines (`pass6/land/logs/keypad-*.log`).
 */

/** The cell wrappers a board input lives inside — we scroll the whole cell, not the bare input. */
const CELL_SELECTOR = ".sudoku-cell,.futoshiki-cell";

/**
 * Keyboard occlusion height (px): how much of the layout viewport the visual viewport no
 * longer covers. `offsetTop` folds a pinch-zoom offset into the band so the maths stay honest
 * under zoom. Never negative.
 */
export function computeKeyboardInset(
  layoutHeight: number,
  vvHeight: number,
  vvOffsetTop: number,
): number {
  return Math.max(0, Math.round(layoutHeight - (vvHeight + vvOffsetTop)));
}

/**
 * Scroll delta (px; positive = scroll the page down) that seats `cell` clear of the visible
 * `band` (the space above the keyboard), keeping a `gap` of breathing room from either edge.
 * Returns 0 when the cell already sits comfortably inside the band — the composable never
 * fights the layout for an already-visible cell (the spec's residual-risk: hard-centering can
 * demand more scroll room than the boil scene has; a minimal reveal never does).
 */
export function computeScrollDelta(
  cell: { top: number; height: number },
  band: { top: number; height: number },
  gap = 24,
): number {
  const cellBottom = cell.top + cell.height;
  const bandBottom = band.top + band.height;
  const clearOfTop = cell.top >= band.top + gap;
  const clearOfBottom = cellBottom <= bandBottom - gap;
  if (clearOfTop && clearOfBottom) return 0;
  // Taller than the comfortable band (a huge cell / a tiny band): seat the TOP; the bottom
  // can't also fit, and the entry glyph lives at the cell's centre either way.
  if (cell.height > band.height - 2 * gap) {
    return Math.round(cell.top - (band.top + gap));
  }
  // Below the fold (the common case: under the keyboard) → lift its bottom above the band edge.
  if (!clearOfBottom) return Math.round(cellBottom - (bandBottom - gap));
  // Above the band (rare: a pinch/scroll left it overhead) → drop its top into view.
  return Math.round(cell.top - (band.top + gap));
}

export function useKeyboardViewport(): void {
  const prefersReducedMotion = usePrefersReducedMotion();
  const maybeVv = typeof window !== "undefined" ? window.visualViewport : null;
  // No visualViewport (an old engine, or SSR) → the browser's native focus-scroll is the
  // floor; there is nothing cross-engine to hand-roll against, so install nothing.
  if (!maybeVv) return;
  const vv: VisualViewport = maybeVv; // non-null past the guard (const holds it into the closures)

  let activeInput: HTMLElement | null = null;
  let releaseRaf = 0;

  const layoutHeight = (): number =>
    document.documentElement.clientHeight || window.innerHeight || 0;

  /** Both vars, in the one handler, BEFORE any `ensureVisible` — the trigger's own ordering. */
  function publishInset(): void {
    const inset = computeKeyboardInset(layoutHeight(), vv.height, vv.offsetTop);
    document.documentElement.style.setProperty("--keyboard-inset", `${inset}px`);
    // The visual viewport's bottom edge in layout coords — the portrait sheet's anchor.
    // CLAMPED TO THE LAYOUT VIEWPORT, and that is an invariant rather than a defence: the
    // visual viewport is a window ONTO the layout viewport, so its bottom edge can never sit
    // below the layout's own. Unclamped, any engine or harness that reports a stale height
    // anchors the sheet off the bottom of the page — which is exactly how the emulated-keypad
    // row found this (a stand-in `visualViewport` captured 1669 against a 664 layout, and the
    // sheet went with it). `--keyboard-inset` was already immune by its own `Math.max(0, …)`,
    // which is why nothing had reddened before there was a second consumer.
    document.documentElement.style.setProperty(
      "--vv-height",
      `${Math.round(Math.max(0, Math.min(layoutHeight(), vv.height + vv.offsetTop)))}px`,
    );
  }

  function ensureVisible(behavior: ScrollBehavior): void {
    if (!activeInput) return;
    const cell =
      (activeInput.closest(CELL_SELECTOR) as HTMLElement | null) ?? activeInput;
    const rect = cell.getBoundingClientRect();
    const delta = computeScrollDelta(
      { top: rect.top, height: rect.height },
      { top: vv.offsetTop, height: vv.height },
    );
    if (delta === 0) return;
    window.scrollBy({ top: delta, behavior });
  }

  function onViewportChange(): void {
    publishInset();
    // The keyboard is mid-animation across the first resizes; track it instantly (no smooth
    // stacking) so the cell rides above the rising edge rather than lurching once at the end.
    if (activeInput) ensureVisible("auto");
  }

  function isBoardInput(el: EventTarget | null): el is HTMLElement {
    return (
      el instanceof HTMLElement &&
      el.tagName === "INPUT" &&
      !!el.closest(`.${BOARD_CELLS_CLASS}`)
    );
  }

  function onFocusIn(e: FocusEvent): void {
    if (!isBoardInput(e.target)) return;
    activeInput = e.target;
    // Defer a frame so the keyboard has begun resizing the visual viewport before we measure,
    // then reveal with a smooth ride (PRM → instant).
    requestAnimationFrame(() => {
      publishInset();
      ensureVisible(prefersReducedMotion.value ? "auto" : "smooth");
    });
  }

  function onFocusOut(e: FocusEvent): void {
    if (e.target !== activeInput) return;
    // A cell→cell move fires focusout then focusin; release only once focus truly leaves the
    // board, so the inset doesn't flicker to 0 between adjacent cells.
    cancelAnimationFrame(releaseRaf);
    releaseRaf = requestAnimationFrame(() => {
      if (isBoardInput(document.activeElement)) {
        activeInput = document.activeElement as HTMLElement;
        return;
      }
      activeInput = null;
      // Focus left the board → the keyboard is dismissing. Reclaim the scene's scroll-room
      // eagerly; the trailing visualViewport resize confirms it (and may be coalesced away).
      document.documentElement.style.setProperty("--keyboard-inset", "0px");
    });
  }

  onMounted(() => {
    vv.addEventListener("resize", onViewportChange);
    vv.addEventListener("scroll", onViewportChange);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    publishInset();
  });

  onUnmounted(() => {
    vv.removeEventListener("resize", onViewportChange);
    vv.removeEventListener("scroll", onViewportChange);
    document.removeEventListener("focusin", onFocusIn);
    document.removeEventListener("focusout", onFocusOut);
    cancelAnimationFrame(releaseRaf);
    document.documentElement.style.removeProperty("--keyboard-inset");
    // The sheet's CSS carries `100dvh` as the var's fallback, so an unpublished anchor is a
    // defined pose rather than an invalid `top` — the sheet rests on the layout viewport's
    // own bottom edge, which is where it sits whenever no keyboard is up anyway.
    document.documentElement.style.removeProperty("--vv-height");
  });
}
