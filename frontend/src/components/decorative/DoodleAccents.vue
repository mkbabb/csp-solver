<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { CSSKeyframesAnimation } from '@mkbabb/keyframes.js';
import rough from 'roughjs';
import { mulberry32 } from '@/lib/handDrawnPaths';

const svgRef = ref<SVGSVGElement | null>(null);

const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let bobAnimations: CSSKeyframesAnimation<any>[] = [];

// Yoshi's Story pastel palette
const palette = [
    '#fbbf24', // amber
    '#f43f5e', // red/rose
    '#3b82f6', // blue
    '#22c55e', // green
    '#a855f7', // purple
    '#f97316', // orange
    '#ec4899', // pink
];

interface Doodle {
    type: 'daisy' | 'music-note' | 'star' | 'heart-small' | 'spiral' | 'dot-cluster';
    x: number;
    y: number;
    size: number;
    color: string;
    opacity: number;
    seed: number;
}

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

        let shape: SVGGElement;

        switch (doodle.type) {
            case 'daisy': {
                // Yoshi's Story daisy flower — big round petals around a smiley center
                const flowerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                const petalCount = 6;
                const petalRadius = s * 0.22; // large petals
                const petalDist = s * 0.32;

                for (let p = 0; p < petalCount; p++) {
                    const angle = (p / petalCount) * Math.PI * 2;
                    const px = cx + Math.cos(angle) * petalDist;
                    const py = cy + Math.sin(angle) * petalDist;

                    const petal = rc.circle(px, py, petalRadius * 2, {
                        roughness: 1.2,
                        stroke: 'white',
                        strokeWidth: 2,
                        fill: 'white',
                        fillStyle: 'solid',
                        seed: doodle.seed + p,
                    });
                    flowerGroup.appendChild(petal);
                }

                // Orange center (like Yoshi's Story daisy)
                const center = rc.circle(cx, cy, s * 0.28, {
                    roughness: 0.8,
                    stroke: '#ea580c',
                    strokeWidth: 2,
                    fill: '#fb923c',
                    fillStyle: 'solid',
                    seed: doodle.seed + 10,
                });
                flowerGroup.appendChild(center);

                // Simple face dots on center (eyes)
                const leftEye = rc.circle(cx - s * 0.04, cy - s * 0.02, 3, {
                    roughness: 0.5, stroke: '#7c2d12', strokeWidth: 1,
                    fill: '#7c2d12', fillStyle: 'solid', seed: doodle.seed + 20,
                });
                const rightEye = rc.circle(cx + s * 0.04, cy - s * 0.02, 3, {
                    roughness: 0.5, stroke: '#7c2d12', strokeWidth: 1,
                    fill: '#7c2d12', fillStyle: 'solid', seed: doodle.seed + 21,
                });
                flowerGroup.appendChild(leftEye);
                flowerGroup.appendChild(rightEye);

                shape = flowerGroup as SVGGElement;
                break;
            }
            case 'music-note': {
                // Yoshi's Story music note — single eighth note
                const noteGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                // Stem
                const stem = rc.line(cx, cy, cx, cy - s * 0.6, {
                    roughness: 1.0, stroke: doodle.color,
                    strokeWidth: 2.5, seed: doodle.seed,
                });
                noteGroup.appendChild(stem);
                // Note head (filled ellipse)
                const head = rc.ellipse(cx - s * 0.08, cy, s * 0.22, s * 0.16, {
                    roughness: 1.0, stroke: doodle.color, strokeWidth: 2,
                    fill: doodle.color, fillStyle: 'solid', seed: doodle.seed + 1,
                });
                noteGroup.appendChild(head);
                // Flag
                const flag = rc.path(
                    `M${cx},${cy - s * 0.6} C${cx + s * 0.2},${cy - s * 0.5} ${cx + s * 0.15},${cy - s * 0.35} ${cx + s * 0.05},${cy - s * 0.3}`,
                    {
                        roughness: 1.2, stroke: doodle.color,
                        strokeWidth: 2, fill: 'none', seed: doodle.seed + 2,
                    },
                );
                noteGroup.appendChild(flag);
                shape = noteGroup as SVGGElement;
                break;
            }
            case 'star': {
                // Bold five-pointed star
                const pts: [number, number][] = [];
                for (let j = 0; j < 10; j++) {
                    const angle = (j * Math.PI) / 5 - Math.PI / 2;
                    const r = j % 2 === 0 ? s / 2 : s / 4.5;
                    pts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
                }
                shape = rc.polygon(pts, {
                    roughness: 1.2,
                    stroke: doodle.color,
                    strokeWidth: 2.5,
                    fill: doodle.color,
                    fillStyle: 'hachure',
                    fillWeight: 1.5,
                    hachureGap: 4,
                    seed: doodle.seed,
                }) as unknown as SVGGElement;
                break;
            }
            case 'heart-small': {
                // Small heart like Yoshi's Story
                const heartPath = `M${cx},${cy + s * 0.15} C${cx},${cy + s * 0.15} ${cx - s * 0.3},${cy - s * 0.05} ${cx - s * 0.3},${cy - s * 0.15} C${cx - s * 0.3},${cy - s * 0.3} ${cx - s * 0.1},${cy - s * 0.35} ${cx},${cy - s * 0.15} C${cx + s * 0.1},${cy - s * 0.35} ${cx + s * 0.3},${cy - s * 0.3} ${cx + s * 0.3},${cy - s * 0.15} C${cx + s * 0.3},${cy - s * 0.05} ${cx},${cy + s * 0.15} ${cx},${cy + s * 0.15} Z`;
                shape = rc.path(heartPath, {
                    roughness: 1.3,
                    stroke: doodle.color,
                    strokeWidth: 2.5,
                    fill: doodle.color,
                    fillStyle: 'hachure',
                    fillWeight: 1.5,
                    hachureGap: 3,
                    seed: doodle.seed,
                }) as unknown as SVGGElement;
                break;
            }
            case 'spiral': {
                // Bigger spiral
                let path = `M${cx},${cy}`;
                for (let t = 0; t < 16; t++) {
                    const angle = (t / 16) * Math.PI * 3;
                    const r = (t / 16) * s * 0.5;
                    path += ` L${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`;
                }
                shape = rc.path(path, {
                    roughness: 1.0,
                    stroke: doodle.color,
                    strokeWidth: 2.5,
                    fill: 'none',
                    seed: doodle.seed,
                }) as unknown as SVGGElement;
                break;
            }
            case 'dot-cluster':
            default: {
                const dotGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                const dotRng = mulberry32(doodle.seed);
                for (let d = 0; d < 6; d++) {
                    const dx = cx + (dotRng() - 0.5) * s;
                    const dy = cy + (dotRng() - 0.5) * s;
                    const dot = rc.circle(dx, dy, 6 + dotRng() * 8, {
                        roughness: 0.8,
                        stroke: doodle.color,
                        strokeWidth: 1.5,
                        fill: doodle.color,
                        fillStyle: 'solid',
                        seed: doodle.seed + d,
                    });
                    dotGroup.appendChild(dot);
                }
                shape = dotGroup as SVGGElement;
                break;
            }
        }

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
