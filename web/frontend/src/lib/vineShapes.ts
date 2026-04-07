import rough from 'roughjs';

export const OUTLINE_BLACK = '#1a1a1a';
export const OUTLINE_WIDTH = 4;

export type FruitType = 'banana' | 'grapes' | 'apple' | 'flower' | 'heart' | 'leaf';

export interface FruitPlacement {
    type: FruitType;
    /** 0-1 position along vine path */
    t: number;
    x: number;
    y: number;
    size: number;
    seed: number;
    rotation: number; // degrees, ±15
}

export function computeFruitPlacements(rng: () => number): FruitPlacement[] {
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

export function drawApple(
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

export function drawBanana(
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

export function drawGrapes(
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

export function drawFlower(
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

export function drawHeart(
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

export function drawLeaf(
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
