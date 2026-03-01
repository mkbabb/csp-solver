<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { getVariant, getAllVariants } from '@/lib/glyphs/glyphRegistry';
import { createGlyphDrawIn, createGlyphWiggle } from '@/lib/animation/glyphAnimations';
import { DRAW_IN_PRESETS } from '@/lib/pencilConfig';
import type { Animation } from '@mkbabb/keyframes.js';

const props = defineProps<{
    value: string;
    isGiven: boolean;
    isRevealed: boolean;
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

const strokeColor = computed(() => {
    return props.isGiven ? 'var(--color-foreground)' : 'var(--color-user-ink, #2563eb)';
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

function setupDrawIn() {
    if (!pathRef.value || !glyph.value) return;

    cleanupAnimations();

    if (props.isRevealed) {
        // Animate draw-in for solved cells
        drawInAnim = createGlyphDrawIn(pathRef.value, glyph.value.length, {
            duration: DRAW_IN_PRESETS.glyph.duration,
            delay: DRAW_IN_PRESETS.glyph.baseDelay,
        });
        if (drawInAnim) {
            drawInAnim.play();
        }
    } else {
        // Show immediately for given cells and user-entered cells
        pathRef.value.style.strokeDasharray = 'none';
        pathRef.value.style.strokeDashoffset = '0';
    }
}

// Wiggle on hover
watch(
    () => props.isHovered,
    (hovered) => {
        if (!pathRef.value || !props.value) return;

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
