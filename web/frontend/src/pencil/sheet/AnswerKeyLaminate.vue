<script setup lang="ts">
/**
 * Answer-key laminate — the flagship translucent object (design-union §3 row 9).
 * Physical object: a clear laminated answer key, held over your page. Press-and-
 * hold (or K) → the boil freezes IN PLACE, a board-shaped laminate lays down over
 * it, and the missing answers print in teacher-red through the milk. Release/Esc/K
 * → it lifts away and your own entries are untouched.
 *
 * OD-1 (no-glass build): the laminate is blur-0 — its `.sheet-laminate` class
 * carries no glass filter, so the board shows through the milk dimmed but not
 * blurred (in-family with glass-ui's own blur-0 plate). Kill-gate discipline:
 * mounted as a SIBLING over the board (never inside HandDrawnGrid's filtered
 * group), no scrim, no nested translucent surface; pointer-events pass through.
 *
 * BLOCKING PRT fix (W9 §3): under prefers-reduced-transparency the laminate goes
 * fully opaque (construction paper — the fallback IS pure pencil). The board no
 * longer shows THROUGH it, so an "answers only over blanks" key would leave holes
 * where the givens were. When opaque we therefore render the COMPLETE solution —
 * every cell, givens included — a standalone printed key.
 */
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { getVariant, toDisplayChar } from "@pencil/glyph/glyphRegistry";
import { acquireHold, releaseHold } from "@mkbabb/pencil-boil";

const props = defineProps<{
  active: boolean;
  solution: Record<string, number>;
  boardSize: number;
  subgridSize: number;
  /** pristine given positions — these already sit on the page, no key needed
   *  UNLESS the laminate is opaque (PRT), when the whole key must be printed. */
  originalGivenCells: Set<string>;
}>();

const LIFT_MS = 200;

// prefers-reduced-transparency OR prefers-contrast: more — index.css flips the
// sheet to opaque construction paper under BOTH arms, so the ref must track
// both or the opaque sheet renders holes (the PRT defect, resurfaced under the
// contrast arm). When opaque we render the COMPLETE key — the blocking fix.
const opaqueQueries =
  typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? [
        window.matchMedia("(prefers-reduced-transparency: reduce)"),
        window.matchMedia("(prefers-contrast: more)"),
      ]
    : [];
const opaque = ref(opaqueQueries.some((q) => q.matches));
function onOpaqueChange() {
  opaque.value = opaqueQueries.some((q) => q.matches);
}
onMounted(() =>
  opaqueQueries.forEach((q) => q.addEventListener("change", onOpaqueChange)),
);
onUnmounted(() =>
  opaqueQueries.forEach((q) => q.removeEventListener("change", onOpaqueChange)),
);

const render = ref(false); // in the DOM (mounted through the lift-out window)
const shown = ref(false); // opacity/scale target (drives the lay/lift transition)
const announce = ref("");
let unmountTimer: ReturnType<typeof setTimeout> | null = null;

watch(
  () => props.active,
  (a) => {
    if (a) {
      if (unmountTimer) {
        clearTimeout(unmountTimer);
        unmountTimer = null;
      }
      acquireHold("answer-key"); // freeze the page IN PLACE
      render.value = true;
      announce.value = "peeking at the answer key";
      requestAnimationFrame(() => {
        shown.value = true; // trigger lay-down flourish
      });
    } else {
      shown.value = false; // trigger lift-away
      announce.value = "";
      unmountTimer = setTimeout(() => {
        render.value = false;
        releaseHold("answer-key"); // boil resumes mid-cadence
        unmountTimer = null;
      }, LIFT_MS);
    }
  },
  // immediate: the async component can mount with active already true on the
  // very first peek — without this the initial lay-down (and acquireHold) is missed.
  { immediate: true },
);

onUnmounted(() => {
  if (unmountTimer) clearTimeout(unmountTimer);
  releaseHold("answer-key");
});

// Board-shape-agnostic cellRects: a per-cell rectangle (fractional % of the
// board box) derived purely from boardSize — no hardcoded size, no reliance on
// CSS-grid auto-placement — so the printed key aligns to the uniform .board-cells
// grid at every board size (4×4 … 25×25) and survives any future non-square layout.
interface KeyCell {
  pos: number;
  d: string;
  leftPct: number;
  topPct: number;
  sizePct: number;
}
const keyCells = computed<KeyCell[]>(() => {
  const out: KeyCell[] = [];
  const n = props.boardSize;
  const total = n * n;
  const sizePct = 100 / n;
  for (let pos = 0; pos < total; pos++) {
    const key = String(pos);
    const isGiven = props.originalGivenCells.has(key);
    // Translucent laminate: givens already show through the milk — key the blanks
    // only. Opaque (PRT) laminate: nothing shows through — print EVERY cell.
    if (isGiven && !opaque.value) continue;
    const val = props.solution[key];
    if (!val) continue;
    const char = toDisplayChar(val, n);
    const glyph = getVariant(char, pos);
    if (!glyph) continue;
    out.push({
      pos,
      d: glyph.d,
      leftPct: (pos % n) * sizePct,
      topPct: Math.floor(pos / n) * sizePct,
      sizePct,
    });
  }
  return out;
});

// T3-W13 c3 (the gate's PRT trip): stroke-dashoffset is main-thread paint, so the
// stagger must cap how many strokes are mid-flight at once — the 16×16 opaque key
// (256 paths, all seven 40ms buckets) dropped 29 frames in its write window. The
// bucket width therefore derives from the key's own path count: mean concurrency
// ≈ N·dur/((buckets−1)·W + dur) ≤ KEY_CONCURRENCY_BUDGET, floored at the shipped
// 40ms so the common 9×9 key (N ≤ 81 either arm) keeps its 80–320ms window
// byte-identical. N=256 → 130ms buckets (window 80–860, last stroke done ~1040ms;
// ≤ two buckets ≈ 2N/7 strokes ever concurrent) — the write stretches, the
// noise ordering and the 180ms per-glyph red-pen stroke keep.
const KEY_DRAW_MS = 180;
const KEY_DELAY_LEAD_MS = 80; // lets the 280ms lay-down land first
const KEY_STAGGER_BUCKETS = 7;
const KEY_CONCURRENCY_BUDGET = 48;
const keyBucketMs = computed(() =>
  Math.max(
    40,
    Math.ceil(
      (KEY_DRAW_MS * (keyCells.value.length - KEY_CONCURRENCY_BUDGET)) /
        ((KEY_STAGGER_BUCKETS - 1) * KEY_CONCURRENCY_BUDGET),
    ),
  ),
);
</script>

<template>
  <div
    v-if="render"
    class="answer-key-laminate sheet-laminate"
    :class="{ 'is-shown': shown }"
    aria-hidden="true"
  >
    <div
      v-for="cell in keyCells"
      :key="cell.pos"
      class="key-cell"
      :style="{
        left: cell.leftPct + '%',
        top: cell.topPct + '%',
        width: cell.sizePct + '%',
        height: cell.sizePct + '%',
      }"
    >
      <!-- T3-W13 §4.3 — the teacher's red pen writes through the milk: per-glyph
           pencil-draw-on (pathLength="1", the global primitive), 180ms — a red pen
           is quicker than graphite — to the milk-dimmed 0.9. The delay is CSS-only
           noise: 80ms lets the 280ms lay-down land first, then 7 buckets echo
           beat-1's Fisher-Yates scatter without a JS timeline. Bucket width is
           size-derived (keyBucketMs — the c3 PRT stagger-widen): 9×9 keeps the
           40ms/80–320ms window, the 256-path opaque key widens to 130ms. -->
      <svg class="key-glyph" viewBox="0 0 40 56" xmlns="http://www.w3.org/2000/svg">
        <path
          :d="cell.d"
          pathLength="1"
          class="pencil-draw-on"
          :style="{
            '--draw-dur': `${KEY_DRAW_MS}ms`,
            '--draw-opacity': '0.9',
            '--draw-delay': `${KEY_DELAY_LEAD_MS + ((cell.pos * 31) % KEY_STAGGER_BUCKETS) * keyBucketMs}ms`,
          }"
          fill="none"
          stroke="var(--color-teacher-red)"
          stroke-width="5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </div>
  <!-- marginalia: the teacher's murmur, announced to AT -->
  <span class="sr-only" role="status">{{ announce }}</span>
</template>

<style scoped>
.answer-key-laminate {
  position: absolute;
  /* Anchored to the board SQUARE, not the host box: with H9 the board's margin strip
     is in flow on mobile, so the host grows below the square — inset:0 would stretch
     the laminate past the cells. width + aspect-ratio pins it to the square in both
     regimes (the host's width IS the board width). */
  top: 0;
  left: 0;
  width: 100%;
  aspect-ratio: 1 / 1;
  z-index: 3; /* above the cells layer, a sibling over the board — never inside its <g> */
  border-radius: 0.75rem; /* match board-wrapper rounded-xl */
  pointer-events: none;
  /* lift-away (leaving): fast + easeInCubic (the erase-family asymmetry) */
  opacity: 0;
  transform: scale(1.02);
  transition:
    opacity 200ms var(--ease-accelIn),
    transform 200ms var(--ease-accelIn);
}

.answer-key-laminate.is-shown {
  /* lay-down (arriving): the glass glide — T4-W10 re-points the retired overshoot
     spring (0.34, 1.56, 0.64, 1) onto the audit-4 monotone glass curve; 280ms
     preserved, start/end pose unchanged, only the velocity profile loses the
     overshoot (the laminate was the one surface the audit-4 ruling never reached). */
  opacity: 1;
  transform: scale(1);
  transition:
    opacity 280ms var(--ease-glassGlide),
    transform 280ms var(--ease-glassGlide);
}

.key-cell {
  position: absolute;
}

.key-glyph {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 65%;
  height: 65%;
  /* T3-W13 §4.3: the old keyFade ("pre-printed" flat 150ms fade) is deleted — the
     write-in lives on the path itself via the global .pencil-draw-on primitive. */
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .answer-key-laminate,
  .answer-key-laminate.is-shown {
    transform: none;
    transition: opacity 150ms linear;
  }
  /* Key glyphs: PRM-instant at 0.9 is inherited from the primitive itself
     (.pencil-draw-on's reduce arm lands opacity at --draw-opacity) — no scoped rule. */
}
</style>
