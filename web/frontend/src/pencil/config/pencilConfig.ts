/** Centralized pencil stroke, color palette, filter, and draw-in config */
import { reactive } from 'vue';

// ── MOTION language — cadence bands + house easings (design-refinement.md §1.1) ──
//
// The motion vocabulary is not free-form: every animated cadence in the skin belongs to one
// of four bands, and every easing curve to one of four house curves. This section is the
// LAW those live values are audited against — new motion picks a band + a house curve, and
// nothing lands off-model. Ranges are inclusive ms-per-tick (ambient) or total-duration
// (one-shots / sequences).
//
//   Band A — stop-motion ambient (125–170 ms/tick, 6–8 fps). Any always-on hand-drawn
//     jitter lives here: grid boil 150, divider boil 150, star/sun-sparkle boil 125,
//     celestial wobble 160, heart wobble 170, selection burst 120. Once the unified
//     scheduler owns the clock (it does — boilScheduler.ts), values QUANTIZE to the 25 ms
//     grid {125, 150, 175} so co-prime intervals stop producing near-coincident double-paints.
//   Band B — lazy ambient (550–800 ms/tick). Large or peripheral elements only, where 6–8 fps
//     would pull the eye: logo wobble 550, sun-ray boil/shape 800, sun breathe 6 s.
//   Band C — responsive one-shots (120–600 ms, user-triggered, finite): hover wiggle 600,
//     button anims 400–500, tooltip fade 150, cell reveal 300. Ghost focus rect stays instant.
//   Band D — choreographed sequences (150 ms–3.2 s composed timelines): grid draw-in ~800 ms,
//     erase ~150 ms + 4 ms·i, logo clip 1.2 s, theme page-turn 800 ms, celebration ≤3.2 s
//     (see CELEBRATION). Always finite, always emitting completion, always PRM-substitutable.
//
// DEAD BAND (intentional, 175–550 ms): nothing AMBIENT may tick here — a ~3 fps loop reads as
//   jank, not stop-motion. The boil/wobble family respects it; responsive one-shots (Band C)
//   are exempt (they are user-triggered and finite, not always-on).
//
// SMALL-AREA FILTER RULE: no `wobble-*` filter (feTurbulence + feDisplacementMap, re-rasterized
//   each tick) ever targets an element larger than the logo. Logo is the ceiling; sun/moon
//   toggle, heart, and icon-hover are all at or below it. The board-scale `grain-static` on the
//   grid is exempt from this rule and governed instead by the GRAIN hoist (see grain-static).
//
// EASING house style — four curves, each with a fixed role; no new bezier without a ledger
//   entry here. `easeOutCubic`/`easeInCubic` resolve through easings.ts (resolveEasing); the two
//   spring/pop curves are CSS bezier strings for stylesheet consumers.
export const MOTION = {
  bands: {
    A: { rangeMs: [125, 170], quantizeGridMs: [125, 150, 175], note: 'stop-motion ambient jitter' },
    B: { rangeMs: [550, 800], note: 'lazy ambient — large/peripheral only' },
    C: { rangeMs: [120, 600], note: 'responsive one-shots, user-triggered, finite' },
    D: { rangeMs: [150, 3200], note: 'choreographed sequences, finite + completion-emitting' },
  },
  /** Ambient ticks are forbidden in this inclusive range (Band C one-shots exempt). */
  deadBandMs: [175, 550],
  /** `wobble-*` displacement filters may not exceed this element in on-screen area. */
  smallAreaFilterCeiling: 'wobble-logo',
  /** The four sanctioned curves. `resolvesVia` names how a consumer references it. */
  easings: {
    /** Anything drawing ONTO the page: grid/glyph draw-in, focus-ring sketch. */
    drawOn: { name: 'easeOutCubic', resolvesVia: 'easings.ts', role: 'draw onto the page' },
    /** Anything LEAVING the page: erase. */
    erase: { name: 'easeInCubic', resolvesVia: 'easings.ts', role: 'leave the page' },
    /** POP arrivals: cell reveal. */
    pop: { name: 'back-out', css: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', role: 'pop arrival' },
    /** PHYSICAL flourishes: theme page-turn, dice tumble, sparkle grow. */
    spring: { name: 'spring-back', css: 'cubic-bezier(0.34, 1.56, 0.64, 1)', role: 'physical flourish' },
  },
} as const;

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
  outlineBlack: '#1a1a1a',
  heart: { fill: '#FF4D6D', shadow: '#C9184A', highlight: '#fff', blush: '#FFB3C6' },
  apple: { fill: '#ef4444', shadow: '#b91c1c' },
  banana: { fill: '#fbbf24', shadow: '#d97706' },
  grapes: { fill: '#8b5cf6', shadow: '#6d28d9' },
  flower: { petals: '#ffffff', center: '#fb923c' },
  leaf: { fill: '#22c55e', vein: '#16a34a' },
  vine: { main: '#16a34a', secondary: '#22c55e' },
  // Mascot palette — the 8 sun/moon hexes formerly welded into DarkModeToggle.vue's template
  // (design-refinement.md §3.3.4). Consolidated here as the single source; roles map 1:1 to
  // the toggle's fills/strokes. Prerequisite for the M4 `useCelestialSun()` lift into
  // pencil-boil — the mascot can't ship to the shared lib with its palette in one consumer's
  // template. NOTE: the DarkModeToggle template rewire to consume these is a component change,
  // owned by the celestial lane; this lane lands the config authority only.
  celestial: {
    sun: { body: '#E88845', outline: '#D16A32', core: '#F09855', rays: '#F0B030', sparkle: '#FDE68A' },
    moon: { body: '#FFF4AA', outline: '#E5C74D', star: '#FFFFFF' },
  },
} as const;

// ── SVG Filter presets ────────────────────────────────────────────

export interface GrainConfig {
  baseFrequency: number;
  numOctaves: number;
  scale: number;
  seed: number;
}

export interface WobbleConfig {
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

export interface MultiPassConfig {
  passes: { seed: number; scale: number }[];
  baseFrequency: number;
  numOctaves: number;
  blendMode: 'multiply' | 'screen';
}

export interface TextureConfig {
  baseFrequency: number;
  numOctaves: number;
  blendMode: string;
}

export interface FilterPreset {
  id: string;
  margin: number;
  grain?: GrainConfig;
  wobble?: WobbleConfig;
  multiPass?: MultiPassConfig;
  texture?: TextureConfig;
}

// ── Path-based boil config ───────────────────────────────────────

export interface BoilConfig {
  frameCount: number;
  intervalMs: number;
  frameBoil: number;
  subgridBoil: number;
  cellBoil: number;
}

const DEFAULT_BOIL_CONFIG: BoilConfig = {
  frameCount: 4,
  intervalMs: 150,   // ~6.7fps — "shooting on fours"
  frameBoil: 1.2,    // frame lines perturbation (viewBox units)
  subgridBoil: 0.6,  // subgrid lines
  cellBoil: 0.3,     // cell lines — subtle so glyphs feel stable
};

/** Reactive boil config — mutations here update the grid boil live */
export const BOIL_CONFIG: BoilConfig = reactive({ ...DEFAULT_BOIL_CONFIG });

export function resetBoilConfig() {
  Object.assign(BOIL_CONFIG, { ...DEFAULT_BOIL_CONFIG });
}

export { DEFAULT_BOIL_CONFIG };

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
  'grain-static': {
    id: 'grain-static',
    margin: 5,
    grain: { baseFrequency: 0.04, numOctaves: 3, scale: 2.5, seed: 2 },
  },
  'wobble-logo': {
    id: 'wobble-logo',
    margin: 10,
    wobble: { baseFrequency: 0.02, numOctaves: 2, scale: 3,
      offsets: [0.01, -0.02, 0.02, -0.01], animScale: 0.1, intervalMs: 550 },
  },
  'wobble-celestial': {
    id: 'wobble-celestial',
    margin: 10,
    wobble: { baseFrequency: 0.02, numOctaves: 2, scale: 5,
      offsets: [-0.01, 0.02, -0.02, 0.01], animScale: 0.15, intervalMs: 160 },
  },
  'wobble-heart': {
    id: 'wobble-heart',
    margin: 10,
    wobble: { baseFrequency: 0.02, numOctaves: 2, scale: 5,
      offsets: [0.01, -0.02, 0.02, -0.01], animScale: 0.2, intervalMs: 170 },
  },
  'stroke-light': {
    id: 'stroke-light',
    margin: 10,
    multiPass: { baseFrequency: 0.04, numOctaves: 4, blendMode: 'multiply', passes: [{ seed: 1, scale: 4.5 }, { seed: 7, scale: 5.0 }, { seed: 13, scale: 4.0 }] },
  },
  'stroke-dark': {
    id: 'stroke-dark',
    margin: 10,
    multiPass: { baseFrequency: 0.04, numOctaves: 4, blendMode: 'screen', passes: [{ seed: 1, scale: 4.5 }, { seed: 7, scale: 5.0 }, { seed: 13, scale: 4.0 }] },
  },
} as const;

/** Reactive copy for live tuning — mutations here update the live SVG filters */
export const FILTER_PRESETS: Record<string, FilterPreset> = reactive(
  structuredClone(DEFAULT_PRESETS) as Record<string, FilterPreset>
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

// ── Draw-in timing presets ────────────────────────────────────────

export interface DrawInPreset {
  duration: number;
  stagger: number;
  jitter: number;
  baseDelay: number;
  timing: string;
}

// Only gridFrame/gridSubgrid/gridCell/glyph have consumers (usePathAnimation.ts:90-92,
// HandwrittenGlyph.vue:155-156). The former `solveCell` (500/120) and `logo` (1800/280)
// presets were dead config — zero consumers, deleted per design-refinement.md §1.2 / §7.1.
// The logo actually reveals via a 1.2 s clip-path wipe (HandwrittenLogo.vue), not a stroke
// draw-in; the celebration defines its own timing (see CELEBRATION), not a resurrected preset.
export const DRAW_IN_PRESETS = {
  gridFrame:   { duration: 350, stagger: 30,  jitter: 20, baseDelay: 0,   timing: 'easeOutCubic' },
  gridSubgrid: { duration: 280, stagger: 25,  jitter: 25, baseDelay: 150, timing: 'easeOutCubic' },
  gridCell:    { duration: 200, stagger: 10,  jitter: 15, baseDelay: 300, timing: 'easeOutCubic' },
  glyph:       { duration: 350, stagger: 0,   jitter: 0,  baseDelay: 0,   timing: 'easeOutCubic' },
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
} as const;

/** Beat-1 stagger, board-normalized so the reveal window is ~constant across sizes. */
export function revealStaggerMs(blankCount: number): number {
  if (blankCount <= 1) return CELEBRATION.revealStaggerMin;
  return Math.min(
    CELEBRATION.revealStaggerMax,
    Math.max(CELEBRATION.revealStaggerMin, Math.round(CELEBRATION.revealWindowMs / blankCount)),
  );
}

/** Beat-2 wavefront step per (row+col) diagonal, so the front crosses in ~wavefrontCrossMs. */
export function wavefrontStepMs(boardSize: number): number {
  const diag = Math.max(1, 2 * boardSize - 2);
  return Math.round(CELEBRATION.wavefrontCrossMs / diag);
}
