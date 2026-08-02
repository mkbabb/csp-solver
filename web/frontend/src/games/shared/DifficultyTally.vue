<script setup lang="ts">
/**
 * The displayed-quality tally (T4-W9-B1) — the DIFFICULTY signal, drawn.
 *
 * A gate-five tally (four uprights + a binding slash) whose INKED strokes count the tier the
 * board's hardest human step reached — W7's five ascending tiers: singles · pairs/pointing ·
 * X-wing · swordfish/XY-wing · beyond. Not stars, not a percentage: the tiers ARE discrete,
 * so the glyph is discrete. The count is magnitude; the exact hardest technique is named in the
 * a11y label, at every width and with no gesture (the hover reveal it also used to carry is
 * retired — see the note at the template's foot). One game-agnostic component both boards mount.
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
import { heldFrameCount } from "@mkbabb/pencil-boil";
import { useBeatFrame } from "@pencil/composables/boilBeat";
import { TALLY_TOTAL, type TallyDescriptor } from "./techniqueVoice";

const props = withDefaults(
  defineProps<{
    descriptor: TallyDescriptor;
    /**
     * The word in front of the glyph. Defaults to what the glyph measures. The ticket passes
     * `dealt` instead (T4-P1 mark 6): inside the new-game well the `Difficulty` eyebrow is two
     * rows up, so "difficulty" there would be the same name written twice at two ranks — and
     * the distinction the well needs is exactly the one "dealt" draws, between the tier you
     * ASK for and the tier the board you were dealt actually reached.
     */
    label?: string;
  }>(),
  { label: "difficulty" },
);

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
// heldFrameCount (P1-W3): the answer-key laminate's boil hold was NEVER TOTAL — only
// HandDrawnGrid and BoilDivider wrapped their counts, so every other beat surface kept
// breathing under a hold that was supposed to still the page. `heldFrameCount` collapses the
// count to 1 during a hold and `useBeatFrame`'s `total <= 1` path freezes IN PLACE (no snap to
// pose 0); release returns the real count and the boil resumes mid-cadence. Contract repair,
// not perf.
const boilFrame = useBeatFrame(
  heldFrameCount(() => BOIL_CONFIG.frameCount),
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
    d.stop();
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
  <!-- a11y r1 L12: the `tabindex="0"` is GONE. It existed to trigger the hover/focus reveal
       that pass 4 retired (see the dead-markup note below); the stop outlived its purpose and
       sat between "Deal a new board" and "Normal" as a Tab press that activates nothing and
       reveals nothing. The name it announces is already announced — `role="img"` +
       `aria-label` publish the tally to a reader browsing the card, which is the reading mode
       a non-interactive graphic belongs to. -->
  <div
    class="difficulty-tally"
    :class="{ 'is-ungraded': !descriptor.graded }"
    role="img"
    :aria-label="descriptor.ariaLabel"
  >
    <span class="dt-label" aria-hidden="true">{{ label }}</span>
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
    <!-- T4-P1 pass 4 — THE HOVER REVEAL IS RETIRED, ESTATE-WIDE. It was a `max-width: 0 → 16ch`
         expansion of `descriptor.expand` ("hardest step: hidden single") and it was written for
         a tally that lived in the board's own margin, with an empty strip to open into. Mark 6
         moved the tally into the ticket's deal row, where its only neighbour is the commit
         verb: measured at the 1440 rail, expanded, verb→receipt clearance goes +7.53px →
         −103.53px in BOTH engines (`pass4/rigF3/out-assets-*.json`) — the name lies across
         Deal. The rail itself does not move (card 281 / board left 215.5, byte-identical) —
         the shared grid cell holds — so this is occlusion, not layout. The pass-3 tree hid it
         with `.deal-row :deep(.dt-name){display:none}` and described that as "suppressed inside
         the ticket only"; the ticket is the tally's ONLY mount, so it was already retired
         everywhere, silently, desktop included. Now it is retired on the record and the dead
         markup goes with it. The glyph goes back to what its own comment calls it: a glanceable
         magnitude. `TallyDescriptor.expand` KEEPS its home in techniqueVoice.ts (tested there,
         5 rows) and has, from here, no renderer.

         T5-W4c (pass 5) — THE RESIDUE ROWS, DISPOSED, AND ONE SENTENCE ABOVE CORRECTED.

         THE CORRECTION FIRST, because it is the load-bearing fact. Pass 4's retirement note
         said the exact hardest step "still names itself at every width — in the tally's own
         `aria-label` and in the margin voice's hint line". It does not, and the estate has two
         vocabularies rather than one: `GRADE_PHRASE` buckets the tier ("singles only", "needs
         an X-wing") and `TECHNIQUE_NAME` gives the exact step ("hidden single"). `ariaLabel` is
         built from `formatGradeSignature`, so it carries the BUCKET; naked-single and
         hidden-single read identically through it. Measured on the built dist at 390×664
         (`pass5/f3/rig/dtname.mjs`, `logs/dtname.log`): visible margin ink `a fresh 9×9 —
         singles only` · tally aria-label `difficulty — singles only (1 of 5)` · exact technique
         names found in ZERO visible text nodes and ZERO aria-labels. So `TallyDescriptor.name`
         and `.expand` are BOTH consumer-less, and the replacement pass 4 named was never there.

         (1) `dt-name` — the ADJUDICATOR row, alternatives PRICED, not described. What is
         actually missing is a visible route to the EXACT step; the difficulty SIGNATURE is
         visible today, drawn, at every width, with no gesture, on the strip's own reserved line:
           a. RESTORE THE HOVER REVEAL — measured, rejected on arithmetic: verb→receipt
              clearance +7.53 → −103.53px at the 1440 rail, both engines. The name lies across
              Deal. It is a hover grammar besides, so it was never a route on the surface the
              campaign is about.
           b. A SECOND LINE UNDER THE TALLY, always drawn — ≈17px per card at the body rung, in
              flow, at every width. The stack at 390×664 is 1.705 viewports and the loop's only
              blocking row IS that number: a new permanent line in the card spends the exact
              currency trigger (b) is short of.
           c. UPGRADE THE MARGIN VOICE from bucket to exact step — ZERO new pixels: the line is
              already reserved, already drawn, already read on every deal, and this is a string
              swap at one call site, not a surface. Its real price is a REGISTER change: "singles
              only" is a deliberately plain-spoken bucket and "hidden single" is the jargon the
              bucket exists to spare the reader. Cheapest in pixels, dearest in voice.
           d. TAP-TO-REVEAL on the tally — a new interactive control on a `role="img"` graphic,
              i.e. the tab stop L12 just retired, re-minted with a gesture on it.
         The lane's read, put up rather than taken: (c) is the only option that does not charge
         the blocking row, and the question it turns on is a VOICE question, which is the
         adjudicator's, not a measuring lane's.

         (2) `TallyDescriptor.expand` (and `.name` with it) — KEPT, trigger named, because the
         deletion is the one move that is expensive to undo: the five unit rows are the only
         thing pinning this wording, and both fields are the restoration cost of (b) and (c).
         TRIGGER: if the adjudicator rules that the exact step needs no visible surface, `name`,
         `expand` and the five rows retire in that same change — a field kept for an option that
         has been closed is exactly the residue this note is about. -->
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
  /* T4-W10 gate 1: 62% graphite was 4.32:1 on the board margin (< AA 4.5). The 68% that
     cleared it IS --ink-press-quiet; the literal is now the token. Pixel-identical. */
  color: var(--ink-press-quiet);
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

/* The `:focus-visible` ring goes with the tab stop it drew (a11y r1 L12). Nothing focuses a
   `role="img"` div that no longer takes a tabindex, so the rule was unreachable. */
</style>
