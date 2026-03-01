<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Animation } from '@mkbabb/keyframes.js';
import rough from 'roughjs';
import { mulberry32, catmullRomToBezier } from '@/lib/handDrawnPaths';

const svgRef = ref<SVGSVGElement | null>(null);

const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let animations: Animation<any>[] = [];

// Yoshi's Story style constants
const OUTLINE_BLACK = '#1a1a1a';
const OUTLINE_WIDTH = 4;

// Fruit/decoration types along the vine
type FruitType = 'banana' | 'grapes' | 'apple' | 'flower' | 'heart' | 'leaf';

interface FruitPlacement {
    type: FruitType;
    /** 0-1 position along vine path */
    t: number;
    x: number;
    y: number;
    size: number;
    seed: number;
    rotation: number; // degrees, ±15
}

// The vine path: bottom-right -> up right edge -> curve top-right -> along top -> top-left ending in heart
// In viewBox 0 0 1920 1080
const VINE_PATH =
    'M 1880 1100 ' +
    'C 1885 980, 1875 860, 1875 740 ' +
    'C 1870 620, 1882 500, 1878 380 ' +
    'C 1874 260, 1880 160, 1870 90 ' +
    'C 1858 50, 1835 30, 1790 24 ' +
    'C 1700 18, 1600 22, 1500 26 ' +
    'C 1380 30, 1260 20, 1140 24 ' +
    'C 1020 28, 900 18, 780 22 ' +
    'C 660 26, 540 16, 420 20 ' +
    'C 300 24, 180 14, 60 20';

// Fruit placements along the vine (manually positioned, with interleaved leaves)
function computeFruitPlacements(rng: () => number): FruitPlacement[] {
    const placements: FruitPlacement[] = [];

    function addItem(type: FruitType, t: number, x: number, y: number, size: number) {
        placements.push({
            type, t, x, y, size,
            seed: Math.floor(rng() * 10000),
            rotation: (rng() - 0.5) * 30, // ±15 degrees
        });
    }

    // Right edge (bottom to top) — fruits with interleaved leaves
    addItem('leaf', 0.02, 1860, 1020, 90);
    addItem('leaf', 0.05, 1840, 900, 110);
    addItem('banana', 0.09, 1850, 780, 150);
    addItem('leaf', 0.12, 1870, 680, 100);
    addItem('leaf', 0.15, 1830, 600, 120);
    addItem('apple', 0.19, 1835, 480, 70);
    addItem('leaf', 0.22, 1860, 400, 95);
    addItem('leaf', 0.25, 1840, 340, 110);
    addItem('grapes', 0.29, 1850, 260, 70);
    addItem('leaf', 0.33, 1830, 180, 105);
    addItem('leaf', 0.37, 1870, 120, 90);

    // Top-right corner
    addItem('flower', 0.42, 1700, 50, 75);
    addItem('leaf', 0.45, 1600, 30, 100);
    addItem('leaf', 0.47, 1520, 50, 115);

    // Top edge (right to left) — fruits with many leaves
    addItem('apple', 0.50, 1400, 55, 70);
    addItem('leaf', 0.53, 1320, 25, 105);
    addItem('leaf', 0.55, 1250, 50, 90);
    addItem('banana', 0.58, 1150, 45, 140);
    addItem('leaf', 0.60, 1080, 20, 110);
    addItem('leaf', 0.62, 1020, 55, 95);
    addItem('grapes', 0.65, 920, 50, 65);
    addItem('leaf', 0.68, 840, 25, 100);
    addItem('leaf', 0.70, 770, 45, 120);
    addItem('flower', 0.73, 660, 40, 70);
    addItem('leaf', 0.76, 580, 20, 105);
    addItem('leaf', 0.78, 510, 50, 90);
    addItem('apple', 0.81, 420, 45, 65);
    addItem('leaf', 0.84, 350, 25, 110);
    addItem('leaf', 0.86, 280, 50, 95);
    addItem('leaf', 0.89, 200, 20, 100);
    addItem('leaf', 0.91, 160, 45, 90);

    // Additional foliage (interleaved)
    addItem('leaf', 0.03, 1855, 960, 95);
    addItem('leaf', 0.07, 1865, 840, 105);
    addItem('leaf', 0.10, 1835, 730, 100);
    addItem('leaf', 0.14, 1850, 640, 115);
    addItem('leaf', 0.17, 1840, 540, 90);
    addItem('leaf', 0.20, 1855, 440, 105);
    addItem('leaf', 0.24, 1835, 370, 100);
    addItem('leaf', 0.27, 1865, 300, 110);
    addItem('leaf', 0.31, 1845, 220, 95);
    addItem('leaf', 0.35, 1855, 150, 105);
    addItem('leaf', 0.39, 1860, 90, 100);
    addItem('leaf', 0.43, 1650, 40, 110);
    addItem('leaf', 0.46, 1560, 55, 95);
    addItem('leaf', 0.49, 1450, 30, 105);
    addItem('leaf', 0.52, 1360, 50, 100);
    addItem('leaf', 0.54, 1290, 25, 110);
    addItem('leaf', 0.57, 1200, 55, 95);
    addItem('leaf', 0.59, 1110, 30, 105);
    addItem('leaf', 0.61, 1050, 45, 100);
    addItem('leaf', 0.64, 970, 25, 110);
    addItem('leaf', 0.67, 880, 50, 95);
    addItem('leaf', 0.69, 800, 30, 105);
    addItem('leaf', 0.72, 710, 45, 100);
    addItem('leaf', 0.75, 620, 30, 110);
    addItem('leaf', 0.77, 550, 55, 95);
    addItem('leaf', 0.80, 460, 25, 105);
    addItem('leaf', 0.83, 390, 50, 100);
    addItem('leaf', 0.88, 240, 30, 105);

    // Culminating heart at top-left
    addItem('heart', 1.0, 120, 60, 280);

    placements.sort((a, b) => a.t - b.t);
    return placements;
}

function drawApple(
    rc: ReturnType<typeof rough.svg>,
    cx: number, cy: number, size: number, seed: number,
): SVGGElement {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const r = size * 0.4;

    // Shadow layer
    const shadow = rc.circle(cx + 4, cy + 4, r * 2, {
        roughness: 0.8, stroke: 'none', strokeWidth: 0, fill: '#b91c1c', fillStyle: 'solid', seed: seed + 99,
    });
    g.appendChild(shadow);

    // Main body
    const apple = rc.circle(cx, cy, r * 2, {
        roughness: 1.0, stroke: OUTLINE_BLACK, strokeWidth: OUTLINE_WIDTH, fill: '#ef4444', fillStyle: 'solid', seed,
    });
    g.appendChild(apple);

    // Highlight
    const hlPath = `M${cx - r * 0.35},${cy - r * 0.3} C${cx - r * 0.4},${cy - r * 0.55} ${cx - r * 0.15},${cy - r * 0.6} ${cx - r * 0.05},${cy - r * 0.4}`;
    const hl = rc.path(hlPath, { roughness: 0.6, stroke: '#fff', strokeWidth: 3, fill: 'none', seed: seed + 1 });
    g.appendChild(hl);

    // Stem
    const stem = rc.line(cx, cy - r * 0.85, cx + r * 0.1, cy - r * 1.3, {
        roughness: 1.0, stroke: '#854d0e', strokeWidth: 3, seed: seed + 2,
    });
    g.appendChild(stem);

    // Small leaf
    const leafPath = `M${cx + r * 0.1},${cy - r * 1.2} C${cx + r * 0.5},${cy - r * 1.5} ${cx + r * 0.7},${cy - r * 0.9} ${cx + r * 0.3},${cy - r * 0.85}`;
    const leaf = rc.path(leafPath, {
        roughness: 1.0, stroke: OUTLINE_BLACK, strokeWidth: 2, fill: '#22c55e', fillStyle: 'solid', seed: seed + 3,
    });
    g.appendChild(leaf);

    return g;
}

function drawBanana(
    rc: ReturnType<typeof rough.svg>,
    cx: number, cy: number, size: number, seed: number,
): SVGGElement {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const s = size * 0.4;

    // Three bananas fanning from a common stem point
    const offsets = [
        { dx: -s * 0.25, dy: s * 0.05, angle: -15 },
        { dx: 0,          dy: 0,          angle: 0 },
        { dx: s * 0.25,  dy: s * 0.05, angle: 15 },
    ];

    offsets.forEach((off, i) => {
        const bx = cx + off.dx;
        const by = cy + off.dy;

        // Shadow
        const shadowPath = `M${bx - s * 0.4 + 3},${by + s * 0.1 + 3} C${bx - s * 0.3 + 3},${by - s * 0.45 + 3} ${bx + s * 0.3 + 3},${by - s * 0.5 + 3} ${bx + s * 0.45 + 3},${by - s * 0.05 + 3} C${bx + s * 0.3 + 3},${by - s * 0.25 + 3} ${bx - s * 0.15 + 3},${by - s * 0.2 + 3} ${bx - s * 0.4 + 3},${by + s * 0.1 + 3} Z`;
        const shadow = rc.path(shadowPath, {
            roughness: 0.8, stroke: 'none', fill: '#d97706', fillStyle: 'solid',
            seed: seed + 50 + i,
        });
        g.appendChild(shadow);

        // Main crescent
        const bananaPath = `M${bx - s * 0.4},${by + s * 0.1} C${bx - s * 0.3},${by - s * 0.45} ${bx + s * 0.3},${by - s * 0.5} ${bx + s * 0.45},${by - s * 0.05} C${bx + s * 0.3},${by - s * 0.25} ${bx - s * 0.15},${by - s * 0.2} ${bx - s * 0.4},${by + s * 0.1} Z`;
        const banana = rc.path(bananaPath, {
            roughness: 1.0, stroke: OUTLINE_BLACK, strokeWidth: OUTLINE_WIDTH * 0.8,
            fill: '#fbbf24', fillStyle: 'solid', seed: seed + i,
        });

        // Apply fan rotation
        if (off.angle !== 0) {
            banana.setAttribute('transform', `rotate(${off.angle} ${cx} ${cy})`);
            shadow.setAttribute('transform', `rotate(${off.angle} ${cx} ${cy})`);
        }

        g.appendChild(banana);
    });

    // Highlight on center banana
    const hlPath = `M${cx - s * 0.2},${cy - s * 0.15} C${cx - s * 0.1},${cy - s * 0.35} ${cx + s * 0.08},${cy - s * 0.37} ${cx + s * 0.15},${cy - s * 0.25}`;
    const hl = rc.path(hlPath, {
        roughness: 0.6, stroke: '#fff', strokeWidth: 2.5, fill: 'none', seed: seed + 10,
    });
    g.appendChild(hl);

    return g;
}

function drawGrapes(
    rc: ReturnType<typeof rough.svg>,
    cx: number, cy: number, size: number, seed: number,
): SVGGElement {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const r = size * 0.13;

    // Pyramid: 3 top, 2 middle, 1 bottom (front grape)
    const positions: [number, number][] = [
        [-r * 1.2, -r * 2.0],
        [0, -r * 2.0],
        [r * 1.2, -r * 2.0],
        [-r * 0.6, -r * 0.5],
        [r * 0.6, -r * 0.5],
        [0, r * 1.0],
    ];

    // Shadow grapes
    positions.forEach(([ox, oy], i) => {
        const shadow = rc.circle(cx + ox + 3, cy + oy + 3, r * 2, {
            roughness: 0.6, stroke: 'none', fill: '#6d28d9', fillStyle: 'solid', seed: seed + 50 + i,
        });
        g.appendChild(shadow);
    });

    // Main grapes with black outlines
    positions.forEach(([ox, oy], i) => {
        const grape = rc.circle(cx + ox, cy + oy, r * 2, {
            roughness: 1.0, stroke: OUTLINE_BLACK, strokeWidth: OUTLINE_WIDTH * 0.8, fill: '#8b5cf6', fillStyle: 'solid', seed: seed + i,
        });
        g.appendChild(grape);
    });

    // Stem
    const stem = rc.line(cx, cy - r * 2.0 - r, cx, cy - r * 2.0 - r * 2.5, {
        roughness: 1.0, stroke: '#16a34a', strokeWidth: 3, seed: seed + 20,
    });
    g.appendChild(stem);

    // Leaf at stem
    const leafPath = `M${cx},${cy - r * 2.0 - r * 2.5} C${cx + r * 2},${cy - r * 2.0 - r * 4} ${cx + r * 3},${cy - r * 2.0 - r * 1.5} ${cx + r * 0.8},${cy - r * 2.0 - r * 1.0}`;
    const leaf = rc.path(leafPath, {
        roughness: 1.0, stroke: OUTLINE_BLACK, strokeWidth: 2, fill: '#22c55e', fillStyle: 'solid', seed: seed + 21,
    });
    g.appendChild(leaf);

    return g;
}

function drawFlower(
    rc: ReturnType<typeof rough.svg>,
    cx: number, cy: number, size: number, seed: number,
): SVGGElement {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const petalCount = 6;
    const petalR = size * 0.2;
    const petalDist = size * 0.3;

    // Petals with black outlines
    for (let p = 0; p < petalCount; p++) {
        const angle = (p / petalCount) * Math.PI * 2;
        const px = cx + Math.cos(angle) * petalDist;
        const py = cy + Math.sin(angle) * petalDist;

        const petal = rc.circle(px, py, petalR * 2, {
            roughness: 1.0, stroke: OUTLINE_BLACK, strokeWidth: OUTLINE_WIDTH * 0.8, fill: 'white', fillStyle: 'solid', seed: seed + p,
        });
        g.appendChild(petal);
    }

    // Orange center with black outline
    const center = rc.circle(cx, cy, size * 0.26, {
        roughness: 0.8, stroke: OUTLINE_BLACK, strokeWidth: OUTLINE_WIDTH, fill: '#fb923c', fillStyle: 'solid', seed: seed + 10,
    });
    g.appendChild(center);

    return g;
}

function drawHeart(
    rc: ReturnType<typeof rough.svg>,
    cx: number, cy: number, size: number, seed: number,
    isLarge: boolean,
): SVGGElement {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const s = size * (isLarge ? 0.45 : 0.35);

    const heartPath =
        `M${cx},${cy + s * 0.4} ` +
        `C${cx},${cy + s * 0.4} ${cx - s * 0.7},${cy + s * 0.05} ${cx - s * 0.7},${cy - s * 0.2} ` +
        `C${cx - s * 0.7},${cy - s * 0.55} ${cx - s * 0.2},${cy - s * 0.65} ${cx},${cy - s * 0.25} ` +
        `C${cx + s * 0.2},${cy - s * 0.65} ${cx + s * 0.7},${cy - s * 0.55} ${cx + s * 0.7},${cy - s * 0.2} ` +
        `C${cx + s * 0.7},${cy + s * 0.05} ${cx},${cy + s * 0.4} ${cx},${cy + s * 0.4} Z`;

    // Shadow
    const shadowPath =
        `M${cx + 3},${cy + s * 0.4 + 3} ` +
        `C${cx + 3},${cy + s * 0.4 + 3} ${cx - s * 0.7 + 3},${cy + s * 0.05 + 3} ${cx - s * 0.7 + 3},${cy - s * 0.2 + 3} ` +
        `C${cx - s * 0.7 + 3},${cy - s * 0.55 + 3} ${cx - s * 0.2 + 3},${cy - s * 0.65 + 3} ${cx + 3},${cy - s * 0.25 + 3} ` +
        `C${cx + s * 0.2 + 3},${cy - s * 0.65 + 3} ${cx + s * 0.7 + 3},${cy - s * 0.55 + 3} ${cx + s * 0.7 + 3},${cy - s * 0.2 + 3} ` +
        `C${cx + s * 0.7 + 3},${cy + s * 0.05 + 3} ${cx + 3},${cy + s * 0.4 + 3} ${cx + 3},${cy + s * 0.4 + 3} Z`;
    const shadow = rc.path(shadowPath, {
        roughness: 0.8, stroke: 'none', fill: '#C9184A', fillStyle: 'solid', seed: seed + 99,
    });
    g.appendChild(shadow);

    // Main heart
    const heart = rc.path(heartPath, {
        roughness: isLarge ? 1.2 : 1.0, stroke: OUTLINE_BLACK, strokeWidth: OUTLINE_WIDTH, fill: '#FF4D6D', fillStyle: 'solid', seed,
    });
    g.appendChild(heart);

    // Highlight arc on upper-left lobe
    const hlPath = `M${cx - s * 0.35},${cy - s * 0.25} C${cx - s * 0.4},${cy - s * 0.42} ${cx - s * 0.2},${cy - s * 0.5} ${cx - s * 0.1},${cy - s * 0.35}`;
    const hl = rc.path(hlPath, { roughness: 0.6, stroke: '#fff', strokeWidth: 3, fill: 'none', seed: seed + 1 });
    g.appendChild(hl);

    if (isLarge) {
        // Eyes
        const eyeL = rc.circle(cx - s * 0.2, cy - s * 0.05, s * 0.08, {
            roughness: 0.5, stroke: OUTLINE_BLACK, strokeWidth: 1, fill: OUTLINE_BLACK, fillStyle: 'solid', seed: seed + 10,
        });
        const eyeR = rc.circle(cx + s * 0.2, cy - s * 0.05, s * 0.08, {
            roughness: 0.5, stroke: OUTLINE_BLACK, strokeWidth: 1, fill: OUTLINE_BLACK, fillStyle: 'solid', seed: seed + 11,
        });
        g.appendChild(eyeL);
        g.appendChild(eyeR);

        // Smile
        const smilePath = `M${cx - s * 0.15},${cy + s * 0.1} Q${cx},${cy + s * 0.25} ${cx + s * 0.15},${cy + s * 0.1}`;
        const smile = rc.path(smilePath, {
            roughness: 0.8, stroke: OUTLINE_BLACK, strokeWidth: 2.5, fill: 'none', seed: seed + 12,
        });
        g.appendChild(smile);

        // Blush
        const blushL = rc.ellipse(cx - s * 0.35, cy + s * 0.05, s * 0.1, s * 0.05, {
            roughness: 0.5, stroke: 'none', fill: '#FFB3C6', fillStyle: 'solid', seed: seed + 13,
        });
        const blushR = rc.ellipse(cx + s * 0.35, cy + s * 0.05, s * 0.1, s * 0.05, {
            roughness: 0.5, stroke: 'none', fill: '#FFB3C6', fillStyle: 'solid', seed: seed + 14,
        });
        g.appendChild(blushL);
        g.appendChild(blushR);
    }

    return g;
}

function drawLeaf(
    rc: ReturnType<typeof rough.svg>,
    cx: number, cy: number, size: number, seed: number,
): SVGGElement {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const s = size;
    const variant = seed % 3;

    let leafPath: string;
    let veinPath: string;

    if (variant === 0) {
        // v0: Teardrop (original shape)
        leafPath =
            `M${cx},${cy} ` +
            `C${cx + s * 0.4},${cy - s * 0.55} ${cx + s * 0.6},${cy - s * 0.3} ${cx + s * 0.55},${cy - s * 0.45} ` +
            `C${cx + s * 0.5},${cy - s * 0.1} ${cx + s * 0.25},${cy + s * 0.15} ${cx},${cy} Z`;
        veinPath = `M${cx + s * 0.05},${cy - s * 0.02} L${cx + s * 0.4},${cy - s * 0.3}`;
    } else if (variant === 1) {
        // v1: Rounded oval (wider, more symmetrical)
        leafPath =
            `M${cx},${cy} ` +
            `C${cx + s * 0.25},${cy - s * 0.5} ${cx + s * 0.6},${cy - s * 0.55} ${cx + s * 0.5},${cy - s * 0.3} ` +
            `C${cx + s * 0.6},${cy - s * 0.05} ${cx + s * 0.3},${cy + s * 0.2} ${cx},${cy} Z`;
        veinPath = `M${cx + s * 0.05},${cy - s * 0.02} L${cx + s * 0.35},${cy - s * 0.22}`;
    } else {
        // v2: Pointed lance (narrow, elongated)
        leafPath =
            `M${cx},${cy} ` +
            `C${cx + s * 0.15},${cy - s * 0.4} ${cx + s * 0.25},${cy - s * 0.65} ${cx + s * 0.65},${cy - s * 0.55} ` +
            `C${cx + s * 0.25},${cy - s * 0.45} ${cx + s * 0.12},${cy - s * 0.1} ${cx},${cy} Z`;
        veinPath = `M${cx + s * 0.04},${cy - s * 0.02} L${cx + s * 0.48},${cy - s * 0.4}`;
    }

    const leaf = rc.path(leafPath, {
        roughness: 1.0, stroke: OUTLINE_BLACK, strokeWidth: OUTLINE_WIDTH * 0.8, fill: '#22c55e', fillStyle: 'solid', seed,
    });
    g.appendChild(leaf);

    // Center vein (darker)
    const vein = rc.path(veinPath, {
        roughness: 1.0, stroke: '#16a34a', strokeWidth: 2.5, fill: 'none', seed: seed + 1,
    });
    g.appendChild(vein);

    return g;
}

function generateVine() {
    if (!svgRef.value) return;

    const rc = rough.svg(svgRef.value);
    const vineGroup = svgRef.value.querySelector('.vine-main') as SVGGElement;
    const fruitGroup = svgRef.value.querySelector('.vine-fruits') as SVGGElement;
    if (!vineGroup || !fruitGroup) return;

    const rng = mulberry32(789);

    // Layer 1: Black outline (widest)
    const vineOutline = rc.path(VINE_PATH, {
        roughness: 1.8, stroke: '#1a1a1a', strokeWidth: 54,
        fill: 'none', seed: 40,
    });
    vineOutline.classList.add('vine-path');
    vineGroup.appendChild(vineOutline);

    // Layer 2: Main green fill
    const vineFill = rc.path(VINE_PATH, {
        roughness: 2.0, stroke: '#16a34a', strokeWidth: 36,
        fill: 'none', seed: 42,
    });
    vineFill.classList.add('vine-path');
    vineGroup.appendChild(vineFill);

    // Layer 3: Lighter highlight center
    const vineHighlight = rc.path(VINE_PATH, {
        roughness: 2.2, stroke: '#22c55e', strokeWidth: 15,
        fill: 'none', seed: 84,
    });
    vineHighlight.classList.add('vine-path');
    vineGroup.appendChild(vineHighlight);

    // Secondary vine strand — helically intertwines with the main vine
    // Generate a path that weaves around the main vine
    const tempPathForHelix = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tempPathForHelix.setAttribute('d', VINE_PATH);
    svgRef.value!.appendChild(tempPathForHelix);
    const helixLen = tempPathForHelix.getTotalLength();

    // Build a weaving path by sampling the main vine and offsetting perpendicular
    const helixPoints: [number, number][] = [];
    const helixSegments = 120;
    const waveFreq = 0.015;
    const waveFreq2 = 0.037; // secondary frequency
    const waveAmp = 24;
    const waveAmp2 = 8; // secondary amplitude

    for (let i = 0; i <= helixSegments; i++) {
        const t = (i / helixSegments) * helixLen;
        const pt = tempPathForHelix.getPointAtLength(t);
        const ptNext = tempPathForHelix.getPointAtLength(Math.min(t + 2, helixLen));

        const dx = ptNext.x - pt.x;
        const dy = ptNext.y - pt.y;
        const mag = Math.sqrt(dx * dx + dy * dy) || 1;

        const nx = -dy / mag;
        const ny = dx / mag;

        const wave = Math.sin(t * waveFreq) * waveAmp + Math.sin(t * waveFreq2) * waveAmp2 + (rng() - 0.5) * 6;
        const px = pt.x + nx * wave;
        const py = pt.y + ny * wave;

        helixPoints.push([px, py]);
    }

    const helixD = catmullRomToBezier(helixPoints);

    svgRef.value!.removeChild(tempPathForHelix);

    // Draw the secondary vine strand (thinner, slightly different green)
    const helixOutline = rc.path(helixD, {
        roughness: 2.0, stroke: '#1a1a1a', strokeWidth: 28,
        fill: 'none', seed: 300,
    });
    helixOutline.classList.add('vine-path');
    vineGroup.appendChild(helixOutline);

    const helixFill = rc.path(helixD, {
        roughness: 2.2, stroke: '#15803d', strokeWidth: 20,
        fill: 'none', seed: 302,
    });
    helixFill.classList.add('vine-path');
    vineGroup.appendChild(helixFill);

    const helixHighlight = rc.path(helixD, {
        roughness: 2.4, stroke: '#4ade80', strokeWidth: 6,
        fill: 'none', seed: 304,
    });
    helixHighlight.classList.add('vine-path');
    vineGroup.appendChild(helixHighlight);

    // Thorns along the vine
    const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tempPath.setAttribute('d', VINE_PATH);
    svgRef.value!.appendChild(tempPath);
    const vineLen = tempPath.getTotalLength();

    for (let dist = 40; dist < vineLen; dist += 30 + rng() * 30) {
        const pt = tempPath.getPointAtLength(dist);
        const ptNext = tempPath.getPointAtLength(Math.min(dist + 5, vineLen));

        const dx = ptNext.x - pt.x;
        const dy = ptNext.y - pt.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;

        const side = (Math.floor(dist / 60) % 2 === 0) ? 1 : -1;
        const nx = (-dy / len) * side;
        const ny = (dx / len) * side;

        const thornLen = 20 + rng() * 18;
        const thornPath = `M${pt.x},${pt.y} L${pt.x + nx * thornLen},${pt.y + ny * thornLen}`;

        const thorn = rc.path(thornPath, {
            roughness: 0.8, stroke: '#16a34a', strokeWidth: 6,
            fill: 'none', seed: Math.floor(rng() * 10000),
        });
        thorn.classList.add('vine-path');
        vineGroup.appendChild(thorn);
    }

    svgRef.value!.removeChild(tempPath);

    // Small tendrils branching off the vine at intervals
    const tendrilPositions = [
        { x: 1878, y: 850, angle: 0.3, len: 90 },
        { x: 1872, y: 580, angle: -0.4, len: 82 },
        { x: 1880, y: 320, angle: 0.5, len: 97 },
        { x: 1870, y: 140, angle: -0.3, len: 75 },
        { x: 1750, y: 22, angle: -0.8, len: 82 },
        { x: 1300, y: 26, angle: -0.5, len: 75 },
        { x: 900, y: 22, angle: 0.6, len: 82 },
        { x: 600, y: 28, angle: -0.7, len: 75 },
        { x: 250, y: 24, angle: 0.5, len: 82 },
    ];

    tendrilPositions.forEach((t, i) => {
        const endX = t.x + Math.cos(t.angle) * t.len;
        const endY = t.y + Math.sin(t.angle) * t.len;
        // Curly tendril
        const ctrlX = t.x + Math.cos(t.angle + 0.8) * t.len * 0.7;
        const ctrlY = t.y + Math.sin(t.angle + 0.8) * t.len * 0.7;
        const tendrilPath = `M${t.x},${t.y} C${ctrlX},${ctrlY} ${endX + 5},${endY - 5} ${endX},${endY}`;
        const tendril = rc.path(tendrilPath, {
            roughness: 1.3,
            stroke: '#22c55e',
            strokeWidth: 5,
            fill: 'none',
            seed: 200 + i,
        });
        tendril.classList.add('vine-path');
        vineGroup.appendChild(tendril);
    });

    // Place fruits along the vine
    const fruits = computeFruitPlacements(rng);

    fruits.forEach((fruit, i) => {
        let fruitSvg: SVGGElement;

        switch (fruit.type) {
            case 'banana':
                fruitSvg = drawBanana(rc, fruit.x, fruit.y, fruit.size, fruit.seed);
                break;
            case 'grapes':
                fruitSvg = drawGrapes(rc, fruit.x, fruit.y, fruit.size, fruit.seed);
                break;
            case 'apple':
                fruitSvg = drawApple(rc, fruit.x, fruit.y, fruit.size, fruit.seed);
                break;
            case 'flower':
                fruitSvg = drawFlower(rc, fruit.x, fruit.y, fruit.size, fruit.seed);
                break;
            case 'heart': {
                const isLarge = i === fruits.length - 1; // Last one is the culminating heart
                fruitSvg = drawHeart(rc, fruit.x, fruit.y, fruit.size, fruit.seed, isLarge);
                break;
            }
            case 'leaf':
                fruitSvg = drawLeaf(rc, fruit.x, fruit.y, fruit.size, fruit.seed);
                break;
            default:
                return;
        }

        fruitSvg.classList.add('fruit-item');
        fruitSvg.setAttribute('data-t', String(fruit.t));
        fruitSvg.setAttribute('data-rotation', String(fruit.rotation));
        fruitSvg.style.transformOrigin = `${fruit.x}px ${fruit.y}px`;

        if (!reducedMotion) {
            fruitSvg.style.opacity = '0';
            fruitSvg.style.transform = 'scale(0)';
        } else {
            fruitSvg.style.transform = `rotate(${fruit.rotation}deg)`;
        }

        fruitGroup.appendChild(fruitSvg);
    });

    // Animate
    if (!reducedMotion) {
        animateGrowth(fruits);
    }
}

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
    generateVine();
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
