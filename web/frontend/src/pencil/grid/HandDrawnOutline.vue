<script setup lang="ts">
import { computed, ref } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { generateRectBoilFrames } from "./gridPaths";
import { BOIL_CONFIG, beatsFor } from "@pencil/config/pencilConfig";
import { useBeatFrame } from "@pencil/composables/boilBeat";

// Px-native geometry — registration by construction (T3-W10 F1). The path is generated
// in a viewBox equal to the measured px border box padded by `outset` on every side:
// one number, one coordinate system, so the frame hugs its card at EVERY host size.
// (The old mixed system — a fixed -6px CSS outset against a proportional 8/1000-unit
// path inset — only registered at one size; the popover, the smallest host by 3–4×,
// floated ~5–6px.) Scale is 1:1, so preserveAspectRatio="none", vector-effect, and the
// anisotropic-wobble side effect all vanish.
//
// Stroke presence (T3-W12 §3, owner finding 2): everything expressed in absolute user
// units re-derived for the px regime — its own grain preset (`grain-outline`), its own
// boil constant (`outlineBoilPx`), outset 4 (the BEFORE ~4px air), corners square by
// default (the BEFORE character: hand-ruled sides crossing with jagged overshoot; the
// auto border-radius read is gone — the quarter-arc corners it produced read geometric,
// out of family with the sides).
const props = withDefaults(
    defineProps<{
        strokeWidth?: number;
        /** Air between the card's border box and the drawn frame, in px (per-host tunable). */
        outset?: number;
        /** Corner radius in px. Default 0 — square, jagged overshoot crossings (opt-in only). */
        radius?: number;
    }>(),
    {
        strokeWidth: 6,
        outset: 4,
        radius: 0,
    },
);

const containerRef = ref<HTMLElement | null>(null);
const width = ref(0);
const height = ref(0);

useResizeObserver(containerRef, (entries) => {
    const entry = entries[0];
    if (entry) {
        width.value = entry.contentRect.width;
        height.value = entry.contentRect.height;
    }
});

// On the shared beat (T3-W12 §2 P1): the outline's swap coalesces with the grid's.
const currentFrame = useBeatFrame(
    () => BOIL_CONFIG.frameCount,
    () => beatsFor(BOIL_CONFIG.intervalMs),
);

const frames = computed(() => {
    if (width.value === 0 || height.value === 0) return [];
    const vbW = width.value + props.outset * 2;
    const vbH = height.value + props.outset * 2;
    return generateRectBoilFrames(
        0,
        0,
        vbW,
        vbH,
        { roughness: 0.5, segments: 6, seed: 77, jagged: true },
        BOIL_CONFIG.outlineBoilPx,
        BOIL_CONFIG.frameCount,
        props.radius,
    );
});

const viewBox = computed(
    () => `0 0 ${width.value + props.outset * 2} ${height.value + props.outset * 2}`,
);

const currentPath = computed(() => frames.value[currentFrame.value] ?? "");
</script>

<template>
    <div
        ref="containerRef"
        class="outline-container"
        :style="{ '--outline-outset': `${props.outset}px` }"
    >
        <slot />
        <svg
            v-if="currentPath"
            class="outline-svg"
            :viewBox="viewBox"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                :d="currentPath"
                fill="none"
                stroke="currentColor"
                :stroke-width="props.strokeWidth"
                stroke-opacity="0.95"
                stroke-linejoin="round"
                stroke-linecap="round"
                filter="url(#grain-outline)"
            />
        </svg>
    </div>
</template>

<style scoped>
.outline-container {
    position: relative;
    overflow: visible;
}

.outline-svg {
    position: absolute;
    inset: calc(var(--outline-outset, 0px) * -1);
    width: calc(100% + var(--outline-outset, 0px) * 2);
    height: calc(100% + var(--outline-outset, 0px) * 2);
    pointer-events: none;
    z-index: 1;
    overflow: visible;
}
</style>
