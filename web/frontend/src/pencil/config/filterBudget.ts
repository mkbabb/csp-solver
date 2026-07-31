/**
 * THE LIVE-FILTER BUDGET — the countable invariant (P1 README §"The countable invariant").
 *
 * Third occurrence of the same defect class (the grid hoist, the divider collapse, the glyph
 * population), so the count comes first. WebKit caches no filter result for unlayered SVG
 * content and takes a CPU path for `filter: url(#…)` on an HTML box, so every resident
 * reference filter is a landmine for any style write that reaches it: r2 measured 63–81 live
 * `url(#grain-static)` chains on the board digits alone, re-executing on the 125 ms boil beat
 * — 8 hitches/s at idle, forever, and idle 79.0 → 98.3 fps when they go.
 *
 * This file is an EXACT-MATCH ALLOWLIST, never a ceiling: `e2e/filter-census.spec.ts` censuses
 * the rendered board scene against the BUILT dist and fails when the population differs from
 * these rows in EITHER direction. A new filter surface reds CI even when an old one retires,
 * which is the property a ceiling cannot give.
 *
 * Counting rule (the spec states it in full): own computed `filter` ≠ none AND own computed
 * `display` ≠ none. Opacity-0 pose siblings count — they raster, which is the whole mechanism.
 * A surface that retired its own filter structurally does not (HandDrawnGrid's four
 * `.baked-hidden` live-fallback poses, once the bitmaps land). Ancestor display is deliberately
 * not consulted, so both always-mounted control-panel twins count at every width and one
 * allowlist serves the desktop and mobile regimes alike.
 */

export interface FilterBudgetRow {
  /** The exact selector the census matches an element against. */
  selector: string;
  /** Expected population in the default board scene — exact, in both directions. */
  count: number;
  /** The censused filter value, verbatim. */
  filter: string;
  /** Why it survives, and the named trigger that retires it. */
  reason: string;
}

/**
 * Per-cell filters: ZERO. `HandwrittenGlyph`'s `:filter` binding is deleted (G2.4 ruled **C**
 * for the glyph — the bake could not reproduce the filter's per-pixel tooth at glyph scale and
 * SSIM ranked C closer to the incumbent than B in all four engine×theme cells). 61 dealt / 81
 * solved reference filters became 0, and the `grainOn` hoist machinery died with the thing it
 * hoisted — including r3 §4.2's never-hoisted third site, the hover wiggle.
 */
const PER_CELL: readonly FilterBudgetRow[] = [];

/**
 * Beat-driven filters: ZERO, with one Apple-frozen exception. A filter bound to a pose that
 * flips on the beat re-executes its whole chain per flip on WebKit; the divider is the proof
 * case and the one surface where the bake FAILED its soul gate (SSIM 0.809 — a 100%-stroke
 * thin line whose two noise realizations cannot correlate window-wise), so it took the banked
 * fallback instead: the filter stays and pose 0 is pinned on Apple engines.
 */
const BEAT_DRIVEN: readonly FilterBudgetRow[] = [
  {
    selector: ".boil-divider-wrap g.boil-pose",
    count: 8,
    filter: "url(#grain-static)",
    // 4 poses × the two always-mounted control-panel twins (desktop XOR painted, both in the
    // DOM). FROZEN on Apple at `fb15253d` — `LIVE_FILTER_FROZEN` collapses the frame count to
    // 1, so each pose rasters ONCE and the beat never re-executes the chain.
    // TRIGGER — this row retires on either: (a) a successful bake retry of the thin-line grain
    // (the 0.809 re-derived above the 0.98 floor), or (b) a Chromium red here, which would mean
    // the freeze leaked out of the Apple gate.
    reason:
      "BoilDivider poses, Apple-frozen at fb15253d (bake failed its soul gate at 0.809)",
  },
];

/**
 * Reference filters on HTML boxes: ZERO. G2.4 ruled **C** for both HTML-box surfaces —
 * `.icon-btn` (16 buttons: every icon is viewBox 24 against grain-static's 25-unit wavelength,
 * so the filter was a uniform ±1.25-unit nudge, not a tooth) and `.control-panel-filtered` (2:
 * a 3-pass 4-octave turbulence chain plus three displacement maps and two blends over a
 * ~320×700 CSS panel, on WebKit's software filter path, +12.3 fps on deal when it goes).
 * Reversal is cheap and named: the panel's `#stroke-light` is one CSS block.
 */
const HTML_BOXES: readonly FilterBudgetRow[] = [];

/**
 * Transients: each rasters ONCE per appearance and never re-enrolls a per-beat painter
 * (T3-W13 §1-P4-ii, the freeze-at-one-pose discipline). One line of reason each.
 */
const TRANSIENT: readonly FilterBudgetRow[] = [
  {
    selector: "svg.crayon-heart g",
    count: 2,
    filter: "url(#wobble-heart)",
    reason:
      "AttributionCard hearts — static wobble, one raster per appearance, never on a beat",
  },
  {
    selector: "button.sun-moon-toggle svg.toggle-icon",
    count: 2,
    filter: "url(#wobble-celestial)",
    reason:
      "the toggle's two live bodies (sun + moon) — the Bloom's warped instances, one raster each",
  },
  {
    selector: "button.icon-btn svg.sparkle-icon",
    count: 2,
    filter: "drop-shadow",
    reason:
      "built-in interpolable drop-shadow (not a reference filter) — GPU path, benign (r3 §3.2)",
  },
];

/**
 * Every row the census may match, in one list. The four groups above are LOCAL by design: the
 * charter's invariant is `perCell 0 · beatDriven 0 (one exception) · htmlBoxes 0 · a transient
 * allowlist`, and it is stated by the four named groups plus their reasons — not by four extra
 * exports nobody imports.
 */
export const FILTER_BUDGET: readonly FilterBudgetRow[] = [
  ...PER_CELL,
  ...BEAT_DRIVEN,
  ...HTML_BOXES,
  ...TRANSIENT,
];

/**
 * The counted total, and the ceiling the charter committed to: **≤ 14** in the default board
 * scene, against 98–118 measured on the base build (r1 §5 read 99–123 across board states).
 */
export const FILTER_BUDGET_TOTAL = FILTER_BUDGET.reduce((n, r) => n + r.count, 0);
export const FILTER_BUDGET_CEILING = 14;

/**
 * The board-cell subtree carries NO live filter. Kept as its own assertion because the glyph
 * population is the surface r2 measured as the root cause — a regression there must name itself.
 */
export const PER_CELL_SCOPE = ".board-cells";

/**
 * SECONDARY CENSUS — the `forwards`/`both` fill allowlist (the tripwire that would have caught
 * `cell-reveal` before the owner did).
 *
 * `animation-fill-mode: forwards` retains the animation's EFFECT, and an effect that supplies a
 * computed transform keeps WebKit's promotion of the element alive: `cell-reveal`'s 100% keyframe
 * is `transform: scale(1)`, which does not compute to `none` but to a matrix, so 35–81 board
 * cells carried an effect-sourced transform indefinitely — r3 §3.1's best "iOS especially"
 * mechanism, at DPR3 a tile-budget event. Four sites dropped their redundant forwards half in
 * P-W3 (`.cell-reveal-animated`, `.pencil-marks`, `.cell-because`, `.cell-ghost-path`); every
 * site that KEEPS it is listed here with the end state that earns it.
 *
 * Keyed on file + animation name (never a line number — those churn), with the occurrence count.
 */
export interface FillAllowRow {
  /** Path relative to `web/frontend/`. */
  file: string;
  /** The `animation-name` at the site. */
  animation: string;
  /** How many sites in that file use this animation with a forwards-ish fill. */
  count: number;
  /** The retained end state, and why it is not the cascade value. */
  reason: string;
}

export const FILL_ALLOWLIST: readonly FillAllowRow[] = [
  {
    file: "src/assets/index.css",
    animation: "pencil-draw-on",
    count: 1,
    reason:
      "ends at opacity var(--draw-opacity, 1) — consumers set it below 1, so the fill holds",
  },
  {
    file: "src/pencil/chrome/MarginNote.vue",
    animation: "note-write-in",
    count: 2,
    reason:
      "ends at clip-path inset(0 0 0 0); the cascade is `none` — the wipe must stay open",
  },
  {
    file: "src/pencil/chrome/CompletionVignette.vue",
    animation: "vignette-write-in",
    count: 1,
    reason: "same clip-path wipe as the margin note; the cascade is `none`",
  },
  {
    file: "src/games/shared/SolverErrorNote.vue",
    animation: "note-slide-in",
    count: 1,
    // BANKED RESIDUE, named honestly: this one ends at `transform: translateY(0)`, which
    // computes to a matrix and not to `none` — the same mechanism as `cell-reveal`, at a
    // population of 0–1 transient notes instead of 35–81 board cells. It stays because the
    // note is v-if'd out of the default scene entirely, so nothing is retained at idle.
    // TRIGGER: the note becoming resident (a persistent error strip), or a second such site.
    reason:
      "transient error note (v-if, absent at idle); ends at translateY(0) — banked residue",
  },
  {
    file: "src/games/shared/SolverErrorNote.vue",
    animation: "note-fade-in",
    count: 1,
    reason: "the PRM arm of the same note — opacity only, no transform; absent at idle",
  },
  {
    file: "src/pencil/celestial/DarkModeToggle.vue",
    animation: "toggle-squash",
    count: 1,
    reason:
      "gesture-scoped class, dropped on completion — never resident in the default scene",
  },
  {
    file: "src/pencil/celestial/DarkModeToggle.vue",
    animation: "plush-land",
    count: 1,
    reason:
      "gesture-scoped class, dropped on completion — never resident in the default scene",
  },
  {
    file: "src/pencil/chrome/icons/SolveIcon.vue",
    animation: "drawIn",
    count: 1,
    reason:
      "state-gated icon draw-on; the dash end state is the icon's only inked pose",
  },
  {
    file: "src/pencil/chrome/icons/SolveIcon.vue",
    animation: "sparkleGrow",
    count: 1,
    reason: "state-gated icon pop; scoped to the solving class, never resident at idle",
  },
  {
    file: "src/pencil/chrome/icons/FillForcedIcon.vue",
    animation: "markDraw",
    count: 1,
    reason:
      "state-gated icon draw-on; the dash end state is the icon's only inked pose",
  },
  {
    file: "src/pencil/chrome/icons/DiceIcon.vue",
    animation: "diceRoll",
    count: 1,
    reason: "state-gated roll, class dropped on completion — never resident at idle",
  },
  {
    file: "src/pencil/chrome/icons/DiceIcon.vue",
    animation: "pipPop",
    count: 1,
    reason: "state-gated pip pop, scoped to the roll class — never resident at idle",
  },
];
