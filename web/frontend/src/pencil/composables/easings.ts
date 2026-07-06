/**
 * House easing curves (design-refinement.md §1.1 ledger — no new beziers without an entry).
 * Shared by every `sequence` subscriber on the unified scheduler (glyph/grid draw-in, the
 * celebration flourish, the gold-star garnish draw-on). Kept as pure `(t: number) => number`
 * so the scheduler's tick can call them directly without a keyframes.js engine instance.
 */

/** Draws onto the page — the house curve for anything arriving. */
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/** Leaves the page — fast and careless (erase family, usePathAnimation). */
export const easeInCubic = (t: number): number => t * t * t;

/** Symmetric — the thinking-scribble / breathe family. */
export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** No shaping — a light sweep or a discrete-index traversal, not a gesture. */
export const linear = (t: number): number => t;

export type Easing = (t: number) => number;

/** Resolve a timing-function name (DRAW_IN_PRESETS carry strings) to a curve. */
export function resolveEasing(name: string): Easing {
  switch (name) {
    case 'easeInCubic':
      return easeInCubic;
    case 'easeInOutCubic':
      return easeInOutCubic;
    case 'linear':
      return linear;
    case 'easeOutCubic':
    default:
      return easeOutCubic;
  }
}
