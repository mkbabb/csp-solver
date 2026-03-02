<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Animation } from '@mkbabb/keyframes.js';
import type { FruitPlacement } from '@/lib/vineShapes';
import { generateVine } from '@/lib/vineGenerator';

const svgRef = ref<SVGSVGElement | null>(null);

const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let animations: Animation<any>[] = [];

async function animateGrowth(_fruits: FruitPlacement[]) {
    if (!svgRef.value) return;

    const vineGroup = svgRef.value.querySelector('.vine-main') as SVGGElement;
    const fruitGroup = svgRef.value.querySelector('.vine-fruits') as SVGGElement;
    if (!vineGroup || !fruitGroup) return;

    // Gather all path elements in the vine group
    const vinePaths = Array.from(vineGroup.querySelectorAll('path'));

    // Setup stroke-dasharray/offset for vine draw-in
    vinePaths.forEach((pathEl) => {
        const len = pathEl.getTotalLength();
        pathEl.style.strokeDasharray = String(len);
        pathEl.style.strokeDashoffset = String(len);
    });

    // Animate each vine path drawing in
    const vinePromises: Promise<void>[] = [];
    vinePaths.forEach((pathEl, i) => {
        const len = pathEl.getTotalLength();
        const anim = new Animation<{ offset: number }>({
            duration: 2500,
            delay: i * 80,
            fillMode: 'forwards',
            timingFunction: 'easeOutCubic',
            useWAAPI: false,
        });

        anim.addFrame('0%', { offset: len }, (vars) => {
            pathEl.style.strokeDashoffset = String(vars.offset);
        });
        anim.addFrame('100%', { offset: 0 });
        anim.parse();

        animations.push(anim);
        vinePromises.push(anim.play());
    });

    // Animate fruits appearing with delays based on their position along the vine
    const fruitEls = Array.from(fruitGroup.querySelectorAll('.fruit-item')) as SVGGElement[];

    fruitEls.forEach((el) => {
        const t = parseFloat(el.getAttribute('data-t') || '0');
        const delay = 400 + t * 2800; // Stagger based on vine position

        const anim = new Animation<{ opacity: number; scale: number }>({
            duration: 500,
            delay,
            fillMode: 'forwards',
            timingFunction: 'easeOutCubic',
            useWAAPI: false,
        });

        const rotation = el.getAttribute('data-rotation') || '0';
        anim.addFrame('0%', { opacity: 0, scale: 0 }, (vars) => {
            el.style.opacity = String(vars.opacity);
            el.style.transform = `scale(${vars.scale}) rotate(${rotation}deg)`;
        });
        anim.addFrame('100%', { opacity: 1, scale: 1 });
        anim.parse();

        animations.push(anim);
        anim.play();
    });

    await Promise.all(vinePromises);
}

function cleanup() {
    animations.forEach((a) => {
        try { a.stop(); } catch { /* ignore */ }
    });
    animations = [];
}

onMounted(() => {
    if (!svgRef.value) return;
    generateVine(svgRef.value, reducedMotion, animateGrowth);
});

onUnmounted(() => {
    cleanup();
});
</script>

<template>
    <svg
        ref="svgRef"
        class="vine-border"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMaxYMin slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <g class="vine-main" />
        <g class="vine-fruits" />
    </svg>
</template>

<style scoped>
.vine-border {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
}

/* No filter in dark mode — vine renders at full fidelity */

/* Hide on narrow screens where margins don't exist */
@media (max-width: 1100px) {
    .vine-border {
        display: none;
    }
}
</style>
