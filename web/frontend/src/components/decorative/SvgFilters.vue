<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { FILTER_PRESETS, type FilterPreset } from '@/lib/pencilConfig';

const presets = computed(() => Object.values(FILTER_PRESETS));

function filterRegion(p: FilterPreset) {
  const m = p.margin;
  return { x: `-${m}%`, y: `-${m}%`, width: `${100 + 2 * m}%`, height: `${100 + 2 * m}%` };
}

// ── JS-driven boil animation (Camillo Visini method) ──
// Oscillates feTurbulence baseFrequency via setInterval + setAttribute.
// No SMIL <animate> — avoids framework re-render issues entirely.

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const svgRef = ref<SVGSVGElement | null>(null);
const intervals: ReturnType<typeof setInterval>[] = [];

function startBoilAnimations() {
  if (reducedMotion || !svgRef.value) return;

  for (const p of Object.values(FILTER_PRESETS)) {
    if (!p.wobble) continue;

    const turbEl = svgRef.value.querySelector(
      `#${CSS.escape(p.id)} feTurbulence`
    ) as SVGFETurbulenceElement | null;
    if (!turbEl) continue;

    // Clone the offsets array so we can rotate it independently per filter
    const offsets = [...p.wobble.offsets];
    let idx = 0;

    const interval = setInterval(() => {
      // Read current config (reactive — tuner changes picked up automatically)
      const w = p.wobble!;
      const offset = offsets[idx % offsets.length];
      const freq = Math.round((w.baseFrequency + offset * w.animScale) * 10000) / 10000;
      turbEl.setAttribute('baseFrequency', String(freq));
      idx++;
    }, p.wobble.intervalMs);

    intervals.push(interval);
  }
}

function stopBoilAnimations() {
  intervals.forEach(clearInterval);
  intervals.length = 0;
}

onMounted(() => {
  // Short delay so filter DOM is fully mounted before querying
  requestAnimationFrame(() => startBoilAnimations());
});

onUnmounted(() => {
  stopBoilAnimations();
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

      <!-- Non-preset filters: pastel rainbow gradient -->
      <linearGradient id="sparkle-rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f9a8d4" />
        <stop offset="25%" stop-color="#c4b5fd" />
        <stop offset="50%" stop-color="#93c5fd" />
        <stop offset="75%" stop-color="#6ee7b7" />
        <stop offset="100%" stop-color="#fde68a" />
      </linearGradient>

      <!-- Storybook texture: fractal noise displacement for organic moon/star rendering -->
      <filter id="storybook-texture" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
</template>
