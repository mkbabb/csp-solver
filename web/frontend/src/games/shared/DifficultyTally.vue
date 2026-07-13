<script setup lang="ts">
/**
 * The displayed-quality tally (T4-W9-B1) — the DIFFICULTY signal, drawn.
 *
 * A gate-five tally (four uprights + a binding slash) whose INKED strokes count the tier the
 * board's hardest human step reached — W7's five ascending tiers: singles · pairs/pointing ·
 * X-wing · swordfish/XY-wing · beyond. Not stars, not a percentage: the tiers ARE discrete,
 * so the glyph is discrete. The count is magnitude; the exact hardest technique is named on
 * hover/focus (and always in the a11y label). One game-agnostic component both boards mount.
 *
 * ── The honesty spine (ROW 5, binding) ──────────────────────────────────────────────────
 * The whole display gates on `descriptor.graded`. An ungraded board (unsupported size,
 * restored permalink, hand-typed — the engine never ran) shows the dashed placeholder, never
 * a fabricated tier. All of that derivation lives in `describeTally` (techniqueVoice, unit-
 * tested); this component is a pure renderer + the pencil animation. It is the DIFFICULTY of
 * the three labelled signals — FILL (the border trace) and CORRECTNESS (the solve verdict) are
 * measured elsewhere and this glyph never implies either.
 *
 * ── Grammar (the load-bearing invariants) ───────────────────────────────────────────────
 *  - BOIL like everything else: `frameCount` grain-BAKED filterless pose siblings (the T3-W13
 *    grain-in-geometry discipline, `generateLineBoilFrames` + grain-static), opacity-swapped on
 *    the SHARED boil beat (`useBeatFrame`). Steady-state raster is zero — no live `filter=` to
 *    invalidate, the beat toggles opacity only (compositor-only), the geometry never mutates.
 *  - DRAW-IN with the glyph grammar: the inked strokes tick in on the shared sequence chain
 *    (`createSequenceSubscription`, easeOutCubic, DRAW_IN_PRESETS.glyph duration) via
 *    stroke-dashoffset — the identical primitive/easing glyphAnimations rides, retargeted to a
 *    reactive reveal so all four pose copies of a stroke draw as one. Transient, one-shot; at
 *    rest the reveal is constant, so the only per-beat change is the opacity swap.
 *  - PRM: the sequence chain's central gate no-ops `start()` under reduced motion; the reveal
 *    snaps to inked and the beat freezes (the grid's own PRM discipline, inherited).
 */
import { computed, onMounted, onUnmounted, reactive, watch } from "vue";
import {
  createSequenceSubscription,
  easeOutCubic,
  usePrefersReducedMotion,
  type SequenceHandle,
} from "@mkbabb/pencil-boil";
import { generateLineBoilFrames } from "@pencil/grid/gridPaths";
import {
  BOIL_CONFIG,
  FILTER_PRESETS,
  DRAW_IN_PRESETS,
  beatsFor,
} from "@pencil/config/pencilConfig";
import { useBeatFrame } from "@pencil/composables/boilBeat";
import { TALLY_TOTAL, type TallyDescriptor } from "./techniqueVoice";

const props = defineProps<{ descriptor: TallyDescriptor }>();

// ── The gate-five geometry ────────────────────────────────────────────────────────────────
// Four uprights + a binding slash, in a 76×44 viewBox. Per-stroke seeds decorrelate the boil.
const VIEWBOX = { w: 76, h: 44 };
const STROKES: { x1: number; y1: number; x2: number; y2: number; seed: number }[] = [
  { x1: 11, y1: 9, x2: 11, y2: 35, seed: 11 },
  { x1: 24, y1: 9, x2: 24, y2: 35, seed: 23 },
  { x1: 37, y1: 9, x2: 37, y2: 35, seed: 37 },
  { x1: 50, y1: 9, x2: 50, y2: 35, seed: 53 },
  { x1: 6, y1: 37, x2: 55, y2: 7, seed: 71 }, // the fifth: the diagonal that binds the four
];
const TALLY_BOIL = 0.6; // perturbation in viewBox units — subtle, in-family with the frame
const DRAW_STAGGER_MS = 90; // the hand ticking strokes off one at a time

// Grain-static baked into the pose geometry (the pencil's own tooth in this small-element
// regime — the same preset the glyphs ride). Reactive on the preset so FilterTuner stays live.
const grain = computed(() => FILTER_PRESETS["grain-static"]?.grain);

// Per stroke, `frameCount` grain-baked filterless variants.
const strokeFrames = computed(() =>
  STROKES.map((s) =>
    generateLineBoilFrames(
      s.x1,
      s.y1,
      s.x2,
      s.y2,
      { roughness: 0.95, segments: 4, seed: s.seed, jagged: true },
      TALLY_BOIL,
      BOIL_CONFIG.frameCount,
      grain.value,
    ),
  ),
);

// poses[f] = the five stroke paths at pose f — the sibling layers opacity-swap between these.
const poses = computed<string[][]>(() => {
  const fc = Math.max(2, Math.floor(BOIL_CONFIG.frameCount));
  const out: string[][] = [];
  for (let f = 0; f < fc; f++) {
    out.push(strokeFrames.value.map((fr) => fr[f % fr.length]));
  }
  return out;
});

// The shared boil beat (one driver, ref-counted — enrolls no new scheduler subscriber).
const boilFrame = useBeatFrame(
  () => BOIL_CONFIG.frameCount,
  () => beatsFor(BOIL_CONFIG.intervalMs),
);

// ── The draw-in reveal (stroke-dashoffset, one-shot on the shared sequence chain) ──────────
// reveal[i] ∈ [0,1] — the inked arc-length fraction of stroke i, shared across its four poses.
// pathLength=100 normalises the dash, so strokeDashoffset = 100·(1−reveal).
const reveal = reactive<number[]>(Array(TALLY_TOTAL).fill(1));
const reducedMotion = usePrefersReducedMotion();
let draws: SequenceHandle[] = [];

function stopDraws() {
  for (const d of draws) {
    try {
      d.stop();
    } catch {
      /* ignore */
    }
  }
  draws = [];
}

function runDrawIn(filled: number) {
  stopDraws();
  for (let i = 0; i < TALLY_TOTAL; i++) {
    if (i >= filled) {
      reveal[i] = 1; // an un-inked (ghost) stroke sits statically present — no draw-in
      continue;
    }
    if (reducedMotion.value) {
      reveal[i] = 1; // PRM: snap inked, no tween
      continue;
    }
    reveal[i] = 0;
    const seq = createSequenceSubscription({
      durationMs: DRAW_IN_PRESETS.glyph.duration,
      delayMs: i * DRAW_STAGGER_MS,
      easing: easeOutCubic,
      onProgress: (eased) => {
        reveal[i] = eased;
      },
      onComplete: () => {
        reveal[i] = 1;
      },
    });
    seq.start();
    draws.push(seq);
  }
}

const dashOffset = (i: number) => 100 * (1 - reveal[i]);
const strokeState = (i: number) => (i < props.descriptor.filled ? "inked" : "ghost");

// Re-ink whenever the measured grade changes (graded flips, or the tier moves). A same-tier
// re-deal leaves the tally standing — the difficulty didn't change, so neither does the glyph.
watch(
  () => [props.descriptor.graded, props.descriptor.filled] as const,
  ([graded, filled]) => {
    if (graded) runDrawIn(filled);
    else stopDraws();
  },
);

// A mid-session PRM engage would strand a reveal mid-tween (the chain force-clears but never
// finishes the value); land every inked stroke on its settled offset.
watch(reducedMotion, (reduced) => {
  if (reduced && props.descriptor.graded) {
    stopDraws();
    for (let i = 0; i < TALLY_TOTAL; i++) reveal[i] = 1;
  }
});

onMounted(() => {
  if (props.descriptor.graded) runDrawIn(props.descriptor.filled);
});
onUnmounted(stopDraws);
</script>

<template>
  <div
    class="difficulty-tally"
    :class="{ 'is-ungraded': !descriptor.graded }"
    role="img"
    tabindex="0"
    :aria-label="descriptor.ariaLabel"
  >
    <span class="dt-label" aria-hidden="true">difficulty</span>
    <svg
      class="dt-marks"
      :viewBox="`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Graded: grain-baked pose siblings, opacity-swapped on the shared beat (boil);
           inked strokes count the tier, ghost strokes hold the empty scale so "3 of 5"
           reads. Zero steady-state raster: filterless static geometry, compositor swap. -->
      <template v-if="descriptor.graded">
        <g
          v-for="(pose, f) in poses"
          :key="'pose-' + f"
          class="dt-pose"
          :class="{ 'is-active': boilFrame === f }"
        >
          <path
            v-for="(d, i) in pose"
            :key="i"
            :d="d"
            class="dt-stroke"
            :class="strokeState(i)"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            pathLength="100"
            stroke-dasharray="100 100"
            :style="{ strokeDashoffset: dashOffset(i) }"
          />
        </g>
      </template>
      <!-- Ungraded: the dashed placeholder — the empty scale, static, never a fabricated
           tier (ROW 5). Frame 0 only; no boil, no draw-in: the unmeasured tally is quiet. -->
      <g v-else class="dt-placeholder">
        <path
          v-for="(d, i) in poses[0]"
          :key="'ph-' + i"
          :d="d"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
    <span class="dt-name" aria-hidden="true">{{ descriptor.expand }}</span>
  </div>
</template>

<style scoped>
.difficulty-tally {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  /* The margin strip passes clicks through (pointer-events:none); the tally is a lean-in
     affordance, so it re-enables events for hover/focus, sized to its own content. */
  pointer-events: auto;
  width: fit-content;
  font-family: var(--font-hand);
  user-select: none;
}

.dt-label {
  font-size: var(--type-caption);
  letter-spacing: var(--type-tracking-wide);
  text-transform: lowercase;
  color: color-mix(
    in srgb,
    var(--color-pencil-graphite, var(--grid-line-color)) 62%,
    transparent
  );
}

.dt-marks {
  height: 1.5em;
  width: auto;
  overflow: visible;
  flex: 0 0 auto;
}

/* Boil: each pose is its own compositing layer so the opacity toggle is a compositor blend,
   not a repaint (the grid's own will-change:opacity discipline). */
.dt-pose {
  opacity: 0;
  will-change: opacity;
}
.dt-pose.is-active {
  opacity: 1;
}

.dt-stroke {
  stroke: var(--color-pencil-graphite, var(--grid-line-color));
  /* Draw-in advances the fill-front only while a new grade lands; absent under PRM so the
     offset snaps (the beat is already frozen). */
  transition: none;
}
.dt-stroke.inked {
  stroke-width: 3.2;
  stroke-opacity: 0.95;
}
/* The empty scale — present but at reduced pressure, so the tier count is legible. */
.dt-stroke.ghost {
  stroke-width: 2;
  stroke-opacity: 0.24;
}

/* The dashed placeholder — unmeasured, quiet, never a tier. */
.dt-placeholder path {
  stroke: var(--color-pencil-graphite, var(--grid-line-color));
  stroke-width: 2;
  stroke-opacity: 0.32;
  stroke-dasharray: 2.5 3.5;
}

/* Progressive disclosure: the exact hardest step is named on hover/focus (and always in the
   aria-label). Collapsed by default so the glyph stays a glanceable magnitude. */
.dt-name {
  font-size: var(--type-caption);
  letter-spacing: 0.01em;
  font-style: italic;
  color: color-mix(
    in srgb,
    var(--color-pencil-graphite, var(--grid-line-color)) 72%,
    transparent
  );
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  opacity: 0;
  transition:
    max-width 240ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 200ms ease;
}
.difficulty-tally:hover .dt-name,
.difficulty-tally:focus-visible .dt-name,
.difficulty-tally:focus-within .dt-name {
  max-width: 16ch;
  opacity: 1;
}

.difficulty-tally:focus-visible {
  outline: 2px solid var(--color-focus-sketch, #3a7bc4);
  outline-offset: 3px;
  border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .dt-name {
    transition: none;
  }
}
</style>
