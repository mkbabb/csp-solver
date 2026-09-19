/**
 * overlay.ts — ACC-SIX pass 1 PROTOTYPE, as `addStyleTag` text. No product file moves.
 *
 * Three arms, and the ONLY thing that differs between (a) and (b) is WHAT THE SIXTH IS.
 * Everything else — blue's one job, the focus ring's dark arm, the sparkle's two literals,
 * the confirm's destructive face — is COMMON, so the fork isolates its own variable.
 *
 *   HEAD : no overlay at all (the control).
 *   a    : the sixth is WAX — a crayon-violet with an ink tier, under the crayon dark law
 *          (index.css:164-169: hue ±3°, L +0.06…+0.10, chroma may rise).
 *   b    : the sixth is the ANSWER's material — one hue, a three-rung lightness ladder
 *          already in the tree, each consumer taking the rung its GROUND demands.
 *
 * Every hex here is derived in `../probe/sixth-math.mjs` / `sixth-window.mjs` and none of
 * them is new to the product except arm (a)'s two wax hexes and the one `blue-ink` hex,
 * which are the things being tested.
 */

/** Arm (a)'s wax pair. Light L .606 C .166 h 293; dark L .686 C .166 h 293 — dL +0.080,
 *  dHue 0.13°, dC −0.001: the stated crayon dark law satisfied to the letter, and both
 *  arms in sRGB (chroma held at the wax MEAN 0.166 precisely so the dark arm does not
 *  clip, which every candidate at the violet's native 0.219 does). */
export const WAX_LIGHT = "#886adb";
export const WAX_DARK = "#a083f6";

/** Arm (b)'s ladder — three rungs of ONE hue, all three already in `index.css`:
 *  PALE  #c4b5fd = dark solver-ink-2 = the sparkle's inline literal  (L .811 C .101 h 293.6)
 *  MID   #8b5cf6 = light progress-ink                                (L .606 C .219 h 292.7)
 *  DEEP  #7c3aed = light solver-ink-2 = dark progress-ink            (L .541 C .247 h 293.0) */
export const ANSWER_PALE = "#c4b5fd";
export const ANSWER_MID = "#8b5cf6";
export const ANSWER_DEEP = "#7c3aed";

/** blue-ink: crayon-blue #4a90d9 hue-locked (251.4°) and darkened until it clears AA as
 *  TEXT on BOTH light papers — the exact move red-ink/green-ink/orange-ink/gold-ink model.
 *  Shallowest darkening that clears: L 0.555 at C 0.131 → 4.64:1 on --color-card,
 *  4.53:1 on --color-background. Dark COLLAPSES INTO WAX, which is the estate's own
 *  dark-mode ink rule and is also, for the first time, what `--color-focus-sketch`'s own
 *  comment has always claimed. */
export const BLUE_INK_LIGHT = "#2f76bd";

const COMMON = `
/* ── blue is ONE job: the thing you are touching (your hand AND your focus) ─────── */
:root {
  --color-blue-ink: ${BLUE_INK_LIGHT};
  --color-user-ink: var(--color-blue-ink);
  --color-focus-sketch: var(--color-blue-ink);
}
.dark {
  /* the ink tier collapses into the wax at night — index.css:386-394's own rule */
  --color-blue-ink: var(--color-crayon-blue);
  --color-user-ink: var(--color-blue-ink);
  --color-focus-sketch: var(--color-blue-ink);
}

/* ── the sparkle's two inline literals become the token (GameControlPanel.vue:2081,:2087) ──
   THE MIX IS BANKED IN :root, NOT SPELLED AT THE CALL SITE, and that is a measured ruling
   rather than a preference: color-mix(in srgb, var(--x) 30%, transparent) written inside
   filter: drop-shadow() resolved INTERMITTENTLY to rgba(1, 0, 0, 0.3) in Chromium on this
   tree (measured on arm b, then on arm a, then not reproducible in isolation — a race
   between the property's registration and the filter's first computation). Two :root
   mixes and a plain var() at the call site is the shape --ink-press-rule /
   --ink-press-quiet (index.css:259-266) already models, and it does not race. */
:root, .dark {
  --sparkle-glow-soft: color-mix(in srgb, var(--color-sparkle-glow) 30%, transparent);
  --sparkle-glow-strong: color-mix(in srgb, var(--color-sparkle-glow) 60%, transparent);
}
.sparkle-icon {
  filter: drop-shadow(0 0 2px var(--sparkle-glow-soft)) !important;
}
@media (hover: hover) {
  .icon-btn:hover .sparkle-icon {
    filter: drop-shadow(0 0 5px var(--sparkle-glow-strong)) !important;
  }
}

/* ── the confirm's destructive face takes the house danger ink (GameGallery.vue:1458) ── */
.guard-leave .guard-face {
  color: var(--color-red-ink) !important;
  background: color-mix(in srgb, var(--color-red-ink) 8%, transparent) !important;
}
`;

const ARM_A = `
:root {
  /* THE SIXTH CRAYON — wax. Its own ink tier, the red/green/orange/gold pattern. */
  --color-crayon-violet: ${WAX_LIGHT};
  --color-violet-ink: ${ANSWER_DEEP};
  --color-progress-ink: var(--color-crayon-violet);
  --color-sparkle-glow: var(--color-crayon-violet);
}
.dark {
  --color-crayon-violet: ${WAX_DARK};
  --color-violet-ink: var(--color-crayon-violet);
  --color-progress-ink: var(--color-crayon-violet);
  --color-sparkle-glow: var(--color-crayon-violet);
}
` + COMMON;

const ARM_B = `
:root {
  /* THE SIXTH — the ANSWER's material. One hue, three rungs, zero new hexes. Each
     consumer takes the rung its GROUND demands, which is why the ladder has three and
     not two: the trace crosses a DARK graphite frame and a NEAR-WHITE card in light,
     and a LIGHT graphite frame and a NEAR-BLACK card in dark. */
  --color-answer-pale: ${ANSWER_PALE};
  --color-answer-mid: ${ANSWER_MID};
  --color-answer-deep: ${ANSWER_DEEP};
  --color-solver-ink-2: var(--color-answer-deep);
  --color-progress-ink: var(--color-answer-mid);
  --color-sparkle-glow: var(--color-answer-pale);
}
.dark {
  --color-solver-ink-2: var(--color-answer-pale);
  --color-progress-ink: var(--color-answer-deep);
  --color-sparkle-glow: var(--color-answer-pale);
}
` + COMMON;

export type Arm = "HEAD" | "a" | "b";
export const overlayFor = (arm: Arm): string | null =>
  arm === "a" ? ARM_A : arm === "b" ? ARM_B : null;

/** The scratch count tape, injected at the frame's head. NOT a product change — a node
 *  appended to the board wrapper so the label arm can be looked at and measured.
 *  Every codepoint is in the Patrick Hand cut (index.css:94-96 declares U+0030-0039);
 *  `%` (U+0025) and `/` (U+002F) are NOT, which is why the string says "of" and not "/". */
export const TAPE_TEXT = (n: number, of: number) => `${n} of ${of} filled`;
export const TAPE_CSS = `
.acc-six-tape {
  position: absolute;
  font-family: var(--font-hand);
  font-size: var(--type-tag, 0.9rem);
  color: var(--color-progress-ink);
  background: var(--sheet-washi-neutral);
  padding: 0.05rem 0.4rem;
  border-radius: 0.15rem;
  white-space: nowrap;
  pointer-events: none;
  z-index: 3;
}
`;
