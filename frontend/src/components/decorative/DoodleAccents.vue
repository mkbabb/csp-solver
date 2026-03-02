<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { CSSKeyframesAnimation } from '@mkbabb/keyframes.js';
import rough from 'roughjs';
import { mulberry32 } from '@/lib/handDrawnPaths';
import { type Doodle, palette, drawDoodleShape } from '@/lib/doodleShapes';

const svgRef = ref<SVGSVGElement | null>(null);

const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let bobAnimations: CSSKeyframesAnimation<any>[] = [];

function generateDoodles() {
    if (!svgRef.value) return;

    const rc = rough.svg(svgRef.value);
    const g = svgRef.value.querySelector('.doodle-shapes');
    if (!g) return;

    const rng = mulberry32(123);
    const doodles: Doodle[] = [];

    const types: Doodle['type'][] = ['daisy', 'music-note', 'star', 'heart-small', 'spiral', 'dot-cluster'];

    // Generate doodles in left and right margins — fewer but bigger
    for (let i = 0; i < 14; i++) {
        const isLeft = rng() > 0.5;
        const x = isLeft ? rng() * 10 + 2 : rng() * 10 + 88;
        const y = rng() * 85 + 5;

        doodles.push({
            type: types[Math.floor(rng() * types.length)],
            x,
            y,
            size: 28 + rng() * 24, // Much bigger: 28-52 (was 12-28)
            color: palette[Math.floor(rng() * palette.length)],
            opacity: 0.25 + rng() * 0.2,
            seed: Math.floor(rng() * 10000),
        });
    }

    doodles.forEach((doodle, i) => {
        const cx = (doodle.x / 100) * 1000;
        const cy = (doodle.y / 100) * 1000;
        const s = doodle.size;

        const groupEl = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        groupEl.setAttribute('opacity', String(doodle.opacity));
        groupEl.style.transformOrigin = `${cx}px ${cy}px`;

        const shape = drawDoodleShape(rc, cx, cy, s, doodle);

        groupEl.appendChild(shape);
        g.appendChild(groupEl);

        // Subtle bobbing animation
        if (!reducedMotion && i % 2 === 0) {
            const bobAnim = new CSSKeyframesAnimation(
                {
                    duration: 3500 + i * 400,
                    iterationCount: Infinity,
                    direction: 'alternate',
                    timingFunction: 'easeInOutCubic',
                },
                groupEl as unknown as HTMLElement,
            );

            bobAnim.fromString(`
                from { transform: translateY(0px); }
                to { transform: translateY(${4 + (i % 4)}px); }
            `);

            bobAnimations.push(bobAnim);
            bobAnim.play();
        }
    });
}

function cleanup() {
    bobAnimations.forEach((a) => {
        try { a.stop(); } catch { /* ignore */ }
    });
    bobAnimations = [];
}

onMounted(() => {
    generateDoodles();
});

onUnmounted(() => {
    cleanup();
});
</script>

<template>
    <svg
        ref="svgRef"
        class="doodle-accents"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <g class="doodle-shapes" />
    </svg>
</template>

<style scoped>
.doodle-accents {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
}

:global(.dark) .doodle-accents {
    opacity: 0.15;
    filter: saturate(0.3);
}

/* Hide on narrow screens where margins don't exist */
@media (max-width: 1100px) {
    .doodle-accents {
        display: none;
    }
}
</style>
