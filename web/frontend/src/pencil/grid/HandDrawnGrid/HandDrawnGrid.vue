<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch, nextTick, ref } from 'vue';
import { useBoilFrame } from '@pencil/composables/boilScheduler';
import { heldFrameCount } from '@pencil/composables/boilHoldGate';
import { generateGridBoilFrames } from '../gridPaths';
import { BOIL_CONFIG } from '@pencil/config/pencilConfig';
import { usePathAnimation } from './usePathAnimation';
import type { AnimationState } from '@pencil/types';

const props = defineProps<{
    boardSize: number;
    subgridSize: number;
    animState: AnimationState;
}>();

const emit = defineEmits<{
    (e: 'animationComplete', state: 'drawn' | 'hidden'): void;
}>();

const svgRef = ref<SVGSVGElement | null>(null);
const { pathsVisible, animateDrawIn, animateErase, showInstant, cleanup } = usePathAnimation(svgRef);

const VIEWBOX_SIZE = 1000;

// Generate boil frame variants whenever board size changes
const boilFrames = computed(() =>
    generateGridBoilFrames(
        props.boardSize, props.subgridSize, VIEWBOX_SIZE, 42,
        BOIL_CONFIG.frameCount, BOIL_CONFIG.frameBoil, BOIL_CONFIG.subgridBoil, BOIL_CONFIG.cellBoil,
    )
);

// Path-based boil: cycle frame index at ~6.7fps, on the unified rAF scheduler
// heldFrameCount: collapses to 1 while the answer-key laminate holds the page —
// the scheduler's frameCount<=1 stop path freezes the boil in place (W9 §2).
const { currentFrame: boilFrame } = useBoilFrame(
    heldFrameCount(() => BOIL_CONFIG.frameCount),
    () => BOIL_CONFIG.intervalMs,
);

// Freeze on frame 0 during draw-in (strokeDashoffset needs stable paths)
const activeFrame = computed(() => pathsVisible.value ? boilFrame.value : 0);

// Current frame's path data (transition layer — draw-in/erase only, see template)
const currentPaths = computed(() => {
    const f = activeFrame.value;
    const bf = boilFrames.value;
    return {
        frame: bf.frame[f],
        subgridLines: bf.subgridLines.map(line => line[f]),
        cellLines: bf.cellLines.map(line => line[f]),
    };
});

// ── Steady-state boil layer (grain-static decoupled from ticking geometry) ──
//
// Prototype 9 (grain-static-overlay): the transition layer above re-binds `d` on
// every boil tick, and while `pathsVisible` it shares a paint group with
// `grain-static`. Because grain-static's own turbulence params never change
// (pencilConfig.ts), the *only* reason it ever re-rasterizes is co-location with
// geometry that does — see pass-1 fe-boil-pipeline.md §2. Once the board reaches
// steady state ('drawn'), the transition `<g>` unmounts entirely (template below)
// and is replaced by `BOIL_CONFIG.frameCount` sibling groups, each rendering ONE
// frame variant's *static* geometry (bound directly to `boilFrames.value`, never
// to the ticking `boilFrame` ref) with grain-static applied once. The ticking
// signal only toggles which sibling is opacity:1 — a compositor-stage change that
// does not invalidate any group's own SourceGraphic, so grain-static's raster is
// computed at most `frameCount` times total instead of once per ~150ms tick.
function pathsForFrame(f: number) {
    const bf = boilFrames.value;
    return {
        frame: bf.frame[f],
        subgridLines: bf.subgridLines.map(line => line[f]),
        cellLines: bf.cellLines.map(line => line[f]),
    };
}

const steadyFrames = computed(() =>
    Array.from({ length: BOIL_CONFIG.frameCount }, (_, f) => pathsForFrame(f))
);

const showTransitionLayer = computed(() => props.animState !== 'drawn');
const showSteadyLayers = computed(() => props.animState === 'drawn');

async function doDrawIn() {
    await nextTick();
    requestAnimationFrame(async () => {
        await animateDrawIn();
        emit('animationComplete', 'drawn');
    });
}

async function doErase() {
    // Steady state ('drawn') unmounts the transition layer (§ steady-state boil
    // layer above) — wait for Vue's DOM patch to remount it before
    // usePathAnimation's querySelectorAll('path.grid-line') looks for it, or it
    // would find the wrong (or no) elements mid-swap.
    await nextTick();
    await animateErase();
    emit('animationComplete', 'hidden');
}

watch(
    () => props.animState,
    (state) => {
        if (state === 'drawing') doDrawIn();
        else if (state === 'erasing') doErase();
    },
);

onMounted(() => {
    if (props.animState === 'drawing') {
        doDrawIn();
    } else if (props.animState === 'drawn') {
        showInstant();
    }
});

onUnmounted(() => {
    cleanup();
});
</script>

<template>
    <svg
        ref="svgRef"
        class="hand-drawn-grid"
        :viewBox="`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
    >
        <!-- Transition layer: draw-in/erase only. Ticks `d` via strokeDashoffset
             (usePathAnimation) and the boil scheduler; unmounted entirely once
             steady state is reached so it stops paying the grain-static re-raster
             cost forever (see §"Steady-state boil layer" in the script). -->
        <g v-if="showTransitionLayer" :filter="pathsVisible ? 'url(#grain-static)' : undefined">
            <!-- Frame -->
            <path
                :d="currentPaths.frame"
                class="grid-line frame-line"
                fill="none"
                stroke="var(--grid-line-color, currentColor)"
                stroke-width="12"
                stroke-opacity="0.95"
                stroke-linecap="round"
            />

            <!-- Subgrid lines -->
            <path
                v-for="(d, i) in currentPaths.subgridLines"
                :key="'sg-' + i"
                :d="d"
                class="grid-line subgrid-line"
                fill="none"
                stroke="var(--grid-line-color, currentColor)"
                stroke-width="8"
                stroke-opacity="0.9"
                stroke-linecap="round"
            />

            <!-- Cell lines -->
            <path
                v-for="(d, i) in currentPaths.cellLines"
                :key="'cl-' + i"
                :d="d"
                class="grid-line cell-line"
                fill="none"
                stroke="var(--grid-line-color, currentColor)"
                stroke-width="5"
                stroke-opacity="0.7"
                stroke-linecap="round"
            />
        </g>

        <!-- Steady-state boil layer: `frameCount` pre-baked, grain-filtered
             siblings. Geometry is bound to the static `steadyFrames` array (never
             to the ticking `boilFrame` ref) — only `is-active`/opacity toggles per
             tick, a compositor-stage change that never invalidates a sibling's own
             SourceGraphic. Rendered only while 'drawn' (see showSteadyLayers). -->
        <template v-if="showSteadyLayers">
            <g
                v-for="(paths, f) in steadyFrames"
                :key="'boil-' + f"
                class="boil-frame-layer"
                :class="{ 'is-active': boilFrame === f }"
                filter="url(#grain-static)"
            >
                <path
                    :d="paths.frame"
                    class="grid-line frame-line"
                    fill="none"
                    stroke="var(--grid-line-color, currentColor)"
                    stroke-width="12"
                    stroke-opacity="0.95"
                    stroke-linecap="round"
                />
                <path
                    v-for="(d, i) in paths.subgridLines"
                    :key="'sg-' + i"
                    :d="d"
                    class="grid-line subgrid-line"
                    fill="none"
                    stroke="var(--grid-line-color, currentColor)"
                    stroke-width="8"
                    stroke-opacity="0.9"
                    stroke-linecap="round"
                />
                <path
                    v-for="(d, i) in paths.cellLines"
                    :key="'cl-' + i"
                    :d="d"
                    class="grid-line cell-line"
                    fill="none"
                    stroke="var(--grid-line-color, currentColor)"
                    stroke-width="5"
                    stroke-opacity="0.7"
                    stroke-linecap="round"
                />
            </g>
        </template>
    </svg>
</template>

<style scoped>
.hand-drawn-grid {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
    overflow: visible;
}

.boil-frame-layer {
    opacity: 0;
    /* Promotes each sibling to its own compositing layer so the opacity toggle
       below is a compositor-only blend, not a repaint — this is the will-change
       GPU-path hypothesis (sota-svg-anim-perf.md §3.6 / open question 11), tested
       incidentally by this prototype's before/after trace comparison. */
    will-change: opacity;
}

.boil-frame-layer.is-active {
    opacity: 1;
}
</style>
