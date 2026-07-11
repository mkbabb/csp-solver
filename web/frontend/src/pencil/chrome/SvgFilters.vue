<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { FILTER_PRESETS, beatsFor, type FilterPreset } from '@pencil/config/pencilConfig';
import { useBoilBeat } from '@pencil/composables/boilBeat';

const presets = computed(() => Object.values(FILTER_PRESETS));

function filterRegion(p: FilterPreset) {
  const m = p.margin;
  return { x: `-${m}%`, y: `-${m}%`, width: `${100 + 2 * m}%`, height: `${100 + 2 * m}%` };
}

// ── JS-driven boil animation (Camillo Visini method) ──
// Oscillates feTurbulence baseFrequency + setAttribute. No SMIL <animate> — avoids
// framework re-render issues entirely. Was 3 independent useFilterParamBoil
// subscribers, each phase-anchored to its own first tick; now ALL wobble presets step
// on the ONE shared boil beat (T3-W12 §2 P1), each on its own whole-beat band
// (`beatsFor(intervalMs)`: celestial/heart → every beat, logo → every 4th), so a
// wobble param write always lands in the same dirty frame as the path boils. PRM and
// tab visibility gate the beat itself centrally; a preset's intervalMs stays live-
// tunable (FilterTuner) — the band re-derives per tick.

const svgRef = ref<SVGSVGElement | null>(null);
const turbEls = new Map<string, SVGFETurbulenceElement>();
const offsetIdx = new Map<string, number>();

const beat = useBoilBeat();
watch(beat, (b) => {
  for (const p of Object.values(FILTER_PRESETS)) {
    const w = p.wobble;
    if (!w) continue;
    if (b % beatsFor(w.intervalMs) !== 0) continue;
    const turbEl = turbEls.get(p.id);
    if (!turbEl) continue; // filter DOM not registered yet — harmless no-op
    const idx = (offsetIdx.get(p.id) ?? 0) + 1;
    offsetIdx.set(p.id, idx);
    const offset = w.offsets[idx % w.offsets.length];
    const freq = Math.round((w.baseFrequency + offset * w.animScale) * 10000) / 10000;
    turbEl.setAttribute('baseFrequency', String(freq));
  }
});

onMounted(() => {
  // Short delay so filter DOM is fully mounted before querying. Registration only —
  // the beat watcher above starts writing the moment an element lands in the map.
  requestAnimationFrame(() => {
    if (!svgRef.value) return;
    for (const p of Object.values(FILTER_PRESETS)) {
      if (!p.wobble) continue;
      const el = svgRef.value.querySelector(`#${CSS.escape(p.id)} feTurbulence`) as SVGFETurbulenceElement | null;
      if (el) turbEls.set(p.id, el);
    }
  });
});
</script>

<template>
  <svg
    ref="svgRef"
    width="0"
    height="0"
    style="position: absolute; pointer-events: none"
    aria-hidden="true"
  >
    <defs>
      <template v-for="p in presets" :key="p.id">
        <!-- Grain-only: static fractalNoise displacement -->
        <filter
          v-if="p.grain && !p.wobble && !p.multiPass && !p.texture"
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

        <!-- Wobble (boil): single feTurbulence + feDisplacementMap, animated via JS -->
        <filter
          v-else-if="p.wobble && !p.multiPass && !p.texture"
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
          v-else-if="p.multiPass && !p.wobble && !p.texture"
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
            <feBlend in="pass1" in2="pass2" :mode="p.multiPass.blendMode" result="blend12" />
            <template v-if="p.multiPass.passes.length >= 3">
              <feBlend in="blend12" in2="pass3" :mode="p.multiPass.blendMode" />
            </template>
          </template>
        </filter>

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
