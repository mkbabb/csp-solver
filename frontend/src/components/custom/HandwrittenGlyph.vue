<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { getVariant, getAllVariants } from '@/lib/glyphs/glyphRegistry';
import { createGlyphDrawIn, createGlyphWiggle } from '@/lib/animation/glyphAnimations';
import { DRAW_IN_PRESETS } from '@/lib/pencilConfig';
import type { Animation } from '@mkbabb/keyframes.js';

const props = defineProps<{
    value: string;
    isGiven: boolean;
    isOverridden: boolean;
    isRevealed: boolean;
    noiseDelay: number;
    position: number;
    boardSize: number;
    isHovered: boolean;
}>();

const pathRef = ref<SVGPathElement | null>(null);

let drawInAnim: Animation<any> | null = null;
let wiggleAnim: Animation<any> | null = null;

const glyph = computed(() => {
    if (!props.value) return null;
    return getVariant(props.value, props.position);
});

// Given non-overridden cells get sparkle-rainbow; everything else gets user-ink
const isGivenOriginal = computed(() => props.isGiven && !props.isOverridden);

const strokeColor = computed(() => {
    return isGivenOriginal.value ? 'url(#sparkle-rainbow)' : 'var(--color-user-ink, #2563eb)';
});

const strokeWidth = computed(() => {
    return props.isGiven ? 5 : 4.5;
});

function cleanupAnimations() {
    if (drawInAnim) {
        try { drawInAnim.stop(); } catch { /* ignore */ }
        drawInAnim = null;
    }
    if (wiggleAnim) {
        try { wiggleAnim.stop(); } catch { /* ignore */ }
        wiggleAnim = null;
    }
}

function startAutoWiggle() {
    if (!pathRef.value || !props.value) return;
    const variants = getAllVariants(props.value);
    if (variants.length >= 2) {
        wiggleAnim = createGlyphWiggle(
            pathRef.value,
            variants.map((v) => v.d),
            { duration: 800 },
        );
        if (wiggleAnim) {
            wiggleAnim.play();
        }
    }
}

function setupDrawIn() {
    if (!pathRef.value || !glyph.value) return;

    cleanupAnimations();

    if (props.isRevealed) {
        // Animate draw-in for revealed cells (solved or randomized) with noise delay
        drawInAnim = createGlyphDrawIn(pathRef.value, glyph.value.length, {
            duration: DRAW_IN_PRESETS.glyph.duration,
            delay: props.noiseDelay || DRAW_IN_PRESETS.glyph.baseDelay,
        });
        if (drawInAnim) {
            drawInAnim.play();
            // After draw-in, start auto-wiggle for given non-overridden cells
            if (isGivenOriginal.value) {
                const totalDelay = (props.noiseDelay || DRAW_IN_PRESETS.glyph.baseDelay) + DRAW_IN_PRESETS.glyph.duration;
                setTimeout(() => {
                    if (isGivenOriginal.value) startAutoWiggle();
                }, totalDelay);
            }
        }
    } else {
        // Show immediately for given cells and user-entered cells
        pathRef.value.style.strokeDasharray = 'none';
        pathRef.value.style.strokeDashoffset = '0';
        // Auto-wiggle for given non-overridden (non-revealed, already present)
        if (isGivenOriginal.value) {
            startAutoWiggle();
        }
    }
}

// Wiggle on hover — skip for given non-overridden (they auto-wiggle)
watch(
    () => props.isHovered,
    (hovered) => {
        if (!pathRef.value || !props.value) return;
        if (isGivenOriginal.value) return; // skip — auto-wiggle handles these

        if (hovered) {
            const variants = getAllVariants(props.value);
            if (variants.length >= 2) {
                wiggleAnim = createGlyphWiggle(
                    pathRef.value,
                    variants.map((v) => v.d),
                    { duration: 600 },
                );
                if (wiggleAnim) {
                    wiggleAnim.play();
                }
            }
        } else {
            if (wiggleAnim) {
                try { wiggleAnim.stop(); } catch { /* ignore */ }
                wiggleAnim = null;
            }
            // Reset to original variant
            if (glyph.value && pathRef.value) {
                pathRef.value.setAttribute('d', glyph.value.d);
            }
        }
    },
);

// Watch override: stop auto-wiggle, revert to user-ink
watch(
    () => props.isOverridden,
    (overridden) => {
        if (overridden) {
            if (wiggleAnim) {
                try { wiggleAnim.stop(); } catch { /* ignore */ }
                wiggleAnim = null;
            }
            if (glyph.value && pathRef.value) {
                pathRef.value.setAttribute('d', glyph.value.d);
            }
        }
    },
);

watch(
    () => props.value,
    () => {
        // Re-setup when value changes
        requestAnimationFrame(() => setupDrawIn());
    },
);

onMounted(() => {
    setupDrawIn();
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
            :d="glyph.d"
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
