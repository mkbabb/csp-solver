<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { generateGridBoilFrames, mulberry32 } from '@/lib/handDrawnPaths';
import { useLineBoil } from '@/composables/useLineBoil';
import { Animation } from '@mkbabb/keyframes.js';
import { DRAW_IN_PRESETS, BOIL_CONFIG } from '@/lib/pencilConfig';

const props = defineProps<{
    boardSize: number;
    subgridSize: number;
    animState: 'hidden' | 'drawing' | 'drawn' | 'erasing';
}>();

const emit = defineEmits<{
    (e: 'animationComplete', state: 'drawn' | 'hidden'): void;
}>();

const svgRef = ref<SVGSVGElement | null>(null);
const pathsVisible = ref(false);

const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const VIEWBOX_SIZE = 1000;

// Generate boil frame variants whenever board size changes
const boilFrames = computed(() =>
    generateGridBoilFrames(
        props.boardSize, props.subgridSize, VIEWBOX_SIZE, 42,
        BOIL_CONFIG.frameCount, BOIL_CONFIG.frameBoil, BOIL_CONFIG.subgridBoil, BOIL_CONFIG.cellBoil,
    )
);

// Path-based boil: cycle frame index at ~6.7fps
const { currentFrame: boilFrame } = useLineBoil(BOIL_CONFIG.frameCount, BOIL_CONFIG.intervalMs);

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

// Collect all path elements after render
let drawAnimations: Animation<any>[] = [];

function getPathElements(): SVGPathElement[] {
    if (!svgRef.value) return [];
    return Array.from(svgRef.value.querySelectorAll('path.grid-line'));
}

function setupPathLengths(pathEls: SVGPathElement[]) {
    pathEls.forEach((el) => {
        const len = el.getTotalLength();
        el.style.strokeDasharray = String(len);
        el.style.strokeDashoffset = String(len);
    });
}

async function animateDrawIn() {
    cleanupAnimations();
    const pathEls = getPathElements();
    if (pathEls.length === 0) return;

    if (reducedMotion) {
        pathEls.forEach((el) => {
            el.style.strokeDashoffset = '0';
        });
        pathsVisible.value = true;
        emit('animationComplete', 'drawn');
        return;
    }

    setupPathLengths(pathEls);
    // pathsVisible stays false during draw-in so boil frame is frozen at 0
    // (path d-attribute changes would break strokeDashoffset animation)

    const framePaths = pathEls.filter((el) => el.classList.contains('frame-line'));
    const subgridPaths = pathEls.filter((el) => el.classList.contains('subgrid-line'));
    const cellPaths = pathEls.filter((el) => el.classList.contains('cell-line'));

    const promises: Promise<void>[] = [];
    const jitterRng = mulberry32(77);

    const groups = [
        { paths: framePaths,   preset: DRAW_IN_PRESETS.gridFrame },
        { paths: subgridPaths, preset: DRAW_IN_PRESETS.gridSubgrid },
        { paths: cellPaths,    preset: DRAW_IN_PRESETS.gridCell },
    ];

    for (const { paths: groupPaths, preset } of groups) {
        groupPaths.forEach((el, i) => {
            const len = el.getTotalLength();
            const jitter = Math.round((jitterRng() - 0.5) * preset.jitter * 2);
            const anim = new Animation<{ offset: number }>({
                duration: preset.duration,
                delay: Math.max(0, preset.baseDelay + i * preset.stagger + jitter),
                fillMode: 'forwards',
                timingFunction: preset.timing,
                useWAAPI: false,
            });
            anim.addFrame('0%', { offset: len }, (vars) => {
                el.style.strokeDashoffset = String(vars.offset);
            });
            anim.addFrame('100%', { offset: 0 });
            anim.parse();
            drawAnimations.push(anim);
            promises.push(anim.play());
        });
    }

    await Promise.all(promises);
    // Clear dasharray so boil frame cycling renders cleanly
    pathEls.forEach((el) => {
        el.style.strokeDasharray = 'none';
        el.style.strokeDashoffset = '0';
    });
    pathsVisible.value = true;
    emit('animationComplete', 'drawn');
}

async function animateErase() {
    cleanupAnimations();
    const pathEls = getPathElements();
    if (pathEls.length === 0) return;

    if (reducedMotion) {
        pathEls.forEach((el) => {
            const len = el.getTotalLength();
            el.style.strokeDashoffset = String(len);
        });
        pathsVisible.value = false;
        emit('animationComplete', 'hidden');
        return;
    }

    const promises: Promise<void>[] = [];

    pathEls.forEach((el, i) => {
        const len = el.getTotalLength();
        el.style.strokeDashoffset = '0';
        el.style.strokeDasharray = String(len);

        const anim = new Animation<{ offset: number }>({
            duration: 150,
            delay: i * 4,
            fillMode: 'forwards',
            timingFunction: 'easeInCubic',
            useWAAPI: false,
        });
        anim.addFrame('0%', { offset: 0 }, (vars) => {
            el.style.strokeDashoffset = String(vars.offset);
        });
        anim.addFrame('100%', { offset: len });
        anim.parse();
        drawAnimations.push(anim);
        promises.push(anim.play());
    });

    await Promise.all(promises);
    pathsVisible.value = false;
    emit('animationComplete', 'hidden');
}

function cleanupAnimations() {
    drawAnimations.forEach((a) => {
        try {
            a.stop();
        } catch {
            // ignore
        }
    });
    drawAnimations = [];
}

watch(
    () => props.animState,
    async (state) => {
        if (state === 'drawing') {
            await nextTick();
            requestAnimationFrame(() => animateDrawIn());
        } else if (state === 'erasing') {
            animateErase();
        }
    },
);

onMounted(async () => {
    if (props.animState === 'drawing') {
        await nextTick();
        requestAnimationFrame(() => animateDrawIn());
    } else if (props.animState === 'drawn') {
        const pathEls = getPathElements();
        pathEls.forEach((el) => {
            el.style.strokeDashoffset = '0';
            el.style.strokeDasharray = 'none';
        });
        pathsVisible.value = true;
    }
});

onUnmounted(() => {
    cleanupAnimations();
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
}
</style>
