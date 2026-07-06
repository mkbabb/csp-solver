<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { getVariant, getAllVariants } from './glyphRegistry';
import {
    createGlyphDrawIn,
    createGlyphFlourish,
    createGlyphWiggle,
    type GlyphAnimHandle,
} from './glyphAnimations';
import { registerMurmurCell, unregisterMurmurCell } from '@pencil/composables/celebration';
import { CELEBRATION, DRAW_IN_PRESETS, GLYPH_ANIM, wavefrontStepMs } from '@pencil/config/pencilConfig';

const props = defineProps<{
    value: string;
    isGiven: boolean;
    isOverridden: boolean;
    isSolved: boolean;
    isRevealed: boolean;
    noiseDelay: number;
    position: number;
    boardSize: number;
    isHovered: boolean;
}>();

// Stable TEMPLATE ref (never an inline `:ref="(el) => ..."` closure). This is the W8 task-4
// discipline: the draw-in's dasharray reset (§ createGlyphDrawIn) is written imperatively to
// `pathRef.value.style`, NOT bound reactively — so it survives every re-render (a re-bound
// inline function ref would fire unbind→rebind on each poll/tick and silently re-arm the
// pre-draw dash values, reverting a completed reset). A stable string ref only fires on real
// mount/unmount, and the imperative style writes are never clobbered by Vue's patch.
const pathRef = ref<SVGPathElement | null>(null);

let drawInAnim: GlyphAnimHandle | null = null;
let celebrationAnim: GlyphAnimHandle | null = null; // beat-2 flourish OR beat-3 murmur cycle
let hoverAnim: GlyphAnimHandle | null = null;
let murmurRegistered = false;

const glyph = computed(() => {
    if (!props.value) return null;
    return getVariant(props.value, props.position);
});

// Given non-overridden cells are original clues; solver-introduced cells get sparkle-rainbow
const isGivenOriginal = computed(() => props.isGiven && !props.isOverridden);

const strokeColor = computed(() => {
    if (props.isSolved) return 'url(#sparkle-rainbow)';
    if (isGivenOriginal.value) return 'var(--color-foreground)';
    return 'var(--color-user-ink, #2563eb)';
});

const strokeWidth = computed(() => {
    return props.isGiven || props.isSolved ? 5 : 4.5;
});

// Reactive display path — Vue restores this via :d on re-render; animations setAttribute over it
const displayPath = computed(() => glyph.value?.d ?? '');

function cellRowCol() {
    const n = Math.max(1, props.boardSize);
    return { row: Math.floor(props.position / n), col: props.position % n };
}

function registerForMurmur() {
    if (murmurRegistered) return;
    murmurRegistered = true;
    registerMurmurCell(props.position, { wiggleOnce: murmurWiggleOnce });
}

function unregisterFromMurmur() {
    if (!murmurRegistered) return;
    murmurRegistered = false;
    unregisterMurmurCell(props.position);
}

function cleanupAnimations() {
    if (drawInAnim) {
        try { drawInAnim.stop(); } catch { /* ignore */ }
        drawInAnim = null;
    }
    if (celebrationAnim) {
        try { celebrationAnim.stop(); } catch { /* ignore */ }
        celebrationAnim = null;
    }
    if (hoverAnim) {
        try { hoverAnim.stop(); } catch { /* ignore */ }
        hoverAnim = null;
    }
    unregisterFromMurmur();
}

// Beat 2 — the diagonal flourish wave. Onset is computed once from (row, col) so the front
// sweeps the board independently of each cell's own beat-1 draw-in stagger. Finite (two
// cycles), then the cell settles on its base variant and joins the beat-3 murmur pool.
function scheduleFlourish() {
    if (!pathRef.value || !glyph.value) return;
    const variants = getAllVariants(props.value);
    if (variants.length < 2) {
        registerForMurmur();
        return;
    }
    const { row, col } = cellRowCol();
    const delayMs = CELEBRATION.beat2StartMs + (row + col) * wavefrontStepMs(props.boardSize);
    celebrationAnim = createGlyphFlourish(
        pathRef.value,
        variants.map((v) => v.d),
        glyph.value.d,
        {
            cycles: CELEBRATION.flourishCycles,
            cycleDurationMs: CELEBRATION.wiggleCycleMs,
            delayMs,
            onDone: () => {
                celebrationAnim = null;
                registerForMurmur();
            },
        },
    );
    if (celebrationAnim) celebrationAnim.play();
    else registerForMurmur(); // PRM: no flourish; murmur also no-ops under PRM
}

// Beat 3 — a single wiggle cycle, driven by the shared murmur pool (design §1.3). One cell
// per 2.5s window; a lone transient sequence subscriber that self-removes.
function murmurWiggleOnce() {
    if (!pathRef.value || !glyph.value || !props.isSolved) return;
    const variants = getAllVariants(props.value);
    if (variants.length < 2) return;
    if (celebrationAnim) {
        try { celebrationAnim.stop(); } catch { /* ignore */ }
        celebrationAnim = null;
    }
    celebrationAnim = createGlyphFlourish(
        pathRef.value,
        variants.map((v) => v.d),
        glyph.value.d,
        {
            cycles: 1,
            cycleDurationMs: GLYPH_ANIM.hoverWiggleDuration,
            onDone: () => { celebrationAnim = null; },
        },
    );
    celebrationAnim?.play();
}

function setupReveal() {
    if (!pathRef.value || !glyph.value) return;

    cleanupAnimations();
    const el = pathRef.value;

    if (props.isRevealed) {
        // Beat 1 — the reveal wave: draw-in on the board-normalized noise stagger (delay
        // supplied by the board). One-shot sequence subscriber, not a keyframes.js loop.
        drawInAnim = createGlyphDrawIn(el, glyph.value.length, {
            duration: DRAW_IN_PRESETS.glyph.duration,
            delay: props.noiseDelay || DRAW_IN_PRESETS.glyph.baseDelay,
        });
        drawInAnim?.play();

        // Beat 2 — only the solver's rainbow ink celebrates; given/user cells stay dignified.
        if (props.isSolved) scheduleFlourish();
        return;
    }

    if (!props.value) return;

    // Overridden cells (given/solved the user replaced): instant show, no animation.
    if (props.isOverridden) {
        el.style.strokeDasharray = 'none';
        el.style.strokeDashoffset = '0';
        return;
    }

    // Quick draw-in for user-typed cells on blank cells.
    if (!props.isGiven && !props.isSolved) {
        drawInAnim = createGlyphDrawIn(el, glyph.value.length, { duration: 150, delay: 0 });
        if (drawInAnim) {
            drawInAnim.play();
            return;
        }
    }

    el.style.strokeDasharray = 'none';
    el.style.strokeDashoffset = '0';
    // A settled solved board (e.g. restored from storage, not re-animated) still murmurs.
    if (props.isSolved) registerForMurmur();
}

// Wiggle on hover — skip for solved cells (they celebrate/murmur instead).
watch(
    () => props.isHovered,
    (hovered) => {
        if (!pathRef.value || !props.value) return;
        if (props.isSolved) return;

        if (hovered) {
            const variants = getAllVariants(props.value);
            if (variants.length >= 2) {
                hoverAnim = createGlyphWiggle(
                    pathRef.value,
                    variants.map((v) => v.d),
                    { duration: GLYPH_ANIM.hoverWiggleDuration },
                );
                hoverAnim?.play();
            }
        } else if (hoverAnim) {
            try { hoverAnim.stop(); } catch { /* ignore */ }
            hoverAnim = null;
            // Vue reactivity restores the correct d via :d="displayPath" on next tick
        }
    },
);

// Watch override: stop celebration, drop out of the murmur pool, revert to user-ink.
watch(
    () => props.isOverridden,
    (overridden) => {
        if (overridden) {
            if (celebrationAnim) {
                try { celebrationAnim.stop(); } catch { /* ignore */ }
                celebrationAnim = null;
            }
            unregisterFromMurmur();
        }
    },
);

watch(
    () => props.value,
    () => {
        // Re-setup when value changes
        requestAnimationFrame(() => setupReveal());
    },
);

onMounted(() => {
    setupReveal();
});

onUnmounted(() => {
    cleanupAnimations();
});
</script>

<template>
    <svg
        v-if="glyph"
        class="glyph-svg"
        viewBox="0 0 40 56"
        xmlns="http://www.w3.org/2000/svg"
        :aria-label="value"
    >
        <path
            ref="pathRef"
            :d="displayPath"
            fill="none"
            :stroke="strokeColor"
            :stroke-width="strokeWidth"
            stroke-linecap="round"
            stroke-linejoin="round"
            filter="url(#grain-static)"
        />
    </svg>
</template>

<style scoped>
.glyph-svg {
    width: 65%;
    height: 65%;
    pointer-events: none;
    position: absolute;
    inset: 0;
    margin: auto;
}
</style>
