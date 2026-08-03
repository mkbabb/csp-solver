/** Centralized pencil stroke, color palette, filter, and draw-in config */
import { reactive } from "vue";

// ── Stroke rendering ──────────────────────────────────────────────

/**
 * Stroke presets. ONE key, because one surface reads one: `CrayonHeart` takes
 * `fruitOutline.strokeWidth`. The five others — `gridFrame`, `gridSubgrid`, `gridCell`,
 * `logoText`, `vine` — were a config table for surfaces that compute their own stroke widths
 * from live geometry and always did; T5-W2 2.3 cut them. A preset nobody reads is a lie about
 * where a number comes from.
 */
export const PENCIL = {
  fruitOutline: { strokeWidth: 4, roughness: 1.0 },
} as const;

// ── Felt-craft mascot color palette ───────────────────────────────
//
// CH-31, landed whole (T5-W2 2.3): the const carried a borrowed mascot's brand name for a
// palette that draws a heart fruit, its leaf, and the sun/moon faces. Renamed with its four
// imports and its comments in ONE act, which is the only way a source-symbol rename lands —
// and the reason the row sat chronic for four tranches. The dead entries went in the same act:
// `apple`/`banana`/`grapes`/`flower`/`vine` were a fruit bowl nothing drew, and `leaf.vein` a
// stroke nothing stroked.

export const MASCOT_COLORS = {
  outlineBlack: "#1a1a1a",
  // T3-W9 (F7 §3.0): `stitch` is color-mix(in srgb, #1a1a1a 35%, #FF4D6D) baked to a
  // constant — SVG presentation attrs can't color-mix; `stem` is the vine green, the Heart
  // Fruit's earned tell. CrayonHeart.vue imports these instead of duplicating literals
  // (the F7 hex-truthing).
  heart: {
    fill: "#FF4D6D",
    shadow: "#C9184A",
    highlight: "#fff",
    blush: "#FFB3C6",
    stitch: "#8f3a50",
    stem: "#16a34a",
  },
  leaf: { fill: "#22c55e" },
  // Mascot palette — the sun/moon hexes formerly welded into DarkModeToggle.vue's template
  // (design-refinement.md §3.3.4). Single source; roles map 1:1 to the toggle's
  // fills/strokes, now actually consumed there (T3-W10 rewire). CelebrationStar's gold
  // (sparkle fill + rays stroke) draws from the same family. T3-W10 F4 slight pass:
  // `spiral` stays the rays gold (S2's deepening REVERTED per the 2026-07-11 owner
  // audit — measured, it lowered contrast vs the disc, 1.175→1.063; the yellow-on-
  // orange hue pop is the carrier); `sparkleStroke` deepens off the same gold (S3 —
  // sub-pixel at 5rem before); `moon.star` retempers white → butter (M3 — the star
  // field is one temperature).
  celestial: {
    sun: {
      body: "#E88845",
      outline: "#D16A32",
      core: "#F09855",
      rays: "#F0B030",
      spiral: "#F0B030",
      sparkle: "#FDE68A",
      sparkleStroke: "#D99A10",
    },
    moon: { body: "#FFF4AA", outline: "#E5C74D", star: "#FFF4AA" },
  },
} as const;

// ── SVG Filter presets ────────────────────────────────────────────

export interface GrainConfig {
  baseFrequency: number;
  numOctaves: number;
  scale: number;
  seed: number;
}

interface WobbleConfig {
  /** Center baseFrequency for the turbulence (e.g. 0.02) */
  baseFrequency: number;
  numOctaves: number;
  /** feDisplacementMap scale — how far pixels are pushed */
  scale: number;
  /** Offset sequence cycled each tick — baseFreq += offset * animScale */
  offsets: number[];
  /** Multiplier on offsets (amplitude control) */
  animScale: number;
  /** Milliseconds between frames (100 = 10fps) */
  intervalMs: number;
}

interface MultiPassConfig {
  passes: { seed: number; scale: number }[];
  baseFrequency: number;
  numOctaves: number;
  blendMode: "multiply" | "screen";
}

export interface FilterPreset {
  id: string;
  margin: number;
  grain?: GrainConfig;
  wobble?: WobbleConfig;
  multiPass?: MultiPassConfig;
  /**
   * Whether SvgFilters emits a live base `<filter id={id}>` def for this preset.
   * Absent/`true` = emit. `false` marks a preset whose base def would be an ORPHAN
   * (P4 rule): `grain-outline` is baked into the pose geometry (gridPaths §Grain bake)
   * and `wobble-logo` is consumed only as a `${id}-p{i}` pose stack — neither has a
   * `url(#id)` consumer, so the base def would render nothing. Pose defs still emit.
   */
  baseDef?: boolean;
}

// ── MOTION — the shared boil beat + cadence bands (T3-W12 §2 P1) ──
//
// The settled page never idled: ~9 perpetual `frame` subscribers, each anchored to its
// own first-tick wall clock (pencil-boil vue.ts `lastTick`), sprayed an invalidation
// into nearly every 8ms frame — 45 sparse writers ≈ one continuous one (a1's
// elimination ladder, evidence/addendum/a1-completion-perf.md §c). The fix is
// scheduler-level alignment, never a retune: every perpetual boil derives its frame
// index from ONE shared beat counter (composables/boilBeat.ts), so all swaps land in
// the same rAF tick and the pipeline gets idle frames between beats. Cadences quantize
// to whole beats (`beatsFor`); amplitudes, seeds, and the boil character are untouched.

export const MOTION = {
  /** The one beat window every perpetual boil swap lands on (~8Hz). */
  beatMs: 125,
  /** Named cadence bands — the beat divisor a pose stack steps on, so a slower
   *  sky still lands its swaps in the shared dirty frame. 1.5 is rational on the
   *  beat grid (2 flips per 3 beats, an alternating 250/125ms dwell): no band
   *  ever needs a second clock. `boil: 1` retired here with its last consumer. */
  bands: {
    /** The sun's whole-icon pose stack: every 2nd beat, 8Hz → 4Hz (T6 mark 11 —
     *  the owner read the shipped 8Hz as twice too fast). The W13 c1 soul gate
     *  had already retired the 6-beat `sunRays` sub-stack; what this halves is
     *  the whole-icon stack that replaced it, one noise field per instant. */
    sun: 2,
    /** The moon's, 8Hz → 5.33Hz — the mark's 1.5× on the same stack. */
    moon: 1.5,
  },
  /** Carousel card-step glide (T4-W12) — a keyboard/button step of the gallery
   *  track rides the ONE glass curve (`curves.drawerGlide`) as a WAAPI FLIP transform
   *  at this duration, one clock, monotone, zero overshoot. A shorter throw than the
   *  drawer's 520ms ceiling (a card step travels one slot, not a full sheet): 440ms,
   *  auditioned by eye at the local preview, inside the glass band. Lands HERE, not as
   *  a mover-local literal, per the wave covenant (no new timing constants outside
   *  pencilConfig). PRM collapses the glide to an instant snap (no tween).
   *
   *  RATIFY-ME (T4-W12 ballot row 4): the card-step glide duration. 440ms auditioned at
   *  the Wave-D preview (:4788) against 380/440/520 — 380 read clipped for a one-slot
   *  throw, 520 (the drawer's full-sheet ceiling) dragged for the shorter travel; 440
   *  is the settled read, monotone on the glass curve with zero overshoot (`snap-glide-
   *  trace.json`). Inside the glass band, no new named curve. */
  cardStepMs: 440,
  /** Board⇄card FOLD (T4-W12 Wave C) — the gallery entry folds the live board INTO the
   *  center card (and the exit unfolds it back) as a classic FLIP on the ONE glass curve
   *  (`curves.drawerGlide`) via the extracted `useFlipGlide` engine. A FULL-sheet throw
   *  (board → card-face, not one card slot), so it takes the drawer's glass ceiling 520ms
   *  — longer than the 440ms card-step. Lands HERE, not as an App-local literal, per the
   *  covenant (no timing constants outside pencilConfig). PRM cuts it (same-frame swap). */
  boardFoldMs: 520,
  /** BEAT 0 — chrome leaves (T4-W12 Wave C2 §ENTRY). The gallery entry opens by fading the
   *  scene's controls/drawer out on the EXISTING scene-leaving beat (scene.css, 200ms) — the
   *  board itself never erases (we fold it, not discard it). This is that band, so the fold
   *  begins as the chrome clears. Matches scene.css's `.scene-leaving` fade; lands HERE per
   *  the covenant. PRM skips it (same-frame cut, no fade, no delay). */
  chromeLeaveMs: 200,
  /** House easing ledger — curves recorded as named decisions, one row per ruling.
   *
   *  THE TWO-LAYER EASING RULE (T4-W10). The house easing family lives in a
   *  coherent two-layer partition, split by consumer, not by curve:
   *    • TS `MOTION.curves` (HERE) — for JS / `v-bind` consumers. The drawer's
   *      `drawerGlide` is the ONE genuinely `v-bind`-consumed curve (the
   *      useControlsDrawer mover engine reads `MOTION.curves.drawerGlide`), so it
   *      stays a TS string; v-binding it is load-bearing, not decoration.
   *    • CSS `--ease-*` custom properties (assets/index.css `@theme` §EASING) —
   *      for `<style>`-layer consumers. Every component `transition:`/`animation:`
   *      easing reads a `var(--ease-*)`; a `<style>` block cannot import this TS
   *      object, and v-binding 40+ static curves would add reactive plumbing for
   *      values that never change (r2-T5's decisive point).
   *  The glass curve appears in BOTH layers: `drawerGlide` here (canonical TS
   *  home) and `--ease-glassGlide` in @theme (byte-identical control points),
   *  minted so the answer-key laminate's lay-down joins the one glass curve
   *  without becoming a reactive value. Retune a curve → edit ONE side per its
   *  layer; the two never diverge because each owns a disjoint consumer set. */
  curves: {
    /** The drawer system's ONE curve — all four movers (sheet, case, masthead,
     *  tab counter-scale), one clock, zero stagger. T3-W13 §3-S3′, the mid-wave
     *  owner ruling (audit 4, 2026-07-11): the spring (0.34, 1.56, 0.64, 1) dies
     *  for the drawer — replaced by the glass family (swift attack, long fluid
     *  settle, ZERO overshoot; the iOS-sheet class). Auditioned by eye at :3001
     *  against the shipped spring and two glass variants (swifter 0.26/0.75/
     *  0.04/1, softer 0.4/0.72/0.12/1 — the soft attack left the case readable
     *  in open air mid-glide); the reference class won verbatim, at 520ms
     *  (Band D). Scope fence: this ruling is the drawer's — no other surface
     *  re-eases under it. */
    drawerGlide: "cubic-bezier(0.32, 0.72, 0, 1)",
  },
} as const;

/** Quantize an interval to whole beats (≥1). Wobble/boil configs keep their
 *  `intervalMs` vocabulary (FilterTuner mutates them live); the beat grid is
 *  applied at the consumer. */
export function beatsFor(intervalMs: number): number {
  if (!Number.isFinite(intervalMs)) return 1;
  return Math.max(1, Math.round(intervalMs / MOTION.beatMs));
}

// ── THE HOVER GRAMMAR — what boils under a pointer, and what never does ──────────
//
// THE RULE, in two clauses, DERIVED from the estate's dominant pattern (T8-W2 M5, censused
// row by row across every text surface the chrome paints — masthead, drawer, picker, gallery,
// ribbon, cards, notes; the table is the wave report's):
//
//   R1  NO TEXT BOILS. Ever — not at rest, not on hover. Boil is for DRAWN GEOMETRY (the grid,
//       the outlines, the wordmark's pose stack, the celestial pair, the divider) and for the
//       DRAWN MARKS text wears (the option chips' scribble/ghost underlines, which are seeded
//       data-URI backgrounds, not filters). A text RUN never carries `filter: url(#…)` and a
//       hover never mints one. This clause is not new and it is not advice: P1-W3 deleted the
//       estate's three hover wobbles at source (`.ctrl-btn:hover`, `.section-heading:hover`,
//       `.icon-btn:hover`) and `e2e/filter-census.spec.ts` G3.5 walks the pointer over every
//       candidate surface in BOTH regimes and reds if one comes back. Census 9, unmoved by
//       anything on this page — a hover cure that needs a filter is the wrong cure.
//
//   R2  EVERY INTERACTIVE TEXT SURFACE TAKES EXACTLY ONE HOVER AFFORDANCE; INERT TEXT TAKES
//       NONE. The affordance is the CONTROL's, not each text run's — a sublabel that stays
//       muted inside a button whose ground lights conforms, because the rank it carries is
//       the point. Three forms, and there is no fourth:
//         · INK LIFT — muted → `--color-foreground`, tweened 150–250ms. The default for a
//           bare word (chips, `leave`, `@mbabb`, the debug toggle).
//         · A DRAWN MARK — the chips' ghost scribble appears (unselected) or redraws one boil
//           step (selected, T8-W2). The pencil answer, for words that already sit at
//           foreground and have no lift left.
//         · A GROUND — `--color-accent` behind a BOXED control (`.icon-btn`, `.staging-btn`,
//           `.error-note-retry`). Boxes only; a ground under a bare word is a fourth form.
//       Fence every hover rule in `@media (hover: hover)` so nothing sticks after a tap.
//
// THE COUNTS, and only the ones that can be re-derived on demand. R1 is gated and its number
// is 9 — `FILTER_BUDGET_TOTAL`, exact-match in both directions, both engines, both regimes,
// hovered and at rest. R2 is not gated yet; what the census found is SIX violations against
// it, every one an interactive surface answering nothing, and inert text conforming with no
// exceptions at all. Two are cured in this wave (`OptionSelector`'s selected chip — the only
// inert word in an otherwise live row, the mark's own shot; `AttributionCard`'s debug toggle,
// an ink lift that snapped where every sibling tweens). Four sit behind other agents' fences
// and ride wiring requests: the guard ribbon's two buttons, the gallery card's title and
// subline, the drawer's `i` glyph, and its mobile heading tab.
//
// PROMOTE R2 TO A GATE ON ITS NEXT BITE. This is the family's second appearance (P1-W3 cut
// three hover wobbles; T8-W2 counts six silent controls), and a rule stated only in a comment
// is exactly what lessons §3 warns about. The cheap instrument already exists in shape:
// `filter-census.spec.ts` G3.5 already walks the pointer over every candidate surface in both
// regimes — a second assertion in that walk ("every interactive text surface's computed style
// DIFFERS hovered vs at rest") turns this paragraph into a count.
//
// The wordmark is the instructive conforming case: the WORD never changes, and the control
// still answers — its caret glyph wiggles (`HandwrittenGlyph`'s `isHovered`, the one hover
// wiggle that reaches chrome at all). In the gallery the heading renders as a `<span>` and
// the caret is not mounted, so the inert form correctly answers nothing. Same component,
// both clauses, no exception.

// ── Path-based boil config ───────────────────────────────────────

export interface BoilConfig {
  frameCount: number;
  intervalMs: number;
  frameBoil: number;
  subgridBoil: number;
  cellBoil: number;
  outlineBoilPx: number;
}

const DEFAULT_BOIL_CONFIG: BoilConfig = {
  frameCount: 4,
  intervalMs: 150, // ~6.7fps — "shooting on fours"
  frameBoil: 1.2, // frame lines perturbation (viewBox units)
  subgridBoil: 0.6, // subgrid lines
  cellBoil: 0.3, // cell lines — subtle so glyphs feel stable
  // HandDrawnOutline perturbation, in CSS PX (the outline is px-native, T3-W10 F1).
  // Its own constant because frameBoil is 1000-unit viewBox units — passing it verbatim
  // was a unit bug once the outline went px-native (1.2px flat ≈ 4× the BEFORE screen
  // energy of 0.31–0.44px across hosts; T3-W12 §3, a2-boil-outline.md).
  outlineBoilPx: 0.45,
};

/** Reactive boil config — mutations here update the grid boil live */
export const BOIL_CONFIG: BoilConfig = reactive({ ...DEFAULT_BOIL_CONFIG });

export function resetBoilConfig() {
  Object.assign(BOIL_CONFIG, { ...DEFAULT_BOIL_CONFIG });
}

/** Frozen defaults for reset.
 *  Wobble filters use single-layer feTurbulence+feDisplacementMap (small elements only).
 *  Grid boil is path-based (see BOIL_CONFIG). */
const DEFAULT_PRESETS: Record<string, FilterPreset> = {
  // GRAIN-STATIC DISPOSITION — rewritten to the SHIPPED TRUTH at P1-W3.
  //
  // `grain-static` is the pencil's tooth: feTurbulence + feDisplacementMap chattering stroke
  // edges. Its VALUES are byte-untouched and have been since W9 (the crit-forensics HOLD): the
  // grid's 1000-unit space depends on them. What has changed, repeatedly, is WHO IS ALLOWED TO
  // BE A LIVE CLIENT — and the answer is now counted, in one file:
  // **`pencil/config/filterBudget.ts`**, enforced against the built dist by
  // `e2e/filter-census.spec.ts` as an exact-match allowlist. Read that budget, not this comment,
  // for the population. As of P1-W3 the whole estate's live-filter total is 14, against 96–118
  // measured on the base build.
  //
  // How each surface got there, shortest form:
  //   • grid — BAKED (T4-W1). `<image>` pose stack; the live `<g filter>` fallback goes
  //     `display: none` once the bitmaps land. Soul gate: SSIM 0.983–0.985 at settled/DPR2 (a
  //     thin but genuine pass at the 0.98 floor). 6 of 36 matrix conditions fell below 0.98, ALL
  //     of them DPR1 + live-animating mid-phase — the envelope was EXTENDED to cover them with
  //     the numbers on the record rather than gate-blocking on transient frames. The measured
  //     values are structural SSIM; mean-channel deltas (0.12–1.06%) are a different metric and
  //     are never to be reported as SSIM.
  //   • outline, tally — GRAIN IN GEOMETRY (T3-W13 §1-P2). `gridPaths.ts §Grain bake` folds the
  //     grain into the pose geometry, params derived from these GrainConfigs (wavelength =
  //     1/baseFrequency, resample @ wavelength/3, peak amplitude scale/2, per-frame seeds); the
  //     surface drops `filter=` for frameCount static siblings + an opacity swap. Soul gate:
  //     SSIM 0.996/0.993 tab, 0.993 stroke band panel, @DPR2 settled.
  //   • divider — FROZEN, filter kept (`fb15253d`). The bake FAILED its gate at 0.809: it is
  //     100% stroke, and two noise realizations of a thin line cannot correlate window-wise. It
  //     takes the banked fallback — pose 0 pinned on Apple engines, one raster per pose — and it
  //     is the budget's SOLE beat-driven exception, with its retirement trigger written there.
  //   • glyph, icon, control panel, loader — DELETED (P1-W3, G2.4 ruled **C / C / C** on the
  //     owner's word). Not relocated, not baked: the bake could not reproduce the filter's
  //     per-pixel tooth at glyph scale, and SSIM ranked unfiltered CLOSER to the incumbent than
  //     baked in all four engine×theme cells (webkit board 0.978/0.980). Icons were a uniform
  //     ±1.25-unit nudge at viewBox 24 against this preset's 25-unit wavelength — never a tooth.
  //   • `stroke-light` / `stroke-dark` — ORPHANED with the control panel; `baseDef: false` below.
  //
  // The booked escape hatch is spent: design-refinement §2.2's geometric bake IS the outline
  // path above, and the glyph's version was auditioned at G2.4 and declined by ruling.
  "grain-static": {
    id: "grain-static",
    margin: 5,
    grain: { baseFrequency: 0.04, numOctaves: 3, scale: 2.5, seed: 2 },
  },
  // `grain-outline` (T3-W12 §3): HandDrawnOutline's own tooth. The outline is px-native
  // (T3-W10 F1), so grain-static's userSpaceOnUse units render LITERAL there — 2.5px
  // displacement at 25px wavelength, 3.8× the BEFORE screen energy; the stroke body
  // wavers and its core erodes to the hairline in the 2026-07-11 owner audit
  // (boil-hairline.png). Derivation (a2-boil-outline.md): old screen displacement was
  // 2.5·k at k* ≈ 0.3 for the outlined-host band → scale 0.75; baseFrequency 0.04/0.3 →
  // 0.13. grain-static stays byte-untouched — the grid's 1000-unit space, glyphs, and
  // 20–32px icons depend on its values (crit-forensics HOLD).
  "grain-outline": {
    id: "grain-outline",
    margin: 5,
    // Baked into the outline pose geometry (gridPaths §Grain bake) — no live base def.
    baseDef: false,
    grain: { baseFrequency: 0.13, numOctaves: 3, scale: 0.75, seed: 2 },
  },
  "wobble-logo": {
    id: "wobble-logo",
    margin: 10,
    // Consumed only as the #wobble-logo-p{i} pose stack (HandwrittenLogo) — no base def.
    baseDef: false,
    wobble: {
      baseFrequency: 0.02,
      numOctaves: 2,
      scale: 3,
      offsets: [0.01, -0.02, 0.02, -0.01],
      animScale: 0.1,
      intervalMs: 550,
    },
  },
  "wobble-celestial": {
    id: "wobble-celestial",
    margin: 10,
    wobble: {
      baseFrequency: 0.02,
      numOctaves: 2,
      scale: 5,
      offsets: [-0.01, 0.02, -0.02, 0.01],
      animScale: 0.15,
      intervalMs: 160,
    },
  },
  "wobble-heart": {
    id: "wobble-heart",
    margin: 10,
    wobble: {
      baseFrequency: 0.02,
      numOctaves: 2,
      scale: 5,
      offsets: [0.01, -0.02, 0.02, -0.01],
      animScale: 0.2,
      intervalMs: 170,
    },
  },
  // `stroke-light` / `stroke-dark` (P1-W3): ORPHANED. Their sole consumer was
  // `.control-panel-filtered`, retired on the G2.4 ballot's **C** ruling — a 3-pass 4-octave
  // turbulence chain with three displacement maps and two blends, over a ~320×700 CSS panel,
  // on an HTML box (WebKit's software filter path). No `url(#id)` consumer remains, so the P4
  // rule suppresses both base defs; the params stay here, unaltered, because reversal is meant
  // to be one CSS block plus a flag — not a re-derivation.
  "stroke-light": {
    id: "stroke-light",
    margin: 10,
    baseDef: false,
    multiPass: {
      baseFrequency: 0.04,
      numOctaves: 4,
      blendMode: "multiply",
      passes: [
        { seed: 1, scale: 4.5 },
        { seed: 7, scale: 5.0 },
        { seed: 13, scale: 4.0 },
      ],
    },
  },
  "stroke-dark": {
    id: "stroke-dark",
    margin: 10,
    baseDef: false,
    multiPass: {
      baseFrequency: 0.04,
      numOctaves: 4,
      blendMode: "screen",
      passes: [
        { seed: 1, scale: 4.5 },
        { seed: 7, scale: 5.0 },
        { seed: 13, scale: 4.0 },
      ],
    },
  },
} as const;

/** Reactive copy for live tuning — mutations here update the live SVG filters */
export const FILTER_PRESETS: Record<string, FilterPreset> = reactive(
  structuredClone(DEFAULT_PRESETS) as Record<string, FilterPreset>,
);

export function resetPreset(id: string) {
  const defaults = DEFAULT_PRESETS[id];
  if (defaults) Object.assign(FILTER_PRESETS[id], structuredClone(defaults));
}

export function resetAllPresets() {
  for (const id of Object.keys(DEFAULT_PRESETS)) {
    resetPreset(id);
  }
}

export { DEFAULT_PRESETS };

// ── Frozen wobble pose variants (T3-W13 §1-P3) ───────────────────
//
// The per-beat feTurbulence write is retired: a wobble boil is N poses, and pose
// i's params are exactly what the retired SvgFilters watcher wrote on its beat —
// baseFrequency + offsets[i]·animScale, same seed. SvgFilters renders one STATIC
// filter per pose (id `${presetId}-p${i}`); consumers stack N filtered siblings
// (`will-change: opacity`) and flip visibility on the shared beat, so each pose
// rasters ONCE and the steady state re-rasters nothing (the grain-hoist mechanics,
// generalized). Derived reactively from FILTER_PRESETS — FilterTuner stays live.

/** The frozen pose frequencies of a wobble preset (rounding matches the retired
 *  watcher's write, so each pose renders byte-identically to its live-beat frame). */
export function wobblePoseFrequencies(preset: FilterPreset): number[] {
  const w = preset.wobble;
  if (!w) return [];
  return w.offsets.map(
    (o) => Math.round((w.baseFrequency + o * w.animScale) * 10000) / 10000,
  );
}

/** Filter id of pose `i` of a wobble preset — the shared def shape every pose
 *  stack consumes (HandwrittenLogo, DarkModeToggle). */
export function wobblePoseId(presetId: string, pose: number): string {
  return `${presetId}-p${pose}`;
}

// ── Draw-in timing presets ────────────────────────────────────────

// Only gridFrame/gridSubgrid/gridCell/glyph have consumers, four files' worth:
// `usePathAnimation`'s `animateDrawIn` (the three grid tiers), `HandwrittenGlyph`'s reveal
// draw-in and `DifficultyTally`'s tally stagger (glyph), `GameGallery`'s deal reveal
// (gridFrame's duration). The former `solveCell` (500/120) and `logo` (1800/280)
// presets were dead config — zero consumers, deleted per design-refinement.md §1.2 / §7.1.
// The logo actually reveals via a 1.2 s clip-path wipe (HandwrittenLogo.vue), not a stroke
// draw-in; the celebration defines its own timing (see CELEBRATION), not a resurrected preset.
export const DRAW_IN_PRESETS = {
  gridFrame: {
    duration: 350,
    stagger: 30,
    jitter: 20,
    baseDelay: 0,
    timing: "easeOutCubic",
  },
  gridSubgrid: {
    duration: 280,
    stagger: 25,
    jitter: 25,
    baseDelay: 150,
    timing: "easeOutCubic",
  },
  gridCell: {
    duration: 200,
    stagger: 10,
    jitter: 15,
    baseDelay: 300,
    timing: "easeOutCubic",
  },
  glyph: {
    duration: 350,
    stagger: 0,
    jitter: 0,
    baseDelay: 0,
    timing: "easeOutCubic",
  },
} as const;

// ── Glyph animation timing ───────────────────────────────────────

export const GLYPH_ANIM = {
  autoWiggleDuration: 2500,
  hoverWiggleDuration: 600,
} as const;

// ── Solve celebration — "the gold-star moment" (design-refinement.md §1.3) ──
//
// A celebration is a moment, not a state: three beats, one timeline, finite, ≤3.2s crest.
// The board's own beats ride the scheduler's `sequence` subscriber kind; the star and the
// heart (T6 marks 14/15) ride the CSS animation vocabulary instead (assets/index.css §THE
// MOTION VOCABULARY), binding these numbers as `--*-dur`/`--*-delay` — zero subscribers,
// zero timers. Never a per-cell keyframes.js RAFPlayback either way.
//
// Budget (worst case): beat-1 reveal window ≈1.2s → 150ms breath → beat-2 onset ≈1.35s;
// the diagonal front crosses in ≈0.5s (last onset ≈1.85s); each flourish is 2×600ms → the
// last cell crests ≈3.05s. The star's own tail is the longest limb: crest 2650 + fade 540
// = 3.19s. Both inside the 3.2s cap.
export const CELEBRATION = {
  /** Beat 1: total board-normalized reveal window; per-cell stagger = window / blankCount. */
  revealWindowMs: 1200,
  revealStaggerMin: 4,
  revealStaggerMax: 24,
  /** Beat 2: onset after beat 1 + the 150ms breath. */
  beat2StartMs: 1350,
  /** Beat 2: diagonal wavefront crosses any board in ~this long; per-cell onset += (row+col)·(cross/(2N−2)). */
  wavefrontCrossMs: 500,
  /** Beat 2: each solved cell plays exactly this many wiggle cycles as it passes. */
  flourishCycles: 2,
  /** Wiggle cycle length (= hoverWiggleDuration) — the variant-swap cadence. */
  wiggleCycleMs: 600,
  /** Beat 3: classroom murmur — one solved cell wakes for a single wiggle per this window. */
  murmurWindowMs: 2500,
  /** The gold star, T6 mark 14 — it BLOOMS over the whole board and hands the
   *  moment to the corners. Onset 2050ms, 600ms of storybook growth (one 1.06
   *  overshoot) landing exactly on the crest; at the crest the star's OUTLINE
   *  alone flashes (320ms) while the body plateaus and dissolves (540ms, quiet
   *  by 3.19s — the ≤3.2s cap held), and the corner sticker presses on (260ms).
   *  `starCrestMs` keeps its meaning: the crest is one instant, shared. */
  starBloomStartMs: 2050,
  starBloomMs: 600,
  starCrestMs: 2650,
  starFlashMs: 320,
  starFadeMs: 540,
  starLandMs: 260,
  /** The felt heart (T3-W9, F7 §3.2) — the Heart Fruit crests board bottom-right.
   *  Bounce onset = the star's crest (one shared moment), 550ms of reciprocal-axis
   *  squash on the HOST WRAPPER (never the filtered <g>), settling ≈3.2s — at the cap.
   *  The blink is post-crest ambient: one shut-and-open on the eyes group, once,
   *  1.8s after settle (T6 mark 15 — a bound delay on `plush-blink`, no timer). */
  heartCrestMs: 2650,
  heartBounceMs: 550,
  heartBlinkDelayMs: 1800,
  heartBlinkMs: 240,
} as const;

/** Beat-1 stagger, board-normalized so the reveal window is ~constant across sizes. */
export function revealStaggerMs(blankCount: number): number {
  if (blankCount <= 1) return CELEBRATION.revealStaggerMin;
  return Math.min(
    CELEBRATION.revealStaggerMax,
    Math.max(
      CELEBRATION.revealStaggerMin,
      Math.round(CELEBRATION.revealWindowMs / blankCount),
    ),
  );
}

/** Beat-2 wavefront step per (row+col) diagonal, so the front crosses in ~wavefrontCrossMs. */
export function wavefrontStepMs(boardSize: number): number {
  const diag = Math.max(1, 2 * boardSize - 2);
  return Math.round(CELEBRATION.wavefrontCrossMs / diag);
}
