/**
 * CrayonHeart geometry — the felt-heart path family (T3-W9, F7 §3.0).
 *
 * One geometry, four faces (the Smile Meter precedent): every variant of
 * CrayonHeart.vue draws from these constants. The plush body is the single
 * geometry change from the original six-layer heart — felt toys have no
 * needle points, so the closing quadratic rounds the old near-point at
 * (50, 88). The shadow lobe is the same path translated (+3, +3), replacing
 * the hand-offset twin; the stitch line is the same path again, inset and
 * dashed — the one "sewn felt" signature.
 */

/** Default viewBox; the celebration variant bumps the top edge for the stem. */
export const HEART_VIEWBOX = "0 0 100 100";
export const HEART_VIEWBOX_CELEBRATION = "0 -4 100 104";

/** Plush body — lobes unchanged, tip rounded by the closing quadratic (F7 §3.0). */
export const HEART_PLUSH_PATH =
  "M46 85 C 14 59, 7 35, 17 18 C 27 3, 47 13, 50 26 C 53 13, 73 3, 83 18 C 93 35, 86 59, 54 85 Q 50 89, 46 85 Z";

/** Shadow lobe = the plush path, one transform — not a second geometry. */
export const HEART_SHADOW_TRANSFORM = "translate(3 3)";

/** Stitch line: the plush path re-used, inset, dashed. Stroke color is
 *  MASCOT_COLORS.heart.stitch — color-mix(in srgb, #1a1a1a 35%, #FF4D6D)
 *  baked to a constant (SVG presentation attrs can't color-mix). */
export const HEART_STITCH = {
  transform: "translate(7 7) scale(0.86)",
  strokeWidth: 1.5,
  dasharray: "6 5",
} as const;

/** Highlight arc + dot on the upper-left lobe (unchanged from the original). */
export const HEART_HIGHLIGHT_ARC = "M 25 25 C 20 35, 25 45, 30 50";
export const HEART_HIGHLIGHT_DOT = { cx: 35, cy: 20, r: 3 } as const;

/** Eyes — grouped so the celebration blink can squash them as one (F7 §3.2);
 *  tiny re-weights r 4 → 5.5 for legibility at 16–20px raster (F7 §3.4). */
export const HEART_EYES = {
  left: { cx: 38, cy: 40 },
  right: { cx: 62, cy: 40 },
  r: 4,
  rTiny: 5.5,
} as const;

/** Smiles: default, the shallower tiny read, the deeper blush-wink read. */
export const HEART_SMILE = "M 35 55 Q 50 70, 65 55";
export const HEART_SMILE_TINY = "M 35 55 Q 50 66, 65 55";
export const HEART_SMILE_DEEP = "M 35 55 Q 50 73, 65 55";

/** The wink arc replacing the left eye on the blush variant's face B (F7 §3.3). */
export const HEART_WINK_ARC = "M 34 40 Q 38 44, 42 40";

/** Blush ellipses; rx grows 5 → 7 on the happy faces (celebration, face B). */
export const HEART_BLUSH = {
  left: { cx: 28, cy: 48 },
  right: { cx: 72, cy: 48 },
  rx: 5,
  rxHappy: 7,
  ry: 3,
} as const;

/** The Heart Fruit tell — stem + leaf, celebration variant only (F7 §3.2). */
export const HEART_STEM = "M 50 12 C 49 7, 51 4, 53 2";
export const HEART_STEM_WIDTH = 4;
export const HEART_LEAF = "M 53 6 Q 61 2, 65 8 Q 59 12, 53 8 Z";
export const HEART_LEAF_STROKE_WIDTH = 2.5;

/** Tiny optical re-weights (legibility by subtraction, F7 §3.4). */
export const HEART_TINY = { outline: 5.5, smileStroke: 5.5 } as const;
