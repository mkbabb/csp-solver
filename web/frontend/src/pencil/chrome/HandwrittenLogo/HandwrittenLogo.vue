<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import {
  usePrefersReducedMotion,
  serializePoseSvg,
  useRasterStack,
} from "@mkbabb/pencil-boil";
import { useElementSize } from "@vueuse/core";
import { useTheme } from "@/composables/useTheme";
import {
  FILTER_PRESETS,
  MOTION,
  beatsFor,
  wobblePoseFrequencies,
  wobblePoseId,
} from "@pencil/config/pencilConfig";
import { useBeatFrame } from "@pencil/composables/boilBeat";
import {
  readFilterDefs,
  resolveCssValue,
  bitmapsToUrls,
  revokeUrls,
} from "@pencil/composables/rasterPose";
import frauncesInline from "@/assets/fonts/fraunces-subset.woff2?inline";
import HandwrittenGlyph from "@pencil/glyph/HandwrittenGlyph.vue";

// The wordmark IS the game picker. It renders the CURRENT game's name in the display face
// (live SVG <text>, so any label renders — no per-glyph art), and the whole thing is a real
// <button> that OPENS THE GALLERY (T4-W12 Wave D — the in-place dropdown listbox is retired;
// one game-select surface, the carousel). Pencil never imports games: the game id arrives as
// a prop; the open is emitted back to App.vue, which owns `enterGallery` + the board⇄card fold.
const props = defineProps<{
  game: string;
}>();

const emit = defineEmits<{
  /** Fires on activation (click / Enter / Space) — App folds the board into the gallery
   *  AND warms the other scene's lazy chunk on this signal (F6-D3), so a select is cached. */
  (e: "open"): void;
}>();

const { isDark } = useTheme();
const reducedMotion = usePrefersReducedMotion();

// ── The wordmark boil, pose-stacked (T3-W13 §1-P3) ──
// The label used to ride ONE live #wobble-logo whose baseFrequency was re-written
// every 4th beat — a full DPR2 filter re-raster on a ~734×238 region, riding the
// root scrolling layer's damage (b1's painter inventory). The boil is stop-motion
// over a finite pose set, so the poses render as N static siblings, each filtered
// by a FROZEN variant (#wobble-logo-p{i}, SvgFilters), and the beat flips opacity —
// compositor-only, zero steady-state raster (the grid hoist's discipline). Cadence
// is unchanged: `beatsFor(intervalMs)` = every 4th beat, exactly the band the
// retired SvgFilters watcher stepped on. PRM freezes the shared beat centrally, so
// the stack rests on pose 0.
const logoPreset = FILTER_PRESETS["wobble-logo"];
const logoPoseIds = computed(() =>
  wobblePoseFrequencies(logoPreset).map((_, i) => wobblePoseId(logoPreset.id, i)),
);
const logoPose = useBeatFrame(
  () => logoPoseIds.value.length,
  () => beatsFor(logoPreset.wobble?.intervalMs ?? MOTION.beatMs * 4),
);

// The wordmark renders the CURRENT game's name directly (id === display name for both games).
const label = computed(() => props.game);

// The caret's hover wiggle rides HandwrittenGlyph's own glyph-wiggle (PRM-gated in the glyph).
const hovered = ref(false);

// ── Clip-path wipe reveal — a mount-time beat, played ONCE (see the game watch) ──
const isDrawn = ref(reducedMotion.value);
function playReveal() {
  if (reducedMotion.value) {
    isDrawn.value = true;
    return;
  }
  isDrawn.value = false;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      isDrawn.value = true;
    });
  });
}

// ── Variable-width viewBox ──
// EVERY label is measured — no per-label special case (H3: the old vbWidth=220 carve-out
// for 'sudoku' left a 41.9 px trailing gap to the caret where measured labels get ~14.4).
// A generous estimate seeds the first paint (never clips), then getBBox tightens the box
// to the real glyph run + a uniform 4-unit trail, so the caret sits at one gap for all.
const textRef = ref<SVGTextElement | null>(null);
// Function ref for pose 0's <text> — every pose renders identical glyph geometry,
// so measuring one suffices (getBBox works at opacity 0; only display:none throws).
function setTextRef(el: unknown) {
  textRef.value = (el as SVGTextElement | null) ?? null;
}
function estimateWidth(text: string): number {
  return Math.max(120, Math.ceil(text.length * 34) + 12);
}
const vbWidth = ref(estimateWidth(label.value));
async function measure() {
  await nextTick();
  const el = textRef.value;
  if (!el) return;
  try {
    const box = el.getBBox();
    const fit = Math.ceil(box.x + box.width + 4);
    vbWidth.value = Math.max(120, fit);
  } catch {
    // getBBox can throw if the element isn't laid out yet — keep the estimate.
  }
}

onMounted(() => {
  playReveal();
  measure();
  // Fonts load async (Fraunces): re-measure once the real face is in so the box fits.
  const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
  if (fonts?.ready) fonts.ready.then(() => measure());
});

// I2: a game swap RE-MEASURES the box for the new label — it never re-reveals. The 1.2 s
// clip-path wipe is a mount-time beat; replaying it on every swap reads as a page reload,
// not a label change (the menu-close motion already carries the swap).
watch(
  () => props.game,
  () => {
    vbWidth.value = estimateWidth(label.value);
    measure();
  },
);

// ── T4-W1: the wordmark poses baked to bitmaps (the WebKit cure) ──
//
// The wordmark rides a resident #wobble-logo-p{i} pose stack opacity-swapped on the beat.
// Capture each frozen pose to an ImageBitmap once (useRasterStack) and opacity-swap static
// <image> siblings with the filter removed. A DETACHED SVG blob cannot reach the page's
// loaded @font-face, so the Fraunces subset is embedded (?inline) into each pose's <style>;
// the ink color resolves to a literal at capture. Re-bake fires on the label (game swap),
// the measured viewBox width, theme (ink), and DPR. The measuring <text> (template,
// invisible) keeps getBBox alive once the poses are baked, so the variable-width box still
// sizes on a swap. The live-filter stack is the during-bake fallback; useRasterStack awaits
// document.fonts.ready before the first bake, so the page face is in before the wordmark
// bakes.
const logoSvgRef = ref<SVGSVGElement | null>(null);
const { width: logoW, height: logoH } = useElementSize(logoSvgRef);

const FONT_FACE = `@font-face{font-family:'FrauncesBake';font-style:normal;font-weight:100 900;src:url('${frauncesInline}') format('woff2');}`;

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function logoPoseSvg(f: number): string {
  const pid = logoPoseIds.value[f];
  const ink = resolveCssValue(logoSvgRef.value, "color", "#1a1a1a");
  const w = vbWidth.value;
  const defs =
    readFilterDefs(pid) +
    `<style>${FONT_FACE}text{font-family:'FrauncesBake',Georgia,serif;` +
    `font-weight:900;font-size:52px;letter-spacing:0.02em;font-optical-sizing:auto;` +
    `fill:${ink};}</style>`;
  const body = `<g filter="url(#${pid})"><text x="4" y="48" text-anchor="start">${escapeXml(label.value)}</text></g>`;
  return serializePoseSvg({ width: w, height: 60, viewBox: `0 0 ${w} 60`, defs, body });
}

const logoRaster = useRasterStack(() => ({
  cacheKey: `logo-${label.value}-${isDark.value ? "d" : "l"}-${vbWidth.value}`,
  poseCount: logoPoseIds.value.length,
  poseSvg: logoPoseSvg,
  cssSize: {
    width: Math.round(logoW.value) || Math.round((vbWidth.value / 60) * 72),
    height: Math.round(logoH.value) || 72,
  },
}));

// ImageBitmap → object URL once per bake; async encode + close the redundant bitmaps
// (T4-WM rank 2/4). The urls are RETAINED while `bitmaps` is null (a re-bake in flight) so
// the wordmark swaps atomically — the old label/ink holds until the new poses convert, then
// one assignment. A monotonic token drops a superseded conversion; the previous urls revoke.
const logoUrls = ref<string[]>([]);
let logoUrlToken = 0;
watch(
  () => logoRaster.bitmaps.value,
  async (b) => {
    if (!b) return; // re-bake in flight — hold the live urls (atomic swap)
    const token = ++logoUrlToken;
    const next = await bitmapsToUrls(b);
    if (token !== logoUrlToken) {
      revokeUrls(next);
      return;
    }
    const prev = logoUrls.value;
    logoUrls.value = next;
    revokeUrls(prev);
  },
  { immediate: true },
);
const logoBaked = computed(
  () => logoUrls.value.length > 0 && logoUrls.value.length === logoPoseIds.value.length,
);

onUnmounted(() => {
  logoUrlToken++;
  revokeUrls(logoUrls.value);
});
</script>

<template>
  <div class="logo-menu">
    <button
      type="button"
      class="logo-trigger"
      :aria-label="`Puzzle: ${label}. Choose a puzzle`"
      @click.stop="emit('open')"
      @pointerenter="hovered = true"
      @pointerleave="hovered = false"
    >
      <svg
        ref="logoSvgRef"
        class="handwritten-logo"
        :class="{ 'is-drawn': isDrawn }"
        :viewBox="`0 0 ${vbWidth} 60`"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <!-- Measuring text: always present (unfiltered, invisible) so getBBox can
                     size the variable-width viewBox even once the poses are baked. -->
        <text
          :ref="setTextRef"
          class="logo-text logo-measure"
          x="4"
          y="48"
          text-anchor="start"
        >
          {{ label }}
        </text>
        <!-- T4-W1 baked poses: static <image> siblings of the captured bitmaps,
                     opacity-swapped on the beat (no filter, no per-beat raster). -->
        <template v-if="logoBaked">
          <image
            v-for="(url, f) in logoUrls"
            :key="`lg-${f}`"
            class="logo-pose-bmp"
            :class="{ 'is-active': logoPose === f }"
            :href="url"
            x="0"
            y="0"
            :width="vbWidth"
            height="60"
            preserveAspectRatio="none"
          />
        </template>
        <!-- Fallback while baking: the live #wobble-logo-p{i} pose stack
                     (T3-W13 §1-P3). T4-WM rank 1: PINNED to pose 0 — `is-active` never
                     follows the beat while unbaked, so the live filter rasters ONCE, not
                     per beat. One raster per appearance — no startup flash. -->
        <g
          v-for="(pid, f) in logoBaked ? [] : logoPoseIds"
          :key="pid"
          class="logo-pose"
          :class="{ 'is-active': f === 0 }"
          :filter="`url(#${pid})`"
        >
          <text class="logo-text" x="4" y="48" text-anchor="start">{{ label }}</text>
        </g>
      </svg>
      <span class="logo-caret" aria-hidden="true">
        <HandwrittenGlyph
          value=">"
          :is-given="true"
          :is-overridden="false"
          :is-solved="false"
          :is-revealed="false"
          :noise-delay="0"
          :position="0"
          :board-size="5"
          :is-hovered="hovered"
        />
      </span>
    </button>
  </div>
</template>

<style scoped>
.logo-menu {
  position: relative;
  align-self: flex-start;
  display: inline-block;
  --caret-size: 1.5rem;
  /* One golden rung up (×√φ, 1.272) from the shipped 3.5/4.5/5.5rem ladder — the
       single source for the wordmark's rendered size (L25-49: no scattered height
       literals; each breakpoint re-pins this var). */
  --logo-height: 4.452rem;
  /* Caret optical center (H3): the wordmark is lowercase on a 60-unit box with its
       baseline at y=48, so the x-height band — the ink mass the eye centers on —
       sits ~4.5 units BELOW the box's geometric middle. Flex centers the box; this
       nudge (4.5/60 of the rendered height) re-centers the caret on the ink. */
  --caret-nudge: calc(var(--logo-height) * 0.075);
}

/* Narrow-phone floor (T4-W10 gate 3, WCAG 1.4.10). The base rung renders the longest
   wordmark ("futoshiki") at ~301px; + the 0.4rem gap + the 1.5rem caret it totals ~332px,
   which overruns a 320px viewport's ~312px content box — the sole horizontal-reflow overflow
   at 320 (the board itself is 296px and fits). Step the height ladder one rung DOWN below
   360px so the wordmark + caret clears the narrowest supported width without a horizontal
   scrollbar. Proportional (the caret + its optical nudge ride --logo-height), so the wordmark
   only softens a step — never letterboxed, never clipped. ≥360px (375, iPhone-13 390, desktop
   1280) is untouched, so no capture/golden at those widths moves. */
@media (max-width: 360px) {
  .logo-menu {
    --caret-size: 1.3rem;
    --logo-height: 3.9rem;
  }
}

/* Reset the trigger back to bare inline content — the wordmark IS the affordance (mirrors
   AttributionCard.attribution-trigger). font-family is set explicitly, NOT `inherit`, so the
   Fraunces display face is unambiguous (avoids the inherit-specificity defeat, type-audit D2). */
.logo-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  color: var(--color-foreground);
  -webkit-tap-highlight-color: transparent;
}

.logo-trigger:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--color-foreground) 40%, transparent);
  outline-offset: 4px;
  border-radius: 0.35rem;
}

.handwritten-logo {
  /* --logo-scale (default 1) is the drawer's grow hook (T3-W12 §6): the closed
       regime pins 1.05 from App.vue and the wordmark takes it as a LAYOUT size at
       the settle's one layout step — never a filtered-element size tween (the glide
       itself covers the move with a transform on the masthead h1). */
  height: calc(var(--logo-height) * var(--logo-scale, 1));
  width: auto;
  color: var(--color-foreground);
  display: block;
  clip-path: inset(0 100% 0 0);
  transition: clip-path 1.2s var(--ease-noteWrite);
}

.handwritten-logo.is-drawn {
  clip-path: inset(0 0% 0 0);
}

/* T3-W13 §1-P3 — pose-stack siblings: each is its own composited layer so the
   beat's opacity flip is compositor-only, never a repaint (the grid's
   boil-frame-layer discipline, HandDrawnGrid.vue). */
.logo-pose {
  opacity: 0;
  will-change: opacity;
}

.logo-pose.is-active {
  opacity: 1;
}

/* T4-W1 baked poses: the same opacity-swap discipline on static <image> siblings (filter
   removed) — the flip is compositor-only, no raster recurs. */
.logo-pose-bmp {
  opacity: 0;
  will-change: opacity;
}

.logo-pose-bmp.is-active {
  opacity: 1;
}

/* The measuring text is invisible — it exists only to keep getBBox alive for the
   variable-width viewBox once the poses are baked (it never carries the filter). */
.logo-measure {
  opacity: 0;
  pointer-events: none;
}

.logo-text {
  /* The display register token (--font-display ← Fraunces + the serif fallbacks) —
       H4 ladder-bind; resolves byte-identically to the old inline stack. */
  font-family: var(--font-display);
  font-weight: 900;
  /* 52px here is viewBox GEOMETRY, not a type rung: user units inside the 60-unit
       box (baseline y=48). The rendered size rides --logo-height's golden ladder; a
       rem/clamp rung would couple glyph metrics to root font-size / viewport width
       and clip the fixed box. Deliberately off-token. */
  font-size: 52px;
  font-optical-sizing: auto;
  fill: currentColor;
  letter-spacing: 0.02em;
}

/* The interactive tell: the futoshiki '>' glyph rotated to a downward chevron — the "there's
   more, open it" cue (the wordmark now opens the gallery, T4-W12 Wave D). Hover wiggle rides
   HandwrittenGlyph's own glyph-wiggle (PRM-gated inside the glyph). */
.logo-caret {
  position: relative;
  flex: none;
  width: var(--caret-size);
  height: var(--caret-size);
  color: var(--color-foreground);
  transform: translateY(var(--caret-nudge)) rotate(90deg);
  transition: transform 200ms var(--ease-noteWrite);
}

@media (min-width: 640px) {
  .logo-menu {
    --caret-size: 1.9rem;
    --logo-height: 5.724rem;
  }
}

@media (min-width: 1024px) {
  .logo-menu {
    --caret-size: 2.3rem;
    --logo-height: 6.996rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .handwritten-logo {
    clip-path: none;
    transition: none;
  }
  .logo-caret {
    transition: none;
  }
}
</style>
