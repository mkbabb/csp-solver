<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch, nextTick, ref } from 'vue';
import { useLineBoil } from '@mkbabb/pencil-boil';
import { generateGridBoilFrames } from '@/lib/gridPaths';
import { BOIL_CONFIG } from '@/lib/pencilConfig';
import { usePathAnimation } from '@/composables/usePathAnimation';
import type { AnimationState } from '@/lib/types';

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

// Path-based boil: cycle frame index at ~6.7fps
const { currentFrame: boilFrame } = useLineBoil(
    () => BOIL_CONFIG.frameCount,
    () => BOIL_CONFIG.intervalMs,
);

// Freeze on frame 0 during draw-in (strokeDashoffset needs stable paths)
const activeFrame = computed(() => pathsVisible.value ? boilFrame.value : 0);

// Current frame's path data
const currentPaths = computed(() => {
    const f = activeFrame.value;
    const bf = boilFrames.value;
    return {
        frame: bf.frame[f],
        subgridLines: bf.subgridLines.map(line => line[f]),
        cellLines: bf.cellLines.map(line => line[f]),
    };
});

async function doDrawIn() {
    await nextTick();
    requestAnimationFrame(async () => {
        await animateDrawIn();
        emit('animationComplete', 'drawn');
    });
}

async function doErase() {
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
        <!-- All grid lines in one group, static grain-static filter for texture -->
        <g :filter="pathsVisible ? 'url(#grain-static)' : undefined">
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
</style>
