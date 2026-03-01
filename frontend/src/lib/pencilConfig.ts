/** Centralized pencil stroke, color palette, filter, and draw-in config */
import { reactive } from 'vue';

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
  subgridBoil: 0.8,  // subgrid lines
  cellBoil: 0.5,     // cell lines
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
  'grain-static': {
    id: 'grain-static',
    margin: 5,
    grain: { baseFrequency: 0.04, numOctaves: 3, scale: 3.5, seed: 2 },
  },
  'wobble-logo': {
    id: 'wobble-logo',
    margin: 10,
    wobble: { baseFrequency: 0.02, numOctaves: 2, scale: 0.1,
      offsets: [0.01, -0.02, 0.02, -0.01], animScale: 0.15, intervalMs: 180 },
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

export const DRAW_IN_PRESETS = {
  gridFrame:   { duration: 350, stagger: 30,  jitter: 20, baseDelay: 0,   timing: 'easeOutCubic' },
  gridSubgrid: { duration: 280, stagger: 25,  jitter: 25, baseDelay: 150, timing: 'easeOutCubic' },
  gridCell:    { duration: 200, stagger: 10,  jitter: 15, baseDelay: 300, timing: 'easeOutCubic' },
  glyph:       { duration: 350, stagger: 0,   jitter: 0,  baseDelay: 0,   timing: 'easeOutCubic' },
  solveCell:   { duration: 500, stagger: 120, jitter: 0,  baseDelay: 0,   timing: 'easeOutCubic' },
  logo:        { duration: 1800, stagger: 280, jitter: 0,  baseDelay: 0,   timing: 'easeOutCubic' },
} as const;
