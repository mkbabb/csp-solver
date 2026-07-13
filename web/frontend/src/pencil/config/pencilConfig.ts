/** Centralized pencil stroke, color palette, filter, and draw-in config */
import { reactive } from "vue";

// ── Stroke rendering ──────────────────────────────────────────────

export const PENCIL = {
  fruitOutline: { strokeWidth: 4, roughness: 1.0 },
  gridFrame: { strokeWidth: 6, roughness: 0.35 },
  gridSubgrid: { strokeWidth: 4, roughness: 0.5 },
  gridCell: { strokeWidth: 2.5, roughness: 0.3 },
  logoText: { strokeWidth: 5, roughness: 2.2 },
  vine: { strokeWidth: 8, roughness: 1.4 },
} as const;

// ── Yoshi's Story color palette ───────────────────────────────────

export const YOSHI_COLORS = {
  outlineBlack: "#1a1a1a",
  // T3-W9 (F7 §3.0): `stitch` is color-mix(in srgb, #1a1a1a 35%, #FF4D6D) baked to a
  // constant — SVG presentation attrs can't color-mix; `stem` is the vine green
  // (= vine.main below), the Heart Fruit's earned tell. CrayonHeart.vue imports these
  // instead of duplicating literals (the F7 hex-truthing).
  heart: {
    fill: "#FF4D6D",
    shadow: "#C9184A",
    highlight: "#fff",
    blush: "#FFB3C6",
    stitch: "#8f3a50",
    stem: "#16a34a",
  },
  apple: { fill: "#ef4444", shadow: "#b91c1c" },
  banana: { fill: "#fbbf24", shadow: "#d97706" },
  grapes: { fill: "#8b5cf6", shadow: "#6d28d9" },
  flower: { petals: "#ffffff", center: "#fb923c" },
  leaf: { fill: "#22c55e", vein: "#16a34a" },
  vine: { main: "#16a34a", secondary: "#22c55e" },
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
  /** Named cadence bands, in whole beats. */
  bands: {
    /** Grid/outline/divider path boil (BOIL_CONFIG.intervalMs quantizes here). */
    boil: 1,
    // sunRays (6 beats) RETIRED at the W13 c1 soul-gate close: the sun rest
    // stack is a whole-icon 4-pose stack on the beat — one noise field per
    // instant (the ray/disc sub-stack split held two fields at 3 of 4 beats
    // and failed the 0.983 line at every misaligned phase). Dead config dies.
  },
  /** House easing ledger — curves recorded as named decisions, one row per ruling. */
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
  // GRAIN ACCEPTANCE DISPOSITION (W9, Pass-3 #9 — the LEAD directs: EXTEND the envelope).
  // `grain-static` is the pencil's tooth: feTurbulence + feDisplacementMap chattering stroke
  // edges. On the board grid it wraps the boil-cycling `<g>` and re-rasterizes every 150 ms
  // tick for parameters that never change — the W8 hoist's target. Disposition:
  //   • The hoist PASSES the literal soul gate at the settled/2× DPR floor: SSIM 0.983–0.985
  //     (a thin but genuine pass; the 0.98 acceptance floor holds).
  //   • 6 of 36 matrix conditions fall below 0.98 — ALL of them DPR1 + live-animating mid-phase
  //     (never settled, never DPR≥2). The acceptance envelope is EXTENDED to cover DPR1/mid-phase
  //     with those numbers on the record here, rather than gate-blocking on transient frames.
  //   • The measured values are structural SSIM. Mean-channel deltas (0.12–1.06%) are a DIFFERENT
  //     metric and are NEVER to be reported as SSIM.
  //   • design-refinement §2.2's geometric bake (resample @8 units, ±1.25 amplitude, wavelength 25,
  //     seed 2, filter dropped) remains the BOOKED escape hatch for the failing corners if a future
  //     re-derivation (full 36-condition matrix, same-build noise-floor control) tightens the floor.
  //   • T3-W13 §1-P2 EXECUTES that bake for HandDrawnOutline: gridPaths.ts §Grain bake folds the
  //     grain into the pose geometry — params derived from these GrainConfigs (wavelength =
  //     1/baseFrequency, resample @ wavelength/3, peak amplitude scale/2, per-frame seeds) — and
  //     the outline drops `filter=` for frameCount static siblings + opacity swap (soul gate:
  //     SSIM 0.996/0.993 tab, 0.993 stroke band panel, @DPR2 settled). BoilDivider FAILED the
  //     gate (0.809 — 100% stroke; realizations can't correlate) and took the banked fallback:
  //     grain-hoist stack, filter kept, rasters once per pose. The grid hoist above is UNTOUCHED;
  //     grain-static's values stay byte-identical (the crit-forensics HOLD carried).
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
  "stroke-light": {
    id: "stroke-light",
    margin: 10,
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

// Only gridFrame/gridSubgrid/gridCell/glyph have consumers (usePathAnimation.ts:90-92,
// HandwrittenGlyph.vue:155-156). The former `solveCell` (500/120) and `logo` (1800/280)
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
// Every duration below rides the scheduler's `sequence` subscriber kind (or a setTimeout
// window, for the murmur) — never a per-cell keyframes.js RAFPlayback.
//
// Budget (worst case): beat-1 reveal window ≈1.2s → 150ms breath → beat-2 onset ≈1.35s;
// the diagonal front crosses in ≈0.5s (last onset ≈1.85s); each flourish is 2×600ms → the
// last cell crests ≈3.05s, inside the 3.2s cap.
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
  /** Gold-star garnish: draw-on duration and onset (~beat-2 crest, draws by ~3.0s). */
  starDrawInMs: 350,
  starCrestMs: 2650,
  /** Union foil-gleam tail: a single specular sweep over the garnish (OD-1 default: ships). */
  gleamMs: 400,
  /** The felt heart (T3-W9, F7 §3.2) — the Heart Fruit crests board bottom-right.
   *  Bounce onset = the star's crest (one shared moment), 550ms of reciprocal-axis
   *  squash on the HOST WRAPPER (never the filtered <g>), settling ≈3.2s — at the cap.
   *  The blink is post-crest ambient: one setTimeout, once, ~1.8s after settle. */
  heartCrestMs: 2650,
  heartBounceMs: 550,
  heartBlinkDelayMs: 1800,
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
