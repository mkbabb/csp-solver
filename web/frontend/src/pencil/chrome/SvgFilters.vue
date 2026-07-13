<script setup lang="ts">
import { computed } from "vue";
import {
  FILTER_PRESETS,
  wobblePoseFrequencies,
  wobblePoseId,
  type FilterPreset,
} from "@pencil/config/pencilConfig";

const presets = computed(() => Object.values(FILTER_PRESETS));

function filterRegion(p: FilterPreset) {
  const m = p.margin;
  return {
    x: `-${m}%`,
    y: `-${m}%`,
    width: `${100 + 2 * m}%`,
    height: `${100 + 2 * m}%`,
  };
}

// ── Frozen pose variants (T3-W13 §1-P3/P4) ──
// The Visini-method per-beat baseFrequency write is RETIRED: an SVG reference
// filter is part of its clients' PAINT, so every write re-rastered every client
// at DPR2 and damaged the root scrolling layer full-viewport, 8×/s (b1's painter
// inventory). A wobble boil is N poses; each wobble preset now declares one
// STATIC filter per pose (`${id}-p${i}`, params identical to what the watcher
// wrote on beat i — wobblePoseFrequencies), and the pose stacks (HandwrittenLogo,
// DarkModeToggle) flip sibling visibility on the beat: each pose rasters ONCE.
// The base `#wobble-*` defs stay, frozen at their rest params, for the transient
// and hover clients (P4-ii freeze-at-one-pose: icon-btn / section-heading /
// ctrl-btn hover, crayon + celebration hearts) — a static filter rasters once per
// appearance and never re-enrolls a per-beat painter. Params stay live-tunable:
// pose frequencies derive reactively from FILTER_PRESETS (FilterTuner).
</script>

<template>
  <svg
    width="0"
    height="0"
    style="position: absolute; pointer-events: none"
    aria-hidden="true"
  >
    <defs>
      <template v-for="p in presets" :key="p.id">
        <!-- Grain-only base def: static fractalNoise displacement. Suppressed for a
             baked preset (baseDef === false → grain-outline) whose base filter is orphaned. -->
        <filter
          v-if="p.grain && !p.wobble && !p.multiPass && p.baseDef !== false"
          :id="p.id"
          v-bind="filterRegion(p)"
          color-interpolation-filters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            :baseFrequency="p.grain.baseFrequency"
            :numOctaves="p.grain.numOctaves"
            :seed="p.grain.seed"
            result="grain"
          />
          <feDisplacementMap in="SourceGraphic" in2="grain" :scale="p.grain.scale" />
        </filter>

        <!-- Wobble base def: single feTurbulence + feDisplacementMap, STATIC at the rest
             params — the freeze-at-one-pose surface (hover chrome, hearts). Suppressed for a
             pose-stack-only preset (baseDef === false → wobble-logo) whose base is orphaned. -->
        <filter
          v-else-if="p.wobble && !p.multiPass && p.baseDef !== false"
          :id="p.id"
          filterUnits="objectBoundingBox"
          v-bind="filterRegion(p)"
          overflow="visible"
          color-interpolation-filters="sRGB"
        >
          <feTurbulence
            type="turbulence"
            :baseFrequency="p.wobble.baseFrequency"
            :numOctaves="p.wobble.numOctaves"
            result="turbulence"
            stitchTiles="noStitch"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            :scale="p.wobble.scale"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <!-- MultiPass: multiple displaced copies blended -->
        <filter
          v-else-if="p.multiPass && !p.wobble"
          :id="p.id"
          v-bind="filterRegion(p)"
          color-interpolation-filters="sRGB"
        >
          <feTurbulence
            v-for="(pass, idx) in p.multiPass.passes"
            :key="idx"
            type="fractalNoise"
            :baseFrequency="p.multiPass.baseFrequency"
            :numOctaves="p.multiPass.numOctaves"
            :seed="pass.seed"
            :result="`noise${idx + 1}`"
          />
          <feDisplacementMap
            v-for="(pass, idx) in p.multiPass.passes"
            :key="'d' + idx"
            in="SourceGraphic"
            :in2="`noise${idx + 1}`"
            :scale="pass.scale"
            xChannelSelector="R"
            yChannelSelector="G"
            :result="`pass${idx + 1}`"
          />
          <!-- Chain blend: pass1+pass2 → blend12, blend12+pass3, etc. -->
          <template v-if="p.multiPass.passes.length >= 2">
            <feBlend
              in="pass1"
              in2="pass2"
              :mode="p.multiPass.blendMode"
              result="blend12"
            />
            <template v-if="p.multiPass.passes.length >= 3">
              <feBlend in="blend12" in2="pass3" :mode="p.multiPass.blendMode" />
            </template>
          </template>
        </filter>

        <!-- Frozen pose variants (T3-W13 §1-P3): one static filter per beat pose,
             structurally identical to the base wobble def — only baseFrequency
             differs, pinned to what the retired watcher wrote on that beat. -->
        <template v-if="p.wobble && !p.multiPass">
          <filter
            v-for="(freq, i) in wobblePoseFrequencies(p)"
            :id="wobblePoseId(p.id, i)"
            :key="wobblePoseId(p.id, i)"
            filterUnits="objectBoundingBox"
            v-bind="filterRegion(p)"
            overflow="visible"
            color-interpolation-filters="sRGB"
          >
            <feTurbulence
              type="turbulence"
              :baseFrequency="freq"
              :numOctaves="p.wobble.numOctaves"
              result="turbulence"
              stitchTiles="noStitch"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              :scale="p.wobble.scale"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </template>
      </template>

      <!-- Non-preset filters: pastel rainbow gradient (CHROME register — the sparkle
           icon). Board content rides #solver-ink below; this one never deepens. -->
      <linearGradient id="sparkle-rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f9a8d4" />
        <stop offset="25%" stop-color="#c4b5fd" />
        <stop offset="50%" stop-color="#93c5fd" />
        <stop offset="75%" stop-color="#6ee7b7" />
        <stop offset="100%" stop-color="#fde68a" />
      </linearGradient>

      <!-- Solver-ink (UI-10, T3-W9): the solver's answers, BOARD CONTENT ONLY (F8 §3.2 —
           never chrome, never a metadata tone). Same five hues as the sparkle rainbow,
           theme-resolved through the --color-solver-ink-* tokens (index.css): light mode
           deepens to ink pressure (≥4.72:1 on the cream papers, measured), dark keeps
           the pastel wax (10.1–15.0:1). -->
      <linearGradient id="solver-ink" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color: var(--color-solver-ink-1)" />
        <stop offset="25%" style="stop-color: var(--color-solver-ink-2)" />
        <stop offset="50%" style="stop-color: var(--color-solver-ink-3)" />
        <stop offset="75%" style="stop-color: var(--color-solver-ink-4)" />
        <stop offset="100%" style="stop-color: var(--color-solver-ink-5)" />
      </linearGradient>
    </defs>
  </svg>
</template>
